import React from 'react';
import { View, Text } from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectLayoutScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectLayoutScreen";
import {Id} from "@/convex/_generated/dataModel";

const Index = () => {
    const {projectId} = useLocalSearchParams()

    return (
        <ProjectProvider projectId={projectId as Id<"projects">} mode={"admin"}>
                <ProjectLayoutScreen/>
        </ProjectProvider>
    )

};

export default Index;
