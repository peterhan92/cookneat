const mongoose = require("mongoose")

var recipeSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	prepTime: String,
	cookTime: String,
	serving: Number,
	ingredient: String,
	direction: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
})

module.exports = mongoose.model("recipe", recipeSchema);
