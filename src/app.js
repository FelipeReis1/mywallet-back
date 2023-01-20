import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import chalk from "chalk";
import joi from "joi";
import bcrypt from "bcrypt";

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

app.post("/sign-up", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  });
  const signUpValidation = signUpSchema.validate(
    { name, email, password, confirmPassword },
    { abortEarly: false }
  );
  if (signUpValidation.error) {
    const errors = signUpValidation.details.map((r) => r.message);
    return res.status(422).send(errors);
  }

  try {
    const user = await db.collection("users").findOne({ email });
    if (user) {
      return res.status(409).send("Usuário já registrado!");
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({
      name,
      email,
      password: encryptedPassword,
      confirmPassword: encryptedPassword,
    });
    res.status(201).send("Usuário registrado com sucesso!");
  } catch (error) {}
});

app.listen(PORT, () =>
  console.log(chalk.bold.blue(`Server running on port: ${PORT}`))
);
