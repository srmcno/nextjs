'use client'

import { useEffect, useRef } from 'react'

interface PixelLakeSceneProps {
  lakeLevel: number
  weather: 'sunny' | 'rainy' | 'drought' | 'storm'
  releaseAmount: number
  day: number
  isGameOver: boolean
  outcome: 'win' | 'okc-angry' | 'tribal-stop' | 'ecological' | null
}

interface Boat {
  x: number
  y: number
  speed: number
  direction: 1 | -1
}

interface Fish {
  x: number
  y: number
  speed: number
  direction: 1 | -1
  frame: number
}

interface Bird {
  x: number
  y: number
  speed: number
  frame: number
}

interface Cloud {
  x: number
  y: number
  speed: number
}

interface Raindrop {
  x: number
  y: number
  speed: number
}

interface Lightning {
  x: number
  alpha: number
  timer: number
}

export default function PixelLakeScene({
  lakeLevel,
  weather,
  releaseAmount,
  day,
  isGameOver,
  outcome,
}: PixelLakeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const entitiesRef = useRef({
    boats: [] as Boat[],
    fish: [] as Fish[],
    birds: [] as Bird[],
    clouds: [] as Cloud[],
    raindrops: [] as Raindrop[],
    lightning: null as Lightning | null,
    fishermanCastFrame: 0,
    bobberY: 0,
    waterOffset: 0,
    splashTimer: 0,
  })

  // NES-inspired color palette
  const colors = {
    sky: {
      sunny: '#5CBBFF',
      rainy: '#4A90B8',
      storm: '#2C3E50',
      drought: '#FF8844',
    },
    water: '#2E8DCC',
    waterDark: '#1A5F8C',
    waterHighlight: '#5CC2FF',
    grass: '#4CAF50',
    mountain: '#6A4C93',
    tree: '#2E7D32',
    treeTrunk: '#5D4037',
    sand: '#D4A574',
    dock: '#8D6E63',
    boat: '#DC143C',
    boatHighlight: '#FF6B6B',
    fish: '#FFA500',
    bird: '#333333',
    cloud: '#FFFFFF',
    sun: '#FFD700',
    rain: '#A0C4FF',
    dam: '#757575',
    warning: '#FF0000',
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // Initialize entities
    const entities = entitiesRef.current
    if (entities.boats.length === 0) {
      entities.boats = [
        { x: 100, y: 0, speed: 0.3, direction: 1 },
        { x: 300, y: 0, speed: 0.25, direction: -1 },
      ]
      entities.fish = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * 480,
        y: 0,
        speed: 0.4 + Math.random() * 0.3,
        direction: Math.random() > 0.5 ? 1 : -1,
        frame: Math.floor(Math.random() * 10),
      }))
      entities.birds = Array.from({ length: 3 }, (_, i) => ({
        x: i * 160,
        y: 30 + Math.random() * 40,
        speed: 0.6 + Math.random() * 0.4,
        frame: 0,
      }))
      entities.clouds = Array.from({ length: 4 }, (_, i) => ({
        x: i * 120,
        y: 20 + Math.random() * 30,
        speed: 0.1 + Math.random() * 0.1,
      }))
    }

    // Calculate water surface based on lake level (normalized 589-600 ft range)
    const waterSurfaceY = 320 - ((lakeLevel - 585) / (600 - 585)) * 140

    const drawPixelRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h))
    }

    const drawSky = () => {
      const skyColor = colors.sky[weather]
      ctx.fillStyle = skyColor
      ctx.fillRect(0, 0, 480, waterSurfaceY)
    }

    const drawSun = () => {
      if (weather === 'sunny' || weather === 'drought') {
        const sunX = 400
        const sunY = 60
        const sunSize = weather === 'drought' ? 16 : 12

        // Sun body
        ctx.fillStyle = colors.sun
        ctx.fillRect(sunX, sunY, sunSize, sunSize)

        // Sun rays (simple cross pattern)
        const rayLength = 8
        ctx.fillRect(sunX + sunSize / 2 - 1, sunY - rayLength, 2, rayLength)
        ctx.fillRect(sunX + sunSize / 2 - 1, sunY + sunSize, 2, rayLength)
        ctx.fillRect(sunX - rayLength, sunY + sunSize / 2 - 1, rayLength, 2)
        ctx.fillRect(sunX + sunSize, sunY + sunSize / 2 - 1, rayLength, 2)
      }
    }

    const drawClouds = () => {
      entities.clouds.forEach((cloud) => {
        ctx.fillStyle = weather === 'storm' ? '#555555' : colors.cloud
        // Simple pixelated cloud shape
        drawPixelRect(cloud.x, cloud.y, 32, 8, ctx.fillStyle)
        drawPixelRect(cloud.x + 8, cloud.y - 4, 16, 12, ctx.fillStyle)
        drawPixelRect(cloud.x + 4, cloud.y + 8, 24, 4, ctx.fillStyle)

        // Move clouds
        cloud.x += cloud.speed
        if (cloud.x > 480) cloud.x = -40
      })
    }

    const drawMountains = () => {
      ctx.fillStyle = colors.mountain
      // Simple triangular mountains
      ctx.beginPath()
      ctx.moveTo(0, waterSurfaceY)
      ctx.lineTo(80, waterSurfaceY - 60)
      ctx.lineTo(160, waterSurfaceY)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(120, waterSurfaceY)
      ctx.lineTo(200, waterSurfaceY - 80)
      ctx.lineTo(280, waterSurfaceY)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(240, waterSurfaceY)
      ctx.lineTo(320, waterSurfaceY - 50)
      ctx.lineTo(400, waterSurfaceY)
      ctx.fill()
    }

    const drawTrees = () => {
      const trees = [50, 150, 350, 420]
      trees.forEach((x) => {
        // Trunk
        ctx.fillStyle = colors.treeTrunk
        drawPixelRect(x, waterSurfaceY - 16, 6, 16, ctx.fillStyle)

        // Foliage (simple triangle)
        ctx.fillStyle = colors.tree
        ctx.beginPath()
        ctx.moveTo(x + 3, waterSurfaceY - 28)
        ctx.lineTo(x - 6, waterSurfaceY - 16)
        ctx.lineTo(x + 12, waterSurfaceY - 16)
        ctx.closePath()
        ctx.fill()
      })
    }

    const drawWater = () => {
      const waterHeight = 320 - waterSurfaceY

      // Main water body with gradient effect
      ctx.fillStyle = colors.water
      ctx.fillRect(0, waterSurfaceY, 480, waterHeight)

      // Water waves (animated)
      entities.waterOffset += 0.5
      if (entities.waterOffset > 8) entities.waterOffset = 0

      ctx.fillStyle = colors.waterDark
      for (let x = -8; x < 480; x += 16) {
        drawPixelRect(x + entities.waterOffset, waterSurfaceY + 4, 8, 2, ctx.fillStyle)
        drawPixelRect(x + entities.waterOffset, waterSurfaceY + 12, 8, 2, ctx.fillStyle)
      }

      // Water highlights
      ctx.fillStyle = colors.waterHighlight
      for (let x = 0; x < 480; x += 32) {
        drawPixelRect(x - entities.waterOffset, waterSurfaceY + 2, 4, 1, ctx.fillStyle)
      }

      // Deeper water effect
      const deepWaterY = waterSurfaceY + 40
      if (deepWaterY < 320) {
        ctx.fillStyle = colors.waterDark
        ctx.fillRect(0, deepWaterY, 480, 320 - deepWaterY)
      }
    }

    const drawBoats = () => {
      entities.boats.forEach((boat) => {
        boat.y = waterSurfaceY - 8

        if (boat.y > 10 && boat.y < 300) {
          // Boat hull
          ctx.fillStyle = colors.boat
          drawPixelRect(boat.x, boat.y, 16, 6, ctx.fillStyle)

          // Boat highlight
          ctx.fillStyle = colors.boatHighlight
          drawPixelRect(boat.x + 2, boat.y + 1, 12, 2, ctx.fillStyle)

          // Wake effect
          ctx.fillStyle = colors.waterHighlight
          const wakeX = boat.direction > 0 ? boat.x - 8 : boat.x + 16
          drawPixelRect(wakeX, boat.y + 3, 4, 1, ctx.fillStyle)
          drawPixelRect(wakeX - boat.direction * 4, boat.y + 5, 3, 1, ctx.fillStyle)
        }

        // Move boat
        boat.x += boat.speed * boat.direction
        if (boat.x > 500) {
          boat.x = -20
        } else if (boat.x < -20) {
          boat.x = 500
        }
      })
    }

    const drawFish = () => {
      entities.fish.forEach((fish) => {
        fish.y = waterSurfaceY + 30 + Math.sin(fish.frame * 0.1) * 10

        if (fish.y > waterSurfaceY + 10 && fish.y < 310) {
          // Simple fish shape
          ctx.fillStyle = colors.fish
          drawPixelRect(fish.x, fish.y, 8, 4, ctx.fillStyle)
          // Tail
          const tailX = fish.direction > 0 ? fish.x - 4 : fish.x + 8
          drawPixelRect(tailX, fish.y + 1, 4, 2, ctx.fillStyle)

          // Occasional splash
          if (Math.random() > 0.998 && fish.y < waterSurfaceY + 20) {
            entities.splashTimer = 10
          }
        }

        // Move fish
        fish.x += fish.speed * fish.direction
        fish.frame++

        if (fish.x > 480) {
          fish.x = -10
          fish.direction = 1
        } else if (fish.x < -10) {
          fish.x = 480
          fish.direction = -1
        }
      })

      // Draw splash effect
      if (entities.splashTimer > 0) {
        ctx.fillStyle = colors.waterHighlight
        const splashX = entities.fish[0].x
        drawPixelRect(splashX - 2, waterSurfaceY - 4, 2, 4, ctx.fillStyle)
        drawPixelRect(splashX + 8, waterSurfaceY - 4, 2, 4, ctx.fillStyle)
        entities.splashTimer--
      }
    }

    const drawDock = () => {
      const dockX = 380
      const dockY = waterSurfaceY - 10

      if (dockY > 10) {
        // Dock platform
        ctx.fillStyle = colors.dock
        drawPixelRect(dockX, dockY, 80, 8, ctx.fillStyle)

        // Dock posts
        for (let i = 0; i < 3; i++) {
          const postX = dockX + 10 + i * 30
          ctx.fillStyle = colors.dock
          drawPixelRect(postX, dockY + 8, 4, Math.min(320 - dockY - 8, 40), ctx.fillStyle)
        }

        // Railings
        ctx.fillStyle = colors.dock
        drawPixelRect(dockX, dockY - 2, 80, 2, ctx.fillStyle)
      }
    }

    const drawFisherman = () => {
      const fishermanX = 420
      const fishermanY = waterSurfaceY - 20

      if (fishermanY > 10) {
        // Fisherman body (simple stick figure)
        ctx.fillStyle = '#000000'
        drawPixelRect(fishermanX, fishermanY, 4, 8, ctx.fillStyle) // Body
        drawPixelRect(fishermanX + 1, fishermanY - 4, 2, 4, ctx.fillStyle) // Head

        // Fishing rod
        entities.fishermanCastFrame++
        const rodAngle = Math.sin(entities.fishermanCastFrame * 0.05) * 0.3
        const rodLength = 20
        const rodEndX = fishermanX + 2 + Math.cos(rodAngle) * rodLength
        const rodEndY = fishermanY - Math.sin(rodAngle) * rodLength

        ctx.strokeStyle = colors.treeTrunk
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(fishermanX + 2, fishermanY)
        ctx.lineTo(rodEndX, rodEndY)
        ctx.stroke()

        // Fishing line and bobber
        if (rodAngle < 0.1) {
          entities.bobberY = waterSurfaceY + Math.sin(entities.fishermanCastFrame * 0.1) * 2

          ctx.strokeStyle = '#333333'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(rodEndX, rodEndY)
          ctx.lineTo(rodEndX + 10, entities.bobberY)
          ctx.stroke()

          // Bobber
          ctx.fillStyle = '#FF0000'
          drawPixelRect(rodEndX + 8, entities.bobberY - 2, 4, 4, ctx.fillStyle)
        }
      }
    }

    const drawBirds = () => {
      entities.birds.forEach((bird) => {
        // Simple bird shape (V shape)
        ctx.strokeStyle = colors.bird
        ctx.lineWidth = 2

        const wingFlap = Math.sin(bird.frame * 0.3) * 4

        ctx.beginPath()
        ctx.moveTo(bird.x, bird.y)
        ctx.lineTo(bird.x - 4, bird.y + wingFlap)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(bird.x, bird.y)
        ctx.lineTo(bird.x + 4, bird.y + wingFlap)
        ctx.stroke()

        // Move bird
        bird.x += bird.speed
        bird.frame++

        if (bird.x > 500) {
          bird.x = -20
          bird.y = 30 + Math.random() * 40
        }
      })
    }

    const drawDam = () => {
      const damX = 10
      const damY = waterSurfaceY - 30

      if (damY > 0) {
        // Dam structure
        ctx.fillStyle = colors.dam
        drawPixelRect(damX, damY, 20, 60, ctx.fillStyle)

        // Dam details
        ctx.fillStyle = '#555555'
        for (let i = 0; i < 6; i++) {
          drawPixelRect(damX + 4, damY + i * 10, 12, 4, ctx.fillStyle)
        }

        // Water release animation
        if (releaseAmount > 0) {
          ctx.fillStyle = colors.waterHighlight
          const releaseWidth = Math.min(releaseAmount / 100, 12)

          for (let i = 0; i < 5; i++) {
            const dropY = damY + 30 + i * 8 + (entities.waterOffset % 8)
            drawPixelRect(damX + 4, dropY, releaseWidth, 4, ctx.fillStyle)
          }
        }
      }
    }

    const drawWeatherEffects = () => {
      if (weather === 'rainy' || weather === 'storm') {
        // Add raindrops
        if (entities.raindrops.length < (weather === 'storm' ? 50 : 30)) {
          entities.raindrops.push({
            x: Math.random() * 480,
            y: 0,
            speed: 3 + Math.random() * 2,
          })
        }

        // Draw and update raindrops
        ctx.fillStyle = colors.rain
        entities.raindrops.forEach((drop, index) => {
          drawPixelRect(drop.x, drop.y, 1, 4, ctx.fillStyle)
          drop.y += drop.speed

          // Ripple effect when hitting water
          if (drop.y >= waterSurfaceY && drop.y < waterSurfaceY + 5) {
            ctx.fillStyle = colors.waterHighlight
            drawPixelRect(drop.x - 2, waterSurfaceY, 4, 1, ctx.fillStyle)
            ctx.fillStyle = colors.rain
          }

          if (drop.y > 320) {
            entities.raindrops.splice(index, 1)
          }
        })
      }

      // Lightning effect for storm
      if (weather === 'storm') {
        if (!entities.lightning && Math.random() > 0.98) {
          entities.lightning = {
            x: 100 + Math.random() * 280,
            alpha: 1,
            timer: 15,
          }
        }

        if (entities.lightning) {
          ctx.save()
          ctx.globalAlpha = entities.lightning.alpha
          ctx.fillStyle = '#FFFFFF'

          // Lightning bolt
          const lx = entities.lightning.x
          drawPixelRect(lx, 0, 4, 80, ctx.fillStyle)
          drawPixelRect(lx - 6, 40, 8, 4, ctx.fillStyle)
          drawPixelRect(lx + 4, 60, 6, 4, ctx.fillStyle)

          ctx.restore()

          entities.lightning.timer--
          entities.lightning.alpha -= 0.1

          if (entities.lightning.timer <= 0) {
            entities.lightning = null
          }
        }
      }
    }

    const drawWarningStripes = () => {
      // Show warning stripes if water is below baseline
      if (lakeLevel < 597) {
        ctx.fillStyle = colors.warning
        ctx.globalAlpha = 0.3

        for (let i = 0; i < 10; i++) {
          drawPixelRect(i * 60, waterSurfaceY - 10, 30, 4, ctx.fillStyle)
        }

        ctx.globalAlpha = 1
      }
    }

    const drawDayIndicator = () => {
      // Day counter
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      drawPixelRect(10, 10, 60, 20, ctx.fillStyle)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 12px monospace'
      ctx.fillText(`Day ${day}/7`, 15, 24)
    }

    const drawGameOverOverlay = () => {
      if (isGameOver) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, 480, 320)

        // Outcome message
        ctx.fillStyle = outcome === 'win' ? '#FFD700' : '#FF4444'
        ctx.font = 'bold 24px monospace'
        ctx.textAlign = 'center'

        const message =
          outcome === 'win'
            ? 'VICTORY!'
            : outcome === 'tribal-stop'
            ? 'STOPPED!'
            : outcome === 'okc-angry'
            ? 'OKC ANGRY!'
            : 'GAME OVER!'

        ctx.fillText(message, 240, 160)
        ctx.textAlign = 'left'
      }
    }

    const drawScanlines = () => {
      // CRT scanline effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      for (let y = 0; y < 320; y += 2) {
        ctx.fillRect(0, y, 480, 1)
      }
    }

    // Main animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 480, 320)

      // Draw everything in order (back to front)
      drawSky()
      drawSun()
      drawClouds()
      drawMountains()
      drawTrees()
      drawWater()
      drawDam()
      drawBoats()
      drawFish()
      drawDock()
      drawFisherman()
      drawBirds()
      drawWeatherEffects()
      drawWarningStripes()
      drawDayIndicator()
      drawGameOverOverlay()
      drawScanlines()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [lakeLevel, weather, releaseAmount, day, isGameOver, outcome])

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="w-full h-auto"
        style={{
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges',
          imageRendering: 'crisp-edges',
        }}
      />
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
        {weather.toUpperCase()}
      </div>
    </div>
  )
}
