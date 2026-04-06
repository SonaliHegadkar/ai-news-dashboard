// classifier.js
// Keyword-based AI classification — simulates a real API call with setTimeout

// ─── Keyword lists ────────────────────────────────────────────────────────────

const AUTOMOTIVE_KEYWORDS = [
  'tesla', 'ev', 'electric vehicle', 'car', 'ford', 'bmw', 'toyota', 'honda',
  'volkswagen', 'vw', 'mercedes', 'rivian', 'hyundai', 'stellantis', 'nissan',
  'renault', 'gm', 'chevy', 'bolt', 'audi', 'e-tron', 'mach-e', 'mustang',
  'hydrogen', 'fuel cell', 'autonomous', 'battery', 'charging', 'motor', 'vehicle',
]

const EV_KEYWORDS = [
  'ev', 'electric', 'battery', 'charging', 'e-tron', 'mach-e', 'bolt', 'ioniq', 'hydrogen',
]

const OE_KEYWORDS = [
  'launch', 'unveil', 'introduce', 'announce', 'prototype', 'factory', 'production',
]

const AFTERMARKET_KEYWORDS = [
  'recall', 'repair', 'upgrade', 'replace', 'fix', 'service', 'maintenance',
]

const REGION_KEYWORDS = {
  Asia:            ['asia', 'india', 'china', 'japan', 'korea', 'toyota', 'hyundai', 'nissan', 'honda'],
  Europe:          ['europe', 'eu', 'european', 'germany', 'france', 'volkswagen', 'bmw', 'mercedes', 'audi', 'renault'],
  'North America': ['us', 'usa', 'america', 'american', 'tesla', 'ford', 'gm', 'rivian', 'georgia'],
}

// ─── Helper ───────────────────────────────────────────────────────────────────

// Returns true if any keyword is found in the text
function matches(text, keywords) {
  return keywords.some(keyword => text.includes(keyword))
}

// ─── Classification logic ─────────────────────────────────────────────────────

function classify(title, description) {
  const text = `${title} ${description}`.toLowerCase()

  // Category
  const isAutomotive = matches(text, AUTOMOTIVE_KEYWORDS)
  const Category     = isAutomotive ? 'Automotive' : 'Non-Automotive'

  // Type — only meaningful for automotive articles
  const Type = isAutomotive
    ? matches(text, AFTERMARKET_KEYWORDS) ? 'Aftermarket' : 'OE'
    : 'General'

  // Focus Area
  let FocusArea = 'General'
  if (matches(text, EV_KEYWORDS))                                    FocusArea = 'EV'
  else if (text.includes('autonomous') || text.includes('self-driving')) FocusArea = 'Autonomous'
  else if (text.includes('hydrogen')   || text.includes('fuel cell'))    FocusArea = 'Hydrogen'
  else if (text.includes('software')   || text.includes('ai'))           FocusArea = 'Technology'

  // Region — check each region's keywords, default to Global
  const matchedRegion = Object.entries(REGION_KEYWORDS)
    .find(([, keywords]) => matches(text, keywords))
  const Region = matchedRegion ? matchedRegion[0] : 'Global'

  return { Category, Type, FocusArea, Region }
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Simulates an async API call — resolves after a short random delay
export async function classifyArticle(article) {
  const delay = 500 + Math.random() * 400
  await new Promise(resolve => setTimeout(resolve, delay))
  return classify(article.title, article.description)
}
