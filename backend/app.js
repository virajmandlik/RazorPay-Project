import express from 'express';
import payment from './routes/productRoute.js';
import cors from 'cors';
const app = express();
app.use(cors("*"));
app.use(express.json());
app.use("/api/v1", payment);
export default app;