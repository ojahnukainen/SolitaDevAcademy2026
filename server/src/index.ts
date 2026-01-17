import app from "./app";

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("Ping received");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); 