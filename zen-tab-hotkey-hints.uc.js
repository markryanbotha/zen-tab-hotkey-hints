// ==UserScript==
// @name        Zen Tab Hotkey Hints
// @description Hold the tab-switch modifier (Cmd/Ctrl/Alt) to show hotkey badges on tabs.
// @include     chrome://browser/content/browser.xhtml
// ==/UserScript==

(function () {
  "use strict";

  if (window.ZenTabHotkeyHints) {
    window.ZenTabHotkeyHints.destroy();
  }

  const PREF_DELAY = "mod.zen-tab-hotkey-hints.delay-ms";
  const PREF_LAST = "mod.zen-tab-hotkey-hints.show-last-tab-hint";

  // Firefox tab-switch modifier: Cmd (macOS), Ctrl (Windows), Alt (Linux).
  const PLATFORM = AppConstants.platform;
  const MOD = PLATFORM === "macosx"
    ? { key: "Meta", label: (n) => `\u2318 ${n}` }
    : PLATFORM === "win"
      ? { key: "Control", label: (n) => `Ctrl ${n}` }
      : { key: "Alt", label: (n) => `Alt ${n}` };

  const TAB_EVENTS = ["TabOpen", "TabClose", "TabMove", "TabPinned", "TabUnpinned", "TabSelect"];
  const XHTML_NS = "http://www.w3.org/1999/xhtml";

  let timer = null;
  let active = false;

  function getDelay() {
    const raw = Services.prefs.getStringPref(PREF_DELAY, "300");
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 300;
  }

  function addBadge(tab, text) {
    const stack = tab.querySelector(".tab-stack") ?? tab;
    const badge = document.createElementNS(XHTML_NS, "span");
    badge.className = "zen-tab-hint-badge";
    badge.textContent = text;
    stack.appendChild(badge);
  }

  function removeBadges() {
    for (const badge of document.querySelectorAll(".zen-tab-hint-badge")) {
      badge.remove();
    }
  }

  function render() {
    removeBadges();
    const tabs = gBrowser.visibleTabs;
    const firstEight = tabs.slice(0, 8);
    for (let i = 0; i < firstEight.length; i++) {
      addBadge(firstEight[i], MOD.label(i + 1));
    }
    const showLast = Services.prefs.getBoolPref(PREF_LAST, true);
    if (showLast && tabs.length > 8) {
      addBadge(tabs[tabs.length - 1], MOD.label(9));
    }
  }

  function show() {
    timer = null;
    active = true;
    render();
    document.documentElement.setAttribute("zen-tab-hints", "true");
  }

  function hide() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!active) {
      return;
    }
    active = false;
    document.documentElement.removeAttribute("zen-tab-hints");
    removeBadges();
  }

  function onKeyDown(event) {
    if (event.key !== MOD.key || event.repeat || timer || active) {
      return;
    }
    timer = setTimeout(show, getDelay());
  }

  function onKeyUp(event) {
    if (event.key === MOD.key) {
      hide();
    }
  }

  function onBlur() {
    hide();
  }

  function onTabsChanged() {
    if (active) {
      render();
    }
  }

  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener("blur", onBlur);
  for (const name of TAB_EVENTS) {
    gBrowser.tabContainer.addEventListener(name, onTabsChanged);
  }

  window.ZenTabHotkeyHints = {
    destroy() {
      hide();
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      for (const name of TAB_EVENTS) {
        gBrowser.tabContainer.removeEventListener(name, onTabsChanged);
      }
      delete window.ZenTabHotkeyHints;
    },
  };
})();
