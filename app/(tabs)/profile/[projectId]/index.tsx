import React, {useState} from 'react';
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
                    router.push(`/profile/${projectId}/commitsScreen`)

                }}
                onPr={() => {
                    router.push(`/profile/${projectId}/prScreen`)

                }}
                onOpenIssue={() => {
                    router.push(`/profile/${projectId}/issueScreen`)

                }}
                onRequestOpen={() => {
                    router.push(`/profile/${projectId}/requestScreen`)

                }}
                onOpenEditProject={()=>{
                    router.push({
                        pathname: `/profile/${projectId}/editProjectScreen`,
                        params: { projectId },
                    })
                }}
                onOpenEditAbout={(about) => {
                    router.push({
                        pathname:`/profile/${projectId}/editAboutScreen`,
                        params: { projectId, about }
                    })

                }}
            />

        </ProjectProvider>
    )

};

export default Index;
