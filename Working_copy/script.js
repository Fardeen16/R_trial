




document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit");
    const autoDetectCheckbox = document.getElementById("auto-detect");
    const streetField = document.getElementById("street");
    const cityField = document.getElementById("city");
    const stateField = document.getElementById("state");
    const resultsDiv = document.querySelector(".results");
    clearResults();



    // Event listener for Auto-detect checkbox
    autoDetectCheckbox.addEventListener("change", function () {


        if (autoDetectCheckbox.checked) {
            // Disable the Street, City, and State fields when the checkbox is checked
            streetField.disabled = true;
            cityField.disabled = true;
            stateField.disabled = true;

            

            clearFieldErrors();
        } else {
            // Enable the fields when the checkbox is unchecked
            streetField.disabled = false;
            cityField.disabled = false;
            stateField.disabled = false;
        }
    });


 // global variable to print the location of the user when usin the ipinfo, 
 // works with the fucntion getLocationFromIpInfo()
 let ipinfoData = null;

// works and return the user ip info to the api and get the location of the user 
    function getLocationFromIpInfo() {
        // Replace with your actual IPinfo access token
        const IPINFO_ACCESS_TOKEN = '8783cce893e6e3';
        const url = `https://ipinfo.io/json?token=${IPINFO_ACCESS_TOKEN}`;
    
        // Fetch location data from IPinfo API
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("IPinfo Location Data:", data);
    
                // Parse latitude and longitude from location data
                if (data.loc) {
                    const [lat, lon] = data.loc.split(",");
                    console.log(`User's Location: Latitude = ${lat}, Longitude = ${lon}`);
                    console.log(data);
                    console.log("User's Location:", data.city, data.region);
                    ipinfoData = data.city + ", " + data.region;
    
                    // Use the lat and lon to get weather data or pass to the backend if needed
                    getWeatherByCoordinates(lat, lon);
                } else {
                    showError("Unable to retrieve location data. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error fetching IPinfo location data:", error);
                showError("Error fetching location data using IPinfo.");
            });
    }
   

// global variable to print the location of the user when usin the ipinfo, 
 // works with the fucntion below
let GeocodingData = null;

    // works ( but not for invalid)
    function getWeatherByAddress(street, city, state) {
        // Construct the address string from the input fields
        const address = `${street}, ${city}, ${state}`;
        
        // Google Maps Geocoding API URL
        const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyChSFGvtd7eKcfHpNLj6H5j6_WHDWafCCE`;
    
        // Fetch latitude and longitude using Google Geocoding API
        fetch(googleApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "OK" && data.results.length > 0) {
                        console.log("Geocoding API Response:", data);
                    GeocodingData = data.results[0].formatted_address;
                    console.log("Geocoding Data:", GeocodingData);

                    const location = data.results[0].geometry.location; // Get lat and lon from the response
                    console.log("Geocoding API Response:", location);
    
                    const lat = location.lat;
                    const lon = location.lng;
    
                    // Call getWeatherByCoordinates with lat and lon
                    getWeatherByCoordinates(lat, lon);
                } else {

                    showError("Unable to find the location. Please check the address and try again.");
                }
            })
            .catch(error => showError("Error calling Google Geocoding API. Please try again."));
    }

    






    // Works
    // Function to get weather data using latitude and longitude directly
    let weatherData = null;


    function getWeatherByCoordinates(lat, lon) {
        // Construct query parameters with lat and lon
        const params = new URLSearchParams({ lat, lon });
    
        // Send a request to the backend server to get weather data using the provided coordinates
        fetch(`/weather_by_coordinates?${params.toString()}`)
            .then(response => {
                // Log the raw response text
                console.log("Raw Response from Backend:", response);
                return response.text();  // Parse as text first to debug
            })
            .then(text => {
                // console.log("Raw Text Response:", text);  // Log the raw text response
                let data;
                try {
                    data = JSON.parse(text);  // Attempt to parse the text as JSON
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    showError("Invalid JSON format received from the server.");
                    return;
                }
                console.log("Parsed Data from Backend:", data);
                weatherData = data;
                console.log("Weather Data:", weatherData);
                // Check if there's an error in the response
                if (data.error) {
                    showError(data.error);
                } else {
                    // Display the weather data on the frontend
                    weatherData = data;
                    console.log("Weather Data 2nd:", weatherData);

                    displayWeatherData(data);
//  first we get the data then - createWeatherChart(data);  // Visualize data using Highcharts
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                showError("Error fetching weather data. Please try again.");
            });
    }

    




    
// Function to display weather data in the HTML elements (placeholder for your actual implementation)
// function displayWeatherData(data) {
//     const weatherContainer = document.getElementById('weather-card');
//     if (!weatherContainer) {
//         console.error("Weather container not found in HTML. Check your HTML structure.");
//         return;
//     }

//     // Assuming 'data' contains weather information
//     weatherContainer.innerHTML = `
//         <h3>Weather Information</h3>
//         <p>Temperature: ${data.temperature}°F</p>
//         <p>Humidity: ${data.humidity}%</p>
//         <p>Wind Speed: ${data.windSpeed} mph</p>
//         <p>UV Index: ${data.uvIndex}</p>
//     `;
// }
function showResults() {
    // Show the forecast table container
    const forecastTableContainer = document.querySelector('.forecast-table-container');
    if (forecastTableContainer) forecastTableContainer.style.display = 'flex'; 

    // Show the weather card container
    const weatherCardContainer = document.querySelector('.weather-card-container');
    if (weatherCardContainer) weatherCardContainer.style.display = 'flex'; 





    // Show the charts container if it exists
    // const chartsContainer = document.getElementById('charts-container');
    // if (chartsContainer) chartsContainer.style.display = ''; 

    // // Show the daily card
    // const dailyCard = document.getElementById('daily-card');
    // if (dailyCard) dailyCard.style.display = ''; 

    // // Show the daily details section
    // const dailyDetails = document.getElementById('daily-details');
    // if (dailyDetails) dailyDetails.style.display = ''; 

    console.log("All results and displays are now visible.");
}









    
    // Event listener for Submit button
    submitButton.addEventListener("click", function () {
        // Clear any previous results and errors
        
        showResults();
        resultsDiv.innerHTML = "";
        console.log("Submit button clicked!");
        clearFieldErrors();
        

        // Check if "Use My Location" checkbox is checked
        if (autoDetectCheckbox.checked) {
            getLocationFromIpInfo();
        } 
        else {
            // Validate form fields and show error tooltips if necessary
            const street = streetField.value.trim();
            const city = cityField.value.trim();
            const state = stateField.value;

            if (street === "") {
                showErrorTooltip(streetField, "Please enter a street name.");
            }
            if (city === "") {
                showErrorTooltip(cityField, "Please enter a city name.");
            }
            if (state === "") {
                showErrorTooltip(stateField, "Please select a state.");

                // Exit if there are validation errors
            }
            if (street && city && state) {
                getWeatherByAddress(street, city, state);
            }
        }
    });


    // Event listener for Clear button
    const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function () {
        clearForm()
        clearResults();


        document.getElementById('use-current-location').checked = false;
        document.getElementById('street').disabled = false;
        document.getElementById('city').disabled = false;
        document.getElementById('state').disabled = false;
        // document.getElementById('weather-results').innerHTML = "";
        // document.getElementById('error-message').innerHTML = "";

        
    });


    function clearResults() {
        // Hide the forecast table container

        const dailyDetails = document.getElementById('daily-details');
        if (dailyDetails) dailyDetails.style.display = 'none'; 

        const forecastTableContainer = document.querySelector('.forecast-table-container');
        if (forecastTableContainer) forecastTableContainer.style.display = 'none';
    

        // Hide the weather card container
        const weatherCardContainer = document.querySelector('.weather-card-container');
        if (weatherCardContainer) weatherCardContainer.style.display = 'none';
    
        // Clear chart container content if it exists
        

        const chartsContainer = document.getElementById('charts-container');
        if (chartsContainer) chartsContainer.style.display = 'none';

        const dailyCard = document.getElementById('daily-card');
        if (dailyCard) dailyCard.style.display = 'none';


        console.log("All results and displays cleared.");
    }

    // Function to clear form fields and results area
    function clearForm() {
        streetField.value = "";
        cityField.value = "";
        stateField.selectedIndex = 0;  // Reset the dropdown to the first option
        resultsDiv.innerHTML = "";

        clearFieldErrors();
        
        autoDetectCheckbox.checked = false;
        streetField.disabled = false;
        cityField.disabled = false;
        stateField.disabled = false;
        
    }

    // Function to show error tooltips for invalid fields
    function showErrorTooltip(field, message) {
        field.style.borderColor = "red";  // Highlight the field border in red
        const errorTooltip = document.createElement("div");
        errorTooltip.className = "error-tooltip";
        errorTooltip.innerText = message;
        field.parentElement.appendChild(errorTooltip);
    }

    // Function to clear error tooltips and reset field styles
    function clearFieldErrors() {
        const errorTooltips = document.querySelectorAll(".error-tooltip");
        errorTooltips.forEach(tooltip => tooltip.remove());
        [streetField, cityField, stateField].forEach(field => {
            field.style.borderColor = "";  // Reset border color
        });
    }





    
    // // Function to get weather using the form address
    // function getWeatherByAddress(street, city, state) {
    //     // Make a request to the backend with the provided address
    //     const params = new URLSearchParams({ street, city, state });
    //     fetch(`/weather?${params.toString()}`)
    //         .then(response => response.json())
    //         .then(data => displayWeatherData(data))
    //         .catch(error => showError("Error fetching weather data. Please try again."));
    // }






    // Function to get weather using IP address (auto-detect location)
  // Function to get weather using the form address
