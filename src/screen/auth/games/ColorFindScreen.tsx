import React, { FC, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'

const OBJECTS = [
  {id: 'apple', name: 'apple', color: 'red', fill: '#F04438'},
  {id: 'ball', name: 'ball', color: 'blue', fill: '#3B82F6'},
  {id: 'sun', name: 'sun', color: 'yellow', fill: '#F3C04D'},
  {id: 'leaf', name: 'leaf', color: 'green', fill: '#22C55E'},
  {id: 'grape', name: 'grape', color: 'purple', fill: '#A855F7'},
  {id: 'cup', name: 'cup', color: 'red', fill: '#E11D48'},
]

const ASKS = ['red', 'blue', 'yellow', 'green', 'purple']

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

const ColorFindScreen: FC = () => {
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [done, setDone] = useState(false)
  const ask = ASKS[round % ASKS.length]
  const choices = useMemo(() => {
    const match = OBJECTS.find(item => item.color === ask) ?? OBJECTS[0]
    const rest = shuffle(OBJECTS.filter(item => item.color !== ask)).slice(0, 3)
    return shuffle([match, ...rest])
  }, [ask, round])

  useEffect(() => {
    speak(`Can you find something ${ask}?`)
  }, [ask, round])

  const pick = (color: string) => {
    if (color !== ask) {
      speak('Try again.')
      return
    }
    const next = stars + 1
    setStars(next)
    speak('Yes!')
    if (round + 1 >= ASKS.length) {
      setTimeout(() => setDone(true), 450)
      return
    }
    setTimeout(() => setRound(value => value + 1), 450)
  }

  if (done) {
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer title="Nice looking" detail={`${stars} colours found.`} nextLabel="Play again" onNext={() => { setDone(false); setRound(0); setStars(0) }} />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Colours" stars={stars} onListen={() => speak(`Can you find something ${ask}?`)} />
        <Text style={styles.prompt}>Can you find something {ask}?</Text>
        <View style={styles.grid}>
          {choices.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => pick(item.color)}
              accessibilityRole="button"
              accessibilityLabel={item.name}>
              <View style={[styles.blob, {backgroundColor: item.fill}]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default ColorFindScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 12},
  prompt: {marginTop: 28, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 24, color: '#1C1917'},
  grid: {flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'space-between'},
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F3EDE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  blob: {width: 72, height: 72, borderRadius: 36},
})
