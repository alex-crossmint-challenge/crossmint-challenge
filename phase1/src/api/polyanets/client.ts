import { config } from "../../config";
import type { AstralInput } from "../../schemas/astral.schema";
import { ApiClient } from "..";
import type { IPolyanetsClient } from "../interfaces";

export class PolyanetsClient implements IPolyanetsClient {
	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient(config.baseApiUrl);
	}

	async placePolyanet(input: AstralInput) {
		const body = {
			...input,
			candidateId: config.candidateId,
		};
		const response = await this.apiClient.makeRequest(
			`${config.polyanetApiEndpoint}`,
			{
				method: "POST",
				body: JSON.stringify(body),
			},
		);
		return response;
	}

	async removePolyanet(input: AstralInput) {
		const body = {
			...input,
			candidateId: config.candidateId,
		};
		const response = await this.apiClient.makeRequest(
			`${config.polyanetApiEndpoint}`,
			{
				method: "DELETE",
				body: JSON.stringify(body),
			},
		);
		return response;
	}
}
