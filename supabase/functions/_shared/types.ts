import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const Vec2Schema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Vec2 = z.infer<typeof Vec2Schema>;

export const WindSchema = z.object({
  dirDeg: z.number(),
  speed: z.number(),
});
export type Wind = z.infer<typeof WindSchema>;

export const BoatStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.union([z.literal('red'), z.literal('blue'), z.literal('custom')]),
  hullLen: z.number(),
  pos: Vec2Schema,
  heading: z.number(),
  speed: z.number(),
  twa: z.number(),
  lastManeuverAt: z.number(),
});
export type BoatState = z.infer<typeof BoatStateSchema>;

export const MarkSchema = z.object({
  id: z.string(),
  pos: Vec2Schema,
  radius: z.number(),
  label: z.string(),
});
export type Mark = z.infer<typeof MarkSchema>;

export const GameEventSchema = z.object({
  type: z.string(),
  message: z.string().optional(),
});
export type GameEvent = z.infer<typeof GameEventSchema>;

export const SnapshotSchema = z.object({
  tick: z.number(),
  wind: WindSchema,
  boats: BoatStateSchema.array(),
  events: GameEventSchema.array(),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

export const InputMsgSchema = z.object({
  seq: z.number(),
  throttle: z.number().min(-1).max(1),
  rudder: z.number().min(-1).max(1),
  sail: z.number().min(0).max(1),
});
export type InputMsg = z.infer<typeof InputMsgSchema>;
