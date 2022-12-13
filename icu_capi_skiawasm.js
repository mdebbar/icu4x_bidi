// This file is part of ICU4X. For terms of use, please see the file
// called LICENSE at the top level of the ICU4X source tree
// (online at: https://github.com/unicode-org/icu4x/blob/main/LICENSE ).

import { ICU4XDataProvider } from "./lib/ICU4XDataProvider.js";
import { ICU4XBidi } from "./lib/ICU4XBidi.js";

let wasm;
let provider;
let bidi;

await init();

async function init() {
  wasm = (await import("./lib/diplomat-wasm.mjs")).default;
  provider = new ICU4XDataProvider(wasm.skiawasm_get_provider(), true, []);
  bidi = ICU4XBidi.create(provider);
};

export function getBidiRegions(text) {
  const bidiInfo = bidi.for_text(text);

  const bidiRegions = [];
  const size = bidiInfo.size();
  let currentLevel = bidiInfo.level_at(0);
  let start = 0;

  for (let i = 0; i < size; i++) {
    const level = bidiInfo.level_at(i);
    if (level !== currentLevel) {
      bidiRegions.push(start, i, currentLevel);
      currentLevel = level;
      start = i;
    }
  }
  bidiRegions.push(start, size, currentLevel);
  return bidiRegions;
}
