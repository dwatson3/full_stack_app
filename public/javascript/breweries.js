$(function() {
	function loadBreweries() {
		$.getJSON("/breweries").done(function(data) {
			data.breweries.forEach(function(brewery) {
				var Html = breweryHtml(brewery);
				$('body').append(Html);
			});
		});		
	}

	function breweryHtml(brewery) {
		return '<br><ul><div data-id="' + brewery._id + 
						'"><li><a href="/breweries/' + brewery._id + 
						'/">' + brewery.name + 
    	      '</a></li><p>' + brewery.location + 
    	      '</p><p>' + brewery.city + '</p>'
      	    '<p><a href="/breweries/' + brewery.state + 
      	    '/edit">Edit </a></ul></div>';
	}

// loadBreweries();

// what if I don't want my Search Field to be hidden?

	$('#newBreweryLink').click(function(e) {

		e.preventDefault();

			var html = '<br><form id="newBrewSearchForm" action="#" method="POST' +
						 
						 '<div class="locate-beer">' +
						 '<label for="locate-beer">Location:</label>' +
						 '<input type="text" name="locate" id="locate" autofocus>' +
						 
						 '<div class="brewery-name">' +
						 '<label for="breweryName">Find Brewery By Name:</label>' +
						 '<input type="text" name="breweryName" id="breweryName" autofocus>' +

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

		$.ajax({
			// type: 'POST',
			method: "GET",
			url: '/breweries',
			// url: "http://api.brewerydb.com/v2/locations?key=" + process.env.BREWERY_SECRET
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