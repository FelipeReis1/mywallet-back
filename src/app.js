import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import chalk from "chalk";

const PORT = 5000;
const app = express();
dotenv.config();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
const db = mongoClient.db();

try {
  await mongoClient.connect();
  console.log("Connected Successfully");
} catch (err) {
  console.log(`Something went wrong ${err.message}`);
}

app.listen(PORT, () =>
  console.log(chalk.bold.blue(`Server running on port: ${PORT}`))
);
