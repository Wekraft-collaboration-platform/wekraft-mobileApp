import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectLayoutScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectLayoutScreen";
import {Id} from "@/convex/_generated/dataModel";

const Index = () => {
    const {projectId} = useLocalSearchParams()

    const  [openProjectHealthDialog, setOpenProjectHealthDialog] = useState(false);

    return (
        <ProjectProvider projectId={projectId as Id<"projects">} mode={"user"}>
            <ProjectLayoutScreen
                onCommits={() => {
                    router.push(`/discovery/${projectId}/commitsScreen`)

                }}
                onPr={() => {
                    router.push(`/discovery/${projectId}/prScreen`)

                }}
                onOpenIssue={() => {
                    router.push(`/discovery/${projectId}/issueScreen`)

                }}
                onRequestOpen={() => {
                    router.push(`/discovery/${projectId}/requestScreen`)

                }}
                onOpenEditAbout={(about) => {
                    console.log("Not Authorized")
                    // router.push({
                    //     pathname:`/project/${projectId}/editAboutScreen`,
                    //     params: { projectId, about }
                    // })

                }}
            />

        </ProjectProvider>
    )

};

export default Index;
