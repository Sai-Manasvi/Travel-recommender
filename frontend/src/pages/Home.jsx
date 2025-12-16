import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [distancePreference, setDistancePreference] = useState("any");

  const categoriesList = [
    { key: "historical", label: "Historical" },
    { key: "adventure", label: "Adventurous" },
    { key: "cultural", label: "Cultural" },
    { key: "religious", label: "Religious" },
    { key: "nature", label: "Nature" },
    { key: "food", label: "Food" }
  ];

  const [categories, setCategories] = useState({
    historical: false,
    adventure: false,
    cultural: false,
    religious: false,
    nature: false,
    food: false,
  });

  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        alert("Location detected!");
      },
      () => alert("Location access denied")
    );
  };

  const toggleCat = (key) => {
    setCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const submit = async () => {
    const selectedCats = Object.keys(categories).filter((k) => categories[k]);

    if (!lat || !lon || selectedCats.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/recommend", {
        lat: Number(lat),
        lon: Number(lon),
        categories: selectedCats,
        travel_date: date,
        distancePreference,
      });

      navigate("/results", { state: { results: res.data } });
    } catch (err) {
      console.error(err);
      alert("Backend error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h1>Travel Recommender</h1>

      <div className="form-grid">

        <div className="row">
          <label>Latitude</label>
          <input className="coord-input" value={lat} onChange={(e) => setLat(e.target.value)} />
        </div>

        <div className="row">
          <label>Longitude</label>
          <input className="coord-input" value={lon} onChange={(e) => setLon(e.target.value)} />
        </div>

        <button className="btn" onClick={detectLocation}>
          Use My Location
        </button>
        <br></br>

        <div className="row">
          <label>Travel Date</label>
          <input
            className="coord-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="row">
          <label>Max Distance</label>
          <select
            className="coord-input"
            value={distancePreference}
            onChange={(e) => setDistancePreference(e.target.value)}
          >
            <option value="any">Anywhere</option>
            <option value="nearby">0–200 km</option>
            <option value="weekend">200–600 km</option>
            <option value="long">600+ km</option>
          </select>
        </div>

        {/* Interests Section */}
        <div className="interests-container">
          <div className="interests-title">Interests</div>
          <br></br>
          <div className="checkbox-list">
            {categoriesList.map(({ key, label }) => {
              const id = `cat-${key}`;
              return (
                <div className="checkbox-row" key={key}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={categories[key]}
                    onChange={() => toggleCat(key)}
                  />
                  <label htmlFor={id} className="checkbox-label">
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <button className="btn primary" onClick={submit} disabled={loading}>
          {loading ? "Searching..." : "Find Places"}
        </button>
      </div>

    </div>
  );
}
