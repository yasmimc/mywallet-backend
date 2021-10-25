import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";

describe("POST /sign-up", () => {
	afterAll(async () => {
		await connection.query(`DELETE FROM users`);
	});

	afterEach(async () => {
		await connection.query(`INSERT INTO users (name, email, password)
		VALUES ('Nome', 'email@email.com', '123qweASD@');`);
	});

	it("returns 201 for new user with valid params", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(201);
	});

	it("returns 409 for existent user", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(409);
	});

	it("returns 400 for invalid user", async () => {
		const body = {
			name: "Nome",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(400);
	});
});

describe("POST /sign-in", () => {
	beforeAll(async () => {
		await connection.query(`DELETE FROM users`);
		await connection.query(`DELETE FROM sessions`);
		await connection.query(`INSERT INTO users (name, email, password)
		VALUES ('Nome', 'email@email.com', '$2b$10$MVJslBMOQVhjPiw/HX1gGO8cr3dyYukWkRS53V6acs9ohcVoru0OC');`);
	});

	it("returns 200 for successed loggin", async () => {
		const body = {
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-in").send(body);
		const status = result.statusCode;
		const resp = result.body;

		expect(status).toEqual(200);
		expect(resp).toHaveProperty("token");
	});

	it("returns 404 for non existent user", async () => {
		const body = {
			email: "emaillll@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-in").send(body);
		const status = result.statusCode;

		expect(status).toEqual(404);
	});

	it("returns 401 for wrong password", async () => {
		const body = {
			email: "email@email.com",
			password: "12345",
		};

		const result = await supertest(app).post("/sign-in").send(body);
		const status = result.statusCode;

		expect(status).toEqual(401);
	});
});

afterAll(() => {
	connection.end();
});
