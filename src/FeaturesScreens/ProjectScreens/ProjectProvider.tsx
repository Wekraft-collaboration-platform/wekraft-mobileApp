import {Id} from "@/convex/_generated/dataModel";
import {createContext, useContext} from "react";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";


type ProjectMode = "admin" | "user"

type ProjectContextType = {
    projectId: Id<"projects">,
    mode: ProjectMode,
    project: any,
    user: any,
}

const ProjectContext =createContext<ProjectContextType | null>(null)


export function ProjectProvider({
    projectId,
    mode,
    children,
                                }:{
    projectId: Id<"projects">;
    mode: ProjectMode;
    children: React.ReactNode;
}) {

    const project = useQuery(api.projects.getProjectById,{projectId})
    const user = useQuery(api.users.getCurrentUser)

if(!project || !user) return null;


    return (
        <ProjectContext.Provider
        value={{projectId, project, user, mode}}
        >
            {children}

        </ProjectContext.Provider>
    )


}
export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error("useProject must be used inside ProjectProvider");
    }
    return ctx;
}
