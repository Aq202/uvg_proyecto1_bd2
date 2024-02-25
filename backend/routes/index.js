import express from 'express';
import consts from '../utils/consts.js';

const router = express.Router();

const { apiPath } = consts;

// router.get('*', (req, res) => {
//   res.sendFile(`${global.dirname}/public/index.html`);
// });
export default router;
