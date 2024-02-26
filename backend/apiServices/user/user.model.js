import UserSchema from "../../db/schemas/user.schema.js";
import CustomError from "../../utils/customError.js";
import exists, { someExists } from "../../utils/exists.js";
import { createUserDto } from "./user.dto.js";
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
    const user = await UserSchema.findOne({ email, password });
    if (!user)
        throw new CustomError("Usuario o contraseña incorrectos.", 401);
    return createUserDto(user);
};
const updateUser = async ({ id, name, email, phone, password, }) => {
    var _a;
    try {
        const user = await UserSchema.findById(id);
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
export { createUser, authenticate, updateUser };
