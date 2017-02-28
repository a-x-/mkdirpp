var mkdirp = require('../');
var path = require('path');
var fs = require('fs');
var exists = fs.exists || path.exists;
var test = require('tap').test;
var _0777 = parseInt('0777', 8);
var _0755 = parseInt('0755', 8);
var file = '/tmp/' + (Math.random() * (1<<30)).toString(16);
console.log('file', file);
test('async perm', function (t) {
    t.plan(4);

    mkdirp(file, _0755)
        .then(function () {
            exists(file, function (ex) {
                t.ok(ex, 'file created');
                fs.stat(file, function (err, stat) {
                    t.ifError(err, 'stat is ok');
                    t.equal(stat.mode & _0777, _0755, 'mode is ok');
                    t.ok(stat.isDirectory(), 'target not a directory');
                })
            })
        })
        .catch(function (err) {
            throw err;
        });
});

test('async root perm', function (t) {
    mkdirp('/tmp', _0755)
        .then(function () {
            console.log('then');
            t.end();
        })
        .catch(function (err) {
            throw err;
        });
});
