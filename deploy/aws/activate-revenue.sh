#!/usr/bin/env bash
# Canonical entry — delegates to scripts/activate-revenue.sh
exec "$(cd "$(dirname "$0")/../.." && pwd)/scripts/activate-revenue.sh" "$@"
