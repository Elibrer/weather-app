var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";
var searchBtnEl = $("#search-btn");
var delBtnEl = $("#delete-btn");
var recentListEl = $("#recent-list");
var forecastEl = $("#forecast-list");
var currentTempEl = $("#current-temp");
var currentMaxTempEl = $("#current-max-temp");
var currentMinTempEl = $("#current-min-temp");
var currentWindEl = $("#current-wind");
var currentHumidEl = $("#current-humid");
var searchInputEl = $("#search-input");
var currentIconEl = $("#current-icon");

console.log(searchInputEl);

var cityNameHeaderEl = $("#city-name-header");
var cityNameHeader = cityNameHeaderEl.text();
var currentBool = true;
var weatherForecast = "";
var searchInput = "";
var imgID = "";

//var thunderImg = 

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
    if (data.weather[0].main == "Clouds") {
        console.log("Cloudy");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/02d@2x.png")
    } else if (data.weather[0].main == "Thunderstorm") {
        console.log("Thunderstorm");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/11d@2x.png")
    } else if (data.weather[0].main == "Drizzle") {
        console.log("Drizzle");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/09d@2x.png")
    } else if (data.weather[0].main == "Rain") {
        console.log("Rain");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/10d@2x.png")
    } else if (data.weather[0].main == "Snow") {
        console.log("Snow");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/13d@2x.png")
    } else if (data.weather[0].main == "Clear") {
        console.log("Clear");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/01d@2x.png")
    } else {
        console.log("Mist/Smoke/Haze/Dust/Fog/Sand/Ash/Squall/Tornado");
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/50d@2x.png")
    }
    });
}


//Selects icon based on current weather data

function iconSwitch(currentWeatherData, weatherData){
    if (currentBool === true){
        weatherMain = currentWeatherData.weather[0].main;
    } else {
        weatherMain = weatherForecast;
    }
    // switch (weatherMain) {
    //     case "Clouds":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/02d@2x.png");
    //         break;
    //     case "Thunderstorm":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/11d@2x.png");
    //         break;
    //     case "Drizzle":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/09d@2x.png");
    //         break;
    //     case "Rain":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/10d@2x.png");
    //         break;
    //     case "Snow":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/13d@2x.png");
    //         break;
    //     case "Clear":
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/01d@2x.png");
    //         break;
    //     default:
    //         currentIconEl.attr("src", "https://openweathermap.org/img/wn/50d@2x.png");
    //         break;
    //   }
    // return imgID;

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
    //return imgID;
}



// function deleteContainer(forecastContainer) {
//     console.log("delete?");
//     forecastContainer.text("");

// }




function citySearch() {




    //event.preventDefault();
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
        console.log(currentWeatherData);

        currentTempEl.text(currentWeatherData.main.temp + "°C")
        currentWindEl.text(currentWeatherData.wind.speed + "km/h")
        currentHumidEl.text(currentWeatherData.main.humidity + "%")
        currentBool = true;

        iconSwitch(currentWeatherData);
        console.log(imgID);
        currentIconEl.attr("src", "https://openweathermap.org/img/wn/" + imgID + "@2x.png");



        searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
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

            for (i = 5; i < weatherData.list.length; i = i + filteredList) {
                console.log(imgID);

                weatherForecast = weatherData.list[i].weather[0].main;

                iconSwitch(weatherData)


                
                var forecastTemp = weatherData.list[i].main.temp;
                var forecastWind = weatherData.list[i].wind.speed;
                var forecastHumid = weatherData.list[i].main.humidity;
                console.log("Weather curently is: " + forecastTemp);

                //console.log(weatherData.list[i]);

                // var forecast = $("<article class='col-sm border border-dark'><h4>" 
                // + weatherData.list[i].dt_txt.slice(0,10) 
                // + "<h4><img src='https://openweathermap.org/img/wn/01d@2x.png'><p style='font-weight: bolder;'>Temp: <span style='font-weight: 400;' id='current-temp'>" + forecastTemp + "°C</span></p><p style='font-weight: bolder;'>Wind: <span style='font-weight: 400;'  id='current-wind'></span></p><p style='font-weight: bolder;'>Humidity: <span style='font-weight: 400;'  id='current-humid'></span></p></article>");

                var forecastContainer = document.createElement('article');
                forecastContainer.setAttribute('class', 'col-sm border');
                forecastContainer.setAttribute('id', 'forecast-container');

                forecastEl.append(forecastContainer);

                var forecastDateEl = document.createElement('h4');
                var forecastIconEl = document.createElement('img');
                var forecastTempEl = document.createElement('p');
                var forecastWindEl = document.createElement('p');
                var forecastHumidEl = document.createElement('p');

                var id = "forecast-temp" + i;


                forecastIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + imgID + '@2x.png');

                forecastTempEl.setAttribute('id', id);
                forecastTempEl = forecastTemp;


                forecastContainer.append(forecastDateEl);
                forecastContainer.append(forecastIconEl);
                forecastContainer.append(forecastTempEl);
               // forecastContainer.append(forecastWindEl);
                //forecastContainer.append(forecastHumidEl);


        

            }

        //    for (var i = 0; i < currentQuestion.choices.length; i++) {
        //     // create new button for each choice
        //     var choice = currentQuestion.choices[i];
        //     var choiceNode = document.createElement('button');
        //     choiceNode.setAttribute('class', 'choice');
        //     choiceNode.setAttribute('value', choice);
        
        //     choiceNode.textContent = i + 1 + '. ' + choice;
        
        //     // display on the page
        //     choicesEl.appendChild(choiceNode);
        //   }




        })

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


searchBtnEl.click(citySearch);
//delBtnEl.click(deleteContainer);

init();



