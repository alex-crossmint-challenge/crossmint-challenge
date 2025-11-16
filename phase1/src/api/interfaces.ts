import type { AstralInput } from "../schemas/astral.schema";
import type { GoalResponse, MapContent } from "../schemas/map.schema";
import type { AstralAction } from "../utils/map";

export interface IApiClient {
	makeRequest(url: string, options: RequestInit): Promise<unknown>;
}

export interface IPolyanetsClient {
	placePolyanet(input: AstralInput): Promise<unknown>;
	removePolyanet(input: AstralInput): Promise<unknown>;
}

export interface IMapClient {
	getGoal(): Promise<GoalResponse>;
	getMap(): Promise<MapContent>;
	clearMap(): Promise<MapContent>;
	fillMissingPlaces(missingPlaces: AstralAction[]): Promise<unknown>;
	completeGoal(): Promise<AstralAction[]>;
}
