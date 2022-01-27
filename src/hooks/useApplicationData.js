import { useState, useEffect } from "react";
import axios from "axios";

console.log(process.env)
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
    Promise.all([
      axios.get(endpoints.GET_DAYS),
      axios.get(endpoints.GET_APPOINTMENTS),
      axios.get(endpoints.GET_INTERVIEWERS)
    ]).then((response) => {
      setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data }));
    });

  }, []);

  const bookInterview = (id, interview) => {
    console.log(id, interview);
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

  return { state, setDay, bookInterview, cancelInterview }
}