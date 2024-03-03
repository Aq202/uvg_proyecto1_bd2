import UserSchema from "../../db/schemas/user.schema.js";
import CustomError from "../../utils/customError.js";
import exists, { someExists } from "../../utils/exists.js";
import { createUserDto, createMultipleUsersDto } from "./user.dto.js";
const createManyUsers = async (users) => {
    var _a, _b, _c;
    try {
        const operations = users.map((user) => ({
            insertOne: {
                document: user,
            },
        }));
        await UserSchema.bulkWrite(operations);
        return createMultipleUsersDto(users);
    }
    catch (ex) {
        const { err: WriteError } = ex.writeErrors[0];
        console.log('>>>>>>>>>>>>', (_a = WriteError === null || WriteError === void 0 ? void 0 : WriteError.errmsg) === null || _a === void 0 ? void 0 : _a.includes('email'));
        if (ex.code === 11000 && ((_b = WriteError === null || WriteError === void 0 ? void 0 : WriteError.errmsg) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            throw new CustomError(`El email "${(_c = WriteError === null || WriteError === void 0 ? void 0 : WriteError.op) === null || _c === void 0 ? void 0 : _c.email}" ya se encuentra registrado.`, 400);
        }
        throw ex;
    }
};
const createUser = async ({ name, email, phone, password, }) => {
    var _a;
    try {
        const user = new UserSchema();
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.password = password;
        await user.save();
        return createUserDto(user);
    }
    catch (ex) {
        if (ex.code === 11000 && ((_a = ex.keyValue) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
            throw new CustomError("El email ya se encuentra registrado.", 400);
        }
        throw ex;
    }
};
const authenticate = async ({ email, password, }) => {
    const user = await UserSchema.findOne({ email, password }, { password: 0 });
    if (!user)
        throw new CustomError("Usuario o contraseña incorrectos.", 401);
    return createUserDto(user);
};
const updateUser = async ({ id, name, email, phone, password, }) => {
    var _a;
    try {
        const user = await UserSchema.findById(id, { password: 0 });
        if (!user)
            throw new CustomError("No se encontró al usuario.", 404);
        if (name && exists(name))
            user.name = name;
        if (email && exists(email))
            user.email = email;
        if (phone && exists(phone))
            user.phone = phone;
        if (password && exists(password))
            user.password = password;
        if (someExists(name, email, phone, password))
            await user.save();
        return createUserDto(user);
    }
    catch (ex) {
        if (ex.code === 11000 && ((_a = ex.keyValue) === null || _a === void 0 ? void 0 : _a.email) !== undefined) {
            throw new CustomError("El email ya se encuentra registrado.", 400);
        }
        throw ex;
    }
};
const getUserById = async ({ idUser }) => {
    try {
        const user = await UserSchema.findById(idUser, { password: 0 });
        return user;
    }
    catch (ex) {
        if ((ex === null || ex === void 0 ? void 0 : ex.kind) === "ObjectId")
            throw new CustomError("El id de la ubicación no es válido.", 400);
        throw ex;
    }
};
export { createUser, authenticate, updateUser, getUserById, createManyUsers };
