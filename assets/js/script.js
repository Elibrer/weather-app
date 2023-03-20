var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";
var cityNameHeader = $("#city-name-header");
var searchBtnEl = $("#search-btn");



console.log("HELOO???");

var cityName;



var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

$(searchBtnEl).click(function (event) {
    event.preventDefault();
    console.log("hello");
    $(cityNameHeader).text("Adelaide");

    console.log(cityNameHeader);
  
});



function callCity(event) {
    event.preventDefault();

    var searchInput = $('#search-input').val();

    if (!searchInput) {
        alert('Please enter a value into the search bar.');
        return;
    }

    constructSearch();
    console.log(searchInput);
}





// $(searchBtnEl).click(updateCity);