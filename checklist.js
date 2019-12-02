const fs = require('fs');

const path = __dirname + '/server-data/checklist.json';

let checklistdb = undefined;

function load() {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        checklistdb = JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("checklistdb Loaded")
    });
};
load();




async function save(){
    if(checklistdb == undefined) {
        console.log("checklistdb undefined");
        return ;
    }
    let droneJson = JSON.stringify(checklistdb, null, 2);

    fs.writeFile(path, droneJson, err => {
        if (err) {
            console.error(err);
            // return false;
        } else {
            console.log("Saved checklistdb to file");
        }
    });
};
exports.save = save;
// exports.editDrone = (req,res,next)=>{
//
// };

exports.get_checklistdbdb = function() {
  return checklistdb;
};

exports.add = function(){
    let d = {
        "lid": checklistdb.next_lid++,
        "label": "",
        "items": []
    };

    checklistdb.lists.push(d);
    save();
    return d;


}
exports.del = function(did){
   drochecklistdbnedb.lists = checklistdb.lists.filter(d=> d.did != did);
   save();
   console.log("Drone Removed: "+did);

}
exports.update = function(newdrone) {
    let i = checklistdb.lists.findIndex(drone=>drone.did == newdrone.did);

    if(i < 0 ){
        console.error("Drone To be updated not found no updates mades to checklist.json");
        return false;
    }
    // console.log(dronedb);
    console.log(i);
    // console.log(dronedb.lists[i].did);
    if(checklistdb.lists[i].did != newdrone.did) throw "You Cant Change drone ID";

    checklistdb.lists[i] = newdrone;
    console.log("Updated Drone(did):" + checklistdb.lists[i].did);
    save();
};


exports.get_drone_by_did = function(did){
    return checklistdb.lists.find(drone=>drone.did == did);
};

    

