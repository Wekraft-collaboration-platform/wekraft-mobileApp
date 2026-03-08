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
import {Id} from "@/convex/_generated/dataModel";
import {useGetProjectHealthScore} from "@/queries/project/useGetProjectHealthScore";
import Toast from "react-native-toast-message";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";

const ProjectStatsTabScreen = ({health,projectData,languages,openIssue,openPr,stopNavigation,openHealth,openCommits,mode,handleRequestJoin} :
                               {mode:String,projectData:any,health:any,languages:any,openIssue:()=>void,openPr:()=>void,stopNavigation:(stop:boolean)=>void,openHealth:()=>void,openCommits:()=>void,handleRequestJoin: (role:string)=>void}) => {


    const [open, setOpen] = useState(false);

    const updateProject = useMutation(api.projects.updateProject)
    const getScore = useGetProjectHealthScore(projectData._id)

    const handleHealthScroe = async ()=>{

        try {
            if(!projectData._id) return

            stopNavigation(true)


            const { data: score } = await getScore.refetch()


            console.log("Old Data")
            console.log(projectData.healthScore)
            console.log("New Data")
            console.log(score)
            console.log("Project Id")
            console.log(projectData._id)

            await updateProject({
                projectId: projectData._id as Id<"projects">,
                healthScore:score
            })

            Toast.show({
                type:"success",
                text1:"Success!",
                text2:"Project has been Health Updated successfully!",
                position:"bottom",
                visibilityTime:2000
            })

            stopNavigation(false)

        }catch (error){
            Toast.show({
                type:"error",
                text1:"Something went wrong",
                text2:"try to fetch sometime later",
                position:"bottom",
                visibilityTime:2000
            })
            console.log(error)
            stopNavigation(false)
        }

    }

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
                        refreshScore={()=>{
                            handleHealthScroe()
                        }}
                        mode={mode}
                        visibleRefresh={isVisible}
                        reFresh={()=>{
                            handleHealthScroe()
                        }}
                    />
                </View>

            ):(


                mode === "admin" ? (
                    <AdminProjectHealthEmptyState stopNav={() =>
                    {
                        handleHealthScroe()
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
                    value={`${health?.totalPRs}`}
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


            {/* Team Roles Container */}
            <View style={{
                marginTop: 20,
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                borderWidth: 1,
                borderRadius: 16,
                overflow: 'hidden'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    gap: 10,
                    backgroundColor: "#18181b", // Slight lift for the header
                    borderBottomWidth: 1,
                    borderBottomColor: "#27272a"
                }}>
                    <TeamsIcon size={20} color="#a1a1aa" />
                    <Text style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "600",
                        letterSpacing: -0.5
                    }}>
                        Project Team
                    </Text>
                </View>

                <View style={{ padding :16,backgroundColor:"#18181b" }}>
                    {projectData?.lookingForMembers?.length > 0 ? (
                        <View>
                            <Text style={{
                                color: "#71717a",
                                fontSize: 12,
                                fontWeight: "700",
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                marginBottom: 16
                            }}>
                                Open Positions
                            </Text>

                            {projectData.lookingForMembers.map((member, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 12,
                                        backgroundColor: "#18181b",
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: "#27272a",
                                        marginBottom: 10
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                        <View style={{
                                            backgroundColor: "#27272a",
                                            borderRadius: 8,
                                            width: 40,
                                            height: 40,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <TeamsIcon size={18} color="#3b82f6" />
                                        </View>
                                        <View>
                                            <Text style={{ color: "#fafafa", fontSize: 14, fontWeight: "600" }}>
                                                {member.role}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" }} />
                                                <Text style={{ color: "#71717a", fontSize: 12 }}>
                                                    {member.type}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>


                                    {mode === "user" && (

                                    <TouchableOpacity
                                        onPress={() => handleRequestJoin(member.role)}
                                        activeOpacity={0.7}
                                        style={{
                                            backgroundColor: "white",
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 8
                                        }}
                                    >
                                        <Text style={{ color: "black", fontSize: 13, fontWeight: "600" }}>Apply</Text>
                                    </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        /* Enhanced Empty State */
                        <View style={{
                            paddingVertical: 40,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: "#18181b",
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 12,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                borderColor: "#3f3f46"
                            }}>
                                <TeamsIcon size={28} color="#3f3f46" />
                            </View>
                            <Text style={{ color: "#a1a1aa", fontSize: 14, fontWeight: "500" }}>
                                No roles currently listed
                            </Text>
                        </View>
                    )}
                </View>
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
                          isFreshRepo,
                          onPress,
                      }: {
    velocity7d: number,
    velocityPrev7d: number,
    velocityDelta: number,
    velocityTrend: "up" | "down" | "flat" | "insufficient",
    isFreshRepo: boolean,
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
        borderColor: "#27272a",
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
        borderColor: "#27272a", borderWidth: 1, borderRadius: 24, padding: 16,
    },
    listContainer: {
        paddingHorizontal: 8,
    },
})
