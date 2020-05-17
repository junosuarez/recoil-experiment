type TokenType = "NUMBER" | "ALPHA" | "OPERATOR" | "START" | "END";
interface Token {
  token: string;
  tokenType: TokenType;
}
export interface Expression {
  varNames: string[];
  tokens: Token[];
}

export function parseExpression(exp: string): Expression {
  const chars = exp.split("");
  const parsed = chars.reduce(
    (acc, c) => {
      const { token, tokenType } = acc;
      let nextType;
      if (/[\d\.]/.test(c)) {
        nextType = "NUMBER";
      } else if (/[a-z]/.test(c)) {
        nextType = "ALPHA";
      } else if (/[+*-/]/.test(c)) {
        nextType = "OPERATOR";
      } else if (/\s/.test(c)) {
        // ignore whitespace
        return acc;
      } else {
        throw new Error(
          "Parse error: " +
            c +
            " in `" +
            exp +
            "` is not valid in an expression"
        );
      }

      if (nextType === tokenType) {
        // accumulate token
        acc.token += c;
        return acc;
      }

      // new token, push previous to stack
      acc.stack.push({ token, tokenType });
      acc.token = c;
      acc.tokenType = nextType;
      return acc;
    },
    { token: "", tokenType: "START", stack: [] as any[] }
  );

  const expression: Expression = {
    // flush last token
    tokens: parsed.stack.concat({
      token: parsed.token,
      tokenType: parsed.tokenType,
    }),
    varNames: [],
  };
  expression.tokens
    .filter((t) => t.tokenType === "ALPHA")
    .forEach((t) => {
      expression.varNames.push(t.token);
    });
  return expression;
}

function evalOp(lhs: number, op: string, rhs: number): number {
  switch (op) {
    case "+":
      return lhs + rhs;
    case "-":
      return lhs - rhs;
    case "*":
      return lhs * rhs;
    case "/":
      return lhs / rhs;
    default:
      throw new Error("Unsupported operator: " + op);
  }
}

export function evalExpression(
  tokens: Token[],
  vars: { [name: string]: number }
) {
  const val = tokens.reduce(
    (acc, { token, tokenType }) => {
      let lhs = acc.val;
      let rhs;
      switch (tokenType) {
        case "START":
          return acc;
        case "NUMBER":
          rhs = parseFloat(token);
          acc.val = evalOp(lhs, acc.op, rhs);
          // console.log(lhs, acc.op, rhs, "=", acc.val);
          return acc;
        case "ALPHA":
          rhs = vars[token];
          console.log("getval", token, rhs);
          acc.val = evalOp(lhs, acc.op, rhs);
          return acc;
        case "OPERATOR":
          acc.op = token;
          return acc;
        default:
          throw new Error("Unsupported tokenType: " + tokenType);
      }
    },
    { val: 0, op: "+" }
  );
  console.log(tokens, val.val);
  return val.val;
}

// evalExpression(parseExpression("1+2"), () => 2);
// evalExpression(parseExpression("a-2"), () => 2);
// evalExpression(parseExpression("a*c"), () => 2);
// evalExpression(parseExpression("a*c+d"), () => 2);
