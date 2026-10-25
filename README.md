# 01O0
Free-to-play casino simulator using fictional **01O0coin** currency.

## Notes
- Leaving a round mid-game forfeits the wager.
- Have fun please I worked hard on the game :3

## Update 2.3
Gem-Shop crates (TAGS / GRADIENTS), 5 new tags + 4 new gradients, Cases fake-common and rollback tip-over events (tease chance 80% -> 60%),
anti-autoclicker guard (`js/guard.js`), Aviamasters rebalance (RTP about 97%) and visual upgrade, global rebrand (01O0coin, Wager).
Installing over an existing repo: copy these files over it, then run `node tools/apply-update-2.3.js` (rebrand strings in the files not rewritten here, plus test expectations).
Save keys (`steak_v2*`) and the save-signing salt are intentionally NOT renamed so existing saves keep working.

## Update 2.4
Quests replaced (daily: 500 rounds / 10,000 profit / 1 h; weekly: 4,000 rounds / 100,000 profit / 5 rank-ups / 5 h; playtime quests are fed by the shared playtime counter), playtime moved to the homepage, new header layout,
Gem-Shop cleanup (no rotation timer), crate-opening Skip button fixed in its own slot, cosmetic preview particles only on hover, rank layout fixes at 100% zoom,
`?h, ?m, ?s` daily quest timer, and a sidebar **about:blank** toggle (opens the game in an about:blank tab; the loader only allows framing by that same-origin tab).
Overlay install: copy the files over the repo. Save keys are unchanged.

## Developer mode (testing only)
Serve the project locally (e.g. `npx serve .` or `python3 -m http.server`) and open `http://localhost:8000/?dev=1`.
A small panel appears bottom-left: **+999 Gems**, **Arm fake common**, **Arm tip-over**. Armed events fire on the next Cases spin, once.
`?dev=1&force=fake` / `?dev=1&force=tip` pre-arms the first Cases spin. `js/devmode.js` is only requested on localhost / 127.0.0.1 / file:// with `?dev=1`;
**do not ship `js/devmode.js` (or `tests/`, `tools/`) to production.** Normal odds are untouched when nothing is armed.

## Tests
`node tests/update23.test.js`, `node tests/economy.test.js`, `node tests/security.test.js`
