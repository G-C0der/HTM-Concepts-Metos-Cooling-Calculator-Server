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
    if (keyOfT in newData && oldData[keyOfT] !== newData[keyOfT]) {
      acc['oldData'][keyOfT] = oldData[keyOfT];
      acc['newData'][keyOfT] = newData[keyOfT];
    }
    return acc;
  }, { oldData: {}, newData: {} } as { oldData: Partial<T>, newData: Partial<T> }
);

export {
  getChangedProperties
};