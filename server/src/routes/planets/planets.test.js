const req = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Planets API", () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe("Test GET /planets", () => {
		test("It should respond with status 200", async () => {
			const res = await req(app)
				.get("/v1/planets")
				.expect("Content-Type", /json/)
				.expect(200);
		});
	});
});
