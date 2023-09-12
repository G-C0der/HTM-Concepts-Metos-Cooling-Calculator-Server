import {CalculatorParams} from "../models";
import {editableCalculatorParamsFields} from "../constants";

const toEditableCalculatorParamsFields = (calculatorParamsFields: Partial<CalculatorParams>) => Object.fromEntries(
  Object.entries(calculatorParamsFields).filter(([key]) => editableCalculatorParamsFields.includes(key))
);

export {
  toEditableCalculatorParamsFields
};