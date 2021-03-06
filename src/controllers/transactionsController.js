import connection from "../database/connection.js";
import transactionsSchema from "../validations/transactions.js";

async function validateToken(req) {
	const token = req.headers["authorization"]?.replace("Bearer ", "");
	const resp = {
		token: null,
		userId: null,
		error: null,
	};

	if (!token) {
		return { ...resp, error: 400 };
	}

	const session = await connection.query(
		`SELECT * FROM sessions WHERE token = $1`,
		[token]
	);

	if (!session.rowCount) {
		return { ...resp, token: null, error: 401 };
	}
	const userId = session.rows[0].userId;

	return { ...resp, userId, token };
}

async function getTransactions(req, res) {
	try {
		const resp = await validateToken(req);
		if (resp.error) {
			res.sendStatus(resp.error);
			return;
		}

		const transactions = await connection.query(
			`SELECT 
                transactions.id, 
                transactions.value, 
                transactions.description,
                transactions.date,
                "transactionsTypes".name as "type"
            FROM sessions 
            JOIN transactions 
                ON sessions."userId" = transactions."userId" 
            JOIN "transactionsTypes"
                ON transactions.type = "transactionsTypes".id
            WHERE token = $1
            ORDER BY transactions.id;
            `,
			[resp.token]
		);
		res.status(200).send(transactions.rows);
	} catch (error) {
		console.log(error.message);
		res.sendStatus(500);
	}
}

async function setTransaction(req, res) {
	try {
		const resp = await validateToken(req);
		if (resp.error) {
			res.sendStatus(resp.error);
			return;
		}

		const validation = transactionsSchema.validate(req.body);
		if (validation.error) {
			res.sendStatus(400);
			return;
		}

		const { value, description, type } = req.body;
		const valueInCents = parseFloat(value.replace(",", ""));
		const realValue = type === 1 ? valueInCents : -valueInCents;

		const today = new Date().toISOString();

		await connection.query(
			`
            INSERT INTO transactions ("userId", value, type, description, date) 
            VALUES ($1, $2, $3, $4, $5);`,
			[resp.userId, realValue, type, description, today]
		);

		res.sendStatus(201);
	} catch (error) {
		console.log(error.message);
		res.sendStatus(500);
	}
}

export { getTransactions, setTransaction };
