import CustomError from "../../utils/customError.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import { createLocation, deleteLocation, getLocations, updateLocation } from "./location.model.js";
const createLocationController = async (req, res) => {
    const { name, country, city, address } = req.body;
    try {
        if (!req.session)
            return;
        const id = req.session.id;
        const location = await createLocation({ name, country, city, address, idUser: id });
        res.send(location);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear nueva ubicación.",
        });
    }
};
const updateLocationController = async (req, res) => {
    const { id, name, country, city, address } = req.body;
    try {
        if (!req.session)
            return;
        const idUser = req.session.id;
        const location = await updateLocation({ id, name, country, city, address, idUser });
        res.send(location);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al actualizar ubicación.",
        });
    }
};
const deleteLocationController = async (req, res) => {
    if (!req.session)
        return;
    const { idLocation } = req.params;
    const idUser = req.session.id;
    try {
        await deleteLocation({ id: idLocation, idUser });
        res.send({ ok: true });
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al eliminar ubicación.",
        });
    }
};
const getLocationsController = async (req, res) => {
    if (!req.session)
        return;
    const { city, country, page } = req.query;
    const idUser = req.session.id;
    try {
        const parsedPage = exists(page) ? parseInt(page) : undefined;
        const result = await getLocations({ idUser, country, city, page: parsedPage });
        if (result.result.length === 0)
            throw new CustomError("No se encontraron resultados.", 404);
        res.send(result);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener ubicaciones.",
        });
    }
};
export { createLocationController, updateLocationController, deleteLocationController, getLocationsController, };
