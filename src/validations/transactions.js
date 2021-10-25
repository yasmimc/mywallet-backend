import joi from "joi";

const transactionsSchema = joi.object({
	userId: joi.number().min(1).required(),
	type: joi.number().min(1).required(),
	value: joi.string().min(1).required(),
	description: joi.string().allow(null, ""),
});

export default transactionsSchema;
