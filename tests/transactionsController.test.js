import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";

describe("GET /transactions", () => {
	afterAll(async () => {
		await connection.query(`DELETE FROM sessions`);
		await connection.query(`DELETE FROM users`);
		await connection.query(`DELETE FROM transactions`);
	});

	const token = "53164764-b457-4e36-bd41-89d9d7a7a7cd";

	afterEach(async () => {
		await connection.query(`INSERT INTO users (name, email, password)
		VALUES ('Nome', 'email@email.com', '$2b$10$MVJslBMOQVhjPiw/HX1gGO8cr3dyYukWkRS53V6acs9ohcVoru0OC');`);
		const user = await connection.query(
			`SELECT id FROM users WHERE email = 'email@email.com';`
		);
		const userId = user?.rows[0]?.id;
		await connection.query(
			`INSERT INTO sessions ("userId", token)
		        VALUES ($1, $2);`,
			[userId, token]
		);
	});

	it("returns 401 when session doesn't exists", async () => {
		const result = await supertest(app)
			.get("/transactions")
			.set("Authorization", `Bearer ${token}`);
		const status = result.status;
		const resp = result.body;
		expect(status).toEqual(401);
	});

	it("returns 200 and user transactions when session exists", async () => {
		const result = await supertest(app)
			.get("/transactions")
			.set("Authorization", `Bearer ${token}`);
		const status = result.status;
		const resp = result.body;
		expect(status).toEqual(200);
	});
});
