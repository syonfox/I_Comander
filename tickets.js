const fs = require('fs');

const path = __dirname + '/server-data/tickets.json';

let ticketdb = undefined;

function load() {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        ticketdb = JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("TicketsDB Loaded")
    });
};
load();

async function save() {
    if (ticketdb == undefined) {
        console.log("TicketDB undefined");
        return;
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

exports.get_ticketdb = function () {
    return ticketdb;
};

function add(t) {

    if (typeof t == undefined) t = {};
    //i think you can just do t.did ||
    let new_t = {
        "tid": ticketdb.next_tid++,
        "did": t.did,
        "title": t.title || "unnamed",
        "body": t.body || "",
        "created_by": t.created_by,
        "created_at": t.created_at || Date.now(),
        "comments": t.comments || [],
        "tags": t.tags || [],
        "assigned": t.assigned,
        "lockout": t.lockout || false,
        "resolved": t.resolved || false,
        "resolved_by": t.resolved,
        "resolved_comment": t.resolved,
        "resolved_date": t.resolved
    };


    ticketdb.open++;
    ticketdb.tickets.push(new_t);
    save();
    return new_t;


}

exports.add = add;

function del(tid) {
    ticketdb.tickets = ticketdb.tickets.filter(d => d.tid != tid);
    save();
    console.log("Ticket Removed: " + tid);
}

exports.del = del;

function update(new_t) {
    let i = ticketdb.tickets.findIndex(t => t.tid == new_t.tid);
    ticketdb.tickets[i] = new_t;

    console.log("Updated Ticket #" + ticketdb.tickets[i].tid);
    save();
}

exports.update = update;

function del(tid) {
    ticketdb.tickets = ticketdb.tickets.filter(d => d.tid != tid);
    save();
    console.log("Ticket Removed: " + tid);
}

exports.del = del;

function add_comment(tid, c) {
    let t = get_ticket_by_tid(tid);

    new_c = {
        "user": c.user,
        "date": c.date || Date.now,
        "body": c.body || "",
    };
    t.comments.push(new_c);
    return t;
}

exports.add_comment = add_comment;

function get_ticket_by_tid(tid) {
    return ticketdb.tickets.find(t => t.tid == tid);
}

exports.get_ticket_by_tid = get_ticket_by_tid;


exports.addRoutes = function (app, auth, io) {


    app.get('/api/get_tickets', auth.apiAuthenticated, (req, res) => {
        res.json(ticketdb);
    });

    app.post('/api/add_ticket', auth.apiAuthenticated, (req, res) => {
        t = {};
        t.created_by = req.user.username;
        t.body = req.body.body;
        t.title = req.body.title;
        t.did = req.body.did;
        t.lockout = req.body.lockout;

        console.log(t);
        console.log(req.body);

        add(t);
        res.json(ticketdb);
    });


    app.post('/api/delete_ticket', auth.apiAuthenticated, (req, res) => {
        del(req.body.tid);

        res.json(ticketdb);
    });

    app.post('/api/resolve_ticket', auth.apiAuthenticated, (req, res) => {
        resolve(req.body.tid);
        let t = get_ticket_by_tid(tid);
        t.resolved = true;
        t.resolved_by = req.user.username;
        t.resolved_date = Date.now();
        t.resolved_comment = req.body.resolved_comment || '';

        update(t);

        res.json(ticketdb);
    });


};