// function getWeatherByAddress(street, city, state) {
//     // Make a request to the backend with the provided address
//     const params = new URLSearchParams({ street, city, state });
//     fetch(`/weather?${params.toString()}`)
//         .then(response => response.json())
//         .then(data => {
//             // If data contains an error (invalid address), fallback to state-only request
//             if (data.error) {
//                 console.log("Invalid address, fetching weather using state only...");
//                 getWeatherByState(state);
//             } else {
//                 displayWeatherData(data);
//             }
//         })
//         .catch(error => showError("Error fetching weather data. Please try again."));
// }



const toggleButton = document.getElementById('toggle-charts-btn');
const arrowImage = document.getElementById('arrow-image');
const graphContainer = document.getElementById('container');
const graphContainer2 = document.getElementById('container2');


// let graphInitialized = false; // Track if graphs are created

// Initially hide the graph container
//graphContainer.style.display = 'none';

// Add event listener to toggle button
// document.getElementById('btn').addEventListener('click', () => {
//     createGraph(weatherData); 
//     createWeatherChart(weatherData); // Visualize data using Highcharts
// });



//  Function to get weather using only the state information
//     function getWeatherByState(state) {
//         // Make a request to the backend with just the state parameter
//         const params = new URLSearchParams({ state });
//         fetch(`/weather?${params.toString()}`)
//             .then(response => response.json())
//             .then(data => displayWeatherData(data))
//             .catch(error => showError("Error fetching weather data using state information."));
//     }



    // Function to get weather using IP address (auto-detect location) 
    // put the ipinfo here, we will get the loction of the server by doing this not the user
//     function getWeatherUsingIpAddress() {
//         fetch(`/weather?location=current`)
//             .then(response => response.json())
//             .then(data => displayWeatherData(data))
//             .catch(error => showError("Error fetching weather data using IP address."));
// }

// Ensure the DOM is ready before adding the event listener
// document.addEventListener('DOMContentLoaded', () => {
//     const button = document.getElementById('btn');

//     button.addEventListener('click', () => {
//         console.log("Button clicked! Calling graph functions.");

//         // Assuming weatherData is already available
//         createGraph(weatherData);
//         createWeatherChart(weatherData);
//     });
// });




