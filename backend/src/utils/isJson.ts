export function isJSON(string: string): unknown {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}
