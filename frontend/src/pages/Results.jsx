import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const results = state?.results || [];

  return (
    <div className="container">
      <h1>Recommendations</h1>

      {results.length === 0 && (
        <p>No results. Try again.</p>
      )}

      <button className="btn" onClick={() => navigate("/")}>← Back</button>

      {results.length === 0 ? (
        <p>No results.</p>
      ) : (
        results.map((r, i) => (
          <div key={i} className="result-card">
            <h3>{r.name}</h3>
            <p>
              {r.state}, {r.country}
              <br /><br></br>
              <strong>Categories:</strong> {(r.categories || []).join(", ")}
              <br />
            </p>
            <p>{r.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
