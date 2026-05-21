FROM rust:1-bookworm AS builder
WORKDIR /app
COPY . .
RUN cargo build -p node --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/troptions-node /usr/local/bin/troptions-node
EXPOSE 9944 9945
ENTRYPOINT ["troptions-node"]
