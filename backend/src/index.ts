import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import express from "express";

import thingRoutes from "./routes/thing";
import healthRoutes from "./routes/health";

const app = express();
const port = process.env.PORT || 3000;

// const corsOptions = {
//   origin: [`http://localhost:${port}`], // TODO: Update with actual frontend origin in production
// };

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  message: {
    statusCode: 429,
    message: "Too many requests, please try again after 15 minutes.",
  },
});

// middleware to parse JSON request bodies
app.use(express.json());

// security middleware
app.use(helmet());

// rate limiting
app.use(limiter);

// middleware to enable CORS with custom block logic
app.use(cors());

app.use("/", healthRoutes);
app.use("/", thingRoutes);

app.get("/", (req, res) => {
  res.send("Things API, Node.js with TypeScript and Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
