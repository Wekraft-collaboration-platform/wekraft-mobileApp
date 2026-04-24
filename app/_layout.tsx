import { Redirect, Slot, Stack, useSegments } from "expo-router";
import "./global.css"
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message"
import { queryClient } from "@/lib/querryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { setAuthTransitionState } from "@/queries/auth/useAuthTransition";
import { useQueryClient } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <AuthGate />
          <Slot />
          <Toast />
        </PaperProvider>
      </QueryClientProvider>
    </ClerkAndConvexProvider>
  )
}



// For The routing Purpose
// 0. Landing Screen
// 1. Auth/Login
// 2. Onboarding
// 3. Main Screen
function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const transitionQueryClient = useQueryClient();
  const segments = useSegments();

  // Once user is in landing group, we set this to true to indicate we've "reached" landing.
  const [reachedLanding, setReachedLanding] = useState(false);

  // Source of user data
  const user = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : "skip",
  )

  // Use to Store the user in the db
  const storeUser = useMutation(api.users.store)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || user !== null) {
      return;
    }
    storeUser().then(() => {
      console.log("User stored successfully")
    }).catch(err => {
      console.error("Failed to store user", err)
    })
  }, [isLoaded, isSignedIn, user])

  const inLandingGroup = segments[0] === "(landing)";

  // On first load, if we aren't in the landing group, go there.
  if (!reachedLanding && !inLandingGroup) {
    return <Redirect href={"/(landing)" as any} />
  }

  // Once we've hit the landing group, we stop redirects.
  if (inLandingGroup) {
    if (!reachedLanding) setReachedLanding(true); // Persist that we reached it
    return null;
  }

  // Rest of auth logic only happens once we are NOT in (landing) group
  if (!isLoaded) return null

  if (isSignedIn && user === undefined) return null

  // Route to Auth Screen / Login Screen
  if (!isSignedIn) {
    setAuthTransitionState(transitionQueryClient, "idle")
    return <Redirect href="/(auth)" />
  }

  // Route to onboarding
  if (!user?.hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />
  }

  // Route to tabs
  return <Redirect href="/(tabs)" />
}