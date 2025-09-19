export function throttle<T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function execute<E>(this: E, ...args: T) {
    if (timer != null) {
      return;
    }

    timer = setTimeout(() => {
      timer = null;
    }, wait);

    callback.apply(this, args);
  }

  return execute;
}

// How to run: pnpm dlx tsx ./src/throttle.ts
const throttledLog = throttle((message: string) => console.log(message), 500);

throttledLog('Hello'); // executed
throttledLog('Throttled!'); // skipped
setTimeout(() => throttledLog('Hello after 1 second!'), 1000);
