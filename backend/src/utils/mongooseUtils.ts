export const ToQuery = (obj) =>
  Object.keys(obj)
    .map((key) => ({
      [key]: {
        $regex: new RegExp(`^${obj[key]}`, 'g'),
      },
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export const Convert = {
  convertToTuple: (arr: string[]): [string, ...string[]] => {
    if (arr === undefined) {
      throw new Error('Array cannot be undefined');
    }
    return [arr[0] as string, ...arr.slice(1)];
  },
};
