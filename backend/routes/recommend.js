const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');


// Haversine distance (km)
function haversine(lat1, lon1, lat2, lon2) {
function toRad(x){ return x * Math.PI / 180; }
const R = 6371; // km
const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
return R * c;
}


// POST /api/recommend
// Body: { lat, lon, categories: ['historical','adventure'], travel_date: '2025-11-20', days: 3, max_distance_km: 500 }
router.post('/', async (req, res) => {
try {
const { lat, lon, categories, travel_date, days, max_distance_km = 1000, distancePreference } = req.body;


// basic validation
if (!lat || !lon || !categories) return res.status(400).json({ error: 'lat, lon and categories required' });

let dynamicMax;
if (distancePreference === "nearby") dynamicMax = 200;           // 0–200 km
else if (distancePreference === "weekend") dynamicMax = 600;     // 0–600 km
else if (distancePreference === "long") dynamicMax = 2000;       // 0–2000 km
else dynamicMax = max_distance_km;  

const all = await Destination.find({
  categories: { $in: categories }   // filter correctly
}).lean();

function monthNameFromDate(s) {
if (!s) return null;
const d = new Date(s);
return d.toLocaleString('en-US', { month: 'long' });
}
const travelMonth = monthNameFromDate(travel_date);

const scored = all.map(dest => {
const distance = haversine(lat, lon, dest.coordinates.lat, dest.coordinates.lon);
const inRange = distance <= max_distance_km;

// category score: fraction of selected categories that match destination categories
const matches = categories.filter(c => dest.categories.includes(c));
const category_score = matches.length / (categories.length || 1);

// seasonality
const season_score = travelMonth && dest.best_months && dest.best_months.includes(travelMonth) ? 1 : 0.4;

// duration score
const ideal_days = dest.min_days || 1;
const duration_score = Math.max(0, 1 - Math.abs(days - ideal_days) / Math.max(ideal_days, 1));

const popularity_score = dest.popularity || 0.5;

const final_score = (0.45 * category_score) + (0.2 * season_score) + (0.25 * duration_score) + (0.1 * popularity_score);

return {
dest,
distance,
inRange,
final_score
};
})

.filter(x => x.inRange)
.sort((a,b) => b.final_score - a.final_score)
.slice(0, 20);

// return top 3
res.json(
  scored.slice(0, 3).map(s => ({
    name: s.dest.name,
    country: s.dest.country,
    state: s.dest.state,
    coordinates: s.dest.coordinates,
    categories: s.dest.categories || [],
    best_months: s.dest.best_months || [],   
    min_days: s.dest.min_days,
    max_days: s.dest.max_days,
    popularity: s.dest.popularity,
    description: s.dest.description,
    distance_km: Math.round(s.distance),
    score: Number(s.final_score.toFixed(3))
  }))
);
}
catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
});
module.exports = router;
