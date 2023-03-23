var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";
var searchBtnEl = $("#search-btn");
var recentListEl = $("#recent-list");
var forecastEl = $("#forecast-list");
var currentDateEl = $("#current-date");
var currentTimeEl = $("#current-time");
var currentTempEl = $("#current-temp");
var currentMaxTempEl = $("#current-max-temp");
var currentMinTempEl = $("#current-min-temp");
var currentWindEl = $("#current-wind");
var currentHumidEl = $("#current-humid");
var searchInputEl = $("#search-input");
var currentIconEl = $("#current-icon");

console.log(searchInputEl);

var cityNameHeaderEl = $("#city-name-header");
var currentBool = true;
var weatherForecast = "";
var searchInput = "";
var imgID = "";

var recentCitiesArr = [];



function init() {
    var APIUrl = "https://api.openweathermap.org/data/2.5/weather?q=Sydney" + "&appid=" + APIKey + "&units=metric";

    displayDate()

    var storedRecentCities = JSON.parse(localStorage.getItem("recentSearch"));
    console.log(storedRecentCities)
    if (storedRecentCities !== null) {
        recentCitiesArr = [...new Set(storedRecentCities)];
    }

    

    recentCitiesArr.sort(function (a, b) {
        return b.score - a.score;
    });

    renderCityBtns();

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
    weatherMain = data.weather[0].main;
    
    iconSwitch(data);


     });
}



//Selects icon based on current weather data

function iconSwitch(currentWeatherData, weatherData){

    if (currentBool === true){
        weatherMain = currentWeatherData.weather[0].main;
    } else {
        weatherMain = weatherForecast;
    }
    
    switch (weatherMain) {
       
        case "Clouds":
            imgID = "02d";
            break;
        case "Thunderstorm":
            imgID = "11d";            
            break;
        case "Drizzle":
            imgID = "09d";            
            break;
        case "Rain":
            imgID = "10d";            
            break;
        case "Snow":
            imgID = "13d";            
            break;
        case "Clear":
            imgID = "01d";            
            break;
        default:
            imgID = "50d";            
            break;
    }

    currentIconEl.attr("src", "https://openweathermap.org/img/wn/" + imgID + "@2x.png");

}

function citySearch() {
    currentIconEl.removeAttr("src");
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
    .then(function (currentWeatherData) {

        storeItems ();
        storeRecent();
        renderCityBtns();

        console.log(currentWeatherData);
        searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);

        currentTempEl.text(currentWeatherData.main.temp + "°C")
        currentWindEl.text(currentWeatherData.wind.speed + "km/h")
        currentHumidEl.text(currentWeatherData.main.humidity + "%")
        currentBool = true;

        iconSwitch(currentWeatherData);

        cityNameHeaderEl.text(searchInput);

        var city = {
            lat: currentWeatherData.coord.lat,
            lon: currentWeatherData.coord.lon,
        };

        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + city.lat + "&lon=" + city.lon + "&appid=" + APIKey + "&units=metric&cnt=40";
        
        

        fetch(fiveDayURL, {
            method: "GET",
            credentials: "same-origin",
            redirect: "follow",
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then (function (weatherData) {
            console.log(weatherData);
            currentBool = false;

            var filteredList =  (weatherData.list.length / 5);
            forecastEl.innerHTML = "";
            forecastEl.text("");

            for (i = 5; i < weatherData.list.length; i = i + filteredList) {
                console.log(imgID);

                weatherForecast = weatherData.list[i].weather[0].main;

                iconSwitch(weatherData)

                var forecastData = weatherData.list[i];
                var forecastDate = forecastData.dt_txt.slice(0, 10);
                var forecastTemp = forecastData.main.temp;
                var forecastWind = forecastData.wind.speed;
                var forecastHumid = forecastData.main.humidity;

                var forecastContainer = document.createElement('article');
                forecastContainer.setAttribute('class', 'p-2 bg-lighter border align-items-middle');
                forecastContainer.setAttribute('id', 'forecast-container');
                forecastEl.attr('class', 'text-center d-flex flew-row justify-content-between p-3')
                forecastEl.append(forecastContainer);

                //The ` character... super handy!
                forecastContainer.innerHTML = `
                    <h4>${forecastDate}</h4>
                    <img src="https://openweathermap.org/img/wn/${imgID}@2x.png">
                    <p>Temp: ${forecastTemp}</p>
                    <p>Wind Speed: ${forecastWind}</p>
                    <p>Humidity: ${forecastHumid}</p>
                `;

            }
        })
    })
    .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
        alert("Please enter a valid city name");
    });
};




function recentBtnPress(event) {
    
    var recentBtns = event.target;

    var buttonContent = recentBtns.textContent;

    console.log(buttonContent)
    searchInputEl.val(buttonContent);

    //recentCitiesArr = [...new Set(recentCitiesArr)];

    citySearch();
}


function renderCityBtns() {
    searchInputEl.val('');
    recentListEl.html('');

    var uniqueCities = {};
  
    //For loop to sort the appended buttons in the reverse order, keeping most recent at top
    for (var i = recentCitiesArr.length - 1; i >= 0; i--) {
        console.log(i)
        var recentCity = recentCitiesArr[i];
  
        if (!uniqueCities[recentCity]) {

        var cityBtn = document.createElement('button');
        cityBtn.textContent = recentCity;
        cityBtn.setAttribute('data-index', i);
        cityBtn.setAttribute('class', 'col-12 btn btn-secondary m-1');
  
        uniqueCities[recentCity] = true;
  
        recentListEl.append(cityBtn);
      } else {

        recentCitiesArr.splice(i, 1);

        recentCitiesArr.unshift(recentCity);
      }
    }
  }

function storeRecent() {
    localStorage.setItem("recentSearch", JSON.stringify(recentCitiesArr));
}

function storeItems () {

    var cityText = searchInputEl.val().trim();
    if (cityText === "") {
      return;
    }
    cityText = cityText.charAt(0).toUpperCase() + cityText.slice(1);
    console.log(cityText);

    recentCitiesArr.push(cityText);

    searchInputEl.value = "";
    return(recentCitiesArr)  
};

function displayDate() {
    var currentDate = dayjs().format('YY-MM-DD hh:mm:ss'); 
    currentDateEl.text(currentDate);
    setInterval(displayDate, 1000);
}


$(document).on('keypress',function(event) {
    if(event.which == 13) {
        citySearch();    
    } else {
        return;
    }
});


searchBtnEl.click(citySearch);
recentListEl.click(recentBtnPress);
init();