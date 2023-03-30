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
// Default city loaded
var desiredCity = "Nashville"

// Event handlers
searchBtn.on("click", searchLoad);
prevCity.on("click", showPastCity);
// If enter is pressed in search bar, run searchLoad function
searchBar.on("keypress", function(e){
    if(e.which == 13){
        searchLoad();
    }
});

// API Calls
async function getCurrentConditions(desiredCity) {
    var currentConURL = "https://api.openweathermap.org/data/2.5/weather?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    var rawData = await fetch(currentConURL)
    /* If API call fails, clear search value and change place holder to inform user of failure, 
    and return without updating */
    if (!rawData.ok) {
        searchBar.val("");
        searchBar.attr("placeholder", "City not found. Please try again.");
        return;
    }
    var data = await rawData.json()
    // Update current weather card
    setCurrWeatherCard(data);
    // Add city to previously searched list
    createPastCity(desiredCity);
    // Load previously searched cities
    var pastCitiesArr = loadPastCities();
    // Load past search buttons to page
    addPastSearchBtns(pastCitiesArr);
    // Clear search val and reset place holder name to default in event of prior search failure
    searchBar.val("")
    searchBar.attr("placeholder", "Enter City Name");
}

async function getForecastData(desiredCity) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + desiredCity + "&units=imperial&APPID=" + apiKey;
    // If API call fails, return without updating cards
    var rawData = await fetch(forecastURL)
    if (!rawData.ok) {
        return;
    }
    var data = await rawData.json()
    // Update forecast cards
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
    // Get city name from API data and update html
    var cityName = data.name;
    currCity.text(cityName);
    // Add current day to html using dayjs
    currDay.text(dayjs().format("MM-DD-YYYY"));
    // Get 3-character icon id from the API data, apply to URL, place icon url into html
    var icon = data.weather[0].icon;
    currIcon.attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`)
    // Get temp, add to html using code for degree symbol
    var temp = parseInt(data.main.temp);
    currTemp.text("Temp: " + temp + "\u00B0")
    // Get wind speed and add to html
    var wind = data.wind.speed;
    currWind.text("Wind: " + wind + " MPH")
    // Get humidity and add to html with code for degree symbol
    var humid = data.main.humidity;
    currHumid.text("Humidity: " + humid + "\u00B0")
}

//Loops through API data and dynamically changes html for forecast cards
function setForecastCards(data) {
    // Variable used to ensure the 12:00 conditions are found within the API data
    var startTime = 2;
    // Loop to grab the desired data and dynamically update forecast cards
    for (var i = 0; i < futDate.length; i++) {
        // Get date from the API data and convert it using dayjs; update html
        var date = dayjs(data.list[startTime].dt_txt).format("MM-DD-YYYY");
        $(futDate[i]).text(date)
        // Get 3-character icon id from the API data, apply to URL, place icon into html
        var icon = data.list[startTime].weather[0].icon;
        $(futIcon[i]).attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`)
        // Get temp, add to html using code for degree symbol
        var temp = parseInt(data.list[startTime].main.temp);
        $(futTemp[i]).text("Temp: " + temp + "\u00B0")
        // Get wind speed and add to html
        var wind = data.list[startTime].wind.speed;
        $(futWind[i]).text("Wind: " + wind + " MPH")
        // Get humidity and add to html with code for degree symbol
        var humid = data.list[startTime].main.humidity;
        $(futHumid[i]).text("Humidity: " + humid + "\u00B0")
        // Update variable to move in data to next day's 12:00 timeslot
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
    // grab ul element
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