$(function() {
	function loadBreweries() {
		$.getJSON("/breweries").done(function(data) {
			data.breweries.forEach(function(brewery) {
				var Html = breweryHtml(brewery);
				$('body').append(html);
			});
		});		
	}

function breweryHtml(brewery) {
	return '<br><div data-id="' + brewery._id + '"><p><a href="/breweries/' + brewery._id + '/">' + brewery.name + 
          '</a></p><p>' + brewery.location + '</p><p>' + brewery.city + '</p>'
          '<p><a href="/breweries/' + brewery.state + '/edit">Edit </a></p></div>';
}

loadBreweries();

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

$('body h2').after(html);

$('#newBrewSearchForm').submit(function(e) {
	e.preventDefault();

	var locate = $('#locate').val();
	var breweryName = $('#breweryName').val();
	var beerCurious = $('#beerCurious').val();

	var data = {brewery: {location: locate, name:breweryName, beerType:beerCurious}};

	$.ajax({
		type: 'POST',
		url: '/breweries',
		data: data,
		dataType: 'json',
	}).done(function(data) {
		var myHtml = breweryHtml;
		$('body').append(myHtml);
		$('newBrewSearchForm').remove();
		console.log(data);
		});
	});				
});




});