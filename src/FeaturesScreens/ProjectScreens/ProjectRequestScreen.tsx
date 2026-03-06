import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import {useGetProjectRequests} from "@/queries/project/useGetProjectRequests";

// Helper for relative time (assuming standard date string)
const formatRelativeTime = (date: number | string) => {
    const now = new Date().getTime();
    const created = new Date(date).getTime();
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
};

const RequestCard = ({ item, index, onAccept, onReject }: any) => {
    const isPending = item.status === 'pending';

    // UI mapping for status badges
    const statusConfig = {
        pending: { text: 'New', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        accepted: { text: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        rejected: { text: 'Declined', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    };

    const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: index * 100 }}
            className="flex-row"
        >
            <View className="flex-1 bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                        <Image
                            source={{ uri: item.userImage || 'https://avatar.iran.liara.run/public/30' }}
                            className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700"
                        />
                        <View>
                            <Text className="text-white text-[15px] font-bold tracking-tight">
                                {item.userName || "Collaborator"}
                            </Text>
                            <Text className="text-neutral-500 text-[11px]">
                                Requested {formatRelativeTime(item._creationTime)}
                            </Text>
                        </View>
                    </View>
                    <View className={`${config.bg} ${config.border} px-2 py-1 rounded-md border`}>
                        <Text className={`${config.color} text-[10px] font-bold uppercase tracking-widest`}>
                            {config.text}
                        </Text>
                    </View>
                </View>

                <Text className="text-neutral-400 text-sm leading-5 mb-4">
                    {item.message || "I'd like to contribute to this project as a developer."}
                </Text>

                {/* Conditional Rendering: Show actions only if status is pending */}
                {isPending && (
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => onAccept(item._id)}
                            className="flex-1 bg-white h-10 rounded-xl items-center justify-center active:opacity-80"
                        >
                            <Text className="text-black font-bold text-sm">Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onReject(item._id)}
                            className="flex-1 bg-neutral-800 border border-neutral-700 h-10 rounded-xl items-center justify-center active:opacity-70"
                        >
                            <Text className="text-neutral-300 font-bold text-sm">Decline</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </MotiView>
    );
};

const EmptyState = ({ type }: { type: string }) => (
    <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 items-center justify-center pt-32 px-10"
    >
        <View className="w-20 h-20 bg-neutral-900 rounded-3xl items-center justify-center border border-neutral-800 mb-6">
            <Ionicons name={type === 'pending' ? "mail-outline" : "archive-outline"} size={40} color="#525252" />
        </View>
        <Text className="text-white text-lg font-bold mb-2">
            {type === 'pending' ? "Inbox is clear" : "No history yet"}
        </Text>
        <Text className="text-neutral-500 text-center text-sm leading-5">
            {type === 'pending'
                ? "When people ask to join your project, their applications will appear here."
                : "Your past accepted or declined requests will be archived here."}
        </Text>
    </MotiView>
);

const ProjectRequestScreen = () => {
    const [filter, setFilter] = useState<'pending' | 'history'>('pending');
    const { projectId } = useProject();

    const { data, isLoading } = useGetProjectRequests(projectId);

    // Memoized filtering logic
    const filteredRequests = useMemo(() => {
        if (!data) return [];
        if (filter === 'pending') {
            return data.filter((req: any) => req.status === 'pending');
        } else {
            return data.filter((req: any) => req.status === 'accepted' || req.status === 'rejected');
        }
    }, [data, filter]);

    if (isLoading) return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-white">Loading....</Text>
        </View>
    )

    return (
            <View className="flex-1 px-4">
                {/* Header Section */}
                <MotiView entering={FadeInDown.duration(600)} className="mb-6 mt-4">
                    <View className="flex-row items-center gap-4 mb-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5"
                        >
                            <Ionicons name="chevron-back" size={20} color="white" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold tracking-tight">Project Requests</Text>
                            <Text className="text-neutral-500 text-xs">Manage your team invitations</Text>
                        </View>
                    </View>

                    {/* Segmented Control */}
                    <View className="flex-row bg-neutral-900/80 p-1 rounded-2xl border border-neutral-800">
                        {(['pending', 'history'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setFilter(tab)}
                                className={`flex-1 py-2.5 rounded-xl items-center ${
                                    filter === tab ? 'bg-neutral-800 border border-neutral-700' : ''
                                }`}
                            >
                                <Text className={`text-sm font-semibold capitalize ${
                                    filter === tab ? 'text-white' : 'text-neutral-500'
                                }`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </MotiView>

                {/* List Section */}
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    data={filteredRequests}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <RequestCard
                            item={item}
                            index={index}
                            onAccept={(id: string) => {

                            }}
                            onReject={(id: string) => {

                            }}
                        />
                    )}
                    ListEmptyComponent={<EmptyState type={filter} />}
                    showsVerticalScrollIndicator={false}

                />
            </View>
    );
};

export default ProjectRequestScreen;