#!/usr/bin/env bash
# Delegates to deploy/aws/activate-revenue.sh (canonical Step 5)
exec "$(cd "$(dirname "$0")/.." && pwd)/deploy/aws/activate-revenue.sh" "$@"
