#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Foundation Planet requires Node.js 18 or newer." >&2
  echo "Download it from https://nodejs.org/" >&2
  exit 1
fi

exec node scripts/serve.mjs "$@"
