#!/usr/bin/env python3
"""Builds the language fonts in public/fonts/ from the Noto sources (Google Fonts, OFL).

Usage: python3 scripts/make-fonts.py <folder with the downloaded sources> public/fonts

Sources (https://github.com/google/fonts/tree/main/ofl): NotoSans{SC,TC,JP,KR}[wght].ttf and
NotoSans{Devanagari,Bengali,Tamil,Telugu,Lao,Khmer,Myanmar}[wdth,wght].ttf.

- Every font is pinned to normal width; hinting is dropped (PDFs and HarfBuzz don't use it).
- Chinese, Japanese and Korean are cut down to the characters in everyday use, so a visitor downloads about
  1–2 MB instead of 10–18 MB: the national standard sets (GB 2312 for Simplified Chinese, Big5 level 1 for
  Traditional Chinese, JIS X 0208 for Japanese, every modern Hangul syllable plus KS X 1001 symbols for
  Korean), with Latin (pinyin tone marks included), kana, CJK punctuation and full-width forms. They are
  static Regular faces (bold is drawn synthetically).
- The other scripts keep all their glyphs and the weight axis (bold comes from it, like Noto Sans Thai).
"""
import io, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

def codec_set(codec, rows, cols=range(0xA1, 0xFF)):
    chars = set()
    for r in rows:
        for c in cols:
            try:
                chars.add(bytes([r, c]).decode(codec))
            except UnicodeDecodeError:
                pass
    return chars

def rng(a, b):
    return {chr(c) for c in range(a, b + 1)}

COMMON = (rng(0x20, 0x7E) | rng(0xA0, 0x17F) | rng(0x1CD, 0x1DC)    # Latin-1, Latin Extended-A, pinyin ǎǐǒǔǖǘǚǜ
          | rng(0x2B9, 0x2DD) | rng(0x2000, 0x206F) | rng(0x20A0, 0x20BF) | rng(0x2100, 0x218F)
          | rng(0x2190, 0x21FF) | rng(0x2460, 0x24FF) | rng(0x25A0, 0x25FF) | rng(0x2600, 0x26FF)
          | rng(0x3000, 0x303F) | rng(0x3040, 0x30FF) | rng(0x31F0, 0x31FF) | rng(0xFF00, 0xFFEF))

CJK = {
    "SC": codec_set("gb2312", range(0xA1, 0xF8)),
    "TC": codec_set("big5", range(0xA1, 0xA4), range(0x40, 0xFF)) | codec_set("big5", range(0xA4, 0xC7), range(0x40, 0xFF)),
    "JP": codec_set("euc_jp", range(0xA1, 0xF5)),
    "KR": rng(0xAC00, 0xD7A3) | rng(0x3130, 0x318F) | codec_set("euc_kr", range(0xA1, 0xAD)),
}
OTHERS = ["Devanagari", "Bengali", "Tamil", "Telugu", "Lao", "Khmer", "Myanmar"]

def set_names(font, family, style):
    """Names for a static instance (the variable font's default names say Thin)."""
    name = font["name"]
    ps = family.replace(" ", "") + "-" + style
    for record in list(name.names):
        if record.nameID in (16, 17, 21, 22, 25):
            name.removeNames(nameID=record.nameID)
    for nid, value in ((1, family), (2, style), (3, ps), (4, f"{family} {style}"), (6, ps)):
        name.setName(value, nid, 3, 1, 0x409)
        name.setName(value, nid, 1, 0, 0)
    if "STAT" in font:
        del font["STAT"]

def options(keep_all):
    o = subset.Options()
    o.hinting = False
    o.desubroutinize = True
    o.layout_features = ["*"]
    o.name_IDs = ["*"]
    o.name_languages = ["*"]
    o.notdef_outline = True
    o.glyph_names = False
    o.drop_tables += ["DSIG"]
    return o

def build(src, out):
    os.makedirs(out, exist_ok=True)
    only = sys.argv[3:]  # optional: names to build, e.g. Lao Khmer
    for lang, chars in CJK.items():
        if only and lang not in only:
            continue
        font = TTFont(os.path.join(src, f"NotoSans{lang}[wght].ttf"))
        font = instantiateVariableFont(font, {"wght": 400})
        set_names(font, f"Noto Sans {lang}", "Regular")
        sub = subset.Subsetter(options(False))
        sub.populate(unicodes={ord(c) for c in chars | COMMON})
        sub.subset(font)
        path = os.path.join(out, f"NotoSans{lang}-Regular.ttf")
        font.save(path)
        print(path, os.path.getsize(path), len(font.getBestCmap()), "characters")
    for script in OTHERS:
        if only and script not in only:
            continue
        font = TTFont(os.path.join(src, f"NotoSans{script}[wdth,wght].ttf"))
        font = instantiateVariableFont(font, {"wdth": 100})
        buf = io.BytesIO()
        font.save(buf)  # reload: subsetting straight after a partial instance trips over stale glyph names
        buf.seek(0)
        font = TTFont(buf)
        sub = subset.Subsetter(options(True))
        sub.populate(unicodes=font.getBestCmap().keys())
        sub.subset(font)
        path = os.path.join(out, f"NotoSans{script}.ttf")
        font.save(path)
        print(path, os.path.getsize(path), len(font.getBestCmap()), "characters")

if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
