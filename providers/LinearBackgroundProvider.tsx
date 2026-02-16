import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '@/constraints/Colors'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'



type LinearBackgroundProviderProps = {
    children : React.ReactNode,
    isOn? :boolean,
}
const LinearBackgroundProvider = ({ children,isOn = true }: LinearBackgroundProviderProps) => {
    return (
        <LinearGradient
            colors={[
                colors.LoginScreenGraidentStart,
                colors.LoginScreenGraidentEnd,
            ]}
            style={{ flex: 1 }}>

            <SafeAreaProvider style={{ flex: 1 }}>
                <SafeAreaView style={[{ flex: 1 },isOn? {paddingHorizontal:24} : {paddingHorizontal: 0}]}>
                    {children}
                </SafeAreaView>

            </SafeAreaProvider>
        </LinearGradient>

    )
}

export default LinearBackgroundProvider
