import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
    },
    area: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    postCode: {
      type: String,
    },
    FoodName: {
      //   ref: "Food",
      type: String,
    },
    FoodImage: {
      //   ref: "Food",
      type: String,
    },
    Price: {
      //   ref: "Food",
      type: String,
    },
    orderQuantity: {
      //   ref: "Food",
      type: Number,
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema, "ordersCollection");

export default Order;
