import React from "react"
import { View, StyleSheet, Text } from "react-native"
import languageColors from "@/languageColors.json"

type ProgressBarProps = {
    value: number // percentage: 0–100 (can be decimal)
    languageName: string
}

export default function ProgressBar({
                                        value,
                                        languageName,
                                    }: ProgressBarProps) {
    const color =
        (languageColors as Record<string, string>)[languageName] ?? "#cccccc"

    const clamped = Math.min(Math.max(value, 0), 100)
    const isZero = clamped <= 0

    return (
        <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.languageRow}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={styles.languageText}>{languageName}</Text>
                </View>

                <Text style={styles.valueText}>
                    {clamped.toFixed(1)}%
                </Text>
            </View>

            {/* Progress Track */}
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
    wrapper: {
        width: "100%",
        marginBottom: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    languageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 999,
    },

    languageText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#ffffff",
    },

    valueText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffff",
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
