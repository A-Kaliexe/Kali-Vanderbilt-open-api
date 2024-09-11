document.addEventListener("DOMContentLoaded", () => {
  const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,is_day,precipitation&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FChicago&models=best_match";

  axios
    .get(apiUrl)
    .then((response) => {
      const data = response.data;
      const current = data.current;
      const hourly = data.hourly;

      // Display current weather
      const temperature = current.temperature_2m || "N/A";
      const precipitation = current.precipitation || "N/A";
      const location = `Latitude ${data.latitude}, Longitude ${data.longitude}`;

      document.getElementById("location").textContent = `Location: ${location}`;
      document.getElementById(
        "temperature"
      ).textContent = `Temperature: ${temperature}°F`;
      document.getElementById(
        "conditions"
      ).textContent = `Precipitation: ${precipitation} mm`;

      // Display hourly forecast
      let forecastHtml = "<h3>Hourly Forecast</h3>";
      hourly.temperature_2m.forEach((temp, index) => {
        forecastHtml += `<p>Hour ${index + 1}: ${temp}°F</p>`;
      });
      document.getElementById("forecast").innerHTML = forecastHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("current-weather").innerHTML += "<p>Error.</p>";
    });
});
