import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Clock, ShieldCheck } from 'lucide-react-native';

const UserProjectHealthEmptyState = () => {
    return (
        <View style= { styles.card } >
        {/* Glow blobs */ }
        < View style = { styles.blobTopRight } />
            <View style={ styles.blobBottomLeft } />

                < View style = { styles.content } >

                    {/* Icon */ }
                    < View style = { styles.visualContainer } >
                        <Heart size={ 32 } color = "#4ade80" fill = "rgba(74,222,128,0.12)" />
                            <View style={ styles.pulseRing } />
                                </View>

    {/* Badge */ }
    <View style={ styles.badge }>
        <Clock size={ 11 } color = "#a1a1aa" />
            <Text style={ styles.badgeText }> Pending Update </Text>
                </View>

    {/* Text */ }
    <View style={ styles.textStack }>
        <Text style={ styles.headline }> Health Score Not Available </Text>
            < Text style = { styles.description } >
                The project admin hasn't generated the health score yet.{'\n'}
                        Check back soon — it'll appear here once ready.
        </Text>
        </View>

        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#18181b',
        borderRadius: 20,
        padding: 28,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#27272a',
        position: 'relative',
        marginBottom: 16,
        minHeight: 300,
        justifyContent: 'center',
    },

    /* Blobs */
    blobTopRight: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(74,222,128,0.04)',
    },
    blobBottomLeft: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(74,222,128,0.03)',
    },

    content: {
        alignItems: 'center',
        zIndex: 1,
    },

    /* Icon */
    visualContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(74,222,128,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(74,222,128,0.15)',
    },
    pulseRing: {
        position: 'absolute',
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(74,222,128,0.25)',
        opacity: 0.5,
    },

    /* Badge */
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#27272a',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    badgeText: {
        color: '#a1a1aa',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    /* Text */
    textStack: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headline: {
        color: '#ffffff',
        fontSize: 19,
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
        paddingHorizontal: 8,
    },

    /* Info row */
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    infoText: {
        color: '#52525b',
        fontSize: 12,
        fontWeight: '500',
    },
    infoDot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#3f3f46',
    },

    /* Footer */
    footerNote: {
        backgroundColor: '#27272a',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#3f3f46',
        width: '100%',
    },
    footerText: {
        color: '#52525b',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default UserProjectHealthEmptyState;
