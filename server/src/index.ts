import express from "express";
import electricityRouter from "./routers/electricity";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(express.json());

app.get("/ping", (_req, res) => {
  console.log("Ping received");
  res.send("pong");
});

app.use("/api/electricity", electricityRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); 