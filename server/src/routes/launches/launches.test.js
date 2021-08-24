const req = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
	test("It should respond with 200 success", async () => {
		const res = await req(app)
			.get("/launches")
			.expect("Content-Type", /json/)
			.expect(200);
	});
});

describe("Test POST /launch", () => {
	const completeLaunchData = {
		mission: "USS Enterprise",
		rocket: "NCC 1701-D",
		target: "Kepler-186",
		launchDate: "January 4, 2028",
	};

	const launchDataWithoutDate = {
		mission: "USS Enterprise",
		rocket: "NCC 1701-D",
		target: "Kepler-186",
	};

	const launchDataWithInvalidDate = {
		mission: "USS Enterprise",
		rocket: "NCC 1701-D",
		target: "Kepler-186",
		launchDate: "Noot Noot!",
	};

	test("It should respond with 201 created", async () => {
		const res = await req(app)
			.post("/launches")
			.send(completeLaunchData)
			.expect("Content-Type", /json/)
			.expect(201);

		const requestDate = new Date(completeLaunchData.launchDate).valueOf();
		const responseDate = new Date(res.body.launchDate).valueOf();
		expect(responseDate).toBe(requestDate);

		expect(res.body).toMatchObject(launchDataWithoutDate);
	});

	test("It should catch missing required properties", async () => {
		const res = await req(app)
			.post("/launches")
			.send(launchDataWithoutDate)
			.expect("Content-Type", /json/)
			.expect(400);

		expect(res.body).toStrictEqual({
			error: "Missing required launch property.",
		});
	});
	test("It should catch invalid dates", async () => {
		const res = await req(app)
			.post("/launches")
			.send(launchDataWithInvalidDate)
			.expect("Content-Type", /json/)
			.expect(400);

		expect(res.body).toStrictEqual({
			error: "Invalid launch date",
		});
	});
});
