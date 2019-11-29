const fs = require('fs');

const path = __dirname + '/server-data/tickets.json';

let ticketdb = undefined;

function load() {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        ticketdb =  JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("TicketsDB Loaded")
    });
};
load();




async function save(){
    if(ticketdb == undefined) {
        console.log("TicketDB undefined");
        return ;
    }
    let ticketJson = JSON.stringify(ticketdb, null, 2);

    fs.writeFile(path, ticketJson, err => {
        if (err) {
            console.error(err);
            // return false;
        } else {
            console.log("Saved TicketDB to file");
        }
    });
};
exports.save = save;
// exports.editDrone = (req,res,next)=>{
//
// };

exports.get_ticketdb = function() {
    return ticketdb;
};

// exports.add = function(){
//     let d = {
//         "did": dronedb.next_did++,
//         "name": "",
//         "lockedout": false,
//         "disabled": false,
//         "preflight_lid": undefined,
//         "postflight_lid": undefined,
//         "type": "",
//         "image": "deafultDrone.jpeg"
//     };
//
//     dronedb.drones.push(d);
//     save();
//     return d;
//
//
// }
// exports.del = function(did){
//     dronedb.drones = dronedb.drones.filter(d=> d.did != did);
//     save();
//     console.log("Ticket Removed: "+did);
//
// }
// exports.update = function(newdrone) {
//     let i = dronedb.drones.findIndex(drone=>drone.did == newdrone.did);
//
//     if(i < 0 ){
//         console.error("Drone To be updated not found no updates mades to drones.json");
//         return false;
//     }
//     // console.log(dronedb);
//     console.log(i);
//     // console.log(dronedb.drones[i].did);
//     if(dronedb.drones[i].did != newdrone.did) throw "You Cant Change drone ID";
//
//     dronedb.drones[i] = newdrone;
//     console.log("Updated Ticket(tid):" + dronedb.drones[i].tid);
//     save();
// };


exports.get_ticket_by_tid = function(tid){
    return ticketdb.tickets.find(t=>t.tid == tid);
};



