/** One release in the in-app changelog. */
export interface ChangelogEntry {
  version: string;
  /** Release date, YYYY-MM-DD. */
  date: string;
  /** User-facing notes, one paragraph each. */
  notes: string[];
}

/** Release history shown by the version button, newest first. */
const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.27.1",
    date: "2026-11-18",
    notes: ["Fixed the layout on tablets and unfolded phones in landscape (such as the Galaxy Z Fold): the top bar no longer runs off the screen and shrinks the whole app. At those widths, print, header & footer, watermark, protection, flatten and insert pages are in the More menu (⋯)."],
  },
  {
    version: "2.27.0",
    date: "2026-11-18",
    notes: [
      "Margin now notices when a new version comes out while it’s open: the version button in the status bar says “Update available” and a message offers Reload. Click the version button to see what’s new before updating. Reloading keeps your unsaved changes.",
      "After an update, Margin says once which version you’re on, with a link to what’s new.",
    ],
  },
  {
    version: "2.26.0",
    date: "2026-11-18",
    notes: [
      "Unsaved changes now survive a refresh: Margin keeps them in your browser and brings the document back with its undo history. If a tab with unsaved changes is closed or crashes, Margin offers them back the next time it opens.",
      "The changes stay on your device, in this browser only, and are removed as soon as you save, discard them or open another file. Password-protected documents ask for their password when they come back; the password itself is never stored.",
    ],
  },
  {
    version: "2.25.4",
    date: "2026-11-18",
    notes: ["Move & resize now selects the object you can see in front: clicking an image that covers text picks the image, not the text behind it. To reach something hidden behind, Alt-click (Option-click on a Mac) at the same spot."],
  },
  {
    version: "2.25.3",
    date: "2026-11-18",
    notes: ["Margin is now only a website: the single-page claude.ai version is retired, and the app no longer contains the code that version needed."],
  },
  {
    version: "2.25.2",
    date: "2026-11-18",
    notes: ["Margin itself is now open source under the MIT License, noted at the top of the open-source licences."],
  },
  {
    version: "2.25.1",
    date: "2026-11-18",
    notes: [
      "The open-source licences now open inside Margin (What's new → Open-source licences), in the claude.ai version as well as on the website, and the list is complete: it adds the notices for ICU, the Emscripten runtime, musl and Vite alongside PDFium and its libraries, HarfBuzz, the spelling dictionary and every font.",
    ],
  },
  {
    version: "2.25.0",
    date: "2026-11-18",
    notes: [
      "Margin can now be hosted as a normal website (on Cloudflare), updating itself whenever a new version is pushed. The site loads its interface fonts from itself rather than Google, so using it sends nothing to other companies, and your documents still never leave your device.",
      "On the website, Margin downloads about 2.5 MB once and is cached afterwards; fonts for PDFs and the spelling dictionary download only when first used. The What's new window links to the open-source licences.",
    ],
  },
  {
    version: "2.24.2",
    date: "2026-11-18",
    notes: [
      "Comments and text boxes: deleting a comment no longer leaves its pop-up note behind; text boxes with a border but no saved width keep their 1 pt border (also in other PDF viewers) and size and draw correctly.",
      "Links and forms: adding a link to another page loads that page properly and says clearly what went wrong if it fails; radio buttons with custom choice names no longer have unrelated “Yes” values renamed when saved.",
      "Editing: if reloading the document after an edit fails, Margin keeps it open instead of breaking every later action; find & replace no longer fails on text blocks without a stored style; rich text styles no longer land on the wrong characters after an emoji in older browsers.",
      "Panels and dialogs: moving a bookmark no longer collapses other bookmarks whose numbers start the same way; the Spelling panel no longer flags words with curly apostrophes after a replace; removing a header & footer or watermark no longer reports success when it failed; Print and Export as images no longer ask for “the pages to extract”.",
      "Smaller fixes: printing or exporting images frees its memory even if a page fails or you cancel; a cancelled touch drag while cropping an image puts the frame back; clearing redaction marks shows an error if it fails; Esc in the crop tool no longer reaches the browser; pasting an image when no page is shown no longer leaks memory.",
    ],
  },
  {
    version: "2.24.1",
    date: "2026-11-18",
    notes: [
      "Behind the scenes: Margin's source code was rebuilt as a proper TypeScript project after the original was lost. Everything works as before; this release is built from the rebuilt code.",
    ],
  },
  {
    version: "2.24.0",
    date: "2026-11-17",
    notes: [
      "Rectangles and ellipses: pick any outline or fill colour with the new custom colour swatch (rainbow), turn the outline or the fill off with None, and set transparency with an opacity slider. Select a shape to get these in the tool bar; they are also in its right-click menu (now with 10% opacity).",
      "The Rectangle and Ellipse tools take the same choices, so new shapes can start filled, without an outline, or see-through.",
      "Lines, arrows, drawings and highlights also get the custom colour swatch and the opacity slider when selected.",
    ],
  },
  {
    version: "2.23.2",
    date: "2026-10-18",
    notes: [
      "Fixed on phones and tablets: dragging a rectangle or other annotation with Select could make it vanish. The browser treated the drag as a scroll and cancelled it, and Margin moved the annotation to where the cancelled touch reported (often off the page). A finger on an annotation now drags it, a finger anywhere else still scrolls, and a drag the browser cancels leaves things where they were.",
    ],
  },
  {
    version: "2.23.1",
    date: "2026-10-09",
    notes: [
      "Fixed: Duplicate, Copy and Cut in the right-click menu (and Ctrl+D, Ctrl+C, Ctrl+X) did nothing with Select on an arrow, shape or other annotation drawn after you had used Move & resize. Select now always works from the page as it is.",
    ],
  },
  {
    version: "2.23.0",
    date: "2026-10-09",
    notes: [
      "Copy, cut and paste objects: select annotations or pictures (with Select, or several at once in Move & resize) and press Ctrl+C or Ctrl+X, then Ctrl+V on any page, in another PDF, or in another Margin window. Shapes, arrows, drawings, notes, text boxes, stamps, signatures and pictures keep their look, comment text and layout relative to each other.",
      "Pasting again on the same page steps each copy down and to the right; on another page it lands in the same spot, kept inside the page. Right-click empty page space for Paste here to put it where you clicked. Cut, Copy and Paste are also in the right-click menus; Ctrl+V pastes whichever you copied last, pages or objects (in the sidebar it always pastes pages).",
      "Page text and links can’t be copied this way yet, and copying respects a protected PDF’s permissions.",
    ],
  },
  {
    version: "2.22.0",
    date: "2026-10-09",
    notes: [
      "Right-click menus now fit each kind of object. Rectangles and ellipses: outline and fill color, line width, solid or dashed, opacity. Lines and arrows: color, width, dashes, arrowheads at either or both ends, open or filled heads, reverse direction, opacity. Drawings: color, width, dashes, opacity. Highlights and other markup: color and opacity. Text boxes: text color, fill, border and size.",
      "Duplicate (Ctrl+D) copies a shape, line, drawing, note, text box, stamp or signature, or a picture in Move & resize, a little down and to the right. Bring to front and Send to back are in the annotation menu too.",
      "Move & resize has its own right-click menu: align to the page or to each other, distribute, match size, stacking order, duplicate and delete for one or several objects; images add rotate, flip, crop, replace and Save image…. Right-click empty page space to add a note or text box right there, copy, rotate, insert or delete the page, or select all objects.",
    ],
  },
  {
    version: "2.21.0",
    date: "2026-10-09",
    notes: [
      "Select several objects in Move & resize: Shift- or Ctrl-click to add or remove one, drag a box across empty space to select what’s inside, or Ctrl+A for the whole page. Move them together (snapping to the page and other objects), nudge them with the arrow keys, or delete them in one step.",
      "Align (left, centre, right, top, middle, bottom; one object aligns to the page), distribute evenly across or down, and match width, height or size to the object you clicked last. Text, images, drawings and annotations can be mixed.",
      "Stacking order: bring to front or forward, send backward or to back (Ctrl+] and Ctrl+[, with Shift for all the way). Annotations stack among annotations, above the page’s content.",
    ],
  },
  {
    version: "2.20.0",
    date: "2026-10-09",
    notes: [
      "Replace pages: right-click selected pages (or More › Replace pages…), pick a PDF and which of its pages to use, and they take the place of the old ones in one undoable step. The counts don’t have to match; password-protected PDFs ask for their password.",
      "Bookmarks that pointed at the replaced pages now point at the new ones, and form fields on the new pages keep working. Also: a right-click menu no longer closes by itself when the list was still scrolling.",
    ],
  },
  {
    version: "2.19.0",
    date: "2026-10-09",
    notes: [
      "Check spelling (More menu or F7): scans the document’s English text and steps through possible misspellings, highlighted on the page, with suggestions. Click a suggestion to fix it in place, or Ignore, Ignore all, or Add to dictionary (kept in this browser). Acronyms and words like iPhone are skipped; Thai text is left alone.",
      "Spelling is also checked as you type when editing text, in text boxes, comments and form fields, using your browser’s own dictionary.",
    ],
  },
  {
    version: "2.18.0",
    date: "2026-10-09",
    notes: [
      "Compress (More menu): shrinks the file by downsampling and re-encoding images that are sharper than needed, with three presets (high quality 200 dpi, balanced 150 dpi, smallest 100 dpi), then rewrites the file without unused objects. Text and drawings are untouched.",
      "Shows the size before and after; undoable. Images with transparency keep it, images that wouldn’t get smaller are left alone, and an image used on several pages is kept as one shared copy.",
    ],
  },
  {
    version: "2.17.0",
    date: "2026-10-09",
    notes: [
      "Export pages as images: PNG or JPEG (with a quality setting) at 72, 150, 300 or 600 dpi, for all, current, selected or a range of pages, with or without comments. One page saves as an image; several save together as a .zip.",
      "New More menu (⋯) in the top bar gathers the document tools: print, export as images, password protection, watermark, header & footer, flatten, and inserting or extracting pages. On phones it’s the way to reach them. Export as images is also in the page right-click menu.",
    ],
  },
  {
    version: "2.16.0",
    date: "2026-10-09",
    notes: [
      "Bookmarks: a new Bookmarks tab in the left sidebar shows the PDF’s outline as a tree. Click one to go there; nested bookmarks expand and collapse.",
      "Add a bookmark for what’s on screen (named after the page’s title text, ready to rename), rename it (double-click or F2), point it at the current view, move it up or down, indent or outdent it (right-click menu or Alt+arrows), or delete it. Changes are saved in the PDF and can be undone.",
    ],
  },
  {
    version: "2.15.0",
    date: "2026-10-09",
    notes: [
      "Print (printer button or Ctrl+P): all pages, the current page, the selected pages or a range, with or without comments and markup, at standard or high quality. Pages print exactly as they look on screen, Thai text included; landscape pages fit the paper.",
      "If the browser can’t print from here, Margin says so; save the PDF and print it from your PDF viewer instead. Printing respects a protected PDF’s permissions.",
    ],
  },
  {
    version: "2.14.0",
    date: "2026-10-09",
    notes: [
      "Right-click an annotation on the page (with Select) for a menu: edit or add its comment, reply, copy the comment text, change its color, move & resize it, or delete it. Text boxes offer Edit text.",
      "Right-click a link to open it (or go to its page), copy its address, edit it, or remove it. Also opens with a long press on touch screens, or Shift+F10 / the Menu key on the selected annotation.",
    ],
  },
  {
    version: "2.13.0",
    date: "2026-10-09",
    notes: [
      "Right-click a page in the sidebar for a menu: copy, paste after or before, rotate, insert a blank page or pages from a PDF, extract, delete, and go to the page. It acts on all selected pages when you right-click inside a selection.",
      "Also opens with a long press on touch screens, and with Shift+F10 or the Menu key on a focused page (arrow keys to move, Esc to close). Delete now removes the focused page’s selection from the sidebar too. Items a protected PDF doesn’t allow are greyed out.",
    ],
  },
  {
    version: "2.12.0",
    date: "2026-10-09",
    notes: [
      "Copy and paste pages, including between Margin windows: select pages in the sidebar and press Ctrl+C (or the new Copy button), then Ctrl+V (or Paste) in this or another Margin window to insert them after the selected page. Undo removes them in one step.",
      "Pasted pages keep their comments, markup and working form fields; field names already in use get a _2 suffix. Copying respects a protected PDF’s permissions.",
    ],
  },
  {
    version: "2.11.0",
    date: "2026-10-09",
    notes: [
      "Password protection (lock button in the top bar): require a password to open the PDF, and/or limit printing, copying, commenting and editing with a separate permissions password. Files are encrypted with AES-256; replacing or removing protection is undoable.",
      "Protected PDFs open with their password (including Thai passwords), stay protected when saved, and their limits are honored: changes they don’t allow are blocked until you unlock them with the permissions password.",
      "Inserting pages from a password-protected PDF now asks for its password instead of refusing.",
    ],
  },
  {
    version: "2.10.1",
    date: "2026-10-09",
    notes: [
      "Faster undo and redo on large files: Margin now refreshes only the pages the edit touched, instead of re-reading every page for the comments list. On a 2.6 GB file, undoing a one-page edit takes about half a second instead of 2.5 seconds.",
      "Undoing a change to page order (inserting, deleting, moving or merging pages) still refreshes everything, since page numbers shift.",
    ],
  },
  {
    version: "2.10.0",
    date: "2026-10-09",
    notes: [
      "Much larger files: Margin now opens and edits PDFs up to 4 GB (tested at 2.6 GB), up from about 500 MB. The PDF engine reads the file in pieces as it needs them instead of keeping its own copy, and it lets go of pages you’ve scrolled past.",
      "Edits and undo stay quick on big files: each edit is added to the file as a small update (usually a few KB), and undo just steps back to an earlier point, without copying anything. On a 900 MB file an edit takes about a third of a second and undo about a quarter.",
      "Files over 600 MB are saved the way Acrobat’s Save does: the original with your changes added at the end. Smaller files are still fully rewritten. Redactions in a file over 600 MB can’t be saved, since removing the content needs a full rewrite; extract the pages first.",
    ],
  },
  {
    version: "2.9.1",
    date: "2026-10-09",
    notes: [
      "Faster edits on large files: undo steps now store only what changed (usually a few KB) instead of a full copy of the file. Each edit on a 100 MB file takes about half a second instead of over a second, and 40 undo steps no longer risk running the tab out of memory.",
      "The first edit after opening a large file takes a little longer while Margin prepares it. Undo history is also capped by memory, dropping the oldest steps first.",
      "Files too large for the browser’s PDF engine now say so instead of showing “Aborted”.",
    ],
  },
  {
    version: "2.9.0",
    date: "2026-10-08",
    notes: [
      "Signature fields: the Form field tool has a new Signature type. It saves as a real PDF signature field, so Acrobat and other apps offer to sign it, digital certificates included.",
      "In Margin, click Sign here on an empty signature field to put your drawn signature in it, fitted to the box. Signature fields survive moving, resizing, extracting and inserting pages.",
    ],
  },
  {
    version: "2.8.0",
    date: "2026-10-08",
    notes: [
      "Extracted and inserted pages keep working form fields: names, options, typed values, ticks and radio groups carry over, so the fields stay fillable in the new file.",
      "When inserted fields clash with names already in the document, they get a _2 suffix so they stay independent.",
    ],
  },
  {
    version: "2.7.0",
    date: "2026-10-08",
    notes: [
      "Font and size per selection: select words while editing and pick a font or size to change just those words; with nothing selected, the font and size apply to the whole block.",
      "Lines with larger text get taller automatically, and the bar shows the font and size of the selected words.",
    ],
  },
  {
    version: "2.6.0",
    date: "2026-10-08",
    notes: [
      "Replies on comments: every comment in the panel has a Reply link; replies show as a thread under it, can be edited or deleted, and are saved the standard way (Acrobat and other viewers show them as replies).",
      "Deleting a comment removes its replies too. Replies stay off the page itself.",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-10-08",
    notes: [
      "Image tools in Move & resize: select a picture to rotate it left or right, flip it horizontally or vertically, crop it, or replace it with another file.",
      "Cropping trims the picture itself (the cut part leaves the file) and works on rotated pictures; Replace fits the new picture upright in the old one’s box. Rotate and flip also work on vector graphics.",
    ],
  },
  {
    version: "2.4.0",
    date: "2026-10-08",
    notes: [
      "Bulleted and numbered lists in text blocks: use the new list buttons while editing. Wrapped list items line up under their text, numbering counts automatically, and lists survive re-editing.",
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-08",
    notes: [
      "New Form field tool (F): add text fields, multi-line text, checkboxes, radio buttons, dropdowns and list boxes. Drag a box or click; name the field and, for choices, list the options.",
      "Radio buttons with the same group name work together, each with its own value. Click a field with the tool to rename it, change its options or delete it; move and resize fields in Move & resize.",
      "The tool bar on the left now scrolls when there are more tools than fit, on desktop and on phones.",
    ],
  },
  {
    version: "2.2.0",
    date: "2026-10-08",
    notes: [
      "New Redact tool (X): sweep across text or drag over an area to mark it, or mark every match of a word. Marks show as red outlines and nothing is removed until you apply.",
      "Apply removes the text, image pixels and drawings under the marks from the file (not just covered), plus comments and form fields mostly inside them, then covers the areas in black, white or nothing.",
    ],
  },
  {
    version: "2.1.0",
    date: "2026-10-08",
    notes: [
      "Flatten (top bar): draws comments, markup, shapes, stamps, text boxes and filled-in form fields into the page, so they look the same everywhere and can no longer be changed. Choose comments, form fields or both; links stay clickable; undo works until you close the file.",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-10-08",
    notes: [
      "Mixed styles in one text block: select words and make them bold, italic, underlined, struck through or a different colour (Ctrl+B / I / U work too). Thai selections keep vowels and tone marks with their consonant.",
      "Paragraph reflow: Edit text now opens a whole paragraph of an existing PDF, and the text re-wraps as you edit. It uses the closest built-in font; a single line edited without style changes keeps its original font.",
      "Add text: drag across to set a width and the text wraps to it. Justify joins left, centre and right.",
      "In Move & resize, the side handles of wrapped text change its width and the text reflows; corners still scale it.",
      "Find & replace keeps the styles inside rich text blocks.",
    ],
  },
  {
    version: "1.16.0",
    date: "2026-10-08",
    notes: [
      "New Link tool (G): sweep across text (it snaps to the words) or drag a box, then link to a web address, an email, or a page in this document. Click a link with the tool to edit or remove it.",
      "With Select, clicking a link follows it: pages scroll into view, web links open in a new tab. Links can be moved and resized in Move & resize.",
    ],
  },
  {
    version: "1.15.0",
    date: "2026-10-08",
    notes: [
      "Find & replace (Ctrl+H, or the arrows button in the search box): replace the current match or every match, with Match case and Whole words. Thai works.",
      "Each changed line keeps its font, size, colour and position, like Edit text. Matches that cross a line break are skipped.",
    ],
  },
  {
    version: "1.14.0",
    date: "2026-10-08",
    notes: [
      "New Watermark & background (top bar): text (Thai works) or an image, with opacity, angle, size, over or behind the content, on all pages or a range, with a live preview.",
      "Optional page background colour. Applying again replaces the old watermark; Remove takes it out.",
    ],
  },
  {
    version: "1.13.0",
    date: "2026-10-08",
    notes: [
      "New Stamp tool (P): Approved, Rejected, Draft, Final, Confidential, For comment, Received, Paid, Void, Thai stamps (สำเนาถูกต้อง, อนุมัติ, ด่วน, ลับ) or your own text and colour.",
      "Optionally adds your name and the date and time under the stamp. Resize it from a corner in Move & resize.",
    ],
  },
  {
    version: "1.12.0",
    date: "2026-10-08",
    notes: [
      "New Text box & callout tool (B): drag a box and type, or switch to Callout, press on what to point at and drag to where the box goes. Text wraps by word, Thai included.",
      "Choose font, size, text colour, fill and border. Double-click a text box with Select to edit it, or restyle it from the tool bar.",
      "In Move & resize, resizing a text box re-wraps its text; a callout keeps pointing at its target, and its arrow tip has its own handle.",
    ],
  },
  {
    version: "1.11.0",
    date: "2026-10-08",
    notes: [
      "New Line & arrow tool (L): plain line, arrow or double arrow, in any colour and width. Hold Shift for 45° steps.",
      "In Move & resize, drag a line by its stroke, or drag either end to re-aim it.",
    ],
  },
  {
    version: "1.10.0",
    date: "2026-10-08",
    notes: [
      "Extract pages now takes a page range (like 1-3, 5, 8-) and can split into one PDF per page or a PDF every N pages; several files download together as a .zip.",
      "Optionally remove the extracted pages from the document afterwards (undoable).",
      "Fixed: extracting or inserting pages that contain form fields could produce a file other viewers flagged as damaged. Those fields now keep their look but are no longer fillable in the extracted copy.",
    ],
  },
  {
    version: "1.9.0",
    date: "2026-10-08",
    notes: [
      "New Crop pages tool (C): drag a rectangle, adjust its edges, then crop this page, the selected pages or every page.",
      "Uncrop restores a page to its full size; cropping only hides content, so nothing is lost.",
    ],
  },
  {
    version: "1.8.0",
    date: "2026-10-08",
    notes: [
      "New Image tool (I): click to place a picture at its natural size, or drag a box to size it. It then opens in Move & resize.",
      "Paste an image with Ctrl+V, or drop image files onto a page.",
      "Images become part of the page, so they look the same in every PDF viewer. Photos stay JPEG and large ones are scaled to 300 dpi to keep files small.",
    ],
  },
  {
    version: "1.7.0",
    date: "2026-10-08",
    notes: [
      "Picking the Signature tool asks which saved signature to place or lets you draw a new one.",
      "Keep up to six signatures, switch between them in the tool bar, and remove ones you no longer want.",
    ],
  },
  {
    version: "1.6.2",
    date: "2026-10-08",
    notes: [
      "Fixed: a placed signature faded out of its box when dragged; moving and resizing signatures now keeps the image in place.",
    ],
  },
  { version: "1.6.1", date: "2026-10-08", notes: ["Version number in the status bar, with this list of changes."] },
  {
    version: "1.6.0",
    date: "2026-10-08",
    notes: [
      "Move & resize tool (A): drag text, images and annotations, resize from handles, snap guides, arrow-key nudging.",
    ],
  },
  {
    version: "1.5.1",
    date: "2026-10-08",
    notes: ["Undo, redo and page operations keep your place instead of jumping to page 1."],
  },
  {
    version: "1.5.0",
    date: "2026-10-08",
    notes: [
      "Bold, italic, underline and strikethrough, alignment and line spacing for added and edited text.",
      "Real bold and italic font files for Sarabun, Kanit, Prompt, Bai Jamjuree, Chakra Petch and Poppins.",
    ],
  },
  { version: "1.4.2", date: "2026-10-08", notes: ["The insert slot between pages is a single + that opens a menu."] },
  { version: "1.4.1", date: "2026-10-08", notes: ["More space between page thumbnails."] },
  {
    version: "1.4.0",
    date: "2026-10-08",
    notes: [
      "Insert a blank page or pages from another PDF at any position in the page sidebar; drop PDFs between pages.",
    ],
  },
  { version: "1.3.0", date: "2026-10-08", notes: ["Live preview in the Header & footer dialog."] },
  { version: "1.2.0", date: "2026-10-08", notes: ["Images such as logos in header and footer positions."] },
  {
    version: "1.1.0",
    date: "2026-10-08",
    notes: ["Header & footer with page-number tokens, page ranges and Thai digits."],
  },
  { version: "1.0.2", date: "2026-10-08", notes: ["The tool bar no longer scrolls sideways."] },
  {
    version: "1.0.1",
    date: "2026-10-08",
    notes: ['The PDF engine and fonts are built into the page, fixing "Failed to fetch" on start.'],
  },
  {
    version: "1.0.0",
    date: "2026-10-08",
    notes: [
      "Rebuilt on PDFium with HarfBuzz Thai shaping: edit existing text, real annotations, forms, signatures and page management.",
    ],
  },
];
/** Current app version (matches the newest CHANGELOG entry). */
const VERSION = "2.27.1";

export { CHANGELOG, VERSION };
