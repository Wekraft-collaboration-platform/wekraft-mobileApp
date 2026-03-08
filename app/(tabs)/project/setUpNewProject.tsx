import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import { useOnboarding } from "../../context/OnboardingContext";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constraints/Colors";
import {pickThumbnail, getContentType, uriToArrayBuffer} from "@/components/Helper/helper";
import { Switch } from "react-native";
import { AVAILABLE_TAGS } from "@/constraints/StaticData";
import {SelectedRepo} from "@/queries/repo/repoFetchAllUserRepo";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Destination$ } from "@aws-sdk/client-s3";
import * as FileSystem from "expo-file-system/legacy";
import Toast from "react-native-toast-message";
import {TeamsIcon} from "@/components/Icons";
import {MemberType, TeamMember} from "@/constraints/interface";
import {AddProjectRoleDialog} from "@/components/Dialogs/addProjectRoleDialog";


const setUpNewProject = () => {
    const [customTag, setCustomTag] = React.useState("");
    const MAX_TAGS = 5
    const [openModal, setOpenModal] = useState(false)


    const Selectedrepo = SelectedRepo()

    const [teamMembers, setTeamMembers] = useState<TeamMember[] | []>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [thumbnail, setThubnail] = useState<string | undefined>(undefined)
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("")
    const [projectName, setProjectName] = useState<string>(Selectedrepo.name)
    const [description, setDescription] = useState<string>("")
    const [search, setSearch] = useState("");
    const allTags = Array.from(new Set([...AVAILABLE_TAGS]));
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(false)

    const uploadThubnail = useAction(api.thumbnail.uploadThumbnail)
    const createProject = useMutation(api.projects.create)
    const createRepo = useMutation(api.repos.createRepository)

    const filteredAvailableTags = allTags
        .filter(tag => !selectedTags.includes(tag))
        .filter(tag =>
            tag.toLowerCase().includes(search.toLowerCase())
        );

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

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
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


    return (
            <View
               style={{
                   flex:1,
                   marginHorizontal:16,
               }}

            >
                <ScrollView
                    bounces={false}
                    nestedScrollEnabled
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >


                    {/* Header */}
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
                             Project Setup
                        </Text>
                    </View>


                    {/*ThumbNail*/}
                    <View>
                        <Text style={[styles.label]}>VISUAL IDENTITY</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                const uri = await pickThumbnail()
                                if (!uri) return
                                setThubnail(uri)
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
                                        }}>{projectName.trim().charAt(0).toUpperCase()}</Text>
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

                    {/* Project name */}
                    <View >
                        <Text style={[styles.label, { marginBottom: 8 }]}>PROJECT NAME</Text>
                        <TextInput
                            value={projectName}
                            placeholder="Enter project name"
                            placeholderTextColor="#888"
                            style={[styles.input,{textAlign:"justify",textAlignVertical:"top",marginBottom:16}]}
                            onChangeText={(text) =>
                                setProjectName(text)
                            }
                        />
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
                            <View style={{ marginBottom: 0, marginTop: 16 }}>
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
                            styles.input,
                            {paddingVertical: 7}]}>

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


                    {/* CTA */}
                    <TouchableOpacity
                        style={styles.cta}
                        onPress={async () => {
                            // console.log("Selected Tags : ",selectedTags.lengthm, "")

                            if(selectedTags.length <2 || selectedTags.length>5){
                                Toast.show({
                                    type: "error",
                                    visibilityTime: 2000,
                                    position: "bottom",
                                    text1: "Tags Error",
                                    text2: "Please select between 2 to 5 tags",
                                })

                                return
                            }

                            if(loading) return

                            try{
                                setLoading(true)

                                if (thumbnail) {
                                    let thurl: any
                                    const buffer = await uriToArrayBuffer(thumbnail);

                                    const fileName =
                                        thumbnail.split("/").pop() ?? "thumbnail.png";

                                    console.log("Thumbnail is uploaded at : ", Date.now())

                                    const result = await uploadThubnail({
                                        fileName,
                                        contentType: getContentType(thumbnail),
                                        fileData: buffer,
                                    });
                                    console.log("The images is uploaded finsihd at: ", result.url, " At : ", Date.now())

                                    thurl = result.url
                                    // setThumbnailUrl(result.url)


                                    console.log("Thubnial url is :",thurl)
                                    console.log("setThubnial url is :",thumbnailUrl)
                                    console.log("Repo is created at : ", Date.now())

                                    const repo = await createRepo({
                                        githubId: BigInt(Selectedrepo.id),
                                        name: Selectedrepo.name,
                                        owner : Selectedrepo.ownerLogin,
                                        fullName:Selectedrepo.full_name,
                                        url:Selectedrepo.html_url,

                                    })

                                    const projectId = await createProject({
                                        projectName: projectName,
                                        description: description,
                                        isPublic: isPublic,
                                        thumbnailUrl: thurl,
                                        repositoryId: repo.repositoryId,
                                        tags: selectedTags,
                                        repoFullName: Selectedrepo.full_name,
                                        repoUrl: Selectedrepo.html_url,
                                        repoOwner: Selectedrepo.ownerLogin,
                                        repoName: Selectedrepo.name,
                                        lookingForMembers : isPublic ? teamMembers : []
                                    })
                                }else{
                                    const repo = await createRepo({
                                        githubId: BigInt(Selectedrepo.id),
                                        name: Selectedrepo.name,
                                        owner : Selectedrepo.ownerLogin,
                                        fullName:Selectedrepo.full_name,
                                        url:Selectedrepo.html_url,

                                    })

                                    const projectId = await createProject({
                                        projectName: projectName,
                                        description: description,
                                        isPublic: isPublic,
                                        repositoryId: repo.repositoryId,
                                        tags: selectedTags,
                                        repoFullName: Selectedrepo.full_name,
                                        repoUrl: Selectedrepo.html_url,
                                        repoOwner: Selectedrepo.ownerLogin,
                                        repoName: Selectedrepo.name,
                                    })
                                }

                                Toast.show({
                                    type: "success",
                                    visibilityTime: 2000,
                                    position: "bottom",
                                    text1: "Project Added",
                                    text2: "Project added successfully",
                                })
                            }catch(e){
                                console.log(e)
                                setLoading(false)
                                Toast.show({
                                    type: "error",
                                    visibilityTime: 2000,
                                    position: "bottom",
                                    text1: "Uploading Error",
                                    text2: "Something went wrong Please try again Later",
                                })
                            }finally{
                                setLoading(false)
                                router.replace("/project")
                            }
                        }}
                    >
                        <Text style={styles.ctaText}>Add Project</Text>
                        {/* <Ionicons name="arrow-forward" size={18} color="black" /> */}
                    </TouchableOpacity>
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



    );

};

export default setUpNewProject;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,

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
    scrollContent: {
        // padding: 20,
        paddingBottom: 40,
    },

    tagsContainer: {
        height: 220,
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
    },

    card: {
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

    backBtn: {
        position: "absolute",
        left: 0,
        padding: 8,
    },

    headerTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    thumbnail: {
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "#222",
        marginVertical:16,

        justifyContent: "center",
        alignItems: "center",
    },

    thumbnailOverlay: {
        alignItems: "center",
        gap: 8,
    },

    thumbnailText: {
        color: "#ccc",
        fontSize: 14,
    },

    titleBlock: {
        marginTop: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
    },

    subtitle: {
        color: "#8B8B8B",
        fontSize: 15,
        marginTop: 6,
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
        paddingVertical: 16,
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
