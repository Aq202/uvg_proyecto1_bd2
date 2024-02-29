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
const createUserController = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const passwordHash = hash.sha256().update(password).digest("hex");
        const user = await createUser({ name, email, phone, password: passwordHash });
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear nuevo usuario.",
        });
    }
};
const updateUserController = async (req, res) => {
    var _a;
    const { name, email, phone, password } = req.body;
    if (!req.session)
        return;
    const id = (_a = req.session) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const passwordHash = exists(password)
            ? hash.sha256().update(password).digest("hex")
            : undefined;
        const user = await updateUser({ id, name, email, phone, password: passwordHash });
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al crear nuevo usuario.",
        });
    }
};
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const passwordHash = hash.sha256().update(password).digest("hex");
        const user = await authenticate({ email, password: passwordHash });
        const result = Object.assign(Object.assign({}, user), { token: signToken(user) });
        res.send(result);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al iniciar sesión.",
        });
    }
};
const getSessionUserController = async (req, res) => {
    try {
        if (!req.session)
            return;
        const user = req.session;
        res.send(user);
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener datos de usuario.",
        });
    }
};
const uploadUserImageController = async (req, res) => {
    try {
        if (!req.session)
            return;
        if (!req.uploadedFiles)
            throw new CustomError("No se proporionó una imagen.", 400);
        const user = req.session;
        const file = req.uploadedFiles[0];
        let gfs = Grid(connection.db, mongo);
        gfs.collection("images");
        const { fileName } = file;
        // @ts-ignore
        const filePath = `${global.dirname}/files/${fileName}`;
        const bucket = new GridFSBucket(connection.db, { bucketName: "images" });
        const uploadStream = bucket.openUploadStream(user.id);
        fs.createReadStream(filePath).pipe(uploadStream);
        uploadStream.on("error", async (error) => {
            fs.unlink(filePath, () => { }); // Eliminar archivo temporal
            await errorSender({ res, ex: error, defaultError: "Error al cargar imagen del usuario." });
        });
        uploadStream.on("finish", () => {
            fs.unlink(filePath, () => { }); // Eliminar archivo temporal
            res.send({ ok: true });
        });
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al cargar foto del usuario.",
        });
    }
};
const getUserImageController = async (req, res) => {
    try {
        const { idUser } = req.params;
        const bucket = new GridFSBucket(connection.db, { bucketName: "images" });
        const downloadStream = bucket.openDownloadStreamByName(idUser);
        // Construir respuesta con chunks recibidos
        downloadStream.on("data", (chunk) => {
            res.write(chunk);
        });
        // Cuando se completa la lectura del stream, finalizar la respuesta
        downloadStream.on("end", () => {
            res.end();
        });
        downloadStream.on("error", async (error) => {
            await errorSender({
                res,
                ex: error,
                defaultError: "No se encontró la imagen del usuario.",
                defaultStatus: 404,
            });
        });
    }
    catch (ex) {
        await errorSender({
            res,
            ex,
            defaultError: "Ocurrio un error al obtener imagen del usuario.",
        });
    }
};
export { createUserController, loginController, updateUserController, getSessionUserController, uploadUserImageController, getUserImageController, };
