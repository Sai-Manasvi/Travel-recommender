const mongoose = require("mongoose");
require("dotenv").config();
const Destination = require("./models/Destination");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./data/destinations.json", "utf-8"));

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
    
    const data = JSON.parse(
      fs.readFileSync("./data/destinations.json", "utf-8")
    );

    await Destination.deleteMany({});
    console.log("Old data removed.");

    await Destination.insertMany(data);
    console.log("New destination data inserted.");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
