import { stampAppearance } from '../engine/text';
import { toast } from './dom';
import type { Pt, RGBA } from '../engine/types';

/** A built-in stamp: settings key, the text drawn on it and its ink colour. */
export type StampDef = { key: string; label: string; color: RGBA };

const GREEN: RGBA = [22, 140, 82, 255];
const RED: RGBA = [196, 40, 40, 255];
const BLUE: RGBA = [37, 99, 235, 255];
const PURPLE: RGBA = [124, 77, 219, 255];

/** The stamps offered in the stamp picker, in menu order (the first is the fallback). */
const STAMPS: StampDef[] = [
  { key: "approved", label: "APPROVED", color: GREEN },
  { key: "rejected", label: "REJECTED", color: RED },
  { key: "draft", label: "DRAFT", color: BLUE },
  { key: "final", label: "FINAL", color: GREEN },
  { key: "confidential", label: "CONFIDENTIAL", color: RED },
  { key: "forcomment", label: "FOR COMMENT", color: BLUE },
  { key: "received", label: "RECEIVED", color: PURPLE },
  { key: "paid", label: "PAID", color: GREEN },
  { key: "void", label: "VOID", color: RED },
  { key: "th-copy", label: "สำเนาถูกต้อง", color: BLUE },
  { key: "th-approved", label: "อนุมัติ", color: GREEN },
  { key: "th-urgent", label: "ด่วน", color: RED },
  { key: "th-secret", label: "ลับ", color: RED },
];

/** The stamp chosen in settings: a built-in one, or the custom text (null when that text is empty). */
function currentStamp(app: any): { label: string; color: RGBA } | null {
  const settings = app.settings;
  if (settings.stamp === "custom") {
    const text = settings.stampCustom.trim();
    return text ? { label: text, color: settings.stampColor } : null;
  }
  return STAMPS.find((stamp) => stamp.key === settings.stamp) || STAMPS[0];
}

/** Date and time printed under a dated stamp, in the browser's locale. */
const stampDateText = () => (/* @__PURE__ */ new Date()).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Draws the current stamp centred on `at` on the given page, as one undoable step.
 * Returns the new annotation (whatever `Doc.addDrawnStamp` returns), or null if nothing was placed.
 */
async function placeStamp(app: any, page: { index: number }, at: Pt): Promise<any> {
  const stamp = currentStamp(app);
  if (!stamp) {
    toast("Type the custom stamp text first", "warn");
    return null;
  }
  const sub = app.settings.stampDated ? `${app.settings.author} · ${stampDateText()}` : undefined;
  let placed: any = null;
  await app.mutate("Stamp", { pages: [page.index] }, async () => {
    const drawn = await stampAppearance({ label: stamp.label, color: stamp.color, sub }, at);
    placed = app.doc.addDrawnStamp(page.index, drawn.rect, sub ? `${stamp.label} — ${sub}` : stamp.label, drawn.content, app.settings.author);
  }).catch((err: any) => toast(err.message, "err"));
  return placed;
}

export { STAMPS, placeStamp };
