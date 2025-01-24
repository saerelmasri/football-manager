import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "../src/routers/authRouter";
import teamRoutes from "../src/routers/teamRouter";
import transferRoutes from "../src/routers/transferRouter";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/team", teamRoutes);
app.use("/transfer", transferRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({ message: err.message });
});

export default app;
