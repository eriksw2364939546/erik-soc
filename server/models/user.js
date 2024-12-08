import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	login: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false,
		default: ""
	}
})

const User = model('User', userSchema)

export default User

