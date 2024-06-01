import React, { useEffect, useState } from "react";

const CountDown: React.FC = () => {
  const [time, setTime] = useState<number>(300); // 300 seconds for 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return <div className="text-[#ced4da]">{formatTime(time)}</div>;
};

export default CountDown;
