import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import healthRoutes from "./routes/health";
import houseRoutes from "./routes/house";
import bidRoutes from "./routes/bid";

dotenv.config();

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
