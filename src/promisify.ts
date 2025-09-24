type Callback<T> = (error: Error | null, result?: T) => void;

export function promisify<T, A extends unknown[]>(
  func: (...args: [...A, Callback<T>]) => void,
): (this: unknown, ...args: A) => Promise<T | undefined> {
  return function (this: unknown, ...args: A) {
    return new Promise((resolve, reject) => {
      func.call(this, ...args, (error: Error | null, result?: T) => {
        if (error != null) {
          reject(error);
        }

        resolve(result);
      });
    });
  };
}

// How to run: pnpm dlx tsx ./src/promisify.ts
function foo(
  url: string,
  options: Record<string, unknown>,
  callback: Callback<unknown>,
) {
  fetch(url, options)
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
}

const promisifiedFoo = promisify(foo);
const data = await promisifiedFoo(
  'https://jsonplaceholder.typicode.com/todos/1',
  { foo: 1 },
);
console.log(data);

function asyncAdd(
  this: { base: number },
  a: number,
  b: number,
  cb: Callback<unknown>,
) {
  setTimeout(() => {
    cb(null, a + b + this.base);
  }, 10);
}

const promisifiedAdd = promisify(asyncAdd);
const obj = { base: 5, add: promisifiedAdd };
const result = await obj.add(17, 19);
console.log(result);
