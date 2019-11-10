const fs = require('fs');
const bcrypt = require('bcrypt');

const userspath = __dirname + '/server-data/users.json';

let userdb = undefined;

function load() {
    fs.readFile(userspath, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        userdb =  JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("Users Loaded")
    });
};

load();



async function save(){

    if(userdb == undefined) {
        console.log("Userdb undefined");
        return ;
    }
    let usersJson = JSON.stringify(userdb, null, 2);

    fs.writeFile(userspath, usersJson, err => {
        if (err) {
            console.error(err);
            // return false;
        } else {
            console.log("Saved Userdb to file");
        }
    });
};
exports.save = save;

  /**
   * Updates the user in the database and saves it to file.  IF the password is changes
   * it will compute the new password hash and updated the db. You cannot change the username or user id
   *
   * @param {number} id The id of the usere you want to update
   * @param {user} newuser The updated user object
   */
exports.update = function(id, newuser) {
    let i = userdb.users.findIndex(user=>user.id == id);

    if(userdb.users[i].username != newuser.username) throw "You Cant Change Userenames";
    if(userdb.users[i].id != newuser.id) throw "You Cant Change User Id";
    if(userdb.users[i].password != newuser.password) throw "User changePasswor(id, oldpw, newpw) to Change password";
    userdb.users[i] = newuser;
    console.log("Updated" + userdb.users[i].username);
    save();
};

function changePassword(id, oldpw, newpw){
    let i = userdb.users.findIndex(user=>user.id == id);

    let same = bcrypt.compareSync(oldpw, userdb.users[i].password);
    console.log(same);
    if(!same) return "Current Password Incorrect";
    if(oldpw == newpw) return true;

    let hashedPassword = bcrypt.hashSync(newpw, 10);
    userdb.users[i].password = hashedPassword;
    // console.log(hashedPassword);
    // console.log(userdb.users[i].password);
    save();
    return true
}
exports.changePassword = changePassword;


exports.findByUsername = function(username, cb) {

    let u = userdb.users.find(user=>user.username == username);
    // console.log(userdb.users);
    // console.log(u);
    if (u == undefined) u = null;
    cb(null, u);
};

exports.findById = function(id, cb){
    let u = userdb.users.find(user=>user.id == id);
    if (u == undefined) u = null;
    cb(null, u);
};



// exports.findByUsername = function(username, cb) {
//     let jsonFile = __dirname + '/server-data/users.json';
//     fs.readFile(jsonFile, (err, data) => {
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.username == username);
//         console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// };
//
// exports.findById = function(id, cb){
//     let jsonFile = __dirname + '/server-data/users.json';
//     // console.log(jsonFile);
//     fs.readFile(jsonFile, (err, data) => {
//         // console.log(data)
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.id == id);
//         // console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// };
