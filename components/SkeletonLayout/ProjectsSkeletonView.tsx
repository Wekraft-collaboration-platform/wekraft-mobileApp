import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const ProjectsSkeletonView = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#18181b", paddingHorizontal: 16 }}>

            {/* --- HEADER SKELETON --- */}
            <View style={styles.header}>
                <View style={{ gap: 8 }}>
                    {/* "My Project" Title */}
                    <SkeletonBlock height={24} width={120} radius={4} />
                    {/* "X Projects Active" Subtitle */}
                    <SkeletonBlock height={14} width={80} radius={4} />
                </View>

                {/* Filter Icon Placeholder */}
                <SkeletonBlock height={48} width={48} radius={12} />
            </View>

            {/* --- PROJECTS LIST SKELETON --- */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {[1, 2, 3].map((key) => (
                    <ProjectCardSkeleton key={key} />
                ))}
            </ScrollView>

            {/* --- FLOATING ACTION BUTTON SKELETON --- */}
            <View style={styles.fabPlaceholder}>
                <SkeletonBlock height={56} width={140} radius={28} />
            </View>
        </View>
    );
};

const ProjectCardSkeleton = () => (
    <View style={styles.cardContainer}>
        {/* Thumbnail Area */}
        <SkeletonBlock height={170} width="100%" radius={0} />

        {/* Content Area */}
        <View style={styles.cardContent}>
            {/* Repo Name */}
            <SkeletonBlock height={20} width="60%" radius={4} />

            {/* Description Lines */}
            <View style={{ gap: 6, marginTop: 8 }}>
                <SkeletonBlock height={14} width="100%" radius={4} />
                <SkeletonBlock height={14} width="80%" radius={4} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Footer Row (Update time + Chevron) */}
            <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <SkeletonBlock height={16} width={16} radius={8} />
                    <SkeletonBlock height={12} width={100} radius={4} />
                </View>
                <SkeletonBlock height={16} width={10} radius={4} />
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContainer: {
        borderColor: "#252525",
        borderRadius: 16,
        borderWidth: 1.5,
        overflow: "hidden",
        marginTop: 10,
        marginBottom: 10,
    },
    cardContent: {
        padding: 16,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#252525",
        marginVertical: 15,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fabPlaceholder: {
        position: 'absolute',
        bottom: 20,
        right: 16,
    }
});

export default ProjectsSkeletonView;