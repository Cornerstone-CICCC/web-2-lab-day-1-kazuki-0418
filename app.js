const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const country = document.getElementById("country");
const timezone = document.getElementById("timezone");
const population = document.getElementById("population");
const forecast = document.getElementById("forecast");
const dayMode = document.getElementById("day-mode");
const modeImage = document.getElementById("mode-image");
const infoTable = document.getElementsByClassName("info-table");
const city = document.getElementsByClassName("city");

city[0].style.display = "none";
infoTable[0].style.display = "none";

const getCity = async (city) => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await res.json();
    return data.results[0];
  } catch (err) {
    new Error(err);
  }
};

const getWeather = async (latitude, longitude) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    new Error(err);
  }
};

const buildStyle = async (cityInput) => {
  try {
    const cityData = await getCity(cityInput);
    if (!cityData) {
      throw new Error("City not found");
    }

    const weatherData = await getWeather(cityData.latitude, cityData.longitude);

    cityName.innerHTML = cityData.name;
    temp.innerHTML = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;

    country.innerHTML = cityData.country;
    timezone.innerHTML = cityData.timezone;
    population.innerHTML = cityData.population;

    const daily = weatherData.daily;
    const dailyUnits = weatherData.daily_units;
    const htmlMinTemp = `<p>Low: ${daily.temperature_2m_min[0]} ${dailyUnits.temperature_2m_min}</p>`;
    const htmlMaxTemp = `<p>Max: ${daily.temperature_2m_max[0]} ${dailyUnits.temperature_2m_max}</p>`;

    forecast.innerHTML = htmlMinTemp + htmlMaxTemp;

    if (weatherData.current.is_day === 1) {
      dayMode.classList.add("day-mode");

      modeImage.src = "/images/day.jpg";
    }

    if (weatherData.current.is_day === 0) {
      dayMode.classList.remove("day-mode");
      dayMode.classList.add("night-mode");
      modeImage.src = "/images/night.jpg";
      searchInput.style.color = "white";
    }

    city[0].style.display = "flex";
    infoTable[0].style.display = "block";
  } catch (err) {
    console.error(err);
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    buildStyle(searchInput.value);
  } catch (err) {
    console.error(err);
  }
});
