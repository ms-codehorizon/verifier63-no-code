export const metrics = {
  record(name: string, value: boolean | number): void {
    console.log(`[metric] ${name}=${value}`);
  },
};
