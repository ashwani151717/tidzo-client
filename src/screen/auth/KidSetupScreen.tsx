import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { navigate } from '../../utils/NavigationUtils'
import { token_storage } from '../../redux/storage'
import SkyHero from '../../components/kids/SkyHero'

const CREAM = '#F7F4EC'
const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'

const AGE_GROUPS = [
  {id: '2-4', label: '2–4', hint: 'Songs, colors, and first words', icon: 'flower-outline', tint: '#FFE8F1', ink: '#C43B6E'},
  {id: '5-8', label: '5–8', hint: 'Stories and simple lessons', icon: 'book-outline', tint: '#E7F8EE', ink: '#1F8A4C'},
  {id: '9-12', label: '9–12', hint: 'Bigger ideas, still short', icon: 'rocket-outline', tint: '#E8F1FF', ink: '#1E4E79'},
]

const KidSetupScreen: FC = () => {
  const [ageGroup, setAgeGroup] = useState(
    token_storage.getString('kid_age_group') ?? '',
  )
  const slide = useRef(new Animated.Value(120)).current

  const ready = Boolean(ageGroup)

  useEffect(() => {
    Animated.timing(slide, {
      toValue: ready ? 0 : 120,
      duration: 280,
      useNativeDriver: true,
    }).start()
  }, [ready, slide])

  const onContinue = () => {
    if (!ready) {
      return
    }
    token_storage.set('kid_age_group', ageGroup)
    token_storage.set('kid_language', 'en')
    navigate('KidHomeScreen')
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <SkyHero compact />

        <Text style={styles.title}>Set up the player</Text>
        <Text style={styles.subtitle}>
          Pick an age. Tidzo will show only short learning videos that fit.
        </Text>

        <Text style={styles.section}>Age group</Text>
        <View style={styles.stack}>
          {AGE_GROUPS.map(item => {
            const selected = ageGroup === item.id
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => setAgeGroup(item.id)}
                style={[styles.choice, selected && styles.choiceSelected]}
                accessibilityRole="checkbox"
                accessibilityState={{checked: selected}}>
                <View style={[styles.ageMark, {backgroundColor: item.tint}]}>
                  <Icon name={item.icon} size={18} color={item.ink} />
                </View>
                <View style={styles.choiceCopy}>
                  <Text style={styles.choiceLabel}>{item.label}</Text>
                  <Text style={styles.choiceHint}>{item.hint}</Text>
                </View>
                <View style={[styles.check, selected && styles.checkSelected]}>
                  {selected ? (
                    <Icon name="checkmark" size={16} color={GOLD_INK} />
                  ) : null}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      <Animated.View
        pointerEvents={ready ? 'auto' : 'none'}
        style={[styles.continueDock, {transform: [{translateY: slide}]}]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onContinue}
          style={styles.continueButton}
          accessibilityRole="button"
          accessibilityLabel="Continue">
          <Text style={styles.continueText}>Let's go</Text>
          <Icon name="arrow-forward" size={18} color={GOLD_INK} />
        </TouchableOpacity>
      </Animated.View>
      </View>
    </CustomSafeAreaView>
  )
}

export default KidSetupScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CREAM,
    padding: 0,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 128,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: INK,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 22,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    textAlign: 'center',
  },
  section: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: INK,
    marginBottom: 10,
  },
  stack: {
    gap: 10,
    marginBottom: 22,
  },
  choice: {
    minHeight: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: {
    backgroundColor: '#FFF8E4',
    borderColor: GOLD,
    borderWidth: 3,
  },
  choiceCopy: {
    flex: 1,
    paddingRight: 12,
  },
  choiceLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: INK,
  },
  choiceHint: {
    marginTop: 2,
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: MUTED,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#D5CFC4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkSelected: {
    borderColor: GOLD,
    backgroundColor: GOLD,
  },
  continueDock: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 12,
  },
  continueButton: {
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
})
