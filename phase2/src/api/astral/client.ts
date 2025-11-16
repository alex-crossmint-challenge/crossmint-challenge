import type { AstralInput } from "../../schemas/astral.schema";
import type { ApiClient } from "..";
import type { IAstralClient } from "../interfaces";

export class AstralClient implements IAstralClient {
	constructor(
		private readonly apiClient: ApiClient,
		private readonly endpoint: string,
		private readonly candidateId: string,
	) {}

	async place(input: AstralInput): Promise<unknown> {
		const response = await this.apiClient.makeRequest(this.endpoint, {
			method: "POST",
			body: JSON.stringify({ ...input, candidateId: this.candidateId }),
		});
		return response;
	}

	async remove(input: AstralInput): Promise<unknown> {
		const response = await this.apiClient.makeRequest(this.endpoint, {
			method: "DELETE",
			body: JSON.stringify({ ...input, candidateId: this.candidateId }),
		});
		return response;
	}
}
