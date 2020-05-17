import React, { FormEvent, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { condition } from "../data/conditions";

interface Props {
  id?: string;
}

export function ConditionForm({ id }: Props) {
  const field = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const saveCondition = useSetRecoilState(condition(name));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveCondition({ id: name, expression: exp });
    setName("");
    setExp("");
    field.current?.focus();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          ref={field}
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          autoFocus={true}
        />
        =
        <input
          type="text"
          placeholder="expression"
          value={exp}
          onChange={(e) => setExp(e.target.value)}
        />
        <button type="submit">🧮</button>
      </form>
    </div>
  );
}
