import { useEffect, useReducer } from "react";
import axios from "axios";

const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
} else {
  axios.defaults.baseURL = process.env.REACT_APP_API_SERVER;
}
const endpoints = {
  "GET_DAYS": '/api/days',
  "GET_APPOINTMENTS": '/api/appointments',
  "GET_INTERVIEWERS": '/api/interviewers',
  "PUT_APPOINTMENTS": '/api/appointments',
  "DEL_APPOINTMENTS": '/api/appointments'
}

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS = "SET_DAYS";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.payload }
    case SET_APPLICATION_DATA:
      console.log(action);
      return {
        ...state,
        days: action.payload.days,
        appointments: action.payload.appointments,
        interviewers: action.payload.interviewers
      }
    case SET_INTERVIEW:
      return {
        ...state,
        appointments: action.payload
      }
    case SET_DAYS:
      console.log("Action", action);
      return {
        ...state,
        days: action.payload
      }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}


export const useApplicationData = () => {
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  // const setDay = day => setState({ ...state, day });
  const setDay = day => dispatch({ type: 'SET_DAY', payload: day });

  useEffect(() => {
    socket.onopen = function() {
      socket.send("ping");
    };
  });

  socket.onmessage = function(event) {
    // parse message from server
    const msg = JSON.parse(event.data);
    // listen for SET_INTERVIEW and update state
    if (msg.type === "SET_INTERVIEW") {
      console.log(msg.id, msg.interview);
      updateAppointment(msg.id, msg.interview);
    } else {
      console.log(msg);
    }
  };

  // close connection
  socket.onclose = function() {
    console.log("Connection closed");
  };

  useEffect(() => {
    Promise.all([
      axios.get(endpoints.GET_DAYS),
      axios.get(endpoints.GET_APPOINTMENTS),
      axios.get(endpoints.GET_INTERVIEWERS)
    ]).then((response) => {
      // setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data }));
      dispatch({
        type: 'SET_APPLICATION_DATA', payload: {
          days: response[0].data,
          appointments: response[1].data,
          interviewers: response[2].data
        }
      });
    });

  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`${endpoints.PUT_APPOINTMENTS}/${id}`, appointment).then(() => {
      // setState(prev => ({ ...prev, appointments }));
      dispatch({ type: 'SET_INTERVIEW', payload: appointments });
      console.log(state.days);
      Promise.all([axios.get(endpoints.GET_DAYS)]).then(([days]) => {
        // setState(prev => ({
        //   ...prev,
        //   days: days.data
        // }));
        dispatch({ type: 'SET_DAYS', payload: days.data });
        console.log(days.data);
      });
    });
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`${endpoints.DEL_APPOINTMENTS}/${id}`, appointment).then(() => {
      // setState(prev => ({ ...prev, appointments }));
      dispatch({ type: 'SET_INTERVIEW', payload: appointments });
      Promise.all([axios.get(endpoints.GET_DAYS)]).then(([days]) => {
        // setState(prev => ({
        //   ...prev,
        //   days: days.data
        // }));
        dispatch({ type: 'SET_DAYS', payload: days.data });
      });
    });
  }

  const updateAppointment = (id, interview) => {
    // Promise.all([
    //   axios.get(endpoints.GET_DAYS),
    //   axios.get(endpoints.GET_APPOINTMENTS)
    // ]).then((response) => {
    //   console.log(response);
    //   setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data }));
    // });
    console.log(state);
    if (!interview) {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      const dayIndex = state.days.findIndex(day => day.name === state.day);
      let days = state.days;
      days[dayIndex] = { ...state.days[dayIndex], spots: state.days[dayIndex].spots + 1 };
      console.log("Days", days);
      // setState(prev => ({
      //   ...prev,
      //   days,
      //   appointments
      // }));
      dispatch({ type: 'SET_DAYS', payload: days });
      dispatch({ type: 'SET_INTERVIEW', payload: appointments });
      console.log(state);
    } else {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      const dayIndex = state.days.findIndex(day => day.name === state.day);
      let days = state.days;
      days[dayIndex] = { ...state.days[dayIndex], spots: state.days[dayIndex].spots - 1 };
      console.log("Days", days);
      // setState(prev => ({
      //   ...prev,
      //   days,
      //   appointments
      // }));
      dispatch({ type: 'SET_DAYS', payload: days });
      dispatch({ type: 'SET_INTERVIEW', payload: appointments });
      console.log(state);
    }
  }

  return { state, setDay, bookInterview, cancelInterview }
}

