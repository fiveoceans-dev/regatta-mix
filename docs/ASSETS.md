# SVG Asset Schema and Theme Tokens

## Overview

This document defines the SVG asset schema and theme token system for the 2D multiplayer sailing game. All visual elements are rendered as SVG components synchronized to the Three.js camera system.

## SVG Component Architecture

### Boat SVG (`boat-svg.tsx`)

**Parameters:**
- `boat: Boat` - Boat state object
- `screenPosition: {x, y}` - Screen coordinates from world-to-screen transform
- `camera: THREE.Camera` - Three.js camera for scale calculations
- `isPlayer: boolean` - Whether this is the current player's boat

**Visual Elements:**
- Hull: Ellipse with team colors (red/blue)
- Sail: Triangle with accessibility patterns
- Number: Text overlay
- Player indicator: Dashed circle for current player
- Speed vector: Line showing velocity direction

**Accessibility:**
- Colorblind-safe patterns on sails (`port-pattern`, `starboard-pattern`)
- High contrast text with white background
- ARIA labels for screen readers

### Mark SVG (`mark-svg.tsx`)

**Parameters:**
- `mark: Mark` - Mark configuration object
- `screenPosition: {x, y}` - Screen coordinates
- `camera: THREE.Camera` - For radius scaling
- `dimensions: {width, height}` - Viewport size

**Visual Elements:**
- Zone ring: Dashed circle at 3 hull lengths (mark room)
- Buoy: Filled circle with type-specific colors
- Label: Text with mark name/number
- Rounding arrow: Tactical direction indicator

### Wind SVG (`wind-svg.tsx`)

**Parameters:**
- `wind: WindData` - Wind vector data
- `screenPosition: {x, y}` - Screen coordinates
- `camera: THREE.Camera` - For scaling

**Visual Elements:**
- Arrow shaft: Line scaled by wind speed
- Arrow head: Triangle pointing in wind direction
- Speed text: Numeric display for strong winds
- Shift indicator: Dashed circle for wind changes

### Rules Overlay (`rules-overlay.tsx`)

**Parameters:**
- `gameState: GameState` - Complete game state
- `getScreenPosition: Function` - World-to-screen converter
- `isVisible: Function` - Culling function
- `camera: THREE.Camera` - Camera reference
- `dimensions: {width, height}` - Viewport size

**Visual Elements:**
- Overlap zones: Red circles for boat conflicts
- Mark zones: Yellow highlight when multiple boats present
- Penalty flags: Red flag icons with penalty count
- Right-of-way text: Rule descriptions for tactical situations

## Theme Token System

### Core Color Tokens (from `index.css`)

```css
/* Sailing-specific colors */
--sailing-wind: 210 80% 90%;      /* Light blue for wind indicators */
--sailing-water: 220 70% 35%;     /* Dark blue for water/course */
--sailing-warning: 42 65% 50%;    /* Yellow for warnings/marks */
--sailing-danger: 0 65% 55%;      /* Red for penalties/conflicts */
--sailing-success: 142 50% 40%;   /* Green for success/starboard */

/* Team colors */
--destructive: 0 75% 50%;         /* Red team color */
--primary: 220 60% 25%;           /* Blue team color */
--secondary: 42 65% 50%;          /* Gold for player highlight */
```

### SVG-Specific Usage

**Team Identification:**
- Red team: `hsl(var(--destructive))`
- Blue team: `hsl(var(--primary))`
- Player highlight: `hsl(var(--secondary))`

**Race Elements:**
- Start marks: `hsl(var(--secondary))`
- Finish marks: `hsl(var(--sailing-success))`
- Course marks: `hsl(var(--sailing-warning))`
- Zone rings: Semi-transparent versions of mark colors

**Wind and Weather:**
- Light wind: `hsl(var(--muted-foreground))`
- Moderate wind: `hsl(var(--sailing-wind))`
- Strong wind: `hsl(var(--sailing-warning))`
- Dangerous wind: `hsl(var(--sailing-danger))`

## Accessibility Patterns

### Colorblind Support

```svg
<!-- Port (red) pattern -->
<pattern id="port-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
  <rect width="4" height="4" fill="hsl(var(--destructive))" />
  <circle cx="2" cy="2" r="1" fill="white" />
</pattern>

<!-- Starboard (green) pattern -->
<pattern id="starboard-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
  <rect width="4" height="4" fill="hsl(var(--sailing-success))" />
  <rect x="1" y="1" width="2" height="2" fill="white" />
</pattern>
```

### Text Accessibility

- All text elements use high contrast colors
- Font sizes minimum 8px for readability
- Bold weight for important information (boat numbers, penalties)
- White text backgrounds where needed for contrast

## Performance Considerations

### Culling System

The `isVisible` function performs viewport culling:
```typescript
const isVisible = (worldX: number, worldZ: number, radius = 5) => {
  const screenPos = getScreenPosition(worldX, worldZ)
  return screenPos.x >= -radius && 
         screenPos.x <= dimensions.width + radius &&
         screenPos.y >= -radius && 
         screenPos.y <= dimensions.height + radius
}
```

### DOM Optimization

- Use `requestIdleCallback` for non-critical updates
- Throttle DOM writes to match snapshot rate (10 Hz)
- Batch SVG element updates
- Remove off-screen elements from DOM

### Animation Considerations

- Avoid CSS transitions on frequently updated elements
- Use `transform` properties for smooth animations
- Limit simultaneous animations to prevent jank
- Prefer opacity changes over style recalculations

## Asset Scaling

### World-to-Screen Conversion

```typescript
function worldToScreen(worldPos: THREE.Vector3, camera: THREE.Camera, size: {width: number, height: number}) {
  const vector = worldPos.clone()
  vector.project(camera)
  
  return {
    x: (vector.x * 0.5 + 0.5) * size.width,
    y: (vector.y * -0.5 + 0.5) * size.height
  }
}
```

### Responsive Scaling

- Boat length: 12px at standard zoom
- Mark radius: Scaled by `(worldRadius * cameraZoom * viewportHeight) / 100`
- Zone rings: 2.5x mark radius (representing 3 hull lengths)
- Wind arrows: 3px per knot of wind speed, capped at 30px

## Testing Requirements

### Visual Testing
- [ ] All boat orientations render correctly
- [ ] Mark zones scale properly with zoom
- [ ] Wind arrows point in correct directions
- [ ] Accessibility patterns are visible
- [ ] Text remains readable at all zoom levels

### Performance Testing
- [ ] 60 FPS with 20+ boats visible
- [ ] Smooth camera pan/zoom operations
- [ ] Efficient culling of off-screen objects
- [ ] Memory usage remains stable over time

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Colorblind pattern differentiation
- [ ] Keyboard navigation support
- [ ] High contrast mode compatibility