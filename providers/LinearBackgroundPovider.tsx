import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '@/constraints/Colors'

const LinearBackgroundPovider = ({ children }: { children: React.ReactNode }) => {
    return (
        <LinearGradient
            colors={[
                colors.LoginScreenGraidentStart,
                colors.LoginScreenGraidentEnd,
            ]}
            style={styles.container}>
            {children}
        </LinearGradient>

    )
}

export default LinearBackgroundPovider

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
    },
});