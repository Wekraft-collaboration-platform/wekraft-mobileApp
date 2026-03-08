import { View, ScrollView } from 'react-native'
import React from 'react'
import {SkeletonBlock} from "@/components/block/SkeletonBlock";

const PRCardSkeleton = () => (
    <View className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 mb-3">
        {/* Header: #Number and Status Badge */}
        <View className="flex-row justify-between items-center mb-3">
            <SkeletonBlock height={10} width={40} radius={4} />
            <SkeletonBlock height={18} width={55} radius={6} />
        </View>

        {/* Title Lines */}
        <View className="gap-2 mb-4">
            <SkeletonBlock height={16} width={"85%"} radius={4} />
            <SkeletonBlock height={16} width={"40%"} radius={4} />
        </View>

        {/* User Meta Row */}
        <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
                <SkeletonBlock height={20} width={20} radius={100} />
                <SkeletonBlock height={12} width={70} radius={4} />
            </View>
            <SkeletonBlock height={10} width={50} radius={4} />
        </View>

        {/* Branch Info Badge Skeleton (Unique to PRs) */}
        <View className="self-start">
            <SkeletonBlock height={22} width={150} radius={8} />
        </View>
    </View>
)

const PrSkeltonView = () => {
    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}>
                {/* 1. Header Skeleton */}
                <View className="flex-row items-center gap-4 pb-6">
                    <SkeletonBlock height={42} width={42} radius={12} />
                    <View className="gap-2">
                        <SkeletonBlock height={22} width={130} radius={6} />
                        <SkeletonBlock height={10} width={90} radius={4} />
                    </View>
                </View>

                {/* 2. 4-Column Filter Bar Skeleton */}
                <View className="bg-neutral-900/60 border border-neutral-800/50 rounded-2xl p-2 mb-6">
                    <View className="flex-row gap-1">
                        <SkeletonBlock height={32} width={"24.2%"} radius={11} />
                        <SkeletonBlock height={32} width={"24.2%"} radius={11} />
                        <SkeletonBlock height={32} width={"24.2%"} radius={11} />
                        <SkeletonBlock height={32} width={"24.2%"} radius={11} />
                    </View>
                </View>

                {/* 3. Pull Request List Skeleton */}
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <PRCardSkeleton key={index} />
                    ))}
                </ScrollView>
            </View>

    )
}

export default PrSkeltonView