const req = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe("Test GET /launches", () => {
		test("It should respond with 200 success", async () => {
			await req(app)
				.get("/v1/launches")
				.expect("Content-Type", /json/)
				.expect(200);
		});
	});

	describe("Test POST /launch", () => {
		const completeLaunchData = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "January 4, 2028",
		};

		const launchDataWithoutDate = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
		};

		const launchDataWithInvalidDate = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "Noot Noot!",
		};

		test("It should respond with 201 created", async () => {
			const res = await req(app)
				.post("/v1/launches")
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
				.post("/v1/launches")
				.send(launchDataWithoutDate)
				.expect("Content-Type", /json/)
				.expect(400);
			expect(res.body).toStrictEqual({
				error: "Missing required launch property.",
			});
		});
		test("It should catch invalid dates", async () => {
			const res = await req(app)
				.post("/v1/launches")
				.send(launchDataWithInvalidDate)
				.expect("Content-Type", /json/)
				.expect(400);
			expect(res.body).toStrictEqual({
				error: "Invalid launch date",
			});
		});
	});
});
