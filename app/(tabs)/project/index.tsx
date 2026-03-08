import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator} from 'react-native';
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Ionicons} from "@expo/vector-icons";
import {formatRelativeTime} from "@/components/Helper/helper";
import ProjectOptionsDialog from "@/components/Dialogs/projectOptionsDialog";
import {router} from "expo-router";
import {Id} from "@/convex/_generated/dataModel";
import DeleteProjectAlertDialog from "@/components/Dialogs/DeleteProjectAlertDialog";
import Toast from "react-native-toast-message";
import PlanUpgradeDialog from "@/components/Dialogs/PlanUpgradeDialog";

const Project = () => {

    const user = useQuery(api.users.getCurrentUser)
    const Projects = useQuery(api.projects.getProjects)
    const [projectOptionsVisible, setProjectOptionsVisible] = useState<boolean>(false)
    const [selectedProject, setSelectedProject] = useState<any>("");
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const deleteRepo = useMutation(api.repos.deleteRepo)
    const deleteProject = useMutation(api.projects.deleteProject)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)



    const handleDelete = async () => {
        if (!selectedProject || !selectedProject.repositoryId) {
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
            await deleteRepo({ repoId : selectedProject.repositoryId as any })
            await deleteProject({ projectId: selectedProject._id })
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
        // router.back()
    }



    if (Projects === undefined) {
        return (
            <View className={"flex-1 justify-center items-center"}>
                <Text className={"text-white text-xl"}>Loading...</Text>
            </View>
        )
    }

    const ProjectData = Projects.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )


    return (
        <View
        style={{
            flex:1,
        }}
        >


        <View style={{
            flex: 1,
            marginHorizontal: 16
        }}>

            {/*  Header  */}
            <View style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center"
            }}>

                <View>
                    <Text style={{
                        letterSpacing: 1.2,
                        fontSize: 20,
                        fontWeight: "800",
                        color: "white",
                        marginBottom: 6
                    }}>My Project</Text>

                    <Text style={{
                        letterSpacing: 1.2,
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#717682"
                    }}>{Projects.length} {Projects.length > 1? "Projects" : "Project"} Active</Text>

                </View>

                <TouchableOpacity
                    onPress={() => {
                    }}
                    activeOpacity={0.6}
                    style={{
                        backgroundColor: "#1C1C1E",
                        borderColor: "#2D2D2F",
                        borderWidth: 2,
                        borderRadius: 12,
                        padding: 7,
                    }}
                >
                    <Ionicons name={"filter-outline"} size={28} color={"#888888"}/>

                </TouchableOpacity>

            </View>


            {/*  Project Sections  */}
            <View>


                <FlatList
                    data={ProjectData}
                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => (


                        <ProjectCard
                            item={item}
                            onPress={()=>{
                               router.push(`/project/${item._id}`)
                            }}
                            onLongPress={()=>{
                                setSelectedProject(item);
                                setProjectOptionsVisible(true)

                            }}

                        />
                    )}

                    ListEmptyComponent={
                        <>
                        </>
                    }
                />

            </View>


            <TouchableOpacity
                className='absolute bottom-5 right-0 self-start rounded-full bg-white p-3'
                onPress={()=>{
                    console.log("Projects : " + Projects.length)
                    console.log("user Data : ",user?.limit)
                    if(Projects.length >= 1 || 0){
                        // Toast.show({
                        //   type: "error",
                        //   visibilityTime: 2000,
                        //   position: "bottom",
                        //   text1: "Limit Exceeded",
                        //   text2: "You have reached the maximum limit of projects",
                        // })
                        setShowUpgradeModal(true)
                        // return

                    }else{
                        router.push("/project/addNewProject")
                    }


                }}
            >
                <View className='flex-row items-center gap-3 '>
                    <Ionicons name='add' size={24} color='black'/>
                    <Text className='text-black font-semibold'>New Project</Text>

                </View>



            </TouchableOpacity>

            <ProjectOptionsDialog
                visible={projectOptionsVisible}
                onClick={(mode)=>{
                    setProjectOptionsVisible(false)
                    switch (mode) {
                        case "Edit" :
                            router.push({
                                pathname: `/project/${selectedProject._id}/editProjectScreen`,
                                params: { projectId: selectedProject._id },
                            })
                            break;
                        case "Request":
                            router.push({
                                pathname: `/project/${selectedProject._id}/requestScreen`,
                                params: { projectId: selectedProject._id },
                            })
                            break;
                        case "Delete":
                            setShowDeleteModal(true)
                            break;


                    }
                }}
                onClose={()=>{
                    setProjectOptionsVisible(false);
                }}
            />

            <PlanUpgradeDialog
                onDismiss={() => setShowUpgradeModal(false)}
                onUpgrade={()=>{console.log("Upgrade")}}
                limit={user?.limit}
                visible={showUpgradeModal}/>

            <DeleteProjectAlertDialog
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                ProjectName={selectedProject.projectName || ""}
            />


        </View>
            {deleteLoading && (
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 151,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "center",
                    alignItems: "center"

                }}>

                        <Text style={{
                            letterSpacing:1,
                            fontSize:18,
                            marginBottom:10,
                        }}>Deleting the Project....</Text>

                    <ActivityIndicator size={"large"} color={"white"}/>
                </View>
            )}
        </View>

    );
};

