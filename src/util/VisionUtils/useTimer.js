import { useState, useEffect } from "react";
function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        setSeconds(initialSeconds);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, initialSeconds]);
  return seconds;
}
export default useTimer;
