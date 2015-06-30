$(function() {
	console.log("working");

  function initialize() {
	var mapCanvas = document.getElementById('map-canvas');

   var mapOptions = {
     center: new google.maps.LatLng(37.7876973, -122.3973736),
     zoom: 11,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   map = new google.maps.Map(mapCanvas, mapOptions);
  }

// initialize();

// created a simple ajax call to show my data on the show page
	$(".locate").submit(function(e) {
		var searchInfo = $('#inputLocate').val();
		$("#inputLocate").html("");
		console.log(searchInfo);

	$.ajax({
				method: "GET",
				// url: 'https://api.brewerydb.com/v2/search?q=key=' + process.env.BREWERY_SECRET + '&format=json' + searchInfo,
				url: 'https://api.brewerydb.com/v2/search?q=' + searchInfo + '&key=' + process.env.BREWERY_SECRET + '&format=json',
				jsonp: 'callback',
				dataType: 'jsonp',
		
		}).done(function(data) {
				console.log(data);
				data.data.forEach(function(brew) { // not sure if this should be data.data.forEach instead
					$('.resultsGoHere').append("<li>" + brew.name + "</li>" + "<li>" + brew.website + "</li>" + "<li>" + brew.images[1] + "</li>");
				});
		});
	});
});