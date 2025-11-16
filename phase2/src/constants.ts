import type z from "zod";
import type {
	Astral,
	ComethDirectionEnum,
	SoloonColorEnum,
} from "./schemas/astral.schema";

type SoloonColor = z.infer<typeof SoloonColorEnum>;
type ComethDirection = z.infer<typeof ComethDirectionEnum>;

export const AstralBaseTypeMapping: Record<number, string> = {
	0: "POLYANET",
	1: "SOLOON",
	2: "COMETH",
};

export const SoloonColorMapping: Record<string, SoloonColor> = {
	BLUE_SOLOON: "blue",
	RED_SOLOON: "red",
	PURPLE_SOLOON: "purple",
	WHITE_SOLOON: "white",
};

export const ComethDirectionMapping: Record<string, ComethDirection> = {
	UP_COMETH: "up",
	DOWN_COMETH: "down",
	LEFT_COMETH: "left",
	RIGHT_COMETH: "right",
};

export function getAstralBaseType(
	astralString: Astral | "SPACE",
): number | null {
	if (astralString === "SPACE") return null;
	if (astralString === "POLYANET") return 0;
	if (astralString.includes("SOLOON")) return 1;
	if (astralString.includes("COMETH")) return 2;
	return null;
}

export function getSoloonColor(astralString: Astral): SoloonColor | null {
	return SoloonColorMapping[astralString] ?? null;
}

export function getComethDirection(
	astralString: Astral,
): ComethDirection | null {
	return ComethDirectionMapping[astralString] ?? null;
}

export function getAstralFromCell(
	cell: { type: number | null; color?: string; direction?: string } | null,
): Astral | null {
	if (cell === null || cell.type === null) {
		return null;
	}

	if (cell.type === 0) {
		return "POLYANET";
	}

	if (cell.type === 1 && cell.color) {
		const colorUpper = cell.color.toUpperCase();
		return `${colorUpper}_SOLOON` as Astral;
	}

	if (cell.type === 2 && cell.direction) {
		const directionUpper = cell.direction.toUpperCase();
		return `${directionUpper}_COMETH` as Astral;
	}

	return null;
}
