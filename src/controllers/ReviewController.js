// export const getReviews = async (req, resizeBy, next) => {
//     try {

import Food from "../models/Food.js";

//     } catch (error) {
//         console.log("Error ar reviewController::", error.message);
//         next(Error)
//     }
// }

export const addReview = async (req, res, next) => {
  try {
    const review = req.body;
    const { _id } = review;
    const findFood = await Food.findOne({ _id: _id });
    if (!findFood) {
      console.error("Food not found in foods collection Sorry!");
      throw new Error("Food not found in foods collection Sorry!");
    }
    // const addReview = await
  } catch (error) {
    console.log("Error at addReview", error.message);
    next(error);
  }
};
