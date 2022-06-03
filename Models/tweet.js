const mongoose = require('mongoose');

const Tweets = new mongoose.Schema(
	{
		author: {
			type: Object,
			required: true
		},
		textContent: {
			type: String,
			required: true
		},
		likes: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now()
		}
	}
);



module.exports = mongoose.model('Tweets', Tweets);