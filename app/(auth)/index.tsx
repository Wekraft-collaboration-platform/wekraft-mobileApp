import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, FlatList, Platform, ViewToken } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  SharedValue
} from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons"
import { useSSO } from '@clerk/clerk-expo'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthTransition, setAuthTransitionState } from '@/queries/auth/useAuthTransition'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window');

// Back ground color for the first card in top 
const BRAND_COLOR = '#0c0220';


// Calculating the exact curve offset to slice evenly across the UI components, using a 7:4 ratio
const CURVE_OFFSET = height * (6 / 11);
const CIRCLE_SIZE = width * 3;
const circleTop = -(CIRCLE_SIZE - CURVE_OFFSET);



// Data representing the Wekraft specific adaptations
const ONBOARDING_DATA = [
  {
    id: '1',
    text: 'We know you have great ideas, but how quickly can you find the right team to build them?',
    image: require('../../assets/images/ideaauth.png'),
  },
  {
    id: '2',
    text: 'Choose your collaborators and flexibly manage your whole project with modern tracking tools.',
    image: require('../../assets/images/teamauth.png'),
  },
  {
    id: '3',
    text: 'Connects with GitHub to track everything. Find yourself on the leaderboard among your team.',
    image: require('../../assets/images/authimg3.png'),
  }
];




// Create a large repeated list for infinite scrolling effect
const INFINITE_DATA = Array(100).fill(ONBOARDING_DATA).flat().map((item, index) => ({
  ...item,
  uniqueId: `${item.id}-${index}`
}));
const INITIAL_INDEX = ONBOARDING_DATA.length * 50;

// Sub-component for each onboarding card to handle its own animations correctly
interface OnboardingItemProps {
  item: typeof ONBOARDING_DATA[0];
  index: number;
  scrollX: SharedValue<number>;
}

// Sub-component for each onboarding card to handle its own animations correctly
const OnboardingItem = ({ item, index, scrollX }: OnboardingItemProps) => {
  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      // scrollX.value is the current scroll position
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.8, 1, 0.8],
      'clamp'
    );
    // opacity of the image
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.4, 1, 0.4],
      'clamp'
    );
    // translateY of the image
    const translateY = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [40, 0, 40],
      'clamp'
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });


  // Sub-component for each onboarding card to handle its own animations correctly
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      // scrollX.value is the current scroll position
      scrollX.value,
      [(index - 0.5) * width, index * width, (index + 0.5) * width],
      [0, 1, 0],
      'clamp'
    );
    // translateY of the text
    const translateY = interpolate(
      scrollX.value,
      [(index - 0.5) * width, index * width, (index + 0.5) * width],
      [20, 0, 20],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });



  // Main component
  return (
    // View for each onboarding card
    <View style={{ width, height: '100%' }}>
      <View style={{ height: CURVE_OFFSET, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Animated.View style={[{ marginBottom: -120 }, animatedImageStyle]}>
          <Image
            source={item.image}
            style={{ width: 340, height: 280 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
      <Animated.View style={[{ height: height - CURVE_OFFSET, alignItems: 'center', paddingTop: 100, paddingHorizontal: 35 }, animatedTextStyle]}>
        <Text style={{ fontSize: 16, color: '#52525B', textAlign: 'center', lineHeight: 24, fontWeight: '500' }}>
          {item.text}
        </Text>
      </Animated.View>
    </View>
  );
};


// Main Component
const Index = () => {
  const { data: authTransitionState } = useAuthTransition()
  const queryClient = useQueryClient()
  const { startSSOFlow } = useSSO()

  // Paging Ref & Logic
  const flatListRef = useAnimatedRef<any>();
  const scrollX = useSharedValue(INITIAL_INDEX * width);
  const [realIndex, setRealIndex] = useState(INITIAL_INDEX);

  // Auto-scroll logic (always going forward)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = realIndex + 1;

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [realIndex]);

  // Scroll handler for the flatlist
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Viewable items changed handler for the flatlist
  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      setRealIndex(viewableItems[0].index);
    }
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Github Sign In Logic
  const handleGithubSignIn = async () => {
    if (authTransitionState === "authenticated" || authTransitionState === "sso_in_progress") return
    try {
      setAuthTransitionState(queryClient, "sso_in_progress")

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_github"
      })

      if (!createdSessionId || !setActive) {
        throw new Error("Github OAuth Failed")
      }

      await setActive({ session: createdSessionId })
      setAuthTransitionState(queryClient, "authenticated")
    } catch (err) {
      setAuthTransitionState(queryClient, "idle")
      console.error("LoginScreen/handleGithubSignIn:", err)
    }
  }




  return (
    <View style={style.container}>
      <StatusBar style="light" />

      {/* The Dynamic Bottom Curve Top Component */}
      <View style={{
        position: 'absolute',
        top: circleTop,
        left: -width,
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: BRAND_COLOR,
      }} />


      {/* Absolute Logo Header simulating `::raty` */}
      <SafeAreaView style={{ position: 'absolute', width: '100%', alignItems: 'center', top: Platform.OS === 'ios' ? 90 : 150, zIndex: 10 }} pointerEvents="none">
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../assets/images/we_kraft_icon.png')}
            style={{ width: 60, height: 60, marginBottom: 4 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 44, fontWeight: '700', color: 'white', letterSpacing: 1.5 }}>wekraft</Text>
        </View>
      </SafeAreaView>

      {/* Swipeable Paging Content */}
      <Animated.FlatList
        ref={flatListRef}
        data={INFINITE_DATA}
        keyExtractor={(item) => item.uniqueId}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={INITIAL_INDEX}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item, index }) => (
          <OnboardingItem
            item={item}
            index={index}
            scrollX={scrollX}
          />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />

      {/* Pagination Dot Indicators (Modulo for Looping) */}
      <View style={{ position: 'absolute', bottom: Platform.OS === 'ios' ? 120 : 190, flexDirection: 'row', alignSelf: 'center' }}>
        {ONBOARDING_DATA.map((_, i) => {
          const isActive = (realIndex % ONBOARDING_DATA.length) === i;
          return (
            <View key={i} style={{
              width: isActive ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: isActive ? '#71717A' : '#E4E4E7',
              marginHorizontal: 4
            }} />
          );
        })}
      </View>

      {/* Absolute Locked Persistent Login Action */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 80 : 45,
        paddingTop: 80,
      }}>
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(217, 210, 231, 0.85)', '#2b2929ff']}
          style={StyleSheet.absoluteFill}
        />
        {/* Github Sign In Button */}
        <TouchableOpacity
          onPress={() => {
            if (authTransitionState === "sso_in_progress") return;
            handleGithubSignIn();
          }}
          style={{
            backgroundColor: '#1f122bff',
            width: width * 0.85,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000000ff',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }}
          activeOpacity={0.9}
        >
          {authTransitionState === "sso_in_progress" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="logo-github" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>Continue with GitHub</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Terms and Privacy Policy Text */}
        <Text style={{ color: '#e4e8f0ff', fontSize: 12, textAlign: 'center', lineHeight: 18 }}>
          By pressing "Continue with GitHub" you agree{"\n"}to our{" "}
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Terms of Service</Text> and{" "}
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Privacy Policy</Text>
        </Text>
      </View>

      {/* Loading Foreground */}
      {authTransitionState === "sso_in_progress" && (
        <View style={style.LoadingForeGround}>
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
    </View>
  )
}


// Styles
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
})

export default Index