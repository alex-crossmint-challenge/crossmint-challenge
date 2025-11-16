import { config } from "../../config";
import type { AstralInput, ComethsInput } from "../../schemas/astral.schema";
import { ApiClient } from "..";
import { AstralClient } from "../astral/client";
import type { IComethsClient } from "../interfaces";

export class ComethsClient extends AstralClient implements IComethsClient {
	constructor(apiClient?: ApiClient) {
		super(
			apiClient ?? new ApiClient(config.baseApiUrl),
			config.comethsApiEndpoint,
			config.candidateId,
		);
	}

	async placeCometh(input: ComethsInput): Promise<unknown> {
		return this.place(input);
	}

	async removeCometh(input: AstralInput): Promise<unknown> {
		return this.remove(input);
	}
}
