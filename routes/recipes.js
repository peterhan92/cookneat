const express = require("express"),
		router = express.Router(),
		Recipe = require("../models/recipe"),
		middleware = require("../middleware")

router
	// INDEX
	.get("/", middleware.savePath, function(req, res) {
		// Get all recipes from DB
		if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all recipes from DB
      Recipe.find({title: regex}, function(err, allRecipes){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allRecipes);
         }
      });
	  } else {
	      // Get all recipes from DB
	      Recipe.find({}, function(err, allRecipes){
	         if(err){
	             console.log(err);
	         } else {
	            if(req.xhr) {
	              res.json(allRecipes);
	            } else {
	              res.render("recipes/index",{recipes: allRecipes, page: 'recipes'});
	            }
	         }
	      });
	  }
	})
	// CREATE
	.post("/", middleware.isLoggedIn ,function(req, res) {
		// get data from form and add to recipes array
		var title = req.body.title;
		var prepTime = req.body.prepTime;
		var cookTime = req.body.cookTime;
		var serving = req.body.serving
		var image = req.body.image;
		var description = req.body.description;
		var ingredient = req.body.ingredient;
		var direction = req.body.direction;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newRecipe = {
			title: title, 
			prepTime: prepTime, 
			cookTime: cookTime,
			serving: serving, 
			image: image, 
			description: description,
			ingredient: ingredient,
			direction: direction,
			author:author
		}
		//Create a new Recipe and save to DB
		Recipe.create(newRecipe, function(err, newlyCreated) {
			if (err) {
				console.log(err);
			} else {
				// redirect to recipes page
				console.log(newlyCreated)
				req.flash("success", "Created Recipe!")
				res.redirect("/recipes");				
			}
		})
	})
	// NEW
	.get("/new", middleware.isLoggedIn, function(req, res) {
		res.render("recipes/new.ejs")
	})
	// SHOW
	.get("/:id", middleware.savePath,function(req, res) {
		// find the recipe with the provided ID
		Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe) {
			if (err) {
				console.log(err);
			} else {
				// render show template with that recipe
				res.render("recipes/show", {recipe: foundRecipe});
			}
		})
	})
	// EDIT
	.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res) {
			Recipe.findById(req.params.id, function(err, foundRecipe) {
				res.render("recipes/edit", {recipe: foundRecipe});
			})
	})
	// UPDATE
	.put("/:id", middleware.checkRecipeOwnership, function(req, res) {
		// find and update the correct recipe
		Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
			if (err) {
				res.redirect("back");
			} else {
				res.redirect("/recipes/" + req.params.id);
			}
		})
	})
	// DESTROY 
	.delete("/:id", middleware.checkRecipeOwnership, function(req, res) {
		Recipe.findByIdAndRemove(req.params.id, function(err) {
			if (err) {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			} else {
				req.flash("error", "Recipe successfully deleted");
				res.redirect("/recipes");
			}
		})
	})

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;