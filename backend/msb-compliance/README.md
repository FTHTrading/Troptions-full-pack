# msb-compliance (PIPELINE)

AML/KYC/OFAC screening service — **port 4098**.

- **Label:** PIPELINE until provider integrations and MSB program are live.
- **Health:** `GET http://127.0.0.1:4098/health` returns `status: pipeline`.
- **PM2:** Superseded by `compliance-engine` in `fiat-rails/` (:4025). Do not start duplicate `msb-compliance` on :4098.

Do not claim live FinCEN MSB compliance from this stub alone.
