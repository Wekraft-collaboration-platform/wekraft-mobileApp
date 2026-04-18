import React from 'react';
import { View, Text } from 'react-native';
import {ProfileProvider} from "@/src/FeaturesScreens/profileScreen/ProfiletProvider";
import PublicProfileScreen from "@/src/FeaturesScreens/profileScreen/PublicProfileScreen";
import {router, useLocalSearchParams} from "expo-router";

const publicProfile = () => {
    const {userId} = useLocalSearchParams()
    return (
        <ProfileProvider mode={"user"} userId={userId as any}>
            <PublicProfileScreen
                onProjectSelected={
                (projectId)=>{
                    router.push({
                        pathname:`/project/${projectId}/userMode`,
                        params: { projectId,}
                    })
                } }
            />
        </ProfileProvider>
    );
};

export default publicProfile;
