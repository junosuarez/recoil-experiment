import {
  useTransactionSubscription_UNSTABLE,
  useTransactionObservation_UNSTABLE,
} from "recoil";
// @ts-ignore
import invariant from "tiny-invariant/dist/tiny-invariant.cjs.js";
const prefix = "_p:";

// @ts-ignore
export function initialize({ set, setUnvalidatedAtomValues }): void {
  const map = Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.replace(prefix, ""))
    .reduce((acc, key) => {
      acc.set(
        key,
        JSON.parse(localStorage.getItem(prefix + key) || "null", deserializer)
      );
      return acc;
    }, new Map());
  setUnvalidatedAtomValues(map);

  // this throws an error if the key is unrecognized
  // Object.keys(localStorage)
  //   .filter((key) => key.startsWith(prefix))
  //   .map((key) => key.replace(prefix, ""))
  // .forEach((key) => {
  //   // set({ key }, JSON.parse(localStorage.getItem(prefix + key) || "null"));
  // });
}

export function Persist() {
  let getState: any;
  // hack to access the store.getState method...
  useTransactionSubscription_UNSTABLE((s: any) => {
    getState = getState || s.getState.bind(s);
    // remove this subscription
    s.getState().transactionSubscriptions.delete(0);
  });

  useTransactionObservation_UNSTABLE((x: any, ...y: any[]) => {
    const { atomInfo, modifiedAtoms } = x;

    const toPersist = [...modifiedAtoms].filter(
      (key) => atomInfo.get(key).persistence_UNSTABLE.type !== "ignore"
    );

    if (toPersist.length === 0) {
      return;
    }

    const state = getState();

    [...toPersist]
      .filter((key) => state.nextTree.atomValues.has(key))
      .map((key) => [key, state.nextTree.atomValues.get(key).getValue()])
      .forEach(([key, val]) => {
        console.log("s", key, val);
        localStorage.setItem(prefix + key, JSON.stringify(val, serializer));
      });
  });
  return null;
}

function serializer(key: any, value: any) {
  if (typeof value === "object" && value instanceof Set) {
    return { $set: Array.from(value) };
  }
  return value;
}

function deserializer(key: any, value: any) {
  if (typeof value === "object" && value.$set) {
    return new Set(value.$set);
  }
  return value;
}

const through = JSON.parse(
  JSON.stringify(new Set([1]), serializer),
  deserializer
);
// @ts-ignore
invariant(through instanceof Set && through.size === 1);
