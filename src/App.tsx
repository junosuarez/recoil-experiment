import React, { Suspense } from "react";
import { atom, useRecoilValue } from "recoil";
import "./App.css";

import { ConditionForm } from "./app/ConditionForm";
import { conditionIds } from "./data/conditions";
import { Condition } from "./app/Condition";

function App() {
  // const value = useRecoilValue(seconds);
  const ids = useRecoilValue(conditionIds);

  return (
    <div className="App">
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
