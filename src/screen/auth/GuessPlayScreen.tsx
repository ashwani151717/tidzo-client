import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { goBack } from '../../utils/NavigationUtils'
import { buildRounds, categoryById, GuessId, GuessRound } from './guessCatalog'
import { GuessArt } from './GuessArt'
import { CelebrationBurst } from './CelebrationBurst'
import { PlayPark } from './PlayPark'

const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F5C451'
const GOLD_INK = '#3A2E12'
const FILLS = ['#B7E4C7', '#F8E3A0', '#F8C9B0', '#DCC8F5']

type SpeechModule = {
  speak: (text: string) => void
  stop: (onWordBoundary?: boolean) => void
}

const safeCall = (work: () => unknown) => {
  try {
    const result = work()
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      ;(result as Promise<unknown>).catch(() => undefined)
    }
  } catch {
    // This iOS build rejects the speech library's boolean flag.
  }
}

const loadTts = (): SpeechModule | null => {
  try {
    return require('react-native-tts').default
  } catch {
    return null
  }
}

const Tts = loadTts()

const speak = (text: string) => {
  if (!Tts) {
    return
  }
  safeCall(() => Tts.stop(false))
  safeCall(() => Tts.speak(text))
}

const GuessPlayScreen: FC = () => {
  const route = useRoute()
  const categoryId = (route.params as {category?: GuessId} | undefined)?.category
  const category = categoryById(categoryId)
  const [playId, setPlayId] = useState(0)
  const rounds = useMemo(
    () => (category ? buildRounds(category.id) : []),
    [category, playId],
  )

  if (!category) {
    return null
  }

  return (
    <RoundPlay
      key={`${category.id}-${playId}`}
      categoryId={category.id}
      title={category.title}
      rounds={rounds}
      onAgain={() => setPlayId(value => value + 1)}
    />
  )
}

const RoundPlay: FC<{
  categoryId: GuessId
  title: string
  rounds: GuessRound[]
  onAgain: () => void
}> = ({categoryId, title, rounds, onAgain}) => {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [stars, setStars] = useState(0)
  const [showBurst, setShowBurst] = useState(false)
  const [finished, setFinished] = useState(false)
  const [canListen, setCanListen] = useState(false)
  const shake = useRef(new Animated.Value(0)).current
  const repeats = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const round = rounds[index]
  const done = finished || !round

  const clearRepeats = () => {
    repeats.current.forEach(clearTimeout)
    repeats.current = []
  }

  useEffect(() => {
    if (!round) {
      return
    }
    setCanListen(false)
    clearRepeats()
    speak(round.prompt)
    const again = [3000, 6000].map(wait =>
      setTimeout(() => speak(round.prompt), wait),
    )
    const showButton = setTimeout(() => setCanListen(true), 6000)
    repeats.current = [...again, showButton]
    return () => {
      clearRepeats()
      safeCall(() => Tts?.stop(false))
    }
  }, [round])

  const wobble = () => {
    shake.setValue(0)
    Animated.sequence([
      Animated.timing(shake, {toValue: 1, duration: 40, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 2, duration: 40, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 3, duration: 40, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 4, duration: 40, useNativeDriver: true}),
      Animated.timing(shake, {toValue: 5, duration: 40, useNativeDriver: true}),
    ]).start()
  }

  const shift = shake.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: [0, -10, 10, -7, 7, 0],
  })

  const onPick = (id: string) => {
    if (!round || showBurst || picked) {
      return
    }
    clearRepeats()
    setCanListen(true)
    setPicked(id)
    if (id !== round.answerId) {
      wobble()
      speak('Try again.')
      setTimeout(() => setPicked(null), 550)
      return
    }
    const nextStars = stars + 1
    setStars(nextStars)
    setShowBurst(true)
    speak('Yes!')
    setTimeout(() => {
      setShowBurst(false)
      setPicked(null)
      if (index + 1 >= rounds.length) {
        setFinished(true)
        return
      }
      setIndex(value => value + 1)
    }, 2600)
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Icon name="chevron-back" size={20} color={INK} />
          </TouchableOpacity>
          <View style={styles.brand}>
            <Icon name="headset" size={12} color={GOLD_INK} />
            <Text style={styles.brandText}>{title} guess</Text>
          </View>
          <View style={styles.starPill}>
            <Icon name="star" size={14} color="#E0A51A" />
            <Text style={styles.starCount}>{stars}</Text>
          </View>
        </View>

        {done ? (
          <View style={styles.finish}>
            <PlayPark compact />
            <Text style={styles.finishTitle}>You guessed them all.</Text>
            <Text style={styles.finishHint}>{stars} stars in {title}.</Text>
            <TouchableOpacity style={styles.listen} onPress={onAgain} accessibilityRole="button">
              <Icon name="refresh" size={18} color={GOLD_INK} />
              <Text style={styles.listenText}>Play again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.progress}>
              {index + 1} of {rounds.length}
            </Text>
            <View style={styles.promptCard}>
              <PlayPark compact />
              <Text style={styles.prompt}>{round.prompt.replace(/\./g, '.\n')}</Text>
              {canListen ? (
                <TouchableOpacity
                  style={styles.listen}
                  onPress={() => speak(round.prompt)}
                  accessibilityRole="button"
                  accessibilityLabel="Listen again">
                  <Icon name="volume-high" size={18} color={GOLD_INK} />
                  <Text style={styles.listenText}>Listen again</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.grid}>
              {round.choices.map((choice, choiceIndex) => {
                const correct = picked === choice.id && choice.id === round.answerId
                const wrong = picked === choice.id && choice.id !== round.answerId
                return (
                  <Animated.View
                    key={choice.id}
                    style={[styles.choiceSlot, wrong ? {transform: [{translateX: shift}]} : null]}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onPick(choice.id)}
                      style={[
                        styles.choice,
                        {backgroundColor: FILLS[choiceIndex % FILLS.length]},
                        correct && styles.choiceGood,
                        wrong && styles.choiceBad,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={choice.label}>
                      <GuessArt category={categoryId} id={choice.id} label={choice.label} />
                      {categoryId === 'colors' ? null : (
                        <Text style={styles.choiceLabel}>{choice.label}</Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                )
              })}
            </View>
          </>
        )}
        {showBurst && round ? (
          <CelebrationBurst title="Wonderful!" detail={round.choices.find(item => item.id === round.answerId)?.label ?? ''} />
        ) : null}
      </View>
    </CustomSafeAreaView>
  )
}

export default GuessPlayScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF6EA',
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  back: {
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
    marginHorizontal: 8,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F3EDE3',
    paddingHorizontal: 12,
  },
  brandText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: INK,
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
    paddingHorizontal: 8,
  },
  starCount: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: INK,
  },
  progress: {
    marginTop: 14,
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: MUTED,
  },
  promptCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  prompt: {
    marginTop: 8,
    fontFamily: FONTS.Bold,
    fontSize: 22,
    lineHeight: 28,
    color: INK,
    textAlign: 'center',
  },
  listen: {
    marginTop: 10,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  listenText: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: GOLD_INK,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 12,
  },
  choiceSlot: {
    width: '48%',
  },
  choice: {
    width: '100%',
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    marginBottom: 12,
  },
  choiceGood: {
    borderColor: '#2563EB',
  },
  choiceBad: {
    borderColor: '#D3542C',
  },
  choiceLabel: {
    marginTop: 2,
    marginBottom: 6,
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: INK,
  },
  finish: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 26,
    color: INK,
    textAlign: 'center',
  },
  finishHint: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: MUTED,
  },
})
