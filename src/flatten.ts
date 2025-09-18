type Optional<T> = T | undefined | null;
type ArrayValue<T> = Optional<T> | Array<ArrayValue<T>>;

export function flatten<T>(
  value: Array<ArrayValue<T>>,
  level: number = Infinity,
) {
  const res: Array<ArrayValue<T>> = [];

  for (let i = 0; i < value.length; i++) {
    const current = value.at(i);

    if (Array.isArray(current) === true && level > 0) {
      res.push(...flatten(current, level - 1));
    } else {
      res.push(current);
    }
  }

  return res;
}

// How to run: pnpm dlx tsx ./src/flatten.ts
const nestedArray = [1, [2, [3, null]], 4, undefined, [5, [6, [7]]], null];

console.log(flatten(nestedArray));
console.log(flatten(nestedArray, 1));
console.log(flatten(nestedArray, 2));
console.log(flatten(nestedArray, 3));
