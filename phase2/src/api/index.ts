import { config } from "../config";
import type { IApiClient } from "./interfaces";

export class ApiClient implements IApiClient {
	constructor(private readonly baseApiUrl: string) {}

	async makeRequest(url: string, options: RequestInit): Promise<Response> {
		options.headers = {
			"Content-Type": "application/json",
			...options.headers,
		};
		const response = await fetch(`${this.baseApiUrl}/${url}`, options);
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Failed to make request to ${url}: ${response.statusText} | Reason: ${errorText}`,
			);
		}
		return response.json();
	}

	async waitForRateLimit(): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, config.requestTimeout));
	}
}

export const apiClient = new ApiClient(config.baseApiUrl);
