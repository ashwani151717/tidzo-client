import React, { FC, useCallback, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { navigate } from '../../../utils/NavigationUtils'
import { KidBar } from '../kid/KidBar'
import { speak } from '../kidSpeech'
import { letterGlyphs, numberGlyphs } from './glyphs'
import { hasPractised, readPractice } from './progress'

const WhiteboardHomeScreen: FC = () => {
  const [kind, setKind] = useState<'letter' | 'number'>('letter')
  const [book, setBook] = useState(readPractice())
  const items = kind === 'letter' ? letterGlyphs : numberGlyphs
  const doneCount = kind === 'letter' ? book.letters.length : book.numbers.length

  useFocusEffect(
    useCallback(() => {
      setBook(readPractice())
      speak(kind === 'letter' ? 'Pick a letter to write.' : 'Pick a number to write.')
    }, [kind]),
  )

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title="Whiteboard" stars={doneCount} />
        <View style={styles.switch}>
          <TouchableOpacity
            style={[styles.chip, kind === 'letter' && styles.chipOn]}
            onPress={() => setKind('letter')}
            accessibilityRole="button">
            <Text style={styles.chipText}>Letters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, kind === 'number' && styles.chipOn]}
            onPress={() => setKind('number')}
            accessibilityRole="button">
            <Text style={styles.chipText}>Numbers</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {items.map(item => {
            const done = hasPractised(item)
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tile, done && styles.tileDone]}
                onPress={() => {
                  if (done) {
                    navigate('TraceBoardScreen', {id: item.id})
                    return
                  }
                  navigate('StrokeLessonScreen', {id: item.id})
                }}
                accessibilityRole="button"
                accessibilityLabel={item.label}>
                <Text style={styles.tileLabel}>{item.label}</Text>
                {done ? <Icon name="star" size={14} color="#E0A51A" /> : null}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <TouchableOpacity
          style={styles.free}
          onPress={() => navigate('TraceBoardScreen', {id: 'free'})}
          accessibilityRole="button">
          <Icon name="brush" size={18} color="#3A2E12" />
          <Text style={styles.freeText}>Free drawing</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeAreaView>
  )
}

export default WhiteboardHomeScreen

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
  switch: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chipOn: {
    backgroundColor: '#F3C04D',
  },
  chipText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: '#1C1917',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 14,
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#F3EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDone: {
    backgroundColor: '#FFF4CC',
  },
  tileLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#1E4E79',
  },
  free: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3C04D',
    borderRadius: 999,
    paddingVertical: 12,
  },
  freeText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#3A2E12',
  },
})
