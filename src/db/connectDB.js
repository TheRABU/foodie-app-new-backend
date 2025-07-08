import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const uri = `${process.env.MONGO_URI}`;
    await mongoose.connect(uri);
    console.log("Foodiebite Database connected successfully sir!");
  } catch (error) {
    console.log("Error in connectDB::", error.message);
  }
};
