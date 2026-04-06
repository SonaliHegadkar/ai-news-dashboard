// SearchFilter.jsx
// Search bar + 3 filter dropdowns (Category, Region, FocusArea)
// Shows removable chips for active filters

const CATEGORY_OPTIONS  = ['All', 'Automotive', 'Non-Automotive']
const REGION_OPTIONS    = ['All', 'Global', 'North America', 'Europe', 'Asia']
const FOCUS_AREA_OPTIONS = ['All', 'EV', 'Autonomous', 'Hydrogen', 'Technology', 'General']

export default function SearchFilter({
  search,    setSearch,
  category,  setCategory,
  region,    setRegion,
  focusArea, setFocusArea,
  darkMode,
  total,     filtered,
  hasActiveFilter, onClearAll,
}) {
  // Build list of active filter chips to display below the inputs
  const activeChips = [
    category  !== 'All' && { label: category,        onRemove: () => setCategory('All') },
    region    !== 'All' && { label: region,           onRemove: () => setRegion('All') },
    focusArea !== 'All' && { label: focusArea,        onRemove: () => setFocusArea('All') },
    search              && { label: `"${search}"`,    onRemove: () => setSearch('') },
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-3">

      {/* ── Row 1: inputs ── */}
      <div className="flex flex-col sm:flex-row gap-2.5">

        {/* Search input */}
        <div className="relative flex-1">
          <SearchIcon darkMode={darkMode} />
          <input
            type="text"
            placeholder="Search articles by title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={inputClass(darkMode, 'pl-10 pr-9 py-2.5')}
          />
          {search && (
            <ClearButton onClick={() => setSearch('')} darkMode={darkMode} />
          )}
        </div>

        {/* Category filter */}
        <FilterDropdown
          value={category}
          onChange={setCategory}
          options={CATEGORY_OPTIONS}
          placeholder="All Categories"
          darkMode={darkMode}
        />

        {/* Region filter */}
        <FilterDropdown
          value={region}
          onChange={setRegion}
          options={REGION_OPTIONS}
          placeholder="All Regions"
          darkMode={darkMode}
        />

        {/* Focus Area filter */}
        <FilterDropdown
          value={focusArea}
          onChange={setFocusArea}
          options={FOCUS_AREA_OPTIONS}
          placeholder="All Focus Areas"
          darkMode={darkMode}
        />

        {/* Result count badge */}
        <div className={`hidden lg:flex items-center gap-1 px-3 py-2.5 rounded-xl border
          text-xs font-medium whitespace-nowrap shrink-0
          ${darkMode
            ? 'bg-slate-900/60 border-slate-700 text-slate-400'
            : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}>
          <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {filtered}
          </span>
          <span>/ {total}</span>
        </div>

      </div>

      {/* ── Row 2: active filter chips ── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Active:
          </span>

          {activeChips.map((chip, i) => (
            <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} darkMode={darkMode} />
          ))}

          <button
            onClick={onClearAll}
            className={`text-xs font-medium transition-colors
              ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}
          >
            Clear all
          </button>
        </div>
      )}

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterDropdown({ value, onChange, options, darkMode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={inputClass(darkMode, 'px-3 py-2.5 cursor-pointer sm:w-40')}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt === 'All' ? `All` : opt}
        </option>
      ))}
    </select>
  )
}

function FilterChip({ label, onRemove, darkMode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
      text-xs font-medium border transition-colors
      ${darkMode
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
        : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
      {label}
      <button onClick={onRemove} className="hover:opacity-60 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

function SearchIcon({ darkMode }) {
  return (
    <svg
      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
        ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

function ClearButton({ onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-3 top-1/2 -translate-y-1/2
        w-5 h-5 rounded-full flex items-center justify-center transition-colors
        ${darkMode
          ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

// ─── Shared style helper ──────────────────────────────────────────────────────

function inputClass(darkMode, extra = '') {
  const base = 'w-full text-sm border outline-none rounded-xl transition-all duration-200'
  const theme = darkMode
    ? 'bg-slate-900/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 shadow-sm'
  return `${base} ${theme} ${extra}`
}
