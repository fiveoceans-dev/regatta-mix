import * as THREE from 'three'
import { WindData } from '../../../types/game-types'

interface WindSvgProps {
  wind: WindData
  screenPosition: { x: number, y: number }
  camera: THREE.Camera
}

export function WindSvg({ wind, screenPosition, camera }: WindSvgProps) {
  const arrowLength = Math.min(wind.speed * 3, 30) // Scale arrow length with wind speed
  const rotation = -wind.direction * (180 / Math.PI) // Convert to screen rotation
  
  // Wind strength color coding
  const getWindColor = (speed: number) => {
    if (speed < 5) return 'hsl(var(--muted-foreground))'
    if (speed < 15) return 'hsl(var(--sailing-wind))'
    if (speed < 25) return 'hsl(var(--sailing-warning))'
    return 'hsl(var(--sailing-danger))'
  }
  
  const windColor = getWindColor(wind.speed)

  return (
    <g transform={`translate(${screenPosition.x}, ${screenPosition.y})`}>
      {/* Wind arrow shaft */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-arrowLength}
        stroke={windColor}
        strokeWidth="1.5"
        opacity="0.7"
        transform={`rotate(${rotation})`}
      />
      
      {/* Wind arrow head */}
      <polygon
        points={`0,-${arrowLength} -3,-${arrowLength - 6} 3,-${arrowLength - 6}`}
        fill={windColor}
        opacity="0.7"
        transform={`rotate(${rotation})`}
      />
      
      {/* Wind speed text (only for significant wind changes) */}
      {wind.speed > 10 && (
        <text
          x="8"
          y="3"
          fontSize="8"
          fill={windColor}
          className="pointer-events-none select-none"
          opacity="0.6"
        >
          {Math.round(wind.speed)}kt
        </text>
      )}
      
      {/* Wind shift indicator */}
      {wind.isShift && (
        <circle
          cx="0"
          cy="0"
          r="4"
          fill="none"
          stroke={windColor}
          strokeWidth="1"
          strokeDasharray="1,1"
          opacity="0.5"
        />
      )}
    </g>
  )
}