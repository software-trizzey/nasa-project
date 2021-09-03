const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

//TODO: NOTE THIS SHOULD FAIL BECAUSE THE TARGET PLANET DOESNT EXIST
const launch = {
	flightNumber: 100, // flight_number
	mission: "Kepler Exploration X", // name
	rocket: "Explorer IS1", // rocket.name
	launchDate: new Date("December 27, 2030"), // date_local
	target: "Kepler-442 b", // not applicable
	customers: ["NASA", "ZTM"], // payload.customers for each payload
	upcoming: true, // upcoming
	success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// Make request against SpaceX api
async function populateLaunches() {
	console.log("Downloading launch data...");
	const res = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payload",
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	const launchDocs = res.data.docs;
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		const customers = payloads.flatMap((payload) => payload["customers"]);

		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDAte: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers,
		};
		console.log(`${launch.flightNumber} ${launch.mission}`);
		await saveLaunch(launch);
	}
}

async function loadLaunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});

	if (firstLaunch) {
		console.log("Launch data already loaded");
		return;
	} else {
		await populateLaunches();
	}
}

async function findLaunch(filter) {
	return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
	return await findLaunch({
		fligntNumber: launchId,
	});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber"); // flightnumber in desc

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}
async function getAllLaunches() {
	// TODO: Fix issue with vs code editer auto correct
	return await launchesDatabase.find(
		{},
		{
			_id: 0,
			__v: 0,
		}
	);
}

async function saveLaunch(launch) {
	await launchesDatabase.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{
			upsert: true,
		}
	);
}

async function sheduleNewLaunch(launch) {
	const planet = planets.findOne({
		keplerName: launch.target,
	});
	if (!planet) {
		throw new Error("No matching planet was found!");
	}

	const newFlightNumber = (await getLatestFlightNumber()) + 1;

	const newLaunch = Object.assign(launch, {
		upcoming: true,
		success: true,
		customers: ["NASA", "ZTM"],
		flightNumber: newFlightNumber,
	});
	await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	);

	return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
	loadLaunchData,
	existsLaunchWithId,
	getAllLaunches,
	sheduleNewLaunch,
	abortLaunchById,
};
