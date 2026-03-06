import React from 'react';
import {View, Text} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectLayoutScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectLayoutScreen";
import {Id} from "@/convex/_generated/dataModel";

const Index = () => {
    const {projectId} = useLocalSearchParams()

    return (
        <ProjectProvider projectId={projectId as Id<"projects">} mode={"admin"}>
            <ProjectLayoutScreen
                onCommits={() => {
                    router.push(`/project/${projectId}/commitsScreen`)

                }}
                onPr={() => {
                    router.push(`/project/${projectId}/prScreen`)

                }}
                onOpenIssue={() => {
                    router.push(`/project/${projectId}/issueScreen`)

                }}
                onRequestOpen={() => {
                    router.push(`/project/${projectId}/requestScreen`)

                }}
                onOpenHealth={() => {

                }}
                onOpenEditAbout={(about) => {
                    router.push({
                        pathname:`/project/${projectId}/editAboutScreen`,
                        params: { projectId, about }
                    })

                }}
            />
        </ProjectProvider>
    )

};

export default Index;
