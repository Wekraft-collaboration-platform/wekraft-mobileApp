import { View, Text, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router, useRouter} from 'expo-router';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { colors } from '@/constraints/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from "react-native";
import {formatRelativeTime} from "@/components/Helper/helper";
import {repoFetchAllUserRepo} from "@/queries/repo/repoFetchAllUserRepo";
import { useQueryClient } from "@tanstack/react-query";


const repo = () => {

    const router = useRouter()

    const queryClient = useQueryClient();

    const {
        data : repos,
        isLoading : repoLoading,
        error : repoError } = repoFetchAllUserRepo();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedRepo, setSelectedRepo] = useState<any | null>(null);









    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400); // 300 to 500ms is correct for search

        return () => clearTimeout(timeout);
    }, [search]);


    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],

    });

    if (repoLoading) {
        return (

            <View style={{
                flex:1,
                marginHorizontal:16,
                justifyContent:"center",
                alignItems:"center"
            }}>

                    {/* Icon */}
                    <View className="relative w-24 h-24 justify-center items-center mb-6">

                        {/* Rotating border */}
                        <Animated.View
                            style={{
                                position: "absolute",
                                width: 96,
                                height: 96,
                                borderRadius: 48,
                                borderWidth: 3,
                                borderColor: "rgba(255,255,255,0.2)",
                                borderTopColor: "#ffffff",
                                transform: [{ rotate }],
                            }}
                        />

                        {/* GitHub logo */}
                        <View className="w-20 h-20 rounded-full bg-white justify-center items-center">
                            <Ionicons name="logo-github" size={42} color="#000" />
                        </View>

                    </View>

                    {/* Status text */}
                    <Text className="text-white text-4xl font-semibold text-center mb-2">
                        Sync in progress
                    </Text>

                    <Text className="text-gray-400 text-lg leading-relaxed text-center max-w-[280px] mb-10">
                        Please wait while we fetch your GitHub repositories.
                    </Text>

                </View>
        );
    }

    if (repoError) {
        return (

            <View style={{
                flex:1,
                marginHorizontal:16,
                justifyContent:"center",
                alignItems:"center"
            }}>
                    <Text className="text-red-400">{repoError.message}</Text>
                </View>
        );
    }


    const repoData = repos.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    const filteredRepos = repoData?.filter(repo =>
        repo.full_name.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
    );


    return (
            <View style={{
                flex:1,
                marginHorizontal:16
            }}

            >
                {/* Header */}
                <View style={{ height: 56, justifyContent: "center" , flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            left: 0,
                            backgroundColor: "#1A1A1A",
                            borderColor: "#2D2D2D",
                            borderWidth: 1,
                            padding: 7,
                            borderRadius: 10,
                        }}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={32} color="white" />
                    </TouchableOpacity>

                    <Text style={[styles.title, { textAlign: "center" }]}>
                        Import Project
                    </Text>
                </View>

                {/* Title */}
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>Select repository</Text>
                    <Text style={styles.subtitle}>
                        Choose a GitHub repository to connect.
                    </Text>
                </View>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search repositories..."
                        placeholderTextColor="#6B7280"
                        style={styles.searchInput}
                    />
                </View>

                {/* Repo list */}
                <FlatList
                    data={filteredRepos}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    renderItem={({ item }) => {
                        const isSelected = selectedRepo?.id === item.id;

                        return (
                            <TouchableOpacity
                                onPress={
                                    () =>{


                                        setSelectedRepo(item)


                                    }


                                }
                                style={[
                                    styles.repoCard,
                                    isSelected && styles.repoCardSelected,
                                ]}
                            >
                                <View style={styles.repoLeft}>
                                    <View style={styles.githubIcon}>
                                        <Ionicons name="logo-github" size={28} color="#000" />
                                    </View>

                                    <View>
                                        <Text style={styles.repoName}>{item.name}</Text>
                                        <Text style={styles.repoMeta}>
                                            {item.private ? "Private" : "Public"}
                                        </Text>

                                        <Text style={styles.repoMeta}>Created {formatRelativeTime(item.created_at)}</Text>
                                        <Text style={styles.repoMeta}>Last commit {formatRelativeTime(item.pushed_at)}</Text>
                                    </View>
                                </View>

                                {isSelected && (
                                    <View style={styles.check}>
                                        <Ionicons name="checkmark" size={16} color="black" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: "center", marginTop: 80 }}>
                            <View className='w-70 h-70 rounded-full bg-white justify-center items-center'>
                                <Ionicons name="logo-github" size={60} color="black" />
                            </View>
                            <Text style={[styles.repoName, { marginTop: 16 }]}>
                                No repositories found
                            </Text>
                        </View>
                    )}

                />

                {/* CTA */}
                <TouchableOpacity
                    style={styles.cta}
                    // onPress={() => router.push("/")}
                    onPress={() => {
                        queryClient.setQueryData(
                            ["selectedRepo"]
                            , selectedRepo)
                        router.push("/project/setUpNewProject")}
                    }
                    disabled={!selectedRepo}
                >
                    <Text style={styles.ctaText}>
                        Import Selected {selectedRepo ? "1" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

    );






}

export default repo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop:40
    },

    header: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },

    backBtn: {
        position: "absolute",
        left: 0,
        padding: 8,
    },

    headerTitle: {
            fontSize: 24,
            fontWeight: "700",
            color: "white",
    },

    titleBlock: {
        marginTop: 12,
        marginBottom: 24,
    },

    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "600",
    },

    subtitle: {
        color: "#8B8B8B",
        fontSize: 15,
        marginTop: 6,
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: "#222",
        marginBottom: 20,
    },

    searchInput: {
        flex: 1,
        color: "white",
        marginLeft: 10,
        fontSize: 15,
    },

    repoCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#222",
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.02)",
    },

    repoCardSelected: {
        borderColor: "white",
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    repoLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },

    githubIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },

    repoName: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },

    repoMeta: {
        color: "#8B8B8B",
        fontSize: 13,
        marginTop: 2,
    },

    check: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },

    cta: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: "center",
    },

    ctaText: {
        color: "black",
        fontSize: 16,
        fontWeight: "600",
    },
});
