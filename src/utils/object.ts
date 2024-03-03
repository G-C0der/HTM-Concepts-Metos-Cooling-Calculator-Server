import {isEqual} from "lodash";

/**
 * Return two new objects that contain the properties that have different values
 * @param oldData
 * @param newData
 */
const getChangedProperties = <T extends object>(
  oldData: T,
  newData: T
): { oldData: Partial<T>, newData: Partial<T> } => Object.keys(oldData).reduce((acc, key) => {
  const keyOfT = key as keyof T;
  let oldProp = oldData[keyOfT];
  let newProp = newData[keyOfT];

  if (typeof oldProp === 'string' && isJsonString(oldProp)) oldProp = JSON.parse(oldProp);
  if (typeof newProp === 'string' && isJsonString(newProp)) newProp = JSON.parse(newProp);

  if (keyOfT in newData && !isEqual(oldProp, newProp)) {
    acc['oldData'][keyOfT] = oldProp;
    acc['newData'][keyOfT] = newProp;
  }
  return acc;
}, { oldData: {}, newData: {} } as { oldData: Partial<T>, newData: Partial<T> });

/**
 * Helper function to check if a string is a valid JSON string
 * @param str
 */
const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export {
  getChangedProperties
};
