import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { MapClient } from "./api/map/client";
import { config } from "./config";
import { crossmintAsciiLogo } from "./utils/ascii";

async function main() {
	const argv = await yargs(hideBin(process.argv))
		.option("reset", {
			type: "boolean",
			describe: "Clear the map",
			default: false,
		})
		.parse();

	const map = new MapClient();
	await config.initConfig(map);

	if (argv.reset) {
		console.log("Clearing map, wait a minute!");
		await map.clearMap();
		console.log("Map cleared!");
	} else {
		console.log(crossmintAsciiLogo);
		console.log(`Crossmint Challenge - Candidate ID: ${config.candidateId}`);
		await map.completeGoal();
	}
}

main().catch((error) => {
	console.error(
		"Something went wrong while trying to execute the main function: ",
		error,
	);
});
