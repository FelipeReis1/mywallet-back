import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
const db = mongoClient.db();

try {
  await mongoClient.connect();
  console.log("Connected Successfully");
} catch (error) {
  console.log(`Something went wrong ${error.message}`);
}
export default db;
