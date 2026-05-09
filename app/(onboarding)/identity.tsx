import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useUser } from "@clerk/clerk-expo";

import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import { useOnboarding } from "@/context/OnBoardingContext";

const occupations = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Android Developer",
    "iOS Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Cybersecurity Engineer",
    "Machine Learning Engineer",
    "Game Developer",
];

const Identity = () => {
    const {
        data,
        setData,
    } = useOnboarding();

    const user = useUser();

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (
            user?.user?.username &&
            !data.username
        ) {
            setData((prev) => ({
                ...prev,
                username: user.user?.username || "",
            }));
        }
    }, [user]);

    const filteredOccupations = useMemo(() => {
        if (!search.trim()) {
            return occupations;
        }

        return occupations.filter((item) =>
            item
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    const handleContinue = () => {
        if (
            !data.username.trim() ||
            !data.occupation.trim()
        ) {
            return Toast.show({
                type: "error",
                text1: "Missing Information",
                text2:
                    "Username and occupation are required",
                position: "bottom",
            });
        }

        router.push("/(onboarding)/defineProject")
    };

    return (
        <LinearBackgroundProvider>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
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
                                    index <= 1 &&
                                    styles.progressCircleActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        index <= 1 &&
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
                    <Text style={styles.emoji}>✨</Text>

                    <Text style={styles.title}>
                        Create your{"\n"}identity
                    </Text>

                    <Text style={styles.subtitle}>
                        This is how people will discover
                        and collaborate with you.
                    </Text>
                </View>

                {/* Username */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Username
                    </Text>

                    <TextInput
                        value={data.username}
                        placeholder="e.g. sahildev"
                        placeholderTextColor="#666"
                        onChangeText={(text) =>
                            setData((prev) => ({
                                ...prev,
                                username: text,
                            }))
                        }
                        style={styles.input}
                    />
                </View>

                {/* Search */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Occupation
                    </Text>

                    <View style={styles.searchBox}>
                        <Ionicons
                            name="search-outline"
                            size={18}
                            color="#999"
                        />

                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search roles..."
                            placeholderTextColor="#666"
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Occupations */}
                <FlatList
                    data={filteredOccupations}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        styles.listContainer
                    }
                    renderItem={({ item }) => {
                        const isSelected =
                            data.occupation === item;

                        return (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        occupation: item,
                                    }))
                                }
                                style={[
                                    styles.roleCard,
                                    isSelected &&
                                    styles.roleCardActive,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.roleIcon,
                                        isSelected &&
                                        styles.roleIconActive,
                                    ]}
                                >
                                    <Ionicons
                                        name="code-slash-outline"
                                        size={18}
                                        color={
                                            isSelected
                                                ? "#000"
                                                : "#fff"
                                        }
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.roleText,
                                        isSelected &&
                                        styles.roleTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>

                                {isSelected && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={22}
                                        color="white"
                                    />
                                )}
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
            </KeyboardAvoidingView>
        </LinearBackgroundProvider>
    );
};

export default Identity;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    progressWrapper: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
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
        marginBottom: 32,
    },

    emoji: {
        fontSize: 34,
        marginBottom: 12,
    },

    title: {
        color: "white",
        fontSize: 36,
        fontWeight: "700",
        lineHeight: 44,
    },

    subtitle: {
        color: "#9B9B9B",
        fontSize: 15,
        lineHeight: 24,
        marginTop: 12,
    },

    section: {
        marginBottom: 20,
    },

    label: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
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

    searchBox: {
        height: 58,
        borderRadius: 18,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    searchInput: {
        flex: 1,
        color: "white",
        fontSize: 15,
    },

    listContainer: {
        paddingBottom: 20,
        gap: 12,
        marginHorizontal:10
    },

    roleCard: {
        minHeight: 76,
        borderRadius: 24,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    roleCardActive: {
        backgroundColor: "rgba(255,255,255,0.09)",
        borderColor: "rgba(255,255,255,0.35)",
        transform: [{ scale: 1.01 }],
    },

    roleIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
    },

    roleIconActive: {
        backgroundColor: "white",
    },

    roleText: {
        flex: 1,
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 14,
    },

    roleTextActive: {
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