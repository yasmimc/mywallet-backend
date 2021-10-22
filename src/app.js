import express from "express";
import { signUp } from "./controllers/signUp.js";

const app = express();
app.use(express.json());

app.post("/sign-up", signUp);
app.listen(4000);
