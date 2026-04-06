// HomePage.jsx
// Main page — shows all news cards with search and filter controls

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useNewsClassification } from '../hooks/useNewsClassification'
import NewsCard     from '../components/NewsCard'
import SearchFilter from '../components/SearchFilter'
import Header       from '../components/Header'

export default function HomePage() {
  const { articles, isFetching, fetchError } = useNewsClassification()

  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('All')
  const [region,    setRegion]    = useState('All')
  const [focusArea, setFocusArea] = useState('All')
  const [darkMode,  setDarkMode]  = useState(true)

  const pageRef = useRef(null)

  // Fade in page on mount
  useEffect(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  const loaded  = articles.filter(a => !a.loading).length
  const pending = articles.length - loaded

  // Apply all four filters together
  const filtered = articles.filter(article => {
    if (article.loading) return true // keep skeleton cards visible while loading

    const { title, classification: c } = article
    const matchSearch    = title.toLowerCase().includes(search.toLowerCase())
    const matchCategory  = category  === 'All' || c.Category  === category
    const matchRegion    = region    === 'All' || c.Region    === region
    const matchFocusArea = focusArea === 'All' || c.FocusArea === focusArea

    return matchSearch && matchCategory && matchRegion && matchFocusArea
  })

  const hasActiveFilter = !!(search || category !== 'All' || region !== 'All' || focusArea !== 'All')

  function clearAllFilters() {
    setSearch('')
    setCategory('All')
    setRegion('All')
    setFocusArea('All')
  }

  return (
    <div
      ref={pageRef}
      className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#080d1a]' : 'bg-slate-50'}`}
    >
      <GlowBackground darkMode={darkMode} />

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b transition-colors duration-300
        ${darkMode ? 'border-slate-800/60 glass-dark' : 'border-slate-200/60 glass-light'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

          {/* Logo — clicking it navigates to home (current page) */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400
              flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BoltIcon className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              NewsAI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <StatusPill pending={pending} loaded={loaded} />
            <DarkToggle darkMode={darkMode} onToggle={() => setDarkMode(p => !p)} />
          </div>
        </div>
      </nav>

      {/* Page content — pt accounts for sticky navbar height (56px = h-14) */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">

        <Header
          total={articles.length}
          filtered={filtered.length}
          loaded={loaded}
          darkMode={darkMode}
        />

        {/* Filter bar — normal flow, not sticky */}
        <div className="mb-6">
          <SearchFilter
            search={search}       setSearch={setSearch}
            category={category}   setCategory={setCategory}
            region={region}       setRegion={setRegion}
            focusArea={focusArea} setFocusArea={setFocusArea}
            darkMode={darkMode}
            total={articles.length}
            filtered={filtered.length}
            hasActiveFilter={hasActiveFilter}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Grid */}
        <div className="mt-6">
          {/* Show spinner while API is fetching */}
          {isFetching && <LoadingState darkMode={darkMode} />}

          {/* Show error if API call failed */}
          {fetchError && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-400 text-base font-semibold mb-1">Failed to load news</p>
              <p className="text-slate-500 text-sm">{fetchError}</p>
            </div>
          )}

          {!isFetching && !fetchError && articles.length > 0 && filtered.length === 0 && (
            <EmptyState darkMode={darkMode} hasFilter={hasActiveFilter} onClear={clearAllFilters} />
          )}

          {!isFetching && !fetchError && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={index}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>

        <PageFooter darkMode={darkMode} />
      </main>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlowBackground({ darkMode }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px]
        ${darkMode ? 'bg-blue-900/20' : 'bg-blue-200/40'}`} />
      <div className={`absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full blur-[120px]
        ${darkMode ? 'bg-cyan-900/15' : 'bg-cyan-200/30'}`} />
      <div className={`absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px]
        ${darkMode ? 'bg-indigo-900/15' : 'bg-indigo-200/30'}`} />
    </div>
  )
}

function StatusPill({ pending, loaded }) {
  if (pending > 0) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-xs text-amber-400 font-medium">{pending} classifying…</span>
    </div>
  )
  if (loaded > 0) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span className="text-xs text-emerald-400 font-medium">All classified</span>
    </div>
  )
  return null
}

function DarkToggle({ darkMode, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200
        ${darkMode
          ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:border-blue-500'
          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 shadow-sm'}`}>
      {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </button>
  )
}

function LoadingState({ darkMode }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading articles…</p>
    </div>
  )
}

function EmptyState({ darkMode, hasFilter, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4
        ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>
      <p className={`text-base font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>No articles found</p>
      <p className={`text-sm mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No results match your current filters</p>
      {hasFilter && (
        <button onClick={onClear}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
          Clear all filters
        </button>
      )}
    </div>
  )
}

function PageFooter({ darkMode }) {
  return (
    <footer className={`mt-20 pt-8 border-t text-center
      ${darkMode ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <BoltIcon className="w-3 h-3 text-white" />
        </div>
        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>NewsAI</span>
      </div>
      <p className="text-xs">Built with React · Tailwind CSS · GSAP · Axios</p>
    </footer>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BoltIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}
function MoonIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  )
}
