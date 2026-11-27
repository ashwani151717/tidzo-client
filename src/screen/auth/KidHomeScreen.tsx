import React, { FC, useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import ClayPress from '../../components/kids/ClayPress'
import { Clay, clayShadow } from '../../constants/Clay'
import { FONTS } from '../../constants/Fonts'
import { goBack, navigate } from '../../utils/NavigationUtils'
import { speak } from './kidSpeech'
import { readPractice } from './whiteboard/progress'

const DOORS = [
  {
    route: 'LearningScreen',
    title: 'Learn',
    hint: 'Watch a short lesson',
    icon: 'play',
    tint: Clay.blue,
    ink: '#1E3A5F',
  },
  {
    route: 'GamesHomeScreen',
    title: 'Play',
    hint: 'Games for little hands',
    icon: 'extension-puzzle',
    tint: Clay.gold,
    ink: Clay.goldInk,
  },
  {
    route: 'WhiteboardHomeScreen',
    title: 'Draw',
    hint: 'Trace letters and numbers',
    icon: 'pencil',
    tint: Clay.mint,
    ink: '#1F6B45',
  },
]

const KidHomeScreen: FC = () => {
  const [stars, setStars] = useState(0)

  useFocusEffect(
    useCallback(() => {
      const book = readPractice()
      setStars(book.letters.length + book.numbers.length)
    }, []),
  )

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.topBar}>
          <ClayPress
            onPress={() => goBack()}
            style={styles.round}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Icon name="chevron-back" size={22} color={Clay.ink} />
          </ClayPress>
          <Text style={styles.brand}>Tidzo</Text>
          <ClayPress
            onPress={() => speak('Pick a door. Learn, play, or draw.')}
            style={styles.round}
            accessibilityRole="button"
            accessibilityLabel="Listen">
            <Icon name="volume-high" size={20} color={Clay.ink} />
          </ClayPress>
        </View>

        <Text style={styles.title}>Let's learn</Text>
        <Text style={styles.subtitle}>Pick a door.</Text>

        <View style={styles.doors}>
          {DOORS.map(door => (
            <ClayPress
              key={door.route}
              onPress={() => navigate(door.route)}
              style={[styles.door, {backgroundColor: door.tint}]}
              accessibilityRole="button"
              accessibilityLabel={door.title}>
              <View style={styles.blob}>
                <Icon name={door.icon} size={26} color={door.ink} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.doorTitle}>{door.title}</Text>
                <Text style={styles.doorHint}>{door.hint}</Text>
              </View>
              <Icon name="chevron-forward" size={22} color={door.ink} />
            </ClayPress>
          ))}
        </View>

        <View style={styles.starPill}>
          <Icon name="star" size={16} color="#E0A51A" />
          <Text style={styles.starText}>
            {stars} {stars === 1 ? 'star' : 'stars'}
          </Text>
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default KidHomeScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Clay.cream,
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  round: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Clay.card,
    borderWidth: 3,
    borderColor: Clay.edge,
    alignItems: 'center',
    justifyContent: 'center',
    ...clayShadow,
  },
  brand: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.Black,
    fontSize: 22,
    color: Clay.ink,
  },
  title: {
    marginTop: 22,
    fontFamily: FONTS.Black,
    fontSize: 36,
    lineHeight: 42,
    color: Clay.ink,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontFamily: FONTS.Medium,
    fontSize: 16,
    color: Clay.muted,
  },
  doors: {
    gap: 14,
  },
  door: {
    minHeight: 96,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...clayShadow,
  },
  blob: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  doorTitle: {
    fontFamily: FONTS.Black,
    fontSize: 24,
    color: Clay.ink,
  },
  doorHint: {
    marginTop: 2,
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: Clay.ink,
  },
  starPill: {
    marginTop: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Clay.card,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: Clay.edge,
    paddingHorizontal: 16,
    minHeight: 48,
    ...clayShadow,
  },
  starText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: Clay.ink,
  },
})
