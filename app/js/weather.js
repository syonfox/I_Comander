var container2 = document.getElementById('container');

function updateVar() {
    container2 = document.getElementById('container');
}


loadWeather();

function getServerWeather() {
    /*
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(coords => {
            var lati = coords.coords.latitude;
            var long = coords.coords.longitude;

            return fetch(`api/get_weather_geo?lat=${lati}&lon=${long}`).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                displayWeather(response.json());
            });
        });
    }
    else {*/
        return fetch('api/get_weather').then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        return response.json();
        });
    //}
}


function displayWeather(weather) {
    console.log(weather);

    const item =
        `<div id="w_holder">
        <img id="w_icon" src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
           <h3 id="w_city">It is currently ${weather.weather[0].description} in ${weather.name}.</h3> 
        <h3 id="w_temp">It is ${weather.main.temp}°C right now. Today's high is ${weather.main.temp_max}°C and the low is ${weather.main.temp_min}°C.</h3>
           </div>`;
    /*
    const item =
        `<div id="w_holder">
        <img id="w_icon" src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
           <h3 id="w_city">${weather.name}</h3>
           <h4 id="w_temp">${weather.main.temp}°C</h4>
           <h4 id="w_status">${weather.weather[0].description}</h4>
           </div>`;
           */
    container2.insertAdjacentHTML('afterbegin', item);

}

function loadWeather() {
    getServerWeather().then(dataFromNetwork => {
        displayWeather(dataFromNetwork);
    });
}

