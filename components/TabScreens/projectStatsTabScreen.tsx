import React, {useMemo, useState} from 'react';
import {View, Text, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import SemiCircle from "@/components/Helper/semiCircle";
import {Ionicons} from "@expo/vector-icons";
import {GithubPrMergeRateIcon, TrendDownIcon, TrendFlatIcon, TeamsIcon,TrendUpIcon, WarningIcon} from "@/components/Icons";
import {router} from "expo-router";
import VelocityBreakdownDialog from "@/components/Dialogs/VelocityBreakdownDialog";
import LanguageListItem from "@/components/Helper/LanguageListItem"
import AdminProjectHealthEmptyState from "@/components/EmptyStates/AdminProjectHealthEmptyState";
import UserProjectHealthEmptyState from "@/components/EmptyStates/UserProjectHealthEmptyState";

const ProjectStatsTabScreen = ({health,projectData,languages,openIssue,openPr,stopNavigation,openHealth,openCommits,mode,handleRequestJoin} :
                               {mode:String,projectData:any,health:any,languages:any,openIssue:()=>void,openPr:()=>void,stopNavigation:(stop:boolean)=>void,openHealth:()=>void,openCommits:()=>void,handleRequestJoin: (role:string)=>void}) => {


    const [open, setOpen] = useState(false);

    const isVisible = useMemo(() => {
        const dateStr = projectData?.healthScore?.lastCalculatedDate;
        if (!dateStr) return false;

        const [y, m, d] = dateStr.split('-').map(Number);

        const base = new Date(y, m - 1, d); // ✅ FIXED
        base.setHours(0, 0, 0, 0);

        const threshold = new Date(base);
        threshold.setDate(base.getDate() + 3);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return today > threshold;
    }, [projectData?.healthScore?.lastCalculatedDate]);

    const hadlePress = () => {
        setOpen(true)
    }
    return (
        <View style={{ flex: 1 }}>

            {/* Project Health */}

            {projectData?.healthScore ? (
                <View style={{marginBottom:16}}>
                    < SemiCircle
                        score={projectData?.healthScore?.totalScore}
                        openH={()=>{
                            openHealth()
                        }}
                        mode={mode}
                        visibleRefresh={isVisible}
                        reFresh={()=>{
                            stopNavigation(false)

                        }}
                    />
                </View>

            ):(


                mode === "admin" ? (
                    <AdminProjectHealthEmptyState stopNav={(stop) =>
                    {
                        stopNavigation(stop)
                    }
                    } />
                ):(
                    <UserProjectHealthEmptyState/>
                )

            )}


            {/* METRICS */}
            <View style={styles.metricsGrid}>
                <MetricCard
                    // icon={<GithubLastCommitIcon size={22} color="white" />}
                    icon={<Ionicons name="git-commit-outline" size={22} color="#62A8FF"/>}
                    value={health?.totalCommits || ""}
                    label="Total Commits"
                    onPress={()=>{
                        openCommits()
                    }}
                    extra={< Text style={{color: "#62A8FF", fontSize: 12}}> +12 </Text>}
                />
                < MetricCard
                    icon={< GithubPrMergeRateIcon size={22} color="#C88AFF"/>}
                    value={`${health?.prCount}`}
                    label="Open PR"
                    onPress={() => {
                        openPr()
                    }}
                    extra={< Text
                        style={{color: "#C88AFF", fontSize: 12}}> {health?.prMergeRate ?? "0"}% </Text>}
                />
                < MetricCard
                    icon={< WarningIcon size={22} color="black" backgroundColor="#D17A34"/>}
                    value={health?.openIssuesCount}
                    onPress={() => {
                        openIssue()
                    }}
                    label="Open Issues"
                    extra={< Text style={{color: "#D17A34", fontSize: 12}}> +4 </Text>}
                />

                <VelocityCard
                    velocity7d={health?.velocity7d!}
                    velocityPrev7d={health?.velocityPrev7d!}
                    velocityDelta={health?.velocityDelta!}
                    velocityTrend={health?.velocityTrend!}
                    isFreshRepo={health?.isFreshRepo!}
                    onPress={() => {
                        hadlePress()
                    }}
                />

            </View>


            {/* Lamguges */}

            <View style={styles.container}>
                <Text style={[styles.sectionHeader, { marginBottom: 12, letterSpacing :1,fontWeight: "700", color: "#fff" }]}>
                    {"<>"} Project Languages
                </Text>

                <View style={styles.listContainer}>
                    {languages?.breakdown.map((item, index) => (
                        <LanguageListItem
                            key={item.language}
                            value={item.percentage}
                            languageName={item.language}
                            isLast={index === languages.breakdown.length - 1}
                        />
                    ))}
                </View>
            </View>


            {/* Team Roles */}
            <View style={{
                marginTop: 16,
                flex: 1,
                justifyContent: "center",
                backgroundColor: "#18181b",
                borderColor: "#3f3f46",
                borderWidth: 1,
                borderRadius: 24,
                padding: 16,
            }}>

                <View className="flex-row w-full items-center gap-4 ml-2">
                    <TeamsIcon size={24} color="white" />
                    <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>
                        Team & Roles
                    </Text>
                </View>

                {projectData?.lookingForMembers?.length > 0 ? (
                    <View className="mt-2">
                        <View style={styles.divider} />
                        <Text style={[styles.sectionHeader, { marginBottom: 10 }]}>
                            Current Open Positions
                        </Text>

                        {projectData.lookingForMembers?.map((member, index) => (
                            <View key={index} className="flex-row justify-between items-center mb-4">
                                <View className="flex-row gap-3 items-center">
                                    <View style={{
                                        backgroundColor: "#212222",
                                        borderRadius: 999,
                                        borderWidth: 1,
                                        borderColor: "#3A3A3A",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 48,
                                        height: 48
                                    }}>
                                        <TeamsIcon size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                                            {member.role}
                                        </Text>
                                        <Text style={{ color: "#888", fontSize: 12 }}>
                                            {member.type}
                                        </Text>
                                    </View>
                                </View>

                                {/* Request Button */}
                                <TouchableOpacity
                                    onPress={() => handleRequestJoin(member.role)}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 12
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Request</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.TeamRoles}>
                        <TeamsIcon size={48} color="white" />
                        <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>
                            No roles listed yet
                        </Text>
                    </View>
                )}

                {/* LOCK OVERLAY */}
                {!projectData?.isPublic && (
                    <View style={styles.TeamRolesOverlay}>
                        <Text style={[styles.sectionHeader, { fontSize: 14, fontWeight: "bold", textAlign: "center" }]}>
                            Make the Project Public to enable this section
                        </Text>
                    </View>
                )}
            </View>




            <VelocityBreakdownDialog
                visible={open}
                onClose={() => setOpen(false)}
                velocity7d={health?.velocity7d!}
                commitCount={health?.commitCount}
                commitScore={health?.velocityBreakdown.commits}
                issueCount={health?.issueCount}
                issueScore={health?.velocityBreakdown.issues}
                prCount={health?.prCount}
                prScore={health?.velocityBreakdown.prs}
            />


        </View>
    );
};

export default ProjectStatsTabScreen;



const MetricCard = ({
                        icon,
                        value,
                        label,
                        extra,
                        onPress,
                    }: {
    icon: React.ReactNode
    value: string | number
    label: string,
    extra: React.ReactNode,
    onPress?: () => void
}) => {
    return (
        <Pressable style={styles.metricCard} onPress={onPress}>
            <View className="flex-row justify-between">
                {icon}
                {extra}
            </View>
            < Text style={styles.metricValue}> {value} </Text>
            < Text style={styles.metricLabel}> {label} </Text>
        </Pressable>
    )
}


const VelocityCard = ({
                          velocity7d,
                          velocityPrev7d,
                          velocityDelta,
                          velocityTrend,
                          isFreashrepo,
                          onPress,
                      }: {
    velocity7d: number,
    velocityPrev7d: number,
    velocityDelta: number,
    velocityTrend: "up" | "down" | "flat" | "insufficient",
    isFreashrepo: boolean,
    onPress: () => void
}) =>
{

    const showPrecenatge = velocity7d >= 1 && velocityTrend !== "insufficient"

    const percentage = velocityTrend !== "insufficient" ? ((velocityDelta / velocityPrev7d) * 100).toFixed(1) + "% " : null

    const trendIcon =
        velocityTrend === "up"
            ? "trending-up"
            : velocityTrend === "down"
                ? "trending-down"
                : "remove";


    const trendColor =
        velocityTrend === "up"
            ? "#22c55e"
            : velocityTrend === "down"
                ? "#ef4444"
                : "#9ca3af";


    const statusLabel =
        velocityTrend === "insufficient"
            ? "New"
            : velocityTrend === "up"
                ? "High"
                : velocityTrend === "down"
                    ? "Low"
                    : "Stable";

    const renderDeltaText = () => {
        if (velocityTrend === "insufficient") {
            return "New project – insufficient history";
        }


        if (Math.abs(velocityDelta) < 5) {
            return "No significant change";
        }


        if (percentage) {
            return `${velocityDelta > 0 ? "+" : ""}${velocityDelta} (${percentage}%) vs last week`;
        }


        return `${velocityDelta > 0 ? "+" : ""}${velocityDelta} vs last week`;
    };


    return (


        <Pressable
            onPress={() => {
                onPress()
            }}
            style={[styles.metricCard]}>
            {/* Header */}

            <View className="flex-row justify-between items-center">

                < Ionicons name={trendIcon} size={20} color={trendColor}/>
                <Text style={[styles.status, {color: trendColor}]}>
                    <Text style={{color:trendColor}}>{percentage} </Text>
                    {statusLabel}
                </Text>
            </View>

            {/* Main value */}
            <Text style={styles.metricValue}> {velocity7d} </Text>
            < Text style={styles.metricLabel}>Velocity</Text>


            <View style={{
                position: "absolute",
                right: -20,
                bottom: 8,
                zIndex: 0,
            }}>
                {velocityTrend === "up" && (
                    <TrendUpIcon/>
                )}

                {velocityTrend === "down" && (
                    <TrendDownIcon/>
                )}
                {(velocityTrend === "flat" || velocityTrend === "insufficient") && (
                    <TrendFlatIcon/>
                )}
            </View>


        </Pressable>
    );


}


const styles = StyleSheet.create({
    status: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
    },

    TeamRoles: {
        alignItems: "center",
        gap: 4,
        paddingVertical: 40,
        borderRadius: 12,
        marginBottom: 16,
    },
    TeamRolesOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius:24,
        backgroundColor: "rgba(0,0,0,0.50)",
        justifyContent: "center",
        alignItems: "center",
    },
    lockedText: {
        color: "#9ca3af",
        fontSize: 14,
        fontWeight: "600",
    },





    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        marginBottom: 8,
    },



    metricsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },

    metricCard: {
        width: "48%",
        backgroundColor: "#18181b",
        borderColor: "#3f3f46",
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
    },

    metricValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginTop: 12,
    },

    metricLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "rgba(255,255,255,0.7)",
        marginTop: 4,
    },

    divider: {
        height: 1,
        backgroundColor: "#333",
        marginVertical: 6,
    },


    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dot: { width: 6, height: 6, borderRadius: 3 },

    container: {
        marginTop: 16, flex: 1, backgroundColor: "#18181b",
        borderColor: "#3f3f46", borderWidth: 1, borderRadius: 24, padding: 16,
    },
    listContainer: {
        paddingHorizontal: 8,
    },
})
