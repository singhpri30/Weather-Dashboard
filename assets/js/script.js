
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
    searchCityArray.push(city);

    $("#search-input").val(" ");


    displayWeatherInfo(city);
    saveCityInLocalStorage();
    displaySearchCity();

});

function displayWeatherInfo(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},newhampshire,+1&appid=${APIKey}`;
    console.log(queryURL);

    //We then created an AJAX call
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {

        console.log(response);
        $(".city").text(response.name);
        $(".wind").text("Wind Speed:" + " " + response.wind.speed);
        $(".humidity").text("Humidity:" + " " + response.main.humidity);
        var Temp = response.main.temp
        var F = (Temp - 273.15) * 1.80 + 32;
        $(".temp").text("Temperature:" + " " + F);

    });
}

function saveCityInLocalStorage() {

    localStorage.setItem("history", JSON.stringify(searchCityArray));

}

$(document).on("click", ".city-btn", function () {
    var city = $(this).attr("data-name");
    displayWeatherInfo(city);
});




