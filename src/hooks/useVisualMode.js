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
      // This won't work becuase setting state is async.
      // setHistory(() => history.slice(0, -1));
      // setMode(() => history[history.length - 1]);
      const newHistory = history.slice(0, -1);
      setHistory(() => newHistory);
      setMode(() => newHistory[newHistory.length - 1]);
    }
  }

  // useEffect(() => {
  //   console.log(mode, history)
  // }, [mode, history])

  return { mode, transition, back };
}