console.log("Hola api clima"); 
//API WEATHER 
async function fetchWeatherData(latitude, longitude){ 
   // url https
   //const url = https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true; 
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    //fetch peticion de http 
    const response  = await fetch(url); //cuando sean promesas se debe colocar un await para que espere en que momento se continua 
    console.log(response)
    const data = await response.json(); 
    console.log(data); 
    console.log(data.elevation); 
    console.log(data.current_weather); //el name proviene de la API 
    console.log(data.current_weather.temperature); 
    console.log(data.current_weather.windspeed);
    console.log(response); 
    
    return data.current_weather; 
}

//si se utiliza await se debe hacer que tu funcion sea asincrona

//se prueba la funcion
//fetchWeatherData( 25.666815, -100.28233);

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
    console.log("Boton fetch clickeado");

    //take actual values for inputs
    const latitudeCurrent  = parseFloat(latitude.value);
    const longitudeCurrent = parseFloat(longitude.value);

    try {
        const currentWeather = await fetchWeatherData(latitudeCurrent, longitudeCurrent);

         //Show values
        currentTemperature.textContent = currentWeather.temperature;
        currentWindspeed.textContent = currentWeather.windspeed;

        // Make visible result
        resultBox.classList.remove("hidden");
    } catch (error) {
        console.error("Cant' obtain weather:", error);
        alert("There was a problem getting the weather. Check the console.");
    }

    //Textcontent es el output que se ve en la pantalla
}


//=========================
// AUTOCOMPLETE SEARCH
//=========================

//Listen to what's in the search input
locationInput.addEventListener("input", handleInputChange);

//let searchTimeout = null;

function handleInputChange(event){
    const query = event.target.value.trim();

    if (query.length < 3){
        suggestionsList.innerHTML = "";
        return;
    }

    searchLocations(query); 
}

//Search Locations group
async function searchLocations(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;

    try {
        const response = await fetch(url, {
            headers: {
                "Accept-Language": "es" // Para que devuelva nombres en español cuando sea posible
            }
        });

        const results = await response.json();
        renderSuggestions(results);
    } catch (error) {
        console.error("Error buscando ubicaciones:", error);
        suggestionsList.innerHTML = "<li>Error al buscar ubicaciones</li>";
    }
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

    //Put name on input
    locationInput.value  = name;
    latitude.value  = lat;
    longitude.value = lon;

    //Clean suggestions
    suggestionsList.innerHTML = "";

    console.log(`Location selected: ${name}  Latitude:${lat}  Longitude:${lon}`);

     // Call principal logic
    onLocationSelected(lat,lon);
});

function onLocationSelected(lat,lon){
    console.log("Coordinates applied for button", lat, lon);
}
