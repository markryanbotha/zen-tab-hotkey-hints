# Tab Hotkey Hints for Zen Browser

Hold the tab-switch modifier and small hotkey badges fade in on your tabs,
so you always know which tab `Cmd+3` will take you to.

- macOS: hold `⌘` → badges show `⌘1` … `⌘8`
- Windows: hold `Ctrl` → badges show `Ctrl 1` … `Ctrl 8`
- Linux: hold `Alt` → badges show `Alt 1` … `Alt 8`

Badges follow Zen's real shortcut order: Essentials first, then pinned
tabs, then regular tabs of the current space. With more than 8 tabs, the
last tab gets a `9` badge (`modifier+9` always jumps to the last tab).

Badges appear after a short delay (default 300 ms) so quick shortcut
presses do not flash the UI, and disappear the moment you release the key.

## Install

This mod needs JavaScript, so install it with [Sine](https://github.com/CosmoCreeper/Sine)
(the official Zen Mods store is CSS-only):

1. Install Sine and restart Zen.
2. In `Settings → Sine`, install from this repository, or copy this folder
   into your profile's Sine mods directory.
3. Restart Zen.

## Preferences

| Preference | Default | Description |
|---|---|---|
| `mod.zen-tab-hotkey-hints.delay-ms` | `300` | Hold time before badges appear |
| `mod.zen-tab-hotkey-hints.show-last-tab-hint` | `true` | Show the `9` badge on the last tab |

## How it works

- `zen-tab-hotkey-hints.uc.js` listens for the modifier key. After the
  delay it sets `zen-tab-hints` on the window root and appends a badge
  element to each of the first 8 `gBrowser.visibleTabs` (plus the last
  tab). Badges re-render if tabs open, close, or move while held.
- `userChrome.css` styles and animates the badges.
