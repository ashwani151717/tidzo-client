import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { goBack } from '../../utils/NavigationUtils'
import { SayBuddy } from './SayBuddy'

const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'
const GREEN = '#1F8A4C'

const STEPS = [
  {
    key: 'watch',
    title: 'Watch',
    seconds: 30,
    speech: 'Look. A circle, a square, and a triangle.',
  },
  {
    key: 'understand',
    title: 'Understand',
    seconds: 20,
    speech: 'A ball is round like a circle.',
  },
  {
    key: 'practice',
    title: 'Practice',
    seconds: 40,
    speech: 'Tap the circle.',
  },
  {
    key: 'create',
    title: 'Create',
    seconds: 30,
    speech: 'Draw a circle.',
  },
  {
    key: 'remember',
    title: 'Remember',
    seconds: 10,
    speech: 'Look around you. Find something round, like a circle.',
  },
] as const

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

const ShapeSessionScreen: FC = () => {
  const [index, setIndex] = useState(0)
  const [left, setLeft] = useState(STEPS[0].seconds)
  const step = STEPS[index]
  const done = index >= STEPS.length

  useEffect(() => {
    if (!step) {
      return
    }
    speak(step.speech)
    const total = step.seconds
    const started = Date.now()
    setLeft(total)
    const tick = setInterval(() => {
      const remain = Math.max(0, total - Math.floor((Date.now() - started) / 1000))
      setLeft(remain)
      if (remain === 0) {
        clearInterval(tick)
        setIndex(value => value + 1)
      }
    }, 200)
    return () => {
      clearInterval(tick)
      safeCall(() => Tts?.stop(false))
    }
  }, [step])

  const onNext = () => {
    setIndex(value => value + 1)
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
            <Icon name="ellipse-outline" size={12} color={GOLD_INK} />
            <Text style={styles.brandText}>Shapes · 2 minutes</Text>
          </View>
          <View style={styles.backSpacer} />
        </View>

        {done ? (
          <Done />
        ) : (
          <>
            <View style={styles.pips}>
              {STEPS.map((item, itemIndex) => (
                <View
                  key={item.key}
                  style={[styles.pip, itemIndex <= index && styles.pipOn]}
                />
              ))}
            </View>
            <View style={styles.stepHead}>
              <Text style={styles.stepKicker}>
                Step {index + 1} of {STEPS.length}
              </Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepTime}>{left}s</Text>
            </View>
            <View style={styles.stage}>
              {step.key === 'watch' ? <WatchStage /> : null}
              {step.key === 'understand' ? <UnderstandStage /> : null}
              {step.key === 'practice' ? <PracticeStage /> : null}
              {step.key === 'create' ? <CreateStage /> : null}
              {step.key === 'remember' ? <RememberStage onFound={onNext} /> : null}
            </View>
            <TouchableOpacity
              style={styles.next}
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel={index === STEPS.length - 1 ? 'Finish' : 'Next step'}>
              <Text style={styles.nextText}>{index === STEPS.length - 1 ? 'Finish' : 'Next'}</Text>
              <Icon name="arrow-forward" size={18} color={GOLD_INK} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </CustomSafeAreaView>
  )
}

const WatchStage: FC = () => {
  const bob = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {toValue: 1, duration: 700, useNativeDriver: true}),
        Animated.timing(bob, {toValue: 0, duration: 700, useNativeDriver: true}),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [bob])

  const lift = bob.interpolate({inputRange: [0, 1], outputRange: [0, -14]})

  return (
    <LinearGradient colors={['#7ED0FF', '#FFF6EA']} style={styles.sky}>
      <Text style={styles.caption}>Circle, square, and triangle.</Text>
      <View style={styles.shapeRow}>
        <Animated.View style={{transform: [{translateY: lift}]}}>
          <ShapeGlyph kind="circle" />
        </Animated.View>
        <Animated.View style={{transform: [{translateY: Animated.multiply(lift, -1)}]}}>
          <ShapeGlyph kind="square" />
        </Animated.View>
        <Animated.View style={{transform: [{translateY: lift}]}}>
          <ShapeGlyph kind="triangle" />
        </Animated.View>
      </View>
    </LinearGradient>
  )
}

const UnderstandStage: FC = () => (
  <LinearGradient colors={['#D7F3FF', '#FFF6EA']} style={styles.sky}>
    <View style={styles.buddyWrap}>
      <SayBuddy mode="talk" />
    </View>
    <View style={styles.bubble}>
      <Text style={styles.bubbleName}>Milo</Text>
      <Text style={styles.bubbleText}>A ball is round like a circle.</Text>
    </View>
    <View style={styles.shapeRow}>
      <View style={styles.pair}>
        <View style={styles.ball} />
        <Text style={styles.pairLabel}>Ball</Text>
      </View>
      <Icon name="arrow-forward" size={18} color="#1E4E79" />
      <View style={styles.pair}>
        <ShapeGlyph kind="circle" small />
        <Text style={styles.pairLabel}>Circle</Text>
      </View>
    </View>
  </LinearGradient>
)

const PRACTICE: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle']

