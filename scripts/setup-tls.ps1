# Generate demo self-signed TLS for docker/nginx (local only).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$SslDir = Join-Path $Root "docker\nginx\ssl"
New-Item -ItemType Directory -Force -Path $SslDir | Out-Null
$cert = Join-Path $SslDir "cert.pem"
$key = Join-Path $SslDir "key.pem"
if ((Test-Path $cert) -and (Test-Path $key)) {
    Write-Host "TLS certs already present in $SslDir"
    exit 0
}

$py = @"
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import datetime
key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
subject = issuer = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'localhost')])
cert = (
    x509.CertificateBuilder()
    .subject_name(subject)
    .issuer_name(issuer)
    .public_key(key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.datetime.utcnow())
    .not_valid_after(datetime.datetime.utcnow() + datetime.timedelta(days=3650))
    .sign(key, hashes.SHA256())
)
open(r'$cert', 'wb').write(cert.public_bytes(serialization.Encoding.PEM))
open(r'$key', 'wb').write(
    key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.TraditionalOpenSSL,
        serialization.NoEncryption(),
    )
)
"@
python -c $py
if (-not ((Test-Path $cert) -and (Test-Path $key))) {
    Write-Error "Could not generate TLS cert (pip install cryptography)."
}
Write-Host "Wrote demo cert: $cert"
