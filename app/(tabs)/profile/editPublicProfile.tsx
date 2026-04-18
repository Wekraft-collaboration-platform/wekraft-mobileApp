import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TextInput, ScrollView,
    TouchableOpacity, Image, ActivityIndicator, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import {
    ChevronLeft, Camera, Github, Linkedin,
    Globe, Briefcase, FileText, Check, Plus
} from 'lucide-react-native';
import { router } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Haptics from 'expo-haptics';
import { Ionicons } from "@expo/vector-icons";
import {Id} from "@/convex/_generated/dataModel";

const EditPublicProfileScreen = () => {
    const user = useQuery(api.users.getCurrentUser);
    const userProjects = useQuery(api.projects.getProjects) || [];
    const updateProfile = useMutation(api.users.updateUser);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        occupation: '',
        bio: '',
        github: '',
        linkedin: '',
        website: '',
        featuredProjectIds: [] as Id<"projects">[]
    });

    // Helper: Deep compare arrays to check if selection actually changed
    const arraysEqual = (a: string[], b: string[]) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
    };

    // Validation: Only show "Save" if data differs from the database
    const isDirty = user ? (
        formData.occupation !== (user.occupation || '') ||
        formData.bio !== (user.bio || '') ||
        formData.github !== (user.github || '') ||
        formData.linkedin !== (user.linkedin || '') ||
        formData.website !== (user.website || '') ||
        !arraysEqual(formData.featuredProjectIds, user.featuredProjectIds || [])
    ) : false;

    useEffect(() => {
        if (user) {
            setFormData({
                occupation: user.occupation || '',
                bio: user.bio || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                website: user.website || '',
                featuredProjectIds: user.featuredProjectIds || []
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (loading || !isDirty) return;
        setLoading(true);
        try {
            await updateProfile({ ...formData });
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Update Failed", "We couldn't save your changes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleProject = (projectId: string) => {
        const isSelected = formData.featuredProjectIds.includes(projectId as Id<"projects">);

        if (!isSelected && formData.featuredProjectIds.length >= 2) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert("Selection Limit", "You can only showcase 2 projects at a time.");
            return;
        }

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setFormData(prev => ({
            ...prev,
            featuredProjectIds: isSelected
                ? prev.featuredProjectIds.filter(id => id !== projectId as Id<"projects"> )
                : [...prev.featuredProjectIds, projectId as Id<"projects">],
        }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            {/* Header Area */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ChevronLeft color="#F4F4F5" size={32} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Public Profile</Text>

                <View style={styles.saveBtnContainer}>
                    {isDirty && (
                        <TouchableOpacity onPress={handleSave} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#6366f1" />
                            ) : (
                                <Text style={styles.saveText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
                        <TouchableOpacity
                            onPress={()=>{
                                console.log("Not Implemented");
                            }}
                            style={styles.cameraBtn} activeOpacity={0.8}>
                            <Camera size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarHint}>Update profile photo</Text>
                </View>

                {/* Identity Inputs */}
                <View style={styles.section}>
                    <Text style={styles.label}>Identity & Bio</Text>
                    <InputField
                        icon={<Briefcase size={18} color="#71717A" />}
                        placeholder="Current Role (e.g. Lead Developer)"
                        value={formData.occupation}
                        onChangeText={(t: string) => setFormData({...formData, occupation: t})}
                    />
                    <InputField
                        icon={<FileText size={18} color="#71717A" />}
                        placeholder="Share a bit about your expertise..."
                        value={formData.bio}
                        multiline
                        numberOfLines={4}
                        onChangeText={(t: string) => setFormData({...formData, bio: t})}
                    />
                </View>

                {/* Social Presence */}
                <View style={styles.section}>
                    <Text style={styles.label}>Social Presence</Text>
                    <InputField
                        icon={<Github size={18} color="#71717A" />}
                        placeholder="GitHub URL"
                        value={formData.github}
                        onChangeText={(t: string) => setFormData({...formData, github: t})}
                    />
                    <InputField
                        icon={<Linkedin size={18} color="#71717A" />}
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChangeText={(t: string) => setFormData({...formData, linkedin: t})}
                    />
                    <InputField
                        icon={<Globe size={18} color="#71717A" />}
                        placeholder="Portfolio Website"
                        value={formData.website}
                        onChangeText={(t: string) => setFormData({...formData, website: t})}
                    />
                </View>

                {/* Project Selection */}
                <View style={styles.section}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Feature Projects</Text>
                            <Text style={styles.subLabel}>Highlight your top 2 projects</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.countText}>{formData.featuredProjectIds.length}/2</Text>
                        </View>
                    </View>

                    <View style={styles.projectGrid}>
                        {userProjects.map((project: any) => {
                            const selected = formData.featuredProjectIds.includes(project._id);
                            return (
                                <TouchableOpacity
                                    key={project._id}
                                    activeOpacity={0.9}
                                    style={[styles.projectSelectCard, selected && styles.projectSelected]}
                                    onPress={() => toggleProject(project._id)}
                                >
                                    <View style={styles.cardImageWrapper}>
                                        {project.thumbnailUrl ? (
                                            <Image
                                                source={{ uri: project.thumbnailUrl }}
                                                style={styles.fullThumbnail}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.placeholderThumbnail}>
                                                <Text style={styles.placeholderChar}>
                                                    {project.projectName?.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Selection Checkmark Overlay */}
                                        {selected && (
                                            <View style={styles.selectionOverlay}>
                                                <Ionicons name="checkmark-sharp" size={16} color="#FFFFFF" />
                                            </View>
                                        )}

                                        {/* Info Overlay */}
                                        <View style={styles.textOverlay}>
                                            <Text numberOfLines={1} style={styles.overlayTitle}>
                                                {project.projectName}
                                            </Text>
                                            <Text numberOfLines={1} style={styles.overlaySub}>
                                                {project.description || "No Description Provided"}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const InputField = ({ icon, ...props }: any) => (
    <View style={styles.inputContainer}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
            style={[styles.input, props.multiline && { height: 100, paddingTop: 14, textAlignVertical: 'top' }]}
            placeholderTextColor="#3F3F46"
            selectionColor="#6366f1"
            {...props}
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, },
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
        marginBottom: 6},
    iconBtn: {   backgroundColor: "#1C1C1E",
        borderColor: "#2D2D2F",
        borderWidth: 2,
        borderRadius: 12,
        marginRight:7,
        padding: 7, },
    saveBtnContainer: { width: 50, alignItems: 'flex-end' },
    saveText: { color: '#6366f1', fontSize: 15, fontWeight: '700' },

    scrollPadding: { paddingBottom: 60, paddingTop: 10 },

    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#27272A' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6366f1', padding: 10, borderRadius: 20, borderWidth: 4, borderColor: '#09090B' },
    avatarHint: { color: '#71717A', fontSize: 12, marginTop: 14, fontWeight: '500' },

    section: { paddingHorizontal: 20, marginBottom: 32 ,gap:12},
    label: { color: '#F4F4F5', fontSize: 18, fontWeight: '700', },
    subLabel: { color: '#71717A', fontSize: 15,  },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    badge: { backgroundColor: '#18181B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#27272A' },
    countText: { color: '#A1A1AA', fontSize: 14, fontWeight: '700' },

    inputContainer: {
        flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#18181B',
        borderRadius: 16, borderWidth: 1, borderColor: '#27272A', paddingHorizontal: 16
    },
    inputIcon: { marginTop: 16, marginRight: 12 },
    input: { flex: 1, color: '#FFF', fontSize: 15, height: 50 },

    projectGrid: { gap: 12 },
    projectSelectCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#111113',
    },
    projectSelected: { borderColor: '#6366f1' },
    cardImageWrapper: { height: 160, width: "100%", position: 'relative' },
    fullThumbnail: { width: "100%", height: "100%" },
    placeholderThumbnail: { flex: 1, backgroundColor: "#18181B", justifyContent: "center", alignItems: "center" },
    placeholderChar: { color: '#3F3F46', fontSize: 40, fontWeight: '800' },

    selectionOverlay: {
        position: "absolute", right: 12, top: 12,
        backgroundColor: '#6366f1', borderRadius: 12,
        width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
        shadowColor: "#000", shadowOpacity: 0.3, elevation: 5
    },
    textOverlay: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: "50%", padding: 16, justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    overlayTitle: { color: "white", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
    overlaySub: { color: "#A1A1AA", fontSize: 13, marginTop: 2 },
});

export default EditPublicProfileScreen;