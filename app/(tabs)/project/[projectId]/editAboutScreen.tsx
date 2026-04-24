import React from 'react';
import { View, Text } from 'react-native';
import ProjectEditAboutScreen from "@/src/FeaturesScreens/ProjectEditableScreens/ProjectEditAboutScreen";
import {useLocalSearchParams} from "expo-router";

const editAboutScreen = () => {
    const { projectId, about } = useLocalSearchParams<{
        projectId: string;
        about: string;
    }>();
  return (
    <ProjectEditAboutScreen
        projectId={projectId}
        about={about}
    />
  );
};

export default editAboutScreen;
