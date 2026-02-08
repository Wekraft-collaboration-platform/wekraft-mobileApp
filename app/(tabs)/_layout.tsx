import {Stack, Tabs} from "expo-router";
import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import {Tab} from "@clerk/clerk-js/dist/types/ui/elements/Tabs";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constraints/Colors";
import {Ionicons} from "@expo/vector-icons";

export default function RootLayout() {
    return (
        <LinearBackgroundProvider isOn={false}>

            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    sceneStyle: {
                        backgroundColor: "transparent",
                    },
                    tabBarStyle: {
                        borderTopWidth: 0,
                        elevation: 0,
                        backgroundColor: "transparent"
                    },

                    tabBarBackground: () => (
                        <LinearGradient
                            colors={[
                                colors.LoginScreenGraidentStart,
                                colors.LoginScreenGraidentEnd,
                            ]}
                            style={{flex: 1}}
                        />
                    ),

                }}
            >

                <Tabs.Screen
                    name={"index"}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={24}
                                color={focused ? "#fff" : "#a0a0a0ff"}
                            />
                        )
                    }}
                />
            </Tabs>
        </LinearBackgroundProvider>
    )
}
