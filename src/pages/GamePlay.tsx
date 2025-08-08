export default function GamePlay() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Game Container */}
      <div className="grid grid-cols-[280px_1fr_320px] grid-rows-[60px_1fr_200px] h-screen gap-px bg-muted">
        
        {/* Top Navigation Bar */}
        <div className="col-span-3 bg-card/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-5">
          <div className="flex items-center gap-5">
            <div className="text-lg font-semibold text-primary">Mediterranean Sprint Championship</div>
            <div className="bg-sailing-success/20 text-sailing-success px-4 py-2 rounded-md font-semibold">
              5:42 to Start
            </div>
            <div className="text-muted-foreground">156/200 sailors</div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md">Menu</button>
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md">Settings</button>
          </div>
        </div>

        {/* Left Sidebar - Game Controls */}
        <div className="bg-card/90 backdrop-blur-sm border-r border-border p-5 overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                Sailing Controls
              </h3>
              <div className="space-y-2">
                {['Tack to Port', 'Tack to Starboard', 'Bear Away', 'Head Up'].map((action) => (
                  <button 
                    key={action}
                    className="w-full p-3 bg-secondary border border-border hover:border-primary hover:bg-secondary/80 rounded-md text-left transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                Race Actions
              </h3>
              <div className="space-y-2">
                {['Protest', 'Request Redress', 'Retire'].map((action) => (
                  <button 
                    key={action}
                    className="w-full p-3 bg-secondary border border-border hover:border-primary hover:bg-secondary/80 rounded-md text-left transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                View Options
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Course View', active: true },
                  { name: 'Tactical View', active: false },
                  { name: 'Wind Map', active: false },
                  { name: 'Current Map', active: false }
                ].map((option) => (
                  <button 
                    key={option.name}
                    className={`w-full p-3 border rounded-md text-left transition-all ${
                      option.active 
                        ? 'bg-sailing-success/20 border-sailing-success text-sailing-success font-medium'
                        : 'bg-secondary border-border hover:border-primary hover:bg-secondary/80'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-gradient-water relative overflow-hidden">
          {/* Ocean Canvas */}
          <div className="absolute inset-0 bg-gradient-to-br from-sailing-water/80 to-background">
            
            {/* Wind Overlay */}
            <div className="absolute top-5 left-5 bg-black/70 p-4 rounded-lg border border-border">
              <div className="w-15 h-15 bg-secondary rounded-full relative mx-auto mb-3">
                <div 
                  className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-l-transparent border-r-transparent border-b-6 border-b-primary"
                  style={{ transform: 'translateX(-50%) rotate(45deg)' }}
                />
              </div>
              <div className="text-center text-primary">
                <div className="font-bold">12.5 kts</div>
                <div className="text-xs">045° True</div>
              </div>
            </div>

            {/* Signal Flag Panel */}
            <div className="absolute top-5 right-5 w-30 h-30 bg-black/80 border-2 border-border rounded-lg flex items-center justify-center">
              <span className="text-5xl text-sailing-warning">⚡</span>
            </div>

            {/* HUD Information */}
            <div className="absolute top-25 left-5 bg-black/70 p-3 rounded-md border border-sailing-success text-sailing-success font-mono text-xs">
              <div>HEADING: 045°</div>
              <div>COURSE: 030°</div>
              <div>VMG: 8.2 kts</div>
              <div>DIST TO MARK: 2.1 nm</div>
            </div>

            {/* Course Information */}
            <div className="absolute bottom-5 left-5 bg-black/80 p-4 rounded-lg border border-border text-xs">
              <div className="font-bold mb-1">Next Mark: Windward Mark</div>
              <div>Distance: 2.1 nautical miles</div>
              <div>Bearing: 030° True</div>
              <div>ETA: 15:42</div>
            </div>

            {/* Sample Boats */}
            <div className="absolute inset-0">
              {[
                { top: '60%', left: '45%', rotation: '45deg', isPlayer: true },
                { top: '55%', left: '40%', rotation: '30deg', isPlayer: false },
                { top: '65%', left: '50%', rotation: '60deg', isPlayer: false },
                { top: '58%', left: '48%', rotation: '40deg', isPlayer: false },
                { top: '62%', left: '42%', rotation: '50deg', isPlayer: false }
              ].map((boat, index) => (
                <div
                  key={index}
                  className={`absolute w-5 h-7 transition-all duration-100 ${
                    boat.isPlayer 
                      ? 'bg-sailing-success shadow-glow' 
                      : 'bg-primary'
                  }`}
                  style={{
                    top: boat.top,
                    left: boat.left,
                    transform: `rotate(${boat.rotation})`,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Instruments Panel */}
        <div className="bg-card/90 backdrop-blur-sm border-l border-border p-5 flex flex-col gap-5">
          {/* B&G Style Speed Display */}
          <div className="bg-black border-2 border-muted rounded-xl p-5 text-center font-mono">
            <div className="text-muted-foreground text-xs mb-1">BOAT SPD</div>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-white">10.6</span>
              <span className="text-sm text-muted-foreground ml-1">kn</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'DEPTH', value: '10.2' },
                { label: 'SEA TEMP °C', value: '9.1' },
                { label: 'TWS', value: '7.7' }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className="text-white font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="bg-black/70 border border-border rounded-lg p-4 flex-1 overflow-y-auto">
            <h4 className="text-primary mb-3 text-sm font-semibold">Live Standings</h4>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'WindMaster (You)', distance: '2.1nm', current: true },
                { rank: 2, name: 'SailShark', distance: '2.2nm', current: false },
                { rank: 3, name: 'TackTitan', distance: '2.3nm', current: false },
                { rank: 4, name: 'GybeGuru', distance: '2.4nm', current: false },
                { rank: 5, name: 'SpeedDemon', distance: '2.5nm', current: false }
              ].map((sailor) => (
                <div key={sailor.rank} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground font-bold w-6">{sailor.rank}</span>
                  <span className={`flex-1 text-sm ${sailor.current ? 'text-sailing-success font-bold' : 'text-foreground'}`}>
                    {sailor.name}
                  </span>
                  <span className="text-sm">{sailor.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-1 bg-card/90 backdrop-blur-sm border-l border-t border-border flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto text-xs space-y-2">
            {[
              { sender: 'Race Control', message: '5 minutes to start sequence', color: 'text-sailing-success' },
              { sender: 'SailShark', message: 'Good luck everyone!', color: 'text-primary' },
              { sender: 'TackTitan', message: 'Wind shift coming from the right', color: 'text-sailing-warning' },
              { sender: 'GybeGuru', message: 'Thanks for the heads up', color: 'text-sailing-danger' },
              { sender: 'SpeedDemon', message: "Let's see who's fastest today", color: 'text-purple-400' }
            ].map((msg, index) => (
              <div key={index} className="leading-relaxed">
                <strong className={msg.color}>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="w-full bg-secondary border border-border text-foreground px-3 py-2 rounded-md text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}