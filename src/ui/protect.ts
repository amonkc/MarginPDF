import { toast, modal, h } from './dom';
import type { ToastHandle } from './dom';
import type { App } from '../app';

/** Permission flags (/P) with every optional permission bit cleared; allowed bits are OR-ed in. */
const BASE_PERMS = -3392;
/** /P bits granted by each "Without it, people can" option. */
const PERM_BITS: Record<string, number> = { print: 2052, copy: 16, comment: 288, edit: 1032 };

/**
 * "Protect with a password" dialog: open password and/or permissions password with allowed actions,
 * replace or remove existing protection. A locked encrypted file gets the unlock prompt instead.
 */
async function protectDialog(app: App): Promise<ToastHandle | void> {
  const { encrypted } = app.doc.security();
  if (encrypted && app.limits.locked) return unlockDialog(app);
  const passwordField = (id: string, label: string) => {
    const input = h("input", { class: "tinput", type: "password", id, autocomplete: "new-password", "aria-label": label }) as HTMLInputElement;
    return { el: input, row: h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: label }), input) };
  }, openPw = passwordField("pr-open", "Password"), openPw2 = passwordField("pr-open2", "Type it again"), ownerPw = passwordField("pr-owner", "Permissions password"), ownerPw2 = passwordField("pr-owner2", "Type it again"), needOpen = h("input", { type: "checkbox", id: "pr-need-open", checked: true }) as HTMLInputElement, limit = h("input", { type: "checkbox", id: "pr-limit" }) as HTMLInputElement, allow: Record<string, HTMLInputElement> = Object.fromEntries(Object.keys(PERM_BITS).map((key) => [key, h("input", { type: "checkbox", id: "pr-allow-" + key, checked: key === "print" || key === "copy" })])), openSection = h("div", { class: "stack pr-sub" }, openPw.row, openPw2.row), limitSection = h("div", { class: "stack pr-sub" }, ownerPw.row, ownerPw2.row, h("span", { class: "rlabel", text: "Without it, people can:" }), h("label", { class: "hf-check" }, allow.print, "Print"), h("label", { class: "hf-check" }, allow.copy, "Copy text and images"), h("label", { class: "hf-check" }, allow.comment, "Add comments and fill in forms"), h("label", { class: "hf-check" }, allow.edit, "Edit, and add or remove pages")), syncSections = () => {
    openSection.hidden = !needOpen.checked;
    limitSection.hidden = !limit.checked;
  };
  needOpen.addEventListener("change", syncSections);
  limit.addEventListener("change", syncSections);
  syncSections();
  const body = h("div", { class: "stack protect" }, encrypted ? h("p", { class: "modal-text", text: "This PDF is already protected. Set new passwords below to replace its protection, or remove it." }) : null, h("label", { class: "hf-check" }, needOpen, "Require a password to open the document"), openSection, h("label", { class: "hf-check" }, limit, "Limit printing, copying and editing"), limitSection, h("p", { class: "hint", text: "Encrypted with AES-256. Keep the passwords somewhere safe: they can’t be recovered. Margin keeps them only while this file is open." })), choice = await modal({ title: encrypted ? "Protection" : "Protect with a password", body, actions: [...encrypted ? [{ id: "remove", label: "Remove protection", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: encrypted ? "Replace protection" : "Protect", primary: true }] });
  if (choice === "remove") {
    await app.unprotect().then(() => toast("Protection removed. Save to keep the unprotected copy.")).catch((err: Error) => toast(err.message, "err", 6e3));
    return;
  }
  if (choice !== "ok") return;
  const userPw = needOpen.checked ? openPw.el.value : "", ownerPassword = limit.checked ? ownerPw.el.value : "";
  if (needOpen.checked && !userPw) return toast("Enter a password to open the document, or untick that option", "warn");
  if (needOpen.checked && userPw !== openPw2.el.value) return toast("The two passwords to open the document don’t match", "warn");
  if (limit.checked && !ownerPassword) return toast("Enter a permissions password, or untick “Limit printing, copying and editing”", "warn");
  if (limit.checked && ownerPassword !== ownerPw2.el.value) return toast("The two permissions passwords don’t match", "warn");
  if (limit.checked && ownerPassword === userPw) return toast("Use a permissions password that differs from the password to open, or anyone who can open the file can lift the limits", "warn", 6e3);
  if (!userPw && !ownerPassword) return toast("Choose at least one: a password to open, or limits with a permissions password", "warn");
  let perms = BASE_PERMS;
  if (limit.checked) {
    for (const key of Object.keys(PERM_BITS)) if (allow[key].checked) perms |= PERM_BITS[key];
  } else perms |= PERM_BITS.print | PERM_BITS.copy | PERM_BITS.comment | PERM_BITS.edit;
  // Without a separate permissions password the owner password is the open password.
  await app.protect(userPw, ownerPassword || userPw, perms).then(() => toast(`Protected${userPw ? " with a password to open it" : ""}${ownerPassword ? (userPw ? " and" : " with") + " limits" : ""}. Save to keep the protected copy.`)).catch((err: Error) => toast(err.message, "err", 6e3));
}

/** Prompt for the permissions password of a PDF whose permissions limit editing; unlocks it on success. */
async function unlockDialog(app: App): Promise<void> {
  const { perms } = app.limits, allowed = [perms & 4 ? "print" : "", perms & 16 ? "copy text" : "", perms & 32 ? "add comments" : perms & 256 ? "fill in forms" : ""].filter(Boolean), input = h("input", { class: "tinput", type: "password", id: "pr-unlock", autocomplete: "off", "aria-label": "Permissions password" }) as HTMLInputElement;
  const choice = await modal({ title: "This PDF limits changes", body: h("div", { class: "stack" }, h("p", { class: "modal-text", text: `Without its permissions password you can ${allowed.length ? allowed.join(", ") : "only read it"}. Enter that password to edit it or change its protection.` }), h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: "Permissions password" }), input)), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Unlock", primary: true }], onOpen: () => {
    input.focus();
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") (document.querySelector(".modal .btn.primary") as HTMLElement | null)?.click();
    });
  } });
  if (choice === "ok") {
    if (app.unlock(input.value)) toast("Unlocked: you can edit this PDF. Its protection stays when you save.");
    else toast("That isn’t the permissions password", "err");
  }
}

export { protectDialog };
