import { config } from "../config";
import { AstralMapping } from "../constants";
import type { Astral, AstralInput } from "../schemas/astral.schema";
import type { GoalContent, MapContent } from "../schemas/map.schema";

export type AstralAction = AstralInput & {
	type: Astral | "SPACE";
	action: "delete" | "place";
};

export function isSameAstral(type: number | null, value: string) {
	if (type === null) {
		return value === "SPACE";
	}
	return AstralMapping[type] === value;
}

export function getAstralsOnMap(current: MapContent) {
	if (!config.shapeSize) {
		throw new Error("shapeSize is not initialized");
	}
	const astralsOnMap: AstralInput[] = [];
	for (let i = 0; i < config.shapeSize; i++) {
		for (let j = 0; j < config.shapeSize; j++) {
			const cell = current[i][j];
			if (cell && cell.type !== null) {
				astralsOnMap.push({
					row: i,
					column: j,
				});
			}
		}
	}
	return astralsOnMap;
}

export function getAstralMismatch(
	current: MapContent,
	goal: GoalContent,
): AstralAction[] {
	if (!config.shapeSize) {
		throw new Error("shapeSize is not initialized");
	}
	const placesToChange: AstralAction[] = [];

	for (let i = 0; i < config.shapeSize; i++) {
		for (let j = 0; j < config.shapeSize; j++) {
			const currentType = current[i][j]?.type ?? null;
			const currentGoal = goal[i][j];
			if (!isSameAstral(currentType, currentGoal)) {
				placesToChange.push({
					row: i,
					column: j,
					type: currentGoal,
					action: currentGoal === "SPACE" ? "delete" : "place",
				});
			}
		}
	}
	return placesToChange;
}
