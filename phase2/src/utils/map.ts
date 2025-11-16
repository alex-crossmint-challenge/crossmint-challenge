import { config } from "../config";
import {
	getAstralBaseType,
	getAstralFromCell,
	getComethDirection,
	getSoloonColor,
} from "../constants";
import type { Astral, AstralInput } from "../schemas/astral.schema";
import type { GoalContent, MapContent } from "../schemas/map.schema";

export type AstralAction = AstralInput & {
	typeGoal: Astral | "SPACE";
	typeCurrent: Astral | null;
	action: "delete" | "place";
};

export function isSameAstral(
	cell: { type: number | null; color?: string; direction?: string } | null,
	goalValue: Astral | "SPACE",
): boolean {
	if (cell === null || cell.type === null) {
		return goalValue === "SPACE";
	}

	if (goalValue === "SPACE") {
		return false;
	}

	const goalBaseType = getAstralBaseType(goalValue);
	if (goalBaseType !== cell.type) {
		return false;
	}

	if (cell.type === 1) {
		const goalColor = getSoloonColor(goalValue);
		return goalColor !== null && cell.color === goalColor;
	}

	if (cell.type === 2) {
		const goalDirection = getComethDirection(goalValue);
		return goalDirection !== null && cell.direction === goalDirection;
	}

	return true;
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
			const currentCell = current[i][j];
			const currentGoal = goal[i][j];
			// We avoid adding repeated astrals if we already have it!
			if (!isSameAstral(currentCell, currentGoal)) {
				placesToChange.push({
					row: i,
					column: j,
					typeGoal: currentGoal,
					typeCurrent: getAstralFromCell(currentCell),
					action: currentGoal === "SPACE" ? "delete" : "place",
				});
			}
		}
	}
	return placesToChange;
}
