const WebSocket = require('ws');
const http = require('http');

// Game server configuration
const PORT = process.env.PORT || 8080;
const TICK_RATE = 20; // 20 Hz server tick
const SNAPSHOT_RATE = 10; // 10 Hz client updates

// Game state
let gameState = {
  tick: 0,
  boats: new Map(),
  marks: [
    { id: 'start', name: 'Start', type: 'start', x: 0, z: -20, radius: 2 },
    { id: 'windward', name: '1', type: 'windward', x: 0, z: 50, radius: 3, roundingDirection: 'port' },
    { id: 'leeward', name: '2', type: 'leeward', x: 0, z: -40, radius: 3, roundingDirection: 'starboard' }
  ],
  wind: { direction: 0, speed: 12 },
  raceStatus: 'waiting'
};

// Create HTTP server and WebSocket server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Physics simulation
function simulateBoatPhysics(boat, deltaTime) {
  // Simplified sailing physics
  const windAngle = Math.abs(boat.heading - gameState.wind.direction);
  const windSpeed = gameState.wind.speed;
  
  // Basic polar curve approximation
  let targetSpeed = 0;
  if (windAngle < Math.PI / 6) { // Close hauled
    targetSpeed = windSpeed * 0.4;
  } else if (windAngle < Math.PI / 3) { // Close reach
    targetSpeed = windSpeed * 0.6;
  } else if (windAngle < Math.PI * 2/3) { // Beam reach
    targetSpeed = windSpeed * 0.8;
  } else if (windAngle < Math.PI * 5/6) { // Broad reach
    targetSpeed = windSpeed * 0.7;
  } else { // Running
    targetSpeed = windSpeed * 0.5;
  }
  
  // Smooth speed changes
  const speedDiff = targetSpeed - boat.speed;
  boat.speed += speedDiff * deltaTime * 0.1;
  boat.speed = Math.max(0, boat.speed);
  
  // Update position
  boat.x += Math.sin(boat.heading) * boat.speed * deltaTime;
  boat.z += Math.cos(boat.heading) * boat.speed * deltaTime;
  
  // Calculate VMG (velocity made good to windward)
  boat.vmg = boat.speed * Math.cos(windAngle);
  
  return boat;
}

// Game loop
function gameLoop() {
  const deltaTime = 1 / TICK_RATE;
  gameState.tick++;
  
  // Update all boats
  for (let [id, boat] of gameState.boats) {
    if (boat.isBot) {
      // Simple AI for bot boats
      const targetMark = gameState.marks[0]; // Simplified - always go to first mark
      const angleToMark = Math.atan2(targetMark.x - boat.x, targetMark.z - boat.z);
      boat.heading = angleToMark + (Math.random() - 0.5) * 0.2; // Add some randomness
    }
    
    simulateBoatPhysics(boat, deltaTime);
  }
  
  // Check race rules and penalties
  checkRaceRules();
  
  // Broadcast game state every snapshot interval
  if (gameState.tick % (TICK_RATE / SNAPSHOT_RATE) === 0) {
    broadcastGameState();
  }
}

function checkRaceRules() {
  // Simplified rule checking
  const boats = Array.from(gameState.boats.values());
  
  // Check for overlaps and right-of-way violations
  for (let i = 0; i < boats.length; i++) {
    for (let j = i + 1; j < boats.length; j++) {
      const boat1 = boats[i];
      const boat2 = boats[j];
      
      const distance = Math.sqrt(
        Math.pow(boat1.x - boat2.x, 2) + 
        Math.pow(boat1.z - boat2.z, 2)
      );
      
      // Check for collision/overlap (simplified)
      if (distance < 3) { // 3 meters
        console.log(`Overlap detected between boats ${boat1.id} and ${boat2.id}`);
        // In a real implementation, this would trigger rule checks
      }
    }
  }
}

function broadcastGameState() {
  const stateUpdate = {
    type: 'GAME_STATE',
    data: {
      tick: gameState.tick,
      boats: Array.from(gameState.boats.values()),
      marks: gameState.marks,
      wind: gameState.wind,
      raceStatus: gameState.raceStatus
    },
    timestamp: Date.now()
  };
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(stateUpdate));
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New client connected');
  
  let playerId = null;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'HANDSHAKE':
          playerId = message.data.playerId || `player-${Date.now()}`;
          
          // Create new boat for player
          const newBoat = {
            id: playerId,
            number: gameState.boats.size + 1,
            name: `Player ${gameState.boats.size + 1}`,
            team: gameState.boats.size % 2 === 0 ? 'red' : 'blue',
            x: (Math.random() - 0.5) * 10,
            z: -15 + (Math.random() - 0.5) * 5,
            heading: 0,
            speed: 0,
            vmg: 0,
            position: gameState.boats.size + 1,
            penalties: [],
            isBot: false
          };
          
          gameState.boats.set(playerId, newBoat);
          
          // Send welcome message
          ws.send(JSON.stringify({
            type: 'WELCOME',
            data: { playerId, boat: newBoat },
            timestamp: Date.now()
          }));
          
          console.log(`Player ${playerId} joined the game`);
          break;
          
        case 'PLAYER_ACTION':
          if (playerId && gameState.boats.has(playerId)) {
            handlePlayerAction(playerId, message.data);
          }
          break;
          
        case 'PONG':
          // Handle ping/pong for connection health
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    if (playerId) {
      gameState.boats.delete(playerId);
      console.log(`Player ${playerId} disconnected`);
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handlePlayerAction(playerId, action) {
  const boat = gameState.boats.get(playerId);
  if (!boat) return;
  
  switch (action.type) {
    case 'TACK':
      boat.heading = -boat.heading;
      boat.speed = Math.max(0, boat.speed - 1); // Tacking penalty
      break;
      
    case 'GYBE':
      boat.heading = Math.PI - boat.heading;
      boat.speed = Math.max(0, boat.speed - 0.5); // Gybing penalty
      break;
      
    case 'STEER':
      boat.heading += action.angle;
      // Normalize heading
      while (boat.heading > Math.PI) boat.heading -= 2 * Math.PI;
      while (boat.heading < -Math.PI) boat.heading += 2 * Math.PI;
      break;
      
    case 'TRIM_SAIL':
      boat.sailTrim = action.angle;
      break;
  }
}

// Add some bot boats for testing
function addBotBoats() {
  for (let i = 0; i < 3; i++) {
    const botId = `bot-${i + 1}`;
    const bot = {
      id: botId,
      number: i + 2,
      name: `Bot ${String.fromCharCode(65 + i)}`, // Bot A, Bot B, etc.
      team: i % 2 === 0 ? 'blue' : 'red',
      x: (Math.random() - 0.5) * 15,
      z: -15 + (Math.random() - 0.5) * 8,
      heading: (Math.random() - 0.5) * 0.5,
      speed: 5 + Math.random() * 3,
      vmg: 0,
      position: i + 2,
      penalties: [],
      isBot: true
    };
    
    gameState.boats.set(botId, bot);
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`Sailing game server running on port ${PORT}`);
  
  // Add bot boats
  addBotBoats();
  
  // Start game loop
  setInterval(gameLoop, 1000 / TICK_RATE);
  
  // Periodic ping to check client connections
  setInterval(() => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'PING',
          data: { timestamp: Date.now() },
          timestamp: Date.now()
        }));
      }
    });
  }, 30000); // Every 30 seconds
});

module.exports = { server, wss };