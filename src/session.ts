// Keeps unsaved work through a refresh, a crash or a closed tab.
//
// While the document has unsaved changes, its file buffers and undo/redo history are mirrored into IndexedDB
// (database "margin-session"; the clipboard has its own, see ui/pageclip.ts), keyed by a per-tab session id kept in sessionStorage, so reloading the tab finds its own
// session. Each tab holds a Web Lock named after its session; a stored session whose lock nobody holds belongs
// to a tab that was closed or crashed, and is offered back the next time Margin opens.
//
// File buffers are append-only between full rewrites (see App.commit), so a buffer is stored as chunks keyed by
// their start offset: after an edit only the bytes from the lowest offset written since the last store
// (Growable.lowWater) are written again. Passwords are never stored: a protected document is kept without its
// undo history and asks for its password when it comes back; undo steps from before a password was removed are
// dropped.

import { Growable } from "./engine/growable";
import type { App, Change, Snapshot } from "./app";

const DB_NAME = "margin-session";
const SESSIONS = "sessions";
const CHUNKS = "chunks";
/** Wait after an edit before storing it (more edits in the meantime are stored together). */
const STORE_DELAY = 400;
/** Larger documents (with their history) aren't kept: copying them into storage would be too slow. */
const MAX_STORED = 300 * 1024 * 1024;
/** Sessions left behind by closed tabs are forgotten after this long. */
const MAX_AGE = 14 * 24 * 3600 * 1000;

type StoredSnap = { label?: string; buf: number; len: number; change?: Change };
/** What's stored per session, besides the chunks. */
export type SessionRecord = {
  sid: string;
  name: string;
  /** buffer id → length */
  bufs: Record<number, number>;
  buf: number;
  cur: number;
  undo: StoredSnap[];
  redo: StoredSnap[];
  page: number;
  mustRewrite: boolean;
  /** the document is encrypted (its password must be entered again) */
  locked: boolean;
  updated: number;
};
/** A stored session read back: the record and its file buffers. */
export type StoredSession = { record: SessionRecord; bufs: Map<number, Growable> };

/** Per buffer: its id in storage, the chunk starts stored for it, and how many bytes are stored. */
type BufState = { id: number; chunks: number[]; len: number };

const req = <T>(r: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
const done = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = tx.onabort = () => reject(tx.error || new Error("Storage failed"));
  });

function openDb(): Promise<IDBDatabase> {
  const r = indexedDB.open(DB_NAME, 1);
  r.onupgradeneeded = () => {
    r.result.createObjectStore(SESSIONS, { keyPath: "sid" });
    r.result.createObjectStore(CHUNKS);
  };
  return req(r);
}
const randomId = (): string => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
/** The items after the last one matching `test`. */
const after = <T>(list: T[], test: (item: T) => boolean): T[] => {
  let i = list.length;
  while (i > 0 && !test(list[i - 1])) i--;
  return list.slice(i);
};
const lockName = (sid: string): string => "margin-tab-" + sid;

class Session {
  app: App;
  sid = "";
  db: IDBDatabase | null = null;
  /** Stored file buffers of this tab's session. */
  bufs = new WeakMap<Growable, BufState>();
  nextBuf = 1;
  timer: ReturnType<typeof setTimeout> | null = null;
  /** The last store attempt (writes are serialised). */
  chain: Promise<void> = Promise.resolve();
  /** The last store failed (or the document was too large to keep): leaving would lose the unsaved changes. */
  failed = false;
  /** Shown once when a document is too large to keep. */
  onTooLarge: () => void = () => {};
  tooLargeShown = false;
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Opens storage and claims this tab's session id. Resolves to this tab's stored session (the tab was
   * reloaded) or null. Storage being unavailable (some private modes) just turns the feature off.
   */
  async start(): Promise<StoredSession | null> {
    try {
      this.db = await openDb();
    } catch {
      this.db = null;
      return null;
    }
    let sid: string | null = null;
    try {
      sid = sessionStorage.getItem("margin.sid");
    } catch {}
    // A duplicated tab copies sessionStorage; if the id is held by a live tab, start a new one.
    if (!sid || !(await this.claim(sid))) {
      sid = randomId();
      await this.claim(sid);
    }
    this.sid = sid;
    try {
      sessionStorage.setItem("margin.sid", sid);
    } catch {}
    this.app.on(() => this.schedule());
    addEventListener("pagehide", () => this.flush());
    addEventListener("visibilitychange", () => document.visibilityState === "hidden" && this.flush());
    return this.read(sid).catch(() => null);
  }

