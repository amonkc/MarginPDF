const Kr = /* @__PURE__ */ new Map();
function Cr(u) {
  let n = Kr.get(u);
  return n || (n = dl(u), Kr.set(u, n), n.catch(() => Kr.delete(u))), n.then((t) => t.slice(0));
}
async function dl(u) {
  const n = [...document.querySelectorAll('script[type="application/x-margin-asset"]')].find((e) => e.dataset.name === u);
  if (n) {
    const e = atob((n.textContent || "").trim()), r = new Uint8Array(e.length);
    for (let a = 0; a < e.length; a++) r[a] = e.charCodeAt(a);
    const o = new Blob([r]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(o).arrayBuffer();
  }
  const t = await fetch(u);
  if (!t.ok) throw new Error(`${u} could not be loaded (${t.status})`);
  return t.arrayBuffer();
}

export { Cr };
