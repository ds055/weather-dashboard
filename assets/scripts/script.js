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
var prevCity = $("#past-searches")

// Global Vars
var apiKey = "9cfff3f94df814b6ee1512601a71624d";
var desiredCity = "Nashville"

//Event handlers
searchBtn.on("click", searchLoad);
prevCity.on("click", showPastCity);

// API Calls
async function getCurrentConditions(desiredCity) {
    var currentConURL = "https://api.openweathermap.org/data/2.5/weather?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    var rawData = await fetch(currentConURL)

    if (!rawData.ok) {
        searchBar.val("");
        searchBar.attr("placeholder", "City not found. Please try again.");
        return;
    }
    var data = await rawData.json()
    setCurrWeatherCard(data);
    createPastCity(desiredCity);
    var pastCitiesArr = loadPastCities();
    addPastSearchBtns(pastCitiesArr);
    searchBar.val("")
    searchBar.attr("placeholder", "Enter City Name");
}

async function getForecastData(desiredCity) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    var rawData = await fetch(forecastURL)
    if (!rawData.ok) {
        return;
    }
    var data = await rawData.json()
    setForecastCards(data);
}

init();

//Page initializing function
function init() {
    getCurrentConditions(desiredCity);
    getForecastData(desiredCity);
    var pastCitiesArr = loadPastCities();
    addPastSearchBtns(pastCitiesArr);
}

//Loops through API data and dynamically changes html for current weather card
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

//Loops through API data and dynamically changes html for forecast cards
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

//Loads weather data when user clicks on past search button
function showPastCity(e) {
    var pastText = e.target.textContent;
    updateScreen(pastText);
}

//Loads weather data based on search bar input
function searchLoad() {
    desiredCity = searchBar.val().trim();
    updateScreen(desiredCity);
}

//Updates all cards on screen with current API data
function updateScreen(desiredCity) {
    getCurrentConditions(desiredCity);
    getForecastData(desiredCity);
}

// Creates a past city button if conditions are met
function createPastCity(desiredCity) {
    // load local data array
    var pastCitiesArr = loadPastCities();
    // delete old entry if it matches current desired city submission
    pastCitiesArr = $.grep(pastCitiesArr, function(obj){
        return obj != desiredCity;
      })
    // add current desired city to beginning of array
    pastCitiesArr.unshift(desiredCity);
    // delete last array entry if array becomes longer than 5 entries
    if (pastCitiesArr.length > 5) {
        pastCitiesArr.pop();
    }
    // save entry to local storage
    savePastCities(pastCitiesArr);
}

// Load city array from local storage
function loadPastCities() {
    var pastCitiesArr = JSON.parse(localStorage.getItem("pastCitiesSearch")) || [];
    return pastCitiesArr;
}

// Save city array to local storage
function savePastCities(pastCitiesArr) {
    localStorage.setItem("pastCitiesSearch", JSON.stringify(pastCitiesArr))
}

// Dynamically adds past searches as buttons
function addPastSearchBtns(pastCitiesArr) {
    // grab ul html element
    const pastSearchUl = $("#past-searches");
    // delete previous elements from ul
    pastSearchUl.empty();
    // create new li's for the ul, and dynamically append
    for (var city of pastCitiesArr){
        var newLi = $("<li></li>").text(city);
        // add class for CSS styling
        $(newLi).addClass("priorCity");
        pastSearchUl.append(newLi);
    }
}