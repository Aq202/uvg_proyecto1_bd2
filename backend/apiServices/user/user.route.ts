import express from "express";
import { createUserController, loginController } from "./user.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createUserSchema from "./validationSchemas/createUserSchema.js";
import loginSchema from "./validationSchemas/loginSchema.js";
const userRouter = express.Router();

userRouter.post("/", validateBody(createUserSchema), createUserController);
userRouter.post("/login", validateBody(loginSchema), loginController)

export default userRouter;
