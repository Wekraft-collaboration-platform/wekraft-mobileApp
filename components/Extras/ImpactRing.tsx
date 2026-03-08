import React, { useEffect, useRef, useMemo, useState } from "react";
import { View, Animated, StyleSheet, TextInput } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { GitHubStats, ImpactScoreResult, calculateImpactScore } from "@/lib/impactScore";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ImpactRingProps = {
    size?: number;
    strokeWidth?: number;
    stats?: GitHubStats;
    onResult?: (result: ImpactScoreResult) => void;
};

export default function ImpactRing({
                                       size = 160,
                                       strokeWidth = 12,
                                       stats,
                                       onResult,
                                   }: ImpactRingProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayScore, setDisplayScore] = useState(0);

    const impactResult = useMemo(() => {
        if (!stats) return null;
        return calculateImpactScore(stats);
    }, [stats]);

    const targetScore = impactResult?.score || 0;

    useEffect(() => {
        if (impactResult && onResult) onResult(impactResult);

        // Number counting logic synced to animatedValue
        const listener = animatedValue.addListener(({ value }) => {
            setDisplayScore(Math.floor(value * targetScore));
        });

        // Reset and Animate
        animatedValue.setValue(0);
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: false, // Required to run listeners/update state
        }).start();

        return () => animatedValue.removeListener(listener);
    }, [impactResult, targetScore]);

    // Dimensions
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const gapAngle = 10; // Slightly larger gap for more "pro" look

    const commits = impactResult?.breakdown.commits || 0;
    const prs = impactResult?.breakdown.prs || 0;
    const total = commits + prs || 1;

    // Weighting Logic
    const commitRatio = commits / total;
    const prRatio = prs / total;

    const gapLength = (gapAngle / 360) * circumference;
    const totalAvailableLength = circumference - (gapLength * 2);

    const commitStroke = commitRatio * totalAvailableLength;
    const prStroke = prRatio * totalAvailableLength * 0.25;

    const scoreScale = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.2, 0.7, 1],
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Defs>
                    <LinearGradient id="commitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#FDE68A" />
                        <Stop offset="100%" stopColor="#F59E0B" />
                    </LinearGradient>
                    <LinearGradient id="prGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#60A5FA" />
                        <Stop offset="100%" stopColor="#3B82F6" />
                    </LinearGradient>
                </Defs>

                {/* Subtle outer glow track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#1A1A1C"
                    strokeWidth={strokeWidth - 2}
                    fill="none"
                />

                {/* Commits (Weighted Segment) */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#commitGrad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [circumference, circumference - commitStroke]
                    })}
                    strokeLinecap="round"
                    transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                />

                {/* PRs (Weighted Segment) */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#prGrad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [circumference, circumference - prStroke]
                    })}
                    strokeLinecap="round"
                    transform={`rotate(${
                        -90 + (commitRatio * 360) + gapAngle
                    }, ${size / 2}, ${size / 2})`}
                />
            </Svg>

            <View style={styles.centerContainer}>
                <Animated.View style={{ transform: [{ scale: scoreScale }], opacity: animatedValue }}>
                    <Animated.Text style={styles.scoreText}>
                        {displayScore}
                    </Animated.Text>

                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    centerContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        fontSize: 48, // Larger for emphasis
        color: "#FFFFFF",
        fontWeight: "900",
        textAlign: "center",
        fontVariant: ['tabular-nums'],
        letterSpacing: -2,
    },
    label: {
        fontSize: 11,
        color: "#888", // Dimmed for professional contrast
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: 4,
        marginTop: -8,
    },
});