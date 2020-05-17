import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import "./App.css";

import { ConditionForm } from "./app/ConditionForm";
import { conditionIds, foo } from "./data/conditions";
import { Condition } from "./app/Condition";

export function Foo() {
  const val = useRecoilValue(foo());
  return <>{val}</>;
}

function App() {
  // const value = useRecoilValue(seconds);
  const ids = useRecoilValue(conditionIds);
  console.log("conditionids", ids);
  return (
    <div className="App">
      <Suspense fallback="xxx">
        <Foo />
      </Suspense>
      <Suspense fallback={"loading.."}>
        <ul>
          {Array.from(ids.values())
            .sort()
            .map((id) => {
              return (
                <li key={id}>
                  <Condition id={id} />
                </li>
              );
            })}
        </ul>
      </Suspense>
      <ConditionForm />
    </div>
  );
}

export default App;
