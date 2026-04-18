import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const ProjectLayoutSkeletonView = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#18181b", paddingHorizontal: 16 }}>

            <View style={styles.headerRow}>

                <SkeletonBlock height={50} width={50} radius={12} />

                <View style={{ gap: 6 }}>

                    <SkeletonBlock height={20} width={140} radius={4} />

                    <SkeletonBlock height={14} width={80} radius={4} />
                </View>
                <View style={{ flex: 1 }} />

                <SkeletonBlock height={50} width={50} radius={12} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>


                <View style={{ marginTop: 16 }}>
                    <SkeletonBlock height={170} width="100%" radius={16} />
                </View>

                <View style={{ marginTop: 24, gap: 10 }}>
                    <SkeletonBlock height={22} width={80} radius={4} />
                    <SkeletonBlock height={16} width="100%" radius={4} />
                    <SkeletonBlock height={16} width="90%" radius={4} />
                    <SkeletonBlock height={16} width="40%" radius={4} />
                </View>


                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <SkeletonBlock height={32} width={70} radius={10} />
                    <SkeletonBlock height={32} width={85} radius={10} />
                    <SkeletonBlock height={32} width={60} radius={10} />
                </View>


                <View style={{ marginTop: 16 }}>
                    <SkeletonBlock height={48} width="100%" radius={16} />
                </View>

                <View style={styles.tabBarPlaceholder}>
                    <SkeletonBlock height={42} width="100%" radius={14} />
                </View>


                <View style={styles.healthSkeleton}>
                    <SkeletonBlock height={190} width={"100%"} radius={16} />
                </View>


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


                <View style={styles.teamContainer}>
                    <SkeletonBlock height={54} width="100%" radius={16} />
                    <View style={{ padding: 16, gap: 12 }}>
                        <SkeletonBlock height={14} width={100} radius={4} />
                        <SkeletonBlock height={70} width="100%" radius={12} />
                        <SkeletonBlock height={70} width="100%" radius={12} />
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