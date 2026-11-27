import { ViewStyle } from 'react-native'

export const Clay = {
  ink: '#1C1917',
  muted: '#6F675E',
  cream: '#FFF6EA',
  sky: '#4EB6FF',
  skySoft: '#D7EEFF',
  card: '#FFFFFF',
  gold: '#F5C451',
  goldInk: '#3A2E12',
  blue: '#7EC8F8',
  pink: '#F7C5D4',
  mint: '#B7E4C7',
  peach: '#F8C9B0',
  lilac: '#DCC8F5',
  yellow: '#F8E3A0',
  edge: '#F3EDE3',
  good: '#2563EB',
  bad: '#D3542C',
}

export const clayShadow: ViewStyle = {
  shadowColor: '#C4B8A5',
  shadowOffset: {width: 0, height: 6},
  shadowOpacity: 0.22,
  shadowRadius: 0,
  elevation: 3,
}

export const clayCard: ViewStyle = {
  backgroundColor: Clay.card,
  borderRadius: 24,
  borderWidth: 3,
  borderColor: Clay.edge,
  ...clayShadow,
}
