import type {
	AstralInput,
	ComethsInput,
	SoloonsInput,
} from "../schemas/astral.schema";
import type { GoalResponse, MapContent } from "../schemas/map.schema";
import type { AstralAction } from "../utils/map";

export interface IApiClient {
	makeRequest(url: string, options: RequestInit): Promise<unknown>;
	waitForRateLimit(): Promise<void>;
}

export interface IAstralClient {
	place(input: AstralInput): Promise<unknown>;
	remove(input: AstralInput): Promise<unknown>;
}

export interface IPolyanetsClient {
	placePolyanet(input: AstralInput): Promise<unknown>;
	removePolyanet(input: AstralInput): Promise<unknown>;
}

export interface ISoloonsClient {
	placeSoloon(input: SoloonsInput): Promise<unknown>;
	removeSoloon(input: AstralInput): Promise<unknown>;
}

export interface IComethsClient {
	placeCometh(input: ComethsInput): Promise<unknown>;
	removeCometh(input: AstralInput): Promise<unknown>;
}

export interface IMapClient {
	getGoal(): Promise<GoalResponse>;
	getMap(): Promise<MapContent>;
	clearMap(): Promise<MapContent>;
	fillMissingPlaces(missingPlaces: AstralAction[]): Promise<unknown>;
	completeGoal(): Promise<AstralAction[]>;
}
