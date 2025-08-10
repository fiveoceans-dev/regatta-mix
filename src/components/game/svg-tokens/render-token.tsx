import React from 'react'
import { BoatToken, MarkToken, VectorToken, ZoneRing, WorldToScreen } from './token-types'

export type AnyToken = BoatToken | MarkToken | VectorToken | ZoneRing

/**
 * renderToken converts a parametric token to an SVG group using world coordinates.
 * All tokens rely on SvgDefinitions for shape/pattern declarations.
 */
export function renderToken(token: AnyToken, worldToScreen: WorldToScreen): JSX.Element {
  if ((token as BoatToken).hullLength !== undefined) {
    const boat = token as BoatToken
    const screen = worldToScreen(boat.position.x, boat.position.y)
    const rotation = -boat.headingDeg
    const patternMap: Record<string, string> = {
      striped: 'pattern-striped',
      checkers: 'pattern-yellow-checkers',
      dots: 'pattern-green-dots',
    }
    const patternFill = boat.pattern === 'solid' ? boat.color : `url(#${patternMap[boat.pattern]})`
    return (
      <g transform={`translate(${screen.x}, ${screen.y}) rotate(${rotation})`} style={{ '--token-color': boat.color } as React.CSSProperties}>
        <use href={`#${boat.type}-hull`} fill={patternFill} />
        <use href="#mainsail" transform={`rotate(${boat.sailAngleDeg})`} />
        {boat.centerline && (
          <line x1="0" y1={-boat.hullLength * 1.2} x2="0" y2={boat.hullLength * 1.2} stroke="white" strokeDasharray="2,2" />
        )}
      </g>
    )
  }

  if ((token as MarkToken).radius !== undefined && (token as any).from === undefined) {
    const mark = token as MarkToken
    const screen = worldToScreen(mark.position.x, mark.position.y)
    const patternFill = mark.pattern ? `url(#${mark.pattern})` : mark.color
    const useId = mark.type === 'mark' ? 'mark-standard' : mark.type === 'rcBoat' ? 'mark-rc-boat' : mark.type === 'pin' ? 'mark-pin' : 'mark-standard'
    return (
      <g transform={`translate(${screen.x}, ${screen.y})`} style={{ '--token-color': mark.color } as React.CSSProperties}>
        <use href={`#${useId}`} fill={patternFill} />
        {mark.label && (
          <text className="mark-label" y={mark.radius * 4}>{mark.label}</text>
        )}
      </g>
    )
  }

  if ((token as VectorToken).from !== undefined && (token as VectorToken).to !== undefined) {
    const vec = token as VectorToken
    const start = worldToScreen(vec.from.x, vec.from.y)
    const end = worldToScreen(vec.to.x, vec.to.y)
    return (
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={vec.color}
        strokeWidth={vec.strokeWidth ?? 1}
        strokeDasharray={vec.dash ? '4 4' : undefined}
        markerEnd={vec.arrowHead ? 'url(#arrowhead-small)' : undefined}
      />
    )
  }

  const zone = token as ZoneRing
  const center = worldToScreen(zone.center.x, zone.center.y)
  const edge = worldToScreen(zone.center.x + zone.radius, zone.center.y)
  const radius = Math.hypot(edge.x - center.x, edge.y - center.y)
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={radius}
      stroke={zone.color}
      strokeWidth={zone.strokeWidth ?? 1}
      strokeDasharray={zone.dash ? '4 4' : undefined}
      fill={zone.fill ? zone.color : 'none'}
      opacity={zone.alpha}
    />
  )
}
