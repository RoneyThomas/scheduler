import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";

import Appointment from "components/Appointment";
import DayList from "components/DayList";

import { getAppointmentsForDay, getInterview } from "helpers/selectors";

import "components/Application.scss";

const endpoints = {
  "GET_DAYS": 'http://localhost:8001/api/days',
  "GET_APPOINTMENTS": 'http://localhost:8001/api/appointments',
  "GET_INTERVIEWERS": 'http://localhost:8001/api/interviewers'
}

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  let dailyAppointments = [];
  const setDay = day => setState({ ...state, day });
  // const setDays = (days) => {
  //   setState(prev => ({ ...prev, days }));
  // };
  // const setAppointments = (appointments) => {
  //   setState(prev => ({ ...prev, appointments }));
  // };
  // useEffect(() => {
  //   const daysEndpoint = `http://localhost:8001/api/days`;
  //   axios.get(daysEndpoint).then(response => {
  //     console.log("Endpoint results days");
  //     console.log(response.data);
  //     setDays([...response.data]);
  //   });
  // }, []);
  // useEffect(() => {
  //   axios.get("http://localhost:8001/api/days").then(response => setDays(response.data));
  // }, []);

  useEffect(() => {
    Promise.all([
      axios.get(endpoints.GET_DAYS),
      axios.get(endpoints.GET_APPOINTMENTS),
      axios.get(endpoints.GET_INTERVIEWERS)
    ]).then((response) => {
      setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data }));

    });

  }, []);

  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
