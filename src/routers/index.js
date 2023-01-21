import { Router } from "express";
import userRouter from "./userRouter.js";
import revenueRouter from "./revenueRouter.js";

const route = Router();

route.use(userRouter);
route.use(revenueRouter);

export default route;
