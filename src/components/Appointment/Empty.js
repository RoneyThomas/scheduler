import React from "react";
import classNames from "classnames";
// import "components/Appointment/styles.scss";

export default function Empty(props) {
  const emptyClass = classNames("appointment", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  );
}