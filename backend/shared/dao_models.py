"""Pydantic models for TROPTIONS Full DAO."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ProposalStatus(str, Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    PASSED = "Passed"
    FAILED = "Failed"
    EXECUTED = "Executed"
    CANCELLED = "Cancelled"


class VoteChoice(str, Enum):
    FOR = "for"
    AGAINST = "against"
    ABSTAIN = "abstain"


class ProposalCreate(BaseModel):
    title: str
    description: str
    proposer: str = Field(..., description="32-byte hex account id")
    action_uri: Optional[str] = None


class ProposalRecord(BaseModel):
    proposal_id: str
    proposer: str
    title: str
    description: str
    status: str
    votes_for: int = 0
    votes_against: int = 0
    votes_abstain: int = 0
    voting_ends_at: int = 0
    timelock_until: int = 0
    created_at: Optional[datetime] = None


class VoteRequest(BaseModel):
    proposal_id: str
    voter: str
    choice: VoteChoice = VoteChoice.FOR


class TreasuryEntry(BaseModel):
    id: str
    chain: str
    asset: str
    address: str
    balance_hint: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TreasuryAllocation(BaseModel):
    proposal_id: Optional[str] = None
    chain: str
    asset: str
    amount: str
    recipient: str
    spend_limit_usd: Optional[float] = None
    status: str = "pending"


class AuditLogEntry(BaseModel):
    id: str
    action: str
    actor: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MemberRecord(BaseModel):
    owner: str
    namespace: Optional[str] = None
    brand_domain: Optional[str] = None
    soulbound_count: int = 0
    enrollment_id: Optional[str] = None
    credentials: List[Dict[str, Any]] = Field(default_factory=list)


class DaoStateResponse(BaseModel):
    l1: Dict[str, Any]
    governance: Dict[str, Any]
    treasury: List[TreasuryEntry]
    proposals: List[ProposalRecord]
    members_count: int = 0
