import {User} from "../models";
import {editableUserFields} from "../constants";

const toEditableUserFields = (userFields: Partial<User>) => Object.fromEntries(
  Object.entries(userFields).filter(([key]) => editableUserFields.includes(key))
);

export {
  toEditableUserFields
};