function displayDateTime() {
    const now = new Date();
    const dateTimeDiv = document.getElementById('date-time');
    dateTimeDiv.innerHTML = `Current Date and Time: ${now.toLocaleString('en-US')}`;
}

window.onload = displayDateTime;

function getFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toLocaleDateString('en-US');
}

async function getWeather() {
    const citySelect = document.getElementById('city');
    const selectedCity = citySelect.options[citySelect.selectedIndex].value.split(",");
    const [lat, lon, city, country] = selectedCity;
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const loadingDiv = document.getElementById('loading');
    weatherInfoDiv.innerHTML = '';
    loadingDiv.style.display = 'block';

    try {
        console.log(`Fetching weather data for city: ${city}, ${country}`);
        const weatherResponse = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
        const weatherData = await weatherResponse.json();
        console.log(weatherData);

        if (weatherResponse.ok && weatherData.dataseries && weatherData.dataseries.length > 0) {
            let htmlContent = `<h2>Daytime Weather Forecast for ${city}, ${country}</h2>`;
            htmlContent += `<table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Daytime Temperature</th>
                        <th>Weather Type</th>
                        <th>Weather Icon</th>
                    </tr>
                </thead>
                <tbody>`;
            const daysToShow = weatherData.dataseries.filter((day) => day.timepoint % 24 === 12).slice(0, 7); // Display next 7 days only
            daysToShow.forEach((day, index) => {
                let weatherType = day.weather;
                let weatherIcon = '';
                let date = getFutureDate(index) || 'Unavailable';
                let tempDay = day.temp2m || 'Unavailable';

                switch (weatherType) {
                    case 'clearnight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/clearday.png'; // Clear Day
                        break;
                    case 'cloudynight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/cloudy.png'; // Cloudy
                        break;
                    case 'fognight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/fog.png'; // Fog
                        break;
                    case 'humidnight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/humid.png'; // Humid
                        break;
                    case 'ishowernight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/ishower.png'; // Isolated Showers
                        break;
                    case 'lightrainnight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/lightrain.png'; // Light Rain
                        break;
                    case 'lightsnownight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/lightsnow.png'; // Light Snow
                        break;
                    case 'mcloudynight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/mcloudy.png'; // Mostly Cloudy
                        break;
                    case 'oshowernight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/oshower.png'; // Occasional Showers
                        break;
                    case 'pcloudynight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/pcloudy.png'; // Partly Cloudy
                        break;
                    case 'rainnight':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/rain.png'; // Rain
                        break;
                    case 'rainsnow':
                        weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/rainsnow.png'; // Rain and Snow
                        break;
                        case 'tsrainnight':
                            weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/tsrain.png'; // Thunderstorm with Rain
                            break;
                        case 'tstormnight':
                            weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/tstorm.png'; // Thunderstorm
                            break;
                        case 'windynight':
                            weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/windy.png'; // Windy
                            break;
                        default:
                            weatherIcon = 'C:/Users/WinDows/Desktop/pp/images/unknown.png'; // Unknown
                            break;
                    }
        
                    htmlContent += `
                    <tr>
                        <td>${date}</td>
                        <td>${tempDay}°C</td>
                        <td>${weatherType}</td>
                        <td><img src="${weatherIcon}" alt="${weatherType}" width="50" height="50"></td>
                    </tr>`;
                });
        
                htmlContent += `</tbody>
                </table>`;
                weatherInfoDiv.innerHTML = htmlContent;
            } else {
                weatherInfoDiv.innerHTML = '<p>No weather data available for the selected city.</p>';
            }
          } catch (error) {
              console.error('Error fetching weather data:', error);
              weatherInfoDiv.innerHTML = '<p>Failed to fetch weather data. Please try again later.</p>';
          } finally {
              loadingDiv.style.display = 'none';
          }
        }
        