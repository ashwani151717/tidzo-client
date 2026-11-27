import React, { FC, ReactNode } from 'react'
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>
  children: ReactNode
}

const ClayPress: FC<Props> = ({style, children, disabled, onPressIn, onPressOut, ...rest}) => {
  const scale = useSharedValue(1)
  const animated = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }))

  return (
    <Pressable
      disabled={disabled}
      onPressIn={event => {
        if (!disabled) {
          scale.value = withTiming(0.96, {duration: 160})
        }
        onPressIn?.(event)
      }}
      onPressOut={event => {
        scale.value = withTiming(1, {duration: 180})
        onPressOut?.(event)
      }}
      {...rest}>
      <Animated.View style={[style, disabled ? {opacity: 0.45} : null, animated]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

export default ClayPress
