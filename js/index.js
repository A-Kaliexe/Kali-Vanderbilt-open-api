const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=39.76&longitude=-98.5&current=temperature_2m,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;
const hourlyWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=39.76&longitude=-98.5&hourly=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

// Fetches
async function fetchWeatherData() {
  try {
    const currentResponse = await fetch(currentWeatherUrl);
    if (!currentResponse.ok) {
      throw new Error("Current weather request failed");
    }
    const currentData = await currentResponse.json();
    console.log("Current Weather Data:", currentData);
    displayCurrentWeather(currentData.current);

    const hourlyResponse = await fetch(hourlyWeatherUrl);
    if (!hourlyResponse.ok) {
      throw new Error("Hourly forecast request failed");
    }
    const hourlyData = await hourlyResponse.json();
    console.log("Hourly Weather Data:", hourlyData);
    displayHourlyForecast(hourlyData.hourly);
  } catch (error) {
    console.error("Error:", error);
  }
}

// displays
function displayCurrentWeather(currentWeather) {
  if (currentWeather) {
    document.getElementById(
      "location"
    ).textContent = `Location: Latitude 39.76, Longitude -98.5`;
    document.getElementById(
      "temperature"
    ).textContent = `Temperature: ${currentWeather.temperature_2m}°F`;
    document.getElementById("is-day").textContent = `Day/Night: ${
      currentWeather.is_day ? "Day" : "Night"
    }`;
    document.getElementById(
      "conditions"
    ).textContent = `Conditions: ${currentWeather.weather_code}`;
  } else {
    console.error("error");
  }
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyData) {
  if (hourlyData) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    hourlyData.temperature_2m.forEach((temp, index) => {
      const time = new Date(hourlyData.time[index]).toLocaleTimeString();
      const humidity = hourlyData.relative_humidity_2m[index];
      forecastDiv.innerHTML += `<p>${time}: Temperature ${temp}°F, Humidity ${humidity}%</p>`;
    });
  } else {
    console.error("error");
  }
}

// Event listener for navigation links
document.addEventListener("DOMContentLoaded", () => {
  const currentWeatherLink = document.getElementById("current-weather-link");
  const hourlyForecastLink = document.getElementById("hourly-forecast-link");
  const currentWeatherSection = document.getElementById("current-weather");
  const hourlyForecastSection = document.getElementById("hourly-forecast");

  if (
    currentWeatherLink &&
    hourlyForecastLink &&
    currentWeatherSection &&
    hourlyForecastSection
  ) {
    // Toggle sections based on the clicked link
    function toggleSection(showCurrent) {
      currentWeatherSection.hidden = !showCurrent;
      hourlyForecastSection.hidden = showCurrent;
    }

    currentWeatherLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSection(true);
    });

    hourlyForecastLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSection(false);
    });

    toggleSection(true);

    // Fetch and display both weather data
    fetchWeatherData();
  } else {
    console.error("error");
  }
});
