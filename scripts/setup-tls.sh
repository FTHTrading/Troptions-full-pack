#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSL_DIR="$ROOT/docker/nginx/ssl"
mkdir -p "$SSL_DIR"
if [[ -f "$SSL_DIR/cert.pem" && -f "$SSL_DIR/key.pem" ]]; then
  echo "TLS certs already present in $SSL_DIR"
  exit 0
fi
if command -v openssl >/dev/null 2>&1; then
  bash "$SSL_DIR/gen-self-signed.sh"
else
  python3 -c "
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import datetime
key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
subject = issuer = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'localhost')])
cert = (
    x509.CertificateBuilder()
    .subject_name(subject).issuer_name(issuer)
    .public_key(key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.datetime.utcnow())
    .not_valid_after(datetime.datetime.utcnow() + datetime.timedelta(days=3650))
    .sign(key, hashes.SHA256())
)
open('$SSL_DIR/cert.pem','wb').write(cert.public_bytes(serialization.Encoding.PEM))
open('$SSL_DIR/key.pem','wb').write(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))
"
fi
echo "TLS ready: $SSL_DIR/cert.pem"
