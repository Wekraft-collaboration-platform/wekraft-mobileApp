import React, { useState } from 'react';
import {
    StyleSheet, View, Text, Image, ScrollView,
    TouchableOpacity, Linking, ActivityIndicator, Alert
} from 'react-native';
import {
    Github, Linkedin, Globe, ChevronLeft, ChevronRight,
    ShieldCheck, RotateCcw, Layout, Zap, Trophy, Target, Sparkles
} from 'lucide-react-native';
import { router } from "expo-router";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useProfile } from "@/src/FeaturesScreens/profileScreen/ProfiletProvider";
import { Id } from "@/convex/_generated/dataModel";
import PublicProfileSkeletonView from "@/components/SkeletonLayout/PublicProfileSkeletonView";

interface Milestone {
    id: number;
    type: string;
    title: string;
    desc: string;
    date: string;
    icon: React.ReactNode;
    color: string;
}

type PublicProfileScreenProps = {
    onProjectSelected: (projectId: Id<"projects">) => void;
}

const PublicProfileScreen = ({ onProjectSelected }: PublicProfileScreenProps) => {
    const { user, mode } = useProfile();
    const fetchTechStack = useAction(api.Redis.GitHubData.RedisGetUserTopLanguges.RedisGetUserTopLanguages);
    const updateUser = useMutation(api.users.updateUser);

    const [isSyncing, setIsSyncing] = useState(false);

    // Mock moments - in a real app, these would likely come from your database
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
        ids: user?.featuredProjectIds || []
    });

    const handleSyncTechStack = async () => {
        if (!user) return;
        setIsSyncing(true);
        try {
            const stack = await fetchTechStack({ username: user.githubUsername || "" });
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

    if (!user || !featuredProjects) {
        return (
            <PublicProfileSkeletonView/>
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
                <View style={{ width: 50 }} />
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

                    <Text style={styles.name}>{user.githubUsername || "Anonymous"}</Text>
                    <Text style={styles.titleRole}>{user.occupation || "Software Engineer"}</Text>
                    <Text style={styles.bioText}>{user.bio || "Crafting digital experiences with precision and scale."}</Text>

                    {mode === "admin" && (
                        <TouchableOpacity
                            style={styles.primaryBtn}
                            activeOpacity={0.8}
                            onPress={() => router.push("/profile/editPublicProfile")}
                        >
                            <Text style={styles.primaryBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Stats Dashboard */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.commits ?? 0}</Text>
                        <Text style={styles.statLabel}>Commits</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.pr ?? 0}</Text>
                        <Text style={styles.statLabel}>PRs</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.impactScore ?? 0}</Text>
                        <Text style={styles.statLabel}>Impact</Text>
                    </View>
                </View>

                {/* Social Links */}
                <View style={styles.socialActionRow}>
                    <SocialIconBtn icon={<Github size={20} color="#F4F4F5" />} link={user.github} />
                    <SocialIconBtn icon={<Linkedin size={20} color="#F4F4F5" />} link={user.linkedin} />
                    <SocialIconBtn icon={<Globe size={20} color="#F4F4F5" />} link={user.website} />
                </View>

                <View style={styles.divider} />

                {/* Featured Projects */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Featured Projects</Text>
                    <View style={styles.projectGrid}>
                        {featuredProjects && featuredProjects.length > 0 ? (
                            featuredProjects.map((project: any) => (
                                <TouchableOpacity
                                    key={project._id}
                                    activeOpacity={0.9}
                                    style={styles.projectCard}
                                    onPress={() => onProjectSelected(project._id)}
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
                                            <Text numberOfLines={1} style={styles.overlaySub}>{project.description || "View project details"}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            mode === "admin" ? (
                                <TouchableOpacity style={styles.adminEmptyState} onPress={() => router.push("/profile/editPublicProfile")}>
                                    <Layout size={24} color="#6366f1" />
                                    <Text style={styles.adminEmptyTitle}>Showcase your work</Text>
                                    <Text style={styles.adminEmptySub}>Select your best projects to feature here</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.publicEmptyCard}>
                                    <Layout size={20} color="#3F3F46" />
                                    <Text style={styles.publicEmptyText}>No projects featured yet</Text>
                                </View>
                            )
                        )}
                    </View>
                </View>

                {/* Technical Stack */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>Technical Stack</Text>
                        {(user?.techStack && user.techStack.length > 0 && mode === "admin") && (
                            <TouchableOpacity onPress={handleSyncTechStack} style={styles.syncSmall} disabled={isSyncing}>
                                {isSyncing ? <ActivityIndicator size="small" color="#71717A" /> : <RotateCcw size={14} color="#71717A" />}
                            </TouchableOpacity>
                        )}
                    </View>

                    {user?.techStack && user.techStack.length > 0 ? (
                        <View style={styles.skillGrid}>
                            {user.techStack.map((skill: string) => (
                                <View key={skill} style={styles.skillChip}>
                                    <Text style={styles.skillChipText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        mode === "admin" ? (
                            <TouchableOpacity style={styles.fetchCard} onPress={handleSyncTechStack} disabled={isSyncing}>
                                <Github size={20} color="#F4F4F5" />
                                <View style={styles.fetchTextContent}>
                                    <Text style={styles.fetchTitle}>Sync Tech Stack</Text>
                                    <Text style={styles.fetchSubtitle}>Auto-detect from GitHub</Text>
                                </View>
                                {isSyncing ? <ActivityIndicator size="small" color="#6366f1" /> : <ChevronRight size={16} color="#3F3F46" />}
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.publicEmptyCard}>
                                <Sparkles size={18} color="#3F3F46" />
                                <Text style={styles.publicEmptyText}>Skills not listed</Text>
                            </View>
                        )
                    )}
                </View>

                {/* WeKraft Milestones */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>WeKraft Moments</Text>
                    <View style={styles.milestoneList}>
                        {moments && moments.length > 0 ? (
                            moments.map((item) => (
                                <View key={item.id} style={styles.milestoneItem}>
                                    <View style={styles.milestoneIcon}>{item.icon}</View>
                                    <View style={styles.milestoneContent}>
                                        <Text style={styles.milestoneTitle}>{item.title}</Text>
                                        <Text style={styles.milestoneDetail}>{item.desc}</Text>
                                    </View>
                                    <Text style={styles.milestoneDate}>{item.date}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.publicEmptyCard}>
                                <Trophy size={18} color="#3F3F46" />
                                <Text style={styles.publicEmptyText}>Waiting for the first milestone</Text>
                            </View>
                        )}
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
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingBottom: 15, paddingTop: 10,
        borderBottomWidth: 1, borderBottomColor: '#18181B'
    },
    headerTitle: { fontSize: 20, fontWeight: "800", color: "white", letterSpacing: 1.2 },
    iconBtn: { backgroundColor: "#1C1C1E", borderColor: "#2D2D2F", borderWidth: 2, borderRadius: 12, padding: 7 },
    scrollPadding: { paddingBottom: 40 },
    heroSection: { alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#27272A' },
    verifiedBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: '#6366f1', padding: 4, borderRadius: 12, borderWidth: 2, borderColor: '#09090B' },
    name: { color: '#FFF', fontSize: 26, fontWeight: '700' },
    titleRole: { color: '#A1A1AA', fontSize: 15, marginTop: 4, fontWeight: '500' },
    bioText: { color: '#71717A', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
    primaryBtn: { backgroundColor: '#F4F4F5', width: '100%', height: 48, borderRadius: 12, marginTop: 24, alignItems: 'center', justifyContent: 'center' },
    primaryBtnText: { color: '#09090B', fontWeight: '700', fontSize: 15 },
    statsContainer: { flexDirection: 'row', backgroundColor: '#111113', marginHorizontal: 20, marginTop: 24, borderRadius: 20, borderWidth: 1, borderColor: '#18181B', paddingVertical: 18, alignItems: 'center' },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: '60%', backgroundColor: '#1C1C1E' },
    statValue: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    statLabel: { color: '#71717A', fontSize: 10, fontWeight: '600', marginTop: 4, textTransform: 'uppercase' },
    socialActionRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 16 },
    socialIconBtn: { flex: 1, height: 52, backgroundColor: '#111113', borderRadius: 14, borderWidth: 1, borderColor: '#18181B', justifyContent: 'center', alignItems: 'center' },
    divider: { height: 1, backgroundColor: '#18181B', marginVertical: 30, marginHorizontal: 20 },
    section: { paddingHorizontal: 20, marginBottom: 25 },
    sectionLabel: { color: '#71717A', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    projectGrid: { gap: 12 },
    projectCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#111113', borderWidth: 1, borderColor: '#18181B' },
    cardImageWrapper: { height: 160, width: "100%" },
    fullThumbnail: { width: "100%", height: "100%", opacity: 0.8 },
    placeholderThumbnail: { flex: 1, backgroundColor: "#18181B", justifyContent: "center", alignItems: "center" },
    placeholderChar: { color: '#3F3F46', fontSize: 40, fontWeight: '800' },
    textOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: 'rgba(9, 9, 11, 0.7)' },
    overlayTitle: { color: "white", fontSize: 15, fontWeight: "700" },
    overlaySub: { color: "#A1A1AA", fontSize: 12, marginTop: 2 },
    skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A' },
    skillChipText: { color: '#F4F4F5', fontSize: 12, fontWeight: '500' },
    fetchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111113', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#18181B', gap: 15 },
    fetchTextContent: { flex: 1 },
    fetchTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    fetchSubtitle: { color: '#71717A', fontSize: 12 },
    syncSmall: { padding: 4 },
    milestoneList: { gap: 10 },
    milestoneItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111113', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#18181B' },
    milestoneIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    milestoneContent: { flex: 1 },
    milestoneTitle: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    milestoneDetail: { color: '#71717A', fontSize: 11, marginTop: 2 },
    milestoneDate: { color: '#3F3F46', fontSize: 10, fontWeight: '600' },

    // Empty State Variants
    adminEmptyState: {
        paddingVertical: 40, backgroundColor: '#111113', borderRadius: 20,
        borderWidth: 1, borderStyle: 'dashed', borderColor: '#27272A',
        alignItems: 'center', justifyContent: 'center', gap: 6
    },
    adminEmptyTitle: { color: '#F4F4F5', fontSize: 15, fontWeight: '600' },
    adminEmptySub: { color: '#71717A', fontSize: 12 },
    publicEmptyCard: {
        flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16,
        backgroundColor: '#0C0C0E', borderRadius: 12, borderWidth: 1, borderColor: '#18181B'
    },
    publicEmptyText: { color: '#3F3F46', fontSize: 14, fontWeight: '500', fontStyle: 'italic' }
});

export default PublicProfileScreen;