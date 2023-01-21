import db from "../databases/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function createUser(req, res) {
  const { name, email, password } = req.body;

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
    return res.status(500).send(error.message);
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send("Email ou senha inválidos");
    }
    const token = uuidV4();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
