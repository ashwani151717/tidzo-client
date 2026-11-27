export type Point = {x: number; y: number}

export type Stroke = {
  hint: string
  points: Point[]
}

export type Glyph = {
  id: string
  kind: 'letter' | 'number'
  label: string
  strokes: Stroke[]
}

const stroke = (hint: string, coords: number[]): Stroke => ({
  hint,
  points: Array.from({length: coords.length / 2}, (_, index) => ({
    x: coords[index * 2],
    y: coords[index * 2 + 1],
  })),
})

const place = (source: Stroke[], dx: number): Stroke[] =>
  source.map(item => ({
    hint: item.hint,
    points: item.points.map(point => ({
      x: dx + point.x * 0.44,
      y: 6 + point.y * 0.88,
    })),
  }))

const LETTERS: Glyph[] = [
  {id: 'A', kind: 'letter', label: 'A', strokes: [
    stroke('Start at the top. Slide down.', [50, 8, 16, 92]),
    stroke('Slide down the other side.', [50, 8, 84, 92]),
    stroke('Draw a line across.', [30, 58, 70, 58]),
  ]},
  {id: 'B', kind: 'letter', label: 'B', strokes: [
    stroke('Start at the top. Go straight down.', [30, 10, 30, 90]),
    stroke('Curve out and back for the top.', [30, 10, 58, 8, 76, 24, 58, 46, 30, 46]),
    stroke('Curve out and back for the bottom.', [30, 46, 64, 46, 80, 66, 60, 90, 30, 90]),
  ]},
  {id: 'C', kind: 'letter', label: 'C', strokes: [
    stroke('Start at the top and curve around.', [78, 24, 52, 8, 24, 26, 14, 52, 24, 78, 52, 92, 78, 76]),
  ]},
  {id: 'D', kind: 'letter', label: 'D', strokes: [
    stroke('Start at the top. Go straight down.', [28, 10, 28, 90]),
    stroke('Curve out and back to the line.', [28, 10, 64, 12, 84, 50, 64, 88, 28, 90]),
  ]},
  {id: 'E', kind: 'letter', label: 'E', strokes: [
    stroke('Start at the top. Go straight down.', [30, 12, 30, 88]),
    stroke('Draw a line across the top.', [30, 12, 76, 12]),
    stroke('Draw a short line across the middle.', [30, 48, 62, 48]),
    stroke('Draw a line across the bottom.', [30, 88, 76, 88]),
  ]},
  {id: 'F', kind: 'letter', label: 'F', strokes: [
    stroke('Start at the top. Go straight down.', [32, 12, 32, 88]),
    stroke('Draw a line across the top.', [32, 12, 76, 12]),
    stroke('Draw a short line across the middle.', [32, 48, 64, 48]),
  ]},
  {id: 'G', kind: 'letter', label: 'G', strokes: [
    stroke('Start at the top and curve around.', [76, 24, 50, 8, 22, 28, 14, 54, 28, 82, 56, 92, 76, 74]),
    stroke('Draw a short line in.', [76, 56, 52, 56]),
  ]},
  {id: 'H', kind: 'letter', label: 'H', strokes: [
    stroke('Go straight down.', [26, 12, 26, 88]),
    stroke('Go straight down on the other side.', [74, 12, 74, 88]),
    stroke('Draw a line across the middle.', [26, 50, 74, 50]),
  ]},
  {id: 'I', kind: 'letter', label: 'I', strokes: [
    stroke('Draw a small line across the top.', [34, 14, 66, 14]),
    stroke('Go straight down.', [50, 14, 50, 86]),
    stroke('Draw a small line across the bottom.', [34, 86, 66, 86]),
  ]},
  {id: 'J', kind: 'letter', label: 'J', strokes: [
    stroke('Draw a small line across the top.', [32, 14, 72, 14]),
    stroke('Go down, then curve to the left.', [58, 14, 58, 68, 44, 90, 22, 76]),
  ]},
  {id: 'K', kind: 'letter', label: 'K', strokes: [
    stroke('Go straight down.', [30, 12, 30, 88]),
    stroke('Slide up to the right.', [30, 52, 74, 14]),
    stroke('Slide down to the right.', [30, 52, 76, 88]),
  ]},
  {id: 'L', kind: 'letter', label: 'L', strokes: [
    stroke('Start at the top. Go straight down.', [32, 12, 32, 86]),
    stroke('Draw a line across the bottom.', [32, 86, 78, 86]),
  ]},
  {id: 'M', kind: 'letter', label: 'M', strokes: [
    stroke('Go down, up to the middle, and down again.', [14, 88, 14, 16, 50, 58, 86, 16, 86, 88]),
  ]},
  {id: 'N', kind: 'letter', label: 'N', strokes: [
    stroke('Go down, slide across, and go up.', [22, 88, 22, 14, 78, 88, 78, 14]),
  ]},
  {id: 'O', kind: 'letter', label: 'O', strokes: [
    stroke('Start at the top and go all the way around.', [50, 10, 78, 20, 90, 50, 78, 80, 50, 92, 22, 80, 10, 50, 22, 20, 50, 10]),
  ]},
  {id: 'P', kind: 'letter', label: 'P', strokes: [
    stroke('Start at the top. Go straight down.', [30, 12, 30, 90]),
    stroke('Curve out and back.', [30, 12, 64, 10, 80, 28, 62, 48, 30, 48]),
  ]},
  {id: 'Q', kind: 'letter', label: 'Q', strokes: [
    stroke('Start at the top and go all the way around.', [50, 10, 78, 20, 88, 50, 76, 78, 50, 90, 24, 78, 14, 50, 24, 22, 50, 10]),
    stroke('Add a small tail.', [62, 66, 84, 90]),
  ]},
  {id: 'R', kind: 'letter', label: 'R', strokes: [
    stroke('Start at the top. Go straight down.', [30, 12, 30, 90]),
    stroke('Curve out and back.', [30, 12, 64, 10, 80, 28, 62, 48, 30, 48]),
    stroke('Slide down to the right.', [48, 48, 80, 90]),
  ]},
  {id: 'S', kind: 'letter', label: 'S', strokes: [
    stroke('Curve one way, then the other way.', [74, 24, 50, 10, 24, 26, 34, 46, 66, 56, 76, 74, 52, 92, 22, 76]),
  ]},
  {id: 'T', kind: 'letter', label: 'T', strokes: [
    stroke('Draw a line across the top.', [20, 16, 80, 16]),
    stroke('Start in the middle and go straight down.', [50, 16, 50, 88]),
  ]},
  {id: 'U', kind: 'letter', label: 'U', strokes: [
    stroke('Go down, along the bottom, and back up.', [22, 14, 22, 64, 36, 88, 64, 88, 78, 64, 78, 14]),
  ]},
  {id: 'V', kind: 'letter', label: 'V', strokes: [
    stroke('Slide down, then back up.', [16, 14, 50, 90, 84, 14]),
  ]},
  {id: 'W', kind: 'letter', label: 'W', strokes: [
    stroke('Slide down, up, down, and up.', [10, 14, 28, 90, 50, 42, 72, 90, 90, 14]),
  ]},
  {id: 'X', kind: 'letter', label: 'X', strokes: [
    stroke('Slide down to the right.', [18, 14, 82, 88]),
    stroke('Slide down to the left.', [82, 14, 18, 88]),
  ]},
  {id: 'Y', kind: 'letter', label: 'Y', strokes: [
    stroke('Slide down to the middle.', [18, 14, 50, 48]),
    stroke('Slide down to the middle from the other side.', [82, 14, 50, 48]),
    stroke('Go straight down.', [50, 48, 50, 90]),
  ]},
  {id: 'Z', kind: 'letter', label: 'Z', strokes: [
    stroke('Draw a line across the top.', [18, 16, 82, 16]),
    stroke('Slide down to the left.', [82, 16, 18, 86]),
    stroke('Draw a line across the bottom.', [18, 86, 82, 86]),
  ]},
]

