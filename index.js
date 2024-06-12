const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors());
app.use(express.json());
// app.use(cookieParser());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtzgzoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const conn = await client.connect();
    // DB Collections
    const foodsCollection = conn
      .db("foodie-biteDB")
      .collection("foodsCollection");

    const orderCollection = conn
      .db("foodie-biteDB")
      .collection("ordersCollection");

    const foodRequestCollection = conn
      .db("foodie-biteDB")
      .collection("foodRequestCollection");

    const foodReviewCollection = conn
      .db("foodie-biteDB")
      .collection("foodReviewCollection");

    const clientReviewCollection = conn
      .db("foodie-biteDB")
      .collection("clientReviewCollection");

    // app.get("/api/foods", async (req, res) => {
    //   const result = await foodsCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/api/foods", async (req, res) => {
      try {
        const query = req.query.search;
        let products;

        if (query) {
          products = await foodsCollection
            .find({
              $or: [
                { FoodName: { $regex: query, $options: "i" } },
                { RestaurantName: { $regex: query, $options: "i" } },
              ],
            })
            .toArray();
        } else {
          products = await foodsCollection.find().toArray();
        }

        res.json(products);
      } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.get("/api/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findResult = await foodsCollection.findOne(query);
      res.send(findResult);
    });
    // app.get("/api/foods", async (req, res) => {
    //   const query = req.query.search;
    //   let products;
    //   try {
    //     const regex = new RegExp(query, "i"); // i makes it case sensitive
    //     const filter = await foodsCollection
    //       .find({ FoodName: {$regex: query, $options: "i"}),
    //       .toArray();
    //     res.send(filter);
    //   } catch (error) {
    //     res.status(500).send({ error: "An error occurred while searching" });
    //   }
    // });
    app.post("/order", async (req, res) => {
      try {
        const order = req.body;
        const { Price, FoodName, orderQuantity } = order;
        if (Price.length === 0 || Price.length < 0) {
          res.status(400).send("Invalid price");
        }
        const foodItem = await foodsCollection.findOne({ FoodName: FoodName });
        if (!foodItem) {
          return res.status(404).send({ message: "Food item not found" });
        }
        if (foodItem.Quantity < orderQuantity) {
          return res
            .status(400)
            .send({ message: "Not enough quantity available" });
        }

        const result = await orderCollection.insertOne(order);
        const updateQuantity = await foodsCollection.updateOne(
          { FoodName: FoodName },
          { $inc: { Quantity: -orderQuantity } }
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/myOrders/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const result = await orderCollection.find({ email: email }).toArray();
        res.json(result);
      } catch (error) {
        res.status(400).json("Error occurred fetching your orders", error);
      }
    });
    app.delete("/order/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const order = await orderCollection.findOne({ _id: new ObjectId(id) });
        const { FoodName, orderQuantity } = order;
        if (!order) {
          res.status(404).send("Order not found");
        }
        // first delete order
        const deleteOrder = await orderCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (deleteOrder.deletedCount === 1) {
          // once again update the quantity
          await foodsCollection.updateOne(
            { FoodName: FoodName },
            { $inc: { Quantity: +orderQuantity } }
          );
        }

        res.status(200).send(deleteOrder);
      } catch (error) {
        res.status(500).send("Could not delete item", error);
      }
    });

    // FOOD REQUEST COLLECTION RELATED
    app.get("/myRequest/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const result = await foodRequestCollection
          .find({ email: email })
          .toArray();
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send("Could not find request", error);
      }
    });

    app.post("/addRequest", async (req, res) => {
      const request = req.body;

      const result = await foodRequestCollection.insertOne(request);
      res.send(result);
    });

    app.delete("/request/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await foodRequestCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.status(200).send(result);
      } catch (error) {
        res.status(403).send("Sorry Error occurred while fetching the request");
      }
    });

    // FOOD REVIEW COLLECTION RELATED
    // app.post("/addFoodReview", async (req, res) => {
    //   try {
    //     const takenReview = req.body;
    //     const { _id, foodName, userEmail, review, reviewRatings } = takenReview;

    //     // find that item from foods collection based on id and food name
    //     // const findRequestedItem = await foodsCollection.findOne({
    //     //   _id: new ObjectId(_id),
    //     //   FoodName: foodName,
    //     // });
    //     // if (!findRequestedItem) {
    //     //   res.status(404).send("Food Not found");
    //     // }
    //     // then insert the review
    //     const postReview = await foodReviewCollection.insertOne(takenReview);

    //     // if (postReview.insertedId) {
    //     //   const updateReviewInFood = await foodsCollection.updateOne(
    //     //     { _id: new ObjectId(_id) },
    //     //     { $push: { reviews: takenReview } }
    //     //   );
    //     //   res.status(200).json(postReview);
    //     // } else {
    //     //   res.status(500).send("Could not post and update sorry");
    //     // }

    //     // res.json(postReview)
    //     res.send(postReview);
    //   } catch (error) {
    //     res.status(404).send("could not post at the moment");
    //   }
    // });
    app.post("/addFoodReview", async (req, res) => {
      try {
        const takenReview = req.body;
        const { _id, foodName } = takenReview;

        // Find the item from the foods collection based on foodName and _id
        const findRequestedItem = await foodsCollection.findOne({
          _id: _id,
          FoodName: foodName,
        });
        if (!findRequestedItem) {
          return res.status(404).send("Food not found");
        }

        // Insert the review into the foodReviewCollection
        const postReview = await foodReviewCollection.insertOne(takenReview);

        if (postReview.insertedId) {
          // Update the food item
          const updateReviewInFood = await foodsCollection.updateOne(
            { _id: _id },
            { $push: { reviews: takenReview } }
          );
          res.status(200).json(postReview);
        } else {
          res.status(500).send("Could not post and update review");
        }
      } catch (error) {
        res.status(500).send("Sorry, could not post at the moment");
      }
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Server started and running");
});

app.listen(port);