  /** Holds this tab's lock for as long as the tab lives; false if another tab holds it. */
  claim(sid: string): Promise<boolean> {
    if (!navigator.locks) return Promise.resolve(true);
    return new Promise((resolve) => {
      navigator.locks
        .request(lockName(sid), { ifAvailable: true }, (lock) => {
          resolve(!!lock);
          return lock ? new Promise<void>(() => {}) : undefined;
        })
        .catch(() => resolve(true));
    });
  }

  /**
   * The most recent session left by a tab that's no longer open (closed or crashed), if any. Sessions older than
   * two weeks are deleted.
   */
  async orphan(): Promise<SessionRecord | null> {
    if (!this.db) return null;
    try {
      const records = (await req(this.db.transaction(SESSIONS).objectStore(SESSIONS).getAll())) as SessionRecord[];
      const held = new Set(navigator.locks ? ((await navigator.locks.query()).held || []).map((l) => l.name) : []);
      const others = records.filter((r) => r.sid !== this.sid && !held.has(lockName(r.sid)));
      for (const r of others) if (Date.now() - r.updated > MAX_AGE) await this.remove(r.sid);
      return others.filter((r) => Date.now() - r.updated <= MAX_AGE).sort((a, b) => b.updated - a.updated)[0] || null;
    } catch {
      return null;
    }
  }

  /** Reads a stored session and its buffers. */
  async read(sid: string): Promise<StoredSession | null> {
    if (!this.db) return null;
    const tx = this.db.transaction([SESSIONS, CHUNKS]);
    const record = (await req(tx.objectStore(SESSIONS).get(sid))) as SessionRecord | undefined;
    if (!record) return null;
    const range = IDBKeyRange.bound([sid], [sid, []]);
    const [keys, values] = await Promise.all([req(tx.objectStore(CHUNKS).getAllKeys(range)), req(tx.objectStore(CHUNKS).getAll(range))]);
    const bufs = new Map<number, Growable>();
    for (const [id, len] of Object.entries(record.bufs)) bufs.set(+id, Growable.from(new Uint8Array(len)));
    // Chunks come back ordered by [sid, buffer, start]: later starts overwrite the stale tails of earlier ones.
    keys.forEach((key, i) => {
      const [, id, start] = key as [string, number, number], buf = bufs.get(id);
      if (!buf || start >= buf.len) return;
      const bytes = new Uint8Array(values[i] as ArrayBuffer);
      buf.view().set(bytes.subarray(0, buf.len - start), start);
    });
    return { record, bufs };
  }

  /** Takes over a stored session as this tab's: its buffers count as stored, and the old record is dropped. */
  async adopt(stored: StoredSession): Promise<void> {
    const { record, bufs } = stored;
    if (record.sid === this.sid) {
      // Same tab: the chunks are already there; remember them so only new bytes are written.
      const tx = this.db!.transaction(CHUNKS), keys = (await req(tx.objectStore(CHUNKS).getAllKeys(IDBKeyRange.bound([this.sid], [this.sid, []])))) as [string, number, number][];
      for (const [id, buf] of bufs) {
        this.bufs.set(buf, { id, chunks: keys.filter((k) => k[1] === id).map((k) => k[2]), len: buf.len });
        buf.lowWater = buf.len;
        this.nextBuf = Math.max(this.nextBuf, id + 1);
      }
    } else {
      await this.remove(record.sid);
    }
  }

  /** Forgets a stored session. */
  async remove(sid: string): Promise<void> {
    if (!this.db) return;
    const tx = this.db.transaction([SESSIONS, CHUNKS], "readwrite");
    tx.objectStore(SESSIONS).delete(sid);
    tx.objectStore(CHUNKS).delete(IDBKeyRange.bound([sid], [sid, []]));
    await done(tx);
  }

