import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from "@expo/vector-icons";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// --- Geometry & Constants ---
const radius = 100;
const strokeWidth = 16;
const center = radius + strokeWidth;
const startAngle = Math.PI * 0.85; // Slightly wider horseshoe
const endAngle = Math.PI * 2.15;
const angleLength = endAngle - startAngle;
const arcLength = radius * angleLength;

const COLORS = {
  bg: "#18181b",
  card: "#27272a",
  border: "#27272a",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  // Dynamic colors
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
  track: "#2d2d30"
};

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + r * Math.cos(angle),
  y: cy + r * Math.sin(angle),
});

const getArcPath = () => {
  const start = polarToCartesian(center, center, radius, startAngle);
  const end = polarToCartesian(center, center, radius, endAngle);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;
};

export default function SemiCircle({ score = 87, openH ,reFresh,visibleRefresh = false,mode,refreshScore,}: { mode:String,score: number, openH: () => void , reFresh: () => void ,visibleRefresh:boolean,refreshScore : ()=>void}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Logic for dynamic feedback
  const getScoreData = (val: number) => {
    if (val >= 80) return { color: COLORS.success, label: 'Healthy', icon: 'shield-checkmark' };
    if (val >= 50) return { color: COLORS.warning, label: 'Moderate', icon: 'alert-circle' };
    return { color: COLORS.danger, label: 'Critical', icon: 'warning' };
  };

  const { color, label, icon } = getScoreData(score);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.min(score / 100, 1),
      duration: 1200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false, // SVG props don't support native driver in all RN versions
    }).start();
  }, [score]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [arcLength, 0],
  });

  return (
      <View style={styles.outerWrapper}>
          <Text style={[styles.footerTitle,{alignItems:"flex-start",width:"100%",fontSize: 20,letterSpacing : 1}]}>Project Health</Text>
        <View style={styles.chartContainer}>
          <View>

          <Svg width={center * 2} height={center * 2 + 20}>
            {/* Background Track */}
            <Path
                d={getArcPath()}
                stroke={COLORS.track}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
            />
            {/* Animated Progress */}
            <AnimatedPath
                d={getArcPath()}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={strokeDashoffset}
            />
          </Svg>
          </View>

          <View style={styles.centerLabel}>
            <Text style={styles.scoreValue}>{score}</Text>
            <View style={[styles.tag, { backgroundColor: `${color}20`, borderColor: color }]}>
              <Ionicons name={icon as any} size={12} color={color} style={{ marginRight: 4 }} />
              <Text style={[styles.tagText, { color }]}>{label.toUpperCase()}</Text>
            </View>
          </View>



        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Project Health Score</Text>
          <Text style={styles.footerSub}>Based on recent activity & maintenance</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.8}
                onPress={openH}
            >
              <Ionicons name="analytics" size={18} color="black" style={{marginRight: 8}} />
              <Text style={styles.primaryBtnText}>Health Breakdown</Text>
            </TouchableOpacity>


            {(visibleRefresh && mode==="admin") && (

            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}
            onPress={()=>{
              if(mode==="admin"){
                refreshScore()
              }
            }}
            >
              <Ionicons name="refresh" size={18} color={COLORS.textPrimary} />
              <Text style={[styles.primaryBtnText,{color: "white",marginStart:10}]}>Refresh Health Score</Text>
            </TouchableOpacity>
            )}


          </View>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: COLORS.bg,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    top: '27%',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: -4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: -60,
    width: '100%',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  footerSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.success, // Using health color or primary
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    width: "100%",
    height: 52,
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});