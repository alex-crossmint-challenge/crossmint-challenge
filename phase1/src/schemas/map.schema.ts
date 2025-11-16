import z from "zod";
import { AstralTypes } from "./astral.schema";

const MapContentCellSchema = z.union([
	z.object({
		type: z.number().int().min(0),
	}),
	z.null(),
]);

const MapContentRowSchema = z.array(MapContentCellSchema);

const MapContentSchema = z.array(MapContentRowSchema);

const MapDataSchema = z.object({
	_id: z.string(),
	content: MapContentSchema,
	candidateId: z.uuid(),
	phase: z.number().int().positive(),
	__v: z.number().int(),
});

export const MapResponseSchema = z.object({
	map: MapDataSchema,
});

const GoalContentCellSchema = z.union([AstralTypes, z.literal("SPACE")]);

const GoalDataSchema = z.array(z.array(GoalContentCellSchema));

export const GoalResponseSchema = z.object({
	goal: GoalDataSchema,
});

const GoalContentRowSchema = z.array(GoalContentCellSchema);

const GoalContentSchema = z.array(GoalContentRowSchema);

export type MapResponse = z.infer<typeof MapResponseSchema>;
export type MapContent = z.infer<typeof MapContentSchema>;
export type GoalResponse = z.infer<typeof GoalResponseSchema>;
export type GoalContent = z.infer<typeof GoalContentSchema>;
