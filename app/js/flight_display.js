var contain2 = document.getElementById('container2');

function updateVar() {
    contain2 = document.getElementById('container2');
}


loadFlights();

function getRecentFlights() {
        return fetch('api/get_recent_flights').then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        return response.json();
        });
}


function displayRecentFlights(flights) {
    var item = `
        <table id="flight_table" style="width:100%">
        <tr>
            <th>Flight ID</th>
            <th>Drone ID</th>
            <th>Start Time</th>
            <th>End Time</th>`;

    Array.prototype.forEach.call(flights.flights, flight => {
        var startTime = flight.start_time.slice(4, 24);
        var endTime = flight.end_time.slice(4, 24);

        var item2 = ` 
            <tr>
                <td>${flight.id}</td>
                <td>${flight.user}</td>
                <td>${startTime}</td>
                <td>${endTime}</td> 
            <tr>`;

        item = item.concat(item2);

    });
    item = item.concat("</table>");

    contain2.insertAdjacentHTML('beforeend', item);
}

function loadFlights() {
    getRecentFlights().then(dataFromNetwork => {
        displayRecentFlights(dataFromNetwork);
    });
}


