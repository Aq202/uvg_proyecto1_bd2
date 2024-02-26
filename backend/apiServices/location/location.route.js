import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import validateBody from "../../middlewares/validateBody.js";
import createLocationSchema from "./validationSchemas/createLocationSchema.js";
import { createLocationController } from "./location.controller.js";
const locationRouter = express.Router();
locationRouter.post("", ensureAuth, validateBody(createLocationSchema), createLocationController);
export default locationRouter;
