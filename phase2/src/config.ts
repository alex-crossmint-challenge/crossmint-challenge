import type { MapClient } from "./api/map/client";
import ConfigSchema from "./schemas/config.schema";

export class Config {
	private _baseApiUrl: string;
	private _polyanetApiEndpoint: string;
	private _mapApiEndpoint: string;
	private _soloonsApiEndpoint: string;
	private _comethsApiEndpoint: string;
	private _candidateId: string;
	private _shapeSize?: number;
	private _maxAttempts: number;
	private _requestTimeout: number;
	constructor() {
		const parsed = ConfigSchema().parse({
			baseApiUrl: "https://challenge.crossmint.io/api",
			polyanetApiEndpoint: "polyanets",
			soloonsApiEndpoint: "soloons",
			comethsApiEndpoint: "comeths",
			mapApiEndpoint: "map",
			candidateId: process.env.CANDIDATE_ID,
			shapeSize: undefined,
			maxAttempts: 3,
			requestTimeout: 3000,
		});

		this._baseApiUrl = parsed.baseApiUrl;
		this._polyanetApiEndpoint = parsed.polyanetApiEndpoint;
		this._mapApiEndpoint = parsed.mapApiEndpoint;
		this._candidateId = parsed.candidateId;
		this._shapeSize = parsed.shapeSize;
		this._soloonsApiEndpoint = parsed.soloonsApiEndpoint;
		this._comethsApiEndpoint = parsed.comethsApiEndpoint;
		this._maxAttempts = parsed.maxAttempts;
		this._requestTimeout = parsed.requestTimeout;
	}

	async initConfig(mapClient: MapClient): Promise<void> {
		const map = await mapClient.getMap();
		this._shapeSize = map.length;
	}

	get baseApiUrl(): string {
		return this._baseApiUrl;
	}

	get polyanetApiEndpoint(): string {
		return this._polyanetApiEndpoint;
	}

	get soloonsApiEndpoint(): string {
		return this._soloonsApiEndpoint;
	}

	get comethsApiEndpoint(): string {
		return this._comethsApiEndpoint;
	}

	get mapApiEndpoint(): string {
		return this._mapApiEndpoint;
	}

	get candidateId(): string {
		return this._candidateId;
	}

	get shapeSize(): number | undefined {
		return this._shapeSize;
	}

	get maxAttempts(): number {
		return this._maxAttempts;
	}

	get requestTimeout(): number {
		return this._requestTimeout;
	}
}

export const config = new Config();
