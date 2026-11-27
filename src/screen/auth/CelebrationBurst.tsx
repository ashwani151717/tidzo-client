import React, { FC, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import { FONTS } from '../../constants/Fonts'

const ROCKET_SOUND = require('../../assets/sounds/rocket.mp3')

const SPARK_COLORS = ['#FFE07A', '#FF5A36', '#FFFFFF', '#7DD3FC', '#F472B6', '#F3C04D']

const ROCKETS = [
  {delay: 40, x: -120, peak: -250, drift: 18, color: '#FF5A36'},
  {delay: 260, x: 90, peak: -290, drift: -14, color: '#7DD3FC'},
  {delay: 520, x: -20, peak: -220, drift: 8, color: '#F3C04D'},
  {delay: 820, x: 140, peak: -270, drift: -20, color: '#F472B6'},
  {delay: 1080, x: -150, peak: -240, drift: 16, color: '#FFFFFF'},
  {delay: 1360, x: 30, peak: -310, drift: -6, color: '#FF8A3D'},
]

const CRACKERS = [
  {delay: 180, x: -100, y: 210},
  {delay: 640, x: 120, y: 230},
  {delay: 980, x: -20, y: 190},
  {delay: 1500, x: 70, y: 220},
]

const STARS = [
  {top: 36, left: 28, size: 3},
  {top: 70, left: 90, size: 2},
  {top: 48, left: 180, size: 3},
  {top: 110, left: 240, size: 2},
  {top: 24, left: 300, size: 3},
  {top: 140, left: 40, size: 2},
  {top: 90, left: 320, size: 2},
]

type Props = {
  title: string
  detail: string
}

export const CelebrationBurst: FC<Props> = ({title, detail}) => {
  const pop = useSharedValue(0.6)

  useEffect(() => {
    pop.value = withDelay(180, withSpring(1, {damping: 8, stiffness: 150}))
  }, [pop])

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{scale: pop.value}],
  }))

  return (
    <View style={styles.fill} pointerEvents="auto">
      <Video
        source={ROCKET_SOUND}
        paused={false}
        volume={1}
        ignoreSilentSwitch="ignore"
        mixWithOthers="mix"
        disableFocus
        playInBackground={false}
        style={styles.sound}
      />
      <LinearGradient colors={['#07111F', '#1A1440', '#3A1D4A']} style={StyleSheet.absoluteFill} />
      {STARS.map((star, index) => (
        <View
          key={index}
          style={[styles.starDot, {top: star.top, left: star.left, width: star.size, height: star.size}]}
        />
      ))}
      {ROCKETS.map((rocket, index) => (
        <Rocket key={index} spec={rocket} />
      ))}
      {CRACKERS.map((cracker, index) => (
        <Cracker key={index} spec={cracker} />
      ))}
      <Animated.View style={[styles.badge, badgeStyle]}>
        <View style={styles.star}>
          <Icon name="star" size={28} color="#E0A51A" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </Animated.View>
    </View>
  )
}

const Rocket: FC<{spec: (typeof ROCKETS)[number]}> = ({spec}) => {
  const fly = useSharedValue(0)
  const boom = useSharedValue(0)

  useEffect(() => {
    fly.value = withDelay(
      spec.delay,
      withTiming(1, {duration: 720, easing: Easing.in(Easing.cubic)}),
    )
    boom.value = withDelay(
      spec.delay + 700,
      withTiming(1, {duration: 780, easing: Easing.out(Easing.quad)}),
    )
  }, [boom, fly, spec.delay])

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: fly.value > 0.02 && fly.value < 0.98 ? 1 : 0,
    transform: [
      {translateX: spec.x + spec.drift * fly.value},
      {translateY: 360 + (spec.peak - 360) * fly.value},
    ],
  }))

  return (
    <>
      {[0, 1, 2, 3, 4].map(index => (
        <Trail key={index} fly={fly} spec={spec} lag={(index + 1) * 0.07} />
      ))}
      <Animated.View style={[styles.rocket, bodyStyle]}>
        <View style={[styles.nose, {borderBottomColor: spec.color}]} />
        <View style={styles.body} />
        <View style={styles.flame} />
      </Animated.View>
      <Burst fly={boom} x={spec.x + spec.drift} y={spec.peak} color={spec.color} count={14} lift={36} />
    </>
  )
}

