/**
 * Replace the special regular expression characters with their escaped versions for usage with RegExp
 * @param input
 */
const escapeForRegExp = (input: string) => {
  return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export {
  escapeForRegExp
};