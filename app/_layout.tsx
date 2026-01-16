import { Redirect, Slot, Stack } from "expo-router";
import "./global.css"
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import Toast from "react-native-toast-message"
import { queryClient } from "@/lib/querryClient";
import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
        <Slot />
        <Toast />
      </QueryClientProvider>
    </ClerkAndConvexProvider>
  )
}



// For The routing Purspose 
// 1. Login Page
// 2. onBorading
// 3. Main Screen 
function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();


  // Source of user data to distigusih whther the user has completed teh onboridng or not 
  const user = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : "skip",
  )


  // Runs ONLY when:
  // - Clerk is ready
  // - User is signed in
  // - Convex auth is ready
  // - User does NOT exist

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

  }, [isLoaded, isSignedIn, user])

  if (!isLoaded) return null

  if (isSignedIn && user === undefined) return null


  // Route to Auth Screen / Login Screen
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />
  }


  // Route to onborading when the user is signed-in but not completed the onBorading
  if (isSignedIn && !user?.hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />
  }

  // Route to the main screen when the user is signedit and completed onBorading
  return <Redirect href="/(tabs)" />







}