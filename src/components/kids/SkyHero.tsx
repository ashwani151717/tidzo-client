import React, { FC, useEffect } from 'react'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

const LOGO = require('../../assets/images/tidzo-logo.png')

const ease = Easing.inOut(Easing.sin)

type StarSpec = {
  top: number
  left?: number
  right?: number
  size: number
  color: string
  delay: number
  travel: number
}

const FULL_STARS: StarSpec[] = [
  {top: 18, left: 18, size: 18, color: '#FFE566', delay: 0, travel: 8},
  {top: 28, right: 22, size: 22, color: '#FFD6EA', delay: 160, travel: 10},
  {top: 96, left: 8, size: 14, color: '#FFFFFF', delay: 280, travel: 7},
  {top: 72, right: 6, size: 15, color: '#FFF4B0', delay: 80, travel: 9},
  {top: 168, left: 28, size: 13, color: '#C8FFE4', delay: 360, travel: 6},
  {top: 186, right: 34, size: 16, color: '#FFE566', delay: 220, travel: 8},
]

const COMPACT_STARS: StarSpec[] = [
  {top: 10, left: 14, size: 14, color: '#FFE566', delay: 0, travel: 6},
  {top: 16, right: 16, size: 16, color: '#FFD6EA', delay: 140, travel: 7},
  {top: 78, left: 22, size: 12, color: '#FFFFFF', delay: 240, travel: 5},
  {top: 86, right: 26, size: 13, color: '#C8FFE4', delay: 80, travel: 6},
]

type DriftProps = {
  delay?: number
  travel?: number
  duration?: number
  axis?: 'y' | 'x'
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

export const Drift: FC<DriftProps> = ({
  delay = 0,
  travel = 8,
  duration = 1600,
  axis = 'y',
  style,
  children,
}) => {
  const shift = useSharedValue(0)
  const opacity = useSharedValue(0.55)

  useEffect(() => {
    shift.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-travel, {duration, easing: ease}),
          withTiming(travel, {duration, easing: ease}),
        ),
        -1,
        true,
      ),
    )
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {duration: duration * 0.9, easing: ease}),
          withTiming(0.45, {duration: duration * 0.9, easing: ease}),
        ),
        -1,
        true,
      ),
    )
    return () => {
      cancelAnimation(shift)
      cancelAnimation(opacity)
    }
  }, [delay, duration, opacity, shift, travel])

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform:
      axis === 'x' ? [{translateX: shift.value}] : [{translateY: shift.value}],
  }))

  return <Animated.View style={[style, animated]}>{children}</Animated.View>
}

export const BobbingLogo: FC<{size: number}> = ({size}) => {
  const y = useSharedValue(0)
  const tilt = useSharedValue(0)

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-10, {duration: 1400, easing: ease}),
        withTiming(6, {duration: 1400, easing: ease}),
      ),
      -1,
      true,
    )
    tilt.value = withRepeat(
      withSequence(
        withTiming(-3.5, {duration: 1800, easing: ease}),
        withTiming(3.5, {duration: 1800, easing: ease}),
      ),
      -1,
      true,
    )
    return () => {
      cancelAnimation(y)
      cancelAnimation(tilt)
    }
  }, [tilt, y])

  const animated = useAnimatedStyle(() => ({
    transform: [{translateY: y.value}, {rotate: `${tilt.value}deg`}],
  }))

  return (
    <Animated.View style={animated}>
      <Image
        source={LOGO}
        resizeMode="contain"
        style={{width: size, height: size}}
      />
    </Animated.View>
  )
}

const Cloud: FC<{style?: ViewStyle}> = ({style}) => (
  <View style={[styles.cloud, style]}>
    <View style={styles.cloudPuffA} />
    <View style={styles.cloudPuffB} />
    <View style={styles.cloudPuffC} />
  </View>
)

type SkyHeroProps = {
  compact?: boolean
}

