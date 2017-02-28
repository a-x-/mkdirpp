/**
 * @file
 * Based on https://github.com/substack/node-mkdirp
 */

var path = require('path');
var fs = require('fs');
var _0777 = parseInt('0777', 8);

module.exports = mkdirp;

/**
 * @param {String} p - path to create
 *
 * @param {Object|Number|undefined} opts
 * @param {*} opts.fs
 *
 * @returns {Promise}
 *
 * @public
 */
function mkdirp (p, opts) {
    var opts_ = {}; // PERF: don't change arguments

    if (typeof opts === 'number') {
        opts_ = { mode: opts };
    }
    else if (opts) {
        Object.assign(opts_, opts);
    }

    opts_.mode = opts_.mode || _0777 & (~process.umask())
    opts_.fs = opts_.fs || fs;

    return new Promise(function (res, rej) {
        _mkdirp(p, opts_, function (err) {
            err ? rej(err) : res();
        });
    });
}

/**
 * @param {String} p - path to create
 *
 * @param {Object|String|undefined} opts
 * @param {*} opts.fs
 * @param {Number} opts.mode
 *
 * @param {String} made - created path
 *
 * @returns {Promise}
 *
 * @private
 */
function _mkdirp (p, opts, cb, made) {
    p = path.resolve(p);

    opts.fs.mkdir(p, opts.mode, function (err) {
        var made_ = made || p;
        if (!err) {
            cb(null, made_);
            return;
        }
        switch (err.code) {
            case 'ENOENT':
                _mkdirp(path.dirname(p), opts, function (err, made) {
                    err ? cb(err, made) : _mkdirp(p, opts, cb, made);
                });
                break;

            case 'EEXIST':
                cb(null, made_);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                opts.fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(err, made_)
                    else cb(null, made_);
                });
                break;
        }
    });
}
