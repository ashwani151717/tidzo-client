import React, { FC, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { navigate } from '../../../utils/NavigationUtils'
import { KidBar } from '../kid/KidBar'
import { SayBuddy } from '../SayBuddy'
import { glyphById } from './glyphs'
import { StrokeStage } from './StrokeStage'

const StrokeLessonScreen: FC = () => {
  const route = useRoute()
  const id = (route.params as {id?: string} | undefined)?.id
  const glyph = glyphById(id)
  const [playing, setPlaying] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  if (!glyph) {
    return null
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <KidBar title={glyph.label} />
        <View style={styles.buddy}>
          <SayBuddy mode={playing ? 'talk' : 'idle'} />
        </View>
        <StrokeStage
          glyph={glyph}
          playing={playing}
          replayKey={replayKey}
          onFinished={() => setPlaying(false)}
        />
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.replay}
            onPress={() => {
              setPlaying(true)
              setReplayKey(value => value + 1)
            }}
            accessibilityRole="button"
            accessibilityLabel="Replay">
            <Icon name="refresh" size={18} color="#1E4E79" />
            <Text style={styles.replayText}>Replay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.try}
            onPress={() => navigate('TraceBoardScreen', {id: glyph.id})}
            accessibilityRole="button">
            <Text style={styles.tryText}>My turn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default StrokeLessonScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF6EA',
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  buddy: {
    height: 92,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  replay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  replayText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: '#1E4E79',
  },
  try: {
    flex: 1,
    backgroundColor: '#F3C04D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tryText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#3A2E12',
  },
})
