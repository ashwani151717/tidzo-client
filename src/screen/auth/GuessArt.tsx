import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg'
import { FONTS } from '../../constants/Fonts'
import { GuessId } from './guessCatalog'

const INK = '#1C1917'

const FILLS: Record<string, string> = {
  Red: '#F04438',
  Blue: '#3B82F6',
  Green: '#22C55E',
  Yellow: '#F5C518',
  Purple: '#A855F7',
  Orange: '#F97316',
}

type Props = {
  category: GuessId
  id: string
  label: string
}

export const GuessArt: FC<Props> = ({category, id, label}) => {
  if (category === 'alphabet' || category === 'numbers') {
    return (
      <View style={[styles.tile, category === 'numbers' ? styles.numberTile : styles.letterTile]}>
        <Text style={styles.tileText}>{label}</Text>
      </View>
    )
  }
  if (category === 'colors') {
    return (
      <View style={[styles.swatch, {backgroundColor: FILLS[id] ?? '#E4DDD0'}]}>
        <View style={styles.gloss} />
      </View>
    )
  }
  return (
    <Svg width={92} height={92} viewBox="0 0 92 92">
      {picture(category, id)}
    </Svg>
  )
}

const picture = (category: GuessId, id: string) => {
  if (category === 'fruits') {
    if (id === 'Banana') {
      return <Path d="M28 62c8-28 22-40 42-46 2 10-2 22-12 36-12 16-22 22-30 10z" fill="#F5C518" />
    }
    if (id === 'Mango') {
      return <Ellipse cx={46} cy={50} rx={22} ry={28} fill="#F97316" />
    }
    if (id === 'Grapes') {
      return (
        <>
          <Circle cx={38} cy={40} r={10} fill="#7C3AED" />
          <Circle cx={54} cy={40} r={10} fill="#6D28D9" />
          <Circle cx={46} cy={54} r={10} fill="#8B5CF6" />
          <Circle cx={34} cy={58} r={9} fill="#7C3AED" />
          <Circle cx={58} cy={56} r={9} fill="#6D28D9" />
        </>
      )
    }
    if (id === 'Orange') {
      return (
        <>
          <Circle cx={46} cy={48} r={24} fill="#F97316" />
          <Path d="M46 24v48M22 48h48" stroke="#FDBA74" strokeWidth={2} />
        </>
      )
    }
    if (id === 'Melon') {
      return (
        <>
          <Path d="M18 58c8-28 48-28 56 0" fill="#166534" />
          <Path d="M22 58c6-20 42-20 48 0" fill="#F04438" />
          <Circle cx={40} cy={54} r={2} fill="#1C1917" />
          <Circle cx={52} cy={52} r={2} fill="#1C1917" />
        </>
      )
    }
    return (
      <>
        <Circle cx={46} cy={50} r={22} fill="#F04438" />
        <Path d="M46 28c4-12 16-12 18-4" stroke="#5C3A1E" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Ellipse cx={60} cy={22} rx={8} ry={4} fill="#22C55E" transform="rotate(-30 60 22)" />
      </>
    )
  }
  if (category === 'animals') {
    if (id === 'Dog') {
      return (
        <>
          <Ellipse cx={30} cy={40} rx={10} ry={16} fill="#D4A574" />
          <Ellipse cx={62} cy={40} rx={10} ry={16} fill="#D4A574" />
          <Circle cx={46} cy={48} r={22} fill="#E8C39A" />
          <Ellipse cx={46} cy={56} rx={8} ry={6} fill="#5C3A1E" />
          <Circle cx={38} cy={46} r={3} fill={INK} />
          <Circle cx={54} cy={46} r={3} fill={INK} />
        </>
      )
    }
    if (id === 'Lion') {
      return (
        <>
          <Circle cx={46} cy={48} r={28} fill="#F5C518" />
          <Circle cx={46} cy={50} r={16} fill="#FDE68A" />
          <Circle cx={40} cy={48} r={2.4} fill={INK} />
          <Circle cx={52} cy={48} r={2.4} fill={INK} />
        </>
      )
    }
    if (id === 'Fish') {
      return (
        <>
          <Ellipse cx={48} cy={48} rx={24} ry={14} fill="#38BDF8" />
          <Path d="M22 48 L8 36 L8 60 Z" fill="#0EA5E9" />
          <Circle cx={58} cy={46} r={2.4} fill={INK} />
        </>
      )
    }
    if (id === 'Bird') {
      return (
        <>
          <Ellipse cx={48} cy={52} rx={18} ry={14} fill="#60A5FA" />
          <Circle cx={62} cy={40} r={10} fill="#93C5FD" />
          <Path d="M70 40 L82 36 L70 46 Z" fill="#F97316" />
          <Circle cx={65} cy={38} r={2} fill={INK} />
        </>
      )
    }
    if (id === 'Elephant') {
      return (
        <>
          <Circle cx={44} cy={42} r={18} fill="#94A3B8" />
          <Path d="M50 52c8 10 6 24-2 28" stroke="#94A3B8" strokeWidth={8} fill="none" strokeLinecap="round" />
          <Ellipse cx={28} cy={46} rx={8} ry={12} fill="#64748B" />
          <Circle cx={40} cy={40} r={2.2} fill={INK} />
        </>
      )
    }
    return (
      <>
        <Path d="M28 36 L36 18 L44 36" fill="#FDBA74" />
        <Path d="M48 36 L56 18 L64 36" fill="#FDBA74" />
        <Circle cx={46} cy={50} r={20} fill="#F97316" />
        <Circle cx={38} cy={48} r={2.6} fill={INK} />
        <Circle cx={54} cy={48} r={2.6} fill={INK} />
      </>
    )
  }
  if (id === 'Square') {
    return <Rect x={22} y={22} width={48} height={48} rx={8} fill="#F5C518" />
  }
  if (id === 'Triangle') {
    return <Path d="M46 16 L80 74 L12 74 Z" fill="#22C55E" />
  }
  if (id === 'Star') {
    return <Path d="M46 12 L54 34 L78 34 L58 48 L66 72 L46 58 L26 72 L34 48 L14 34 L38 34 Z" fill="#F5C518" />
  }
  if (id === 'Heart') {
    return <Path d="M46 74 C20 54 14 36 28 28 C36 22 44 28 46 34 C48 28 56 22 64 28 C78 36 72 54 46 74 Z" fill="#F04438" />
  }
  if (id === 'Diamond') {
    return <Path d="M46 14 L76 46 L46 78 L16 46 Z" fill="#38BDF8" />
  }
  return <Circle cx={46} cy={46} r={26} fill="#F04438" />
}

const styles = StyleSheet.create({
  tile: {
    width: 92,
    height: 92,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterTile: {
    backgroundColor: '#FFF1F6',
  },
  numberTile: {
    backgroundColor: '#E7F8EE',
  },
  tileText: {
    fontFamily: FONTS.Black,
    fontSize: 40,
    color: INK,
  },
  swatch: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 12,
    left: 18,
    width: 28,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
})
