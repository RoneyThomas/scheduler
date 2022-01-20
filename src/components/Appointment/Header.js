import React from "react";
import classNames from "classnames";
// import "components/Appointment/styles.scss";

export default function Header(props) {
  const headerClass = classNames("appointment", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });
  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );
}