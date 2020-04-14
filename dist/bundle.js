/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@svgdotjs/svg.draggable.js/src/svg.draggable.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@svgdotjs/svg.draggable.js/src/svg.draggable.js ***!
  \**********************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @svgdotjs/svg.js */ "./node_modules/@svgdotjs/svg.js/dist/svg.esm.js");


const getCoordsFromEvent = (ev) => {
  if (ev.changedTouches) {
    ev = ev.changedTouches[0]
  }
  return { x: ev.clientX, y: ev.clientY }
}

// Creates handler, saves it
class DragHandler {
  constructor (el) {
    el.remember('_draggable', this)
    this.el = el

    this.drag = this.drag.bind(this)
    this.startDrag = this.startDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
  }

  // Enables or disabled drag based on input
  init (enabled) {
    if (enabled) {
      this.el.on('mousedown.drag', this.startDrag)
      this.el.on('touchstart.drag', this.startDrag)
    } else {
      this.el.off('mousedown.drag')
      this.el.off('touchstart.drag')
    }
  }

  // Start dragging
  startDrag (ev) {
    const isMouse = !ev.type.indexOf('mouse')

    // Check for left button
    if (isMouse && (ev.which || ev.buttons) !== 1) {
      return
    }

    // Fire beforedrag event
    if (this.el.dispatch('beforedrag', { event: ev, handler: this }).defaultPrevented) {
      return
    }

    // Prevent browser drag behavior as soon as possible
    ev.preventDefault()

    // Prevent propagation to a parent that might also have dragging enabled
    ev.stopPropagation()

    // Make sure that start events are unbound so that one element
    // is only dragged by one input only
    this.init(false)

    this.box = this.el.bbox()
    this.lastClick = this.el.point(getCoordsFromEvent(ev))

    // We consider the drag done, when a touch is canceled, too
    const eventMove = (isMouse ? 'mousemove' : 'touchmove') + '.drag'
    const eventEnd = (isMouse ? 'mouseup' : 'touchcancel.drag touchend') + '.drag'

    // Bind drag and end events to window
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["on"])(window, eventMove, this.drag)
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["on"])(window, eventEnd, this.endDrag)

    // Fire dragstart event
    this.el.fire('dragstart', { event: ev, handler: this, box: this.box })
  }

  // While dragging
  drag (ev) {

    const { box, lastClick } = this

    const currentClick = this.el.point(getCoordsFromEvent(ev))
    const x = box.x + (currentClick.x - lastClick.x)
    const y = box.y + (currentClick.y - lastClick.y)
    const newBox = new _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["Box"](x, y, box.w, box.h)

    if (this.el.dispatch('dragmove', {
      event: ev,
      handler: this,
      box: newBox
    }).defaultPrevented) return

    this.move(x, y)
    return newBox
  }

  move (x, y) {
    // Svg elements bbox depends on their content even though they have
    // x, y, width and height - strange!
    // Thats why we handle them the same as groups
    if (this.el.type === 'svg') {
      _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["G"].prototype.move.call(this.el, x, y)
    } else {
      this.el.move(x, y)
    }
  }

  endDrag (ev) {
    // final drag
    const box = this.drag(ev)

    // fire dragend event
    this.el.fire('dragend', { event: ev, handler: this, box })

    // unbind events
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["off"])(window, 'mousemove.drag')
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["off"])(window, 'touchmove.drag')
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["off"])(window, 'mouseup.drag')
    Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["off"])(window, 'touchend.drag')

    // Rebind initial Events
    this.init(true)
  }
}

Object(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["extend"])(_svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["Element"], {
  draggable (enable = true) {
    const dragHandler = this.remember('_draggable') || new DragHandler(this)
    dragHandler.init(enable)
    return this
  }
})


/***/ }),

/***/ "./node_modules/@svgdotjs/svg.js/dist/svg.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/@svgdotjs/svg.js/dist/svg.esm.js ***!
  \*******************************************************/
/*! exports provided: A, Animator, Array, Box, Circle, ClipPath, Color, Container, Controller, Defs, Dom, Ease, Element, Ellipse, EventTarget, ForeignObject, G, Gradient, Image, Line, List, Marker, Mask, Matrix, Morphable, NonMorphable, Number, ObjectBag, PID, Path, PathArray, Pattern, Point, PointArray, Polygon, Polyline, Queue, Rect, Runner, SVG, Shape, Spring, Stop, Style, Svg, Symbol, Text, TextPath, Timeline, TransformBag, Tspan, Use, adopt, assignNewId, create, defaults, dispatch, easing, eid, extend, find, getClass, invent, makeInstance, makeMorphable, mockAdopt, namespaces, nodeOrNew, off, on, parser, regex, register, registerMorphableType, registerWindow, root, utils, wrapWithAttrCheck */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return A; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animator", function() { return Animator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Array", function() { return SVGArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Box", function() { return Box; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Circle", function() { return Circle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipPath", function() { return ClipPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Container", function() { return Container; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Controller", function() { return Controller; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Defs", function() { return Defs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dom", function() { return Dom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ease", function() { return Ease; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ellipse", function() { return Ellipse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventTarget", function() { return EventTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForeignObject", function() { return ForeignObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return G; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gradient", function() { return Gradient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return Image; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Line", function() { return Line; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Marker", function() { return Marker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mask", function() { return Mask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix", function() { return Matrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Morphable", function() { return Morphable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NonMorphable", function() { return NonMorphable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Number", function() { return SVGNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectBag", function() { return ObjectBag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PID", function() { return PID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Path", function() { return Path; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PathArray", function() { return PathArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pattern", function() { return Pattern; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointArray", function() { return PointArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return Polygon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Polyline", function() { return Polyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return Queue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rect", function() { return Rect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Runner", function() { return Runner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVG", function() { return SVG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shape", function() { return Shape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Spring", function() { return Spring; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stop", function() { return Stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return Style; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Svg", function() { return Svg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Symbol", function() { return _Symbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextPath", function() { return TextPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Timeline", function() { return Timeline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransformBag", function() { return TransformBag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tspan", function() { return Tspan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Use", function() { return Use; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "adopt", function() { return adopt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assignNewId", function() { return assignNewId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaults", function() { return defaults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dispatch", function() { return dispatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easing", function() { return easing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eid", function() { return eid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return baseFind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClass", function() { return getClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invent", function() { return invent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeInstance", function() { return makeInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeMorphable", function() { return makeMorphable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockAdopt", function() { return mockAdopt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "namespaces", function() { return namespaces; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nodeOrNew", function() { return nodeOrNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "off", function() { return off; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parser", function() { return parser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "regex", function() { return regex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerMorphableType", function() { return registerMorphableType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerWindow", function() { return registerWindow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "root", function() { return root; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utils", function() { return utils; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapWithAttrCheck", function() { return wrapWithAttrCheck; });
/*!
* @svgdotjs/svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.0.16
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Tue Nov 12 2019 21:57:16 GMT+0100 (GMT+01:00)
*/;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.3.6',
  mode:  'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var functionToString = shared('native-function-to-string', Function.toString);

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(functionToString.call(WeakMap));

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = new WeakMap$1();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(functionToString).split('toString');

shared('inspectSource', function (it) {
  return functionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
});
});

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var Symbol$1 = global_1.Symbol;
var store$2 = shared('wks');

var wellKnownSymbol = function (name) {
  return store$2[name] || (store$2[name] = nativeSymbol && Symbol$1[name]
    || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
};

var userAgent = getBuiltIn('navigator', 'userAgent') || '';

var process = global_1.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var v8Version = version && +version;

var SPECIES = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return v8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var SPECIES$1 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$1];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var defineProperty = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  getOwnPropertyNames: nativeGetOwnPropertyNames$1
});

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;

var f$6 = wellKnownSymbol;

var wrappedWellKnownSymbol = {
	f: f$6
};

var defineProperty$1 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
    value: wrappedWellKnownSymbol.f(NAME)
  });
};

var defineProperty$2 = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty$2(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var bindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var SPECIES$2 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = bindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6)
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var JSON$1 = global_1.JSON;
var nativeJSONStringify = JSON$1 && JSON$1.stringify;
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$1 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty$1({}, 'a', {
    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty$1(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty$1;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty$1(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames$2(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames$2(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbol.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON$1 && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
  stringify: function stringify(it) {
    var args = [it];
    var index = 1;
    var replacer, $replacer;
    while (arguments.length > index) args.push(arguments[index++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return nativeJSONStringify.apply(JSON$1, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var defineProperty$3 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$3(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  createNonEnumerableProperty(ArrayPrototype, UNSCOPABLES, objectCreate(null));
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var iterators = {};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$1 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$1 : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$1(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var nativeAssign = Object.assign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
// should work with symbols and should have deterministic property order (V8 bug)
var objectAssign = !nativeAssign || fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$2] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = String(test) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test.toString;

var ObjectPrototype$2 = Object.prototype;

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (objectToString !== ObjectPrototype$2.toString) {
  redefine(ObjectPrototype$2, 'toString', objectToString, { unsafe: true });
}

var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;



var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});

var ITERATOR$2 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
};

var ITERATOR$3 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$3]
    || it['@@iterator']
    || iterators[classof(it)];
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

var iterate_1 = createCommonjsModule(function (module) {
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};
});

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$4] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$4] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var ADDER = IS_MAP ? 'set' : 'add';
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.REQUIRED = true;
  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var SPECIES$3 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
    defineProperty(Constructor, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var defineProperty$4 = objectDefineProperty.f;








var fastKey = internalMetadata.fastKey;


var setInternalState$2 = internalState.set;
var internalStateGetterFor = internalState.getterFor;

var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$2(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineProperty$4(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$2(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
var es_set = collection('Set', function (get) {
  return function Set() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$2 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$2(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$2(true)
};

var charAt = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$3(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$2(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var ITERATOR$5 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$5] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$3]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

var methods = {};
var names = [];
function registerMethods(name, m) {
  if (Array.isArray(name)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = name[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _name = _step.value;
        registerMethods(_name, m);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return;
  }

  if (_typeof(name) === 'object') {
    for (var _name2 in name) {
      registerMethods(_name2, name[_name2]);
    }

    return;
  }

  addMethodNames(Object.getOwnPropertyNames(m));
  methods[name] = Object.assign(methods[name] || {}, m);
}
function getMethodsFor(name) {
  return methods[name] || {};
}
function getMethodNames() {
  return _toConsumableArray(new Set(names));
}
function addMethodNames(_names) {
  names.push.apply(names, _toConsumableArray(_names));
}

var $includes = arrayIncludes.includes;


// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

var SPECIES$4 = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$4] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  }
};

var charAt$1 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$1(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var max$2 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max$2(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$3 = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod$3(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod$3(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod$3(3)
};

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var forcedStringTrimMethod = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

// Map function
function map(array, block) {
  var i;
  var il = array.length;
  var result = [];

  for (i = 0; i < il; i++) {
    result.push(block(array[i]));
  }

  return result;
} // Filter function

function filter(array, block) {
  var i;
  var il = array.length;
  var result = [];

  for (i = 0; i < il; i++) {
    if (block(array[i])) {
      result.push(array[i]);
    }
  }

  return result;
} // Degrees to radians

function radians(d) {
  return d % 360 * Math.PI / 180;
} // Radians to degrees

function degrees(r) {
  return r * 180 / Math.PI % 360;
} // Convert dash-separated-string to camelCase

function camelCase(s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase();
  });
} // Convert camel cased string to string seperated

function unCamelCase(s) {
  return s.replace(/([A-Z])/g, function (m, g) {
    return '-' + g.toLowerCase();
  });
} // Capitalize first letter of a string

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
} // Calculate proportional width and height values when necessary

function proportionalSize(element, width, height, box) {
  if (width == null || height == null) {
    box = box || element.bbox();

    if (width == null) {
      width = box.width / box.height * height;
    } else if (height == null) {
      height = box.height / box.width * width;
    }
  }

  return {
    width: width,
    height: height
  };
}
function getOrigin(o, element) {
  // Allow origin or around as the names
  var origin = o.origin; // o.around == null ? o.origin : o.around

  var ox, oy; // Allow the user to pass a string to rotate around a given point

  if (typeof origin === 'string' || origin == null) {
    // Get the bounding box of the element with no transformations applied
    var string = (origin || 'center').toLowerCase().trim();

    var _element$bbox = element.bbox(),
        height = _element$bbox.height,
        width = _element$bbox.width,
        x = _element$bbox.x,
        y = _element$bbox.y; // Calculate the transformed x and y coordinates


    var bx = string.includes('left') ? x : string.includes('right') ? x + width : x + width / 2;
    var by = string.includes('top') ? y : string.includes('bottom') ? y + height : y + height / 2; // Set the bounds eg : "bottom-left", "Top right", "middle" etc...

    ox = o.ox != null ? o.ox : bx;
    oy = o.oy != null ? o.oy : by;
  } else {
    ox = origin[0];
    oy = origin[1];
  } // Return the origin as it is if it wasn't a string


  return [ox, oy];
}

var utils = ({
	__proto__: null,
	map: map,
	filter: filter,
	radians: radians,
	degrees: degrees,
	camelCase: camelCase,
	unCamelCase: unCamelCase,
	capitalize: capitalize,
	proportionalSize: proportionalSize,
	getOrigin: getOrigin
});

// Default namespaces
var ns = 'http://www.w3.org/2000/svg';
var xmlns = 'http://www.w3.org/2000/xmlns/';
var xlink = 'http://www.w3.org/1999/xlink';
var svgjs = 'http://svgjs.com/svgjs';

var namespaces = ({
	__proto__: null,
	ns: ns,
	xmlns: xmlns,
	xlink: xlink,
	svgjs: svgjs
});

var globals = {
  window: typeof window === 'undefined' ? null : window,
  document: typeof document === 'undefined' ? null : document
};
function registerWindow() {
  var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  globals.window = win;
  globals.document = doc;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Base = function Base() {
  _classCallCheck(this, Base);
};

var elements = {};
var root = '___SYMBOL___ROOT___'; // Method for element creation

function create(name) {
  // create element
  return globals.document.createElementNS(ns, name);
}
function makeInstance(element) {
  if (element instanceof Base) return element;

  if (_typeof(element) === 'object') {
    return adopter(element);
  }

  if (element == null) {
    return new elements[root]();
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopter(globals.document.querySelector(element));
  }

  var node = create('svg');
  node.innerHTML = element; // We can use firstChild here because we know,
  // that the first char is < and thus an element

  element = adopter(node.firstChild);
  return element;
}
function nodeOrNew(name, node) {
  return node instanceof globals.window.Node ? node : create(name);
} // Adopt existing svg elements

function adopt(node) {
  // check for presence of node
  if (!node) return null; // make sure a node isn't already adopted

  if (node.instance instanceof Base) return node.instance; // initialize variables

  var className = capitalize(node.nodeName || 'Dom'); // Make sure that gradients are adopted correctly

  if (className === 'LinearGradient' || className === 'RadialGradient') {
    className = 'Gradient'; // Fallback to Dom if element is not known
  } else if (!elements[className]) {
    className = 'Dom';
  }

  return new elements[className](node);
}
var adopter = adopt;
function mockAdopt() {
  var mock = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : adopt;
  adopter = mock;
}
function register(element) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : element.name;
  var asRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  elements[name] = element;
  if (asRoot) elements[root] = element;
  addMethodNames(Object.getOwnPropertyNames(element.prototype));
  return element;
}
function getClass(name) {
  return elements[name];
} // Element id sequence

var did = 1000; // Get next named element id

function eid(name) {
  return 'Svgjs' + capitalize(name) + did++;
} // Deep new id assignment

function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i]);
  }

  if (node.id) {
    return adopt(node).id(eid(node.nodeName));
  }

  return adopt(node);
} // Method for extending objects

function extend(modules, methods, attrCheck) {
  var key, i;
  modules = Array.isArray(modules) ? modules : [modules];

  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      var method = methods[key];

      if (attrCheck) {
        method = wrapWithAttrCheck(methods[key]);
      }

      modules[i].prototype[key] = method;
    }
  }
} // export function extendWithAttrCheck (...args) {
//   extend(...args, true)
// }

function wrapWithAttrCheck(fn) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var o = args[args.length - 1];

    if (o && o.constructor === Object && !(o instanceof Array)) {
      return fn.apply(this, args.slice(0, -1)).attr(o);
    } else {
      return fn.apply(this, args);
    }
  };
}
function invent(config) {
  // Create element initializer
  var initializer = typeof config.create === 'function' ? config.create : function (node) {
    this.constructor(node || create(config.create));
  }; // Inherit prototype

  if (config.inherit) {
    /* eslint new-cap: off */
    initializer.prototype = new config.inherit();
    initializer.prototype.constructor = initializer;
  } // Extend with methods


  if (config.extend) {
    extend(initializer, config.extend);
  } // Attach construct method to parent


  if (config.construct) {
    extend(config.parent || elements.Container, config.construct);
  }

  return initializer;
}

function siblings() {
  return this.parent().children();
} // Get the curent position siblings

function position() {
  return this.parent().index(this);
} // Get the next element (will return null if there is none)

function next() {
  return this.siblings()[this.position() + 1];
} // Get the next element (will return null if there is none)

function prev() {
  return this.siblings()[this.position() - 1];
} // Send given element one step forward

function forward() {
  var i = this.position() + 1;
  var p = this.parent(); // move node one step forward

  p.removeElement(this).add(this, i); // make sure defs node is always at the top

  if (typeof p.isRoot === 'function' && p.isRoot()) {
    p.node.appendChild(p.defs().node);
  }

  return this;
} // Send given element one step backward

function backward() {
  var i = this.position();

  if (i > 0) {
    this.parent().removeElement(this).add(this, i - 1);
  }

  return this;
} // Send given element all the way to the front

function front() {
  var p = this.parent(); // Move node forward

  p.node.appendChild(this.node); // Make sure defs node is always at the top

  if (typeof p.isRoot === 'function' && p.isRoot()) {
    p.node.appendChild(p.defs().node);
  }

  return this;
} // Send given element all the way to the back

function back() {
  if (this.position() > 0) {
    this.parent().removeElement(this).add(this, 0);
  }

  return this;
} // Inserts a given element before the targeted element

function before(element) {
  element = makeInstance(element);
  element.remove();
  var i = this.position();
  this.parent().add(element, i);
  return this;
} // Inserts a given element after the targeted element

function after(element) {
  element = makeInstance(element);
  element.remove();
  var i = this.position();
  this.parent().add(element, i + 1);
  return this;
}
function insertBefore(element) {
  element = makeInstance(element);
  element.before(this);
  return this;
}
function insertAfter(element) {
  element = makeInstance(element);
  element.after(this);
  return this;
}
registerMethods('Dom', {
  siblings: siblings,
  position: position,
  next: next,
  prev: prev,
  forward: forward,
  backward: backward,
  front: front,
  back: back,
  before: before,
  after: after,
  insertBefore: insertBefore,
  insertAfter: insertAfter
});

var $filter = arrayIteration.filter;


// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var sloppyArrayMethod = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $indexOf = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject != Object;
var SLOPPY_METHOD$1 = sloppyArrayMethod('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
_export({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD$1 }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var SPECIES$5 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
};

var arrayPush = [].push;
var min$3 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min$3(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);

// Parse unit value
var numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i; // Parse hex value

var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i; // Parse rgb value

var rgb = /rgb\((\d+),(\d+),(\d+)\)/; // Parse reference id

var reference = /(#[a-z0-9\-_]+)/i; // splits a transformation chain

var transforms = /\)\s*,?\s*/; // Whitespace

var whitespace$1 = /\s/g; // Test hex value

var isHex = /^#[a-f0-9]{3,6}$/i; // Test rgb value

var isRgb = /^rgb\(/; // Test css declaration

var isCss = /[^:]+:[^;]+;?/; // Test for blank string

var isBlank = /^(\s+)?$/; // Test for numeric string

var isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i; // Test for percent value

var isPercent = /^-?[\d.]+%$/; // Test for image url

var isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i; // split at whitespace and comma

var delimiter = /[\s,]+/; // The following regex are used to parse the d attribute of a path
// Matches all hyphens which are not after an exponent

var hyphen = /([^e])-/gi; // Replaces and tests for all path letters

var pathLetters = /[MLHVCSQTAZ]/gi; // yes we need this one, too

var isPathLetter = /[MLHVCSQTAZ]/i; // matches 0.154.23.45

var numbersWithDots = /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi; // matches .

var dots = /\./g;

var regex = ({
	__proto__: null,
	numberAndUnit: numberAndUnit,
	hex: hex,
	rgb: rgb,
	reference: reference,
	transforms: transforms,
	whitespace: whitespace$1,
	isHex: isHex,
	isRgb: isRgb,
	isCss: isCss,
	isBlank: isBlank,
	isNumber: isNumber,
	isPercent: isPercent,
	isImage: isImage,
	delimiter: delimiter,
	hyphen: hyphen,
	pathLetters: pathLetters,
	isPathLetter: isPathLetter,
	numbersWithDots: numbersWithDots,
	dots: dots
});

function classes() {
  var attr = this.attr('class');
  return attr == null ? [] : attr.trim().split(delimiter);
} // Return true if class exists on the node, false otherwise

function hasClass(name) {
  return this.classes().indexOf(name) !== -1;
} // Add class to the node

function addClass(name) {
  if (!this.hasClass(name)) {
    var array = this.classes();
    array.push(name);
    this.attr('class', array.join(' '));
  }

  return this;
} // Remove class from the node

function removeClass(name) {
  if (this.hasClass(name)) {
    this.attr('class', this.classes().filter(function (c) {
      return c !== name;
    }).join(' '));
  }

  return this;
} // Toggle the presence of a class on the node

function toggleClass(name) {
  return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
}
registerMethods('Dom', {
  classes: classes,
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass
});

var $forEach$1 = arrayIteration.forEach;


// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
  forEach: arrayForEach
});

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype$1.forEach = arrayForEach;
  }
}

function css(style, val) {
  var ret = {};

  if (arguments.length === 0) {
    // get full style as object
    this.node.style.cssText.split(/\s*;\s*/).filter(function (el) {
      return !!el.length;
    }).forEach(function (el) {
      var t = el.split(/\s*:\s*/);
      ret[t[0]] = t[1];
    });
    return ret;
  }

  if (arguments.length < 2) {
    // get style properties in the array
    if (Array.isArray(style)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = style[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;
          var cased = camelCase(name);
          ret[cased] = this.node.style[cased];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return ret;
    } // get style for property


    if (typeof style === 'string') {
      return this.node.style[camelCase(style)];
    } // set styles in object


    if (_typeof(style) === 'object') {
      for (var _name in style) {
        // set empty string if null/undefined/'' was given
        this.node.style[camelCase(_name)] = style[_name] == null || isBlank.test(style[_name]) ? '' : style[_name];
      }
    }
  } // set style for property


  if (arguments.length === 2) {
    this.node.style[camelCase(style)] = val == null || isBlank.test(val) ? '' : val;
  }

  return this;
} // Show element

function show() {
  return this.css('display', '');
} // Hide element

function hide() {
  return this.css('display', 'none');
} // Is element visible?

function visible() {
  return this.css('display') !== 'none';
}
registerMethods('Dom', {
  css: css,
  show: show,
  hide: hide,
  visible: visible
});

function data$1(a, v, r) {
  if (_typeof(a) === 'object') {
    for (v in a) {
      this.data(v, a[v]);
    }
  } else if (arguments.length < 2) {
    try {
      return JSON.parse(this.attr('data-' + a));
    } catch (e) {
      return this.attr('data-' + a);
    }
  } else {
    this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
  }

  return this;
}
registerMethods('Dom', {
  data: data$1
});

function remember(k, v) {
  // remember every item in an object individually
  if (_typeof(arguments[0]) === 'object') {
    for (var key in k) {
      this.remember(key, k[key]);
    }
  } else if (arguments.length === 1) {
    // retrieve memory
    return this.memory()[k];
  } else {
    // store memory
    this.memory()[k] = v;
  }

  return this;
} // Erase a given memory

function forget() {
  if (arguments.length === 0) {
    this._memory = {};
  } else {
    for (var i = arguments.length - 1; i >= 0; i--) {
      delete this.memory()[arguments[i]];
    }
  }

  return this;
} // This triggers creation of a new hidden class which is not performant
// However, this function is not rarely used so it will not happen frequently
// Return local memory object

function memory() {
  return this._memory = this._memory || {};
}
registerMethods('Dom', {
  remember: remember,
  forget: forget,
  memory: memory
});

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$4 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction$1(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod$4(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod$4(true)
};

var $reduce = arrayReduce.left;


// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduce') }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var listenerId = 0;
var windowEvents = {};

function getEvents(instance) {
  var n = instance.getEventHolder(); // We dont want to save events in global space

  if (n === globals.window) n = windowEvents;
  if (!n.events) n.events = {};
  return n.events;
}

function getEventTarget(instance) {
  return instance.getEventTarget();
}

function clearEvents(instance) {
  var n = instance.getEventHolder();
  if (n.events) n.events = {};
} // Add event binder in the SVG namespace


function on(node, events, listener, binding, options) {
  var l = listener.bind(binding || node);
  var instance = makeInstance(node);
  var bag = getEvents(instance);
  var n = getEventTarget(instance); // events can be an array of events or a string of events

  events = Array.isArray(events) ? events : events.split(delimiter); // add id to listener

  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++listenerId;
  }

  events.forEach(function (event) {
    var ev = event.split('.')[0];
    var ns = event.split('.')[1] || '*'; // ensure valid object

    bag[ev] = bag[ev] || {};
    bag[ev][ns] = bag[ev][ns] || {}; // reference listener

    bag[ev][ns][listener._svgjsListenerId] = l; // add listener

    n.addEventListener(ev, l, options || false);
  });
} // Add event unbinder in the SVG namespace

function off(node, events, listener, options) {
  var instance = makeInstance(node);
  var bag = getEvents(instance);
  var n = getEventTarget(instance); // listener can be a function or a number

  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId;
    if (!listener) return;
  } // events can be an array of events or a string or undefined


  events = Array.isArray(events) ? events : (events || '').split(delimiter);
  events.forEach(function (event) {
    var ev = event && event.split('.')[0];
    var ns = event && event.split('.')[1];
    var namespace, l;

    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);
        delete bag[ev][ns || '*'][listener];
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) {
          off(n, [ev, ns].join('.'), l);
        }

        delete bag[ev][ns];
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) {
            off(n, [event, ns].join('.'));
          }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) {
          off(n, [ev, namespace].join('.'));
        }

        delete bag[ev];
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) {
        off(n, event);
      }

      clearEvents(instance);
    }
  });
}
function dispatch(node, event, data) {
  var n = getEventTarget(node); // Dispatch event

  if (event instanceof globals.window.Event) {
    n.dispatchEvent(event);
  } else {
    event = new globals.window.CustomEvent(event, {
      detail: data,
      cancelable: true
    });
    n.dispatchEvent(event);
  }

  return event;
}

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = v8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var $map = arrayIteration.map;


// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}

var trim = stringTrim.trim;


var nativeParseInt = global_1.parseInt;
var hex$1 = /^[+-]?0[Xx]/;
var FORCED$1 = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
var _parseInt = FORCED$1 ? function parseInt(string, radix) {
  var S = trim(String(string));
  return nativeParseInt(S, (radix >>> 0) || (hex$1.test(S) ? 16 : 10));
} : nativeParseInt;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
_export({ global: true, forced: parseInt != _parseInt }, {
  parseInt: _parseInt
});

var TO_STRING$1 = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING$1];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING$1, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function sixDigitHex(hex) {
  return hex.length === 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
}

function componentHex(component) {
  var integer = Math.round(component);
  var bounded = Math.max(0, Math.min(255, integer));
  var hex = bounded.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function is(object, space) {
  for (var i = space.length; i--;) {
    if (object[space[i]] == null) {
      return false;
    }
  }

  return true;
}

function getParameters(a, b) {
  var params = is(a, 'rgb') ? {
    _a: a.r,
    _b: a.g,
    _c: a.b,
    space: 'rgb'
  } : is(a, 'xyz') ? {
    _a: a.x,
    _b: a.y,
    _c: a.z,
    _d: 0,
    space: 'xyz'
  } : is(a, 'hsl') ? {
    _a: a.h,
    _b: a.s,
    _c: a.l,
    _d: 0,
    space: 'hsl'
  } : is(a, 'lab') ? {
    _a: a.l,
    _b: a.a,
    _c: a.b,
    _d: 0,
    space: 'lab'
  } : is(a, 'lch') ? {
    _a: a.l,
    _b: a.c,
    _c: a.h,
    _d: 0,
    space: 'lch'
  } : is(a, 'cmyk') ? {
    _a: a.c,
    _b: a.m,
    _c: a.y,
    _d: a.k,
    space: 'cmyk'
  } : {
    _a: 0,
    _b: 0,
    _c: 0,
    space: 'rgb'
  };
  params.space = b || params.space;
  return params;
}

function cieSpace(space) {
  if (space === 'lab' || space === 'xyz' || space === 'lch') {
    return true;
  } else {
    return false;
  }
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

var Color =
/*#__PURE__*/
function () {
  function Color() {
    _classCallCheck(this, Color);

    this.init.apply(this, arguments);
  }

  _createClass(Color, [{
    key: "init",
    value: function init() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var space = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'rgb';
      // This catches the case when a falsy value is passed like ''
      a = !a ? 0 : a; // Reset all values in case the init function is rerun with new color space

      if (this.space) {
        for (var component in this.space) {
          delete this[this.space[component]];
        }
      }

      if (typeof a === 'number') {
        // Allow for the case that we don't need d...
        space = typeof d === 'string' ? d : space;
        d = typeof d === 'string' ? 0 : d; // Assign the values straight to the color

        Object.assign(this, {
          _a: a,
          _b: b,
          _c: c,
          _d: d,
          space: space
        }); // If the user gave us an array, make the color from it
      } else if (a instanceof Array) {
        this.space = b || (typeof a[3] === 'string' ? a[3] : a[4]) || 'rgb';
        Object.assign(this, {
          _a: a[0],
          _b: a[1],
          _c: a[2],
          _d: a[3] || 0
        });
      } else if (a instanceof Object) {
        // Set the object up and assign its values directly
        var values = getParameters(a, b);
        Object.assign(this, values);
      } else if (typeof a === 'string') {
        if (isRgb.test(a)) {
          var noWhitespace = a.replace(whitespace$1, '');

          var _rgb$exec$slice$map = rgb.exec(noWhitespace).slice(1, 4).map(function (v) {
            return parseInt(v);
          }),
              _rgb$exec$slice$map2 = _slicedToArray(_rgb$exec$slice$map, 3),
              _a2 = _rgb$exec$slice$map2[0],
              _b2 = _rgb$exec$slice$map2[1],
              _c2 = _rgb$exec$slice$map2[2];

          Object.assign(this, {
            _a: _a2,
            _b: _b2,
            _c: _c2,
            _d: 0,
            space: 'rgb'
          });
        } else if (isHex.test(a)) {
          var hexParse = function hexParse(v) {
            return parseInt(v, 16);
          };

          var _hex$exec$map = hex.exec(sixDigitHex(a)).map(hexParse),
              _hex$exec$map2 = _slicedToArray(_hex$exec$map, 4),
              _a3 = _hex$exec$map2[1],
              _b3 = _hex$exec$map2[2],
              _c3 = _hex$exec$map2[3];

          Object.assign(this, {
            _a: _a3,
            _b: _b3,
            _c: _c3,
            _d: 0,
            space: 'rgb'
          });
        } else throw Error('Unsupported string format, can\'t construct Color');
      } // Now add the components as a convenience


      var _a = this._a,
          _b = this._b,
          _c = this._c,
          _d = this._d;
      var components = this.space === 'rgb' ? {
        r: _a,
        g: _b,
        b: _c
      } : this.space === 'xyz' ? {
        x: _a,
        y: _b,
        z: _c
      } : this.space === 'hsl' ? {
        h: _a,
        s: _b,
        l: _c
      } : this.space === 'lab' ? {
        l: _a,
        a: _b,
        b: _c
      } : this.space === 'lch' ? {
        l: _a,
        c: _b,
        h: _c
      } : this.space === 'cmyk' ? {
        c: _a,
        m: _b,
        y: _c,
        k: _d
      } : {};
      Object.assign(this, components);
    }
    /*
    Conversion Methods
    */

  }, {
    key: "rgb",
    value: function rgb() {
      if (this.space === 'rgb') {
        return this;
      } else if (cieSpace(this.space)) {
        // Convert to the xyz color space
        var x = this.x,
            y = this.y,
            z = this.z;

        if (this.space === 'lab' || this.space === 'lch') {
          // Get the values in the lab space
          var l = this.l,
              a = this.a,
              _b4 = this.b;

          if (this.space === 'lch') {
            var c = this.c,
                h = this.h;
            var dToR = Math.PI / 180;
            a = c * Math.cos(dToR * h);
            _b4 = c * Math.sin(dToR * h);
          } // Undo the nonlinear function


          var yL = (l + 16) / 116;
          var xL = a / 500 + yL;
          var zL = yL - _b4 / 200; // Get the xyz values

          var ct = 16 / 116;
          var mx = 0.008856;
          var nm = 7.787;
          x = 0.95047 * (Math.pow(xL, 3) > mx ? Math.pow(xL, 3) : (xL - ct) / nm);
          y = 1.00000 * (Math.pow(yL, 3) > mx ? Math.pow(yL, 3) : (yL - ct) / nm);
          z = 1.08883 * (Math.pow(zL, 3) > mx ? Math.pow(zL, 3) : (zL - ct) / nm);
        } // Convert xyz to unbounded rgb values


        var rU = x * 3.2406 + y * -1.5372 + z * -0.4986;
        var gU = x * -0.9689 + y * 1.8758 + z * 0.0415;
        var bU = x * 0.0557 + y * -0.2040 + z * 1.0570; // Convert the values to true rgb values

        var pow = Math.pow;
        var bd = 0.0031308;
        var r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
        var g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
        var b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU; // Make and return the color

        var color = new Color(255 * r, 255 * g, 255 * b);
        return color;
      } else if (this.space === 'hsl') {
        // https://bgrins.github.io/TinyColor/docs/tinycolor.html
        // Get the current hsl values
        var _h = this.h,
            s = this.s,
            _l = this.l;
        _h /= 360;
        s /= 100;
        _l /= 100; // If we are grey, then just make the color directly

        if (s === 0) {
          _l *= 255;

          var _color2 = new Color(_l, _l, _l);

          return _color2;
        } // TODO I have no idea what this does :D If you figure it out, tell me!


        var q = _l < 0.5 ? _l * (1 + s) : _l + s - _l * s;
        var p = 2 * _l - q; // Get the rgb values

        var _r = 255 * hueToRgb(p, q, _h + 1 / 3);

        var _g = 255 * hueToRgb(p, q, _h);

        var _b5 = 255 * hueToRgb(p, q, _h - 1 / 3); // Make a new color


        var _color = new Color(_r, _g, _b5);

        return _color;
      } else if (this.space === 'cmyk') {
        // https://gist.github.com/felipesabino/5066336
        // Get the normalised cmyk values
        var _c4 = this.c,
            m = this.m,
            _y = this.y,
            k = this.k; // Get the rgb values

        var _r2 = 255 * (1 - Math.min(1, _c4 * (1 - k) + k));

        var _g2 = 255 * (1 - Math.min(1, m * (1 - k) + k));

        var _b6 = 255 * (1 - Math.min(1, _y * (1 - k) + k)); // Form the color and return it


        var _color3 = new Color(_r2, _g2, _b6);

        return _color3;
      } else {
        return this;
      }
    }
  }, {
    key: "lab",
    value: function lab() {
      // Get the xyz color
      var _this$xyz = this.xyz(),
          x = _this$xyz.x,
          y = _this$xyz.y,
          z = _this$xyz.z; // Get the lab components


      var l = 116 * y - 16;
      var a = 500 * (x - y);
      var b = 200 * (y - z); // Construct and return a new color

      var color = new Color(l, a, b, 'lab');
      return color;
    }
  }, {
    key: "xyz",
    value: function xyz() {
      // Normalise the red, green and blue values
      var _this$rgb = this.rgb(),
          r255 = _this$rgb._a,
          g255 = _this$rgb._b,
          b255 = _this$rgb._c;

      var _map = [r255, g255, b255].map(function (v) {
        return v / 255;
      }),
          _map2 = _slicedToArray(_map, 3),
          r = _map2[0],
          g = _map2[1],
          b = _map2[2]; // Convert to the lab rgb space


      var rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      var gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      var bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92; // Convert to the xyz color space without bounding the values

      var xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
      var yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.00000;
      var zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883; // Get the proper xyz values by applying the bounding

      var x = xU > 0.008856 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
      var y = yU > 0.008856 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
      var z = zU > 0.008856 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116; // Make and return the color

      var color = new Color(x, y, z, 'xyz');
      return color;
    }
  }, {
    key: "lch",
    value: function lch() {
      // Get the lab color directly
      var _this$lab = this.lab(),
          l = _this$lab.l,
          a = _this$lab.a,
          b = _this$lab.b; // Get the chromaticity and the hue using polar coordinates


      var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      var h = 180 * Math.atan2(b, a) / Math.PI;

      if (h < 0) {
        h *= -1;
        h = 360 - h;
      } // Make a new color and return it


      var color = new Color(l, c, h, 'lch');
      return color;
    }
  }, {
    key: "hsl",
    value: function hsl() {
      // Get the rgb values
      var _this$rgb2 = this.rgb(),
          _a = _this$rgb2._a,
          _b = _this$rgb2._b,
          _c = _this$rgb2._c;

      var _map3 = [_a, _b, _c].map(function (v) {
        return v / 255;
      }),
          _map4 = _slicedToArray(_map3, 3),
          r = _map4[0],
          g = _map4[1],
          b = _map4[2]; // Find the maximum and minimum values to get the lightness


      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var l = (max + min) / 2; // If the r, g, v values are identical then we are grey

      var isGrey = max === min; // Calculate the hue and saturation

      var delta = max - min;
      var s = isGrey ? 0 : l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      var h = isGrey ? 0 : max === r ? ((g - b) / delta + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / delta + 2) / 6 : max === b ? ((r - g) / delta + 4) / 6 : 0; // Construct and return the new color

      var color = new Color(360 * h, 100 * s, 100 * l, 'hsl');
      return color;
    }
  }, {
    key: "cmyk",
    value: function cmyk() {
      // Get the rgb values for the current color
      var _this$rgb3 = this.rgb(),
          _a = _this$rgb3._a,
          _b = _this$rgb3._b,
          _c = _this$rgb3._c;

      var _map5 = [_a, _b, _c].map(function (v) {
        return v / 255;
      }),
          _map6 = _slicedToArray(_map5, 3),
          r = _map6[0],
          g = _map6[1],
          b = _map6[2]; // Get the cmyk values in an unbounded format


      var k = Math.min(1 - r, 1 - g, 1 - b);

      if (k === 1) {
        // Catch the black case
        return new Color(0, 0, 0, 1, 'cmyk');
      }

      var c = (1 - r - k) / (1 - k);
      var m = (1 - g - k) / (1 - k);
      var y = (1 - b - k) / (1 - k); // Construct the new color

      var color = new Color(c, m, y, k, 'cmyk');
      return color;
    }
    /*
    Input and Output methods
    */

  }, {
    key: "_clamped",
    value: function _clamped() {
      var _this$rgb4 = this.rgb(),
          _a = _this$rgb4._a,
          _b = _this$rgb4._b,
          _c = _this$rgb4._c;

      var max = Math.max,
          min = Math.min,
          round = Math.round;

      var format = function format(v) {
        return max(0, min(round(v), 255));
      };

      return [_a, _b, _c].map(format);
    }
  }, {
    key: "toHex",
    value: function toHex() {
      var _this$_clamped$map = this._clamped().map(componentHex),
          _this$_clamped$map2 = _slicedToArray(_this$_clamped$map, 3),
          r = _this$_clamped$map2[0],
          g = _this$_clamped$map2[1],
          b = _this$_clamped$map2[2];

      return "#".concat(r).concat(g).concat(b);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.toHex();
    }
  }, {
    key: "toRgb",
    value: function toRgb() {
      var _this$_clamped = this._clamped(),
          _this$_clamped2 = _slicedToArray(_this$_clamped, 3),
          rV = _this$_clamped2[0],
          gV = _this$_clamped2[1],
          bV = _this$_clamped2[2];

      var string = "rgb(".concat(rV, ",").concat(gV, ",").concat(bV, ")");
      return string;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var _a = this._a,
          _b = this._b,
          _c = this._c,
          _d = this._d,
          space = this.space;
      return [_a, _b, _c, _d, space];
    }
    /*
    Generating random colors
    */

  }], [{
    key: "random",
    value: function random() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'vibrant';
      var t = arguments.length > 1 ? arguments[1] : undefined;
      // Get the math modules
      var random = Math.random,
          round = Math.round,
          sin = Math.sin,
          pi = Math.PI; // Run the correct generator

      if (mode === 'vibrant') {
        var l = (81 - 57) * random() + 57;
        var c = (83 - 45) * random() + 45;
        var h = 360 * random();
        var color = new Color(l, c, h, 'lch');
        return color;
      } else if (mode === 'sine') {
        t = t == null ? random() : t;
        var r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
        var g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
        var b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);

        var _color4 = new Color(r, g, b);

        return _color4;
      } else if (mode === 'pastel') {
        var _l2 = (94 - 86) * random() + 86;

        var _c5 = (26 - 9) * random() + 9;

        var _h2 = 360 * random();

        var _color5 = new Color(_l2, _c5, _h2, 'lch');

        return _color5;
      } else if (mode === 'dark') {
        var _l3 = 10 + 10 * random();

        var _c6 = (125 - 75) * random() + 86;

        var _h3 = 360 * random();

        var _color6 = new Color(_l3, _c6, _h3, 'lch');

        return _color6;
      } else if (mode === 'rgb') {
        var _r3 = 255 * random();

        var _g3 = 255 * random();

        var _b7 = 255 * random();

        var _color7 = new Color(_r3, _g3, _b7);

        return _color7;
      } else if (mode === 'lab') {
        var _l4 = 100 * random();

        var a = 256 * random() - 128;

        var _b8 = 256 * random() - 128;

        var _color8 = new Color(_l4, a, _b8, 'lab');

        return _color8;
      } else if (mode === 'grey') {
        var grey = 255 * random();

        var _color9 = new Color(grey, grey, grey);

        return _color9;
      }
    }
    /*
    Constructing colors
    */
    // Test if given value is a color string

  }, {
    key: "test",
    value: function test(color) {
      return typeof color === 'string' && (isHex.test(color) || isRgb.test(color));
    } // Test if given value is an rgb object

  }, {
    key: "isRgb",
    value: function isRgb(color) {
      return color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
    } // Test if given value is a color

  }, {
    key: "isColor",
    value: function isColor(color) {
      return color && (color instanceof Color || this.isRgb(color) || this.test(color));
    }
  }]);

  return Color;
}();

var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

// @@match logic
fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var defineProperty$5 = objectDefineProperty.f;
var trim$1 = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global_1[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim$1(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys$1.length > j; j++) {
    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
      defineProperty$5(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global_1, NUMBER, NumberWrapper);
}

var trim$2 = stringTrim.trim;


var nativeParseFloat = global_1.parseFloat;
var FORCED$2 = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
var _parseFloat = FORCED$2 ? function parseFloat(string) {
  var trimmedString = trim$2(String(string));
  var result = nativeParseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : nativeParseFloat;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
_export({ global: true, forced: parseFloat != _parseFloat }, {
  parseFloat: _parseFloat
});

var Point =
/*#__PURE__*/
function () {
  // Initialize
  function Point() {
    _classCallCheck(this, Point);

    this.init.apply(this, arguments);
  }

  _createClass(Point, [{
    key: "init",
    value: function init(x, y) {
      var base = {
        x: 0,
        y: 0
      }; // ensure source as object

      var source = Array.isArray(x) ? {
        x: x[0],
        y: x[1]
      } : _typeof(x) === 'object' ? {
        x: x.x,
        y: x.y
      } : {
        x: x,
        y: y
      }; // merge source

      this.x = source.x == null ? base.x : source.x;
      this.y = source.y == null ? base.y : source.y;
      return this;
    } // Clone point

  }, {
    key: "clone",
    value: function clone() {
      return new Point(this);
    }
  }, {
    key: "transform",
    value: function transform(m) {
      return this.clone().transformO(m);
    } // Transform point with matrix

  }, {
    key: "transformO",
    value: function transformO(m) {
      if (!Matrix.isMatrixLike(m)) {
        m = new Matrix(m);
      }

      var x = this.x,
          y = this.y; // Perform the matrix multiplication

      this.x = m.a * x + m.c * y + m.e;
      this.y = m.b * x + m.d * y + m.f;
      return this;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y];
    }
  }]);

  return Point;
}();
function point(x, y) {
  return new Point(x, y).transform(this.screenCTM().inverse());
}

function closeEnough(a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6);
}

var Matrix =
/*#__PURE__*/
function () {
  function Matrix() {
    _classCallCheck(this, Matrix);

    this.init.apply(this, arguments);
  } // Initialize


  _createClass(Matrix, [{
    key: "init",
    value: function init(source) {
      var base = Matrix.fromArray([1, 0, 0, 1, 0, 0]); // ensure source as object

      source = source instanceof Element ? source.matrixify() : typeof source === 'string' ? Matrix.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? Matrix.fromArray(source) : _typeof(source) === 'object' && Matrix.isMatrixLike(source) ? source : _typeof(source) === 'object' ? new Matrix().transform(source) : arguments.length === 6 ? Matrix.fromArray([].slice.call(arguments)) : base; // Merge the source matrix with the base matrix

      this.a = source.a != null ? source.a : base.a;
      this.b = source.b != null ? source.b : base.b;
      this.c = source.c != null ? source.c : base.c;
      this.d = source.d != null ? source.d : base.d;
      this.e = source.e != null ? source.e : base.e;
      this.f = source.f != null ? source.f : base.f;
      return this;
    } // Clones this matrix

  }, {
    key: "clone",
    value: function clone() {
      return new Matrix(this);
    } // Transform a matrix into another matrix by manipulating the space

  }, {
    key: "transform",
    value: function transform(o) {
      // Check if o is a matrix and then left multiply it directly
      if (Matrix.isMatrixLike(o)) {
        var matrix = new Matrix(o);
        return matrix.multiplyO(this);
      } // Get the proposed transformations and the current transformations


      var t = Matrix.formatTransforms(o);
      var current = this;

      var _transform = new Point(t.ox, t.oy).transform(current),
          ox = _transform.x,
          oy = _transform.y; // Construct the resulting matrix


      var transformer = new Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy); // If we want the origin at a particular place, we force it there

      if (isFinite(t.px) || isFinite(t.py)) {
        var origin = new Point(ox, oy).transform(transformer); // TODO: Replace t.px with isFinite(t.px)

        var dx = t.px ? t.px - origin.x : 0;
        var dy = t.py ? t.py - origin.y : 0;
        transformer.translateO(dx, dy);
      } // Translate now after positioning


      transformer.translateO(t.tx, t.ty);
      return transformer;
    } // Applies a matrix defined by its affine parameters

  }, {
    key: "compose",
    value: function compose(o) {
      if (o.origin) {
        o.originX = o.origin[0];
        o.originY = o.origin[1];
      } // Get the parameters


      var ox = o.originX || 0;
      var oy = o.originY || 0;
      var sx = o.scaleX || 1;
      var sy = o.scaleY || 1;
      var lam = o.shear || 0;
      var theta = o.rotate || 0;
      var tx = o.translateX || 0;
      var ty = o.translateY || 0; // Apply the standard matrix

      var result = new Matrix().translateO(-ox, -oy).scaleO(sx, sy).shearO(lam).rotateO(theta).translateO(tx, ty).lmultiplyO(this).translateO(ox, oy);
      return result;
    } // Decomposes this matrix into its affine parameters

  }, {
    key: "decompose",
    value: function decompose() {
      var cx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var cy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Get the parameters from the matrix
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = this.d;
      var e = this.e;
      var f = this.f; // Figure out if the winding direction is clockwise or counterclockwise

      var determinant = a * d - b * c;
      var ccw = determinant > 0 ? 1 : -1; // Since we only shear in x, we can use the x basis to get the x scale
      // and the rotation of the resulting matrix

      var sx = ccw * Math.sqrt(a * a + b * b);
      var thetaRad = Math.atan2(ccw * b, ccw * a);
      var theta = 180 / Math.PI * thetaRad;
      var ct = Math.cos(thetaRad);
      var st = Math.sin(thetaRad); // We can then solve the y basis vector simultaneously to get the other
      // two affine parameters directly from these parameters

      var lam = (a * c + b * d) / determinant;
      var sy = c * sx / (lam * a - b) || d * sx / (lam * b + a); // Use the translations

      var tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
      var ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy); // Construct the decomposition and return it

      return {
        // Return the affine parameters
        scaleX: sx,
        scaleY: sy,
        shear: lam,
        rotate: theta,
        translateX: tx,
        translateY: ty,
        originX: cx,
        originY: cy,
        // Return the matrix parameters
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      };
    } // Left multiplies by the given matrix

  }, {
    key: "multiply",
    value: function multiply(matrix) {
      return this.clone().multiplyO(matrix);
    }
  }, {
    key: "multiplyO",
    value: function multiplyO(matrix) {
      // Get the matrices
      var l = this;
      var r = matrix instanceof Matrix ? matrix : new Matrix(matrix);
      return Matrix.matrixMultiply(l, r, this);
    }
  }, {
    key: "lmultiply",
    value: function lmultiply(matrix) {
      return this.clone().lmultiplyO(matrix);
    }
  }, {
    key: "lmultiplyO",
    value: function lmultiplyO(matrix) {
      var r = this;
      var l = matrix instanceof Matrix ? matrix : new Matrix(matrix);
      return Matrix.matrixMultiply(l, r, this);
    } // Inverses matrix

  }, {
    key: "inverseO",
    value: function inverseO() {
      // Get the current parameters out of the matrix
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = this.d;
      var e = this.e;
      var f = this.f; // Invert the 2x2 matrix in the top left

      var det = a * d - b * c;
      if (!det) throw new Error('Cannot invert ' + this); // Calculate the top 2x2 matrix

      var na = d / det;
      var nb = -b / det;
      var nc = -c / det;
      var nd = a / det; // Apply the inverted matrix to the top right

      var ne = -(na * e + nc * f);
      var nf = -(nb * e + nd * f); // Construct the inverted matrix

      this.a = na;
      this.b = nb;
      this.c = nc;
      this.d = nd;
      this.e = ne;
      this.f = nf;
      return this;
    }
  }, {
    key: "inverse",
    value: function inverse() {
      return this.clone().inverseO();
    } // Translate matrix

  }, {
    key: "translate",
    value: function translate(x, y) {
      return this.clone().translateO(x, y);
    }
  }, {
    key: "translateO",
    value: function translateO(x, y) {
      this.e += x || 0;
      this.f += y || 0;
      return this;
    } // Scale matrix

  }, {
    key: "scale",
    value: function scale(x, y, cx, cy) {
      var _this$clone;

      return (_this$clone = this.clone()).scaleO.apply(_this$clone, arguments);
    }
  }, {
    key: "scaleO",
    value: function scaleO(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      // Support uniform scaling
      if (arguments.length === 3) {
        cy = cx;
        cx = y;
        y = x;
      }

      var a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f;
      this.a = a * x;
      this.b = b * y;
      this.c = c * x;
      this.d = d * y;
      this.e = e * x - cx * x + cx;
      this.f = f * y - cy * y + cy;
      return this;
    } // Rotate matrix

  }, {
    key: "rotate",
    value: function rotate(r, cx, cy) {
      return this.clone().rotateO(r, cx, cy);
    }
  }, {
    key: "rotateO",
    value: function rotateO(r) {
      var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      // Convert degrees to radians
      r = radians(r);
      var cos = Math.cos(r);
      var sin = Math.sin(r);
      var a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f;
      this.a = a * cos - b * sin;
      this.b = b * cos + a * sin;
      this.c = c * cos - d * sin;
      this.d = d * cos + c * sin;
      this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
      this.f = f * cos + e * sin - cx * sin - cy * cos + cy;
      return this;
    } // Flip matrix on x or y, at a given offset

  }, {
    key: "flip",
    value: function flip(axis, around) {
      return this.clone().flipO(axis, around);
    }
  }, {
    key: "flipO",
    value: function flipO(axis, around) {
      return axis === 'x' ? this.scaleO(-1, 1, around, 0) : axis === 'y' ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis); // Define an x, y flip point
    } // Shear matrix

  }, {
    key: "shear",
    value: function shear(a, cx, cy) {
      return this.clone().shearO(a, cx, cy);
    }
  }, {
    key: "shearO",
    value: function shearO(lx) {
      var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f;
      this.a = a + b * lx;
      this.c = c + d * lx;
      this.e = e + f * lx - cy * lx;
      return this;
    } // Skew Matrix

  }, {
    key: "skew",
    value: function skew(x, y, cx, cy) {
      var _this$clone2;

      return (_this$clone2 = this.clone()).skewO.apply(_this$clone2, arguments);
    }
  }, {
    key: "skewO",
    value: function skewO(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      // support uniformal skew
      if (arguments.length === 3) {
        cy = cx;
        cx = y;
        y = x;
      } // Convert degrees to radians


      x = radians(x);
      y = radians(y);
      var lx = Math.tan(x);
      var ly = Math.tan(y);
      var a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f;
      this.a = a + b * lx;
      this.b = b + a * ly;
      this.c = c + d * lx;
      this.d = d + c * ly;
      this.e = e + f * lx - cy * lx;
      this.f = f + e * ly - cx * ly;
      return this;
    } // SkewX

  }, {
    key: "skewX",
    value: function skewX(x, cx, cy) {
      return this.skew(x, 0, cx, cy);
    }
  }, {
    key: "skewXO",
    value: function skewXO(x, cx, cy) {
      return this.skewO(x, 0, cx, cy);
    } // SkewY

  }, {
    key: "skewY",
    value: function skewY(y, cx, cy) {
      return this.skew(0, y, cx, cy);
    }
  }, {
    key: "skewYO",
    value: function skewYO(y, cx, cy) {
      return this.skewO(0, y, cx, cy);
    } // Transform around a center point

  }, {
    key: "aroundO",
    value: function aroundO(cx, cy, matrix) {
      var dx = cx || 0;
      var dy = cy || 0;
      return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy);
    }
  }, {
    key: "around",
    value: function around(cx, cy, matrix) {
      return this.clone().aroundO(cx, cy, matrix);
    } // Check if two matrices are equal

  }, {
    key: "equals",
    value: function equals(other) {
      var comp = new Matrix(other);
      return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
    } // Convert matrix to string

  }, {
    key: "toString",
    value: function toString() {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this.a, this.b, this.c, this.d, this.e, this.f];
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      };
    }
  }], [{
    key: "fromArray",
    value: function fromArray(a) {
      return {
        a: a[0],
        b: a[1],
        c: a[2],
        d: a[3],
        e: a[4],
        f: a[5]
      };
    }
  }, {
    key: "isMatrixLike",
    value: function isMatrixLike(o) {
      return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
    }
  }, {
    key: "formatTransforms",
    value: function formatTransforms(o) {
      // Get all of the parameters required to form the matrix
      var flipBoth = o.flip === 'both' || o.flip === true;
      var flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
      var flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
      var skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
      var skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
      var scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
      var scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
      var shear = o.shear || 0;
      var theta = o.rotate || o.theta || 0;
      var origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
      var ox = origin.x;
      var oy = origin.y;
      var position = new Point(o.position || o.px || o.positionX, o.py || o.positionY);
      var px = position.x;
      var py = position.y;
      var translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
      var tx = translate.x;
      var ty = translate.y;
      var relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
      var rx = relative.x;
      var ry = relative.y; // Populate all of the values

      return {
        scaleX: scaleX,
        scaleY: scaleY,
        skewX: skewX,
        skewY: skewY,
        shear: shear,
        theta: theta,
        rx: rx,
        ry: ry,
        tx: tx,
        ty: ty,
        ox: ox,
        oy: oy,
        px: px,
        py: py
      };
    } // left matrix, right matrix, target matrix which is overwritten

  }, {
    key: "matrixMultiply",
    value: function matrixMultiply(l, r, o) {
      // Work out the product directly
      var a = l.a * r.a + l.c * r.b;
      var b = l.b * r.a + l.d * r.b;
      var c = l.a * r.c + l.c * r.d;
      var d = l.b * r.c + l.d * r.d;
      var e = l.e + l.a * r.e + l.c * r.f;
      var f = l.f + l.b * r.e + l.d * r.f; // make sure to use local variables because l/r and o could be the same

      o.a = a;
      o.b = b;
      o.c = c;
      o.d = d;
      o.e = e;
      o.f = f;
      return o;
    }
  }]);

  return Matrix;
}();
function ctm() {
  return new Matrix(this.node.getCTM());
}
function screenCTM() {
  /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
     This is needed because FF does not return the transformation matrix
     for the inner coordinate system when getScreenCTM() is called on nested svgs.
     However all other Browsers do that */
  if (typeof this.isRoot === 'function' && !this.isRoot()) {
    var rect = this.rect(1, 1);
    var m = rect.node.getScreenCTM();
    rect.remove();
    return new Matrix(m);
  }

  return new Matrix(this.node.getScreenCTM());
}
register(Matrix, 'Matrix');

function parser() {
  // Reuse cached element if possible
  if (!parser.nodes) {
    var svg = makeInstance().size(2, 0);
    svg.node.style.cssText = ['opacity: 0', 'position: absolute', 'left: -100%', 'top: -100%', 'overflow: hidden'].join(';');
    svg.attr('focusable', 'false');
    svg.attr('aria-hidden', 'true');
    var path = svg.path().node;
    parser.nodes = {
      svg: svg,
      path: path
    };
  }

  if (!parser.nodes.svg.node.parentNode) {
    var b = globals.document.body || globals.document.documentElement;
    parser.nodes.svg.addTo(b);
  }

  return parser.nodes;
}

function isNulledBox(box) {
  return !box.width && !box.height && !box.x && !box.y;
}

function domContains(node) {
  return node === globals.document || (globals.document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode;
    }

    return node === globals.document;
  }).call(globals.document.documentElement, node);
}

var Box =
/*#__PURE__*/
function () {
  function Box() {
    _classCallCheck(this, Box);

    this.init.apply(this, arguments);
  }

  _createClass(Box, [{
    key: "init",
    value: function init(source) {
      var base = [0, 0, 0, 0];
      source = typeof source === 'string' ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : _typeof(source) === 'object' ? [source.left != null ? source.left : source.x, source.top != null ? source.top : source.y, source.width, source.height] : arguments.length === 4 ? [].slice.call(arguments) : base;
      this.x = source[0] || 0;
      this.y = source[1] || 0;
      this.width = this.w = source[2] || 0;
      this.height = this.h = source[3] || 0; // Add more bounding box properties

      this.x2 = this.x + this.w;
      this.y2 = this.y + this.h;
      this.cx = this.x + this.w / 2;
      this.cy = this.y + this.h / 2;
      return this;
    } // Merge rect box with another, return a new instance

  }, {
    key: "merge",
    value: function merge(box) {
      var x = Math.min(this.x, box.x);
      var y = Math.min(this.y, box.y);
      var width = Math.max(this.x + this.width, box.x + box.width) - x;
      var height = Math.max(this.y + this.height, box.y + box.height) - y;
      return new Box(x, y, width, height);
    }
  }, {
    key: "transform",
    value: function transform(m) {
      if (!(m instanceof Matrix)) {
        m = new Matrix(m);
      }

      var xMin = Infinity;
      var xMax = -Infinity;
      var yMin = Infinity;
      var yMax = -Infinity;
      var pts = [new Point(this.x, this.y), new Point(this.x2, this.y), new Point(this.x, this.y2), new Point(this.x2, this.y2)];
      pts.forEach(function (p) {
        p = p.transform(m);
        xMin = Math.min(xMin, p.x);
        xMax = Math.max(xMax, p.x);
        yMin = Math.min(yMin, p.y);
        yMax = Math.max(yMax, p.y);
      });
      return new Box(xMin, yMin, xMax - xMin, yMax - yMin);
    }
  }, {
    key: "addOffset",
    value: function addOffset() {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += globals.window.pageXOffset;
      this.y += globals.window.pageYOffset;
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y, this.width, this.height];
    }
  }, {
    key: "isNulled",
    value: function isNulled() {
      return isNulledBox(this);
    }
  }]);

  return Box;
}();

function getBox(cb, retry) {
  var box;

  try {
    box = cb(this.node);

    if (isNulledBox(box) && !domContains(this.node)) {
      throw new Error('Element not in the dom');
    }
  } catch (e) {
    box = retry(this);
  }

  return box;
}

function bbox() {
  return new Box(getBox.call(this, function (node) {
    return node.getBBox();
  }, function (el) {
    try {
      var clone = el.clone().addTo(parser().svg).show();
      var box = clone.node.getBBox();
      clone.remove();
      return box;
    } catch (e) {
      throw new Error('Getting bbox of element "' + el.node.nodeName + '" is not possible. ' + e.toString());
    }
  }));
}
function rbox(el) {
  var box = new Box(getBox.call(this, function (node) {
    return node.getBoundingClientRect();
  }, function (el) {
    throw new Error('Getting rbox of element "' + el.node.nodeName + '" is not possible');
  }));
  if (el) return box.transform(el.screenCTM().inverse());
  return box.addOffset();
}
registerMethods({
  viewbox: {
    viewbox: function viewbox(x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox')); // act as setter

      return this.attr('viewBox', new Box(x, y, width, height));
    },
    zoom: function zoom(level, point) {
      var width = this.node.clientWidth;
      var height = this.node.clientHeight;
      var v = this.viewbox(); // Firefox does not support clientHeight and returns 0
      // https://bugzilla.mozilla.org/show_bug.cgi?id=874811

      if (!width && !height) {
        var style = window.getComputedStyle(this.node);
        width = parseFloat(style.getPropertyValue('width'));
        height = parseFloat(style.getPropertyValue('height'));
      }

      var zoomX = width / v.width;
      var zoomY = height / v.height;
      var zoom = Math.min(zoomX, zoomY);

      if (level == null) {
        return zoom;
      }

      var zoomAmount = zoom / level;
      if (zoomAmount === Infinity) zoomAmount = Number.MIN_VALUE;
      point = point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y);
      var box = new Box(v).transform(new Matrix({
        scale: zoomAmount,
        origin: point
      }));
      return this.viewbox(box);
    }
  }
});
register(Box, 'Box');

/* eslint no-new-func: "off" */
var subClassArray = function () {
  try {
    // try es6 subclassing
    return Function('name', 'baseClass', '_constructor', ['baseClass = baseClass || Array', 'return {', '  [name]: class extends baseClass {', '    constructor (...args) {', '      super(...args)', '      _constructor && _constructor.apply(this, args)', '    }', '  }', '}[name]'].join('\n'));
  } catch (e) {
    // Use es5 approach
    return function (name) {
      var baseClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Array;

      var _constructor = arguments.length > 2 ? arguments[2] : undefined;

      var Arr = function Arr() {
        baseClass.apply(this, arguments);
        _constructor && _constructor.apply(this, arguments);
      };

      Arr.prototype = Object.create(baseClass.prototype);
      Arr.prototype.constructor = Arr;

      Arr.prototype.map = function (fn) {
        var arr = new Arr();
        arr.push.apply(arr, Array.prototype.map.call(this, fn));
        return arr;
      };

      return Arr;
    };
  }
}();

var List = subClassArray('List', Array, function () {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  // This catches the case, that native map tries to create an array with new Array(1)
  if (typeof arr === 'number') return this;
  this.length = 0;
  this.push.apply(this, _toConsumableArray(arr));
});
extend(List, {
  each: function each(fnOrMethodName) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (typeof fnOrMethodName === 'function') {
      return this.map(function (el) {
        return fnOrMethodName.call(el, el);
      });
    } else {
      return this.map(function (el) {
        return el[fnOrMethodName].apply(el, args);
      });
    }
  },
  toArray: function toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
var reserved = ['toArray', 'constructor', 'each'];

List.extend = function (methods) {
  methods = methods.reduce(function (obj, name) {
    // Don't overwrite own methods
    if (reserved.includes(name)) return obj; // Don't add private methods

    if (name[0] === '_') return obj; // Relay every call to each()

    obj[name] = function () {
      for (var _len2 = arguments.length, attrs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        attrs[_key2] = arguments[_key2];
      }

      return this.each.apply(this, [name].concat(attrs));
    };

    return obj;
  }, {});
  extend(List, methods);
};

function baseFind(query, parent) {
  return new List(map((parent || globals.document).querySelectorAll(query), function (node) {
    return adopt(node);
  }));
} // Scoped find method

function find(query) {
  return baseFind(query, this.node);
}
function findOne(query) {
  return adopt(this.node.querySelector(query));
}

var EventTarget =
/*#__PURE__*/
function (_Base) {
  _inherits(EventTarget, _Base);

  function EventTarget() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$events = _ref.events,
        events = _ref$events === void 0 ? {} : _ref$events;

    _classCallCheck(this, EventTarget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EventTarget).call(this));
    _this.events = events;
    return _this;
  }

  _createClass(EventTarget, [{
    key: "addEventListener",
    value: function addEventListener() {}
  }, {
    key: "dispatch",
    value: function dispatch$1(event, data) {
      return dispatch(this, event, data);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var bag = this.getEventHolder().events;
      if (!bag) return true;
      var events = bag[event.type];

      for (var i in events) {
        for (var j in events[i]) {
          events[i][j](event);
        }
      }

      return !event.defaultPrevented;
    } // Fire given event

  }, {
    key: "fire",
    value: function fire(event, data) {
      this.dispatch(event, data);
      return this;
    }
  }, {
    key: "getEventHolder",
    value: function getEventHolder() {
      return this;
    }
  }, {
    key: "getEventTarget",
    value: function getEventTarget() {
      return this;
    } // Unbind event from listener

  }, {
    key: "off",
    value: function off$1(event, listener) {
      off(this, event, listener);

      return this;
    } // Bind given event to listener

  }, {
    key: "on",
    value: function on$1(event, listener, binding, options) {
      on(this, event, listener, binding, options);

      return this;
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener() {}
  }]);

  return EventTarget;
}(Base);
register(EventTarget, 'EventTarget');

function noop() {} // Default animation values

var timeline = {
  duration: 400,
  ease: '>',
  delay: 0
}; // Default attribute values

var attrs = {
  // fill and stroke
  'fill-opacity': 1,
  'stroke-opacity': 1,
  'stroke-width': 0,
  'stroke-linejoin': 'miter',
  'stroke-linecap': 'butt',
  fill: '#000000',
  stroke: '#000000',
  opacity: 1,
  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  // size
  width: 0,
  height: 0,
  // radius
  r: 0,
  rx: 0,
  ry: 0,
  // gradient
  offset: 0,
  'stop-opacity': 1,
  'stop-color': '#000000',
  // text
  'text-anchor': 'start'
};

var defaults = ({
	__proto__: null,
	noop: noop,
	timeline: timeline,
	attrs: attrs
});

var SVGArray = subClassArray('SVGArray', Array, function (arr) {
  this.init(arr);
});
extend(SVGArray, {
  init: function init(arr) {
    // This catches the case, that native map tries to create an array with new Array(1)
    if (typeof arr === 'number') return this;
    this.length = 0;
    this.push.apply(this, _toConsumableArray(this.parse(arr)));
    return this;
  },
  toArray: function toArray() {
    return Array.prototype.concat.apply([], this);
  },
  toString: function toString() {
    return this.join(' ');
  },
  // Flattens the array if needed
  valueOf: function valueOf() {
    var ret = [];
    ret.push.apply(ret, _toConsumableArray(this));
    return ret;
  },
  // Parse whitespace separated string
  parse: function parse() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    // If already is an array, no need to parse it
    if (array instanceof Array) return array;
    return array.trim().split(delimiter).map(parseFloat);
  },
  clone: function clone() {
    return new this.constructor(this);
  },
  toSet: function toSet() {
    return new Set(this);
  }
});

var SVGNumber =
/*#__PURE__*/
function () {
  // Initialize
  function SVGNumber() {
    _classCallCheck(this, SVGNumber);

    this.init.apply(this, arguments);
  }

  _createClass(SVGNumber, [{
    key: "init",
    value: function init(value, unit) {
      unit = Array.isArray(value) ? value[1] : unit;
      value = Array.isArray(value) ? value[0] : value; // initialize defaults

      this.value = 0;
      this.unit = unit || ''; // parse value

      if (typeof value === 'number') {
        // ensure a valid numeric value
        this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e+38 : +3.4e+38 : value;
      } else if (typeof value === 'string') {
        unit = value.match(numberAndUnit);

        if (unit) {
          // make value numeric
          this.value = parseFloat(unit[1]); // normalize

          if (unit[5] === '%') {
            this.value /= 100;
          } else if (unit[5] === 's') {
            this.value *= 1000;
          } // store unit


          this.unit = unit[5];
        }
      } else {
        if (value instanceof SVGNumber) {
          this.value = value.valueOf();
          this.unit = value.unit;
        }
      }

      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6 : this.unit === 's' ? this.value / 1e3 : this.value) + this.unit;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this.value, this.unit];
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.value;
    } // Add number

  }, {
    key: "plus",
    value: function plus(number) {
      number = new SVGNumber(number);
      return new SVGNumber(this + number, this.unit || number.unit);
    } // Subtract number

  }, {
    key: "minus",
    value: function minus(number) {
      number = new SVGNumber(number);
      return new SVGNumber(this - number, this.unit || number.unit);
    } // Multiply number

  }, {
    key: "times",
    value: function times(number) {
      number = new SVGNumber(number);
      return new SVGNumber(this * number, this.unit || number.unit);
    } // Divide number

  }, {
    key: "divide",
    value: function divide(number) {
      number = new SVGNumber(number);
      return new SVGNumber(this / number, this.unit || number.unit);
    }
  }, {
    key: "convert",
    value: function convert(unit) {
      return new SVGNumber(this.value, unit);
    }
  }]);

  return SVGNumber;
}();

var hooks = [];
function registerAttrHook(fn) {
  hooks.push(fn);
} // Set svg element attribute

function attr(attr, val, ns) {
  var _this = this;

  // act as full getter
  if (attr == null) {
    // get an object of attributes
    attr = {};
    val = this.node.attributes;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = val[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        attr[node.nodeName] = isNumber.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return attr;
  } else if (attr instanceof Array) {
    // loop through array and get all values
    return attr.reduce(function (last, curr) {
      last[curr] = _this.attr(curr);
      return last;
    }, {});
  } else if (_typeof(attr) === 'object' && attr.constructor === Object) {
    // apply every attribute individually if an object is passed
    for (val in attr) {
      this.attr(val, attr[val]);
    }
  } else if (val === null) {
    // remove value
    this.node.removeAttribute(attr);
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attr);
    return val == null ? attrs[attr] : isNumber.test(val) ? parseFloat(val) : val;
  } else {
    // Loop through hooks and execute them to convert value
    val = hooks.reduce(function (_val, hook) {
      return hook(attr, _val, _this);
    }, val); // ensure correct numeric values (also accepts NaN and Infinity)

    if (typeof val === 'number') {
      val = new SVGNumber(val);
    } else if (Color.isColor(val)) {
      // ensure full hex color
      val = new Color(val);
    } else if (val.constructor === Array) {
      // Check for plain arrays and parse array values
      val = new SVGArray(val);
    } // if the passed attribute is leading...


    if (attr === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val);
      }
    } else {
      // set given attribute on node
      typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString()) : this.node.setAttribute(attr, val.toString());
    } // rebuild if required


    if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
      this.rebuild();
    }
  }

  return this;
}

var Dom =
/*#__PURE__*/
function (_EventTarget) {
  _inherits(Dom, _EventTarget);

  function Dom(node, attrs) {
    var _this2;

    _classCallCheck(this, Dom);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Dom).call(this, node));
    _this2.node = node;
    _this2.type = node.nodeName;

    if (attrs && node !== attrs) {
      _this2.attr(attrs);
    }

    return _this2;
  } // Add given element at a position


  _createClass(Dom, [{
    key: "add",
    value: function add(element, i) {
      element = makeInstance(element);

      if (i == null) {
        this.node.appendChild(element.node);
      } else if (element.node !== this.node.childNodes[i]) {
        this.node.insertBefore(element.node, this.node.childNodes[i]);
      }

      return this;
    } // Add element to given container and return self

  }, {
    key: "addTo",
    value: function addTo(parent) {
      return makeInstance(parent).put(this);
    } // Returns all child elements

  }, {
    key: "children",
    value: function children() {
      return new List(map(this.node.children, function (node) {
        return adopt(node);
      }));
    } // Remove all elements in this container

  }, {
    key: "clear",
    value: function clear() {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      }

      return this;
    } // Clone element

  }, {
    key: "clone",
    value: function clone() {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom(); // clone element and assign new id

      return assignNewId(this.node.cloneNode(true));
    } // Iterates over all children and invokes a given block

  }, {
    key: "each",
    value: function each(block, deep) {
      var children = this.children();
      var i, il;

      for (i = 0, il = children.length; i < il; i++) {
        block.apply(children[i], [i, children]);

        if (deep) {
          children[i].each(block, deep);
        }
      }

      return this;
    }
  }, {
    key: "element",
    value: function element(nodeName) {
      return this.put(new Dom(create(nodeName)));
    } // Get first child

  }, {
    key: "first",
    value: function first() {
      return adopt(this.node.firstChild);
    } // Get a element at the given index

  }, {
    key: "get",
    value: function get(i) {
      return adopt(this.node.childNodes[i]);
    }
  }, {
    key: "getEventHolder",
    value: function getEventHolder() {
      return this.node;
    }
  }, {
    key: "getEventTarget",
    value: function getEventTarget() {
      return this.node;
    } // Checks if the given element is a child

  }, {
    key: "has",
    value: function has(element) {
      return this.index(element) >= 0;
    } // Get / set id

  }, {
    key: "id",
    value: function id(_id) {
      // generate new id if no id set
      if (typeof _id === 'undefined' && !this.node.id) {
        this.node.id = eid(this.type);
      } // dont't set directly width this.node.id to make `null` work correctly


      return this.attr('id', _id);
    } // Gets index of given element

  }, {
    key: "index",
    value: function index(element) {
      return [].slice.call(this.node.childNodes).indexOf(element.node);
    } // Get the last child

  }, {
    key: "last",
    value: function last() {
      return adopt(this.node.lastChild);
    } // matches the element vs a css selector

  }, {
    key: "matches",
    value: function matches(selector) {
      var el = this.node;
      return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    } // Returns the parent element instance

  }, {
    key: "parent",
    value: function parent(type) {
      var parent = this; // check for parent

      if (!parent.node.parentNode) return null; // get parent element

      parent = adopt(parent.node.parentNode);
      if (!type) return parent; // loop trough ancestors if type is given

      while (parent) {
        if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
        if (!parent.node.parentNode || parent.node.parentNode.nodeName === '#document' || parent.node.parentNode.nodeName === '#document-fragment') return null; // #759, #720

        parent = adopt(parent.node.parentNode);
      }
    } // Basically does the same as `add()` but returns the added element instead

  }, {
    key: "put",
    value: function put(element, i) {
      this.add(element, i);
      return element;
    } // Add element to given container and return container

  }, {
    key: "putIn",
    value: function putIn(parent) {
      return makeInstance(parent).add(this);
    } // Remove element

  }, {
    key: "remove",
    value: function remove() {
      if (this.parent()) {
        this.parent().removeElement(this);
      }

      return this;
    } // Remove a given child

  }, {
    key: "removeElement",
    value: function removeElement(element) {
      this.node.removeChild(element.node);
      return this;
    } // Replace this with element

  }, {
    key: "replace",
    value: function replace(element) {
      element = makeInstance(element);
      this.node.parentNode.replaceChild(element.node, this.node);
      return element;
    }
  }, {
    key: "round",
    value: function round() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
      var map = arguments.length > 1 ? arguments[1] : undefined;
      var factor = Math.pow(10, precision);
      var attrs = this.attr(); // If we have no map, build one from attrs

      if (!map) {
        map = Object.keys(attrs);
      } // Holds rounded attributes


      var newAttrs = {};
      map.forEach(function (key) {
        newAttrs[key] = Math.round(attrs[key] * factor) / factor;
      });
      this.attr(newAttrs);
      return this;
    } // Return id on string conversion

  }, {
    key: "toString",
    value: function toString() {
      return this.id();
    } // Import raw svg

  }, {
    key: "svg",
    value: function svg(svgOrFn, outerHTML) {
      var well, len, fragment;

      if (svgOrFn === false) {
        outerHTML = false;
        svgOrFn = null;
      } // act as getter if no svg string is given


      if (svgOrFn == null || typeof svgOrFn === 'function') {
        // The default for exports is, that the outerNode is included
        outerHTML = outerHTML == null ? true : outerHTML; // write svgjs data to the dom

        this.writeDataToDom();
        var current = this; // An export modifier was passed

        if (svgOrFn != null) {
          current = adopt(current.node.cloneNode(true)); // If the user wants outerHTML we need to process this node, too

          if (outerHTML) {
            var result = svgOrFn(current);
            current = result || current; // The user does not want this node? Well, then he gets nothing

            if (result === false) return '';
          } // Deep loop through all children and apply modifier


          current.each(function () {
            var result = svgOrFn(this);

            var _this = result || this; // If modifier returns false, discard node


            if (result === false) {
              this.remove(); // If modifier returns new node, use it
            } else if (result && this !== _this) {
              this.replace(_this);
            }
          }, true);
        } // Return outer or inner content


        return outerHTML ? current.node.outerHTML : current.node.innerHTML;
      } // Act as setter if we got a string
      // The default for import is, that the current node is not replaced


      outerHTML = outerHTML == null ? false : outerHTML; // Create temporary holder

      well = globals.document.createElementNS(ns, 'svg');
      fragment = globals.document.createDocumentFragment(); // Dump raw svg

      well.innerHTML = svgOrFn; // Transplant nodes into the fragment

      for (len = well.children.length; len--;) {
        fragment.appendChild(well.firstElementChild);
      }

      var parent = this.parent(); // Add the whole fragment at once

      return outerHTML ? this.replace(fragment) && parent : this.add(fragment);
    }
  }, {
    key: "words",
    value: function words(text) {
      // This is faster than removing all children and adding a new one
      this.node.textContent = text;
      return this;
    } // write svgjs data to the dom

  }, {
    key: "writeDataToDom",
    value: function writeDataToDom() {
      // dump variables recursively
      this.each(function () {
        this.writeDataToDom();
      });
      return this;
    }
  }]);

  return Dom;
}(EventTarget);
extend(Dom, {
  attr: attr,
  find: find,
  findOne: findOne
});
register(Dom, 'Dom');

var Element =
/*#__PURE__*/
function (_Dom) {
  _inherits(Element, _Dom);

  function Element(node, attrs) {
    var _this;

    _classCallCheck(this, Element);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Element).call(this, node, attrs)); // initialize data object

    _this.dom = {}; // create circular reference

    _this.node.instance = _assertThisInitialized(_this);

    if (node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      _this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
    }

    return _this;
  } // Move element by its center


  _createClass(Element, [{
    key: "center",
    value: function center(x, y) {
      return this.cx(x).cy(y);
    } // Move by center over x-axis

  }, {
    key: "cx",
    value: function cx(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
    } // Move by center over y-axis

  }, {
    key: "cy",
    value: function cy(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
    } // Get defs

  }, {
    key: "defs",
    value: function defs() {
      return this.root().defs();
    } // Relative move over x and y axes

  }, {
    key: "dmove",
    value: function dmove(x, y) {
      return this.dx(x).dy(y);
    } // Relative move over x axis

  }, {
    key: "dx",
    value: function dx() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.x(new SVGNumber(x).plus(this.x()));
    } // Relative move over y axis

  }, {
    key: "dy",
    value: function dy() {
      var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.y(new SVGNumber(y).plus(this.y()));
    } // Get parent document

  }, {
    key: "root",
    value: function root$1() {
      var p = this.parent(getClass(root));
      return p && p.root();
    }
  }, {
    key: "getEventHolder",
    value: function getEventHolder() {
      return this;
    } // Set height of element

  }, {
    key: "height",
    value: function height(_height) {
      return this.attr('height', _height);
    } // Checks whether the given point inside the bounding box of the element

  }, {
    key: "inside",
    value: function inside(x, y) {
      var box = this.bbox();
      return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
    } // Move element to given x and y values

  }, {
    key: "move",
    value: function move(x, y) {
      return this.x(x).y(y);
    } // return array of all ancestors of given type up to the root svg

  }, {
    key: "parents",
    value: function parents() {
      var until = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globals.document;
      until = makeInstance(until);
      var parents = new List();
      var parent = this;

      while ((parent = parent.parent()) && parent.node !== until.node && parent.node !== globals.document) {
        parents.push(parent);
      }

      return parents;
    } // Get referenced element form attribute value

  }, {
    key: "reference",
    value: function reference$1(attr) {
      attr = this.attr(attr);
      if (!attr) return null;
      var m = attr.match(reference);
      return m ? makeInstance(m[1]) : null;
    } // set given data to the elements data property

  }, {
    key: "setData",
    value: function setData(o) {
      this.dom = o;
      return this;
    } // Set element size to given width and height

  }, {
    key: "size",
    value: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
    } // Set width of element

  }, {
    key: "width",
    value: function width(_width) {
      return this.attr('width', _width);
    } // write svgjs data to the dom

  }, {
    key: "writeDataToDom",
    value: function writeDataToDom() {
      // remove previously set data
      this.node.removeAttribute('svgjs:data');

      if (Object.keys(this.dom).length) {
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
      }

      return _get(_getPrototypeOf(Element.prototype), "writeDataToDom", this).call(this);
    } // Move over x-axis

  }, {
    key: "x",
    value: function x(_x) {
      return this.attr('x', _x);
    } // Move over y-axis

  }, {
    key: "y",
    value: function y(_y) {
      return this.attr('y', _y);
    }
  }]);

  return Element;
}(Dom);
extend(Element, {
  bbox: bbox,
  rbox: rbox,
  point: point,
  ctm: ctm,
  screenCTM: screenCTM
});
register(Element, 'Element');

var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
  fill: ['color', 'opacity', 'rule'],
  prefix: function prefix(t, a) {
    return a === 'color' ? t : t + '-' + a;
  }
} // Add sugar for fill and stroke
;
['fill', 'stroke'].forEach(function (m) {
  var extension = {};
  var i;

  extension[m] = function (o) {
    if (typeof o === 'undefined') {
      return this.attr(m);
    }

    if (typeof o === 'string' || o instanceof Color || Color.isRgb(o) || o instanceof Element) {
      this.attr(m, o);
    } else {
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--) {
        if (o[sugar[m][i]] != null) {
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
        }
      }
    }

    return this;
  };

  registerMethods(['Element', 'Runner'], extension);
});
registerMethods(['Element', 'Runner'], {
  // Let the user set the matrix directly
  matrix: function matrix(mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new Matrix(this);
    } // Act as a setter, the user can pass a matrix or a set of numbers


    return this.attr('transform', new Matrix(mat, b, c, d, e, f));
  },
  // Map rotation to transform
  rotate: function rotate(angle, cx, cy) {
    return this.transform({
      rotate: angle,
      ox: cx,
      oy: cy
    }, true);
  },
  // Map skew to transform
  skew: function skew(x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      skew: x,
      ox: y,
      oy: cx
    }, true) : this.transform({
      skew: [x, y],
      ox: cx,
      oy: cy
    }, true);
  },
  shear: function shear(lam, cx, cy) {
    return this.transform({
      shear: lam,
      ox: cx,
      oy: cy
    }, true);
  },
  // Map scale to transform
  scale: function scale(x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      scale: x,
      ox: y,
      oy: cx
    }, true) : this.transform({
      scale: [x, y],
      ox: cx,
      oy: cy
    }, true);
  },
  // Map translate to transform
  translate: function translate(x, y) {
    return this.transform({
      translate: [x, y]
    }, true);
  },
  // Map relative translations to transform
  relative: function relative(x, y) {
    return this.transform({
      relative: [x, y]
    }, true);
  },
  // Map flip to transform
  flip: function flip(direction, around) {
    var directionString = typeof direction === 'string' ? direction : isFinite(direction) ? 'both' : 'both';
    var origin = direction === 'both' && isFinite(around) ? [around, around] : direction === 'x' ? [around, 0] : direction === 'y' ? [0, around] : isFinite(direction) ? [direction, direction] : [0, 0];
    return this.transform({
      flip: directionString,
      origin: origin
    }, true);
  },
  // Opacity
  opacity: function opacity(value) {
    return this.attr('opacity', value);
  }
});
registerMethods('radius', {
  // Add x and y radius
  radius: function radius(x, y) {
    var type = (this._element || this).type;
    return type === 'radialGradient' || type === 'radialGradient' ? this.attr('r', new SVGNumber(x)) : this.rx(x).ry(y == null ? x : y);
  }
});
registerMethods('Path', {
  // Get path length
  length: function length() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function pointAt(length) {
    return new Point(this.node.getPointAtLength(length));
  }
});
registerMethods(['Element', 'Runner'], {
  // Set font
  font: function font(a, v) {
    if (_typeof(a) === 'object') {
      for (v in a) {
        this.font(v, a[v]);
      }

      return this;
    }

    return a === 'leading' ? this.leading(v) : a === 'anchor' ? this.attr('text-anchor', v) : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
  }
});
registerMethods('Text', {
  ax: function ax(x) {
    return this.attr('x', x);
  },
  ay: function ay(y) {
    return this.attr('y', y);
  },
  amove: function amove(x, y) {
    return this.ax(x).ay(y);
  }
}); // Add events to elements

var methods$1 = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel'].reduce(function (last, event) {
  // add event to Element
  var fn = function fn(f) {
    if (f === null) {
      off(this, event);
    } else {
      on(this, event, f);
    }

    return this;
  };

  last[event] = fn;
  return last;
}, {});
registerMethods('Element', methods$1);

var nativeReverse = [].reverse;
var test$1 = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
_export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
  defineProperties: objectDefineProperties
});

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
  defineProperty: objectDefineProperty.f
});

var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$2 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
var FORCED$3 = !descriptors || FAILS_ON_PRIMITIVES$2;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$3, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
  }
});

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function untransform() {
  return this.attr('transform', null);
} // merge the whole transformation chain into one matrix and returns it

function matrixify() {
  var matrix = (this.attr('transform') || ''). // split transformations
  split(transforms).slice(0, -1).map(function (str) {
    // generate key => value pairs
    var kv = str.trim().split('(');
    return [kv[0], kv[1].split(delimiter).map(function (str) {
      return parseFloat(str);
    })];
  }).reverse() // merge every transformation into one matrix
  .reduce(function (matrix, transform) {
    if (transform[0] === 'matrix') {
      return matrix.lmultiply(Matrix.fromArray(transform[1]));
    }

    return matrix[transform[0]].apply(matrix, transform[1]);
  }, new Matrix());
  return matrix;
} // add an element to another parent without changing the visual representation on the screen

function toParent(parent) {
  if (this === parent) return this;
  var ctm = this.screenCTM();
  var pCtm = parent.screenCTM().inverse();
  this.addTo(parent).untransform().transform(pCtm.multiply(ctm));
  return this;
} // same as above with parent equals root-svg

function toRoot() {
  return this.toParent(this.root());
} // Add transformations

function transform(o, relative) {
  // Act as a getter if no object was passed
  if (o == null || typeof o === 'string') {
    var decomposed = new Matrix(this).decompose();
    return o == null ? decomposed : decomposed[o];
  }

  if (!Matrix.isMatrixLike(o)) {
    // Set the origin according to the defined transform
    o = _objectSpread({}, o, {
      origin: getOrigin(o, this)
    });
  } // The user can pass a boolean, an Element or an Matrix or nothing


  var cleanRelative = relative === true ? this : relative || false;
  var result = new Matrix(cleanRelative).transform(o);
  return this.attr('transform', result);
}
registerMethods('Element', {
  untransform: untransform,
  matrixify: matrixify,
  toParent: toParent,
  toRoot: toRoot,
  transform: transform
});

function rx(rx) {
  return this.attr('rx', rx);
} // Radius y value

function ry(ry) {
  return this.attr('ry', ry);
} // Move over x-axis

function x(x) {
  return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
} // Move over y-axis

function y(y) {
  return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
} // Move by center over x-axis

function cx(x) {
  return x == null ? this.attr('cx') : this.attr('cx', x);
} // Move by center over y-axis

function cy(y) {
  return y == null ? this.attr('cy') : this.attr('cy', y);
} // Set width of element

function width(width) {
  return width == null ? this.rx() * 2 : this.rx(new SVGNumber(width).divide(2));
} // Set height of element

function height(height) {
  return height == null ? this.ry() * 2 : this.ry(new SVGNumber(height).divide(2));
}

var circled = ({
	__proto__: null,
	rx: rx,
	ry: ry,
	x: x,
	y: y,
	cx: cx,
	cy: cy,
	width: width,
	height: height
});

var Shape =
/*#__PURE__*/
function (_Element) {
  _inherits(Shape, _Element);

  function Shape() {
    _classCallCheck(this, Shape);

    return _possibleConstructorReturn(this, _getPrototypeOf(Shape).apply(this, arguments));
  }

  return Shape;
}(Element);
register(Shape, 'Shape');

var Circle =
/*#__PURE__*/
function (_Shape) {
  _inherits(Circle, _Shape);

  function Circle(node) {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, nodeOrNew('circle', node), node));
  }

  _createClass(Circle, [{
    key: "radius",
    value: function radius(r) {
      return this.attr('r', r);
    } // Radius x value

  }, {
    key: "rx",
    value: function rx(_rx) {
      return this.attr('r', _rx);
    } // Alias radius x value

  }, {
    key: "ry",
    value: function ry(_ry) {
      return this.rx(_ry);
    }
  }, {
    key: "size",
    value: function size(_size) {
      return this.radius(new SVGNumber(_size).divide(2));
    }
  }]);

  return Circle;
}(Shape);
extend(Circle, {
  x: x,
  y: y,
  cx: cx,
  cy: cy,
  width: width,
  height: height
});
registerMethods({
  Container: {
    // Create circle element
    circle: wrapWithAttrCheck(function (size) {
      return this.put(new Circle()).size(size).move(0, 0);
    })
  }
});
register(Circle, 'Circle');

var Container =
/*#__PURE__*/
function (_Element) {
  _inherits(Container, _Element);

  function Container() {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, _getPrototypeOf(Container).apply(this, arguments));
  }

  _createClass(Container, [{
    key: "flatten",
    value: function flatten(parent) {
      this.each(function () {
        if (this instanceof Container) return this.flatten(parent).ungroup(parent);
        return this.toParent(parent);
      }); // we need this so that the root does not get removed

      this.node.firstElementChild || this.remove();
      return this;
    }
  }, {
    key: "ungroup",
    value: function ungroup(parent) {
      parent = parent || this.parent();
      this.each(function () {
        return this.toParent(parent);
      });
      this.remove();
      return this;
    }
  }]);

  return Container;
}(Element);
register(Container, 'Container');

var Defs =
/*#__PURE__*/
function (_Container) {
  _inherits(Defs, _Container);

  function Defs(node) {
    _classCallCheck(this, Defs);

    return _possibleConstructorReturn(this, _getPrototypeOf(Defs).call(this, nodeOrNew('defs', node), node));
  }

  _createClass(Defs, [{
    key: "flatten",
    value: function flatten() {
      return this;
    }
  }, {
    key: "ungroup",
    value: function ungroup() {
      return this;
    }
  }]);

  return Defs;
}(Container);
register(Defs, 'Defs');

var Ellipse =
/*#__PURE__*/
function (_Shape) {
  _inherits(Ellipse, _Shape);

  function Ellipse(node) {
    _classCallCheck(this, Ellipse);

    return _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, nodeOrNew('ellipse', node), node));
  }

  _createClass(Ellipse, [{
    key: "size",
    value: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.rx(new SVGNumber(p.width).divide(2)).ry(new SVGNumber(p.height).divide(2));
    }
  }]);

  return Ellipse;
}(Shape);
extend(Ellipse, circled);
registerMethods('Container', {
  // Create an ellipse
  ellipse: wrapWithAttrCheck(function () {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : width;
    return this.put(new Ellipse()).size(width, height).move(0, 0);
  })
});
register(Ellipse, 'Ellipse');

var Stop =
/*#__PURE__*/
function (_Element) {
  _inherits(Stop, _Element);

  function Stop(node) {
    _classCallCheck(this, Stop);

    return _possibleConstructorReturn(this, _getPrototypeOf(Stop).call(this, nodeOrNew('stop', node), node));
  } // add color stops


  _createClass(Stop, [{
    key: "update",
    value: function update(o) {
      if (typeof o === 'number' || o instanceof SVGNumber) {
        o = {
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        };
      } // set attributes


      if (o.opacity != null) this.attr('stop-opacity', o.opacity);
      if (o.color != null) this.attr('stop-color', o.color);
      if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));
      return this;
    }
  }]);

  return Stop;
}(Element);
register(Stop, 'Stop');

function from(x, y) {
  return (this._element || this).type === 'radialGradient' ? this.attr({
    fx: new SVGNumber(x),
    fy: new SVGNumber(y)
  }) : this.attr({
    x1: new SVGNumber(x),
    y1: new SVGNumber(y)
  });
}
function to(x, y) {
  return (this._element || this).type === 'radialGradient' ? this.attr({
    cx: new SVGNumber(x),
    cy: new SVGNumber(y)
  }) : this.attr({
    x2: new SVGNumber(x),
    y2: new SVGNumber(y)
  });
}

var gradiented = ({
	__proto__: null,
	from: from,
	to: to
});

var Gradient =
/*#__PURE__*/
function (_Container) {
  _inherits(Gradient, _Container);

  function Gradient(type, attrs) {
    _classCallCheck(this, Gradient);

    return _possibleConstructorReturn(this, _getPrototypeOf(Gradient).call(this, nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type), attrs));
  } // Add a color stop


  _createClass(Gradient, [{
    key: "stop",
    value: function stop(offset, color, opacity) {
      return this.put(new Stop()).update(offset, color, opacity);
    } // Update gradient

  }, {
    key: "update",
    value: function update(block) {
      // remove all stops
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    } // Return the fill id

  }, {
    key: "url",
    value: function url() {
      return 'url(#' + this.id() + ')';
    } // Alias string convertion to fill

  }, {
    key: "toString",
    value: function toString() {
      return this.url();
    } // custom attr to handle transform

  }, {
    key: "attr",
    value: function attr(a, b, c) {
      if (a === 'transform') a = 'gradientTransform';
      return _get(_getPrototypeOf(Gradient.prototype), "attr", this).call(this, a, b, c);
    }
  }, {
    key: "targets",
    value: function targets() {
      return baseFind('svg [fill*="' + this.id() + '"]');
    }
  }, {
    key: "bbox",
    value: function bbox() {
      return new Box();
    }
  }]);

  return Gradient;
}(Container);
extend(Gradient, gradiented);
registerMethods({
  Container: {
    // Create gradient element in defs
    gradient: wrapWithAttrCheck(function (type, block) {
      return this.defs().gradient(type, block);
    })
  },
  // define gradient
  Defs: {
    gradient: wrapWithAttrCheck(function (type, block) {
      return this.put(new Gradient(type)).update(block);
    })
  }
});
register(Gradient, 'Gradient');

var Pattern =
/*#__PURE__*/
function (_Container) {
  _inherits(Pattern, _Container);

  // Initialize node
  function Pattern(node) {
    _classCallCheck(this, Pattern);

    return _possibleConstructorReturn(this, _getPrototypeOf(Pattern).call(this, nodeOrNew('pattern', node), node));
  } // Return the fill id


  _createClass(Pattern, [{
    key: "url",
    value: function url() {
      return 'url(#' + this.id() + ')';
    } // Update pattern by rebuilding

  }, {
    key: "update",
    value: function update(block) {
      // remove content
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    } // Alias string convertion to fill

  }, {
    key: "toString",
    value: function toString() {
      return this.url();
    } // custom attr to handle transform

  }, {
    key: "attr",
    value: function attr(a, b, c) {
      if (a === 'transform') a = 'patternTransform';
      return _get(_getPrototypeOf(Pattern.prototype), "attr", this).call(this, a, b, c);
    }
  }, {
    key: "targets",
    value: function targets() {
      return baseFind('svg [fill*="' + this.id() + '"]');
    }
  }, {
    key: "bbox",
    value: function bbox() {
      return new Box();
    }
  }]);

  return Pattern;
}(Container);
registerMethods({
  Container: {
    // Create pattern element in defs
    pattern: function pattern() {
      var _this$defs;

      return (_this$defs = this.defs()).pattern.apply(_this$defs, arguments);
    }
  },
  Defs: {
    pattern: wrapWithAttrCheck(function (width, height, block) {
      return this.put(new Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      });
    })
  }
});
register(Pattern, 'Pattern');

var Image =
/*#__PURE__*/
function (_Shape) {
  _inherits(Image, _Shape);

  function Image(node) {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, nodeOrNew('image', node), node));
  } // (re)load image


  _createClass(Image, [{
    key: "load",
    value: function load(url, callback) {
      if (!url) return this;
      var img = new globals.window.Image();
      on(img, 'load', function (e) {
        var p = this.parent(Pattern); // ensure image size

        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height);
        }

        if (p instanceof Pattern) {
          // ensure pattern size if not set
          if (p.width() === 0 && p.height() === 0) {
            p.size(this.width(), this.height());
          }
        }

        if (typeof callback === 'function') {
          callback.call(this, e);
        }
      }, this);
      on(img, 'load error', function () {
        // dont forget to unbind memory leaking events
        off(img);
      });
      return this.attr('href', img.src = url, xlink);
    }
  }]);

  return Image;
}(Shape);
registerAttrHook(function (attr, val, _this) {
  // convert image fill and stroke to patterns
  if (attr === 'fill' || attr === 'stroke') {
    if (isImage.test(val)) {
      val = _this.root().defs().image(val);
    }
  }

  if (val instanceof Image) {
    val = _this.root().defs().pattern(0, 0, function (pattern) {
      pattern.add(val);
    });
  }

  return val;
});
registerMethods({
  Container: {
    // create image element, load image and set its size
    image: wrapWithAttrCheck(function (source, callback) {
      return this.put(new Image()).size(0, 0).load(source, callback);
    })
  }
});
register(Image, 'Image');

var PointArray = subClassArray('PointArray', SVGArray);
extend(PointArray, {
  // Convert array to string
  toString: function toString() {
    // convert to a poly point string
    for (var i = 0, il = this.length, array = []; i < il; i++) {
      array.push(this[i].join(','));
    }

    return array.join(' ');
  },
  // Convert array to line object
  toLine: function toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    };
  },
  // Get morphed array at given position
  at: function at(pos) {
    // make sure a destination is defined
    if (!this.destination) return this; // generate morphed point string

    for (var i = 0, il = this.length, array = []; i < il; i++) {
      array.push([this[i][0] + (this.destination[i][0] - this[i][0]) * pos, this[i][1] + (this.destination[i][1] - this[i][1]) * pos]);
    }

    return new PointArray(array);
  },
  // Parse point string and flat array
  parse: function parse() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [[0, 0]];
    var points = []; // if it is an array

    if (array instanceof Array) {
      // and it is not flat, there is no need to parse it
      if (array[0] instanceof Array) {
        return array;
      }
    } else {
      // Else, it is considered as a string
      // parse points
      array = array.trim().split(delimiter).map(parseFloat);
    } // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.


    if (array.length % 2 !== 0) array.pop(); // wrap points in two-tuples

    for (var i = 0, len = array.length; i < len; i = i + 2) {
      points.push([array[i], array[i + 1]]);
    }

    return points;
  },
  // transform points with matrix (similar to Point.transform)
  transform: function transform(m) {
    var points = [];

    for (var i = 0; i < this.length; i++) {
      var point = this[i]; // Perform the matrix multiplication

      points.push([m.a * point[0] + m.c * point[1] + m.e, m.b * point[0] + m.d * point[1] + m.f]);
    } // Return the required point


    return new PointArray(points);
  },
  // Move point string
  move: function move(x, y) {
    var box = this.bbox(); // get relative offset

    x -= box.x;
    y -= box.y; // move every point

    if (!isNaN(x) && !isNaN(y)) {
      for (var i = this.length - 1; i >= 0; i--) {
        this[i] = [this[i][0] + x, this[i][1] + y];
      }
    }

    return this;
  },
  // Resize poly string
  size: function size(width, height) {
    var i;
    var box = this.bbox(); // recalculate position of all points according to new size

    for (i = this.length - 1; i >= 0; i--) {
      if (box.width) this[i][0] = (this[i][0] - box.x) * width / box.width + box.x;
      if (box.height) this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
    }

    return this;
  },
  // Get bounding box of points
  bbox: function bbox() {
    var maxX = -Infinity;
    var maxY = -Infinity;
    var minX = Infinity;
    var minY = Infinity;
    this.forEach(function (el) {
      maxX = Math.max(el[0], maxX);
      maxY = Math.max(el[1], maxY);
      minX = Math.min(el[0], minX);
      minY = Math.min(el[1], minY);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
});

var MorphArray = PointArray; // Move by left top corner over x-axis

function x$1(x) {
  return x == null ? this.bbox().x : this.move(x, this.bbox().y);
} // Move by left top corner over y-axis

function y$1(y) {
  return y == null ? this.bbox().y : this.move(this.bbox().x, y);
} // Set width of element

function width$1(width) {
  var b = this.bbox();
  return width == null ? b.width : this.size(width, b.height);
} // Set height of element

function height$1(height) {
  var b = this.bbox();
  return height == null ? b.height : this.size(b.width, height);
}

var pointed = ({
	__proto__: null,
	MorphArray: MorphArray,
	x: x$1,
	y: y$1,
	width: width$1,
	height: height$1
});

var Line =
/*#__PURE__*/
function (_Shape) {
  _inherits(Line, _Shape);

  // Initialize node
  function Line(node) {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, nodeOrNew('line', node), node));
  } // Get array


  _createClass(Line, [{
    key: "array",
    value: function array() {
      return new PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
    } // Overwrite native plot() method

  }, {
    key: "plot",
    value: function plot(x1, y1, x2, y2) {
      if (x1 == null) {
        return this.array();
      } else if (typeof y1 !== 'undefined') {
        x1 = {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        };
      } else {
        x1 = new PointArray(x1).toLine();
      }

      return this.attr(x1);
    } // Move by left top corner

  }, {
    key: "move",
    value: function move(x, y) {
      return this.attr(this.array().move(x, y).toLine());
    } // Set element size to given width and height

  }, {
    key: "size",
    value: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.attr(this.array().size(p.width, p.height).toLine());
    }
  }]);

  return Line;
}(Shape);
extend(Line, pointed);
registerMethods({
  Container: {
    // Create a line element
    line: wrapWithAttrCheck(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a PointArray
      return Line.prototype.plot.apply(this.put(new Line()), args[0] != null ? args : [0, 0, 0, 0]);
    })
  }
});
register(Line, 'Line');

var Marker =
/*#__PURE__*/
function (_Container) {
  _inherits(Marker, _Container);

  // Initialize node
  function Marker(node) {
    _classCallCheck(this, Marker);

    return _possibleConstructorReturn(this, _getPrototypeOf(Marker).call(this, nodeOrNew('marker', node), node));
  } // Set width of element


  _createClass(Marker, [{
    key: "width",
    value: function width(_width) {
      return this.attr('markerWidth', _width);
    } // Set height of element

  }, {
    key: "height",
    value: function height(_height) {
      return this.attr('markerHeight', _height);
    } // Set marker refX and refY

  }, {
    key: "ref",
    value: function ref(x, y) {
      return this.attr('refX', x).attr('refY', y);
    } // Update marker

  }, {
    key: "update",
    value: function update(block) {
      // remove all content
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    } // Return the fill id

  }, {
    key: "toString",
    value: function toString() {
      return 'url(#' + this.id() + ')';
    }
  }]);

  return Marker;
}(Container);
registerMethods({
  Container: {
    marker: function marker() {
      var _this$defs;

      // Create marker element in defs
      return (_this$defs = this.defs()).marker.apply(_this$defs, arguments);
    }
  },
  Defs: {
    // Create marker
    marker: wrapWithAttrCheck(function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
    })
  },
  marker: {
    // Create and attach markers
    marker: function marker(_marker, width, height, block) {
      var attr = ['marker']; // Build attribute name

      if (_marker !== 'all') attr.push(_marker);
      attr = attr.join('-'); // Set marker attribute

      _marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width, height, block);
      return this.attr(attr, _marker);
    }
  }
});
register(Marker, 'Marker');

var nativeSort = [].sort;
var test$2 = [1, 2, 3];

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test$2.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test$2.sort(null);
});
// Old WebKit
var SLOPPY_METHOD$2 = sloppyArrayMethod('sort');

var FORCED$4 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD$2;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$4 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction$1(comparefn));
  }
});

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter(k, f) {
  return function (v) {
    if (v == null) return this[v];
    this[k] = v;
    if (f) f.call(this);
    return this;
  };
}

var easing = {
  '-': function _(pos) {
    return pos;
  },
  '<>': function _(pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5;
  },
  '>': function _(pos) {
    return Math.sin(pos * Math.PI / 2);
  },
  '<': function _(pos) {
    return -Math.cos(pos * Math.PI / 2) + 1;
  },
  bezier: function bezier(x1, y1, x2, y2) {
    // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
    return function (t) {
      if (t < 0) {
        if (x1 > 0) {
          return y1 / x1 * t;
        } else if (x2 > 0) {
          return y2 / x2 * t;
        } else {
          return 0;
        }
      } else if (t > 1) {
        if (x2 < 1) {
          return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2);
        } else if (x1 < 1) {
          return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
        } else {
          return 1;
        }
      } else {
        return 3 * t * Math.pow(1 - t, 2) * y1 + 3 * Math.pow(t, 2) * (1 - t) * y2 + Math.pow(t, 3);
      }
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function steps(_steps) {
    var stepPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'end';
    // deal with "jump-" prefix
    stepPosition = stepPosition.split('-').reverse()[0];
    var jumps = _steps;

    if (stepPosition === 'none') {
      --jumps;
    } else if (stepPosition === 'both') {
      ++jumps;
    } // The beforeFlag is essentially useless


    return function (t) {
      var beforeFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // Step is called currentStep in referenced url
      var step = Math.floor(t * _steps);
      var jumping = t * step % 1 === 0;

      if (stepPosition === 'start' || stepPosition === 'both') {
        ++step;
      }

      if (beforeFlag && jumping) {
        --step;
      }

      if (t >= 0 && step < 0) {
        step = 0;
      }

      if (t <= 1 && step > jumps) {
        step = jumps;
      }

      return step / jumps;
    };
  }
};
var Stepper =
/*#__PURE__*/
function () {
  function Stepper() {
    _classCallCheck(this, Stepper);
  }

  _createClass(Stepper, [{
    key: "done",
    value: function done() {
      return false;
    }
  }]);

  return Stepper;
}();
/***
Easing Functions
================
***/

var Ease =
/*#__PURE__*/
function (_Stepper) {
  _inherits(Ease, _Stepper);

  function Ease(fn) {
    var _this;

    _classCallCheck(this, Ease);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ease).call(this));
    _this.ease = easing[fn || timeline.ease] || fn;
    return _this;
  }

  _createClass(Ease, [{
    key: "step",
    value: function step(from, to, pos) {
      if (typeof from !== 'number') {
        return pos < 1 ? from : to;
      }

      return from + (to - from) * this.ease(pos);
    }
  }]);

  return Ease;
}(Stepper);
/***
Controller Types
================
***/

var Controller =
/*#__PURE__*/
function (_Stepper2) {
  _inherits(Controller, _Stepper2);

  function Controller(fn) {
    var _this2;

    _classCallCheck(this, Controller);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Controller).call(this));
    _this2.stepper = fn;
    return _this2;
  }

  _createClass(Controller, [{
    key: "step",
    value: function step(current, target, dt, c) {
      return this.stepper(current, target, dt, c);
    }
  }, {
    key: "done",
    value: function done(c) {
      return c.done;
    }
  }]);

  return Controller;
}(Stepper);

function recalculate() {
  // Apply the default parameters
  var duration = (this._duration || 500) / 1000;
  var overshoot = this._overshoot || 0; // Calculate the PID natural response

  var eps = 1e-10;
  var pi = Math.PI;
  var os = Math.log(overshoot / 100 + eps);
  var zeta = -os / Math.sqrt(pi * pi + os * os);
  var wn = 3.9 / (zeta * duration); // Calculate the Spring values

  this.d = 2 * zeta * wn;
  this.k = wn * wn;
}

var Spring =
/*#__PURE__*/
function (_Controller) {
  _inherits(Spring, _Controller);

  function Spring(duration, overshoot) {
    var _this3;

    _classCallCheck(this, Spring);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Spring).call(this));

    _this3.duration(duration || 500).overshoot(overshoot || 0);

    return _this3;
  }

  _createClass(Spring, [{
    key: "step",
    value: function step(current, target, dt, c) {
      if (typeof current === 'string') return current;
      c.done = dt === Infinity;
      if (dt === Infinity) return target;
      if (dt === 0) return current;
      if (dt > 100) dt = 16;
      dt /= 1000; // Get the previous velocity

      var velocity = c.velocity || 0; // Apply the control to get the new position and store it

      var acceleration = -this.d * velocity - this.k * (current - target);
      var newPosition = current + velocity * dt + acceleration * dt * dt / 2; // Store the velocity

      c.velocity = velocity + acceleration * dt; // Figure out if we have converged, and if so, pass the value

      c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
      return c.done ? target : newPosition;
    }
  }]);

  return Spring;
}(Controller);
extend(Spring, {
  duration: makeSetterGetter('_duration', recalculate),
  overshoot: makeSetterGetter('_overshoot', recalculate)
});
var PID =
/*#__PURE__*/
function (_Controller2) {
  _inherits(PID, _Controller2);

  function PID(p, i, d, windup) {
    var _this4;

    _classCallCheck(this, PID);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(PID).call(this));
    p = p == null ? 0.1 : p;
    i = i == null ? 0.01 : i;
    d = d == null ? 0 : d;
    windup = windup == null ? 1000 : windup;

    _this4.p(p).i(i).d(d).windup(windup);

    return _this4;
  }

  _createClass(PID, [{
    key: "step",
    value: function step(current, target, dt, c) {
      if (typeof current === 'string') return current;
      c.done = dt === Infinity;
      if (dt === Infinity) return target;
      if (dt === 0) return current;
      var p = target - current;
      var i = (c.integral || 0) + p * dt;
      var d = (p - (c.error || 0)) / dt;
      var windup = this.windup; // antiwindup

      if (windup !== false) {
        i = Math.max(-windup, Math.min(i, windup));
      }

      c.error = p;
      c.integral = i;
      c.done = Math.abs(p) < 0.001;
      return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
    }
  }]);

  return PID;
}(Controller);
extend(PID, {
  windup: makeSetterGetter('windup'),
  p: makeSetterGetter('P'),
  i: makeSetterGetter('I'),
  d: makeSetterGetter('D')
});

var PathArray = subClassArray('PathArray', SVGArray);
function pathRegReplace(a, b, c, d) {
  return c + d.replace(dots, ' .');
}

function arrayToString(a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0];

    if (a[i][1] != null) {
      s += a[i][1];

      if (a[i][2] != null) {
        s += ' ';
        s += a[i][2];

        if (a[i][3] != null) {
          s += ' ';
          s += a[i][3];
          s += ' ';
          s += a[i][4];

          if (a[i][5] != null) {
            s += ' ';
            s += a[i][5];
            s += ' ';
            s += a[i][6];

            if (a[i][7] != null) {
              s += ' ';
              s += a[i][7];
            }
          }
        }
      }
    }
  }

  return s + ' ';
}

var pathHandlers = {
  M: function M(c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];
    return ['M', p.x, p.y];
  },
  L: function L(c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['L', c[0], c[1]];
  },
  H: function H(c, p) {
    p.x = c[0];
    return ['H', c[0]];
  },
  V: function V(c, p) {
    p.y = c[0];
    return ['V', c[0]];
  },
  C: function C(c, p) {
    p.x = c[4];
    p.y = c[5];
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]];
  },
  S: function S(c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['S', c[0], c[1], c[2], c[3]];
  },
  Q: function Q(c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['Q', c[0], c[1], c[2], c[3]];
  },
  T: function T(c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['T', c[0], c[1]];
  },
  Z: function Z(c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return ['Z'];
  },
  A: function A(c, p) {
    p.x = c[5];
    p.y = c[6];
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
  }
};
var mlhvqtcsaz = 'mlhvqtcsaz'.split('');

for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = function (i) {
    return function (c, p, p0) {
      if (i === 'H') c[0] = c[0] + p.x;else if (i === 'V') c[0] = c[0] + p.y;else if (i === 'A') {
        c[5] = c[5] + p.x;
        c[6] = c[6] + p.y;
      } else {
        for (var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }
      }
      return pathHandlers[i](c, p, p0);
    };
  }(mlhvqtcsaz[i].toUpperCase());
}

extend(PathArray, {
  // Convert array to string
  toString: function toString() {
    return arrayToString(this);
  },
  // Move path string
  move: function move(x, y) {
    // get bounding box of current situation
    var box = this.bbox(); // get relative offset

    x -= box.x;
    y -= box.y;

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.length - 1; i >= 0; i--) {
        l = this[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] += x;
          this[i][2] += y;
        } else if (l === 'H') {
          this[i][1] += x;
        } else if (l === 'V') {
          this[i][1] += y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] += x;
          this[i][2] += y;
          this[i][3] += x;
          this[i][4] += y;

          if (l === 'C') {
            this[i][5] += x;
            this[i][6] += y;
          }
        } else if (l === 'A') {
          this[i][6] += x;
          this[i][7] += y;
        }
      }
    }

    return this;
  },
  // Resize path string
  size: function size(width, height) {
    // get bounding box of current situation
    var box = this.bbox();
    var i, l; // If the box width or height is 0 then we ignore
    // transformations on the respective axis

    box.width = box.width === 0 ? 1 : box.width;
    box.height = box.height === 0 ? 1 : box.height; // recalculate position of all points according to new size

    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0];

      if (l === 'M' || l === 'L' || l === 'T') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
      } else if (l === 'H') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
      } else if (l === 'V') {
        this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
        this[i][3] = (this[i][3] - box.x) * width / box.width + box.x;
        this[i][4] = (this[i][4] - box.y) * height / box.height + box.y;

        if (l === 'C') {
          this[i][5] = (this[i][5] - box.x) * width / box.width + box.x;
          this[i][6] = (this[i][6] - box.y) * height / box.height + box.y;
        }
      } else if (l === 'A') {
        // resize radii
        this[i][1] = this[i][1] * width / box.width;
        this[i][2] = this[i][2] * height / box.height; // move position values

        this[i][6] = (this[i][6] - box.x) * width / box.width + box.x;
        this[i][7] = (this[i][7] - box.y) * height / box.height + box.y;
      }
    }

    return this;
  },
  // Test if the passed path array use the same path data commands as this path array
  equalCommands: function equalCommands(pathArray) {
    var i, il, equalCommands;
    pathArray = new PathArray(pathArray);
    equalCommands = this.length === pathArray.length;

    for (i = 0, il = this.length; equalCommands && i < il; i++) {
      equalCommands = this[i][0] === pathArray[i][0];
    }

    return equalCommands;
  },
  // Make path array morphable
  morph: function morph(pathArray) {
    pathArray = new PathArray(pathArray);

    if (this.equalCommands(pathArray)) {
      this.destination = pathArray;
    } else {
      this.destination = null;
    }

    return this;
  },
  // Get morphed path array at given position
  at: function at(pos) {
    // make sure a destination is defined
    if (!this.destination) return this;
    var sourceArray = this;
    var destinationArray = this.destination.value;
    var array = [];
    var pathArray = new PathArray();
    var i, il, j, jl; // Animate has specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement

    for (i = 0, il = sourceArray.length; i < il; i++) {
      array[i] = [sourceArray[i][0]];

      for (j = 1, jl = sourceArray[i].length; j < jl; j++) {
        array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos;
      } // For the two flags of the elliptical arc command, the SVG spec say:
      // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
      // Elliptical arc command as an array followed by corresponding indexes:
      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      //   0    1   2        3                 4             5      6  7


      if (array[i][0] === 'A') {
        array[i][4] = +(array[i][4] !== 0);
        array[i][5] = +(array[i][5] !== 0);
      }
    } // Directly modify the value of a path array, this is done this way for performance


    pathArray.value = array;
    return pathArray;
  },
  // Absolutize and parse path to array
  parse: function parse() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [['M', 0, 0]];
    // if it's already a patharray, no need to parse it
    if (array instanceof PathArray) return array; // prepare for parsing

    var s;
    var paramCnt = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      C: 6,
      S: 4,
      Q: 4,
      T: 2,
      A: 7,
      Z: 0
    };

    if (typeof array === 'string') {
      array = array.replace(numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
      .replace(pathLetters, ' $& ') // put some room between letters and numbers
      .replace(hyphen, '$1 -') // add space before hyphen
      .trim() // trim
      .split(delimiter); // split into array
    } else {
      array = array.reduce(function (prev, curr) {
        return [].concat.call(prev, curr);
      }, []);
    } // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]


    var result = [];
    var p = new Point();
    var p0 = new Point();
    var index = 0;
    var len = array.length;

    do {
      // Test if we have a path letter
      if (isPathLetter.test(array[index])) {
        s = array[index];
        ++index; // If last letter was a move command and we got no new, it defaults to [L]ine
      } else if (s === 'M') {
        s = 'L';
      } else if (s === 'm') {
        s = 'l';
      }

      result.push(pathHandlers[s].call(null, array.slice(index, index = index + paramCnt[s.toUpperCase()]).map(parseFloat), p, p0));
    } while (len > index);

    return result;
  },
  // Get bounding box of path
  bbox: function bbox() {
    parser().path.setAttribute('d', this.toString());
    return parser.nodes.path.getBBox();
  }
});

var Morphable =
/*#__PURE__*/
function () {
  function Morphable(stepper) {
    _classCallCheck(this, Morphable);

    this._stepper = stepper || new Ease('-');
    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  }

  _createClass(Morphable, [{
    key: "from",
    value: function from(val) {
      if (val == null) {
        return this._from;
      }

      this._from = this._set(val);
      return this;
    }
  }, {
    key: "to",
    value: function to(val) {
      if (val == null) {
        return this._to;
      }

      this._to = this._set(val);
      return this;
    }
  }, {
    key: "type",
    value: function type(_type) {
      // getter
      if (_type == null) {
        return this._type;
      } // setter


      this._type = _type;
      return this;
    }
  }, {
    key: "_set",
    value: function _set(value) {
      if (!this._type) {
        var type = _typeof(value);

        if (type === 'number') {
          this.type(SVGNumber);
        } else if (type === 'string') {
          if (Color.isColor(value)) {
            this.type(Color);
          } else if (delimiter.test(value)) {
            this.type(pathLetters.test(value) ? PathArray : SVGArray);
          } else if (numberAndUnit.test(value)) {
            this.type(SVGNumber);
          } else {
            this.type(NonMorphable);
          }
        } else if (morphableTypes.indexOf(value.constructor) > -1) {
          this.type(value.constructor);
        } else if (Array.isArray(value)) {
          this.type(SVGArray);
        } else if (type === 'object') {
          this.type(ObjectBag);
        } else {
          this.type(NonMorphable);
        }
      }

      var result = new this._type(value);

      if (this._type === Color) {
        result = this._to ? result[this._to[4]]() : this._from ? result[this._from[4]]() : result;
      }

      result = result.toArray();
      this._morphObj = this._morphObj || new this._type();
      this._context = this._context || Array.apply(null, Array(result.length)).map(Object).map(function (o) {
        o.done = true;
        return o;
      });
      return result;
    }
  }, {
    key: "stepper",
    value: function stepper(_stepper) {
      if (_stepper == null) return this._stepper;
      this._stepper = _stepper;
      return this;
    }
  }, {
    key: "done",
    value: function done() {
      var complete = this._context.map(this._stepper.done).reduce(function (last, curr) {
        return last && curr;
      }, true);

      return complete;
    }
  }, {
    key: "at",
    value: function at(pos) {
      var _this = this;

      return this._morphObj.fromArray(this._from.map(function (i, index) {
        return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context);
      }));
    }
  }]);

  return Morphable;
}();
var NonMorphable =
/*#__PURE__*/
function () {
  function NonMorphable() {
    _classCallCheck(this, NonMorphable);

    this.init.apply(this, arguments);
  }

  _createClass(NonMorphable, [{
    key: "init",
    value: function init(val) {
      val = Array.isArray(val) ? val[0] : val;
      this.value = val;
      return this;
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this.value];
    }
  }]);

  return NonMorphable;
}();
var TransformBag =
/*#__PURE__*/
function () {
  function TransformBag() {
    _classCallCheck(this, TransformBag);

    this.init.apply(this, arguments);
  }

  _createClass(TransformBag, [{
    key: "init",
    value: function init(obj) {
      if (Array.isArray(obj)) {
        obj = {
          scaleX: obj[0],
          scaleY: obj[1],
          shear: obj[2],
          rotate: obj[3],
          translateX: obj[4],
          translateY: obj[5],
          originX: obj[6],
          originY: obj[7]
        };
      }

      Object.assign(this, TransformBag.defaults, obj);
      return this;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var v = this;
      return [v.scaleX, v.scaleY, v.shear, v.rotate, v.translateX, v.translateY, v.originX, v.originY];
    }
  }]);

  return TransformBag;
}();
TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
var ObjectBag =
/*#__PURE__*/
function () {
  function ObjectBag() {
    _classCallCheck(this, ObjectBag);

    this.init.apply(this, arguments);
  }

  _createClass(ObjectBag, [{
    key: "init",
    value: function init(objOrArr) {
      this.values = [];

      if (Array.isArray(objOrArr)) {
        this.values = objOrArr;
        return;
      }

      objOrArr = objOrArr || {};
      var entries = [];

      for (var i in objOrArr) {
        entries.push([i, objOrArr[i]]);
      }

      entries.sort(function (a, b) {
        return a[0] - b[0];
      });
      this.values = entries.reduce(function (last, curr) {
        return last.concat(curr);
      }, []);
      return this;
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      var obj = {};
      var arr = this.values;

      for (var i = 0, len = arr.length; i < len; i += 2) {
        obj[arr[i]] = arr[i + 1];
      }

      return obj;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return this.values;
    }
  }]);

  return ObjectBag;
}();
var morphableTypes = [NonMorphable, TransformBag, ObjectBag];
function registerMorphableType() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  morphableTypes.push.apply(morphableTypes, _toConsumableArray([].concat(type)));
}
function makeMorphable() {
  extend(morphableTypes, {
    to: function to(val) {
      return new Morphable().type(this.constructor).from(this.valueOf()).to(val);
    },
    fromArray: function fromArray(arr) {
      this.init(arr);
      return this;
    }
  });
}

var Path =
/*#__PURE__*/
function (_Shape) {
  _inherits(Path, _Shape);

  // Initialize node
  function Path(node) {
    _classCallCheck(this, Path);

    return _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, nodeOrNew('path', node), node));
  } // Get array


  _createClass(Path, [{
    key: "array",
    value: function array() {
      return this._array || (this._array = new PathArray(this.attr('d')));
    } // Plot new path

  }, {
    key: "plot",
    value: function plot(d) {
      return d == null ? this.array() : this.clear().attr('d', typeof d === 'string' ? d : this._array = new PathArray(d));
    } // Clear array cache

  }, {
    key: "clear",
    value: function clear() {
      delete this._array;
      return this;
    } // Move by left top corner

  }, {
    key: "move",
    value: function move(x, y) {
      return this.attr('d', this.array().move(x, y));
    } // Move by left top corner over x-axis

  }, {
    key: "x",
    value: function x(_x) {
      return _x == null ? this.bbox().x : this.move(_x, this.bbox().y);
    } // Move by left top corner over y-axis

  }, {
    key: "y",
    value: function y(_y) {
      return _y == null ? this.bbox().y : this.move(this.bbox().x, _y);
    } // Set element size to given width and height

  }, {
    key: "size",
    value: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.attr('d', this.array().size(p.width, p.height));
    } // Set width of element

  }, {
    key: "width",
    value: function width(_width) {
      return _width == null ? this.bbox().width : this.size(_width, this.bbox().height);
    } // Set height of element

  }, {
    key: "height",
    value: function height(_height) {
      return _height == null ? this.bbox().height : this.size(this.bbox().width, _height);
    }
  }, {
    key: "targets",
    value: function targets() {
      return baseFind('svg textpath [href*="' + this.id() + '"]');
    }
  }]);

  return Path;
}(Shape); // Define morphable array
Path.prototype.MorphArray = PathArray; // Add parent method

registerMethods({
  Container: {
    // Create a wrapped path element
    path: wrapWithAttrCheck(function (d) {
      // make sure plot is called as a setter
      return this.put(new Path()).plot(d || new PathArray());
    })
  }
});
register(Path, 'Path');

function array() {
  return this._array || (this._array = new PointArray(this.attr('points')));
} // Plot new path

function plot(p) {
  return p == null ? this.array() : this.clear().attr('points', typeof p === 'string' ? p : this._array = new PointArray(p));
} // Clear array cache

function clear() {
  delete this._array;
  return this;
} // Move by left top corner

function move(x, y) {
  return this.attr('points', this.array().move(x, y));
} // Set element size to given width and height

function size(width, height) {
  var p = proportionalSize(this, width, height);
  return this.attr('points', this.array().size(p.width, p.height));
}

var poly = ({
	__proto__: null,
	array: array,
	plot: plot,
	clear: clear,
	move: move,
	size: size
});

var Polygon =
/*#__PURE__*/
function (_Shape) {
  _inherits(Polygon, _Shape);

  // Initialize node
  function Polygon(node) {
    _classCallCheck(this, Polygon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, nodeOrNew('polygon', node), node));
  }

  return Polygon;
}(Shape);
registerMethods({
  Container: {
    // Create a wrapped polygon element
    polygon: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray());
    })
  }
});
extend(Polygon, pointed);
extend(Polygon, poly);
register(Polygon, 'Polygon');

var Polyline =
/*#__PURE__*/
function (_Shape) {
  _inherits(Polyline, _Shape);

  // Initialize node
  function Polyline(node) {
    _classCallCheck(this, Polyline);

    return _possibleConstructorReturn(this, _getPrototypeOf(Polyline).call(this, nodeOrNew('polyline', node), node));
  }

  return Polyline;
}(Shape);
registerMethods({
  Container: {
    // Create a wrapped polygon element
    polyline: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray());
    })
  }
});
extend(Polyline, pointed);
extend(Polyline, poly);
register(Polyline, 'Polyline');

var Rect =
/*#__PURE__*/
function (_Shape) {
  _inherits(Rect, _Shape);

  // Initialize node
  function Rect(node) {
    _classCallCheck(this, Rect);

    return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, nodeOrNew('rect', node), node));
  }

  return Rect;
}(Shape);
extend(Rect, {
  rx: rx,
  ry: ry
});
registerMethods({
  Container: {
    // Create a rect element
    rect: wrapWithAttrCheck(function (width, height) {
      return this.put(new Rect()).size(width, height);
    })
  }
});
register(Rect, 'Rect');

var max$3 = Math.max;
var min$4 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$4(max$3(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

var Queue =
/*#__PURE__*/
function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this._first = null;
    this._last = null;
  }

  _createClass(Queue, [{
    key: "push",
    value: function push(value) {
      // An item stores an id and the provided value
      var item = value.next ? value : {
        value: value,
        next: null,
        prev: null
      }; // Deal with the queue being empty or populated

      if (this._last) {
        item.prev = this._last;
        this._last.next = item;
        this._last = item;
      } else {
        this._last = item;
        this._first = item;
      } // Return the current item


      return item;
    }
  }, {
    key: "shift",
    value: function shift() {
      // Check if we have a value
      var remove = this._first;
      if (!remove) return null; // If we do, remove it and relink things

      this._first = remove.next;
      if (this._first) this._first.prev = null;
      this._last = this._first ? this._last : null;
      return remove.value;
    } // Shows us the first item in the list

  }, {
    key: "first",
    value: function first() {
      return this._first && this._first.value;
    } // Shows us the last item in the list

  }, {
    key: "last",
    value: function last() {
      return this._last && this._last.value;
    } // Removes the item that was returned from the push

  }, {
    key: "remove",
    value: function remove(item) {
      // Relink the previous item
      if (item.prev) item.prev.next = item.next;
      if (item.next) item.next.prev = item.prev;
      if (item === this._last) this._last = item.prev;
      if (item === this._first) this._first = item.next; // Invalidate item

      item.prev = null;
      item.next = null;
    }
  }]);

  return Queue;
}();

var Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: function timer() {
    return globals.window.performance || globals.window.Date;
  },
  transforms: [],
  frame: function frame(fn) {
    // Store the node
    var node = Animator.frames.push({
      run: fn
    }); // Request an animation frame if we don't have one

    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    } // Return the node so we can remove it easily


    return node;
  },
  timeout: function timeout(fn, delay) {
    delay = delay || 0; // Work out when the event should fire

    var time = Animator.timer().now() + delay; // Add the timeout to the end of the queue

    var node = Animator.timeouts.push({
      run: fn,
      time: time
    }); // Request another animation frame if we need one

    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node;
  },
  immediate: function immediate(fn) {
    // Add the immediate fn to the end of the queue
    var node = Animator.immediates.push(fn); // Request another animation frame if we need one

    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node;
  },
  cancelFrame: function cancelFrame(node) {
    node != null && Animator.frames.remove(node);
  },
  clearTimeout: function clearTimeout(node) {
    node != null && Animator.timeouts.remove(node);
  },
  cancelImmediate: function cancelImmediate(node) {
    node != null && Animator.immediates.remove(node);
  },
  _draw: function _draw(now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    var nextTimeout = null;
    var lastTimeout = Animator.timeouts.last();

    while (nextTimeout = Animator.timeouts.shift()) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run();
      } else {
        Animator.timeouts.push(nextTimeout);
      } // If we hit the last item, we should stop shifting out more items


      if (nextTimeout === lastTimeout) break;
    } // Run all of the animation frames


    var nextFrame = null;
    var lastFrame = Animator.frames.last();

    while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
      nextFrame.run(now);
    }

    var nextImmediate = null;

    while (nextImmediate = Animator.immediates.shift()) {
      nextImmediate();
    } // If we have remaining timeouts or frames, draw until we don't anymore


    Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first() ? globals.window.requestAnimationFrame(Animator._draw) : null;
  }
};

var makeSchedule = function makeSchedule(runnerInfo) {
  var start = runnerInfo.start;
  var duration = runnerInfo.runner.duration();
  var end = start + duration;
  return {
    start: start,
    duration: duration,
    end: end,
    runner: runnerInfo.runner
  };
};

var defaultSource = function defaultSource() {
  var w = globals.window;
  return (w.performance || w.Date).now();
};

var Timeline =
/*#__PURE__*/
function (_EventTarget) {
  _inherits(Timeline, _EventTarget);

  // Construct a new timeline on the given element
  function Timeline() {
    var _this;

    var timeSource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultSource;

    _classCallCheck(this, Timeline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Timeline).call(this));
    _this._timeSource = timeSource; // Store the timing variables

    _this._startTime = 0;
    _this._speed = 1.0; // Determines how long a runner is hold in memory. Can be a dt or true/false

    _this._persist = 0; // Keep track of the running animations and their starting parameters

    _this._nextFrame = null;
    _this._paused = true;
    _this._runners = [];
    _this._runnerIds = [];
    _this._lastRunnerId = -1;
    _this._time = 0;
    _this._lastSourceTime = 0;
    _this._lastStepTime = 0; // Make sure that step is always called in class context

    _this._step = _this._stepFn.bind(_assertThisInitialized(_this), false);
    _this._stepImmediate = _this._stepFn.bind(_assertThisInitialized(_this), true);
    return _this;
  } // schedules a runner on the timeline


  _createClass(Timeline, [{
    key: "schedule",
    value: function schedule(runner, delay, when) {
      if (runner == null) {
        return this._runners.map(makeSchedule);
      } // The start time for the next animation can either be given explicitly,
      // derived from the current timeline time or it can be relative to the
      // last start time to chain animations direclty


      var absoluteStartTime = 0;
      var endTime = this.getEndTime();
      delay = delay || 0; // Work out when to start the animation

      if (when == null || when === 'last' || when === 'after') {
        // Take the last time and increment
        absoluteStartTime = endTime;
      } else if (when === 'absolute' || when === 'start') {
        absoluteStartTime = delay;
        delay = 0;
      } else if (when === 'now') {
        absoluteStartTime = this._time;
      } else if (when === 'relative') {
        var _runnerInfo = this._runners[runner.id];

        if (_runnerInfo) {
          absoluteStartTime = _runnerInfo.start + delay;
          delay = 0;
        }
      } else {
        throw new Error('Invalid value for the "when" parameter');
      } // Manage runner


      runner.unschedule();
      runner.timeline(this);
      var persist = runner.persist();
      var runnerInfo = {
        persist: persist === null ? this._persist : persist,
        start: absoluteStartTime + delay,
        runner: runner
      };
      this._lastRunnerId = runner.id;

      this._runners.push(runnerInfo);

      this._runners.sort(function (a, b) {
        return a.start - b.start;
      });

      this._runnerIds = this._runners.map(function (info) {
        return info.runner.id;
      });

      this.updateTime()._continue();

      return this;
    } // Remove the runner from this timeline

  }, {
    key: "unschedule",
    value: function unschedule(runner) {
      var index = this._runnerIds.indexOf(runner.id);

      if (index < 0) return this;

      this._runners.splice(index, 1);

      this._runnerIds.splice(index, 1);

      runner.timeline(null);
      return this;
    } // Calculates the end of the timeline

  }, {
    key: "getEndTime",
    value: function getEndTime() {
      var lastRunnerInfo = this._runners[this._runnerIds.indexOf(this._lastRunnerId)];

      var lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
      var lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : 0;
      return lastStartTime + lastDuration;
    }
  }, {
    key: "getEndTimeOfTimeline",
    value: function getEndTimeOfTimeline() {
      var lastEndTime = 0;

      for (var i = 0; i < this._runners.length; i++) {
        var runnerInfo = this._runners[i];
        var duration = runnerInfo ? runnerInfo.runner.duration() : 0;
        var startTime = runnerInfo ? runnerInfo.start : 0;
        var endTime = startTime + duration;

        if (endTime > lastEndTime) {
          lastEndTime = endTime;
        }
      }

      return lastEndTime;
    } // Makes sure, that after pausing the time doesn't jump

  }, {
    key: "updateTime",
    value: function updateTime() {
      if (!this.active()) {
        this._lastSourceTime = this._timeSource();
      }

      return this;
    }
  }, {
    key: "play",
    value: function play() {
      // Now make sure we are not paused and continue the animation
      this._paused = false;
      return this.updateTime()._continue();
    }
  }, {
    key: "pause",
    value: function pause() {
      this._paused = true;
      return this._continue();
    }
  }, {
    key: "stop",
    value: function stop() {
      // Go to start and pause
      this.time(0);
      return this.pause();
    }
  }, {
    key: "finish",
    value: function finish() {
      // Go to end and pause
      this.time(this.getEndTimeOfTimeline() + 1);
      return this.pause();
    }
  }, {
    key: "speed",
    value: function speed(_speed) {
      if (_speed == null) return this._speed;
      this._speed = _speed;
      return this;
    }
  }, {
    key: "reverse",
    value: function reverse(yes) {
      var currentSpeed = this.speed();
      if (yes == null) return this.speed(-currentSpeed);
      var positive = Math.abs(currentSpeed);
      return this.speed(yes ? positive : -positive);
    }
  }, {
    key: "seek",
    value: function seek(dt) {
      return this.time(this._time + dt);
    }
  }, {
    key: "time",
    value: function time(_time) {
      if (_time == null) return this._time;
      this._time = _time;
      return this._continue(true);
    }
  }, {
    key: "persist",
    value: function persist(dtOrForever) {
      if (dtOrForever == null) return this._persist;
      this._persist = dtOrForever;
      return this;
    }
  }, {
    key: "source",
    value: function source(fn) {
      if (fn == null) return this._timeSource;
      this._timeSource = fn;
      return this;
    }
  }, {
    key: "_stepFn",
    value: function _stepFn() {
      var immediateStep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      // Get the time delta from the last time and update the time
      var time = this._timeSource();

      var dtSource = time - this._lastSourceTime;
      if (immediateStep) dtSource = 0;
      var dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
      this._lastSourceTime = time; // Only update the time if we use the timeSource.
      // Otherwise use the current time

      if (!immediateStep) {
        // Update the time
        this._time += dtTime;
        this._time = this._time < 0 ? 0 : this._time;
      }

      this._lastStepTime = this._time;
      this.fire('time', this._time); // This is for the case that the timeline was seeked so that the time
      // is now before the startTime of the runner. Thats why we need to set
      // the runner to position 0
      // FIXME:
      // However, reseting in insertion order leads to bugs. Considering the case,
      // where 2 runners change the same attriute but in different times,
      // reseting both of them will lead to the case where the later defined
      // runner always wins the reset even if the other runner started earlier
      // and therefore should win the attribute battle
      // this can be solved by reseting them backwards

      for (var k = this._runners.length; k--;) {
        // Get and run the current runner and ignore it if its inactive
        var runnerInfo = this._runners[k];
        var runner = runnerInfo.runner; // Make sure that we give the actual difference
        // between runner start time and now

        var dtToStart = this._time - runnerInfo.start; // Dont run runner if not started yet
        // and try to reset it

        if (dtToStart <= 0) {
          runner.reset();
        }
      } // Run all of the runners directly


      var runnersLeft = false;

      for (var i = 0, len = this._runners.length; i < len; i++) {
        // Get and run the current runner and ignore it if its inactive
        var _runnerInfo2 = this._runners[i];
        var _runner = _runnerInfo2.runner;
        var dt = dtTime; // Make sure that we give the actual difference
        // between runner start time and now

        var _dtToStart = this._time - _runnerInfo2.start; // Dont run runner if not started yet


        if (_dtToStart <= 0) {
          runnersLeft = true;
          continue;
        } else if (_dtToStart < dt) {
          // Adjust dt to make sure that animation is on point
          dt = _dtToStart;
        }

        if (!_runner.active()) continue; // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner

        var finished = _runner.step(dt).done;

        if (!finished) {
          runnersLeft = true; // continue
        } else if (_runnerInfo2.persist !== true) {
          // runner is finished. And runner might get removed
          var endTime = _runner.duration() - _runner.time() + this._time;

          if (endTime + _runnerInfo2.persist < this._time) {
            // Delete runner and correct index
            _runner.unschedule();

            --i;
            --len;
          }
        }
      } // Basically: we continue when there are runners right from us in time
      // when -->, and when runners are left from us when <--


      if (runnersLeft && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0) {
        this._continue();
      } else {
        this.pause();
        this.fire('finished');
      }

      return this;
    } // Checks if we are running and continues the animation

  }, {
    key: "_continue",
    value: function _continue() {
      var immediateStep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      Animator.cancelFrame(this._nextFrame);
      this._nextFrame = null;
      if (immediateStep) return this._stepImmediate();
      if (this._paused) return this;
      this._nextFrame = Animator.frame(this._step);
      return this;
    }
  }, {
    key: "active",
    value: function active() {
      return !!this._nextFrame;
    }
  }]);

  return Timeline;
}(EventTarget);
registerMethods({
  Element: {
    timeline: function timeline(_timeline) {
      if (_timeline == null) {
        this._timeline = this._timeline || new Timeline();
        return this._timeline;
      } else {
        this._timeline = _timeline;
        return this;
      }
    }
  }
});

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Runner =
/*#__PURE__*/
function (_EventTarget) {
  _inherits(Runner, _EventTarget);

  function Runner(options) {
    var _this;

    _classCallCheck(this, Runner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Runner).call(this)); // Store a unique id on the runner, so that we can identify it later

    _this.id = Runner.id++; // Ensure a default value

    options = options == null ? timeline.duration : options; // Ensure that we get a controller

    options = typeof options === 'function' ? new Controller(options) : options; // Declare all of the variables

    _this._element = null;
    _this._timeline = null;
    _this.done = false;
    _this._queue = []; // Work out the stepper and the duration

    _this._duration = typeof options === 'number' && options;
    _this._isDeclarative = options instanceof Controller;
    _this._stepper = _this._isDeclarative ? options : new Ease(); // We copy the current values from the timeline because they can change

    _this._history = {}; // Store the state of the runner

    _this.enabled = true;
    _this._time = 0;
    _this._lastTime = 0; // At creation, the runner is in reseted state

    _this._reseted = true; // Save transforms applied to this runner

    _this.transforms = new Matrix();
    _this.transformId = 1; // Looping variables

    _this._haveReversed = false;
    _this._reverse = false;
    _this._loopsDone = 0;
    _this._swing = false;
    _this._wait = 0;
    _this._times = 1;
    _this._frameId = null; // Stores how long a runner is stored after beeing done

    _this._persist = _this._isDeclarative ? true : null;
    return _this;
  }
  /*
  Runner Definitions
  ==================
  These methods help us define the runtime behaviour of the Runner or they
  help us make new runners from the current runner
  */


  _createClass(Runner, [{
    key: "element",
    value: function element(_element) {
      if (_element == null) return this._element;
      this._element = _element;

      _element._prepareRunner();

      return this;
    }
  }, {
    key: "timeline",
    value: function timeline(_timeline) {
      // check explicitly for undefined so we can set the timeline to null
      if (typeof _timeline === 'undefined') return this._timeline;
      this._timeline = _timeline;
      return this;
    }
  }, {
    key: "animate",
    value: function animate(duration, delay, when) {
      var o = Runner.sanitise(duration, delay, when);
      var runner = new Runner(o.duration);
      if (this._timeline) runner.timeline(this._timeline);
      if (this._element) runner.element(this._element);
      return runner.loop(o).schedule(o.delay, o.when);
    }
  }, {
    key: "schedule",
    value: function schedule(timeline, delay, when) {
      // The user doesn't need to pass a timeline if we already have one
      if (!(timeline instanceof Timeline)) {
        when = delay;
        delay = timeline;
        timeline = this.timeline();
      } // If there is no timeline, yell at the user...


      if (!timeline) {
        throw Error('Runner cannot be scheduled without timeline');
      } // Schedule the runner on the timeline provided


      timeline.schedule(this, delay, when);
      return this;
    }
  }, {
    key: "unschedule",
    value: function unschedule() {
      var timeline = this.timeline();
      timeline && timeline.unschedule(this);
      return this;
    }
  }, {
    key: "loop",
    value: function loop(times, swing, wait) {
      // Deal with the user passing in an object
      if (_typeof(times) === 'object') {
        swing = times.swing;
        wait = times.wait;
        times = times.times;
      } // Sanitise the values and store them


      this._times = times || Infinity;
      this._swing = swing || false;
      this._wait = wait || 0; // Allow true to be passed

      if (this._times === true) {
        this._times = Infinity;
      }

      return this;
    }
  }, {
    key: "delay",
    value: function delay(_delay) {
      return this.animate(0, _delay);
    }
    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */

  }, {
    key: "queue",
    value: function queue(initFn, runFn, retargetFn, isTransform) {
      this._queue.push({
        initialiser: initFn || noop,
        runner: runFn || noop,
        retarget: retargetFn,
        isTransform: isTransform,
        initialised: false,
        finished: false
      });

      var timeline = this.timeline();
      timeline && this.timeline()._continue();
      return this;
    }
  }, {
    key: "during",
    value: function during(fn) {
      return this.queue(null, fn);
    }
  }, {
    key: "after",
    value: function after(fn) {
      return this.on('finished', fn);
    }
    /*
    Runner animation methods
    ========================
    Control how the animation plays
    */

  }, {
    key: "time",
    value: function time(_time) {
      if (_time == null) {
        return this._time;
      }

      var dt = _time - this._time;
      this.step(dt);
      return this;
    }
  }, {
    key: "duration",
    value: function duration() {
      return this._times * (this._wait + this._duration) - this._wait;
    }
  }, {
    key: "loops",
    value: function loops(p) {
      var loopDuration = this._duration + this._wait;

      if (p == null) {
        var loopsDone = Math.floor(this._time / loopDuration);
        var relativeTime = this._time - loopsDone * loopDuration;
        var position = relativeTime / this._duration;
        return Math.min(loopsDone + position, this._times);
      }

      var whole = Math.floor(p);
      var partial = p % 1;
      var time = loopDuration * whole + this._duration * partial;
      return this.time(time);
    }
  }, {
    key: "persist",
    value: function persist(dtOrForever) {
      if (dtOrForever == null) return this._persist;
      this._persist = dtOrForever;
      return this;
    }
  }, {
    key: "position",
    value: function position(p) {
      // Get all of the variables we need
      var x = this._time;
      var d = this._duration;
      var w = this._wait;
      var t = this._times;
      var s = this._swing;
      var r = this._reverse;
      var position;

      if (p == null) {
        /*
        This function converts a time to a position in the range [0, 1]
        The full explanation can be found in this desmos demonstration
          https://www.desmos.com/calculator/u4fbavgche
        The logic is slightly simplified here because we can use booleans
        */
        // Figure out the value without thinking about the start or end time
        var f = function f(x) {
          var swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
          var backwards = swinging && !r || !swinging && r;
          var uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
          var clipped = Math.max(Math.min(uncliped, 1), 0);
          return clipped;
        }; // Figure out the value by incorporating the start time


        var endTime = t * (w + d) - w;
        position = x <= 0 ? Math.round(f(1e-5)) : x < endTime ? f(x) : Math.round(f(endTime - 1e-5));
        return position;
      } // Work out the loops done and add the position to the loops done


      var loopsDone = Math.floor(this.loops());
      var swingForward = s && loopsDone % 2 === 0;
      var forwards = swingForward && !r || r && swingForward;
      position = loopsDone + (forwards ? p : 1 - p);
      return this.loops(position);
    }
  }, {
    key: "progress",
    value: function progress(p) {
      if (p == null) {
        return Math.min(1, this._time / this.duration());
      }

      return this.time(p * this.duration());
    }
  }, {
    key: "step",
    value: function step(dt) {
      // If we are inactive, this stepper just gets skipped
      if (!this.enabled) return this; // Update the time and get the new position

      dt = dt == null ? 16 : dt;
      this._time += dt;
      var position = this.position(); // Figure out if we need to run the stepper in this frame

      var running = this._lastPosition !== position && this._time >= 0;
      this._lastPosition = position; // Figure out if we just started

      var duration = this.duration();
      var justStarted = this._lastTime <= 0 && this._time > 0;
      var justFinished = this._lastTime < duration && this._time >= duration;
      this._lastTime = this._time;

      if (justStarted) {
        this.fire('start', this);
      } // Work out if the runner is finished set the done flag here so animations
      // know, that they are running in the last step (this is good for
      // transformations which can be merged)


      var declarative = this._isDeclarative;
      this.done = !declarative && !justFinished && this._time >= duration; // Runner is running. So its not in reseted state anymore

      this._reseted = false; // Call initialise and the run function

      if (running || declarative) {
        this._initialise(running); // clear the transforms on this runner so they dont get added again and again


        this.transforms = new Matrix();

        var converged = this._run(declarative ? dt : position);

        this.fire('step', this);
      } // correct the done flag here
      // declaritive animations itself know when they converged


      this.done = this.done || converged && declarative;

      if (justFinished) {
        this.fire('finished', this);
      }

      return this;
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this._reseted) return this;
      this.time(0);
      this._reseted = true;
      return this;
    }
  }, {
    key: "finish",
    value: function finish() {
      return this.step(Infinity);
    }
  }, {
    key: "reverse",
    value: function reverse(_reverse) {
      this._reverse = _reverse == null ? !this._reverse : _reverse;
      return this;
    }
  }, {
    key: "ease",
    value: function ease(fn) {
      this._stepper = new Ease(fn);
      return this;
    }
  }, {
    key: "active",
    value: function active(enabled) {
      if (enabled == null) return this.enabled;
      this.enabled = enabled;
      return this;
    }
    /*
    Private Methods
    ===============
    Methods that shouldn't be used externally
    */
    // Save a morpher to the morpher list so that we can retarget it later

  }, {
    key: "_rememberMorpher",
    value: function _rememberMorpher(method, morpher) {
      this._history[method] = {
        morpher: morpher,
        caller: this._queue[this._queue.length - 1]
      }; // We have to resume the timeline in case a controller
      // is already done without beeing ever run
      // This can happen when e.g. this is done:
      //    anim = el.animate(new SVG.Spring)
      // and later
      //    anim.move(...)

      if (this._isDeclarative) {
        var timeline = this.timeline();
        timeline && timeline.play();
      }
    } // Try to set the target for a morpher if the morpher exists, otherwise
    // do nothing and return false

  }, {
    key: "_tryRetarget",
    value: function _tryRetarget(method, target, extra) {
      if (this._history[method]) {
        // if the last method wasnt even initialised, throw it away
        if (!this._history[method].caller.initialised) {
          var index = this._queue.indexOf(this._history[method].caller);

          this._queue.splice(index, 1);

          return false;
        } // for the case of transformations, we use the special retarget function
        // which has access to the outer scope


        if (this._history[method].caller.retarget) {
          this._history[method].caller.retarget(target, extra); // for everything else a simple morpher change is sufficient

        } else {
          this._history[method].morpher.to(target);
        }

        this._history[method].caller.finished = false;
        var timeline = this.timeline();
        timeline && timeline.play();
        return true;
      }

      return false;
    } // Run each initialise function in the runner if required

  }, {
    key: "_initialise",
    value: function _initialise(running) {
      // If we aren't running, we shouldn't initialise when not declarative
      if (!running && !this._isDeclarative) return; // Loop through all of the initialisers

      for (var i = 0, len = this._queue.length; i < len; ++i) {
        // Get the current initialiser
        var current = this._queue[i]; // Determine whether we need to initialise

        var needsIt = this._isDeclarative || !current.initialised && running;
        running = !current.finished; // Call the initialiser if we need to

        if (needsIt && running) {
          current.initialiser.call(this);
          current.initialised = true;
        }
      }
    } // Run each run function for the position or dt given

  }, {
    key: "_run",
    value: function _run(positionOrDt) {
      // Run all of the _queue directly
      var allfinished = true;

      for (var i = 0, len = this._queue.length; i < len; ++i) {
        // Get the current function to run
        var current = this._queue[i]; // Run the function if its not finished, we keep track of the finished
        // flag for the sake of declarative _queue

        var converged = current.runner.call(this, positionOrDt);
        current.finished = current.finished || converged === true;
        allfinished = allfinished && current.finished;
      } // We report when all of the constructors are finished


      return allfinished;
    }
  }, {
    key: "addTransform",
    value: function addTransform(transform, index) {
      this.transforms.lmultiplyO(transform);
      return this;
    }
  }, {
    key: "clearTransform",
    value: function clearTransform() {
      this.transforms = new Matrix();
      return this;
    } // TODO: Keep track of all transformations so that deletion is faster

  }, {
    key: "clearTransformsFromQueue",
    value: function clearTransformsFromQueue() {
      if (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) {
        this._queue = this._queue.filter(function (item) {
          return !item.isTransform;
        });
      }
    }
  }], [{
    key: "sanitise",
    value: function sanitise(duration, delay, when) {
      // Initialise the default parameters
      var times = 1;
      var swing = false;
      var wait = 0;
      duration = duration || timeline.duration;
      delay = delay || timeline.delay;
      when = when || 'last'; // If we have an object, unpack the values

      if (_typeof(duration) === 'object' && !(duration instanceof Stepper)) {
        delay = duration.delay || delay;
        when = duration.when || when;
        swing = duration.swing || swing;
        times = duration.times || times;
        wait = duration.wait || wait;
        duration = duration.duration || timeline.duration;
      }

      return {
        duration: duration,
        delay: delay,
        swing: swing,
        times: times,
        wait: wait,
        when: when
      };
    }
  }]);

  return Runner;
}(EventTarget);
Runner.id = 0;

var FakeRunner =
/*#__PURE__*/
function () {
  function FakeRunner() {
    var transforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix();
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, FakeRunner);

    this.transforms = transforms;
    this.id = id;
    this.done = done;
  }

  _createClass(FakeRunner, [{
    key: "clearTransformsFromQueue",
    value: function clearTransformsFromQueue() {}
  }]);

  return FakeRunner;
}();

extend([Runner, FakeRunner], {
  mergeWith: function mergeWith(runner) {
    return new FakeRunner(runner.transforms.lmultiply(this.transforms), runner.id);
  }
}); // FakeRunner.emptyRunner = new FakeRunner()

var lmultiply = function lmultiply(last, curr) {
  return last.lmultiplyO(curr);
};

var getRunnerTransform = function getRunnerTransform(runner) {
  return runner.transforms;
};

function mergeTransforms() {
  // Find the matrix to apply to the element and apply it
  var runners = this._transformationRunners.runners;
  var netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
  this.transform(netTransform);

  this._transformationRunners.merge();

  if (this._transformationRunners.length() === 1) {
    this._frameId = null;
  }
}

var RunnerArray =
/*#__PURE__*/
function () {
  function RunnerArray() {
    _classCallCheck(this, RunnerArray);

    this.runners = [];
    this.ids = [];
  }

  _createClass(RunnerArray, [{
    key: "add",
    value: function add(runner) {
      if (this.runners.includes(runner)) return;
      var id = runner.id + 1;
      this.runners.push(runner);
      this.ids.push(id);
      return this;
    }
  }, {
    key: "getByID",
    value: function getByID(id) {
      return this.runners[this.ids.indexOf(id + 1)];
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1);
      this.runners.splice(index, 1);
      return this;
    }
  }, {
    key: "merge",
    value: function merge() {
      var _this2 = this;

      var lastRunner = null;
      this.runners.forEach(function (runner, i) {
        var condition = lastRunner && runner.done && lastRunner.done // don't merge runner when persisted on timeline
        && (!runner._timeline || !runner._timeline._runnerIds.includes(runner.id)) && (!lastRunner._timeline || !lastRunner._timeline._runnerIds.includes(lastRunner.id));

        if (condition) {
          // the +1 happens in the function
          _this2.remove(runner.id);

          _this2.edit(lastRunner.id, runner.mergeWith(lastRunner));
        }

        lastRunner = runner;
      });
      return this;
    }
  }, {
    key: "edit",
    value: function edit(id, newRunner) {
      var index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1, id + 1);
      this.runners.splice(index, 1, newRunner);
      return this;
    }
  }, {
    key: "length",
    value: function length() {
      return this.ids.length;
    }
  }, {
    key: "clearBefore",
    value: function clearBefore(id) {
      var deleteCnt = this.ids.indexOf(id + 1) || 1;
      this.ids.splice(0, deleteCnt, 0);
      this.runners.splice(0, deleteCnt, new FakeRunner()).forEach(function (r) {
        return r.clearTransformsFromQueue();
      });
      return this;
    }
  }]);

  return RunnerArray;
}();

registerMethods({
  Element: {
    animate: function animate(duration, delay, when) {
      var o = Runner.sanitise(duration, delay, when);
      var timeline = this.timeline();
      return new Runner(o.duration).loop(o).element(this).timeline(timeline.play()).schedule(o.delay, o.when);
    },
    delay: function delay(by, when) {
      return this.animate(0, by, when);
    },
    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwfrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore: function _clearTransformRunnersBefore(currentRunner) {
      this._transformationRunners.clearBefore(currentRunner.id);
    },
    _currentTransform: function _currentTransform(current) {
      return this._transformationRunners.runners // we need the equal sign here to make sure, that also transformations
      // on the same runner which execute before the current transformation are
      // taken into account
      .filter(function (runner) {
        return runner.id <= current.id;
      }).map(getRunnerTransform).reduce(lmultiply, new Matrix());
    },
    _addRunner: function _addRunner(runner) {
      this._transformationRunners.add(runner); // Make sure that the runner merge is executed at the very end of
      // all Animator functions. Thats why we use immediate here to execute
      // the merge right after all frames are run


      Animator.cancelImmediate(this._frameId);
      this._frameId = Animator.immediate(mergeTransforms.bind(this));
    },
    _prepareRunner: function _prepareRunner() {
      if (this._frameId == null) {
        this._transformationRunners = new RunnerArray().add(new FakeRunner(new Matrix(this)));
      }
    }
  }
});
extend(Runner, {
  attr: function attr(a, v) {
    return this.styleAttr('attr', a, v);
  },
  // Add animatable styles
  css: function css(s, v) {
    return this.styleAttr('css', s, v);
  },
  styleAttr: function styleAttr(type, name, val) {
    // apply attributes individually
    if (_typeof(name) === 'object') {
      for (var key in name) {
        this.styleAttr(type, key, name[key]);
      }

      return this;
    }

    var morpher = new Morphable(this._stepper).to(val);
    this.queue(function () {
      morpher = morpher.from(this.element()[type](name));
    }, function (pos) {
      this.element()[type](name, morpher.at(pos));
      return morpher.done();
    });
    return this;
  },
  zoom: function zoom(level, point) {
    if (this._tryRetarget('zoom', to, point)) return this;
    var morpher = new Morphable(this._stepper).to(new SVGNumber(level));
    this.queue(function () {
      morpher = morpher.from(this.element().zoom());
    }, function (pos) {
      this.element().zoom(morpher.at(pos), point);
      return morpher.done();
    }, function (newLevel, newPoint) {
      point = newPoint;
      morpher.to(newLevel);
    });

    this._rememberMorpher('zoom', morpher);

    return this;
  },

  /**
   ** absolute transformations
   **/
  //
  // M v -----|-----(D M v = F v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once)
  //    t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms
  //    (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
  //   - Note F(0) = M
  //   - Note F(1) = T
  // 4. Now you get the delta matrix as a result: D = F * inv(M)
  transform: function transform(transforms, relative, affine) {
    // If we have a declarative function, we should retarget it if possible
    relative = transforms.relative || relative;

    if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
      return this;
    } // Parse the parameters


    var isMatrix = Matrix.isMatrixLike(transforms);
    affine = transforms.affine != null ? transforms.affine : affine != null ? affine : !isMatrix; // Create a morepher and set its type

    var morpher = new Morphable(this._stepper).type(affine ? TransformBag : Matrix);
    var origin;
    var element;
    var current;
    var currentAngle;
    var startTransform;

    function setup() {
      // make sure element and origin is defined
      element = element || this.element();
      origin = origin || getOrigin(transforms, element);
      startTransform = new Matrix(relative ? undefined : element); // add the runner to the element so it can merge transformations

      element._addRunner(this); // Deactivate all transforms that have run so far if we are absolute


      if (!relative) {
        element._clearTransformRunnersBefore(this);
      }
    }

    function run(pos) {
      // clear all other transforms before this in case something is saved
      // on this runner. We are absolute. We dont need these!
      if (!relative) this.clearTransform();

      var _transform = new Point(origin).transform(element._currentTransform(this)),
          x = _transform.x,
          y = _transform.y;

      var target = new Matrix(_objectSpread$1({}, transforms, {
        origin: [x, y]
      }));
      var start = this._isDeclarative && current ? current : startTransform;

      if (affine) {
        target = target.decompose(x, y);
        start = start.decompose(x, y); // Get the current and target angle as it was set

        var rTarget = target.rotate;
        var rCurrent = start.rotate; // Figure out the shortest path to rotate directly

        var possibilities = [rTarget - 360, rTarget, rTarget + 360];
        var distances = possibilities.map(function (a) {
          return Math.abs(a - rCurrent);
        });
        var shortest = Math.min.apply(Math, _toConsumableArray(distances));
        var index = distances.indexOf(shortest);
        target.rotate = possibilities[index];
      }

      if (relative) {
        // we have to be careful here not to overwrite the rotation
        // with the rotate method of Matrix
        if (!isMatrix) {
          target.rotate = transforms.rotate || 0;
        }

        if (this._isDeclarative && currentAngle) {
          start.rotate = currentAngle;
        }
      }

      morpher.from(start);
      morpher.to(target);
      var affineParameters = morpher.at(pos);
      currentAngle = affineParameters.rotate;
      current = new Matrix(affineParameters);
      this.addTransform(current);

      element._addRunner(this);

      return morpher.done();
    }

    function retarget(newTransforms) {
      // only get a new origin if it changed since the last call
      if ((newTransforms.origin || 'center').toString() !== (transforms.origin || 'center').toString()) {
        origin = getOrigin(transforms, element);
      } // overwrite the old transformations with the new ones


      transforms = _objectSpread$1({}, newTransforms, {
        origin: origin
      });
    }

    this.queue(setup, run, retarget, true);
    this._isDeclarative && this._rememberMorpher('transform', morpher);
    return this;
  },
  // Animatable x-axis
  x: function x(_x, relative) {
    return this._queueNumber('x', _x);
  },
  // Animatable y-axis
  y: function y(_y) {
    return this._queueNumber('y', _y);
  },
  dx: function dx() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return this._queueNumberDelta('x', x);
  },
  dy: function dy() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return this._queueNumberDelta('y', y);
  },
  dmove: function dmove(x, y) {
    return this.dx(x).dy(y);
  },
  _queueNumberDelta: function _queueNumberDelta(method, to) {
    to = new SVGNumber(to); // Try to change the target if we have this method already registerd

    if (this._tryRetarget(method, to)) return this; // Make a morpher and queue the animation

    var morpher = new Morphable(this._stepper).to(to);
    var from = null;
    this.queue(function () {
      from = this.element()[method]();
      morpher.from(from);
      morpher.to(from + to);
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    }, function (newTo) {
      morpher.to(from + new SVGNumber(newTo));
    }); // Register the morpher so that if it is changed again, we can retarget it

    this._rememberMorpher(method, morpher);

    return this;
  },
  _queueObject: function _queueObject(method, to) {
    // Try to change the target if we have this method already registerd
    if (this._tryRetarget(method, to)) return this; // Make a morpher and queue the animation

    var morpher = new Morphable(this._stepper).to(to);
    this.queue(function () {
      morpher.from(this.element()[method]());
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    }); // Register the morpher so that if it is changed again, we can retarget it

    this._rememberMorpher(method, morpher);

    return this;
  },
  _queueNumber: function _queueNumber(method, value) {
    return this._queueObject(method, new SVGNumber(value));
  },
  // Animatable center x-axis
  cx: function cx(x) {
    return this._queueNumber('cx', x);
  },
  // Animatable center y-axis
  cy: function cy(y) {
    return this._queueNumber('cy', y);
  },
  // Add animatable move
  move: function move(x, y) {
    return this.x(x).y(y);
  },
  // Add animatable center
  center: function center(x, y) {
    return this.cx(x).cy(y);
  },
  // Add animatable size
  size: function size(width, height) {
    // animate bbox based size for all other elements
    var box;

    if (!width || !height) {
      box = this._element.bbox();
    }

    if (!width) {
      width = box.width / box.height * height;
    }

    if (!height) {
      height = box.height / box.width * width;
    }

    return this.width(width).height(height);
  },
  // Add animatable width
  width: function width(_width) {
    return this._queueNumber('width', _width);
  },
  // Add animatable height
  height: function height(_height) {
    return this._queueNumber('height', _height);
  },
  // Add animatable plot
  plot: function plot(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([a, b, c, d]);
    }

    if (this._tryRetarget('plot', a)) return this;
    var morpher = new Morphable(this._stepper).type(this._element.MorphArray).to(a);
    this.queue(function () {
      morpher.from(this._element.array());
    }, function (pos) {
      this._element.plot(morpher.at(pos));

      return morpher.done();
    });

    this._rememberMorpher('plot', morpher);

    return this;
  },
  // Add leading method
  leading: function leading(value) {
    return this._queueNumber('leading', value);
  },
  // Add animatable viewbox
  viewbox: function viewbox(x, y, width, height) {
    return this._queueObject('viewbox', new Box(x, y, width, height));
  },
  update: function update(o) {
    if (_typeof(o) !== 'object') {
      return this.update({
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      });
    }

    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', o.offset);
    return this;
  }
});
extend(Runner, {
  rx: rx,
  ry: ry,
  from: from,
  to: to
});
register(Runner, 'Runner');

var Svg =
/*#__PURE__*/
function (_Container) {
  _inherits(Svg, _Container);

  function Svg(node) {
    var _this;

    _classCallCheck(this, Svg);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Svg).call(this, nodeOrNew('svg', node), node));

    _this.namespace();

    return _this;
  }

  _createClass(Svg, [{
    key: "isRoot",
    value: function isRoot() {
      return !this.node.parentNode || !(this.node.parentNode instanceof globals.window.SVGElement) || this.node.parentNode.nodeName === '#document';
    } // Check if this is a root svg
    // If not, call docs from this element

  }, {
    key: "root",
    value: function root() {
      if (this.isRoot()) return this;
      return _get(_getPrototypeOf(Svg.prototype), "root", this).call(this);
    } // Add namespaces

  }, {
    key: "namespace",
    value: function namespace() {
      if (!this.isRoot()) return this.root().namespace();
      return this.attr({
        xmlns: ns,
        version: '1.1'
      }).attr('xmlns:xlink', xlink, xmlns).attr('xmlns:svgjs', svgjs, xmlns);
    } // Creates and returns defs element

  }, {
    key: "defs",
    value: function defs() {
      if (!this.isRoot()) return this.root().defs();
      return adopt(this.node.querySelector('defs')) || this.put(new Defs());
    } // custom parent method

  }, {
    key: "parent",
    value: function parent(type) {
      if (this.isRoot()) {
        return this.node.parentNode.nodeName === '#document' ? null : adopt(this.node.parentNode);
      }

      return _get(_getPrototypeOf(Svg.prototype), "parent", this).call(this, type);
    }
  }, {
    key: "clear",
    value: function clear() {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      } // remove defs reference


      delete this._defs;
      return this;
    }
  }]);

  return Svg;
}(Container);
registerMethods({
  Container: {
    // Create nested svg document
    nested: wrapWithAttrCheck(function () {
      return this.put(new Svg());
    })
  }
});
register(Svg, 'Svg', true);

var _Symbol =
/*#__PURE__*/
function (_Container) {
  _inherits(_Symbol, _Container);

  // Initialize node
  function _Symbol(node) {
    _classCallCheck(this, _Symbol);

    return _possibleConstructorReturn(this, _getPrototypeOf(_Symbol).call(this, nodeOrNew('symbol', node), node));
  }

  return _Symbol;
}(Container);
registerMethods({
  Container: {
    symbol: wrapWithAttrCheck(function () {
      return this.put(new _Symbol());
    })
  }
});
register(_Symbol, 'Symbol');

function plain(text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear();
  } // create text node


  this.node.appendChild(globals.document.createTextNode(text));
  return this;
} // Get length of text element

function length() {
  return this.node.getComputedTextLength();
}

var textable = ({
	__proto__: null,
	plain: plain,
	length: length
});

var Text =
/*#__PURE__*/
function (_Shape) {
  _inherits(Text, _Shape);

  // Initialize node
  function Text(node) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, nodeOrNew('text', node), node));
    _this.dom.leading = new SVGNumber(1.3); // store leading value for rebuilding

    _this._rebuild = true; // enable automatic updating of dy values

    _this._build = false; // disable build mode for adding multiple lines

    return _this;
  } // Move over x-axis
  // Text is moved its bounding box
  // text-anchor does NOT matter


  _createClass(Text, [{
    key: "x",
    value: function x(_x) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();

      if (_x == null) {
        return box.x;
      }

      return this.attr('x', this.attr('x') + _x - box.x);
    } // Move over y-axis

  }, {
    key: "y",
    value: function y(_y) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();

      if (_y == null) {
        return box.y;
      }

      return this.attr('y', this.attr('y') + _y - box.y);
    }
  }, {
    key: "move",
    value: function move(x, y) {
      var box = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bbox();
      return this.x(x, box).y(y, box);
    } // Move center over x-axis

  }, {
    key: "cx",
    value: function cx(x) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();

      if (x == null) {
        return box.cx;
      }

      return this.attr('x', this.attr('x') + x - box.cx);
    } // Move center over y-axis

  }, {
    key: "cy",
    value: function cy(y) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();

      if (y == null) {
        return box.cy;
      }

      return this.attr('y', this.attr('y') + y - box.cy);
    }
  }, {
    key: "center",
    value: function center(x, y) {
      var box = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bbox();
      return this.cx(x, box).cy(y, box);
    } // Set the text content

  }, {
    key: "text",
    value: function text(_text) {
      // act as getter
      if (_text === undefined) {
        var children = this.node.childNodes;
        var firstLine = 0;
        _text = '';

        for (var i = 0, len = children.length; i < len; ++i) {
          // skip textPaths - they are no lines
          if (children[i].nodeName === 'textPath') {
            if (i === 0) firstLine = 1;
            continue;
          } // add newline if its not the first child and newLined is set to true


          if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
            _text += '\n';
          } // add content of this node


          _text += children[i].textContent;
        }

        return _text;
      } // remove existing content


      this.clear().build(true);

      if (typeof _text === 'function') {
        // call block
        _text.call(this, this);
      } else {
        // store text and make sure text is not blank
        _text = _text.split('\n'); // build new lines

        for (var j = 0, jl = _text.length; j < jl; j++) {
          this.tspan(_text[j]).newLine();
        }
      } // disable build mode and rebuild lines


      return this.build(false).rebuild();
    } // Set / get leading

  }, {
    key: "leading",
    value: function leading(value) {
      // act as getter
      if (value == null) {
        return this.dom.leading;
      } // act as setter


      this.dom.leading = new SVGNumber(value);
      return this.rebuild();
    } // Rebuild appearance type

  }, {
    key: "rebuild",
    value: function rebuild(_rebuild) {
      // store new rebuild flag if given
      if (typeof _rebuild === 'boolean') {
        this._rebuild = _rebuild;
      } // define position of all lines


      if (this._rebuild) {
        var self = this;
        var blankLineOffset = 0;
        var leading = this.dom.leading;
        this.each(function () {
          var fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
          var dy = leading * new SVGNumber(fontSize);

          if (this.dom.newLined) {
            this.attr('x', self.attr('x'));

            if (this.text() === '\n') {
              blankLineOffset += dy;
            } else {
              this.attr('dy', dy + blankLineOffset);
              blankLineOffset = 0;
            }
          }
        });
        this.fire('rebuild');
      }

      return this;
    } // Enable / disable build mode

  }, {
    key: "build",
    value: function build(_build) {
      this._build = !!_build;
      return this;
    } // overwrite method from parent to set data properly

  }, {
    key: "setData",
    value: function setData(o) {
      this.dom = o;
      this.dom.leading = new SVGNumber(o.leading || 1.3);
      return this;
    }
  }]);

  return Text;
}(Shape);
extend(Text, textable);
registerMethods({
  Container: {
    // Create text element
    text: wrapWithAttrCheck(function (text) {
      return this.put(new Text()).text(text);
    }),
    // Create plain text element
    plain: wrapWithAttrCheck(function (text) {
      return this.put(new Text()).plain(text);
    })
  }
});
register(Text, 'Text');

var Tspan =
/*#__PURE__*/
function (_Text) {
  _inherits(Tspan, _Text);

  // Initialize node
  function Tspan(node) {
    _classCallCheck(this, Tspan);

    return _possibleConstructorReturn(this, _getPrototypeOf(Tspan).call(this, nodeOrNew('tspan', node), node));
  } // Set text content


  _createClass(Tspan, [{
    key: "text",
    value: function text(_text) {
      if (_text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '');
      typeof _text === 'function' ? _text.call(this, this) : this.plain(_text);
      return this;
    } // Shortcut dx

  }, {
    key: "dx",
    value: function dx(_dx) {
      return this.attr('dx', _dx);
    } // Shortcut dy

  }, {
    key: "dy",
    value: function dy(_dy) {
      return this.attr('dy', _dy);
    }
  }, {
    key: "x",
    value: function x(_x) {
      return this.attr('x', _x);
    }
  }, {
    key: "y",
    value: function y(_y) {
      return this.attr('x', _y);
    }
  }, {
    key: "move",
    value: function move(x, y) {
      return this.x(x).y(y);
    } // Create new line

  }, {
    key: "newLine",
    value: function newLine() {
      // fetch text parent
      var t = this.parent(Text); // mark new line

      this.dom.newLined = true;
      var fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
      var dy = t.dom.leading * new SVGNumber(fontSize); // apply new position

      return this.dy(dy).attr('x', t.x());
    }
  }]);

  return Tspan;
}(Text);
extend(Tspan, textable);
registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text) {
      var tspan = new Tspan(); // clear if build mode is disabled

      if (!this._build) {
        this.clear();
      } // add new tspan


      this.node.appendChild(tspan.node);
      return tspan.text(text);
    })
  }
});
register(Tspan, 'Tspan');

var ClipPath =
/*#__PURE__*/
function (_Container) {
  _inherits(ClipPath, _Container);

  function ClipPath(node) {
    _classCallCheck(this, ClipPath);

    return _possibleConstructorReturn(this, _getPrototypeOf(ClipPath).call(this, nodeOrNew('clipPath', node), node));
  } // Unclip all clipped elements and remove itself


  _createClass(ClipPath, [{
    key: "remove",
    value: function remove() {
      // unclip all targets
      this.targets().forEach(function (el) {
        el.unclip();
      }); // remove clipPath from parent

      return _get(_getPrototypeOf(ClipPath.prototype), "remove", this).call(this);
    }
  }, {
    key: "targets",
    value: function targets() {
      return baseFind('svg [clip-path*="' + this.id() + '"]');
    }
  }]);

  return ClipPath;
}(Container);
registerMethods({
  Container: {
    // Create clipping element
    clip: wrapWithAttrCheck(function () {
      return this.defs().put(new ClipPath());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipWith: function clipWith(element) {
      // use given clip or create a new one
      var clipper = element instanceof ClipPath ? element : this.parent().clip().add(element); // apply mask

      return this.attr('clip-path', 'url("#' + clipper.id() + '")');
    },
    // Unclip element
    unclip: function unclip() {
      return this.attr('clip-path', null);
    },
    clipper: function clipper() {
      return this.reference('clip-path');
    }
  }
});
register(ClipPath, 'ClipPath');

var ForeignObject =
/*#__PURE__*/
function (_Element) {
  _inherits(ForeignObject, _Element);

  function ForeignObject(node) {
    _classCallCheck(this, ForeignObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(ForeignObject).call(this, nodeOrNew('foreignObject', node), node));
  }

  return ForeignObject;
}(Element);
registerMethods({
  Container: {
    foreignObject: wrapWithAttrCheck(function (width, height) {
      return this.put(new ForeignObject()).size(width, height);
    })
  }
});
register(ForeignObject, 'ForeignObject');

var G =
/*#__PURE__*/
function (_Container) {
  _inherits(G, _Container);

  function G(node) {
    _classCallCheck(this, G);

    return _possibleConstructorReturn(this, _getPrototypeOf(G).call(this, nodeOrNew('g', node), node));
  }

  _createClass(G, [{
    key: "x",
    value: function x(_x) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();
      if (_x == null) return box.x;
      return this.move(_x, box.y, box);
    }
  }, {
    key: "y",
    value: function y(_y) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();
      if (_y == null) return box.y;
      return this.move(box.x, _y, box);
    }
  }, {
    key: "move",
    value: function move() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var box = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bbox();
      var dx = x - box.x;
      var dy = y - box.y;
      return this.dmove(dx, dy);
    }
  }, {
    key: "dx",
    value: function dx(_dx) {
      return this.dmove(_dx, 0);
    }
  }, {
    key: "dy",
    value: function dy(_dy) {
      return this.dmove(0, _dy);
    }
  }, {
    key: "dmove",
    value: function dmove(dx, dy) {
      this.children().forEach(function (child, i) {
        // Get the childs bbox
        var bbox = child.bbox(); // Get childs matrix

        var m = new Matrix(child); // Translate childs matrix by amount and
        // transform it back into parents space

        var matrix = m.translate(dx, dy).transform(m.inverse()); // Calculate new x and y from old box

        var p = new Point(bbox.x, bbox.y).transform(matrix); // Move element

        child.move(p.x, p.y);
      });
      return this;
    }
  }, {
    key: "width",
    value: function width(_width) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();
      if (_width == null) return box.width;
      return this.size(_width, box.height, box);
    }
  }, {
    key: "height",
    value: function height(_height) {
      var box = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bbox();
      if (_height == null) return box.height;
      return this.size(box.width, _height, box);
    }
  }, {
    key: "size",
    value: function size(width, height) {
      var box = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bbox();
      var p = proportionalSize(this, width, height, box);
      var scaleX = p.width / box.width;
      var scaleY = p.height / box.height;
      this.children().forEach(function (child, i) {
        var o = new Point(box).transform(new Matrix(child).inverse());
        child.scale(scaleX, scaleY, o.x, o.y);
      });
      return this;
    }
  }]);

  return G;
}(Container);
registerMethods({
  Container: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G());
    })
  }
});
register(G, 'G');

var A =
/*#__PURE__*/
function (_Container) {
  _inherits(A, _Container);

  function A(node) {
    _classCallCheck(this, A);

    return _possibleConstructorReturn(this, _getPrototypeOf(A).call(this, nodeOrNew('a', node), node));
  } // Link url


  _createClass(A, [{
    key: "to",
    value: function to(url) {
      return this.attr('href', url, xlink);
    } // Link target attribute

  }, {
    key: "target",
    value: function target(_target) {
      return this.attr('target', _target);
    }
  }]);

  return A;
}(Container);
registerMethods({
  Container: {
    // Create a hyperlink element
    link: wrapWithAttrCheck(function (url) {
      return this.put(new A()).to(url);
    })
  },
  Element: {
    // Create a hyperlink element
    linkTo: function linkTo(url) {
      var link = new A();

      if (typeof url === 'function') {
        url.call(link, link);
      } else {
        link.to(url);
      }

      return this.parent().put(link).put(this);
    }
  }
});
register(A, 'A');

var Mask =
/*#__PURE__*/
function (_Container) {
  _inherits(Mask, _Container);

  // Initialize node
  function Mask(node) {
    _classCallCheck(this, Mask);

    return _possibleConstructorReturn(this, _getPrototypeOf(Mask).call(this, nodeOrNew('mask', node), node));
  } // Unmask all masked elements and remove itself


  _createClass(Mask, [{
    key: "remove",
    value: function remove() {
      // unmask all targets
      this.targets().forEach(function (el) {
        el.unmask();
      }); // remove mask from parent

      return _get(_getPrototypeOf(Mask.prototype), "remove", this).call(this);
    }
  }, {
    key: "targets",
    value: function targets() {
      return baseFind('svg [mask*="' + this.id() + '"]');
    }
  }]);

  return Mask;
}(Container);
registerMethods({
  Container: {
    mask: wrapWithAttrCheck(function () {
      return this.defs().put(new Mask());
    })
  },
  Element: {
    // Distribute mask to svg element
    maskWith: function maskWith(element) {
      // use given mask or create a new one
      var masker = element instanceof Mask ? element : this.parent().mask().add(element); // apply mask

      return this.attr('mask', 'url("#' + masker.id() + '")');
    },
    // Unmask element
    unmask: function unmask() {
      return this.attr('mask', null);
    },
    masker: function masker() {
      return this.reference('mask');
    }
  }
});
register(Mask, 'Mask');

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function cssRule(selector, rule) {
  if (!selector) return '';
  if (!rule) return selector;
  var ret = selector + '{';

  for (var i in rule) {
    ret += unCamelCase(i) + ':' + rule[i] + ';';
  }

  ret += '}';
  return ret;
}

var Style =
/*#__PURE__*/
function (_Element) {
  _inherits(Style, _Element);

  function Style(node) {
    _classCallCheck(this, Style);

    return _possibleConstructorReturn(this, _getPrototypeOf(Style).call(this, nodeOrNew('style', node), node));
  }

  _createClass(Style, [{
    key: "addText",
    value: function addText() {
      var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.node.textContent += w;
      return this;
    }
  }, {
    key: "font",
    value: function font(name, src) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.rule('@font-face', _objectSpread$2({
        fontFamily: name,
        src: src
      }, params));
    }
  }, {
    key: "rule",
    value: function rule(selector, obj) {
      return this.addText(cssRule(selector, obj));
    }
  }]);

  return Style;
}(Element);
registerMethods('Dom', {
  style: wrapWithAttrCheck(function (selector, obj) {
    return this.put(new Style()).rule(selector, obj);
  }),
  fontface: wrapWithAttrCheck(function (name, src, params) {
    return this.put(new Style()).font(name, src, params);
  })
});
register(Style, 'Style');

var TextPath =
/*#__PURE__*/
function (_Text) {
  _inherits(TextPath, _Text);

  // Initialize node
  function TextPath(node) {
    _classCallCheck(this, TextPath);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextPath).call(this, nodeOrNew('textPath', node), node));
  } // return the array of the path track element


  _createClass(TextPath, [{
    key: "array",
    value: function array() {
      var track = this.track();
      return track ? track.array() : null;
    } // Plot path if any

  }, {
    key: "plot",
    value: function plot(d) {
      var track = this.track();
      var pathArray = null;

      if (track) {
        pathArray = track.plot(d);
      }

      return d == null ? pathArray : this;
    } // Get the path element

  }, {
    key: "track",
    value: function track() {
      return this.reference('href');
    }
  }]);

  return TextPath;
}(Text);
registerMethods({
  Container: {
    textPath: wrapWithAttrCheck(function (text, path) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = this.text(text);
      }

      return text.path(path);
    })
  },
  Text: {
    // Create path for text to run on
    path: wrapWithAttrCheck(function (track) {
      var importNodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var textPath = new TextPath(); // if track is a path, reuse it

      if (!(track instanceof Path)) {
        // create path element
        track = this.defs().path(track);
      } // link textPath to path and add content


      textPath.attr('href', '#' + track, xlink); // Transplant all nodes from text to textPath

      var node;

      if (importNodes) {
        while (node = this.node.firstChild) {
          textPath.node.appendChild(node);
        }
      } // add textPath element as child node and return textPath


      return this.put(textPath);
    }),
    // Get the textPath children
    textPath: function textPath() {
      return this.findOne('textPath');
    }
  },
  Path: {
    // creates a textPath from this path
    text: wrapWithAttrCheck(function (text) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = new Text().addTo(this.parent()).text(text);
      } // Create textPath from text and path and return


      return text.path(this);
    }),
    targets: function targets() {
      return baseFind('svg [href*="' + this.id() + '"]');
    }
  }
});
TextPath.prototype.MorphArray = PathArray;
register(TextPath, 'TextPath');

var Use =
/*#__PURE__*/
function (_Shape) {
  _inherits(Use, _Shape);

  function Use(node) {
    _classCallCheck(this, Use);

    return _possibleConstructorReturn(this, _getPrototypeOf(Use).call(this, nodeOrNew('use', node), node));
  } // Use element as a reference


  _createClass(Use, [{
    key: "element",
    value: function element(_element, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + _element, xlink);
    }
  }]);

  return Use;
}(Shape);
registerMethods({
  Container: {
    // Create a use element
    use: wrapWithAttrCheck(function (element, file) {
      return this.put(new Use()).element(element, file);
    })
  }
});
register(Use, 'Use');

/* Optional Modules */
var SVG = makeInstance;
extend([Svg, _Symbol, Image, Pattern, Marker], getMethodsFor('viewbox'));
extend([Line, Polyline, Polygon, Path], getMethodsFor('marker'));
extend(Text, getMethodsFor('Text'));
extend(Path, getMethodsFor('Path'));
extend(Defs, getMethodsFor('Defs'));
extend([Text, Tspan], getMethodsFor('Tspan'));
extend([Rect, Ellipse, Circle, Gradient], getMethodsFor('radius'));
extend(EventTarget, getMethodsFor('EventTarget'));
extend(Dom, getMethodsFor('Dom'));
extend(Element, getMethodsFor('Element'));
extend(Shape, getMethodsFor('Shape')); // extend(Element, getConstructor('Memory'))

extend(Container, getMethodsFor('Container'));
extend(Runner, getMethodsFor('Runner'));
List.extend(getMethodNames());
registerMorphableType([SVGNumber, Color, Box, Matrix, SVGArray, PointArray, PathArray]);
makeMorphable();


//# sourceMappingURL=svg.esm.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/game */ "./src/lib/game.ts");
/* harmony import */ var _lib_spriteLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/spriteLoader */ "./src/lib/spriteLoader.ts");


var spriteLoader = new _lib_spriteLoader__WEBPACK_IMPORTED_MODULE_1__["default"]();
spriteLoader.loadAllSprites().then(function () {
    new _lib_game__WEBPACK_IMPORTED_MODULE_0__["default"]("#codingArea");
}).catch(function () {
    console.warn("Error loading sprites!");
});


/***/ }),

/***/ "./src/lib/code/block.ts":
/*!*******************************!*\
  !*** ./src/lib/code/block.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connection */ "./src/lib/code/connection.ts");
/* harmony import */ var _util_vector2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/vector2 */ "./src/lib/util/vector2.ts");
/* harmony import */ var _svgdotjs_svg_draggable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @svgdotjs/svg.draggable.js */ "./node_modules/@svgdotjs/svg.draggable.js/src/svg.draggable.js");
/* harmony import */ var _spriteLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spriteLoader */ "./src/lib/spriteLoader.ts");




var Block = /** @class */ (function () {
    function Block(svgC, game, draggable) {
        var _this = this;
        if (draggable === void 0) { draggable = true; }
        this.game = game;
        this.svgC = svgC;
        this.svgG = this.svgC.group();
        this.inputs = [];
        this.outputs = [];
        this.draggable = draggable;
        this.draggableDefault = draggable;
        this.svgG.draggable(draggable);
        this.svgG.on("dragmove.namespace", function (e) {
            var box = e.detail.box;
            e.preventDefault();
            _this.svgG.translate(box.x, box.y);
            // Update wires
            for (var _i = 0, _a = _this.inputs; _i < _a.length; _i++) {
                var input = _a[_i];
                if (input.wire !== null)
                    input.wire.updateLine();
            }
            for (var _b = 0, _c = _this.outputs; _b < _c.length; _b++) {
                var output = _c[_b];
                if (output.wire !== null)
                    output.wire.updateLine();
            }
        });
    }
    Block.prototype.draw = function (customSvg) {
        if (customSvg === void 0) { customSvg = null; }
        if (customSvg === null) {
            this.svgG.rect(200, 100).attr({ class: "defaultBlock" });
        }
        else {
            this.svgG.svg(customSvg);
        }
        return this;
    };
    Block.prototype.addConnection = function (type) {
        var newCon = new _connection__WEBPACK_IMPORTED_MODULE_0__["default"](this, type);
        if (type === 0) {
            newCon.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_3__["default"].sprites["connectionInput"]);
            newCon.setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_1__["default"](0, this.inputs.length * 30 + 5));
            this.inputs.push(newCon);
        }
        else if (type === 1) {
            newCon.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_3__["default"].sprites["connectionOutput"]);
            newCon.setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_1__["default"](175, this.outputs.length * 30 + 5));
            this.outputs.push(newCon);
        }
        return this;
    };
    Block.prototype.setPos = function (pos) {
        this.svgG.translate(pos.x, pos.y);
        return this;
    };
    Block.prototype.setDraggable = function (isDraggable) {
        this.draggable = isDraggable;
        this.svgG.draggable(isDraggable);
        return this;
    };
    Block.prototype.resetDraggable = function () {
        this.setDraggable(this.draggableDefault);
        return this;
    };
    Block.prototype.work = function () {
        var inputValues = this.inputs.map(function (input) { return input.value; });
        this.outputs[0].send(this.valueModifier(inputValues));
        for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
            var input = _a[_i];
            input.value = null;
        }
        return;
    };
    Block.prototype.valueModifier = function (values) {
        console.warn("Value modifier function not implemented!");
        return values[0]; // Return first value by default
    };
    return Block;
}());
/* harmony default export */ __webpack_exports__["default"] = (Block);


/***/ }),

/***/ "./src/lib/code/connection.ts":
/*!************************************!*\
  !*** ./src/lib/code/connection.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wireGhost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wireGhost */ "./src/lib/code/wireGhost.ts");

var Connection = /** @class */ (function () {
    function Connection(parent, type) {
        var _this = this;
        this.type = type;
        this.parent = parent;
        this.svg = this.parent.svgG.group();
        this.wire = null;
        this.value = null;
        this.svg.remember("connection", this);
        this.svg.on("mousedown", function (event) {
            // If mouse down, create a wire ghost
            if (_this.wire !== null)
                _this.wire.remove();
            _this.parent.game.activeWireGhost = new _wireGhost__WEBPACK_IMPORTED_MODULE_0__["default"](_this.svg.root(), _this);
            _this.parent.setDraggable(false);
        });
    }
    Connection.prototype.draw = function (customSvg) {
        if (customSvg === void 0) { customSvg = null; }
        if (customSvg === null) {
            this.svg.rect(25, 25).attr({ class: "defaultConnection useable", type: this.type.toString(), blockConnection: "blockConnection" });
        }
        else {
            this.svg.svg(customSvg).attr({ class: "useable", type: this.type.toString(), blockConnection: "blockConnection" });
        }
        return this;
    };
    Connection.prototype.setPos = function (pos) {
        this.svg.translate(pos.x, pos.y);
        return this;
    };
    Connection.prototype.receive = function (value) {
        this.value = value;
        if (this.parent.inputs.every(function (input) { return input.value !== null; })) { // Check if the block has received all its input values
            this.parent.work();
        }
        return this;
    };
    Connection.prototype.send = function (value) {
        if (this.wire !== null)
            this.wire.broadcast(value);
        return this;
    };
    return Connection;
}());
/* harmony default export */ __webpack_exports__["default"] = (Connection);


/***/ }),

/***/ "./src/lib/code/input.ts":
/*!*******************************!*\
  !*** ./src/lib/code/input.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./block */ "./src/lib/code/block.ts");
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection */ "./src/lib/code/connection.ts");
/* harmony import */ var _util_vector2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/vector2 */ "./src/lib/util/vector2.ts");
/* harmony import */ var _spriteLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spriteLoader */ "./src/lib/spriteLoader.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input(svgCont, game, initVal) {
        if (initVal === void 0) { initVal = 1; }
        var _this = _super.call(this, svgCont, game, false) || this;
        _this.value = initVal;
        _this.output = new _connection__WEBPACK_IMPORTED_MODULE_1__["default"](_this, 1);
        return _this;
    }
    Input.prototype.draw = function (customSvg) {
        if (customSvg === void 0) { customSvg = null; }
        if (customSvg === null) {
            this.svgG.rect(50, 50).attr({ class: "cycleInput useable" });
        }
        else {
            this.svgG.svg(customSvg);
        }
        this.output.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_3__["default"].sprites["connectionOutput"]);
        this.output.setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_2__["default"](12.5, 12.5));
        this.output.svg.forward();
        return this;
    };
    Input.prototype.addConnection = function () {
        console.warn("Property not used in Input object");
        return this;
    };
    Input.prototype.work = function () {
        if (this.output.wire !== null) {
            this.output.send(this.value);
        }
        return this;
    };
    return Input;
}(_block__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Input);


/***/ }),

/***/ "./src/lib/code/output.ts":
/*!********************************!*\
  !*** ./src/lib/code/output.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./block */ "./src/lib/code/block.ts");
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection */ "./src/lib/code/connection.ts");
/* harmony import */ var _util_vector2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/vector2 */ "./src/lib/util/vector2.ts");
/* harmony import */ var _spriteLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spriteLoader */ "./src/lib/spriteLoader.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Output = /** @class */ (function (_super) {
    __extends(Output, _super);
    function Output(svgCont, game, initVal) {
        if (initVal === void 0) { initVal = 0; }
        var _this = _super.call(this, svgCont, game, false) || this;
        _this.value = initVal;
        _this.inputs[0] = new _connection__WEBPACK_IMPORTED_MODULE_1__["default"](_this, 0);
        return _this;
    }
    Output.prototype.draw = function (customSvg) {
        if (customSvg === void 0) { customSvg = null; }
        if (customSvg === null) {
            this.svgG.rect(50, 50).attr({ class: "cycleOutput useable" });
        }
        else {
            this.svgG.svg(customSvg);
        }
        this.inputs[0].draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_3__["default"].sprites["connectionInput"]);
        this.inputs[0].setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_2__["default"](12.5, 12.5));
        this.inputs[0].svg.forward();
        return this;
    };
    Output.prototype.addConnection = function () {
        console.warn("Property not used in Output object");
        return this;
    };
    Output.prototype.work = function () {
        this.game.scamCoin += this.inputs[0].value;
        this.game.update();
        return this;
    };
    return Output;
}(_block__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Output);


/***/ }),

/***/ "./src/lib/code/wire.ts":
/*!******************************!*\
  !*** ./src/lib/code/wire.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_svgUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/svgUtil */ "./src/lib/util/svgUtil.ts");
/* harmony import */ var _util_domUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/domUtil */ "./src/lib/util/domUtil.ts");


var Wire = /** @class */ (function () {
    function Wire(input, output, svgC) {
        var _this = this;
        this.input = input;
        this.output = output;
        this.input.wire = this;
        this.output.wire = this;
        this.svgG = svgC.group();
        this.svgG.on("mousedown", function (event) {
            // @ts-ignore
            var elBeneath = Object(_util_domUtil__WEBPACK_IMPORTED_MODULE_1__["getFirstElementWithProperty"])(document.elementsFromPoint(event.x, event.y)[1], "blockConnection", "blockConnection").instance; //document.elementsFromPoint(event.x, event.y)[1].instance.parent();
            var connection = elBeneath.remember("connection");
            if (connection !== undefined) {
                if (connection === _this.input || connection === _this.output) {
                    connection.svg.fire("mousedown");
                }
            }
        });
    }
    Wire.prototype.draw = function () {
        var inputPos = Object(_util_svgUtil__WEBPACK_IMPORTED_MODULE_0__["getSVGPos"])(this.input.svg, true);
        var outputPos = Object(_util_svgUtil__WEBPACK_IMPORTED_MODULE_0__["getSVGPos"])(this.output.svg, true);
        this.svgLine = this.svgG.line(inputPos.x, inputPos.y, outputPos.x, outputPos.y).stroke({ color: '#FF7700', width: 15, linecap: 'round' });
        return this;
    };
    Wire.prototype.updateLine = function () {
        var inputPos = Object(_util_svgUtil__WEBPACK_IMPORTED_MODULE_0__["getSVGPos"])(this.input.svg, true);
        var outputPos = Object(_util_svgUtil__WEBPACK_IMPORTED_MODULE_0__["getSVGPos"])(this.output.svg, true);
        this.svgLine.plot(inputPos.x, inputPos.y, outputPos.x, outputPos.y);
        return this;
    };
    Wire.prototype.remove = function () {
        this.svgG.remove();
        this.input.wire = null;
        this.output.wire = null;
    };
    Wire.prototype.broadcast = function (value) {
        this.input.receive(value);
        return this;
    };
    return Wire;
}());
/* harmony default export */ __webpack_exports__["default"] = (Wire);


/***/ }),

/***/ "./src/lib/code/wireGhost.ts":
/*!***********************************!*\
  !*** ./src/lib/code/wireGhost.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_svgUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/svgUtil */ "./src/lib/util/svgUtil.ts");

var WireGhost = /** @class */ (function () {
    function WireGhost(svgCont, c0) {
        this.p0 = Object(_util_svgUtil__WEBPACK_IMPORTED_MODULE_0__["getSVGPos"])(c0.svg, true);
        // Create line
        this.svg = svgCont.line(this.p0.x, this.p0.y, this.p0.x, this.p0.y);
        this.svg.stroke({ color: 'rgba(25, 25, 25, 0.5)', width: 15, linecap: 'round' });
        this.c0 = c0;
    }
    WireGhost.prototype.updateLine = function (p1) {
        this.svg.plot(this.p0.x, this.p0.y, p1.x, p1.y);
        return this;
    };
    return WireGhost;
}());
/* harmony default export */ __webpack_exports__["default"] = (WireGhost);


/***/ }),

/***/ "./src/lib/game.ts":
/*!*************************!*\
  !*** ./src/lib/game.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @svgdotjs/svg.js */ "./node_modules/@svgdotjs/svg.js/dist/svg.esm.js");
/* harmony import */ var _code_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./code/input */ "./src/lib/code/input.ts");
/* harmony import */ var _code_output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./code/output */ "./src/lib/code/output.ts");
/* harmony import */ var _code_block__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./code/block */ "./src/lib/code/block.ts");
/* harmony import */ var _util_vector2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/vector2 */ "./src/lib/util/vector2.ts");
/* harmony import */ var _code_wire__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./code/wire */ "./src/lib/code/wire.ts");
/* harmony import */ var _spriteLoader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./spriteLoader */ "./src/lib/spriteLoader.ts");
/* harmony import */ var _util_domUtil__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/domUtil */ "./src/lib/util/domUtil.ts");








var Game = /** @class */ (function () {
    function Game(codingArea) {
        var _this = this;
        this.scamCoin = 0;
        this.svg = _svgdotjs_svg_js__WEBPACK_IMPORTED_MODULE_0__["SVG"]().addTo(codingArea).size(1920, 1080);
        this.scamCoinCounter = document.getElementById("mainCounter");
        var testBlock = new _code_block__WEBPACK_IMPORTED_MODULE_3__["default"](this.svg, this);
        var testBlock2 = new _code_block__WEBPACK_IMPORTED_MODULE_3__["default"](this.svg, this);
        testBlock.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_6__["default"].sprites["blockDouble"]).addConnection(0).addConnection(1).setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_4__["default"](500, 100));
        testBlock2.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_6__["default"].sprites["blockAddition"]).addConnection(0).addConnection(0).addConnection(1).setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_4__["default"](500, 250));
        var testMod = function (values) {
            return values[0] * 2;
        };
        testBlock.valueModifier = testMod;
        testBlock2.valueModifier = function (values) {
            return values[0] + values[1];
        };
        var testInput = new _code_input__WEBPACK_IMPORTED_MODULE_1__["default"](this.svg, this);
        testInput.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_6__["default"].sprites["blockInput"]).setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_4__["default"](50, 100));
        var testInput2 = new _code_input__WEBPACK_IMPORTED_MODULE_1__["default"](this.svg, this);
        testInput2.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_6__["default"].sprites["blockInput"]).setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_4__["default"](50, 200));
        var testOutput = new _code_output__WEBPACK_IMPORTED_MODULE_2__["default"](this.svg, this);
        testOutput.draw(_spriteLoader__WEBPACK_IMPORTED_MODULE_6__["default"].sprites["blockOutput"]).setPos(new _util_vector2__WEBPACK_IMPORTED_MODULE_4__["default"](1000, 100));
        // Initialize connection wiring
        this.svg.on("mouseup", function (event) {
            if (_this.activeWireGhost !== null) {
                _this.activeWireGhost.svg.remove();
                _this.activeWireGhost.c0.parent.resetDraggable();
                var connectionEl = Object(_util_domUtil__WEBPACK_IMPORTED_MODULE_7__["getFirstElementWithProperty"])(document.elementFromPoint(event.x, event.y), "blockConnection", "blockConnection");
                if (connectionEl !== null) {
                    // @ts-ignore
                    var targetConnection = connectionEl.instance.remember("connection");
                    if (targetConnection.type !== _this.activeWireGhost.c0.type && targetConnection.parent !== _this.activeWireGhost.c0.parent) {
                        var wireOutput = void 0;
                        var wireInput = void 0;
                        if (targetConnection.type === 1) {
                            wireOutput = targetConnection;
                        }
                        else {
                            wireInput = targetConnection;
                        }
                        if (_this.activeWireGhost.c0.type === 1) {
                            wireOutput = _this.activeWireGhost.c0;
                        }
                        else {
                            wireInput = _this.activeWireGhost.c0;
                        }
                        var newWire = new _code_wire__WEBPACK_IMPORTED_MODULE_5__["default"](wireInput, wireOutput, _this.svg);
                        newWire.draw();
                    }
                }
                _this.activeWireGhost = null;
            }
        });
        this.svg.on("mousemove", function (event) {
            if (_this.activeWireGhost !== null) {
                _this.activeWireGhost.updateLine(_this.svg.path().point(event.x, event.y));
            }
        });
        this.activeWireGhost = null;
        console.log("Game initialized!");
        setInterval(function () {
            testInput.work();
            testInput2.work();
        }, 1000);
    }
    Game.prototype.update = function () {
        this.scamCoinCounter.innerText = this.scamCoin.toString();
    };
    return Game;
}());
/* harmony default export */ __webpack_exports__["default"] = (Game);


/***/ }),

/***/ "./src/lib/spriteLoader.ts":
/*!*********************************!*\
  !*** ./src/lib/spriteLoader.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var SpriteLoader = /** @class */ (function () {
    function SpriteLoader() {
        SpriteLoader.sprites = {};
        SpriteLoader.spriteList = [
            "blockDouble",
            "connectionInput",
            "connectionOutput",
            "blockInput",
            "blockOutput",
            "blockAddition"
        ];
    }
    SpriteLoader.prototype.loadAllSprites = function () {
        var sprite;
        var promises = [];
        for (var _i = 0, _a = SpriteLoader.spriteList; _i < _a.length; _i++) {
            sprite = _a[_i];
            promises.push(this.loadSprite(sprite));
        }
        return Promise.all(promises);
    };
    SpriteLoader.prototype.loadSprite = function (sprite) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        SpriteLoader.sprites[sprite] = this.responseText;
                        resolve(200);
                    }
                    else {
                        console.error("Unable to load sprite ", sprite, "! Error ", this.status);
                        reject(this.status);
                    }
                }
            };
            req.open("GET", "svg/" + sprite + ".svg");
            req.send();
        });
    };
    return SpriteLoader;
}());
/* harmony default export */ __webpack_exports__["default"] = (SpriteLoader);


/***/ }),

/***/ "./src/lib/util/domUtil.ts":
/*!*********************************!*\
  !*** ./src/lib/util/domUtil.ts ***!
  \*********************************/
/*! exports provided: getFirstElementWithProperty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFirstElementWithProperty", function() { return getFirstElementWithProperty; });
var getFirstElementWithProperty = function (initial, property, value) {
    var parent = initial.parentElement;
    while (parent.getAttribute(property) !== value && parent !== document.body) {
        parent = parent.parentElement;
    }
    return (parent === document.body ? null : parent);
};


/***/ }),

/***/ "./src/lib/util/svgUtil.ts":
/*!*********************************!*\
  !*** ./src/lib/util/svgUtil.ts ***!
  \*********************************/
/*! exports provided: getSVGPos */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSVGPos", function() { return getSVGPos; });
/* harmony import */ var _vector2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector2 */ "./src/lib/util/vector2.ts");

var getSVGPos = function (target, centered) {
    if (centered === void 0) { centered = false; }
    var parents = target.parents();
    var targetTransform = target.transform();
    var x = targetTransform.translateX;
    var y = targetTransform.translateY;
    for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
        var parent_1 = parents_1[_i];
        if (parent_1 === target.root())
            break;
        var parentTransform = parent_1.transform();
        x += parentTransform.translateX;
        y += parentTransform.translateY;
    }
    if (centered) {
        x += target.width() / 2;
        y += target.height() / 2;
    }
    return new _vector2__WEBPACK_IMPORTED_MODULE_0__["default"](x, y);
};


/***/ }),

/***/ "./src/lib/util/vector2.ts":
/*!*********************************!*\
  !*** ./src/lib/util/vector2.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Vector2;
}());
/* harmony default export */ __webpack_exports__["default"] = (Vector2);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bzdmdkb3Rqcy9zdmcuZHJhZ2dhYmxlLmpzL3NyYy9zdmcuZHJhZ2dhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9Ac3ZnZG90anMvc3ZnLmpzL2Rpc3Qvc3ZnLmVzbS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2NvZGUvYmxvY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL2Nvbm5lY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL2lucHV0LnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvY29kZS9vdXRwdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL3dpcmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL3dpcmVHaG9zdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zcHJpdGVMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL2RvbVV0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL3N2Z1V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL3ZlY3RvcjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtR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QXVDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixnREFBZ0Q7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7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Q0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMsbUVBQW1FO0FBQzVFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkRBQTZELGdFQUFnRTtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNB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QUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVELCtDQUErQyxlQUFlLEVBQUU7O0FBRWhFO0FBQ0E7QUFDQSxTQUFTLDhEQUE4RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQsS0FBSztBQUNMO0FBQ0Esb0NBQW9DLGNBQWMsT0FBTztBQUN6RCxxQ0FBcUMsY0FBYyxPQUFPO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLHFDQUFxQyxFQUFFO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsbUJBQW1CO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsU0FBUyxrREFBa0Q7QUFDM0Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQsOFpBQThaOztBQUU5WjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0Qjs7O0FBRzVCLDRNQUE0TTs7QUFFNU07QUFDQSw4REFBOEQ7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7O0FBRUE7QUFDQSxnRUFBZ0U7O0FBRWhFO0FBQ0Esc0VBQXNFOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQSx5REFBeUQ7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHFKQUFxSjtBQUNySixLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBIQUEwSDtBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEOztBQUUxRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxR0FBcUcsdUNBQXVDLCtCQUErQix5RkFBeUYsT0FBTyxLQUFLO0FBQ2hSLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QyxvQ0FBb0M7O0FBRXBDO0FBQ0EsNkVBQTZFLGVBQWU7QUFDNUY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxJQUFJO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxRkFBcUY7QUFDckY7QUFDQSw0Q0FBNEM7O0FBRTVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEOztBQUVBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEOztBQUV0RDtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXOzs7QUFHWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFD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QUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUVBQXVFO0FBQ3ZFOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFFOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLElBQUk7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvRkFBb0Y7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMseUVBQXlFO0FBQ2xGO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsU0FBUyx5RUFBeUU7QUFDbEY7QUFDQSxDQUFDOztBQUVEOzs7QUFHQSwrQ0FBK0MscUNBQXFDLEVBQUU7QUFDdEY7O0FBRUE7QUFDQTtBQUNBLFNBQVMscUVBQXFFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMsbURBQW1EO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDRDQUE0QyxnQ0FBZ0Msb0NBQW9DLG9EQUFvRCw4REFBOEQsZ0VBQWdFLEVBQUUsRUFBRSxnQ0FBZ0MsRUFBRSxhQUFhOztBQUVyVixnQ0FBZ0MsZ0JBQWdCLHNCQUFzQixPQUFPLHVEQUF1RCxhQUFhLGlEQUFpRCwyQ0FBMkMsRUFBRSxFQUFFLEVBQUUsNkNBQTZDLDJFQUEyRSxFQUFFLE9BQU8sMkNBQTJDLGtGQUFrRixFQUFFLEVBQUUsRUFBRSxFQUFFLGVBQWU7O0FBRXhnQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsUUFBUTtBQUN6RDtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QyxpREFBaUQsUUFBUTtBQUN6RDtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBLDRDQUE0Qzs7QUFFNUMsdUNBQXVDLFNBQVM7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGlCQUFpQjtBQUNwQywwQkFBMEI7O0FBRTFCO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQSxlQUFlOztBQUVmO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUIsNkJBQTZCLFFBQVE7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsYUFBYTtBQUN0RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyxpREFBaUQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQixxQ0FBcUM7O0FBRXJDO0FBQ0EsNkVBQTZFOztBQUU3RSxnREFBZ0Q7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxRQUFRO0FBQy9DO0FBQ0E7QUFDQSx1Q0FBdUMsc0NBQXNDO0FBQzdFO0FBQ0E7QUFDQSxPQUFPO0FBQ1Asc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7O0FBRTFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0EsbURBQW1EOztBQUVuRCw2QkFBNkIsUUFBUTtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMseUJBQXlCO0FBQzFEO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBLHdDQUF3QyxRQUFRO0FBQ2hEOztBQUVBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUMsUUFBUTtBQUNULHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQSxPQUFPOztBQUVQOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7OztBQUdBO0FBQ0EsMEVBQTBFOztBQUUxRSw0QkFBNEI7O0FBRTVCO0FBQ0Esa0NBQWtDOzs7QUFHbEM7O0FBRUE7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUOzs7QUFHQTtBQUNBLCtEQUErRDs7QUFFL0QsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBRTs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQSxpR0FBaUc7O0FBRWpHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTs7QUFFbEUsK0JBQStCOzs7QUFHL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdEQUFnRDtBQUNoRDtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQLHFDQUFxQztBQUNyQztBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSwyQkFBMkI7O0FBRTNCLG1EQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLLEVBQUU7O0FBRVA7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLLEVBQUU7O0FBRVA7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJDQUEyQzs7QUFFM0MsMEJBQTBCOztBQUUxQix5QkFBeUI7O0FBRXpCO0FBQ0EsR0FBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBOEMsU0FBUztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQSxXQUFXOzs7QUFHWDtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0Esa0NBQWtDOztBQUVsQywwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RkFBOEY7O0FBRTlGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7O0FBRWhDLGtDQUFrQztBQUNsQzs7QUFFQSxnRUFBZ0U7O0FBRWhFLDREQUE0RDs7QUFFNUQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sRUFBRTs7QUFFVDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RkFBeUY7O0FBRXpGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQSw0Q0FBNEMsZ0NBQWdDLG9DQUFvQyxvREFBb0QsOERBQThELGdFQUFnRSxFQUFFLEVBQUUsZ0NBQWdDLEVBQUUsYUFBYTs7QUFFclYsa0NBQWtDLGdCQUFnQixzQkFBc0IsT0FBTyx1REFBdUQsYUFBYSxpREFBaUQsMkNBQTJDLEVBQUUsRUFBRSxFQUFFLDZDQUE2QywyRUFBMkUsRUFBRSxPQUFPLDJDQUEyQyxrRkFBa0YsRUFBRSxFQUFFLEVBQUUsRUFBRSxlQUFlOztBQUUxZ0I7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOztBQUV6QjtBQUNBLDhDQUE4QztBQUM5Qzs7QUFFQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQLGdEQUFnRDs7QUFFaEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxdUI7QUFDcnVCOzs7Ozs7Ozs7Ozs7O0FDbDNWQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUM7Ozs7Ozs7Ozs7Ozs7QUNuQkE7QUFBQTtBQUFBO0FBQThCO0FBRWdCO0FBRTlDLElBQU0sWUFBWSxHQUFHLElBQUkseURBQVksRUFBRSxDQUFDO0FBRXhDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDL0IsSUFBSSxpREFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1RIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0M7QUFDQTtBQUVGO0FBQ087QUFFM0M7SUFTQyxlQUFZLElBQWEsRUFBRSxJQUFVLEVBQUUsU0FBeUI7UUFBaEUsaUJBNEJDO1FBNUJzQyw0Q0FBeUI7UUFDL0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsVUFBQyxDQUFhO1lBQ2hELElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuQixLQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxlQUFlO1lBRWYsS0FBaUIsVUFBVyxFQUFYLFVBQUksQ0FBQyxNQUFNLEVBQVgsY0FBVyxFQUFYLElBQVcsRUFBQztnQkFBekIsSUFBSSxLQUFLO2dCQUNaLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJO29CQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDaEQ7WUFFRCxLQUFrQixVQUFZLEVBQVosVUFBSSxDQUFDLE9BQU8sRUFBWixjQUFZLEVBQVosSUFBWSxFQUFDO2dCQUEzQixJQUFJLE1BQU07Z0JBQ2IsSUFBRyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUk7b0JBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNsRDtRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELG9CQUFJLEdBQUosVUFBSyxTQUF3QjtRQUF4Qiw0Q0FBd0I7UUFDNUIsSUFBRyxTQUFTLEtBQUssSUFBSSxFQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztTQUN2RDthQUNHO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDekI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCw2QkFBYSxHQUFiLFVBQWMsSUFBWTtRQUN6QixJQUFNLE1BQU0sR0FBRyxJQUFJLG1EQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTFDLElBQUcsSUFBSSxLQUFLLENBQUMsRUFBQztZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6QjthQUNJLElBQUcsSUFBSSxLQUFLLENBQUMsRUFBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLHFEQUFZLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUkscURBQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxzQkFBTSxHQUFOLFVBQU8sR0FBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsQyxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCw0QkFBWSxHQUFaLFVBQWEsV0FBb0I7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsOEJBQWMsR0FBZDtRQUNDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsb0JBQUksR0FBSjtRQUNDLElBQU0sV0FBVyxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQWlCLElBQUcsWUFBSyxDQUFDLEtBQUssRUFBWCxDQUFXLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFdEQsS0FBaUIsVUFBVyxFQUFYLFNBQUksQ0FBQyxNQUFNLEVBQVgsY0FBVyxFQUFYLElBQVcsRUFBQztZQUF6QixJQUFJLEtBQUs7WUFDWixLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtRQUVELE9BQU87SUFDUixDQUFDO0lBRUQsNkJBQWEsR0FBYixVQUFjLE1BQXFCO1FBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUV6RCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztJQUNuRCxDQUFDO0lBQ0YsWUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUdEO0FBQUE7QUFBb0M7QUFHcEM7SUFPQyxvQkFBWSxNQUFhLEVBQUUsSUFBWTtRQUF2QyxpQkFpQkM7UUFoQkEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUVsQixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7WUFDekMscUNBQXFDO1lBRXJDLElBQUcsS0FBSSxDQUFDLElBQUksS0FBSyxJQUFJO2dCQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFMUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0RBQVMsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ3hFLEtBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxTQUF3QjtRQUF4Qiw0Q0FBd0I7UUFDNUIsSUFBRyxTQUFTLEtBQUssSUFBSSxFQUFDO1lBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsMkJBQTJCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFDLENBQUMsQ0FBQztTQUNoSTthQUNHO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDO1NBQ2pIO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsMkJBQU0sR0FBTixVQUFPLEdBQVk7UUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsNEJBQU8sR0FBUCxVQUFRLEtBQWE7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFpQixJQUFLLFlBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFwQixDQUFvQixDQUFDLEVBQUMsRUFBRSx1REFBdUQ7WUFDakksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxLQUFhO1FBQ2pCLElBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJO1lBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBQ0YsaUJBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9EMkI7QUFDVTtBQUVBO0FBQ0s7QUFFM0M7SUFBbUMseUJBQUs7SUFJdkMsZUFBWSxPQUFnQixFQUFFLElBQVUsRUFBRSxPQUFtQjtRQUFuQixxQ0FBbUI7UUFBN0QsWUFDQyxrQkFBTSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUkzQjtRQUhBLEtBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBRXJCLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtREFBVSxDQUFDLEtBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUFDdkMsQ0FBQztJQUVELG9CQUFJLEdBQUosVUFBSyxTQUF3QjtRQUF4Qiw0Q0FBd0I7UUFDNUIsSUFBRyxTQUFTLEtBQUssSUFBSSxFQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQyxDQUFDO1NBQzNEO2FBQ0c7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFEQUFZLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHFEQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFMUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsNkJBQWEsR0FBYjtRQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxvQkFBSSxHQUFKO1FBQ0MsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBQ0YsWUFBQztBQUFELENBQUMsQ0F0Q2tDLDhDQUFLLEdBc0N2Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QzJCO0FBQ1U7QUFFQTtBQUNLO0FBRTNDO0lBQW9DLDBCQUFLO0lBR3hDLGdCQUFZLE9BQWdCLEVBQUUsSUFBVSxFQUFFLE9BQW1CO1FBQW5CLHFDQUFtQjtRQUE3RCxZQUNDLGtCQUFNLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBSTNCO1FBSEEsS0FBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFFckIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLG1EQUFVLENBQUMsS0FBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUMxQyxDQUFDO0lBRUQscUJBQUksR0FBSixVQUFLLFNBQXdCO1FBQXhCLDRDQUF3QjtRQUM1QixJQUFHLFNBQVMsS0FBSyxJQUFJLEVBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBQyxDQUFDLENBQUM7U0FDNUQ7YUFDRztZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUkscURBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCw4QkFBYSxHQUFiO1FBQ0MsT0FBTyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBRW5ELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHFCQUFJLEdBQUo7UUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUNGLGFBQUM7QUFBRCxDQUFDLENBckNtQyw4Q0FBSyxHQXFDeEM7Ozs7Ozs7Ozs7Ozs7O0FDMUNEO0FBQUE7QUFBQTtBQUE0QztBQUNrQjtBQUU5RDtJQU1DLGNBQVksS0FBaUIsRUFBRSxNQUFrQixFQUFFLElBQWE7UUFBaEUsaUJBb0JDO1FBbkJBLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBaUI7WUFDM0MsYUFBYTtZQUNiLElBQU0sU0FBUyxHQUFTLGlGQUEyQixDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9FQUFvRTtZQUN6TixJQUFNLFVBQVUsR0FBZSxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWhFLElBQUcsVUFBVSxLQUFLLFNBQVMsRUFBQztnQkFDM0IsSUFBRyxVQUFVLEtBQUssS0FBSSxDQUFDLEtBQUssSUFBSSxVQUFVLEtBQUssS0FBSSxDQUFDLE1BQU0sRUFBQztvQkFDMUQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Q7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxtQkFBSSxHQUFKO1FBQ0MsSUFBTSxRQUFRLEdBQUcsK0RBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFNLFNBQVMsR0FBRywrREFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUUxSSxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCx5QkFBVSxHQUFWO1FBQ0MsSUFBTSxRQUFRLEdBQUcsK0RBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFNLFNBQVMsR0FBRywrREFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRSxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxxQkFBTSxHQUFOO1FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx3QkFBUyxHQUFULFVBQVUsS0FBYTtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRixXQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMzREQ7QUFBQTtBQUE0QztBQUU1QztJQUtDLG1CQUFZLE9BQWdCLEVBQUUsRUFBYztRQUMzQyxJQUFJLENBQUMsRUFBRSxHQUFHLCtEQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVsQyxjQUFjO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCw4QkFBVSxHQUFWLFVBQVcsRUFBVztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRixnQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDeEJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF3QztBQUVQO0FBQ0U7QUFDRjtBQUNJO0FBR047QUFDVztBQUNtQjtBQUU3RDtJQU1DLGNBQVksVUFBa0I7UUFBOUIsaUJBbUZDO1FBbEZBLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsb0RBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU5RCxJQUFNLFNBQVMsR0FBRyxJQUFJLG1EQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFNLFVBQVUsR0FBRyxJQUFJLG1EQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU3QyxTQUFTLENBQUMsSUFBSSxDQUFDLHFEQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BILFVBQVUsQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXhJLElBQU0sT0FBTyxHQUFHLFVBQUMsTUFBcUI7WUFDckMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7UUFFRCxTQUFTLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztRQUNsQyxVQUFVLENBQUMsYUFBYSxHQUFHLFVBQUMsTUFBcUI7WUFDaEQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUVGLElBQU0sU0FBUyxHQUFHLElBQUksbURBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWhGLElBQU0sVUFBVSxHQUFHLElBQUksbURBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLFVBQVUsQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWpGLElBQU0sVUFBVSxHQUFHLElBQUksb0RBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLFVBQVUsQ0FBQyxJQUFJLENBQUMscURBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxxREFBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXBGLCtCQUErQjtRQUUvQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFpQjtZQUN4QyxJQUFHLEtBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxFQUFDO2dCQUNoQyxLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUVoRCxJQUFNLFlBQVksR0FBZ0IsaUZBQTJCLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBRWpKLElBQUcsWUFBWSxLQUFLLElBQUksRUFBQztvQkFDeEIsYUFBYTtvQkFDYixJQUFNLGdCQUFnQixHQUFlLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUVsRixJQUFHLGdCQUFnQixDQUFDLElBQUksS0FBSyxLQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLEtBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBQzt3QkFDdkgsSUFBSSxVQUFVLFNBQVksQ0FBQzt3QkFDM0IsSUFBSSxTQUFTLFNBQVksQ0FBQzt3QkFFMUIsSUFBRyxnQkFBZ0IsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFDOzRCQUM5QixVQUFVLEdBQUcsZ0JBQWdCLENBQUM7eUJBQzlCOzZCQUNHOzRCQUNILFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQzt5QkFDN0I7d0JBRUQsSUFBRyxLQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFDOzRCQUNyQyxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7eUJBQ3JDOzZCQUNHOzRCQUNILFNBQVMsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQzt5QkFDcEM7d0JBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxrREFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMxRCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ2Y7aUJBQ0Q7Z0JBRUQsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7YUFDNUI7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQWlCO1lBQzFDLElBQUcsS0FBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUM7Z0JBQ2hDLEtBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekU7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBRTVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqQyxXQUFXLENBQUM7WUFDWCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDVCxDQUFDO0lBRUQscUJBQU0sR0FBTjtRQUNDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0QsQ0FBQztJQUNGLFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzFHRDtBQUFBO0lBSUM7UUFDQyxZQUFZLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUUxQixZQUFZLENBQUMsVUFBVSxHQUFHO1lBQ3pCLGFBQWE7WUFDYixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLFlBQVk7WUFDWixhQUFhO1lBQ2IsZUFBZTtTQUNmLENBQUM7SUFDSCxDQUFDO0lBRUQscUNBQWMsR0FBZDtRQUNDLElBQUksTUFBYyxDQUFDO1FBQ25CLElBQUksUUFBUSxHQUEyQixFQUFFLENBQUM7UUFFMUMsS0FBYyxVQUF1QixFQUF2QixpQkFBWSxDQUFDLFVBQVUsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBQztZQUFsQyxNQUFNO1lBQ1QsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFFRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELGlDQUFVLEdBQVYsVUFBVyxNQUFjO1FBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMxQyxJQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBRWpDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRztnQkFDeEIsSUFBRyxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBQztvQkFDeEIsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBQzt3QkFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO3dCQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2I7eUJBQ0c7d0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDekUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDcEI7aUJBQ0Q7WUFDRixDQUFDO1lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBTyxNQUFNLFNBQU0sQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNGLG1CQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNqREQ7QUFBQTtBQUFPLElBQU0sMkJBQTJCLEdBQUcsVUFBQyxPQUFnQixFQUFFLFFBQWdCLEVBQUUsS0FBYTtJQUM1RixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBRW5DLE9BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLElBQUksTUFBTSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUM7UUFFekUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7S0FDOUI7SUFFRCxPQUFPLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1JEO0FBQUE7QUFBQTtBQUFnQztBQUV6QixJQUFNLFNBQVMsR0FBRyxVQUFDLE1BQWtCLEVBQUUsUUFBeUI7SUFBekIsMkNBQXlCO0lBQ25FLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFM0MsSUFBSSxDQUFDLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQztJQUNuQyxJQUFJLENBQUMsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDO0lBRW5DLEtBQWtCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTyxFQUFDO1FBQXRCLElBQUksUUFBTTtRQUNWLElBQUcsUUFBTSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFBRSxNQUFNO1FBRW5DLElBQU0sZUFBZSxHQUFHLFFBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQyxDQUFDLElBQUUsZUFBZSxDQUFDLFVBQVUsQ0FBQztRQUM5QixDQUFDLElBQUUsZUFBZSxDQUFDLFVBQVUsQ0FBQztLQUNqQztJQUVELElBQUcsUUFBUSxFQUFDO1FBQ1IsQ0FBQyxJQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxJQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDMUI7SUFFRCxPQUFPLElBQUksZ0RBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3hCRDtBQUFBO0lBSUMsaUJBQVksQ0FBYSxFQUFFLENBQWE7UUFBNUIseUJBQWE7UUFBRSx5QkFBYTtRQUN2QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUNGLGNBQUM7QUFBRCxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgQm94LCBFbGVtZW50LCBHLCBleHRlbmQsIG9mZiwgb24gfSBmcm9tICdAc3ZnZG90anMvc3ZnLmpzJ1xuXHJcbmNvbnN0IGdldENvb3Jkc0Zyb21FdmVudCA9IChldikgPT4ge1xyXG4gIGlmIChldi5jaGFuZ2VkVG91Y2hlcykge1xyXG4gICAgZXYgPSBldi5jaGFuZ2VkVG91Y2hlc1swXVxyXG4gIH1cclxuICByZXR1cm4geyB4OiBldi5jbGllbnRYLCB5OiBldi5jbGllbnRZIH1cclxufVxyXG5cclxuLy8gQ3JlYXRlcyBoYW5kbGVyLCBzYXZlcyBpdFxyXG5jbGFzcyBEcmFnSGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IgKGVsKSB7XHJcbiAgICBlbC5yZW1lbWJlcignX2RyYWdnYWJsZScsIHRoaXMpXHJcbiAgICB0aGlzLmVsID0gZWxcclxuXHJcbiAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zdGFydERyYWcgPSB0aGlzLnN0YXJ0RHJhZy5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmVuZERyYWcgPSB0aGlzLmVuZERyYWcuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgLy8gRW5hYmxlcyBvciBkaXNhYmxlZCBkcmFnIGJhc2VkIG9uIGlucHV0XHJcbiAgaW5pdCAoZW5hYmxlZCkge1xyXG4gICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgdGhpcy5lbC5vbignbW91c2Vkb3duLmRyYWcnLCB0aGlzLnN0YXJ0RHJhZylcclxuICAgICAgdGhpcy5lbC5vbigndG91Y2hzdGFydC5kcmFnJywgdGhpcy5zdGFydERyYWcpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVsLm9mZignbW91c2Vkb3duLmRyYWcnKVxyXG4gICAgICB0aGlzLmVsLm9mZigndG91Y2hzdGFydC5kcmFnJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFN0YXJ0IGRyYWdnaW5nXHJcbiAgc3RhcnREcmFnIChldikge1xuICAgIGNvbnN0IGlzTW91c2UgPSAhZXYudHlwZS5pbmRleE9mKCdtb3VzZScpXG5cbiAgICAvLyBDaGVjayBmb3IgbGVmdCBidXR0b25cclxuICAgIGlmIChpc01vdXNlICYmIChldi53aGljaCB8fCBldi5idXR0b25zKSAhPT0gMSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBGaXJlIGJlZm9yZWRyYWcgZXZlbnRcclxuICAgIGlmICh0aGlzLmVsLmRpc3BhdGNoKCdiZWZvcmVkcmFnJywgeyBldmVudDogZXYsIGhhbmRsZXI6IHRoaXMgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IGJyb3dzZXIgZHJhZyBiZWhhdmlvciBhcyBzb29uIGFzIHBvc3NpYmxlXHJcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgLy8gUHJldmVudCBwcm9wYWdhdGlvbiB0byBhIHBhcmVudCB0aGF0IG1pZ2h0IGFsc28gaGF2ZSBkcmFnZ2luZyBlbmFibGVkXHJcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHN0YXJ0IGV2ZW50cyBhcmUgdW5ib3VuZCBzbyB0aGF0IG9uZSBlbGVtZW50XHJcbiAgICAvLyBpcyBvbmx5IGRyYWdnZWQgYnkgb25lIGlucHV0IG9ubHlcclxuICAgIHRoaXMuaW5pdChmYWxzZSlcclxuXHJcbiAgICB0aGlzLmJveCA9IHRoaXMuZWwuYmJveCgpXHJcbiAgICB0aGlzLmxhc3RDbGljayA9IHRoaXMuZWwucG9pbnQoZ2V0Q29vcmRzRnJvbUV2ZW50KGV2KSlcclxuXHJcbiAgICAvLyBXZSBjb25zaWRlciB0aGUgZHJhZyBkb25lLCB3aGVuIGEgdG91Y2ggaXMgY2FuY2VsZWQsIHRvb1xyXG4gICAgY29uc3QgZXZlbnRNb3ZlID0gKGlzTW91c2UgPyAnbW91c2Vtb3ZlJyA6ICd0b3VjaG1vdmUnKSArICcuZHJhZydcclxuICAgIGNvbnN0IGV2ZW50RW5kID0gKGlzTW91c2UgPyAnbW91c2V1cCcgOiAndG91Y2hjYW5jZWwuZHJhZyB0b3VjaGVuZCcpICsgJy5kcmFnJ1xyXG5cclxuICAgIC8vIEJpbmQgZHJhZyBhbmQgZW5kIGV2ZW50cyB0byB3aW5kb3dcclxuICAgIG9uKHdpbmRvdywgZXZlbnRNb3ZlLCB0aGlzLmRyYWcpXHJcbiAgICBvbih3aW5kb3csIGV2ZW50RW5kLCB0aGlzLmVuZERyYWcpXHJcblxyXG4gICAgLy8gRmlyZSBkcmFnc3RhcnQgZXZlbnRcclxuICAgIHRoaXMuZWwuZmlyZSgnZHJhZ3N0YXJ0JywgeyBldmVudDogZXYsIGhhbmRsZXI6IHRoaXMsIGJveDogdGhpcy5ib3ggfSlcclxuICB9XHJcblxyXG4gIC8vIFdoaWxlIGRyYWdnaW5nXHJcbiAgZHJhZyAoZXYpIHtcclxuXHJcbiAgICBjb25zdCB7IGJveCwgbGFzdENsaWNrIH0gPSB0aGlzXHJcblxyXG4gICAgY29uc3QgY3VycmVudENsaWNrID0gdGhpcy5lbC5wb2ludChnZXRDb29yZHNGcm9tRXZlbnQoZXYpKVxyXG4gICAgY29uc3QgeCA9IGJveC54ICsgKGN1cnJlbnRDbGljay54IC0gbGFzdENsaWNrLngpXHJcbiAgICBjb25zdCB5ID0gYm94LnkgKyAoY3VycmVudENsaWNrLnkgLSBsYXN0Q2xpY2sueSlcclxuICAgIGNvbnN0IG5ld0JveCA9IG5ldyBCb3goeCwgeSwgYm94LncsIGJveC5oKVxyXG5cclxuICAgIGlmICh0aGlzLmVsLmRpc3BhdGNoKCdkcmFnbW92ZScsIHtcclxuICAgICAgZXZlbnQ6IGV2LFxyXG4gICAgICBoYW5kbGVyOiB0aGlzLFxyXG4gICAgICBib3g6IG5ld0JveFxyXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuXHJcblxyXG4gICAgdGhpcy5tb3ZlKHgsIHkpXHJcbiAgICByZXR1cm4gbmV3Qm94XHJcbiAgfVxyXG5cclxuICBtb3ZlICh4LCB5KSB7XHJcbiAgICAvLyBTdmcgZWxlbWVudHMgYmJveCBkZXBlbmRzIG9uIHRoZWlyIGNvbnRlbnQgZXZlbiB0aG91Z2ggdGhleSBoYXZlXHJcbiAgICAvLyB4LCB5LCB3aWR0aCBhbmQgaGVpZ2h0IC0gc3RyYW5nZSFcclxuICAgIC8vIFRoYXRzIHdoeSB3ZSBoYW5kbGUgdGhlbSB0aGUgc2FtZSBhcyBncm91cHNcclxuICAgIGlmICh0aGlzLmVsLnR5cGUgPT09ICdzdmcnKSB7XHJcbiAgICAgIEcucHJvdG90eXBlLm1vdmUuY2FsbCh0aGlzLmVsLCB4LCB5KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbC5tb3ZlKHgsIHkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbmREcmFnIChldikge1xuICAgIC8vIGZpbmFsIGRyYWdcclxuICAgIGNvbnN0IGJveCA9IHRoaXMuZHJhZyhldilcclxuXHJcbiAgICAvLyBmaXJlIGRyYWdlbmQgZXZlbnRcclxuICAgIHRoaXMuZWwuZmlyZSgnZHJhZ2VuZCcsIHsgZXZlbnQ6IGV2LCBoYW5kbGVyOiB0aGlzLCBib3ggfSlcclxuXHJcbiAgICAvLyB1bmJpbmQgZXZlbnRzXHJcbiAgICBvZmYod2luZG93LCAnbW91c2Vtb3ZlLmRyYWcnKVxyXG4gICAgb2ZmKHdpbmRvdywgJ3RvdWNobW92ZS5kcmFnJylcclxuICAgIG9mZih3aW5kb3csICdtb3VzZXVwLmRyYWcnKVxyXG4gICAgb2ZmKHdpbmRvdywgJ3RvdWNoZW5kLmRyYWcnKVxuXG4gICAgLy8gUmViaW5kIGluaXRpYWwgRXZlbnRzXG4gICAgdGhpcy5pbml0KHRydWUpXG4gIH1cclxufVxyXG5cclxuZXh0ZW5kKEVsZW1lbnQsIHtcclxuICBkcmFnZ2FibGUgKGVuYWJsZSA9IHRydWUpIHtcclxuICAgIGNvbnN0IGRyYWdIYW5kbGVyID0gdGhpcy5yZW1lbWJlcignX2RyYWdnYWJsZScpIHx8IG5ldyBEcmFnSGFuZGxlcih0aGlzKVxyXG4gICAgZHJhZ0hhbmRsZXIuaW5pdChlbmFibGUpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufSlcclxuIiwiLyohXG4qIEBzdmdkb3Rqcy9zdmcuanMgLSBBIGxpZ2h0d2VpZ2h0IGxpYnJhcnkgZm9yIG1hbmlwdWxhdGluZyBhbmQgYW5pbWF0aW5nIFNWRy5cbiogQHZlcnNpb24gMy4wLjE2XG4qIGh0dHBzOi8vc3ZnZG90anMuZ2l0aHViLmlvL1xuKlxuKiBAY29weXJpZ2h0IFdvdXQgRmllcmVucyA8d291dEBtaWNrLXdvdXQuY29tPlxuKiBAbGljZW5zZSBNSVRcbipcbiogQlVJTFQ6IFR1ZSBOb3YgMTIgMjAxOSAyMTo1NzoxNiBHTVQrMDEwMCAoR01UKzAxOjAwKVxuKi87XG52YXIgY29tbW9uanNHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB7fTtcblxuZnVuY3Rpb24gY3JlYXRlQ29tbW9uanNNb2R1bGUoZm4sIG1vZHVsZSkge1xuXHRyZXR1cm4gbW9kdWxlID0geyBleHBvcnRzOiB7fSB9LCBmbihtb2R1bGUsIG1vZHVsZS5leHBvcnRzKSwgbW9kdWxlLmV4cG9ydHM7XG59XG5cbnZhciBjaGVjayA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgJiYgaXQuTWF0aCA9PSBNYXRoICYmIGl0O1xufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWxfMSA9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgY2hlY2sodHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZikgfHxcbiAgY2hlY2sodHlwZW9mIGNvbW1vbmpzR2xvYmFsID09ICdvYmplY3QnICYmIGNvbW1vbmpzR2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxudmFyIGZhaWxzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbnZhciBkZXNjcmlwdG9ycyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG5cbnZhciBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICFuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgMTogMiB9LCAxKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxudmFyIGYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6IG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG52YXIgb2JqZWN0UHJvcGVydHlJc0VudW1lcmFibGUgPSB7XG5cdGY6IGZcbn07XG5cbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciBjbGFzc29mUmF3ID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuXG52YXIgc3BsaXQgPSAnJy5zcGxpdDtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBpbmRleGVkT2JqZWN0ID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgcmV0dXJuICFPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mUmF3KGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0LmNhbGwoaXQsICcnKSA6IE9iamVjdChpdCk7XG59IDogT2JqZWN0O1xuXG4vLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZXF1aXJlb2JqZWN0Y29lcmNpYmxlXG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcblxuLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcblxuXG5cbnZhciB0b0luZGV4ZWRPYmplY3QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcblxudmFyIGlzT2JqZWN0ID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuXG4vLyBgVG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xudmFyIHRvUHJpbWl0aXZlID0gZnVuY3Rpb24gKGlucHV0LCBQUkVGRVJSRURfU1RSSU5HKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpbnB1dC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcblxudmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5cbnZhciBoYXMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG5cbnZhciBkb2N1bWVudCQxID0gZ2xvYmFsXzEuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBFWElTVFMgPSBpc09iamVjdChkb2N1bWVudCQxKSAmJiBpc09iamVjdChkb2N1bWVudCQxLmNyZWF0ZUVsZW1lbnQpO1xuXG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBFWElTVFMgPyBkb2N1bWVudCQxLmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG52YXIgaWU4RG9tRGVmaW5lID0gIWRlc2NyaXB0b3JzICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuXG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5ZGVzY3JpcHRvclxudmFyIGYkMSA9IGRlc2NyaXB0b3JzID8gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSW5kZXhlZE9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoaWU4RG9tRGVmaW5lKSB0cnkge1xuICAgIHJldHVybiBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighb2JqZWN0UHJvcGVydHlJc0VudW1lcmFibGUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG5cbnZhciBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSB7XG5cdGY6IGYkMVxufTtcblxudmFyIGFuT2JqZWN0ID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG52YXIgbmF0aXZlRGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnR5XG52YXIgZiQyID0gZGVzY3JpcHRvcnMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChpZThEb21EZWZpbmUpIHRyeSB7XG4gICAgcmV0dXJuIG5hdGl2ZURlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcblxudmFyIG9iamVjdERlZmluZVByb3BlcnR5ID0ge1xuXHRmOiBmJDJcbn07XG5cbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSBkZXNjcmlwdG9ycyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdERlZmluZVByb3BlcnR5LmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG5cbnZhciBzZXRHbG9iYWwgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0cnkge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShnbG9iYWxfMSwga2V5LCB2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsXzFba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbF8xW1NIQVJFRF0gfHwgc2V0R2xvYmFsKFNIQVJFRCwge30pO1xuXG52YXIgc2hhcmVkU3RvcmUgPSBzdG9yZTtcblxudmFyIHNoYXJlZCA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUpIHtcbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzaGFyZWRTdG9yZVtrZXldIHx8IChzaGFyZWRTdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4zLjYnLFxuICBtb2RlOiAgJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTkgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbn0pO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IHNoYXJlZCgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcblxudmFyIFdlYWtNYXAgPSBnbG9iYWxfMS5XZWFrTWFwO1xuXG52YXIgbmF0aXZlV2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nICYmIC9uYXRpdmUgY29kZS8udGVzdChmdW5jdGlvblRvU3RyaW5nLmNhbGwoV2Vha01hcCkpO1xuXG52YXIgaWQgPSAwO1xudmFyIHBvc3RmaXggPSBNYXRoLnJhbmRvbSgpO1xuXG52YXIgdWlkID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgU3RyaW5nKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArICgrK2lkICsgcG9zdGZpeCkudG9TdHJpbmcoMzYpO1xufTtcblxudmFyIGtleXMgPSBzaGFyZWQoJ2tleXMnKTtcblxudmFyIHNoYXJlZEtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIGtleXNba2V5XSB8fCAoa2V5c1trZXldID0gdWlkKGtleSkpO1xufTtcblxudmFyIGhpZGRlbktleXMgPSB7fTtcblxudmFyIFdlYWtNYXAkMSA9IGdsb2JhbF8xLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcyQxO1xuXG52YXIgZW5mb3JjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaGFzJDEoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKG5hdGl2ZVdlYWtNYXApIHtcbiAgdmFyIHN0b3JlJDEgPSBuZXcgV2Vha01hcCQxKCk7XG4gIHZhciB3bWdldCA9IHN0b3JlJDEuZ2V0O1xuICB2YXIgd21oYXMgPSBzdG9yZSQxLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUkMS5zZXQ7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICB3bXNldC5jYWxsKHN0b3JlJDEsIGl0LCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gd21nZXQuY2FsbChzdG9yZSQxLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyQxID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtaGFzLmNhbGwoc3RvcmUkMSwgaXQpO1xuICB9O1xufSBlbHNlIHtcbiAgdmFyIFNUQVRFID0gc2hhcmVkS2V5KCdzdGF0ZScpO1xuICBoaWRkZW5LZXlzW1NUQVRFXSA9IHRydWU7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzJDEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbnZhciBpbnRlcm5hbFN0YXRlID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzJDEsXG4gIGVuZm9yY2U6IGVuZm9yY2UsXG4gIGdldHRlckZvcjogZ2V0dGVyRm9yXG59O1xuXG52YXIgcmVkZWZpbmUgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlKSB7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IGludGVybmFsU3RhdGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gaW50ZXJuYWxTdGF0ZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKGZ1bmN0aW9uVG9TdHJpbmcpLnNwbGl0KCd0b1N0cmluZycpO1xuXG5zaGFyZWQoJ2luc3BlY3RTb3VyY2UnLCBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcuY2FsbChpdCk7XG59KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJyAmJiAhaGFzKHZhbHVlLCAnbmFtZScpKSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkodmFsdWUsICduYW1lJywga2V5KTtcbiAgICBlbmZvcmNlSW50ZXJuYWxTdGF0ZSh2YWx1ZSkuc291cmNlID0gVEVNUExBVEUuam9pbih0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8ga2V5IDogJycpO1xuICB9XG4gIGlmIChPID09PSBnbG9iYWxfMSkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2Ugc2V0R2xvYmFsKGtleSwgdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICghdW5zYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgfSBlbHNlIGlmICghbm9UYXJnZXRHZXQgJiYgT1trZXldKSB7XG4gICAgc2ltcGxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgZWxzZSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGZ1bmN0aW9uVG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xufSk7XG5cbnZhciBwYXRoID0gZ2xvYmFsXzE7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YXJpYWJsZSA9PSAnZnVuY3Rpb24nID8gdmFyaWFibGUgOiB1bmRlZmluZWQ7XG59O1xuXG52YXIgZ2V0QnVpbHRJbiA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24ocGF0aFtuYW1lc3BhY2VdKSB8fCBhRnVuY3Rpb24oZ2xvYmFsXzFbbmFtZXNwYWNlXSlcbiAgICA6IHBhdGhbbmFtZXNwYWNlXSAmJiBwYXRoW25hbWVzcGFjZV1bbWV0aG9kXSB8fCBnbG9iYWxfMVtuYW1lc3BhY2VdICYmIGdsb2JhbF8xW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG5cbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLy8gYFRvSW50ZWdlcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b2ludGVnZXJcbnZhciB0b0ludGVnZXIgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzTmFOKGFyZ3VtZW50ID0gK2FyZ3VtZW50KSA/IDAgOiAoYXJndW1lbnQgPiAwID8gZmxvb3IgOiBjZWlsKShhcmd1bWVudCk7XG59O1xuXG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIGBUb0xlbmd0aGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b2xlbmd0aFxudmFyIHRvTGVuZ3RoID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluJDEgPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihsZW5ndGgsIGxlbmd0aCkuXG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW50ZWdlciA8IDAgPyBtYXgoaW50ZWdlciArIGxlbmd0aCwgMCkgOiBtaW4kMShpbnRlZ2VyLCBsZW5ndGgpO1xufTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbnZhciBhcnJheUluY2x1ZGVzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBjcmVhdGVNZXRob2QodHJ1ZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG5cbnZhciBpbmRleE9mID0gYXJyYXlJbmNsdWRlcy5pbmRleE9mO1xuXG5cbnZhciBvYmplY3RLZXlzSW50ZXJuYWwgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhcyhoaWRkZW5LZXlzLCBrZXkpICYmIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gSUU4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG52YXIgZW51bUJ1Z0tleXMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuXG52YXIgaGlkZGVuS2V5cyQxID0gZW51bUJ1Z0tleXMuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xudmFyIGYkMyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gb2JqZWN0S2V5c0ludGVybmFsKE8sIGhpZGRlbktleXMkMSk7XG59O1xuXG52YXIgb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lcyA9IHtcblx0ZjogZiQzXG59O1xuXG52YXIgZiQ0ID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxudmFyIG9iamVjdEdldE93blByb3BlcnR5U3ltYm9scyA9IHtcblx0ZjogZiQ0XG59O1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG52YXIgb3duS2V5cyA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnb3duS2V5cycpIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IG9iamVjdEdldE93blByb3BlcnR5U3ltYm9scy5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSkgOiBrZXlzO1xufTtcblxudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcbiAgdmFyIGtleXMgPSBvd25LZXlzKHNvdXJjZSk7XG4gIHZhciBkZWZpbmVQcm9wZXJ0eSA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKCFoYXModGFyZ2V0LCBrZXkpKSBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gIH1cbn07XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbnZhciBpc0ZvcmNlZF8xID0gaXNGb3JjZWQ7XG5cbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMSA9IG9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvci5mO1xuXG5cblxuXG5cblxuLypcbiAgb3B0aW9ucy50YXJnZXQgICAgICAtIG5hbWUgb2YgdGhlIHRhcmdldCBvYmplY3RcbiAgb3B0aW9ucy5nbG9iYWwgICAgICAtIHRhcmdldCBpcyB0aGUgZ2xvYmFsIG9iamVjdFxuICBvcHRpb25zLnN0YXQgICAgICAgIC0gZXhwb3J0IGFzIHN0YXRpYyBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnByb3RvICAgICAgIC0gZXhwb3J0IGFzIHByb3RvdHlwZSBtZXRob2RzIG9mIHRhcmdldFxuICBvcHRpb25zLnJlYWwgICAgICAgIC0gcmVhbCBwcm90b3R5cGUgbWV0aG9kIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy5mb3JjZWQgICAgICAtIGV4cG9ydCBldmVuIGlmIHRoZSBuYXRpdmUgZmVhdHVyZSBpcyBhdmFpbGFibGVcbiAgb3B0aW9ucy5iaW5kICAgICAgICAtIGJpbmQgbWV0aG9kcyB0byB0aGUgdGFyZ2V0LCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMud3JhcCAgICAgICAgLSB3cmFwIGNvbnN0cnVjdG9ycyB0byBwcmV2ZW50aW5nIGdsb2JhbCBwb2xsdXRpb24sIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy51bnNhZmUgICAgICAtIHVzZSB0aGUgc2ltcGxlIGFzc2lnbm1lbnQgb2YgcHJvcGVydHkgaW5zdGVhZCBvZiBkZWxldGUgKyBkZWZpbmVQcm9wZXJ0eVxuICBvcHRpb25zLnNoYW0gICAgICAgIC0gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICBvcHRpb25zLmVudW1lcmFibGUgIC0gZXhwb3J0IGFzIGVudW1lcmFibGUgcHJvcGVydHlcbiAgb3B0aW9ucy5ub1RhcmdldEdldCAtIHByZXZlbnQgY2FsbGluZyBhIGdldHRlciBvbiB0YXJnZXRcbiovXG52YXIgX2V4cG9ydCA9IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcbiAgdmFyIFRBUkdFVCA9IG9wdGlvbnMudGFyZ2V0O1xuICB2YXIgR0xPQkFMID0gb3B0aW9ucy5nbG9iYWw7XG4gIHZhciBTVEFUSUMgPSBvcHRpb25zLnN0YXQ7XG4gIHZhciBGT1JDRUQsIHRhcmdldCwga2V5LCB0YXJnZXRQcm9wZXJ0eSwgc291cmNlUHJvcGVydHksIGRlc2NyaXB0b3I7XG4gIGlmIChHTE9CQUwpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxfMTtcbiAgfSBlbHNlIGlmIChTVEFUSUMpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWxfMVtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsXzFbVEFSR0VUXSB8fCB7fSkucHJvdG90eXBlO1xuICB9XG4gIGlmICh0YXJnZXQpIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIHNvdXJjZVByb3BlcnR5ID0gc291cmNlW2tleV07XG4gICAgaWYgKG9wdGlvbnMubm9UYXJnZXRHZXQpIHtcbiAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMSh0YXJnZXQsIGtleSk7XG4gICAgICB0YXJnZXRQcm9wZXJ0eSA9IGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9IGVsc2UgdGFyZ2V0UHJvcGVydHkgPSB0YXJnZXRba2V5XTtcbiAgICBGT1JDRUQgPSBpc0ZvcmNlZF8xKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcblxuLy8gYElzQXJyYXlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNhcnJheVxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjbGFzc29mUmF3KGFyZykgPT0gJ0FycmF5Jztcbn07XG5cbnZhciBjcmVhdGVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIHByb3BlcnR5S2V5ID0gdG9QcmltaXRpdmUoa2V5KTtcbiAgaWYgKHByb3BlcnR5S2V5IGluIG9iamVjdCkgb2JqZWN0RGVmaW5lUHJvcGVydHkuZihvYmplY3QsIHByb3BlcnR5S2V5LCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbcHJvcGVydHlLZXldID0gdmFsdWU7XG59O1xuXG52YXIgbmF0aXZlU3ltYm9sID0gISFPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIENocm9tZSAzOCBTeW1ib2wgaGFzIGluY29ycmVjdCB0b1N0cmluZyBjb252ZXJzaW9uXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICByZXR1cm4gIVN0cmluZyhTeW1ib2woKSk7XG59KTtcblxudmFyIFN5bWJvbCQxID0gZ2xvYmFsXzEuU3ltYm9sO1xudmFyIHN0b3JlJDIgPSBzaGFyZWQoJ3drcycpO1xuXG52YXIgd2VsbEtub3duU3ltYm9sID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlJDJbbmFtZV0gfHwgKHN0b3JlJDJbbmFtZV0gPSBuYXRpdmVTeW1ib2wgJiYgU3ltYm9sJDFbbmFtZV1cbiAgICB8fCAobmF0aXZlU3ltYm9sID8gU3ltYm9sJDEgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbnZhciB1c2VyQWdlbnQgPSBnZXRCdWlsdEluKCduYXZpZ2F0b3InLCAndXNlckFnZW50JykgfHwgJyc7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsXzEucHJvY2VzcztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucztcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4O1xudmFyIG1hdGNoLCB2ZXJzaW9uO1xuXG5pZiAodjgpIHtcbiAgbWF0Y2ggPSB2OC5zcGxpdCgnLicpO1xuICB2ZXJzaW9uID0gbWF0Y2hbMF0gKyBtYXRjaFsxXTtcbn0gZWxzZSBpZiAodXNlckFnZW50KSB7XG4gIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLyk7XG4gIGlmICghbWF0Y2ggfHwgbWF0Y2hbMV0gPj0gNzQpIHtcbiAgICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvQ2hyb21lXFwvKFxcZCspLyk7XG4gICAgaWYgKG1hdGNoKSB2ZXJzaW9uID0gbWF0Y2hbMV07XG4gIH1cbn1cblxudmFyIHY4VmVyc2lvbiA9IHZlcnNpb24gJiYgK3ZlcnNpb247XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbnZhciBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0ID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FKSB7XG4gIC8vIFdlIGNhbid0IHVzZSB0aGlzIGZlYXR1cmUgZGV0ZWN0aW9uIGluIFY4IHNpbmNlIGl0IGNhdXNlc1xuICAvLyBkZW9wdGltaXphdGlvbiBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNjc3XG4gIHJldHVybiB2OFZlcnNpb24gPj0gNTEgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBhcnJheS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgIGNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZm9vOiAxIH07XG4gICAgfTtcbiAgICByZXR1cm4gYXJyYXlbTUVUSE9EX05BTUVdKEJvb2xlYW4pLmZvbyAhPT0gMTtcbiAgfSk7XG59O1xuXG52YXIgU1BFQ0lFUyQxID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG52YXIgbmF0aXZlU2xpY2UgPSBbXS5zbGljZTtcbnZhciBtYXgkMSA9IE1hdGgubWF4O1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnNsaWNlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zbGljZVxuLy8gZmFsbGJhY2sgZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmdzIGFuZCBET00gb2JqZWN0c1xuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIWFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQoJ3NsaWNlJykgfSwge1xuICBzbGljZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGsgPSB0b0Fic29sdXRlSW5kZXgoc3RhcnQsIGxlbmd0aCk7XG4gICAgdmFyIGZpbiA9IHRvQWJzb2x1dGVJbmRleChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IGVuZCwgbGVuZ3RoKTtcbiAgICAvLyBpbmxpbmUgYEFycmF5U3BlY2llc0NyZWF0ZWAgZm9yIHVzYWdlIG5hdGl2ZSBgQXJyYXkjc2xpY2VgIHdoZXJlIGl0J3MgcG9zc2libGVcbiAgICB2YXIgQ29uc3RydWN0b3IsIHJlc3VsdCwgbjtcbiAgICBpZiAoaXNBcnJheShPKSkge1xuICAgICAgQ29uc3RydWN0b3IgPSBPLmNvbnN0cnVjdG9yO1xuICAgICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgQ29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAoQ29uc3RydWN0b3IgPT09IEFycmF5IHx8IGlzQXJyYXkoQ29uc3RydWN0b3IucHJvdG90eXBlKSkpIHtcbiAgICAgICAgQ29uc3RydWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KENvbnN0cnVjdG9yKSkge1xuICAgICAgICBDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yW1NQRUNJRVMkMV07XG4gICAgICAgIGlmIChDb25zdHJ1Y3RvciA9PT0gbnVsbCkgQ29uc3RydWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAoQ29uc3RydWN0b3IgPT09IEFycmF5IHx8IENvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNsaWNlLmNhbGwoTywgaywgZmluKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0ID0gbmV3IChDb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDb25zdHJ1Y3RvcikobWF4JDEoZmluIC0gaywgMCkpO1xuICAgIGZvciAobiA9IDA7IGsgPCBmaW47IGsrKywgbisrKSBpZiAoayBpbiBPKSBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIG4sIE9ba10pO1xuICAgIHJlc3VsdC5sZW5ndGggPSBuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZyA9IEZ1bmN0aW9uUHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIG5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLztcbnZhciBOQU1FID0gJ25hbWUnO1xuXG4vLyBGdW5jdGlvbiBpbnN0YW5jZXMgYC5uYW1lYCBwcm9wZXJ0eVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZnVuY3Rpb24taW5zdGFuY2VzLW5hbWVcbmlmIChkZXNjcmlwdG9ycyAmJiAhKE5BTUUgaW4gRnVuY3Rpb25Qcm90b3R5cGUpKSB7XG4gIGRlZmluZVByb3BlcnR5KEZ1bmN0aW9uUHJvdG90eXBlLCBOQU1FLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uUHJvdG90eXBlVG9TdHJpbmcuY2FsbCh0aGlzKS5tYXRjaChuYW1lUkUpWzFdO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbnZhciBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzID0gb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lcy5mO1xuXG52YXIgdG9TdHJpbmckMSA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5hdGl2ZUdldE93blByb3BlcnR5TmFtZXMoaXQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgZiQ1ID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmckMS5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJ1xuICAgID8gZ2V0V2luZG93TmFtZXMoaXQpXG4gICAgOiBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzKHRvSW5kZXhlZE9iamVjdChpdCkpO1xufTtcblxudmFyIG9iamVjdEdldE93blByb3BlcnR5TmFtZXNFeHRlcm5hbCA9IHtcblx0ZjogZiQ1XG59O1xuXG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyQxID0gb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lc0V4dGVybmFsLmY7XG5cbnZhciBGQUlMU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyByZXR1cm4gIU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKDEpOyB9KTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGQUlMU19PTl9QUklNSVRJVkVTIH0sIHtcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyQxXG59KTtcblxuZnVuY3Rpb24gX3R5cGVvZjIob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mMiA9IGZ1bmN0aW9uIF90eXBlb2YyKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZjIgPSBmdW5jdGlvbiBfdHlwZW9mMihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2YyKG9iaik7IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBfdHlwZW9mMihTeW1ib2wuaXRlcmF0b3IpID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gX3R5cGVvZjIob2JqKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IF90eXBlb2YyKG9iaik7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b29iamVjdFxudmFyIHRvT2JqZWN0ID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcblxuLy8gYE9iamVjdC5rZXlzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5rZXlzXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gb2JqZWN0S2V5c0ludGVybmFsKE8sIGVudW1CdWdLZXlzKTtcbn07XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydGllc1xudmFyIG9iamVjdERlZmluZVByb3BlcnRpZXMgPSBkZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mKE8sIGtleSA9IGtleXNbaW5kZXgrK10sIFByb3BlcnRpZXNba2V5XSk7XG4gIHJldHVybiBPO1xufTtcblxudmFyIGh0bWwgPSBnZXRCdWlsdEluKCdkb2N1bWVudCcsICdkb2N1bWVudEVsZW1lbnQnKTtcblxudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIGxlbmd0aCA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgc2NyaXB0ID0gJ3NjcmlwdCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGpzID0gJ2phdmEnICsgc2NyaXB0ICsgJzonO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoanMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgc2NyaXB0ICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnLycgKyBzY3JpcHQgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAobGVuZ3RoLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbbGVuZ3RoXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG4vLyBgT2JqZWN0LmNyZWF0ZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuY3JlYXRlXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBvYmplY3REZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cbnZhciBmJDYgPSB3ZWxsS25vd25TeW1ib2w7XG5cbnZhciB3cmFwcGVkV2VsbEtub3duU3ltYm9sID0ge1xuXHRmOiBmJDZcbn07XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSQxID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcblxudmFyIGRlZmluZVdlbGxLbm93blN5bWJvbCA9IGZ1bmN0aW9uIChOQU1FKSB7XG4gIHZhciBTeW1ib2wgPSBwYXRoLlN5bWJvbCB8fCAocGF0aC5TeW1ib2wgPSB7fSk7XG4gIGlmICghaGFzKFN5bWJvbCwgTkFNRSkpIGRlZmluZVByb3BlcnR5JDEoU3ltYm9sLCBOQU1FLCB7XG4gICAgdmFsdWU6IHdyYXBwZWRXZWxsS25vd25TeW1ib2wuZihOQU1FKVxuICB9KTtcbn07XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSQyID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcblxuXG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgc2V0VG9TdHJpbmdUYWcgPSBmdW5jdGlvbiAoaXQsIFRBRywgU1RBVElDKSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gU1RBVElDID8gaXQgOiBpdC5wcm90b3R5cGUsIFRPX1NUUklOR19UQUcpKSB7XG4gICAgZGVmaW5lUHJvcGVydHkkMihpdCwgVE9fU1RSSU5HX1RBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBUQUcgfSk7XG4gIH1cbn07XG5cbnZhciBhRnVuY3Rpb24kMSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG4vLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBiaW5kQ29udGV4dCA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbiQxKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQpO1xuICAgIH07XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG52YXIgU1BFQ0lFUyQyID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gZnVuY3Rpb24gKG9yaWdpbmFsQXJyYXksIGxlbmd0aCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWxBcnJheSkpIHtcbiAgICBDID0gb3JpZ2luYWxBcnJheS5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgZWxzZSBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVMkMl07XG4gICAgICBpZiAoQyA9PT0gbnVsbCkgQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIG5ldyAoQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDKShsZW5ndGggPT09IDAgPyAwIDogbGVuZ3RoKTtcbn07XG5cbnZhciBwdXNoID0gW10ucHVzaDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGZvckVhY2gsIG1hcCwgZmlsdGVyLCBzb21lLCBldmVyeSwgZmluZCwgZmluZEluZGV4IH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QkMSA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCwgc3BlY2lmaWNDcmVhdGUpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IGluZGV4ZWRPYmplY3QoTyk7XG4gICAgdmFyIGJvdW5kRnVuY3Rpb24gPSBiaW5kQ29udGV4dChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGNyZWF0ZSA9IHNwZWNpZmljQ3JlYXRlIHx8IGFycmF5U3BlY2llc0NyZWF0ZTtcbiAgICB2YXIgdGFyZ2V0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsdWUsIHJlc3VsdDtcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbHVlID0gc2VsZltpbmRleF07XG4gICAgICByZXN1bHQgPSBib3VuZEZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSB0YXJnZXRbaW5kZXhdID0gcmVzdWx0OyAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzdWx0KSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbHVlOyAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcHVzaC5jYWxsKHRhcmdldCwgdmFsdWUpOyAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHRhcmdldDtcbiAgfTtcbn07XG5cbnZhciBhcnJheUl0ZXJhdGlvbiA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbiAgZm9yRWFjaDogY3JlYXRlTWV0aG9kJDEoMCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUubWFwYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLm1hcFxuICBtYXA6IGNyZWF0ZU1ldGhvZCQxKDEpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgZmlsdGVyOiBjcmVhdGVNZXRob2QkMSgyKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5zb21lYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNvbWVcbiAgc29tZTogY3JlYXRlTWV0aG9kJDEoMyksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZXZlcnlgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZXZlcnlcbiAgZXZlcnk6IGNyZWF0ZU1ldGhvZCQxKDQpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbmRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuICBmaW5kOiBjcmVhdGVNZXRob2QkMSg1KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZEluZGV4XG4gIGZpbmRJbmRleDogY3JlYXRlTWV0aG9kJDEoNilcbn07XG5cbnZhciAkZm9yRWFjaCA9IGFycmF5SXRlcmF0aW9uLmZvckVhY2g7XG5cbnZhciBISURERU4gPSBzaGFyZWRLZXkoJ2hpZGRlbicpO1xudmFyIFNZTUJPTCA9ICdTeW1ib2wnO1xudmFyIFBST1RPVFlQRSQxID0gJ3Byb3RvdHlwZSc7XG52YXIgVE9fUFJJTUlUSVZFID0gd2VsbEtub3duU3ltYm9sKCd0b1ByaW1pdGl2ZScpO1xudmFyIHNldEludGVybmFsU3RhdGUgPSBpbnRlcm5hbFN0YXRlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gaW50ZXJuYWxTdGF0ZS5nZXR0ZXJGb3IoU1lNQk9MKTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3RbUFJPVE9UWVBFJDFdO1xudmFyICRTeW1ib2wgPSBnbG9iYWxfMS5TeW1ib2w7XG52YXIgSlNPTiQxID0gZ2xvYmFsXzEuSlNPTjtcbnZhciBuYXRpdmVKU09OU3RyaW5naWZ5ID0gSlNPTiQxICYmIEpTT04kMS5zdHJpbmdpZnk7XG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDEgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcbnZhciBuYXRpdmVEZWZpbmVQcm9wZXJ0eSQxID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcbnZhciBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzJDIgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzRXh0ZXJuYWwuZjtcbnZhciBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSQxID0gb2JqZWN0UHJvcGVydHlJc0VudW1lcmFibGUuZjtcbnZhciBBbGxTeW1ib2xzID0gc2hhcmVkKCdzeW1ib2xzJyk7XG52YXIgT2JqZWN0UHJvdG90eXBlU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIFN0cmluZ1RvU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N0cmluZy10by1zeW1ib2wtcmVnaXN0cnknKTtcbnZhciBTeW1ib2xUb1N0cmluZ1JlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtdG8tc3RyaW5nLXJlZ2lzdHJ5Jyk7XG52YXIgV2VsbEtub3duU3ltYm9sc1N0b3JlID0gc2hhcmVkKCd3a3MnKTtcbnZhciBRT2JqZWN0ID0gZ2xvYmFsXzEuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIFVTRV9TRVRURVIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEUkMV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFJDFdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG9iamVjdENyZWF0ZShuYXRpdmVEZWZpbmVQcm9wZXJ0eSQxKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5hdGl2ZURlZmluZVByb3BlcnR5JDEodGhpcywgJ2EnLCB7IHZhbHVlOiA3IH0pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24gKE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgdmFyIE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMShPYmplY3RQcm90b3R5cGUsIFApO1xuICBpZiAoT2JqZWN0UHJvdG90eXBlRGVzY3JpcHRvcikgZGVsZXRlIE9iamVjdFByb3RvdHlwZVtQXTtcbiAgbmF0aXZlRGVmaW5lUHJvcGVydHkkMShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgaWYgKE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IgJiYgTyAhPT0gT2JqZWN0UHJvdG90eXBlKSB7XG4gICAgbmF0aXZlRGVmaW5lUHJvcGVydHkkMShPYmplY3RQcm90b3R5cGUsIFAsIE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IpO1xuICB9XG59IDogbmF0aXZlRGVmaW5lUHJvcGVydHkkMTtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnLCBkZXNjcmlwdGlvbikge1xuICB2YXIgc3ltYm9sID0gQWxsU3ltYm9sc1t0YWddID0gb2JqZWN0Q3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFJDFdKTtcbiAgc2V0SW50ZXJuYWxTdGF0ZShzeW1ib2wsIHtcbiAgICB0eXBlOiBTWU1CT0wsXG4gICAgdGFnOiB0YWcsXG4gICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG4gIH0pO1xuICBpZiAoIWRlc2NyaXB0b3JzKSBzeW1ib2wuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgcmV0dXJuIHN5bWJvbDtcbn07XG5cbnZhciBpc1N5bWJvbCA9IG5hdGl2ZVN5bWJvbCAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGl0KSBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBpZiAoTyA9PT0gT2JqZWN0UHJvdG90eXBlKSAkZGVmaW5lUHJvcGVydHkoT2JqZWN0UHJvdG90eXBlU3ltYm9scywgUCwgQXR0cmlidXRlcyk7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5ID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSkpIHtcbiAgICBpZiAoIUF0dHJpYnV0ZXMuZW51bWVyYWJsZSkge1xuICAgICAgaWYgKCFoYXMoTywgSElEREVOKSkgbmF0aXZlRGVmaW5lUHJvcGVydHkkMShPLCBISURERU4sIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB7fSkpO1xuICAgICAgT1tISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzKE8sIEhJRERFTikgJiYgT1tISURERU5dW2tleV0pIE9bSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBBdHRyaWJ1dGVzID0gb2JqZWN0Q3JlYXRlKEF0dHJpYnV0ZXMsIHsgZW51bWVyYWJsZTogY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjcmlwdG9yKE8sIGtleSwgQXR0cmlidXRlcyk7XG4gIH0gcmV0dXJuIG5hdGl2ZURlZmluZVByb3BlcnR5JDEoTywga2V5LCBBdHRyaWJ1dGVzKTtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIHByb3BlcnRpZXMgPSB0b0luZGV4ZWRPYmplY3QoUHJvcGVydGllcyk7XG4gIHZhciBrZXlzID0gb2JqZWN0S2V5cyhwcm9wZXJ0aWVzKS5jb25jYXQoJGdldE93blByb3BlcnR5U3ltYm9scyhwcm9wZXJ0aWVzKSk7XG4gICRmb3JFYWNoKGtleXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIWRlc2NyaXB0b3JzIHx8ICRwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHByb3BlcnRpZXMsIGtleSkpICRkZWZpbmVQcm9wZXJ0eShPLCBrZXksIHByb3BlcnRpZXNba2V5XSk7XG4gIH0pO1xuICByZXR1cm4gTztcbn07XG5cbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IG9iamVjdENyZWF0ZShPKSA6ICRkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdENyZWF0ZShPKSwgUHJvcGVydGllcyk7XG59O1xuXG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoVikge1xuICB2YXIgUCA9IHRvUHJpbWl0aXZlKFYsIHRydWUpO1xuICB2YXIgZW51bWVyYWJsZSA9IG5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlJDEuY2FsbCh0aGlzLCBQKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvdHlwZSAmJiBoYXMoQWxsU3ltYm9scywgUCkgJiYgIWhhcyhPYmplY3RQcm90b3R5cGVTeW1ib2xzLCBQKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gZW51bWVyYWJsZSB8fCAhaGFzKHRoaXMsIFApIHx8ICFoYXMoQWxsU3ltYm9scywgUCkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW1BdID8gZW51bWVyYWJsZSA6IHRydWU7XG59O1xuXG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIHZhciBpdCA9IHRvSW5kZXhlZE9iamVjdChPKTtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvdHlwZSAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9iamVjdFByb3RvdHlwZVN5bWJvbHMsIGtleSkpIHJldHVybjtcbiAgdmFyIGRlc2NyaXB0b3IgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMShpdCwga2V5KTtcbiAgaWYgKGRlc2NyaXB0b3IgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSkge1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGRlc2NyaXB0b3I7XG59O1xuXG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgdmFyIG5hbWVzID0gbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyQyKHRvSW5kZXhlZE9iamVjdChPKSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgJGZvckVhY2gobmFtZXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoaGlkZGVuS2V5cywga2V5KSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhPKSB7XG4gIHZhciBJU19PQkpFQ1RfUFJPVE9UWVBFID0gTyA9PT0gT2JqZWN0UHJvdG90eXBlO1xuICB2YXIgbmFtZXMgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzJDIoSVNfT0JKRUNUX1BST1RPVFlQRSA/IE9iamVjdFByb3RvdHlwZVN5bWJvbHMgOiB0b0luZGV4ZWRPYmplY3QoTykpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gICRmb3JFYWNoKG5hbWVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICghSVNfT0JKRUNUX1BST1RPVFlQRSB8fCBoYXMoT2JqZWN0UHJvdG90eXBlLCBrZXkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gYFN5bWJvbGAgY29uc3RydWN0b3Jcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC1jb25zdHJ1Y3RvclxuaWYgKCFuYXRpdmVTeW1ib2wpIHtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpIHRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gIWFyZ3VtZW50cy5sZW5ndGggfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBTdHJpbmcoYXJndW1lbnRzWzBdKTtcbiAgICB2YXIgdGFnID0gdWlkKGRlc2NyaXB0aW9uKTtcbiAgICB2YXIgc2V0dGVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG90eXBlKSBzZXR0ZXIuY2FsbChPYmplY3RQcm90b3R5cGVTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZiAoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSkgdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2NyaXB0b3IodGhpcywgdGFnLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmIChkZXNjcmlwdG9ycyAmJiBVU0VfU0VUVEVSKSBzZXRTeW1ib2xEZXNjcmlwdG9yKE9iamVjdFByb3RvdHlwZSwgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiBzZXR0ZXIgfSk7XG4gICAgcmV0dXJuIHdyYXAodGFnLCBkZXNjcmlwdGlvbik7XG4gIH07XG5cbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEUkMV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnRhZztcbiAgfSk7XG5cbiAgb2JqZWN0UHJvcGVydHlJc0VudW1lcmFibGUuZiA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgb2JqZWN0RGVmaW5lUHJvcGVydHkuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgb2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzLmYgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzRXh0ZXJuYWwuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYgKGRlc2NyaXB0b3JzKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtU3ltYm9sLWRlc2NyaXB0aW9uXG4gICAgbmF0aXZlRGVmaW5lUHJvcGVydHkkMSgkU3ltYm9sW1BST1RPVFlQRSQxXSwgJ2Rlc2NyaXB0aW9uJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiBkZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdldEludGVybmFsU3RhdGUodGhpcykuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfSk7XG4gICAge1xuICAgICAgcmVkZWZpbmUoT2JqZWN0UHJvdG90eXBlLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHsgdW5zYWZlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBwZWRXZWxsS25vd25TeW1ib2wuZiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHdyYXAod2VsbEtub3duU3ltYm9sKG5hbWUpLCBuYW1lKTtcbiAgfTtcbn1cblxuX2V4cG9ydCh7IGdsb2JhbDogdHJ1ZSwgd3JhcDogdHJ1ZSwgZm9yY2VkOiAhbmF0aXZlU3ltYm9sLCBzaGFtOiAhbmF0aXZlU3ltYm9sIH0sIHtcbiAgU3ltYm9sOiAkU3ltYm9sXG59KTtcblxuJGZvckVhY2gob2JqZWN0S2V5cyhXZWxsS25vd25TeW1ib2xzU3RvcmUpLCBmdW5jdGlvbiAobmFtZSkge1xuICBkZWZpbmVXZWxsS25vd25TeW1ib2wobmFtZSk7XG59KTtcblxuX2V4cG9ydCh7IHRhcmdldDogU1lNQk9MLCBzdGF0OiB0cnVlLCBmb3JjZWQ6ICFuYXRpdmVTeW1ib2wgfSwge1xuICAvLyBgU3ltYm9sLmZvcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC5mb3JcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKGtleSk7XG4gICAgaWYgKGhhcyhTdHJpbmdUb1N5bWJvbFJlZ2lzdHJ5LCBzdHJpbmcpKSByZXR1cm4gU3RyaW5nVG9TeW1ib2xSZWdpc3RyeVtzdHJpbmddO1xuICAgIHZhciBzeW1ib2wgPSAkU3ltYm9sKHN0cmluZyk7XG4gICAgU3RyaW5nVG9TeW1ib2xSZWdpc3RyeVtzdHJpbmddID0gc3ltYm9sO1xuICAgIFN5bWJvbFRvU3RyaW5nUmVnaXN0cnlbc3ltYm9sXSA9IHN0cmluZztcbiAgICByZXR1cm4gc3ltYm9sO1xuICB9LFxuICAvLyBgU3ltYm9sLmtleUZvcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC5rZXlmb3JcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioc3ltKSB7XG4gICAgaWYgKCFpc1N5bWJvbChzeW0pKSB0aHJvdyBUeXBlRXJyb3Ioc3ltICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcbiAgICBpZiAoaGFzKFN5bWJvbFRvU3RyaW5nUmVnaXN0cnksIHN5bSkpIHJldHVybiBTeW1ib2xUb1N0cmluZ1JlZ2lzdHJ5W3N5bV07XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24gKCkgeyBVU0VfU0VUVEVSID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbiAoKSB7IFVTRV9TRVRURVIgPSBmYWxzZTsgfVxufSk7XG5cbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6ICFuYXRpdmVTeW1ib2wsIHNoYW06ICFkZXNjcmlwdG9ycyB9LCB7XG4gIC8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmNyZWF0ZVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnNcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXG59KTtcblxuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogIW5hdGl2ZVN5bWJvbCB9LCB7XG4gIC8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eXN5bWJvbHNcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gQ2hyb21lIDM4IGFuZCAzOSBgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc2AgZmFpbHMgb24gcHJpbWl0aXZlc1xuLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzQ0M1xuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogZmFpbHMoZnVuY3Rpb24gKCkgeyBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMuZigxKTsgfSkgfSwge1xuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkge1xuICAgIHJldHVybiBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMuZih0b09iamVjdChpdCkpO1xuICB9XG59KTtcblxuLy8gYEpTT04uc3RyaW5naWZ5YCBtZXRob2QgYmVoYXZpb3Igd2l0aCBzeW1ib2xzXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1qc29uLnN0cmluZ2lmeVxuSlNPTiQxICYmIF9leHBvcnQoeyB0YXJnZXQ6ICdKU09OJywgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhbmF0aXZlU3ltYm9sIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgcmV0dXJuIG5hdGl2ZUpTT05TdHJpbmdpZnkoW3N5bWJvbF0pICE9ICdbbnVsbF0nXG4gICAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gICAgfHwgbmF0aXZlSlNPTlN0cmluZ2lmeSh7IGE6IHN5bWJvbCB9KSAhPSAne30nXG4gICAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgICB8fCBuYXRpdmVKU09OU3RyaW5naWZ5KE9iamVjdChzeW1ib2wpKSAhPSAne30nO1xufSkgfSwge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaW5kZXggPSAxO1xuICAgIHZhciByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaW5kZXgpIGFyZ3MucHVzaChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIG5hdGl2ZUpTT05TdHJpbmdpZnkuYXBwbHkoSlNPTiQxLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIGBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC5wcm90b3R5cGUtQEB0b3ByaW1pdGl2ZVxuaWYgKCEkU3ltYm9sW1BST1RPVFlQRSQxXVtUT19QUklNSVRJVkVdKSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSgkU3ltYm9sW1BST1RPVFlQRSQxXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRSQxXS52YWx1ZU9mKTtcbn1cbi8vIGBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddYCBwcm9wZXJ0eVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3ltYm9sLnByb3RvdHlwZS1AQHRvc3RyaW5ndGFnXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCBTWU1CT0wpO1xuXG5oaWRkZW5LZXlzW0hJRERFTl0gPSB0cnVlO1xuXG52YXIgZGVmaW5lUHJvcGVydHkkMyA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG5cblxudmFyIE5hdGl2ZVN5bWJvbCA9IGdsb2JhbF8xLlN5bWJvbDtcblxuaWYgKGRlc2NyaXB0b3JzICYmIHR5cGVvZiBOYXRpdmVTeW1ib2wgPT0gJ2Z1bmN0aW9uJyAmJiAoISgnZGVzY3JpcHRpb24nIGluIE5hdGl2ZVN5bWJvbC5wcm90b3R5cGUpIHx8XG4gIC8vIFNhZmFyaSAxMiBidWdcbiAgTmF0aXZlU3ltYm9sKCkuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZFxuKSkge1xuICB2YXIgRW1wdHlTdHJpbmdEZXNjcmlwdGlvblN0b3JlID0ge307XG4gIC8vIHdyYXAgU3ltYm9sIGNvbnN0cnVjdG9yIGZvciBjb3JyZWN0IHdvcmsgd2l0aCB1bmRlZmluZWQgZGVzY3JpcHRpb25cbiAgdmFyIFN5bWJvbFdyYXBwZXIgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA8IDEgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBTdHJpbmcoYXJndW1lbnRzWzBdKTtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcyBpbnN0YW5jZW9mIFN5bWJvbFdyYXBwZXJcbiAgICAgID8gbmV3IE5hdGl2ZVN5bWJvbChkZXNjcmlwdGlvbilcbiAgICAgIC8vIGluIEVkZ2UgMTMsIFN0cmluZyhTeW1ib2wodW5kZWZpbmVkKSkgPT09ICdTeW1ib2wodW5kZWZpbmVkKSdcbiAgICAgIDogZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/IE5hdGl2ZVN5bWJvbCgpIDogTmF0aXZlU3ltYm9sKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09ICcnKSBFbXB0eVN0cmluZ0Rlc2NyaXB0aW9uU3RvcmVbcmVzdWx0XSA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyhTeW1ib2xXcmFwcGVyLCBOYXRpdmVTeW1ib2wpO1xuICB2YXIgc3ltYm9sUHJvdG90eXBlID0gU3ltYm9sV3JhcHBlci5wcm90b3R5cGUgPSBOYXRpdmVTeW1ib2wucHJvdG90eXBlO1xuICBzeW1ib2xQcm90b3R5cGUuY29uc3RydWN0b3IgPSBTeW1ib2xXcmFwcGVyO1xuXG4gIHZhciBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyIG5hdGl2ZSA9IFN0cmluZyhOYXRpdmVTeW1ib2woJ3Rlc3QnKSkgPT0gJ1N5bWJvbCh0ZXN0KSc7XG4gIHZhciByZWdleHAgPSAvXlN5bWJvbFxcKCguKilcXClbXildKyQvO1xuICBkZWZpbmVQcm9wZXJ0eSQzKHN5bWJvbFByb3RvdHlwZSwgJ2Rlc2NyaXB0aW9uJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGRlc2NyaXB0aW9uKCkge1xuICAgICAgdmFyIHN5bWJvbCA9IGlzT2JqZWN0KHRoaXMpID8gdGhpcy52YWx1ZU9mKCkgOiB0aGlzO1xuICAgICAgdmFyIHN0cmluZyA9IHN5bWJvbFRvU3RyaW5nLmNhbGwoc3ltYm9sKTtcbiAgICAgIGlmIChoYXMoRW1wdHlTdHJpbmdEZXNjcmlwdGlvblN0b3JlLCBzeW1ib2wpKSByZXR1cm4gJyc7XG4gICAgICB2YXIgZGVzYyA9IG5hdGl2ZSA/IHN0cmluZy5zbGljZSg3LCAtMSkgOiBzdHJpbmcucmVwbGFjZShyZWdleHAsICckMScpO1xuICAgICAgcmV0dXJuIGRlc2MgPT09ICcnID8gdW5kZWZpbmVkIDogZGVzYztcbiAgICB9XG4gIH0pO1xuXG4gIF9leHBvcnQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogdHJ1ZSB9LCB7XG4gICAgU3ltYm9sOiBTeW1ib2xXcmFwcGVyXG4gIH0pO1xufVxuXG4vLyBgU3ltYm9sLml0ZXJhdG9yYCB3ZWxsLWtub3duIHN5bWJvbFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3ltYm9sLml0ZXJhdG9yXG5kZWZpbmVXZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG5cbnZhciBVTlNDT1BBQkxFUyA9IHdlbGxLbm93blN5bWJvbCgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuaWYgKEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHtcbiAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEFycmF5UHJvdG90eXBlLCBVTlNDT1BBQkxFUywgb2JqZWN0Q3JlYXRlKG51bGwpKTtcbn1cblxuLy8gYWRkIGEga2V5IHRvIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIGFkZFRvVW5zY29wYWJsZXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07XG5cbnZhciBpdGVyYXRvcnMgPSB7fTtcblxudmFyIGNvcnJlY3RQcm90b3R5cGVHZXR0ZXIgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBGKCkgeyAvKiBlbXB0eSAqLyB9XG4gIEYucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnVsbDtcbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihuZXcgRigpKSAhPT0gRi5wcm90b3R5cGU7XG59KTtcblxudmFyIElFX1BST1RPJDEgPSBzaGFyZWRLZXkoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG90eXBlJDEgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRwcm90b3R5cGVvZlxudmFyIG9iamVjdEdldFByb3RvdHlwZU9mID0gY29ycmVjdFByb3RvdHlwZUdldHRlciA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTyQxKSkgcmV0dXJuIE9bSUVfUFJPVE8kMV07XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG90eXBlJDEgOiBudWxsO1xufTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSBmYWxzZTtcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJWAgb2JqZWN0XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdFxudmFyIEl0ZXJhdG9yUHJvdG90eXBlLCBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGFycmF5SXRlcmF0b3I7XG5cbmlmIChbXS5rZXlzKSB7XG4gIGFycmF5SXRlcmF0b3IgPSBbXS5rZXlzKCk7XG4gIC8vIFNhZmFyaSA4IGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICBpZiAoISgnbmV4dCcgaW4gYXJyYXlJdGVyYXRvcikpIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSB0cnVlO1xuICBlbHNlIHtcbiAgICBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBvYmplY3RHZXRQcm90b3R5cGVPZihvYmplY3RHZXRQcm90b3R5cGVPZihhcnJheUl0ZXJhdG9yKSk7XG4gICAgaWYgKFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkgSXRlcmF0b3JQcm90b3R5cGUgPSBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cbn1cblxuaWYgKEl0ZXJhdG9yUHJvdG90eXBlID09IHVuZGVmaW5lZCkgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbmlmICggIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xufVxuXG52YXIgaXRlcmF0b3JzQ29yZSA9IHtcbiAgSXRlcmF0b3JQcm90b3R5cGU6IEl0ZXJhdG9yUHJvdG90eXBlLFxuICBCVUdHWV9TQUZBUklfSVRFUkFUT1JTOiBCVUdHWV9TQUZBUklfSVRFUkFUT1JTXG59O1xuXG52YXIgSXRlcmF0b3JQcm90b3R5cGUkMSA9IGl0ZXJhdG9yc0NvcmUuSXRlcmF0b3JQcm90b3R5cGU7XG5cblxuXG5cblxudmFyIHJldHVyblRoaXMkMSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbnZhciBjcmVhdGVJdGVyYXRvckNvbnN0cnVjdG9yID0gZnVuY3Rpb24gKEl0ZXJhdG9yQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgdmFyIFRPX1NUUklOR19UQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIEl0ZXJhdG9yQ29uc3RydWN0b3IucHJvdG90eXBlID0gb2JqZWN0Q3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlJDEsIHsgbmV4dDogY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvckNvbnN0cnVjdG9yLCBUT19TVFJJTkdfVEFHLCBmYWxzZSk7XG4gIGl0ZXJhdG9yc1tUT19TVFJJTkdfVEFHXSA9IHJldHVyblRoaXMkMTtcbiAgcmV0dXJuIEl0ZXJhdG9yQ29uc3RydWN0b3I7XG59O1xuXG52YXIgYVBvc3NpYmxlUHJvdG90eXBlID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpICYmIGl0ICE9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3Qgc2V0IFwiICsgU3RyaW5nKGl0KSArICcgYXMgYSBwcm90b3R5cGUnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG4vLyBgT2JqZWN0LnNldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5zZXRwcm90b3R5cGVvZlxuLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIG9iamVjdFNldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IGZ1bmN0aW9uICgpIHtcbiAgdmFyIENPUlJFQ1RfU0VUVEVSID0gZmFsc2U7XG4gIHZhciB0ZXN0ID0ge307XG4gIHZhciBzZXR0ZXI7XG4gIHRyeSB7XG4gICAgc2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0O1xuICAgIHNldHRlci5jYWxsKHRlc3QsIFtdKTtcbiAgICBDT1JSRUNUX1NFVFRFUiA9IHRlc3QgaW5zdGFuY2VvZiBBcnJheTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pIHtcbiAgICBhbk9iamVjdChPKTtcbiAgICBhUG9zc2libGVQcm90b3R5cGUocHJvdG8pO1xuICAgIGlmIChDT1JSRUNUX1NFVFRFUikgc2V0dGVyLmNhbGwoTywgcHJvdG8pO1xuICAgIGVsc2UgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICByZXR1cm4gTztcbiAgfTtcbn0oKSA6IHVuZGVmaW5lZCk7XG5cbnZhciBJdGVyYXRvclByb3RvdHlwZSQyID0gaXRlcmF0b3JzQ29yZS5JdGVyYXRvclByb3RvdHlwZTtcbnZhciBCVUdHWV9TQUZBUklfSVRFUkFUT1JTJDEgPSBpdGVyYXRvcnNDb3JlLkJVR0dZX1NBRkFSSV9JVEVSQVRPUlM7XG52YXIgSVRFUkFUT1IkMSA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xudmFyIEVOVFJJRVMgPSAnZW50cmllcyc7XG5cbnZhciByZXR1cm5UaGlzJDIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG52YXIgZGVmaW5lSXRlcmF0b3IgPSBmdW5jdGlvbiAoSXRlcmFibGUsIE5BTUUsIEl0ZXJhdG9yQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gIGNyZWF0ZUl0ZXJhdG9yQ29uc3RydWN0b3IoSXRlcmF0b3JDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG5cbiAgdmFyIGdldEl0ZXJhdGlvbk1ldGhvZCA9IGZ1bmN0aW9uIChLSU5EKSB7XG4gICAgaWYgKEtJTkQgPT09IERFRkFVTFQgJiYgZGVmYXVsdEl0ZXJhdG9yKSByZXR1cm4gZGVmYXVsdEl0ZXJhdG9yO1xuICAgIGlmICghQlVHR1lfU0FGQVJJX0lURVJBVE9SUyQxICYmIEtJTkQgaW4gSXRlcmFibGVQcm90b3R5cGUpIHJldHVybiBJdGVyYWJsZVByb3RvdHlwZVtLSU5EXTtcbiAgICBzd2l0Y2ggKEtJTkQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgSXRlcmF0b3JDb25zdHJ1Y3Rvcih0aGlzLCBLSU5EKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgICBjYXNlIEVOVFJJRVM6IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcyk7IH07XG4gIH07XG5cbiAgdmFyIFRPX1NUUklOR19UQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgPSBmYWxzZTtcbiAgdmFyIEl0ZXJhYmxlUHJvdG90eXBlID0gSXRlcmFibGUucHJvdG90eXBlO1xuICB2YXIgbmF0aXZlSXRlcmF0b3IgPSBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUiQxXVxuICAgIHx8IEl0ZXJhYmxlUHJvdG90eXBlWydAQGl0ZXJhdG9yJ11cbiAgICB8fCBERUZBVUxUICYmIEl0ZXJhYmxlUHJvdG90eXBlW0RFRkFVTFRdO1xuICB2YXIgZGVmYXVsdEl0ZXJhdG9yID0gIUJVR0dZX1NBRkFSSV9JVEVSQVRPUlMkMSAmJiBuYXRpdmVJdGVyYXRvciB8fCBnZXRJdGVyYXRpb25NZXRob2QoREVGQVVMVCk7XG4gIHZhciBhbnlOYXRpdmVJdGVyYXRvciA9IE5BTUUgPT0gJ0FycmF5JyA/IEl0ZXJhYmxlUHJvdG90eXBlLmVudHJpZXMgfHwgbmF0aXZlSXRlcmF0b3IgOiBuYXRpdmVJdGVyYXRvcjtcbiAgdmFyIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgbWV0aG9kcywgS0VZO1xuXG4gIC8vIGZpeCBuYXRpdmVcbiAgaWYgKGFueU5hdGl2ZUl0ZXJhdG9yKSB7XG4gICAgQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlID0gb2JqZWN0R2V0UHJvdG90eXBlT2YoYW55TmF0aXZlSXRlcmF0b3IuY2FsbChuZXcgSXRlcmFibGUoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSQyICE9PSBPYmplY3QucHJvdG90eXBlICYmIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICBpZiAoIG9iamVjdEdldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSkgIT09IEl0ZXJhdG9yUHJvdG90eXBlJDIpIHtcbiAgICAgICAgaWYgKG9iamVjdFNldFByb3RvdHlwZU9mKSB7XG4gICAgICAgICAgb2JqZWN0U2V0UHJvdG90eXBlT2YoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBJdGVyYXRvclByb3RvdHlwZSQyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SJDFdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiQxLCByZXR1cm5UaGlzJDIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUsIFRPX1NUUklOR19UQUcsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRkFVTFQgPT0gVkFMVUVTICYmIG5hdGl2ZUl0ZXJhdG9yICYmIG5hdGl2ZUl0ZXJhdG9yLm5hbWUgIT09IFZBTFVFUykge1xuICAgIElOQ09SUkVDVF9WQUxVRVNfTkFNRSA9IHRydWU7XG4gICAgZGVmYXVsdEl0ZXJhdG9yID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmF0aXZlSXRlcmF0b3IuY2FsbCh0aGlzKTsgfTtcbiAgfVxuXG4gIC8vIGRlZmluZSBpdGVyYXRvclxuICBpZiAoIEl0ZXJhYmxlUHJvdG90eXBlW0lURVJBVE9SJDFdICE9PSBkZWZhdWx0SXRlcmF0b3IpIHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmFibGVQcm90b3R5cGUsIElURVJBVE9SJDEsIGRlZmF1bHRJdGVyYXRvcik7XG4gIH1cbiAgaXRlcmF0b3JzW05BTUVdID0gZGVmYXVsdEl0ZXJhdG9yO1xuXG4gIC8vIGV4cG9ydCBhZGRpdGlvbmFsIG1ldGhvZHNcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBnZXRJdGVyYXRpb25NZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/IGRlZmF1bHRJdGVyYXRvciA6IGdldEl0ZXJhdGlvbk1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6IGdldEl0ZXJhdGlvbk1ldGhvZChFTlRSSUVTKVxuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChLRVkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMkMSB8fCBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgfHwgIShLRVkgaW4gSXRlcmFibGVQcm90b3R5cGUpKSB7XG4gICAgICAgIHJlZGVmaW5lKEl0ZXJhYmxlUHJvdG90eXBlLCBLRVksIG1ldGhvZHNbS0VZXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIF9leHBvcnQoeyB0YXJnZXQ6IE5BTUUsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMkMSB8fCBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgfSwgbWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gbWV0aG9kcztcbn07XG5cbnZhciBBUlJBWV9JVEVSQVRPUiA9ICdBcnJheSBJdGVyYXRvcic7XG52YXIgc2V0SW50ZXJuYWxTdGF0ZSQxID0gaW50ZXJuYWxTdGF0ZS5zZXQ7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSQxID0gaW50ZXJuYWxTdGF0ZS5nZXR0ZXJGb3IoQVJSQVlfSVRFUkFUT1IpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmVudHJpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmVudHJpZXNcbi8vIGBBcnJheS5wcm90b3R5cGUua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUua2V5c1xuLy8gYEFycmF5LnByb3RvdHlwZS52YWx1ZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnZhbHVlc1xuLy8gYEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEBpdGVyYXRvclxuLy8gYENyZWF0ZUFycmF5SXRlcmF0b3JgIGludGVybmFsIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtY3JlYXRlYXJyYXlpdGVyYXRvclxudmFyIGVzX2FycmF5X2l0ZXJhdG9yID0gZGVmaW5lSXRlcmF0b3IoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICBzZXRJbnRlcm5hbFN0YXRlJDEodGhpcywge1xuICAgIHR5cGU6IEFSUkFZX0lURVJBVE9SLFxuICAgIHRhcmdldDogdG9JbmRleGVkT2JqZWN0KGl0ZXJhdGVkKSwgLy8gdGFyZ2V0XG4gICAgaW5kZXg6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gICAga2luZDoga2luZCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gIH0pO1xuLy8gYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS5uZXh0XG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUkMSh0aGlzKTtcbiAgdmFyIHRhcmdldCA9IHN0YXRlLnRhcmdldDtcbiAgdmFyIGtpbmQgPSBzdGF0ZS5raW5kO1xuICB2YXIgaW5kZXggPSBzdGF0ZS5pbmRleCsrO1xuICBpZiAoIXRhcmdldCB8fCBpbmRleCA+PSB0YXJnZXQubGVuZ3RoKSB7XG4gICAgc3RhdGUudGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiB7IHZhbHVlOiBpbmRleCwgZG9uZTogZmFsc2UgfTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiB7IHZhbHVlOiB0YXJnZXRbaW5kZXhdLCBkb25lOiBmYWxzZSB9O1xuICByZXR1cm4geyB2YWx1ZTogW2luZGV4LCB0YXJnZXRbaW5kZXhdXSwgZG9uZTogZmFsc2UgfTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1jcmVhdGV1bm1hcHBlZGFyZ3VtZW50c29iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtY3JlYXRlbWFwcGVkYXJndW1lbnRzb2JqZWN0XG5pdGVyYXRvcnMuQXJndW1lbnRzID0gaXRlcmF0b3JzLkFycmF5O1xuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG5cbnZhciBuYXRpdmVBc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBgT2JqZWN0LmFzc2lnbmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1ZylcbnZhciBvYmplY3RBc3NpZ24gPSAhbmF0aXZlQXNzaWduIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBzeW1ib2wgPSBTeW1ib2woKTtcbiAgdmFyIGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtzeW1ib2xdID0gNztcbiAgYWxwaGFiZXQuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGNocikgeyBCW2Nocl0gPSBjaHI7IH0pO1xuICByZXR1cm4gbmF0aXZlQXNzaWduKHt9LCBBKVtzeW1ib2xdICE9IDcgfHwgb2JqZWN0S2V5cyhuYXRpdmVBc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBhbHBoYWJldDtcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IG9iamVjdEdldE93blByb3BlcnR5U3ltYm9scy5mO1xuICB2YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm9wZXJ0eUlzRW51bWVyYWJsZS5mO1xuICB3aGlsZSAoYXJndW1lbnRzTGVuZ3RoID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IGluZGV4ZWRPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5U3ltYm9scyA/IG9iamVjdEtleXMoUykuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhTKSkgOiBvYmplY3RLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFkZXNjcmlwdG9ycyB8fCBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogbmF0aXZlQXNzaWduO1xuXG4vLyBgT2JqZWN0LmFzc2lnbmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBPYmplY3QuYXNzaWduICE9PSBvYmplY3RBc3NpZ24gfSwge1xuICBhc3NpZ246IG9iamVjdEFzc2lnblxufSk7XG5cbnZhciBUT19TVFJJTkdfVEFHJDEgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIENPUlJFQ1RfQVJHVU1FTlRTID0gY2xhc3NvZlJhdyhmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxufTtcblxuLy8gZ2V0dGluZyB0YWcgZnJvbSBFUzYrIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYFxudmFyIGNsYXNzb2YgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIHRhZywgcmVzdWx0O1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAodGFnID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUT19TVFJJTkdfVEFHJDEpKSA9PSAnc3RyaW5nJyA/IHRhZ1xuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQ09SUkVDVF9BUkdVTUVOVFMgPyBjbGFzc29mUmF3KE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKHJlc3VsdCA9IGNsYXNzb2ZSYXcoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuXG52YXIgVE9fU1RSSU5HX1RBRyQyID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIHRlc3QgPSB7fTtcblxudGVzdFtUT19TVFJJTkdfVEFHJDJdID0gJ3onO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBTdHJpbmcodGVzdCkgIT09ICdbb2JqZWN0IHpdJyA/IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ1tvYmplY3QgJyArIGNsYXNzb2YodGhpcykgKyAnXSc7XG59IDogdGVzdC50b1N0cmluZztcblxudmFyIE9iamVjdFByb3RvdHlwZSQyID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZ1xuaWYgKG9iamVjdFRvU3RyaW5nICE9PSBPYmplY3RQcm90b3R5cGUkMi50b1N0cmluZykge1xuICByZWRlZmluZShPYmplY3RQcm90b3R5cGUkMiwgJ3RvU3RyaW5nJywgb2JqZWN0VG9TdHJpbmcsIHsgdW5zYWZlOiB0cnVlIH0pO1xufVxuXG52YXIgZnJlZXppbmcgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xuXG52YXIgaW50ZXJuYWxNZXRhZGF0YSA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUpIHtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG5cblxuXG52YXIgTUVUQURBVEEgPSB1aWQoJ21ldGEnKTtcbnZhciBpZCA9IDA7XG5cbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG52YXIgc2V0TWV0YWRhdGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgZGVmaW5lUHJvcGVydHkoaXQsIE1FVEFEQVRBLCB7IHZhbHVlOiB7XG4gICAgb2JqZWN0SUQ6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHdlYWtEYXRhOiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcblxudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gYSBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBREFUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YWRhdGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFEQVRBXS5vYmplY3RJRDtcbn07XG5cbnZhciBnZXRXZWFrRGF0YSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBREFUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YWRhdGEoaXQpO1xuICAvLyByZXR1cm4gdGhlIHN0b3JlIG9mIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFEQVRBXS53ZWFrRGF0YTtcbn07XG5cbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChmcmVlemluZyAmJiBtZXRhLlJFUVVJUkVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQURBVEEpKSBzZXRNZXRhZGF0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG5cbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJFUVVJUkVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2Vha0RhdGE6IGdldFdlYWtEYXRhLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG5cbmhpZGRlbktleXNbTUVUQURBVEFdID0gdHJ1ZTtcbn0pO1xuXG52YXIgSVRFUkFUT1IkMiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvdHlwZSQxID0gQXJyYXkucHJvdG90eXBlO1xuXG4vLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgaXNBcnJheUl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChpdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG90eXBlJDFbSVRFUkFUT1IkMl0gPT09IGl0KTtcbn07XG5cbnZhciBJVEVSQVRPUiQzID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xuXG52YXIgZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SJDNdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IGl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuXG4vLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBFTlRSSUVTKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEVOVFJJRVMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB2YXIgcmV0dXJuTWV0aG9kID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXR1cm5NZXRob2QgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0dXJuTWV0aG9kLmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxudmFyIGl0ZXJhdGVfMSA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUpIHtcbnZhciBSZXN1bHQgPSBmdW5jdGlvbiAoc3RvcHBlZCwgcmVzdWx0KSB7XG4gIHRoaXMuc3RvcHBlZCA9IHN0b3BwZWQ7XG4gIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xufTtcblxudmFyIGl0ZXJhdGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZm4sIHRoYXQsIEFTX0VOVFJJRVMsIElTX0lURVJBVE9SKSB7XG4gIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZENvbnRleHQoZm4sIHRoYXQsIEFTX0VOVFJJRVMgPyAyIDogMSk7XG4gIHZhciBpdGVyYXRvciwgaXRlckZuLCBpbmRleCwgbGVuZ3RoLCByZXN1bHQsIG5leHQsIHN0ZXA7XG5cbiAgaWYgKElTX0lURVJBVE9SKSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYWJsZTtcbiAgfSBlbHNlIHtcbiAgICBpdGVyRm4gPSBnZXRJdGVyYXRvck1ldGhvZChpdGVyYWJsZSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKCdUYXJnZXQgaXMgbm90IGl0ZXJhYmxlJyk7XG4gICAgLy8gb3B0aW1pc2F0aW9uIGZvciBhcnJheSBpdGVyYXRvcnNcbiAgICBpZiAoaXNBcnJheUl0ZXJhdG9yTWV0aG9kKGl0ZXJGbikpIHtcbiAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICByZXN1bHQgPSBBU19FTlRSSUVTXG4gICAgICAgICAgPyBib3VuZEZ1bmN0aW9uKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKVxuICAgICAgICAgIDogYm91bmRGdW5jdGlvbihpdGVyYWJsZVtpbmRleF0pO1xuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0gcmV0dXJuIG5ldyBSZXN1bHQoZmFsc2UpO1xuICAgIH1cbiAgICBpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTtcbiAgfVxuXG4gIG5leHQgPSBpdGVyYXRvci5uZXh0O1xuICB3aGlsZSAoIShzdGVwID0gbmV4dC5jYWxsKGl0ZXJhdG9yKSkuZG9uZSkge1xuICAgIHJlc3VsdCA9IGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIGJvdW5kRnVuY3Rpb24sIHN0ZXAudmFsdWUsIEFTX0VOVFJJRVMpO1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdvYmplY3QnICYmIHJlc3VsdCAmJiByZXN1bHQgaW5zdGFuY2VvZiBSZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gIH0gcmV0dXJuIG5ldyBSZXN1bHQoZmFsc2UpO1xufTtcblxuaXRlcmF0ZS5zdG9wID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICByZXR1cm4gbmV3IFJlc3VsdCh0cnVlLCByZXN1bHQpO1xufTtcbn0pO1xuXG52YXIgYW5JbnN0YW5jZSA9IGZ1bmN0aW9uIChpdCwgQ29uc3RydWN0b3IsIG5hbWUpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29ycmVjdCAnICsgKG5hbWUgPyBuYW1lICsgJyAnIDogJycpICsgJ2ludm9jYXRpb24nKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG52YXIgSVRFUkFUT1IkNCA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIGNhbGxlZCA9IDA7XG4gIHZhciBpdGVyYXRvcldpdGhSZXR1cm4gPSB7XG4gICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogISFjYWxsZWQrKyB9O1xuICAgIH0sXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uICgpIHtcbiAgICAgIFNBRkVfQ0xPU0lORyA9IHRydWU7XG4gICAgfVxuICB9O1xuICBpdGVyYXRvcldpdGhSZXR1cm5bSVRFUkFUT1IkNF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20oaXRlcmF0b3JXaXRoUmV0dXJuLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuXG52YXIgY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uID0gZnVuY3Rpb24gKGV4ZWMsIFNLSVBfQ0xPU0lORykge1xuICBpZiAoIVNLSVBfQ0xPU0lORyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBJVEVSQVRJT05fU1VQUE9SVCA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBvYmplY3QgPSB7fTtcbiAgICBvYmplY3RbSVRFUkFUT1IkNF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogSVRFUkFUSU9OX1NVUFBPUlQgPSB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBleGVjKG9iamVjdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIElURVJBVElPTl9TVVBQT1JUO1xufTtcblxuLy8gbWFrZXMgc3ViY2xhc3Npbmcgd29yayBjb3JyZWN0IGZvciB3cmFwcGVkIGJ1aWx0LWluc1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gZnVuY3Rpb24gKCR0aGlzLCBkdW1teSwgV3JhcHBlcikge1xuICB2YXIgTmV3VGFyZ2V0LCBOZXdUYXJnZXRQcm90b3R5cGU7XG4gIGlmIChcbiAgICAvLyBpdCBjYW4gd29yayBvbmx5IHdpdGggbmF0aXZlIGBzZXRQcm90b3R5cGVPZmBcbiAgICBvYmplY3RTZXRQcm90b3R5cGVPZiAmJlxuICAgIC8vIHdlIGhhdmVuJ3QgY29tcGxldGVseSBjb3JyZWN0IHByZS1FUzYgd2F5IGZvciBnZXR0aW5nIGBuZXcudGFyZ2V0YCwgc28gdXNlIHRoaXNcbiAgICB0eXBlb2YgKE5ld1RhcmdldCA9IGR1bW15LmNvbnN0cnVjdG9yKSA9PSAnZnVuY3Rpb24nICYmXG4gICAgTmV3VGFyZ2V0ICE9PSBXcmFwcGVyICYmXG4gICAgaXNPYmplY3QoTmV3VGFyZ2V0UHJvdG90eXBlID0gTmV3VGFyZ2V0LnByb3RvdHlwZSkgJiZcbiAgICBOZXdUYXJnZXRQcm90b3R5cGUgIT09IFdyYXBwZXIucHJvdG90eXBlXG4gICkgb2JqZWN0U2V0UHJvdG90eXBlT2YoJHRoaXMsIE5ld1RhcmdldFByb3RvdHlwZSk7XG4gIHJldHVybiAkdGhpcztcbn07XG5cbnZhciBjb2xsZWN0aW9uID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SX05BTUUsIHdyYXBwZXIsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBOYXRpdmVDb25zdHJ1Y3RvciA9IGdsb2JhbF8xW0NPTlNUUlVDVE9SX05BTUVdO1xuICB2YXIgTmF0aXZlUHJvdG90eXBlID0gTmF0aXZlQ29uc3RydWN0b3IgJiYgTmF0aXZlQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICB2YXIgQ29uc3RydWN0b3IgPSBOYXRpdmVDb25zdHJ1Y3RvcjtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIGV4cG9ydGVkID0ge307XG5cbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgbmF0aXZlTWV0aG9kID0gTmF0aXZlUHJvdG90eXBlW0tFWV07XG4gICAgcmVkZWZpbmUoTmF0aXZlUHJvdG90eXBlLCBLRVksXG4gICAgICBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICAgICAgbmF0aXZlTWV0aG9kLmNhbGwodGhpcywgdmFsdWUgPT09IDAgPyAwIDogdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gOiBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChrZXkpID8gZmFsc2UgOiBuYXRpdmVNZXRob2QuY2FsbCh0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5KTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChrZXkpID8gdW5kZWZpbmVkIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IGZhbHNlIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIGlmIChpc0ZvcmNlZF8xKENPTlNUUlVDVE9SX05BTUUsIHR5cGVvZiBOYXRpdmVDb25zdHJ1Y3RvciAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBOYXRpdmVQcm90b3R5cGUuZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSkpIHtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIENvbnN0cnVjdG9yID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIENPTlNUUlVDVE9SX05BTUUsIElTX01BUCwgQURERVIpO1xuICAgIGludGVybmFsTWV0YWRhdGEuUkVRVUlSRUQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGlzRm9yY2VkXzEoQ09OU1RSVUNUT1JfTkFNRSwgdHJ1ZSkpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgdmFyIEhBU05UX0NIQUlOSU5HID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZTtcbiAgICAvLyBWOCB+IENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgIHZhciBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgaW5zdGFuY2UuaGFzKDEpOyB9KTtcbiAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ld1xuICAgIHZhciBBQ0NFUFRfSVRFUkFCTEVTID0gY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uKGZ1bmN0aW9uIChpdGVyYWJsZSkgeyBuZXcgTmF0aXZlQ29uc3RydWN0b3IoaXRlcmFibGUpOyB9KTtcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpO1xuICAgICAgdmFyIGluZGV4ID0gNTtcbiAgICAgIHdoaWxlIChpbmRleC0tKSAkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgIH0pO1xuXG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDb25zdHJ1Y3RvciA9IHdyYXBwZXIoZnVuY3Rpb24gKGR1bW15LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKGR1bW15LCBDb25zdHJ1Y3RvciwgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IE5hdGl2ZUNvbnN0cnVjdG9yKCksIGR1bW15LCBDb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGl0ZXJhdGVfMShpdGVyYWJsZSwgdGhhdFtBRERFUl0sIHRoYXQsIElTX01BUCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfSk7XG4gICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBOYXRpdmVQcm90b3R5cGU7XG4gICAgICBOYXRpdmVQcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICB9XG5cbiAgICBpZiAoVEhST1dTX09OX1BSSU1JVElWRVMgfHwgQlVHR1lfWkVSTykge1xuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcbiAgICB9XG5cbiAgICBpZiAoQlVHR1lfWkVSTyB8fCBIQVNOVF9DSEFJTklORykgZml4TWV0aG9kKEFEREVSKTtcblxuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgTmF0aXZlUHJvdG90eXBlLmNsZWFyKSBkZWxldGUgTmF0aXZlUHJvdG90eXBlLmNsZWFyO1xuICB9XG5cbiAgZXhwb3J0ZWRbQ09OU1RSVUNUT1JfTkFNRV0gPSBDb25zdHJ1Y3RvcjtcbiAgX2V4cG9ydCh7IGdsb2JhbDogdHJ1ZSwgZm9yY2VkOiBDb25zdHJ1Y3RvciAhPSBOYXRpdmVDb25zdHJ1Y3RvciB9LCBleHBvcnRlZCk7XG5cbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIENPTlNUUlVDVE9SX05BTUUpO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDb25zdHJ1Y3RvciwgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQ29uc3RydWN0b3I7XG59O1xuXG52YXIgcmVkZWZpbmVBbGwgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbnZhciBTUEVDSUVTJDMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxudmFyIHNldFNwZWNpZXMgPSBmdW5jdGlvbiAoQ09OU1RSVUNUT1JfTkFNRSkge1xuICB2YXIgQ29uc3RydWN0b3IgPSBnZXRCdWlsdEluKENPTlNUUlVDVE9SX05BTUUpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuXG4gIGlmIChkZXNjcmlwdG9ycyAmJiBDb25zdHJ1Y3RvciAmJiAhQ29uc3RydWN0b3JbU1BFQ0lFUyQzXSkge1xuICAgIGRlZmluZVByb3BlcnR5KENvbnN0cnVjdG9yLCBTUEVDSUVTJDMsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICAgIH0pO1xuICB9XG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkkNCA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG5cblxuXG5cblxuXG5cblxudmFyIGZhc3RLZXkgPSBpbnRlcm5hbE1ldGFkYXRhLmZhc3RLZXk7XG5cblxudmFyIHNldEludGVybmFsU3RhdGUkMiA9IGludGVybmFsU3RhdGUuc2V0O1xudmFyIGludGVybmFsU3RhdGVHZXR0ZXJGb3IgPSBpbnRlcm5hbFN0YXRlLmdldHRlckZvcjtcblxudmFyIGNvbGxlY3Rpb25TdHJvbmcgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICBzZXRJbnRlcm5hbFN0YXRlJDIodGhhdCwge1xuICAgICAgICB0eXBlOiBDT05TVFJVQ1RPUl9OQU1FLFxuICAgICAgICBpbmRleDogb2JqZWN0Q3JlYXRlKG51bGwpLFxuICAgICAgICBmaXJzdDogdW5kZWZpbmVkLFxuICAgICAgICBsYXN0OiB1bmRlZmluZWQsXG4gICAgICAgIHNpemU6IDBcbiAgICAgIH0pO1xuICAgICAgaWYgKCFkZXNjcmlwdG9ycykgdGhhdC5zaXplID0gMDtcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGl0ZXJhdGVfMShpdGVyYWJsZSwgdGhhdFtBRERFUl0sIHRoYXQsIElTX01BUCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IGludGVybmFsU3RhdGVHZXR0ZXJGb3IoQ09OU1RSVUNUT1JfTkFNRSk7XG5cbiAgICB2YXIgZGVmaW5lID0gZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhhdCk7XG4gICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgdmFyIHByZXZpb3VzLCBpbmRleDtcbiAgICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWU7XG4gICAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5sYXN0ID0gZW50cnkgPSB7XG4gICAgICAgICAgaW5kZXg6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLFxuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBwcmV2aW91czogcHJldmlvdXMgPSBzdGF0ZS5sYXN0LFxuICAgICAgICAgIG5leHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICByZW1vdmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoIXN0YXRlLmZpcnN0KSBzdGF0ZS5maXJzdCA9IGVudHJ5O1xuICAgICAgICBpZiAocHJldmlvdXMpIHByZXZpb3VzLm5leHQgPSBlbnRyeTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3JzKSBzdGF0ZS5zaXplKys7XG4gICAgICAgIGVsc2UgdGhhdC5zaXplKys7XG4gICAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgICBpZiAoaW5kZXggIT09ICdGJykgc3RhdGUuaW5kZXhbaW5kZXhdID0gZW50cnk7XG4gICAgICB9IHJldHVybiB0aGF0O1xuICAgIH07XG5cbiAgICB2YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgLy8gZmFzdCBjYXNlXG4gICAgICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gICAgICB2YXIgZW50cnk7XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHN0YXRlLmluZGV4W2luZGV4XTtcbiAgICAgIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICAgICAgZm9yIChlbnRyeSA9IHN0YXRlLmZpcnN0OyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uZXh0KSB7XG4gICAgICAgIGlmIChlbnRyeS5rZXkgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhhdCk7XG4gICAgICAgIHZhciBkYXRhID0gc3RhdGUuaW5kZXg7XG4gICAgICAgIHZhciBlbnRyeSA9IHN0YXRlLmZpcnN0O1xuICAgICAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgICAgICBlbnRyeS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucHJldmlvdXMpIGVudHJ5LnByZXZpb3VzID0gZW50cnkucHJldmlvdXMubmV4dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pbmRleF07XG4gICAgICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmZpcnN0ID0gc3RhdGUubGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3JzKSBzdGF0ZS5zaXplID0gMDtcbiAgICAgICAgZWxzZSB0aGF0LnNpemUgPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5leHQ7XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wcmV2aW91cztcbiAgICAgICAgICBkZWxldGUgc3RhdGUuaW5kZXhbZW50cnkuaW5kZXhdO1xuICAgICAgICAgIGVudHJ5LnJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm5leHQgPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnByZXZpb3VzID0gcHJldjtcbiAgICAgICAgICBpZiAoc3RhdGUuZmlyc3QgPT0gZW50cnkpIHN0YXRlLmZpcnN0ID0gbmV4dDtcbiAgICAgICAgICBpZiAoc3RhdGUubGFzdCA9PSBlbnRyeSkgc3RhdGUubGFzdCA9IHByZXY7XG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3JzKSBzdGF0ZS5zaXplLS07XG4gICAgICAgICAgZWxzZSB0aGF0LnNpemUtLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmRDb250ZXh0KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm5leHQgOiBzdGF0ZS5maXJzdCkge1xuICAgICAgICAgIGJvdW5kRnVuY3Rpb24oZW50cnkudmFsdWUsIGVudHJ5LmtleSwgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnJlbW92ZWQpIGVudHJ5ID0gZW50cnkucHJldmlvdXM7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIElTX01BUCA/IHtcbiAgICAgIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudmFsdWU7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZSh0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSA6IHtcbiAgICAgIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICAgICAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZSh0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGRlc2NyaXB0b3JzKSBkZWZpbmVQcm9wZXJ0eSQ0KEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKS5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBDT05TVFJVQ1RPUl9OQU1FLCBJU19NQVApIHtcbiAgICB2YXIgSVRFUkFUT1JfTkFNRSA9IENPTlNUUlVDVE9SX05BTUUgKyAnIEl0ZXJhdG9yJztcbiAgICB2YXIgZ2V0SW50ZXJuYWxDb2xsZWN0aW9uU3RhdGUgPSBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yKENPTlNUUlVDVE9SX05BTUUpO1xuICAgIHZhciBnZXRJbnRlcm5hbEl0ZXJhdG9yU3RhdGUgPSBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yKElURVJBVE9SX05BTUUpO1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICBkZWZpbmVJdGVyYXRvcihDLCBDT05TVFJVQ1RPUl9OQU1FLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgICAgIHNldEludGVybmFsU3RhdGUkMih0aGlzLCB7XG4gICAgICAgIHR5cGU6IElURVJBVE9SX05BTUUsXG4gICAgICAgIHRhcmdldDogaXRlcmF0ZWQsXG4gICAgICAgIHN0YXRlOiBnZXRJbnRlcm5hbENvbGxlY3Rpb25TdGF0ZShpdGVyYXRlZCksXG4gICAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICAgIGxhc3Q6IHVuZGVmaW5lZFxuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxJdGVyYXRvclN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGtpbmQgPSBzdGF0ZS5raW5kO1xuICAgICAgdmFyIGVudHJ5ID0gc3RhdGUubGFzdDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnJlbW92ZWQpIGVudHJ5ID0gZW50cnkucHJldmlvdXM7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCFzdGF0ZS50YXJnZXQgfHwgIShzdGF0ZS5sYXN0ID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm5leHQgOiBzdGF0ZS5zdGF0ZS5maXJzdCkpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgc3RhdGUudGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiB7IHZhbHVlOiBlbnRyeS5rZXksIGRvbmU6IGZhbHNlIH07XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHsgdmFsdWU6IGVudHJ5LnZhbHVlLCBkb25lOiBmYWxzZSB9O1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IFtlbnRyeS5rZXksIGVudHJ5LnZhbHVlXSwgZG9uZTogZmFsc2UgfTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoQ09OU1RSVUNUT1JfTkFNRSk7XG4gIH1cbn07XG5cbi8vIGBTZXRgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zZXQtb2JqZWN0c1xudmFyIGVzX3NldCA9IGNvbGxlY3Rpb24oJ1NldCcsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIGNvbGxlY3Rpb25TdHJvbmcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IGNvZGVQb2ludEF0LCBhdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kJDIgPSBmdW5jdGlvbiAoQ09OVkVSVF9UT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgcG9zKSB7XG4gICAgdmFyIFMgPSBTdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSgkdGhpcykpO1xuICAgIHZhciBwb3NpdGlvbiA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBzaXplID0gUy5sZW5ndGg7XG4gICAgdmFyIGZpcnN0LCBzZWNvbmQ7XG4gICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBzaXplKSByZXR1cm4gQ09OVkVSVF9UT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBmaXJzdCA9IFMuY2hhckNvZGVBdChwb3NpdGlvbik7XG4gICAgcmV0dXJuIGZpcnN0IDwgMHhEODAwIHx8IGZpcnN0ID4gMHhEQkZGIHx8IHBvc2l0aW9uICsgMSA9PT0gc2l6ZVxuICAgICAgfHwgKHNlY29uZCA9IFMuY2hhckNvZGVBdChwb3NpdGlvbiArIDEpKSA8IDB4REMwMCB8fCBzZWNvbmQgPiAweERGRkZcbiAgICAgICAgPyBDT05WRVJUX1RPX1NUUklORyA/IFMuY2hhckF0KHBvc2l0aW9uKSA6IGZpcnN0XG4gICAgICAgIDogQ09OVkVSVF9UT19TVFJJTkcgPyBTLnNsaWNlKHBvc2l0aW9uLCBwb3NpdGlvbiArIDIpIDogKGZpcnN0IC0gMHhEODAwIDw8IDEwKSArIChzZWNvbmQgLSAweERDMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG5cbnZhciBzdHJpbmdNdWx0aWJ5dGUgPSB7XG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5jb2RlcG9pbnRhdFxuICBjb2RlQXQ6IGNyZWF0ZU1ldGhvZCQyKGZhbHNlKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuYXRgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4gIGNoYXJBdDogY3JlYXRlTWV0aG9kJDIodHJ1ZSlcbn07XG5cbnZhciBjaGFyQXQgPSBzdHJpbmdNdWx0aWJ5dGUuY2hhckF0O1xuXG5cblxudmFyIFNUUklOR19JVEVSQVRPUiA9ICdTdHJpbmcgSXRlcmF0b3InO1xudmFyIHNldEludGVybmFsU3RhdGUkMyA9IGludGVybmFsU3RhdGUuc2V0O1xudmFyIGdldEludGVybmFsU3RhdGUkMiA9IGludGVybmFsU3RhdGUuZ2V0dGVyRm9yKFNUUklOR19JVEVSQVRPUik7XG5cbi8vIGBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUtQEBpdGVyYXRvclxuZGVmaW5lSXRlcmF0b3IoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHNldEludGVybmFsU3RhdGUkMyh0aGlzLCB7XG4gICAgdHlwZTogU1RSSU5HX0lURVJBVE9SLFxuICAgIHN0cmluZzogU3RyaW5nKGl0ZXJhdGVkKSxcbiAgICBpbmRleDogMFxuICB9KTtcbi8vIGAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtJXN0cmluZ2l0ZXJhdG9ycHJvdG90eXBlJS5uZXh0XG59LCBmdW5jdGlvbiBuZXh0KCkge1xuICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlJDIodGhpcyk7XG4gIHZhciBzdHJpbmcgPSBzdGF0ZS5zdHJpbmc7XG4gIHZhciBpbmRleCA9IHN0YXRlLmluZGV4O1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBzdHJpbmcubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gY2hhckF0KHN0cmluZywgaW5kZXgpO1xuICBzdGF0ZS5pbmRleCArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuXG4vLyBpdGVyYWJsZSBET00gY29sbGVjdGlvbnNcbi8vIGZsYWcgLSBgaXRlcmFibGVgIGludGVyZmFjZSAtICdlbnRyaWVzJywgJ2tleXMnLCAndmFsdWVzJywgJ2ZvckVhY2gnIG1ldGhvZHNcbnZhciBkb21JdGVyYWJsZXMgPSB7XG4gIENTU1J1bGVMaXN0OiAwLFxuICBDU1NTdHlsZURlY2xhcmF0aW9uOiAwLFxuICBDU1NWYWx1ZUxpc3Q6IDAsXG4gIENsaWVudFJlY3RMaXN0OiAwLFxuICBET01SZWN0TGlzdDogMCxcbiAgRE9NU3RyaW5nTGlzdDogMCxcbiAgRE9NVG9rZW5MaXN0OiAxLFxuICBEYXRhVHJhbnNmZXJJdGVtTGlzdDogMCxcbiAgRmlsZUxpc3Q6IDAsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiAwLFxuICBIVE1MQ29sbGVjdGlvbjogMCxcbiAgSFRNTEZvcm1FbGVtZW50OiAwLFxuICBIVE1MU2VsZWN0RWxlbWVudDogMCxcbiAgTWVkaWFMaXN0OiAwLFxuICBNaW1lVHlwZUFycmF5OiAwLFxuICBOYW1lZE5vZGVNYXA6IDAsXG4gIE5vZGVMaXN0OiAxLFxuICBQYWludFJlcXVlc3RMaXN0OiAwLFxuICBQbHVnaW46IDAsXG4gIFBsdWdpbkFycmF5OiAwLFxuICBTVkdMZW5ndGhMaXN0OiAwLFxuICBTVkdOdW1iZXJMaXN0OiAwLFxuICBTVkdQYXRoU2VnTGlzdDogMCxcbiAgU1ZHUG9pbnRMaXN0OiAwLFxuICBTVkdTdHJpbmdMaXN0OiAwLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiAwLFxuICBTb3VyY2VCdWZmZXJMaXN0OiAwLFxuICBTdHlsZVNoZWV0TGlzdDogMCxcbiAgVGV4dFRyYWNrQ3VlTGlzdDogMCxcbiAgVGV4dFRyYWNrTGlzdDogMCxcbiAgVG91Y2hMaXN0OiAwXG59O1xuXG52YXIgSVRFUkFUT1IkNSA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHJDMgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgQXJyYXlWYWx1ZXMgPSBlc19hcnJheV9pdGVyYXRvci52YWx1ZXM7XG5cbmZvciAodmFyIENPTExFQ1RJT05fTkFNRSBpbiBkb21JdGVyYWJsZXMpIHtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxfMVtDT0xMRUNUSU9OX05BTUVdO1xuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlKSB7XG4gICAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gICAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1IkNV0gIT09IEFycmF5VmFsdWVzKSB0cnkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KENvbGxlY3Rpb25Qcm90b3R5cGUsIElURVJBVE9SJDUsIEFycmF5VmFsdWVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgQ29sbGVjdGlvblByb3RvdHlwZVtJVEVSQVRPUiQ1XSA9IEFycmF5VmFsdWVzO1xuICAgIH1cbiAgICBpZiAoIUNvbGxlY3Rpb25Qcm90b3R5cGVbVE9fU1RSSU5HX1RBRyQzXSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KENvbGxlY3Rpb25Qcm90b3R5cGUsIFRPX1NUUklOR19UQUckMywgQ09MTEVDVElPTl9OQU1FKTtcbiAgICB9XG4gICAgaWYgKGRvbUl0ZXJhYmxlc1tDT0xMRUNUSU9OX05BTUVdKSBmb3IgKHZhciBNRVRIT0RfTkFNRSBpbiBlc19hcnJheV9pdGVyYXRvcikge1xuICAgICAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gICAgICBpZiAoQ29sbGVjdGlvblByb3RvdHlwZVtNRVRIT0RfTkFNRV0gIT09IGVzX2FycmF5X2l0ZXJhdG9yW01FVEhPRF9OQU1FXSkgdHJ5IHtcbiAgICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KENvbGxlY3Rpb25Qcm90b3R5cGUsIE1FVEhPRF9OQU1FLCBlc19hcnJheV9pdGVyYXRvcltNRVRIT0RfTkFNRV0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgQ29sbGVjdGlvblByb3RvdHlwZVtNRVRIT0RfTkFNRV0gPSBlc19hcnJheV9pdGVyYXRvcltNRVRIT0RfTkFNRV07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIyW2ldID0gYXJyW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnIyO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbn1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpO1xufVxuXG52YXIgbWV0aG9kcyA9IHt9O1xudmFyIG5hbWVzID0gW107XG5mdW5jdGlvbiByZWdpc3Rlck1ldGhvZHMobmFtZSwgbSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gbmFtZVtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgdmFyIF9uYW1lID0gX3N0ZXAudmFsdWU7XG4gICAgICAgIHJlZ2lzdGVyTWV0aG9kcyhfbmFtZSwgbSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4gIT0gbnVsbCkge1xuICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoX3R5cGVvZihuYW1lKSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBfbmFtZTIgaW4gbmFtZSkge1xuICAgICAgcmVnaXN0ZXJNZXRob2RzKF9uYW1lMiwgbmFtZVtfbmFtZTJdKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBhZGRNZXRob2ROYW1lcyhPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtKSk7XG4gIG1ldGhvZHNbbmFtZV0gPSBPYmplY3QuYXNzaWduKG1ldGhvZHNbbmFtZV0gfHwge30sIG0pO1xufVxuZnVuY3Rpb24gZ2V0TWV0aG9kc0ZvcihuYW1lKSB7XG4gIHJldHVybiBtZXRob2RzW25hbWVdIHx8IHt9O1xufVxuZnVuY3Rpb24gZ2V0TWV0aG9kTmFtZXMoKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkobmV3IFNldChuYW1lcykpO1xufVxuZnVuY3Rpb24gYWRkTWV0aG9kTmFtZXMoX25hbWVzKSB7XG4gIG5hbWVzLnB1c2guYXBwbHkobmFtZXMsIF90b0NvbnN1bWFibGVBcnJheShfbmFtZXMpKTtcbn1cblxudmFyICRpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXMuaW5jbHVkZXM7XG5cblxuLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS1AQHVuc2NvcGFibGVzXG5hZGRUb1Vuc2NvcGFibGVzKCdpbmNsdWRlcycpO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS5mbGFnc2AgZ2V0dGVyIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZXQtcmVnZXhwLnByb3RvdHlwZS5mbGFnc1xudmFyIHJlZ2V4cEZsYWdzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IGFuT2JqZWN0KHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICh0aGF0Lmdsb2JhbCkgcmVzdWx0ICs9ICdnJztcbiAgaWYgKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYgKHRoYXQubXVsdGlsaW5lKSByZXN1bHQgKz0gJ20nO1xuICBpZiAodGhhdC5kb3RBbGwpIHJlc3VsdCArPSAncyc7XG4gIGlmICh0aGF0LnVuaWNvZGUpIHJlc3VsdCArPSAndSc7XG4gIGlmICh0aGF0LnN0aWNreSkgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuLy8gVGhpcyBhbHdheXMgcmVmZXJzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIGJlY2F1c2UgdGhlXG4vLyBTdHJpbmcjcmVwbGFjZSBwb2x5ZmlsbCB1c2VzIC4vZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyxcbi8vIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBiZWZvcmUgcGF0Y2hpbmcgdGhlIG1ldGhvZC5cbnZhciBuYXRpdmVSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG52YXIgcGF0Y2hlZEV4ZWMgPSBuYXRpdmVFeGVjO1xuXG52YXIgVVBEQVRFU19MQVNUX0lOREVYX1dST05HID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlMSA9IC9hLztcbiAgdmFyIHJlMiA9IC9iKi9nO1xuICBuYXRpdmVFeGVjLmNhbGwocmUxLCAnYScpO1xuICBuYXRpdmVFeGVjLmNhbGwocmUyLCAnYScpO1xuICByZXR1cm4gcmUxLmxhc3RJbmRleCAhPT0gMCB8fCByZTIubGFzdEluZGV4ICE9PSAwO1xufSkoKTtcblxuLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXAsIGNvcGllZCBmcm9tIGVzNS1zaGltJ3MgU3RyaW5nI3NwbGl0IHBhdGNoLlxudmFyIE5QQ0dfSU5DTFVERUQgPSAvKCk/Py8uZXhlYygnJylbMV0gIT09IHVuZGVmaW5lZDtcblxudmFyIFBBVENIID0gVVBEQVRFU19MQVNUX0lOREVYX1dST05HIHx8IE5QQ0dfSU5DTFVERUQ7XG5cbmlmIChQQVRDSCkge1xuICBwYXRjaGVkRXhlYyA9IGZ1bmN0aW9uIGV4ZWMoc3RyKSB7XG4gICAgdmFyIHJlID0gdGhpcztcbiAgICB2YXIgbGFzdEluZGV4LCByZUNvcHksIG1hdGNoLCBpO1xuXG4gICAgaWYgKE5QQ0dfSU5DTFVERUQpIHtcbiAgICAgIHJlQ29weSA9IG5ldyBSZWdFeHAoJ14nICsgcmUuc291cmNlICsgJyQoPyFcXFxccyknLCByZWdleHBGbGFncy5jYWxsKHJlKSk7XG4gICAgfVxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcpIGxhc3RJbmRleCA9IHJlLmxhc3RJbmRleDtcblxuICAgIG1hdGNoID0gbmF0aXZlRXhlYy5jYWxsKHJlLCBzdHIpO1xuXG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmUubGFzdEluZGV4ID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG52YXIgcmVnZXhwRXhlYyA9IHBhdGNoZWRFeGVjO1xuXG5fZXhwb3J0KHsgdGFyZ2V0OiAnUmVnRXhwJywgcHJvdG86IHRydWUsIGZvcmNlZDogLy4vLmV4ZWMgIT09IHJlZ2V4cEV4ZWMgfSwge1xuICBleGVjOiByZWdleHBFeGVjXG59KTtcblxudmFyIE1BVENIID0gd2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xuXG4vLyBgSXNSZWdFeHBgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNyZWdleHBcbnZhciBpc1JlZ2V4cCA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjbGFzc29mUmF3KGl0KSA9PSAnUmVnRXhwJyk7XG59O1xuXG52YXIgbm90QVJlZ2V4cCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXNSZWdleHAoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiVGhlIG1ldGhvZCBkb2Vzbid0IGFjY2VwdCByZWd1bGFyIGV4cHJlc3Npb25zXCIpO1xuICB9IHJldHVybiBpdDtcbn07XG5cbnZhciBNQVRDSCQxID0gd2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xuXG52YXIgY29ycmVjdElzUmVnZXhwTG9naWMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgdmFyIHJlZ2V4cCA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICByZWdleHBbTUFUQ0gkMV0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgICB9IGNhdGNoIChmKSB7IC8qIGVtcHR5ICovIH1cbiAgfSByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogIWNvcnJlY3RJc1JlZ2V4cExvZ2ljKCdpbmNsdWRlcycpIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHJldHVybiAhIX5TdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKSlcbiAgICAgIC5pbmRleE9mKG5vdEFSZWdleHAoc2VhcmNoU3RyaW5nKSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcblxudmFyIFNQRUNJRVMkNCA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG52YXIgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyAjcmVwbGFjZSBuZWVkcyBidWlsdC1pbiBzdXBwb3J0IGZvciBuYW1lZCBncm91cHMuXG4gIC8vICNtYXRjaCB3b3JrcyBmaW5lIGJlY2F1c2UgaXQganVzdCByZXR1cm4gdGhlIGV4ZWMgcmVzdWx0cywgZXZlbiBpZiBpdCBoYXNcbiAgLy8gYSBcImdyb3BzXCIgcHJvcGVydHkuXG4gIHZhciByZSA9IC8uLztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgcmVzdWx0Lmdyb3VwcyA9IHsgYTogJzcnIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuICcnLnJlcGxhY2UocmUsICckPGE+JykgIT09ICc3Jztcbn0pO1xuXG4vLyBDaHJvbWUgNTEgaGFzIGEgYnVnZ3kgXCJzcGxpdFwiIGltcGxlbWVudGF0aW9uIHdoZW4gUmVnRXhwI2V4ZWMgIT09IG5hdGl2ZUV4ZWNcbi8vIFdlZXggSlMgaGFzIGZyb3plbiBidWlsdC1pbiBwcm90b3R5cGVzLCBzbyB1c2UgdHJ5IC8gY2F0Y2ggd3JhcHBlclxudmFyIFNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciByZSA9IC8oPzopLztcbiAgdmFyIG9yaWdpbmFsRXhlYyA9IHJlLmV4ZWM7XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBvcmlnaW5hbEV4ZWMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgdmFyIHJlc3VsdCA9ICdhYicuc3BsaXQocmUpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCAhPT0gMiB8fCByZXN1bHRbMF0gIT09ICdhJyB8fCByZXN1bHRbMV0gIT09ICdiJztcbn0pO1xuXG52YXIgZml4UmVnZXhwV2VsbEtub3duU3ltYm9sTG9naWMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMsIHNoYW0pIHtcbiAgdmFyIFNZTUJPTCA9IHdlbGxLbm93blN5bWJvbChLRVkpO1xuXG4gIHZhciBERUxFR0FURVNfVE9fU1lNQk9MID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTdHJpbmcgbWV0aG9kcyBjYWxsIHN5bWJvbC1uYW1lZCBSZWdFcCBtZXRob2RzXG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pO1xuXG4gIHZhciBERUxFR0FURVNfVE9fRVhFQyA9IERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTeW1ib2wtbmFtZWQgUmVnRXhwIG1ldGhvZHMgY2FsbCAuZXhlY1xuICAgIHZhciBleGVjQ2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlID0gL2EvO1xuXG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gV2UgY2FuJ3QgdXNlIHJlYWwgcmVnZXggaGVyZSBzaW5jZSBpdCBjYXVzZXMgZGVvcHRpbWl6YXRpb25cbiAgICAgIC8vIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uIGluIFY4XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzA2XG4gICAgICByZSA9IHt9O1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTJDRdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcmU7IH07XG4gICAgICByZS5mbGFncyA9ICcnO1xuICAgICAgcmVbU1lNQk9MXSA9IC8uL1tTWU1CT0xdO1xuICAgIH1cblxuICAgIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IGV4ZWNDYWxsZWQgPSB0cnVlOyByZXR1cm4gbnVsbDsgfTtcblxuICAgIHJlW1NZTUJPTF0oJycpO1xuICAgIHJldHVybiAhZXhlY0NhbGxlZDtcbiAgfSk7XG5cbiAgaWYgKFxuICAgICFERUxFR0FURVNfVE9fU1lNQk9MIHx8XG4gICAgIURFTEVHQVRFU19UT19FWEVDIHx8XG4gICAgKEtFWSA9PT0gJ3JlcGxhY2UnICYmICFSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUykgfHxcbiAgICAoS0VZID09PSAnc3BsaXQnICYmICFTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMpXG4gICkge1xuICAgIHZhciBuYXRpdmVSZWdFeHBNZXRob2QgPSAvLi9bU1lNQk9MXTtcbiAgICB2YXIgbWV0aG9kcyA9IGV4ZWMoU1lNQk9MLCAnJ1tLRVldLCBmdW5jdGlvbiAobmF0aXZlTWV0aG9kLCByZWdleHAsIHN0ciwgYXJnMiwgZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgIGlmIChyZWdleHAuZXhlYyA9PT0gcmVnZXhwRXhlYykge1xuICAgICAgICBpZiAoREVMRUdBVEVTX1RPX1NZTUJPTCAmJiAhZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgICAvLyBUaGUgbmF0aXZlIFN0cmluZyBtZXRob2QgYWxyZWFkeSBkZWxlZ2F0ZXMgdG8gQEBtZXRob2QgKHRoaXNcbiAgICAgICAgICAvLyBwb2x5ZmlsbGVkIGZ1bmN0aW9uKSwgbGVhc2luZyB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgLy8gV2UgYXZvaWQgaXQgYnkgZGlyZWN0bHkgY2FsbGluZyB0aGUgbmF0aXZlIEBAbWV0aG9kIG1ldGhvZC5cbiAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlUmVnRXhwTWV0aG9kLmNhbGwocmVnZXhwLCBzdHIsIGFyZzIpIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZU1ldGhvZC5jYWxsKHN0ciwgcmVnZXhwLCBhcmcyKSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UgfTtcbiAgICB9KTtcbiAgICB2YXIgc3RyaW5nTWV0aG9kID0gbWV0aG9kc1swXTtcbiAgICB2YXIgcmVnZXhNZXRob2QgPSBtZXRob2RzWzFdO1xuXG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBzdHJpbmdNZXRob2QpO1xuICAgIHJlZGVmaW5lKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uIChzdHJpbmcsIGFyZykgeyByZXR1cm4gcmVnZXhNZXRob2QuY2FsbChzdHJpbmcsIHRoaXMsIGFyZyk7IH1cbiAgICAgIC8vIDIxLjIuNS42IFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF0oc3RyaW5nKVxuICAgICAgLy8gMjEuMi41LjkgUmVnRXhwLnByb3RvdHlwZVtAQHNlYXJjaF0oc3RyaW5nKVxuICAgICAgOiBmdW5jdGlvbiAoc3RyaW5nKSB7IHJldHVybiByZWdleE1ldGhvZC5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICAgIGlmIChzaGFtKSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoUmVnRXhwLnByb3RvdHlwZVtTWU1CT0xdLCAnc2hhbScsIHRydWUpO1xuICB9XG59O1xuXG52YXIgY2hhckF0JDEgPSBzdHJpbmdNdWx0aWJ5dGUuY2hhckF0O1xuXG4vLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFkdmFuY2VzdHJpbmdpbmRleFxudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IGZ1bmN0aW9uIChTLCBpbmRleCwgdW5pY29kZSkge1xuICByZXR1cm4gaW5kZXggKyAodW5pY29kZSA/IGNoYXJBdCQxKFMsIGluZGV4KS5sZW5ndGggOiAxKTtcbn07XG5cbi8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbnZhciByZWdleHBFeGVjQWJzdHJhY3QgPSBmdW5jdGlvbiAoUiwgUykge1xuICB2YXIgZXhlYyA9IFIuZXhlYztcbiAgaWYgKHR5cGVvZiBleGVjID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIHJlc3VsdCA9IGV4ZWMuY2FsbChSLCBTKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignUmVnRXhwIGV4ZWMgbWV0aG9kIHJldHVybmVkIHNvbWV0aGluZyBvdGhlciB0aGFuIGFuIE9iamVjdCBvciBudWxsJyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoY2xhc3NvZlJhdyhSKSAhPT0gJ1JlZ0V4cCcpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCNleGVjIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbiAgfVxuXG4gIHJldHVybiByZWdleHBFeGVjLmNhbGwoUiwgUyk7XG59O1xuXG52YXIgbWF4JDIgPSBNYXRoLm1heDtcbnZhciBtaW4kMiA9IE1hdGgubWluO1xudmFyIGZsb29yJDEgPSBNYXRoLmZsb29yO1xudmFyIFNVQlNUSVRVVElPTl9TWU1CT0xTID0gL1xcJChbJCYnYF18XFxkXFxkP3w8W14+XSo+KS9nO1xudmFyIFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEID0gL1xcJChbJCYnYF18XFxkXFxkPykvZztcblxudmFyIG1heWJlVG9TdHJpbmcgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyBpdCA6IFN0cmluZyhpdCk7XG59O1xuXG4vLyBAQHJlcGxhY2UgbG9naWNcbmZpeFJlZ2V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdyZXBsYWNlJywgMiwgZnVuY3Rpb24gKFJFUExBQ0UsIG5hdGl2ZVJlcGxhY2UsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUucmVwbGFjZVxuICAgIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIHJlcGxhY2VyID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgICByZXR1cm4gcmVwbGFjZXIgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHJlcGxhY2VyLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgICAgOiBuYXRpdmVSZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEByZXBsYWNlXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKG5hdGl2ZVJlcGxhY2UsIHJlZ2V4cCwgdGhpcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuXG4gICAgICB2YXIgZnVuY3Rpb25hbFJlcGxhY2UgPSB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFmdW5jdGlvbmFsUmVwbGFjZSkgcmVwbGFjZVZhbHVlID0gU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG5cbiAgICAgIHZhciBnbG9iYWwgPSByeC5nbG9iYWw7XG4gICAgICBpZiAoZ2xvYmFsKSB7XG4gICAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlZ2V4cEV4ZWNBYnN0cmFjdChyeCwgUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIGJyZWFrO1xuXG4gICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgICAgICBpZiAoIWdsb2JhbCkgYnJlYWs7XG5cbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhY2N1bXVsYXRlZFJlc3VsdCA9ICcnO1xuICAgICAgdmFyIG5leHRTb3VyY2VQb3NpdGlvbiA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcblxuICAgICAgICB2YXIgbWF0Y2hlZCA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSBtYXgkMihtaW4kMih0b0ludGVnZXIocmVzdWx0LmluZGV4KSwgUy5sZW5ndGgpLCAwKTtcbiAgICAgICAgdmFyIGNhcHR1cmVzID0gW107XG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgZXF1aXZhbGVudCB0b1xuICAgICAgICAvLyAgIGNhcHR1cmVzID0gcmVzdWx0LnNsaWNlKDEpLm1hcChtYXliZVRvU3RyaW5nKVxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIGBuYXRpdmVTbGljZS5jYWxsKHJlc3VsdCwgMSwgcmVzdWx0Lmxlbmd0aClgIChjYWxsZWQgaW5cbiAgICAgICAgLy8gdGhlIHNsaWNlIHBvbHlmaWxsIHdoZW4gc2xpY2luZyBuYXRpdmUgYXJyYXlzKSBcImRvZXNuJ3Qgd29ya1wiIGluIHNhZmFyaSA5IGFuZFxuICAgICAgICAvLyBjYXVzZXMgYSBjcmFzaCAoaHR0cHM6Ly9wYXN0ZWJpbi5jb20vTjIxUXplUUEpIHdoZW4gdHJ5aW5nIHRvIGRlYnVnIGl0LlxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykgY2FwdHVyZXMucHVzaChtYXliZVRvU3RyaW5nKHJlc3VsdFtqXSkpO1xuICAgICAgICB2YXIgbmFtZWRDYXB0dXJlcyA9IHJlc3VsdC5ncm91cHM7XG4gICAgICAgIGlmIChmdW5jdGlvbmFsUmVwbGFjZSkge1xuICAgICAgICAgIHZhciByZXBsYWNlckFyZ3MgPSBbbWF0Y2hlZF0uY29uY2F0KGNhcHR1cmVzLCBwb3NpdGlvbiwgUyk7XG4gICAgICAgICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkgcmVwbGFjZXJBcmdzLnB1c2gobmFtZWRDYXB0dXJlcyk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0c3Vic3RpdHV0aW9uXG4gIGZ1bmN0aW9uIGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBzdHIsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZW1lbnQpIHtcbiAgICB2YXIgdGFpbFBvcyA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgdmFyIG0gPSBjYXB0dXJlcy5sZW5ndGg7XG4gICAgdmFyIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRDtcbiAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuYW1lZENhcHR1cmVzID0gdG9PYmplY3QobmFtZWRDYXB0dXJlcyk7XG4gICAgICBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFM7XG4gICAgfVxuICAgIHJldHVybiBuYXRpdmVSZXBsYWNlLmNhbGwocmVwbGFjZW1lbnQsIHN5bWJvbHMsIGZ1bmN0aW9uIChtYXRjaCwgY2gpIHtcbiAgICAgIHZhciBjYXB0dXJlO1xuICAgICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgICAgY2FzZSAnJCc6IHJldHVybiAnJCc7XG4gICAgICAgIGNhc2UgJyYnOiByZXR1cm4gbWF0Y2hlZDtcbiAgICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICBjYXNlIFwiJ1wiOiByZXR1cm4gc3RyLnNsaWNlKHRhaWxQb3MpO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBcXGRcXGQ/XG4gICAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgICAgaWYgKG4gPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICBpZiAobiA+IG0pIHtcbiAgICAgICAgICAgIHZhciBmID0gZmxvb3IkMShuIC8gMTApO1xuICAgICAgICAgICAgaWYgKGYgPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICAgIGlmIChmIDw9IG0pIHJldHVybiBjYXB0dXJlc1tmIC0gMV0gPT09IHVuZGVmaW5lZCA/IGNoLmNoYXJBdCgxKSA6IGNhcHR1cmVzW2YgLSAxXSArIGNoLmNoYXJBdCgxKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FwdHVyZSA9IGNhcHR1cmVzW24gLSAxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYXB0dXJlID09PSB1bmRlZmluZWQgPyAnJyA6IGNhcHR1cmU7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyBhIHN0cmluZyBvZiBhbGwgdmFsaWQgdW5pY29kZSB3aGl0ZXNwYWNlc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbnZhciB3aGl0ZXNwYWNlcyA9ICdcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRFxcdTAwMjBcXHUwMEEwXFx1MTY4MFxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFxcdTIwMjlcXHVGRUZGJztcblxudmFyIHdoaXRlc3BhY2UgPSAnWycgKyB3aGl0ZXNwYWNlcyArICddJztcbnZhciBsdHJpbSA9IFJlZ0V4cCgnXicgKyB3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJyk7XG52YXIgcnRyaW0gPSBSZWdFeHAod2hpdGVzcGFjZSArIHdoaXRlc3BhY2UgKyAnKiQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltLCB0cmltU3RhcnQsIHRyaW1FbmQsIHRyaW1MZWZ0LCB0cmltUmlnaHQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCQzID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcykge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSgkdGhpcykpO1xuICAgIGlmIChUWVBFICYgMSkgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobHRyaW0sICcnKTtcbiAgICBpZiAoVFlQRSAmIDIpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbn07XG5cbnZhciBzdHJpbmdUcmltID0ge1xuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1MZWZ0LCB0cmltU3RhcnQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1zdGFydFxuICBzdGFydDogY3JlYXRlTWV0aG9kJDMoMSksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnsgdHJpbVJpZ2h0LCB0cmltRW5kIH1gIG1ldGhvZHNcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltZW5kXG4gIGVuZDogY3JlYXRlTWV0aG9kJDMoMiksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiAgdHJpbTogY3JlYXRlTWV0aG9kJDMoMylcbn07XG5cbnZhciBub24gPSAnXFx1MjAwQlxcdTAwODVcXHUxODBFJztcblxuLy8gY2hlY2sgdGhhdCBhIG1ldGhvZCB3b3JrcyB3aXRoIHRoZSBjb3JyZWN0IGxpc3Rcbi8vIG9mIHdoaXRlc3BhY2VzIGFuZCBoYXMgYSBjb3JyZWN0IG5hbWVcbnZhciBmb3JjZWRTdHJpbmdUcmltTWV0aG9kID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FKSB7XG4gIHJldHVybiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICEhd2hpdGVzcGFjZXNbTUVUSE9EX05BTUVdKCkgfHwgbm9uW01FVEhPRF9OQU1FXSgpICE9IG5vbiB8fCB3aGl0ZXNwYWNlc1tNRVRIT0RfTkFNRV0ubmFtZSAhPT0gTUVUSE9EX05BTUU7XG4gIH0pO1xufTtcblxudmFyICR0cmltID0gc3RyaW5nVHJpbS50cmltO1xuXG5cbi8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltXG5fZXhwb3J0KHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCgndHJpbScpIH0sIHtcbiAgdHJpbTogZnVuY3Rpb24gdHJpbSgpIHtcbiAgICByZXR1cm4gJHRyaW0odGhpcyk7XG4gIH1cbn0pO1xuXG4vLyBNYXAgZnVuY3Rpb25cbmZ1bmN0aW9uIG1hcChhcnJheSwgYmxvY2spIHtcbiAgdmFyIGk7XG4gIHZhciBpbCA9IGFycmF5Lmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbDsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goYmxvY2soYXJyYXlbaV0pKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IC8vIEZpbHRlciBmdW5jdGlvblxuXG5mdW5jdGlvbiBmaWx0ZXIoYXJyYXksIGJsb2NrKSB7XG4gIHZhciBpO1xuICB2YXIgaWwgPSBhcnJheS5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgaWw7IGkrKykge1xuICAgIGlmIChibG9jayhhcnJheVtpXSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSAvLyBEZWdyZWVzIHRvIHJhZGlhbnNcblxuZnVuY3Rpb24gcmFkaWFucyhkKSB7XG4gIHJldHVybiBkICUgMzYwICogTWF0aC5QSSAvIDE4MDtcbn0gLy8gUmFkaWFucyB0byBkZWdyZWVzXG5cbmZ1bmN0aW9uIGRlZ3JlZXMocikge1xuICByZXR1cm4gciAqIDE4MCAvIE1hdGguUEkgJSAzNjA7XG59IC8vIENvbnZlcnQgZGFzaC1zZXBhcmF0ZWQtc3RyaW5nIHRvIGNhbWVsQ2FzZVxuXG5mdW5jdGlvbiBjYW1lbENhc2Uocykge1xuICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0oLikvZywgZnVuY3Rpb24gKG0sIGcpIHtcbiAgICByZXR1cm4gZy50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn0gLy8gQ29udmVydCBjYW1lbCBjYXNlZCBzdHJpbmcgdG8gc3RyaW5nIHNlcGVyYXRlZFxuXG5mdW5jdGlvbiB1bkNhbWVsQ2FzZShzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKG0sIGcpIHtcbiAgICByZXR1cm4gJy0nICsgZy50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn0gLy8gQ2FwaXRhbGl6ZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmdcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzKSB7XG4gIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbn0gLy8gQ2FsY3VsYXRlIHByb3BvcnRpb25hbCB3aWR0aCBhbmQgaGVpZ2h0IHZhbHVlcyB3aGVuIG5lY2Vzc2FyeVxuXG5mdW5jdGlvbiBwcm9wb3J0aW9uYWxTaXplKGVsZW1lbnQsIHdpZHRoLCBoZWlnaHQsIGJveCkge1xuICBpZiAod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCkge1xuICAgIGJveCA9IGJveCB8fCBlbGVtZW50LmJib3goKTtcblxuICAgIGlmICh3aWR0aCA9PSBudWxsKSB7XG4gICAgICB3aWR0aCA9IGJveC53aWR0aCAvIGJveC5oZWlnaHQgKiBoZWlnaHQ7XG4gICAgfSBlbHNlIGlmIChoZWlnaHQgPT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gYm94LmhlaWdodCAvIGJveC53aWR0aCAqIHdpZHRoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59XG5mdW5jdGlvbiBnZXRPcmlnaW4obywgZWxlbWVudCkge1xuICAvLyBBbGxvdyBvcmlnaW4gb3IgYXJvdW5kIGFzIHRoZSBuYW1lc1xuICB2YXIgb3JpZ2luID0gby5vcmlnaW47IC8vIG8uYXJvdW5kID09IG51bGwgPyBvLm9yaWdpbiA6IG8uYXJvdW5kXG5cbiAgdmFyIG94LCBveTsgLy8gQWxsb3cgdGhlIHVzZXIgdG8gcGFzcyBhIHN0cmluZyB0byByb3RhdGUgYXJvdW5kIGEgZ2l2ZW4gcG9pbnRcblxuICBpZiAodHlwZW9mIG9yaWdpbiA9PT0gJ3N0cmluZycgfHwgb3JpZ2luID09IG51bGwpIHtcbiAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZWxlbWVudCB3aXRoIG5vIHRyYW5zZm9ybWF0aW9ucyBhcHBsaWVkXG4gICAgdmFyIHN0cmluZyA9IChvcmlnaW4gfHwgJ2NlbnRlcicpLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgdmFyIF9lbGVtZW50JGJib3ggPSBlbGVtZW50LmJib3goKSxcbiAgICAgICAgaGVpZ2h0ID0gX2VsZW1lbnQkYmJveC5oZWlnaHQsXG4gICAgICAgIHdpZHRoID0gX2VsZW1lbnQkYmJveC53aWR0aCxcbiAgICAgICAgeCA9IF9lbGVtZW50JGJib3gueCxcbiAgICAgICAgeSA9IF9lbGVtZW50JGJib3gueTsgLy8gQ2FsY3VsYXRlIHRoZSB0cmFuc2Zvcm1lZCB4IGFuZCB5IGNvb3JkaW5hdGVzXG5cblxuICAgIHZhciBieCA9IHN0cmluZy5pbmNsdWRlcygnbGVmdCcpID8geCA6IHN0cmluZy5pbmNsdWRlcygncmlnaHQnKSA/IHggKyB3aWR0aCA6IHggKyB3aWR0aCAvIDI7XG4gICAgdmFyIGJ5ID0gc3RyaW5nLmluY2x1ZGVzKCd0b3AnKSA/IHkgOiBzdHJpbmcuaW5jbHVkZXMoJ2JvdHRvbScpID8geSArIGhlaWdodCA6IHkgKyBoZWlnaHQgLyAyOyAvLyBTZXQgdGhlIGJvdW5kcyBlZyA6IFwiYm90dG9tLWxlZnRcIiwgXCJUb3AgcmlnaHRcIiwgXCJtaWRkbGVcIiBldGMuLi5cblxuICAgIG94ID0gby5veCAhPSBudWxsID8gby5veCA6IGJ4O1xuICAgIG95ID0gby5veSAhPSBudWxsID8gby5veSA6IGJ5O1xuICB9IGVsc2Uge1xuICAgIG94ID0gb3JpZ2luWzBdO1xuICAgIG95ID0gb3JpZ2luWzFdO1xuICB9IC8vIFJldHVybiB0aGUgb3JpZ2luIGFzIGl0IGlzIGlmIGl0IHdhc24ndCBhIHN0cmluZ1xuXG5cbiAgcmV0dXJuIFtveCwgb3ldO1xufVxuXG52YXIgdXRpbHMgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdG1hcDogbWFwLFxuXHRmaWx0ZXI6IGZpbHRlcixcblx0cmFkaWFuczogcmFkaWFucyxcblx0ZGVncmVlczogZGVncmVlcyxcblx0Y2FtZWxDYXNlOiBjYW1lbENhc2UsXG5cdHVuQ2FtZWxDYXNlOiB1bkNhbWVsQ2FzZSxcblx0Y2FwaXRhbGl6ZTogY2FwaXRhbGl6ZSxcblx0cHJvcG9ydGlvbmFsU2l6ZTogcHJvcG9ydGlvbmFsU2l6ZSxcblx0Z2V0T3JpZ2luOiBnZXRPcmlnaW5cbn0pO1xuXG4vLyBEZWZhdWx0IG5hbWVzcGFjZXNcbnZhciBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG52YXIgeG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nO1xudmFyIHhsaW5rID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xudmFyIHN2Z2pzID0gJ2h0dHA6Ly9zdmdqcy5jb20vc3ZnanMnO1xuXG52YXIgbmFtZXNwYWNlcyA9ICh7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0bnM6IG5zLFxuXHR4bWxuczogeG1sbnMsXG5cdHhsaW5rOiB4bGluayxcblx0c3ZnanM6IHN2Z2pzXG59KTtcblxudmFyIGdsb2JhbHMgPSB7XG4gIHdpbmRvdzogdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogd2luZG93LFxuICBkb2N1bWVudDogdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBkb2N1bWVudFxufTtcbmZ1bmN0aW9uIHJlZ2lzdGVyV2luZG93KCkge1xuICB2YXIgd2luID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICB2YXIgZG9jID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICBnbG9iYWxzLndpbmRvdyA9IHdpbjtcbiAgZ2xvYmFscy5kb2N1bWVudCA9IGRvYztcbn1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxudmFyIEJhc2UgPSBmdW5jdGlvbiBCYXNlKCkge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZSk7XG59O1xuXG52YXIgZWxlbWVudHMgPSB7fTtcbnZhciByb290ID0gJ19fX1NZTUJPTF9fX1JPT1RfX18nOyAvLyBNZXRob2QgZm9yIGVsZW1lbnQgY3JlYXRpb25cblxuZnVuY3Rpb24gY3JlYXRlKG5hbWUpIHtcbiAgLy8gY3JlYXRlIGVsZW1lbnRcbiAgcmV0dXJuIGdsb2JhbHMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIG1ha2VJbnN0YW5jZShlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQmFzZSkgcmV0dXJuIGVsZW1lbnQ7XG5cbiAgaWYgKF90eXBlb2YoZWxlbWVudCkgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGFkb3B0ZXIoZWxlbWVudCk7XG4gIH1cblxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBlbGVtZW50c1tyb290XSgpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJyAmJiBlbGVtZW50LmNoYXJBdCgwKSAhPT0gJzwnKSB7XG4gICAgcmV0dXJuIGFkb3B0ZXIoZ2xvYmFscy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpKTtcbiAgfVxuXG4gIHZhciBub2RlID0gY3JlYXRlKCdzdmcnKTtcbiAgbm9kZS5pbm5lckhUTUwgPSBlbGVtZW50OyAvLyBXZSBjYW4gdXNlIGZpcnN0Q2hpbGQgaGVyZSBiZWNhdXNlIHdlIGtub3csXG4gIC8vIHRoYXQgdGhlIGZpcnN0IGNoYXIgaXMgPCBhbmQgdGh1cyBhbiBlbGVtZW50XG5cbiAgZWxlbWVudCA9IGFkb3B0ZXIobm9kZS5maXJzdENoaWxkKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5mdW5jdGlvbiBub2RlT3JOZXcobmFtZSwgbm9kZSkge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIGdsb2JhbHMud2luZG93Lk5vZGUgPyBub2RlIDogY3JlYXRlKG5hbWUpO1xufSAvLyBBZG9wdCBleGlzdGluZyBzdmcgZWxlbWVudHNcblxuZnVuY3Rpb24gYWRvcHQobm9kZSkge1xuICAvLyBjaGVjayBmb3IgcHJlc2VuY2Ugb2Ygbm9kZVxuICBpZiAoIW5vZGUpIHJldHVybiBudWxsOyAvLyBtYWtlIHN1cmUgYSBub2RlIGlzbid0IGFscmVhZHkgYWRvcHRlZFxuXG4gIGlmIChub2RlLmluc3RhbmNlIGluc3RhbmNlb2YgQmFzZSkgcmV0dXJuIG5vZGUuaW5zdGFuY2U7IC8vIGluaXRpYWxpemUgdmFyaWFibGVzXG5cbiAgdmFyIGNsYXNzTmFtZSA9IGNhcGl0YWxpemUobm9kZS5ub2RlTmFtZSB8fCAnRG9tJyk7IC8vIE1ha2Ugc3VyZSB0aGF0IGdyYWRpZW50cyBhcmUgYWRvcHRlZCBjb3JyZWN0bHlcblxuICBpZiAoY2xhc3NOYW1lID09PSAnTGluZWFyR3JhZGllbnQnIHx8IGNsYXNzTmFtZSA9PT0gJ1JhZGlhbEdyYWRpZW50Jykge1xuICAgIGNsYXNzTmFtZSA9ICdHcmFkaWVudCc7IC8vIEZhbGxiYWNrIHRvIERvbSBpZiBlbGVtZW50IGlzIG5vdCBrbm93blxuICB9IGVsc2UgaWYgKCFlbGVtZW50c1tjbGFzc05hbWVdKSB7XG4gICAgY2xhc3NOYW1lID0gJ0RvbSc7XG4gIH1cblxuICByZXR1cm4gbmV3IGVsZW1lbnRzW2NsYXNzTmFtZV0obm9kZSk7XG59XG52YXIgYWRvcHRlciA9IGFkb3B0O1xuZnVuY3Rpb24gbW9ja0Fkb3B0KCkge1xuICB2YXIgbW9jayA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogYWRvcHQ7XG4gIGFkb3B0ZXIgPSBtb2NrO1xufVxuZnVuY3Rpb24gcmVnaXN0ZXIoZWxlbWVudCkge1xuICB2YXIgbmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZWxlbWVudC5uYW1lO1xuICB2YXIgYXNSb290ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcbiAgZWxlbWVudHNbbmFtZV0gPSBlbGVtZW50O1xuICBpZiAoYXNSb290KSBlbGVtZW50c1tyb290XSA9IGVsZW1lbnQ7XG4gIGFkZE1ldGhvZE5hbWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGVsZW1lbnQucHJvdG90eXBlKSk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuZnVuY3Rpb24gZ2V0Q2xhc3MobmFtZSkge1xuICByZXR1cm4gZWxlbWVudHNbbmFtZV07XG59IC8vIEVsZW1lbnQgaWQgc2VxdWVuY2VcblxudmFyIGRpZCA9IDEwMDA7IC8vIEdldCBuZXh0IG5hbWVkIGVsZW1lbnQgaWRcblxuZnVuY3Rpb24gZWlkKG5hbWUpIHtcbiAgcmV0dXJuICdTdmdqcycgKyBjYXBpdGFsaXplKG5hbWUpICsgZGlkKys7XG59IC8vIERlZXAgbmV3IGlkIGFzc2lnbm1lbnRcblxuZnVuY3Rpb24gYXNzaWduTmV3SWQobm9kZSkge1xuICAvLyBkbyB0aGUgc2FtZSBmb3IgU1ZHIGNoaWxkIG5vZGVzIGFzIHdlbGxcbiAgZm9yICh2YXIgaSA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBhc3NpZ25OZXdJZChub2RlLmNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGlmIChub2RlLmlkKSB7XG4gICAgcmV0dXJuIGFkb3B0KG5vZGUpLmlkKGVpZChub2RlLm5vZGVOYW1lKSk7XG4gIH1cblxuICByZXR1cm4gYWRvcHQobm9kZSk7XG59IC8vIE1ldGhvZCBmb3IgZXh0ZW5kaW5nIG9iamVjdHNcblxuZnVuY3Rpb24gZXh0ZW5kKG1vZHVsZXMsIG1ldGhvZHMsIGF0dHJDaGVjaykge1xuICB2YXIga2V5LCBpO1xuICBtb2R1bGVzID0gQXJyYXkuaXNBcnJheShtb2R1bGVzKSA/IG1vZHVsZXMgOiBbbW9kdWxlc107XG5cbiAgZm9yIChpID0gbW9kdWxlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIHZhciBtZXRob2QgPSBtZXRob2RzW2tleV07XG5cbiAgICAgIGlmIChhdHRyQ2hlY2spIHtcbiAgICAgICAgbWV0aG9kID0gd3JhcFdpdGhBdHRyQ2hlY2sobWV0aG9kc1trZXldKTtcbiAgICAgIH1cblxuICAgICAgbW9kdWxlc1tpXS5wcm90b3R5cGVba2V5XSA9IG1ldGhvZDtcbiAgICB9XG4gIH1cbn0gLy8gZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZFdpdGhBdHRyQ2hlY2sgKC4uLmFyZ3MpIHtcbi8vICAgZXh0ZW5kKC4uLmFyZ3MsIHRydWUpXG4vLyB9XG5cbmZ1bmN0aW9uIHdyYXBXaXRoQXR0ckNoZWNrKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBvID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKG8gJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICYmICEobyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3Muc2xpY2UoMCwgLTEpKS5hdHRyKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gaW52ZW50KGNvbmZpZykge1xuICAvLyBDcmVhdGUgZWxlbWVudCBpbml0aWFsaXplclxuICB2YXIgaW5pdGlhbGl6ZXIgPSB0eXBlb2YgY29uZmlnLmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IGNvbmZpZy5jcmVhdGUgOiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHRoaXMuY29uc3RydWN0b3Iobm9kZSB8fCBjcmVhdGUoY29uZmlnLmNyZWF0ZSkpO1xuICB9OyAvLyBJbmhlcml0IHByb3RvdHlwZVxuXG4gIGlmIChjb25maWcuaW5oZXJpdCkge1xuICAgIC8qIGVzbGludCBuZXctY2FwOiBvZmYgKi9cbiAgICBpbml0aWFsaXplci5wcm90b3R5cGUgPSBuZXcgY29uZmlnLmluaGVyaXQoKTtcbiAgICBpbml0aWFsaXplci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBpbml0aWFsaXplcjtcbiAgfSAvLyBFeHRlbmQgd2l0aCBtZXRob2RzXG5cblxuICBpZiAoY29uZmlnLmV4dGVuZCkge1xuICAgIGV4dGVuZChpbml0aWFsaXplciwgY29uZmlnLmV4dGVuZCk7XG4gIH0gLy8gQXR0YWNoIGNvbnN0cnVjdCBtZXRob2QgdG8gcGFyZW50XG5cblxuICBpZiAoY29uZmlnLmNvbnN0cnVjdCkge1xuICAgIGV4dGVuZChjb25maWcucGFyZW50IHx8IGVsZW1lbnRzLkNvbnRhaW5lciwgY29uZmlnLmNvbnN0cnVjdCk7XG4gIH1cblxuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmZ1bmN0aW9uIHNpYmxpbmdzKCkge1xuICByZXR1cm4gdGhpcy5wYXJlbnQoKS5jaGlsZHJlbigpO1xufSAvLyBHZXQgdGhlIGN1cmVudCBwb3NpdGlvbiBzaWJsaW5nc1xuXG5mdW5jdGlvbiBwb3NpdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucGFyZW50KCkuaW5kZXgodGhpcyk7XG59IC8vIEdldCB0aGUgbmV4dCBlbGVtZW50ICh3aWxsIHJldHVybiBudWxsIGlmIHRoZXJlIGlzIG5vbmUpXG5cbmZ1bmN0aW9uIG5leHQoKSB7XG4gIHJldHVybiB0aGlzLnNpYmxpbmdzKClbdGhpcy5wb3NpdGlvbigpICsgMV07XG59IC8vIEdldCB0aGUgbmV4dCBlbGVtZW50ICh3aWxsIHJldHVybiBudWxsIGlmIHRoZXJlIGlzIG5vbmUpXG5cbmZ1bmN0aW9uIHByZXYoKSB7XG4gIHJldHVybiB0aGlzLnNpYmxpbmdzKClbdGhpcy5wb3NpdGlvbigpIC0gMV07XG59IC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBvbmUgc3RlcCBmb3J3YXJkXG5cbmZ1bmN0aW9uIGZvcndhcmQoKSB7XG4gIHZhciBpID0gdGhpcy5wb3NpdGlvbigpICsgMTtcbiAgdmFyIHAgPSB0aGlzLnBhcmVudCgpOyAvLyBtb3ZlIG5vZGUgb25lIHN0ZXAgZm9yd2FyZFxuXG4gIHAucmVtb3ZlRWxlbWVudCh0aGlzKS5hZGQodGhpcywgaSk7IC8vIG1ha2Ugc3VyZSBkZWZzIG5vZGUgaXMgYWx3YXlzIGF0IHRoZSB0b3BcblxuICBpZiAodHlwZW9mIHAuaXNSb290ID09PSAnZnVuY3Rpb24nICYmIHAuaXNSb290KCkpIHtcbiAgICBwLm5vZGUuYXBwZW5kQ2hpbGQocC5kZWZzKCkubm9kZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gU2VuZCBnaXZlbiBlbGVtZW50IG9uZSBzdGVwIGJhY2t3YXJkXG5cbmZ1bmN0aW9uIGJhY2t3YXJkKCkge1xuICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKTtcblxuICBpZiAoaSA+IDApIHtcbiAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcykuYWRkKHRoaXMsIGkgLSAxKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgYWxsIHRoZSB3YXkgdG8gdGhlIGZyb250XG5cbmZ1bmN0aW9uIGZyb250KCkge1xuICB2YXIgcCA9IHRoaXMucGFyZW50KCk7IC8vIE1vdmUgbm9kZSBmb3J3YXJkXG5cbiAgcC5ub2RlLmFwcGVuZENoaWxkKHRoaXMubm9kZSk7IC8vIE1ha2Ugc3VyZSBkZWZzIG5vZGUgaXMgYWx3YXlzIGF0IHRoZSB0b3BcblxuICBpZiAodHlwZW9mIHAuaXNSb290ID09PSAnZnVuY3Rpb24nICYmIHAuaXNSb290KCkpIHtcbiAgICBwLm5vZGUuYXBwZW5kQ2hpbGQocC5kZWZzKCkubm9kZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gU2VuZCBnaXZlbiBlbGVtZW50IGFsbCB0aGUgd2F5IHRvIHRoZSBiYWNrXG5cbmZ1bmN0aW9uIGJhY2soKSB7XG4gIGlmICh0aGlzLnBvc2l0aW9uKCkgPiAwKSB7XG4gICAgdGhpcy5wYXJlbnQoKS5yZW1vdmVFbGVtZW50KHRoaXMpLmFkZCh0aGlzLCAwKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBJbnNlcnRzIGEgZ2l2ZW4gZWxlbWVudCBiZWZvcmUgdGhlIHRhcmdldGVkIGVsZW1lbnRcblxuZnVuY3Rpb24gYmVmb3JlKGVsZW1lbnQpIHtcbiAgZWxlbWVudCA9IG1ha2VJbnN0YW5jZShlbGVtZW50KTtcbiAgZWxlbWVudC5yZW1vdmUoKTtcbiAgdmFyIGkgPSB0aGlzLnBvc2l0aW9uKCk7XG4gIHRoaXMucGFyZW50KCkuYWRkKGVsZW1lbnQsIGkpO1xuICByZXR1cm4gdGhpcztcbn0gLy8gSW5zZXJ0cyBhIGdpdmVuIGVsZW1lbnQgYWZ0ZXIgdGhlIHRhcmdldGVkIGVsZW1lbnRcblxuZnVuY3Rpb24gYWZ0ZXIoZWxlbWVudCkge1xuICBlbGVtZW50ID0gbWFrZUluc3RhbmNlKGVsZW1lbnQpO1xuICBlbGVtZW50LnJlbW92ZSgpO1xuICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKTtcbiAgdGhpcy5wYXJlbnQoKS5hZGQoZWxlbWVudCwgaSArIDEpO1xuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIGluc2VydEJlZm9yZShlbGVtZW50KSB7XG4gIGVsZW1lbnQgPSBtYWtlSW5zdGFuY2UoZWxlbWVudCk7XG4gIGVsZW1lbnQuYmVmb3JlKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIGluc2VydEFmdGVyKGVsZW1lbnQpIHtcbiAgZWxlbWVudCA9IG1ha2VJbnN0YW5jZShlbGVtZW50KTtcbiAgZWxlbWVudC5hZnRlcih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5yZWdpc3Rlck1ldGhvZHMoJ0RvbScsIHtcbiAgc2libGluZ3M6IHNpYmxpbmdzLFxuICBwb3NpdGlvbjogcG9zaXRpb24sXG4gIG5leHQ6IG5leHQsXG4gIHByZXY6IHByZXYsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGJhY2t3YXJkOiBiYWNrd2FyZCxcbiAgZnJvbnQ6IGZyb250LFxuICBiYWNrOiBiYWNrLFxuICBiZWZvcmU6IGJlZm9yZSxcbiAgYWZ0ZXI6IGFmdGVyLFxuICBpbnNlcnRCZWZvcmU6IGluc2VydEJlZm9yZSxcbiAgaW5zZXJ0QWZ0ZXI6IGluc2VydEFmdGVyXG59KTtcblxudmFyICRmaWx0ZXIgPSBhcnJheUl0ZXJhdGlvbi5maWx0ZXI7XG5cblxuLy8gYEFycmF5LnByb3RvdHlwZS5maWx0ZXJgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbHRlclxuLy8gd2l0aCBhZGRpbmcgc3VwcG9ydCBvZiBAQHNwZWNpZXNcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdmaWx0ZXInKSB9LCB7XG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRmaWx0ZXIodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcblxudmFyIHNsb3BweUFycmF5TWV0aG9kID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gIW1ldGhvZCB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcblxudmFyICRpbmRleE9mID0gYXJyYXlJbmNsdWRlcy5pbmRleE9mO1xuXG5cbnZhciBuYXRpdmVJbmRleE9mID0gW10uaW5kZXhPZjtcblxudmFyIE5FR0FUSVZFX1pFUk8gPSAhIW5hdGl2ZUluZGV4T2YgJiYgMSAvIFsxXS5pbmRleE9mKDEsIC0wKSA8IDA7XG52YXIgU0xPUFBZX01FVEhPRCA9IHNsb3BweUFycmF5TWV0aG9kKCdpbmRleE9mJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogTkVHQVRJVkVfWkVSTyB8fCBTTE9QUFlfTUVUSE9EIH0sIHtcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/IG5hdGl2ZUluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnZhciBuYXRpdmVKb2luID0gW10uam9pbjtcblxudmFyIEVTM19TVFJJTkdTID0gaW5kZXhlZE9iamVjdCAhPSBPYmplY3Q7XG52YXIgU0xPUFBZX01FVEhPRCQxID0gc2xvcHB5QXJyYXlNZXRob2QoJ2pvaW4nLCAnLCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmpvaW5gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmpvaW5cbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEVTM19TVFJJTkdTIHx8IFNMT1BQWV9NRVRIT0QkMSB9LCB7XG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUpvaW4uY2FsbCh0b0luZGV4ZWRPYmplY3QodGhpcyksIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkID8gJywnIDogc2VwYXJhdG9yKTtcbiAgfVxufSk7XG5cbnZhciBTUEVDSUVTJDUgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxuLy8gYFNwZWNpZXNDb25zdHJ1Y3RvcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zcGVjaWVzY29uc3RydWN0b3JcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFUyQ1XSkgPT0gdW5kZWZpbmVkID8gZGVmYXVsdENvbnN0cnVjdG9yIDogYUZ1bmN0aW9uJDEoUyk7XG59O1xuXG52YXIgYXJyYXlQdXNoID0gW10ucHVzaDtcbnZhciBtaW4kMyA9IE1hdGgubWluO1xudmFyIE1BWF9VSU5UMzIgPSAweEZGRkZGRkZGO1xuXG4vLyBiYWJlbC1taW5pZnkgdHJhbnNwaWxlcyBSZWdFeHAoJ3gnLCAneScpIC0+IC94L3kgYW5kIGl0IGNhdXNlcyBTeW50YXhFcnJvclxudmFyIFNVUFBPUlRTX1kgPSAhZmFpbHMoZnVuY3Rpb24gKCkgeyByZXR1cm4gIVJlZ0V4cChNQVhfVUlOVDMyLCAneScpOyB9KTtcblxuLy8gQEBzcGxpdCBsb2dpY1xuZml4UmVnZXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ3NwbGl0JywgMiwgZnVuY3Rpb24gKFNQTElULCBuYXRpdmVTcGxpdCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHZhciBpbnRlcm5hbFNwbGl0O1xuICBpZiAoXG4gICAgJ2FiYmMnLnNwbGl0KC8oYikqLylbMV0gPT0gJ2MnIHx8XG4gICAgJ3Rlc3QnLnNwbGl0KC8oPzopLywgLTEpLmxlbmd0aCAhPSA0IHx8XG4gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pLmxlbmd0aCAhPSAyIHx8XG4gICAgJy4nLnNwbGl0KC8oLj8pKC4/KS8pLmxlbmd0aCAhPSA0IHx8XG4gICAgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMSB8fFxuICAgICcnLnNwbGl0KC8uPy8pLmxlbmd0aFxuICApIHtcbiAgICAvLyBiYXNlZCBvbiBlczUtc2hpbSBpbXBsZW1lbnRhdGlvbiwgbmVlZCB0byByZXdvcmsgaXRcbiAgICBpbnRlcm5hbFNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHZhciBzdHJpbmcgPSBTdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKSk7XG4gICAgICB2YXIgbGltID0gbGltaXQgPT09IHVuZGVmaW5lZCA/IE1BWF9VSU5UMzIgOiBsaW1pdCA+Pj4gMDtcbiAgICAgIGlmIChsaW0gPT09IDApIHJldHVybiBbXTtcbiAgICAgIGlmIChzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtzdHJpbmddO1xuICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgIGlmICghaXNSZWdleHAoc2VwYXJhdG9yKSkge1xuICAgICAgICByZXR1cm4gbmF0aXZlU3BsaXQuY2FsbChzdHJpbmcsIHNlcGFyYXRvciwgbGltKTtcbiAgICAgIH1cbiAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgIHZhciBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/ICdpJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnVuaWNvZGUgPyAndScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5zdGlja3kgPyAneScgOiAnJyk7XG4gICAgICB2YXIgbGFzdExhc3RJbmRleCA9IDA7XG4gICAgICAvLyBNYWtlIGBnbG9iYWxgIGFuZCBhdm9pZCBgbGFzdEluZGV4YCBpc3N1ZXMgYnkgd29ya2luZyB3aXRoIGEgY29weVxuICAgICAgdmFyIHNlcGFyYXRvckNvcHkgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcbiAgICAgIHZhciBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoO1xuICAgICAgd2hpbGUgKG1hdGNoID0gcmVnZXhwRXhlYy5jYWxsKHNlcGFyYXRvckNvcHksIHN0cmluZykpIHtcbiAgICAgICAgbGFzdEluZGV4ID0gc2VwYXJhdG9yQ29weS5sYXN0SW5kZXg7XG4gICAgICAgIGlmIChsYXN0SW5kZXggPiBsYXN0TGFzdEluZGV4KSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmcubGVuZ3RoKSBhcnJheVB1c2guYXBwbHkob3V0cHV0LCBtYXRjaC5zbGljZSgxKSk7XG4gICAgICAgICAgbGFzdExlbmd0aCA9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IGxpbSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcGFyYXRvckNvcHkubGFzdEluZGV4ID09PSBtYXRjaC5pbmRleCkgc2VwYXJhdG9yQ29weS5sYXN0SW5kZXgrKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgfVxuICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpIG91dHB1dC5wdXNoKCcnKTtcbiAgICAgIH0gZWxzZSBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgICAgcmV0dXJuIG91dHB1dC5sZW5ndGggPiBsaW0gPyBvdXRwdXQuc2xpY2UoMCwgbGltKSA6IG91dHB1dDtcbiAgICB9O1xuICAvLyBDaGFrcmEsIFY4XG4gIH0gZWxzZSBpZiAoJzAnLnNwbGl0KHVuZGVmaW5lZCwgMCkubGVuZ3RoKSB7XG4gICAgaW50ZXJuYWxTcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICByZXR1cm4gc2VwYXJhdG9yID09PSB1bmRlZmluZWQgJiYgbGltaXQgPT09IDAgPyBbXSA6IG5hdGl2ZVNwbGl0LmNhbGwodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfTtcbiAgfSBlbHNlIGludGVybmFsU3BsaXQgPSBuYXRpdmVTcGxpdDtcblxuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnNwbGl0YCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnNwbGl0XG4gICAgZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIHNwbGl0dGVyID0gc2VwYXJhdG9yID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlcGFyYXRvcltTUExJVF07XG4gICAgICByZXR1cm4gc3BsaXR0ZXIgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHNwbGl0dGVyLmNhbGwoc2VwYXJhdG9yLCBPLCBsaW1pdClcbiAgICAgICAgOiBpbnRlcm5hbFNwbGl0LmNhbGwoU3RyaW5nKE8pLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAc3BsaXRcbiAgICAvL1xuICAgIC8vIE5PVEU6IFRoaXMgY2Fubm90IGJlIHByb3Blcmx5IHBvbHlmaWxsZWQgaW4gZW5naW5lcyB0aGF0IGRvbid0IHN1cHBvcnRcbiAgICAvLyB0aGUgJ3knIGZsYWcuXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCwgbGltaXQpIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUoaW50ZXJuYWxTcGxpdCwgcmVnZXhwLCB0aGlzLCBsaW1pdCwgaW50ZXJuYWxTcGxpdCAhPT0gbmF0aXZlU3BsaXQpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuXG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG4gICAgICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3RvcihyeCwgUmVnRXhwKTtcblxuICAgICAgdmFyIHVuaWNvZGVNYXRjaGluZyA9IHJ4LnVuaWNvZGU7XG4gICAgICB2YXIgZmxhZ3MgPSAocnguaWdub3JlQ2FzZSA/ICdpJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocngubXVsdGlsaW5lID8gJ20nIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyeC51bmljb2RlID8gJ3UnIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChTVVBQT1JUU19ZID8gJ3knIDogJ2cnKTtcblxuICAgICAgLy8gXig/ICsgcnggKyApIGlzIG5lZWRlZCwgaW4gY29tYmluYXRpb24gd2l0aCBzb21lIFMgc2xpY2luZywgdG9cbiAgICAgIC8vIHNpbXVsYXRlIHRoZSAneScgZmxhZy5cbiAgICAgIHZhciBzcGxpdHRlciA9IG5ldyBDKFNVUFBPUlRTX1kgPyByeCA6ICdeKD86JyArIHJ4LnNvdXJjZSArICcpJywgZmxhZ3MpO1xuICAgICAgdmFyIGxpbSA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyBNQVhfVUlOVDMyIDogbGltaXQgPj4+IDA7XG4gICAgICBpZiAobGltID09PSAwKSByZXR1cm4gW107XG4gICAgICBpZiAoUy5sZW5ndGggPT09IDApIHJldHVybiByZWdleHBFeGVjQWJzdHJhY3Qoc3BsaXR0ZXIsIFMpID09PSBudWxsID8gW1NdIDogW107XG4gICAgICB2YXIgcCA9IDA7XG4gICAgICB2YXIgcSA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgd2hpbGUgKHEgPCBTLmxlbmd0aCkge1xuICAgICAgICBzcGxpdHRlci5sYXN0SW5kZXggPSBTVVBQT1JUU19ZID8gcSA6IDA7XG4gICAgICAgIHZhciB6ID0gcmVnZXhwRXhlY0Fic3RyYWN0KHNwbGl0dGVyLCBTVVBQT1JUU19ZID8gUyA6IFMuc2xpY2UocSkpO1xuICAgICAgICB2YXIgZTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHogPT09IG51bGwgfHxcbiAgICAgICAgICAoZSA9IG1pbiQzKHRvTGVuZ3RoKHNwbGl0dGVyLmxhc3RJbmRleCArIChTVVBQT1JUU19ZID8gMCA6IHEpKSwgUy5sZW5ndGgpKSA9PT0gcFxuICAgICAgICApIHtcbiAgICAgICAgICBxID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHEsIHVuaWNvZGVNYXRjaGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQS5wdXNoKFMuc2xpY2UocCwgcSkpO1xuICAgICAgICAgIGlmIChBLmxlbmd0aCA9PT0gbGltKSByZXR1cm4gQTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB6Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgQS5wdXNoKHpbaV0pO1xuICAgICAgICAgICAgaWYgKEEubGVuZ3RoID09PSBsaW0pIHJldHVybiBBO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxID0gcCA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEEucHVzaChTLnNsaWNlKHApKTtcbiAgICAgIHJldHVybiBBO1xuICAgIH1cbiAgXTtcbn0sICFTVVBQT1JUU19ZKTtcblxuLy8gUGFyc2UgdW5pdCB2YWx1ZVxudmFyIG51bWJlckFuZFVuaXQgPSAvXihbKy1dPyhcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8pKFthLXolXSopJC9pOyAvLyBQYXJzZSBoZXggdmFsdWVcblxudmFyIGhleCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2k7IC8vIFBhcnNlIHJnYiB2YWx1ZVxuXG52YXIgcmdiID0gL3JnYlxcKChcXGQrKSwoXFxkKyksKFxcZCspXFwpLzsgLy8gUGFyc2UgcmVmZXJlbmNlIGlkXG5cbnZhciByZWZlcmVuY2UgPSAvKCNbYS16MC05XFwtX10rKS9pOyAvLyBzcGxpdHMgYSB0cmFuc2Zvcm1hdGlvbiBjaGFpblxuXG52YXIgdHJhbnNmb3JtcyA9IC9cXClcXHMqLD9cXHMqLzsgLy8gV2hpdGVzcGFjZVxuXG52YXIgd2hpdGVzcGFjZSQxID0gL1xccy9nOyAvLyBUZXN0IGhleCB2YWx1ZVxuXG52YXIgaXNIZXggPSAvXiNbYS1mMC05XXszLDZ9JC9pOyAvLyBUZXN0IHJnYiB2YWx1ZVxuXG52YXIgaXNSZ2IgPSAvXnJnYlxcKC87IC8vIFRlc3QgY3NzIGRlY2xhcmF0aW9uXG5cbnZhciBpc0NzcyA9IC9bXjpdKzpbXjtdKzs/LzsgLy8gVGVzdCBmb3IgYmxhbmsgc3RyaW5nXG5cbnZhciBpc0JsYW5rID0gL14oXFxzKyk/JC87IC8vIFRlc3QgZm9yIG51bWVyaWMgc3RyaW5nXG5cbnZhciBpc051bWJlciA9IC9eWystXT8oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pOyAvLyBUZXN0IGZvciBwZXJjZW50IHZhbHVlXG5cbnZhciBpc1BlcmNlbnQgPSAvXi0/W1xcZC5dKyUkLzsgLy8gVGVzdCBmb3IgaW1hZ2UgdXJsXG5cbnZhciBpc0ltYWdlID0gL1xcLihqcGd8anBlZ3xwbmd8Z2lmfHN2ZykoXFw/W149XSsuKik/L2k7IC8vIHNwbGl0IGF0IHdoaXRlc3BhY2UgYW5kIGNvbW1hXG5cbnZhciBkZWxpbWl0ZXIgPSAvW1xccyxdKy87IC8vIFRoZSBmb2xsb3dpbmcgcmVnZXggYXJlIHVzZWQgdG8gcGFyc2UgdGhlIGQgYXR0cmlidXRlIG9mIGEgcGF0aFxuLy8gTWF0Y2hlcyBhbGwgaHlwaGVucyB3aGljaCBhcmUgbm90IGFmdGVyIGFuIGV4cG9uZW50XG5cbnZhciBoeXBoZW4gPSAvKFteZV0pLS9naTsgLy8gUmVwbGFjZXMgYW5kIHRlc3RzIGZvciBhbGwgcGF0aCBsZXR0ZXJzXG5cbnZhciBwYXRoTGV0dGVycyA9IC9bTUxIVkNTUVRBWl0vZ2k7IC8vIHllcyB3ZSBuZWVkIHRoaXMgb25lLCB0b29cblxudmFyIGlzUGF0aExldHRlciA9IC9bTUxIVkNTUVRBWl0vaTsgLy8gbWF0Y2hlcyAwLjE1NC4yMy40NVxuXG52YXIgbnVtYmVyc1dpdGhEb3RzID0gLygoXFxkP1xcLlxcZCsoPzplWystXT9cXGQrKT8pKCg/OlxcLlxcZCsoPzplWystXT9cXGQrKT8pKykpKy9naTsgLy8gbWF0Y2hlcyAuXG5cbnZhciBkb3RzID0gL1xcLi9nO1xuXG52YXIgcmVnZXggPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdG51bWJlckFuZFVuaXQ6IG51bWJlckFuZFVuaXQsXG5cdGhleDogaGV4LFxuXHRyZ2I6IHJnYixcblx0cmVmZXJlbmNlOiByZWZlcmVuY2UsXG5cdHRyYW5zZm9ybXM6IHRyYW5zZm9ybXMsXG5cdHdoaXRlc3BhY2U6IHdoaXRlc3BhY2UkMSxcblx0aXNIZXg6IGlzSGV4LFxuXHRpc1JnYjogaXNSZ2IsXG5cdGlzQ3NzOiBpc0Nzcyxcblx0aXNCbGFuazogaXNCbGFuayxcblx0aXNOdW1iZXI6IGlzTnVtYmVyLFxuXHRpc1BlcmNlbnQ6IGlzUGVyY2VudCxcblx0aXNJbWFnZTogaXNJbWFnZSxcblx0ZGVsaW1pdGVyOiBkZWxpbWl0ZXIsXG5cdGh5cGhlbjogaHlwaGVuLFxuXHRwYXRoTGV0dGVyczogcGF0aExldHRlcnMsXG5cdGlzUGF0aExldHRlcjogaXNQYXRoTGV0dGVyLFxuXHRudW1iZXJzV2l0aERvdHM6IG51bWJlcnNXaXRoRG90cyxcblx0ZG90czogZG90c1xufSk7XG5cbmZ1bmN0aW9uIGNsYXNzZXMoKSB7XG4gIHZhciBhdHRyID0gdGhpcy5hdHRyKCdjbGFzcycpO1xuICByZXR1cm4gYXR0ciA9PSBudWxsID8gW10gOiBhdHRyLnRyaW0oKS5zcGxpdChkZWxpbWl0ZXIpO1xufSAvLyBSZXR1cm4gdHJ1ZSBpZiBjbGFzcyBleGlzdHMgb24gdGhlIG5vZGUsIGZhbHNlIG90aGVyd2lzZVxuXG5mdW5jdGlvbiBoYXNDbGFzcyhuYW1lKSB7XG4gIHJldHVybiB0aGlzLmNsYXNzZXMoKS5pbmRleE9mKG5hbWUpICE9PSAtMTtcbn0gLy8gQWRkIGNsYXNzIHRvIHRoZSBub2RlXG5cbmZ1bmN0aW9uIGFkZENsYXNzKG5hbWUpIHtcbiAgaWYgKCF0aGlzLmhhc0NsYXNzKG5hbWUpKSB7XG4gICAgdmFyIGFycmF5ID0gdGhpcy5jbGFzc2VzKCk7XG4gICAgYXJyYXkucHVzaChuYW1lKTtcbiAgICB0aGlzLmF0dHIoJ2NsYXNzJywgYXJyYXkuam9pbignICcpKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBSZW1vdmUgY2xhc3MgZnJvbSB0aGUgbm9kZVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhuYW1lKSB7XG4gIGlmICh0aGlzLmhhc0NsYXNzKG5hbWUpKSB7XG4gICAgdGhpcy5hdHRyKCdjbGFzcycsIHRoaXMuY2xhc3NlcygpLmZpbHRlcihmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgIT09IG5hbWU7XG4gICAgfSkuam9pbignICcpKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBUb2dnbGUgdGhlIHByZXNlbmNlIG9mIGEgY2xhc3Mgb24gdGhlIG5vZGVcblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MobmFtZSkge1xuICByZXR1cm4gdGhpcy5oYXNDbGFzcyhuYW1lKSA/IHRoaXMucmVtb3ZlQ2xhc3MobmFtZSkgOiB0aGlzLmFkZENsYXNzKG5hbWUpO1xufVxucmVnaXN0ZXJNZXRob2RzKCdEb20nLCB7XG4gIGNsYXNzZXM6IGNsYXNzZXMsXG4gIGhhc0NsYXNzOiBoYXNDbGFzcyxcbiAgYWRkQ2xhc3M6IGFkZENsYXNzLFxuICByZW1vdmVDbGFzczogcmVtb3ZlQ2xhc3MsXG4gIHRvZ2dsZUNsYXNzOiB0b2dnbGVDbGFzc1xufSk7XG5cbnZhciAkZm9yRWFjaCQxID0gYXJyYXlJdGVyYXRpb24uZm9yRWFjaDtcblxuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbnZhciBhcnJheUZvckVhY2ggPSBzbG9wcHlBcnJheU1ldGhvZCgnZm9yRWFjaCcpID8gZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICByZXR1cm4gJGZvckVhY2gkMSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG59IDogW10uZm9yRWFjaDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBbXS5mb3JFYWNoICE9IGFycmF5Rm9yRWFjaCB9LCB7XG4gIGZvckVhY2g6IGFycmF5Rm9yRWFjaFxufSk7XG5cbmZvciAodmFyIENPTExFQ1RJT05fTkFNRSQxIGluIGRvbUl0ZXJhYmxlcykge1xuICB2YXIgQ29sbGVjdGlvbiQxID0gZ2xvYmFsXzFbQ09MTEVDVElPTl9OQU1FJDFdO1xuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSQxID0gQ29sbGVjdGlvbiQxICYmIENvbGxlY3Rpb24kMS5wcm90b3R5cGU7XG4gIC8vIHNvbWUgQ2hyb21lIHZlcnNpb25zIGhhdmUgbm9uLWNvbmZpZ3VyYWJsZSBtZXRob2RzIG9uIERPTVRva2VuTGlzdFxuICBpZiAoQ29sbGVjdGlvblByb3RvdHlwZSQxICYmIENvbGxlY3Rpb25Qcm90b3R5cGUkMS5mb3JFYWNoICE9PSBhcnJheUZvckVhY2gpIHRyeSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KENvbGxlY3Rpb25Qcm90b3R5cGUkMSwgJ2ZvckVhY2gnLCBhcnJheUZvckVhY2gpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIENvbGxlY3Rpb25Qcm90b3R5cGUkMS5mb3JFYWNoID0gYXJyYXlGb3JFYWNoO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNzcyhzdHlsZSwgdmFsKSB7XG4gIHZhciByZXQgPSB7fTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGdldCBmdWxsIHN0eWxlIGFzIG9iamVjdFxuICAgIHRoaXMubm9kZS5zdHlsZS5jc3NUZXh0LnNwbGl0KC9cXHMqO1xccyovKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgICByZXR1cm4gISFlbC5sZW5ndGg7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciB0ID0gZWwuc3BsaXQoL1xccyo6XFxzKi8pO1xuICAgICAgcmV0W3RbMF1dID0gdFsxXTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgLy8gZ2V0IHN0eWxlIHByb3BlcnRpZXMgaW4gdGhlIGFycmF5XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGUpKSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gc3R5bGVbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICB2YXIgY2FzZWQgPSBjYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgcmV0W2Nhc2VkXSA9IHRoaXMubm9kZS5zdHlsZVtjYXNlZF07XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybiAhPSBudWxsKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSAvLyBnZXQgc3R5bGUgZm9yIHByb3BlcnR5XG5cblxuICAgIGlmICh0eXBlb2Ygc3R5bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlLnN0eWxlW2NhbWVsQ2FzZShzdHlsZSldO1xuICAgIH0gLy8gc2V0IHN0eWxlcyBpbiBvYmplY3RcblxuXG4gICAgaWYgKF90eXBlb2Yoc3R5bGUpID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yICh2YXIgX25hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgLy8gc2V0IGVtcHR5IHN0cmluZyBpZiBudWxsL3VuZGVmaW5lZC8nJyB3YXMgZ2l2ZW5cbiAgICAgICAgdGhpcy5ub2RlLnN0eWxlW2NhbWVsQ2FzZShfbmFtZSldID0gc3R5bGVbX25hbWVdID09IG51bGwgfHwgaXNCbGFuay50ZXN0KHN0eWxlW19uYW1lXSkgPyAnJyA6IHN0eWxlW19uYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gc2V0IHN0eWxlIGZvciBwcm9wZXJ0eVxuXG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICB0aGlzLm5vZGUuc3R5bGVbY2FtZWxDYXNlKHN0eWxlKV0gPSB2YWwgPT0gbnVsbCB8fCBpc0JsYW5rLnRlc3QodmFsKSA/ICcnIDogdmFsO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59IC8vIFNob3cgZWxlbWVudFxuXG5mdW5jdGlvbiBzaG93KCkge1xuICByZXR1cm4gdGhpcy5jc3MoJ2Rpc3BsYXknLCAnJyk7XG59IC8vIEhpZGUgZWxlbWVudFxuXG5mdW5jdGlvbiBoaWRlKCkge1xuICByZXR1cm4gdGhpcy5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xufSAvLyBJcyBlbGVtZW50IHZpc2libGU/XG5cbmZ1bmN0aW9uIHZpc2libGUoKSB7XG4gIHJldHVybiB0aGlzLmNzcygnZGlzcGxheScpICE9PSAnbm9uZSc7XG59XG5yZWdpc3Rlck1ldGhvZHMoJ0RvbScsIHtcbiAgY3NzOiBjc3MsXG4gIHNob3c6IHNob3csXG4gIGhpZGU6IGhpZGUsXG4gIHZpc2libGU6IHZpc2libGVcbn0pO1xuXG5mdW5jdGlvbiBkYXRhJDEoYSwgdiwgcikge1xuICBpZiAoX3R5cGVvZihhKSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHYgaW4gYSkge1xuICAgICAgdGhpcy5kYXRhKHYsIGFbdl0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmF0dHIoJ2RhdGEtJyArIGEpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdkYXRhLScgKyBhKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hdHRyKCdkYXRhLScgKyBhLCB2ID09PSBudWxsID8gbnVsbCA6IHIgPT09IHRydWUgfHwgdHlwZW9mIHYgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2ID09PSAnbnVtYmVyJyA/IHYgOiBKU09OLnN0cmluZ2lmeSh2KSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbnJlZ2lzdGVyTWV0aG9kcygnRG9tJywge1xuICBkYXRhOiBkYXRhJDFcbn0pO1xuXG5mdW5jdGlvbiByZW1lbWJlcihrLCB2KSB7XG4gIC8vIHJlbWVtYmVyIGV2ZXJ5IGl0ZW0gaW4gYW4gb2JqZWN0IGluZGl2aWR1YWxseVxuICBpZiAoX3R5cGVvZihhcmd1bWVudHNbMF0pID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBrKSB7XG4gICAgICB0aGlzLnJlbWVtYmVyKGtleSwga1trZXldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIHJldHJpZXZlIG1lbW9yeVxuICAgIHJldHVybiB0aGlzLm1lbW9yeSgpW2tdO1xuICB9IGVsc2Uge1xuICAgIC8vIHN0b3JlIG1lbW9yeVxuICAgIHRoaXMubWVtb3J5KClba10gPSB2O1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59IC8vIEVyYXNlIGEgZ2l2ZW4gbWVtb3J5XG5cbmZ1bmN0aW9uIGZvcmdldCgpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9tZW1vcnkgPSB7fTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBkZWxldGUgdGhpcy5tZW1vcnkoKVthcmd1bWVudHNbaV1dO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBUaGlzIHRyaWdnZXJzIGNyZWF0aW9uIG9mIGEgbmV3IGhpZGRlbiBjbGFzcyB3aGljaCBpcyBub3QgcGVyZm9ybWFudFxuLy8gSG93ZXZlciwgdGhpcyBmdW5jdGlvbiBpcyBub3QgcmFyZWx5IHVzZWQgc28gaXQgd2lsbCBub3QgaGFwcGVuIGZyZXF1ZW50bHlcbi8vIFJldHVybiBsb2NhbCBtZW1vcnkgb2JqZWN0XG5cbmZ1bmN0aW9uIG1lbW9yeSgpIHtcbiAgcmV0dXJuIHRoaXMuX21lbW9yeSA9IHRoaXMuX21lbW9yeSB8fCB7fTtcbn1cbnJlZ2lzdGVyTWV0aG9kcygnRG9tJywge1xuICByZW1lbWJlcjogcmVtZW1iZXIsXG4gIGZvcmdldDogZm9yZ2V0LFxuICBtZW1vcnk6IG1lbW9yeVxufSk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyByZWR1Y2UsIHJlZHVjZVJpZ2h0IH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QkNCA9IGZ1bmN0aW9uIChJU19SSUdIVCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c0xlbmd0aCwgbWVtbykge1xuICAgIGFGdW5jdGlvbiQxKGNhbGxiYWNrZm4pO1xuICAgIHZhciBPID0gdG9PYmplY3QodGhhdCk7XG4gICAgdmFyIHNlbGYgPSBpbmRleGVkT2JqZWN0KE8pO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gSVNfUklHSFQgPyBsZW5ndGggLSAxIDogMDtcbiAgICB2YXIgaSA9IElTX1JJR0hUID8gLTEgOiAxO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPCAyKSB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgICAgbWVtbyA9IHNlbGZbaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ICs9IGk7XG4gICAgICBpZiAoSVNfUklHSFQgPyBpbmRleCA8IDAgOiBsZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoO0lTX1JJR0hUID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKSBpZiAoaW5kZXggaW4gc2VsZikge1xuICAgICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgc2VsZltpbmRleF0sIGluZGV4LCBPKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59O1xuXG52YXIgYXJyYXlSZWR1Y2UgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJlZHVjZVxuICBsZWZ0OiBjcmVhdGVNZXRob2QkNChmYWxzZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUucmVkdWNlcmlnaHRcbiAgcmlnaHQ6IGNyZWF0ZU1ldGhvZCQ0KHRydWUpXG59O1xuXG52YXIgJHJlZHVjZSA9IGFycmF5UmVkdWNlLmxlZnQ7XG5cblxuLy8gYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJlZHVjZVxuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogc2xvcHB5QXJyYXlNZXRob2QoJ3JlZHVjZScpIH0sIHtcbiAgcmVkdWNlOiBmdW5jdGlvbiByZWR1Y2UoY2FsbGJhY2tmbiAvKiAsIGluaXRpYWxWYWx1ZSAqLykge1xuICAgIHJldHVybiAkcmVkdWNlKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnZhciBsaXN0ZW5lcklkID0gMDtcbnZhciB3aW5kb3dFdmVudHMgPSB7fTtcblxuZnVuY3Rpb24gZ2V0RXZlbnRzKGluc3RhbmNlKSB7XG4gIHZhciBuID0gaW5zdGFuY2UuZ2V0RXZlbnRIb2xkZXIoKTsgLy8gV2UgZG9udCB3YW50IHRvIHNhdmUgZXZlbnRzIGluIGdsb2JhbCBzcGFjZVxuXG4gIGlmIChuID09PSBnbG9iYWxzLndpbmRvdykgbiA9IHdpbmRvd0V2ZW50cztcbiAgaWYgKCFuLmV2ZW50cykgbi5ldmVudHMgPSB7fTtcbiAgcmV0dXJuIG4uZXZlbnRzO1xufVxuXG5mdW5jdGlvbiBnZXRFdmVudFRhcmdldChpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuZ2V0RXZlbnRUYXJnZXQoKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJFdmVudHMoaW5zdGFuY2UpIHtcbiAgdmFyIG4gPSBpbnN0YW5jZS5nZXRFdmVudEhvbGRlcigpO1xuICBpZiAobi5ldmVudHMpIG4uZXZlbnRzID0ge307XG59IC8vIEFkZCBldmVudCBiaW5kZXIgaW4gdGhlIFNWRyBuYW1lc3BhY2VcblxuXG5mdW5jdGlvbiBvbihub2RlLCBldmVudHMsIGxpc3RlbmVyLCBiaW5kaW5nLCBvcHRpb25zKSB7XG4gIHZhciBsID0gbGlzdGVuZXIuYmluZChiaW5kaW5nIHx8IG5vZGUpO1xuICB2YXIgaW5zdGFuY2UgPSBtYWtlSW5zdGFuY2Uobm9kZSk7XG4gIHZhciBiYWcgPSBnZXRFdmVudHMoaW5zdGFuY2UpO1xuICB2YXIgbiA9IGdldEV2ZW50VGFyZ2V0KGluc3RhbmNlKTsgLy8gZXZlbnRzIGNhbiBiZSBhbiBhcnJheSBvZiBldmVudHMgb3IgYSBzdHJpbmcgb2YgZXZlbnRzXG5cbiAgZXZlbnRzID0gQXJyYXkuaXNBcnJheShldmVudHMpID8gZXZlbnRzIDogZXZlbnRzLnNwbGl0KGRlbGltaXRlcik7IC8vIGFkZCBpZCB0byBsaXN0ZW5lclxuXG4gIGlmICghbGlzdGVuZXIuX3N2Z2pzTGlzdGVuZXJJZCkge1xuICAgIGxpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWQgPSArK2xpc3RlbmVySWQ7XG4gIH1cblxuICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZXYgPSBldmVudC5zcGxpdCgnLicpWzBdO1xuICAgIHZhciBucyA9IGV2ZW50LnNwbGl0KCcuJylbMV0gfHwgJyonOyAvLyBlbnN1cmUgdmFsaWQgb2JqZWN0XG5cbiAgICBiYWdbZXZdID0gYmFnW2V2XSB8fCB7fTtcbiAgICBiYWdbZXZdW25zXSA9IGJhZ1tldl1bbnNdIHx8IHt9OyAvLyByZWZlcmVuY2UgbGlzdGVuZXJcblxuICAgIGJhZ1tldl1bbnNdW2xpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWRdID0gbDsgLy8gYWRkIGxpc3RlbmVyXG5cbiAgICBuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGwsIG9wdGlvbnMgfHwgZmFsc2UpO1xuICB9KTtcbn0gLy8gQWRkIGV2ZW50IHVuYmluZGVyIGluIHRoZSBTVkcgbmFtZXNwYWNlXG5cbmZ1bmN0aW9uIG9mZihub2RlLCBldmVudHMsIGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHZhciBpbnN0YW5jZSA9IG1ha2VJbnN0YW5jZShub2RlKTtcbiAgdmFyIGJhZyA9IGdldEV2ZW50cyhpbnN0YW5jZSk7XG4gIHZhciBuID0gZ2V0RXZlbnRUYXJnZXQoaW5zdGFuY2UpOyAvLyBsaXN0ZW5lciBjYW4gYmUgYSBmdW5jdGlvbiBvciBhIG51bWJlclxuXG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsaXN0ZW5lciA9IGxpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWQ7XG4gICAgaWYgKCFsaXN0ZW5lcikgcmV0dXJuO1xuICB9IC8vIGV2ZW50cyBjYW4gYmUgYW4gYXJyYXkgb2YgZXZlbnRzIG9yIGEgc3RyaW5nIG9yIHVuZGVmaW5lZFxuXG5cbiAgZXZlbnRzID0gQXJyYXkuaXNBcnJheShldmVudHMpID8gZXZlbnRzIDogKGV2ZW50cyB8fCAnJykuc3BsaXQoZGVsaW1pdGVyKTtcbiAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ID0gZXZlbnQgJiYgZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICB2YXIgbnMgPSBldmVudCAmJiBldmVudC5zcGxpdCgnLicpWzFdO1xuICAgIHZhciBuYW1lc3BhY2UsIGw7XG5cbiAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lciByZWZlcmVuY2VcbiAgICAgIGlmIChiYWdbZXZdICYmIGJhZ1tldl1bbnMgfHwgJyonXSkge1xuICAgICAgICAvLyByZW1vdmVMaXN0ZW5lclxuICAgICAgICBuLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIGJhZ1tldl1bbnMgfHwgJyonXVtsaXN0ZW5lcl0sIG9wdGlvbnMgfHwgZmFsc2UpO1xuICAgICAgICBkZWxldGUgYmFnW2V2XVtucyB8fCAnKiddW2xpc3RlbmVyXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ICYmIG5zKSB7XG4gICAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgYSBuYW1lc3BhY2VkIGV2ZW50XG4gICAgICBpZiAoYmFnW2V2XSAmJiBiYWdbZXZdW25zXSkge1xuICAgICAgICBmb3IgKGwgaW4gYmFnW2V2XVtuc10pIHtcbiAgICAgICAgICBvZmYobiwgW2V2LCBuc10uam9pbignLicpLCBsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBiYWdbZXZdW25zXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5zKSB7XG4gICAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgYSBzcGVjaWZpYyBuYW1lc3BhY2VcbiAgICAgIGZvciAoZXZlbnQgaW4gYmFnKSB7XG4gICAgICAgIGZvciAobmFtZXNwYWNlIGluIGJhZ1tldmVudF0pIHtcbiAgICAgICAgICBpZiAobnMgPT09IG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgb2ZmKG4sIFtldmVudCwgbnNdLmpvaW4oJy4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldikge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudFxuICAgICAgaWYgKGJhZ1tldl0pIHtcbiAgICAgICAgZm9yIChuYW1lc3BhY2UgaW4gYmFnW2V2XSkge1xuICAgICAgICAgIG9mZihuLCBbZXYsIG5hbWVzcGFjZV0uam9pbignLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBiYWdbZXZdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVycyBvbiBhIGdpdmVuIG5vZGVcbiAgICAgIGZvciAoZXZlbnQgaW4gYmFnKSB7XG4gICAgICAgIG9mZihuLCBldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyRXZlbnRzKGluc3RhbmNlKTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZXZlbnQsIGRhdGEpIHtcbiAgdmFyIG4gPSBnZXRFdmVudFRhcmdldChub2RlKTsgLy8gRGlzcGF0Y2ggZXZlbnRcblxuICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBnbG9iYWxzLndpbmRvdy5FdmVudCkge1xuICAgIG4uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSBuZXcgZ2xvYmFscy53aW5kb3cuQ3VzdG9tRXZlbnQoZXZlbnQsIHtcbiAgICAgIGRldGFpbDogZGF0YSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBuLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG52YXIgSVNfQ09OQ0FUX1NQUkVBREFCTEUgPSB3ZWxsS25vd25TeW1ib2woJ2lzQ29uY2F0U3ByZWFkYWJsZScpO1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFGRkZGRkZGRkZGRkZGO1xudmFyIE1BWElNVU1fQUxMT1dFRF9JTkRFWF9FWENFRURFRCA9ICdNYXhpbXVtIGFsbG93ZWQgaW5kZXggZXhjZWVkZWQnO1xuXG4vLyBXZSBjYW4ndCB1c2UgdGhpcyBmZWF0dXJlIGRldGVjdGlvbiBpbiBWOCBzaW5jZSBpdCBjYXVzZXNcbi8vIGRlb3B0aW1pemF0aW9uIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNjc5XG52YXIgSVNfQ09OQ0FUX1NQUkVBREFCTEVfU1VQUE9SVCA9IHY4VmVyc2lvbiA+PSA1MSB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgYXJyYXkgPSBbXTtcbiAgYXJyYXlbSVNfQ09OQ0FUX1NQUkVBREFCTEVdID0gZmFsc2U7XG4gIHJldHVybiBhcnJheS5jb25jYXQoKVswXSAhPT0gYXJyYXk7XG59KTtcblxudmFyIFNQRUNJRVNfU1VQUE9SVCA9IGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQoJ2NvbmNhdCcpO1xuXG52YXIgaXNDb25jYXRTcHJlYWRhYmxlID0gZnVuY3Rpb24gKE8pIHtcbiAgaWYgKCFpc09iamVjdChPKSkgcmV0dXJuIGZhbHNlO1xuICB2YXIgc3ByZWFkYWJsZSA9IE9bSVNfQ09OQ0FUX1NQUkVBREFCTEVdO1xuICByZXR1cm4gc3ByZWFkYWJsZSAhPT0gdW5kZWZpbmVkID8gISFzcHJlYWRhYmxlIDogaXNBcnJheShPKTtcbn07XG5cbnZhciBGT1JDRUQgPSAhSVNfQ09OQ0FUX1NQUkVBREFCTEVfU1VQUE9SVCB8fCAhU1BFQ0lFU19TVVBQT1JUO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmNvbmNhdGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuY29uY2F0XG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAaXNDb25jYXRTcHJlYWRhYmxlIGFuZCBAQHNwZWNpZXNcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEZPUkNFRCB9LCB7XG4gIGNvbmNhdDogZnVuY3Rpb24gY29uY2F0KGFyZykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgICB2YXIgQSA9IGFycmF5U3BlY2llc0NyZWF0ZShPLCAwKTtcbiAgICB2YXIgbiA9IDA7XG4gICAgdmFyIGksIGssIGxlbmd0aCwgbGVuLCBFO1xuICAgIGZvciAoaSA9IC0xLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEUgPSBpID09PSAtMSA/IE8gOiBhcmd1bWVudHNbaV07XG4gICAgICBpZiAoaXNDb25jYXRTcHJlYWRhYmxlKEUpKSB7XG4gICAgICAgIGxlbiA9IHRvTGVuZ3RoKEUubGVuZ3RoKTtcbiAgICAgICAgaWYgKG4gKyBsZW4gPiBNQVhfU0FGRV9JTlRFR0VSKSB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0lOREVYX0VYQ0VFREVEKTtcbiAgICAgICAgZm9yIChrID0gMDsgayA8IGxlbjsgaysrLCBuKyspIGlmIChrIGluIEUpIGNyZWF0ZVByb3BlcnR5KEEsIG4sIEVba10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG4gPj0gTUFYX1NBRkVfSU5URUdFUikgdGhyb3cgVHlwZUVycm9yKE1BWElNVU1fQUxMT1dFRF9JTkRFWF9FWENFRURFRCk7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KEEsIG4rKywgRSk7XG4gICAgICB9XG4gICAgfVxuICAgIEEubGVuZ3RoID0gbjtcbiAgICByZXR1cm4gQTtcbiAgfVxufSk7XG5cbnZhciAkbWFwID0gYXJyYXlJdGVyYXRpb24ubWFwO1xuXG5cbi8vIGBBcnJheS5wcm90b3R5cGUubWFwYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5tYXBcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBzcGVjaWVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiAhYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnbWFwJykgfSwge1xuICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnZhciBEYXRlUHJvdG90eXBlID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBuYXRpdmVEYXRlVG9TdHJpbmcgPSBEYXRlUHJvdG90eXBlW1RPX1NUUklOR107XG52YXIgZ2V0VGltZSA9IERhdGVQcm90b3R5cGUuZ2V0VGltZTtcblxuLy8gYERhdGUucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWRhdGUucHJvdG90eXBlLnRvc3RyaW5nXG5pZiAobmV3IERhdGUoTmFOKSArICcnICE9IElOVkFMSURfREFURSkge1xuICByZWRlZmluZShEYXRlUHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciB2YWx1ZSA9IGdldFRpbWUuY2FsbCh0aGlzKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IG5hdGl2ZURhdGVUb1N0cmluZy5jYWxsKHRoaXMpIDogSU5WQUxJRF9EQVRFO1xuICB9KTtcbn1cblxudmFyIHRyaW0gPSBzdHJpbmdUcmltLnRyaW07XG5cblxudmFyIG5hdGl2ZVBhcnNlSW50ID0gZ2xvYmFsXzEucGFyc2VJbnQ7XG52YXIgaGV4JDEgPSAvXlsrLV0/MFtYeF0vO1xudmFyIEZPUkNFRCQxID0gbmF0aXZlUGFyc2VJbnQod2hpdGVzcGFjZXMgKyAnMDgnKSAhPT0gOCB8fCBuYXRpdmVQYXJzZUludCh3aGl0ZXNwYWNlcyArICcweDE2JykgIT09IDIyO1xuXG4vLyBgcGFyc2VJbnRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcGFyc2VpbnQtc3RyaW5nLXJhZGl4XG52YXIgX3BhcnNlSW50ID0gRk9SQ0VEJDEgPyBmdW5jdGlvbiBwYXJzZUludChzdHJpbmcsIHJhZGl4KSB7XG4gIHZhciBTID0gdHJpbShTdHJpbmcoc3RyaW5nKSk7XG4gIHJldHVybiBuYXRpdmVQYXJzZUludChTLCAocmFkaXggPj4+IDApIHx8IChoZXgkMS50ZXN0KFMpID8gMTYgOiAxMCkpO1xufSA6IG5hdGl2ZVBhcnNlSW50O1xuXG4vLyBgcGFyc2VJbnRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcGFyc2VpbnQtc3RyaW5nLXJhZGl4XG5fZXhwb3J0KHsgZ2xvYmFsOiB0cnVlLCBmb3JjZWQ6IHBhcnNlSW50ICE9IF9wYXJzZUludCB9LCB7XG4gIHBhcnNlSW50OiBfcGFyc2VJbnRcbn0pO1xuXG52YXIgVE9fU1RSSU5HJDEgPSAndG9TdHJpbmcnO1xudmFyIFJlZ0V4cFByb3RvdHlwZSA9IFJlZ0V4cC5wcm90b3R5cGU7XG52YXIgbmF0aXZlVG9TdHJpbmcgPSBSZWdFeHBQcm90b3R5cGVbVE9fU1RSSU5HJDFdO1xuXG52YXIgTk9UX0dFTkVSSUMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IHJldHVybiBuYXRpdmVUb1N0cmluZy5jYWxsKHsgc291cmNlOiAnYScsIGZsYWdzOiAnYicgfSkgIT0gJy9hL2InOyB9KTtcbi8vIEZGNDQtIFJlZ0V4cCN0b1N0cmluZyBoYXMgYSB3cm9uZyBuYW1lXG52YXIgSU5DT1JSRUNUX05BTUUgPSBuYXRpdmVUb1N0cmluZy5uYW1lICE9IFRPX1NUUklORyQxO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG5pZiAoTk9UX0dFTkVSSUMgfHwgSU5DT1JSRUNUX05BTUUpIHtcbiAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HJDEsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciBSID0gYW5PYmplY3QodGhpcyk7XG4gICAgdmFyIHAgPSBTdHJpbmcoUi5zb3VyY2UpO1xuICAgIHZhciByZiA9IFIuZmxhZ3M7XG4gICAgdmFyIGYgPSBTdHJpbmcocmYgPT09IHVuZGVmaW5lZCAmJiBSIGluc3RhbmNlb2YgUmVnRXhwICYmICEoJ2ZsYWdzJyBpbiBSZWdFeHBQcm90b3R5cGUpID8gcmVnZXhwRmxhZ3MuY2FsbChSKSA6IHJmKTtcbiAgICByZXR1cm4gJy8nICsgcCArICcvJyArIGY7XG4gIH0sIHsgdW5zYWZlOiB0cnVlIH0pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKCEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG59XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIHNpeERpZ2l0SGV4KGhleCkge1xuICByZXR1cm4gaGV4Lmxlbmd0aCA9PT0gNCA/IFsnIycsIGhleC5zdWJzdHJpbmcoMSwgMiksIGhleC5zdWJzdHJpbmcoMSwgMiksIGhleC5zdWJzdHJpbmcoMiwgMyksIGhleC5zdWJzdHJpbmcoMiwgMyksIGhleC5zdWJzdHJpbmcoMywgNCksIGhleC5zdWJzdHJpbmcoMywgNCldLmpvaW4oJycpIDogaGV4O1xufVxuXG5mdW5jdGlvbiBjb21wb25lbnRIZXgoY29tcG9uZW50KSB7XG4gIHZhciBpbnRlZ2VyID0gTWF0aC5yb3VuZChjb21wb25lbnQpO1xuICB2YXIgYm91bmRlZCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgaW50ZWdlcikpO1xuICB2YXIgaGV4ID0gYm91bmRlZC50b1N0cmluZygxNik7XG4gIHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xufVxuXG5mdW5jdGlvbiBpcyhvYmplY3QsIHNwYWNlKSB7XG4gIGZvciAodmFyIGkgPSBzcGFjZS5sZW5ndGg7IGktLTspIHtcbiAgICBpZiAob2JqZWN0W3NwYWNlW2ldXSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGdldFBhcmFtZXRlcnMoYSwgYikge1xuICB2YXIgcGFyYW1zID0gaXMoYSwgJ3JnYicpID8ge1xuICAgIF9hOiBhLnIsXG4gICAgX2I6IGEuZyxcbiAgICBfYzogYS5iLFxuICAgIHNwYWNlOiAncmdiJ1xuICB9IDogaXMoYSwgJ3h5eicpID8ge1xuICAgIF9hOiBhLngsXG4gICAgX2I6IGEueSxcbiAgICBfYzogYS56LFxuICAgIF9kOiAwLFxuICAgIHNwYWNlOiAneHl6J1xuICB9IDogaXMoYSwgJ2hzbCcpID8ge1xuICAgIF9hOiBhLmgsXG4gICAgX2I6IGEucyxcbiAgICBfYzogYS5sLFxuICAgIF9kOiAwLFxuICAgIHNwYWNlOiAnaHNsJ1xuICB9IDogaXMoYSwgJ2xhYicpID8ge1xuICAgIF9hOiBhLmwsXG4gICAgX2I6IGEuYSxcbiAgICBfYzogYS5iLFxuICAgIF9kOiAwLFxuICAgIHNwYWNlOiAnbGFiJ1xuICB9IDogaXMoYSwgJ2xjaCcpID8ge1xuICAgIF9hOiBhLmwsXG4gICAgX2I6IGEuYyxcbiAgICBfYzogYS5oLFxuICAgIF9kOiAwLFxuICAgIHNwYWNlOiAnbGNoJ1xuICB9IDogaXMoYSwgJ2NteWsnKSA/IHtcbiAgICBfYTogYS5jLFxuICAgIF9iOiBhLm0sXG4gICAgX2M6IGEueSxcbiAgICBfZDogYS5rLFxuICAgIHNwYWNlOiAnY215aydcbiAgfSA6IHtcbiAgICBfYTogMCxcbiAgICBfYjogMCxcbiAgICBfYzogMCxcbiAgICBzcGFjZTogJ3JnYidcbiAgfTtcbiAgcGFyYW1zLnNwYWNlID0gYiB8fCBwYXJhbXMuc3BhY2U7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmZ1bmN0aW9uIGNpZVNwYWNlKHNwYWNlKSB7XG4gIGlmIChzcGFjZSA9PT0gJ2xhYicgfHwgc3BhY2UgPT09ICd4eXonIHx8IHNwYWNlID09PSAnbGNoJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBodWVUb1JnYihwLCBxLCB0KSB7XG4gIGlmICh0IDwgMCkgdCArPSAxO1xuICBpZiAodCA+IDEpIHQgLT0gMTtcbiAgaWYgKHQgPCAxIC8gNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gIGlmICh0IDwgMSAvIDIpIHJldHVybiBxO1xuICBpZiAodCA8IDIgLyAzKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XG4gIHJldHVybiBwO1xufVxuXG52YXIgQ29sb3IgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb2xvcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29sb3IpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29sb3IsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHZhciBhID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgICAgdmFyIGIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gICAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgICAgIHZhciBkID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuICAgICAgdmFyIHNwYWNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiAncmdiJztcbiAgICAgIC8vIFRoaXMgY2F0Y2hlcyB0aGUgY2FzZSB3aGVuIGEgZmFsc3kgdmFsdWUgaXMgcGFzc2VkIGxpa2UgJydcbiAgICAgIGEgPSAhYSA/IDAgOiBhOyAvLyBSZXNldCBhbGwgdmFsdWVzIGluIGNhc2UgdGhlIGluaXQgZnVuY3Rpb24gaXMgcmVydW4gd2l0aCBuZXcgY29sb3Igc3BhY2VcblxuICAgICAgaWYgKHRoaXMuc3BhY2UpIHtcbiAgICAgICAgZm9yICh2YXIgY29tcG9uZW50IGluIHRoaXMuc3BhY2UpIHtcbiAgICAgICAgICBkZWxldGUgdGhpc1t0aGlzLnNwYWNlW2NvbXBvbmVudF1dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gQWxsb3cgZm9yIHRoZSBjYXNlIHRoYXQgd2UgZG9uJ3QgbmVlZCBkLi4uXG4gICAgICAgIHNwYWNlID0gdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZCA6IHNwYWNlO1xuICAgICAgICBkID0gdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gMCA6IGQ7IC8vIEFzc2lnbiB0aGUgdmFsdWVzIHN0cmFpZ2h0IHRvIHRoZSBjb2xvclxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgICAgIF9hOiBhLFxuICAgICAgICAgIF9iOiBiLFxuICAgICAgICAgIF9jOiBjLFxuICAgICAgICAgIF9kOiBkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZVxuICAgICAgICB9KTsgLy8gSWYgdGhlIHVzZXIgZ2F2ZSB1cyBhbiBhcnJheSwgbWFrZSB0aGUgY29sb3IgZnJvbSBpdFxuICAgICAgfSBlbHNlIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdGhpcy5zcGFjZSA9IGIgfHwgKHR5cGVvZiBhWzNdID09PSAnc3RyaW5nJyA/IGFbM10gOiBhWzRdKSB8fCAncmdiJztcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICAgICAgX2E6IGFbMF0sXG4gICAgICAgICAgX2I6IGFbMV0sXG4gICAgICAgICAgX2M6IGFbMl0sXG4gICAgICAgICAgX2Q6IGFbM10gfHwgMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAvLyBTZXQgdGhlIG9iamVjdCB1cCBhbmQgYXNzaWduIGl0cyB2YWx1ZXMgZGlyZWN0bHlcbiAgICAgICAgdmFyIHZhbHVlcyA9IGdldFBhcmFtZXRlcnMoYSwgYik7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgdmFsdWVzKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChpc1JnYi50ZXN0KGEpKSB7XG4gICAgICAgICAgdmFyIG5vV2hpdGVzcGFjZSA9IGEucmVwbGFjZSh3aGl0ZXNwYWNlJDEsICcnKTtcblxuICAgICAgICAgIHZhciBfcmdiJGV4ZWMkc2xpY2UkbWFwID0gcmdiLmV4ZWMobm9XaGl0ZXNwYWNlKS5zbGljZSgxLCA0KS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2KTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgX3JnYiRleGVjJHNsaWNlJG1hcDIgPSBfc2xpY2VkVG9BcnJheShfcmdiJGV4ZWMkc2xpY2UkbWFwLCAzKSxcbiAgICAgICAgICAgICAgX2EyID0gX3JnYiRleGVjJHNsaWNlJG1hcDJbMF0sXG4gICAgICAgICAgICAgIF9iMiA9IF9yZ2IkZXhlYyRzbGljZSRtYXAyWzFdLFxuICAgICAgICAgICAgICBfYzIgPSBfcmdiJGV4ZWMkc2xpY2UkbWFwMlsyXTtcblxuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgICAgICAgX2E6IF9hMixcbiAgICAgICAgICAgIF9iOiBfYjIsXG4gICAgICAgICAgICBfYzogX2MyLFxuICAgICAgICAgICAgX2Q6IDAsXG4gICAgICAgICAgICBzcGFjZTogJ3JnYidcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0hleC50ZXN0KGEpKSB7XG4gICAgICAgICAgdmFyIGhleFBhcnNlID0gZnVuY3Rpb24gaGV4UGFyc2Uodikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHYsIDE2KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIF9oZXgkZXhlYyRtYXAgPSBoZXguZXhlYyhzaXhEaWdpdEhleChhKSkubWFwKGhleFBhcnNlKSxcbiAgICAgICAgICAgICAgX2hleCRleGVjJG1hcDIgPSBfc2xpY2VkVG9BcnJheShfaGV4JGV4ZWMkbWFwLCA0KSxcbiAgICAgICAgICAgICAgX2EzID0gX2hleCRleGVjJG1hcDJbMV0sXG4gICAgICAgICAgICAgIF9iMyA9IF9oZXgkZXhlYyRtYXAyWzJdLFxuICAgICAgICAgICAgICBfYzMgPSBfaGV4JGV4ZWMkbWFwMlszXTtcblxuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgICAgICAgX2E6IF9hMyxcbiAgICAgICAgICAgIF9iOiBfYjMsXG4gICAgICAgICAgICBfYzogX2MzLFxuICAgICAgICAgICAgX2Q6IDAsXG4gICAgICAgICAgICBzcGFjZTogJ3JnYidcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHRocm93IEVycm9yKCdVbnN1cHBvcnRlZCBzdHJpbmcgZm9ybWF0LCBjYW5cXCd0IGNvbnN0cnVjdCBDb2xvcicpO1xuICAgICAgfSAvLyBOb3cgYWRkIHRoZSBjb21wb25lbnRzIGFzIGEgY29udmVuaWVuY2VcblxuXG4gICAgICB2YXIgX2EgPSB0aGlzLl9hLFxuICAgICAgICAgIF9iID0gdGhpcy5fYixcbiAgICAgICAgICBfYyA9IHRoaXMuX2MsXG4gICAgICAgICAgX2QgPSB0aGlzLl9kO1xuICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLnNwYWNlID09PSAncmdiJyA/IHtcbiAgICAgICAgcjogX2EsXG4gICAgICAgIGc6IF9iLFxuICAgICAgICBiOiBfY1xuICAgICAgfSA6IHRoaXMuc3BhY2UgPT09ICd4eXonID8ge1xuICAgICAgICB4OiBfYSxcbiAgICAgICAgeTogX2IsXG4gICAgICAgIHo6IF9jXG4gICAgICB9IDogdGhpcy5zcGFjZSA9PT0gJ2hzbCcgPyB7XG4gICAgICAgIGg6IF9hLFxuICAgICAgICBzOiBfYixcbiAgICAgICAgbDogX2NcbiAgICAgIH0gOiB0aGlzLnNwYWNlID09PSAnbGFiJyA/IHtcbiAgICAgICAgbDogX2EsXG4gICAgICAgIGE6IF9iLFxuICAgICAgICBiOiBfY1xuICAgICAgfSA6IHRoaXMuc3BhY2UgPT09ICdsY2gnID8ge1xuICAgICAgICBsOiBfYSxcbiAgICAgICAgYzogX2IsXG4gICAgICAgIGg6IF9jXG4gICAgICB9IDogdGhpcy5zcGFjZSA9PT0gJ2NteWsnID8ge1xuICAgICAgICBjOiBfYSxcbiAgICAgICAgbTogX2IsXG4gICAgICAgIHk6IF9jLFxuICAgICAgICBrOiBfZFxuICAgICAgfSA6IHt9O1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBjb21wb25lbnRzKTtcbiAgICB9XG4gICAgLypcclxuICAgIENvbnZlcnNpb24gTWV0aG9kc1xyXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJnYlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZ2IoKSB7XG4gICAgICBpZiAodGhpcy5zcGFjZSA9PT0gJ3JnYicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKGNpZVNwYWNlKHRoaXMuc3BhY2UpKSB7XG4gICAgICAgIC8vIENvbnZlcnQgdG8gdGhlIHh5eiBjb2xvciBzcGFjZVxuICAgICAgICB2YXIgeCA9IHRoaXMueCxcbiAgICAgICAgICAgIHkgPSB0aGlzLnksXG4gICAgICAgICAgICB6ID0gdGhpcy56O1xuXG4gICAgICAgIGlmICh0aGlzLnNwYWNlID09PSAnbGFiJyB8fCB0aGlzLnNwYWNlID09PSAnbGNoJykge1xuICAgICAgICAgIC8vIEdldCB0aGUgdmFsdWVzIGluIHRoZSBsYWIgc3BhY2VcbiAgICAgICAgICB2YXIgbCA9IHRoaXMubCxcbiAgICAgICAgICAgICAgYSA9IHRoaXMuYSxcbiAgICAgICAgICAgICAgX2I0ID0gdGhpcy5iO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc3BhY2UgPT09ICdsY2gnKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuYyxcbiAgICAgICAgICAgICAgICBoID0gdGhpcy5oO1xuICAgICAgICAgICAgdmFyIGRUb1IgPSBNYXRoLlBJIC8gMTgwO1xuICAgICAgICAgICAgYSA9IGMgKiBNYXRoLmNvcyhkVG9SICogaCk7XG4gICAgICAgICAgICBfYjQgPSBjICogTWF0aC5zaW4oZFRvUiAqIGgpO1xuICAgICAgICAgIH0gLy8gVW5kbyB0aGUgbm9ubGluZWFyIGZ1bmN0aW9uXG5cblxuICAgICAgICAgIHZhciB5TCA9IChsICsgMTYpIC8gMTE2O1xuICAgICAgICAgIHZhciB4TCA9IGEgLyA1MDAgKyB5TDtcbiAgICAgICAgICB2YXIgekwgPSB5TCAtIF9iNCAvIDIwMDsgLy8gR2V0IHRoZSB4eXogdmFsdWVzXG5cbiAgICAgICAgICB2YXIgY3QgPSAxNiAvIDExNjtcbiAgICAgICAgICB2YXIgbXggPSAwLjAwODg1NjtcbiAgICAgICAgICB2YXIgbm0gPSA3Ljc4NztcbiAgICAgICAgICB4ID0gMC45NTA0NyAqIChNYXRoLnBvdyh4TCwgMykgPiBteCA/IE1hdGgucG93KHhMLCAzKSA6ICh4TCAtIGN0KSAvIG5tKTtcbiAgICAgICAgICB5ID0gMS4wMDAwMCAqIChNYXRoLnBvdyh5TCwgMykgPiBteCA/IE1hdGgucG93KHlMLCAzKSA6ICh5TCAtIGN0KSAvIG5tKTtcbiAgICAgICAgICB6ID0gMS4wODg4MyAqIChNYXRoLnBvdyh6TCwgMykgPiBteCA/IE1hdGgucG93KHpMLCAzKSA6ICh6TCAtIGN0KSAvIG5tKTtcbiAgICAgICAgfSAvLyBDb252ZXJ0IHh5eiB0byB1bmJvdW5kZWQgcmdiIHZhbHVlc1xuXG5cbiAgICAgICAgdmFyIHJVID0geCAqIDMuMjQwNiArIHkgKiAtMS41MzcyICsgeiAqIC0wLjQ5ODY7XG4gICAgICAgIHZhciBnVSA9IHggKiAtMC45Njg5ICsgeSAqIDEuODc1OCArIHogKiAwLjA0MTU7XG4gICAgICAgIHZhciBiVSA9IHggKiAwLjA1NTcgKyB5ICogLTAuMjA0MCArIHogKiAxLjA1NzA7IC8vIENvbnZlcnQgdGhlIHZhbHVlcyB0byB0cnVlIHJnYiB2YWx1ZXNcblxuICAgICAgICB2YXIgcG93ID0gTWF0aC5wb3c7XG4gICAgICAgIHZhciBiZCA9IDAuMDAzMTMwODtcbiAgICAgICAgdmFyIHIgPSByVSA+IGJkID8gMS4wNTUgKiBwb3coclUsIDEgLyAyLjQpIC0gMC4wNTUgOiAxMi45MiAqIHJVO1xuICAgICAgICB2YXIgZyA9IGdVID4gYmQgPyAxLjA1NSAqIHBvdyhnVSwgMSAvIDIuNCkgLSAwLjA1NSA6IDEyLjkyICogZ1U7XG4gICAgICAgIHZhciBiID0gYlUgPiBiZCA/IDEuMDU1ICogcG93KGJVLCAxIC8gMi40KSAtIDAuMDU1IDogMTIuOTIgKiBiVTsgLy8gTWFrZSBhbmQgcmV0dXJuIHRoZSBjb2xvclxuXG4gICAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcigyNTUgKiByLCAyNTUgKiBnLCAyNTUgKiBiKTtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNwYWNlID09PSAnaHNsJykge1xuICAgICAgICAvLyBodHRwczovL2Jncmlucy5naXRodWIuaW8vVGlueUNvbG9yL2RvY3MvdGlueWNvbG9yLmh0bWxcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGhzbCB2YWx1ZXNcbiAgICAgICAgdmFyIF9oID0gdGhpcy5oLFxuICAgICAgICAgICAgcyA9IHRoaXMucyxcbiAgICAgICAgICAgIF9sID0gdGhpcy5sO1xuICAgICAgICBfaCAvPSAzNjA7XG4gICAgICAgIHMgLz0gMTAwO1xuICAgICAgICBfbCAvPSAxMDA7IC8vIElmIHdlIGFyZSBncmV5LCB0aGVuIGp1c3QgbWFrZSB0aGUgY29sb3IgZGlyZWN0bHlcblxuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgIF9sICo9IDI1NTtcblxuICAgICAgICAgIHZhciBfY29sb3IyID0gbmV3IENvbG9yKF9sLCBfbCwgX2wpO1xuXG4gICAgICAgICAgcmV0dXJuIF9jb2xvcjI7XG4gICAgICAgIH0gLy8gVE9ETyBJIGhhdmUgbm8gaWRlYSB3aGF0IHRoaXMgZG9lcyA6RCBJZiB5b3UgZmlndXJlIGl0IG91dCwgdGVsbCBtZSFcblxuXG4gICAgICAgIHZhciBxID0gX2wgPCAwLjUgPyBfbCAqICgxICsgcykgOiBfbCArIHMgLSBfbCAqIHM7XG4gICAgICAgIHZhciBwID0gMiAqIF9sIC0gcTsgLy8gR2V0IHRoZSByZ2IgdmFsdWVzXG5cbiAgICAgICAgdmFyIF9yID0gMjU1ICogaHVlVG9SZ2IocCwgcSwgX2ggKyAxIC8gMyk7XG5cbiAgICAgICAgdmFyIF9nID0gMjU1ICogaHVlVG9SZ2IocCwgcSwgX2gpO1xuXG4gICAgICAgIHZhciBfYjUgPSAyNTUgKiBodWVUb1JnYihwLCBxLCBfaCAtIDEgLyAzKTsgLy8gTWFrZSBhIG5ldyBjb2xvclxuXG5cbiAgICAgICAgdmFyIF9jb2xvciA9IG5ldyBDb2xvcihfciwgX2csIF9iNSk7XG5cbiAgICAgICAgcmV0dXJuIF9jb2xvcjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zcGFjZSA9PT0gJ2NteWsnKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2ZlbGlwZXNhYmluby81MDY2MzM2XG4gICAgICAgIC8vIEdldCB0aGUgbm9ybWFsaXNlZCBjbXlrIHZhbHVlc1xuICAgICAgICB2YXIgX2M0ID0gdGhpcy5jLFxuICAgICAgICAgICAgbSA9IHRoaXMubSxcbiAgICAgICAgICAgIF95ID0gdGhpcy55LFxuICAgICAgICAgICAgayA9IHRoaXMuazsgLy8gR2V0IHRoZSByZ2IgdmFsdWVzXG5cbiAgICAgICAgdmFyIF9yMiA9IDI1NSAqICgxIC0gTWF0aC5taW4oMSwgX2M0ICogKDEgLSBrKSArIGspKTtcblxuICAgICAgICB2YXIgX2cyID0gMjU1ICogKDEgLSBNYXRoLm1pbigxLCBtICogKDEgLSBrKSArIGspKTtcblxuICAgICAgICB2YXIgX2I2ID0gMjU1ICogKDEgLSBNYXRoLm1pbigxLCBfeSAqICgxIC0gaykgKyBrKSk7IC8vIEZvcm0gdGhlIGNvbG9yIGFuZCByZXR1cm4gaXRcblxuXG4gICAgICAgIHZhciBfY29sb3IzID0gbmV3IENvbG9yKF9yMiwgX2cyLCBfYjYpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3IzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxhYlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsYWIoKSB7XG4gICAgICAvLyBHZXQgdGhlIHh5eiBjb2xvclxuICAgICAgdmFyIF90aGlzJHh5eiA9IHRoaXMueHl6KCksXG4gICAgICAgICAgeCA9IF90aGlzJHh5ei54LFxuICAgICAgICAgIHkgPSBfdGhpcyR4eXoueSxcbiAgICAgICAgICB6ID0gX3RoaXMkeHl6Lno7IC8vIEdldCB0aGUgbGFiIGNvbXBvbmVudHNcblxuXG4gICAgICB2YXIgbCA9IDExNiAqIHkgLSAxNjtcbiAgICAgIHZhciBhID0gNTAwICogKHggLSB5KTtcbiAgICAgIHZhciBiID0gMjAwICogKHkgLSB6KTsgLy8gQ29uc3RydWN0IGFuZCByZXR1cm4gYSBuZXcgY29sb3JcblxuICAgICAgdmFyIGNvbG9yID0gbmV3IENvbG9yKGwsIGEsIGIsICdsYWInKTtcbiAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwieHl6XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHh5eigpIHtcbiAgICAgIC8vIE5vcm1hbGlzZSB0aGUgcmVkLCBncmVlbiBhbmQgYmx1ZSB2YWx1ZXNcbiAgICAgIHZhciBfdGhpcyRyZ2IgPSB0aGlzLnJnYigpLFxuICAgICAgICAgIHIyNTUgPSBfdGhpcyRyZ2IuX2EsXG4gICAgICAgICAgZzI1NSA9IF90aGlzJHJnYi5fYixcbiAgICAgICAgICBiMjU1ID0gX3RoaXMkcmdiLl9jO1xuXG4gICAgICB2YXIgX21hcCA9IFtyMjU1LCBnMjU1LCBiMjU1XS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHYgLyAyNTU7XG4gICAgICB9KSxcbiAgICAgICAgICBfbWFwMiA9IF9zbGljZWRUb0FycmF5KF9tYXAsIDMpLFxuICAgICAgICAgIHIgPSBfbWFwMlswXSxcbiAgICAgICAgICBnID0gX21hcDJbMV0sXG4gICAgICAgICAgYiA9IF9tYXAyWzJdOyAvLyBDb252ZXJ0IHRvIHRoZSBsYWIgcmdiIHNwYWNlXG5cblxuICAgICAgdmFyIHJMID0gciA+IDAuMDQwNDUgPyBNYXRoLnBvdygociArIDAuMDU1KSAvIDEuMDU1LCAyLjQpIDogciAvIDEyLjkyO1xuICAgICAgdmFyIGdMID0gZyA+IDAuMDQwNDUgPyBNYXRoLnBvdygoZyArIDAuMDU1KSAvIDEuMDU1LCAyLjQpIDogZyAvIDEyLjkyO1xuICAgICAgdmFyIGJMID0gYiA+IDAuMDQwNDUgPyBNYXRoLnBvdygoYiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpIDogYiAvIDEyLjkyOyAvLyBDb252ZXJ0IHRvIHRoZSB4eXogY29sb3Igc3BhY2Ugd2l0aG91dCBib3VuZGluZyB0aGUgdmFsdWVzXG5cbiAgICAgIHZhciB4VSA9IChyTCAqIDAuNDEyNCArIGdMICogMC4zNTc2ICsgYkwgKiAwLjE4MDUpIC8gMC45NTA0NztcbiAgICAgIHZhciB5VSA9IChyTCAqIDAuMjEyNiArIGdMICogMC43MTUyICsgYkwgKiAwLjA3MjIpIC8gMS4wMDAwMDtcbiAgICAgIHZhciB6VSA9IChyTCAqIDAuMDE5MyArIGdMICogMC4xMTkyICsgYkwgKiAwLjk1MDUpIC8gMS4wODg4MzsgLy8gR2V0IHRoZSBwcm9wZXIgeHl6IHZhbHVlcyBieSBhcHBseWluZyB0aGUgYm91bmRpbmdcblxuICAgICAgdmFyIHggPSB4VSA+IDAuMDA4ODU2ID8gTWF0aC5wb3coeFUsIDEgLyAzKSA6IDcuNzg3ICogeFUgKyAxNiAvIDExNjtcbiAgICAgIHZhciB5ID0geVUgPiAwLjAwODg1NiA/IE1hdGgucG93KHlVLCAxIC8gMykgOiA3Ljc4NyAqIHlVICsgMTYgLyAxMTY7XG4gICAgICB2YXIgeiA9IHpVID4gMC4wMDg4NTYgPyBNYXRoLnBvdyh6VSwgMSAvIDMpIDogNy43ODcgKiB6VSArIDE2IC8gMTE2OyAvLyBNYWtlIGFuZCByZXR1cm4gdGhlIGNvbG9yXG5cbiAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcih4LCB5LCB6LCAneHl6Jyk7XG4gICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsY2goKSB7XG4gICAgICAvLyBHZXQgdGhlIGxhYiBjb2xvciBkaXJlY3RseVxuICAgICAgdmFyIF90aGlzJGxhYiA9IHRoaXMubGFiKCksXG4gICAgICAgICAgbCA9IF90aGlzJGxhYi5sLFxuICAgICAgICAgIGEgPSBfdGhpcyRsYWIuYSxcbiAgICAgICAgICBiID0gX3RoaXMkbGFiLmI7IC8vIEdldCB0aGUgY2hyb21hdGljaXR5IGFuZCB0aGUgaHVlIHVzaW5nIHBvbGFyIGNvb3JkaW5hdGVzXG5cblxuICAgICAgdmFyIGMgPSBNYXRoLnNxcnQoTWF0aC5wb3coYSwgMikgKyBNYXRoLnBvdyhiLCAyKSk7XG4gICAgICB2YXIgaCA9IDE4MCAqIE1hdGguYXRhbjIoYiwgYSkgLyBNYXRoLlBJO1xuXG4gICAgICBpZiAoaCA8IDApIHtcbiAgICAgICAgaCAqPSAtMTtcbiAgICAgICAgaCA9IDM2MCAtIGg7XG4gICAgICB9IC8vIE1ha2UgYSBuZXcgY29sb3IgYW5kIHJldHVybiBpdFxuXG5cbiAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcihsLCBjLCBoLCAnbGNoJyk7XG4gICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhzbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoc2woKSB7XG4gICAgICAvLyBHZXQgdGhlIHJnYiB2YWx1ZXNcbiAgICAgIHZhciBfdGhpcyRyZ2IyID0gdGhpcy5yZ2IoKSxcbiAgICAgICAgICBfYSA9IF90aGlzJHJnYjIuX2EsXG4gICAgICAgICAgX2IgPSBfdGhpcyRyZ2IyLl9iLFxuICAgICAgICAgIF9jID0gX3RoaXMkcmdiMi5fYztcblxuICAgICAgdmFyIF9tYXAzID0gW19hLCBfYiwgX2NdLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gdiAvIDI1NTtcbiAgICAgIH0pLFxuICAgICAgICAgIF9tYXA0ID0gX3NsaWNlZFRvQXJyYXkoX21hcDMsIDMpLFxuICAgICAgICAgIHIgPSBfbWFwNFswXSxcbiAgICAgICAgICBnID0gX21hcDRbMV0sXG4gICAgICAgICAgYiA9IF9tYXA0WzJdOyAvLyBGaW5kIHRoZSBtYXhpbXVtIGFuZCBtaW5pbXVtIHZhbHVlcyB0byBnZXQgdGhlIGxpZ2h0bmVzc1xuXG5cbiAgICAgIHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICAgIHZhciBsID0gKG1heCArIG1pbikgLyAyOyAvLyBJZiB0aGUgciwgZywgdiB2YWx1ZXMgYXJlIGlkZW50aWNhbCB0aGVuIHdlIGFyZSBncmV5XG5cbiAgICAgIHZhciBpc0dyZXkgPSBtYXggPT09IG1pbjsgLy8gQ2FsY3VsYXRlIHRoZSBodWUgYW5kIHNhdHVyYXRpb25cblxuICAgICAgdmFyIGRlbHRhID0gbWF4IC0gbWluO1xuICAgICAgdmFyIHMgPSBpc0dyZXkgPyAwIDogbCA+IDAuNSA/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pIDogZGVsdGEgLyAobWF4ICsgbWluKTtcbiAgICAgIHZhciBoID0gaXNHcmV5ID8gMCA6IG1heCA9PT0gciA/ICgoZyAtIGIpIC8gZGVsdGEgKyAoZyA8IGIgPyA2IDogMCkpIC8gNiA6IG1heCA9PT0gZyA/ICgoYiAtIHIpIC8gZGVsdGEgKyAyKSAvIDYgOiBtYXggPT09IGIgPyAoKHIgLSBnKSAvIGRlbHRhICsgNCkgLyA2IDogMDsgLy8gQ29uc3RydWN0IGFuZCByZXR1cm4gdGhlIG5ldyBjb2xvclxuXG4gICAgICB2YXIgY29sb3IgPSBuZXcgQ29sb3IoMzYwICogaCwgMTAwICogcywgMTAwICogbCwgJ2hzbCcpO1xuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbXlrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNteWsoKSB7XG4gICAgICAvLyBHZXQgdGhlIHJnYiB2YWx1ZXMgZm9yIHRoZSBjdXJyZW50IGNvbG9yXG4gICAgICB2YXIgX3RoaXMkcmdiMyA9IHRoaXMucmdiKCksXG4gICAgICAgICAgX2EgPSBfdGhpcyRyZ2IzLl9hLFxuICAgICAgICAgIF9iID0gX3RoaXMkcmdiMy5fYixcbiAgICAgICAgICBfYyA9IF90aGlzJHJnYjMuX2M7XG5cbiAgICAgIHZhciBfbWFwNSA9IFtfYSwgX2IsIF9jXS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHYgLyAyNTU7XG4gICAgICB9KSxcbiAgICAgICAgICBfbWFwNiA9IF9zbGljZWRUb0FycmF5KF9tYXA1LCAzKSxcbiAgICAgICAgICByID0gX21hcDZbMF0sXG4gICAgICAgICAgZyA9IF9tYXA2WzFdLFxuICAgICAgICAgIGIgPSBfbWFwNlsyXTsgLy8gR2V0IHRoZSBjbXlrIHZhbHVlcyBpbiBhbiB1bmJvdW5kZWQgZm9ybWF0XG5cblxuICAgICAgdmFyIGsgPSBNYXRoLm1pbigxIC0gciwgMSAtIGcsIDEgLSBiKTtcblxuICAgICAgaWYgKGsgPT09IDEpIHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGJsYWNrIGNhc2VcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAwLCAxLCAnY215aycpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYyA9ICgxIC0gciAtIGspIC8gKDEgLSBrKTtcbiAgICAgIHZhciBtID0gKDEgLSBnIC0gaykgLyAoMSAtIGspO1xuICAgICAgdmFyIHkgPSAoMSAtIGIgLSBrKSAvICgxIC0gayk7IC8vIENvbnN0cnVjdCB0aGUgbmV3IGNvbG9yXG5cbiAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcihjLCBtLCB5LCBrLCAnY215aycpO1xuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgICAvKlxyXG4gICAgSW5wdXQgYW5kIE91dHB1dCBtZXRob2RzXHJcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2NsYW1wZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2NsYW1wZWQoKSB7XG4gICAgICB2YXIgX3RoaXMkcmdiNCA9IHRoaXMucmdiKCksXG4gICAgICAgICAgX2EgPSBfdGhpcyRyZ2I0Ll9hLFxuICAgICAgICAgIF9iID0gX3RoaXMkcmdiNC5fYixcbiAgICAgICAgICBfYyA9IF90aGlzJHJnYjQuX2M7XG5cbiAgICAgIHZhciBtYXggPSBNYXRoLm1heCxcbiAgICAgICAgICBtaW4gPSBNYXRoLm1pbixcbiAgICAgICAgICByb3VuZCA9IE1hdGgucm91bmQ7XG5cbiAgICAgIHZhciBmb3JtYXQgPSBmdW5jdGlvbiBmb3JtYXQodikge1xuICAgICAgICByZXR1cm4gbWF4KDAsIG1pbihyb3VuZCh2KSwgMjU1KSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gW19hLCBfYiwgX2NdLm1hcChmb3JtYXQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0hleFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0hleCgpIHtcbiAgICAgIHZhciBfdGhpcyRfY2xhbXBlZCRtYXAgPSB0aGlzLl9jbGFtcGVkKCkubWFwKGNvbXBvbmVudEhleCksXG4gICAgICAgICAgX3RoaXMkX2NsYW1wZWQkbWFwMiA9IF9zbGljZWRUb0FycmF5KF90aGlzJF9jbGFtcGVkJG1hcCwgMyksXG4gICAgICAgICAgciA9IF90aGlzJF9jbGFtcGVkJG1hcDJbMF0sXG4gICAgICAgICAgZyA9IF90aGlzJF9jbGFtcGVkJG1hcDJbMV0sXG4gICAgICAgICAgYiA9IF90aGlzJF9jbGFtcGVkJG1hcDJbMl07XG5cbiAgICAgIHJldHVybiBcIiNcIi5jb25jYXQocikuY29uY2F0KGcpLmNvbmNhdChiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9TdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0hleCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b1JnYlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1JnYigpIHtcbiAgICAgIHZhciBfdGhpcyRfY2xhbXBlZCA9IHRoaXMuX2NsYW1wZWQoKSxcbiAgICAgICAgICBfdGhpcyRfY2xhbXBlZDIgPSBfc2xpY2VkVG9BcnJheShfdGhpcyRfY2xhbXBlZCwgMyksXG4gICAgICAgICAgclYgPSBfdGhpcyRfY2xhbXBlZDJbMF0sXG4gICAgICAgICAgZ1YgPSBfdGhpcyRfY2xhbXBlZDJbMV0sXG4gICAgICAgICAgYlYgPSBfdGhpcyRfY2xhbXBlZDJbMl07XG5cbiAgICAgIHZhciBzdHJpbmcgPSBcInJnYihcIi5jb25jYXQoclYsIFwiLFwiKS5jb25jYXQoZ1YsIFwiLFwiKS5jb25jYXQoYlYsIFwiKVwiKTtcbiAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHZhciBfYSA9IHRoaXMuX2EsXG4gICAgICAgICAgX2IgPSB0aGlzLl9iLFxuICAgICAgICAgIF9jID0gdGhpcy5fYyxcbiAgICAgICAgICBfZCA9IHRoaXMuX2QsXG4gICAgICAgICAgc3BhY2UgPSB0aGlzLnNwYWNlO1xuICAgICAgcmV0dXJuIFtfYSwgX2IsIF9jLCBfZCwgc3BhY2VdO1xuICAgIH1cbiAgICAvKlxyXG4gICAgR2VuZXJhdGluZyByYW5kb20gY29sb3JzXHJcbiAgICAqL1xuXG4gIH1dLCBbe1xuICAgIGtleTogXCJyYW5kb21cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmFuZG9tKCkge1xuICAgICAgdmFyIG1vZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICd2aWJyYW50JztcbiAgICAgIHZhciB0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgICAvLyBHZXQgdGhlIG1hdGggbW9kdWxlc1xuICAgICAgdmFyIHJhbmRvbSA9IE1hdGgucmFuZG9tLFxuICAgICAgICAgIHJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICAgICAgICBzaW4gPSBNYXRoLnNpbixcbiAgICAgICAgICBwaSA9IE1hdGguUEk7IC8vIFJ1biB0aGUgY29ycmVjdCBnZW5lcmF0b3JcblxuICAgICAgaWYgKG1vZGUgPT09ICd2aWJyYW50Jykge1xuICAgICAgICB2YXIgbCA9ICg4MSAtIDU3KSAqIHJhbmRvbSgpICsgNTc7XG4gICAgICAgIHZhciBjID0gKDgzIC0gNDUpICogcmFuZG9tKCkgKyA0NTtcbiAgICAgICAgdmFyIGggPSAzNjAgKiByYW5kb20oKTtcbiAgICAgICAgdmFyIGNvbG9yID0gbmV3IENvbG9yKGwsIGMsIGgsICdsY2gnKTtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnc2luZScpIHtcbiAgICAgICAgdCA9IHQgPT0gbnVsbCA/IHJhbmRvbSgpIDogdDtcbiAgICAgICAgdmFyIHIgPSByb3VuZCg4MCAqIHNpbigyICogcGkgKiB0IC8gMC41ICsgMC4wMSkgKyAxNTApO1xuICAgICAgICB2YXIgZyA9IHJvdW5kKDUwICogc2luKDIgKiBwaSAqIHQgLyAwLjUgKyA0LjYpICsgMjAwKTtcbiAgICAgICAgdmFyIGIgPSByb3VuZCgxMDAgKiBzaW4oMiAqIHBpICogdCAvIDAuNSArIDIuMykgKyAxNTApO1xuXG4gICAgICAgIHZhciBfY29sb3I0ID0gbmV3IENvbG9yKHIsIGcsIGIpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3I0O1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAncGFzdGVsJykge1xuICAgICAgICB2YXIgX2wyID0gKDk0IC0gODYpICogcmFuZG9tKCkgKyA4NjtcblxuICAgICAgICB2YXIgX2M1ID0gKDI2IC0gOSkgKiByYW5kb20oKSArIDk7XG5cbiAgICAgICAgdmFyIF9oMiA9IDM2MCAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBfY29sb3I1ID0gbmV3IENvbG9yKF9sMiwgX2M1LCBfaDIsICdsY2gnKTtcblxuICAgICAgICByZXR1cm4gX2NvbG9yNTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgIHZhciBfbDMgPSAxMCArIDEwICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIF9jNiA9ICgxMjUgLSA3NSkgKiByYW5kb20oKSArIDg2O1xuXG4gICAgICAgIHZhciBfaDMgPSAzNjAgKiByYW5kb20oKTtcblxuICAgICAgICB2YXIgX2NvbG9yNiA9IG5ldyBDb2xvcihfbDMsIF9jNiwgX2gzLCAnbGNoJyk7XG5cbiAgICAgICAgcmV0dXJuIF9jb2xvcjY7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdyZ2InKSB7XG4gICAgICAgIHZhciBfcjMgPSAyNTUgKiByYW5kb20oKTtcblxuICAgICAgICB2YXIgX2czID0gMjU1ICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIF9iNyA9IDI1NSAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBfY29sb3I3ID0gbmV3IENvbG9yKF9yMywgX2czLCBfYjcpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3I3O1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnbGFiJykge1xuICAgICAgICB2YXIgX2w0ID0gMTAwICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIGEgPSAyNTYgKiByYW5kb20oKSAtIDEyODtcblxuICAgICAgICB2YXIgX2I4ID0gMjU2ICogcmFuZG9tKCkgLSAxMjg7XG5cbiAgICAgICAgdmFyIF9jb2xvcjggPSBuZXcgQ29sb3IoX2w0LCBhLCBfYjgsICdsYWInKTtcblxuICAgICAgICByZXR1cm4gX2NvbG9yODtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2dyZXknKSB7XG4gICAgICAgIHZhciBncmV5ID0gMjU1ICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIF9jb2xvcjkgPSBuZXcgQ29sb3IoZ3JleSwgZ3JleSwgZ3JleSk7XG5cbiAgICAgICAgcmV0dXJuIF9jb2xvcjk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qXHJcbiAgICBDb25zdHJ1Y3RpbmcgY29sb3JzXHJcbiAgICAqL1xuICAgIC8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSBjb2xvciBzdHJpbmdcblxuICB9LCB7XG4gICAga2V5OiBcInRlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVzdChjb2xvcikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycgJiYgKGlzSGV4LnRlc3QoY29sb3IpIHx8IGlzUmdiLnRlc3QoY29sb3IpKTtcbiAgICB9IC8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYW4gcmdiIG9iamVjdFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaXNSZ2JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNSZ2IoY29sb3IpIHtcbiAgICAgIHJldHVybiBjb2xvciAmJiB0eXBlb2YgY29sb3IuciA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGNvbG9yLmcgPT09ICdudW1iZXInICYmIHR5cGVvZiBjb2xvci5iID09PSAnbnVtYmVyJztcbiAgICB9IC8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSBjb2xvclxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaXNDb2xvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc0NvbG9yKGNvbG9yKSB7XG4gICAgICByZXR1cm4gY29sb3IgJiYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3IgfHwgdGhpcy5pc1JnYihjb2xvcikgfHwgdGhpcy50ZXN0KGNvbG9yKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbG9yO1xufSgpO1xuXG52YXIgRkFJTFNfT05fUFJJTUlUSVZFUyQxID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBvYmplY3RLZXlzKDEpOyB9KTtcblxuLy8gYE9iamVjdC5rZXlzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5rZXlzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGQUlMU19PTl9QUklNSVRJVkVTJDEgfSwge1xuICBrZXlzOiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuIG9iamVjdEtleXModG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG5cbi8vIEBAbWF0Y2ggbG9naWNcbmZpeFJlZ2V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdtYXRjaCcsIDEsIGZ1bmN0aW9uIChNQVRDSCwgbmF0aXZlTWF0Y2gsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLm1hdGNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLm1hdGNoXG4gICAgZnVuY3Rpb24gbWF0Y2gocmVnZXhwKSB7XG4gICAgICB2YXIgTyA9IHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG4gICAgICB2YXIgbWF0Y2hlciA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbTUFUQ0hdO1xuICAgICAgcmV0dXJuIG1hdGNoZXIgIT09IHVuZGVmaW5lZCA/IG1hdGNoZXIuY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW01BVENIXShTdHJpbmcoTykpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEBtYXRjaFxuICAgIGZ1bmN0aW9uIChyZWdleHApIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUobmF0aXZlTWF0Y2gsIHJlZ2V4cCwgdGhpcyk7XG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG5cbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHJlZ2V4cCk7XG4gICAgICB2YXIgUyA9IFN0cmluZyh0aGlzKTtcblxuICAgICAgaWYgKCFyeC5nbG9iYWwpIHJldHVybiByZWdleHBFeGVjQWJzdHJhY3QocngsIFMpO1xuXG4gICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBBID0gW107XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgd2hpbGUgKChyZXN1bHQgPSByZWdleHBFeGVjQWJzdHJhY3QocngsIFMpKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgQVtuXSA9IG1hdGNoU3RyO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgICBuKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gbiA9PT0gMCA/IG51bGwgOiBBO1xuICAgIH1cbiAgXTtcbn0pO1xuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufVxuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gX2dldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIF9nZXQgPSBSZWZsZWN0LmdldDtcbiAgfSBlbHNlIHtcbiAgICBfZ2V0ID0gZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgICAgdmFyIGJhc2UgPSBfc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IG9iamVjdEdldE93blByb3BlcnR5TmFtZXMuZjtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMiA9IG9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvci5mO1xudmFyIGRlZmluZVByb3BlcnR5JDUgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xudmFyIHRyaW0kMSA9IHN0cmluZ1RyaW0udHJpbTtcblxudmFyIE5VTUJFUiA9ICdOdW1iZXInO1xudmFyIE5hdGl2ZU51bWJlciA9IGdsb2JhbF8xW05VTUJFUl07XG52YXIgTnVtYmVyUHJvdG90eXBlID0gTmF0aXZlTnVtYmVyLnByb3RvdHlwZTtcblxuLy8gT3BlcmEgfjEyIGhhcyBicm9rZW4gT2JqZWN0I3RvU3RyaW5nXG52YXIgQlJPS0VOX0NMQVNTT0YgPSBjbGFzc29mUmF3KG9iamVjdENyZWF0ZShOdW1iZXJQcm90b3R5cGUpKSA9PSBOVU1CRVI7XG5cbi8vIGBUb051bWJlcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b251bWJlclxudmFyIHRvTnVtYmVyID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBpdCA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCBmYWxzZSk7XG4gIHZhciBmaXJzdCwgdGhpcmQsIHJhZGl4LCBtYXhDb2RlLCBkaWdpdHMsIGxlbmd0aCwgaW5kZXgsIGNvZGU7XG4gIGlmICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgJiYgaXQubGVuZ3RoID4gMikge1xuICAgIGl0ID0gdHJpbSQxKGl0KTtcbiAgICBmaXJzdCA9IGl0LmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGZpcnN0ID09PSA0MyB8fCBmaXJzdCA9PT0gNDUpIHtcbiAgICAgIHRoaXJkID0gaXQuY2hhckNvZGVBdCgyKTtcbiAgICAgIGlmICh0aGlyZCA9PT0gODggfHwgdGhpcmQgPT09IDEyMCkgcmV0dXJuIE5hTjsgLy8gTnVtYmVyKCcrMHgxJykgc2hvdWxkIGJlIE5hTiwgb2xkIFY4IGZpeFxuICAgIH0gZWxzZSBpZiAoZmlyc3QgPT09IDQ4KSB7XG4gICAgICBzd2l0Y2ggKGl0LmNoYXJDb2RlQXQoMSkpIHtcbiAgICAgICAgY2FzZSA2NjogY2FzZSA5ODogcmFkaXggPSAyOyBtYXhDb2RlID0gNDk7IGJyZWFrOyAvLyBmYXN0IGVxdWFsIG9mIC9eMGJbMDFdKyQvaVxuICAgICAgICBjYXNlIDc5OiBjYXNlIDExMTogcmFkaXggPSA4OyBtYXhDb2RlID0gNTU7IGJyZWFrOyAvLyBmYXN0IGVxdWFsIG9mIC9eMG9bMC03XSskL2lcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuICtpdDtcbiAgICAgIH1cbiAgICAgIGRpZ2l0cyA9IGl0LnNsaWNlKDIpO1xuICAgICAgbGVuZ3RoID0gZGlnaXRzLmxlbmd0aDtcbiAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb2RlID0gZGlnaXRzLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAvLyBwYXJzZUludCBwYXJzZXMgYSBzdHJpbmcgdG8gYSBmaXJzdCB1bmF2YWlsYWJsZSBzeW1ib2xcbiAgICAgICAgLy8gYnV0IFRvTnVtYmVyIHNob3VsZCByZXR1cm4gTmFOIGlmIGEgc3RyaW5nIGNvbnRhaW5zIHVuYXZhaWxhYmxlIHN5bWJvbHNcbiAgICAgICAgaWYgKGNvZGUgPCA0OCB8fCBjb2RlID4gbWF4Q29kZSkgcmV0dXJuIE5hTjtcbiAgICAgIH0gcmV0dXJuIHBhcnNlSW50KGRpZ2l0cywgcmFkaXgpO1xuICAgIH1cbiAgfSByZXR1cm4gK2l0O1xufTtcblxuLy8gYE51bWJlcmAgY29uc3RydWN0b3Jcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW51bWJlci1jb25zdHJ1Y3RvclxuaWYgKGlzRm9yY2VkXzEoTlVNQkVSLCAhTmF0aXZlTnVtYmVyKCcgMG8xJykgfHwgIU5hdGl2ZU51bWJlcignMGIxJykgfHwgTmF0aXZlTnVtYmVyKCcrMHgxJykpKSB7XG4gIHZhciBOdW1iZXJXcmFwcGVyID0gZnVuY3Rpb24gTnVtYmVyKHZhbHVlKSB7XG4gICAgdmFyIGl0ID0gYXJndW1lbnRzLmxlbmd0aCA8IDEgPyAwIDogdmFsdWU7XG4gICAgdmFyIGR1bW15ID0gdGhpcztcbiAgICByZXR1cm4gZHVtbXkgaW5zdGFuY2VvZiBOdW1iZXJXcmFwcGVyXG4gICAgICAvLyBjaGVjayBvbiAxLi5jb25zdHJ1Y3Rvcihmb28pIGNhc2VcbiAgICAgICYmIChCUk9LRU5fQ0xBU1NPRiA/IGZhaWxzKGZ1bmN0aW9uICgpIHsgTnVtYmVyUHJvdG90eXBlLnZhbHVlT2YuY2FsbChkdW1teSk7IH0pIDogY2xhc3NvZlJhdyhkdW1teSkgIT0gTlVNQkVSKVxuICAgICAgICA/IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBOYXRpdmVOdW1iZXIodG9OdW1iZXIoaXQpKSwgZHVtbXksIE51bWJlcldyYXBwZXIpIDogdG9OdW1iZXIoaXQpO1xuICB9O1xuICBmb3IgKHZhciBrZXlzJDEgPSBkZXNjcmlwdG9ycyA/IGdldE93blByb3BlcnR5TmFtZXMoTmF0aXZlTnVtYmVyKSA6IChcbiAgICAvLyBFUzM6XG4gICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xuICAgIC8vIEVTMjAxNSAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTMjAxNSBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXG4gICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXG4gICkuc3BsaXQoJywnKSwgaiA9IDAsIGtleTsga2V5cyQxLmxlbmd0aCA+IGo7IGorKykge1xuICAgIGlmIChoYXMoTmF0aXZlTnVtYmVyLCBrZXkgPSBrZXlzJDFbal0pICYmICFoYXMoTnVtYmVyV3JhcHBlciwga2V5KSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkkNShOdW1iZXJXcmFwcGVyLCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvciQyKE5hdGl2ZU51bWJlciwga2V5KSk7XG4gICAgfVxuICB9XG4gIE51bWJlcldyYXBwZXIucHJvdG90eXBlID0gTnVtYmVyUHJvdG90eXBlO1xuICBOdW1iZXJQcm90b3R5cGUuY29uc3RydWN0b3IgPSBOdW1iZXJXcmFwcGVyO1xuICByZWRlZmluZShnbG9iYWxfMSwgTlVNQkVSLCBOdW1iZXJXcmFwcGVyKTtcbn1cblxudmFyIHRyaW0kMiA9IHN0cmluZ1RyaW0udHJpbTtcblxuXG52YXIgbmF0aXZlUGFyc2VGbG9hdCA9IGdsb2JhbF8xLnBhcnNlRmxvYXQ7XG52YXIgRk9SQ0VEJDIgPSAxIC8gbmF0aXZlUGFyc2VGbG9hdCh3aGl0ZXNwYWNlcyArICctMCcpICE9PSAtSW5maW5pdHk7XG5cbi8vIGBwYXJzZUZsb2F0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXBhcnNlZmxvYXQtc3RyaW5nXG52YXIgX3BhcnNlRmxvYXQgPSBGT1JDRUQkMiA/IGZ1bmN0aW9uIHBhcnNlRmxvYXQoc3RyaW5nKSB7XG4gIHZhciB0cmltbWVkU3RyaW5nID0gdHJpbSQyKFN0cmluZyhzdHJpbmcpKTtcbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZVBhcnNlRmxvYXQodHJpbW1lZFN0cmluZyk7XG4gIHJldHVybiByZXN1bHQgPT09IDAgJiYgdHJpbW1lZFN0cmluZy5jaGFyQXQoMCkgPT0gJy0nID8gLTAgOiByZXN1bHQ7XG59IDogbmF0aXZlUGFyc2VGbG9hdDtcblxuLy8gYHBhcnNlRmxvYXRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcGFyc2VmbG9hdC1zdHJpbmdcbl9leHBvcnQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogcGFyc2VGbG9hdCAhPSBfcGFyc2VGbG9hdCB9LCB7XG4gIHBhcnNlRmxvYXQ6IF9wYXJzZUZsb2F0XG59KTtcblxudmFyIFBvaW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgLy8gSW5pdGlhbGl6ZVxuICBmdW5jdGlvbiBQb2ludCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9pbnQpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUG9pbnQsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCh4LCB5KSB7XG4gICAgICB2YXIgYmFzZSA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfTsgLy8gZW5zdXJlIHNvdXJjZSBhcyBvYmplY3RcblxuICAgICAgdmFyIHNvdXJjZSA9IEFycmF5LmlzQXJyYXkoeCkgPyB7XG4gICAgICAgIHg6IHhbMF0sXG4gICAgICAgIHk6IHhbMV1cbiAgICAgIH0gOiBfdHlwZW9mKHgpID09PSAnb2JqZWN0JyA/IHtcbiAgICAgICAgeDogeC54LFxuICAgICAgICB5OiB4LnlcbiAgICAgIH0gOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHlcbiAgICAgIH07IC8vIG1lcmdlIHNvdXJjZVxuXG4gICAgICB0aGlzLnggPSBzb3VyY2UueCA9PSBudWxsID8gYmFzZS54IDogc291cmNlLng7XG4gICAgICB0aGlzLnkgPSBzb3VyY2UueSA9PSBudWxsID8gYmFzZS55IDogc291cmNlLnk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIENsb25lIHBvaW50XG5cbiAgfSwge1xuICAgIGtleTogXCJjbG9uZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRyYW5zZm9ybVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm0obSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS50cmFuc2Zvcm1PKG0pO1xuICAgIH0gLy8gVHJhbnNmb3JtIHBvaW50IHdpdGggbWF0cml4XG5cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2Zvcm1PXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zZm9ybU8obSkge1xuICAgICAgaWYgKCFNYXRyaXguaXNNYXRyaXhMaWtlKG0pKSB7XG4gICAgICAgIG0gPSBuZXcgTWF0cml4KG0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgeCA9IHRoaXMueCxcbiAgICAgICAgICB5ID0gdGhpcy55OyAvLyBQZXJmb3JtIHRoZSBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICAgICAgdGhpcy54ID0gbS5hICogeCArIG0uYyAqIHkgKyBtLmU7XG4gICAgICB0aGlzLnkgPSBtLmIgKiB4ICsgbS5kICogeSArIG0uZjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55XTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUG9pbnQ7XG59KCk7XG5mdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSkudHJhbnNmb3JtKHRoaXMuc2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VFbm91Z2goYSwgYiwgdGhyZXNob2xkKSB7XG4gIHJldHVybiBNYXRoLmFicyhiIC0gYSkgPCAodGhyZXNob2xkIHx8IDFlLTYpO1xufVxuXG52YXIgTWF0cml4ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWF0cml4KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYXRyaXgpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0gLy8gSW5pdGlhbGl6ZVxuXG5cbiAgX2NyZWF0ZUNsYXNzKE1hdHJpeCwgW3tcbiAgICBrZXk6IFwiaW5pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNvdXJjZSkge1xuICAgICAgdmFyIGJhc2UgPSBNYXRyaXguZnJvbUFycmF5KFsxLCAwLCAwLCAxLCAwLCAwXSk7IC8vIGVuc3VyZSBzb3VyY2UgYXMgb2JqZWN0XG5cbiAgICAgIHNvdXJjZSA9IHNvdXJjZSBpbnN0YW5jZW9mIEVsZW1lbnQgPyBzb3VyY2UubWF0cml4aWZ5KCkgOiB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IE1hdHJpeC5mcm9tQXJyYXkoc291cmNlLnNwbGl0KGRlbGltaXRlcikubWFwKHBhcnNlRmxvYXQpKSA6IEFycmF5LmlzQXJyYXkoc291cmNlKSA/IE1hdHJpeC5mcm9tQXJyYXkoc291cmNlKSA6IF90eXBlb2Yoc291cmNlKSA9PT0gJ29iamVjdCcgJiYgTWF0cml4LmlzTWF0cml4TGlrZShzb3VyY2UpID8gc291cmNlIDogX3R5cGVvZihzb3VyY2UpID09PSAnb2JqZWN0JyA/IG5ldyBNYXRyaXgoKS50cmFuc2Zvcm0oc291cmNlKSA6IGFyZ3VtZW50cy5sZW5ndGggPT09IDYgPyBNYXRyaXguZnJvbUFycmF5KFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBiYXNlOyAvLyBNZXJnZSB0aGUgc291cmNlIG1hdHJpeCB3aXRoIHRoZSBiYXNlIG1hdHJpeFxuXG4gICAgICB0aGlzLmEgPSBzb3VyY2UuYSAhPSBudWxsID8gc291cmNlLmEgOiBiYXNlLmE7XG4gICAgICB0aGlzLmIgPSBzb3VyY2UuYiAhPSBudWxsID8gc291cmNlLmIgOiBiYXNlLmI7XG4gICAgICB0aGlzLmMgPSBzb3VyY2UuYyAhPSBudWxsID8gc291cmNlLmMgOiBiYXNlLmM7XG4gICAgICB0aGlzLmQgPSBzb3VyY2UuZCAhPSBudWxsID8gc291cmNlLmQgOiBiYXNlLmQ7XG4gICAgICB0aGlzLmUgPSBzb3VyY2UuZSAhPSBudWxsID8gc291cmNlLmUgOiBiYXNlLmU7XG4gICAgICB0aGlzLmYgPSBzb3VyY2UuZiAhPSBudWxsID8gc291cmNlLmYgOiBiYXNlLmY7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIENsb25lcyB0aGlzIG1hdHJpeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdHJpeCh0aGlzKTtcbiAgICB9IC8vIFRyYW5zZm9ybSBhIG1hdHJpeCBpbnRvIGFub3RoZXIgbWF0cml4IGJ5IG1hbmlwdWxhdGluZyB0aGUgc3BhY2VcblxuICB9LCB7XG4gICAga2V5OiBcInRyYW5zZm9ybVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm0obykge1xuICAgICAgLy8gQ2hlY2sgaWYgbyBpcyBhIG1hdHJpeCBhbmQgdGhlbiBsZWZ0IG11bHRpcGx5IGl0IGRpcmVjdGx5XG4gICAgICBpZiAoTWF0cml4LmlzTWF0cml4TGlrZShvKSkge1xuICAgICAgICB2YXIgbWF0cml4ID0gbmV3IE1hdHJpeChvKTtcbiAgICAgICAgcmV0dXJuIG1hdHJpeC5tdWx0aXBseU8odGhpcyk7XG4gICAgICB9IC8vIEdldCB0aGUgcHJvcG9zZWQgdHJhbnNmb3JtYXRpb25zIGFuZCB0aGUgY3VycmVudCB0cmFuc2Zvcm1hdGlvbnNcblxuXG4gICAgICB2YXIgdCA9IE1hdHJpeC5mb3JtYXRUcmFuc2Zvcm1zKG8pO1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzO1xuXG4gICAgICB2YXIgX3RyYW5zZm9ybSA9IG5ldyBQb2ludCh0Lm94LCB0Lm95KS50cmFuc2Zvcm0oY3VycmVudCksXG4gICAgICAgICAgb3ggPSBfdHJhbnNmb3JtLngsXG4gICAgICAgICAgb3kgPSBfdHJhbnNmb3JtLnk7IC8vIENvbnN0cnVjdCB0aGUgcmVzdWx0aW5nIG1hdHJpeFxuXG5cbiAgICAgIHZhciB0cmFuc2Zvcm1lciA9IG5ldyBNYXRyaXgoKS50cmFuc2xhdGVPKHQucngsIHQucnkpLmxtdWx0aXBseU8oY3VycmVudCkudHJhbnNsYXRlTygtb3gsIC1veSkuc2NhbGVPKHQuc2NhbGVYLCB0LnNjYWxlWSkuc2tld08odC5za2V3WCwgdC5za2V3WSkuc2hlYXJPKHQuc2hlYXIpLnJvdGF0ZU8odC50aGV0YSkudHJhbnNsYXRlTyhveCwgb3kpOyAvLyBJZiB3ZSB3YW50IHRoZSBvcmlnaW4gYXQgYSBwYXJ0aWN1bGFyIHBsYWNlLCB3ZSBmb3JjZSBpdCB0aGVyZVxuXG4gICAgICBpZiAoaXNGaW5pdGUodC5weCkgfHwgaXNGaW5pdGUodC5weSkpIHtcbiAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChveCwgb3kpLnRyYW5zZm9ybSh0cmFuc2Zvcm1lcik7IC8vIFRPRE86IFJlcGxhY2UgdC5weCB3aXRoIGlzRmluaXRlKHQucHgpXG5cbiAgICAgICAgdmFyIGR4ID0gdC5weCA/IHQucHggLSBvcmlnaW4ueCA6IDA7XG4gICAgICAgIHZhciBkeSA9IHQucHkgPyB0LnB5IC0gb3JpZ2luLnkgOiAwO1xuICAgICAgICB0cmFuc2Zvcm1lci50cmFuc2xhdGVPKGR4LCBkeSk7XG4gICAgICB9IC8vIFRyYW5zbGF0ZSBub3cgYWZ0ZXIgcG9zaXRpb25pbmdcblxuXG4gICAgICB0cmFuc2Zvcm1lci50cmFuc2xhdGVPKHQudHgsIHQudHkpO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICAgIH0gLy8gQXBwbGllcyBhIG1hdHJpeCBkZWZpbmVkIGJ5IGl0cyBhZmZpbmUgcGFyYW1ldGVyc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb3NlKG8pIHtcbiAgICAgIGlmIChvLm9yaWdpbikge1xuICAgICAgICBvLm9yaWdpblggPSBvLm9yaWdpblswXTtcbiAgICAgICAgby5vcmlnaW5ZID0gby5vcmlnaW5bMV07XG4gICAgICB9IC8vIEdldCB0aGUgcGFyYW1ldGVyc1xuXG5cbiAgICAgIHZhciBveCA9IG8ub3JpZ2luWCB8fCAwO1xuICAgICAgdmFyIG95ID0gby5vcmlnaW5ZIHx8IDA7XG4gICAgICB2YXIgc3ggPSBvLnNjYWxlWCB8fCAxO1xuICAgICAgdmFyIHN5ID0gby5zY2FsZVkgfHwgMTtcbiAgICAgIHZhciBsYW0gPSBvLnNoZWFyIHx8IDA7XG4gICAgICB2YXIgdGhldGEgPSBvLnJvdGF0ZSB8fCAwO1xuICAgICAgdmFyIHR4ID0gby50cmFuc2xhdGVYIHx8IDA7XG4gICAgICB2YXIgdHkgPSBvLnRyYW5zbGF0ZVkgfHwgMDsgLy8gQXBwbHkgdGhlIHN0YW5kYXJkIG1hdHJpeFxuXG4gICAgICB2YXIgcmVzdWx0ID0gbmV3IE1hdHJpeCgpLnRyYW5zbGF0ZU8oLW94LCAtb3kpLnNjYWxlTyhzeCwgc3kpLnNoZWFyTyhsYW0pLnJvdGF0ZU8odGhldGEpLnRyYW5zbGF0ZU8odHgsIHR5KS5sbXVsdGlwbHlPKHRoaXMpLnRyYW5zbGF0ZU8ob3gsIG95KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSAvLyBEZWNvbXBvc2VzIHRoaXMgbWF0cml4IGludG8gaXRzIGFmZmluZSBwYXJhbWV0ZXJzXG5cbiAgfSwge1xuICAgIGtleTogXCJkZWNvbXBvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVjb21wb3NlKCkge1xuICAgICAgdmFyIGN4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgICAgdmFyIGN5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgICAgLy8gR2V0IHRoZSBwYXJhbWV0ZXJzIGZyb20gdGhlIG1hdHJpeFxuICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICB2YXIgYiA9IHRoaXMuYjtcbiAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgdmFyIGQgPSB0aGlzLmQ7XG4gICAgICB2YXIgZSA9IHRoaXMuZTtcbiAgICAgIHZhciBmID0gdGhpcy5mOyAvLyBGaWd1cmUgb3V0IGlmIHRoZSB3aW5kaW5nIGRpcmVjdGlvbiBpcyBjbG9ja3dpc2Ugb3IgY291bnRlcmNsb2Nrd2lzZVxuXG4gICAgICB2YXIgZGV0ZXJtaW5hbnQgPSBhICogZCAtIGIgKiBjO1xuICAgICAgdmFyIGNjdyA9IGRldGVybWluYW50ID4gMCA/IDEgOiAtMTsgLy8gU2luY2Ugd2Ugb25seSBzaGVhciBpbiB4LCB3ZSBjYW4gdXNlIHRoZSB4IGJhc2lzIHRvIGdldCB0aGUgeCBzY2FsZVxuICAgICAgLy8gYW5kIHRoZSByb3RhdGlvbiBvZiB0aGUgcmVzdWx0aW5nIG1hdHJpeFxuXG4gICAgICB2YXIgc3ggPSBjY3cgKiBNYXRoLnNxcnQoYSAqIGEgKyBiICogYik7XG4gICAgICB2YXIgdGhldGFSYWQgPSBNYXRoLmF0YW4yKGNjdyAqIGIsIGNjdyAqIGEpO1xuICAgICAgdmFyIHRoZXRhID0gMTgwIC8gTWF0aC5QSSAqIHRoZXRhUmFkO1xuICAgICAgdmFyIGN0ID0gTWF0aC5jb3ModGhldGFSYWQpO1xuICAgICAgdmFyIHN0ID0gTWF0aC5zaW4odGhldGFSYWQpOyAvLyBXZSBjYW4gdGhlbiBzb2x2ZSB0aGUgeSBiYXNpcyB2ZWN0b3Igc2ltdWx0YW5lb3VzbHkgdG8gZ2V0IHRoZSBvdGhlclxuICAgICAgLy8gdHdvIGFmZmluZSBwYXJhbWV0ZXJzIGRpcmVjdGx5IGZyb20gdGhlc2UgcGFyYW1ldGVyc1xuXG4gICAgICB2YXIgbGFtID0gKGEgKiBjICsgYiAqIGQpIC8gZGV0ZXJtaW5hbnQ7XG4gICAgICB2YXIgc3kgPSBjICogc3ggLyAobGFtICogYSAtIGIpIHx8IGQgKiBzeCAvIChsYW0gKiBiICsgYSk7IC8vIFVzZSB0aGUgdHJhbnNsYXRpb25zXG5cbiAgICAgIHZhciB0eCA9IGUgLSBjeCArIGN4ICogY3QgKiBzeCArIGN5ICogKGxhbSAqIGN0ICogc3ggLSBzdCAqIHN5KTtcbiAgICAgIHZhciB0eSA9IGYgLSBjeSArIGN4ICogc3QgKiBzeCArIGN5ICogKGxhbSAqIHN0ICogc3ggKyBjdCAqIHN5KTsgLy8gQ29uc3RydWN0IHRoZSBkZWNvbXBvc2l0aW9uIGFuZCByZXR1cm4gaXRcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBhZmZpbmUgcGFyYW1ldGVyc1xuICAgICAgICBzY2FsZVg6IHN4LFxuICAgICAgICBzY2FsZVk6IHN5LFxuICAgICAgICBzaGVhcjogbGFtLFxuICAgICAgICByb3RhdGU6IHRoZXRhLFxuICAgICAgICB0cmFuc2xhdGVYOiB0eCxcbiAgICAgICAgdHJhbnNsYXRlWTogdHksXG4gICAgICAgIG9yaWdpblg6IGN4LFxuICAgICAgICBvcmlnaW5ZOiBjeSxcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBtYXRyaXggcGFyYW1ldGVyc1xuICAgICAgICBhOiB0aGlzLmEsXG4gICAgICAgIGI6IHRoaXMuYixcbiAgICAgICAgYzogdGhpcy5jLFxuICAgICAgICBkOiB0aGlzLmQsXG4gICAgICAgIGU6IHRoaXMuZSxcbiAgICAgICAgZjogdGhpcy5mXG4gICAgICB9O1xuICAgIH0gLy8gTGVmdCBtdWx0aXBsaWVzIGJ5IHRoZSBnaXZlbiBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcIm11bHRpcGx5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG11bHRpcGx5KG1hdHJpeCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tdWx0aXBseU8obWF0cml4KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibXVsdGlwbHlPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG11bHRpcGx5TyhtYXRyaXgpIHtcbiAgICAgIC8vIEdldCB0aGUgbWF0cmljZXNcbiAgICAgIHZhciBsID0gdGhpcztcbiAgICAgIHZhciByID0gbWF0cml4IGluc3RhbmNlb2YgTWF0cml4ID8gbWF0cml4IDogbmV3IE1hdHJpeChtYXRyaXgpO1xuICAgICAgcmV0dXJuIE1hdHJpeC5tYXRyaXhNdWx0aXBseShsLCByLCB0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG11bHRpcGx5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxtdWx0aXBseShtYXRyaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG11bHRpcGx5TyhtYXRyaXgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsbXVsdGlwbHlPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxtdWx0aXBseU8obWF0cml4KSB7XG4gICAgICB2YXIgciA9IHRoaXM7XG4gICAgICB2YXIgbCA9IG1hdHJpeCBpbnN0YW5jZW9mIE1hdHJpeCA/IG1hdHJpeCA6IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICAgIHJldHVybiBNYXRyaXgubWF0cml4TXVsdGlwbHkobCwgciwgdGhpcyk7XG4gICAgfSAvLyBJbnZlcnNlcyBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcImludmVyc2VPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGludmVyc2VPKCkge1xuICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHBhcmFtZXRlcnMgb3V0IG9mIHRoZSBtYXRyaXhcbiAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgdmFyIGIgPSB0aGlzLmI7XG4gICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgIHZhciBkID0gdGhpcy5kO1xuICAgICAgdmFyIGUgPSB0aGlzLmU7XG4gICAgICB2YXIgZiA9IHRoaXMuZjsgLy8gSW52ZXJ0IHRoZSAyeDIgbWF0cml4IGluIHRoZSB0b3AgbGVmdFxuXG4gICAgICB2YXIgZGV0ID0gYSAqIGQgLSBiICogYztcbiAgICAgIGlmICghZGV0KSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBpbnZlcnQgJyArIHRoaXMpOyAvLyBDYWxjdWxhdGUgdGhlIHRvcCAyeDIgbWF0cml4XG5cbiAgICAgIHZhciBuYSA9IGQgLyBkZXQ7XG4gICAgICB2YXIgbmIgPSAtYiAvIGRldDtcbiAgICAgIHZhciBuYyA9IC1jIC8gZGV0O1xuICAgICAgdmFyIG5kID0gYSAvIGRldDsgLy8gQXBwbHkgdGhlIGludmVydGVkIG1hdHJpeCB0byB0aGUgdG9wIHJpZ2h0XG5cbiAgICAgIHZhciBuZSA9IC0obmEgKiBlICsgbmMgKiBmKTtcbiAgICAgIHZhciBuZiA9IC0obmIgKiBlICsgbmQgKiBmKTsgLy8gQ29uc3RydWN0IHRoZSBpbnZlcnRlZCBtYXRyaXhcblxuICAgICAgdGhpcy5hID0gbmE7XG4gICAgICB0aGlzLmIgPSBuYjtcbiAgICAgIHRoaXMuYyA9IG5jO1xuICAgICAgdGhpcy5kID0gbmQ7XG4gICAgICB0aGlzLmUgPSBuZTtcbiAgICAgIHRoaXMuZiA9IG5mO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImludmVyc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW52ZXJzZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuaW52ZXJzZU8oKTtcbiAgICB9IC8vIFRyYW5zbGF0ZSBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcInRyYW5zbGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS50cmFuc2xhdGVPKHgsIHkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2xhdGVPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zbGF0ZU8oeCwgeSkge1xuICAgICAgdGhpcy5lICs9IHggfHwgMDtcbiAgICAgIHRoaXMuZiArPSB5IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFNjYWxlIG1hdHJpeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2NhbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2NhbGUoeCwgeSwgY3gsIGN5KSB7XG4gICAgICB2YXIgX3RoaXMkY2xvbmU7XG5cbiAgICAgIHJldHVybiAoX3RoaXMkY2xvbmUgPSB0aGlzLmNsb25lKCkpLnNjYWxlTy5hcHBseShfdGhpcyRjbG9uZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2NhbGVPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNjYWxlTyh4KSB7XG4gICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogeDtcbiAgICAgIHZhciBjeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgICAgIHZhciBjeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMDtcblxuICAgICAgLy8gU3VwcG9ydCB1bmlmb3JtIHNjYWxpbmdcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIGN5ID0gY3g7XG4gICAgICAgIGN4ID0geTtcbiAgICAgICAgeSA9IHg7XG4gICAgICB9XG5cbiAgICAgIHZhciBhID0gdGhpcy5hLFxuICAgICAgICAgIGIgPSB0aGlzLmIsXG4gICAgICAgICAgYyA9IHRoaXMuYyxcbiAgICAgICAgICBkID0gdGhpcy5kLFxuICAgICAgICAgIGUgPSB0aGlzLmUsXG4gICAgICAgICAgZiA9IHRoaXMuZjtcbiAgICAgIHRoaXMuYSA9IGEgKiB4O1xuICAgICAgdGhpcy5iID0gYiAqIHk7XG4gICAgICB0aGlzLmMgPSBjICogeDtcbiAgICAgIHRoaXMuZCA9IGQgKiB5O1xuICAgICAgdGhpcy5lID0gZSAqIHggLSBjeCAqIHggKyBjeDtcbiAgICAgIHRoaXMuZiA9IGYgKiB5IC0gY3kgKiB5ICsgY3k7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFJvdGF0ZSBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcInJvdGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByb3RhdGUociwgY3gsIGN5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdGF0ZU8ociwgY3gsIGN5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicm90YXRlT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByb3RhdGVPKHIpIHtcbiAgICAgIHZhciBjeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICAgIHZhciBjeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgICAgIC8vIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gICAgICByID0gcmFkaWFucyhyKTtcbiAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyKTtcbiAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihyKTtcbiAgICAgIHZhciBhID0gdGhpcy5hLFxuICAgICAgICAgIGIgPSB0aGlzLmIsXG4gICAgICAgICAgYyA9IHRoaXMuYyxcbiAgICAgICAgICBkID0gdGhpcy5kLFxuICAgICAgICAgIGUgPSB0aGlzLmUsXG4gICAgICAgICAgZiA9IHRoaXMuZjtcbiAgICAgIHRoaXMuYSA9IGEgKiBjb3MgLSBiICogc2luO1xuICAgICAgdGhpcy5iID0gYiAqIGNvcyArIGEgKiBzaW47XG4gICAgICB0aGlzLmMgPSBjICogY29zIC0gZCAqIHNpbjtcbiAgICAgIHRoaXMuZCA9IGQgKiBjb3MgKyBjICogc2luO1xuICAgICAgdGhpcy5lID0gZSAqIGNvcyAtIGYgKiBzaW4gKyBjeSAqIHNpbiAtIGN4ICogY29zICsgY3g7XG4gICAgICB0aGlzLmYgPSBmICogY29zICsgZSAqIHNpbiAtIGN4ICogc2luIC0gY3kgKiBjb3MgKyBjeTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gRmxpcCBtYXRyaXggb24geCBvciB5LCBhdCBhIGdpdmVuIG9mZnNldFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZmxpcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmbGlwKGF4aXMsIGFyb3VuZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGlwTyhheGlzLCBhcm91bmQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmbGlwT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmbGlwTyhheGlzLCBhcm91bmQpIHtcbiAgICAgIHJldHVybiBheGlzID09PSAneCcgPyB0aGlzLnNjYWxlTygtMSwgMSwgYXJvdW5kLCAwKSA6IGF4aXMgPT09ICd5JyA/IHRoaXMuc2NhbGVPKDEsIC0xLCAwLCBhcm91bmQpIDogdGhpcy5zY2FsZU8oLTEsIC0xLCBheGlzLCBhcm91bmQgfHwgYXhpcyk7IC8vIERlZmluZSBhbiB4LCB5IGZsaXAgcG9pbnRcbiAgICB9IC8vIFNoZWFyIG1hdHJpeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2hlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hlYXIoYSwgY3gsIGN5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNoZWFyTyhhLCBjeCwgY3kpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzaGVhck9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hlYXJPKGx4KSB7XG4gICAgICB2YXIgY3kgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICB2YXIgYSA9IHRoaXMuYSxcbiAgICAgICAgICBiID0gdGhpcy5iLFxuICAgICAgICAgIGMgPSB0aGlzLmMsXG4gICAgICAgICAgZCA9IHRoaXMuZCxcbiAgICAgICAgICBlID0gdGhpcy5lLFxuICAgICAgICAgIGYgPSB0aGlzLmY7XG4gICAgICB0aGlzLmEgPSBhICsgYiAqIGx4O1xuICAgICAgdGhpcy5jID0gYyArIGQgKiBseDtcbiAgICAgIHRoaXMuZSA9IGUgKyBmICogbHggLSBjeSAqIGx4O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBTa2V3IE1hdHJpeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2tld1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBza2V3KHgsIHksIGN4LCBjeSkge1xuICAgICAgdmFyIF90aGlzJGNsb25lMjtcblxuICAgICAgcmV0dXJuIChfdGhpcyRjbG9uZTIgPSB0aGlzLmNsb25lKCkpLnNrZXdPLmFwcGx5KF90aGlzJGNsb25lMiwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2tld09cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2tld08oeCkge1xuICAgICAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHg7XG4gICAgICB2YXIgY3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICB2YXIgY3kgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDA7XG5cbiAgICAgIC8vIHN1cHBvcnQgdW5pZm9ybWFsIHNrZXdcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIGN5ID0gY3g7XG4gICAgICAgIGN4ID0geTtcbiAgICAgICAgeSA9IHg7XG4gICAgICB9IC8vIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG5cblxuICAgICAgeCA9IHJhZGlhbnMoeCk7XG4gICAgICB5ID0gcmFkaWFucyh5KTtcbiAgICAgIHZhciBseCA9IE1hdGgudGFuKHgpO1xuICAgICAgdmFyIGx5ID0gTWF0aC50YW4oeSk7XG4gICAgICB2YXIgYSA9IHRoaXMuYSxcbiAgICAgICAgICBiID0gdGhpcy5iLFxuICAgICAgICAgIGMgPSB0aGlzLmMsXG4gICAgICAgICAgZCA9IHRoaXMuZCxcbiAgICAgICAgICBlID0gdGhpcy5lLFxuICAgICAgICAgIGYgPSB0aGlzLmY7XG4gICAgICB0aGlzLmEgPSBhICsgYiAqIGx4O1xuICAgICAgdGhpcy5iID0gYiArIGEgKiBseTtcbiAgICAgIHRoaXMuYyA9IGMgKyBkICogbHg7XG4gICAgICB0aGlzLmQgPSBkICsgYyAqIGx5O1xuICAgICAgdGhpcy5lID0gZSArIGYgKiBseCAtIGN5ICogbHg7XG4gICAgICB0aGlzLmYgPSBmICsgZSAqIGx5IC0gY3ggKiBseTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gU2tld1hcblxuICB9LCB7XG4gICAga2V5OiBcInNrZXdYXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNrZXdYKHgsIGN4LCBjeSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2tldyh4LCAwLCBjeCwgY3kpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJza2V3WE9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2tld1hPKHgsIGN4LCBjeSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2tld08oeCwgMCwgY3gsIGN5KTtcbiAgICB9IC8vIFNrZXdZXG5cbiAgfSwge1xuICAgIGtleTogXCJza2V3WVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBza2V3WSh5LCBjeCwgY3kpIHtcbiAgICAgIHJldHVybiB0aGlzLnNrZXcoMCwgeSwgY3gsIGN5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2tld1lPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNrZXdZTyh5LCBjeCwgY3kpIHtcbiAgICAgIHJldHVybiB0aGlzLnNrZXdPKDAsIHksIGN4LCBjeSk7XG4gICAgfSAvLyBUcmFuc2Zvcm0gYXJvdW5kIGEgY2VudGVyIHBvaW50XG5cbiAgfSwge1xuICAgIGtleTogXCJhcm91bmRPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFyb3VuZE8oY3gsIGN5LCBtYXRyaXgpIHtcbiAgICAgIHZhciBkeCA9IGN4IHx8IDA7XG4gICAgICB2YXIgZHkgPSBjeSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlTygtZHgsIC1keSkubG11bHRpcGx5TyhtYXRyaXgpLnRyYW5zbGF0ZU8oZHgsIGR5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXJvdW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFyb3VuZChjeCwgY3ksIG1hdHJpeCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hcm91bmRPKGN4LCBjeSwgbWF0cml4KTtcbiAgICB9IC8vIENoZWNrIGlmIHR3byBtYXRyaWNlcyBhcmUgZXF1YWxcblxuICB9LCB7XG4gICAga2V5OiBcImVxdWFsc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcbiAgICAgIHZhciBjb21wID0gbmV3IE1hdHJpeChvdGhlcik7XG4gICAgICByZXR1cm4gY2xvc2VFbm91Z2godGhpcy5hLCBjb21wLmEpICYmIGNsb3NlRW5vdWdoKHRoaXMuYiwgY29tcC5iKSAmJiBjbG9zZUVub3VnaCh0aGlzLmMsIGNvbXAuYykgJiYgY2xvc2VFbm91Z2godGhpcy5kLCBjb21wLmQpICYmIGNsb3NlRW5vdWdoKHRoaXMuZSwgY29tcC5lKSAmJiBjbG9zZUVub3VnaCh0aGlzLmYsIGNvbXAuZik7XG4gICAgfSAvLyBDb252ZXJ0IG1hdHJpeCB0byBzdHJpbmdcblxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuICdtYXRyaXgoJyArIHRoaXMuYSArICcsJyArIHRoaXMuYiArICcsJyArIHRoaXMuYyArICcsJyArIHRoaXMuZCArICcsJyArIHRoaXMuZSArICcsJyArIHRoaXMuZiArICcpJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9BcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgICAgcmV0dXJuIFt0aGlzLmEsIHRoaXMuYiwgdGhpcy5jLCB0aGlzLmQsIHRoaXMuZSwgdGhpcy5mXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVPZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYTogdGhpcy5hLFxuICAgICAgICBiOiB0aGlzLmIsXG4gICAgICAgIGM6IHRoaXMuYyxcbiAgICAgICAgZDogdGhpcy5kLFxuICAgICAgICBlOiB0aGlzLmUsXG4gICAgICAgIGY6IHRoaXMuZlxuICAgICAgfTtcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJmcm9tQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZnJvbUFycmF5KGEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGE6IGFbMF0sXG4gICAgICAgIGI6IGFbMV0sXG4gICAgICAgIGM6IGFbMl0sXG4gICAgICAgIGQ6IGFbM10sXG4gICAgICAgIGU6IGFbNF0sXG4gICAgICAgIGY6IGFbNV1cbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzTWF0cml4TGlrZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc01hdHJpeExpa2Uobykge1xuICAgICAgcmV0dXJuIG8uYSAhPSBudWxsIHx8IG8uYiAhPSBudWxsIHx8IG8uYyAhPSBudWxsIHx8IG8uZCAhPSBudWxsIHx8IG8uZSAhPSBudWxsIHx8IG8uZiAhPSBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmb3JtYXRUcmFuc2Zvcm1zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvcm1hdFRyYW5zZm9ybXMobykge1xuICAgICAgLy8gR2V0IGFsbCBvZiB0aGUgcGFyYW1ldGVycyByZXF1aXJlZCB0byBmb3JtIHRoZSBtYXRyaXhcbiAgICAgIHZhciBmbGlwQm90aCA9IG8uZmxpcCA9PT0gJ2JvdGgnIHx8IG8uZmxpcCA9PT0gdHJ1ZTtcbiAgICAgIHZhciBmbGlwWCA9IG8uZmxpcCAmJiAoZmxpcEJvdGggfHwgby5mbGlwID09PSAneCcpID8gLTEgOiAxO1xuICAgICAgdmFyIGZsaXBZID0gby5mbGlwICYmIChmbGlwQm90aCB8fCBvLmZsaXAgPT09ICd5JykgPyAtMSA6IDE7XG4gICAgICB2YXIgc2tld1ggPSBvLnNrZXcgJiYgby5za2V3Lmxlbmd0aCA/IG8uc2tld1swXSA6IGlzRmluaXRlKG8uc2tldykgPyBvLnNrZXcgOiBpc0Zpbml0ZShvLnNrZXdYKSA/IG8uc2tld1ggOiAwO1xuICAgICAgdmFyIHNrZXdZID0gby5za2V3ICYmIG8uc2tldy5sZW5ndGggPyBvLnNrZXdbMV0gOiBpc0Zpbml0ZShvLnNrZXcpID8gby5za2V3IDogaXNGaW5pdGUoby5za2V3WSkgPyBvLnNrZXdZIDogMDtcbiAgICAgIHZhciBzY2FsZVggPSBvLnNjYWxlICYmIG8uc2NhbGUubGVuZ3RoID8gby5zY2FsZVswXSAqIGZsaXBYIDogaXNGaW5pdGUoby5zY2FsZSkgPyBvLnNjYWxlICogZmxpcFggOiBpc0Zpbml0ZShvLnNjYWxlWCkgPyBvLnNjYWxlWCAqIGZsaXBYIDogZmxpcFg7XG4gICAgICB2YXIgc2NhbGVZID0gby5zY2FsZSAmJiBvLnNjYWxlLmxlbmd0aCA/IG8uc2NhbGVbMV0gKiBmbGlwWSA6IGlzRmluaXRlKG8uc2NhbGUpID8gby5zY2FsZSAqIGZsaXBZIDogaXNGaW5pdGUoby5zY2FsZVkpID8gby5zY2FsZVkgKiBmbGlwWSA6IGZsaXBZO1xuICAgICAgdmFyIHNoZWFyID0gby5zaGVhciB8fCAwO1xuICAgICAgdmFyIHRoZXRhID0gby5yb3RhdGUgfHwgby50aGV0YSB8fCAwO1xuICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChvLm9yaWdpbiB8fCBvLmFyb3VuZCB8fCBvLm94IHx8IG8ub3JpZ2luWCwgby5veSB8fCBvLm9yaWdpblkpO1xuICAgICAgdmFyIG94ID0gb3JpZ2luLng7XG4gICAgICB2YXIgb3kgPSBvcmlnaW4ueTtcbiAgICAgIHZhciBwb3NpdGlvbiA9IG5ldyBQb2ludChvLnBvc2l0aW9uIHx8IG8ucHggfHwgby5wb3NpdGlvblgsIG8ucHkgfHwgby5wb3NpdGlvblkpO1xuICAgICAgdmFyIHB4ID0gcG9zaXRpb24ueDtcbiAgICAgIHZhciBweSA9IHBvc2l0aW9uLnk7XG4gICAgICB2YXIgdHJhbnNsYXRlID0gbmV3IFBvaW50KG8udHJhbnNsYXRlIHx8IG8udHggfHwgby50cmFuc2xhdGVYLCBvLnR5IHx8IG8udHJhbnNsYXRlWSk7XG4gICAgICB2YXIgdHggPSB0cmFuc2xhdGUueDtcbiAgICAgIHZhciB0eSA9IHRyYW5zbGF0ZS55O1xuICAgICAgdmFyIHJlbGF0aXZlID0gbmV3IFBvaW50KG8ucmVsYXRpdmUgfHwgby5yeCB8fCBvLnJlbGF0aXZlWCwgby5yeSB8fCBvLnJlbGF0aXZlWSk7XG4gICAgICB2YXIgcnggPSByZWxhdGl2ZS54O1xuICAgICAgdmFyIHJ5ID0gcmVsYXRpdmUueTsgLy8gUG9wdWxhdGUgYWxsIG9mIHRoZSB2YWx1ZXNcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2NhbGVYOiBzY2FsZVgsXG4gICAgICAgIHNjYWxlWTogc2NhbGVZLFxuICAgICAgICBza2V3WDogc2tld1gsXG4gICAgICAgIHNrZXdZOiBza2V3WSxcbiAgICAgICAgc2hlYXI6IHNoZWFyLFxuICAgICAgICB0aGV0YTogdGhldGEsXG4gICAgICAgIHJ4OiByeCxcbiAgICAgICAgcnk6IHJ5LFxuICAgICAgICB0eDogdHgsXG4gICAgICAgIHR5OiB0eSxcbiAgICAgICAgb3g6IG94LFxuICAgICAgICBveTogb3ksXG4gICAgICAgIHB4OiBweCxcbiAgICAgICAgcHk6IHB5XG4gICAgICB9O1xuICAgIH0gLy8gbGVmdCBtYXRyaXgsIHJpZ2h0IG1hdHJpeCwgdGFyZ2V0IG1hdHJpeCB3aGljaCBpcyBvdmVyd3JpdHRlblxuXG4gIH0sIHtcbiAgICBrZXk6IFwibWF0cml4TXVsdGlwbHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWF0cml4TXVsdGlwbHkobCwgciwgbykge1xuICAgICAgLy8gV29yayBvdXQgdGhlIHByb2R1Y3QgZGlyZWN0bHlcbiAgICAgIHZhciBhID0gbC5hICogci5hICsgbC5jICogci5iO1xuICAgICAgdmFyIGIgPSBsLmIgKiByLmEgKyBsLmQgKiByLmI7XG4gICAgICB2YXIgYyA9IGwuYSAqIHIuYyArIGwuYyAqIHIuZDtcbiAgICAgIHZhciBkID0gbC5iICogci5jICsgbC5kICogci5kO1xuICAgICAgdmFyIGUgPSBsLmUgKyBsLmEgKiByLmUgKyBsLmMgKiByLmY7XG4gICAgICB2YXIgZiA9IGwuZiArIGwuYiAqIHIuZSArIGwuZCAqIHIuZjsgLy8gbWFrZSBzdXJlIHRvIHVzZSBsb2NhbCB2YXJpYWJsZXMgYmVjYXVzZSBsL3IgYW5kIG8gY291bGQgYmUgdGhlIHNhbWVcblxuICAgICAgby5hID0gYTtcbiAgICAgIG8uYiA9IGI7XG4gICAgICBvLmMgPSBjO1xuICAgICAgby5kID0gZDtcbiAgICAgIG8uZSA9IGU7XG4gICAgICBvLmYgPSBmO1xuICAgICAgcmV0dXJuIG87XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1hdHJpeDtcbn0oKTtcbmZ1bmN0aW9uIGN0bSgpIHtcbiAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcy5ub2RlLmdldENUTSgpKTtcbn1cbmZ1bmN0aW9uIHNjcmVlbkNUTSgpIHtcbiAgLyogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM0NDUzN1xyXG4gICAgIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgRkYgZG9lcyBub3QgcmV0dXJuIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcclxuICAgICBmb3IgdGhlIGlubmVyIGNvb3JkaW5hdGUgc3lzdGVtIHdoZW4gZ2V0U2NyZWVuQ1RNKCkgaXMgY2FsbGVkIG9uIG5lc3RlZCBzdmdzLlxyXG4gICAgIEhvd2V2ZXIgYWxsIG90aGVyIEJyb3dzZXJzIGRvIHRoYXQgKi9cbiAgaWYgKHR5cGVvZiB0aGlzLmlzUm9vdCA9PT0gJ2Z1bmN0aW9uJyAmJiAhdGhpcy5pc1Jvb3QoKSkge1xuICAgIHZhciByZWN0ID0gdGhpcy5yZWN0KDEsIDEpO1xuICAgIHZhciBtID0gcmVjdC5ub2RlLmdldFNjcmVlbkNUTSgpO1xuICAgIHJlY3QucmVtb3ZlKCk7XG4gICAgcmV0dXJuIG5ldyBNYXRyaXgobSk7XG4gIH1cblxuICByZXR1cm4gbmV3IE1hdHJpeCh0aGlzLm5vZGUuZ2V0U2NyZWVuQ1RNKCkpO1xufVxucmVnaXN0ZXIoTWF0cml4LCAnTWF0cml4Jyk7XG5cbmZ1bmN0aW9uIHBhcnNlcigpIHtcbiAgLy8gUmV1c2UgY2FjaGVkIGVsZW1lbnQgaWYgcG9zc2libGVcbiAgaWYgKCFwYXJzZXIubm9kZXMpIHtcbiAgICB2YXIgc3ZnID0gbWFrZUluc3RhbmNlKCkuc2l6ZSgyLCAwKTtcbiAgICBzdmcubm9kZS5zdHlsZS5jc3NUZXh0ID0gWydvcGFjaXR5OiAwJywgJ3Bvc2l0aW9uOiBhYnNvbHV0ZScsICdsZWZ0OiAtMTAwJScsICd0b3A6IC0xMDAlJywgJ292ZXJmbG93OiBoaWRkZW4nXS5qb2luKCc7Jyk7XG4gICAgc3ZnLmF0dHIoJ2ZvY3VzYWJsZScsICdmYWxzZScpO1xuICAgIHN2Zy5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdmFyIHBhdGggPSBzdmcucGF0aCgpLm5vZGU7XG4gICAgcGFyc2VyLm5vZGVzID0ge1xuICAgICAgc3ZnOiBzdmcsXG4gICAgICBwYXRoOiBwYXRoXG4gICAgfTtcbiAgfVxuXG4gIGlmICghcGFyc2VyLm5vZGVzLnN2Zy5ub2RlLnBhcmVudE5vZGUpIHtcbiAgICB2YXIgYiA9IGdsb2JhbHMuZG9jdW1lbnQuYm9keSB8fCBnbG9iYWxzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBwYXJzZXIubm9kZXMuc3ZnLmFkZFRvKGIpO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlci5ub2Rlcztcbn1cblxuZnVuY3Rpb24gaXNOdWxsZWRCb3goYm94KSB7XG4gIHJldHVybiAhYm94LndpZHRoICYmICFib3guaGVpZ2h0ICYmICFib3gueCAmJiAhYm94Lnk7XG59XG5cbmZ1bmN0aW9uIGRvbUNvbnRhaW5zKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IGdsb2JhbHMuZG9jdW1lbnQgfHwgKGdsb2JhbHMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zIHx8IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8gVGhpcyBpcyBJRSAtIGl0IGRvZXMgbm90IHN1cHBvcnQgY29udGFpbnMoKSBmb3IgdG9wLWxldmVsIFNWR3NcbiAgICB3aGlsZSAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlID09PSBnbG9iYWxzLmRvY3VtZW50O1xuICB9KS5jYWxsKGdsb2JhbHMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBub2RlKTtcbn1cblxudmFyIEJveCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJveCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQm94KTtcblxuICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJveCwgW3tcbiAgICBrZXk6IFwiaW5pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNvdXJjZSkge1xuICAgICAgdmFyIGJhc2UgPSBbMCwgMCwgMCwgMF07XG4gICAgICBzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZS5zcGxpdChkZWxpbWl0ZXIpLm1hcChwYXJzZUZsb2F0KSA6IEFycmF5LmlzQXJyYXkoc291cmNlKSA/IHNvdXJjZSA6IF90eXBlb2Yoc291cmNlKSA9PT0gJ29iamVjdCcgPyBbc291cmNlLmxlZnQgIT0gbnVsbCA/IHNvdXJjZS5sZWZ0IDogc291cmNlLngsIHNvdXJjZS50b3AgIT0gbnVsbCA/IHNvdXJjZS50b3AgOiBzb3VyY2UueSwgc291cmNlLndpZHRoLCBzb3VyY2UuaGVpZ2h0XSA6IGFyZ3VtZW50cy5sZW5ndGggPT09IDQgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykgOiBiYXNlO1xuICAgICAgdGhpcy54ID0gc291cmNlWzBdIHx8IDA7XG4gICAgICB0aGlzLnkgPSBzb3VyY2VbMV0gfHwgMDtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLncgPSBzb3VyY2VbMl0gfHwgMDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oID0gc291cmNlWzNdIHx8IDA7IC8vIEFkZCBtb3JlIGJvdW5kaW5nIGJveCBwcm9wZXJ0aWVzXG5cbiAgICAgIHRoaXMueDIgPSB0aGlzLnggKyB0aGlzLnc7XG4gICAgICB0aGlzLnkyID0gdGhpcy55ICsgdGhpcy5oO1xuICAgICAgdGhpcy5jeCA9IHRoaXMueCArIHRoaXMudyAvIDI7XG4gICAgICB0aGlzLmN5ID0gdGhpcy55ICsgdGhpcy5oIC8gMjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gTWVyZ2UgcmVjdCBib3ggd2l0aCBhbm90aGVyLCByZXR1cm4gYSBuZXcgaW5zdGFuY2VcblxuICB9LCB7XG4gICAga2V5OiBcIm1lcmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1lcmdlKGJveCkge1xuICAgICAgdmFyIHggPSBNYXRoLm1pbih0aGlzLngsIGJveC54KTtcbiAgICAgIHZhciB5ID0gTWF0aC5taW4odGhpcy55LCBib3gueSk7XG4gICAgICB2YXIgd2lkdGggPSBNYXRoLm1heCh0aGlzLnggKyB0aGlzLndpZHRoLCBib3gueCArIGJveC53aWR0aCkgLSB4O1xuICAgICAgdmFyIGhlaWdodCA9IE1hdGgubWF4KHRoaXMueSArIHRoaXMuaGVpZ2h0LCBib3gueSArIGJveC5oZWlnaHQpIC0geTtcbiAgICAgIHJldHVybiBuZXcgQm94KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2Zvcm1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtKG0pIHtcbiAgICAgIGlmICghKG0gaW5zdGFuY2VvZiBNYXRyaXgpKSB7XG4gICAgICAgIG0gPSBuZXcgTWF0cml4KG0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgeE1pbiA9IEluZmluaXR5O1xuICAgICAgdmFyIHhNYXggPSAtSW5maW5pdHk7XG4gICAgICB2YXIgeU1pbiA9IEluZmluaXR5O1xuICAgICAgdmFyIHlNYXggPSAtSW5maW5pdHk7XG4gICAgICB2YXIgcHRzID0gW25ldyBQb2ludCh0aGlzLngsIHRoaXMueSksIG5ldyBQb2ludCh0aGlzLngyLCB0aGlzLnkpLCBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkyKSwgbmV3IFBvaW50KHRoaXMueDIsIHRoaXMueTIpXTtcbiAgICAgIHB0cy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHAgPSBwLnRyYW5zZm9ybShtKTtcbiAgICAgICAgeE1pbiA9IE1hdGgubWluKHhNaW4sIHAueCk7XG4gICAgICAgIHhNYXggPSBNYXRoLm1heCh4TWF4LCBwLngpO1xuICAgICAgICB5TWluID0gTWF0aC5taW4oeU1pbiwgcC55KTtcbiAgICAgICAgeU1heCA9IE1hdGgubWF4KHlNYXgsIHAueSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgQm94KHhNaW4sIHlNaW4sIHhNYXggLSB4TWluLCB5TWF4IC0geU1pbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZE9mZnNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRPZmZzZXQoKSB7XG4gICAgICAvLyBvZmZzZXQgYnkgd2luZG93IHNjcm9sbCBwb3NpdGlvbiwgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgY2hhbmdlcyB3aGVuIHdpbmRvdyBpcyBzY3JvbGxlZFxuICAgICAgdGhpcy54ICs9IGdsb2JhbHMud2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgdGhpcy55ICs9IGdsb2JhbHMud2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMueCArICcgJyArIHRoaXMueSArICcgJyArIHRoaXMud2lkdGggKyAnICcgKyB0aGlzLmhlaWdodDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9BcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHRdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc051bGxlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc051bGxlZCgpIHtcbiAgICAgIHJldHVybiBpc051bGxlZEJveCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQm94O1xufSgpO1xuXG5mdW5jdGlvbiBnZXRCb3goY2IsIHJldHJ5KSB7XG4gIHZhciBib3g7XG5cbiAgdHJ5IHtcbiAgICBib3ggPSBjYih0aGlzLm5vZGUpO1xuXG4gICAgaWYgKGlzTnVsbGVkQm94KGJveCkgJiYgIWRvbUNvbnRhaW5zKHRoaXMubm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBub3QgaW4gdGhlIGRvbScpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGJveCA9IHJldHJ5KHRoaXMpO1xuICB9XG5cbiAgcmV0dXJuIGJveDtcbn1cblxuZnVuY3Rpb24gYmJveCgpIHtcbiAgcmV0dXJuIG5ldyBCb3goZ2V0Qm94LmNhbGwodGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRCQm94KCk7XG4gIH0sIGZ1bmN0aW9uIChlbCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgY2xvbmUgPSBlbC5jbG9uZSgpLmFkZFRvKHBhcnNlcigpLnN2Zykuc2hvdygpO1xuICAgICAgdmFyIGJveCA9IGNsb25lLm5vZGUuZ2V0QkJveCgpO1xuICAgICAgY2xvbmUucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gYm94O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2V0dGluZyBiYm94IG9mIGVsZW1lbnQgXCInICsgZWwubm9kZS5ub2RlTmFtZSArICdcIiBpcyBub3QgcG9zc2libGUuICcgKyBlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfSkpO1xufVxuZnVuY3Rpb24gcmJveChlbCkge1xuICB2YXIgYm94ID0gbmV3IEJveChnZXRCb3guY2FsbCh0aGlzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9LCBmdW5jdGlvbiAoZWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dldHRpbmcgcmJveCBvZiBlbGVtZW50IFwiJyArIGVsLm5vZGUubm9kZU5hbWUgKyAnXCIgaXMgbm90IHBvc3NpYmxlJyk7XG4gIH0pKTtcbiAgaWYgKGVsKSByZXR1cm4gYm94LnRyYW5zZm9ybShlbC5zY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICByZXR1cm4gYm94LmFkZE9mZnNldCgpO1xufVxucmVnaXN0ZXJNZXRob2RzKHtcbiAgdmlld2JveDoge1xuICAgIHZpZXdib3g6IGZ1bmN0aW9uIHZpZXdib3goeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgLy8gYWN0IGFzIGdldHRlclxuICAgICAgaWYgKHggPT0gbnVsbCkgcmV0dXJuIG5ldyBCb3godGhpcy5hdHRyKCd2aWV3Qm94JykpOyAvLyBhY3QgYXMgc2V0dGVyXG5cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3ZpZXdCb3gnLCBuZXcgQm94KHgsIHksIHdpZHRoLCBoZWlnaHQpKTtcbiAgICB9LFxuICAgIHpvb206IGZ1bmN0aW9uIHpvb20obGV2ZWwsIHBvaW50KSB7XG4gICAgICB2YXIgd2lkdGggPSB0aGlzLm5vZGUuY2xpZW50V2lkdGg7XG4gICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5ub2RlLmNsaWVudEhlaWdodDtcbiAgICAgIHZhciB2ID0gdGhpcy52aWV3Ym94KCk7IC8vIEZpcmVmb3ggZG9lcyBub3Qgc3VwcG9ydCBjbGllbnRIZWlnaHQgYW5kIHJldHVybnMgMFxuICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODc0ODExXG5cbiAgICAgIGlmICghd2lkdGggJiYgIWhlaWdodCkge1xuICAgICAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5vZGUpO1xuICAgICAgICB3aWR0aCA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSk7XG4gICAgICAgIGhlaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JykpO1xuICAgICAgfVxuXG4gICAgICB2YXIgem9vbVggPSB3aWR0aCAvIHYud2lkdGg7XG4gICAgICB2YXIgem9vbVkgPSBoZWlnaHQgLyB2LmhlaWdodDtcbiAgICAgIHZhciB6b29tID0gTWF0aC5taW4oem9vbVgsIHpvb21ZKTtcblxuICAgICAgaWYgKGxldmVsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHpvb207XG4gICAgICB9XG5cbiAgICAgIHZhciB6b29tQW1vdW50ID0gem9vbSAvIGxldmVsO1xuICAgICAgaWYgKHpvb21BbW91bnQgPT09IEluZmluaXR5KSB6b29tQW1vdW50ID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgIHBvaW50ID0gcG9pbnQgfHwgbmV3IFBvaW50KHdpZHRoIC8gMiAvIHpvb21YICsgdi54LCBoZWlnaHQgLyAyIC8gem9vbVkgKyB2LnkpO1xuICAgICAgdmFyIGJveCA9IG5ldyBCb3godikudHJhbnNmb3JtKG5ldyBNYXRyaXgoe1xuICAgICAgICBzY2FsZTogem9vbUFtb3VudCxcbiAgICAgICAgb3JpZ2luOiBwb2ludFxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHRoaXMudmlld2JveChib3gpO1xuICAgIH1cbiAgfVxufSk7XG5yZWdpc3RlcihCb3gsICdCb3gnKTtcblxuLyogZXNsaW50IG5vLW5ldy1mdW5jOiBcIm9mZlwiICovXG52YXIgc3ViQ2xhc3NBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvLyB0cnkgZXM2IHN1YmNsYXNzaW5nXG4gICAgcmV0dXJuIEZ1bmN0aW9uKCduYW1lJywgJ2Jhc2VDbGFzcycsICdfY29uc3RydWN0b3InLCBbJ2Jhc2VDbGFzcyA9IGJhc2VDbGFzcyB8fCBBcnJheScsICdyZXR1cm4geycsICcgIFtuYW1lXTogY2xhc3MgZXh0ZW5kcyBiYXNlQ2xhc3MgeycsICcgICAgY29uc3RydWN0b3IgKC4uLmFyZ3MpIHsnLCAnICAgICAgc3VwZXIoLi4uYXJncyknLCAnICAgICAgX2NvbnN0cnVjdG9yICYmIF9jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmdzKScsICcgICAgfScsICcgIH0nLCAnfVtuYW1lXSddLmpvaW4oJ1xcbicpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFVzZSBlczUgYXBwcm9hY2hcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBiYXNlQ2xhc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IEFycmF5O1xuXG4gICAgICB2YXIgX2NvbnN0cnVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICAgIHZhciBBcnIgPSBmdW5jdGlvbiBBcnIoKSB7XG4gICAgICAgIGJhc2VDbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBfY29uc3RydWN0b3IgJiYgX2NvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuXG4gICAgICBBcnIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlQ2xhc3MucHJvdG90eXBlKTtcbiAgICAgIEFyci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBcnI7XG5cbiAgICAgIEFyci5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHZhciBhcnIgPSBuZXcgQXJyKCk7XG4gICAgICAgIGFyci5wdXNoLmFwcGx5KGFyciwgQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKHRoaXMsIGZuKSk7XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQXJyO1xuICAgIH07XG4gIH1cbn0oKTtcblxudmFyIExpc3QgPSBzdWJDbGFzc0FycmF5KCdMaXN0JywgQXJyYXksIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFyciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIC8vIFRoaXMgY2F0Y2hlcyB0aGUgY2FzZSwgdGhhdCBuYXRpdmUgbWFwIHRyaWVzIHRvIGNyZWF0ZSBhbiBhcnJheSB3aXRoIG5ldyBBcnJheSgxKVxuICBpZiAodHlwZW9mIGFyciA9PT0gJ251bWJlcicpIHJldHVybiB0aGlzO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMucHVzaC5hcHBseSh0aGlzLCBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSk7XG59KTtcbmV4dGVuZChMaXN0LCB7XG4gIGVhY2g6IGZ1bmN0aW9uIGVhY2goZm5Pck1ldGhvZE5hbWUpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGZuT3JNZXRob2ROYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBmbk9yTWV0aG9kTmFtZS5jYWxsKGVsLCBlbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWxbZm5Pck1ldGhvZE5hbWVdLmFwcGx5KGVsLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgdGhpcyk7XG4gIH1cbn0pO1xudmFyIHJlc2VydmVkID0gWyd0b0FycmF5JywgJ2NvbnN0cnVjdG9yJywgJ2VhY2gnXTtcblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiAobWV0aG9kcykge1xuICBtZXRob2RzID0gbWV0aG9kcy5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwgbmFtZSkge1xuICAgIC8vIERvbid0IG92ZXJ3cml0ZSBvd24gbWV0aG9kc1xuICAgIGlmIChyZXNlcnZlZC5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIG9iajsgLy8gRG9uJ3QgYWRkIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgaWYgKG5hbWVbMF0gPT09ICdfJykgcmV0dXJuIG9iajsgLy8gUmVsYXkgZXZlcnkgY2FsbCB0byBlYWNoKClcblxuICAgIG9ialtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXR0cnMgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXR0cnNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaC5hcHBseSh0aGlzLCBbbmFtZV0uY29uY2F0KGF0dHJzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbiAgZXh0ZW5kKExpc3QsIG1ldGhvZHMpO1xufTtcblxuZnVuY3Rpb24gYmFzZUZpbmQocXVlcnksIHBhcmVudCkge1xuICByZXR1cm4gbmV3IExpc3QobWFwKChwYXJlbnQgfHwgZ2xvYmFscy5kb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChxdWVyeSksIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFkb3B0KG5vZGUpO1xuICB9KSk7XG59IC8vIFNjb3BlZCBmaW5kIG1ldGhvZFxuXG5mdW5jdGlvbiBmaW5kKHF1ZXJ5KSB7XG4gIHJldHVybiBiYXNlRmluZChxdWVyeSwgdGhpcy5ub2RlKTtcbn1cbmZ1bmN0aW9uIGZpbmRPbmUocXVlcnkpIHtcbiAgcmV0dXJuIGFkb3B0KHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSk7XG59XG5cbnZhciBFdmVudFRhcmdldCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0Jhc2UpIHtcbiAgX2luaGVyaXRzKEV2ZW50VGFyZ2V0LCBfQmFzZSk7XG5cbiAgZnVuY3Rpb24gRXZlbnRUYXJnZXQoKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBfcmVmJGV2ZW50cyA9IF9yZWYuZXZlbnRzLFxuICAgICAgICBldmVudHMgPSBfcmVmJGV2ZW50cyA9PT0gdm9pZCAwID8ge30gOiBfcmVmJGV2ZW50cztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFdmVudFRhcmdldCk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihFdmVudFRhcmdldCkuY2FsbCh0aGlzKSk7XG4gICAgX3RoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhFdmVudFRhcmdldCwgW3tcbiAgICBrZXk6IFwiYWRkRXZlbnRMaXN0ZW5lclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKCkge31cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaCQxKGV2ZW50LCBkYXRhKSB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2godGhpcywgZXZlbnQsIGRhdGEpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZXZlbnQpIHtcbiAgICAgIHZhciBiYWcgPSB0aGlzLmdldEV2ZW50SG9sZGVyKCkuZXZlbnRzO1xuICAgICAgaWYgKCFiYWcpIHJldHVybiB0cnVlO1xuICAgICAgdmFyIGV2ZW50cyA9IGJhZ1tldmVudC50eXBlXTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBldmVudHMpIHtcbiAgICAgICAgZm9yICh2YXIgaiBpbiBldmVudHNbaV0pIHtcbiAgICAgICAgICBldmVudHNbaV1bal0oZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcbiAgICB9IC8vIEZpcmUgZ2l2ZW4gZXZlbnRcblxuICB9LCB7XG4gICAga2V5OiBcImZpcmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlyZShldmVudCwgZGF0YSkge1xuICAgICAgdGhpcy5kaXNwYXRjaChldmVudCwgZGF0YSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXZlbnRIb2xkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXZlbnRIb2xkZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXZlbnRUYXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFVuYmluZCBldmVudCBmcm9tIGxpc3RlbmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJvZmZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb2ZmJDEoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICBvZmYodGhpcywgZXZlbnQsIGxpc3RlbmVyKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBCaW5kIGdpdmVuIGV2ZW50IHRvIGxpc3RlbmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbiQxKGV2ZW50LCBsaXN0ZW5lciwgYmluZGluZywgb3B0aW9ucykge1xuICAgICAgb24odGhpcywgZXZlbnQsIGxpc3RlbmVyLCBiaW5kaW5nLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHt9XG4gIH1dKTtcblxuICByZXR1cm4gRXZlbnRUYXJnZXQ7XG59KEJhc2UpO1xucmVnaXN0ZXIoRXZlbnRUYXJnZXQsICdFdmVudFRhcmdldCcpO1xuXG5mdW5jdGlvbiBub29wKCkge30gLy8gRGVmYXVsdCBhbmltYXRpb24gdmFsdWVzXG5cbnZhciB0aW1lbGluZSA9IHtcbiAgZHVyYXRpb246IDQwMCxcbiAgZWFzZTogJz4nLFxuICBkZWxheTogMFxufTsgLy8gRGVmYXVsdCBhdHRyaWJ1dGUgdmFsdWVzXG5cbnZhciBhdHRycyA9IHtcbiAgLy8gZmlsbCBhbmQgc3Ryb2tlXG4gICdmaWxsLW9wYWNpdHknOiAxLFxuICAnc3Ryb2tlLW9wYWNpdHknOiAxLFxuICAnc3Ryb2tlLXdpZHRoJzogMCxcbiAgJ3N0cm9rZS1saW5lam9pbic6ICdtaXRlcicsXG4gICdzdHJva2UtbGluZWNhcCc6ICdidXR0JyxcbiAgZmlsbDogJyMwMDAwMDAnLFxuICBzdHJva2U6ICcjMDAwMDAwJyxcbiAgb3BhY2l0eTogMSxcbiAgLy8gcG9zaXRpb25cbiAgeDogMCxcbiAgeTogMCxcbiAgY3g6IDAsXG4gIGN5OiAwLFxuICAvLyBzaXplXG4gIHdpZHRoOiAwLFxuICBoZWlnaHQ6IDAsXG4gIC8vIHJhZGl1c1xuICByOiAwLFxuICByeDogMCxcbiAgcnk6IDAsXG4gIC8vIGdyYWRpZW50XG4gIG9mZnNldDogMCxcbiAgJ3N0b3Atb3BhY2l0eSc6IDEsXG4gICdzdG9wLWNvbG9yJzogJyMwMDAwMDAnLFxuICAvLyB0ZXh0XG4gICd0ZXh0LWFuY2hvcic6ICdzdGFydCdcbn07XG5cbnZhciBkZWZhdWx0cyA9ICh7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0bm9vcDogbm9vcCxcblx0dGltZWxpbmU6IHRpbWVsaW5lLFxuXHRhdHRyczogYXR0cnNcbn0pO1xuXG52YXIgU1ZHQXJyYXkgPSBzdWJDbGFzc0FycmF5KCdTVkdBcnJheScsIEFycmF5LCBmdW5jdGlvbiAoYXJyKSB7XG4gIHRoaXMuaW5pdChhcnIpO1xufSk7XG5leHRlbmQoU1ZHQXJyYXksIHtcbiAgaW5pdDogZnVuY3Rpb24gaW5pdChhcnIpIHtcbiAgICAvLyBUaGlzIGNhdGNoZXMgdGhlIGNhc2UsIHRoYXQgbmF0aXZlIG1hcCB0cmllcyB0byBjcmVhdGUgYW4gYXJyYXkgd2l0aCBuZXcgQXJyYXkoMSlcbiAgICBpZiAodHlwZW9mIGFyciA9PT0gJ251bWJlcicpIHJldHVybiB0aGlzO1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLnB1c2guYXBwbHkodGhpcywgX3RvQ29uc3VtYWJsZUFycmF5KHRoaXMucGFyc2UoYXJyKSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB0aGlzKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmpvaW4oJyAnKTtcbiAgfSxcbiAgLy8gRmxhdHRlbnMgdGhlIGFycmF5IGlmIG5lZWRlZFxuICB2YWx1ZU9mOiBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgIHZhciByZXQgPSBbXTtcbiAgICByZXQucHVzaC5hcHBseShyZXQsIF90b0NvbnN1bWFibGVBcnJheSh0aGlzKSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgLy8gUGFyc2Ugd2hpdGVzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nXG4gIHBhcnNlOiBmdW5jdGlvbiBwYXJzZSgpIHtcbiAgICB2YXIgYXJyYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICAgIC8vIElmIGFscmVhZHkgaXMgYW4gYXJyYXksIG5vIG5lZWQgdG8gcGFyc2UgaXRcbiAgICBpZiAoYXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgcmV0dXJuIGFycmF5O1xuICAgIHJldHVybiBhcnJheS50cmltKCkuc3BsaXQoZGVsaW1pdGVyKS5tYXAocGFyc2VGbG9hdCk7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XG4gIH0sXG4gIHRvU2V0OiBmdW5jdGlvbiB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzKTtcbiAgfVxufSk7XG5cbnZhciBTVkdOdW1iZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICAvLyBJbml0aWFsaXplXG4gIGZ1bmN0aW9uIFNWR051bWJlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU1ZHTnVtYmVyKTtcblxuICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNWR051bWJlciwgW3tcbiAgICBrZXk6IFwiaW5pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHZhbHVlLCB1bml0KSB7XG4gICAgICB1bml0ID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZVsxXSA6IHVuaXQ7XG4gICAgICB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbMF0gOiB2YWx1ZTsgLy8gaW5pdGlhbGl6ZSBkZWZhdWx0c1xuXG4gICAgICB0aGlzLnZhbHVlID0gMDtcbiAgICAgIHRoaXMudW5pdCA9IHVuaXQgfHwgJyc7IC8vIHBhcnNlIHZhbHVlXG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIGVuc3VyZSBhIHZhbGlkIG51bWVyaWMgdmFsdWVcbiAgICAgICAgdGhpcy52YWx1ZSA9IGlzTmFOKHZhbHVlKSA/IDAgOiAhaXNGaW5pdGUodmFsdWUpID8gdmFsdWUgPCAwID8gLTMuNGUrMzggOiArMy40ZSszOCA6IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHVuaXQgPSB2YWx1ZS5tYXRjaChudW1iZXJBbmRVbml0KTtcblxuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgIC8vIG1ha2UgdmFsdWUgbnVtZXJpY1xuICAgICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KHVuaXRbMV0pOyAvLyBub3JtYWxpemVcblxuICAgICAgICAgIGlmICh1bml0WzVdID09PSAnJScpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgLz0gMTAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAodW5pdFs1XSA9PT0gJ3MnKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICo9IDEwMDA7XG4gICAgICAgICAgfSAvLyBzdG9yZSB1bml0XG5cblxuICAgICAgICAgIHRoaXMudW5pdCA9IHVuaXRbNV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNWR051bWJlcikge1xuICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgICAgICAgdGhpcy51bml0ID0gdmFsdWUudW5pdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9TdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gKHRoaXMudW5pdCA9PT0gJyUnID8gfn4odGhpcy52YWx1ZSAqIDFlOCkgLyAxZTYgOiB0aGlzLnVuaXQgPT09ICdzJyA/IHRoaXMudmFsdWUgLyAxZTMgOiB0aGlzLnZhbHVlKSArIHRoaXMudW5pdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9KU09OXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHJldHVybiBbdGhpcy52YWx1ZSwgdGhpcy51bml0XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVPZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfSAvLyBBZGQgbnVtYmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJwbHVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsdXMobnVtYmVyKSB7XG4gICAgICBudW1iZXIgPSBuZXcgU1ZHTnVtYmVyKG51bWJlcik7XG4gICAgICByZXR1cm4gbmV3IFNWR051bWJlcih0aGlzICsgbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpO1xuICAgIH0gLy8gU3VidHJhY3QgbnVtYmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJtaW51c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtaW51cyhudW1iZXIpIHtcbiAgICAgIG51bWJlciA9IG5ldyBTVkdOdW1iZXIobnVtYmVyKTtcbiAgICAgIHJldHVybiBuZXcgU1ZHTnVtYmVyKHRoaXMgLSBudW1iZXIsIHRoaXMudW5pdCB8fCBudW1iZXIudW5pdCk7XG4gICAgfSAvLyBNdWx0aXBseSBudW1iZXJcblxuICB9LCB7XG4gICAga2V5OiBcInRpbWVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbWVzKG51bWJlcikge1xuICAgICAgbnVtYmVyID0gbmV3IFNWR051bWJlcihudW1iZXIpO1xuICAgICAgcmV0dXJuIG5ldyBTVkdOdW1iZXIodGhpcyAqIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KTtcbiAgICB9IC8vIERpdmlkZSBudW1iZXJcblxuICB9LCB7XG4gICAga2V5OiBcImRpdmlkZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXZpZGUobnVtYmVyKSB7XG4gICAgICBudW1iZXIgPSBuZXcgU1ZHTnVtYmVyKG51bWJlcik7XG4gICAgICByZXR1cm4gbmV3IFNWR051bWJlcih0aGlzIC8gbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb252ZXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbnZlcnQodW5pdCkge1xuICAgICAgcmV0dXJuIG5ldyBTVkdOdW1iZXIodGhpcy52YWx1ZSwgdW5pdCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNWR051bWJlcjtcbn0oKTtcblxudmFyIGhvb2tzID0gW107XG5mdW5jdGlvbiByZWdpc3RlckF0dHJIb29rKGZuKSB7XG4gIGhvb2tzLnB1c2goZm4pO1xufSAvLyBTZXQgc3ZnIGVsZW1lbnQgYXR0cmlidXRlXG5cbmZ1bmN0aW9uIGF0dHIoYXR0ciwgdmFsLCBucykge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIC8vIGFjdCBhcyBmdWxsIGdldHRlclxuICBpZiAoYXR0ciA9PSBudWxsKSB7XG4gICAgLy8gZ2V0IGFuIG9iamVjdCBvZiBhdHRyaWJ1dGVzXG4gICAgYXR0ciA9IHt9O1xuICAgIHZhbCA9IHRoaXMubm9kZS5hdHRyaWJ1dGVzO1xuICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdmFsW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICB2YXIgbm9kZSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICBhdHRyW25vZGUubm9kZU5hbWVdID0gaXNOdW1iZXIudGVzdChub2RlLm5vZGVWYWx1ZSkgPyBwYXJzZUZsb2F0KG5vZGUubm9kZVZhbHVlKSA6IG5vZGUubm9kZVZhbHVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuICE9IG51bGwpIHtcbiAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHI7XG4gIH0gZWxzZSBpZiAoYXR0ciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGFuZCBnZXQgYWxsIHZhbHVlc1xuICAgIHJldHVybiBhdHRyLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgY3Vycikge1xuICAgICAgbGFzdFtjdXJyXSA9IF90aGlzLmF0dHIoY3Vycik7XG4gICAgICByZXR1cm4gbGFzdDtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSBpZiAoX3R5cGVvZihhdHRyKSA9PT0gJ29iamVjdCcgJiYgYXR0ci5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgLy8gYXBwbHkgZXZlcnkgYXR0cmlidXRlIGluZGl2aWR1YWxseSBpZiBhbiBvYmplY3QgaXMgcGFzc2VkXG4gICAgZm9yICh2YWwgaW4gYXR0cikge1xuICAgICAgdGhpcy5hdHRyKHZhbCwgYXR0clt2YWxdKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodmFsID09PSBudWxsKSB7XG4gICAgLy8gcmVtb3ZlIHZhbHVlXG4gICAgdGhpcy5ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgfSBlbHNlIGlmICh2YWwgPT0gbnVsbCkge1xuICAgIC8vIGFjdCBhcyBhIGdldHRlciBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgYXJndW1lbnQgaXMgbm90IGFuIG9iamVjdFxuICAgIHZhbCA9IHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgcmV0dXJuIHZhbCA9PSBudWxsID8gYXR0cnNbYXR0cl0gOiBpc051bWJlci50ZXN0KHZhbCkgPyBwYXJzZUZsb2F0KHZhbCkgOiB2YWw7XG4gIH0gZWxzZSB7XG4gICAgLy8gTG9vcCB0aHJvdWdoIGhvb2tzIGFuZCBleGVjdXRlIHRoZW0gdG8gY29udmVydCB2YWx1ZVxuICAgIHZhbCA9IGhvb2tzLnJlZHVjZShmdW5jdGlvbiAoX3ZhbCwgaG9vaykge1xuICAgICAgcmV0dXJuIGhvb2soYXR0ciwgX3ZhbCwgX3RoaXMpO1xuICAgIH0sIHZhbCk7IC8vIGVuc3VyZSBjb3JyZWN0IG51bWVyaWMgdmFsdWVzIChhbHNvIGFjY2VwdHMgTmFOIGFuZCBJbmZpbml0eSlcblxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsID0gbmV3IFNWR051bWJlcih2YWwpO1xuICAgIH0gZWxzZSBpZiAoQ29sb3IuaXNDb2xvcih2YWwpKSB7XG4gICAgICAvLyBlbnN1cmUgZnVsbCBoZXggY29sb3JcbiAgICAgIHZhbCA9IG5ldyBDb2xvcih2YWwpO1xuICAgIH0gZWxzZSBpZiAodmFsLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgLy8gQ2hlY2sgZm9yIHBsYWluIGFycmF5cyBhbmQgcGFyc2UgYXJyYXkgdmFsdWVzXG4gICAgICB2YWwgPSBuZXcgU1ZHQXJyYXkodmFsKTtcbiAgICB9IC8vIGlmIHRoZSBwYXNzZWQgYXR0cmlidXRlIGlzIGxlYWRpbmcuLi5cblxuXG4gICAgaWYgKGF0dHIgPT09ICdsZWFkaW5nJykge1xuICAgICAgLy8gLi4uIGNhbGwgdGhlIGxlYWRpbmcgbWV0aG9kIGluc3RlYWRcbiAgICAgIGlmICh0aGlzLmxlYWRpbmcpIHtcbiAgICAgICAgdGhpcy5sZWFkaW5nKHZhbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNldCBnaXZlbiBhdHRyaWJ1dGUgb24gbm9kZVxuICAgICAgdHlwZW9mIG5zID09PSAnc3RyaW5nJyA/IHRoaXMubm9kZS5zZXRBdHRyaWJ1dGVOUyhucywgYXR0ciwgdmFsLnRvU3RyaW5nKCkpIDogdGhpcy5ub2RlLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwudG9TdHJpbmcoKSk7XG4gICAgfSAvLyByZWJ1aWxkIGlmIHJlcXVpcmVkXG5cblxuICAgIGlmICh0aGlzLnJlYnVpbGQgJiYgKGF0dHIgPT09ICdmb250LXNpemUnIHx8IGF0dHIgPT09ICd4JykpIHtcbiAgICAgIHRoaXMucmVidWlsZCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuXG52YXIgRG9tID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRXZlbnRUYXJnZXQpIHtcbiAgX2luaGVyaXRzKERvbSwgX0V2ZW50VGFyZ2V0KTtcblxuICBmdW5jdGlvbiBEb20obm9kZSwgYXR0cnMpIHtcbiAgICB2YXIgX3RoaXMyO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvbSk7XG5cbiAgICBfdGhpczIgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRG9tKS5jYWxsKHRoaXMsIG5vZGUpKTtcbiAgICBfdGhpczIubm9kZSA9IG5vZGU7XG4gICAgX3RoaXMyLnR5cGUgPSBub2RlLm5vZGVOYW1lO1xuXG4gICAgaWYgKGF0dHJzICYmIG5vZGUgIT09IGF0dHJzKSB7XG4gICAgICBfdGhpczIuYXR0cihhdHRycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGlzMjtcbiAgfSAvLyBBZGQgZ2l2ZW4gZWxlbWVudCBhdCBhIHBvc2l0aW9uXG5cblxuICBfY3JlYXRlQ2xhc3MoRG9tLCBbe1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGVsZW1lbnQsIGkpIHtcbiAgICAgIGVsZW1lbnQgPSBtYWtlSW5zdGFuY2UoZWxlbWVudCk7XG5cbiAgICAgIGlmIChpID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGVsZW1lbnQubm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubm9kZSAhPT0gdGhpcy5ub2RlLmNoaWxkTm9kZXNbaV0pIHtcbiAgICAgICAgdGhpcy5ub2RlLmluc2VydEJlZm9yZShlbGVtZW50Lm5vZGUsIHRoaXMubm9kZS5jaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBBZGQgZWxlbWVudCB0byBnaXZlbiBjb250YWluZXIgYW5kIHJldHVybiBzZWxmXG5cbiAgfSwge1xuICAgIGtleTogXCJhZGRUb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRUbyhwYXJlbnQpIHtcbiAgICAgIHJldHVybiBtYWtlSW5zdGFuY2UocGFyZW50KS5wdXQodGhpcyk7XG4gICAgfSAvLyBSZXR1cm5zIGFsbCBjaGlsZCBlbGVtZW50c1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2hpbGRyZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2hpbGRyZW4oKSB7XG4gICAgICByZXR1cm4gbmV3IExpc3QobWFwKHRoaXMubm9kZS5jaGlsZHJlbiwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGFkb3B0KG5vZGUpO1xuICAgICAgfSkpO1xuICAgIH0gLy8gUmVtb3ZlIGFsbCBlbGVtZW50cyBpbiB0aGlzIGNvbnRhaW5lclxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAvLyByZW1vdmUgY2hpbGRyZW5cbiAgICAgIHdoaWxlICh0aGlzLm5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUubGFzdENoaWxkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBDbG9uZSBlbGVtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJjbG9uZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgIC8vIHdyaXRlIGRvbSBkYXRhIHRvIHRoZSBkb20gc28gdGhlIGNsb25lIGNhbiBwaWNrdXAgdGhlIGRhdGFcbiAgICAgIHRoaXMud3JpdGVEYXRhVG9Eb20oKTsgLy8gY2xvbmUgZWxlbWVudCBhbmQgYXNzaWduIG5ldyBpZFxuXG4gICAgICByZXR1cm4gYXNzaWduTmV3SWQodGhpcy5ub2RlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfSAvLyBJdGVyYXRlcyBvdmVyIGFsbCBjaGlsZHJlbiBhbmQgaW52b2tlcyBhIGdpdmVuIGJsb2NrXG5cbiAgfSwge1xuICAgIGtleTogXCJlYWNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVhY2goYmxvY2ssIGRlZXApIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4oKTtcbiAgICAgIHZhciBpLCBpbDtcblxuICAgICAgZm9yIChpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGJsb2NrLmFwcGx5KGNoaWxkcmVuW2ldLCBbaSwgY2hpbGRyZW5dKTtcblxuICAgICAgICBpZiAoZGVlcCkge1xuICAgICAgICAgIGNoaWxkcmVuW2ldLmVhY2goYmxvY2ssIGRlZXApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbGVtZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVsZW1lbnQobm9kZU5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgRG9tKGNyZWF0ZShub2RlTmFtZSkpKTtcbiAgICB9IC8vIEdldCBmaXJzdCBjaGlsZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZmlyc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlyc3QoKSB7XG4gICAgICByZXR1cm4gYWRvcHQodGhpcy5ub2RlLmZpcnN0Q2hpbGQpO1xuICAgIH0gLy8gR2V0IGEgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXhcblxuICB9LCB7XG4gICAga2V5OiBcImdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQoaSkge1xuICAgICAgcmV0dXJuIGFkb3B0KHRoaXMubm9kZS5jaGlsZE5vZGVzW2ldKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXZlbnRIb2xkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXZlbnRIb2xkZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRFdmVudFRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFdmVudFRhcmdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgfSAvLyBDaGVja3MgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBjaGlsZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaGFzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhcyhlbGVtZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleChlbGVtZW50KSA+PSAwO1xuICAgIH0gLy8gR2V0IC8gc2V0IGlkXG5cbiAgfSwge1xuICAgIGtleTogXCJpZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpZChfaWQpIHtcbiAgICAgIC8vIGdlbmVyYXRlIG5ldyBpZCBpZiBubyBpZCBzZXRcbiAgICAgIGlmICh0eXBlb2YgX2lkID09PSAndW5kZWZpbmVkJyAmJiAhdGhpcy5ub2RlLmlkKSB7XG4gICAgICAgIHRoaXMubm9kZS5pZCA9IGVpZCh0aGlzLnR5cGUpO1xuICAgICAgfSAvLyBkb250J3Qgc2V0IGRpcmVjdGx5IHdpZHRoIHRoaXMubm9kZS5pZCB0byBtYWtlIGBudWxsYCB3b3JrIGNvcnJlY3RseVxuXG5cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2lkJywgX2lkKTtcbiAgICB9IC8vIEdldHMgaW5kZXggb2YgZ2l2ZW4gZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaW5kZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5kZXgoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwodGhpcy5ub2RlLmNoaWxkTm9kZXMpLmluZGV4T2YoZWxlbWVudC5ub2RlKTtcbiAgICB9IC8vIEdldCB0aGUgbGFzdCBjaGlsZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwibGFzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsYXN0KCkge1xuICAgICAgcmV0dXJuIGFkb3B0KHRoaXMubm9kZS5sYXN0Q2hpbGQpO1xuICAgIH0gLy8gbWF0Y2hlcyB0aGUgZWxlbWVudCB2cyBhIGNzcyBzZWxlY3RvclxuXG4gIH0sIHtcbiAgICBrZXk6IFwibWF0Y2hlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXRjaGVzKHNlbGVjdG9yKSB7XG4gICAgICB2YXIgZWwgPSB0aGlzLm5vZGU7XG4gICAgICByZXR1cm4gKGVsLm1hdGNoZXMgfHwgZWwubWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZWwub01hdGNoZXNTZWxlY3RvcikuY2FsbChlbCwgc2VsZWN0b3IpO1xuICAgIH0gLy8gUmV0dXJucyB0aGUgcGFyZW50IGVsZW1lbnQgaW5zdGFuY2VcblxuICB9LCB7XG4gICAga2V5OiBcInBhcmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJlbnQodHlwZSkge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXM7IC8vIGNoZWNrIGZvciBwYXJlbnRcblxuICAgICAgaWYgKCFwYXJlbnQubm9kZS5wYXJlbnROb2RlKSByZXR1cm4gbnVsbDsgLy8gZ2V0IHBhcmVudCBlbGVtZW50XG5cbiAgICAgIHBhcmVudCA9IGFkb3B0KHBhcmVudC5ub2RlLnBhcmVudE5vZGUpO1xuICAgICAgaWYgKCF0eXBlKSByZXR1cm4gcGFyZW50OyAvLyBsb29wIHRyb3VnaCBhbmNlc3RvcnMgaWYgdHlwZSBpcyBnaXZlblxuXG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnQubWF0Y2hlcyh0eXBlKSA6IHBhcmVudCBpbnN0YW5jZW9mIHR5cGUpIHJldHVybiBwYXJlbnQ7XG4gICAgICAgIGlmICghcGFyZW50Lm5vZGUucGFyZW50Tm9kZSB8fCBwYXJlbnQubm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JyB8fCBwYXJlbnQubm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50LWZyYWdtZW50JykgcmV0dXJuIG51bGw7IC8vICM3NTksICM3MjBcblxuICAgICAgICBwYXJlbnQgPSBhZG9wdChwYXJlbnQubm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIH1cbiAgICB9IC8vIEJhc2ljYWxseSBkb2VzIHRoZSBzYW1lIGFzIGBhZGQoKWAgYnV0IHJldHVybnMgdGhlIGFkZGVkIGVsZW1lbnQgaW5zdGVhZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicHV0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1dChlbGVtZW50LCBpKSB7XG4gICAgICB0aGlzLmFkZChlbGVtZW50LCBpKTtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gY29udGFpbmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJwdXRJblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXRJbihwYXJlbnQpIHtcbiAgICAgIHJldHVybiBtYWtlSW5zdGFuY2UocGFyZW50KS5hZGQodGhpcyk7XG4gICAgfSAvLyBSZW1vdmUgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudCgpKSB7XG4gICAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSZW1vdmUgYSBnaXZlbiBjaGlsZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRWxlbWVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZChlbGVtZW50Lm5vZGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSZXBsYWNlIHRoaXMgd2l0aCBlbGVtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJyZXBsYWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcGxhY2UoZWxlbWVudCkge1xuICAgICAgZWxlbWVudCA9IG1ha2VJbnN0YW5jZShlbGVtZW50KTtcbiAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChlbGVtZW50Lm5vZGUsIHRoaXMubm9kZSk7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicm91bmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcm91bmQoKSB7XG4gICAgICB2YXIgcHJlY2lzaW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAyO1xuICAgICAgdmFyIG1hcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICAgICAgdmFyIGF0dHJzID0gdGhpcy5hdHRyKCk7IC8vIElmIHdlIGhhdmUgbm8gbWFwLCBidWlsZCBvbmUgZnJvbSBhdHRyc1xuXG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICBtYXAgPSBPYmplY3Qua2V5cyhhdHRycyk7XG4gICAgICB9IC8vIEhvbGRzIHJvdW5kZWQgYXR0cmlidXRlc1xuXG5cbiAgICAgIHZhciBuZXdBdHRycyA9IHt9O1xuICAgICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBuZXdBdHRyc1trZXldID0gTWF0aC5yb3VuZChhdHRyc1trZXldICogZmFjdG9yKSAvIGZhY3RvcjtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hdHRyKG5ld0F0dHJzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmV0dXJuIGlkIG9uIHN0cmluZyBjb252ZXJzaW9uXG5cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkKCk7XG4gICAgfSAvLyBJbXBvcnQgcmF3IHN2Z1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic3ZnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN2ZyhzdmdPckZuLCBvdXRlckhUTUwpIHtcbiAgICAgIHZhciB3ZWxsLCBsZW4sIGZyYWdtZW50O1xuXG4gICAgICBpZiAoc3ZnT3JGbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ZXJIVE1MID0gZmFsc2U7XG4gICAgICAgIHN2Z09yRm4gPSBudWxsO1xuICAgICAgfSAvLyBhY3QgYXMgZ2V0dGVyIGlmIG5vIHN2ZyBzdHJpbmcgaXMgZ2l2ZW5cblxuXG4gICAgICBpZiAoc3ZnT3JGbiA9PSBudWxsIHx8IHR5cGVvZiBzdmdPckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFRoZSBkZWZhdWx0IGZvciBleHBvcnRzIGlzLCB0aGF0IHRoZSBvdXRlck5vZGUgaXMgaW5jbHVkZWRcbiAgICAgICAgb3V0ZXJIVE1MID0gb3V0ZXJIVE1MID09IG51bGwgPyB0cnVlIDogb3V0ZXJIVE1MOyAvLyB3cml0ZSBzdmdqcyBkYXRhIHRvIHRoZSBkb21cblxuICAgICAgICB0aGlzLndyaXRlRGF0YVRvRG9tKCk7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpczsgLy8gQW4gZXhwb3J0IG1vZGlmaWVyIHdhcyBwYXNzZWRcblxuICAgICAgICBpZiAoc3ZnT3JGbiAhPSBudWxsKSB7XG4gICAgICAgICAgY3VycmVudCA9IGFkb3B0KGN1cnJlbnQubm9kZS5jbG9uZU5vZGUodHJ1ZSkpOyAvLyBJZiB0aGUgdXNlciB3YW50cyBvdXRlckhUTUwgd2UgbmVlZCB0byBwcm9jZXNzIHRoaXMgbm9kZSwgdG9vXG5cbiAgICAgICAgICBpZiAob3V0ZXJIVE1MKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gc3ZnT3JGbihjdXJyZW50KTtcbiAgICAgICAgICAgIGN1cnJlbnQgPSByZXN1bHQgfHwgY3VycmVudDsgLy8gVGhlIHVzZXIgZG9lcyBub3Qgd2FudCB0aGlzIG5vZGU/IFdlbGwsIHRoZW4gaGUgZ2V0cyBub3RoaW5nXG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSByZXR1cm4gJyc7XG4gICAgICAgICAgfSAvLyBEZWVwIGxvb3AgdGhyb3VnaCBhbGwgY2hpbGRyZW4gYW5kIGFwcGx5IG1vZGlmaWVyXG5cblxuICAgICAgICAgIGN1cnJlbnQuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gc3ZnT3JGbih0aGlzKTtcblxuICAgICAgICAgICAgdmFyIF90aGlzID0gcmVzdWx0IHx8IHRoaXM7IC8vIElmIG1vZGlmaWVyIHJldHVybnMgZmFsc2UsIGRpc2NhcmQgbm9kZVxuXG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7IC8vIElmIG1vZGlmaWVyIHJldHVybnMgbmV3IG5vZGUsIHVzZSBpdFxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgJiYgdGhpcyAhPT0gX3RoaXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXBsYWNlKF90aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfSAvLyBSZXR1cm4gb3V0ZXIgb3IgaW5uZXIgY29udGVudFxuXG5cbiAgICAgICAgcmV0dXJuIG91dGVySFRNTCA/IGN1cnJlbnQubm9kZS5vdXRlckhUTUwgOiBjdXJyZW50Lm5vZGUuaW5uZXJIVE1MO1xuICAgICAgfSAvLyBBY3QgYXMgc2V0dGVyIGlmIHdlIGdvdCBhIHN0cmluZ1xuICAgICAgLy8gVGhlIGRlZmF1bHQgZm9yIGltcG9ydCBpcywgdGhhdCB0aGUgY3VycmVudCBub2RlIGlzIG5vdCByZXBsYWNlZFxuXG5cbiAgICAgIG91dGVySFRNTCA9IG91dGVySFRNTCA9PSBudWxsID8gZmFsc2UgOiBvdXRlckhUTUw7IC8vIENyZWF0ZSB0ZW1wb3JhcnkgaG9sZGVyXG5cbiAgICAgIHdlbGwgPSBnbG9iYWxzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICAgZnJhZ21lbnQgPSBnbG9iYWxzLmRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTsgLy8gRHVtcCByYXcgc3ZnXG5cbiAgICAgIHdlbGwuaW5uZXJIVE1MID0gc3ZnT3JGbjsgLy8gVHJhbnNwbGFudCBub2RlcyBpbnRvIHRoZSBmcmFnbWVudFxuXG4gICAgICBmb3IgKGxlbiA9IHdlbGwuY2hpbGRyZW4ubGVuZ3RoOyBsZW4tLTspIHtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQod2VsbC5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCgpOyAvLyBBZGQgdGhlIHdob2xlIGZyYWdtZW50IGF0IG9uY2VcblxuICAgICAgcmV0dXJuIG91dGVySFRNTCA/IHRoaXMucmVwbGFjZShmcmFnbWVudCkgJiYgcGFyZW50IDogdGhpcy5hZGQoZnJhZ21lbnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3b3Jkc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3b3Jkcyh0ZXh0KSB7XG4gICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIHJlbW92aW5nIGFsbCBjaGlsZHJlbiBhbmQgYWRkaW5nIGEgbmV3IG9uZVxuICAgICAgdGhpcy5ub2RlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gd3JpdGUgc3ZnanMgZGF0YSB0byB0aGUgZG9tXG5cbiAgfSwge1xuICAgIGtleTogXCJ3cml0ZURhdGFUb0RvbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cml0ZURhdGFUb0RvbSgpIHtcbiAgICAgIC8vIGR1bXAgdmFyaWFibGVzIHJlY3Vyc2l2ZWx5XG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLndyaXRlRGF0YVRvRG9tKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEb207XG59KEV2ZW50VGFyZ2V0KTtcbmV4dGVuZChEb20sIHtcbiAgYXR0cjogYXR0cixcbiAgZmluZDogZmluZCxcbiAgZmluZE9uZTogZmluZE9uZVxufSk7XG5yZWdpc3RlcihEb20sICdEb20nKTtcblxudmFyIEVsZW1lbnQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Eb20pIHtcbiAgX2luaGVyaXRzKEVsZW1lbnQsIF9Eb20pO1xuXG4gIGZ1bmN0aW9uIEVsZW1lbnQobm9kZSwgYXR0cnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRWxlbWVudCk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihFbGVtZW50KS5jYWxsKHRoaXMsIG5vZGUsIGF0dHJzKSk7IC8vIGluaXRpYWxpemUgZGF0YSBvYmplY3RcblxuICAgIF90aGlzLmRvbSA9IHt9OyAvLyBjcmVhdGUgY2lyY3VsYXIgcmVmZXJlbmNlXG5cbiAgICBfdGhpcy5ub2RlLmluc3RhbmNlID0gX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyk7XG5cbiAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ3N2Z2pzOmRhdGEnKSkge1xuICAgICAgLy8gcHVsbCBzdmdqcyBkYXRhIGZyb20gdGhlIGRvbSAoZ2V0QXR0cmlidXRlTlMgZG9lc24ndCB3b3JrIGluIGh0bWw1KVxuICAgICAgX3RoaXMuc2V0RGF0YShKU09OLnBhcnNlKG5vZGUuZ2V0QXR0cmlidXRlKCdzdmdqczpkYXRhJykpIHx8IHt9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH0gLy8gTW92ZSBlbGVtZW50IGJ5IGl0cyBjZW50ZXJcblxuXG4gIF9jcmVhdGVDbGFzcyhFbGVtZW50LCBbe1xuICAgIGtleTogXCJjZW50ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2VudGVyKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmN4KHgpLmN5KHkpO1xuICAgIH0gLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcImN4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGN4KHgpIHtcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLngoKSArIHRoaXMud2lkdGgoKSAvIDIgOiB0aGlzLngoeCAtIHRoaXMud2lkdGgoKSAvIDIpO1xuICAgIH0gLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB5LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcImN5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGN5KHkpIHtcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLnkoKSArIHRoaXMuaGVpZ2h0KCkgLyAyIDogdGhpcy55KHkgLSB0aGlzLmhlaWdodCgpIC8gMik7XG4gICAgfSAvLyBHZXQgZGVmc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGVmc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZzKCkge1xuICAgICAgcmV0dXJuIHRoaXMucm9vdCgpLmRlZnMoKTtcbiAgICB9IC8vIFJlbGF0aXZlIG1vdmUgb3ZlciB4IGFuZCB5IGF4ZXNcblxuICB9LCB7XG4gICAga2V5OiBcImRtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRtb3ZlKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmR4KHgpLmR5KHkpO1xuICAgIH0gLy8gUmVsYXRpdmUgbW92ZSBvdmVyIHggYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZHhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHgoKSB7XG4gICAgICB2YXIgeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICAgIHJldHVybiB0aGlzLngobmV3IFNWR051bWJlcih4KS5wbHVzKHRoaXMueCgpKSk7XG4gICAgfSAvLyBSZWxhdGl2ZSBtb3ZlIG92ZXIgeSBheGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJkeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkeSgpIHtcbiAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgICAgcmV0dXJuIHRoaXMueShuZXcgU1ZHTnVtYmVyKHkpLnBsdXModGhpcy55KCkpKTtcbiAgICB9IC8vIEdldCBwYXJlbnQgZG9jdW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcInJvb3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcm9vdCQxKCkge1xuICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudChnZXRDbGFzcyhyb290KSk7XG4gICAgICByZXR1cm4gcCAmJiBwLnJvb3QoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXZlbnRIb2xkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXZlbnRIb2xkZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaGVpZ2h0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhlaWdodChfaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdoZWlnaHQnLCBfaGVpZ2h0KTtcbiAgICB9IC8vIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBwb2ludCBpbnNpZGUgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaW5zaWRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluc2lkZSh4LCB5KSB7XG4gICAgICB2YXIgYm94ID0gdGhpcy5iYm94KCk7XG4gICAgICByZXR1cm4geCA+IGJveC54ICYmIHkgPiBib3gueSAmJiB4IDwgYm94LnggKyBib3gud2lkdGggJiYgeSA8IGJveC55ICsgYm94LmhlaWdodDtcbiAgICB9IC8vIE1vdmUgZWxlbWVudCB0byBnaXZlbiB4IGFuZCB5IHZhbHVlc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLngoeCkueSh5KTtcbiAgICB9IC8vIHJldHVybiBhcnJheSBvZiBhbGwgYW5jZXN0b3JzIG9mIGdpdmVuIHR5cGUgdXAgdG8gdGhlIHJvb3Qgc3ZnXG5cbiAgfSwge1xuICAgIGtleTogXCJwYXJlbnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcmVudHMoKSB7XG4gICAgICB2YXIgdW50aWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGdsb2JhbHMuZG9jdW1lbnQ7XG4gICAgICB1bnRpbCA9IG1ha2VJbnN0YW5jZSh1bnRpbCk7XG4gICAgICB2YXIgcGFyZW50cyA9IG5ldyBMaXN0KCk7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcztcblxuICAgICAgd2hpbGUgKChwYXJlbnQgPSBwYXJlbnQucGFyZW50KCkpICYmIHBhcmVudC5ub2RlICE9PSB1bnRpbC5ub2RlICYmIHBhcmVudC5ub2RlICE9PSBnbG9iYWxzLmRvY3VtZW50KSB7XG4gICAgICAgIHBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyZW50cztcbiAgICB9IC8vIEdldCByZWZlcmVuY2VkIGVsZW1lbnQgZm9ybSBhdHRyaWJ1dGUgdmFsdWVcblxuICB9LCB7XG4gICAga2V5OiBcInJlZmVyZW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWZlcmVuY2UkMShhdHRyKSB7XG4gICAgICBhdHRyID0gdGhpcy5hdHRyKGF0dHIpO1xuICAgICAgaWYgKCFhdHRyKSByZXR1cm4gbnVsbDtcbiAgICAgIHZhciBtID0gYXR0ci5tYXRjaChyZWZlcmVuY2UpO1xuICAgICAgcmV0dXJuIG0gPyBtYWtlSW5zdGFuY2UobVsxXSkgOiBudWxsO1xuICAgIH0gLy8gc2V0IGdpdmVuIGRhdGEgdG8gdGhlIGVsZW1lbnRzIGRhdGEgcHJvcGVydHlcblxuICB9LCB7XG4gICAga2V5OiBcInNldERhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0RGF0YShvKSB7XG4gICAgICB0aGlzLmRvbSA9IG87XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFNldCBlbGVtZW50IHNpemUgdG8gZ2l2ZW4gd2lkdGggYW5kIGhlaWdodFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoKG5ldyBTVkdOdW1iZXIocC53aWR0aCkpLmhlaWdodChuZXcgU1ZHTnVtYmVyKHAuaGVpZ2h0KSk7XG4gICAgfSAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwid2lkdGhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2lkdGgoX3dpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd3aWR0aCcsIF93aWR0aCk7XG4gICAgfSAvLyB3cml0ZSBzdmdqcyBkYXRhIHRvIHRoZSBkb21cblxuICB9LCB7XG4gICAga2V5OiBcIndyaXRlRGF0YVRvRG9tXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdyaXRlRGF0YVRvRG9tKCkge1xuICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzbHkgc2V0IGRhdGFcbiAgICAgIHRoaXMubm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3N2Z2pzOmRhdGEnKTtcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZG9tKS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnNldEF0dHJpYnV0ZSgnc3ZnanM6ZGF0YScsIEpTT04uc3RyaW5naWZ5KHRoaXMuZG9tKSk7IC8vIHNlZSAjNDI4XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihFbGVtZW50LnByb3RvdHlwZSksIFwid3JpdGVEYXRhVG9Eb21cIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9IC8vIE1vdmUgb3ZlciB4LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcInhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geChfeCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIF94KTtcbiAgICB9IC8vIE1vdmUgb3ZlciB5LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcInlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geShfeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneScsIF95KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRWxlbWVudDtcbn0oRG9tKTtcbmV4dGVuZChFbGVtZW50LCB7XG4gIGJib3g6IGJib3gsXG4gIHJib3g6IHJib3gsXG4gIHBvaW50OiBwb2ludCxcbiAgY3RtOiBjdG0sXG4gIHNjcmVlbkNUTTogc2NyZWVuQ1RNXG59KTtcbnJlZ2lzdGVyKEVsZW1lbnQsICdFbGVtZW50Jyk7XG5cbnZhciBzdWdhciA9IHtcbiAgc3Ryb2tlOiBbJ2NvbG9yJywgJ3dpZHRoJywgJ29wYWNpdHknLCAnbGluZWNhcCcsICdsaW5lam9pbicsICdtaXRlcmxpbWl0JywgJ2Rhc2hhcnJheScsICdkYXNob2Zmc2V0J10sXG4gIGZpbGw6IFsnY29sb3InLCAnb3BhY2l0eScsICdydWxlJ10sXG4gIHByZWZpeDogZnVuY3Rpb24gcHJlZml4KHQsIGEpIHtcbiAgICByZXR1cm4gYSA9PT0gJ2NvbG9yJyA/IHQgOiB0ICsgJy0nICsgYTtcbiAgfVxufSAvLyBBZGQgc3VnYXIgZm9yIGZpbGwgYW5kIHN0cm9rZVxuO1xuWydmaWxsJywgJ3N0cm9rZSddLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgdmFyIGV4dGVuc2lvbiA9IHt9O1xuICB2YXIgaTtcblxuICBleHRlbnNpb25bbV0gPSBmdW5jdGlvbiAobykge1xuICAgIGlmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIobSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvID09PSAnc3RyaW5nJyB8fCBvIGluc3RhbmNlb2YgQ29sb3IgfHwgQ29sb3IuaXNSZ2IobykgfHwgbyBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuYXR0cihtLCBvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2V0IGFsbCBhdHRyaWJ1dGVzIGZyb20gc3VnYXIuZmlsbCBhbmQgc3VnYXIuc3Ryb2tlIGxpc3RcbiAgICAgIGZvciAoaSA9IHN1Z2FyW21dLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChvW3N1Z2FyW21dW2ldXSAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5hdHRyKHN1Z2FyLnByZWZpeChtLCBzdWdhclttXVtpXSksIG9bc3VnYXJbbV1baV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJlZ2lzdGVyTWV0aG9kcyhbJ0VsZW1lbnQnLCAnUnVubmVyJ10sIGV4dGVuc2lvbik7XG59KTtcbnJlZ2lzdGVyTWV0aG9kcyhbJ0VsZW1lbnQnLCAnUnVubmVyJ10sIHtcbiAgLy8gTGV0IHRoZSB1c2VyIHNldCB0aGUgbWF0cml4IGRpcmVjdGx5XG4gIG1hdHJpeDogZnVuY3Rpb24gbWF0cml4KG1hdCwgYiwgYywgZCwgZSwgZikge1xuICAgIC8vIEFjdCBhcyBhIGdldHRlclxuICAgIGlmIChtYXQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcyk7XG4gICAgfSAvLyBBY3QgYXMgYSBzZXR0ZXIsIHRoZSB1c2VyIGNhbiBwYXNzIGEgbWF0cml4IG9yIGEgc2V0IG9mIG51bWJlcnNcblxuXG4gICAgcmV0dXJuIHRoaXMuYXR0cigndHJhbnNmb3JtJywgbmV3IE1hdHJpeChtYXQsIGIsIGMsIGQsIGUsIGYpKTtcbiAgfSxcbiAgLy8gTWFwIHJvdGF0aW9uIHRvIHRyYW5zZm9ybVxuICByb3RhdGU6IGZ1bmN0aW9uIHJvdGF0ZShhbmdsZSwgY3gsIGN5KSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIHJvdGF0ZTogYW5nbGUsXG4gICAgICBveDogY3gsXG4gICAgICBveTogY3lcbiAgICB9LCB0cnVlKTtcbiAgfSxcbiAgLy8gTWFwIHNrZXcgdG8gdHJhbnNmb3JtXG4gIHNrZXc6IGZ1bmN0aW9uIHNrZXcoeCwgeSwgY3gsIGN5KSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIHNrZXc6IHgsXG4gICAgICBveDogeSxcbiAgICAgIG95OiBjeFxuICAgIH0sIHRydWUpIDogdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgc2tldzogW3gsIHldLFxuICAgICAgb3g6IGN4LFxuICAgICAgb3k6IGN5XG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIHNoZWFyOiBmdW5jdGlvbiBzaGVhcihsYW0sIGN4LCBjeSkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7XG4gICAgICBzaGVhcjogbGFtLFxuICAgICAgb3g6IGN4LFxuICAgICAgb3k6IGN5XG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIC8vIE1hcCBzY2FsZSB0byB0cmFuc2Zvcm1cbiAgc2NhbGU6IGZ1bmN0aW9uIHNjYWxlKHgsIHksIGN4LCBjeSkge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyB0aGlzLnRyYW5zZm9ybSh7XG4gICAgICBzY2FsZTogeCxcbiAgICAgIG94OiB5LFxuICAgICAgb3k6IGN4XG4gICAgfSwgdHJ1ZSkgOiB0aGlzLnRyYW5zZm9ybSh7XG4gICAgICBzY2FsZTogW3gsIHldLFxuICAgICAgb3g6IGN4LFxuICAgICAgb3k6IGN5XG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIC8vIE1hcCB0cmFuc2xhdGUgdG8gdHJhbnNmb3JtXG4gIHRyYW5zbGF0ZTogZnVuY3Rpb24gdHJhbnNsYXRlKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgdHJhbnNsYXRlOiBbeCwgeV1cbiAgICB9LCB0cnVlKTtcbiAgfSxcbiAgLy8gTWFwIHJlbGF0aXZlIHRyYW5zbGF0aW9ucyB0byB0cmFuc2Zvcm1cbiAgcmVsYXRpdmU6IGZ1bmN0aW9uIHJlbGF0aXZlKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgcmVsYXRpdmU6IFt4LCB5XVxuICAgIH0sIHRydWUpO1xuICB9LFxuICAvLyBNYXAgZmxpcCB0byB0cmFuc2Zvcm1cbiAgZmxpcDogZnVuY3Rpb24gZmxpcChkaXJlY3Rpb24sIGFyb3VuZCkge1xuICAgIHZhciBkaXJlY3Rpb25TdHJpbmcgPSB0eXBlb2YgZGlyZWN0aW9uID09PSAnc3RyaW5nJyA/IGRpcmVjdGlvbiA6IGlzRmluaXRlKGRpcmVjdGlvbikgPyAnYm90aCcgOiAnYm90aCc7XG4gICAgdmFyIG9yaWdpbiA9IGRpcmVjdGlvbiA9PT0gJ2JvdGgnICYmIGlzRmluaXRlKGFyb3VuZCkgPyBbYXJvdW5kLCBhcm91bmRdIDogZGlyZWN0aW9uID09PSAneCcgPyBbYXJvdW5kLCAwXSA6IGRpcmVjdGlvbiA9PT0gJ3knID8gWzAsIGFyb3VuZF0gOiBpc0Zpbml0ZShkaXJlY3Rpb24pID8gW2RpcmVjdGlvbiwgZGlyZWN0aW9uXSA6IFswLCAwXTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgZmxpcDogZGlyZWN0aW9uU3RyaW5nLFxuICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICB9LCB0cnVlKTtcbiAgfSxcbiAgLy8gT3BhY2l0eVxuICBvcGFjaXR5OiBmdW5jdGlvbiBvcGFjaXR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cignb3BhY2l0eScsIHZhbHVlKTtcbiAgfVxufSk7XG5yZWdpc3Rlck1ldGhvZHMoJ3JhZGl1cycsIHtcbiAgLy8gQWRkIHggYW5kIHkgcmFkaXVzXG4gIHJhZGl1czogZnVuY3Rpb24gcmFkaXVzKHgsIHkpIHtcbiAgICB2YXIgdHlwZSA9ICh0aGlzLl9lbGVtZW50IHx8IHRoaXMpLnR5cGU7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdyYWRpYWxHcmFkaWVudCcgfHwgdHlwZSA9PT0gJ3JhZGlhbEdyYWRpZW50JyA/IHRoaXMuYXR0cigncicsIG5ldyBTVkdOdW1iZXIoeCkpIDogdGhpcy5yeCh4KS5yeSh5ID09IG51bGwgPyB4IDogeSk7XG4gIH1cbn0pO1xucmVnaXN0ZXJNZXRob2RzKCdQYXRoJywge1xuICAvLyBHZXQgcGF0aCBsZW5ndGhcbiAgbGVuZ3RoOiBmdW5jdGlvbiBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZS5nZXRUb3RhbExlbmd0aCgpO1xuICB9LFxuICAvLyBHZXQgcG9pbnQgYXQgbGVuZ3RoXG4gIHBvaW50QXQ6IGZ1bmN0aW9uIHBvaW50QXQobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLm5vZGUuZ2V0UG9pbnRBdExlbmd0aChsZW5ndGgpKTtcbiAgfVxufSk7XG5yZWdpc3Rlck1ldGhvZHMoWydFbGVtZW50JywgJ1J1bm5lciddLCB7XG4gIC8vIFNldCBmb250XG4gIGZvbnQ6IGZ1bmN0aW9uIGZvbnQoYSwgdikge1xuICAgIGlmIChfdHlwZW9mKGEpID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yICh2IGluIGEpIHtcbiAgICAgICAgdGhpcy5mb250KHYsIGFbdl0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gJ2xlYWRpbmcnID8gdGhpcy5sZWFkaW5nKHYpIDogYSA9PT0gJ2FuY2hvcicgPyB0aGlzLmF0dHIoJ3RleHQtYW5jaG9yJywgdikgOiBhID09PSAnc2l6ZScgfHwgYSA9PT0gJ2ZhbWlseScgfHwgYSA9PT0gJ3dlaWdodCcgfHwgYSA9PT0gJ3N0cmV0Y2gnIHx8IGEgPT09ICd2YXJpYW50JyB8fCBhID09PSAnc3R5bGUnID8gdGhpcy5hdHRyKCdmb250LScgKyBhLCB2KSA6IHRoaXMuYXR0cihhLCB2KTtcbiAgfVxufSk7XG5yZWdpc3Rlck1ldGhvZHMoJ1RleHQnLCB7XG4gIGF4OiBmdW5jdGlvbiBheCh4KSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIHgpO1xuICB9LFxuICBheTogZnVuY3Rpb24gYXkoeSkge1xuICAgIHJldHVybiB0aGlzLmF0dHIoJ3knLCB5KTtcbiAgfSxcbiAgYW1vdmU6IGZ1bmN0aW9uIGFtb3ZlKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5heCh4KS5heSh5KTtcbiAgfVxufSk7IC8vIEFkZCBldmVudHMgdG8gZWxlbWVudHNcblxudmFyIG1ldGhvZHMkMSA9IFsnY2xpY2snLCAnZGJsY2xpY2snLCAnbW91c2Vkb3duJywgJ21vdXNldXAnLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0JywgJ21vdXNlbW92ZScsICdtb3VzZWVudGVyJywgJ21vdXNlbGVhdmUnLCAndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hsZWF2ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgZXZlbnQpIHtcbiAgLy8gYWRkIGV2ZW50IHRvIEVsZW1lbnRcbiAgdmFyIGZuID0gZnVuY3Rpb24gZm4oZikge1xuICAgIGlmIChmID09PSBudWxsKSB7XG4gICAgICBvZmYodGhpcywgZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbih0aGlzLCBldmVudCwgZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgbGFzdFtldmVudF0gPSBmbjtcbiAgcmV0dXJuIGxhc3Q7XG59LCB7fSk7XG5yZWdpc3Rlck1ldGhvZHMoJ0VsZW1lbnQnLCBtZXRob2RzJDEpO1xuXG52YXIgbmF0aXZlUmV2ZXJzZSA9IFtdLnJldmVyc2U7XG52YXIgdGVzdCQxID0gWzEsIDJdO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnJldmVyc2VgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJldmVyc2Vcbi8vIGZpeCBmb3IgU2FmYXJpIDEyLjAgYnVnXG4vLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTg4Nzk0XG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBTdHJpbmcodGVzdCQxKSA9PT0gU3RyaW5nKHRlc3QkMS5yZXZlcnNlKCkpIH0sIHtcbiAgcmV2ZXJzZTogZnVuY3Rpb24gcmV2ZXJzZSgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1hc3NpZ25cbiAgICBpZiAoaXNBcnJheSh0aGlzKSkgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICByZXR1cm4gbmF0aXZlUmV2ZXJzZS5jYWxsKHRoaXMpO1xuICB9XG59KTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0aWVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhZGVzY3JpcHRvcnMsIHNoYW06ICFkZXNjcmlwdG9ycyB9LCB7XG4gIGRlZmluZVByb3BlcnRpZXM6IG9iamVjdERlZmluZVByb3BlcnRpZXNcbn0pO1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogIWRlc2NyaXB0b3JzLCBzaGFtOiAhZGVzY3JpcHRvcnMgfSwge1xuICBkZWZpbmVQcm9wZXJ0eTogb2JqZWN0RGVmaW5lUHJvcGVydHkuZlxufSk7XG5cbnZhciBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMiA9IG9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvci5mO1xuXG5cbnZhciBGQUlMU19PTl9QUklNSVRJVkVTJDIgPSBmYWlscyhmdW5jdGlvbiAoKSB7IG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciQyKDEpOyB9KTtcbnZhciBGT1JDRUQkMyA9ICFkZXNjcmlwdG9ycyB8fCBGQUlMU19PTl9QUklNSVRJVkVTJDI7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3Jcbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IEZPUkNFRCQzLCBzaGFtOiAhZGVzY3JpcHRvcnMgfSwge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gICAgcmV0dXJuIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciQyKHRvSW5kZXhlZE9iamVjdChpdCksIGtleSk7XG4gIH1cbn0pO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5ZGVzY3JpcHRvcnNcbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBzaGFtOiAhZGVzY3JpcHRvcnMgfSwge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IG9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvci5mO1xuICAgIHZhciBrZXlzID0gb3duS2V5cyhPKTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIga2V5LCBkZXNjcmlwdG9yO1xuICAgIHdoaWxlIChrZXlzLmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIGtleSA9IGtleXNbaW5kZXgrK10pO1xuICAgICAgaWYgKGRlc2NyaXB0b3IgIT09IHVuZGVmaW5lZCkgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIG93bktleXMkMShvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307IGlmIChpICUgMikgeyBvd25LZXlzJDEoc291cmNlLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pOyB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7IH0gZWxzZSB7IG93bktleXMkMShzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIHVudHJhbnNmb3JtKCkge1xuICByZXR1cm4gdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCBudWxsKTtcbn0gLy8gbWVyZ2UgdGhlIHdob2xlIHRyYW5zZm9ybWF0aW9uIGNoYWluIGludG8gb25lIG1hdHJpeCBhbmQgcmV0dXJucyBpdFxuXG5mdW5jdGlvbiBtYXRyaXhpZnkoKSB7XG4gIHZhciBtYXRyaXggPSAodGhpcy5hdHRyKCd0cmFuc2Zvcm0nKSB8fCAnJykuIC8vIHNwbGl0IHRyYW5zZm9ybWF0aW9uc1xuICBzcGxpdCh0cmFuc2Zvcm1zKS5zbGljZSgwLCAtMSkubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAvLyBnZW5lcmF0ZSBrZXkgPT4gdmFsdWUgcGFpcnNcbiAgICB2YXIga3YgPSBzdHIudHJpbSgpLnNwbGl0KCcoJyk7XG4gICAgcmV0dXJuIFtrdlswXSwga3ZbMV0uc3BsaXQoZGVsaW1pdGVyKS5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc3RyKTtcbiAgICB9KV07XG4gIH0pLnJldmVyc2UoKSAvLyBtZXJnZSBldmVyeSB0cmFuc2Zvcm1hdGlvbiBpbnRvIG9uZSBtYXRyaXhcbiAgLnJlZHVjZShmdW5jdGlvbiAobWF0cml4LCB0cmFuc2Zvcm0pIHtcbiAgICBpZiAodHJhbnNmb3JtWzBdID09PSAnbWF0cml4Jykge1xuICAgICAgcmV0dXJuIG1hdHJpeC5sbXVsdGlwbHkoTWF0cml4LmZyb21BcnJheSh0cmFuc2Zvcm1bMV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0cml4W3RyYW5zZm9ybVswXV0uYXBwbHkobWF0cml4LCB0cmFuc2Zvcm1bMV0pO1xuICB9LCBuZXcgTWF0cml4KCkpO1xuICByZXR1cm4gbWF0cml4O1xufSAvLyBhZGQgYW4gZWxlbWVudCB0byBhbm90aGVyIHBhcmVudCB3aXRob3V0IGNoYW5naW5nIHRoZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb24gdGhlIHNjcmVlblxuXG5mdW5jdGlvbiB0b1BhcmVudChwYXJlbnQpIHtcbiAgaWYgKHRoaXMgPT09IHBhcmVudCkgcmV0dXJuIHRoaXM7XG4gIHZhciBjdG0gPSB0aGlzLnNjcmVlbkNUTSgpO1xuICB2YXIgcEN0bSA9IHBhcmVudC5zY3JlZW5DVE0oKS5pbnZlcnNlKCk7XG4gIHRoaXMuYWRkVG8ocGFyZW50KS51bnRyYW5zZm9ybSgpLnRyYW5zZm9ybShwQ3RtLm11bHRpcGx5KGN0bSkpO1xuICByZXR1cm4gdGhpcztcbn0gLy8gc2FtZSBhcyBhYm92ZSB3aXRoIHBhcmVudCBlcXVhbHMgcm9vdC1zdmdcblxuZnVuY3Rpb24gdG9Sb290KCkge1xuICByZXR1cm4gdGhpcy50b1BhcmVudCh0aGlzLnJvb3QoKSk7XG59IC8vIEFkZCB0cmFuc2Zvcm1hdGlvbnNcblxuZnVuY3Rpb24gdHJhbnNmb3JtKG8sIHJlbGF0aXZlKSB7XG4gIC8vIEFjdCBhcyBhIGdldHRlciBpZiBubyBvYmplY3Qgd2FzIHBhc3NlZFxuICBpZiAobyA9PSBudWxsIHx8IHR5cGVvZiBvID09PSAnc3RyaW5nJykge1xuICAgIHZhciBkZWNvbXBvc2VkID0gbmV3IE1hdHJpeCh0aGlzKS5kZWNvbXBvc2UoKTtcbiAgICByZXR1cm4gbyA9PSBudWxsID8gZGVjb21wb3NlZCA6IGRlY29tcG9zZWRbb107XG4gIH1cblxuICBpZiAoIU1hdHJpeC5pc01hdHJpeExpa2UobykpIHtcbiAgICAvLyBTZXQgdGhlIG9yaWdpbiBhY2NvcmRpbmcgdG8gdGhlIGRlZmluZWQgdHJhbnNmb3JtXG4gICAgbyA9IF9vYmplY3RTcHJlYWQoe30sIG8sIHtcbiAgICAgIG9yaWdpbjogZ2V0T3JpZ2luKG8sIHRoaXMpXG4gICAgfSk7XG4gIH0gLy8gVGhlIHVzZXIgY2FuIHBhc3MgYSBib29sZWFuLCBhbiBFbGVtZW50IG9yIGFuIE1hdHJpeCBvciBub3RoaW5nXG5cblxuICB2YXIgY2xlYW5SZWxhdGl2ZSA9IHJlbGF0aXZlID09PSB0cnVlID8gdGhpcyA6IHJlbGF0aXZlIHx8IGZhbHNlO1xuICB2YXIgcmVzdWx0ID0gbmV3IE1hdHJpeChjbGVhblJlbGF0aXZlKS50cmFuc2Zvcm0obyk7XG4gIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIHJlc3VsdCk7XG59XG5yZWdpc3Rlck1ldGhvZHMoJ0VsZW1lbnQnLCB7XG4gIHVudHJhbnNmb3JtOiB1bnRyYW5zZm9ybSxcbiAgbWF0cml4aWZ5OiBtYXRyaXhpZnksXG4gIHRvUGFyZW50OiB0b1BhcmVudCxcbiAgdG9Sb290OiB0b1Jvb3QsXG4gIHRyYW5zZm9ybTogdHJhbnNmb3JtXG59KTtcblxuZnVuY3Rpb24gcngocngpIHtcbiAgcmV0dXJuIHRoaXMuYXR0cigncngnLCByeCk7XG59IC8vIFJhZGl1cyB5IHZhbHVlXG5cbmZ1bmN0aW9uIHJ5KHJ5KSB7XG4gIHJldHVybiB0aGlzLmF0dHIoJ3J5JywgcnkpO1xufSAvLyBNb3ZlIG92ZXIgeC1heGlzXG5cbmZ1bmN0aW9uIHgoeCkge1xuICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5jeCgpIC0gdGhpcy5yeCgpIDogdGhpcy5jeCh4ICsgdGhpcy5yeCgpKTtcbn0gLy8gTW92ZSBvdmVyIHktYXhpc1xuXG5mdW5jdGlvbiB5KHkpIHtcbiAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuY3koKSAtIHRoaXMucnkoKSA6IHRoaXMuY3koeSArIHRoaXMucnkoKSk7XG59IC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXG5cbmZ1bmN0aW9uIGN4KHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuYXR0cignY3gnKSA6IHRoaXMuYXR0cignY3gnLCB4KTtcbn0gLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB5LWF4aXNcblxuZnVuY3Rpb24gY3koeSkge1xuICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5hdHRyKCdjeScpIDogdGhpcy5hdHRyKCdjeScsIHkpO1xufSAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuXG5mdW5jdGlvbiB3aWR0aCh3aWR0aCkge1xuICByZXR1cm4gd2lkdGggPT0gbnVsbCA/IHRoaXMucngoKSAqIDIgOiB0aGlzLnJ4KG5ldyBTVkdOdW1iZXIod2lkdGgpLmRpdmlkZSgyKSk7XG59IC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxuXG5mdW5jdGlvbiBoZWlnaHQoaGVpZ2h0KSB7XG4gIHJldHVybiBoZWlnaHQgPT0gbnVsbCA/IHRoaXMucnkoKSAqIDIgOiB0aGlzLnJ5KG5ldyBTVkdOdW1iZXIoaGVpZ2h0KS5kaXZpZGUoMikpO1xufVxuXG52YXIgY2lyY2xlZCA9ICh7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0cng6IHJ4LFxuXHRyeTogcnksXG5cdHg6IHgsXG5cdHk6IHksXG5cdGN4OiBjeCxcblx0Y3k6IGN5LFxuXHR3aWR0aDogd2lkdGgsXG5cdGhlaWdodDogaGVpZ2h0XG59KTtcblxudmFyIFNoYXBlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRWxlbWVudCkge1xuICBfaW5oZXJpdHMoU2hhcGUsIF9FbGVtZW50KTtcblxuICBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2hhcGUpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTaGFwZSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICByZXR1cm4gU2hhcGU7XG59KEVsZW1lbnQpO1xucmVnaXN0ZXIoU2hhcGUsICdTaGFwZScpO1xuXG52YXIgQ2lyY2xlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKENpcmNsZSwgX1NoYXBlKTtcblxuICBmdW5jdGlvbiBDaXJjbGUobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaXJjbGUpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihDaXJjbGUpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdjaXJjbGUnLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENpcmNsZSwgW3tcbiAgICBrZXk6IFwicmFkaXVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJhZGl1cyhyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdyJywgcik7XG4gICAgfSAvLyBSYWRpdXMgeCB2YWx1ZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwicnhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcngoX3J4KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdyJywgX3J4KTtcbiAgICB9IC8vIEFsaWFzIHJhZGl1cyB4IHZhbHVlXG5cbiAgfSwge1xuICAgIGtleTogXCJyeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByeShfcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ4KF9yeSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2l6ZShfc2l6ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmFkaXVzKG5ldyBTVkdOdW1iZXIoX3NpemUpLmRpdmlkZSgyKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENpcmNsZTtcbn0oU2hhcGUpO1xuZXh0ZW5kKENpcmNsZSwge1xuICB4OiB4LFxuICB5OiB5LFxuICBjeDogY3gsXG4gIGN5OiBjeSxcbiAgd2lkdGg6IHdpZHRoLFxuICBoZWlnaHQ6IGhlaWdodFxufSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgY2lyY2xlIGVsZW1lbnRcbiAgICBjaXJjbGU6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uIChzaXplKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IENpcmNsZSgpKS5zaXplKHNpemUpLm1vdmUoMCwgMCk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihDaXJjbGUsICdDaXJjbGUnKTtcblxudmFyIENvbnRhaW5lciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0VsZW1lbnQpIHtcbiAgX2luaGVyaXRzKENvbnRhaW5lciwgX0VsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIENvbnRhaW5lcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29udGFpbmVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoQ29udGFpbmVyKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb250YWluZXIsIFt7XG4gICAga2V5OiBcImZsYXR0ZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmxhdHRlbihwYXJlbnQpIHtcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQ29udGFpbmVyKSByZXR1cm4gdGhpcy5mbGF0dGVuKHBhcmVudCkudW5ncm91cChwYXJlbnQpO1xuICAgICAgICByZXR1cm4gdGhpcy50b1BhcmVudChwYXJlbnQpO1xuICAgICAgfSk7IC8vIHdlIG5lZWQgdGhpcyBzbyB0aGF0IHRoZSByb290IGRvZXMgbm90IGdldCByZW1vdmVkXG5cbiAgICAgIHRoaXMubm9kZS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnJlbW92ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVuZ3JvdXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5ncm91cChwYXJlbnQpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudCB8fCB0aGlzLnBhcmVudCgpO1xuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9QYXJlbnQocGFyZW50KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb250YWluZXI7XG59KEVsZW1lbnQpO1xucmVnaXN0ZXIoQ29udGFpbmVyLCAnQ29udGFpbmVyJyk7XG5cbnZhciBEZWZzID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhEZWZzLCBfQ29udGFpbmVyKTtcblxuICBmdW5jdGlvbiBEZWZzKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGVmcyk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKERlZnMpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdkZWZzJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhEZWZzLCBbe1xuICAgIGtleTogXCJmbGF0dGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZsYXR0ZW4oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidW5ncm91cFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bmdyb3VwKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERlZnM7XG59KENvbnRhaW5lcik7XG5yZWdpc3RlcihEZWZzLCAnRGVmcycpO1xuXG52YXIgRWxsaXBzZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhFbGxpcHNlLCBfU2hhcGUpO1xuXG4gIGZ1bmN0aW9uIEVsbGlwc2Uobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFbGxpcHNlKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRWxsaXBzZSkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ2VsbGlwc2UnLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEVsbGlwc2UsIFt7XG4gICAga2V5OiBcInNpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICByZXR1cm4gdGhpcy5yeChuZXcgU1ZHTnVtYmVyKHAud2lkdGgpLmRpdmlkZSgyKSkucnkobmV3IFNWR051bWJlcihwLmhlaWdodCkuZGl2aWRlKDIpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRWxsaXBzZTtcbn0oU2hhcGUpO1xuZXh0ZW5kKEVsbGlwc2UsIGNpcmNsZWQpO1xucmVnaXN0ZXJNZXRob2RzKCdDb250YWluZXInLCB7XG4gIC8vIENyZWF0ZSBhbiBlbGxpcHNlXG4gIGVsbGlwc2U6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd2lkdGggPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgdmFyIGhlaWdodCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogd2lkdGg7XG4gICAgcmV0dXJuIHRoaXMucHV0KG5ldyBFbGxpcHNlKCkpLnNpemUod2lkdGgsIGhlaWdodCkubW92ZSgwLCAwKTtcbiAgfSlcbn0pO1xucmVnaXN0ZXIoRWxsaXBzZSwgJ0VsbGlwc2UnKTtcblxudmFyIFN0b3AgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FbGVtZW50KSB7XG4gIF9pbmhlcml0cyhTdG9wLCBfRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gU3RvcChub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN0b3ApO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTdG9wKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnc3RvcCcsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gYWRkIGNvbG9yIHN0b3BzXG5cblxuICBfY3JlYXRlQ2xhc3MoU3RvcCwgW3tcbiAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShvKSB7XG4gICAgICBpZiAodHlwZW9mIG8gPT09ICdudW1iZXInIHx8IG8gaW5zdGFuY2VvZiBTVkdOdW1iZXIpIHtcbiAgICAgICAgbyA9IHtcbiAgICAgICAgICBvZmZzZXQ6IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICBjb2xvcjogYXJndW1lbnRzWzFdLFxuICAgICAgICAgIG9wYWNpdHk6IGFyZ3VtZW50c1syXVxuICAgICAgICB9O1xuICAgICAgfSAvLyBzZXQgYXR0cmlidXRlc1xuXG5cbiAgICAgIGlmIChvLm9wYWNpdHkgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLW9wYWNpdHknLCBvLm9wYWNpdHkpO1xuICAgICAgaWYgKG8uY29sb3IgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLWNvbG9yJywgby5jb2xvcik7XG4gICAgICBpZiAoby5vZmZzZXQgIT0gbnVsbCkgdGhpcy5hdHRyKCdvZmZzZXQnLCBuZXcgU1ZHTnVtYmVyKG8ub2Zmc2V0KSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3RvcDtcbn0oRWxlbWVudCk7XG5yZWdpc3RlcihTdG9wLCAnU3RvcCcpO1xuXG5mdW5jdGlvbiBmcm9tKHgsIHkpIHtcbiAgcmV0dXJuICh0aGlzLl9lbGVtZW50IHx8IHRoaXMpLnR5cGUgPT09ICdyYWRpYWxHcmFkaWVudCcgPyB0aGlzLmF0dHIoe1xuICAgIGZ4OiBuZXcgU1ZHTnVtYmVyKHgpLFxuICAgIGZ5OiBuZXcgU1ZHTnVtYmVyKHkpXG4gIH0pIDogdGhpcy5hdHRyKHtcbiAgICB4MTogbmV3IFNWR051bWJlcih4KSxcbiAgICB5MTogbmV3IFNWR051bWJlcih5KVxuICB9KTtcbn1cbmZ1bmN0aW9uIHRvKHgsIHkpIHtcbiAgcmV0dXJuICh0aGlzLl9lbGVtZW50IHx8IHRoaXMpLnR5cGUgPT09ICdyYWRpYWxHcmFkaWVudCcgPyB0aGlzLmF0dHIoe1xuICAgIGN4OiBuZXcgU1ZHTnVtYmVyKHgpLFxuICAgIGN5OiBuZXcgU1ZHTnVtYmVyKHkpXG4gIH0pIDogdGhpcy5hdHRyKHtcbiAgICB4MjogbmV3IFNWR051bWJlcih4KSxcbiAgICB5MjogbmV3IFNWR051bWJlcih5KVxuICB9KTtcbn1cblxudmFyIGdyYWRpZW50ZWQgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdGZyb206IGZyb20sXG5cdHRvOiB0b1xufSk7XG5cbnZhciBHcmFkaWVudCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoR3JhZGllbnQsIF9Db250YWluZXIpO1xuXG4gIGZ1bmN0aW9uIEdyYWRpZW50KHR5cGUsIGF0dHJzKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEdyYWRpZW50KTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoR3JhZGllbnQpLmNhbGwodGhpcywgbm9kZU9yTmV3KHR5cGUgKyAnR3JhZGllbnQnLCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyBudWxsIDogdHlwZSksIGF0dHJzKSk7XG4gIH0gLy8gQWRkIGEgY29sb3Igc3RvcFxuXG5cbiAgX2NyZWF0ZUNsYXNzKEdyYWRpZW50LCBbe1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3Aob2Zmc2V0LCBjb2xvciwgb3BhY2l0eSkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTdG9wKCkpLnVwZGF0ZShvZmZzZXQsIGNvbG9yLCBvcGFjaXR5KTtcbiAgICB9IC8vIFVwZGF0ZSBncmFkaWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShibG9jaykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBzdG9wc1xuICAgICAgdGhpcy5jbGVhcigpOyAvLyBpbnZva2UgcGFzc2VkIGJsb2NrXG5cbiAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSZXR1cm4gdGhlIGZpbGwgaWRcblxuICB9LCB7XG4gICAga2V5OiBcInVybFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cmwoKSB7XG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJztcbiAgICB9IC8vIEFsaWFzIHN0cmluZyBjb252ZXJ0aW9uIHRvIGZpbGxcblxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMudXJsKCk7XG4gICAgfSAvLyBjdXN0b20gYXR0ciB0byBoYW5kbGUgdHJhbnNmb3JtXG5cbiAgfSwge1xuICAgIGtleTogXCJhdHRyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dHIoYSwgYiwgYykge1xuICAgICAgaWYgKGEgPT09ICd0cmFuc2Zvcm0nKSBhID0gJ2dyYWRpZW50VHJhbnNmb3JtJztcbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihHcmFkaWVudC5wcm90b3R5cGUpLCBcImF0dHJcIiwgdGhpcykuY2FsbCh0aGlzLCBhLCBiLCBjKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGFyZ2V0c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0YXJnZXRzKCkge1xuICAgICAgcmV0dXJuIGJhc2VGaW5kKCdzdmcgW2ZpbGwqPVwiJyArIHRoaXMuaWQoKSArICdcIl0nKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYmJveFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBiYm94KCkge1xuICAgICAgcmV0dXJuIG5ldyBCb3goKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gR3JhZGllbnQ7XG59KENvbnRhaW5lcik7XG5leHRlbmQoR3JhZGllbnQsIGdyYWRpZW50ZWQpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGdyYWRpZW50IGVsZW1lbnQgaW4gZGVmc1xuICAgIGdyYWRpZW50OiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodHlwZSwgYmxvY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5ncmFkaWVudCh0eXBlLCBibG9jayk7XG4gICAgfSlcbiAgfSxcbiAgLy8gZGVmaW5lIGdyYWRpZW50XG4gIERlZnM6IHtcbiAgICBncmFkaWVudDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHR5cGUsIGJsb2NrKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IEdyYWRpZW50KHR5cGUpKS51cGRhdGUoYmxvY2spO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoR3JhZGllbnQsICdHcmFkaWVudCcpO1xuXG52YXIgUGF0dGVybiA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoUGF0dGVybiwgX0NvbnRhaW5lcik7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFBhdHRlcm4obm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQYXR0ZXJuKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUGF0dGVybikuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3BhdHRlcm4nLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIFJldHVybiB0aGUgZmlsbCBpZFxuXG5cbiAgX2NyZWF0ZUNsYXNzKFBhdHRlcm4sIFt7XG4gICAga2V5OiBcInVybFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cmwoKSB7XG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJztcbiAgICB9IC8vIFVwZGF0ZSBwYXR0ZXJuIGJ5IHJlYnVpbGRpbmdcblxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoYmxvY2spIHtcbiAgICAgIC8vIHJlbW92ZSBjb250ZW50XG4gICAgICB0aGlzLmNsZWFyKCk7IC8vIGludm9rZSBwYXNzZWQgYmxvY2tcblxuICAgICAgaWYgKHR5cGVvZiBibG9jayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBibG9jay5jYWxsKHRoaXMsIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIEFsaWFzIHN0cmluZyBjb252ZXJ0aW9uIHRvIGZpbGxcblxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMudXJsKCk7XG4gICAgfSAvLyBjdXN0b20gYXR0ciB0byBoYW5kbGUgdHJhbnNmb3JtXG5cbiAgfSwge1xuICAgIGtleTogXCJhdHRyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dHIoYSwgYiwgYykge1xuICAgICAgaWYgKGEgPT09ICd0cmFuc2Zvcm0nKSBhID0gJ3BhdHRlcm5UcmFuc2Zvcm0nO1xuICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKFBhdHRlcm4ucHJvdG90eXBlKSwgXCJhdHRyXCIsIHRoaXMpLmNhbGwodGhpcywgYSwgYiwgYyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRhcmdldHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiBiYXNlRmluZCgnc3ZnIFtmaWxsKj1cIicgKyB0aGlzLmlkKCkgKyAnXCJdJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImJib3hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYmJveCgpIHtcbiAgICAgIHJldHVybiBuZXcgQm94KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBhdHRlcm47XG59KENvbnRhaW5lcik7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgcGF0dGVybiBlbGVtZW50IGluIGRlZnNcbiAgICBwYXR0ZXJuOiBmdW5jdGlvbiBwYXR0ZXJuKCkge1xuICAgICAgdmFyIF90aGlzJGRlZnM7XG5cbiAgICAgIHJldHVybiAoX3RoaXMkZGVmcyA9IHRoaXMuZGVmcygpKS5wYXR0ZXJuLmFwcGx5KF90aGlzJGRlZnMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuICBEZWZzOiB7XG4gICAgcGF0dGVybjogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFBhdHRlcm4oKSkudXBkYXRlKGJsb2NrKS5hdHRyKHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgcGF0dGVyblVuaXRzOiAndXNlclNwYWNlT25Vc2UnXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFBhdHRlcm4sICdQYXR0ZXJuJyk7XG5cbnZhciBJbWFnZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhJbWFnZSwgX1NoYXBlKTtcblxuICBmdW5jdGlvbiBJbWFnZShub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEltYWdlKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoSW1hZ2UpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdpbWFnZScsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gKHJlKWxvYWQgaW1hZ2VcblxuXG4gIF9jcmVhdGVDbGFzcyhJbWFnZSwgW3tcbiAgICBrZXk6IFwibG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkKHVybCwgY2FsbGJhY2spIHtcbiAgICAgIGlmICghdXJsKSByZXR1cm4gdGhpcztcbiAgICAgIHZhciBpbWcgPSBuZXcgZ2xvYmFscy53aW5kb3cuSW1hZ2UoKTtcbiAgICAgIG9uKGltZywgJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50KFBhdHRlcm4pOyAvLyBlbnN1cmUgaW1hZ2Ugc2l6ZVxuXG4gICAgICAgIGlmICh0aGlzLndpZHRoKCkgPT09IDAgJiYgdGhpcy5oZWlnaHQoKSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuc2l6ZShpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAgaW5zdGFuY2VvZiBQYXR0ZXJuKSB7XG4gICAgICAgICAgLy8gZW5zdXJlIHBhdHRlcm4gc2l6ZSBpZiBub3Qgc2V0XG4gICAgICAgICAgaWYgKHAud2lkdGgoKSA9PT0gMCAmJiBwLmhlaWdodCgpID09PSAwKSB7XG4gICAgICAgICAgICBwLnNpemUodGhpcy53aWR0aCgpLCB0aGlzLmhlaWdodCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgICBvbihpbWcsICdsb2FkIGVycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBkb250IGZvcmdldCB0byB1bmJpbmQgbWVtb3J5IGxlYWtpbmcgZXZlbnRzXG4gICAgICAgIG9mZihpbWcpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgaW1nLnNyYyA9IHVybCwgeGxpbmspO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBJbWFnZTtcbn0oU2hhcGUpO1xucmVnaXN0ZXJBdHRySG9vayhmdW5jdGlvbiAoYXR0ciwgdmFsLCBfdGhpcykge1xuICAvLyBjb252ZXJ0IGltYWdlIGZpbGwgYW5kIHN0cm9rZSB0byBwYXR0ZXJuc1xuICBpZiAoYXR0ciA9PT0gJ2ZpbGwnIHx8IGF0dHIgPT09ICdzdHJva2UnKSB7XG4gICAgaWYgKGlzSW1hZ2UudGVzdCh2YWwpKSB7XG4gICAgICB2YWwgPSBfdGhpcy5yb290KCkuZGVmcygpLmltYWdlKHZhbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgdmFsID0gX3RoaXMucm9vdCgpLmRlZnMoKS5wYXR0ZXJuKDAsIDAsIGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICBwYXR0ZXJuLmFkZCh2YWwpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn0pO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gY3JlYXRlIGltYWdlIGVsZW1lbnQsIGxvYWQgaW1hZ2UgYW5kIHNldCBpdHMgc2l6ZVxuICAgIGltYWdlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoc291cmNlLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBJbWFnZSgpKS5zaXplKDAsIDApLmxvYWQoc291cmNlLCBjYWxsYmFjayk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihJbWFnZSwgJ0ltYWdlJyk7XG5cbnZhciBQb2ludEFycmF5ID0gc3ViQ2xhc3NBcnJheSgnUG9pbnRBcnJheScsIFNWR0FycmF5KTtcbmV4dGVuZChQb2ludEFycmF5LCB7XG4gIC8vIENvbnZlcnQgYXJyYXkgdG8gc3RyaW5nXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAvLyBjb252ZXJ0IHRvIGEgcG9seSBwb2ludCBzdHJpbmdcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLmxlbmd0aCwgYXJyYXkgPSBbXTsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGFycmF5LnB1c2godGhpc1tpXS5qb2luKCcsJykpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheS5qb2luKCcgJyk7XG4gIH0sXG4gIC8vIENvbnZlcnQgYXJyYXkgdG8gbGluZSBvYmplY3RcbiAgdG9MaW5lOiBmdW5jdGlvbiB0b0xpbmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgxOiB0aGlzWzBdWzBdLFxuICAgICAgeTE6IHRoaXNbMF1bMV0sXG4gICAgICB4MjogdGhpc1sxXVswXSxcbiAgICAgIHkyOiB0aGlzWzFdWzFdXG4gICAgfTtcbiAgfSxcbiAgLy8gR2V0IG1vcnBoZWQgYXJyYXkgYXQgZ2l2ZW4gcG9zaXRpb25cbiAgYXQ6IGZ1bmN0aW9uIGF0KHBvcykge1xuICAgIC8vIG1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWRcbiAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzOyAvLyBnZW5lcmF0ZSBtb3JwaGVkIHBvaW50IHN0cmluZ1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5sZW5ndGgsIGFycmF5ID0gW107IGkgPCBpbDsgaSsrKSB7XG4gICAgICBhcnJheS5wdXNoKFt0aGlzW2ldWzBdICsgKHRoaXMuZGVzdGluYXRpb25baV1bMF0gLSB0aGlzW2ldWzBdKSAqIHBvcywgdGhpc1tpXVsxXSArICh0aGlzLmRlc3RpbmF0aW9uW2ldWzFdIC0gdGhpc1tpXVsxXSkgKiBwb3NdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBvaW50QXJyYXkoYXJyYXkpO1xuICB9LFxuICAvLyBQYXJzZSBwb2ludCBzdHJpbmcgYW5kIGZsYXQgYXJyYXlcbiAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKCkge1xuICAgIHZhciBhcnJheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW1swLCAwXV07XG4gICAgdmFyIHBvaW50cyA9IFtdOyAvLyBpZiBpdCBpcyBhbiBhcnJheVxuXG4gICAgaWYgKGFycmF5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIC8vIGFuZCBpdCBpcyBub3QgZmxhdCwgdGhlcmUgaXMgbm8gbmVlZCB0byBwYXJzZSBpdFxuICAgICAgaWYgKGFycmF5WzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBFbHNlLCBpdCBpcyBjb25zaWRlcmVkIGFzIGEgc3RyaW5nXG4gICAgICAvLyBwYXJzZSBwb2ludHNcbiAgICAgIGFycmF5ID0gYXJyYXkudHJpbSgpLnNwbGl0KGRlbGltaXRlcikubWFwKHBhcnNlRmxvYXQpO1xuICAgIH0gLy8gdmFsaWRhdGUgcG9pbnRzIC0gaHR0cHM6Ly9zdmd3Zy5vcmcvc3ZnMi1kcmFmdC9zaGFwZXMuaHRtbCNEYXRhVHlwZVBvaW50c1xuICAgIC8vIE9kZCBudW1iZXIgb2YgY29vcmRpbmF0ZXMgaXMgYW4gZXJyb3IuIEluIHN1Y2ggY2FzZXMsIGRyb3AgdGhlIGxhc3Qgb2RkIGNvb3JkaW5hdGUuXG5cblxuICAgIGlmIChhcnJheS5sZW5ndGggJSAyICE9PSAwKSBhcnJheS5wb3AoKTsgLy8gd3JhcCBwb2ludHMgaW4gdHdvLXR1cGxlc1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSA9IGkgKyAyKSB7XG4gICAgICBwb2ludHMucHVzaChbYXJyYXlbaV0sIGFycmF5W2kgKyAxXV0pO1xuICAgIH1cblxuICAgIHJldHVybiBwb2ludHM7XG4gIH0sXG4gIC8vIHRyYW5zZm9ybSBwb2ludHMgd2l0aCBtYXRyaXggKHNpbWlsYXIgdG8gUG9pbnQudHJhbnNmb3JtKVxuICB0cmFuc2Zvcm06IGZ1bmN0aW9uIHRyYW5zZm9ybShtKSB7XG4gICAgdmFyIHBvaW50cyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcG9pbnQgPSB0aGlzW2ldOyAvLyBQZXJmb3JtIHRoZSBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICAgICAgcG9pbnRzLnB1c2goW20uYSAqIHBvaW50WzBdICsgbS5jICogcG9pbnRbMV0gKyBtLmUsIG0uYiAqIHBvaW50WzBdICsgbS5kICogcG9pbnRbMV0gKyBtLmZdKTtcbiAgICB9IC8vIFJldHVybiB0aGUgcmVxdWlyZWQgcG9pbnRcblxuXG4gICAgcmV0dXJuIG5ldyBQb2ludEFycmF5KHBvaW50cyk7XG4gIH0sXG4gIC8vIE1vdmUgcG9pbnQgc3RyaW5nXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgIHZhciBib3ggPSB0aGlzLmJib3goKTsgLy8gZ2V0IHJlbGF0aXZlIG9mZnNldFxuXG4gICAgeCAtPSBib3gueDtcbiAgICB5IC09IGJveC55OyAvLyBtb3ZlIGV2ZXJ5IHBvaW50XG5cbiAgICBpZiAoIWlzTmFOKHgpICYmICFpc05hTih5KSkge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdGhpc1tpXSA9IFt0aGlzW2ldWzBdICsgeCwgdGhpc1tpXVsxXSArIHldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBSZXNpemUgcG9seSBzdHJpbmdcbiAgc2l6ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGJveCA9IHRoaXMuYmJveCgpOyAvLyByZWNhbGN1bGF0ZSBwb3NpdGlvbiBvZiBhbGwgcG9pbnRzIGFjY29yZGluZyB0byBuZXcgc2l6ZVxuXG4gICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGJveC53aWR0aCkgdGhpc1tpXVswXSA9ICh0aGlzW2ldWzBdIC0gYm94LngpICogd2lkdGggLyBib3gud2lkdGggKyBib3gueDtcbiAgICAgIGlmIChib3guaGVpZ2h0KSB0aGlzW2ldWzFdID0gKHRoaXNbaV1bMV0gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8vIEdldCBib3VuZGluZyBib3ggb2YgcG9pbnRzXG4gIGJib3g6IGZ1bmN0aW9uIGJib3goKSB7XG4gICAgdmFyIG1heFggPSAtSW5maW5pdHk7XG4gICAgdmFyIG1heFkgPSAtSW5maW5pdHk7XG4gICAgdmFyIG1pblggPSBJbmZpbml0eTtcbiAgICB2YXIgbWluWSA9IEluZmluaXR5O1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIG1heFggPSBNYXRoLm1heChlbFswXSwgbWF4WCk7XG4gICAgICBtYXhZID0gTWF0aC5tYXgoZWxbMV0sIG1heFkpO1xuICAgICAgbWluWCA9IE1hdGgubWluKGVsWzBdLCBtaW5YKTtcbiAgICAgIG1pblkgPSBNYXRoLm1pbihlbFsxXSwgbWluWSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgICAgaGVpZ2h0OiBtYXhZIC0gbWluWVxuICAgIH07XG4gIH1cbn0pO1xuXG52YXIgTW9ycGhBcnJheSA9IFBvaW50QXJyYXk7IC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyIG92ZXIgeC1heGlzXG5cbmZ1bmN0aW9uIHgkMSh4KSB7XG4gIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS54IDogdGhpcy5tb3ZlKHgsIHRoaXMuYmJveCgpLnkpO1xufSAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHktYXhpc1xuXG5mdW5jdGlvbiB5JDEoeSkge1xuICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5iYm94KCkueSA6IHRoaXMubW92ZSh0aGlzLmJib3goKS54LCB5KTtcbn0gLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcblxuZnVuY3Rpb24gd2lkdGgkMSh3aWR0aCkge1xuICB2YXIgYiA9IHRoaXMuYmJveCgpO1xuICByZXR1cm4gd2lkdGggPT0gbnVsbCA/IGIud2lkdGggOiB0aGlzLnNpemUod2lkdGgsIGIuaGVpZ2h0KTtcbn0gLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XG5cbmZ1bmN0aW9uIGhlaWdodCQxKGhlaWdodCkge1xuICB2YXIgYiA9IHRoaXMuYmJveCgpO1xuICByZXR1cm4gaGVpZ2h0ID09IG51bGwgPyBiLmhlaWdodCA6IHRoaXMuc2l6ZShiLndpZHRoLCBoZWlnaHQpO1xufVxuXG52YXIgcG9pbnRlZCA9ICh7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0TW9ycGhBcnJheTogTW9ycGhBcnJheSxcblx0eDogeCQxLFxuXHR5OiB5JDEsXG5cdHdpZHRoOiB3aWR0aCQxLFxuXHRoZWlnaHQ6IGhlaWdodCQxXG59KTtcblxudmFyIExpbmUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoTGluZSwgX1NoYXBlKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gTGluZShub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIExpbmUpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihMaW5lKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnbGluZScsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gR2V0IGFycmF5XG5cblxuICBfY3JlYXRlQ2xhc3MoTGluZSwgW3tcbiAgICBrZXk6IFwiYXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXJyYXkoKSB7XG4gICAgICByZXR1cm4gbmV3IFBvaW50QXJyYXkoW1t0aGlzLmF0dHIoJ3gxJyksIHRoaXMuYXR0cigneTEnKV0sIFt0aGlzLmF0dHIoJ3gyJyksIHRoaXMuYXR0cigneTInKV1dKTtcbiAgICB9IC8vIE92ZXJ3cml0ZSBuYXRpdmUgcGxvdCgpIG1ldGhvZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicGxvdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwbG90KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICBpZiAoeDEgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgeTEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHgxID0ge1xuICAgICAgICAgIHgxOiB4MSxcbiAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgeDI6IHgyLFxuICAgICAgICAgIHkyOiB5MlxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeDEgPSBuZXcgUG9pbnRBcnJheSh4MSkudG9MaW5lKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoeDEpO1xuICAgIH0gLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXJcblxuICB9LCB7XG4gICAga2V5OiBcIm1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHRoaXMuYXJyYXkoKS5tb3ZlKHgsIHkpLnRvTGluZSgpKTtcbiAgICB9IC8vIFNldCBlbGVtZW50IHNpemUgdG8gZ2l2ZW4gd2lkdGggYW5kIGhlaWdodFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIodGhpcy5hcnJheSgpLnNpemUocC53aWR0aCwgcC5oZWlnaHQpLnRvTGluZSgpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTGluZTtcbn0oU2hhcGUpO1xuZXh0ZW5kKExpbmUsIHBvaW50ZWQpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGEgbGluZSBlbGVtZW50XG4gICAgbGluZTogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxuICAgICAgLy8geDEgaXMgbm90IG5lY2Vzc2FyaWx5IGEgbnVtYmVyLCBpdCBjYW4gYWxzbyBiZSBhbiBhcnJheSwgYSBzdHJpbmcgYW5kIGEgUG9pbnRBcnJheVxuICAgICAgcmV0dXJuIExpbmUucHJvdG90eXBlLnBsb3QuYXBwbHkodGhpcy5wdXQobmV3IExpbmUoKSksIGFyZ3NbMF0gIT0gbnVsbCA/IGFyZ3MgOiBbMCwgMCwgMCwgMF0pO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoTGluZSwgJ0xpbmUnKTtcblxudmFyIE1hcmtlciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoTWFya2VyLCBfQ29udGFpbmVyKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gTWFya2VyKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWFya2VyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoTWFya2VyKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnbWFya2VyJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuXG5cbiAgX2NyZWF0ZUNsYXNzKE1hcmtlciwgW3tcbiAgICBrZXk6IFwid2lkdGhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2lkdGgoX3dpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdtYXJrZXJXaWR0aCcsIF93aWR0aCk7XG4gICAgfSAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImhlaWdodFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoZWlnaHQoX2hlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignbWFya2VySGVpZ2h0JywgX2hlaWdodCk7XG4gICAgfSAvLyBTZXQgbWFya2VyIHJlZlggYW5kIHJlZllcblxuICB9LCB7XG4gICAga2V5OiBcInJlZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWYoeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigncmVmWCcsIHgpLmF0dHIoJ3JlZlknLCB5KTtcbiAgICB9IC8vIFVwZGF0ZSBtYXJrZXJcblxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoYmxvY2spIHtcbiAgICAgIC8vIHJlbW92ZSBhbGwgY29udGVudFxuICAgICAgdGhpcy5jbGVhcigpOyAvLyBpbnZva2UgcGFzc2VkIGJsb2NrXG5cbiAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSZXR1cm4gdGhlIGZpbGwgaWRcblxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmlkKCkgKyAnKSc7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1hcmtlcjtcbn0oQ29udGFpbmVyKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIG1hcmtlcjogZnVuY3Rpb24gbWFya2VyKCkge1xuICAgICAgdmFyIF90aGlzJGRlZnM7XG5cbiAgICAgIC8vIENyZWF0ZSBtYXJrZXIgZWxlbWVudCBpbiBkZWZzXG4gICAgICByZXR1cm4gKF90aGlzJGRlZnMgPSB0aGlzLmRlZnMoKSkubWFya2VyLmFwcGx5KF90aGlzJGRlZnMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuICBEZWZzOiB7XG4gICAgLy8gQ3JlYXRlIG1hcmtlclxuICAgIG1hcmtlcjogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XG4gICAgICAvLyBTZXQgZGVmYXVsdCB2aWV3Ym94IHRvIG1hdGNoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBzZXQgcmVmIHRvIGN4IGFuZCBjeSBhbmQgc2V0IG9yaWVudCB0byBhdXRvXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IE1hcmtlcigpKS5zaXplKHdpZHRoLCBoZWlnaHQpLnJlZih3aWR0aCAvIDIsIGhlaWdodCAvIDIpLnZpZXdib3goMCwgMCwgd2lkdGgsIGhlaWdodCkuYXR0cignb3JpZW50JywgJ2F1dG8nKS51cGRhdGUoYmxvY2spO1xuICAgIH0pXG4gIH0sXG4gIG1hcmtlcjoge1xuICAgIC8vIENyZWF0ZSBhbmQgYXR0YWNoIG1hcmtlcnNcbiAgICBtYXJrZXI6IGZ1bmN0aW9uIG1hcmtlcihfbWFya2VyLCB3aWR0aCwgaGVpZ2h0LCBibG9jaykge1xuICAgICAgdmFyIGF0dHIgPSBbJ21hcmtlciddOyAvLyBCdWlsZCBhdHRyaWJ1dGUgbmFtZVxuXG4gICAgICBpZiAoX21hcmtlciAhPT0gJ2FsbCcpIGF0dHIucHVzaChfbWFya2VyKTtcbiAgICAgIGF0dHIgPSBhdHRyLmpvaW4oJy0nKTsgLy8gU2V0IG1hcmtlciBhdHRyaWJ1dGVcblxuICAgICAgX21hcmtlciA9IGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIE1hcmtlciA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuZGVmcygpLm1hcmtlcih3aWR0aCwgaGVpZ2h0LCBibG9jayk7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKGF0dHIsIF9tYXJrZXIpO1xuICAgIH1cbiAgfVxufSk7XG5yZWdpc3RlcihNYXJrZXIsICdNYXJrZXInKTtcblxudmFyIG5hdGl2ZVNvcnQgPSBbXS5zb3J0O1xudmFyIHRlc3QkMiA9IFsxLCAyLCAzXTtcblxuLy8gSUU4LVxudmFyIEZBSUxTX09OX1VOREVGSU5FRCA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdGVzdCQyLnNvcnQodW5kZWZpbmVkKTtcbn0pO1xuLy8gVjggYnVnXG52YXIgRkFJTFNfT05fTlVMTCA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdGVzdCQyLnNvcnQobnVsbCk7XG59KTtcbi8vIE9sZCBXZWJLaXRcbnZhciBTTE9QUFlfTUVUSE9EJDIgPSBzbG9wcHlBcnJheU1ldGhvZCgnc29ydCcpO1xuXG52YXIgRk9SQ0VEJDQgPSBGQUlMU19PTl9VTkRFRklORUQgfHwgIUZBSUxTX09OX05VTEwgfHwgU0xPUFBZX01FVEhPRCQyO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnNvcnRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNvcnRcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEZPUkNFRCQ0IH0sIHtcbiAgc29ydDogZnVuY3Rpb24gc29ydChjb21wYXJlZm4pIHtcbiAgICByZXR1cm4gY29tcGFyZWZuID09PSB1bmRlZmluZWRcbiAgICAgID8gbmF0aXZlU29ydC5jYWxsKHRvT2JqZWN0KHRoaXMpKVxuICAgICAgOiBuYXRpdmVTb3J0LmNhbGwodG9PYmplY3QodGhpcyksIGFGdW5jdGlvbiQxKGNvbXBhcmVmbikpO1xuICB9XG59KTtcblxuLyoqKlxyXG5CYXNlIENsYXNzXHJcbj09PT09PT09PT1cclxuVGhlIGJhc2Ugc3RlcHBlciBjbGFzcyB0aGF0IHdpbGwgYmVcclxuKioqL1xuXG5mdW5jdGlvbiBtYWtlU2V0dGVyR2V0dGVyKGssIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKHYgPT0gbnVsbCkgcmV0dXJuIHRoaXNbdl07XG4gICAgdGhpc1trXSA9IHY7XG4gICAgaWYgKGYpIGYuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn1cblxudmFyIGVhc2luZyA9IHtcbiAgJy0nOiBmdW5jdGlvbiBfKHBvcykge1xuICAgIHJldHVybiBwb3M7XG4gIH0sXG4gICc8Pic6IGZ1bmN0aW9uIF8ocG9zKSB7XG4gICAgcmV0dXJuIC1NYXRoLmNvcyhwb3MgKiBNYXRoLlBJKSAvIDIgKyAwLjU7XG4gIH0sXG4gICc+JzogZnVuY3Rpb24gXyhwb3MpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4ocG9zICogTWF0aC5QSSAvIDIpO1xuICB9LFxuICAnPCc6IGZ1bmN0aW9uIF8ocG9zKSB7XG4gICAgcmV0dXJuIC1NYXRoLmNvcyhwb3MgKiBNYXRoLlBJIC8gMikgKyAxO1xuICB9LFxuICBiZXppZXI6IGZ1bmN0aW9uIGJlemllcih4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvY3NzLWVhc2luZy0xLyNjdWJpYy1iZXppZXItYWxnb1xuICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgICAgaWYgKHQgPCAwKSB7XG4gICAgICAgIGlmICh4MSA+IDApIHtcbiAgICAgICAgICByZXR1cm4geTEgLyB4MSAqIHQ7XG4gICAgICAgIH0gZWxzZSBpZiAoeDIgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHkyIC8geDIgKiB0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHQgPiAxKSB7XG4gICAgICAgIGlmICh4MiA8IDEpIHtcbiAgICAgICAgICByZXR1cm4gKDEgLSB5MikgLyAoMSAtIHgyKSAqIHQgKyAoeTIgLSB4MikgLyAoMSAtIHgyKTtcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IDEpIHtcbiAgICAgICAgICByZXR1cm4gKDEgLSB5MSkgLyAoMSAtIHgxKSAqIHQgKyAoeTEgLSB4MSkgLyAoMSAtIHgxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDMgKiB0ICogTWF0aC5wb3coMSAtIHQsIDIpICogeTEgKyAzICogTWF0aC5wb3codCwgMikgKiAoMSAtIHQpICogeTIgKyBNYXRoLnBvdyh0LCAzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICAvLyBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy1lYXNpbmctMS8jc3RlcC10aW1pbmctZnVuY3Rpb24tYWxnb1xuICBzdGVwczogZnVuY3Rpb24gc3RlcHMoX3N0ZXBzKSB7XG4gICAgdmFyIHN0ZXBQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ2VuZCc7XG4gICAgLy8gZGVhbCB3aXRoIFwianVtcC1cIiBwcmVmaXhcbiAgICBzdGVwUG9zaXRpb24gPSBzdGVwUG9zaXRpb24uc3BsaXQoJy0nKS5yZXZlcnNlKClbMF07XG4gICAgdmFyIGp1bXBzID0gX3N0ZXBzO1xuXG4gICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gJ25vbmUnKSB7XG4gICAgICAtLWp1bXBzO1xuICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSAnYm90aCcpIHtcbiAgICAgICsranVtcHM7XG4gICAgfSAvLyBUaGUgYmVmb3JlRmxhZyBpcyBlc3NlbnRpYWxseSB1c2VsZXNzXG5cblxuICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgICAgdmFyIGJlZm9yZUZsYWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgLy8gU3RlcCBpcyBjYWxsZWQgY3VycmVudFN0ZXAgaW4gcmVmZXJlbmNlZCB1cmxcbiAgICAgIHZhciBzdGVwID0gTWF0aC5mbG9vcih0ICogX3N0ZXBzKTtcbiAgICAgIHZhciBqdW1waW5nID0gdCAqIHN0ZXAgJSAxID09PSAwO1xuXG4gICAgICBpZiAoc3RlcFBvc2l0aW9uID09PSAnc3RhcnQnIHx8IHN0ZXBQb3NpdGlvbiA9PT0gJ2JvdGgnKSB7XG4gICAgICAgICsrc3RlcDtcbiAgICAgIH1cblxuICAgICAgaWYgKGJlZm9yZUZsYWcgJiYganVtcGluZykge1xuICAgICAgICAtLXN0ZXA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ID49IDAgJiYgc3RlcCA8IDApIHtcbiAgICAgICAgc3RlcCA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0IDw9IDEgJiYgc3RlcCA+IGp1bXBzKSB7XG4gICAgICAgIHN0ZXAgPSBqdW1wcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0ZXAgLyBqdW1wcztcbiAgICB9O1xuICB9XG59O1xudmFyIFN0ZXBwZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdGVwcGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdGVwcGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTdGVwcGVyLCBbe1xuICAgIGtleTogXCJkb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0ZXBwZXI7XG59KCk7XG4vKioqXHJcbkVhc2luZyBGdW5jdGlvbnNcclxuPT09PT09PT09PT09PT09PVxyXG4qKiovXG5cbnZhciBFYXNlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU3RlcHBlcikge1xuICBfaW5oZXJpdHMoRWFzZSwgX1N0ZXBwZXIpO1xuXG4gIGZ1bmN0aW9uIEVhc2UoZm4pIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRWFzZSk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihFYXNlKS5jYWxsKHRoaXMpKTtcbiAgICBfdGhpcy5lYXNlID0gZWFzaW5nW2ZuIHx8IHRpbWVsaW5lLmVhc2VdIHx8IGZuO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhFYXNlLCBbe1xuICAgIGtleTogXCJzdGVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXAoZnJvbSwgdG8sIHBvcykge1xuICAgICAgaWYgKHR5cGVvZiBmcm9tICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gcG9zIDwgMSA/IGZyb20gOiB0bztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZyb20gKyAodG8gLSBmcm9tKSAqIHRoaXMuZWFzZShwb3MpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFYXNlO1xufShTdGVwcGVyKTtcbi8qKipcclxuQ29udHJvbGxlciBUeXBlc1xyXG49PT09PT09PT09PT09PT09XHJcbioqKi9cblxudmFyIENvbnRyb2xsZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TdGVwcGVyMikge1xuICBfaW5oZXJpdHMoQ29udHJvbGxlciwgX1N0ZXBwZXIyKTtcblxuICBmdW5jdGlvbiBDb250cm9sbGVyKGZuKSB7XG4gICAgdmFyIF90aGlzMjtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb250cm9sbGVyKTtcblxuICAgIF90aGlzMiA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihDb250cm9sbGVyKS5jYWxsKHRoaXMpKTtcbiAgICBfdGhpczIuc3RlcHBlciA9IGZuO1xuICAgIHJldHVybiBfdGhpczI7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29udHJvbGxlciwgW3tcbiAgICBrZXk6IFwic3RlcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGVwKGN1cnJlbnQsIHRhcmdldCwgZHQsIGMpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ZXBwZXIoY3VycmVudCwgdGFyZ2V0LCBkdCwgYyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZG9uZShjKSB7XG4gICAgICByZXR1cm4gYy5kb25lO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb250cm9sbGVyO1xufShTdGVwcGVyKTtcblxuZnVuY3Rpb24gcmVjYWxjdWxhdGUoKSB7XG4gIC8vIEFwcGx5IHRoZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAgdmFyIGR1cmF0aW9uID0gKHRoaXMuX2R1cmF0aW9uIHx8IDUwMCkgLyAxMDAwO1xuICB2YXIgb3ZlcnNob290ID0gdGhpcy5fb3ZlcnNob290IHx8IDA7IC8vIENhbGN1bGF0ZSB0aGUgUElEIG5hdHVyYWwgcmVzcG9uc2VcblxuICB2YXIgZXBzID0gMWUtMTA7XG4gIHZhciBwaSA9IE1hdGguUEk7XG4gIHZhciBvcyA9IE1hdGgubG9nKG92ZXJzaG9vdCAvIDEwMCArIGVwcyk7XG4gIHZhciB6ZXRhID0gLW9zIC8gTWF0aC5zcXJ0KHBpICogcGkgKyBvcyAqIG9zKTtcbiAgdmFyIHduID0gMy45IC8gKHpldGEgKiBkdXJhdGlvbik7IC8vIENhbGN1bGF0ZSB0aGUgU3ByaW5nIHZhbHVlc1xuXG4gIHRoaXMuZCA9IDIgKiB6ZXRhICogd247XG4gIHRoaXMuayA9IHduICogd247XG59XG5cbnZhciBTcHJpbmcgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db250cm9sbGVyKSB7XG4gIF9pbmhlcml0cyhTcHJpbmcsIF9Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBTcHJpbmcoZHVyYXRpb24sIG92ZXJzaG9vdCkge1xuICAgIHZhciBfdGhpczM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3ByaW5nKTtcblxuICAgIF90aGlzMyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTcHJpbmcpLmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMzLmR1cmF0aW9uKGR1cmF0aW9uIHx8IDUwMCkub3ZlcnNob290KG92ZXJzaG9vdCB8fCAwKTtcblxuICAgIHJldHVybiBfdGhpczM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU3ByaW5nLCBbe1xuICAgIGtleTogXCJzdGVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXAoY3VycmVudCwgdGFyZ2V0LCBkdCwgYykge1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50ID09PSAnc3RyaW5nJykgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICBjLmRvbmUgPSBkdCA9PT0gSW5maW5pdHk7XG4gICAgICBpZiAoZHQgPT09IEluZmluaXR5KSByZXR1cm4gdGFyZ2V0O1xuICAgICAgaWYgKGR0ID09PSAwKSByZXR1cm4gY3VycmVudDtcbiAgICAgIGlmIChkdCA+IDEwMCkgZHQgPSAxNjtcbiAgICAgIGR0IC89IDEwMDA7IC8vIEdldCB0aGUgcHJldmlvdXMgdmVsb2NpdHlcblxuICAgICAgdmFyIHZlbG9jaXR5ID0gYy52ZWxvY2l0eSB8fCAwOyAvLyBBcHBseSB0aGUgY29udHJvbCB0byBnZXQgdGhlIG5ldyBwb3NpdGlvbiBhbmQgc3RvcmUgaXRcblxuICAgICAgdmFyIGFjY2VsZXJhdGlvbiA9IC10aGlzLmQgKiB2ZWxvY2l0eSAtIHRoaXMuayAqIChjdXJyZW50IC0gdGFyZ2V0KTtcbiAgICAgIHZhciBuZXdQb3NpdGlvbiA9IGN1cnJlbnQgKyB2ZWxvY2l0eSAqIGR0ICsgYWNjZWxlcmF0aW9uICogZHQgKiBkdCAvIDI7IC8vIFN0b3JlIHRoZSB2ZWxvY2l0eVxuXG4gICAgICBjLnZlbG9jaXR5ID0gdmVsb2NpdHkgKyBhY2NlbGVyYXRpb24gKiBkdDsgLy8gRmlndXJlIG91dCBpZiB3ZSBoYXZlIGNvbnZlcmdlZCwgYW5kIGlmIHNvLCBwYXNzIHRoZSB2YWx1ZVxuXG4gICAgICBjLmRvbmUgPSBNYXRoLmFicyh0YXJnZXQgLSBuZXdQb3NpdGlvbikgKyBNYXRoLmFicyh2ZWxvY2l0eSkgPCAwLjAwMjtcbiAgICAgIHJldHVybiBjLmRvbmUgPyB0YXJnZXQgOiBuZXdQb3NpdGlvbjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3ByaW5nO1xufShDb250cm9sbGVyKTtcbmV4dGVuZChTcHJpbmcsIHtcbiAgZHVyYXRpb246IG1ha2VTZXR0ZXJHZXR0ZXIoJ19kdXJhdGlvbicsIHJlY2FsY3VsYXRlKSxcbiAgb3ZlcnNob290OiBtYWtlU2V0dGVyR2V0dGVyKCdfb3ZlcnNob290JywgcmVjYWxjdWxhdGUpXG59KTtcbnZhciBQSUQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db250cm9sbGVyMikge1xuICBfaW5oZXJpdHMoUElELCBfQ29udHJvbGxlcjIpO1xuXG4gIGZ1bmN0aW9uIFBJRChwLCBpLCBkLCB3aW5kdXApIHtcbiAgICB2YXIgX3RoaXM0O1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBJRCk7XG5cbiAgICBfdGhpczQgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUElEKS5jYWxsKHRoaXMpKTtcbiAgICBwID0gcCA9PSBudWxsID8gMC4xIDogcDtcbiAgICBpID0gaSA9PSBudWxsID8gMC4wMSA6IGk7XG4gICAgZCA9IGQgPT0gbnVsbCA/IDAgOiBkO1xuICAgIHdpbmR1cCA9IHdpbmR1cCA9PSBudWxsID8gMTAwMCA6IHdpbmR1cDtcblxuICAgIF90aGlzNC5wKHApLmkoaSkuZChkKS53aW5kdXAod2luZHVwKTtcblxuICAgIHJldHVybiBfdGhpczQ7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUElELCBbe1xuICAgIGtleTogXCJzdGVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXAoY3VycmVudCwgdGFyZ2V0LCBkdCwgYykge1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50ID09PSAnc3RyaW5nJykgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICBjLmRvbmUgPSBkdCA9PT0gSW5maW5pdHk7XG4gICAgICBpZiAoZHQgPT09IEluZmluaXR5KSByZXR1cm4gdGFyZ2V0O1xuICAgICAgaWYgKGR0ID09PSAwKSByZXR1cm4gY3VycmVudDtcbiAgICAgIHZhciBwID0gdGFyZ2V0IC0gY3VycmVudDtcbiAgICAgIHZhciBpID0gKGMuaW50ZWdyYWwgfHwgMCkgKyBwICogZHQ7XG4gICAgICB2YXIgZCA9IChwIC0gKGMuZXJyb3IgfHwgMCkpIC8gZHQ7XG4gICAgICB2YXIgd2luZHVwID0gdGhpcy53aW5kdXA7IC8vIGFudGl3aW5kdXBcblxuICAgICAgaWYgKHdpbmR1cCAhPT0gZmFsc2UpIHtcbiAgICAgICAgaSA9IE1hdGgubWF4KC13aW5kdXAsIE1hdGgubWluKGksIHdpbmR1cCkpO1xuICAgICAgfVxuXG4gICAgICBjLmVycm9yID0gcDtcbiAgICAgIGMuaW50ZWdyYWwgPSBpO1xuICAgICAgYy5kb25lID0gTWF0aC5hYnMocCkgPCAwLjAwMTtcbiAgICAgIHJldHVybiBjLmRvbmUgPyB0YXJnZXQgOiBjdXJyZW50ICsgKHRoaXMuUCAqIHAgKyB0aGlzLkkgKiBpICsgdGhpcy5EICogZCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBJRDtcbn0oQ29udHJvbGxlcik7XG5leHRlbmQoUElELCB7XG4gIHdpbmR1cDogbWFrZVNldHRlckdldHRlcignd2luZHVwJyksXG4gIHA6IG1ha2VTZXR0ZXJHZXR0ZXIoJ1AnKSxcbiAgaTogbWFrZVNldHRlckdldHRlcignSScpLFxuICBkOiBtYWtlU2V0dGVyR2V0dGVyKCdEJylcbn0pO1xuXG52YXIgUGF0aEFycmF5ID0gc3ViQ2xhc3NBcnJheSgnUGF0aEFycmF5JywgU1ZHQXJyYXkpO1xuZnVuY3Rpb24gcGF0aFJlZ1JlcGxhY2UoYSwgYiwgYywgZCkge1xuICByZXR1cm4gYyArIGQucmVwbGFjZShkb3RzLCAnIC4nKTtcbn1cblxuZnVuY3Rpb24gYXJyYXlUb1N0cmluZyhhKSB7XG4gIGZvciAodmFyIGkgPSAwLCBpbCA9IGEubGVuZ3RoLCBzID0gJyc7IGkgPCBpbDsgaSsrKSB7XG4gICAgcyArPSBhW2ldWzBdO1xuXG4gICAgaWYgKGFbaV1bMV0gIT0gbnVsbCkge1xuICAgICAgcyArPSBhW2ldWzFdO1xuXG4gICAgICBpZiAoYVtpXVsyXSAhPSBudWxsKSB7XG4gICAgICAgIHMgKz0gJyAnO1xuICAgICAgICBzICs9IGFbaV1bMl07XG5cbiAgICAgICAgaWYgKGFbaV1bM10gIT0gbnVsbCkge1xuICAgICAgICAgIHMgKz0gJyAnO1xuICAgICAgICAgIHMgKz0gYVtpXVszXTtcbiAgICAgICAgICBzICs9ICcgJztcbiAgICAgICAgICBzICs9IGFbaV1bNF07XG5cbiAgICAgICAgICBpZiAoYVtpXVs1XSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzICs9ICcgJztcbiAgICAgICAgICAgIHMgKz0gYVtpXVs1XTtcbiAgICAgICAgICAgIHMgKz0gJyAnO1xuICAgICAgICAgICAgcyArPSBhW2ldWzZdO1xuXG4gICAgICAgICAgICBpZiAoYVtpXVs3XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHMgKz0gJyAnO1xuICAgICAgICAgICAgICBzICs9IGFbaV1bN107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHMgKyAnICc7XG59XG5cbnZhciBwYXRoSGFuZGxlcnMgPSB7XG4gIE06IGZ1bmN0aW9uIE0oYywgcCwgcDApIHtcbiAgICBwLnggPSBwMC54ID0gY1swXTtcbiAgICBwLnkgPSBwMC55ID0gY1sxXTtcbiAgICByZXR1cm4gWydNJywgcC54LCBwLnldO1xuICB9LFxuICBMOiBmdW5jdGlvbiBMKGMsIHApIHtcbiAgICBwLnggPSBjWzBdO1xuICAgIHAueSA9IGNbMV07XG4gICAgcmV0dXJuIFsnTCcsIGNbMF0sIGNbMV1dO1xuICB9LFxuICBIOiBmdW5jdGlvbiBIKGMsIHApIHtcbiAgICBwLnggPSBjWzBdO1xuICAgIHJldHVybiBbJ0gnLCBjWzBdXTtcbiAgfSxcbiAgVjogZnVuY3Rpb24gVihjLCBwKSB7XG4gICAgcC55ID0gY1swXTtcbiAgICByZXR1cm4gWydWJywgY1swXV07XG4gIH0sXG4gIEM6IGZ1bmN0aW9uIEMoYywgcCkge1xuICAgIHAueCA9IGNbNF07XG4gICAgcC55ID0gY1s1XTtcbiAgICByZXR1cm4gWydDJywgY1swXSwgY1sxXSwgY1syXSwgY1szXSwgY1s0XSwgY1s1XV07XG4gIH0sXG4gIFM6IGZ1bmN0aW9uIFMoYywgcCkge1xuICAgIHAueCA9IGNbMl07XG4gICAgcC55ID0gY1szXTtcbiAgICByZXR1cm4gWydTJywgY1swXSwgY1sxXSwgY1syXSwgY1szXV07XG4gIH0sXG4gIFE6IGZ1bmN0aW9uIFEoYywgcCkge1xuICAgIHAueCA9IGNbMl07XG4gICAgcC55ID0gY1szXTtcbiAgICByZXR1cm4gWydRJywgY1swXSwgY1sxXSwgY1syXSwgY1szXV07XG4gIH0sXG4gIFQ6IGZ1bmN0aW9uIFQoYywgcCkge1xuICAgIHAueCA9IGNbMF07XG4gICAgcC55ID0gY1sxXTtcbiAgICByZXR1cm4gWydUJywgY1swXSwgY1sxXV07XG4gIH0sXG4gIFo6IGZ1bmN0aW9uIFooYywgcCwgcDApIHtcbiAgICBwLnggPSBwMC54O1xuICAgIHAueSA9IHAwLnk7XG4gICAgcmV0dXJuIFsnWiddO1xuICB9LFxuICBBOiBmdW5jdGlvbiBBKGMsIHApIHtcbiAgICBwLnggPSBjWzVdO1xuICAgIHAueSA9IGNbNl07XG4gICAgcmV0dXJuIFsnQScsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM10sIGNbNF0sIGNbNV0sIGNbNl1dO1xuICB9XG59O1xudmFyIG1saHZxdGNzYXogPSAnbWxodnF0Y3Nheicuc3BsaXQoJycpO1xuXG5mb3IgKHZhciBpID0gMCwgaWwgPSBtbGh2cXRjc2F6Lmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgcGF0aEhhbmRsZXJzW21saHZxdGNzYXpbaV1dID0gZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGMsIHAsIHAwKSB7XG4gICAgICBpZiAoaSA9PT0gJ0gnKSBjWzBdID0gY1swXSArIHAueDtlbHNlIGlmIChpID09PSAnVicpIGNbMF0gPSBjWzBdICsgcC55O2Vsc2UgaWYgKGkgPT09ICdBJykge1xuICAgICAgICBjWzVdID0gY1s1XSArIHAueDtcbiAgICAgICAgY1s2XSA9IGNbNl0gKyBwLnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSBjLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgICBjW2pdID0gY1tqXSArIChqICUgMiA/IHAueSA6IHAueCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRoSGFuZGxlcnNbaV0oYywgcCwgcDApO1xuICAgIH07XG4gIH0obWxodnF0Y3NheltpXS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXh0ZW5kKFBhdGhBcnJheSwge1xuICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGFycmF5VG9TdHJpbmcodGhpcyk7XG4gIH0sXG4gIC8vIE1vdmUgcGF0aCBzdHJpbmdcbiAgbW92ZTogZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gICAgLy8gZ2V0IGJvdW5kaW5nIGJveCBvZiBjdXJyZW50IHNpdHVhdGlvblxuICAgIHZhciBib3ggPSB0aGlzLmJib3goKTsgLy8gZ2V0IHJlbGF0aXZlIG9mZnNldFxuXG4gICAgeCAtPSBib3gueDtcbiAgICB5IC09IGJveC55O1xuXG4gICAgaWYgKCFpc05hTih4KSAmJiAhaXNOYU4oeSkpIHtcbiAgICAgIC8vIG1vdmUgZXZlcnkgcG9pbnRcbiAgICAgIGZvciAodmFyIGwsIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGwgPSB0aGlzW2ldWzBdO1xuXG4gICAgICAgIGlmIChsID09PSAnTScgfHwgbCA9PT0gJ0wnIHx8IGwgPT09ICdUJykge1xuICAgICAgICAgIHRoaXNbaV1bMV0gKz0geDtcbiAgICAgICAgICB0aGlzW2ldWzJdICs9IHk7XG4gICAgICAgIH0gZWxzZSBpZiAobCA9PT0gJ0gnKSB7XG4gICAgICAgICAgdGhpc1tpXVsxXSArPSB4O1xuICAgICAgICB9IGVsc2UgaWYgKGwgPT09ICdWJykge1xuICAgICAgICAgIHRoaXNbaV1bMV0gKz0geTtcbiAgICAgICAgfSBlbHNlIGlmIChsID09PSAnQycgfHwgbCA9PT0gJ1MnIHx8IGwgPT09ICdRJykge1xuICAgICAgICAgIHRoaXNbaV1bMV0gKz0geDtcbiAgICAgICAgICB0aGlzW2ldWzJdICs9IHk7XG4gICAgICAgICAgdGhpc1tpXVszXSArPSB4O1xuICAgICAgICAgIHRoaXNbaV1bNF0gKz0geTtcblxuICAgICAgICAgIGlmIChsID09PSAnQycpIHtcbiAgICAgICAgICAgIHRoaXNbaV1bNV0gKz0geDtcbiAgICAgICAgICAgIHRoaXNbaV1bNl0gKz0geTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobCA9PT0gJ0EnKSB7XG4gICAgICAgICAgdGhpc1tpXVs2XSArPSB4O1xuICAgICAgICAgIHRoaXNbaV1bN10gKz0geTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBSZXNpemUgcGF0aCBzdHJpbmdcbiAgc2l6ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gZ2V0IGJvdW5kaW5nIGJveCBvZiBjdXJyZW50IHNpdHVhdGlvblxuICAgIHZhciBib3ggPSB0aGlzLmJib3goKTtcbiAgICB2YXIgaSwgbDsgLy8gSWYgdGhlIGJveCB3aWR0aCBvciBoZWlnaHQgaXMgMCB0aGVuIHdlIGlnbm9yZVxuICAgIC8vIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgcmVzcGVjdGl2ZSBheGlzXG5cbiAgICBib3gud2lkdGggPSBib3gud2lkdGggPT09IDAgPyAxIDogYm94LndpZHRoO1xuICAgIGJveC5oZWlnaHQgPSBib3guaGVpZ2h0ID09PSAwID8gMSA6IGJveC5oZWlnaHQ7IC8vIHJlY2FsY3VsYXRlIHBvc2l0aW9uIG9mIGFsbCBwb2ludHMgYWNjb3JkaW5nIHRvIG5ldyBzaXplXG5cbiAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBsID0gdGhpc1tpXVswXTtcblxuICAgICAgaWYgKGwgPT09ICdNJyB8fCBsID09PSAnTCcgfHwgbCA9PT0gJ1QnKSB7XG4gICAgICAgIHRoaXNbaV1bMV0gPSAodGhpc1tpXVsxXSAtIGJveC54KSAqIHdpZHRoIC8gYm94LndpZHRoICsgYm94Lng7XG4gICAgICAgIHRoaXNbaV1bMl0gPSAodGhpc1tpXVsyXSAtIGJveC55KSAqIGhlaWdodCAvIGJveC5oZWlnaHQgKyBib3gueTtcbiAgICAgIH0gZWxzZSBpZiAobCA9PT0gJ0gnKSB7XG4gICAgICAgIHRoaXNbaV1bMV0gPSAodGhpc1tpXVsxXSAtIGJveC54KSAqIHdpZHRoIC8gYm94LndpZHRoICsgYm94Lng7XG4gICAgICB9IGVsc2UgaWYgKGwgPT09ICdWJykge1xuICAgICAgICB0aGlzW2ldWzFdID0gKHRoaXNbaV1bMV0gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgICB9IGVsc2UgaWYgKGwgPT09ICdDJyB8fCBsID09PSAnUycgfHwgbCA9PT0gJ1EnKSB7XG4gICAgICAgIHRoaXNbaV1bMV0gPSAodGhpc1tpXVsxXSAtIGJveC54KSAqIHdpZHRoIC8gYm94LndpZHRoICsgYm94Lng7XG4gICAgICAgIHRoaXNbaV1bMl0gPSAodGhpc1tpXVsyXSAtIGJveC55KSAqIGhlaWdodCAvIGJveC5oZWlnaHQgKyBib3gueTtcbiAgICAgICAgdGhpc1tpXVszXSA9ICh0aGlzW2ldWzNdIC0gYm94LngpICogd2lkdGggLyBib3gud2lkdGggKyBib3gueDtcbiAgICAgICAgdGhpc1tpXVs0XSA9ICh0aGlzW2ldWzRdIC0gYm94LnkpICogaGVpZ2h0IC8gYm94LmhlaWdodCArIGJveC55O1xuXG4gICAgICAgIGlmIChsID09PSAnQycpIHtcbiAgICAgICAgICB0aGlzW2ldWzVdID0gKHRoaXNbaV1bNV0gLSBib3gueCkgKiB3aWR0aCAvIGJveC53aWR0aCArIGJveC54O1xuICAgICAgICAgIHRoaXNbaV1bNl0gPSAodGhpc1tpXVs2XSAtIGJveC55KSAqIGhlaWdodCAvIGJveC5oZWlnaHQgKyBib3gueTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChsID09PSAnQScpIHtcbiAgICAgICAgLy8gcmVzaXplIHJhZGlpXG4gICAgICAgIHRoaXNbaV1bMV0gPSB0aGlzW2ldWzFdICogd2lkdGggLyBib3gud2lkdGg7XG4gICAgICAgIHRoaXNbaV1bMl0gPSB0aGlzW2ldWzJdICogaGVpZ2h0IC8gYm94LmhlaWdodDsgLy8gbW92ZSBwb3NpdGlvbiB2YWx1ZXNcblxuICAgICAgICB0aGlzW2ldWzZdID0gKHRoaXNbaV1bNl0gLSBib3gueCkgKiB3aWR0aCAvIGJveC53aWR0aCArIGJveC54O1xuICAgICAgICB0aGlzW2ldWzddID0gKHRoaXNbaV1bN10gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8vIFRlc3QgaWYgdGhlIHBhc3NlZCBwYXRoIGFycmF5IHVzZSB0aGUgc2FtZSBwYXRoIGRhdGEgY29tbWFuZHMgYXMgdGhpcyBwYXRoIGFycmF5XG4gIGVxdWFsQ29tbWFuZHM6IGZ1bmN0aW9uIGVxdWFsQ29tbWFuZHMocGF0aEFycmF5KSB7XG4gICAgdmFyIGksIGlsLCBlcXVhbENvbW1hbmRzO1xuICAgIHBhdGhBcnJheSA9IG5ldyBQYXRoQXJyYXkocGF0aEFycmF5KTtcbiAgICBlcXVhbENvbW1hbmRzID0gdGhpcy5sZW5ndGggPT09IHBhdGhBcnJheS5sZW5ndGg7XG5cbiAgICBmb3IgKGkgPSAwLCBpbCA9IHRoaXMubGVuZ3RoOyBlcXVhbENvbW1hbmRzICYmIGkgPCBpbDsgaSsrKSB7XG4gICAgICBlcXVhbENvbW1hbmRzID0gdGhpc1tpXVswXSA9PT0gcGF0aEFycmF5W2ldWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBlcXVhbENvbW1hbmRzO1xuICB9LFxuICAvLyBNYWtlIHBhdGggYXJyYXkgbW9ycGhhYmxlXG4gIG1vcnBoOiBmdW5jdGlvbiBtb3JwaChwYXRoQXJyYXkpIHtcbiAgICBwYXRoQXJyYXkgPSBuZXcgUGF0aEFycmF5KHBhdGhBcnJheSk7XG5cbiAgICBpZiAodGhpcy5lcXVhbENvbW1hbmRzKHBhdGhBcnJheSkpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBwYXRoQXJyYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBHZXQgbW9ycGhlZCBwYXRoIGFycmF5IGF0IGdpdmVuIHBvc2l0aW9uXG4gIGF0OiBmdW5jdGlvbiBhdChwb3MpIHtcbiAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXG4gICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpcztcbiAgICB2YXIgc291cmNlQXJyYXkgPSB0aGlzO1xuICAgIHZhciBkZXN0aW5hdGlvbkFycmF5ID0gdGhpcy5kZXN0aW5hdGlvbi52YWx1ZTtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgcGF0aEFycmF5ID0gbmV3IFBhdGhBcnJheSgpO1xuICAgIHZhciBpLCBpbCwgaiwgamw7IC8vIEFuaW1hdGUgaGFzIHNwZWNpZmllZCBpbiB0aGUgU1ZHIHNwZWNcbiAgICAvLyBTZWU6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9wYXRocy5odG1sI1BhdGhFbGVtZW50XG5cbiAgICBmb3IgKGkgPSAwLCBpbCA9IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGFycmF5W2ldID0gW3NvdXJjZUFycmF5W2ldWzBdXTtcblxuICAgICAgZm9yIChqID0gMSwgamwgPSBzb3VyY2VBcnJheVtpXS5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgIGFycmF5W2ldW2pdID0gc291cmNlQXJyYXlbaV1bal0gKyAoZGVzdGluYXRpb25BcnJheVtpXVtqXSAtIHNvdXJjZUFycmF5W2ldW2pdKSAqIHBvcztcbiAgICAgIH0gLy8gRm9yIHRoZSB0d28gZmxhZ3Mgb2YgdGhlIGVsbGlwdGljYWwgYXJjIGNvbW1hbmQsIHRoZSBTVkcgc3BlYyBzYXk6XG4gICAgICAvLyBGbGFncyBhbmQgYm9vbGVhbnMgYXJlIGludGVycG9sYXRlZCBhcyBmcmFjdGlvbnMgYmV0d2VlbiB6ZXJvIGFuZCBvbmUsIHdpdGggYW55IG5vbi16ZXJvIHZhbHVlIGNvbnNpZGVyZWQgdG8gYmUgYSB2YWx1ZSBvZiBvbmUvdHJ1ZVxuICAgICAgLy8gRWxsaXB0aWNhbCBhcmMgY29tbWFuZCBhcyBhbiBhcnJheSBmb2xsb3dlZCBieSBjb3JyZXNwb25kaW5nIGluZGV4ZXM6XG4gICAgICAvLyBbJ0EnLCByeCwgcnksIHgtYXhpcy1yb3RhdGlvbiwgbGFyZ2UtYXJjLWZsYWcsIHN3ZWVwLWZsYWcsIHgsIHldXG4gICAgICAvLyAgIDAgICAgMSAgIDIgICAgICAgIDMgICAgICAgICAgICAgICAgIDQgICAgICAgICAgICAgNSAgICAgIDYgIDdcblxuXG4gICAgICBpZiAoYXJyYXlbaV1bMF0gPT09ICdBJykge1xuICAgICAgICBhcnJheVtpXVs0XSA9ICsoYXJyYXlbaV1bNF0gIT09IDApO1xuICAgICAgICBhcnJheVtpXVs1XSA9ICsoYXJyYXlbaV1bNV0gIT09IDApO1xuICAgICAgfVxuICAgIH0gLy8gRGlyZWN0bHkgbW9kaWZ5IHRoZSB2YWx1ZSBvZiBhIHBhdGggYXJyYXksIHRoaXMgaXMgZG9uZSB0aGlzIHdheSBmb3IgcGVyZm9ybWFuY2VcblxuXG4gICAgcGF0aEFycmF5LnZhbHVlID0gYXJyYXk7XG4gICAgcmV0dXJuIHBhdGhBcnJheTtcbiAgfSxcbiAgLy8gQWJzb2x1dGl6ZSBhbmQgcGFyc2UgcGF0aCB0byBhcnJheVxuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UoKSB7XG4gICAgdmFyIGFycmF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbWydNJywgMCwgMF1dO1xuICAgIC8vIGlmIGl0J3MgYWxyZWFkeSBhIHBhdGhhcnJheSwgbm8gbmVlZCB0byBwYXJzZSBpdFxuICAgIGlmIChhcnJheSBpbnN0YW5jZW9mIFBhdGhBcnJheSkgcmV0dXJuIGFycmF5OyAvLyBwcmVwYXJlIGZvciBwYXJzaW5nXG5cbiAgICB2YXIgcztcbiAgICB2YXIgcGFyYW1DbnQgPSB7XG4gICAgICBNOiAyLFxuICAgICAgTDogMixcbiAgICAgIEg6IDEsXG4gICAgICBWOiAxLFxuICAgICAgQzogNixcbiAgICAgIFM6IDQsXG4gICAgICBROiA0LFxuICAgICAgVDogMixcbiAgICAgIEE6IDcsXG4gICAgICBaOiAwXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgYXJyYXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhcnJheSA9IGFycmF5LnJlcGxhY2UobnVtYmVyc1dpdGhEb3RzLCBwYXRoUmVnUmVwbGFjZSkgLy8gY29udmVydCA0NS4xMjMuMTIzIHRvIDQ1LjEyMyAuMTIzXG4gICAgICAucmVwbGFjZShwYXRoTGV0dGVycywgJyAkJiAnKSAvLyBwdXQgc29tZSByb29tIGJldHdlZW4gbGV0dGVycyBhbmQgbnVtYmVyc1xuICAgICAgLnJlcGxhY2UoaHlwaGVuLCAnJDEgLScpIC8vIGFkZCBzcGFjZSBiZWZvcmUgaHlwaGVuXG4gICAgICAudHJpbSgpIC8vIHRyaW1cbiAgICAgIC5zcGxpdChkZWxpbWl0ZXIpOyAvLyBzcGxpdCBpbnRvIGFycmF5XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5ID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyKSB7XG4gICAgICAgIHJldHVybiBbXS5jb25jYXQuY2FsbChwcmV2LCBjdXJyKTtcbiAgICAgIH0sIFtdKTtcbiAgICB9IC8vIGFycmF5IG5vdyBpcyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBwYXJ0cyBvZiBhIHBhdGggZS5nLiBbJ00nLCAnMCcsICcwJywgJ0wnLCAnMzAnLCAnMzAnIC4uLl1cblxuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBwID0gbmV3IFBvaW50KCk7XG4gICAgdmFyIHAwID0gbmV3IFBvaW50KCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgbGVuID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgZG8ge1xuICAgICAgLy8gVGVzdCBpZiB3ZSBoYXZlIGEgcGF0aCBsZXR0ZXJcbiAgICAgIGlmIChpc1BhdGhMZXR0ZXIudGVzdChhcnJheVtpbmRleF0pKSB7XG4gICAgICAgIHMgPSBhcnJheVtpbmRleF07XG4gICAgICAgICsraW5kZXg7IC8vIElmIGxhc3QgbGV0dGVyIHdhcyBhIG1vdmUgY29tbWFuZCBhbmQgd2UgZ290IG5vIG5ldywgaXQgZGVmYXVsdHMgdG8gW0xdaW5lXG4gICAgICB9IGVsc2UgaWYgKHMgPT09ICdNJykge1xuICAgICAgICBzID0gJ0wnO1xuICAgICAgfSBlbHNlIGlmIChzID09PSAnbScpIHtcbiAgICAgICAgcyA9ICdsJztcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnB1c2gocGF0aEhhbmRsZXJzW3NdLmNhbGwobnVsbCwgYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ID0gaW5kZXggKyBwYXJhbUNudFtzLnRvVXBwZXJDYXNlKCldKS5tYXAocGFyc2VGbG9hdCksIHAsIHAwKSk7XG4gICAgfSB3aGlsZSAobGVuID4gaW5kZXgpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLy8gR2V0IGJvdW5kaW5nIGJveCBvZiBwYXRoXG4gIGJib3g6IGZ1bmN0aW9uIGJib3goKSB7XG4gICAgcGFyc2VyKCkucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLnRvU3RyaW5nKCkpO1xuICAgIHJldHVybiBwYXJzZXIubm9kZXMucGF0aC5nZXRCQm94KCk7XG4gIH1cbn0pO1xuXG52YXIgTW9ycGhhYmxlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTW9ycGhhYmxlKHN0ZXBwZXIpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9ycGhhYmxlKTtcblxuICAgIHRoaXMuX3N0ZXBwZXIgPSBzdGVwcGVyIHx8IG5ldyBFYXNlKCctJyk7XG4gICAgdGhpcy5fZnJvbSA9IG51bGw7XG4gICAgdGhpcy5fdG8gPSBudWxsO1xuICAgIHRoaXMuX3R5cGUgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX21vcnBoT2JqID0gbnVsbDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNb3JwaGFibGUsIFt7XG4gICAga2V5OiBcImZyb21cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZnJvbSh2YWwpIHtcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJvbTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZnJvbSA9IHRoaXMuX3NldCh2YWwpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvKHZhbCkge1xuICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90bztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdG8gPSB0aGlzLl9zZXQodmFsKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0eXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHR5cGUoX3R5cGUpIHtcbiAgICAgIC8vIGdldHRlclxuICAgICAgaWYgKF90eXBlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgICB9IC8vIHNldHRlclxuXG5cbiAgICAgIHRoaXMuX3R5cGUgPSBfdHlwZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXQodmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5fdHlwZSkge1xuICAgICAgICB2YXIgdHlwZSA9IF90eXBlb2YodmFsdWUpO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRoaXMudHlwZShTVkdOdW1iZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWYgKENvbG9yLmlzQ29sb3IodmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUoQ29sb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGVsaW1pdGVyLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUocGF0aExldHRlcnMudGVzdCh2YWx1ZSkgPyBQYXRoQXJyYXkgOiBTVkdBcnJheSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXJBbmRVbml0LnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUoU1ZHTnVtYmVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50eXBlKE5vbk1vcnBoYWJsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1vcnBoYWJsZVR5cGVzLmluZGV4T2YodmFsdWUuY29uc3RydWN0b3IpID4gLTEpIHtcbiAgICAgICAgICB0aGlzLnR5cGUodmFsdWUuY29uc3RydWN0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgdGhpcy50eXBlKFNWR0FycmF5KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRoaXMudHlwZShPYmplY3RCYWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudHlwZShOb25Nb3JwaGFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSBuZXcgdGhpcy5fdHlwZSh2YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl90eXBlID09PSBDb2xvcikge1xuICAgICAgICByZXN1bHQgPSB0aGlzLl90byA/IHJlc3VsdFt0aGlzLl90b1s0XV0oKSA6IHRoaXMuX2Zyb20gPyByZXN1bHRbdGhpcy5fZnJvbVs0XV0oKSA6IHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0ID0gcmVzdWx0LnRvQXJyYXkoKTtcbiAgICAgIHRoaXMuX21vcnBoT2JqID0gdGhpcy5fbW9ycGhPYmogfHwgbmV3IHRoaXMuX3R5cGUoKTtcbiAgICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzLl9jb250ZXh0IHx8IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KHJlc3VsdC5sZW5ndGgpKS5tYXAoT2JqZWN0KS5tYXAoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgby5kb25lID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG87XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0ZXBwZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RlcHBlcihfc3RlcHBlcikge1xuICAgICAgaWYgKF9zdGVwcGVyID09IG51bGwpIHJldHVybiB0aGlzLl9zdGVwcGVyO1xuICAgICAgdGhpcy5fc3RlcHBlciA9IF9zdGVwcGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIHZhciBjb21wbGV0ZSA9IHRoaXMuX2NvbnRleHQubWFwKHRoaXMuX3N0ZXBwZXIuZG9uZSkucmVkdWNlKGZ1bmN0aW9uIChsYXN0LCBjdXJyKSB7XG4gICAgICAgIHJldHVybiBsYXN0ICYmIGN1cnI7XG4gICAgICB9LCB0cnVlKTtcblxuICAgICAgcmV0dXJuIGNvbXBsZXRlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdChwb3MpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiB0aGlzLl9tb3JwaE9iai5mcm9tQXJyYXkodGhpcy5fZnJvbS5tYXAoZnVuY3Rpb24gKGksIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fc3RlcHBlci5zdGVwKGksIF90aGlzLl90b1tpbmRleF0sIHBvcywgX3RoaXMuX2NvbnRleHRbaW5kZXhdLCBfdGhpcy5fY29udGV4dCk7XG4gICAgICB9KSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1vcnBoYWJsZTtcbn0oKTtcbnZhciBOb25Nb3JwaGFibGUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBOb25Nb3JwaGFibGUoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE5vbk1vcnBoYWJsZSk7XG5cbiAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOb25Nb3JwaGFibGUsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCh2YWwpIHtcbiAgICAgIHZhbCA9IEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbFswXSA6IHZhbDtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVPZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHJldHVybiBbdGhpcy52YWx1ZV07XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE5vbk1vcnBoYWJsZTtcbn0oKTtcbnZhciBUcmFuc2Zvcm1CYWcgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUcmFuc2Zvcm1CYWcoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zZm9ybUJhZyk7XG5cbiAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhUcmFuc2Zvcm1CYWcsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChvYmopIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgb2JqID0ge1xuICAgICAgICAgIHNjYWxlWDogb2JqWzBdLFxuICAgICAgICAgIHNjYWxlWTogb2JqWzFdLFxuICAgICAgICAgIHNoZWFyOiBvYmpbMl0sXG4gICAgICAgICAgcm90YXRlOiBvYmpbM10sXG4gICAgICAgICAgdHJhbnNsYXRlWDogb2JqWzRdLFxuICAgICAgICAgIHRyYW5zbGF0ZVk6IG9ials1XSxcbiAgICAgICAgICBvcmlnaW5YOiBvYmpbNl0sXG4gICAgICAgICAgb3JpZ2luWTogb2JqWzddXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgVHJhbnNmb3JtQmFnLmRlZmF1bHRzLCBvYmopO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHZhciB2ID0gdGhpcztcbiAgICAgIHJldHVybiBbdi5zY2FsZVgsIHYuc2NhbGVZLCB2LnNoZWFyLCB2LnJvdGF0ZSwgdi50cmFuc2xhdGVYLCB2LnRyYW5zbGF0ZVksIHYub3JpZ2luWCwgdi5vcmlnaW5ZXTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVHJhbnNmb3JtQmFnO1xufSgpO1xuVHJhbnNmb3JtQmFnLmRlZmF1bHRzID0ge1xuICBzY2FsZVg6IDEsXG4gIHNjYWxlWTogMSxcbiAgc2hlYXI6IDAsXG4gIHJvdGF0ZTogMCxcbiAgdHJhbnNsYXRlWDogMCxcbiAgdHJhbnNsYXRlWTogMCxcbiAgb3JpZ2luWDogMCxcbiAgb3JpZ2luWTogMFxufTtcbnZhciBPYmplY3RCYWcgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBPYmplY3RCYWcoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE9iamVjdEJhZyk7XG5cbiAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhPYmplY3RCYWcsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChvYmpPckFycikge1xuICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqT3JBcnIpKSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gb2JqT3JBcnI7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb2JqT3JBcnIgPSBvYmpPckFyciB8fCB7fTtcbiAgICAgIHZhciBlbnRyaWVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgaW4gb2JqT3JBcnIpIHtcbiAgICAgICAgZW50cmllcy5wdXNoKFtpLCBvYmpPckFycltpXV0pO1xuICAgICAgfVxuXG4gICAgICBlbnRyaWVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFbMF0gLSBiWzBdO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnZhbHVlcyA9IGVudHJpZXMucmVkdWNlKGZ1bmN0aW9uIChsYXN0LCBjdXJyKSB7XG4gICAgICAgIHJldHVybiBsYXN0LmNvbmNhdChjdXJyKTtcbiAgICAgIH0sIFtdKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ2YWx1ZU9mXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlT2YoKSB7XG4gICAgICB2YXIgb2JqID0ge307XG4gICAgICB2YXIgYXJyID0gdGhpcy52YWx1ZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgb2JqW2FycltpXV0gPSBhcnJbaSArIDFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9iamVjdEJhZztcbn0oKTtcbnZhciBtb3JwaGFibGVUeXBlcyA9IFtOb25Nb3JwaGFibGUsIFRyYW5zZm9ybUJhZywgT2JqZWN0QmFnXTtcbmZ1bmN0aW9uIHJlZ2lzdGVyTW9ycGhhYmxlVHlwZSgpIHtcbiAgdmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICBtb3JwaGFibGVUeXBlcy5wdXNoLmFwcGx5KG1vcnBoYWJsZVR5cGVzLCBfdG9Db25zdW1hYmxlQXJyYXkoW10uY29uY2F0KHR5cGUpKSk7XG59XG5mdW5jdGlvbiBtYWtlTW9ycGhhYmxlKCkge1xuICBleHRlbmQobW9ycGhhYmxlVHlwZXMsIHtcbiAgICB0bzogZnVuY3Rpb24gdG8odmFsKSB7XG4gICAgICByZXR1cm4gbmV3IE1vcnBoYWJsZSgpLnR5cGUodGhpcy5jb25zdHJ1Y3RvcikuZnJvbSh0aGlzLnZhbHVlT2YoKSkudG8odmFsKTtcbiAgICB9LFxuICAgIGZyb21BcnJheTogZnVuY3Rpb24gZnJvbUFycmF5KGFycikge1xuICAgICAgdGhpcy5pbml0KGFycik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xufVxuXG52YXIgUGF0aCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhQYXRoLCBfU2hhcGUpO1xuXG4gIC8vIEluaXRpYWxpemUgbm9kZVxuICBmdW5jdGlvbiBQYXRoKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGF0aCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFBhdGgpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdwYXRoJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBHZXQgYXJyYXlcblxuXG4gIF9jcmVhdGVDbGFzcyhQYXRoLCBbe1xuICAgIGtleTogXCJhcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcnJheSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hcnJheSB8fCAodGhpcy5fYXJyYXkgPSBuZXcgUGF0aEFycmF5KHRoaXMuYXR0cignZCcpKSk7XG4gICAgfSAvLyBQbG90IG5ldyBwYXRoXG5cbiAgfSwge1xuICAgIGtleTogXCJwbG90XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsb3QoZCkge1xuICAgICAgcmV0dXJuIGQgPT0gbnVsbCA/IHRoaXMuYXJyYXkoKSA6IHRoaXMuY2xlYXIoKS5hdHRyKCdkJywgdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZCA6IHRoaXMuX2FycmF5ID0gbmV3IFBhdGhBcnJheShkKSk7XG4gICAgfSAvLyBDbGVhciBhcnJheSBjYWNoZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICBkZWxldGUgdGhpcy5fYXJyYXk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZCcsIHRoaXMuYXJyYXkoKS5tb3ZlKHgsIHkpKTtcbiAgICB9IC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyIG92ZXIgeC1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHgoX3gpIHtcbiAgICAgIHJldHVybiBfeCA9PSBudWxsID8gdGhpcy5iYm94KCkueCA6IHRoaXMubW92ZShfeCwgdGhpcy5iYm94KCkueSk7XG4gICAgfSAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHktYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwieVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB5KF95KSB7XG4gICAgICByZXR1cm4gX3kgPT0gbnVsbCA/IHRoaXMuYmJveCgpLnkgOiB0aGlzLm1vdmUodGhpcy5iYm94KCkueCwgX3kpO1xuICAgIH0gLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XG5cbiAgfSwge1xuICAgIGtleTogXCJzaXplXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZCcsIHRoaXMuYXJyYXkoKS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KSk7XG4gICAgfSAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwid2lkdGhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2lkdGgoX3dpZHRoKSB7XG4gICAgICByZXR1cm4gX3dpZHRoID09IG51bGwgPyB0aGlzLmJib3goKS53aWR0aCA6IHRoaXMuc2l6ZShfd2lkdGgsIHRoaXMuYmJveCgpLmhlaWdodCk7XG4gICAgfSAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImhlaWdodFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoZWlnaHQoX2hlaWdodCkge1xuICAgICAgcmV0dXJuIF9oZWlnaHQgPT0gbnVsbCA/IHRoaXMuYmJveCgpLmhlaWdodCA6IHRoaXMuc2l6ZSh0aGlzLmJib3goKS53aWR0aCwgX2hlaWdodCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRhcmdldHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiBiYXNlRmluZCgnc3ZnIHRleHRwYXRoIFtocmVmKj1cIicgKyB0aGlzLmlkKCkgKyAnXCJdJyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBhdGg7XG59KFNoYXBlKTsgLy8gRGVmaW5lIG1vcnBoYWJsZSBhcnJheVxuUGF0aC5wcm90b3R5cGUuTW9ycGhBcnJheSA9IFBhdGhBcnJheTsgLy8gQWRkIHBhcmVudCBtZXRob2RcblxucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGEgd3JhcHBlZCBwYXRoIGVsZW1lbnRcbiAgICBwYXRoOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoZCkge1xuICAgICAgLy8gbWFrZSBzdXJlIHBsb3QgaXMgY2FsbGVkIGFzIGEgc2V0dGVyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFBhdGgoKSkucGxvdChkIHx8IG5ldyBQYXRoQXJyYXkoKSk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihQYXRoLCAnUGF0aCcpO1xuXG5mdW5jdGlvbiBhcnJheSgpIHtcbiAgcmV0dXJuIHRoaXMuX2FycmF5IHx8ICh0aGlzLl9hcnJheSA9IG5ldyBQb2ludEFycmF5KHRoaXMuYXR0cigncG9pbnRzJykpKTtcbn0gLy8gUGxvdCBuZXcgcGF0aFxuXG5mdW5jdGlvbiBwbG90KHApIHtcbiAgcmV0dXJuIHAgPT0gbnVsbCA/IHRoaXMuYXJyYXkoKSA6IHRoaXMuY2xlYXIoKS5hdHRyKCdwb2ludHMnLCB0eXBlb2YgcCA9PT0gJ3N0cmluZycgPyBwIDogdGhpcy5fYXJyYXkgPSBuZXcgUG9pbnRBcnJheShwKSk7XG59IC8vIENsZWFyIGFycmF5IGNhY2hlXG5cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICBkZWxldGUgdGhpcy5fYXJyYXk7XG4gIHJldHVybiB0aGlzO1xufSAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxuXG5mdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgcmV0dXJuIHRoaXMuYXR0cigncG9pbnRzJywgdGhpcy5hcnJheSgpLm1vdmUoeCwgeSkpO1xufSAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcblxuZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbiAgcmV0dXJuIHRoaXMuYXR0cigncG9pbnRzJywgdGhpcy5hcnJheSgpLnNpemUocC53aWR0aCwgcC5oZWlnaHQpKTtcbn1cblxudmFyIHBvbHkgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdGFycmF5OiBhcnJheSxcblx0cGxvdDogcGxvdCxcblx0Y2xlYXI6IGNsZWFyLFxuXHRtb3ZlOiBtb3ZlLFxuXHRzaXplOiBzaXplXG59KTtcblxudmFyIFBvbHlnb24gPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoUG9seWdvbiwgX1NoYXBlKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gUG9seWdvbihub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvbHlnb24pO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihQb2x5Z29uKS5jYWxsKHRoaXMsIG5vZGVPck5ldygncG9seWdvbicsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICByZXR1cm4gUG9seWdvbjtcbn0oU2hhcGUpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGEgd3JhcHBlZCBwb2x5Z29uIGVsZW1lbnRcbiAgICBwb2x5Z29uOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAocCkge1xuICAgICAgLy8gbWFrZSBzdXJlIHBsb3QgaXMgY2FsbGVkIGFzIGEgc2V0dGVyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFBvbHlnb24oKSkucGxvdChwIHx8IG5ldyBQb2ludEFycmF5KCkpO1xuICAgIH0pXG4gIH1cbn0pO1xuZXh0ZW5kKFBvbHlnb24sIHBvaW50ZWQpO1xuZXh0ZW5kKFBvbHlnb24sIHBvbHkpO1xucmVnaXN0ZXIoUG9seWdvbiwgJ1BvbHlnb24nKTtcblxudmFyIFBvbHlsaW5lID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKFBvbHlsaW5lLCBfU2hhcGUpO1xuXG4gIC8vIEluaXRpYWxpemUgbm9kZVxuICBmdW5jdGlvbiBQb2x5bGluZShub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvbHlsaW5lKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUG9seWxpbmUpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdwb2x5bGluZScsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICByZXR1cm4gUG9seWxpbmU7XG59KFNoYXBlKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcG9seWdvbiBlbGVtZW50XG4gICAgcG9seWxpbmU6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uIChwKSB7XG4gICAgICAvLyBtYWtlIHN1cmUgcGxvdCBpcyBjYWxsZWQgYXMgYSBzZXR0ZXJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgUG9seWxpbmUoKSkucGxvdChwIHx8IG5ldyBQb2ludEFycmF5KCkpO1xuICAgIH0pXG4gIH1cbn0pO1xuZXh0ZW5kKFBvbHlsaW5lLCBwb2ludGVkKTtcbmV4dGVuZChQb2x5bGluZSwgcG9seSk7XG5yZWdpc3RlcihQb2x5bGluZSwgJ1BvbHlsaW5lJyk7XG5cbnZhciBSZWN0ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKFJlY3QsIF9TaGFwZSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFJlY3Qobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZWN0KTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUmVjdCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3JlY3QnLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgcmV0dXJuIFJlY3Q7XG59KFNoYXBlKTtcbmV4dGVuZChSZWN0LCB7XG4gIHJ4OiByeCxcbiAgcnk6IHJ5XG59KTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIHJlY3QgZWxlbWVudFxuICAgIHJlY3Q6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFJlY3QoKSkuc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFJlY3QsICdSZWN0Jyk7XG5cbnZhciBtYXgkMyA9IE1hdGgubWF4O1xudmFyIG1pbiQ0ID0gTWF0aC5taW47XG52YXIgTUFYX1NBRkVfSU5URUdFUiQxID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfTEVOR1RIX0VYQ0VFREVEID0gJ01heGltdW0gYWxsb3dlZCBsZW5ndGggZXhjZWVkZWQnO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnNwbGljZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc3BsaWNlXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIWFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQoJ3NwbGljZScpIH0sIHtcbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50IC8qICwgLi4uaXRlbXMgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGFjdHVhbFN0YXJ0ID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW4pO1xuICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpbnNlcnRDb3VudCwgYWN0dWFsRGVsZXRlQ291bnQsIEEsIGssIGZyb20sIHRvO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPT09IDApIHtcbiAgICAgIGluc2VydENvdW50ID0gYWN0dWFsRGVsZXRlQ291bnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAxKSB7XG4gICAgICBpbnNlcnRDb3VudCA9IDA7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IGxlbiAtIGFjdHVhbFN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRDb3VudCA9IGFyZ3VtZW50c0xlbmd0aCAtIDI7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IG1pbiQ0KG1heCQzKHRvSW50ZWdlcihkZWxldGVDb3VudCksIDApLCBsZW4gLSBhY3R1YWxTdGFydCk7XG4gICAgfVxuICAgIGlmIChsZW4gKyBpbnNlcnRDb3VudCAtIGFjdHVhbERlbGV0ZUNvdW50ID4gTUFYX1NBRkVfSU5URUdFUiQxKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCk7XG4gICAgfVxuICAgIEEgPSBhcnJheVNwZWNpZXNDcmVhdGUoTywgYWN0dWFsRGVsZXRlQ291bnQpO1xuICAgIGZvciAoayA9IDA7IGsgPCBhY3R1YWxEZWxldGVDb3VudDsgaysrKSB7XG4gICAgICBmcm9tID0gYWN0dWFsU3RhcnQgKyBrO1xuICAgICAgaWYgKGZyb20gaW4gTykgY3JlYXRlUHJvcGVydHkoQSwgaywgT1tmcm9tXSk7XG4gICAgfVxuICAgIEEubGVuZ3RoID0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgaWYgKGluc2VydENvdW50IDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgIGZvciAoayA9IGFjdHVhbFN0YXJ0OyBrIDwgbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsrKykge1xuICAgICAgICBmcm9tID0gayArIGFjdHVhbERlbGV0ZUNvdW50O1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudDtcbiAgICAgICAgaWYgKGZyb20gaW4gTykgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIH1cbiAgICAgIGZvciAoayA9IGxlbjsgayA+IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7IGstLSkgZGVsZXRlIE9bayAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaW5zZXJ0Q291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgZm9yIChrID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsgPiBhY3R1YWxTdGFydDsgay0tKSB7XG4gICAgICAgIGZyb20gPSBrICsgYWN0dWFsRGVsZXRlQ291bnQgLSAxO1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudCAtIDE7XG4gICAgICAgIGlmIChmcm9tIGluIE8pIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoayA9IDA7IGsgPCBpbnNlcnRDb3VudDsgaysrKSB7XG4gICAgICBPW2sgKyBhY3R1YWxTdGFydF0gPSBhcmd1bWVudHNbayArIDJdO1xuICAgIH1cbiAgICBPLmxlbmd0aCA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xuXG52YXIgUXVldWUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBRdWV1ZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUXVldWUpO1xuXG4gICAgdGhpcy5fZmlyc3QgPSBudWxsO1xuICAgIHRoaXMuX2xhc3QgPSBudWxsO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFF1ZXVlLCBbe1xuICAgIGtleTogXCJwdXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2godmFsdWUpIHtcbiAgICAgIC8vIEFuIGl0ZW0gc3RvcmVzIGFuIGlkIGFuZCB0aGUgcHJvdmlkZWQgdmFsdWVcbiAgICAgIHZhciBpdGVtID0gdmFsdWUubmV4dCA/IHZhbHVlIDoge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIG5leHQ6IG51bGwsXG4gICAgICAgIHByZXY6IG51bGxcbiAgICAgIH07IC8vIERlYWwgd2l0aCB0aGUgcXVldWUgYmVpbmcgZW1wdHkgb3IgcG9wdWxhdGVkXG5cbiAgICAgIGlmICh0aGlzLl9sYXN0KSB7XG4gICAgICAgIGl0ZW0ucHJldiA9IHRoaXMuX2xhc3Q7XG4gICAgICAgIHRoaXMuX2xhc3QubmV4dCA9IGl0ZW07XG4gICAgICAgIHRoaXMuX2xhc3QgPSBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdCA9IGl0ZW07XG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gaXRlbTtcbiAgICAgIH0gLy8gUmV0dXJuIHRoZSBjdXJyZW50IGl0ZW1cblxuXG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2hpZnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hpZnQoKSB7XG4gICAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIGEgdmFsdWVcbiAgICAgIHZhciByZW1vdmUgPSB0aGlzLl9maXJzdDtcbiAgICAgIGlmICghcmVtb3ZlKSByZXR1cm4gbnVsbDsgLy8gSWYgd2UgZG8sIHJlbW92ZSBpdCBhbmQgcmVsaW5rIHRoaW5nc1xuXG4gICAgICB0aGlzLl9maXJzdCA9IHJlbW92ZS5uZXh0O1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0KSB0aGlzLl9maXJzdC5wcmV2ID0gbnVsbDtcbiAgICAgIHRoaXMuX2xhc3QgPSB0aGlzLl9maXJzdCA/IHRoaXMuX2xhc3QgOiBudWxsO1xuICAgICAgcmV0dXJuIHJlbW92ZS52YWx1ZTtcbiAgICB9IC8vIFNob3dzIHVzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBsaXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJmaXJzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaXJzdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9maXJzdCAmJiB0aGlzLl9maXJzdC52YWx1ZTtcbiAgICB9IC8vIFNob3dzIHVzIHRoZSBsYXN0IGl0ZW0gaW4gdGhlIGxpc3RcblxuICB9LCB7XG4gICAga2V5OiBcImxhc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGFzdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sYXN0ICYmIHRoaXMuX2xhc3QudmFsdWU7XG4gICAgfSAvLyBSZW1vdmVzIHRoZSBpdGVtIHRoYXQgd2FzIHJldHVybmVkIGZyb20gdGhlIHB1c2hcblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoaXRlbSkge1xuICAgICAgLy8gUmVsaW5rIHRoZSBwcmV2aW91cyBpdGVtXG4gICAgICBpZiAoaXRlbS5wcmV2KSBpdGVtLnByZXYubmV4dCA9IGl0ZW0ubmV4dDtcbiAgICAgIGlmIChpdGVtLm5leHQpIGl0ZW0ubmV4dC5wcmV2ID0gaXRlbS5wcmV2O1xuICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuX2xhc3QpIHRoaXMuX2xhc3QgPSBpdGVtLnByZXY7XG4gICAgICBpZiAoaXRlbSA9PT0gdGhpcy5fZmlyc3QpIHRoaXMuX2ZpcnN0ID0gaXRlbS5uZXh0OyAvLyBJbnZhbGlkYXRlIGl0ZW1cblxuICAgICAgaXRlbS5wcmV2ID0gbnVsbDtcbiAgICAgIGl0ZW0ubmV4dCA9IG51bGw7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFF1ZXVlO1xufSgpO1xuXG52YXIgQW5pbWF0b3IgPSB7XG4gIG5leHREcmF3OiBudWxsLFxuICBmcmFtZXM6IG5ldyBRdWV1ZSgpLFxuICB0aW1lb3V0czogbmV3IFF1ZXVlKCksXG4gIGltbWVkaWF0ZXM6IG5ldyBRdWV1ZSgpLFxuICB0aW1lcjogZnVuY3Rpb24gdGltZXIoKSB7XG4gICAgcmV0dXJuIGdsb2JhbHMud2luZG93LnBlcmZvcm1hbmNlIHx8IGdsb2JhbHMud2luZG93LkRhdGU7XG4gIH0sXG4gIHRyYW5zZm9ybXM6IFtdLFxuICBmcmFtZTogZnVuY3Rpb24gZnJhbWUoZm4pIHtcbiAgICAvLyBTdG9yZSB0aGUgbm9kZVxuICAgIHZhciBub2RlID0gQW5pbWF0b3IuZnJhbWVzLnB1c2goe1xuICAgICAgcnVuOiBmblxuICAgIH0pOyAvLyBSZXF1ZXN0IGFuIGFuaW1hdGlvbiBmcmFtZSBpZiB3ZSBkb24ndCBoYXZlIG9uZVxuXG4gICAgaWYgKEFuaW1hdG9yLm5leHREcmF3ID09PSBudWxsKSB7XG4gICAgICBBbmltYXRvci5uZXh0RHJhdyA9IGdsb2JhbHMud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShBbmltYXRvci5fZHJhdyk7XG4gICAgfSAvLyBSZXR1cm4gdGhlIG5vZGUgc28gd2UgY2FuIHJlbW92ZSBpdCBlYXNpbHlcblxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG4gIHRpbWVvdXQ6IGZ1bmN0aW9uIHRpbWVvdXQoZm4sIGRlbGF5KSB7XG4gICAgZGVsYXkgPSBkZWxheSB8fCAwOyAvLyBXb3JrIG91dCB3aGVuIHRoZSBldmVudCBzaG91bGQgZmlyZVxuXG4gICAgdmFyIHRpbWUgPSBBbmltYXRvci50aW1lcigpLm5vdygpICsgZGVsYXk7IC8vIEFkZCB0aGUgdGltZW91dCB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuXG4gICAgdmFyIG5vZGUgPSBBbmltYXRvci50aW1lb3V0cy5wdXNoKHtcbiAgICAgIHJ1bjogZm4sXG4gICAgICB0aW1lOiB0aW1lXG4gICAgfSk7IC8vIFJlcXVlc3QgYW5vdGhlciBhbmltYXRpb24gZnJhbWUgaWYgd2UgbmVlZCBvbmVcblxuICAgIGlmIChBbmltYXRvci5uZXh0RHJhdyA9PT0gbnVsbCkge1xuICAgICAgQW5pbWF0b3IubmV4dERyYXcgPSBnbG9iYWxzLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoQW5pbWF0b3IuX2RyYXcpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBpbW1lZGlhdGU6IGZ1bmN0aW9uIGltbWVkaWF0ZShmbikge1xuICAgIC8vIEFkZCB0aGUgaW1tZWRpYXRlIGZuIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlXG4gICAgdmFyIG5vZGUgPSBBbmltYXRvci5pbW1lZGlhdGVzLnB1c2goZm4pOyAvLyBSZXF1ZXN0IGFub3RoZXIgYW5pbWF0aW9uIGZyYW1lIGlmIHdlIG5lZWQgb25lXG5cbiAgICBpZiAoQW5pbWF0b3IubmV4dERyYXcgPT09IG51bGwpIHtcbiAgICAgIEFuaW1hdG9yLm5leHREcmF3ID0gZ2xvYmFscy53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEFuaW1hdG9yLl9kcmF3KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcbiAgY2FuY2VsRnJhbWU6IGZ1bmN0aW9uIGNhbmNlbEZyYW1lKG5vZGUpIHtcbiAgICBub2RlICE9IG51bGwgJiYgQW5pbWF0b3IuZnJhbWVzLnJlbW92ZShub2RlKTtcbiAgfSxcbiAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiBjbGVhclRpbWVvdXQobm9kZSkge1xuICAgIG5vZGUgIT0gbnVsbCAmJiBBbmltYXRvci50aW1lb3V0cy5yZW1vdmUobm9kZSk7XG4gIH0sXG4gIGNhbmNlbEltbWVkaWF0ZTogZnVuY3Rpb24gY2FuY2VsSW1tZWRpYXRlKG5vZGUpIHtcbiAgICBub2RlICE9IG51bGwgJiYgQW5pbWF0b3IuaW1tZWRpYXRlcy5yZW1vdmUobm9kZSk7XG4gIH0sXG4gIF9kcmF3OiBmdW5jdGlvbiBfZHJhdyhub3cpIHtcbiAgICAvLyBSdW4gYWxsIHRoZSB0aW1lb3V0cyB3ZSBjYW4gcnVuLCBpZiB0aGV5IGFyZSBub3QgcmVhZHkgeWV0LCBhZGQgdGhlbVxuICAgIC8vIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlIGltbWVkaWF0ZWx5ISAoYmFkIHRpbWVvdXRzISEhIFtzYXJjYXNtXSlcbiAgICB2YXIgbmV4dFRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBsYXN0VGltZW91dCA9IEFuaW1hdG9yLnRpbWVvdXRzLmxhc3QoKTtcblxuICAgIHdoaWxlIChuZXh0VGltZW91dCA9IEFuaW1hdG9yLnRpbWVvdXRzLnNoaWZ0KCkpIHtcbiAgICAgIC8vIFJ1biB0aGUgdGltZW91dCBpZiBpdHMgdGltZSwgb3IgcHVzaCBpdCB0byB0aGUgZW5kXG4gICAgICBpZiAobm93ID49IG5leHRUaW1lb3V0LnRpbWUpIHtcbiAgICAgICAgbmV4dFRpbWVvdXQucnVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBbmltYXRvci50aW1lb3V0cy5wdXNoKG5leHRUaW1lb3V0KTtcbiAgICAgIH0gLy8gSWYgd2UgaGl0IHRoZSBsYXN0IGl0ZW0sIHdlIHNob3VsZCBzdG9wIHNoaWZ0aW5nIG91dCBtb3JlIGl0ZW1zXG5cblxuICAgICAgaWYgKG5leHRUaW1lb3V0ID09PSBsYXN0VGltZW91dCkgYnJlYWs7XG4gICAgfSAvLyBSdW4gYWxsIG9mIHRoZSBhbmltYXRpb24gZnJhbWVzXG5cblxuICAgIHZhciBuZXh0RnJhbWUgPSBudWxsO1xuICAgIHZhciBsYXN0RnJhbWUgPSBBbmltYXRvci5mcmFtZXMubGFzdCgpO1xuXG4gICAgd2hpbGUgKG5leHRGcmFtZSAhPT0gbGFzdEZyYW1lICYmIChuZXh0RnJhbWUgPSBBbmltYXRvci5mcmFtZXMuc2hpZnQoKSkpIHtcbiAgICAgIG5leHRGcmFtZS5ydW4obm93KTtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEltbWVkaWF0ZSA9IG51bGw7XG5cbiAgICB3aGlsZSAobmV4dEltbWVkaWF0ZSA9IEFuaW1hdG9yLmltbWVkaWF0ZXMuc2hpZnQoKSkge1xuICAgICAgbmV4dEltbWVkaWF0ZSgpO1xuICAgIH0gLy8gSWYgd2UgaGF2ZSByZW1haW5pbmcgdGltZW91dHMgb3IgZnJhbWVzLCBkcmF3IHVudGlsIHdlIGRvbid0IGFueW1vcmVcblxuXG4gICAgQW5pbWF0b3IubmV4dERyYXcgPSBBbmltYXRvci50aW1lb3V0cy5maXJzdCgpIHx8IEFuaW1hdG9yLmZyYW1lcy5maXJzdCgpID8gZ2xvYmFscy53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEFuaW1hdG9yLl9kcmF3KSA6IG51bGw7XG4gIH1cbn07XG5cbnZhciBtYWtlU2NoZWR1bGUgPSBmdW5jdGlvbiBtYWtlU2NoZWR1bGUocnVubmVySW5mbykge1xuICB2YXIgc3RhcnQgPSBydW5uZXJJbmZvLnN0YXJ0O1xuICB2YXIgZHVyYXRpb24gPSBydW5uZXJJbmZvLnJ1bm5lci5kdXJhdGlvbigpO1xuICB2YXIgZW5kID0gc3RhcnQgKyBkdXJhdGlvbjtcbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgIGVuZDogZW5kLFxuICAgIHJ1bm5lcjogcnVubmVySW5mby5ydW5uZXJcbiAgfTtcbn07XG5cbnZhciBkZWZhdWx0U291cmNlID0gZnVuY3Rpb24gZGVmYXVsdFNvdXJjZSgpIHtcbiAgdmFyIHcgPSBnbG9iYWxzLndpbmRvdztcbiAgcmV0dXJuICh3LnBlcmZvcm1hbmNlIHx8IHcuRGF0ZSkubm93KCk7XG59O1xuXG52YXIgVGltZWxpbmUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FdmVudFRhcmdldCkge1xuICBfaW5oZXJpdHMoVGltZWxpbmUsIF9FdmVudFRhcmdldCk7XG5cbiAgLy8gQ29uc3RydWN0IGEgbmV3IHRpbWVsaW5lIG9uIHRoZSBnaXZlbiBlbGVtZW50XG4gIGZ1bmN0aW9uIFRpbWVsaW5lKCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIHZhciB0aW1lU291cmNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBkZWZhdWx0U291cmNlO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRpbWVsaW5lKTtcblxuICAgIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFRpbWVsaW5lKS5jYWxsKHRoaXMpKTtcbiAgICBfdGhpcy5fdGltZVNvdXJjZSA9IHRpbWVTb3VyY2U7IC8vIFN0b3JlIHRoZSB0aW1pbmcgdmFyaWFibGVzXG5cbiAgICBfdGhpcy5fc3RhcnRUaW1lID0gMDtcbiAgICBfdGhpcy5fc3BlZWQgPSAxLjA7IC8vIERldGVybWluZXMgaG93IGxvbmcgYSBydW5uZXIgaXMgaG9sZCBpbiBtZW1vcnkuIENhbiBiZSBhIGR0IG9yIHRydWUvZmFsc2VcblxuICAgIF90aGlzLl9wZXJzaXN0ID0gMDsgLy8gS2VlcCB0cmFjayBvZiB0aGUgcnVubmluZyBhbmltYXRpb25zIGFuZCB0aGVpciBzdGFydGluZyBwYXJhbWV0ZXJzXG5cbiAgICBfdGhpcy5fbmV4dEZyYW1lID0gbnVsbDtcbiAgICBfdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICBfdGhpcy5fcnVubmVycyA9IFtdO1xuICAgIF90aGlzLl9ydW5uZXJJZHMgPSBbXTtcbiAgICBfdGhpcy5fbGFzdFJ1bm5lcklkID0gLTE7XG4gICAgX3RoaXMuX3RpbWUgPSAwO1xuICAgIF90aGlzLl9sYXN0U291cmNlVGltZSA9IDA7XG4gICAgX3RoaXMuX2xhc3RTdGVwVGltZSA9IDA7IC8vIE1ha2Ugc3VyZSB0aGF0IHN0ZXAgaXMgYWx3YXlzIGNhbGxlZCBpbiBjbGFzcyBjb250ZXh0XG5cbiAgICBfdGhpcy5fc3RlcCA9IF90aGlzLl9zdGVwRm4uYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgZmFsc2UpO1xuICAgIF90aGlzLl9zdGVwSW1tZWRpYXRlID0gX3RoaXMuX3N0ZXBGbi5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCB0cnVlKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH0gLy8gc2NoZWR1bGVzIGEgcnVubmVyIG9uIHRoZSB0aW1lbGluZVxuXG5cbiAgX2NyZWF0ZUNsYXNzKFRpbWVsaW5lLCBbe1xuICAgIGtleTogXCJzY2hlZHVsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzY2hlZHVsZShydW5uZXIsIGRlbGF5LCB3aGVuKSB7XG4gICAgICBpZiAocnVubmVyID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1bm5lcnMubWFwKG1ha2VTY2hlZHVsZSk7XG4gICAgICB9IC8vIFRoZSBzdGFydCB0aW1lIGZvciB0aGUgbmV4dCBhbmltYXRpb24gY2FuIGVpdGhlciBiZSBnaXZlbiBleHBsaWNpdGx5LFxuICAgICAgLy8gZGVyaXZlZCBmcm9tIHRoZSBjdXJyZW50IHRpbWVsaW5lIHRpbWUgb3IgaXQgY2FuIGJlIHJlbGF0aXZlIHRvIHRoZVxuICAgICAgLy8gbGFzdCBzdGFydCB0aW1lIHRvIGNoYWluIGFuaW1hdGlvbnMgZGlyZWNsdHlcblxuXG4gICAgICB2YXIgYWJzb2x1dGVTdGFydFRpbWUgPSAwO1xuICAgICAgdmFyIGVuZFRpbWUgPSB0aGlzLmdldEVuZFRpbWUoKTtcbiAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDsgLy8gV29yayBvdXQgd2hlbiB0byBzdGFydCB0aGUgYW5pbWF0aW9uXG5cbiAgICAgIGlmICh3aGVuID09IG51bGwgfHwgd2hlbiA9PT0gJ2xhc3QnIHx8IHdoZW4gPT09ICdhZnRlcicpIHtcbiAgICAgICAgLy8gVGFrZSB0aGUgbGFzdCB0aW1lIGFuZCBpbmNyZW1lbnRcbiAgICAgICAgYWJzb2x1dGVTdGFydFRpbWUgPSBlbmRUaW1lO1xuICAgICAgfSBlbHNlIGlmICh3aGVuID09PSAnYWJzb2x1dGUnIHx8IHdoZW4gPT09ICdzdGFydCcpIHtcbiAgICAgICAgYWJzb2x1dGVTdGFydFRpbWUgPSBkZWxheTtcbiAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgfSBlbHNlIGlmICh3aGVuID09PSAnbm93Jykge1xuICAgICAgICBhYnNvbHV0ZVN0YXJ0VGltZSA9IHRoaXMuX3RpbWU7XG4gICAgICB9IGVsc2UgaWYgKHdoZW4gPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgICAgdmFyIF9ydW5uZXJJbmZvID0gdGhpcy5fcnVubmVyc1tydW5uZXIuaWRdO1xuXG4gICAgICAgIGlmIChfcnVubmVySW5mbykge1xuICAgICAgICAgIGFic29sdXRlU3RhcnRUaW1lID0gX3J1bm5lckluZm8uc3RhcnQgKyBkZWxheTtcbiAgICAgICAgICBkZWxheSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgdGhlIFwid2hlblwiIHBhcmFtZXRlcicpO1xuICAgICAgfSAvLyBNYW5hZ2UgcnVubmVyXG5cblxuICAgICAgcnVubmVyLnVuc2NoZWR1bGUoKTtcbiAgICAgIHJ1bm5lci50aW1lbGluZSh0aGlzKTtcbiAgICAgIHZhciBwZXJzaXN0ID0gcnVubmVyLnBlcnNpc3QoKTtcbiAgICAgIHZhciBydW5uZXJJbmZvID0ge1xuICAgICAgICBwZXJzaXN0OiBwZXJzaXN0ID09PSBudWxsID8gdGhpcy5fcGVyc2lzdCA6IHBlcnNpc3QsXG4gICAgICAgIHN0YXJ0OiBhYnNvbHV0ZVN0YXJ0VGltZSArIGRlbGF5LFxuICAgICAgICBydW5uZXI6IHJ1bm5lclxuICAgICAgfTtcbiAgICAgIHRoaXMuX2xhc3RSdW5uZXJJZCA9IHJ1bm5lci5pZDtcblxuICAgICAgdGhpcy5fcnVubmVycy5wdXNoKHJ1bm5lckluZm8pO1xuXG4gICAgICB0aGlzLl9ydW5uZXJzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3J1bm5lcklkcyA9IHRoaXMuX3J1bm5lcnMubWFwKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgIHJldHVybiBpbmZvLnJ1bm5lci5pZDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoKS5fY29udGludWUoKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSZW1vdmUgdGhlIHJ1bm5lciBmcm9tIHRoaXMgdGltZWxpbmVcblxuICB9LCB7XG4gICAga2V5OiBcInVuc2NoZWR1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zY2hlZHVsZShydW5uZXIpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuX3J1bm5lcklkcy5pbmRleE9mKHJ1bm5lci5pZCk7XG5cbiAgICAgIGlmIChpbmRleCA8IDApIHJldHVybiB0aGlzO1xuXG4gICAgICB0aGlzLl9ydW5uZXJzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIHRoaXMuX3J1bm5lcklkcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICBydW5uZXIudGltZWxpbmUobnVsbCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIENhbGN1bGF0ZXMgdGhlIGVuZCBvZiB0aGUgdGltZWxpbmVcblxuICB9LCB7XG4gICAga2V5OiBcImdldEVuZFRpbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RW5kVGltZSgpIHtcbiAgICAgIHZhciBsYXN0UnVubmVySW5mbyA9IHRoaXMuX3J1bm5lcnNbdGhpcy5fcnVubmVySWRzLmluZGV4T2YodGhpcy5fbGFzdFJ1bm5lcklkKV07XG5cbiAgICAgIHZhciBsYXN0RHVyYXRpb24gPSBsYXN0UnVubmVySW5mbyA/IGxhc3RSdW5uZXJJbmZvLnJ1bm5lci5kdXJhdGlvbigpIDogMDtcbiAgICAgIHZhciBsYXN0U3RhcnRUaW1lID0gbGFzdFJ1bm5lckluZm8gPyBsYXN0UnVubmVySW5mby5zdGFydCA6IDA7XG4gICAgICByZXR1cm4gbGFzdFN0YXJ0VGltZSArIGxhc3REdXJhdGlvbjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RW5kVGltZU9mVGltZWxpbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RW5kVGltZU9mVGltZWxpbmUoKSB7XG4gICAgICB2YXIgbGFzdEVuZFRpbWUgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3J1bm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJ1bm5lckluZm8gPSB0aGlzLl9ydW5uZXJzW2ldO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBydW5uZXJJbmZvID8gcnVubmVySW5mby5ydW5uZXIuZHVyYXRpb24oKSA6IDA7XG4gICAgICAgIHZhciBzdGFydFRpbWUgPSBydW5uZXJJbmZvID8gcnVubmVySW5mby5zdGFydCA6IDA7XG4gICAgICAgIHZhciBlbmRUaW1lID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG5cbiAgICAgICAgaWYgKGVuZFRpbWUgPiBsYXN0RW5kVGltZSkge1xuICAgICAgICAgIGxhc3RFbmRUaW1lID0gZW5kVGltZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGFzdEVuZFRpbWU7XG4gICAgfSAvLyBNYWtlcyBzdXJlLCB0aGF0IGFmdGVyIHBhdXNpbmcgdGhlIHRpbWUgZG9lc24ndCBqdW1wXG5cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVUaW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVRpbWUoKSB7XG4gICAgICBpZiAoIXRoaXMuYWN0aXZlKCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdFNvdXJjZVRpbWUgPSB0aGlzLl90aW1lU291cmNlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwbGF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICAvLyBOb3cgbWFrZSBzdXJlIHdlIGFyZSBub3QgcGF1c2VkIGFuZCBjb250aW51ZSB0aGUgYW5pbWF0aW9uXG4gICAgICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoKS5fY29udGludWUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRpbnVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0b3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIC8vIEdvIHRvIHN0YXJ0IGFuZCBwYXVzZVxuICAgICAgdGhpcy50aW1lKDApO1xuICAgICAgcmV0dXJuIHRoaXMucGF1c2UoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluaXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgIC8vIEdvIHRvIGVuZCBhbmQgcGF1c2VcbiAgICAgIHRoaXMudGltZSh0aGlzLmdldEVuZFRpbWVPZlRpbWVsaW5lKCkgKyAxKTtcbiAgICAgIHJldHVybiB0aGlzLnBhdXNlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNwZWVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNwZWVkKF9zcGVlZCkge1xuICAgICAgaWYgKF9zcGVlZCA9PSBudWxsKSByZXR1cm4gdGhpcy5fc3BlZWQ7XG4gICAgICB0aGlzLl9zcGVlZCA9IF9zcGVlZDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXZlcnNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJldmVyc2UoeWVzKSB7XG4gICAgICB2YXIgY3VycmVudFNwZWVkID0gdGhpcy5zcGVlZCgpO1xuICAgICAgaWYgKHllcyA9PSBudWxsKSByZXR1cm4gdGhpcy5zcGVlZCgtY3VycmVudFNwZWVkKTtcbiAgICAgIHZhciBwb3NpdGl2ZSA9IE1hdGguYWJzKGN1cnJlbnRTcGVlZCk7XG4gICAgICByZXR1cm4gdGhpcy5zcGVlZCh5ZXMgPyBwb3NpdGl2ZSA6IC1wb3NpdGl2ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlZWtcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VlayhkdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGltZSh0aGlzLl90aW1lICsgZHQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbWUoX3RpbWUpIHtcbiAgICAgIGlmIChfdGltZSA9PSBudWxsKSByZXR1cm4gdGhpcy5fdGltZTtcbiAgICAgIHRoaXMuX3RpbWUgPSBfdGltZTtcbiAgICAgIHJldHVybiB0aGlzLl9jb250aW51ZSh0cnVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGVyc2lzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwZXJzaXN0KGR0T3JGb3JldmVyKSB7XG4gICAgICBpZiAoZHRPckZvcmV2ZXIgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX3BlcnNpc3Q7XG4gICAgICB0aGlzLl9wZXJzaXN0ID0gZHRPckZvcmV2ZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNvdXJjZShmbikge1xuICAgICAgaWYgKGZuID09IG51bGwpIHJldHVybiB0aGlzLl90aW1lU291cmNlO1xuICAgICAgdGhpcy5fdGltZVNvdXJjZSA9IGZuO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9zdGVwRm5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0ZXBGbigpIHtcbiAgICAgIHZhciBpbW1lZGlhdGVTdGVwID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcblxuICAgICAgLy8gR2V0IHRoZSB0aW1lIGRlbHRhIGZyb20gdGhlIGxhc3QgdGltZSBhbmQgdXBkYXRlIHRoZSB0aW1lXG4gICAgICB2YXIgdGltZSA9IHRoaXMuX3RpbWVTb3VyY2UoKTtcblxuICAgICAgdmFyIGR0U291cmNlID0gdGltZSAtIHRoaXMuX2xhc3RTb3VyY2VUaW1lO1xuICAgICAgaWYgKGltbWVkaWF0ZVN0ZXApIGR0U291cmNlID0gMDtcbiAgICAgIHZhciBkdFRpbWUgPSB0aGlzLl9zcGVlZCAqIGR0U291cmNlICsgKHRoaXMuX3RpbWUgLSB0aGlzLl9sYXN0U3RlcFRpbWUpO1xuICAgICAgdGhpcy5fbGFzdFNvdXJjZVRpbWUgPSB0aW1lOyAvLyBPbmx5IHVwZGF0ZSB0aGUgdGltZSBpZiB3ZSB1c2UgdGhlIHRpbWVTb3VyY2UuXG4gICAgICAvLyBPdGhlcndpc2UgdXNlIHRoZSBjdXJyZW50IHRpbWVcblxuICAgICAgaWYgKCFpbW1lZGlhdGVTdGVwKSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdGltZVxuICAgICAgICB0aGlzLl90aW1lICs9IGR0VGltZTtcbiAgICAgICAgdGhpcy5fdGltZSA9IHRoaXMuX3RpbWUgPCAwID8gMCA6IHRoaXMuX3RpbWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xhc3RTdGVwVGltZSA9IHRoaXMuX3RpbWU7XG4gICAgICB0aGlzLmZpcmUoJ3RpbWUnLCB0aGlzLl90aW1lKTsgLy8gVGhpcyBpcyBmb3IgdGhlIGNhc2UgdGhhdCB0aGUgdGltZWxpbmUgd2FzIHNlZWtlZCBzbyB0aGF0IHRoZSB0aW1lXG4gICAgICAvLyBpcyBub3cgYmVmb3JlIHRoZSBzdGFydFRpbWUgb2YgdGhlIHJ1bm5lci4gVGhhdHMgd2h5IHdlIG5lZWQgdG8gc2V0XG4gICAgICAvLyB0aGUgcnVubmVyIHRvIHBvc2l0aW9uIDBcbiAgICAgIC8vIEZJWE1FOlxuICAgICAgLy8gSG93ZXZlciwgcmVzZXRpbmcgaW4gaW5zZXJ0aW9uIG9yZGVyIGxlYWRzIHRvIGJ1Z3MuIENvbnNpZGVyaW5nIHRoZSBjYXNlLFxuICAgICAgLy8gd2hlcmUgMiBydW5uZXJzIGNoYW5nZSB0aGUgc2FtZSBhdHRyaXV0ZSBidXQgaW4gZGlmZmVyZW50IHRpbWVzLFxuICAgICAgLy8gcmVzZXRpbmcgYm90aCBvZiB0aGVtIHdpbGwgbGVhZCB0byB0aGUgY2FzZSB3aGVyZSB0aGUgbGF0ZXIgZGVmaW5lZFxuICAgICAgLy8gcnVubmVyIGFsd2F5cyB3aW5zIHRoZSByZXNldCBldmVuIGlmIHRoZSBvdGhlciBydW5uZXIgc3RhcnRlZCBlYXJsaWVyXG4gICAgICAvLyBhbmQgdGhlcmVmb3JlIHNob3VsZCB3aW4gdGhlIGF0dHJpYnV0ZSBiYXR0bGVcbiAgICAgIC8vIHRoaXMgY2FuIGJlIHNvbHZlZCBieSByZXNldGluZyB0aGVtIGJhY2t3YXJkc1xuXG4gICAgICBmb3IgKHZhciBrID0gdGhpcy5fcnVubmVycy5sZW5ndGg7IGstLTspIHtcbiAgICAgICAgLy8gR2V0IGFuZCBydW4gdGhlIGN1cnJlbnQgcnVubmVyIGFuZCBpZ25vcmUgaXQgaWYgaXRzIGluYWN0aXZlXG4gICAgICAgIHZhciBydW5uZXJJbmZvID0gdGhpcy5fcnVubmVyc1trXTtcbiAgICAgICAgdmFyIHJ1bm5lciA9IHJ1bm5lckluZm8ucnVubmVyOyAvLyBNYWtlIHN1cmUgdGhhdCB3ZSBnaXZlIHRoZSBhY3R1YWwgZGlmZmVyZW5jZVxuICAgICAgICAvLyBiZXR3ZWVuIHJ1bm5lciBzdGFydCB0aW1lIGFuZCBub3dcblxuICAgICAgICB2YXIgZHRUb1N0YXJ0ID0gdGhpcy5fdGltZSAtIHJ1bm5lckluZm8uc3RhcnQ7IC8vIERvbnQgcnVuIHJ1bm5lciBpZiBub3Qgc3RhcnRlZCB5ZXRcbiAgICAgICAgLy8gYW5kIHRyeSB0byByZXNldCBpdFxuXG4gICAgICAgIGlmIChkdFRvU3RhcnQgPD0gMCkge1xuICAgICAgICAgIHJ1bm5lci5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9IC8vIFJ1biBhbGwgb2YgdGhlIHJ1bm5lcnMgZGlyZWN0bHlcblxuXG4gICAgICB2YXIgcnVubmVyc0xlZnQgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX3J1bm5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gR2V0IGFuZCBydW4gdGhlIGN1cnJlbnQgcnVubmVyIGFuZCBpZ25vcmUgaXQgaWYgaXRzIGluYWN0aXZlXG4gICAgICAgIHZhciBfcnVubmVySW5mbzIgPSB0aGlzLl9ydW5uZXJzW2ldO1xuICAgICAgICB2YXIgX3J1bm5lciA9IF9ydW5uZXJJbmZvMi5ydW5uZXI7XG4gICAgICAgIHZhciBkdCA9IGR0VGltZTsgLy8gTWFrZSBzdXJlIHRoYXQgd2UgZ2l2ZSB0aGUgYWN0dWFsIGRpZmZlcmVuY2VcbiAgICAgICAgLy8gYmV0d2VlbiBydW5uZXIgc3RhcnQgdGltZSBhbmQgbm93XG5cbiAgICAgICAgdmFyIF9kdFRvU3RhcnQgPSB0aGlzLl90aW1lIC0gX3J1bm5lckluZm8yLnN0YXJ0OyAvLyBEb250IHJ1biBydW5uZXIgaWYgbm90IHN0YXJ0ZWQgeWV0XG5cblxuICAgICAgICBpZiAoX2R0VG9TdGFydCA8PSAwKSB7XG4gICAgICAgICAgcnVubmVyc0xlZnQgPSB0cnVlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKF9kdFRvU3RhcnQgPCBkdCkge1xuICAgICAgICAgIC8vIEFkanVzdCBkdCB0byBtYWtlIHN1cmUgdGhhdCBhbmltYXRpb24gaXMgb24gcG9pbnRcbiAgICAgICAgICBkdCA9IF9kdFRvU3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV9ydW5uZXIuYWN0aXZlKCkpIGNvbnRpbnVlOyAvLyBJZiB0aGlzIHJ1bm5lciBpcyBzdGlsbCBnb2luZywgc2lnbmFsIHRoYXQgd2UgbmVlZCBhbm90aGVyIGFuaW1hdGlvblxuICAgICAgICAvLyBmcmFtZSwgb3RoZXJ3aXNlLCByZW1vdmUgdGhlIGNvbXBsZXRlZCBydW5uZXJcblxuICAgICAgICB2YXIgZmluaXNoZWQgPSBfcnVubmVyLnN0ZXAoZHQpLmRvbmU7XG5cbiAgICAgICAgaWYgKCFmaW5pc2hlZCkge1xuICAgICAgICAgIHJ1bm5lcnNMZWZ0ID0gdHJ1ZTsgLy8gY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChfcnVubmVySW5mbzIucGVyc2lzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIHJ1bm5lciBpcyBmaW5pc2hlZC4gQW5kIHJ1bm5lciBtaWdodCBnZXQgcmVtb3ZlZFxuICAgICAgICAgIHZhciBlbmRUaW1lID0gX3J1bm5lci5kdXJhdGlvbigpIC0gX3J1bm5lci50aW1lKCkgKyB0aGlzLl90aW1lO1xuXG4gICAgICAgICAgaWYgKGVuZFRpbWUgKyBfcnVubmVySW5mbzIucGVyc2lzdCA8IHRoaXMuX3RpbWUpIHtcbiAgICAgICAgICAgIC8vIERlbGV0ZSBydW5uZXIgYW5kIGNvcnJlY3QgaW5kZXhcbiAgICAgICAgICAgIF9ydW5uZXIudW5zY2hlZHVsZSgpO1xuXG4gICAgICAgICAgICAtLWk7XG4gICAgICAgICAgICAtLWxlbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gLy8gQmFzaWNhbGx5OiB3ZSBjb250aW51ZSB3aGVuIHRoZXJlIGFyZSBydW5uZXJzIHJpZ2h0IGZyb20gdXMgaW4gdGltZVxuICAgICAgLy8gd2hlbiAtLT4sIGFuZCB3aGVuIHJ1bm5lcnMgYXJlIGxlZnQgZnJvbSB1cyB3aGVuIDwtLVxuXG5cbiAgICAgIGlmIChydW5uZXJzTGVmdCAmJiAhKHRoaXMuX3NwZWVkIDwgMCAmJiB0aGlzLl90aW1lID09PSAwKSB8fCB0aGlzLl9ydW5uZXJJZHMubGVuZ3RoICYmIHRoaXMuX3NwZWVkIDwgMCAmJiB0aGlzLl90aW1lID4gMCkge1xuICAgICAgICB0aGlzLl9jb250aW51ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICB0aGlzLmZpcmUoJ2ZpbmlzaGVkJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gQ2hlY2tzIGlmIHdlIGFyZSBydW5uaW5nIGFuZCBjb250aW51ZXMgdGhlIGFuaW1hdGlvblxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2NvbnRpbnVlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jb250aW51ZSgpIHtcbiAgICAgIHZhciBpbW1lZGlhdGVTdGVwID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcbiAgICAgIEFuaW1hdG9yLmNhbmNlbEZyYW1lKHRoaXMuX25leHRGcmFtZSk7XG4gICAgICB0aGlzLl9uZXh0RnJhbWUgPSBudWxsO1xuICAgICAgaWYgKGltbWVkaWF0ZVN0ZXApIHJldHVybiB0aGlzLl9zdGVwSW1tZWRpYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcGF1c2VkKSByZXR1cm4gdGhpcztcbiAgICAgIHRoaXMuX25leHRGcmFtZSA9IEFuaW1hdG9yLmZyYW1lKHRoaXMuX3N0ZXApO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFjdGl2ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhY3RpdmUoKSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9uZXh0RnJhbWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRpbWVsaW5lO1xufShFdmVudFRhcmdldCk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBFbGVtZW50OiB7XG4gICAgdGltZWxpbmU6IGZ1bmN0aW9uIHRpbWVsaW5lKF90aW1lbGluZSkge1xuICAgICAgaWYgKF90aW1lbGluZSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3RpbWVsaW5lID0gdGhpcy5fdGltZWxpbmUgfHwgbmV3IFRpbWVsaW5lKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lbGluZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3RpbWVsaW5lID0gX3RpbWVsaW5lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBvd25LZXlzJDIob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KTsga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQkMSh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307IGlmIChpICUgMikgeyBvd25LZXlzJDIoc291cmNlLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pOyB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7IH0gZWxzZSB7IG93bktleXMkMihzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gfSByZXR1cm4gdGFyZ2V0OyB9XG5cbnZhciBSdW5uZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FdmVudFRhcmdldCkge1xuICBfaW5oZXJpdHMoUnVubmVyLCBfRXZlbnRUYXJnZXQpO1xuXG4gIGZ1bmN0aW9uIFJ1bm5lcihvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJ1bm5lcik7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihSdW5uZXIpLmNhbGwodGhpcykpOyAvLyBTdG9yZSBhIHVuaXF1ZSBpZCBvbiB0aGUgcnVubmVyLCBzbyB0aGF0IHdlIGNhbiBpZGVudGlmeSBpdCBsYXRlclxuXG4gICAgX3RoaXMuaWQgPSBSdW5uZXIuaWQrKzsgLy8gRW5zdXJlIGEgZGVmYXVsdCB2YWx1ZVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgPT0gbnVsbCA/IHRpbWVsaW5lLmR1cmF0aW9uIDogb3B0aW9uczsgLy8gRW5zdXJlIHRoYXQgd2UgZ2V0IGEgY29udHJvbGxlclxuXG4gICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nID8gbmV3IENvbnRyb2xsZXIob3B0aW9ucykgOiBvcHRpb25zOyAvLyBEZWNsYXJlIGFsbCBvZiB0aGUgdmFyaWFibGVzXG5cbiAgICBfdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgX3RoaXMuX3RpbWVsaW5lID0gbnVsbDtcbiAgICBfdGhpcy5kb25lID0gZmFsc2U7XG4gICAgX3RoaXMuX3F1ZXVlID0gW107IC8vIFdvcmsgb3V0IHRoZSBzdGVwcGVyIGFuZCB0aGUgZHVyYXRpb25cblxuICAgIF90aGlzLl9kdXJhdGlvbiA9IHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJyAmJiBvcHRpb25zO1xuICAgIF90aGlzLl9pc0RlY2xhcmF0aXZlID0gb3B0aW9ucyBpbnN0YW5jZW9mIENvbnRyb2xsZXI7XG4gICAgX3RoaXMuX3N0ZXBwZXIgPSBfdGhpcy5faXNEZWNsYXJhdGl2ZSA/IG9wdGlvbnMgOiBuZXcgRWFzZSgpOyAvLyBXZSBjb3B5IHRoZSBjdXJyZW50IHZhbHVlcyBmcm9tIHRoZSB0aW1lbGluZSBiZWNhdXNlIHRoZXkgY2FuIGNoYW5nZVxuXG4gICAgX3RoaXMuX2hpc3RvcnkgPSB7fTsgLy8gU3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBydW5uZXJcblxuICAgIF90aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgIF90aGlzLl90aW1lID0gMDtcbiAgICBfdGhpcy5fbGFzdFRpbWUgPSAwOyAvLyBBdCBjcmVhdGlvbiwgdGhlIHJ1bm5lciBpcyBpbiByZXNldGVkIHN0YXRlXG5cbiAgICBfdGhpcy5fcmVzZXRlZCA9IHRydWU7IC8vIFNhdmUgdHJhbnNmb3JtcyBhcHBsaWVkIHRvIHRoaXMgcnVubmVyXG5cbiAgICBfdGhpcy50cmFuc2Zvcm1zID0gbmV3IE1hdHJpeCgpO1xuICAgIF90aGlzLnRyYW5zZm9ybUlkID0gMTsgLy8gTG9vcGluZyB2YXJpYWJsZXNcblxuICAgIF90aGlzLl9oYXZlUmV2ZXJzZWQgPSBmYWxzZTtcbiAgICBfdGhpcy5fcmV2ZXJzZSA9IGZhbHNlO1xuICAgIF90aGlzLl9sb29wc0RvbmUgPSAwO1xuICAgIF90aGlzLl9zd2luZyA9IGZhbHNlO1xuICAgIF90aGlzLl93YWl0ID0gMDtcbiAgICBfdGhpcy5fdGltZXMgPSAxO1xuICAgIF90aGlzLl9mcmFtZUlkID0gbnVsbDsgLy8gU3RvcmVzIGhvdyBsb25nIGEgcnVubmVyIGlzIHN0b3JlZCBhZnRlciBiZWVpbmcgZG9uZVxuXG4gICAgX3RoaXMuX3BlcnNpc3QgPSBfdGhpcy5faXNEZWNsYXJhdGl2ZSA/IHRydWUgOiBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuICAvKlxyXG4gIFJ1bm5lciBEZWZpbml0aW9uc1xyXG4gID09PT09PT09PT09PT09PT09PVxyXG4gIFRoZXNlIG1ldGhvZHMgaGVscCB1cyBkZWZpbmUgdGhlIHJ1bnRpbWUgYmVoYXZpb3VyIG9mIHRoZSBSdW5uZXIgb3IgdGhleVxyXG4gIGhlbHAgdXMgbWFrZSBuZXcgcnVubmVycyBmcm9tIHRoZSBjdXJyZW50IHJ1bm5lclxyXG4gICovXG5cblxuICBfY3JlYXRlQ2xhc3MoUnVubmVyLCBbe1xuICAgIGtleTogXCJlbGVtZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVsZW1lbnQoX2VsZW1lbnQpIHtcbiAgICAgIGlmIChfZWxlbWVudCA9PSBudWxsKSByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBfZWxlbWVudDtcblxuICAgICAgX2VsZW1lbnQuX3ByZXBhcmVSdW5uZXIoKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRpbWVsaW5lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbWVsaW5lKF90aW1lbGluZSkge1xuICAgICAgLy8gY2hlY2sgZXhwbGljaXRseSBmb3IgdW5kZWZpbmVkIHNvIHdlIGNhbiBzZXQgdGhlIHRpbWVsaW5lIHRvIG51bGxcbiAgICAgIGlmICh0eXBlb2YgX3RpbWVsaW5lID09PSAndW5kZWZpbmVkJykgcmV0dXJuIHRoaXMuX3RpbWVsaW5lO1xuICAgICAgdGhpcy5fdGltZWxpbmUgPSBfdGltZWxpbmU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYW5pbWF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhbmltYXRlKGR1cmF0aW9uLCBkZWxheSwgd2hlbikge1xuICAgICAgdmFyIG8gPSBSdW5uZXIuc2FuaXRpc2UoZHVyYXRpb24sIGRlbGF5LCB3aGVuKTtcbiAgICAgIHZhciBydW5uZXIgPSBuZXcgUnVubmVyKG8uZHVyYXRpb24pO1xuICAgICAgaWYgKHRoaXMuX3RpbWVsaW5lKSBydW5uZXIudGltZWxpbmUodGhpcy5fdGltZWxpbmUpO1xuICAgICAgaWYgKHRoaXMuX2VsZW1lbnQpIHJ1bm5lci5lbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xuICAgICAgcmV0dXJuIHJ1bm5lci5sb29wKG8pLnNjaGVkdWxlKG8uZGVsYXksIG8ud2hlbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNjaGVkdWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNjaGVkdWxlKHRpbWVsaW5lLCBkZWxheSwgd2hlbikge1xuICAgICAgLy8gVGhlIHVzZXIgZG9lc24ndCBuZWVkIHRvIHBhc3MgYSB0aW1lbGluZSBpZiB3ZSBhbHJlYWR5IGhhdmUgb25lXG4gICAgICBpZiAoISh0aW1lbGluZSBpbnN0YW5jZW9mIFRpbWVsaW5lKSkge1xuICAgICAgICB3aGVuID0gZGVsYXk7XG4gICAgICAgIGRlbGF5ID0gdGltZWxpbmU7XG4gICAgICAgIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZSgpO1xuICAgICAgfSAvLyBJZiB0aGVyZSBpcyBubyB0aW1lbGluZSwgeWVsbCBhdCB0aGUgdXNlci4uLlxuXG5cbiAgICAgIGlmICghdGltZWxpbmUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1J1bm5lciBjYW5ub3QgYmUgc2NoZWR1bGVkIHdpdGhvdXQgdGltZWxpbmUnKTtcbiAgICAgIH0gLy8gU2NoZWR1bGUgdGhlIHJ1bm5lciBvbiB0aGUgdGltZWxpbmUgcHJvdmlkZWRcblxuXG4gICAgICB0aW1lbGluZS5zY2hlZHVsZSh0aGlzLCBkZWxheSwgd2hlbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidW5zY2hlZHVsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bnNjaGVkdWxlKCkge1xuICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZSgpO1xuICAgICAgdGltZWxpbmUgJiYgdGltZWxpbmUudW5zY2hlZHVsZSh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb29wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvb3AodGltZXMsIHN3aW5nLCB3YWl0KSB7XG4gICAgICAvLyBEZWFsIHdpdGggdGhlIHVzZXIgcGFzc2luZyBpbiBhbiBvYmplY3RcbiAgICAgIGlmIChfdHlwZW9mKHRpbWVzKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgc3dpbmcgPSB0aW1lcy5zd2luZztcbiAgICAgICAgd2FpdCA9IHRpbWVzLndhaXQ7XG4gICAgICAgIHRpbWVzID0gdGltZXMudGltZXM7XG4gICAgICB9IC8vIFNhbml0aXNlIHRoZSB2YWx1ZXMgYW5kIHN0b3JlIHRoZW1cblxuXG4gICAgICB0aGlzLl90aW1lcyA9IHRpbWVzIHx8IEluZmluaXR5O1xuICAgICAgdGhpcy5fc3dpbmcgPSBzd2luZyB8fCBmYWxzZTtcbiAgICAgIHRoaXMuX3dhaXQgPSB3YWl0IHx8IDA7IC8vIEFsbG93IHRydWUgdG8gYmUgcGFzc2VkXG5cbiAgICAgIGlmICh0aGlzLl90aW1lcyA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl90aW1lcyA9IEluZmluaXR5O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVsYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVsYXkoX2RlbGF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hbmltYXRlKDAsIF9kZWxheSk7XG4gICAgfVxuICAgIC8qXHJcbiAgICBCYXNpYyBGdW5jdGlvbmFsaXR5XHJcbiAgICA9PT09PT09PT09PT09PT09PT09XHJcbiAgICBUaGVzZSBtZXRob2RzIGFsbG93IHVzIHRvIGF0dGFjaCBiYXNpYyBmdW5jdGlvbnMgdG8gdGhlIHJ1bm5lciBkaXJlY3RseVxyXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInF1ZXVlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHF1ZXVlKGluaXRGbiwgcnVuRm4sIHJldGFyZ2V0Rm4sIGlzVHJhbnNmb3JtKSB7XG4gICAgICB0aGlzLl9xdWV1ZS5wdXNoKHtcbiAgICAgICAgaW5pdGlhbGlzZXI6IGluaXRGbiB8fCBub29wLFxuICAgICAgICBydW5uZXI6IHJ1bkZuIHx8IG5vb3AsXG4gICAgICAgIHJldGFyZ2V0OiByZXRhcmdldEZuLFxuICAgICAgICBpc1RyYW5zZm9ybTogaXNUcmFuc2Zvcm0sXG4gICAgICAgIGluaXRpYWxpc2VkOiBmYWxzZSxcbiAgICAgICAgZmluaXNoZWQ6IGZhbHNlXG4gICAgICB9KTtcblxuICAgICAgdmFyIHRpbWVsaW5lID0gdGhpcy50aW1lbGluZSgpO1xuICAgICAgdGltZWxpbmUgJiYgdGhpcy50aW1lbGluZSgpLl9jb250aW51ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR1cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkdXJpbmcoZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXVlKG51bGwsIGZuKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWZ0ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWZ0ZXIoZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLm9uKCdmaW5pc2hlZCcsIGZuKTtcbiAgICB9XG4gICAgLypcclxuICAgIFJ1bm5lciBhbmltYXRpb24gbWV0aG9kc1xyXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBDb250cm9sIGhvdyB0aGUgYW5pbWF0aW9uIHBsYXlzXHJcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwidGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lKF90aW1lKSB7XG4gICAgICBpZiAoX3RpbWUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGltZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGR0ID0gX3RpbWUgLSB0aGlzLl90aW1lO1xuICAgICAgdGhpcy5zdGVwKGR0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkdXJhdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkdXJhdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl90aW1lcyAqICh0aGlzLl93YWl0ICsgdGhpcy5fZHVyYXRpb24pIC0gdGhpcy5fd2FpdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9vcHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9vcHMocCkge1xuICAgICAgdmFyIGxvb3BEdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fd2FpdDtcblxuICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICB2YXIgbG9vcHNEb25lID0gTWF0aC5mbG9vcih0aGlzLl90aW1lIC8gbG9vcER1cmF0aW9uKTtcbiAgICAgICAgdmFyIHJlbGF0aXZlVGltZSA9IHRoaXMuX3RpbWUgLSBsb29wc0RvbmUgKiBsb29wRHVyYXRpb247XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHJlbGF0aXZlVGltZSAvIHRoaXMuX2R1cmF0aW9uO1xuICAgICAgICByZXR1cm4gTWF0aC5taW4obG9vcHNEb25lICsgcG9zaXRpb24sIHRoaXMuX3RpbWVzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHdob2xlID0gTWF0aC5mbG9vcihwKTtcbiAgICAgIHZhciBwYXJ0aWFsID0gcCAlIDE7XG4gICAgICB2YXIgdGltZSA9IGxvb3BEdXJhdGlvbiAqIHdob2xlICsgdGhpcy5fZHVyYXRpb24gKiBwYXJ0aWFsO1xuICAgICAgcmV0dXJuIHRoaXMudGltZSh0aW1lKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGVyc2lzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwZXJzaXN0KGR0T3JGb3JldmVyKSB7XG4gICAgICBpZiAoZHRPckZvcmV2ZXIgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX3BlcnNpc3Q7XG4gICAgICB0aGlzLl9wZXJzaXN0ID0gZHRPckZvcmV2ZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicG9zaXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcG9zaXRpb24ocCkge1xuICAgICAgLy8gR2V0IGFsbCBvZiB0aGUgdmFyaWFibGVzIHdlIG5lZWRcbiAgICAgIHZhciB4ID0gdGhpcy5fdGltZTtcbiAgICAgIHZhciBkID0gdGhpcy5fZHVyYXRpb247XG4gICAgICB2YXIgdyA9IHRoaXMuX3dhaXQ7XG4gICAgICB2YXIgdCA9IHRoaXMuX3RpbWVzO1xuICAgICAgdmFyIHMgPSB0aGlzLl9zd2luZztcbiAgICAgIHZhciByID0gdGhpcy5fcmV2ZXJzZTtcbiAgICAgIHZhciBwb3NpdGlvbjtcblxuICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAvKlxyXG4gICAgICAgIFRoaXMgZnVuY3Rpb24gY29udmVydHMgYSB0aW1lIHRvIGEgcG9zaXRpb24gaW4gdGhlIHJhbmdlIFswLCAxXVxyXG4gICAgICAgIFRoZSBmdWxsIGV4cGxhbmF0aW9uIGNhbiBiZSBmb3VuZCBpbiB0aGlzIGRlc21vcyBkZW1vbnN0cmF0aW9uXHJcbiAgICAgICAgICBodHRwczovL3d3dy5kZXNtb3MuY29tL2NhbGN1bGF0b3IvdTRmYmF2Z2NoZVxyXG4gICAgICAgIFRoZSBsb2dpYyBpcyBzbGlnaHRseSBzaW1wbGlmaWVkIGhlcmUgYmVjYXVzZSB3ZSBjYW4gdXNlIGJvb2xlYW5zXHJcbiAgICAgICAgKi9cbiAgICAgICAgLy8gRmlndXJlIG91dCB0aGUgdmFsdWUgd2l0aG91dCB0aGlua2luZyBhYm91dCB0aGUgc3RhcnQgb3IgZW5kIHRpbWVcbiAgICAgICAgdmFyIGYgPSBmdW5jdGlvbiBmKHgpIHtcbiAgICAgICAgICB2YXIgc3dpbmdpbmcgPSBzICogTWF0aC5mbG9vcih4ICUgKDIgKiAodyArIGQpKSAvICh3ICsgZCkpO1xuICAgICAgICAgIHZhciBiYWNrd2FyZHMgPSBzd2luZ2luZyAmJiAhciB8fCAhc3dpbmdpbmcgJiYgcjtcbiAgICAgICAgICB2YXIgdW5jbGlwZWQgPSBNYXRoLnBvdygtMSwgYmFja3dhcmRzKSAqICh4ICUgKHcgKyBkKSkgLyBkICsgYmFja3dhcmRzO1xuICAgICAgICAgIHZhciBjbGlwcGVkID0gTWF0aC5tYXgoTWF0aC5taW4odW5jbGlwZWQsIDEpLCAwKTtcbiAgICAgICAgICByZXR1cm4gY2xpcHBlZDtcbiAgICAgICAgfTsgLy8gRmlndXJlIG91dCB0aGUgdmFsdWUgYnkgaW5jb3Jwb3JhdGluZyB0aGUgc3RhcnQgdGltZVxuXG5cbiAgICAgICAgdmFyIGVuZFRpbWUgPSB0ICogKHcgKyBkKSAtIHc7XG4gICAgICAgIHBvc2l0aW9uID0geCA8PSAwID8gTWF0aC5yb3VuZChmKDFlLTUpKSA6IHggPCBlbmRUaW1lID8gZih4KSA6IE1hdGgucm91bmQoZihlbmRUaW1lIC0gMWUtNSkpO1xuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgICB9IC8vIFdvcmsgb3V0IHRoZSBsb29wcyBkb25lIGFuZCBhZGQgdGhlIHBvc2l0aW9uIHRvIHRoZSBsb29wcyBkb25lXG5cblxuICAgICAgdmFyIGxvb3BzRG9uZSA9IE1hdGguZmxvb3IodGhpcy5sb29wcygpKTtcbiAgICAgIHZhciBzd2luZ0ZvcndhcmQgPSBzICYmIGxvb3BzRG9uZSAlIDIgPT09IDA7XG4gICAgICB2YXIgZm9yd2FyZHMgPSBzd2luZ0ZvcndhcmQgJiYgIXIgfHwgciAmJiBzd2luZ0ZvcndhcmQ7XG4gICAgICBwb3NpdGlvbiA9IGxvb3BzRG9uZSArIChmb3J3YXJkcyA/IHAgOiAxIC0gcCk7XG4gICAgICByZXR1cm4gdGhpcy5sb29wcyhwb3NpdGlvbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByb2dyZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2dyZXNzKHApIHtcbiAgICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKDEsIHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy50aW1lKHAgKiB0aGlzLmR1cmF0aW9uKCkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXAoZHQpIHtcbiAgICAgIC8vIElmIHdlIGFyZSBpbmFjdGl2ZSwgdGhpcyBzdGVwcGVyIGp1c3QgZ2V0cyBza2lwcGVkXG4gICAgICBpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuIHRoaXM7IC8vIFVwZGF0ZSB0aGUgdGltZSBhbmQgZ2V0IHRoZSBuZXcgcG9zaXRpb25cblxuICAgICAgZHQgPSBkdCA9PSBudWxsID8gMTYgOiBkdDtcbiAgICAgIHRoaXMuX3RpbWUgKz0gZHQ7XG4gICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uKCk7IC8vIEZpZ3VyZSBvdXQgaWYgd2UgbmVlZCB0byBydW4gdGhlIHN0ZXBwZXIgaW4gdGhpcyBmcmFtZVxuXG4gICAgICB2YXIgcnVubmluZyA9IHRoaXMuX2xhc3RQb3NpdGlvbiAhPT0gcG9zaXRpb24gJiYgdGhpcy5fdGltZSA+PSAwO1xuICAgICAgdGhpcy5fbGFzdFBvc2l0aW9uID0gcG9zaXRpb247IC8vIEZpZ3VyZSBvdXQgaWYgd2UganVzdCBzdGFydGVkXG5cbiAgICAgIHZhciBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb24oKTtcbiAgICAgIHZhciBqdXN0U3RhcnRlZCA9IHRoaXMuX2xhc3RUaW1lIDw9IDAgJiYgdGhpcy5fdGltZSA+IDA7XG4gICAgICB2YXIganVzdEZpbmlzaGVkID0gdGhpcy5fbGFzdFRpbWUgPCBkdXJhdGlvbiAmJiB0aGlzLl90aW1lID49IGR1cmF0aW9uO1xuICAgICAgdGhpcy5fbGFzdFRpbWUgPSB0aGlzLl90aW1lO1xuXG4gICAgICBpZiAoanVzdFN0YXJ0ZWQpIHtcbiAgICAgICAgdGhpcy5maXJlKCdzdGFydCcsIHRoaXMpO1xuICAgICAgfSAvLyBXb3JrIG91dCBpZiB0aGUgcnVubmVyIGlzIGZpbmlzaGVkIHNldCB0aGUgZG9uZSBmbGFnIGhlcmUgc28gYW5pbWF0aW9uc1xuICAgICAgLy8ga25vdywgdGhhdCB0aGV5IGFyZSBydW5uaW5nIGluIHRoZSBsYXN0IHN0ZXAgKHRoaXMgaXMgZ29vZCBmb3JcbiAgICAgIC8vIHRyYW5zZm9ybWF0aW9ucyB3aGljaCBjYW4gYmUgbWVyZ2VkKVxuXG5cbiAgICAgIHZhciBkZWNsYXJhdGl2ZSA9IHRoaXMuX2lzRGVjbGFyYXRpdmU7XG4gICAgICB0aGlzLmRvbmUgPSAhZGVjbGFyYXRpdmUgJiYgIWp1c3RGaW5pc2hlZCAmJiB0aGlzLl90aW1lID49IGR1cmF0aW9uOyAvLyBSdW5uZXIgaXMgcnVubmluZy4gU28gaXRzIG5vdCBpbiByZXNldGVkIHN0YXRlIGFueW1vcmVcblxuICAgICAgdGhpcy5fcmVzZXRlZCA9IGZhbHNlOyAvLyBDYWxsIGluaXRpYWxpc2UgYW5kIHRoZSBydW4gZnVuY3Rpb25cblxuICAgICAgaWYgKHJ1bm5pbmcgfHwgZGVjbGFyYXRpdmUpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGlzZShydW5uaW5nKTsgLy8gY2xlYXIgdGhlIHRyYW5zZm9ybXMgb24gdGhpcyBydW5uZXIgc28gdGhleSBkb250IGdldCBhZGRlZCBhZ2FpbiBhbmQgYWdhaW5cblxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtcyA9IG5ldyBNYXRyaXgoKTtcblxuICAgICAgICB2YXIgY29udmVyZ2VkID0gdGhpcy5fcnVuKGRlY2xhcmF0aXZlID8gZHQgOiBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5maXJlKCdzdGVwJywgdGhpcyk7XG4gICAgICB9IC8vIGNvcnJlY3QgdGhlIGRvbmUgZmxhZyBoZXJlXG4gICAgICAvLyBkZWNsYXJpdGl2ZSBhbmltYXRpb25zIGl0c2VsZiBrbm93IHdoZW4gdGhleSBjb252ZXJnZWRcblxuXG4gICAgICB0aGlzLmRvbmUgPSB0aGlzLmRvbmUgfHwgY29udmVyZ2VkICYmIGRlY2xhcmF0aXZlO1xuXG4gICAgICBpZiAoanVzdEZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnZmluaXNoZWQnLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgaWYgKHRoaXMuX3Jlc2V0ZWQpIHJldHVybiB0aGlzO1xuICAgICAgdGhpcy50aW1lKDApO1xuICAgICAgdGhpcy5fcmVzZXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluaXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ZXAoSW5maW5pdHkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXZlcnNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJldmVyc2UoX3JldmVyc2UpIHtcbiAgICAgIHRoaXMuX3JldmVyc2UgPSBfcmV2ZXJzZSA9PSBudWxsID8gIXRoaXMuX3JldmVyc2UgOiBfcmV2ZXJzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlYXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVhc2UoZm4pIHtcbiAgICAgIHRoaXMuX3N0ZXBwZXIgPSBuZXcgRWFzZShmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWN0aXZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFjdGl2ZShlbmFibGVkKSB7XG4gICAgICBpZiAoZW5hYmxlZCA9PSBudWxsKSByZXR1cm4gdGhpcy5lbmFibGVkO1xuICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKlxyXG4gICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICA9PT09PT09PT09PT09PT1cclxuICAgIE1ldGhvZHMgdGhhdCBzaG91bGRuJ3QgYmUgdXNlZCBleHRlcm5hbGx5XHJcbiAgICAqL1xuICAgIC8vIFNhdmUgYSBtb3JwaGVyIHRvIHRoZSBtb3JwaGVyIGxpc3Qgc28gdGhhdCB3ZSBjYW4gcmV0YXJnZXQgaXQgbGF0ZXJcblxuICB9LCB7XG4gICAga2V5OiBcIl9yZW1lbWJlck1vcnBoZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbWVtYmVyTW9ycGhlcihtZXRob2QsIG1vcnBoZXIpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnlbbWV0aG9kXSA9IHtcbiAgICAgICAgbW9ycGhlcjogbW9ycGhlcixcbiAgICAgICAgY2FsbGVyOiB0aGlzLl9xdWV1ZVt0aGlzLl9xdWV1ZS5sZW5ndGggLSAxXVxuICAgICAgfTsgLy8gV2UgaGF2ZSB0byByZXN1bWUgdGhlIHRpbWVsaW5lIGluIGNhc2UgYSBjb250cm9sbGVyXG4gICAgICAvLyBpcyBhbHJlYWR5IGRvbmUgd2l0aG91dCBiZWVpbmcgZXZlciBydW5cbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIGUuZy4gdGhpcyBpcyBkb25lOlxuICAgICAgLy8gICAgYW5pbSA9IGVsLmFuaW1hdGUobmV3IFNWRy5TcHJpbmcpXG4gICAgICAvLyBhbmQgbGF0ZXJcbiAgICAgIC8vICAgIGFuaW0ubW92ZSguLi4pXG5cbiAgICAgIGlmICh0aGlzLl9pc0RlY2xhcmF0aXZlKSB7XG4gICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgICAgdGltZWxpbmUgJiYgdGltZWxpbmUucGxheSgpO1xuICAgICAgfVxuICAgIH0gLy8gVHJ5IHRvIHNldCB0aGUgdGFyZ2V0IGZvciBhIG1vcnBoZXIgaWYgdGhlIG1vcnBoZXIgZXhpc3RzLCBvdGhlcndpc2VcbiAgICAvLyBkbyBub3RoaW5nIGFuZCByZXR1cm4gZmFsc2VcblxuICB9LCB7XG4gICAga2V5OiBcIl90cnlSZXRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdHJ5UmV0YXJnZXQobWV0aG9kLCB0YXJnZXQsIGV4dHJhKSB7XG4gICAgICBpZiAodGhpcy5faGlzdG9yeVttZXRob2RdKSB7XG4gICAgICAgIC8vIGlmIHRoZSBsYXN0IG1ldGhvZCB3YXNudCBldmVuIGluaXRpYWxpc2VkLCB0aHJvdyBpdCBhd2F5XG4gICAgICAgIGlmICghdGhpcy5faGlzdG9yeVttZXRob2RdLmNhbGxlci5pbml0aWFsaXNlZCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX3F1ZXVlLmluZGV4T2YodGhpcy5faGlzdG9yeVttZXRob2RdLmNhbGxlcik7XG5cbiAgICAgICAgICB0aGlzLl9xdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IC8vIGZvciB0aGUgY2FzZSBvZiB0cmFuc2Zvcm1hdGlvbnMsIHdlIHVzZSB0aGUgc3BlY2lhbCByZXRhcmdldCBmdW5jdGlvblxuICAgICAgICAvLyB3aGljaCBoYXMgYWNjZXNzIHRvIHRoZSBvdXRlciBzY29wZVxuXG5cbiAgICAgICAgaWYgKHRoaXMuX2hpc3RvcnlbbWV0aG9kXS5jYWxsZXIucmV0YXJnZXQpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5W21ldGhvZF0uY2FsbGVyLnJldGFyZ2V0KHRhcmdldCwgZXh0cmEpOyAvLyBmb3IgZXZlcnl0aGluZyBlbHNlIGEgc2ltcGxlIG1vcnBoZXIgY2hhbmdlIGlzIHN1ZmZpY2llbnRcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnlbbWV0aG9kXS5tb3JwaGVyLnRvKHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oaXN0b3J5W21ldGhvZF0uY2FsbGVyLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgICAgdGltZWxpbmUgJiYgdGltZWxpbmUucGxheSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gUnVuIGVhY2ggaW5pdGlhbGlzZSBmdW5jdGlvbiBpbiB0aGUgcnVubmVyIGlmIHJlcXVpcmVkXG5cbiAgfSwge1xuICAgIGtleTogXCJfaW5pdGlhbGlzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaW5pdGlhbGlzZShydW5uaW5nKSB7XG4gICAgICAvLyBJZiB3ZSBhcmVuJ3QgcnVubmluZywgd2Ugc2hvdWxkbid0IGluaXRpYWxpc2Ugd2hlbiBub3QgZGVjbGFyYXRpdmVcbiAgICAgIGlmICghcnVubmluZyAmJiAhdGhpcy5faXNEZWNsYXJhdGl2ZSkgcmV0dXJuOyAvLyBMb29wIHRocm91Z2ggYWxsIG9mIHRoZSBpbml0aWFsaXNlcnNcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX3F1ZXVlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBpbml0aWFsaXNlclxuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuX3F1ZXVlW2ldOyAvLyBEZXRlcm1pbmUgd2hldGhlciB3ZSBuZWVkIHRvIGluaXRpYWxpc2VcblxuICAgICAgICB2YXIgbmVlZHNJdCA9IHRoaXMuX2lzRGVjbGFyYXRpdmUgfHwgIWN1cnJlbnQuaW5pdGlhbGlzZWQgJiYgcnVubmluZztcbiAgICAgICAgcnVubmluZyA9ICFjdXJyZW50LmZpbmlzaGVkOyAvLyBDYWxsIHRoZSBpbml0aWFsaXNlciBpZiB3ZSBuZWVkIHRvXG5cbiAgICAgICAgaWYgKG5lZWRzSXQgJiYgcnVubmluZykge1xuICAgICAgICAgIGN1cnJlbnQuaW5pdGlhbGlzZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICBjdXJyZW50LmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gLy8gUnVuIGVhY2ggcnVuIGZ1bmN0aW9uIGZvciB0aGUgcG9zaXRpb24gb3IgZHQgZ2l2ZW5cblxuICB9LCB7XG4gICAga2V5OiBcIl9ydW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3J1bihwb3NpdGlvbk9yRHQpIHtcbiAgICAgIC8vIFJ1biBhbGwgb2YgdGhlIF9xdWV1ZSBkaXJlY3RseVxuICAgICAgdmFyIGFsbGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX3F1ZXVlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBmdW5jdGlvbiB0byBydW5cbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9xdWV1ZVtpXTsgLy8gUnVuIHRoZSBmdW5jdGlvbiBpZiBpdHMgbm90IGZpbmlzaGVkLCB3ZSBrZWVwIHRyYWNrIG9mIHRoZSBmaW5pc2hlZFxuICAgICAgICAvLyBmbGFnIGZvciB0aGUgc2FrZSBvZiBkZWNsYXJhdGl2ZSBfcXVldWVcblxuICAgICAgICB2YXIgY29udmVyZ2VkID0gY3VycmVudC5ydW5uZXIuY2FsbCh0aGlzLCBwb3NpdGlvbk9yRHQpO1xuICAgICAgICBjdXJyZW50LmZpbmlzaGVkID0gY3VycmVudC5maW5pc2hlZCB8fCBjb252ZXJnZWQgPT09IHRydWU7XG4gICAgICAgIGFsbGZpbmlzaGVkID0gYWxsZmluaXNoZWQgJiYgY3VycmVudC5maW5pc2hlZDtcbiAgICAgIH0gLy8gV2UgcmVwb3J0IHdoZW4gYWxsIG9mIHRoZSBjb25zdHJ1Y3RvcnMgYXJlIGZpbmlzaGVkXG5cblxuICAgICAgcmV0dXJuIGFsbGZpbmlzaGVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRUcmFuc2Zvcm1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkVHJhbnNmb3JtKHRyYW5zZm9ybSwgaW5kZXgpIHtcbiAgICAgIHRoaXMudHJhbnNmb3Jtcy5sbXVsdGlwbHlPKHRyYW5zZm9ybSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJUcmFuc2Zvcm1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJUcmFuc2Zvcm0oKSB7XG4gICAgICB0aGlzLnRyYW5zZm9ybXMgPSBuZXcgTWF0cml4KCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFRPRE86IEtlZXAgdHJhY2sgb2YgYWxsIHRyYW5zZm9ybWF0aW9ucyBzbyB0aGF0IGRlbGV0aW9uIGlzIGZhc3RlclxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJUcmFuc2Zvcm1zRnJvbVF1ZXVlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyVHJhbnNmb3Jtc0Zyb21RdWV1ZSgpIHtcbiAgICAgIGlmICghdGhpcy5kb25lIHx8ICF0aGlzLl90aW1lbGluZSB8fCAhdGhpcy5fdGltZWxpbmUuX3J1bm5lcklkcy5pbmNsdWRlcyh0aGlzLmlkKSkge1xuICAgICAgICB0aGlzLl9xdWV1ZSA9IHRoaXMuX3F1ZXVlLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiAhaXRlbS5pc1RyYW5zZm9ybTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwic2FuaXRpc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2FuaXRpc2UoZHVyYXRpb24sIGRlbGF5LCB3aGVuKSB7XG4gICAgICAvLyBJbml0aWFsaXNlIHRoZSBkZWZhdWx0IHBhcmFtZXRlcnNcbiAgICAgIHZhciB0aW1lcyA9IDE7XG4gICAgICB2YXIgc3dpbmcgPSBmYWxzZTtcbiAgICAgIHZhciB3YWl0ID0gMDtcbiAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgdGltZWxpbmUuZHVyYXRpb247XG4gICAgICBkZWxheSA9IGRlbGF5IHx8IHRpbWVsaW5lLmRlbGF5O1xuICAgICAgd2hlbiA9IHdoZW4gfHwgJ2xhc3QnOyAvLyBJZiB3ZSBoYXZlIGFuIG9iamVjdCwgdW5wYWNrIHRoZSB2YWx1ZXNcblxuICAgICAgaWYgKF90eXBlb2YoZHVyYXRpb24pID09PSAnb2JqZWN0JyAmJiAhKGR1cmF0aW9uIGluc3RhbmNlb2YgU3RlcHBlcikpIHtcbiAgICAgICAgZGVsYXkgPSBkdXJhdGlvbi5kZWxheSB8fCBkZWxheTtcbiAgICAgICAgd2hlbiA9IGR1cmF0aW9uLndoZW4gfHwgd2hlbjtcbiAgICAgICAgc3dpbmcgPSBkdXJhdGlvbi5zd2luZyB8fCBzd2luZztcbiAgICAgICAgdGltZXMgPSBkdXJhdGlvbi50aW1lcyB8fCB0aW1lcztcbiAgICAgICAgd2FpdCA9IGR1cmF0aW9uLndhaXQgfHwgd2FpdDtcbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbi5kdXJhdGlvbiB8fCB0aW1lbGluZS5kdXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgIHN3aW5nOiBzd2luZyxcbiAgICAgICAgdGltZXM6IHRpbWVzLFxuICAgICAgICB3YWl0OiB3YWl0LFxuICAgICAgICB3aGVuOiB3aGVuXG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSdW5uZXI7XG59KEV2ZW50VGFyZ2V0KTtcblJ1bm5lci5pZCA9IDA7XG5cbnZhciBGYWtlUnVubmVyID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRmFrZVJ1bm5lcigpIHtcbiAgICB2YXIgdHJhbnNmb3JtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbmV3IE1hdHJpeCgpO1xuICAgIHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogLTE7XG4gICAgdmFyIGRvbmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRydWU7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmFrZVJ1bm5lcik7XG5cbiAgICB0aGlzLnRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1zO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmRvbmUgPSBkb25lO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEZha2VSdW5uZXIsIFt7XG4gICAga2V5OiBcImNsZWFyVHJhbnNmb3Jtc0Zyb21RdWV1ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclRyYW5zZm9ybXNGcm9tUXVldWUoKSB7fVxuICB9XSk7XG5cbiAgcmV0dXJuIEZha2VSdW5uZXI7XG59KCk7XG5cbmV4dGVuZChbUnVubmVyLCBGYWtlUnVubmVyXSwge1xuICBtZXJnZVdpdGg6IGZ1bmN0aW9uIG1lcmdlV2l0aChydW5uZXIpIHtcbiAgICByZXR1cm4gbmV3IEZha2VSdW5uZXIocnVubmVyLnRyYW5zZm9ybXMubG11bHRpcGx5KHRoaXMudHJhbnNmb3JtcyksIHJ1bm5lci5pZCk7XG4gIH1cbn0pOyAvLyBGYWtlUnVubmVyLmVtcHR5UnVubmVyID0gbmV3IEZha2VSdW5uZXIoKVxuXG52YXIgbG11bHRpcGx5ID0gZnVuY3Rpb24gbG11bHRpcGx5KGxhc3QsIGN1cnIpIHtcbiAgcmV0dXJuIGxhc3QubG11bHRpcGx5TyhjdXJyKTtcbn07XG5cbnZhciBnZXRSdW5uZXJUcmFuc2Zvcm0gPSBmdW5jdGlvbiBnZXRSdW5uZXJUcmFuc2Zvcm0ocnVubmVyKSB7XG4gIHJldHVybiBydW5uZXIudHJhbnNmb3Jtcztcbn07XG5cbmZ1bmN0aW9uIG1lcmdlVHJhbnNmb3JtcygpIHtcbiAgLy8gRmluZCB0aGUgbWF0cml4IHRvIGFwcGx5IHRvIHRoZSBlbGVtZW50IGFuZCBhcHBseSBpdFxuICB2YXIgcnVubmVycyA9IHRoaXMuX3RyYW5zZm9ybWF0aW9uUnVubmVycy5ydW5uZXJzO1xuICB2YXIgbmV0VHJhbnNmb3JtID0gcnVubmVycy5tYXAoZ2V0UnVubmVyVHJhbnNmb3JtKS5yZWR1Y2UobG11bHRpcGx5LCBuZXcgTWF0cml4KCkpO1xuICB0aGlzLnRyYW5zZm9ybShuZXRUcmFuc2Zvcm0pO1xuXG4gIHRoaXMuX3RyYW5zZm9ybWF0aW9uUnVubmVycy5tZXJnZSgpO1xuXG4gIGlmICh0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMubGVuZ3RoKCkgPT09IDEpIHtcbiAgICB0aGlzLl9mcmFtZUlkID0gbnVsbDtcbiAgfVxufVxuXG52YXIgUnVubmVyQXJyYXkgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSdW5uZXJBcnJheSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUnVubmVyQXJyYXkpO1xuXG4gICAgdGhpcy5ydW5uZXJzID0gW107XG4gICAgdGhpcy5pZHMgPSBbXTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhSdW5uZXJBcnJheSwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChydW5uZXIpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5lcnMuaW5jbHVkZXMocnVubmVyKSkgcmV0dXJuO1xuICAgICAgdmFyIGlkID0gcnVubmVyLmlkICsgMTtcbiAgICAgIHRoaXMucnVubmVycy5wdXNoKHJ1bm5lcik7XG4gICAgICB0aGlzLmlkcy5wdXNoKGlkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRCeUlEXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJ5SUQoaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bm5lcnNbdGhpcy5pZHMuaW5kZXhPZihpZCArIDEpXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pZHMuaW5kZXhPZihpZCArIDEpO1xuICAgICAgdGhpcy5pZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMucnVubmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1lcmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1lcmdlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBsYXN0UnVubmVyID0gbnVsbDtcbiAgICAgIHRoaXMucnVubmVycy5mb3JFYWNoKGZ1bmN0aW9uIChydW5uZXIsIGkpIHtcbiAgICAgICAgdmFyIGNvbmRpdGlvbiA9IGxhc3RSdW5uZXIgJiYgcnVubmVyLmRvbmUgJiYgbGFzdFJ1bm5lci5kb25lIC8vIGRvbid0IG1lcmdlIHJ1bm5lciB3aGVuIHBlcnNpc3RlZCBvbiB0aW1lbGluZVxuICAgICAgICAmJiAoIXJ1bm5lci5fdGltZWxpbmUgfHwgIXJ1bm5lci5fdGltZWxpbmUuX3J1bm5lcklkcy5pbmNsdWRlcyhydW5uZXIuaWQpKSAmJiAoIWxhc3RSdW5uZXIuX3RpbWVsaW5lIHx8ICFsYXN0UnVubmVyLl90aW1lbGluZS5fcnVubmVySWRzLmluY2x1ZGVzKGxhc3RSdW5uZXIuaWQpKTtcblxuICAgICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgLy8gdGhlICsxIGhhcHBlbnMgaW4gdGhlIGZ1bmN0aW9uXG4gICAgICAgICAgX3RoaXMyLnJlbW92ZShydW5uZXIuaWQpO1xuXG4gICAgICAgICAgX3RoaXMyLmVkaXQobGFzdFJ1bm5lci5pZCwgcnVubmVyLm1lcmdlV2l0aChsYXN0UnVubmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0UnVubmVyID0gcnVubmVyO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZWRpdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlZGl0KGlkLCBuZXdSdW5uZXIpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuaWRzLmluZGV4T2YoaWQgKyAxKTtcbiAgICAgIHRoaXMuaWRzLnNwbGljZShpbmRleCwgMSwgaWQgKyAxKTtcbiAgICAgIHRoaXMucnVubmVycy5zcGxpY2UoaW5kZXgsIDEsIG5ld1J1bm5lcik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGVuZ3RoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkcy5sZW5ndGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyQmVmb3JlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyQmVmb3JlKGlkKSB7XG4gICAgICB2YXIgZGVsZXRlQ250ID0gdGhpcy5pZHMuaW5kZXhPZihpZCArIDEpIHx8IDE7XG4gICAgICB0aGlzLmlkcy5zcGxpY2UoMCwgZGVsZXRlQ250LCAwKTtcbiAgICAgIHRoaXMucnVubmVycy5zcGxpY2UoMCwgZGVsZXRlQ250LCBuZXcgRmFrZVJ1bm5lcigpKS5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLmNsZWFyVHJhbnNmb3Jtc0Zyb21RdWV1ZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUnVubmVyQXJyYXk7XG59KCk7XG5cbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIEVsZW1lbnQ6IHtcbiAgICBhbmltYXRlOiBmdW5jdGlvbiBhbmltYXRlKGR1cmF0aW9uLCBkZWxheSwgd2hlbikge1xuICAgICAgdmFyIG8gPSBSdW5uZXIuc2FuaXRpc2UoZHVyYXRpb24sIGRlbGF5LCB3aGVuKTtcbiAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgIHJldHVybiBuZXcgUnVubmVyKG8uZHVyYXRpb24pLmxvb3AobykuZWxlbWVudCh0aGlzKS50aW1lbGluZSh0aW1lbGluZS5wbGF5KCkpLnNjaGVkdWxlKG8uZGVsYXksIG8ud2hlbik7XG4gICAgfSxcbiAgICBkZWxheTogZnVuY3Rpb24gZGVsYXkoYnksIHdoZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmFuaW1hdGUoMCwgYnksIHdoZW4pO1xuICAgIH0sXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBzZWFyY2hlcyBmb3IgYWxsIHJ1bm5lcnMgb24gdGhlIGVsZW1lbnQgYW5kIGRlbGV0ZXMgdGhlIG9uZXNcbiAgICAvLyB3aGljaCBydW4gYmVmb3JlIHRoZSBjdXJyZW50IG9uZS4gVGhpcyBpcyBiZWNhdXNlIGFic29sdXRlIHRyYW5zZm9ybWF0aW9uc1xuICAgIC8vIG92ZXJ3ZnJpdGUgYW55dGhpbmcgYW55d2F5IHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gd2FzdGUgdGltZSBjb21wdXRpbmdcbiAgICAvLyBvdGhlciBydW5uZXJzXG4gICAgX2NsZWFyVHJhbnNmb3JtUnVubmVyc0JlZm9yZTogZnVuY3Rpb24gX2NsZWFyVHJhbnNmb3JtUnVubmVyc0JlZm9yZShjdXJyZW50UnVubmVyKSB7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMuY2xlYXJCZWZvcmUoY3VycmVudFJ1bm5lci5pZCk7XG4gICAgfSxcbiAgICBfY3VycmVudFRyYW5zZm9ybTogZnVuY3Rpb24gX2N1cnJlbnRUcmFuc2Zvcm0oY3VycmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybWF0aW9uUnVubmVycy5ydW5uZXJzIC8vIHdlIG5lZWQgdGhlIGVxdWFsIHNpZ24gaGVyZSB0byBtYWtlIHN1cmUsIHRoYXQgYWxzbyB0cmFuc2Zvcm1hdGlvbnNcbiAgICAgIC8vIG9uIHRoZSBzYW1lIHJ1bm5lciB3aGljaCBleGVjdXRlIGJlZm9yZSB0aGUgY3VycmVudCB0cmFuc2Zvcm1hdGlvbiBhcmVcbiAgICAgIC8vIHRha2VuIGludG8gYWNjb3VudFxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAocnVubmVyKSB7XG4gICAgICAgIHJldHVybiBydW5uZXIuaWQgPD0gY3VycmVudC5pZDtcbiAgICAgIH0pLm1hcChnZXRSdW5uZXJUcmFuc2Zvcm0pLnJlZHVjZShsbXVsdGlwbHksIG5ldyBNYXRyaXgoKSk7XG4gICAgfSxcbiAgICBfYWRkUnVubmVyOiBmdW5jdGlvbiBfYWRkUnVubmVyKHJ1bm5lcikge1xuICAgICAgdGhpcy5fdHJhbnNmb3JtYXRpb25SdW5uZXJzLmFkZChydW5uZXIpOyAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcnVubmVyIG1lcmdlIGlzIGV4ZWN1dGVkIGF0IHRoZSB2ZXJ5IGVuZCBvZlxuICAgICAgLy8gYWxsIEFuaW1hdG9yIGZ1bmN0aW9ucy4gVGhhdHMgd2h5IHdlIHVzZSBpbW1lZGlhdGUgaGVyZSB0byBleGVjdXRlXG4gICAgICAvLyB0aGUgbWVyZ2UgcmlnaHQgYWZ0ZXIgYWxsIGZyYW1lcyBhcmUgcnVuXG5cblxuICAgICAgQW5pbWF0b3IuY2FuY2VsSW1tZWRpYXRlKHRoaXMuX2ZyYW1lSWQpO1xuICAgICAgdGhpcy5fZnJhbWVJZCA9IEFuaW1hdG9yLmltbWVkaWF0ZShtZXJnZVRyYW5zZm9ybXMuYmluZCh0aGlzKSk7XG4gICAgfSxcbiAgICBfcHJlcGFyZVJ1bm5lcjogZnVuY3Rpb24gX3ByZXBhcmVSdW5uZXIoKSB7XG4gICAgICBpZiAodGhpcy5fZnJhbWVJZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybWF0aW9uUnVubmVycyA9IG5ldyBSdW5uZXJBcnJheSgpLmFkZChuZXcgRmFrZVJ1bm5lcihuZXcgTWF0cml4KHRoaXMpKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbmV4dGVuZChSdW5uZXIsIHtcbiAgYXR0cjogZnVuY3Rpb24gYXR0cihhLCB2KSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVBdHRyKCdhdHRyJywgYSwgdik7XG4gIH0sXG4gIC8vIEFkZCBhbmltYXRhYmxlIHN0eWxlc1xuICBjc3M6IGZ1bmN0aW9uIGNzcyhzLCB2KSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVBdHRyKCdjc3MnLCBzLCB2KTtcbiAgfSxcbiAgc3R5bGVBdHRyOiBmdW5jdGlvbiBzdHlsZUF0dHIodHlwZSwgbmFtZSwgdmFsKSB7XG4gICAgLy8gYXBwbHkgYXR0cmlidXRlcyBpbmRpdmlkdWFsbHlcbiAgICBpZiAoX3R5cGVvZihuYW1lKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICAgIHRoaXMuc3R5bGVBdHRyKHR5cGUsIGtleSwgbmFtZVtrZXldKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIG1vcnBoZXIgPSBuZXcgTW9ycGhhYmxlKHRoaXMuX3N0ZXBwZXIpLnRvKHZhbCk7XG4gICAgdGhpcy5xdWV1ZShmdW5jdGlvbiAoKSB7XG4gICAgICBtb3JwaGVyID0gbW9ycGhlci5mcm9tKHRoaXMuZWxlbWVudCgpW3R5cGVdKG5hbWUpKTtcbiAgICB9LCBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB0aGlzLmVsZW1lbnQoKVt0eXBlXShuYW1lLCBtb3JwaGVyLmF0KHBvcykpO1xuICAgICAgcmV0dXJuIG1vcnBoZXIuZG9uZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICB6b29tOiBmdW5jdGlvbiB6b29tKGxldmVsLCBwb2ludCkge1xuICAgIGlmICh0aGlzLl90cnlSZXRhcmdldCgnem9vbScsIHRvLCBwb2ludCkpIHJldHVybiB0aGlzO1xuICAgIHZhciBtb3JwaGVyID0gbmV3IE1vcnBoYWJsZSh0aGlzLl9zdGVwcGVyKS50byhuZXcgU1ZHTnVtYmVyKGxldmVsKSk7XG4gICAgdGhpcy5xdWV1ZShmdW5jdGlvbiAoKSB7XG4gICAgICBtb3JwaGVyID0gbW9ycGhlci5mcm9tKHRoaXMuZWxlbWVudCgpLnpvb20oKSk7XG4gICAgfSwgZnVuY3Rpb24gKHBvcykge1xuICAgICAgdGhpcy5lbGVtZW50KCkuem9vbShtb3JwaGVyLmF0KHBvcyksIHBvaW50KTtcbiAgICAgIHJldHVybiBtb3JwaGVyLmRvbmUoKTtcbiAgICB9LCBmdW5jdGlvbiAobmV3TGV2ZWwsIG5ld1BvaW50KSB7XG4gICAgICBwb2ludCA9IG5ld1BvaW50O1xuICAgICAgbW9ycGhlci50byhuZXdMZXZlbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZW1lbWJlck1vcnBoZXIoJ3pvb20nLCBtb3JwaGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxyXG4gICAqKiBhYnNvbHV0ZSB0cmFuc2Zvcm1hdGlvbnNcclxuICAgKiovXG4gIC8vXG4gIC8vIE0gdiAtLS0tLXwtLS0tLShEIE0gdiA9IEYgdiktLS0tLS18LS0tLS0+ICBUIHZcbiAgLy9cbiAgLy8gMS4gZGVmaW5lIHRoZSBmaW5hbCBzdGF0ZSAoVCkgYW5kIGRlY29tcG9zZSBpdCAob25jZSlcbiAgLy8gICAgdCA9IFt0eCwgdHksIHRoZSwgbGFtLCBzeSwgc3hdXG4gIC8vIDIuIG9uIGV2ZXJ5IGZyYW1lOiBwdWxsIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFsbCBwcmV2aW91cyB0cmFuc2Zvcm1zXG4gIC8vICAgIChNIC0gbSBjYW4gY2hhbmdlKVxuICAvLyAgIGFuZCB0aGVuIHdyaXRlIHRoaXMgYXMgbSA9IFt0eDAsIHR5MCwgdGhlMCwgbGFtMCwgc3kwLCBzeDBdXG4gIC8vIDMuIEZpbmQgdGhlIGludGVycG9sYXRlZCBtYXRyaXggRihwb3MpID0gbSArIHBvcyAqICh0IC0gbSlcbiAgLy8gICAtIE5vdGUgRigwKSA9IE1cbiAgLy8gICAtIE5vdGUgRigxKSA9IFRcbiAgLy8gNC4gTm93IHlvdSBnZXQgdGhlIGRlbHRhIG1hdHJpeCBhcyBhIHJlc3VsdDogRCA9IEYgKiBpbnYoTSlcbiAgdHJhbnNmb3JtOiBmdW5jdGlvbiB0cmFuc2Zvcm0odHJhbnNmb3JtcywgcmVsYXRpdmUsIGFmZmluZSkge1xuICAgIC8vIElmIHdlIGhhdmUgYSBkZWNsYXJhdGl2ZSBmdW5jdGlvbiwgd2Ugc2hvdWxkIHJldGFyZ2V0IGl0IGlmIHBvc3NpYmxlXG4gICAgcmVsYXRpdmUgPSB0cmFuc2Zvcm1zLnJlbGF0aXZlIHx8IHJlbGF0aXZlO1xuXG4gICAgaWYgKHRoaXMuX2lzRGVjbGFyYXRpdmUgJiYgIXJlbGF0aXZlICYmIHRoaXMuX3RyeVJldGFyZ2V0KCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm1zKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBQYXJzZSB0aGUgcGFyYW1ldGVyc1xuXG5cbiAgICB2YXIgaXNNYXRyaXggPSBNYXRyaXguaXNNYXRyaXhMaWtlKHRyYW5zZm9ybXMpO1xuICAgIGFmZmluZSA9IHRyYW5zZm9ybXMuYWZmaW5lICE9IG51bGwgPyB0cmFuc2Zvcm1zLmFmZmluZSA6IGFmZmluZSAhPSBudWxsID8gYWZmaW5lIDogIWlzTWF0cml4OyAvLyBDcmVhdGUgYSBtb3JlcGhlciBhbmQgc2V0IGl0cyB0eXBlXG5cbiAgICB2YXIgbW9ycGhlciA9IG5ldyBNb3JwaGFibGUodGhpcy5fc3RlcHBlcikudHlwZShhZmZpbmUgPyBUcmFuc2Zvcm1CYWcgOiBNYXRyaXgpO1xuICAgIHZhciBvcmlnaW47XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgdmFyIGN1cnJlbnQ7XG4gICAgdmFyIGN1cnJlbnRBbmdsZTtcbiAgICB2YXIgc3RhcnRUcmFuc2Zvcm07XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSBlbGVtZW50IGFuZCBvcmlnaW4gaXMgZGVmaW5lZFxuICAgICAgZWxlbWVudCA9IGVsZW1lbnQgfHwgdGhpcy5lbGVtZW50KCk7XG4gICAgICBvcmlnaW4gPSBvcmlnaW4gfHwgZ2V0T3JpZ2luKHRyYW5zZm9ybXMsIGVsZW1lbnQpO1xuICAgICAgc3RhcnRUcmFuc2Zvcm0gPSBuZXcgTWF0cml4KHJlbGF0aXZlID8gdW5kZWZpbmVkIDogZWxlbWVudCk7IC8vIGFkZCB0aGUgcnVubmVyIHRvIHRoZSBlbGVtZW50IHNvIGl0IGNhbiBtZXJnZSB0cmFuc2Zvcm1hdGlvbnNcblxuICAgICAgZWxlbWVudC5fYWRkUnVubmVyKHRoaXMpOyAvLyBEZWFjdGl2YXRlIGFsbCB0cmFuc2Zvcm1zIHRoYXQgaGF2ZSBydW4gc28gZmFyIGlmIHdlIGFyZSBhYnNvbHV0ZVxuXG5cbiAgICAgIGlmICghcmVsYXRpdmUpIHtcbiAgICAgICAgZWxlbWVudC5fY2xlYXJUcmFuc2Zvcm1SdW5uZXJzQmVmb3JlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bihwb3MpIHtcbiAgICAgIC8vIGNsZWFyIGFsbCBvdGhlciB0cmFuc2Zvcm1zIGJlZm9yZSB0aGlzIGluIGNhc2Ugc29tZXRoaW5nIGlzIHNhdmVkXG4gICAgICAvLyBvbiB0aGlzIHJ1bm5lci4gV2UgYXJlIGFic29sdXRlLiBXZSBkb250IG5lZWQgdGhlc2UhXG4gICAgICBpZiAoIXJlbGF0aXZlKSB0aGlzLmNsZWFyVHJhbnNmb3JtKCk7XG5cbiAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IFBvaW50KG9yaWdpbikudHJhbnNmb3JtKGVsZW1lbnQuX2N1cnJlbnRUcmFuc2Zvcm0odGhpcykpLFxuICAgICAgICAgIHggPSBfdHJhbnNmb3JtLngsXG4gICAgICAgICAgeSA9IF90cmFuc2Zvcm0ueTtcblxuICAgICAgdmFyIHRhcmdldCA9IG5ldyBNYXRyaXgoX29iamVjdFNwcmVhZCQxKHt9LCB0cmFuc2Zvcm1zLCB7XG4gICAgICAgIG9yaWdpbjogW3gsIHldXG4gICAgICB9KSk7XG4gICAgICB2YXIgc3RhcnQgPSB0aGlzLl9pc0RlY2xhcmF0aXZlICYmIGN1cnJlbnQgPyBjdXJyZW50IDogc3RhcnRUcmFuc2Zvcm07XG5cbiAgICAgIGlmIChhZmZpbmUpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmRlY29tcG9zZSh4LCB5KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5kZWNvbXBvc2UoeCwgeSk7IC8vIEdldCB0aGUgY3VycmVudCBhbmQgdGFyZ2V0IGFuZ2xlIGFzIGl0IHdhcyBzZXRcblxuICAgICAgICB2YXIgclRhcmdldCA9IHRhcmdldC5yb3RhdGU7XG4gICAgICAgIHZhciByQ3VycmVudCA9IHN0YXJ0LnJvdGF0ZTsgLy8gRmlndXJlIG91dCB0aGUgc2hvcnRlc3QgcGF0aCB0byByb3RhdGUgZGlyZWN0bHlcblxuICAgICAgICB2YXIgcG9zc2liaWxpdGllcyA9IFtyVGFyZ2V0IC0gMzYwLCByVGFyZ2V0LCByVGFyZ2V0ICsgMzYwXTtcbiAgICAgICAgdmFyIGRpc3RhbmNlcyA9IHBvc3NpYmlsaXRpZXMubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSByQ3VycmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc2hvcnRlc3QgPSBNYXRoLm1pbi5hcHBseShNYXRoLCBfdG9Db25zdW1hYmxlQXJyYXkoZGlzdGFuY2VzKSk7XG4gICAgICAgIHZhciBpbmRleCA9IGRpc3RhbmNlcy5pbmRleE9mKHNob3J0ZXN0KTtcbiAgICAgICAgdGFyZ2V0LnJvdGF0ZSA9IHBvc3NpYmlsaXRpZXNbaW5kZXhdO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBiZSBjYXJlZnVsIGhlcmUgbm90IHRvIG92ZXJ3cml0ZSB0aGUgcm90YXRpb25cbiAgICAgICAgLy8gd2l0aCB0aGUgcm90YXRlIG1ldGhvZCBvZiBNYXRyaXhcbiAgICAgICAgaWYgKCFpc01hdHJpeCkge1xuICAgICAgICAgIHRhcmdldC5yb3RhdGUgPSB0cmFuc2Zvcm1zLnJvdGF0ZSB8fCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzRGVjbGFyYXRpdmUgJiYgY3VycmVudEFuZ2xlKSB7XG4gICAgICAgICAgc3RhcnQucm90YXRlID0gY3VycmVudEFuZ2xlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1vcnBoZXIuZnJvbShzdGFydCk7XG4gICAgICBtb3JwaGVyLnRvKHRhcmdldCk7XG4gICAgICB2YXIgYWZmaW5lUGFyYW1ldGVycyA9IG1vcnBoZXIuYXQocG9zKTtcbiAgICAgIGN1cnJlbnRBbmdsZSA9IGFmZmluZVBhcmFtZXRlcnMucm90YXRlO1xuICAgICAgY3VycmVudCA9IG5ldyBNYXRyaXgoYWZmaW5lUGFyYW1ldGVycyk7XG4gICAgICB0aGlzLmFkZFRyYW5zZm9ybShjdXJyZW50KTtcblxuICAgICAgZWxlbWVudC5fYWRkUnVubmVyKHRoaXMpO1xuXG4gICAgICByZXR1cm4gbW9ycGhlci5kb25lKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0YXJnZXQobmV3VHJhbnNmb3Jtcykge1xuICAgICAgLy8gb25seSBnZXQgYSBuZXcgb3JpZ2luIGlmIGl0IGNoYW5nZWQgc2luY2UgdGhlIGxhc3QgY2FsbFxuICAgICAgaWYgKChuZXdUcmFuc2Zvcm1zLm9yaWdpbiB8fCAnY2VudGVyJykudG9TdHJpbmcoKSAhPT0gKHRyYW5zZm9ybXMub3JpZ2luIHx8ICdjZW50ZXInKS50b1N0cmluZygpKSB7XG4gICAgICAgIG9yaWdpbiA9IGdldE9yaWdpbih0cmFuc2Zvcm1zLCBlbGVtZW50KTtcbiAgICAgIH0gLy8gb3ZlcndyaXRlIHRoZSBvbGQgdHJhbnNmb3JtYXRpb25zIHdpdGggdGhlIG5ldyBvbmVzXG5cblxuICAgICAgdHJhbnNmb3JtcyA9IF9vYmplY3RTcHJlYWQkMSh7fSwgbmV3VHJhbnNmb3Jtcywge1xuICAgICAgICBvcmlnaW46IG9yaWdpblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZShzZXR1cCwgcnVuLCByZXRhcmdldCwgdHJ1ZSk7XG4gICAgdGhpcy5faXNEZWNsYXJhdGl2ZSAmJiB0aGlzLl9yZW1lbWJlck1vcnBoZXIoJ3RyYW5zZm9ybScsIG1vcnBoZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBBbmltYXRhYmxlIHgtYXhpc1xuICB4OiBmdW5jdGlvbiB4KF94LCByZWxhdGl2ZSkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU51bWJlcigneCcsIF94KTtcbiAgfSxcbiAgLy8gQW5pbWF0YWJsZSB5LWF4aXNcbiAgeTogZnVuY3Rpb24geShfeSkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU51bWJlcigneScsIF95KTtcbiAgfSxcbiAgZHg6IGZ1bmN0aW9uIGR4KCkge1xuICAgIHZhciB4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU51bWJlckRlbHRhKCd4JywgeCk7XG4gIH0sXG4gIGR5OiBmdW5jdGlvbiBkeSgpIHtcbiAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXJEZWx0YSgneScsIHkpO1xuICB9LFxuICBkbW92ZTogZnVuY3Rpb24gZG1vdmUoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLmR4KHgpLmR5KHkpO1xuICB9LFxuICBfcXVldWVOdW1iZXJEZWx0YTogZnVuY3Rpb24gX3F1ZXVlTnVtYmVyRGVsdGEobWV0aG9kLCB0bykge1xuICAgIHRvID0gbmV3IFNWR051bWJlcih0byk7IC8vIFRyeSB0byBjaGFuZ2UgdGhlIHRhcmdldCBpZiB3ZSBoYXZlIHRoaXMgbWV0aG9kIGFscmVhZHkgcmVnaXN0ZXJkXG5cbiAgICBpZiAodGhpcy5fdHJ5UmV0YXJnZXQobWV0aG9kLCB0bykpIHJldHVybiB0aGlzOyAvLyBNYWtlIGEgbW9ycGhlciBhbmQgcXVldWUgdGhlIGFuaW1hdGlvblxuXG4gICAgdmFyIG1vcnBoZXIgPSBuZXcgTW9ycGhhYmxlKHRoaXMuX3N0ZXBwZXIpLnRvKHRvKTtcbiAgICB2YXIgZnJvbSA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZShmdW5jdGlvbiAoKSB7XG4gICAgICBmcm9tID0gdGhpcy5lbGVtZW50KClbbWV0aG9kXSgpO1xuICAgICAgbW9ycGhlci5mcm9tKGZyb20pO1xuICAgICAgbW9ycGhlci50byhmcm9tICsgdG8pO1xuICAgIH0sIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHRoaXMuZWxlbWVudCgpW21ldGhvZF0obW9ycGhlci5hdChwb3MpKTtcbiAgICAgIHJldHVybiBtb3JwaGVyLmRvbmUoKTtcbiAgICB9LCBmdW5jdGlvbiAobmV3VG8pIHtcbiAgICAgIG1vcnBoZXIudG8oZnJvbSArIG5ldyBTVkdOdW1iZXIobmV3VG8pKTtcbiAgICB9KTsgLy8gUmVnaXN0ZXIgdGhlIG1vcnBoZXIgc28gdGhhdCBpZiBpdCBpcyBjaGFuZ2VkIGFnYWluLCB3ZSBjYW4gcmV0YXJnZXQgaXRcblxuICAgIHRoaXMuX3JlbWVtYmVyTW9ycGhlcihtZXRob2QsIG1vcnBoZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9xdWV1ZU9iamVjdDogZnVuY3Rpb24gX3F1ZXVlT2JqZWN0KG1ldGhvZCwgdG8pIHtcbiAgICAvLyBUcnkgdG8gY2hhbmdlIHRoZSB0YXJnZXQgaWYgd2UgaGF2ZSB0aGlzIG1ldGhvZCBhbHJlYWR5IHJlZ2lzdGVyZFxuICAgIGlmICh0aGlzLl90cnlSZXRhcmdldChtZXRob2QsIHRvKSkgcmV0dXJuIHRoaXM7IC8vIE1ha2UgYSBtb3JwaGVyIGFuZCBxdWV1ZSB0aGUgYW5pbWF0aW9uXG5cbiAgICB2YXIgbW9ycGhlciA9IG5ldyBNb3JwaGFibGUodGhpcy5fc3RlcHBlcikudG8odG8pO1xuICAgIHRoaXMucXVldWUoZnVuY3Rpb24gKCkge1xuICAgICAgbW9ycGhlci5mcm9tKHRoaXMuZWxlbWVudCgpW21ldGhvZF0oKSk7XG4gICAgfSwgZnVuY3Rpb24gKHBvcykge1xuICAgICAgdGhpcy5lbGVtZW50KClbbWV0aG9kXShtb3JwaGVyLmF0KHBvcykpO1xuICAgICAgcmV0dXJuIG1vcnBoZXIuZG9uZSgpO1xuICAgIH0pOyAvLyBSZWdpc3RlciB0aGUgbW9ycGhlciBzbyB0aGF0IGlmIGl0IGlzIGNoYW5nZWQgYWdhaW4sIHdlIGNhbiByZXRhcmdldCBpdFxuXG4gICAgdGhpcy5fcmVtZW1iZXJNb3JwaGVyKG1ldGhvZCwgbW9ycGhlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3F1ZXVlTnVtYmVyOiBmdW5jdGlvbiBfcXVldWVOdW1iZXIobWV0aG9kLCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU9iamVjdChtZXRob2QsIG5ldyBTVkdOdW1iZXIodmFsdWUpKTtcbiAgfSxcbiAgLy8gQW5pbWF0YWJsZSBjZW50ZXIgeC1heGlzXG4gIGN4OiBmdW5jdGlvbiBjeCh4KSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyKCdjeCcsIHgpO1xuICB9LFxuICAvLyBBbmltYXRhYmxlIGNlbnRlciB5LWF4aXNcbiAgY3k6IGZ1bmN0aW9uIGN5KHkpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXIoJ2N5JywgeSk7XG4gIH0sXG4gIC8vIEFkZCBhbmltYXRhYmxlIG1vdmVcbiAgbW92ZTogZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMueCh4KS55KHkpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSBjZW50ZXJcbiAgY2VudGVyOiBmdW5jdGlvbiBjZW50ZXIoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLmN4KHgpLmN5KHkpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSBzaXplXG4gIHNpemU6IGZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIC8vIGFuaW1hdGUgYmJveCBiYXNlZCBzaXplIGZvciBhbGwgb3RoZXIgZWxlbWVudHNcbiAgICB2YXIgYm94O1xuXG4gICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KSB7XG4gICAgICBib3ggPSB0aGlzLl9lbGVtZW50LmJib3goKTtcbiAgICB9XG5cbiAgICBpZiAoIXdpZHRoKSB7XG4gICAgICB3aWR0aCA9IGJveC53aWR0aCAvIGJveC5oZWlnaHQgKiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKCFoZWlnaHQpIHtcbiAgICAgIGhlaWdodCA9IGJveC5oZWlnaHQgLyBib3gud2lkdGggKiB3aWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy53aWR0aCh3aWR0aCkuaGVpZ2h0KGhlaWdodCk7XG4gIH0sXG4gIC8vIEFkZCBhbmltYXRhYmxlIHdpZHRoXG4gIHdpZHRoOiBmdW5jdGlvbiB3aWR0aChfd2lkdGgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXIoJ3dpZHRoJywgX3dpZHRoKTtcbiAgfSxcbiAgLy8gQWRkIGFuaW1hdGFibGUgaGVpZ2h0XG4gIGhlaWdodDogZnVuY3Rpb24gaGVpZ2h0KF9oZWlnaHQpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXIoJ2hlaWdodCcsIF9oZWlnaHQpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSBwbG90XG4gIHBsb3Q6IGZ1bmN0aW9uIHBsb3QoYSwgYiwgYywgZCkge1xuICAgIC8vIExpbmVzIGNhbiBiZSBwbG90dGVkIHdpdGggNCBhcmd1bWVudHNcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgcmV0dXJuIHRoaXMucGxvdChbYSwgYiwgYywgZF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl90cnlSZXRhcmdldCgncGxvdCcsIGEpKSByZXR1cm4gdGhpcztcbiAgICB2YXIgbW9ycGhlciA9IG5ldyBNb3JwaGFibGUodGhpcy5fc3RlcHBlcikudHlwZSh0aGlzLl9lbGVtZW50Lk1vcnBoQXJyYXkpLnRvKGEpO1xuICAgIHRoaXMucXVldWUoZnVuY3Rpb24gKCkge1xuICAgICAgbW9ycGhlci5mcm9tKHRoaXMuX2VsZW1lbnQuYXJyYXkoKSk7XG4gICAgfSwgZnVuY3Rpb24gKHBvcykge1xuICAgICAgdGhpcy5fZWxlbWVudC5wbG90KG1vcnBoZXIuYXQocG9zKSk7XG5cbiAgICAgIHJldHVybiBtb3JwaGVyLmRvbmUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3JlbWVtYmVyTW9ycGhlcigncGxvdCcsIG1vcnBoZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8vIEFkZCBsZWFkaW5nIG1ldGhvZFxuICBsZWFkaW5nOiBmdW5jdGlvbiBsZWFkaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyKCdsZWFkaW5nJywgdmFsdWUpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSB2aWV3Ym94XG4gIHZpZXdib3g6IGZ1bmN0aW9uIHZpZXdib3goeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU9iamVjdCgndmlld2JveCcsIG5ldyBCb3goeCwgeSwgd2lkdGgsIGhlaWdodCkpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvKSB7XG4gICAgaWYgKF90eXBlb2YobykgIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGUoe1xuICAgICAgICBvZmZzZXQ6IGFyZ3VtZW50c1swXSxcbiAgICAgICAgY29sb3I6IGFyZ3VtZW50c1sxXSxcbiAgICAgICAgb3BhY2l0eTogYXJndW1lbnRzWzJdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoby5vcGFjaXR5ICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1vcGFjaXR5Jywgby5vcGFjaXR5KTtcbiAgICBpZiAoby5jb2xvciAhPSBudWxsKSB0aGlzLmF0dHIoJ3N0b3AtY29sb3InLCBvLmNvbG9yKTtcbiAgICBpZiAoby5vZmZzZXQgIT0gbnVsbCkgdGhpcy5hdHRyKCdvZmZzZXQnLCBvLm9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuZXh0ZW5kKFJ1bm5lciwge1xuICByeDogcngsXG4gIHJ5OiByeSxcbiAgZnJvbTogZnJvbSxcbiAgdG86IHRvXG59KTtcbnJlZ2lzdGVyKFJ1bm5lciwgJ1J1bm5lcicpO1xuXG52YXIgU3ZnID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhTdmcsIF9Db250YWluZXIpO1xuXG4gIGZ1bmN0aW9uIFN2Zyhub2RlKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN2Zyk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTdmcpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdzdmcnLCBub2RlKSwgbm9kZSkpO1xuXG4gICAgX3RoaXMubmFtZXNwYWNlKCk7XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU3ZnLCBbe1xuICAgIGtleTogXCJpc1Jvb3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNSb290KCkge1xuICAgICAgcmV0dXJuICF0aGlzLm5vZGUucGFyZW50Tm9kZSB8fCAhKHRoaXMubm9kZS5wYXJlbnROb2RlIGluc3RhbmNlb2YgZ2xvYmFscy53aW5kb3cuU1ZHRWxlbWVudCkgfHwgdGhpcy5ub2RlLnBhcmVudE5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnO1xuICAgIH0gLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIHJvb3Qgc3ZnXG4gICAgLy8gSWYgbm90LCBjYWxsIGRvY3MgZnJvbSB0aGlzIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcInJvb3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcm9vdCgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSByZXR1cm4gdGhpcztcbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihTdmcucHJvdG90eXBlKSwgXCJyb290XCIsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfSAvLyBBZGQgbmFtZXNwYWNlc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibmFtZXNwYWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5hbWVzcGFjZSgpIHtcbiAgICAgIGlmICghdGhpcy5pc1Jvb3QoKSkgcmV0dXJuIHRoaXMucm9vdCgpLm5hbWVzcGFjZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cih7XG4gICAgICAgIHhtbG5zOiBucyxcbiAgICAgICAgdmVyc2lvbjogJzEuMSdcbiAgICAgIH0pLmF0dHIoJ3htbG5zOnhsaW5rJywgeGxpbmssIHhtbG5zKS5hdHRyKCd4bWxuczpzdmdqcycsIHN2Z2pzLCB4bWxucyk7XG4gICAgfSAvLyBDcmVhdGVzIGFuZCByZXR1cm5zIGRlZnMgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGVmc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZzKCkge1xuICAgICAgaWYgKCF0aGlzLmlzUm9vdCgpKSByZXR1cm4gdGhpcy5yb290KCkuZGVmcygpO1xuICAgICAgcmV0dXJuIGFkb3B0KHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCdkZWZzJykpIHx8IHRoaXMucHV0KG5ldyBEZWZzKCkpO1xuICAgIH0gLy8gY3VzdG9tIHBhcmVudCBtZXRob2RcblxuICB9LCB7XG4gICAga2V5OiBcInBhcmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJlbnQodHlwZSkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JyA/IG51bGwgOiBhZG9wdCh0aGlzLm5vZGUucGFyZW50Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihTdmcucHJvdG90eXBlKSwgXCJwYXJlbnRcIiwgdGhpcykuY2FsbCh0aGlzLCB0eXBlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAvLyByZW1vdmUgY2hpbGRyZW5cbiAgICAgIHdoaWxlICh0aGlzLm5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUubGFzdENoaWxkKTtcbiAgICAgIH0gLy8gcmVtb3ZlIGRlZnMgcmVmZXJlbmNlXG5cblxuICAgICAgZGVsZXRlIHRoaXMuX2RlZnM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3ZnO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIG5lc3RlZCBzdmcgZG9jdW1lbnRcbiAgICBuZXN0ZWQ6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU3ZnKCkpO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoU3ZnLCAnU3ZnJywgdHJ1ZSk7XG5cbnZhciBfU3ltYm9sID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhfU3ltYm9sLCBfQ29udGFpbmVyKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gX1N5bWJvbChub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9TeW1ib2wpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihfU3ltYm9sKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnc3ltYm9sJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIHJldHVybiBfU3ltYm9sO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgc3ltYm9sOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IF9TeW1ib2woKSk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihfU3ltYm9sLCAnU3ltYm9sJyk7XG5cbmZ1bmN0aW9uIHBsYWluKHRleHQpIHtcbiAgLy8gY2xlYXIgaWYgYnVpbGQgbW9kZSBpcyBkaXNhYmxlZFxuICBpZiAodGhpcy5fYnVpbGQgPT09IGZhbHNlKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICB9IC8vIGNyZWF0ZSB0ZXh0IG5vZGVcblxuXG4gIHRoaXMubm9kZS5hcHBlbmRDaGlsZChnbG9iYWxzLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcbiAgcmV0dXJuIHRoaXM7XG59IC8vIEdldCBsZW5ndGggb2YgdGV4dCBlbGVtZW50XG5cbmZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcbn1cblxudmFyIHRleHRhYmxlID0gKHtcblx0X19wcm90b19fOiBudWxsLFxuXHRwbGFpbjogcGxhaW4sXG5cdGxlbmd0aDogbGVuZ3RoXG59KTtcblxudmFyIFRleHQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoVGV4dCwgX1NoYXBlKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gVGV4dChub2RlKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRleHQpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoVGV4dCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3RleHQnLCBub2RlKSwgbm9kZSkpO1xuICAgIF90aGlzLmRvbS5sZWFkaW5nID0gbmV3IFNWR051bWJlcigxLjMpOyAvLyBzdG9yZSBsZWFkaW5nIHZhbHVlIGZvciByZWJ1aWxkaW5nXG5cbiAgICBfdGhpcy5fcmVidWlsZCA9IHRydWU7IC8vIGVuYWJsZSBhdXRvbWF0aWMgdXBkYXRpbmcgb2YgZHkgdmFsdWVzXG5cbiAgICBfdGhpcy5fYnVpbGQgPSBmYWxzZTsgLy8gZGlzYWJsZSBidWlsZCBtb2RlIGZvciBhZGRpbmcgbXVsdGlwbGUgbGluZXNcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSAvLyBNb3ZlIG92ZXIgeC1heGlzXG4gIC8vIFRleHQgaXMgbW92ZWQgaXRzIGJvdW5kaW5nIGJveFxuICAvLyB0ZXh0LWFuY2hvciBkb2VzIE5PVCBtYXR0ZXJcblxuXG4gIF9jcmVhdGVDbGFzcyhUZXh0LCBbe1xuICAgIGtleTogXCJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHgoX3gpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuYmJveCgpO1xuXG4gICAgICBpZiAoX3ggPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYm94Lng7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3gnLCB0aGlzLmF0dHIoJ3gnKSArIF94IC0gYm94LngpO1xuICAgIH0gLy8gTW92ZSBvdmVyIHktYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwieVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB5KF95KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcblxuICAgICAgaWYgKF95ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGJveC55O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgdGhpcy5hdHRyKCd5JykgKyBfeSAtIGJveC55KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRoaXMuYmJveCgpO1xuICAgICAgcmV0dXJuIHRoaXMueCh4LCBib3gpLnkoeSwgYm94KTtcbiAgICB9IC8vIE1vdmUgY2VudGVyIG92ZXIgeC1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJjeFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjeCh4KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcblxuICAgICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYm94LmN4O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgdGhpcy5hdHRyKCd4JykgKyB4IC0gYm94LmN4KTtcbiAgICB9IC8vIE1vdmUgY2VudGVyIG92ZXIgeS1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJjeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjeSh5KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcblxuICAgICAgaWYgKHkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYm94LmN5O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgdGhpcy5hdHRyKCd5JykgKyB5IC0gYm94LmN5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2VudGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNlbnRlcih4LCB5KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0aGlzLmJib3goKTtcbiAgICAgIHJldHVybiB0aGlzLmN4KHgsIGJveCkuY3koeSwgYm94KTtcbiAgICB9IC8vIFNldCB0aGUgdGV4dCBjb250ZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJ0ZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRleHQoX3RleHQpIHtcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcbiAgICAgIGlmIChfdGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICB2YXIgZmlyc3RMaW5lID0gMDtcbiAgICAgICAgX3RleHQgPSAnJztcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAvLyBza2lwIHRleHRQYXRocyAtIHRoZXkgYXJlIG5vIGxpbmVzXG4gICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLm5vZGVOYW1lID09PSAndGV4dFBhdGgnKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkgZmlyc3RMaW5lID0gMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gLy8gYWRkIG5ld2xpbmUgaWYgaXRzIG5vdCB0aGUgZmlyc3QgY2hpbGQgYW5kIG5ld0xpbmVkIGlzIHNldCB0byB0cnVlXG5cblxuICAgICAgICAgIGlmIChpICE9PSBmaXJzdExpbmUgJiYgY2hpbGRyZW5baV0ubm9kZVR5cGUgIT09IDMgJiYgYWRvcHQoY2hpbGRyZW5baV0pLmRvbS5uZXdMaW5lZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgX3RleHQgKz0gJ1xcbic7XG4gICAgICAgICAgfSAvLyBhZGQgY29udGVudCBvZiB0aGlzIG5vZGVcblxuXG4gICAgICAgICAgX3RleHQgKz0gY2hpbGRyZW5baV0udGV4dENvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RleHQ7XG4gICAgICB9IC8vIHJlbW92ZSBleGlzdGluZyBjb250ZW50XG5cblxuICAgICAgdGhpcy5jbGVhcigpLmJ1aWxkKHRydWUpO1xuXG4gICAgICBpZiAodHlwZW9mIF90ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGNhbGwgYmxvY2tcbiAgICAgICAgX3RleHQuY2FsbCh0aGlzLCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN0b3JlIHRleHQgYW5kIG1ha2Ugc3VyZSB0ZXh0IGlzIG5vdCBibGFua1xuICAgICAgICBfdGV4dCA9IF90ZXh0LnNwbGl0KCdcXG4nKTsgLy8gYnVpbGQgbmV3IGxpbmVzXG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gX3RleHQubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIHRoaXMudHNwYW4oX3RleHRbal0pLm5ld0xpbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBkaXNhYmxlIGJ1aWxkIG1vZGUgYW5kIHJlYnVpbGQgbGluZXNcblxuXG4gICAgICByZXR1cm4gdGhpcy5idWlsZChmYWxzZSkucmVidWlsZCgpO1xuICAgIH0gLy8gU2V0IC8gZ2V0IGxlYWRpbmdcblxuICB9LCB7XG4gICAga2V5OiBcImxlYWRpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGVhZGluZyh2YWx1ZSkge1xuICAgICAgLy8gYWN0IGFzIGdldHRlclxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9tLmxlYWRpbmc7XG4gICAgICB9IC8vIGFjdCBhcyBzZXR0ZXJcblxuXG4gICAgICB0aGlzLmRvbS5sZWFkaW5nID0gbmV3IFNWR051bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5yZWJ1aWxkKCk7XG4gICAgfSAvLyBSZWJ1aWxkIGFwcGVhcmFuY2UgdHlwZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVidWlsZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWJ1aWxkKF9yZWJ1aWxkKSB7XG4gICAgICAvLyBzdG9yZSBuZXcgcmVidWlsZCBmbGFnIGlmIGdpdmVuXG4gICAgICBpZiAodHlwZW9mIF9yZWJ1aWxkID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhpcy5fcmVidWlsZCA9IF9yZWJ1aWxkO1xuICAgICAgfSAvLyBkZWZpbmUgcG9zaXRpb24gb2YgYWxsIGxpbmVzXG5cblxuICAgICAgaWYgKHRoaXMuX3JlYnVpbGQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYmxhbmtMaW5lT2Zmc2V0ID0gMDtcbiAgICAgICAgdmFyIGxlYWRpbmcgPSB0aGlzLmRvbS5sZWFkaW5nO1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBmb250U2l6ZSA9IGdsb2JhbHMud2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LXNpemUnKTtcbiAgICAgICAgICB2YXIgZHkgPSBsZWFkaW5nICogbmV3IFNWR051bWJlcihmb250U2l6ZSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5kb20ubmV3TGluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cigneCcsIHNlbGYuYXR0cigneCcpKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dCgpID09PSAnXFxuJykge1xuICAgICAgICAgICAgICBibGFua0xpbmVPZmZzZXQgKz0gZHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2R5JywgZHkgKyBibGFua0xpbmVPZmZzZXQpO1xuICAgICAgICAgICAgICBibGFua0xpbmVPZmZzZXQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmlyZSgncmVidWlsZCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIEVuYWJsZSAvIGRpc2FibGUgYnVpbGQgbW9kZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiYnVpbGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYnVpbGQoX2J1aWxkKSB7XG4gICAgICB0aGlzLl9idWlsZCA9ICEhX2J1aWxkO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBvdmVyd3JpdGUgbWV0aG9kIGZyb20gcGFyZW50IHRvIHNldCBkYXRhIHByb3Blcmx5XG5cbiAgfSwge1xuICAgIGtleTogXCJzZXREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERhdGEobykge1xuICAgICAgdGhpcy5kb20gPSBvO1xuICAgICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkdOdW1iZXIoby5sZWFkaW5nIHx8IDEuMyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVGV4dDtcbn0oU2hhcGUpO1xuZXh0ZW5kKFRleHQsIHRleHRhYmxlKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSB0ZXh0IGVsZW1lbnRcbiAgICB0ZXh0OiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBUZXh0KCkpLnRleHQodGV4dCk7XG4gICAgfSksXG4gICAgLy8gQ3JlYXRlIHBsYWluIHRleHQgZWxlbWVudFxuICAgIHBsYWluOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBUZXh0KCkpLnBsYWluKHRleHQpO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoVGV4dCwgJ1RleHQnKTtcblxudmFyIFRzcGFuID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfVGV4dCkge1xuICBfaW5oZXJpdHMoVHNwYW4sIF9UZXh0KTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gVHNwYW4obm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUc3Bhbik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFRzcGFuKS5jYWxsKHRoaXMsIG5vZGVPck5ldygndHNwYW4nLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIFNldCB0ZXh0IGNvbnRlbnRcblxuXG4gIF9jcmVhdGVDbGFzcyhUc3BhbiwgW3tcbiAgICBrZXk6IFwidGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXh0KF90ZXh0KSB7XG4gICAgICBpZiAoX3RleHQgPT0gbnVsbCkgcmV0dXJuIHRoaXMubm9kZS50ZXh0Q29udGVudCArICh0aGlzLmRvbS5uZXdMaW5lZCA/ICdcXG4nIDogJycpO1xuICAgICAgdHlwZW9mIF90ZXh0ID09PSAnZnVuY3Rpb24nID8gX3RleHQuY2FsbCh0aGlzLCB0aGlzKSA6IHRoaXMucGxhaW4oX3RleHQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBTaG9ydGN1dCBkeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZHhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHgoX2R4KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdkeCcsIF9keCk7XG4gICAgfSAvLyBTaG9ydGN1dCBkeVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHkoX2R5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdkeScsIF9keSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geChfeCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIF94KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwieVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB5KF95KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgX3kpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMueCh4KS55KHkpO1xuICAgIH0gLy8gQ3JlYXRlIG5ldyBsaW5lXG5cbiAgfSwge1xuICAgIGtleTogXCJuZXdMaW5lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5ld0xpbmUoKSB7XG4gICAgICAvLyBmZXRjaCB0ZXh0IHBhcmVudFxuICAgICAgdmFyIHQgPSB0aGlzLnBhcmVudChUZXh0KTsgLy8gbWFyayBuZXcgbGluZVxuXG4gICAgICB0aGlzLmRvbS5uZXdMaW5lZCA9IHRydWU7XG4gICAgICB2YXIgZm9udFNpemUgPSBnbG9iYWxzLndpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSkuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1zaXplJyk7XG4gICAgICB2YXIgZHkgPSB0LmRvbS5sZWFkaW5nICogbmV3IFNWR051bWJlcihmb250U2l6ZSk7IC8vIGFwcGx5IG5ldyBwb3NpdGlvblxuXG4gICAgICByZXR1cm4gdGhpcy5keShkeSkuYXR0cigneCcsIHQueCgpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVHNwYW47XG59KFRleHQpO1xuZXh0ZW5kKFRzcGFuLCB0ZXh0YWJsZSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBUc3Bhbjoge1xuICAgIHRzcGFuOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodGV4dCkge1xuICAgICAgdmFyIHRzcGFuID0gbmV3IFRzcGFuKCk7IC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcblxuICAgICAgaWYgKCF0aGlzLl9idWlsZCkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB9IC8vIGFkZCBuZXcgdHNwYW5cblxuXG4gICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodHNwYW4ubm9kZSk7XG4gICAgICByZXR1cm4gdHNwYW4udGV4dCh0ZXh0KTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFRzcGFuLCAnVHNwYW4nKTtcblxudmFyIENsaXBQYXRoID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhDbGlwUGF0aCwgX0NvbnRhaW5lcik7XG5cbiAgZnVuY3Rpb24gQ2xpcFBhdGgobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDbGlwUGF0aCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKENsaXBQYXRoKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnY2xpcFBhdGgnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIFVuY2xpcCBhbGwgY2xpcHBlZCBlbGVtZW50cyBhbmQgcmVtb3ZlIGl0c2VsZlxuXG5cbiAgX2NyZWF0ZUNsYXNzKENsaXBQYXRoLCBbe1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgLy8gdW5jbGlwIGFsbCB0YXJnZXRzXG4gICAgICB0aGlzLnRhcmdldHMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC51bmNsaXAoKTtcbiAgICAgIH0pOyAvLyByZW1vdmUgY2xpcFBhdGggZnJvbSBwYXJlbnRcblxuICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKENsaXBQYXRoLnByb3RvdHlwZSksIFwicmVtb3ZlXCIsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRhcmdldHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiBiYXNlRmluZCgnc3ZnIFtjbGlwLXBhdGgqPVwiJyArIHRoaXMuaWQoKSArICdcIl0nKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ2xpcFBhdGg7XG59KENvbnRhaW5lcik7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgY2xpcHBpbmcgZWxlbWVudFxuICAgIGNsaXA6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5wdXQobmV3IENsaXBQYXRoKCkpO1xuICAgIH0pXG4gIH0sXG4gIEVsZW1lbnQ6IHtcbiAgICAvLyBEaXN0cmlidXRlIGNsaXBQYXRoIHRvIHN2ZyBlbGVtZW50XG4gICAgY2xpcFdpdGg6IGZ1bmN0aW9uIGNsaXBXaXRoKGVsZW1lbnQpIHtcbiAgICAgIC8vIHVzZSBnaXZlbiBjbGlwIG9yIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBjbGlwcGVyID0gZWxlbWVudCBpbnN0YW5jZW9mIENsaXBQYXRoID8gZWxlbWVudCA6IHRoaXMucGFyZW50KCkuY2xpcCgpLmFkZChlbGVtZW50KTsgLy8gYXBwbHkgbWFza1xuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdjbGlwLXBhdGgnLCAndXJsKFwiIycgKyBjbGlwcGVyLmlkKCkgKyAnXCIpJyk7XG4gICAgfSxcbiAgICAvLyBVbmNsaXAgZWxlbWVudFxuICAgIHVuY2xpcDogZnVuY3Rpb24gdW5jbGlwKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignY2xpcC1wYXRoJywgbnVsbCk7XG4gICAgfSxcbiAgICBjbGlwcGVyOiBmdW5jdGlvbiBjbGlwcGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVmZXJlbmNlKCdjbGlwLXBhdGgnKTtcbiAgICB9XG4gIH1cbn0pO1xucmVnaXN0ZXIoQ2xpcFBhdGgsICdDbGlwUGF0aCcpO1xuXG52YXIgRm9yZWlnbk9iamVjdCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0VsZW1lbnQpIHtcbiAgX2luaGVyaXRzKEZvcmVpZ25PYmplY3QsIF9FbGVtZW50KTtcblxuICBmdW5jdGlvbiBGb3JlaWduT2JqZWN0KG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRm9yZWlnbk9iamVjdCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEZvcmVpZ25PYmplY3QpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdmb3JlaWduT2JqZWN0Jywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIHJldHVybiBGb3JlaWduT2JqZWN0O1xufShFbGVtZW50KTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIGZvcmVpZ25PYmplY3Q6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IEZvcmVpZ25PYmplY3QoKSkuc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKEZvcmVpZ25PYmplY3QsICdGb3JlaWduT2JqZWN0Jyk7XG5cbnZhciBHID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhHLCBfQ29udGFpbmVyKTtcblxuICBmdW5jdGlvbiBHKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRyk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEcpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdnJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhHLCBbe1xuICAgIGtleTogXCJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHgoX3gpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuYmJveCgpO1xuICAgICAgaWYgKF94ID09IG51bGwpIHJldHVybiBib3gueDtcbiAgICAgIHJldHVybiB0aGlzLm1vdmUoX3gsIGJveC55LCBib3gpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHkoX3kpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuYmJveCgpO1xuICAgICAgaWYgKF95ID09IG51bGwpIHJldHVybiBib3gueTtcbiAgICAgIHJldHVybiB0aGlzLm1vdmUoYm94LngsIF95LCBib3gpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoKSB7XG4gICAgICB2YXIgeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdGhpcy5iYm94KCk7XG4gICAgICB2YXIgZHggPSB4IC0gYm94Lng7XG4gICAgICB2YXIgZHkgPSB5IC0gYm94Lnk7XG4gICAgICByZXR1cm4gdGhpcy5kbW92ZShkeCwgZHkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkeFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkeChfZHgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRtb3ZlKF9keCwgMCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGR5KF9keSkge1xuICAgICAgcmV0dXJuIHRoaXMuZG1vdmUoMCwgX2R5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZG1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZG1vdmUoZHgsIGR5KSB7XG4gICAgICB0aGlzLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGkpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBjaGlsZHMgYmJveFxuICAgICAgICB2YXIgYmJveCA9IGNoaWxkLmJib3goKTsgLy8gR2V0IGNoaWxkcyBtYXRyaXhcblxuICAgICAgICB2YXIgbSA9IG5ldyBNYXRyaXgoY2hpbGQpOyAvLyBUcmFuc2xhdGUgY2hpbGRzIG1hdHJpeCBieSBhbW91bnQgYW5kXG4gICAgICAgIC8vIHRyYW5zZm9ybSBpdCBiYWNrIGludG8gcGFyZW50cyBzcGFjZVxuXG4gICAgICAgIHZhciBtYXRyaXggPSBtLnRyYW5zbGF0ZShkeCwgZHkpLnRyYW5zZm9ybShtLmludmVyc2UoKSk7IC8vIENhbGN1bGF0ZSBuZXcgeCBhbmQgeSBmcm9tIG9sZCBib3hcblxuICAgICAgICB2YXIgcCA9IG5ldyBQb2ludChiYm94LngsIGJib3gueSkudHJhbnNmb3JtKG1hdHJpeCk7IC8vIE1vdmUgZWxlbWVudFxuXG4gICAgICAgIGNoaWxkLm1vdmUocC54LCBwLnkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid2lkdGhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2lkdGgoX3dpZHRoKSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcbiAgICAgIGlmIChfd2lkdGggPT0gbnVsbCkgcmV0dXJuIGJveC53aWR0aDtcbiAgICAgIHJldHVybiB0aGlzLnNpemUoX3dpZHRoLCBib3guaGVpZ2h0LCBib3gpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoZWlnaHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGVpZ2h0KF9oZWlnaHQpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRoaXMuYmJveCgpO1xuICAgICAgaWYgKF9oZWlnaHQgPT0gbnVsbCkgcmV0dXJuIGJveC5oZWlnaHQ7XG4gICAgICByZXR1cm4gdGhpcy5zaXplKGJveC53aWR0aCwgX2hlaWdodCwgYm94KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRoaXMuYmJveCgpO1xuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQsIGJveCk7XG4gICAgICB2YXIgc2NhbGVYID0gcC53aWR0aCAvIGJveC53aWR0aDtcbiAgICAgIHZhciBzY2FsZVkgPSBwLmhlaWdodCAvIGJveC5oZWlnaHQ7XG4gICAgICB0aGlzLmNoaWxkcmVuKCkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGkpIHtcbiAgICAgICAgdmFyIG8gPSBuZXcgUG9pbnQoYm94KS50cmFuc2Zvcm0obmV3IE1hdHJpeChjaGlsZCkuaW52ZXJzZSgpKTtcbiAgICAgICAgY2hpbGQuc2NhbGUoc2NhbGVYLCBzY2FsZVksIG8ueCwgby55KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEc7XG59KENvbnRhaW5lcik7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgYSBncm91cCBlbGVtZW50XG4gICAgZ3JvdXA6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgRygpKTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKEcsICdHJyk7XG5cbnZhciBBID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhBLCBfQ29udGFpbmVyKTtcblxuICBmdW5jdGlvbiBBKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEEpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdhJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBMaW5rIHVybFxuXG5cbiAgX2NyZWF0ZUNsYXNzKEEsIFt7XG4gICAga2V5OiBcInRvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvKHVybCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaHJlZicsIHVybCwgeGxpbmspO1xuICAgIH0gLy8gTGluayB0YXJnZXQgYXR0cmlidXRlXG5cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFyZ2V0KF90YXJnZXQpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3RhcmdldCcsIF90YXJnZXQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBBO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGEgaHlwZXJsaW5rIGVsZW1lbnRcbiAgICBsaW5rOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodXJsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IEEoKSkudG8odXJsKTtcbiAgICB9KVxuICB9LFxuICBFbGVtZW50OiB7XG4gICAgLy8gQ3JlYXRlIGEgaHlwZXJsaW5rIGVsZW1lbnRcbiAgICBsaW5rVG86IGZ1bmN0aW9uIGxpbmtUbyh1cmwpIHtcbiAgICAgIHZhciBsaW5rID0gbmV3IEEoKTtcblxuICAgICAgaWYgKHR5cGVvZiB1cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdXJsLmNhbGwobGluaywgbGluayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5rLnRvKHVybCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnBhcmVudCgpLnB1dChsaW5rKS5wdXQodGhpcyk7XG4gICAgfVxuICB9XG59KTtcbnJlZ2lzdGVyKEEsICdBJyk7XG5cbnZhciBNYXNrID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udGFpbmVyKSB7XG4gIF9pbmhlcml0cyhNYXNrLCBfQ29udGFpbmVyKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gTWFzayhub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1hc2spO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihNYXNrKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnbWFzaycsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gVW5tYXNrIGFsbCBtYXNrZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcblxuXG4gIF9jcmVhdGVDbGFzcyhNYXNrLCBbe1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgLy8gdW5tYXNrIGFsbCB0YXJnZXRzXG4gICAgICB0aGlzLnRhcmdldHMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC51bm1hc2soKTtcbiAgICAgIH0pOyAvLyByZW1vdmUgbWFzayBmcm9tIHBhcmVudFxuXG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoTWFzay5wcm90b3R5cGUpLCBcInJlbW92ZVwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRhcmdldHMoKSB7XG4gICAgICByZXR1cm4gYmFzZUZpbmQoJ3N2ZyBbbWFzayo9XCInICsgdGhpcy5pZCgpICsgJ1wiXScpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNYXNrO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgbWFzazogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLnB1dChuZXcgTWFzaygpKTtcbiAgICB9KVxuICB9LFxuICBFbGVtZW50OiB7XG4gICAgLy8gRGlzdHJpYnV0ZSBtYXNrIHRvIHN2ZyBlbGVtZW50XG4gICAgbWFza1dpdGg6IGZ1bmN0aW9uIG1hc2tXaXRoKGVsZW1lbnQpIHtcbiAgICAgIC8vIHVzZSBnaXZlbiBtYXNrIG9yIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBtYXNrZXIgPSBlbGVtZW50IGluc3RhbmNlb2YgTWFzayA/IGVsZW1lbnQgOiB0aGlzLnBhcmVudCgpLm1hc2soKS5hZGQoZWxlbWVudCk7IC8vIGFwcGx5IG1hc2tcblxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignbWFzaycsICd1cmwoXCIjJyArIG1hc2tlci5pZCgpICsgJ1wiKScpO1xuICAgIH0sXG4gICAgLy8gVW5tYXNrIGVsZW1lbnRcbiAgICB1bm1hc2s6IGZ1bmN0aW9uIHVubWFzaygpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hc2snLCBudWxsKTtcbiAgICB9LFxuICAgIG1hc2tlcjogZnVuY3Rpb24gbWFza2VyKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVmZXJlbmNlKCdtYXNrJyk7XG4gICAgfVxuICB9XG59KTtcbnJlZ2lzdGVyKE1hc2ssICdNYXNrJyk7XG5cbmZ1bmN0aW9uIG93bktleXMkMyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCQyKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsgaWYgKGkgJSAyKSB7IG93bktleXMkMyhzb3VyY2UsIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSk7IH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHsgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTsgfSBlbHNlIHsgb3duS2V5cyQzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gY3NzUnVsZShzZWxlY3RvciwgcnVsZSkge1xuICBpZiAoIXNlbGVjdG9yKSByZXR1cm4gJyc7XG4gIGlmICghcnVsZSkgcmV0dXJuIHNlbGVjdG9yO1xuICB2YXIgcmV0ID0gc2VsZWN0b3IgKyAneyc7XG5cbiAgZm9yICh2YXIgaSBpbiBydWxlKSB7XG4gICAgcmV0ICs9IHVuQ2FtZWxDYXNlKGkpICsgJzonICsgcnVsZVtpXSArICc7JztcbiAgfVxuXG4gIHJldCArPSAnfSc7XG4gIHJldHVybiByZXQ7XG59XG5cbnZhciBTdHlsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0VsZW1lbnQpIHtcbiAgX2luaGVyaXRzKFN0eWxlLCBfRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gU3R5bGUobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdHlsZSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFN0eWxlKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnc3R5bGUnLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFN0eWxlLCBbe1xuICAgIGtleTogXCJhZGRUZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFRleHQoKSB7XG4gICAgICB2YXIgdyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgICB0aGlzLm5vZGUudGV4dENvbnRlbnQgKz0gdztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmb250XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvbnQobmFtZSwgc3JjKSB7XG4gICAgICB2YXIgcGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGUoJ0Bmb250LWZhY2UnLCBfb2JqZWN0U3ByZWFkJDIoe1xuICAgICAgICBmb250RmFtaWx5OiBuYW1lLFxuICAgICAgICBzcmM6IHNyY1xuICAgICAgfSwgcGFyYW1zKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJ1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcnVsZShzZWxlY3Rvciwgb2JqKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRUZXh0KGNzc1J1bGUoc2VsZWN0b3IsIG9iaikpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdHlsZTtcbn0oRWxlbWVudCk7XG5yZWdpc3Rlck1ldGhvZHMoJ0RvbScsIHtcbiAgc3R5bGU6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uIChzZWxlY3Rvciwgb2JqKSB7XG4gICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTdHlsZSgpKS5ydWxlKHNlbGVjdG9yLCBvYmopO1xuICB9KSxcbiAgZm9udGZhY2U6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uIChuYW1lLCBzcmMsIHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLnB1dChuZXcgU3R5bGUoKSkuZm9udChuYW1lLCBzcmMsIHBhcmFtcyk7XG4gIH0pXG59KTtcbnJlZ2lzdGVyKFN0eWxlLCAnU3R5bGUnKTtcblxudmFyIFRleHRQYXRoID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfVGV4dCkge1xuICBfaW5oZXJpdHMoVGV4dFBhdGgsIF9UZXh0KTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gVGV4dFBhdGgobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUZXh0UGF0aCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFRleHRQYXRoKS5jYWxsKHRoaXMsIG5vZGVPck5ldygndGV4dFBhdGgnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIHJldHVybiB0aGUgYXJyYXkgb2YgdGhlIHBhdGggdHJhY2sgZWxlbWVudFxuXG5cbiAgX2NyZWF0ZUNsYXNzKFRleHRQYXRoLCBbe1xuICAgIGtleTogXCJhcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcnJheSgpIHtcbiAgICAgIHZhciB0cmFjayA9IHRoaXMudHJhY2soKTtcbiAgICAgIHJldHVybiB0cmFjayA/IHRyYWNrLmFycmF5KCkgOiBudWxsO1xuICAgIH0gLy8gUGxvdCBwYXRoIGlmIGFueVxuXG4gIH0sIHtcbiAgICBrZXk6IFwicGxvdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwbG90KGQpIHtcbiAgICAgIHZhciB0cmFjayA9IHRoaXMudHJhY2soKTtcbiAgICAgIHZhciBwYXRoQXJyYXkgPSBudWxsO1xuXG4gICAgICBpZiAodHJhY2spIHtcbiAgICAgICAgcGF0aEFycmF5ID0gdHJhY2sucGxvdChkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGQgPT0gbnVsbCA/IHBhdGhBcnJheSA6IHRoaXM7XG4gICAgfSAvLyBHZXQgdGhlIHBhdGggZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwidHJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhY2soKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2UoJ2hyZWYnKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVGV4dFBhdGg7XG59KFRleHQpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgdGV4dFBhdGg6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh0ZXh0LCBwYXRoKSB7XG4gICAgICAvLyBDb252ZXJ0IHRleHQgdG8gaW5zdGFuY2UgaWYgbmVlZGVkXG4gICAgICBpZiAoISh0ZXh0IGluc3RhbmNlb2YgVGV4dCkpIHtcbiAgICAgICAgdGV4dCA9IHRoaXMudGV4dCh0ZXh0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRleHQucGF0aChwYXRoKTtcbiAgICB9KVxuICB9LFxuICBUZXh0OiB7XG4gICAgLy8gQ3JlYXRlIHBhdGggZm9yIHRleHQgdG8gcnVuIG9uXG4gICAgcGF0aDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHRyYWNrKSB7XG4gICAgICB2YXIgaW1wb3J0Tm9kZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHRydWU7XG4gICAgICB2YXIgdGV4dFBhdGggPSBuZXcgVGV4dFBhdGgoKTsgLy8gaWYgdHJhY2sgaXMgYSBwYXRoLCByZXVzZSBpdFxuXG4gICAgICBpZiAoISh0cmFjayBpbnN0YW5jZW9mIFBhdGgpKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBwYXRoIGVsZW1lbnRcbiAgICAgICAgdHJhY2sgPSB0aGlzLmRlZnMoKS5wYXRoKHRyYWNrKTtcbiAgICAgIH0gLy8gbGluayB0ZXh0UGF0aCB0byBwYXRoIGFuZCBhZGQgY29udGVudFxuXG5cbiAgICAgIHRleHRQYXRoLmF0dHIoJ2hyZWYnLCAnIycgKyB0cmFjaywgeGxpbmspOyAvLyBUcmFuc3BsYW50IGFsbCBub2RlcyBmcm9tIHRleHQgdG8gdGV4dFBhdGhcblxuICAgICAgdmFyIG5vZGU7XG5cbiAgICAgIGlmIChpbXBvcnROb2Rlcykge1xuICAgICAgICB3aGlsZSAobm9kZSA9IHRoaXMubm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGV4dFBhdGgubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBhZGQgdGV4dFBhdGggZWxlbWVudCBhcyBjaGlsZCBub2RlIGFuZCByZXR1cm4gdGV4dFBhdGhcblxuXG4gICAgICByZXR1cm4gdGhpcy5wdXQodGV4dFBhdGgpO1xuICAgIH0pLFxuICAgIC8vIEdldCB0aGUgdGV4dFBhdGggY2hpbGRyZW5cbiAgICB0ZXh0UGF0aDogZnVuY3Rpb24gdGV4dFBhdGgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kT25lKCd0ZXh0UGF0aCcpO1xuICAgIH1cbiAgfSxcbiAgUGF0aDoge1xuICAgIC8vIGNyZWF0ZXMgYSB0ZXh0UGF0aCBmcm9tIHRoaXMgcGF0aFxuICAgIHRleHQ6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAvLyBDb252ZXJ0IHRleHQgdG8gaW5zdGFuY2UgaWYgbmVlZGVkXG4gICAgICBpZiAoISh0ZXh0IGluc3RhbmNlb2YgVGV4dCkpIHtcbiAgICAgICAgdGV4dCA9IG5ldyBUZXh0KCkuYWRkVG8odGhpcy5wYXJlbnQoKSkudGV4dCh0ZXh0KTtcbiAgICAgIH0gLy8gQ3JlYXRlIHRleHRQYXRoIGZyb20gdGV4dCBhbmQgcGF0aCBhbmQgcmV0dXJuXG5cblxuICAgICAgcmV0dXJuIHRleHQucGF0aCh0aGlzKTtcbiAgICB9KSxcbiAgICB0YXJnZXRzOiBmdW5jdGlvbiB0YXJnZXRzKCkge1xuICAgICAgcmV0dXJuIGJhc2VGaW5kKCdzdmcgW2hyZWYqPVwiJyArIHRoaXMuaWQoKSArICdcIl0nKTtcbiAgICB9XG4gIH1cbn0pO1xuVGV4dFBhdGgucHJvdG90eXBlLk1vcnBoQXJyYXkgPSBQYXRoQXJyYXk7XG5yZWdpc3RlcihUZXh0UGF0aCwgJ1RleHRQYXRoJyk7XG5cbnZhciBVc2UgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoVXNlLCBfU2hhcGUpO1xuXG4gIGZ1bmN0aW9uIFVzZShub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFVzZSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFVzZSkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3VzZScsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gVXNlIGVsZW1lbnQgYXMgYSByZWZlcmVuY2VcblxuXG4gIF9jcmVhdGVDbGFzcyhVc2UsIFt7XG4gICAga2V5OiBcImVsZW1lbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZWxlbWVudChfZWxlbWVudCwgZmlsZSkge1xuICAgICAgLy8gU2V0IGxpbmVkIGVsZW1lbnRcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2hyZWYnLCAoZmlsZSB8fCAnJykgKyAnIycgKyBfZWxlbWVudCwgeGxpbmspO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBVc2U7XG59KFNoYXBlKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIHVzZSBlbGVtZW50XG4gICAgdXNlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoZWxlbWVudCwgZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBVc2UoKSkuZWxlbWVudChlbGVtZW50LCBmaWxlKTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFVzZSwgJ1VzZScpO1xuXG4vKiBPcHRpb25hbCBNb2R1bGVzICovXG52YXIgU1ZHID0gbWFrZUluc3RhbmNlO1xuZXh0ZW5kKFtTdmcsIF9TeW1ib2wsIEltYWdlLCBQYXR0ZXJuLCBNYXJrZXJdLCBnZXRNZXRob2RzRm9yKCd2aWV3Ym94JykpO1xuZXh0ZW5kKFtMaW5lLCBQb2x5bGluZSwgUG9seWdvbiwgUGF0aF0sIGdldE1ldGhvZHNGb3IoJ21hcmtlcicpKTtcbmV4dGVuZChUZXh0LCBnZXRNZXRob2RzRm9yKCdUZXh0JykpO1xuZXh0ZW5kKFBhdGgsIGdldE1ldGhvZHNGb3IoJ1BhdGgnKSk7XG5leHRlbmQoRGVmcywgZ2V0TWV0aG9kc0ZvcignRGVmcycpKTtcbmV4dGVuZChbVGV4dCwgVHNwYW5dLCBnZXRNZXRob2RzRm9yKCdUc3BhbicpKTtcbmV4dGVuZChbUmVjdCwgRWxsaXBzZSwgQ2lyY2xlLCBHcmFkaWVudF0sIGdldE1ldGhvZHNGb3IoJ3JhZGl1cycpKTtcbmV4dGVuZChFdmVudFRhcmdldCwgZ2V0TWV0aG9kc0ZvcignRXZlbnRUYXJnZXQnKSk7XG5leHRlbmQoRG9tLCBnZXRNZXRob2RzRm9yKCdEb20nKSk7XG5leHRlbmQoRWxlbWVudCwgZ2V0TWV0aG9kc0ZvcignRWxlbWVudCcpKTtcbmV4dGVuZChTaGFwZSwgZ2V0TWV0aG9kc0ZvcignU2hhcGUnKSk7IC8vIGV4dGVuZChFbGVtZW50LCBnZXRDb25zdHJ1Y3RvcignTWVtb3J5JykpXG5cbmV4dGVuZChDb250YWluZXIsIGdldE1ldGhvZHNGb3IoJ0NvbnRhaW5lcicpKTtcbmV4dGVuZChSdW5uZXIsIGdldE1ldGhvZHNGb3IoJ1J1bm5lcicpKTtcbkxpc3QuZXh0ZW5kKGdldE1ldGhvZE5hbWVzKCkpO1xucmVnaXN0ZXJNb3JwaGFibGVUeXBlKFtTVkdOdW1iZXIsIENvbG9yLCBCb3gsIE1hdHJpeCwgU1ZHQXJyYXksIFBvaW50QXJyYXksIFBhdGhBcnJheV0pO1xubWFrZU1vcnBoYWJsZSgpO1xuXG5leHBvcnQgeyBBLCBBbmltYXRvciwgU1ZHQXJyYXkgYXMgQXJyYXksIEJveCwgQ2lyY2xlLCBDbGlwUGF0aCwgQ29sb3IsIENvbnRhaW5lciwgQ29udHJvbGxlciwgRGVmcywgRG9tLCBFYXNlLCBFbGVtZW50LCBFbGxpcHNlLCBFdmVudFRhcmdldCwgRm9yZWlnbk9iamVjdCwgRywgR3JhZGllbnQsIEltYWdlLCBMaW5lLCBMaXN0LCBNYXJrZXIsIE1hc2ssIE1hdHJpeCwgTW9ycGhhYmxlLCBOb25Nb3JwaGFibGUsIFNWR051bWJlciBhcyBOdW1iZXIsIE9iamVjdEJhZywgUElELCBQYXRoLCBQYXRoQXJyYXksIFBhdHRlcm4sIFBvaW50LCBQb2ludEFycmF5LCBQb2x5Z29uLCBQb2x5bGluZSwgUXVldWUsIFJlY3QsIFJ1bm5lciwgU1ZHLCBTaGFwZSwgU3ByaW5nLCBTdG9wLCBTdHlsZSwgU3ZnLCBfU3ltYm9sIGFzIFN5bWJvbCwgVGV4dCwgVGV4dFBhdGgsIFRpbWVsaW5lLCBUcmFuc2Zvcm1CYWcsIFRzcGFuLCBVc2UsIGFkb3B0LCBhc3NpZ25OZXdJZCwgY3JlYXRlLCBkZWZhdWx0cywgZGlzcGF0Y2gsIGVhc2luZywgZWlkLCBleHRlbmQsIGJhc2VGaW5kIGFzIGZpbmQsIGdldENsYXNzLCBpbnZlbnQsIG1ha2VJbnN0YW5jZSwgbWFrZU1vcnBoYWJsZSwgbW9ja0Fkb3B0LCBuYW1lc3BhY2VzLCBub2RlT3JOZXcsIG9mZiwgb24sIHBhcnNlciwgcmVnZXgsIHJlZ2lzdGVyLCByZWdpc3Rlck1vcnBoYWJsZVR5cGUsIHJlZ2lzdGVyV2luZG93LCByb290LCB1dGlscywgd3JhcFdpdGhBdHRyQ2hlY2sgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN2Zy5lc20uanMubWFwXG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9saWIvZ2FtZVwiO1xuaW1wb3J0ICogYXMgX1NWRyBmcm9tIFwiQHN2Z2RvdGpzL3N2Zy5qc1wiOyBcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4vbGliL3Nwcml0ZUxvYWRlclwiO1xuXG5jb25zdCBzcHJpdGVMb2FkZXIgPSBuZXcgU3ByaXRlTG9hZGVyKCk7XG5cbnNwcml0ZUxvYWRlci5sb2FkQWxsU3ByaXRlcygpLnRoZW4oKCk9PntcbiAgICBuZXcgR2FtZShcIiNjb2RpbmdBcmVhXCIpO1xufSkuY2F0Y2goKCk9PntcbiAgICBjb25zb2xlLndhcm4oXCJFcnJvciBsb2FkaW5nIHNwcml0ZXMhXCIpO1xufSk7IiwiaW1wb3J0ICogYXMgc3ZnIGZyb20gXCJAc3ZnZG90anMvc3ZnLmpzXCI7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCI7XG5pbXBvcnQgVmVjdG9yMiBmcm9tIFwiLi4vdXRpbC92ZWN0b3IyXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vZ2FtZVwiO1xuaW1wb3J0IFwiQHN2Z2RvdGpzL3N2Zy5kcmFnZ2FibGUuanNcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4uL3Nwcml0ZUxvYWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9ja3tcblx0c3ZnRzogc3ZnLkc7XG5cdHN2Z0M6IHN2Zy5Tdmc7XG5cdGlucHV0czogQXJyYXk8Q29ubmVjdGlvbj47XG5cdG91dHB1dHM6IEFycmF5PENvbm5lY3Rpb24+O1xuXHRnYW1lOiBHYW1lO1xuXHRkcmFnZ2FibGU6IGJvb2xlYW47XG5cdGRyYWdnYWJsZURlZmF1bHQ6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3Ioc3ZnQzogc3ZnLlN2ZywgZ2FtZTogR2FtZSwgZHJhZ2dhYmxlOiBib29sZWFuID0gdHJ1ZSl7XG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcblxuXHRcdHRoaXMuc3ZnQyA9IHN2Z0M7XG5cdFx0dGhpcy5zdmdHID0gdGhpcy5zdmdDLmdyb3VwKCk7XG5cblx0XHR0aGlzLmlucHV0cyA9IFtdO1xuXHRcdHRoaXMub3V0cHV0cyA9IFtdO1xuXG5cdFx0dGhpcy5kcmFnZ2FibGUgPSBkcmFnZ2FibGU7XG5cdFx0dGhpcy5kcmFnZ2FibGVEZWZhdWx0ID0gZHJhZ2dhYmxlO1xuXHRcdHRoaXMuc3ZnRy5kcmFnZ2FibGUoZHJhZ2dhYmxlKTtcblxuXHRcdHRoaXMuc3ZnRy5vbihcImRyYWdtb3ZlLm5hbWVzcGFjZVwiLCAoZTpDdXN0b21FdmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgYm94ID0gZS5kZXRhaWwuYm94O1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5zdmdHLnRyYW5zbGF0ZShib3gueCwgYm94LnkpO1xuXG5cdFx0XHQvLyBVcGRhdGUgd2lyZXNcblxuXHRcdFx0Zm9yKGxldCBpbnB1dCBvZiB0aGlzLmlucHV0cyl7XG5cdFx0XHRcdGlmKGlucHV0LndpcmUgIT09IG51bGwpIGlucHV0LndpcmUudXBkYXRlTGluZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IobGV0IG91dHB1dCBvZiB0aGlzLm91dHB1dHMpe1xuXHRcdFx0XHRpZihvdXRwdXQud2lyZSAhPT0gbnVsbCkgb3V0cHV0LndpcmUudXBkYXRlTGluZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBCbG9ja3tcblx0XHRpZihjdXN0b21TdmcgPT09IG51bGwpe1xuXHRcdFx0dGhpcy5zdmdHLnJlY3QoMjAwLCAxMDApLmF0dHIoe2NsYXNzOiBcImRlZmF1bHRCbG9ja1wifSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR0aGlzLnN2Z0cuc3ZnKGN1c3RvbVN2Zyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhZGRDb25uZWN0aW9uKHR5cGU6IG51bWJlcik6IEJsb2Nre1xuXHRcdGNvbnN0IG5ld0NvbiA9IG5ldyBDb25uZWN0aW9uKHRoaXMsIHR5cGUpO1xuXG5cdFx0aWYodHlwZSA9PT0gMCl7XG5cdFx0XHRuZXdDb24uZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImNvbm5lY3Rpb25JbnB1dFwiXSk7XG5cdFx0XHRuZXdDb24uc2V0UG9zKG5ldyBWZWN0b3IyKDAsIHRoaXMuaW5wdXRzLmxlbmd0aCAqIDMwICsgNSkpO1xuXG5cdFx0XHR0aGlzLmlucHV0cy5wdXNoKG5ld0Nvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYodHlwZSA9PT0gMSl7XG5cdFx0XHRuZXdDb24uZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImNvbm5lY3Rpb25PdXRwdXRcIl0pO1xuXHRcdFx0bmV3Q29uLnNldFBvcyhuZXcgVmVjdG9yMigxNzUsIHRoaXMub3V0cHV0cy5sZW5ndGggKiAzMCArIDUpKTtcblxuXHRcdFx0dGhpcy5vdXRwdXRzLnB1c2gobmV3Q29uKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldFBvcyhwb3M6IFZlY3RvcjIpOiBCbG9ja3tcblx0XHR0aGlzLnN2Z0cudHJhbnNsYXRlKHBvcy54LCBwb3MueSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldERyYWdnYWJsZShpc0RyYWdnYWJsZTogYm9vbGVhbik6IEJsb2Nre1xuXHRcdHRoaXMuZHJhZ2dhYmxlID0gaXNEcmFnZ2FibGU7XG5cdFx0dGhpcy5zdmdHLmRyYWdnYWJsZShpc0RyYWdnYWJsZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHJlc2V0RHJhZ2dhYmxlKCk6IEJsb2NreyAvLyBTZXRzIGRyYWdnYWJsZSB0byBkZWZhdWx0IHZhbHVlXG5cdFx0dGhpcy5zZXREcmFnZ2FibGUodGhpcy5kcmFnZ2FibGVEZWZhdWx0KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHdvcmsoKTogdm9pZCB7IC8vIFRoZSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBpbnB1dHMvb3V0cHV0cyBldmVyeSBjeWNsZVxuXHRcdGNvbnN0IGlucHV0VmFsdWVzOiBBcnJheTxudW1iZXI+ID0gdGhpcy5pbnB1dHMubWFwKChpbnB1dDogQ29ubmVjdGlvbik9PmlucHV0LnZhbHVlKTtcblxuXHRcdHRoaXMub3V0cHV0c1swXS5zZW5kKHRoaXMudmFsdWVNb2RpZmllcihpbnB1dFZhbHVlcykpO1xuXHRcdFxuXHRcdGZvcihsZXQgaW5wdXQgb2YgdGhpcy5pbnB1dHMpe1xuXHRcdFx0aW5wdXQudmFsdWUgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhbHVlTW9kaWZpZXIodmFsdWVzOiBBcnJheTxudW1iZXI+KTogbnVtYmVye1xuXHRcdGNvbnNvbGUud2FybihcIlZhbHVlIG1vZGlmaWVyIGZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZCFcIik7XG5cblx0XHRyZXR1cm4gdmFsdWVzWzBdOyAvLyBSZXR1cm4gZmlyc3QgdmFsdWUgYnkgZGVmYXVsdFxuXHR9XG59IiwiaW1wb3J0IEJsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBXaXJlR2hvc3QgZnJvbSBcIi4vd2lyZUdob3N0XCI7XG5pbXBvcnQgV2lyZSBmcm9tIFwiLi93aXJlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuXHR0eXBlOiBudW1iZXI7IC8vIElzIHRoZSBjb25uZWN0aW9uIGFuIGlucHV0ICgwKSBvciBvdXRwdXQgKDEpXG5cdHBhcmVudDogQmxvY2s7XG5cdHN2Zzogc3ZnLkc7XG5cdHdpcmU6IFdpcmU7XG5cdHZhbHVlOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocGFyZW50OiBCbG9jaywgdHlwZTogbnVtYmVyKXtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHRcdHRoaXMuc3ZnID0gdGhpcy5wYXJlbnQuc3ZnRy5ncm91cCgpO1xuXHRcdHRoaXMud2lyZSA9IG51bGw7XG5cdFx0dGhpcy52YWx1ZSA9IG51bGw7XG5cblx0XHR0aGlzLnN2Zy5yZW1lbWJlcihcImNvbm5lY3Rpb25cIiwgdGhpcyk7XG5cblx0XHR0aGlzLnN2Zy5vbihcIm1vdXNlZG93blwiLCAoZXZlbnQ6TW91c2VFdmVudCkgPT4ge1xuXHRcdFx0Ly8gSWYgbW91c2UgZG93biwgY3JlYXRlIGEgd2lyZSBnaG9zdFxuXG5cdFx0XHRpZih0aGlzLndpcmUgIT09IG51bGwpIHRoaXMud2lyZS5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5wYXJlbnQuZ2FtZS5hY3RpdmVXaXJlR2hvc3QgPSBuZXcgV2lyZUdob3N0KHRoaXMuc3ZnLnJvb3QoKSwgdGhpcyk7XG5cdFx0XHR0aGlzLnBhcmVudC5zZXREcmFnZ2FibGUoZmFsc2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBDb25uZWN0aW9ueyAvLyBEcmF3IHRoZSBjb25uZWN0aW9uXG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnLnJlY3QoMjUsMjUpLmF0dHIoe2NsYXNzOiBcImRlZmF1bHRDb25uZWN0aW9uIHVzZWFibGVcIiwgdHlwZTogdGhpcy50eXBlLnRvU3RyaW5nKCksIGJsb2NrQ29ubmVjdGlvbjogXCJibG9ja0Nvbm5lY3Rpb25cIn0pO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0dGhpcy5zdmcuc3ZnKGN1c3RvbVN2ZykuYXR0cih7Y2xhc3M6IFwidXNlYWJsZVwiLCB0eXBlOiB0aGlzLnR5cGUudG9TdHJpbmcoKSwgYmxvY2tDb25uZWN0aW9uOiBcImJsb2NrQ29ubmVjdGlvblwifSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzZXRQb3MocG9zOiBWZWN0b3IyKTogQ29ubmVjdGlvbntcblx0XHR0aGlzLnN2Zy50cmFuc2xhdGUocG9zLngsIHBvcy55KTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHJlY2VpdmUodmFsdWU6IG51bWJlcik6IENvbm5lY3Rpb257XG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYodGhpcy5wYXJlbnQuaW5wdXRzLmV2ZXJ5KChpbnB1dDogQ29ubmVjdGlvbikgPT4gaW5wdXQudmFsdWUgIT09IG51bGwpKXsgLy8gQ2hlY2sgaWYgdGhlIGJsb2NrIGhhcyByZWNlaXZlZCBhbGwgaXRzIGlucHV0IHZhbHVlc1xuXHRcdFx0dGhpcy5wYXJlbnQud29yaygpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2VuZCh2YWx1ZTogbnVtYmVyKTogQ29ubmVjdGlvbntcblx0XHRpZih0aGlzLndpcmUgIT09IG51bGwpIHRoaXMud2lyZS5icm9hZGNhc3QodmFsdWUpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4uL3Nwcml0ZUxvYWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIEJsb2Nre1xuXHR2YWx1ZTogbnVtYmVyO1xuXHRvdXRwdXQ6IENvbm5lY3Rpb247XG5cblx0Y29uc3RydWN0b3Ioc3ZnQ29udDogc3ZnLlN2ZywgZ2FtZTogR2FtZSwgaW5pdFZhbDogbnVtYmVyID0gMSl7XG5cdFx0c3VwZXIoc3ZnQ29udCwgZ2FtZSwgZmFsc2UpO1xuXHRcdHRoaXMudmFsdWUgPSBpbml0VmFsO1xuXG5cdFx0dGhpcy5vdXRwdXQgPSBuZXcgQ29ubmVjdGlvbih0aGlzLCAxKTtcblx0fVxuXG5cdGRyYXcoY3VzdG9tU3ZnOiBzdHJpbmcgPSBudWxsKTogSW5wdXR7XG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnRy5yZWN0KDUwLCA1MCkuYXR0cih7Y2xhc3M6IFwiY3ljbGVJbnB1dCB1c2VhYmxlXCJ9KTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHRoaXMuc3ZnRy5zdmcoY3VzdG9tU3ZnKTtcblx0XHR9XHRcblxuXHRcdHRoaXMub3V0cHV0LmRyYXcoU3ByaXRlTG9hZGVyLnNwcml0ZXNbXCJjb25uZWN0aW9uT3V0cHV0XCJdKTtcblx0XHR0aGlzLm91dHB1dC5zZXRQb3MobmV3IFZlY3RvcjIoMTIuNSwgMTIuNSkpO1xuXHRcdHRoaXMub3V0cHV0LnN2Zy5mb3J3YXJkKCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGFkZENvbm5lY3Rpb24oKTogSW5wdXR7XG5cdFx0Y29uc29sZS53YXJuKFwiUHJvcGVydHkgbm90IHVzZWQgaW4gSW5wdXQgb2JqZWN0XCIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0d29yaygpOiBJbnB1dHtcblx0XHRpZih0aGlzLm91dHB1dC53aXJlICE9PSBudWxsKXtcblx0XHRcdHRoaXMub3V0cHV0LnNlbmQodGhpcy52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4uL3Nwcml0ZUxvYWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBCbG9ja3tcblx0dmFsdWU6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcihzdmdDb250OiBzdmcuU3ZnLCBnYW1lOiBHYW1lLCBpbml0VmFsOiBudW1iZXIgPSAwKXtcblx0XHRzdXBlcihzdmdDb250LCBnYW1lLCBmYWxzZSk7XG5cdFx0dGhpcy52YWx1ZSA9IGluaXRWYWw7XG5cblx0XHR0aGlzLmlucHV0c1swXSA9IG5ldyBDb25uZWN0aW9uKHRoaXMsIDApO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBPdXRwdXR7XG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnRy5yZWN0KDUwLCA1MCkuYXR0cih7Y2xhc3M6IFwiY3ljbGVPdXRwdXQgdXNlYWJsZVwifSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR0aGlzLnN2Z0cuc3ZnKGN1c3RvbVN2Zyk7XG5cdFx0fVx0XG5cblx0XHR0aGlzLmlucHV0c1swXS5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiY29ubmVjdGlvbklucHV0XCJdKTtcblx0XHR0aGlzLmlucHV0c1swXS5zZXRQb3MobmV3IFZlY3RvcjIoMTIuNSwgMTIuNSkpO1xuXHRcdHRoaXMuaW5wdXRzWzBdLnN2Zy5mb3J3YXJkKCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGFkZENvbm5lY3Rpb24oKTogT3V0cHV0e1xuXHRcdGNvbnNvbGUud2FybihcIlByb3BlcnR5IG5vdCB1c2VkIGluIE91dHB1dCBvYmplY3RcIik7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR3b3JrKCk6IE91dHB1dHtcblx0XHR0aGlzLmdhbWUuc2NhbUNvaW4gKz0gdGhpcy5pbnB1dHNbMF0udmFsdWU7XG5cdFx0dGhpcy5nYW1lLnVwZGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgQ29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCB7IGdldFNWR1BvcyB9IGZyb20gXCIuLi91dGlsL3N2Z1V0aWxcIjtcbmltcG9ydCB7IGdldEZpcnN0RWxlbWVudFdpdGhQcm9wZXJ0eSB9IGZyb20gXCIuLi91dGlsL2RvbVV0aWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2lyZXtcblx0aW5wdXQ6IENvbm5lY3Rpb247XG5cdG91dHB1dDogQ29ubmVjdGlvbjtcblx0c3ZnRzogc3ZnLkc7XG5cdHN2Z0xpbmU6IHN2Zy5MaW5lO1xuXG5cdGNvbnN0cnVjdG9yKGlucHV0OiBDb25uZWN0aW9uLCBvdXRwdXQ6IENvbm5lY3Rpb24sIHN2Z0M6IHN2Zy5Tdmcpe1xuXHRcdHRoaXMuaW5wdXQgPSBpbnB1dDtcblx0XHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuXHRcdHRoaXMuaW5wdXQud2lyZSA9IHRoaXM7XG5cdFx0dGhpcy5vdXRwdXQud2lyZSA9IHRoaXM7XG5cblx0XHR0aGlzLnN2Z0cgPSBzdmdDLmdyb3VwKCk7XG5cblx0XHR0aGlzLnN2Z0cub24oXCJtb3VzZWRvd25cIiwgKGV2ZW50OiBNb3VzZUV2ZW50KT0+eyAvLyBDaGVjayBpZiBjbGljayB3YXMgbWVhbnQgZm9yIGNvbm5lY3Rpb25cblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IGVsQmVuZWF0aDpzdmcuRyA9IGdldEZpcnN0RWxlbWVudFdpdGhQcm9wZXJ0eShkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChldmVudC54LCBldmVudC55KVsxXSwgXCJibG9ja0Nvbm5lY3Rpb25cIiwgXCJibG9ja0Nvbm5lY3Rpb25cIikuaW5zdGFuY2U7IC8vZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQueCwgZXZlbnQueSlbMV0uaW5zdGFuY2UucGFyZW50KCk7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uOiBDb25uZWN0aW9uID0gZWxCZW5lYXRoLnJlbWVtYmVyKFwiY29ubmVjdGlvblwiKTtcblxuXHRcdFx0aWYoY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0aWYoY29ubmVjdGlvbiA9PT0gdGhpcy5pbnB1dCB8fCBjb25uZWN0aW9uID09PSB0aGlzLm91dHB1dCl7XG5cdFx0XHRcdFx0Y29ubmVjdGlvbi5zdmcuZmlyZShcIm1vdXNlZG93blwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZHJhdygpOiBXaXJleyAvLyBEcmF3IHRoZSBjb25uZWN0aW9uXG5cdFx0Y29uc3QgaW5wdXRQb3MgPSBnZXRTVkdQb3ModGhpcy5pbnB1dC5zdmcsIHRydWUpO1xuXHRcdGNvbnN0IG91dHB1dFBvcyA9IGdldFNWR1Bvcyh0aGlzLm91dHB1dC5zdmcsIHRydWUpO1xuXG5cdFx0dGhpcy5zdmdMaW5lID0gdGhpcy5zdmdHLmxpbmUoaW5wdXRQb3MueCwgaW5wdXRQb3MueSwgb3V0cHV0UG9zLngsIG91dHB1dFBvcy55KS5zdHJva2UoeyBjb2xvcjogJyNGRjc3MDAnLCB3aWR0aDogMTUsIGxpbmVjYXA6ICdyb3VuZCcgfSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHVwZGF0ZUxpbmUoKTogV2lyZXtcblx0XHRjb25zdCBpbnB1dFBvcyA9IGdldFNWR1Bvcyh0aGlzLmlucHV0LnN2ZywgdHJ1ZSk7XG5cdFx0Y29uc3Qgb3V0cHV0UG9zID0gZ2V0U1ZHUG9zKHRoaXMub3V0cHV0LnN2ZywgdHJ1ZSk7XG5cblx0XHR0aGlzLnN2Z0xpbmUucGxvdChpbnB1dFBvcy54LCBpbnB1dFBvcy55LCBvdXRwdXRQb3MueCwgb3V0cHV0UG9zLnkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRyZW1vdmUoKTogdm9pZHsgLy8gRGVsZXRlcyB3aXJlXG5cdFx0dGhpcy5zdmdHLnJlbW92ZSgpO1xuXHRcdHRoaXMuaW5wdXQud2lyZSA9IG51bGw7XG5cdFx0dGhpcy5vdXRwdXQud2lyZSA9IG51bGw7XG5cdH1cblxuXHRicm9hZGNhc3QodmFsdWU6IG51bWJlcik6IFdpcmV7XG5cdFx0dGhpcy5pbnB1dC5yZWNlaXZlKHZhbHVlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59IiwiaW1wb3J0ICogYXMgc3ZnIGZyb20gXCJAc3ZnZG90anMvc3ZnLmpzXCI7XG5pbXBvcnQgVmVjdG9yMiBmcm9tIFwiLi4vdXRpbC92ZWN0b3IyXCI7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRTVkdQb3MgfSBmcm9tIFwiLi4vdXRpbC9zdmdVdGlsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpcmVHaG9zdHtcblx0c3ZnOiBzdmcuTGluZTtcblx0cDA6IFZlY3RvcjI7XG5cdGMwOiBDb25uZWN0aW9uO1xuXG5cdGNvbnN0cnVjdG9yKHN2Z0NvbnQ6IHN2Zy5TdmcsIGMwOiBDb25uZWN0aW9uKXtcblx0XHR0aGlzLnAwID0gZ2V0U1ZHUG9zKGMwLnN2ZywgdHJ1ZSk7XG5cblx0XHQvLyBDcmVhdGUgbGluZVxuXHRcdHRoaXMuc3ZnID0gc3ZnQ29udC5saW5lKHRoaXMucDAueCwgdGhpcy5wMC55LCB0aGlzLnAwLngsIHRoaXMucDAueSk7XG5cdFx0dGhpcy5zdmcuc3Ryb2tlKHsgY29sb3I6ICdyZ2JhKDI1LCAyNSwgMjUsIDAuNSknLCB3aWR0aDogMTUsIGxpbmVjYXA6ICdyb3VuZCcgfSk7XG5cdFx0dGhpcy5jMCA9IGMwO1xuXHR9XG5cblx0dXBkYXRlTGluZShwMTogVmVjdG9yMil7XG5cdFx0dGhpcy5zdmcucGxvdCh0aGlzLnAwLngsIHRoaXMucDAueSwgcDEueCwgcDEueSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSIsImltcG9ydCAqIGFzIHN2ZyBmcm9tIFwiQHN2Z2RvdGpzL3N2Zy5qc1wiO1xuXG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vY29kZS9pbnB1dFwiO1xuaW1wb3J0IE91dHB1dCBmcm9tIFwiLi9jb2RlL291dHB1dFwiO1xuaW1wb3J0IEJsb2NrIGZyb20gXCIuL2NvZGUvYmxvY2tcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuL3V0aWwvdmVjdG9yMlwiO1xuaW1wb3J0IFdpcmVHaG9zdCBmcm9tIFwiLi9jb2RlL3dpcmVHaG9zdFwiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29kZS9jb25uZWN0aW9uXCI7XG5pbXBvcnQgV2lyZSBmcm9tIFwiLi9jb2RlL3dpcmVcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4vc3ByaXRlTG9hZGVyXCI7XG5pbXBvcnQgeyBnZXRGaXJzdEVsZW1lbnRXaXRoUHJvcGVydHkgfSBmcm9tIFwiLi91dGlsL2RvbVV0aWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcblx0c2NhbUNvaW46IG51bWJlcjtcblx0c3ZnOiBzdmcuU3ZnO1xuXHRhY3RpdmVXaXJlR2hvc3Q6IFdpcmVHaG9zdDtcblx0c2NhbUNvaW5Db3VudGVyOiBIVE1MRWxlbWVudDtcblxuXHRjb25zdHJ1Y3Rvcihjb2RpbmdBcmVhOiBzdHJpbmcpe1xuXHRcdHRoaXMuc2NhbUNvaW4gPSAwO1xuXHRcdHRoaXMuc3ZnID0gc3ZnLlNWRygpLmFkZFRvKGNvZGluZ0FyZWEpLnNpemUoMTkyMCwgMTA4MCk7XG5cdFx0dGhpcy5zY2FtQ29pbkNvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5Db3VudGVyXCIpO1xuXG5cdFx0Y29uc3QgdGVzdEJsb2NrID0gbmV3IEJsb2NrKHRoaXMuc3ZnLCB0aGlzKTtcblx0XHRjb25zdCB0ZXN0QmxvY2syID0gbmV3IEJsb2NrKHRoaXMuc3ZnLCB0aGlzKTtcblxuXHRcdHRlc3RCbG9jay5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiYmxvY2tEb3VibGVcIl0pLmFkZENvbm5lY3Rpb24oMCkuYWRkQ29ubmVjdGlvbigxKS5zZXRQb3MobmV3IFZlY3RvcjIoNTAwLCAxMDApKTtcblx0XHR0ZXN0QmxvY2syLmRyYXcoU3ByaXRlTG9hZGVyLnNwcml0ZXNbXCJibG9ja0FkZGl0aW9uXCJdKS5hZGRDb25uZWN0aW9uKDApLmFkZENvbm5lY3Rpb24oMCkuYWRkQ29ubmVjdGlvbigxKS5zZXRQb3MobmV3IFZlY3RvcjIoNTAwLCAyNTApKTtcblxuXHRcdGNvbnN0IHRlc3RNb2QgPSAodmFsdWVzOiBBcnJheTxudW1iZXI+KTogbnVtYmVyID0+IHtcblx0XHRcdHJldHVybiB2YWx1ZXNbMF0gKiAyO1xuXHRcdH1cblxuXHRcdHRlc3RCbG9jay52YWx1ZU1vZGlmaWVyID0gdGVzdE1vZDtcblx0XHR0ZXN0QmxvY2syLnZhbHVlTW9kaWZpZXIgPSAodmFsdWVzOiBBcnJheTxudW1iZXI+KTogbnVtYmVyID0+IHtcblx0XHRcdHJldHVybiB2YWx1ZXNbMF0gKyB2YWx1ZXNbMV07XG5cdFx0fTtcblxuXHRcdGNvbnN0IHRlc3RJbnB1dCA9IG5ldyBJbnB1dCh0aGlzLnN2ZywgdGhpcyk7XG5cdFx0dGVzdElucHV0LmRyYXcoU3ByaXRlTG9hZGVyLnNwcml0ZXNbXCJibG9ja0lucHV0XCJdKS5zZXRQb3MobmV3IFZlY3RvcjIoNTAsIDEwMCkpO1xuXG5cdFx0Y29uc3QgdGVzdElucHV0MiA9IG5ldyBJbnB1dCh0aGlzLnN2ZywgdGhpcyk7XG5cdFx0dGVzdElucHV0Mi5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiYmxvY2tJbnB1dFwiXSkuc2V0UG9zKG5ldyBWZWN0b3IyKDUwLCAyMDApKTtcblxuXHRcdGNvbnN0IHRlc3RPdXRwdXQgPSBuZXcgT3V0cHV0KHRoaXMuc3ZnLCB0aGlzKTtcblx0XHR0ZXN0T3V0cHV0LmRyYXcoU3ByaXRlTG9hZGVyLnNwcml0ZXNbXCJibG9ja091dHB1dFwiXSkuc2V0UG9zKG5ldyBWZWN0b3IyKDEwMDAsIDEwMCkpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBjb25uZWN0aW9uIHdpcmluZ1xuXG5cdFx0dGhpcy5zdmcub24oXCJtb3VzZXVwXCIsIChldmVudDogTW91c2VFdmVudCkgPT4geyAvLyBJZiBtb3VzZSB1cCwgdXBkYXRlIHdpcmUgZ2hvc3Rcblx0XHRcdGlmKHRoaXMuYWN0aXZlV2lyZUdob3N0ICE9PSBudWxsKXtcblx0XHRcdFx0dGhpcy5hY3RpdmVXaXJlR2hvc3Quc3ZnLnJlbW92ZSgpO1xuXHRcdFx0XHR0aGlzLmFjdGl2ZVdpcmVHaG9zdC5jMC5wYXJlbnQucmVzZXREcmFnZ2FibGUoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnN0IGNvbm5lY3Rpb25FbDogSFRNTEVsZW1lbnQgPSBnZXRGaXJzdEVsZW1lbnRXaXRoUHJvcGVydHkoZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC54LCBldmVudC55KSwgXCJibG9ja0Nvbm5lY3Rpb25cIiwgXCJibG9ja0Nvbm5lY3Rpb25cIik7XG5cblx0XHRcdFx0aWYoY29ubmVjdGlvbkVsICE9PSBudWxsKXtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0Q29ubmVjdGlvbjogQ29ubmVjdGlvbiA9IGNvbm5lY3Rpb25FbC5pbnN0YW5jZS5yZW1lbWJlcihcImNvbm5lY3Rpb25cIik7XG5cblx0XHRcdFx0XHRpZih0YXJnZXRDb25uZWN0aW9uLnR5cGUgIT09IHRoaXMuYWN0aXZlV2lyZUdob3N0LmMwLnR5cGUgJiYgdGFyZ2V0Q29ubmVjdGlvbi5wYXJlbnQgIT09IHRoaXMuYWN0aXZlV2lyZUdob3N0LmMwLnBhcmVudCl7XG5cdFx0XHRcdFx0XHRsZXQgd2lyZU91dHB1dDogQ29ubmVjdGlvbjtcblx0XHRcdFx0XHRcdGxldCB3aXJlSW5wdXQ6IENvbm5lY3Rpb247XG5cblx0XHRcdFx0XHRcdGlmKHRhcmdldENvbm5lY3Rpb24udHlwZSA9PT0gMSl7XG5cdFx0XHRcdFx0XHRcdHdpcmVPdXRwdXQgPSB0YXJnZXRDb25uZWN0aW9uO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0d2lyZUlucHV0ID0gdGFyZ2V0Q29ubmVjdGlvbjtcblx0XHRcdFx0XHRcdH1cblx0XG5cdFx0XHRcdFx0XHRpZih0aGlzLmFjdGl2ZVdpcmVHaG9zdC5jMC50eXBlID09PSAxKXtcblx0XHRcdFx0XHRcdFx0d2lyZU91dHB1dCA9IHRoaXMuYWN0aXZlV2lyZUdob3N0LmMwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0d2lyZUlucHV0ID0gdGhpcy5hY3RpdmVXaXJlR2hvc3QuYzA7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IG5ld1dpcmUgPSBuZXcgV2lyZSh3aXJlSW5wdXQsIHdpcmVPdXRwdXQsIHRoaXMuc3ZnKTtcblx0XHRcdFx0XHRcdG5ld1dpcmUuZHJhdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuYWN0aXZlV2lyZUdob3N0ID0gbnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuc3ZnLm9uKFwibW91c2Vtb3ZlXCIsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0aWYodGhpcy5hY3RpdmVXaXJlR2hvc3QgIT09IG51bGwpe1xuXHRcdFx0XHR0aGlzLmFjdGl2ZVdpcmVHaG9zdC51cGRhdGVMaW5lKHRoaXMuc3ZnLnBhdGgoKS5wb2ludChldmVudC54LCBldmVudC55KSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLmFjdGl2ZVdpcmVHaG9zdCA9IG51bGw7XG5cblx0XHRjb25zb2xlLmxvZyhcIkdhbWUgaW5pdGlhbGl6ZWQhXCIpO1xuXG5cdFx0c2V0SW50ZXJ2YWwoKCk9Pntcblx0XHRcdHRlc3RJbnB1dC53b3JrKCk7XG5cdFx0XHR0ZXN0SW5wdXQyLndvcmsoKTtcblx0XHR9LCAxMDAwKVxuXHR9XG5cblx0dXBkYXRlKCl7XG5cdFx0dGhpcy5zY2FtQ29pbkNvdW50ZXIuaW5uZXJUZXh0ID0gdGhpcy5zY2FtQ29pbi50b1N0cmluZygpO1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlTG9hZGVye1xuXHRwdWJsaWMgc3RhdGljIHNwcml0ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IC8vIEFsbCB0aGUgbG9hZGVkIGdhbWUgc3ByaXRlc1xuXHRwdWJsaWMgc3RhdGljIHNwcml0ZUxpc3Q6IEFycmF5PHN0cmluZz47IC8vIEEgbGlzdCBvZiBhbGwgdGhlIGdhbWUgc3ByaXRlcyB0byBiZSBsb2FkZWRcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdFNwcml0ZUxvYWRlci5zcHJpdGVzID0ge307XG5cblx0XHRTcHJpdGVMb2FkZXIuc3ByaXRlTGlzdCA9IFtcblx0XHRcdFwiYmxvY2tEb3VibGVcIixcblx0XHRcdFwiY29ubmVjdGlvbklucHV0XCIsXG5cdFx0XHRcImNvbm5lY3Rpb25PdXRwdXRcIixcblx0XHRcdFwiYmxvY2tJbnB1dFwiLFxuXHRcdFx0XCJibG9ja091dHB1dFwiLFxuXHRcdFx0XCJibG9ja0FkZGl0aW9uXCJcdFx0XHRcblx0XHRdO1xuXHR9XG5cblx0bG9hZEFsbFNwcml0ZXMoKTogUHJvbWlzZTxudW1iZXJbXT57XG5cdFx0bGV0IHNwcml0ZTogc3RyaW5nO1xuXHRcdGxldCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxudW1iZXI+PiA9IFtdO1xuXG5cdFx0Zm9yKHNwcml0ZSBvZiBTcHJpdGVMb2FkZXIuc3ByaXRlTGlzdCl7XG5cdFx0XHRwcm9taXNlcy5wdXNoKHRoaXMubG9hZFNwcml0ZShzcHJpdGUpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHR9XG5cblx0bG9hZFNwcml0ZShzcHJpdGU6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPntcblx0XHRyZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCl7XG5cdFx0XHRcdFx0aWYodGhpcy5zdGF0dXMgPT09IDIwMCl7XG5cdFx0XHRcdFx0XHRTcHJpdGVMb2FkZXIuc3ByaXRlc1tzcHJpdGVdID0gdGhpcy5yZXNwb25zZVRleHQ7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKDIwMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGxvYWQgc3ByaXRlIFwiLCBzcHJpdGUsIFwiISBFcnJvciBcIiwgdGhpcy5zdGF0dXMpO1xuXHRcdFx0XHRcdFx0cmVqZWN0KHRoaXMuc3RhdHVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmVxLm9wZW4oXCJHRVRcIiwgYHN2Zy8ke3Nwcml0ZX0uc3ZnYCk7XG5cdFx0XHRyZXEuc2VuZCgpO1xuXHRcdH0pO1xuXHR9XG59IiwiZXhwb3J0IGNvbnN0IGdldEZpcnN0RWxlbWVudFdpdGhQcm9wZXJ0eSA9IChpbml0aWFsOiBFbGVtZW50LCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQgPT4ge1xuXHRsZXQgcGFyZW50ID0gaW5pdGlhbC5wYXJlbnRFbGVtZW50O1xuXG5cdHdoaWxlKHBhcmVudC5nZXRBdHRyaWJ1dGUocHJvcGVydHkpICE9PSB2YWx1ZSAmJiBwYXJlbnQgIT09IGRvY3VtZW50LmJvZHkpe1xuXHRcdFxuXHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuXHR9XG5cblx0cmV0dXJuIChwYXJlbnQgPT09IGRvY3VtZW50LmJvZHkgPyBudWxsIDogcGFyZW50KTtcbn1cbiIsImltcG9ydCAqIGFzIHN2ZyBmcm9tIFwiQHN2Z2RvdGpzL3N2Zy5qc1wiO1xuaW1wb3J0IFZlY3RvcjIgZnJvbSBcIi4vdmVjdG9yMlwiO1xuXG5leHBvcnQgY29uc3QgZ2V0U1ZHUG9zID0gKHRhcmdldDpzdmcuRWxlbWVudCwgY2VudGVyZWQ6IGJvb2xlYW4gPSBmYWxzZSkgPT4ge1xuICAgIGNvbnN0IHBhcmVudHMgPSB0YXJnZXQucGFyZW50cygpO1xuICAgIGNvbnN0IHRhcmdldFRyYW5zZm9ybSA9IHRhcmdldC50cmFuc2Zvcm0oKTtcblxuICAgIGxldCB4ID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVg7XG4gICAgbGV0IHkgPSB0YXJnZXRUcmFuc2Zvcm0udHJhbnNsYXRlWTtcblxuICAgIGZvcihsZXQgcGFyZW50IG9mIHBhcmVudHMpe1xuICAgICAgICBpZihwYXJlbnQgPT09IHRhcmdldC5yb290KCkpIGJyZWFrO1xuXG4gICAgICAgIGNvbnN0IHBhcmVudFRyYW5zZm9ybSA9IHBhcmVudC50cmFuc2Zvcm0oKTtcbiAgICAgICAgeCs9cGFyZW50VHJhbnNmb3JtLnRyYW5zbGF0ZVg7XG4gICAgICAgIHkrPXBhcmVudFRyYW5zZm9ybS50cmFuc2xhdGVZO1xuICAgIH1cblxuICAgIGlmKGNlbnRlcmVkKXtcbiAgICAgICAgeCs9dGFyZ2V0LndpZHRoKCkgLyAyO1xuICAgICAgICB5Kz10YXJnZXQuaGVpZ2h0KCkgLyAyO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlY3RvcjJ7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKHg6IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDApe1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiIn0=