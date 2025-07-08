import express from "express";
import { getOrders, myOrders } from "../controllers/OrderController.js";

const orderRouter = express.Router();

orderRouter.get("/all-orders", getOrders);
orderRouter.get("/my-order/:email", myOrders);

export default orderRouter;
