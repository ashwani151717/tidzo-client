import React, { FC, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { goBack, navigate } from '../../../utils/NavigationUtils'
import { KidBar, KidCheer } from '../kid/KidBar'
import { speak } from '../kidSpeech'
import { Glyph, glyphById, letterGlyphs, numberGlyphs } from './glyphs'
import { hasPractised, markPractised, traceGoal, traceReach } from './progress'
import { TraceBoard } from './TraceBoard'

const nextGlyph = (glyph: Glyph) => {
  const list = glyph.kind === 'letter' ? letterGlyphs : numberGlyphs
  const index = list.findIndex(item => item.id === glyph.id)
  return list[(index + 1) % list.length]
}

const TraceBoardScreen: FC = () => {
  const route = useRoute()
  const id = (route.params as {id?: string} | undefined)?.id
  const free = id === 'free'
  const glyph = free ? null : glyphById(id)
  const [attempt, setAttempt] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (free) {
      speak('Draw anything you like.')
      return
    }
    if (glyph) {
      speak(hasPractised(glyph) ? `Write ${glyph.label} on the dots.` : `Trace ${glyph.label}. Follow the dots.`)
    }
    return () => undefined
  }, [free, glyph, attempt])

  if (!free && !glyph) {
    return null
  }

  const finish = () => {
    if (!glyph) {
      return
    }
    markPractised(glyph)
    setDone(true)
    speak(`Wonderful. You wrote ${glyph.label}.`)
  }

  if (done && glyph) {
    const upcoming = nextGlyph(glyph)
    return (
      <CustomSafeAreaView style={styles.screen}>
        <KidCheer
          title="Wonderful!"
          detail={`You wrote ${glyph.label}.`}
          nextLabel={`Next, ${upcoming.label}`}
          onNext={() => navigate('StrokeLessonScreen', {id: upcoming.id})}
          onAgain={() => {
            setDone(false)
            setAttempt(value => value + 1)
          }}
        />
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title={free ? 'Free drawing' : glyph?.label ?? 'Write'} />
        <Text style={styles.caption}>
          {free ? 'Draw anything you like.' : 'Trace on the dots.'}
        </Text>
        <TraceBoard
          key={`${id}-${attempt}`}
          glyph={glyph ?? null}
          reach={glyph ? traceReach(glyph) : 8}
          goal={glyph ? traceGoal(glyph) : 1}
          showHint={glyph ? !hasPractised(glyph) : false}
          onDone={finish}
        />
        <View style={styles.row}>
          {glyph ? (
            <TouchableOpacity
              onPress={() => navigate('StrokeLessonScreen', {id: glyph.id})}
              accessibilityRole="button">
              <Text style={styles.link}>Watch again</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => goBack()} accessibilityRole="button">
              <Text style={styles.link}>All done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default TraceBoardScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF6EA',
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  caption: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#1C1917',
  },
  row: {
    alignItems: 'center',
    marginTop: 4,
  },
  link: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: '#1E4E79',
  },
})
