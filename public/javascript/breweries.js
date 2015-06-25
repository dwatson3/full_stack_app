$(function() {
	function loadBreweries() { // is this loadBreweries function working??
		$.getJSON("/breweries").done(function(data) {
			data.breweries.forEach(function(brewery) {
				var Html = breweryHtml(brewery);
				$('body').append(Html);
			});
		});		
	}

// two different forms for two different actions

	function breweryHtml(brewery) {
		return '<br><ul><div data-id="' + brewery._id + 
						'"><li><a href="/breweries/' + brewery._id + // I should get rid of this li stuff
						'/">' + brewery.name + 
    	      '</a></li><p>' + brewery.location + // I should get rid of this li stuff
    	      '</p><p>' + brewery.city + '</p>'
      	    '<p><a href="/breweries/' + brewery.state + 
      	    '/edit">Edit </a></ul></div>';
	}

// loadBreweries();
// what if I don't want my Search Field to be hidden?
// separate backend route for each one
// write the code for 

	$('#newBreweryLink').click(function(e) {

		e.preventDefault();

			var html = '<br><form id="newBrewSearchForm" action="#" data-url="/search/location" method="POST'> +
						 
						 '<div class="locate-beer"' +
						 '<label for="locate-beer">Location:</label>' +
						 '<input type="text" name="locate" id="locate" autofocus>' +
						 '<br><input type="submit" value="Submit" class="button">' +
						 '</form>' +

						 '<form action="#" data-url="/search/breweries">' +
						 '<div class="brewery-name">' +
						 '<label for="breweryName">Find Brewery By Name:</label>' +
						 '<input type="text" name="breweryName" id="breweryName" autofocus>' +
						 '<br><input type="submit" value="Submit" class="button">' +
						 '</form>' +

						 '<form action="#" data-url="/search/beer">' +
						 '<div class="search-beer">' +
						 '<label for="beerCurious">Curious about a beer?</label>' +
						 '<input type="text" name="beerCurious" id="beerCurious" autofocus>' +
						 '<br><input type="submit" value="Submit" class="button">' +
						 '</form>';

	$('body h4').after(html);

	$('#newBrewSearchForm').submit(function(e) {
		e.preventDefault();
		console.log("submit");

		var locate = $('#locate').val();
		var breweryName = $('#breweryName').val();
		var beerCurious = $('#beerCurious').val();

		var data = {brewery: {location: locate, name:breweryName, beerType:beerCurious}};

// another AJAX for Geolocation

		$.ajax({
			method: "GET",
			url: '/breweries',
			data: data,
			dataType: 'json',
		
			}).done(function(breweryApiResponse) {
				var breweries = breweryApiResponse.data;
				breweries.forEach(function(brewery) {
					$('body').append(brewery.name);
				})

				$('newBrewSearchForm').remove();
				}).fail(function(error) {
					console.log("error", error);
				})
			});				
});




});