// This file is part of ICU4X. For terms of use, please see the file
// called LICENSE at the top level of the ICU4X source tree
// (online at: https://github.com/unicode-org/icu4x/blob/main/LICENSE ).

import { default as wasm } from "./lib/diplomat-wasm.mjs";
import {
  resultFlag,
  ptrRead,
  enumDiscriminant,
  FFIError,
  DiplomatBuf,
} from "./lib/diplomat-runtime.js";

const provider = wasm.skiawasm_get_provider();
const bidi = _createBidi(provider);

function _createBidi(provider) {
  // Copied (with some modifications) from ICU4XBidi::create located at:
  // https://github.com/unicode-org/icu4x/blob/main/ffi/diplomat/js/include/ICU4XBidi.js

  const diplomat_receive_buffer = wasm.diplomat_alloc(5, 4);
  wasm.ICU4XBidi_create(diplomat_receive_buffer, provider);
  const is_ok = resultFlag(wasm, diplomat_receive_buffer, 4);
  if (is_ok) {
    const ok_value = ptrRead(wasm, diplomat_receive_buffer);
    wasm.diplomat_free(diplomat_receive_buffer, 5, 4);
    return ok_value;
  } else {
    const throw_value = enumDiscriminant(wasm, diplomat_receive_buffer);
    wasm.diplomat_free(diplomat_receive_buffer, 5, 4);
    throw new FFIError(throw_value);
  }
}

export function getBidiRegions(text) {
  if (text.length === 0) {
    return [];
  }

  const textBuf = DiplomatBuf.str(wasm, text);
  const bidiInfo = wasm.ICU4XBidi_for_text(bidi, textBuf.ptr, textBuf.size, undefined);

  const bidiRegions = [];
  const size = wasm.ICU4XBidiInfo_size(bidiInfo);

  let currentLevel = wasm.ICU4XBidiInfo_level_at(bidiInfo, 0);
  let start = 0;

  for (let i = 1; i < size; i++) {
    const level =  wasm.ICU4XBidiInfo_level_at(bidiInfo, i);
    if (level !== currentLevel) {
      bidiRegions.push(start, i, currentLevel);
      currentLevel = level;
      start = i;
    }
  }
  bidiRegions.push(start, size, currentLevel);

  // Free the memory not needed anymore.
  wasm.ICU4XBidiInfo_destroy(bidiInfo);
  textBuf.free();

  return bidiRegions;
}
