import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Platform,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";

const Index = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const getUserData = useQuery(api.users.getCurrentUser);

    if (!isLoaded || !user) {
        return (
                <View style={styles.center}>
                    <ActivityIndicator color="#fff" />
                </View>
        );
    }

    return (
            <View style={styles.container}>
                <ScrollView
                    overScrollMode="never"
                    bounces={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* ---------------- IDENTITY SECTION ---------------- */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarGlow} />
                            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                            <TouchableOpacity style={styles.cameraBadge}>
                              <Ionicons name="camera" size={16} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.userName}>{user.username}</Text>
                        <View style={styles.badgeRow}>
                            <View style={styles.planBadge}>
                                <Text style={styles.planBadgeText}>{getUserData?.type || 'Free'} Plan</Text>
                            </View>
                            <Text style={styles.userHandle}>@{user.username}</Text>
                        </View>
                    </View>

                    {/* ---------------- ACTIONS GROUP ---------------- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
                        <View style={styles.cardGroup}>
                            <SettingItem
                                icon="globe-outline"
                                color="#0ea5e9" // A nice sky blue
                                header="Public Profile"
                                subHeading="View and share your profile"
                                onPress={() => {

                                }}
                            />
                            <View style={styles.innerDivider} />
                            <SettingItem
                                icon="person-outline"
                                color="#3b82f6"
                                header="Edit Profile"
                                subHeading="Update name, bio, and avatar"
                                onPress={() => console.log("Edit")}
                            />
                            <View style={styles.innerDivider} />
                            <SettingItem
                                icon="shield-checkmark-outline"
                                color="#10b981"
                                header="Security"
                                subHeading="Password and 2FA settings"
                                onPress={() => console.log("Security")}
                            />
                            <View style={styles.innerDivider} />
                            <SettingItem
                                icon="card-outline"
                                color="#a855f7"
                                header="Subscription"
                                subHeading="Manage your pro features"
                                onPress={() => console.log("Sub")}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>PREFERENCES</Text>
                        <View style={styles.cardGroup}>
                            <SettingItem
                                icon="notifications-outline"
                                color="#f59e0b"
                                header="Notifications"
                                subHeading="Alerts and push settings"
                                onPress={() => console.log("Notif")}
                            />
                            <View style={styles.innerDivider} />
                            <SettingItem
                                icon="color-wand-outline"
                                color="#ec4899"
                                header="Appearance"
                                subHeading="Dark mode and themes"
                                onPress={() => console.log("Theme")}
                            />
                        </View>
                    </View>

                    {/* ---------------- LOGOUT ---------------- */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => signOut()}
                        style={styles.signOutBtn}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>Version 1.0.2 (Beta)</Text>
                </ScrollView>
            </View>
    );
};

/* ---------------- SUB-COMPONENTS ---------------- */

const SettingItem = ({ icon, color, header, subHeading, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.settingText}>
            <Text style={styles.settingHeader}>{header}</Text>
            <Text style={styles.settingSub}>{subHeading}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#333" />
    </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1 , marginHorizontal:16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    scrollContent: {  paddingBottom: 100 },

    // Identity Section
    profileHeader: { alignItems: "center", marginBottom: 40 , marginTop:20},
    avatarContainer: { position: "relative", marginBottom: 16 },
    avatarGlow: {
        position: "absolute",
        top: -10, bottom: -10, left: -10, right: -10,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#222" },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "white",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#000",
    },
    userName: { color: "white", fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
    planBadge: { backgroundColor: "#1a1a1c", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#333" },
    planBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
    userHandle: { color: "#666", fontSize: 14 },

    // Card Groups
    section: { marginBottom: 24 },
    sectionLabel: { color: "#444", fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
    cardGroup: { backgroundColor: "#111", borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "#222" },
    settingItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 16 },
    iconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    settingText: { flex: 1 },
    settingHeader: { color: "white", fontSize: 16, fontWeight: "600" },
    settingSub: { color: "#666", fontSize: 12, marginTop: 2 },
    innerDivider: { height: 1, backgroundColor: "#1e1e1e", marginHorizontal: 16 },

    // Sign Out
    signOutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "#1a0a0a",
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#421212",
        marginTop: 10,
    },
    signOutText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },
    versionText: { color: "#333", fontSize: 12, textAlign: "center", marginTop: 24, fontWeight: "600" },
});

export default Index;