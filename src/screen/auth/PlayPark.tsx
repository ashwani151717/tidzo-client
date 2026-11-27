import React, { FC, useEffect, useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native'

const BIRD =
  'https://public.rive.app/community/runtime-files/2063-4080-flutter-puzzle-hack-project.riv'

type Props = {
  compact?: boolean
  fill?: boolean
}

const Cloud: FC<{top: number; width: number; duration: number; delay: number}> = ({
  top,
  width,
  duration,
  delay,
}) => {
  const drift = useSharedValue(-width)
  useEffect(() => {
    drift.value = withDelay(
      delay,
      withRepeat(withTiming(340, {duration, easing: Easing.linear}), -1, false),
    )
  }, [delay, drift, duration])
  const style = useAnimatedStyle(() => ({
    transform: [{translateX: drift.value}],
  }))
  return (
    <Animated.View style={[styles.cloud, {top, width}, style]}>
      <View style={[styles.puff, {width: width * 0.62, height: width * 0.38}]} />
      <View
        style={[
          styles.puff,
          {width: width * 0.46, height: width * 0.3, marginLeft: -width * 0.18, marginBottom: 4},
        ]}
      />
    </Animated.View>
  )
}

export const PlayPark: FC<Props> = ({compact, fill}) => {
  const riveRef = useRef<RiveRef>(null)

  const dance = () => {
    riveRef.current?.setInputState('birb', 'dance', true)
  }

  const lookUp = () => {
    riveRef.current?.fireState('birb', 'look up')
  }

  useEffect(() => {
    const start = setTimeout(dance, 500)
    const glance = setInterval(lookUp, 4600)
    return () => {
      clearTimeout(start)
      clearInterval(glance)
    }
  }, [])

  return (
    <Pressable
      onPress={lookUp}
      style={[styles.room, compact && styles.compact, fill && styles.fill]}
      accessibilityRole="image"
      accessibilityLabel="A cartoon bird dancing in the park">
      <LinearGradient
        colors={['#69C6FF', '#D7F3FF', '#E7FBE8']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.sunHalo} />
      <View style={styles.sun} />
      <Cloud top={18} width={54} duration={14000} delay={0} />
      <Cloud top={46} width={36} duration={18000} delay={2400} />
      <View style={styles.hill} />
      <View style={styles.hillFront} />
      <Rive
        ref={riveRef}
        url={BIRD}
        artboardName="birb"
        stateMachineName="birb"
        autoplay
        fit={Fit.Contain}
        alignment={Alignment.BottomCenter}
        onPlay={dance}
        style={styles.rive}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  room: {
    height: 220,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#D7F3FF',
  },
  compact: {
    height: 168,
    borderRadius: 20,
  },
  fill: {
    height: '100%',
    borderRadius: 0,
  },
  sunHalo: {
    position: 'absolute',
    top: -18,
    right: 18,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 214, 92, 0.35)',
  },
  sun: {
    position: 'absolute',
    top: 8,
    right: 42,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFE07A',
  },
  cloud: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  puff: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
  },
  hill: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -28,
    height: 78,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 80,
    backgroundColor: '#8ED98A',
  },
  hillFront: {
    position: 'absolute',
    left: -20,
    right: 40,
    bottom: -36,
    height: 64,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 140,
    backgroundColor: '#6BC56A',
  },
  rive: {
    width: '100%',
    height: '100%',
  },
})
