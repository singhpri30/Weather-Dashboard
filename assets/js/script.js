var searchCityArray = [];
var APIKey = '5e7733603521cee54360e9a63ebcc0a7';


getCityFromLocalStorage();

function getCityFromLocalStorage() {
    var searchCity = JSON.parse(localStorage.getItem("history"));
    if (searchCity !== null) {
        searchCityArray = searchCity;
    }

    displaySearchCity();
}
function displaySearchCity() {

    $("#search-result-data").empty();
    for (var i = 0; i < searchCityArray.length; i++) {
        var cityName = searchCityArray[i];
        console.log(cityName);

        var cityElement = $("<p>").addClass("card-text city-btn btn btn-lg mb-1");
        //cityElement.addClass("city-btn btn btn-primary btn-lg");
        cityElement.attr("data-name", cityName);
        cityElement.text(cityName);
        $("#search-result-data").prepend(cityElement);
    }

}

$("#search-btn").on("click", function (event) {
    event.preventDefault();

    var city = $("#search-input").val();
    if (city === "") {
        return;
    }
    if (searchCityArray.indexOf(city) === -1) {

        searchCityArray.push(city);
    }

    $("#search-input").val(" ");


    displayWeatherInfo(city);
    saveCityInLocalStorage();
    displaySearchCity();

});

function displayWeatherInfo(city) {
    $("#city-section").removeClass("d-none");

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    console.log(queryURL);

    //We then created an AJAX call
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {

        console.log(response);
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
        uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?&appid=${APIKey}&lat=${lat}&lon=${lon}`;
        console.log(uvQueryURL);

        //This is nested ajax request that gets the UV index but uses longitude and latitude from the previous ajax request to do so.

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (response) {
            var uvIndex = response[0].value;
            console.log(uvIndex);

            $("#uv-value").text("UV Index:" + uvIndex);
            if (uvIndex >= 9) {
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
                //var dateEl = $("<p>").text(dt);

                var iconCode = forecastTimes[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                //var iconImageEl = $("<img>").attr("src", iconURL);
                var forecastHum = forecastTimes[i].main.humidity;
                //humidityEl.text("Humidity:" + " " + forecastTimes[i].main.humidity + " " + "%");
                var Temp = forecastTimes[i].main.temp
                var F = (Temp - 273.15) * 1.80 + 32;


                $(".forecast-list").append("<div class='my-3 pb-3 col-md-2 col-lg-2 forecast-day'>" +
                    "<h5>" + dt + "<h5>" +
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




