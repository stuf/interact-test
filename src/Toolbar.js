/* eslint-disable */
import { useState } from "react";

import css from "./Toolbar.module.css";

const items = {
  select: {
    label: "select",
    id: "select",
  },
};

export function Toolbar(props) {
  const [state, setState] = useState(items);

  return (
    <div className={css.root}>
      {Object.entries(state).map(([k, item], i) => {
        return <button key={i}>{item.label}</button>;
      })}
    </div>
  );
}
