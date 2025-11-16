import z from "zod";

export const AstralTypes = z.enum(["POLYANET"]);

export type Astral = z.infer<typeof AstralTypes>;

export const AstralInputSchema = z.object({
	row: z.number().int().min(0),
	column: z.number().int().min(0),
});

export type AstralInput = z.infer<typeof AstralInputSchema>;
