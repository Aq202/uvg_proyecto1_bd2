import express from "express";
import {
	createUserController,
	getSessionUserController,
	loginController,
	updateUserController,
} from "./user.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createUserSchema from "./validationSchemas/createUserSchema.js";
import loginSchema from "./validationSchemas/loginSchema.js";
import ensureAuth from "../../middlewares/ensureAuth.js";
import updateUserSchema from "./validationSchemas/updateUserSchema.js";
const userRouter = express.Router();

userRouter.post("/", validateBody(createUserSchema), createUserController);
userRouter.post("/login", validateBody(loginSchema), loginController);
userRouter.patch("/", ensureAuth, validateBody(updateUserSchema), updateUserController);
userRouter.get("/", ensureAuth, getSessionUserController);

export default userRouter;
