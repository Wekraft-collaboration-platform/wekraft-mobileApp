import React from "react"
import { View, StyleSheet, Text } from "react-native"
import languageColors from "@/languageColors.json"

type LanguageItemProps = {
    value: number
    languageName: string
    isLast: boolean // Used to hide the bottom border on the last item
}

export default function LanguageListItem({ value, languageName, isLast }: LanguageItemProps) {
    const color = (languageColors as Record<string, string>)[languageName] ?? "#a1a1aa"
    const clamped = Math.min(Math.max(value, 0), 100)

    const  isZero = clamped <=0
    // Append '26' to the hex code to give the background a ~15% opacity tint
    const badgeBackgroundColor = color.length === 7 ? `${color}26` : 'rgba(255,255,255,0.1)'

    return (

        <View style={[styles.row , isLast && styles.noBorder]}>

            <View style={{flexDirection:"row" , width:"100%", alignItems:"center" ,justifyContent:"space-between"}}>

                {/* Left Side: Ring, Dot, and Name */}
                <View style={styles.leftGroup}>
                    <View style={[styles.ring, { borderColor: color }]}>
                        <View style={[styles.dot, { backgroundColor: color }]} />
                    </View>
                    <Text style={styles.languageText}>{languageName}</Text>
                </View>

                {/* Right Side: Tinted Percentage Badge */}
                <View style={[styles.badge, { backgroundColor: badgeBackgroundColor, borderColor: color }]}>
                    <Text style={[styles.badgeText, { color: color }]}>
                        {clamped.toFixed(1)}%
                    </Text>
                </View>
            </View>

            <View style={styles.track}>

                {/* Main Fill */}
                {!isZero && (
                    <View
                        style={[
                            styles.fill,
                            {
                                width: `${clamped}%`,
                                backgroundColor: color,
                            },
                        ]}
                    />
                )}

                {/* Trailing Highlight */}
                {!isZero && (
                    <View
                        style={[
                            styles.trailingGlow,
                            {
                                left: `${clamped}%`,
                                backgroundColor: color,
                            },
                        ]}
                    />
                )}
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "column",
        alignItems: "center",
        gap:8,
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#27272a", // Very subtle separator line
    },
    noBorder: {
        borderBottomWidth: 0,
        paddingBottom: 4, // Less padding on the last item to fit the container snugly
    },
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    ring: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    languageText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#e4e4e7", // Zinc 200
        letterSpacing: 0.3,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    track: {
        width: "100%",
        height: 10,
        backgroundColor: "#ffffff",
        borderRadius: 999,
        overflow: "hidden",
        position: "relative",
    },

    fill: {
        height: "100%",
    },

    trailingGlow: {
        position: "absolute",
        width: 10,
        height: 14,
        opacity: 0.5,
    },
})