console.log("Hola api clima");

//API WEATHER
async function fetchWeatherData(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Data:", data);
    return data.current_weather;
}

//=========================
// DOM ELEMENTS
//=========================
const locationInput = document.getElementById("location-input");
const suggestionsList = document.getElementById("suggestions");
const latitude = document.getElementById("latitude-input");
const longitude = document.getElementById("longitude-input");
const currentTemperature = document.getElementById("temp-display");
const currentWindspeed = document.getElementById("wind-display");
const resultBox = document.getElementById("weather-result");

//=========================
//  WEATHER BUTTON
//=========================
async function handleFetchClick(){
    console.log("Get Weather clicked");

    const latitudeCurrent  = parseFloat(latitude.value);
    const longitudeCurrent = parseFloat(longitude.value);

    const currentWeather = await fetchWeatherData(latitudeCurrent, longitudeCurrent);

    currentTemperature.textContent = currentWeather.temperature;
    currentWindspeed.textContent   = currentWeather.windspeed;
    resultBox.classList.remove("hidden");
}

//=========================
// AUTOCOMPLETE SEARCH
//=========================
locationInput.addEventListener("input", handleInputChange);

function handleInputChange(event){
    const query = event.target.value.trim();

    if (query.length < 3){
        suggestionsList.innerHTML = "";
        return;
    }

    searchLocations(query); // <<❗ SE TE FALTABA ESTO
}

async function searchLocations(query){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    const response = await fetch(url,{ headers:{ "Accept-Language":"es"}});
    const results = await response.json();
    renderSuggestions(results);
}

function renderSuggestions(results){
    suggestionsList.innerHTML = "";

    if(!results.length){
        suggestionsList.innerHTML = "<li>Sin resultados</li>";
        return;
    }

    results.forEach(place=>{
        const li = document.createElement("li");
        li.textContent   = place.display_name;
        li.dataset.lat   = place.lat;
        li.dataset.lon   = place.lon;
        li.classList.add("suggestion-item");
        suggestionsList.appendChild(li);
    });
}

//=========================
// CLICK ON SUGGESTION
//=========================
suggestionsList.addEventListener("click",(event)=>{
    const li = event.target.closest("li");
    if(!li) return;

    const lat  = parseFloat(li.dataset.lat);
    const lon  = parseFloat(li.dataset.lon);
    const name = li.textContent;

    locationInput.value  = name;
    latitude.value  = lat;
    longitude.value = lon;

    suggestionsList.innerHTML = "";

    console.log(`Ubicación seleccionada → ${name}  LAT:${lat}  LON:${lon}`);

    onLocationSelected(lat,lon);
});

function onLocationSelected(lat,lon){
    console.log("Coordenadas aplicadas para botón:", lat, lon);
}
