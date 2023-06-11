/**
 * Return a new object that contains the reference objects properties which also exist on the comparison object
 * @param referenceObject
 * @param comparisonObject
 */
const intersectProperties = <T extends object>(
  referenceObject: T,
  comparisonObject: Partial<T>
): Partial<T> => Object.keys(referenceObject).reduce((acc, key) => {
    const keyOfT = key as keyof T;
    if (keyOfT in comparisonObject) acc[keyOfT] = referenceObject[keyOfT];
    return acc;
  }, {} as Partial<T>);

export {
  intersectProperties
};