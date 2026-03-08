import { View, ScrollView } from 'react-native'
import React from 'react'
import {SkeletonBlock} from "@/components/block/SkeletonBlock";


const CommitSkeletonItem = ({ isLast }: { isLast: boolean }) => {
    return (
        <View className="flex-row">
            {/* Timeline Column */}
            <View className="items-center mr-4">
                {/* The Dot */}
                <View className="mt-5">
                    <SkeletonBlock height={12} width={12} radius={100} />
                </View>

                {/* The Vertical Line */}
                {!isLast && (
                    <View className="flex-1 items-center">
                        <View className="w-[1px] flex-1 bg-neutral-800/40 my-1" />
                    </View>
                )}
            </View>

            {/* Card Content */}
            <View className="flex-1 bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-4 mb-4">
                {/* Top Row: Title & SHA Badge */}
                <View className="flex-row justify-between items-start mb-3">
                    <SkeletonBlock height={18} width={"70%"} radius={4} />
                    <SkeletonBlock height={18} width={45} radius={6} />
                </View>

                {/* Description Line */}
                <View className="mb-4">
                    <SkeletonBlock height={12} width={"90%"} radius={4} />
                </View>

                {/* Bottom Row: Avatar + Name + Date */}
                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-neutral-800/40">
                    <View className="flex-row items-center gap-2">
                        <SkeletonBlock height={20} width={20} radius={100} />
                        <SkeletonBlock height={12} width={80} radius={4} />
                    </View>
                    <SkeletonBlock height={10} width={50} radius={4} />
                </View>
            </View>
        </View>
    );
};

const CommitsSkeletonView = () => {
    return (

        <View style={{
            flex:1,
            marginHorizontal:16
        }}>
            <View className="flex-row items-center gap-4 pb-6">
                <SkeletonBlock height={42} width={42} radius={12} />
                <View className="gap-2">
                    <SkeletonBlock height={22} width={140} radius={6} />
                    <SkeletonBlock height={12} width={90} radius={4} />
                </View>
            </View>

            <ScrollView
                bounces={false}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 100
                }}
            >

                {/* List of Commit Skeletons */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <CommitSkeletonItem
                        key={index}
                        isLast={index === 7}
                    />
                ))}
            </ScrollView>
        </View>

    )
}

export default CommitsSkeletonView