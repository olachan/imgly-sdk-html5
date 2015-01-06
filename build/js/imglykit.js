require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./index.js":[function(require,module,exports){
(function (global){
"use strict";
var ImglyKit = require("./src/js/imglykit")["default"];


/* istanbul ignore next */
(function () {
  if (typeof window !== "undefined") {
    window.ImglyKit = ImglyKit;
  } else if (typeof module !== "undefined") {
    module.exports = ImglyKit;
  } else if (typeof global !== "undefined") {
    global.ImglyKit = ImglyKit;
  }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/js/imglykit":"/Users/sash/development/js/imglykit-rewrite/src/js/imglykit.js"}],"/Users/sash/development/js/imglykit-rewrite/node_modules/browserify/node_modules/path-browserify/index.js":[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":"/Users/sash/development/js/imglykit-rewrite/node_modules/browserify/node_modules/process/browser.js"}],"/Users/sash/development/js/imglykit-rewrite/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/constants.js":[function(require,module,exports){
"use strict";
var RenderType = exports.RenderType = {
  IMAGE: "image",
  DATAURL: "data-url"
};

var ImageFormat = exports.ImageFormat = {
  PNG: "image/png",
  JPEG: "image/jpeg"
};

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/imglykit.js":[function(require,module,exports){
"use strict";
var _ = require("lodash");

var RenderImage = require("./lib/render-image")["default"];
var ImageExporter = require("./lib/image-exporter")["default"];
var RenderType = require("./constants").RenderType;
var ImageFormat = require("./constants").ImageFormat;
var Utils = require("./lib/utils")["default"];


// Default UIs
// import NightUI from "./ui/night/ui";

/**
 * @class
 * @param {Object} options
 * @param {HTMLElement} [options.container] - Specifies where the UI should be
 *                                          added to. If none is given, the UI
 *                                          will automatically be disabled.
 * @param {Image} options.image - The source image
 */
var ImglyKit = (function () {
  var ImglyKit = function ImglyKit(options) {
    // `options` is required
    if (typeof options === "undefined") throw new Error("No options given.");
    // `options.image` is required
    if (typeof options.image === "undefined") throw new Error("`options.image` is undefined.");

    // Set default options
    options = _.defaults(options, {
      assetsUrl: "assets",
      container: null,
      ui: true
    });

    /**
     * @type {Object}
     * @private
     */
    this._options = options;

    /**
     * The registered UI types that can be selected via the `ui` option
     * @type {Object.<String, UI>}
     * @private
     */
    this._registeredUIs = {};

    /**
     * The stack of {@link Operation} instances that will be used
     * to render the final Image
     * @type {Array.<ImglyKit.Operation>}
     */
    this.operationsStack = [];

    // Register the default UIs
    // this._registerUIs();

    // if (this._options.ui) {
    //   this._initUI();
    // }
  };

  ImglyKit.prototype.render = function (renderType, imageFormat, dimensions) {
    var settings = ImageExporter.validateSettings(renderType, imageFormat);

    renderType = settings.renderType;
    imageFormat = settings.imageFormat;

    // Create a RenderImage
    var renderImage = new RenderImage(this._options.image, this.operationsStack, dimensions, this._options.renderer);

    // Initiate image rendering
    return renderImage.render().then(function () {
      var canvas = renderImage.getRenderer().getCanvas();
      return ImageExporter["export"](canvas, renderType, imageFormat);
    });
  };

  ImglyKit.prototype.reset = function () {};

  ImglyKit.prototype.getAssetPath = function (asset) {
    var isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      /* istanbul ignore next */
      return this._options.assetsUrl + "/" + asset;
    } else {
      var path = require("path");
      return path.resolve(this._options.assetsUrl, asset);
    }
  };

  ImglyKit.prototype._registerUIs = function () {
    this.registerUI(NightUI);
  };

  ImglyKit.prototype.registerUI = function (ui) {
    this._registeredUIs[ui.prototype.identifier] = ui;
  };

  ImglyKit.prototype._initUI = function () {
    var UI;

    if (this._options.ui === true) {
      UI = Utils.values(this._registeredUIs)[0];
    } else {
      UI = this._registeredUIs[this._options.ui];
    }

    if (typeof UI === "undefined") {
      throw new Error("ImglyKit: Unknown UI: " + this._options.ui);
    }

    /**
     * @type {ImglyKit.UI}
     */
    this.ui = new UI(this, {
      container: this._options.container,
      assetsUrl: this._options.assetsUrl
    });
    this.ui.attach();
  };

  return ImglyKit;
})();

/**
 * The current version of the SDK
 * @name ImglyKit.version
 * @internal Keep in sync with package.json
 */
ImglyKit.version = "0.0.1";

// Exposed classes
ImglyKit.RenderImage = RenderImage;
ImglyKit.Color = require("./lib/color");
ImglyKit.Operation = require("./operations/operation");
ImglyKit.Operations = {};
ImglyKit.Operations.FiltersOperation = require("./operations/filters-operation")["default"];
ImglyKit.Operations.RotationOperation = require("./operations/rotation-operation")["default"];
ImglyKit.Operations.CropOperation = require("./operations/crop-operation")["default"];
ImglyKit.Operations.SaturationOperation = require("./operations/saturation-operation")["default"];
ImglyKit.Operations.ContrastOperation = require("./operations/contrast-operation")["default"];
ImglyKit.Operations.BrightnessOperation = require("./operations/brightness-operation")["default"];
ImglyKit.Operations.FlipOperation = require("./operations/flip-operation")["default"];
ImglyKit.Operations.TiltShiftOperation = require("./operations/tilt-shift-operation")["default"];
ImglyKit.Operations.RadialBlurOperation = require("./operations/radial-blur-operation")["default"];
ImglyKit.Operations.TextOperation = require("./operations/text-operation")["default"];
ImglyKit.Operations.StickersOperation = require("./operations/stickers-operation")["default"];
ImglyKit.Operations.FramesOperation = require("./operations/frames-operation")["default"];

// Exposed constants
ImglyKit.RenderType = RenderType;
ImglyKit.ImageFormat = ImageFormat;
ImglyKit.Vector2 = require("./lib/math/vector2")["default"];

exports["default"] = ImglyKit;

},{"./constants":"/Users/sash/development/js/imglykit-rewrite/src/js/constants.js","./lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","./lib/image-exporter":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/image-exporter.js","./lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","./lib/render-image":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/render-image.js","./lib/utils":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/utils.js","./operations/brightness-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/brightness-operation.js","./operations/contrast-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/contrast-operation.js","./operations/crop-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/crop-operation.js","./operations/filters-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters-operation.js","./operations/flip-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/flip-operation.js","./operations/frames-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/frames-operation.js","./operations/operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js","./operations/radial-blur-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/radial-blur-operation.js","./operations/rotation-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/rotation-operation.js","./operations/saturation-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/saturation-operation.js","./operations/stickers-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/stickers-operation.js","./operations/text-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/text-operation.js","./operations/tilt-shift-operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/tilt-shift-operation.js","lodash":"lodash","path":"/Users/sash/development/js/imglykit-rewrite/node_modules/browserify/node_modules/path-browserify/index.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js":[function(require,module,exports){
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Represents a color
 * @class
 * @alias ImglyKit.Color
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} [a]
 * @private
 */
var Color = (function () {
  var Color = function Color(r, g, b, a) {
    if (typeof a === "undefined") a = 1;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };

  Color.prototype.toRGBA = function () {
    var colors = [this.r * 255, this.g * 255, this.b * 255, this.a];
    return "rgba(" + colors.join(",") + ")";
  };

  Color.prototype.toHex = function () {
    var components = [this._componentToHex(this.r * 255), this._componentToHex(this.g * 255), this._componentToHex(this.b * 255)];
    return "#" + components.join("");
  };

  Color.prototype.toGLColor = function () {
    return [this.r, this.g, this.b, this.a];
  };

  Color.prototype.toRGBGLColor = function () {
    return [this.r, this.g, this.b];
  };

  Color.prototype._componentToHex = function (component) {
    var hex = component.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return Color;
})();

exports["default"] = Color;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/extend.js":[function(require,module,exports){
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Helper function to correctly set up the prototype chain
 * Based on the backbone.js extend function:
 * https://github.com/jashkenas/backbone/blob/master/backbone.js
 * @param  {Object} prototypeProperties
 * @param  {Object} classProperties
 * @return {Object}
 */
module.exports = function (prototypeProperties, classProperties) {
  /*jshint validthis:true*/
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (prototypeProperties && prototypeProperties.hasOwnProperty("constructor")) {
    child = prototypeProperties.constructor;
  } else {
    child = function () {
      return parent.apply(this, arguments);
    };
  }

  // Add static properties to the constructor function, if supplied.
  var key;
  for (key in parent) {
    child[key] = parent[key];
  }
  if (typeof classProperties !== "undefined") {
    for (key in classProperties) {
      child[key] = classProperties[key];
    }
  }

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function () {
    this.constructor = child;
  };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (prototypeProperties) {
    for (key in prototypeProperties) {
      child.prototype[key] = prototypeProperties[key];
    }
  }

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/image-dimensions.js":[function(require,module,exports){
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Parses the dimensions string and provides calculation functions
 * @class
 * @alias ImglyKit.ImageDimensions
 * @param {string} dimensions
 * @private
 */
var ImageDimensions = (function () {
  var ImageDimensions = function ImageDimensions(dimensions) {
    /**
     * The available dimension modifiers
     * @type {Object}
     * @private
     */
    this._modifiers = {
      FIXED: "!"
    };

    /**
     * @type {string}
     * @private
     */
    this._dimensionsString = dimensions;

    /**
     * An object that represents the parsed dimensions string
     * @type {Object}
     */
    this._rules = this._parse();

    this._validateRules();
  };

  ImageDimensions.prototype._parse = function () {
    if (typeof this._dimensionsString === "undefined") {
      return null;
    }

    var match = this._dimensionsString.match(/^([0-9]+)?x([0-9]+)?([\!])?$/i);
    if (!match) {
      throw new Error("Invalid size option: " + this._dimensionsString);
    }

    return {
      x: isNaN(match[1]) ? null : parseInt(match[1]),
      y: isNaN(match[2]) ? null : parseInt(match[2]),
      modifier: match[3]
    };
  };

  ImageDimensions.prototype._validateRules = function () {
    if (this._rules === null) return;

    var xAvailable = this._rules.x !== null;
    var yAvailable = this._rules.y !== null;

    if (this._rules.modifier === this._modifiers.FIXED && !(xAvailable && yAvailable)) {
      throw new Error("Both `x` and `y` have to be set when using the fixed (!) modifier.");
    }

    if (!xAvailable && !yAvailable) {
      throw new Error("Neither `x` nor `y` are given.");
    }
  };

  ImageDimensions.prototype.calculateFinalDimensions = function (initialDimensions) {
    var dimensions = initialDimensions.clone(), ratio;

    if (this._rules === null) return dimensions;

    /* istanbul ignore else */
    if (this._rules.modifier === this._modifiers.FIXED) {
      // Fixed dimensions
      dimensions.set(this._rules.x, this._rules.y);
    } else if (this._rules.x !== null && this._rules.y !== null) {
      // Both x and y given, resize to fit
      ratio = Math.min(this._rules.x / dimensions.x, this._rules.y / dimensions.y);
      dimensions.multiply(ratio);
    } else if (this._rules.x !== null) {
      // Fixed x, y by ratio
      ratio = initialDimensions.y / initialDimensions.x;
      dimensions.x = this._rules.x;
      dimensions.y = dimensions.x * ratio;
    } else if (this._rules.y !== null) {
      // Fixed y, x by ratio
      ratio = initialDimensions.x / initialDimensions.y;
      dimensions.y = this._rules.y;
      dimensions.x = dimensions.y * ratio;
    }

    return dimensions;
  };

  return ImageDimensions;
})();

exports["default"] = ImageDimensions;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/image-exporter.js":[function(require,module,exports){
"use strict";
var RenderType = require("../constants").RenderType;
var ImageFormat = require("../constants").ImageFormat;
var Utils = require("./utils")["default"];


/**
 * @class
 * @alias ImglyKit.ImageExporter
 * @private
 */
var ImageExporter = (function () {
  var ImageExporter = function ImageExporter() {};

  ImageExporter.validateSettings = function (renderType, imageFormat) {
    var settings = {
      renderType: renderType,
      imageFormat: imageFormat
    };

    // Validate RenderType
    if ((typeof settings.renderType !== "undefined" && settings.renderType !== null) && Utils.values(RenderType).indexOf(settings.renderType) === -1) {
      throw new Error("Invalid render type: " + settings.renderType);
    } else if (typeof renderType === "undefined") {
      settings.renderType = RenderType.DATA_URL;
    }

    // Validate ImageFormat
    if ((typeof settings.imageFormat !== "undefined" && settings.imageFormat !== null) && Utils.values(ImageFormat).indexOf(settings.imageFormat) === -1) {
      throw new Error("Invalid image format: " + settings.imageFormat);
    } else if (typeof imageFormat === "undefined") {
      settings.imageFormat = ImageFormat.PNG;
    }

    return settings;
  };

  ImageExporter["export"] = function (canvas, renderType, imageFormat) {
    var result = canvas.toDataURL(imageFormat);
    if (renderType == RenderType.IMAGE) {
      var image;

      /* istanbul ignore else  */
      if (typeof window === "undefined") {
        // Not a browser environment
        var CanvasImage = require("canvas").Image;
        image = new CanvasImage();
      } else {
        image = new Image();
      }

      image.src = result;
      result = image;
    }
    return result;
  };

  return ImageExporter;
})();

exports["default"] = ImageExporter;

},{"../constants":"/Users/sash/development/js/imglykit-rewrite/src/js/constants.js","./utils":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/utils.js","canvas":"canvas"}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js":[function(require,module,exports){
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Represents a 2-dimensional vector while providing math functions to
 * modify / clone the vector. Fully chainable.
 * @class
 * @alias ImglyKit.Vector2
 * @param {number} x
 * @param {number} y
 * @private
 */
var Vector2 = (function () {
  var Vector2 = function Vector2(x, y) {
    this.x = x;
    this.y = y;
    if (typeof this.x === "undefined") {
      this.x = 0;
    }
    if (typeof this.y === "undefined") {
      this.y = 0;
    }
  };

  Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  Vector2.prototype.clone = function () {
    return new Vector2(this.x, this.y);
  };

  Vector2.prototype.copy = function (other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  };

  Vector2.prototype.clamp = function (minimum, maximum) {
    /* istanbul ignore else  */
    if (!(minimum instanceof Vector2)) {
      minimum = new Vector2(minimum, minimum);
    }
    /* istanbul ignore else  */
    if (!(maximum instanceof Vector2)) {
      maximum = new Vector2(maximum, maximum);
    }
    this.x = Math.max(minimum.x, Math.min(maximum.x, this.x));
    this.y = Math.max(minimum.y, Math.min(maximum.y, this.y));
    return this;
  };

  Vector2.prototype.divide = function (divisor, y) {
    if (divisor instanceof Vector2) {
      this.x /= divisor.x;
      this.y /= divisor.y;
    } else {
      this.x /= divisor;
      this.y /= (typeof y === "undefined" ? divisor : y);
    }
    return this;
  };

  Vector2.prototype.subtract = function (subtrahend, y) {
    if (subtrahend instanceof Vector2) {
      this.x -= subtrahend.x;
      this.y -= subtrahend.y;
    } else {
      this.x -= subtrahend;
      this.y -= (typeof y === "undefined" ? subtrahend : y);
    }
    return this;
  };

  Vector2.prototype.multiply = function (factor, y) {
    if (factor instanceof Vector2) {
      this.x *= factor.x;
      this.y *= factor.y;
    } else {
      this.x *= factor;
      this.y *= (typeof y === "undefined" ? factor : y);
    }
    return this;
  };

  Vector2.prototype.add = function (addend, y) {
    if (addend instanceof Vector2) {
      this.x += addend.x;
      this.y += addend.y;
    } else {
      this.x += addend;
      this.y += (typeof y === "undefined" ? addend : y);
    }
    return this;
  };

  Vector2.prototype.equals = function (vec, y) {
    if (vec instanceof Vector2) {
      return vec.x === this.x && vec.y === this.y;
    } else {
      return vec === this.x && y === this.y;
    }
  };

  Vector2.prototype.toString = function () {
    return "Vector2({ x: " + this.x + ", y: " + this.y + " })";
  };

  return Vector2;
})();

exports["default"] = Vector2;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/render-image.js":[function(require,module,exports){
"use strict";
var bluebird = require("bluebird");

var ImageDimensions = require("./image-dimensions")["default"];
var Vector2 = require("./math/vector2")["default"];
var CanvasRenderer = require("../renderers/canvas-renderer")["default"];
var WebGLRenderer = require("../renderers/webgl-renderer")["default"];


/**
 * Handles the image rendering process
 * @class
 * @alias ImglyKit.RenderImage
 * @param {Image} image
 * @param {Array.<ImglyKit.Operation>} operationsStack
 * @param {string} dimensions
 * @param {string} preferredRenderer
 * @private
 */
var RenderImage = (function () {
  var RenderImage = function RenderImage(image, operationsStack, dimensions, preferredRenderer) {
    /**
     * @type {Object}
     * @private
     */
    this._options = {
      preferredRenderer: preferredRenderer
    };

    /**
     * @type {Boolean}
     * @private
     * @default false
     */
    this._webglEnabled = false;

    /**
     * @type {Renderer}
     * @private
     */
    this._renderer = null;

    /**
     * @type {Image}
     * @private
     */
    this._image = image;

    /**
     * @type {Array.<ImglyKit.Operation>}
     * @private
     */
    this._stack = operationsStack;

    /**
     * @type {ImglyKit.ImageDimensions}
     * @private
     */
    this._dimensions = new ImageDimensions(dimensions);

    /**
     * @type {Vector2}
     * @private
     */
    this._initialDimensions = new Vector2(this._image.width, this._image.height);

    this._initRenderer();
  };

  RenderImage.prototype._initRenderer = function () {
    /* istanbul ignore if */
    if (WebGLRenderer.isSupported() && this._options.preferredRenderer !== "canvas") {
      this._renderer = new WebGLRenderer(this._initialDimensions);
      this._webglEnabled = true;
    } else if (CanvasRenderer.isSupported()) {
      this._renderer = new CanvasRenderer(this._initialDimensions);
      this._webglEnabled = false;
    }

    /* istanbul ignore if */
    if (this._renderer === null) {
      throw new Error("Neither Canvas nor WebGL renderer are supported.");
    }

    this._renderer.drawImage(this._image);
  };

  RenderImage.prototype.render = function () {
    var self = this;
    return bluebird.map(this._stack, function (operation) {
      return operation.validateSettings();
    }).then(function () {
      return bluebird.map(self._stack, function (operation) {
        return operation.render(self._renderer);
      }, { concurrency: 1 }).then(function () {
        return self._renderer.renderFinal();
      });
    }).then(function () {
      var initialSize = self._renderer.getSize();
      var finalDimensions = self._dimensions.calculateFinalDimensions(initialSize);

      if (finalDimensions.equals(initialSize)) {
        // No need to resize
        return;
      }

      return self._renderer.resizeTo(finalDimensions);
    });
  };

  RenderImage.prototype.getRenderer = function () {
    return this._renderer;
  };

  return RenderImage;
})();

exports["default"] = RenderImage;

},{"../renderers/canvas-renderer":"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/canvas-renderer.js","../renderers/webgl-renderer":"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/webgl-renderer.js","./image-dimensions":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/image-dimensions.js","./math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","bluebird":"bluebird"}],"/Users/sash/development/js/imglykit-rewrite/src/js/lib/utils.js":[function(require,module,exports){
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Provides utility functions for internal use
 * @class
 * @alias ImglyKit.Utils
 * @private
 */
var Utils = (function () {
  var Utils = function Utils() {};

  Utils.isArray = function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  };

  Utils.select = function (items, selector) {
    // Turn string parameter into an array
    if (typeof selector === "string") {
      selector = selector.split(",").map(function (identifier) {
        return identifier.trim();
      });
    }

    // Turn array parameter into an object with `only`
    if (Utils.isArray(selector)) {
      selector = { only: selector };
    }

    if (typeof selector.only !== "undefined") {
      // Select only the given identifiers
      return items.filter(function (item) {
        return selector.only.indexOf(item) !== -1;
      });
    } else if (typeof selector.except !== "undefined") {
      // Select all but the given identifiers
      return items.filter(function (item) {
        return selector.except.indexOf(item) === -1;
      });
    }

    throw new Error("Utils#select failed to filter items.");
  };

  Utils.values = function (object) {
    var values = [];
    for (var key in object) {
      values.push(object[key]);
    }
    return values;
  };

  Utils.shaderString = function (f) {
    return f.toString().split("\n").slice(1, -1).join("\n");
  };

  Utils.isDOMElement = function (o) {
    return (typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string");
  };

  return Utils;
})();

exports["default"] = Utils;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/brightness-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var PrimitivesStack = require("./filters/primitives-stack")["default"];
var BrightnessPrimitive = require("./filters/primitives/brightness")["default"];


/**
 * @class
 * @alias ImglyKit.Operations.BrightnessOperation
 * @extends ImglyKit.Operation
 */
var BrightnessOperation = (function (Operation) {
  var BrightnessOperation = function BrightnessOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      brightness: { type: "number", "default": 0 }
    };

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(BrightnessOperation, Operation);

  BrightnessOperation.prototype.render = function (renderer) {
    var stack = new PrimitivesStack();

    stack.add(new BrightnessPrimitive({
      brightness: this._options.brightness
    }));

    stack.render(renderer);
  };

  _classProps(BrightnessOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "brightness";
      }
    }
  });

  return BrightnessOperation;
})(Operation);

exports["default"] = BrightnessOperation;

},{"./filters/primitives-stack":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives-stack.js","./filters/primitives/brightness":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/brightness.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/contrast-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var PrimitivesStack = require("./filters/primitives-stack")["default"];
var ContrastPrimitive = require("./filters/primitives/contrast")["default"];


/**
 * @class
 * @alias ImglyKit.Operations.ContrastOperation
 * @extends ImglyKit.Operation
 */
var ContrastOperation = (function (Operation) {
  var ContrastOperation = function ContrastOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      contrast: { type: "number", "default": 1 }
    };

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(ContrastOperation, Operation);

  ContrastOperation.prototype.render = function (renderer) {
    var stack = new PrimitivesStack();

    stack.add(new ContrastPrimitive({
      contrast: this._options.contrast
    }));

    stack.render(renderer);
  };

  _classProps(ContrastOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "contrast";
      }
    }
  });

  return ContrastOperation;
})(Operation);

exports["default"] = ContrastOperation;

},{"./filters/primitives-stack":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives-stack.js","./filters/primitives/contrast":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/contrast.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/crop-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Vector2 = require("../lib/math/vector2")["default"];


/**
 * An operation that can crop out a part of the image
 *
 * @class
 * @alias ImglyKit.Operations.CropOperation
 * @extends ImglyKit.Operation
 */
var CropOperation = (function (Operation) {
  var CropOperation = function CropOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      start: { type: "vector2", required: true },
      end: { type: "vector2", required: true }
    };

    /**
     * The fragment shader used for this operation
     */
    this.fragmentShader = "\n      precision mediump float;\n      uniform sampler2D u_image;\n      varying vec2 v_texCoord;\n      uniform vec2 u_cropStart;\n      uniform vec2 u_cropEnd;\n\n      void main() {\n        vec2 size = u_cropEnd - u_cropStart;\n        gl_FragColor = texture2D(u_image, v_texCoord * size + u_cropStart);\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(CropOperation, Operation);

  CropOperation.prototype._renderWebGL = function (renderer) {
    var canvas = renderer.getCanvas();
    var gl = renderer.getContext();
    var canvasSize = new Vector2(canvas.width, canvas.height);

    var start = this._options.start.clone();
    var end = this._options.end.clone();

    if (this._options.numberFormat === "absolute") {
      start.divide(canvasSize);
      end.divide(canvasSize);
    }

    // 0..1 > 1..0 on y-axis
    var originalStartY = start.y;
    start.y = 1 - end.y;
    end.y = 1 - originalStartY;

    // The new size
    var newDimensions = this._getNewDimensions(renderer);

    // Make sure we don't resize the input texture
    var lastTexture = renderer.getLastTexture();

    // Resize all textures except the one we use as input
    var textures = renderer.getTextures();
    var texture;
    for (var i = 0; i < textures.length; i++) {
      texture = textures[i];
      if (texture === lastTexture) continue;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newDimensions.x, newDimensions.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    // Resize the canvas
    canvas.width = newDimensions.x;
    canvas.height = newDimensions.y;

    // Run the cropping shader
    renderer.runShader(null, this.fragmentShader, {
      uniforms: {
        u_cropStart: { type: "2f", value: [start.x, start.y] },
        u_cropEnd: { type: "2f", value: [end.x, end.y] }
      }
    });

    // Resize the input texture
    gl.bindTexture(gl.TEXTURE_2D, lastTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newDimensions.x, newDimensions.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  };

  CropOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var dimensions = new Vector2(canvas.width, canvas.height);

    var newDimensions = this._getNewDimensions(renderer);

    // Create a temporary canvas to draw to
    var newCanvas = renderer.createCanvas();
    newCanvas.width = newDimensions.x;
    newCanvas.height = newDimensions.y;
    var newContext = newCanvas.getContext("2d");

    // The upper left corner of the cropped area on the original image
    var startPosition = this._options.start.clone();

    if (this._options.numberFormat === "relative") {
      startPosition.multiply(dimensions);
    }

    // Draw the source canvas onto the new one
    newContext.drawImage(canvas, startPosition.x, startPosition.y, // source x, y
    newDimensions.x, newDimensions.y, // source dimensions
    0, 0, // destination x, y
    newDimensions.x, newDimensions.y // destination dimensions
    );

    // Set the new canvas
    renderer.setCanvas(newCanvas);
  };

  CropOperation.prototype._getNewDimensions = function (renderer) {
    var canvas = renderer.getCanvas();
    var dimensions = new Vector2(canvas.width, canvas.height);

    var newDimensions = this._options.end.clone().subtract(this._options.start);

    if (this._options.numberFormat === "relative") {
      newDimensions.multiply(dimensions);
    }

    return newDimensions;
  };

  _classProps(CropOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "crop";
      }
    }
  });

  return CropOperation;
})(Operation);