const SkyHero: FC<SkyHeroProps> = ({compact = false}) => {
  const sun = useSharedValue(1)
  const cloud = useSharedValue(0)

  useEffect(() => {
    sun.value = withRepeat(
      withSequence(
        withTiming(1.08, {duration: 1600, easing: ease}),
        withTiming(0.94, {duration: 1600, easing: ease}),
      ),
      -1,
      true,
    )
    cloud.value = withRepeat(
      withSequence(
        withTiming(16, {duration: 3200, easing: ease}),
        withTiming(-16, {duration: 3200, easing: ease}),
      ),
      -1,
      true,
    )
    return () => {
      cancelAnimation(sun)
      cancelAnimation(cloud)
    }
  }, [cloud, sun])

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{scale: sun.value}],
  }))
  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{translateX: cloud.value}],
  }))
  const cloudStyleLate = useAnimatedStyle(() => ({
    transform: [{translateX: -cloud.value}],
  }))

  const stars = compact ? COMPACT_STARS : FULL_STARS
  const logoSize = compact ? 112 : 158

  return (
    <View style={[styles.stage, compact && styles.stageCompact]}>
      <Animated.View style={[styles.sunHalo, compact && styles.sunHaloCompact, sunStyle]} />
      <Animated.View style={[styles.sun, compact && styles.sunCompact, sunStyle]} />

      <Animated.View style={[styles.cloudLeft, cloudStyle]}>
        <Cloud />
      </Animated.View>
      <Animated.View style={[styles.cloudRight, compact && styles.cloudRightCompact, cloudStyleLate]}>
        <Cloud />
      </Animated.View>

      {stars.map((star, index) => (
        <Drift
          key={`${star.top}-${index}`}
          delay={star.delay}
          travel={star.travel}
          duration={1500 + index * 120}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              right: star.right,
            },
          ]}>
          <Icon name="star" size={star.size} color={star.color} />
        </Drift>
      ))}

      {!compact ? (
        <>
          <Drift delay={100} travel={7} style={styles.ballPink}>
            <View style={[styles.ball, {backgroundColor: '#FF8FB8'}]} />
          </Drift>
          <Drift delay={260} travel={9} style={styles.ballMint}>
            <View style={[styles.ball, styles.ballSmall, {backgroundColor: '#7DFFC3'}]} />
          </Drift>
        </>
      ) : null}

      <View style={styles.logoSlot}>
        <BobbingLogo size={logoSize} />
      </View>
    </View>
  )
}

export default SkyHero

const styles = StyleSheet.create({
  stage: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCompact: {
    height: 176,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#5EBEFF',
    marginBottom: 18,
  },
  sunHalo: {
    position: 'absolute',
    top: 18,
    right: 28,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 225, 74, 0.35)',
  },
  sunHaloCompact: {
    width: 64,
    height: 64,
    borderRadius: 32,
    top: 8,
    right: 18,
  },
  sun: {
    position: 'absolute',
    top: 34,
    right: 44,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFE14A',
  },
  sunCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 20,
    right: 30,
  },
  cloud: {
    width: 74,
    height: 32,
  },
  cloudPuffA: {
    position: 'absolute',
    left: 8,
    bottom: 0,
    width: 58,
    height: 22,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  cloudPuffB: {
    position: 'absolute',
    left: 16,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cloudPuffC: {
    position: 'absolute',
    left: 34,
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cloudLeft: {
    position: 'absolute',
    top: 54,
    left: 12,
  },
  cloudRight: {
    position: 'absolute',
    top: 132,
    right: 8,
    opacity: 0.9,
  },
  cloudRightCompact: {
    top: 96,
  },
  star: {
    position: 'absolute',
  },
  ball: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  ballSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ballPink: {
    position: 'absolute',
    left: 26,
    bottom: 36,
  },
  ballMint: {
    position: 'absolute',
    right: 22,
    bottom: 48,
  },
  logoSlot: {
    shadowColor: '#134E86',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
})
