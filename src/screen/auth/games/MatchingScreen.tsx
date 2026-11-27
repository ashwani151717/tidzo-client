import React, { FC, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'
import { MatchKind, MatchPiece } from './MatchPiece'

type Choice = {id: string; label: string}

const SETS: Record<MatchKind, {prompt: (label: string) => string; pairs: [Choice, Choice][]}> = {
  shapes: {
    prompt: label => `Find the same ${label}.`,
    pairs: [
      [{id: 'circle', label: 'circle'}, {id: 'circle', label: 'circle'}],
      [{id: 'square', label: 'square'}, {id: 'square', label: 'square'}],
      [{id: 'triangle', label: 'triangle'}, {id: 'triangle', label: 'triangle'}],
      [{id: 'star', label: 'star'}, {id: 'star', label: 'star'}],
    ],
  },
  colors: {
    prompt: label => `Find ${label}.`,
    pairs: [
      [{id: 'red', label: 'red'}, {id: 'red', label: 'red'}],
      [{id: 'blue', label: 'blue'}, {id: 'blue', label: 'blue'}],
      [{id: 'yellow', label: 'yellow'}, {id: 'yellow', label: 'yellow'}],
      [{id: 'green', label: 'green'}, {id: 'green', label: 'green'}],
    ],
  },
  numbers: {
    prompt: label => `Find ${label}.`,
    pairs: [
      [{id: '2', label: '2'}, {id: '2', label: '••'}],
      [{id: '3', label: '3'}, {id: '3', label: '•••'}],
      [{id: '1', label: '1'}, {id: '1', label: '•'}],
      [{id: '4', label: '4'}, {id: '4', label: '••••'}],
    ],
  },
  alphabet: {
    prompt: label => `Find small ${label}.`,
    pairs: [
      [{id: 'A', label: 'A'}, {id: 'A', label: 'a'}],
      [{id: 'B', label: 'B'}, {id: 'B', label: 'b'}],
      [{id: 'D', label: 'D'}, {id: 'D', label: 'd'}],
      [{id: 'M', label: 'M'}, {id: 'M', label: 'm'}],
    ],
  },
  animals: {
    prompt: label => `Find the ${label}.`,
    pairs: [
      [{id: 'cat', label: 'cat'}, {id: 'cat', label: 'cat'}],
      [{id: 'dog', label: 'dog'}, {id: 'dog', label: 'dog'}],
      [{id: 'bird', label: 'bird'}, {id: 'bird', label: 'bird'}],
      [{id: 'fish', label: 'fish'}, {id: 'fish', label: 'fish'}],
    ],
  },
}

const KINDS: MatchKind[] = ['shapes', 'colors', 'numbers', 'alphabet', 'animals']

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap]
    copy[swap] = current
  }
  return copy
}

const MatchingScreen: FC = () => {
  const route = useRoute()
  const initial = (route.params as {kind?: MatchKind} | undefined)?.kind ?? 'shapes'
  const [kind, setKind] = useState<MatchKind>(initial)
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const pack = SETS[kind]
  const puzzle = useMemo(() => {
    const pair = pack.pairs[round % pack.pairs.length]
    const others = shuffle(pack.pairs.filter(item => item[1].id !== pair[1].id)).slice(0, 2).map(item => item[1])
    return {
      ask: pair[0],
      answer: pair[1],
      choices: shuffle([pair[1], ...others]),
      prompt: pack.prompt(pair[0].label),
    }
  }, [kind, pack, round])

  const pick = (id: string) => {
    if (id !== puzzle.answer.id) {
      setNote('Try again.')
      speak('Try again.')
      return
    }
    const nextStars = stars + 1
    setStars(nextStars)
    setNote('Yes!')
    speak('Yes!')
    if (round + 1 >= pack.pairs.length) {
      setTimeout(() => setDone(true), 500)
      return
    }
    setTimeout(() => {
      setNote('')
      setRound(value => value + 1)
    }, 500)
  }

  if (done) {
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer
          title="All matched"
          detail={`${stars} stars.`}
          nextLabel="Play again"
          onNext={() => {
            setDone(false)
            setRound(0)
            setStars(0)
            setNote('')
          }}
        />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Matching" stars={stars} onListen={() => speak(puzzle.prompt)} />
        <View style={styles.kinds}>
          {KINDS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setKind(item)
                setRound(0)
                setNote('')
                speak(SETS[item].prompt(SETS[item].pairs[0][0].label))
              }}
              style={[styles.kind, kind === item && styles.kindOn]}>
              <Text style={styles.kindText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.prompt}>{puzzle.prompt}</Text>
        <View style={styles.target}>
          <MatchPiece kind={kind} id={puzzle.ask.id} label={puzzle.ask.label} />
        </View>
        <View style={styles.choices}>
          {puzzle.choices.map(choice => (
            <TouchableOpacity
              key={choice.id}
              style={styles.choice}
              onPress={() => pick(choice.id)}
              accessibilityRole="button"
              accessibilityLabel={choice.label}>
              <MatchPiece kind={kind === 'numbers' || kind === 'alphabet' ? kind : kind} id={choice.id} label={choice.label} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.note}>{note}</Text>
      </View>
    </CustomSafeAreaView>
  )
}

export default MatchingScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 12},
  kinds: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12},
  kind: {backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6},
  kindOn: {backgroundColor: '#F3C04D'},
  kindText: {fontFamily: FONTS.SemiBold, fontSize: 12, color: '#1C1917', textTransform: 'capitalize'},
  prompt: {marginTop: 14, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 20, color: '#1C1917'},
  target: {
    alignSelf: 'center',
    marginTop: 12,
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choices: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 18},
  choice: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {marginTop: 12, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 16, color: '#1F8A4C', minHeight: 24},
})
