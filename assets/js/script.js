var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";
var searchBtnEl = $("#search-btn");
var recentListEl = $("#recent-list");
var currentTempEl = $("#current-temp");
var currentMaxTempEl = $("#current-max-temp");
var currentMinTempEl = $("#current-min-temp");
var currentWindEl = $("#current-wind");
var currentHumidEl = $("#current-humid");
var searchInputEl = $("#search-input");

var cityNameHeaderEl = $("#city-name-header");
var cityNameHeader = cityNameHeaderEl.text();
console.log(cityNameHeader);

var searchInput = "";


function init() {
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=Sydney" + "&appid=" + APIKey + "&units=metric";

    fetch(APIUrl , {
        method: 'GET', 
        credentials: 'same-origin', 
        redirect: 'follow', 
    })
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    currentTempEl.text(data.main.temp + "°C")
    currentWindEl.text(data.wind.speed + "km/h")
    currentHumidEl.text(data.main.humidity + "%")

    
    
    console.log(data);
    console.log(data.main.temp);
    });
}


//console.log($(searchInputEl).text());


function citySearch() {
    //event.preventDefault();

    var searchInput = searchInputEl.val();
    if (!searchInput) {
        alert('Please enter a value into the search bar.');
        return;
    }

    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey + "&units=metric";

    fetch(APIUrl , {
        method: 'GET', 
        credentials: 'same-origin', 
        redirect: 'follow', 
    })
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Invalid city name');
    })
    .then(function (data) {
    currentTempEl.text(data.main.temp + "°C")

    searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
    cityNameHeaderEl.text(searchInput);

    console.log(data);
    console.log(data.main.temp);
    })
    .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
        alert("Please enter a valid city name");
    });

   


};


$(document).on('keypress',function(event) {
    if(event.which == 13) {
        citySearch();    
    } else {
        return;
    }
});

console.log($("search-input").val());

searchBtnEl.click(citySearch);

init();



