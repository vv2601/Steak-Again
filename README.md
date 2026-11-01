# 01O0
Free-to-play simulator using fictional **01O0coin** currency.

## Notes
- Leaving a round mid-game forfeits the wager.
- Have fun please I worked hard on the game :3

## Update 2.3
Gem-Shop crates (TAGS / GRADIENTS), 5 new tags + 4 new gradients, Cases fake-common and rollback tip-over events (tease chance 80% -> 60%),
Aviamasters rebalance (RTP about 97%) and visual upgrade, global rebrand (01O0coin, Wager).

## Update 2.4
Quests replaced (daily: 500 rounds / 10,000 profit / 1 h; weekly: 4,000 rounds / 100,000 profit / 5 rank-ups / 5 h; playtime quests are fed by the shared playtime counter), playtime moved to the homepage, new header layout,
Gem-Shop cleanup (no rotation timer), crate-opening Skip button fixed in its own slot, cosmetic preview particles only on hover, rank layout fixes at 100% zoom,
`?h, ?m, ?s` daily quest timer, and a sidebar **about:blank** toggle.

## Update 2.45
- **Rank Expansion 2**: Rank-Up page 3; Extreme Demon -> Extreme Demon I; new ranks Extreme Demon II/III, Impossible Demon I-III, Unreal I-III, Division 5-1 (max). Icons `impossibledemon/unreal/div5..div1.jpg` are white placeholders: replace the files, keep the names.
- **Speeds** (animation only): Cases 1.5x Silver, 2x Amethyst, 2.5x Impossible Demon I; Aviamasters 1.5x Silver, 2x Amethyst, 2.5x Division 5, 2.75x Division 1 (shown beside the Launch button). Rank-Up reward lines are generated from `CFG`.
- **Calculator landing page** (`index.html`); the game moved to `game.html`. Typing `0 - 100` then `=` opens the game in an about:blank tab (calculator + game as two views). If pop-ups are blocked the tab navigates calculator <-> game instead. The sidebar about:blank button was removed.
- **Aviamasters** RTP ~96.8% -> ~98.3% (lower runway-slide chances; rocket/item odds unchanged).
- **Anti-macro**: `guard.js` now analyses every trusted click (including ones ignored during a Cases spin), catches fast/regular autoclickers, escalates the cool-down and keeps it across refreshes.

## Latest changes
- **Right Shift** (tap it on its own) toggles between the calculator and the game instead of Backspace. Backspace is now always the calculator's delete key. The tip in the game header says so.
- **Calculator page**: light/dark mode switch (remembered in `localStorage`), a right-hand side bar with an interactive periodic table (`js/ptable.js`). Clicking the Gold (Au) element opens the game, the same way `0 - 100 =` does.
- **Removed** the cloud profile / cosmetics cloud-sync integration (its script, demo page and settings panel). Saves are local only.

## Tests
`node tests/update245.test.js`, `node tests/update23.test.js`, `node tests/economy.test.js`, `node tests/security.test.js`
