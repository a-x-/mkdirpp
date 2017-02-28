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

    return _mkdirp(p, opts_);
}

/**
 * @param {String} p - path to create
 *
 * @param {Object|String|undefined} opts
 * @param {*} opts.fs
 * @param {Number} opts.mode
 *
 * @returns {Promise}
 *
 * @private
 */
function _mkdirp (p, opts) {
    var xfs = opts.fs || fs;

    p = path.resolve(p);

    return new Promise(function (res, rej) {
        xfs.mkdir(p, opts.mode, function (er) {
            if (!er) {
                return res();
            }
            switch (er.code) {
                case 'ENOENT':
                    return _mkdirp(path.dirname(p), opts).then(function (er) {
                        return _mkdirp(p, opts);
                    });
                    break;

                case 'EEXIST':
                    return res();
                    break;

                default:
                    return rej();
                    break;
            }
        });
    });
}
