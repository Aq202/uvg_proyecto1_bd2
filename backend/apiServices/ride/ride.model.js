import RideSchema from "../../db/schemas/ride.schema.js";
import { createMultipleRidesDto, createRideDto } from "./ride.dto.js";
import consts from "../../utils/consts.js";
import { ObjectId } from "mongodb";
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
    if (conditions.length > 0)
        queryPipeline.push({ $match: { $and: conditions } });
    console.log(queryPipeline, conditions);
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
export { createRide, getRides };
