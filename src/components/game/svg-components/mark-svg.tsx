import * as THREE from 'three'
import { Mark } from '../../../types/game-types'

interface MarkSvgProps {
  mark: Mark
  screenPosition: { x: number, y: number }
  camera: THREE.Camera
  dimensions: { width: number, height: number }
}

export function MarkSvg({ mark, screenPosition, camera, dimensions }: MarkSvgProps) {
  // Calculate screen radius based on world radius and camera zoom
  const worldRadius = mark.radius
  const cameraZoom = (camera as THREE.OrthographicCamera).zoom || 1
  const screenRadius = (worldRadius * cameraZoom * dimensions.height) / 100 // Adjust scale factor as needed
  
  // Zone ring radius (3 hull lengths ≈ 15 meters)
  const zoneRadius = screenRadius * 2.5
  
  const markColor = mark.type === 'start' 
    ? 'hsl(var(--secondary))' 
    : mark.type === 'finish'
    ? 'hsl(var(--sailing-success))'
    : 'hsl(var(--sailing-warning))'

  return (
    <g>
      {/* Zone ring (mark room) */}
      <circle
        cx={screenPosition.x}
        cy={screenPosition.y}
        r={zoneRadius}
        fill="none"
        stroke={markColor}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.3"
        className="zone-ring"
      />
      
      {/* Mark buoy */}
      <circle
        cx={screenPosition.x}
        cy={screenPosition.y}
        r={screenRadius}
        fill={markColor}
        stroke="white"
        strokeWidth="2"
        opacity="0.9"
      />
      
      {/* Mark label */}
      <text
        x={screenPosition.x}
        y={screenPosition.y + screenRadius + 12}
        textAnchor="middle"
        fontSize="10"
        fill="hsl(var(--foreground))"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {mark.name}
      </text>
      
      {/* Tactical arrow for rounding direction */}
      {mark.roundingDirection && (
        <path
          d={`M ${screenPosition.x - 8} ${screenPosition.y - 8} 
              L ${screenPosition.x + 8} ${screenPosition.y} 
              L ${screenPosition.x - 8} ${screenPosition.y + 8}`}
          fill="none"
          stroke={markColor}
          strokeWidth="2"
          markerEnd="url(#arrow)"
          opacity="0.7"
          transform={`rotate(${mark.roundingDirection === 'port' ? 90 : -90}, ${screenPosition.x}, ${screenPosition.y})`}
        />
      )}
    </g>
  )
}