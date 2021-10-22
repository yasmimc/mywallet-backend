import express from "express";
import { signUp, signIn } from "./controllers/usersController.js";

const app = express();
app.use(express.json());

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

export default app;
