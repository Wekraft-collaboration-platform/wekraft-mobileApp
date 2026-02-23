import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type VelocityBreakdownDialogProps = {
  visible: boolean;
  onClose: () => void;
  velocity7d: number;
  commitCount: number;
  commitScore: number;
  issueCount: number;
  issueScore: number;
  prCount: number;
  prScore: number;
};

// Professional Color Palette
const COLORS = {
  overlay: "rgba(0,0,0,0.7)",
  bg: "#18181b", // Zinc 900
  card: "#27272a", // Zinc 800
  border: "#3f3f46", // Zinc 700
  textPrimary: "#f4f4f5", // Zinc 100
  textSecondary: "#a1a1aa", // Zinc 400
  textTertiary: "#71717a", // Zinc 500
  accent: "#4ade80", // Green 400
  accentBg: "rgba(74, 222, 128, 0.1)", // Green with low opacity
  iconBg: "#3f3f46",
};

export default function VelocityBreakdownDialog({
  visible,
  onClose,
  velocity7d,
  commitCount,
  commitScore,
  issueCount,
  issueScore,
  prCount,
  prScore,
}: VelocityBreakdownDialogProps) {
  return (
    <Modal
          transparent
          visible = { visible }
  animationType = "fade"
  onRequestClose = { onClose }
    >
    <Pressable style={ styles.backdrop } onPress = { onClose } >
      {/* Stop propagation so clicking the modal content doesn't close it */ }
      < Pressable style = { styles.dialog } onPress = {(e) => e.stopPropagation()
}>

  {/* --- Header --- */ }
  < View style = { styles.header } >
    <View>
    <Text style={ styles.title }> Velocity Breakdown </Text>
      < Text style = { styles.dateLabel } > Last 7 Days </Text>
        </View>
        < Pressable
onPress = { onClose }
style = { styles.closeBtn }
hitSlop = { 8}
  >
  <Ionicons name="close" size = { 20} color = { COLORS.textSecondary } />
    </Pressable>
    </View>

{/* --- Hero Score --- */ }
<View style={ styles.heroContainer }>
  <Text style={ styles.heroValue }> { velocity7d } </Text>
    < Text style = { styles.heroLabel } > Total Velocity Points </Text>
      </View>

{/* --- Breakdown List --- */ }
<View style={ styles.listContainer }>
  <BreakdownRow
                  icon="source-commit"
label = "Commits"
detail = {`${commitCount} commits × 1 pt`}
value = { commitScore }
color = "#60a5fa" // Blue for commits
  />

  <View style={ styles.divider } />

    < BreakdownRow
icon = "alert-circle-outline"
label = "Issues Resolved"
detail = {`${issueCount} issues × 3 pts (filtered)`}
value = { issueScore }
color = "#fbbf24" // Amber for issues
  />

  <View style={ styles.divider } />

    < BreakdownRow
icon = "source-pull"
label = "PRs Merged"
detail = {`${prCount} PRs × weighted score`}
value = { prScore }
color = "#c084fc" // Purple for PRs
  />
  </View>

{/* --- Footer --- */ }
<View style={ styles.footer }>
  <Ionicons name="information-circle-outline" size = { 14} color = { COLORS.textTertiary } style = {{ marginRight: 4 }} />
    < Text style = { styles.footerText } >
      Low - effort activity and instant closures are excluded.
              </Text>
        </View>

        </Pressable>
        </Pressable>
        </Modal>
  );
}

// --- Sub-components ---

function BreakdownRow({
  label,
  detail,
  value,
  icon,
  color,
}: {
  label: string;
  detail: string;
  value: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}) {
  return (
    <View style= { styles.row } >
    {/* Icon */ }
    < View style = { [styles.iconContainer, { backgroundColor: COLORS.iconBg }]} >
      <MaterialCommunityIcons name={ icon } size = { 20} color = { color } />
        </View>

  {/* Text Info */ }
  <View style={ styles.rowTextContainer }>
    <Text style={ styles.rowLabel }> { label } </Text>
      < Text style = { styles.rowDetail } > { detail } </Text>
        </View>

  {/* Score Badge */ }
  <View style={ styles.scoreBadge }>
    <Text style={ styles.scoreValue }> +{ value } </Text>
      </View>
      </View>
  );
}

// --- Styles ---
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
    maxWidth: 360,
    backgroundColor: COLORS.bg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  closeBtn: {
    padding: 4,
    backgroundColor: COLORS.card,
    borderRadius: 20,
  },

  // Hero Section
  heroContainer: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: COLORS.card,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroValue: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.accent,
    lineHeight: 48,
  },
  heroLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },

  // List Section
  listContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  rowDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    opacity: 0.5,
  },

  // Badge
  scoreBadge: {
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accent,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
});