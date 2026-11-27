export type SayWord = {
  letter: string
  word: string
  emoji: string
}

export const SAY_WORDS: SayWord[] = [
  {letter: 'A', word: 'apple', emoji: '🍎'},
  {letter: 'B', word: 'ball', emoji: '⚽'},
  {letter: 'C', word: 'cat', emoji: '🐱'},
  {letter: 'D', word: 'dog', emoji: '🐶'},
  {letter: 'E', word: 'egg', emoji: '🥚'},
  {letter: 'F', word: 'fish', emoji: '🐟'},
  {letter: 'G', word: 'goat', emoji: '🐐'},
  {letter: 'H', word: 'hat', emoji: '🎩'},
  {letter: 'I', word: 'ice', emoji: '🧊'},
  {letter: 'J', word: 'jug', emoji: '🫙'},
  {letter: 'K', word: 'kite', emoji: '🪁'},
  {letter: 'L', word: 'lion', emoji: '🦁'},
  {letter: 'M', word: 'moon', emoji: '🌕'},
  {letter: 'N', word: 'nest', emoji: '🪺'},
  {letter: 'O', word: 'orange', emoji: '🍊'},
  {letter: 'P', word: 'pen', emoji: '🖊️'},
  {letter: 'Q', word: 'queen', emoji: '👑'},
  {letter: 'R', word: 'rabbit', emoji: '🐰'},
  {letter: 'S', word: 'sun', emoji: '☀️'},
  {letter: 'T', word: 'tiger', emoji: '🐯'},
  {letter: 'U', word: 'umbrella', emoji: '☂️'},
  {letter: 'V', word: 'van', emoji: '🚐'},
  {letter: 'W', word: 'whale', emoji: '🐳'},
  {letter: 'X', word: 'x-ray', emoji: '🩻'},
  {letter: 'Y', word: 'yak', emoji: '🐂'},
  {letter: 'Z', word: 'zebra', emoji: '🦓'},
]

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const levenshtein = (left: string, right: string) => {
  const rows = Array.from({length: left.length + 1}, (_, index) => [index])
  const row = rows[0]
  for (let column = 1; column <= right.length; column += 1) {
    row[column] = column
  }
  for (let i = 1; i <= left.length; i += 1) {
    rows[i] = [i]
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      )
    }
  }
  return rows[left.length][right.length]
}

const FILLERS = new Set(['a', 'an', 'the', 'for', 'say', 'it', 'with', 'me', 'letter', 'is', 'this', 'to', 'and', 'of', 'four'])

const sounds = (value: string) =>
  value
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/c/g, 'k')
    .replace(/[aeiouy]/g, '')
    .replace(/(.)\1+/g, '$1')

const sharedPrefix = (left: string, right: string) => {
  let count = 0
  const limit = Math.min(left.length, right.length)
  while (count < limit && left[count] === right[count]) {
    count += 1
  }
  return count
}

const sameEnding = (left: string, right: string) => {
  let count = 0
  const limit = Math.min(left.length, right.length)
  while (count < limit && left[left.length - 1 - count] === right[right.length - 1 - count]) {
    count += 1
  }
  return count >= 3
}

const tokenClose = (token: string, target: string) => {
  if (!token || !target || target.includes(' ')) {
    return false
  }
  if (token === target || token.startsWith(target)) {
    return true
  }
  if (token.length >= 2 && target.startsWith(token)) {
    return true
  }
  const distance = levenshtein(token, target)
  const sameStart = token[0] === target[0]
  if (distance <= 1 && (sameStart || sameEnding(token, target))) {
    return true
  }
  if (sameStart && distance <= 2) {
    return true
  }
  // "April" is how the microphone often hears "apple".
  if (sameStart && sharedPrefix(token, target) >= 2 && distance <= 3) {
    return true
  }
  const left = sounds(token)
  const right = sounds(target)
  if (left.length >= 2 && left === right) {
    return true
  }
  return sameStart && left.length >= 2 && right.length >= 2 && left[0] === right[0] && levenshtein(left, right) <= 1
}

export const matchesWord = (transcript: string, word: string) => {
  const heard = normalize(transcript)
  const target = normalize(word).replace(/ /g, '')
  if (!heard || !target) {
    return false
  }
  const compact = heard.replace(/ /g, '')
  if (
    compact === target ||
    compact.startsWith(target) ||
    (target.length >= 3 && compact.endsWith(target))
  ) {
    return true
  }
  const tokens = heard.split(' ').filter(token => token && !FILLERS.has(token))
  if (tokens.some(token => tokenClose(token, target))) {
    return true
  }
  return tokens.some((token, index) => index > 0 && tokenClose(tokens[index - 1] + token, target))
}

export const promptFor = (item: SayWord) => `${item.letter} for ${item.word}.`
