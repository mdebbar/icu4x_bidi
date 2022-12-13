import { ICU4XDataProvider } from "./lib/ICU4XDataProvider.js";
import { ICU4XBidi } from "./lib/ICU4XBidi.js";
import { default as wasm } from "./lib/diplomat-wasm.mjs";

const SAMPLE_TEXT_ARRAY = [
    "a",
    "b",
    "(",
    "c",
    ")",
];
const SAMPLE_TEXT = SAMPLE_TEXT_ARRAY.join('');

async function main() {
    const provider = new ICU4XDataProvider(wasm.skiawasm_get_provider(), true, []);
    const bidi = ICU4XBidi.create(provider);
    const bidiInfo = bidi.for_text(SAMPLE_TEXT, 1);

    const paragraph = bidiInfo.paragraph_at(0);
    const reordered = paragraph.reorder_line(paragraph.range_start(), paragraph.range_end());

    // Print each character separately on its own line.
    console.log("Input:");
    printChars(SAMPLE_TEXT);
    console.log("");
    console.log("Reordered:");
    printChars(reordered);
}

function printChars(text) {
    for (let i = 0; i < text.length; i++) {
        console.log('>>', text[i]);
    }
}

main();
