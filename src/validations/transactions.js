import joi from "joi";

const transactionsSchema = joi.object({
	type: joi.number().min(1).required(),
	value: joi.number().min(1).required(),
});

export default transactionsSchema;
