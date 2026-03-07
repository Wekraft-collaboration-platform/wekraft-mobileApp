import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Activity, ShieldCheck, Zap,Heart } from 'lucide-react-native';
import Toast from "react-native-toast-message";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useLocalSearchParams} from "expo-router";
import {Id} from "@/convex/_generated/dataModel";

const AdminProjectHealthEmptyState = ({ stopNav }:{stopNav:()=>void}) => {
    return (
        <View style={styles.card}>
            {/* Background Decor (Subtle Grid or Shapes) */}
            {/*<View style={styles.accentCircle} />*/}

            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />
            

            <View style={styles.content}>
                <View style={styles.visualContainer}>
                    {/* Abstract Pulse Visual */}
                 <Heart size={36} color="#4ade80" fill="rgba(74,222,128,0.15)" />
                    <View style={styles.pulseRing} />
                </View>

                <View style={styles.textStack}>
                    <Text style={styles.headline}>No Health Score yet</Text>
                    <Text style={styles.description}>
                         Analyse your project across activity, code quality, and community engagement to generate a comprehensive health score.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={()=>{stopNav()}}
                    activeOpacity={0.7}
                >
                    <Heart size={18} color="#1e1e22" fill="#1e1e22" />
                    <Text style={styles.buttonText}>Calculate Health Score</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#18181b',
        borderRadius: 20,
        padding: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#3f3f46',
        position: 'relative',
        marginBottom:16,
        minHeight: 320,
        justifyContent: 'center',
    },
    accentCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(74, 222, 128, 0.03)', // Very faint green glow
    },
    content: {
        alignItems: 'center',
        zIndex: 1,
    },
    visualContainer: {
        marginBottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(74,222,128,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.4)',
        opacity: 0.5,
    },
    mainIcon: {
        zIndex: 2,
    },
    textStack: {
        alignItems: 'center',
        marginBottom: 28,
    },
     headline: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.4,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#71717a',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
        paddingHorizontal: 6,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#4ade80', // "Health" Green
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
        alignItems: 'center',
        width:"100%",
        gap: 8,
        justifyContent:"center",
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#1e1e22',
        fontSize: 16,
        fontWeight: '700',
    },

        blobTopRight: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(74,222,128,0.05)',
    },
    blobBottomLeft: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(74,222,128,0.04)',
    },
});

export default AdminProjectHealthEmptyState;