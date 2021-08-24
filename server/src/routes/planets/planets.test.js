const req = require("supertest");
const app = require("../../app");

describe("Test GET /planets", () => {
	test("It should respond with status 200", async () => {
		const res = await req(app)
			.get("/planets")
			.expect("Content-Type", /json/)
			.expect(200);
	});
});
