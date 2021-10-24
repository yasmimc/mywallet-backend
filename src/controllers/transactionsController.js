import connection from "../connection.js";
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
                "transactionsTypes".name as "type"
            FROM sessions 
            JOIN transactions 
                ON sessions."userId" = transactions."userId" 
            JOIN "transactionsTypes"
                ON transactions.type = "transactionsTypes".id
            WHERE token = $1;
            `,
			[resp.token]
		);
		res.status(200).send(transactions.rows);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function setTransaction(req, res) {
	try {
		const resp = await validateToken(req);
		if (resp.error) {
			res.sendStatus(token.error);
			return;
		}
		const token = resp.token;

		const validation = transactionsSchema.validate(req.body);
		if (validation.error) {
			res.sendStatus(400);
			return;
		}

		const { value, type } = req.body;

		const realValue = type === 1 ? value : -value;

		await connection.query(
			`
            INSERT INTO transactions ("userId", value, type) 
            VALUES ($1, $2, $3);`,
			[resp.userId, realValue, type]
		);

		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export { getTransactions, setTransaction };
