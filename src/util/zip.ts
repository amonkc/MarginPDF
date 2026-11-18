/** CRC-32 (IEEE, reflected polynomial 0xEDB88320) lookup table. */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (data: Uint8Array): number => {
  let crc = 4294967295;
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]) & 255] ^ crc >>> 8;
  return (crc ^ 4294967295) >>> 0;
};

/** A file to put in a zip archive. */
export type ZipEntry = { name: string; data: Uint8Array };

/** Build an uncompressed ("stored") zip archive with UTF-8 names, timestamped now. */
function makeZip(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder(), localParts: Uint8Array[] = [], centralParts: Uint8Array[] = [];
  let offset = 0;
  const now = /* @__PURE__ */ new Date(),
    dosTime = now.getHours() << 11 | now.getMinutes() << 5 | now.getSeconds() >> 1,
    dosDate = now.getFullYear() - 1980 << 9 | now.getMonth() + 1 << 5 | now.getDate();
  for (const entry of entries) {
    const name = encoder.encode(entry.name), crc = crc32(entry.data), size = entry.data.length;
    // local file header
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 67324752, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 2048, true); // flag bit 11: UTF-8 names
    local.setUint16(8, 0, true); // stored
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true);
    local.setUint32(22, size, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    localParts.push(new Uint8Array(local.buffer), name, entry.data);
    // central directory header
    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 33639248, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 2048, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, dosTime, true);
    central.setUint16(14, dosDate, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, size, true);
    central.setUint32(24, size, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    centralParts.push(new Uint8Array(central.buffer), name);
    offset += 30 + name.length + size;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0), endRecord = new DataView(new ArrayBuffer(22));
  endRecord.setUint32(0, 101010256, true);
  endRecord.setUint16(8, entries.length, true);
  endRecord.setUint16(10, entries.length, true);
  endRecord.setUint32(12, centralSize, true);
  endRecord.setUint32(16, offset, true);
  const parts = [...localParts, ...centralParts, new Uint8Array(endRecord.buffer)], out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let pos = 0;
  for (const part of parts) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}

export { makeZip };
