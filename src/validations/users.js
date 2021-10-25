import joi from "joi";

const emailRegex =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const strongPassWordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const usersSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().pattern(new RegExp(emailRegex)).required(),
	password: joi.string().pattern(new RegExp(strongPassWordRegex)).required(),
});

export default usersSchema;
