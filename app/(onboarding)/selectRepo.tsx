import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FetchRepoByPage } from "@/queries/repo/repositoriesFetchingPerPage"
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useOnboarding } from '@/context/OnBoardingContext'
import { formatRelativeTime } from '@/components/Helper/helper'
import FetchingRepoSkeleton from "@/components/SkeletonLayout/FetchingRepoSkeleton";
import Toast from 'react-native-toast-message'

const selectRepo = () => {
    const [page, setPage] = useState(1)
    const lastValidPage = React.useRef(1)

    const [searchQuery, setSearchQuery] = useState('');
    const { data, setData } = useOnboarding()
    const [lastPage, setLastPage] = useState<number>(-1)
    const listRef = React.useRef<FlatList<any>>(null)

    const {
        data: Repos,
        isLoading,
        isError,
    } = FetchRepoByPage(page)


    useEffect(() => {
        setData((prev) => ({
            ...prev,
            selctedrepo: null
        }))
        if (!Repos) return


        // Normal page with data
        if (Repos.length > 0) {
            lastValidPage.current = page
            listRef.current?.scrollToOffset({ offset: 0, animated: true })
            return
        }

        // API returned empty array → true last page
        if (page !== lastValidPage.current) {
            Toast.show({
                type: "info",
                text1: "End of results",
                text2: "You have reached the last available page",
                position: "bottom",

            })
            // setIsLastPage(true)
            setLastPage(page)
            setPage(lastValidPage.current)
        }
    }, [Repos, page])


    //   Loding View
    return (

        <View style={styles.container}>
            {/* Headers */}
            <View className={"flex-row justify-center items-center"}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className='absolute left-0 top-0'
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={30} color="white" />

                </TouchableOpacity>
                <Text style={styles.headerText}>Import Project</Text>


            </View>


            {/* Title */}
            <View >
                <Text style={styles.headerText2}>Select repository</Text>
                <Text style={[styles.headerText, { fontSize: 16, marginTop: 5, textAlign: "left" }]}>
                    Choose a GitHub repository to connect.
                </Text>
            </View>

            {/* Search */}
            <View style={[styles.input, { flexDirection: "row", gap: 10, alignItems: "center", marginVertical: 20 }]}>

                <Ionicons name="search" size={24} color="white" />



                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search repositories..."
                    placeholderTextColor="#666"

                    style={{ color: "white", flex: 1 }}
                />
            </View>


            {/* Pagination */}
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    disabled={isLoading}
                    style={[
                        styles.pageButton,
                        (page === 1 || isLoading) && styles.pageButtonDisabled,
                    ]}
                    onPress={() => {
                        if (page === 1) {
                            return (
                                Toast.show({
                                    type: "info",
                                    text1: "Already on the first page",
                                    text2: "You cannot go back any further",
                                    position: "bottom",
                                })

                            )
                        }

                        setPage((prev) => prev - 1)

                    }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={22}
                        color={page === 1 ? "#666" : "white"}
                    />
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <Text style={styles.pageText}>{page}</Text>
                </View>

                <TouchableOpacity
                    disabled={isLoading}
                    style={[
                        styles.pageButton,
                        (page + 1 === lastPage || isLoading) && styles.pageButtonDisabled,
                    ]}
                    onPress={() => {
                        if (page + 1 === lastPage) {
                            return (
                                Toast.show({
                                    type: "info",
                                    text1: "End of results",
                                    text2: "You have reached the last available page",
                                    position: "bottom",
                                })

                            )
                        }

                        setPage((prev) => prev + 1)

                    }}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color={page + 1 === lastPage ? "#666" : "white"}
                    />
                </TouchableOpacity>
            </View>



            {isError ? (
                <>
                    <Text className='text-white'>Error</Text>
                </>
            ) : isLoading ? (
                <>
                    <FetchingRepoSkeleton />
                </>
            ) : <>

                <FlatList
                    data={Repos}
                    ref={listRef}
                    contentContainerStyle={{
                        paddingBottom: 100
                    }}

                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    overScrollMode="never"
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const isSelected = data.selctedrepo?.id === item.id

                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        selctedrepo: item
                                    }))
                                }}
                                style={[styles.repoCard, isSelected && styles.repoCardSelected]}
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

                        )
                    }}


                />
            </>

            }


            {/* CTA */}
            <TouchableOpacity
                style={styles.cta}
                disabled={!data.selctedrepo?.id}
                onPress={() => router.push("/(onboarding)/defineProject")}
            >
                <Text style={styles.ctaText}>
                    Import Selected {data.selctedrepo?.id ? "1" : ""}
                </Text>
            </TouchableOpacity>






        </View>


    )
}

export default selectRepo


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerText: {
        fontSize: 24,
        color: "#A8ACB0",
        textAlign: "center"
    },
    headerText2: {
        fontSize: 32,
        color: "white",
        fontWeight: "500",
        marginTop: 20
    },


    input: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderColor: "#222",
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

    paginationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginVertical: 16,
    },

    pageButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#222",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.04)",
    },

    pageButtonDisabled: {
        opacity: 0.4,
    },

    pageIndicator: {
        minWidth: 48,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    pageText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },



})
