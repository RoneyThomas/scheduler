import React from "react";
import DayListItem from "components/DayListItem"

export default function DayList(props) {
  return (
    <ul>
      {props.days.map(value => (
        <DayListItem
          key={value.id}
          name={value.name}
          spots={value.spots}
          selected={value.name === props.day}
          setDay={props.onChange}
        />
      ))}
    </ul>
  );
}