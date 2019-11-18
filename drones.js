const fs = require('fs');

const path = __dirname + '/server-data/drones.json';

let dronedb = undefined;

function load() {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        dronedb =  JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("DronesDB Loaded")
    });
};
load();




async function save(){
    if(dronedb == undefined) {
        console.log("DronesDB undefined");
        return ;
    }
    let droneJson = JSON.stringify(dronedb, null, 2);

    fs.writeFile(path, droneJson, err => {
        if (err) {
            console.error(err);
            // return false;
        } else {
            console.log("Saved DronesDB to file");
        }
    });
};
exports.save = save;
// exports.editDrone = (req,res,next)=>{
//
// };

exports.get_dronedb = function() {
  return dronedb;
};

exports.add = function(){
    let d = {
        "did": dronedb.next_did++,
        "name": "",
        "lockedout": false,
        "disabled": false,
        "preflight_lid": undefined,
        "postflight_lid": undefined,
        "type": "",
        "image": "deafultDrone.jpeg"
    };

    dronedb.drones.push(d);
    save();
    return d;


}
exports.update = function(newdrone) {
    let i = dronedb.drones.findIndex(drone=>drone.did == newdrone.did);

    if(i < 0 ){
        console.error("Drone To be updated not found no updates mades to drones.json");
        return false;
    }
    // console.log(dronedb);
    console.log(i);
    // console.log(dronedb.drones[i].did);
    if(dronedb.drones[i].did != newdrone.did) throw "You Cant Change drone ID";

    dronedb.drones[i] = newdrone;
    console.log("Updated Drone(did):" + dronedb.drones[i].did);
    save();
};


exports.get_drone_by_did = function(did){
    return dronedb.drones.find(drone=>drone.did == did);
};

    

