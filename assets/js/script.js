// Weather API Key
const apiKey = "d06353babb67e713687d6023c8e892ff";

// Maximum searches to save to history
const maxHistory = 6;

// Get historical search of city/place names and their longitudinal and latitudinal coordinates from localStorage or empty array if no data found (falsy)
  // eg [{"name":"London", "lat":1.5073219, "lon":-0.1276474}, {...}, {...}]
let searchHistory = JSON.parse(localStorage.getItem('weatherDashboard_searchHistory')) || [];

// Create a bootstrap modal object for displaying multiple search results
const modal = new bootstrap.Modal('#searchResultsModal');

// Search for weather in location in query, save and render to page 
function runSearch(query) {

  // Remove potential whitespace around query
  query = query.trim();

  // Only continue if there is something to search
  if (!query) {return false;}

  const queryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
  
  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      // No location found
      if (data.length === 0){
        console.log("nothing found");
        return false;
      }

      // More than one result - user must choose which location they want
      if (data.length > 1) {
        
        $("#searchResultsContainer").empty();

        for (i = 0; i < data.length; i++) {
          
          // Create button text
          let state = data[i].state || '';
          let country = data[i].country || '';
          if (state) {
            state = `, ${data[i].state}`;
          }
          if (country) {
            country = `, ${data[i].country}`;
          }
          const buttonText = `${data[i].name}${state}${country}`;

          buttonText.trim();

          // Create button
          const newButton = $('<button>')
          .text(buttonText)
          .addClass("btn btn-primary d-block my-2")
          .attr("data-name", data[i].name)
          .attr("data-lon", data[i].lon)
          .attr("data-lat", data[i].lat);
          $("#searchResultsContainer").append(newButton);
        }

        // Hide the search modal dialog
        modal.show();

      } else {
        // Only one result found so save the search, refresh history buttons and get weather    
        saveSearch(data[0].name, data[0].lon, data[0].lat);

        renderHistory();

        displayCurrentWeather(data[0].name, data[0].lon, data[0].lat);

        display5DayForecast(data[0].lon, data[0].lat);

      }

    })

}

// Render the history buttons
function renderHistory(){

  // Clear the buttons
  $("#history").empty();

  // Read the localStorage key into the global array
  searchHistory = JSON.parse(localStorage.getItem('weatherDashboard_searchHistory')) || [];

  // Save lon and lat in the button data attributes. Display the city name on the button text. 
  for (i = 0; i < searchHistory.length; i++) {
    console.log(searchHistory[i].name);
    const newButton = $('<button>')
      .text(searchHistory[i].name)
      .addClass("btn btn-secondary my-2")
      .attr("data-name", searchHistory[i].name)
      .attr("data-lon", searchHistory[i].lon)
      .attr("data-lat", searchHistory[i].lat);
    $("#history").append(newButton);
  }

}

// Save searched location to the global array and localStorage (input: name, lon, lat)
function saveSearch(name, lon, lat) {

  // Create search object
  const search = {name: name, lon: lon, lat: lat};

  // Save object to beginning of array of search history 
  searchHistory.unshift(search);

  // Limit the size of the history
  if (searchHistory.length > maxHistory){
    searchHistory.splice(maxHistory);
  }

  // Save search history to localStorage
  localStorage.setItem('weatherDashboard_searchHistory', JSON.stringify(searchHistory));

}

// Function to get and render current weather (input: lon, lat)
function displayCurrentWeather(name, lon, lat){

  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // No weather data found
      if (data.length === 0){
        console.log("nothing found");
        return false;
      }

      console.log(data);

      const date = new Date(data.dt * 1000); // Convert data timestamp to milliseconds
      const formattedDate = date.toLocaleDateString();
      const heading = $("<h2>").text(name + ' (' + formattedDate + ')');
      const temp = $("<p>").text("Temp: " + data.main.temp + " ℃");
      const wind = $("<p>").text("Wind: " + data.wind.speed + " KPH");
      const humidity = $("<p>").text("Humidity: " + data.main.humidity + " %");
      const icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
                             .attr("alt", 'weather icon')
                             .attr("title", `${data.weather[0].description}`);

      $(heading).append(icon);

      $("#today").empty();
      $("#today").append(heading, temp, wind, humidity);

    });
}

// Function to get 5 day forecast (input: lon, lat)
function display5DayForecast(lon, lat) {

  const queryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=40&units=metric`;

  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // No weather data found
      if (data.length === 0){
        console.log("nothing found");
        return false;
      }
      
      console.log(data);

      $("#forecast").empty();

      $("#forecast").append("<h3>5 Day Forecast:</h3>");

      // Loop the data
      for (i = 0; i < data.list.length; i++) {

        const dataTimeString = data.list[i].dt_txt;
 
        // Find all weather data forecast for midday
        if (dataTimeString.includes("12:00:00")) {

          const date = new Date(data.list[i].dt * 1000); // Convert data timestamp to milliseconds
          const formattedDate = date.toLocaleDateString(); 
          const heading = $("<h4>").text(formattedDate);
          const temp = $("<p>").text("Temp: " + data.list[i].main.temp + " ℃");
          const wind = $("<p>").text("Wind: " + data.list[i].wind.speed + " KPH");
          const humidity = $("<p>").text("Humidity: " + data.list[i].main.humidity + " %");
          const icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`)
                                 .attr("alt", 'weather icon')
                                 .attr("title", `${data.list[i].weather[0].description}`);
    
          $(heading).append(icon);    

          const forecastContainer = $("<article>").append(heading, temp, wind, humidity).addClass("col");
          
          $("#forecast").append(forecastContainer);

        }
      }

    });
}

// Event listener on search form
$("#search-form").on("submit", function(e) {
  e.preventDefault();
  
  // Trim any whitespace from search input control
  const searchText = $("#search-input").val().trim();

  // If we have something to search
  if (searchText) {
    // Search location
    runSearch(searchText);
  }

});

// Event listener on history buttons
$("#history").on('click', '.btn', function() {

  const name = $(this).attr("data-name");
  const lon = $(this).attr("data-lon");
  const lat = $(this).attr("data-lat");

  displayCurrentWeather(name, lon, lat);

  display5DayForecast(lon, lat);

});

// Event listener on button clicks in the search modal dialog
$("#searchResultsContainer").on('click', 'button', function(e) {

  const name = $(e.target).attr('data-name');
  const lon = $(e.target).attr('data-lon');
  const lat = $(e.target).attr('data-lat');

  saveSearch(name, lon, lat);

  renderHistory();

  displayCurrentWeather(name, lon, lat);

  display5DayForecast(lon, lat);

  // Hide the search modal dialog
  modal.hide();  

});

renderHistory();

