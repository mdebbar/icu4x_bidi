#!/usr/bin/env python3
# This file is part of ICU4X. For terms of use, please see the file
# called LICENSE at the top level of the ICU4X source tree
# (online at: https://github.com/unicode-org/icu4x/blob/main/LICENSE ).

import sys
import subprocess

ICU4X_SYMBOLS = [
    "ICU4XBidi_create",
    "ICU4XBidi_for_text",
    "ICU4XBidiInfo_size",
    "ICU4XBidiInfo_level_at",
    "ICU4XBidiInfo_destroy",

    # "ICU4XBidiInfo_paragraph_at",
    # "ICU4XBidiParagraph_range_start",
    # "ICU4XBidiParagraph_range_end",
    # "ICU4XBidiParagraph_reorder_line",
]

DIPLOMAT_SYMBOLS = [
    "diplomat_init",
    # "diplomat_simple_writeable",
    # "diplomat_buffer_writeable_create",
    # "diplomat_buffer_writeable_get_bytes",
    # "diplomat_buffer_writeable_len",
    # "diplomat_buffer_writeable_destroy",
    "diplomat_alloc",
    "diplomat_free",
]

def main():
    new_argv = []
    is_export = False
    for arg in sys.argv[1:]:
        if is_export:
            if arg.startswith("ICU4X"):
                if arg in ICU4X_SYMBOLS:
                    new_argv += ["--export", arg]
            elif arg.startswith("diplomat"):
                if arg in DIPLOMAT_SYMBOLS:
                    new_argv += ["--export", arg]
            else:
                new_argv += ["--export", arg]
            is_export = False
        elif arg == "--export":
            is_export = True
        elif arg == "--export-dynamic":
            is_export = False
            # skip
        else:
            new_argv += [arg]
            is_export = False
    result = subprocess.run(["lld-14"] + new_argv, stdout=sys.stdout, stderr=sys.stderr)
    return result.returncode

if __name__ == "__main__":
    sys.exit(main())
