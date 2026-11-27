import React, { FC, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'

type Part = 'ear' | 'eye' | 'tummy' | 'paw'
type Tool = 'bandage' | 'brush' | 'soap'

const CASES: {say: string; part: Part; tool: Tool; toolSay: string}[] = [
  {say: 'Bunny’s ear hurts. Tap the ear.', part: 'ear', tool: 'bandage', toolSay: 'Pick the bandage.'},
  {say: 'Bear’s tummy hurts. Tap the tummy.', part: 'tummy', tool: 'bandage', toolSay: 'Pick the bandage.'},
]

const PARTS: {id: Part; label: string}[] = [
  {id: 'ear', label: 'Ear'},
  {id: 'eye', label: 'Eye'},
  {id: 'tummy', label: 'Tummy'},
  {id: 'paw', label: 'Paw'},
]

const TOOLS: {id: Tool; label: string; fill: string}[] = [
  {id: 'bandage', label: 'Bandage', fill: '#F8D7DA'},
  {id: 'brush', label: 'Brush', fill: '#DBEAFE'},
  {id: 'soap', label: 'Soap', fill: '#DCFCE7'},
]

const DoctorScreen: FC = () => {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'part' | 'tool' | 'wash' | 'brush' | 'done'>('part')
  const [washes, setWashes] = useState(0)
  const patient = CASES[step]

  useEffect(() => {
    if (phase === 'part') {
      speak(patient.say)
    } else if (phase === 'tool') {
      speak(patient.toolSay)
    } else if (phase === 'wash') {
      speak('Wash your hands. Tap the soap three times.')
    } else if (phase === 'brush') {
      speak('Brush your teeth. Tap the brush.')
    }
  }, [patient.say, patient.toolSay, phase, step])

  const afterTool = () => {
    if (step + 1 < CASES.length) {
      setStep(value => value + 1)
      setPhase('part')
      return
    }
    setPhase('wash')
  }

  if (phase === 'done') {
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer
          title="Kind doctor"
          detail="You helped every friend."
          nextLabel="Help again"
          onNext={() => {
            setStep(0)
            setPhase('part')
            setWashes(0)
          }}
        />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar
          title="Little doctor"
          onListen={() => {
            if (phase === 'part') {
              speak(patient.say)
            } else if (phase === 'tool') {
              speak(patient.toolSay)
            } else if (phase === 'wash') {
              speak('Wash your hands. Tap the soap three times.')
            } else {
              speak('Brush your teeth. Tap the brush.')
            }
          }}
        />
        <Text style={styles.prompt}>
          {phase === 'part' ? patient.say : phase === 'tool' ? patient.toolSay : phase === 'wash' ? 'Tap the soap 3 times.' : 'Tap the brush.'}
        </Text>
        {phase === 'part' ? (
          <View style={styles.grid}>
            {PARTS.map(part => (
              <TouchableOpacity
                key={part.id}
                style={styles.card}
                onPress={() => {
                  if (part.id !== patient.part) {
                    speak('Try another spot.')
                    return
                  }
                  speak('Yes.')
                  setPhase('tool')
                }}
                accessibilityRole="button"
                accessibilityLabel={part.label}>
                <Text style={styles.cardText}>{part.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {phase === 'tool' ? (
          <View style={styles.grid}>
            {TOOLS.map(tool => (
              <TouchableOpacity
                key={tool.id}
                style={styles.card}
                onPress={() => {
                  if (tool.id !== patient.tool) {
                    speak('Try a different tool.')
                    return
                  }
                  speak('That helps.')
                  afterTool()
                }}
                accessibilityRole="button"
                accessibilityLabel={tool.label}>
                <View style={[styles.tool, {backgroundColor: tool.fill}]} />
                <Text style={styles.cardText}>{tool.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {phase === 'wash' ? (
          <TouchableOpacity
            style={styles.big}
            onPress={() => {
              const next = washes + 1
              setWashes(next)
              if (next >= 3) {
                speak('Clean hands.')
                setPhase('brush')
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Soap">
            <Text style={styles.bigText}>Soap {washes}/3</Text>
          </TouchableOpacity>
        ) : null}
        {phase === 'brush' ? (
          <TouchableOpacity
            style={styles.big}
            onPress={() => {
              speak('Sparkly teeth.')
              setPhase('done')
            }}
            accessibilityRole="button"
            accessibilityLabel="Brush">
            <Text style={styles.bigText}>Brush</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </CustomSafeAreaView>
  )
}

export default DoctorScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 16},
  prompt: {marginTop: 20, textAlign: 'center', fontFamily: FONTS.Bold, fontSize: 22, color: '#1C1917'},
  grid: {flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'space-between'},
  card: {
    width: '47%',
    minHeight: 120,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 10,
  },
  cardText: {fontFamily: FONTS.Bold, fontSize: 18, color: '#7A3EAE'},
  tool: {width: 36, height: 36, borderRadius: 12, marginBottom: 8},
  big: {
    marginTop: 40,
    backgroundColor: '#F3C04D',
    borderRadius: 28,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {fontFamily: FONTS.Bold, fontSize: 28, color: '#3A2E12'},
})
