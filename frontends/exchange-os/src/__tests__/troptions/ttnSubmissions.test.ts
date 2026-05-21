import {
  TTN_SUBMISSIONS,
  getSubmission,
  getSubmissionsNeedingRights,
  getSubmissionsNeedingProof,
  getSubmissionsByType,
  getSubmissionsByCreator,
  getSubmissionsByStatus,
  getPendingReviewSubmissions,
  type Submission,
} from "@/content/ttn/submissionRegistry";

describe("TTN Submission Registry", () => {
  it("loads submissions array", () => {
    expect(TTN_SUBMISSIONS.length).toBeGreaterThan(0);
  });

  it("every submission has simulationOnly true", () => {
    TTN_SUBMISSIONS.forEach((s) => {
      expect(s.simulationOnly).toBe(true);
    });
  });

  it("every submission has livePublishingEnabled false", () => {
    TTN_SUBMISSIONS.forEach((s) => {
      expect(s.livePublishingEnabled).toBe(false);
    });
  });

  it("no submission has token/NFT/revenue fields", () => {
    TTN_SUBMISSIONS.forEach((s) => {
      expect(s).not.toHaveProperty("tokenAddress");
      expect(s).not.toHaveProperty("revenueShare");
      expect(s).not.toHaveProperty("nftId");
    });
  });

  it("rights review queue excludes approved/rejected statuses", () => {
    getSubmissionsNeedingRights().forEach((s) => {
      expect(s.status).not.toBe("approved");
      expect(s.status).not.toBe("rejected");
    });
  });

  it("pending IPFS proof excludes already-pinned records", () => {
    getSubmissionsNeedingProof().forEach((s) => {
      expect(s.ipfsStatus).not.toBe("pinned");
    });
  });

  it("getSubmission returns correct record by id", () => {
    const s = TTN_SUBMISSIONS[0];
    expect(getSubmission(s.id)).toEqual(s);
  });

  it("getSubmission returns undefined for unknown id", () => {
    expect(getSubmission("not-real-id")).toBeUndefined();
  });

  it("covers all 8 submission types", () => {
    const types = new Set(TTN_SUBMISSIONS.map((s) => s.type));
    expect(types.size).toBe(8);
  });

  it("getSubmissionsByType returns only matching type", () => {
    const videos = getSubmissionsByType("video");
    videos.forEach((s) => {
      expect(s.type).toBe("video");
    });
  });

  it("getSubmissionsByStatus returns only matching status", () => {
    const submitted = getSubmissionsByStatus("submitted");
    submitted.forEach((s) => {
      expect(s.status).toBe("submitted");
    });
  });

  it("getSubmissionsByCreator returns only that creator's records", () => {
    const creatorId = TTN_SUBMISSIONS[0].creatorId;
    const results = getSubmissionsByCreator(creatorId);
    results.forEach((s: Submission) => {
      expect(s.creatorId).toBe(creatorId);
    });
  });

  it("getPendingReviewSubmissions returns submitted or under_review only", () => {
    getPendingReviewSubmissions().forEach((s) => {
      expect(["submitted", "under_review"]).toContain(s.status);
    });
  });

  it("every submission has required base fields", () => {
    TTN_SUBMISSIONS.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.creatorId).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.type).toBeTruthy();
      expect(s.status).toBeTruthy();
      expect(s.rightsStatus).toBeTruthy();
      expect(s.ipfsStatus).toBeTruthy();
      expect(s.createdAt).toBeTruthy();
      expect(s.updatedAt).toBeTruthy();
    });
  });
});
