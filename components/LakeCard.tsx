'use client'

import { useEffect, useState } from 'react'
import WaterChart from './WaterChart'

export default function LakeCard({ name, site }: any) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`/api/usgs?site=${site}`)
      .then(res => res.json())
      .then(json => {
        const points =
          json.value.timeSeries[0]?.values[0]?.value.map((v: any) => ({
            time: v.dateTime,
            level: Number(v.value)
          })) || []
        setData(points)
      })
  }, [site])

  return (
    <div
      style={{
        background: 'white',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <h3>{name}</h3>
      <WaterChart data={data} />
    </div>
  )
}
