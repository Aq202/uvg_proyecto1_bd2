import UserSchema from "../../db/schemas/user.schema.js";
import CustomError from "../../utils/customError.js";
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
export { createUser };
