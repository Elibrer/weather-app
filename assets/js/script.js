//Openweather API key.
var APIKey = "7ae6f66d2cf4fdbd254603d563937e4c";

//HTML element list.
var searchBtnEl = $("#search-btn");
var clearBtnEl = $("#clear-btn");
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
var cityNameHeaderEl = $("#city-name-header");
var countryNameEl = $("#country-name");


//Changable variable list.
var searchInput = "Sydney";
var initFinished = false;
var currentBool = true;
var weatherForecast = "";
var imgID = "";

//Application can only run once page is fully loaded.
$(function () {

    //Sets recentCitiesArr data to either the locally stored data, or a blank array.
    var recentCitiesArr = JSON.parse(localStorage.getItem("recentCities")) || [];

    function init() {

        displayDate();
        citySearch();
        //This for loop renders the buttons on page in reverse order, using the 
        for (i = recentCitiesArr.length - 1; i >= 0; i--) {
            var cityBtn = $("<button class='col-12 btn btn-secondary m-1'></button>");
            cityBtn.attr("id", recentCitiesArr[i]);
            cityBtn.text(recentCitiesArr[i]);
            recentListEl.prepend(cityBtn)  
        }
    }

    //Function to set the value of 'searchInput' once the page has 
    //already been initialised (default is 'Sydney').
    function cityInput(){
        searchInput = searchInputEl.val().trim();
        searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1).toLowerCase();
        if (!searchInput) {
            alert('Please enter a value into the search bar.');
            return;
        }
        initFinished = true;

        citySearch(searchInput);
    }


    function citySearch() {
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
            currentIconEl.removeAttr("src");

            if (initFinished === true) {
                storeItems (searchInput);
            }
            
            cityNameHeaderEl.text(searchInput);
            countryNameEl.text(currentWeatherData.sys.country)

            currentTempEl.text(currentWeatherData.main.temp + "°C")
            currentWindEl.text(currentWeatherData.wind.speed + "km/h")
            currentHumidEl.text(currentWeatherData.main.humidity + "%")
            currentBool = true;

            iconSwitch(currentWeatherData);

            var city = {
                lat: currentWeatherData.coord.lat,
                lon: currentWeatherData.coord.lon,
            };

            //Fetch to generate the 5 day forecast data
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
                currentBool = false;

                var filteredList =  (weatherData.list.length / 5);
                forecastEl.text("");

                //For loop that creates and appends the forecast cards within the forecastContainer
                for (i = 5; i < weatherData.list.length; i = i + filteredList) {

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
                    forecastEl.attr('class', 'text-center d-flex flex-column flex-lg-row justify-content-between p-3')
                    forecastEl.append(forecastContainer);

                    //The ` character... super handy! Can be used same as " and ', however the statement
                    //can be split across multiple lines. This code is used to create the forecast
                    //cards, grabbing data from the forecastData variable
                    forecastContainer.innerHTML = `
                        <h4>${forecastDate}</h4>
                        <img src="https://openweathermap.org/img/wn/${imgID}@2x.png">
                        <p><strong>Temp:</strong><br>${forecastTemp}ºC</p>
                        <p><strong>Wind Speed:</strong><br>${forecastWind}km/h</p>
                        <p><strong>Humidity:</strong><br>${forecastHumid}%</p>
                    `;

                }
            })
        }) //.catch() function to determine whether the fetch request has exectued properly
        .catch((error) => {
            console.error("There has been a problem with your fetch operation:", error);
            alert("Please enter a valid city name");
            searchInputEl.val("");
        });
    };

    //Selects icon based on current weather data.
    function iconSwitch(currentWeatherData, weatherData){

        //currentBool check to determine whether using the data from the currentWeather fetch variable
        //'currentWeatherData', or the forecast fetch variable 'weatherData'.
        if (currentBool === true){
            weatherMain = currentWeatherData.weather[0].main;
        } else {
            weatherMain = weatherForecast;
        }
        
        //Switch function to set the icon for the current and forecasted weather elements
        //based on the data fetched.
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



    //This function required so much trial and error... SO many different ways to sort and delete
    //elements, yet this was the only way that seemed to go exactly as I needed it to. 
    function storeItems (searchInput) {
        
        
        if (searchInput) {
            //New element setting cityArrIndex to the number value of whatever index searchInput exists
            //within recentCitiesArr (if it does exist within)
            var cityArrIndex = recentCitiesArr.indexOf(searchInput);

            var cityBtn = $("<button class='col-12 btn btn-secondary m-1'></button>");


            //Checks whether recentCitiesArr contains the current searchInput value,
            // and if it does the cityArrIndex number will not be -1 therefore allowing this if
            //statement to continue.
            if (cityArrIndex !== -1) {

                console.log("Value already exists in array!")
                    
                //Filter function to remove any button elements with the same text value. 
                //Then appends the new one at the top of the recent search list.
                var text = searchInput;
                $('button').filter(function() {
                    return $(this).text() == text;
                }).remove();

                recentListEl.prepend(cityBtn) 
                
                //This removes the array element at whatever cityArrIndex value is - thus 
                //removing a duplicate element, and unshifting the new element to the start of
                //the array
                recentCitiesArr.splice(cityArrIndex, 1);
                recentCitiesArr.unshift(searchInput);

            } else {
                recentListEl.prepend(cityBtn) 
                recentCitiesArr.unshift(searchInput);
            }

            //Sets the individual id's of each button created, and sets the text
            //to the first element of the recentCitiesArr (which will be the latest entry due
            //to the if/else statement above)
            cityBtn.attr("id", recentCitiesArr[i]);
            cityBtn.text(recentCitiesArr[0]);

            localStorage.setItem("recentCities", JSON.stringify(recentCitiesArr));

            searchInputEl.val("");

            
        }
    };

    //Clears lcoal storage and removes button elements.
    function clearHistory() {
        localStorage.clear();
        recentListEl.text("");
    }

    //Function to display current date and time.
    function displayDate() {
        var currentDate = dayjs().format('YY-MM-DD hh:mm:ss'); 
        currentDateEl.text(currentDate);
        setInterval(displayDate, 1000);
    }

    //Same as pressing the search button, but if 'Enter' key is pressed.
    $(document).on('keypress',function(event) {
        if(event.which == 13) {
            cityInput();    
        } else {
            return;
        }
    });

    searchBtnEl.click(cityInput);
    clearBtnEl.click(clearHistory);

    //Only target the 'button' elements created within the recent list container.
    $(document).on('click', "#recent-list button", function(event){
        var buttonContent = $(this).text();
        searchInputEl.val(buttonContent);
        cityInput();
    })

    //Initialises the page.
    init();

});