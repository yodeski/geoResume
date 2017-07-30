var Promise = require("bluebird");

function query(db, sql, params) {
    return new Promise(function (resolve, reject) {
        db.serialize(function () {
            db.all(sql, params, function (err, rows) {
                if (!err && rows) {
                    resolve(rows, true);
                }
                else {
                    reject(err, false);
                }
            });
        });
    });
}


var sql = {};

sql.USER_BY_NAME = 'SELECT * FROM users where username like $1';
sql.USER_HISTORY = 'SELECT * FROM histories where username like $1 and historyname like $2';
sql.HISTORY_SECTIONS = 'SELECT * FROM sections WHERE historyid = $1 order by sectionorder asc';
sql.HISTORY_PLACES = 'SELECT * FROM places WHERE sectionid in '; //($1) order by placeorder asc

module.exports = {
    query: query,
    sql: sql
};
