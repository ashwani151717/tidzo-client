import React, { FC, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const ROUNDS = [
  {ask: 'B', count: 3},
  {ask: 'D', count: 4},
  {ask: 'M', count: 4},
  {ask: 'S', count: 6},
  {ask: 'P', count: 6},
]

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

const FindLetterScreen: FC = () => {
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const current = ROUNDS[round]
  const letters = useMemo(() => {
    const extras = shuffle(LETTERS.filter(item => item !== current.ask)).slice(0, current.count - 1)
    return shuffle([current.ask, ...extras])
  }, [current.ask, current.count, round])

  useEffect(() => {
    speak(`Where is the letter ${current.ask}?`)
  }, [current.ask, round])

  const pick = (letter: string) => {
    if (letter !== current.ask) {
      speak('Try again.')
      return
    }
    setStars(value => value + 1)
    speak('Yes!')
    if (round + 1 >= ROUNDS.length) {
      setTimeout(() => setDone(true), 450)
      return
    }
    setTimeout(() => setRound(value => value + 1), 450)
  }

  if (done) {
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer title="You found them" detail={`${stars} letters.`} nextLabel="Play again" onNext={() => { setDone(false); setRound(0); setStars(0) }} />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Find the letter" stars={stars} onListen={() => speak(`Where is the letter ${current.ask}?`)} />
        <Text style={styles.prompt}>Where is {current.ask}?</Text>
        <View style={styles.grid}>
          {letters.map((letter, index) => (
            <TouchableOpacity
              key={letter}
              style={[styles.tile, {backgroundColor: ['#F7C5D4', '#F8E3A0', '#B7E4C7', '#DCC8F5'][index % 4]}]}
              onPress={() => pick(letter)}
              accessibilityRole="button"
              accessibilityLabel={letter}>
              <Text style={styles.letter}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default FindLetterScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 12},
  prompt: {marginTop: 20, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 26, color: '#1C1917'},
  grid: {flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 12},
  tile: {
    width: 104,
    height: 104,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {fontFamily: FONTS.Bold, fontSize: 40, color: '#1C1917'},
})
