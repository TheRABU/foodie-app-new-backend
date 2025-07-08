import { model, Schema } from "mongoose";

const foodRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const FoodRequest = model(
  "FoodRequests",
  foodRequestSchema,
  "foodRequestCollection"
);

export default FoodRequest;
