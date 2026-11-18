// Cross-window clipboard for pages and objects. The latest copy is kept in IndexedDB (so other Margin
// windows/tabs of the same origin can paste it) and announced over a BroadcastChannel. A copy of the
// last clip made in this window is also kept in memory as a fallback when IndexedDB is unavailable.

import type { ClipObj, Rect } from '../engine/types';

/** Pages copied with "Copy pages": a standalone PDF holding them. */
export type PageClip = { id: string; bytes: Uint8Array; pages: number; from: string; at: number; [k: string]: unknown };
/** Annotations/images copied with Ctrl+C. */
export type ObjClip = {
  id: string;
  items: ClipObj[];
  bounds: Rect;
  count: number;
  from: string;
  src?: unknown;
  page: number;
  at: number;
  [k: string]: unknown;
};
/** Message posted on the channel when another window copies something. */
export type ClipMessage =
  | { kind: 'pages'; id: string; pages: number; from: string }
  | { kind: 'objects'; id: string; count: number; from: string };

const DB_NAME = "margin";
const STORE = "kv";
const PAGE_CLIP_KEY = "page-clip";
/** The last page clip copied in this window. */
let localPageClip: PageClip | null = null;
const channel: BroadcastChannel | null = (() => {
  try {
    return new BroadcastChannel("margin-pages");
  } catch {
    return null;
  }
})();

/** Opens (creating if needed) the key-value database; resolves to null when IndexedDB is unusable. */
function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Stores `value` under `key`; resolves to whether it was written. */
async function dbPut(key: string, value: unknown): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  const ok = await new Promise<boolean>((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
  db.close();
  return ok;
}

/** Reads `key`: undefined when the database can't be opened, null when the key is missing or the read fails. */
async function dbGet(key: string): Promise<any> {
  const db = await openDb();
  if (!db) return;
  const value = await new Promise((resolve) => {
    try {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  db.close();
  return value;
}

/** Saves copied pages for pasting here or in another window; resolves to whether they were shared via IndexedDB. */
async function putClip(clip: PageClip): Promise<boolean> {
  localPageClip = clip;
  const shared = await dbPut(PAGE_CLIP_KEY, clip);
  if (shared) channel?.postMessage({ kind: "pages", id: clip.id, pages: clip.pages, from: clip.from });
  return shared;
}

/** The most recent page clip from any window (or this window's own, whichever is newer). */
async function getClip(): Promise<PageClip | null> {
  const stored = await dbGet(PAGE_CLIP_KEY);
  return stored === undefined ? localPageClip : stored && (!localPageClip || stored.at >= localPageClip.at) ? stored : localPageClip;
}

/** Calls `listener` when another window copies pages. */
function onClip(listener: (msg: ClipMessage) => void): void {
  channel?.addEventListener("message", (event) => {
    if (event.data?.kind !== "objects") listener(event.data);
  });
}

const OBJ_CLIP_KEY = "obj-clip";
/** The last object clip copied in this window. */
let localObjClip: ObjClip | null = null;

/** Saves copied objects for pasting here or in another window; resolves to whether they were shared via IndexedDB. */
async function putObjClip(clip: ObjClip): Promise<boolean> {
  localObjClip = clip;
  const shared = await dbPut(OBJ_CLIP_KEY, clip);
  if (shared) channel?.postMessage({ kind: "objects", id: clip.id, count: clip.count, from: clip.from });
  return shared;
}

/** The most recent object clip from any window (or this window's own, whichever is newer). */
async function getObjClip(): Promise<ObjClip | null> {
  const stored = await dbGet(OBJ_CLIP_KEY);
  return stored === undefined ? localObjClip : stored && (!localObjClip || stored.at >= localObjClip.at) ? stored : localObjClip;
}

/** Text put on the system clipboard alongside an object copy, so a paste can find the matching clip. */
const objMarker = (clip: { count: number; from: string; id: string }): string =>
  `[Margin: ${clip.count} object${clip.count === 1 ? "" : "s"} from ${clip.from} · ${clip.id}]`;
/** The clip id in an object marker, or null when `text` isn't one. */
const objMarkerId = (text: string): string | null => /^\[Margin: \d+ objects? from .* · ([a-z0-9]+)\]$/.exec(text.trim())?.[1] ?? null;
/** Text put on the system clipboard alongside a page copy. */
const clipMarker = (clip: { pages: number; from: string; id: string }): string =>
  `[Margin: ${clip.pages} page${clip.pages === 1 ? "" : "s"} from ${clip.from} · ${clip.id}]`;
/** The clip id in a page marker, or null when `text` isn't one. */
const markerId = (text: string): string | null => /^\[Margin: \d+ pages? from .* · ([a-z0-9]+)\]$/.exec(text.trim())?.[1] ?? null;

export { getObjClip, getClip, onClip, clipMarker, objMarker, objMarkerId, putClip, putObjClip, markerId };
