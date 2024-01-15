// Weather API Key
const apiKey = "d06353babb67e713687d6023c8e892ff";

// Maximum searches to save to history
const maxHistory = 6;

// Get historical search of city/place names and their longitudinal and latitudinal coordinates from localStorage or empty array if no data found (falsy)
  // eg [{"name":"London", "lat":1.5073219, "lon":-0.1276474}, {...}, {...}]
let searchHistory = JSON.parse(localStorage.getItem('weatherDashboard_searchHistory')) || [];

// Function to search for city 
  // Use: https://openweathermap.org/api/geocoding-api to return lon/lat
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // Display a modal if more than one result is found, so user can select the city they want
    // Otherwise return the long/lat json string for that one result.
    // Cancel button
      // Save city (via function)
      // Get current weather (via function)
      // Get 5 day forecast
      // Render buttons

// Function to render the buttons
function renderHistory(){
  // Read the localStorage key into the global array
  searchHistory = JSON.parse(localStorage.getItem('weatherDashboard_searchHistory')) || [];

  // Save lon and lat in the button data attributes. Display the city name on the button text. 
  for (i = 0; i < searchHistory.length; i++){
    console.log(searchHistory[i].name);
  }

}

// Function to save a city to the global array and localstorage (input: city name, lon, lat)
function saveSearch(city, lon, lat) {

  // Create search object
  const search = {city: city, lon: lon, lat: lat};

  // Save object to beginning of array of search history 
  searchHistory.unshift(search)

  // Save search history to localStorage
  localStorage.setItem('weatherDashboard_searchHistory', JSON.stringify(searchHistory));

}

// Function to get and render current weather (input: lon, lat)

// Function to get 5 day forecast (input: lon, lat)

// Event listener on search button
    // Search city (via function)

// Event listener on city button
    // Display current weather (via function)
    // Display 5 day forecast (via function) 


renderHistory();

saveSearch("London", 1.5073219, -0.1276474);