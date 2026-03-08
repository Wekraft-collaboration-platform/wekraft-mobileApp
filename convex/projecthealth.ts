"use node";

import {v} from "convex/values";
import { action } from "./_generated/server";
import {api} from "./_generated/api";


import {
    calculateActivityMomentumScore,
    calculateCommunityTrustScore,
    calculateFreshnessScore
} from "./projecthealthhelper";


type HealthHistoryEntry = {
    totalScore: number;
    calculatedDate: string;
};

// ==========================================
// maintenanceQuality (0–35) SCORE AI
// ===========================================
async function calculateMaintenanceQualityScore(
    description: string,
    about: string,
    tags: string[],
    languages: string[]
): Promise<number> {
    try {
        const prompt = `
          You are an expert software quality auditor. Evaluate the "Maintenance Quality" of a software project based on the following metadata.
          
          Project Description: "${description}"
          About/README content length: ${about.length} characters
          Tags: ${tags.join(", ")}
          Languages: ${languages.join(", ")}
    
          Criteria (Total 35 points):
          1. Documentation presence (Is there a description? Is the README substantial?): 0-15 pts
          2. Tech Stack Clarity (Are languages and tags consistent and standard?): 0-10 pts
          3. Project Metadata Completeness (Are fields filled out?): 0-10 pts
    
          Return ONLY a single integer number between 0 and 35 representing the score. Do not provide any explanation or text.
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.1,
                messages: [{ role: "user", content: prompt }],
            }),
        });
        const data = await response.json();
        console.log("response score from AI", data);
        const content = data.choices?.[0]?.message?.content?.trim();


        const score = parseInt(content, 10);
        console.log("score from AI after parsing...", score);

        if (isNaN(score)) return 0;
        return Math.max(0, Math.min(35, score));
    }
    catch (error) {
        console.error("Error calculating maintenance quality score:", error);
        return 0; // Default to 0 on error
    }
}

// =========================================
// Function to get the all stats to calculate project health score
// ===========================================

export const getProjectHealthScore = action({
    args:{
        projectId : v.id("projects")
    },
    handler : async(ctx,args)=>{

        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Call the get ProjectHealthScroe with out Authenticate")
        }

        const ProjectData = await ctx.runQuery(api.projects.getProjectById,{
            projectId:args.projectId
        })

        if(!ProjectData){
            throw new Error("Call the get ProjectHealthScroe with out Project Exixts ")
        }


        // 1. Fetch live activity data from GitHub
        const [projectHealth, projectLanguages] = await Promise.all([
            ctx.runAction(api.github.getProjectHealthData, {
                owner: ProjectData.repoOwner,
                repo: ProjectData.repoName,
            }),
            ctx.runAction(api.github.fetchRepoLanguages, {
                owner: ProjectData.repoOwner,
                repo: ProjectData.repoName,
            })
        ])



        // 2. Extract metrics (safe defaults)
        const velocity60Days = projectHealth?.commitsLast60Days ?? 0;
        const lastCommitDate = projectHealth?.lastCommitDate ?? null;
        const prMergeRate = projectHealth?.prMergeRate ?? 0;
        const totalPr = projectHealth?.totalPRs ?? 0;
        const mergedPr = projectHealth?.mergedPRs ?? 0;

        const projectAbout = ProjectData.about || "no about (readme/docs) provided by user yet";
        const projectTags = ProjectData.tags || [];
        // @ts-ignore
        const projectlanguages = projectLanguages?.breakdown.map((lang) => lang.language) ?? [];
        const projectStars = ProjectData.projectStars ?? 0;
        const projectForks = ProjectData.projectForks ?? 0;
        const projectUpvotes = ProjectData.projectUpvotes ?? 0;
        const projectDescription = ProjectData.description || "no description provided by user yet";

        console.log("Metrics extracted:", {
            velocity60Days,
            lastCommitDate,
            prMergeRate,
            projectStars,
        });


        // 3. Calculate Component Scores
        const activityMomentum =  calculateActivityMomentumScore({
            commitsLast60Days: velocity60Days,
            totalPRs: totalPr,
            mergedPRs: mergedPr,
            prMergeRate: prMergeRate,
            lastCommitDate: lastCommitDate,
        });
        console.log("Activity Momentum:", activityMomentum);

        const communityTrust = calculateCommunityTrustScore({
            projectStars: projectStars,
            projectForks: projectForks,
            projectUpvotes: projectUpvotes,
        });
        console.log("Community Trust:", communityTrust);

        const freshness =  calculateFreshnessScore({
            lastCommitDate: lastCommitDate,
            commitsLast60Days: velocity60Days,
        });
        console.log("Freshness:", freshness);

        const maintenanceQuality = await calculateMaintenanceQualityScore(
            projectDescription,
            projectAbout,
            projectTags,
            projectlanguages
        );
        console.log("Maintenance Quality (AI):", maintenanceQuality);

        // 4. Aggregate Total
        const totalScore = activityMomentum + communityTrust + freshness + maintenanceQuality;
        const finalTotal = Math.max(0, Math.min(100, Math.round(totalScore)));
        console.log("Final Calculated Score:", finalTotal);

        // 5. Construct Health Object

        const previousScores: HealthHistoryEntry[] =
            ProjectData.healthScore?.previousScores ?? [];

        const newHistoryEntry = {
            totalScore: finalTotal,
            calculatedDate: new Date().toISOString().split("T")[0],
        };

        // Keep latest 2
        const updatedHistory = [newHistoryEntry, ...previousScores].slice(0, 2);

        return {
            totalScore: finalTotal,
            activityMomentum,
            maintenanceQuality,
            communityTrust,
            freshness,
            lastCalculatedDate: new Date().toISOString().split("T")[0],
            previousScores: updatedHistory,
        };



    }
})

