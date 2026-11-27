export type GuessId = 'alphabet' | 'numbers' | 'fruits' | 'animals' | 'colors' | 'shapes'

export type GuessItem = {
  id: string
  label: string
  word?: string
}

export type GuessRound = {
  prompt: string
  answerId: string
  choices: GuessItem[]
}

export type GuessCategory = {
  id: GuessId
  title: string
  hint: string
  icon: string
  tint: string
  ink: string
}

export const GUESS_CATEGORIES: GuessCategory[] = [
  {id: 'alphabet', title: 'Alphabet', hint: 'Hear the letter', icon: 'text-outline', tint: '#FFE8F1', ink: '#C43B6E'},
  {id: 'numbers', title: 'Numbers', hint: 'Hear the number', icon: 'calculator-outline', tint: '#E7F8EE', ink: '#1F8A4C'},
  {id: 'fruits', title: 'Fruits', hint: 'Hear the fruit', icon: 'nutrition-outline', tint: '#FFF1D6', ink: '#C47A12'},
  {id: 'animals', title: 'Animals', hint: 'Hear the animal', icon: 'paw-outline', tint: '#F3E8FF', ink: '#7A3EAE'},
  {id: 'colors', title: 'Colors', hint: 'Hear the color', icon: 'color-palette-outline', tint: '#FFE8E0', ink: '#D3542C'},
  {id: 'shapes', title: 'Shapes', hint: 'Hear the shape', icon: 'triangle-outline', tint: '#E4F7FF', ink: '#1E4E79'},
]

const POOLS: Record<GuessId, GuessItem[]> = {
  alphabet: [
    {id: 'A', label: 'A', word: 'apple'},
    {id: 'B', label: 'B', word: 'ball'},
    {id: 'C', label: 'C', word: 'cat'},
    {id: 'D', label: 'D', word: 'dog'},
    {id: 'E', label: 'E', word: 'egg'},
    {id: 'F', label: 'F', word: 'fish'},
    {id: 'G', label: 'G', word: 'goat'},
    {id: 'H', label: 'H', word: 'hat'},
  ],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8'].map(id => ({id, label: id})),
  fruits: ['Apple', 'Banana', 'Mango', 'Grapes', 'Orange', 'Melon'].map(id => ({id, label: id})),
  animals: ['Cat', 'Dog', 'Lion', 'Fish', 'Bird', 'Elephant'].map(id => ({id, label: id})),
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'].map(id => ({id, label: id})),
  shapes: ['Circle', 'Square', 'Triangle', 'Star', 'Heart', 'Diamond'].map(id => ({id, label: id})),
}

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap]
    copy[swap] = current
  }
  return copy
}

const promptFor = (category: GuessId, item: GuessItem) => {
  if (category === 'alphabet') {
    return `${item.label} for ${item.word}. Tap ${item.label}.`
  }
  if (category === 'numbers') {
    return `Tap the number ${item.label}.`
  }
  if (category === 'colors') {
    return `Tap the color ${item.label}.`
  }
  return `Tap the ${item.label}.`
}

export const categoryById = (id?: string) => GUESS_CATEGORIES.find(item => item.id === id)

export const buildRounds = (category: GuessId, count = 5): GuessRound[] => {
  const pool = POOLS[category]
  return shuffle(pool)
    .slice(0, count)
    .map(answer => {
      const distractors = shuffle(pool.filter(item => item.id !== answer.id)).slice(0, 3)
      return {
        prompt: promptFor(category, answer),
        answerId: answer.id,
        choices: shuffle([answer, ...distractors]),
      }
    })
}
