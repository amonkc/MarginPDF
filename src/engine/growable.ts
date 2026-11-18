/** Largest size a file buffer may reach (4 GB − 1, the wasm32 address-space limit). */
const MAX_BYTES = 4294967295;

/** ES2024 resizable ArrayBuffer members (the project's lib is ES2022, which doesn't declare them). */
type MaybeResizable = ArrayBuffer & { readonly resizable?: boolean; readonly maxByteLength?: number; resize?(newLength: number): void };
/** The ArrayBuffer constructor with the ES2024 `maxByteLength` option. */
type ResizableArrayBufferCtor = { new (length: number, options?: { maxByteLength: number }): ArrayBuffer; prototype: MaybeResizable };

/**
 * Allocate an ArrayBuffer of `size` bytes that can grow in place (resizable ArrayBuffer) where supported.
 * Tries the preferred maximum first, then smaller reservations; falls back to a fixed-size buffer.
 */
function allocBuffer(size: number, preferredMax: number): ArrayBuffer {
  const AB = ArrayBuffer as ResizableArrayBufferCtor;
  if (typeof AB.prototype.resize == "function") {
    for (const candidate of [preferredMax, size * 2 + (64 << 20), size + (256 << 20), size + (16 << 20)]) {
      const maxByteLength = Math.min(MAX_BYTES, Math.max(size, candidate));
      try {
        return new AB(size, { maxByteLength });
      } catch {
      }
    }
  }
  return new ArrayBuffer(size);
}

/** A byte buffer holding the PDF file that can be appended to / overwritten without copying on every write. */
class Growable {
  buf: ArrayBuffer;
  len: number;
  /** Lowest offset written since the session store last copied this buffer (see session.ts). */
  lowWater = 0;
  constructor(buf: ArrayBuffer, len: number) {
    this.buf = buf;
    this.len = len;
  }
  /** Copy `bytes` into a new growable buffer. */
  static from(bytes: Uint8Array): Growable {
    const buf = allocBuffer(bytes.length, bytes.length * 2 + 67108864);
    new Uint8Array(buf, 0, bytes.length).set(bytes);
    return new Growable(buf, bytes.length);
  }
  /** Stream a File into a new growable buffer. */
  static async fromFile(file: Blob): Promise<Growable> {
    if (file.size > MAX_BYTES) throw new Error("Files over 4 GB can’t be opened");
    const buf = allocBuffer(file.size, file.size * 2 + (64 << 20)), target = new Uint8Array(buf, 0, file.size);
    let offset = 0;
    const reader = file.stream().getReader();
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      target.set(value.subarray(0, Math.max(0, file.size - offset)), offset);
      offset += value.length;
    }
    if (offset !== file.size) throw new Error("The file changed while it was being read");
    return new Growable(buf, file.size);
  }
  /** The first `length` bytes (default: the whole file) as a view, not a copy. */
  view(length: number = this.len): Uint8Array {
    return new Uint8Array(this.buf, 0, length);
  }
  /** Write `bytes` at `offset`, growing the buffer if needed; the file length becomes `offset + bytes.length`. */
  writeAt(offset: number, bytes: Uint8Array): void {
    const end = offset + bytes.length;
    if (end > MAX_BYTES) throw new Error("This document has grown past 4 GB");
    const current: MaybeResizable = this.buf;
    if (end > current.byteLength) {
      if (current.resizable && end <= current.maxByteLength!) {
        // grow in place, at least 1 MB at a time (resizable buffers always have resize / maxByteLength)
        current.resize!(Math.min(current.maxByteLength!, Math.max(end, current.byteLength + (1 << 20))));
      } else {
        const next: MaybeResizable = allocBuffer(end, end * 2 + 67108864);
        new Uint8Array(next, 0, offset).set(new Uint8Array(this.buf, 0, offset));
        if (next.byteLength < end) next.resize?.(end);
        this.buf = next;
      }
    }
    new Uint8Array(this.buf, offset, bytes.length).set(bytes);
    this.len = end;
    this.lowWater = Math.min(this.lowWater, offset);
  }
}

export { Growable };
