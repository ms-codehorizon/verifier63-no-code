const A = /[A-Z]/;
const B = /\d/;

export function charClassA(value: string): boolean {
  return A.test(value);
}

export function charClassB(value: string): boolean {
  return B.test(value);
}