exports["default"] = CropOperation;

},{"../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];


/**
 * An operation that can apply a selected filter
 *
 * @class
 * @alias ImglyKit.Operations.FiltersOperation
 * @extends ImglyKit.Operation
 */
var FiltersOperation = (function (Operation) {
  var FiltersOperation = function FiltersOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      filter: { type: "string", required: true,
        setter: function (value) {
          var Filter = this._filters[value];
          if (typeof Filter === "undefined") {
            throw new Error("FiltersOperation: Unknown filter \"" + value + "\".");
          }
          this._selectedFilter = new Filter();
          return value;
        }
      }
    };

    /**
     * The registered filters
     * @type {Object.<string, class>}
     */
    this._filters = {};
    this._registerFilters();

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(FiltersOperation, Operation);

  FiltersOperation.prototype.render = function (renderer) {
    this._selectedFilter.render(renderer);
  };

  FiltersOperation.prototype._registerFilters = function () {
    this._registerFilter(require("./filters/k1-filter")["default"]);
    this._registerFilter(require("./filters/k2-filter")["default"]);
    this._registerFilter(require("./filters/k6-filter")["default"]);
    this._registerFilter(require("./filters/kdynamic-filter")["default"]);
    this._registerFilter(require("./filters/fridge-filter")["default"]);
    this._registerFilter(require("./filters/breeze-filter")["default"]);
    this._registerFilter(require("./filters/orchid-filter")["default"]);
    this._registerFilter(require("./filters/chest-filter")["default"]);
    this._registerFilter(require("./filters/front-filter")["default"]);
    this._registerFilter(require("./filters/fixie-filter")["default"]);
    this._registerFilter(require("./filters/x400-filter")["default"]);
    this._registerFilter(require("./filters/bw-filter")["default"]);
    this._registerFilter(require("./filters/bwhard-filter")["default"]);
    this._registerFilter(require("./filters/lenin-filter")["default"]);
    this._registerFilter(require("./filters/quozi-filter")["default"]);
    this._registerFilter(require("./filters/pola669-filter")["default"]);
    this._registerFilter(require("./filters/pola-filter")["default"]);
    this._registerFilter(require("./filters/food-filter")["default"]);
    this._registerFilter(require("./filters/glam-filter")["default"]);
    this._registerFilter(require("./filters/celsius-filter")["default"]);
    this._registerFilter(require("./filters/texas-filter")["default"]);
    this._registerFilter(require("./filters/morning-filter")["default"]);
    this._registerFilter(require("./filters/lomo-filter")["default"]);
    this._registerFilter(require("./filters/gobblin-filter")["default"]);
    this._registerFilter(require("./filters/mellow-filter")["default"]);
    this._registerFilter(require("./filters/sunny-filter")["default"]);
    this._registerFilter(require("./filters/a15-filter")["default"]);
    this._registerFilter(require("./filters/semired-filter")["default"]);
  };

  FiltersOperation.prototype._registerFilter = function (filter) {
    this._filters[filter.identifier] = filter;
  };

  _classProps(FiltersOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "filters";
      }
    }
  });

  return FiltersOperation;
})(Operation);

exports["default"] = FiltersOperation;

},{"./filters/a15-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/a15-filter.js","./filters/breeze-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/breeze-filter.js","./filters/bw-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/bw-filter.js","./filters/bwhard-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/bwhard-filter.js","./filters/celsius-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/celsius-filter.js","./filters/chest-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/chest-filter.js","./filters/fixie-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/fixie-filter.js","./filters/food-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/food-filter.js","./filters/fridge-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/fridge-filter.js","./filters/front-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/front-filter.js","./filters/glam-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/glam-filter.js","./filters/gobblin-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/gobblin-filter.js","./filters/k1-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k1-filter.js","./filters/k2-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k2-filter.js","./filters/k6-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k6-filter.js","./filters/kdynamic-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/kdynamic-filter.js","./filters/lenin-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/lenin-filter.js","./filters/lomo-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/lomo-filter.js","./filters/mellow-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/mellow-filter.js","./filters/morning-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/morning-filter.js","./filters/orchid-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/orchid-filter.js","./filters/pola-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/pola-filter.js","./filters/pola669-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/pola669-filter.js","./filters/quozi-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/quozi-filter.js","./filters/semired-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/semired-filter.js","./filters/sunny-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/sunny-filter.js","./filters/texas-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/texas-filter.js","./filters/x400-filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/x400-filter.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/a15-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * A15 Filter
 * @class
 * @alias ImglyKit.Filters.A15Filter
 * @extends {ImglyKit.Filter}
 */
var A15Filter = (function (Filter) {
  var A15Filter = function A15Filter() {
    Filter.apply(this, arguments);
  };

  _extends(A15Filter, Filter);

  A15Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Contrast({
      contrast: 0.63
    }));

    stack.add(new Filter.Primitives.Brightness({
      brightness: 0.12
    }));

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 38], [94, 94], [148, 142], [175, 187], [255, 255]],
        green: [[0, 0], [77, 53], [171, 190], [255, 255]],
        blue: [[0, 10], [48, 85], [174, 228], [255, 255]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(A15Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "a15";
      }
    }
  });

  return A15Filter;
})(Filter);

exports["default"] = A15Filter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/breeze-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Breeze Filter
 * @class
 * @alias ImglyKit.Filters.BreezeFilter
 * @extends {ImglyKit.Filter}
 */
var BreezeFilter = (function (Filter) {
  var BreezeFilter = function BreezeFilter() {
    Filter.apply(this, arguments);
  };

  _extends(BreezeFilter, Filter);

  BreezeFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Desaturation
    stack.add(new Filter.Primitives.Desaturation({
      desaturation: 0.5
    }));

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [170, 170], [212, 219], [234, 242], [255, 255]],
        green: [[0, 0], [170, 168], [234, 231], [255, 255]],
        blue: [[0, 0], [170, 170], [212, 208], [255, 255]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(BreezeFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "breeze";
      }
    }
  });

  return BreezeFilter;
})(Filter);

exports["default"] = BreezeFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/bw-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * BW Filter
 * @class
 * @alias ImglyKit.Filters.BWFilter
 * @extends {ImglyKit.Filter}
 */
var BWFilter = (function (Filter) {
  var BWFilter = function BWFilter() {
    Filter.apply(this, arguments);
  };

  _extends(BWFilter, Filter);

  BWFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Grayscale());

    stack.render(renderer);
  };

  _classProps(BWFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "bw";
      }
    }
  });

  return BWFilter;
})(Filter);

exports["default"] = BWFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/bwhard-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * BWHard Filter
 * @class
 * @alias ImglyKit.Filters.BWHardFilter
 * @extends {ImglyKit.Filter}
 */
var BWHardFilter = (function (Filter) {
  var BWHardFilter = function BWHardFilter() {
    Filter.apply(this, arguments);
  };

  _extends(BWHardFilter, Filter);

  BWHardFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Grayscale());
    stack.add(new Filter.Primitives.Contrast({
      contrast: 1.5
    }));

    stack.render(renderer);
  };

  _classProps(BWHardFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "bwhard";
      }
    }
  });

  return BWHardFilter;
})(Filter);

exports["default"] = BWHardFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/celsius-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Celsius Filter
 * @class
 * @alias ImglyKit.Filters.CelsiusFilter
 * @extends {ImglyKit.Filter}
 */
var CelsiusFilter = (function (Filter) {
  var CelsiusFilter = function CelsiusFilter() {
    Filter.apply(this, arguments);
  };

  _extends(CelsiusFilter, Filter);

  CelsiusFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 69], [55, 110], [202, 230], [255, 255]],
        green: [[0, 44], [89, 93], [185, 141], [255, 189]],
        blue: [[0, 76], [39, 82], [218, 138], [255, 171]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(CelsiusFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "celsius";
      }
    }
  });

  return CelsiusFilter;
})(Filter);

exports["default"] = CelsiusFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/chest-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Chest Filter
 * @class
 * @alias ImglyKit.Filters.ChestFilter
 * @extends {ImglyKit.Filter}
 */
var ChestFilter = (function (Filter) {
  var ChestFilter = function ChestFilter() {
    Filter.apply(this, arguments);
  };

  _extends(ChestFilter, Filter);

  ChestFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [44, 44], [124, 143], [221, 204], [255, 255]],
        green: [[0, 0], [130, 127], [213, 199], [255, 255]],
        blue: [[0, 0], [51, 52], [219, 204], [255, 255]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(ChestFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "chest";
      }
    }
  });

  return ChestFilter;
})(Filter);

exports["default"] = ChestFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/* jshint unused: false */
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Base class for filters. Extendable via {@link ImglyKit.Filter#extend}
 * @class
 * @alias ImglyKit.Filter
 */
var Filter = (function () {
  var Filter = function Filter() {};

  Filter.prototype.render = function (renderer) {
    /* istanbul ignore next */
    throw new Error("Filter#render is abstract and not implemented in inherited class.");
  };

  _classProps(Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return null;
      }
    }
  });

  return Filter;
})();

/**
 * To create an {@link ImglyKit.Filter} class of your own, call this
 * method and provide instance properties and functions.
 * @function
 */
Filter.extend = require("../../lib/extend");

// Exposed classes
Filter.PrimitivesStack = require("./primitives-stack")["default"];
Filter.Primitives = {};
Filter.Primitives.Saturation = require("./primitives/saturation")["default"];
Filter.Primitives.LookupTable = require("./primitives/lookup-table")["default"];
Filter.Primitives.ToneCurve = require("./primitives/tone-curve")["default"];
Filter.Primitives.SoftColorOverlay = require("./primitives/soft-color-overlay")["default"];
Filter.Primitives.Desaturation = require("./primitives/desaturation")["default"];
Filter.Primitives.X400 = require("./primitives/x400")["default"];
Filter.Primitives.Grayscale = require("./primitives/grayscale")["default"];
Filter.Primitives.Contrast = require("./primitives/contrast")["default"];
Filter.Primitives.Glow = require("./primitives/glow")["default"];
Filter.Primitives.Gobblin = require("./primitives/gobblin")["default"];
Filter.Primitives.Brightness = require("./primitives/brightness")["default"];

exports["default"] = Filter;

},{"../../lib/extend":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/extend.js","./primitives-stack":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives-stack.js","./primitives/brightness":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/brightness.js","./primitives/contrast":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/contrast.js","./primitives/desaturation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/desaturation.js","./primitives/glow":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/glow.js","./primitives/gobblin":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/gobblin.js","./primitives/grayscale":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/grayscale.js","./primitives/lookup-table":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/lookup-table.js","./primitives/saturation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/saturation.js","./primitives/soft-color-overlay":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/soft-color-overlay.js","./primitives/tone-curve":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/tone-curve.js","./primitives/x400":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/x400.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/fixie-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Fixie Filter
 * @class
 * @alias ImglyKit.Filters.FixieFilter
 * @extends {ImglyKit.Filter}
 */
var FixieFilter = (function (Filter) {
  var FixieFilter = function FixieFilter() {
    Filter.apply(this, arguments);
  };

  _extends(FixieFilter, Filter);

  FixieFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [44, 28], [63, 48], [128, 132], [235, 248], [255, 255]],
        green: [[0, 0], [20, 10], [60, 45], [190, 209], [211, 231], [255, 255]],
        blue: [[0, 31], [41, 62], [150, 142], [234, 212], [255, 224]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(FixieFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "fixie";
      }
    }
  });

  return FixieFilter;
})(Filter);

exports["default"] = FixieFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/food-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Food Filter
 * @class
 * @alias ImglyKit.Filters.FoodFilter
 * @extends {ImglyKit.Filter}
 */
var FoodFilter = (function (Filter) {
  var FoodFilter = function FoodFilter() {
    Filter.apply(this, arguments);
  };

  _extends(FoodFilter, Filter);

  FoodFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Saturation({
      saturation: 1.35
    }));

    stack.add(new Filter.Primitives.Contrast({
      contrast: 1.1
    }));

    stack.render(renderer);
  };

  _classProps(FoodFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "food";
      }
    }
  });

  return FoodFilter;
})(Filter);

exports["default"] = FoodFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/fridge-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Fridge Filter
 * @class
 * @alias ImglyKit.Filters.FridgeFilter
 * @extends {ImglyKit.Filter}
 */
var FridgeFilter = (function (Filter) {
  var FridgeFilter = function FridgeFilter() {
    Filter.apply(this, arguments);
  };

  _extends(FridgeFilter, Filter);

  FridgeFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 9], [21, 11], [45, 24], [255, 220]],
        green: [[0, 12], [21, 21], [42, 42], [150, 150], [170, 173], [255, 210]],
        blue: [[0, 28], [43, 72], [128, 185], [255, 220]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(FridgeFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "fridge";
      }
    }
  });

  return FridgeFilter;
})(Filter);

exports["default"] = FridgeFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/front-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Front Filter
 * @class
 * @alias ImglyKit.Filters.FrontFilter
 * @extends {ImglyKit.Filter}
 */
var FrontFilter = (function (Filter) {
  var FrontFilter = function FrontFilter() {
    Filter.apply(this, arguments);
  };

  _extends(FrontFilter, Filter);

  FrontFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 65], [28, 67], [67, 113], [125, 183], [187, 217], [255, 229]],
        green: [[0, 52], [42, 59], [104, 134], [169, 209], [255, 240]],
        blue: [[0, 52], [65, 68], [93, 104], [150, 153], [255, 198]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(FrontFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "front";
      }
    }
  });

  return FrontFilter;
})(Filter);

exports["default"] = FrontFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/glam-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Glam Filter
 * @class
 * @alias ImglyKit.Filters.GlamFilter
 * @extends {ImglyKit.Filter}
 */
var GlamFilter = (function (Filter) {
  var GlamFilter = function GlamFilter() {
    Filter.apply(this, arguments);
  };

  _extends(GlamFilter, Filter);

  GlamFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Contrast({
      contrast: 1.1
    }));

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [94, 74], [181, 205], [255, 255]],
        green: [[0, 0], [127, 127], [255, 255]],
        blue: [[0, 0], [102, 73], [227, 213], [255, 255]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(GlamFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "glam";
      }
    }
  });

  return GlamFilter;
})(Filter);

exports["default"] = GlamFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/gobblin-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Gobblin Filter
 * @class
 * @alias ImglyKit.Filters.GobblinFilter
 * @extends {ImglyKit.Filter}
 */
var GobblinFilter = (function (Filter) {
  var GobblinFilter = function GobblinFilter() {
    Filter.apply(this, arguments);
  };

  _extends(GobblinFilter, Filter);

  GobblinFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.Gobblin());

    stack.render(renderer);
  };

  _classProps(GobblinFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "gobblin";
      }
    }
  });

  return GobblinFilter;
})(Filter);

exports["default"] = GobblinFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k1-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * K1 Filter
 * @class
 * @alias ImglyKit.Filters.K1Filter
 * @extends {ImglyKit.Filter}
 */
var K1Filter = (function (Filter) {
  var K1Filter = function K1Filter() {
    Filter.apply(this, arguments);
  };

  _extends(K1Filter, Filter);

  K1Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [53, 32], [91, 80], [176, 205], [255, 255]]
    }));

    // Saturation
    stack.add(new Filter.Primitives.Saturation({
      saturation: 0.9
    }));

    stack.render(renderer);
  };

  _classProps(K1Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "k1";
      }
    }
  });

  return K1Filter;
})(Filter);

exports["default"] = K1Filter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k2-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];
var Color = require("../../lib/color")["default"];


/**
 * K2 Filter
 * @class
 * @alias ImglyKit.Filters.K2Filter
 * @extends {ImglyKit.Filter}
 */
var K2Filter = (function (Filter) {
  var K2Filter = function K2Filter() {
    Filter.apply(this, arguments);
  };

  _extends(K2Filter, Filter);

  K2Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [54, 33], [77, 82], [94, 103], [122, 126], [177, 193], [229, 232], [255, 255]]
    }));

    // Soft color overlay
    stack.add(new Filter.Primitives.SoftColorOverlay({
      color: new Color(40 / 255, 40 / 255, 40 / 255)
    }));

    stack.render(renderer);
  };

  _classProps(K2Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "k2";
      }
    }
  });

  return K2Filter;
})(Filter);

exports["default"] = K2Filter;

},{"../../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/k6-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * K6 Filter
 * @class
 * @alias ImglyKit.Filters.K6Filter
 * @extends {ImglyKit.Filter}
 */
var K6Filter = (function (Filter) {
  var K6Filter = function K6Filter() {
    Filter.apply(this, arguments);
  };

  _extends(K6Filter, Filter);

  K6Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Saturation
    stack.add(new Filter.Primitives.Saturation({
      saturation: 0.5
    }));

    stack.render(renderer);
  };

  _classProps(K6Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "k6";
      }
    }
  });

  return K6Filter;
})(Filter);

exports["default"] = K6Filter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/kdynamic-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * KDynamic Filter
 * @class
 * @alias ImglyKit.Filters.KDynamicFilter
 * @extends {ImglyKit.Filter}
 */
var KDynamicFilter = (function (Filter) {
  var KDynamicFilter = function KDynamicFilter() {
    Filter.apply(this, arguments);
  };

  _extends(KDynamicFilter, Filter);

  KDynamicFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [17, 27], [46, 69], [90, 112], [156, 200], [203, 243], [255, 255]]
    }));

    // Saturation
    stack.add(new Filter.Primitives.Saturation({
      saturation: 0.7
    }));

    stack.render(renderer);
  };

  _classProps(KDynamicFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "kdynamic";
      }
    }
  });

  return KDynamicFilter;
})(Filter);

exports["default"] = KDynamicFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/lenin-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Lenin Filter
 * @class
 * @alias ImglyKit.Filters.LeninFilter
 * @extends {ImglyKit.Filter}
 */
var LeninFilter = (function (Filter) {
  var LeninFilter = function LeninFilter() {
    Filter.apply(this, arguments);
  };

  _extends(LeninFilter, Filter);

  LeninFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Desaturation
    stack.add(new Filter.Primitives.Desaturation({
      desaturation: 0.4
    }));

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 20], [40, 20], [106, 111], [129, 153], [190, 223], [255, 255]],
        green: [[0, 20], [40, 20], [62, 41], [106, 108], [132, 159], [203, 237], [255, 255]],
        blue: [[0, 40], [40, 40], [73, 60], [133, 160], [191, 297], [203, 237], [237, 239], [255, 255]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(LeninFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "lenin";
      }
    }
  });

  return LeninFilter;
})(Filter);

exports["default"] = LeninFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/lomo-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Lomo Filter
 * @class
 * @alias ImglyKit.Filters.LomoFilter
 * @extends {ImglyKit.Filter}
 */
var LomoFilter = (function (Filter) {
  var LomoFilter = function LomoFilter() {
    Filter.apply(this, arguments);
  };

  _extends(LomoFilter, Filter);

  LomoFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [87, 20], [131, 156], [183, 205], [255, 200]]
    }));

    stack.render(renderer);
  };

  _classProps(LomoFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "lomo";
      }
    }
  });

  return LomoFilter;
})(Filter);

exports["default"] = LomoFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/mellow-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Mellow Filter
 * @class
 * @alias ImglyKit.Filters.MellowFilter
 * @extends {ImglyKit.Filter}
 */
var MellowFilter = (function (Filter) {
  var MellowFilter = function MellowFilter() {
    Filter.apply(this, arguments);
  };

  _extends(MellowFilter, Filter);

  MellowFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [41, 84], [87, 134], [255, 255]],
        green: [[0, 0], [255, 216]],
        blue: [[0, 0], [255, 131]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(MellowFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "mellow";
      }
    }
  });

  return MellowFilter;
})(Filter);

exports["default"] = MellowFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/morning-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Morning Filter
 * @class
 * @alias ImglyKit.Filters.MorningFilter
 * @extends {ImglyKit.Filter}
 */
var MorningFilter = (function (Filter) {
  var MorningFilter = function MorningFilter() {
    Filter.apply(this, arguments);
  };

  _extends(MorningFilter, Filter);

  MorningFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 40], [255, 230]],
        green: [[0, 10], [255, 225]],
        blue: [[0, 20], [255, 181]]
      }
    }));

    stack.add(new Filter.Primitives.Glow());

    stack.render(renderer);
  };

  _classProps(MorningFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "morning";
      }
    }
  });

  return MorningFilter;
})(Filter);

exports["default"] = MorningFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/orchid-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Orchid Filter
 * @class
 * @alias ImglyKit.Filters.OrchidFilter
 * @extends {ImglyKit.Filter}
 */
var OrchidFilter = (function (Filter) {
  var OrchidFilter = function OrchidFilter() {
    Filter.apply(this, arguments);
  };

  _extends(OrchidFilter, Filter);

  OrchidFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [115, 130], [195, 215], [255, 255]],
        green: [[0, 0], [148, 153], [172, 215], [255, 255]],
        blue: [[0, 46], [58, 75], [178, 205], [255, 255]]
      }
    }));

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [117, 151], [189, 217], [255, 255]]
    }));

    // Desaturation
    stack.add(new Filter.Primitives.Desaturation({
      desaturation: 0.65
    }));

    stack.render(renderer);
  };

  _classProps(OrchidFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "orchid";
      }
    }
  });

  return OrchidFilter;
})(Filter);

exports["default"] = OrchidFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/pola-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Pola Filter
 * @class
 * @alias ImglyKit.Filters.PolaFilter
 * @extends {ImglyKit.Filter}
 */
var PolaFilter = (function (Filter) {
  var PolaFilter = function PolaFilter() {
    Filter.apply(this, arguments);
  };

  _extends(PolaFilter, Filter);

  PolaFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [94, 74], [181, 205], [255, 255]],
        green: [[0, 0], [34, 34], [99, 76], [176, 190], [255, 255]],
        blue: [[0, 0], [102, 73], [227, 213], [255, 255]]
      }
    }));

    stack.add(new Filter.Primitives.Saturation({
      saturation: 0.8
    }));

    stack.add(new Filter.Primitives.Contrast({
      contrast: 1.5
    }));

    stack.render(renderer);
  };

  _classProps(PolaFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "pola";
      }
    }
  });

  return PolaFilter;
})(Filter);

exports["default"] = PolaFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/pola669-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Pola669 Filter
 * @class
 * @alias ImglyKit.Filters.Pola669Filter
 * @extends {ImglyKit.Filter}
 */
var Pola669Filter = (function (Filter) {
  var Pola669Filter = function Pola669Filter() {
    Filter.apply(this, arguments);
  };

  _extends(Pola669Filter, Filter);

  Pola669Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [56, 18], [196, 209], [255, 255]],
        green: [[0, 38], [71, 84], [255, 255]],
        blue: [[0, 0], [131, 133], [204, 211], [255, 255]]
      }
    }));

    stack.add(new Filter.Primitives.Saturation({
      saturation: 0.8
    }));

    stack.add(new Filter.Primitives.Contrast({
      contrast: 1.5
    }));

    stack.render(renderer);
  };

  _classProps(Pola669Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "pola669";
      }
    }
  });

  return Pola669Filter;
})(Filter);

exports["default"] = Pola669Filter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives-stack.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * A helper class that can collect {@link Primitive} instances and render
 * the stack
 * @class
 * @alias ImglyKit.Filter.PrimitivesStack
 */
var PrimitivesStack = (function () {
  var PrimitivesStack = function PrimitivesStack() {
    var args = _slice.call(arguments);

    Function.call.apply(Function, [this].concat(_toArray(args)));

    /**
     * The stack of {@link ImglyKit.Filter.Primitive} instances
     * @type {Array}
     * @private
     */
    this._stack = [];
  };

  PrimitivesStack.prototype.add = function (primitive) {
    this._stack.push(primitive);
  };

  PrimitivesStack.prototype.render = function (renderer) {
    for (var i = 0; i < this._stack.length; i++) {
      var primitive = this._stack[i];
      primitive.render(renderer);
    }
  };

  return PrimitivesStack;
})();

exports["default"] = PrimitivesStack;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/brightness.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];


/**
 * Brightness primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Brightness
 * @extends {ImglyKit.Filter.Primitive}
 */
var Brightness = (function (Primitive) {
  var Brightness = function Brightness() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      brightness: 1
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform float u_brightness;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        gl_FragColor = vec4((texColor.rgb + vec3(u_brightness)), texColor.a);\n      }\n\n    ";
  };

  _extends(Brightness, Primitive);

  Brightness.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_brightness: { type: "f", value: this._options.brightness }
      }
    });
  };

  Brightness.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var brightness = this._options.brightness;

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        imageData.data[index] = imageData.data[index] + brightness * 255;
        imageData.data[index + 1] = imageData.data[index + 1] + brightness * 255;
        imageData.data[index + 2] = imageData.data[index + 2] + brightness * 255;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Brightness;
})(Primitive);

