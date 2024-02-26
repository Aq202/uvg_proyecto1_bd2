import LocationSchema from "../../db/schemas/location.schema.js";
import CustomError from "../../utils/customError.js";
import { someExists } from "../../utils/exists.js";
import { createLocationDto, createMultipleLocationsDto } from "./location.dto.js";
const createLocation = async ({ name, country, city, address, idUser, }) => {
    const location = new LocationSchema();
    location.name = name;
    location.country = country;
    location.city = city;
    location.address = address;
    location.idUser = idUser;
    await location.save();
    return createLocationDto(location);
};
const updateLocation = async ({ id, name, country, city, address, idUser, }) => {
    const location = await LocationSchema.findOne({ _id: id, idUser });
    if (!location)
        throw new CustomError("No se encontró la ubicación.", 404);
    if (name)
        location.name = name;
    if (country)
        location.country = country;
    if (city)
        location.city = city;
    if (address)
        location.address = address;
    if (someExists(name, country, city, address))
        await location.save();
    return createLocationDto(location);
};
const deleteLocation = async ({ id, idUser }) => {
    try {
        const { acknowledged, deletedCount } = await LocationSchema.deleteOne({ _id: id, idUser });
        if (!acknowledged)
            throw new CustomError("Ocurrió un error al eliminar ubicación.", 500);
        if (deletedCount !== 1)
            throw new CustomError("No se encontró la ubicación.", 404);
    }
    catch (ex) {
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id de la ubicación no es válido.", 400);
        throw ex;
    }
};
const getLocations = async ({ idUser, country, city, }) => {
    const filter = { idUser };
    if (country)
        filter.country = country;
    if (city)
        filter.city = city;
    const locations = await LocationSchema.find(filter);
    return createMultipleLocationsDto(locations);
};
export { createLocation, updateLocation, deleteLocation, getLocations };
