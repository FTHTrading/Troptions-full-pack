#!/usr/bin/env bash
# Thin wrapper — full stack quickstart lives in quickstart-all.sh
exec "$(dirname "$0")/quickstart-all.sh" "$@"
