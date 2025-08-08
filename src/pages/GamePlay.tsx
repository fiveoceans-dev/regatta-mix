<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SailingGame - Live Race</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a0b;
            color: #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        }

        /* Main Game Layout */
        .game-container {
            display: grid;
            grid-template-areas: 
                "topbar topbar topbar"
                "sidebar main instruments"
                "sidebar main chat";
            grid-template-columns: 280px 1fr 320px;
            grid-template-rows: 60px 1fr 200px;
            height: 100vh;
            gap: 1px;
            background: #111;
        }

        /* Top Navigation Bar */
        .topbar {
            grid-area: topbar;
            background: rgba(17, 24, 39, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #374151;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
        }

        .race-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .race-title {
            font-size: 18px;
            font-weight: 600;
            color: #06b6d4;
        }

        .race-timer {
            background: #065f46;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            color: #10b981;
        }

        .player-count {
            color: #9ca3af;
        }

        /* Left Sidebar - Game Controls */
        .sidebar {
            grid-area: sidebar;
            background: rgba(17, 24, 39, 0.9);
            backdrop-filter: blur(10px);
            border-right: 1px solid #374151;
            padding: 20px;
            overflow-y: auto;
        }

        .control-section {
            margin-bottom: 30px;
        }

        .control-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #06b6d4;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .control-button {
            width: 100%;
            background: #1f2937;
            border: 1px solid #374151;
            color: #e5e7eb;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .control-button:hover {
            background: #374151;
            border-color: #06b6d4;
        }

        .control-button.active {
            background: #065f46;
            border-color: #10b981;
            color: #10b981;
        }

        /* Main Game Area */
        .main-game {
            grid-area: main;
            background: #0f172a;
            position: relative;
            overflow: hidden;
        }

        /* Water/Ocean Canvas */
        .ocean-canvas {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
            position: relative;
        }

        /* Course Lines Overlay */
        .course-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }

        /* Boats Container */
        .boats-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .boat {
            position: absolute;
            width: 20px;
            height: 30px;
            background: #06b6d4;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            transition: all 0.1s linear;
        }

        .boat.player {
            background: #10b981;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
        }

        /* Wind Indicators */
        .wind-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #374151;
        }

        .wind-arrow {
            width: 60px;
            height: 60px;
            background: #374151;
            border-radius: 50%;
            position: relative;
            margin: 0 auto 10px;
        }

        .wind-arrow::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 25px solid #06b6d4;
        }

        /* Right Instruments Panel */
        .instruments {
            grid-area: instruments;
            background: rgba(17, 24, 39, 0.9);
            backdrop-filter: blur(10px);
            border-left: 1px solid #374151;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* B&G Style Speed Indicator */
        .speed-display {
            background: #000;
            border: 3px solid #333;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            font-family: 'Courier New', monospace;
        }

        .speed-label {
            color: #888;
            font-size: 12px;
            margin-bottom: 5px;
        }

        .speed-value {
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            line-height: 1;
        }

        .speed-unit {
            color: #888;
            font-size: 14px;
            margin-left: 5px;
        }

        .mini-displays {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
        }

        .mini-display {
            text-align: center;
            font-family: 'Courier New', monospace;
        }

        .mini-display .label {
            color: #888;
            font-size: 10px;
        }

        .mini-display .value {
            color: #fff;
            font-size: 16px;
            font-weight: bold;
        }

        /* Leaderboard */
        .leaderboard {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #374151;
            border-radius: 8px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        }

        .leaderboard h4 {
            color: #06b6d4;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .leader-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #374151;
        }

        .leader-item:last-child {
            border-bottom: none;
        }

        .leader-rank {
            color: #9ca3af;
            font-weight: bold;
            width: 30px;
        }

        .leader-name {
            flex: 1;
            color: #e5e7eb;
        }

        .leader-name.current {
            color: #10b981;
            font-weight: bold;
        }

        /* Chat Area */
        .chat {
            grid-area: chat;
            background: rgba(17, 24, 39, 0.9);
            backdrop-filter: blur(10px);
            border-left: 1px solid #374151;
            border-top: 1px solid #374151;
            display: flex;
            flex-direction: column;
        }

        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            font-size: 12px;
        }

        .chat-message {
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .chat-input {
            border-top: 1px solid #374151;
            padding: 10px;
        }

        .chat-input input {
            width: 100%;
            background: #1f2937;
            border: 1px solid #374151;
            color: #e5e7eb;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
        }

        /* Signal Flag Panel */
        .signal-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 120px;
            height: 120px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #374151;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .game-container {
                grid-template-columns: 240px 1fr 280px;
            }
        }

        @media (max-width: 768px) {
            .game-container {
                grid-template-areas: 
                    "topbar"
                    "main"
                    "controls";
                grid-template-columns: 1fr;
                grid-template-rows: 60px 1fr 200px;
            }
            
            .sidebar, .instruments, .chat {
                display: none;
            }
        }

        /* HUD Overlays */
        .hud-overlay {
            position: absolute;
            top: 100px;
            left: 20px;
            color: #10b981;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #10b981;
        }

        .course-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #374151;
            color: #e5e7eb;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <!-- Top Navigation Bar -->
        <div class="topbar">
            <div class="race-info">
                <div class="race-title">Mediterranean Sprint Championship</div>
                <div class="race-timer">5:42 to Start</div>
                <div class="player-count">156/200 sailors</div>
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <button class="control-button" style="width: auto; padding: 8px 16px;">Menu</button>
                <button class="control-button" style="width: auto; padding: 8px 16px;">Settings</button>
            </div>
        </div>

        <!-- Left Sidebar - Game Controls -->
        <div class="sidebar">
            <div class="control-section">
                <h3>Sailing Controls</h3>
                <button class="control-button">Tack to Port</button>
                <button class="control-button">Tack to Starboard</button>
                <button class="control-button">Bear Away</button>
                <button class="control-button">Head Up</button>
            </div>

            <div class="control-section">
                <h3>Race Actions</h3>
                <button class="control-button">Protest</button>
                <button class="control-button">Request Redress</button>
                <button class="control-button">Retire</button>
            </div>

            <div class="control-section">
                <h3>View Options</h3>
                <button class="control-button active">Course View</button>
                <button class="control-button">Tactical View</button>
                <button class="control-button">Wind Map</button>
                <button class="control-button">Current Map</button>
            </div>

            <div class="control-section">
                <h3>Layers</h3>
                <button class="control-button active">Wind Arrows</button>
                <button class="control-button">Wind Shadow</button>
                <button class="control-button">Laylines</button>
                <button class="control-button">Weather Routing</button>
            </div>
        </div>

        <!-- Main Game Area -->
        <div class="main-game">
            <div class="ocean-canvas" id="gameCanvas">
                <!-- Wind Overlay -->
                <div class="wind-overlay">
                    <div class="wind-arrow" style="transform: rotate(45deg);"></div>
                    <div style="text-align: center; color: #06b6d4;">
                        <div style="font-weight: bold;">12.5 kts</div>
                        <div style="font-size: 10px;">045° True</div>
                    </div>
                </div>

                <!-- Signal Flag Panel -->
                <div class="signal-panel">
                    <span style="color: #fbbf24;">⚡</span>
                </div>

                <!-- HUD Information -->
                <div class="hud-overlay">
                    <div>HEADING: 045°</div>
                    <div>COURSE: 030°</div>
                    <div>VMG: 8.2 kts</div>
                    <div>DIST TO MARK: 2.1 nm</div>
                </div>

                <!-- Course Information -->
                <div class="course-info">
                    <div style="font-weight: bold; margin-bottom: 5px;">Next Mark: Windward Mark</div>
                    <div>Distance: 2.1 nautical miles</div>
                    <div>Bearing: 030° True</div>
                    <div>ETA: 15:42</div>
                </div>

                <!-- Boats will be rendered here by Three.js -->
                <div class="boats-container" id="boatsContainer">
                    <!-- Sample boats for mockup -->
                    <div class="boat player" style="top: 60%; left: 45%; transform: rotate(45deg);"></div>
                    <div class="boat" style="top: 55%; left: 40%; transform: rotate(30deg);"></div>
                    <div class="boat" style="top: 65%; left: 50%; transform: rotate(60deg);"></div>
                    <div class="boat" style="top: 58%; left: 48%; transform: rotate(40deg);"></div>
                    <div class="boat" style="top: 62%; left: 42%; transform: rotate(50deg);"></div>
                </div>

                <!-- Course lines will be rendered here -->
                <div class="course-overlay" id="courseOverlay"></div>
            </div>
        </div>

        <!-- Right Instruments Panel -->
        <div class="instruments">
            <!-- B&G Style Speed Display -->
            <div class="speed-display">
                <div class="speed-label">BOAT SPD</div>
                <div style="display: flex; align-items: baseline; justify-content: center;">
                    <span class="speed-value">10.6</span>
                    <span class="speed-unit">kn</span>
                </div>
                
                <div class="mini-displays">
                    <div class="mini-display">
                        <div class="label">DEPTH</div>
                        <div class="value">10.2</div>
                    </div>
                    <div class="mini-display">
                        <div class="label">SEA TEMP °C</div>
                        <div class="value">9.1</div>
                    </div>
                    <div class="mini-display">
                        <div class="label">TWS</div>
                        <div class="value">7.7</div>
                    </div>
                </div>
            </div>

            <!-- Live Leaderboard -->
            <div class="leaderboard">
                <h4>Live Standings</h4>
                <div class="leader-item">
                    <span class="leader-rank">1</span>
                    <span class="leader-name current">WindMaster (You)</span>
                    <span>2.1nm</span>
                </div>
                <div class="leader-item">
                    <span class="leader-rank">2</span>
                    <span class="leader-name">SailShark</span>
                    <span>2.2nm</span>
                </div>
                <div class="leader-item">
                    <span class="leader-rank">3</span>
                    <span class="leader-name">TackTitan</span>
                    <span>2.3nm</span>
                </div>
                <div class="leader-item">
                    <span class="leader-rank">4</span>
                    <span class="leader-name">GybeGuru</span>
                    <span>2.4nm</span>
                </div>
                <div class="leader-item">
                    <span class="leader-rank">5</span>
                    <span class="leader-name">SpeedDemon</span>
                    <span>2.5nm</span>
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div class="chat">
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message"><strong style="color: #10b981;">Race Control:</strong> 5 minutes to start sequence</div>
                <div class="chat-message"><strong style="color: #06b6d4;">SailShark:</strong> Good luck everyone!</div>
                <div class="chat-message"><strong style="color: #fbbf24;">TackTitan:</strong> Wind shift coming from the right</div>
                <div class="chat-message"><strong style="color: #f87171;">GybeGuru:</strong> Thanks for the heads up</div>
                <div class="chat-message"><strong style="color: #a78bfa;">SpeedDemon:</strong> Let's see who's fastest today</div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." />
            </div>
        </div>
    </div>

    <script>
        // Basic interaction for mockup
        document.addEventListener('DOMContentLoaded', function() {
            // Simulate boat movement
            const boats = document.querySelectorAll('.boat');
            
            setInterval(() => {
                boats.forEach(boat => {
                    const currentTop = parseFloat(boat.style.top) || 60;
                    const currentLeft = parseFloat(boat.style.left) || 45;
                    
                    // Random small movements
                    const newTop = currentTop + (Math.random() - 0.5) * 0.5;
                    const newLeft = currentLeft + (Math.random() - 0.5) * 0.5;
                    
                    boat.style.top = Math.max(10, Math.min(90, newTop)) + '%';
                    boat.style.left = Math.max(10, Math.min(90, newLeft)) + '%';
                });
            }, 100);

            // Simulate chat messages
            const chatMessages = document.getElementById('chatMessages');
            const messages = [
                'Race Control: Warning signal displayed',
                'WindMaster: Perfect wind for foiling!',
                'SailShark: See you at the windward mark',
                'TackTitan: This is going to be close'
            ];
            
            let messageIndex = 0;
            setInterval(() => {
                if (messageIndex < messages.length) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chat-message';
                    messageDiv.innerHTML = `<strong style="color: #${Math.floor(Math.random()*16777215).toString(16)};">${messages[messageIndex].split(':')[0]}:</strong> ${messages[messageIndex].split(':')[1]}`;
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    messageIndex++;
                }
            }, 5000);

            // Control button interactions
            document.querySelectorAll('.control-button').forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from siblings in same section
                    const section = this.closest('.control-section');
                    if (section) {
                        section.querySelectorAll('.control-button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                });
            });
        });
    </script>
</body>
</html>