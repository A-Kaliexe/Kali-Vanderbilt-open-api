const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=39.76&longitude=-98.5&current=temperature_2m,is_day,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;
const hourlyWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=39.76&longitude=-98.5&hourly=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

// Glob
let forecastData = []; // Stores the hourly data
let currentDisplayCount = 6;

// Fetches weather data
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

    // displays data
    forecastData = hourlyData.hourly.temperature_2m.map((temp, index) => ({
      time: new Date(hourlyData.hourly.time[index]).toLocaleTimeString(),
      temperature: temp,
      humidity: hourlyData.hourly.relative_humidity_2m[index],
    }));

    displayHourlyForecast();
  } catch (error) {
    console.error("Error:", error);
  }
}

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
    console.error("No current weather data available.");
  }
}

function displayHourlyForecast() {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const dataToShow = forecastData.slice(0, currentDisplayCount);
  dataToShow.forEach((entry) => {
    const div = document.createElement("div");
    div.textContent = `${entry.time}: Temperature ${entry.temperature}°F, Humidity ${entry.humidity}%`;
    forecastDiv.appendChild(div);
  });

  // Show or hide the "Show More" button
  const showMoreButton = document.getElementById("show-more-btn");
  showMoreButton.style.display =
    currentDisplayCount < forecastData.length ? "block" : "none";
}

document.getElementById("show-more-btn").addEventListener("click", () => {
  currentDisplayCount += 6;
  displayHourlyForecast();
});

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
    fetchWeatherData();
  } else {
    console.error("Navigation links or sections not found.");
  }
});
