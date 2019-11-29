
function getServerData(path) {
    //  ie /api/getDrones
    return fetch(path, {method: 'GET', credentials: "same-origin"}).then(r => {
        if (!r.ok) throw Error(r.statusText);
        return r.json();
    })
}
let ticketdb_p  = (getServerData('/api/get_tickets'));

function submit_ticket() {

}

