// @ts-check
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import {
  InputMsgSchema,
  BoatStateSchema,
  SnapshotSchema,
  WindSchema
} from '../supabase/functions/_shared/types.js';

const PORT = Number(process.env.PORT) || 8080;
const TICK_RATE = 20; // 20 Hz
const SNAPSHOT_RATE = 10; // 10 Hz

/** @type {Map<string, import('../supabase/functions/_shared/types.js').BoatState>} */
const boats = new Map();
/** @type {import('../supabase/functions/_shared/types.js').Wind} */
let wind = { dirDeg: 0, speed: 5 };
let tick = 0;
let lastSnapshot = { tick: 0, wind, boats: [], events: [] };

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  let boatId = '';

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    switch (msg.type) {
      case 'JOIN': {
        const name = typeof msg.name === 'string' ? msg.name : 'anon';
        boatId = randomUUID();
        const boat = /** @type {import('../supabase/functions/_shared/types.js').BoatState} */ ({
          id: boatId,
          name,
          color: 'red',
          hullLen: 4,
          pos: { x: 0, y: 0 },
          heading: 0,
          speed: 0,
          twa: 0,
          lastManeuverAt: 0,
        });
        boats.set(boatId, boat);
        ws.send(JSON.stringify({ type: 'ACCEPT', id: boatId, roomState: currentSnapshot() }));
        break;
      }
      case 'INPUT': {
        try {
          const input = InputMsgSchema.parse(msg.data);
          const boat = boats.get(boatId);
          if (!boat) return;
          boat.speed += input.throttle * 0.1;
          boat.heading += input.rudder * 2;
        } catch {
          // invalid input ignored
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (boatId) boats.delete(boatId);
  });
});

function currentSnapshot() {
  return {
    tick,
    wind,
    boats: Array.from(boats.values()),
    events: [],
  };
}

setInterval(() => {
  tick += 1;
  for (const boat of boats.values()) {
    boat.pos.x += Math.cos((boat.heading * Math.PI) / 180) * boat.speed / TICK_RATE;
    boat.pos.y += Math.sin((boat.heading * Math.PI) / 180) * boat.speed / TICK_RATE;
  }
}, 1000 / TICK_RATE);

setInterval(() => {
  const snap = currentSnapshot();
  const deltaBoats = snap.boats.filter((b) => {
    const prev = lastSnapshot.boats.find((p) => p.id === b.id);
    return !prev || pDiff(prev, b);
  });
  const delta = { tick: snap.tick, wind: snap.wind, boats: deltaBoats, events: snap.events };
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'SNAPSHOT', data: delta }));
    }
  }
  lastSnapshot = snap;
}, 1000 / SNAPSHOT_RATE);

function pDiff(a, b) {
  return a.pos.x !== b.pos.x || a.pos.y !== b.pos.y || a.heading !== b.heading || a.speed !== b.speed;
}

console.log(`Authoritative server running on port ${PORT}`);
