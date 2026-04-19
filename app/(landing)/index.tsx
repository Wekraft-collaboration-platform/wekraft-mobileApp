import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const IMAGE_WIDTH = Math.min(width * 0.28, 120);
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.22;
const MARGIN = 10;
const ITEM_WIDTH = IMAGE_WIDTH + MARGIN;
const ROTATION_DEG = '-20deg';

const IMAGES_ALL = [
    require('../../assets/images/grid1.png'),
    require('../../assets/images/grid2.png'),
    require('../../assets/images/grid3.png'),
    require('../../assets/images/grid4.png'),
    require('../../assets/images/grid5.png'),
    require('../../assets/images/grid6.png'),
];

const ROW_BASE_1 = [...IMAGES_ALL, ...IMAGES_ALL];
const ROW_BASE_2 = [...IMAGES_ALL.slice().reverse(), ...IMAGES_ALL.slice().reverse()];
const ROW_BASE_3 = [
    IMAGES_ALL[1], IMAGES_ALL[3], IMAGES_ALL[5], IMAGES_ALL[0], IMAGES_ALL[2], IMAGES_ALL[4],
    IMAGES_ALL[1], IMAGES_ALL[3], IMAGES_ALL[5], IMAGES_ALL[0], IMAGES_ALL[2], IMAGES_ALL[4],
];

const Card3D = ({ img }: { img: any }) => (
    <View style={styles.cardOuter}>
        <View style={styles.imageWrapper}>
            <Image source={img} style={styles.image} resizeMode="cover" />
            <LinearGradient
                colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.04)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.45)']}
                style={[StyleSheet.absoluteFill, { top: '50%' }]}
            />
        </View>
        <View style={styles.cardRim} />
    </View>
);

const MarqueeRow = ({ images, duration, reverse = false }: {
    images: any[];
    duration: number;
    reverse?: boolean;
}) => {
    const translateX = useSharedValue(0);
    const singleSetWidth = images.length * ITEM_WIDTH;
    const tripleImages = useMemo(() => [...images, ...images, ...images], [images]);

    useEffect(() => {
        translateX.value = -singleSetWidth;
        translateX.value = withRepeat(
            withTiming(reverse ? 0 : -singleSetWidth * 2, {
                duration,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, [duration, reverse, singleSetWidth]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={styles.marqueeRowContainer}>
            <Animated.View style={[styles.marqueeInner, animatedStyle, { width: singleSetWidth * 3 }]}>
                {tripleImages.map((img, index) => (
                    <Card3D key={`${index}-${duration}`} img={img} />
                ))}
            </Animated.View>
        </View>
    );
};

export default function LandingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleGetStarted = () => {
        router.replace('/(auth)' as any);
    };

    const MARQUEE_HEIGHT = height * 0.60;
    const CONTENT_HEIGHT = height - MARQUEE_HEIGHT - insets.top;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Background pattern */}
            <ImageBackground
                source={require('../../assets/images/bg_pattern.png')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                imageStyle={{ opacity: 0.07, tintColor: '#FFFFFF' }}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', '#050505']}
                    style={StyleSheet.absoluteFill}
                />
            </ImageBackground>

            {/* === MARQUEE === */}
            <View style={[styles.marqueeContainer, { height: MARQUEE_HEIGHT }]}>
                <View style={styles.skewedWrapper}>
                    <MarqueeRow images={ROW_BASE_1} duration={50000} />
                    <MarqueeRow images={ROW_BASE_2} duration={65000} reverse />
                    <MarqueeRow images={ROW_BASE_3} duration={55000} />
                </View>

                {/* Fade to background */}
                <LinearGradient
                    colors={['transparent', 'rgba(5,5,5,0.5)', '#050505']}
                    style={styles.gradientOverlay}
                />
            </View>

            {/* === TEXT CONTENT === */}
            <View style={[styles.contentContainer, { height: CONTENT_HEIGHT }]}>
                <View style={styles.textSection}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Wekraft</Text>
                    <Text style={styles.subtitle}>
                        The platform for modern collaboration.
                    </Text>
                    <Text style={styles.description}>
                        Wekraft turns your GitHub activity into actionable{' '}
                        insights. From collaboration to project management{' '}
                        — build together, frictionless.
                    </Text>
                </View>
            </View>

            {/* === GET STARTED BUTTON — pinned to bottom === */}
            <View style={[styles.bottomButtonContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.85}
                >
                    <Text style={styles.nextButtonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },

    // -------- MARQUEE --------
    marqueeContainer: {
        overflow: 'hidden',
        position: 'relative',
    },
    skewedWrapper: {
        transform: [
            { rotate: ROTATION_DEG },
            { scale: 1.55 },
        ],
        width: width * 4,
        alignSelf: 'center',
        paddingTop: 14,
    },
    marqueeRowContainer: {
        marginBottom: MARGIN,
    },
    marqueeInner: {
        flexDirection: 'row',
    },

    // -------- 3D CARD --------
    cardOuter: {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        marginRight: MARGIN,
        position: 'relative',
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 14,
    },
    imageWrapper: {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    cardRim: {
        position: 'absolute',
        inset: 0,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderBottomColor: 'rgba(0,0,0,0.5)',
        borderRightColor: 'rgba(0,0,0,0.4)',
        pointerEvents: 'none',
    },

    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '42%',
    },

    // -------- CONTENT --------
    contentContainer: {
        paddingHorizontal: 28,
        justifyContent: 'flex-end',
        paddingBottom: 90,
    },
    textSection: {
        alignItems: 'center',
    },
    logoImage: {
        width: 56,
        height: 56,
        marginBottom: 12,
        borderRadius: 14,
    },
    title: {
        fontSize: height < 700 ? 36 : 46,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: height < 700 ? 40 : 52,
        marginBottom: 8,
        letterSpacing: -1.5,
    },
    subtitle: {
        fontSize: height < 700 ? 14 : 16,
        fontWeight: '600',
        color: '#AAAAAA',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.1,
    },
    description: {
        fontSize: height < 700 ? 13 : 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 21,
        paddingHorizontal: 8,
    },

    // -------- BOTTOM BUTTON --------
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 28,
        backgroundColor: 'transparent',
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 10,
    },
    nextButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});
