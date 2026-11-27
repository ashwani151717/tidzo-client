import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { FONTS } from '../../../constants/Fonts'
import { SayBuddy } from '../SayBuddy'
import { goBack } from '../../../utils/NavigationUtils'

const INK = '#1C1917'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'

type BarProps = {
  title: string
  stars?: number
  onListen?: () => void
}

export const KidBar: FC<BarProps> = ({title, stars, onListen}) => (
  <View style={styles.bar}>
    <TouchableOpacity
      onPress={() => goBack()}
      style={styles.round}
      accessibilityRole="button"
      accessibilityLabel="Back">
      <Icon name="chevron-back" size={20} color={INK} />
    </TouchableOpacity>
    <View style={styles.brand}>
      <Text style={styles.brandText} numberOfLines={1}>{title}</Text>
    </View>
    {onListen ? (
      <TouchableOpacity
        onPress={onListen}
        style={styles.round}
        accessibilityRole="button"
        accessibilityLabel="Listen">
        <Icon name="volume-high" size={18} color={INK} />
      </TouchableOpacity>
    ) : (
      <View style={styles.starPill}>
        <Icon name="star" size={14} color="#E0A51A" />
        <Text style={styles.starCount}>{stars ?? 0}</Text>
      </View>
    )}
  </View>
)

type CheerProps = {
  title: string
  detail: string
  nextLabel: string
  onNext: () => void
  onAgain?: () => void
}

export const KidCheer: FC<CheerProps> = ({title, detail, nextLabel, onNext, onAgain}) => (
  <View style={styles.cheer}>
    <SayBuddy mode="happy" />
    <View style={styles.stars}>
      <Icon name="star" size={28} color="#E0A51A" />
      <Icon name="star" size={36} color="#F3C04D" />
      <Icon name="star" size={28} color="#E0A51A" />
    </View>
    <Text style={styles.cheerTitle}>{title}</Text>
    <Text style={styles.cheerDetail}>{detail}</Text>
    <TouchableOpacity style={styles.next} onPress={onNext} accessibilityRole="button">
      <Text style={styles.nextText}>{nextLabel}</Text>
    </TouchableOpacity>
    {onAgain ? (
      <TouchableOpacity onPress={onAgain} accessibilityRole="button">
        <Text style={styles.again}>Practise again</Text>
      </TouchableOpacity>
    ) : null}
  </View>
)

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  round: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F3EDE3',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: INK,
    textAlign: 'center',
  },
  starPill: {
    minWidth: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
  },
  starCount: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: INK,
  },
  cheer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  cheerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: INK,
    textAlign: 'center',
  },
  cheerDetail: {
    fontFamily: FONTS.Regular,
    fontSize: 16,
    color: '#6F675E',
    textAlign: 'center',
  },
  next: {
    marginTop: 8,
    minHeight: 56,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
  again: {
    marginTop: 4,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#1E4E79',
  },
})
