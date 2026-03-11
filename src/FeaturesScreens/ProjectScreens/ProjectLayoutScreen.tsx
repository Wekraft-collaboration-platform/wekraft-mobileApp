import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Linking, ActivityIndicator} from 'react-native';
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import ProjectStatsTabScreen from "@/components/TabScreens/projectStatsTabScreen"
import ProjectAboutTabScreen from "@/components/TabScreens/projectAboutTabScreen"
import {useGithubProjectHealth} from "@/queries/project/useGithubProjectHealth";
import {useGithubLanguages} from "@/queries/project/useGithubLanguages";
import ProjectHealthBreakdownDialog from "@/components/Dialogs/projectHealthBreakdownDialog";
import {AnchorMenu} from "@/components/Extras/AnchorMenu";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Toast from "react-native-toast-message";
import DeleteProjectAlertDialog from "@/components/Dialogs/DeleteProjectAlertDialog";
import ApplyTeamProjectPositionDialog from "@/components/Dialogs/ApplyTeamProjectPositionDialog";
import {useUser} from "@clerk/clerk-expo";
import ProjectLayoutSkeletonView from "@/components/SkeletonLayout/ProjectLayoutSkeletonView";
import { MotiView } from "moti";


type ProjectLayoutScreenProps = {
    onCommits: () => void;
    onPr: () => void;
    // onOpenHealth: (check : boolean) => void;
    onOpenIssue: () => void;
    onOpenEditAbout : (about : string) => void;
    onRequestOpen : ( ) => void;
}
const ProjectLayoutScreen = ({onCommits, onPr, onOpenIssue,onOpenEditAbout,onRequestOpen}: ProjectLayoutScreenProps) => {
    const {project,projectId, mode,user} = useProject()
    const { user : userData, isLoaded } = useUser();

    const [role,setRole]=useState("")

        const tabItems = [
            "Stats",
            "About",
            ...(mode === "admin" ? ["Request"] : [])
        ]

    const [selectedTab, setSelectedTab] = useState<string>("Stats")
    const [stopNav, setStopNav] = useState<boolean>(false)
    const [projectHealthShow, setProjectHealthShow] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showApplyModel, setShowApplyeModal] = useState(false)

    const sendRequesst = useMutation(api.projectRequests.sendProjectRequest)


    const deleteRepo = useMutation(api.repos.deleteRepo)
    const deleteProject = useMutation(api.projects.deleteProject)
    const [deleteLoading, setDeleteLoading] = useState(false)



    const handleDelete = async () => {
        if (!project || !project.repositoryId) {
            Toast.show({
                type: "error",
                visibilityTime: 2000,
                position: "bottom",
                text1: "Error",
                text2: "Something went wrong"
            })
            setDeleteLoading(false)
            return
        }

        setDeleteLoading(true)

        try {
            await deleteRepo({ repoId : project.repositoryId as any })
            await deleteProject({ projectId: project._id })
            Toast.show({
                type: "success",
                visibilityTime: 2000,
                position: "bottom",
                text1: "Success",
                text2: "Project deleted successfully"
            })
            setDeleteLoading(false)
        } catch (error) {
            console.log(error)
            Toast.show({
                type: "error",
                visibilityTime: 2000,
                text1: "Error",
                text2: "Something went wrong"
            })
            setDeleteLoading(false)
        }
        setShowDeleteModal(false)
        router.back()
    }



    const {
        data: health,
        isLoading: healthLoading
    } = useGithubProjectHealth(project?.repoOwner as string, project?.repoName as string)
    const {
        data: languages,
        isLoading: languagesLoading
    } = useGithubLanguages(project?.repoOwner as string, project?.repoName as string)


    if (!project || !health || !languages) {
        return (
           <ProjectLayoutSkeletonView/>
        )
    }


    // console.log(health)

    return (

        <View
        style={{
            flex:1,
        }}
        >


        <View
            style={{
                flex: 1,
                marginHorizontal: 16
            }}>
            {/*Header */}
            <View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}>

                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 400 }}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "center",
                            height: 70,
                        }}
                    >
                    <TouchableOpacity
                        onPress={() => {
                            router.back()
                        }}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: "#1C1C1E",
                            borderColor: "#2D2D2F",
                            borderWidth: 2,
                            borderRadius: 12,
                            marginRight:7,
                            padding: 7,
                        }}
                    >

                        <Ionicons name="chevron-back" size={32} color="white"/>
                    </TouchableOpacity>

                    <View>
                        <Text style={{
                            letterSpacing: 1,
                            color: "white",
                            fontSize: 17,
                            fontWeight: "600"
                        }}>{project.projectName}</Text>
                        <Text
                            style={{
                                letterSpacing: 1,
                                color: "#717682",
                                fontSize: 12,
                                fontWeight: "600"

                            }}>{project.repoOwner}</Text>
                    </View>
                    <View style={{flex: 1}}/>



                    {/*Admin Mode*/}
                    {mode === "admin" && (
                        <AnchorMenu
                            anchor={<Ionicons name="ellipsis-vertical-outline" size={32} color="white" />}
                            items={[
                                {
                                    label: "Edit project", onPress: () => {
                                        router.push({
                                            pathname: `/project/${projectId}/editProjectScreen`,
                                            params: { projectId },
                                        })
                                    }
                                },
                                { label: "AI actions", onPress: () => { } },
                                {
                                    label: "Delete project",
                                    danger: true,
                                    onPress: () => {
                                        setShowDeleteModal(true)

                                    },
                                },
                            ]}
                        />

                    )}

                    </MotiView>



                </View>
            </View>

            {/* Main Content */}

            <ScrollView
                overScrollMode={"never"}
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={{
                    gap: 12
                }}
                contentContainerStyle={{
                    paddingBottom: 40
                }}
            >
                {/*  thumbnail   */}

                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 400, delay: 100 }}

                >
                <View style={{width: "100%", height: 170, overflow: "hidden", borderRadius: 16, marginTop: 16}}>


                    {project.thumbnailUrl ? (


                        <Image source={{uri: project.thumbnailUrl}} resizeMode={"cover"}
                               style={{width: "100%", height: "100%"}}/>


                    ) : (

                        <View style={{
                            flex: 1,
                            backgroundColor: "#222",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>

                            <Text style={{
                                color: '#444', fontSize: 40, fontWeight: '800'
                            }}>
                                {project.repoName?.charAt(0).toUpperCase()}
                            </Text>


                        </View>

                    )}


                    {/*Visibility Badge */}
                    <View style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}>
                        <View
                            style={{
                                backgroundColor: project.isPublic ? "#10b981" : "#ef4444",
                                borderRadius: 999,
                                width: 6,
                                height: 6,
                            }}
                        />
                        <Text style={{
                            color: 'white', fontSize: 11, fontWeight: '700', marginLeft: 5
                        }}>{project.isPublic ? "Public" : "Private"}</Text>

                    </View>




                </View>
                </MotiView>


                {/*  Project Information  */}

            <MotiView
                from={{ opacity: 0, translateY: -30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 100 }}
            >
                <View>
                    <Text style={{
                        letterSpacing: 1,
                        color: "#717682",
                        fontSize: 18,
                        fontWeight: "600",
                        marginTop: 10

                    }}>ABOUT</Text>
                    <Text style={{
                        letterSpacing: 1,
                        color: "#717682",
                        fontSize: 14,
                        fontWeight: "400",
                        marginTop: 7

                    }}>{project.description || "No Description is Provided"} </Text>

                    {/* TAGS */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[{
                        marginVertical: 12,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                    }]}>
                        {project.tags?.map((tag: string) => (
                            <View key={tag} style={{
                                backgroundColor: "rgba(255,255,255,0.05)",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "rgba(136,136,136,0.5)"
                            }}>
                                <Text style={{color: '#999', fontSize: 13}}>#{tag} </Text>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(project.repoUrl)
                        }}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 16,
                            padding: 7,
                        }}
                    >
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7}}>
                            <Ionicons name={"logo-github"} color={"black"} size={24}/>
                            <Text style={{
                                letterSpacing: 0.7,
                                color: "black",
                                fontSize: 15,
                                fontWeight: "600"
                            }}>View Repository</Text>
                        </View>
                    </TouchableOpacity>




                </View>

            </MotiView>



                {/*  Tabs Selection  */}
                <View>

                    <MotiView
                        from={{ opacity: 0, translateY: -30  }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 400, delay: 400 }}
                    >

                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#111',
                        padding: 4,
                        borderRadius: 14,
                        marginVertical: 12,
                    }}>
                        {tabItems.map((tab) => {
                            const isSelected = selectedTab === tab
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => {

                                        if(tab === 'Request') {
                                            onRequestOpen()
                                        }
                                        else
                                        setSelectedTab(tab)




                                    }}
                                    style={[{
                                        flex: 1,
                                        paddingVertical: 10,
                                        alignItems: 'center',
                                        borderRadius: 10
                                    }, isSelected && {backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333'}]}
                                >
                                    <Text style={[{
                                        color: '#666',
                                        fontWeight: '600'
                                    }, isSelected && {color: "white"}]}>{tab}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

            </MotiView>
                </View>



                <MotiView
                    key={selectedTab}
                    from={{ opacity: 0, translateX: 10 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                >

                {/*  Tabs Screen   */}
                {selectedTab === "Stats" && (
                    <ProjectStatsTabScreen
                        projectData={project}
                        mode={mode}
                        health={health}
                        languages={languages}
                        openIssue={() => {
                            onOpenIssue()
                        }
                        }
                        openPr={() => {
                            onPr()
                        }
                        }
                        stopNavigation={(check) => {
                            setStopNav(check)
                        }
                        }
                        openHealth={() => {
                            setProjectHealthShow(true)
                        }
                        }
                        openCommits={() => {
                            onCommits()
                        }
                        }
                        handleRequestJoin={(role:string)=>{
                            setRole(role)
                            setShowApplyeModal(true)
                        }}

                    />

                )}

                {selectedTab === "About" && (
                    <ProjectAboutTabScreen
                        about={project.about}
                        repo={project.repoName}
                        owner={project.repoOwner}

                        stopNavigation={(check)=>{
                            setStopNav(check)
                        }}
                        openEditAbout={()=>{
                            onOpenEditAbout(project.about)
                        }}

                    />
                )}

                </MotiView>

            </ScrollView>

            {project.healthScore && (
                <ProjectHealthBreakdownDialog
                    visible={projectHealthShow}
                    onClose={() => setProjectHealthShow(false)}
                    healthScore={project.healthScore}
                />
            )}


            <ApplyTeamProjectPositionDialog
                visible={showApplyModel}
                onClose={() => setShowApplyeModal(false)}
                onSend={async (msg : string)=>{
                    try {
                        await sendRequesst({
                            projectId,
                            userId: user?._id,
                            userName: userData?.username ?? "",
                            userImage: userData?.imageUrl,
                            message: msg,
                            role:role
                        })

                        Toast.show({
                            type: 'success',
                            text1: "Requested Successfully",
                            visibilityTime: 2000,
                            position: 'bottom'
                        })

                        setShowApplyeModal(false)

                    }
                    catch (error:any) {
                        console.log("Error : - " , error)
                        if(error?.data === "Already Send") {
                            Toast.show({
                                type:"info",
                                text1: "Already Send",
                                visibilityTime: 2000,
                                position: 'bottom'
                            })
                        }
                        else {
                            Toast.show({
                                type:"error",
                                text1: "Requested Failed",
                                visibilityTime: 2000,
                                position: 'bottom'
                            })


                        }
                        setShowApplyeModal(false)
                    }

                }}
                projectTitle={role ?? ""}
            />


            <DeleteProjectAlertDialog
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                ProjectName={project.projectName || ""}
            />


        </View>

            {(stopNav || deleteLoading) && (
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 101,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "center",
                    alignItems: "center"

                }}>
                    {deleteLoading && (
                        <Text style={{
                            letterSpacing:1,
                            fontSize:18,
                            marginBottom:10,
                        }}>Deleting the Project....</Text>
                    )}
                    <ActivityIndicator size={"large"} color={"white"}/>
                </View>
            )}

        </View>



    );
};

export default ProjectLayoutScreen;
