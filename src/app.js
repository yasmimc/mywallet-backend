import express from "express";
import cors from "cors";
import {
	getTransactions,
	setTransaction,
} from "./controllers/transactionsController.js";
import { signUp, signIn } from "./controllers/usersController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);
app.get("/transactions", getTransactions);
app.post("/transactions", setTransaction);

export default app;
