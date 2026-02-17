import React, {useMemo} from 'react';
import {View, Text, Modal, Pressable, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Edit2, Sparkles, MessageSquare, Trash2, X} from "lucide-react-native";


type projectOptionsProps = {
    visible: boolean;
    onClick: (data: string) => void;
    onClose: () => void;
}
const projectOptionsDialog = (
    {visible, onClick, onClose}: projectOptionsProps
) => {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.backdrop}
                onPress={onClose}

            >
                <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>

                    <View>

                        {/* Header */}
                        <View>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>

                                <Text
                                    style={{
                                        letterSpacing: 1.2,
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#717682"
                                    }}
                                >PROJECT OPTIONS</Text>


                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: "#1C1C1E",
                                        borderColor: "#2D2D2F",
                                        borderWidth: 2,
                                        borderRadius: 12,
                                        padding: 7,
                                    }}
                                    onPress={onClose}
                                >
                                    <Ionicons name={"close"} size={20} color={"#888888"}/>
                                </TouchableOpacity>

                            </View>
                        </View>



                        {/* OPtions */}
                        <OptionsItem
                            icon={
                                <Edit2 size={20} color="#fff"/>
                            }
                            name={"Edit"}
                            action={"Edit"}
                            onPress={(ac) => {
                                onClick(ac);
                            }}/>

                        <OptionsItem
                            icon={<Sparkles size={20} color="#A855F7"/>}
                            name={"Ai Action"}
                            action={"Ai"}
                            onPress={(ac) => {
                                onClick(ac);
                            }}/>

                        <OptionsItem
                            icon={<MessageSquare size={20} color="#fff"/>}
                            name={"Request"}
                            action={"Request"}
                            onPress={(ac) => {
                                onClick(ac);
                            }}/>

                        <OptionsItem
                            icon={<Trash2 size={20} color="#ff4d4d"/>}
                            name={"Delete"}
                            action={"Delete"}
                            isDelete={true}
                            onPress={(ac) => {
                                onClick(ac);
                            }}/>


                    </View>


                </Pressable>

            </Pressable>

        </Modal>
    );
};

type OptionsItemProps = {
    icon: React.ReactNode;
    name: string;
    action: string;
    onPress: (action: string) => void;
    isDelete?: boolean;
}

const OptionsItem = ({icon, name, action, onPress, isDelete = false}: OptionsItemProps) => {

    return (
        <View
        >
            <TouchableOpacity
                activeOpacity={0.8}
                style={[{
                    paddingVertical: 16,
                    paddingHorizontal: 6,
                    borderRadius: 16,
                },
                ]}
                onPress={() => {
                    onPress(action);
                }}
            >
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}>
                    {icon}
                    <Text style={[styles.optionText, isDelete && {color: "#EF4444",}]}>{name}</Text>

                </View>

            </TouchableOpacity>

            {!isDelete && (
                <View style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "#2D2D2F"
                }}/>

            )}

        </View>


    )

}


export default projectOptionsDialog;


const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dialog: {
        width: "100%",
        maxWidth: 400,
        maxHeight: "80%",
        backgroundColor: "#18181b",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#3f3f46",
        padding: 24,
        ...Platform.select({
            ios: {shadowColor: "#000", shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20},
            android: {elevation: 10},
        }),
    },

    optionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
        letterSpacing: 1,
    },


})
