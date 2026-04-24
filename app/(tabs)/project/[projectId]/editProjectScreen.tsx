import React from 'react';
import { View, Text } from 'react-native';
import EditProjectScreen from "@/src/FeaturesScreens/ProjectEditableScreens/EditProjectScreen";
import {useLocalSearchParams} from "expo-router";

const editProjectScreen = () => {
    const { projectId } = useLocalSearchParams()

  return (
    <EditProjectScreen
        projectId = {projectId}
    />
  );
};

export default editProjectScreen;
