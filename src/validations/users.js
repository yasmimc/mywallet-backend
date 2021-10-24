import joi from "joi";

const emailRegex =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const usersSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().pattern(new RegExp(emailRegex)).required(),
	password: joi.string().min(6).required(),
});

export default usersSchema;
