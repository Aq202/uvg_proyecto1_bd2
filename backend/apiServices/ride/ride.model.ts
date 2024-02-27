import RideSchema from "../../db/schemas/ride.schema.js";
import { createMultipleRidesDto, createRideDto } from "./ride.dto.js";
import consts from "../../utils/consts.js";
import { ObjectId } from "mongodb";
import CustomError from "../../utils/customError.js";
import { startSession } from "mongoose";

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
		{
			$addFields: {
				isPassenger: {
					$cond: {
						if: {
							$in: [idUser, "$passengers._id"],
						},
						then: true,
						else: false,
					},
				},
			},
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

const assignUserToRide = async ({ user, idRide }: { user: User; idRide: string }) => {
	const session = await startSession();
	try {
		session.startTransaction();
		const ride = await RideSchema.findOneAndUpdate(
			{ _id: idRide },
			{ $push: { passengers: { _id: user.id, ...user } } },
			{ session }
		);

		if (!ride) throw new CustomError("No se encontró el viaje.", 404);
		if (ride.user._id === user.id)
			throw new CustomError("El conductor no puede ser pasajero.", 400);

		await session.commitTransaction();
	} catch (ex: any) {
		await session.abortTransaction();
		if (ex?.kind === "ObjectId") throw new CustomError("El id del ride no es válido.", 400);
		throw ex;
	}
};

export { createRide, getRides, assignUserToRide };
