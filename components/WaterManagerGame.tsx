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
  difficulty: 'easy' | 'normal' | 'hard'
  score: number
  streak: number
  weatherEvent: 'sunny' | 'rainy' | 'drought' | 'storm'
}

export default function WaterManagerGame() {
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    lakeLevel: 598.5,
    okcSatisfaction: 50,
    localSatisfaction: 80,
    released: 0,
    events: ['☀️ August 1st. Hot summer day. You are now the Sardis Lake Water Manager.'],
    gameOver: false,
    outcome: null,
    difficulty: 'normal',
    score: 0,
    streak: 0,
    weatherEvent: 'sunny'
  })
  
  const [releaseAmount, setReleaseAmount] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [animateScore, setAnimateScore] = useState(false)

  const { baselineSummer } = SARDIS_WITHDRAWAL_THRESHOLDS
  
  // Random weather events for variety
  const getRandomWeather = (): 'sunny' | 'rainy' | 'drought' | 'storm' => {
    const rand = Math.random()
    if (rand < 0.5) return 'sunny'
    if (rand < 0.7) return 'rainy'
    if (rand < 0.85) return 'drought'
    return 'storm'
  }

  // Weather emoji and effects
  const weatherInfo = {
    sunny: { emoji: '☀️', evapMod: 1.2, inflowMod: 0.8, label: 'Hot & Sunny' },
    rainy: { emoji: '🌧️', evapMod: 0.5, inflowMod: 2.0, label: 'Rainy' },
    drought: { emoji: '🔥', evapMod: 1.8, inflowMod: 0.3, label: 'Extreme Heat' },
    storm: { emoji: '⛈️', evapMod: 0.3, inflowMod: 3.5, label: 'Thunderstorms' }
  }

  const difficultySettings = {
    easy: { evapBase: 0.015, okcDemand: 0.7, localSensitivity: 0.7, scoreMultiplier: 1.0 },
    normal: { evapBase: 0.025, okcDemand: 1.0, localSensitivity: 1.0, scoreMultiplier: 1.5 },
    hard: { evapBase: 0.035, okcDemand: 1.3, localSensitivity: 1.3, scoreMultiplier: 2.0 }
  }

  const settings = difficultySettings[gameState.difficulty]
  
  const processDay = () => {
    if (gameState.gameOver) return
    
    const newState = { ...gameState }
    const weather = weatherInfo[newState.weatherEvent]
    
    // More realistic water balance with weather
    const evaporation = (settings.evapBase + Math.random() * 0.02) * weather.evapMod
    const inflow = (Math.random() * 0.04) * weather.inflowMod
    const releaseDrop = releaseAmount * 0.0012
    
    newState.lakeLevel = newState.lakeLevel - evaporation + inflow - releaseDrop
    newState.released += releaseAmount
    newState.day += 1
    
    // Next day weather
    newState.weatherEvent = getRandomWeather()
    
    const newEvents: string[] = []
    let dayScore = 100
    
    // Critical game-ending conditions
    if (newState.lakeLevel < 589) {
      newState.gameOver = true
      newState.outcome = 'ecological'
      newEvents.push('🚨 CRITICAL: Lake dropped below 589 ft. Ecological emergency declared!')
      dayScore = -500
    } else if (newState.lakeLevel < baselineSummer && releaseAmount > 0) {
      newState.gameOver = true
      newState.outcome = 'tribal-stop'
      newEvents.push('⛔ STOP! The Choctaw-Chickasaw Nations have invoked Settlement protections.')
      newEvents.push(`Lake is at ${newState.lakeLevel.toFixed(1)} ft - below the ${baselineSummer} ft summer floor.`)
      dayScore = -300
    }
    
    // OKC satisfaction mechanics with difficulty scaling
    const okcOptimal = 400 * settings.okcDemand
    if (releaseAmount >= okcOptimal) {
      newState.okcSatisfaction = Math.min(100, newState.okcSatisfaction + 12)
      newEvents.push('📞 OKC Water Dept: Perfect! Thanks for the water. Residents are happy.')
      dayScore += 50
    } else if (releaseAmount >= 200) {
      newState.okcSatisfaction = Math.min(100, newState.okcSatisfaction + 5)
      newEvents.push('📞 OKC: Adequate supply today. Could use a bit more.')
      dayScore += 20
    } else if (releaseAmount === 0) {
      newState.okcSatisfaction = Math.max(0, newState.okcSatisfaction - (20 * settings.okcDemand))
      if (newState.okcSatisfaction < 30) {
        newEvents.push('☎️ URGENT: OKC Mayor calling! We need water NOW! Reservoirs critical!')
        dayScore -= 30
      } else {
        newEvents.push('📞 OKC: No water today? Our storage is dropping...')
        dayScore -= 15
      }
    } else {
      newState.okcSatisfaction = Math.max(0, newState.okcSatisfaction - (10 * settings.okcDemand))
      newEvents.push('📞 OKC: This amount is insufficient for city needs.')
      dayScore -= 10
    }
    
    // Local satisfaction with lake levels and sensitivity
    if (newState.lakeLevel >= baselineSummer + 2) {
      newState.localSatisfaction = Math.min(100, newState.localSatisfaction + (8 * settings.localSensitivity))
      newEvents.push('🎣 Local fishermen: Lake levels are PERFECT! Tourism is booming!')
      dayScore += 40
    } else if (newState.lakeLevel >= baselineSummer) {
      newState.localSatisfaction = Math.min(100, newState.localSatisfaction + 3)
      dayScore += 10
    } else if (newState.lakeLevel < baselineSummer - 3) {
      newState.localSatisfaction = Math.max(0, newState.localSatisfaction - (15 * settings.localSensitivity))
      newEvents.push('🎣 Local fishermen: The lake is too low! Boat ramps unusable!')
      dayScore -= 40
    } else if (newState.lakeLevel < baselineSummer) {
      newState.localSatisfaction = Math.max(0, newState.localSatisfaction - (8 * settings.localSensitivity))
      newEvents.push('😟 Locals: Lake is getting worryingly low...')
      dayScore -= 20
    }
    
    // Special events for variety and challenge
    if (newState.day === 2 && newState.weatherEvent === 'storm') {
      newEvents.push('⛈️ Severe weather warning! Heavy rain expected. Adjust strategy!')
      dayScore += 20
    }
    
    if (newState.day === 3) {
      newEvents.push('🏆 REMINDER: The Sardis Bass Tournament is this weekend!')
      dayScore += 10
    }
    
    if (newState.day === 4 && newState.weatherEvent === 'drought') {
      newEvents.push('🔥 Heat wave alert! Extra evaporation today.')
      dayScore -= 10
    }
    
    if (newState.day === 5) {
      if (newState.lakeLevel >= baselineSummer) {
        newEvents.push('🎉 Bass Tournament SUCCESS! 500+ anglers, $200K local economic impact!')
        newState.localSatisfaction = Math.min(100, newState.localSatisfaction + 20)
        dayScore += 100
        newState.streak += 1
      } else {
        newEvents.push('😞 Bass Tournament CANCELLED due to low water. Massive local disappointment.')
        newState.localSatisfaction = Math.max(0, newState.localSatisfaction - 30)
        dayScore -= 150
        newState.streak = 0
      }
    }
    
    // Bonus for maintaining good balance
    if (newState.okcSatisfaction >= 60 && newState.localSatisfaction >= 60) {
      dayScore += 30
      newState.streak += 1
      if (newState.streak >= 3) {
        newEvents.push('🔥 STREAK BONUS! Everyone is happy!')
        dayScore += 50
      }
    } else {
      newState.streak = 0
    }
    
    // Weather event notification for next day
    const nextWeather = weatherInfo[newState.weatherEvent]
    newEvents.push(`${nextWeather.emoji} Tomorrow: ${nextWeather.label} conditions expected`)
    
    // End game conditions
    if (newState.day === 8 && !newState.gameOver) {
      if (newState.okcSatisfaction >= 50 && newState.localSatisfaction >= 50) {
        newState.gameOver = true
        newState.outcome = 'win'
        const bonusScore = Math.floor((newState.okcSatisfaction + newState.localSatisfaction) * 2)
        dayScore += bonusScore
        newEvents.push('🎊 WEEK COMPLETE! You balanced everyone&apos;s needs successfully!')
        newEvents.push(`🏆 Final bonus: +${bonusScore} points!`)
      } else if (newState.okcSatisfaction < 30) {
        newState.gameOver = true
        newState.outcome = 'okc-angry'
        newEvents.push('😠 OKC has filed a formal complaint. You&apos;re fired!')
        dayScore = -200
      } else if (newState.localSatisfaction < 30) {
        newState.gameOver = true
        newState.outcome = 'tribal-stop'
        newEvents.push('⛔ Local community has lost confidence in your management.')
        dayScore = -200
      }
    }
    
    // Calculate final score with difficulty multiplier
    newState.score += Math.floor(dayScore * settings.scoreMultiplier)
    
    newState.events = [...newEvents, ...newState.events].slice(0, 10)
    setGameState(newState)
    setReleaseAmount(0)
    
    // Animate score change
    setAnimateScore(true)
    setTimeout(() => setAnimateScore(false), 500)
  }

  const resetGame = () => {
    setGameState({
      day: 1,
      lakeLevel: 598.5,
      okcSatisfaction: 50,
      localSatisfaction: 80,
      released: 0,
      events: ['☀️ August 1st. Hot summer day. You are now the Sardis Lake Water Manager.'],
      gameOver: false,
      outcome: null,
      difficulty: gameState.difficulty, // Keep selected difficulty
      score: 0,
      streak: 0,
      weatherEvent: 'sunny'
    })
    setReleaseAmount(0)
  }

  const startGame = (difficulty: 'easy' | 'normal' | 'hard') => {
    setGameState(prev => ({ ...prev, difficulty }))
    setShowInstructions(false)
  }

  if (showInstructions) {
    return (
      <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 text-white">
          <h3 className="text-2xl font-extrabold flex items-center gap-2">
            🎮 Water Manager Challenge
          </h3>
          <p className="mt-1 text-indigo-200">Can you balance competing water needs?</p>
        </div>
        
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed">
            <strong className="text-indigo-700">Your Mission:</strong> Manage Sardis Lake for one week in August. 
            Balance Oklahoma City&apos;s water needs with local recreation while following Settlement Agreement rules.
          </p>
          
          <div className="mt-5 grid gap-3">
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-2 border-blue-200">
              <strong className="text-blue-800 flex items-center gap-2">
                <span className="text-2xl">🏙️</span> OKC Water Demand
              </strong>
              <p className="text-sm text-blue-700 mt-2">
                Oklahoma City needs 300-500 cfs daily. Too little = angry mayor. Too much = wasted water.
              </p>
            </div>
            
            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-100 p-4 border-2 border-emerald-200">
              <strong className="text-emerald-800 flex items-center gap-2">
                <span className="text-2xl">🎣</span> Local Recreation
              </strong>
              <p className="text-sm text-emerald-700 mt-2">
                Keep lake levels high! The Bass Tournament (Day 5) brings $200K to local economy.
              </p>
            </div>
            
            <div className="rounded-xl bg-gradient-to-r from-rose-50 to-red-100 p-4 border-2 border-rose-200">
              <strong className="text-rose-800 flex items-center gap-2">
                <span className="text-2xl">⚖️</span> Settlement Agreement Rules
              </strong>
              <p className="text-sm text-rose-700 mt-2">
                <strong>NO RELEASES</strong> if lake drops below {baselineSummer} ft. Violation = GAME OVER!
              </p>
            </div>
          </div>

          <div className="mt-6 border-t-2 border-dashed border-slate-200 pt-5">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>🎯</span> Choose Difficulty
            </h4>
            <div className="grid gap-3">
              <button
                onClick={() => startGame('easy')}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 p-4 text-left text-white hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="font-bold text-lg">🌱 Easy Mode</div>
                <div className="text-sm text-emerald-100 mt-1">Lower demand, slower evaporation. Great for learning!</div>
              </button>

              <button
                onClick={() => startGame('normal')}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-left text-white hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="font-bold text-lg">⚡ Normal Mode</div>
                <div className="text-sm text-blue-100 mt-1">Balanced challenge. True to real conditions.</div>
              </button>

              <button
                onClick={() => startGame('hard')}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 p-4 text-left text-white hover:from-rose-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="font-bold text-lg">🔥 Hard Mode</div>
                <div className="text-sm text-rose-100 mt-1">Extreme heat, high demand. For experts only!</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const weatherCurrent = weatherInfo[gameState.weatherEvent]
  const progressPercent = ((gameState.day - 1) / 7) * 100

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-white overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              🎮 Water Manager Challenge
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {gameState.difficulty.toUpperCase()}
              </span>
            </h3>
            <p className="text-sm text-indigo-200">Day {gameState.day} of 7 • {weatherCurrent.emoji} {weatherCurrent.label}</p>
          </div>
          <button 
            onClick={resetGame} 
            className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30 transition-colors"
          >
            🔄 Restart
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Score and metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 p-4 bg-gradient-to-b from-slate-50 to-white border-b-2 border-indigo-100">
        <div className="text-center lg:col-span-1">
          <div className="text-xs font-bold uppercase text-slate-500">Score</div>
          <div className={`text-2xl font-black transition-all duration-300 ${
            animateScore ? 'scale-125 text-emerald-600' : 'text-indigo-600'
          }`}>
            {gameState.score}
          </div>
          {gameState.streak > 0 && (
            <div className="text-[10px] text-amber-600 font-bold">🔥 {gameState.streak}x streak</div>
          )}
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Lake Level</div>
          <div className={`text-xl font-black transition-colors ${
            gameState.lakeLevel >= baselineSummer + 2 ? 'text-emerald-600' :
            gameState.lakeLevel >= baselineSummer ? 'text-blue-600' : 'text-rose-600'
          }`}>
            {gameState.lakeLevel.toFixed(1)}&apos;
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">OKC 🏙️</div>
          <div className={`text-xl font-black ${
            gameState.okcSatisfaction >= 70 ? 'text-emerald-600' :
            gameState.okcSatisfaction >= 50 ? 'text-blue-600' :
            gameState.okcSatisfaction >= 30 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {gameState.okcSatisfaction}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Locals 🎣</div>
          <div className={`text-xl font-black ${
            gameState.localSatisfaction >= 70 ? 'text-emerald-600' :
            gameState.localSatisfaction >= 50 ? 'text-blue-600' :
            gameState.localSatisfaction >= 30 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {gameState.localSatisfaction}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-slate-500">Released</div>
          <div className="text-xl font-black text-slate-700">{gameState.released.toFixed(0)}</div>
          <div className="text-[10px] text-slate-500">cfs total</div>
        </div>
      </div>

      {/* Lake level visualization */}
      <div className="px-4 py-3 bg-slate-50">
        <div className="relative h-10 rounded-xl bg-gradient-to-r from-slate-300 to-slate-200 overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ${
              gameState.lakeLevel >= baselineSummer + 2 ? 'bg-gradient-to-r from-emerald-400 to-blue-400' :
              gameState.lakeLevel >= baselineSummer ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 
              'bg-gradient-to-r from-rose-400 to-red-500'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(0, 
                ((gameState.lakeLevel - 585) / (600 - 585)) * 100
              ))}%` 
            }}
          >
            {/* Animated water wave effect */}
            <div className="h-full w-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.3)_10px,rgba(255,255,255,0.3)_20px)]"></div>
          </div>
          {/* Critical threshold line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-rose-600 z-10 animate-pulse shadow-lg"
            style={{ left: `${((baselineSummer - 585) / (600 - 585)) * 100}%` }}
          />
          {/* Level label */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-lg">
            {gameState.lakeLevel.toFixed(1)} ft
          </div>
        </div>
        <div className="flex justify-between text-[10px] mt-2 font-bold">
          <span className="text-rose-600">↑ {baselineSummer}&apos; CRITICAL FLOOR</span>
          <span className="text-slate-500">Conservation: 599&apos;</span>
        </div>
      </div>

      {!gameState.gameOver && (
        <div className="p-5 border-t-2 border-indigo-100 bg-gradient-to-b from-white to-slate-50">
          <label className="block text-sm font-bold text-slate-800 mb-3">
            💧 Release Amount: <span className={`text-lg ${
              releaseAmount === 0 ? 'text-slate-500' :
              releaseAmount < 300 ? 'text-blue-600' :
              releaseAmount < 600 ? 'text-indigo-600' : 'text-rose-600'
            }`}>{releaseAmount} cfs</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={releaseAmount}
            onChange={(e) => setReleaseAmount(parseInt(e.target.value))}
            className="w-full h-4 rounded-full appearance-none cursor-pointer slider-gradient"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${releaseAmount/10}%, #3b82f6 ${releaseAmount/10}%, #3b82f6 ${Math.min(releaseAmount/10 + 30, 60)}%, #f59e0b ${Math.min(releaseAmount/10 + 30, 60)}%, #f59e0b ${Math.min(releaseAmount/10 + 50, 80)}%, #ef4444 ${Math.min(releaseAmount/10 + 50, 80)}%, #ef4444 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-2 font-medium">
            <span>0<br/><span className="text-[10px]">Closed</span></span>
            <span>300<br/><span className="text-[10px]">Optimal</span></span>
            <span>600<br/><span className="text-[10px]">High</span></span>
            <span>1000<br/><span className="text-[10px]">MAX</span></span>
          </div>
          
          <button
            onClick={processDay}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-lg font-bold text-white hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ⏭️ End Day {gameState.day} & Continue →
          </button>
        </div>
      )}

      {gameState.gameOver && (
        <div className={`p-6 border-t-2 ${
          gameState.outcome === 'win' 
            ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-300' 
            : 'bg-gradient-to-br from-rose-50 to-red-100 border-rose-300'
        }`}>
          <div className="text-center">
            <div className="text-6xl mb-3 animate-bounce">
              {gameState.outcome === 'win' ? '🏆' : 
               gameState.outcome === 'tribal-stop' ? '⛔' :
               gameState.outcome === 'okc-angry' ? '😠' : '🚨'}
            </div>
            <div className={`text-2xl font-extrabold mb-2 ${
              gameState.outcome === 'win' ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {gameState.outcome === 'win' ? 'YOU WON!' : 'GAME OVER'}
            </div>
            <div className={`text-3xl font-black mb-3 ${
              gameState.outcome === 'win' ? 'text-indigo-600' : 'text-slate-600'
            }`}>
              Final Score: {gameState.score}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
              {gameState.outcome === 'win' && 'Excellent work! You successfully balanced all needs while respecting the Settlement Agreement. You&apos;re a natural water manager!'}
              {gameState.outcome === 'tribal-stop' && 'The Settlement Agreement exists to prevent exactly this. The Nations&apos; water rights must be respected. Try managing more conservatively!'}
              {gameState.outcome === 'okc-angry' && 'OKC needs water too! Finding the right balance is key. Try releasing more water to meet city demands.'}
              {gameState.outcome === 'ecological' && 'The lake level dropped too low, causing ecological damage. Remember to watch those weather patterns!'}
            </p>
            <button
              onClick={resetGame}
              className="mt-5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-3 font-bold text-white hover:from-slate-800 hover:to-black transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Event log with better styling */}
      <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border-t-2 border-slate-200 max-h-52 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase text-slate-500">📋 Event Log</div>
          <div className="text-[10px] text-slate-400">{gameState.events.length} events</div>
        </div>
        <div className="space-y-1.5">
          {gameState.events.map((event, i) => (
            <div 
              key={i} 
              className={`text-xs p-2.5 rounded-lg transition-all ${
                i === 0 
                  ? 'bg-white font-semibold text-slate-800 shadow-sm border-l-4 border-indigo-500' 
                  : 'text-slate-600 bg-slate-50/50'
              }`}
            >
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
