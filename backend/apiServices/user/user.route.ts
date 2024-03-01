import express from "express";
import {
	createUserController,
	getSessionUserController,
	getUserImageController,
	loginController,
	updateUserController,
} from "./user.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createUserSchema from "./validationSchemas/createUserSchema.js";
import loginSchema from "./validationSchemas/loginSchema.js";
import ensureAuth from "../../middlewares/ensureAuth.js";
import updateUserSchema from "./validationSchemas/updateUserSchema.js";
import multerMiddleware from "../../middlewares/multerMiddleware.js";
import uploadImage from "../../services/uploadFiles/uploadImage.js";
const userRouter = express.Router();

userRouter.post("/", multerMiddleware(uploadImage.single("photo")), validateBody(createUserSchema), createUserController);
userRouter.post("/login", validateBody(loginSchema), loginController);
userRouter.patch("/", ensureAuth, validateBody(updateUserSchema), updateUserController);
userRouter.get("/:idUser", getSessionUserController);
userRouter.get("/:idUser/image", getUserImageController);
export default userRouter;
