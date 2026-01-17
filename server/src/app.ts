import express from "express";
import electricityRouter from "./routers/electricity";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/electricity", electricityRouter);

export default app;