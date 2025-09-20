export default function promiseAny<T extends readonly unknown[] | []>(
  iterable: T,
): Promise<Awaited<T[number]>> {
  return new Promise((resolve, reject) => {
    let pending = iterable.length;

    if (pending <= 0) {
      return reject(new AggregateError([], 'No promises provided'));
    }

    const errors: unknown[] = Array(pending);
    let resolved = false;

    iterable.forEach((item, index) => {
      Promise.resolve(item)
        .then((val) => {
          if (resolved !== true) {
            resolved = true;
            resolve(val as Awaited<T[number]>);
          }
        })
        .catch((e) => {
          errors[index] = e;
        })
        .finally(() => {
          pending--;

          if (pending <= 0 && resolved !== true) {
            reject(new AggregateError(errors, 'No promise could be fulfilled'));
          }
        });
    });
  });
}

// How to run: pnpm dlx tsx ./src/promiseAny.ts
const p0 = new Promise((_, reject) => {
  setTimeout(() => {
    reject(1);
  }, 200);
});
const p1 = new Promise((_, reject) => {
  setTimeout(() => {
    reject(2);
  }, 100);
});
const p2 = new Promise((_, reject) => {
  setTimeout(() => {
    reject(3);
  }, 10);
});

promiseAny([p0, p1, p2]).catch((e) => console.log('errors', e.errors));

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 200);
});
const p4 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 100);
});
const p5 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(3);
  }, 10);
});

promiseAny([p3, p4, p5]).then((val) => console.log('success', val));
