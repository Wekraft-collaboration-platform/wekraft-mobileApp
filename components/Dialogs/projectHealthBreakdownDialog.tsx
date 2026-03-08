import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Progress from 'react-native-progress';


const COLORS = {
    overlay: "rgba(0,0,0,0.8)",
    bg: "#18181b",
    card: "#27272a",
    border: "#3f3f46",
    textPrimary: "#f4f4f5",
    textSecondary: "#a1a1aa",
    textTertiary: "#71717a",
    accent: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.1)",
};

const MetricRow = ({ label, score, max, icon, color }) => {
    const percentage = score / max;
    return (
        <View style={styles.rowContainer}>
            <View style={styles.rowTop}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={icon} size={20} color={color || COLORS.accent} />
                </View>
                <View style={styles.rowTextContainer}>
                    <Text style={styles.rowLabel}>{label}</Text>
                    <Text style={styles.rowDetail}>
                        Score: <Text style={{ color: COLORS.textPrimary }}>{score}</Text> / {max}
                    </Text>
                </View>
            </View>
            <View style={styles.progressWrapper}>
                <Progress.Bar
                    progress={percentage}
                    width={null}
                    height={6}
                    color={color || COLORS.accent}
                    unfilledColor={COLORS.border}
                    borderWidth={0}
                    borderRadius={3}
                />
            </View>
        </View>
    );
};

const ProjectHealthBreakdownDialog = ({ visible, onClose, healthScore }) => {
    if (!healthScore) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>

                    {/* --- Header --- */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Project Health</Text>
                            <Text style={styles.dateLabel}>Algorithmic Quality Analysis</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* --- Hero Score (Circular) --- */}
                    <View style={styles.heroContainer}>
                        <View style={styles.circleWrapper}>
                            <Progress.Circle
                                size={110}
                                progress={healthScore.totalScore / 100}
                                color={COLORS.accent}
                                thickness={8}
                                unfilledColor={COLORS.border}
                                borderWidth={0}
                                strokeCap="round"
                            />
                            <View style={styles.heroTextOverlay}>
                                <Text style={styles.heroValue}>{healthScore.totalScore}</Text>
                                <Text style={styles.heroLabel}>OVERALL</Text>
                            </View>
                        </View>
                        <View style={styles.statusBadge}>
                            <View style={styles.pulseDot} />
                            <Text style={styles.statusText}>Updated {healthScore.lastCalculatedDate}</Text>
                        </View>
                    </View>

                    {/* --- Breakdown List --- */}
                    <View style={styles.listContainer}>
                        <MetricRow
                            label="Activity Momentum"
                            icon="flash"
                            score={healthScore.activityMomentum}
                            max={35}
                            color="#60a5fa"
                        />
                        <View style={styles.divider} />
                        <MetricRow
                            label="Maintenance Quality"
                            icon="shield-check"
                            score={healthScore.maintenanceQuality}
                            max={35}
                            color="#4ade80"
                        />
                        <View style={styles.divider} />
                        <MetricRow
                            label="Community Trust"
                            icon="account-group"
                            score={healthScore.communityTrust}
                            max={20}
                            color="#c084fc"
                        />
                        <View style={styles.divider} />
                        <MetricRow
                            label="Freshness"
                            icon="leaf"
                            score={healthScore.freshness}
                            max={10}
                            color="#fbbf24"
                        />
                    </View>

                    {/* --- Footer --- */}
                    <View style={styles.footer}>
                        <Ionicons name="information-circle-outline" size={14} color={COLORS.textTertiary} />
                        <Text style={styles.footerText}>
                            Calculated via repo activity and release frequency. Refreshed every 72h.
                        </Text>
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ProjectHealthBreakdownDialog;

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
        // maxWidth: 380,
        backgroundColor: COLORS.bg,
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
            android: { elevation: 10 },
        }),
    },
    header: {
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textPrimary,
        letterSpacing: 0.3,
    },
    dateLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    closeBtn: {
        padding: 6,
        backgroundColor: COLORS.card,
        borderRadius: 20,
    },
    heroContainer: {
        alignItems: "center",
        marginBottom: 28,
        backgroundColor: COLORS.card,
        paddingVertical: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTextOverlay: {
        position: 'absolute',
        alignItems: 'center',
    },
    heroValue: {
        fontSize: 36,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },
    heroLabel: {
        fontSize: 10,
        color: COLORS.textTertiary,
        fontWeight: "700",
        letterSpacing: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accentBg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.accent,
        marginRight: 6,
    },
    statusText: {
        fontSize: 11,
        color: COLORS.accent,
        fontWeight: '600',
    },
    listContainer: {
        marginBottom: 24,
    },
    rowContainer: {
        paddingVertical: 4,
    },
    rowTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rowTextContainer: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
    rowDetail: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    progressWrapper: {
        width: '100%',
        paddingLeft: 48,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
        opacity: 0.4,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    footerText: {
        flex: 1,
        fontSize: 11,
        color: COLORS.textTertiary,
        marginLeft: 6,
        lineHeight: 16,
    },
});