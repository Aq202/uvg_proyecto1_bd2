import { createMultipleUsersDto, createUserDto } from "../user/user.dto.js";

const createRideDto = (resource: any): Ride => {
	const { startLocation, arrivalLocation, user, passengers, completed, datetime, vehicle } =
		resource?._doc ?? resource;
	return {
		id: resource?._id?.valueOf() ?? resource.id,
		startLocation,
		arrivalLocation,
		user: createUserDto(user),
		passengers: passengers ? createMultipleUsersDto(passengers) : [],
		completed: completed,
		datetime,
		vehicle,
	};
};

const createMultipleRidesDto = (resources: [any]) =>
	resources?.map((resource) => createRideDto(resource));

export { createRideDto, createMultipleRidesDto };
