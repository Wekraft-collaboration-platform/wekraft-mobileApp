import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Linking,
} from "react-native"
import React, { useState, useMemo } from "react"
import { MotiView, AnimatePresence } from "moti"
import { LinearTransition } from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import {useGetProjectIssue} from "@/queries/project/useGetProjectIssues";
import { formatRelativeTime} from "@/components/Helper/helper";
import { useProject } from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";

type IssueLabel =
    | string
    | { id?: number; name?: string; color?: string | null }

const LabelChip = ({ label }: { label: IssueLabel }) => {
    const isObj = typeof label !== "string"
    const name = isObj ? label.name : label
    const color = isObj && label.color ? `#${label.color}` : "#3f3f46"

    return (
        <View
            style={{ backgroundColor: color + '15', borderColor: color + '30' }}
            className="px-2 py-0.5 rounded-md border"
        >
            <Text style={{ color: color }} className="text-[10px] font-bold uppercase tracking-tighter">
                {name}
            </Text>
        </View>
    )
}

const IssueCard = ({ issue, index }: { issue: any; index: number }) => {
    const [expanded, setExpanded] = useState(false)
    const isPR = !!issue.pull_request
    const isClosed = issue.state === "closed"

    return (
        <MotiView
            // Professional Entrance: Subtle fade and slight lift, no bounce
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'timing',
                duration: 400,
                delay: index < 10 ? index * 50 : 0 // Faster stagger for "tighter" feel
            }}
            layout={LinearTransition.duration(300)} // Predictable layout shift
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpanded(v => !v)}
                className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 mb-3"
            >
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-neutral-500 font-mono text-[10px] tracking-widest">#{issue.number}</Text>
                    <View className="flex-row items-center gap-2">
                        {isPR && <Ionicons name="git-pull-request" size={14} color="#A855F7" />}
                        <View className={`px-2 py-0.5 rounded-md ${isClosed ? "bg-red-500/10 border border-red-500/20" : "bg-green-500/10 border border-green-500/20"}`}>
                            <Text className={`text-[9px] font-black tracking-tight ${isClosed ? "text-red-400" : "text-green-400"}`}>
                                {issue.state.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text className="text-white text-[15px] font-bold mb-3 leading-5" numberOfLines={2}>
                    {issue.title}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        <Image source={{ uri: issue.user.avatar_url }} className="w-5 h-5 rounded-full bg-neutral-800" />
                        <Text className="text-neutral-400 text-xs font-medium">{issue.user.login}</Text>
                    </View>
                    <Text className="text-neutral-600 text-[10px] font-medium">{formatRelativeTime(issue.created_at)}</Text>
                </View>

                <AnimatePresence>
                    {expanded && (
                        <MotiView
                            from={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: 'timing', duration: 250 }}
                            className="overflow-hidden"
                        >
                            <View className="mt-4 pt-4 border-t border-neutral-800/40 gap-3">
                                {issue.labels.length > 0 && (
                                    <View className="flex-row flex-wrap gap-1.5 mb-1">
                                        {issue.labels.map((l: IssueLabel, i: number) => <LabelChip key={i} label={l} />)}
                                    </View>
                                )}
                                {issue.body && (
                                    <Text className="text-neutral-400 text-xs leading-5 italic opacity-80" numberOfLines={4}>
                                        {issue.body.trim()}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(issue.html_url)}
                                    className="bg-neutral-800 py-2.5 rounded-xl items-center border border-neutral-700/50"
                                >
                                    <Text className="text-white text-xs font-bold">Open Discussion</Text>
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </TouchableOpacity>
        </MotiView>
    )
}

function ProjectIssuesScreen() {
    type IssueStatusFilter = "all" | "open" | "closed"
    type IssueSort = "newest" | "oldest" | "comments"

    const [statusFilter, setStatusFilter] = useState<IssueStatusFilter>("open")
    const [sortBy, setSortBy] = useState<IssueSort>("newest")
    const { project } = useProject()

    const { data, isLoading, isError } = useGetProjectIssue(
        project?.repoOwner ?? "",
        project?.repoName ?? ""
    )

    const processedIssues = useMemo(() => {
        if (!data) return []
        let issues = [...data]
        if (statusFilter !== "all") {
            issues = issues.filter(i => i.state === statusFilter)
        }
        switch (sortBy) {
            case "oldest": issues.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
            case "comments": issues.sort((a, b) => b.comments - a.comments); break
            default: issues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
        return issues
    }, [data, statusFilter, sortBy])


    if (!project || isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-white">Loading....</Text>
            </View>
        );
    }
    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}>
                {/* HEADER - No spring, just a simple fade and slide */}
                <MotiView
                    from={{ opacity: 0, translateX: -10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                    className="flex-row items-center gap-4 pb-6"
                >
                    <TouchableOpacity onPress={() => router.back()} className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-xl font-bold tracking-tight">Active Issues</Text>
                        <Text className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">{project.projectName}</Text>
                    </View>
                </MotiView>

                {/* FILTER CARD - Tighter padding and simpler colors */}
                <MotiView
                    from={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 400, delay: 100 }}
                    className="bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-3 mb-6"
                >
                    <View className="flex-row gap-1.5 mb-3">
                        {[{ key: "open", icon: "radio-button-on" }, { key: "closed", icon: "checkmark-circle" }, { key: "all", icon: "layers" }].map(item => (
                            <TouchableOpacity
                                key={item.key}
                                onPress={() => setStatusFilter(item.key as IssueStatusFilter)}
                                className={`flex-1 flex-row items-center justify-center gap-2 py-2 rounded-xl border ${statusFilter === item.key ? "bg-white/10 border-white/20" : "bg-transparent border-transparent"}`}
                            >
                                <Ionicons name={item.icon as any} size={12} color={statusFilter === item.key ? "white" : "#737373"} />
                                <Text className={`text-[10px] font-bold capitalize ${statusFilter === item.key ? "text-white" : "text-neutral-500"}`}>{item.key}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row gap-2 items-center">
                        <Ionicons name="filter-outline" size={12} color="#525252" className="ml-1" />
                        {["newest", "oldest", "comments"].map(s => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setSortBy(s as IssueSort)}
                                className={`px-2 py-1 rounded-md ${sortBy === s ? "bg-purple-500/20 border border-purple-500/30" : "bg-neutral-800/50 border border-transparent"}`}
                            >
                                <Text className={`text-[12px] font-bold capitalize ${sortBy === s ? "text-purple-400" : "text-neutral-600"}`}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </MotiView>

                <FlatList
                    data={processedIssues}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => <IssueCard issue={item} index={index} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="items-center justify-center py-20">
                            <Text className="text-neutral-600 text-sm font-medium">No results found.</Text>
                        </MotiView>
                    }
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>
    )
}

export default ProjectIssuesScreen