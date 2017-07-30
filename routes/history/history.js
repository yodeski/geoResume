var Promise = require("bluebird");
var sqlite3 = require('sqlite3').verbose();
var db = require('../../database');
var showdown = require('showdown');
var _ = require('lodash');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index', {});
        }
    },
    {
        method: 'GET',
        path: '/history/{user}/{history}',
        handler: function (request, reply) {
            var clidb = new sqlite3.Database('georesume.db');
            const user = request.params.user ? encodeURIComponent(request.params.user) : 'visitor';
            const history = request.params.user ? encodeURIComponent(request.params.history) : null;
            const result = { history: null, sections: [], places: [] };
            if (user != 'visitor') {
                getHistory(reply, clidb, user, history, result);
            }
        }
    }

]



function getHistory(reply, clidb, user, history, result) {
    var converter = new showdown.Converter();
    var p1 = db.query(clidb, db.sql.USER_HISTORY, [user, history]);
    p1.then(function (hrows, ok) {
        result.history = hrows[0];
        var p2 = db.query(clidb, db.sql.HISTORY_SECTIONS, result.history.historyid);
        p2.then(function (srows, ok) {
            result.sections = srows;
            for (var i = 0; i < srows.length; i++) {
                srows[i].sectiontext = converter.makeHtml(srows[i].sectiontext);
                srows[i].sectionimage = (srows[i].sectionimage) ? converter.makeHtml(srows[i].sectionimage) : '';
            };
            var ids = _.map(srows, function (s) { return s.sectionid; });
            var p3 = db.query(clidb, db.sql.HISTORY_PLACES + ' (' + ids.toString() + ')', []);
            p3.then(function (prows, ok) {
                for (var i = 0; i < prows.length; i++) {
                    prows[i].placetext = converter.makeHtml(prows[i].placetext);
                };
                result.places = prows;
                for (var i = 0; i < result.sections.length; i++) {
                    result.sections[i]['places'] = [];
                    var p = _.filter(result.places, { 'sectionid': result.sections[i].sectionid });
                    result.sections[i]['places'] = _.concat(result.sections[i]['places'], p);
                    //result.sections[i]['places'].push(p);
                };
                clidb.close();
                console.log(hrows);
                reply(result);
            });
        });
    })
}
