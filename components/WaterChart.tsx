'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function WaterChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis />
        <Tooltip />
        <Line dataKey="level" stroke="#1E4F91" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
