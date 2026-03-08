import { View, Text, FlatList, TouchableOpacity, Image, Linking } from "react-native";
import React from "react";
import { MotiView } from "moti"; // Professional motion library
import { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {useGetProjectCommits} from "@/queries/project/useGetProjectCommits";
import {formatRelativeTime} from "@/components/Helper/helper";
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import CommitSkeletonView from "@/components/SkeletonLayout/CommitsSkeletonView";
import CommitsSkeletonView from "@/components/SkeletonLayout/CommitsSkeletonView";

const CommitCard = ({ item, index, isLast }: { item: any; index: number; isLast: boolean }) => {
    const { commit, author, sha, html_url } = item;
    const [title, ...descriptionParts] = commit.message.split('\n\n');
    const description = descriptionParts.join('\n\n').trim();
    const shortSha = sha.substring(0, 7);

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'timing',
                duration: 500,
                delay: index * 100,
            }}
            className="flex-row "
        >

            <View className="items-center mr-4">
                <View className="w-3 h-3 rounded-full bg-purple-500 mt-5 z-10 shadow-lg shadow-purple-500/50" />
                {!isLast && <View className="w-[1px] flex-1 bg-neutral-800" />}
            </View>

            {/* Commits Card */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL(html_url)}
                className="flex-1 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-4 mb-4"
            >
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-white text-[15px] font-semibold flex-1 mr-2 leading-5 tracking-tight">
                        {title}
                    </Text>
                    <View className="bg-neutral-800/80 px-2 py-1 rounded-md border border-neutral-700/50">
                        <Text className="text-neutral-400 text-[10px] font-mono tracking-tighter">{shortSha}</Text>
                    </View>
                </View>

                {description ? (
                    <Text numberOfLines={2} className="text-neutral-500 text-xs mb-3 leading-4">
                        {description}
                    </Text>
                ) : null}

                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-neutral-800/40">
                    <View className="flex-row items-center gap-2">
                        <Image
                            source={{ uri: author?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }}
                            className="w-5 h-5 rounded-full bg-neutral-800"
                        />
                        <Text className="text-neutral-400 text-[11px] font-medium">
                            {author?.login || commit.author.name}
                        </Text>
                    </View>
                    <Text className="text-neutral-600 text-[10px]">
                        {formatRelativeTime(commit.author.date)}
                    </Text>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
};

const EmptyState = () => (
    <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="flex-1 items-center justify-center pt-32 px-10"
    >
        <View className="w-20 h-20 bg-neutral-900 rounded-3xl items-center justify-center border border-neutral-800 mb-6">
            <Ionicons name="git-commit-outline" size={40} color="#525252" />
        </View>
        <Text className="text-white text-lg font-bold mb-2">No Commits Found</Text>
        <Text className="text-neutral-500 text-center text-sm leading-5">
            We couldn't find any commit history for this repository. Try checking the branch or refreshing.
        </Text>
    </MotiView>
);

function ProjectCommitsScreen() {
    const { project } = useProject();
    const { data: commitData, isLoading, isError } = useGetProjectCommits(
        project?.repoOwner ?? "",
        project?.repoName ?? ""
    );

    if (!project || isLoading) {
        return (
            <CommitsSkeletonView />
        );
    }
    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}>
                {/* Header */}
                <MotiView
                    entering={FadeInDown.duration(600)}
                    className="flex-row items-center gap-4  pb-4"
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5"
                    >
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>

                    <View>
                        <Text className="text-white text-xl font-bold tracking-tight">
                            Commit History
                        </Text>
                        <Text className="text-neutral-500 text-xs font-mono">
                            {project?.repoOwner} / {project?.repoName}
                        </Text>
                    </View>
                </MotiView>

                <FlatList
                    data={commitData?.data || []}
                    keyExtractor={item => item.sha}
                    renderItem={({ item, index }) => (
                        <CommitCard
                            item={item}
                            index={index}
                            isLast={index === (commitData?.data?.length ?? 0) - 1}
                        />
                    )}
                    ListEmptyComponent={!isLoading && !isError ? <EmptyState /> : null}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>
    );
}

export default ProjectCommitsScreen;