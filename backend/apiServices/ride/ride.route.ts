import express from "express";
import ensureAuth from "../../middlewares/ensureAuth.js";
import {
	assignUserToRideController,
	createRideController,
	getRidesController,
	removeUserFromRideController,
} from "./ride.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import createRideSchema from "./validationSchemas/createRideSchema.js";

const rideRouter = express.Router();

rideRouter.post("/", ensureAuth, validateBody(createRideSchema), createRideController);
rideRouter.get("/", ensureAuth, getRidesController);
rideRouter.post("/:idRide/assign", ensureAuth, assignUserToRideController);
rideRouter.delete("/:idRide/assignment", ensureAuth, removeUserFromRideController);

export default rideRouter;