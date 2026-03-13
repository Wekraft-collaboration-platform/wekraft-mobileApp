import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, FlatList, ActivityIndicator,Platform,KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAction, useMutation, useQueries, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from "@/convex/_generated/dataModel"
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { TeamMember, MemberType } from '@/constraints/interface'
import {AddProjectRoleDialog} from "@/components/Dialogs/addProjectRoleDialog";
import { TeamsIcon } from '@/components/Icons'
import * as FileSystem from "expo-file-system/legacy";

import {getContentType, uriToArrayBuffer, pickThumbnail} from "@/components/Helper/helper";

import { AVAILABLE_TAGS } from '@/constraints/StaticData'





const EditProjectScreen = ({projectId}:any) => {

    const MAX_TAGS = 5;
    const [openModal, setOpenModal] = useState(false)
    // const { projectId } = useLocalSearchParams()
    const ProjectData = useQuery(api.projects.getProjectById, {
            projectId: projectId as Id<'projects'>
        }
    )
    const updateProject = useMutation(api.projects.updateProject)

    const [thumbnail, setThumbnail] = useState<string | undefined>(ProjectData?.thumbnailUrl)
    const [description, setDescription] = useState<string | undefined>(ProjectData?.description)
    const [isPublic, setIsPublic] = useState<boolean | undefined>(ProjectData?.isPublic)
    const [tags, setTags] = useState<string[]>(ProjectData?.tags || []);
    const allTags = Array.from(new Set([...AVAILABLE_TAGS]));
    const [teamMembers, setTeamMembers] = useState<TeamMember[] | []>(ProjectData?.lookingForMembers || []);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false)
    const SaveThumbnail = useAction(api.thumbnail.uploadThumbnail)
    const deleteImage = useAction(api.thumbnail.deleteThumbnail)

    useEffect(() => {
        if (!ProjectData) return

        setThumbnail(ProjectData.thumbnailUrl)
        setTeamMembers(ProjectData.lookingForMembers || [])
        setDescription(ProjectData.description ?? "")
        setIsPublic(ProjectData.isPublic)
        setTags(ProjectData.tags ?? [])
    }, [ProjectData])

    const selectedTags = tags;

    const filteredAvailableTags = allTags
        .filter(tag => !selectedTags.includes(tag))
        .filter(tag =>
            tag.toLowerCase().includes(search.toLowerCase())
        );




    const toggleTag = (tag: string) => {
        setTags(prev => {
            // remove tag
            if (prev.includes(tag)) {
                if (prev.length === 2) {
                    Toast.show({
                        type: "error",
                        position: 'bottom',
                        visibilityTime: 2000,
                        text1: 'Validation_error',
                        text2: `Minimum 2 tags are required`,
                    })
                    return prev
                }
                return prev.filter(t => t !== tag)
            }

            // limit reached
            if (prev.length >= MAX_TAGS) {
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
            return [...prev, tag]
        })
    }

    const TYPE_MAP: Record<string, MemberType> = {
        "Casual": "casual",
        "Part-Time": "part-time",
        "Serious": "serious",
    };

    const handleAddRole = (role: string, type: string) => {
        const normalizedType = TYPE_MAP[type];

        if (!normalizedType) {
            throw new Error(`Invalid member type: ${type}`);
        }

        setTeamMembers(prev => [...prev, { role, type: normalizedType }])
    }

    const removeMember = (index: number) => {
        setTeamMembers(prev => prev.filter((_, i) => i !== index))
    }

    if (!ProjectData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginHorizontal:16 }} >

            {/*Header*/}
            <View style={{ height: 56,marginBottom:10, justifyContent: "center" , flexDirection:"row", alignItems:"center"}}>
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
                    Edit Project
                </Text>
            </View>


            <ScrollView
                bounces={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View>

                    {/*ThumbNail*/}
                    <View>
                        <Text style={styles.label}>VISUAL IDENTITY</Text>

                        <TouchableOpacity
                            onPress={async () => {
                                const uri = await pickThumbnail()
                                if (!uri) return
                                setThumbnail(uri)
                            }
                            }
                            activeOpacity={0.6}
                            style={[styles.thumbnail,{aspectRatio: 0, height:170}]}

                        >
                            {thumbnail? (
                                <View style={styles.thumbnailImage}>

                                    <Image source={{ uri: thumbnail }} style={styles.thumbnailImage}/>

                                    <View className={"absolute left-0 right-0 top-0 bottom-0 justify-center"}>
                                        <View style={{backgroundColor:"rgba(136,136,136,0.4)", paddingVertical:7,paddingHorizontal:16, borderRadius:999 ,flexDirection:"row", gap:4, justifyContent:"center", alignItems:"center",alignSelf:"center"}}>
                                            <Ionicons name={"camera"} size={32} color="white" />
                                            <Text className={"text-white text-lg font-bold"}>Change Cover</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.thumbnailImage}>

                                    <View style={{
                                        backgroundColor:"#090909",
                                        flex:1,
                                        justifyContent:"center",
                                        alignItems:"center"
                                    }}>

                                        <Text style={{
                                            color:"white",
                                            fontSize:54,
                                            fontWeight:"bold"
                                        }}>{ProjectData.projectName.trim().charAt(0).toUpperCase()}</Text>
                                    </View>

                                    <View className={"absolute left-0 right-0 top-0 bottom-0 justify-center"}>
                                        <View style={{backgroundColor:"rgba(136,136,136,0.4)", paddingVertical:7,paddingHorizontal:16, borderRadius:999 ,flexDirection:"row", gap:4, justifyContent:"center", alignItems:"center",alignSelf:"center"}}>
                                            <Ionicons name={"camera"} size={32} color="white" />
                                            <Text className={"text-white text-lg font-bold"}>Change Cover</Text>
                                        </View>
                                    </View>
                                </View>

                            )}




                        </TouchableOpacity>

                    </View>


                    {/* Project description */}
                    <View >
                        <Text style={[styles.label, { marginBottom: 8 }]}>PROJECT DESCRIPTION</Text>
                        <TextInput
                            multiline
                            value={description}
                            placeholder="What is this Project About?"
                            placeholderTextColor="#888"
                            style={[styles.input,{minHeight:100,textAlign:"justify",textAlignVertical:"top"}]}
                            onChangeText={(text) =>
                                setDescription(text)
                            }
                        />
                    </View>

                    {/* Visbility Switch */}
                    <View className='mt-4'>
                        <View style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, isPublic ? { backgroundColor: "#1A362B" } : {}]}>

                            <View className='flex-1'>

                                <Text style={{ fontSize: 15, color: "white", fontWeight:"bold" }}>Public Visibility</Text>
                                <Text style={{ fontSize: 12, color: "gray" }}>Make your project visible to everyone. Public projects can be discovered by the community.</Text>
                            </View>



                            <Switch
                                trackColor={{ false: "#444", true: "#22c55e" }}
                                thumbColor="#ffffff"


                                value={isPublic}
                                onValueChange={setIsPublic}
                            />
                        </View>
                    </View>

                    {/* Tags Sleection */}

                    <View >
                        {selectedTags.length > 0 && (
                            <View style={{ marginBottom: 0, marginTop: 32 }}>
                                <Text style={[styles.label, { marginBottom: 12,fontWeight:"bold" }]}>TAGS ({selectedTags.length}/5)</Text>
                                {/* <Text style={styles.label}>SELECTED TAGS</Text> */}

                                <View style={styles.tagsWrap}>
                                    {selectedTags.map(tag => (
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            onPress={() => toggleTag(tag)}
                                            key={tag}
                                            style={[styles.tagChip, styles.tagChipSelected]}
                                        >
                                            <View
                                                style={{flexDirection:"row",gap:4,alignItems:"center", }}
                                            >
                                                <Text style={styles.tagTextSelected}>{tag}</Text>

                                                <Ionicons name={"close-circle"} size={16} color="black" />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}


                        <View style={[{
                            flexDirection:"row",
                            alignItems:"center",
                            width:"100%",
                            gap:6,
                            marginVertical: 16
                        },
                            styles.input]}>

                            <Ionicons name={"search"} size={24} color={"#606060"}/>


                            <TextInput
                                placeholder="Search tags"
                                placeholderTextColor="#777"
                                value={search}
                                onChangeText={setSearch}
                                style={{
                                    color:"white",
                                    flex:1,
                                }
                                }
                            />

                        </View>

                    </View>

                    <ScrollView
                        nestedScrollEnabled
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.tagsWrap}>
                            {filteredAvailableTags.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => toggleTag(tag)}
                                    style={styles.tagChip}
                                >
                                    <View style={{flexDirection:"row", gap:4, alignItems:"center"}}>

                                        <Ionicons name={"add-outline"} size={14} color="white" />


                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>


                    {/* Looking for members */}

                    <View className='mt-6'>
                        <View className='flex-row justify-between items-center mb-5'>
                            <Text style={[styles.label,{fontWeight:"bold"}]}>LOOKING FOR MEMBERS</Text>

                            <TouchableOpacity
                                disabled={!isPublic}
                                onPress={() => {
                                    if (openModal) return
                                    setOpenModal(true)

                                }}
                                style={[styles.addBtn, !isPublic ? { backgroundColor: "#222" } : {}]}
                            >
                                <View className={"flex-row items-center  gap-2"}>
                                    <Ionicons name={"add"} color={"black"} size={16}/>


                                    <Text style={styles.addBtnText}>Add Roles</Text>
                                </View>

                            </TouchableOpacity>

                        </View>
                        <View style={styles.card}>
                            {teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                    <View key={index} className="flex-row justify-between items-center mb-4">

                                        <View className='flex-row gap-3 items-center'>

                                            <View style={{
                                                backgroundColor: "#212222", borderRadius: 999,
                                                borderWidth: 1, borderColor: "#3A3A3A",
                                                justifyContent: "center", alignItems: "center", width: 48, height: 48
                                            }}>

                                                <TeamsIcon size={24} color="white" />
                                            </View>
                                            <View style={{}}>
                                                <Text style={{ color: "white", fontSize: 14 }}>
                                                    {member.role}
                                                </Text>
                                                <Text style={{ color: "#888", fontSize: 12 }}>
                                                    {member.type}
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity onPress={() => removeMember(index)}>
                                            <Ionicons name='trash-outline' size={24} color="#851a1aff" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.label, { textAlign: 'center' }]}>Not Listed any Role yet</Text>
                            )}




                        </View>

                    </View>

                    {/* Save Buttons */}
                    <View>

                        <TouchableOpacity
                            style={styles.cta}
                            onPress={async () => {

                                try {
                                    setLoading(true)
                                    if (thumbnail !== ProjectData.thumbnailUrl && thumbnail !== undefined) {
                                        console.log("Thumbnail is changed")
                                        console.log("thumNail Delete sartrted at , :", Date.now())
                                        if (ProjectData.thumbnailUrl) {
                                            const key = ProjectData.thumbnailUrl.split("com/")[1]
                                            console.log(key)
                                            await deleteImage({ key })
                                        }
                                        console.log("thumNail Delete finished at , :", Date.now())
                                        let thumbnailUrl: string | undefined

                                        const buffer = await uriToArrayBuffer(thumbnail);

                                        const fileName =
                                            thumbnail.split("/").pop() ?? "thumbnail.png";

                                        console.log("Thumbnail is uploaded at : ", Date.now())

                                        const result = await SaveThumbnail({
                                            fileName,
                                            contentType: getContentType(thumbnail),
                                            fileData: buffer,
                                        });
                                        console.log("The images is uploaded finsihd at: ", result.url, " At : ", Date.now())

                                        thumbnailUrl = result.url


                                        console.log("Project  is uploading at : ", Date.now())

                                        await updateProject({
                                            projectId: ProjectData._id,
                                            description,
                                            tags,
                                            isPublic,
                                            lookingForMembers: teamMembers,
                                            thumbnailUrl: thumbnailUrl
                                        })
                                        console.log("Project  is uploaded finsihd at : ", Date.now())
                                    } else {
                                        console.log("No image")
                                        console.log("Project  is uploading at : ", Date.now())
                                        await updateProject({
                                            projectId: ProjectData._id,
                                            description,
                                            tags,
                                            isPublic,
                                            lookingForMembers: teamMembers,

                                        })
                                        console.log("Project  is uploaded finsihd at : ", Date.now())
                                    }


                                    Toast.show({
                                        type: "success",
                                        position: 'bottom',
                                        visibilityTime: 2000,
                                        text1: 'Success',
                                        text2: `Project updated successfully`,
                                    })
                                    router.back()
                                } catch (err) {
                                    console.log(err)
                                    setLoading(false)
                                } finally {
                                    setLoading(false)
                                }
                            }}
                        >
                            <Text style={styles.ctaText}>Update Project</Text>
                            {/* <Ionicons name="arrow-forward" size={18} color="black" /> */}
                        </TouchableOpacity>

                    </View>




                </View>
            </ScrollView>





            <AddProjectRoleDialog
                visible={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(data) => {
                    handleAddRole(data.role, data.type)
                }} />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}


        </View>
    )
}

export default EditProjectScreen




const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    scrollContent: {
        // padding: 20,
        paddingBottom: 40,
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

    card: {
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "#111111",

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
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "#222",
        marginTop: 12,
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
        // marginBottom: 8,
    },

    input: {
        backgroundColor: "#111111",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#222",
        paddingHorizontal: 16,
        paddingVertical: 7,
        color: "white",
    },

    tagRow: {
        flexDirection: "row",
        width: "100%",
        gap: 10,
    },

    addBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#29292A",
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
        marginTop: 16,
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
        backgroundColor: "#2b2b30",
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
