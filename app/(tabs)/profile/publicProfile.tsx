import React, { useState } from 'react';
import {
    StyleSheet, View, Text, Image, ScrollView,
    TouchableOpacity, Linking, ActivityIndicator, Alert
} from 'react-native';
import {
    Github, Linkedin, Globe, ChevronLeft, ChevronRight,
    ShieldCheck, RotateCcw, Layout, Zap, Trophy, Target
} from 'lucide-react-native';
import { router } from "expo-router";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useAction, useMutation, useQuery } from "convex/react";

interface Milestone {
    id: number;
    type: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
}

const ProfileScreen = () => {
    const { user } = useUser();
    const getUserData = useQuery(api.users.getCurrentUser);
    const fetchTechStack = useAction(api.github.getUserTopLanguages);
    const updateUser = useMutation(api.users.updateUser);

    const [isSyncing, setIsSyncing] = useState(false);

    const moments: Milestone[] = [
        {
            id: 1,
            type: 'Contribution',
            title: 'Merged 12 PRs to WeKraft Core',
            desc: 'Refactored the workspace navigation and optimized Convex subscriptions.',
            date: 'Mar 10',
            icon: <Zap size={14} color="#6366f1" />,
            color: '#6366f1'
        },
        {
            id: 2,
            type: 'Achievement',
            title: 'Secured Build-A-Thon 2026 Winner',
            desc: 'Voted #1 for "Most Efficient Mobile Workflow" globally.',
            date: 'Feb 24',
            icon: <Trophy size={14} color="#fbbf24" />,
            color: '#fbbf24'
        },
        {
            id: 3,
            type: 'Bounty',
            title: 'Critical Bug Squashed',
            desc: 'Identified and fixed a race condition in the real-time drawing sync.',
            date: 'Jan 15',
            icon: <Target size={14} color="#f87171" />,
            color: '#f87171'
        }
    ];

    const featuredProjects = useQuery(api.projects.getProjectsBySelectedIds, {
        ids: getUserData?.featuredProjectIds || []
    });

    const handleSyncTechStack = async () => {
        if (!user) return;
        setIsSyncing(true);
        try {
            const stack = await fetchTechStack({ username: user.username || "" });
            if (!stack || stack.length === 0) {
                Alert.alert("No Data", "No public repositories found for this account.");
                return;
            }
            await updateUser({ techStack: stack });
        } catch (error) {
            Alert.alert("Sync Error", "Failed to connect to GitHub.");
        } finally {
            setIsSyncing(false);
        }
    };

    if (!getUserData || !user) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator color="#6366f1" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ChevronLeft color="#F4F4F5" size={32} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Public Profile</Text>

                <View style={{
                    width: 50, alignItems: 'flex-end'
                }}>
                </View>
            </View>


            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                        <View style={styles.verifiedBadge}>
                            <ShieldCheck size={12} color="#FFF" />
                        </View>
                    </View>

                    <Text style={styles.name}>{user.username || user.firstName}</Text>
                    <Text style={styles.titleRole}>{getUserData.occupation || "Software Engineer"}</Text>
                    <Text style={styles.bioText}>{getUserData.bio || "Crafting digital experiences with precision and scale."}</Text>

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        activeOpacity={0.8}
                        onPress={() => router.push("/profile/editPublicProfile")}
                    >
                        <Text style={styles.primaryBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid - Unified Dashboard Style */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{getUserData.commits ?? 0}</Text>
                        <Text style={styles.statLabel}>Commits</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{getUserData.pr ?? 0}</Text>
                        <Text style={styles.statLabel}>Pull Requests</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{getUserData.impactScore ?? 0}</Text>
                        <Text style={styles.statLabel}>Impact</Text>
                    </View>
                </View>

                {/* Social Links - Premium Action Row */}
                <View style={styles.socialActionRow}>
                    <SocialIconBtn
                        icon={<Github size={20} color="#F4F4F5" />}
                        link={getUserData.github}
                    />
                    <SocialIconBtn
                        icon={<Linkedin size={20} color="#F4F4F5" />}
                        link={getUserData.linkedin}
                    />
                    <SocialIconBtn
                        icon={<Globe size={20} color="#F4F4F5" />}
                        link={getUserData.website}
                    />
                </View>

                <View style={styles.divider} />

                {/* Featured Projects Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Featured Projects</Text>
                    <View style={styles.projectGrid}>
                        {featuredProjects && featuredProjects.length > 0 ? (
                            featuredProjects.map((project: any) => (
                                <TouchableOpacity
                                    key={project._id}
                                    activeOpacity={0.9}
                                    style={styles.projectCard}
                                    onPress={() => {}}
                                >
                                    <View style={styles.cardImageWrapper}>
                                        {project.thumbnailUrl ? (
                                            <Image source={{ uri: project.thumbnailUrl }} style={styles.fullThumbnail} />
                                        ) : (
                                            <View style={styles.placeholderThumbnail}>
                                                <Text style={styles.placeholderChar}>{project.projectName?.charAt(0)}</Text>
                                            </View>
                                        )}
                                        <View style={styles.textOverlay}>
                                            <Text numberOfLines={1} style={styles.overlayTitle}>{project.projectName}</Text>
                                            <Text numberOfLines={1} style={styles.overlaySub}>
                                                {project.description || "View project details"}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity style={styles.emptyProjects} onPress={() => router.push("/profile/editPublicProfile")}>
                                <Layout size={20} color="#3F3F46" />
                                <Text style={styles.emptyProjectsText}>Select projects to feature</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Technical Stack */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>Technical Stack</Text>
                        {getUserData?.techStack && getUserData.techStack.length > 0 && (
                            <TouchableOpacity onPress={handleSyncTechStack} style={styles.syncSmall} disabled={isSyncing}>
                                {isSyncing ? <ActivityIndicator size="small" color="#71717A" /> : <RotateCcw size={14} color="#71717A" />}
                            </TouchableOpacity>
                        )}
                    </View>

                    {getUserData?.techStack && getUserData.techStack.length > 0 ? (
                        <View style={styles.skillGrid}>
                            {getUserData.techStack.map((skill: string) => (
                                <View key={skill} style={styles.skillChip}>
                                    <Text style={styles.skillChipText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.fetchCard} onPress={handleSyncTechStack} disabled={isSyncing}>
                            <Github size={20} color="#F4F4F5" />
                            <View style={styles.fetchTextContent}>
                                <Text style={styles.fetchTitle}>Sync Tech Stack</Text>
                                <Text style={styles.fetchSubtitle}>Auto-detect from GitHub</Text>
                            </View>
                            {isSyncing ? <ActivityIndicator size="small" color="#6366f1" /> : <ChevronRight size={16} color="#3F3F46" />}
                        </TouchableOpacity>
                    )}
                </View>

                {/* WeKraft Milestones */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>WeKraft Moments</Text>
                    <View style={styles.milestoneList}>
                        {moments.map((item) => (
                            <View key={item.id} style={styles.milestoneItem}>
                                <View style={styles.milestoneIcon}>
                                    {item.icon}
                                </View>
                                <View style={styles.milestoneContent}>
                                    <Text style={styles.milestoneTitle}>{item.title}</Text>
                                    <Text style={styles.milestoneDetail}>{item.desc}</Text>
                                </View>
                                <Text style={styles.milestoneDate}>{item.date}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const SocialIconBtn = ({ icon, link }: { icon: React.ReactNode; link?: string }) => (
    <TouchableOpacity
        style={[styles.socialIconBtn, !link && { opacity: 0.3 }]}
        onPress={() => link && Linking.openURL(link)}
        disabled={!link}
        activeOpacity={0.7}
    >
        {icon}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20,  paddingBottom: 15,
        borderBottomWidth: 1, borderBottomColor: '#18181B'
    },
    headerTitle: {
        letterSpacing: 1.2,
        fontSize: 20,
        fontWeight: "800",
        color: "white",
    },
    iconBtn: {
        backgroundColor: "#1C1C1E",
        borderColor: "#2D2D2F",
        borderWidth: 2,
        borderRadius: 12,
        padding: 7, },

    scrollPadding: { paddingBottom: 40 },
    heroSection: { alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#27272A' },
    verifiedBadge: {
        position: 'absolute', bottom: 4, right: 4, backgroundColor: '#6366f1',
        padding: 4, borderRadius: 12, borderWidth: 2, borderColor: '#09090B'
    },
    name: { color: '#FFF', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
    titleRole: { color: '#A1A1AA', fontSize: 15, marginTop: 4, fontWeight: '500' },
    bioText: { color: '#71717A', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20, paddingHorizontal: 10 },
    primaryBtn: {
        backgroundColor: '#F4F4F5', width: '100%', height: 48,
        borderRadius: 12, marginTop: 24, alignItems: 'center', justifyContent: 'center'
    },
    primaryBtnText: { color: '#09090B', fontWeight: '700', fontSize: 15 },
    statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 24 },
    statBox: {
        flex: 1, backgroundColor: '#111113', paddingVertical: 14,
        borderRadius: 16, borderWidth: 1, borderColor: '#18181B', alignItems: 'center'
    },

    socialGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginTop: 12 },
    socialBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#111113', borderWidth: 1, borderColor: '#18181B', height: 42, borderRadius: 12, gap: 6
    },
    socialBtnText: { color: '#A1A1AA', fontSize: 11, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#18181B', marginVertical: 30, marginHorizontal: 20 },
    section: { paddingHorizontal: 20, marginBottom: 25 },
    sectionLabel: { color: '#71717A', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 , marginBottom:8},
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    projectGrid: { gap: 12 },
    projectCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#111113', borderWidth: 1, borderColor: '#18181B' },
    cardImageWrapper: { height: 160, width: "100%" },
    fullThumbnail: { width: "100%", height: "100%", opacity: 0.8 },
    placeholderThumbnail: { flex: 1, backgroundColor: "#18181B", justifyContent: "center", alignItems: "center" },
    placeholderChar: { color: '#3F3F46', fontSize: 40, fontWeight: '800' },
    textOverlay: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: 16, justifyContent: 'flex-end',
        backgroundColor: 'rgba(9, 9, 11, 0.6)'
    },
    overlayTitle: { color: "white", fontSize: 15, fontWeight: "700" },
    overlaySub: { color: "#A1A1AA", fontSize: 12, marginTop: 2 },
    emptyProjects: {
        padding: 30, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed',
        borderColor: '#27272A', alignItems: 'center', gap: 10
    },
    emptyProjectsText: { color: '#71717A', fontSize: 13 },
    skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A' },
    skillChipText: { color: '#F4F4F5', fontSize: 12, fontWeight: '500' },
    fetchCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#111113',
        padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#18181B', gap: 15
    },

    fetchTextContent: { flex: 1 },
    fetchTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    fetchSubtitle: { color: '#71717A', fontSize: 12 },
    syncSmall: { padding: 4 },
    sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 15 },
    milestoneList: { gap: 10 },
    milestoneItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111113', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#18181B' },
    milestoneIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    milestoneContent: { flex: 1 },
    milestoneTitle: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    milestoneDetail: { color: '#71717A', fontSize: 11, marginTop: 2, lineHeight: 16 },
    milestoneDate: { color: '#3F3F46', fontSize: 10, fontWeight: '600' },


    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#111113',
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#18181B',
        paddingVertical: 18,
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#1C1C1E',
    },
    statValue: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
    statLabel: {
        color: '#71717A',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    socialActionRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginTop: 16,
    },
    socialIconBtn: {
        flex: 1,
        height: 52,
        backgroundColor: '#111113',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#18181B',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;