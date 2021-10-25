import connection from "../database/connection.js";
import usersSchema from "../validations/users.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function signUp(req, res) {
	try {
		const newUser = req.body;

		const validation = usersSchema.validate(newUser);
		if (validation.error) {
			console.log(validation.error);
			res.sendStatus(400);
			return;
		}

		const { name, email, password } = newUser;

		if (await userAlredyExists(email)) {
			res.sendStatus(409);
			return;
		}

		const passwordHash = bcrypt.hashSync(password, 10);
		await connection.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, passwordHash]
		);
		res.sendStatus(201);
	} catch (error) {
		console.log(error.message);
		res.sendStatus(500);
	}
}

async function signIn(req, res) {
	try {
		const { email, password } = req.body;

		const result = await connection.query(
			`SELECT * FROM users WHERE email = $1`,
			[email]
		);

		const user = result.rows[0];

		if (!user) {
			res.status(404).send({});

			return;
		}

		if (!bcrypt.compareSync(password, user.password)) {
			res.status(401).send({});
			return;
		}

		const token = uuid();
		await connection.query(
			`INSERT INTO sessions ("userId", token) 
				VALUES ($1, $2)`,
			[user.id, token]
		);

		res.status(200).send({
			user: {
				name: user.name,
				id: user.id,
			},
			token,
		});
		return;
	} catch (error) {
		console.log(error.message);
		res.sendStatus(500);
	}
}

async function userAlredyExists(email) {
	const existentUser = await connection.query(
		`SELECT * FROM users WHERE email = $1;`,
		[email]
	);
	if (existentUser.rowCount !== 0) return existentUser.rows;
	return false;
}

export { signUp, signIn };
