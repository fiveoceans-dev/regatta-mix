import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SvgOverlay } from './svg-overlay'
import { GameHUD } from './game-hud'
import { useGameState } from '../../hooks/use-game-state'
import { useWebSocket } from '../../hooks/use-websocket'

// Game world to screen coordinates
export function worldToScreen(worldPos: THREE.Vector3, camera: THREE.Camera, size: { width: number, height: number }) {
  const vector = worldPos.clone()
  vector.project(camera)
  
  return {
    x: (vector.x * 0.5 + 0.5) * size.width,
    y: (vector.y * -0.5 + 0.5) * size.height
  }
}

function GameCamera({ onCameraUpdate }: { onCameraUpdate: (camera: THREE.Camera, size: { width: number, height: number }) => void }) {
  const { camera, size } = useThree()
  
  useEffect(() => {
    if (camera) {
      // Set up orthographic camera for top-down view
      const orthoCamera = camera as THREE.OrthographicCamera
      orthoCamera.position.set(0, 50, 0)
      orthoCamera.lookAt(0, 0, 0)
      orthoCamera.zoom = 1
      orthoCamera.updateProjectionMatrix()
      
      // Pass camera data to parent
      onCameraUpdate(camera, size)
    }
  }, [camera, size, onCameraUpdate])

  return null
}

function GameWorld() {
  const { gameState } = useGameState()
  
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
      {gameState.boats.map((boat, index) => (
        <mesh key={boat.id} position={[boat.x, 0, boat.z]} rotation={[0, boat.heading, 0]} visible={false}>
          <boxGeometry args={[1, 0.1, 3]} />
        </mesh>
      ))}
    </group>
  )
}

export function SailingGame2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraProps, setCameraProps] = useState({
    position: [0, 50, 0] as [number, number, number],
    zoom: 1
  })
  const [cameraData, setCameraData] = useState<{ camera: THREE.Camera, size: { width: number, height: number } } | null>(null)
  
  const { gameState, dispatch } = useGameState()
  const { sendMessage, connectionState } = useWebSocket('ws://localhost:8080')

  const handleCameraUpdate = useCallback((camera: THREE.Camera, size: { width: number, height: number }) => {
    setCameraData({ camera, size })
  }, [])

  return (
    <div className="relative w-full h-full bg-background">
      {/* Three.js Canvas - invisible but handles camera/world transforms */}
      <Canvas
        ref={canvasRef}
        camera={{
          position: cameraProps.position,
          zoom: cameraProps.zoom,
          near: 0.1,
          far: 1000
        }}
        orthographic
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        <GameCamera onCameraUpdate={handleCameraUpdate} />
        <GameWorld />
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
      
      {/* Game HUD */}
      <GameHUD 
        gameState={gameState}
        connectionState={connectionState}
        onAction={(action) => dispatch(action)}
      />
    </div>
  )
}