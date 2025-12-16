const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const recommendRoutes = require('./routes/recommend');
const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// Connect to MongoDB (use local or atlas URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_recommender';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/recommend', recommendRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send("Travel Recommender API is running...");
});
