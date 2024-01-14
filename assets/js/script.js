// Global array of objects containing city names and their longitudinal and latitudinal coordinates
  // [{"name":"London", "lat":1.5073219, "lon":-0.1276474},{...},{...}]

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
    // Read the localStorage key into the global array
      // Save lon and lat in the button data attributes. Display the city name on the button text. 

// Function to save a city to the global array and localstorage (input: city name, lon, lat)

// Function to get and render current weather (input: lon, lat)

// Function to get 5 day forecast (input: lon, lat)

// Event listener on search button
    // Search city (via function)

// Event listener on city button
    // Display current weather (via function)
    // Display 5 day forecast (via function) 

