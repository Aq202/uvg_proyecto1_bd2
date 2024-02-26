import errorSender from "../../utils/errorSender.js";
import { createLocation, deleteLocation, updateLocation } from "./location.model.js";
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
        // buscar si existen rides con la ubicación
        await deleteLocation({ id: idLocation, idUser });
        req.send({ ok: true });
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al eliminar ubicación.",
        });
    }
};
export { createLocationController, updateLocationController, deleteLocationController };
