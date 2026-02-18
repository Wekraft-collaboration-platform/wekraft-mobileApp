import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Linking} from 'react-native';
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import ProjectStatsTabScreen from "@/components/TabScreens/projectStatsTabScreen"
import ProjectAboutTabScreen from "@/components/TabScreens/projectAboutTabScreen"

const ProjectLayoutScreen = () => {
    const {project,mode} = useProject()
    const [selectedTab, setSelectedTab] = useState<string>("Stats")

    if(!project){
        return (
            <View className={"flex-1 justify-center items-center"}>
                <Text className={"text-white text-xl"}>Loading...</Text>
            </View>
        )
    }

  return (
    <View
    style={{
        flex: 1,
        marginHorizontal: 16
    }}>
        {/*Header */}
        <View>

            <View style={{
                flexDirection:"row",
                alignItems:"center",
                gap:10,
            }}>
                <TouchableOpacity
                onPress={()=>{
                    router.back()

                }}
                activeOpacity={0.7}
                style={{
                    backgroundColor: "#1C1C1E",
                    borderColor: "#2D2D2F",
                    borderWidth: 2,
                    borderRadius: 12,
                    padding: 7,
                }}
                >

                <Ionicons name="chevron-back" size={32} color="white" />
                </TouchableOpacity>

                <View>
                    <Text style={{
                        letterSpacing:1,
                        color:"white",
                        fontSize:17,
                        fontWeight:"600"
                    }}>{project.projectName}</Text>
                    <Text
                    style={{
                        letterSpacing:1,
                        color:"#717682",
                        fontSize:12,
                        fontWeight:"600"

                    }}>{project.repoOwner}</Text>
                </View>
                <View style={{flex:1}}/>

                {mode === "admin" && (
                    <TouchableOpacity
                        onPress={()=>{
                            // router.back()

                        }}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: "#1C1C1E",
                            borderColor: "#2D2D2F",
                            borderWidth: 2,
                            borderRadius: 12,
                            padding: 7,
                        }}
                    >

                        <Ionicons
                            name="ellipsis-vertical-outline"
                            size={32}
                            color="white"
                            style={{ transform: [{ rotate: '90deg' }] }}
                        />
                    </TouchableOpacity>

                )}




            </View>
        </View>

        {/* Main Content */}

        <ScrollView
        overScrollMode={"never"}
        bounces={false}
        style={{
            gap:12
        }}
        contentContainerStyle={{
            paddingBottom:80,
        }}
        >
            {/*  thumbnail   */}
            <View style={{width: "100%", height: 170,overflow:"hidden", borderRadius:16,marginTop:16}}>


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



            {/*  Project Information  */}
            <View>
                <Text style={{
                        letterSpacing:1,
                        color:"#717682",
                        fontSize:18,
                        fontWeight:"600",
                        marginTop:10

                    }}>ABOUT</Text>
                <Text style={{
                    letterSpacing:1,
                    color:"#717682",
                    fontSize:14,
                    fontWeight:"400",
                    marginTop:7

                }}>{project.description || "No Description is Provided"} </Text>

                {/* TAGS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[ { marginVertical: 12,flexDirection: "row", flexWrap: "wrap", gap: 8,  }]}>
                    {project.tags?.map((tag:string) => (
                        <View key={tag} style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "rgba(136,136,136,0.5)"
                        }}>
                            <Text style={{ color: '#999', fontSize: 13 }}>#{tag} </Text>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                onPress={()=>{
                    Linking.openURL(project.repoUrl)
                }}
                activeOpacity={0.7}
                style={{
                    backgroundColor:"white",
                    borderRadius:16,
                    padding:7,
                }}
                >
                    <View style={{flexDirection:"row",justifyContent:"center", alignItems:"center", gap:7}}>
                        <Ionicons name={"logo-github"} color={"black"} size={24}/>
                        <Text style={{
                            letterSpacing:0.7,
                            color:"black",
                            fontSize:15,
                            fontWeight:"600"
                        }}>View Repository</Text>
                    </View>
                </TouchableOpacity>



            </View>



            {/*  Tabs Selection  */}
            <View>

            <View style={{
                flexDirection: 'row',
                backgroundColor: '#111',
                padding: 4,
                borderRadius: 14,
                marginVertical: 12,}}>
                {['Stats', 'About', 'Request'].map((tab) => {
                    const isSelected = selectedTab === tab
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => {


                                    setSelectedTab(tab)

                            }}
                            style={[{flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10}, isSelected && {backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' }]}
                        >
                            <Text style={[{color: '#666', fontWeight: '600'}, isSelected && {color:"white"}]}>{tab}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            </View>


            {/*  Tabs Screen   */}
            {selectedTab === "Stats" && (
                <ProjectStatsTabScreen/>

            )}

            {selectedTab === "About" && (
               <ProjectAboutTabScreen/>
            )}


            {selectedTab === "Request" && (
                <Text style={{
                    color:"white",
                    fontSize:15,
                    letterSpacing:1,
                }}
                >Selected Tab Request</Text>

            )}


        </ScrollView>

    </View>
  );
};

export default ProjectLayoutScreen;
