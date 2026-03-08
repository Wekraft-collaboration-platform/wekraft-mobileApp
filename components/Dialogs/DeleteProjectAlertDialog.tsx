import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

export default function DeleteProjectAlertDialog({
                                               ProjectName,
                                               visible,
                                               onClose,
                                               onDelete,
                                           }: {
    ProjectName: string;
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
}) {
    const [input, setInput] = useState("");
    const confirmText = `delete ${ProjectName.toLowerCase()}`;
    const isValid = input.toLowerCase() === confirmText;

    useEffect(() => {
        if (visible) setInput("");
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.backdrop}
            >
                <View style={styles.modalCard}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.dangerIcon}>
                            <Text style={styles.dangerIconText}>!</Text>
                        </View>
                        <Text style={styles.title}>Delete Project</Text>
                    </View>

                    {/* Body Section */}
                    <View style={styles.body}>
                        <Text style={styles.warningText}>
                            This action is <Text style={styles.bold}>irreversible</Text>. All
                            data associated with <Text style={styles.projectName}>"{ProjectName}"</Text> will
                            be removed from our servers.
                        </Text>

                        <View style={styles.confirmBox}>
                            <Text style={styles.instructionText}>
                                To confirm, please type:
                            </Text>
                            <Text style={styles.slugText}>{confirmText}</Text>
                        </View>

                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type the phrase above"
                            placeholderTextColor="#555"
                            style={[styles.input, isValid && styles.inputValid]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            selectionColor="#ff4d4d"
                        />
                    </View>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            style={styles.secondaryBtn}
                        >
                            <Text style={styles.secondaryBtnText}>Keep Project</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={!isValid}
                            onPress={onDelete}
                            activeOpacity={0.8}
                            style={[styles.primaryBtn, !isValid && styles.primaryDisabled]}
                        >
                            <Text style={styles.primaryBtnText}>Delete Forever</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker backdrop for focus
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#121212", // Deep black surface
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        overflow: "hidden",
    },
    header: {
        paddingTop: 24,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dangerIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255, 77, 77, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 77, 77, 0.3)",
    },
    dangerIconText: {
        color: "#ff4d4d",
        fontWeight: "900",
        fontSize: 16,
    },
    title: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    body: {
        padding: 24,
    },
    warningText: {
        color: "#a0a0a0",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    bold: {
        color: "#fff",
        fontWeight: "600",
    },
    projectName: {
        color: "#fff",
        fontWeight: "700",
        fontStyle: "italic",
    },
    confirmBox: {
        backgroundColor: "#1a1a1a",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#222",
    },
    instructionText: {
        color: "#666",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    slugText: {
        color: "#ff4d4d",
        fontSize: 15,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#000",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "white",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    inputValid: {
        borderColor: "#ff4d4d",
    },
    footer: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: "#1a1a1a", // Subtle contrast for footer
        gap: 12,
    },
    secondaryBtn: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
        borderRadius: 12,
    },
    secondaryBtnText: {
        color: "#888",
        fontSize: 15,
        fontWeight: "600",
    },
    primaryBtn: {
        flex: 1.5,
        backgroundColor: "#ff4d4d",
        paddingVertical: 14,
        alignItems: "center",
        borderRadius: 12,
        shadowColor: "#ff4d4d",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryDisabled: {
        backgroundColor: "#2a2a2a",
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryBtnText: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
    },
});