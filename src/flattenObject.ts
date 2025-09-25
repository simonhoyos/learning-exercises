type ObjectValue<T> =
  | T
  | { [key: string]: ObjectValue<T> }
  | Array<ObjectValue<T>>;

export default function squashObject<T>(
  obj: Record<string, ObjectValue<T>> | Array<ObjectValue<T>>,
  parentKey: string | null = null,
  result: Record<string, T> = {},
): Record<string, T> {
  return {
    ...Object.entries(obj).reduce<Record<string, T>>((obj, [key, value]) => {
      const newKey = [
        parentKey ?? '',
        (parentKey ?? '') !== '' && (key ?? '') !== '' ? '.' : '',
        key,
      ].join('');

      if (
        value != null &&
        typeof value === 'object' &&
        Array.isArray(value) === false
      ) {
        return squashObject(
          value as Record<string, ObjectValue<T>>,
          newKey,
          obj,
        );
      }

      if (Array.isArray(value)) {
        return squashObject(value, newKey, obj);
      }

      obj[newKey] = value;
      console.log({ newKey, value });
      console.log({ obj });

      return obj;
    }, result),
  };
}

// How to run: pnpm dlx tsx ./src/flattenObject.ts
console.log(
  squashObject({
    a: 'hi',
    b: {
      a: null,
      b: ['foo', '', null, 'bar'],
      d: 'hello',
      e: {
        a: 'yo',
        b: undefined,
        c: 'sup',
        d: 0,
        f: [
          { foo: 123, bar: 123 },
          { foo: 465, bar: 456 },
        ],
      },
    },
    c: 'world',
  }),
);
