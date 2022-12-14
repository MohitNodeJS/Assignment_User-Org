import joi from "joi";
const validationHelper = (route, method) => {
  let obj = {};
  switch (method) {
    case "put":
      obj = {
        "/api/user/update": userSchemaUpd,
        "/api/org/update/:id": orgSchema,
       
      };
      return obj[route];
      break;

    case "post":
      obj = {
        "/api/user/add": userSchema,
        "/api/user/login": userSchemaLogin,
        "/api/organization/add": orgSchema,
       
      };
      return obj[route];
    default:
  }
};

export default validationHelper;

const userSchema = joi.object({
  userName: joi.string().min(3).max(15).required(),
  firstName: joi.string().min(3).max(15).required(),
  lastName: joi.string().min(3).max(15).optional(),
  email: joi.string().email().min(5).max(50).required(),
  password: joi.string().min(5).max(15).required(),
  organization: joi
  .object({
    orgName: joi.string().min(3).max(15).required(),
    address: joi
      .object({
        orgAddress1: joi.string().min(3).max(15).required(),
        orgAddress2: joi.string().min(3).max(15).optional(),
        city: joi.string().min(2).max(15).required(),
        state: joi.string().min(2).max(15).required(),
        zipCode: joi.string().min(3).max(15).required(),
      })
      .optional(),
  })
  .optional(),
});
 

//login schema
const userSchemaLogin = joi.object({
  userName: joi.string().min(3).max(50).required(),
  password: joi.string().min(5).max(15).required(),
});

const userSchemaUpd = joi.object({
  userName: joi.string().min(3).max(15).required().required(),
  firstName: joi.string().min(3).max(15).required().optional(),
  lastName: joi.string().min(3).max(15).required().optional(),
  email: joi.string().email().min(5).max(50).optional(),
  password: joi.string().min(5).max(15).required().optional(),
  updatePassword:joi.boolean().optional(),
  organization: joi
    .object({
      orgName: joi.string().min(3).max(15).optional(),
      address: joi
        .object({
          orgAddress1: joi.string().min(3).max(15).optional(),
          orgAddress2: joi.string().min(3).max(15).optional(),
          city: joi.string().min(2).max(10).optional(),
          state: joi.string().min(2).max(10).optional(),
          zipCode: joi.string().min(3).max(10).optional(),
        })
        .optional(),
    })
    .optional(),
});

const orgSchema = joi.object({
    orgName: joi.string().min(3).max(15).required(),
    address: joi.object({
        orgAddress1: joi.string().min(3).max(15).required(),
        orgAddress2: joi.string().min(3).max(15).required(),
        city: joi.string().min(2).max(10).required(),
        state: joi.string().min(2).max(10).required(),
        zipCode: joi.string().min(3).max(10).required(),
      })
      .optional(),
  })
  .optional();



const orgSchemaUpd = joi.object({
  orgName: joi.string().min(3).max(15).required(),
  orgAddress1: joi.string().min(3).max(15).required(),
  orgAddress2: joi.string().min(3).max(15).required(),
  city: joi.string().min(2).max(10).required(),
  state: joi.string().min(2).max(10).required(),
  zipCode: joi.string().min(3).max(10).required(),
});
