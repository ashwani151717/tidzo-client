import { Animated, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { goBack, navigate } from '../../utils/NavigationUtils'
import { token_storage } from '../../redux/storage'
import { Drift } from '../../components/kids/SkyHero'

const CREAM = '#FFF6EA'
const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'

const MIX_ID = 'mix'

type AutoScroll = 'twice' | 'once' | 'off'

const TOPICS = [
  {id: MIX_ID, icon: 'layers-outline', title: 'All Mix', hint: 'A little of every lesson', tint: '#E8F1FF', ink: '#1E4E79'},
  {id: 'alphabet', icon: 'text-outline', title: 'Alphabet Learning', hint: 'Letters A to Z', tint: '#FFE8F1', ink: '#C43B6E'},
  {id: 'numbers', icon: 'calculator-outline', title: 'Numbers & Counting', hint: 'Count from 1 to 100', tint: '#E7F8EE', ink: '#1F8A4C'},
  {id: 'fruits-vegetables', icon: 'nutrition-outline', title: 'Fruits & Vegetables', hint: 'Names, colors, and uses', tint: '#FFF1D6', ink: '#C47A12'},
  {id: 'animals', icon: 'paw-outline', title: 'Animals', hint: 'Pets, farm, and wild animals', tint: '#F3E8FF', ink: '#7A3EAE'},
  {id: 'colors', icon: 'color-palette-outline', title: 'Colors', hint: 'Red, blue, green, and more', tint: '#FFE8E0', ink: '#D3542C'},
  {id: 'shapes', icon: 'triangle-outline', title: 'Shapes', hint: 'Circle, square, and triangle', tint: '#E4F7FF', ink: '#1E4E79'},
  {id: 'rhymes', icon: 'musical-notes-outline', title: 'Rhymes', hint: 'Sing along with short rhymes', tint: '#FDE8FF', ink: '#9B3D8A'},
]

const LearningScreen: FC = () => {
  const [topicId, setTopicId] = useState(MIX_ID)
  const [autoScroll, setAutoScroll] = useState<AutoScroll>('once')
  const [pauseOnTap, setPauseOnTap] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const slide = useRef(new Animated.Value(0)).current
  const topic = TOPICS.find(item => item.id === topicId)

  useFocusEffect(
    useCallback(() => {
      setTopicId(MIX_ID)
      setSettingsOpen(false)
    }, []),
  )

  useEffect(() => {
    Animated.timing(slide, {
      toValue: topic ? 0 : 120,
      duration: 280,
      useNativeDriver: true,
    }).start()
  }, [topic, slide])

  const onStart = () => {
    if (!topic) {
      return
    }
    token_storage.set('kid_topic', topic.id)
    navigate('FeedReelScreen', {
      category: topic.id,
      data: [],
      playsBeforeScroll: autoScroll === 'once' ? 1 : autoScroll === 'off' ? 0 : 2,
      pauseOnTap,
    })
  }

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => goBack()}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Back">
              <Icon name="chevron-back" size={20} color={INK} />
            </TouchableOpacity>
            <View style={styles.brand}>
              <Icon name="star" size={12} color={GOLD_INK} />
              <Text style={styles.brandText}>Tidzo</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSettingsOpen(true)}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Video settings">
              <Icon name="settings-outline" size={20} color={INK} />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <View pointerEvents="none" style={styles.sparkles}>
              <Drift delay={0} travel={6} style={styles.sparkleA}>
                <Icon name="star" size={16} color="#FFE566" />
              </Drift>
              <Drift delay={180} travel={7} style={styles.sparkleB}>
                <Icon name="star" size={13} color="#FF8FB8" />
              </Drift>
            </View>
            <Text style={styles.heroKicker}>Step by step</Text>
            <Text style={styles.heroTitle}>Let's learn!</Text>
            <Text style={styles.heroSubtitle}>
              Pick a lesson, then tap Start.
            </Text>
          </View>

          <Text style={styles.lessonHeading}>Pick a lesson</Text>
          <View style={styles.lessonList}>
            {TOPICS.map(item => {
              const selected = topicId === item.id
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setTopicId(item.id)}
                  style={[
                    styles.choice,
                    selected && {backgroundColor: item.tint, borderColor: item.ink},
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{checked: selected}}>
                  <View style={[styles.choiceIcon, {backgroundColor: selected ? '#FFFFFF' : item.tint}]}>
                    <Icon name={item.icon} size={22} color={item.ink} />
                  </View>
                  <View style={styles.choiceCopy}>
                    <Text style={styles.choiceLabel}>{item.title}</Text>
                    <Text style={styles.choiceHint}>{item.hint}</Text>
                  </View>
                  <View style={[styles.check, selected && {borderColor: item.ink, backgroundColor: item.ink}]}>
                    {selected ? <Icon name="checkmark" size={16} color="#FFFFFF" /> : null}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

        </ScrollView>

        <Modal
          visible={settingsOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setSettingsOpen(false)}>
          <View style={styles.settingsBackdrop}>
            <TouchableOpacity
              style={styles.settingsDismiss}
              activeOpacity={1}
              onPress={() => setSettingsOpen(false)}
              accessibilityLabel="Close settings"
            />
            <View style={styles.settingsSheet}>
              <View style={styles.settingsHead}>
                <Text style={styles.sectionTitle}>How videos play</Text>
                <TouchableOpacity
                  onPress={() => setSettingsOpen(false)}
                  style={styles.settingsClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close">
                  <Icon name="close" size={18} color={INK} />
                </TouchableOpacity>
              </View>
              <View style={styles.settingsCard}>
                <View style={styles.settingBlock}>
                  <View style={styles.settingTitleRow}>
                    <View style={[styles.settingIcon, {backgroundColor: '#E8F1FF'}]}>
                      <Icon name="play-skip-forward" size={16} color="#1E4E79" />
                    </View>
                    <Text style={styles.settingTitle}>Autoscroll</Text>
                  </View>
                  <Text style={styles.optionHint}>
                    {autoScroll === 'once'
                      ? 'The next video starts after one play.'
                      : autoScroll === 'off'
                        ? 'The video stays until you swipe.'
                        : 'By default, the next video starts after two plays.'}
                  </Text>
                  <View style={styles.optionRow}>
                    <OptionChip
                      label="Enable"
                      icon="checkmark-circle"
                      selected={autoScroll === 'once'}
                      onPress={() => setAutoScroll('once')}
                    />
                    <OptionChip
                      label="Disable"
                      icon="close-circle"
                      selected={autoScroll === 'off'}
                      onPress={() => setAutoScroll('off')}
                    />
                  </View>
                </View>

                <View style={styles.settingDivider} />

                <View style={styles.settingBlock}>
                  <View style={styles.settingTitleRow}>
                    <View style={[styles.settingIcon, {backgroundColor: '#FFF1D6'}]}>
                      <Icon name="pause" size={16} color="#C47A12" />
                    </View>
                    <Text style={styles.settingTitle}>Pause</Text>
                  </View>
                  <Text style={styles.optionHint}>
                    {pauseOnTap
                      ? 'One tap pauses the video.'
                      : 'One tap does not pause the video.'}
                  </Text>
                  <View style={styles.optionRow}>
                    <OptionChip
                      label="Enable"
                      icon="pause-circle"
                      selected={pauseOnTap}
                      onPress={() => setPauseOnTap(true)}
                    />
                    <OptionChip
                      label="Disable"
                      icon="play-circle"
                      selected={!pauseOnTap}
                      onPress={() => setPauseOnTap(false)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Animated.View
          pointerEvents={topic ? 'auto' : 'none'}
          style={[styles.continueDock, {transform: [{translateY: slide}]}]}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!topic}
            onPress={onStart}
            style={styles.continueButton}
            accessibilityRole="button"
            accessibilityLabel="Start learning">
            <Text style={styles.continueText}>Start learning</Text>
            <Icon name="arrow-forward" size={18} color={GOLD_INK} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </CustomSafeAreaView>
  )
}

const OptionChip = ({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string
  icon: string
  selected: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.option, selected && styles.optionSelected]}
    accessibilityRole="button"
    accessibilityState={{selected}}>
    <Icon name={icon} size={16} color={selected ? GOLD_INK : MUTED} />
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
)

export default LearningScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CREAM,
    padding: 0,
  },
  body: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 108,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  back: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE9A0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  brandText: {
    fontFamily: FONTS.Black,
    fontSize: 13,
    letterSpacing: 0.4,
    color: '#111111',
  },
  hero: {
    backgroundColor: '#D7EEFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    overflow: 'hidden',
  },
  sparkles: {
    ...StyleSheet.absoluteFillObject,
  },
  sparkleA: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  sparkleB: {
    position: 'absolute',
    bottom: 14,
    right: 18,
  },
  heroKicker: {
    fontFamily: FONTS.SemiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: '#1E4E79',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 30,
    lineHeight: 36,
    color: INK,
  },
  heroSubtitle: {
    marginTop: 6,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    lineHeight: 21,
    color: MUTED,
    paddingRight: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: INK,
  },
  lessonHeading: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: INK,
    marginBottom: 12,
  },
  lessonList: {
    gap: 10,
  },
  choice: {
    minHeight: 72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  choiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCopy: {
    flex: 1,
  },
  choiceLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: INK,
  },
  choiceHint: {
    marginTop: 2,
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: MUTED,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#E4DDD0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  settingsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  settingsDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  settingsSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    gap: 12,
  },
  settingsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CREAM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    backgroundColor: '#FFF6EA',
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  settingBlock: {
    gap: 8,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: INK,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F3EEE6',
  },
  optionHint: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  optionSelected: {
    backgroundColor: GOLD,
  },
  optionText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: INK,
  },
  optionTextSelected: {
    color: GOLD_INK,
  },
  continueDock: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 12,
  },
  continueButton: {
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
    shadowColor: '#E0A51A',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  continueText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
})
