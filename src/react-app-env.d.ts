/// <reference types="react-scripts" />

module "recoil" {
  export function RecoilRoot(c: any): any;
  export function atom(c: object): any;
  export function selector(c: {
    key: string;
    get?: (props: { get: Function }) => any;
    set?: (props: { set: Function }, newVal) => any;
  }): any;
  export function selectorFamily(c: {
    key: string;
    get?: (param: any) => (props: { get: Function }) => any;
  }): any;
  export function useRecoilValue(c: object): any;
  export function useSetRecoilState(c: object): any;
  export function useRecoilState(c: object): any[];
  export function useTransactionSubscription_UNSTABLE(c: any): any;
  export function useTransactionObservation_UNSTABLE(c: any): any;
  export function useRecoilInterface_UNSTABLE(c: any): any;
}
