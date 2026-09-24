import { SIGN_LIBRARY, LETTER_SIGN_LIBRARY, getDefaultMotion } from './signMotionLibrary'
import { normalizeSentence, extractConcepts } from '../utils/textProcessor'

const supportedTerms = Object.keys(SIGN_LIBRARY)

function buildLetterSequence(sentence = '') {
  const words = String(sentence || '').toUpperCase().match(/[A-Z]+/g) || []
  const letters = words.flatMap((word) => Array.from(word))
  const wordBreaks = []
  let letterIndex = 0

  words.slice(0, -1).forEach((word) => {
    letterIndex += word.length
    wordBreaks.push(letterIndex - 1)
  })

  return { letters, wordBreaks }
}

export class RuleBasedSignEngine {
  generate(sentence = '', signLanguage = 'ISL', inputLanguage = 'en') {
    const normalized = normalizeSentence(sentence)
    const concepts = extractConcepts(normalized)
    const letterData = buildLetterSequence(sentence)
    const letterSequence = letterData.letters

    const matchedWords = concepts.filter((term) => supportedTerms.includes(term))
    const unsupportedTerms = concepts.filter((term) => !supportedTerms.includes(term))

    const glossSequence =
      letterSequence.length > 0
        ? letterSequence
        : matchedWords.length > 0
          ? matchedWords
          : []

    return {
      sentence: String(sentence || ''),
      language: signLanguage,
      inputLanguage,
      normalizedText: normalized,
      detectedConcepts: concepts.length ? concepts : letterSequence,
      glossSequence,
      wordBreaks: letterData.wordBreaks,
      supportedTerms: glossSequence,
      unsupportedTerms,
      motionSequence: glossSequence.map((term) => LETTER_SIGN_LIBRARY[term] || SIGN_LIBRARY[term] || { name: term, duration: 1.2, motion: getDefaultMotion() }),
      model: 'RuleBasedSignEngine',
      notes:
        unsupportedTerms.length > 0
          ? `Not available in prototype: ${unsupportedTerms.join(', ')}`
          : letterSequence.length > 0
            ? 'Alphabet letter signs are available in the prototype hand-sign dictionary.'
            : 'All extracted concepts are available in the controlled prototype vocabulary.',
    }
  }
}

export class SignGenerationEngine {
  constructor() {
    this.engine = new RuleBasedSignEngine()
  }

  generate(sentence, signLanguage, inputLanguage) {
    return this.engine.generate(sentence, signLanguage, inputLanguage)
  }
}

export function generateSignSequence(sentence = '', signLanguage = 'ISL', inputLanguage = 'en') {
  const engine = new RuleBasedSignEngine()
  return engine.generate(sentence, signLanguage, inputLanguage)
}

export function generateSignMotion(sentence = '', signLanguage = 'ISL', inputLanguage = 'en') {
  const result = generateSignSequence(sentence, signLanguage, inputLanguage)

  return {
    ...result,
    motionSequence: result.glossSequence.map((term) => ({
      key: term,
      name: term,
      duration: LETTER_SIGN_LIBRARY[term]?.duration || SIGN_LIBRARY[term]?.duration || 1.2,
      motion: LETTER_SIGN_LIBRARY[term]?.motion || SIGN_LIBRARY[term]?.motion || getDefaultMotion(),
    })),
  }
}

export function getVocabulary() {
  return supportedTerms
}
