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
        userdb = JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("Users Loaded")
    });
};

load();


async function save() {

    if (userdb == undefined) {
        console.log("Userdb undefined");
        return;
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
exports.update = function (id, newuser) {
    let i = userdb.users.findIndex(user => user.id == id);

    if (userdb.users[i].username != newuser.username) throw "You Cant Change Userenames";
    if (userdb.users[i].id != newuser.id) throw "You Cant Change User Id";
    if (userdb.users[i].password != newuser.password) throw "User changePasswor(id, oldpw, newpw) to Change password";
    userdb.users[i] = newuser;
    console.log("Updated" + userdb.users[i].username);
    save();
};

function changePassword(id, oldpw, newpw) {
    let i = userdb.users.findIndex(user => user.id == id);

    let same = bcrypt.compareSync(oldpw, userdb.users[i].password);
    console.log(same);
    if (!same) return "Current Password Incorrect";
    if (oldpw == newpw) return true;

    let hashedPassword = bcrypt.hashSync(newpw, 10);
    userdb.users[i].password = hashedPassword;
    // console.log(hashedPassword);
    // console.log(userdb.users[i].password);
    save();
    return true
}

exports.changePassword = changePassword;

function set_password(id, newpw) {
    let i = userdb.users.findIndex(user => user.id == id);
    let hashedPassword = bcrypt.hashSync(newpw, 10);
    userdb.users[i].password = hashedPassword;
    // console.log(hashedPassword);
    // console.log(userdb.users[i].password);
    save();
    return true

}


function addUser(req) {

    if (userdb.users.some(u => u.username == req.body.username)) {
        throw "Username Already Exists";
    }

    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashedPassword);
    let newUser = {
        id: userdb.nextId++, //get next and increments
        username: req.body.username,
        displayName: req.body.username,
        email: req.body.email,
        role: 'guest',
        password: hashedPassword
    };
    console.log('Adding new User:', newUser);
    userdb.users.push(newUser);
    save();
    return newUser
}

exports.addUser = addUser;

exports.findByUsername = function (username, cb) {

    let u = userdb.users.find(user => user.username == username);
    // console.log(userdb.users);
    // console.log(u);
    if (u == undefined) u = null;
    cb(null, u);
};

exports.get_user_by_id = function (id) {
    return userdb.users.find(user => user.id == id);
};

exports.get_user_by_username = function (username) {
    return userdb.users.find(user => user.username == username);
};
exports.findById = function (id, cb) {
    let u = userdb.users.find(user => user.id == id);
    if (u == undefined) u = null;
    cb(null, u);
};

exports.addRoutes = function (app, auth) {


    app.get('/api/get_users', auth.apiAuthenticatedRole('user'), (req, res) => {
        res.json(userdb);
    });

    app.post('/api/edit_user', auth.apiAuthenticatedRole('admin'), (req, res) => {

        // console.log(req.file.path);
        // console.log(req.file.encoding);
        // console.log(req.file.mimetype);

        console.log(req.body);
        let u;
        if (req.body.id == -1) {
            u = addUser(req);
            u.role = req.body.role || 'guest';
            u.displayName = req.body.displayName || req.body.username;

            r = {
                users: userdb,
                updated_user: u
            };

            res.send(JSON.stringify(r));
            return;

        } else {
            u = get_user_by_id(req.body.id);
        }

        u.username = req.body.username || u.username;
        u.displayName = req.body.displayName || u.displayName;
        u.email = req.body.password || u.password;
        u.role = req.body.role || u.role;

        update(u.id, u);

        if (req.body.password) {
            set_password(u.id, req.body.password)
        }
        // if(typeof req.body.disabled != "undefined") {
        //if the disabled flag is not sent to the server the drone will be not disabled

        r = {
            users: userdb,
            updated_user: u
        };

        res.send(JSON.stringify(r));

    });
}