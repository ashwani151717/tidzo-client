import React, { FC, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

const ease = Easing.inOut(Easing.sin)

const pictures: Record<string, FC> = {
  A: () => (
    <>
      <Circle cx={40} cy={46} r={20} fill="#F04438" />
      <Path d="M40 26c2-10 12-12 16-8" stroke="#5C3A1E" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Ellipse cx={54} cy={18} rx={8} ry={4} fill="#3DDC78" transform="rotate(-28 54 18)" />
      <Ellipse cx={34} cy={42} rx={4} ry={8} fill="#FF8A80" />
    </>
  ),
  B: () => (
    <>
      <Circle cx={40} cy={40} r={22} fill="#FFFFFF" stroke="#1E4E79" strokeWidth={3} />
      <Path d="M22 40h36" stroke="#F04438" strokeWidth={4} />
      <Circle cx={40} cy={40} r={6} fill="#F04438" />
    </>
  ),
  C: () => (
    <>
      <Path d="M24 28 L32 16 L40 28" fill="#F2A45A" />
      <Path d="M40 28 L48 16 L56 28" fill="#F2A45A" />
      <Circle cx={40} cy={44} r={18} fill="#F2A45A" />
      <Circle cx={33} cy={42} r={2.4} fill="#1C1917" />
      <Circle cx={47} cy={42} r={2.4} fill="#1C1917" />
      <Path d="M36 50h8" stroke="#1C1917" strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  D: () => (
    <>
      <Ellipse cx={28} cy={42} rx={10} ry={16} fill="#C68642" />
      <Circle cx={44} cy={42} r={18} fill="#E0A15A" />
      <Circle cx={50} cy={40} r={2.4} fill="#1C1917" />
      <Ellipse cx={58} cy={46} rx={5} ry={3.5} fill="#1C1917" />
    </>
  ),
  E: () => (
    <>
      <Ellipse cx={40} cy={42} rx={16} ry={22} fill="#FFF8EE" stroke="#F3C04D" strokeWidth={3} />
      <Ellipse cx={34} cy={34} rx={4} ry={7} fill="#FFFFFF" />
    </>
  ),
  F: () => (
    <>
      <Ellipse cx={36} cy={42} rx={18} ry={12} fill="#3DB7FF" />
      <Path d="M52 42 L70 30 L70 54 Z" fill="#1E4E79" />
      <Circle cx={28} cy={40} r={2.2} fill="#1C1917" />
    </>
  ),
  G: () => (
    <>
      <Circle cx={40} cy={46} r={16} fill="#F4E2C4" />
      <Path d="M28 36 L24 18" stroke="#C68642" strokeWidth={3} strokeLinecap="round" />
      <Path d="M52 36 L56 18" stroke="#C68642" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={34} cy={46} r={2} fill="#1C1917" />
      <Circle cx={46} cy={46} r={2} fill="#1C1917" />
    </>
  ),
  H: () => (
    <>
      <Path d="M22 40h36" stroke="#3A2E12" strokeWidth={6} strokeLinecap="round" />
      <Path d="M30 40 V22 h18 a8 8 0 0 1 8 8 V40" fill="#F04438" />
    </>
  ),
  I: () => (
    <>
      <Path d="M28 28h24l8 10-8 22H28l-8-22z" fill="#B9E6FF" stroke="#7EC8F0" strokeWidth={2} />
      <Path d="M24 38h34" stroke="#FFFFFF" strokeWidth={2} />
    </>
  ),
  J: () => (
    <>
      <Path d="M30 22h22v28a12 12 0 0 1-24 0v-6h8v6a4 4 0 0 0 8 0V30h-14z" fill="#3DB7FF" />
      <Ellipse cx={48} cy={26} rx={6} ry={4} fill="#1E4E79" />
    </>
  ),
  K: () => (
    <>
      <Path d="M40 16 L58 40 L40 64 L22 40 Z" fill="#F3C04D" stroke="#E07A2F" strokeWidth={2} />
      <Path d="M40 64c6 6 4 10 0 14" stroke="#E07A2F" strokeWidth={2} fill="none" />
    </>
  ),
  L: () => (
    <>
      <Circle cx={40} cy={44} r={18} fill="#F2A45A" />
      <Path d="M24 40c0-16 8-24 16-24s16 8 16 24" fill="#E07A2F" />
      <Circle cx={34} cy={46} r={2} fill="#1C1917" />
      <Circle cx={46} cy={46} r={2} fill="#1C1917" />
    </>
  ),
  M: () => (
    <>
      <Circle cx={40} cy={40} r={20} fill="#F3C04D" />
      <Circle cx={50} cy={34} r={16} fill="#E4F7FF" />
    </>
  ),
  N: () => (
    <>
      <Path d="M18 48c6 16 38 16 44 0 2 10-8 18-22 18S16 58 18 48z" fill="#C68642" />
      <Ellipse cx={40} cy={42} rx={8} ry={10} fill="#FFF8EE" />
    </>
  ),
  O: () => (
    <>
      <Circle cx={40} cy={44} r={20} fill="#F08A24" />
      <Ellipse cx={40} cy={22} rx={7} ry={4} fill="#3DDC78" />
      <Path d="M40 22v-8" stroke="#5C3A1E" strokeWidth={2} />
    </>
  ),
  P: () => (
    <>
      <Rect x={36} y={16} width={8} height={48} rx={3} fill="#3DB7FF" transform="rotate(18 40 40)" />
      <Path d="M34 18h16" stroke="#F3C04D" strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  Q: () => (
    <>
      <Path d="M22 36 L40 16 L58 36 V28 H22z" fill="#F3C04D" />
      <Rect x={24} y={36} width={32} height={8} rx={2} fill="#E0A15A" />
      <Circle cx={32} cy={30} r={2} fill="#F04438" />
      <Circle cx={48} cy={30} r={2} fill="#3DB7FF" />
    </>
  ),
  R: () => (
    <>
      <Ellipse cx={32} cy={28} rx={6} ry={16} fill="#F7F7F7" />
      <Ellipse cx={48} cy={28} rx={6} ry={16} fill="#F4E2C4" />
      <Circle cx={40} cy={48} r={14} fill="#F7F7F7" />
      <Circle cx={36} cy={46} r={2} fill="#1C1917" />
      <Circle cx={46} cy={46} r={2} fill="#1C1917" />
    </>
  ),
  S: () => (
    <>
      <Circle cx={40} cy={40} r={16} fill="#F3C04D" />
      {[0, 45, 90, 135].map(angle => (
        <Rect key={angle} x={38} y={12} width={4} height={10} rx={2} fill="#F08A24" transform={`rotate(${angle} 40 40)`} />
      ))}
    </>
  ),
  T: () => (
    <>
      <Circle cx={40} cy={44} r={18} fill="#F08A24" />
      <Path d="M28 36h6M38 32h6M48 38h6" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={34} cy={46} r={2} fill="#1C1917" />
      <Circle cx={46} cy={46} r={2} fill="#1C1917" />
    </>
  ),
  U: () => (
    <>
      <Path d="M22 46c0-18 8-26 18-26s18 8 18 26" fill="#F04438" />
      <Path d="M18 46h44" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
      <Path d="M40 46v14" stroke="#1C1917" strokeWidth={3} />
    </>
  ),
  V: () => (
    <>
      <Rect x={16} y={32} width={48} height={24} rx={6} fill="#F3C04D" />
      <Rect x={46} y={36} width={14} height={10} rx={2} fill="#B9E6FF" />
      <Circle cx={26} cy={58} r={5} fill="#1C1917" />
      <Circle cx={52} cy={58} r={5} fill="#1C1917" />
    </>
  ),
  W: () => (
    <>
      <Ellipse cx={38} cy={46} rx={20} ry={12} fill="#3DB7FF" />
      <Path d="M22 42c6-14 14-14 16 0" fill="#1E4E79" />
      <Circle cx={30} cy={44} r={2} fill="#1C1917" />
      <Path d="M48 28c2 6 2 6 0 10" stroke="#7EC8F0" strokeWidth={2} fill="none" />
    </>
  ),
  X: () => (
    <>
      <Path d="M24 28c16 8 16 16 0 24 10-4 22-4 32 0-16-8-16-16 0-24-10 4-22 4-32 0z" fill="#FFF8EE" stroke="#E7E0D6" strokeWidth={2} />
    </>
  ),
  Y: () => (
    <>
      <Circle cx={40} cy={48} r={16} fill="#8C5A32" />
      <Path d="M26 40c-2-16 4-22 8-22" stroke="#5C3A1E" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M54 40c2-16-4-22-8-22" stroke="#5C3A1E" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={34} cy={48} r={2} fill="#1C1917" />
      <Circle cx={46} cy={48} r={2} fill="#1C1917" />
    </>
  ),
  Z: () => (
    <>
      <Ellipse cx={40} cy={44} rx={16} ry={20} fill="#FFFFFF" stroke="#1C1917" strokeWidth={2} />
      <Path d="M30 34h20M28 44h24M30 54h20" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
    </>
  ),
}

export const WordPicture: FC<{letter: string}> = ({letter}) => {
  const hop = useSharedValue(0)
  const tilt = useSharedValue(0)

  useEffect(() => {
    hop.value = 0
    tilt.value = 0
    hop.value = withRepeat(
      withSequence(
        withTiming(-12, {duration: 420, easing: ease}),
        withTiming(0, {duration: 420, easing: ease}),
      ),
      -1,
      false,
    )
    tilt.value = withRepeat(
      withSequence(
        withTiming(-7, {duration: 560, easing: ease}),
        withTiming(7, {duration: 560, easing: ease}),
      ),
      -1,
      true,
    )
  }, [hop, letter, tilt])

  const style = useAnimatedStyle(() => ({
    transform: [{translateY: hop.value}, {rotate: `${tilt.value}deg`}],
  }))
  const Glyph = pictures[letter] ?? pictures.A

  return (
    <View style={styles.frame}>
      <Animated.View style={style}>
        <Svg width={92} height={92} viewBox="0 0 80 80">
          <Glyph />
        </Svg>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E4E79',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
})
