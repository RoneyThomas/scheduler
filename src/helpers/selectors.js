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