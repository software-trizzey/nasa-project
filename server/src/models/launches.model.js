const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

//TODO: NOTE THIS SHOULD FAIL BECAUSE THE TARGET PLANET DOESNT EXIST
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

async function existsLaunchWithId(launchId) {
	return await launchesDatabase.findOne({
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
			id: 0,
			v: 0,
		}
	);
}

async function saveLaunch(launch) {
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
	existsLaunchWithId,
	getAllLaunches,
	sheduleNewLaunch,
	abortLaunchById,
};
