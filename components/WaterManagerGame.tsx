'use client'

import { useState } from 'react'
import { SARDIS_WITHDRAWAL_THRESHOLDS } from '../lib/waterBodies'

interface GameState {
  day: number
  lakeLevel: number
  okcSatisfaction: number
  localSatisfaction: number
  released: number
  events: string[]
  gameOver: boolean
  outcome: 'win' | 'okc-angry' | 'tribal-stop' | 'ecological' | null
}

export default function WaterManagerGame() {
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    lakeLevel: 598.5,
    okcSatisfaction: 50,
    localSatisfaction: 80,
    released: 0,
    events: ['August 1st. Hot summer day. You are now the Sardis Lake Water Manager.'],
    gameOver: false,
    outcome: null
  })
  
  const [releaseAmount, setReleaseAmount] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)

  const { baselineSummer } = SARDIS_WITHDRAWAL_THRESHOLDS
  
  const processDay = () => {
    if (gameState.gameOver) return
    
    const newState = { ...gameState }
    const evaporation = 0.02 + Math.random() * 0.03
    const inflow = Math.random() * 0.03
    const releaseDrop = releaseAmount * 0.001
    
    newState.lakeLevel = newState.lakeLevel - evaporation + inflow - releaseDrop
    newState.released += releaseAmount
    newState.day += 1
    
    const newEvents: string[] = []
    
    if (newState.lakeLevel < 589) {
      newState.gameOver = true
      newState.outcome = 'ecological'
      newEvents.push('🚨 CRITICAL: Lake dropped below 589 ft. Ecological emergency declared!')
    } else if (newState.lakeLevel < baselineSummer && releaseAmount > 0) {
      newState.gameOver = true
      newState.outcome = 'tribal-stop'
      newEvents.push('⛔ STOP! The Choctaw-Chickasaw Nations have invoked Settlement protections.')
      newEvents.push(`Lake is at ${newState.lakeLevel.toFixed(1)} ft - below the ${baselineSummer} ft summer floor.`)
    }
    
    if (releaseAmount >= 500) {
      newState.okcSatisfaction = Math.min(100, newState.okcSatisfaction + 10)
      newEvents.push('📞 OKC Water Dept: Thanks for the water. Residents are happy.')
    } else if (releaseAmount === 0) {
      newState.okcSatisfaction = Math.max(0, newState.okcSatisfaction - 15)
      if (newState.okcSatisfaction < 30) {
        newEvents.push('📞 OKC Mayor calling: We need water! Our reservoirs are dropping!')
      }
    }
    
    if (newState.lakeLevel >= baselineSummer - 1) {
      newState.localSatisfaction = Math.min(100, newState.localSatisfaction + 5)
    } else if (newState.lakeLevel < baselineSummer - 3) {
      newState.localSatisfaction = Math.max(0, newState.localSatisfaction - 10)
      newEvents.push('🎣 Local fishermen: The lake is too low! We cannot launch boats!')
    }
    
    if (newState.day === 3) {
      newEvents.push('🏆 REMINDER: The Sardis Bass Tournament is this weekend!')
    }
    if (newState.day === 5) {
      if (newState.lakeLevel >= baselineSummer - 2) {
        newEvents.push('🎉 Bass Tournament was a success! Local economy boosted.')
        newState.localSatisfaction = Math.min(100, newState.localSatisfaction + 15)
      } else {
        newEvents.push('😞 Bass Tournament attendance down due to low water.')
        newState.localSatisfaction = Math.max(0, newState.localSatisfaction - 20)
      }
    }
    
    if (newState.day === 7 && !newState.gameOver) {
      if (newState.okcSatisfaction >= 50 && newState.localSatisfaction >= 50) {
        newState.gameOver = true
        newState.outcome = 'win'
        newEvents.push('🎊 WEEK COMPLETE! You balanced everyone\'s needs successfully!')
      } else if (newState.okcSatisfaction < 30) {
        newState.gameOver = true
        newState.outcome = 'okc-angry'
        newEvents.push('😠 OKC has filed a formal complaint.')
      }
    }
    
    newState.events = [...newEvents, ...newState.events].slice(0, 8)
    setGameState(newState)
    setReleaseAmount(0)
  }

  const resetGame = () => {
    setGameState({
      day: 1,
      lakeLevel: 598.5,
      okcSatisfaction: 50,
      localSatisfaction: 80,
      released: 0,
      events: ['August 1st. Hot summer day. You are now the Sardis Lake Water Manager.'],
      gameOver: false,
      outcome: null
    })
    setReleaseAmount(0)
    setShowInstructions(true)
  }

  if (showInstructions) {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 text-white">
          <h3 className="text-xl font-bold">🎮 You Are The Water Manager</h3>
          <p className="mt-1 text-slate-300">A Settlement Agreement Simulation</p>
        </div>
        
        <div className="p-6">
          <p className="text-slate-700">
            <strong>Your Mission:</strong> Manage Sardis Lake for one week in August. 
            Balance Oklahoma City water needs with local recreation and Settlement Agreement rules.
          </p>
          
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <strong className="text-blue-700">🏙️ OKC Needs:</strong>
              <p className="text-sm text-blue-600 mt-1">
                Oklahoma City needs water from Sardis. Release at least 200-500 cfs daily.
              </p>
            </div>
            
            <div className="rounded-lg bg-emerald-50 p-3">
              <strong className="text-emerald-700">🎣 Local Needs:</strong>
              <p className="text-sm text-emerald-600 mt-1">
                Residents want good lake levels for fishing. The Bass Tournament is this weekend!
              </p>
            </div>
            
            <div className="rounded-lg bg-rose-50 p-3">
              <strong className="text-rose-700">⚖️ The Rules:</strong>
              <p className="text-sm text-rose-600 mt-1">
                Settlement Agreement: NO RELEASES if lake drops below {baselineSummer} ft (summer baseline).
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-lg font-bold text-white hover:bg-emerald-700"
          >
            Start Managing! →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4 text-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">🎮 Water Manager Simulator</h3>
          <p className="text-sm text-slate-300">Day {gameState.day} of 7 • August</p>
        </div>
        <button onClick={resetGame} className="rounded-lg bg-white/20 px-3 py-1 text-sm hover:bg-white/30">
          Restart
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 border-b">
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Lake Level</div>
          <div className={`text-xl font-black ${
            gameState.lakeLevel >= baselineSummer ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {gameState.lakeLevel.toFixed(1)} ft
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">OKC Happy</div>
          <div className={`text-xl font-black ${
            gameState.okcSatisfaction >= 50 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {gameState.okcSatisfaction}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Locals Happy</div>
          <div className={`text-xl font-black ${
            gameState.localSatisfaction >= 50 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {gameState.localSatisfaction}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Released</div>
          <div className="text-xl font-black text-slate-700">{gameState.released} cfs</div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="relative h-8 rounded-full bg-slate-200 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              gameState.lakeLevel >= baselineSummer ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(0, 
                ((gameState.lakeLevel - 585) / (600 - 585)) * 100
              ))}%` 
            }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-rose-600 z-10"
            style={{ left: `${((baselineSummer - 585) / (600 - 585)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] mt-1 font-bold">
          <span className="text-rose-600">↑ {baselineSummer} ft Floor</span>
          <span className="text-slate-500">Conservation Pool: 599 ft</span>
        </div>
      </div>

      {!gameState.gameOver && (
        <div className="p-4 border-t">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Release Amount: <span className="text-blue-600">{releaseAmount} cfs</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={releaseAmount}
            onChange={(e) => setReleaseAmount(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-400"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0 (Closed)</span>
            <span>500 (Moderate)</span>
            <span>1000 (Full Open)</span>
          </div>
          
          <button
            onClick={processDay}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-700"
          >
            End Day {gameState.day} →
          </button>
        </div>
      )}

      {gameState.gameOver && (
        <div className={`p-4 border-t ${
          gameState.outcome === 'win' ? 'bg-emerald-50' : 'bg-rose-50'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-2">
              {gameState.outcome === 'win' ? '🏆' : 
               gameState.outcome === 'tribal-stop' ? '⛔' :
               gameState.outcome === 'okc-angry' ? '😠' : '🚨'}
            </div>
            <div className={`text-xl font-bold ${
              gameState.outcome === 'win' ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {gameState.outcome === 'win' ? 'YOU WON!' : 'GAME OVER'}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {gameState.outcome === 'win' && 'You successfully balanced all needs while respecting the Settlement Agreement.'}
              {gameState.outcome === 'tribal-stop' && 'The Settlement Agreement exists to prevent exactly this. Respect the lake level floors!'}
              {gameState.outcome === 'okc-angry' && 'OKC needs water too. Finding the balance is key.'}
              {gameState.outcome === 'ecological' && 'The lake level dropped too low, causing ecological damage.'}
            </p>
            <button
              onClick={resetGame}
              className="mt-4 rounded-xl bg-slate-800 px-6 py-2 font-bold text-white hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-slate-50 border-t max-h-48 overflow-y-auto">
        <div className="text-xs font-bold uppercase text-slate-400 mb-2">Event Log</div>
        <div className="space-y-1">
          {gameState.events.map((event, i) => (
            <div key={i} className={`text-xs p-2 rounded ${i === 0 ? 'bg-white font-medium' : 'text-slate-500'}`}>
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
