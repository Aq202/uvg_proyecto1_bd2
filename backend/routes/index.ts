import express from "express";
import consts from "../utils/consts.js";
import userRouter from "../apiServices/user/user.route.js";
import locationRouter from "../apiServices/location/location.route.js";

const router = express.Router();

const { apiPath } = consts;

router.use(`${apiPath}/user`, userRouter);
router.use(`${apiPath}/location`, locationRouter);

// router.get('*', (req, res) => {
//   res.sendFile(`${global.dirname}/public/index.html`);
// });
export default router;
