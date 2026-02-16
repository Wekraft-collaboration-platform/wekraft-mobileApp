import { OnBoardingProvider } from "@/context/OnBoardingContext";
import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <OnBoardingProvider>



        <Stack screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent"
          },
          animation:"slide_from_right"
        }} />

    </OnBoardingProvider>
  )
}
