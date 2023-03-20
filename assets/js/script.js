var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";
var searchBtnEl = $("#search-btn");
var recentListEl = $("#recent-list");
var mainTempEl = $("#main-temp");
var mainWindEl = $("#main-wind");
var mainHumidEl = $("#main-humid");

var cityNameHeader = $("#city-name-header");


function defaultPage() {

}


//console.log($(searchInputEl).text());


$(searchBtnEl).click(function (event) {
    event.preventDefault();
    var searchInputEl = $("#search-input");

    console.log($(searchInputEl).text());

    //$(cityNameHeader).text() = $(searchInputEl).text();

    // var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + $(searchInputEl).text() + "&appid=" + APIKey;


    // fetch(APIUrl , {
    //     method: 'GET', //GET is the default.
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     redirect: 'follow', 
    // })
    // .then(function (response) {
    // return response.json();
    // })
    // .then(function (data) {
    // console.log(data);
    // });

    //$(cityNameHeader).text($("#search-input").val());


  
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
    return(searchInput);
}





// $(searchBtnEl).click(updateCity);