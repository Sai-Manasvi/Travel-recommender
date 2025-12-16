const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String },
  coordinates: {
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
  },

  categories: [{ type: String }],
  activities: [{ type: String }],

  rating: { type: Number, default: 4.5 },
  popularity: { type: Number, default: 0.5 },

  bestMonths: [{ type: String }],

  description: { type: String },

  image: { type: String }
});

module.exports = mongoose.model("Destination", DestinationSchema);
