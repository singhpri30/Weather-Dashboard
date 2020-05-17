
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

        var cityElement = $("<button>");
        cityElement.addClass("city-btn btn btn-primary btn-lg");
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
    if (searchCityArray.includes(city)) {
        displayWeatherInfo(city);
    };
    searchCityArray.push(city);

    $("#search-input").val(" ");

    displayWeatherInfo(city);
    saveCityInLocalStorage();
    displaySearchCity();

});

function displayWeatherInfo(city) {
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
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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
        uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?&appid=${APIKey}&lat=${lat}&lon=${lon}`;
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
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {





    }
};



function saveCityInLocalStorage() {
    localStorage.setItem("history", JSON.stringify(searchCityArray));
}

$(document).on("click", ".city-btn", function () {
    var city = $(this).attr("data-name");
    displayWeatherInfo(city);
});




