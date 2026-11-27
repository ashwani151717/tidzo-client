import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg'

export type MatchKind = 'shapes' | 'colors' | 'numbers' | 'alphabet' | 'animals'

type PieceProps = {
  kind: MatchKind
  id: string
  label: string
}

const COLORS: Record<string, string> = {
  red: '#F04438',
  blue: '#3B82F6',
  yellow: '#F3C04D',
  green: '#22C55E',
}

export const MatchPiece: FC<PieceProps> = ({kind, id, label}) => {
  if (kind === 'colors') {
    return <View style={[styles.swatch, {backgroundColor: COLORS[id] ?? '#E7E5E4'}]} />
  }
  if (kind === 'numbers' && label.includes('•')) {
    return (
      <View style={styles.dots}>
        {label.split('').map((mark, index) => (
          <View key={`${mark}-${index}`} style={styles.dot} />
        ))}
      </View>
    )
  }
  if (kind === 'alphabet' || kind === 'numbers') {
    return <Text style={styles.letter}>{label}</Text>
  }
  if (kind === 'shapes') {
    return (
      <Svg width={72} height={72} viewBox="0 0 72 72">
        {id === 'circle' ? <Circle cx={36} cy={36} r={22} fill="#3B82F6" /> : null}
        {id === 'square' ? <Rect x={16} y={16} width={40} height={40} rx={6} fill="#F3C04D" /> : null}
        {id === 'triangle' ? <Polygon points="36,12 62,58 10,58" fill="#22C55E" /> : null}
        {id === 'star' ? <Polygon points="36,8 43,28 64,28 47,40 54,60 36,48 18,60 25,40 8,28 29,28" fill="#F04438" /> : null}
      </Svg>
    )
  }
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Circle cx={36} cy={40} r={22} fill={id === 'cat' ? '#F4A261' : id === 'dog' ? '#C47A12' : id === 'bird' ? '#7DD3FC' : '#F472B6'} />
      <Circle cx={28} cy={36} r={3} fill="#1C1917" />
      <Circle cx={44} cy={36} r={3} fill="#1C1917" />
      {id === 'cat' ? <Polygon points="16,28 24,18 28,32" fill="#F4A261" /> : null}
      {id === 'cat' ? <Polygon points="56,28 48,18 44,32" fill="#F4A261" /> : null}
      {id === 'dog' ? <Ellipse cx={16} cy={42} rx={8} ry={12} fill="#C47A12" /> : null}
      {id === 'bird' ? <Polygon points="50,40 66,36 50,46" fill="#F3C04D" /> : null}
      {id === 'fish' ? <Polygon points="14,40 28,30 28,50" fill="#F472B6" /> : null}
      <Path d="M30 46 Q36 52 42 46" stroke="#1C1917" strokeWidth={2} fill="none" />
    </Svg>
  )
}

const styles = StyleSheet.create({
  swatch: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  letter: {
    fontFamily: 'Poppins-Bold',
    fontSize: 40,
    color: '#1E4E79',
  },
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 48,
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F8A4C',
  },
})
