import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const InterviewerListItemClass = classNames({
    "interviewers__item": !props.selected,
    "interviewers__item--selected": props.selected
  });
  console.log(props);
  console.log(InterviewerListItemClass);
  return (
    <li className={InterviewerListItemClass} onClick={props.setInterviewer ? () => props.setInterviewer(props.id) : undefined}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.name}
    </li>
  )
}