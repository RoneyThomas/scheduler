import { useState } from "react";

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
      history.pop();
      setMode(() => history[history.length - 1]);
    }
  }

  // useEffect(() => {
  //   console.log(mode, history)
  // }, [mode, history])

  return { mode, transition, back };
}