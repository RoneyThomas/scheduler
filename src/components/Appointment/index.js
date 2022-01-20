import React from "react";
import classNames from "classnames";
import "components/Appointment/styles.scss";

export default function Appointment(props) {
  const appointmentClass = classNames("appointment", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });
  return (
    <article className="appointment"></article>
  );
}