if (window.location.pathname !== "/dashboard") {
    var w_wid = document.getElementById('w_widget');
    getWeather()
}
function getWeatherData() {
    return fetch('/api/get_weather').then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
}


function updateWeather(weather) {
    const item =
          `<hr>
          <img id="w_icon" src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
           <a id="w_temp">${weather.main.temp}°C</a>`
    w_wid.insertAdjacentHTML('beforeend', item);

}

function getWeather() {
  getWeatherData().then(dataFromNetwork => {
	updateWeather(dataFromNetwork);
  });
}


