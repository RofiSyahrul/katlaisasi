export function enumerate<T extends string | number | symbol = string>(...values: T[]): string {
  let result = '';
  const { length } = values;

  values.forEach((value, index) => {
    const stringifiedValue = String(value);
    if (index === length - 1) {
      result += stringifiedValue;
    } else if (index === length - 2) {
      result += `${stringifiedValue} dan `;
    } else {
      result += `${stringifiedValue}, `;
    }
  });

  return result;
}
