// n#####
// NOT USED
// #########
//
// var records = [
// //     { id: 1, username: 'jack', password: '$2y$12$HfvwSHAjdbBs5Z/umZFmg.Wb33UB14PYmujMsS1aJc6/X.E0KJsmO', displayName: 'Jack', role:'user', emails: [ { value: 'jack@example.com' } ] }
// //   , { id: 2, username: 'kier', password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Kier Lindsay', role:'admin', emails: [ { value: 'jill@example.com' } ]}
// // ];//jack:secret
//
// var records = [
//     { id: 1, username: 'joebob',  password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Joe Bob',       role:'guest',      email:'joebob@example.com' }
//   , { id: 2, username: 'starfox', password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Jack',          role:'user',       email:'jack@example.com' }
//   , { id: 3, username: 'cat',     password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Sir Meow',      role:'admin',      email:'kier@example.com' }
//   , { id: 4, username: 'root',    password: '$2b$10$aqgv8vx.POJjGEJOBiOP/.YE9l5t9IAAQwTL1hd9TCSBlwXDE.dfe', displayName: 'Kier Lindsay',  role:'superadmin', email:'admin@example.com'}
// ];//jack:secret
//
// var nextid = 5;
//
// exports.getNextId = function(){
//
//   return nextid++;
// };
//
// exports.push = function(user) {
//   records.push(user);
// };
//
//
// exports.findById = function(id, cb) {
//   process.nextTick(function() {
//     var idx = id - 1;
//     if (records[idx]) {
//       cb(null, records[idx]);
//     } else {
//       cb(new Error('User ' + id + ' does not exist'));
//     }
//   });
// };
//
// exports.findByUsername = function(username, cb) {
//   process.nextTick(function() {
//     for (var i = 0, len = records.length; i < len; i++) {
//       var record = records[i];
//       if (record.username === username) {
//         return cb(null, record);
//       }
//     }
//     return cb(null, null);
//   });
// };