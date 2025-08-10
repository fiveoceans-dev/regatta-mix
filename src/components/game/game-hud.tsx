import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { GameState, GameAction } from '../../types/game-types'
import { Wifi, WifiOff, Users, Clock, Wind, Target } from 'lucide-react'

interface GameHUDProps {
  gameState: GameState
  connectionState: 'connected' | 'connecting' | 'disconnected'
  onAction: (action: GameAction) => void
}

export function GameHUD({ gameState, connectionState, onAction }: GameHUDProps) {
  const [showDebug, setShowDebug] = useState(false)
  
  const playerBoat = gameState.boats.find(boat => boat.id === gameState.playerId)
  
  return (
    <div className="absolute inset-0 pointer-events-none" role="application" aria-label="Sailing Game HUD">
      {/* Top status bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Card className="px-3 py-2 bg-card/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm">
            {/* Connection status */}
            <div className="flex items-center gap-1">
              {connectionState === 'connected' ? (
                <Wifi className="w-4 h-4 text-sailing-success" />
              ) : (
                <WifiOff className="w-4 h-4 text-sailing-danger" />
              )}
              <span className="text-foreground font-medium">
                {connectionState.toUpperCase()}
              </span>
            </div>
            
            {/* Race info */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{gameState.boats.length}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{gameState.raceTime || '00:00'}</span>
            </div>
          </div>
        </Card>
        
        {/* Race status */}
        <Card className="px-3 py-2 bg-card/90 backdrop-blur-sm">
          <Badge 
            variant={gameState.raceStatus === 'racing' ? 'default' : 'secondary'}
            className="text-sm font-medium"
          >
            {gameState.raceStatus?.toUpperCase() || 'WAITING'}
          </Badge>
        </Card>
      </div>

      {/* Left side instruments */}
      <div className="absolute top-20 left-4 pointer-events-auto">
        <Card className="p-4 bg-card/90 backdrop-blur-sm min-w-[120px]">
          <div className="space-y-3 text-sm">
            {/* Wind info */}
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sailing-wind" />
              <div>
                <div className="text-foreground font-medium">
                  {Math.round(gameState.wind?.speed || 0)}kt
                </div>
                <div className="text-muted-foreground text-xs">
                  {Math.round((gameState.wind?.direction || 0) * (180 / Math.PI))}°
                </div>
              </div>
            </div>
            
            {/* Player boat data */}
            {playerBoat && (
              <>
                <div>
                  <div className="text-muted-foreground text-xs">SPEED</div>
                  <div className="text-foreground font-medium">
                    {playerBoat.speed.toFixed(1)}kt
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground text-xs">HDG</div>
                  <div className="text-foreground font-medium">
                    {Math.round(playerBoat.heading * (180 / Math.PI))}°
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground text-xs">VMG</div>
                  <div className="text-foreground font-medium">
                    {(playerBoat.vmg || 0).toFixed(1)}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Right side leaderboard */}
      <div className="absolute top-20 right-4 pointer-events-auto">
        <Card className="p-4 bg-card/90 backdrop-blur-sm min-w-[150px]">
          <div className="space-y-2 text-sm">
            <div className="text-muted-foreground text-xs font-medium">STANDINGS</div>
            {gameState.boats
              .sort((a, b) => (b.position || 99) - (a.position || 99))
              .slice(0, 5)
              .map((boat, index) => (
                <div key={boat.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-4">
                      {index + 1}.
                    </span>
                    <span className={`font-medium ${
                      boat.id === gameState.playerId 
                        ? 'text-secondary' 
                        : 'text-foreground'
                    }`}>
                      {boat.name || `Boat ${boat.number}`}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      boat.team === 'red' 
                        ? 'border-destructive text-destructive' 
                        : 'border-primary text-primary'
                    }`}
                  >
                    {boat.number}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction({ type: 'TACK' })}
            disabled={!playerBoat}
            className="bg-card/90 backdrop-blur-sm"
          >
            Tack
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction({ type: 'GYBE' })}
            disabled={!playerBoat}
            className="bg-card/90 backdrop-blur-sm"
          >
            Gybe
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="bg-card/90 backdrop-blur-sm"
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Debug panel */}
      {showDebug && (
        <div className="absolute bottom-20 right-4 pointer-events-auto">
          <Card className="p-4 bg-card/90 backdrop-blur-sm max-w-xs">
            <div className="space-y-2 text-xs">
              <div className="text-muted-foreground font-medium">DEBUG INFO</div>
              <div>FPS: {Math.round(1000 / (gameState.deltaTime || 16))}</div>
              <div>Tick: {gameState.tick || 0}</div>
              <div>Ping: {gameState.ping || 0}ms</div>
              {playerBoat && (
                <>
                  <div>Pos: ({playerBoat.x.toFixed(1)}, {playerBoat.z.toFixed(1)})</div>
                  <div>Penalties: {playerBoat.penalties?.length || 0}</div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Accessibility live region for screen readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
      >
        {gameState.lastUpdate && `Game updated: ${gameState.lastUpdate}`}
      </div>
    </div>
  )
}