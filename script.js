$(document).ready(function() {
    var citySearchListStringified = localStorage.getItem("citySearchList");
    var citySearchList = JSON.parse(citySearchListStringified);
  
    if (citySearchList == null) {
      citySearchList = {};
    }
    createCityList(citySearchList);
  
    $("#current-weather").hide();
    $("#forecast-weather").hide();

    $("#search-button").on("click", function(event) {
      event.preventDefault();
      var city = $("#city-input")
        .val()
        .trim()
        .toLowerCase();
      if (city != "") {
      citySearchList[city] = true;
      
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
  
      populateCityWeather(city, citySearchList);
      $("#current-weather").show();
      $("#forecast-weather").show();
      }
    });
  
    $("#city-list").on("click", "button", function(event) {
      event.preventDefault();
      var city = $(this).text();
  
      populateCityWeather(city, citySearchList);
      $("#current-weather").show();
      $("#forecast-weather").show();
    });
  });
function populateCityWeather(city, citySearchList) {
    createCityList(citySearchList);
    //API links for weather + 5 day forecast
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=885e9149105e8901c9809ac018ce8658&q="+city;
    var queryURLforecast ="https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=885e9149105e8901c9809ac018ce8658&q="+city;
  
    var latitude;
    var longitude;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // Stores data inside weather object
      .then(function(weather) {
       
        console.log(queryURL);
        console.log(weather);
  
        var nowMoment = moment();
        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );
  
        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);
  
        var weatherIcon = $("<img>");
        weatherIcon.attr("src","https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png");

        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
        $("#current-temp").text("Temperature: " + weather.main.temp + " °C");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
  
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURLUV =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" + "&lat=" + latitude + "&lon=" + longitude;
        
          $.ajax({
          url: queryURLUV,
          method: "GET"
          // Stores all data in UVindex object 
        }).then(function(uvIndex) {
          console.log(uvIndex);
  
          var uvIndexDisplay = $("<button>");
          uvIndexDisplay.addClass("btn btn-danger");
  
          $("#current-uv").text("UV Index: ");
          $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
          console.log(uvIndex[0].value);
  
          $.ajax({
            url: queryURLforecast,
            method: "GET"
            //Store all data in forcast object
          }).then(function(forecast) {
            console.log(queryURLforecast);
            console.log(forecast);

            // Loops through forecast list array
            for (var i = 6; i < forecast.list.length; i += 8) {
              var forecastDate = $("<h5>");
              var forecastPosition = (i + 2) / 8;
  
              console.log("#forecast-date" + forecastPosition);
  
              $("#forecast-date" + forecastPosition).empty();
              $("#forecast-date" + forecastPosition).append(
                forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
              );
  
              var forecastIcon = $("<img>");
              forecastIcon.attr("src","https://openweathermap.org/img/w/" +forecast.list[i].weather[0].icon +".png" );
  
              $("#forecast-icon" + forecastPosition).empty();
              $("#forecast-icon" + forecastPosition).append(forecastIcon);
  
              console.log(forecast.list[i].weather[0].icon);
                
              $("#forecast-temp" + forecastPosition).text(
                "Temp: " + forecast.list[i].main.temp + " °C"
              );
              $("#forecast-humidity" + forecastPosition).text(
                "Humidity: " + forecast.list[i].main.humidity + "%"
              );
  
              $(".forecast").attr(
                "style",
                "background-color:dodgerblue; color:white"
              );
            }
          });
        });
      });
  }
//Creates a button of prev searches 
function createCityList(citySearchList) {
    $("#city-list").empty();

    var keys = Object.keys(citySearchList);
    for (var i = 0; i < keys.length; i++) {
      var cityListEntry = $("<button>");
      cityListEntry.addClass("list-group-item list-group-item-action");
      var splitStr = keys[i].toLowerCase().split(" ");
      for (var j = 0; j < splitStr.length; j++) {
        splitStr[j] =
          splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
      }
      var titleCasedCity = splitStr.join(" ");
      cityListEntry.text(titleCasedCity);
  
      $("#city-list").append(cityListEntry);
    }
  }

  

  
  