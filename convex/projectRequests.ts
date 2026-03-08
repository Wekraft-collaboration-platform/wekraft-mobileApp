
import {ConvexError, v} from "convex/values";
import {mutation, query} from "./_generated/server";


export const getProjectRequests = query({
    args:{
        projectId : v.id("projects")
    },
    handler : async(ctx,args)=>{
        // Auth
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) {
            throw  new Error("Calling getProjects Unauthenticated")
        }


        // Is User exixits
        const user = await  ctx.db.query("users")
            .withIndex("by_clerkId",(c)=>c.eq("clerkId",identity.subject))
            .first()

        if(!user){
            throw  new Error("Calling GetProjects User not found")
        }

        // is Project Exitis
        const project = await ctx.db.query("projects")
            .withIndex("by_id",(c)=>c.eq("_id",args.projectId))
            .first()

        if(!project){
            throw  new Error("Calling GetProjects Project not found")
        }

        const isOwner = project.ownerId === user._id;
        // const isAdmin = project.admins?.includes(user._id);

        if (!isOwner ) {
            throw new Error("Forbidden");
        }

        // 5️⃣ Scoped, indexed query
        return await ctx.db
            .query("projectJoinRequests")
            .withIndex("by_project", q =>
                q.eq("projectId", args.projectId)
            )
            .order("desc")
            .collect();
    },


})



export const sendProjectRequest = mutation({
    args:{
        projectId : v.id("projects"),
        message : v.optional(v.string()),
        userId : v.id("users"),
        userName : v.string(),
        userImage : v.optional(v.string()),
        role : v.string(),
    },
    handler : async (ctx,args) => {
        // Auth
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) {
            throw  new Error("Calling sendRequest Unauthenticated")
        }


        // Is User exixits
        const user = ctx.db.query("users")
            .withIndex("by_clerkId",(c)=>c.eq("clerkId",identity.subject))
            .first()

        if(!user){
            throw  new Error("Calling sendRequest User not found")
        }

        // is Project Exitis
        const project = ctx.db.query("projects")
            .withIndex("by_id",(c)=>c.eq("_id",args.projectId))
            .first()

        if(!project){
            throw  new Error("Calling sendRequest Project not found")
        }

        // Check if send already
        const request = await ctx.db.query("projectJoinRequests")
            .withIndex("by_user",(c)=>c.eq("userId",args.userId))
            .first()

        if(request){
            throw new ConvexError("Already Send")
        }

        await ctx.db.insert("projectJoinRequests", {
            message: args.message,
            projectId: args.projectId,
            source: "manual",
            status: "pending",
            userId: args.userId,
            userImage: args.userImage,
            userName: args.userName,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            role: args.role
        })

        console.log("Request send")

        return



    }
})

