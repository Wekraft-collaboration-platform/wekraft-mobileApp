import { OnBoardingProvider } from "@/context/OnBoardingContext";
import LinearBackgroundPovider from "@/providers/LinearBackgroundPovider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <OnBoardingProvider>
      <LinearBackgroundPovider>


        <Stack screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent"
          },
          animation:"slide_from_right"
        }} />
      </LinearBackgroundPovider>
    </OnBoardingProvider>
  )
}
