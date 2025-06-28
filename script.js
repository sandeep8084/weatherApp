const API_KEY = "7545ef5bbade0b7a57c4f4ae9ad4d99f";
let currentUnit = "metric"; // or 'imperial'
let currentWeatherData = null;

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherBox = document.getElementById("weatherData");
  const button = document.getElementById("searchBtn");

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    weatherBox.innerHTML = `<p>Loading...</p>`;
    button.disabled = true;

    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    currentWeatherData = data;
    displayWeather(data);
  } catch (error) {
    weatherBox.innerHTML = `<p style="color: red;">${error.message}</p>`;
  } finally {
    button.disabled = false;
  }
}

function displayWeather(data) {
  const weatherBox = document.getElementById("weatherData");
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const tempC = data.main.temp;
  const tempF = (tempC * 9) / 5 + 32;
  const isFahrenheit = document.getElementById("unitToggle").checked;

  weatherBox.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Weather Icon" />
    <p><strong>Temperature:</strong> ${
      isFahrenheit ? tempF.toFixed(1) + " °F" : tempC.toFixed(1) + " °C"
    }</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
}

function toggleUnit() {
  if (currentWeatherData) {
    displayWeather(currentWeatherData);
  }
}

window.onload = () => {
  const weatherBox = document.getElementById("weatherData");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      try {
        weatherBox.innerHTML = `<p>Fetching weather based on your location...</p>`;
        const res = await fetch(url);
        const data = await res.json();
        currentWeatherData = data;
        displayWeather(data);
      } catch (err) {
        weatherBox.innerHTML = `<p style="color:red;">Location fetch failed</p>`;
      }
    });
  }
};
