import React, { useState } from "react";
import "./MoodSelector.css";

const moods = [
  { text: "I'm doing really great!", color: "#f0b6d3ff" },
  { text: "I'm doing okay, I guess.", color: "#f1e495ff" },
  { text: "I'm starting to struggle.", color: "#cdb5faff" },
  { text: "I need to reach out for support.", color: "#9be7dfff" },
];

const MoodSelector = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mood-section">
      <div className="glass-container mood-box">
        <h2>How are you feeling today?</h2>
        <div className="mood-grid">
          {moods.map((mood, index) => (
            <div
              key={index}
              className={`mood-item ${selected === index ? "active" : ""}`}
            >
              <span
                className={`heart ${selected === index ? "active-heart" : ""}`}
                style={{ color: mood.color }}
                onClick={() => setSelected(index)}
              >
                ♥
              </span>
              <span className="mood-text">{mood.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;