'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

type Point = { t: string; v: number }

interface WaterChartProps {
  data: Point[]
  threshold?: number
  isFlow?: boolean
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
  isFlow
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: Point }>
  isFlow?: boolean
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <div className="text-xs text-gray-500">{formatTime(data.payload.t)}</div>
      <div className="mt-1 font-semibold text-gray-900">
        {data.value.toFixed(2)} {isFlow ? 'cfs' : 'ft'}
      </div>
    </div>
  )
}

export default function WaterChart({ data, threshold, isFlow = false }: WaterChartProps) {
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

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            width={50}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => v.toFixed(0)}
            domain={[domainMin, domainMax]}
          />
          <Tooltip content={<CustomTooltip isFlow={isFlow} />} />
          {threshold && (
            <ReferenceLine
              y={threshold}
              stroke="#22c55e"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'Conservation Pool',
                position: 'insideTopRight',
                fill: '#22c55e',
                fontSize: 10
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="v"
            stroke={isFlow ? '#0ea5e9' : '#1E4F91'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
