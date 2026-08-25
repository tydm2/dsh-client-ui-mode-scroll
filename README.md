# dsh-client-ui-mode-scroll

A small client plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web that improves the **agent-preset (mode) picker** UX: instead of listing every mode at once, it shows only the first 4 built-in modes (Standard / PTC / Minimal / Creator) and folds the remaining custom modes below — revealed by **natural mouse-wheel scroll**, browser-style, no forced paging.

> ⚠️ **Not an official DeepSeek package.** This is a locally authored plugin. The `@deepseek-ai/` name prefix is used only because the Harness client-modules loader mounts plugins under the package name; the code is not affiliated with or maintained by DeepSeek.

## Behavior

When you open the mode selector (the agent-preset picker):

1. **Only the first 4 modes are visible** — measured precisely to 4 rows, not a fixed pixel cutoff; the 4th row is fully visible.
2. **Custom modes fold below the fold line** — the 5th and later rows are hidden.
3. **Wheel-scroll down reveals them naturally** — like scrolling any browser list; scroll up to return to the first 4.

## Install

The plugin is a Harness **client** plugin (browser side). To mount it permanently into your `web` profile:

1. Copy this package into your profile directory:

   ```powershell
   # $DSH_HOME defaults to ~/.dsh
   Copy-Item -Recurse . "$env:USERPROFILE\.dsh\profiles\web\mode-scroll"
   ```

2. Declare it in `profiles/web/package.json` dependencies:

   ```json
   "dependencies": {
     "@deepseek-ai/dsh-client-ui-mode-scroll": "file:./mode-scroll"
   }
   ```

3. Link it into the profile's `node_modules` (a junction works; a regular copy also works, or run `pnpm install` in the profile):

   ```powershell
   New-Item -ItemType Junction -Path "$env:USERPROFILE\.dsh\profiles\web\node_modules\@deepseek-ai\dsh-client-ui-mode-scroll" -Target "$env:USERPROFILE\.dsh\profiles\web\mode-scroll"
   ```

4. Add the plugin row to `profiles/web/cordis.patch.yml`:

   ```yaml
   - insert:
       - id: ui-mode-scroll
         name: '@deepseek-ai/dsh-client-ui-mode-scroll'
   ```

5. Restart `dsh web`. Open the mode selector to verify: the first 4 built-in modes are visible, the rest appear on wheel scroll.

## How it works

The client half observes the DOM for the agent-preset picker opening (`[role="menu"]` triggered by the preset seat/selector button). When the menu holds more than 4 items, it:

- sets `max-height` to exactly the first 4 rows (measured via `getBoundingClientRect`, plus padding),
- enables `overflow-y: auto` with `overscroll-behavior: contain`,
- keeps everything else untouched, so the picker behaves like a normal scrollable browser menu.

The host half is an empty `apply()` so the row mounts in the Loader. No server state, no network calls, no stored data.

## Uninstall

Remove the row from `cordis.patch.yml`, delete the `mode-scroll` folder, and drop the dependency + link, then restart `dsh web`.

## Security

- No keys, tokens, credentials, or personal data are read, stored, or transmitted.
- The plugin only inspects the picker menu's DOM geometry in the browser.
- No network requests are made by the plugin itself.

## License

MIT
