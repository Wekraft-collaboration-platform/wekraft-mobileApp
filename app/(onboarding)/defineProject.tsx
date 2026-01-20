import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, FlatList, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { router, } from 'expo-router'
import { pickThumbnail } from '@/components/Helper/helper'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'

import { AVAILABLE_TAGS } from '@/constraints/StaticData'
import { useOnboarding } from '@/context/OnBoardingContext'





const DefineProject = () => {

    const MAX_TAGS = 5;

    const { data, setData } = useOnboarding()

    const allTags = Array.from(new Set([...AVAILABLE_TAGS]));
    const [search, setSearch] = useState("");


    const selectedTags = data.tags;

    const filteredAvailableTags = allTags
        .filter(tag => !selectedTags.includes(tag))
        .filter(tag =>
            tag.toLowerCase().includes(search.toLowerCase())
        );




    const toggleTag = (tag: string) => {
        setData(prev => {
            // remove tag
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) }
            }

            // limit reached
            if (prev.tags.length >= MAX_TAGS) {
                Toast.show({
                    type: "error",
                    position: 'bottom',
                    visibilityTime: 2000,
                    text1: 'Tag limit reached',
                    text2: `You can select up to ${MAX_TAGS} tags only`,
                })
                return prev
            }

            // add tag
            return { ...prev, tags: [...prev.tags, tag] }
        })
    }


    return (
        <View style={{ flex: 1 }} >
            {/* <Text style={[styles.headerText]}>Define Project</Text> */}
            <ScrollView
                bounces={false}
                nestedScrollEnabled
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View>
                    {/* Headers */}
                    <View className={"flex-row justify-center items-center"}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className='absolute left-0 top-0'
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={30} color="white" />

                        </TouchableOpacity>
                        <Text style={styles.headerText}>Define Project</Text>


                    </View>

                    {/* Thumbnail Editng */}
                    <TouchableOpacity
                        onPress={async () => {
                            const uri = await pickThumbnail()
                            if (!uri) return
                            setData(prev => ({ ...prev, thumbnailUrl: uri }))
                        }
                        }
                        style={styles.thumbnail}>
                        {data.thumbnailUrl ? (
                            <View
                                style={styles.thumbnailImage}
                            >
                                <Image
                                    source={{ uri: data.thumbnailUrl }}
                                    style={styles.thumbnailImage}
                                />
                                <View className='absolute justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/50'>
                                    <Ionicons name="image-outline" size={32} color="white" />
                                    <Text style={styles.thumbnailText}>
                                        Add project thumbnail
                                    </Text>


                                </View>

                            </View>
                        ) : (
                            <View style={[styles.thumbnailPlaceholder, { width: "100%", height: "100%", justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={styles.thumbnailPlaceholderText}>
                                    {data?.selctedrepo?.name?.trim()?.charAt(0).toUpperCase()}
                                </Text>
                                <View className='absolute justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/50'>
                                    <Ionicons name="image-outline" size={32} color="white" />
                                    <Text style={styles.thumbnailText}>
                                        Add project thumbnail
                                    </Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>


                    {/* Project Name */}
                    <View >
                        <Text style={[styles.label, { marginBottom: 8 }]}>PROJECT NAME</Text>
                        <TextInput
                            multiline
                            value={data.projectName}
                            placeholder="Enter project name"
                            placeholderTextColor="#888"
                            style={styles.input}
                            onChangeText={(text) =>
                                setData(prev => ({ ...prev, projectName: text }))
                            }
                        />
                    </View>


                    {/* Project description */}
                    <View >
                        <Text style={[styles.label, { marginBottom: 8, marginTop: 16 }]}>PROJECT DESCRIPTION</Text>
                        <TextInput
                            multiline
                            value={data.projectdescription}
                            placeholder="Enter project description"
                            placeholderTextColor="#888"
                            style={styles.input}
                            onChangeText={(text) =>
                                setData(prev => ({ ...prev, projectdescription: text }))
                            }
                        />
                    </View>



                    {/* Visbility Switch */}

                    <View className='mt-4'>
                        <Text style={styles.label}>VISIBILITY</Text>
                        <View style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, data.isPublic ? { backgroundColor: "#1A362B" } : {}]}>

                            <View className='flex-1'>

                                <Text style={{ fontSize: 15, color: "white" }}>Public Visibility</Text>
                                <Text style={{ fontSize: 12, color: "gray" }}>Make your project visible to everyone. Public projects can be discovered by the community.</Text>
                            </View>



                            <Switch
                                trackColor={{ false: "#444", true: "#22c55e" }}
                                thumbColor="#ffffff"


                                value={data.isPublic}
                                onValueChange={(value) => setData(prev => ({ ...prev, isPublic: value }))}
                            />
                        </View>
                    </View>





                    {/* Tags Sleection */}

                    <View >





                        {selectedTags.length > 0 && (
                            <View style={{ marginBottom: 0, marginTop: 16 }}>
                                <Text style={[styles.label, { marginBottom: 8 }]}>TAGS</Text>

                                <View style={styles.tagsWrap}>
                                    {selectedTags.map(tag => (
                                        <TouchableOpacity
                                            key={tag}
                                            onPress={() => toggleTag(tag)}
                                            style={[styles.tagChip, styles.tagChipSelected]}
                                        >
                                            <Text style={styles.tagTextSelected}>{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}


                        <TextInput
                            placeholder="Search tags"

                            placeholderTextColor="#777"
                            value={search}
                            onChangeText={setSearch}
                            style={[
                                styles.input,
                                { marginBottom: 12, marginTop: 16 }
                            ]}
                        />

                    </View>
                    <Text style={styles.label}>AVAILABLE TAGS</Text>

                    <View style={styles.tagsContainer}>
                        <ScrollView
                            nestedScrollEnabled
                            style={{ height: 220 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.tagsWrap}>
                                {filteredAvailableTags.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        onPress={() => toggleTag(tag)}
                                        style={styles.tagChip}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>







                </View>
            </ScrollView>
            {/* Footer Section */}
            <TouchableOpacity
                onPress={() => {
                    if (data.tags.length < 2) {
                        return Toast.show({
                            type: "error",
                            text1: "Invalid",
                            text2: "At least 2 Tags needed in project",
                            position: "bottom",
                            visibilityTime: 2000,
                        })
                    }

                    console.log("Identity Setup Complete Next Page routing")
                    router.push("/(onboarding)/invite")

                }}
                activeOpacity={0.7}
                style={styles.cta}
            >


                <View className='flex-row w-full items-center justify-center gap-2'>

                    <Text style={[styles.ctaText]}>Continue</Text>
                    <Ionicons name='arrow-forward' size={24} color='black' />
                </View>
            </TouchableOpacity>


        </View>

    )
}

export default DefineProject






const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    scrollContent: {
        // padding: 20,
        paddingBottom: 10,
    },

    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    headerText: {
        fontSize: 24,
        color: "#A8ACB0",
        textAlign: "center"
    },

    card: {
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.03)",

    },

    backButton: {
        position: "absolute",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
    },
    tagsContainer: {
        height: 220,
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
    },


    header: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
    },

    subtitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "rgba(255,255,255,0.85)",
        marginTop: 4,
    },


    thumbnail: {
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "#222",
        marginTop: 16,
        marginBottom: 24,

        justifyContent: "center",
        alignItems: "center",
    },

    thumbnailOverlay: {
        alignItems: "center",
        gap: 8,
    },

    thumbnailText: {
        color: "#ccc",
        fontSize: 18,
    },

    titleBlock: {
        marginTop: 16,
    },



    label: {
        color: "#6B6B6B",
        fontSize: 12,
        letterSpacing: 1,
        marginBottom: 8,
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        borderWidth: 1,
        // flex:1,
        // width:"100%",
        borderColor: "#222",
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "white",
    },

    tagRow: {
        flexDirection: "row",
        width: "100%",
        gap: 10,
    },

    addBtn: {
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: "white",
        justifyContent: "center",
    },

    addBtnText: {
        color: "black",
        fontWeight: "600",
    },

    tagsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    tagChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#333",
    },

    tagChipSelected: {
        backgroundColor: "white",
        borderColor: "white",
    },

    tagText: {
        color: "white",
        fontSize: 13,
    },

    tagTextSelected: {
        color: "black",
        fontWeight: "500",
    },

    cta: {
        backgroundColor: "white",
        marginBottom: 16,
        borderRadius: 20,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    ctaText: {
        color: "black",
        fontSize: 16,
        fontWeight: "600",
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    thumbnailPlaceholder: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.02)",
        justifyContent: "center",
        alignItems: "center",
    },

    thumbnailPlaceholderText: {
        color: "white",
        fontSize: 42,
        fontWeight: "700",
        opacity: 0.85,
    },
});
