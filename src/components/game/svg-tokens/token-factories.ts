import { BoatToken, MarkToken, VectorToken, ZoneRing } from './token-types'

// Factory functions to create parametric SVG tokens

export function createBoatToken(partial: Partial<BoatToken> & { id: string, position: { x: number, y: number } }): BoatToken {
  const defaultColor =
    partial.team === 'red'
      ? 'hsl(var(--boat-red))'
      : partial.team === 'blue'
        ? 'hsl(var(--boat-blue))'
        : 'hsl(var(--primary))'

  return {
    id: partial.id,
    type: partial.type ?? 'dinghy',
    hullLength: partial.hullLength ?? 4,
    beam: partial.beam ?? 2,
    color: partial.color ?? defaultColor,
    pattern: partial.pattern ?? 'solid',
    headingDeg: partial.headingDeg ?? 0,
    sailAngleDeg: partial.sailAngleDeg ?? 0,
    centerline: partial.centerline ?? false,
    position: partial.position,
    number: partial.number,
    team: partial.team,
  }
}

export function createMarkToken(partial: Partial<MarkToken> & { id: string, position: { x: number, y: number } }): MarkToken {
  return {
    id: partial.id,
    type: partial.type ?? 'mark',
    radius: partial.radius ?? 3,
    color: partial.color ?? 'hsl(var(--sailing-warning))',
    label: partial.label,
    position: partial.position,
    strokeWidth: partial.strokeWidth,
    pattern: partial.pattern,
  }
}

export function createVectorToken(partial: Partial<VectorToken> & { id: string, from: { x: number, y: number }, to: { x: number, y: number } }): VectorToken {
  return {
    id: partial.id,
    kind: partial.kind ?? 'wind',
    from: partial.from,
    to: partial.to,
    dash: partial.dash ?? false,
    color: partial.color ?? 'hsl(var(--foreground))',
    strokeWidth: partial.strokeWidth,
    arrowHead: partial.arrowHead ?? true,
  }
}

export function createZoneRing(partial: Partial<ZoneRing> & { id: string, center: { x: number, y: number } }): ZoneRing {
  return {
    id: partial.id,
    center: partial.center,
    radius: partial.radius ?? 10,
    color: partial.color ?? 'hsl(var(--sailing-warning))',
    alpha: partial.alpha ?? 0.3,
    dash: partial.dash,
    strokeWidth: partial.strokeWidth,
    fill: partial.fill,
  }
}
