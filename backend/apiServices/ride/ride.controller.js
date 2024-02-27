import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import parseBoolean from "../../utils/parseBoolean.js";
import { getLocationById } from "../location/location.model.js";
import { createRide, getRides } from "./ride.model.js";
const createRideController = async (req, res) => {
    const { idStartLocation, idArrivalLocation, datetime, vehicleType, vehicleIdentification, vehicleColor, } = req.body;
    try {
        if (!req.session)
            return;
        const user = req.session;
        const vehicle = {
            identification: vehicleIdentification,
            type: vehicleType,
            color: vehicleColor,
        };
        // Verificar si existen las ubicaciones
        if ((await getLocationById(idStartLocation)) === null)
            throw new CustomError("La ubicación de salida no existe.", 400);
        if ((await getLocationById(idArrivalLocation)) === null)
            throw new CustomError("La ubicación de llegada no existe.", 400);
        const ride = await createRide({
            idStartLocation,
            idArrivalLocation,
            user,
            datetime,
            vehicle,
        });
        res.send(ride);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear ride.",
        });
    }
};
const getRidesController = async (req, res) => {
    const { city, country, page, order, passenger, driver } = req.query;
    if (!req.session)
        return;
    const idUser = req.session.id;
    try {
        const parsedPage = exists(page) ? parseInt(page) : undefined;
        const parsedOrder = parseInt(order) === 1 || parseInt(order) === -1 ? parseInt(order) : undefined;
        const result = await getRides({
            country,
            city,
            page: parsedPage,
            order: parsedOrder,
            idUser,
            passengerFilter: parseBoolean(passenger),
            driverFilter: parseBoolean(driver),
        });
        if (result.result.length === 0)
            throw new CustomError("No se encontraron resultados.", 404);
        res.send(result);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener viajes.",
        });
    }
};
export { createRideController, getRidesController };
