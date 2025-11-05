import cors from "cors";

import express from "express";

import thingRoutes from "./routes/thing";
import healthRoutes from "./routes/health";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", thingRoutes);

app.get("/", (req, res) => {
  res.send("Things API, Node.js with TypeScript and Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
