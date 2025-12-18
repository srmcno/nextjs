'use client'

interface CantonTransitLossProps {
  rawStorageAF: number
}

export default function CantonTransitLoss({ rawStorageAF }: CantonTransitLossProps) {
  const TRANSIT_LOSS_FACTOR = 0.30 // 30% loss per Exhibit 13
  const cityStorageAF = rawStorageAF * (1 - TRANSIT_LOSS_FACTOR)
  
  const CANTON_MAX_LIVE = 97176 // Raw live storage capacity
  const CANTON_CITY_MAX = 68023 // After 30% deduction per Exhibit 13
  
  const rawPercent = (rawStorageAF / CANTON_MAX_LIVE) * 100
  const cityPercent = (cityStorageAF / CANTON_CITY_MAX) * 100

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-white">
        <h3 className="text-lg font-bold">Canton Lake: Transit Loss Explained</h3>
        <p className="mt-1 text-sm text-amber-100">
          Why &quot;City Storage&quot; differs from &quot;Total Storage&quot;
        </p>
      </div>

      <div className="p-5">
        {/* Visual Explanation */}
        <div className="rounded-xl bg-amber-50 p-4 mb-5">
          <p className="text-sm text-amber-900">
            <strong>Per Exhibit 13:</strong> When calculating OKC&apos;s system storage, Canton Lake&apos;s 
            capacity is reduced by <strong>30%</strong> to account for water lost during the 
            150+ mile journey from Canton to Oklahoma City via the North Canadian River and pipelines.
          </p>
        </div>

        {/* Storage Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Storage (What you'd find on Google) */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌊</span>
              <div>
                <div className="text-xs font-bold uppercase text-slate-500">Total Storage</div>
                <div className="text-xs text-slate-400">(What you&apos;d see on USACE)</div>
              </div>
            </div>
            
            <div className="text-3xl font-black text-slate-700">
              {(rawStorageAF / 1000).toFixed(1)}k
              <span className="text-sm font-medium text-slate-500 ml-1">AF</span>
            </div>
            
            <div className="mt-2 h-4 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${Math.min(100, rawPercent)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {rawPercent.toFixed(1)}% of {(CANTON_MAX_LIVE / 1000).toFixed(1)}k AF capacity
            </div>
          </div>

          {/* City Storage (Settlement Calculation) */}
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏙️</span>
              <div>
                <div className="text-xs font-bold uppercase text-emerald-700">City Storage</div>
                <div className="text-xs text-emerald-600">(Settlement calculation)</div>
              </div>
            </div>
            
            <div className="text-3xl font-black text-emerald-700">
              {(cityStorageAF / 1000).toFixed(1)}k
              <span className="text-sm font-medium text-emerald-500 ml-1">AF</span>
            </div>
            
            <div className="mt-2 h-4 rounded-full bg-emerald-100 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(100, cityPercent)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-emerald-600">
              {cityPercent.toFixed(1)}% of {(CANTON_CITY_MAX / 1000).toFixed(1)}k AF effective capacity
            </div>
          </div>
        </div>

        {/* Visual Flow Diagram */}
        <div className="mt-6 relative">
          <div className="flex items-center justify-between">
            {/* Canton */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-400 flex items-center justify-center">
                <div>
                  <div className="text-2xl">🏞️</div>
                  <div className="text-[10px] font-bold text-blue-700">Canton</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-slate-600">
                {(rawStorageAF / 1000).toFixed(1)}k AF
              </div>
            </div>

            {/* Arrow with loss indicator */}
            <div className="flex-1 relative mx-4">
              <div className="h-1 bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 rounded" />
              
              {/* Loss indicator */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-100 rounded-lg px-3 py-2 text-center border border-amber-300">
                <div className="text-amber-700 font-bold text-lg">-30%</div>
                <div className="text-[10px] text-amber-600">Transit Loss</div>
              </div>
              
              {/* Water droplets falling */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="text-lg animate-bounce" style={{ animationDelay: '0ms' }}>💧</span>
                <span className="text-lg animate-bounce" style={{ animationDelay: '200ms' }}>💧</span>
                <span className="text-lg animate-bounce" style={{ animationDelay: '400ms' }}>💧</span>
              </div>
              
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap">
                150+ miles via North Canadian River
              </div>
            </div>

            {/* OKC */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center">
                <div>
                  <div className="text-2xl">🏙️</div>
                  <div className="text-[10px] font-bold text-emerald-700">OKC</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-emerald-600">
                {(cityStorageAF / 1000).toFixed(1)}k AF
              </div>
            </div>
          </div>
        </div>

        {/* Math Breakdown */}
        <div className="mt-10 rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-bold uppercase text-slate-500 mb-3">Calculation (Exhibit 13, Table 2)</div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Raw Live Storage:</span>
              <span className="font-bold text-slate-800">{rawStorageAF.toLocaleString()} AF</span>
            </div>
            <div className="flex justify-between text-amber-600">
              <span>× Transit Loss Factor:</span>
              <span className="font-bold">× 0.70 (after 30% loss)</span>
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between text-emerald-700">
              <span className="font-bold">= City Storage:</span>
              <span className="font-bold">{cityStorageAF.toLocaleString()} AF</span>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <h4 className="font-bold text-blue-800 flex items-center gap-2">
            <span>💡</span> Why This Matters
          </h4>
          <p className="mt-2 text-sm text-blue-700">
            When calculating whether OKC is in a &quot;Drought Condition&quot; per the Settlement Agreement, 
            only <strong>{(cityStorageAF / 1000).toFixed(1)}k AF</strong> (not {(rawStorageAF / 1000).toFixed(1)}k AF) 
            counts toward the 407,105 AF system total. This ensures the drought triggers accurately 
            reflect water actually available to OKC residents.
          </p>
        </div>
      </div>
    </div>
  )
}
