import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const ProjectLayoutSkeletonView = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#18181b", paddingHorizontal: 16 }}>
            {/* --- HEADER SKELETON --- */}
            <View style={styles.headerRow}>
                {/* Back Button Placeholder */}
                <SkeletonBlock height={50} width={50} radius={12} />

                <View style={{ gap: 6 }}>
                    {/* Project Name */}
                    <SkeletonBlock height={20} width={140} radius={4} />
                    {/* Repo Owner */}
                    <SkeletonBlock height={14} width={80} radius={4} />
                </View>
                <View style={{ flex: 1 }} />
                {/* Menu Icon Placeholder */}
                <SkeletonBlock height={50} width={50} radius={12} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- THUMBNAIL SKELETON --- */}
                <View style={{ marginTop: 16 }}>
                    <SkeletonBlock height={170} width="100%" radius={16} />
                </View>

                {/* --- ABOUT SECTION SKELETON --- */}
                <View style={{ marginTop: 24, gap: 10 }}>
                    <SkeletonBlock height={22} width={80} radius={4} /> {/* "ABOUT" Label */}
                    <SkeletonBlock height={16} width="100%" radius={4} />
                    <SkeletonBlock height={16} width="90%" radius={4} />
                    <SkeletonBlock height={16} width="40%" radius={4} />
                </View>

                {/* --- TAGS SKELETON --- */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <SkeletonBlock height={32} width={70} radius={10} />
                    <SkeletonBlock height={32} width={85} radius={10} />
                    <SkeletonBlock height={32} width={60} radius={10} />
                </View>

                {/* --- VIEW REPO BUTTON SKELETON --- */}
                <View style={{ marginTop: 16 }}>
                    <SkeletonBlock height={48} width="100%" radius={16} />
                </View>

                {/* --- TAB SWITCHER SKELETON --- */}
                <View style={styles.tabBarPlaceholder}>
                    <SkeletonBlock height={42} width="100%" radius={14} />
                </View>

                {/* --- PROJECT HEALTH (SEMI-CIRCLE) SKELETON --- */}
                <View style={styles.healthSkeleton}>
                    <SkeletonBlock height={190} width={"100%"} radius={16} />
                </View>

                {/* --- METRICS GRID SKELETON --- */}
                <View style={styles.metricsGrid}>
                    <View style={styles.gridRow}>
                        <SkeletonBlock height={120} width="48%" radius={16} />
                        <SkeletonBlock height={120} width="48%" radius={16} />
                    </View>
                    <View style={styles.gridRow}>
                        <SkeletonBlock height={120} width="48%" radius={16} />
                        <SkeletonBlock height={120} width="48%" radius={16} />
                    </View>
                </View>

                {/* --- TEAM ROLES CONTAINER SKELETON --- */}
                <View style={styles.teamContainer}>
                    <SkeletonBlock height={54} width="100%" radius={16} /> {/* Header */}
                    <View style={{ padding: 16, gap: 12 }}>
                        <SkeletonBlock height={14} width={100} radius={4} /> {/* "Open Positions" */}
                        <SkeletonBlock height={70} width="100%" radius={12} /> {/* Row 1 */}
                        <SkeletonBlock height={70} width="100%" radius={12} /> {/* Row 2 */}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 10,
    },
    tabBarPlaceholder: {
        marginTop: 24,
        paddingHorizontal: 4,
    },
    healthSkeleton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    metricsGrid: {
        marginTop: 16,
        gap: 12,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    teamContainer: {
        marginTop: 24,

        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#27272a",
        overflow: 'hidden',
    }
});

export default ProjectLayoutSkeletonView;