import { model, Schema } from "mongoose";

const foodSchema = new Schema(
  {
    FoodName: {
      type: String,
      required: [true, "Food Name is required"],
    },
    FoodImage: {
      type: String,
      required: [true, "Food image link is required"],
    },
    AvailableRestaurants: {
      type: [String],
    },
    FoodCategory: {
      type: String,
    },
    Price: {
      type: Number,
      required: [true, "Food Price is required"],
    },
    MadeBy: {
      type: String,
    },
    FoodOrigin: {
      type: String,
    },
    Quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);
const Food = model("Foods", foodSchema, "foodsCollection");

export default Food;
