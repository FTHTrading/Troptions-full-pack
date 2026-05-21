#!/usr/bin/env bash
# Generate demo self-signed TLS cert for local nginx (NOT for public production).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout key.pem \
  -out cert.pem \
  -subj "/CN=localhost/O=TROPTIONS Demo/C=US"
chmod 600 key.pem
echo "Wrote $DIR/cert.pem and $DIR/key.pem (demo only — use certbot for production DNS)"
