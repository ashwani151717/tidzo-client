import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Path, Polygon } from 'react-native-svg'
import { FONTS } from '../../../constants/Fonts'
import { speak } from '../kidSpeech'
import { Glyph, strokeSamples } from './glyphs'

type Props = {
  glyph: Glyph
  playing: boolean
  replayKey: number
  onFinished: () => void
}

export const StrokeStage: FC<Props> = ({glyph, playing, replayKey, onFinished}) => {
  const groups = useMemo(() => glyph.strokes.map(item => strokeSamples(item)), [glyph])
  const total = groups.reduce((sum, group) => sum + group.length, 0)
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
  }, [glyph, replayKey])

  useEffect(() => {
    if (!playing) {
      return
    }
    const timer = setInterval(() => {
      setCursor(value => {
        if (value >= total) {
          return value
        }
        return value + 1
      })
    }, 26)
    return () => clearInterval(timer)
  }, [playing, total, glyph, replayKey])

  useEffect(() => {
    if (playing && cursor >= total && total > 0) {
      onFinished()
    }
  }, [cursor, onFinished, playing, total])

  let seen = 0
  let strokeIndex = 0
  for (let index = 0; index < groups.length; index += 1) {
    if (cursor <= seen + groups[index].length) {
      strokeIndex = index
      break
    }
    seen += groups[index].length
    strokeIndex = index
  }
  const local = Math.max(0, cursor - seen)
  const drawn = groups.map((group, index) => {
    const count = index < strokeIndex ? group.length : index === strokeIndex ? local : 0
    return group.slice(0, Math.max(1, count))
  }).filter(group => group.length > 1)

  const active = groups[strokeIndex] ?? []
  const tip = active[Math.min(local, active.length - 1)]
  const before = active[Math.max(0, Math.min(local, active.length - 1) - 1)]
  const angle = tip && before ? Math.atan2(tip.y - before.y, tip.x - before.x) : 0
  const wing = (turn: number) => {
    if (!tip) {
      return '0,0'
    }
    return `${tip.x - Math.cos(angle + turn) * 5},${tip.y - Math.sin(angle + turn) * 5}`
  }

  const hint = glyph.strokes[strokeIndex]?.hint ?? ''
  const said = useRef(-1)

  useEffect(() => {
    said.current = -1
  }, [glyph, replayKey])

  useEffect(() => {
    if (!playing || !hint || said.current === strokeIndex) {
      return
    }
    said.current = strokeIndex
    speak(hint)
  }, [hint, playing, strokeIndex])

  return (
    <View style={styles.wrap}>
      <Svg viewBox="0 0 100 100" style={styles.board}>
        {glyph.strokes.map((item, index) => (
          <Path
            key={`guide-${index}`}
            d={item.points.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
            stroke="#E7E5E4"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {drawn.map((group, index) => (
          <Path
            key={`ink-${index}`}
            d={group.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
            stroke="#1E4E79"
            strokeWidth={4.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {tip && playing ? (
          <>
            <Polygon points={`${tip.x},${tip.y} ${wing(2.4)} ${wing(-2.4)}`} fill="#F3C04D" />
            <Circle cx={tip.x} cy={tip.y} r={3.2} fill="#F3C04D" />
          </>
        ) : null}
      </Svg>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
  },
  board: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
  },
  hint: {
    marginTop: 12,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#1C1917',
    textAlign: 'center',
    minHeight: 44,
  },
})
