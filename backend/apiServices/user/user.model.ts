import UserSchema from "../../db/schemas/user.schema.js";
import CustomError from "../../utils/customError.js";
import exists, { someExists } from "../../utils/exists.js";
import { createUserDto } from "./user.dto.js";

const createUser = async ({
	name,
	email,
	phone,
	password,
}: {
	name: string;
	email: string;
	phone: string;
	password: string;
}): Promise<User> => {
	try {
		const user = new UserSchema();

		user.name = name;
		user.email = email;
		user.phone = phone;
		user.password = password;

		await user.save();

		return createUserDto(user);
	} catch (ex: any) {
		if (ex.code === 11000 && ex.keyValue?.email !== undefined) {
			throw new CustomError("El email ya se encuentra registrado.", 400);
		}
		throw ex;
	}
};

const authenticate = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<User> => {
	const user = await UserSchema.findOne({ email, password }, { password: 0 });
	if (!user) throw new CustomError("Usuario o contraseña incorrectos.", 401);

	return createUserDto(user);
};

const updateUser = async ({
	id,
	name,
	email,
	phone,
	password,
}: {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	password?: string;
}): Promise<User> => {
	try {
		const user = await UserSchema.findById(id, { password: 0 });

		if (!user) throw new CustomError("No se encontró al usuario.", 404);

		if (name && exists(name)) user.name = name;
		if (email && exists(email)) user.email = email;
		if (phone && exists(phone)) user.phone = phone;
		if (password && exists(password)) user.password = password;

		if (someExists(name, email, phone, password)) await user.save();

		return createUserDto(user);
	} catch (ex: any) {
		if (ex.code === 11000 && ex.keyValue?.email !== undefined) {
			throw new CustomError("El email ya se encuentra registrado.", 400);
		}
		throw ex;
	}
};

const getUserById = async ({ idUser }: { idUser: string }) => {
	try {
		const user = await UserSchema.findById(idUser, { password: 0 });

		return user;
	} catch (ex: any) {
		if (ex?.kind === "ObjectId") throw new CustomError("El id de la ubicación no es válido.", 400);
		throw ex;
	}
};

export { createUser, authenticate, updateUser, getUserById };
