const userFieldLengths = {
  title: { max: 64 },
  fname: { max: 64 },
  lname: { max: 64 },
  email: { max: 128 },
  password: { min: 8 },
  street: { max: 128 },
  city: { max: 64 },
  zip: { max: 16 },
  country: { max: 2 },
  phone: { max: 32 },
  company: { max: 256 },
  website: { max: 512 }
};

const credFields = ['email', 'password'];
const editableUserFields = Object.keys(userFieldLengths).filter(field => !credFields.includes(field));

export {
  userFieldLengths,
  editableUserFields
};