exports["default"] = Brightness;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/contrast.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];


/**
 * Contrast primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Contrast
 * @extends {ImglyKit.Filter.Primitive}
 */
var Contrast = (function (Primitive) {
  var Contrast = function Contrast() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      contrast: 1
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform float u_contrast;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        gl_FragColor = vec4(((texColor.rgb - vec3(0.5)) * u_contrast + vec3(0.5)), texColor.a);\n      }\n\n    ";
  };

  _extends(Contrast, Primitive);

  Contrast.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_contrast: { type: "f", value: this._options.contrast }
      }
    });
  };

  Contrast.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var contrast = this._options.contrast;

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        imageData.data[index] = (imageData.data[index] - 127) * contrast + 127;
        imageData.data[index + 1] = (imageData.data[index + 1] - 127) * contrast + 127;
        imageData.data[index + 2] = (imageData.data[index + 2] - 127) * contrast + 127;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Contrast;
})(Primitive);

exports["default"] = Contrast;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/desaturation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];


/**
 * Desaturation primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Desaturation
 * @extends {ImglyKit.Filter.Primitive}
 */
var Desaturation = (function (Primitive) {
  var Desaturation = function Desaturation() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      desaturation: 1
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform float u_desaturation;\n\n      const vec3 luminanceWeighting = vec3(0.2125, 0.7154, 0.0721);\n\n      void main() {\n        vec3 texColor = texture2D(u_image, v_texCoord).xyz;\n        vec3 grayXfer = vec3(0.3, 0.59, 0.11);\n        vec3 gray = vec3(dot(grayXfer, texColor));\n        gl_FragColor = vec4(mix(texColor, gray, u_desaturation), 1.0);\n      }\n    ";
  };

  _extends(Desaturation, Primitive);

  Desaturation.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_desaturation: { type: "f", value: this._options.desaturation }
      }
    });
  };

  Desaturation.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var desaturation = this._options.desaturation;

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var luminance = imageData.data[index] * 0.3 + imageData.data[index + 1] * 0.59 + imageData.data[index + 2] * 0.11;
        imageData.data[index] = luminance * (1 - desaturation) + (imageData.data[index] * desaturation);
        imageData.data[index + 1] = luminance * (1 - desaturation) + (imageData.data[index + 1] * desaturation);
        imageData.data[index + 2] = luminance * (1 - desaturation) + (imageData.data[index + 2] * desaturation);
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Desaturation;
})(Primitive);

exports["default"] = Desaturation;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/glow.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];
var Color = require("../../../lib/color")["default"];


/**
 * Glow primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Glow
 * @extends {ImglyKit.Filter.Primitive}
 */
var Glow = (function (Primitive) {
  var Glow = function Glow() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      color: new Color(1, 1, 1)
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n\n      uniform vec3 u_color;\n\n      void main() {\n        vec3 texColor = texture2D(u_image, v_texCoord).rgb;\n\n        vec2 textureCoord = v_texCoord - vec2(0.5, 0.5);\n        textureCoord /= 0.75;\n\n        float d = 1.0 - dot(textureCoord, textureCoord);\n        d = clamp(d, 0.2, 1.0);\n        vec3 newColor = texColor * d * u_color.rgb;\n        gl_FragColor = vec4(vec3(newColor),1.0);\n      }\n    ";
  };

  _extends(Glow, Primitive);

  Glow.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_color: { type: "3f", value: this._options.color.toRGBGLColor() }
      }
    });
  };

  Glow.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var color = this._options.color;

    var d;
    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var x01 = x / canvas.width;
        var y01 = y / canvas.height;

        var nx = (x01 - 0.5) / 0.75;
        var ny = (y01 - 0.5) / 0.75;

        var scalarX = nx * nx;
        var scalarY = ny * ny;
        d = 1 - (scalarX + scalarY);
        d = Math.min(Math.max(d, 0.1), 1);

        imageData.data[index] = imageData.data[index] * (d * color[0] / 255);
        imageData.data[index + 1] = imageData.data[index + 1] * (d * color[1] / 255);
        imageData.data[index + 2] = imageData.data[index + 2] * (d * color[2] / 255);
        imageData.data[index + 3] = 255;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Glow;
})(Primitive);

exports["default"] = Glow;

},{"../../../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/gobblin.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Primitive = require("./primitive")["default"];


/**
 * Gobblin primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Gobblin
 * @extends {ImglyKit.Filter.Primitive}
 */
var Gobblin = (function (Primitive) {
  var Gobblin = function Gobblin() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        texColor.b = texColor.g * 0.33;\n        texColor.r = texColor.r * 0.6;\n        texColor.b += texColor.r * 0.33;\n        texColor.g = texColor.g * 0.7;\n        gl_FragColor = texColor;\n      }\n    ";
  };

  _extends(Gobblin, Primitive);

  Gobblin.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader);
  };

  Gobblin.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        imageData.data[index + 2] = imageData.data[index + 1] * 0.33;
        imageData.data[index] = imageData.data[index] * 0.6;
        imageData.data[index + 2] += imageData.data[index] * 0.33;
        imageData.data[index + 1] = imageData.data[index + 1] * 0.7;
        imageData.data[index + 3] = 255;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Gobblin;
})(Primitive);

exports["default"] = Gobblin;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/grayscale.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Primitive = require("./primitive")["default"];


/**
 * Grayscale primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Grayscale
 * @extends {ImglyKit.Filter.Primitive}
 */
var Grayscale = (function (Primitive) {
  var Grayscale = function Grayscale() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      vec3 W = vec3(0.2125, 0.7154, 0.0721);\n\n      void main() {\n        vec3 texColor = texture2D(u_image, v_texCoord).rgb;\n        float luminance = dot(texColor, W);\n        gl_FragColor = vec4(vec3(luminance), 1.0);\n      }\n    ";
  };

  _extends(Grayscale, Primitive);

  Grayscale.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader);
  };

  Grayscale.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var luminance = imageData.data[index] * 0.2125 + imageData.data[index + 1] * 0.7154 + imageData.data[index + 2] * 0.0721;

        imageData.data[index] = luminance;
        imageData.data[index + 1] = luminance;
        imageData.data[index + 2] = luminance;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Grayscale;
})(Primitive);

exports["default"] = Grayscale;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/lookup-table.js":[function(require,module,exports){
"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Primitive = require("./primitive")["default"];


/**
 * Stores a 256 byte long lookup table in a 2d texture which will be
 * used to look up the corresponding value for each channel.
 * @class
 * @alias ImglyKit.Filter.Primitives.LookupTable
 * @extends {ImglyKit.Filter.Primitive}
 */
var LookupTable = (function (Primitive) {
  var LookupTable = function LookupTable() {
    Primitive.apply(this, arguments);

    this._textureIndex = 3;

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform sampler2D u_lookupTable;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        float r = texture2D(u_lookupTable, vec2(texColor.r, 0.0)).r;\n        float g = texture2D(u_lookupTable, vec2(texColor.g, 0.0)).g;\n        float b = texture2D(u_lookupTable, vec2(texColor.b, 0.0)).b;\n\n        gl_FragColor = vec4(r, g, b, texColor.a);\n      }\n    ";
  };

  _extends(LookupTable, Primitive);

  LookupTable.prototype.renderWebGL = function (renderer) {
    this._updateTexture(renderer);

    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_lookupTable: { type: "i", value: 3 }
      }
    });
  };

  LookupTable.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var table = this._options.data;

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var r = imageData.data[index];
        imageData.data[index] = table[r * 4];
        var g = imageData.data[index + 1];
        imageData.data[index + 1] = table[1 + g * 4];
        var b = imageData.data[index + 2];
        imageData.data[index + 2] = table[2 + b * 4];
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  LookupTable.prototype._updateTexture = function (renderer) {
    var gl = renderer.getContext();

    if (typeof this._options.data === "undefined") {
      throw new Error("LookupTable: No data specified.");
    }

    var dataTypedArray = new Uint8Array(this._options.data);

    gl.activeTexture(gl.TEXTURE0 + this._textureIndex);
    if (!this._texture) {
      this._texture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataTypedArray);
    gl.activeTexture(gl.TEXTURE0);
  };

  return LookupTable;
})(Primitive);

exports["default"] = LookupTable;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js":[function(require,module,exports){
/* jshint unused: false */
"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

/**
 * Base class for primitives. Extendable via {@link ImglyKit.Filter.Primitive#extend}
 * @class
 * @alias ImglyKit.Filter.Primitive
 */
var Primitive = (function () {
  var Primitive = function Primitive(options) {
    options = options || {};

    this._options = options;
  };

  Primitive.prototype.render = function (renderer) {
    if (renderer.identifier === "webgl") {
      this.renderWebGL(renderer);
    } else {
      this.renderCanvas(renderer);
    }
  };

  Primitive.prototype.renderWebGL = function (renderer) {
    /* istanbul ignore next */
    throw new Error("Primitive#renderWebGL is abstract and not implemented in inherited class.");
  };

  Primitive.prototype.renderCanvas = function (renderer) {
    /* istanbul ignore next */
    throw new Error("Primitive#renderCanvas is abstract and not implemented in inherited class.");
  };

  return Primitive;
})();

exports["default"] = Primitive;

},{}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/saturation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];


/**
 * Saturation primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.Saturation
 * @extends {ImglyKit.Filter.Primitive}
 */
var Saturation = (function (Primitive) {
  var Saturation = function Saturation() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      saturation: 0
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform float u_saturation;\n\n      const vec3 luminanceWeighting = vec3(0.2125, 0.7154, 0.0721);\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        float luminance = dot(texColor.rgb, luminanceWeighting);\n\n        vec3 greyScaleColor = vec3(luminance);\n\n        gl_FragColor = vec4(mix(greyScaleColor, texColor.rgb, u_saturation), texColor.a);\n      }\n    ";
  };

  _extends(Saturation, Primitive);

  Saturation.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_saturation: { type: "f", value: this._options.saturation }
      }
    });
  };

  Saturation.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);
    var saturation = this._options.saturation;

    var d;
    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var luminance = imageData.data[index] * 0.2125 + imageData.data[index + 1] * 0.7154 + imageData.data[index + 2] * 0.0721;
        imageData.data[index] = luminance * (1 - saturation) + (imageData.data[index] * saturation);
        imageData.data[index + 1] = luminance * (1 - saturation) + (imageData.data[index + 1] * saturation);
        imageData.data[index + 2] = luminance * (1 - saturation) + (imageData.data[index + 2] * saturation);
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return Saturation;
})(Primitive);

exports["default"] = Saturation;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/soft-color-overlay.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var Primitive = require("./primitive")["default"];
var Color = require("../../../lib/color")["default"];


/**
 * SoftColorOverlay primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.SoftColorOverlay
 * @extends {ImglyKit.Filter.Primitive}
 */
var SoftColorOverlay = (function (Primitive) {
  var SoftColorOverlay = function SoftColorOverlay() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      color: new Color(1, 1, 1)
    });

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform vec3 u_overlay;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        vec4 overlayVec4 = vec4(u_overlay, texColor.a);\n        gl_FragColor = max(overlayVec4, texColor);\n      }\n    ";
  };

  _extends(SoftColorOverlay, Primitive);

  SoftColorOverlay.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_overlay: { type: "3f", value: this._options.color.toRGBGLColor() }
      }
    });
  };

  SoftColorOverlay.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        imageData.data[index] = Math.max(this._options.color.r, imageData.data[index]);
        imageData.data[index + 1] = Math.max(this._options.color.g, imageData.data[index + 1]);
        imageData.data[index + 2] = Math.max(this._options.color.b, imageData.data[index + 2]);
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return SoftColorOverlay;
})(Primitive);

exports["default"] = SoftColorOverlay;

},{"../../../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/tone-curve.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var _ = require("lodash");

var LookupTable = require("./lookup-table")["default"];


/**
 * Tone curve primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.ToneCurve
 * @extends {ImglyKit.Filter.Primitives.LookupTable}
 */
var ToneCurve = (function (LookupTable) {
  var ToneCurve = function ToneCurve() {
    var args = _slice.call(arguments);

    LookupTable.call.apply(LookupTable, [this].concat(_toArray(args)));

    this._options = _.defaults(this._options, {
      rgbControlPoints: {
        red: this._options.controlPoints,
        green: this._options.controlPoints,
        blue: this._options.controlPoints
      }
    });

    if (typeof this._options.rgbControlPoints !== "undefined") {
      this._updateLookupTable();
    }
  };

  _extends(ToneCurve, LookupTable);

  ToneCurve.prototype._updateLookupTable = function () {
    var r = this._calculateSplineCurve(this._options.rgbControlPoints.red);
    var g = this._calculateSplineCurve(this._options.rgbControlPoints.green);
    var b = this._calculateSplineCurve(this._options.rgbControlPoints.blue);

    this._options.data = this._buildLookupTable(r, g, b);
  };

  ToneCurve.prototype._buildLookupTable = function (r, g, b) {
    var data = [];

    for (var i = 0; i < 256; i++) {
      data.push(Math.min(Math.max(i + r[i], 0), 255));
      data.push(Math.min(Math.max(i + g[i], 0), 255));
      data.push(Math.min(Math.max(i + b[i], 0), 255));
      data.push(255);
    }

    return data;
  };

  ToneCurve.prototype._calculateSplineCurve = function (points) {
    points = points.sort(function (a, b) {
      return a[0] > b[0];
    });

    var splinePoints = this._getSplineCurve(points);
    var firstSplinePoint = splinePoints[0];
    var i;

    if (firstSplinePoint[0] > 0) {
      for (i = 0; i < firstSplinePoint[0]; i++) {
        splinePoints.unshift([0, 0]);
      }
    }

    var preparedPoints = [];
    for (i = 0; i < splinePoints.length; i++) {
      var newPoint = splinePoints[i];
      var origPoint = [newPoint[0], newPoint[0]];

      var distance = Math.sqrt(Math.pow(origPoint[0] - newPoint[0], 2) + Math.pow(origPoint[1] - newPoint[1], 2));

      if (origPoint[1] > newPoint[1]) {
        distance = -distance;
      }

      preparedPoints.push(distance);
    }

    return preparedPoints;
  };

  ToneCurve.prototype._getSplineCurve = function (points) {
    var sdA = this._secondDerivative(points);

    var n = sdA.length;
    var sd = [];
    var i;

    for (i = 0; i < n; i++) {
      sd[i] = sdA[i];
    }

    var output = [];

    for (i = 0; i < n - 1; i++) {
      var cur = points[i];
      var next = points[i + 1];

      for (var x = cur[0]; x < next[0]; x++) {
        var t = (x - cur[0]) / (next[0] - cur[0]);

        var a = 1 - t;
        var b = t;
        var h = next[0] - cur[0];

        var y = a * cur[1] + b * next[1] + (h * h / 6) * ((a * a * a - a) * sd[i] + (b * b * b - b) * sd[i + 1]);

        if (y > 255) {
          y = 255;
        } else if (y < 0) {
          y = 0;
        }

        output.push([x, y]);
      }
    }

    if (output.length === 255) {
      output.push(points[points.length - 1]);
    }

    return output;
  };

  ToneCurve.prototype._secondDerivative = function (points) {
    var n = points.length;
    if (n <= 0 || n === 1) {
      return null;
    }

    var matrix = [];
    var result = [];
    var i, k;

    matrix[0] = [0, 1, 0];

    for (i = 1; i < n - 1; i++) {
      var P1 = points[i - 1];
      var P2 = points[i];
      var P3 = points[i + 1];

      matrix[i] = matrix[i] || [];
      matrix[i][0] = (P2[0] - P1[0]) / 6;
      matrix[i][1] = (P3[0] - P1[0]) / 3;
      matrix[i][2] = (P3[0] - P2[0]) / 6;
      result[i] = (P3[1] - P2[1]) / (P3[0] - P2[0]) - (P2[1] - P1[1]) / (P2[0] - P1[0]);
    }

    result[0] = 0;
    result[n - 1] = 0;

    matrix[n - 1] = [0, 1, 0];

    // Pass 1
    for (i = 1; i < n; i++) {
      k = matrix[1][0] / matrix[i - 1][1];
      matrix[i][1] -= k * matrix[i - 1][2];
      matrix[i][0] = 0;
      result[i] -= k * result[i - 1];
    }

    // Pass 2
    for (i = n - 2; i > 0; i--) {
      k = matrix[i][2] / matrix[i + 1][1];
      matrix[i][1] -= k * matrix[i + 1][0];
      matrix[i][2] = 0;
      result[i] -= k * result[i + 1];
    }

    var y2 = [];
    for (i = 0; i < n; i++) {
      y2[i] = result[i] / matrix[i][1];
    }

    return y2;
  };

  return ToneCurve;
})(LookupTable);

exports["default"] = ToneCurve;

},{"./lookup-table":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/lookup-table.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/x400.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Primitive = require("./primitive")["default"];


/**
 * X400 primitive
 * @class
 * @alias ImglyKit.Filter.Primitives.X400
 * @extends {ImglyKit.Filter.Primitive}
 */
var X400 = (function (Primitive) {
  var X400 = function X400() {
    var args = _slice.call(arguments);

    Primitive.call.apply(Primitive, [this].concat(_toArray(args)));

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n\n      void main() {\n        vec4 texColor = texture2D(u_image, v_texCoord);\n        float gray = texColor.r * 0.3 + texColor.g * 0.3 + texColor.b * 0.3;\n        gray -= 0.2;\n        gray = clamp(gray, 0.0, 1.0);\n        gray += 0.15;\n        gray *= 1.4;\n        gl_FragColor = vec4(vec3(gray), 1.0);\n      }\n    ";
  };

  _extends(X400, Primitive);

  X400.prototype.renderWebGL = function (renderer) {
    renderer.runShader(null, this._fragmentShader);
  };

  X400.prototype.renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var imageData = renderer.getContext().getImageData(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4;

        var gray = imageData.data[index] / 255 * 0.3 + imageData.data[index + 1] / 255 * 0.3 + imageData.data[index + 2] / 255 * 0.3;
        gray -= 0.2;
        gray = Math.max(0, Math.min(1, gray));
        gray += 0.15;
        gray *= 1.4;

        gray *= 255;
        imageData.data[index] = gray;
        imageData.data[index + 1] = gray;
        imageData.data[index + 2] = gray;
      }
    }

    renderer.getContext().putImageData(imageData, 0, 0);
  };

  return X400;
})(Primitive);

exports["default"] = X400;

},{"./primitive":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/primitive.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/quozi-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Quozi Filter
 * @class
 * @alias ImglyKit.Filters.QuoziFilter
 * @extends {ImglyKit.Filter}
 */
var QuoziFilter = (function (Filter) {
  var QuoziFilter = function QuoziFilter() {
    Filter.apply(this, arguments);
  };

  _extends(QuoziFilter, Filter);

  QuoziFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    // Desaturation
    stack.add(new Filter.Primitives.Desaturation({
      desaturation: 0.65
    }));

    // Tone curve
    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 50], [40, 78], [118, 170], [181, 211], [255, 255]],
        green: [[0, 27], [28, 45], [109, 157], [157, 195], [179, 208], [206, 212], [255, 240]],
        blue: [[0, 50], [12, 55], [46, 103], [103, 162], [194, 182], [241, 201], [255, 219]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(QuoziFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "quozi";
      }
    }
  });

  return QuoziFilter;
})(Filter);

exports["default"] = QuoziFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/semired-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Semired Filter
 * @class
 * @alias ImglyKit.Filters.SemiredFilter
 * @extends {ImglyKit.Filter}
 */
var SemiredFilter = (function (Filter) {
  var SemiredFilter = function SemiredFilter() {
    Filter.apply(this, arguments);
  };

  _extends(SemiredFilter, Filter);

  SemiredFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 129], [75, 153], [181, 227], [255, 255]],
        green: [[0, 8], [111, 85], [212, 158], [255, 226]],
        blue: [[0, 5], [75, 22], [193, 90], [255, 229]]
      }
    }));

    stack.add(new Filter.Primitives.Glow());

    stack.render(renderer);
  };

  _classProps(SemiredFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "semired";
      }
    }
  });

  return SemiredFilter;
})(Filter);

exports["default"] = SemiredFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/sunny-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Sunny Filter
 * @class
 * @alias ImglyKit.Filters.SunnyFilter
 * @extends {ImglyKit.Filter}
 */
var SunnyFilter = (function (Filter) {
  var SunnyFilter = function SunnyFilter() {
    Filter.apply(this, arguments);
  };

  _extends(SunnyFilter, Filter);

  SunnyFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 0], [62, 82], [141, 154], [255, 255]],
        green: [[0, 39], [56, 96], [192, 176], [255, 255]],
        blue: [[0, 0], [174, 99], [255, 235]]
      }
    }));

    stack.add(new Filter.Primitives.ToneCurve({
      controlPoints: [[0, 0], [55, 20], [158, 191], [255, 255]]
    }));

    stack.render(renderer);
  };

  _classProps(SunnyFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "sunny";
      }
    }
  });

  return SunnyFilter;
})(Filter);

exports["default"] = SunnyFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/texas-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * Texas Filter
 * @class
 * @alias ImglyKit.Filters.TexasFilter
 * @extends {ImglyKit.Filter}
 */
var TexasFilter = (function (Filter) {
  var TexasFilter = function TexasFilter() {
    Filter.apply(this, arguments);
  };

  _extends(TexasFilter, Filter);

  TexasFilter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.ToneCurve({
      rgbControlPoints: {
        red: [[0, 72], [89, 99], [176, 212], [255, 237]],
        green: [[0, 49], [255, 192]],
        blue: [[0, 72], [255, 151]]
      }
    }));

    stack.render(renderer);
  };

  _classProps(TexasFilter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "texas";
      }
    }
  });

  return TexasFilter;
})(Filter);

exports["default"] = TexasFilter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/x400-filter.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Filter = require("./filter")["default"];


/**
 * X400 Filter
 * @class
 * @alias ImglyKit.Filters.X400Filter
 * @extends {ImglyKit.Filter}
 */
var X400Filter = (function (Filter) {
  var X400Filter = function X400Filter() {
    Filter.apply(this, arguments);
  };

  _extends(X400Filter, Filter);

  X400Filter.prototype.render = function (renderer) {
    var stack = new Filter.PrimitivesStack();

    stack.add(new Filter.Primitives.X400());

    stack.render(renderer);
  };

  _classProps(X400Filter, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * the active filter.
       * @type {String}
       */
      get: function () {
        return "x400";
      }
    }
  });

  return X400Filter;
})(Filter);

exports["default"] = X400Filter;

},{"./filter":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/filter.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/flip-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Utils = require("../lib/utils")["default"];


/**
 * An operation that can flip the canvas
 *
 * @class
 * @alias ImglyKit.Operations.FlipOperation
 * @extends ImglyKit.Operation
 */
var FlipOperation = (function (Operation) {
  var FlipOperation = function FlipOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      horizontal: { type: "boolean", "default": false },
      vertical: { type: "boolean", "default": false }
    };

    /**
     * The fragment shader used for this operation
     */
    this.fragmentShader = "\n      precision mediump float;\n      uniform sampler2D u_image;\n      varying vec2 v_texCoord;\n      uniform bool u_flipVertical;\n      uniform bool u_flipHorizontal;\n\n      void main() {\n        vec2 texCoord = vec2(v_texCoord);\n        if (u_flipVertical) {\n          texCoord.y = 1.0 - texCoord.y;\n        }\n        if (u_flipHorizontal) {\n          texCoord.x = 1.0 - texCoord.x;\n        }\n        gl_FragColor = texture2D(u_image, texCoord);\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(FlipOperation, Operation);

  FlipOperation.prototype._renderWebGL = function (renderer) {
    renderer.runShader(null, FlipOperation.fragmentShader, {
      uniforms: {
        u_flipVertical: { type: "f", value: this._options.vertical },
        u_flipHorizontal: { type: "f", value: this._options.horizontal }
      }
    });
  };

  FlipOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var context = renderer.getContext();

    var scaleX = 1, scaleY = 1;
    var translateX = 0, translateY = 0;

    if (this._options.horizontal) {
      scaleX = -1;
      translateX = canvas.width;
    }

    if (this._options.vertical) {
      scaleY = -1;
      translateY = canvas.height;
    }

    // Save the current state
    context.save();

    // Apply the transformation
    context.translate(translateX, translateY);
    context.scale(scaleX, scaleY);

    // Create a temporary canvas so that we can draw the image
    // with the applied transformation
    var tempCanvas = renderer.cloneCanvas();
    context.drawImage(tempCanvas, 0, 0);

    // Restore old transformation
    context.restore();
  };

  _classProps(FlipOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "flip";
      }
    }
  });

  return FlipOperation;
})(Operation);

