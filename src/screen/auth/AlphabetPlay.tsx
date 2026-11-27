import React, { FC, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { FONTS } from '../../constants/Fonts'
import { SAY_WORDS } from './sayWords'

const ease = Easing.out(Easing.quad)

export const RecordGame: FC<{word: string}> = ({word}) => {
  return (
    <View pointerEvents="none" style={styles.recordWrap}>
      <Ring delay={0} />
      <Ring delay={180} />
      <Ring delay={360} />
      <Text style={styles.recordWord}>{word}</Text>
    </View>
  )
}

const Ring: FC<{delay: number}> = ({delay}) => {
  const scale = useSharedValue(0.6)
  const opacity = useSharedValue(0.7)
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(1.8, {duration: 900, easing: ease}), -1, false),
    )
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, {duration: 900, easing: ease}), -1, false),
    )
  }, [delay, opacity, scale])
  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }))
  return <Animated.View style={[styles.ring, style]} />
}

export const LearnGame: FC<{index: number}> = ({index}) => {
  const current = SAY_WORDS[index]
  return (
    <View style={styles.learnRow}>
      <Bubble letter={current?.letter ?? 'A'} word={current?.word ?? 'apple'} />
      <Spark delay={0} left={18} />
      <Spark delay={200} left={250} />
      <Spark delay={400} left={140} />
    </View>
  )
}

const Bubble: FC<{letter: string; word: string}> = ({letter, word}) => {
  const bob = useSharedValue(0)
  const sway = useSharedValue(0)
  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-16, {duration: 420, easing: ease}),
        withTiming(0, {duration: 420, easing: ease}),
      ),
      -1,
      false,
    )
    sway.value = withRepeat(
      withSequence(withTiming(18, {duration: 560}), withTiming(-18, {duration: 560})),
      -1,
      true,
    )
  }, [bob, letter, sway])
  const style = useAnimatedStyle(() => ({
    transform: [{translateY: bob.value}, {translateX: sway.value}],
  }))
  return (
    <Animated.View style={[styles.bubble, style]}>
      <Text style={styles.popLetter}>{letter}</Text>
      <Text style={styles.bubbleWord}>{word}</Text>
    </Animated.View>
  )
}

const Spark: FC<{delay: number; left: number}> = ({delay, left}) => {
  const rise = useSharedValue(8)
  const opacity = useSharedValue(0)
  useEffect(() => {
    rise.value = withDelay(
      delay,
      withRepeat(withTiming(-28, {duration: 700, easing: ease}), -1, false),
    )
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, {duration: 180}), withTiming(0, {duration: 520})),
        -1,
        false,
      ),
    )
  }, [delay, opacity, rise])
  const style = useAnimatedStyle(() => ({
    transform: [{translateY: rise.value}],
    opacity: opacity.value,
  }))
  return <Animated.Text style={[styles.spark, {left}, style]}>✦</Animated.Text>
}

const styles = StyleSheet.create({
  recordWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: '#FFE566',
  },
  recordWord: {
    fontFamily: FONTS.Black,
    fontSize: 42,
    color: '#FFFFFF',
    textShadowColor: 'rgba(30,78,121,0.35)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 6,
    textTransform: 'lowercase',
  },
  learnRow: {
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    minWidth: 92,
    borderRadius: 28,
    backgroundColor: '#FFE566',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubbleWord: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: '#3A2E12',
  },
  spark: {
    position: 'absolute',
    fontSize: 18,
    color: '#FFFFFF',
  },
  popLetter: {
    fontFamily: FONTS.Black,
    fontSize: 40,
    color: '#3A2E12',
  },
})
