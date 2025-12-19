import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, Zap, Wind, AlertTriangle, TrendingUp, Award, Volume2, VolumeX } from 'lucide-react'

interface Resource {
  current: number
  max: number
  rate: number
}

interface Resources {
  water: Resource
  energy: Resource
  atmosphere: Resource
}

interface Building {
  id: string
  name: string
  cost: { water: number; energy: number }
  effect: { water?: number; energy?: number; atmosphere?: number }
  count: number
  baseProduction?: number
}

interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: string
}

interface Challenge {
  id: string
  type: 'drought' | 'sandstorm' | 'equipment_failure'
  name: string
  description: string
  duration: number
  effect: { water?: number; energy?: number; atmosphere?: number }
  active: boolean
  timeRemaining: number
}

const BUILDINGS: Building[] = [
  {
    id: 'water_extractor',
    name: 'Water Extractor',
    cost: { water: 0, energy: 10 },
    effect: { water: 1 },
    count: 0,
    baseProduction: 1
  },
  {
    id: 'solar_panel',
    name: 'Solar Panel',
    cost: { water: 5, energy: 0 },
    effect: { energy: 2 },
    count: 0,
    baseProduction: 2
  },
  {
    id: 'atmosphere_processor',
    name: 'Atmosphere Processor',
    cost: { water: 20, energy: 30 },
    effect: { atmosphere: 1 },
    count: 0,
    baseProduction: 1
  },
  {
    id: 'advanced_extractor',
    name: 'Advanced Extractor',
    cost: { water: 50, energy: 40 },
    effect: { water: 5 },
    count: 0,
    baseProduction: 5
  },
  {
    id: 'fusion_reactor',
    name: 'Fusion Reactor',
    cost: { water: 100, energy: 50 },
    effect: { energy: 10 },
    count: 0,
    baseProduction: 10
  }
]

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_extractor', name: 'First Steps', description: 'Build your first water extractor', unlocked: false, icon: '🎯' },
  { id: 'water_100', name: 'Hydration Station', description: 'Collect 100 water', unlocked: false, icon: '💧' },
  { id: 'energy_50', name: 'Power Player', description: 'Generate 50 energy', unlocked: false, icon: '⚡' },
  { id: 'atmosphere_10', name: 'Air We Go', description: 'Process 10 atmosphere', unlocked: false, icon: '🌪️' },
  { id: 'survive_challenge', name: 'Crisis Manager', description: 'Survive your first challenge', unlocked: false, icon: '🛡️' }
]

const CHALLENGES: Omit<Challenge, 'active' | 'timeRemaining'>[] = [
  {
    id: 'drought',
    type: 'drought',
    name: 'Water Shortage',
    description: 'Reduced water production',
    duration: 30,
    effect: { water: -0.5 }
  },
  {
    id: 'sandstorm',
    type: 'sandstorm',
    name: 'Sandstorm',
    description: 'Reduced energy production',
    duration: 20,
    effect: { energy: -0.3 }
  },
  {
    id: 'equipment_failure',
    type: 'equipment_failure',
    name: 'Equipment Failure',
    description: 'All production halved',
    duration: 15,
    effect: { water: -0.5, energy: -0.5, atmosphere: -0.5 }
  }
]

