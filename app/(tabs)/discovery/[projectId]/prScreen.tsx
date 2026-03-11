import React, {useContext} from 'react';
import { View, Text } from 'react-native';
import {ProjectProvider} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import ProjectPrsScreen from "@/src/FeaturesScreens/ProjectScreens/ProjectPrsScreen";
import {useLocalSearchParams} from "expo-router";


const prScreen = () => {
    const {projectId} = useLocalSearchParams()

  return (
   <ProjectProvider projectId={projectId as any} mode={"user"}>
       <ProjectPrsScreen/>
   </ProjectProvider>
  );
};

export default prScreen;
