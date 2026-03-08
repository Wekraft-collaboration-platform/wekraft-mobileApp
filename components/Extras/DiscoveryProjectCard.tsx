import React, { memo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import {
    GitFork,
    Star,
    ArrowBigUp,
    User,
    Code2
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- UTILS ---
const formatCount = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

// --- COMPONENT ---
const DiscoveryProjectCard = memo(({ item , onPress}: { item: any , onPress:() =>void}) => {
    // Logic: Show max 3 tags, condense the rest
    const tags = item.tags || [];
    const displayTags = tags.slice(0, 3);
    const remainingCount = tags.length - 3;

    return (

        <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                onPress();
            }}
            style={styles.cardContainer}>


            {/* 1. VISUAL HEADER */}
            <View style={styles.thumbnailWrapper}>
                {item.thumbnailUrl ? (
                    <Image
                        source={{ uri: item.thumbnailUrl }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                ) : (
                    // Fallback if no image
                    <View style={[styles.thumbnail, styles.placeholderImage]}>
                        <Code2 size={40} color="#3F3F46" />
                    </View>
                )}

                {/* Floating Owner Badge (Professional Glassmorphism Look) */}
                <View style={styles.ownerBadge}>
                    <User size={12} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.ownerText}>@{item.repoOwner}</Text>
                </View>
            </View>

            {/* 2. CONTENT BODY */}
            <View style={styles.contentBody}>

                {/* Title Row */}
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.projectName}
                    </Text>
                </View>

                {/* Metrics Row - Clean & Minimal */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <Star size={14} color="#FBBF24" fill="#FBBF24" />
                        <Text style={styles.metricText}>{formatCount(item.projectStars)}</Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricItem}>
                        <GitFork size={14} color="#94A3B8" />
                        <Text style={styles.metricText}>{formatCount(item.projectForks)}</Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricItem}>
                        <ArrowBigUp size={16} color="#34D399" />
                        <Text style={styles.metricText}>{formatCount(item.projectUpvotes)}</Text>
                    </View>
                </View>

                {/* Description - Optimized Typography */}
                <Text style={styles.description} numberOfLines={3}>
                    {item.description || "No description provided for this project."}
                </Text>

                {/* Footer: Tags */}
                <View style={styles.footerRow}>
                    <View style={styles.tagsWrapper}>
                        {displayTags.map((tag: string, index: number) => (
                            <View key={index} style={styles.tagPill}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                        {remainingCount > 0 && (
                            <View style={[styles.tagPill, styles.moreTagPill]}>
                                <Text style={styles.moreTagText}>+{remainingCount}</Text>
                            </View>
                        )}
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
});

export default DiscoveryProjectCard;

// --- STYLESHEET ---
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#161616', // Zinc 950 (Darker, cleaner)
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#252525', // Zinc 800 (Subtle border)
        overflow: 'hidden',
        // Subtle shadow for depth
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    // --- IMAGE SECTION ---
    thumbnailWrapper: {
        height: 160,
        width: '100%',
        backgroundColor: '#27272A',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ownerBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent backdrop
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    ownerText: {
        color: '#F4F4F5',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },

    // --- CONTENT SECTION ---
    contentBody: {
        padding: 16,
    },

    // Typography: Title
    headerRow: {
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '600', // Bold but not heavy
        color: '#FFFFFF',
        letterSpacing: 1,

    },

    // Metrics Bar
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricText: {
        fontSize: 13,
        fontWeight: '600', // Semi-bold for numbers
        color: '#E4E4E7', // Zinc 200
        fontVariant: ['tabular-nums'], // Ensures numbers align vertically
    },
    metricDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#3F3F46', // Zinc 700
        marginHorizontal: 12,
    },

    // Typography: Description
    description: {
        color:"#717682",
        fontSize:14,
        letterSpacing:1,
        marginBottom:8
    },

    // Footer: Tags
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagPill: {
        backgroundColor: '#27272A', // Zinc 800
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#3F3F46',
    },
    tagText: {
        color: '#D4D4D8', // Zinc 300
        fontSize: 11,
        letterSpacing:1,
        fontWeight: '500',
    },
    moreTagPill: {
        backgroundColor: 'transparent',
        borderColor: '#3F3F46',
        borderStyle: 'dashed', // Distinguishes the "+N" badge
    },
    moreTagText: {
        color: '#71717A',
        fontSize: 11,
        fontWeight: '600',
    },
});


