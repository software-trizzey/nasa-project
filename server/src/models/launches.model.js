const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration X",
	rocket: "Explorer IS1",
	launchDate: new Date("December 27, 2030"),
	target: "Tt",
	customers: ["NASA", "ZTM"],
	upcoming: true,
	success: true,
};

saveLaunch(launch);

// launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
	return launches.has(launchId);
}

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber"); // flightnumber in desc

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}
async function getAllLaunches() {
	return await launchesDatabase.find(
		{},
		{
			id: 0,
			v: 0,
		}
	);
}

async function saveLaunch(launch) {
	// TODO: Fix issue with vs code editer auto correct
	const planet = planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error("No matching planet was found!");
	}

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
	const newFlightNumber = (await getLatestFlightNumber()) + 1;

	const newLaunch = Object.assign(launch, {
		upcoming: true,
		success: true,
		customers: ["NASA", "ZTM"],
		flightNumber: newFlightNumber,
	});
	await saveLaunch(newLaunch);
}

function abortLaunchById(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;
	return aborted;
}

module.exports = {
	existsLaunchWithId,
	getAllLaunches,
	sheduleNewLaunch,
	abortLaunchById,
};
