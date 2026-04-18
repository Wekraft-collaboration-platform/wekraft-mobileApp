import React, {useContext} from 'react';
import { View, Text } from 'react-native';
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectRequestScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectRequestScreen";
import {useLocalSearchParams} from "expo-router";


const requestScreen = () => {
    const {projectId} = useLocalSearchParams()

    return (
        <ProjectProvider projectId={projectId as any} mode={"admin"}>
            <ProjectRequestScreen/>
        </ProjectProvider>
    );
};

export default requestScreen;
