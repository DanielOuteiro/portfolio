import React, { useState, useEffect } from 'react';

function Thatscreen() {
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 100) {
        setCounter(counter + 1);
      } else {
        clearInterval(interval);
      }
    }, 90); // 9 seconds divided by 100

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  return (
    <div>
      <h1>Counter: {counter}</h1>
    </div>
  );
}

export default Thatscreen;
