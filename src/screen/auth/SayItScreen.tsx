import { Animated, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { goBack } from '../../utils/NavigationUtils'
import { promptFor, SAY_WORDS, matchesWord } from './sayWords'
import { BuddyMode, RunningWord, SayBuddy } from './SayBuddy'
import { WordPicture } from './WordPicture'
import { Drift } from '../../components/kids/SkyHero'

const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'
const GREEN = '#1F8A4C'
const CORAL = '#D3542C'

type Phase = 'teach' | 'ready' | 'listening' | 'correct' | 'wrong' | 'empty' | 'denied' | 'done'

type SpeechModule = {
  start: (locale: string) => Promise<void>
  stop: () => Promise<void>
  cancel: () => Promise<void>
  destroy: () => Promise<void>
  removeAllListeners: () => void
  onSpeechResults?: (event: {value?: string[]}) => void
  onSpeechPartialResults?: (event: {value?: string[]}) => void
  onSpeechEnd?: () => void
  onSpeechError?: (event: {error?: {message?: string}}) => void
}

type TtsModule = {
  setDefaultLanguage: (language: string) => Promise<string>
  setDefaultPitch: (pitch: number) => Promise<string>
  setDefaultRate: (rate: number, skipTransform?: boolean) => Promise<string>
  speak: (text: string) => Promise<string> | void
  stop: (onWordBoundary?: boolean) => Promise<string> | void
  addEventListener: (
    event: string,
    handler: (event?: {utteranceId?: number | string}) => void,
  ) => {remove: () => void}
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

const loadSpeech = (): {Voice: SpeechModule | null; Tts: TtsModule | null} => {
  try {
    return {
      Voice: require('@react-native-voice/voice').default,
      Tts: require('react-native-tts').default,
    }
  } catch {
    return {Voice: null, Tts: null}
  }
}

const {Voice, Tts} = loadSpeech()

const SayItScreen: FC = () => {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('teach')
  const [heard, setHeard] = useState('')
  const [talking, setTalking] = useState(false)
  const [stars, setStars] = useState(0)
  const indexRef = useRef(0)
  const phaseRef = useRef<Phase>('teach')
  const teachId = useRef(0)
  const handledRef = useRef(false)
  const stoppedRef = useRef(false)
  const startedRef = useRef(0)
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heardLines = useRef<string[]>([])
  const micReady = useRef(Platform.OS !== 'android')
  const finishRef = useRef<(values: string[]) => void>(() => {})
  const slide = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(1)).current
  const item = SAY_WORDS[index]
  const speaking = index < SAY_WORDS.length

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const speak = useCallback(async (text: string) => {
    if (!Tts) {
      return
    }
    setTalking(true)
    safeCall(() => Tts.stop(false))
    try {
      const spoken = await Promise.resolve(Tts.speak(text)).catch(() => null)
      const utteranceId = spoken == null ? null : String(spoken)
      await new Promise<void>(resolve => {
        let settled = false
        const started = Date.now()
        const finish = (event?: {utteranceId?: number | string}) => {
          if (
            utteranceId &&
            event?.utteranceId != null &&
            String(event.utteranceId) !== utteranceId
          ) {
            return
          }
          if (settled || (event && Date.now() - started < 400)) {
            return
          }
          settled = true
          subscription.remove()
          resolve()
        }
        const subscription = Tts.addEventListener('tts-finish', finish)
        const spokenFor = Math.min(2400, Math.max(700, text.length * 55))
        setTimeout(() => finish(), spokenFor)
      })
    } finally {
      setTalking(false)
    }
  }, [])

  const showCard = useCallback(() => {
    slide.setValue(36)
    Animated.spring(slide, {
      toValue: 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 7,
    }).start()
  }, [slide])

  const finishListening = useCallback(
    async (values: string[]) => {
      if (handledRef.current || phaseRef.current !== 'listening') {
        return
      }
      handledRef.current = true
      if (listenTimer.current) {
        clearTimeout(listenTimer.current)
        listenTimer.current = null
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current)
        silenceTimer.current = null
      }
      Voice?.stop().catch(() => undefined)
      const current = SAY_WORDS[indexRef.current]
      if (!current) {
        return
      }
      const recorded = [...heardLines.current, ...values]
      const match = recorded.find(value => matchesWord(value, current.word))
      if (match) {
        setHeard(match)
        setPhase('correct')
        setStars(indexRef.current + 1)
        await wait(280)
        const next = indexRef.current + 1
        indexRef.current = next
        setHeard('')
        setIndex(next)
        if (next >= SAY_WORDS.length) {
          setPhase('done')
          return
        }
        showCard()
        return
      }
      const heardText = recorded
        .map(value => value.trim())
        .filter(Boolean)
        .sort((left, right) => right.length - left.length)[0] ?? ''
      if (!heardText) {
        setHeard('')
        setPhase('empty')
        return
      }
      setHeard(heardText)
      setPhase('wrong')
    },
    [showCard, speak],
  )

  useEffect(() => {
    finishRef.current = finishListening
  }, [finishListening])

  useEffect(() => {
    if (!Voice) {
      return
    }
    const matchSoon = () => {
      if (handledRef.current) {
        return
      }
      if (listenTimer.current) {
        clearTimeout(listenTimer.current)
      }
      listenTimer.current = setTimeout(() => finishRef.current(heardLines.current), 280)
    }
    const endAfterSpeech = () => {
      if (handledRef.current || phaseRef.current !== 'listening') {
        return
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current)
        silenceTimer.current = null
      }
      if (!stoppedRef.current) {
        stoppedRef.current = true
        Voice.stop().catch(() => undefined)
      }
      matchSoon()
    }
    const remember = (raw?: string[] | string) => {
      const values = Array.isArray(raw) ? raw : raw ? [String(raw)] : []
      if (!values.length) {
        return
      }
      const phase = phaseRef.current
      if (phase !== 'listening' && phase !== 'wrong' && phase !== 'empty') {
        return
      }
      heardLines.current.push(...values)
      const current = SAY_WORDS[indexRef.current]
      if ((phase === 'wrong' || phase === 'empty') && current && values.some(value => matchesWord(value, current.word))) {
        handledRef.current = false
        phaseRef.current = 'listening'
        finishRef.current(values)
        return
      }
      if (phase !== 'listening' || handledRef.current || stoppedRef.current) {
        return
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current)
      }
      silenceTimer.current = setTimeout(endAfterSpeech, 420)
    }
    Voice.onSpeechPartialResults = event => {
      remember(event.value)
    }
    Voice.onSpeechResults = event => {
      remember(event.value)
    }
    Voice.onSpeechEnd = () => {
      if (phaseRef.current !== 'listening' || handledRef.current) {
        return
      }
      if (heardLines.current.length === 0 && Date.now() - startedRef.current < 350) {
        return
      }
      endAfterSpeech()
    }
    Voice.onSpeechError = event => {
      const message = event.error?.message?.toLowerCase() ?? ''
      if (message.includes('denied') || message.includes('permission') || message.includes('not authorized')) {
        handledRef.current = true
        setPhase('denied')
        return
      }
      if (phaseRef.current === 'listening' && !handledRef.current) {
        endAfterSpeech()
      }
    }
    return () => {
      Voice.cancel().catch(() => undefined)
      Voice.destroy().then(() => Voice.removeAllListeners()).catch(() => undefined)
      safeCall(() => Tts?.stop(false))
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const readyVoice = async () => {
      if (Voice && Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        micReady.current = granted === PermissionsAndroid.RESULTS.GRANTED
      }
      if (cancelled) {
        return
      }
    }
    readyVoice()
    return () => {
      cancelled = true
    }
  }, [])

  const teach = useCallback(async (wordIndex: number) => {
    const id = teachId.current + 1
    teachId.current = id
    setPhase('teach')
    const word = SAY_WORDS[wordIndex]
    if (!word) {
      return
    }
    await speak(`${word.letter} for ${word.word}. Say it with me.`)
    if (teachId.current !== id) {
      return
    }
    setPhase('ready')
  }, [speak])

  useEffect(() => {
    teach(index)
  }, [index, teach])

  useEffect(() => {
    if (phase !== 'listening' && phase !== 'teach') {
      pulse.setValue(1)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1.12, duration: 320, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 1, duration: 320, useNativeDriver: true}),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
    }
  }, [phase, pulse])

  const beginListen = () => {
    if (!Voice || !micReady.current) {
      setPhase('denied')
      return
    }
    handledRef.current = false
    stoppedRef.current = false
    startedRef.current = Date.now()
    heardLines.current = []
    setHeard('')
    setPhase('listening')
    if (listenTimer.current) {
      clearTimeout(listenTimer.current)
      listenTimer.current = null
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current)
    }
    silenceTimer.current = setTimeout(() => {
      if (phaseRef.current !== 'listening' || handledRef.current || heardLines.current.length > 0) {
        return
      }
      if (!stoppedRef.current) {
        stoppedRef.current = true
        Voice.stop().catch(() => undefined)
      }
      listenTimer.current = setTimeout(() => finishRef.current(heardLines.current), 200)
    }, 2500)
    Voice.start('en-US', LISTEN_OPTIONS).catch(() => {
      if (phaseRef.current !== 'listening') {
        return
      }
      handledRef.current = true
      setPhase('denied')
    })
  }

  const onMic = () => {
    if (phaseRef.current !== 'ready' && phaseRef.current !== 'wrong' && phaseRef.current !== 'empty') {
      return
    }
    safeCall(() => Tts?.stop(false))
    beginListen()
  }

  const onAgain = () => {
    setStars(0)
    setHeard('')
    showCard()
    if (indexRef.current === 0) {
      teach(0)
      return
    }
    indexRef.current = 0
    setIndex(0)
  }

  const status = statusCopy(phase, item, heard)
  const buddyMode: BuddyMode =
    phase === 'listening'
      ? 'listen'
      : talking
        ? 'talk'
        : phase === 'correct' || phase === 'done'
          ? 'happy'
          : phase === 'wrong' || phase === 'empty'
            ? 'try'
            : 'idle'

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
            <Icon name="mic" size={12} color={GOLD_INK} />
            <Text style={styles.brandText}>Say it with me</Text>
          </View>
          <View style={styles.backSpacer} />
        </View>

        {speaking && item ? (
          <Animated.View style={[styles.card, {transform: [{translateX: slide}]}]}>
            <LinearGradient
              colors={['#7ED0FF', '#D7F3FF', '#FFF6EA']}
              style={styles.sky}>
              <Drift delay={0} travel={8} style={styles.cloudA}>
                <View style={styles.cloud} />
              </Drift>
              <Drift delay={200} travel={6} style={styles.cloudB}>
                <View style={[styles.cloud, styles.cloudSmall]} />
              </Drift>
              <View style={styles.sun} />
              <View style={styles.starPill}>
                <Icon name="star" size={16} color="#E0A51A" />
                <Text style={styles.starCount}>{stars} stars</Text>
              </View>
              <SayBuddy mode={buddyMode} />
              <Animated.View style={{transform: [{scale: phase === 'teach' ? pulse : 1}]}}>
                <WordPicture letter={item.letter} />
              </Animated.View>
              <View style={styles.bubble}>
                <Text style={styles.phrase}>
                  {phase === 'teach' ? 'Say it with me' : `${item.letter} for ${item.word}`}
                </Text>
              </View>
              <RunningWord word={item.word} />
              <Text style={[styles.status, {color: status.color}]}>{status.text}</Text>
            </LinearGradient>
          </Animated.View>
        ) : (
          <View style={styles.card}>
            <LinearGradient colors={['#7ED0FF', '#FFF6EA']} style={styles.sky}>
              <SayBuddy mode="happy" />
              <Text style={styles.phrase}>You said every word.</Text>
              <Text style={[styles.status, {color: GREEN}]}>Wonderful listening.</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.dock}>
          {speaking && (phase === 'ready' || phase === 'wrong' || phase === 'empty' || phase === 'listening') ? (
            <Animated.View style={{transform: [{scale: phase === 'listening' ? pulse : 1}]}}>
              <TouchableOpacity
                style={[styles.mic, phase === 'listening' && styles.micOn]}
                onPress={onMic}
                disabled={phase === 'listening'}
                accessibilityRole="button"
                accessibilityLabel={item ? `Say ${item.word}` : 'Say the word'}>
                <Icon name={phase === 'listening' ? 'mic' : 'mic-outline'} size={30} color={GOLD_INK} />
                <Text style={styles.micLabel}>
                  {phase === 'listening' ? 'Listening' : item ? `Say ${item.word}` : 'Say'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : speaking ? (
            <View style={styles.listenNote}>
              <Text style={styles.listenText}>Listen first</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.again} onPress={onAgain} accessibilityRole="button">
              <Text style={styles.againText}>Say them again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

const LISTEN_OPTIONS = {
  EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 200,
  EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 500,
  EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 400,
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const statusCopy = (phase: Phase, item: (typeof SAY_WORDS)[number] | undefined, heard: string) => {
  if (!item || phase === 'done') {
    return {text: 'You can start again from A.', color: GREEN}
  }
  if (phase === 'teach') {
    return {text: `Listen. ${item.letter} for ${item.word}.`, color: '#1E4E79'}
  }
  if (phase === 'listening') {
    return {text: `Your turn. Say ${item.word}.`, color: '#1E4E79'}
  }
  if (phase === 'correct') {
    return {text: 'Yay! A star!', color: GREEN}
  }
  if (phase === 'wrong') {
    return {text: heard ? `I heard “${heard}”. Say ${item.word}.` : `Say ${item.word}.`, color: CORAL}
  }
  if (phase === 'empty') {
    return {text: `Say ${item.word}.`, color: CORAL}
  }
  if (phase === 'denied') {
    return {text: 'Turn on the microphone, then try again.', color: CORAL}
  }
  return {text: `Your turn. Say ${item.word}.`, color: MUTED}
}

export default SayItScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#D7F3FF',
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  card: {
    flex: 1,
    marginTop: 16,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#7ED0FF',
  },
  sky: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sun: {
    position: 'absolute',
    top: 18,
    right: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFE566',
  },
  cloudA: {
    position: 'absolute',
    top: 28,
    left: 18,
  },
  cloudB: {
    position: 'absolute',
    top: 58,
    right: 78,
  },
  cloud: {
    width: 54,
    height: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cloudSmall: {
    width: 36,
    height: 14,
  },
  bubble: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  starCount: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: GOLD_INK,
  },
  phrase: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: INK,
    textAlign: 'center',
  },
  status: {
    marginTop: 16,
    fontFamily: FONTS.Medium,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  dock: {
    alignItems: 'center',
    marginTop: 22,
  },
  mic: {
    minWidth: 220,
    height: 74,
    borderRadius: 37,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
  },
  micLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: GOLD_INK,
  },
  micOn: {
    backgroundColor: '#FFE08A',
  },
  listenNote: {
    minHeight: 74,
    borderRadius: 37,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  listenText: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: '#1E4E79',
  },
  again: {
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: GOLD,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  againText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
})
