import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

type AdminAboutEmptyStateprops = {
    handleFetchReadme: () => void,
}
const AdminAboutEmptyState = ({handleFetchReadme}:AdminAboutEmptyStateprops) => {
    return (
        <View style={{flex: 1}}>

            {/*    Empty About Screen   Or Not Fetch Form the Github */}
            <View style={{
                backgroundColor: "#1e1e22",
                borderRadius: 12,
                marginBottom: 12,
                padding: 12,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <View style={{
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "#282a2a",
                    borderRadius: 999,
                    backgroundColor: "#1C1D1D"

                }}>
                    <Ionicons name="document-text-outline" size={42} color="white"/>
                </View>

                <Text style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: 18,
                    marginTop: 5,
                }}>No About Page Yet</Text>


                <Text style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 12,
                    marginVertical: 7,
                    marginHorizontal: 25,
                }}>Make your project stand out by adding a detailed description. You can fetch it from your GitHub
                    README or generate one using AI.</Text>


                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                    }}>

                    <TouchableOpacity

                        onPress={() => {
                            handleFetchReadme();
                        }}

                        activeOpacity={0.7}

                        style={{
                            backgroundColor: "white",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderRadius: 12,
                            marginTop: 12,
                            marginBottom: 6
                        }}

                    >
                        <View className={"flex-row w-full items-center  gap-3"}>

                            <Ionicons name={"logo-github"} size={24} color={"black"}/>
                            <Text style={{
                                fontSize: 15,
                                color: "black",
                                fontWeight: "700"
                            }}>Fetch Readme Form repo</Text>


                        </View>


                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            console.log('genrate from ai');
                        }}
                        activeOpacity={0.7}


                        style={{
                            backgroundColor: "#262626",
                            borderColor: "#333333",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderRadius: 12,
                            marginTop: 6,
                            marginBottom: 12
                        }}
                    >
                        <View className={"flex-row w-full items-center  gap-3"}>

                            <MaterialCommunityIcons name={"brain"} size={24} color={"#3b82f6"}/>
                            <Text style={{
                                fontSize: 15,
                                color: "white",
                                fontWeight: "700"
                            }}>Genrate Doc From AI</Text>


                        </View>


                    </TouchableOpacity>


                </View>


            </View>


        </View>
    );
};

export default AdminAboutEmptyState;
