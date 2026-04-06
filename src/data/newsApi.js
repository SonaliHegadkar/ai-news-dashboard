// newsApi.js
// Fetches live news from a free public API — no API key required
// Source: saurav.tech (cached NewsAPI mirror, free, works from browser)

import axios from 'axios'

const BASE_URL = 'https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json'

export async function fetchNews() {
  const response = await axios.get(BASE_URL)

  // API returns articles inside response.data.articles array
  const articles = response.data?.articles || []

  // Filter out articles with missing title or description
  // Map to the shape our app uses
  return articles
    .filter(a => a.title && a.description && a.title !== '[Removed]')
    .slice(0, 25)
    .map((a, index) => ({
      id:          index + 1,
      title:       a.title,
      description: a.description,
      url:         a.url,
      source:      a.source?.name || 'Unknown',
      publishedAt: a.publishedAt,
      urlToImage:  a.urlToImage,
    }))
}
