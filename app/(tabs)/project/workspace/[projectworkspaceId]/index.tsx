import React from 'react';
import { View, Text } from 'react-native';
import ProjectTasksScreen from "@/src/FeaturesScreens/ProjectWorkspace/ProjectTasks";
import {useLocalSearchParams} from "expo-router";

const index = () => {
    const params = useLocalSearchParams();
    const slug = params.slug as string;
    console.log("Slug is : ",slug)

  return (
    <ProjectTasksScreen/>
  );
};

export default index;
