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
import { FadeInLeft, LinearTransition } from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import {useGetProjectPulls} from "@/queries/project/useGetProjectPullsRequest";
import {formatRelativeTime} from "@/components/Helper/helper";
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";

type PullLabel = {
    id: number
    name: string
    color: string
}

const LabelChip = ({ label }: { label: PullLabel }) => (
    <View
        className="px-2 py-0.5 rounded-md border"
        style={{
            backgroundColor: `#${label.color}15`,
            borderColor: `#${label.color}40`
        }}
    >
        <Text style={{ color: `#${label.color}` }} className="text-[10px] font-bold uppercase tracking-tight">
            {label.name}
        </Text>
    </View>
)

const PullRequestCard = ({ pr, index }: { pr: any, index: number }) => {
    const [expanded, setExpanded] = useState(false)

    const isMerged = !!pr.merged_at
    const isClosed = pr.state === "closed" && !isMerged
    const isDraft = pr.draft

    const statusStyles = isMerged
        ? { container: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", label: "MERGED" }
        : isClosed
            ? { container: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "CLOSED" }
            : isDraft
                ? { container: "bg-neutral-500/10 border-neutral-500/20", text: "text-neutral-400", label: "DRAFT" }
                : { container: "bg-green-500/10 border-green-500/20", text: "text-green-400", label: "OPEN" }

    return (
        <MotiView
            from={{ opacity: 0, translateX: -15 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index < 10 ? index * 50 : 0 }}
            layout={LinearTransition.duration(300)}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpanded(v => !v)}
                className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 mb-3"
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-neutral-500 font-mono text-[10px] tracking-widest">#{pr.number}</Text>
                    <View className={`px-2 py-0.5 rounded-md border ${statusStyles.container}`}>
                        <Text className={`text-[9px] font-black`}>{statusStyles.text} {statusStyles.label}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="text-white text-[15px] font-bold mb-3 leading-5" numberOfLines={2}>
                    {pr.title}
                </Text>

                {/* User & Meta */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                        <Image source={{ uri: pr.user.avatar_url }} className="w-5 h-5 rounded-full bg-neutral-800" />
                        <Text className="text-neutral-400 text-xs font-medium">{pr.user.login}</Text>
                    </View>
                    <Text className="text-neutral-600 text-[10px]">{formatRelativeTime(pr.created_at)}</Text>
                </View>

                {/* Branch Info Badge */}
                <View className="flex-row items-center self-start bg-neutral-800/50 px-2 py-1 rounded-lg border border-neutral-700/30">
                    <Ionicons name="git-branch-outline" size={10} color="#737373" />
                    <Text className="text-neutral-500 text-[10px] ml-1 font-mono">
                        {pr.head.ref} <Text className="text-neutral-700">→</Text> {pr.base.ref}
                    </Text>
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
                                {pr.labels.length > 0 && (
                                    <View className="flex-row flex-wrap gap-1.5">
                                        {pr.labels.map((l: PullLabel) => <LabelChip key={l.id} label={l} />)}
                                    </View>
                                )}
                                {pr.body && (
                                    <Text className="text-neutral-400 text-xs leading-5 italic" numberOfLines={4}>
                                        {pr.body.trim()}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(pr.html_url)}
                                    className="bg-purple-600/10 py-2.5 rounded-xl items-center border border-purple-500/20"
                                >
                                    <Text className="text-purple-400 text-xs font-bold">Review Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </TouchableOpacity>
        </MotiView>
    )
}

function ProjectPullRequests() {
    type PRStatus = "all" | "open" | "closed" | "merged"
    const [statusFilter, setStatusFilter] = useState<PRStatus>("open")
    const { project } = useProject()

    const { data, isLoading, isError } = useGetProjectPulls(
        project?.repoOwner ?? "",
        project?.repoName ?? ""
    )

    const processedPulls = useMemo(() => {
        if (!data) return []
        let pulls = [...data]
        if (statusFilter !== "all") {
            pulls = pulls.filter(pr => statusFilter === "merged" ? !!pr.merged_at : pr.state === statusFilter)
        }
        return pulls.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }, [data, statusFilter])

    if (!project || isLoading) return(
        <View className={"flex-1 justify-center items-center"} > <Text>Loading....</Text></View>
    )

    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}>
                {/* Header */}
                <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="flex-row items-center gap-4 pb-6"
                >
                    <TouchableOpacity onPress={() => router.back()} className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-xl font-bold tracking-tight">Pull Requests</Text>
                        <Text className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">{project.projectName}</Text>
                    </View>
                </MotiView>

                {/* Filter Bar */}
                <MotiView
                    entering={FadeInLeft.delay(200)}
                    className="bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-2 mb-6"
                >
                    <View className="flex-row gap-1">
                        {["open", "merged", "closed", "all"].map(s => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setStatusFilter(s as PRStatus)}
                                className={`flex-1 py-2 rounded-xl items-center ${statusFilter === s ? "bg-white/10 border border-white/10" : "bg-transparent"}`}
                            >
                                <Text className={`text-[12px] font-bold uppercase ${statusFilter === s ? "text-white" : "text-neutral-500"}`}>
                                    {s}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </MotiView>

                <FlatList
                    data={processedPulls}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => <PullRequestCard pr={item} index={index} />}
                    ListEmptyComponent={
                        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="items-center justify-center py-20">
                            <Text className="text-neutral-600 text-sm font-medium">No pull requests found.</Text>
                        </MotiView>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>
    )
}

export default ProjectPullRequests