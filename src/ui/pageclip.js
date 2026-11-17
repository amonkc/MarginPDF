const ru = "margin";
const Ln = "kv";
const Ts = "page-clip";
let Yn = null;
const Io = (() => {
  try {
    return new BroadcastChannel("margin-pages");
  } catch {
    return null;
  }
})();
function Os() {
  return new Promise((u) => {
    try {
      const n = indexedDB.open(ru, 1);
      n.onupgradeneeded = () => {
        n.result.objectStoreNames.contains(Ln) || n.result.createObjectStore(Ln);
      }, n.onsuccess = () => u(n.result), n.onerror = () => u(null), n.onblocked = () => u(null);
    } catch {
      u(null);
    }
  });
}
async function Rs(u, n) {
  const t = await Os();
  if (!t) return false;
  const e = await new Promise((r) => {
    try {
      const o = t.transaction(Ln, "readwrite");
      o.objectStore(Ln).put(n, u), o.oncomplete = () => r(true), o.onerror = () => r(false), o.onabort = () => r(false);
    } catch {
      r(false);
    }
  });
  return t.close(), e;
}
async function Is(u) {
  const n = await Os();
  if (!n) return;
  const t = await new Promise((e) => {
    try {
      const r = n.transaction(Ln, "readonly").objectStore(Ln).get(u);
      r.onsuccess = () => e(r.result || null), r.onerror = () => e(null);
    } catch {
      e(null);
    }
  });
  return n.close(), t;
}
async function ou(u) {
  Yn = u;
  const n = await Rs(Ts, u);
  return n && Io?.postMessage({ kind: "pages", id: u.id, pages: u.pages, from: u.from }), n;
}
async function Pr() {
  const u = await Is(Ts);
  return u === void 0 ? Yn : u && (!Yn || u.at >= Yn.at) ? u : Yn;
}
function au(u) {
  Io?.addEventListener("message", (n) => {
    n.data?.kind !== "objects" && u(n.data);
  });
}
const Ls = "obj-clip";
let Jn = null;
async function su(u) {
  Jn = u;
  const n = await Rs(Ls, u);
  return n && Io?.postMessage({ kind: "objects", id: u.id, count: u.count, from: u.from }), n;
}
async function Kn() {
  const u = await Is(Ls);
  return u === void 0 ? Jn : u && (!Jn || u.at >= Jn.at) ? u : Jn;
}
const iu = (u) => `[Margin: ${u.count} object${u.count === 1 ? "" : "s"} from ${u.from} · ${u.id}]`;
const lu = (u) => /^\[Margin: \d+ objects? from .* · ([a-z0-9]+)\]$/.exec(u.trim())?.[1] ?? null;
const cu = (u) => `[Margin: ${u.pages} page${u.pages === 1 ? "" : "s"} from ${u.from} · ${u.id}]`;
const uu = (u) => /^\[Margin: \d+ pages? from .* · ([a-z0-9]+)\]$/.exec(u.trim())?.[1] ?? null;

export { Kn, Pr, au, cu, iu, lu, ou, su, uu };
