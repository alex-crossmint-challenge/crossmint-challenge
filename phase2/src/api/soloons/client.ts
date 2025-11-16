import { config } from "../../config";
import type { AstralInput, SoloonsInput } from "../../schemas/astral.schema";
import { ApiClient } from "..";
import { AstralClient } from "../astral/client";
import type { ISoloonsClient } from "../interfaces";

export class SoloonsClient extends AstralClient implements ISoloonsClient {
	constructor(apiClient?: ApiClient) {
		super(
			apiClient ?? new ApiClient(config.baseApiUrl),
			config.soloonsApiEndpoint,
			config.candidateId,
		);
	}

	async placeSoloon(input: SoloonsInput): Promise<unknown> {
		return this.place(input);
	}

	async removeSoloon(input: AstralInput): Promise<unknown> {
		return this.remove(input);
	}
}
