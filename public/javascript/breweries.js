$(function() {
	function loadBreweries() { // is this loadBreweries function working?
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
    	      '</p><p>' + brewery.city + '</p>'+
      	    '<p><a href="/breweries/' + brewery.state + 
      	    '/edit">Edit </a></ul></div>';
	}

loadBreweries();
// what if I don't want my Search Field to be hidden?
// separate backend route for each one
// write the code for 

	// $('#newBreweryLink').click(function(e) {
	// 	e.preventDefault();

	// 		var html = 

	// 					 // '<br><form id="newBrewSearchForm" action="#" data-url="/search/location" method="POST>' +
	// 					 '<br><form id="breweryLocation" action="#" data-url="/search/location" method="POST>' +
						 
	// 					 '<div class="locate-beer"' +
	// 					 '<label for="locate-beer">Location:</label>' +
	// 					 '<input type="text" name="locate" id="locate" autofocus>' +
	// 					 '<br><input type="submit" value="Submit" class="button">' +
	// 					 '</form>' +

	// 					 '<form id ="breweryNameSearch" action="#" data-url="/search/breweries">' +
	// 					 '<div class="brewery-name">' +
	// 					 '<label for="breweryName">Find Brewery By Name:</label>' +
	// 					 '<input type="text" name="breweryName" id="breweryName" autofocus>' +
	// 					 '<br><input type="submit" value="Submit" class="button">' +
	// 					 '</form>' +

	// 					 '<form id ="beerSearch" action="#" data-url="/search/beer">' +
	// 					 '<div class="search-beer">' +
	// 					 '<label for="beerCurious">Curious about a beer?</label>' +
	// 					 '<input type="text" name="beerCurious" id="beerCurious" autofocus>' +
	// 					 '<br><input type="submit" value="Submit" class="button">' +
	// 					 '</form>';

	// $('h4').after(html);
	// });


		$('.location-search').submit(function(e) {
		e.preventDefault();
		console.log(this);
			var locate = $('#locate').val();
			var data = {brewery: {location: locate}};
		console.log(data);
		breweryHtml();
	});	

		// $('.brewery-name').submit(function(e) {
		// e.preventDefault();
		// console.log(this);
		// 	var breweryName = $('#breweryName').val();
		// 	var data = {brewery: {name:breweryName}};
		// });

		// $('.search-beer').submit(function(e) {
		// e.preventDefault();
		// console.log(this);
		// 	var beerCurious = $('#beerCurious').val();
		// 	var data = {brewery: {beerType:beerCurious}};	
		// });


		$.ajax({
				method: "GET", // this should be GET, to make sure this matches to the app.get
				// url: '/search/breweries',
				url: '/breweries/index',
				data: data,
				dataType: 'json'
		}).done(function( data, textStatus, jqXHR ) { // breweryApiResponse is a parameter
				console.log(data); 
		
			// created the variable breweries for data	
			var breweries = breweryApiResponse.data;  
		
		 	// using a forEach function populating brewery info
			breweries.forEach(function(brewery) {
				// here within the body with the brewery.name
				$('body').append(brewery.name); 
				$('body').append(brewery.location, brewery.lat, brewery.long);
					console.log(brewery.location);
				// $('body').append(brewery.beerType);
				// $('#breweryLocation').remove();
				// $('#breweryNameSearch').remove();
				// $('#beerSearch').remove();
			});
		});
			// removing the form after brewery info has populated here 
	});
});



// $('#newBrewSearchForm').submit(function(e) {
		// $('#breweryLocation').submit(function(e) {
		// e.preventDefault();
		// console.log(this);
		// 	var locate = $('#locate').val();
		// 	var data = {brewery: {location: locate}};
		// 	console.log(data);
		// var breweryName = $('#breweryName').val();
		// var beerCurious = $('#beerCurious').val();
		// })

		// $.ajax({
		// 		method: "GET",
		// 		url: '/search/breweries',
		// 		data: data,
		// 		dataType: 'json'
		// }).done(function( data, textStatus, jqXHR ) {
		// 		console.log(data);
		// })

		// $.ajax({
		// 		method: "GET",
		// 		url: '/search/breweries',
		// 		data: data, 
		// 		dataType: 'json'			
		// }).done(function( data, textStatus, jqXHR) {
		// 		console.log(data);
		// })