type ProjectCardProps = {
    item:any,
    onPress:()=>void
    onLongPress:()=>void
}

const ProjectCard = ({item,onPress,onLongPress} : ProjectCardProps) => {


    const isPublic = item.isPublic === true;
    const [isPressed, setIsPressed] = useState(false); // tap lock

    const handlePress = () => {
        if (isPressed) return; // block re-entry

        setIsPressed(true);
        onPress?.();

        // release lock after delay
        setTimeout(() => {
            setIsPressed(false);
        }, 700); // 300–700ms is optimal
    };

    const handleLongPress = () => {
        if (isPressed) return;

        setIsPressed(true);
        onLongPress?.(); // FIX: actually call it

        // release lock after delay
        setTimeout(() => {
            setIsPressed(false);
        }, 500); // 300–700ms is optimal
    };


    return (
        // Project Card

        <TouchableOpacity
            // disabled={isPressed}
            onLongPress={handleLongPress}
            onPress={handlePress}
            activeOpacity={0.6}

        >

            <View
                style={{
                    backgroundColor: "#161616",
                    borderColor: "#252525",
                    borderRadius: 16,
                    borderWidth:1.5,
                    overflow: "hidden",
                    marginTop:10,

                }}
            >


                {/*    Thumbnail */}

                <View style={{width: "100%", height: 170}}>


                    {item.thumbnailUrl ? (


                        <Image source={{uri: item.thumbnailUrl}} resizeMode={"cover"}
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
                                {item.repoName?.charAt(0).toUpperCase()}
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
                                backgroundColor: isPublic ? "#10b981" : "#ef4444",
                                borderRadius: 999,
                                width: 6,
                                height: 6,
                            }}
                        />
                        <Text style={{
                            color: 'white', fontSize: 11, fontWeight: '700', marginLeft: 5
                        }}>{item.isPublic ? "Public" : "Private"}</Text>

                    </View>





                </View>


                {/*  Project Descrption  */}

                <View>
                    <View style={{
                        margin:16,
                        gap:6
                    }}>
                        <Text numberOfLines={1} style={{
                            color:"white",
                            fontSize:17,
                            fontWeight:"600",
                            letterSpacing:1
                        }}>{item.repoName}</Text>
                        <Text numberOfLines={1} style={{
                            color:"#717682",
                            fontSize:14,
                            letterSpacing:1

                        }}>{item.description || "No Description is Provided"}</Text>


                        <View style={{width:"100%",height:1,backgroundColor:"#333",marginVertical:7}}/>

                        <View style={{
                            flexDirection:"row",
                            justifyContent:"space-between",
                            alignItems:"center"
                        }}>

                            <View style={{
                                flexDirection:"row",
                                alignItems:"center",
                                gap:8,
                            }}>
                                <Ionicons name={"time-outline"} color={"#333"} size={16} />

                                <Text style={{
                                    color:"#717682",
                                    fontSize:12,
                                    letterSpacing:1
                                }}> Updated: {formatRelativeTime(item.updatedAt)}</Text>

                            </View>

                            <Ionicons name={"chevron-forward"} color={"#333"} size={16}/>

                        </View>


                    </View>

                </View>


            </View>
        </TouchableOpacity>

    )
}

export default Project;
