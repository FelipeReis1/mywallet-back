import db from "../databases/database.js";
import dayjs from "dayjs";

export async function createRevenue(req, res) {
  const { value, description, type } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  try {
    const userSession = await db.collection("sessions").findOne({ token });
    if (!userSession) {
      return res
        .status(401)
        .send("Você não tem autorização para inserir um novo registro!");
    }
    await db.collection("revenues").insertOne({
      userId: userSession._id,
      date: dayjs().format("DD/MM"),
      value,
      description,
      type,
    });
    return res.status(201).send("Novo registro inserido com sucesso!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getRevenue(_, res) {
  try {
    const token = res.locals.token;
    const userSession = await db.collection("sessions").findOne({ token });
    if (!userSession) {
      return res
        .status(401)
        .send("Você não tem autorização para verificar registros!");
    }
    const revenues = await db
      .collection("revenues")
      .find({ userId: userSession._id })
      .toArray();
    return res.send(revenues);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
