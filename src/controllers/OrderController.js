import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json(order);
  } catch (error) {
    res.json({
      message: "Error Occurred at orderController::",
      details: error.message,
    });
    throw error;
  }
};

export const myOrders = async (req, res) => {
  try {
    const email = req.params.email;
    // console.log("OrderController::", email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const result = await Order.find({ email });
    // console.log("OrderController::", result);
    if (!result) {
      return res.status(400).json({ message: "No orders found for the email" });
    }
    // if (result.length === 0) {
    //   return res.status(404).json({ message: "No orders found for the email" });
    // }
    res.status(200).json({
      success: true,
      message: "Found your added orders",
      result,
    });
  } catch (error) {
    res.json({
      message: "Error Occurred at orderController::",
      details: error.message,
    });
    throw error;
  }
};
