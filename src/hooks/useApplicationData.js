import { useState, useEffect } from "react";
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


export const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });

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
      setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data }));
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
      setState(prev => ({ ...prev, appointments }));
      Promise.all([axios.get(endpoints.GET_DAYS)]).then(([days]) => {
        setState(prev => ({
          ...prev,
          days: days.data
        }));
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
      setState(prev => ({ ...prev, appointments }));
      Promise.all([axios.get(endpoints.GET_DAYS)]).then(([days]) => {
        setState(prev => ({
          ...prev,
          days: days.data
        }));
      });
    });
  }

  const updateAppointment = (id, interview) => {
    Promise.all([
      axios.get(endpoints.GET_DAYS),
      axios.get(endpoints.GET_APPOINTMENTS)
    ]).then((response) => {
      console.log(response);
      setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data }));
    });
  }

  return { state, setDay, bookInterview, cancelInterview }
}

