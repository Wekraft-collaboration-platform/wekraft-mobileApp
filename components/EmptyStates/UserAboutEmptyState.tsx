import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const UserAboutEmptyState = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                backgroundColor: "#1e1e22",
                borderRadius: 12,
                marginBottom: 12,
                padding: 32, // Increased padding for a cleaner look
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#282a2a"
            }}>
                {/* Icon Container */}
                <View style={{
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "#282a2a",
                    borderRadius: 999,
                    backgroundColor: "#1C1D1D",
                    marginBottom: 16
                }}>
                    <Ionicons name="information-circle-outline" size={48} color="#4b4b4b" />
                </View>

                {/* Text Content */}
                <Text style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: 20,
                    marginBottom: 8,
                }}>
                    No Details Provided
                </Text>

                <Text style={{
                    color: "#a1a1a1", // Slightly dimmed text for user view
                    textAlign: "center",
                    fontSize: 14,
                    lineHeight: 20,
                    marginHorizontal: 20,
                }}>
                    The administrator hasn't added a description for this project yet.
                    Check back later for more information!
                </Text>

                {/* Subtle Decorative Element */}
                <View style={{
                    marginTop: 24,
                    height: 2,
                    width: 40,
                    backgroundColor: "#333",
                    borderRadius: 2
                }} />
            </View>
        </View>
    );
};

export default UserAboutEmptyState;