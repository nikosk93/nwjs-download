'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    basename = _require.basename,
    join = _require.join,
    resolve = _require.resolve,
    isAbsolute = _require.isAbsolute;

var _require2 = require('fs'),
    exists = _require2.exists,
    stat = _require2.stat,
    writeFile = _require2.writeFile,
    readFile = _require2.readFile,
    unlink = _require2.unlink,
    readdir = _require2.readdir;

var _require3 = require('fs-extra'),
    mkdirsSync = _require3.mkdirsSync;

var homedir = require('os-homedir');

var temp = require('temp').track();

var request = require('request');
var wrapProgress = require('request-progress');

var ProgressBar = require('progress');

var Flow = require('node-async-flow');

var DIR_CACHES = join(homedir(), '.nwjs-download', 'caches');
mkdirsSync(DIR_CACHES);

var FILE_MANIFEST_CACHE = join(DIR_CACHES, 'manifest.json');
var EXPIRY_MANIFEST_CACHE = 3600000;

var GetManifest = function GetManifest(callback) {
  var debug = require('debug')('NWD:GetManifest');

  Flow( /*#__PURE__*/_regenerator2.default.mark(function _callee(cb) {
    var cacheExists, useCache, _ref, _ref2, err, cacheStat, _ref3, _ref4, _err, data, url, _ref5, _ref6, _err2, res, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return exists(FILE_MANIFEST_CACHE, cb.single);

          case 2:
            cacheExists = _context.sent;
            useCache = false;

            if (!cacheExists) {
              _context.next = 13;
              break;
            }

            _context.next = 7;
            return stat(FILE_MANIFEST_CACHE, cb.expect(2));

          case 7:
            _ref = _context.sent;
            _ref2 = (0, _slicedToArray3.default)(_ref, 2);
            err = _ref2[0];
            cacheStat = _ref2[1];


            useCache = !err && Date.now() - cacheStat.ctime.getTime() < EXPIRY_MANIFEST_CACHE;

            if (!useCache) {
              debug('Manifest cache expired.');
            }

          case 13:
            if (!true) {
              _context.next = 48;
              break;
            }

            if (!useCache) {
              _context.next = 27;
              break;
            }

            debug('Use cached manifest.');

            _context.next = 18;
            return readFile(FILE_MANIFEST_CACHE, cb.expect(2));

          case 18:
            _ref3 = _context.sent;
            _ref4 = (0, _slicedToArray3.default)(_ref3, 2);
            _err = _ref4[0];
            data = _ref4[1];

            if (!_err) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('return', callback(_err));

          case 24:
            return _context.abrupt('return', callback(null, JSON.parse(data)));

          case 27:
            debug('Use online manifest.');

            url = 'http://nwjs.io/versions.json';
            _context.next = 31;
            return request(url, {}, cb.expect(3));

          case 31:
            _ref5 = _context.sent;
            _ref6 = (0, _slicedToArray3.default)(_ref5, 3);
            _err2 = _ref6[0];
            res = _ref6[1];
            body = _ref6[2];

            if (!_err2) {
              _context.next = 41;
              break;
            }

            console.trace(_err2);
            console.warn('Fail back to cached manifest.');

            useCache = true;
            return _context.abrupt('continue', 13);

          case 41:
            _context.next = 43;
            return writeFile(FILE_MANIFEST_CACHE, body, cb.single);

          case 43:
            _err2 = _context.sent;


            if (_err2) {
              // Print and ignore.
              console.trace(_err2);
            }

            return _context.abrupt('return', callback(null, JSON.parse(body)));

          case 46:
            _context.next = 13;
            break;

          case 48:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};

var ClearManifestCache = function ClearManifestCache(callback) {
  unlink(FILE_MANIFEST_CACHE, callback);
};

var Download = function Download(url, _ref7, callback) {
  var _ref7$cachePrefix = _ref7.cachePrefix,
      cachePrefix = _ref7$cachePrefix === undefined ? null : _ref7$cachePrefix,
      _ref7$showProgressbar = _ref7.showProgressbar,
      showProgressbar = _ref7$showProgressbar === undefined ? true : _ref7$showProgressbar,
      _ref7$progressCallbac = _ref7.progressCallback,
      progressCallback = _ref7$progressCallbac === undefined ? null : _ref7$progressCallbac,
      _ref7$outputDirectory = _ref7.outputDirectory,
      outputDirectory = _ref7$outputDirectory === undefined ? null : _ref7$outputDirectory;

  Flow( /*#__PURE__*/_regenerator2.default.mark(function _callee2(cb) {
    var path, progressbar, _ref8, _ref9, err, res, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            path = cachePrefix ? join(DIR_CACHES, cachePrefix + '-' + basename(url)) : temp.path();


            if (outputDirectory) {
              outputDirectory = isAbsolute(outputDirectory) ? outputDirectory : resolve(process.cwd(), outputDirectory);
              mkdirsSync(outputDirectory);
              path = resolve(outputDirectory, basename(path));
            }

            _context2.next = 4;
            return exists(path, cb.single);

          case 4:
            if (!_context2.sent) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', callback(null, true, path));

          case 6:
            progressbar = new ProgressBar(':Name [:bar] :Speed :ETA', {
              width: 20,
              total: 65535
            });
            _context2.next = 9;
            return wrapProgress(request(url, {
              encoding: null
            }, cb.expect(3))).on('progress', function (progress) {
              if (showProgressbar) {
                progressbar.curr = progress.size.transferred;
                progressbar.total = progress.size.total ? progress.size.total : progressbar.curr;

                progressbar.tick({
                  Name: basename(path),
                  Speed: (progress.speed / 1000).toFixed(2) + 'KB/s',
                  ETA: progress.time.remaining ? progress.time.remaining.toFixed(2) + 's' : '-'
                });
              }

              if (progressCallback) {
                progressCallback(progress);
              }
            });

          case 9:
            _ref8 = _context2.sent;
            _ref9 = (0, _slicedToArray3.default)(_ref8, 3);
            err = _ref9[0];
            res = _ref9[1];
            body = _ref9[2];


            // Fix progressbar output.
            console.log();

            if (!err) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt('return', callback(err));

          case 17:
            if (!(res.statusCode != 200)) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt('return', callback(new Error('ERROR_STATUS_NOT_OK')));

          case 19:
            _context2.next = 21;
            return writeFile(path, body, {
              encoding: null
            }, cb.single);

          case 21:
            err = _context2.sent;

            if (!err) {
              _context2.next = 24;
              break;
            }

            return _context2.abrupt('return', callback(err));

          case 24:

            callback(null, false, path);

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
};

var GetCacheList = function GetCacheList(callback) {
  readdir(DIR_CACHES, function (err, files) {
    if (err) {
      return callback(err);
    }

    callback(null, files.map(function (file) {
      return resolve(join(DIR_CACHES, file));
    }));
  });
};

(0, _assign2.default)(module.exports, {
  GetManifest: GetManifest,
  ClearManifestCache: ClearManifestCache,
  Download: Download,
  GetCacheList: GetCacheList
});