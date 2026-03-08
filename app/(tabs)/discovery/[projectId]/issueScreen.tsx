import React from 'react';
import { View, Text } from 'react-native';
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectIssueScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectIssueScreen";
import {useLocalSearchParams} from "expo-router";


const issueScreen = () => {

    const {projectId} = useLocalSearchParams()
  return (
    <ProjectProvider projectId={projectId as any} mode={"user"}>
        <ProjectIssueScreen/>
    </ProjectProvider>
  );
};

export default issueScreen;
