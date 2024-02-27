import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import { getLocationById } from "../location/location.model.js";
import { createRide } from "./ride.model.js";
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
        console.log(ex);
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear ride.",
        });
    }
};
export { createRideController };
