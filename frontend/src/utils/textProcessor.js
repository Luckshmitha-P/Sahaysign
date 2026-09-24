const CONCEPT_MAP = {
  hello: 'HELLO',
  help: 'HELP',
  government: 'GOVERNMENT',
  office: 'OFFICE',
  hospital: 'HOSPITAL',
  camp: 'CAMP',
  vaccination: 'VACCINATION',
  tomorrow: 'TOMORROW',
  today: 'TODAY',
  emergency: 'EMERGENCY',
  warning: 'WARNING',
  closed: 'CLOSED',
  open: 'OPEN',
  important: 'IMPORTANT',
  police: 'POLICE',
  school: 'SCHOOL',
  college: 'COLLEGE',
  water: 'WATER',
  food: 'FOOD',
  medicine: 'MEDICINE',
  appointment: 'APPOINTMENT',
  contact: 'CONTACT',
  please: 'PLEASE',
  services: 'SERVICES',
  starts: 'STARTS',
  remains: 'REMAINS',
  announcement: 'ANNOUNCEMENT',
  district: 'DISTRICT',
  announce: 'ANNOUNCE',
  program: 'PROGRAM',
}

export function normalizeSentence(sentence = '') {
  return String(sentence || '')
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractConcepts(sentence = '') {
  const normalized = normalizeSentence(sentence)
  if (!normalized) return []

  const words = normalized.split(' ')
  const found = []
  const seen = new Set()

  for (const word of words) {
    const concept = CONCEPT_MAP[word]
    if (concept && !seen.has(concept)) {
      found.push(concept)
      seen.add(concept)
    }
  }

  return found
}

export function getUnsupportedTerms(sentence = '', supportedTerms = []) {
  const normalizedWords = normalizeSentence(sentence).split(' ')
  const supportedSet = new Set(supportedTerms)

  return normalizedWords
    .map((word) => CONCEPT_MAP[word])
    .filter(Boolean)
    .filter((concept) => !supportedSet.has(concept))
}
