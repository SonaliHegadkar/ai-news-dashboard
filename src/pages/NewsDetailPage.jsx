// NewsDetailPage.jsx
// Shows full details of a single article.
// The article ID comes from the URL — e.g. /news/5 → id = "5"
// useParams() reads that :id value from the URL.

import { useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useNewsClassification } from '../hooks/useNewsClassification'
import ClassificationBadge from '../components/ClassificationBadge'
import SkeletonCard from '../components/SkeletonCard'

export default function NewsDetailPage() {
  // useParams reads the :id part from the URL
  // e.g. if URL is /news/5, then params.id === "5"
  const { id } = useParams()

  const { articles } = useNewsClassification()
  const pageRef = useRef(null)

  // Fade in page on mount
  useEffect(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
  }, [])

  // Find the article that matches the id from the URL
  // We use Number(id) because article.id is a number, but URL params are strings
  const article = articles.find(a => a.id === Number(id))

  // If article is still loading, show skeleton
  if (article?.loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] p-8">
        <BackButton />
        <div className="max-w-2xl mx-auto mt-6">
          <SkeletonCard darkMode={true} />
        </div>
      </div>
    )
  }

  // If article not found at all, redirect to home
  // This handles cases like /news/999 where id doesn't exist
  if (!article) {
    return <Navigate to="/" replace />
  }

  const { title, description, source, publishedAt, urlToImage, url, classification, error } = article

  return (
    <div ref={pageRef} className="min-h-screen bg-[#080d1a]">

      {/* Top bar with back button */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/60 glass-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <BackButton />
          <span className="text-sm text-slate-400 truncate">{title}</span>
        </div>
      </nav>

      {/* Article detail */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Article image */}
        {urlToImage && (
          <div className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
            <img
              src={urlToImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Source + date */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
            {source}
          </span>
          {publishedAt && (
            <span className="text-xs text-slate-500">
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          )}
          {/* Show fallback warning if AI classification failed */}
          {error && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
              ⚠ Fallback classification
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base text-slate-300 leading-relaxed mb-8">
          {description}
        </p>

        {/* AI Classification result */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            AI Classification
          </p>
          <div className="flex flex-wrap gap-2">
            <ClassificationBadge type="Category"  value={classification.Category}  darkMode={true} />
            <ClassificationBadge type="Type"       value={classification.Type}       darkMode={true} />
            <ClassificationBadge type="FocusArea"  value={classification.FocusArea}  darkMode={true} />
            <ClassificationBadge type="Region"     value={classification.Region}     darkMode={true} />
          </div>
        </div>

        {/* Read full article link */}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
            bg-blue-500 hover:bg-blue-400 text-white transition-colors duration-200"
        >
          Read Full Article
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

      </main>
    </div>
  )
}

// Back button — uses Link to navigate to home page
function BackButton() {
  return (
    <Link
      to="/"
      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors shrink-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </Link>
  )
}
