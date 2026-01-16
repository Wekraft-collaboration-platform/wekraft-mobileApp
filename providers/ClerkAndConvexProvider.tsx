import React from 'react';
import {ClerkLoaded, ClerkProvider, useAuth} from "@clerk/clerk-expo";
import {tokenCache} from "@/cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!,{
    unsavedChangesWarning:false
});

const ClerkAndConvexProvider = ({children}:{children: React.ReactNode}) => {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex} >
                <ClerkLoaded>
                    {children}
                </ClerkLoaded>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};

export default ClerkAndConvexProvider;
