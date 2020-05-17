import { atom, useRecoilValue, useSetRecoilState, selector } from "recoil";
import { useEffect } from "react";

export const clock = atom({
  key: "clock",
  default: 0,
  persistence_UNSTABLE: {
    type: "ignore",
  },
});

export function ClockProvider() {
  const setClock = useSetRecoilState(clock);
  useEffect(() => {
    let canceled = false;

    function loop() {
      requestAnimationFrame(() => {
        if (!canceled) {
          setClock(Date.now());
          loop();
        }
      });
    }

    loop();

    return () => {
      canceled = true;
    };
  });
  return null;
}

export const seconds = selector({
  key: "seconds",
  get: ({ get }) => Math.round(get(clock) / 1000),
});
