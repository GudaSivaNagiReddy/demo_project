const express = require("../typeScript/node_modules/@types/express");
const mongoose = require("mongoose");
const axios = require("axios");
const { User } = require("./user.model");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware to parse JSON requests
app.use(express.json());

// Define routes

// Create or update a user
app.post("/api/users", async (req, res) => {
  try {
    const data = req.body;
    console.log(/data/, data);
    const user = await User.create(data, {
      upsert: true,
      new: true,
    });
    res.json(user);
  } catch (err) {
    console.error("Error creating/updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users (anonymous access)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Make external API requests to fetch IFSC and weather data
app.get("/api/ifsc/:ifsc", async (req, res) => {
  try {
    const response = await axios.get(
      `https://ifsc.razorpay.com/${req.params.ifsc}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching IFSC data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/weather/:city", async (req, res) => {
  try {
    const response = await axios.get(
      `https://openweathermap.org/api/weather/${req.params.city}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
