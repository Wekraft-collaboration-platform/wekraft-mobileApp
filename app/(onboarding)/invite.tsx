import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useOnboarding } from '@/context/OnBoardingContext'
import { FetchRepoColbarator } from "@/queries/repo/repoColbarator"
import { uriToArrayBuffer, getContentType } from '@/components/Helper/helper'
const Invite = () => {
  // const completeOnBoarding = useMutation(api.users.completeOnboarding)
  const uploadThumbnial = useAction(api.thumbnail.uploadThumbnail)
  const createRepo = useMutation(api.repos.createRepository)
  const createProject = useMutation(api.projects.create)
  const updateUser = useMutation(api.users.updateUser)

  const [invite, setInvite] = useState("")
  const { data, setData } = useOnboarding()
  const [settingUp, setSettingUp] = useState(false);
  const {
    data: collaborators,
    isLoading,
    error } = FetchRepoColbarator(data.selctedrepo?.ownerLogin!, data.selctedrepo?.name!)

  return (

    <View
      className='flex-1'
    >

      {/* Headers */}
      <View className={"flex-row w-full justify-center items-center"}>
        <TouchableOpacity
          activeOpacity={0.7}
          className='absolute left-0 top-0'
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={30} color="white" />

        </TouchableOpacity>
        <Text style={styles.headerText}>Collaboration</Text>

        <TouchableOpacity className='absolute right-0 top-0'>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Invite collaborators</Text>
        <Text style={styles.subtitle}>
          Add teammates to collaborate on this project.
        </Text>
      </View>

      {/* Invite */}
      <View style={styles.inviteRow}>
        <TextInput
          value={invite}
          onChangeText={setInvite}
          placeholder="colleague@email.com"
          placeholderTextColor="#777"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inviteInput}
        />

        <TouchableOpacity style={styles.inviteBtn}>
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      </View>

      {/* Members */}
      <View style={styles.membersBlock}>
        <Text style={styles.membersTitle}>Members</Text>

        {/* Owner */}
        <View style={styles.memberRow}>
          <Image
            source={{ uri: data.selctedrepo?.ownerAvatar }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.memberName}>{data.selctedrepo?.ownerLogin}</Text>
            <Text style={styles.memberRole}>Owner</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Collaborators */}
        {isLoading && (
          <Text style={styles.muted}>Loading collaborators…</Text>
        )}

        {error && (
          <Text style={styles.error}>{error.message}</Text>
        )}

        {!isLoading && collaborators?.length === 0 && (
          <Text style={styles.muted}>No collaborators</Text>
        )}

        {collaborators?.map(c => (
          <View key={c.id} style={styles.memberRow}>
            <Image
              source={{ uri: c.avatar_url }}
              style={styles.avatarSmall}
            />
            <View>
              <Text style={styles.memberName}>{c.login}</Text>
              <Text style={styles.memberRole}>Collaborator</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CompleteSetup Setup */}
      <TouchableOpacity
        style={styles.cta}
        onPress={async () => {

          try {
            setSettingUp(true);


            let thumbnail: string | undefined;

            if (data.thumbnailUrl) {
              const buffer = await uriToArrayBuffer(data.thumbnailUrl);

              const fileName =
                data.thumbnailUrl.split("/").pop() ?? "thumbnail.png";

              const result = await uploadThumbnial({
                fileName,
                contentType: getContentType(data.thumbnailUrl),
                fileData: buffer,
              });
              console.log("The images is uploaded: ", result.url)

              thumbnail = result.url
            }


            const repoId = await createRepo({
              name: data.selctedrepo?.name!,
              owner: data.selctedrepo?.ownerLogin!,
              fullName: data.selctedrepo?.full_name!,
              url: data.selctedrepo?.html_url!,
              githubId: BigInt(data.selctedrepo?.id!),
            })

            const projectId = await createProject({
              thumbnailUrl: thumbnail,
              projectName: data.selctedrepo?.name!,
              description: data.projectdescription,
              tags: data.tags,
              isPublic: data.isPublic,
              repoName: data.selctedrepo?.name!,
              repoFullName: data.selctedrepo?.full_name!,
              repoOwner: data.selctedrepo?.ownerLogin!,
              repoUrl: data.selctedrepo?.html_url!,
              repositoryId: repoId.repositoryId,
            })

            await updateUser({
              occupation: data.occupation,
              phoneNumber: data.phoneNumber,
              countryCode: data.countryCode,
              onboardingCompleted: true,
            });

          } catch (err) {
            console.log("Error in saving the data: ", err)
            Alert.alert("Error", "Failed to save project")
          }
          finally {
            setSettingUp(false);
          }

        }}
      >
        <Text style={styles.ctaText}>Complete setup</Text>
        <Ionicons name="arrow-forward" size={18} color="black" />
      </TouchableOpacity>


      {/* <SetupLoadingScreen visible={settingUp} /> */}

      {settingUp && (
        <View style={styles.LoadingForeGround}>
          <ActivityIndicator size={"large"} color={"white"} />
          <Text style={styles.LoadingText}>Setting up your project...</Text>
        </View>
      )}
    </View>
  )
}

export default Invite



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    left: 0,
    padding: 8,
  },

  skipBtn: {
    position: "absolute",
    right: 0,
    padding: 8,
  },

  skipText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  headerText: {
    fontSize: 24,
    color: "#A8ACB0",
    textAlign: "center"
  },

  titleBlock: {
    marginTop: 16,
    marginBottom: 24,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },

  subtitle: {
    color: "#8B8B8B",
    fontSize: 15,
    marginTop: 6,
    maxWidth: 300,
  },

  inviteRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },

  inviteInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
  },

  inviteBtn: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  inviteText: {
    color: "white",
    fontWeight: "500",
  },

  membersBlock: {
    flex: 1,
  },

  membersTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  memberName: {
    color: "white",
    fontSize: 15,
  },

  memberRole: {
    color: "#8B8B8B",
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 12,
  },

  muted: {
    color: "#777",
    marginTop: 8,
  },

  error: {
    color: "#EF4444",
    marginTop: 8,
  },

  cta: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  ctaText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },

  LoadingForeGround: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  LoadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  }
});
