import {
  useTransactionSubscription_UNSTABLE,
  useTransactionObservation_UNSTABLE,
} from "recoil";
const prefix = "_p:";

const ingored = ["clock"];

// @ts-ignore
export function initialize({ set, setUnvalidatedAtomValues }): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.replace(prefix, ""))
    .forEach((key) => {
      set({ key }, JSON.parse(localStorage.getItem(prefix + key) || "null"));
    });
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
    const { atomInfo, atomValues, modifiedAtoms } = x;

    const toPersist = [...modifiedAtoms].filter(
      (key) => atomInfo.get(key).persistence_UNSTABLE.type !== "ignore"
    );

    if (toPersist.length === 0) {
      return;
    }

    const state = getState();

    console.log("P", x, toPersist, state);

    [...toPersist]
      .filter((key) => state.nextTree.atomValues.has(key))
      .map((key) => [key, state.nextTree.atomValues.get(key).getValue()])
      .forEach(([key, val]) => {
        console.log("s", key, val);
        localStorage.setItem(prefix + key, JSON.stringify(val));
      });
  });
  return null;
}
