import z from "zod";

export const AstralTypes = z.enum([
	"POLYANET",
	"RIGHT_COMETH",
	"UP_COMETH",
	"LEFT_COMETH",
	"DOWN_COMETH",
	"WHITE_SOLOON",
	"BLUE_SOLOON",
	"PURPLE_SOLOON",
	"RED_SOLOON",
]);

export type Astral = z.infer<typeof AstralTypes>;

export const SoloonColorEnum = z.enum(["blue", "red", "purple", "white"]);
export const ComethDirectionEnum = z.enum(["up", "down", "right", "left"]);

export const AstralInputSchema = z.object({
	row: z.number().int().min(0),
	column: z.number().int().min(0),
});

export const SoloonsInputSchema = AstralInputSchema.extend({
	color: SoloonColorEnum,
});

export const ComethsInputSchema = AstralInputSchema.extend({
	direction: ComethDirectionEnum,
});

export type AstralInput = z.infer<typeof AstralInputSchema>;
export type SoloonsInput = z.infer<typeof SoloonsInputSchema>;
export type ComethsInput = z.infer<typeof ComethsInputSchema>;
