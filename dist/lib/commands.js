'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NWD = require('./');

var list = function list() {
  NWD.GetVersionList(function (err, versions) {
    if (err) {
      console.error(err);
      return;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(versions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var version = _step.value;

        console.log('\nversion: ' + version.version);
        console.log.apply(null, ['    targets: ' + version.files.join(' ')]);
        console.log.apply(null, ['    targets: ' + version.flavors.join(' ')]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
};

var latest = function latest() {
  NWD.GetLatestVersion(function (err, version) {
    if (err) {
      console.error(err);
      return;
    }

    console.dir(version);
  });
};

var stable = function stable() {
  NWD.GetStableVersion(function (err, version) {
    if (err) {
      console.error(err);
      return;
    }

    console.dir(version);
  });
};

var caches = function caches() {
  NWD.util.GetCacheList(function (err, paths) {
    if (err) return console.error(err);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(paths), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var path = _step2.value;
        console.log(path);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
};

var download = function download(command) {
  NWD.DownloadBinary({
    version: typeof command.version === 'string' ? command.version : null,
    platform: command.platform,
    arch: command.arch,
    flavor: command.flavor,
    mirror: command.mirror,
    output: command.output,
    unzip: command.unzip,
    showProgressbar: true
  }, function (err, fromCache, path) {
    if (err) return console.error(err);
    console.log((fromCache ? 'Cached' : 'Downloaded') + ': ' + path);
  });
};

(0, _assign2.default)(module.exports, {
  list: list,
  latest: latest,
  stable: stable,
  caches: caches,
  download: download
});