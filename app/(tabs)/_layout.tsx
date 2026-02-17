import {Tabs, useSegments} from "expo-router";
import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constraints/Colors";
import {Ionicons} from "@expo/vector-icons";
import {useEffect, useRef} from "react";
import {Animated} from "react-native";


const TAB_BAR_HEIGHT = 100;

export default function RootLayout() {

    const segments = useSegments()
    const hideTabBar =
        (segments[1] ==="project"  && segments[2] !==undefined)


    const translateY =useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: hideTabBar ? TAB_BAR_HEIGHT : 0,
            damping: 23,
            stiffness: 110,
            useNativeDriver: true,
        }).start();
    }, [hideTabBar]);

    return (
        <LinearBackgroundProvider isOn={false}>

            <Tabs

                screenOptions={{
                   animation:"shift",
                    headerShown: false,
                    tabBarShowLabel: false,
                    sceneStyle: {
                        backgroundColor: "transparent",
                    },
                    tabBarStyle: {
                        borderTopWidth: 0,
                        elevation: 0,
                        backgroundColor: "transparent",
                        transform:[{translateY:translateY}]
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

                <Tabs.Screen
                    name="project"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "folder" : "folder-outline"}
                                size={24}
                                color={focused ? "#fff" : "#a0a0a0ff"}
                            />
                        ),
                    }}
                />

            </Tabs>
        </LinearBackgroundProvider>
    )
}
