import RideSchema from "../../db/schemas/ride.schema.js";
import { createRideDto } from "./ride.dto.js";

const createRide = async ({
	idStartLocation,
	idArrivalLocation,
	user,
	datetime,
	vehicle,
}: {
	idStartLocation: string;
	idArrivalLocation: string;
	user: User;
	datetime: Date;
	vehicle: Vehicle;
}) => {
	const ride = new RideSchema();

	ride.startLocation = idStartLocation as any;
	ride.arrivalLocation = idArrivalLocation as any;
	ride.user = { _id: user.id as any, ...user };
	ride.datetime = datetime;
	ride.vehicle = vehicle;

	await ride.save();

	return createRideDto(ride);
};

export { createRide };
