import { Schema, model } from "mongoose";

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
});

const UserSchema = model("user", userSchema);
export default UserSchema;
