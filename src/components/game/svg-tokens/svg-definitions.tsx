// SVG Definitions with CSS Variables and Accessibility Patterns

export function SvgDefinitions() {
  return (
    <defs>
      {/* CSS Variables for dynamic theming */}
      <style>
        {`
          .token-red { --token-color: hsl(var(--boat-red)); }
          .token-blue { --token-color: hsl(var(--boat-blue)); }
          .token-yellow { --token-color: hsl(var(--sailing-warning)); }
          .token-green { --token-color: hsl(var(--sailing-success)); }
          .token-player { --token-color: hsl(var(--secondary)); }
          
          .boat-hull { fill: var(--token-color); stroke: white; stroke-width: 1; }
          .boat-sail { fill: white; stroke: var(--token-color); stroke-width: 1; opacity: 0.9; }
          .boat-number { fill: white; font-family: Arial, sans-serif; font-weight: bold; text-anchor: middle; }
          
          .mark-buoy { fill: var(--token-color); stroke: white; stroke-width: 2; }
          .mark-label { fill: hsl(var(--foreground)); font-family: Arial, sans-serif; font-weight: bold; text-anchor: middle; }
          
          .vector-line { stroke: var(--token-color); fill: none; }
          .zone-ring { fill: none; stroke: var(--token-color); }
          .selection-ring { stroke: hsl(var(--neon-aqua)/var(--neon-alpha)); }
        `}
      </style>

      {/* Colorblind-safe accessibility patterns */}
      <pattern id="pattern-red-hash" patternUnits="userSpaceOnUse" width="8" height="8">
        <rect width="8" height="8" fill="hsl(var(--boat-red))" />
        <path d="M0,4 L8,4 M4,0 L4,8" stroke="white" strokeWidth="1" />
      </pattern>

      <pattern id="pattern-blue-diagonal" patternUnits="userSpaceOnUse" width="8" height="8">
        <rect width="8" height="8" fill="hsl(var(--boat-blue))" />
        <path d="M0,0 L8,8 M0,8 L8,0" stroke="white" strokeWidth="1" />
      </pattern>

      <pattern id="pattern-green-dots" patternUnits="userSpaceOnUse" width="8" height="8">
        <rect width="8" height="8" fill="hsl(var(--sailing-success))" />
        <circle cx="4" cy="4" r="2" fill="white" />
      </pattern>

      <pattern id="pattern-yellow-checkers" patternUnits="userSpaceOnUse" width="8" height="8">
        <rect width="8" height="8" fill="hsl(var(--sailing-warning))" />
        <rect x="0" y="0" width="4" height="4" fill="white" />
        <rect x="4" y="4" width="4" height="4" fill="white" />
      </pattern>

      <pattern id="pattern-striped" patternUnits="userSpaceOnUse" width="6" height="6">
        <rect width="6" height="6" fill="var(--token-color)" />
        <rect x="0" y="0" width="6" height="2" fill="white" />
        <rect x="0" y="4" width="6" height="2" fill="white" />
      </pattern>

      {/* Arrow markers for vectors */}
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--token-color)" />
      </marker>

      <marker id="arrowhead-small" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0, 6 2, 0 4" fill="var(--token-color)" />
      </marker>

      {/* Boat hull shapes */}
      <g id="dinghy-hull">
        <ellipse cx="0" cy="0" rx="2" ry="8" className="boat-hull" />
      </g>

      <g id="keel-hull">
        <ellipse cx="0" cy="0" rx="3" ry="10" className="boat-hull" />
        <rect x="-0.5" y="8" width="1" height="3" className="boat-hull" /> {/* keel */}
      </g>

      <g id="catamaran-hull">
        <ellipse cx="-1.5" cy="0" rx="1" ry="8" className="boat-hull" />
        <ellipse cx="1.5" cy="0" rx="1" ry="8" className="boat-hull" />
        <rect x="-2" y="-2" width="4" height="1" className="boat-hull" /> {/* bridge */}
      </g>

      {/* Sail shapes */}
      <g id="mainsail">
        <polygon points="0,-8 6,-6 6,6 0,8" className="boat-sail" />
      </g>

      <g id="jib">
        <polygon points="0,-6 -4,-4 -4,4 0,6" className="boat-sail" />
      </g>

      {/* Mark shapes */}
      <g id="mark-standard">
        <circle cx="0" cy="0" r="3" className="mark-buoy" />
      </g>

      <g id="mark-rc-boat">
        <rect x="-4" y="-2" width="8" height="4" rx="1" className="mark-buoy" />
        <circle cx="0" cy="0" r="1" fill="white" />
      </g>

      <g id="mark-pin">
        <rect x="-1" y="-6" width="2" height="12" className="mark-buoy" />
        <polygon points="-1,-6 -1,-10 3,-8" fill="var(--token-color)" />
      </g>
    </defs>
  )
}