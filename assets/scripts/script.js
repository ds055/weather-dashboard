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

// Global Vars
var apiKey = "9cfff3f94df814b6ee1512601a71624d";
var desiredCity = "Bon Aqua";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
var currentConURL = "https://api.openweathermap.org/data/2.5/weather?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
var startTime = 2;

// API Calls
async function getCurrentConditions() {
    var rawData = await fetch(currentConURL)
    var data = await rawData.json()
    setCurrWeatherCard(data);
}

async function getForecastData() {
    var rawData = await fetch(forecastURL)
    var data = await rawData.json()
    setForecastCards(data);
}

// Call Functions
getCurrentConditions();
getForecastData();


// Function Declarations
function setForecastCards(data) {
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
        startTime += 8
    }
    
}

function setCurrWeatherCard(data){
    currCity.text(desiredCity);
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