function displayWeatherData(data) {
    const weatherCardDiv = document.getElementById('weather-card');
    const forecastTableBody = document.getElementById('forecast-table').getElementsByTagName('tbody')[0];
    const forecastTableContainer = document.getElementById('forecast-table-container');
    const dailyDetailsDiv = document.getElementById('daily-details');
    const dailyCardDiv = document.getElementById('daily-card');
    const dailyCard= document.getElementById('daily-details');
    // Clear previous content
    weatherCardDiv.innerHTML = "";
    forecastTableBody.innerHTML = "";

    // Check if data is valid and has the expected structure
    if (!data || !data.timelines || !data.timelines.daily || data.timelines.daily.length === 0) {
        console.error("Invalid or empty data structure:", data);
        weatherCardDiv.innerHTML = `<p>No weather data available for this location.</p>`;
        return;
    }

    // Extract the current weather information from the first interval of daily data
    const currentWeather = data.timelines.daily[0].values;

    // Extract fields from current weather data for the weather card

    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    // Check if ipinfoData is not null or undefined, otherwise use street + city + state
    const location = ipinfoData ? ipinfoData : `${street}, ${city}, ${state}`;
    console.log("Final Location in Card:", location); // This will display either ipinfoData or the combined address

    
    const weatherCodeToIconMap = {
        4201: 'rain_heavy.svg',
        4001: 'rain.svg',
        4200: 'rain_light.svg',
        6201: 'freezing_rain_heavy.svg',
        6001: 'freezing_rain.svg',
        6200: 'freezing_rain_light.svg',
        6000: 'freezing_drizzle.svg',
        4000: 'drizzle.svg',
        7101: 'ice_pellets_heavy.svg',
        7000: 'ice_pellets.svg',
        7102: 'ice_pellets_light.svg',
        5101: 'snow_heavy.svg',
        5000: 'snow.svg',
        5100: 'snow_light.svg',
        5001: 'flurries.svg',
        8000: 'tstorm.svg',
        2100: 'fog_light.svg',
        2000: 'fog.svg',
        1001: 'cloudy.svg',
        1102: 'mostly_cloudy.svg',
        1101: 'partly_cloudy_day.svg',
        1100: 'mostly_clear_day.svg',
        1000: 'clear_day.svg'
    };

    const weatherCodeToDescriptionMap = {
        4201: 'Heavy Rain',
        4001: 'Rain',
        4200: 'Light Rain',
        6201: 'Heavy Freezing Rain',
        6001: 'Freezing Rain',
        6200: 'Light Freezing Rain',
        6000: 'Freezing Drizzle',
        4000: 'Drizzle',
        7101: 'Heavy Ice Pellets',
        7000: 'Ice Pellets',
        7102: 'Light Ice Pellets',
        5101: 'Heavy Snow',
        5000: 'Snow',
        5100: 'Light Snow',
        5001: 'Flurries',
        8000: 'Thunderstorm',
        2100: 'Light Fog',
        2000: 'Fog',
        1001: 'Cloudy',
        1102: 'Mostly Cloudy',
        1101: 'Partly Cloudy',
        1100: 'Mostly Clear',
        1000: 'Clear, Sunny'
    };
    


    
    
    const weatherCode = currentWeather.weatherCodeMax || 'N/A';
    const weatherIcon = weatherCodeToIconMap[weatherCode] || 'default_icon.svg'; // Fallback to a default icon if no match
    const weatherDescription = weatherCodeToDescriptionMap[weatherCode] || 'Unknown Weather';



    // const temperature = currentWeather.temperatureAvg || 'N/A';
        // const temperatureInCelsius = currentWeather.temperatureAvg;
    // const temperature = temperatureInCelsius !== 'N/A' ? (temperatureInCelsius * 9/5) + 32 : 'N/A';
    const tempHigh = currentWeather.temperatureMax || 'N/A';
    const humidity = currentWeather.humidityAvg || 'N/A';
    const pressure = currentWeather.pressureSurfaceLevelAvg || 'N/A';
   // const pressure = currentWeather.pressureSurfaceLevelAvg ? (currentWeather.pressureSurfaceLevelAvg * 0.02953).toFixed(2) : 'N/A';

    const windSpeed = currentWeather.windSpeedAvg || 'N/A';
    const visibility = currentWeather.visibilityAvg || 'N/A';
    const cloudCover = currentWeather.cloudCoverAvg || 'N/A';
    const uvIndex = currentWeather.uvIndexAvg || 'N/A';

    
    
    // Populate the main weather card
    
    weatherCardDiv.innerHTML = `
        <h2>${GeocodingData || ipinfoData}</h2>
        <div class="current-weather">
            <div style= "padding-left: 2rem;">
            <img src="/static/Images/icons/${weatherIcon}" alt="Weather Icon" style="width: 100px;">     
            <h3 text-align >${weatherDescription}</h3>      
            </div> 
            <h1>${tempHigh.toFixed(1)}°</h1>
            
        </div>
     

        <div class="weather-details">
            <div> <p>Humidity</p><img src="static/Images/humidity.png">    <p> ${Math.round(humidity)}%</p></div>
            <div><p>Pressure</p><img src="static/Images/pressure.png">     <p> ${pressure} in Hg</p></div>
            <div><p>Wind Speed</p><img src="static/Images/Wind_Speed.png">     <p> ${windSpeed} mph</p></div>
            <div><p>Visibility</p><img src="static/Images/Visibility.png">     <p> ${visibility} mi</p></div>
            <div><p>Cloud Cover</p><img src="static/Images/Cloud_Cover.png">     <p> ${Math.round(cloudCover)}% </p></div>
            <div><p>UV Level</p><img src="static/Images/UV_Level.png">     <p> ${uvIndex}</p></div>
        </div>
    `;

    // Populate the forecast table with daily data
    const dailyForecast = data.timelines.daily;

    dailyForecast.forEach((day, index) => {



        const date = new Date(day.time);
const formattedDate = `${date.toLocaleDateString("en-US", { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleDateString("en-US", { month: 'short' })} ${date.getFullYear()}`;

console.log(formattedDate); // Example: "Wednesday, 11 Sep 2024"


        //const date = new Date(day.time).toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
        const tempHigh = day.values.temperatureMax || 'N/A';
        const tempLow = day.values.temperatureMin || 'N/A';
        const wind = day.values.windSpeedAvg || 'N/A';
        const tempHighF = tempHigh ? ((tempHigh * 9/5) + 32).toFixed(1) : 'N/A';
        const tempLowF = tempLow ? ((tempLow * 9/5) + 32).toFixed(1) : 'N/A';

        const weatherCodeToIconMap = {
            4201: 'rain_heavy.svg',
            4001: 'rain.svg',
            4200: 'rain_light.svg',
            6201: 'freezing_rain_heavy.svg',
            6001: 'freezing_rain.svg',
            6200: 'freezing_rain_light.svg',
            6000: 'freezing_drizzle.svg',
            4000: 'drizzle.svg',
            7101: 'ice_pellets_heavy.svg',
            7000: 'ice_pellets.svg',
            7102: 'ice_pellets_light.svg',
            5101: 'snow_heavy.svg',
            5000: 'snow.svg',
            5100: 'snow_light.svg',
            5001: 'flurries.svg',
            8000: 'tstorm.svg',
            2100: 'fog_light.svg',
            2000: 'fog.svg',
            1001: 'cloudy.svg',
            1102: 'mostly_cloudy.svg',
            1101: 'partly_cloudy_day.svg',
            1100: 'mostly_clear_day.svg',
            1000: 'clear_day.svg'
        };

        const weatherCodeToDescriptionMap = {
            4201: 'Heavy Rain',
            4001: 'Rain',
            4200: 'Light Rain',
            6201: 'Heavy Freezing Rain',
            6001: 'Freezing Rain',
            6200: 'Light Freezing Rain',
            6000: 'Freezing Drizzle',
            4000: 'Drizzle',
            7101: 'Heavy Ice Pellets',
            7000: 'Ice Pellets',
            7102: 'Light Ice Pellets',
            5101: 'Heavy Snow',
            5000: 'Snow',
            5100: 'Light Snow',
            5001: 'Flurries',
            8000: 'Thunderstorm',
            2100: 'Light Fog',
            2000: 'Fog',
            1001: 'Cloudy',
            1102: 'Mostly Cloudy',
            1101: 'Partly Cloudy',
            1100: 'Mostly Clear',
            1000: 'Clear, Sunny'
        };
        


        const weatherCode = day.values.weatherCodeMax || 'N/A';
        const weatherDescription = weatherCodeToDescriptionMap[weatherCode] || 'Unknown Weather';
        const weatherIcon = weatherCodeToIconMap[weatherCode] || 'default_icon.svg';
        console.log("Weather Code:", weatherCode);  


        

        // Create a new row for each forecast day
        // const row = document.createElement('tr');
        // row.innerHTML = `
        //     <td>${date}</td>
        //     <td> <img src="/static/Images/icons/${weatherIcon}" alt="Weather Icon" style="width: 100px;"></td>
        //     <td>${tempHighF} °F</td> 
        //     <td>${tempLowF} °F</td>
        //     <td>${wind} mph</td>
        // `;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td align-items: center;">${formattedDate}</td>
            <td style="align-items: center; display:flex ; justify-content:center ; text-align:center">
        <img src="/static/Images/icons/${weatherIcon}" alt="Weather Icon" style="width: 40px; margin-right: 10px;">
        <p >${weatherDescription}</p> <!-- Show weather description -->
            </td>
                   
            <td align-items: center;">${tempHigh} </td> 
            <td align-items: center;">${tempLow} </td>
            <td align-items: center;">${wind} </td>
        `;

        // Append the row to the table body
        forecastTableBody.appendChild(row);


     // Create a mapping for precipitation types
    
    const precipitationMapping = {
        0: "N/A",
        1: "Rain",
        2: "Snow",
        3: "Freezing Rain",
        4: "Ice Pellets"
    };

    const roundedValue = Math.round(day.values.precipitationProbabilityAvg)
    // Use the mapping to display the correct precipitation type
    const precipitationType = precipitationMapping[roundedValue] || "N/A";
    console.log("Precipitation avg probability:", roundedValue);
    console.log("Precipitation Type:", precipitationType);
    

        // Add click event listener to each row
        row.addEventListener('click', () => {
            document.querySelector('.forecast-table-container').style.display = 'none';
            document.querySelector('.weather-card-container').style.display = 'none';

            // Show the charts container if it exists
    const chartsContainer = document.getElementById('charts-container');
    if (chartsContainer) chartsContainer.style.display = ''; 

    // Show the daily card
    const dailyCard = document.getElementById('daily-card');
    if (dailyCard) dailyCard.style.display = ''; 

    // Show the daily details section
    const dailyDetails = document.getElementById('daily-details');
    if (dailyDetails) dailyDetails.style.display = ''; 
            
            dailyCard.scrollIntoView({ behavior: 'smooth', block:'start' });
            // Hide the forecast table and show the daily details

            // forecastTableContainer.style.display = 'none';
            // dailyDetailsDiv.style.display = 'block';
           

            // Replace the precipitation line in your HTML
           

            // Populate the daily card with the selected day's details

            dailyCardDiv.innerHTML = `
            <div>

            <div class="weather-info">
    <div class="weather-text">
        <h2>${formattedDate}</h2>
        <h2><strong>${weatherDescription}</strong></h2>
        <h2 id="temptext">${tempHigh} °F / ${tempLow} °F</h2>
    </div>
        <img src="/static/Images/icons/${weatherIcon}" alt="Weather Icon" style="width: 9rem; margin-right: 10px;">

            </div>

            <div class="aligned-text">
    <p><span>Precipitation :</span> ${precipitationType}</p>
    <p><span>Chance of Rain:</span> ${day.values.precipitationProbabilityAvg || 0}%</p>
    <p><span>Wind Speed:</span> ${wind} mph</p>
    <p><span>Humidity:</span> ${day.values.humidityAvg || 'N/A'}%</p>
    <p><span>Visibility:</span> ${day.values.visibilityAvg || 'N/A'} mi</p>
    <p><span>Sunrise/Sunset:</span> 
    ${new Date(day.values.sunriseTime)
        .toLocaleTimeString([], { hour: 'numeric',minute:'numeric', hour12: true })
        .replace('am', 'AM')
        .replace('pm', 'PM')} / 
    ${new Date(day.values.sunsetTime)
        .toLocaleTimeString([], { hour: 'numeric',minute:'numeric', hour12: true })
        .replace('am', 'AM')
        .replace('pm', 'PM')}
</p>     
</div> `;

        

        // Add the button outside the daily card div
    // Create a container for the weather charts section
const weatherChartsContainer = document.createElement('div');
weatherChartsContainer.style = `
    text-align: center;
    margin-top: 10px;
`;

// Create the Weather Charts text
const weatherChartsText = document.createElement('p');
weatherChartsText.textContent = 'Weather Charts';
weatherChartsText.style = `
    font-weight: normal;
    font-size: 2.7rem;
    margin: 0;
`;

// Create the arrow image below the text
const arrowImage = document.createElement('img');
arrowImage.src = '/static/Images/down.png';
arrowImage.alt = 'Toggle Arrow';
arrowImage.style = `
    width: 30px;
    margin-top: 5px;
    cursor: pointer;
`;

// Add click event listener to the arrow image
arrowImage.addEventListener('click', () => {
    console.log('Arrow clicked');
            
            console.log("Weather Data to the graphs:", data);

                // Scroll the arrow into view smoothly
            arrowImage.scrollIntoView({ behavior: 'smooth',block: 'start'});

            if (arrowImage.src.includes('down.png')) {
                arrowImage.src = '/static/Images/up.png';
                creategraph(data);
                //createWeatherChart(data);


                second_chart(data);
                // changeArrow();
            } else {
                arrowImage.src = '/static/Images/down.png';
                 // Scroll the weather card into view when the arrow is up
                 arrowImage.scrollIntoView({ behavior: 'smooth',block: 'end'});

            }
        

})


;
// document.querySelector('.forecast-table-container').innerHTML = '';
// document.querySelector('.weather-card-container').innerHTML = '';


// Append the text and arrow to the container
  // Check if weatherChartsText is already present
// if (!document.querySelector('#weather-charts-text')) {
//     weatherChartsContainer.appendChild(weatherChartsText);
// }

// // Check if arrowImage is already present
// if (!document.querySelector('#arrow-image')) {
//     weatherChartsContainer.appendChild(arrowImage);
// }
// Ensure weatherChartsText is only appended once
if (!document.querySelector('#weather-charts-text')) {
    weatherChartsText.id = 'weather-charts-text'; // Assign an ID for reference
    weatherChartsContainer.appendChild(weatherChartsText);
}

// Ensure arrowImage is only appended once
if (!document.querySelector('#arrow-image')) {
    arrowImage.id = 'arrow-image'; // Assign an ID for reference
    weatherChartsContainer.appendChild(arrowImage);
}

// Insert the container only if not already present
if (!document.body.contains(weatherChartsContainer)) {
    dailyCardDiv.insertAdjacentElement('afterend', weatherChartsContainer);
}


// Insert the container after the daily card div
// dailyCardDiv.insertAdjacentElement('afterend', weatherChartsContainer);
      
            // creategraph(data);
            // createWeatherChart(data);
            // console.log("Weather Data to the graphs:", data);

        });

        forecastTableBody.appendChild(row);
    });

}










//     function extractTemperatureRanges(data) {
//     // Check if data is valid and has the expected structure
//     if (!data || !data.timelines || !data.timelines.daily || data.timelines.daily.length === 0) {
//         console.error("Invalid or empty data structure:", data);
//         return [];
//     }

//     // Iterate through daily forecast data to extract min and max temperatures
//     const temperatureRanges = data.timelines.daily.map(day => {
//         const tempMin = day.values.temperatureMin || 0;
//         const tempMax = day.values.temperatureMax || 0;
//         return [tempMin, tempMax];  // Store as [min, max]
//     });
//     console.log("Temperature Ranges:", temperatureRanges);
//     return temperatureRanges; 
// }
function extractTemperatureRanges(data) {
    // Check if data is valid and has the expected structure
    if (!data || !data.timelines || !data.timelines.daily || data.timelines.daily.length === 0) {
        console.error("Invalid or empty data structure:", data);
        return [];
    }

    // Iterate through daily forecast data to extract min and max temperatures
    const temperatureRanges = data.timelines.daily.map(day => {
        console.log("Day:", day);
        const tempMin = day.values.temperatureMin || 0;
        const tempMax = day.values.temperatureMax || 0;
        const graphday = new Date(day.time).getTime();
        //const timestamp = day.time;  // Assuming 'time' contains the timestamp for the day
        return [graphday, tempMin, tempMax];  // Store as [timestamp, min, max]
    });
    
    console.log("Temperature Ranges:", temperatureRanges);
    return temperatureRanges; 
}


function creategraph(data) {
    const temperatureRanges = extractTemperatureRanges(data);

    if (temperatureRanges.length === 0) {
        console.error("No temperature ranges available to plot.");
        return;
    }

    Highcharts.chart('container', {
        title: {
            text: 'Temperature Ranges (Min, Max)',
            align: 'center'
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            title: {
                text: null  // Ensure there is no y-axis title set
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°F',
            xDateFormat: '%A, %b %e'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false  // Disable data labels on the series
                }
            }
        },
        series: [{
            name: 'Temperatures',  // This will only affect tooltips, not the graph display
            data: temperatureRanges.map(range => [range[0], range[1], range[2]]),
            type: 'arearange',
            lineWidth: 2,
            color: 'orange',
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FF8C00'],
                    [1, 'rgba(0,191,255,0.4)']
                ]
            },
            fillOpacity: 0.3,
            marker: {
                enabled: true,
                fillColor: 'skyblue',
                lineColor: 'skyblue'
            },
            showInLegend: false  // Disable legend entry for this series
        }]
    });
}


function second_chart(data){
    jsonArray = second_graph_data(data)
    console.log(jsonArray)
    window.meteogram = new Meteogram(jsonArray, 'container2');
}



function Meteogram(json, container) {
    // Parallel arrays for the chart data, these are populated as the JSON file
    // is loaded
    this.symbols = [];
    this.precipitations = [];
    this.precipitationsError = []; // Only for some data sets
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.data = json;
    this.container = container;

    // Run
    console.log(json);
    this.parseYrData();
}







Meteogram.prototype.parseYrData = function () {

    let pointStart;

    if (!this.data) {
        console.error('JSON object is not valid');
        return this.error();
    }
    console.log("reached here");
    console.log(this.data);

    // Loop over hourly (or 6-hourly) forecasts
        this.data.forEach((node, i) => {
            console.log("here i am ")
        const x = Date.parse(node.time),
            // nextHours = node.data.next_1_hours || node.data.next_6_hours,
            // symbolCode = nextHours && nextHours.summary.symbol_code,
            // to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;
            symbolCode = node.data.symbol_code,  //convert code to name 
            to = x + 36e5;

        if (to > pointStart + 120 * 36e5) {
            return;
        }

        // Populate the parallel arrays
        this.symbols.push(node.data.symbol_code);

      

        this.precipitations.push({
            x,
            y: node.data.relative_humidity
        });

        if (i % 2 === 0) {
            this.winds.push({
                x,
                value: node.data.wind_speed,
                direction: node.data.wind_from_direction
            });
        }

        this.pressures.push({
            x,
            y: node.data.air_pressure_at_sea_level
        });

         // weather_name = weatherDescription[symbolCode]

         this.temperatures.push({
            x,
            y: node.data.air_temperature,
            // custom options used in the tooltip formatter
            // what the hell is this? i need to change this
            to
            //symbolName : weather_name
            // symbolName: Meteogram.dictionary[
            //     symbolCode.replace(/_(day|night)$/, '')
            // ].text
        });



        if (i === 0) {
            pointStart = (x + to) / 2;
        }
    });

    // Create the chart when the data is loaded
    this.createChart();
};



Meteogram.prototype.createChart = function () {
    this.chart = new Highcharts.Chart(this.getChartOptions()
    , chart => {
        this.onChartLoad(chart);
    });
};

Meteogram.prototype.onChartLoad = function (chart) {
    /* this.drawWeatherSymbols(chart); */
    this.drawBlocksForWindArrows(chart);

};

Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    const xAxis = chart.xAxis[0];

    for (
        let pos = xAxis.min, max = xAxis.max, i = 0;
        pos <= max + 36e5; pos += 36e5,
        i += 1
    ) {

        // Get the X position
        const isLast = pos === max + 36e5,
            x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        const isLong = this.resolution > 36e5 ?
            pos % this.resolution === 0 :
            i % 2 === 0;

        chart.renderer
            .path([
                'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                'L', x, chart.plotTop + chart.plotHeight + 32,
                'Z'
            ])
            .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};

Meteogram.prototype.error = function () {
    document.getElementById('container2').innerHTML =
        '<i class="fa fa-frown-o"></i> Failed loading data, please try again ' +
        'later';
};

/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 310,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        defs: {
            patterns: [{
                id: 'precipitation-error',
                path: {
                    d: [
                        'M', 3.3, 0, 'L', -6.7, 10,
                        'M', 6.7, 0, 'L', -3.3, 10,
                        'M', 10, 0, 'L', 0, 10,
                        'M', 13.3, 0, 'L', 3.3, 10,
                        'M', 16.7, 0, 'L', 6.7, 10
                    ].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1
                }
            }]
        },

        title: {
            text: 'Hourly Weather (For Next 5 Days)',
            align: 'center',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        credits: {
            text: 'Forecast',
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M} - ' +
                '{point.point.to:%H:%M}</small><br>' +
                '<b>{point.point.symbolName}</b><br>'

        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: ' +
                    'bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: 8
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'hPa',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: Highcharts.getOptions().colors[2]
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: Highcharts.getOptions().colors[2]
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    ' ' +
                    '{series.name}: <b>{point.y}°F</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Precipitation',
            data: this.precipitationsError,
            type: 'column',
            color: 'url(#precipitation-error)',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                valueSuffix: ' mm',
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    ' ' +
                    '{series.name}: <b>{point.minvalue} mm - ' +
                    '{point.maxvalue} mm</b><br/>'
            },
            grouping: false,
            dataLabels: {
                enabled: this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'maxValue',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            }
        }, {
            name: 'Precipitation',
            data: this.precipitations,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'y',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: '#666'
                }
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }, {
            name: 'Air pressure',
            color: Highcharts.getOptions().colors[8],
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' inHg'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: Highcharts.getOptions().colors[1],
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' mph'
            }
        }]
    };
};







    // function creategraph(data) {
    //     const temperatureRanges = extractTemperatureRanges(data); // This should return an array of [timestamp, minTemp, maxTemp]
    
    //     if (temperatureRanges.length === 0) {
    //         console.error("No temperature ranges available to plot.");
    //         return;
    //     }
    
    //     // Configure the Highcharts chart using the extracted temperature data
    //     Highcharts.chart('container', {
    //         title: {
    //             text: 'Temperature Ranges (Min, Max)',
    //             align: 'center'
    //         },
    //         tooltip: {
    //             crosshairs: true,
    //             shared: true,
    //             valueSuffix: '°F'
    //         },
    //         plotOptions: {
    //             series: {
    //                 pointStart: Date.now(),  // Start from the current date
    //                 pointInterval: 24 * 3600 * 1000,  // One day interval
    //             }
    //         },
    //         series: [{
    //             name: 'Temperature Range',
    //             data: temperatureRanges.map(range => [range[0], range[1], range[2]]),  // Ensure data is in [timestamp, minTemp, maxTemp] format
    //             type: 'arearange',
    //             lineWidth: 2,  // Set line width
    //             color: 'orange',  // Set the line color to orange
    //             fillColor: {
    //                 linearGradient: {
    //                     x1: 0,
    //                     y1: 0,
    //                     x2: 0,
    //                     y2: 1
    //                 },
    //                 stops: [
    //                     [0, Highcharts.color('orange').setOpacity(0.5).get('rgba')], // Start with orange at full opacity
    //                     [1, Highcharts.color('skyblue').setOpacity(0.5).get('rgba')] // Fade to sky blue at the bottom
    //                 ]
    //             },
    //             zIndex: 0,
    //             marker: {
    //                 enabled: true,
    //                 fillColor: 'skyblue', // Set the marker color to sky blue
    //                 lineColor: 'skyblue' // Optional: set the line color of the marker
    //             }
    //         }]
    //     });
    // }


    // function parseTomorrowApiData(data) {
    //     const hourlyData = data.timelines.hourly;
    
    //     let temperatures = [];
    //     let humidities = [];
    //     let pressures = [];
    //     let winds = [];
    //     let times = [];
    
    //     hourlyData.forEach(hour => {
    //         const timestamp = new Date(hour.time).getTime();
    //         const temperature = hour.values.temperature || 0;
    //         const humidity = hour.values.humidity || 0;
    //         const pressure = hour.values.pressureSeaLevel || 0;
    //         const windSpeed = hour.values.windSpeed || 0;
    
    //         console.log("Hourly Data:", timestamp, temperature, humidity, pressure, windSpeed);


    //         times.push(timestamp);
    //         temperatures.push([timestamp, temperature]);
    //         humidities.push([timestamp, humidity]);
    //         pressures.push([timestamp, pressure]);
    //         winds.push([timestamp, windSpeed]);


    //     });
    
    //     return { temperatures, humidities, pressures, winds, times };
    //     //    const { temperatures, humidities, pressures, winds, windDirections, times } = parseTomorrowApiData(data);

    // }




    function second_graph_data(data){
        // let array = {
        //     "properties": {
        //         "meta": {
        //             "updated_at": "2024-10-09T17:17:56Z",
        //             "units": {
        //                 "air_pressure_at_sea_level": "hPa",
        //                 "air_temperature": "fahrenheit",
        //                 "cloud_area_fraction": "%",
        //                 //"precipitation_amount": "mm",    //precipitation_amount =
        //                 "relative_humidity": "%",
        //                 "wind_from_direction": "degrees",
        //                 "wind_speed": "mph"
        //             }
        //         },
        //         "timeseries": [
        //             {
        //                 "time": "2024-10-09T17:00:00Z",
        //                 "data":{
        //                         "air_pressure_at_sea_level": 985.9,
        //                         "air_temperature": 14,
        //                         "cloud_area_fraction": 87.5,
        //                         "relative_humidity": 81.1,
        //                         "wind_from_direction": 337.7,
        //                         "wind_speed": 4.2,
        //                         "symbol_code": "lightrain"
        //                     }
        //             },
        //             {
        //                 "time": "2024-10-09T17:00:00Z",
        //                 "data": {
        //                     "instant": {
        //                         "details": {
        //                             "air_pressure_at_sea_level": 985.9,
        //                             "air_temperature": 14,
        //                             "cloud_area_fraction": 87.5,
        //                             "relative_humidity": 81.1,
        //                             "wind_from_direction": 337.7,
        //                             "wind_speed": 4.2,
        //                             "symbol_code": "lightrain"
        //                         }
        //                     }
        //                 }
        //             },
    
    
        //         ]
        //     }
        // }
        const data2Array = {
            "properties": {
                "meta": {
                    "updated_at": "2024-10-09T17:17:56Z",
                    "units": {
                        "air_pressure_at_sea_level": "hPa",
                        "air_temperature": "fahrenheit",
                        "cloud_area_fraction": "%",
                        "precipitation_amount": "mm",    //precipitation_amount =
                        "relative_humidity": "%",
                        "wind_from_direction": "degrees",
                        "wind_speed": "mph"
                    }
                }
            }
        }
        const data_to_parse = weatherData.timelines.hourly;
        console.log(data_to_parse)
        const temp_fields = [];
    
        //console.log(data_to_parse)
        // Get the current date in UTC and set the time to midnight (start of the next day)
        // const currentDate = new Date();
        // const nextDay = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 1);
        // nextDay.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    
        // Loop through the weather data and only collect data from the next day onwards
        for (let i = 0; i < data_to_parse.length; i++) {
            const time = new Date(data_to_parse[i].startTime);
    
            // Check if the time is greater than or equal to the start of the next day
            // if (time >= nextDay) {
                temp_fields.push({
                    "time": data_to_parse[i].time,
                    "data": {
                        "air_pressure_at_sea_level": data_to_parse[i].values.pressureSurfaceLevel,
                        "air_temperature": data_to_parse[i].values.temperature,
                        "cloud_area_fraction": data_to_parse[i].values.cloudCover,
                        "relative_humidity": data_to_parse[i].values.humidity,
                        "wind_from_direction": data_to_parse[i].values.windDirection,
                        "wind_speed": data_to_parse[i].values.windSpeed,
                    }
                });
            // }
            
        }
        console.log(temp_fields)
        // console.log(data2Array)

    
        // data2Array.properties.timeseries = final_fields
        //console.log(data2Array)
    
        return temp_fields;
    }

















    
    // function parseTomorrowApiData(data) {
    //     const hourlyData = data.timelines.hourly;
    
    //     let temperatures = [];
    //     let humidities = [];
    //     let pressures = [];
    //     let winds = [];
    //     let windDirections = [];
    //     let times = [];
    
    //     hourlyData.forEach(hour => {
    //         const timestamp = new Date(hour.time).getTime();
    //         const temperature = hour.values.temperature || 0;
    //         const humidity = hour.values.humidity || 0;
    //         const pressure = hour.values.pressureSurfaceLevel || 0;
    //         const windSpeed = hour.values.windSpeed || 0;
    //         const windDirection = hour.values.windDirection || 0; // Adding wind direction
    
    //        // console.log("Hourly Data:", timestamp, temperature, humidity, pressure, windSpeed, windDirection);
    
    //         times.push(timestamp);
    //         temperatures.push([temperature]);
    //         humidities.push([ humidity]);
    //         pressures.push([ pressure]);
    
    //         // Wind speed and direction for windbarb
    //         winds.push([ windSpeed]);
    //         windDirections.push([windDirection]);
    //     });
        
    //     console.log("Hourly Data:", temperatures, humidities, pressures, winds, windDirections, times);
    //     return { temperatures, humidities, pressures, winds, windDirections, times };
    // }
    
        

    //     function createWeatherChart(data) { 

    //         const { temperatures, humidities, pressures, winds, times } = parseTomorrowApiData(data);
        
    //         Highcharts.chart('container2', {
    //             chart: {
    //                 renderTo: 'container2',
    //                 marginBottom: 70,
    //                 marginRight: 40,
    //                 marginTop: 50,
    //                 plotBorderWidth: 1,
    //                 height: 400,
    //                 alignTicks: false,
    //                 scrollablePlotArea: {
    //                     minWidth: 1000 //720
    //                 }
    //             },
    //             title: {
    //                 text: 'Hourly Weather (For Next 5 Days)',
    //                 align: 'center'
    //             },
    //             xAxis: [{
    //                 type: 'datetime',
    //                 tickInterval: 4 * 36e5,  // Every 4 hours
    //                 minorTickInterval: 36e5,  // Every 1 hour
    //                 gridLineWidth: 1,
    //                 crosshair: true
    //             }],
    //             yAxis: [{  // Temperature Y-Axis
    //                 title: { text: 'Temperature (°F)' },
    //                 labels: { format: '{value}°F' },
                    
    //             }, {  // Humidity Y-Axis
    //                 title: { text: 'Humidity (%)' },
    //                 labels: { format: '{value}%' },
    //                 max: 100,
    //                 gridLineWidth: 0,
    //                 opposite: true
    //             }, {  // Air pressure Y-Axis
    //                 allowDecimals: false,
    //                 title: { text: 'Air pressure (hPa)' },
    //                 labels: { format: '{value} Hg' },
    //                 opposite: true
    //             }],
    //             tooltip: {
    //                 shared: true,
    //                 useHTML: true,
    //                 headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br>',
    //                 // pointFormat: '<b>Temperature:</b> {point.y}°F<br/>' +
    //                 //              '<b>Humidity:</b> {point.y} %<br/>' +
    //                 //              '<b>Air pressure:</b> {point.y} hPa<br/>' +
    //                 //              '<b>Wind:</b> {point.y} mph<br/>'
    //             },
    //             series: [{
    //                 name: 'Temperature',
    //                 data: temperatures,
    //                 type: 'spline',
    //                 color: '#FF3333',
    //                 tooltip: { valueSuffix: ' °F' }
    //             }, {
    //                 name: 'Humidity',
    //                 data: humidities,
    //                 type: 'column',
    //                 color: '#68CFE8',
    //                 yAxis: 1,  // Humidity will use the second Y-axis
    //                 dataLabels: {
    //                     enabled: true,
    //                     style: { fontSize: '8px', color: '#666' }
    //                 },
    //                 tooltip: { valueSuffix: ' %' }
    //             }, {
    //                 name: 'Air pressure',
    //                 data: pressures,
    //                 type: 'spline',
    //                 color: '#48AFE8',
    //                 dashStyle: 'shortdot',
    //                 yAxis: 2,  // Air pressure uses the third Y-axis
    //                 tooltip: { valueSuffix: ' hPa' }
    //             }, {
    //                 name: 'Wind Speed',
    //                 data: winds,
    //                 type: 'spline',
    //                 color: '#00A9E0',
    //                 tooltip: { valueSuffix: ' mph' }
    //             }]
    //         });
    //     }
        



        

       

    // Other functions like getChartOptions() and onChartLoad() go here...
    
    






// Assuming you have `dailyForecastData` and `hourlyForecastData` variables populated with the correct data



// working Function to display weather data on the webpage
// function displayWeatherData(data) {
//     const weatherCardDiv = document.getElementById('weather-card');
//     const forecastTableBody = document.getElementById('forecast-table').getElementsByTagName('tbody')[0];

//     // Clear previous content
//     weatherCardDiv.innerHTML = "";
//     forecastTableBody.innerHTML = "";

//     // Check if data is valid and has the expected structure
//     if (!data || !data.timelines || !data.timelines.daily || data.timelines.daily.length === 0) {
//         console.error("Invalid or empty data structure:", data);
//         weatherCardDiv.innerHTML = `<p>No weather data available for this location.</p>`;
//         return;
//     }

//     // Extract the current weather information from the first interval of daily data
//     const currentWeather = data.timelines.daily[0].values;

//     // Extract fields from current weather data
//     const location = "1234 W 29th St, Los Angeles, CA 90007, USA"; // Replace with actual address if available
//     const temperature = currentWeather.temperatureAvg || 'N/A';
//     const temperatureMax = currentWeather.temperatureMax || 'N/A';
//     const temperatureMin = currentWeather.temperatureMin || 'N/A';
//     const humidity = currentWeather.humidityAvg || 'N/A';
//     const pressure = currentWeather.pressureSurfaceLevelAvg || 'N/A';
//     const windSpeed = currentWeather.windSpeedAvg || 'N/A';
//     const visibility = currentWeather.visibilityAvg || 'N/A';
//     const cloudCover = currentWeather.cloudCoverAvg || 'N/A';
//     const uvIndex = currentWeather.uvIndexAvg || 'N/A';

//     // Create and populate the weather card
//     weatherCardDiv.innerHTML = `
//         <h2>${location}</h2>
//         <div class="current-weather">
//             <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png" alt="Weather Icon" style="width: 100px;">
//             <h1>${temperature} °F</h1>
//             <p>Cloud Cover: ${cloudCover}%</p>
//         </div>
//         <div class="weather-details" style="display: flex; justify-content: space-around; margin-top: 20px;">
//             <div>
//                 <p>Humidity</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png" alt="Humidity Icon" style="width: 24px;">
//                 <p>${humidity}%</p>
//             </div>
//             <div>
//                 <p>Pressure</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png" alt="Pressure Icon" style="width: 24px;">
//                 <p>${pressure} hPa</p>
//             </div>
//             <div>
//                 <p>Wind Speed</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png" alt="Wind Icon" style="width: 24px;">
//                 <p>${windSpeed} mph</p>
//             </div>
//             <div>
//                 <p>Visibility</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png" alt="Visibility Icon" style="width: 24px;">
//                 <p>${visibility} mi</p>
//             </div>
//             <div>
//                 <p>Cloud Cover</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png" alt="Cloud Cover Icon" style="width: 24px;">
//                 <p>${cloudCover}%</p>
//             </div>
//             <div>
//                 <p>UV Index</p>
//                 <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png" alt="UV Icon" style="width: 24px;">
//                 <p>${uvIndex}</p>
//             </div>
//         </div>
//     `;

//     // Extract daily forecast and populate the forecast table
//     const dailyForecast = data.timelines.daily;

//     dailyForecast.forEach(day => {
//         const date = new Date(day.time).toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
//         const tempHigh = day.values.temperatureMax || 'N/A';
//         const tempLow = day.values.temperatureMin || 'N/A';
//         const wind = day.values.windSpeedAvg || 'N/A';
//         const weatherIcon = "https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png"; // Placeholder icon, replace with actual status icon if available

//         // Create a new row for each forecast day
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${date}</td>
//             <td><img src="${weatherIcon}" style="width: 24px;"> Clear</td>
//             <td>${tempHigh} °F</td>
//             <td>${tempLow} °F</td>
//             <td>${wind} mph</td>
//         `;
//         forecastTableBody.appendChild(row);
//     });
// }




    // Function to show error messages
    function showError(message) {
        resultsDiv.innerHTML = `<p class="error">${message}</p>`;
    }
    
});