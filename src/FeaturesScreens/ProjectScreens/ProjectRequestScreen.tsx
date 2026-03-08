import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import {useGetProjectRequests} from "@/queries/project/useGetProjectRequests";
import RequestSkeletonView from "@/components/SkeletonLayout/RequestSkeletonView";

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

    const statusConfig = {
        pending: { text: 'New Request', color: '#60a5fa', bg: '#172554', border: '#1e3a8a' },
        accepted: { text: 'Joined', color: '#4ade80', bg: '#052e16', border: '#14532d' },
        rejected: { text: 'Declined', color: '#f87171', bg: '#450a0a', border: '#7f1d1d' },
    };

    const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: index * 80 }}
        >
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-4 shadow-xl">

                {/* Top Row: Identity & Status */}
                <View className="flex-row justify-between items-start mb-5">
                    <View className="flex-row items-center gap-3">
                        <View className="relative">
                            <Image
                                source={{ uri: item.userImage || 'https://avatar.iran.liara.run/public/30' }}
                                className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700"
                            />
                            {/* Small Online/Active Indicator */}
                            <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-900 rounded-full items-center justify-center">
                                <View className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-900" />
                            </View>
                        </View>

                        <View>
                            <Text className="text-zinc-100 text-base font-semibold tracking-tight">
                                {item.userName || "Collaborator"}
                            </Text>
                            <Text className="text-zinc-500 text-xs">
                                {formatRelativeTime(item._creationTime)}
                            </Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: config.bg, borderColor: config.border }} className="px-2.5 py-1 rounded-full border">
                        <Text style={{ color: config.color }} className="text-[9px] font-black uppercase tracking-tighter">
                            {config.text}
                        </Text>
                    </View>
                </View>

                {/* Role Badge - Visual context for the owner */}
                <View className="bg-zinc-950/50 self-start px-3 py-1.5 rounded-lg border border-zinc-800/50 mb-4 flex-row items-center gap-2">
                    <View className="w-1 h-1 rounded-full bg-blue-500" />
                    <Text className="text-zinc-400 text-[11px] font-medium uppercase tracking-widest">
                        Applying for: <Text className="text-zinc-200">{item.role || "Developer"}</Text>
                    </Text>
                </View>

                {/* Message Section */}
                <View className="bg-zinc-800/30 rounded-2xl p-4 mb-5 border-l-2 border-zinc-700">
                    <Text className="text-zinc-300 text-[13px] leading-5 italic">
                        {item.message || "I'd like to contribute to this project as a developer."}
                    </Text>
                </View>

                {/* Actions */}
                {isPending ? (
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => onReject(item._id)}
                            className="flex-1 bg-zinc-800 h-12 rounded-2xl items-center justify-center border border-zinc-700 active:bg-zinc-700"
                        >
                            <Text className="text-zinc-300 font-bold text-sm">Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onAccept(item._id)}
                            className="flex-[2] bg-white h-12 rounded-2xl items-center justify-center shadow-lg shadow-white/5 active:opacity-90"
                        >
                            <View className="flex-row items-center gap-2">
                                <Text className="text-black font-bold text-sm">Accept Request</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        className="w-full py-3 items-center justify-center border border-dashed border-zinc-800 rounded-2xl"
                        disabled
                    >
                        <Text className="text-zinc-600 text-xs font-medium">No further actions required</Text>
                    </TouchableOpacity>
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

    const data= useGetProjectRequests(projectId);

    // Memoized filtering logic
    const filteredRequests = useMemo(() => {
        if (!data) return [];
        if (filter === 'pending') {
            return data.filter((req: any) => req.status === 'pending');
        } else {
            return data.filter((req: any) => req.status === 'accepted' || req.status === 'rejected');
        }
    }, [data, filter]);

    if (!data) return (
      <RequestSkeletonView/>
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