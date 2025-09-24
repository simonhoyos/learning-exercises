export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, unknown>;
export type ClassArray = Array<ClassValue>;

function convertObjectToString(obj: ClassDictionary) {
  return Object.entries(obj)
    .filter(([, value]) => Boolean(value) === true)
    .map(([key]) => `${key}`)
    .join(' ');
}

// How to run: pnpm dlx tsx ./src/classNames.ts
export default function classNames(...args: Array<ClassValue>): string {
  if (args.length <= 0) return '';

  return args
    .filter((value) => value != null && Boolean(value) === true)
    .map((value) => {
      if (value == null || typeof value === 'boolean') return '';

      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }

      if (Array.isArray(value)) {
        return classNames(...value);
      }

      return convertObjectToString(value);
    })
    .join(' ')
    .trim();
}
