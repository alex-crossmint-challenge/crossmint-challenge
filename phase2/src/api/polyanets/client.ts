import { config } from "../../config";
import type { AstralInput } from "../../schemas/astral.schema";
import { ApiClient } from "..";
import { AstralClient } from "../astral/client";
import type { IPolyanetsClient } from "../interfaces";

export class PolyanetsClient extends AstralClient implements IPolyanetsClient {
	constructor(apiClient?: ApiClient) {
		super(
			apiClient ?? new ApiClient(config.baseApiUrl),
			config.polyanetApiEndpoint,
			config.candidateId,
		);
	}

	async placePolyanet(input: AstralInput): Promise<unknown> {
		return this.place(input);
	}

	async removePolyanet(input: AstralInput): Promise<unknown> {
		return this.remove(input);
	}
}
