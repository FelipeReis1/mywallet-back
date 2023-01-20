import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import chalk from "chalk";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

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
} catch (error) {
  console.log(`Something went wrong ${error.message}`);
}

app.post("/sign-up", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  });
  const { error } = signUpSchema.validate(
    { name, email, password, confirmPassword },
    { abortEarly: false }
  );

  if (error) {
    const errors = error.details.map((s) => s.message);
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
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = signInSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (error) {
    const errors = error.details.map((s) => s.message);
    return res.status(422).send(errors);
  }
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send("Email ou senha inválidos");
    }
    const token = uuidV4();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.status(200).send(token);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(PORT, () =>
  console.log(chalk.bold.blue(`Server running on port: ${PORT}`))
);
