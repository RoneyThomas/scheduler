import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss"

const formatSpots = (spots) => {
  switch (spots) {
    case 0:
      return "no spots remaining";
    case 1:
      return "1 spot remaining";
    default:
      return `${spots} spots remaining`;
  }
}

export default function DayListItem(props) {
  const dayListClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });
  return (
    <li className={dayListClass} data-testid="day" onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}