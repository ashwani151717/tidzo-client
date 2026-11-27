import React, { FC } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomSafeAreaView from '../../../components/global/CustomAreaView'
import { FONTS } from '../../../constants/Fonts'
import { navigate } from '../../../utils/NavigationUtils'
import { KidBar } from '../kid/KidBar'
import { speak } from '../kidSpeech'

const GAMES = [
  {route: 'ListenGuessScreen', title: 'Listen and guess', hint: 'Hear a clue, then tap', icon: 'headset-outline', tint: '#FFF1D6', ink: '#C47A12'},
  {route: 'MatchingScreen', title: 'Matching', hint: 'Find the pair', icon: 'copy-outline', tint: '#E4F7FF', ink: '#1E4E79', params: {kind: 'shapes'}},
  {route: 'ColorFindScreen', title: 'Find the colour', hint: 'Tap the colour you hear', icon: 'color-palette-outline', tint: '#FFE8E0', ink: '#D3542C'},
  {route: 'FindLetterScreen', title: 'Find the letter', hint: 'Tap the letter you hear', icon: 'text-outline', tint: '#FFE8F1', ink: '#C43B6E'},
  {route: 'CountObjectsScreen', title: 'Count the objects', hint: 'How many do you see?', icon: 'calculator-outline', tint: '#E7F8EE', ink: '#1F8A4C'},
  {route: 'GroceryScreen', title: 'Little grocery', hint: 'Fill the basket', icon: 'basket-outline', tint: '#FFF1D6', ink: '#C47A12'},
  {route: 'DoctorScreen', title: 'Little doctor', hint: 'Help the animals', icon: 'medkit-outline', tint: '#F3E8FF', ink: '#7A3EAE'},
]

const GamesHomeScreen: FC = () => (
  <CustomSafeAreaView style={styles.screen}>
    <View style={styles.body}>
      <KidBar title="Games" onListen={() => speak('Pick a game.')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.route}
            activeOpacity={0.85}
            style={[styles.card, {backgroundColor: game.tint}]}
            onPress={() => navigate(game.route, game.params)}
            accessibilityRole="button"
            accessibilityLabel={game.title}>
            <View style={styles.icon}>
              <Icon name={game.icon} size={28} color={game.ink} />
            </View>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.hint}>{game.hint}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </CustomSafeAreaView>
)

export default GamesHomeScreen

const styles = StyleSheet.create({
  screen: {backgroundColor: '#FFF6EA', padding: 0},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 8},
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 16,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    minHeight: 156,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    padding: 14,
    justifyContent: 'flex-end',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {fontFamily: FONTS.Bold, fontSize: 17, color: '#1C1917'},
  hint: {marginTop: 2, fontFamily: FONTS.Regular, fontSize: 13, color: '#3A342C'},
})
