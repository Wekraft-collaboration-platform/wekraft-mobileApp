import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LinearBackgroundPovider from '@/providers/LinearBackgroundPovider'
import { Ionicons } from "@expo/vector-icons"
import { useSSO } from '@clerk/clerk-expo'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthTransition,setAuthTransitionState } from '@/queries/auth/useAuthTransition'


const Index = () => {

  const {data : authTransitionState} = useAuthTransition()
  const queryClient = useQueryClient()

  const {startSSOFlow} = useSSO()

  /**
   * Initiates GitHub OAuth login flow.
   * 
   * Key constraints:
   * - Prevents duplicate SSO requests
   * - Persists "in-progress" state to survive redirects
   * - Resets state on failure
   */
  const handleGithubSignIn = async ()=>{

    // Hard guard: do nothing if user is already authenticated
    // or an SSO flow is already running

    if(authTransitionState === "authenticated" || authTransitionState === "sso_in_progress") return
    try{
      
      // Persist SSO start state immediately
      // This prevents UI reset when Clerk redirects to OAuth callback
      setAuthTransitionState(queryClient,"sso_in_progress")
      console.log("Set to `sso_in_progress`")

      const {createdSessionId,setActive} = await startSSOFlow({
        strategy:"oauth_github"
      })

      if(!createdSessionId || !setActive){
        throw new Error("Github OAuth Failed")
      }

      await setActive({session : createdSessionId})


      // Login Succefully set teh authTransisiton to Authenticated
      setAuthTransitionState(queryClient,"authenticated")
      console.log("Set to `authenticated`")
    }catch(err){
      // On any failure, reset auth transition back to idle
      // This allows the user to retry login cleanly
      setAuthTransitionState(queryClient,"idle")
      console.log("Set to `idle`")
      console.log("LoginScreen/handleGithubSignIn : ",err)
    }
  }



  // Login Screen UI
  return (
    <LinearBackgroundPovider>
      <View className='flex-1'>


      {/* Hero Section */}
        <View className='justify-center items-center my-auto flex-1'>
          <Image style={style.icon} source={require("../../assets/images/we_kraft_icon.png")} />
          <Text style={[style.textStyle,{marginBottom:10}]}>WE KRAFT<Text style={[style.textStyle,{color:"#2D6DF1"}]}>.</Text></Text>
          <Text style={[
            style.textStyle,
             { fontSize: 54, textAlign: "center", lineHeight: 60 }
             ]}>Build Together</Text>
          <Text style={[
            style.textStyle, 
            { fontSize: 54, lineHeight: 60, textAlign: "center", color:"#94A3B8" }
            ]}>Ship Faster.</Text>

        </View>


      </View>

      
       {/* FooterSection */}
      <View style={style.footer}>

        <View style={style.divder} />
        <Text style={style.authLabel}>AUTHENTICATION</Text>

            {/* Github SignIn Buttons */}
        <TouchableOpacity
          onPress={() => {
            console.log("bUTTON pRESS")
            // if(loading) return
            if(authTransitionState ==="sso_in_progress") return
            // setLoading(true)
            handleGithubSignIn()
          }}
          style={style.githubButton}
          activeOpacity={0.7}
        >

          {authTransitionState==="sso_in_progress" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-github" size={26} color="#fff" />
              <Text style={style.githubText}>Continue with GitHub</Text>
              <Ionicons name="arrow-forward" size={22} color="#71717a" />
            </>
          )}

        </TouchableOpacity>
       

       {/* Terms ANd Condition */}
        <Text style={style.terms}>By continuing you agree to our{"\n"}
          <Text style={style.termsText} >
            Terms of Service.
          </Text>
        </Text>


      {/* 
        FULL-SCREEN LOADING OVERLAY
        Ensures user cannot interact during OAuth redirect phase.
      */}
      </View>
          {authTransitionState==="sso_in_progress" && (
            <View style={style.LoadingForeGround}>
              <ActivityIndicator size={"large"} color={"white"}/>
              </View>
          )}
    </LinearBackgroundPovider>
  )
}

export default Index



// STyle Sheet
const style = StyleSheet.create({
  header: {
    marginTop: 70
  },
  icon: {
    width: 100,
    height: 100,
    // marginHorizontal:"auto",
    marginBottom: 20
  },
  textStyle: {
    fontSize: 50,
    fontWeight: "800",
    color: "white",
    lineHeight: 76,
    // marginBottom:20,
  },

  LoadingForeGround:{
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
  footer: {
    marginBottom: 50,
    gap: 12,
    marginHorizontal: 20
  },
  divder: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#18181b"
  },
  authLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#a1a1aa",
    letterSpacing: 1.2
  },

  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  githubText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },

  terms: {
    color: "#3f3f46",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center"
  },
  termsText: {
    textDecorationLine: "underline",
  }

})