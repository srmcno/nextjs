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
import { ALERT_THRESHOLDS } from '../lib/waterBodies'

type Point = { t: string; v: number }

interface WaterChartProps {
  data: Point[]
  threshold?: number
  isFlow?: boolean
  streambed?: number
  floodPoolTop?: number
  alertLines?: { value: number; label: string; color?: string }[]
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

function CustomTooltip({
  active,
  payload,
  isFlow,
  threshold,
  streambed
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: Point }>
  isFlow?: boolean
  threshold?: number
  streambed?: number
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]
  const percent =
    threshold && streambed !== undefined
      ? ((data.value - streambed) / (threshold - streambed)) * 100
      : null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{formatTime(data.payload.t)}</div>
      <div className="mt-1 flex items-baseline gap-2 font-semibold text-slate-900">
        <span className="text-lg">{data.value.toFixed(2)}</span>
        <span className="text-xs text-slate-500">{isFlow ? 'cfs' : 'ft'}</span>
        {percent !== null && Number.isFinite(percent) && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            {percent.toFixed(0)}% of pool
          </span>
        )}
      </div>
    </div>
  )
}

export default function WaterChart({
  data,
  threshold,
  isFlow = false,
  streambed,
  floodPoolTop,
  alertLines
}: WaterChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-gray-400">
        No data available
      </div>
    )
  }

  // Calculate domain with some padding
  const values = data.map(d => d.v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const padding = (max - min) * 0.1 || 1

  // Include threshold in domain calculation if present
  let domainMin = min - padding
  let domainMax = max + padding

  if (threshold) {
    domainMin = Math.min(domainMin, threshold - padding)
    domainMax = Math.max(domainMax, threshold + padding)
  }

  const hasBands = threshold && streambed !== undefined
  const bands = hasBands
    ? [
        {
          label: 'Normal',
          y1: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.normal) / 100,
          y2: threshold,
          color: 'rgba(16,185,129,0.08)'
        },
        {
          label: 'Watch',
          y1: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.watch) / 100,
          y2: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.normal) / 100,
          color: 'rgba(234,179,8,0.08)'
        },
        {
          label: 'Warning',
          y1: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.warning) / 100,
          y2: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.watch) / 100,
          color: 'rgba(249,115,22,0.08)'
        },
        {
          label: 'Critical',
          y1: streambed,
          y2: streambed + ((threshold - streambed) * ALERT_THRESHOLDS.warning) / 100,
          color: 'rgba(239,68,68,0.08)'
        }
      ]
    : []

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 10, left: 10 }}>
          <defs>
            <linearGradient id="waterFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={isFlow ? '#0ea5e9' : '#1E4F91'} stopOpacity={0.18} />
              <stop offset="100%" stopColor={isFlow ? '#0ea5e9' : '#1E4F91'} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: '#475569' }}
            tickFormatter={(iso: string) => {
              const d = new Date(iso)
              return `${d.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`
            }}
            minTickGap={20}
          />
          <YAxis
            width={55}
            tick={{ fontSize: 11, fill: '#475569' }}
            tickFormatter={(v: number) => v.toFixed(0)}
            domain={[domainMin, domainMax]}
            label={{ value: isFlow ? 'Discharge (cfs)' : 'Elevation (ft)', angle: -90, position: 'insideLeft', fill: '#475569' }}
          />
          <Tooltip content={<CustomTooltip isFlow={isFlow} threshold={threshold} streambed={streambed} />} />

          {bands.map(band => (
            <ReferenceArea
              key={band.label}
              y1={band.y1}
              y2={band.y2}
              x1={data[0].t}
              x2={data[data.length - 1].t}
              fill={band.color}
              strokeOpacity={0}
            />
          ))}

          {streambed !== undefined && (
            <ReferenceLine
              y={streambed}
              stroke="#94a3b8"
              strokeDasharray="5 5"
              label={{ value: 'Streambed', position: 'insideLeft', fill: '#475569', fontSize: 10 }}
            />
          )}

          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: 'Conservation Pool',
                position: 'insideRight',
                fill: '#0f5132',
                fontSize: 11
              }}
            />
          )}

          {floodPoolTop && (
            <ReferenceLine
              y={floodPoolTop}
              stroke="#0ea5e9"
              strokeDasharray="6 3"
              label={{ value: 'Top of Flood Pool', position: 'insideRight', fill: '#075985', fontSize: 10 }}
            />
          )}

          {alertLines?.map(line => (
            <ReferenceLine
              key={`${line.label}-${line.value}`}
              y={line.value}
              stroke={line.color ?? '#f97316'}
              strokeDasharray="2 2"
              label={{ value: line.label, position: 'insideRight', fill: line.color ?? '#c2410c', fontSize: 10 }}
            />
          ))}

          <Area type="monotone" dataKey="v" stroke="none" fill="url(#waterFill)" />
          <Line
            type="monotone"
            dataKey="v"
            stroke={isFlow ? '#0284c7' : '#0f172a'}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: isFlow ? '#0284c7' : '#0f172a', strokeWidth: 0 }}
            animationDuration={300}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
