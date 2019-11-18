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
          `<img id="w_icon" src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
           <h1 id="w_city">${weather.name}</h1>
           <h2 id="w_temp">${weather.main.temp}°C</h2>
           <h2 id="w_status">${weather.weather[0].description}</h2>`;
    container2.insertAdjacentHTML('beforeend', item);

}

function loadWeather() {
    getServerWeather().then(dataFromNetwork => {
        displayWeather(dataFromNetwork);
    });
}

