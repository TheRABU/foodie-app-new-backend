import mongoose, { model, Schema } from "mongoose";

const reviewSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  // foodName: {

  // },
  review: {
    type: String,
  },
  reviewRatings: {
    type: Number,
  },
});

const Review = model("Reviews", reviewSchema, "foodReviewCollection");

export default Review;
