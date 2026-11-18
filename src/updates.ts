// Notices when a newer Margin has been deployed while the page is open, and says what changed after an update.
//
// Each build publishes /version.json (vite.config.ts: the version and the latest changelog entries), served
// with `no-cache` so a check costs a few hundred bytes (usually a 304). Margin checks it when the tab comes back
// into view or the window regains focus (at most every 5 minutes), and every 30 minutes while visible. A new
// version marks the version button in the status bar and shows a toast with Reload; reloading is safe because
// unsaved changes are kept through a refresh (session.ts).

import { VERSION } from "./changelog";
import type { ChangelogEntry } from "./changelog";
import { $, h, modal, toast } from "./ui/dom";

/** What /version.json holds. */
export type VersionInfo = { version: string; releases: ChangelogEntry[] };

const CHECK_EVERY = 30 * 60 * 1000;
const MIN_GAP = 5 * 60 * 1000;
/** A toast about the same update is shown again at most this often (phones have no status bar to mark). */
const TOAST_AGAIN = 6 * 3600 * 1000;

/** Whether version `a` is newer than `b` (x.y.z). */
const newer = (a: string, b: string): boolean => {
  const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  return false;
};

type Options = {
  /** Called before reloading: finish edits in progress and store unsaved changes. */
  beforeReload: () => Promise<void>;
  /** Opens the What's new window. */
  showWhatsNew: () => void;
};

class Updates {
  opts: Options;
  available: VersionInfo | null = null;
  lastCheck = 0;
  toastShownAt = 0;
  constructor(opts: Options) {
    this.opts = opts;
  }

  /**
   * Starts watching, and tells the user once what changed if Margin was updated since their last visit (after
   * `delay` ms, so it doesn't replace another startup message).
   */
  start(delay = 0): void {
    addEventListener("focus", () => this.check());
    document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && this.check());
    setInterval(() => document.visibilityState === "visible" && this.check(true), CHECK_EVERY);
    this.lastCheck = Date.now(); // the page was just loaded, so it is current
    let seen: string | null = null;
    try {
      seen = localStorage.getItem("margin.version");
      localStorage.setItem("margin.version", VERSION);
    } catch {}
    if (seen && seen !== VERSION && newer(VERSION, seen)) {
      setTimeout(() => toast(`Margin was updated to v${VERSION}`, "ok", 8e3, { label: "What’s new", run: () => this.opts.showWhatsNew() }), delay);
    }
  }

  /** Fetches /version.json (unless checked recently) and marks an update if there is one. */
  async check(force = false): Promise<void> {
    if (!force && Date.now() - this.lastCheck < MIN_GAP) return;
    this.lastCheck = Date.now();
    let info: VersionInfo;
    try {
      const response = await fetch("/version.json", { cache: "no-cache" });
      if (!response.ok) return;
      info = await response.json();
    } catch {
      return; // offline, or the dev server
    }
    if (typeof info?.version !== "string" || !newer(info.version, VERSION)) return;
    this.available = info;
    const button = $("#btn-version");
    button.classList.add("has-update");
    button.textContent = `v${VERSION} · Update available`;
    button.title = `Margin v${info.version} is available`;
    if (Date.now() - this.toastShownAt > TOAST_AGAIN) {
      this.toastShownAt = Date.now();
      toast(`Margin v${info.version} is available`, "ok", 15e3, { label: "Reload", run: () => this.reload() });
    }
  }

  /** The window for an available update: what's new in it, Later or Reload now. */
  async offer(): Promise<void> {
    const info = this.available!, releases = (info.releases || []).filter((r) => newer(r.version, VERSION));
    const choice = await modal({
      title: `Margin v${info.version} is available`,
      body: h(
        "div",
        { class: "changelog" },
        h("p", { class: "modal-text", text: `You have v${VERSION}. Reload to update; your unsaved changes are kept.` }),
        ...releases.map((release) => h("section", {}, h("h3", {}, h("span", { class: "mono", text: "v" + release.version })), h("ul", {}, ...release.notes.map((note) => h("li", { text: note }))))),
      ),
      actions: [
        { id: "later", label: "Later" },
        { id: "reload", label: "Reload now", primary: true },
      ],
    });
    if (choice === "reload") await this.reload();
  }

  async reload(): Promise<void> {
    await this.opts.beforeReload();
    location.reload();
  }
}

export { Updates, newer };
