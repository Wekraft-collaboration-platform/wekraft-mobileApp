import React from 'react';
import { View, Text } from 'react-native';
import {ProfileProvider} from "@/src/FeaturesScreens/profileScreen/ProfiletProvider";
import PublicProfileScreen from "@/src/FeaturesScreens/profileScreen/PublicProfileScreen";
import { Id } from "@/convex/_generated/dataModel";
import {router} from "expo-router";

const publicProfile = () => {
    return (
        <ProfileProvider mode={"admin"}>
            <PublicProfileScreen
                onProjectSelected={
                    (projectId: Id<"projects">) =>{
                        router.push({
                            pathname: `profile/${projectId}`,
                            params: { projectId }
                        })
                    }
                }/>
   </ProfileProvider>
  );
};

export default publicProfile;
