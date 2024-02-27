import RideSchema from "../../db/schemas/ride.schema.js";
import { createRideDto } from "./ride.dto.js";
const createRide = async ({ idStartLocation, idArrivalLocation, user, datetime, vehicle, }) => {
    const ride = new RideSchema();
    ride.startLocation = idStartLocation;
    ride.arrivalLocation = idArrivalLocation;
    ride.user = Object.assign({ _id: user.id }, user);
    ride.datetime = datetime;
    ride.vehicle = vehicle;
    await ride.save();
    return createRideDto(ride);
};
export { createRide };
