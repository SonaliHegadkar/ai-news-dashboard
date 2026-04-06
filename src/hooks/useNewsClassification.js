// useNewsClassification.js
// 1. Fetches live articles from TheNewsAPI
// 2. Classifies each article using the mock AI classifier
// 3. Handles invalid AI responses with a fallback

import { useState, useEffect } from 'react'
import { fetchNews } from '../data/newsApi'
import { classifyArticle } from '../utils/classifier'

// Used when AI returns an invalid or incomplete response
const FALLBACK_CLASSIFICATION = {
  Category:  'Non-Automotive',
  Type:      'General',
  FocusArea: 'General',
  Region:    'Global',
}

// Validates all 4 required fields are present and non-empty
function isValid(result) {
  if (!result || typeof result !== 'object') return false
  const fields = ['Category', 'Type', 'FocusArea', 'Region']
  return fields.every(f => typeof result[f] === 'string' && result[f].trim() !== '')
}

export function useNewsClassification() {
  const [articles,   setArticles]   = useState([])
  const [isFetching, setIsFetching] = useState(true)   // true while API call is in progress
  const [fetchError, setFetchError] = useState(null)   // holds error message if API fails

  useEffect(() => {
    let cancelled = false

    async function loadAndClassify() {
      try {
        // Step 1 — fetch articles from the live API
        const rawArticles = await fetchNews()
        if (cancelled) return

        // Step 2 — set all articles with loading: true so skeleton cards show
        setArticles(rawArticles.map(item => ({
          ...item,
          classification: null,
          loading: true,
          error:   false,
        })))
        setIsFetching(false)

        // Step 3 — classify each article independently
        // They resolve one by one, so cards appear as they finish
        rawArticles.forEach(async (item) => {
          try {
            const result = await classifyArticle(item)
            const classification = isValid(result) ? result : FALLBACK_CLASSIFICATION

            if (!cancelled) {
              setArticles(prev =>
                prev.map(a =>
                  a.id === item.id
                    ? { ...a, classification, loading: false, error: false }
                    : a
                )
              )
            }
          } catch {
            // Classification failed — use fallback and mark error: true
            if (!cancelled) {
              setArticles(prev =>
                prev.map(a =>
                  a.id === item.id
                    ? { ...a, classification: FALLBACK_CLASSIFICATION, loading: false, error: true }
                    : a
                )
              )
            }
          }
        })

      } catch (err) {
        // API fetch itself failed
        if (!cancelled) {
          setFetchError(err.message || 'Failed to fetch news')
          setIsFetching(false)
        }
      }
    }

    loadAndClassify()
    return () => { cancelled = true }
  }, [])

  return { articles, isFetching, fetchError }
}
