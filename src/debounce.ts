export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function execute<E>(this: E, ...args: T) {
    if (timer != null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => callback.apply(this, args), delay);
  }

  return execute;
}

// How to run: pnpm dlx tsx ./src/debounce.ts
const debouncedLog = debounce((message: string) => console.log(message), 500);

debouncedLog('Hello'); // skipped
debouncedLog('Hello, again!');
setTimeout(() => debouncedLog('Hello after 1 second!'), 1000);
