import cors from "cors";
import express, { json } from "express";
import chalk from "chalk";
import route from "./routers/index.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(json());
app.use(route);

app.listen(PORT, () =>
  console.log(chalk.bold.blue(`Server running on port: ${PORT}`))
);
