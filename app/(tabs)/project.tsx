import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Ionicons} from "@expo/vector-icons";
import {formatRelativeTime} from "@/components/Helper/helper";
// import {useSafeState} from "@clerk/clerk-js/dist/types/ui/hooks";

const Project = () => {

    const user = useQuery(api.users.getCurrentUser)
    const Projects = useQuery(api.projects.getProjects)

    if (Projects === undefined) {
        return (
            <View className={"flex-1 justify-center items-center"}>
                <Text className={"text-white text-xl"}>Loading...</Text>
            </View>
        )
    }

    return (
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
                    data={Projects}
                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => (


                        <ProjectCard
                            item={item}
                            onPress={()=>{
                            console.log("Card Pressed")
                            }}
                            onLongPress={()=>{
                                console.log("Card Long Pressed")

                            }}

                        />
                    )}

                    ListEmptyComponent={
                        <>
                        </>
                    }
                />

            </View>


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
    const [isEnabled, setIsEnabled] = useState(false);
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
