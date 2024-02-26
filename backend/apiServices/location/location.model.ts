import LocationSchema from "../../db/schemas/location.schema.js";
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

	await location.save;

	return createLocationDto(location);
};

export { createLocation };
