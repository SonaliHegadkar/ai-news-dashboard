const styles = {
  Category: {
    Automotive:       { dark: 'bg-blue-500/15 text-blue-300 border-blue-500/25',     light: 'bg-blue-50 text-blue-600 border-blue-200' },
    'Non-Automotive': { dark: 'bg-purple-500/15 text-purple-300 border-purple-500/25', light: 'bg-purple-50 text-purple-600 border-purple-200' },
  },
  Type: {
    OE:          { dark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', light: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    Aftermarket: { dark: 'bg-orange-500/15 text-orange-300 border-orange-500/25',   light: 'bg-orange-50 text-orange-600 border-orange-200' },
    General:     { dark: 'bg-slate-500/15 text-slate-400 border-slate-500/25',      light: 'bg-slate-100 text-slate-500 border-slate-200' },
  },
  FocusArea: {
    EV:         { dark: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',       light: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
    Autonomous: { dark: 'bg-violet-500/15 text-violet-300 border-violet-500/25', light: 'bg-violet-50 text-violet-600 border-violet-200' },
    Hydrogen:   { dark: 'bg-teal-500/15 text-teal-300 border-teal-500/25',       light: 'bg-teal-50 text-teal-600 border-teal-200' },
    Technology: { dark: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25', light: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    General:    { dark: 'bg-slate-500/15 text-slate-400 border-slate-500/25',    light: 'bg-slate-100 text-slate-500 border-slate-200' },
  },
  Region: {
    Global:          { dark: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25', light: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    'North America': { dark: 'bg-red-500/15 text-red-300 border-red-500/25',          light: 'bg-red-50 text-red-600 border-red-200' },
    Europe:          { dark: 'bg-sky-500/15 text-sky-300 border-sky-500/25',          light: 'bg-sky-50 text-sky-600 border-sky-200' },
    Asia:            { dark: 'bg-pink-500/15 text-pink-300 border-pink-500/25',       light: 'bg-pink-50 text-pink-600 border-pink-200' },
  },
}

const fallback = {
  dark:  'bg-slate-500/15 text-slate-400 border-slate-500/25',
  light: 'bg-slate-100 text-slate-500 border-slate-200',
}

export default function ClassificationBadge({ type, value, darkMode }) {
  const mode  = darkMode ? 'dark' : 'light'
  const style = styles[type]?.[value]?.[mode] || fallback[mode]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${style}`}>
      <span className="opacity-50">{type[0]}</span>
      {value}
    </span>
  )
}
