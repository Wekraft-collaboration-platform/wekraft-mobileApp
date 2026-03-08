import React from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Pressable,
    Platform,
    ScrollView,
} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {ImpactScoreResult} from "@/lib/impactScore";

type ImpactScoreBreakDownDialogProps = {
    impactScore: ImpactScoreResult | null;
    onClose: () => void;
    visible: boolean;
};

export const ImpactScoreBreakDownDialog = ({
                                               impactScore,
                                               onClose,
                                               visible,
                                           }: ImpactScoreBreakDownDialogProps) => {
    if (!impactScore) return null;

    const isBonusPositive = impactScore.consistencyBonus >= 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                {/* Stop propagation to prevent closing when clicking inside */}
                <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>

                    {/* --- Header --- */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Impact Score</Text>
                            <Text style={styles.subtitle}>Performance Breakdown</Text>
                        </View>

                        {/* Tier Badge */}
                        <View style={styles.tierBadge}>
                            <Text style={styles.tierLabel}>TIER</Text>
                            <Text style={styles.tierValue}>{impactScore.tier}</Text>
                        </View>
                    </View>

                    <ScrollView style={{marginVertical: 10}} showsVerticalScrollIndicator={false}>

                        {/* --- Hero Section (Weighted Activity) --- */}
                        <View style={styles.heroSection}>
                            <Text style={styles.heroLabel}>Weighted Activity Score</Text>
                            <Text style={styles.heroValue}>{impactScore.weightedActivity}</Text>

                            {/* Consistency Bonus Pill */}

                            {impactScore.consistencyBonus > 0 && (
                                <View style={[
                                    styles.bonusBadge,
                                    isBonusPositive ? styles.bonusSuccess : styles.bonusDanger
                                ]}>
                                    <Ionicons
                                        name={isBonusPositive ? "trending-up" : "trending-down"}
                                        size={14}
                                        color={isBonusPositive ? "#22c55e" : "#ef4444"}
                                    />
                                    <Text style={[
                                        styles.bonusText,
                                        {color: isBonusPositive ? "#22c55e" : "#ef4444"}
                                    ]}>
                                        {isBonusPositive ? "Consistency Bonus +" : "Consistency Penalty "}{impactScore.consistencyBonus}
                                    </Text>
                                </View>
                            )}

                        </View>

                        <View style={styles.divider}/>

                        {/* --- Grid: Activity Distribution --- */}
                        <Text style={styles.sectionTitle}>Activity Distribution</Text>
                        <View style={styles.gridContainer}>
                            <StatCard
                                label="Commits Score"
                                value={impactScore.breakdown.commits}
                                icon="source-commit"
                                color="#60a5fa" // Blue
                            />
                            <StatCard
                                label="Pull Requests Score"
                                value={impactScore.breakdown.prs}
                                icon="source-pull"
                                color="#c084fc" // Purple
                            />
                            <StatCard
                                label="Issues Score"
                                value={impactScore.breakdown.issues}
                                icon="alert-circle-outline"
                                color="#fbbf24" // Amber
                            />
                            <StatCard
                                label="Reviews Score"
                                value={impactScore.breakdown.reviews}
                                icon="eye-check-outline"
                                color="#2dd4bf" // Teal
                            />
                        </View>

                        {/* --- Active Penalties (Conditional) --- */}
                        {impactScore.penalties.length > 0 && (
                            <View style={styles.penaltySection}>
                                <Text style={styles.penaltyTitle}>Active Penalties</Text>
                                {impactScore.penalties.map((penalty, index) => (
                                    <View key={index} style={styles.penaltyRow}>
                                        <MaterialCommunityIcons name="alert-octagon" size={16} color={"#ef4444"}/>
                                        <Text style={styles.penaltyText}>{penalty}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <Text style={styles.footerNote}>
                            Scores are calculated based on complexity and frequency.
                        </Text>
                    </ScrollView>

                    {/* Close Button (Bottom) */}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>

                </Pressable>
            </Pressable>
        </Modal>
    );
};

// --- Sub-components ---

function StatCard({label, value, icon, color}: { label: string, value: number, icon: any, color: string }) {
    return (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <View style={[styles.iconBox, {backgroundColor: `${color}20`}]}>
                    {/* The '20' adds transparency to the hex color */}
                    <MaterialCommunityIcons name={icon} size={18} color={color}/>
                </View>
                <Text style={styles.statValue}>{value}</Text>
            </View>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    )
}

// --- Styles ---

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dialog: {
        width: "100%",
        maxWidth: 400,
        maxHeight: "80%",
        backgroundColor: "#18181b",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#3f3f46",
        padding: 24,
        ...Platform.select({
            ios: {shadowColor: "#000", shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20},
            android: {elevation: 10},
        }),
    },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#f4f4f5",
    },
    subtitle: {
        fontSize: 13,
        color: "#a1a1aa",
        marginTop: 2,
    },

    // Tier Badge
    tierBadge: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#3f3f46",
        // backgroundColor: "rgba(234, 179, 8, 0.1)", // Low opacity gold
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    tierLabel: {
        fontSize: 10,
        fontWeight: "800",
        color: "white",
        letterSpacing: 1,
        marginBottom: 2,
    },
    tierValue: {
        fontSize: 18,
        fontWeight: "900",
        color: "#a1a1aa",

        lineHeight: 20,
    },

    // Hero Section
    heroSection: {
        alignItems: "center",
        marginVertical: 10,
    },
    heroLabel: {
        fontSize: 14,
        color: "#a1a1aa",
        marginBottom: 8,
    },
    heroValue: {
        fontSize: 48,
        fontWeight: "800",
        color: "#f4f4f5",
        letterSpacing: -1,
        lineHeight: 56,
    },
    bonusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        gap: 6,
    },
    bonusSuccess: {backgroundColor: "rgba(34, 197, 94, 0.1)"},
    bonusDanger: {backgroundColor: "rgba(239, 68, 68, 0.1)"},
    bonusText: {fontSize: 13, fontWeight: "600"},

    divider: {
        height: 1,
        backgroundColor: "#3f3f46",
        marginVertical: 24,
    },

    // Grid
    sectionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#f4f4f5",
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    statCard: {
        width: "48%", // Roughly half minus gap
        backgroundColor: "rgba(39,39,42,0.5)",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(63,63,70,0.5)",
    },
    statHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#f4f4f5",
    },
    statLabel: {
        fontSize: 12,
        color: "#a1a1aa",
    },

    // Penalties
    penaltySection: {
        marginTop: 24,
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
        padding: 16,
    },
    penaltyTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ef4444",
        marginBottom: 12,
    },
    penaltyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    penaltyText: {
        fontSize: 13,
        color: "#ef4444",
        flex: 1,
    },

    // Footer & Close
    footerNote: {
        fontSize: 11,
        color: "#52525b", // Zinc 600
        textAlign: "center",
        marginTop: 24,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#27272a",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3f3f46",
    },
    closeButtonText: {
        color: "#f4f4f5",
        fontWeight: "600",
        fontSize: 15,
    },
});