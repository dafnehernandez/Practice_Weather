console.log("Hola api clima");
async function fetchWeatherData(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    //fetch peticion de http
    const response = await fetch(url); //cuando sean promesas se debe colocar un await para que espere en que momento se continua
    console.log(response)
    const data = await response.json();
    console.log(data);
    console.log(data.elevation);
    console.log(data.current_weather); //el name proviene de la API
    console.log(data.current_weather.temperature);
    console.log(data.current_weather.windspeed);
    //console.log(response);
    return data.current_weather;
}

//si se utiliza await se debe hacer que tu funcion sea asincrona

//se prueba la funcion
//fetchWeatherData( 25.666815, -100.28233);

async function handleFetchClick(){
    console.log("Boton fetch clickeado");
    const latitude = document.getElementById("latitude-input").value;
    const longitude = document.getElementById("longitude-input").value;
    const currentTemperature = document.getElementById("temp-display");
    const currentWindspeed = document.getElementById("wind-display");
    const resultBox = document.getElementById("weather-result");

    try {
        const currentWeather = await fetchWeatherData(latitude, longitude);

        //Show values
        currentTemperature.textContent = currentWeather.temperature;
        currentWindspeed.textContent = currentWeather.windspeed;

        // Make visible result
        resultBox.classList.remove("hidden");
    } catch (error) {
        console.error("Error obteniendo el clima:", error);
        alert("Hubo un problema al obtener el clima. Revisa la consola.");
    }


    const currentWeather = await fetchWeatherData(latitude, longitude);
    currentTemperature.textContent = currentWeather.temperature;
    currentWindspeed.textContent = currentWeather.windspeed;
    //Textcontent es el output?
}
