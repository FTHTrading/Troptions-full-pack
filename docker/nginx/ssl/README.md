# TLS for local / demo nginx

**Demo:** Self-signed `cert.pem` + `key.pem` may be committed for `docker compose` smoke tests. Regenerate with:

```bash
./gen-self-signed.sh
```

**Production:** Use Let's Encrypt (certbot) on real hostnames after DNS cutover. `ai.troptions.org` / `ttn.troptions.org` are **Future DNS** (see `docs/DOMAIN_TRUTH_TABLE.md`). Live today: unykorn.org family. Do not ship production traffic on self-signed certs.

Private keys are listed in `.gitignore`; if you regenerate, run `scripts/setup-tls.sh` from the repo root.
