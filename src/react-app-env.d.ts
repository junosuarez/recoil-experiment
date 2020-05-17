/// <reference types="react-scripts" />

module "recoil" {
  interface Value<T> {}

  export function RecoilRoot(c: any): any;
  export function atom<T>(c: object): Value<T>;
  export function selector<T>(c: {
    key: string;
    get?: (props: { get: Function }) => any;
    set?: (props: { set: Function }, newVal) => any;
  }): Value<T>;
  export function selectorFamily(c: {
    key: string;
    get?: (param: any) => (props: { get: Function }) => any;
  }): any;
  export function useRecoilValue<T>(c: Value<T>): T;
  export function useSetRecoilState(c: object): any;
  export function useRecoilState(c: object): [T, any];
  export function useTransactionSubscription_UNSTABLE(c: any): any;
  export function useTransactionObservation_UNSTABLE(c: any): any;
  export function useRecoilInterface_UNSTABLE(c: any): any;
}
