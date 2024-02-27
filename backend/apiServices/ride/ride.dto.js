import { createMultipleUsersDto, createUserDto } from "../user/user.dto.js";
const createRideDto = (resource) => {
    var _a, _b, _c;
    const { startLocation, arrivalLocation, user, passengers, completed, datetime, vehicle } = (_a = resource === null || resource === void 0 ? void 0 : resource._doc) !== null && _a !== void 0 ? _a : resource;
    return {
        id: (_c = (_b = resource === null || resource === void 0 ? void 0 : resource._id) === null || _b === void 0 ? void 0 : _b.valueOf()) !== null && _c !== void 0 ? _c : resource.id,
        startLocation,
        arrivalLocation,
        user: createUserDto(user),
        passengers: passengers ? createMultipleUsersDto(passengers) : [],
        completed: completed,
        datetime,
        vehicle,
    };
};
const createMultipleRidesDto = (resources) => resources === null || resources === void 0 ? void 0 : resources.map((resource) => createRideDto(resource));
export { createRideDto, createMultipleRidesDto };
