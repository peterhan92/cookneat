const express = require("express"),
			router = express.Router({mergeParams: true}),
			Recipe = require("../models/recipe"),
			Comment = require("../models/comment"),
			middleware = require("../middleware")

router
	// Comments New
	.get("/new", middleware.isLoggedIn, function(req, res) {
		Recipe.findById(req.params.id, function(err, recipe) {
			if (err) {
				console.log(err);
			} else {
				res.render("comments/new", {recipe: recipe});
			}
		})
	})
	// Comments Create
	.post("/", middleware.isLoggedIn, function(req, res) {
		// look up recipe using id
		Recipe.findById(req.params.id, function(err, recipe) {
			if (err) {
				console.log(err);
				res.redirect("/recipe")
			} else {
				Comment.create(req.body.comment, function(err, comment) {
					if (err) {
						req.flash("error", "Something went wrong");
						console.log(err);
					} else {
						// add username and id to comments
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						// save comments
						comment.save()
						recipe.comments.push(comment);
						recipe.save();
						req.flash("success", "Successfully added comment");
						res.redirect("/recipes/" + recipe._id);
					}
				})
			}
		})
	})
	// Edit Comments
	.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
			}
		})
	})
	// UPDATE
	.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.redirect("/recipes/" + req.params.id);
			}
		})
	})
	// DESTROY
	.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
		Comment.findByIdAndRemove(req.params.comment_id, function(err) {
			if (err) {
				res.redirect("back");
			} else {
				req.flash("success", "Comment deleted");
				res.redirect("/recipes/" + req.params.id)
			}
		});
	})

module.exports = router;