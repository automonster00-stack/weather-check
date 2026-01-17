const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherCard = document.getElementById('weatherCard');

const weatherIcons = {
    0: '☀️',   // Clear sky
    1: '🌤️',  // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '🌨️', // Slight snow
    73: '🌨️', // Moderate snow
    75: '❄️',  // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌦️', // Slight rain showers
    81: '🌦️', // Moderate rain showers
    82: '⛈️',  // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
};

const weatherDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading();
    hideError();
    hideWeatherCard();

    try {
        // First, geocode the city name to get coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try another location.');
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country, admin1 } = location;

        // Fetch weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        displayWeather(weatherData, name, country, admin1);
    } catch (err) {
        showError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayWeather(data, cityName, country, region) {
    const current = data.current;
    const daily = data.daily;

    // City name
    let locationStr = cityName;
    if (region) locationStr += `, ${region}`;
    if (country) locationStr += `, ${country}`;
    document.getElementById('cityName').textContent = locationStr;

    // Date and time
    const now = new Date();
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Temperature
    document.getElementById('temp').textContent = Math.round(current.temperature_2m);

    // Weather icon and condition
    const weatherCode = current.weather_code;
    document.getElementById('weatherIcon').textContent = weatherIcons[weatherCode] || '🌡️';
    document.getElementById('condition').textContent = weatherDescriptions[weatherCode] || 'Unknown';

    // Details
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('precipitation').textContent = `${current.precipitation} mm`;

    // Forecast
    const forecastContainer = document.getElementById('forecastItems');
    forecastContainer.innerHTML = '';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : days[date.getDay()];
        const icon = weatherIcons[daily.weather_code[i]] || '🌡️';
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="icon">${icon}</div>
            <div class="temps">
                <span class="high">${high}°</span>
                <span class="low">${low}°</span>
            </div>
        `;
        forecastContainer.appendChild(forecastItem);
    }

    showWeatherCard();
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showWeatherCard() {
    weatherCard.classList.remove('hidden');
}

function hideWeatherCard() {
    weatherCard.classList.add('hidden');
}

// Check for geolocation on page load
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            showLoading();
            try {
                const { latitude, longitude } = position.coords;

                // Reverse geocode to get city name
                const geoResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
                );
                const geoData = await geoResponse.json();

                // Fetch weather for current location
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const weatherData = await weatherResponse.json();

                let cityName = 'Your Location';
                let country = '';
                let region = '';

                if (geoData.results && geoData.results.length > 0) {
                    cityName = geoData.results[0].name || 'Your Location';
                    country = geoData.results[0].country || '';
                    region = geoData.results[0].admin1 || '';
                }

                displayWeather(weatherData, cityName, country, region);
            } catch (err) {
                // Silently fail - user can still search manually
            } finally {
                hideLoading();
            }
        },
        () => {
            // Geolocation denied or failed - user can search manually
        }
    );
}
