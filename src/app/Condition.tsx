import { condition } from "../data/conditions";
import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
interface Props {
  id: string;
}

export function Condition({ id }: Props) {
  const [condition_, setCondition] = useRecoilState(condition(id));
  return (
    <div className="Condition">
      <strong>{condition_.id}</strong>:<span>{condition_.expression}</span>
      <span>{condition_.value}</span>
      <em>{condition_.kind}</em>
      <div>
        <button>✏️</button>
        <button
          onClick={() => {
            console.log("x");
            setCondition();
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