export default function WaterManagerGame() {
  const [resources, setResources] = useState<Resources>({
    water: { current: 0, max: 100, rate: 0 },
    energy: { current: 50, max: 100, rate: 0 },
    atmosphere: { current: 0, max: 100, rate: 0 }
  })

  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS)
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [showNotification, setShowNotification] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass()
        }
      } catch (error) {
        console.error('Failed to create audio context:', error)
      }
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [soundEnabled])

  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }, [soundEnabled])

  const showNotificationMessage = useCallback((message: string) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(null), 3000)
  }, [])

  const checkAchievements = useCallback(() => {
    setAchievements(prev => {
      const updated = [...prev]
      let hasNewAchievement = false

      if (!updated[0].unlocked && buildings[0].count > 0) {
        updated[0].unlocked = true
        hasNewAchievement = true
        showNotificationMessage('🎉 Achievement Unlocked: First Steps!')
        playSound(523.25, 0.2)
      }

      if (!updated[1].unlocked && resources.water.current >= 100) {
        updated[1].unlocked = true
        hasNewAchievement = true
        showNotificationMessage('🎉 Achievement Unlocked: Hydration Station!')
        playSound(659.25, 0.2)
      }

      if (!updated[2].unlocked && resources.energy.current >= 50) {
        updated[2].unlocked = true
        hasNewAchievement = true
        showNotificationMessage('🎉 Achievement Unlocked: Power Player!')
        playSound(783.99, 0.2)
      }

      if (!updated[3].unlocked && resources.atmosphere.current >= 10) {
        updated[3].unlocked = true
        hasNewAchievement = true
        showNotificationMessage('🎉 Achievement Unlocked: Air We Go!')
        playSound(880.00, 0.2)
      }

      return hasNewAchievement ? updated : prev
    })
  }, [buildings, resources, showNotificationMessage, playSound])

  const purchaseBuilding = useCallback((buildingId: string) => {
    setBuildings(prev => {
      const building = prev.find(b => b.id === buildingId)
      if (!building) return prev

      const canAfford = resources.water.current >= building.cost.water &&
                       resources.energy.current >= building.cost.energy

      if (!canAfford) {
        showNotificationMessage('❌ Insufficient resources!')
        playSound(200, 0.1, 'square')
        return prev
      }

      setResources(res => ({
        ...res,
        water: { ...res.water, current: res.water.current - building.cost.water },
        energy: { ...res.energy, current: res.energy.current - building.cost.energy }
      }))

      playSound(440, 0.1)
      showNotificationMessage(`✅ Built ${building.name}!`)

      return prev.map(b =>
        b.id === buildingId ? { ...b, count: b.count + 1 } : b
      )
    })
  }, [resources, showNotificationMessage, playSound])

  const triggerRandomChallenge = useCallback(() => {
    if (activeChallenges.length >= 2) return

    const availableChallenges = CHALLENGES.filter(
      c => !activeChallenges.some(ac => ac.id === c.id)
    )

    if (availableChallenges.length === 0) return

    const challenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)]
    const newChallenge: Challenge = {
      ...challenge,
      active: true,
      timeRemaining: challenge.duration
    }

    setActiveChallenges(prev => [...prev, newChallenge])
    showNotificationMessage(`⚠️ ${challenge.name}: ${challenge.description}`)
    playSound(300, 0.3, 'sawtooth')
  }, [activeChallenges, showNotificationMessage, playSound])

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1)

      // Update resources
      setResources(prev => {
        const newResources = { ...prev }

        // Calculate production rates
        let waterRate = 0
        let energyRate = 0
        let atmosphereRate = 0

        buildings.forEach(building => {
          if (building.count > 0) {
            waterRate += (building.effect.water || 0) * building.count
            energyRate += (building.effect.energy || 0) * building.count
            atmosphereRate += (building.effect.atmosphere || 0) * building.count
          }
        })

        // Apply challenge effects
        activeChallenges.forEach(challenge => {
          waterRate += (challenge.effect.water || 0) * waterRate
          energyRate += (challenge.effect.energy || 0) * energyRate
          atmosphereRate += (challenge.effect.atmosphere || 0) * atmosphereRate
        })

        newResources.water.rate = waterRate
        newResources.energy.rate = energyRate
        newResources.atmosphere.rate = atmosphereRate

        newResources.water.current = Math.min(
          newResources.water.max,
          Math.max(0, newResources.water.current + waterRate)
        )
        newResources.energy.current = Math.min(
          newResources.energy.max,
          Math.max(0, newResources.energy.current + energyRate)
        )
        newResources.atmosphere.current = Math.min(
          newResources.atmosphere.max,
          Math.max(0, newResources.atmosphere.current + atmosphereRate)
        )

        return newResources
      })

      // Update challenges
      setActiveChallenges(prev => {
        const updated = prev.map(challenge => ({
          ...challenge,
          timeRemaining: challenge.timeRemaining - 1
        })).filter(challenge => {
          if (challenge.timeRemaining <= 0) {
            showNotificationMessage(`✅ ${challenge.name} ended!`)
            playSound(500, 0.2)
            
            // Check if this is the first challenge survived
            setAchievements(prevAch => {
              const updated = [...prevAch]
              if (!updated[4].unlocked) {
                updated[4].unlocked = true
                showNotificationMessage('🎉 Achievement Unlocked: Crisis Manager!')
                playSound(1046.50, 0.2)
              }
              return updated
            })
            
            return false
          }
          return true
        })

        return updated
      })

      // Update score
      setScore(prev => prev + Math.floor(
        (resources.water.rate + resources.energy.rate + resources.atmosphere.rate) * 10
      ))

      // Random challenge trigger (5% chance every second)
      if (Math.random() < 0.05) {
        triggerRandomChallenge()
      }

      checkAchievements()
    }, 1000)

    return () => clearInterval(interval)
  }, [buildings, activeChallenges, resources, checkAchievements, triggerRandomChallenge, showNotificationMessage, playSound])

  const getResourceColor = (resource: Resource) => {
    const percentage = (resource.current / resource.max) * 100
    if (percentage < 25) return 'bg-red-500'
    if (percentage < 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-red-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Droplet className="text-blue-400" />
            Mars Water Manager
            <Droplet className="text-blue-400" />
          </h1>
          <p className="text-orange-200">Manage resources and terraform the Red Planet!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-white">
              <TrendingUp className="inline mr-2" />
              Score: {score.toLocaleString()}
            </div>
            <div className="text-white">
              Time: {formatTime(gameTime)}
            </div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-white text-gray-900 px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
            {showNotification}
          </div>
        )}

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="text-yellow-400" />
              Active Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map(challenge => (
                <Card key={challenge.id} className="bg-red-900/50 border-red-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{challenge.name}</h3>
                        <p className="text-orange-200 text-sm">{challenge.description}</p>
                      </div>
                      <div className="text-white font-bold">
                        {challenge.timeRemaining}s
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplet className="text-white" />
                  <h3 className="text-white font-bold">Water</h3>
                </div>
                <span className="text-white text-sm">
                  {resources.water.rate.toFixed(1)}/s
                </span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-blue-900 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${getResourceColor(resources.water)}`}
                    style={{ width: `${(resources.water.current / resources.water.max) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-white text-sm">
                {resources.water.current.toFixed(1)} / {resources.water.max}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="text-white" />
                  <h3 className="text-white font-bold">Energy</h3>
                </div>
                <span className="text-white text-sm">
                  {resources.energy.rate.toFixed(1)}/s
                </span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-yellow-900 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${getResourceColor(resources.energy)}`}
                    style={{ width: `${(resources.energy.current / resources.energy.max) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-white text-sm">
                {resources.energy.current.toFixed(1)} / {resources.energy.max}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wind className="text-white" />
                  <h3 className="text-white font-bold">Atmosphere</h3>
                </div>
                <span className="text-white text-sm">
                  {resources.atmosphere.rate.toFixed(1)}/s
                </span>
              </div>
              <div className="mb-2">
                <div className="w-full bg-cyan-900 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${getResourceColor(resources.atmosphere)}`}
                    style={{ width: `${(resources.atmosphere.current / resources.atmosphere.max) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-white text-sm">
                {resources.atmosphere.current.toFixed(1)} / {resources.atmosphere.max}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Buildings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Buildings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map(building => (
              <Card key={building.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-bold">{building.name}</h3>
                      <p className="text-gray-400 text-sm">Owned: {building.count}</p>
                    </div>
                  </div>
                  <div className="mb-3 space-y-1">
                    <div className="text-sm text-orange-200">
                      Cost: {building.cost.water > 0 && `💧 ${building.cost.water}`}
                      {building.cost.water > 0 && building.cost.energy > 0 && ' '}
                      {building.cost.energy > 0 && `⚡ ${building.cost.energy}`}
                    </div>
                    <div className="text-sm text-green-200">
                      Produces:
                      {building.effect.water && ` 💧 +${building.effect.water}/s`}
                      {building.effect.energy && ` ⚡ +${building.effect.energy}/s`}
                      {building.effect.atmosphere && ` 🌪️ +${building.effect.atmosphere}/s`}
                    </div>
                  </div>
                  <Button
                    onClick={() => purchaseBuilding(building.id)}
                    className="w-full"
                    disabled={
                      resources.water.current < building.cost.water ||
                      resources.energy.current < building.cost.energy
                    }
                  >
                    Build
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="text-yellow-400" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <Card
                key={achievement.id}
                className={`${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400'
                    : 'bg-gray-800 border-gray-700 opacity-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-white font-bold">{achievement.name}</h3>
                      <p className="text-gray-200 text-sm">{achievement.description}</p>
                      {achievement.unlocked && (
                        <p className="text-yellow-200 text-xs mt-1">✓ Unlocked</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
