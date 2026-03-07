import React, {useState} from 'react';
import {View, Text, Platform, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import {api} from "@/convex/_generated/api";
import {useAction, useMutation} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";
import  {useGetProjectReadme} from "@/queries/project/useGetProjectReadme";
import {useProject} from "@/src/FeaturesScreens/ProjectScreens/ProjectProvider";
import AdminAboutEmptyState from "@/components/EmptyStates/AdminAboutEmptyState";
import UserAboutEmptyState from "@/components/EmptyStates/UserAboutEmptyState";


type ProjectProviderProps = {
    about:any,
    repo:string,
    owner:string,
    openEditAbout:()=>void,
    stopNavigation:(stop:boolean)=>void
}

const ProjectAboutTabScreen = ({about,openEditAbout,repo,owner,stopNavigation,}:ProjectProviderProps) => {
    // const {projectId} = useLocalSearchParams()
    const {projectId,mode} = useProject()
    const updateProject = useMutation(api.projects.updateProject)
    const readmeQuery = useGetProjectReadme(owner,repo)
    const [disable,setDisable] = useState<boolean>(false);

    const handleFetchReadme = async () => {
        if (disable) return;

        try {
            const isValid =
                owner.trim().length > 0 &&
                repo.trim().length > 0;

            if (!isValid) {
                throw new Error("Invalid repo parameters");
            }

            setDisable(true);
            stopNavigation(true);

            console.log("Fetch Started");

            const result = await readmeQuery.refetch();

            if (!result.data) {
                throw new Error("README fetch returned empty data");
            }

            await updateProject({
                projectId,
                about: result.data
            });


            Toast.show({
                position: "bottom",
                type: "success",
                text1: "Sync Successful"
            });

            console.log("Fetch Successful");

        } catch (e) {

            console.error(e);

            Toast.show({
                position: "bottom",
                type: "error",
                text1: "Sync Failed"
            });

            console.log("Fetch Failed");

        } finally {
            setDisable(false);
            stopNavigation(false);
        }
    };


    const ActionButton = ()=>{
        return(
            <View className={"flex-row gap-2 items-center"}>

                <TouchableOpacity style={[{flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a2a30', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, gap: 4,},disable && {opacity:0.4}]}
                                  disabled={disable}
                                  onPress={()=>{
                                      console.log("edit")
                                      openEditAbout()

                                  }}
                >
                    <View className={"flex-row items-center"}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color="#94a3b8" />
                        <Text style={{
                            color: '#e2e8f0',
                            fontSize: 12,
                            fontWeight: '600',
                        }}>Edit</Text>

                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[{flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a2a30', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, gap: 4,},disable && {opacity:0.4}]}
                                  disabled={disable}
                                  onPress={()=>{
                                      console.log("Ai")

                                  }}
                >
                    <View className={"flex-row items-center"}>
                        <MaterialCommunityIcons name="auto-fix" size={18} color="#3b82f6" />
                        <Text style={{
                            color: '#e2e8f0',
                            fontSize: 12,
                            fontWeight: '600',
                        }}>AI Improve</Text>

                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[{flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a2a30', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, gap: 4,},disable && {opacity:0.4}]}

                                  disabled={disable}
                                  onPress={async ()=>{
                                      await handleFetchReadme()
                                  }}
                >
                    <View className={"flex-row items-center"}>
                        <Ionicons name="logo-github" size={18} color="#94a3b8" />
                        <Text style={{
                            color: '#e2e8f0',
                            fontSize: 12,
                            fontWeight: '600',
                        }}>Sync</Text>

                    </View>
                </TouchableOpacity>


            </View>

        )
    }


    if(about){
        return (
            <View style={{
                backgroundColor: "#18181b",
                borderColor: "#3f3f46",
                borderWidth: 1,
                borderRadius: 24,
                padding: 16,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 15,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#2e2e32',
                }}>
                    <Text style={{color: '#94a3b8',
                        fontSize: 12,
                        fontWeight: '600',
                        textTransform: 'uppercase',}}>Project Description</Text>

                    {mode === "admin" && (

                        <ActionButton/>
                    )}


                </View>
                <ScrollView>
                    <Markdown
                        style={markdownStyles}

                    >
                        {about}
                    </Markdown>
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>

            {mode === "admin" ? (
                <AdminAboutEmptyState
                handleFetchReadme={handleFetchReadme}/>
            ) : mode === "user" &&(
                <UserAboutEmptyState/>
            )}



        </View>
    );
};

export default ProjectAboutTabScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentCard: {
        flex: 1,
        backgroundColor: "#1e1e22",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2e2e32',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2e2e32',
    },
    headerTitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    actionContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    smallBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a30',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 4,
    },
    smallBtnText: {
        color: '#e2e8f0',
        fontSize: 12,
        fontWeight: '600',
    },
    // Empty State Styles
    emptyCard: {
        backgroundColor: "#1e1e22",
        borderRadius: 24,
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#2e2e32',
    },
    iconCircle: {
        padding: 20,
        borderRadius: 100,
        backgroundColor: "#1c1d1d",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#282a2a",
    },
    emptyTitle: {
        color: "white",
        fontWeight: "800",
        fontSize: 22,
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#94a3b8",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
    primaryBtn: {
        flexDirection: 'row',
        backgroundColor: "white",
        height: 52,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    primaryBtnText: {
        fontSize: 16,
        color: "black",
        fontWeight: "700",
    },
    secondaryBtn: {
        flexDirection: 'row',
        backgroundColor: "#262626",
        height: 52,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#333",
    },
    secondaryBtnText: {
        fontSize: 16,
        color: "white",
        fontWeight: "700",
    },
});


const markdownStyles = {
    body: { color: '#e2e8f0', fontSize: 16, lineHeight: 24 },
    heading1: { color: '#ffffff', fontWeight: '800', marginVertical: 10,lineHeight: 37 },
    heading2: { color: '#ffffff', fontWeight: '700', marginTop: 20, marginBottom: 8 },
    code_block: { backgroundColor: '#000', padding: 12, borderRadius: 8, marginVertical: 10 },
    fence: { backgroundColor: '#000', borderRadius: 8, color: '#f8f8f2' ,marginVertical:5},
    code_inline: { backgroundColor: '#2d2d2d', color: '#ff79c6', paddingHorizontal: 4, borderRadius: 4 },
    link: { color: '#3b82f6', textDecorationLine: 'underline' },
};