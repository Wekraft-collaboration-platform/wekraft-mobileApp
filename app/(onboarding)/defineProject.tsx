import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from "react-native";

import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import { useOnboarding } from "@/context/OnBoardingContext";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {nanoid} from "nanoid";
import {showError} from "@/app/(onboarding)/identity";

const PROJECT_STAGES = [
    {
        id: "idea",
        title: "Ideation",
        icon: "bulb-outline",
    },
    {
        id: "validation",
        title: "Validation",
        icon: "search-outline",
    },
    {
        id: "development",
        title: "Development",
        icon: "code-slash-outline",
    },
    {
        id: "beta",
        title: "Beta",
        icon: "rocket-outline",
    },
    {
        id: "production",
        title: "Production",
        icon: "globe-outline",
    },
    {
        id: "scaling",
        title: "Scaling",
        icon: "trending-up-outline",
    },
];

const DefineProject = () => {
    const {
        data,
        setData,
    } = useOnboarding();

    const initProject = useMutation(api.projects.projectInitOnboarding);


    const handleContinue =async  () => {

        const projectName = data.projectName.trim()

        const projectRegex =
            /^[a-zA-Z0-9\s\-_]{3,40}$/

        if (!projectName) {
            return showError("Project name required")
        }

        if (!projectRegex.test(projectName)) {
            return showError(
                "Project name must be 3-40 valid characters"
            )
        }

        if (!data.projectStage) {
            return Toast.show({
                type: "error",
                text1: "Select a project stage",
                position: "bottom",
            });
        }

        const inviteCode = nanoid(32)

        await initProject({
            projectName: data.projectName,
            projectStatus: data.projectStage,
            inviteLink: inviteCode,
            isPublic: true
        })

        setData(prev => ({
            ...prev,
            inviteCode
        }))

        router.push("/(onboarding)/invite");
    };

    return (
        <LinearBackgroundProvider>
            <View style={styles.container}>
                {/* Progress */}
                <View style={styles.progressWrapper}>
                    {[1, 2, 3, 4].map((item, index) => (
                        <View
                            key={item}
                            style={styles.progressItem}
                        >
                            <View
                                style={[
                                    styles.progressCircle,
                                    index <= 2 &&
                                    styles.progressCircleActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        index <= 2 &&
                                        styles.progressTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </View>

                            {index !== 3 && (
                                <View style={styles.progressLine} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🚀</Text>

                    <Text style={styles.title}>
                        Create your{"\n"}first project
                    </Text>

                    <Text style={styles.subtitle}>
                        Start building your workspace
                        and collaborating with others.
                    </Text>
                </View>

                {/* Project Name */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Project Name
                    </Text>

                    <TextInput
                        placeholder="Acme SaaS"
                        placeholderTextColor="#666"
                        value={data.projectName}
                        onChangeText={(text) =>
                            setData((prev) => ({
                                ...prev,
                                projectName: text,
                            }))
                        }
                        style={styles.input}
                    />
                </View>

                {/* Status */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Project Stage
                    </Text>

                    <Text style={styles.helper}>
                        Helps people understand where
                        your project currently stands.
                    </Text>
                </View>

                {/* Stage Grid */}
                <FlatList
                    data={PROJECT_STAGES}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{
                        gap: 14,
                    }}
                    contentContainerStyle={{
                        gap: 14,
                        paddingBottom: 20,
                        margin:10,
                    }}
                    renderItem={({ item }) => {
                        const isSelected =
                            data.projectStage ===
                            item.id;

                        return (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        projectStage: item.id,
                                    }))
                                }
                                style={[
                                    styles.stageCard,
                                    isSelected &&
                                    styles.stageCardActive,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        isSelected &&
                                        styles.iconWrapperActive,
                                    ]}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={24}
                                        color={
                                            isSelected
                                                ? "#000"
                                                : "#fff"
                                        }
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.stageText,
                                        isSelected &&
                                        styles.stageTextActive,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#aaa"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleContinue}
                        style={styles.continueButton}
                    >
                        <Text style={styles.continueText}>
                            Continue
                        </Text>

                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearBackgroundProvider>
    );
};

export default DefineProject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    progressWrapper: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        marginBottom: 40,
    },

    progressItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    progressCircle: {
        width: 32,
        height: 32,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#444",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.03)",
    },

    progressCircleActive: {
        backgroundColor: "white",
        borderColor: "white",
    },

    progressText: {
        color: "#777",
        fontSize: 13,
        fontWeight: "600",
    },

    progressTextActive: {
        color: "black",
    },

    progressLine: {
        width: 28,
        height: 1,
        backgroundColor: "#444",
        marginHorizontal: 6,
    },

    header: {
        marginBottom: 34,
    },

    emoji: {
        fontSize: 34,
        marginBottom: 14,
    },

    title: {
        color: "white",
        fontSize: 34,
        fontWeight: "700",
        lineHeight: 42,
    },

    subtitle: {
        color: "#9B9B9B",
        fontSize: 15,
        lineHeight: 24,
        marginTop: 12,
    },

    section: {
        marginBottom: 18,
    },

    label: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
    },

    helper: {
        color: "#777",
        fontSize: 13,
        lineHeight: 20,
    },

    input: {
        height: 58,
        borderRadius: 18,
        paddingHorizontal: 18,
        color: "white",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        fontSize: 15,
    },

    stageCard: {
        flex: 1,
        minHeight: 120,
        borderRadius: 24,
        padding: 18,
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    stageCardActive: {
        backgroundColor: "rgba(255,255,255,0.09)",
        borderColor: "rgba(255,255,255,0.35)",
        transform: [{ scale: 1.02 }],
    },

    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    iconWrapperActive: {
        backgroundColor: "white",
    },

    stageText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    stageTextActive: {
        color: "white",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 26,
        paddingTop: 12,
    },

    backButton: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    continueButton: {
        height: 54,
        borderRadius: 18,
        paddingHorizontal: 22,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    continueText: {
        color: "black",
        fontSize: 15,
        fontWeight: "700",
    },
});