exports["default"] = FlipOperation;

},{"../lib/utils":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/utils.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/frames-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Color = require("../lib/color")["default"];


/**
 * An operation that can frames on the canvas
 *
 * @class
 * @alias ImglyKit.Operations.FramesOperation
 * @extends ImglyKit.Operation
 */
var FramesOperation = (function (Operation) {
  var FramesOperation = function FramesOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      color: { type: "color", "default": new Color(0, 0, 0, 1) },
      thickness: { type: "number", "default": 0.02 }
    };

    /**
     * The texture index used for the frame
     * @type {Number}
     * @private
     */
    this._textureIndex = 1;

    /**
     * The fragment shader used for this operation
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform sampler2D u_frameImage;\n      uniform vec4 u_color;\n      uniform vec2 u_thickness;\n\n      void main() {\n        vec4 fragColor = texture2D(u_image, v_texCoord);\n        if (v_texCoord.x < u_thickness.x || v_texCoord.x > 1.0 - u_thickness.x ||\n          v_texCoord.y < u_thickness.y || v_texCoord.y > 1.0 - u_thickness.y) {\n            fragColor = u_color;\n          }\n\n        gl_FragColor = fragColor;\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(FramesOperation, Operation);

  FramesOperation.prototype._renderWebGL = function (renderer) {
    var canvas = renderer.getCanvas();

    var color = this._options.color;
    var thickness = this._options.thickness * canvas.height;
    var thicknessVec2 = [thickness / canvas.width, thickness / canvas.height];

    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_color: { type: "4f", value: color.toGLColor() },
        u_thickness: { type: "2f", value: thicknessVec2 }
      }
    });
  };

  FramesOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();
    var context = renderer.getContext();

    var color = this._options.color;
    var thickness = this._options.thickness * canvas.height;

    context.save();
    context.beginPath();
    context.lineWidth = thickness * 2;
    context.strokeStyle = color.toRGBA();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
    context.restore();
  };

  _classProps(FramesOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "frames";
      }
    }
  });

  return FramesOperation;
})(Operation);

exports["default"] = FramesOperation;

},{"../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/* jshint unused:false */
/* jshint -W083 */
"use strict";
var _ = require("lodash");

var Vector2 = require("../lib/math/vector2")["default"];
var Color = require("../lib/color")["default"];


/**
 * Base class for Operations. Extendable via {@link ImglyKit.Operation#extend}.
 * @class
 * @alias ImglyKit.Operation
 */
var Operation = (function () {
  var Operation = function Operation(kit, options) {
    if (kit.constructor.name !== "ImglyKit") {
      throw new Error("Operation: First parameter for constructor has to be an ImglyKit instance.");
    }

    this._kit = kit;
    this.availableOptions = _.extend(this.availableOptions || {}, {
      numberFormat: { type: "string", "default": "relative", available: ["absolute", "relative"] }
    });

    this._initOptions(options || {});
  };

  Operation.prototype.validateSettings = function () {
    var identifier = this.identifier;

    // Check for required options
    for (var optionName in this.availableOptions) {
      var optionConfig = this.availableOptions[optionName];
      if (optionConfig.required && typeof this._options[optionName] === "undefined") {
        throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` is required.");
      }
    }
  };

  Operation.prototype.render = function (renderer) {
    if (renderer.identifier === "webgl") {
      /* istanbul ignore next */
      this._renderWebGL(renderer);
    } else {
      this._renderCanvas(renderer);
    }
  };

  Operation.prototype._renderWebGL = function () {
    throw new Error("Operation#_renderWebGL is abstract and not implemented in inherited class.");
  };

  Operation.prototype._renderCanvas = function () {
    throw new Error("Operation#_renderCanvas is abstract and not implemented in inherited class.");
  };

  Operation.prototype._initOptions = function (userOptions) {
    this._options = {};

    // Set defaults, create getters and setters
    var optionName, option, capitalized;
    var self = this;
    for (optionName in this.availableOptions) {
      option = this.availableOptions[optionName];

      // Set default if available
      if (typeof option["default"] !== "undefined") {
        this._options[optionName] = option["default"];
      }

      // Create setter and getter
      (function (optionName, option) {
        capitalized = optionName.charAt(0).toUpperCase() + optionName.slice(1);

        self["set" + capitalized] = function (value) {
          if (typeof option.setter !== "undefined") {
            value = option.setter.call(this, value);
          }
          self._setOption(optionName, value);
        };

        // Default getter
        self["get" + capitalized] = function () {
          return self._getOption(optionName);
        };
      })(optionName, option);
    }

    // Overwrite options with the ones given by user
    for (optionName in userOptions) {
      // Check if option is available
      if (typeof this.availableOptions[optionName] === "undefined") {
        throw new Error("Invalid option: " + optionName);
      }

      // Call setter
      capitalized = optionName.charAt(0).toUpperCase() + optionName.slice(1);
      this["set" + capitalized](userOptions[optionName]);
    }
  };

  Operation.prototype._getOption = function (optionName) {
    return this._options[optionName];
  };

  Operation.prototype._setOption = function (optionName, value) {
    var optionConfig = this.availableOptions[optionName];
    var identifier = this.identifier;

    if (typeof optionConfig.validation !== "undefined") {
      optionConfig.validation(value);
    }

    switch (optionConfig.type) {
      // String options
      case "string":
        if (typeof value !== "string") {
          throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` has to be a string.");
        }

        // String value restrictions
        var available = optionConfig.available;
        if (typeof available !== "undefined" && available.indexOf(value) === -1) {
          throw new Error("Operation `" + identifier + "`: Invalid value for `" + optionName + "` (valid values are: " + optionConfig.available.join(", ") + ")");
        }

        this._options[optionName] = value;
        break;

      // Number options
      case "number":
        if (typeof value !== "number") {
          throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` has to be a number.");
        }

        this._options[optionName] = value;
        break;

      // Boolean options
      case "boolean":
        if (typeof value !== "boolean") {
          throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` has to be a boolean.");
        }

        this._options[optionName] = value;
        break;

      // Vector2 options
      case "vector2":
        if (!(value instanceof Vector2)) {
          throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` has to be an instance of ImglyKit.Vector2.");
        }

        this._options[optionName] = value.clone();

        break;

      // Color options
      case "color":
        if (!(value instanceof Color)) {
          throw new Error("Operation `" + identifier + "`: Option `" + optionName + "` has to be an instance of ImglyKit.Color.");
        }

        this._options[optionName] = value;
        break;
    }
  };

  _classProps(Operation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return null;
      }
    }
  });

  return Operation;
})();

var extend = require("../lib/extend")["default"];
Operation.extend = extend;

exports["default"] = Operation;

},{"../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","../lib/extend":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/extend.js","../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","lodash":"lodash"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/radial-blur-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Vector2 = require("../lib/math/vector2")["default"];
var StackBlur = require("../vendor/stack-blur")["default"];


/**
 * An operation that can crop out a part of the image
 *
 * @class
 * @alias ImglyKit.Operations.RadialBlurOperation
 * @extends ImglyKit.Operation
 */
var RadialBlurOperation = (function (Operation) {
  var RadialBlurOperation = function RadialBlurOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      position: { type: "vector2", "default": new Vector2(0.5, 0.5) },
      gradientRadius: { type: "number", "default": 50 },
      blurRadius: { type: "number", "default": 20 }
    };

    /**
     * The fragment shader used for this operation
     * @internal Based on evanw's glfx.js tilt shift shader:
     *           https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
     */
    this.fragmentShader = "\n      precision mediump float;\n      uniform sampler2D u_image;\n      uniform float blurRadius;\n      uniform float gradientRadius;\n      uniform vec2 position;\n      uniform vec2 delta;\n      uniform vec2 texSize;\n      varying vec2 v_texCoord;\n\n      float random(vec3 scale, float seed) {\n        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n      }\n\n      void main() {\n          vec4 color = vec4(0.0);\n          float total = 0.0;\n\n          float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n          float radius = smoothstep(0.0, 1.0, abs(distance(v_texCoord * texSize, position)) / (gradientRadius * 2.0)) * blurRadius;\n          for (float t = -30.0; t <= 30.0; t++) {\n              float percent = (t + offset - 0.5) / 30.0;\n              float weight = 1.0 - abs(percent);\n              vec4 sample = texture2D(u_image, v_texCoord + delta * percent * radius / texSize);\n\n              sample.rgb *= sample.a;\n\n              color += sample * weight;\n              total += weight;\n          }\n\n          gl_FragColor = color / total;\n          gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(RadialBlurOperation, Operation);

  RadialBlurOperation.prototype._renderWebGL = function (renderer) {
    var canvas = renderer.getCanvas();
    var canvasSize = new Vector2(canvas.width, canvas.height);

    var position = this._options.position.clone();
    position.y = canvasSize.y - position.y;

    if (this._options.numberFormat === "relative") {
      position.multiply(canvasSize);
    }

    var uniforms = {
      blurRadius: { type: "f", value: this._options.blurRadius },
      gradientRadius: { type: "f", value: this._options.gradientRadius },
      position: { type: "2f", value: [position.x, position.y] },
      texSize: { type: "2f", value: [canvas.width, canvas.height] },
      delta: { type: "2f", value: [1, 1] }
    };

    // First pass
    renderer.runShader(null, RadialBlurOperation.fragmentShader, {
      uniforms: uniforms
    });

    // Update delta for second pass
    uniforms.delta.value = [-1, 1];

    renderer.runShader(null, RadialBlurOperation.fragmentShader, {
      uniforms: uniforms
    });
  };

  RadialBlurOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();

    var blurryCanvas = this._blurCanvas(renderer);
    var maskCanvas = this._createMask(renderer);

    this._applyMask(canvas, blurryCanvas, maskCanvas);
  };

  RadialBlurOperation.prototype._blurCanvas = function (renderer) {
    var newCanvas = renderer.cloneCanvas();
    var blurryContext = newCanvas.getContext("2d");
    var blurryImageData = blurryContext.getImageData(0, 0, newCanvas.width, newCanvas.height);
    StackBlur.stackBlurCanvasRGBA(blurryImageData, 0, 0, newCanvas.width, newCanvas.height, this._options.blurRadius);
    blurryContext.putImageData(blurryImageData, 0, 0);

    return newCanvas;
  };

  RadialBlurOperation.prototype._createMask = function (renderer) {
    var canvas = renderer.getCanvas();

    var canvasSize = new Vector2(canvas.width, canvas.height);
    var gradientRadius = this._options.gradientRadius;

    var maskCanvas = renderer.createCanvas(canvas.width, canvas.height);
    var maskContext = maskCanvas.getContext("2d");

    var position = this._options.position.clone();

    if (this._options.numberFormat === "relative") {
      position.multiply(canvasSize);
    }

    // Build gradient
    var gradient = maskContext.createRadialGradient(position.x, position.y, 0, position.x, position.y, gradientRadius);
    gradient.addColorStop(0, "#FFFFFF");
    gradient.addColorStop(0.5, "#000000");
    gradient.addColorStop(1, "#000000");

    // Draw gradient
    maskContext.fillStyle = gradient;
    maskContext.fillRect(0, 0, canvas.width, canvas.height);

    return maskCanvas;
  };

  RadialBlurOperation.prototype._applyMask = function (inputCanvas, blurryCanvas, maskCanvas) {
    var inputContext = inputCanvas.getContext("2d");
    var blurryContext = blurryCanvas.getContext("2d");
    var maskContext = maskCanvas.getContext("2d");

    var inputImageData = inputContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
    var pixels = inputImageData.data;
    var blurryPixels = blurryContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height).data;
    var maskPixels = maskContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height).data;

    var index, alpha;
    for (var y = 0; y < inputCanvas.height; y++) {
      for (var x = 0; x < inputCanvas.width; x++) {
        index = (y * inputCanvas.width + x) * 4;
        alpha = maskPixels[index] / 255;

        pixels[index] = alpha * pixels[index] + (1 - alpha) * blurryPixels[index];
        pixels[index + 1] = alpha * pixels[index + 1] + (1 - alpha) * blurryPixels[index + 1];
        pixels[index + 2] = alpha * pixels[index + 2] + (1 - alpha) * blurryPixels[index + 2];
      }
    }

    inputContext.putImageData(inputImageData, 0, 0);
  };

  _classProps(RadialBlurOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "radial-blur";
      }
    }
  });

  return RadialBlurOperation;
})(Operation);

exports["default"] = RadialBlurOperation;

},{"../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","../vendor/stack-blur":"/Users/sash/development/js/imglykit-rewrite/src/js/vendor/stack-blur.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/rotation-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];


/**
 * An operation that can rotate the canvas
 *
 * @class
 * @alias ImglyKit.Operations.RotationOperation
 * @extends ImglyKit.Operation
 */
var RotationOperation = (function (Operation) {
  var RotationOperation = function RotationOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      degrees: { type: "number", "default": 0, validation: function (value) {
          if (value % 90 !== 0) {
            throw new Error("RotationOperation: `rotation` has to be a multiple of 90.");
          }
        } }
    };

    /**
     * The fragment shader used for this operation
     */
    this.vertexShader = "\n      attribute vec2 a_position;\n      attribute vec2 a_texCoord;\n      varying vec2 v_texCoord;\n      uniform mat3 u_matrix;\n\n      void main() {\n        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);\n        v_texCoord = a_texCoord;\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(RotationOperation, Operation);

  RotationOperation.prototype._renderWebGL = function (renderer) {
    var canvas = renderer.getCanvas();
    var gl = renderer.getContext();

    var actualDegrees = this._options.degrees % 360;
    var lastTexture = renderer.getLastTexture();

    if (actualDegrees % 180 !== 0) {
      // Resize the canvas
      var width = canvas.width;
      canvas.width = canvas.height;
      canvas.height = width;

      // Resize the current texture
      var currentTexture = renderer.getCurrentTexture();
      gl.bindTexture(gl.TEXTURE_2D, currentTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      // Resize all other textures except the input texture
      var textures = renderer.getTextures();
      var texture;
      for (var i = 0; i < textures.length; i++) {
        texture = textures[i];
        if (texture === lastTexture) continue;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
    }

    // Build the rotation matrix
    var radians = actualDegrees * (Math.PI / 180);
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var rotationMatrix = [c, -s, 0, s, c, 0, 0, 0, 1];

    // Run the shader
    renderer.runShader(this.vertexShader, null, {
      uniforms: {
        u_matrix: { type: "mat3fv", value: rotationMatrix }
      }
    });

    // Resize the input texture
    gl.bindTexture(gl.TEXTURE_2D, lastTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  };

  RotationOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();

    var actualDegrees = this._options.degrees % 360;
    var width = canvas.width;
    var height = canvas.height;

    if (actualDegrees % 180 !== 0) {
      width = canvas.height;
      height = canvas.width;
    }

    // Create a rotated canvas
    var newCanvas = renderer.createCanvas();
    newCanvas.width = width;
    newCanvas.height = height;
    var newContext = newCanvas.getContext("2d");

    newContext.save();

    // Translate the canvas
    newContext.translate(newCanvas.width / 2, newCanvas.height / 2);

    // Rotate the canvas
    newContext.rotate(actualDegrees * (Math.PI / 180));

    // Create a temporary canvas so that we can draw the image
    // with the applied transformation
    var tempCanvas = renderer.cloneCanvas();
    newContext.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);

    // Restore old transformation
    newContext.restore();

    renderer.setCanvas(newCanvas);
  };

  _classProps(RotationOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "rotation";
      }
    }
  });

  return RotationOperation;
})(Operation);

exports["default"] = RotationOperation;

},{"./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/saturation-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var PrimitivesStack = require("./filters/primitives-stack")["default"];
var SaturationPrimitive = require("./filters/primitives/saturation")["default"];


/**
 * @class
 * @alias ImglyKit.Operations.SaturationOperation
 * @extends ImglyKit.Operation
 */
var SaturationOperation = (function (Operation) {
  var SaturationOperation = function SaturationOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      saturation: { type: "number", "default": 1 }
    };

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(SaturationOperation, Operation);

  SaturationOperation.prototype.render = function (renderer) {
    var stack = new PrimitivesStack();

    stack.add(new SaturationPrimitive({
      saturation: this._options.saturation
    }));

    stack.render(renderer);
  };

  _classProps(SaturationOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "saturation";
      }
    }
  });

  return SaturationOperation;
})(Operation);

exports["default"] = SaturationOperation;

},{"./filters/primitives-stack":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives-stack.js","./filters/primitives/saturation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/filters/primitives/saturation.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/stickers-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Vector2 = require("../lib/math/vector2")["default"];
var Utils = require("../lib/utils")["default"];
var bluebird = require("bluebird");

/**
 * An operation that can draw text on the canvas
 *
 * @class
 * @alias ImglyKit.Operations.StickersOperation
 * @extends ImglyKit.Operation
 */
var StickersOperation = (function (Operation) {
  var StickersOperation = function StickersOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      sticker: { type: "string", required: true },
      position: { type: "vector2", "default": new Vector2(0, 0) },
      size: { type: "vector2" }
    };

    /**
     * The texture index used for the sticker
     * @type {Number}
     * @private
     */
    this._textureIndex = 1;

    /**
     * The fragment shader used for this operation
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform sampler2D u_stickerImage;\n      uniform vec2 u_position;\n      uniform vec2 u_size;\n\n      void main() {\n        vec4 color0 = texture2D(u_image, v_texCoord);\n        vec2 relative = (v_texCoord - u_position) / u_size;\n\n        if (relative.x >= 0.0 && relative.x <= 1.0 &&\n          relative.y >= 0.0 && relative.y <= 1.0) {\n\n            vec4 color1 = texture2D(u_stickerImage, relative);\n            gl_FragColor = vec4(mix(color0.rgb, color1.rgb, color1.a), 1.0);\n\n        } else {\n\n          gl_FragColor = color0;\n\n        }\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(StickersOperation, Operation);

  StickersOperation.prototype.render = function (renderer) {
    var self = this;
    return this._loadSticker().then(function (image) {
      if (renderer.identifier === "webgl") {
        /* istanbul ignore next */
        return self._renderWebGL(renderer, image);
      } else {
        return self._renderCanvas(renderer, image);
      }
    });
  };

  StickersOperation.prototype._renderWebGL = function (renderer, image) {
    var canvas = renderer.getCanvas();
    var gl = renderer.getContext();

    var position = this._options.position.clone();
    var canvasSize = new Vector2(canvas.width, canvas.height);

    if (this._options.numberFormat === "absolute") {
      position.divide(canvasSize);
    }

    var size = new Vector2(image.width, image.height);
    if (typeof this._options.size !== "undefined") {
      size.copy(this._options.size);

      if (this._options.numberFormat === "relative") {
        size.multiply(canvasSize);
      }
    }
    size.divide(canvasSize);

    position.y = 1 - position.y; // Invert y
    position.y -= size.y; // Fix y

    // Upload the texture
    gl.activeTexture(gl.TEXTURE0 + this._textureIndex);
    this._texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.activeTexture(gl.TEXTURE0);

    // Execute the shader
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_stickerImage: { type: "i", value: this._textureIndex },
        u_position: { type: "2f", value: [position.x, position.y] },
        u_size: { type: "2f", value: [size.x, size.y] }
      }
    });
  };

  StickersOperation.prototype._renderCanvas = function (renderer, image) {
    var canvas = renderer.getCanvas();
    var context = renderer.getContext();

    var canvasSize = new Vector2(canvas.width, canvas.height);
    var scaledPosition = this._options.position.clone();

    if (this._options.numberFormat === "relative") {
      scaledPosition.multiply(canvasSize);
    }

    var size = new Vector2(image.width, image.height);
    if (typeof this._options.size !== "undefined") {
      size.copy(this._options.size);

      if (this._options.numberFormat === "relative") {
        size.multiply(canvasSize);
      }
    }

    context.drawImage(image, 0, 0, image.width, image.height, scaledPosition.x, scaledPosition.y, size.x, size.y);
  };

  StickersOperation.prototype._loadSticker = function () {
    var isBrowser = typeof window !== "undefined";
    var stickerFileName = "stickers/sticker-" + this._options.sticker + ".png";
    if (isBrowser) {
      return this._loadImageBrowser(stickerFileName);
    } else {
      return this._loadImageNode(stickerFileName);
    }
  };

  StickersOperation.prototype._loadImageBrowser = function (fileName) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var image = new Image();

      image.addEventListener("load", function () {
        resolve(image);
      });
      image.addEventListener("error", function () {
        reject(new Error("Could not load sticker: " + fileName));
      });

      image.src = self._kit.getAssetPath(fileName);
    });
  };

  StickersOperation.prototype._loadImageNode = function (fileName) {
    var Canvas = require("canvas");
    

    var self = this;
    var image = new Canvas.Image();
    var path = self._kit.getAssetPath(fileName);

    return bluebird.promisify(fs.readFile)(path).then(function (buffer) {
      image.src = buffer;
      return image;
    });
  };

  _classProps(StickersOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "stickers";
      }
    }
  });

  return StickersOperation;
})(Operation);

exports["default"] = StickersOperation;

},{"../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","../lib/utils":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/utils.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js","bluebird":"bluebird","canvas":"canvas"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/text-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Vector2 = require("../lib/math/vector2")["default"];
var Color = require("../lib/color")["default"];


/**
 * An operation that can draw text on the canvas
 *
 * @class
 * @alias ImglyKit.Operations.TextOperation
 * @extends ImglyKit.Operation
 */
var TextOperation = (function (Operation) {
  var TextOperation = function TextOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      fontSize: { type: "number", "default": 30 },
      lineHeight: { type: "number", "default": 1.1 },
      fontFamily: { type: "string", "default": "Times New Roman" },
      fontWeight: { type: "string", "default": "normal" },
      alignment: { type: "string", "default": "left", available: ["left", "center", "right"] },
      verticalAlignment: { type: "string", "default": "top", available: ["top", "center", "bottom"] },
      color: { type: "color", "default": new Color(0, 0, 0, 1) },
      position: { type: "vector2", "default": new Vector2(0, 0) },
      text: { type: "string", required: true }
    };

    /**
     * The texture index used for the text
     * @type {Number}
     * @private
     */
    this._textureIndex = 1;

    /**
     * The fragment shader used for this operation
     */
    this._fragmentShader = "\n      precision mediump float;\n      varying vec2 v_texCoord;\n      uniform sampler2D u_image;\n      uniform sampler2D u_textImage;\n      uniform vec2 u_position;\n      uniform vec2 u_size;\n\n      void main() {\n        vec4 color0 = texture2D(u_image, v_texCoord);\n        vec2 relative = (v_texCoord - u_position) / u_size;\n\n        if (relative.x >= 0.0 && relative.x <= 1.0 &&\n          relative.y >= 0.0 && relative.y <= 1.0) {\n\n            vec4 color1 = texture2D(u_textImage, relative);\n            gl_FragColor = vec4(mix(color0.rgb, color1.rgb, color1.a), 1.0);\n\n        } else {\n\n          gl_FragColor = color0;\n\n        }\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(TextOperation, Operation);

  TextOperation.prototype._renderWebGL = function (renderer) {
    var textCanvas = this._renderTextCanvas(renderer);

    var canvas = renderer.getCanvas();
    var gl = renderer.getContext();

    var position = this._options.position.clone();
    var canvasSize = new Vector2(canvas.width, canvas.height);
    var size = new Vector2(textCanvas.width, textCanvas.height).divide(canvasSize);

    if (this._options.numberFormat === "absolute") {
      position.divide(canvasSize);
    }

    position.y = 1 - position.y; // Invert y
    position.y -= size.y; // Fix y

    // Adjust vertical alignment
    if (this._options.verticalAlignment === "center") {
      position.y += size.y / 2;
    } else if (this._options.verticalAlignment === "bottom") {
      position.y += size.y;
    }

    // Adjust horizontal alignment
    if (this._options.alignment === "center") {
      position.x -= size.x / 2;
    } else if (this._options.alignment === "right") {
      position.x -= size.x;
    }

    // Upload the texture
    gl.activeTexture(gl.TEXTURE0 + this._textureIndex);
    this._texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.activeTexture(gl.TEXTURE0);

    // Execute the shader
    renderer.runShader(null, this._fragmentShader, {
      uniforms: {
        u_textImage: { type: "i", value: this._textureIndex },
        u_position: { type: "2f", value: [position.x, position.y] },
        u_size: { type: "2f", value: [size.x, size.y] }
      }
    });
  };

  TextOperation.prototype._renderCanvas = function (renderer) {
    var textCanvas = this._renderTextCanvas(renderer);

    var canvas = renderer.getCanvas();
    var context = renderer.getContext();

    var canvasSize = new Vector2(canvas.width, canvas.height);
    var scaledPosition = this._options.position.clone();

    if (this._options.numberFormat === "relative") {
      scaledPosition.multiply(canvasSize);
    }

    // Adjust vertical alignment
    if (this._options.verticalAlignment === "center") {
      scaledPosition.y -= textCanvas.height / 2;
    } else if (this._options.verticalAlignment === "bottom") {
      scaledPosition.y -= textCanvas.height;
    }

    // Adjust horizontal alignment
    if (this._options.alignment === "center") {
      scaledPosition.x -= textCanvas.width / 2;
    } else if (this._options.alignment === "right") {
      scaledPosition.x -= textCanvas.width;
    }

    context.drawImage(textCanvas, scaledPosition.x, scaledPosition.y);
  };

  TextOperation.prototype._renderTextCanvas = function (renderer) {
    var line, lineNum;
    var canvas = renderer.createCanvas();
    var context = canvas.getContext("2d");
    var maxWidth = this._options.maxWidth;
    var actualLineHeight = this._options.lineHeight * this._options.fontSize;

    // Apply text options
    this._applyTextOptions(context);

    var boundingBox = new Vector2();

    var lines = this._options.text.split("\n");
    if (typeof maxWidth !== "undefined") {
      // Calculate the bounding box
      boundingBox.x = this._options.maxWidth;
      lines = this._buildOutputLines(context, maxWidth);
    } else {
      for (lineNum = 0; lineNum < lines.length; lineNum++) {
        line = lines[lineNum];
        boundingBox.x = Math.max(boundingBox.x, context.measureText(line).width);
      }
    }

    // Calculate boundingbox height
    boundingBox.y = actualLineHeight * lines.length;

    // Resize the canvas
    canvas.width = boundingBox.x;
    canvas.height = boundingBox.y;

    // Get the context again, apply text options
    context = canvas.getContext("2d");
    this._applyTextOptions(context);

    // Draw lines
    for (lineNum = 0; lineNum < lines.length; lineNum++) {
      line = lines[lineNum];
      this._drawText(context, line, actualLineHeight * lineNum);
    }

    return canvas;
  };

  TextOperation.prototype._applyTextOptions = function (context) {
    context.font = this._options.fontWeight + " " + this._options.fontSize + "px " + this._options.fontFamily;
    context.textBaseline = "hanging";
    context.textAlign = this._options.alignment;
    context.fillStyle = this._options.color.toRGBA();
  };

  TextOperation.prototype._buildOutputLines = function (context, maxWidth) {
    var inputLines = this._options.text.split("\n");
    var outputLines = [];
    var currentWords = [];

    for (var lineNum = 0; lineNum < inputLines.length; lineNum++) {
      var inputLine = inputLines[lineNum];
      var lineWords = inputLine.split(" ");

      for (var wordNum = 0; wordNum < lineWords.length; wordNum++) {
        var currentWord = lineWords[wordNum];
        currentWords.push(currentWord);
        var currentLine = currentWords.join(" ");
        var lineWidth = context.measureText(currentLine).width;

        if (lineWidth > maxWidth && currentWords.length === 1) {
          outputLines.push(currentWords[0]);
          currentWords = [];
        } else if (lineWidth > maxWidth) {
          // Remove the last word
          var lastWord = currentWords.pop();

          // Add the line, clear the words
          outputLines.push(currentWords.join(" "));
          currentWords = [];

          // Make sure to use the last word for the next line
          currentWords = [lastWord];
        } else if (wordNum === lineWords.length - 1) {
          // Add the line, clear the words
          outputLines.push(currentWords.join(" "));
          currentWords = [];
        }
      }

      // Line ended, but there's words left
      if (currentWords.length) {
        outputLines.push(currentWords.join(" "));
        currentWords = [];
      }
    }
    return outputLines;
  };

  TextOperation.prototype._drawText = function (context, text, y) {
    var canvas = context.canvas;
    if (this._options.alignment === "center") {
      context.fillText(text, canvas.width / 2, y);
    } else if (this._options.alignment === "left") {
      context.fillText(text, 0, y);
    } else if (this._options.alignment === "right") {
      context.fillText(text, canvas.width, y);
    }
  };

  _classProps(TextOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "text";
      }
    }
  });

  return TextOperation;
})(Operation);

exports["default"] = TextOperation;

},{"../lib/color":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/color.js","../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/operations/tilt-shift-operation.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Operation = require("./operation")["default"];
var Vector2 = require("../lib/math/vector2")["default"];
var StackBlur = require("../vendor/stack-blur")["default"];


/**
 * An operation that can crop out a part of the image
 *
 * @class
 * @alias ImglyKit.Operations.TiltShiftOperation
 * @extends ImglyKit.Operation
 */
var TiltShiftOperation = (function (Operation) {
  var TiltShiftOperation = function TiltShiftOperation() {
    var args = _slice.call(arguments);

    this.availableOptions = {
      start: { type: "vector2", "default": new Vector2(0, 0.5) },
      end: { type: "vector2", "default": new Vector2(1, 0.5) },
      blurRadius: { type: "number", "default": 30 },
      gradientRadius: { type: "number", "default": 50 }
    };

    /**
     * The fragment shader used for this operation
     * @internal Based on evanw's glfx.js tilt shift shader:
     *           https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
     */
    this.fragmentShader = "\n      precision mediump float;\n      uniform sampler2D u_image;\n      uniform float blurRadius;\n      uniform float gradientRadius;\n      uniform vec2 start;\n      uniform vec2 end;\n      uniform vec2 delta;\n      uniform vec2 texSize;\n      varying vec2 v_texCoord;\n\n      float random(vec3 scale, float seed) {\n        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n      }\n\n      void main() {\n          vec4 color = vec4(0.0);\n          float total = 0.0;\n\n          float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n          vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n          float radius = smoothstep(0.0, 1.0, abs(dot(v_texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;\n          for (float t = -30.0; t <= 30.0; t++) {\n              float percent = (t + offset - 0.5) / 30.0;\n              float weight = 1.0 - abs(percent);\n              vec4 sample = texture2D(u_image, v_texCoord + delta * percent * radius / texSize);\n\n              sample.rgb *= sample.a;\n\n              color += sample * weight;\n              total += weight;\n          }\n\n          gl_FragColor = color / total;\n          gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n      }\n    ";

    Operation.call.apply(Operation, [this].concat(_toArray(args)));
  };

  _extends(TiltShiftOperation, Operation);

  TiltShiftOperation.prototype._renderWebGL = function (renderer) {
    var canvas = renderer.getCanvas();
    var canvasSize = new Vector2(canvas.width, canvas.height);

    var start = this._options.start.clone();
    var end = this._options.end.clone();

    if (this._options.numberFormat === "relative") {
      start.multiply(canvasSize);
      end.multiply(canvasSize);
    }

    start.y = canvasSize.y - start.y;
    end.y = canvasSize.y - end.y;

    var delta = end.clone().subtract(start);
    var d = Math.sqrt(delta.x * delta.x + delta.y * delta.y);

    var uniforms = {
      blurRadius: { type: "f", value: this._options.blurRadius },
      gradientRadius: { type: "f", value: this._options.gradientRadius },
      start: { type: "2f", value: [start.x, start.y] },
      end: { type: "2f", value: [end.x, end.y] },
      delta: { type: "2f", value: [delta.x / d, delta.y / d] },
      texSize: { type: "2f", value: [canvas.width, canvas.height] }
    };

    renderer.runShader(null, TiltShiftOperation.fragmentShader, {
      uniforms: uniforms
    });

    uniforms.delta.value = [-delta.y / d, delta.x / d];

    renderer.runShader(null, TiltShiftOperation.fragmentShader, {
      uniforms: uniforms
    });
  };

  TiltShiftOperation.prototype._renderCanvas = function (renderer) {
    var canvas = renderer.getCanvas();

    var blurryCanvas = this._blurCanvas(renderer);
    var maskCanvas = this._createMask(renderer);

    this._applyMask(canvas, blurryCanvas, maskCanvas);
  };

  TiltShiftOperation.prototype._blurCanvas = function (renderer) {
    var newCanvas = renderer.cloneCanvas();
    var blurryContext = newCanvas.getContext("2d");
    var blurryImageData = blurryContext.getImageData(0, 0, newCanvas.width, newCanvas.height);
    StackBlur.stackBlurCanvasRGBA(blurryImageData, 0, 0, newCanvas.width, newCanvas.height, this._options.blurRadius);
    blurryContext.putImageData(blurryImageData, 0, 0);

    return newCanvas;
  };

  TiltShiftOperation.prototype._createMask = function (renderer) {
    var canvas = renderer.getCanvas();

    var canvasSize = new Vector2(canvas.width, canvas.height);
    var gradientRadius = this._options.gradientRadius;

    var maskCanvas = renderer.createCanvas(canvas.width, canvas.height);
    var maskContext = maskCanvas.getContext("2d");

    var start = this._options.start.clone();
    var end = this._options.end.clone();

    if (this._options.numberFormat === "relative") {
      start.multiply(canvasSize);
      end.multiply(canvasSize);
    }

    var rad = Math.atan((end.y - start.y) / (end.x - start.x));

    var gradientStart = start.clone();
    gradientStart.x += Math.sin(rad * Math.PI / 2) * gradientRadius;
    gradientStart.y -= Math.cos(rad * Math.PI / 2) * gradientRadius;

    var gradientEnd = start.clone();
    gradientEnd.x -= Math.sin(rad * Math.PI / 2) * gradientRadius;
    gradientEnd.y += Math.cos(rad * Math.PI / 2) * gradientRadius;

    // Build gradient
    var gradient = maskContext.createLinearGradient(gradientStart.x, gradientStart.y, gradientEnd.x, gradientEnd.y);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.5, "#FFFFFF");
    gradient.addColorStop(1, "#000000");

    // Draw gradient
    maskContext.fillStyle = gradient;
    maskContext.fillRect(0, 0, canvas.width, canvas.height);

    return maskCanvas;
  };

  TiltShiftOperation.prototype._applyMask = function (inputCanvas, blurryCanvas, maskCanvas) {
    var inputContext = inputCanvas.getContext("2d");
    var blurryContext = blurryCanvas.getContext("2d");
    var maskContext = maskCanvas.getContext("2d");

    var inputImageData = inputContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
    var pixels = inputImageData.data;
    var blurryPixels = blurryContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height).data;
    var maskPixels = maskContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height).data;

    var index, alpha;
    for (var y = 0; y < inputCanvas.height; y++) {
      for (var x = 0; x < inputCanvas.width; x++) {
        index = (y * inputCanvas.width + x) * 4;
        alpha = maskPixels[index] / 255;

        pixels[index] = alpha * pixels[index] + (1 - alpha) * blurryPixels[index];
        pixels[index + 1] = alpha * pixels[index + 1] + (1 - alpha) * blurryPixels[index + 1];
        pixels[index + 2] = alpha * pixels[index + 2] + (1 - alpha) * blurryPixels[index + 2];
      }
    }

    inputContext.putImageData(inputImageData, 0, 0);
  };

  _classProps(TiltShiftOperation, null, {
    identifier: {
      /**
       * A unique string that identifies this operation. Can be used to select
       * operations.
       * @type {String}
       */
      get: function () {
        return "tilt-shift";
      }
    }
  });

  return TiltShiftOperation;
})(Operation);

exports["default"] = TiltShiftOperation;

},{"../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","../vendor/stack-blur":"/Users/sash/development/js/imglykit-rewrite/src/js/vendor/stack-blur.js","./operation":"/Users/sash/development/js/imglykit-rewrite/src/js/operations/operation.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/canvas-renderer.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Renderer = require("./renderer")["default"];


/**
 * @class
 * @alias ImglyKit.CanvasRenderer
 * @extends {ImglyKit.Renderer}
 * @private
 */
var CanvasRenderer = (function (Renderer) {
  var CanvasRenderer = function CanvasRenderer() {
    Renderer.apply(this, arguments);
  };

  _extends(CanvasRenderer, Renderer);

  CanvasRenderer.isSupported = function () {
    var elem = this.prototype.createCanvas();
    return !!(elem.getContext && elem.getContext("2d"));
  };

  CanvasRenderer.prototype._getContext = function () {
    /* istanbul ignore next */
    return this._canvas.getContext("2d");
  };

  CanvasRenderer.prototype.drawImage = function (image) {
    this._context.drawImage(image, 0, 0);
  };

  CanvasRenderer.prototype.resizeTo = function (dimensions) {
    // Create a temporary canvas to draw to
    var newCanvas = this.createCanvas();
    newCanvas.width = dimensions.x;
    newCanvas.height = dimensions.y;
    var newContext = newCanvas.getContext("2d");

    // Draw the source canvas onto the new one
    newContext.drawImage(this._canvas, 0, 0, this._canvas.width, this._canvas.height, 0, 0, newCanvas.width, newCanvas.height);

    // Set the new canvas and context
    this.setCanvas(newCanvas);
  };

  CanvasRenderer.prototype.cloneCanvas = function () {
    var canvas = this.createCanvas();
    var context = canvas.getContext("2d");

    // Resize the canvas
    canvas.width = this._canvas.width;
    canvas.height = this._canvas.height;

    // Draw the current canvas on the new one
    context.drawImage(this._canvas, 0, 0);

    return canvas;
  };

  _classProps(CanvasRenderer, {
    identifier: {
      /**
       * A unique string that identifies this renderer
       * @type {String}
       */
      get: function () {
        return "canvas";
      }
    }
  });

  return CanvasRenderer;
})(Renderer);

exports["default"] = CanvasRenderer;

},{"./renderer":"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/renderer.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/renderer.js":[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/*jshint unused:false */
"use strict";
var Vector2 = require("../lib/math/vector2")["default"];


/**
 * @class
 * @alias ImglyKit.Renderer
 * @param {Vector2} dimensions
 * @private
 */
var Renderer = (function () {
  var Renderer = function Renderer(dimensions) {
    /**
     * @type {Canvas}
     * @private
     */
    this._canvas = this.createCanvas();

    this.setSize(dimensions);

    /**
     * @type {RenderingContext}
     * @private
     */
    this._context = this._getContext();
  };

  Renderer.isSupported = function () {
    /* istanbul ignore next */
    throw new Error("Renderer#isSupported is abstract and not implemented in inherited class.");
  };

  Renderer.prototype.createCanvas = function (width, height) {
    var isBrowser = typeof window !== "undefined";
    var canvas;
    if (isBrowser) {
      /* istanbul ignore next */
      canvas = document.createElement("canvas");
    } else {
      var Canvas = require("canvas");
      canvas = new Canvas();
    }

    // Apply width
    if (typeof width !== "undefined") {
      canvas.width = width;
    }

    // Apply height
    if (typeof height !== "undefined") {
      canvas.height = height;
    }

    return canvas;
  };

  Renderer.prototype.getSize = function () {
    return new Vector2(this._canvas.width, this._canvas.height);
  };

  Renderer.prototype.setSize = function (dimensions) {
    this._canvas.width = dimensions.x;
    this._canvas.height = dimensions.y;
  };

  Renderer.prototype._getContext = function () {
    /* istanbul ignore next */
    throw new Error("Renderer#_getContext is abstract and not implemented in inherited class.");
  };

  Renderer.prototype.resizeTo = function (dimensions) {
    /* istanbul ignore next */
    throw new Error("Renderer#resizeTo is abstract and not implemented in inherited class.");
  };

  Renderer.prototype.drawImage = function (image) {
    /* istanbul ignore next */
    throw new Error("Renderer#drawImage is abstract and not implemented in inherited class.");
  };

  Renderer.prototype.renderFinal = function () {};

  Renderer.prototype.getCanvas = function () {
    return this._canvas;
  };

  Renderer.prototype.getContext = function () {
    return this._context;
  };

  Renderer.prototype.setCanvas = function (canvas) {
    this._canvas = canvas;
    this._context = this._getContext();
  };

  Renderer.prototype.setContext = function (context) {
    this._context = context;
  };

  _classProps(Renderer, null, {
    identifier: {
      /**
       * A unique string that identifies this renderer
       * @type {String}
       */
      get: function () {
        return null;
      }
    }
  });

  return Renderer;
})();

exports["default"] = Renderer;

},{"../lib/math/vector2":"/Users/sash/development/js/imglykit-rewrite/src/js/lib/math/vector2.js","canvas":"canvas"}],"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/webgl-renderer.js":[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

"use strict";
var Renderer = require("./renderer")["default"];


/**
 * @class
 * @alias ImglyKit.WebGLRenderer
 * @extends {ImglyKit.Renderer}
 * @private
 */
var WebGLRenderer = (function (Renderer) {
  var WebGLRenderer = function WebGLRenderer() {
    var args = _slice.call(arguments);

    Renderer.call.apply(Renderer, [this].concat(_toArray(args)));

    this._defaultProgram = this.setupGLSLProgram();
    this._lastTexture = null;
    this._textures = [];
    this._framebuffers = [];
    this._bufferIndex = 0;
    this._inputTexture = null;

    this._createFramebuffers();
  };

  _extends(WebGLRenderer, Renderer);

  WebGLRenderer.isSupported = function () {
    return !!(typeof window !== "undefined" && window.WebGLRenderingContext);
  };

  WebGLRenderer.prototype._getContext = function () {
    /* istanbul ignore next */
    return this._canvas.getContext("webgl") || this._canvas.getContext("webgl-experimental");
  };

  WebGLRenderer.prototype.drawImage = function (image) {
    var gl = this._context;
    gl.useProgram(this._defaultProgram);

    // Create the texture
    var texture = this.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    this._inputTexture = texture;
    this.setLastTexture(texture);

    // Upload the image into the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  WebGLRenderer.prototype.runShader = function (vertexShader, fragmentShader, options) {
    if (typeof options === "undefined") options = {};
    if (typeof options.uniforms === "undefined") options.uniforms = {};

    var gl = this._context;
    var program = this.setupGLSLProgram(vertexShader, fragmentShader);
    gl.useProgram(program);

    var fbo = this.getCurrentFramebuffer();
    var texture = this.getCurrentTexture();

    // Select the current framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    // Make sure we select the current texture
    gl.bindTexture(gl.TEXTURE_2D, this._lastTexture);

    // Set the uniforms
    for (var name in options.uniforms) {
      var location = gl.getUniformLocation(program, name);
      var uniform = options.uniforms[name];

      switch (uniform.type) {
        case "i":
        case "1i":
          gl.uniform1i(location, uniform.value);
          break;
        case "f":
        case "1f":
          gl.uniform1f(location, uniform.value);
          break;
        case "2f":
          gl.uniform2f(location, uniform.value[0], uniform.value[1]);
          break;
        case "3f":
          gl.uniform3f(location, uniform.value[0], uniform.value[1], uniform.value[2]);
          break;
        case "4f":
          gl.uniform4f(location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
          break;
        case "2fv":
          gl.uniform2fv(location, uniform.value);
          break;
        case "mat3fv":
          gl.uniformMatrix3fv(location, false, uniform.value);
          break;
        default:
          throw new Error("Unknown uniform type: " + uniform.type);
          break;
      }
    }

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.setLastTexture(texture);
    this.selectNextBuffer();
  };

  WebGLRenderer.prototype.renderFinal = function () {
    var gl = this._context;
    var program = this._defaultProgram;
    gl.useProgram(program);

    // Don't draw to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Make sure the viewport size is correct
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    // Select the last texture that has been rendered to
    gl.bindTexture(gl.TEXTURE_2D, this._lastTexture);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  WebGLRenderer.prototype.setupGLSLProgram = function (vertexShader, fragmentShader) {
    var gl = this._context;
    var shaders = [];

    // Use default vertex shader
    vertexShader = this._createShader(gl.VERTEX_SHADER, vertexShader || WebGLRenderer.prototype.defaultVertexShader);
    shaders.push(vertexShader);

    // Use default fragment shader
    fragmentShader = this._createShader(gl.FRAGMENT_SHADER, fragmentShader || WebGLRenderer.prototype.defaultFragmentShader);
    shaders.push(fragmentShader);

    // Create the program
    var program = gl.createProgram();

    // Attach the shaders
    for (var i = 0; i < shaders.length; i++) {
      gl.attachShader(program, shaders[i]);
    }

    // Link the program
    gl.linkProgram(program);

    // Check linking status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var lastError = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error("WebGL program linking error: " + lastError);
    }

    // Lookup texture coordinates location
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Provide texture coordinates
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // First triangle
    0, 0, 1, 0, 0, 1,

    // Second triangle
    0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a buffer for the rectangle positions
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // First triangle
    -1, -1, 1, -1, -1, 1,

    // Second triangle
    -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    return program;
  };

  WebGLRenderer.prototype._createShader = function (shaderType, shaderSource) {
    var gl = this._context;

    // Create the shader and compile it
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // Check compilation status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var lastError = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("WebGL shader compilation error: " + lastError);
    }

    return shader;
  };

  WebGLRenderer.prototype.createTexture = function () {
    var gl = this._context;
    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  };

  WebGLRenderer.prototype._createFramebuffers = function () {
    var gl = this._context;

    for (var i = 0; i < 2; i++) {
      // Create texture
      var texture = this.createTexture();
      this._textures.push(texture);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._canvas.width, this._canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      // Create framebuffer
      var fbo = gl.createFramebuffer();
      this._framebuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      // Attach the texture
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
  };

  WebGLRenderer.prototype.resizeTo = function (dimensions) {
    var gl = this._context;

    // Resize the canvas
    this._canvas.width = dimensions.x;
    this._canvas.height = dimensions.y;

    // Update the viewport dimensions
    gl.viewport(0, 0, this._canvas.width, this._canvas.height);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  WebGLRenderer.prototype.getCurrentFramebuffer = function () {
    return this._framebuffers[this._bufferIndex % 2];
  };

  WebGLRenderer.prototype.getCurrentTexture = function () {
    return this._textures[this._bufferIndex % 2];
  };

  WebGLRenderer.prototype.selectNextBuffer = function () {
    this._bufferIndex++;
  };

  WebGLRenderer.prototype.getDefaultProgram = function () {
    return this._defaultProgram;
  };

  WebGLRenderer.prototype.getLastTexture = function () {
    return this._lastTexture;
  };

  WebGLRenderer.prototype.getTextures = function () {
    return this._textures;
  };

  WebGLRenderer.prototype.setLastTexture = function (texture) {
    this._lastTexture = texture;
  };

  _classProps(WebGLRenderer, null, {
    identifier: {
      /**
       * A unique string that identifies this renderer
       * @type {String}
       */
      get: function () {
        return "webgl";
      }
    },
    defaultVertexShader: {
      /**
       * The default vertex shader which just passes the texCoord to the
       * fragment shader.
       * @type {String}
       * @private
       */
      get: function () {
        var shader = "\n      attribute vec2 a_position;\n      attribute vec2 a_texCoord;\n      varying vec2 v_texCoord;\n\n      void main() {\n        gl_Position = vec4(a_position, 0, 1);\n        v_texCoord = a_texCoord;\n      }\n    ";
        return shader;
      }
    },
    defaultFragmentShader: {
      /**
       * The default fragment shader which will just look up the colors from the
       * texture.
       * @type {String}
       * @private
       */
      get: function () {
        var shader = "\n      precision mediump float;\n      uniform sampler2D u_image;\n      varying vec2 v_texCoord;\n\n      void main() {\n        gl_FragColor = texture2D(u_image, v_texCoord);\n      }\n    ";
        return shader;
      }
    }
  });

  return WebGLRenderer;
})(Renderer);

exports["default"] = WebGLRenderer;

},{"./renderer":"/Users/sash/development/js/imglykit-rewrite/src/js/renderers/renderer.js"}],"/Users/sash/development/js/imglykit-rewrite/src/js/vendor/stack-blur.js":[function(require,module,exports){
"use strict";
/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version:  0.5
Author:   Mario Klingemann
Contact:  mario@quasimondo.com
Website:  http://www.quasimondo.com/StackBlurForCanvas
Twitter:  @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];


var shg_table = [
       9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
    17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function stackBlurCanvasRGBA( imageData, top_x, top_y, width, height, radius )
{
  if ( isNaN(radius) || radius < 1 ) return;
  radius |= 0;

  var pixels = imageData.data;

  var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
  r_out_sum, g_out_sum, b_out_sum, a_out_sum,
  r_in_sum, g_in_sum, b_in_sum, a_in_sum,
  pr, pg, pb, pa, rbs;

  var div = radius + radius + 1;
  var widthMinus1  = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1  = radius + 1;
  var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

  var stackStart = new BlurStack();
  var stackEnd;
  var stack = stackStart;
  for ( i = 1; i < div; i++ )
  {
    stack = stack.next = new BlurStack();
    if ( i == radiusPlus1 ) stackEnd = stack;
  }
  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;

  yw = yi = 0;

  var mul_sum = mul_table[radius];
  var shg_sum = shg_table[radius];

  for ( y = 0; y < height; y++ )
  {
    r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

    r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
    a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ )
    {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    for( i = 1; i < radiusPlus1; i++ )
    {
      p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
      r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
      a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;

      stack = stack.next;
    }


    stackIn = stackStart;
    stackOut = stackEnd;
    for ( x = 0; x < width; x++ )
    {
      pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
      if ( pa !== 0 )
      {
        pa = 255 / pa;
        pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
        pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
        pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
      } else {
        pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
      }

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;

      p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

      r_in_sum += ( stackIn.r = pixels[p]);
      g_in_sum += ( stackIn.g = pixels[p+1]);
      b_in_sum += ( stackIn.b = pixels[p+2]);
      a_in_sum += ( stackIn.a = pixels[p+3]);

      r_sum += r_in_sum;
      g_sum += g_in_sum;
      b_sum += b_in_sum;
      a_sum += a_in_sum;

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );
      a_out_sum += ( pa = stackOut.a );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;

      stackOut = stackOut.next;

      yi += 4;
    }
    yw += width;
  }


  for ( x = 0; x < width; x++ )
  {
    g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

    yi = x << 2;
    r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
    a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ )
    {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    yp = width;

    for( i = 1; i <= radius; i++ )
    {
      yi = ( yp + x ) << 2;

      r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
      a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;

      stack = stack.next;

      if( i < heightMinus1 )
      {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for ( y = 0; y < height; y++ )
    {
      p = yi << 2;
      pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
      if ( pa > 0 )
      {
        pa = 255 / pa;
        pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
        pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
        pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
      } else {
        pixels[p] = pixels[p+1] = pixels[p+2] = 0;
      }

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;

      p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

      r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
      g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
      b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
      a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );
      a_out_sum += ( pa = stackOut.a );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;

      stackOut = stackOut.next;

      yi += width;
    }
  }
}

function BlurStack()
{
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
}

module.exports = {
  stackBlurCanvasRGBA: stackBlurCanvasRGBA
};

},{}],"bluebird":[function(require,module,exports){
(function (process,global){
/**
 * bluebird build version 2.3.11
 * Features enabled: core, map
 * Features disabled: race, call_get, generators, nodeify, promisify, props, reduce, settle, some, progress, cancel, using, filter, any, each, timers
*/
/**
 * @preserve The MIT License (MIT)
 *
 * Copyright (c) 2014 Petka Antonov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var schedule = _dereq_("./schedule.js");
var Queue = _dereq_("./queue.js");
var errorObj = _dereq_("./util.js").errorObj;
var tryCatch1 = _dereq_("./util.js").tryCatch1;
var _process = typeof process !== "undefined" ? process : void 0;

function Async() {
    this._isTickUsed = false;
    this._schedule = schedule;
    this._length = 0;
    this._lateBuffer = new Queue(16);
    this._functionBuffer = new Queue(65536);
    var self = this;
    this.consumeFunctionBuffer = function Async$consumeFunctionBuffer() {
        self._consumeFunctionBuffer();
    };
}

Async.prototype.haveItemsQueued = function Async$haveItemsQueued() {
    return this._length > 0;
};

Async.prototype.invokeLater = function Async$invokeLater(fn, receiver, arg) {
    if (_process !== void 0 &&
        _process.domain != null &&
        !fn.domain) {
        fn = _process.domain.bind(fn);
    }
    this._lateBuffer.push(fn, receiver, arg);
    this._queueTick();
};

Async.prototype.invoke = function Async$invoke(fn, receiver, arg) {
    if (_process !== void 0 &&
        _process.domain != null &&
        !fn.domain) {
        fn = _process.domain.bind(fn);
    }
    var functionBuffer = this._functionBuffer;
    functionBuffer.push(fn, receiver, arg);
    this._length = functionBuffer.length();
    this._queueTick();
};

Async.prototype._consumeFunctionBuffer =
function Async$_consumeFunctionBuffer() {
    var functionBuffer = this._functionBuffer;
    while (functionBuffer.length() > 0) {
        var fn = functionBuffer.shift();
        var receiver = functionBuffer.shift();
        var arg = functionBuffer.shift();
        fn.call(receiver, arg);
    }
    this._reset();
    this._consumeLateBuffer();
};

Async.prototype._consumeLateBuffer = function Async$_consumeLateBuffer() {
    var buffer = this._lateBuffer;
    while(buffer.length() > 0) {
        var fn = buffer.shift();
        var receiver = buffer.shift();
        var arg = buffer.shift();
        var res = tryCatch1(fn, receiver, arg);
        if (res === errorObj) {
            this._queueTick();
            if (fn.domain != null) {
                fn.domain.emit("error", res.e);
            } else {
                throw res.e;
            }
        }
    }
};

Async.prototype._queueTick = function Async$_queue() {
    if (!this._isTickUsed) {
        this._schedule(this.consumeFunctionBuffer);
        this._isTickUsed = true;
    }
};

Async.prototype._reset = function Async$_reset() {
    this._isTickUsed = false;
    this._length = 0;
};

module.exports = new Async();

},{"./queue.js":15,"./schedule.js":16,"./util.js":19}],2:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var Promise = _dereq_("./promise.js")();
module.exports = Promise;
},{"./promise.js":12}],3:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function() {
var inherits = _dereq_("./util.js").inherits;
var defineProperty = _dereq_("./es5.js").defineProperty;

var rignore = new RegExp(
    "\\b(?:[a-zA-Z0-9.]+\\$_\\w+|" +
    "tryCatch(?:1|2|3|4|Apply)|new \\w*PromiseArray|" +
    "\\w*PromiseArray\\.\\w*PromiseArray|" +
    "setTimeout|CatchFilter\\$_\\w+|makeNodePromisified|processImmediate|" +
    "process._tickCallback|nextTick|Async\\$\\w+)\\b"
);

var rtraceline = null;
var formatStack = null;

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj.toString();
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function CapturedTrace(ignoreUntil, isTopLevel) {
    this.captureStackTrace(CapturedTrace, isTopLevel);

}
inherits(CapturedTrace, Error);

CapturedTrace.prototype.captureStackTrace =
function CapturedTrace$captureStackTrace(ignoreUntil, isTopLevel) {
    captureStackTrace(this, ignoreUntil, isTopLevel);
};

CapturedTrace.possiblyUnhandledRejection =
function CapturedTrace$PossiblyUnhandledRejection(reason) {
    if (typeof console === "object") {
        var message;
        if (typeof reason === "object" || typeof reason === "function") {
            var stack = reason.stack;
            message = "Possibly unhandled " + formatStack(stack, reason);
        } else {
            message = "Possibly unhandled " + String(reason);
        }
        if (typeof console.error === "function" ||
            typeof console.error === "object") {
            console.error(message);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
};

CapturedTrace.combine = function CapturedTrace$Combine(current, prev) {
    var currentLastIndex = current.length - 1;
    var currentLastLine = current[currentLastIndex];
    var commonRootMeetPoint = -1;
    for (var i = prev.length - 1; i >= 0; --i) {
        if (prev[i] === currentLastLine) {
            commonRootMeetPoint = i;
            break;
        }
    }

    for (var i = commonRootMeetPoint; i >= 0; --i) {
        var line = prev[i];
        if (current[currentLastIndex] === line) {
            current.pop();
            currentLastIndex--;
        } else {
            break;
        }
    }

    current.push("From previous event:");
    var lines = current.concat(prev);

    var ret = [];

    for (var i = 0, len = lines.length; i < len; ++i) {

        if (((rignore.test(lines[i]) && rtraceline.test(lines[i])) ||
            (i > 0 && !rtraceline.test(lines[i])) &&
            lines[i] !== "From previous event:")
       ) {
            continue;
        }
        ret.push(lines[i]);
    }
    return ret;
};

CapturedTrace.protectErrorMessageNewlines = function(stack) {
    for (var i = 0; i < stack.length; ++i) {
        if (rtraceline.test(stack[i])) {
            break;
        }
    }

    if (i <= 1) return;

    var errorMessageLines = [];
    for (var j = 0; j < i; ++j) {
        errorMessageLines.push(stack.shift());
    }
    stack.unshift(errorMessageLines.join("\u0002\u0000\u0001"));
};

CapturedTrace.isSupported = function CapturedTrace$IsSupported() {
    return typeof captureStackTrace === "function";
};

var captureStackTrace = (function stackDetection() {
    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        rtraceline = /^\s*at\s*/;
        formatStack = function(stack, error) {
            if (typeof stack === "string") return stack;

            if (error.name !== void 0 &&
                error.message !== void 0) {
                return error.name + ". " + error.message;
            }
            return formatNonError(error);


        };
        var captureStackTrace = Error.captureStackTrace;
        return function CapturedTrace$_captureStackTrace(
            receiver, ignoreUntil) {
            captureStackTrace(receiver, ignoreUntil);
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        typeof "".startsWith === "function" &&
        (err.stack.startsWith("stackDetection@")) &&
        stackDetection.name === "stackDetection") {

        defineProperty(Error, "stackTraceLimit", {
            writable: true,
            enumerable: false,
            configurable: false,
            value: 25
        });
        rtraceline = /@/;
        var rline = /[@\n]/;

        formatStack = function(stack, error) {
            if (typeof stack === "string") {
                return (error.name + ". " + error.message + "\n" + stack);
            }

            if (error.name !== void 0 &&
                error.message !== void 0) {
                return error.name + ". " + error.message;
            }
            return formatNonError(error);
        };

        return function captureStackTrace(o) {
            var stack = new Error().stack;
            var split = stack.split(rline);
            var len = split.length;
            var ret = "";
            for (var i = 0; i < len; i += 2) {
                ret += split[i];
                ret += "@";
                ret += split[i + 1];
                ret += "\n";
            }
            o.stack = ret;
        };
    } else {
        formatStack = function(stack, error) {
            if (typeof stack === "string") return stack;

            if ((typeof error === "object" ||
                typeof error === "function") &&
                error.name !== void 0 &&
                error.message !== void 0) {
                return error.name + ". " + error.message;
            }
            return formatNonError(error);
        };

        return null;
    }
})();

return CapturedTrace;
};

},{"./es5.js":8,"./util.js":19}],4:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(NEXT_FILTER) {
var util = _dereq_("./util.js");
var errors = _dereq_("./errors.js");
var tryCatch1 = util.tryCatch1;
var errorObj = util.errorObj;
var keys = _dereq_("./es5.js").keys;
var TypeError = errors.TypeError;

function CatchFilter(instances, callback, promise) {
    this._instances = instances;
    this._callback = callback;
    this._promise = promise;
}

function CatchFilter$_safePredicate(predicate, e) {
    var safeObject = {};
    var retfilter = tryCatch1(predicate, safeObject, e);

    if (retfilter === errorObj) return retfilter;

    var safeKeys = keys(safeObject);
    if (safeKeys.length) {
        errorObj.e = new TypeError(
            "Catch filter must inherit from Error "
          + "or be a simple predicate function");
        return errorObj;
    }
    return retfilter;
}

CatchFilter.prototype.doFilter = function CatchFilter$_doFilter(e) {
    var cb = this._callback;
    var promise = this._promise;
    var boundTo = promise._boundTo;
    for (var i = 0, len = this._instances.length; i < len; ++i) {
        var item = this._instances[i];
        var itemIsErrorType = item === Error ||
            (item != null && item.prototype instanceof Error);

        if (itemIsErrorType && e instanceof item) {
            var ret = tryCatch1(cb, boundTo, e);
            if (ret === errorObj) {
                NEXT_FILTER.e = ret.e;
                return NEXT_FILTER;
            }
            return ret;
        } else if (typeof item === "function" && !itemIsErrorType) {
            var shouldHandle = CatchFilter$_safePredicate(item, e);
            if (shouldHandle === errorObj) {
                var trace = errors.canAttach(errorObj.e)
                    ? errorObj.e
                    : new Error(errorObj.e + "");
                this._promise._attachExtraTrace(trace);
                e = errorObj.e;
                break;
            } else if (shouldHandle) {
                var ret = tryCatch1(cb, boundTo, e);
                if (ret === errorObj) {
                    NEXT_FILTER.e = ret.e;
                    return NEXT_FILTER;
                }
                return ret;
            }
        }
    }
    NEXT_FILTER.e = e;
    return NEXT_FILTER;
};

return CatchFilter;
};

},{"./errors.js":6,"./es5.js":8,"./util.js":19}],5:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var util = _dereq_("./util.js");
var isPrimitive = util.isPrimitive;
var wrapsPrimitiveReceiver = util.wrapsPrimitiveReceiver;

module.exports = function(Promise) {
var returner = function Promise$_returner() {
    return this;
};
var thrower = function Promise$_thrower() {
    throw this;
};

var wrapper = function Promise$_wrapper(value, action) {
    if (action === 1) {
        return function Promise$_thrower() {
            throw value;
        };
    } else if (action === 2) {
        return function Promise$_returner() {
            return value;
        };
    }
};


Promise.prototype["return"] =
Promise.prototype.thenReturn =
function Promise$thenReturn(value) {
    if (wrapsPrimitiveReceiver && isPrimitive(value)) {
        return this._then(
            wrapper(value, 2),
            void 0,
            void 0,
            void 0,
            void 0
       );
    }
    return this._then(returner, void 0, void 0, value, void 0);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow =
function Promise$thenThrow(reason) {
    if (wrapsPrimitiveReceiver && isPrimitive(reason)) {
        return this._then(
            wrapper(reason, 1),
            void 0,
            void 0,
            void 0,
            void 0
       );
    }
    return this._then(thrower, void 0, void 0, reason, void 0);
};
};

},{"./util.js":19}],6:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var Objectfreeze = _dereq_("./es5.js").freeze;
var util = _dereq_("./util.js");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof OperationalError) ||
        e["isOperational"] === true);
}

function isError(obj) {
    return obj instanceof Error;
}

function canAttach(obj) {
    return isError(obj);
}

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        this.message = typeof message === "string" ? message : defaultMessage;
        this.name = nameProperty;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

AggregateError.prototype.length = 0;
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    this.name = "OperationalError";
    this.message = message;
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        this.message = message.message;
        this.stack = message.stack;
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var key = "__BluebirdErrorTypes__";
var errorTypes = Error[key];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    notEnumerableProp(Error, key, errorTypes);
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    canAttach: canAttach
};

},{"./es5.js":8,"./util.js":19}],7:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise) {
var TypeError = _dereq_('./errors.js').TypeError;

function apiRejection(msg) {
    var error = new TypeError(msg);
    var ret = Promise.rejected(error);
    var parent = ret._peekContext();
    if (parent != null) {
        parent._attachExtraTrace(error);
    }
    return ret;
}

return apiRejection;
};

},{"./errors.js":6}],8:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
var isES5 = (function(){
    "use strict";
    return this === void 0;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        keys: Object.keys,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function ObjectKeys(o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    }

    var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
        o[key] = desc.value;
        return o;
    }

    var ObjectFreeze = function ObjectFreeze(obj) {
        return obj;
    }

    var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    }

    var ArrayIsArray = function ArrayIsArray(obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    }

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5
    };
}

},{}],9:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise, NEXT_FILTER, cast) {
var util = _dereq_("./util.js");
var wrapsPrimitiveReceiver = util.wrapsPrimitiveReceiver;
var isPrimitive = util.isPrimitive;
var thrower = util.thrower;

function returnThis() {
    return this;
}
function throwThis() {
    throw this;
}
function return$(r) {
    return function Promise$_returner() {
        return r;
    };
}
function throw$(r) {
    return function Promise$_thrower() {
        throw r;
    };
}
function promisedFinally(ret, reasonOrValue, isFulfilled) {
    var then;
    if (wrapsPrimitiveReceiver && isPrimitive(reasonOrValue)) {
        then = isFulfilled ? return$(reasonOrValue) : throw$(reasonOrValue);
    } else {
        then = isFulfilled ? returnThis : throwThis;
    }
    return ret._then(then, thrower, void 0, reasonOrValue, void 0);
}

function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    var ret = promise._isBound()
                    ? handler.call(promise._boundTo)
                    : handler();

    if (ret !== void 0) {
        var maybePromise = cast(ret, void 0);
        if (maybePromise instanceof Promise) {
            return promisedFinally(maybePromise, reasonOrValue,
                                    promise.isFulfilled());
        }
    }

    if (promise.isRejected()) {
        NEXT_FILTER.e = reasonOrValue;
        return NEXT_FILTER;
    } else {
        return reasonOrValue;
    }
}

function tapHandler(value) {
    var promise = this.promise;
    var handler = this.handler;

    var ret = promise._isBound()
                    ? handler.call(promise._boundTo, value)
                    : handler(value);

    if (ret !== void 0) {
        var maybePromise = cast(ret, void 0);
        if (maybePromise instanceof Promise) {
            return promisedFinally(maybePromise, value, true);
        }
    }
    return value;
}

Promise.prototype._passThroughHandler =
function Promise$_passThroughHandler(handler, isFinally) {
    if (typeof handler !== "function") return this.then();

    var promiseAndHandler = {
        promise: this,
        handler: handler
    };

    return this._then(
            isFinally ? finallyHandler : tapHandler,
            isFinally ? finallyHandler : void 0, void 0,
            promiseAndHandler, void 0);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function Promise$finally(handler) {
    return this._passThroughHandler(handler, true);
};

Promise.prototype.tap = function Promise$tap(handler) {
    return this._passThroughHandler(handler, false);
};
};

},{"./util.js":19}],10:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports =
function(Promise, PromiseArray, cast, INTERNAL) {
var util = _dereq_("./util.js");
var canEvaluate = util.canEvaluate;
var tryCatch1 = util.tryCatch1;
var errorObj = util.errorObj;


if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var caller = function(count) {
        var values = [];
        for (var i = 1; i <= count; ++i) values.push("holder.p" + i);
        return new Function("holder", "                                      \n\
            'use strict';                                                    \n\
            var callback = holder.fn;                                        \n\
            return callback(values);                                         \n\
            ".replace(/values/g, values.join(", ")));
    };
    var thenCallbacks = [];
    var callers = [void 0];
    for (var i = 1; i <= 5; ++i) {
        thenCallbacks.push(thenCallback(i));
        callers.push(caller(i));
    }

    var Holder = function(total, fn) {
        this.p1 = this.p2 = this.p3 = this.p4 = this.p5 = null;
        this.fn = fn;
        this.total = total;
        this.now = 0;
    };

    Holder.prototype.callers = callers;
    Holder.prototype.checkFulfillment = function(promise) {
        var now = this.now;
        now++;
        var total = this.total;
        if (now >= total) {
            var handler = this.callers[total];
            var ret = tryCatch1(handler, void 0, this);
            if (ret === errorObj) {
                promise._rejectUnchecked(ret.e);
            } else if (!promise._tryFollow(ret)) {
                promise._fulfillUnchecked(ret);
            }
        } else {
            this.now = now;
        }
    };
}

function reject(reason) {
    this._reject(reason);
}

Promise.join = function Promise$Join() {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (last < 6 && canEvaluate) {
            var ret = new Promise(INTERNAL);
            ret._setTrace(void 0);
            var holder = new Holder(last, fn);
            var callbacks = thenCallbacks;
            for (var i = 0; i < last; ++i) {
                var maybePromise = cast(arguments[i], void 0);
                if (maybePromise instanceof Promise) {
                    if (maybePromise.isPending()) {
                        maybePromise._then(callbacks[i], reject,
                                           void 0, ret, holder);
                    } else if (maybePromise.isFulfilled()) {
                        callbacks[i].call(ret,
                                          maybePromise._settledValue, holder);
                    } else {
                        ret._reject(maybePromise._settledValue);
                        maybePromise._unsetRejectionIsUnhandled();
                    }
                } else {
                    callbacks[i].call(ret, maybePromise, holder);
                }
            }
            return ret;
        }
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}
    var ret = new PromiseArray(args).promise();
    return fn !== void 0 ? ret.spread(fn) : ret;
};

};

},{"./util.js":19}],11:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise, PromiseArray, apiRejection, cast, INTERNAL) {
var util = _dereq_("./util.js");
var tryCatch3 = util.tryCatch3;
var errorObj = util.errorObj;
var PENDING = {};
var EMPTY_ARRAY = [];

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._callback = fn;
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
    this._init$(void 0, -2);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._init = function MappingPromiseArray$_init() {};

MappingPromiseArray.prototype._promiseFulfilled =
function MappingPromiseArray$_promiseFulfilled(value, index) {
    var values = this._values;
    if (values === null) return;

    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;
    if (values[index] === PENDING) {
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var callback = this._callback;
        var receiver = this._promise._boundTo;
        var ret = tryCatch3(callback, receiver, value, index, length);
        if (ret === errorObj) return this._reject(ret.e);

        var maybePromise = cast(ret, void 0);
        if (maybePromise instanceof Promise) {
            if (maybePromise.isPending()) {
                if (limit >= 1) this._inFlight++;
                values[index] = PENDING;
                return maybePromise._proxyPromiseArray(this, index);
            } else if (maybePromise.isFulfilled()) {
                ret = maybePromise.value();
            } else {
                maybePromise._unsetRejectionIsUnhandled();
                return this._reject(maybePromise.reason());
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }

    }
};

MappingPromiseArray.prototype._drainQueue =
function MappingPromiseArray$_drainQueue() {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter =
function MappingPromiseArray$_filter(booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues =
function MappingPromiseArray$preserveValues() {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    var limit = typeof options === "object" && options !== null
        ? options.concurrency
        : 0;
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter);
}

Promise.prototype.map = function Promise$map(fn, options) {
    if (typeof fn !== "function") return apiRejection("fn must be a function");

    return map(this, fn, options, null).promise();
};

Promise.map = function Promise$Map(promises, fn, options, _filter) {
    if (typeof fn !== "function") return apiRejection("fn must be a function");
    return map(promises, fn, options, _filter).promise();
};


};

},{"./util.js":19}],12:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict(bluebird) {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
module.exports = function() {
var util = _dereq_("./util.js");
var async = _dereq_("./async.js");
var errors = _dereq_("./errors.js");

var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {e: null};

var cast = _dereq_("./thenables.js")(Promise, INTERNAL);
var PromiseArray = _dereq_("./promise_array.js")(Promise, INTERNAL, cast);
var CapturedTrace = _dereq_("./captured_trace.js")();
var CatchFilter = _dereq_("./catch_filter.js")(NEXT_FILTER);
var PromiseResolver = _dereq_("./promise_resolver.js");

var isArray = util.isArray;

var errorObj = util.errorObj;
var tryCatch1 = util.tryCatch1;
var tryCatch2 = util.tryCatch2;
var tryCatchApply = util.tryCatchApply;
var RangeError = errors.RangeError;
var TypeError = errors.TypeError;
var CancellationError = errors.CancellationError;
var TimeoutError = errors.TimeoutError;
var OperationalError = errors.OperationalError;
var originatesFromRejection = errors.originatesFromRejection;
var markAsOriginatingFromRejection = errors.markAsOriginatingFromRejection;
var canAttach = errors.canAttach;
var thrower = util.thrower;
var apiRejection = _dereq_("./errors_api_rejection")(Promise);


var makeSelfResolutionError = function Promise$_makeSelfResolutionError() {
    return new TypeError("circular promise resolution chain");
};

function Promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("the promise constructor requires a resolver function");
    }
    if (this.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly");
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = void 0;
    this._rejectionHandler0 = void 0;
    this._promise0 = void 0;
    this._receiver0 = void 0;
    this._settledValue = void 0;
    this._boundTo = void 0;
    if (resolver !== INTERNAL) this._resolveFromResolver(resolver);
}

function returnFirstElement(elements) {
    return elements[0];
}

Promise.prototype.bind = function Promise$bind(thisArg) {
    var maybePromise = cast(thisArg, void 0);
    var ret = new Promise(INTERNAL);
    if (maybePromise instanceof Promise) {
        var binder = maybePromise.then(function(thisArg) {
            ret._setBoundTo(thisArg);
        });
        var p = Promise.all([this, binder]).then(returnFirstElement);
        ret._follow(p);
    } else {
        ret._follow(this);
        ret._setBoundTo(thisArg);
    }
    ret._propagateFrom(this, 2 | 1);
    return ret;
};

Promise.prototype.toString = function Promise$toString() {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] =
function Promise$catch(fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (typeof item === "function") {
                catchInstances[j++] = item;
            } else {
                var catchFilterTypeError =
                    new TypeError(
                        "A catch filter must be an error constructor "
                        + "or a filter function");

                this._attachExtraTrace(catchFilterTypeError);
                return Promise.reject(catchFilterTypeError);
            }
        }
        catchInstances.length = j;
        fn = arguments[i];

        this._resetTrace();
        var catchFilter = new CatchFilter(catchInstances, fn, this);
        return this._then(void 0, catchFilter.doFilter, void 0,
            catchFilter, void 0);
    }
    return this._then(void 0, fn, void 0, void 0, void 0);
};

function reflect() {
    return new Promise.PromiseInspection(this);
}

Promise.prototype.reflect = function Promise$reflect() {
    return this._then(reflect, reflect, void 0, this, void 0);
};

Promise.prototype.then =
function Promise$then(didFulfill, didReject, didProgress) {
    return this._then(didFulfill, didReject, didProgress,
        void 0, void 0);
};


Promise.prototype.done =
function Promise$done(didFulfill, didReject, didProgress) {
    var promise = this._then(didFulfill, didReject, didProgress,
        void 0, void 0);
    promise._setIsFinal();
};

Promise.prototype.spread = function Promise$spread(didFulfill, didReject) {
    return this._then(didFulfill, didReject, void 0,
        APPLY, void 0);
};

Promise.prototype.isCancellable = function Promise$isCancellable() {
    return !this.isResolved() &&
        this._cancellable();
};

Promise.prototype.toJSON = function Promise$toJSON() {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: void 0,
        rejectionReason: void 0
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this._settledValue;
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this._settledValue;
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function Promise$all() {
    return new PromiseArray(this).promise();
};


Promise.is = function Promise$Is(val) {
    return val instanceof Promise;
};

Promise.all = function Promise$All(promises) {
    return new PromiseArray(promises).promise();
};

Promise.prototype.error = function Promise$_error(fn) {
    return this.caught(originatesFromRejection, fn);
};

Promise.prototype._resolveFromSyncValue =
function Promise$_resolveFromSyncValue(value) {
    if (value === errorObj) {
        this._cleanValues();
        this._setRejected();
        var reason = value.e;
        this._settledValue = reason;
        this._tryAttachExtraTrace(reason);
        this._ensurePossibleRejectionHandled();
    } else {
        var maybePromise = cast(value, void 0);
        if (maybePromise instanceof Promise) {
            this._follow(maybePromise);
        } else {
            this._cleanValues();
            this._setFulfilled();
            this._settledValue = value;
        }
    }
};

Promise.method = function Promise$_Method(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("fn must be a function");
    }
    return function Promise$_method() {
        var value;
        switch(arguments.length) {
        case 0: value = tryCatch1(fn, this, void 0); break;
        case 1: value = tryCatch1(fn, this, arguments[0]); break;
        case 2: value = tryCatch2(fn, this, arguments[0], arguments[1]); break;
        default:
            var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}
            value = tryCatchApply(fn, args, this); break;
        }
        var ret = new Promise(INTERNAL);
        ret._setTrace(void 0);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function Promise$_Try(fn, args, ctx) {
    if (typeof fn !== "function") {
        return apiRejection("fn must be a function");
    }
    var value = isArray(args)
        ? tryCatchApply(fn, args, ctx)
        : tryCatch1(fn, ctx, args);

    var ret = new Promise(INTERNAL);
    ret._setTrace(void 0);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.defer = Promise.pending = function Promise$Defer() {
    var promise = new Promise(INTERNAL);
    promise._setTrace(void 0);
    return new PromiseResolver(promise);
};

Promise.bind = function Promise$Bind(thisArg) {
    var maybePromise = cast(thisArg, void 0);
    var ret = new Promise(INTERNAL);
    ret._setTrace(void 0);

    if (maybePromise instanceof Promise) {
        var p = maybePromise.then(function(thisArg) {
            ret._setBoundTo(thisArg);
        });
        ret._follow(p);
    } else {
        ret._setBoundTo(thisArg);
        ret._setFulfilled();
    }
    return ret;
};

Promise.cast = function Promise$_Cast(obj) {
    var ret = cast(obj, void 0);
    if (!(ret instanceof Promise)) {
        var val = ret;
        ret = new Promise(INTERNAL);
        ret._setTrace(void 0);
        ret._setFulfilled();
        ret._cleanValues();
        ret._settledValue = val;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function Promise$Reject(reason) {
    var ret = new Promise(INTERNAL);
    ret._setTrace(void 0);
    markAsOriginatingFromRejection(reason);
    ret._cleanValues();
    ret._setRejected();
    ret._settledValue = reason;
    if (!canAttach(reason)) {
        var trace = new Error(reason + "");
        ret._setCarriedStackTrace(trace);
    }
    ret._ensurePossibleRejectionHandled();
    return ret;
};

Promise.onPossiblyUnhandledRejection =
function Promise$OnPossiblyUnhandledRejection(fn) {
        CapturedTrace.possiblyUnhandledRejection = typeof fn === "function"
                                                    ? fn : void 0;
};

var unhandledRejectionHandled;
Promise.onUnhandledRejectionHandled =
function Promise$onUnhandledRejectionHandled(fn) {
    unhandledRejectionHandled = typeof fn === "function" ? fn : void 0;
};

var debugging = false || !!(
    typeof process !== "undefined" &&
    typeof process.execPath === "string" &&
    typeof process.env === "object" &&
    (process.env["BLUEBIRD_DEBUG"] ||
        process.env["NODE_ENV"] === "development")
);


Promise.longStackTraces = function Promise$LongStackTraces() {
    if (async.haveItemsQueued() &&
        debugging === false
   ) {
        throw new Error("cannot enable long stack traces after promises have been created");
    }
    debugging = CapturedTrace.isSupported();
};

Promise.hasLongStackTraces = function Promise$HasLongStackTraces() {
    return debugging && CapturedTrace.isSupported();
};

Promise.prototype._then =
function Promise$_then(
    didFulfill,
    didReject,
    didProgress,
    receiver,
    internalData
) {
    var haveInternalData = internalData !== void 0;
    var ret = haveInternalData ? internalData : new Promise(INTERNAL);

    if (!haveInternalData) {
        if (debugging) {
            var haveSameContext = this._peekContext() === this._traceParent;
            ret._traceParent = haveSameContext ? this._traceParent : this;
        }
        ret._propagateFrom(this, 7);
    }

    var callbackIndex =
        this._addCallbacks(didFulfill, didReject, didProgress, ret, receiver);

    if (this.isResolved()) {
        async.invoke(this._queueSettleAt, this, callbackIndex);
    }

    return ret;
};

Promise.prototype._length = function Promise$_length() {
    return this._bitField & 262143;
};

Promise.prototype._isFollowingOrFulfilledOrRejected =
function Promise$_isFollowingOrFulfilledOrRejected() {
    return (this._bitField & 939524096) > 0;
};

Promise.prototype._isFollowing = function Promise$_isFollowing() {
    return (this._bitField & 536870912) === 536870912;
};

Promise.prototype._setLength = function Promise$_setLength(len) {
    this._bitField = (this._bitField & -262144) |
        (len & 262143);
};

Promise.prototype._setFulfilled = function Promise$_setFulfilled() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._setRejected = function Promise$_setRejected() {
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._setFollowing = function Promise$_setFollowing() {
    this._bitField = this._bitField | 536870912;
};

Promise.prototype._setIsFinal = function Promise$_setIsFinal() {
    this._bitField = this._bitField | 33554432;
};

Promise.prototype._isFinal = function Promise$_isFinal() {
    return (this._bitField & 33554432) > 0;
};

Promise.prototype._cancellable = function Promise$_cancellable() {
    return (this._bitField & 67108864) > 0;
};

Promise.prototype._setCancellable = function Promise$_setCancellable() {
    this._bitField = this._bitField | 67108864;
};

Promise.prototype._unsetCancellable = function Promise$_unsetCancellable() {
    this._bitField = this._bitField & (~67108864);
};

Promise.prototype._setRejectionIsUnhandled =
function Promise$_setRejectionIsUnhandled() {
    this._bitField = this._bitField | 2097152;
};

Promise.prototype._unsetRejectionIsUnhandled =
function Promise$_unsetRejectionIsUnhandled() {
    this._bitField = this._bitField & (~2097152);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled =
function Promise$_isRejectionUnhandled() {
    return (this._bitField & 2097152) > 0;
};

Promise.prototype._setUnhandledRejectionIsNotified =
function Promise$_setUnhandledRejectionIsNotified() {
    this._bitField = this._bitField | 524288;
};

Promise.prototype._unsetUnhandledRejectionIsNotified =
function Promise$_unsetUnhandledRejectionIsNotified() {
    this._bitField = this._bitField & (~524288);
};

Promise.prototype._isUnhandledRejectionNotified =
function Promise$_isUnhandledRejectionNotified() {
    return (this._bitField & 524288) > 0;
};

Promise.prototype._setCarriedStackTrace =
function Promise$_setCarriedStackTrace(capturedTrace) {
    this._bitField = this._bitField | 1048576;
    this._fulfillmentHandler0 = capturedTrace;
};

Promise.prototype._unsetCarriedStackTrace =
function Promise$_unsetCarriedStackTrace() {
    this._bitField = this._bitField & (~1048576);
    this._fulfillmentHandler0 = void 0;
};

Promise.prototype._isCarryingStackTrace =
function Promise$_isCarryingStackTrace() {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._getCarriedStackTrace =
function Promise$_getCarriedStackTrace() {
    return this._isCarryingStackTrace()
        ? this._fulfillmentHandler0
        : void 0;
};

Promise.prototype._receiverAt = function Promise$_receiverAt(index) {
    var ret = index === 0
        ? this._receiver0
        : this[(index << 2) + index - 5 + 4];
    if (this._isBound() && ret === void 0) {
        return this._boundTo;
    }
    return ret;
};

Promise.prototype._promiseAt = function Promise$_promiseAt(index) {
    return index === 0
        ? this._promise0
        : this[(index << 2) + index - 5 + 3];
};

Promise.prototype._fulfillmentHandlerAt =
function Promise$_fulfillmentHandlerAt(index) {
    return index === 0
        ? this._fulfillmentHandler0
        : this[(index << 2) + index - 5 + 0];
};

Promise.prototype._rejectionHandlerAt =
function Promise$_rejectionHandlerAt(index) {
    return index === 0
        ? this._rejectionHandler0
        : this[(index << 2) + index - 5 + 1];
};

Promise.prototype._addCallbacks = function Promise$_addCallbacks(
    fulfill,
    reject,
    progress,
    promise,
    receiver
) {
    var index = this._length();

    if (index >= 262143 - 5) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        if (receiver !== void 0) this._receiver0 = receiver;
        if (typeof fulfill === "function" && !this._isCarryingStackTrace())
            this._fulfillmentHandler0 = fulfill;
        if (typeof reject === "function") this._rejectionHandler0 = reject;
        if (typeof progress === "function") this._progressHandler0 = progress;
    } else {
        var base = (index << 2) + index - 5;
        this[base + 3] = promise;
        this[base + 4] = receiver;
        this[base + 0] = typeof fulfill === "function"
                                            ? fulfill : void 0;
        this[base + 1] = typeof reject === "function"
                                            ? reject : void 0;
        this[base + 2] = typeof progress === "function"
                                            ? progress : void 0;
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._setProxyHandlers =
function Promise$_setProxyHandlers(receiver, promiseSlotValue) {
    var index = this._length();

    if (index >= 262143 - 5) {
        index = 0;
        this._setLength(0);
    }
    if (index === 0) {
        this._promise0 = promiseSlotValue;
        this._receiver0 = receiver;
    } else {
        var base = (index << 2) + index - 5;
        this[base + 3] = promiseSlotValue;
        this[base + 4] = receiver;
        this[base + 0] =
        this[base + 1] =
        this[base + 2] = void 0;
    }
    this._setLength(index + 1);
};

Promise.prototype._proxyPromiseArray =
function Promise$_proxyPromiseArray(promiseArray, index) {
    this._setProxyHandlers(promiseArray, index);
};

Promise.prototype._proxyPromise = function Promise$_proxyPromise(promise) {
    promise._setProxied();
    this._setProxyHandlers(promise, -15);
};

Promise.prototype._setBoundTo = function Promise$_setBoundTo(obj) {
    if (obj !== void 0) {
        this._bitField = this._bitField | 8388608;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~8388608);
    }
};

Promise.prototype._isBound = function Promise$_isBound() {
    return (this._bitField & 8388608) === 8388608;
};

Promise.prototype._resolveFromResolver =
function Promise$_resolveFromResolver(resolver) {
    var promise = this;
    this._setTrace(void 0);
    this._pushContext();

    function Promise$_resolver(val) {
        if (promise._tryFollow(val)) {
            return;
        }
        promise._fulfill(val);
    }
    function Promise$_rejecter(val) {
        var trace = canAttach(val) ? val : new Error(val + "");
        promise._attachExtraTrace(trace);
        markAsOriginatingFromRejection(val);
        promise._reject(val, trace === val ? void 0 : trace);
    }
    var r = tryCatch2(resolver, void 0, Promise$_resolver, Promise$_rejecter);
    this._popContext();

    if (r !== void 0 && r === errorObj) {
        var e = r.e;
        var trace = canAttach(e) ? e : new Error(e + "");
        promise._reject(e, trace);
    }
};

Promise.prototype._spreadSlowCase =
function Promise$_spreadSlowCase(targetFn, promise, values, boundTo) {
    var promiseForAll = new PromiseArray(values).promise();
    var promise2 = promiseForAll._then(function() {
        return targetFn.apply(boundTo, arguments);
    }, void 0, void 0, APPLY, void 0);
    promise._follow(promise2);
};

Promise.prototype._callSpread =
function Promise$_callSpread(handler, promise, value) {
    var boundTo = this._boundTo;
    if (isArray(value)) {
        for (var i = 0, len = value.length; i < len; ++i) {
            if (cast(value[i], void 0) instanceof Promise) {
                this._spreadSlowCase(handler, promise, value, boundTo);
                return;
            }
        }
    }
    promise._pushContext();
    return tryCatchApply(handler, value, boundTo);
};

Promise.prototype._callHandler =
function Promise$_callHandler(
    handler, receiver, promise, value) {
    var x;
    if (receiver === APPLY && !this.isRejected()) {
        x = this._callSpread(handler, promise, value);
    } else {
        promise._pushContext();
        x = tryCatch1(handler, receiver, value);
    }
    promise._popContext();
    return x;
};

Promise.prototype._settlePromiseFromHandler =
function Promise$_settlePromiseFromHandler(
    handler, receiver, value, promise
) {
    if (!(promise instanceof Promise)) {
        handler.call(receiver, value, promise);
        return;
    }
    if (promise.isResolved()) return;
    var x = this._callHandler(handler, receiver, promise, value);
    if (promise._isFollowing()) return;

    if (x === errorObj || x === promise || x === NEXT_FILTER) {
        var err = x === promise
                    ? makeSelfResolutionError()
                    : x.e;
        var trace = canAttach(err) ? err : new Error(err + "");
        if (x !== NEXT_FILTER) promise._attachExtraTrace(trace);
        promise._rejectUnchecked(err, trace);
    } else {
        var castValue = cast(x, promise);
        if (castValue instanceof Promise) {
            if (castValue.isRejected() &&
                !castValue._isCarryingStackTrace() &&
                !canAttach(castValue._settledValue)) {
                var trace = new Error(castValue._settledValue + "");
                promise._attachExtraTrace(trace);
                castValue._setCarriedStackTrace(trace);
            }
            promise._follow(castValue);
            promise._propagateFrom(castValue, 1);
        } else {
            promise._fulfillUnchecked(x);
        }
    }
};

Promise.prototype._follow =
function Promise$_follow(promise) {
    this._setFollowing();

    if (promise.isPending()) {
        this._propagateFrom(promise, 1);
        promise._proxyPromise(this);
    } else if (promise.isFulfilled()) {
        this._fulfillUnchecked(promise._settledValue);
    } else {
        this._rejectUnchecked(promise._settledValue,
            promise._getCarriedStackTrace());
    }

    if (promise._isRejectionUnhandled()) promise._unsetRejectionIsUnhandled();

    if (debugging &&
        promise._traceParent == null) {
        promise._traceParent = this;
    }
};

Promise.prototype._tryFollow =
function Promise$_tryFollow(value) {
    if (this._isFollowingOrFulfilledOrRejected() ||
        value === this) {
        return false;
    }
    var maybePromise = cast(value, void 0);
    if (!(maybePromise instanceof Promise)) {
        return false;
    }
    this._follow(maybePromise);
    return true;
};

Promise.prototype._resetTrace = function Promise$_resetTrace() {
    if (debugging) {
        this._trace = new CapturedTrace(this._peekContext() === void 0);
    }
};

Promise.prototype._setTrace = function Promise$_setTrace(parent) {
    if (debugging) {
        var context = this._peekContext();
        this._traceParent = context;
        var isTopLevel = context === void 0;
        if (parent !== void 0 &&
            parent._traceParent === context) {
            this._trace = parent._trace;
        } else {
            this._trace = new CapturedTrace(isTopLevel);
        }
    }
    return this;
};

Promise.prototype._tryAttachExtraTrace =
function Promise$_tryAttachExtraTrace(error) {
    if (canAttach(error)) {
        this._attachExtraTrace(error);
    }
};

Promise.prototype._attachExtraTrace =
function Promise$_attachExtraTrace(error) {
    if (debugging) {
        var promise = this;
        var stack = error.stack;
        stack = typeof stack === "string" ? stack.split("\n") : [];
        CapturedTrace.protectErrorMessageNewlines(stack);
        var headerLineCount = 1;
        var combinedTraces = 1;
        while(promise != null &&
            promise._trace != null) {
            stack = CapturedTrace.combine(
                stack,
                promise._trace.stack.split("\n")
            );
            promise = promise._traceParent;
            combinedTraces++;
        }

        var stackTraceLimit = Error.stackTraceLimit || 10;
        var max = (stackTraceLimit + headerLineCount) * combinedTraces;
        var len = stack.length;
        if (len > max) {
            stack.length = max;
        }

        if (len > 0)
            stack[0] = stack[0].split("\u0002\u0000\u0001").join("\n");

        if (stack.length <= headerLineCount) {
            error.stack = "(No stack trace)";
        } else {
            error.stack = stack.join("\n");
        }
    }
};

Promise.prototype._cleanValues = function Promise$_cleanValues() {
    if (this._cancellable()) {
        this._cancellationParent = void 0;
    }
};

Promise.prototype._propagateFrom =
function Promise$_propagateFrom(parent, flags) {
    if ((flags & 1) > 0 && parent._cancellable()) {
        this._setCancellable();
        this._cancellationParent = parent;
    }
    if ((flags & 4) > 0) {
        this._setBoundTo(parent._boundTo);
    }
    if ((flags & 2) > 0) {
        this._setTrace(parent);
    }
};

Promise.prototype._fulfill = function Promise$_fulfill(value) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    this._fulfillUnchecked(value);
};

Promise.prototype._reject =
function Promise$_reject(reason, carriedStackTrace) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    this._rejectUnchecked(reason, carriedStackTrace);
};

Promise.prototype._settlePromiseAt = function Promise$_settlePromiseAt(index) {
    var handler = this.isFulfilled()
        ? this._fulfillmentHandlerAt(index)
        : this._rejectionHandlerAt(index);

    var value = this._settledValue;
    var receiver = this._receiverAt(index);
    var promise = this._promiseAt(index);

    if (typeof handler === "function") {
        this._settlePromiseFromHandler(handler, receiver, value, promise);
    } else {
        var done = false;
        var isFulfilled = this.isFulfilled();
        if (receiver !== void 0) {
            if (receiver instanceof Promise &&
                receiver._isProxied()) {
                receiver._unsetProxied();

                if (isFulfilled) receiver._fulfillUnchecked(value);
                else receiver._rejectUnchecked(value,
                    this._getCarriedStackTrace());
                done = true;
            } else if (receiver instanceof PromiseArray) {
                if (isFulfilled) receiver._promiseFulfilled(value, promise);
                else receiver._promiseRejected(value, promise);
                done = true;
            }
        }

        if (!done) {
            if (isFulfilled) promise._fulfill(value);
            else promise._reject(value, this._getCarriedStackTrace());
        }
    }

    if (index >= 4) {
        this._queueGC();
    }
};

Promise.prototype._isProxied = function Promise$_isProxied() {
    return (this._bitField & 4194304) === 4194304;
};

Promise.prototype._setProxied = function Promise$_setProxied() {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._unsetProxied = function Promise$_unsetProxied() {
    this._bitField = this._bitField & (~4194304);
};

Promise.prototype._isGcQueued = function Promise$_isGcQueued() {
    return (this._bitField & -1073741824) === -1073741824;
};

Promise.prototype._setGcQueued = function Promise$_setGcQueued() {
    this._bitField = this._bitField | -1073741824;
};

Promise.prototype._unsetGcQueued = function Promise$_unsetGcQueued() {
    this._bitField = this._bitField & (~-1073741824);
};

Promise.prototype._queueGC = function Promise$_queueGC() {
    if (this._isGcQueued()) return;
    this._setGcQueued();
    async.invokeLater(this._gc, this, void 0);
};

Promise.prototype._gc = function Promise$gc() {
    var len = this._length() * 5 - 5;
    for (var i = 0; i < len; i++) {
        delete this[i];
    }
    this._clearFirstHandlerData();
    this._setLength(0);
    this._unsetGcQueued();
};

Promise.prototype._clearFirstHandlerData =
function Promise$_clearFirstHandlerData() {
    this._fulfillmentHandler0 = void 0;
    this._rejectionHandler0 = void 0;
    this._promise0 = void 0;
    this._receiver0 = void 0;
};

Promise.prototype._queueSettleAt = function Promise$_queueSettleAt(index) {
    if (this._isRejectionUnhandled()) this._unsetRejectionIsUnhandled();
    async.invoke(this._settlePromiseAt, this, index);
};

Promise.prototype._fulfillUnchecked =
function Promise$_fulfillUnchecked(value) {
    if (!this.isPending()) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._rejectUnchecked(err, void 0);
    }
    this._cleanValues();
    this._setFulfilled();
    this._settledValue = value;
    var len = this._length();

    if (len > 0) {
        async.invoke(this._settlePromises, this, len);
    }
};

Promise.prototype._rejectUncheckedCheckError =
function Promise$_rejectUncheckedCheckError(reason) {
    var trace = canAttach(reason) ? reason : new Error(reason + "");
    this._rejectUnchecked(reason, trace === reason ? void 0 : trace);
};

Promise.prototype._rejectUnchecked =
function Promise$_rejectUnchecked(reason, trace) {
    if (!this.isPending()) return;
    if (reason === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._rejectUnchecked(err);
    }
    this._cleanValues();
    this._setRejected();
    this._settledValue = reason;

    if (this._isFinal()) {
        async.invokeLater(thrower, void 0, trace === void 0 ? reason : trace);
        return;
    }
    var len = this._length();

    if (trace !== void 0) this._setCarriedStackTrace(trace);

    if (len > 0) {
        async.invoke(this._rejectPromises, this, null);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._rejectPromises = function Promise$_rejectPromises() {
    this._settlePromises();
    this._unsetCarriedStackTrace();
};

Promise.prototype._settlePromises = function Promise$_settlePromises() {
    var len = this._length();
    for (var i = 0; i < len; i++) {
        this._settlePromiseAt(i);
    }
};

Promise.prototype._ensurePossibleRejectionHandled =
function Promise$_ensurePossibleRejectionHandled() {
    this._setRejectionIsUnhandled();
    if (CapturedTrace.possiblyUnhandledRejection !== void 0) {
        async.invokeLater(this._notifyUnhandledRejection, this, void 0);
    }
};

Promise.prototype._notifyUnhandledRejectionIsHandled =
function Promise$_notifyUnhandledRejectionIsHandled() {
    if (typeof unhandledRejectionHandled === "function") {
        async.invokeLater(unhandledRejectionHandled, void 0, this);
    }
};

Promise.prototype._notifyUnhandledRejection =
function Promise$_notifyUnhandledRejection() {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue;
        var trace = this._getCarriedStackTrace();

        this._setUnhandledRejectionIsNotified();

        if (trace !== void 0) {
            this._unsetCarriedStackTrace();
            reason = trace;
        }
        if (typeof CapturedTrace.possiblyUnhandledRejection === "function") {
            CapturedTrace.possiblyUnhandledRejection(reason, this);
        }
    }
};

var contextStack = [];
Promise.prototype._peekContext = function Promise$_peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return void 0;

};

Promise.prototype._pushContext = function Promise$_pushContext() {
    if (!debugging) return;
    contextStack.push(this);
};

Promise.prototype._popContext = function Promise$_popContext() {
    if (!debugging) return;
    contextStack.pop();
};

Promise.noConflict = function Promise$NoConflict() {
    return noConflict(Promise);
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") throw new TypeError("fn must be a function");
    async._schedule = fn;
};

if (!CapturedTrace.isSupported()) {
    Promise.longStackTraces = function(){};
    debugging = false;
}

Promise._makeSelfResolutionError = makeSelfResolutionError;
_dereq_("./finally.js")(Promise, NEXT_FILTER, cast);
_dereq_("./direct_resolve.js")(Promise);
_dereq_("./synchronous_inspection.js")(Promise);
_dereq_("./join.js")(Promise, PromiseArray, cast, INTERNAL);
Promise.RangeError = RangeError;
Promise.CancellationError = CancellationError;
Promise.TimeoutError = TimeoutError;
Promise.TypeError = TypeError;
Promise.OperationalError = OperationalError;
Promise.RejectionError = OperationalError;
Promise.AggregateError = errors.AggregateError;

util.toFastProperties(Promise);
util.toFastProperties(Promise.prototype);
Promise.Promise = Promise;
_dereq_('./map.js')(Promise,PromiseArray,apiRejection,cast,INTERNAL);

Promise.prototype = Promise.prototype;
return Promise;

};

},{"./async.js":1,"./captured_trace.js":3,"./catch_filter.js":4,"./direct_resolve.js":5,"./errors.js":6,"./errors_api_rejection":7,"./finally.js":9,"./join.js":10,"./map.js":11,"./promise_array.js":13,"./promise_resolver.js":14,"./synchronous_inspection.js":17,"./thenables.js":18,"./util.js":19}],13:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise, INTERNAL, cast) {
var canAttach = _dereq_("./errors.js").canAttach;
var util = _dereq_("./util.js");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -1: return void 0;
    case -2: return [];
    case -3: return {};
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    var parent = void 0;
    if (values instanceof Promise) {
        parent = values;
        promise._propagateFrom(parent, 1 | 4);
    }
    promise._setTrace(parent);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(void 0, -2);
}
PromiseArray.prototype.length = function PromiseArray$length() {
    return this._length;
};

PromiseArray.prototype.promise = function PromiseArray$promise() {
    return this._promise;
};

PromiseArray.prototype._init =
function PromiseArray$_init(_, resolveValueIfEmpty) {
    var values = cast(this._values, void 0);
    if (values instanceof Promise) {
        this._values = values;
        values._setBoundTo(this._promise._boundTo);
        if (values.isFulfilled()) {
            values = values._settledValue;
            if (!isArray(values)) {
                var err = new Promise.TypeError("expecting an array, a promise or a thenable");
                this.__hardReject__(err);
                return;
            }
        } else if (values.isPending()) {
            values._then(
                PromiseArray$_init,
                this._reject,
                void 0,
                this,
                resolveValueIfEmpty
           );
            return;
        } else {
            values._unsetRejectionIsUnhandled();
            this._reject(values._settledValue);
            return;
        }
    } else if (!isArray(values)) {
        var err = new Promise.TypeError("expecting an array, a promise or a thenable");
        this.__hardReject__(err);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    var len = this.getActualLength(values.length);
    var newLen = len;
    var newValues = this.shouldCopyValues() ? new Array(len) : this._values;
    var isDirectScanNeeded = false;
    for (var i = 0; i < len; ++i) {
        var maybePromise = cast(values[i], void 0);
        if (maybePromise instanceof Promise) {
            if (maybePromise.isPending()) {
                maybePromise._proxyPromiseArray(this, i);
            } else {
                maybePromise._unsetRejectionIsUnhandled();
                isDirectScanNeeded = true;
            }
        } else {
            isDirectScanNeeded = true;
        }
        newValues[i] = maybePromise;
    }
    this._values = newValues;
    this._length = newLen;
    if (isDirectScanNeeded) {
        this._scanDirectValues(len);
    }
};

PromiseArray.prototype._settlePromiseAt =
function PromiseArray$_settlePromiseAt(index) {
    var value = this._values[index];
    if (!(value instanceof Promise)) {
        this._promiseFulfilled(value, index);
    } else if (value.isFulfilled()) {
        this._promiseFulfilled(value._settledValue, index);
    } else if (value.isRejected()) {
        this._promiseRejected(value._settledValue, index);
    }
};

PromiseArray.prototype._scanDirectValues =
function PromiseArray$_scanDirectValues(len) {
    for (var i = 0; i < len; ++i) {
        if (this._isResolved()) {
            break;
        }
        this._settlePromiseAt(i);
    }
};

PromiseArray.prototype._isResolved = function PromiseArray$_isResolved() {
    return this._values === null;
};

PromiseArray.prototype._resolve = function PromiseArray$_resolve(value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype.__hardReject__ =
PromiseArray.prototype._reject = function PromiseArray$_reject(reason) {
    this._values = null;
    var trace = canAttach(reason) ? reason : new Error(reason + "");
    this._promise._attachExtraTrace(trace);
    this._promise._reject(reason, trace);
};

PromiseArray.prototype._promiseProgressed =
function PromiseArray$_promiseProgressed(progressValue, index) {
    if (this._isResolved()) return;
    this._promise._progress({
        index: index,
        value: progressValue
    });
};


PromiseArray.prototype._promiseFulfilled =
function PromiseArray$_promiseFulfilled(value, index) {
    if (this._isResolved()) return;
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
    }
};

PromiseArray.prototype._promiseRejected =
function PromiseArray$_promiseRejected(reason, index) {
    if (this._isResolved()) return;
    this._totalResolved++;
    this._reject(reason);
};

PromiseArray.prototype.shouldCopyValues =
function PromiseArray$_shouldCopyValues() {
    return true;
};

PromiseArray.prototype.getActualLength =
function PromiseArray$getActualLength(len) {
    return len;
};

return PromiseArray;
};

},{"./errors.js":6,"./util.js":19}],14:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var util = _dereq_("./util.js");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors.js");
var TimeoutError = errors.TimeoutError;
var OperationalError = errors.OperationalError;
var async = _dereq_("./async.js");
var haveGetters = util.haveGetters;
var es5 = _dereq_("./es5.js");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
    } else {
        ret = obj;
    }
    errors.markAsOriginatingFromRejection(ret);
    return ret;
}

function nodebackForPromise(promise) {
    function PromiseResolver$_callback(err, value) {
        if (promise === null) return;

        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (arguments.length > 2) {
            var $_len = arguments.length;var args = new Array($_len - 1); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
            promise._fulfill(args);
        } else {
            promise._fulfill(value);
        }

        promise = null;
    }
    return PromiseResolver$_callback;
}


var PromiseResolver;
if (!haveGetters) {
    PromiseResolver = function PromiseResolver(promise) {
        this.promise = promise;
        this.asCallback = nodebackForPromise(promise);
        this.callback = this.asCallback;
    };
}
else {
    PromiseResolver = function PromiseResolver(promise) {
        this.promise = promise;
    };
}
if (haveGetters) {
    var prop = {
        get: function() {
            return nodebackForPromise(this.promise);
        }
    };
    es5.defineProperty(PromiseResolver.prototype, "asCallback", prop);
    es5.defineProperty(PromiseResolver.prototype, "callback", prop);
}

PromiseResolver._nodebackForPromise = nodebackForPromise;

PromiseResolver.prototype.toString = function PromiseResolver$toString() {
    return "[object PromiseResolver]";
};

PromiseResolver.prototype.resolve =
PromiseResolver.prototype.fulfill = function PromiseResolver$resolve(value) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.");
    }

    var promise = this.promise;
    if (promise._tryFollow(value)) {
        return;
    }
    async.invoke(promise._fulfill, promise, value);
};

PromiseResolver.prototype.reject = function PromiseResolver$reject(reason) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.");
    }

    var promise = this.promise;
    errors.markAsOriginatingFromRejection(reason);
    var trace = errors.canAttach(reason) ? reason : new Error(reason + "");
    promise._attachExtraTrace(trace);
    async.invoke(promise._reject, promise, reason);
    if (trace !== reason) {
        async.invoke(this._setCarriedStackTrace, this, trace);
    }
};

PromiseResolver.prototype.progress =
function PromiseResolver$progress(value) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.");
    }
    async.invoke(this.promise._progress, this.promise, value);
};

PromiseResolver.prototype.cancel = function PromiseResolver$cancel() {
    async.invoke(this.promise.cancel, this.promise, void 0);
};

PromiseResolver.prototype.timeout = function PromiseResolver$timeout() {
    this.reject(new TimeoutError("timeout"));
};

PromiseResolver.prototype.isResolved = function PromiseResolver$isResolved() {
    return this.promise.isResolved();
};

PromiseResolver.prototype.toJSON = function PromiseResolver$toJSON() {
    return this.promise.toJSON();
};

PromiseResolver.prototype._setCarriedStackTrace =
function PromiseResolver$_setCarriedStackTrace(trace) {
    if (this.promise.isRejected()) {
        this.promise._setCarriedStackTrace(trace);
    }
};

module.exports = PromiseResolver;

},{"./async.js":1,"./errors.js":6,"./es5.js":8,"./util.js":19}],15:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
function arrayCopy(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
    this._makeCapacity();
}

Queue.prototype._willBeOverCapacity =
function Queue$_willBeOverCapacity(size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function Queue$_pushOne(arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function Queue$push(fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function Queue$shift() {
    var front = this._front,
        ret = this[front];

    this[front] = void 0;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function Queue$length() {
    return this._length;
};

Queue.prototype._makeCapacity = function Queue$_makeCapacity() {
    var len = this._capacity;
    for (var i = 0; i < len; ++i) {
        this[i] = void 0;
    }
};

Queue.prototype._checkCapacity = function Queue$_checkCapacity(size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 3);
    }
};

Queue.prototype._resizeTo = function Queue$_resizeTo(capacity) {
    var oldFront = this._front;
    var oldCapacity = this._capacity;
    var oldQueue = new Array(oldCapacity);
    var length = this.length();

    arrayCopy(this, 0, oldQueue, 0, oldCapacity);
    this._capacity = capacity;
    this._makeCapacity();
    this._front = 0;
    if (oldFront + length <= oldCapacity) {
        arrayCopy(oldQueue, oldFront, this, 0, length);
    } else {        var lengthBeforeWrapping =
            length - ((oldFront + length) & (oldCapacity - 1));

        arrayCopy(oldQueue, oldFront, this, 0, lengthBeforeWrapping);
        arrayCopy(oldQueue, 0, this, lengthBeforeWrapping,
                    length - lengthBeforeWrapping);
    }
};

module.exports = Queue;

},{}],16:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var schedule;
var _MutationObserver;
if (typeof process === "object" && typeof process.version === "string") {
    schedule = function Promise$_Scheduler(fn) {
        process.nextTick(fn);
    };
}
else if ((typeof MutationObserver !== "undefined" &&
         (_MutationObserver = MutationObserver)) ||
         (typeof WebKitMutationObserver !== "undefined" &&
         (_MutationObserver = WebKitMutationObserver))) {
    schedule = (function() {
        var div = document.createElement("div");
        var queuedFn = void 0;
        var observer = new _MutationObserver(
            function Promise$_Scheduler() {
                var fn = queuedFn;
                queuedFn = void 0;
                fn();
            }
       );
        observer.observe(div, {
            attributes: true
        });
        return function Promise$_Scheduler(fn) {
            queuedFn = fn;
            div.classList.toggle("foo");
        };

    })();
}
else if (typeof setTimeout !== "undefined") {
    schedule = function Promise$_Scheduler(fn) {
        setTimeout(fn, 0);
    };
}
else throw new Error("no async scheduler available");
module.exports = schedule;

},{}],17:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== void 0) {
        this._bitField = promise._bitField;
        this._settledValue = promise.isResolved()
            ? promise._settledValue
            : void 0;
    }
    else {
        this._bitField = 0;
        this._settledValue = void 0;
    }
}

PromiseInspection.prototype.isFulfilled =
Promise.prototype.isFulfilled = function Promise$isFulfilled() {
    return (this._bitField & 268435456) > 0;
};

PromiseInspection.prototype.isRejected =
Promise.prototype.isRejected = function Promise$isRejected() {
    return (this._bitField & 134217728) > 0;
};

PromiseInspection.prototype.isPending =
Promise.prototype.isPending = function Promise$isPending() {
    return (this._bitField & 402653184) === 0;
};

PromiseInspection.prototype.value =
Promise.prototype.value = function Promise$value() {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise");
    }
    return this._settledValue;
};

PromiseInspection.prototype.error =
PromiseInspection.prototype.reason =
Promise.prototype.reason = function Promise$reason() {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise");
    }
    return this._settledValue;
};

PromiseInspection.prototype.isResolved =
Promise.prototype.isResolved = function Promise$isResolved() {
    return (this._bitField & 402653184) > 0;
};

Promise.PromiseInspection = PromiseInspection;
};

},{}],18:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util.js");
var canAttach = _dereq_("./errors.js").canAttach;
var errorObj = util.errorObj;
var isObject = util.isObject;

function getThen(obj) {
    try {
        return obj.then;
    }
    catch(e) {
        errorObj.e = e;
        return errorObj;
    }
}

function Promise$_Cast(obj, originalPromise) {
    if (isObject(obj)) {
        if (obj instanceof Promise) {
            return obj;
        }
        else if (isAnyBluebirdPromise(obj)) {
            var ret = new Promise(INTERNAL);
            ret._setTrace(void 0);
            obj._then(
                ret._fulfillUnchecked,
                ret._rejectUncheckedCheckError,
                ret._progressUnchecked,
                ret,
                null
            );
            ret._setFollowing();
            return ret;
        }
        var then = getThen(obj);
        if (then === errorObj) {
            if (originalPromise !== void 0 && canAttach(then.e)) {
                originalPromise._attachExtraTrace(then.e);
            }
            return Promise.reject(then.e);
        } else if (typeof then === "function") {
            return Promise$_doThenable(obj, then, originalPromise);
        }
    }
    return obj;
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    return hasProp.call(obj, "_promise0");
}

function Promise$_doThenable(x, then, originalPromise) {
    var resolver = Promise.defer();
    var called = false;
    try {
        then.call(
            x,
            Promise$_resolveFromThenable,
            Promise$_rejectFromThenable,
            Promise$_progressFromThenable
        );
    } catch(e) {
        if (!called) {
            called = true;
            var trace = canAttach(e) ? e : new Error(e + "");
            if (originalPromise !== void 0) {
                originalPromise._attachExtraTrace(trace);
            }
            resolver.promise._reject(e, trace);
        }
    }
    return resolver.promise;

    function Promise$_resolveFromThenable(y) {
        if (called) return;
        called = true;

        if (x === y) {
            var e = Promise._makeSelfResolutionError();
            if (originalPromise !== void 0) {
                originalPromise._attachExtraTrace(e);
            }
            resolver.promise._reject(e, void 0);
            return;
        }
        resolver.resolve(y);
    }

    function Promise$_rejectFromThenable(r) {
        if (called) return;
        called = true;
        var trace = canAttach(r) ? r : new Error(r + "");
        if (originalPromise !== void 0) {
            originalPromise._attachExtraTrace(trace);
        }
        resolver.promise._reject(r, trace);
    }

    function Promise$_progressFromThenable(v) {
        if (called) return;
        var promise = resolver.promise;
        if (typeof promise._progress === "function") {
            promise._progress(v);
        }
    }
}

return Promise$_Cast;
};

},{"./errors.js":6,"./util.js":19}],19:[function(_dereq_,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
"use strict";
var es5 = _dereq_("./es5.js");
var haveGetters = (function(){
    try {
        var o = {};
        es5.defineProperty(o, "f", {
            get: function () {
                return 3;
            }
        });
        return o.f === 3;
    }
    catch (e) {
        return false;
    }

})();
var canEvaluate = typeof navigator == "undefined";
var errorObj = {e: {}};
function tryCatch1(fn, receiver, arg) {
    try { return fn.call(receiver, arg); }
    catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

function tryCatch2(fn, receiver, arg, arg2) {
    try { return fn.call(receiver, arg, arg2); }
    catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

function tryCatch3(fn, receiver, arg, arg2, arg3) {
    try { return fn.call(receiver, arg, arg2, arg3); }
    catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

function tryCatch4(fn, receiver, arg, arg2, arg3, arg4) {
    try { return fn.call(receiver, arg, arg2, arg3, arg4); }
    catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

function tryCatchApply(fn, args, receiver) {
    try { return fn.apply(receiver, args); }
    catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};

function asString(val) {
    return typeof val === "string" ? val : ("" + val);
}

function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return !isPrimitive(value);
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(asString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);
        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}


var wrapsPrimitiveReceiver = (function() {
    return this !== "string";
}).call("string");

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    if (es5.isES5) {
        return function(obj, opts) {
            var ret = [];
            var visitedKeys = Object.create(null);
            var getKeys = Object(opts).includeHidden
                ? Object.getOwnPropertyNames
                : Object.keys;
            while (obj != null) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        return function(obj) {
            var ret = [];
            /*jshint forin:false */
            for (var key in obj) {
                ret.push(key);
            }
            return ret;
        };
    }

})();

function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.keys(fn.prototype);
            return keys.length > 0 &&
                   !(keys.length === 1 && keys[0] === "constructor");
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027*/
    function f() {}
    f.prototype = obj;
    return f;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    haveGetters: haveGetters,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch1: tryCatch1,
    tryCatch2: tryCatch2,
    tryCatch3: tryCatch3,
    tryCatch4: tryCatch4,
    tryCatchApply: tryCatchApply,
    inherits: inherits,
    withAppended: withAppended,
    asString: asString,
    maybeWrapAsError: maybeWrapAsError,
    wrapsPrimitiveReceiver: wrapsPrimitiveReceiver,
    toFastProperties: toFastProperties,
    filledRange: filledRange
};

module.exports = ret;

},{"./es5.js":8}]},{},[2])
(2)
});            ;if (typeof window !== 'undefined' && window !== null) {                           window.P = window.Promise;                                                 } else if (typeof self !== 'undefined' && self !== null) {                         self.P = self.Promise;                                                     }
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":"/Users/sash/development/js/imglykit-rewrite/node_modules/browserify/node_modules/process/browser.js"}],"lodash":[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash include="defaults,extend"`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used internally to indicate various things */
  var indicatorObject = {};

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used as the data object for `iteratorTemplate` */
  var iteratorData = {
    'args': '',
    'array': null,
    'bottom': '',
    'firstArg': '',
    'init': '',
    'keys': null,
    'loop': '',
    'shadowedProps': null,
    'support': null,
    'top': '',
    'useHas': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];

  /** Used for native method references */
  var errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );

  /** Native method shortcuts */
  var fnToString = Function.prototype.toString,
      hasOwnProperty = objectProto.hasOwnProperty,
      push = arrayRef.push,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      unshift = arrayRef.unshift;

  /** Used to set meta data on functions */
  var defineProperty = (function() {
    // IE 8 only accepts DOM elements
    try {
      var o = {},
          func = isNative(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
      nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

  /** Used to avoid iterating non-enumerable properties in IE < 9 */
  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };

  (function() {
    var length = shadowedProps.length;
    while (length--) {
      var key = shadowedProps[length];
      for (var className in nonEnumProps) {
        if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
          nonEnumProps[className][key] = false;
        }
      }
    }
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps the given value to enable intuitive
   * method chaining.
   *
   * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * Chaining is supported in custom builds as long as the `value` method is
   * implicitly or explicitly included in the build.
   *
   * The chainable wrapper functions are:
   * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
   * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
   * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
   * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
   * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
   * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
   * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
   * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
   * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
   * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
   * and `zip`
   *
   * The non-chainable wrapper functions are:
   * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
   * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
   * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
   * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
   * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
   * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
   * `template`, `unescape`, `uniqueId`, and `value`
   *
   * The wrapper functions `first` and `last` return wrapped values when `n` is
   * provided, otherwise they return unwrapped values.
   *
   * Explicit chaining can be enabled by using the `_.chain` method.
   *
   * @name _
   * @constructor
   * @category Chaining
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, num) {
   *   return sum + num;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(num) {
   *   return num * num;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // no operation performed
  }

  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function() {
    var ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];

    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new ctor) { props.push(key); }
    for (key in arguments) { }

    /**
     * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsClass = toString.call(arguments) == argsClass;

    /**
     * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default. (IE < 9, Safari < 5.1)
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly sets a function's `prototype` property [[Enumerable]]
     * value to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if `arguments` object indexes are non-enumerable
     * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumArgs = key != 0;

    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
     * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
     *
     * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
     * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index and IE 8 can only access
     * characters by index on string literals.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
  }(1));

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Object} data The data object used to populate the text.
   * @returns {string} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {

    var __p = 'var index, iterable = ' +
    (obj.firstArg) +
    ', result = ' +
    (obj.init) +
    ';\nif (!iterable) return result;\n' +
    (obj.top) +
    ';';
     if (obj.array) {
    __p += '\nvar length = iterable.length; index = -1;\nif (' +
    (obj.array) +
    ') {  ';
     if (support.unindexedChars) {
    __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
     }
    __p += '\n  while (++index < length) {\n    ' +
    (obj.loop) +
    ';\n  }\n}\nelse {  ';
     } else if (support.nonEnumArgs) {
    __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
    (obj.loop) +
    ';\n    }\n  } else {  ';
     }

     if (support.enumPrototypes) {
    __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
     }

     if (support.enumErrorProps) {
    __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
     }

        var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

     if (obj.useHas && obj.keys) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
        if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }  ';
     } else {
    __p += '\n  for (index in iterable) {\n';
        if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }    ';
     if (support.nonEnumShadows) {
    __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
     for (k = 0; k < 7; k++) {
    __p += '\n    index = \'' +
    (obj.shadowedProps[k]) +
    '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
            if (!obj.useHas) {
    __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
     }
    __p += ') {\n      ' +
    (obj.loop) +
    ';\n    }      ';
     }
    __p += '\n  }    ';
     }

     }

     if (obj.array || support.nonEnumArgs) {
    __p += '\n}';
     }
    __p +=
    (obj.bottom) +
    ';\nreturn result';

    return __p
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.bind` that creates the bound function and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new bound function.
   */
  function baseBind(bindData) {
    var func = bindData[0],
        partialArgs = bindData[2],
        thisArg = bindData[4];

    function bound() {
      // `Function#bind` spec
      // http://es5.github.io/#x15.3.4.5
      if (partialArgs) {
        // avoid `arguments` object deoptimizations by using `slice` instead
        // of `Array.prototype.slice.call` and not assigning `arguments` to a
        // variable as a ternary expression
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      // mimic the constructor's `return` behavior
      // http://es5.github.io/#x13.2.2
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `func`
        var thisBinding = baseCreate(func.prototype),
            result = func.apply(thisBinding, args || arguments);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || root.Object();
      };
    }());
  }

  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early for no `thisArg` or already bound by `Function#bind`
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
      return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
      if (support.funcNames) {
        bindData = !func.name;
      }
      bindData = bindData || !support.funcDecomp;
      if (!bindData) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          bindData = !reFuncName.test(source);
        }
        if (!bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = reThis.test(source);
          setBindData(func, bindData);
        }
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData === false || (bindData !== true && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }

  /**
   * The base implementation of `createWrapper` that creates the wrapper and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new function.
   */
  function baseCreateWrapper(bindData) {
    var func = bindData[0],
        bitmask = bindData[1],
        partialArgs = bindData[2],
        partialRightArgs = bindData[3],
        thisArg = bindData[4],
        arity = bindData[5];

    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        key = func;

    function bound() {
      var thisBinding = isBind ? thisArg : this;
      if (partialArgs) {
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      if (partialRightArgs || isCurry) {
        args || (args = slice(arguments));
        if (partialRightArgs) {
          push.apply(args, partialRightArgs);
        }
        if (isCurry && args.length < arity) {
          bitmask |= 16 & ~32;
          return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
        }
      }
      args || (args = arguments);
      if (isBindKey) {
        func = thisBinding[key];
      }
      if (this instanceof bound) {
        thisBinding = baseCreate(func.prototype);
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
  }

  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new function.
   */
  function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32;

    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
      // clone `bindData`
      bindData = slice(bindData);
      if (bindData[2]) {
        bindData[2] = slice(bindData[2]);
      }
      if (bindData[3]) {
        bindData[3] = slice(bindData[3]);
      }
      // set `thisBinding` is not previously bound
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      // set if previously bound but not currently (subsequent curried functions)
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      // set curried arity if not yet set
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      // append partial left arguments
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      // append partial right arguments
      if (isPartialRight) {
        unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      // merge flags
      bindData[1] |= bitmask;
      return createWrapper.apply(null, bindData);
    }
    // fast path for `_.bind`
    var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
    return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
  }

  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {...Object} [options] The compile options object(s).
   * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
   * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
   * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
   * @param {string} [options.args] A comma separated string of iteration function arguments.
   * @param {string} [options.top] Code to execute before the iteration branches.
   * @param {string} [options.loop] Code to execute in the object loop.
   * @param {string} [options.bottom] Code to execute after the iteration branches.
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    // data properties
    iteratorData.shadowedProps = shadowedProps;

    // iterator options
    iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
    iteratorData.init = 'iterable';
    iteratorData.useHas = true;

    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        iteratorData[key] = object[key];
      }
    }
    var args = iteratorData.args;
    iteratorData.firstArg = /^[^,]+/.exec(args)[0];

    // create the function factory
    var factory = Function(
        'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
        'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
        'objectTypes, nonEnumProps, stringClass, stringProto, toString',
      'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
    );

    // return the compiled function
    return factory(
      baseCreateCallback, errorClass, errorProto, hasOwnProperty,
      indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
      objectTypes, nonEnumProps, stringClass, stringProto, toString
    );
  }

  /**
   * Checks if `value` is a native function.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
   */
  function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
  }

  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {Array} value The data array to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == argsClass || false;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!support.argsClass) {
    isArguments = function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
    };
  }

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };

  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = createIterator({
    'args': 'object',
    'init': '[]',
    'top': 'if (!(objectTypes[typeof object])) return result',
    'loop': 'result.push(index)'
  });

  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    if ((support.enumPrototypes && typeof object == 'function') ||
        (support.nonEnumArgs && object.length && isArguments(object))) {
      return shimKeys(object);
    }
    return nativeKeys(object);
  };

  /** Reusable iterator options for `assign` and `defaults` */
  var defaultsIteratorOptions = {
    'args': 'object, source, guard',
    'top':
      'var args = arguments,\n' +
      '    argsIndex = 0,\n' +
      "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
      'while (++argsIndex < argsLength) {\n' +
      '  iterable = args[argsIndex];\n' +
      '  if (iterable && objectTypes[typeof iterable]) {',
    'keys': keys,
    'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
    'bottom': '  }\n}'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object. Subsequent sources will overwrite property assignments of previous
   * sources. If a callback is provided it will be executed to produce the
   * assigned values. The callback is bound to `thisArg` and invoked with two
   * arguments; (objectValue, sourceValue).
   *
   * @static
   * @memberOf _
   * @type Function
   * @alias extend
   * @category Objects
   * @param {Object} object The destination object.
   * @param {...Object} [source] The source objects.
   * @param {Function} [callback] The function to customize assigning values.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
   * // => { 'name': 'fred', 'employer': 'slate' }
   *
   * var defaults = _.partialRight(_.assign, function(a, b) {
   *   return typeof a == 'undefined' ? b : a;
   * });
   *
   * var object = { 'name': 'barney' };
   * defaults(object, { 'name': 'fred', 'employer': 'slate' });
   * // => { 'name': 'barney', 'employer': 'slate' }
   */
  var assign = createIterator(defaultsIteratorOptions, {
    'top':
      defaultsIteratorOptions.top.replace(';',
        ';\n' +
        "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
        '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
        "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
        '  callback = args[--argsLength];\n' +
        '}'
      ),
    'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
  });

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object for all destination properties that resolve to `undefined`. Once a
   * property is set, additional defaults of the same property will be ignored.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The destination object.
   * @param {...Object} [source] The source objects.
   * @param- {Object} [guard] Allows working with `_.reduce` without using its
   *  `key` and `object` arguments as sources.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var object = { 'name': 'barney' };
   * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
   * // => { 'name': 'barney', 'employer': 'slate' }
   */
  var defaults = createIterator(defaultsIteratorOptions);

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('fred');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == stringClass || false;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'fred' }, 'hi');
   * func();
   * // => 'hi fred'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
      : createWrapper(func, 1, null, null, thisArg);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * A no-operation function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // no operation performed
  }

  /*--------------------------------------------------------------------------*/

  lodash.assign = assign;
  lodash.bind = bind;
  lodash.defaults = defaults;
  lodash.keys = keys;

  lodash.extend = assign;

  /*--------------------------------------------------------------------------*/

  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isObject = isObject;
  lodash.isString = isString;
  lodash.noop = noop;

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = '2.4.1';

  /*--------------------------------------------------------------------------*/

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // in a browser or Rhino
    root._ = lodash;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},["./index.js"])