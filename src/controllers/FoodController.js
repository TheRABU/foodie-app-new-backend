import Food from "../models/Food.js";
import FoodRequest from "../models/FoodRequest.js";

export const getFoods = async (req, res, next) => {
  try {
    const search = req.query.search | undefined;

    let foods;

    if (search) {
      foods = await Food.find({
        $or: [
          { FoodName: { $regex: search, $options: "i" } },
          { RestaurantName: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      foods = await Food.find();
      if (!foods) {
        return res.status(400).json({
          success: false,
          message: "Could not find foods sorry",
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Fetched All foods from database",
      foods,
    });
  } catch (error) {
    res.json({ message: "Error at foodsController::", details: error.message });
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
