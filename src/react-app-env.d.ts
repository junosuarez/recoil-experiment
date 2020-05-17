/// <reference types="react-scripts" />

module "recoil" {
  interface Value<T> {}

  interface SelectorOptions {
    key: string;
    get?: (props: { get: <T>(selector: Value<T>) => T }) => any;
    set?: (props: { set: Function }, newVal) => any;
  }

  export function RecoilRoot(c: any): any;
  export function atom<T>(c: object): Value<T>;
  export function selector<T>(c: SelectorOptions): Value<T>;
  export function useRecoilValue<T>(c: Value<T>): T;
  export function useRecoilValueLoadable<T>(c: Value<T>): T;
  export function useSetRecoilState(c: object): any;
  export function useRecoilState(c: object): [T, any];
  export function useTransactionSubscription_UNSTABLE(c: any): any;
  export function useTransactionObservation_UNSTABLE(c: any): any;
  export function useRecoilInterface_UNSTABLE(c: any): any;
}