const DIGITS: Record<string, Stroke[]> = {
  '0': [stroke('Go all the way around.', [50, 12, 76, 22, 86, 50, 76, 78, 50, 90, 24, 78, 14, 50, 24, 22, 50, 12])],
  '1': [stroke('Start at the top and go straight down.', [40, 28, 58, 10, 58, 90])],
  '2': [
    stroke('Curve around from the top.', [26, 34, 34, 14, 62, 12, 80, 30, 68, 50, 24, 88]),
    stroke('Draw a line across the bottom.', [24, 88, 80, 88]),
  ],
  '3': [stroke('Curve around the top, then the bottom.', [24, 22, 48, 10, 74, 24, 54, 46, 76, 64, 54, 90, 24, 76])],
  '4': [
    stroke('Slide down, then across.', [70, 18, 22, 62, 80, 62]),
    stroke('Go straight down.', [62, 16, 62, 90]),
  ],
  '5': [
    stroke('Across the top, then down.', [76, 14, 28, 14, 28, 46]),
    stroke('Curve around the bottom.', [28, 46, 62, 40, 80, 58, 62, 90, 24, 78]),
  ],
  '6': [stroke('Curve down and loop around.', [72, 22, 46, 10, 20, 40, 18, 66, 36, 90, 66, 84, 76, 62, 56, 48, 26, 58])],
  '7': [stroke('Across the top, then slide down.', [20, 16, 80, 16, 34, 90])],
  '8': [stroke('Loop around the top, then the bottom.', [50, 48, 26, 32, 34, 12, 68, 12, 76, 32, 50, 48, 24, 66, 34, 90, 68, 90, 78, 66, 50, 48])],
  '9': [stroke('Loop around, then go down.', [58, 48, 28, 40, 26, 20, 46, 8, 72, 22, 64, 44, 58, 48, 58, 90])],
}

