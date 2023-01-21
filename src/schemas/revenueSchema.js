import joi from "joi";

const revenueSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().required(),
});

export default revenueSchema;
