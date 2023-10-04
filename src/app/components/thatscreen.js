import React, { useState, useEffect } from "react";
import { useGlitch } from "react-powerglitch";

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

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", // Center-align content horizontally
        width: "100px", // Fixed width for the container
      }}
      className="bg-white text-black text-6xl"
    >
      <h1 ref={glitch.ref}>{counter}</h1>
      <p className="text-sm">loading ...</p>
    </div>
  );
}

export default Thatscreen;
