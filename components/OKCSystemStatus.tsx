'use client'

import { useState } from 'react'
import { getDroughtConditionDisplay } from '../lib/okcReservoirSystem'
import { useOKCSystem, type OKCSystemSnapshot } from '../lib/useOKCSystem'

interface OKCSystemStatusProps {
  /** Optional pre-fetched snapshot — if omitted, the component fetches its own. */
  snapshot?: OKCSystemSnapshot
}

export default function OKCSystemStatus({ snapshot }: OKCSystemStatusProps) {
  const ownSnapshot = useOKCSystem()
  const data = snapshot ?? ownSnapshot
  const [showDetails, setShowDetails] = useState(false)

  const { loading, percentage, totalStorage, hefnerPct, draperPct, drought, sardisRule } = data
  const display = getDroughtConditionDisplay(drought.condition)

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl" />

  return (
    <div className={`rounded-2xl border-2 ${display.borderColor} bg-white shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 py-4 ${display.bgColor} border-b ${display.borderColor}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">OKC System Combined Storage</h3>
            <p className="text-xs text-slate-600">Settlement Agreement Exhibit 13</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${display.color} bg-white/80 border ${display.borderColor}`}>
              {display.icon} {display.label}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Headline percentage */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">{percentage.toFixed(1)}</span>
              <span className="text-xl text-slate-500">%</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500">
              {(totalStorage / 1000).toFixed(1)}k of 407.1k AF
            </span>
          </div>

          <div className="h-8 sm:h-6 w-full bg-slate-100 rounded-full relative overflow-hidden ring-1 ring-slate-200">
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10" style={{ left: '50%' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10" style={{ left: '65%' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10" style={{ left: '75%' }} />
            <div
              className={`h-full transition-all duration-1000 ${
                percentage < 50 ? 'bg-rose-500' :
                percentage < 65 ? 'bg-amber-500' :
                percentage < 75 ? 'bg-yellow-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>

          <div className="hidden sm:flex justify-between text-[10px] text-slate-400 mt-1 font-bold uppercase">
            <span>0%</span>
            <span className="text-rose-600">50% Critical</span>
            <span className="text-amber-600">65% Warning</span>
            <span className="text-yellow-600">75% Watch</span>
            <span className="text-emerald-600">100%</span>
          </div>

          <div className="flex sm:hidden justify-between text-[9px] mt-1.5 font-bold">
            <span className="text-rose-600">Critical</span>
            <span className="text-amber-600">Warning</span>
            <span className="text-yellow-600">Watch</span>
            <span className="text-emerald-600">Normal</span>
          </div>
        </div>

        {/* Plain-language summary */}
        <div className={`rounded-xl p-4 mb-4 ${display.bgColor} border ${display.borderColor}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{display.icon}</span>
            <div>
              <div className={`font-bold ${display.color}`}>{display.label}</div>
              <p className="text-sm text-slate-600 mt-1">{display.description}</p>
            </div>
          </div>
        </div>

        {/* Drought trigger details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Drought Trigger Details</span>
            <span className="text-slate-400 text-sm">{showDetails ? '▲' : '▼'}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {[
              { label: 'System', value: percentage, met: drought.details.systemMet },
              { label: 'Hefner', value: hefnerPct, met: drought.details.hefnerMet },
              { label: 'Draper', value: draperPct, met: drought.details.draperMet }
            ].map((item) => (
              <div
                key={item.label}
                className={`flex-1 rounded-lg p-2 text-center text-xs ${
                  item.met
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                <div className="font-bold">{item.value.toFixed(0)}%</div>
                <div className="text-[9px] uppercase">{item.label}</div>
              </div>
            ))}
          </div>
        </button>

        {showDetails && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4 space-y-3">
            <p className="text-xs text-slate-600">
              <strong>How Drought is Declared:</strong> Per WSA Section 6, a drought condition
              is triggered only when ALL THREE indicators fall below the threshold:
            </p>
            <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1">
              <li>Combined System Storage &lt; threshold</li>
              <li>Lake Hefner individually &lt; threshold</li>
              <li>Stanley Draper individually &lt; threshold</li>
            </ol>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded bg-rose-50 p-2">
                <div className="font-bold text-rose-700">&lt;50%</div>
                <div className="text-rose-600">Extreme</div>
              </div>
              <div className="rounded bg-amber-50 p-2">
                <div className="font-bold text-amber-700">&lt;65%</div>
                <div className="text-amber-600">Advanced</div>
              </div>
              <div className="rounded bg-yellow-50 p-2">
                <div className="font-bold text-yellow-700">&lt;75%</div>
                <div className="text-yellow-600">Moderate</div>
              </div>
            </div>
          </div>
        )}

        {/* Sardis release floor */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          sardisRule.isDroughtOverride
            ? 'bg-amber-50 border-amber-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <span className="text-xl shrink-0">{sardisRule.isDroughtOverride ? '⚠️' : '💧'}</span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900">
              Sardis Release Floor: {sardisRule.minimumElevation} ft MSL
            </div>
            <div className="text-xs text-slate-600 mt-0.5">{sardisRule.reason}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
