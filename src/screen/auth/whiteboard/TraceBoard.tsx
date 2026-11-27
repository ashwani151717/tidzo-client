import React, { FC, useMemo, useRef, useState } from 'react'
import { PanResponder, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'
import { FONTS } from '../../../constants/Fonts'
import { Glyph, Point, strokeSamples } from './glyphs'

type Props = {
  glyph: Glyph | null
  reach: number
  goal: number
  showHint: boolean
  onDone: () => void
}

export const TraceBoard: FC<Props> = ({glyph, reach, goal, showHint, onDone}) => {
  const groups = useMemo(() => (glyph ? glyph.strokes.map(item => strokeSamples(item, 4)) : []), [glyph])
  const flat = useMemo(() => groups.flat(), [groups])
  const [ink, setInk] = useState<string[]>([])
  const [covered, setCovered] = useState<boolean[]>([])
  const live = useRef('')
  const size = useRef({width: 1, height: 1})
  const finished = useRef(false)
  const coveredRef = useRef<boolean[]>([])

  const mark = (point: Point) => {
    if (!glyph || finished.current) {
      return
    }
    const next = coveredRef.current.length === flat.length ? coveredRef.current.slice() : flat.map(() => false)
    flat.forEach((sample, index) => {
      if (!next[index] && Math.hypot(sample.x - point.x, sample.y - point.y) <= reach) {
        next[index] = true
      }
    })
    coveredRef.current = next
    setCovered(next)
    const hits = next.filter(Boolean).length
    if (flat.length > 0 && hits / flat.length >= goal) {
      finished.current = true
      onDone()
    }
  }

  const toPoint = (x: number, y: number): Point => ({
    x: (x / size.current.width) * 100,
    y: (y / size.current.height) * 100,
  })

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: event => {
        const point = toPoint(event.nativeEvent.locationX, event.nativeEvent.locationY)
        live.current = `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
        setInk(current => [...current, live.current])
        mark(point)
      },
      onPanResponderMove: event => {
        const point = toPoint(event.nativeEvent.locationX, event.nativeEvent.locationY)
        live.current += ` L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
        const path = live.current
        setInk(current => {
          const next = current.slice()
          next[next.length - 1] = path
          return next
        })
        mark(point)
      },
    }),
  ).current

  const clear = () => {
    finished.current = false
    coveredRef.current = []
    live.current = ''
    setInk([])
    setCovered([])
  }

  const hits = covered.filter(Boolean).length
  const progress = flat.length ? hits / flat.length : 0
  const nextSample = flat.find((_, index) => !covered[index])

  return (
    <View style={styles.wrap}>
      <View
        style={styles.board}
        onLayout={event => {
          size.current = {
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          }
        }}
        {...pan.panHandlers}>
        <Svg viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
          {glyph
            ? glyph.strokes.map((item, index) => (
                <Path
                  key={`guide-${index}`}
                  d={item.points.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
                  stroke="#D6D3D1"
                  strokeWidth={3.4}
                  strokeDasharray="1.6 1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))
            : null}
          {ink.map((path, index) => (
            <Path
              key={`ink-${index}`}
              d={path}
              stroke="#1E4E79"
              strokeWidth={3.2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {showHint && nextSample ? <Circle cx={nextSample.x} cy={nextSample.y} r={2.4} fill="#F3C04D" /> : null}
        </Svg>
      </View>
      {glyph ? (
        <View style={styles.meterTrack}>
          <View style={[styles.meterFill, {width: `${Math.min(100, progress * 100)}%`}]} />
        </View>
      ) : null}
      <Text style={styles.clear} onPress={clear} accessibilityRole="button">
        Erase
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  board: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
  },
  meterTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#F3C04D',
  },
  clear: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#1E4E79',
  },
})
