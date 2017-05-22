const Recipe = require("../models/recipe"),
			Comment = require("../models/comment")
// All middleware
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
	// is user logged in?
	if (req.isAuthenticated()) {
		Recipe.findById(req.params.id, function(err, foundRecipe) {
			if (err) {
				req.flash("error", "Recipe not found")
				res.redirect("/recipe");
			} else {
				// does user own the recipe?
				if (foundRecipe.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that")
					res.redirect("/recipes/" + req.params.id);
				}
			}
		})
	} else {
		req.flash("error", "Login Required")
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	// is user logged in?
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				req.flash("error", "Login Required"); 
				res.redirect("/login");
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Login Required");
	res.redirect("/login");
}

middlewareObj.savePath = function(req, res, next) {
	req.session.redirectTo = "/recipes" + req.path;
	next();
}

module.exports = middlewareObj