import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { InputMsgSchema, BoatState } from "../_shared/types.ts";

serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("expected websocket", { status: 400 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  const boats = new Map<string, BoatState>();
  let tick = 0;
  socket.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data as string);
      if (msg.type === "JOIN") {
        boats.set(msg.id, {
          id: msg.id,
          name: msg.name ?? "anon",
          color: "red",
          hullLen: 4,
          pos: { x: 0, y: 0 },
          heading: 0,
          speed: 0,
          twa: 0,
          lastManeuverAt: 0,
        });
        socket.send(JSON.stringify({ type: "ACCEPT", id: msg.id }));
      } else if (msg.type === "INPUT") {
        const input = InputMsgSchema.safeParse(msg.data);
        if (input.success) {
          const b = boats.get(msg.id);
          if (b) {
            b.speed += input.data.throttle * 0.1;
            b.heading += input.data.rudder * 2;
          }
        }
      }
    } catch (_) {
      /* ignore */
    }
  };
  const interval = setInterval(() => {
    tick++;
    const snapshot = { tick, wind: { dirDeg: 0, speed: 5 }, boats: Array.from(boats.values()), events: [] };
    socket.send(JSON.stringify({ type: "SNAPSHOT", data: snapshot }));
  }, 100);
  socket.onclose = () => clearInterval(interval);
  return response;
});
