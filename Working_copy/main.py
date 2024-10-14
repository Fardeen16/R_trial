from flask import Flask, request, jsonify, send_from_directory
import os
import requests

app = Flask(__name__)

# Replace these with your actual API keys
GOOGLE_API_KEY = "AIzaSyChSFGvtd7eKcfHpNLj6H5j6_WHDWafCCE"
TOMORROW_API_KEY = "FPxTDwxaCu1KsH336Yp8o44FmJAQAiIO"
backupkey = "024Z9WPvrfPGsWfPqdFklYy4PloiZ1zq"
IPINFO_ACCESS_TOKEN = "8783cce893e6e3" 


@app.route('/')
def home():
    # Serve the main index.html file
    return send_from_directory(os.getcwd(), 'index.html')

# Serve static CSS files
@app.route('/styles.css')
def serve_css():
    return send_from_directory(os.getcwd(), 'styles.css')

# Serve static JavaScript files
@app.route('/script.js')
def serve_js():
    return send_from_directory(os.getcwd(), 'script.js')












@app.route('/weather', methods=['GET'])
def get_weather():
    """
    Endpoint to get weather data based on address or current location.
    It receives request parameters from the frontend and calls Google Geocoding API and Tomorrow.io API.
    """
    # Extract query parameters from frontend request
    location = request.args.get('location')  # 'current' if using current location
    street = request.args.get('street')  # Street address
    city = request.args.get('city')  # City name
    state = request.args.get('state')  # State name

    print(f"Received Request - Location: {location}, Street: {street}, City: {city}, State: {state}")

    # Determine whether to use the current location or the provided address
    if location == 'current':
        # If using current location, get latitude and longitude using IP address
        lat, lon = get_current_location()
        if lat is None or lon is None:
            return jsonify({"error": "Unable to determine location from IP address."}), 400
    else:
        # If using address, try to get latitude and longitude from the full address or state
        address = f"{street}, {city}, {state}" if street and city else state
        lat, lon = get_lat_lon_from_address(address)

        # If the full address is invalid, return error message
        if lat is None or lon is None:
            return jsonify({"error": f"Unable to determine latitude and longitude for the provided address: {address}."}), 400

    print(f"Latitude: {lat}, Longitude: {lon}")

    # Get weather data using Tomorrow.io API based on latitude and longitude
    weather_data = get_weather_data(lat, lon)
    print(f"Weather Data: {weather_data}")

    # If weather data is None, return an error response
    if weather_data is None:
        return jsonify({"error": "Unable to get weather data. Please check the API key or request parameters."}), 400

    # Return the weather data as a JSON response to the frontend
    return jsonify(weather_data), 200








def get_lat_lon_from_address(address):
    """
    Get latitude and longitude from an address using Google Maps Geocoding API.
    :param address: Complete address string (fallback to state if street and city are invalid)
    :return: latitude, longitude
    """
    # Construct the Google Geocoding API URL
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_API_KEY}"
    
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        if 'results' in json_data and len(json_data['results']) > 0:
            # Extract latitude and longitude from the response
            location = json_data['results'][0]['geometry']['location']
            lat, lon = location['lat'], location['lng']
            return lat, lon
    print(f"Geocoding API Error: {response.text}")
    return None, None




def get_current_location():
    """
    Get current location using IPinfo API.
    :return: latitude, longitude
    """
    url = f"https://ipinfo.io/json?token={IPINFO_ACCESS_TOKEN}"
    response = requests.get(url)
    if response.status_code == 200:
        location_data = response.json()
        loc = location_data.get("loc", "34.052235,-118.243683")  # Default to Los Angeles coordinates if location is not found
        lat, lon = loc.split(",")
        return lat, lon
    print(f"IPinfo API Error: {response.text}")
    return None, None



@app.route('/weather_by_coordinates', methods=['GET'])
def get_weather_by_coordinates():
    """
    Endpoint to get weather data based on latitude and longitude provided by the client.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if lat is None or lon is None:
        return jsonify({"error": "Latitude and longitude must be provided."}), 400

    # Get weather data using the modified get_weather_data function
    weather_data = get_weather_data(lat, lon)
    print(f"Weather Data: {weather_data}")  # Print the data to check the response format

    if weather_data is None:
        return jsonify({"error": "Unable to get weather data by co-ordinates. Please check the API key or request parameters."}), 400

    # Return the weather data as JSON
    return jsonify(weather_data), 200



def get_weather_data(lat, lon):
    """
    Get weather data from Tomorrow.io API using latitude and longitude.
    :param lat: Latitude of the location
    :param lon: Longitude of the location
    :return: JSON response from Tomorrow.io API or None if an error occurs
    """
    # Construct the URL using Tomorrow.io's forecast endpoint
    url = f"https://api.tomorrow.io/v4/weather/forecast"  # Simplified endpoint

    # Define only the essential query parameters for the API request
    params = {
        "location": f"{lat},{lon}",
        "timesteps": ["1h", "1d"],  # Get hourly and daily data
        "units": "imperial",  # Use imperial units (e.g., Fahrenheit)
        # "apikey": TOMORROW_API_KEY  # Use the provided API key
        "apikey": backupkey  # Use the provided API key
    }

    # Send request to Tomorrow.io API
    response = requests.get(url, params=params)

    # Print the raw response and status code for debugging
    print(f"Request URL: {response.url}")  # Log the full request URL
    print(f"Raw Response from Tomorrow.io: {response.text}")
    print(f"Status Code: {response.status_code}")

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        return response.json()  # Return the JSON response from the API

    # If not successful, print the error and return None
    print(f"Tomorrow.io API Error: {response.text}")
    return None




# working  get_weather_data function
# def get_weather_data(lat, lon):
#     """
#     Get weather data from Tomorrow.io API using latitude and longitude.
#     :param lat: Latitude of the location
#     :param lon: Longitude of the location
#     :return: JSON response from Tomorrow.io API or None if an error occurs
#     """
#     # Construct the URL using the direct Tomorrow.io API endpoint
#     url = f"https://api.tomorrow.io/v4/weather/forecast"

#     # Define the query parameters for the API request
#     params = {
#         "location": f"{lat},{lon}",
#         "apikey": TOMORROW_API_KEY
#     }

#     # Send the request to the Tomorrow.io API
#     response = requests.get(url, params=params)
    
#     # Print the raw response and status code for debugging
#     print(f"Request URL: {response.url}")  # Log the full request URL
#     print(f"Raw Response from Tomorrow.io: {response.text}")
#     print(f"Status Code: {response.status_code}")

#     # Check if the request was successful (status code 200)
#     if response.status_code == 200:
#         return response.json()  # Return the JSON response from the API

#     # If not successful, print the error and return None
#     print(f"Tomorrow.io API Error: {response.text}")
#     return None











# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
