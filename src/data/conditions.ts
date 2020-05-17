import { atom, selector, Value, SelectorOptions } from "recoil";
import {
  Expression,
  parseExpression,
  evalExpression,
} from "../service/calculator";

function deleteImmutable<T>(set: Set<T>, val: T): Set<T> {
  if (set.has(val)) {
    const newSet = new Set(set.values());
    newSet.delete(val);
    return newSet;
  }
  return set;
}
function addImmutable<T>(set: Set<T>, val: T): Set<T> {
  if (!set.has(val)) {
    const newSet = new Set(set.values());
    newSet.add(val);
    return newSet;
  }
  return set;
}

const selectorCache: { [key: string]: Value<any> } = {};

function getSelector<T>(options: SelectorOptions): Value<T> {
  const { key } = options;
  if (key in selectorCache) {
    return selectorCache[key];
  }

  selectorCache[key] = selector(options);

  return selectorCache[key];
}

///
///
///

export interface Condition {
  id: string;
  expression: string;
  _deleted?: boolean;
}

// TODO: find a way to automatically generate this index, it feels gross to manually update it alongside
// setting individual conditions
export const conditionIds = atom<Set<string>>({
  key: "conditionIds",
  default: new Set(),
  persistence_UNSTABLE: {
    type: "local",
    validator: (x: any) => x,
  },
});

const condition_ = (id: string) =>
  atom<Condition>({
    key: "condition:" + id,
    default: { id, expression: "" },
    persistence_UNSTABLE: {
      type: "local",
      validator: (x: any) => x,
    },
  });
// experiment in having a selector facade with a setter to maintain the index
export const condition = (id: string) => {
  return getSelector<Condition>({
    key: "condition_:" + id,
    get({ get }) {
      return get(condition_(id));
    },
    set({ set }, val) {
      console.log("set", id, val);
      set(condition_(id), val);
      set(conditionIds, (ids: Set<string>) => {
        if (val._deleted) {
          return deleteImmutable(ids, val.id);
        }
        return addImmutable(ids, val.id);
      });
    },
  });
};

type ConditionKinds = "number" | "boolean" | "expression";

type ConditionKind =
  | {
      kind: "number";
      parsed: number;
    }
  | {
      kind: "boolean";
      parsed: number;
    }
  | {
      kind: "expression";
      parsed: Expression;
    };

export const conditionKind = (id: string) => {
  return selector<ConditionKind>({
    key: "conditionKind" + id,
    get({ get }) {
      const { expression } = get(condition(id));
      const kind = /^[\d.]+$/.test(expression)
        ? "number"
        : ["true", "false"].includes(expression)
        ? "boolean"
        : "expression";

      let parsed;
      switch (kind) {
        case "number":
          parsed = parseFloat(expression);
          break;
        case "boolean":
          parsed = expression === "true" ? 1 : 0;
          break;
        case "expression":
          parsed = parseExpression(expression);
          break;
      }

      return { kind, parsed };
    },
  });
};

export const foo = (a: any = 1): Value<{}> => {
  const key = `foo`;
  return getSelector({
    key,
    get: async ({ get }) => {
      return Promise.resolve("");
    },
  });
};

type ConditionVal = string | number;

export const conditionVal = (id: string) =>
  getSelector<ConditionVal>({
    key: "conditionVal:" + id,
    get: async ({ get }) => {
      const k = get(conditionKind(id));

      let value;
      switch (k.kind) {
        case "number":
          value = k.parsed;
          break;
        case "boolean":
          value = k.parsed;
          break;
        case "expression":
          const vars = (
            await Promise.all(
              k.parsed.varNames.map(async (varName) => [
                varName,
                await get(conditionVal(varName)),
              ])
            )
          ).reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
          }, {} as any);
          console.log(k.parsed.varNames, vars);
          value = evalExpression(k.parsed.tokens, vars);

          break;
      }
      return value;
    },
  });

//   get: async ({ get }) => {
//     const state = get(conditions);
//     const condition = state[id];
//     const kind = /^[\d\.]+$/.test(condition.expression)
//       ? "number"
//       : ["true", "false"].includes(condition.expression)
//       ? "boolean"
//       : "expression";

//     let value;
//     switch (kind) {
//       case "number":
//         value = parseFloat(condition.expression);
//         break;
//       case "boolean":
//         value = condition.expression === "true" ? 1 : 0;
//         break;
//       case "expression":
//         const parsed = parseExpression(condition.expression);
//         const vars = await Promise.all(
//           parsed.varNames.map(async (varName) => [
//             varName,
//             (await get({ key: "condition:" + varName })).value,
//           ])
//         );

//         value = evalExpression(parsed.tokens, (varName) => {
//           // @ts-ignore
//           return vars.find(([name]) => name === varName)[1];
//         });
//         break;
//     }

//     return { ...condition, kind, value };
//   },
//   set: ({ set }, newVal) =>
//     set(conditions, (conditions: any) => {
//       if (newVal === undefined) {
//         // delete
//         const next = { ...conditions };
//         delete next[id];
//         return next;
//       }
//       return { ...conditions, [id]: newVal };
//     }),
// });
