import React from 'react';
import { View, Text } from 'react-native';
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectCommitsScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectCommitsScreen";
import {useLocalSearchParams} from "expo-router";

const commitsScreen = () => {
    const {projectId} = useLocalSearchParams()

  return (
      <ProjectProvider projectId={projectId as any} mode={"admin"}>
          <ProjectCommitsScreen/>
      </ProjectProvider>
  );
};

export default commitsScreen;
