-- Postgres-ready DAO schema (SQLite uses dao_db.py init)
CREATE TABLE IF NOT EXISTS dao_proposals (
    id UUID PRIMARY KEY,
    l1_proposal_id VARCHAR(64),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposer VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'Active',
    votes_for BIGINT DEFAULT 0,
    votes_against BIGINT DEFAULT 0,
    votes_abstain BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dao_votes (
    id UUID PRIMARY KEY,
    proposal_id UUID REFERENCES dao_proposals(id),
    voter VARCHAR(64) NOT NULL,
    choice VARCHAR(16) NOT NULL,
    weight BIGINT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(proposal_id, voter)
);

CREATE TABLE IF NOT EXISTS treasury_allocations (
    id UUID PRIMARY KEY,
    proposal_id UUID,
    chain VARCHAR(32) NOT NULL,
    asset VARCHAR(32) NOT NULL,
    amount TEXT NOT NULL,
    recipient VARCHAR(128) NOT NULL,
    spend_limit_usd NUMERIC,
    status VARCHAR(32) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY,
    action VARCHAR(64) NOT NULL,
    actor VARCHAR(64),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
