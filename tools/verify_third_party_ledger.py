#!/usr/bin/env python3
"""Verify complete local provenance coverage for vendored dependencies.

Offline only. This verifies repository-local declarations and bytes; it does not
contact upstream sources or make authorship, legal-suitability, or CANON claims.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path, PurePosixPath
from typing import Any

LEDGER_SCHEMA = "axm-third-party-v1"
SOURCE_SCHEMA = "axm.vendored-dependency/v1"
RECEIPT_SCHEMA = "axm-third-party-ledger-verification/v1"
SHA_RE = re.compile(r"^sha256:([0-9a-f]{64})$")


class VerificationError(RuntimeError):
    pass


def _reject_duplicate_pairs(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in pairs:
        if key in out:
            raise VerificationError(f"duplicate JSON key: {key}")
        out[key] = value
    return out


def _read_json_strict(path: Path) -> tuple[Any, bytes]:
    if path.is_symlink():
        raise VerificationError(f"symlink JSON input refused: {path}")
    try:
        raw = path.read_bytes()
    except OSError as exc:
        raise VerificationError(f"cannot read {path}: {exc}") from exc
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise VerificationError(f"non-UTF-8 JSON input: {path}") from exc
    try:
        value = json.loads(text, object_pairs_hook=_reject_duplicate_pairs)
    except VerificationError:
        raise
    except json.JSONDecodeError as exc:
        raise VerificationError(f"invalid JSON {path}: {exc.msg}") from exc
    return value, raw


def _require_dict(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise VerificationError(f"{label} must be an object")
    return value


def _require_string(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise VerificationError(f"{label} must be a non-empty string")
    return value


def _safe_relative_path(value: Any, label: str) -> str:
    text = _require_string(value, label)
    if "\\" in text:
        raise VerificationError(f"{label} must use POSIX separators: {text}")
    path = PurePosixPath(text)
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise VerificationError(f"unsafe relative path in {label}: {text}")
    return path.as_posix()


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _canonical_digest(value: Any) -> str:
    payload = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return _sha256(payload)


def _regular_files(root: Path) -> list[str]:
    found: list[str] = []
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        base = Path(dirpath)
        for dirname in list(dirnames):
            candidate = base / dirname
            if candidate.is_symlink():
                raise VerificationError(f"symlink directory refused in vendor tree: {candidate}")
        for filename in filenames:
            candidate = base / filename
            if candidate.is_symlink():
                raise VerificationError(f"symlink file refused in vendor tree: {candidate}")
            if not candidate.is_file():
                raise VerificationError(f"non-regular file refused in vendor tree: {candidate}")
            found.append(candidate.relative_to(root).as_posix())
    return sorted(found)


def verify(root: Path) -> dict[str, Any]:
    root = root.resolve()
    ledger_path = root / "THIRD_PARTY.json"
    ledger, ledger_raw = _read_json_strict(ledger_path)
    ledger = _require_dict(ledger, "THIRD_PARTY.json")
    if ledger.get("schema") != LEDGER_SCHEMA:
        raise VerificationError(f"unexpected ledger schema: {ledger.get('schema')!r}")

    audit = _require_dict(ledger.get("audit"), "THIRD_PARTY.json audit")
    if audit.get("complete") is not True:
        raise VerificationError("THIRD_PARTY.json audit.complete must be true for verified coverage")

    entries = ledger.get("entries")
    if not isinstance(entries, list):
        raise VerificationError("THIRD_PARTY.json entries must be an array")

    by_root: dict[str, dict[str, Any]] = {}
    for index, raw_entry in enumerate(entries):
        entry = _require_dict(raw_entry, f"ledger entry {index}")
        vendor_root = _safe_relative_path(entry.get("vendorRoot"), f"ledger entry {index} vendorRoot")
        if vendor_root in by_root:
            raise VerificationError(f"duplicate ledger vendorRoot: {vendor_root}")
        by_root[vendor_root] = entry

    vendor_base = root / "shared" / "vendor"
    if vendor_base.is_symlink() or not vendor_base.is_dir():
        raise VerificationError("shared/vendor must be a real directory")

    vendor_dirs = sorted(path for path in vendor_base.iterdir() if path.is_dir() and not path.is_symlink())
    refused_non_dirs = sorted(path.name for path in vendor_base.iterdir() if not path.is_dir() or path.is_symlink())
    if refused_non_dirs:
        raise VerificationError(f"shared/vendor contains unsupported non-directory entries: {', '.join(refused_non_dirs)}")

    expected_roots = [path.relative_to(root).as_posix() for path in vendor_dirs]
    if sorted(by_root) != expected_roots:
        missing = sorted(set(expected_roots) - set(by_root))
        extra = sorted(set(by_root) - set(expected_roots))
        raise VerificationError(f"vendor ledger coverage mismatch; missing={missing} extra={extra}")

    evidence: list[dict[str, Any]] = []
    total_files = 0
    total_bytes = 0

    for vendor_dir in vendor_dirs:
        vendor_root = vendor_dir.relative_to(root).as_posix()
        entry = by_root[vendor_root]
        source_manifest_rel = _safe_relative_path(entry.get("sourceManifest"), f"{vendor_root} sourceManifest")
        expected_source_manifest = f"{vendor_root}/SOURCE.json"
        if source_manifest_rel != expected_source_manifest:
            raise VerificationError(f"{vendor_root} sourceManifest must be {expected_source_manifest}")

        source, source_raw = _read_json_strict(root / source_manifest_rel)
        source = _require_dict(source, source_manifest_rel)
        if source.get("schema") != SOURCE_SCHEMA:
            raise VerificationError(f"unexpected source schema in {source_manifest_rel}: {source.get('schema')!r}")

        name = _require_string(source.get("name"), f"{source_manifest_rel} name")
        version = _require_string(source.get("version"), f"{source_manifest_rel} version")
        license_id = _require_string(source.get("license"), f"{source_manifest_rel} license")
        source_url = _require_string(source.get("source"), f"{source_manifest_rel} source")
        if not source_url.startswith("https://"):
            raise VerificationError(f"source URL must be HTTPS in {source_manifest_rel}")
        runtime_network_required = source.get("runtime_network_required")
        if not isinstance(runtime_network_required, bool):
            raise VerificationError(f"runtime_network_required must be boolean in {source_manifest_rel}")

        source_files = source.get("files")
        if not isinstance(source_files, dict) or not source_files:
            raise VerificationError(f"files must be a non-empty object in {source_manifest_rel}")

        declared: dict[str, str] = {}
        for rel_value, digest_value in source_files.items():
            rel = _safe_relative_path(rel_value, f"{source_manifest_rel} file")
            if not isinstance(digest_value, str) or not SHA_RE.fullmatch(digest_value):
                raise VerificationError(f"invalid SHA-256 declaration for {vendor_root}/{rel}")
            declared[rel] = digest_value

        actual_tree_files = _regular_files(vendor_dir)
        actual_payload_files = [rel for rel in actual_tree_files if rel != "SOURCE.json"]
        if sorted(declared) != actual_payload_files:
            undeclared = sorted(set(actual_payload_files) - set(declared))
            absent = sorted(set(declared) - set(actual_payload_files))
            raise VerificationError(f"{vendor_root} manifest coverage mismatch; undeclared={undeclared} absent={absent}")

        verified_files: list[dict[str, Any]] = []
        for rel in sorted(declared):
            path = vendor_dir / rel
            raw = path.read_bytes()
            actual = f"sha256:{_sha256(raw)}"
            if actual != declared[rel]:
                raise VerificationError(f"digest mismatch for {vendor_root}/{rel}: expected {declared[rel]} got {actual}")
            total_files += 1
            total_bytes += len(raw)
            verified_files.append({"path": rel, "bytes": len(raw), "sha256": actual})

        mirror = {
            "name": name,
            "version": version,
            "license": license_id,
            "source": source_url,
            "vendorRoot": vendor_root,
            "sourceManifest": source_manifest_rel,
            "runtimeNetworkRequired": runtime_network_required,
            "files": {key: declared[key] for key in sorted(declared)},
        }
        for key, expected in mirror.items():
            if entry.get(key) != expected:
                raise VerificationError(f"ledger/source mismatch for {vendor_root} field {key}: expected {expected!r} got {entry.get(key)!r}")
        if sorted(entry.keys()) != sorted(mirror.keys()):
            extra = sorted(set(entry) - set(mirror))
            missing = sorted(set(mirror) - set(entry))
            raise VerificationError(f"ledger entry shape mismatch for {vendor_root}; extra={extra} missing={missing}")

        evidence.append({
            "vendorRoot": vendor_root,
            "sourceManifestSha256": f"sha256:{_sha256(source_raw)}",
            "name": name,
            "version": version,
            "license": license_id,
            "source": source_url,
            "runtimeNetworkRequired": runtime_network_required,
            "files": verified_files,
        })

    receipt_body = {
        "schema": RECEIPT_SCHEMA,
        "status": "PASS",
        "vendorCount": len(evidence),
        "verifiedFileCount": total_files,
        "verifiedFileBytes": total_bytes,
        "ledgerSha256": f"sha256:{_sha256(ledger_raw)}",
        "vendorEvidenceSha256": f"sha256:{_canonical_digest(evidence)}",
        "networkUsed": False,
        "authority": {"install": False, "promote": False, "publish": False, "merge": False, "canon": False},
    }
    receipt_body["receiptSha256"] = f"sha256:{_canonical_digest(receipt_body)}"
    return receipt_body


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args(argv)
    try:
        receipt = verify(args.root)
    except VerificationError as exc:
        print(json.dumps({"schema": RECEIPT_SCHEMA, "status": "HOLD", "reason": str(exc)}, sort_keys=True), file=sys.stderr)
        return 1
    print(json.dumps(receipt, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