const PracticeStage: FC = () => {
  const [picked, setPicked] = useState<string | null>(null)
  const correct = picked === 'circle'

  return (
    <LinearGradient colors={['#FFF6EA', '#E7F8EE']} style={styles.sky}>
      <Text style={styles.caption}>
        {correct ? 'Yes! That is a circle.' : 'Which one is the circle?'}
      </Text>
      <View style={styles.shapeRow}>
        {PRACTICE.map(kind => {
          const chosen = picked === kind
          const good = chosen && kind === 'circle'
          const bad = chosen && kind !== 'circle'
          return (
            <TouchableOpacity
              key={kind}
              onPress={() => setPicked(kind)}
              style={[styles.pick, good && styles.pickGood, bad && styles.pickBad]}
              accessibilityRole="button"
              accessibilityLabel={kind}>
              <ShapeGlyph kind={kind} />
            </TouchableOpacity>
          )
        })}
      </View>
      <Text style={styles.hint}>
        {picked && !correct ? 'Look for the round one.' : 'Tap the round shape.'}
      </Text>
    </LinearGradient>
  )
}

const CreateStage: FC = () => {
  const [strokes, setStrokes] = useState<string[]>([])
  const live = useRef('')
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: event => {
        const {locationX, locationY} = event.nativeEvent
        live.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`
        setStrokes(current => [...current, live.current])
      },
      onPanResponderMove: event => {
        const {locationX, locationY} = event.nativeEvent
        live.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`
        const path = live.current
        setStrokes(current => {
          const next = current.slice()
          next[next.length - 1] = path
          return next
        })
      },
    }),
  ).current

  return (
    <View style={styles.createWrap}>
      <View style={styles.createHead}>
        <Text style={styles.caption}>Draw a circle on the board.</Text>
        <TouchableOpacity onPress={() => setStrokes([])} accessibilityRole="button" accessibilityLabel="Clear drawing">
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.board} {...pan.panHandlers}>
        <View pointerEvents="none" style={styles.guideWrap}>
          <View style={styles.guide} />
        </View>
        <Svg style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, strokeIndex) => (
            <Path key={strokeIndex} d={stroke} stroke="#1E4E79" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </Svg>
      </View>
    </View>
  )
}

const RememberStage: FC<{onFound: () => void}> = ({onFound}) => (
  <LinearGradient colors={['#FFE8F1', '#FFF6EA']} style={styles.sky}>
    <View style={styles.buddyWrap}>
      <SayBuddy mode="talk" />
    </View>
    <View style={styles.bubble}>
      <Text style={styles.bubbleName}>Milo</Text>
      <Text style={styles.bubbleText}>Can you find a circle around you? A clock, a plate, or a ball.</Text>
    </View>
    <TouchableOpacity style={styles.found} onPress={onFound} accessibilityRole="button">
      <Icon name="checkmark-circle" size={18} color={GOLD_INK} />
      <Text style={styles.foundText}>I found one</Text>
    </TouchableOpacity>
  </LinearGradient>
)

const Done: FC = () => (
  <View style={styles.done}>
    <SayBuddy mode="happy" />
    <Text style={styles.stepTitle}>You know the circle.</Text>
    <Text style={styles.hint}>Watch, understand, practice, create, and remember.</Text>
    <TouchableOpacity style={styles.next} onPress={() => goBack()} accessibilityRole="button">
      <Text style={styles.nextText}>Back to lessons</Text>
    </TouchableOpacity>
  </View>
)

const ShapeGlyph: FC<{kind: 'circle' | 'square' | 'triangle'; small?: boolean}> = ({kind, small}) => {
  const size = small ? 64 : 86
  if (kind === 'circle') {
    return (
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size * 0.36} fill="#F04438" />
      </Svg>
    )
  }
  if (kind === 'square') {
    const side = size * 0.62
    const origin = (size - side) / 2
    return (
      <Svg width={size} height={size}>
        <Rect x={origin} y={origin} width={side} height={side} rx={8} fill="#F3C04D" />
      </Svg>
    )
  }
  return (
    <Svg width={size} height={size}>
      <Path d={`M ${size / 2} ${size * 0.16} L ${size * 0.84} ${size * 0.82} L ${size * 0.16} ${size * 0.82} Z`} fill="#3DDC78" />
    </Svg>
  )
}

export default ShapeSessionScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF6EA',
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
    justifyContent: 'space-between',
    marginTop: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  brandText: {
    fontFamily: FONTS.Bold,
    fontSize: 13,
    color: GOLD_INK,
  },
  pips: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  pip: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E4DDD0',
  },
  pipOn: {
    backgroundColor: '#1E4E79',
  },
  stepHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    marginBottom: 12,
  },
  stepKicker: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: MUTED,
  },
  stepTitle: {
    flex: 1,
    marginLeft: 8,
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: INK,
  },
  stepTime: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#1E4E79',
  },
  stage: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  sky: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  caption: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    lineHeight: 24,
    color: INK,
    textAlign: 'center',
  },
  hint: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    textAlign: 'center',
  },
  shapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pick: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pickGood: {
    borderColor: GREEN,
  },
  pickBad: {
    borderColor: '#D3542C',
  },
  buddyWrap: {
    transform: [{scale: 0.78}],
    marginBottom: -20,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'stretch',
  },
  bubbleName: {
    fontFamily: FONTS.Bold,
    fontSize: 12,
    color: '#1E4E79',
    marginBottom: 2,
  },
  bubbleText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    lineHeight: 22,
    color: INK,
  },
  pair: {
    alignItems: 'center',
  },
  pairLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: INK,
  },
  ball: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F04438',
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  createWrap: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  createHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  clear: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: '#1E4E79',
  },
  board: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#FFF6EA',
    overflow: 'hidden',
  },
  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guide: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#E4DDD0',
  },
  found: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  foundText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: GOLD_INK,
  },
  done: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 24,
  },
  next: {
    marginTop: 12,
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
})
