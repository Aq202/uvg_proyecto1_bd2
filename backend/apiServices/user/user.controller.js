import errorSender from "../../utils/errorSender.js";
import { createUser } from "./user.model.js";
import hash from "hash.js";
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
export { createUserController };
