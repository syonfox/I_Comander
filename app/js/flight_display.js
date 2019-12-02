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
    const item = `
        <table id="flight_table" style="width:100%">
        <tr>
            <th>Flight ID</th>
            <th>Drone ID</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
    `

    /* working on dynamically adding flights
    const item = 
        `<table id="flighttable">
         <tr>
            <td>${flights.flights[0].id}</td>
            <td>${flights.flights[0].user}</td>
         <tr>
         <table>`;
    */
    contain2.insertAdjacentHTML('beforeend', item);

}

function loadFlights() {
    getRecentFlights().then(dataFromNetwork => {
        displayRecentFlights(dataFromNetwork);
    });
}