const NUMBER_SAY: Record<string, string> = {
  '10': 'This is ten. A one, then a zero.',
  '11': 'This is eleven. Two ones.',
  '12': 'This is twelve. A one, then a two.',
  '13': 'This is thirteen. A one, then a three.',
  '14': 'This is fourteen. A one, then a four.',
  '15': 'This is fifteen. A one, then a five.',
  '16': 'This is sixteen. A one, then a six.',
  '17': 'This is seventeen. A one, then a seven.',
  '18': 'This is eighteen. A one, then an eight.',
  '19': 'This is nineteen. A one, then a nine.',
  '20': 'This is twenty. A two, then a zero.',
}

const singleNumbers: Glyph[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(id => ({
  id,
  kind: 'number' as const,
  label: id,
  strokes: DIGITS[id],
}))

const pairNumbers: Glyph[] = Object.keys(NUMBER_SAY).map(id => ({
  id,
  kind: 'number' as const,
  label: id,
  strokes: [...place(DIGITS[id[0]], 4), ...place(DIGITS[id[1]], 52)],
}))

export const GLYPHS: Glyph[] = [...LETTERS, ...singleNumbers, ...pairNumbers]

export const letterGlyphs = GLYPHS.filter(item => item.kind === 'letter')
export const numberGlyphs = GLYPHS.filter(item => item.kind === 'number')

export const glyphById = (id?: string) => GLYPHS.find(item => item.id === id)

export const strokeSamples = (item: Stroke, step = 5): Point[] => {
  const samples: Point[] = []
  item.points.forEach((point, index) => {
    if (index === 0) {
      samples.push(point)
      return
    }
    const previous = item.points[index - 1]
    const distance = Math.hypot(point.x - previous.x, point.y - previous.y)
    const count = Math.max(1, Math.ceil(distance / step))
    for (let mark = 1; mark <= count; mark += 1) {
      const blend = mark / count
      samples.push({
        x: previous.x + (point.x - previous.x) * blend,
        y: previous.y + (point.y - previous.y) * blend,
      })
    }
  })
  return samples
}

export const glyphPaths = (glyph: Glyph) =>
  glyph.strokes.map(item =>
    item.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
  )
