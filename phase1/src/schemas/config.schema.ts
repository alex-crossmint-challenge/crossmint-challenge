import z from "zod";

export default function ConfigSchema() {
	return z.object({
		baseApiUrl: z.url({ hostname: /^challenge\.crossmint\.io$/ }),
		polyanetApiEndpoint: z.string().min(1),
		mapApiEndpoint: z.string().min(1),
		candidateId: z.uuid(),
		shapeSize: z.number().int().positive().optional(),
		maxAttempts: z.number().int().positive(),
		requestTimeout: z.number().int().positive(),
	});
}
