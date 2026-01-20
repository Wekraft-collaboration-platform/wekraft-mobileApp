import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
// import MaskInput from "@/components/ui/MaskInput"
import FetchingRepoSkeleton from "@/components/SkeletonLayout/FetchingRepoSkeleton";
import { useOnboarding } from '@/context/OnBoardingContext'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'


const Index = () => {

  const user = useUser()
  const { data, setData } = useOnboarding()
  // const [data,setName] = useState("")

  return (
    <View style={style.container}>
      {/* Header and Body  Section */}
      <View style={style.headerContainer}>


        <Text style={style.headerText} >Identity</Text>


        <Text style={style.headerText2}>Establish Identity</Text>
        <Text style={[style.headerText, { fontSize: 16, marginTop: 5, textAlign: "left" }]}>
          Please provide your identity details to complete your onboarding process.
        </Text>


        <View style={style.userSection}>
          <Image source={{ uri: user.user?.imageUrl }} style={style.userImage} />
          <View>
            <Text style={[style.headerText2, { marginTop: 0, fontSize: 22 }]}>{user.user?.username}</Text>
            <Text style={[style.headerText, { fontSize: 22 }]}>{user.user?.emailAddresses[0].emailAddress}</Text>
          </View>

        </View>




        {/* Input Section */}


        {/* Form */}
        <View style={style.form}>
          <Text style={style.label}>OCCUPATION</Text>
          <View style={style.inputBox}>
            <TextInput
              placeholder="Select occupation"
              placeholderTextColor="#666"
              value={data.occupation}
              onChangeText={(q) =>
                setData((prev) => ({
                  ...prev,
                  occupation: q
                }))
              }
              keyboardType="default"
              style={style.phoneInput}
            />
          </View>

          <Text style={style.label}>PHONE NUMBER</Text>
          <View style={style.phoneRow}>
            <View style={style.codeBox}>
              <TextInput
                placeholder="+91"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={data.countryCode}
                onChangeText={(q) => {
                  setData((prev) => ({
                    ...prev,
                    countryCode: q
                  }))
                }}
                maxLength={4}
                style={style.codeInput}
              />

            </View>

            <View style={style.phoneBox}>
              <TextInput
                placeholder="555 000 0000"
                value={data.phoneNumber}
                onChangeText={(q) => {
                  setData((prev) => ({
                    ...prev,
                    phoneNumber: q
                  }))
                }}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                maxLength={10}
                style={style.phoneInput}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Footer Section */}

      <TouchableOpacity
        onPress={() => {
          if (!data.countryCode || !data.occupation || !data.phoneNumber || data.phoneNumber.length !== 10) {
            return (Toast.show({
              type: "error",
              text1: "Invalid Input",
              text2: "Please enter the input",
              visibilityTime: 2000,
              position: "bottom"
            }))
          }

          console.log("Identity Setup Complete Next Page routing")
          router.push("/(onboarding)/selectRepo")

        }}
        activeOpacity={0.7}
        style={style.cta}
      >


        <View className='flex-row w-full items-center justify-center gap-2'>

          <Text style={[style.ctaText]}>Continue</Text>
          <Ionicons name='arrow-forward' size={24} color='black' />
        </View>
      </TouchableOpacity>
    </View>
  )

}

export default Index


const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    color: "#A8ACB0",
    textAlign: "center"
  },

  cta: {
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  headerText2: {
    fontSize: 32,
    color: "white",
    fontWeight: "500",
    marginTop: 20
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    gap: 20
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 999
  },

  continueButton: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#222",
  },
  form: {
    // flex: 1,
  },


  inputBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },

  picker: {
    color: "white",
  },
  label: {
    color: "#6B6B6B",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },


  phoneRow: {
    flexDirection: "row",
    gap: 10,
  },

  codeBox: {
    width: 72,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    justifyContent: "center",
  },

  codeInput: {
    color: "white",
    textAlign: "center",
    paddingVertical: 14,
  },

  phoneBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },

  phoneInput: {
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  ctaText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },



})