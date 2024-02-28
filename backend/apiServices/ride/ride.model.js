import RideSchema from "../../db/schemas/ride.schema.js";
import { createMultipleRidesDto, createRideDto } from "./ride.dto.js";
import consts from "../../utils/consts.js";
import { ObjectId } from "mongodb";
import CustomError from "../../utils/customError.js";
import { startSession } from "mongoose";
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
const getRides = async ({ country, city, page, order, idUser, passengerFilter, driverFilter, }) => {
    var _a, _b;
    const queryPipeline = [
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
                    $anyElementTrue: {
                        $map: {
                            input: "$passengers",
                            as: "passengers",
                            in: {
                                $eq: ["$$passengers._id", new ObjectId(idUser)],
                            },
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                isDriver: {
                    $cond: {
                        if: { $eq: ["$user._id", new ObjectId(idUser)] },
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
    if (passengerFilter !== undefined && idUser) {
        if (passengerFilter)
            conditions.push({ passengers: { $elemMatch: { _id: new ObjectId(idUser) } } });
        else
            conditions.push({ passengers: { $not: { $elemMatch: { _id: new ObjectId(idUser) } } } });
    }
    if (driverFilter !== undefined && idUser) {
        if (driverFilter)
            conditions.push({ "user._id": new ObjectId(idUser) });
        else
            conditions.push({ "user._id": { $ne: new ObjectId(idUser) } });
    }
    if (conditions.length > 0)
        queryPipeline.push({ $match: { $and: conditions } });
    // Realizar conteo total de registros
    const count = (_b = (_a = (await RideSchema.aggregate([...queryPipeline, { $count: "total" }]))[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
    const pages = Math.ceil(count / consts.resultsNumberPerPage);
    // ordenar por fecha
    queryPipeline.push({ $sort: { datetime: order !== null && order !== void 0 ? order : -1 } });
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
const assignUserToRide = async ({ user, idRide }) => {
    const session = await startSession();
    try {
        session.startTransaction();
        const ride = await RideSchema.findOneAndUpdate({ _id: idRide }, { $push: { passengers: Object.assign({ _id: user.id }, user) } }, { session });
        if (!ride)
            throw new CustomError("No se encontró el viaje.", 404);
        if (ride.user._id === user.id)
            throw new CustomError("El conductor no puede ser pasajero.", 400);
        await session.commitTransaction();
    }
    catch (ex) {
        await session.abortTransaction();
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id del ride no es válido.", 400);
        throw ex;
    }
};
export { createRide, getRides, assignUserToRide };
