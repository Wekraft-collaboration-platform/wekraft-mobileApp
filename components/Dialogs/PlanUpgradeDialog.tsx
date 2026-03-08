import React from 'react';
import {StyleSheet, View, Pressable, Modal, Platform, TouchableOpacity} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Using your exact Professional Color Palette
const COLORS = {
    overlay: "rgba(0,0,0,0.8)", // Slightly darker for focus
    bg: "#18181b", // Zinc 900
    card: "#27272a", // Zinc 800
    border: "#3f3f46", // Zinc 700
    textPrimary: "#f4f4f5", // Zinc 100
    textSecondary: "#a1a1aa", // Zinc 400
    textTertiary: "#71717a", // Zinc 500
    accent: "#4ade80", // Green 400
    accentBg: "rgba(74, 222, 128, 0.1)",
    iconBg: "#3f3f46",
};

const PlanUpgradeDialog = ({ visible, onDismiss, onUpgrade, limit = 3 }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <Pressable style={styles.backdrop} onPress={onDismiss}>
                <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>

                    {/* Close Trigger */}
                    <View style={styles.header}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Usage Limit</Text>
                        </View>
                        <Pressable onPress={onDismiss} style={styles.closeBtn}>
                            <Ionicons name="close" size={18} color={COLORS.textSecondary} />
                        </Pressable>
                    </View>

                    {/* Visual Hero */}
                    <View style={styles.heroContainer}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name="rocket-launch" size={32} color={COLORS.accent} />
                        </View>
                        <Text style={styles.title}>Unlock Full Capacity</Text>
                        <Text style={styles.description}>
                            You've utilized your <Text style={{color: COLORS.textPrimary, fontWeight: '700'}}>{limit}/{limit}</Text> project slots.
                            Upgrade to Pro for unlimited workspace and team velocity tracking.
                        </Text>
                    </View>

                    {/* Feature Breakdown (Matching your List style) */}
                    <View style={styles.listContainer}>
                        <FeatureRow icon="infinity" label="Unlimited Projects" />
                        <View style={styles.divider} />
                        <FeatureRow icon="chart-timeline-variant" label="Advanced Velocity Metrics" />
                        <View style={styles.divider} />
                        <FeatureRow icon="account-group-outline" label="Priority Collaboration" />
                    </View>

                    {/* Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={onUpgrade}
                            style={styles.primaryBtn}
                        >
                            <Text style={styles.primaryBtnText}>Upgrade to Pro</Text>
                            <Ionicons name="arrow-forward" size={16} color="#000" />
                        </TouchableOpacity>

                        <Pressable onPress={onDismiss} style={styles.secondaryBtn}>
                            <Text style={styles.secondaryBtnText}>Keep Current Plan</Text>
                        </Pressable>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

// Sub-component for features
function FeatureRow({ icon, label }: { icon: any, label: string }) {
    return (
        <View style={styles.row}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={18} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.rowLabel}>{label}</Text>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    dialog: {
        width: "100%",
        // maxWidth: 360,
        backgroundColor: COLORS.bg,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
            android: { elevation: 10 },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        backgroundColor: COLORS.accentBg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.accent + '33',
    },
    badgeText: {
        color: COLORS.accent,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    closeBtn: {
        padding: 4,
        backgroundColor: COLORS.card,
        borderRadius: 20,
    },
    heroContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    listContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowLabel: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 4,
        opacity: 0.5,
    },
    footer: {
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: COLORS.textPrimary, // White-ish button
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryBtnText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 15,
    },
    secondaryBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: COLORS.textTertiary,
        fontSize: 13,
        fontWeight: '600',
    },
});

export default PlanUpgradeDialog;