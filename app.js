// Traducción de los códigos meteorológicos WMO que devuelve Open-Meteo
const WEATHER_CODES = {
    0: ['Despejado', '☀️'],
    1: ['Mayormente despejado', '🌤️'],
    2: ['Parcialmente nublado', '⛅'],
    3: ['Nublado', '☁️'],
    45: ['Niebla', '🌫️'],
    48: ['Niebla con escarcha', '🌫️'],
    51: ['Llovizna ligera', '🌦️'],
    53: ['Llovizna moderada', '🌦️'],
    55: ['Llovizna intensa', '🌧️'],
    56: ['Llovizna helada', '🌧️'],
    57: ['Llovizna helada intensa', '🌧️'],
    61: ['Lluvia ligera', '🌦️'],
    63: ['Lluvia moderada', '🌧️'],
    65: ['Lluvia intensa', '🌧️'],
    66: ['Lluvia helada', '🌧️'],
    67: ['Lluvia helada intensa', '🌧️'],
    71: ['Nevada ligera', '🌨️'],
    73: ['Nevada moderada', '🌨️'],
    75: ['Nevada intensa', '❄️'],
    77: ['Granizo fino', '🌨️'],
    80: ['Chubascos ligeros', '🌦️'],
    81: ['Chubascos moderados', '🌧️'],
    82: ['Chubascos violentos', '⛈️'],
    85: ['Chubascos de nieve', '🌨️'],
    86: ['Chubascos de nieve intensos', '❄️'],
    95: ['Tormenta eléctrica', '⛈️'],
    96: ['Tormenta con granizo', '⛈️'],
    99: ['Tormenta con granizo fuerte', '⛈️']
};

// Evita inyectar HTML con el texto que escribe el usuario o devuelve la API
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

async function consultarClima() {
    const city = document.getElementById('city-input').value.trim();
    const weatherCard = document.getElementById('weather-card');

    if (!city) {
        weatherCard.innerHTML = "<p class='error'>⚠️ Por favor, escribe un lugar válido.</p>";
        return;
    }

    weatherCard.innerHTML = "<p class='loading'>🔄 Consultando base de datos geográfica y meteorológica remota...</p>";

    try {
        // 1) Geocodificación con la API Nominatim de OpenStreetMap
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1&accept-language=es`);
        if (!response.ok) throw new Error(`Nominatim respondió ${response.status}`);
        const data = await response.json();

        if (data.length === 0) {
            weatherCard.innerHTML = "<p class='error'>❌ No se encontraron datos para esa ubicación.</p>";
            return;
        }

        const lugar = data[0];
        const lat = Number(lugar.lat);
        const lon = Number(lugar.lon);

        // 2) Clima actual real con la API de Open-Meteo (no requiere API key)
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=auto`);
        if (!weatherResponse.ok) throw new Error(`Open-Meteo respondió ${weatherResponse.status}`);
        const { current } = await weatherResponse.json();

        const [condition, icon] = WEATHER_CODES[current.weather_code] ?? ['Condición desconocida', '🌡️'];
        const hora = current.time.split('T')[1];

        // 3) Mapa embebido de OpenStreetMap centrado en la ubicación
        const d = 0.05;
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`;

        // Renderizado e inyección dinámica unificada en el DOM
        weatherCard.innerHTML = `
            <h3>🗺️ Ubicación Localizada: 🧭 ${escapeHTML(city)}</h3>
            <p class="description"><strong>Descripción oficial:</strong> ${escapeHTML(lugar.display_name)}</p>

            <div class="geo-data">
                <p><strong>Latitud:</strong> ${lat.toFixed(4)} &nbsp;|&nbsp; <strong>Longitud:</strong> ${lon.toFixed(4)}</p>
            </div>

            <hr class="divider">

            <div class="weather-data">
                <h4>⛈️🌤️ Parámetros Climatológicos ⛈️🌤️</h4>
                <p class="temp-main">${icon} ${Math.round(current.temperature_2m)}°C</p>
                <p class="condition">${condition}</p>
                <div class="weather-grid">
                    <div><span>Sensación</span><strong>${current.apparent_temperature}°C</strong></div>
                    <div><span>Humedad</span><strong>${current.relative_humidity_2m}%</strong></div>
                    <div><span>Viento</span><strong>${current.wind_speed_10m} km/h</strong></div>
                    <div><span>Presión</span><strong>${Math.round(current.pressure_msl)} hPa</strong></div>
                </div>
            </div>

            <iframe class="map-frame" title="Mapa de ${escapeHTML(city)}" src="${mapUrl}" loading="lazy"></iframe>

            <div class="success-footer">✓ Datos de mapa meteorológico sincronizados con éxito · Hora local ${hora}</div>
        `;
    } catch (error) {
        console.error(error);
        weatherCard.innerHTML = "<p class='error'>❌ Error en la comunicación asíncrona con el servidor.</p>";
    }
}

document.getElementById('search-btn').addEventListener('click', consultarClima);
document.getElementById('city-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') consultarClima();
});
