import React, { FC, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'

const ROUNDS = [
  {name: 'apples', fill: '#F04438', count: 2},
  {name: 'stars', fill: '#F3C04D', count: 3},
  {name: 'balls', fill: '#3B82F6', count: 1},
  {name: 'leaves', fill: '#22C55E', count: 4},
  {name: 'animals', fill: '#C47A12', count: 5},
]

const shuffle = (items: number[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap]
    copy[swap] = current
  }
  return copy
}

const CountObjectsScreen: FC = () => {
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const current = ROUNDS[round]
  const choices = useMemo(() => {
    const nearby = [1, 2, 3, 4, 5].filter(item => item !== current.count).slice(0, 3)
    return shuffle([current.count, ...nearby])
  }, [current.count, round])

  useEffect(() => {
    speak(`How many ${current.name}?`)
  }, [current.name, round])

  const pick = (count: number) => {
    if (count !== current.count) {
      speak('Try again. Count them again.')
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
        <KidCheer title="Good counting" detail={`${stars} stars.`} nextLabel="Play again" onNext={() => { setDone(false); setRound(0); setStars(0) }} />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Count" stars={stars} onListen={() => speak(`How many ${current.name}?`)} />
        <Text style={styles.prompt}>How many {current.name}?</Text>
        <View style={styles.objects}>
          {Array.from({length: current.count}, (_, index) => (
            <View key={index} style={[styles.object, {backgroundColor: current.fill}]} />
          ))}
        </View>
        <View style={styles.choices}>
          {choices.map(count => (
            <TouchableOpacity key={count} style={styles.choice} onPress={() => pick(count)} accessibilityRole="button">
              <Text style={styles.choiceText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default CountObjectsScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 16},
  prompt: {marginTop: 18, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 24, color: '#1C1917'},
  objects: {flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 12},
  object: {width: 54, height: 54, borderRadius: 27},
  choices: {flexDirection: 'row', gap: 12},
  choice: {
    flex: 1,
    minHeight: 76,
    borderRadius: 24,
    backgroundColor: '#B7E4C7',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {fontFamily: FONTS.Bold, fontSize: 28, color: '#1C1917'},
})
