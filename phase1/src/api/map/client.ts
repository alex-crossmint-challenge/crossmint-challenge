import { config } from "../../config";
import {
	type GoalResponse,
	GoalResponseSchema,
	type MapContent,
	MapResponseSchema,
} from "../../schemas/map.schema";
import {
	type AstralAction,
	getAstralMismatch,
	getAstralsOnMap,
} from "../../utils/map";
import { ApiClient } from "..";
import type { IMapClient } from "../interfaces";
import { PolyanetsClient } from "../polyanets/client";

const MAP_CANDIDATE_ID_ENDPOINT = `${config.mapApiEndpoint}/${config.candidateId}`;

export class MapClient implements IMapClient {
	private apiClient: ApiClient;
	private polyanetsClient: PolyanetsClient;
	constructor() {
		this.apiClient = new ApiClient(config.baseApiUrl);
		this.polyanetsClient = new PolyanetsClient();
	}

	async getGoal(): Promise<GoalResponse> {
		const url = `${MAP_CANDIDATE_ID_ENDPOINT}/goal`;
		const response = await this.apiClient.makeRequest(url, {
			method: "GET",
		});
		return GoalResponseSchema.parse(response);
	}

	async getMap(): Promise<MapContent> {
		const url = MAP_CANDIDATE_ID_ENDPOINT;
		const response = await this.apiClient.makeRequest(url, {
			method: "GET",
		});
		return MapResponseSchema.parse(response).map.content;
	}

	async clearMap() {
		const currentMap = await this.getMap();
		const astrals = getAstralsOnMap(currentMap);
		for (const astral of astrals) {
			await this.apiClient.waitForRateLimit();
			await this.polyanetsClient.removePolyanet({
				row: astral.row,
				column: astral.column,
			});
		}
		return await this.getMap();
	}

	async fillMissingPlaces(missingPlaces: AstralAction[]) {
		const total = missingPlaces.length;

		for (let i = 0; i < missingPlaces.length; i++) {
			const place = missingPlaces[i];
			const remaining = total - (i + 1);
			console.log(`Planets remaining to place: ${remaining}`);
			await this.apiClient.waitForRateLimit();
			if (place.action === "delete") {
				this.polyanetsClient.removePolyanet({
					row: place.row,
					column: place.column,
				});
			} else {
				this.polyanetsClient.placePolyanet({
					row: place.row,
					column: place.column,
				});
			}
		}
	}

	async completeGoal() {
		const goalResponse = await this.getGoal();
		const mapResponse = await this.getMap();
		if (goalResponse === null && mapResponse === null) {
			throw new Error("Something went wrong while checking goal");
		}
		const missingPlaces = getAstralMismatch(mapResponse, goalResponse.goal);

		this.fillMissingPlaces(missingPlaces);

		const result = await this.getMap();
		const remainingMissing = getAstralMismatch(result, goalResponse.goal);

		if (remainingMissing.length === 0) {
			console.log("Goal completed successfully!");
		} else {
			let attempt = 1;
			let stillMissing = remainingMissing;
			while (stillMissing.length > 0 && attempt < config.maxAttempts) {
				console.log(
					`Attempt ${attempt}: ${stillMissing.length} positions don't match the goal. Retrying...`,
				);
				await this.fillMissingPlaces(stillMissing);
				const latestMap = await this.getMap();
				stillMissing = getAstralMismatch(latestMap, goalResponse.goal);
				attempt++;
			}
			if (stillMissing.length > 0) {
				console.log(
					`After ${config.maxAttempts} attempts something wen't wrong try later`,
				);
			}
		}

		return remainingMissing;
	}
}
