import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SvgOverlay } from './svg-overlay'
import { GameState } from '../../types/game-types'

// Game world to screen coordinates
export function worldToScreen(worldPos: THREE.Vector3, camera: THREE.Camera, size: { width: number, height: number }) {
  const vector = worldPos.clone()
  vector.project(camera)
  
  return {
    x: (vector.x * 0.5 + 0.5) * size.width,
    y: (vector.y * -0.5 + 0.5) * size.height
  }
}

function GameCamera({ zoom, cameraX, cameraZ, onCameraUpdate }: { zoom: number; cameraX: number; cameraZ: number; onCameraUpdate: (camera: THREE.Camera, size: { width: number, height: number }) => void }) {
  const { camera, size } = useThree()

  useEffect(() => {
    if (camera) {
      // Set up orthographic camera for top-down view
      const orthoCamera = camera as THREE.OrthographicCamera
      orthoCamera.position.set(cameraX, 50, cameraZ)
      orthoCamera.lookAt(cameraX, 0, cameraZ)
      orthoCamera.zoom = zoom
      orthoCamera.updateProjectionMatrix()

      // Pass camera data to parent
      onCameraUpdate(camera, size)
    }
  }, [camera, size, onCameraUpdate, zoom, cameraX, cameraZ])

  return null
}

function GameWorld({ gameState }: { gameState: GameState }) {
  // Wind field visualization (invisible in Three.js, rendered in SVG)
  const windFieldRef = useRef<THREE.Group>(null)

  useFrame(() => {
    // Update wind field data for SVG rendering
    // This runs at 60fps but SVG updates are throttled
  })

  return (
    <group>
      {/* Invisible markers for SVG synchronization */}
      <group ref={windFieldRef}>
        {gameState.marks.map((mark, index) => (
          <mesh key={index} position={[mark.x, 0, mark.z]} visible={false}>
            <sphereGeometry args={[mark.radius]} />
          </mesh>
        ))}
      </group>

      {/* Boats (invisible, positions tracked for SVG) */}
      {gameState.boats.map((boat) => (
        <mesh key={boat.id} position={[boat.x, 0, boat.z]} rotation={[0, boat.heading, 0]} visible={false}>
          <boxGeometry args={[1, 0.1, 3]} />
        </mesh>
      ))}
    </group>
  )
}

export function SailingGame2D({ gameState, zoom }: { gameState: GameState; zoom: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraData, setCameraData] = useState<{ camera: THREE.Camera, size: { width: number, height: number } } | null>(null)
  const [cameraX, setCameraX] = useState(0)
  const [cameraZ, setCameraZ] = useState(0)
  const isDragging = useRef(false)
  const lastX = useRef<number | null>(null)
  const lastY = useRef<number | null>(null)

  const handleCameraUpdate = useCallback((camera: THREE.Camera, size: { width: number, height: number }) => {
    setCameraData({ camera, size })
  }, [])

  const playerBoat = gameState.boats.find(b => b.id === gameState.playerId)

  useEffect(() => {
    if (!isDragging.current && playerBoat) {
      setCameraX(playerBoat.x)
      setCameraZ(playerBoat.z)
    }
  }, [playerBoat])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastX.current = e.clientX
    lastY.current = e.clientY
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && lastX.current !== null && lastY.current !== null) {
      const deltaX = (e.clientX - lastX.current) / zoom
      const deltaY = (e.clientY - lastY.current) / zoom
      setCameraX((x) => x - deltaX)
      setCameraZ((z) => z + deltaY)
      lastX.current = e.clientX
      lastY.current = e.clientY
    }
  }

  const stopDragging = () => {
    isDragging.current = false
    lastX.current = null
    lastY.current = null
  }

  return (
    <div
      className="relative w-full h-full"
      style={{ background: 'linear-gradient(hsl(var(--water-mid)), hsl(var(--water-deep)))' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      {/* Three.js Canvas - invisible but handles camera/world transforms */}
      <Canvas
        ref={canvasRef}
        camera={{
          position: [cameraX, 50, cameraZ],
          zoom,
          near: 0.1,
          far: 1000
        }}
        orthographic
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        <GameCamera zoom={zoom} cameraX={cameraX} cameraZ={cameraZ} onCameraUpdate={handleCameraUpdate} />
        <GameWorld gameState={gameState} />
      </Canvas>

      {/* SVG Overlay - all visible game objects */}
      {cameraData && (
        <SvgOverlay
          canvasRef={canvasRef}
          gameState={gameState}
          camera={cameraData.camera}
          size={cameraData.size}
        />
      )}
    </div>
  )
}