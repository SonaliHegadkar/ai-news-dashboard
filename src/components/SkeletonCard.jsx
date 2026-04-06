export default function SkeletonCard({ darkMode }) {
  const dm   = darkMode
  const base = dm ? 'bg-slate-700/60' : 'bg-slate-200'
  const card = dm ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white border-slate-200'

  return (
    <div className={`border rounded-2xl overflow-hidden animate-pulse ${card}`}>

      {/* Image placeholder */}
      <div className={`h-44 ${dm ? 'bg-slate-800' : 'bg-slate-100'}`} />

      <div className="p-4 flex flex-col gap-3">
        {/* Time + read row */}
        <div className="flex justify-between">
          <div className={`h-2.5 w-16 rounded-full ${base}`} />
          <div className={`h-2.5 w-10 rounded-full ${base}`} />
        </div>
        {/* Title */}
        <div className={`h-4 w-full rounded-lg ${base}`} />
        <div className={`h-4 w-3/4 rounded-lg ${base}`} />
        {/* Description */}
        <div className={`h-3 w-full rounded-full ${base}`} />
        <div className={`h-3 w-5/6 rounded-full ${base}`} />
        {/* Divider */}
        <div className={`border-t pt-2.5 ${dm ? 'border-slate-700/60' : 'border-slate-100'}`}>
          <div className="flex gap-1.5">
            {[80, 56, 64, 52].map((w, i) => (
              <div key={i} className={`h-4 rounded-full ${base}`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
