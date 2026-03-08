import React from 'react';
import { View, StyleSheet} from 'react-native';
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const DashboardSkeletonView = () => {
    return (
        <View style={{ flex: 1, marginHorizontal:16 }}>

            {/* --- HEADER SKELETON --- */}
            <View style={styles.headerRow}>
                {/* Profile Image placeholder */}
                <SkeletonBlock height={50} width={50} radius={16} />

                <View style={{ flex: 1, marginStart: 12, gap: 6 }}>
                    {/* Greeting Label */}
                    <SkeletonBlock height={14} width={100} radius={4} />
                    {/* Username */}
                    <SkeletonBlock height={20} width={140} radius={4} />
                </View>

                {/* Notification Icon */}
                <SkeletonBlock height={48} width={48} radius={16} />
            </View>

            {/* --- IMPACT SCORE CARD SKELETON --- */}
            <View style={styles.impactCard}>
                <View style={styles.cardHeader}>
                    <View style={{ gap: 8 }}>
                        {/* "IMPACT SCORE" title */}
                        <SkeletonBlock height={20} width={130} radius={4} />
                        {/* "RANKED" text */}
                        <SkeletonBlock height={14} width={80} radius={4} />
                    </View>
                    {/* "Analysis" Button */}
                    <SkeletonBlock height={32} width={90} radius={24} />
                </View>

                <View style={styles.ringSection}>
                    {/* The Impact Ring Placeholder */}
                    <View style={styles.ringPlaceholder}>
                        <SkeletonBlock height={120} width={120} radius={60} />
                    </View>

                    {/* Stats details (Experience/Score) */}
                    <View style={{ flex: 1, marginStart: 24, gap: 20 }}>
                        <View style={{ gap: 6 }}>
                            <SkeletonBlock height={12} width={80} radius={4} />
                            <SkeletonBlock height={18} width={100} radius={4} />
                        </View>
                        <View style={{ height: 1, backgroundColor: "#262628" }} />
                        <View style={{ gap: 6 }}>
                            <SkeletonBlock height={12} width={90} radius={4} />
                            <SkeletonBlock height={18} width={60} radius={4} />
                        </View>
                    </View>
                </View>
            </View>

            {/* --- GIT CARDS GRID SKELETON --- */}
            <View style={styles.gridContainer}>
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.gitCardPlaceholder}>
                        {/* Icon Box */}
                        <SkeletonBlock height={38} width={38} radius={12} />
                        {/* Score Number */}
                        <View style={{ marginTop: 16 }}>
                            <SkeletonBlock height={24} width={60} radius={4} />
                        </View>
                        {/* Title Label */}
                        <View style={{ marginTop: 6 }}>
                            <SkeletonBlock height={12} width={40} radius={4} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    impactCard: {
        marginTop: 16,
        padding: 16,
        backgroundColor: "#161618",
        borderColor: "#232325",
        borderWidth: 2,
        borderRadius: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    ringSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    ringPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // Optional: Adding an inner hole to simulate the ring
        backgroundColor: '#1C1C1E',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    gitCardPlaceholder: {
        width: "48%",
        backgroundColor: "#161618",
        borderWidth: 1,
        borderColor: '#232325',
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
    }
});

export default DashboardSkeletonView;