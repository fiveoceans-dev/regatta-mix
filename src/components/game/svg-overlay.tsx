import { useRef, useEffect, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { worldToScreen } from './sailing-game-2d'
import { GameState, Boat, Mark, WindData } from '../../types/game-types'
import { BoatSvg } from './svg-components/boat-svg'
import { MarkSvg } from './svg-components/mark-svg'
import { WindSvg } from './svg-components/wind-svg'
import { RulesOverlay } from './svg-components/rules-overlay'

interface SvgOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  gameState: GameState
  onCameraUpdate: (camera: THREE.Camera, size: { width: number, height: number }) => void
}

export function SvgOverlay({ canvasRef, gameState, onCameraUpdate }: SvgOverlayProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState<THREE.Camera | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Get Three.js camera reference
  const { camera: threeCamera, size } = useThree()
  
  useEffect(() => {
    setCamera(threeCamera)
    setDimensions({ width: size.width, height: size.height })
  }, [threeCamera, size])

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef])

  const getScreenPosition = useCallback((worldX: number, worldZ: number) => {
    if (!camera) return { x: 0, y: 0 }
    
    const worldPos = new THREE.Vector3(worldX, 0, worldZ)
    return worldToScreen(worldPos, camera, dimensions)
  }, [camera, dimensions])

  // Cull off-screen objects for performance
  const isVisible = useCallback((worldX: number, worldZ: number, radius = 5) => {
    const screenPos = getScreenPosition(worldX, worldZ)
    return screenPos.x >= -radius && 
           screenPos.x <= dimensions.width + radius &&
           screenPos.y >= -radius && 
           screenPos.y <= dimensions.height + radius
  }, [getScreenPosition, dimensions])

  if (!camera) return null

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      style={{ zIndex: 10 }}
    >
      <defs>
        {/* Accessibility patterns for colorblind users */}
        <pattern id="port-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="hsl(var(--destructive))" />
          <circle cx="2" cy="2" r="1" fill="white" />
        </pattern>
        <pattern id="starboard-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="hsl(var(--sailing-success))" />
          <rect x="1" y="1" width="2" height="2" fill="white" />
        </pattern>
      </defs>

      {/* Course marks with zone rings */}
      {gameState.marks.map((mark) => {
        if (!isVisible(mark.x, mark.z, mark.radius + 10)) return null
        
        const screenPos = getScreenPosition(mark.x, mark.z)
        return (
          <MarkSvg
            key={mark.id}
            mark={mark}
            screenPosition={screenPos}
            camera={camera}
            dimensions={dimensions}
          />
        )
      })}

      {/* Wind field arrows */}
      {gameState.windField.map((wind, index) => {
        if (!isVisible(wind.x, wind.z)) return null
        
        const screenPos = getScreenPosition(wind.x, wind.z)
        return (
          <WindSvg
            key={index}
            wind={wind}
            screenPosition={screenPos}
            camera={camera}
          />
        )
      })}

      {/* Racing boats */}
      {gameState.boats.map((boat) => {
        if (!isVisible(boat.x, boat.z, 5)) return null
        
        const screenPos = getScreenPosition(boat.x, boat.z)
        return (
          <BoatSvg
            key={boat.id}
            boat={boat}
            screenPosition={screenPos}
            camera={camera}
            isPlayer={boat.id === gameState.playerId}
          />
        )
      })}

      {/* Rules overlay (zones, overlaps, penalties) */}
      <RulesOverlay
        gameState={gameState}
        getScreenPosition={getScreenPosition}
        isVisible={isVisible}
        camera={camera}
        dimensions={dimensions}
      />

      {/* Course boundary lines */}
      {gameState.courseBounds.map((line, index) => {
        const startPos = getScreenPosition(line.start.x, line.start.z)
        const endPos = getScreenPosition(line.end.x, line.end.z)
        
        return (
          <line
            key={index}
            x1={startPos.x}
            y1={startPos.y}
            x2={endPos.x}
            y2={endPos.y}
            stroke="hsl(var(--sailing-warning))"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        )
      })}
    </svg>
  )
}