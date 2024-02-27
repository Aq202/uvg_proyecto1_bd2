import RideSchema from "../../db/schemas/ride.schema.js";
import { createMultipleRidesDto, createRideDto } from "./ride.dto.js";
import consts from "../../utils/consts.js";
import { ObjectId } from "mongodb";

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

const getRides = async ({
	country,
	city,
	page,
	order,
	idUser,
	passengerFilter,
	driverFilter,
}: {
	country?: string;
	city?: string;
	page?: number;
	order?: number;
	idUser?: string;
	passengerFilter?: boolean;
	driverFilter?: boolean;
}) => {
	const queryPipeline: any = [
		{
			$lookup: {
				from: "locations",
				localField: "startLocation",
				foreignField: "_id",
				as: "startLocation",
			},
		},
		{
			$unwind: "$startLocation",
		},
		{
			$lookup: {
				from: "locations",
				localField: "arrivalLocation",
				foreignField: "_id",
				as: "arrivalLocation",
			},
		},
		{
			$unwind: "$arrivalLocation",
		},
	];

	// Agregar filtrado por ubicación

	const conditions = [];
	if (country) {
		conditions.push({
			$or: [{ "startLocation.country": country }, { "arrivalLocation.country": country }],
		});
	}

	if (city) {
		conditions.push({
			$or: [{ "startLocation.city": city }, { "arrivalLocation.city": city }],
		});
	}

	if (passengerFilter && idUser) {
		conditions.push({ passengers: { $elemMatch: { _id: idUser } } });
	}

	if (driverFilter && idUser) {
		conditions.push({ "user._id": new ObjectId(idUser) });
	}

	if (conditions.length > 0) queryPipeline.push({ $match: { $and: conditions } });
	console.log(queryPipeline, conditions);
	// Realizar conteo total de registros
	const count =
		(await RideSchema.aggregate([...queryPipeline, { $count: "total" }]))[0]?.total ?? 0;
	const pages = Math.ceil(count / consts.resultsNumberPerPage);

	// ordenar por fecha
	queryPipeline.push({ $sort: { datetime: order ?? -1 } });

	// Limitar segun paginación

	if (page != undefined) {
		queryPipeline.push({
			$skip: page * consts.resultsNumberPerPage,
		});
		queryPipeline.push({
			$limit: consts.resultsNumberPerPage,
		});
	}
	const rides = await RideSchema.aggregate(queryPipeline);
	return { pages, total: count, result: createMultipleRidesDto(rides) };
};

export { createRide, getRides };
