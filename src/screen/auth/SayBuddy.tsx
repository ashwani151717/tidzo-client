import React, { FC, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Ellipse, Path } from 'react-native-svg'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { FONTS } from '../../constants/Fonts'

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse)

export type BuddyMode = 'idle' | 'talk' | 'listen' | 'happy' | 'try'

type SayBuddyProps = {
  mode: BuddyMode
}

const ease = Easing.inOut(Easing.sin)

export const SayBuddy: FC<SayBuddyProps> = ({mode}) => {
  const bob = useSharedValue(0)
  const mouth = useSharedValue(5)
  const tilt = useSharedValue(0)
  const shake = useSharedValue(0)

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-8, {duration: mode === 'happy' ? 280 : 700, easing: ease}),
        withTiming(0, {duration: mode === 'happy' ? 280 : 700, easing: ease}),
      ),
      -1,
      false,
    )
    return () => cancelAnimation(bob)
  }, [bob, mode])

  useEffect(() => {
    if (mode === 'talk') {
      mouth.value = withRepeat(
        withSequence(
          withTiming(15, {duration: 140}),
          withTiming(4, {duration: 120}),
        ),
        -1,
        false,
      )
      tilt.value = withRepeat(
        withSequence(
          withTiming(-6, {duration: 280}),
          withTiming(6, {duration: 280}),
        ),
        -1,
        true,
      )
      return () => {
        cancelAnimation(mouth)
        cancelAnimation(tilt)
      }
    }
    cancelAnimation(tilt)
    tilt.value = withTiming(mode === 'listen' ? 8 : 0, {duration: 220})
    mouth.value = withTiming(mode === 'happy' ? 12 : mode === 'try' ? 3 : 6, {duration: 180})
    return () => cancelAnimation(mouth)
  }, [mode, mouth, tilt])

  useEffect(() => {
    if (mode !== 'try') {
      shake.value = withTiming(0, {duration: 120})
      return
    }
    shake.value = withSequence(
      withTiming(-10, {duration: 60}),
      withTiming(10, {duration: 60}),
      withTiming(-8, {duration: 60}),
      withTiming(8, {duration: 60}),
      withTiming(0, {duration: 60}),
    )
  }, [mode, shake])

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: bob.value},
      {translateX: shake.value},
      {rotate: `${tilt.value}deg`},
    ],
  }))

  const mouthProps = useAnimatedProps(() => ({
    ry: mouth.value,
  }))

  return (
    <Animated.View style={[styles.buddy, bodyStyle]}>
      <Svg width={150} height={176} viewBox="0 0 150 176">
        <Ellipse cx={75} cy={166} rx={32} ry={7} fill="rgba(30,78,121,0.16)" />
        <Path d="M58 118h12v34a6 6 0 0 1-12 0v-34z" fill="#FFD7B5" />
        <Path d="M80 118h12v34a6 6 0 0 1-12 0v-34z" fill="#FFD7B5" />
        <Ellipse cx={62} cy={154} rx={11} ry={6} fill="#3A2E12" />
        <Ellipse cx={88} cy={154} rx={11} ry={6} fill="#3A2E12" />
        <Path d="M46 124c2-26 14-40 29-40s27 14 29 40v8H46v-8z" fill="#3DB7FF" />
        <Path d="M64 104h22v10H64z" fill="#F3C04D" />
        <Path d="M28 108c-2 16 2 28 8 34" stroke="#FFD7B5" strokeWidth={11} strokeLinecap="round" />
        <Path d="M122 108c2 16-2 28-8 34" stroke="#FFD7B5" strokeWidth={11} strokeLinecap="round" />
        <Circle cx={75} cy={68} r={32} fill="#FFD7B5" />
        <Path d="M46 66c1-26 14-40 29-40s28 14 29 40c-8-16-18-22-29-22S54 50 46 66z" fill="#3A2E12" />
        <Circle cx={64} cy={70} r={6} fill="#FFFFFF" />
        <Circle cx={86} cy={70} r={6} fill="#FFFFFF" />
        <Circle cx={65} cy={71} r={2.8} fill="#1C1917" />
        <Circle cx={87} cy={71} r={2.8} fill="#1C1917" />
        <Circle cx={54} cy={80} r={4.5} fill="#FFB4C8" />
        <Circle cx={96} cy={80} r={4.5} fill="#FFB4C8" />
        <AnimatedEllipse animatedProps={mouthProps} cx={75} cy={88} rx={8} fill="#E25B73" />
      </Svg>
      {mode === 'talk' ? <SoundPips /> : null}
    </Animated.View>
  )
}

const SoundPips = () => {
  return (
    <View style={styles.pips} pointerEvents="none">
      {[0, 1, 2].map(pip => (
        <Pip key={pip} delay={pip * 120} />
      ))}
    </View>
  )
}

const Pip: FC<{delay: number}> = ({delay}) => {
  const scale = useSharedValue(0.4)
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 280}),
          withTiming(0.4, {duration: 280}),
        ),
        -1,
        false,
      ),
    )
    return () => cancelAnimation(scale)
  }, [delay, scale])
  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: scale.value,
  }))
  return <Animated.View style={[styles.pip, style]} />
}

export const RunningWord: FC<{word: string}> = ({word}) => {
  return (
    <View style={styles.wordRow}>
      {word.split('').map((letter, index) => (
        <HopLetter key={`${word}-${index}`} letter={letter} index={index} />
      ))}
    </View>
  )
}

const HopLetter: FC<{letter: string; index: number}> = ({letter, index}) => {
  const hop = useSharedValue(0)
  useEffect(() => {
    hop.value = withDelay(
      index * 90,
      withRepeat(
        withSequence(
          withTiming(-14, {duration: 220, easing: ease}),
          withTiming(0, {duration: 220, easing: ease}),
        ),
        -1,
        false,
      ),
    )
    return () => cancelAnimation(hop)
  }, [hop, index])
  const style = useAnimatedStyle(() => ({
    transform: [{translateY: hop.value}],
  }))
  return (
    <Animated.View style={style}>
      <Text style={styles.hopLetter}>{letter}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  buddy: {
    width: 150,
    height: 176,
    alignItems: 'center',
  },
  pips: {
    position: 'absolute',
    right: 0,
    top: 78,
    gap: 4,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3DB7FF',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 4,
  },
  hopLetter: {
    fontFamily: FONTS.Black,
    fontSize: 32,
    color: '#1E4E79',
    marginHorizontal: 1,
    textTransform: 'lowercase',
  },
})
