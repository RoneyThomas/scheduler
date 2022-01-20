import React from "react";
import classNames from "classnames";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
  const appointmentClass = classNames("appointment", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });
  return (
    <article className="appointment">
      <Header time={props.time}></Header>
      {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty />}
    </article>
  );
}