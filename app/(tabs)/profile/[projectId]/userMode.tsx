
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectLayoutScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectLayoutScreen";
import {Id} from "@/convex/_generated/dataModel";

const userMode = () => {
    const {projectId} = useLocalSearchParams()

    return (
        <ProjectProvider projectId={projectId as Id<"projects">} mode={"user"}>
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
                onOpenEditAbout={(about) => {
                    console.log("Not Authorized")
                }}
            />

        </ProjectProvider>
    )

};

export default userMode;
