var records = [
    { id: 1, username: 'jack', password: '$2y$12$HfvwSHAjdbBs5Z/umZFmg.Wb33UB14PYmujMsS1aJc6/X.E0KJsmO', displayName: 'Jack', role:'user', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'kier', password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Kier Lindsay', role:'admin', emails: [ { value: 'jill@example.com' } ]}
];//jack:secret
var nextid = 3;

exports.getNextId = function(){
  return nextid++;
};


exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
};

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};