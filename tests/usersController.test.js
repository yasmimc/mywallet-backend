import app from "../src/app.js";
import express from "express";
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
		const status = result.statusCode;

		expect(status).toEqual(201);
	});

	it("returns 409 for existent user", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123456",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.statusCode;

		expect(status).toEqual(409);
	});
});

afterAll(() => {
	connection.end();
});
