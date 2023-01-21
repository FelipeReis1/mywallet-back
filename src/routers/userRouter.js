import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController.js";
import validateSchema from "../middlewares/schemasValidator.js";
import signInSchema from "../schemas/signInSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const route = Router();

route.post("/sign-in", validateSchema(signInSchema), loginUser);
route.post("/sign-up", validateSchema(signUpSchema), createUser);

export default route;
