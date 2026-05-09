import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Share,
} from "react-native";

import React, { useMemo, useState } from "react";

import * as Clipboard from "expo-clipboard";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import { useOnboarding } from "@/context/OnBoardingContext";

const Invite = () => {
  const {
    data,
    setData,
  } = useOnboarding();

  const updateUser = useMutation(
      api.users.updateUser
  );

  const [loading, setLoading] =
      useState(false);

  const inviteLink = useMemo(() => {
    const slug = data.projectName
        .toLowerCase()
        .replace(/\s+/g, "-");

    return `https://wekraft.app/invite/${slug}`;
  }, [data.projectName]);

  const copyInviteLink = async () => {
    await Clipboard.setStringAsync(inviteLink);

    Toast.show({
      type: "success",
      text1: "Invite link copied",
      position: "bottom",
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my project on WeKraft 🚀\n${inviteLink}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const completeSetup = async () => {
    try {
      setLoading(true);



      await updateUser({
        occupation: data.occupation,
        onboardingCompleted: true,
        primaryUsage: data.goals,
        name : data.username,

      });

      Toast.show({
        type: "success",
        text1: "Project setup complete",
        position: "bottom",
      });

      router.replace("/(tabs)");
    } catch (err) {
      console.log(err);

      Toast.show({
        type: "error",
        text1:
            "Failed to complete setup",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
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
                        styles.progressCircleActive,
                      ]}
                  >
                    <Text
                        style={[
                          styles.progressText,
                          styles.progressTextActive,
                        ]}
                    >
                      {item}
                    </Text>
                  </View>

                  {index !== 3 && (
                      <View
                          style={[
                            styles.progressLine,
                            styles.progressLineActive,
                          ]}
                      />
                  )}
                </View>
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🎉</Text>

            <Text style={styles.title}>
              Your project{"\n"}is ready
            </Text>

            <Text style={styles.subtitle}>
              Invite your friends or team
              members to start collaborating.
            </Text>
          </View>

          {/* Invite Link */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Invite Link
            </Text>

            <View style={styles.linkBox}>
              <TextInput
                  editable={false}
                  value={inviteLink}
                  style={styles.linkInput}
                  placeholderTextColor="#777"
              />

              <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={copyInviteLink}
                  style={styles.copyButton}
              >
                <Ionicons
                    name="copy-outline"
                    size={18}
                    color="#000"
                />

                <Text style={styles.copyText}>
                  Copy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Options */}
          <View style={styles.shareSection}>
            <View style={styles.shareDivider}>
              <View style={styles.divider} />

              <Text style={styles.shareText}>
                Share Via
              </Text>

              <View style={styles.divider} />
            </View>

            <View style={styles.shareRow}>
              <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleShare}
                  style={styles.shareCard}
              >
                <Ionicons
                    name="logo-whatsapp"
                    size={28}
                    color="#25D366"
                />

                <Text style={styles.shareLabel}>
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleShare}
                  style={styles.shareCard}
              >
                <Ionicons
                    name="logo-discord"
                    size={28}
                    color="#5865F2"
                />

                <Text style={styles.shareLabel}>
                  Discord
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleShare}
                  style={styles.shareCard}
              >
                <Ionicons
                    name="share-social-outline"
                    size={28}
                    color="#fff"
                />

                <Text style={styles.shareLabel}>
                  More
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
                disabled={loading}
                onPress={completeSetup}
                style={styles.continueButton}
            >
              {loading ? (
                  <ActivityIndicator
                      color="#000"
                  />
              ) : (
                  <>
                    <Text
                        style={styles.continueText}
                    >
                      Finish Setup
                    </Text>

                    <Ionicons
                        name="checkmark"
                        size={18}
                        color="#000"
                    />
                  </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearBackgroundProvider>
  );
};

export default Invite;

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

  progressLineActive: {
    backgroundColor: "white",
  },

  header: {
    marginBottom: 36,
  },

  emoji: {
    fontSize: 36,
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
    marginBottom: 28,
  },

  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 8,
  },

  linkInput: {
    flex: 1,
    color: "white",
    paddingHorizontal: 14,
    fontSize: 13,
  },

  copyButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  copyText: {
    color: "black",
    fontWeight: "600",
  },

  shareSection: {
    marginTop: 10,
  },

  shareDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#222",
  },

  shareText: {
    color: "#999",
    fontSize: 13,
  },

  shareRow: {
    flexDirection: "row",
    gap: 12,
  },

  shareCard: {
    flex: 1,
    height: 110,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  shareLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 28,
    paddingTop: 16,
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