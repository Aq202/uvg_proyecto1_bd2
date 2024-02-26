import jwt from "jsonwebtoken";
import config from "config";
const key = config.get("jwtKey");
const signToken = async ({ id, name, email, phone }) => jwt.sign({
    id,
    name,
    email,
    phone,
}, key);
const validateToken = async (token) => {
    const payload = await jwt.verify(token, key);
    const { id, name, email, phone } = payload;
    return { id, name, email, phone };
};
export { signToken, validateToken };
