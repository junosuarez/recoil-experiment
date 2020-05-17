import { condition, conditionKind, conditionVal } from "../data/conditions";
import React, { Suspense } from "react";
import { useRecoilValue, useRecoilState, useRecoilValueLoadable } from "recoil";
import { Foo } from "../App";
interface Props {
  id: string;
}

function ConditionVal({ id }: Props) {
  const val = useRecoilValue(conditionVal(id));
  return <>{val}</>;
}

function ConditionKind({ id }: Props) {
  const { kind } = useRecoilValue(conditionKind(id));
  return <>{kind}</>;
}

export function Condition({ id }: Props) {
  const [condition_, setCondition] = useRecoilState(condition(id));
  return (
    <div className="Condition">
      <strong>{condition_.id}</strong>:<span>{condition_.expression}</span>
      <span>
        <Suspense fallback={"..."}>
          <Foo />
          <ConditionVal id={id} />
        </Suspense>
      </span>
      <em>
        <ConditionKind id={id} />
      </em>
      <div>
        <button>✏️</button>
        <button
          onClick={() => {
            console.log("x");
            setCondition({ ...condition_, _deleted: true });
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
