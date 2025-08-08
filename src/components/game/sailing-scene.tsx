import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

// Boat component
function Boat({ position, rotation, isPlayer = false }: { 
  position: [number, number, number], 
  rotation: number,
  isPlayer?: boolean 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && isPlayer) {
      // Subtle bobbing animation for player boat
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]}>
      {/* Hull */}
      <coneGeometry args={[0.3, 1.5, 3]} />
      <meshStandardMaterial color={isPlayer ? "#FFD700" : "#1E40AF"} />
      
      {/* Mast */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Sail */}
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial color="#F8F8FF" side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  )
}

// Buoy/Mark component
function Buoy({ position, label }: { position: [number, number, number], label: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

// Wind indicators
function WindArrows() {
  const arrows = useMemo(() => {
    const arrowPositions = []
    for (let i = 0; i < 20; i++) {
      arrowPositions.push([
        (Math.random() - 0.5) * 50,
        2,
        (Math.random() - 0.5) * 50
      ])
    }
    return arrowPositions
  }, [])

  return (
    <>
      {arrows.map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          <mesh rotation={[0, Math.PI * 0.25, 0]}>
            <coneGeometry args={[0.1, 0.5, 3]} />
            <meshStandardMaterial color="#00BFFF" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </>
  )
}

export function SailingScene() {
  // Boat positions based on the sailing rules reference image
  const boats = useMemo(() => [
    { position: [0, 0, 0] as [number, number, number], rotation: Math.PI * 0.25, isPlayer: true },
    { position: [-2, 0, 1] as [number, number, number], rotation: Math.PI * 0.3, isPlayer: false },
    { position: [1.5, 0, -1] as [number, number, number], rotation: Math.PI * 0.15, isPlayer: false },
    { position: [-1, 0, -2] as [number, number, number], rotation: Math.PI * 0.4, isPlayer: false },
    { position: [3, 0, 0.5] as [number, number, number], rotation: Math.PI * 0.2, isPlayer: false },
    { position: [-3, 0, -1] as [number, number, number], rotation: Math.PI * 0.35, isPlayer: false },
  ], [])

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Ocean */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1E40AF" transparent opacity={0.8} />
        </mesh>
        
        {/* Course markers */}
        <Buoy position={[0, 0, -10]} label="Start" />
        <Buoy position={[8, 0, -5]} label="1" />
        <Buoy position={[0, 0, 10]} label="2" />
        <Buoy position={[-8, 0, -5]} label="3" />
        
        {/* Start/Finish line */}
        <mesh position={[0, 0.1, -10]}>
          <boxGeometry args={[20, 0.1, 0.2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Wind indicators */}
        <WindArrows />
        
        {/* Racing boats */}
        {boats.map((boat, index) => (
          <Boat
            key={index}
            position={boat.position}
            rotation={boat.rotation}
            isPlayer={boat.isPlayer}
          />
        ))}
        
        {/* Course boundaries */}
        <mesh position={[15, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.1, 30]} />
          <meshStandardMaterial color="#FF4500" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-15, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.1, 30]} />
          <meshStandardMaterial color="#FF4500" transparent opacity={0.5} />
        </mesh>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}