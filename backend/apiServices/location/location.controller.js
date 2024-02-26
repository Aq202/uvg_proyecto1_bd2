import errorSender from "../../utils/errorSender.js";
import { createLocation } from "./location.model.js";
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
export { createLocationController };
