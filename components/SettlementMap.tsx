'use client'

import { useState } from 'react'
import { SETTLEMENT_WATER_BODIES, WaterBody } from '../lib/waterBodies'

const waterBodyPositions: Record<string, { x: number; y: number }> = {
  'sardis': { x: 280, y: 180 },
  'hugo': { x: 320, y: 240 },
  'mcgee': { x: 200, y: 140 },
  'atoka': { x: 180, y: 160 },
  'broken-bow': { x: 380, y: 200 },
  'kiamichi-clayton': { x: 300, y: 200 },
  'kiamichi-antlers': { x: 340, y: 220 }
}

const settlementCounties = [
  { name: 'Atoka', x: 180, y: 150 },
  { name: 'Bryan', x: 220, y: 280 },
  { name: 'Choctaw', x: 340, y: 260 },
  { name: 'McCurtain', x: 400, y: 220 },
  { name: 'Pushmataha', x: 300, y: 180 },
]

export default function SettlementMap() {
  const [selectedBody, setSelectedBody] = useState<WaterBody | null>(null)
  const [showCounties, setShowCounties] = useState(false)

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-emerald-900 px-5 py-4 text-white">
        <h3 className="text-lg font-bold">Settlement Area Map</h3>
        <p className="mt-1 text-sm text-slate-300">
          22 counties • 7 monitored water bodies
        </p>
      </div>

      <div className="flex gap-2 p-3 bg-slate-50 border-b">
        <button
          onClick={() => setShowCounties(!showCounties)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            showCounties ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border'
          }`}
        >
          {showCounties ? '✓' : ''} Show Counties
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-500" /> Reservoir
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-cyan-400" /> River
          </span>
        </div>
      </div>

      <div className="relative p-4">
        <svg viewBox="0 0 500 350" className="w-full h-auto">
          <path
            d="M 20 50 L 450 50 L 450 80 L 480 80 L 480 300 L 20 300 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          
          <path
            d="M 50 100 L 420 100 L 420 290 L 50 290 Z"
            fill="#dcfce7"
            fillOpacity="0.5"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {showCounties && settlementCounties.map((county) => (
            <g key={county.name}>
              <text
                x={county.x}
                y={county.y}
                className="text-[8px] fill-slate-400 font-medium"
                textAnchor="middle"
              >
                {county.name}
              </text>
            </g>
          ))}

          <path
            d="M 280 180 Q 300 190 320 200 Q 340 215 360 230 Q 380 245 400 260"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {SETTLEMENT_WATER_BODIES.map((wb) => {
            const pos = waterBodyPositions[wb.id]
            if (!pos) return null
            
            const isReservoir = wb.type === 'reservoir'
            const isSelected = selectedBody?.id === wb.id
            const isCritical = wb.isSettlementCritical
            
            return (
              <g 
                key={wb.id}
                className="cursor-pointer"
                onClick={() => setSelectedBody(selectedBody?.id === wb.id ? null : wb)}
              >
                {isCritical && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isReservoir ? 18 : 12}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
                
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isReservoir ? 12 : 8}
                  fill={isReservoir ? '#3b82f6' : '#22d3ee'}
                  stroke={isSelected ? '#1e293b' : 'white'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all hover:scale-110"
                />
                
                <text
                  x={pos.x}
                  y={pos.y + (isReservoir ? 22 : 18)}
                  className={`text-[9px] font-bold ${isCritical ? 'fill-amber-600' : 'fill-slate-600'}`}
                  textAnchor="middle"
                >
                  {wb.name.replace(' Lake', '').replace(' Reservoir', '').replace('Kiamichi R. nr ', '')}
                </text>
              </g>
            )
          })}

          <g transform="translate(30, 310)">
            <rect x="0" y="0" width="150" height="30" fill="white" fillOpacity="0.9" rx="4" />
            <circle cx="15" cy="15" r="6" fill="#3b82f6" />
            <text x="28" y="19" className="text-[9px] fill-slate-600">Reservoir</text>
            <circle cx="80" cy="15" r="4" fill="#22d3ee" />
            <text x="90" y="19" className="text-[9px] fill-slate-600">River</text>
          </g>
        </svg>

        {selectedBody && (
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur border border-slate-200 p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${selectedBody.type === 'reservoir' ? '💧' : '🌊'}`} />
                  <h4 className="font-bold text-slate-900">{selectedBody.name}</h4>
                  {selectedBody.isSettlementCritical && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      Settlement Critical
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{selectedBody.county} County</p>
              </div>
              <button 
                onClick={() => setSelectedBody(null)}
                className="rounded-full p-1 hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>
            
            <p className="mt-2 text-sm text-slate-600">{selectedBody.description}</p>
            
            <div className="mt-3 grid grid-cols-3 gap-2">
              {selectedBody.conservationPool && (
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Cons. Pool</div>
                  <div className="text-sm font-bold text-slate-700">{selectedBody.conservationPool} ft</div>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 p-2 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Type</div>
                <div className="text-sm font-bold text-slate-700 capitalize">{selectedBody.type}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Source</div>
                <div className="text-sm font-bold text-slate-700">{selectedBody.usaceId || 'USGS'}</div>
              </div>
            </div>
            
            <a 
              href="/dashboard" 
              className="mt-3 block text-center text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View Live Data →
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-px bg-slate-200 border-t">
        <div className="bg-white p-3 text-center">
          <div className="text-2xl font-black text-slate-900">22</div>
          <div className="text-[10px] font-bold uppercase text-slate-500">Counties</div>
        </div>
        <div className="bg-white p-3 text-center">
          <div className="text-2xl font-black text-blue-600">5</div>
          <div className="text-[10px] font-bold uppercase text-slate-500">Reservoirs</div>
        </div>
        <div className="bg-white p-3 text-center">
          <div className="text-2xl font-black text-cyan-600">2</div>
          <div className="text-[10px] font-bold uppercase text-slate-500">River Gauges</div>
        </div>
      </div>
    </div>
  )
}
