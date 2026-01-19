import React, {useEffect, useRef} from "react"
import {View, Animated, StyleSheet} from "react-native"

type Props = {
    width?: number | string
    height?: number
    radius?: number
    style?: any
}

export function SkeletonBlock({
                                  width = "100%",
                                  height = 16,
                                  radius = 8,
                                  style
                              }: Props) {
    const shimmer = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true
            })
        ).start()
    }, [])

    const translateX = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-420, 420]
    })

    return (
        <View
            style={[
                styles.container,
                {width, height, borderRadius: radius},
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{translateX}]
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1e1e22",
        overflow: "hidden"
    },
    shimmer: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "20%",
        height: "100%",
        backgroundColor: "#303236ff",
        opacity: 0.6
    }
})
