import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import { useOnboarding } from "@/context/OnBoardingContext";

const goals = [
  {
    id: "team",
    title: "Team Collaboration",
    description: "Find and join teams to build together",
    icon: "people-outline",
  },
  {
    id: "discover",
    title: "Discover",
    description: "Explore projects and opportunities",
    icon: "compass-outline",
  },
  {
    id: "management",
    title: "Project Management",
    description: "Organize and track your workflow",
    icon: "grid-outline",
  },
  {
    id: "explore",
    title: "Just Exploring",
    description: "Discover what WeKraft offers",
    icon: "sparkles-outline",
  },
];

const Index = () => {
  const { data, setData } = useOnboarding();

  const selectedGoals = data.goals || [];

  const toggleGoal = (goalId: string) => {
    const exists = selectedGoals.includes(goalId);

    if (exists) {
      setData((prev: any) => ({
        ...prev,
        goals: selectedGoals.filter(
            (id: string) => id !== goalId
        ),
      }));
    } else {
      setData((prev: any) => ({
        ...prev,
        goals: [...selectedGoals, goalId],
      }));
    }
  };

  const handleContinue = () => {
    // if (selectedGoals.length === 0) {
    //   return Toast.show({
    //     type: "error",
    //     text1: "Select at least one option",
    //     position: "bottom",
    //   });
    // }

    router.push("/(onboarding)/identity");
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
                        index === 0 &&
                        styles.progressCircleActive,
                      ]}
                  >
                    <Text
                        style={[
                          styles.progressText,
                          index === 0 &&
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

          <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.emoji}>🚀</Text>

              <Text style={styles.title}>
                What brings{"\n"}you to WeKraft?
              </Text>

              <Text style={styles.subtitle}>
                Choose what you're here for.
                {"\n"}
                You can change this later.
              </Text>
            </View>

            {/* Cards */}
            <View style={styles.cardsContainer}>
              {goals.map((goal) => {
                const isSelected =
                    selectedGoals.includes(goal.id);

                return (
                    <TouchableOpacity
                        key={goal.id}
                        activeOpacity={0.85}
                        onPress={() =>
                            toggleGoal(goal.id)
                        }
                        style={[
                          styles.card,
                          isSelected && styles.cardActive,
                        ]}
                    >
                      <View
                          style={[
                            styles.iconContainer,
                            isSelected &&
                            styles.iconContainerActive,
                          ]}
                      >
                        <Ionicons
                            name={goal.icon as any}
                            size={22}
                            color={
                              isSelected
                                  ? "#000"
                                  : "#fff"
                            }
                        />
                      </View>

                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                          {goal.title}
                        </Text>

                        <Text
                            style={styles.cardDescription}
                        >
                          {goal.description}
                        </Text>
                      </View>

                      {isSelected && (
                          <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color="white"
                          />
                      )}
                    </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                style={styles.backButton}
            >
              <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#aaa"
              />
            </TouchableOpacity>

            <View style={styles.footerRight}>
              <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.skipButton}
                  onPress={handleContinue}
              >
                <Text style={styles.skipText}>
                  Skip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleContinue}
                  style={styles.continueButton}
              >
                <Text style={styles.continueText}>
                  Continue
                </Text>

                <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearBackgroundProvider>
  );
};

export default Index;

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

  content: {
    flexGrow: 1,
  },

  header: {
    marginBottom: 34,
  },

  emoji: {
    fontSize: 34,
    marginBottom: 16,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 42,
  },

  subtitle: {
    color: "#9A9A9A",
    fontSize: 15,
    marginTop: 14,
    lineHeight: 24,
  },

  cardsContainer: {
    gap: 14,
    marginHorizontal:10
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  cardActive: {
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.09)",
    transform: [{ scale: 1.02 }],
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainerActive: {
    backgroundColor: "white",
  },

  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },

  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  cardDescription: {
    color: "#A0A0A0",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 28,
    paddingTop: 14,
  },

  footerRight: {
    flexDirection: "row",
    gap: 12,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  skipButton: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  skipText: {
    color: "#D0D0D0",
    fontSize: 15,
    fontWeight: "500",
  },

  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 22,
  },

  continueText: {
    color: "black",
    fontSize: 15,
    fontWeight: "700",
  },
});