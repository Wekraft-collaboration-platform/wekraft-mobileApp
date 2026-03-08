import { View, ScrollView } from 'react-native'
import React from 'react'
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const IssueCardSkeleton = () => (
    <View className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 mb-3">
        {/* Top Row: #Number and State Badge */}
        <View className="flex-row justify-between items-center mb-3">
            <SkeletonBlock height={10} width={40} radius={4} />
            <View className="flex-row items-center gap-2">
                <SkeletonBlock height={18} width={50} radius={6} />
            </View>
        </View>

        {/* Title Lines */}
        <View className="gap-2 mb-4">
            <SkeletonBlock height={16} width={"90%"} radius={4} />
            <SkeletonBlock height={16} width={"40%"} radius={4} />
        </View>

        {/* Footer: User Avatar + Name + Date */}
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
                <SkeletonBlock height={20} width={20} radius={100} />
                <SkeletonBlock height={12} width={70} radius={4} />
            </View>
            <SkeletonBlock height={10} width={50} radius={4} />
        </View>
    </View>
)

const IssueSkeltonView = () => {
    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}>
                {/* 1. Header Skeleton */}
                <View className="flex-row items-center gap-4 pb-6">
                    <SkeletonBlock height={42} width={42} radius={12} />
                    <View className="gap-2">
                        <SkeletonBlock height={22} width={140} radius={6} />
                        <SkeletonBlock height={10} width={80} radius={4} />
                    </View>
                </View>

                {/* 2. Filter Card Skeleton */}
                <View className="bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-3 mb-6">
                    {/* Status Tabs */}
                    <View className="flex-row gap-1.5 mb-4">
                        <SkeletonBlock height={32} width={"32%"} radius={12} />
                        <SkeletonBlock height={32} width={"32%"} radius={12} />
                        <SkeletonBlock height={32} width={"32%"} radius={12} />
                    </View>
                    {/* Sort Pills */}
                    <View className="flex-row gap-2 items-center ml-1">
                        <SkeletonBlock height={12} width={12} radius={100} />
                        <SkeletonBlock height={22} width={60} radius={6} />
                        <SkeletonBlock height={22} width={60} radius={6} />
                        <SkeletonBlock height={22} width={60} radius={6} />
                    </View>
                </View>

                {/* 3. Issues List Skeleton */}
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <IssueCardSkeleton key={index} />
                    ))}
                </ScrollView>
            </View>
    )
}

export default IssueSkeltonView