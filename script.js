// GETTING ALL WEATHER DATA
function getWeather() {
    const apiKey = '357eb76ccbfc0bc8c134524e48481e75';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

        updateBackground(description);
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const temperatureF = Math.round((temperature * 9/5) + 32); // Convert to Fahrenheit
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C ${temperatureF}&#176;F</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
function updateBackground(description) {
    const body = document.body;
    const currentBackground = body.style.backgroundImage;

    let nextBackground;
    switch(description) {
        case 'clear sky':
            nextBackground = "url('/images/sunny-clear.jpg')";
            break;
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
            nextBackground = "url('/images/broken-clouds.jpg')";
            break;
        case 'overcast clouds':
            nextBackground = "url('/images/cloudy-overcast-sky.jpg')";
            break;
        case 'mist':
            nextBackground = "url('/images/foggy-road.jpg')";
            break;
        case 'light rain':
            nextBackground = "url('/images/rain.webp')";
            break;
        case 'heavy rain':
            nextBackground = "url('/images/heavy-rain.jpg')";
            break;
        case 'thunderstorm':
            nextBackground = "url('/images/thunder-storm.jpg')";
            break;
        case 'snow':
        case 'light snow':
            nextBackground = "url('/images/snow.jpg')";
            break;
        default:
            nextBackground = "url('/images/sunny-clear.jpg')";
            break;
    }

    body.style.transition = 'background-image 1s ease-in-out';
    body.style.backgroundImage = nextBackground;

    setTimeout(() => {
        body.style.transition = '';
    }, 2000);
}

// SEARCH BAR
document.getElementById("city").addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
        getWeather();
    }
});