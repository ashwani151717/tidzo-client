import { Alert, StyleSheet, View } from 'react-native'
import React, { FC, useCallback, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { BobbingLogo, Drift } from '../../components/kids/SkyHero'
import { token_storage } from '../../redux/storage'
import { jwtDecode } from 'jwt-decode'
import { resetAndNavigate } from '../../utils/NavigationUtils'
import { refresh_tokens } from '../../redux/apiConfig'
import { useAppDispatch } from '../../redux/reduxHook'
import { refetchUser } from '../../redux/action/userAction'
import { RFValue } from 'react-native-responsive-fontsize'

const SPLASH_DURATION_MS = 3000
const BLUE = '#2E9EFF'

const SplashScreen: FC = () => {
  const dispatch = useAppDispatch()
  const hasNavigated = useRef(false)

  interface DecodedToken {
    exp: number
  }

  const tokencheck = useCallback(async () => {
    if (hasNavigated.current) {
      return
    }
    hasNavigated.current = true

    const access_token = token_storage.getString('access_token') as string
    const refresh_token = token_storage.getString('refresh_token') as string

    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token)
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token)

      const currentTime = Date.now() / 1000
      if (decodedRefreshToken.exp < currentTime) {
        resetAndNavigate('LoginScreen')
        Alert.alert('Session expired', 'Please login again')
        return
      }
      if (decodedAccessToken.exp < currentTime) {
        try {
          refresh_tokens()
          dispatch(refetchUser())
        } catch (error) {
          console.log(error)
          Alert.alert('There was an error')
          return
        }
      }
      resetAndNavigate('BottomTab')
      return
    }
    resetAndNavigate('LoginScreen')
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      tokencheck()
    }, SPLASH_DURATION_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [tokencheck])

  return (
    <View style={styles.container}>
      <View style={styles.stage}>
        <Drift delay={0} travel={8} style={styles.starLeft}>
          <Icon name="star" size={22} color="#FFE566" />
        </Drift>
        <Drift delay={180} travel={10} style={styles.starRight}>
          <Icon name="star" size={18} color="#FFD6EA" />
        </Drift>
        <Drift delay={320} travel={7} style={styles.starLow}>
          <Icon name="star" size={14} color="#FFFFFF" />
        </Drift>
        <BobbingLogo size={RFValue(220)} />
      </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  stage: {
    width: RFValue(280),
    height: RFValue(280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  starLeft: {
    position: 'absolute',
    top: 18,
    left: 12,
  },
  starRight: {
    position: 'absolute',
    top: 36,
    right: 8,
  },
  starLow: {
    position: 'absolute',
    bottom: 28,
    left: 28,
  },
})
