import React from "react";

/**
 * A simple greeting component for the Hello World plugin
 */
const Greeting = () => {
  return (
    <div className="pf-v6-c-card pf-m-compact" style={{ margin: "1rem 0" }}>
      <div
        className="pf-v6-c-card__title"
        style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#06c" }}
      >
        ✨ Hello World Plugin (HTML/CSS Styling) ✨
      </div>
      <div className="pf-v6-c-card__body">
        <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#484" }}>
          This content is provided by the Hello World plugin using HTML/CSS
          styling!
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            background: "linear-gradient(45deg, #06c, #4a90e2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            padding: "0.5rem 0",
          }}
        >
          Plugins can add content to various parts of the application.
        </p>
      </div>
      <div className="pf-v6-c-card__footer">
        <button
          type="button"
          className="pf-v6-c-button pf-m-primary"
          style={{
            background: "linear-gradient(45deg, #06c, #4a90e2)",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "25px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ✨ Demo Button ✨
        </button>
      </div>
    </div>
  );
};

export default Greeting;
