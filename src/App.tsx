import React, { Suspense } from "react";
import { atom, useRecoilValue } from "recoil";
import "./App.css";

import { ConditionForm } from "./app/ConditionForm";
import { conditions } from "./data/conditions";
import { Condition } from "./app/Condition";

function App() {
  // const value = useRecoilValue(seconds);
  const conditions_ = useRecoilValue(conditions);

  return (
    <div className="App">
      <Suspense fallback={"loading.."}>
        <ul>
          {Object.values(conditions_)
            .sort((a: any, b: any) => a.id.localeCompare(b.id))
            .map((condition: any) => {
              return (
                <li key={condition.id}>
                  <Condition id={condition.id} />
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
