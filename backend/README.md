1. Install dependencies: npm install
2. Start MongoDB locally or set MONGO_URI to your Atlas URI
3. Seed DB: node seed.js (you can create a short seeder to read data/sample_destinations.json)
4. Run: npm run dev
5. Endpoint: POST http://localhost:4000/api/recommend
Body: { lat, lon, categories: [], travel_date: '2025-11-20', days: 3, max_distance_km: 1000 }