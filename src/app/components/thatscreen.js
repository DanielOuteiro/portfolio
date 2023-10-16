// Thatscreen.js
import React, { useState, useEffect } from "react";
import { useGlitch } from "react-powerglitch";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import styles from "./styles.css";

function Thatscreen() {
  const glitch = useGlitch();

  const [counter, setCounter] = useState(0); // Start from 0

  useEffect(() => {
    const duration = 7000; // 7 seconds in milliseconds
    const interval = 50; // Update every 50 milliseconds
    const totalSteps = duration / interval;
    const increment = 99 / totalSteps; // Change to 99 to stop at 99 instead of 100

    let currentCounter = 0;
    const timer = setInterval(() => {
      currentCounter += increment;
      setCounter(Math.min(currentCounter, 99)); // Ensure the counter does not exceed 99
    }, interval);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  const formattedCounter = Math.floor(counter).toString().padStart(2, "0"); // Display integer percentage

  return (
    <div>
      <div className="wrapper">
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
      </div>
      <div className="loading">
        <Progress
          percent={Math.floor(counter)}
          status="default"
          
          theme={{
            default: {
              trailColor: "#ffffff1a",
              color: "black",
              symbol: '‍',

            }
          }}
        />
      </div>
      <div className="counter">
        <p>{formattedCounter}</p>
      </div>
    </div>
  );
}

export default Thatscreen;
