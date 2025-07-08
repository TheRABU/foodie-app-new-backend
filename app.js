import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { json } from "express";
import orderRouter from "./src/routes/OrderRoutes.js";
import foodRouter from "./src/routes/FoodRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", orderRouter);
app.use("/api/v1/", foodRouter);

app.get("/", (req, res) => {
  res.json({ message: "Foodie app.server started" });
});

export default app;
