// NewsCard.jsx
// Displays a single news article card
// Shows skeleton while loading, error badge if AI classification failed

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import ClassificationBadge from './ClassificationBadge'
import SkeletonCard from './SkeletonCard'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000)
  if (diff < 60)   return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

const categoryAccent = {
  Automotive:       'from-blue-500 to-cyan-400',
  'Non-Automotive': 'from-purple-500 to-pink-400',
}

export default function NewsCard({ article, index, darkMode }) {
  const cardRef             = useRef(null)
  const [imgError, setImgError] = useState(false)

  // Animate card in when classification is ready
  useEffect(() => {
    if (!article.loading) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, delay: (index % 9) * 0.07, ease: 'power3.out' }
      )
    }
  }, [article.loading])

  // Magnetic tilt on mouse move
  function handleMouseMove(e) {
    const rect    = cardRef.current.getBoundingClientRect()
    const rotateX = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -5
    const rotateY = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  *  5
    gsap.to(cardRef.current, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
  }

  // Show skeleton while AI is classifying
  if (article.loading) return <SkeletonCard darkMode={darkMode} />

  const { classification, urlToImage, source, publishedAt, error } = article
  const accent = categoryAccent[classification.Category] || 'from-slate-500 to-slate-400'
  const dm     = darkMode

  return (
    // Link wraps the whole card — clicking anywhere navigates to /news/:id
    <Link
      to={`/news/${article.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={`group relative border rounded-2xl overflow-hidden flex flex-col cursor-pointer opacity-0
        transition-shadow duration-300 hover:shadow-2xl ${
        dm
          ? 'bg-slate-900/70 border-slate-700/60 hover:border-slate-600 hover:shadow-blue-950/50'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/80'
      }`}
    >
      {/* Category color accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} z-10`} />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {urlToImage && !imgError ? (
          <>
            <img
              src={urlToImage}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${dm ? 'from-slate-900/60 to-transparent' : 'from-black/20 to-transparent'}`} />
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${dm ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Source pill */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
            {source}
          </span>
          {/* Bonus: show warning badge if AI classification failed */}
          {error && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-500/70 text-white backdrop-blur-sm flex items-center gap-1">
              ⚠ Fallback
            </span>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">

        {/* Time + read link */}
        <div className="flex items-center justify-between">
          <span className={`text-[11px] ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
            {timeAgo(publishedAt)}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
              dm ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-500'
            }`}
          >
            Read
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors duration-200 ${
          dm ? 'text-slate-100' : 'text-slate-800'
        }`}>
          {article.title}
        </h3>

        {/* Description */}
        <p className={`text-xs leading-relaxed line-clamp-2 flex-1 ${dm ? 'text-slate-400' : 'text-slate-500'}`}>
          {article.description}
        </p>

        {/* Classification badges */}
        <div className={`border-t pt-2.5 ${dm ? 'border-slate-700/60' : 'border-slate-100'}`}>
          <div className="flex flex-wrap gap-1.5">
            <ClassificationBadge type="Category"  value={classification.Category}  darkMode={dm} />
            <ClassificationBadge type="Type"       value={classification.Type}       darkMode={dm} />
            <ClassificationBadge type="FocusArea"  value={classification.FocusArea}  darkMode={dm} />
            <ClassificationBadge type="Region"     value={classification.Region}     darkMode={dm} />
          </div>
        </div>

      </div>
    </Link>
  )
}
