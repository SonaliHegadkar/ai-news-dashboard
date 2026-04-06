import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const ROTATING_WORDS = ['Classification', 'Intelligence', 'Insights', 'Analytics', 'Detection']

export default function Header({ total, filtered, loaded, darkMode }) {
  const badgeRef    = useRef(null)
  const titleRef    = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef    = useRef(null)
  const wordRef     = useRef(null)
  const shimmerRef  = useRef(null)

  const [wordIndex, setWordIndex] = useState(0)

  // Original stagger: opacity 0, y 30, duration 1, delay 1, stagger 0.3
  useEffect(() => {
    gsap.fromTo(
      [badgeRef.current, titleRef.current, subtitleRef.current, statsRef.current],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 1, stagger: 0.3, ease: 'power3.out' }
    )
  }, [])

  // Rotate word every 3 seconds
  useEffect(() => {
    const id = setInterval(() => setWordIndex(p => (p + 1) % ROTATING_WORDS.length), 3000)
    return () => clearInterval(id)
  }, [])

  // 3D flip on word change
  useEffect(() => {
    if (!wordRef.current) return
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, rotateX: 90, y: 10 },
      { opacity: 1, rotateX: 0, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }, [wordIndex])

  // Shimmer sweep
  useEffect(() => {
    if (!shimmerRef.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.5 })
    tl.fromTo(
      shimmerRef.current,
      { x: '-100%', opacity: 0.7 },
      { x: '220%',  opacity: 0, duration: 0.9, ease: 'power1.inOut' }
    )
  }, [])

  const dm = darkMode

  return (
    <div className="mb-6">

      {/* AI badge */}
      <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 opacity-0
        bg-blue-500/10 border-blue-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">AI Powered</span>
      </div>

      {/* Title */}
      <h1
        ref={titleRef}
        className={`text-4xl sm:text-5xl font-bold mb-3 leading-tight opacity-0 ${dm ? 'text-white' : 'text-slate-900'}`}
        style={{ perspective: '600px' }}
      >
        News{' '}
        <span className="relative inline-block overflow-hidden">
          <span
            ref={wordRef}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500"
            style={{ transformOrigin: 'center top' }}
          >
            {ROTATING_WORDS[wordIndex]}
          </span>
          <span
            ref={shimmerRef}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
          />
        </span>
      </h1>

      {/* Subtitle */}
      <p ref={subtitleRef} className={`text-sm sm:text-base mb-8 max-w-xl opacity-0 leading-relaxed ${dm ? 'text-slate-400' : 'text-slate-500'}`}>
        Real-time AI classification of news articles by category, type, focus area, and region.
      </p>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-0">
        <StatCard label="Total"      value={total}          icon="📰" accent="from-blue-500 to-blue-600"    darkMode={dm} />
        <StatCard label="Showing"    value={filtered}       icon="👁️" accent="from-cyan-500 to-cyan-600"    darkMode={dm} />
        <StatCard label="Classified" value={loaded}         icon="✅" accent="from-emerald-500 to-emerald-600" darkMode={dm} />
        <StatCard label="Pending"    value={total - loaded} icon="⏳" accent="from-amber-500 to-amber-600"  darkMode={dm} />
      </div>

    </div>
  )
}

function StatCard({ label, value, icon, accent, darkMode }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 group hover:-translate-y-0.5 ${
      darkMode
        ? 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
    }`}>
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent}`} />
      <div className="flex items-center justify-between mb-1">
        <span className="text-base">{icon}</span>
      </div>
      <div className={`text-2xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-slate-800'}`}>{value}</div>
      <div className={`text-xs font-medium mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
    </div>
  )
}
