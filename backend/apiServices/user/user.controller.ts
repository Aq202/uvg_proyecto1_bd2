import { signToken } from "../../services/jwt.js";
import errorSender from "../../utils/errorSender.js";
import exists from "../../utils/exists.js";
import { authenticate, createUser, updateUser } from "./user.model.js";
import hash from "hash.js";
import Grid from "gridfs-stream";
import { connection, mongo } from "../../db/connection.js";
import CustomError from "../../utils/customError.js";
import fs from "fs";
import { GridFSBucket } from "mongodb";

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

const getSessionUserController = async (req: AppRequest, res: AppResponse) => {
	try {
		if (!req.session) return;
		const user = req.session;
		res.send(user);
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener datos de usuario.",
		});
	}
};

const uploadUserImageController = async (req: AppRequest, res: AppResponse) => {
	try {
		if (!req.session) return;
		if (!req.uploadedFiles) throw new CustomError("No se proporionó una imagen.", 400);

		const user = req.session;
		const file: UploadedFile = req.uploadedFiles[0];

		let gfs = Grid(connection.db, mongo);
		gfs.collection("images");

		const { fileName } = file;
		// @ts-ignore
		const filePath = `${global.dirname}/files/${fileName}`;

		const bucket = new GridFSBucket(connection.db, { bucketName: "images" });

		const uploadStream = bucket.openUploadStream(user.id);
		fs.createReadStream(filePath).pipe(uploadStream);

		uploadStream.on("error", (error) => {
			fs.unlink(filePath, () => {}); // Eliminar archivo temporal
			throw error;
		});

		uploadStream.on("finish", () => {
			fs.unlink(filePath, () => {}); // Eliminar archivo temporal
			res.send({ ok: true });
		});
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al cargar foto del usuario.",
		});
	}
};

const getUserImageController = async (req: AppResponse, res: AppRequest) => {
	if (!req.session) return;
	try {
		const user = req.session;

		const bucket = new GridFSBucket(connection.db, { bucketName: "images" });
		const downloadStream = bucket.openDownloadStreamByName(user.id);

		// Construir respuesta con chunks recibidos
		downloadStream.on("data", (chunk) => {
			res.write(chunk);
		});

		// Cuando se completa la lectura del stream, finalizar la respuesta
		downloadStream.on("end", () => {
			res.end();
		});

		downloadStream.on("error", (error) => {
			throw error;
		});
	} catch (ex) {
		await errorSender({
			res,
			ex,
			defaultError: "Ocurrio un error al obtener imagen del usuario.",
		});
	}
};
export {
	createUserController,
	loginController,
	updateUserController,
	getSessionUserController,
	uploadUserImageController,
	getUserImageController,
};
