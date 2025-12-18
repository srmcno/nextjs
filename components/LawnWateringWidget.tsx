'use client'

import { useState } from 'react'

interface LawnWateringWidgetProps {
  droughtStage: 'none' | 'stage1' | 'stage2' | 'stage3'
}

export default function LawnWateringWidget({ droughtStage }: LawnWateringWidgetProps) {
  const [houseNumber, setHouseNumber] = useState('')
  const [showResult, setShowResult] = useState(false)
  
  const isOdd = houseNumber ? parseInt(houseNumber) % 2 !== 0 : null
  const today = new Date()
  const isOddDay = today.getDate() % 2 !== 0
  
  // Watering logic based on drought stage
  const getWateringStatus = () => {
    if (droughtStage === 'stage3') {
      return {
        canWater: false,
        message: 'No outdoor watering allowed',
        detail: 'Stage 3 restrictions: All outdoor watering is prohibited.',
        color: 'text-rose-600',
        bgColor: 'bg-rose-50 border-rose-200',
        icon: '🚫'
      }
    }
    
    if (droughtStage === 'stage2') {
      return {
        canWater: false,
        message: 'Hand watering only',
        detail: 'Stage 2 restrictions: Only hand-held hoses allowed. No sprinklers.',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
        icon: '🚿'
      }
    }
    
    if (droughtStage === 'stage1') {
      // Odd/Even watering
      if (isOdd === null) {
        return {
          canWater: null,
          message: 'Enter your house number',
          detail: 'We\'ll tell you if today is your watering day.',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50 border-slate-200',
          icon: '🏠'
        }
      }
      
      const canWater = isOdd === isOddDay
      return {
        canWater,
        message: canWater ? 'YES! You can water today!' : 'Wait until tomorrow',
        detail: canWater 
          ? `Odd house numbers water on odd days. Today is the ${today.getDate()}${getOrdinal(today.getDate())}.`
          : `Even house numbers water on even days. Come back tomorrow!`,
        color: canWater ? 'text-emerald-600' : 'text-amber-600',
        bgColor: canWater ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200',
        icon: canWater ? '💧' : '⏳'
      }
    }
    
    // No restrictions
    return {
      canWater: true,
      message: 'Water anytime!',
      detail: 'No watering restrictions currently in effect.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      icon: '✅'
    }
  }

  const status = getWateringStatus()

  function getOrdinal(n: number) {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 text-white">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>🌱</span> Can I Water My Lawn?
        </h3>
        <p className="mt-1 text-sm text-emerald-100">
          Quick check for OKC residents
        </p>
      </div>

      <div className="p-5">
        {/* Current Stage Indicator */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <span className="text-sm font-medium text-slate-600">Current Restrictions:</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
            droughtStage === 'none' ? 'bg-emerald-100 text-emerald-700' :
            droughtStage === 'stage1' ? 'bg-yellow-100 text-yellow-700' :
            droughtStage === 'stage2' ? 'bg-amber-100 text-amber-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            {droughtStage === 'none' ? 'None' : 
             droughtStage === 'stage1' ? 'Stage 1 (Odd/Even)' :
             droughtStage === 'stage2' ? 'Stage 2 (Hand Water)' :
             'Stage 3 (No Watering)'}
          </span>
        </div>

        {droughtStage === 'stage1' && (
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter your house number:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={houseNumber}
                onChange={(e) => {
                  setHouseNumber(e.target.value)
                  setShowResult(false)
                }}
                placeholder="e.g., 1243"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-lg font-bold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Check
              </button>
            </div>
          </form>
        )}

        {/* Result */}
        {(droughtStage !== 'stage1' || showResult) && (
          <div className={`rounded-xl border-2 p-5 ${status.bgColor} transition-all ${showResult ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{status.icon}</div>
              <div>
                <div className={`text-xl font-black ${status.color}`}>
                  {status.message}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {status.detail}
                </p>
              </div>
            </div>
            
            {status.canWater === true && droughtStage === 'stage1' && (
              <div className="mt-4 flex justify-center">
                <div className="text-4xl animate-bounce">🎉</div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Reference */}
        {droughtStage === 'stage1' && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <div className="text-xs font-bold uppercase text-blue-600 mb-2">Odd/Even Schedule</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2 rounded ${isOddDay ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-white text-slate-500'}`}>
                Odd dates (1, 3, 5...) → Odd addresses
              </div>
              <div className={`p-2 rounded ${!isOddDay ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-white text-slate-500'}`}>
                Even dates (2, 4, 6...) → Even addresses
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
              Today is <strong>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> ({isOddDay ? 'odd' : 'even'} day)
            </div>
          </div>
        )}

        {/* Conservation Tips */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="text-xs font-bold uppercase text-slate-400 mb-2">Water-Saving Tips</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>🌅</span> Water before 10am
            </div>
            <div className="flex items-center gap-2">
              <span>🌙</span> Or after 6pm
            </div>
            <div className="flex items-center gap-2">
              <span>🌧️</span> Skip after rain
            </div>
            <div className="flex items-center gap-2">
              <span>📏</span> 1 inch per week is enough
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
