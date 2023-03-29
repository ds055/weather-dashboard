// DOM Elements
const currCity = $("#curr-city");
const currDay = $("#curr-day");
const currIcon = $("#curr-icon");
const currTemp = $("#curr-temp");
const currWind = $("#curr-wind");
const currHumid = $("#curr-humid");
const futDate = $(".futDate")
const futTemp = $(".futTemp")
const futIcon = $(".futIcon")
const futWind = $(".futWind")
const futHumid = $(".futHumid")
const searchBtn = $("#search-btn")
const searchBar = $("#search-bar")

// Global Vars
var apiKey = "9cfff3f94df814b6ee1512601a71624d";
var desiredCity = "Nashville";

// API Calls
async function getCurrentConditions(desiredCity) {
    var currentConURL = "https://api.openweathermap.org/data/2.5/weather?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    var rawData = await fetch(currentConURL)

    if (!rawData.ok) {
        alert("City not found. Please try again.");
        return;
    }
    var data = await rawData.json()
    setCurrWeatherCard(data);
}

async function getForecastData(desiredCity) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    var rawData = await fetch(forecastURL)
    if (!rawData.ok) {
        return;
    }
    var data = await rawData.json()
    console.log(data)
    setForecastCards(data);
}

// Call Functions
getCurrentConditions(desiredCity);
getForecastData(desiredCity);

// Function Declarations
function setForecastCards(data) {
    var startTime = 2;
    for (var i = 0; i < futDate.length; i++) {
        var date = dayjs(data.list[startTime].dt_txt).format("MM-DD-YYYY");
        $(futDate[i]).text(date)
        var icon = data.list[startTime].weather[0].icon;
        $(futIcon[i]).attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`)
        var temp = parseInt(data.list[startTime].main.temp);
        $(futTemp[i]).text("Temp: " + temp + "\u00B0")
        var wind = data.list[startTime].wind.speed;
        $(futWind[i]).text("Wind: " + wind + " MPH")
        var humid = data.list[startTime].main.humidity;
        $(futHumid[i]).text("Humidity: " + humid + "\u00B0")
        startTime += 8;
    }
    
}

function setCurrWeatherCard(data){
    var cityName = data.name;
    currCity.text(cityName);
    currDay.text(dayjs().format("MM-DD-YYYY"));
    var icon = data.weather[0].icon;
    currIcon.attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`)
    var temp = parseInt(data.main.temp);
    currTemp.text("Temp: " + temp + "\u00B0")
    var wind = data.wind.speed;
    currWind.text("Wind: " + wind + " MPH")
    var humid = data.main.humidity;
    currHumid.text("Humidity: " + humid + "\u00B0")
}

searchBtn.on("click", updateScreen);

function updateScreen() {
    desiredCity = searchBar.val().trim();
    getCurrentConditions(desiredCity);
    getForecastData(desiredCity);
}

// ToDo: Add buttons for previous searches--up to 5 an 92°04-01-2023Temp: 56°Wind: 13.65 MPHHumidity: 67°04-02-2023Temp: 41°Wind: 3.6 MPHHumidity: 78°d save them to local storage
// ToDo: See if you can clean up setCards and APi calls
// ToDo: Clear city bar after search