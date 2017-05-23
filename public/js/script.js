$('#recipe-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/recipes?' + search, function(data) {
    $('#recipe-grid').html('');
    data.forEach(function(recipe) {
      $('#recipe-grid').append(`
        <div class="col-sm-6 col-md-4">
			<a href="/recipes/${ recipe._id }">
				<div class="thumbnail">
					<img class="preview" src="${ recipe.image }">
					<div class="caption">
						<p class="thumbnail-title">${ recipe.title }</p>
						<p class="thumbnail-username">${ recipe.author.username }</p>
					</div>
				</div>
			</a>
		</div>
      `);
    });
  });
});

$('#recipe-search').submit(function(event) {
  event.preventDefault();
});