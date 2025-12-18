'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid
} from 'recharts'
import { SARDIS_WITHDRAWAL_THRESHOLDS } from '../lib/waterBodies'

interface DataPoint {
  t: string
  v: number
}

interface SardisSeasonalChartProps {
  data: DataPoint[]
  showWaterAvailable?: boolean
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric'
    })
  } catch {
    return iso
  }
}

function CustomTooltip({
  active,
  payload
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: DataPoint; dataKey: string; color: string }>
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]
  const currentLevel = data.value
  const { conservationPool, baselineSummer, baselineWinter } = SARDIS_WITHDRAWAL_THRESHOLDS
  
  const date = new Date(data.payload.t)
  const month = date.getMonth() + 1
  const isSummer = month >= 4 && month <= 8
  const floor = isSummer ? baselineSummer : baselineWinter
  const floorLabel = isSummer ? 'Summer Floor' : 'Winter Floor'
  
  const waterAvailable = Math.max(0, currentLevel - floor)
  const poolPercent = ((currentLevel - 530) / (conservationPool - 530)) * 100

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl min-w-[220px]">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {formatTime(data.payload.t)}
      </div>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{currentLevel.toFixed(2)}</span>
        <span className="text-sm text-slate-500">ft MSL</span>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-slate-50 p-2">
          <div className="text-slate-500">{floorLabel}</div>
          <div className="font-bold text-slate-700">{floor} ft</div>
        </div>
        <div className={`rounded p-2 ${waterAvailable > 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className={waterAvailable > 0 ? 'text-emerald-600' : 'text-rose-600'}>Water Available</div>
          <div className={`font-bold ${waterAvailable > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {waterAvailable > 0 ? `${waterAvailable.toFixed(1)} ft` : 'NONE'}
          </div>
        </div>
      </div>
      
      <div className="mt-2 rounded-full bg-slate-100 h-2 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, poolPercent))}%` }}
        />
      </div>
      <div className="text-[10px] text-slate-400 text-right mt-0.5">
        {poolPercent.toFixed(1)}% of pool
      </div>
    </div>
  )
}

export default function SardisSeasonalChart({ data, showWaterAvailable = true }: SardisSeasonalChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No data available
      </div>
    )
  }

  const { 
    conservationPool, 
    baselineSummer, 
    baselineWinter, 
    advancedDroughtFloor, 
    extremeDroughtFloor 
  } = SARDIS_WITHDRAWAL_THRESHOLDS

  const values = data.map(d => d.v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  
  const domainMin = Math.min(min - 2, extremeDroughtFloor - 2)
  const domainMax = Math.max(max + 2, conservationPool + 2)

  const currentMonth = new Date().getMonth() + 1
  const isSummer = currentMonth >= 4 && currentMonth <= 8
  const currentFloor = isSummer ? baselineSummer : baselineWinter

  const enhancedData = data.map(d => ({
    ...d,
    floor: currentFloor,
    waterAvailable: Math.max(0, d.v - currentFloor)
  }))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sardis Lake - Water Available for Release</h3>
            <p className="text-sm text-slate-500">
              Per Exhibit 13 of the Settlement Agreement
            </p>
          </div>
          <div className={`rounded-full px-4 py-1.5 text-sm font-bold ${
            isSummer 
              ? 'bg-amber-100 text-amber-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {isSummer ? '☀️ Summer Season' : '❄️ Winter Season'}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-b flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
          <span className="text-slate-600">Current Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 bg-emerald-200 opacity-50" />
          <span className="text-slate-600">Water Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-8 bg-amber-500" />
          <span className="text-slate-600">Summer Floor ({baselineSummer} ft)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-8 bg-blue-400" />
          <span className="text-slate-600">Winter Floor ({baselineWinter} ft)</span>
        </div>
      </div>

      <div className="p-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={enhancedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="waterAvailableGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="t"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(iso: string) => {
                  const d = new Date(iso)
                  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                }}
                minTickGap={40}
              />
              
              <YAxis
                width={55}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v: number) => `${v.toFixed(0)} ft`}
                domain={[domainMin, domainMax]}
              />
              
              <Tooltip content={<CustomTooltip />} />

              {showWaterAvailable && (
                <ReferenceArea
                  y1={currentFloor}
                  y2={domainMax}
                  fill="#dcfce7"
                  fillOpacity={0.3}
                />
              )}

              <ReferenceArea
                y1={domainMin}
                y2={currentFloor}
                fill="#fef2f2"
                fillOpacity={0.5}
              />

              <ReferenceLine
                y={conservationPool}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="6 4"
              />

              <ReferenceLine
                y={baselineSummer}
                stroke="#f59e0b"
                strokeWidth={2}
              />

              <ReferenceLine
                y={baselineWinter}
                stroke="#3b82f6"
                strokeWidth={2}
              />

              <ReferenceLine
                y={advancedDroughtFloor}
                stroke="#dc2626"
                strokeWidth={1}
                strokeDasharray="4 4"
              />

              <Area
                type="monotone"
                dataKey="v"
                stroke="none"
                fill="url(#waterAvailableGradient)"
              />

              <Line
                type="monotone"
                dataKey="v"
                stroke="#1e40af"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#1e40af', strokeWidth: 0 }}
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-5 py-4 bg-slate-50 border-t">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3 border">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <span className="text-amber-500">☀️</span> Summer Season (Apr-Aug)
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              Floor: <strong>{baselineSummer} ft</strong>. OKC cannot withdraw water if the lake 
              drops below this level.
            </p>
          </div>
          <div className="rounded-lg bg-white p-3 border">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <span className="text-blue-500">❄️</span> Winter Season (Sep-Mar)
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              Floor: <strong>{baselineWinter} ft</strong>. Lower floor allows more flexibility 
              during lower recreational demand.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
