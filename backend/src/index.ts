import cors from "cors";

import express from "express";

import bidRoutes from "./routes/bid";
import houseRoutes from "./routes/house";
import healthRoutes from "./routes/health";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", houseRoutes);
app.use("/", bidRoutes);

app.get("/", (req, res) => {
  res.send("Houses API, Node.js with TypeScript and Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
