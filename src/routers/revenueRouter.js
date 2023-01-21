import { Router } from "express";
import revenueSchema from "../schemas/revenueSchema.js";
import validateSchema from "../middlewares/schemasValidator.js";
import { createRevenue, getRevenue } from "../controllers/revenueController.js";
import tokenValidator from "../middlewares/tokenValidator.js";

const route = Router();

route.post(
  "/revenues",
  validateSchema(revenueSchema),
  tokenValidator,
  createRevenue
);
route.get("/revenues", tokenValidator, getRevenue);

export default route;
