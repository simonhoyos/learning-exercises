declare global {
  interface Array<T> {
    myReduce(
      this: T[],
      callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number,
        array: T[],
      ) => T,
    ): T;
    myReduce(
      this: T[],
      callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number,
        array: T[],
      ) => T,
      initialValue: T,
    ): T;
    myReduce<U>(
      this: T[],
      callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[],
      ) => U,
      initialValue: U,
    ): U;
  }
}

function assertNotNull<T>(arg: T, message: string) {
  if (arg == null) throw new Error(message);

  return arg;
}

Array.prototype.myReduce = function <T, U>(
  this: T[],
  callbackFn: (
    previousValue: T | U,
    currentValue: T,
    currentIndex: number,
    array: T[],
  ) => T | U,
  initialValue?: U,
) {
  const first = this.at(0);

  let acc: T | U = assertNotNull(
    initialValue ?? first,
    'Initial value could not be determined',
  );

  const start = initialValue != null ? 0 : 1;

  for (let i = start; i < this.length; i++) {
    const current = this.at(i);

    if (current == null) continue;

    acc = callbackFn(acc, current, i, this);
  }

  return acc;
};

function addNumbers(a: number, b: number) {
  return a + b;
}

function combineObj(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}

function mapChars(a: Record<string, number>, b: string) {
  a[b] = a[b] != null ? a[b] + 1 : 1;

  return a;
}

console.log([1, 2, 3, 4, 5].myReduce(addNumbers));
console.log([1, 2, 3, 4, 5].myReduce(addNumbers, 0));
// console.log([{ foo: 'bar' }, { bar: 'foo' }].myReduce(combineObj));
console.log([{ foo: 'bar' }, { bar: 'foo' }].myReduce(combineObj, {}));
console.log(['a', 'b', 'c', 'b', 'd', 'a'].myReduce(mapChars, {}));
