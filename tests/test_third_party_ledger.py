from __future__ import annotations

import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from verify_third_party_ledger import VerificationError, verify  # noqa: E402


def write_fixture(root: Path, *, ledger_complete: bool = True) -> None:
    vendor = root / "shared" / "vendor" / "demo-v1"
    vendor.mkdir(parents=True)
    payload = b"demo-bytes\n"
    license_bytes = b"Demo license\n"
    files = {
        "demo.js": f"sha256:{hashlib.sha256(payload).hexdigest()}",
        "LICENSE": f"sha256:{hashlib.sha256(license_bytes).hexdigest()}",
    }
    (vendor / "demo.js").write_bytes(payload)
    (vendor / "LICENSE").write_bytes(license_bytes)
    source = {
        "schema": "axm.vendored-dependency/v1",
        "name": "demo",
        "version": "v1",
        "license": "MIT",
        "source": "https://example.invalid/demo/v1",
        "files": files,
        "runtime_network_required": False,
    }
    (vendor / "SOURCE.json").write_text(json.dumps(source, indent=2) + "\n", encoding="utf-8")
    entry = {
        "name": "demo",
        "version": "v1",
        "license": "MIT",
        "source": "https://example.invalid/demo/v1",
        "vendorRoot": "shared/vendor/demo-v1",
        "sourceManifest": "shared/vendor/demo-v1/SOURCE.json",
        "runtimeNetworkRequired": False,
        "files": files,
    }
    ledger = {
        "schema": "axm-third-party-v1",
        "repository": "fixture",
        "project_license": "Apache-2.0",
        "audit": {"status": "verified-local-vendor-inventory", "complete": ledger_complete, "note": "fixture"},
        "entries": [entry] if ledger_complete else [],
    }
    (root / "THIRD_PARTY.json").write_text(json.dumps(ledger, indent=2) + "\n", encoding="utf-8")


class ThirdPartyLedgerTests(unittest.TestCase):
    def test_valid_fixture_passes_with_closed_authority(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            receipt = verify(root)
            self.assertEqual(receipt["status"], "PASS")
            self.assertEqual(receipt["vendorCount"], 1)
            self.assertEqual(receipt["verifiedFileCount"], 2)
            self.assertFalse(any(receipt["authority"].values()))
            self.assertFalse(receipt["networkUsed"])

    def test_incomplete_empty_ledger_holds(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root, ledger_complete=False)
            with self.assertRaisesRegex(VerificationError, "audit.complete"):
                verify(root)

    def test_tampered_vendor_bytes_hold(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            (root / "shared/vendor/demo-v1/demo.js").write_text("changed\n", encoding="utf-8")
            with self.assertRaisesRegex(VerificationError, "digest mismatch"):
                verify(root)

    def test_undeclared_vendor_file_holds(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            (root / "shared/vendor/demo-v1/extra.txt").write_text("extra\n", encoding="utf-8")
            with self.assertRaisesRegex(VerificationError, "manifest coverage mismatch"):
                verify(root)

    def test_ledger_source_mismatch_holds(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            path = root / "THIRD_PARTY.json"
            ledger = json.loads(path.read_text(encoding="utf-8"))
            ledger["entries"][0]["license"] = "Apache-2.0"
            path.write_text(json.dumps(ledger, indent=2) + "\n", encoding="utf-8")
            with self.assertRaisesRegex(VerificationError, "ledger/source mismatch"):
                verify(root)

    def test_duplicate_json_keys_hold(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            path = root / "THIRD_PARTY.json"
            raw = path.read_text(encoding="utf-8")
            raw = raw.replace('"schema": "axm-third-party-v1",', '"schema": "axm-third-party-v1",\n  "schema": "axm-third-party-v1",', 1)
            path.write_text(raw, encoding="utf-8")
            with self.assertRaisesRegex(VerificationError, "duplicate JSON key"):
                verify(root)

    def test_symlinked_vendor_payload_holds_when_supported(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            target = root / "shared/vendor/demo-v1/demo.js"
            target.unlink()
            outside = root / "outside.js"
            outside.write_text("demo-bytes\n", encoding="utf-8")
            try:
                target.symlink_to(outside)
            except (OSError, NotImplementedError):
                self.skipTest("symlinks unavailable")
            with self.assertRaisesRegex(VerificationError, "symlink file refused"):
                verify(root)

    def test_receipt_is_deterministic(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_fixture(root)
            self.assertEqual(verify(root), verify(root))


if __name__ == "__main__":
    unittest.main()
