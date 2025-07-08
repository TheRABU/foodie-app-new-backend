import express from "express";
import {
  addFoodRequest,
  deleteFood,
  getFood,
  getFoods,
} from "../controllers/FoodController.js";

const foodRouter = express.Router();

foodRouter.get("/foods", getFoods);
foodRouter.get("/foods/:id", getFood);
foodRouter.post("/foods", addFoodRequest);
foodRouter.put("/foods/:id");
foodRouter.delete("/foods/:id", deleteFood);

export default foodRouter;
