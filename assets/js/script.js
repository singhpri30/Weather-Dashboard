var searchCityArray = []; //an empty array to store local storage data
var APIKey = '5e7733603521cee54360e9a63ebcc0a7';


getCityFromLocalStorage();

function getCityFromLocalStorage() { //this function is pulling data from local storage
    var searchCity = JSON.parse(localStorage.getItem("history"));
    if (searchCity !== null) { //if local data if not null then value of searchCityArray will be searchCity
        searchCityArray = searchCity;
    }

    displaySearchCity(); //calling this function to display local data on the HTML page
}
function displaySearchCity() {
    //$("#search-result-data").empty(); //clear existing values
    for (var i = 0; i < searchCityArray.length; i++) { //looping over searchCityArray
        var cityName = searchCityArray[i];
        var cityElement = $("<p>").addClass("city-btn btn btn-lg mb-1"); //creating element and adding classes
        cityElement.attr("data-name", cityName); //adding data attribute
        cityElement.text(cityName); // element text will be fetched from local storage
        $("#search-result-data").prepend(cityElement); //element will be prepended on the HTML page
    }

}

$("#search-btn").on("click", function () {
    
    var city = $("#search-input").val();
    if (city === "") {
        return;
    }
    if (searchCityArray.indexOf(city) === -1) {

        searchCityArray.push(city);
        displaySearchCity();
        saveCityInLocalStorage();
    }
    $("#search-input").val(" ");
    displayWeatherInfo(city);

});

function displayWeatherInfo(city) {

    $("#city-section").removeClass("d-none");
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {

        $(".city").text(response.name);
        var iconCode = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        $(".icon").attr("src", iconURL);
        var currentDay = moment().format("MMMM Do YYYY");
        $(".current-day").text("(" + currentDay + ")");
        $(".wind").text("Wind Speed:" + " " + response.wind.speed + " " + "MPH");
        $(".humidity").text("Humidity:" + " " + response.main.humidity + " " + "%");
        var Temp = response.main.temp
        var F = (Temp - 273.15) * 1.80 + 32;
        $(".temp").text("Temperature:" + " " + F + " " + "°F");
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //This is nested ajax request that gets the UV index but uses longitude and latitude from the previous ajax request.
        var uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?&appid=${APIKey}&lat=${lat}&lon=${lon}`;
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            var uvIndex = response[0].value;
            $("#uv-value").text("UV Index:" + uvIndex); //displaying the value of UV index
            if (uvIndex >= 9) {// adding different classes for different UV index
                $("#uv-value").addClass("red");
            }
            else if (uvIndex > 4) {
                $("#uv-value").addClass("orange");
            }
            else {
                $("#uv-value").addClass("green");
            }
        });
    })

    //This ajax request collects weather data for the next 5 days (specifically it is grabbing the stays from noon, as opposed to every few hours)
    var queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        $(".forecast-list").empty();
        var forecastTimes = response.list;
        for (i = 0; i < forecastTimes.length; i++) {

            if (forecastTimes[i].dt_txt[12] === "2") {

                var dateValue = forecastTimes[i].dt_txt;
                var dt = moment(dateValue, moment.ISO_8601).format('MM/DD/YYYY'); //changing the date format
                var iconCode = forecastTimes[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                var forecastHum = forecastTimes[i].main.humidity;
                var Temp = forecastTimes[i].main.temp
                var F = (Temp - 273.15) * 1.80 + 32;


                $(".forecast-list").append("<div class='my-1 pb-4 col-md-2 forecast-day'>" +
                    "<h5>" + dt + "</h5>" +
                    "<img class='ficon' src=" + iconURL + " alt='Weather icon'>" +
                    "<div>Temp: " + F.toFixed(1) + " °F" +
                    "</div><div>Humidity: " + forecastHum +
                    "%</div></div></div>");
            }
        }
    });
};

function saveCityInLocalStorage() {
    localStorage.setItem("history", JSON.stringify(searchCityArray));
}

$(document).on("click", ".city-btn", function () {
    var city = $(this).attr("data-name");
    displayWeatherInfo(city);
});




