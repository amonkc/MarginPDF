// Spotting a damaged PDF. PDFium recovers files whose cross-reference index is broken by scanning them, so such
// files open fine in Margin; but saving one with only an update appended would leave it damaged for other apps.
// Margin's saves rewrite the whole file (App.exportBytes), which is what repairs it.

const latin1 = (bytes: Uint8Array, from: number, to: number): string => {
  let s = "";
  for (let i = Math.max(0, from); i < Math.min(bytes.length, to); i++) s += String.fromCharCode(bytes[i]);
  return s;
};

/**
 * Why a PDF's structure looks damaged, or null if it looks sound: no "%PDF-" header near the start, no "%%EOF"
 * near the end, or a "startxref" offset that doesn’t point at a cross-reference table or stream. Reads only
 * the first kilobyte, the last 8 KB and a few bytes at the offset.
 */
function damageOf(bytes: Uint8Array): string | null {
  if (!latin1(bytes, 0, 1024).includes("%PDF-")) return "it has no PDF header";
  const tail = latin1(bytes, bytes.length - 8192, bytes.length);
  if (!tail.includes("%%EOF")) return "its end is missing (the file may be cut off)";
  const match = /startxref\s+(\d+)\s+%%EOF/.exec(tail.slice(tail.lastIndexOf("startxref")));
  if (!match) return "its index is missing";
  const offset = +match[1], at = latin1(bytes, offset, offset + 40);
  if (offset >= bytes.length || !/^\s*(xref|\d+\s+\d+\s+obj)/.test(at)) return "its index points to the wrong place";
  return null;
}

export { damageOf };
