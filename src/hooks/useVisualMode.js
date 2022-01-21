import { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (!replace) {
      setHistory(() => [...history, newMode]);
    }
    setMode(() => newMode);
  }

  function back() {
    if (history[history.length - 1] !== initial) {
      console.log("Slice", history, history.slice(0, -1));
      // history.pop();
      setHistory(() => history.slice(0, -1));
      console.log("History", history[history.length - 1])
      setMode(() => history[history.length - 1]);
      // setHistory(() => history.slice(0, -1));
      // Promise.resolve()
      //   .then(() => setHistory(() => history.slice(0, -1)))
      //   .then(() => setMode(() => history[history.length - 1]))
      // setHistory(() => history.slice(0, -1));
    }
  }

  useEffect(() => {
    console.log(mode, history)
  }, [mode, history])

  return { mode, transition, back };
}