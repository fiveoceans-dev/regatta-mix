"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMsgSchema = exports.SnapshotSchema = exports.GameEventSchema = exports.MarkSchema = exports.BoatStateSchema = exports.WindSchema = exports.Vec2Schema = void 0;
const zod_1 = require("zod");
exports.Vec2Schema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
});
exports.WindSchema = zod_1.z.object({
    dirDeg: zod_1.z.number(),
    speed: zod_1.z.number(),
});
exports.BoatStateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    color: zod_1.z.union([zod_1.z.literal('red'), zod_1.z.literal('blue'), zod_1.z.literal('custom')]),
    hullLen: zod_1.z.number(),
    pos: exports.Vec2Schema,
    heading: zod_1.z.number(),
    speed: zod_1.z.number(),
    twa: zod_1.z.number(),
    lastManeuverAt: zod_1.z.number(),
});
exports.MarkSchema = zod_1.z.object({
    id: zod_1.z.string(),
    pos: exports.Vec2Schema,
    radius: zod_1.z.number(),
    label: zod_1.z.string(),
});
exports.GameEventSchema = zod_1.z.object({
    type: zod_1.z.string(),
    message: zod_1.z.string().optional(),
});
exports.SnapshotSchema = zod_1.z.object({
    tick: zod_1.z.number(),
    wind: exports.WindSchema,
    boats: exports.BoatStateSchema.array(),
    events: exports.GameEventSchema.array(),
});
exports.InputMsgSchema = zod_1.z.object({
    seq: zod_1.z.number(),
    throttle: zod_1.z.number().min(-1).max(1),
    rudder: zod_1.z.number().min(-1).max(1),
    sail: zod_1.z.number().min(0).max(1),
});
