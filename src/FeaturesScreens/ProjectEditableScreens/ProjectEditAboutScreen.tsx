import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView, ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";

const ProjectEditAboutScreen = ({projectId,about}: any) => {

    const updateProject = useMutation(api.projects.updateProject)
    const [overLayout, setOverLayout] = useState<boolean>(false)
    const [aboutData, setAboutData] = useState(about || "");
    // console.log("editAboutScreen", projectId, about);
    // console.log("About Data ", aboutData)

    return (
        <View style={{
            flex:1,
        }}>
            <View
                style={{
                    flex:1,
                    marginHorizontal:16
                }}
            >

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={{flex:1}}>

                        {/* Header */}
                        <View style={{
                            flexDirection:"row",
                            alignItems:"center",
                            justifyContent:"space-between",
                            height:60,
                        }}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="chevron-back" size={24} color="white" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Edit Project Description</Text>
                            <View style={{ width: 42 }} />
                        </View>


                        {/* About Input Area*/}
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: '#2D2D2D',
                            padding: 16,
                            marginBottom: 100,
                        }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }} scrollsToTop={true}>
                                <TextInput
                                    value={aboutData}
                                    multiline={true}
                                    onChangeText={setAboutData}
                                    placeholder="Tell the world about your project..."
                                    placeholderTextColor="#4b5563"
                                    style={styles.textInput}
                                    textAlignVertical="top"
                                />
                            </ScrollView>

                            {/* Character Count */}
                            <View style={styles.footerStats}>
                                <Text style={styles.charCount}>
                                    {aboutData.length} characters
                                </Text>
                            </View>
                        </View>

                        {/* Bottom Action */}
                        <View style={styles.bottomBar}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={async ()=>{
                                    if(overLayout) return
                                    try {
                                        setOverLayout(true);

                                        await updateProject({
                                            about: aboutData,
                                            projectId: projectId as Id<"projects">
                                        })

                                        Toast.show({
                                            position: "bottom",
                                            type:"success",
                                            text1:"About Updated",
                                            visibilityTime:2000
                                        })
                                        router.back()
                                    }
                                    catch (error) {
                                        setOverLayout(false);
                                        Toast.show({
                                            position: "bottom",
                                            type:"error",
                                            text1:"Error Occured",
                                            visibilityTime:2000
                                        })
                                        // throw error;
                                    }
                                }}
                                style={styles.updateButton}
                            >
                                <Text style={styles.updateButtonText}>Update About</Text>
                                <Ionicons name="checkmark-circle" size={20} color="black" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>

            </View>
            {overLayout && (
                <View style={styles.overLay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({

    overLay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },

    backButton: {
        backgroundColor: "#1A1A1A",
        borderColor: "#2D2D2D",
        borderWidth: 1,
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
    },

    textInput: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
        fontWeight: "400",
    },
    footerStats: {
        borderTopWidth: 1,
        borderTopColor: '#2D2D2D',
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    charCount: {
        color: '#4b5563',
        fontSize: 12,
    },
    bottomBar: {
        position: "absolute",
        bottom: Platform.OS === 'ios' ? 30 : 20,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
    },
    updateButton: {
        flexDirection: 'row',
        backgroundColor: "white",
        borderRadius: 16,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    updateButtonText: {
        color: "black",
        letterSpacing:1,
        fontWeight: "700",
        fontSize: 16,
    },
});

export default ProjectEditAboutScreen;