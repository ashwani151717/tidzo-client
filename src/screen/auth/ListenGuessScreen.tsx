import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import CustomSafeAreaView from '../../components/global/CustomAreaView'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { goBack, navigate } from '../../utils/NavigationUtils'
import { GUESS_CATEGORIES } from './guessCatalog'

const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'

const ListenGuessScreen: FC = () => {
  return (
    <CustomSafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Icon name="chevron-back" size={20} color={INK} />
          </TouchableOpacity>
          <View style={styles.brand}>
            <Icon name="headset-outline" size={12} color={GOLD_INK} />
            <Text style={styles.brandText}>Listen and guess</Text>
          </View>
          <View style={styles.backSpacer} />
        </View>

        <Text style={styles.title}>Hear it. Tap it.</Text>
        <Text style={styles.subtitle}>Pick a game. A right guess gets a celebration.</Text>

        <View style={styles.grid}>
          {GUESS_CATEGORIES.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => navigate('GuessPlayScreen', {category: item.id})}
              style={[styles.card, {backgroundColor: item.tint}]}
              accessibilityRole="button"
              accessibilityLabel={`${item.title} guess`}>
              <View style={styles.icon}>
                <Icon name={item.icon} size={26} color={item.ink} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardHint}>{item.hint}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default ListenGuessScreen

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF6EA',
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  back: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F3EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  brandText: {
    fontFamily: FONTS.Bold,
    fontSize: 13,
    color: GOLD_INK,
  },
  title: {
    marginTop: 22,
    fontFamily: FONTS.Bold,
    fontSize: 30,
    color: INK,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    lineHeight: 21,
    color: MUTED,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 18,
    color: INK,
  },
  cardHint: {
    marginTop: 2,
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: MUTED,
  },
})
