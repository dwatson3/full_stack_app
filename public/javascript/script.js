$(function() {

	function loadBrews(){
		$.getJSON("/breweries").done(function(data) {
			data.breweries.forEach(function(brewery) {
				var html = breweryHtml(brewery);
					$(body).append(Html);
				});
			});
		}

// grabbing things from the database, and loading them into the HTML
	function breweryHtml(brewery) {
		return '<br><div data-id="' + brewery._id + '"><p><a href="/breweries/' + brewery._id + '/">' + brewery.name + 
          '</a></p><p>' + brewery.location + '</p><p>' + wine.city + '</p>'
          '<p><a href="/wines/' + wine._id + '/edit">Edit </a></p></div>';

	}		












});

// $(document).ready(function() {

// $("button").click(function() {
// 	var searchInfo = $(".locate").val();
// 	$(".display-results").empty()
// 	console.log(searchInfo)

// // $.ajax({
// // 	method: "GET",
// // 	url: "http://omdbapi.com/?s=" + searchInfo
// // })

// .done(function(data) {

// })
// })
// }