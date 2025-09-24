type Fn<T> = (this: unknown, arg: T) => unknown;

export default function memoize<T>(fn: Fn<T>): Fn<T> {
  const map = new Map();

  return function (this: unknown, arg: T) {
    if (map.get(arg) != null) {
      console.log('From cache');
      return map.get(arg);
    } else {
      map.set(arg, fn.call(this, arg));
    }

    return map.get(arg);
  };
}

function expensiveFunction(n: number) {
  console.log('Computing...');
  return n * 2;
}

// How to run:
const memoizedExpensiveFunction = memoize(expensiveFunction);
console.log(memoizedExpensiveFunction(5));
console.log(memoizedExpensiveFunction(5));
console.log(memoizedExpensiveFunction(10));
console.log(memoizedExpensiveFunction(10));
