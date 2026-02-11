import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import connectToMongo from "./connectDb";

// ─── TypeScript Routes (ESM imports) ────────────────────────────────────────
import friendsRoutes from "../routes/friends";
import showsGameRoutes from "../routes/showsGame";
import userRoutes from "../routes/user";

// ─── Still-JS Routes (CJS require) ─────────────────────────────────────────
const showsRoutes = require("../routes/shows");
const testingRoutes = require("../routes/testing");

// ─── Bootstrap ──────────────────────────────────────────────────────────────

const app = express();

connectToMongo();

// ─── Body Parsing ───────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── CORS ───────────────────────────────────────────────────────────────────

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// ─── Health Check ───────────────────────────────────────────────────────────

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ health: "Online ! :)" });
});

// ─── Routes ─────────────────────────────────────────────────────────────────

app.use("/api/shows", showsRoutes);
app.use("/api/showsgame", showsGameRoutes);
app.use("/api/test", testingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendsRoutes);

export default app;
