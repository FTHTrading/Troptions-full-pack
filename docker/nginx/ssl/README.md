# TLS for local / demo nginx

**Demo:** Self-signed `cert.pem` + `key.pem` may be committed for `docker compose` smoke tests. Regenerate with:

```bash
./gen-self-signed.sh
```

**Production:** Use Let's Encrypt (certbot) on real hostnames (`dao.troptions.org`, etc.). Do not ship production traffic on self-signed certs.

Private keys are listed in `.gitignore`; if you regenerate, run `scripts/setup-tls.sh` from the repo root.
