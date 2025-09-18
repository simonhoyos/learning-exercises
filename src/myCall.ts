declare global {
  interface Function {
    myCall<T, E extends unknown[], R>(
      this: Function,
      context: T,
      ...args: E
    ): R;
  }
}

Function.prototype.myCall = function (thisArg, ...argArray) {
  const context = thisArg != null ? Object(thisArg) : globalThis;
  const key = Symbol();

  context[key] = this;

  const result = context[key](...argArray);

  delete context[key];

  return result;
};

const str = 'hello world';
const splitString = String.prototype.split.myCall(str, ' ');
console.log('splitString', splitString);

const arr = [1, 2, 3, 4, 5];
const inArray = Array.prototype.includes.myCall(arr, 3);
console.log('inArray', inArray);

function showThis<T extends { [key: string]: unknown }>(this: T) {
  console.log(this.constructor.name);
}

showThis.myCall(new Date());
// showThis.myCall(new FormData());
showThis.myCall({ name: 'Custom Object' });
showThis.myCall(arr);

showThis.myCall(null);
showThis.myCall(undefined);

showThis.myCall(str);
showThis.myCall(1);
showThis.myCall(true);
showThis.myCall(NaN);
