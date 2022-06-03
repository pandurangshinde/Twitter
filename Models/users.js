const mongoose = require('mongoose');

const Users = new mongoose.Schema(
	{
		Email:{
			type: String,
			required: true,
			unique: true
		},
		Password:{
			type: String,
			required: true
		},
		DisplayName: {
			type: String,
			required: true
		},
		UserName: {
			type: String,
			required: true,
			unique: true
		},
		Bio: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now()
		},
		LogoUri:
		{
			type: String,
			required: true
		},
		Base64:
		{
			type: String,
			required: true
		}
	}
);

module.exports = mongoose.model('Users', Users);