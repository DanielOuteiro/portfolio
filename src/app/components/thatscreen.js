import React, { useState, useEffect } from "react";
import { useGlitch } from "react-powerglitch";

import styles from "./styles.css";

function Thatscreen() {
  const glitch = useGlitch();

  const [counter, setCounter] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 60) {
        // For the fast increase from 0 to 60
        const randomIncrement = Math.floor(Math.random() * 4) + 1; // Random between 1 and 5
        setCounter(counter + randomIncrement);
      } else if (counter < 99) {
        // For the slow increase from 61 to 100
        const randomIncrement = Math.floor(Math.random() * 2) + 1; // Random between 1 and 2
        setCounter(counter + randomIncrement);
      } else {
        clearInterval(interval);
      }
    }, 130);

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const formattedCounter = counter.toString().padStart(2, '0');

  return (
    <div>
      <div class="wrapper">
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
      </div>
      <div className="loading">
        <h1 ref={glitch.ref}>Loading</h1>
      </div>
      <div className="counter">
        <p>{formattedCounter}</p>
      </div>
    </div>
  );
}

export default Thatscreen;