  /** Stores the current state shortly (called on every change). */
  schedule(): void {
    if (!this.db) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), STORE_DELAY);
  }

  /** Whether leaving now would lose unsaved changes (storage unavailable, or the last store failed). */
  get atRisk(): boolean {
    return this.app.dirty && (!this.db || this.failed);
  }

  /** Stores the current state now (its bytes are taken synchronously, then written in one transaction). */
  flush(): Promise<void> {
    if (!this.db || !this.timer) return this.chain;
    clearTimeout(this.timer);
    this.timer = null;
    let write: (() => Promise<void>) | null;
    try {
      write = this.prepare();
    } catch {
      write = null;
    }
    this.chain = this.chain.then(write || (() => {})).then(
      () => {
        this.failed = false;
      },
      () => {
        this.failed = true;
      },
    );
    return this.chain;
  }

  /** Captures what to store and returns the write, or null when there is nothing worth storing. */
  prepare(): (() => Promise<void>) | null {
    const app = this.app, sid = this.sid;
    if (!app.dirty || !app.doc) {
      this.bufs = new WeakMap();
      return () => this.remove(sid);
    }
    // Steps back to (or forward to) a password-protected state would need passwords, which aren't stored: keep
    // the history only as far as the nearest such step, and none for a document that's protected now.
    const locked = !!(app.password || app.ownerPassword),
      protectedStep = (s: Snapshot) => !!(s.pw || s.owner);
    const undo = locked ? [] : after(app.undoStack, protectedStep);
    const redo = locked ? [] : after(app.redoStack, protectedStep);
    let history: Snapshot[] = [...undo, ...redo];
    const sizeOf = (snaps: Snapshot[]) => [...new Set([app.file, ...snaps.map((s) => s.file)])].reduce((n, b) => n + b.len, 0);
    if (sizeOf(history) > MAX_STORED) history = [];
    if (sizeOf(history) > MAX_STORED) {
      if (!this.tooLargeShown) {
        this.tooLargeShown = true;
        this.onTooLarge();
      }
      this.bufs = new WeakMap();
      return () => this.remove(sid).then(() => Promise.reject(new Error("too large")));
    }
    const live = [...new Set([app.file, ...history.map((s) => s.file)])];
    const puts: [IDBValidKey, ArrayBuffer][] = [], drops: IDBKeyRange[] = [], ids: Record<number, number> = {};
    for (const buf of live) {
      let state = this.bufs.get(buf);
      if (!state) this.bufs.set(buf, (state = { id: this.nextBuf++, chunks: [], len: 0 }));
      const from = Math.min(buf.lowWater, state.len, buf.len);
      if (from < buf.len || buf.len < state.len) {
        if (from < buf.len) puts.push([[sid, state.id, from], buf.view().slice(from).buffer]);
        drops.push(IDBKeyRange.bound([sid, state.id, from], [sid, state.id, Infinity], true));
        state.chunks = [...state.chunks.filter((c) => c < from), from];
      }
      buf.lowWater = buf.len;
      state.len = buf.len;
      ids[state.id] = buf.len;
    }
    const idOf = (b: Growable) => this.bufs.get(b)!.id;
    const snap = (s: Snapshot): StoredSnap => ({ label: s.label, buf: idOf(s.file), len: s.len, change: s.change });
    const record: SessionRecord = {
      sid,
      name: app.fileName,
      bufs: ids,
      buf: idOf(app.file),
      cur: app.cur,
      undo: undo.filter((s) => history.includes(s)).map(snap),
      redo: redo.filter((s) => history.includes(s)).map(snap),
      page: app.currentPage,
      mustRewrite: app.mustRewrite,
      locked: !!(app.password || app.ownerPassword),
      updated: Date.now(),
    };
    return async () => {
      const tx = this.db!.transaction([SESSIONS, CHUNKS], "readwrite"), chunks = tx.objectStore(CHUNKS);
      // Buffers no longer referenced (history trimmed, or a full rewrite) go.
      const keys = (await req(chunks.getAllKeys(IDBKeyRange.bound([sid], [sid, []])))) as [string, number, number][];
      for (const id of new Set(keys.map((k) => k[1]))) if (!(id in ids)) chunks.delete(IDBKeyRange.bound([sid, id], [sid, id, []]));
      for (const range of drops) chunks.delete(range);
      for (const [key, bytes] of puts) chunks.put(bytes, key);
      tx.objectStore(SESSIONS).put(record);
      await done(tx);
    };
  }
}

export { Session };
