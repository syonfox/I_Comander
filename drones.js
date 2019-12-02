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
}
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
}
exports.save = save;

exports.get_dronedb = function() {
  return dronedb;
};

function add(){
    let d = {
        "did": dronedb["next_did"]++,
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
exports.add = add;

function del(did){
   dronedb.drones = dronedb.drones.filter(d=> d.did != did);
   save();
   console.log("Drone Removed: "+did);

}
exports.del = del;

function update(newdrone) {
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
}
exports.update = update;

exports.enable = function(did){
    let i = dronedb.drones.findIndex(drone=>drone.did == did);
    dronedb.drones[i].lockedout = false;
    console.log('Drone enabled: ' + did);
    save();
};
exports.disable = function(did){
    let i = dronedb.drones.findIndex(drone=>drone.did == did);
    dronedb.drones[i].lockedout = true;
    console.log('Drone disabled: ' + did);
    save();
};

exports.valid_did = function(did){
    return did >=0 || dronedb.drones.some(drone=>drone.did == did);
};

function get_drone_by_did(did){
    return dronedb.drones.find(drone=>drone.did == did);
}
exports.get_drone_by_did = get_drone_by_did;


exports.addRoutes = function(app, auth, upload){

    app.get('/api/get_drones', auth.apiAuthenticatedRole('user'), (req, res) => {
        res.json(dronedb);
    });

    // todo: clean up uploaded imaged that are no longer used by drones.z
    app.post('/api/delete_drone', auth.apiAuthenticatedRole('admin'), (req, res) => {
        // console.log('delete_drone');
        // console.log(req.body);
        del(req.body.did);

        r = {
            dronedb: dronedb,
            deleted_did: req.body.did
        };
        res.send(JSON.stringify(r));
    });

//takes in body paramated for the drone as input and will update them in the drone specified by body.did
//if did==-1 it will be added insted
// https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
    app.post('/api/edit_drone', auth.apiAuthenticatedRole('admin'), upload.single('photo'), (req, res) => {

        // console.log(req.file.path);
        // console.log(req.file.encoding);
        // console.log(req.file.mimetype);

        console.log(req.body);

        let d = get_drone_by_did(req.body.did);
        if (!d) d = add();
        console.log(d)
        if (req.file) {
            d.image = 'upload/' + req.file.filename;
            console.log('image set to: ' + d.image);
        } else {
            console.log("No Image");
        }

        if (typeof req.body.name != "undefined") d.name = req.body.name;
        if (typeof req.body.type != "undefined") d.type = req.body.type;
        //todo: if nessasary add a test to validate lids ... i dont think its nessasary since our code sets lids
        if (typeof req.body.postflight_lid != "undefined") d.preflight_lid = parseInt(req.body.preflight_lid);
        if (typeof req.body.postflight_lid != "undefined") d.postflight_lid = parseInt(req.body.postflight_lid);

        //if the disabled flag is not sent to the server the drone will be not disabled
        d.disabled = (req.body.disabled == 'on');

        if (d.did == -1) {
            newd = add(d)
        }
        update(d);

        r = {
            dronedb: dronedb,
            updated_drone: d
        };
        res.send(JSON.stringify(r));
    });

};

    

