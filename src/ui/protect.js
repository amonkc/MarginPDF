import { H, nt, y } from './dom';

const Ec = -3392;
const _n = { print: 2052, copy: 16, comment: 288, edit: 1032 };
async function Sc(u) {
  const { encrypted: n } = u.doc.security();
  if (n && u.limits.locked) return Cc(u);
  const t = (w, k) => {
    const G = y("input", { class: "tinput", type: "password", id: w, autocomplete: "new-password", "aria-label": k });
    return { el: G, row: y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: k }), G) };
  }, e = t("pr-open", "Password"), r = t("pr-open2", "Type it again"), o = t("pr-owner", "Permissions password"), a = t("pr-owner2", "Type it again"), s = y("input", { type: "checkbox", id: "pr-need-open", checked: true }), i = y("input", { type: "checkbox", id: "pr-limit" }), l = Object.fromEntries(Object.keys(_n).map((w) => [w, y("input", { type: "checkbox", id: "pr-allow-" + w, checked: w === "print" || w === "copy" })])), h = y("div", { class: "stack pr-sub" }, e.row, r.row), m = y("div", { class: "stack pr-sub" }, o.row, a.row, y("span", { class: "rlabel", text: "Without it, people can:" }), y("label", { class: "hf-check" }, l.print, "Print"), y("label", { class: "hf-check" }, l.copy, "Copy text and images"), y("label", { class: "hf-check" }, l.comment, "Add comments and fill in forms"), y("label", { class: "hf-check" }, l.edit, "Edit, and add or remove pages")), _ = () => {
    h.hidden = !s.checked, m.hidden = !i.checked;
  };
  s.addEventListener("change", _), i.addEventListener("change", _), _();
  const p = y("div", { class: "stack protect" }, n ? y("p", { class: "modal-text", text: "This PDF is already protected. Set new passwords below to replace its protection, or remove it." }) : null, y("label", { class: "hf-check" }, s, "Require a password to open the document"), h, y("label", { class: "hf-check" }, i, "Limit printing, copying and editing"), m, y("p", { class: "hint", text: "Encrypted with AES-256. Keep the passwords somewhere safe: they can’t be recovered. Margin keeps them only while this file is open." })), P = await nt({ title: n ? "Protection" : "Protect with a password", body: p, actions: [...n ? [{ id: "remove", label: "Remove protection", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: n ? "Replace protection" : "Protect", primary: true }] });
  if (P === "remove") {
    await u.unprotect().then(() => H("Protection removed. Save to keep the unprotected copy.")).catch((w) => H(w.message, "err", 6e3));
    return;
  }
  if (P !== "ok") return;
  const D = s.checked ? e.el.value : "", x = i.checked ? o.el.value : "";
  if (s.checked && !D) return H("Enter a password to open the document, or untick that option", "warn");
  if (s.checked && D !== r.el.value) return H("The two passwords to open the document don’t match", "warn");
  if (i.checked && !x) return H("Enter a permissions password, or untick “Limit printing, copying and editing”", "warn");
  if (i.checked && x !== a.el.value) return H("The two permissions passwords don’t match", "warn");
  if (i.checked && x === D) return H("Use a permissions password that differs from the password to open, or anyone who can open the file can lift the limits", "warn", 6e3);
  if (!D && !x) return H("Choose at least one: a password to open, or limits with a permissions password", "warn");
  let A = Ec;
  if (i.checked) for (const w of Object.keys(_n)) l[w].checked && (A |= _n[w]);
  else A |= _n.print | _n.copy | _n.comment | _n.edit;
  await u.protect(D, x || D, A).then(() => H(`Protected${D ? " with a password to open it" : ""}${x ? (D ? " and" : " with") + " limits" : ""}. Save to keep the protected copy.`)).catch((w) => H(w.message, "err", 6e3));
}
async function Cc(u) {
  const { perms: n } = u.limits, t = [n & 4 ? "print" : "", n & 16 ? "copy text" : "", n & 32 ? "add comments" : n & 256 ? "fill in forms" : ""].filter(Boolean), e = y("input", { class: "tinput", type: "password", id: "pr-unlock", autocomplete: "off", "aria-label": "Permissions password" });
  await nt({ title: "This PDF limits changes", body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Without its permissions password you can ${t.length ? t.join(", ") : "only read it"}. Enter that password to edit it or change its protection.` }), y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Permissions password" }), e)), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Unlock", primary: true }], onOpen: () => {
    e.focus(), e.addEventListener("keydown", (o) => {
      o.key === "Enter" && document.querySelector(".modal .btn.primary")?.click();
    });
  } }) === "ok" && (u.unlock(e.value) ? H("Unlocked: you can edit this PDF. Its protection stays when you save.") : H("That isn’t the permissions password", "err"));
}

export { Sc };
