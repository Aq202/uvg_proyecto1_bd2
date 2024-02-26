import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import validateBody from "../../middlewares/validateBody.js";
import createLocationSchema from "./validationSchemas/createLocationSchema.js";
import { createLocationController, updateLocationController } from "./location.controller.js";
import updateLocationSchema from "./validationSchemas/updateLocationSchema.js";

const locationRouter = express.Router();

locationRouter.post("", ensureAuth, validateBody(createLocationSchema), createLocationController);
locationRouter.patch("", ensureAuth, validateBody(updateLocationSchema), updateLocationController);

export default locationRouter;
