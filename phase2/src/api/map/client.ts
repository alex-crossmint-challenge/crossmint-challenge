import { config } from "../../config";
import { getComethDirection, getSoloonColor } from "../../constants";
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
import { ComethsClient } from "../cometh/client";
import type { IMapClient } from "../interfaces";
import { PolyanetsClient } from "../polyanets/client";
import { SoloonsClient } from "../soloons/client";

const MAP_CANDIDATE_ID_ENDPOINT = `${config.mapApiEndpoint}/${config.candidateId}`;

export class MapClient implements IMapClient {
	private apiClient: ApiClient;
	private polyanetsClient: PolyanetsClient;
	private soloonsClient: SoloonsClient;
	private comethsClient: ComethsClient;
	constructor() {
		this.apiClient = new ApiClient(config.baseApiUrl);
		this.polyanetsClient = new PolyanetsClient(this.apiClient);
		this.soloonsClient = new SoloonsClient(this.apiClient);
		this.comethsClient = new ComethsClient(this.apiClient);
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
				await this.removeAstral(place);
			} else {
				await this.placeAstral(place);
			}
		}
	}

	private async removeAstral(place: AstralAction): Promise<void> {
		const position = { row: place.row, column: place.column };

		if (place.typeCurrent?.includes("POLYANET")) {
			await this.polyanetsClient.removePolyanet(position);
		} else if (place.typeCurrent?.includes("SOLOON")) {
			await this.soloonsClient.removeSoloon(position);
		} else if (place.typeCurrent?.includes("COMETH")) {
			await this.comethsClient.removeCometh(position);
		}
	}

	private async placeAstral(place: AstralAction): Promise<void> {
		const position = { row: place.row, column: place.column };

		if (place.typeGoal === "POLYANET") {
			await this.polyanetsClient.placePolyanet(position);
		} else if (
			place.typeGoal !== "SPACE" &&
			place.typeGoal.includes("SOLOON")
		) {
			const color = getSoloonColor(place.typeGoal);
			if (color) {
				await this.soloonsClient.placeSoloon({ ...position, color });
			}
		} else if (
			place.typeGoal !== "SPACE" &&
			place.typeGoal.includes("COMETH")
		) {
			const direction = getComethDirection(place.typeGoal);
			if (direction) {
				await this.comethsClient.placeCometh({ ...position, direction });
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

		await this.fillMissingPlaces(missingPlaces);

		const result = await this.getMap();
		const remainingMissing = getAstralMismatch(result, goalResponse.goal);

		if (remainingMissing.length === 0) {
			console.log("Goal completed successfully!");
		} else {
			let attempt = 1;
			let stillMissing = remainingMissing;
			while (stillMissing.length > 0 && attempt < config.maxAttempts) {
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
