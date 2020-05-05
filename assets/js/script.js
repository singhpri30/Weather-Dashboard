

var searchArray = [];

//get the search input element
//get the value of search element and store it in a variable
// pass the value of search value in the queryURL



$("#search-btn").on("click", function () {


    getLocalData();
    var searchEl = $("#search-input").val();
    console.log(searchEl);
    var APIKey = '5e7733603521cee54360e9a63ebcc0a7';
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchEl},newhampshire,+1&appid=${APIKey}`;
    console.log(queryURL);

    // We then created an AJAX call
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {

        console.log(response);

        // Create CODE HERE to Log the queryURL
        // Create CODE HERE to log the resulting object
        $(".city").text(response.name);
        $(".wind").text("Wind Speed:" + " " + response.wind.speed);
        $(".humidity").text("Humidity:" + " " + response.main.humidity);
        var Temp = response.main.temp
        var F = (Temp - 273.15) * 1.80 + 32;
        $(".temp").text("Temperature:" + " " + F);
        // Create CODE HERE to calculate the temperature (converted from Kelvin)
        // Create CODE HERE to transfer content to HTML
        // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
        // Create CODE HERE to dump the temperature content into HTML
    });

    saveLocalData();
});


function getLocalData() {
    var storedData = localStorage.getItem("history")
    console.log(storedData);
    var tableRowElement = $("<tr>");
    var scoreTd = $("<td>");
    scoreTd.text(storedData);
    //scoreTd.textContent = scores[i].score;

    $(tableRowElement).append(scoreTd);


    $("#search-result-data").append(tableRowElement);

};
function saveLocalData() {


    var searchEl = $("#search-input").val();
    searchArray.push(searchEl);
    console.log(searchArray);
    localStorage.setItem("history", searchEl);


};