export const validUserNamePattern = '^[a-zA-Z][a-zA-Z\\s]{0,18}[a-zA-Z]$';

const alphabetAndSpaceRegExp = new RegExp(validUserNamePattern);

export function isUserNameValid(userName: string) {
  return alphabetAndSpaceRegExp.test(userName);
}
