import { View, ScrollView } from 'react-native'
import React from 'react'
import {SkeletonBlock} from "@/components/block/SkeletonBlock";


const RequestCardSkeleton = () => (
    /* Match the bg-zinc-900 and rounded-3xl of the new card */
    <View className="bg-zinc-900/60 border border-zinc-800/50 rounded-3xl p-5 mb-4">

        {/* Top Row: Identity & Status */}
        <View className="flex-row justify-between items-start mb-5">
            <View className="flex-row items-center gap-3">
                {/* Profile Image - rounded-2xl (16px) to match redesign */}
                <SkeletonBlock height={48} width={48} radius={16} />

                <View className="gap-2">
                    {/* Name */}
                    <SkeletonBlock height={16} width={120} radius={4} />
                    {/* Timestamp */}
                    <SkeletonBlock height={10} width={60} radius={4} />
                </View>
            </View>

            {/* Status Badge Placeholder (Capsule shape) */}
            <SkeletonBlock height={20} width={70} radius={99} />
        </View>

        {/* Role Badge Placeholder - The new section we added */}
        <View className="mb-4">
            <SkeletonBlock height={24} width={160} radius={8} />
        </View>

        {/* Quoted Message Section - Matching the inner padding and border-l look */}
        <View className="bg-zinc-800/20 rounded-2xl p-4 mb-5 border-l-2 border-zinc-800">
            <View className="gap-2">
                <SkeletonBlock height={12} width="100%" radius={4} />
                <SkeletonBlock height={12} width="85%" radius={4} />
            </View>
        </View>

        {/* Action Buttons - Reflecting the flex-[2] weighted layout */}
        <View className="flex-row gap-3">
            {/* Decline Button (Smaller) */}
            <View className="flex-1">
                <SkeletonBlock height={48} width="100%" radius={16} />
            </View>
            {/* Accept Button (Larger - flex-2) */}
            <View className="flex-[2]">
                <SkeletonBlock height={48} width="100%" radius={16} />
            </View>
        </View>
    </View>
);


const RequestSkeletonView = () => {
    return (
            <View style={{
                flex:1,
                marginHorizontal:16,
            }}>
                {/* Header Section */}
                <View className="flex-row items-center gap-4 pb-6">
                    <SkeletonBlock height={42} width={42} radius={12} />
                    <View className="gap-2">
                        <SkeletonBlock height={22} width={130} radius={6} />
                        <SkeletonBlock height={10} width={90} radius={4} />
                    </View>
                </View>


                {/* Segmented Control Skeleton */}
                    <View className="bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-2 mb-6">
                        <View className="flex-row gap-1">
                            <SkeletonBlock height={32} width={"50%"} radius={11} />
                            <SkeletonBlock height={32} width={"50%"} radius={11} />
                        </View>
                    </View>



                {/* List Section */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {Array.from({ length: 5 }).map((_, index) => (
                        <RequestCardSkeleton key={index} />
                    ))}
                </ScrollView>
            </View>

    )
}

export default RequestSkeletonView