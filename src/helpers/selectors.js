export function getAppointmentsForDay(state, day) {
  let output = [];
  for (const item of Object.values(state.days)) {
    if (item.name === day) {
      for (const appt of Object.values(state.appointments)) {
        if (item.appointments.includes(Number(appt.id))) {
          output.push(appt);
        }
      }
    }
  }
  return output;
}

export function getInterview(state, interview) {
  if (interview !== null) {
    return {
      "student": interview.student,
      interviewer: state.interviewers[interview.interviewer]
    }
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  //retrieves available interviewers for that day
  const filteredDays = state.days.filter(stateDay => day === stateDay.name);
  if (!(Array.isArray(filteredDays) && day && filteredDays.length >= 1)) {
    return [];
  }
  // interviewers for given day
  const { interviewers } = filteredDays[0];
  const interviewerList = [];

  for (const interviewer of interviewers) {
    interviewerList.push(state.interviewers[interviewer]);
  }
  return interviewerList;
}