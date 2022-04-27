import React, { useState, useEffect } from 'react';

function Timer_5() {
  const [seconds, setSeconds] = useState(300);
  const [isActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="app">
      <div className="time">
        {Math.floor(seconds/60)}m{seconds%60}s
      </div>
      <div className="row">
      </div>
    </div>
  );
};

export default Timer_5;