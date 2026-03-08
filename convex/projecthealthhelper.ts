import { action } from "./_generated/server";
import {api} from "./_generated/api";

type ActivityInput = {
    commitsLast60Days: number | null;
    totalPRs: number | null;
    mergedPRs: number | null;
    prMergeRate: number | null; // 0–1 or 0–100 (we’ll normalize)
    lastCommitDate: string | null; // ISO string
};


// ===========================================
// Function to calculate activity momentum score (0-35)
// ===========================================
export function calculateActivityMomentumScore({
                                                   commitsLast60Days,
                                                   totalPRs,
                                                   mergedPRs,
                                                   prMergeRate,
                                                   lastCommitDate,
                                               }: ActivityInput): number {
    let score = 0;

    /* ---------------------------
       1. Commit Velocity (0–15)
    ----------------------------*/
    const commits = commitsLast60Days ?? 0;

    if (commits >= 20) score += 15;
    else if (commits >= 10) score += 10;
    else if (commits > 0) score += 5;
    else score += 0;

    /* ---------------------------
       2. PR Activity & Merge (0–10)
    ----------------------------*/
    const total = totalPRs ?? 0;
    const merged = mergedPRs ?? 0;

    let mergeRatio = prMergeRate ?? 0;

    // Normalize merge rate if it comes as %
    if (mergeRatio > 1) mergeRatio = mergeRatio / 100;

    if (total > 0) {
        if (merged >= 10 && mergeRatio >= 0.6) score += 10;
        else if (merged >= 5 && mergeRatio >= 0.4) score += 7;
        else if (merged > 0) score += 4;
        else score += 1;
    }

    /* ---------------------------
       3. Recency / Decay (0–10)
    ----------------------------*/
    if (lastCommitDate) {
        const lastCommit = new Date(lastCommitDate).getTime();
        const now = Date.now();
        const daysAgo = Math.floor((now - lastCommit) / (1000 * 60 * 60 * 24));

        if (daysAgo <= 7) score += 10;        // very good
        else if (daysAgo <= 14) score += 8;   // good
        else if (daysAgo <= 30) score += 5;   // okay
        else if (daysAgo <= 60) score += 2;   // decay
        else score += 0;                      // inactive
    }

    /* ---------------------------
       Final Clamp (0–35)
    ----------------------------*/
    return Math.max(0, Math.min(35, score));
}




// ===========================================
// COMMUNITY TRUST HEALTH SCORE (0-20)
// ===========================================
type CommunityTrustInput = {
    projectStars: number | null;
    projectForks: number | null;
    projectUpvotes: number | null;
};

export function calculateCommunityTrustScore({
                                                 projectStars,
                                                 projectForks,
                                                 projectUpvotes,
                                             }: CommunityTrustInput): number {
    const stars = projectStars ?? 0;
    const forks = projectForks ?? 0;
    const upvotes = projectUpvotes ?? 0;

    // Log scaling to avoid inflation
    const starScore = Math.log10(stars + 1) * 4;    // max ~6
    const forkScore = Math.log10(forks + 1) * 3;    // max ~4
    const upvoteScore = Math.log10(upvotes + 1) * 7; // max ~10

    const rawScore = starScore + forkScore + upvoteScore;

    // Normalize to 0–20
    return Math.max(0, Math.min(20, Math.round(rawScore)));
}

// ==========================================
// CALCULATE FRESHNESS SCORE HEATH SCORE
// ===========================================
type FreshnessInput = {
    lastCommitDate: string | null; // ISO string
    commitsLast60Days: number | null;
};

export  function calculateFreshnessScore({
                                             lastCommitDate,
                                             commitsLast60Days,
                                         }: FreshnessInput): number {
    if (!lastCommitDate) return 0;

    const commits = commitsLast60Days ?? 0;
    const lastCommit = new Date(lastCommitDate).getTime();
    const now = Date.now();

    const daysAgo = Math.floor((now - lastCommit) / (1000 * 60 * 60 * 24));

    let score = 0;

    // Recency (primary signal)
    if (daysAgo <= 7) score += 6;        // very fresh
    else if (daysAgo <= 14) score += 5;  // fresh
    else if (daysAgo <= 30) score += 3;  // okay
    else if (daysAgo <= 60) score += 1;  // stale
    else score += 0;                     // inactive

    // Velocity boost (secondary)
    if (commits >= 20) score += 4;
    else if (commits >= 10) score += 3;
    else if (commits > 0) score += 1;

    return Math.max(0, Math.min(10, score));
}

