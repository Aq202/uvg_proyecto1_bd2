import { signToken } from "../../services/jwt.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import { authenticate, createUser, updateUser } from "./user.model.js";
import hash from "hash.js";

const createUserController = async (req: AppRequest, res: AppResponse) => {
	const { name, email, phone, password } = req.body;

	try {
		const passwordHash = hash.sha256().update(password).digest("hex");
		const user = await createUser({ name, email, phone, password: passwordHash });

		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nuevo usuario.",
		});
	}
};

const updateUserController = async (req: AppRequest, res: AppResponse) => {
	const { name, email, phone, password } = req.body;

	if (!req.session) return;
	const id: string = req.session?.id;

	try {
		const passwordHash = exists(password)
			? hash.sha256().update(password).digest("hex")
			: undefined;

		const user = await updateUser({ id, name, email, phone, password: passwordHash });

		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al crear nuevo usuario.",
		});
	}
};

const loginController = async (req: AppRequest, res: AppResponse) => {
	const { email, password } = req.body;

	try {
		const passwordHash = hash.sha256().update(password).digest("hex");
		const user = await authenticate({ email, password: passwordHash });

		const result = {
			...user,
			token: signToken(user),
		};

		res.send(result);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al iniciar sesión.",
		});
	}
};

export { createUserController, loginController, updateUserController };
