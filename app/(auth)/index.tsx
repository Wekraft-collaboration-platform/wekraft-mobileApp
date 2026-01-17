import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LinearBackgroundPovider from '@/providers/LinearBackgroundPovider'
import { Ionicons } from "@expo/vector-icons"

const Index = () => {


  const [loading, setLoading] = useState(false)
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

        <TouchableOpacity
          onPress={() => {

          }}
          style={style.githubButton}

          activeOpacity={0.7}
        >

          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-github" size={26} color="#fff" />
              <Text style={style.githubText}>Continue with GitHub</Text>
              <Ionicons name="arrow-forward" size={22} color="#71717a" />
            </>
          )}

        </TouchableOpacity>
        <Text style={style.terms}>By continuing you agree to our{"\n"}
          <Text style={style.termsText} >
            Terms of Service.
          </Text>
        </Text>


      </View>
    </LinearBackgroundPovider>
  )
}

export default Index

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