import Food from "../models/Food.js";
import FoodRequest from "../models/FoodRequest.js";

export const getFoods = async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    let foods = [];

    // Edge Case 1: Search exists but is empty string or not valid
    if (search && search.length > 0) {
      foods = await Food.find({
        $or: [
          { FoodName: { $regex: search, $options: "i" } },
          { RestaurantName: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      // Edge Case 2: No search query
      foods = await Food.find();
    }

    // Edge Case 3: No foods found (return empty array, not error)
    if (!foods || foods.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching foods found",
        foods: [],
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: "Fetched foods from database",
      foods,
    });
  } catch (error) {
    // Edge Case 4: Catch any unexpected error
    console.error("Error in getFoods:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching foods",
      details: error.message,
    });
    next(error);
  }
};

export const getFood = async (req, res, next) => {
  try {
    const id = req.params.id;
    const food = await Food.findOne({ _id: id });
    res.status(200).json(food);
  } catch (error) {
    res.json({ message: "Error at foodsController::", details: error.message });
    next(error);
  }
};

export const addFoodRequest = async (req, res, next) => {
  try {
    const { name, email, foodName, description } = req.body;
    if (!name || !email || !foodName || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, FoodName, Description can't be empty!",
      });
    }
    const addFood = await FoodRequest.create({
      name,
      email,
      foodName,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Custom food request added to the chief",
      addFood,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const { _id } = req.params._id;
    console.log("FoodController::", _id);
  } catch (error) {
    res.json({ message: "Error at foodsController::", details: error.message });
    next(error);
  }
};
