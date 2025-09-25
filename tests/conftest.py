# Pytest configuration helpers
# Auto-added: ignore non-Python CSV misnamed as a test module
import os
import logging

_this_dir = os.path.dirname(__file__)
_csv_misnamed = os.path.join(_this_dir, "test_labels_csv.py")
if os.path.exists(_csv_misnamed):
    try:
        with open(_csv_misnamed, "rb") as _f:
            _prefix = _f.read(64)
        if _prefix.startswith(b"name,color,description"):
            if "collect_ignore" not in globals():
                collect_ignore = []  # type: ignore[assignment]
            if "test_labels_csv.py" not in collect_ignore:
                collect_ignore.append("test_labels_csv.py")
    except OSError as _err:
        logging.debug("Unable to read %s: %s", _csv_misnamed, _err)