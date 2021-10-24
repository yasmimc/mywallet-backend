import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/connection.js";

describe("POST /sign-up", () => {
	beforeAll(async () => {
		await connection.query(`DELETE FROM users`);
	});

	afterEach(async () => {
		await connection.query(`INSERT INTO users (name, email, password)
		VALUES ('Nome', 'email@email.com', '123456');`);
	});

	it("returns 201 for new user with valid params", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123456",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(201);
	});

	it("returns 409 for existent user", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123456",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(409);
	});
});

describe("POST /sign-in", () => {
	beforeAll(async () => {
		await connection.query(`DELETE FROM users`);
		await connection.query(`DELETE FROM sessions`);
		await connection.query(`INSERT INTO users (name, email, password)
		VALUES ('Nome', 'email@email.com', '$2b$10$5x6Ofe5c9rViKgZGVAONHOsUUivKUft6uKwtT1lUBw8jVHjtxpCk6');`);
	});

	it("returns 200 for successed loggin", async () => {
		const body = {
			email: "email@email.com",
			password: "123456",
		};

		const result = await supertest(app).post("/sign-in").send(body);
		console.log(result.text);
		const status = result.statusCode;
		const resp = result.text;

		expect(status).toEqual(200);
		// expect(resp).toHaveProperty("token");
	});

	it("returns 404 for non existent user", async () => {
		const body = {
			email: "emaillll@email.com",
			password: "123456",
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