const Trail: FC<{
  fly: SharedValue<number>
  spec: (typeof ROCKETS)[number]
  lag: number
}> = ({fly, spec, lag}) => {
  const style = useAnimatedStyle(() => {
    const progress = Math.max(0, fly.value - lag)
    return {
      opacity: progress > 0.04 && fly.value < 1 ? 0.85 - lag : 0,
      transform: [
        {translateX: spec.x + spec.drift * progress},
        {translateY: 378 + (spec.peak - 360) * progress},
        {scale: 1 - lag},
      ],
    }
  })
  return <Animated.View style={[styles.trail, style]} />
}

const Cracker: FC<{spec: (typeof CRACKERS)[number]}> = ({spec}) => {
  const boom = useSharedValue(0)
  useEffect(() => {
    boom.value = withDelay(
      spec.delay,
      withTiming(1, {duration: 620, easing: Easing.out(Easing.quad)}),
    )
  }, [boom, spec.delay])

  const core = useAnimatedStyle(() => ({
    opacity: boom.value < 0.25 ? boom.value * 4 : 1 - boom.value,
    transform: [
      {translateX: spec.x},
      {translateY: spec.y},
      {scale: 0.4 + boom.value * 1.4},
    ],
  }))

  return (
    <>
      <Animated.View style={[styles.crackerCore, core]} />
      <Burst fly={boom} x={spec.x} y={spec.y} color="#FF5A36" count={12} lift={-10} />
    </>
  )
}

const Burst: FC<{
  fly: SharedValue<number>
  x: number
  y: number
  color: string
  count: number
  lift: number
}> = ({fly, x, y, color, count, lift}) => (
  <>
    {Array.from({length: count}, (_, index) => {
      const angle = (Math.PI * 2 * index) / count + (index % 2) * 0.2
      const dist = 46 + (index % 4) * 18
      return (
        <Spark
          key={index}
          fly={fly}
          x={x}
          y={y}
          angle={angle}
          dist={dist}
          lift={lift}
          color={index % 3 === 0 ? '#FFFFFF' : index % 2 === 0 ? color : SPARK_COLORS[index % SPARK_COLORS.length]}
        />
      )
    })}
  </>
)

const Spark: FC<{
  fly: SharedValue<number>
  x: number
  y: number
  angle: number
  dist: number
  lift: number
  color: string
}> = ({fly, x, y, angle, dist, lift, color}) => {
  const style = useAnimatedStyle(() => {
    const progress = fly.value
    return {
      opacity: progress <= 0 ? 0 : 1 - progress * 0.9,
      transform: [
        {translateX: x + Math.cos(angle) * dist * progress},
        {translateY: y + Math.sin(angle) * dist * progress + progress * progress * lift},
        {scale: progress < 0.15 ? progress * 6 : 1.15 - progress * 0.7},
      ],
    }
  })
  return <Animated.View style={[styles.spark, {backgroundColor: color}, style]} />
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#07111F',
  },
  sound: {
    width: 0,
    height: 0,
  },
  starDot: {
    position: 'absolute',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  rocket: {
    position: 'absolute',
    alignItems: 'center',
  },
  nose: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  body: {
    width: 10,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#F4F1EA',
  },
  flame: {
    width: 8,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#FFB703',
    marginTop: -2,
  },
  trail: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF8A3D',
  },
  crackerCore: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFE07A',
  },
  spark: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge: {
    width: 230,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  star: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF4CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#1C1917',
  },
  detail: {
    marginTop: 4,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#6F675E',
    textAlign: 'center',
  },
})
