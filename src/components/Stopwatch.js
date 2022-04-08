import React from "react";

export default function Stopwatch({ start, time, setTime }) {
    //Stopwatch code
    React.useEffect(() => {
        let interval = null
        if (start) {
        interval = setInterval(() => {
            setTime((prev) => prev + 10)
        }, 10)
        } else {
        clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [start, setTime])

  //HTML visual of Stopwatch
  return (
    <span>
        {("0" + (Math.floor(time / 36000) % 60)).slice(-2)}:
        {("0" + (Math.floor(time / 600) % 60)).slice(-2)}:
        {("0" + time / 10).slice(-2)}
    </span>
  )
}