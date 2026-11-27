import { token_storage } from '../../../redux/storage'
import { Glyph } from './glyphs'

const KEY = 'kid_trace_done'

type Book = {
  letters: string[]
  numbers: string[]
}

const empty = (): Book => ({letters: [], numbers: []})

export const readPractice = (): Book => {
  const raw = token_storage.getString(KEY)
  if (!raw) {
    return empty()
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Book>
    return {
      letters: Array.isArray(parsed.letters) ? parsed.letters : [],
      numbers: Array.isArray(parsed.numbers) ? parsed.numbers : [],
    }
  } catch {
    return empty()
  }
}

export const hasPractised = (glyph: Glyph) => {
  const book = readPractice()
  const list = glyph.kind === 'letter' ? book.letters : book.numbers
  return list.includes(glyph.id)
}

export const markPractised = (glyph: Glyph) => {
  const book = readPractice()
  const list = glyph.kind === 'letter' ? book.letters : book.numbers
  if (!list.includes(glyph.id)) {
    list.push(glyph.id)
    token_storage.set(KEY, JSON.stringify(book))
  }
}

export const traceGoal = (glyph: Glyph) => (hasPractised(glyph) ? 0.82 : 0.58)

export const traceReach = (glyph: Glyph) => (hasPractised(glyph) ? 5.2 : 8)
