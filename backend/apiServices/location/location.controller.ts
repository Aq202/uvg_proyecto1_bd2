import errorSender from "../../utils/errorSender.js";
import { createLocation, updateLocation } from "./location.model.js";

const createLocationController = async (req: AppRequest, res: AppResponse) => {
	const { name, country, city, address } = req.body;

	try {
		if (!req.session) return;

		const id: string = req.session.id;

		const location = await createLocation({ name, country, city, address, idUser: id });

		res.send(location);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nueva ubicación.",
		});
	}
};
const updateLocationController = async (req: AppRequest, res: AppResponse) => {
	const { id, name, country, city, address } = req.body;

	try {
		if (!req.session) return;

		const idUser: string = req.session.id;

		const location = await updateLocation({ id, name, country, city, address, idUser });

		res.send(location);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al actualizar ubicación.",
		});
	}
};

export { createLocationController, updateLocationController };
