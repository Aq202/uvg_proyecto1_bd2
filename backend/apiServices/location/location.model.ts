import LocationSchema from "../../db/schemas/location.schema.js";
import CustomError from "../../utils/customError.js";
import { someExists } from "../../utils/exists.js";
import { createLocationDto } from "./location.dto.js";

const createLocation = async ({
	name,
	country,
	city,
	address,
	idUser,
}: {
	name: string;
	country: string;
	city: string;
	address: string;
	idUser: string;
}): Promise<AppLocation> => {
	const location = new LocationSchema();

	location.name = name;
	location.country = country;
	location.city = city;
	location.address = address;
	location.idUser = idUser as any;

	await location.save();

	return createLocationDto(location);
};

const updateLocation = async ({
	id,
	name,
	country,
	city,
	address,
	idUser,
}: {
	id: string;
	name?: string;
	country?: string;
	city?: string;
	address?: string;
	idUser: string;
}): Promise<AppLocation> => {
	const location = await LocationSchema.findOne({ _id: id, idUser });

	if (!location) throw new CustomError("No se encontró la ubicación.", 404);

	if (name) location.name = name;
	if (country) location.country = country;
	if (city) location.city = city;
	if (address) location.address = address;

	if (someExists(name, country, city, address)) await location.save();

	return createLocationDto(location);
};

export { createLocation, updateLocation };
