import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SkeletonBlock } from "@/components/block/SkeletonBlock";

const { width } = Dimensions.get('window');

const PublicProfileSkeletonView = () => {
    return (
        <View style={styles.container}>
            {/* --- HEADER SKELETON --- */}
            <View style={styles.header}>
                <SkeletonBlock height={48} width={48} radius={12} />
                <SkeletonBlock height={20} width={120} radius={4} />
                <View style={{ width: 48 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>

                {/* --- HERO SECTION SKELETON --- */}
                <View style={styles.heroSection}>
                    {/* Avatar */}
                    <SkeletonBlock height={100} width={100} radius={50} />

                    {/* Name & Title */}
                    <View style={{ alignItems: 'center', marginTop: 16, gap: 8 }}>
                        <SkeletonBlock height={28} width={180} radius={4} />
                        <SkeletonBlock height={16} width={120} radius={4} />
                    </View>

                    {/* Bio Lines */}
                    <View style={{ alignItems: 'center', marginTop: 12, gap: 6 }}>
                        <SkeletonBlock height={14} width={width * 0.8} radius={4} />
                        <SkeletonBlock height={14} width={width * 0.6} radius={4} />
                    </View>

                </View>

                {/* --- STATS DASHBOARD SKELETON --- */}
                <View style={styles.statsContainer}>
                    {[1, 2, 3].map((i) => (
                        <React.Fragment key={i}>
                            <View style={styles.statItem}>
                                <SkeletonBlock height={24} width={40} radius={4} />
                                <SkeletonBlock height={10} width={50} radius={2} style={{ marginTop: 6 }} />
                            </View>
                            {i < 3 && <View style={styles.statDivider} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* --- SOCIAL LINKS SKELETON --- */}
                <View style={styles.socialActionRow}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={{ flex: 1 }}>
                            <SkeletonBlock height={52} width="100%" radius={14} />
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                {/* --- FEATURED PROJECTS SKELETON --- */}
                <View style={styles.section}>
                    <SkeletonBlock height={12} width={120} radius={4} style={{ marginBottom: 12 }} />

                    <View style={styles.projectCardPlaceholder}>
                        <SkeletonBlock height={160} width="100%" radius={16} />
                        {/* Overlay Simulation */}
                        <View style={styles.projectOverlayPlaceholder}>
                            <SkeletonBlock height={16} width="40%" radius={4} />
                            <SkeletonBlock height={12} width="60%" radius={4} style={{ marginTop: 6 }} />
                        </View>
                    </View>
                    <View style={styles.projectCardPlaceholder}>
                        <SkeletonBlock height={160} width="100%" radius={16} />
                        {/* Overlay Simulation */}
                        <View style={styles.projectOverlayPlaceholder}>
                            <SkeletonBlock height={16} width="40%" radius={4} />
                            <SkeletonBlock height={12} width="60%" radius={4} style={{ marginTop: 6 }} />
                        </View>
                    </View>
                </View>

                {/* --- TECH STACK SKELETON --- */}
                <View style={styles.section}>
                    <SkeletonBlock height={12} width={100} radius={4} style={{ marginBottom: 12 }} />
                    <View style={styles.skillGrid}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <SkeletonBlock key={i} height={30} width={70 + (i * 10)} radius={8} />
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#18181B'
    },
    scrollPadding: { paddingBottom: 40 },
    heroSection: { alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#111113',
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#18181B',
        paddingVertical: 18,
        alignItems: 'center'
    },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: '60%', backgroundColor: '#1C1C1E' },
    socialActionRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 16 },
    divider: { height: 1, backgroundColor: '#18181B', marginVertical: 30, marginHorizontal: 20 },
    section: { paddingHorizontal: 20, marginBottom: 25 , gap:16},
    projectCardPlaceholder: {
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    projectOverlayPlaceholder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(9, 9, 11, 0.5)',
    },
    skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

export default PublicProfileSkeletonView;