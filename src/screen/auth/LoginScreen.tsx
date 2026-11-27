import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
import { FONTS } from '../../constants/Fonts'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { useAppDispatch } from '../../redux/reduxHook'
import { signInWithGoogle } from '../../redux/SocialLogin'
import { navigate } from '../../utils/NavigationUtils'
import LinearGradient from 'react-native-linear-gradient'
import SkyHero from '../../components/kids/SkyHero'
import Animated, { FadeInDown } from 'react-native-reanimated'

const INK = '#1C1917'
const MUTED = '#6F675E'
const GOLD = '#F3C04D'
const GOLD_INK = '#3A2E12'
const CREAM = '#FFF8EE'

const LoginScreen: FC = () => {
  const dispatch = useAppDispatch()
  const [busy, setBusy] = useState(false)

  const onGoogle = async () => {
    if (busy) {
      return
    }
    setBusy(true)
    try {
      await dispatch(signInWithGoogle())
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        pointerEvents="none"
        colors={['#4EB6FF', '#9AD7FF', '#FFF4E4', CREAM]}
        locations={[0, 0.34, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <SkyHero compact />

        <Animated.View entering={FadeInDown.delay(80).duration(520).springify()}>
          <View style={styles.badge}>
            <Icon name="star" size={12} color={GOLD_INK} />
            <Text style={styles.badgeText}>Hi Kids!</Text>
          </View>

          <Text style={styles.title}>Welcome to Tidzo</Text>
          <Text style={styles.subtitle}>
            Short videos made for kids. Every clip is a little lesson, and nothing else.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(520).springify()}>
          <View
            style={styles.previewRow}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants">
            <View style={[styles.preview, {backgroundColor: '#F7C5D4'}]}>
              <Text style={[styles.previewMark, {color: '#C43B6E'}]}>A</Text>
              <Text style={styles.previewLabel}>Letters</Text>
            </View>
            <View style={[styles.preview, {backgroundColor: '#B7E4C7'}]}>
              <Text style={[styles.previewMark, {color: '#1F8A4C'}]}>3</Text>
              <Text style={styles.previewLabel}>Numbers</Text>
            </View>
            <View style={[styles.preview, {backgroundColor: '#DCC8F5'}]}>
              <Icon name="paw" size={36} color="#7A3EAE" />
              <Text style={styles.previewLabel}>Animals</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={busy}
            onPress={onGoogle}
            style={styles.googleButton}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google">
            {busy ? (
              <ActivityIndicator color={INK} />
            ) : (
              <>
                <Image
                  source={require('../../assets/icons/google.png')}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={busy}
            onPress={() => navigate('KidSetupScreen')}
            style={styles.guestButton}
            accessibilityRole="button"
            accessibilityLabel="Explore as guest">
            <Text style={styles.guestText}>Explore as Guest</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(240).duration(520).springify()}
          style={styles.footer}>
          <View style={styles.creditRow}>
            <Icon name="heart" size={14} color="#E25B7A" />
            <Text style={styles.credit}>Made with care for kids and their families -Yuvaan</Text>
          </View>
        </Animated.View>
      </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CREAM,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  badge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE9A0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: FONTS.Black,
    fontSize: 13,
    letterSpacing: 0.3,
    color: '#111111',
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: INK,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 22,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  preview: {
    flex: 1,
    minHeight: 108,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  previewMark: {
    fontFamily: FONTS.Black,
    fontSize: 36,
    lineHeight: 42,
  },
  previewLabel: {
    fontFamily: FONTS.Bold,
    fontSize: 13,
    color: INK,
  },
  googleButton: {
    minHeight: 60,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#F3EDE3',
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: INK,
  },
  guestButton: {
    marginTop: 12,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  guestText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: GOLD_INK,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 26,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  credit: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: MUTED,
  },
})
