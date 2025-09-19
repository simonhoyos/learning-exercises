export default function promiseAll<T extends readonly unknown[]>(
  iterable: T,
): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error - Type initialization is any[]
    const res: { -readonly [P in keyof T]: Awaited<T[P]> } = Array(
      iterable.length,
    );

    let pending = iterable.length;

    if (pending === 0) {
      resolve(res as { -readonly [P in keyof T]: Awaited<T[P]> });
      return;
    }

    iterable.forEach((item, i) => {
      Promise.resolve(item)
        .then((val) => {
          res[i] = val as Awaited<T[typeof i]>;

          pending--;

          if (pending === 0) {
            resolve(res);
          }
        })
        .catch(reject);
    });
  });
}

// How to run: pnpm dlx tsx ./src/promiseAll.ts
// Tuple - output should be in the same order as input
console.log(
  await promiseAll([
    Promise.resolve(1),
    2,
    'hello',
    new Promise((res) => setTimeout(() => res(3), 1000)),
    true,
  ]),
);
