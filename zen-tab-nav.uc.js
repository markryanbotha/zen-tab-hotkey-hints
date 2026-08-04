// ==UserScript==
// @name        Zen Tab Nav
// @description Ctrl+J/K (vim) and Ctrl+N/P (emacs) to cycle tabs, wrapping around.
// @include     chrome://browser/content/browser.xhtml
// ==/UserScript==

(function () {
  "use strict";

  if (window.ZenTabNav) {
    window.ZenTabNav.destroy();
  }

  const PREF_SCHEME = "mod.zen-tab-hotkey-hints.nav-scheme";
  const ALLOWED = new Set(["off", "jk", "np", "both"]);

  function getScheme() {
    const raw = Services.prefs.getStringPref(PREF_SCHEME, "both");
    return ALLOWED.has(raw) ? raw : "both";
  }

  function directionFor(key, scheme) {
    if (scheme === "off") {
      return 0;
    }
    const vim = scheme === "jk" || scheme === "both";
    const emacs = scheme === "np" || scheme === "both";
    if (vim && key === "j") return 1;
    if (vim && key === "k") return -1;
    if (emacs && key === "n") return 1;
    if (emacs && key === "p") return -1;
    return 0;
  }

  function isEditableTarget(target) {
    if (!target || typeof target.closest !== "function") {
      return false;
    }
    return !!target.closest("input, textarea, searchbar, [contenteditable='true']");
  }

  function onKeyDown(event) {
    if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
      return;
    }
    const direction = directionFor(event.key, getScheme());
    if (direction === 0) {
      return;
    }
    if (isEditableTarget(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    gBrowser.tabContainer.advanceSelectedTab(direction, true);
  }

  window.addEventListener("keydown", onKeyDown, true);

  window.ZenTabNav = {
    destroy() {
      window.removeEventListener("keydown", onKeyDown, true);
      delete window.ZenTabNav;
    },
  };
})();
