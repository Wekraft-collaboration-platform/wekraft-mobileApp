import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SkeletonBlock } from "@/components/block/SkeletonBlock";

const DiscoveryProjectSkeleton = () => {
    return (
        <View style={styles.cardContainer}>

            {/* 1. VISUAL HEADER SKELETON */}
            <View style={styles.thumbnailWrapper}>
                <SkeletonBlock height={160} width="100%" radius={0} />

            </View>

            {/* 2. CONTENT BODY SKELETON */}
            <View style={styles.contentBody}>

                {/* Title Row */}
                <View style={styles.headerRow}>
                    <SkeletonBlock height={20} width="70%" radius={4} />
                </View>

                {/* Metrics Row (Stars, Forks, Upvotes) */}
                <View style={styles.metricsRow}>
                    <SkeletonBlock height={16} width={45} radius={4} />
                    <View style={styles.metricDivider} />
                    <SkeletonBlock height={16} width={45} radius={4} />
                    <View style={styles.metricDivider} />
                    <SkeletonBlock height={16} width={45} radius={4} />
                </View>

                {/* Description - 3 Lines of varying lengths */}
                <View style={styles.descriptionGap}>
                    <SkeletonBlock height={14} width="100%" radius={4} />
                    <SkeletonBlock height={14} width="90%" radius={4} />
                    <SkeletonBlock height={14} width="40%" radius={4} />
                </View>

                {/* Footer: Tags */}
                <View style={styles.footerRow}>
                    <View style={styles.tagsWrapper}>
                        <SkeletonBlock height={24} width={60} radius={6} />
                        <SkeletonBlock height={24} width={80} radius={6} />
                        <SkeletonBlock height={24} width={50} radius={6} />
                    </View>
                </View>

            </View>
        </View>
    );
};

/**
 * A wrapper to show a list of these skeletons
 */
export const DiscoveryProjectSkeletonView = () => (
    <View style={{ flex: 1}}>
        {[1, 2, 3,4,5,6].map((key) => (
            <DiscoveryProjectSkeleton key={key} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#161616',
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#252525',
        overflow: 'hidden',
    },
    thumbnailWrapper: {
        height: 160,
        width: '100%',
        position: 'relative',
        backgroundColor: '#27272A',
    },
    ownerBadgePlaceholder: {
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    contentBody: {
        padding: 16,
    },
    headerRow: {
        marginBottom: 12,
    },
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    metricDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#3F3F46',
        marginHorizontal: 12,
    },
    descriptionGap: {
        gap: 6,
        marginBottom: 16,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagsWrapper: {
        flexDirection: 'row',
        gap: 8,
    },
});

export default DiscoveryProjectSkeleton;