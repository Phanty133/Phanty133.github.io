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
                input.wire.updateLine();
            }
            for (var _b = 0, _c = _this.outputs; _b < _c.length; _b++) {
                var output = _c[_b];
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
            var elBeneath = document.elementsFromPoint(event.x, event.y)[1].instance.parent();
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
                // @ts-ignore
                var connectionInstance = Object(_util_domUtil__WEBPACK_IMPORTED_MODULE_7__["getFirstElementWithProperty"])(document.elementFromPoint(event.x, event.y), "blockConnection", "blockConnection").instance;
                var targetConnection = connectionInstance.remember("connection");
                if (targetConnection !== undefined) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bzdmdkb3Rqcy9zdmcuZHJhZ2dhYmxlLmpzL3NyYy9zdmcuZHJhZ2dhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9Ac3ZnZG90anMvc3ZnLmpzL2Rpc3Qvc3ZnLmVzbS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2NvZGUvYmxvY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL2Nvbm5lY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL2lucHV0LnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvY29kZS9vdXRwdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL3dpcmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2RlL3dpcmVHaG9zdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zcHJpdGVMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL2RvbVV0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL3N2Z1V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi91dGlsL3ZlY3RvcjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtR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QXVDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixnREFBZ0Q7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7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Q0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMsbUVBQW1FO0FBQzVFO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkRBQTZELGdFQUFnRTtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNB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QUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVELCtDQUErQyxlQUFlLEVBQUU7O0FBRWhFO0FBQ0E7QUFDQSxTQUFTLDhEQUE4RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHFKQUFxSjtBQUNySixLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBIQUEwSDtBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEOztBQUUxRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxR0FBcUcsdUNBQXVDLCtCQUErQix5RkFBeUYsT0FBTyxLQUFLO0FBQ2hSLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QyxvQ0FBb0M7O0FBRXBDO0FBQ0EsNkVBQTZFLGVBQWU7QUFDNUY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxJQUFJO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxRkFBcUY7QUFDckY7QUFDQSw0Q0FBNEM7O0FBRTVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEOztBQUVBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEOztBQUV0RDtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXOzs7QUFHWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFD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QUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUVBQXVFO0FBQ3ZFOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFFOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLElBQUk7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvRkFBb0Y7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMseUVBQXlFO0FBQ2xGO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsU0FBUyx5RUFBeUU7QUFDbEY7QUFDQSxDQUFDOztBQUVEOzs7QUFHQSwrQ0FBK0MscUNBQXFDLEVBQUU7QUFDdEY7O0FBRUE7QUFDQTtBQUNBLFNBQVMscUVBQXFFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFNBQVMsbURBQW1EO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDRDQUE0QyxnQ0FBZ0Msb0NBQW9DLG9EQUFvRCw4REFBOEQsZ0VBQWdFLEVBQUUsRUFBRSxnQ0FBZ0MsRUFBRSxhQUFhOztBQUVyVixnQ0FBZ0MsZ0JBQWdCLHNCQUFzQixPQUFPLHVEQUF1RCxhQUFhLGlEQUFpRCwyQ0FBMkMsRUFBRSxFQUFFLEVBQUUsNkNBQTZDLDJFQUEyRSxFQUFFLE9BQU8sMkNBQTJDLGtGQUFrRixFQUFFLEVBQUUsRUFBRSxFQUFFLGVBQWU7O0FBRXhnQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFD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QUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsYUFBYTtBQUN0RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyxpREFBaUQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFD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QUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUMsUUFBUTtBQUNULHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQSxPQUFPOztBQUVQOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7OztBQUdBO0FBQ0EsMEVBQTBFOztBQUUxRSw0QkFBNEI7O0FBRTVCO0FBQ0Esa0NBQWtDOzs7QUFHbEM7O0FBRUE7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUOzs7QUFHQTtBQUNBLCtEQUErRDs7QUFFL0QsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBRTs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQSxpR0FBaUc7O0FBRWpHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTs7QUFFbEUsK0JBQStCOzs7QUFHL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdEQUFnRDtBQUNoRDtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQLHFDQUFxQztBQUNyQztBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSwyQkFBMkI7O0FBRTNCLG1EQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLLEVBQUU7O0FBRVA7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLLEVBQUU7O0FBRVA7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJDQUEyQzs7QUFFM0MsMEJBQTBCOztBQUUxQix5QkFBeUI7O0FBRXpCO0FBQ0EsR0FBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBOEMsU0FBUztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQSxXQUFXOzs7QUFHWDtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0Esa0NBQWtDOztBQUVsQywwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQSxLQUFLOztBQUVMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RkFBOEY7O0FBRTlGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFD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QyxJQUFFLGVBQWUsQ0FBQyxVQUFVLENBQUM7S0FDakM7SUFFRCxJQUFHLFFBQVEsRUFBQztRQUNSLENBQUMsSUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsSUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQzFCO0lBRUQsT0FBTyxJQUFJLGdEQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN4QkQ7QUFBQTtJQUlDLGlCQUFZLENBQWEsRUFBRSxDQUFhO1FBQTVCLHlCQUFhO1FBQUUseUJBQWE7UUFDdkMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFDRixjQUFDO0FBQUQsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IEJveCwgRWxlbWVudCwgRywgZXh0ZW5kLCBvZmYsIG9uIH0gZnJvbSAnQHN2Z2RvdGpzL3N2Zy5qcydcblxyXG5jb25zdCBnZXRDb29yZHNGcm9tRXZlbnQgPSAoZXYpID0+IHtcclxuICBpZiAoZXYuY2hhbmdlZFRvdWNoZXMpIHtcclxuICAgIGV2ID0gZXYuY2hhbmdlZFRvdWNoZXNbMF1cclxuICB9XHJcbiAgcmV0dXJuIHsgeDogZXYuY2xpZW50WCwgeTogZXYuY2xpZW50WSB9XHJcbn1cclxuXHJcbi8vIENyZWF0ZXMgaGFuZGxlciwgc2F2ZXMgaXRcclxuY2xhc3MgRHJhZ0hhbmRsZXIge1xyXG4gIGNvbnN0cnVjdG9yIChlbCkge1xyXG4gICAgZWwucmVtZW1iZXIoJ19kcmFnZ2FibGUnLCB0aGlzKVxyXG4gICAgdGhpcy5lbCA9IGVsXHJcblxyXG4gICAgdGhpcy5kcmFnID0gdGhpcy5kcmFnLmJpbmQodGhpcylcclxuICAgIHRoaXMuc3RhcnREcmFnID0gdGhpcy5zdGFydERyYWcuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5lbmREcmFnID0gdGhpcy5lbmREcmFnLmJpbmQodGhpcylcclxuICB9XHJcblxyXG4gIC8vIEVuYWJsZXMgb3IgZGlzYWJsZWQgZHJhZyBiYXNlZCBvbiBpbnB1dFxyXG4gIGluaXQgKGVuYWJsZWQpIHtcclxuICAgIGlmIChlbmFibGVkKSB7XHJcbiAgICAgIHRoaXMuZWwub24oJ21vdXNlZG93bi5kcmFnJywgdGhpcy5zdGFydERyYWcpXHJcbiAgICAgIHRoaXMuZWwub24oJ3RvdWNoc3RhcnQuZHJhZycsIHRoaXMuc3RhcnREcmFnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbC5vZmYoJ21vdXNlZG93bi5kcmFnJylcclxuICAgICAgdGhpcy5lbC5vZmYoJ3RvdWNoc3RhcnQuZHJhZycpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTdGFydCBkcmFnZ2luZ1xyXG4gIHN0YXJ0RHJhZyAoZXYpIHtcbiAgICBjb25zdCBpc01vdXNlID0gIWV2LnR5cGUuaW5kZXhPZignbW91c2UnKVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxlZnQgYnV0dG9uXHJcbiAgICBpZiAoaXNNb3VzZSAmJiAoZXYud2hpY2ggfHwgZXYuYnV0dG9ucykgIT09IDEpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmlyZSBiZWZvcmVkcmFnIGV2ZW50XHJcbiAgICBpZiAodGhpcy5lbC5kaXNwYXRjaCgnYmVmb3JlZHJhZycsIHsgZXZlbnQ6IGV2LCBoYW5kbGVyOiB0aGlzIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJldmVudCBicm93c2VyIGRyYWcgYmVoYXZpb3IgYXMgc29vbiBhcyBwb3NzaWJsZVxyXG4gICAgZXYucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIC8vIFByZXZlbnQgcHJvcGFnYXRpb24gdG8gYSBwYXJlbnQgdGhhdCBtaWdodCBhbHNvIGhhdmUgZHJhZ2dpbmcgZW5hYmxlZFxyXG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBzdGFydCBldmVudHMgYXJlIHVuYm91bmQgc28gdGhhdCBvbmUgZWxlbWVudFxyXG4gICAgLy8gaXMgb25seSBkcmFnZ2VkIGJ5IG9uZSBpbnB1dCBvbmx5XHJcbiAgICB0aGlzLmluaXQoZmFsc2UpXHJcblxyXG4gICAgdGhpcy5ib3ggPSB0aGlzLmVsLmJib3goKVxyXG4gICAgdGhpcy5sYXN0Q2xpY2sgPSB0aGlzLmVsLnBvaW50KGdldENvb3Jkc0Zyb21FdmVudChldikpXHJcblxyXG4gICAgLy8gV2UgY29uc2lkZXIgdGhlIGRyYWcgZG9uZSwgd2hlbiBhIHRvdWNoIGlzIGNhbmNlbGVkLCB0b29cclxuICAgIGNvbnN0IGV2ZW50TW92ZSA9IChpc01vdXNlID8gJ21vdXNlbW92ZScgOiAndG91Y2htb3ZlJykgKyAnLmRyYWcnXHJcbiAgICBjb25zdCBldmVudEVuZCA9IChpc01vdXNlID8gJ21vdXNldXAnIDogJ3RvdWNoY2FuY2VsLmRyYWcgdG91Y2hlbmQnKSArICcuZHJhZydcclxuXHJcbiAgICAvLyBCaW5kIGRyYWcgYW5kIGVuZCBldmVudHMgdG8gd2luZG93XHJcbiAgICBvbih3aW5kb3csIGV2ZW50TW92ZSwgdGhpcy5kcmFnKVxyXG4gICAgb24od2luZG93LCBldmVudEVuZCwgdGhpcy5lbmREcmFnKVxyXG5cclxuICAgIC8vIEZpcmUgZHJhZ3N0YXJ0IGV2ZW50XHJcbiAgICB0aGlzLmVsLmZpcmUoJ2RyYWdzdGFydCcsIHsgZXZlbnQ6IGV2LCBoYW5kbGVyOiB0aGlzLCBib3g6IHRoaXMuYm94IH0pXHJcbiAgfVxyXG5cclxuICAvLyBXaGlsZSBkcmFnZ2luZ1xyXG4gIGRyYWcgKGV2KSB7XHJcblxyXG4gICAgY29uc3QgeyBib3gsIGxhc3RDbGljayB9ID0gdGhpc1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRDbGljayA9IHRoaXMuZWwucG9pbnQoZ2V0Q29vcmRzRnJvbUV2ZW50KGV2KSlcclxuICAgIGNvbnN0IHggPSBib3gueCArIChjdXJyZW50Q2xpY2sueCAtIGxhc3RDbGljay54KVxyXG4gICAgY29uc3QgeSA9IGJveC55ICsgKGN1cnJlbnRDbGljay55IC0gbGFzdENsaWNrLnkpXHJcbiAgICBjb25zdCBuZXdCb3ggPSBuZXcgQm94KHgsIHksIGJveC53LCBib3guaClcclxuXHJcbiAgICBpZiAodGhpcy5lbC5kaXNwYXRjaCgnZHJhZ21vdmUnLCB7XHJcbiAgICAgIGV2ZW50OiBldixcclxuICAgICAgaGFuZGxlcjogdGhpcyxcclxuICAgICAgYm94OiBuZXdCb3hcclxuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVyblxyXG5cclxuICAgIHRoaXMubW92ZSh4LCB5KVxyXG4gICAgcmV0dXJuIG5ld0JveFxyXG4gIH1cclxuXHJcbiAgbW92ZSAoeCwgeSkge1xyXG4gICAgLy8gU3ZnIGVsZW1lbnRzIGJib3ggZGVwZW5kcyBvbiB0aGVpciBjb250ZW50IGV2ZW4gdGhvdWdoIHRoZXkgaGF2ZVxyXG4gICAgLy8geCwgeSwgd2lkdGggYW5kIGhlaWdodCAtIHN0cmFuZ2UhXHJcbiAgICAvLyBUaGF0cyB3aHkgd2UgaGFuZGxlIHRoZW0gdGhlIHNhbWUgYXMgZ3JvdXBzXHJcbiAgICBpZiAodGhpcy5lbC50eXBlID09PSAnc3ZnJykge1xyXG4gICAgICBHLnByb3RvdHlwZS5tb3ZlLmNhbGwodGhpcy5lbCwgeCwgeSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWwubW92ZSh4LCB5KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW5kRHJhZyAoZXYpIHtcbiAgICAvLyBmaW5hbCBkcmFnXHJcbiAgICBjb25zdCBib3ggPSB0aGlzLmRyYWcoZXYpXHJcblxyXG4gICAgLy8gZmlyZSBkcmFnZW5kIGV2ZW50XHJcbiAgICB0aGlzLmVsLmZpcmUoJ2RyYWdlbmQnLCB7IGV2ZW50OiBldiwgaGFuZGxlcjogdGhpcywgYm94IH0pXHJcblxyXG4gICAgLy8gdW5iaW5kIGV2ZW50c1xyXG4gICAgb2ZmKHdpbmRvdywgJ21vdXNlbW92ZS5kcmFnJylcclxuICAgIG9mZih3aW5kb3csICd0b3VjaG1vdmUuZHJhZycpXHJcbiAgICBvZmYod2luZG93LCAnbW91c2V1cC5kcmFnJylcclxuICAgIG9mZih3aW5kb3csICd0b3VjaGVuZC5kcmFnJylcblxuICAgIC8vIFJlYmluZCBpbml0aWFsIEV2ZW50c1xuICAgIHRoaXMuaW5pdCh0cnVlKVxuICB9XHJcbn1cclxuXHJcbmV4dGVuZChFbGVtZW50LCB7XHJcbiAgZHJhZ2dhYmxlIChlbmFibGUgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBkcmFnSGFuZGxlciA9IHRoaXMucmVtZW1iZXIoJ19kcmFnZ2FibGUnKSB8fCBuZXcgRHJhZ0hhbmRsZXIodGhpcylcclxuICAgIGRyYWdIYW5kbGVyLmluaXQoZW5hYmxlKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn0pXHJcbiIsIi8qIVxuKiBAc3ZnZG90anMvc3ZnLmpzIC0gQSBsaWdodHdlaWdodCBsaWJyYXJ5IGZvciBtYW5pcHVsYXRpbmcgYW5kIGFuaW1hdGluZyBTVkcuXG4qIEB2ZXJzaW9uIDMuMC4xNlxuKiBodHRwczovL3N2Z2RvdGpzLmdpdGh1Yi5pby9cbipcbiogQGNvcHlyaWdodCBXb3V0IEZpZXJlbnMgPHdvdXRAbWljay13b3V0LmNvbT5cbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEJVSUxUOiBUdWUgTm92IDEyIDIwMTkgMjE6NTc6MTYgR01UKzAxMDAgKEdNVCswMTowMClcbiovO1xudmFyIGNvbW1vbmpzR2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge307XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZuLCBtb2R1bGUpIHtcblx0cmV0dXJuIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfSwgZm4obW9kdWxlLCBtb2R1bGUuZXhwb3J0cyksIG1vZHVsZS5leHBvcnRzO1xufVxuXG52YXIgY2hlY2sgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICYmIGl0Lk1hdGggPT0gTWF0aCAmJiBpdDtcbn07XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsXzEgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBjb21tb25qc0dsb2JhbCA9PSAnb2JqZWN0JyAmJiBjb21tb25qc0dsb2JhbCkgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbnZhciBmYWlscyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG52YXIgZGVzY3JpcHRvcnMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuXG52YXIgbmF0aXZlUHJvcGVydHlJc0VudW1lcmFibGUgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBOYXNob3JuIH4gSkRLOCBidWdcbnZhciBOQVNIT1JOX0JVRyA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvciAmJiAhbmF0aXZlUHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUucHJvcGVydHlpc2VudW1lcmFibGVcbnZhciBmID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxudmFyIG9iamVjdFByb3BlcnR5SXNFbnVtZXJhYmxlID0ge1xuXHRmOiBmXG59O1xuXG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG5cbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgY2xhc3NvZlJhdyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcblxudmFyIHNwbGl0ID0gJycuc3BsaXQ7XG5cbi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgaW5kZXhlZE9iamVjdCA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gdGhyb3dzIGFuIGVycm9yIGluIHJoaW5vLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvcmhpbm8vaXNzdWVzLzM0NlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIHJldHVybiAhT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCk7XG59KSA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY2xhc3NvZlJhdyhpdCkgPT0gJ1N0cmluZycgPyBzcGxpdC5jYWxsKGl0LCAnJykgOiBPYmplY3QoaXQpO1xufSA6IE9iamVjdDtcblxuLy8gYFJlcXVpcmVPYmplY3RDb2VyY2libGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG5cbi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG5cblxuXG52YXIgdG9JbmRleGVkT2JqZWN0ID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG5cbnZhciBpc09iamVjdCA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbnZhciB0b1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIChpbnB1dCwgUFJFRkVSUkVEX1NUUklORykge1xuICBpZiAoIWlzT2JqZWN0KGlucHV0KSkgcmV0dXJuIGlucHV0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFBSRUZFUlJFRF9TVFJJTkcgJiYgdHlwZW9mIChmbiA9IGlucHV0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaW5wdXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVBSRUZFUlJFRF9TVFJJTkcgJiYgdHlwZW9mIChmbiA9IGlucHV0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG52YXIgaGFzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuXG52YXIgZG9jdW1lbnQkMSA9IGdsb2JhbF8xLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQkMSkgJiYgaXNPYmplY3QoZG9jdW1lbnQkMS5jcmVhdGVFbGVtZW50KTtcblxudmFyIGRvY3VtZW50Q3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQkMS5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcblxuLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxudmFyIGllOERvbURlZmluZSA9ICFkZXNjcmlwdG9ycyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9IDc7XG59KTtcblxudmFyIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbnZhciBmJDEgPSBkZXNjcmlwdG9ycyA/IG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKGllOERvbURlZmluZSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXMoTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIW9iamVjdFByb3BlcnR5SXNFbnVtZXJhYmxlLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuXG52YXIgb2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0ge1xuXHRmOiBmJDFcbn07XG5cbnZhciBhbk9iamVjdCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihTdHJpbmcoaXQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcblxudmFyIG5hdGl2ZURlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxudmFyIGYkMiA9IGRlc2NyaXB0b3JzID8gbmF0aXZlRGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoaWU4RG9tRGVmaW5lKSB0cnkge1xuICAgIHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG5cbnZhciBvYmplY3REZWZpbmVQcm9wZXJ0eSA9IHtcblx0ZjogZiQyXG59O1xuXG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gZGVzY3JpcHRvcnMgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBvYmplY3REZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwga2V5LCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuXG52YXIgc2V0R2xvYmFsID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoZ2xvYmFsXzEsIGtleSwgdmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGdsb2JhbF8xW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxfMVtTSEFSRURdIHx8IHNldEdsb2JhbChTSEFSRUQsIHt9KTtcblxudmFyIHNoYXJlZFN0b3JlID0gc3RvcmU7XG5cbnZhciBzaGFyZWQgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlKSB7XG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc2hhcmVkU3RvcmVba2V5XSB8fCAoc2hhcmVkU3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogJzMuMy42JyxcbiAgbW9kZTogICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE5IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG59KTtcblxudmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSBzaGFyZWQoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsXzEuV2Vha01hcDtcblxudmFyIG5hdGl2ZVdlYWtNYXAgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyAmJiAvbmF0aXZlIGNvZGUvLnRlc3QoZnVuY3Rpb25Ub1N0cmluZy5jYWxsKFdlYWtNYXApKTtcblxudmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxudmFyIHVpZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJyArIFN0cmluZyhrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5KSArICcpXycgKyAoKytpZCArIHBvc3RmaXgpLnRvU3RyaW5nKDM2KTtcbn07XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbnZhciBzaGFyZWRLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXlzW2tleV0gfHwgKGtleXNba2V5XSA9IHVpZChrZXkpKTtcbn07XG5cbnZhciBoaWRkZW5LZXlzID0ge307XG5cbnZhciBXZWFrTWFwJDEgPSBnbG9iYWxfMS5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXMkMTtcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyQxKGl0KSA/IGdldChpdCkgOiBzZXQoaXQsIHt9KTtcbn07XG5cbnZhciBnZXR0ZXJGb3IgPSBmdW5jdGlvbiAoVFlQRSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICghaXNPYmplY3QoaXQpIHx8IChzdGF0ZSA9IGdldChpdCkpLnR5cGUgIT09IFRZUEUpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQnKTtcbiAgICB9IHJldHVybiBzdGF0ZTtcbiAgfTtcbn07XG5cbmlmIChuYXRpdmVXZWFrTWFwKSB7XG4gIHZhciBzdG9yZSQxID0gbmV3IFdlYWtNYXAkMSgpO1xuICB2YXIgd21nZXQgPSBzdG9yZSQxLmdldDtcbiAgdmFyIHdtaGFzID0gc3RvcmUkMS5oYXM7XG4gIHZhciB3bXNldCA9IHN0b3JlJDEuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgd21zZXQuY2FsbChzdG9yZSQxLCBpdCwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtZ2V0LmNhbGwoc3RvcmUkMSwgaXQpIHx8IHt9O1xuICB9O1xuICBoYXMkMSA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlJDEsIGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGl0LCBTVEFURSwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhcyhpdCwgU1RBVEUpID8gaXRbU1RBVEVdIDoge307XG4gIH07XG4gIGhhcyQxID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhcyhpdCwgU1RBVEUpO1xuICB9O1xufVxuXG52YXIgaW50ZXJuYWxTdGF0ZSA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyQxLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcblxudmFyIHJlZGVmaW5lID0gY3JlYXRlQ29tbW9uanNNb2R1bGUoZnVuY3Rpb24gKG1vZHVsZSkge1xudmFyIGdldEludGVybmFsU3RhdGUgPSBpbnRlcm5hbFN0YXRlLmdldDtcbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IGludGVybmFsU3RhdGUuZW5mb3JjZTtcbnZhciBURU1QTEFURSA9IFN0cmluZyhmdW5jdGlvblRvU3RyaW5nKS5zcGxpdCgndG9TdHJpbmcnKTtcblxuc2hhcmVkKCdpbnNwZWN0U291cmNlJywgZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBmdW5jdGlvblRvU3RyaW5nLmNhbGwoaXQpO1xufSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB1bnNhZmUgPSBvcHRpb25zID8gISFvcHRpb25zLnVuc2FmZSA6IGZhbHNlO1xuICB2YXIgc2ltcGxlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5lbnVtZXJhYmxlIDogZmFsc2U7XG4gIHZhciBub1RhcmdldEdldCA9IG9wdGlvbnMgPyAhIW9wdGlvbnMubm9UYXJnZXRHZXQgOiBmYWxzZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgJiYgIWhhcyh2YWx1ZSwgJ25hbWUnKSkgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIGtleSk7XG4gICAgZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpLnNvdXJjZSA9IFRFTVBMQVRFLmpvaW4odHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGtleSA6ICcnKTtcbiAgfVxuICBpZiAoTyA9PT0gZ2xvYmFsXzEpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBmdW5jdGlvblRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbn0pO1xuXG52YXIgcGF0aCA9IGdsb2JhbF8xO1xuXG52YXIgYUZ1bmN0aW9uID0gZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT0gJ2Z1bmN0aW9uJyA/IHZhcmlhYmxlIDogdW5kZWZpbmVkO1xufTtcblxudmFyIGdldEJ1aWx0SW4gPSBmdW5jdGlvbiAobmFtZXNwYWNlLCBtZXRob2QpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyID8gYUZ1bmN0aW9uKHBhdGhbbmFtZXNwYWNlXSkgfHwgYUZ1bmN0aW9uKGdsb2JhbF8xW25hbWVzcGFjZV0pXG4gICAgOiBwYXRoW25hbWVzcGFjZV0gJiYgcGF0aFtuYW1lc3BhY2VdW21ldGhvZF0gfHwgZ2xvYmFsXzFbbmFtZXNwYWNlXSAmJiBnbG9iYWxfMVtuYW1lc3BhY2VdW21ldGhvZF07XG59O1xuXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG52YXIgdG9JbnRlZ2VyID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBpc05hTihhcmd1bWVudCA9ICthcmd1bWVudCkgPyAwIDogKGFyZ3VtZW50ID4gMCA/IGZsb29yIDogY2VpbCkoYXJndW1lbnQpO1xufTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbnZhciB0b0xlbmd0aCA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gYXJndW1lbnQgPiAwID8gbWluKHRvSW50ZWdlcihhcmd1bWVudCksIDB4MUZGRkZGRkZGRkZGRkYpIDogMDsgLy8gMiAqKiA1MyAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiQxID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4obGVuZ3RoLCBsZW5ndGgpLlxudmFyIHRvQWJzb2x1dGVJbmRleCA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIHZhciBpbnRlZ2VyID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluJDEoaW50ZWdlciwgbGVuZ3RoKTtcbn07XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIGlmICgoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykgJiYgT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG52YXIgYXJyYXlJbmNsdWRlcyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuXG52YXIgaW5kZXhPZiA9IGFycmF5SW5jbHVkZXMuaW5kZXhPZjtcblxuXG52YXIgb2JqZWN0S2V5c0ludGVybmFsID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pICFoYXMoaGlkZGVuS2V5cywga2V5KSAmJiBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xudmFyIGVudW1CdWdLZXlzID0gW1xuICAnY29uc3RydWN0b3InLFxuICAnaGFzT3duUHJvcGVydHknLFxuICAnaXNQcm90b3R5cGVPZicsXG4gICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICd0b0xvY2FsZVN0cmluZycsXG4gICd0b1N0cmluZycsXG4gICd2YWx1ZU9mJ1xuXTtcblxudmFyIGhpZGRlbktleXMkMSA9IGVudW1CdWdLZXlzLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbnZhciBmJDMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIG9iamVjdEtleXNJbnRlcm5hbChPLCBoaWRkZW5LZXlzJDEpO1xufTtcblxudmFyIG9iamVjdEdldE93blByb3BlcnR5TmFtZXMgPSB7XG5cdGY6IGYkM1xufTtcblxudmFyIGYkNCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbnZhciBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSB7XG5cdGY6IGYkNFxufTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xudmFyIG93bktleXMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lcy5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG5cbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gb2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzKHRhcmdldCwga2V5KSkgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICB9XG59O1xuXG52YXIgcmVwbGFjZW1lbnQgPSAvI3xcXC5wcm90b3R5cGVcXC4vO1xuXG52YXIgaXNGb3JjZWQgPSBmdW5jdGlvbiAoZmVhdHVyZSwgZGV0ZWN0aW9uKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGFbbm9ybWFsaXplKGZlYXR1cmUpXTtcbiAgcmV0dXJuIHZhbHVlID09IFBPTFlGSUxMID8gdHJ1ZVxuICAgIDogdmFsdWUgPT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IHR5cGVvZiBkZXRlY3Rpb24gPT0gJ2Z1bmN0aW9uJyA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG52YXIgaXNGb3JjZWRfMSA9IGlzRm9yY2VkO1xuXG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDEgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcblxuXG5cblxuXG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMubm9UYXJnZXRHZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4qL1xudmFyIF9leHBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsXzE7XG4gIH0gZWxzZSBpZiAoU1RBVElDKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsXzFbVEFSR0VUXSB8fCBzZXRHbG9iYWwoVEFSR0VULCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gKGdsb2JhbF8xW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDEodGFyZ2V0LCBrZXkpO1xuICAgICAgdGFyZ2V0UHJvcGVydHkgPSBkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfSBlbHNlIHRhcmdldFByb3BlcnR5ID0gdGFyZ2V0W2tleV07XG4gICAgRk9SQ0VEID0gaXNGb3JjZWRfMShHTE9CQUwgPyBrZXkgOiBUQVJHRVQgKyAoU1RBVElDID8gJy4nIDogJyMnKSArIGtleSwgb3B0aW9ucy5mb3JjZWQpO1xuICAgIC8vIGNvbnRhaW5lZCBpbiB0YXJnZXRcbiAgICBpZiAoIUZPUkNFRCAmJiB0YXJnZXRQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHNvdXJjZVByb3BlcnR5ID09PSB0eXBlb2YgdGFyZ2V0UHJvcGVydHkpIGNvbnRpbnVlO1xuICAgICAgY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyhzb3VyY2VQcm9wZXJ0eSwgdGFyZ2V0UHJvcGVydHkpO1xuICAgIH1cbiAgICAvLyBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gICAgaWYgKG9wdGlvbnMuc2hhbSB8fCAodGFyZ2V0UHJvcGVydHkgJiYgdGFyZ2V0UHJvcGVydHkuc2hhbSkpIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShzb3VyY2VQcm9wZXJ0eSwgJ3NoYW0nLCB0cnVlKTtcbiAgICB9XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzb3VyY2VQcm9wZXJ0eSwgb3B0aW9ucyk7XG4gIH1cbn07XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY2xhc3NvZlJhdyhhcmcpID09ICdBcnJheSc7XG59O1xuXG52YXIgY3JlYXRlUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKGtleSk7XG4gIGlmIChwcm9wZXJ0eUtleSBpbiBvYmplY3QpIG9iamVjdERlZmluZVByb3BlcnR5LmYob2JqZWN0LCBwcm9wZXJ0eUtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W3Byb3BlcnR5S2V5XSA9IHZhbHVlO1xufTtcblxudmFyIG5hdGl2ZVN5bWJvbCA9ICEhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgcmV0dXJuICFTdHJpbmcoU3ltYm9sKCkpO1xufSk7XG5cbnZhciBTeW1ib2wkMSA9IGdsb2JhbF8xLlN5bWJvbDtcbnZhciBzdG9yZSQyID0gc2hhcmVkKCd3a3MnKTtcblxudmFyIHdlbGxLbm93blN5bWJvbCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZSQyW25hbWVdIHx8IChzdG9yZSQyW25hbWVdID0gbmF0aXZlU3ltYm9sICYmIFN5bWJvbCQxW25hbWVdXG4gICAgfHwgKG5hdGl2ZVN5bWJvbCA/IFN5bWJvbCQxIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG52YXIgdXNlckFnZW50ID0gZ2V0QnVpbHRJbignbmF2aWdhdG9yJywgJ3VzZXJBZ2VudCcpIHx8ICcnO1xuXG52YXIgcHJvY2VzcyA9IGdsb2JhbF8xLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgdmVyc2lvbiA9IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbnZhciB2OFZlcnNpb24gPSB2ZXJzaW9uICYmICt2ZXJzaW9uO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG52YXIgYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICAvLyBXZSBjYW4ndCB1c2UgdGhpcyBmZWF0dXJlIGRldGVjdGlvbiBpbiBWOCBzaW5jZSBpdCBjYXVzZXNcbiAgLy8gZGVvcHRpbWl6YXRpb24gYW5kIHNlcmlvdXMgcGVyZm9ybWFuY2UgZGVncmFkYXRpb25cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3N1xuICByZXR1cm4gdjhWZXJzaW9uID49IDUxIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gYXJyYXkuY29uc3RydWN0b3IgPSB7fTtcbiAgICBjb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7IGZvbzogMSB9O1xuICAgIH07XG4gICAgcmV0dXJuIGFycmF5W01FVEhPRF9OQU1FXShCb29sZWFuKS5mb28gIT09IDE7XG4gIH0pO1xufTtcblxudmFyIFNQRUNJRVMkMSA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xudmFyIG5hdGl2ZVNsaWNlID0gW10uc2xpY2U7XG52YXIgbWF4JDEgPSBNYXRoLm1heDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5zbGljZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc2xpY2Vcbi8vIGZhbGxiYWNrIGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5ncyBhbmQgRE9NIG9iamVjdHNcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdzbGljZScpIH0sIHtcbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBrID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW5ndGgpO1xuICAgIHZhciBmaW4gPSB0b0Fic29sdXRlSW5kZXgoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiBlbmQsIGxlbmd0aCk7XG4gICAgLy8gaW5saW5lIGBBcnJheVNwZWNpZXNDcmVhdGVgIGZvciB1c2FnZSBuYXRpdmUgYEFycmF5I3NsaWNlYCB3aGVyZSBpdCdzIHBvc3NpYmxlXG4gICAgdmFyIENvbnN0cnVjdG9yLCByZXN1bHQsIG47XG4gICAgaWYgKGlzQXJyYXkoTykpIHtcbiAgICAgIENvbnN0cnVjdG9yID0gTy5jb25zdHJ1Y3RvcjtcbiAgICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgICBpZiAodHlwZW9mIENvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgKENvbnN0cnVjdG9yID09PSBBcnJheSB8fCBpc0FycmF5KENvbnN0cnVjdG9yLnByb3RvdHlwZSkpKSB7XG4gICAgICAgIENvbnN0cnVjdG9yID0gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcltTUEVDSUVTJDFdO1xuICAgICAgICBpZiAoQ29uc3RydWN0b3IgPT09IG51bGwpIENvbnN0cnVjdG9yID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKENvbnN0cnVjdG9yID09PSBBcnJheSB8fCBDb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVTbGljZS5jYWxsKE8sIGssIGZpbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdCA9IG5ldyAoQ29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQ29uc3RydWN0b3IpKG1heCQxKGZpbiAtIGssIDApKTtcbiAgICBmb3IgKG4gPSAwOyBrIDwgZmluOyBrKyssIG4rKykgaWYgKGsgaW4gTykgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBuLCBPW2tdKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyIEZ1bmN0aW9uUHJvdG90eXBlVG9TdHJpbmcgPSBGdW5jdGlvblByb3RvdHlwZS50b1N0cmluZztcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gRnVuY3Rpb24gaW5zdGFuY2VzIGAubmFtZWAgcHJvcGVydHlcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWZ1bmN0aW9uLWluc3RhbmNlcy1uYW1lXG5pZiAoZGVzY3JpcHRvcnMgJiYgIShOQU1FIGluIEZ1bmN0aW9uUHJvdG90eXBlKSkge1xuICBkZWZpbmVQcm9wZXJ0eShGdW5jdGlvblByb3RvdHlwZSwgTkFNRSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBGdW5jdGlvblByb3RvdHlwZVRvU3RyaW5nLmNhbGwodGhpcykubWF0Y2gobmFtZVJFKVsxXTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyA9IG9iamVjdEdldE93blByb3BlcnR5TmFtZXMuZjtcblxudmFyIHRvU3RyaW5nJDEgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uIChpdCkge1xuICB0cnkge1xuICAgIHJldHVybiBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIGYkNSA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nJDEuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XSdcbiAgICA/IGdldFdpbmRvd05hbWVzKGl0KVxuICAgIDogbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyh0b0luZGV4ZWRPYmplY3QoaXQpKTtcbn07XG5cbnZhciBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzRXh0ZXJuYWwgPSB7XG5cdGY6IGYkNVxufTtcblxudmFyIG5hdGl2ZUdldE93blByb3BlcnR5TmFtZXMkMSA9IG9iamVjdEdldE93blByb3BlcnR5TmFtZXNFeHRlcm5hbC5mO1xuXG52YXIgRkFJTFNfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuICFPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcygxKTsgfSk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogRkFJTFNfT05fUFJJTUlUSVZFUyB9LCB7XG4gIGdldE93blByb3BlcnR5TmFtZXM6IG5hdGl2ZUdldE93blByb3BlcnR5TmFtZXMkMVxufSk7XG5cbmZ1bmN0aW9uIF90eXBlb2YyKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZjIgPSBmdW5jdGlvbiBfdHlwZW9mMihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YyID0gZnVuY3Rpb24gX3R5cGVvZjIob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mMihvYmopOyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZjIoU3ltYm9sLml0ZXJhdG9yKSA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIF90eXBlb2YyKG9iaik7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiBfdHlwZW9mMihvYmopO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG4vLyBgVG9PYmplY3RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9vYmplY3RcbnZhciB0b09iamVjdCA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpKTtcbn07XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuIG9iamVjdEtleXNJbnRlcm5hbChPLCBlbnVtQnVnS2V5cyk7XG59O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnRpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbnZhciBvYmplY3REZWZpbmVQcm9wZXJ0aWVzID0gZGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsZW5ndGggPiBpbmRleCkgb2JqZWN0RGVmaW5lUHJvcGVydHkuZihPLCBrZXkgPSBrZXlzW2luZGV4KytdLCBQcm9wZXJ0aWVzW2tleV0pO1xuICByZXR1cm4gTztcbn07XG5cbnZhciBodG1sID0gZ2V0QnVpbHRJbignZG9jdW1lbnQnLCAnZG9jdW1lbnRFbGVtZW50Jyk7XG5cbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcblxudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIHNjcmlwdCA9ICdzY3JpcHQnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBqcyA9ICdqYXZhJyArIHNjcmlwdCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gU3RyaW5nKGpzKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArIHNjcmlwdCArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy8nICsgc2NyaXB0ICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGxlbmd0aC0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxuLy8gYE9iamVjdC5jcmVhdGVgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmNyZWF0ZVxudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogb2JqZWN0RGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcblxuaGlkZGVuS2V5c1tJRV9QUk9UT10gPSB0cnVlO1xuXG52YXIgZiQ2ID0gd2VsbEtub3duU3ltYm9sO1xuXG52YXIgd3JhcHBlZFdlbGxLbm93blN5bWJvbCA9IHtcblx0ZjogZiQ2XG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkkMSA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG5cbnZhciBkZWZpbmVXZWxsS25vd25TeW1ib2wgPSBmdW5jdGlvbiAoTkFNRSkge1xuICB2YXIgU3ltYm9sID0gcGF0aC5TeW1ib2wgfHwgKHBhdGguU3ltYm9sID0ge30pO1xuICBpZiAoIWhhcyhTeW1ib2wsIE5BTUUpKSBkZWZpbmVQcm9wZXJ0eSQxKFN5bWJvbCwgTkFNRSwge1xuICAgIHZhbHVlOiB3cmFwcGVkV2VsbEtub3duU3ltYm9sLmYoTkFNRSlcbiAgfSk7XG59O1xuXG52YXIgZGVmaW5lUHJvcGVydHkkMiA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG5cblxuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcblxudmFyIHNldFRvU3RyaW5nVGFnID0gZnVuY3Rpb24gKGl0LCBUQUcsIFNUQVRJQykge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IFNUQVRJQyA/IGl0IDogaXQucHJvdG90eXBlLCBUT19TVFJJTkdfVEFHKSkge1xuICAgIGRlZmluZVByb3BlcnR5JDIoaXQsIFRPX1NUUklOR19UQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogVEFHIH0pO1xuICB9XG59O1xuXG52YXIgYUZ1bmN0aW9uJDEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcblxuLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYmluZENvbnRleHQgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24kMShmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0KTtcbiAgICB9O1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxudmFyIFNQRUNJRVMkMiA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG4vLyBgQXJyYXlTcGVjaWVzQ3JlYXRlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5c3BlY2llc2NyZWF0ZVxudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTJDJdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBuZXcgKEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQykobGVuZ3RoID09PSAwID8gMCA6IGxlbmd0aCk7XG59O1xuXG52YXIgcHVzaCA9IFtdLnB1c2g7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBmb3JFYWNoLCBtYXAsIGZpbHRlciwgc29tZSwgZXZlcnksIGZpbmQsIGZpbmRJbmRleCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kJDEgPSBmdW5jdGlvbiAoVFlQRSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQsIHNwZWNpZmljQ3JlYXRlKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBpbmRleGVkT2JqZWN0KE8pO1xuICAgIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZENvbnRleHQoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjcmVhdGUgPSBzcGVjaWZpY0NyZWF0ZSB8fCBhcnJheVNwZWNpZXNDcmVhdGU7XG4gICAgdmFyIHRhcmdldCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbHVlLCByZXN1bHQ7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWx1ZSA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzdWx0ID0gYm91bmRGdW5jdGlvbih2YWx1ZSwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgdGFyZ2V0W2luZGV4XSA9IHJlc3VsdDsgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCkgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWx1ZTsgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHB1c2guY2FsbCh0YXJnZXQsIHZhbHVlKTsgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiB0YXJnZXQ7XG4gIH07XG59O1xuXG52YXIgYXJyYXlJdGVyYXRpb24gPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4gIGZvckVhY2g6IGNyZWF0ZU1ldGhvZCQxKDApLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5tYXBcbiAgbWFwOiBjcmVhdGVNZXRob2QkMSgxKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maWx0ZXJgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmlsdGVyXG4gIGZpbHRlcjogY3JlYXRlTWV0aG9kJDEoMiksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuc29tZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zb21lXG4gIHNvbWU6IGNyZWF0ZU1ldGhvZCQxKDMpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmV2ZXJ5YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmV2ZXJ5XG4gIGV2ZXJ5OiBjcmVhdGVNZXRob2QkMSg0KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRcbiAgZmluZDogY3JlYXRlTWV0aG9kJDEoNSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRJbmRleFxuICBmaW5kSW5kZXg6IGNyZWF0ZU1ldGhvZCQxKDYpXG59O1xuXG52YXIgJGZvckVhY2ggPSBhcnJheUl0ZXJhdGlvbi5mb3JFYWNoO1xuXG52YXIgSElEREVOID0gc2hhcmVkS2V5KCdoaWRkZW4nKTtcbnZhciBTWU1CT0wgPSAnU3ltYm9sJztcbnZhciBQUk9UT1RZUEUkMSA9ICdwcm90b3R5cGUnO1xudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcbnZhciBzZXRJbnRlcm5hbFN0YXRlID0gaW50ZXJuYWxTdGF0ZS5zZXQ7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IGludGVybmFsU3RhdGUuZ2V0dGVyRm9yKFNZTUJPTCk7XG52YXIgT2JqZWN0UHJvdG90eXBlID0gT2JqZWN0W1BST1RPVFlQRSQxXTtcbnZhciAkU3ltYm9sID0gZ2xvYmFsXzEuU3ltYm9sO1xudmFyIEpTT04kMSA9IGdsb2JhbF8xLkpTT047XG52YXIgbmF0aXZlSlNPTlN0cmluZ2lmeSA9IEpTT04kMSAmJiBKU09OJDEuc3RyaW5naWZ5O1xudmFyIG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciQxID0gb2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLmY7XG52YXIgbmF0aXZlRGVmaW5lUHJvcGVydHkkMSA9IG9iamVjdERlZmluZVByb3BlcnR5LmY7XG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyQyID0gb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lc0V4dGVybmFsLmY7XG52YXIgbmF0aXZlUHJvcGVydHlJc0VudW1lcmFibGUkMSA9IG9iamVjdFByb3BlcnR5SXNFbnVtZXJhYmxlLmY7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvdHlwZVN5bWJvbHMgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKTtcbnZhciBTdHJpbmdUb1N5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzdHJpbmctdG8tc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgU3ltYm9sVG9TdHJpbmdSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXRvLXN0cmluZy1yZWdpc3RyeScpO1xudmFyIFdlbGxLbm93blN5bWJvbHNTdG9yZSA9IHNoYXJlZCgnd2tzJyk7XG52YXIgUU9iamVjdCA9IGdsb2JhbF8xLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBVU0VfU0VUVEVSID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFJDFdIHx8ICFRT2JqZWN0W1BST1RPVFlQRSQxXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2NyaXB0b3IgPSBkZXNjcmlwdG9ycyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvYmplY3RDcmVhdGUobmF0aXZlRGVmaW5lUHJvcGVydHkkMSh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eSQxKHRoaXMsICdhJywgeyB2YWx1ZTogNyB9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uIChPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIHZhciBPYmplY3RQcm90b3R5cGVEZXNjcmlwdG9yID0gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDEoT2JqZWN0UHJvdG90eXBlLCBQKTtcbiAgaWYgKE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IpIGRlbGV0ZSBPYmplY3RQcm90b3R5cGVbUF07XG4gIG5hdGl2ZURlZmluZVByb3BlcnR5JDEoTywgUCwgQXR0cmlidXRlcyk7XG4gIGlmIChPYmplY3RQcm90b3R5cGVEZXNjcmlwdG9yICYmIE8gIT09IE9iamVjdFByb3RvdHlwZSkge1xuICAgIG5hdGl2ZURlZmluZVByb3BlcnR5JDEoT2JqZWN0UHJvdG90eXBlLCBQLCBPYmplY3RQcm90b3R5cGVEZXNjcmlwdG9yKTtcbiAgfVxufSA6IG5hdGl2ZURlZmluZVByb3BlcnR5JDE7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24gKHRhZywgZGVzY3JpcHRpb24pIHtcbiAgdmFyIHN5bWJvbCA9IEFsbFN5bWJvbHNbdGFnXSA9IG9iamVjdENyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRSQxXSk7XG4gIHNldEludGVybmFsU3RhdGUoc3ltYm9sLCB7XG4gICAgdHlwZTogU1lNQk9MLFxuICAgIHRhZzogdGFnLFxuICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblxuICB9KTtcbiAgaWYgKCFkZXNjcmlwdG9ycykgc3ltYm9sLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gIHJldHVybiBzeW1ib2w7XG59O1xuXG52YXIgaXNTeW1ib2wgPSBuYXRpdmVTeW1ib2wgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChpdCkgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgaWYgKE8gPT09IE9iamVjdFByb3RvdHlwZSkgJGRlZmluZVByb3BlcnR5KE9iamVjdFByb3RvdHlwZVN5bWJvbHMsIFAsIEF0dHJpYnV0ZXMpO1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpKSB7XG4gICAgaWYgKCFBdHRyaWJ1dGVzLmVudW1lcmFibGUpIHtcbiAgICAgIGlmICghaGFzKE8sIEhJRERFTikpIG5hdGl2ZURlZmluZVByb3BlcnR5JDEoTywgSElEREVOLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwge30pKTtcbiAgICAgIE9bSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhPLCBISURERU4pICYmIE9bSElEREVOXVtrZXldKSBPW0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgQXR0cmlidXRlcyA9IG9iamVjdENyZWF0ZShBdHRyaWJ1dGVzLCB7IGVudW1lcmFibGU6IGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigwLCBmYWxzZSkgfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzY3JpcHRvcihPLCBrZXksIEF0dHJpYnV0ZXMpO1xuICB9IHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eSQxKE8sIGtleSwgQXR0cmlidXRlcyk7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBwcm9wZXJ0aWVzID0gdG9JbmRleGVkT2JqZWN0KFByb3BlcnRpZXMpO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMocHJvcGVydGllcykuY29uY2F0KCRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMocHJvcGVydGllcykpO1xuICAkZm9yRWFjaChrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCFkZXNjcmlwdG9ycyB8fCAkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChwcm9wZXJ0aWVzLCBrZXkpKSAkZGVmaW5lUHJvcGVydHkoTywga2V5LCBwcm9wZXJ0aWVzW2tleV0pO1xuICB9KTtcbiAgcmV0dXJuIE87XG59O1xuXG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyBvYmplY3RDcmVhdGUoTykgOiAkZGVmaW5lUHJvcGVydGllcyhvYmplY3RDcmVhdGUoTyksIFByb3BlcnRpZXMpO1xufTtcblxudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIFAgPSB0b1ByaW1pdGl2ZShWLCB0cnVlKTtcbiAgdmFyIGVudW1lcmFibGUgPSBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSQxLmNhbGwodGhpcywgUCk7XG4gIGlmICh0aGlzID09PSBPYmplY3RQcm90b3R5cGUgJiYgaGFzKEFsbFN5bWJvbHMsIFApICYmICFoYXMoT2JqZWN0UHJvdG90eXBlU3ltYm9scywgUCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIGVudW1lcmFibGUgfHwgIWhhcyh0aGlzLCBQKSB8fCAhaGFzKEFsbFN5bWJvbHMsIFApIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtQXSA/IGVudW1lcmFibGUgOiB0cnVlO1xufTtcblxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICB2YXIgaXQgPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIHZhciBrZXkgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90b3R5cGUgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPYmplY3RQcm90b3R5cGVTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBkZXNjcmlwdG9yID0gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDEoaXQsIGtleSk7XG4gIGlmIChkZXNjcmlwdG9yICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIHtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB0cnVlO1xuICB9XG4gIHJldHVybiBkZXNjcmlwdG9yO1xufTtcblxudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHZhciBuYW1lcyA9IG5hdGl2ZUdldE93blByb3BlcnR5TmFtZXMkMih0b0luZGV4ZWRPYmplY3QoTykpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gICRmb3JFYWNoKG5hbWVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKGhpZGRlbktleXMsIGtleSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTykge1xuICB2YXIgSVNfT0JKRUNUX1BST1RPVFlQRSA9IE8gPT09IE9iamVjdFByb3RvdHlwZTtcbiAgdmFyIG5hbWVzID0gbmF0aXZlR2V0T3duUHJvcGVydHlOYW1lcyQyKElTX09CSkVDVF9QUk9UT1RZUEUgPyBPYmplY3RQcm90b3R5cGVTeW1ib2xzIDogdG9JbmRleGVkT2JqZWN0KE8pKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICAkZm9yRWFjaChuYW1lcywgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSAmJiAoIUlTX09CSkVDVF9QUk9UT1RZUEUgfHwgaGFzKE9iamVjdFByb3RvdHlwZSwga2V5KSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIGBTeW1ib2xgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zeW1ib2wtY29uc3RydWN0b3JcbmlmICghbmF0aXZlU3ltYm9sKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICFhcmd1bWVudHMubGVuZ3RoIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogU3RyaW5nKGFyZ3VtZW50c1swXSk7XG4gICAgdmFyIHRhZyA9IHVpZChkZXNjcmlwdGlvbik7XG4gICAgdmFyIHNldHRlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvdHlwZSkgc2V0dGVyLmNhbGwoT2JqZWN0UHJvdG90eXBlU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjcmlwdG9yKHRoaXMsIHRhZywgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoZGVzY3JpcHRvcnMgJiYgVVNFX1NFVFRFUikgc2V0U3ltYm9sRGVzY3JpcHRvcihPYmplY3RQcm90b3R5cGUsIHRhZywgeyBjb25maWd1cmFibGU6IHRydWUsIHNldDogc2V0dGVyIH0pO1xuICAgIHJldHVybiB3cmFwKHRhZywgZGVzY3JpcHRpb24pO1xuICB9O1xuXG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFJDFdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKS50YWc7XG4gIH0pO1xuXG4gIG9iamVjdFByb3BlcnR5SXNFbnVtZXJhYmxlLmYgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIG9iamVjdERlZmluZVByb3BlcnR5LmYgPSAkZGVmaW5lUHJvcGVydHk7XG4gIG9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvci5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lcy5mID0gb2JqZWN0R2V0T3duUHJvcGVydHlOYW1lc0V4dGVybmFsLmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgb2JqZWN0R2V0T3duUHJvcGVydHlTeW1ib2xzLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmIChkZXNjcmlwdG9ycykge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLVN5bWJvbC1kZXNjcmlwdGlvblxuICAgIG5hdGl2ZURlZmluZVByb3BlcnR5JDEoJFN5bWJvbFtQUk9UT1RZUEUkMV0sICdkZXNjcmlwdGlvbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gZGVzY3JpcHRpb24oKSB7XG4gICAgICAgIHJldHVybiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLmRlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHtcbiAgICAgIHJlZGVmaW5lKE9iamVjdFByb3RvdHlwZSwgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB7IHVuc2FmZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cblxuICB3cmFwcGVkV2VsbEtub3duU3ltYm9sLmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdlbGxLbm93blN5bWJvbChuYW1lKSwgbmFtZSk7XG4gIH07XG59XG5cbl9leHBvcnQoeyBnbG9iYWw6IHRydWUsIHdyYXA6IHRydWUsIGZvcmNlZDogIW5hdGl2ZVN5bWJvbCwgc2hhbTogIW5hdGl2ZVN5bWJvbCB9LCB7XG4gIFN5bWJvbDogJFN5bWJvbFxufSk7XG5cbiRmb3JFYWNoKG9iamVjdEtleXMoV2VsbEtub3duU3ltYm9sc1N0b3JlKSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZGVmaW5lV2VsbEtub3duU3ltYm9sKG5hbWUpO1xufSk7XG5cbl9leHBvcnQoeyB0YXJnZXQ6IFNZTUJPTCwgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhbmF0aXZlU3ltYm9sIH0sIHtcbiAgLy8gYFN5bWJvbC5mb3JgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zeW1ib2wuZm9yXG4gICdmb3InOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyhrZXkpO1xuICAgIGlmIChoYXMoU3RyaW5nVG9TeW1ib2xSZWdpc3RyeSwgc3RyaW5nKSkgcmV0dXJuIFN0cmluZ1RvU3ltYm9sUmVnaXN0cnlbc3RyaW5nXTtcbiAgICB2YXIgc3ltYm9sID0gJFN5bWJvbChzdHJpbmcpO1xuICAgIFN0cmluZ1RvU3ltYm9sUmVnaXN0cnlbc3RyaW5nXSA9IHN5bWJvbDtcbiAgICBTeW1ib2xUb1N0cmluZ1JlZ2lzdHJ5W3N5bWJvbF0gPSBzdHJpbmc7XG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfSxcbiAgLy8gYFN5bWJvbC5rZXlGb3JgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zeW1ib2wua2V5Zm9yXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sJyk7XG4gICAgaWYgKGhhcyhTeW1ib2xUb1N0cmluZ1JlZ2lzdHJ5LCBzeW0pKSByZXR1cm4gU3ltYm9sVG9TdHJpbmdSZWdpc3RyeVtzeW1dO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uICgpIHsgVVNFX1NFVFRFUiA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBVU0VfU0VUVEVSID0gZmFsc2U7IH1cbn0pO1xuXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhbmF0aXZlU3ltYm9sLCBzaGFtOiAhZGVzY3JpcHRvcnMgfSwge1xuICAvLyBgT2JqZWN0LmNyZWF0ZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5jcmVhdGVcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnR5XG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0aWVzXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JzXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvclxufSk7XG5cbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6ICFuYXRpdmVTeW1ib2wgfSwge1xuICAvLyBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlzeW1ib2xzXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIENocm9tZSAzOCBhbmQgMzkgYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNgIGZhaWxzIG9uIHByaW1pdGl2ZXNcbi8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTM0NDNcbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IGZhaWxzKGZ1bmN0aW9uICgpIHsgb2JqZWN0R2V0T3duUHJvcGVydHlTeW1ib2xzLmYoMSk7IH0pIH0sIHtcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgICByZXR1cm4gb2JqZWN0R2V0T3duUHJvcGVydHlTeW1ib2xzLmYodG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG5cbi8vIGBKU09OLnN0cmluZ2lmeWAgbWV0aG9kIGJlaGF2aW9yIHdpdGggc3ltYm9sc1xuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtanNvbi5zdHJpbmdpZnlcbkpTT04kMSAmJiBfZXhwb3J0KHsgdGFyZ2V0OiAnSlNPTicsIHN0YXQ6IHRydWUsIGZvcmNlZDogIW5hdGl2ZVN5bWJvbCB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBzeW1ib2wgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIHJldHVybiBuYXRpdmVKU09OU3RyaW5naWZ5KFtzeW1ib2xdKSAhPSAnW251bGxdJ1xuICAgIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAgIHx8IG5hdGl2ZUpTT05TdHJpbmdpZnkoeyBhOiBzeW1ib2wgfSkgIT0gJ3t9J1xuICAgIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gICAgfHwgbmF0aXZlSlNPTlN0cmluZ2lmeShPYmplY3Qoc3ltYm9sKSkgIT0gJ3t9Jztcbn0pIH0sIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpIHtcbiAgICB2YXIgYXJncyA9IFtpdF07XG4gICAgdmFyIGluZGV4ID0gMTtcbiAgICB2YXIgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGluZGV4KSBhcmdzLnB1c2goYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICAkcmVwbGFjZXIgPSByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYgKCFpc09iamVjdChyZXBsYWNlcikgJiYgaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpIHJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIGlmICghaXNBcnJheShyZXBsYWNlcikpIHJlcGxhY2VyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgJHJlcGxhY2VyID09ICdmdW5jdGlvbicpIHZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBuYXRpdmVKU09OU3RyaW5naWZ5LmFwcGx5KEpTT04kMSwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyBgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zeW1ib2wucHJvdG90eXBlLUBAdG9wcmltaXRpdmVcbmlmICghJFN5bWJvbFtQUk9UT1RZUEUkMV1bVE9fUFJJTUlUSVZFXSkge1xuICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoJFN5bWJvbFtQUk9UT1RZUEUkMV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEUkMV0udmFsdWVPZik7XG59XG4vLyBgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXWAgcHJvcGVydHlcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZ1xuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgU1lNQk9MKTtcblxuaGlkZGVuS2V5c1tISURERU5dID0gdHJ1ZTtcblxudmFyIGRlZmluZVByb3BlcnR5JDMgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuXG5cbnZhciBOYXRpdmVTeW1ib2wgPSBnbG9iYWxfMS5TeW1ib2w7XG5cbmlmIChkZXNjcmlwdG9ycyAmJiB0eXBlb2YgTmF0aXZlU3ltYm9sID09ICdmdW5jdGlvbicgJiYgKCEoJ2Rlc2NyaXB0aW9uJyBpbiBOYXRpdmVTeW1ib2wucHJvdG90eXBlKSB8fFxuICAvLyBTYWZhcmkgMTIgYnVnXG4gIE5hdGl2ZVN5bWJvbCgpLmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWRcbikpIHtcbiAgdmFyIEVtcHR5U3RyaW5nRGVzY3JpcHRpb25TdG9yZSA9IHt9O1xuICAvLyB3cmFwIFN5bWJvbCBjb25zdHJ1Y3RvciBmb3IgY29ycmVjdCB3b3JrIHdpdGggdW5kZWZpbmVkIGRlc2NyaXB0aW9uXG4gIHZhciBTeW1ib2xXcmFwcGVyID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPCAxIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogU3RyaW5nKGFyZ3VtZW50c1swXSk7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMgaW5zdGFuY2VvZiBTeW1ib2xXcmFwcGVyXG4gICAgICA/IG5ldyBOYXRpdmVTeW1ib2woZGVzY3JpcHRpb24pXG4gICAgICAvLyBpbiBFZGdlIDEzLCBTdHJpbmcoU3ltYm9sKHVuZGVmaW5lZCkpID09PSAnU3ltYm9sKHVuZGVmaW5lZCknXG4gICAgICA6IGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgPyBOYXRpdmVTeW1ib2woKSA6IE5hdGl2ZVN5bWJvbChkZXNjcmlwdGlvbik7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSAnJykgRW1wdHlTdHJpbmdEZXNjcmlwdGlvblN0b3JlW3Jlc3VsdF0gPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoU3ltYm9sV3JhcHBlciwgTmF0aXZlU3ltYm9sKTtcbiAgdmFyIHN5bWJvbFByb3RvdHlwZSA9IFN5bWJvbFdyYXBwZXIucHJvdG90eXBlID0gTmF0aXZlU3ltYm9sLnByb3RvdHlwZTtcbiAgc3ltYm9sUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ltYm9sV3JhcHBlcjtcblxuICB2YXIgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBuYXRpdmUgPSBTdHJpbmcoTmF0aXZlU3ltYm9sKCd0ZXN0JykpID09ICdTeW1ib2wodGVzdCknO1xuICB2YXIgcmVnZXhwID0gL15TeW1ib2xcXCgoLiopXFwpW14pXSskLztcbiAgZGVmaW5lUHJvcGVydHkkMyhzeW1ib2xQcm90b3R5cGUsICdkZXNjcmlwdGlvbicsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBkZXNjcmlwdGlvbigpIHtcbiAgICAgIHZhciBzeW1ib2wgPSBpc09iamVjdCh0aGlzKSA/IHRoaXMudmFsdWVPZigpIDogdGhpcztcbiAgICAgIHZhciBzdHJpbmcgPSBzeW1ib2xUb1N0cmluZy5jYWxsKHN5bWJvbCk7XG4gICAgICBpZiAoaGFzKEVtcHR5U3RyaW5nRGVzY3JpcHRpb25TdG9yZSwgc3ltYm9sKSkgcmV0dXJuICcnO1xuICAgICAgdmFyIGRlc2MgPSBuYXRpdmUgPyBzdHJpbmcuc2xpY2UoNywgLTEpIDogc3RyaW5nLnJlcGxhY2UocmVnZXhwLCAnJDEnKTtcbiAgICAgIHJldHVybiBkZXNjID09PSAnJyA/IHVuZGVmaW5lZCA6IGRlc2M7XG4gICAgfVxuICB9KTtcblxuICBfZXhwb3J0KHsgZ2xvYmFsOiB0cnVlLCBmb3JjZWQ6IHRydWUgfSwge1xuICAgIFN5bWJvbDogU3ltYm9sV3JhcHBlclxuICB9KTtcbn1cblxuLy8gYFN5bWJvbC5pdGVyYXRvcmAgd2VsbC1rbm93biBzeW1ib2xcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN5bWJvbC5pdGVyYXRvclxuZGVmaW5lV2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xuXG52YXIgVU5TQ09QQUJMRVMgPSB3ZWxsS25vd25TeW1ib2woJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGU7XG5cbi8vIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmlmIChBcnJheVByb3RvdHlwZVtVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShBcnJheVByb3RvdHlwZSwgVU5TQ09QQUJMRVMsIG9iamVjdENyZWF0ZShudWxsKSk7XG59XG5cbi8vIGFkZCBhIGtleSB0byBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gZnVuY3Rpb24gKGtleSkge1xuICBBcnJheVByb3RvdHlwZVtVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59O1xuXG52YXIgaXRlcmF0b3JzID0ge307XG5cbnZhciBjb3JyZWN0UHJvdG90eXBlR2V0dGVyID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICBGLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG51bGw7XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IEYoKSkgIT09IEYucHJvdG90eXBlO1xufSk7XG5cbnZhciBJRV9QUk9UTyQxID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvdHlwZSQxID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0cHJvdG90eXBlb2ZcbnZhciBvYmplY3RHZXRQcm90b3R5cGVPZiA9IGNvcnJlY3RQcm90b3R5cGVHZXR0ZXIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8kMSkpIHJldHVybiBPW0lFX1BST1RPJDFdO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvdHlwZSQxIDogbnVsbDtcbn07XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBCVUdHWV9TQUZBUklfSVRFUkFUT1JTID0gZmFsc2U7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxuLy8gYCVJdGVyYXRvclByb3RvdHlwZSVgIG9iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtJWl0ZXJhdG9ycHJvdG90eXBlJS1vYmplY3RcbnZhciBJdGVyYXRvclByb3RvdHlwZSwgUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlLCBhcnJheUl0ZXJhdG9yO1xuXG5pZiAoW10ua2V5cykge1xuICBhcnJheUl0ZXJhdG9yID0gW10ua2V5cygpO1xuICAvLyBTYWZhcmkgOCBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgaWYgKCEoJ25leHQnIGluIGFycmF5SXRlcmF0b3IpKSBCVUdHWV9TQUZBUklfSVRFUkFUT1JTID0gdHJ1ZTtcbiAgZWxzZSB7XG4gICAgUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gb2JqZWN0R2V0UHJvdG90eXBlT2Yob2JqZWN0R2V0UHJvdG90eXBlT2YoYXJyYXlJdGVyYXRvcikpO1xuICAgIGlmIChQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpIEl0ZXJhdG9yUHJvdG90eXBlID0gUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG59XG5cbmlmIChJdGVyYXRvclByb3RvdHlwZSA9PSB1bmRlZmluZWQpIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5pZiAoICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSkge1xuICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbn1cblxudmFyIGl0ZXJhdG9yc0NvcmUgPSB7XG4gIEl0ZXJhdG9yUHJvdG90eXBlOiBJdGVyYXRvclByb3RvdHlwZSxcbiAgQlVHR1lfU0FGQVJJX0lURVJBVE9SUzogQlVHR1lfU0FGQVJJX0lURVJBVE9SU1xufTtcblxudmFyIEl0ZXJhdG9yUHJvdG90eXBlJDEgPSBpdGVyYXRvcnNDb3JlLkl0ZXJhdG9yUHJvdG90eXBlO1xuXG5cblxuXG5cbnZhciByZXR1cm5UaGlzJDEgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG52YXIgY3JlYXRlSXRlcmF0b3JDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIChJdGVyYXRvckNvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIHZhciBUT19TVFJJTkdfVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICBJdGVyYXRvckNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IG9iamVjdENyZWF0ZShJdGVyYXRvclByb3RvdHlwZSQxLCB7IG5leHQ6IGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JDb25zdHJ1Y3RvciwgVE9fU1RSSU5HX1RBRywgZmFsc2UpO1xuICBpdGVyYXRvcnNbVE9fU1RSSU5HX1RBR10gPSByZXR1cm5UaGlzJDE7XG4gIHJldHVybiBJdGVyYXRvckNvbnN0cnVjdG9yO1xufTtcblxudmFyIGFQb3NzaWJsZVByb3RvdHlwZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSAmJiBpdCAhPT0gbnVsbCkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbid0IHNldCBcIiArIFN0cmluZyhpdCkgKyAnIGFzIGEgcHJvdG90eXBlJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcblxuLy8gYE9iamVjdC5zZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3Quc2V0cHJvdG90eXBlb2Zcbi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBvYmplY3RTZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyBmdW5jdGlvbiAoKSB7XG4gIHZhciBDT1JSRUNUX1NFVFRFUiA9IGZhbHNlO1xuICB2YXIgdGVzdCA9IHt9O1xuICB2YXIgc2V0dGVyO1xuICB0cnkge1xuICAgIHNldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldDtcbiAgICBzZXR0ZXIuY2FsbCh0ZXN0LCBbXSk7XG4gICAgQ09SUkVDVF9TRVRURVIgPSB0ZXN0IGluc3RhbmNlb2YgQXJyYXk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgYW5PYmplY3QoTyk7XG4gICAgYVBvc3NpYmxlUHJvdG90eXBlKHByb3RvKTtcbiAgICBpZiAoQ09SUkVDVF9TRVRURVIpIHNldHRlci5jYWxsKE8sIHByb3RvKTtcbiAgICBlbHNlIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgcmV0dXJuIE87XG4gIH07XG59KCkgOiB1bmRlZmluZWQpO1xuXG52YXIgSXRlcmF0b3JQcm90b3R5cGUkMiA9IGl0ZXJhdG9yc0NvcmUuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyQxID0gaXRlcmF0b3JzQ29yZS5CVUdHWV9TQUZBUklfSVRFUkFUT1JTO1xudmFyIElURVJBVE9SJDEgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcbnZhciBFTlRSSUVTID0gJ2VudHJpZXMnO1xuXG52YXIgcmV0dXJuVGhpcyQyID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxudmFyIGRlZmluZUl0ZXJhdG9yID0gZnVuY3Rpb24gKEl0ZXJhYmxlLCBOQU1FLCBJdGVyYXRvckNvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICBjcmVhdGVJdGVyYXRvckNvbnN0cnVjdG9yKEl0ZXJhdG9yQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuXG4gIHZhciBnZXRJdGVyYXRpb25NZXRob2QgPSBmdW5jdGlvbiAoS0lORCkge1xuICAgIGlmIChLSU5EID09PSBERUZBVUxUICYmIGRlZmF1bHRJdGVyYXRvcikgcmV0dXJuIGRlZmF1bHRJdGVyYXRvcjtcbiAgICBpZiAoIUJVR0dZX1NBRkFSSV9JVEVSQVRPUlMkMSAmJiBLSU5EIGluIEl0ZXJhYmxlUHJvdG90eXBlKSByZXR1cm4gSXRlcmFibGVQcm90b3R5cGVbS0lORF07XG4gICAgc3dpdGNoIChLSU5EKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgICAgY2FzZSBFTlRSSUVTOiByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMpOyB9O1xuICB9O1xuXG4gIHZhciBUT19TVFJJTkdfVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgSU5DT1JSRUNUX1ZBTFVFU19OQU1FID0gZmFsc2U7XG4gIHZhciBJdGVyYWJsZVByb3RvdHlwZSA9IEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgdmFyIG5hdGl2ZUl0ZXJhdG9yID0gSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1IkMV1cbiAgICB8fCBJdGVyYWJsZVByb3RvdHlwZVsnQEBpdGVyYXRvciddXG4gICAgfHwgREVGQVVMVCAmJiBJdGVyYWJsZVByb3RvdHlwZVtERUZBVUxUXTtcbiAgdmFyIGRlZmF1bHRJdGVyYXRvciA9ICFCVUdHWV9TQUZBUklfSVRFUkFUT1JTJDEgJiYgbmF0aXZlSXRlcmF0b3IgfHwgZ2V0SXRlcmF0aW9uTWV0aG9kKERFRkFVTFQpO1xuICB2YXIgYW55TmF0aXZlSXRlcmF0b3IgPSBOQU1FID09ICdBcnJheScgPyBJdGVyYWJsZVByb3RvdHlwZS5lbnRyaWVzIHx8IG5hdGl2ZUl0ZXJhdG9yIDogbmF0aXZlSXRlcmF0b3I7XG4gIHZhciBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUsIG1ldGhvZHMsIEtFWTtcblxuICAvLyBmaXggbmF0aXZlXG4gIGlmIChhbnlOYXRpdmVJdGVyYXRvcikge1xuICAgIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSA9IG9iamVjdEdldFByb3RvdHlwZU9mKGFueU5hdGl2ZUl0ZXJhdG9yLmNhbGwobmV3IEl0ZXJhYmxlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUkMiAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgaWYgKCBvYmplY3RHZXRQcm90b3R5cGVPZihDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUpICE9PSBJdGVyYXRvclByb3RvdHlwZSQyKSB7XG4gICAgICAgIGlmIChvYmplY3RTZXRQcm90b3R5cGVPZikge1xuICAgICAgICAgIG9iamVjdFNldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgSXRlcmF0b3JQcm90b3R5cGUkMik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUiQxXSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IkMSwgcmV0dXJuVGhpcyQyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZBVUxUID09IFZBTFVFUyAmJiBuYXRpdmVJdGVyYXRvciAmJiBuYXRpdmVJdGVyYXRvci5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgPSB0cnVlO1xuICAgIGRlZmF1bHRJdGVyYXRvciA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5hdGl2ZUl0ZXJhdG9yLmNhbGwodGhpcyk7IH07XG4gIH1cblxuICAvLyBkZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUiQxXSAhPT0gZGVmYXVsdEl0ZXJhdG9yKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhYmxlUHJvdG90eXBlLCBJVEVSQVRPUiQxLCBkZWZhdWx0SXRlcmF0b3IpO1xuICB9XG4gIGl0ZXJhdG9yc1tOQU1FXSA9IGRlZmF1bHRJdGVyYXRvcjtcblxuICAvLyBleHBvcnQgYWRkaXRpb25hbCBtZXRob2RzXG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogZ2V0SXRlcmF0aW9uTWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyBkZWZhdWx0SXRlcmF0b3IgOiBnZXRJdGVyYXRpb25NZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiBnZXRJdGVyYXRpb25NZXRob2QoRU5UUklFUylcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoS0VZIGluIG1ldGhvZHMpIHtcbiAgICAgIGlmIChCVUdHWV9TQUZBUklfSVRFUkFUT1JTJDEgfHwgSU5DT1JSRUNUX1ZBTFVFU19OQU1FIHx8ICEoS0VZIGluIEl0ZXJhYmxlUHJvdG90eXBlKSkge1xuICAgICAgICByZWRlZmluZShJdGVyYWJsZVByb3RvdHlwZSwgS0VZLCBtZXRob2RzW0tFWV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBfZXhwb3J0KHsgdGFyZ2V0OiBOQU1FLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBCVUdHWV9TQUZBUklfSVRFUkFUT1JTJDEgfHwgSU5DT1JSRUNUX1ZBTFVFU19OQU1FIH0sIG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuXG52YXIgQVJSQVlfSVRFUkFUT1IgPSAnQXJyYXkgSXRlcmF0b3InO1xudmFyIHNldEludGVybmFsU3RhdGUkMSA9IGludGVybmFsU3RhdGUuc2V0O1xudmFyIGdldEludGVybmFsU3RhdGUkMSA9IGludGVybmFsU3RhdGUuZ2V0dGVyRm9yKEFSUkFZX0lURVJBVE9SKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5lbnRyaWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5lbnRyaWVzXG4vLyBgQXJyYXkucHJvdG90eXBlLmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmtleXNcbi8vIGBBcnJheS5wcm90b3R5cGUudmFsdWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS52YWx1ZXNcbi8vIGBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl1gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAaXRlcmF0b3Jcbi8vIGBDcmVhdGVBcnJheUl0ZXJhdG9yYCBpbnRlcm5hbCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNyZWF0ZWFycmF5aXRlcmF0b3JcbnZhciBlc19hcnJheV9pdGVyYXRvciA9IGRlZmluZUl0ZXJhdG9yKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgc2V0SW50ZXJuYWxTdGF0ZSQxKHRoaXMsIHtcbiAgICB0eXBlOiBBUlJBWV9JVEVSQVRPUixcbiAgICB0YXJnZXQ6IHRvSW5kZXhlZE9iamVjdChpdGVyYXRlZCksIC8vIHRhcmdldFxuICAgIGluZGV4OiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICAgIGtpbmQ6IGtpbmQgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICB9KTtcbi8vIGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy0lYXJyYXlpdGVyYXRvcnByb3RvdHlwZSUubmV4dFxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlJDEodGhpcyk7XG4gIHZhciB0YXJnZXQgPSBzdGF0ZS50YXJnZXQ7XG4gIHZhciBraW5kID0gc3RhdGUua2luZDtcbiAgdmFyIGluZGV4ID0gc3RhdGUuaW5kZXgrKztcbiAgaWYgKCF0YXJnZXQgfHwgaW5kZXggPj0gdGFyZ2V0Lmxlbmd0aCkge1xuICAgIHN0YXRlLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4geyB2YWx1ZTogaW5kZXgsIGRvbmU6IGZhbHNlIH07XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4geyB2YWx1ZTogdGFyZ2V0W2luZGV4XSwgZG9uZTogZmFsc2UgfTtcbiAgcmV0dXJuIHsgdmFsdWU6IFtpbmRleCwgdGFyZ2V0W2luZGV4XV0sIGRvbmU6IGZhbHNlIH07XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtY3JlYXRldW5tYXBwZWRhcmd1bWVudHNvYmplY3Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNyZWF0ZW1hcHBlZGFyZ3VtZW50c29iamVjdFxuaXRlcmF0b3JzLkFyZ3VtZW50cyA9IGl0ZXJhdG9ycy5BcnJheTtcblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuXG52YXIgbmF0aXZlQXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG52YXIgb2JqZWN0QXNzaWduID0gIW5hdGl2ZUFzc2lnbiB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgc3ltYm9sID0gU3ltYm9sKCk7XG4gIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbc3ltYm9sXSA9IDc7XG4gIGFscGhhYmV0LnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaHIpIHsgQltjaHJdID0gY2hyOyB9KTtcbiAgcmV0dXJuIG5hdGl2ZUFzc2lnbih7fSwgQSlbc3ltYm9sXSAhPSA3IHx8IG9iamVjdEtleXMobmF0aXZlQXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gYWxwaGFiZXQ7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFyZ3VtZW50c0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eVN5bWJvbHMuZjtcbiAgdmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvcGVydHlJc0VudW1lcmFibGUuZjtcbiAgd2hpbGUgKGFyZ3VtZW50c0xlbmd0aCA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBpbmRleGVkT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBvYmplY3RLZXlzKFMpLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoUykpIDogb2JqZWN0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIHtcbiAgICAgIGtleSA9IGtleXNbaisrXTtcbiAgICAgIGlmICghZGVzY3JpcHRvcnMgfHwgcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6IG5hdGl2ZUFzc2lnbjtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogT2JqZWN0LmFzc2lnbiAhPT0gb2JqZWN0QXNzaWduIH0sIHtcbiAgYXNzaWduOiBvYmplY3RBc3NpZ25cbn0pO1xuXG52YXIgVE9fU1RSSU5HX1RBRyQxID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBDT1JSRUNUX0FSR1VNRU5UUyA9IGNsYXNzb2ZSYXcoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbi8vIGdldHRpbmcgdGFnIGZyb20gRVM2KyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2BcbnZhciBjbGFzc29mID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCB0YWcsIHJlc3VsdDtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKHRhZyA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRyQxKSkgPT0gJ3N0cmluZycgPyB0YWdcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IENPUlJFQ1RfQVJHVU1FTlRTID8gY2xhc3NvZlJhdyhPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChyZXN1bHQgPSBjbGFzc29mUmF3KE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogcmVzdWx0O1xufTtcblxudmFyIFRPX1NUUklOR19UQUckMiA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciB0ZXN0ID0ge307XG5cbnRlc3RbVE9fU1RSSU5HX1RBRyQyXSA9ICd6JztcblxuLy8gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZ1xudmFyIG9iamVjdFRvU3RyaW5nID0gU3RyaW5nKHRlc3QpICE9PSAnW29iamVjdCB6XScgPyBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xufSA6IHRlc3QudG9TdHJpbmc7XG5cbnZhciBPYmplY3RQcm90b3R5cGUkMiA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbmlmIChvYmplY3RUb1N0cmluZyAhPT0gT2JqZWN0UHJvdG90eXBlJDIudG9TdHJpbmcpIHtcbiAgcmVkZWZpbmUoT2JqZWN0UHJvdG90eXBlJDIsICd0b1N0cmluZycsIG9iamVjdFRvU3RyaW5nLCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cblxudmFyIGZyZWV6aW5nID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5pc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcblxudmFyIGludGVybmFsTWV0YWRhdGEgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlKSB7XG52YXIgZGVmaW5lUHJvcGVydHkgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuXG5cblxudmFyIE1FVEFEQVRBID0gdWlkKCdtZXRhJyk7XG52YXIgaWQgPSAwO1xuXG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxudmFyIHNldE1ldGFkYXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIGRlZmluZVByb3BlcnR5KGl0LCBNRVRBREFUQSwgeyB2YWx1ZToge1xuICAgIG9iamVjdElEOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3ZWFrRGF0YToge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG5cbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIGEgcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQURBVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGFkYXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBREFUQV0ub2JqZWN0SUQ7XG59O1xuXG52YXIgZ2V0V2Vha0RhdGEgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQURBVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGFkYXRhKGl0KTtcbiAgLy8gcmV0dXJuIHRoZSBzdG9yZSBvZiB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBREFUQV0ud2Vha0RhdGE7XG59O1xuXG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoZnJlZXppbmcgJiYgbWV0YS5SRVFVSVJFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEFEQVRBKSkgc2V0TWV0YWRhdGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuXG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBSRVFVSVJFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWtEYXRhOiBnZXRXZWFrRGF0YSxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuXG5oaWRkZW5LZXlzW01FVEFEQVRBXSA9IHRydWU7XG59KTtcblxudmFyIElURVJBVE9SJDIgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90b3R5cGUkMSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIGlzQXJyYXlJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoaXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvdHlwZSQxW0lURVJBVE9SJDJdID09PSBpdCk7XG59O1xuXG52YXIgSVRFUkFUT1IkMyA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcblxudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUiQzXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBpdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcblxuLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgRU5UUklFUykge1xuICB0cnkge1xuICAgIHJldHVybiBFTlRSSUVTID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdmFyIHJldHVybk1ldGhvZCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0dXJuTWV0aG9kICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldHVybk1ldGhvZC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbnZhciBpdGVyYXRlXzEgPSBjcmVhdGVDb21tb25qc01vZHVsZShmdW5jdGlvbiAobW9kdWxlKSB7XG52YXIgUmVzdWx0ID0gZnVuY3Rpb24gKHN0b3BwZWQsIHJlc3VsdCkge1xuICB0aGlzLnN0b3BwZWQgPSBzdG9wcGVkO1xuICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcbn07XG5cbnZhciBpdGVyYXRlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGZuLCB0aGF0LCBBU19FTlRSSUVTLCBJU19JVEVSQVRPUikge1xuICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmRDb250ZXh0KGZuLCB0aGF0LCBBU19FTlRSSUVTID8gMiA6IDEpO1xuICB2YXIgaXRlcmF0b3IsIGl0ZXJGbiwgaW5kZXgsIGxlbmd0aCwgcmVzdWx0LCBuZXh0LCBzdGVwO1xuXG4gIGlmIChJU19JVEVSQVRPUikge1xuICAgIGl0ZXJhdG9yID0gaXRlcmFibGU7XG4gIH0gZWxzZSB7XG4gICAgaXRlckZuID0gZ2V0SXRlcmF0b3JNZXRob2QoaXRlcmFibGUpO1xuICAgIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcignVGFyZ2V0IGlzIG5vdCBpdGVyYWJsZScpO1xuICAgIC8vIG9wdGltaXNhdGlvbiBmb3IgYXJyYXkgaXRlcmF0b3JzXG4gICAgaWYgKGlzQXJyYXlJdGVyYXRvck1ldGhvZChpdGVyRm4pKSB7XG4gICAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgcmVzdWx0ID0gQVNfRU5UUklFU1xuICAgICAgICAgID8gYm91bmRGdW5jdGlvbihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSlcbiAgICAgICAgICA6IGJvdW5kRnVuY3Rpb24oaXRlcmFibGVbaW5kZXhdKTtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQgaW5zdGFuY2VvZiBSZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICB9IHJldHVybiBuZXcgUmVzdWx0KGZhbHNlKTtcbiAgICB9XG4gICAgaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7XG4gIH1cblxuICBuZXh0ID0gaXRlcmF0b3IubmV4dDtcbiAgd2hpbGUgKCEoc3RlcCA9IG5leHQuY2FsbChpdGVyYXRvcikpLmRvbmUpIHtcbiAgICByZXN1bHQgPSBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nKGl0ZXJhdG9yLCBib3VuZEZ1bmN0aW9uLCBzdGVwLnZhbHVlLCBBU19FTlRSSUVTKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnb2JqZWN0JyAmJiByZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICB9IHJldHVybiBuZXcgUmVzdWx0KGZhbHNlKTtcbn07XG5cbml0ZXJhdGUuc3RvcCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgcmV0dXJuIG5ldyBSZXN1bHQodHJ1ZSwgcmVzdWx0KTtcbn07XG59KTtcblxudmFyIGFuSW5zdGFuY2UgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvcnJlY3QgJyArIChuYW1lID8gbmFtZSArICcgJyA6ICcnKSArICdpbnZvY2F0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcblxudmFyIElURVJBVE9SJDQgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciBjYWxsZWQgPSAwO1xuICB2YXIgaXRlcmF0b3JXaXRoUmV0dXJuID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7IGRvbmU6ICEhY2FsbGVkKysgfTtcbiAgICB9LFxuICAgICdyZXR1cm4nOiBmdW5jdGlvbiAoKSB7XG4gICAgICBTQUZFX0NMT1NJTkcgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgaXRlcmF0b3JXaXRoUmV0dXJuW0lURVJBVE9SJDRdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKGl0ZXJhdG9yV2l0aFJldHVybiwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cblxudmFyIGNoZWNrQ29ycmVjdG5lc3NPZkl0ZXJhdGlvbiA9IGZ1bmN0aW9uIChleGVjLCBTS0lQX0NMT1NJTkcpIHtcbiAgaWYgKCFTS0lQX0NMT1NJTkcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgSVRFUkFUSU9OX1NVUFBPUlQgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgb2JqZWN0W0lURVJBVE9SJDRdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB7IGRvbmU6IElURVJBVElPTl9TVVBQT1JUID0gdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gICAgZXhlYyhvYmplY3QpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBJVEVSQVRJT05fU1VQUE9SVDtcbn07XG5cbi8vIG1ha2VzIHN1YmNsYXNzaW5nIHdvcmsgY29ycmVjdCBmb3Igd3JhcHBlZCBidWlsdC1pbnNcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IGZ1bmN0aW9uICgkdGhpcywgZHVtbXksIFdyYXBwZXIpIHtcbiAgdmFyIE5ld1RhcmdldCwgTmV3VGFyZ2V0UHJvdG90eXBlO1xuICBpZiAoXG4gICAgLy8gaXQgY2FuIHdvcmsgb25seSB3aXRoIG5hdGl2ZSBgc2V0UHJvdG90eXBlT2ZgXG4gICAgb2JqZWN0U2V0UHJvdG90eXBlT2YgJiZcbiAgICAvLyB3ZSBoYXZlbid0IGNvbXBsZXRlbHkgY29ycmVjdCBwcmUtRVM2IHdheSBmb3IgZ2V0dGluZyBgbmV3LnRhcmdldGAsIHNvIHVzZSB0aGlzXG4gICAgdHlwZW9mIChOZXdUYXJnZXQgPSBkdW1teS5jb25zdHJ1Y3RvcikgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIE5ld1RhcmdldCAhPT0gV3JhcHBlciAmJlxuICAgIGlzT2JqZWN0KE5ld1RhcmdldFByb3RvdHlwZSA9IE5ld1RhcmdldC5wcm90b3R5cGUpICYmXG4gICAgTmV3VGFyZ2V0UHJvdG90eXBlICE9PSBXcmFwcGVyLnByb3RvdHlwZVxuICApIG9iamVjdFNldFByb3RvdHlwZU9mKCR0aGlzLCBOZXdUYXJnZXRQcm90b3R5cGUpO1xuICByZXR1cm4gJHRoaXM7XG59O1xuXG52YXIgY29sbGVjdGlvbiA9IGZ1bmN0aW9uIChDT05TVFJVQ1RPUl9OQU1FLCB3cmFwcGVyLCBjb21tb24sIElTX01BUCwgSVNfV0VBSykge1xuICB2YXIgTmF0aXZlQ29uc3RydWN0b3IgPSBnbG9iYWxfMVtDT05TVFJVQ1RPUl9OQU1FXTtcbiAgdmFyIE5hdGl2ZVByb3RvdHlwZSA9IE5hdGl2ZUNvbnN0cnVjdG9yICYmIE5hdGl2ZUNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgdmFyIENvbnN0cnVjdG9yID0gTmF0aXZlQ29uc3RydWN0b3I7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBleHBvcnRlZCA9IHt9O1xuXG4gIHZhciBmaXhNZXRob2QgPSBmdW5jdGlvbiAoS0VZKSB7XG4gICAgdmFyIG5hdGl2ZU1ldGhvZCA9IE5hdGl2ZVByb3RvdHlwZVtLRVldO1xuICAgIHJlZGVmaW5lKE5hdGl2ZVByb3RvdHlwZSwgS0VZLFxuICAgICAgS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgICAgIG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIHZhbHVlID09PSAwID8gMCA6IHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IDogS0VZID09ICdkZWxldGUnID8gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IGZhbHNlIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogS0VZID09ICdnZXQnID8gZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IHVuZGVmaW5lZCA6IG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXkpO1xuICAgICAgfSA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGtleSkgPyBmYWxzZSA6IG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXkpO1xuICAgICAgfSA6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICBpZiAoaXNGb3JjZWRfMShDT05TVFJVQ1RPUl9OQU1FLCB0eXBlb2YgTmF0aXZlQ29uc3RydWN0b3IgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgTmF0aXZlUHJvdG90eXBlLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgTmF0aXZlQ29uc3RydWN0b3IoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDb25zdHJ1Y3RvciA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBDT05TVFJVQ1RPUl9OQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICBpbnRlcm5hbE1ldGFkYXRhLlJFUVVJUkVEID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0ZvcmNlZF8xKENPTlNUUlVDVE9SX05BTUUsIHRydWUpKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENvbnN0cnVjdG9yKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiBDaHJvbWl1bSA0MC0gd2Vhay1jb2xsZWN0aW9ucyB0aHJvd3Mgb24gcHJpbWl0aXZlcywgYnV0IHNob3VsZCByZXR1cm4gZmFsc2VcbiAgICB2YXIgVEhST1dTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IGluc3RhbmNlLmhhcygxKTsgfSk7XG4gICAgLy8gbW9zdCBlYXJseSBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCBzdXBwb3J0cyBpdGVyYWJsZXMsIG1vc3QgbW9kZXJuIC0gbm90IGNsb3NlIGl0IGNvcnJlY3RseVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXdcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9IGNoZWNrQ29ycmVjdG5lc3NPZkl0ZXJhdGlvbihmdW5jdGlvbiAoaXRlcmFibGUpIHsgbmV3IE5hdGl2ZUNvbnN0cnVjdG9yKGl0ZXJhYmxlKTsgfSk7XG4gICAgLy8gZm9yIGVhcmx5IGltcGxlbWVudGF0aW9ucyAtMCBhbmQgKzAgbm90IHRoZSBzYW1lXG4gICAgdmFyIEJVR0dZX1pFUk8gPSAhSVNfV0VBSyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBWOCB+IENocm9taXVtIDQyLSBmYWlscyBvbmx5IHdpdGggNSsgZWxlbWVudHNcbiAgICAgIHZhciAkaW5zdGFuY2UgPSBuZXcgTmF0aXZlQ29uc3RydWN0b3IoKTtcbiAgICAgIHZhciBpbmRleCA9IDU7XG4gICAgICB3aGlsZSAoaW5kZXgtLSkgJGluc3RhbmNlW0FEREVSXShpbmRleCwgaW5kZXgpO1xuICAgICAgcmV0dXJuICEkaW5zdGFuY2UuaGFzKC0wKTtcbiAgICB9KTtcblxuICAgIGlmICghQUNDRVBUX0lURVJBQkxFUykge1xuICAgICAgQ29uc3RydWN0b3IgPSB3cmFwcGVyKGZ1bmN0aW9uIChkdW1teSwgaXRlcmFibGUpIHtcbiAgICAgICAgYW5JbnN0YW5jZShkdW1teSwgQ29uc3RydWN0b3IsIENPTlNUUlVDVE9SX05BTUUpO1xuICAgICAgICB2YXIgdGhhdCA9IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpLCBkdW1teSwgQ29uc3RydWN0b3IpO1xuICAgICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBpdGVyYXRlXzEoaXRlcmFibGUsIHRoYXRbQURERVJdLCB0aGF0LCBJU19NQVApO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gTmF0aXZlUHJvdG90eXBlO1xuICAgICAgTmF0aXZlUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuXG4gICAgaWYgKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpIGZpeE1ldGhvZChBRERFUik7XG5cbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmIChJU19XRUFLICYmIE5hdGl2ZVByb3RvdHlwZS5jbGVhcikgZGVsZXRlIE5hdGl2ZVByb3RvdHlwZS5jbGVhcjtcbiAgfVxuXG4gIGV4cG9ydGVkW0NPTlNUUlVDVE9SX05BTUVdID0gQ29uc3RydWN0b3I7XG4gIF9leHBvcnQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogQ29uc3RydWN0b3IgIT0gTmF0aXZlQ29uc3RydWN0b3IgfSwgZXhwb3J0ZWQpO1xuXG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBDT05TVFJVQ1RPUl9OQU1FKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQ29uc3RydWN0b3IsIENPTlNUUlVDVE9SX05BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufTtcblxudmFyIHJlZGVmaW5lQWxsID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBvcHRpb25zKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgb3B0aW9ucyk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG52YXIgU1BFQ0lFUyQzID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbnZhciBzZXRTcGVjaWVzID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SX05BTUUpIHtcbiAgdmFyIENvbnN0cnVjdG9yID0gZ2V0QnVpbHRJbihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcblxuICBpZiAoZGVzY3JpcHRvcnMgJiYgQ29uc3RydWN0b3IgJiYgIUNvbnN0cnVjdG9yW1NQRUNJRVMkM10pIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgU1BFQ0lFUyQzLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICB9KTtcbiAgfVxufTtcblxudmFyIGRlZmluZVByb3BlcnR5JDQgPSBvYmplY3REZWZpbmVQcm9wZXJ0eS5mO1xuXG5cblxuXG5cblxuXG5cbnZhciBmYXN0S2V5ID0gaW50ZXJuYWxNZXRhZGF0YS5mYXN0S2V5O1xuXG5cbnZhciBzZXRJbnRlcm5hbFN0YXRlJDIgPSBpbnRlcm5hbFN0YXRlLnNldDtcbnZhciBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yID0gaW50ZXJuYWxTdGF0ZS5nZXR0ZXJGb3I7XG5cbnZhciBjb2xsZWN0aW9uU3Ryb25nID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIENPTlNUUlVDVE9SX05BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIENPTlNUUlVDVE9SX05BTUUpO1xuICAgICAgc2V0SW50ZXJuYWxTdGF0ZSQyKHRoYXQsIHtcbiAgICAgICAgdHlwZTogQ09OU1RSVUNUT1JfTkFNRSxcbiAgICAgICAgaW5kZXg6IG9iamVjdENyZWF0ZShudWxsKSxcbiAgICAgICAgZmlyc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgbGFzdDogdW5kZWZpbmVkLFxuICAgICAgICBzaXplOiAwXG4gICAgICB9KTtcbiAgICAgIGlmICghZGVzY3JpcHRvcnMpIHRoYXQuc2l6ZSA9IDA7XG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBpdGVyYXRlXzEoaXRlcmFibGUsIHRoYXRbQURERVJdLCB0aGF0LCBJU19NQVApO1xuICAgIH0pO1xuXG4gICAgdmFyIGdldEludGVybmFsU3RhdGUgPSBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yKENPTlNUUlVDVE9SX05BTUUpO1xuXG4gICAgdmFyIGRlZmluZSA9IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgIHZhciBwcmV2aW91cywgaW5kZXg7XG4gICAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xuICAgICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUubGFzdCA9IGVudHJ5ID0ge1xuICAgICAgICAgIGluZGV4OiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSxcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgcHJldmlvdXM6IHByZXZpb3VzID0gc3RhdGUubGFzdCxcbiAgICAgICAgICBuZXh0OiB1bmRlZmluZWQsXG4gICAgICAgICAgcmVtb3ZlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFzdGF0ZS5maXJzdCkgc3RhdGUuZmlyc3QgPSBlbnRyeTtcbiAgICAgICAgaWYgKHByZXZpb3VzKSBwcmV2aW91cy5uZXh0ID0gZW50cnk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9ycykgc3RhdGUuc2l6ZSsrO1xuICAgICAgICBlbHNlIHRoYXQuc2l6ZSsrO1xuICAgICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHN0YXRlLmluZGV4W2luZGV4XSA9IGVudHJ5O1xuICAgICAgfSByZXR1cm4gdGhhdDtcbiAgICB9O1xuXG4gICAgdmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGF0KTtcbiAgICAgIC8vIGZhc3QgY2FzZVxuICAgICAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICAgICAgdmFyIGVudHJ5O1xuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHJldHVybiBzdGF0ZS5pbmRleFtpbmRleF07XG4gICAgICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgICAgIGZvciAoZW50cnkgPSBzdGF0ZS5maXJzdDsgZW50cnk7IGVudHJ5ID0gZW50cnkubmV4dCkge1xuICAgICAgICBpZiAoZW50cnkua2V5ID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgICB2YXIgZGF0YSA9IHN0YXRlLmluZGV4O1xuICAgICAgICB2YXIgZW50cnkgPSBzdGF0ZS5maXJzdDtcbiAgICAgICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICAgICAgZW50cnkucmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGVudHJ5LnByZXZpb3VzKSBlbnRyeS5wcmV2aW91cyA9IGVudHJ5LnByZXZpb3VzLm5leHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaW5kZXhdO1xuICAgICAgICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5maXJzdCA9IHN0YXRlLmxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChkZXNjcmlwdG9ycykgc3RhdGUuc2l6ZSA9IDA7XG4gICAgICAgIGVsc2UgdGhhdC5zaXplID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGF0KTtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uZXh0O1xuICAgICAgICAgIHZhciBwcmV2ID0gZW50cnkucHJldmlvdXM7XG4gICAgICAgICAgZGVsZXRlIHN0YXRlLmluZGV4W2VudHJ5LmluZGV4XTtcbiAgICAgICAgICBlbnRyeS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocHJldikgcHJldi5uZXh0ID0gbmV4dDtcbiAgICAgICAgICBpZiAobmV4dCkgbmV4dC5wcmV2aW91cyA9IHByZXY7XG4gICAgICAgICAgaWYgKHN0YXRlLmZpcnN0ID09IGVudHJ5KSBzdGF0ZS5maXJzdCA9IG5leHQ7XG4gICAgICAgICAgaWYgKHN0YXRlLmxhc3QgPT0gZW50cnkpIHN0YXRlLmxhc3QgPSBwcmV2O1xuICAgICAgICAgIGlmIChkZXNjcmlwdG9ycykgc3RhdGUuc2l6ZS0tO1xuICAgICAgICAgIGVsc2UgdGhhdC5zaXplLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICAgICAgdmFyIGJvdW5kRnVuY3Rpb24gPSBiaW5kQ29udGV4dChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uZXh0IDogc3RhdGUuZmlyc3QpIHtcbiAgICAgICAgICBib3VuZEZ1bmN0aW9uKGVudHJ5LnZhbHVlLCBlbnRyeS5rZXksIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yZW1vdmVkKSBlbnRyeSA9IGVudHJ5LnByZXZpb3VzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBJU19NQVAgPyB7XG4gICAgICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnZhbHVlO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkZWZpbmUodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gOiB7XG4gICAgICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgICAgIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkZWZpbmUodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChkZXNjcmlwdG9ycykgZGVmaW5lUHJvcGVydHkkNChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldEludGVybmFsU3RhdGUodGhpcykuc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQKSB7XG4gICAgdmFyIElURVJBVE9SX05BTUUgPSBDT05TVFJVQ1RPUl9OQU1FICsgJyBJdGVyYXRvcic7XG4gICAgdmFyIGdldEludGVybmFsQ29sbGVjdGlvblN0YXRlID0gaW50ZXJuYWxTdGF0ZUdldHRlckZvcihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgICB2YXIgZ2V0SW50ZXJuYWxJdGVyYXRvclN0YXRlID0gaW50ZXJuYWxTdGF0ZUdldHRlckZvcihJVEVSQVRPUl9OQU1FKTtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgZGVmaW5lSXRlcmF0b3IoQywgQ09OU1RSVUNUT1JfTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICBzZXRJbnRlcm5hbFN0YXRlJDIodGhpcywge1xuICAgICAgICB0eXBlOiBJVEVSQVRPUl9OQU1FLFxuICAgICAgICB0YXJnZXQ6IGl0ZXJhdGVkLFxuICAgICAgICBzdGF0ZTogZ2V0SW50ZXJuYWxDb2xsZWN0aW9uU3RhdGUoaXRlcmF0ZWQpLFxuICAgICAgICBraW5kOiBraW5kLFxuICAgICAgICBsYXN0OiB1bmRlZmluZWRcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsSXRlcmF0b3JTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciBraW5kID0gc3RhdGUua2luZDtcbiAgICAgIHZhciBlbnRyeSA9IHN0YXRlLmxhc3Q7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yZW1vdmVkKSBlbnRyeSA9IGVudHJ5LnByZXZpb3VzO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmICghc3RhdGUudGFyZ2V0IHx8ICEoc3RhdGUubGFzdCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uZXh0IDogc3RhdGUuc3RhdGUuZmlyc3QpKSB7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHN0YXRlLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4geyB2YWx1ZTogZW50cnkua2V5LCBkb25lOiBmYWxzZSB9O1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiB7IHZhbHVlOiBlbnRyeS52YWx1ZSwgZG9uZTogZmFsc2UgfTtcbiAgICAgIHJldHVybiB7IHZhbHVlOiBbZW50cnkua2V5LCBlbnRyeS52YWx1ZV0sIGRvbmU6IGZhbHNlIH07XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKENPTlNUUlVDVE9SX05BTUUpO1xuICB9XG59O1xuXG4vLyBgU2V0YCBjb25zdHJ1Y3RvclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc2V0LW9iamVjdHNcbnZhciBlc19zZXQgPSBjb2xsZWN0aW9uKCdTZXQnLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCBjb2xsZWN0aW9uU3Ryb25nKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUueyBjb2RlUG9pbnRBdCwgYXQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCQyID0gZnVuY3Rpb24gKENPTlZFUlRfVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIHBvcykge1xuICAgIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgc2l6ZSA9IFMubGVuZ3RoO1xuICAgIHZhciBmaXJzdCwgc2Vjb25kO1xuICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gc2l6ZSkgcmV0dXJuIENPTlZFUlRfVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgZmlyc3QgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgIHJldHVybiBmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBwb3NpdGlvbiArIDEgPT09IHNpemVcbiAgICAgIHx8IChzZWNvbmQgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKSkgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGXG4gICAgICAgID8gQ09OVkVSVF9UT19TVFJJTkcgPyBTLmNoYXJBdChwb3NpdGlvbikgOiBmaXJzdFxuICAgICAgICA6IENPTlZFUlRfVE9fU1RSSU5HID8gUy5zbGljZShwb3NpdGlvbiwgcG9zaXRpb24gKyAyKSA6IChmaXJzdCAtIDB4RDgwMCA8PCAxMCkgKyAoc2Vjb25kIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuXG52YXIgc3RyaW5nTXVsdGlieXRlID0ge1xuICAvLyBgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuY29kZXBvaW50YXRcbiAgY29kZUF0OiBjcmVhdGVNZXRob2QkMihmYWxzZSksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLmF0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5hdFxuICBjaGFyQXQ6IGNyZWF0ZU1ldGhvZCQyKHRydWUpXG59O1xuXG52YXIgY2hhckF0ID0gc3RyaW5nTXVsdGlieXRlLmNoYXJBdDtcblxuXG5cbnZhciBTVFJJTkdfSVRFUkFUT1IgPSAnU3RyaW5nIEl0ZXJhdG9yJztcbnZhciBzZXRJbnRlcm5hbFN0YXRlJDMgPSBpbnRlcm5hbFN0YXRlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlJDIgPSBpbnRlcm5hbFN0YXRlLmdldHRlckZvcihTVFJJTkdfSVRFUkFUT1IpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLUBAaXRlcmF0b3JcbmRlZmluZUl0ZXJhdG9yKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICBzZXRJbnRlcm5hbFN0YXRlJDModGhpcywge1xuICAgIHR5cGU6IFNUUklOR19JVEVSQVRPUixcbiAgICBzdHJpbmc6IFN0cmluZyhpdGVyYXRlZCksXG4gICAgaW5kZXg6IDBcbiAgfSk7XG4vLyBgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLSVzdHJpbmdpdGVyYXRvcnByb3RvdHlwZSUubmV4dFxufSwgZnVuY3Rpb24gbmV4dCgpIHtcbiAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSQyKHRoaXMpO1xuICB2YXIgc3RyaW5nID0gc3RhdGUuc3RyaW5nO1xuICB2YXIgaW5kZXggPSBzdGF0ZS5pbmRleDtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gc3RyaW5nLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9IGNoYXJBdChzdHJpbmcsIGluZGV4KTtcbiAgc3RhdGUuaW5kZXggKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcblxuLy8gaXRlcmFibGUgRE9NIGNvbGxlY3Rpb25zXG4vLyBmbGFnIC0gYGl0ZXJhYmxlYCBpbnRlcmZhY2UgLSAnZW50cmllcycsICdrZXlzJywgJ3ZhbHVlcycsICdmb3JFYWNoJyBtZXRob2RzXG52YXIgZG9tSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogMCxcbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogMCxcbiAgQ1NTVmFsdWVMaXN0OiAwLFxuICBDbGllbnRSZWN0TGlzdDogMCxcbiAgRE9NUmVjdExpc3Q6IDAsXG4gIERPTVN0cmluZ0xpc3Q6IDAsXG4gIERPTVRva2VuTGlzdDogMSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IDAsXG4gIEZpbGVMaXN0OiAwLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogMCxcbiAgSFRNTENvbGxlY3Rpb246IDAsXG4gIEhUTUxGb3JtRWxlbWVudDogMCxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IDAsXG4gIE1lZGlhTGlzdDogMCxcbiAgTWltZVR5cGVBcnJheTogMCxcbiAgTmFtZWROb2RlTWFwOiAwLFxuICBOb2RlTGlzdDogMSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogMCxcbiAgUGx1Z2luOiAwLFxuICBQbHVnaW5BcnJheTogMCxcbiAgU1ZHTGVuZ3RoTGlzdDogMCxcbiAgU1ZHTnVtYmVyTGlzdDogMCxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IDAsXG4gIFNWR1BvaW50TGlzdDogMCxcbiAgU1ZHU3RyaW5nTGlzdDogMCxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogMCxcbiAgU291cmNlQnVmZmVyTGlzdDogMCxcbiAgU3R5bGVTaGVldExpc3Q6IDAsXG4gIFRleHRUcmFja0N1ZUxpc3Q6IDAsXG4gIFRleHRUcmFja0xpc3Q6IDAsXG4gIFRvdWNoTGlzdDogMFxufTtcblxudmFyIElURVJBVE9SJDUgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgVE9fU1RSSU5HX1RBRyQzID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gZXNfYXJyYXlfaXRlcmF0b3IudmFsdWVzO1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gZG9tSXRlcmFibGVzKSB7XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsXzFbQ09MTEVDVElPTl9OQU1FXTtcbiAgdmFyIENvbGxlY3Rpb25Qcm90b3R5cGUgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZiAoQ29sbGVjdGlvblByb3RvdHlwZSkge1xuICAgIC8vIHNvbWUgQ2hyb21lIHZlcnNpb25zIGhhdmUgbm9uLWNvbmZpZ3VyYWJsZSBtZXRob2RzIG9uIERPTVRva2VuTGlzdFxuICAgIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlW0lURVJBVE9SJDVdICE9PSBBcnJheVZhbHVlcykgdHJ5IHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBJVEVSQVRPUiQ1LCBBcnJheVZhbHVlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIENvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1IkNV0gPSBBcnJheVZhbHVlcztcbiAgICB9XG4gICAgaWYgKCFDb2xsZWN0aW9uUHJvdG90eXBlW1RPX1NUUklOR19UQUckM10pIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHJDMsIENPTExFQ1RJT05fTkFNRSk7XG4gICAgfVxuICAgIGlmIChkb21JdGVyYWJsZXNbQ09MTEVDVElPTl9OQU1FXSkgZm9yICh2YXIgTUVUSE9EX05BTUUgaW4gZXNfYXJyYXlfaXRlcmF0b3IpIHtcbiAgICAgIC8vIHNvbWUgQ2hyb21lIHZlcnNpb25zIGhhdmUgbm9uLWNvbmZpZ3VyYWJsZSBtZXRob2RzIG9uIERPTVRva2VuTGlzdFxuICAgICAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGVbTUVUSE9EX05BTUVdICE9PSBlc19hcnJheV9pdGVyYXRvcltNRVRIT0RfTkFNRV0pIHRyeSB7XG4gICAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBNRVRIT0RfTkFNRSwgZXNfYXJyYXlfaXRlcmF0b3JbTUVUSE9EX05BTUVdKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENvbGxlY3Rpb25Qcm90b3R5cGVbTUVUSE9EX05BTUVdID0gZXNfYXJyYXlfaXRlcmF0b3JbTUVUSE9EX05BTUVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyMltpXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG59XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxudmFyIG1ldGhvZHMgPSB7fTtcbnZhciBuYW1lcyA9IFtdO1xuZnVuY3Rpb24gcmVnaXN0ZXJNZXRob2RzKG5hbWUsIG0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcbiAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG5hbWVbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgIHZhciBfbmFtZSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICByZWdpc3Rlck1ldGhvZHMoX25hbWUsIG0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuICE9IG51bGwpIHtcbiAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKF90eXBlb2YobmFtZSkgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIgX25hbWUyIGluIG5hbWUpIHtcbiAgICAgIHJlZ2lzdGVyTWV0aG9kcyhfbmFtZTIsIG5hbWVbX25hbWUyXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYWRkTWV0aG9kTmFtZXMoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobSkpO1xuICBtZXRob2RzW25hbWVdID0gT2JqZWN0LmFzc2lnbihtZXRob2RzW25hbWVdIHx8IHt9LCBtKTtcbn1cbmZ1bmN0aW9uIGdldE1ldGhvZHNGb3IobmFtZSkge1xuICByZXR1cm4gbWV0aG9kc1tuYW1lXSB8fCB7fTtcbn1cbmZ1bmN0aW9uIGdldE1ldGhvZE5hbWVzKCkge1xuICByZXR1cm4gX3RvQ29uc3VtYWJsZUFycmF5KG5ldyBTZXQobmFtZXMpKTtcbn1cbmZ1bmN0aW9uIGFkZE1ldGhvZE5hbWVzKF9uYW1lcykge1xuICBuYW1lcy5wdXNoLmFwcGx5KG5hbWVzLCBfdG9Db25zdW1hYmxlQXJyYXkoX25hbWVzKSk7XG59XG5cbnZhciAkaW5jbHVkZXMgPSBhcnJheUluY2x1ZGVzLmluY2x1ZGVzO1xuXG5cbi8vIGBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSB9LCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuYWRkVG9VbnNjb3BhYmxlcygnaW5jbHVkZXMnKTtcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NgIGdldHRlciBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciByZWdleHBGbGFncyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSBhbk9iamVjdCh0aGlzKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAodGhhdC5nbG9iYWwpIHJlc3VsdCArPSAnZyc7XG4gIGlmICh0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmICh0aGF0Lm11bHRpbGluZSkgcmVzdWx0ICs9ICdtJztcbiAgaWYgKHRoYXQuZG90QWxsKSByZXN1bHQgKz0gJ3MnO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC5zdGlja3kpIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG52YXIgbmF0aXZlRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcbi8vIFRoaXMgYWx3YXlzIHJlZmVycyB0byB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uLCBiZWNhdXNlIHRoZVxuLy8gU3RyaW5nI3JlcGxhY2UgcG9seWZpbGwgdXNlcyAuL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMuanMsXG4vLyB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYmVmb3JlIHBhdGNoaW5nIHRoZSBtZXRob2QuXG52YXIgbmF0aXZlUmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcblxudmFyIHBhdGNoZWRFeGVjID0gbmF0aXZlRXhlYztcblxudmFyIFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciByZTEgPSAvYS87XG4gIHZhciByZTIgPSAvYiovZztcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMSwgJ2EnKTtcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMiwgJ2EnKTtcbiAgcmV0dXJuIHJlMS5sYXN0SW5kZXggIT09IDAgfHwgcmUyLmxhc3RJbmRleCAhPT0gMDtcbn0pKCk7XG5cbi8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwLCBjb3BpZWQgZnJvbSBlczUtc2hpbSdzIFN0cmluZyNzcGxpdCBwYXRjaC5cbnZhciBOUENHX0lOQ0xVREVEID0gLygpPz8vLmV4ZWMoJycpWzFdICE9PSB1bmRlZmluZWQ7XG5cbnZhciBQQVRDSCA9IFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyB8fCBOUENHX0lOQ0xVREVEO1xuXG5pZiAoUEFUQ0gpIHtcbiAgcGF0Y2hlZEV4ZWMgPSBmdW5jdGlvbiBleGVjKHN0cikge1xuICAgIHZhciByZSA9IHRoaXM7XG4gICAgdmFyIGxhc3RJbmRleCwgcmVDb3B5LCBtYXRjaCwgaTtcblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHJlLnNvdXJjZSArICckKD8hXFxcXHMpJywgcmVnZXhwRmxhZ3MuY2FsbChyZSkpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZS5sYXN0SW5kZXg7XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChyZSwgc3RyKTtcblxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgJiYgbWF0Y2gpIHtcbiAgICAgIHJlLmxhc3RJbmRleCA9IHJlLmdsb2JhbCA/IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoIDogbGFzdEluZGV4O1xuICAgIH1cbiAgICBpZiAoTlBDR19JTkNMVURFRCAmJiBtYXRjaCAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYFxuICAgICAgLy8gZm9yIE5QQ0csIGxpa2UgSUU4LiBOT1RFOiBUaGlzIGRvZXNuJyB3b3JrIGZvciAvKC4/KT8vXG4gICAgICBuYXRpdmVSZXBsYWNlLmNhbGwobWF0Y2hbMF0sIHJlQ29weSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgIGlmIChhcmd1bWVudHNbaV0gPT09IHVuZGVmaW5lZCkgbWF0Y2hbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcbn1cblxudmFyIHJlZ2V4cEV4ZWMgPSBwYXRjaGVkRXhlYztcblxuX2V4cG9ydCh7IHRhcmdldDogJ1JlZ0V4cCcsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IC8uLy5leGVjICE9PSByZWdleHBFeGVjIH0sIHtcbiAgZXhlYzogcmVnZXhwRXhlY1xufSk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxuLy8gYElzUmVnRXhwYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcmVnZXhwXG52YXIgaXNSZWdleHAgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIGlzUmVnRXhwO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICgoaXNSZWdFeHAgPSBpdFtNQVRDSF0pICE9PSB1bmRlZmluZWQgPyAhIWlzUmVnRXhwIDogY2xhc3NvZlJhdyhpdCkgPT0gJ1JlZ0V4cCcpO1xufTtcblxudmFyIG5vdEFSZWdleHAgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzUmVnZXhwKGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIlRoZSBtZXRob2QgZG9lc24ndCBhY2NlcHQgcmVndWxhciBleHByZXNzaW9uc1wiKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG52YXIgTUFUQ0gkMSA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxudmFyIGNvcnJlY3RJc1JlZ2V4cExvZ2ljID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FKSB7XG4gIHZhciByZWdleHAgPSAvLi87XG4gIHRyeSB7XG4gICAgJy8uLydbTUVUSE9EX05BTUVdKHJlZ2V4cCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgcmVnZXhwW01BVENIJDFdID0gZmFsc2U7XG4gICAgICByZXR1cm4gJy8uLydbTUVUSE9EX05BTUVdKHJlZ2V4cCk7XG4gICAgfSBjYXRjaCAoZikgeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlc1xuX2V4cG9ydCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFjb3JyZWN0SXNSZWdleHBMb2dpYygnaW5jbHVkZXMnKSB9LCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyogLCBwb3NpdGlvbiA9IDAgKi8pIHtcbiAgICByZXR1cm4gISF+U3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpXG4gICAgICAuaW5kZXhPZihub3RBUmVnZXhwKHNlYXJjaFN0cmluZyksIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnZhciBTUEVDSUVTJDQgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxudmFyIFJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gI3JlcGxhY2UgbmVlZHMgYnVpbHQtaW4gc3VwcG9ydCBmb3IgbmFtZWQgZ3JvdXBzLlxuICAvLyAjbWF0Y2ggd29ya3MgZmluZSBiZWNhdXNlIGl0IGp1c3QgcmV0dXJuIHRoZSBleGVjIHJlc3VsdHMsIGV2ZW4gaWYgaXQgaGFzXG4gIC8vIGEgXCJncm9wc1wiIHByb3BlcnR5LlxuICB2YXIgcmUgPSAvLi87XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHJlc3VsdC5ncm91cHMgPSB7IGE6ICc3JyB9O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiAnJy5yZXBsYWNlKHJlLCAnJDxhPicpICE9PSAnNyc7XG59KTtcblxuLy8gQ2hyb21lIDUxIGhhcyBhIGJ1Z2d5IFwic3BsaXRcIiBpbXBsZW1lbnRhdGlvbiB3aGVuIFJlZ0V4cCNleGVjICE9PSBuYXRpdmVFeGVjXG4vLyBXZWV4IEpTIGhhcyBmcm96ZW4gYnVpbHQtaW4gcHJvdG90eXBlcywgc28gdXNlIHRyeSAvIGNhdGNoIHdyYXBwZXJcbnZhciBTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUgPSAvKD86KS87XG4gIHZhciBvcmlnaW5hbEV4ZWMgPSByZS5leGVjO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3JpZ2luYWxFeGVjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gIHZhciByZXN1bHQgPSAnYWInLnNwbGl0KHJlKTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggIT09IDIgfHwgcmVzdWx0WzBdICE9PSAnYScgfHwgcmVzdWx0WzFdICE9PSAnYic7XG59KTtcblxudmFyIGZpeFJlZ2V4cFdlbGxLbm93blN5bWJvbExvZ2ljID0gZnVuY3Rpb24gKEtFWSwgbGVuZ3RoLCBleGVjLCBzaGFtKSB7XG4gIHZhciBTWU1CT0wgPSB3ZWxsS25vd25TeW1ib2woS0VZKTtcblxuICB2YXIgREVMRUdBVEVTX1RPX1NZTUJPTCA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3RyaW5nIG1ldGhvZHMgY2FsbCBzeW1ib2wtbmFtZWQgUmVnRXAgbWV0aG9kc1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KTtcblxuICB2YXIgREVMRUdBVEVTX1RPX0VYRUMgPSBERUxFR0FURVNfVE9fU1lNQk9MICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3ltYm9sLW5hbWVkIFJlZ0V4cCBtZXRob2RzIGNhbGwgLmV4ZWNcbiAgICB2YXIgZXhlY0NhbGxlZCA9IGZhbHNlO1xuICAgIHZhciByZSA9IC9hLztcblxuICAgIGlmIChLRVkgPT09ICdzcGxpdCcpIHtcbiAgICAgIC8vIFdlIGNhbid0IHVzZSByZWFsIHJlZ2V4IGhlcmUgc2luY2UgaXQgY2F1c2VzIGRlb3B0aW1pemF0aW9uXG4gICAgICAvLyBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvbiBpbiBWOFxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMwNlxuICAgICAgcmUgPSB7fTtcbiAgICAgIC8vIFJlZ0V4cFtAQHNwbGl0XSBkb2Vzbid0IGNhbGwgdGhlIHJlZ2V4J3MgZXhlYyBtZXRob2QsIGJ1dCBmaXJzdCBjcmVhdGVzXG4gICAgICAvLyBhIG5ldyBvbmUuIFdlIG5lZWQgdG8gcmV0dXJuIHRoZSBwYXRjaGVkIHJlZ2V4IHdoZW4gY3JlYXRpbmcgdGhlIG5ldyBvbmUuXG4gICAgICByZS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgICAgcmUuY29uc3RydWN0b3JbU1BFQ0lFUyQ0XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgICAgcmUuZmxhZ3MgPSAnJztcbiAgICAgIHJlW1NZTUJPTF0gPSAvLi9bU1lNQk9MXTtcbiAgICB9XG5cbiAgICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyBleGVjQ2FsbGVkID0gdHJ1ZTsgcmV0dXJuIG51bGw7IH07XG5cbiAgICByZVtTWU1CT0xdKCcnKTtcbiAgICByZXR1cm4gIWV4ZWNDYWxsZWQ7XG4gIH0pO1xuXG4gIGlmIChcbiAgICAhREVMRUdBVEVTX1RPX1NZTUJPTCB8fFxuICAgICFERUxFR0FURVNfVE9fRVhFQyB8fFxuICAgIChLRVkgPT09ICdyZXBsYWNlJyAmJiAhUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMpIHx8XG4gICAgKEtFWSA9PT0gJ3NwbGl0JyAmJiAhU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDKVxuICApIHtcbiAgICB2YXIgbmF0aXZlUmVnRXhwTWV0aG9kID0gLy4vW1NZTUJPTF07XG4gICAgdmFyIG1ldGhvZHMgPSBleGVjKFNZTUJPTCwgJydbS0VZXSwgZnVuY3Rpb24gKG5hdGl2ZU1ldGhvZCwgcmVnZXhwLCBzdHIsIGFyZzIsIGZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICBpZiAocmVnZXhwLmV4ZWMgPT09IHJlZ2V4cEV4ZWMpIHtcbiAgICAgICAgaWYgKERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgICAgLy8gVGhlIG5hdGl2ZSBTdHJpbmcgbWV0aG9kIGFscmVhZHkgZGVsZWdhdGVzIHRvIEBAbWV0aG9kICh0aGlzXG4gICAgICAgICAgLy8gcG9seWZpbGxlZCBmdW5jdGlvbiksIGxlYXNpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIC8vIFdlIGF2b2lkIGl0IGJ5IGRpcmVjdGx5IGNhbGxpbmcgdGhlIG5hdGl2ZSBAQG1ldGhvZCBtZXRob2QuXG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZVJlZ0V4cE1ldGhvZC5jYWxsKHJlZ2V4cCwgc3RyLCBhcmcyKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVNZXRob2QuY2FsbChzdHIsIHJlZ2V4cCwgYXJnMikgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlIH07XG4gICAgfSk7XG4gICAgdmFyIHN0cmluZ01ldGhvZCA9IG1ldGhvZHNbMF07XG4gICAgdmFyIHJlZ2V4TWV0aG9kID0gbWV0aG9kc1sxXTtcblxuICAgIHJlZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIEtFWSwgc3RyaW5nTWV0aG9kKTtcbiAgICByZWRlZmluZShSZWdFeHAucHJvdG90eXBlLCBTWU1CT0wsIGxlbmd0aCA9PSAyXG4gICAgICAvLyAyMS4yLjUuOCBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV0oc3RyaW5nLCByZXBsYWNlVmFsdWUpXG4gICAgICAvLyAyMS4yLjUuMTEgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XShzdHJpbmcsIGxpbWl0KVxuICAgICAgPyBmdW5jdGlvbiAoc3RyaW5nLCBhcmcpIHsgcmV0dXJuIHJlZ2V4TWV0aG9kLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24gKHN0cmluZykgeyByZXR1cm4gcmVnZXhNZXRob2QuY2FsbChzdHJpbmcsIHRoaXMpOyB9XG4gICAgKTtcbiAgICBpZiAoc2hhbSkgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KFJlZ0V4cC5wcm90b3R5cGVbU1lNQk9MXSwgJ3NoYW0nLCB0cnVlKTtcbiAgfVxufTtcblxudmFyIGNoYXJBdCQxID0gc3RyaW5nTXVsdGlieXRlLmNoYXJBdDtcblxuLy8gYEFkdmFuY2VTdHJpbmdJbmRleGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hZHZhbmNlc3RyaW5naW5kZXhcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSBmdW5jdGlvbiAoUywgaW5kZXgsIHVuaWNvZGUpIHtcbiAgcmV0dXJuIGluZGV4ICsgKHVuaWNvZGUgPyBjaGFyQXQkMShTLCBpbmRleCkubGVuZ3RoIDogMSk7XG59O1xuXG4vLyBgUmVnRXhwRXhlY2AgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHBleGVjXG52YXIgcmVnZXhwRXhlY0Fic3RyYWN0ID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGNsYXNzb2ZSYXcoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cblxuICByZXR1cm4gcmVnZXhwRXhlYy5jYWxsKFIsIFMpO1xufTtcblxudmFyIG1heCQyID0gTWF0aC5tYXg7XG52YXIgbWluJDIgPSBNYXRoLm1pbjtcbnZhciBmbG9vciQxID0gTWF0aC5mbG9vcjtcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MUyA9IC9cXCQoWyQmJ2BdfFxcZFxcZD98PFtePl0qPikvZztcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCA9IC9cXCQoWyQmJ2BdfFxcZFxcZD8pL2c7XG5cbnZhciBtYXliZVRvU3RyaW5nID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gaXQgOiBTdHJpbmcoaXQpO1xufTtcblxuLy8gQEByZXBsYWNlIGxvZ2ljXG5maXhSZWdleHBXZWxsS25vd25TeW1ib2xMb2dpYygncmVwbGFjZScsIDIsIGZ1bmN0aW9uIChSRVBMQUNFLCBuYXRpdmVSZXBsYWNlLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnJlcGxhY2VcbiAgICBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciByZXBsYWNlciA9IHNlYXJjaFZhbHVlID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlYXJjaFZhbHVlW1JFUExBQ0VdO1xuICAgICAgcmV0dXJuIHJlcGxhY2VyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyByZXBsYWNlci5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICAgIDogbmF0aXZlUmVwbGFjZS5jYWxsKFN0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAcmVwbGFjZVxuICAgIGZ1bmN0aW9uIChyZWdleHAsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVSZXBsYWNlLCByZWdleHAsIHRoaXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG5cbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHJlZ2V4cCk7XG4gICAgICB2YXIgUyA9IFN0cmluZyh0aGlzKTtcblxuICAgICAgdmFyIGZ1bmN0aW9uYWxSZXBsYWNlID0gdHlwZW9mIHJlcGxhY2VWYWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIGlmICghZnVuY3Rpb25hbFJlcGxhY2UpIHJlcGxhY2VWYWx1ZSA9IFN0cmluZyhyZXBsYWNlVmFsdWUpO1xuXG4gICAgICB2YXIgZ2xvYmFsID0gcnguZ2xvYmFsO1xuICAgICAgaWYgKGdsb2JhbCkge1xuICAgICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWdleHBFeGVjQWJzdHJhY3QocngsIFMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSBicmVhaztcblxuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuXG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWNjdW11bGF0ZWRSZXN1bHQgPSAnJztcbiAgICAgIHZhciBuZXh0U291cmNlUG9zaXRpb24gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG5cbiAgICAgICAgdmFyIG1hdGNoZWQgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gbWF4JDIobWluJDIodG9JbnRlZ2VyKHJlc3VsdC5pbmRleCksIFMubGVuZ3RoKSwgMCk7XG4gICAgICAgIHZhciBjYXB0dXJlcyA9IFtdO1xuICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGVxdWl2YWxlbnQgdG9cbiAgICAgICAgLy8gICBjYXB0dXJlcyA9IHJlc3VsdC5zbGljZSgxKS5tYXAobWF5YmVUb1N0cmluZylcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiBgbmF0aXZlU2xpY2UuY2FsbChyZXN1bHQsIDEsIHJlc3VsdC5sZW5ndGgpYCAoY2FsbGVkIGluXG4gICAgICAgIC8vIHRoZSBzbGljZSBwb2x5ZmlsbCB3aGVuIHNsaWNpbmcgbmF0aXZlIGFycmF5cykgXCJkb2Vzbid0IHdvcmtcIiBpbiBzYWZhcmkgOSBhbmRcbiAgICAgICAgLy8gY2F1c2VzIGEgY3Jhc2ggKGh0dHBzOi8vcGFzdGViaW4uY29tL04yMVF6ZVFBKSB3aGVuIHRyeWluZyB0byBkZWJ1ZyBpdC5cbiAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIGNhcHR1cmVzLnB1c2gobWF5YmVUb1N0cmluZyhyZXN1bHRbal0pKTtcbiAgICAgICAgdmFyIG5hbWVkQ2FwdHVyZXMgPSByZXN1bHQuZ3JvdXBzO1xuICAgICAgICBpZiAoZnVuY3Rpb25hbFJlcGxhY2UpIHtcbiAgICAgICAgICB2YXIgcmVwbGFjZXJBcmdzID0gW21hdGNoZWRdLmNvbmNhdChjYXB0dXJlcywgcG9zaXRpb24sIFMpO1xuICAgICAgICAgIGlmIChuYW1lZENhcHR1cmVzICE9PSB1bmRlZmluZWQpIHJlcGxhY2VyQXJncy5wdXNoKG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgICAgIHZhciByZXBsYWNlbWVudCA9IFN0cmluZyhyZXBsYWNlVmFsdWUuYXBwbHkodW5kZWZpbmVkLCByZXBsYWNlckFyZ3MpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBsYWNlbWVudCA9IGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBTLCBwb3NpdGlvbiwgY2FwdHVyZXMsIG5hbWVkQ2FwdHVyZXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID49IG5leHRTb3VyY2VQb3NpdGlvbikge1xuICAgICAgICAgIGFjY3VtdWxhdGVkUmVzdWx0ICs9IFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uLCBwb3NpdGlvbikgKyByZXBsYWNlbWVudDtcbiAgICAgICAgICBuZXh0U291cmNlUG9zaXRpb24gPSBwb3NpdGlvbiArIG1hdGNoZWQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0ZWRSZXN1bHQgKyBTLnNsaWNlKG5leHRTb3VyY2VQb3NpdGlvbik7XG4gICAgfVxuICBdO1xuXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdldHN1YnN0aXR1dGlvblxuICBmdW5jdGlvbiBnZXRTdWJzdGl0dXRpb24obWF0Y2hlZCwgc3RyLCBwb3NpdGlvbiwgY2FwdHVyZXMsIG5hbWVkQ2FwdHVyZXMsIHJlcGxhY2VtZW50KSB7XG4gICAgdmFyIHRhaWxQb3MgPSBwb3NpdGlvbiArIG1hdGNoZWQubGVuZ3RoO1xuICAgIHZhciBtID0gY2FwdHVyZXMubGVuZ3RoO1xuICAgIHZhciBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFNfTk9fTkFNRUQ7XG4gICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmFtZWRDYXB0dXJlcyA9IHRvT2JqZWN0KG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTO1xuICAgIH1cbiAgICByZXR1cm4gbmF0aXZlUmVwbGFjZS5jYWxsKHJlcGxhY2VtZW50LCBzeW1ib2xzLCBmdW5jdGlvbiAobWF0Y2gsIGNoKSB7XG4gICAgICB2YXIgY2FwdHVyZTtcbiAgICAgIHN3aXRjaCAoY2guY2hhckF0KDApKSB7XG4gICAgICAgIGNhc2UgJyQnOiByZXR1cm4gJyQnO1xuICAgICAgICBjYXNlICcmJzogcmV0dXJuIG1hdGNoZWQ7XG4gICAgICAgIGNhc2UgJ2AnOiByZXR1cm4gc3RyLnNsaWNlKDAsIHBvc2l0aW9uKTtcbiAgICAgICAgY2FzZSBcIidcIjogcmV0dXJuIHN0ci5zbGljZSh0YWlsUG9zKTtcbiAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgY2FwdHVyZSA9IG5hbWVkQ2FwdHVyZXNbY2guc2xpY2UoMSwgLTEpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDogLy8gXFxkXFxkP1xuICAgICAgICAgIHZhciBuID0gK2NoO1xuICAgICAgICAgIGlmIChuID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgaWYgKG4gPiBtKSB7XG4gICAgICAgICAgICB2YXIgZiA9IGZsb29yJDEobiAvIDEwKTtcbiAgICAgICAgICAgIGlmIChmID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICBpZiAoZiA8PSBtKSByZXR1cm4gY2FwdHVyZXNbZiAtIDFdID09PSB1bmRlZmluZWQgPyBjaC5jaGFyQXQoMSkgOiBjYXB0dXJlc1tmIC0gMV0gKyBjaC5jaGFyQXQoMSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tuIC0gMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FwdHVyZSA9PT0gdW5kZWZpbmVkID8gJycgOiBjYXB0dXJlO1xuICAgIH0pO1xuICB9XG59KTtcblxuLy8gYSBzdHJpbmcgb2YgYWxsIHZhbGlkIHVuaWNvZGUgd2hpdGVzcGFjZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG52YXIgd2hpdGVzcGFjZXMgPSAnXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcXHUyMDI5XFx1RkVGRic7XG5cbnZhciB3aGl0ZXNwYWNlID0gJ1snICsgd2hpdGVzcGFjZXMgKyAnXSc7XG52YXIgbHRyaW0gPSBSZWdFeHAoJ14nICsgd2hpdGVzcGFjZSArIHdoaXRlc3BhY2UgKyAnKicpO1xudmFyIHJ0cmltID0gUmVnRXhwKHdoaXRlc3BhY2UgKyB3aGl0ZXNwYWNlICsgJyokJyk7XG5cbi8vIGBTdHJpbmcucHJvdG90eXBlLnsgdHJpbSwgdHJpbVN0YXJ0LCB0cmltRW5kLCB0cmltTGVmdCwgdHJpbVJpZ2h0IH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QkMyA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICBpZiAoVFlQRSAmIDEpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKGx0cmltLCAnJyk7XG4gICAgaWYgKFRZUEUgJiAyKSBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShydHJpbSwgJycpO1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG59O1xuXG52YXIgc3RyaW5nVHJpbSA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltTGVmdCwgdHJpbVN0YXJ0IH1gIG1ldGhvZHNcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltc3RhcnRcbiAgc3RhcnQ6IGNyZWF0ZU1ldGhvZCQzKDEpLFxuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1SaWdodCwgdHJpbUVuZCB9YCBtZXRob2RzXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbWVuZFxuICBlbmQ6IGNyZWF0ZU1ldGhvZCQzKDIpLFxuICAvLyBgU3RyaW5nLnByb3RvdHlwZS50cmltYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS50cmltXG4gIHRyaW06IGNyZWF0ZU1ldGhvZCQzKDMpXG59O1xuXG52YXIgbm9uID0gJ1xcdTIwMEJcXHUwMDg1XFx1MTgwRSc7XG5cbi8vIGNoZWNrIHRoYXQgYSBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgY29ycmVjdCBsaXN0XG4vLyBvZiB3aGl0ZXNwYWNlcyBhbmQgaGFzIGEgY29ycmVjdCBuYW1lXG52YXIgZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICByZXR1cm4gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXdoaXRlc3BhY2VzW01FVEhPRF9OQU1FXSgpIHx8IG5vbltNRVRIT0RfTkFNRV0oKSAhPSBub24gfHwgd2hpdGVzcGFjZXNbTUVUSE9EX05BTUVdLm5hbWUgIT09IE1FVEhPRF9OQU1FO1xuICB9KTtcbn07XG5cbnZhciAkdHJpbSA9IHN0cmluZ1RyaW0udHJpbTtcblxuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS50cmltYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbVxuX2V4cG9ydCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IGZvcmNlZFN0cmluZ1RyaW1NZXRob2QoJ3RyaW0nKSB9LCB7XG4gIHRyaW06IGZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgcmV0dXJuICR0cmltKHRoaXMpO1xuICB9XG59KTtcblxuLy8gTWFwIGZ1bmN0aW9uXG5mdW5jdGlvbiBtYXAoYXJyYXksIGJsb2NrKSB7XG4gIHZhciBpO1xuICB2YXIgaWwgPSBhcnJheS5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgaWw7IGkrKykge1xuICAgIHJlc3VsdC5wdXNoKGJsb2NrKGFycmF5W2ldKSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSAvLyBGaWx0ZXIgZnVuY3Rpb25cblxuZnVuY3Rpb24gZmlsdGVyKGFycmF5LCBibG9jaykge1xuICB2YXIgaTtcbiAgdmFyIGlsID0gYXJyYXkubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGlsOyBpKyspIHtcbiAgICBpZiAoYmxvY2soYXJyYXlbaV0pKSB7XG4gICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0gLy8gRGVncmVlcyB0byByYWRpYW5zXG5cbmZ1bmN0aW9uIHJhZGlhbnMoZCkge1xuICByZXR1cm4gZCAlIDM2MCAqIE1hdGguUEkgLyAxODA7XG59IC8vIFJhZGlhbnMgdG8gZGVncmVlc1xuXG5mdW5jdGlvbiBkZWdyZWVzKHIpIHtcbiAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJICUgMzYwO1xufSAvLyBDb252ZXJ0IGRhc2gtc2VwYXJhdGVkLXN0cmluZyB0byBjYW1lbENhc2VcblxuZnVuY3Rpb24gY2FtZWxDYXNlKHMpIHtcbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uIChtLCBnKSB7XG4gICAgcmV0dXJuIGcudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59IC8vIENvbnZlcnQgY2FtZWwgY2FzZWQgc3RyaW5nIHRvIHN0cmluZyBzZXBlcmF0ZWRcblxuZnVuY3Rpb24gdW5DYW1lbENhc2Uocykge1xuICByZXR1cm4gcy5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChtLCBnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59IC8vIENhcGl0YWxpemUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nXG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUocykge1xuICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG59IC8vIENhbGN1bGF0ZSBwcm9wb3J0aW9uYWwgd2lkdGggYW5kIGhlaWdodCB2YWx1ZXMgd2hlbiBuZWNlc3NhcnlcblxuZnVuY3Rpb24gcHJvcG9ydGlvbmFsU2l6ZShlbGVtZW50LCB3aWR0aCwgaGVpZ2h0LCBib3gpIHtcbiAgaWYgKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwpIHtcbiAgICBib3ggPSBib3ggfHwgZWxlbWVudC5iYm94KCk7XG5cbiAgICBpZiAod2lkdGggPT0gbnVsbCkge1xuICAgICAgd2lkdGggPSBib3gud2lkdGggLyBib3guaGVpZ2h0ICogaGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAoaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IGJveC5oZWlnaHQgLyBib3gud2lkdGggKiB3aWR0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufVxuZnVuY3Rpb24gZ2V0T3JpZ2luKG8sIGVsZW1lbnQpIHtcbiAgLy8gQWxsb3cgb3JpZ2luIG9yIGFyb3VuZCBhcyB0aGUgbmFtZXNcbiAgdmFyIG9yaWdpbiA9IG8ub3JpZ2luOyAvLyBvLmFyb3VuZCA9PSBudWxsID8gby5vcmlnaW4gOiBvLmFyb3VuZFxuXG4gIHZhciBveCwgb3k7IC8vIEFsbG93IHRoZSB1c2VyIHRvIHBhc3MgYSBzdHJpbmcgdG8gcm90YXRlIGFyb3VuZCBhIGdpdmVuIHBvaW50XG5cbiAgaWYgKHR5cGVvZiBvcmlnaW4gPT09ICdzdHJpbmcnIHx8IG9yaWdpbiA9PSBudWxsKSB7XG4gICAgLy8gR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGVsZW1lbnQgd2l0aCBubyB0cmFuc2Zvcm1hdGlvbnMgYXBwbGllZFxuICAgIHZhciBzdHJpbmcgPSAob3JpZ2luIHx8ICdjZW50ZXInKS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICAgIHZhciBfZWxlbWVudCRiYm94ID0gZWxlbWVudC5iYm94KCksXG4gICAgICAgIGhlaWdodCA9IF9lbGVtZW50JGJib3guaGVpZ2h0LFxuICAgICAgICB3aWR0aCA9IF9lbGVtZW50JGJib3gud2lkdGgsXG4gICAgICAgIHggPSBfZWxlbWVudCRiYm94LngsXG4gICAgICAgIHkgPSBfZWxlbWVudCRiYm94Lnk7IC8vIENhbGN1bGF0ZSB0aGUgdHJhbnNmb3JtZWQgeCBhbmQgeSBjb29yZGluYXRlc1xuXG5cbiAgICB2YXIgYnggPSBzdHJpbmcuaW5jbHVkZXMoJ2xlZnQnKSA/IHggOiBzdHJpbmcuaW5jbHVkZXMoJ3JpZ2h0JykgPyB4ICsgd2lkdGggOiB4ICsgd2lkdGggLyAyO1xuICAgIHZhciBieSA9IHN0cmluZy5pbmNsdWRlcygndG9wJykgPyB5IDogc3RyaW5nLmluY2x1ZGVzKCdib3R0b20nKSA/IHkgKyBoZWlnaHQgOiB5ICsgaGVpZ2h0IC8gMjsgLy8gU2V0IHRoZSBib3VuZHMgZWcgOiBcImJvdHRvbS1sZWZ0XCIsIFwiVG9wIHJpZ2h0XCIsIFwibWlkZGxlXCIgZXRjLi4uXG5cbiAgICBveCA9IG8ub3ggIT0gbnVsbCA/IG8ub3ggOiBieDtcbiAgICBveSA9IG8ub3kgIT0gbnVsbCA/IG8ub3kgOiBieTtcbiAgfSBlbHNlIHtcbiAgICBveCA9IG9yaWdpblswXTtcbiAgICBveSA9IG9yaWdpblsxXTtcbiAgfSAvLyBSZXR1cm4gdGhlIG9yaWdpbiBhcyBpdCBpcyBpZiBpdCB3YXNuJ3QgYSBzdHJpbmdcblxuXG4gIHJldHVybiBbb3gsIG95XTtcbn1cblxudmFyIHV0aWxzID0gKHtcblx0X19wcm90b19fOiBudWxsLFxuXHRtYXA6IG1hcCxcblx0ZmlsdGVyOiBmaWx0ZXIsXG5cdHJhZGlhbnM6IHJhZGlhbnMsXG5cdGRlZ3JlZXM6IGRlZ3JlZXMsXG5cdGNhbWVsQ2FzZTogY2FtZWxDYXNlLFxuXHR1bkNhbWVsQ2FzZTogdW5DYW1lbENhc2UsXG5cdGNhcGl0YWxpemU6IGNhcGl0YWxpemUsXG5cdHByb3BvcnRpb25hbFNpemU6IHByb3BvcnRpb25hbFNpemUsXG5cdGdldE9yaWdpbjogZ2V0T3JpZ2luXG59KTtcblxuLy8gRGVmYXVsdCBuYW1lc3BhY2VzXG52YXIgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xudmFyIHhtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJztcbnZhciB4bGluayA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcbnZhciBzdmdqcyA9ICdodHRwOi8vc3ZnanMuY29tL3N2Z2pzJztcblxudmFyIG5hbWVzcGFjZXMgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdG5zOiBucyxcblx0eG1sbnM6IHhtbG5zLFxuXHR4bGluazogeGxpbmssXG5cdHN2Z2pzOiBzdmdqc1xufSk7XG5cbnZhciBnbG9iYWxzID0ge1xuICB3aW5kb3c6IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHdpbmRvdyxcbiAgZG9jdW1lbnQ6IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogZG9jdW1lbnRcbn07XG5mdW5jdGlvbiByZWdpc3RlcldpbmRvdygpIHtcbiAgdmFyIHdpbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgZ2xvYmFscy53aW5kb3cgPSB3aW47XG4gIGdsb2JhbHMuZG9jdW1lbnQgPSBkb2M7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbnZhciBCYXNlID0gZnVuY3Rpb24gQmFzZSgpIHtcbiAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2UpO1xufTtcblxudmFyIGVsZW1lbnRzID0ge307XG52YXIgcm9vdCA9ICdfX19TWU1CT0xfX19ST09UX19fJzsgLy8gTWV0aG9kIGZvciBlbGVtZW50IGNyZWF0aW9uXG5cbmZ1bmN0aW9uIGNyZWF0ZShuYW1lKSB7XG4gIC8vIGNyZWF0ZSBlbGVtZW50XG4gIHJldHVybiBnbG9iYWxzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgbmFtZSk7XG59XG5mdW5jdGlvbiBtYWtlSW5zdGFuY2UoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJhc2UpIHJldHVybiBlbGVtZW50O1xuXG4gIGlmIChfdHlwZW9mKGVsZW1lbnQpID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBhZG9wdGVyKGVsZW1lbnQpO1xuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgZWxlbWVudHNbcm9vdF0oKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycgJiYgZWxlbWVudC5jaGFyQXQoMCkgIT09ICc8Jykge1xuICAgIHJldHVybiBhZG9wdGVyKGdsb2JhbHMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KSk7XG4gIH1cblxuICB2YXIgbm9kZSA9IGNyZWF0ZSgnc3ZnJyk7XG4gIG5vZGUuaW5uZXJIVE1MID0gZWxlbWVudDsgLy8gV2UgY2FuIHVzZSBmaXJzdENoaWxkIGhlcmUgYmVjYXVzZSB3ZSBrbm93LFxuICAvLyB0aGF0IHRoZSBmaXJzdCBjaGFyIGlzIDwgYW5kIHRodXMgYW4gZWxlbWVudFxuXG4gIGVsZW1lbnQgPSBhZG9wdGVyKG5vZGUuZmlyc3RDaGlsZCk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuZnVuY3Rpb24gbm9kZU9yTmV3KG5hbWUsIG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBnbG9iYWxzLndpbmRvdy5Ob2RlID8gbm9kZSA6IGNyZWF0ZShuYW1lKTtcbn0gLy8gQWRvcHQgZXhpc3Rpbmcgc3ZnIGVsZW1lbnRzXG5cbmZ1bmN0aW9uIGFkb3B0KG5vZGUpIHtcbiAgLy8gY2hlY2sgZm9yIHByZXNlbmNlIG9mIG5vZGVcbiAgaWYgKCFub2RlKSByZXR1cm4gbnVsbDsgLy8gbWFrZSBzdXJlIGEgbm9kZSBpc24ndCBhbHJlYWR5IGFkb3B0ZWRcblxuICBpZiAobm9kZS5pbnN0YW5jZSBpbnN0YW5jZW9mIEJhc2UpIHJldHVybiBub2RlLmluc3RhbmNlOyAvLyBpbml0aWFsaXplIHZhcmlhYmxlc1xuXG4gIHZhciBjbGFzc05hbWUgPSBjYXBpdGFsaXplKG5vZGUubm9kZU5hbWUgfHwgJ0RvbScpOyAvLyBNYWtlIHN1cmUgdGhhdCBncmFkaWVudHMgYXJlIGFkb3B0ZWQgY29ycmVjdGx5XG5cbiAgaWYgKGNsYXNzTmFtZSA9PT0gJ0xpbmVhckdyYWRpZW50JyB8fCBjbGFzc05hbWUgPT09ICdSYWRpYWxHcmFkaWVudCcpIHtcbiAgICBjbGFzc05hbWUgPSAnR3JhZGllbnQnOyAvLyBGYWxsYmFjayB0byBEb20gaWYgZWxlbWVudCBpcyBub3Qga25vd25cbiAgfSBlbHNlIGlmICghZWxlbWVudHNbY2xhc3NOYW1lXSkge1xuICAgIGNsYXNzTmFtZSA9ICdEb20nO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBlbGVtZW50c1tjbGFzc05hbWVdKG5vZGUpO1xufVxudmFyIGFkb3B0ZXIgPSBhZG9wdDtcbmZ1bmN0aW9uIG1vY2tBZG9wdCgpIHtcbiAgdmFyIG1vY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGFkb3B0O1xuICBhZG9wdGVyID0gbW9jaztcbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyKGVsZW1lbnQpIHtcbiAgdmFyIG5hbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGVsZW1lbnQubmFtZTtcbiAgdmFyIGFzUm9vdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG4gIGVsZW1lbnRzW25hbWVdID0gZWxlbWVudDtcbiAgaWYgKGFzUm9vdCkgZWxlbWVudHNbcm9vdF0gPSBlbGVtZW50O1xuICBhZGRNZXRob2ROYW1lcyhPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlbGVtZW50LnByb3RvdHlwZSkpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbmZ1bmN0aW9uIGdldENsYXNzKG5hbWUpIHtcbiAgcmV0dXJuIGVsZW1lbnRzW25hbWVdO1xufSAvLyBFbGVtZW50IGlkIHNlcXVlbmNlXG5cbnZhciBkaWQgPSAxMDAwOyAvLyBHZXQgbmV4dCBuYW1lZCBlbGVtZW50IGlkXG5cbmZ1bmN0aW9uIGVpZChuYW1lKSB7XG4gIHJldHVybiAnU3ZnanMnICsgY2FwaXRhbGl6ZShuYW1lKSArIGRpZCsrO1xufSAvLyBEZWVwIG5ldyBpZCBhc3NpZ25tZW50XG5cbmZ1bmN0aW9uIGFzc2lnbk5ld0lkKG5vZGUpIHtcbiAgLy8gZG8gdGhlIHNhbWUgZm9yIFNWRyBjaGlsZCBub2RlcyBhcyB3ZWxsXG4gIGZvciAodmFyIGkgPSBub2RlLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgYXNzaWduTmV3SWQobm9kZS5jaGlsZHJlbltpXSk7XG4gIH1cblxuICBpZiAobm9kZS5pZCkge1xuICAgIHJldHVybiBhZG9wdChub2RlKS5pZChlaWQobm9kZS5ub2RlTmFtZSkpO1xuICB9XG5cbiAgcmV0dXJuIGFkb3B0KG5vZGUpO1xufSAvLyBNZXRob2QgZm9yIGV4dGVuZGluZyBvYmplY3RzXG5cbmZ1bmN0aW9uIGV4dGVuZChtb2R1bGVzLCBtZXRob2RzLCBhdHRyQ2hlY2spIHtcbiAgdmFyIGtleSwgaTtcbiAgbW9kdWxlcyA9IEFycmF5LmlzQXJyYXkobW9kdWxlcykgPyBtb2R1bGVzIDogW21vZHVsZXNdO1xuXG4gIGZvciAoaSA9IG1vZHVsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1trZXldO1xuXG4gICAgICBpZiAoYXR0ckNoZWNrKSB7XG4gICAgICAgIG1ldGhvZCA9IHdyYXBXaXRoQXR0ckNoZWNrKG1ldGhvZHNba2V5XSk7XG4gICAgICB9XG5cbiAgICAgIG1vZHVsZXNbaV0ucHJvdG90eXBlW2tleV0gPSBtZXRob2Q7XG4gICAgfVxuICB9XG59IC8vIGV4cG9ydCBmdW5jdGlvbiBleHRlbmRXaXRoQXR0ckNoZWNrICguLi5hcmdzKSB7XG4vLyAgIGV4dGVuZCguLi5hcmdzLCB0cnVlKVxuLy8gfVxuXG5mdW5jdGlvbiB3cmFwV2l0aEF0dHJDaGVjayhmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgbyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChvICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdCAmJiAhKG8gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzLnNsaWNlKDAsIC0xKSkuYXR0cihvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGludmVudChjb25maWcpIHtcbiAgLy8gQ3JlYXRlIGVsZW1lbnQgaW5pdGlhbGl6ZXJcbiAgdmFyIGluaXRpYWxpemVyID0gdHlwZW9mIGNvbmZpZy5jcmVhdGUgPT09ICdmdW5jdGlvbicgPyBjb25maWcuY3JlYXRlIDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB0aGlzLmNvbnN0cnVjdG9yKG5vZGUgfHwgY3JlYXRlKGNvbmZpZy5jcmVhdGUpKTtcbiAgfTsgLy8gSW5oZXJpdCBwcm90b3R5cGVcblxuICBpZiAoY29uZmlnLmluaGVyaXQpIHtcbiAgICAvKiBlc2xpbnQgbmV3LWNhcDogb2ZmICovXG4gICAgaW5pdGlhbGl6ZXIucHJvdG90eXBlID0gbmV3IGNvbmZpZy5pbmhlcml0KCk7XG4gICAgaW5pdGlhbGl6ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gaW5pdGlhbGl6ZXI7XG4gIH0gLy8gRXh0ZW5kIHdpdGggbWV0aG9kc1xuXG5cbiAgaWYgKGNvbmZpZy5leHRlbmQpIHtcbiAgICBleHRlbmQoaW5pdGlhbGl6ZXIsIGNvbmZpZy5leHRlbmQpO1xuICB9IC8vIEF0dGFjaCBjb25zdHJ1Y3QgbWV0aG9kIHRvIHBhcmVudFxuXG5cbiAgaWYgKGNvbmZpZy5jb25zdHJ1Y3QpIHtcbiAgICBleHRlbmQoY29uZmlnLnBhcmVudCB8fCBlbGVtZW50cy5Db250YWluZXIsIGNvbmZpZy5jb25zdHJ1Y3QpO1xuICB9XG5cbiAgcmV0dXJuIGluaXRpYWxpemVyO1xufVxuXG5mdW5jdGlvbiBzaWJsaW5ncygpIHtcbiAgcmV0dXJuIHRoaXMucGFyZW50KCkuY2hpbGRyZW4oKTtcbn0gLy8gR2V0IHRoZSBjdXJlbnQgcG9zaXRpb24gc2libGluZ3NcblxuZnVuY3Rpb24gcG9zaXRpb24oKSB7XG4gIHJldHVybiB0aGlzLnBhcmVudCgpLmluZGV4KHRoaXMpO1xufSAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxuXG5mdW5jdGlvbiBuZXh0KCkge1xuICByZXR1cm4gdGhpcy5zaWJsaW5ncygpW3RoaXMucG9zaXRpb24oKSArIDFdO1xufSAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxuXG5mdW5jdGlvbiBwcmV2KCkge1xuICByZXR1cm4gdGhpcy5zaWJsaW5ncygpW3RoaXMucG9zaXRpb24oKSAtIDFdO1xufSAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgb25lIHN0ZXAgZm9yd2FyZFxuXG5mdW5jdGlvbiBmb3J3YXJkKCkge1xuICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKSArIDE7XG4gIHZhciBwID0gdGhpcy5wYXJlbnQoKTsgLy8gbW92ZSBub2RlIG9uZSBzdGVwIGZvcndhcmRcblxuICBwLnJlbW92ZUVsZW1lbnQodGhpcykuYWRkKHRoaXMsIGkpOyAvLyBtYWtlIHN1cmUgZGVmcyBub2RlIGlzIGFsd2F5cyBhdCB0aGUgdG9wXG5cbiAgaWYgKHR5cGVvZiBwLmlzUm9vdCA9PT0gJ2Z1bmN0aW9uJyAmJiBwLmlzUm9vdCgpKSB7XG4gICAgcC5ub2RlLmFwcGVuZENoaWxkKHAuZGVmcygpLm5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59IC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBvbmUgc3RlcCBiYWNrd2FyZFxuXG5mdW5jdGlvbiBiYWNrd2FyZCgpIHtcbiAgdmFyIGkgPSB0aGlzLnBvc2l0aW9uKCk7XG5cbiAgaWYgKGkgPiAwKSB7XG4gICAgdGhpcy5wYXJlbnQoKS5yZW1vdmVFbGVtZW50KHRoaXMpLmFkZCh0aGlzLCBpIC0gMSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gU2VuZCBnaXZlbiBlbGVtZW50IGFsbCB0aGUgd2F5IHRvIHRoZSBmcm9udFxuXG5mdW5jdGlvbiBmcm9udCgpIHtcbiAgdmFyIHAgPSB0aGlzLnBhcmVudCgpOyAvLyBNb3ZlIG5vZGUgZm9yd2FyZFxuXG4gIHAubm9kZS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpOyAvLyBNYWtlIHN1cmUgZGVmcyBub2RlIGlzIGFsd2F5cyBhdCB0aGUgdG9wXG5cbiAgaWYgKHR5cGVvZiBwLmlzUm9vdCA9PT0gJ2Z1bmN0aW9uJyAmJiBwLmlzUm9vdCgpKSB7XG4gICAgcC5ub2RlLmFwcGVuZENoaWxkKHAuZGVmcygpLm5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59IC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBhbGwgdGhlIHdheSB0byB0aGUgYmFja1xuXG5mdW5jdGlvbiBiYWNrKCkge1xuICBpZiAodGhpcy5wb3NpdGlvbigpID4gMCkge1xuICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKS5hZGQodGhpcywgMCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gSW5zZXJ0cyBhIGdpdmVuIGVsZW1lbnQgYmVmb3JlIHRoZSB0YXJnZXRlZCBlbGVtZW50XG5cbmZ1bmN0aW9uIGJlZm9yZShlbGVtZW50KSB7XG4gIGVsZW1lbnQgPSBtYWtlSW5zdGFuY2UoZWxlbWVudCk7XG4gIGVsZW1lbnQucmVtb3ZlKCk7XG4gIHZhciBpID0gdGhpcy5wb3NpdGlvbigpO1xuICB0aGlzLnBhcmVudCgpLmFkZChlbGVtZW50LCBpKTtcbiAgcmV0dXJuIHRoaXM7XG59IC8vIEluc2VydHMgYSBnaXZlbiBlbGVtZW50IGFmdGVyIHRoZSB0YXJnZXRlZCBlbGVtZW50XG5cbmZ1bmN0aW9uIGFmdGVyKGVsZW1lbnQpIHtcbiAgZWxlbWVudCA9IG1ha2VJbnN0YW5jZShlbGVtZW50KTtcbiAgZWxlbWVudC5yZW1vdmUoKTtcbiAgdmFyIGkgPSB0aGlzLnBvc2l0aW9uKCk7XG4gIHRoaXMucGFyZW50KCkuYWRkKGVsZW1lbnQsIGkgKyAxKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUoZWxlbWVudCkge1xuICBlbGVtZW50ID0gbWFrZUluc3RhbmNlKGVsZW1lbnQpO1xuICBlbGVtZW50LmJlZm9yZSh0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBpbnNlcnRBZnRlcihlbGVtZW50KSB7XG4gIGVsZW1lbnQgPSBtYWtlSW5zdGFuY2UoZWxlbWVudCk7XG4gIGVsZW1lbnQuYWZ0ZXIodGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxucmVnaXN0ZXJNZXRob2RzKCdEb20nLCB7XG4gIHNpYmxpbmdzOiBzaWJsaW5ncyxcbiAgcG9zaXRpb246IHBvc2l0aW9uLFxuICBuZXh0OiBuZXh0LFxuICBwcmV2OiBwcmV2LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBiYWNrd2FyZDogYmFja3dhcmQsXG4gIGZyb250OiBmcm9udCxcbiAgYmFjazogYmFjayxcbiAgYmVmb3JlOiBiZWZvcmUsXG4gIGFmdGVyOiBhZnRlcixcbiAgaW5zZXJ0QmVmb3JlOiBpbnNlcnRCZWZvcmUsXG4gIGluc2VydEFmdGVyOiBpbnNlcnRBZnRlclxufSk7XG5cbnZhciAkZmlsdGVyID0gYXJyYXlJdGVyYXRpb24uZmlsdGVyO1xuXG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWx0ZXJcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBzcGVjaWVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiAhYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnZmlsdGVyJykgfSwge1xuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbnZhciBzbG9wcHlBcnJheU1ldGhvZCA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgYXJndW1lbnQpIHtcbiAgdmFyIG1ldGhvZCA9IFtdW01FVEhPRF9OQU1FXTtcbiAgcmV0dXJuICFtZXRob2QgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsLG5vLXRocm93LWxpdGVyYWxcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHRocm93IDE7IH0sIDEpO1xuICB9KTtcbn07XG5cbnZhciAkaW5kZXhPZiA9IGFycmF5SW5jbHVkZXMuaW5kZXhPZjtcblxuXG52YXIgbmF0aXZlSW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbnZhciBORUdBVElWRV9aRVJPID0gISFuYXRpdmVJbmRleE9mICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xudmFyIFNMT1BQWV9NRVRIT0QgPSBzbG9wcHlBcnJheU1ldGhvZCgnaW5kZXhPZicpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2Zcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IE5FR0FUSVZFX1pFUk8gfHwgU0xPUFBZX01FVEhPRCB9LCB7XG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcbiAgICByZXR1cm4gTkVHQVRJVkVfWkVST1xuICAgICAgLy8gY29udmVydCAtMCB0byArMFxuICAgICAgPyBuYXRpdmVJbmRleE9mLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgMFxuICAgICAgOiAkaW5kZXhPZih0aGlzLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG52YXIgbmF0aXZlSm9pbiA9IFtdLmpvaW47XG5cbnZhciBFUzNfU1RSSU5HUyA9IGluZGV4ZWRPYmplY3QgIT0gT2JqZWN0O1xudmFyIFNMT1BQWV9NRVRIT0QkMSA9IHNsb3BweUFycmF5TWV0aG9kKCdqb2luJywgJywnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5qb2luYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5qb2luXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBFUzNfU1RSSU5HUyB8fCBTTE9QUFlfTUVUSE9EJDEgfSwge1xuICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgIHJldHVybiBuYXRpdmVKb2luLmNhbGwodG9JbmRleGVkT2JqZWN0KHRoaXMpLCBzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCA/ICcsJyA6IHNlcGFyYXRvcik7XG4gIH1cbn0pO1xuXG52YXIgU1BFQ0lFUyQ1ID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBTcGVjaWVzQ29uc3RydWN0b3JgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3BlY2llc2NvbnN0cnVjdG9yXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gZnVuY3Rpb24gKE8sIGRlZmF1bHRDb25zdHJ1Y3Rvcikge1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yO1xuICB2YXIgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVMkNV0pID09IHVuZGVmaW5lZCA/IGRlZmF1bHRDb25zdHJ1Y3RvciA6IGFGdW5jdGlvbiQxKFMpO1xufTtcblxudmFyIGFycmF5UHVzaCA9IFtdLnB1c2g7XG52YXIgbWluJDMgPSBNYXRoLm1pbjtcbnZhciBNQVhfVUlOVDMyID0gMHhGRkZGRkZGRjtcblxuLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCd4JywgJ3knKSAtPiAveC95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbnZhciBTVVBQT1JUU19ZID0gIWZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuICFSZWdFeHAoTUFYX1VJTlQzMiwgJ3knKTsgfSk7XG5cbi8vIEBAc3BsaXQgbG9naWNcbmZpeFJlZ2V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdzcGxpdCcsIDIsIGZ1bmN0aW9uIChTUExJVCwgbmF0aXZlU3BsaXQsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICB2YXIgaW50ZXJuYWxTcGxpdDtcbiAgaWYgKFxuICAgICdhYmJjJy5zcGxpdCgvKGIpKi8pWzFdID09ICdjJyB8fFxuICAgICd0ZXN0Jy5zcGxpdCgvKD86KS8sIC0xKS5sZW5ndGggIT0gNCB8fFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT0gMiB8fFxuICAgICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT0gNCB8fFxuICAgICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDEgfHxcbiAgICAnJy5zcGxpdCgvLj8vKS5sZW5ndGhcbiAgKSB7XG4gICAgLy8gYmFzZWQgb24gZXM1LXNoaW0gaW1wbGVtZW50YXRpb24sIG5lZWQgdG8gcmV3b3JrIGl0XG4gICAgaW50ZXJuYWxTcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgICAgdmFyIGxpbSA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyBNQVhfVUlOVDMyIDogbGltaXQgPj4+IDA7XG4gICAgICBpZiAobGltID09PSAwKSByZXR1cm4gW107XG4gICAgICBpZiAoc2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHJldHVybiBbc3RyaW5nXTtcbiAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICBpZiAoIWlzUmVnZXhwKHNlcGFyYXRvcikpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbSk7XG4gICAgICB9XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICB2YXIgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci51bmljb2RlID8gJ3UnIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpO1xuICAgICAgdmFyIGxhc3RMYXN0SW5kZXggPSAwO1xuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHZhciBzZXBhcmF0b3JDb3B5ID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArICdnJyk7XG4gICAgICB2YXIgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4cEV4ZWMuY2FsbChzZXBhcmF0b3JDb3B5LCBzdHJpbmcpKSB7XG4gICAgICAgIGxhc3RJbmRleCA9IHNlcGFyYXRvckNvcHkubGFzdEluZGV4O1xuICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkgYXJyYXlQdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW0pIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHNlcGFyYXRvckNvcHkubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIGlmIChsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3JDb3B5LnRlc3QoJycpKSBvdXRwdXQucHVzaCgnJyk7XG4gICAgICB9IGVsc2Ugb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltID8gb3V0cHV0LnNsaWNlKDAsIGxpbSkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgLy8gQ2hha3JhLCBWOFxuICB9IGVsc2UgaWYgKCcwJy5zcGxpdCh1bmRlZmluZWQsIDApLmxlbmd0aCkge1xuICAgIGludGVybmFsU3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgcmV0dXJuIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwID8gW10gOiBuYXRpdmVTcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH07XG4gIH0gZWxzZSBpbnRlcm5hbFNwbGl0ID0gbmF0aXZlU3BsaXQ7XG5cbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5zcGxpdGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5zcGxpdFxuICAgIGZ1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBzcGxpdHRlciA9IHNlcGFyYXRvciA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZXBhcmF0b3JbU1BMSVRdO1xuICAgICAgcmV0dXJuIHNwbGl0dGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBzcGxpdHRlci5jYWxsKHNlcGFyYXRvciwgTywgbGltaXQpXG4gICAgICAgIDogaW50ZXJuYWxTcGxpdC5jYWxsKFN0cmluZyhPKSwgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHNwbGl0XG4gICAgLy9cbiAgICAvLyBOT1RFOiBUaGlzIGNhbm5vdCBiZSBwcm9wZXJseSBwb2x5ZmlsbGVkIGluIGVuZ2luZXMgdGhhdCBkb24ndCBzdXBwb3J0XG4gICAgLy8gdGhlICd5JyBmbGFnLlxuICAgIGZ1bmN0aW9uIChyZWdleHAsIGxpbWl0KSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKGludGVybmFsU3BsaXQsIHJlZ2V4cCwgdGhpcywgbGltaXQsIGludGVybmFsU3BsaXQgIT09IG5hdGl2ZVNwbGl0KTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgdmFyIEMgPSBzcGVjaWVzQ29uc3RydWN0b3IocngsIFJlZ0V4cCk7XG5cbiAgICAgIHZhciB1bmljb2RlTWF0Y2hpbmcgPSByeC51bmljb2RlO1xuICAgICAgdmFyIGZsYWdzID0gKHJ4Lmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHJ4Lm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocngudW5pY29kZSA/ICd1JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoU1VQUE9SVFNfWSA/ICd5JyA6ICdnJyk7XG5cbiAgICAgIC8vIF4oPyArIHJ4ICsgKSBpcyBuZWVkZWQsIGluIGNvbWJpbmF0aW9uIHdpdGggc29tZSBTIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICB2YXIgc3BsaXR0ZXIgPSBuZXcgQyhTVVBQT1JUU19ZID8gcnggOiAnXig/OicgKyByeC5zb3VyY2UgKyAnKScsIGZsYWdzKTtcbiAgICAgIHZhciBsaW0gPSBsaW1pdCA9PT0gdW5kZWZpbmVkID8gTUFYX1VJTlQzMiA6IGxpbWl0ID4+PiAwO1xuICAgICAgaWYgKGxpbSA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgaWYgKFMubGVuZ3RoID09PSAwKSByZXR1cm4gcmVnZXhwRXhlY0Fic3RyYWN0KHNwbGl0dGVyLCBTKSA9PT0gbnVsbCA/IFtTXSA6IFtdO1xuICAgICAgdmFyIHAgPSAwO1xuICAgICAgdmFyIHEgPSAwO1xuICAgICAgdmFyIEEgPSBbXTtcbiAgICAgIHdoaWxlIChxIDwgUy5sZW5ndGgpIHtcbiAgICAgICAgc3BsaXR0ZXIubGFzdEluZGV4ID0gU1VQUE9SVFNfWSA/IHEgOiAwO1xuICAgICAgICB2YXIgeiA9IHJlZ2V4cEV4ZWNBYnN0cmFjdChzcGxpdHRlciwgU1VQUE9SVFNfWSA/IFMgOiBTLnNsaWNlKHEpKTtcbiAgICAgICAgdmFyIGU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB6ID09PSBudWxsIHx8XG4gICAgICAgICAgKGUgPSBtaW4kMyh0b0xlbmd0aChzcGxpdHRlci5sYXN0SW5kZXggKyAoU1VQUE9SVFNfWSA/IDAgOiBxKSksIFMubGVuZ3RoKSkgPT09IHBcbiAgICAgICAgKSB7XG4gICAgICAgICAgcSA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCBxLCB1bmljb2RlTWF0Y2hpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEEucHVzaChTLnNsaWNlKHAsIHEpKTtcbiAgICAgICAgICBpZiAoQS5sZW5ndGggPT09IGxpbSkgcmV0dXJuIEE7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gei5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIEEucHVzaCh6W2ldKTtcbiAgICAgICAgICAgIGlmIChBLmxlbmd0aCA9PT0gbGltKSByZXR1cm4gQTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcSA9IHAgPSBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBBLnB1c2goUy5zbGljZShwKSk7XG4gICAgICByZXR1cm4gQTtcbiAgICB9XG4gIF07XG59LCAhU1VQUE9SVFNfWSk7XG5cbi8vIFBhcnNlIHVuaXQgdmFsdWVcbnZhciBudW1iZXJBbmRVbml0ID0gL14oWystXT8oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/KShbYS16JV0qKSQvaTsgLy8gUGFyc2UgaGV4IHZhbHVlXG5cbnZhciBoZXggPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pOyAvLyBQYXJzZSByZ2IgdmFsdWVcblxudmFyIHJnYiA9IC9yZ2JcXCgoXFxkKyksKFxcZCspLChcXGQrKVxcKS87IC8vIFBhcnNlIHJlZmVyZW5jZSBpZFxuXG52YXIgcmVmZXJlbmNlID0gLygjW2EtejAtOVxcLV9dKykvaTsgLy8gc3BsaXRzIGEgdHJhbnNmb3JtYXRpb24gY2hhaW5cblxudmFyIHRyYW5zZm9ybXMgPSAvXFwpXFxzKiw/XFxzKi87IC8vIFdoaXRlc3BhY2VcblxudmFyIHdoaXRlc3BhY2UkMSA9IC9cXHMvZzsgLy8gVGVzdCBoZXggdmFsdWVcblxudmFyIGlzSGV4ID0gL14jW2EtZjAtOV17Myw2fSQvaTsgLy8gVGVzdCByZ2IgdmFsdWVcblxudmFyIGlzUmdiID0gL15yZ2JcXCgvOyAvLyBUZXN0IGNzcyBkZWNsYXJhdGlvblxuXG52YXIgaXNDc3MgPSAvW146XSs6W147XSs7Py87IC8vIFRlc3QgZm9yIGJsYW5rIHN0cmluZ1xuXG52YXIgaXNCbGFuayA9IC9eKFxccyspPyQvOyAvLyBUZXN0IGZvciBudW1lcmljIHN0cmluZ1xuXG52YXIgaXNOdW1iZXIgPSAvXlsrLV0/KFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaTsgLy8gVGVzdCBmb3IgcGVyY2VudCB2YWx1ZVxuXG52YXIgaXNQZXJjZW50ID0gL14tP1tcXGQuXSslJC87IC8vIFRlc3QgZm9yIGltYWdlIHVybFxuXG52YXIgaXNJbWFnZSA9IC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpKFxcP1tePV0rLiopPy9pOyAvLyBzcGxpdCBhdCB3aGl0ZXNwYWNlIGFuZCBjb21tYVxuXG52YXIgZGVsaW1pdGVyID0gL1tcXHMsXSsvOyAvLyBUaGUgZm9sbG93aW5nIHJlZ2V4IGFyZSB1c2VkIHRvIHBhcnNlIHRoZSBkIGF0dHJpYnV0ZSBvZiBhIHBhdGhcbi8vIE1hdGNoZXMgYWxsIGh5cGhlbnMgd2hpY2ggYXJlIG5vdCBhZnRlciBhbiBleHBvbmVudFxuXG52YXIgaHlwaGVuID0gLyhbXmVdKS0vZ2k7IC8vIFJlcGxhY2VzIGFuZCB0ZXN0cyBmb3IgYWxsIHBhdGggbGV0dGVyc1xuXG52YXIgcGF0aExldHRlcnMgPSAvW01MSFZDU1FUQVpdL2dpOyAvLyB5ZXMgd2UgbmVlZCB0aGlzIG9uZSwgdG9vXG5cbnZhciBpc1BhdGhMZXR0ZXIgPSAvW01MSFZDU1FUQVpdL2k7IC8vIG1hdGNoZXMgMC4xNTQuMjMuNDVcblxudmFyIG51bWJlcnNXaXRoRG90cyA9IC8oKFxcZD9cXC5cXGQrKD86ZVsrLV0/XFxkKyk/KSgoPzpcXC5cXGQrKD86ZVsrLV0/XFxkKyk/KSspKSsvZ2k7IC8vIG1hdGNoZXMgLlxuXG52YXIgZG90cyA9IC9cXC4vZztcblxudmFyIHJlZ2V4ID0gKHtcblx0X19wcm90b19fOiBudWxsLFxuXHRudW1iZXJBbmRVbml0OiBudW1iZXJBbmRVbml0LFxuXHRoZXg6IGhleCxcblx0cmdiOiByZ2IsXG5cdHJlZmVyZW5jZTogcmVmZXJlbmNlLFxuXHR0cmFuc2Zvcm1zOiB0cmFuc2Zvcm1zLFxuXHR3aGl0ZXNwYWNlOiB3aGl0ZXNwYWNlJDEsXG5cdGlzSGV4OiBpc0hleCxcblx0aXNSZ2I6IGlzUmdiLFxuXHRpc0NzczogaXNDc3MsXG5cdGlzQmxhbms6IGlzQmxhbmssXG5cdGlzTnVtYmVyOiBpc051bWJlcixcblx0aXNQZXJjZW50OiBpc1BlcmNlbnQsXG5cdGlzSW1hZ2U6IGlzSW1hZ2UsXG5cdGRlbGltaXRlcjogZGVsaW1pdGVyLFxuXHRoeXBoZW46IGh5cGhlbixcblx0cGF0aExldHRlcnM6IHBhdGhMZXR0ZXJzLFxuXHRpc1BhdGhMZXR0ZXI6IGlzUGF0aExldHRlcixcblx0bnVtYmVyc1dpdGhEb3RzOiBudW1iZXJzV2l0aERvdHMsXG5cdGRvdHM6IGRvdHNcbn0pO1xuXG5mdW5jdGlvbiBjbGFzc2VzKCkge1xuICB2YXIgYXR0ciA9IHRoaXMuYXR0cignY2xhc3MnKTtcbiAgcmV0dXJuIGF0dHIgPT0gbnVsbCA/IFtdIDogYXR0ci50cmltKCkuc3BsaXQoZGVsaW1pdGVyKTtcbn0gLy8gUmV0dXJuIHRydWUgaWYgY2xhc3MgZXhpc3RzIG9uIHRoZSBub2RlLCBmYWxzZSBvdGhlcndpc2VcblxuZnVuY3Rpb24gaGFzQ2xhc3MobmFtZSkge1xuICByZXR1cm4gdGhpcy5jbGFzc2VzKCkuaW5kZXhPZihuYW1lKSAhPT0gLTE7XG59IC8vIEFkZCBjbGFzcyB0byB0aGUgbm9kZVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhuYW1lKSB7XG4gIGlmICghdGhpcy5oYXNDbGFzcyhuYW1lKSkge1xuICAgIHZhciBhcnJheSA9IHRoaXMuY2xhc3NlcygpO1xuICAgIGFycmF5LnB1c2gobmFtZSk7XG4gICAgdGhpcy5hdHRyKCdjbGFzcycsIGFycmF5LmpvaW4oJyAnKSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gUmVtb3ZlIGNsYXNzIGZyb20gdGhlIG5vZGVcblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MobmFtZSkge1xuICBpZiAodGhpcy5oYXNDbGFzcyhuYW1lKSkge1xuICAgIHRoaXMuYXR0cignY2xhc3MnLCB0aGlzLmNsYXNzZXMoKS5maWx0ZXIoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjICE9PSBuYW1lO1xuICAgIH0pLmpvaW4oJyAnKSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gVG9nZ2xlIHRoZSBwcmVzZW5jZSBvZiBhIGNsYXNzIG9uIHRoZSBub2RlXG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuaGFzQ2xhc3MobmFtZSkgPyB0aGlzLnJlbW92ZUNsYXNzKG5hbWUpIDogdGhpcy5hZGRDbGFzcyhuYW1lKTtcbn1cbnJlZ2lzdGVyTWV0aG9kcygnRG9tJywge1xuICBjbGFzc2VzOiBjbGFzc2VzLFxuICBoYXNDbGFzczogaGFzQ2xhc3MsXG4gIGFkZENsYXNzOiBhZGRDbGFzcyxcbiAgcmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzLFxuICB0b2dnbGVDbGFzczogdG9nZ2xlQ2xhc3Ncbn0pO1xuXG52YXIgJGZvckVhY2gkMSA9IGFycmF5SXRlcmF0aW9uLmZvckVhY2g7XG5cblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG52YXIgYXJyYXlGb3JFYWNoID0gc2xvcHB5QXJyYXlNZXRob2QoJ2ZvckVhY2gnKSA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgcmV0dXJuICRmb3JFYWNoJDEodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xufSA6IFtdLmZvckVhY2g7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZm9yZWFjaFxuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogW10uZm9yRWFjaCAhPSBhcnJheUZvckVhY2ggfSwge1xuICBmb3JFYWNoOiBhcnJheUZvckVhY2hcbn0pO1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUkMSBpbiBkb21JdGVyYWJsZXMpIHtcbiAgdmFyIENvbGxlY3Rpb24kMSA9IGdsb2JhbF8xW0NPTExFQ1RJT05fTkFNRSQxXTtcbiAgdmFyIENvbGxlY3Rpb25Qcm90b3R5cGUkMSA9IENvbGxlY3Rpb24kMSAmJiBDb2xsZWN0aW9uJDEucHJvdG90eXBlO1xuICAvLyBzb21lIENocm9tZSB2ZXJzaW9ucyBoYXZlIG5vbi1jb25maWd1cmFibGUgbWV0aG9kcyBvbiBET01Ub2tlbkxpc3RcbiAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGUkMSAmJiBDb2xsZWN0aW9uUHJvdG90eXBlJDEuZm9yRWFjaCAhPT0gYXJyYXlGb3JFYWNoKSB0cnkge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlJDEsICdmb3JFYWNoJywgYXJyYXlGb3JFYWNoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDb2xsZWN0aW9uUHJvdG90eXBlJDEuZm9yRWFjaCA9IGFycmF5Rm9yRWFjaDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjc3Moc3R5bGUsIHZhbCkge1xuICB2YXIgcmV0ID0ge307XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBnZXQgZnVsbCBzdHlsZSBhcyBvYmplY3RcbiAgICB0aGlzLm5vZGUuc3R5bGUuY3NzVGV4dC5zcGxpdCgvXFxzKjtcXHMqLykuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgcmV0dXJuICEhZWwubGVuZ3RoO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2YXIgdCA9IGVsLnNwbGl0KC9cXHMqOlxccyovKTtcbiAgICAgIHJldFt0WzBdXSA9IHRbMV07XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIC8vIGdldCBzdHlsZSBwcm9wZXJ0aWVzIGluIHRoZSBhcnJheVxuICAgIGlmIChBcnJheS5pc0FycmF5KHN0eWxlKSkge1xuICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IHN0eWxlW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBuYW1lID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgdmFyIGNhc2VkID0gY2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAgIHJldFtjYXNlZF0gPSB0aGlzLm5vZGUuc3R5bGVbY2FzZWRdO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4gIT0gbnVsbCkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gLy8gZ2V0IHN0eWxlIGZvciBwcm9wZXJ0eVxuXG5cbiAgICBpZiAodHlwZW9mIHN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZS5zdHlsZVtjYW1lbENhc2Uoc3R5bGUpXTtcbiAgICB9IC8vIHNldCBzdHlsZXMgaW4gb2JqZWN0XG5cblxuICAgIGlmIChfdHlwZW9mKHN0eWxlKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIF9uYW1lIGluIHN0eWxlKSB7XG4gICAgICAgIC8vIHNldCBlbXB0eSBzdHJpbmcgaWYgbnVsbC91bmRlZmluZWQvJycgd2FzIGdpdmVuXG4gICAgICAgIHRoaXMubm9kZS5zdHlsZVtjYW1lbENhc2UoX25hbWUpXSA9IHN0eWxlW19uYW1lXSA9PSBudWxsIHx8IGlzQmxhbmsudGVzdChzdHlsZVtfbmFtZV0pID8gJycgOiBzdHlsZVtfbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9IC8vIHNldCBzdHlsZSBmb3IgcHJvcGVydHlcblxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgdGhpcy5ub2RlLnN0eWxlW2NhbWVsQ2FzZShzdHlsZSldID0gdmFsID09IG51bGwgfHwgaXNCbGFuay50ZXN0KHZhbCkgPyAnJyA6IHZhbDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBTaG93IGVsZW1lbnRcblxuZnVuY3Rpb24gc2hvdygpIHtcbiAgcmV0dXJuIHRoaXMuY3NzKCdkaXNwbGF5JywgJycpO1xufSAvLyBIaWRlIGVsZW1lbnRcblxuZnVuY3Rpb24gaGlkZSgpIHtcbiAgcmV0dXJuIHRoaXMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbn0gLy8gSXMgZWxlbWVudCB2aXNpYmxlP1xuXG5mdW5jdGlvbiB2aXNpYmxlKCkge1xuICByZXR1cm4gdGhpcy5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnO1xufVxucmVnaXN0ZXJNZXRob2RzKCdEb20nLCB7XG4gIGNzczogY3NzLFxuICBzaG93OiBzaG93LFxuICBoaWRlOiBoaWRlLFxuICB2aXNpYmxlOiB2aXNpYmxlXG59KTtcblxuZnVuY3Rpb24gZGF0YSQxKGEsIHYsIHIpIHtcbiAgaWYgKF90eXBlb2YoYSkgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2IGluIGEpIHtcbiAgICAgIHRoaXMuZGF0YSh2LCBhW3ZdKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5hdHRyKCdkYXRhLScgKyBhKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZGF0YS0nICsgYSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuYXR0cignZGF0YS0nICsgYSwgdiA9PT0gbnVsbCA/IG51bGwgOiByID09PSB0cnVlIHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdiA9PT0gJ251bWJlcicgPyB2IDogSlNPTi5zdHJpbmdpZnkodikpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5yZWdpc3Rlck1ldGhvZHMoJ0RvbScsIHtcbiAgZGF0YTogZGF0YSQxXG59KTtcblxuZnVuY3Rpb24gcmVtZW1iZXIoaywgdikge1xuICAvLyByZW1lbWJlciBldmVyeSBpdGVtIGluIGFuIG9iamVjdCBpbmRpdmlkdWFsbHlcbiAgaWYgKF90eXBlb2YoYXJndW1lbnRzWzBdKSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gaykge1xuICAgICAgdGhpcy5yZW1lbWJlcihrZXksIGtba2V5XSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAvLyByZXRyaWV2ZSBtZW1vcnlcbiAgICByZXR1cm4gdGhpcy5tZW1vcnkoKVtrXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBzdG9yZSBtZW1vcnlcbiAgICB0aGlzLm1lbW9yeSgpW2tdID0gdjtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufSAvLyBFcmFzZSBhIGdpdmVuIG1lbW9yeVxuXG5mdW5jdGlvbiBmb3JnZXQoKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fbWVtb3J5ID0ge307XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZGVsZXRlIHRoaXMubWVtb3J5KClbYXJndW1lbnRzW2ldXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn0gLy8gVGhpcyB0cmlnZ2VycyBjcmVhdGlvbiBvZiBhIG5ldyBoaWRkZW4gY2xhc3Mgd2hpY2ggaXMgbm90IHBlcmZvcm1hbnRcbi8vIEhvd2V2ZXIsIHRoaXMgZnVuY3Rpb24gaXMgbm90IHJhcmVseSB1c2VkIHNvIGl0IHdpbGwgbm90IGhhcHBlbiBmcmVxdWVudGx5XG4vLyBSZXR1cm4gbG9jYWwgbWVtb3J5IG9iamVjdFxuXG5mdW5jdGlvbiBtZW1vcnkoKSB7XG4gIHJldHVybiB0aGlzLl9tZW1vcnkgPSB0aGlzLl9tZW1vcnkgfHwge307XG59XG5yZWdpc3Rlck1ldGhvZHMoJ0RvbScsIHtcbiAgcmVtZW1iZXI6IHJlbWVtYmVyLFxuICBmb3JnZXQ6IGZvcmdldCxcbiAgbWVtb3J5OiBtZW1vcnlcbn0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgcmVkdWNlLCByZWR1Y2VSaWdodCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kJDQgPSBmdW5jdGlvbiAoSVNfUklHSFQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBjYWxsYmFja2ZuLCBhcmd1bWVudHNMZW5ndGgsIG1lbW8pIHtcbiAgICBhRnVuY3Rpb24kMShjYWxsYmFja2ZuKTtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoYXQpO1xuICAgIHZhciBzZWxmID0gaW5kZXhlZE9iamVjdChPKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IElTX1JJR0hUID8gbGVuZ3RoIC0gMSA6IDA7XG4gICAgdmFyIGkgPSBJU19SSUdIVCA/IC0xIDogMTtcbiAgICBpZiAoYXJndW1lbnRzTGVuZ3RoIDwgMikgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChpbmRleCBpbiBzZWxmKSB7XG4gICAgICAgIG1lbW8gPSBzZWxmW2luZGV4XTtcbiAgICAgICAgaW5kZXggKz0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpbmRleCArPSBpO1xuICAgICAgaWYgKElTX1JJR0hUID8gaW5kZXggPCAwIDogbGVuZ3RoIDw9IGluZGV4KSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKDtJU19SSUdIVCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSkgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgIG1lbW8gPSBjYWxsYmFja2ZuKG1lbW8sIHNlbGZbaW5kZXhdLCBpbmRleCwgTyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9O1xufTtcblxudmFyIGFycmF5UmVkdWNlID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLnJlZHVjZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZWR1Y2VcbiAgbGVmdDogY3JlYXRlTWV0aG9kJDQoZmFsc2UpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJlZHVjZXJpZ2h0XG4gIHJpZ2h0OiBjcmVhdGVNZXRob2QkNCh0cnVlKVxufTtcblxudmFyICRyZWR1Y2UgPSBhcnJheVJlZHVjZS5sZWZ0O1xuXG5cbi8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZWR1Y2Vcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IHNsb3BweUFycmF5TWV0aG9kKCdyZWR1Y2UnKSB9LCB7XG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4gLyogLCBpbml0aWFsVmFsdWUgKi8pIHtcbiAgICByZXR1cm4gJHJlZHVjZSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG52YXIgbGlzdGVuZXJJZCA9IDA7XG52YXIgd2luZG93RXZlbnRzID0ge307XG5cbmZ1bmN0aW9uIGdldEV2ZW50cyhpbnN0YW5jZSkge1xuICB2YXIgbiA9IGluc3RhbmNlLmdldEV2ZW50SG9sZGVyKCk7IC8vIFdlIGRvbnQgd2FudCB0byBzYXZlIGV2ZW50cyBpbiBnbG9iYWwgc3BhY2VcblxuICBpZiAobiA9PT0gZ2xvYmFscy53aW5kb3cpIG4gPSB3aW5kb3dFdmVudHM7XG4gIGlmICghbi5ldmVudHMpIG4uZXZlbnRzID0ge307XG4gIHJldHVybiBuLmV2ZW50cztcbn1cblxuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXQoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmdldEV2ZW50VGFyZ2V0KCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRXZlbnRzKGluc3RhbmNlKSB7XG4gIHZhciBuID0gaW5zdGFuY2UuZ2V0RXZlbnRIb2xkZXIoKTtcbiAgaWYgKG4uZXZlbnRzKSBuLmV2ZW50cyA9IHt9O1xufSAvLyBBZGQgZXZlbnQgYmluZGVyIGluIHRoZSBTVkcgbmFtZXNwYWNlXG5cblxuZnVuY3Rpb24gb24obm9kZSwgZXZlbnRzLCBsaXN0ZW5lciwgYmluZGluZywgb3B0aW9ucykge1xuICB2YXIgbCA9IGxpc3RlbmVyLmJpbmQoYmluZGluZyB8fCBub2RlKTtcbiAgdmFyIGluc3RhbmNlID0gbWFrZUluc3RhbmNlKG5vZGUpO1xuICB2YXIgYmFnID0gZ2V0RXZlbnRzKGluc3RhbmNlKTtcbiAgdmFyIG4gPSBnZXRFdmVudFRhcmdldChpbnN0YW5jZSk7IC8vIGV2ZW50cyBjYW4gYmUgYW4gYXJyYXkgb2YgZXZlbnRzIG9yIGEgc3RyaW5nIG9mIGV2ZW50c1xuXG4gIGV2ZW50cyA9IEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IGV2ZW50cy5zcGxpdChkZWxpbWl0ZXIpOyAvLyBhZGQgaWQgdG8gbGlzdGVuZXJcblxuICBpZiAoIWxpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWQpIHtcbiAgICBsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkID0gKytsaXN0ZW5lcklkO1xuICB9XG5cbiAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ID0gZXZlbnQuc3BsaXQoJy4nKVswXTtcbiAgICB2YXIgbnMgPSBldmVudC5zcGxpdCgnLicpWzFdIHx8ICcqJzsgLy8gZW5zdXJlIHZhbGlkIG9iamVjdFxuXG4gICAgYmFnW2V2XSA9IGJhZ1tldl0gfHwge307XG4gICAgYmFnW2V2XVtuc10gPSBiYWdbZXZdW25zXSB8fCB7fTsgLy8gcmVmZXJlbmNlIGxpc3RlbmVyXG5cbiAgICBiYWdbZXZdW25zXVtsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkXSA9IGw7IC8vIGFkZCBsaXN0ZW5lclxuXG4gICAgbi5hZGRFdmVudExpc3RlbmVyKGV2LCBsLCBvcHRpb25zIHx8IGZhbHNlKTtcbiAgfSk7XG59IC8vIEFkZCBldmVudCB1bmJpbmRlciBpbiB0aGUgU1ZHIG5hbWVzcGFjZVxuXG5mdW5jdGlvbiBvZmYobm9kZSwgZXZlbnRzLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgaW5zdGFuY2UgPSBtYWtlSW5zdGFuY2Uobm9kZSk7XG4gIHZhciBiYWcgPSBnZXRFdmVudHMoaW5zdGFuY2UpO1xuICB2YXIgbiA9IGdldEV2ZW50VGFyZ2V0KGluc3RhbmNlKTsgLy8gbGlzdGVuZXIgY2FuIGJlIGEgZnVuY3Rpb24gb3IgYSBudW1iZXJcblxuICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGlzdGVuZXIgPSBsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkO1xuICAgIGlmICghbGlzdGVuZXIpIHJldHVybjtcbiAgfSAvLyBldmVudHMgY2FuIGJlIGFuIGFycmF5IG9mIGV2ZW50cyBvciBhIHN0cmluZyBvciB1bmRlZmluZWRcblxuXG4gIGV2ZW50cyA9IEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IChldmVudHMgfHwgJycpLnNwbGl0KGRlbGltaXRlcik7XG4gIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBldiA9IGV2ZW50ICYmIGV2ZW50LnNwbGl0KCcuJylbMF07XG4gICAgdmFyIG5zID0gZXZlbnQgJiYgZXZlbnQuc3BsaXQoJy4nKVsxXTtcbiAgICB2YXIgbmFtZXNwYWNlLCBsO1xuXG4gICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAvLyByZW1vdmUgbGlzdGVuZXIgcmVmZXJlbmNlXG4gICAgICBpZiAoYmFnW2V2XSAmJiBiYWdbZXZdW25zIHx8ICcqJ10pIHtcbiAgICAgICAgLy8gcmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgbi5yZW1vdmVFdmVudExpc3RlbmVyKGV2LCBiYWdbZXZdW25zIHx8ICcqJ11bbGlzdGVuZXJdLCBvcHRpb25zIHx8IGZhbHNlKTtcbiAgICAgICAgZGVsZXRlIGJhZ1tldl1bbnMgfHwgJyonXVtsaXN0ZW5lcl07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldiAmJiBucykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIGEgbmFtZXNwYWNlZCBldmVudFxuICAgICAgaWYgKGJhZ1tldl0gJiYgYmFnW2V2XVtuc10pIHtcbiAgICAgICAgZm9yIChsIGluIGJhZ1tldl1bbnNdKSB7XG4gICAgICAgICAgb2ZmKG4sIFtldiwgbnNdLmpvaW4oJy4nKSwgbCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgYmFnW2V2XVtuc107XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChucykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIGEgc3BlY2lmaWMgbmFtZXNwYWNlXG4gICAgICBmb3IgKGV2ZW50IGluIGJhZykge1xuICAgICAgICBmb3IgKG5hbWVzcGFjZSBpbiBiYWdbZXZlbnRdKSB7XG4gICAgICAgICAgaWYgKG5zID09PSBuYW1lc3BhY2UpIHtcbiAgICAgICAgICAgIG9mZihuLCBbZXZlbnQsIG5zXS5qb2luKCcuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXYpIHtcbiAgICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnRcbiAgICAgIGlmIChiYWdbZXZdKSB7XG4gICAgICAgIGZvciAobmFtZXNwYWNlIGluIGJhZ1tldl0pIHtcbiAgICAgICAgICBvZmYobiwgW2V2LCBuYW1lc3BhY2VdLmpvaW4oJy4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgYmFnW2V2XTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgb24gYSBnaXZlbiBub2RlXG4gICAgICBmb3IgKGV2ZW50IGluIGJhZykge1xuICAgICAgICBvZmYobiwgZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBjbGVhckV2ZW50cyhpbnN0YW5jZSk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGV2ZW50LCBkYXRhKSB7XG4gIHZhciBuID0gZ2V0RXZlbnRUYXJnZXQobm9kZSk7IC8vIERpc3BhdGNoIGV2ZW50XG5cbiAgaWYgKGV2ZW50IGluc3RhbmNlb2YgZ2xvYmFscy53aW5kb3cuRXZlbnQpIHtcbiAgICBuLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gbmV3IGdsb2JhbHMud2luZG93LkN1c3RvbUV2ZW50KGV2ZW50LCB7XG4gICAgICBkZXRhaWw6IGRhdGEsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgbi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIHJldHVybiBldmVudDtcbn1cblxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFID0gd2VsbEtub3duU3ltYm9sKCdpc0NvbmNhdFNwcmVhZGFibGUnKTtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQgPSAnTWF4aW11bSBhbGxvd2VkIGluZGV4IGV4Y2VlZGVkJztcblxuLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4vLyBkZW9wdGltaXphdGlvbiBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQgPSB2OFZlcnNpb24gPj0gNTEgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFycmF5ID0gW107XG4gIGFycmF5W0lTX0NPTkNBVF9TUFJFQURBQkxFXSA9IGZhbHNlO1xuICByZXR1cm4gYXJyYXkuY29uY2F0KClbMF0gIT09IGFycmF5O1xufSk7XG5cbnZhciBTUEVDSUVTX1NVUFBPUlQgPSBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdjb25jYXQnKTtcblxudmFyIGlzQ29uY2F0U3ByZWFkYWJsZSA9IGZ1bmN0aW9uIChPKSB7XG4gIGlmICghaXNPYmplY3QoTykpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNwcmVhZGFibGUgPSBPW0lTX0NPTkNBVF9TUFJFQURBQkxFXTtcbiAgcmV0dXJuIHNwcmVhZGFibGUgIT09IHVuZGVmaW5lZCA/ICEhc3ByZWFkYWJsZSA6IGlzQXJyYXkoTyk7XG59O1xuXG52YXIgRk9SQ0VEID0gIUlTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQgfHwgIVNQRUNJRVNfU1VQUE9SVDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5jb25jYXRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmNvbmNhdFxuLy8gd2l0aCBhZGRpbmcgc3VwcG9ydCBvZiBAQGlzQ29uY2F0U3ByZWFkYWJsZSBhbmQgQEBzcGVjaWVzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICBjb25jYXQ6IGZ1bmN0aW9uIGNvbmNhdChhcmcpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBPID0gdG9PYmplY3QodGhpcyk7XG4gICAgdmFyIEEgPSBhcnJheVNwZWNpZXNDcmVhdGUoTywgMCk7XG4gICAgdmFyIG4gPSAwO1xuICAgIHZhciBpLCBrLCBsZW5ndGgsIGxlbiwgRTtcbiAgICBmb3IgKGkgPSAtMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBFID0gaSA9PT0gLTEgPyBPIDogYXJndW1lbnRzW2ldO1xuICAgICAgaWYgKGlzQ29uY2F0U3ByZWFkYWJsZShFKSkge1xuICAgICAgICBsZW4gPSB0b0xlbmd0aChFLmxlbmd0aCk7XG4gICAgICAgIGlmIChuICsgbGVuID4gTUFYX1NBRkVfSU5URUdFUikgdGhyb3cgVHlwZUVycm9yKE1BWElNVU1fQUxMT1dFRF9JTkRFWF9FWENFRURFRCk7XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCBsZW47IGsrKywgbisrKSBpZiAoayBpbiBFKSBjcmVhdGVQcm9wZXJ0eShBLCBuLCBFW2tdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuID49IE1BWF9TQUZFX0lOVEVHRVIpIHRocm93IFR5cGVFcnJvcihNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQpO1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShBLCBuKyssIEUpO1xuICAgICAgfVxuICAgIH1cbiAgICBBLmxlbmd0aCA9IG47XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xuXG52YXIgJG1hcCA9IGFycmF5SXRlcmF0aW9uLm1hcDtcblxuXG4vLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIWFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQoJ21hcCcpIH0sIHtcbiAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICByZXR1cm4gJG1hcCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG52YXIgRGF0ZVByb3RvdHlwZSA9IERhdGUucHJvdG90eXBlO1xudmFyIElOVkFMSURfREFURSA9ICdJbnZhbGlkIERhdGUnO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgbmF0aXZlRGF0ZVRvU3RyaW5nID0gRGF0ZVByb3RvdHlwZVtUT19TVFJJTkddO1xudmFyIGdldFRpbWUgPSBEYXRlUHJvdG90eXBlLmdldFRpbWU7XG5cbi8vIGBEYXRlLnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1kYXRlLnByb3RvdHlwZS50b3N0cmluZ1xuaWYgKG5ldyBEYXRlKE5hTikgKyAnJyAhPSBJTlZBTElEX0RBVEUpIHtcbiAgcmVkZWZpbmUoRGF0ZVByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRUaW1lLmNhbGwodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyBuYXRpdmVEYXRlVG9TdHJpbmcuY2FsbCh0aGlzKSA6IElOVkFMSURfREFURTtcbiAgfSk7XG59XG5cbnZhciB0cmltID0gc3RyaW5nVHJpbS50cmltO1xuXG5cbnZhciBuYXRpdmVQYXJzZUludCA9IGdsb2JhbF8xLnBhcnNlSW50O1xudmFyIGhleCQxID0gL15bKy1dPzBbWHhdLztcbnZhciBGT1JDRUQkMSA9IG5hdGl2ZVBhcnNlSW50KHdoaXRlc3BhY2VzICsgJzA4JykgIT09IDggfHwgbmF0aXZlUGFyc2VJbnQod2hpdGVzcGFjZXMgKyAnMHgxNicpICE9PSAyMjtcblxuLy8gYHBhcnNlSW50YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXBhcnNlaW50LXN0cmluZy1yYWRpeFxudmFyIF9wYXJzZUludCA9IEZPUkNFRCQxID8gZnVuY3Rpb24gcGFyc2VJbnQoc3RyaW5nLCByYWRpeCkge1xuICB2YXIgUyA9IHRyaW0oU3RyaW5nKHN0cmluZykpO1xuICByZXR1cm4gbmF0aXZlUGFyc2VJbnQoUywgKHJhZGl4ID4+PiAwKSB8fCAoaGV4JDEudGVzdChTKSA/IDE2IDogMTApKTtcbn0gOiBuYXRpdmVQYXJzZUludDtcblxuLy8gYHBhcnNlSW50YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXBhcnNlaW50LXN0cmluZy1yYWRpeFxuX2V4cG9ydCh7IGdsb2JhbDogdHJ1ZSwgZm9yY2VkOiBwYXJzZUludCAhPSBfcGFyc2VJbnQgfSwge1xuICBwYXJzZUludDogX3BhcnNlSW50XG59KTtcblxudmFyIFRPX1NUUklORyQxID0gJ3RvU3RyaW5nJztcbnZhciBSZWdFeHBQcm90b3R5cGUgPSBSZWdFeHAucHJvdG90eXBlO1xudmFyIG5hdGl2ZVRvU3RyaW5nID0gUmVnRXhwUHJvdG90eXBlW1RPX1NUUklORyQxXTtcblxudmFyIE5PVF9HRU5FUklDID0gZmFpbHMoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmF0aXZlVG9TdHJpbmcuY2FsbCh7IHNvdXJjZTogJ2EnLCBmbGFnczogJ2InIH0pICE9ICcvYS9iJzsgfSk7XG4vLyBGRjQ0LSBSZWdFeHAjdG9TdHJpbmcgaGFzIGEgd3JvbmcgbmFtZVxudmFyIElOQ09SUkVDVF9OQU1FID0gbmF0aXZlVG9TdHJpbmcubmFtZSAhPSBUT19TVFJJTkckMTtcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuaWYgKE5PVF9HRU5FUklDIHx8IElOQ09SUkVDVF9OQU1FKSB7XG4gIHJlZGVmaW5lKFJlZ0V4cC5wcm90b3R5cGUsIFRPX1NUUklORyQxLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHZhciBwID0gU3RyaW5nKFIuc291cmNlKTtcbiAgICB2YXIgcmYgPSBSLmZsYWdzO1xuICAgIHZhciBmID0gU3RyaW5nKHJmID09PSB1bmRlZmluZWQgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiAhKCdmbGFncycgaW4gUmVnRXhwUHJvdG90eXBlKSA/IHJlZ2V4cEZsYWdzLmNhbGwoUikgOiByZik7XG4gICAgcmV0dXJuICcvJyArIHAgKyAnLycgKyBmO1xuICB9LCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICghKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xufVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTtcbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBzaXhEaWdpdEhleChoZXgpIHtcbiAgcmV0dXJuIGhleC5sZW5ndGggPT09IDQgPyBbJyMnLCBoZXguc3Vic3RyaW5nKDEsIDIpLCBoZXguc3Vic3RyaW5nKDEsIDIpLCBoZXguc3Vic3RyaW5nKDIsIDMpLCBoZXguc3Vic3RyaW5nKDIsIDMpLCBoZXguc3Vic3RyaW5nKDMsIDQpLCBoZXguc3Vic3RyaW5nKDMsIDQpXS5qb2luKCcnKSA6IGhleDtcbn1cblxuZnVuY3Rpb24gY29tcG9uZW50SGV4KGNvbXBvbmVudCkge1xuICB2YXIgaW50ZWdlciA9IE1hdGgucm91bmQoY29tcG9uZW50KTtcbiAgdmFyIGJvdW5kZWQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGludGVnZXIpKTtcbiAgdmFyIGhleCA9IGJvdW5kZWQudG9TdHJpbmcoMTYpO1xuICByZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcbn1cblxuZnVuY3Rpb24gaXMob2JqZWN0LCBzcGFjZSkge1xuICBmb3IgKHZhciBpID0gc3BhY2UubGVuZ3RoOyBpLS07KSB7XG4gICAgaWYgKG9iamVjdFtzcGFjZVtpXV0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJhbWV0ZXJzKGEsIGIpIHtcbiAgdmFyIHBhcmFtcyA9IGlzKGEsICdyZ2InKSA/IHtcbiAgICBfYTogYS5yLFxuICAgIF9iOiBhLmcsXG4gICAgX2M6IGEuYixcbiAgICBzcGFjZTogJ3JnYidcbiAgfSA6IGlzKGEsICd4eXonKSA/IHtcbiAgICBfYTogYS54LFxuICAgIF9iOiBhLnksXG4gICAgX2M6IGEueixcbiAgICBfZDogMCxcbiAgICBzcGFjZTogJ3h5eidcbiAgfSA6IGlzKGEsICdoc2wnKSA/IHtcbiAgICBfYTogYS5oLFxuICAgIF9iOiBhLnMsXG4gICAgX2M6IGEubCxcbiAgICBfZDogMCxcbiAgICBzcGFjZTogJ2hzbCdcbiAgfSA6IGlzKGEsICdsYWInKSA/IHtcbiAgICBfYTogYS5sLFxuICAgIF9iOiBhLmEsXG4gICAgX2M6IGEuYixcbiAgICBfZDogMCxcbiAgICBzcGFjZTogJ2xhYidcbiAgfSA6IGlzKGEsICdsY2gnKSA/IHtcbiAgICBfYTogYS5sLFxuICAgIF9iOiBhLmMsXG4gICAgX2M6IGEuaCxcbiAgICBfZDogMCxcbiAgICBzcGFjZTogJ2xjaCdcbiAgfSA6IGlzKGEsICdjbXlrJykgPyB7XG4gICAgX2E6IGEuYyxcbiAgICBfYjogYS5tLFxuICAgIF9jOiBhLnksXG4gICAgX2Q6IGEuayxcbiAgICBzcGFjZTogJ2NteWsnXG4gIH0gOiB7XG4gICAgX2E6IDAsXG4gICAgX2I6IDAsXG4gICAgX2M6IDAsXG4gICAgc3BhY2U6ICdyZ2InXG4gIH07XG4gIHBhcmFtcy5zcGFjZSA9IGIgfHwgcGFyYW1zLnNwYWNlO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBjaWVTcGFjZShzcGFjZSkge1xuICBpZiAoc3BhY2UgPT09ICdsYWInIHx8IHNwYWNlID09PSAneHl6JyB8fCBzcGFjZSA9PT0gJ2xjaCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaHVlVG9SZ2IocCwgcSwgdCkge1xuICBpZiAodCA8IDApIHQgKz0gMTtcbiAgaWYgKHQgPiAxKSB0IC09IDE7XG4gIGlmICh0IDwgMSAvIDYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICBpZiAodCA8IDEgLyAyKSByZXR1cm4gcTtcbiAgaWYgKHQgPCAyIC8gMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIgLyAzIC0gdCkgKiA2O1xuICByZXR1cm4gcDtcbn1cblxudmFyIENvbG9yID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29sb3IoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbG9yKTtcblxuICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENvbG9yLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB2YXIgYSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICAgIHZhciBiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICB2YXIgZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMDtcbiAgICAgIHZhciBzcGFjZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogJ3JnYic7XG4gICAgICAvLyBUaGlzIGNhdGNoZXMgdGhlIGNhc2Ugd2hlbiBhIGZhbHN5IHZhbHVlIGlzIHBhc3NlZCBsaWtlICcnXG4gICAgICBhID0gIWEgPyAwIDogYTsgLy8gUmVzZXQgYWxsIHZhbHVlcyBpbiBjYXNlIHRoZSBpbml0IGZ1bmN0aW9uIGlzIHJlcnVuIHdpdGggbmV3IGNvbG9yIHNwYWNlXG5cbiAgICAgIGlmICh0aGlzLnNwYWNlKSB7XG4gICAgICAgIGZvciAodmFyIGNvbXBvbmVudCBpbiB0aGlzLnNwYWNlKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXNbdGhpcy5zcGFjZVtjb21wb25lbnRdXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIEFsbG93IGZvciB0aGUgY2FzZSB0aGF0IHdlIGRvbid0IG5lZWQgZC4uLlxuICAgICAgICBzcGFjZSA9IHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IGQgOiBzcGFjZTtcbiAgICAgICAgZCA9IHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IDAgOiBkOyAvLyBBc3NpZ24gdGhlIHZhbHVlcyBzdHJhaWdodCB0byB0aGUgY29sb3JcblxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgICBfYTogYSxcbiAgICAgICAgICBfYjogYixcbiAgICAgICAgICBfYzogYyxcbiAgICAgICAgICBfZDogZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VcbiAgICAgICAgfSk7IC8vIElmIHRoZSB1c2VyIGdhdmUgdXMgYW4gYXJyYXksIG1ha2UgdGhlIGNvbG9yIGZyb20gaXRcbiAgICAgIH0gZWxzZSBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMuc3BhY2UgPSBiIHx8ICh0eXBlb2YgYVszXSA9PT0gJ3N0cmluZycgPyBhWzNdIDogYVs0XSkgfHwgJ3JnYic7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgICAgIF9hOiBhWzBdLFxuICAgICAgICAgIF9iOiBhWzFdLFxuICAgICAgICAgIF9jOiBhWzJdLFxuICAgICAgICAgIF9kOiBhWzNdIHx8IDBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGEgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgLy8gU2V0IHRoZSBvYmplY3QgdXAgYW5kIGFzc2lnbiBpdHMgdmFsdWVzIGRpcmVjdGx5XG4gICAgICAgIHZhciB2YWx1ZXMgPSBnZXRQYXJhbWV0ZXJzKGEsIGIpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHZhbHVlcyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoaXNSZ2IudGVzdChhKSkge1xuICAgICAgICAgIHZhciBub1doaXRlc3BhY2UgPSBhLnJlcGxhY2Uod2hpdGVzcGFjZSQxLCAnJyk7XG5cbiAgICAgICAgICB2YXIgX3JnYiRleGVjJHNsaWNlJG1hcCA9IHJnYi5leGVjKG5vV2hpdGVzcGFjZSkuc2xpY2UoMSwgNCkubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodik7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgICAgIF9yZ2IkZXhlYyRzbGljZSRtYXAyID0gX3NsaWNlZFRvQXJyYXkoX3JnYiRleGVjJHNsaWNlJG1hcCwgMyksXG4gICAgICAgICAgICAgIF9hMiA9IF9yZ2IkZXhlYyRzbGljZSRtYXAyWzBdLFxuICAgICAgICAgICAgICBfYjIgPSBfcmdiJGV4ZWMkc2xpY2UkbWFwMlsxXSxcbiAgICAgICAgICAgICAgX2MyID0gX3JnYiRleGVjJHNsaWNlJG1hcDJbMl07XG5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgICAgIF9hOiBfYTIsXG4gICAgICAgICAgICBfYjogX2IyLFxuICAgICAgICAgICAgX2M6IF9jMixcbiAgICAgICAgICAgIF9kOiAwLFxuICAgICAgICAgICAgc3BhY2U6ICdyZ2InXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNIZXgudGVzdChhKSkge1xuICAgICAgICAgIHZhciBoZXhQYXJzZSA9IGZ1bmN0aW9uIGhleFBhcnNlKHYpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2LCAxNik7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBfaGV4JGV4ZWMkbWFwID0gaGV4LmV4ZWMoc2l4RGlnaXRIZXgoYSkpLm1hcChoZXhQYXJzZSksXG4gICAgICAgICAgICAgIF9oZXgkZXhlYyRtYXAyID0gX3NsaWNlZFRvQXJyYXkoX2hleCRleGVjJG1hcCwgNCksXG4gICAgICAgICAgICAgIF9hMyA9IF9oZXgkZXhlYyRtYXAyWzFdLFxuICAgICAgICAgICAgICBfYjMgPSBfaGV4JGV4ZWMkbWFwMlsyXSxcbiAgICAgICAgICAgICAgX2MzID0gX2hleCRleGVjJG1hcDJbM107XG5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgICAgIF9hOiBfYTMsXG4gICAgICAgICAgICBfYjogX2IzLFxuICAgICAgICAgICAgX2M6IF9jMyxcbiAgICAgICAgICAgIF9kOiAwLFxuICAgICAgICAgICAgc3BhY2U6ICdyZ2InXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB0aHJvdyBFcnJvcignVW5zdXBwb3J0ZWQgc3RyaW5nIGZvcm1hdCwgY2FuXFwndCBjb25zdHJ1Y3QgQ29sb3InKTtcbiAgICAgIH0gLy8gTm93IGFkZCB0aGUgY29tcG9uZW50cyBhcyBhIGNvbnZlbmllbmNlXG5cblxuICAgICAgdmFyIF9hID0gdGhpcy5fYSxcbiAgICAgICAgICBfYiA9IHRoaXMuX2IsXG4gICAgICAgICAgX2MgPSB0aGlzLl9jLFxuICAgICAgICAgIF9kID0gdGhpcy5fZDtcbiAgICAgIHZhciBjb21wb25lbnRzID0gdGhpcy5zcGFjZSA9PT0gJ3JnYicgPyB7XG4gICAgICAgIHI6IF9hLFxuICAgICAgICBnOiBfYixcbiAgICAgICAgYjogX2NcbiAgICAgIH0gOiB0aGlzLnNwYWNlID09PSAneHl6JyA/IHtcbiAgICAgICAgeDogX2EsXG4gICAgICAgIHk6IF9iLFxuICAgICAgICB6OiBfY1xuICAgICAgfSA6IHRoaXMuc3BhY2UgPT09ICdoc2wnID8ge1xuICAgICAgICBoOiBfYSxcbiAgICAgICAgczogX2IsXG4gICAgICAgIGw6IF9jXG4gICAgICB9IDogdGhpcy5zcGFjZSA9PT0gJ2xhYicgPyB7XG4gICAgICAgIGw6IF9hLFxuICAgICAgICBhOiBfYixcbiAgICAgICAgYjogX2NcbiAgICAgIH0gOiB0aGlzLnNwYWNlID09PSAnbGNoJyA/IHtcbiAgICAgICAgbDogX2EsXG4gICAgICAgIGM6IF9iLFxuICAgICAgICBoOiBfY1xuICAgICAgfSA6IHRoaXMuc3BhY2UgPT09ICdjbXlrJyA/IHtcbiAgICAgICAgYzogX2EsXG4gICAgICAgIG06IF9iLFxuICAgICAgICB5OiBfYyxcbiAgICAgICAgazogX2RcbiAgICAgIH0gOiB7fTtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgY29tcG9uZW50cyk7XG4gICAgfVxuICAgIC8qXHJcbiAgICBDb252ZXJzaW9uIE1ldGhvZHNcclxuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJyZ2JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmdiKCkge1xuICAgICAgaWYgKHRoaXMuc3BhY2UgPT09ICdyZ2InKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmIChjaWVTcGFjZSh0aGlzLnNwYWNlKSkge1xuICAgICAgICAvLyBDb252ZXJ0IHRvIHRoZSB4eXogY29sb3Igc3BhY2VcbiAgICAgICAgdmFyIHggPSB0aGlzLngsXG4gICAgICAgICAgICB5ID0gdGhpcy55LFxuICAgICAgICAgICAgeiA9IHRoaXMuejtcblxuICAgICAgICBpZiAodGhpcy5zcGFjZSA9PT0gJ2xhYicgfHwgdGhpcy5zcGFjZSA9PT0gJ2xjaCcpIHtcbiAgICAgICAgICAvLyBHZXQgdGhlIHZhbHVlcyBpbiB0aGUgbGFiIHNwYWNlXG4gICAgICAgICAgdmFyIGwgPSB0aGlzLmwsXG4gICAgICAgICAgICAgIGEgPSB0aGlzLmEsXG4gICAgICAgICAgICAgIF9iNCA9IHRoaXMuYjtcblxuICAgICAgICAgIGlmICh0aGlzLnNwYWNlID09PSAnbGNoJykge1xuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmMsXG4gICAgICAgICAgICAgICAgaCA9IHRoaXMuaDtcbiAgICAgICAgICAgIHZhciBkVG9SID0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgIGEgPSBjICogTWF0aC5jb3MoZFRvUiAqIGgpO1xuICAgICAgICAgICAgX2I0ID0gYyAqIE1hdGguc2luKGRUb1IgKiBoKTtcbiAgICAgICAgICB9IC8vIFVuZG8gdGhlIG5vbmxpbmVhciBmdW5jdGlvblxuXG5cbiAgICAgICAgICB2YXIgeUwgPSAobCArIDE2KSAvIDExNjtcbiAgICAgICAgICB2YXIgeEwgPSBhIC8gNTAwICsgeUw7XG4gICAgICAgICAgdmFyIHpMID0geUwgLSBfYjQgLyAyMDA7IC8vIEdldCB0aGUgeHl6IHZhbHVlc1xuXG4gICAgICAgICAgdmFyIGN0ID0gMTYgLyAxMTY7XG4gICAgICAgICAgdmFyIG14ID0gMC4wMDg4NTY7XG4gICAgICAgICAgdmFyIG5tID0gNy43ODc7XG4gICAgICAgICAgeCA9IDAuOTUwNDcgKiAoTWF0aC5wb3coeEwsIDMpID4gbXggPyBNYXRoLnBvdyh4TCwgMykgOiAoeEwgLSBjdCkgLyBubSk7XG4gICAgICAgICAgeSA9IDEuMDAwMDAgKiAoTWF0aC5wb3coeUwsIDMpID4gbXggPyBNYXRoLnBvdyh5TCwgMykgOiAoeUwgLSBjdCkgLyBubSk7XG4gICAgICAgICAgeiA9IDEuMDg4ODMgKiAoTWF0aC5wb3coekwsIDMpID4gbXggPyBNYXRoLnBvdyh6TCwgMykgOiAoekwgLSBjdCkgLyBubSk7XG4gICAgICAgIH0gLy8gQ29udmVydCB4eXogdG8gdW5ib3VuZGVkIHJnYiB2YWx1ZXNcblxuXG4gICAgICAgIHZhciByVSA9IHggKiAzLjI0MDYgKyB5ICogLTEuNTM3MiArIHogKiAtMC40OTg2O1xuICAgICAgICB2YXIgZ1UgPSB4ICogLTAuOTY4OSArIHkgKiAxLjg3NTggKyB6ICogMC4wNDE1O1xuICAgICAgICB2YXIgYlUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNDAgKyB6ICogMS4wNTcwOyAvLyBDb252ZXJ0IHRoZSB2YWx1ZXMgdG8gdHJ1ZSByZ2IgdmFsdWVzXG5cbiAgICAgICAgdmFyIHBvdyA9IE1hdGgucG93O1xuICAgICAgICB2YXIgYmQgPSAwLjAwMzEzMDg7XG4gICAgICAgIHZhciByID0gclUgPiBiZCA/IDEuMDU1ICogcG93KHJVLCAxIC8gMi40KSAtIDAuMDU1IDogMTIuOTIgKiByVTtcbiAgICAgICAgdmFyIGcgPSBnVSA+IGJkID8gMS4wNTUgKiBwb3coZ1UsIDEgLyAyLjQpIC0gMC4wNTUgOiAxMi45MiAqIGdVO1xuICAgICAgICB2YXIgYiA9IGJVID4gYmQgPyAxLjA1NSAqIHBvdyhiVSwgMSAvIDIuNCkgLSAwLjA1NSA6IDEyLjkyICogYlU7IC8vIE1ha2UgYW5kIHJldHVybiB0aGUgY29sb3JcblxuICAgICAgICB2YXIgY29sb3IgPSBuZXcgQ29sb3IoMjU1ICogciwgMjU1ICogZywgMjU1ICogYik7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zcGFjZSA9PT0gJ2hzbCcpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9iZ3JpbnMuZ2l0aHViLmlvL1RpbnlDb2xvci9kb2NzL3Rpbnljb2xvci5odG1sXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBoc2wgdmFsdWVzXG4gICAgICAgIHZhciBfaCA9IHRoaXMuaCxcbiAgICAgICAgICAgIHMgPSB0aGlzLnMsXG4gICAgICAgICAgICBfbCA9IHRoaXMubDtcbiAgICAgICAgX2ggLz0gMzYwO1xuICAgICAgICBzIC89IDEwMDtcbiAgICAgICAgX2wgLz0gMTAwOyAvLyBJZiB3ZSBhcmUgZ3JleSwgdGhlbiBqdXN0IG1ha2UgdGhlIGNvbG9yIGRpcmVjdGx5XG5cbiAgICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgICBfbCAqPSAyNTU7XG5cbiAgICAgICAgICB2YXIgX2NvbG9yMiA9IG5ldyBDb2xvcihfbCwgX2wsIF9sKTtcblxuICAgICAgICAgIHJldHVybiBfY29sb3IyO1xuICAgICAgICB9IC8vIFRPRE8gSSBoYXZlIG5vIGlkZWEgd2hhdCB0aGlzIGRvZXMgOkQgSWYgeW91IGZpZ3VyZSBpdCBvdXQsIHRlbGwgbWUhXG5cblxuICAgICAgICB2YXIgcSA9IF9sIDwgMC41ID8gX2wgKiAoMSArIHMpIDogX2wgKyBzIC0gX2wgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBfbCAtIHE7IC8vIEdldCB0aGUgcmdiIHZhbHVlc1xuXG4gICAgICAgIHZhciBfciA9IDI1NSAqIGh1ZVRvUmdiKHAsIHEsIF9oICsgMSAvIDMpO1xuXG4gICAgICAgIHZhciBfZyA9IDI1NSAqIGh1ZVRvUmdiKHAsIHEsIF9oKTtcblxuICAgICAgICB2YXIgX2I1ID0gMjU1ICogaHVlVG9SZ2IocCwgcSwgX2ggLSAxIC8gMyk7IC8vIE1ha2UgYSBuZXcgY29sb3JcblxuXG4gICAgICAgIHZhciBfY29sb3IgPSBuZXcgQ29sb3IoX3IsIF9nLCBfYjUpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3I7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3BhY2UgPT09ICdjbXlrJykge1xuICAgICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9mZWxpcGVzYWJpbm8vNTA2NjMzNlxuICAgICAgICAvLyBHZXQgdGhlIG5vcm1hbGlzZWQgY215ayB2YWx1ZXNcbiAgICAgICAgdmFyIF9jNCA9IHRoaXMuYyxcbiAgICAgICAgICAgIG0gPSB0aGlzLm0sXG4gICAgICAgICAgICBfeSA9IHRoaXMueSxcbiAgICAgICAgICAgIGsgPSB0aGlzLms7IC8vIEdldCB0aGUgcmdiIHZhbHVlc1xuXG4gICAgICAgIHZhciBfcjIgPSAyNTUgKiAoMSAtIE1hdGgubWluKDEsIF9jNCAqICgxIC0gaykgKyBrKSk7XG5cbiAgICAgICAgdmFyIF9nMiA9IDI1NSAqICgxIC0gTWF0aC5taW4oMSwgbSAqICgxIC0gaykgKyBrKSk7XG5cbiAgICAgICAgdmFyIF9iNiA9IDI1NSAqICgxIC0gTWF0aC5taW4oMSwgX3kgKiAoMSAtIGspICsgaykpOyAvLyBGb3JtIHRoZSBjb2xvciBhbmQgcmV0dXJuIGl0XG5cblxuICAgICAgICB2YXIgX2NvbG9yMyA9IG5ldyBDb2xvcihfcjIsIF9nMiwgX2I2KTtcblxuICAgICAgICByZXR1cm4gX2NvbG9yMztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsYWJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGFiKCkge1xuICAgICAgLy8gR2V0IHRoZSB4eXogY29sb3JcbiAgICAgIHZhciBfdGhpcyR4eXogPSB0aGlzLnh5eigpLFxuICAgICAgICAgIHggPSBfdGhpcyR4eXoueCxcbiAgICAgICAgICB5ID0gX3RoaXMkeHl6LnksXG4gICAgICAgICAgeiA9IF90aGlzJHh5ei56OyAvLyBHZXQgdGhlIGxhYiBjb21wb25lbnRzXG5cblxuICAgICAgdmFyIGwgPSAxMTYgKiB5IC0gMTY7XG4gICAgICB2YXIgYSA9IDUwMCAqICh4IC0geSk7XG4gICAgICB2YXIgYiA9IDIwMCAqICh5IC0geik7IC8vIENvbnN0cnVjdCBhbmQgcmV0dXJuIGEgbmV3IGNvbG9yXG5cbiAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcihsLCBhLCBiLCAnbGFiJyk7XG4gICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInh5elwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB4eXooKSB7XG4gICAgICAvLyBOb3JtYWxpc2UgdGhlIHJlZCwgZ3JlZW4gYW5kIGJsdWUgdmFsdWVzXG4gICAgICB2YXIgX3RoaXMkcmdiID0gdGhpcy5yZ2IoKSxcbiAgICAgICAgICByMjU1ID0gX3RoaXMkcmdiLl9hLFxuICAgICAgICAgIGcyNTUgPSBfdGhpcyRyZ2IuX2IsXG4gICAgICAgICAgYjI1NSA9IF90aGlzJHJnYi5fYztcblxuICAgICAgdmFyIF9tYXAgPSBbcjI1NSwgZzI1NSwgYjI1NV0ubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB2IC8gMjU1O1xuICAgICAgfSksXG4gICAgICAgICAgX21hcDIgPSBfc2xpY2VkVG9BcnJheShfbWFwLCAzKSxcbiAgICAgICAgICByID0gX21hcDJbMF0sXG4gICAgICAgICAgZyA9IF9tYXAyWzFdLFxuICAgICAgICAgIGIgPSBfbWFwMlsyXTsgLy8gQ29udmVydCB0byB0aGUgbGFiIHJnYiBzcGFjZVxuXG5cbiAgICAgIHZhciByTCA9IHIgPiAwLjA0MDQ1ID8gTWF0aC5wb3coKHIgKyAwLjA1NSkgLyAxLjA1NSwgMi40KSA6IHIgLyAxMi45MjtcbiAgICAgIHZhciBnTCA9IGcgPiAwLjA0MDQ1ID8gTWF0aC5wb3coKGcgKyAwLjA1NSkgLyAxLjA1NSwgMi40KSA6IGcgLyAxMi45MjtcbiAgICAgIHZhciBiTCA9IGIgPiAwLjA0MDQ1ID8gTWF0aC5wb3coKGIgKyAwLjA1NSkgLyAxLjA1NSwgMi40KSA6IGIgLyAxMi45MjsgLy8gQ29udmVydCB0byB0aGUgeHl6IGNvbG9yIHNwYWNlIHdpdGhvdXQgYm91bmRpbmcgdGhlIHZhbHVlc1xuXG4gICAgICB2YXIgeFUgPSAockwgKiAwLjQxMjQgKyBnTCAqIDAuMzU3NiArIGJMICogMC4xODA1KSAvIDAuOTUwNDc7XG4gICAgICB2YXIgeVUgPSAockwgKiAwLjIxMjYgKyBnTCAqIDAuNzE1MiArIGJMICogMC4wNzIyKSAvIDEuMDAwMDA7XG4gICAgICB2YXIgelUgPSAockwgKiAwLjAxOTMgKyBnTCAqIDAuMTE5MiArIGJMICogMC45NTA1KSAvIDEuMDg4ODM7IC8vIEdldCB0aGUgcHJvcGVyIHh5eiB2YWx1ZXMgYnkgYXBwbHlpbmcgdGhlIGJvdW5kaW5nXG5cbiAgICAgIHZhciB4ID0geFUgPiAwLjAwODg1NiA/IE1hdGgucG93KHhVLCAxIC8gMykgOiA3Ljc4NyAqIHhVICsgMTYgLyAxMTY7XG4gICAgICB2YXIgeSA9IHlVID4gMC4wMDg4NTYgPyBNYXRoLnBvdyh5VSwgMSAvIDMpIDogNy43ODcgKiB5VSArIDE2IC8gMTE2O1xuICAgICAgdmFyIHogPSB6VSA+IDAuMDA4ODU2ID8gTWF0aC5wb3coelUsIDEgLyAzKSA6IDcuNzg3ICogelUgKyAxNiAvIDExNjsgLy8gTWFrZSBhbmQgcmV0dXJuIHRoZSBjb2xvclxuXG4gICAgICB2YXIgY29sb3IgPSBuZXcgQ29sb3IoeCwgeSwgeiwgJ3h5eicpO1xuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsY2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGNoKCkge1xuICAgICAgLy8gR2V0IHRoZSBsYWIgY29sb3IgZGlyZWN0bHlcbiAgICAgIHZhciBfdGhpcyRsYWIgPSB0aGlzLmxhYigpLFxuICAgICAgICAgIGwgPSBfdGhpcyRsYWIubCxcbiAgICAgICAgICBhID0gX3RoaXMkbGFiLmEsXG4gICAgICAgICAgYiA9IF90aGlzJGxhYi5iOyAvLyBHZXQgdGhlIGNocm9tYXRpY2l0eSBhbmQgdGhlIGh1ZSB1c2luZyBwb2xhciBjb29yZGluYXRlc1xuXG5cbiAgICAgIHZhciBjID0gTWF0aC5zcXJ0KE1hdGgucG93KGEsIDIpICsgTWF0aC5wb3coYiwgMikpO1xuICAgICAgdmFyIGggPSAxODAgKiBNYXRoLmF0YW4yKGIsIGEpIC8gTWF0aC5QSTtcblxuICAgICAgaWYgKGggPCAwKSB7XG4gICAgICAgIGggKj0gLTE7XG4gICAgICAgIGggPSAzNjAgLSBoO1xuICAgICAgfSAvLyBNYWtlIGEgbmV3IGNvbG9yIGFuZCByZXR1cm4gaXRcblxuXG4gICAgICB2YXIgY29sb3IgPSBuZXcgQ29sb3IobCwgYywgaCwgJ2xjaCcpO1xuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoc2xcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaHNsKCkge1xuICAgICAgLy8gR2V0IHRoZSByZ2IgdmFsdWVzXG4gICAgICB2YXIgX3RoaXMkcmdiMiA9IHRoaXMucmdiKCksXG4gICAgICAgICAgX2EgPSBfdGhpcyRyZ2IyLl9hLFxuICAgICAgICAgIF9iID0gX3RoaXMkcmdiMi5fYixcbiAgICAgICAgICBfYyA9IF90aGlzJHJnYjIuX2M7XG5cbiAgICAgIHZhciBfbWFwMyA9IFtfYSwgX2IsIF9jXS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHYgLyAyNTU7XG4gICAgICB9KSxcbiAgICAgICAgICBfbWFwNCA9IF9zbGljZWRUb0FycmF5KF9tYXAzLCAzKSxcbiAgICAgICAgICByID0gX21hcDRbMF0sXG4gICAgICAgICAgZyA9IF9tYXA0WzFdLFxuICAgICAgICAgIGIgPSBfbWFwNFsyXTsgLy8gRmluZCB0aGUgbWF4aW11bSBhbmQgbWluaW11bSB2YWx1ZXMgdG8gZ2V0IHRoZSBsaWdodG5lc3NcblxuXG4gICAgICB2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgICB2YXIgbCA9IChtYXggKyBtaW4pIC8gMjsgLy8gSWYgdGhlIHIsIGcsIHYgdmFsdWVzIGFyZSBpZGVudGljYWwgdGhlbiB3ZSBhcmUgZ3JleVxuXG4gICAgICB2YXIgaXNHcmV5ID0gbWF4ID09PSBtaW47IC8vIENhbGN1bGF0ZSB0aGUgaHVlIGFuZCBzYXR1cmF0aW9uXG5cbiAgICAgIHZhciBkZWx0YSA9IG1heCAtIG1pbjtcbiAgICAgIHZhciBzID0gaXNHcmV5ID8gMCA6IGwgPiAwLjUgPyBkZWx0YSAvICgyIC0gbWF4IC0gbWluKSA6IGRlbHRhIC8gKG1heCArIG1pbik7XG4gICAgICB2YXIgaCA9IGlzR3JleSA/IDAgOiBtYXggPT09IHIgPyAoKGcgLSBiKSAvIGRlbHRhICsgKGcgPCBiID8gNiA6IDApKSAvIDYgOiBtYXggPT09IGcgPyAoKGIgLSByKSAvIGRlbHRhICsgMikgLyA2IDogbWF4ID09PSBiID8gKChyIC0gZykgLyBkZWx0YSArIDQpIC8gNiA6IDA7IC8vIENvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBuZXcgY29sb3JcblxuICAgICAgdmFyIGNvbG9yID0gbmV3IENvbG9yKDM2MCAqIGgsIDEwMCAqIHMsIDEwMCAqIGwsICdoc2wnKTtcbiAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY215a1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbXlrKCkge1xuICAgICAgLy8gR2V0IHRoZSByZ2IgdmFsdWVzIGZvciB0aGUgY3VycmVudCBjb2xvclxuICAgICAgdmFyIF90aGlzJHJnYjMgPSB0aGlzLnJnYigpLFxuICAgICAgICAgIF9hID0gX3RoaXMkcmdiMy5fYSxcbiAgICAgICAgICBfYiA9IF90aGlzJHJnYjMuX2IsXG4gICAgICAgICAgX2MgPSBfdGhpcyRyZ2IzLl9jO1xuXG4gICAgICB2YXIgX21hcDUgPSBbX2EsIF9iLCBfY10ubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB2IC8gMjU1O1xuICAgICAgfSksXG4gICAgICAgICAgX21hcDYgPSBfc2xpY2VkVG9BcnJheShfbWFwNSwgMyksXG4gICAgICAgICAgciA9IF9tYXA2WzBdLFxuICAgICAgICAgIGcgPSBfbWFwNlsxXSxcbiAgICAgICAgICBiID0gX21hcDZbMl07IC8vIEdldCB0aGUgY215ayB2YWx1ZXMgaW4gYW4gdW5ib3VuZGVkIGZvcm1hdFxuXG5cbiAgICAgIHZhciBrID0gTWF0aC5taW4oMSAtIHIsIDEgLSBnLCAxIC0gYik7XG5cbiAgICAgIGlmIChrID09PSAxKSB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBibGFjayBjYXNlXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMCwgMSwgJ2NteWsnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGMgPSAoMSAtIHIgLSBrKSAvICgxIC0gayk7XG4gICAgICB2YXIgbSA9ICgxIC0gZyAtIGspIC8gKDEgLSBrKTtcbiAgICAgIHZhciB5ID0gKDEgLSBiIC0gaykgLyAoMSAtIGspOyAvLyBDb25zdHJ1Y3QgdGhlIG5ldyBjb2xvclxuXG4gICAgICB2YXIgY29sb3IgPSBuZXcgQ29sb3IoYywgbSwgeSwgaywgJ2NteWsnKTtcbiAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gICAgLypcclxuICAgIElucHV0IGFuZCBPdXRwdXQgbWV0aG9kc1xyXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9jbGFtcGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jbGFtcGVkKCkge1xuICAgICAgdmFyIF90aGlzJHJnYjQgPSB0aGlzLnJnYigpLFxuICAgICAgICAgIF9hID0gX3RoaXMkcmdiNC5fYSxcbiAgICAgICAgICBfYiA9IF90aGlzJHJnYjQuX2IsXG4gICAgICAgICAgX2MgPSBfdGhpcyRyZ2I0Ll9jO1xuXG4gICAgICB2YXIgbWF4ID0gTWF0aC5tYXgsXG4gICAgICAgICAgbWluID0gTWF0aC5taW4sXG4gICAgICAgICAgcm91bmQgPSBNYXRoLnJvdW5kO1xuXG4gICAgICB2YXIgZm9ybWF0ID0gZnVuY3Rpb24gZm9ybWF0KHYpIHtcbiAgICAgICAgcmV0dXJuIG1heCgwLCBtaW4ocm91bmQodiksIDI1NSkpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFtfYSwgX2IsIF9jXS5tYXAoZm9ybWF0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9IZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9IZXgoKSB7XG4gICAgICB2YXIgX3RoaXMkX2NsYW1wZWQkbWFwID0gdGhpcy5fY2xhbXBlZCgpLm1hcChjb21wb25lbnRIZXgpLFxuICAgICAgICAgIF90aGlzJF9jbGFtcGVkJG1hcDIgPSBfc2xpY2VkVG9BcnJheShfdGhpcyRfY2xhbXBlZCRtYXAsIDMpLFxuICAgICAgICAgIHIgPSBfdGhpcyRfY2xhbXBlZCRtYXAyWzBdLFxuICAgICAgICAgIGcgPSBfdGhpcyRfY2xhbXBlZCRtYXAyWzFdLFxuICAgICAgICAgIGIgPSBfdGhpcyRfY2xhbXBlZCRtYXAyWzJdO1xuXG4gICAgICByZXR1cm4gXCIjXCIuY29uY2F0KHIpLmNvbmNhdChnKS5jb25jYXQoYik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9IZXgoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9SZ2JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9SZ2IoKSB7XG4gICAgICB2YXIgX3RoaXMkX2NsYW1wZWQgPSB0aGlzLl9jbGFtcGVkKCksXG4gICAgICAgICAgX3RoaXMkX2NsYW1wZWQyID0gX3NsaWNlZFRvQXJyYXkoX3RoaXMkX2NsYW1wZWQsIDMpLFxuICAgICAgICAgIHJWID0gX3RoaXMkX2NsYW1wZWQyWzBdLFxuICAgICAgICAgIGdWID0gX3RoaXMkX2NsYW1wZWQyWzFdLFxuICAgICAgICAgIGJWID0gX3RoaXMkX2NsYW1wZWQyWzJdO1xuXG4gICAgICB2YXIgc3RyaW5nID0gXCJyZ2IoXCIuY29uY2F0KHJWLCBcIixcIikuY29uY2F0KGdWLCBcIixcIikuY29uY2F0KGJWLCBcIilcIik7XG4gICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICB2YXIgX2EgPSB0aGlzLl9hLFxuICAgICAgICAgIF9iID0gdGhpcy5fYixcbiAgICAgICAgICBfYyA9IHRoaXMuX2MsXG4gICAgICAgICAgX2QgPSB0aGlzLl9kLFxuICAgICAgICAgIHNwYWNlID0gdGhpcy5zcGFjZTtcbiAgICAgIHJldHVybiBbX2EsIF9iLCBfYywgX2QsIHNwYWNlXTtcbiAgICB9XG4gICAgLypcclxuICAgIEdlbmVyYXRpbmcgcmFuZG9tIGNvbG9yc1xyXG4gICAgKi9cblxuICB9XSwgW3tcbiAgICBrZXk6IFwicmFuZG9tXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJhbmRvbSgpIHtcbiAgICAgIHZhciBtb2RlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAndmlicmFudCc7XG4gICAgICB2YXIgdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgLy8gR2V0IHRoZSBtYXRoIG1vZHVsZXNcbiAgICAgIHZhciByYW5kb20gPSBNYXRoLnJhbmRvbSxcbiAgICAgICAgICByb3VuZCA9IE1hdGgucm91bmQsXG4gICAgICAgICAgc2luID0gTWF0aC5zaW4sXG4gICAgICAgICAgcGkgPSBNYXRoLlBJOyAvLyBSdW4gdGhlIGNvcnJlY3QgZ2VuZXJhdG9yXG5cbiAgICAgIGlmIChtb2RlID09PSAndmlicmFudCcpIHtcbiAgICAgICAgdmFyIGwgPSAoODEgLSA1NykgKiByYW5kb20oKSArIDU3O1xuICAgICAgICB2YXIgYyA9ICg4MyAtIDQ1KSAqIHJhbmRvbSgpICsgNDU7XG4gICAgICAgIHZhciBoID0gMzYwICogcmFuZG9tKCk7XG4gICAgICAgIHZhciBjb2xvciA9IG5ldyBDb2xvcihsLCBjLCBoLCAnbGNoJyk7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ3NpbmUnKSB7XG4gICAgICAgIHQgPSB0ID09IG51bGwgPyByYW5kb20oKSA6IHQ7XG4gICAgICAgIHZhciByID0gcm91bmQoODAgKiBzaW4oMiAqIHBpICogdCAvIDAuNSArIDAuMDEpICsgMTUwKTtcbiAgICAgICAgdmFyIGcgPSByb3VuZCg1MCAqIHNpbigyICogcGkgKiB0IC8gMC41ICsgNC42KSArIDIwMCk7XG4gICAgICAgIHZhciBiID0gcm91bmQoMTAwICogc2luKDIgKiBwaSAqIHQgLyAwLjUgKyAyLjMpICsgMTUwKTtcblxuICAgICAgICB2YXIgX2NvbG9yNCA9IG5ldyBDb2xvcihyLCBnLCBiKTtcblxuICAgICAgICByZXR1cm4gX2NvbG9yNDtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ3Bhc3RlbCcpIHtcbiAgICAgICAgdmFyIF9sMiA9ICg5NCAtIDg2KSAqIHJhbmRvbSgpICsgODY7XG5cbiAgICAgICAgdmFyIF9jNSA9ICgyNiAtIDkpICogcmFuZG9tKCkgKyA5O1xuXG4gICAgICAgIHZhciBfaDIgPSAzNjAgKiByYW5kb20oKTtcblxuICAgICAgICB2YXIgX2NvbG9yNSA9IG5ldyBDb2xvcihfbDIsIF9jNSwgX2gyLCAnbGNoJyk7XG5cbiAgICAgICAgcmV0dXJuIF9jb2xvcjU7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdkYXJrJykge1xuICAgICAgICB2YXIgX2wzID0gMTAgKyAxMCAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBfYzYgPSAoMTI1IC0gNzUpICogcmFuZG9tKCkgKyA4NjtcblxuICAgICAgICB2YXIgX2gzID0gMzYwICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIF9jb2xvcjYgPSBuZXcgQ29sb3IoX2wzLCBfYzYsIF9oMywgJ2xjaCcpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3I2O1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAncmdiJykge1xuICAgICAgICB2YXIgX3IzID0gMjU1ICogcmFuZG9tKCk7XG5cbiAgICAgICAgdmFyIF9nMyA9IDI1NSAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBfYjcgPSAyNTUgKiByYW5kb20oKTtcblxuICAgICAgICB2YXIgX2NvbG9yNyA9IG5ldyBDb2xvcihfcjMsIF9nMywgX2I3KTtcblxuICAgICAgICByZXR1cm4gX2NvbG9yNztcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2xhYicpIHtcbiAgICAgICAgdmFyIF9sNCA9IDEwMCAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBhID0gMjU2ICogcmFuZG9tKCkgLSAxMjg7XG5cbiAgICAgICAgdmFyIF9iOCA9IDI1NiAqIHJhbmRvbSgpIC0gMTI4O1xuXG4gICAgICAgIHZhciBfY29sb3I4ID0gbmV3IENvbG9yKF9sNCwgYSwgX2I4LCAnbGFiJyk7XG5cbiAgICAgICAgcmV0dXJuIF9jb2xvcjg7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdncmV5Jykge1xuICAgICAgICB2YXIgZ3JleSA9IDI1NSAqIHJhbmRvbSgpO1xuXG4gICAgICAgIHZhciBfY29sb3I5ID0gbmV3IENvbG9yKGdyZXksIGdyZXksIGdyZXkpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3I5O1xuICAgICAgfVxuICAgIH1cbiAgICAvKlxyXG4gICAgQ29uc3RydWN0aW5nIGNvbG9yc1xyXG4gICAgKi9cbiAgICAvLyBUZXN0IGlmIGdpdmVuIHZhbHVlIGlzIGEgY29sb3Igc3RyaW5nXG5cbiAgfSwge1xuICAgIGtleTogXCJ0ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlc3QoY29sb3IpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnICYmIChpc0hleC50ZXN0KGNvbG9yKSB8fCBpc1JnYi50ZXN0KGNvbG9yKSk7XG4gICAgfSAvLyBUZXN0IGlmIGdpdmVuIHZhbHVlIGlzIGFuIHJnYiBvYmplY3RcblxuICB9LCB7XG4gICAga2V5OiBcImlzUmdiXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzUmdiKGNvbG9yKSB7XG4gICAgICByZXR1cm4gY29sb3IgJiYgdHlwZW9mIGNvbG9yLnIgPT09ICdudW1iZXInICYmIHR5cGVvZiBjb2xvci5nID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgY29sb3IuYiA9PT0gJ251bWJlcic7XG4gICAgfSAvLyBUZXN0IGlmIGdpdmVuIHZhbHVlIGlzIGEgY29sb3JcblxuICB9LCB7XG4gICAga2V5OiBcImlzQ29sb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNDb2xvcihjb2xvcikge1xuICAgICAgcmV0dXJuIGNvbG9yICYmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yIHx8IHRoaXMuaXNSZ2IoY29sb3IpIHx8IHRoaXMudGVzdChjb2xvcikpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb2xvcjtcbn0oKTtcblxudmFyIEZBSUxTX09OX1BSSU1JVElWRVMkMSA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgb2JqZWN0S2V5cygxKTsgfSk7XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogRkFJTFNfT05fUFJJTUlUSVZFUyQxIH0sIHtcbiAga2V5czogZnVuY3Rpb24ga2V5cyhpdCkge1xuICAgIHJldHVybiBvYmplY3RLZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH1cbn0pO1xuXG4vLyBAQG1hdGNoIGxvZ2ljXG5maXhSZWdleHBXZWxsS25vd25TeW1ib2xMb2dpYygnbWF0Y2gnLCAxLCBmdW5jdGlvbiAoTUFUQ0gsIG5hdGl2ZU1hdGNoLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5tYXRjaGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5tYXRjaFxuICAgIGZ1bmN0aW9uIG1hdGNoKHJlZ2V4cCkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIG1hdGNoZXIgPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW01BVENIXTtcbiAgICAgIHJldHVybiBtYXRjaGVyICE9PSB1bmRlZmluZWQgPyBtYXRjaGVyLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtNQVRDSF0oU3RyaW5nKE8pKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAbWF0Y2hcbiAgICBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKG5hdGl2ZU1hdGNoLCByZWdleHAsIHRoaXMpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuXG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG5cbiAgICAgIGlmICghcnguZ2xvYmFsKSByZXR1cm4gcmVnZXhwRXhlY0Fic3RyYWN0KHJ4LCBTKTtcblxuICAgICAgdmFyIGZ1bGxVbmljb2RlID0gcngudW5pY29kZTtcbiAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgdmFyIG4gPSAwO1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIHdoaWxlICgocmVzdWx0ID0gcmVnZXhwRXhlY0Fic3RyYWN0KHJ4LCBTKSkgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIEFbbl0gPSBtYXRjaFN0cjtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgICAgbisrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4gPT09IDAgPyBudWxsIDogQTtcbiAgICB9XG4gIF07XG59KTtcblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxuZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkge1xuICB3aGlsZSAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KSkge1xuICAgIG9iamVjdCA9IF9nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVmbGVjdC5nZXQpIHtcbiAgICBfZ2V0ID0gUmVmbGVjdC5nZXQ7XG4gIH0gZWxzZSB7XG4gICAgX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gX3N1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICBpZiAoIWJhc2UpIHJldHVybjtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7XG5cbiAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlciB8fCB0YXJnZXQpO1xufVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbn1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxudmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eU5hbWVzLmY7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDIgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcbnZhciBkZWZpbmVQcm9wZXJ0eSQ1ID0gb2JqZWN0RGVmaW5lUHJvcGVydHkuZjtcbnZhciB0cmltJDEgPSBzdHJpbmdUcmltLnRyaW07XG5cbnZhciBOVU1CRVIgPSAnTnVtYmVyJztcbnZhciBOYXRpdmVOdW1iZXIgPSBnbG9iYWxfMVtOVU1CRVJdO1xudmFyIE51bWJlclByb3RvdHlwZSA9IE5hdGl2ZU51bWJlci5wcm90b3R5cGU7XG5cbi8vIE9wZXJhIH4xMiBoYXMgYnJva2VuIE9iamVjdCN0b1N0cmluZ1xudmFyIEJST0tFTl9DTEFTU09GID0gY2xhc3NvZlJhdyhvYmplY3RDcmVhdGUoTnVtYmVyUHJvdG90eXBlKSkgPT0gTlVNQkVSO1xuXG4vLyBgVG9OdW1iZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9udW1iZXJcbnZhciB0b051bWJlciA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIgaXQgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgZmFsc2UpO1xuICB2YXIgZmlyc3QsIHRoaXJkLCByYWRpeCwgbWF4Q29kZSwgZGlnaXRzLCBsZW5ndGgsIGluZGV4LCBjb2RlO1xuICBpZiAodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIpIHtcbiAgICBpdCA9IHRyaW0kMShpdCk7XG4gICAgZmlyc3QgPSBpdC5jaGFyQ29kZUF0KDApO1xuICAgIGlmIChmaXJzdCA9PT0gNDMgfHwgZmlyc3QgPT09IDQ1KSB7XG4gICAgICB0aGlyZCA9IGl0LmNoYXJDb2RlQXQoMik7XG4gICAgICBpZiAodGhpcmQgPT09IDg4IHx8IHRoaXJkID09PSAxMjApIHJldHVybiBOYU47IC8vIE51bWJlcignKzB4MScpIHNob3VsZCBiZSBOYU4sIG9sZCBWOCBmaXhcbiAgICB9IGVsc2UgaWYgKGZpcnN0ID09PSA0OCkge1xuICAgICAgc3dpdGNoIChpdC5jaGFyQ29kZUF0KDEpKSB7XG4gICAgICAgIGNhc2UgNjY6IGNhc2UgOTg6IHJhZGl4ID0gMjsgbWF4Q29kZSA9IDQ5OyBicmVhazsgLy8gZmFzdCBlcXVhbCBvZiAvXjBiWzAxXSskL2lcbiAgICAgICAgY2FzZSA3OTogY2FzZSAxMTE6IHJhZGl4ID0gODsgbWF4Q29kZSA9IDU1OyBicmVhazsgLy8gZmFzdCBlcXVhbCBvZiAvXjBvWzAtN10rJC9pXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiAraXQ7XG4gICAgICB9XG4gICAgICBkaWdpdHMgPSBpdC5zbGljZSgyKTtcbiAgICAgIGxlbmd0aCA9IGRpZ2l0cy5sZW5ndGg7XG4gICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29kZSA9IGRpZ2l0cy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgICAgLy8gcGFyc2VJbnQgcGFyc2VzIGEgc3RyaW5nIHRvIGEgZmlyc3QgdW5hdmFpbGFibGUgc3ltYm9sXG4gICAgICAgIC8vIGJ1dCBUb051bWJlciBzaG91bGQgcmV0dXJuIE5hTiBpZiBhIHN0cmluZyBjb250YWlucyB1bmF2YWlsYWJsZSBzeW1ib2xzXG4gICAgICAgIGlmIChjb2RlIDwgNDggfHwgY29kZSA+IG1heENvZGUpIHJldHVybiBOYU47XG4gICAgICB9IHJldHVybiBwYXJzZUludChkaWdpdHMsIHJhZGl4KTtcbiAgICB9XG4gIH0gcmV0dXJuICtpdDtcbn07XG5cbi8vIGBOdW1iZXJgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1udW1iZXItY29uc3RydWN0b3JcbmlmIChpc0ZvcmNlZF8xKE5VTUJFUiwgIU5hdGl2ZU51bWJlcignIDBvMScpIHx8ICFOYXRpdmVOdW1iZXIoJzBiMScpIHx8IE5hdGl2ZU51bWJlcignKzB4MScpKSkge1xuICB2YXIgTnVtYmVyV3JhcHBlciA9IGZ1bmN0aW9uIE51bWJlcih2YWx1ZSkge1xuICAgIHZhciBpdCA9IGFyZ3VtZW50cy5sZW5ndGggPCAxID8gMCA6IHZhbHVlO1xuICAgIHZhciBkdW1teSA9IHRoaXM7XG4gICAgcmV0dXJuIGR1bW15IGluc3RhbmNlb2YgTnVtYmVyV3JhcHBlclxuICAgICAgLy8gY2hlY2sgb24gMS4uY29uc3RydWN0b3IoZm9vKSBjYXNlXG4gICAgICAmJiAoQlJPS0VOX0NMQVNTT0YgPyBmYWlscyhmdW5jdGlvbiAoKSB7IE51bWJlclByb3RvdHlwZS52YWx1ZU9mLmNhbGwoZHVtbXkpOyB9KSA6IGNsYXNzb2ZSYXcoZHVtbXkpICE9IE5VTUJFUilcbiAgICAgICAgPyBpbmhlcml0SWZSZXF1aXJlZChuZXcgTmF0aXZlTnVtYmVyKHRvTnVtYmVyKGl0KSksIGR1bW15LCBOdW1iZXJXcmFwcGVyKSA6IHRvTnVtYmVyKGl0KTtcbiAgfTtcbiAgZm9yICh2YXIga2V5cyQxID0gZGVzY3JpcHRvcnMgPyBnZXRPd25Qcm9wZXJ0eU5hbWVzKE5hdGl2ZU51bWJlcikgOiAoXG4gICAgLy8gRVMzOlxuICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcbiAgICAvLyBFUzIwMTUgKGluIGNhc2UsIGlmIG1vZHVsZXMgd2l0aCBFUzIwMTUgTnVtYmVyIHN0YXRpY3MgcmVxdWlyZWQgYmVmb3JlKTpcbiAgICAnRVBTSUxPTixpc0Zpbml0ZSxpc0ludGVnZXIsaXNOYU4saXNTYWZlSW50ZWdlcixNQVhfU0FGRV9JTlRFR0VSLCcgK1xuICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xuICApLnNwbGl0KCcsJyksIGogPSAwLCBrZXk7IGtleXMkMS5sZW5ndGggPiBqOyBqKyspIHtcbiAgICBpZiAoaGFzKE5hdGl2ZU51bWJlciwga2V5ID0ga2V5cyQxW2pdKSAmJiAhaGFzKE51bWJlcldyYXBwZXIsIGtleSkpIHtcbiAgICAgIGRlZmluZVByb3BlcnR5JDUoTnVtYmVyV3JhcHBlciwga2V5LCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMihOYXRpdmVOdW1iZXIsIGtleSkpO1xuICAgIH1cbiAgfVxuICBOdW1iZXJXcmFwcGVyLnByb3RvdHlwZSA9IE51bWJlclByb3RvdHlwZTtcbiAgTnVtYmVyUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTnVtYmVyV3JhcHBlcjtcbiAgcmVkZWZpbmUoZ2xvYmFsXzEsIE5VTUJFUiwgTnVtYmVyV3JhcHBlcik7XG59XG5cbnZhciB0cmltJDIgPSBzdHJpbmdUcmltLnRyaW07XG5cblxudmFyIG5hdGl2ZVBhcnNlRmxvYXQgPSBnbG9iYWxfMS5wYXJzZUZsb2F0O1xudmFyIEZPUkNFRCQyID0gMSAvIG5hdGl2ZVBhcnNlRmxvYXQod2hpdGVzcGFjZXMgKyAnLTAnKSAhPT0gLUluZmluaXR5O1xuXG4vLyBgcGFyc2VGbG9hdGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wYXJzZWZsb2F0LXN0cmluZ1xudmFyIF9wYXJzZUZsb2F0ID0gRk9SQ0VEJDIgPyBmdW5jdGlvbiBwYXJzZUZsb2F0KHN0cmluZykge1xuICB2YXIgdHJpbW1lZFN0cmluZyA9IHRyaW0kMihTdHJpbmcoc3RyaW5nKSk7XG4gIHZhciByZXN1bHQgPSBuYXRpdmVQYXJzZUZsb2F0KHRyaW1tZWRTdHJpbmcpO1xuICByZXR1cm4gcmVzdWx0ID09PSAwICYmIHRyaW1tZWRTdHJpbmcuY2hhckF0KDApID09ICctJyA/IC0wIDogcmVzdWx0O1xufSA6IG5hdGl2ZVBhcnNlRmxvYXQ7XG5cbi8vIGBwYXJzZUZsb2F0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXBhcnNlZmxvYXQtc3RyaW5nXG5fZXhwb3J0KHsgZ2xvYmFsOiB0cnVlLCBmb3JjZWQ6IHBhcnNlRmxvYXQgIT0gX3BhcnNlRmxvYXQgfSwge1xuICBwYXJzZUZsb2F0OiBfcGFyc2VGbG9hdFxufSk7XG5cbnZhciBQb2ludCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIC8vIEluaXRpYWxpemVcbiAgZnVuY3Rpb24gUG9pbnQoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvaW50KTtcblxuICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFBvaW50LCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoeCwgeSkge1xuICAgICAgdmFyIGJhc2UgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH07IC8vIGVuc3VyZSBzb3VyY2UgYXMgb2JqZWN0XG5cbiAgICAgIHZhciBzb3VyY2UgPSBBcnJheS5pc0FycmF5KHgpID8ge1xuICAgICAgICB4OiB4WzBdLFxuICAgICAgICB5OiB4WzFdXG4gICAgICB9IDogX3R5cGVvZih4KSA9PT0gJ29iamVjdCcgPyB7XG4gICAgICAgIHg6IHgueCxcbiAgICAgICAgeTogeC55XG4gICAgICB9IDoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9OyAvLyBtZXJnZSBzb3VyY2VcblxuICAgICAgdGhpcy54ID0gc291cmNlLnggPT0gbnVsbCA/IGJhc2UueCA6IHNvdXJjZS54O1xuICAgICAgdGhpcy55ID0gc291cmNlLnkgPT0gbnVsbCA/IGJhc2UueSA6IHNvdXJjZS55O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBDbG9uZSBwb2ludFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2Zvcm1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtKG0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkudHJhbnNmb3JtTyhtKTtcbiAgICB9IC8vIFRyYW5zZm9ybSBwb2ludCB3aXRoIG1hdHJpeFxuXG4gIH0sIHtcbiAgICBrZXk6IFwidHJhbnNmb3JtT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm1PKG0pIHtcbiAgICAgIGlmICghTWF0cml4LmlzTWF0cml4TGlrZShtKSkge1xuICAgICAgICBtID0gbmV3IE1hdHJpeChtKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHggPSB0aGlzLngsXG4gICAgICAgICAgeSA9IHRoaXMueTsgLy8gUGVyZm9ybSB0aGUgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgICAgIHRoaXMueCA9IG0uYSAqIHggKyBtLmMgKiB5ICsgbS5lO1xuICAgICAgdGhpcy55ID0gbS5iICogeCArIG0uZCAqIHkgKyBtLmY7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9BcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBvaW50O1xufSgpO1xuZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICByZXR1cm4gbmV3IFBvaW50KHgsIHkpLnRyYW5zZm9ybSh0aGlzLnNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlRW5vdWdoKGEsIGIsIHRocmVzaG9sZCkge1xuICByZXR1cm4gTWF0aC5hYnMoYiAtIGEpIDwgKHRocmVzaG9sZCB8fCAxZS02KTtcbn1cblxudmFyIE1hdHJpeCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1hdHJpeCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWF0cml4KTtcblxuICAgIHRoaXMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9IC8vIEluaXRpYWxpemVcblxuXG4gIF9jcmVhdGVDbGFzcyhNYXRyaXgsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChzb3VyY2UpIHtcbiAgICAgIHZhciBiYXNlID0gTWF0cml4LmZyb21BcnJheShbMSwgMCwgMCwgMSwgMCwgMF0pOyAvLyBlbnN1cmUgc291cmNlIGFzIG9iamVjdFxuXG4gICAgICBzb3VyY2UgPSBzb3VyY2UgaW5zdGFuY2VvZiBFbGVtZW50ID8gc291cmNlLm1hdHJpeGlmeSgpIDogdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgPyBNYXRyaXguZnJvbUFycmF5KHNvdXJjZS5zcGxpdChkZWxpbWl0ZXIpLm1hcChwYXJzZUZsb2F0KSkgOiBBcnJheS5pc0FycmF5KHNvdXJjZSkgPyBNYXRyaXguZnJvbUFycmF5KHNvdXJjZSkgOiBfdHlwZW9mKHNvdXJjZSkgPT09ICdvYmplY3QnICYmIE1hdHJpeC5pc01hdHJpeExpa2Uoc291cmNlKSA/IHNvdXJjZSA6IF90eXBlb2Yoc291cmNlKSA9PT0gJ29iamVjdCcgPyBuZXcgTWF0cml4KCkudHJhbnNmb3JtKHNvdXJjZSkgOiBhcmd1bWVudHMubGVuZ3RoID09PSA2ID8gTWF0cml4LmZyb21BcnJheShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpIDogYmFzZTsgLy8gTWVyZ2UgdGhlIHNvdXJjZSBtYXRyaXggd2l0aCB0aGUgYmFzZSBtYXRyaXhcblxuICAgICAgdGhpcy5hID0gc291cmNlLmEgIT0gbnVsbCA/IHNvdXJjZS5hIDogYmFzZS5hO1xuICAgICAgdGhpcy5iID0gc291cmNlLmIgIT0gbnVsbCA/IHNvdXJjZS5iIDogYmFzZS5iO1xuICAgICAgdGhpcy5jID0gc291cmNlLmMgIT0gbnVsbCA/IHNvdXJjZS5jIDogYmFzZS5jO1xuICAgICAgdGhpcy5kID0gc291cmNlLmQgIT0gbnVsbCA/IHNvdXJjZS5kIDogYmFzZS5kO1xuICAgICAgdGhpcy5lID0gc291cmNlLmUgIT0gbnVsbCA/IHNvdXJjZS5lIDogYmFzZS5lO1xuICAgICAgdGhpcy5mID0gc291cmNlLmYgIT0gbnVsbCA/IHNvdXJjZS5mIDogYmFzZS5mO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBDbG9uZXMgdGhpcyBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcImNsb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcyk7XG4gICAgfSAvLyBUcmFuc2Zvcm0gYSBtYXRyaXggaW50byBhbm90aGVyIG1hdHJpeCBieSBtYW5pcHVsYXRpbmcgdGhlIHNwYWNlXG5cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2Zvcm1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtKG8pIHtcbiAgICAgIC8vIENoZWNrIGlmIG8gaXMgYSBtYXRyaXggYW5kIHRoZW4gbGVmdCBtdWx0aXBseSBpdCBkaXJlY3RseVxuICAgICAgaWYgKE1hdHJpeC5pc01hdHJpeExpa2UobykpIHtcbiAgICAgICAgdmFyIG1hdHJpeCA9IG5ldyBNYXRyaXgobyk7XG4gICAgICAgIHJldHVybiBtYXRyaXgubXVsdGlwbHlPKHRoaXMpO1xuICAgICAgfSAvLyBHZXQgdGhlIHByb3Bvc2VkIHRyYW5zZm9ybWF0aW9ucyBhbmQgdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb25zXG5cblxuICAgICAgdmFyIHQgPSBNYXRyaXguZm9ybWF0VHJhbnNmb3JtcyhvKTtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcztcblxuICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgUG9pbnQodC5veCwgdC5veSkudHJhbnNmb3JtKGN1cnJlbnQpLFxuICAgICAgICAgIG94ID0gX3RyYW5zZm9ybS54LFxuICAgICAgICAgIG95ID0gX3RyYW5zZm9ybS55OyAvLyBDb25zdHJ1Y3QgdGhlIHJlc3VsdGluZyBtYXRyaXhcblxuXG4gICAgICB2YXIgdHJhbnNmb3JtZXIgPSBuZXcgTWF0cml4KCkudHJhbnNsYXRlTyh0LnJ4LCB0LnJ5KS5sbXVsdGlwbHlPKGN1cnJlbnQpLnRyYW5zbGF0ZU8oLW94LCAtb3kpLnNjYWxlTyh0LnNjYWxlWCwgdC5zY2FsZVkpLnNrZXdPKHQuc2tld1gsIHQuc2tld1kpLnNoZWFyTyh0LnNoZWFyKS5yb3RhdGVPKHQudGhldGEpLnRyYW5zbGF0ZU8ob3gsIG95KTsgLy8gSWYgd2Ugd2FudCB0aGUgb3JpZ2luIGF0IGEgcGFydGljdWxhciBwbGFjZSwgd2UgZm9yY2UgaXQgdGhlcmVcblxuICAgICAgaWYgKGlzRmluaXRlKHQucHgpIHx8IGlzRmluaXRlKHQucHkpKSB7XG4gICAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQob3gsIG95KS50cmFuc2Zvcm0odHJhbnNmb3JtZXIpOyAvLyBUT0RPOiBSZXBsYWNlIHQucHggd2l0aCBpc0Zpbml0ZSh0LnB4KVxuXG4gICAgICAgIHZhciBkeCA9IHQucHggPyB0LnB4IC0gb3JpZ2luLnggOiAwO1xuICAgICAgICB2YXIgZHkgPSB0LnB5ID8gdC5weSAtIG9yaWdpbi55IDogMDtcbiAgICAgICAgdHJhbnNmb3JtZXIudHJhbnNsYXRlTyhkeCwgZHkpO1xuICAgICAgfSAvLyBUcmFuc2xhdGUgbm93IGFmdGVyIHBvc2l0aW9uaW5nXG5cblxuICAgICAgdHJhbnNmb3JtZXIudHJhbnNsYXRlTyh0LnR4LCB0LnR5KTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgICB9IC8vIEFwcGxpZXMgYSBtYXRyaXggZGVmaW5lZCBieSBpdHMgYWZmaW5lIHBhcmFtZXRlcnNcblxuICB9LCB7XG4gICAga2V5OiBcImNvbXBvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9zZShvKSB7XG4gICAgICBpZiAoby5vcmlnaW4pIHtcbiAgICAgICAgby5vcmlnaW5YID0gby5vcmlnaW5bMF07XG4gICAgICAgIG8ub3JpZ2luWSA9IG8ub3JpZ2luWzFdO1xuICAgICAgfSAvLyBHZXQgdGhlIHBhcmFtZXRlcnNcblxuXG4gICAgICB2YXIgb3ggPSBvLm9yaWdpblggfHwgMDtcbiAgICAgIHZhciBveSA9IG8ub3JpZ2luWSB8fCAwO1xuICAgICAgdmFyIHN4ID0gby5zY2FsZVggfHwgMTtcbiAgICAgIHZhciBzeSA9IG8uc2NhbGVZIHx8IDE7XG4gICAgICB2YXIgbGFtID0gby5zaGVhciB8fCAwO1xuICAgICAgdmFyIHRoZXRhID0gby5yb3RhdGUgfHwgMDtcbiAgICAgIHZhciB0eCA9IG8udHJhbnNsYXRlWCB8fCAwO1xuICAgICAgdmFyIHR5ID0gby50cmFuc2xhdGVZIHx8IDA7IC8vIEFwcGx5IHRoZSBzdGFuZGFyZCBtYXRyaXhcblxuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBNYXRyaXgoKS50cmFuc2xhdGVPKC1veCwgLW95KS5zY2FsZU8oc3gsIHN5KS5zaGVhck8obGFtKS5yb3RhdGVPKHRoZXRhKS50cmFuc2xhdGVPKHR4LCB0eSkubG11bHRpcGx5Tyh0aGlzKS50cmFuc2xhdGVPKG94LCBveSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gLy8gRGVjb21wb3NlcyB0aGlzIG1hdHJpeCBpbnRvIGl0cyBhZmZpbmUgcGFyYW1ldGVyc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGVjb21wb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlY29tcG9zZSgpIHtcbiAgICAgIHZhciBjeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICAgIHZhciBjeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICAgIC8vIEdldCB0aGUgcGFyYW1ldGVycyBmcm9tIHRoZSBtYXRyaXhcbiAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgdmFyIGIgPSB0aGlzLmI7XG4gICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgIHZhciBkID0gdGhpcy5kO1xuICAgICAgdmFyIGUgPSB0aGlzLmU7XG4gICAgICB2YXIgZiA9IHRoaXMuZjsgLy8gRmlndXJlIG91dCBpZiB0aGUgd2luZGluZyBkaXJlY3Rpb24gaXMgY2xvY2t3aXNlIG9yIGNvdW50ZXJjbG9ja3dpc2VcblxuICAgICAgdmFyIGRldGVybWluYW50ID0gYSAqIGQgLSBiICogYztcbiAgICAgIHZhciBjY3cgPSBkZXRlcm1pbmFudCA+IDAgPyAxIDogLTE7IC8vIFNpbmNlIHdlIG9ubHkgc2hlYXIgaW4geCwgd2UgY2FuIHVzZSB0aGUgeCBiYXNpcyB0byBnZXQgdGhlIHggc2NhbGVcbiAgICAgIC8vIGFuZCB0aGUgcm90YXRpb24gb2YgdGhlIHJlc3VsdGluZyBtYXRyaXhcblxuICAgICAgdmFyIHN4ID0gY2N3ICogTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpO1xuICAgICAgdmFyIHRoZXRhUmFkID0gTWF0aC5hdGFuMihjY3cgKiBiLCBjY3cgKiBhKTtcbiAgICAgIHZhciB0aGV0YSA9IDE4MCAvIE1hdGguUEkgKiB0aGV0YVJhZDtcbiAgICAgIHZhciBjdCA9IE1hdGguY29zKHRoZXRhUmFkKTtcbiAgICAgIHZhciBzdCA9IE1hdGguc2luKHRoZXRhUmFkKTsgLy8gV2UgY2FuIHRoZW4gc29sdmUgdGhlIHkgYmFzaXMgdmVjdG9yIHNpbXVsdGFuZW91c2x5IHRvIGdldCB0aGUgb3RoZXJcbiAgICAgIC8vIHR3byBhZmZpbmUgcGFyYW1ldGVycyBkaXJlY3RseSBmcm9tIHRoZXNlIHBhcmFtZXRlcnNcblxuICAgICAgdmFyIGxhbSA9IChhICogYyArIGIgKiBkKSAvIGRldGVybWluYW50O1xuICAgICAgdmFyIHN5ID0gYyAqIHN4IC8gKGxhbSAqIGEgLSBiKSB8fCBkICogc3ggLyAobGFtICogYiArIGEpOyAvLyBVc2UgdGhlIHRyYW5zbGF0aW9uc1xuXG4gICAgICB2YXIgdHggPSBlIC0gY3ggKyBjeCAqIGN0ICogc3ggKyBjeSAqIChsYW0gKiBjdCAqIHN4IC0gc3QgKiBzeSk7XG4gICAgICB2YXIgdHkgPSBmIC0gY3kgKyBjeCAqIHN0ICogc3ggKyBjeSAqIChsYW0gKiBzdCAqIHN4ICsgY3QgKiBzeSk7IC8vIENvbnN0cnVjdCB0aGUgZGVjb21wb3NpdGlvbiBhbmQgcmV0dXJuIGl0XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgYWZmaW5lIHBhcmFtZXRlcnNcbiAgICAgICAgc2NhbGVYOiBzeCxcbiAgICAgICAgc2NhbGVZOiBzeSxcbiAgICAgICAgc2hlYXI6IGxhbSxcbiAgICAgICAgcm90YXRlOiB0aGV0YSxcbiAgICAgICAgdHJhbnNsYXRlWDogdHgsXG4gICAgICAgIHRyYW5zbGF0ZVk6IHR5LFxuICAgICAgICBvcmlnaW5YOiBjeCxcbiAgICAgICAgb3JpZ2luWTogY3ksXG4gICAgICAgIC8vIFJldHVybiB0aGUgbWF0cml4IHBhcmFtZXRlcnNcbiAgICAgICAgYTogdGhpcy5hLFxuICAgICAgICBiOiB0aGlzLmIsXG4gICAgICAgIGM6IHRoaXMuYyxcbiAgICAgICAgZDogdGhpcy5kLFxuICAgICAgICBlOiB0aGlzLmUsXG4gICAgICAgIGY6IHRoaXMuZlxuICAgICAgfTtcbiAgICB9IC8vIExlZnQgbXVsdGlwbGllcyBieSB0aGUgZ2l2ZW4gbWF0cml4XG5cbiAgfSwge1xuICAgIGtleTogXCJtdWx0aXBseVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtdWx0aXBseShtYXRyaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubXVsdGlwbHlPKG1hdHJpeCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm11bHRpcGx5T1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtdWx0aXBseU8obWF0cml4KSB7XG4gICAgICAvLyBHZXQgdGhlIG1hdHJpY2VzXG4gICAgICB2YXIgbCA9IHRoaXM7XG4gICAgICB2YXIgciA9IG1hdHJpeCBpbnN0YW5jZW9mIE1hdHJpeCA/IG1hdHJpeCA6IG5ldyBNYXRyaXgobWF0cml4KTtcbiAgICAgIHJldHVybiBNYXRyaXgubWF0cml4TXVsdGlwbHkobCwgciwgdGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxtdWx0aXBseVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsbXVsdGlwbHkobWF0cml4KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxtdWx0aXBseU8obWF0cml4KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG11bHRpcGx5T1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsbXVsdGlwbHlPKG1hdHJpeCkge1xuICAgICAgdmFyIHIgPSB0aGlzO1xuICAgICAgdmFyIGwgPSBtYXRyaXggaW5zdGFuY2VvZiBNYXRyaXggPyBtYXRyaXggOiBuZXcgTWF0cml4KG1hdHJpeCk7XG4gICAgICByZXR1cm4gTWF0cml4Lm1hdHJpeE11bHRpcGx5KGwsIHIsIHRoaXMpO1xuICAgIH0gLy8gSW52ZXJzZXMgbWF0cml4XG5cbiAgfSwge1xuICAgIGtleTogXCJpbnZlcnNlT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnZlcnNlTygpIHtcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCBwYXJhbWV0ZXJzIG91dCBvZiB0aGUgbWF0cml4XG4gICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgIHZhciBiID0gdGhpcy5iO1xuICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICB2YXIgZCA9IHRoaXMuZDtcbiAgICAgIHZhciBlID0gdGhpcy5lO1xuICAgICAgdmFyIGYgPSB0aGlzLmY7IC8vIEludmVydCB0aGUgMngyIG1hdHJpeCBpbiB0aGUgdG9wIGxlZnRcblxuICAgICAgdmFyIGRldCA9IGEgKiBkIC0gYiAqIGM7XG4gICAgICBpZiAoIWRldCkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgaW52ZXJ0ICcgKyB0aGlzKTsgLy8gQ2FsY3VsYXRlIHRoZSB0b3AgMngyIG1hdHJpeFxuXG4gICAgICB2YXIgbmEgPSBkIC8gZGV0O1xuICAgICAgdmFyIG5iID0gLWIgLyBkZXQ7XG4gICAgICB2YXIgbmMgPSAtYyAvIGRldDtcbiAgICAgIHZhciBuZCA9IGEgLyBkZXQ7IC8vIEFwcGx5IHRoZSBpbnZlcnRlZCBtYXRyaXggdG8gdGhlIHRvcCByaWdodFxuXG4gICAgICB2YXIgbmUgPSAtKG5hICogZSArIG5jICogZik7XG4gICAgICB2YXIgbmYgPSAtKG5iICogZSArIG5kICogZik7IC8vIENvbnN0cnVjdCB0aGUgaW52ZXJ0ZWQgbWF0cml4XG5cbiAgICAgIHRoaXMuYSA9IG5hO1xuICAgICAgdGhpcy5iID0gbmI7XG4gICAgICB0aGlzLmMgPSBuYztcbiAgICAgIHRoaXMuZCA9IG5kO1xuICAgICAgdGhpcy5lID0gbmU7XG4gICAgICB0aGlzLmYgPSBuZjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbnZlcnNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGludmVyc2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmludmVyc2VPKCk7XG4gICAgfSAvLyBUcmFuc2xhdGUgbWF0cml4XG5cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2xhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNsYXRlKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkudHJhbnNsYXRlTyh4LCB5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidHJhbnNsYXRlT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2xhdGVPKHgsIHkpIHtcbiAgICAgIHRoaXMuZSArPSB4IHx8IDA7XG4gICAgICB0aGlzLmYgKz0geSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBTY2FsZSBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcInNjYWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNjYWxlKHgsIHksIGN4LCBjeSkge1xuICAgICAgdmFyIF90aGlzJGNsb25lO1xuXG4gICAgICByZXR1cm4gKF90aGlzJGNsb25lID0gdGhpcy5jbG9uZSgpKS5zY2FsZU8uYXBwbHkoX3RoaXMkY2xvbmUsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNjYWxlT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzY2FsZU8oeCkge1xuICAgICAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHg7XG4gICAgICB2YXIgY3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICB2YXIgY3kgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDA7XG5cbiAgICAgIC8vIFN1cHBvcnQgdW5pZm9ybSBzY2FsaW5nXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBjeSA9IGN4O1xuICAgICAgICBjeCA9IHk7XG4gICAgICAgIHkgPSB4O1xuICAgICAgfVxuXG4gICAgICB2YXIgYSA9IHRoaXMuYSxcbiAgICAgICAgICBiID0gdGhpcy5iLFxuICAgICAgICAgIGMgPSB0aGlzLmMsXG4gICAgICAgICAgZCA9IHRoaXMuZCxcbiAgICAgICAgICBlID0gdGhpcy5lLFxuICAgICAgICAgIGYgPSB0aGlzLmY7XG4gICAgICB0aGlzLmEgPSBhICogeDtcbiAgICAgIHRoaXMuYiA9IGIgKiB5O1xuICAgICAgdGhpcy5jID0gYyAqIHg7XG4gICAgICB0aGlzLmQgPSBkICogeTtcbiAgICAgIHRoaXMuZSA9IGUgKiB4IC0gY3ggKiB4ICsgY3g7XG4gICAgICB0aGlzLmYgPSBmICogeSAtIGN5ICogeSArIGN5O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBSb3RhdGUgbWF0cml4XG5cbiAgfSwge1xuICAgIGtleTogXCJyb3RhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcm90YXRlKHIsIGN4LCBjeSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RhdGVPKHIsIGN4LCBjeSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJvdGF0ZU9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcm90YXRlTyhyKSB7XG4gICAgICB2YXIgY3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gICAgICB2YXIgY3kgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gICAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICAgICAgciA9IHJhZGlhbnMocik7XG4gICAgICB2YXIgY29zID0gTWF0aC5jb3Mocik7XG4gICAgICB2YXIgc2luID0gTWF0aC5zaW4ocik7XG4gICAgICB2YXIgYSA9IHRoaXMuYSxcbiAgICAgICAgICBiID0gdGhpcy5iLFxuICAgICAgICAgIGMgPSB0aGlzLmMsXG4gICAgICAgICAgZCA9IHRoaXMuZCxcbiAgICAgICAgICBlID0gdGhpcy5lLFxuICAgICAgICAgIGYgPSB0aGlzLmY7XG4gICAgICB0aGlzLmEgPSBhICogY29zIC0gYiAqIHNpbjtcbiAgICAgIHRoaXMuYiA9IGIgKiBjb3MgKyBhICogc2luO1xuICAgICAgdGhpcy5jID0gYyAqIGNvcyAtIGQgKiBzaW47XG4gICAgICB0aGlzLmQgPSBkICogY29zICsgYyAqIHNpbjtcbiAgICAgIHRoaXMuZSA9IGUgKiBjb3MgLSBmICogc2luICsgY3kgKiBzaW4gLSBjeCAqIGNvcyArIGN4O1xuICAgICAgdGhpcy5mID0gZiAqIGNvcyArIGUgKiBzaW4gLSBjeCAqIHNpbiAtIGN5ICogY29zICsgY3k7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIEZsaXAgbWF0cml4IG9uIHggb3IgeSwgYXQgYSBnaXZlbiBvZmZzZXRcblxuICB9LCB7XG4gICAga2V5OiBcImZsaXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmxpcChheGlzLCBhcm91bmQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxpcE8oYXhpcywgYXJvdW5kKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmxpcE9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmxpcE8oYXhpcywgYXJvdW5kKSB7XG4gICAgICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gdGhpcy5zY2FsZU8oLTEsIDEsIGFyb3VuZCwgMCkgOiBheGlzID09PSAneScgPyB0aGlzLnNjYWxlTygxLCAtMSwgMCwgYXJvdW5kKSA6IHRoaXMuc2NhbGVPKC0xLCAtMSwgYXhpcywgYXJvdW5kIHx8IGF4aXMpOyAvLyBEZWZpbmUgYW4geCwgeSBmbGlwIHBvaW50XG4gICAgfSAvLyBTaGVhciBtYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcInNoZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNoZWFyKGEsIGN4LCBjeSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zaGVhck8oYSwgY3gsIGN5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2hlYXJPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNoZWFyTyhseCkge1xuICAgICAgdmFyIGN5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwO1xuICAgICAgdmFyIGEgPSB0aGlzLmEsXG4gICAgICAgICAgYiA9IHRoaXMuYixcbiAgICAgICAgICBjID0gdGhpcy5jLFxuICAgICAgICAgIGQgPSB0aGlzLmQsXG4gICAgICAgICAgZSA9IHRoaXMuZSxcbiAgICAgICAgICBmID0gdGhpcy5mO1xuICAgICAgdGhpcy5hID0gYSArIGIgKiBseDtcbiAgICAgIHRoaXMuYyA9IGMgKyBkICogbHg7XG4gICAgICB0aGlzLmUgPSBlICsgZiAqIGx4IC0gY3kgKiBseDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gU2tldyBNYXRyaXhcblxuICB9LCB7XG4gICAga2V5OiBcInNrZXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2tldyh4LCB5LCBjeCwgY3kpIHtcbiAgICAgIHZhciBfdGhpcyRjbG9uZTI7XG5cbiAgICAgIHJldHVybiAoX3RoaXMkY2xvbmUyID0gdGhpcy5jbG9uZSgpKS5za2V3Ty5hcHBseShfdGhpcyRjbG9uZTIsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNrZXdPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNrZXdPKHgpIHtcbiAgICAgIHZhciB5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB4O1xuICAgICAgdmFyIGN4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwO1xuICAgICAgdmFyIGN5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuXG4gICAgICAvLyBzdXBwb3J0IHVuaWZvcm1hbCBza2V3XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBjeSA9IGN4O1xuICAgICAgICBjeCA9IHk7XG4gICAgICAgIHkgPSB4O1xuICAgICAgfSAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuXG5cbiAgICAgIHggPSByYWRpYW5zKHgpO1xuICAgICAgeSA9IHJhZGlhbnMoeSk7XG4gICAgICB2YXIgbHggPSBNYXRoLnRhbih4KTtcbiAgICAgIHZhciBseSA9IE1hdGgudGFuKHkpO1xuICAgICAgdmFyIGEgPSB0aGlzLmEsXG4gICAgICAgICAgYiA9IHRoaXMuYixcbiAgICAgICAgICBjID0gdGhpcy5jLFxuICAgICAgICAgIGQgPSB0aGlzLmQsXG4gICAgICAgICAgZSA9IHRoaXMuZSxcbiAgICAgICAgICBmID0gdGhpcy5mO1xuICAgICAgdGhpcy5hID0gYSArIGIgKiBseDtcbiAgICAgIHRoaXMuYiA9IGIgKyBhICogbHk7XG4gICAgICB0aGlzLmMgPSBjICsgZCAqIGx4O1xuICAgICAgdGhpcy5kID0gZCArIGMgKiBseTtcbiAgICAgIHRoaXMuZSA9IGUgKyBmICogbHggLSBjeSAqIGx4O1xuICAgICAgdGhpcy5mID0gZiArIGUgKiBseSAtIGN4ICogbHk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFNrZXdYXG5cbiAgfSwge1xuICAgIGtleTogXCJza2V3WFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBza2V3WCh4LCBjeCwgY3kpIHtcbiAgICAgIHJldHVybiB0aGlzLnNrZXcoeCwgMCwgY3gsIGN5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2tld1hPXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNrZXdYTyh4LCBjeCwgY3kpIHtcbiAgICAgIHJldHVybiB0aGlzLnNrZXdPKHgsIDAsIGN4LCBjeSk7XG4gICAgfSAvLyBTa2V3WVxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2tld1lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2tld1koeSwgY3gsIGN5KSB7XG4gICAgICByZXR1cm4gdGhpcy5za2V3KDAsIHksIGN4LCBjeSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNrZXdZT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBza2V3WU8oeSwgY3gsIGN5KSB7XG4gICAgICByZXR1cm4gdGhpcy5za2V3TygwLCB5LCBjeCwgY3kpO1xuICAgIH0gLy8gVHJhbnNmb3JtIGFyb3VuZCBhIGNlbnRlciBwb2ludFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiYXJvdW5kT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcm91bmRPKGN4LCBjeSwgbWF0cml4KSB7XG4gICAgICB2YXIgZHggPSBjeCB8fCAwO1xuICAgICAgdmFyIGR5ID0gY3kgfHwgMDtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZU8oLWR4LCAtZHkpLmxtdWx0aXBseU8obWF0cml4KS50cmFuc2xhdGVPKGR4LCBkeSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFyb3VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcm91bmQoY3gsIGN5LCBtYXRyaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYXJvdW5kTyhjeCwgY3ksIG1hdHJpeCk7XG4gICAgfSAvLyBDaGVjayBpZiB0d28gbWF0cmljZXMgYXJlIGVxdWFsXG5cbiAgfSwge1xuICAgIGtleTogXCJlcXVhbHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXF1YWxzKG90aGVyKSB7XG4gICAgICB2YXIgY29tcCA9IG5ldyBNYXRyaXgob3RoZXIpO1xuICAgICAgcmV0dXJuIGNsb3NlRW5vdWdoKHRoaXMuYSwgY29tcC5hKSAmJiBjbG9zZUVub3VnaCh0aGlzLmIsIGNvbXAuYikgJiYgY2xvc2VFbm91Z2godGhpcy5jLCBjb21wLmMpICYmIGNsb3NlRW5vdWdoKHRoaXMuZCwgY29tcC5kKSAmJiBjbG9zZUVub3VnaCh0aGlzLmUsIGNvbXAuZSkgJiYgY2xvc2VFbm91Z2godGhpcy5mLCBjb21wLmYpO1xuICAgIH0gLy8gQ29udmVydCBtYXRyaXggdG8gc3RyaW5nXG5cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiAnbWF0cml4KCcgKyB0aGlzLmEgKyAnLCcgKyB0aGlzLmIgKyAnLCcgKyB0aGlzLmMgKyAnLCcgKyB0aGlzLmQgKyAnLCcgKyB0aGlzLmUgKyAnLCcgKyB0aGlzLmYgKyAnKSc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHJldHVybiBbdGhpcy5hLCB0aGlzLmIsIHRoaXMuYywgdGhpcy5kLCB0aGlzLmUsIHRoaXMuZl07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZhbHVlT2ZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGE6IHRoaXMuYSxcbiAgICAgICAgYjogdGhpcy5iLFxuICAgICAgICBjOiB0aGlzLmMsXG4gICAgICAgIGQ6IHRoaXMuZCxcbiAgICAgICAgZTogdGhpcy5lLFxuICAgICAgICBmOiB0aGlzLmZcbiAgICAgIH07XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwiZnJvbUFycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZyb21BcnJheShhKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhOiBhWzBdLFxuICAgICAgICBiOiBhWzFdLFxuICAgICAgICBjOiBhWzJdLFxuICAgICAgICBkOiBhWzNdLFxuICAgICAgICBlOiBhWzRdLFxuICAgICAgICBmOiBhWzVdXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc01hdHJpeExpa2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNNYXRyaXhMaWtlKG8pIHtcbiAgICAgIHJldHVybiBvLmEgIT0gbnVsbCB8fCBvLmIgIT0gbnVsbCB8fCBvLmMgIT0gbnVsbCB8fCBvLmQgIT0gbnVsbCB8fCBvLmUgIT0gbnVsbCB8fCBvLmYgIT0gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9ybWF0VHJhbnNmb3Jtc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JtYXRUcmFuc2Zvcm1zKG8pIHtcbiAgICAgIC8vIEdldCBhbGwgb2YgdGhlIHBhcmFtZXRlcnMgcmVxdWlyZWQgdG8gZm9ybSB0aGUgbWF0cml4XG4gICAgICB2YXIgZmxpcEJvdGggPSBvLmZsaXAgPT09ICdib3RoJyB8fCBvLmZsaXAgPT09IHRydWU7XG4gICAgICB2YXIgZmxpcFggPSBvLmZsaXAgJiYgKGZsaXBCb3RoIHx8IG8uZmxpcCA9PT0gJ3gnKSA/IC0xIDogMTtcbiAgICAgIHZhciBmbGlwWSA9IG8uZmxpcCAmJiAoZmxpcEJvdGggfHwgby5mbGlwID09PSAneScpID8gLTEgOiAxO1xuICAgICAgdmFyIHNrZXdYID0gby5za2V3ICYmIG8uc2tldy5sZW5ndGggPyBvLnNrZXdbMF0gOiBpc0Zpbml0ZShvLnNrZXcpID8gby5za2V3IDogaXNGaW5pdGUoby5za2V3WCkgPyBvLnNrZXdYIDogMDtcbiAgICAgIHZhciBza2V3WSA9IG8uc2tldyAmJiBvLnNrZXcubGVuZ3RoID8gby5za2V3WzFdIDogaXNGaW5pdGUoby5za2V3KSA/IG8uc2tldyA6IGlzRmluaXRlKG8uc2tld1kpID8gby5za2V3WSA6IDA7XG4gICAgICB2YXIgc2NhbGVYID0gby5zY2FsZSAmJiBvLnNjYWxlLmxlbmd0aCA/IG8uc2NhbGVbMF0gKiBmbGlwWCA6IGlzRmluaXRlKG8uc2NhbGUpID8gby5zY2FsZSAqIGZsaXBYIDogaXNGaW5pdGUoby5zY2FsZVgpID8gby5zY2FsZVggKiBmbGlwWCA6IGZsaXBYO1xuICAgICAgdmFyIHNjYWxlWSA9IG8uc2NhbGUgJiYgby5zY2FsZS5sZW5ndGggPyBvLnNjYWxlWzFdICogZmxpcFkgOiBpc0Zpbml0ZShvLnNjYWxlKSA/IG8uc2NhbGUgKiBmbGlwWSA6IGlzRmluaXRlKG8uc2NhbGVZKSA/IG8uc2NhbGVZICogZmxpcFkgOiBmbGlwWTtcbiAgICAgIHZhciBzaGVhciA9IG8uc2hlYXIgfHwgMDtcbiAgICAgIHZhciB0aGV0YSA9IG8ucm90YXRlIHx8IG8udGhldGEgfHwgMDtcbiAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQoby5vcmlnaW4gfHwgby5hcm91bmQgfHwgby5veCB8fCBvLm9yaWdpblgsIG8ub3kgfHwgby5vcmlnaW5ZKTtcbiAgICAgIHZhciBveCA9IG9yaWdpbi54O1xuICAgICAgdmFyIG95ID0gb3JpZ2luLnk7XG4gICAgICB2YXIgcG9zaXRpb24gPSBuZXcgUG9pbnQoby5wb3NpdGlvbiB8fCBvLnB4IHx8IG8ucG9zaXRpb25YLCBvLnB5IHx8IG8ucG9zaXRpb25ZKTtcbiAgICAgIHZhciBweCA9IHBvc2l0aW9uLng7XG4gICAgICB2YXIgcHkgPSBwb3NpdGlvbi55O1xuICAgICAgdmFyIHRyYW5zbGF0ZSA9IG5ldyBQb2ludChvLnRyYW5zbGF0ZSB8fCBvLnR4IHx8IG8udHJhbnNsYXRlWCwgby50eSB8fCBvLnRyYW5zbGF0ZVkpO1xuICAgICAgdmFyIHR4ID0gdHJhbnNsYXRlLng7XG4gICAgICB2YXIgdHkgPSB0cmFuc2xhdGUueTtcbiAgICAgIHZhciByZWxhdGl2ZSA9IG5ldyBQb2ludChvLnJlbGF0aXZlIHx8IG8ucnggfHwgby5yZWxhdGl2ZVgsIG8ucnkgfHwgby5yZWxhdGl2ZVkpO1xuICAgICAgdmFyIHJ4ID0gcmVsYXRpdmUueDtcbiAgICAgIHZhciByeSA9IHJlbGF0aXZlLnk7IC8vIFBvcHVsYXRlIGFsbCBvZiB0aGUgdmFsdWVzXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNjYWxlWDogc2NhbGVYLFxuICAgICAgICBzY2FsZVk6IHNjYWxlWSxcbiAgICAgICAgc2tld1g6IHNrZXdYLFxuICAgICAgICBza2V3WTogc2tld1ksXG4gICAgICAgIHNoZWFyOiBzaGVhcixcbiAgICAgICAgdGhldGE6IHRoZXRhLFxuICAgICAgICByeDogcngsXG4gICAgICAgIHJ5OiByeSxcbiAgICAgICAgdHg6IHR4LFxuICAgICAgICB0eTogdHksXG4gICAgICAgIG94OiBveCxcbiAgICAgICAgb3k6IG95LFxuICAgICAgICBweDogcHgsXG4gICAgICAgIHB5OiBweVxuICAgICAgfTtcbiAgICB9IC8vIGxlZnQgbWF0cml4LCByaWdodCBtYXRyaXgsIHRhcmdldCBtYXRyaXggd2hpY2ggaXMgb3ZlcndyaXR0ZW5cblxuICB9LCB7XG4gICAga2V5OiBcIm1hdHJpeE11bHRpcGx5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hdHJpeE11bHRpcGx5KGwsIHIsIG8pIHtcbiAgICAgIC8vIFdvcmsgb3V0IHRoZSBwcm9kdWN0IGRpcmVjdGx5XG4gICAgICB2YXIgYSA9IGwuYSAqIHIuYSArIGwuYyAqIHIuYjtcbiAgICAgIHZhciBiID0gbC5iICogci5hICsgbC5kICogci5iO1xuICAgICAgdmFyIGMgPSBsLmEgKiByLmMgKyBsLmMgKiByLmQ7XG4gICAgICB2YXIgZCA9IGwuYiAqIHIuYyArIGwuZCAqIHIuZDtcbiAgICAgIHZhciBlID0gbC5lICsgbC5hICogci5lICsgbC5jICogci5mO1xuICAgICAgdmFyIGYgPSBsLmYgKyBsLmIgKiByLmUgKyBsLmQgKiByLmY7IC8vIG1ha2Ugc3VyZSB0byB1c2UgbG9jYWwgdmFyaWFibGVzIGJlY2F1c2UgbC9yIGFuZCBvIGNvdWxkIGJlIHRoZSBzYW1lXG5cbiAgICAgIG8uYSA9IGE7XG4gICAgICBvLmIgPSBiO1xuICAgICAgby5jID0gYztcbiAgICAgIG8uZCA9IGQ7XG4gICAgICBvLmUgPSBlO1xuICAgICAgby5mID0gZjtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNYXRyaXg7XG59KCk7XG5mdW5jdGlvbiBjdG0oKSB7XG4gIHJldHVybiBuZXcgTWF0cml4KHRoaXMubm9kZS5nZXRDVE0oKSk7XG59XG5mdW5jdGlvbiBzY3JlZW5DVE0oKSB7XG4gIC8qIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEzNDQ1MzdcclxuICAgICBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIEZGIGRvZXMgbm90IHJldHVybiB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICAgZm9yIHRoZSBpbm5lciBjb29yZGluYXRlIHN5c3RlbSB3aGVuIGdldFNjcmVlbkNUTSgpIGlzIGNhbGxlZCBvbiBuZXN0ZWQgc3Zncy5cclxuICAgICBIb3dldmVyIGFsbCBvdGhlciBCcm93c2VycyBkbyB0aGF0ICovXG4gIGlmICh0eXBlb2YgdGhpcy5pc1Jvb3QgPT09ICdmdW5jdGlvbicgJiYgIXRoaXMuaXNSb290KCkpIHtcbiAgICB2YXIgcmVjdCA9IHRoaXMucmVjdCgxLCAxKTtcbiAgICB2YXIgbSA9IHJlY3Qubm9kZS5nZXRTY3JlZW5DVE0oKTtcbiAgICByZWN0LnJlbW92ZSgpO1xuICAgIHJldHVybiBuZXcgTWF0cml4KG0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcy5ub2RlLmdldFNjcmVlbkNUTSgpKTtcbn1cbnJlZ2lzdGVyKE1hdHJpeCwgJ01hdHJpeCcpO1xuXG5mdW5jdGlvbiBwYXJzZXIoKSB7XG4gIC8vIFJldXNlIGNhY2hlZCBlbGVtZW50IGlmIHBvc3NpYmxlXG4gIGlmICghcGFyc2VyLm5vZGVzKSB7XG4gICAgdmFyIHN2ZyA9IG1ha2VJbnN0YW5jZSgpLnNpemUoMiwgMCk7XG4gICAgc3ZnLm5vZGUuc3R5bGUuY3NzVGV4dCA9IFsnb3BhY2l0eTogMCcsICdwb3NpdGlvbjogYWJzb2x1dGUnLCAnbGVmdDogLTEwMCUnLCAndG9wOiAtMTAwJScsICdvdmVyZmxvdzogaGlkZGVuJ10uam9pbignOycpO1xuICAgIHN2Zy5hdHRyKCdmb2N1c2FibGUnLCAnZmFsc2UnKTtcbiAgICBzdmcuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHZhciBwYXRoID0gc3ZnLnBhdGgoKS5ub2RlO1xuICAgIHBhcnNlci5ub2RlcyA9IHtcbiAgICAgIHN2Zzogc3ZnLFxuICAgICAgcGF0aDogcGF0aFxuICAgIH07XG4gIH1cblxuICBpZiAoIXBhcnNlci5ub2Rlcy5zdmcubm9kZS5wYXJlbnROb2RlKSB7XG4gICAgdmFyIGIgPSBnbG9iYWxzLmRvY3VtZW50LmJvZHkgfHwgZ2xvYmFscy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgcGFyc2VyLm5vZGVzLnN2Zy5hZGRUbyhiKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZXIubm9kZXM7XG59XG5cbmZ1bmN0aW9uIGlzTnVsbGVkQm94KGJveCkge1xuICByZXR1cm4gIWJveC53aWR0aCAmJiAhYm94LmhlaWdodCAmJiAhYm94LnggJiYgIWJveC55O1xufVxuXG5mdW5jdGlvbiBkb21Db250YWlucyhub2RlKSB7XG4gIHJldHVybiBub2RlID09PSBnbG9iYWxzLmRvY3VtZW50IHx8IChnbG9iYWxzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyB8fCBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIFRoaXMgaXMgSUUgLSBpdCBkb2VzIG5vdCBzdXBwb3J0IGNvbnRhaW5zKCkgZm9yIHRvcC1sZXZlbCBTVkdzXG4gICAgd2hpbGUgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZSA9PT0gZ2xvYmFscy5kb2N1bWVudDtcbiAgfSkuY2FsbChnbG9iYWxzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgbm9kZSk7XG59XG5cbnZhciBCb3ggPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBCb3goKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJveCk7XG5cbiAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhCb3gsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChzb3VyY2UpIHtcbiAgICAgIHZhciBiYXNlID0gWzAsIDAsIDAsIDBdO1xuICAgICAgc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgPyBzb3VyY2Uuc3BsaXQoZGVsaW1pdGVyKS5tYXAocGFyc2VGbG9hdCkgOiBBcnJheS5pc0FycmF5KHNvdXJjZSkgPyBzb3VyY2UgOiBfdHlwZW9mKHNvdXJjZSkgPT09ICdvYmplY3QnID8gW3NvdXJjZS5sZWZ0ICE9IG51bGwgPyBzb3VyY2UubGVmdCA6IHNvdXJjZS54LCBzb3VyY2UudG9wICE9IG51bGwgPyBzb3VyY2UudG9wIDogc291cmNlLnksIHNvdXJjZS53aWR0aCwgc291cmNlLmhlaWdodF0gOiBhcmd1bWVudHMubGVuZ3RoID09PSA0ID8gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpIDogYmFzZTtcbiAgICAgIHRoaXMueCA9IHNvdXJjZVswXSB8fCAwO1xuICAgICAgdGhpcy55ID0gc291cmNlWzFdIHx8IDA7XG4gICAgICB0aGlzLndpZHRoID0gdGhpcy53ID0gc291cmNlWzJdIHx8IDA7XG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaCA9IHNvdXJjZVszXSB8fCAwOyAvLyBBZGQgbW9yZSBib3VuZGluZyBib3ggcHJvcGVydGllc1xuXG4gICAgICB0aGlzLngyID0gdGhpcy54ICsgdGhpcy53O1xuICAgICAgdGhpcy55MiA9IHRoaXMueSArIHRoaXMuaDtcbiAgICAgIHRoaXMuY3ggPSB0aGlzLnggKyB0aGlzLncgLyAyO1xuICAgICAgdGhpcy5jeSA9IHRoaXMueSArIHRoaXMuaCAvIDI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIE1lcmdlIHJlY3QgYm94IHdpdGggYW5vdGhlciwgcmV0dXJuIGEgbmV3IGluc3RhbmNlXG5cbiAgfSwge1xuICAgIGtleTogXCJtZXJnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtZXJnZShib3gpIHtcbiAgICAgIHZhciB4ID0gTWF0aC5taW4odGhpcy54LCBib3gueCk7XG4gICAgICB2YXIgeSA9IE1hdGgubWluKHRoaXMueSwgYm94LnkpO1xuICAgICAgdmFyIHdpZHRoID0gTWF0aC5tYXgodGhpcy54ICsgdGhpcy53aWR0aCwgYm94LnggKyBib3gud2lkdGgpIC0geDtcbiAgICAgIHZhciBoZWlnaHQgPSBNYXRoLm1heCh0aGlzLnkgKyB0aGlzLmhlaWdodCwgYm94LnkgKyBib3guaGVpZ2h0KSAtIHk7XG4gICAgICByZXR1cm4gbmV3IEJveCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidHJhbnNmb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zZm9ybShtKSB7XG4gICAgICBpZiAoIShtIGluc3RhbmNlb2YgTWF0cml4KSkge1xuICAgICAgICBtID0gbmV3IE1hdHJpeChtKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHhNaW4gPSBJbmZpbml0eTtcbiAgICAgIHZhciB4TWF4ID0gLUluZmluaXR5O1xuICAgICAgdmFyIHlNaW4gPSBJbmZpbml0eTtcbiAgICAgIHZhciB5TWF4ID0gLUluZmluaXR5O1xuICAgICAgdmFyIHB0cyA9IFtuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpLCBuZXcgUG9pbnQodGhpcy54MiwgdGhpcy55KSwgbmV3IFBvaW50KHRoaXMueCwgdGhpcy55MiksIG5ldyBQb2ludCh0aGlzLngyLCB0aGlzLnkyKV07XG4gICAgICBwdHMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgICBwID0gcC50cmFuc2Zvcm0obSk7XG4gICAgICAgIHhNaW4gPSBNYXRoLm1pbih4TWluLCBwLngpO1xuICAgICAgICB4TWF4ID0gTWF0aC5tYXgoeE1heCwgcC54KTtcbiAgICAgICAgeU1pbiA9IE1hdGgubWluKHlNaW4sIHAueSk7XG4gICAgICAgIHlNYXggPSBNYXRoLm1heCh5TWF4LCBwLnkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IEJveCh4TWluLCB5TWluLCB4TWF4IC0geE1pbiwgeU1heCAtIHlNaW4pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkT2Zmc2V0KCkge1xuICAgICAgLy8gb2Zmc2V0IGJ5IHdpbmRvdyBzY3JvbGwgcG9zaXRpb24sIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGNoYW5nZXMgd2hlbiB3aW5kb3cgaXMgc2Nyb2xsZWRcbiAgICAgIHRoaXMueCArPSBnbG9iYWxzLndpbmRvdy5wYWdlWE9mZnNldDtcbiAgICAgIHRoaXMueSArPSBnbG9iYWxzLndpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnggKyAnICcgKyB0aGlzLnkgKyAnICcgKyB0aGlzLndpZHRoICsgJyAnICsgdGhpcy5oZWlnaHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvQXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNOdWxsZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNOdWxsZWQoKSB7XG4gICAgICByZXR1cm4gaXNOdWxsZWRCb3godGhpcyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJveDtcbn0oKTtcblxuZnVuY3Rpb24gZ2V0Qm94KGNiLCByZXRyeSkge1xuICB2YXIgYm94O1xuXG4gIHRyeSB7XG4gICAgYm94ID0gY2IodGhpcy5ub2RlKTtcblxuICAgIGlmIChpc051bGxlZEJveChib3gpICYmICFkb21Db250YWlucyh0aGlzLm5vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbm90IGluIHRoZSBkb20nKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBib3ggPSByZXRyeSh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiBib3g7XG59XG5cbmZ1bmN0aW9uIGJib3goKSB7XG4gIHJldHVybiBuZXcgQm94KGdldEJveC5jYWxsKHRoaXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QkJveCgpO1xuICB9LCBmdW5jdGlvbiAoZWwpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIGNsb25lID0gZWwuY2xvbmUoKS5hZGRUbyhwYXJzZXIoKS5zdmcpLnNob3coKTtcbiAgICAgIHZhciBib3ggPSBjbG9uZS5ub2RlLmdldEJCb3goKTtcbiAgICAgIGNsb25lLnJlbW92ZSgpO1xuICAgICAgcmV0dXJuIGJveDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dldHRpbmcgYmJveCBvZiBlbGVtZW50IFwiJyArIGVsLm5vZGUubm9kZU5hbWUgKyAnXCIgaXMgbm90IHBvc3NpYmxlLiAnICsgZS50b1N0cmluZygpKTtcbiAgICB9XG4gIH0pKTtcbn1cbmZ1bmN0aW9uIHJib3goZWwpIHtcbiAgdmFyIGJveCA9IG5ldyBCb3goZ2V0Qm94LmNhbGwodGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfSwgZnVuY3Rpb24gKGVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdHZXR0aW5nIHJib3ggb2YgZWxlbWVudCBcIicgKyBlbC5ub2RlLm5vZGVOYW1lICsgJ1wiIGlzIG5vdCBwb3NzaWJsZScpO1xuICB9KSk7XG4gIGlmIChlbCkgcmV0dXJuIGJveC50cmFuc2Zvcm0oZWwuc2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcbiAgcmV0dXJuIGJveC5hZGRPZmZzZXQoKTtcbn1cbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIHZpZXdib3g6IHtcbiAgICB2aWV3Ym94OiBmdW5jdGlvbiB2aWV3Ym94KHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcbiAgICAgIGlmICh4ID09IG51bGwpIHJldHVybiBuZXcgQm94KHRoaXMuYXR0cigndmlld0JveCcpKTsgLy8gYWN0IGFzIHNldHRlclxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd2aWV3Qm94JywgbmV3IEJveCh4LCB5LCB3aWR0aCwgaGVpZ2h0KSk7XG4gICAgfSxcbiAgICB6b29tOiBmdW5jdGlvbiB6b29tKGxldmVsLCBwb2ludCkge1xuICAgICAgdmFyIHdpZHRoID0gdGhpcy5ub2RlLmNsaWVudFdpZHRoO1xuICAgICAgdmFyIGhlaWdodCA9IHRoaXMubm9kZS5jbGllbnRIZWlnaHQ7XG4gICAgICB2YXIgdiA9IHRoaXMudmlld2JveCgpOyAvLyBGaXJlZm94IGRvZXMgbm90IHN1cHBvcnQgY2xpZW50SGVpZ2h0IGFuZCByZXR1cm5zIDBcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTg3NDgxMVxuXG4gICAgICBpZiAoIXdpZHRoICYmICFoZWlnaHQpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlKTtcbiAgICAgICAgd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJykpO1xuICAgICAgICBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHpvb21YID0gd2lkdGggLyB2LndpZHRoO1xuICAgICAgdmFyIHpvb21ZID0gaGVpZ2h0IC8gdi5oZWlnaHQ7XG4gICAgICB2YXIgem9vbSA9IE1hdGgubWluKHpvb21YLCB6b29tWSk7XG5cbiAgICAgIGlmIChsZXZlbCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB6b29tO1xuICAgICAgfVxuXG4gICAgICB2YXIgem9vbUFtb3VudCA9IHpvb20gLyBsZXZlbDtcbiAgICAgIGlmICh6b29tQW1vdW50ID09PSBJbmZpbml0eSkgem9vbUFtb3VudCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICBwb2ludCA9IHBvaW50IHx8IG5ldyBQb2ludCh3aWR0aCAvIDIgLyB6b29tWCArIHYueCwgaGVpZ2h0IC8gMiAvIHpvb21ZICsgdi55KTtcbiAgICAgIHZhciBib3ggPSBuZXcgQm94KHYpLnRyYW5zZm9ybShuZXcgTWF0cml4KHtcbiAgICAgICAgc2NhbGU6IHpvb21BbW91bnQsXG4gICAgICAgIG9yaWdpbjogcG9pbnRcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiB0aGlzLnZpZXdib3goYm94KTtcbiAgICB9XG4gIH1cbn0pO1xucmVnaXN0ZXIoQm94LCAnQm94Jyk7XG5cbi8qIGVzbGludCBuby1uZXctZnVuYzogXCJvZmZcIiAqL1xudmFyIHN1YkNsYXNzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gdHJ5IGVzNiBzdWJjbGFzc2luZ1xuICAgIHJldHVybiBGdW5jdGlvbignbmFtZScsICdiYXNlQ2xhc3MnLCAnX2NvbnN0cnVjdG9yJywgWydiYXNlQ2xhc3MgPSBiYXNlQ2xhc3MgfHwgQXJyYXknLCAncmV0dXJuIHsnLCAnICBbbmFtZV06IGNsYXNzIGV4dGVuZHMgYmFzZUNsYXNzIHsnLCAnICAgIGNvbnN0cnVjdG9yICguLi5hcmdzKSB7JywgJyAgICAgIHN1cGVyKC4uLmFyZ3MpJywgJyAgICAgIF9jb25zdHJ1Y3RvciAmJiBfY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyknLCAnICAgIH0nLCAnICB9JywgJ31bbmFtZV0nXS5qb2luKCdcXG4nKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBVc2UgZXM1IGFwcHJvYWNoXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgYmFzZUNsYXNzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBBcnJheTtcblxuICAgICAgdmFyIF9jb25zdHJ1Y3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgICB2YXIgQXJyID0gZnVuY3Rpb24gQXJyKCkge1xuICAgICAgICBiYXNlQ2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgX2NvbnN0cnVjdG9yICYmIF9jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgICAgQXJyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoYmFzZUNsYXNzLnByb3RvdHlwZSk7XG4gICAgICBBcnIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQXJyO1xuXG4gICAgICBBcnIucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICB2YXIgYXJyID0gbmV3IEFycigpO1xuICAgICAgICBhcnIucHVzaC5hcHBseShhcnIsIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh0aGlzLCBmbikpO1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEFycjtcbiAgICB9O1xuICB9XG59KCk7XG5cbnZhciBMaXN0ID0gc3ViQ2xhc3NBcnJheSgnTGlzdCcsIEFycmF5LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcnIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICAvLyBUaGlzIGNhdGNoZXMgdGhlIGNhc2UsIHRoYXQgbmF0aXZlIG1hcCB0cmllcyB0byBjcmVhdGUgYW4gYXJyYXkgd2l0aCBuZXcgQXJyYXkoMSlcbiAgaWYgKHR5cGVvZiBhcnIgPT09ICdudW1iZXInKSByZXR1cm4gdGhpcztcbiAgdGhpcy5sZW5ndGggPSAwO1xuICB0aGlzLnB1c2guYXBwbHkodGhpcywgX3RvQ29uc3VtYWJsZUFycmF5KGFycikpO1xufSk7XG5leHRlbmQoTGlzdCwge1xuICBlYWNoOiBmdW5jdGlvbiBlYWNoKGZuT3JNZXRob2ROYW1lKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmbk9yTWV0aG9kTmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZm5Pck1ldGhvZE5hbWUuY2FsbChlbCwgZWwpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsW2ZuT3JNZXRob2ROYW1lXS5hcHBseShlbCwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIHRoaXMpO1xuICB9XG59KTtcbnZhciByZXNlcnZlZCA9IFsndG9BcnJheScsICdjb25zdHJ1Y3RvcicsICdlYWNoJ107XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gKG1ldGhvZHMpIHtcbiAgbWV0aG9kcyA9IG1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uIChvYmosIG5hbWUpIHtcbiAgICAvLyBEb24ndCBvdmVyd3JpdGUgb3duIG1ldGhvZHNcbiAgICBpZiAocmVzZXJ2ZWQuaW5jbHVkZXMobmFtZSkpIHJldHVybiBvYmo7IC8vIERvbid0IGFkZCBwcml2YXRlIG1ldGhvZHNcblxuICAgIGlmIChuYW1lWzBdID09PSAnXycpIHJldHVybiBvYmo7IC8vIFJlbGF5IGV2ZXJ5IGNhbGwgdG8gZWFjaCgpXG5cbiAgICBvYmpbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGF0dHJzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGF0dHJzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2guYXBwbHkodGhpcywgW25hbWVdLmNvbmNhdChhdHRycykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG4gIGV4dGVuZChMaXN0LCBtZXRob2RzKTtcbn07XG5cbmZ1bmN0aW9uIGJhc2VGaW5kKHF1ZXJ5LCBwYXJlbnQpIHtcbiAgcmV0dXJuIG5ldyBMaXN0KG1hcCgocGFyZW50IHx8IGdsb2JhbHMuZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBhZG9wdChub2RlKTtcbiAgfSkpO1xufSAvLyBTY29wZWQgZmluZCBtZXRob2RcblxuZnVuY3Rpb24gZmluZChxdWVyeSkge1xuICByZXR1cm4gYmFzZUZpbmQocXVlcnksIHRoaXMubm9kZSk7XG59XG5mdW5jdGlvbiBmaW5kT25lKHF1ZXJ5KSB7XG4gIHJldHVybiBhZG9wdCh0aGlzLm5vZGUucXVlcnlTZWxlY3RvcihxdWVyeSkpO1xufVxuXG52YXIgRXZlbnRUYXJnZXQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9CYXNlKSB7XG4gIF9pbmhlcml0cyhFdmVudFRhcmdldCwgX0Jhc2UpO1xuXG4gIGZ1bmN0aW9uIEV2ZW50VGFyZ2V0KCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgICAgX3JlZiRldmVudHMgPSBfcmVmLmV2ZW50cyxcbiAgICAgICAgZXZlbnRzID0gX3JlZiRldmVudHMgPT09IHZvaWQgMCA/IHt9IDogX3JlZiRldmVudHM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRXZlbnRUYXJnZXQpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRXZlbnRUYXJnZXQpLmNhbGwodGhpcykpO1xuICAgIF90aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRXZlbnRUYXJnZXQsIFt7XG4gICAga2V5OiBcImFkZEV2ZW50TGlzdGVuZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2gkMShldmVudCwgZGF0YSkge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKHRoaXMsIGV2ZW50LCBkYXRhKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KGV2ZW50KSB7XG4gICAgICB2YXIgYmFnID0gdGhpcy5nZXRFdmVudEhvbGRlcigpLmV2ZW50cztcbiAgICAgIGlmICghYmFnKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHZhciBldmVudHMgPSBiYWdbZXZlbnQudHlwZV07XG5cbiAgICAgIGZvciAodmFyIGkgaW4gZXZlbnRzKSB7XG4gICAgICAgIGZvciAodmFyIGogaW4gZXZlbnRzW2ldKSB7XG4gICAgICAgICAgZXZlbnRzW2ldW2pdKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgfSAvLyBGaXJlIGdpdmVuIGV2ZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJmaXJlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpcmUoZXZlbnQsIGRhdGEpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2goZXZlbnQsIGRhdGEpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEV2ZW50SG9sZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV2ZW50SG9sZGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEV2ZW50VGFyZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBVbmJpbmQgZXZlbnQgZnJvbSBsaXN0ZW5lclxuXG4gIH0sIHtcbiAgICBrZXk6IFwib2ZmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9mZiQxKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgb2ZmKHRoaXMsIGV2ZW50LCBsaXN0ZW5lcik7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gQmluZCBnaXZlbiBldmVudCB0byBsaXN0ZW5lclxuXG4gIH0sIHtcbiAgICBrZXk6IFwib25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb24kMShldmVudCwgbGlzdGVuZXIsIGJpbmRpbmcsIG9wdGlvbnMpIHtcbiAgICAgIG9uKHRoaXMsIGV2ZW50LCBsaXN0ZW5lciwgYmluZGluZywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVFdmVudExpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXIoKSB7fVxuICB9XSk7XG5cbiAgcmV0dXJuIEV2ZW50VGFyZ2V0O1xufShCYXNlKTtcbnJlZ2lzdGVyKEV2ZW50VGFyZ2V0LCAnRXZlbnRUYXJnZXQnKTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9IC8vIERlZmF1bHQgYW5pbWF0aW9uIHZhbHVlc1xuXG52YXIgdGltZWxpbmUgPSB7XG4gIGR1cmF0aW9uOiA0MDAsXG4gIGVhc2U6ICc+JyxcbiAgZGVsYXk6IDBcbn07IC8vIERlZmF1bHQgYXR0cmlidXRlIHZhbHVlc1xuXG52YXIgYXR0cnMgPSB7XG4gIC8vIGZpbGwgYW5kIHN0cm9rZVxuICAnZmlsbC1vcGFjaXR5JzogMSxcbiAgJ3N0cm9rZS1vcGFjaXR5JzogMSxcbiAgJ3N0cm9rZS13aWR0aCc6IDAsXG4gICdzdHJva2UtbGluZWpvaW4nOiAnbWl0ZXInLFxuICAnc3Ryb2tlLWxpbmVjYXAnOiAnYnV0dCcsXG4gIGZpbGw6ICcjMDAwMDAwJyxcbiAgc3Ryb2tlOiAnIzAwMDAwMCcsXG4gIG9wYWNpdHk6IDEsXG4gIC8vIHBvc2l0aW9uXG4gIHg6IDAsXG4gIHk6IDAsXG4gIGN4OiAwLFxuICBjeTogMCxcbiAgLy8gc2l6ZVxuICB3aWR0aDogMCxcbiAgaGVpZ2h0OiAwLFxuICAvLyByYWRpdXNcbiAgcjogMCxcbiAgcng6IDAsXG4gIHJ5OiAwLFxuICAvLyBncmFkaWVudFxuICBvZmZzZXQ6IDAsXG4gICdzdG9wLW9wYWNpdHknOiAxLFxuICAnc3RvcC1jb2xvcic6ICcjMDAwMDAwJyxcbiAgLy8gdGV4dFxuICAndGV4dC1hbmNob3InOiAnc3RhcnQnXG59O1xuXG52YXIgZGVmYXVsdHMgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdG5vb3A6IG5vb3AsXG5cdHRpbWVsaW5lOiB0aW1lbGluZSxcblx0YXR0cnM6IGF0dHJzXG59KTtcblxudmFyIFNWR0FycmF5ID0gc3ViQ2xhc3NBcnJheSgnU1ZHQXJyYXknLCBBcnJheSwgZnVuY3Rpb24gKGFycikge1xuICB0aGlzLmluaXQoYXJyKTtcbn0pO1xuZXh0ZW5kKFNWR0FycmF5LCB7XG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoYXJyKSB7XG4gICAgLy8gVGhpcyBjYXRjaGVzIHRoZSBjYXNlLCB0aGF0IG5hdGl2ZSBtYXAgdHJpZXMgdG8gY3JlYXRlIGFuIGFycmF5IHdpdGggbmV3IEFycmF5KDEpXG4gICAgaWYgKHR5cGVvZiBhcnIgPT09ICdudW1iZXInKSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5wdXNoLmFwcGx5KHRoaXMsIF90b0NvbnN1bWFibGVBcnJheSh0aGlzLnBhcnNlKGFycikpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgdGhpcyk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5qb2luKCcgJyk7XG4gIH0sXG4gIC8vIEZsYXR0ZW5zIHRoZSBhcnJheSBpZiBuZWVkZWRcbiAgdmFsdWVPZjogZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICB2YXIgcmV0ID0gW107XG4gICAgcmV0LnB1c2guYXBwbHkocmV0LCBfdG9Db25zdW1hYmxlQXJyYXkodGhpcykpO1xuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIC8vIFBhcnNlIHdoaXRlc3BhY2Ugc2VwYXJhdGVkIHN0cmluZ1xuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UoKSB7XG4gICAgdmFyIGFycmF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgICAvLyBJZiBhbHJlYWR5IGlzIGFuIGFycmF5LCBubyBuZWVkIHRvIHBhcnNlIGl0XG4gICAgaWYgKGFycmF5IGluc3RhbmNlb2YgQXJyYXkpIHJldHVybiBhcnJheTtcbiAgICByZXR1cm4gYXJyYXkudHJpbSgpLnNwbGl0KGRlbGltaXRlcikubWFwKHBhcnNlRmxvYXQpO1xuICB9LFxuICBjbG9uZTogZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xuICB9LFxuICB0b1NldDogZnVuY3Rpb24gdG9TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcyk7XG4gIH1cbn0pO1xuXG52YXIgU1ZHTnVtYmVyID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgLy8gSW5pdGlhbGl6ZVxuICBmdW5jdGlvbiBTVkdOdW1iZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNWR051bWJlcik7XG5cbiAgICB0aGlzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTVkdOdW1iZXIsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCh2YWx1ZSwgdW5pdCkge1xuICAgICAgdW5pdCA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbMV0gOiB1bml0O1xuICAgICAgdmFsdWUgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlWzBdIDogdmFsdWU7IC8vIGluaXRpYWxpemUgZGVmYXVsdHNcblxuICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICB0aGlzLnVuaXQgPSB1bml0IHx8ICcnOyAvLyBwYXJzZSB2YWx1ZVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBlbnN1cmUgYSB2YWxpZCBudW1lcmljIHZhbHVlXG4gICAgICAgIHRoaXMudmFsdWUgPSBpc05hTih2YWx1ZSkgPyAwIDogIWlzRmluaXRlKHZhbHVlKSA/IHZhbHVlIDwgMCA/IC0zLjRlKzM4IDogKzMuNGUrMzggOiB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICB1bml0ID0gdmFsdWUubWF0Y2gobnVtYmVyQW5kVW5pdCk7XG5cbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAvLyBtYWtlIHZhbHVlIG51bWVyaWNcbiAgICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdCh1bml0WzFdKTsgLy8gbm9ybWFsaXplXG5cbiAgICAgICAgICBpZiAodW5pdFs1XSA9PT0gJyUnKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlIC89IDEwMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRbNV0gPT09ICdzJykge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSAqPSAxMDAwO1xuICAgICAgICAgIH0gLy8gc3RvcmUgdW5pdFxuXG5cbiAgICAgICAgICB0aGlzLnVuaXQgPSB1bml0WzVdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTVkdOdW1iZXIpIHtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWVPZigpO1xuICAgICAgICAgIHRoaXMudW5pdCA9IHZhbHVlLnVuaXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnVuaXQgPT09ICclJyA/IH5+KHRoaXMudmFsdWUgKiAxZTgpIC8gMWU2IDogdGhpcy51bml0ID09PSAncycgPyB0aGlzLnZhbHVlIC8gMWUzIDogdGhpcy52YWx1ZSkgKyB0aGlzLnVuaXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvSlNPTlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gW3RoaXMudmFsdWUsIHRoaXMudW5pdF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZhbHVlT2ZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH0gLy8gQWRkIG51bWJlclxuXG4gIH0sIHtcbiAgICBrZXk6IFwicGx1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwbHVzKG51bWJlcikge1xuICAgICAgbnVtYmVyID0gbmV3IFNWR051bWJlcihudW1iZXIpO1xuICAgICAgcmV0dXJuIG5ldyBTVkdOdW1iZXIodGhpcyArIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KTtcbiAgICB9IC8vIFN1YnRyYWN0IG51bWJlclxuXG4gIH0sIHtcbiAgICBrZXk6IFwibWludXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWludXMobnVtYmVyKSB7XG4gICAgICBudW1iZXIgPSBuZXcgU1ZHTnVtYmVyKG51bWJlcik7XG4gICAgICByZXR1cm4gbmV3IFNWR051bWJlcih0aGlzIC0gbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpO1xuICAgIH0gLy8gTXVsdGlwbHkgbnVtYmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lcyhudW1iZXIpIHtcbiAgICAgIG51bWJlciA9IG5ldyBTVkdOdW1iZXIobnVtYmVyKTtcbiAgICAgIHJldHVybiBuZXcgU1ZHTnVtYmVyKHRoaXMgKiBudW1iZXIsIHRoaXMudW5pdCB8fCBudW1iZXIudW5pdCk7XG4gICAgfSAvLyBEaXZpZGUgbnVtYmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJkaXZpZGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGl2aWRlKG51bWJlcikge1xuICAgICAgbnVtYmVyID0gbmV3IFNWR051bWJlcihudW1iZXIpO1xuICAgICAgcmV0dXJuIG5ldyBTVkdOdW1iZXIodGhpcyAvIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29udmVydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb252ZXJ0KHVuaXQpIHtcbiAgICAgIHJldHVybiBuZXcgU1ZHTnVtYmVyKHRoaXMudmFsdWUsIHVuaXQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTVkdOdW1iZXI7XG59KCk7XG5cbnZhciBob29rcyA9IFtdO1xuZnVuY3Rpb24gcmVnaXN0ZXJBdHRySG9vayhmbikge1xuICBob29rcy5wdXNoKGZuKTtcbn0gLy8gU2V0IHN2ZyBlbGVtZW50IGF0dHJpYnV0ZVxuXG5mdW5jdGlvbiBhdHRyKGF0dHIsIHZhbCwgbnMpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICAvLyBhY3QgYXMgZnVsbCBnZXR0ZXJcbiAgaWYgKGF0dHIgPT0gbnVsbCkge1xuICAgIC8vIGdldCBhbiBvYmplY3Qgb2YgYXR0cmlidXRlc1xuICAgIGF0dHIgPSB7fTtcbiAgICB2YWwgPSB0aGlzLm5vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IHZhbFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgYXR0cltub2RlLm5vZGVOYW1lXSA9IGlzTnVtYmVyLnRlc3Qobm9kZS5ub2RlVmFsdWUpID8gcGFyc2VGbG9hdChub2RlLm5vZGVWYWx1ZSkgOiBub2RlLm5vZGVWYWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybiAhPSBudWxsKSB7XG4gICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyO1xuICB9IGVsc2UgaWYgKGF0dHIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIC8vIGxvb3AgdGhyb3VnaCBhcnJheSBhbmQgZ2V0IGFsbCB2YWx1ZXNcbiAgICByZXR1cm4gYXR0ci5yZWR1Y2UoZnVuY3Rpb24gKGxhc3QsIGN1cnIpIHtcbiAgICAgIGxhc3RbY3Vycl0gPSBfdGhpcy5hdHRyKGN1cnIpO1xuICAgICAgcmV0dXJuIGxhc3Q7XG4gICAgfSwge30pO1xuICB9IGVsc2UgaWYgKF90eXBlb2YoYXR0cikgPT09ICdvYmplY3QnICYmIGF0dHIuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgIC8vIGFwcGx5IGV2ZXJ5IGF0dHJpYnV0ZSBpbmRpdmlkdWFsbHkgaWYgYW4gb2JqZWN0IGlzIHBhc3NlZFxuICAgIGZvciAodmFsIGluIGF0dHIpIHtcbiAgICAgIHRoaXMuYXR0cih2YWwsIGF0dHJbdmFsXSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbCA9PT0gbnVsbCkge1xuICAgIC8vIHJlbW92ZSB2YWx1ZVxuICAgIHRoaXMubm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gIH0gZWxzZSBpZiAodmFsID09IG51bGwpIHtcbiAgICAvLyBhY3QgYXMgYSBnZXR0ZXIgaWYgdGhlIGZpcnN0IGFuZCBvbmx5IGFyZ3VtZW50IGlzIG5vdCBhbiBvYmplY3RcbiAgICB2YWwgPSB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgIHJldHVybiB2YWwgPT0gbnVsbCA/IGF0dHJzW2F0dHJdIDogaXNOdW1iZXIudGVzdCh2YWwpID8gcGFyc2VGbG9hdCh2YWwpIDogdmFsO1xuICB9IGVsc2Uge1xuICAgIC8vIExvb3AgdGhyb3VnaCBob29rcyBhbmQgZXhlY3V0ZSB0aGVtIHRvIGNvbnZlcnQgdmFsdWVcbiAgICB2YWwgPSBob29rcy5yZWR1Y2UoZnVuY3Rpb24gKF92YWwsIGhvb2spIHtcbiAgICAgIHJldHVybiBob29rKGF0dHIsIF92YWwsIF90aGlzKTtcbiAgICB9LCB2YWwpOyAvLyBlbnN1cmUgY29ycmVjdCBudW1lcmljIHZhbHVlcyAoYWxzbyBhY2NlcHRzIE5hTiBhbmQgSW5maW5pdHkpXG5cbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHZhbCA9IG5ldyBTVkdOdW1iZXIodmFsKTtcbiAgICB9IGVsc2UgaWYgKENvbG9yLmlzQ29sb3IodmFsKSkge1xuICAgICAgLy8gZW5zdXJlIGZ1bGwgaGV4IGNvbG9yXG4gICAgICB2YWwgPSBuZXcgQ29sb3IodmFsKTtcbiAgICB9IGVsc2UgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgIC8vIENoZWNrIGZvciBwbGFpbiBhcnJheXMgYW5kIHBhcnNlIGFycmF5IHZhbHVlc1xuICAgICAgdmFsID0gbmV3IFNWR0FycmF5KHZhbCk7XG4gICAgfSAvLyBpZiB0aGUgcGFzc2VkIGF0dHJpYnV0ZSBpcyBsZWFkaW5nLi4uXG5cblxuICAgIGlmIChhdHRyID09PSAnbGVhZGluZycpIHtcbiAgICAgIC8vIC4uLiBjYWxsIHRoZSBsZWFkaW5nIG1ldGhvZCBpbnN0ZWFkXG4gICAgICBpZiAodGhpcy5sZWFkaW5nKSB7XG4gICAgICAgIHRoaXMubGVhZGluZyh2YWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzZXQgZ2l2ZW4gYXR0cmlidXRlIG9uIG5vZGVcbiAgICAgIHR5cGVvZiBucyA9PT0gJ3N0cmluZycgPyB0aGlzLm5vZGUuc2V0QXR0cmlidXRlTlMobnMsIGF0dHIsIHZhbC50b1N0cmluZygpKSA6IHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsLnRvU3RyaW5nKCkpO1xuICAgIH0gLy8gcmVidWlsZCBpZiByZXF1aXJlZFxuXG5cbiAgICBpZiAodGhpcy5yZWJ1aWxkICYmIChhdHRyID09PSAnZm9udC1zaXplJyB8fCBhdHRyID09PSAneCcpKSB7XG4gICAgICB0aGlzLnJlYnVpbGQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cblxudmFyIERvbSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0V2ZW50VGFyZ2V0KSB7XG4gIF9pbmhlcml0cyhEb20sIF9FdmVudFRhcmdldCk7XG5cbiAgZnVuY3Rpb24gRG9tKG5vZGUsIGF0dHJzKSB7XG4gICAgdmFyIF90aGlzMjtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEb20pO1xuXG4gICAgX3RoaXMyID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKERvbSkuY2FsbCh0aGlzLCBub2RlKSk7XG4gICAgX3RoaXMyLm5vZGUgPSBub2RlO1xuICAgIF90aGlzMi50eXBlID0gbm9kZS5ub2RlTmFtZTtcblxuICAgIGlmIChhdHRycyAmJiBub2RlICE9PSBhdHRycykge1xuICAgICAgX3RoaXMyLmF0dHIoYXR0cnMpO1xuICAgIH1cblxuICAgIHJldHVybiBfdGhpczI7XG4gIH0gLy8gQWRkIGdpdmVuIGVsZW1lbnQgYXQgYSBwb3NpdGlvblxuXG5cbiAgX2NyZWF0ZUNsYXNzKERvbSwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChlbGVtZW50LCBpKSB7XG4gICAgICBlbGVtZW50ID0gbWFrZUluc3RhbmNlKGVsZW1lbnQpO1xuXG4gICAgICBpZiAoaSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChlbGVtZW50Lm5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5vZGUgIT09IHRoaXMubm9kZS5jaGlsZE5vZGVzW2ldKSB7XG4gICAgICAgIHRoaXMubm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudC5ub2RlLCB0aGlzLm5vZGUuY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gc2VsZlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkVG9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkVG8ocGFyZW50KSB7XG4gICAgICByZXR1cm4gbWFrZUluc3RhbmNlKHBhcmVudCkucHV0KHRoaXMpO1xuICAgIH0gLy8gUmV0dXJucyBhbGwgY2hpbGQgZWxlbWVudHNcblxuICB9LCB7XG4gICAga2V5OiBcImNoaWxkcmVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNoaWxkcmVuKCkge1xuICAgICAgcmV0dXJuIG5ldyBMaXN0KG1hcCh0aGlzLm5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBhZG9wdChub2RlKTtcbiAgICAgIH0pKTtcbiAgICB9IC8vIFJlbW92ZSBhbGwgZWxlbWVudHMgaW4gdGhpcyBjb250YWluZXJcblxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgLy8gcmVtb3ZlIGNoaWxkcmVuXG4gICAgICB3aGlsZSAodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmxhc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gQ2xvbmUgZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgICAvLyB3cml0ZSBkb20gZGF0YSB0byB0aGUgZG9tIHNvIHRoZSBjbG9uZSBjYW4gcGlja3VwIHRoZSBkYXRhXG4gICAgICB0aGlzLndyaXRlRGF0YVRvRG9tKCk7IC8vIGNsb25lIGVsZW1lbnQgYW5kIGFzc2lnbiBuZXcgaWRcblxuICAgICAgcmV0dXJuIGFzc2lnbk5ld0lkKHRoaXMubm9kZS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH0gLy8gSXRlcmF0ZXMgb3ZlciBhbGwgY2hpbGRyZW4gYW5kIGludm9rZXMgYSBnaXZlbiBibG9ja1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZWFjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlYWNoKGJsb2NrLCBkZWVwKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKCk7XG4gICAgICB2YXIgaSwgaWw7XG5cbiAgICAgIGZvciAoaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBibG9jay5hcHBseShjaGlsZHJlbltpXSwgW2ksIGNoaWxkcmVuXSk7XG5cbiAgICAgICAgaWYgKGRlZXApIHtcbiAgICAgICAgICBjaGlsZHJlbltpXS5lYWNoKGJsb2NrLCBkZWVwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZWxlbWVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbGVtZW50KG5vZGVOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IERvbShjcmVhdGUobm9kZU5hbWUpKSk7XG4gICAgfSAvLyBHZXQgZmlyc3QgY2hpbGRcblxuICB9LCB7XG4gICAga2V5OiBcImZpcnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpcnN0KCkge1xuICAgICAgcmV0dXJuIGFkb3B0KHRoaXMubm9kZS5maXJzdENoaWxkKTtcbiAgICB9IC8vIEdldCBhIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4XG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KGkpIHtcbiAgICAgIHJldHVybiBhZG9wdCh0aGlzLm5vZGUuY2hpbGROb2Rlc1tpXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEV2ZW50SG9sZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV2ZW50SG9sZGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXZlbnRUYXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgIH0gLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgY2hpbGRcblxuICB9LCB7XG4gICAga2V5OiBcImhhc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYXMoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgoZWxlbWVudCkgPj0gMDtcbiAgICB9IC8vIEdldCAvIHNldCBpZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiaWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaWQoX2lkKSB7XG4gICAgICAvLyBnZW5lcmF0ZSBuZXcgaWQgaWYgbm8gaWQgc2V0XG4gICAgICBpZiAodHlwZW9mIF9pZCA9PT0gJ3VuZGVmaW5lZCcgJiYgIXRoaXMubm9kZS5pZCkge1xuICAgICAgICB0aGlzLm5vZGUuaWQgPSBlaWQodGhpcy50eXBlKTtcbiAgICAgIH0gLy8gZG9udCd0IHNldCBkaXJlY3RseSB3aWR0aCB0aGlzLm5vZGUuaWQgdG8gbWFrZSBgbnVsbGAgd29yayBjb3JyZWN0bHlcblxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdpZCcsIF9pZCk7XG4gICAgfSAvLyBHZXRzIGluZGV4IG9mIGdpdmVuIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImluZGV4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluZGV4KGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMubm9kZS5jaGlsZE5vZGVzKS5pbmRleE9mKGVsZW1lbnQubm9kZSk7XG4gICAgfSAvLyBHZXQgdGhlIGxhc3QgY2hpbGRcblxuICB9LCB7XG4gICAga2V5OiBcImxhc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGFzdCgpIHtcbiAgICAgIHJldHVybiBhZG9wdCh0aGlzLm5vZGUubGFzdENoaWxkKTtcbiAgICB9IC8vIG1hdGNoZXMgdGhlIGVsZW1lbnQgdnMgYSBjc3Mgc2VsZWN0b3JcblxuICB9LCB7XG4gICAga2V5OiBcIm1hdGNoZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWF0Y2hlcyhzZWxlY3Rvcikge1xuICAgICAgdmFyIGVsID0gdGhpcy5ub2RlO1xuICAgICAgcmV0dXJuIChlbC5tYXRjaGVzIHx8IGVsLm1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm9NYXRjaGVzU2VsZWN0b3IpLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgICB9IC8vIFJldHVybnMgdGhlIHBhcmVudCBlbGVtZW50IGluc3RhbmNlXG5cbiAgfSwge1xuICAgIGtleTogXCJwYXJlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGFyZW50KHR5cGUpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzOyAvLyBjaGVjayBmb3IgcGFyZW50XG5cbiAgICAgIGlmICghcGFyZW50Lm5vZGUucGFyZW50Tm9kZSkgcmV0dXJuIG51bGw7IC8vIGdldCBwYXJlbnQgZWxlbWVudFxuXG4gICAgICBwYXJlbnQgPSBhZG9wdChwYXJlbnQubm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIGlmICghdHlwZSkgcmV0dXJuIHBhcmVudDsgLy8gbG9vcCB0cm91Z2ggYW5jZXN0b3JzIGlmIHR5cGUgaXMgZ2l2ZW5cblxuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50Lm1hdGNoZXModHlwZSkgOiBwYXJlbnQgaW5zdGFuY2VvZiB0eXBlKSByZXR1cm4gcGFyZW50O1xuICAgICAgICBpZiAoIXBhcmVudC5ub2RlLnBhcmVudE5vZGUgfHwgcGFyZW50Lm5vZGUucGFyZW50Tm9kZS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudCcgfHwgcGFyZW50Lm5vZGUucGFyZW50Tm9kZS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudC1mcmFnbWVudCcpIHJldHVybiBudWxsOyAvLyAjNzU5LCAjNzIwXG5cbiAgICAgICAgcGFyZW50ID0gYWRvcHQocGFyZW50Lm5vZGUucGFyZW50Tm9kZSk7XG4gICAgICB9XG4gICAgfSAvLyBCYXNpY2FsbHkgZG9lcyB0aGUgc2FtZSBhcyBgYWRkKClgIGJ1dCByZXR1cm5zIHRoZSBhZGRlZCBlbGVtZW50IGluc3RlYWRcblxuICB9LCB7XG4gICAga2V5OiBcInB1dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXQoZWxlbWVudCwgaSkge1xuICAgICAgdGhpcy5hZGQoZWxlbWVudCwgaSk7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IC8vIEFkZCBlbGVtZW50IHRvIGdpdmVuIGNvbnRhaW5lciBhbmQgcmV0dXJuIGNvbnRhaW5lclxuXG4gIH0sIHtcbiAgICBrZXk6IFwicHV0SW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHV0SW4ocGFyZW50KSB7XG4gICAgICByZXR1cm4gbWFrZUluc3RhbmNlKHBhcmVudCkuYWRkKHRoaXMpO1xuICAgIH0gLy8gUmVtb3ZlIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQoKSkge1xuICAgICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmVtb3ZlIGEgZ2l2ZW4gY2hpbGRcblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUVsZW1lbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChlbGVtZW50KSB7XG4gICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudC5ub2RlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmVwbGFjZSB0aGlzIHdpdGggZWxlbWVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVwbGFjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXBsYWNlKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQgPSBtYWtlSW5zdGFuY2UoZWxlbWVudCk7XG4gICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZWxlbWVudC5ub2RlLCB0aGlzLm5vZGUpO1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJvdW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJvdW5kKCkge1xuICAgICAgdmFyIHByZWNpc2lvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMjtcbiAgICAgIHZhciBtYXAgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cigpOyAvLyBJZiB3ZSBoYXZlIG5vIG1hcCwgYnVpbGQgb25lIGZyb20gYXR0cnNcblxuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgbWFwID0gT2JqZWN0LmtleXMoYXR0cnMpO1xuICAgICAgfSAvLyBIb2xkcyByb3VuZGVkIGF0dHJpYnV0ZXNcblxuXG4gICAgICB2YXIgbmV3QXR0cnMgPSB7fTtcbiAgICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgbmV3QXR0cnNba2V5XSA9IE1hdGgucm91bmQoYXR0cnNba2V5XSAqIGZhY3RvcikgLyBmYWN0b3I7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYXR0cihuZXdBdHRycyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIFJldHVybiBpZCBvbiBzdHJpbmcgY29udmVyc2lvblxuXG4gIH0sIHtcbiAgICBrZXk6IFwidG9TdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pZCgpO1xuICAgIH0gLy8gSW1wb3J0IHJhdyBzdmdcblxuICB9LCB7XG4gICAga2V5OiBcInN2Z1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdmcoc3ZnT3JGbiwgb3V0ZXJIVE1MKSB7XG4gICAgICB2YXIgd2VsbCwgbGVuLCBmcmFnbWVudDtcblxuICAgICAgaWYgKHN2Z09yRm4gPT09IGZhbHNlKSB7XG4gICAgICAgIG91dGVySFRNTCA9IGZhbHNlO1xuICAgICAgICBzdmdPckZuID0gbnVsbDtcbiAgICAgIH0gLy8gYWN0IGFzIGdldHRlciBpZiBubyBzdmcgc3RyaW5nIGlzIGdpdmVuXG5cblxuICAgICAgaWYgKHN2Z09yRm4gPT0gbnVsbCB8fCB0eXBlb2Ygc3ZnT3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBUaGUgZGVmYXVsdCBmb3IgZXhwb3J0cyBpcywgdGhhdCB0aGUgb3V0ZXJOb2RlIGlzIGluY2x1ZGVkXG4gICAgICAgIG91dGVySFRNTCA9IG91dGVySFRNTCA9PSBudWxsID8gdHJ1ZSA6IG91dGVySFRNTDsgLy8gd3JpdGUgc3ZnanMgZGF0YSB0byB0aGUgZG9tXG5cbiAgICAgICAgdGhpcy53cml0ZURhdGFUb0RvbSgpO1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXM7IC8vIEFuIGV4cG9ydCBtb2RpZmllciB3YXMgcGFzc2VkXG5cbiAgICAgICAgaWYgKHN2Z09yRm4gIT0gbnVsbCkge1xuICAgICAgICAgIGN1cnJlbnQgPSBhZG9wdChjdXJyZW50Lm5vZGUuY2xvbmVOb2RlKHRydWUpKTsgLy8gSWYgdGhlIHVzZXIgd2FudHMgb3V0ZXJIVE1MIHdlIG5lZWQgdG8gcHJvY2VzcyB0aGlzIG5vZGUsIHRvb1xuXG4gICAgICAgICAgaWYgKG91dGVySFRNTCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHN2Z09yRm4oY3VycmVudCk7XG4gICAgICAgICAgICBjdXJyZW50ID0gcmVzdWx0IHx8IGN1cnJlbnQ7IC8vIFRoZSB1c2VyIGRvZXMgbm90IHdhbnQgdGhpcyBub2RlPyBXZWxsLCB0aGVuIGhlIGdldHMgbm90aGluZ1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuICcnO1xuICAgICAgICAgIH0gLy8gRGVlcCBsb29wIHRocm91Z2ggYWxsIGNoaWxkcmVuIGFuZCBhcHBseSBtb2RpZmllclxuXG5cbiAgICAgICAgICBjdXJyZW50LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHN2Z09yRm4odGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHJlc3VsdCB8fCB0aGlzOyAvLyBJZiBtb2RpZmllciByZXR1cm5zIGZhbHNlLCBkaXNjYXJkIG5vZGVcblxuXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpOyAvLyBJZiBtb2RpZmllciByZXR1cm5zIG5ldyBub2RlLCB1c2UgaXRcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICYmIHRoaXMgIT09IF90aGlzKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVwbGFjZShfdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH0gLy8gUmV0dXJuIG91dGVyIG9yIGlubmVyIGNvbnRlbnRcblxuXG4gICAgICAgIHJldHVybiBvdXRlckhUTUwgPyBjdXJyZW50Lm5vZGUub3V0ZXJIVE1MIDogY3VycmVudC5ub2RlLmlubmVySFRNTDtcbiAgICAgIH0gLy8gQWN0IGFzIHNldHRlciBpZiB3ZSBnb3QgYSBzdHJpbmdcbiAgICAgIC8vIFRoZSBkZWZhdWx0IGZvciBpbXBvcnQgaXMsIHRoYXQgdGhlIGN1cnJlbnQgbm9kZSBpcyBub3QgcmVwbGFjZWRcblxuXG4gICAgICBvdXRlckhUTUwgPSBvdXRlckhUTUwgPT0gbnVsbCA/IGZhbHNlIDogb3V0ZXJIVE1MOyAvLyBDcmVhdGUgdGVtcG9yYXJ5IGhvbGRlclxuXG4gICAgICB3ZWxsID0gZ2xvYmFscy5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAgIGZyYWdtZW50ID0gZ2xvYmFscy5kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7IC8vIER1bXAgcmF3IHN2Z1xuXG4gICAgICB3ZWxsLmlubmVySFRNTCA9IHN2Z09yRm47IC8vIFRyYW5zcGxhbnQgbm9kZXMgaW50byB0aGUgZnJhZ21lbnRcblxuICAgICAgZm9yIChsZW4gPSB3ZWxsLmNoaWxkcmVuLmxlbmd0aDsgbGVuLS07KSB7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHdlbGwuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQoKTsgLy8gQWRkIHRoZSB3aG9sZSBmcmFnbWVudCBhdCBvbmNlXG5cbiAgICAgIHJldHVybiBvdXRlckhUTUwgPyB0aGlzLnJlcGxhY2UoZnJhZ21lbnQpICYmIHBhcmVudCA6IHRoaXMuYWRkKGZyYWdtZW50KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid29yZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd29yZHModGV4dCkge1xuICAgICAgLy8gVGhpcyBpcyBmYXN0ZXIgdGhhbiByZW1vdmluZyBhbGwgY2hpbGRyZW4gYW5kIGFkZGluZyBhIG5ldyBvbmVcbiAgICAgIHRoaXMubm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIHdyaXRlIHN2Z2pzIGRhdGEgdG8gdGhlIGRvbVxuXG4gIH0sIHtcbiAgICBrZXk6IFwid3JpdGVEYXRhVG9Eb21cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JpdGVEYXRhVG9Eb20oKSB7XG4gICAgICAvLyBkdW1wIHZhcmlhYmxlcyByZWN1cnNpdmVseVxuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy53cml0ZURhdGFUb0RvbSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRG9tO1xufShFdmVudFRhcmdldCk7XG5leHRlbmQoRG9tLCB7XG4gIGF0dHI6IGF0dHIsXG4gIGZpbmQ6IGZpbmQsXG4gIGZpbmRPbmU6IGZpbmRPbmVcbn0pO1xucmVnaXN0ZXIoRG9tLCAnRG9tJyk7XG5cbnZhciBFbGVtZW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRG9tKSB7XG4gIF9pbmhlcml0cyhFbGVtZW50LCBfRG9tKTtcblxuICBmdW5jdGlvbiBFbGVtZW50KG5vZGUsIGF0dHJzKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVsZW1lbnQpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRWxlbWVudCkuY2FsbCh0aGlzLCBub2RlLCBhdHRycykpOyAvLyBpbml0aWFsaXplIGRhdGEgb2JqZWN0XG5cbiAgICBfdGhpcy5kb20gPSB7fTsgLy8gY3JlYXRlIGNpcmN1bGFyIHJlZmVyZW5jZVxuXG4gICAgX3RoaXMubm9kZS5pbnN0YW5jZSA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpO1xuXG4gICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKCdzdmdqczpkYXRhJykpIHtcbiAgICAgIC8vIHB1bGwgc3ZnanMgZGF0YSBmcm9tIHRoZSBkb20gKGdldEF0dHJpYnV0ZU5TIGRvZXNuJ3Qgd29yayBpbiBodG1sNSlcbiAgICAgIF90aGlzLnNldERhdGEoSlNPTi5wYXJzZShub2RlLmdldEF0dHJpYnV0ZSgnc3ZnanM6ZGF0YScpKSB8fCB7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9IC8vIE1vdmUgZWxlbWVudCBieSBpdHMgY2VudGVyXG5cblxuICBfY3JlYXRlQ2xhc3MoRWxlbWVudCwgW3tcbiAgICBrZXk6IFwiY2VudGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNlbnRlcih4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jeCh4KS5jeSh5KTtcbiAgICB9IC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJjeFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjeCh4KSB7XG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy54KCkgKyB0aGlzLndpZHRoKCkgLyAyIDogdGhpcy54KHggLSB0aGlzLndpZHRoKCkgLyAyKTtcbiAgICB9IC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeS1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJjeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjeSh5KSB7XG4gICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy55KCkgKyB0aGlzLmhlaWdodCgpIC8gMiA6IHRoaXMueSh5IC0gdGhpcy5oZWlnaHQoKSAvIDIpO1xuICAgIH0gLy8gR2V0IGRlZnNcblxuICB9LCB7XG4gICAga2V5OiBcImRlZnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVmcygpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvb3QoKS5kZWZzKCk7XG4gICAgfSAvLyBSZWxhdGl2ZSBtb3ZlIG92ZXIgeCBhbmQgeSBheGVzXG5cbiAgfSwge1xuICAgIGtleTogXCJkbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkbW92ZSh4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy5keCh4KS5keSh5KTtcbiAgICB9IC8vIFJlbGF0aXZlIG1vdmUgb3ZlciB4IGF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcImR4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGR4KCkge1xuICAgICAgdmFyIHggPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgICByZXR1cm4gdGhpcy54KG5ldyBTVkdOdW1iZXIoeCkucGx1cyh0aGlzLngoKSkpO1xuICAgIH0gLy8gUmVsYXRpdmUgbW92ZSBvdmVyIHkgYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHkoKSB7XG4gICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICAgIHJldHVybiB0aGlzLnkobmV3IFNWR051bWJlcih5KS5wbHVzKHRoaXMueSgpKSk7XG4gICAgfSAvLyBHZXQgcGFyZW50IGRvY3VtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJyb290XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJvb3QkMSgpIHtcbiAgICAgIHZhciBwID0gdGhpcy5wYXJlbnQoZ2V0Q2xhc3Mocm9vdCkpO1xuICAgICAgcmV0dXJuIHAgJiYgcC5yb290KCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEV2ZW50SG9sZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV2ZW50SG9sZGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImhlaWdodFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoZWlnaHQoX2hlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaGVpZ2h0JywgX2hlaWdodCk7XG4gICAgfSAvLyBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gcG9pbnQgaW5zaWRlIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImluc2lkZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnNpZGUoeCwgeSkge1xuICAgICAgdmFyIGJveCA9IHRoaXMuYmJveCgpO1xuICAgICAgcmV0dXJuIHggPiBib3gueCAmJiB5ID4gYm94LnkgJiYgeCA8IGJveC54ICsgYm94LndpZHRoICYmIHkgPCBib3gueSArIGJveC5oZWlnaHQ7XG4gICAgfSAvLyBNb3ZlIGVsZW1lbnQgdG8gZ2l2ZW4geCBhbmQgeSB2YWx1ZXNcblxuICB9LCB7XG4gICAga2V5OiBcIm1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy54KHgpLnkoeSk7XG4gICAgfSAvLyByZXR1cm4gYXJyYXkgb2YgYWxsIGFuY2VzdG9ycyBvZiBnaXZlbiB0eXBlIHVwIHRvIHRoZSByb290IHN2Z1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicGFyZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJlbnRzKCkge1xuICAgICAgdmFyIHVudGlsID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBnbG9iYWxzLmRvY3VtZW50O1xuICAgICAgdW50aWwgPSBtYWtlSW5zdGFuY2UodW50aWwpO1xuICAgICAgdmFyIHBhcmVudHMgPSBuZXcgTGlzdCgpO1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgICAgIHdoaWxlICgocGFyZW50ID0gcGFyZW50LnBhcmVudCgpKSAmJiBwYXJlbnQubm9kZSAhPT0gdW50aWwubm9kZSAmJiBwYXJlbnQubm9kZSAhPT0gZ2xvYmFscy5kb2N1bWVudCkge1xuICAgICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcmVudHM7XG4gICAgfSAvLyBHZXQgcmVmZXJlbmNlZCBlbGVtZW50IGZvcm0gYXR0cmlidXRlIHZhbHVlXG5cbiAgfSwge1xuICAgIGtleTogXCJyZWZlcmVuY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVmZXJlbmNlJDEoYXR0cikge1xuICAgICAgYXR0ciA9IHRoaXMuYXR0cihhdHRyKTtcbiAgICAgIGlmICghYXR0cikgcmV0dXJuIG51bGw7XG4gICAgICB2YXIgbSA9IGF0dHIubWF0Y2gocmVmZXJlbmNlKTtcbiAgICAgIHJldHVybiBtID8gbWFrZUluc3RhbmNlKG1bMV0pIDogbnVsbDtcbiAgICB9IC8vIHNldCBnaXZlbiBkYXRhIHRvIHRoZSBlbGVtZW50cyBkYXRhIHByb3BlcnR5XG5cbiAgfSwge1xuICAgIGtleTogXCJzZXREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERhdGEobykge1xuICAgICAgdGhpcy5kb20gPSBvO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcblxuICB9LCB7XG4gICAga2V5OiBcInNpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aChuZXcgU1ZHTnVtYmVyKHAud2lkdGgpKS5oZWlnaHQobmV3IFNWR051bWJlcihwLmhlaWdodCkpO1xuICAgIH0gLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcIndpZHRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdpZHRoKF93aWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignd2lkdGgnLCBfd2lkdGgpO1xuICAgIH0gLy8gd3JpdGUgc3ZnanMgZGF0YSB0byB0aGUgZG9tXG5cbiAgfSwge1xuICAgIGtleTogXCJ3cml0ZURhdGFUb0RvbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cml0ZURhdGFUb0RvbSgpIHtcbiAgICAgIC8vIHJlbW92ZSBwcmV2aW91c2x5IHNldCBkYXRhXG4gICAgICB0aGlzLm5vZGUucmVtb3ZlQXR0cmlidXRlKCdzdmdqczpkYXRhJyk7XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRvbSkubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoJ3N2Z2pzOmRhdGEnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmRvbSkpOyAvLyBzZWUgIzQyOFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoRWxlbWVudC5wcm90b3R5cGUpLCBcIndyaXRlRGF0YVRvRG9tXCIsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfSAvLyBNb3ZlIG92ZXIgeC1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHgoX3gpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3gnLCBfeCk7XG4gICAgfSAvLyBNb3ZlIG92ZXIgeS1heGlzXG5cbiAgfSwge1xuICAgIGtleTogXCJ5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHkoX3kpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3knLCBfeSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEVsZW1lbnQ7XG59KERvbSk7XG5leHRlbmQoRWxlbWVudCwge1xuICBiYm94OiBiYm94LFxuICByYm94OiByYm94LFxuICBwb2ludDogcG9pbnQsXG4gIGN0bTogY3RtLFxuICBzY3JlZW5DVE06IHNjcmVlbkNUTVxufSk7XG5yZWdpc3RlcihFbGVtZW50LCAnRWxlbWVudCcpO1xuXG52YXIgc3VnYXIgPSB7XG4gIHN0cm9rZTogWydjb2xvcicsICd3aWR0aCcsICdvcGFjaXR5JywgJ2xpbmVjYXAnLCAnbGluZWpvaW4nLCAnbWl0ZXJsaW1pdCcsICdkYXNoYXJyYXknLCAnZGFzaG9mZnNldCddLFxuICBmaWxsOiBbJ2NvbG9yJywgJ29wYWNpdHknLCAncnVsZSddLFxuICBwcmVmaXg6IGZ1bmN0aW9uIHByZWZpeCh0LCBhKSB7XG4gICAgcmV0dXJuIGEgPT09ICdjb2xvcicgPyB0IDogdCArICctJyArIGE7XG4gIH1cbn0gLy8gQWRkIHN1Z2FyIGZvciBmaWxsIGFuZCBzdHJva2VcbjtcblsnZmlsbCcsICdzdHJva2UnXS5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gIHZhciBleHRlbnNpb24gPSB7fTtcbiAgdmFyIGk7XG5cbiAgZXh0ZW5zaW9uW21dID0gZnVuY3Rpb24gKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKG0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbyA9PT0gJ3N0cmluZycgfHwgbyBpbnN0YW5jZW9mIENvbG9yIHx8IENvbG9yLmlzUmdiKG8pIHx8IG8gaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICB0aGlzLmF0dHIobSwgbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNldCBhbGwgYXR0cmlidXRlcyBmcm9tIHN1Z2FyLmZpbGwgYW5kIHN1Z2FyLnN0cm9rZSBsaXN0XG4gICAgICBmb3IgKGkgPSBzdWdhclttXS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAob1tzdWdhclttXVtpXV0gIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuYXR0cihzdWdhci5wcmVmaXgobSwgc3VnYXJbbV1baV0pLCBvW3N1Z2FyW21dW2ldXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZWdpc3Rlck1ldGhvZHMoWydFbGVtZW50JywgJ1J1bm5lciddLCBleHRlbnNpb24pO1xufSk7XG5yZWdpc3Rlck1ldGhvZHMoWydFbGVtZW50JywgJ1J1bm5lciddLCB7XG4gIC8vIExldCB0aGUgdXNlciBzZXQgdGhlIG1hdHJpeCBkaXJlY3RseVxuICBtYXRyaXg6IGZ1bmN0aW9uIG1hdHJpeChtYXQsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAvLyBBY3QgYXMgYSBnZXR0ZXJcbiAgICBpZiAobWF0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgTWF0cml4KHRoaXMpO1xuICAgIH0gLy8gQWN0IGFzIGEgc2V0dGVyLCB0aGUgdXNlciBjYW4gcGFzcyBhIG1hdHJpeCBvciBhIHNldCBvZiBudW1iZXJzXG5cblxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIG5ldyBNYXRyaXgobWF0LCBiLCBjLCBkLCBlLCBmKSk7XG4gIH0sXG4gIC8vIE1hcCByb3RhdGlvbiB0byB0cmFuc2Zvcm1cbiAgcm90YXRlOiBmdW5jdGlvbiByb3RhdGUoYW5nbGUsIGN4LCBjeSkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7XG4gICAgICByb3RhdGU6IGFuZ2xlLFxuICAgICAgb3g6IGN4LFxuICAgICAgb3k6IGN5XG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIC8vIE1hcCBza2V3IHRvIHRyYW5zZm9ybVxuICBza2V3OiBmdW5jdGlvbiBza2V3KHgsIHksIGN4LCBjeSkge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyB0aGlzLnRyYW5zZm9ybSh7XG4gICAgICBza2V3OiB4LFxuICAgICAgb3g6IHksXG4gICAgICBveTogY3hcbiAgICB9LCB0cnVlKSA6IHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIHNrZXc6IFt4LCB5XSxcbiAgICAgIG94OiBjeCxcbiAgICAgIG95OiBjeVxuICAgIH0sIHRydWUpO1xuICB9LFxuICBzaGVhcjogZnVuY3Rpb24gc2hlYXIobGFtLCBjeCwgY3kpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgc2hlYXI6IGxhbSxcbiAgICAgIG94OiBjeCxcbiAgICAgIG95OiBjeVxuICAgIH0sIHRydWUpO1xuICB9LFxuICAvLyBNYXAgc2NhbGUgdG8gdHJhbnNmb3JtXG4gIHNjYWxlOiBmdW5jdGlvbiBzY2FsZSh4LCB5LCBjeCwgY3kpIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAzID8gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgc2NhbGU6IHgsXG4gICAgICBveDogeSxcbiAgICAgIG95OiBjeFxuICAgIH0sIHRydWUpIDogdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgc2NhbGU6IFt4LCB5XSxcbiAgICAgIG94OiBjeCxcbiAgICAgIG95OiBjeVxuICAgIH0sIHRydWUpO1xuICB9LFxuICAvLyBNYXAgdHJhbnNsYXRlIHRvIHRyYW5zZm9ybVxuICB0cmFuc2xhdGU6IGZ1bmN0aW9uIHRyYW5zbGF0ZSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIHRyYW5zbGF0ZTogW3gsIHldXG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIC8vIE1hcCByZWxhdGl2ZSB0cmFuc2xhdGlvbnMgdG8gdHJhbnNmb3JtXG4gIHJlbGF0aXZlOiBmdW5jdGlvbiByZWxhdGl2ZSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIHJlbGF0aXZlOiBbeCwgeV1cbiAgICB9LCB0cnVlKTtcbiAgfSxcbiAgLy8gTWFwIGZsaXAgdG8gdHJhbnNmb3JtXG4gIGZsaXA6IGZ1bmN0aW9uIGZsaXAoZGlyZWN0aW9uLCBhcm91bmQpIHtcbiAgICB2YXIgZGlyZWN0aW9uU3RyaW5nID0gdHlwZW9mIGRpcmVjdGlvbiA9PT0gJ3N0cmluZycgPyBkaXJlY3Rpb24gOiBpc0Zpbml0ZShkaXJlY3Rpb24pID8gJ2JvdGgnIDogJ2JvdGgnO1xuICAgIHZhciBvcmlnaW4gPSBkaXJlY3Rpb24gPT09ICdib3RoJyAmJiBpc0Zpbml0ZShhcm91bmQpID8gW2Fyb3VuZCwgYXJvdW5kXSA6IGRpcmVjdGlvbiA9PT0gJ3gnID8gW2Fyb3VuZCwgMF0gOiBkaXJlY3Rpb24gPT09ICd5JyA/IFswLCBhcm91bmRdIDogaXNGaW5pdGUoZGlyZWN0aW9uKSA/IFtkaXJlY3Rpb24sIGRpcmVjdGlvbl0gOiBbMCwgMF07XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgIGZsaXA6IGRpcmVjdGlvblN0cmluZyxcbiAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgfSwgdHJ1ZSk7XG4gIH0sXG4gIC8vIE9wYWNpdHlcbiAgb3BhY2l0eTogZnVuY3Rpb24gb3BhY2l0eSh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmF0dHIoJ29wYWNpdHknLCB2YWx1ZSk7XG4gIH1cbn0pO1xucmVnaXN0ZXJNZXRob2RzKCdyYWRpdXMnLCB7XG4gIC8vIEFkZCB4IGFuZCB5IHJhZGl1c1xuICByYWRpdXM6IGZ1bmN0aW9uIHJhZGl1cyh4LCB5KSB7XG4gICAgdmFyIHR5cGUgPSAodGhpcy5fZWxlbWVudCB8fCB0aGlzKS50eXBlO1xuICAgIHJldHVybiB0eXBlID09PSAncmFkaWFsR3JhZGllbnQnIHx8IHR5cGUgPT09ICdyYWRpYWxHcmFkaWVudCcgPyB0aGlzLmF0dHIoJ3InLCBuZXcgU1ZHTnVtYmVyKHgpKSA6IHRoaXMucngoeCkucnkoeSA9PSBudWxsID8geCA6IHkpO1xuICB9XG59KTtcbnJlZ2lzdGVyTWV0aG9kcygnUGF0aCcsIHtcbiAgLy8gR2V0IHBhdGggbGVuZ3RoXG4gIGxlbmd0aDogZnVuY3Rpb24gbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0VG90YWxMZW5ndGgoKTtcbiAgfSxcbiAgLy8gR2V0IHBvaW50IGF0IGxlbmd0aFxuICBwb2ludEF0OiBmdW5jdGlvbiBwb2ludEF0KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5ub2RlLmdldFBvaW50QXRMZW5ndGgobGVuZ3RoKSk7XG4gIH1cbn0pO1xucmVnaXN0ZXJNZXRob2RzKFsnRWxlbWVudCcsICdSdW5uZXInXSwge1xuICAvLyBTZXQgZm9udFxuICBmb250OiBmdW5jdGlvbiBmb250KGEsIHYpIHtcbiAgICBpZiAoX3R5cGVvZihhKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodiBpbiBhKSB7XG4gICAgICAgIHRoaXMuZm9udCh2LCBhW3ZdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgPT09ICdsZWFkaW5nJyA/IHRoaXMubGVhZGluZyh2KSA6IGEgPT09ICdhbmNob3InID8gdGhpcy5hdHRyKCd0ZXh0LWFuY2hvcicsIHYpIDogYSA9PT0gJ3NpemUnIHx8IGEgPT09ICdmYW1pbHknIHx8IGEgPT09ICd3ZWlnaHQnIHx8IGEgPT09ICdzdHJldGNoJyB8fCBhID09PSAndmFyaWFudCcgfHwgYSA9PT0gJ3N0eWxlJyA/IHRoaXMuYXR0cignZm9udC0nICsgYSwgdikgOiB0aGlzLmF0dHIoYSwgdik7XG4gIH1cbn0pO1xucmVnaXN0ZXJNZXRob2RzKCdUZXh0Jywge1xuICBheDogZnVuY3Rpb24gYXgoeCkge1xuICAgIHJldHVybiB0aGlzLmF0dHIoJ3gnLCB4KTtcbiAgfSxcbiAgYXk6IGZ1bmN0aW9uIGF5KHkpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgeSk7XG4gIH0sXG4gIGFtb3ZlOiBmdW5jdGlvbiBhbW92ZSh4LCB5KSB7XG4gICAgcmV0dXJuIHRoaXMuYXgoeCkuYXkoeSk7XG4gIH1cbn0pOyAvLyBBZGQgZXZlbnRzIHRvIGVsZW1lbnRzXG5cbnZhciBtZXRob2RzJDEgPSBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCcsICdtb3VzZW1vdmUnLCAnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJywgJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNobGVhdmUnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnXS5yZWR1Y2UoZnVuY3Rpb24gKGxhc3QsIGV2ZW50KSB7XG4gIC8vIGFkZCBldmVudCB0byBFbGVtZW50XG4gIHZhciBmbiA9IGZ1bmN0aW9uIGZuKGYpIHtcbiAgICBpZiAoZiA9PT0gbnVsbCkge1xuICAgICAgb2ZmKHRoaXMsIGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb24odGhpcywgZXZlbnQsIGYpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGxhc3RbZXZlbnRdID0gZm47XG4gIHJldHVybiBsYXN0O1xufSwge30pO1xucmVnaXN0ZXJNZXRob2RzKCdFbGVtZW50JywgbWV0aG9kcyQxKTtcblxudmFyIG5hdGl2ZVJldmVyc2UgPSBbXS5yZXZlcnNlO1xudmFyIHRlc3QkMSA9IFsxLCAyXTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5yZXZlcnNlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZXZlcnNlXG4vLyBmaXggZm9yIFNhZmFyaSAxMi4wIGJ1Z1xuLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE4ODc5NFxuX2V4cG9ydCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogU3RyaW5nKHRlc3QkMSkgPT09IFN0cmluZyh0ZXN0JDEucmV2ZXJzZSgpKSB9LCB7XG4gIHJldmVyc2U6IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtYXNzaWduXG4gICAgaWYgKGlzQXJyYXkodGhpcykpIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgcmV0dXJuIG5hdGl2ZVJldmVyc2UuY2FsbCh0aGlzKTtcbiAgfVxufSk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydGllc1xuX2V4cG9ydCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogIWRlc2NyaXB0b3JzLCBzaGFtOiAhZGVzY3JpcHRvcnMgfSwge1xuICBkZWZpbmVQcm9wZXJ0aWVzOiBvYmplY3REZWZpbmVQcm9wZXJ0aWVzXG59KTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbl9leHBvcnQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6ICFkZXNjcmlwdG9ycywgc2hhbTogIWRlc2NyaXB0b3JzIH0sIHtcbiAgZGVmaW5lUHJvcGVydHk6IG9iamVjdERlZmluZVByb3BlcnR5LmZcbn0pO1xuXG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJDIgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcblxuXG52YXIgRkFJTFNfT05fUFJJTUlUSVZFUyQyID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMigxKTsgfSk7XG52YXIgRk9SQ0VEJDMgPSAhZGVzY3JpcHRvcnMgfHwgRkFJTFNfT05fUFJJTUlUSVZFUyQyO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQkMywgc2hhbTogIWRlc2NyaXB0b3JzIH0sIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICAgIHJldHVybiBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IkMih0b0luZGV4ZWRPYmplY3QoaXQpLCBrZXkpO1xuICB9XG59KTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JzXG5fZXhwb3J0KHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgc2hhbTogIWRlc2NyaXB0b3JzIH0sIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBvYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IuZjtcbiAgICB2YXIga2V5cyA9IG93bktleXMoTyk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGtleSwgZGVzY3JpcHRvcjtcbiAgICB3aGlsZSAoa2V5cy5sZW5ndGggPiBpbmRleCkge1xuICAgICAgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBrZXkgPSBrZXlzW2luZGV4KytdKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQpIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBvd25LZXlzJDEob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KTsga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpZiAoaSAlIDIpIHsgb3duS2V5cyQxKHNvdXJjZSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzJDEoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiB1bnRyYW5zZm9ybSgpIHtcbiAgcmV0dXJuIHRoaXMuYXR0cigndHJhbnNmb3JtJywgbnVsbCk7XG59IC8vIG1lcmdlIHRoZSB3aG9sZSB0cmFuc2Zvcm1hdGlvbiBjaGFpbiBpbnRvIG9uZSBtYXRyaXggYW5kIHJldHVybnMgaXRcblxuZnVuY3Rpb24gbWF0cml4aWZ5KCkge1xuICB2YXIgbWF0cml4ID0gKHRoaXMuYXR0cigndHJhbnNmb3JtJykgfHwgJycpLiAvLyBzcGxpdCB0cmFuc2Zvcm1hdGlvbnNcbiAgc3BsaXQodHJhbnNmb3Jtcykuc2xpY2UoMCwgLTEpLm1hcChmdW5jdGlvbiAoc3RyKSB7XG4gICAgLy8gZ2VuZXJhdGUga2V5ID0+IHZhbHVlIHBhaXJzXG4gICAgdmFyIGt2ID0gc3RyLnRyaW0oKS5zcGxpdCgnKCcpO1xuICAgIHJldHVybiBba3ZbMF0sIGt2WzFdLnNwbGl0KGRlbGltaXRlcikubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHN0cik7XG4gICAgfSldO1xuICB9KS5yZXZlcnNlKCkgLy8gbWVyZ2UgZXZlcnkgdHJhbnNmb3JtYXRpb24gaW50byBvbmUgbWF0cml4XG4gIC5yZWR1Y2UoZnVuY3Rpb24gKG1hdHJpeCwgdHJhbnNmb3JtKSB7XG4gICAgaWYgKHRyYW5zZm9ybVswXSA9PT0gJ21hdHJpeCcpIHtcbiAgICAgIHJldHVybiBtYXRyaXgubG11bHRpcGx5KE1hdHJpeC5mcm9tQXJyYXkodHJhbnNmb3JtWzFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdHJpeFt0cmFuc2Zvcm1bMF1dLmFwcGx5KG1hdHJpeCwgdHJhbnNmb3JtWzFdKTtcbiAgfSwgbmV3IE1hdHJpeCgpKTtcbiAgcmV0dXJuIG1hdHJpeDtcbn0gLy8gYWRkIGFuIGVsZW1lbnQgdG8gYW5vdGhlciBwYXJlbnQgd2l0aG91dCBjaGFuZ2luZyB0aGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9uIHRoZSBzY3JlZW5cblxuZnVuY3Rpb24gdG9QYXJlbnQocGFyZW50KSB7XG4gIGlmICh0aGlzID09PSBwYXJlbnQpIHJldHVybiB0aGlzO1xuICB2YXIgY3RtID0gdGhpcy5zY3JlZW5DVE0oKTtcbiAgdmFyIHBDdG0gPSBwYXJlbnQuc2NyZWVuQ1RNKCkuaW52ZXJzZSgpO1xuICB0aGlzLmFkZFRvKHBhcmVudCkudW50cmFuc2Zvcm0oKS50cmFuc2Zvcm0ocEN0bS5tdWx0aXBseShjdG0pKTtcbiAgcmV0dXJuIHRoaXM7XG59IC8vIHNhbWUgYXMgYWJvdmUgd2l0aCBwYXJlbnQgZXF1YWxzIHJvb3Qtc3ZnXG5cbmZ1bmN0aW9uIHRvUm9vdCgpIHtcbiAgcmV0dXJuIHRoaXMudG9QYXJlbnQodGhpcy5yb290KCkpO1xufSAvLyBBZGQgdHJhbnNmb3JtYXRpb25zXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybShvLCByZWxhdGl2ZSkge1xuICAvLyBBY3QgYXMgYSBnZXR0ZXIgaWYgbm8gb2JqZWN0IHdhcyBwYXNzZWRcbiAgaWYgKG8gPT0gbnVsbCB8fCB0eXBlb2YgbyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgZGVjb21wb3NlZCA9IG5ldyBNYXRyaXgodGhpcykuZGVjb21wb3NlKCk7XG4gICAgcmV0dXJuIG8gPT0gbnVsbCA/IGRlY29tcG9zZWQgOiBkZWNvbXBvc2VkW29dO1xuICB9XG5cbiAgaWYgKCFNYXRyaXguaXNNYXRyaXhMaWtlKG8pKSB7XG4gICAgLy8gU2V0IHRoZSBvcmlnaW4gYWNjb3JkaW5nIHRvIHRoZSBkZWZpbmVkIHRyYW5zZm9ybVxuICAgIG8gPSBfb2JqZWN0U3ByZWFkKHt9LCBvLCB7XG4gICAgICBvcmlnaW46IGdldE9yaWdpbihvLCB0aGlzKVxuICAgIH0pO1xuICB9IC8vIFRoZSB1c2VyIGNhbiBwYXNzIGEgYm9vbGVhbiwgYW4gRWxlbWVudCBvciBhbiBNYXRyaXggb3Igbm90aGluZ1xuXG5cbiAgdmFyIGNsZWFuUmVsYXRpdmUgPSByZWxhdGl2ZSA9PT0gdHJ1ZSA/IHRoaXMgOiByZWxhdGl2ZSB8fCBmYWxzZTtcbiAgdmFyIHJlc3VsdCA9IG5ldyBNYXRyaXgoY2xlYW5SZWxhdGl2ZSkudHJhbnNmb3JtKG8pO1xuICByZXR1cm4gdGhpcy5hdHRyKCd0cmFuc2Zvcm0nLCByZXN1bHQpO1xufVxucmVnaXN0ZXJNZXRob2RzKCdFbGVtZW50Jywge1xuICB1bnRyYW5zZm9ybTogdW50cmFuc2Zvcm0sXG4gIG1hdHJpeGlmeTogbWF0cml4aWZ5LFxuICB0b1BhcmVudDogdG9QYXJlbnQsXG4gIHRvUm9vdDogdG9Sb290LFxuICB0cmFuc2Zvcm06IHRyYW5zZm9ybVxufSk7XG5cbmZ1bmN0aW9uIHJ4KHJ4KSB7XG4gIHJldHVybiB0aGlzLmF0dHIoJ3J4JywgcngpO1xufSAvLyBSYWRpdXMgeSB2YWx1ZVxuXG5mdW5jdGlvbiByeShyeSkge1xuICByZXR1cm4gdGhpcy5hdHRyKCdyeScsIHJ5KTtcbn0gLy8gTW92ZSBvdmVyIHgtYXhpc1xuXG5mdW5jdGlvbiB4KHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuY3goKSAtIHRoaXMucngoKSA6IHRoaXMuY3goeCArIHRoaXMucngoKSk7XG59IC8vIE1vdmUgb3ZlciB5LWF4aXNcblxuZnVuY3Rpb24geSh5KSB7XG4gIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmN5KCkgLSB0aGlzLnJ5KCkgOiB0aGlzLmN5KHkgKyB0aGlzLnJ5KCkpO1xufSAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHgtYXhpc1xuXG5mdW5jdGlvbiBjeCh4KSB7XG4gIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmF0dHIoJ2N4JykgOiB0aGlzLmF0dHIoJ2N4JywgeCk7XG59IC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeS1heGlzXG5cbmZ1bmN0aW9uIGN5KHkpIHtcbiAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYXR0cignY3knKSA6IHRoaXMuYXR0cignY3knLCB5KTtcbn0gLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcblxuZnVuY3Rpb24gd2lkdGgod2lkdGgpIHtcbiAgcmV0dXJuIHdpZHRoID09IG51bGwgPyB0aGlzLnJ4KCkgKiAyIDogdGhpcy5yeChuZXcgU1ZHTnVtYmVyKHdpZHRoKS5kaXZpZGUoMikpO1xufSAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcblxuZnVuY3Rpb24gaGVpZ2h0KGhlaWdodCkge1xuICByZXR1cm4gaGVpZ2h0ID09IG51bGwgPyB0aGlzLnJ5KCkgKiAyIDogdGhpcy5yeShuZXcgU1ZHTnVtYmVyKGhlaWdodCkuZGl2aWRlKDIpKTtcbn1cblxudmFyIGNpcmNsZWQgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdHJ4OiByeCxcblx0cnk6IHJ5LFxuXHR4OiB4LFxuXHR5OiB5LFxuXHRjeDogY3gsXG5cdGN5OiBjeSxcblx0d2lkdGg6IHdpZHRoLFxuXHRoZWlnaHQ6IGhlaWdodFxufSk7XG5cbnZhciBTaGFwZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0VsZW1lbnQpIHtcbiAgX2luaGVyaXRzKFNoYXBlLCBfRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gU2hhcGUoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNoYXBlKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoU2hhcGUpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIFNoYXBlO1xufShFbGVtZW50KTtcbnJlZ2lzdGVyKFNoYXBlLCAnU2hhcGUnKTtcblxudmFyIENpcmNsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhDaXJjbGUsIF9TaGFwZSk7XG5cbiAgZnVuY3Rpb24gQ2lyY2xlKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2lyY2xlKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoQ2lyY2xlKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnY2lyY2xlJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDaXJjbGUsIFt7XG4gICAga2V5OiBcInJhZGl1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByYWRpdXMocikge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigncicsIHIpO1xuICAgIH0gLy8gUmFkaXVzIHggdmFsdWVcblxuICB9LCB7XG4gICAga2V5OiBcInJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJ4KF9yeCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigncicsIF9yeCk7XG4gICAgfSAvLyBBbGlhcyByYWRpdXMgeCB2YWx1ZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwicnlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcnkoX3J5KSB7XG4gICAgICByZXR1cm4gdGhpcy5yeChfcnkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzaXplXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNpemUoX3NpemUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhZGl1cyhuZXcgU1ZHTnVtYmVyKF9zaXplKS5kaXZpZGUoMikpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDaXJjbGU7XG59KFNoYXBlKTtcbmV4dGVuZChDaXJjbGUsIHtcbiAgeDogeCxcbiAgeTogeSxcbiAgY3g6IGN4LFxuICBjeTogY3ksXG4gIHdpZHRoOiB3aWR0aCxcbiAgaGVpZ2h0OiBoZWlnaHRcbn0pO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGNpcmNsZSBlbGVtZW50XG4gICAgY2lyY2xlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoc2l6ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBDaXJjbGUoKSkuc2l6ZShzaXplKS5tb3ZlKDAsIDApO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoQ2lyY2xlLCAnQ2lyY2xlJyk7XG5cbnZhciBDb250YWluZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FbGVtZW50KSB7XG4gIF9pbmhlcml0cyhDb250YWluZXIsIF9FbGVtZW50KTtcblxuICBmdW5jdGlvbiBDb250YWluZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbnRhaW5lcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKENvbnRhaW5lcikuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29udGFpbmVyLCBbe1xuICAgIGtleTogXCJmbGF0dGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZsYXR0ZW4ocGFyZW50KSB7XG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIENvbnRhaW5lcikgcmV0dXJuIHRoaXMuZmxhdHRlbihwYXJlbnQpLnVuZ3JvdXAocGFyZW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9QYXJlbnQocGFyZW50KTtcbiAgICAgIH0pOyAvLyB3ZSBuZWVkIHRoaXMgc28gdGhhdCB0aGUgcm9vdCBkb2VzIG5vdCBnZXQgcmVtb3ZlZFxuXG4gICAgICB0aGlzLm5vZGUuZmlyc3RFbGVtZW50Q2hpbGQgfHwgdGhpcy5yZW1vdmUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1bmdyb3VwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVuZ3JvdXAocGFyZW50KSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQgfHwgdGhpcy5wYXJlbnQoKTtcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvUGFyZW50KHBhcmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29udGFpbmVyO1xufShFbGVtZW50KTtcbnJlZ2lzdGVyKENvbnRhaW5lciwgJ0NvbnRhaW5lcicpO1xuXG52YXIgRGVmcyA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoRGVmcywgX0NvbnRhaW5lcik7XG5cbiAgZnVuY3Rpb24gRGVmcyhub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERlZnMpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihEZWZzKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnZGVmcycsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRGVmcywgW3tcbiAgICBrZXk6IFwiZmxhdHRlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmbGF0dGVuKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVuZ3JvdXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5ncm91cCgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEZWZzO1xufShDb250YWluZXIpO1xucmVnaXN0ZXIoRGVmcywgJ0RlZnMnKTtcblxudmFyIEVsbGlwc2UgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoRWxsaXBzZSwgX1NoYXBlKTtcblxuICBmdW5jdGlvbiBFbGxpcHNlKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRWxsaXBzZSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEVsbGlwc2UpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdlbGxpcHNlJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhFbGxpcHNlLCBbe1xuICAgIGtleTogXCJzaXplXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgcmV0dXJuIHRoaXMucngobmV3IFNWR051bWJlcihwLndpZHRoKS5kaXZpZGUoMikpLnJ5KG5ldyBTVkdOdW1iZXIocC5oZWlnaHQpLmRpdmlkZSgyKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEVsbGlwc2U7XG59KFNoYXBlKTtcbmV4dGVuZChFbGxpcHNlLCBjaXJjbGVkKTtcbnJlZ2lzdGVyTWV0aG9kcygnQ29udGFpbmVyJywge1xuICAvLyBDcmVhdGUgYW4gZWxsaXBzZVxuICBlbGxpcHNlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdpZHRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgIHZhciBoZWlnaHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHdpZHRoO1xuICAgIHJldHVybiB0aGlzLnB1dChuZXcgRWxsaXBzZSgpKS5zaXplKHdpZHRoLCBoZWlnaHQpLm1vdmUoMCwgMCk7XG4gIH0pXG59KTtcbnJlZ2lzdGVyKEVsbGlwc2UsICdFbGxpcHNlJyk7XG5cbnZhciBTdG9wID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRWxlbWVudCkge1xuICBfaW5oZXJpdHMoU3RvcCwgX0VsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIFN0b3Aobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdG9wKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoU3RvcCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3N0b3AnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIGFkZCBjb2xvciBzdG9wc1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFN0b3AsIFt7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUobykge1xuICAgICAgaWYgKHR5cGVvZiBvID09PSAnbnVtYmVyJyB8fCBvIGluc3RhbmNlb2YgU1ZHTnVtYmVyKSB7XG4gICAgICAgIG8gPSB7XG4gICAgICAgICAgb2Zmc2V0OiBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgY29sb3I6IGFyZ3VtZW50c1sxXSxcbiAgICAgICAgICBvcGFjaXR5OiBhcmd1bWVudHNbMl1cbiAgICAgICAgfTtcbiAgICAgIH0gLy8gc2V0IGF0dHJpYnV0ZXNcblxuXG4gICAgICBpZiAoby5vcGFjaXR5ICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1vcGFjaXR5Jywgby5vcGFjaXR5KTtcbiAgICAgIGlmIChvLmNvbG9yICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1jb2xvcicsIG8uY29sb3IpO1xuICAgICAgaWYgKG8ub2Zmc2V0ICE9IG51bGwpIHRoaXMuYXR0cignb2Zmc2V0JywgbmV3IFNWR051bWJlcihvLm9mZnNldCkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0b3A7XG59KEVsZW1lbnQpO1xucmVnaXN0ZXIoU3RvcCwgJ1N0b3AnKTtcblxuZnVuY3Rpb24gZnJvbSh4LCB5KSB7XG4gIHJldHVybiAodGhpcy5fZWxlbWVudCB8fCB0aGlzKS50eXBlID09PSAncmFkaWFsR3JhZGllbnQnID8gdGhpcy5hdHRyKHtcbiAgICBmeDogbmV3IFNWR051bWJlcih4KSxcbiAgICBmeTogbmV3IFNWR051bWJlcih5KVxuICB9KSA6IHRoaXMuYXR0cih7XG4gICAgeDE6IG5ldyBTVkdOdW1iZXIoeCksXG4gICAgeTE6IG5ldyBTVkdOdW1iZXIoeSlcbiAgfSk7XG59XG5mdW5jdGlvbiB0byh4LCB5KSB7XG4gIHJldHVybiAodGhpcy5fZWxlbWVudCB8fCB0aGlzKS50eXBlID09PSAncmFkaWFsR3JhZGllbnQnID8gdGhpcy5hdHRyKHtcbiAgICBjeDogbmV3IFNWR051bWJlcih4KSxcbiAgICBjeTogbmV3IFNWR051bWJlcih5KVxuICB9KSA6IHRoaXMuYXR0cih7XG4gICAgeDI6IG5ldyBTVkdOdW1iZXIoeCksXG4gICAgeTI6IG5ldyBTVkdOdW1iZXIoeSlcbiAgfSk7XG59XG5cbnZhciBncmFkaWVudGVkID0gKHtcblx0X19wcm90b19fOiBudWxsLFxuXHRmcm9tOiBmcm9tLFxuXHR0bzogdG9cbn0pO1xuXG52YXIgR3JhZGllbnQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db250YWluZXIpIHtcbiAgX2luaGVyaXRzKEdyYWRpZW50LCBfQ29udGFpbmVyKTtcblxuICBmdW5jdGlvbiBHcmFkaWVudCh0eXBlLCBhdHRycykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHcmFkaWVudCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEdyYWRpZW50KS5jYWxsKHRoaXMsIG5vZGVPck5ldyh0eXBlICsgJ0dyYWRpZW50JywgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gbnVsbCA6IHR5cGUpLCBhdHRycykpO1xuICB9IC8vIEFkZCBhIGNvbG9yIHN0b3BcblxuXG4gIF9jcmVhdGVDbGFzcyhHcmFkaWVudCwgW3tcbiAgICBrZXk6IFwic3RvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKG9mZnNldCwgY29sb3IsIG9wYWNpdHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU3RvcCgpKS51cGRhdGUob2Zmc2V0LCBjb2xvciwgb3BhY2l0eSk7XG4gICAgfSAvLyBVcGRhdGUgZ3JhZGllbnRcblxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoYmxvY2spIHtcbiAgICAgIC8vIHJlbW92ZSBhbGwgc3RvcHNcbiAgICAgIHRoaXMuY2xlYXIoKTsgLy8gaW52b2tlIHBhc3NlZCBibG9ja1xuXG4gICAgICBpZiAodHlwZW9mIGJsb2NrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGJsb2NrLmNhbGwodGhpcywgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmV0dXJuIHRoZSBmaWxsIGlkXG5cbiAgfSwge1xuICAgIGtleTogXCJ1cmxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXJsKCkge1xuICAgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmlkKCkgKyAnKSc7XG4gICAgfSAvLyBBbGlhcyBzdHJpbmcgY29udmVydGlvbiB0byBmaWxsXG5cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnVybCgpO1xuICAgIH0gLy8gY3VzdG9tIGF0dHIgdG8gaGFuZGxlIHRyYW5zZm9ybVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiYXR0clwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRyKGEsIGIsIGMpIHtcbiAgICAgIGlmIChhID09PSAndHJhbnNmb3JtJykgYSA9ICdncmFkaWVudFRyYW5zZm9ybSc7XG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoR3JhZGllbnQucHJvdG90eXBlKSwgXCJhdHRyXCIsIHRoaXMpLmNhbGwodGhpcywgYSwgYiwgYyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRhcmdldHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiBiYXNlRmluZCgnc3ZnIFtmaWxsKj1cIicgKyB0aGlzLmlkKCkgKyAnXCJdJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImJib3hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYmJveCgpIHtcbiAgICAgIHJldHVybiBuZXcgQm94KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEdyYWRpZW50O1xufShDb250YWluZXIpO1xuZXh0ZW5kKEdyYWRpZW50LCBncmFkaWVudGVkKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBncmFkaWVudCBlbGVtZW50IGluIGRlZnNcbiAgICBncmFkaWVudDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHR5cGUsIGJsb2NrKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZzKCkuZ3JhZGllbnQodHlwZSwgYmxvY2spO1xuICAgIH0pXG4gIH0sXG4gIC8vIGRlZmluZSBncmFkaWVudFxuICBEZWZzOiB7XG4gICAgZ3JhZGllbnQ6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh0eXBlLCBibG9jaykge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBHcmFkaWVudCh0eXBlKSkudXBkYXRlKGJsb2NrKTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKEdyYWRpZW50LCAnR3JhZGllbnQnKTtcblxudmFyIFBhdHRlcm4gPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db250YWluZXIpIHtcbiAgX2luaGVyaXRzKFBhdHRlcm4sIF9Db250YWluZXIpO1xuXG4gIC8vIEluaXRpYWxpemUgbm9kZVxuICBmdW5jdGlvbiBQYXR0ZXJuKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGF0dGVybik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFBhdHRlcm4pLmNhbGwodGhpcywgbm9kZU9yTmV3KCdwYXR0ZXJuJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBSZXR1cm4gdGhlIGZpbGwgaWRcblxuXG4gIF9jcmVhdGVDbGFzcyhQYXR0ZXJuLCBbe1xuICAgIGtleTogXCJ1cmxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXJsKCkge1xuICAgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmlkKCkgKyAnKSc7XG4gICAgfSAvLyBVcGRhdGUgcGF0dGVybiBieSByZWJ1aWxkaW5nXG5cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKGJsb2NrKSB7XG4gICAgICAvLyByZW1vdmUgY29udGVudFxuICAgICAgdGhpcy5jbGVhcigpOyAvLyBpbnZva2UgcGFzc2VkIGJsb2NrXG5cbiAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBBbGlhcyBzdHJpbmcgY29udmVydGlvbiB0byBmaWxsXG5cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnVybCgpO1xuICAgIH0gLy8gY3VzdG9tIGF0dHIgdG8gaGFuZGxlIHRyYW5zZm9ybVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiYXR0clwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRyKGEsIGIsIGMpIHtcbiAgICAgIGlmIChhID09PSAndHJhbnNmb3JtJykgYSA9ICdwYXR0ZXJuVHJhbnNmb3JtJztcbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihQYXR0ZXJuLnByb3RvdHlwZSksIFwiYXR0clwiLCB0aGlzKS5jYWxsKHRoaXMsIGEsIGIsIGMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRhcmdldHMoKSB7XG4gICAgICByZXR1cm4gYmFzZUZpbmQoJ3N2ZyBbZmlsbCo9XCInICsgdGhpcy5pZCgpICsgJ1wiXScpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJiYm94XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGJib3goKSB7XG4gICAgICByZXR1cm4gbmV3IEJveCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQYXR0ZXJuO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIHBhdHRlcm4gZWxlbWVudCBpbiBkZWZzXG4gICAgcGF0dGVybjogZnVuY3Rpb24gcGF0dGVybigpIHtcbiAgICAgIHZhciBfdGhpcyRkZWZzO1xuXG4gICAgICByZXR1cm4gKF90aGlzJGRlZnMgPSB0aGlzLmRlZnMoKSkucGF0dGVybi5hcHBseShfdGhpcyRkZWZzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgRGVmczoge1xuICAgIHBhdHRlcm46IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBibG9jaykge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBQYXR0ZXJuKCkpLnVwZGF0ZShibG9jaykuYXR0cih7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHBhdHRlcm5Vbml0czogJ3VzZXJTcGFjZU9uVXNlJ1xuICAgICAgfSk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihQYXR0ZXJuLCAnUGF0dGVybicpO1xuXG52YXIgSW1hZ2UgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoSW1hZ2UsIF9TaGFwZSk7XG5cbiAgZnVuY3Rpb24gSW1hZ2Uobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBJbWFnZSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEltYWdlKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnaW1hZ2UnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIChyZSlsb2FkIGltYWdlXG5cblxuICBfY3JlYXRlQ2xhc3MoSW1hZ2UsIFt7XG4gICAga2V5OiBcImxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZCh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoIXVybCkgcmV0dXJuIHRoaXM7XG4gICAgICB2YXIgaW1nID0gbmV3IGdsb2JhbHMud2luZG93LkltYWdlKCk7XG4gICAgICBvbihpbWcsICdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudChQYXR0ZXJuKTsgLy8gZW5zdXJlIGltYWdlIHNpemVcblxuICAgICAgICBpZiAodGhpcy53aWR0aCgpID09PSAwICYmIHRoaXMuaGVpZ2h0KCkgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnNpemUoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwIGluc3RhbmNlb2YgUGF0dGVybikge1xuICAgICAgICAgIC8vIGVuc3VyZSBwYXR0ZXJuIHNpemUgaWYgbm90IHNldFxuICAgICAgICAgIGlmIChwLndpZHRoKCkgPT09IDAgJiYgcC5oZWlnaHQoKSA9PT0gMCkge1xuICAgICAgICAgICAgcC5zaXplKHRoaXMud2lkdGgoKSwgdGhpcy5oZWlnaHQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgICAgb24oaW1nLCAnbG9hZCBlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZG9udCBmb3JnZXQgdG8gdW5iaW5kIG1lbW9yeSBsZWFraW5nIGV2ZW50c1xuICAgICAgICBvZmYoaW1nKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaHJlZicsIGltZy5zcmMgPSB1cmwsIHhsaW5rKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSW1hZ2U7XG59KFNoYXBlKTtcbnJlZ2lzdGVyQXR0ckhvb2soZnVuY3Rpb24gKGF0dHIsIHZhbCwgX3RoaXMpIHtcbiAgLy8gY29udmVydCBpbWFnZSBmaWxsIGFuZCBzdHJva2UgdG8gcGF0dGVybnNcbiAgaWYgKGF0dHIgPT09ICdmaWxsJyB8fCBhdHRyID09PSAnc3Ryb2tlJykge1xuICAgIGlmIChpc0ltYWdlLnRlc3QodmFsKSkge1xuICAgICAgdmFsID0gX3RoaXMucm9vdCgpLmRlZnMoKS5pbWFnZSh2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh2YWwgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIHZhbCA9IF90aGlzLnJvb3QoKS5kZWZzKCkucGF0dGVybigwLCAwLCBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgcGF0dGVybi5hZGQodmFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59KTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIGNyZWF0ZSBpbWFnZSBlbGVtZW50LCBsb2FkIGltYWdlIGFuZCBzZXQgaXRzIHNpemVcbiAgICBpbWFnZTogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgSW1hZ2UoKSkuc2l6ZSgwLCAwKS5sb2FkKHNvdXJjZSwgY2FsbGJhY2spO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoSW1hZ2UsICdJbWFnZScpO1xuXG52YXIgUG9pbnRBcnJheSA9IHN1YkNsYXNzQXJyYXkoJ1BvaW50QXJyYXknLCBTVkdBcnJheSk7XG5leHRlbmQoUG9pbnRBcnJheSwge1xuICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgLy8gY29udmVydCB0byBhIHBvbHkgcG9pbnQgc3RyaW5nXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5sZW5ndGgsIGFycmF5ID0gW107IGkgPCBpbDsgaSsrKSB7XG4gICAgICBhcnJheS5wdXNoKHRoaXNbaV0uam9pbignLCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXkuam9pbignICcpO1xuICB9LFxuICAvLyBDb252ZXJ0IGFycmF5IHRvIGxpbmUgb2JqZWN0XG4gIHRvTGluZTogZnVuY3Rpb24gdG9MaW5lKCkge1xuICAgIHJldHVybiB7XG4gICAgICB4MTogdGhpc1swXVswXSxcbiAgICAgIHkxOiB0aGlzWzBdWzFdLFxuICAgICAgeDI6IHRoaXNbMV1bMF0sXG4gICAgICB5MjogdGhpc1sxXVsxXVxuICAgIH07XG4gIH0sXG4gIC8vIEdldCBtb3JwaGVkIGFycmF5IGF0IGdpdmVuIHBvc2l0aW9uXG4gIGF0OiBmdW5jdGlvbiBhdChwb3MpIHtcbiAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXG4gICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpczsgLy8gZ2VuZXJhdGUgbW9ycGhlZCBwb2ludCBzdHJpbmdcblxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKykge1xuICAgICAgYXJyYXkucHVzaChbdGhpc1tpXVswXSArICh0aGlzLmRlc3RpbmF0aW9uW2ldWzBdIC0gdGhpc1tpXVswXSkgKiBwb3MsIHRoaXNbaV1bMV0gKyAodGhpcy5kZXN0aW5hdGlvbltpXVsxXSAtIHRoaXNbaV1bMV0pICogcG9zXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQb2ludEFycmF5KGFycmF5KTtcbiAgfSxcbiAgLy8gUGFyc2UgcG9pbnQgc3RyaW5nIGFuZCBmbGF0IGFycmF5XG4gIHBhcnNlOiBmdW5jdGlvbiBwYXJzZSgpIHtcbiAgICB2YXIgYXJyYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtbMCwgMF1dO1xuICAgIHZhciBwb2ludHMgPSBbXTsgLy8gaWYgaXQgaXMgYW4gYXJyYXlcblxuICAgIGlmIChhcnJheSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAvLyBhbmQgaXQgaXMgbm90IGZsYXQsIHRoZXJlIGlzIG5vIG5lZWQgdG8gcGFyc2UgaXRcbiAgICAgIGlmIChhcnJheVswXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRWxzZSwgaXQgaXMgY29uc2lkZXJlZCBhcyBhIHN0cmluZ1xuICAgICAgLy8gcGFyc2UgcG9pbnRzXG4gICAgICBhcnJheSA9IGFycmF5LnRyaW0oKS5zcGxpdChkZWxpbWl0ZXIpLm1hcChwYXJzZUZsb2F0KTtcbiAgICB9IC8vIHZhbGlkYXRlIHBvaW50cyAtIGh0dHBzOi8vc3Znd2cub3JnL3N2ZzItZHJhZnQvc2hhcGVzLmh0bWwjRGF0YVR5cGVQb2ludHNcbiAgICAvLyBPZGQgbnVtYmVyIG9mIGNvb3JkaW5hdGVzIGlzIGFuIGVycm9yLiBJbiBzdWNoIGNhc2VzLCBkcm9wIHRoZSBsYXN0IG9kZCBjb29yZGluYXRlLlxuXG5cbiAgICBpZiAoYXJyYXkubGVuZ3RoICUgMiAhPT0gMCkgYXJyYXkucG9wKCk7IC8vIHdyYXAgcG9pbnRzIGluIHR3by10dXBsZXNcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkgPSBpICsgMikge1xuICAgICAgcG9pbnRzLnB1c2goW2FycmF5W2ldLCBhcnJheVtpICsgMV1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9LFxuICAvLyB0cmFuc2Zvcm0gcG9pbnRzIHdpdGggbWF0cml4IChzaW1pbGFyIHRvIFBvaW50LnRyYW5zZm9ybSlcbiAgdHJhbnNmb3JtOiBmdW5jdGlvbiB0cmFuc2Zvcm0obSkge1xuICAgIHZhciBwb2ludHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBvaW50ID0gdGhpc1tpXTsgLy8gUGVyZm9ybSB0aGUgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgICAgIHBvaW50cy5wdXNoKFttLmEgKiBwb2ludFswXSArIG0uYyAqIHBvaW50WzFdICsgbS5lLCBtLmIgKiBwb2ludFswXSArIG0uZCAqIHBvaW50WzFdICsgbS5mXSk7XG4gICAgfSAvLyBSZXR1cm4gdGhlIHJlcXVpcmVkIHBvaW50XG5cblxuICAgIHJldHVybiBuZXcgUG9pbnRBcnJheShwb2ludHMpO1xuICB9LFxuICAvLyBNb3ZlIHBvaW50IHN0cmluZ1xuICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgICB2YXIgYm94ID0gdGhpcy5iYm94KCk7IC8vIGdldCByZWxhdGl2ZSBvZmZzZXRcblxuICAgIHggLT0gYm94Lng7XG4gICAgeSAtPSBib3gueTsgLy8gbW92ZSBldmVyeSBwb2ludFxuXG4gICAgaWYgKCFpc05hTih4KSAmJiAhaXNOYU4oeSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHRoaXNbaV0gPSBbdGhpc1tpXVswXSArIHgsIHRoaXNbaV1bMV0gKyB5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gUmVzaXplIHBvbHkgc3RyaW5nXG4gIHNpemU6IGZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHZhciBpO1xuICAgIHZhciBib3ggPSB0aGlzLmJib3goKTsgLy8gcmVjYWxjdWxhdGUgcG9zaXRpb24gb2YgYWxsIHBvaW50cyBhY2NvcmRpbmcgdG8gbmV3IHNpemVcblxuICAgIGZvciAoaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChib3gud2lkdGgpIHRoaXNbaV1bMF0gPSAodGhpc1tpXVswXSAtIGJveC54KSAqIHdpZHRoIC8gYm94LndpZHRoICsgYm94Lng7XG4gICAgICBpZiAoYm94LmhlaWdodCkgdGhpc1tpXVsxXSA9ICh0aGlzW2ldWzFdIC0gYm94LnkpICogaGVpZ2h0IC8gYm94LmhlaWdodCArIGJveC55O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBHZXQgYm91bmRpbmcgYm94IG9mIHBvaW50c1xuICBiYm94OiBmdW5jdGlvbiBiYm94KCkge1xuICAgIHZhciBtYXhYID0gLUluZmluaXR5O1xuICAgIHZhciBtYXhZID0gLUluZmluaXR5O1xuICAgIHZhciBtaW5YID0gSW5maW5pdHk7XG4gICAgdmFyIG1pblkgPSBJbmZpbml0eTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBtYXhYID0gTWF0aC5tYXgoZWxbMF0sIG1heFgpO1xuICAgICAgbWF4WSA9IE1hdGgubWF4KGVsWzFdLCBtYXhZKTtcbiAgICAgIG1pblggPSBNYXRoLm1pbihlbFswXSwgbWluWCk7XG4gICAgICBtaW5ZID0gTWF0aC5taW4oZWxbMV0sIG1pblkpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtaW5YLFxuICAgICAgeTogbWluWSxcbiAgICAgIHdpZHRoOiBtYXhYIC0gbWluWCxcbiAgICAgIGhlaWdodDogbWF4WSAtIG1pbllcbiAgICB9O1xuICB9XG59KTtcblxudmFyIE1vcnBoQXJyYXkgPSBQb2ludEFycmF5OyAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHgtYXhpc1xuXG5mdW5jdGlvbiB4JDEoeCkge1xuICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5iYm94KCkueCA6IHRoaXMubW92ZSh4LCB0aGlzLmJib3goKS55KTtcbn0gLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB5LWF4aXNcblxuZnVuY3Rpb24geSQxKHkpIHtcbiAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYmJveCgpLnkgOiB0aGlzLm1vdmUodGhpcy5iYm94KCkueCwgeSk7XG59IC8vIFNldCB3aWR0aCBvZiBlbGVtZW50XG5cbmZ1bmN0aW9uIHdpZHRoJDEod2lkdGgpIHtcbiAgdmFyIGIgPSB0aGlzLmJib3goKTtcbiAgcmV0dXJuIHdpZHRoID09IG51bGwgPyBiLndpZHRoIDogdGhpcy5zaXplKHdpZHRoLCBiLmhlaWdodCk7XG59IC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxuXG5mdW5jdGlvbiBoZWlnaHQkMShoZWlnaHQpIHtcbiAgdmFyIGIgPSB0aGlzLmJib3goKTtcbiAgcmV0dXJuIGhlaWdodCA9PSBudWxsID8gYi5oZWlnaHQgOiB0aGlzLnNpemUoYi53aWR0aCwgaGVpZ2h0KTtcbn1cblxudmFyIHBvaW50ZWQgPSAoe1xuXHRfX3Byb3RvX186IG51bGwsXG5cdE1vcnBoQXJyYXk6IE1vcnBoQXJyYXksXG5cdHg6IHgkMSxcblx0eTogeSQxLFxuXHR3aWR0aDogd2lkdGgkMSxcblx0aGVpZ2h0OiBoZWlnaHQkMVxufSk7XG5cbnZhciBMaW5lID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKExpbmUsIF9TaGFwZSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIExpbmUobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBMaW5lKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoTGluZSkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ2xpbmUnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIEdldCBhcnJheVxuXG5cbiAgX2NyZWF0ZUNsYXNzKExpbmUsIFt7XG4gICAga2V5OiBcImFycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFycmF5KCkge1xuICAgICAgcmV0dXJuIG5ldyBQb2ludEFycmF5KFtbdGhpcy5hdHRyKCd4MScpLCB0aGlzLmF0dHIoJ3kxJyldLCBbdGhpcy5hdHRyKCd4MicpLCB0aGlzLmF0dHIoJ3kyJyldXSk7XG4gICAgfSAvLyBPdmVyd3JpdGUgbmF0aXZlIHBsb3QoKSBtZXRob2RcblxuICB9LCB7XG4gICAga2V5OiBcInBsb3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGxvdCh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgaWYgKHgxID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHkxICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB4MSA9IHtcbiAgICAgICAgICB4MTogeDEsXG4gICAgICAgICAgeTE6IHkxLFxuICAgICAgICAgIHgyOiB4MixcbiAgICAgICAgICB5MjogeTJcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHgxID0gbmV3IFBvaW50QXJyYXkoeDEpLnRvTGluZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHgxKTtcbiAgICB9IC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyXG5cbiAgfSwge1xuICAgIGtleTogXCJtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cih0aGlzLmFycmF5KCkubW92ZSh4LCB5KS50b0xpbmUoKSk7XG4gICAgfSAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcblxuICB9LCB7XG4gICAga2V5OiBcInNpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHRoaXMuYXJyYXkoKS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KS50b0xpbmUoKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIExpbmU7XG59KFNoYXBlKTtcbmV4dGVuZChMaW5lLCBwb2ludGVkKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIGxpbmUgZWxlbWVudFxuICAgIGxpbmU6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICAvLyBtYWtlIHN1cmUgcGxvdCBpcyBjYWxsZWQgYXMgYSBzZXR0ZXJcbiAgICAgIC8vIHgxIGlzIG5vdCBuZWNlc3NhcmlseSBhIG51bWJlciwgaXQgY2FuIGFsc28gYmUgYW4gYXJyYXksIGEgc3RyaW5nIGFuZCBhIFBvaW50QXJyYXlcbiAgICAgIHJldHVybiBMaW5lLnByb3RvdHlwZS5wbG90LmFwcGx5KHRoaXMucHV0KG5ldyBMaW5lKCkpLCBhcmdzWzBdICE9IG51bGwgPyBhcmdzIDogWzAsIDAsIDAsIDBdKTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKExpbmUsICdMaW5lJyk7XG5cbnZhciBNYXJrZXIgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db250YWluZXIpIHtcbiAgX2luaGVyaXRzKE1hcmtlciwgX0NvbnRhaW5lcik7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIE1hcmtlcihub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1hcmtlcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKE1hcmtlcikuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ21hcmtlcicsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcblxuXG4gIF9jcmVhdGVDbGFzcyhNYXJrZXIsIFt7XG4gICAga2V5OiBcIndpZHRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdpZHRoKF93aWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignbWFya2VyV2lkdGgnLCBfd2lkdGgpO1xuICAgIH0gLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJoZWlnaHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGVpZ2h0KF9oZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hcmtlckhlaWdodCcsIF9oZWlnaHQpO1xuICAgIH0gLy8gU2V0IG1hcmtlciByZWZYIGFuZCByZWZZXG5cbiAgfSwge1xuICAgIGtleTogXCJyZWZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVmKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3JlZlgnLCB4KS5hdHRyKCdyZWZZJywgeSk7XG4gICAgfSAvLyBVcGRhdGUgbWFya2VyXG5cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKGJsb2NrKSB7XG4gICAgICAvLyByZW1vdmUgYWxsIGNvbnRlbnRcbiAgICAgIHRoaXMuY2xlYXIoKTsgLy8gaW52b2tlIHBhc3NlZCBibG9ja1xuXG4gICAgICBpZiAodHlwZW9mIGJsb2NrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGJsb2NrLmNhbGwodGhpcywgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmV0dXJuIHRoZSBmaWxsIGlkXG5cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiAndXJsKCMnICsgdGhpcy5pZCgpICsgJyknO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNYXJrZXI7XG59KENvbnRhaW5lcik7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICBtYXJrZXI6IGZ1bmN0aW9uIG1hcmtlcigpIHtcbiAgICAgIHZhciBfdGhpcyRkZWZzO1xuXG4gICAgICAvLyBDcmVhdGUgbWFya2VyIGVsZW1lbnQgaW4gZGVmc1xuICAgICAgcmV0dXJuIChfdGhpcyRkZWZzID0gdGhpcy5kZWZzKCkpLm1hcmtlci5hcHBseShfdGhpcyRkZWZzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgRGVmczoge1xuICAgIC8vIENyZWF0ZSBtYXJrZXJcbiAgICBtYXJrZXI6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBibG9jaykge1xuICAgICAgLy8gU2V0IGRlZmF1bHQgdmlld2JveCB0byBtYXRjaCB0aGUgd2lkdGggYW5kIGhlaWdodCwgc2V0IHJlZiB0byBjeCBhbmQgY3kgYW5kIHNldCBvcmllbnQgdG8gYXV0b1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBNYXJrZXIoKSkuc2l6ZSh3aWR0aCwgaGVpZ2h0KS5yZWYod2lkdGggLyAyLCBoZWlnaHQgLyAyKS52aWV3Ym94KDAsIDAsIHdpZHRoLCBoZWlnaHQpLmF0dHIoJ29yaWVudCcsICdhdXRvJykudXBkYXRlKGJsb2NrKTtcbiAgICB9KVxuICB9LFxuICBtYXJrZXI6IHtcbiAgICAvLyBDcmVhdGUgYW5kIGF0dGFjaCBtYXJrZXJzXG4gICAgbWFya2VyOiBmdW5jdGlvbiBtYXJrZXIoX21hcmtlciwgd2lkdGgsIGhlaWdodCwgYmxvY2spIHtcbiAgICAgIHZhciBhdHRyID0gWydtYXJrZXInXTsgLy8gQnVpbGQgYXR0cmlidXRlIG5hbWVcblxuICAgICAgaWYgKF9tYXJrZXIgIT09ICdhbGwnKSBhdHRyLnB1c2goX21hcmtlcik7XG4gICAgICBhdHRyID0gYXR0ci5qb2luKCctJyk7IC8vIFNldCBtYXJrZXIgYXR0cmlidXRlXG5cbiAgICAgIF9tYXJrZXIgPSBhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBNYXJrZXIgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmRlZnMoKS5tYXJrZXIod2lkdGgsIGhlaWdodCwgYmxvY2spO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cihhdHRyLCBfbWFya2VyKTtcbiAgICB9XG4gIH1cbn0pO1xucmVnaXN0ZXIoTWFya2VyLCAnTWFya2VyJyk7XG5cbnZhciBuYXRpdmVTb3J0ID0gW10uc29ydDtcbnZhciB0ZXN0JDIgPSBbMSwgMiwgM107XG5cbi8vIElFOC1cbnZhciBGQUlMU19PTl9VTkRFRklORUQgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHRlc3QkMi5zb3J0KHVuZGVmaW5lZCk7XG59KTtcbi8vIFY4IGJ1Z1xudmFyIEZBSUxTX09OX05VTEwgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHRlc3QkMi5zb3J0KG51bGwpO1xufSk7XG4vLyBPbGQgV2ViS2l0XG52YXIgU0xPUFBZX01FVEhPRCQyID0gc2xvcHB5QXJyYXlNZXRob2QoJ3NvcnQnKTtcblxudmFyIEZPUkNFRCQ0ID0gRkFJTFNfT05fVU5ERUZJTkVEIHx8ICFGQUlMU19PTl9OVUxMIHx8IFNMT1BQWV9NRVRIT0QkMjtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5zb3J0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zb3J0XG5fZXhwb3J0KHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQkNCB9LCB7XG4gIHNvcnQ6IGZ1bmN0aW9uIHNvcnQoY29tcGFyZWZuKSB7XG4gICAgcmV0dXJuIGNvbXBhcmVmbiA9PT0gdW5kZWZpbmVkXG4gICAgICA/IG5hdGl2ZVNvcnQuY2FsbCh0b09iamVjdCh0aGlzKSlcbiAgICAgIDogbmF0aXZlU29ydC5jYWxsKHRvT2JqZWN0KHRoaXMpLCBhRnVuY3Rpb24kMShjb21wYXJlZm4pKTtcbiAgfVxufSk7XG5cbi8qKipcclxuQmFzZSBDbGFzc1xyXG49PT09PT09PT09XHJcblRoZSBiYXNlIHN0ZXBwZXIgY2xhc3MgdGhhdCB3aWxsIGJlXHJcbioqKi9cblxuZnVuY3Rpb24gbWFrZVNldHRlckdldHRlcihrLCBmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodikge1xuICAgIGlmICh2ID09IG51bGwpIHJldHVybiB0aGlzW3ZdO1xuICAgIHRoaXNba10gPSB2O1xuICAgIGlmIChmKSBmLmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbnZhciBlYXNpbmcgPSB7XG4gICctJzogZnVuY3Rpb24gXyhwb3MpIHtcbiAgICByZXR1cm4gcG9zO1xuICB9LFxuICAnPD4nOiBmdW5jdGlvbiBfKHBvcykge1xuICAgIHJldHVybiAtTWF0aC5jb3MocG9zICogTWF0aC5QSSkgLyAyICsgMC41O1xuICB9LFxuICAnPic6IGZ1bmN0aW9uIF8ocG9zKSB7XG4gICAgcmV0dXJuIE1hdGguc2luKHBvcyAqIE1hdGguUEkgLyAyKTtcbiAgfSxcbiAgJzwnOiBmdW5jdGlvbiBfKHBvcykge1xuICAgIHJldHVybiAtTWF0aC5jb3MocG9zICogTWF0aC5QSSAvIDIpICsgMTtcbiAgfSxcbiAgYmV6aWVyOiBmdW5jdGlvbiBiZXppZXIoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAvLyBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy1lYXNpbmctMS8jY3ViaWMtYmV6aWVyLWFsZ29cbiAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgIGlmICh0IDwgMCkge1xuICAgICAgICBpZiAoeDEgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHkxIC8geDEgKiB0O1xuICAgICAgICB9IGVsc2UgaWYgKHgyID4gMCkge1xuICAgICAgICAgIHJldHVybiB5MiAvIHgyICogdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0ID4gMSkge1xuICAgICAgICBpZiAoeDIgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuICgxIC0geTIpIC8gKDEgLSB4MikgKiB0ICsgKHkyIC0geDIpIC8gKDEgLSB4Mik7XG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPCAxKSB7XG4gICAgICAgICAgcmV0dXJuICgxIC0geTEpIC8gKDEgLSB4MSkgKiB0ICsgKHkxIC0geDEpIC8gKDEgLSB4MSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAzICogdCAqIE1hdGgucG93KDEgLSB0LCAyKSAqIHkxICsgMyAqIE1hdGgucG93KHQsIDIpICogKDEgLSB0KSAqIHkyICsgTWF0aC5wb3codCwgMyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgLy8gc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3MtZWFzaW5nLTEvI3N0ZXAtdGltaW5nLWZ1bmN0aW9uLWFsZ29cbiAgc3RlcHM6IGZ1bmN0aW9uIHN0ZXBzKF9zdGVwcykge1xuICAgIHZhciBzdGVwUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdlbmQnO1xuICAgIC8vIGRlYWwgd2l0aCBcImp1bXAtXCIgcHJlZml4XG4gICAgc3RlcFBvc2l0aW9uID0gc3RlcFBvc2l0aW9uLnNwbGl0KCctJykucmV2ZXJzZSgpWzBdO1xuICAgIHZhciBqdW1wcyA9IF9zdGVwcztcblxuICAgIGlmIChzdGVwUG9zaXRpb24gPT09ICdub25lJykge1xuICAgICAgLS1qdW1wcztcbiAgICB9IGVsc2UgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gJ2JvdGgnKSB7XG4gICAgICArK2p1bXBzO1xuICAgIH0gLy8gVGhlIGJlZm9yZUZsYWcgaXMgZXNzZW50aWFsbHkgdXNlbGVzc1xuXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgIHZhciBiZWZvcmVGbGFnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICAgIC8vIFN0ZXAgaXMgY2FsbGVkIGN1cnJlbnRTdGVwIGluIHJlZmVyZW5jZWQgdXJsXG4gICAgICB2YXIgc3RlcCA9IE1hdGguZmxvb3IodCAqIF9zdGVwcyk7XG4gICAgICB2YXIganVtcGluZyA9IHQgKiBzdGVwICUgMSA9PT0gMDtcblxuICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gJ3N0YXJ0JyB8fCBzdGVwUG9zaXRpb24gPT09ICdib3RoJykge1xuICAgICAgICArK3N0ZXA7XG4gICAgICB9XG5cbiAgICAgIGlmIChiZWZvcmVGbGFnICYmIGp1bXBpbmcpIHtcbiAgICAgICAgLS1zdGVwO1xuICAgICAgfVxuXG4gICAgICBpZiAodCA+PSAwICYmIHN0ZXAgPCAwKSB7XG4gICAgICAgIHN0ZXAgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAodCA8PSAxICYmIHN0ZXAgPiBqdW1wcykge1xuICAgICAgICBzdGVwID0ganVtcHM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGVwIC8ganVtcHM7XG4gICAgfTtcbiAgfVxufTtcbnZhciBTdGVwcGVyID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RlcHBlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3RlcHBlcik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU3RlcHBlciwgW3tcbiAgICBrZXk6IFwiZG9uZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdGVwcGVyO1xufSgpO1xuLyoqKlxyXG5FYXNpbmcgRnVuY3Rpb25zXHJcbj09PT09PT09PT09PT09PT1cclxuKioqL1xuXG52YXIgRWFzZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1N0ZXBwZXIpIHtcbiAgX2luaGVyaXRzKEVhc2UsIF9TdGVwcGVyKTtcblxuICBmdW5jdGlvbiBFYXNlKGZuKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVhc2UpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoRWFzZSkuY2FsbCh0aGlzKSk7XG4gICAgX3RoaXMuZWFzZSA9IGVhc2luZ1tmbiB8fCB0aW1lbGluZS5lYXNlXSB8fCBmbjtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRWFzZSwgW3tcbiAgICBrZXk6IFwic3RlcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGVwKGZyb20sIHRvLCBwb3MpIHtcbiAgICAgIGlmICh0eXBlb2YgZnJvbSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHBvcyA8IDEgPyBmcm9tIDogdG87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmcm9tICsgKHRvIC0gZnJvbSkgKiB0aGlzLmVhc2UocG9zKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRWFzZTtcbn0oU3RlcHBlcik7XG4vKioqXHJcbkNvbnRyb2xsZXIgVHlwZXNcclxuPT09PT09PT09PT09PT09PVxyXG4qKiovXG5cbnZhciBDb250cm9sbGVyID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU3RlcHBlcjIpIHtcbiAgX2luaGVyaXRzKENvbnRyb2xsZXIsIF9TdGVwcGVyMik7XG5cbiAgZnVuY3Rpb24gQ29udHJvbGxlcihmbikge1xuICAgIHZhciBfdGhpczI7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29udHJvbGxlcik7XG5cbiAgICBfdGhpczIgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoQ29udHJvbGxlcikuY2FsbCh0aGlzKSk7XG4gICAgX3RoaXMyLnN0ZXBwZXIgPSBmbjtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENvbnRyb2xsZXIsIFt7XG4gICAga2V5OiBcInN0ZXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RlcChjdXJyZW50LCB0YXJnZXQsIGR0LCBjKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGVwcGVyKGN1cnJlbnQsIHRhcmdldCwgZHQsIGMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRvbmUoYykge1xuICAgICAgcmV0dXJuIGMuZG9uZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29udHJvbGxlcjtcbn0oU3RlcHBlcik7XG5cbmZ1bmN0aW9uIHJlY2FsY3VsYXRlKCkge1xuICAvLyBBcHBseSB0aGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gIHZhciBkdXJhdGlvbiA9ICh0aGlzLl9kdXJhdGlvbiB8fCA1MDApIC8gMTAwMDtcbiAgdmFyIG92ZXJzaG9vdCA9IHRoaXMuX292ZXJzaG9vdCB8fCAwOyAvLyBDYWxjdWxhdGUgdGhlIFBJRCBuYXR1cmFsIHJlc3BvbnNlXG5cbiAgdmFyIGVwcyA9IDFlLTEwO1xuICB2YXIgcGkgPSBNYXRoLlBJO1xuICB2YXIgb3MgPSBNYXRoLmxvZyhvdmVyc2hvb3QgLyAxMDAgKyBlcHMpO1xuICB2YXIgemV0YSA9IC1vcyAvIE1hdGguc3FydChwaSAqIHBpICsgb3MgKiBvcyk7XG4gIHZhciB3biA9IDMuOSAvICh6ZXRhICogZHVyYXRpb24pOyAvLyBDYWxjdWxhdGUgdGhlIFNwcmluZyB2YWx1ZXNcblxuICB0aGlzLmQgPSAyICogemV0YSAqIHduO1xuICB0aGlzLmsgPSB3biAqIHduO1xufVxuXG52YXIgU3ByaW5nID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBfaW5oZXJpdHMoU3ByaW5nLCBfQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gU3ByaW5nKGR1cmF0aW9uLCBvdmVyc2hvb3QpIHtcbiAgICB2YXIgX3RoaXMzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNwcmluZyk7XG5cbiAgICBfdGhpczMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoU3ByaW5nKS5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzMy5kdXJhdGlvbihkdXJhdGlvbiB8fCA1MDApLm92ZXJzaG9vdChvdmVyc2hvb3QgfHwgMCk7XG5cbiAgICByZXR1cm4gX3RoaXMzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNwcmluZywgW3tcbiAgICBrZXk6IFwic3RlcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGVwKGN1cnJlbnQsIHRhcmdldCwgZHQsIGMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ3N0cmluZycpIHJldHVybiBjdXJyZW50O1xuICAgICAgYy5kb25lID0gZHQgPT09IEluZmluaXR5O1xuICAgICAgaWYgKGR0ID09PSBJbmZpbml0eSkgcmV0dXJuIHRhcmdldDtcbiAgICAgIGlmIChkdCA9PT0gMCkgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICBpZiAoZHQgPiAxMDApIGR0ID0gMTY7XG4gICAgICBkdCAvPSAxMDAwOyAvLyBHZXQgdGhlIHByZXZpb3VzIHZlbG9jaXR5XG5cbiAgICAgIHZhciB2ZWxvY2l0eSA9IGMudmVsb2NpdHkgfHwgMDsgLy8gQXBwbHkgdGhlIGNvbnRyb2wgdG8gZ2V0IHRoZSBuZXcgcG9zaXRpb24gYW5kIHN0b3JlIGl0XG5cbiAgICAgIHZhciBhY2NlbGVyYXRpb24gPSAtdGhpcy5kICogdmVsb2NpdHkgLSB0aGlzLmsgKiAoY3VycmVudCAtIHRhcmdldCk7XG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSBjdXJyZW50ICsgdmVsb2NpdHkgKiBkdCArIGFjY2VsZXJhdGlvbiAqIGR0ICogZHQgLyAyOyAvLyBTdG9yZSB0aGUgdmVsb2NpdHlcblxuICAgICAgYy52ZWxvY2l0eSA9IHZlbG9jaXR5ICsgYWNjZWxlcmF0aW9uICogZHQ7IC8vIEZpZ3VyZSBvdXQgaWYgd2UgaGF2ZSBjb252ZXJnZWQsIGFuZCBpZiBzbywgcGFzcyB0aGUgdmFsdWVcblxuICAgICAgYy5kb25lID0gTWF0aC5hYnModGFyZ2V0IC0gbmV3UG9zaXRpb24pICsgTWF0aC5hYnModmVsb2NpdHkpIDwgMC4wMDI7XG4gICAgICByZXR1cm4gYy5kb25lID8gdGFyZ2V0IDogbmV3UG9zaXRpb247XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNwcmluZztcbn0oQ29udHJvbGxlcik7XG5leHRlbmQoU3ByaW5nLCB7XG4gIGR1cmF0aW9uOiBtYWtlU2V0dGVyR2V0dGVyKCdfZHVyYXRpb24nLCByZWNhbGN1bGF0ZSksXG4gIG92ZXJzaG9vdDogbWFrZVNldHRlckdldHRlcignX292ZXJzaG9vdCcsIHJlY2FsY3VsYXRlKVxufSk7XG52YXIgUElEID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29udHJvbGxlcjIpIHtcbiAgX2luaGVyaXRzKFBJRCwgX0NvbnRyb2xsZXIyKTtcblxuICBmdW5jdGlvbiBQSUQocCwgaSwgZCwgd2luZHVwKSB7XG4gICAgdmFyIF90aGlzNDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQSUQpO1xuXG4gICAgX3RoaXM0ID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFBJRCkuY2FsbCh0aGlzKSk7XG4gICAgcCA9IHAgPT0gbnVsbCA/IDAuMSA6IHA7XG4gICAgaSA9IGkgPT0gbnVsbCA/IDAuMDEgOiBpO1xuICAgIGQgPSBkID09IG51bGwgPyAwIDogZDtcbiAgICB3aW5kdXAgPSB3aW5kdXAgPT0gbnVsbCA/IDEwMDAgOiB3aW5kdXA7XG5cbiAgICBfdGhpczQucChwKS5pKGkpLmQoZCkud2luZHVwKHdpbmR1cCk7XG5cbiAgICByZXR1cm4gX3RoaXM0O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFBJRCwgW3tcbiAgICBrZXk6IFwic3RlcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGVwKGN1cnJlbnQsIHRhcmdldCwgZHQsIGMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ3N0cmluZycpIHJldHVybiBjdXJyZW50O1xuICAgICAgYy5kb25lID0gZHQgPT09IEluZmluaXR5O1xuICAgICAgaWYgKGR0ID09PSBJbmZpbml0eSkgcmV0dXJuIHRhcmdldDtcbiAgICAgIGlmIChkdCA9PT0gMCkgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICB2YXIgcCA9IHRhcmdldCAtIGN1cnJlbnQ7XG4gICAgICB2YXIgaSA9IChjLmludGVncmFsIHx8IDApICsgcCAqIGR0O1xuICAgICAgdmFyIGQgPSAocCAtIChjLmVycm9yIHx8IDApKSAvIGR0O1xuICAgICAgdmFyIHdpbmR1cCA9IHRoaXMud2luZHVwOyAvLyBhbnRpd2luZHVwXG5cbiAgICAgIGlmICh3aW5kdXAgIT09IGZhbHNlKSB7XG4gICAgICAgIGkgPSBNYXRoLm1heCgtd2luZHVwLCBNYXRoLm1pbihpLCB3aW5kdXApKTtcbiAgICAgIH1cblxuICAgICAgYy5lcnJvciA9IHA7XG4gICAgICBjLmludGVncmFsID0gaTtcbiAgICAgIGMuZG9uZSA9IE1hdGguYWJzKHApIDwgMC4wMDE7XG4gICAgICByZXR1cm4gYy5kb25lID8gdGFyZ2V0IDogY3VycmVudCArICh0aGlzLlAgKiBwICsgdGhpcy5JICogaSArIHRoaXMuRCAqIGQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQSUQ7XG59KENvbnRyb2xsZXIpO1xuZXh0ZW5kKFBJRCwge1xuICB3aW5kdXA6IG1ha2VTZXR0ZXJHZXR0ZXIoJ3dpbmR1cCcpLFxuICBwOiBtYWtlU2V0dGVyR2V0dGVyKCdQJyksXG4gIGk6IG1ha2VTZXR0ZXJHZXR0ZXIoJ0knKSxcbiAgZDogbWFrZVNldHRlckdldHRlcignRCcpXG59KTtcblxudmFyIFBhdGhBcnJheSA9IHN1YkNsYXNzQXJyYXkoJ1BhdGhBcnJheScsIFNWR0FycmF5KTtcbmZ1bmN0aW9uIHBhdGhSZWdSZXBsYWNlKGEsIGIsIGMsIGQpIHtcbiAgcmV0dXJuIGMgKyBkLnJlcGxhY2UoZG90cywgJyAuJyk7XG59XG5cbmZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYSkge1xuICBmb3IgKHZhciBpID0gMCwgaWwgPSBhLmxlbmd0aCwgcyA9ICcnOyBpIDwgaWw7IGkrKykge1xuICAgIHMgKz0gYVtpXVswXTtcblxuICAgIGlmIChhW2ldWzFdICE9IG51bGwpIHtcbiAgICAgIHMgKz0gYVtpXVsxXTtcblxuICAgICAgaWYgKGFbaV1bMl0gIT0gbnVsbCkge1xuICAgICAgICBzICs9ICcgJztcbiAgICAgICAgcyArPSBhW2ldWzJdO1xuXG4gICAgICAgIGlmIChhW2ldWzNdICE9IG51bGwpIHtcbiAgICAgICAgICBzICs9ICcgJztcbiAgICAgICAgICBzICs9IGFbaV1bM107XG4gICAgICAgICAgcyArPSAnICc7XG4gICAgICAgICAgcyArPSBhW2ldWzRdO1xuXG4gICAgICAgICAgaWYgKGFbaV1bNV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgcyArPSAnICc7XG4gICAgICAgICAgICBzICs9IGFbaV1bNV07XG4gICAgICAgICAgICBzICs9ICcgJztcbiAgICAgICAgICAgIHMgKz0gYVtpXVs2XTtcblxuICAgICAgICAgICAgaWYgKGFbaV1bN10gIT0gbnVsbCkge1xuICAgICAgICAgICAgICBzICs9ICcgJztcbiAgICAgICAgICAgICAgcyArPSBhW2ldWzddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzICsgJyAnO1xufVxuXG52YXIgcGF0aEhhbmRsZXJzID0ge1xuICBNOiBmdW5jdGlvbiBNKGMsIHAsIHAwKSB7XG4gICAgcC54ID0gcDAueCA9IGNbMF07XG4gICAgcC55ID0gcDAueSA9IGNbMV07XG4gICAgcmV0dXJuIFsnTScsIHAueCwgcC55XTtcbiAgfSxcbiAgTDogZnVuY3Rpb24gTChjLCBwKSB7XG4gICAgcC54ID0gY1swXTtcbiAgICBwLnkgPSBjWzFdO1xuICAgIHJldHVybiBbJ0wnLCBjWzBdLCBjWzFdXTtcbiAgfSxcbiAgSDogZnVuY3Rpb24gSChjLCBwKSB7XG4gICAgcC54ID0gY1swXTtcbiAgICByZXR1cm4gWydIJywgY1swXV07XG4gIH0sXG4gIFY6IGZ1bmN0aW9uIFYoYywgcCkge1xuICAgIHAueSA9IGNbMF07XG4gICAgcmV0dXJuIFsnVicsIGNbMF1dO1xuICB9LFxuICBDOiBmdW5jdGlvbiBDKGMsIHApIHtcbiAgICBwLnggPSBjWzRdO1xuICAgIHAueSA9IGNbNV07XG4gICAgcmV0dXJuIFsnQycsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM10sIGNbNF0sIGNbNV1dO1xuICB9LFxuICBTOiBmdW5jdGlvbiBTKGMsIHApIHtcbiAgICBwLnggPSBjWzJdO1xuICAgIHAueSA9IGNbM107XG4gICAgcmV0dXJuIFsnUycsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM11dO1xuICB9LFxuICBROiBmdW5jdGlvbiBRKGMsIHApIHtcbiAgICBwLnggPSBjWzJdO1xuICAgIHAueSA9IGNbM107XG4gICAgcmV0dXJuIFsnUScsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM11dO1xuICB9LFxuICBUOiBmdW5jdGlvbiBUKGMsIHApIHtcbiAgICBwLnggPSBjWzBdO1xuICAgIHAueSA9IGNbMV07XG4gICAgcmV0dXJuIFsnVCcsIGNbMF0sIGNbMV1dO1xuICB9LFxuICBaOiBmdW5jdGlvbiBaKGMsIHAsIHAwKSB7XG4gICAgcC54ID0gcDAueDtcbiAgICBwLnkgPSBwMC55O1xuICAgIHJldHVybiBbJ1onXTtcbiAgfSxcbiAgQTogZnVuY3Rpb24gQShjLCBwKSB7XG4gICAgcC54ID0gY1s1XTtcbiAgICBwLnkgPSBjWzZdO1xuICAgIHJldHVybiBbJ0EnLCBjWzBdLCBjWzFdLCBjWzJdLCBjWzNdLCBjWzRdLCBjWzVdLCBjWzZdXTtcbiAgfVxufTtcbnZhciBtbGh2cXRjc2F6ID0gJ21saHZxdGNzYXonLnNwbGl0KCcnKTtcblxuZm9yICh2YXIgaSA9IDAsIGlsID0gbWxodnF0Y3Nhei5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gIHBhdGhIYW5kbGVyc1ttbGh2cXRjc2F6W2ldXSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjLCBwLCBwMCkge1xuICAgICAgaWYgKGkgPT09ICdIJykgY1swXSA9IGNbMF0gKyBwLng7ZWxzZSBpZiAoaSA9PT0gJ1YnKSBjWzBdID0gY1swXSArIHAueTtlbHNlIGlmIChpID09PSAnQScpIHtcbiAgICAgICAgY1s1XSA9IGNbNV0gKyBwLng7XG4gICAgICAgIGNbNl0gPSBjWzZdICsgcC55O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gYy5sZW5ndGg7IGogPCBqbDsgKytqKSB7XG4gICAgICAgICAgY1tqXSA9IGNbal0gKyAoaiAlIDIgPyBwLnkgOiBwLngpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGF0aEhhbmRsZXJzW2ldKGMsIHAsIHAwKTtcbiAgICB9O1xuICB9KG1saHZxdGNzYXpbaV0udG9VcHBlckNhc2UoKSk7XG59XG5cbmV4dGVuZChQYXRoQXJyYXksIHtcbiAgLy8gQ29udmVydCBhcnJheSB0byBzdHJpbmdcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBhcnJheVRvU3RyaW5nKHRoaXMpO1xuICB9LFxuICAvLyBNb3ZlIHBhdGggc3RyaW5nXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgIC8vIGdldCBib3VuZGluZyBib3ggb2YgY3VycmVudCBzaXR1YXRpb25cbiAgICB2YXIgYm94ID0gdGhpcy5iYm94KCk7IC8vIGdldCByZWxhdGl2ZSBvZmZzZXRcblxuICAgIHggLT0gYm94Lng7XG4gICAgeSAtPSBib3gueTtcblxuICAgIGlmICghaXNOYU4oeCkgJiYgIWlzTmFOKHkpKSB7XG4gICAgICAvLyBtb3ZlIGV2ZXJ5IHBvaW50XG4gICAgICBmb3IgKHZhciBsLCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsID0gdGhpc1tpXVswXTtcblxuICAgICAgICBpZiAobCA9PT0gJ00nIHx8IGwgPT09ICdMJyB8fCBsID09PSAnVCcpIHtcbiAgICAgICAgICB0aGlzW2ldWzFdICs9IHg7XG4gICAgICAgICAgdGhpc1tpXVsyXSArPSB5O1xuICAgICAgICB9IGVsc2UgaWYgKGwgPT09ICdIJykge1xuICAgICAgICAgIHRoaXNbaV1bMV0gKz0geDtcbiAgICAgICAgfSBlbHNlIGlmIChsID09PSAnVicpIHtcbiAgICAgICAgICB0aGlzW2ldWzFdICs9IHk7XG4gICAgICAgIH0gZWxzZSBpZiAobCA9PT0gJ0MnIHx8IGwgPT09ICdTJyB8fCBsID09PSAnUScpIHtcbiAgICAgICAgICB0aGlzW2ldWzFdICs9IHg7XG4gICAgICAgICAgdGhpc1tpXVsyXSArPSB5O1xuICAgICAgICAgIHRoaXNbaV1bM10gKz0geDtcbiAgICAgICAgICB0aGlzW2ldWzRdICs9IHk7XG5cbiAgICAgICAgICBpZiAobCA9PT0gJ0MnKSB7XG4gICAgICAgICAgICB0aGlzW2ldWzVdICs9IHg7XG4gICAgICAgICAgICB0aGlzW2ldWzZdICs9IHk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGwgPT09ICdBJykge1xuICAgICAgICAgIHRoaXNbaV1bNl0gKz0geDtcbiAgICAgICAgICB0aGlzW2ldWzddICs9IHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gUmVzaXplIHBhdGggc3RyaW5nXG4gIHNpemU6IGZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIC8vIGdldCBib3VuZGluZyBib3ggb2YgY3VycmVudCBzaXR1YXRpb25cbiAgICB2YXIgYm94ID0gdGhpcy5iYm94KCk7XG4gICAgdmFyIGksIGw7IC8vIElmIHRoZSBib3ggd2lkdGggb3IgaGVpZ2h0IGlzIDAgdGhlbiB3ZSBpZ25vcmVcbiAgICAvLyB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIHJlc3BlY3RpdmUgYXhpc1xuXG4gICAgYm94LndpZHRoID0gYm94LndpZHRoID09PSAwID8gMSA6IGJveC53aWR0aDtcbiAgICBib3guaGVpZ2h0ID0gYm94LmhlaWdodCA9PT0gMCA/IDEgOiBib3guaGVpZ2h0OyAvLyByZWNhbGN1bGF0ZSBwb3NpdGlvbiBvZiBhbGwgcG9pbnRzIGFjY29yZGluZyB0byBuZXcgc2l6ZVxuXG4gICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbCA9IHRoaXNbaV1bMF07XG5cbiAgICAgIGlmIChsID09PSAnTScgfHwgbCA9PT0gJ0wnIHx8IGwgPT09ICdUJykge1xuICAgICAgICB0aGlzW2ldWzFdID0gKHRoaXNbaV1bMV0gLSBib3gueCkgKiB3aWR0aCAvIGJveC53aWR0aCArIGJveC54O1xuICAgICAgICB0aGlzW2ldWzJdID0gKHRoaXNbaV1bMl0gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgICB9IGVsc2UgaWYgKGwgPT09ICdIJykge1xuICAgICAgICB0aGlzW2ldWzFdID0gKHRoaXNbaV1bMV0gLSBib3gueCkgKiB3aWR0aCAvIGJveC53aWR0aCArIGJveC54O1xuICAgICAgfSBlbHNlIGlmIChsID09PSAnVicpIHtcbiAgICAgICAgdGhpc1tpXVsxXSA9ICh0aGlzW2ldWzFdIC0gYm94LnkpICogaGVpZ2h0IC8gYm94LmhlaWdodCArIGJveC55O1xuICAgICAgfSBlbHNlIGlmIChsID09PSAnQycgfHwgbCA9PT0gJ1MnIHx8IGwgPT09ICdRJykge1xuICAgICAgICB0aGlzW2ldWzFdID0gKHRoaXNbaV1bMV0gLSBib3gueCkgKiB3aWR0aCAvIGJveC53aWR0aCArIGJveC54O1xuICAgICAgICB0aGlzW2ldWzJdID0gKHRoaXNbaV1bMl0gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgICAgIHRoaXNbaV1bM10gPSAodGhpc1tpXVszXSAtIGJveC54KSAqIHdpZHRoIC8gYm94LndpZHRoICsgYm94Lng7XG4gICAgICAgIHRoaXNbaV1bNF0gPSAodGhpc1tpXVs0XSAtIGJveC55KSAqIGhlaWdodCAvIGJveC5oZWlnaHQgKyBib3gueTtcblxuICAgICAgICBpZiAobCA9PT0gJ0MnKSB7XG4gICAgICAgICAgdGhpc1tpXVs1XSA9ICh0aGlzW2ldWzVdIC0gYm94LngpICogd2lkdGggLyBib3gud2lkdGggKyBib3gueDtcbiAgICAgICAgICB0aGlzW2ldWzZdID0gKHRoaXNbaV1bNl0gLSBib3gueSkgKiBoZWlnaHQgLyBib3guaGVpZ2h0ICsgYm94Lnk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobCA9PT0gJ0EnKSB7XG4gICAgICAgIC8vIHJlc2l6ZSByYWRpaVxuICAgICAgICB0aGlzW2ldWzFdID0gdGhpc1tpXVsxXSAqIHdpZHRoIC8gYm94LndpZHRoO1xuICAgICAgICB0aGlzW2ldWzJdID0gdGhpc1tpXVsyXSAqIGhlaWdodCAvIGJveC5oZWlnaHQ7IC8vIG1vdmUgcG9zaXRpb24gdmFsdWVzXG5cbiAgICAgICAgdGhpc1tpXVs2XSA9ICh0aGlzW2ldWzZdIC0gYm94LngpICogd2lkdGggLyBib3gud2lkdGggKyBib3gueDtcbiAgICAgICAgdGhpc1tpXVs3XSA9ICh0aGlzW2ldWzddIC0gYm94LnkpICogaGVpZ2h0IC8gYm94LmhlaWdodCArIGJveC55O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBUZXN0IGlmIHRoZSBwYXNzZWQgcGF0aCBhcnJheSB1c2UgdGhlIHNhbWUgcGF0aCBkYXRhIGNvbW1hbmRzIGFzIHRoaXMgcGF0aCBhcnJheVxuICBlcXVhbENvbW1hbmRzOiBmdW5jdGlvbiBlcXVhbENvbW1hbmRzKHBhdGhBcnJheSkge1xuICAgIHZhciBpLCBpbCwgZXF1YWxDb21tYW5kcztcbiAgICBwYXRoQXJyYXkgPSBuZXcgUGF0aEFycmF5KHBhdGhBcnJheSk7XG4gICAgZXF1YWxDb21tYW5kcyA9IHRoaXMubGVuZ3RoID09PSBwYXRoQXJyYXkubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMCwgaWwgPSB0aGlzLmxlbmd0aDsgZXF1YWxDb21tYW5kcyAmJiBpIDwgaWw7IGkrKykge1xuICAgICAgZXF1YWxDb21tYW5kcyA9IHRoaXNbaV1bMF0gPT09IHBhdGhBcnJheVtpXVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXF1YWxDb21tYW5kcztcbiAgfSxcbiAgLy8gTWFrZSBwYXRoIGFycmF5IG1vcnBoYWJsZVxuICBtb3JwaDogZnVuY3Rpb24gbW9ycGgocGF0aEFycmF5KSB7XG4gICAgcGF0aEFycmF5ID0gbmV3IFBhdGhBcnJheShwYXRoQXJyYXkpO1xuXG4gICAgaWYgKHRoaXMuZXF1YWxDb21tYW5kcyhwYXRoQXJyYXkpKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gcGF0aEFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gR2V0IG1vcnBoZWQgcGF0aCBhcnJheSBhdCBnaXZlbiBwb3NpdGlvblxuICBhdDogZnVuY3Rpb24gYXQocG9zKSB7XG4gICAgLy8gbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZFxuICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXM7XG4gICAgdmFyIHNvdXJjZUFycmF5ID0gdGhpcztcbiAgICB2YXIgZGVzdGluYXRpb25BcnJheSA9IHRoaXMuZGVzdGluYXRpb24udmFsdWU7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgdmFyIHBhdGhBcnJheSA9IG5ldyBQYXRoQXJyYXkoKTtcbiAgICB2YXIgaSwgaWwsIGosIGpsOyAvLyBBbmltYXRlIGhhcyBzcGVjaWZpZWQgaW4gdGhlIFNWRyBzcGVjXG4gICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHMTEvcGF0aHMuaHRtbCNQYXRoRWxlbWVudFxuXG4gICAgZm9yIChpID0gMCwgaWwgPSBzb3VyY2VBcnJheS5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBhcnJheVtpXSA9IFtzb3VyY2VBcnJheVtpXVswXV07XG5cbiAgICAgIGZvciAoaiA9IDEsIGpsID0gc291cmNlQXJyYXlbaV0ubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICBhcnJheVtpXVtqXSA9IHNvdXJjZUFycmF5W2ldW2pdICsgKGRlc3RpbmF0aW9uQXJyYXlbaV1bal0gLSBzb3VyY2VBcnJheVtpXVtqXSkgKiBwb3M7XG4gICAgICB9IC8vIEZvciB0aGUgdHdvIGZsYWdzIG9mIHRoZSBlbGxpcHRpY2FsIGFyYyBjb21tYW5kLCB0aGUgU1ZHIHNwZWMgc2F5OlxuICAgICAgLy8gRmxhZ3MgYW5kIGJvb2xlYW5zIGFyZSBpbnRlcnBvbGF0ZWQgYXMgZnJhY3Rpb25zIGJldHdlZW4gemVybyBhbmQgb25lLCB3aXRoIGFueSBub24temVybyB2YWx1ZSBjb25zaWRlcmVkIHRvIGJlIGEgdmFsdWUgb2Ygb25lL3RydWVcbiAgICAgIC8vIEVsbGlwdGljYWwgYXJjIGNvbW1hbmQgYXMgYW4gYXJyYXkgZm9sbG93ZWQgYnkgY29ycmVzcG9uZGluZyBpbmRleGVzOlxuICAgICAgLy8gWydBJywgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxuICAgICAgLy8gICAwICAgIDEgICAyICAgICAgICAzICAgICAgICAgICAgICAgICA0ICAgICAgICAgICAgIDUgICAgICA2ICA3XG5cblxuICAgICAgaWYgKGFycmF5W2ldWzBdID09PSAnQScpIHtcbiAgICAgICAgYXJyYXlbaV1bNF0gPSArKGFycmF5W2ldWzRdICE9PSAwKTtcbiAgICAgICAgYXJyYXlbaV1bNV0gPSArKGFycmF5W2ldWzVdICE9PSAwKTtcbiAgICAgIH1cbiAgICB9IC8vIERpcmVjdGx5IG1vZGlmeSB0aGUgdmFsdWUgb2YgYSBwYXRoIGFycmF5LCB0aGlzIGlzIGRvbmUgdGhpcyB3YXkgZm9yIHBlcmZvcm1hbmNlXG5cblxuICAgIHBhdGhBcnJheS52YWx1ZSA9IGFycmF5O1xuICAgIHJldHVybiBwYXRoQXJyYXk7XG4gIH0sXG4gIC8vIEFic29sdXRpemUgYW5kIHBhcnNlIHBhdGggdG8gYXJyYXlcbiAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKCkge1xuICAgIHZhciBhcnJheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW1snTScsIDAsIDBdXTtcbiAgICAvLyBpZiBpdCdzIGFscmVhZHkgYSBwYXRoYXJyYXksIG5vIG5lZWQgdG8gcGFyc2UgaXRcbiAgICBpZiAoYXJyYXkgaW5zdGFuY2VvZiBQYXRoQXJyYXkpIHJldHVybiBhcnJheTsgLy8gcHJlcGFyZSBmb3IgcGFyc2luZ1xuXG4gICAgdmFyIHM7XG4gICAgdmFyIHBhcmFtQ250ID0ge1xuICAgICAgTTogMixcbiAgICAgIEw6IDIsXG4gICAgICBIOiAxLFxuICAgICAgVjogMSxcbiAgICAgIEM6IDYsXG4gICAgICBTOiA0LFxuICAgICAgUTogNCxcbiAgICAgIFQ6IDIsXG4gICAgICBBOiA3LFxuICAgICAgWjogMFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGFycmF5ID09PSAnc3RyaW5nJykge1xuICAgICAgYXJyYXkgPSBhcnJheS5yZXBsYWNlKG51bWJlcnNXaXRoRG90cywgcGF0aFJlZ1JlcGxhY2UpIC8vIGNvbnZlcnQgNDUuMTIzLjEyMyB0byA0NS4xMjMgLjEyM1xuICAgICAgLnJlcGxhY2UocGF0aExldHRlcnMsICcgJCYgJykgLy8gcHV0IHNvbWUgcm9vbSBiZXR3ZWVuIGxldHRlcnMgYW5kIG51bWJlcnNcbiAgICAgIC5yZXBsYWNlKGh5cGhlbiwgJyQxIC0nKSAvLyBhZGQgc3BhY2UgYmVmb3JlIGh5cGhlblxuICAgICAgLnRyaW0oKSAvLyB0cmltXG4gICAgICAuc3BsaXQoZGVsaW1pdGVyKTsgLy8gc3BsaXQgaW50byBhcnJheVxuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheSA9IGFycmF5LnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gW10uY29uY2F0LmNhbGwocHJldiwgY3Vycik7XG4gICAgICB9LCBbXSk7XG4gICAgfSAvLyBhcnJheSBub3cgaXMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgcGFydHMgb2YgYSBwYXRoIGUuZy4gWydNJywgJzAnLCAnMCcsICdMJywgJzMwJywgJzMwJyAuLi5dXG5cblxuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgcCA9IG5ldyBQb2ludCgpO1xuICAgIHZhciBwMCA9IG5ldyBQb2ludCgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGxlbiA9IGFycmF5Lmxlbmd0aDtcblxuICAgIGRvIHtcbiAgICAgIC8vIFRlc3QgaWYgd2UgaGF2ZSBhIHBhdGggbGV0dGVyXG4gICAgICBpZiAoaXNQYXRoTGV0dGVyLnRlc3QoYXJyYXlbaW5kZXhdKSkge1xuICAgICAgICBzID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICArK2luZGV4OyAvLyBJZiBsYXN0IGxldHRlciB3YXMgYSBtb3ZlIGNvbW1hbmQgYW5kIHdlIGdvdCBubyBuZXcsIGl0IGRlZmF1bHRzIHRvIFtMXWluZVxuICAgICAgfSBlbHNlIGlmIChzID09PSAnTScpIHtcbiAgICAgICAgcyA9ICdMJztcbiAgICAgIH0gZWxzZSBpZiAocyA9PT0gJ20nKSB7XG4gICAgICAgIHMgPSAnbCc7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKHBhdGhIYW5kbGVyc1tzXS5jYWxsKG51bGwsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCA9IGluZGV4ICsgcGFyYW1DbnRbcy50b1VwcGVyQ2FzZSgpXSkubWFwKHBhcnNlRmxvYXQpLCBwLCBwMCkpO1xuICAgIH0gd2hpbGUgKGxlbiA+IGluZGV4KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIC8vIEdldCBib3VuZGluZyBib3ggb2YgcGF0aFxuICBiYm94OiBmdW5jdGlvbiBiYm94KCkge1xuICAgIHBhcnNlcigpLnBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy50b1N0cmluZygpKTtcbiAgICByZXR1cm4gcGFyc2VyLm5vZGVzLnBhdGguZ2V0QkJveCgpO1xuICB9XG59KTtcblxudmFyIE1vcnBoYWJsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1vcnBoYWJsZShzdGVwcGVyKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1vcnBoYWJsZSk7XG5cbiAgICB0aGlzLl9zdGVwcGVyID0gc3RlcHBlciB8fCBuZXcgRWFzZSgnLScpO1xuICAgIHRoaXMuX2Zyb20gPSBudWxsO1xuICAgIHRoaXMuX3RvID0gbnVsbDtcbiAgICB0aGlzLl90eXBlID0gbnVsbDtcbiAgICB0aGlzLl9jb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLl9tb3JwaE9iaiA9IG51bGw7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTW9ycGhhYmxlLCBbe1xuICAgIGtleTogXCJmcm9tXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZyb20odmFsKSB7XG4gICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb207XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Zyb20gPSB0aGlzLl9zZXQodmFsKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0byh2YWwpIHtcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG87XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RvID0gdGhpcy5fc2V0KHZhbCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0eXBlKF90eXBlKSB7XG4gICAgICAvLyBnZXR0ZXJcbiAgICAgIGlmIChfdHlwZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgICAgfSAvLyBzZXR0ZXJcblxuXG4gICAgICB0aGlzLl90eXBlID0gX3R5cGU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX3NldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc2V0KHZhbHVlKSB7XG4gICAgICBpZiAoIXRoaXMuX3R5cGUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBfdHlwZW9mKHZhbHVlKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aGlzLnR5cGUoU1ZHTnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChDb2xvci5pc0NvbG9yKHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy50eXBlKENvbG9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRlbGltaXRlci50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy50eXBlKHBhdGhMZXR0ZXJzLnRlc3QodmFsdWUpID8gUGF0aEFycmF5IDogU1ZHQXJyYXkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyQW5kVW5pdC50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy50eXBlKFNWR051bWJlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHlwZShOb25Nb3JwaGFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb3JwaGFibGVUeXBlcy5pbmRleE9mKHZhbHVlLmNvbnN0cnVjdG9yKSA+IC0xKSB7XG4gICAgICAgICAgdGhpcy50eXBlKHZhbHVlLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRoaXMudHlwZShTVkdBcnJheSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aGlzLnR5cGUoT2JqZWN0QmFnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnR5cGUoTm9uTW9ycGhhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0gbmV3IHRoaXMuX3R5cGUodmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5fdHlwZSA9PT0gQ29sb3IpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fdG8gPyByZXN1bHRbdGhpcy5fdG9bNF1dKCkgOiB0aGlzLl9mcm9tID8gcmVzdWx0W3RoaXMuX2Zyb21bNF1dKCkgOiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCA9IHJlc3VsdC50b0FycmF5KCk7XG4gICAgICB0aGlzLl9tb3JwaE9iaiA9IHRoaXMuX21vcnBoT2JqIHx8IG5ldyB0aGlzLl90eXBlKCk7XG4gICAgICB0aGlzLl9jb250ZXh0ID0gdGhpcy5fY29udGV4dCB8fCBBcnJheS5hcHBseShudWxsLCBBcnJheShyZXN1bHQubGVuZ3RoKSkubWFwKE9iamVjdCkubWFwKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIG8uZG9uZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBvO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGVwcGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXBwZXIoX3N0ZXBwZXIpIHtcbiAgICAgIGlmIChfc3RlcHBlciA9PSBudWxsKSByZXR1cm4gdGhpcy5fc3RlcHBlcjtcbiAgICAgIHRoaXMuX3N0ZXBwZXIgPSBfc3RlcHBlcjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICB2YXIgY29tcGxldGUgPSB0aGlzLl9jb250ZXh0Lm1hcCh0aGlzLl9zdGVwcGVyLmRvbmUpLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgY3Vycikge1xuICAgICAgICByZXR1cm4gbGFzdCAmJiBjdXJyO1xuICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgIHJldHVybiBjb21wbGV0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXQocG9zKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5fbW9ycGhPYmouZnJvbUFycmF5KHRoaXMuX2Zyb20ubWFwKGZ1bmN0aW9uIChpLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuX3N0ZXBwZXIuc3RlcChpLCBfdGhpcy5fdG9baW5kZXhdLCBwb3MsIF90aGlzLl9jb250ZXh0W2luZGV4XSwgX3RoaXMuX2NvbnRleHQpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNb3JwaGFibGU7XG59KCk7XG52YXIgTm9uTW9ycGhhYmxlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTm9uTW9ycGhhYmxlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOb25Nb3JwaGFibGUpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTm9uTW9ycGhhYmxlLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQodmFsKSB7XG4gICAgICB2YWwgPSBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWxbMF0gOiB2YWw7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZhbHVlT2ZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICByZXR1cm4gW3RoaXMudmFsdWVdO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOb25Nb3JwaGFibGU7XG59KCk7XG52YXIgVHJhbnNmb3JtQmFnID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVHJhbnNmb3JtQmFnKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc2Zvcm1CYWcpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVHJhbnNmb3JtQmFnLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQob2JqKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iaiA9IHtcbiAgICAgICAgICBzY2FsZVg6IG9ialswXSxcbiAgICAgICAgICBzY2FsZVk6IG9ialsxXSxcbiAgICAgICAgICBzaGVhcjogb2JqWzJdLFxuICAgICAgICAgIHJvdGF0ZTogb2JqWzNdLFxuICAgICAgICAgIHRyYW5zbGF0ZVg6IG9ials0XSxcbiAgICAgICAgICB0cmFuc2xhdGVZOiBvYmpbNV0sXG4gICAgICAgICAgb3JpZ2luWDogb2JqWzZdLFxuICAgICAgICAgIG9yaWdpblk6IG9ials3XVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIFRyYW5zZm9ybUJhZy5kZWZhdWx0cywgb2JqKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b0FycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICB2YXIgdiA9IHRoaXM7XG4gICAgICByZXR1cm4gW3Yuc2NhbGVYLCB2LnNjYWxlWSwgdi5zaGVhciwgdi5yb3RhdGUsIHYudHJhbnNsYXRlWCwgdi50cmFuc2xhdGVZLCB2Lm9yaWdpblgsIHYub3JpZ2luWV07XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRyYW5zZm9ybUJhZztcbn0oKTtcblRyYW5zZm9ybUJhZy5kZWZhdWx0cyA9IHtcbiAgc2NhbGVYOiAxLFxuICBzY2FsZVk6IDEsXG4gIHNoZWFyOiAwLFxuICByb3RhdGU6IDAsXG4gIHRyYW5zbGF0ZVg6IDAsXG4gIHRyYW5zbGF0ZVk6IDAsXG4gIG9yaWdpblg6IDAsXG4gIG9yaWdpblk6IDBcbn07XG52YXIgT2JqZWN0QmFnID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gT2JqZWN0QmFnKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPYmplY3RCYWcpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoT2JqZWN0QmFnLCBbe1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQob2JqT3JBcnIpIHtcbiAgICAgIHRoaXMudmFsdWVzID0gW107XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iak9yQXJyKSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IG9iak9yQXJyO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9iak9yQXJyID0gb2JqT3JBcnIgfHwge307XG4gICAgICB2YXIgZW50cmllcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpIGluIG9iak9yQXJyKSB7XG4gICAgICAgIGVudHJpZXMucHVzaChbaSwgb2JqT3JBcnJbaV1dKTtcbiAgICAgIH1cblxuICAgICAgZW50cmllcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhWzBdIC0gYlswXTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy52YWx1ZXMgPSBlbnRyaWVzLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgY3Vycikge1xuICAgICAgICByZXR1cm4gbGFzdC5jb25jYXQoY3Vycik7XG4gICAgICB9LCBbXSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVPZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgdmFyIGFyciA9IHRoaXMudmFsdWVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgIG9ialthcnJbaV1dID0gYXJyW2kgKyAxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9BcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBPYmplY3RCYWc7XG59KCk7XG52YXIgbW9ycGhhYmxlVHlwZXMgPSBbTm9uTW9ycGhhYmxlLCBUcmFuc2Zvcm1CYWcsIE9iamVjdEJhZ107XG5mdW5jdGlvbiByZWdpc3Rlck1vcnBoYWJsZVR5cGUoKSB7XG4gIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgbW9ycGhhYmxlVHlwZXMucHVzaC5hcHBseShtb3JwaGFibGVUeXBlcywgX3RvQ29uc3VtYWJsZUFycmF5KFtdLmNvbmNhdCh0eXBlKSkpO1xufVxuZnVuY3Rpb24gbWFrZU1vcnBoYWJsZSgpIHtcbiAgZXh0ZW5kKG1vcnBoYWJsZVR5cGVzLCB7XG4gICAgdG86IGZ1bmN0aW9uIHRvKHZhbCkge1xuICAgICAgcmV0dXJuIG5ldyBNb3JwaGFibGUoKS50eXBlKHRoaXMuY29uc3RydWN0b3IpLmZyb20odGhpcy52YWx1ZU9mKCkpLnRvKHZhbCk7XG4gICAgfSxcbiAgICBmcm9tQXJyYXk6IGZ1bmN0aW9uIGZyb21BcnJheShhcnIpIHtcbiAgICAgIHRoaXMuaW5pdChhcnIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcbn1cblxudmFyIFBhdGggPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9TaGFwZSkge1xuICBfaW5oZXJpdHMoUGF0aCwgX1NoYXBlKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gUGF0aChub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBhdGgpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihQYXRoKS5jYWxsKHRoaXMsIG5vZGVPck5ldygncGF0aCcsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gR2V0IGFycmF5XG5cblxuICBfY3JlYXRlQ2xhc3MoUGF0aCwgW3tcbiAgICBrZXk6IFwiYXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXJyYXkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXJyYXkgfHwgKHRoaXMuX2FycmF5ID0gbmV3IFBhdGhBcnJheSh0aGlzLmF0dHIoJ2QnKSkpO1xuICAgIH0gLy8gUGxvdCBuZXcgcGF0aFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicGxvdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwbG90KGQpIHtcbiAgICAgIHJldHVybiBkID09IG51bGwgPyB0aGlzLmFycmF5KCkgOiB0aGlzLmNsZWFyKCkuYXR0cignZCcsIHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IGQgOiB0aGlzLl9hcnJheSA9IG5ldyBQYXRoQXJyYXkoZCkpO1xuICAgIH0gLy8gQ2xlYXIgYXJyYXkgY2FjaGVcblxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgZGVsZXRlIHRoaXMuX2FycmF5O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxuXG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2QnLCB0aGlzLmFycmF5KCkubW92ZSh4LCB5KSk7XG4gICAgfSAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHgtYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwieFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB4KF94KSB7XG4gICAgICByZXR1cm4gX3ggPT0gbnVsbCA/IHRoaXMuYmJveCgpLnggOiB0aGlzLm1vdmUoX3gsIHRoaXMuYmJveCgpLnkpO1xuICAgIH0gLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB5LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcInlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geShfeSkge1xuICAgICAgcmV0dXJuIF95ID09IG51bGwgPyB0aGlzLmJib3goKS55IDogdGhpcy5tb3ZlKHRoaXMuYmJveCgpLngsIF95KTtcbiAgICB9IC8vIFNldCBlbGVtZW50IHNpemUgdG8gZ2l2ZW4gd2lkdGggYW5kIGhlaWdodFxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2QnLCB0aGlzLmFycmF5KCkuc2l6ZShwLndpZHRoLCBwLmhlaWdodCkpO1xuICAgIH0gLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcIndpZHRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdpZHRoKF93aWR0aCkge1xuICAgICAgcmV0dXJuIF93aWR0aCA9PSBudWxsID8gdGhpcy5iYm94KCkud2lkdGggOiB0aGlzLnNpemUoX3dpZHRoLCB0aGlzLmJib3goKS5oZWlnaHQpO1xuICAgIH0gLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJoZWlnaHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGVpZ2h0KF9oZWlnaHQpIHtcbiAgICAgIHJldHVybiBfaGVpZ2h0ID09IG51bGwgPyB0aGlzLmJib3goKS5oZWlnaHQgOiB0aGlzLnNpemUodGhpcy5iYm94KCkud2lkdGgsIF9oZWlnaHQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRhcmdldHMoKSB7XG4gICAgICByZXR1cm4gYmFzZUZpbmQoJ3N2ZyB0ZXh0cGF0aCBbaHJlZio9XCInICsgdGhpcy5pZCgpICsgJ1wiXScpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQYXRoO1xufShTaGFwZSk7IC8vIERlZmluZSBtb3JwaGFibGUgYXJyYXlcblBhdGgucHJvdG90eXBlLk1vcnBoQXJyYXkgPSBQYXRoQXJyYXk7IC8vIEFkZCBwYXJlbnQgbWV0aG9kXG5cbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcGF0aCBlbGVtZW50XG4gICAgcGF0aDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKGQpIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBQYXRoKCkpLnBsb3QoZCB8fCBuZXcgUGF0aEFycmF5KCkpO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoUGF0aCwgJ1BhdGgnKTtcblxuZnVuY3Rpb24gYXJyYXkoKSB7XG4gIHJldHVybiB0aGlzLl9hcnJheSB8fCAodGhpcy5fYXJyYXkgPSBuZXcgUG9pbnRBcnJheSh0aGlzLmF0dHIoJ3BvaW50cycpKSk7XG59IC8vIFBsb3QgbmV3IHBhdGhcblxuZnVuY3Rpb24gcGxvdChwKSB7XG4gIHJldHVybiBwID09IG51bGwgPyB0aGlzLmFycmF5KCkgOiB0aGlzLmNsZWFyKCkuYXR0cigncG9pbnRzJywgdHlwZW9mIHAgPT09ICdzdHJpbmcnID8gcCA6IHRoaXMuX2FycmF5ID0gbmV3IFBvaW50QXJyYXkocCkpO1xufSAvLyBDbGVhciBhcnJheSBjYWNoZVxuXG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgZGVsZXRlIHRoaXMuX2FycmF5O1xuICByZXR1cm4gdGhpcztcbn0gLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXJcblxuZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gIHJldHVybiB0aGlzLmF0dHIoJ3BvaW50cycsIHRoaXMuYXJyYXkoKS5tb3ZlKHgsIHkpKTtcbn0gLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XG5cbmZ1bmN0aW9uIHNpemUod2lkdGgsIGhlaWdodCkge1xuICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodCk7XG4gIHJldHVybiB0aGlzLmF0dHIoJ3BvaW50cycsIHRoaXMuYXJyYXkoKS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KSk7XG59XG5cbnZhciBwb2x5ID0gKHtcblx0X19wcm90b19fOiBudWxsLFxuXHRhcnJheTogYXJyYXksXG5cdHBsb3Q6IHBsb3QsXG5cdGNsZWFyOiBjbGVhcixcblx0bW92ZTogbW92ZSxcblx0c2l6ZTogc2l6ZVxufSk7XG5cbnZhciBQb2x5Z29uID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKFBvbHlnb24sIF9TaGFwZSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFBvbHlnb24obm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb2x5Z29uKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUG9seWdvbikuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3BvbHlnb24nLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgcmV0dXJuIFBvbHlnb247XG59KFNoYXBlKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcG9seWdvbiBlbGVtZW50XG4gICAgcG9seWdvbjogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHApIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBQb2x5Z29uKCkpLnBsb3QocCB8fCBuZXcgUG9pbnRBcnJheSgpKTtcbiAgICB9KVxuICB9XG59KTtcbmV4dGVuZChQb2x5Z29uLCBwb2ludGVkKTtcbmV4dGVuZChQb2x5Z29uLCBwb2x5KTtcbnJlZ2lzdGVyKFBvbHlnb24sICdQb2x5Z29uJyk7XG5cbnZhciBQb2x5bGluZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhQb2x5bGluZSwgX1NoYXBlKTtcblxuICAvLyBJbml0aWFsaXplIG5vZGVcbiAgZnVuY3Rpb24gUG9seWxpbmUobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb2x5bGluZSk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFBvbHlsaW5lKS5jYWxsKHRoaXMsIG5vZGVPck5ldygncG9seWxpbmUnLCBub2RlKSwgbm9kZSkpO1xuICB9XG5cbiAgcmV0dXJuIFBvbHlsaW5lO1xufShTaGFwZSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgYSB3cmFwcGVkIHBvbHlnb24gZWxlbWVudFxuICAgIHBvbHlsaW5lOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAocCkge1xuICAgICAgLy8gbWFrZSBzdXJlIHBsb3QgaXMgY2FsbGVkIGFzIGEgc2V0dGVyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFBvbHlsaW5lKCkpLnBsb3QocCB8fCBuZXcgUG9pbnRBcnJheSgpKTtcbiAgICB9KVxuICB9XG59KTtcbmV4dGVuZChQb2x5bGluZSwgcG9pbnRlZCk7XG5leHRlbmQoUG9seWxpbmUsIHBvbHkpO1xucmVnaXN0ZXIoUG9seWxpbmUsICdQb2x5bGluZScpO1xuXG52YXIgUmVjdCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1NoYXBlKSB7XG4gIF9pbmhlcml0cyhSZWN0LCBfU2hhcGUpO1xuXG4gIC8vIEluaXRpYWxpemUgbm9kZVxuICBmdW5jdGlvbiBSZWN0KG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVjdCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFJlY3QpLmNhbGwodGhpcywgbm9kZU9yTmV3KCdyZWN0Jywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIHJldHVybiBSZWN0O1xufShTaGFwZSk7XG5leHRlbmQoUmVjdCwge1xuICByeDogcngsXG4gIHJ5OiByeVxufSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgYSByZWN0IGVsZW1lbnRcbiAgICByZWN0OiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAod2lkdGgsIGhlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBSZWN0KCkpLnNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihSZWN0LCAnUmVjdCcpO1xuXG52YXIgbWF4JDMgPSBNYXRoLm1heDtcbnZhciBtaW4kNCA9IE1hdGgubWluO1xudmFyIE1BWF9TQUZFX0lOVEVHRVIkMSA9IDB4MUZGRkZGRkZGRkZGRkY7XG52YXIgTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCA9ICdNYXhpbXVtIGFsbG93ZWQgbGVuZ3RoIGV4Y2VlZGVkJztcblxuLy8gYEFycmF5LnByb3RvdHlwZS5zcGxpY2VgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNwbGljZVxuLy8gd2l0aCBhZGRpbmcgc3VwcG9ydCBvZiBAQHNwZWNpZXNcbl9leHBvcnQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdzcGxpY2UnKSB9LCB7XG4gIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCAvKiAsIC4uLml0ZW1zICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBhY3R1YWxTdGFydCA9IHRvQWJzb2x1dGVJbmRleChzdGFydCwgbGVuKTtcbiAgICB2YXIgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgaW5zZXJ0Q291bnQsIGFjdHVhbERlbGV0ZUNvdW50LCBBLCBrLCBmcm9tLCB0bztcbiAgICBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAwKSB7XG4gICAgICBpbnNlcnRDb3VudCA9IGFjdHVhbERlbGV0ZUNvdW50ID0gMDtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c0xlbmd0aCA9PT0gMSkge1xuICAgICAgaW5zZXJ0Q291bnQgPSAwO1xuICAgICAgYWN0dWFsRGVsZXRlQ291bnQgPSBsZW4gLSBhY3R1YWxTdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zZXJ0Q291bnQgPSBhcmd1bWVudHNMZW5ndGggLSAyO1xuICAgICAgYWN0dWFsRGVsZXRlQ291bnQgPSBtaW4kNChtYXgkMyh0b0ludGVnZXIoZGVsZXRlQ291bnQpLCAwKSwgbGVuIC0gYWN0dWFsU3RhcnQpO1xuICAgIH1cbiAgICBpZiAobGVuICsgaW5zZXJ0Q291bnQgLSBhY3R1YWxEZWxldGVDb3VudCA+IE1BWF9TQUZFX0lOVEVHRVIkMSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKE1BWElNVU1fQUxMT1dFRF9MRU5HVEhfRVhDRUVERUQpO1xuICAgIH1cbiAgICBBID0gYXJyYXlTcGVjaWVzQ3JlYXRlKE8sIGFjdHVhbERlbGV0ZUNvdW50KTtcbiAgICBmb3IgKGsgPSAwOyBrIDwgYWN0dWFsRGVsZXRlQ291bnQ7IGsrKykge1xuICAgICAgZnJvbSA9IGFjdHVhbFN0YXJ0ICsgaztcbiAgICAgIGlmIChmcm9tIGluIE8pIGNyZWF0ZVByb3BlcnR5KEEsIGssIE9bZnJvbV0pO1xuICAgIH1cbiAgICBBLmxlbmd0aCA9IGFjdHVhbERlbGV0ZUNvdW50O1xuICAgIGlmIChpbnNlcnRDb3VudCA8IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICBmb3IgKGsgPSBhY3R1YWxTdGFydDsgayA8IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50OyBrKyspIHtcbiAgICAgICAgZnJvbSA9IGsgKyBhY3R1YWxEZWxldGVDb3VudDtcbiAgICAgICAgdG8gPSBrICsgaW5zZXJ0Q291bnQ7XG4gICAgICAgIGlmIChmcm9tIGluIE8pIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB9XG4gICAgICBmb3IgKGsgPSBsZW47IGsgPiBsZW4gLSBhY3R1YWxEZWxldGVDb3VudCArIGluc2VydENvdW50OyBrLS0pIGRlbGV0ZSBPW2sgLSAxXTtcbiAgICB9IGVsc2UgaWYgKGluc2VydENvdW50ID4gYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgIGZvciAoayA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50OyBrID4gYWN0dWFsU3RhcnQ7IGstLSkge1xuICAgICAgICBmcm9tID0gayArIGFjdHVhbERlbGV0ZUNvdW50IC0gMTtcbiAgICAgICAgdG8gPSBrICsgaW5zZXJ0Q291bnQgLSAxO1xuICAgICAgICBpZiAoZnJvbSBpbiBPKSBPW3RvXSA9IE9bZnJvbV07XG4gICAgICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGsgPSAwOyBrIDwgaW5zZXJ0Q291bnQ7IGsrKykge1xuICAgICAgT1trICsgYWN0dWFsU3RhcnRdID0gYXJndW1lbnRzW2sgKyAyXTtcbiAgICB9XG4gICAgTy5sZW5ndGggPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudCArIGluc2VydENvdW50O1xuICAgIHJldHVybiBBO1xuICB9XG59KTtcblxudmFyIFF1ZXVlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUXVldWUoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFF1ZXVlKTtcblxuICAgIHRoaXMuX2ZpcnN0ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0ID0gbnVsbDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhRdWV1ZSwgW3tcbiAgICBrZXk6IFwicHVzaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoKHZhbHVlKSB7XG4gICAgICAvLyBBbiBpdGVtIHN0b3JlcyBhbiBpZCBhbmQgdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAgICB2YXIgaXRlbSA9IHZhbHVlLm5leHQgPyB2YWx1ZSA6IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBuZXh0OiBudWxsLFxuICAgICAgICBwcmV2OiBudWxsXG4gICAgICB9OyAvLyBEZWFsIHdpdGggdGhlIHF1ZXVlIGJlaW5nIGVtcHR5IG9yIHBvcHVsYXRlZFxuXG4gICAgICBpZiAodGhpcy5fbGFzdCkge1xuICAgICAgICBpdGVtLnByZXYgPSB0aGlzLl9sYXN0O1xuICAgICAgICB0aGlzLl9sYXN0Lm5leHQgPSBpdGVtO1xuICAgICAgICB0aGlzLl9sYXN0ID0gaXRlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2xhc3QgPSBpdGVtO1xuICAgICAgICB0aGlzLl9maXJzdCA9IGl0ZW07XG4gICAgICB9IC8vIFJldHVybiB0aGUgY3VycmVudCBpdGVtXG5cblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNoaWZ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNoaWZ0KCkge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UgaGF2ZSBhIHZhbHVlXG4gICAgICB2YXIgcmVtb3ZlID0gdGhpcy5fZmlyc3Q7XG4gICAgICBpZiAoIXJlbW92ZSkgcmV0dXJuIG51bGw7IC8vIElmIHdlIGRvLCByZW1vdmUgaXQgYW5kIHJlbGluayB0aGluZ3NcblxuICAgICAgdGhpcy5fZmlyc3QgPSByZW1vdmUubmV4dDtcbiAgICAgIGlmICh0aGlzLl9maXJzdCkgdGhpcy5fZmlyc3QucHJldiA9IG51bGw7XG4gICAgICB0aGlzLl9sYXN0ID0gdGhpcy5fZmlyc3QgPyB0aGlzLl9sYXN0IDogbnVsbDtcbiAgICAgIHJldHVybiByZW1vdmUudmFsdWU7XG4gICAgfSAvLyBTaG93cyB1cyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgbGlzdFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZmlyc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlyc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmlyc3QgJiYgdGhpcy5fZmlyc3QudmFsdWU7XG4gICAgfSAvLyBTaG93cyB1cyB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJsYXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxhc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGFzdCAmJiB0aGlzLl9sYXN0LnZhbHVlO1xuICAgIH0gLy8gUmVtb3ZlcyB0aGUgaXRlbSB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIHRoZSBwdXNoXG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKGl0ZW0pIHtcbiAgICAgIC8vIFJlbGluayB0aGUgcHJldmlvdXMgaXRlbVxuICAgICAgaWYgKGl0ZW0ucHJldikgaXRlbS5wcmV2Lm5leHQgPSBpdGVtLm5leHQ7XG4gICAgICBpZiAoaXRlbS5uZXh0KSBpdGVtLm5leHQucHJldiA9IGl0ZW0ucHJldjtcbiAgICAgIGlmIChpdGVtID09PSB0aGlzLl9sYXN0KSB0aGlzLl9sYXN0ID0gaXRlbS5wcmV2O1xuICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuX2ZpcnN0KSB0aGlzLl9maXJzdCA9IGl0ZW0ubmV4dDsgLy8gSW52YWxpZGF0ZSBpdGVtXG5cbiAgICAgIGl0ZW0ucHJldiA9IG51bGw7XG4gICAgICBpdGVtLm5leHQgPSBudWxsO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBRdWV1ZTtcbn0oKTtcblxudmFyIEFuaW1hdG9yID0ge1xuICBuZXh0RHJhdzogbnVsbCxcbiAgZnJhbWVzOiBuZXcgUXVldWUoKSxcbiAgdGltZW91dHM6IG5ldyBRdWV1ZSgpLFxuICBpbW1lZGlhdGVzOiBuZXcgUXVldWUoKSxcbiAgdGltZXI6IGZ1bmN0aW9uIHRpbWVyKCkge1xuICAgIHJldHVybiBnbG9iYWxzLndpbmRvdy5wZXJmb3JtYW5jZSB8fCBnbG9iYWxzLndpbmRvdy5EYXRlO1xuICB9LFxuICB0cmFuc2Zvcm1zOiBbXSxcbiAgZnJhbWU6IGZ1bmN0aW9uIGZyYW1lKGZuKSB7XG4gICAgLy8gU3RvcmUgdGhlIG5vZGVcbiAgICB2YXIgbm9kZSA9IEFuaW1hdG9yLmZyYW1lcy5wdXNoKHtcbiAgICAgIHJ1bjogZm5cbiAgICB9KTsgLy8gUmVxdWVzdCBhbiBhbmltYXRpb24gZnJhbWUgaWYgd2UgZG9uJ3QgaGF2ZSBvbmVcblxuICAgIGlmIChBbmltYXRvci5uZXh0RHJhdyA9PT0gbnVsbCkge1xuICAgICAgQW5pbWF0b3IubmV4dERyYXcgPSBnbG9iYWxzLndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoQW5pbWF0b3IuX2RyYXcpO1xuICAgIH0gLy8gUmV0dXJuIHRoZSBub2RlIHNvIHdlIGNhbiByZW1vdmUgaXQgZWFzaWx5XG5cblxuICAgIHJldHVybiBub2RlO1xuICB9LFxuICB0aW1lb3V0OiBmdW5jdGlvbiB0aW1lb3V0KGZuLCBkZWxheSkge1xuICAgIGRlbGF5ID0gZGVsYXkgfHwgMDsgLy8gV29yayBvdXQgd2hlbiB0aGUgZXZlbnQgc2hvdWxkIGZpcmVcblxuICAgIHZhciB0aW1lID0gQW5pbWF0b3IudGltZXIoKS5ub3coKSArIGRlbGF5OyAvLyBBZGQgdGhlIHRpbWVvdXQgdG8gdGhlIGVuZCBvZiB0aGUgcXVldWVcblxuICAgIHZhciBub2RlID0gQW5pbWF0b3IudGltZW91dHMucHVzaCh7XG4gICAgICBydW46IGZuLFxuICAgICAgdGltZTogdGltZVxuICAgIH0pOyAvLyBSZXF1ZXN0IGFub3RoZXIgYW5pbWF0aW9uIGZyYW1lIGlmIHdlIG5lZWQgb25lXG5cbiAgICBpZiAoQW5pbWF0b3IubmV4dERyYXcgPT09IG51bGwpIHtcbiAgICAgIEFuaW1hdG9yLm5leHREcmF3ID0gZ2xvYmFscy53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKEFuaW1hdG9yLl9kcmF3KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcbiAgaW1tZWRpYXRlOiBmdW5jdGlvbiBpbW1lZGlhdGUoZm4pIHtcbiAgICAvLyBBZGQgdGhlIGltbWVkaWF0ZSBmbiB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuICAgIHZhciBub2RlID0gQW5pbWF0b3IuaW1tZWRpYXRlcy5wdXNoKGZuKTsgLy8gUmVxdWVzdCBhbm90aGVyIGFuaW1hdGlvbiBmcmFtZSBpZiB3ZSBuZWVkIG9uZVxuXG4gICAgaWYgKEFuaW1hdG9yLm5leHREcmF3ID09PSBudWxsKSB7XG4gICAgICBBbmltYXRvci5uZXh0RHJhdyA9IGdsb2JhbHMud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShBbmltYXRvci5fZHJhdyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG4gIGNhbmNlbEZyYW1lOiBmdW5jdGlvbiBjYW5jZWxGcmFtZShub2RlKSB7XG4gICAgbm9kZSAhPSBudWxsICYmIEFuaW1hdG9yLmZyYW1lcy5yZW1vdmUobm9kZSk7XG4gIH0sXG4gIGNsZWFyVGltZW91dDogZnVuY3Rpb24gY2xlYXJUaW1lb3V0KG5vZGUpIHtcbiAgICBub2RlICE9IG51bGwgJiYgQW5pbWF0b3IudGltZW91dHMucmVtb3ZlKG5vZGUpO1xuICB9LFxuICBjYW5jZWxJbW1lZGlhdGU6IGZ1bmN0aW9uIGNhbmNlbEltbWVkaWF0ZShub2RlKSB7XG4gICAgbm9kZSAhPSBudWxsICYmIEFuaW1hdG9yLmltbWVkaWF0ZXMucmVtb3ZlKG5vZGUpO1xuICB9LFxuICBfZHJhdzogZnVuY3Rpb24gX2RyYXcobm93KSB7XG4gICAgLy8gUnVuIGFsbCB0aGUgdGltZW91dHMgd2UgY2FuIHJ1biwgaWYgdGhleSBhcmUgbm90IHJlYWR5IHlldCwgYWRkIHRoZW1cbiAgICAvLyB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZSBpbW1lZGlhdGVseSEgKGJhZCB0aW1lb3V0cyEhISBbc2FyY2FzbV0pXG4gICAgdmFyIG5leHRUaW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgbGFzdFRpbWVvdXQgPSBBbmltYXRvci50aW1lb3V0cy5sYXN0KCk7XG5cbiAgICB3aGlsZSAobmV4dFRpbWVvdXQgPSBBbmltYXRvci50aW1lb3V0cy5zaGlmdCgpKSB7XG4gICAgICAvLyBSdW4gdGhlIHRpbWVvdXQgaWYgaXRzIHRpbWUsIG9yIHB1c2ggaXQgdG8gdGhlIGVuZFxuICAgICAgaWYgKG5vdyA+PSBuZXh0VGltZW91dC50aW1lKSB7XG4gICAgICAgIG5leHRUaW1lb3V0LnJ1bigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQW5pbWF0b3IudGltZW91dHMucHVzaChuZXh0VGltZW91dCk7XG4gICAgICB9IC8vIElmIHdlIGhpdCB0aGUgbGFzdCBpdGVtLCB3ZSBzaG91bGQgc3RvcCBzaGlmdGluZyBvdXQgbW9yZSBpdGVtc1xuXG5cbiAgICAgIGlmIChuZXh0VGltZW91dCA9PT0gbGFzdFRpbWVvdXQpIGJyZWFrO1xuICAgIH0gLy8gUnVuIGFsbCBvZiB0aGUgYW5pbWF0aW9uIGZyYW1lc1xuXG5cbiAgICB2YXIgbmV4dEZyYW1lID0gbnVsbDtcbiAgICB2YXIgbGFzdEZyYW1lID0gQW5pbWF0b3IuZnJhbWVzLmxhc3QoKTtcblxuICAgIHdoaWxlIChuZXh0RnJhbWUgIT09IGxhc3RGcmFtZSAmJiAobmV4dEZyYW1lID0gQW5pbWF0b3IuZnJhbWVzLnNoaWZ0KCkpKSB7XG4gICAgICBuZXh0RnJhbWUucnVuKG5vdyk7XG4gICAgfVxuXG4gICAgdmFyIG5leHRJbW1lZGlhdGUgPSBudWxsO1xuXG4gICAgd2hpbGUgKG5leHRJbW1lZGlhdGUgPSBBbmltYXRvci5pbW1lZGlhdGVzLnNoaWZ0KCkpIHtcbiAgICAgIG5leHRJbW1lZGlhdGUoKTtcbiAgICB9IC8vIElmIHdlIGhhdmUgcmVtYWluaW5nIHRpbWVvdXRzIG9yIGZyYW1lcywgZHJhdyB1bnRpbCB3ZSBkb24ndCBhbnltb3JlXG5cblxuICAgIEFuaW1hdG9yLm5leHREcmF3ID0gQW5pbWF0b3IudGltZW91dHMuZmlyc3QoKSB8fCBBbmltYXRvci5mcmFtZXMuZmlyc3QoKSA/IGdsb2JhbHMud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShBbmltYXRvci5fZHJhdykgOiBudWxsO1xuICB9XG59O1xuXG52YXIgbWFrZVNjaGVkdWxlID0gZnVuY3Rpb24gbWFrZVNjaGVkdWxlKHJ1bm5lckluZm8pIHtcbiAgdmFyIHN0YXJ0ID0gcnVubmVySW5mby5zdGFydDtcbiAgdmFyIGR1cmF0aW9uID0gcnVubmVySW5mby5ydW5uZXIuZHVyYXRpb24oKTtcbiAgdmFyIGVuZCA9IHN0YXJ0ICsgZHVyYXRpb247XG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHN0YXJ0LFxuICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICBlbmQ6IGVuZCxcbiAgICBydW5uZXI6IHJ1bm5lckluZm8ucnVubmVyXG4gIH07XG59O1xuXG52YXIgZGVmYXVsdFNvdXJjZSA9IGZ1bmN0aW9uIGRlZmF1bHRTb3VyY2UoKSB7XG4gIHZhciB3ID0gZ2xvYmFscy53aW5kb3c7XG4gIHJldHVybiAody5wZXJmb3JtYW5jZSB8fCB3LkRhdGUpLm5vdygpO1xufTtcblxudmFyIFRpbWVsaW5lID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRXZlbnRUYXJnZXQpIHtcbiAgX2luaGVyaXRzKFRpbWVsaW5lLCBfRXZlbnRUYXJnZXQpO1xuXG4gIC8vIENvbnN0cnVjdCBhIG5ldyB0aW1lbGluZSBvbiB0aGUgZ2l2ZW4gZWxlbWVudFxuICBmdW5jdGlvbiBUaW1lbGluZSgpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgdGltZVNvdXJjZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZGVmYXVsdFNvdXJjZTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUaW1lbGluZSk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihUaW1lbGluZSkuY2FsbCh0aGlzKSk7XG4gICAgX3RoaXMuX3RpbWVTb3VyY2UgPSB0aW1lU291cmNlOyAvLyBTdG9yZSB0aGUgdGltaW5nIHZhcmlhYmxlc1xuXG4gICAgX3RoaXMuX3N0YXJ0VGltZSA9IDA7XG4gICAgX3RoaXMuX3NwZWVkID0gMS4wOyAvLyBEZXRlcm1pbmVzIGhvdyBsb25nIGEgcnVubmVyIGlzIGhvbGQgaW4gbWVtb3J5LiBDYW4gYmUgYSBkdCBvciB0cnVlL2ZhbHNlXG5cbiAgICBfdGhpcy5fcGVyc2lzdCA9IDA7IC8vIEtlZXAgdHJhY2sgb2YgdGhlIHJ1bm5pbmcgYW5pbWF0aW9ucyBhbmQgdGhlaXIgc3RhcnRpbmcgcGFyYW1ldGVyc1xuXG4gICAgX3RoaXMuX25leHRGcmFtZSA9IG51bGw7XG4gICAgX3RoaXMuX3BhdXNlZCA9IHRydWU7XG4gICAgX3RoaXMuX3J1bm5lcnMgPSBbXTtcbiAgICBfdGhpcy5fcnVubmVySWRzID0gW107XG4gICAgX3RoaXMuX2xhc3RSdW5uZXJJZCA9IC0xO1xuICAgIF90aGlzLl90aW1lID0gMDtcbiAgICBfdGhpcy5fbGFzdFNvdXJjZVRpbWUgPSAwO1xuICAgIF90aGlzLl9sYXN0U3RlcFRpbWUgPSAwOyAvLyBNYWtlIHN1cmUgdGhhdCBzdGVwIGlzIGFsd2F5cyBjYWxsZWQgaW4gY2xhc3MgY29udGV4dFxuXG4gICAgX3RoaXMuX3N0ZXAgPSBfdGhpcy5fc3RlcEZuLmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIGZhbHNlKTtcbiAgICBfdGhpcy5fc3RlcEltbWVkaWF0ZSA9IF90aGlzLl9zdGVwRm4uYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgdHJ1ZSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9IC8vIHNjaGVkdWxlcyBhIHJ1bm5lciBvbiB0aGUgdGltZWxpbmVcblxuXG4gIF9jcmVhdGVDbGFzcyhUaW1lbGluZSwgW3tcbiAgICBrZXk6IFwic2NoZWR1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2NoZWR1bGUocnVubmVyLCBkZWxheSwgd2hlbikge1xuICAgICAgaWYgKHJ1bm5lciA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5uZXJzLm1hcChtYWtlU2NoZWR1bGUpO1xuICAgICAgfSAvLyBUaGUgc3RhcnQgdGltZSBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIGNhbiBlaXRoZXIgYmUgZ2l2ZW4gZXhwbGljaXRseSxcbiAgICAgIC8vIGRlcml2ZWQgZnJvbSB0aGUgY3VycmVudCB0aW1lbGluZSB0aW1lIG9yIGl0IGNhbiBiZSByZWxhdGl2ZSB0byB0aGVcbiAgICAgIC8vIGxhc3Qgc3RhcnQgdGltZSB0byBjaGFpbiBhbmltYXRpb25zIGRpcmVjbHR5XG5cblxuICAgICAgdmFyIGFic29sdXRlU3RhcnRUaW1lID0gMDtcbiAgICAgIHZhciBlbmRUaW1lID0gdGhpcy5nZXRFbmRUaW1lKCk7XG4gICAgICBkZWxheSA9IGRlbGF5IHx8IDA7IC8vIFdvcmsgb3V0IHdoZW4gdG8gc3RhcnQgdGhlIGFuaW1hdGlvblxuXG4gICAgICBpZiAod2hlbiA9PSBudWxsIHx8IHdoZW4gPT09ICdsYXN0JyB8fCB3aGVuID09PSAnYWZ0ZXInKSB7XG4gICAgICAgIC8vIFRha2UgdGhlIGxhc3QgdGltZSBhbmQgaW5jcmVtZW50XG4gICAgICAgIGFic29sdXRlU3RhcnRUaW1lID0gZW5kVGltZTtcbiAgICAgIH0gZWxzZSBpZiAod2hlbiA9PT0gJ2Fic29sdXRlJyB8fCB3aGVuID09PSAnc3RhcnQnKSB7XG4gICAgICAgIGFic29sdXRlU3RhcnRUaW1lID0gZGVsYXk7XG4gICAgICAgIGRlbGF5ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAod2hlbiA9PT0gJ25vdycpIHtcbiAgICAgICAgYWJzb2x1dGVTdGFydFRpbWUgPSB0aGlzLl90aW1lO1xuICAgICAgfSBlbHNlIGlmICh3aGVuID09PSAncmVsYXRpdmUnKSB7XG4gICAgICAgIHZhciBfcnVubmVySW5mbyA9IHRoaXMuX3J1bm5lcnNbcnVubmVyLmlkXTtcblxuICAgICAgICBpZiAoX3J1bm5lckluZm8pIHtcbiAgICAgICAgICBhYnNvbHV0ZVN0YXJ0VGltZSA9IF9ydW5uZXJJbmZvLnN0YXJ0ICsgZGVsYXk7XG4gICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWUgZm9yIHRoZSBcIndoZW5cIiBwYXJhbWV0ZXInKTtcbiAgICAgIH0gLy8gTWFuYWdlIHJ1bm5lclxuXG5cbiAgICAgIHJ1bm5lci51bnNjaGVkdWxlKCk7XG4gICAgICBydW5uZXIudGltZWxpbmUodGhpcyk7XG4gICAgICB2YXIgcGVyc2lzdCA9IHJ1bm5lci5wZXJzaXN0KCk7XG4gICAgICB2YXIgcnVubmVySW5mbyA9IHtcbiAgICAgICAgcGVyc2lzdDogcGVyc2lzdCA9PT0gbnVsbCA/IHRoaXMuX3BlcnNpc3QgOiBwZXJzaXN0LFxuICAgICAgICBzdGFydDogYWJzb2x1dGVTdGFydFRpbWUgKyBkZWxheSxcbiAgICAgICAgcnVubmVyOiBydW5uZXJcbiAgICAgIH07XG4gICAgICB0aGlzLl9sYXN0UnVubmVySWQgPSBydW5uZXIuaWQ7XG5cbiAgICAgIHRoaXMuX3J1bm5lcnMucHVzaChydW5uZXJJbmZvKTtcblxuICAgICAgdGhpcy5fcnVubmVycy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnN0YXJ0IC0gYi5zdGFydDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9ydW5uZXJJZHMgPSB0aGlzLl9ydW5uZXJzLm1hcChmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICByZXR1cm4gaW5mby5ydW5uZXIuaWQ7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy51cGRhdGVUaW1lKCkuX2NvbnRpbnVlKCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUmVtb3ZlIHRoZSBydW5uZXIgZnJvbSB0aGlzIHRpbWVsaW5lXG5cbiAgfSwge1xuICAgIGtleTogXCJ1bnNjaGVkdWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVuc2NoZWR1bGUocnVubmVyKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLl9ydW5uZXJJZHMuaW5kZXhPZihydW5uZXIuaWQpO1xuXG4gICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm4gdGhpcztcblxuICAgICAgdGhpcy5fcnVubmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICB0aGlzLl9ydW5uZXJJZHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgcnVubmVyLnRpbWVsaW5lKG51bGwpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBDYWxjdWxhdGVzIHRoZSBlbmQgb2YgdGhlIHRpbWVsaW5lXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRFbmRUaW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEVuZFRpbWUoKSB7XG4gICAgICB2YXIgbGFzdFJ1bm5lckluZm8gPSB0aGlzLl9ydW5uZXJzW3RoaXMuX3J1bm5lcklkcy5pbmRleE9mKHRoaXMuX2xhc3RSdW5uZXJJZCldO1xuXG4gICAgICB2YXIgbGFzdER1cmF0aW9uID0gbGFzdFJ1bm5lckluZm8gPyBsYXN0UnVubmVySW5mby5ydW5uZXIuZHVyYXRpb24oKSA6IDA7XG4gICAgICB2YXIgbGFzdFN0YXJ0VGltZSA9IGxhc3RSdW5uZXJJbmZvID8gbGFzdFJ1bm5lckluZm8uc3RhcnQgOiAwO1xuICAgICAgcmV0dXJuIGxhc3RTdGFydFRpbWUgKyBsYXN0RHVyYXRpb247XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEVuZFRpbWVPZlRpbWVsaW5lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEVuZFRpbWVPZlRpbWVsaW5lKCkge1xuICAgICAgdmFyIGxhc3RFbmRUaW1lID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9ydW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBydW5uZXJJbmZvID0gdGhpcy5fcnVubmVyc1tpXTtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gcnVubmVySW5mbyA/IHJ1bm5lckluZm8ucnVubmVyLmR1cmF0aW9uKCkgOiAwO1xuICAgICAgICB2YXIgc3RhcnRUaW1lID0gcnVubmVySW5mbyA/IHJ1bm5lckluZm8uc3RhcnQgOiAwO1xuICAgICAgICB2YXIgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuXG4gICAgICAgIGlmIChlbmRUaW1lID4gbGFzdEVuZFRpbWUpIHtcbiAgICAgICAgICBsYXN0RW5kVGltZSA9IGVuZFRpbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxhc3RFbmRUaW1lO1xuICAgIH0gLy8gTWFrZXMgc3VyZSwgdGhhdCBhZnRlciBwYXVzaW5nIHRoZSB0aW1lIGRvZXNuJ3QganVtcFxuXG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlVGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVUaW1lKCkge1xuICAgICAgaWYgKCF0aGlzLmFjdGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuX2xhc3RTb3VyY2VUaW1lID0gdGhpcy5fdGltZVNvdXJjZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGxheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwbGF5KCkge1xuICAgICAgLy8gTm93IG1ha2Ugc3VyZSB3ZSBhcmUgbm90IHBhdXNlZCBhbmQgY29udGludWUgdGhlIGFuaW1hdGlvblxuICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKCkuX2NvbnRpbnVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBhdXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLl9jb250aW51ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAvLyBHbyB0byBzdGFydCBhbmQgcGF1c2VcbiAgICAgIHRoaXMudGltZSgwKTtcbiAgICAgIHJldHVybiB0aGlzLnBhdXNlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmlzaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAvLyBHbyB0byBlbmQgYW5kIHBhdXNlXG4gICAgICB0aGlzLnRpbWUodGhpcy5nZXRFbmRUaW1lT2ZUaW1lbGluZSgpICsgMSk7XG4gICAgICByZXR1cm4gdGhpcy5wYXVzZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzcGVlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzcGVlZChfc3BlZWQpIHtcbiAgICAgIGlmIChfc3BlZWQgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX3NwZWVkO1xuICAgICAgdGhpcy5fc3BlZWQgPSBfc3BlZWQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmV2ZXJzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXZlcnNlKHllcykge1xuICAgICAgdmFyIGN1cnJlbnRTcGVlZCA9IHRoaXMuc3BlZWQoKTtcbiAgICAgIGlmICh5ZXMgPT0gbnVsbCkgcmV0dXJuIHRoaXMuc3BlZWQoLWN1cnJlbnRTcGVlZCk7XG4gICAgICB2YXIgcG9zaXRpdmUgPSBNYXRoLmFicyhjdXJyZW50U3BlZWQpO1xuICAgICAgcmV0dXJuIHRoaXMuc3BlZWQoeWVzID8gcG9zaXRpdmUgOiAtcG9zaXRpdmUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZWVrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlZWsoZHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRpbWUodGhpcy5fdGltZSArIGR0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lKF90aW1lKSB7XG4gICAgICBpZiAoX3RpbWUgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgICB0aGlzLl90aW1lID0gX3RpbWU7XG4gICAgICByZXR1cm4gdGhpcy5fY29udGludWUodHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBlcnNpc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGVyc2lzdChkdE9yRm9yZXZlcikge1xuICAgICAgaWYgKGR0T3JGb3JldmVyID09IG51bGwpIHJldHVybiB0aGlzLl9wZXJzaXN0O1xuICAgICAgdGhpcy5fcGVyc2lzdCA9IGR0T3JGb3JldmVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzb3VyY2UoZm4pIHtcbiAgICAgIGlmIChmbiA9PSBudWxsKSByZXR1cm4gdGhpcy5fdGltZVNvdXJjZTtcbiAgICAgIHRoaXMuX3RpbWVTb3VyY2UgPSBmbjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfc3RlcEZuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9zdGVwRm4oKSB7XG4gICAgICB2YXIgaW1tZWRpYXRlU3RlcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG5cbiAgICAgIC8vIEdldCB0aGUgdGltZSBkZWx0YSBmcm9tIHRoZSBsYXN0IHRpbWUgYW5kIHVwZGF0ZSB0aGUgdGltZVxuICAgICAgdmFyIHRpbWUgPSB0aGlzLl90aW1lU291cmNlKCk7XG5cbiAgICAgIHZhciBkdFNvdXJjZSA9IHRpbWUgLSB0aGlzLl9sYXN0U291cmNlVGltZTtcbiAgICAgIGlmIChpbW1lZGlhdGVTdGVwKSBkdFNvdXJjZSA9IDA7XG4gICAgICB2YXIgZHRUaW1lID0gdGhpcy5fc3BlZWQgKiBkdFNvdXJjZSArICh0aGlzLl90aW1lIC0gdGhpcy5fbGFzdFN0ZXBUaW1lKTtcbiAgICAgIHRoaXMuX2xhc3RTb3VyY2VUaW1lID0gdGltZTsgLy8gT25seSB1cGRhdGUgdGhlIHRpbWUgaWYgd2UgdXNlIHRoZSB0aW1lU291cmNlLlxuICAgICAgLy8gT3RoZXJ3aXNlIHVzZSB0aGUgY3VycmVudCB0aW1lXG5cbiAgICAgIGlmICghaW1tZWRpYXRlU3RlcCkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbWVcbiAgICAgICAgdGhpcy5fdGltZSArPSBkdFRpbWU7XG4gICAgICAgIHRoaXMuX3RpbWUgPSB0aGlzLl90aW1lIDwgMCA/IDAgOiB0aGlzLl90aW1lO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9sYXN0U3RlcFRpbWUgPSB0aGlzLl90aW1lO1xuICAgICAgdGhpcy5maXJlKCd0aW1lJywgdGhpcy5fdGltZSk7IC8vIFRoaXMgaXMgZm9yIHRoZSBjYXNlIHRoYXQgdGhlIHRpbWVsaW5lIHdhcyBzZWVrZWQgc28gdGhhdCB0aGUgdGltZVxuICAgICAgLy8gaXMgbm93IGJlZm9yZSB0aGUgc3RhcnRUaW1lIG9mIHRoZSBydW5uZXIuIFRoYXRzIHdoeSB3ZSBuZWVkIHRvIHNldFxuICAgICAgLy8gdGhlIHJ1bm5lciB0byBwb3NpdGlvbiAwXG4gICAgICAvLyBGSVhNRTpcbiAgICAgIC8vIEhvd2V2ZXIsIHJlc2V0aW5nIGluIGluc2VydGlvbiBvcmRlciBsZWFkcyB0byBidWdzLiBDb25zaWRlcmluZyB0aGUgY2FzZSxcbiAgICAgIC8vIHdoZXJlIDIgcnVubmVycyBjaGFuZ2UgdGhlIHNhbWUgYXR0cml1dGUgYnV0IGluIGRpZmZlcmVudCB0aW1lcyxcbiAgICAgIC8vIHJlc2V0aW5nIGJvdGggb2YgdGhlbSB3aWxsIGxlYWQgdG8gdGhlIGNhc2Ugd2hlcmUgdGhlIGxhdGVyIGRlZmluZWRcbiAgICAgIC8vIHJ1bm5lciBhbHdheXMgd2lucyB0aGUgcmVzZXQgZXZlbiBpZiB0aGUgb3RoZXIgcnVubmVyIHN0YXJ0ZWQgZWFybGllclxuICAgICAgLy8gYW5kIHRoZXJlZm9yZSBzaG91bGQgd2luIHRoZSBhdHRyaWJ1dGUgYmF0dGxlXG4gICAgICAvLyB0aGlzIGNhbiBiZSBzb2x2ZWQgYnkgcmVzZXRpbmcgdGhlbSBiYWNrd2FyZHNcblxuICAgICAgZm9yICh2YXIgayA9IHRoaXMuX3J1bm5lcnMubGVuZ3RoOyBrLS07KSB7XG4gICAgICAgIC8vIEdldCBhbmQgcnVuIHRoZSBjdXJyZW50IHJ1bm5lciBhbmQgaWdub3JlIGl0IGlmIGl0cyBpbmFjdGl2ZVxuICAgICAgICB2YXIgcnVubmVySW5mbyA9IHRoaXMuX3J1bm5lcnNba107XG4gICAgICAgIHZhciBydW5uZXIgPSBydW5uZXJJbmZvLnJ1bm5lcjsgLy8gTWFrZSBzdXJlIHRoYXQgd2UgZ2l2ZSB0aGUgYWN0dWFsIGRpZmZlcmVuY2VcbiAgICAgICAgLy8gYmV0d2VlbiBydW5uZXIgc3RhcnQgdGltZSBhbmQgbm93XG5cbiAgICAgICAgdmFyIGR0VG9TdGFydCA9IHRoaXMuX3RpbWUgLSBydW5uZXJJbmZvLnN0YXJ0OyAvLyBEb250IHJ1biBydW5uZXIgaWYgbm90IHN0YXJ0ZWQgeWV0XG4gICAgICAgIC8vIGFuZCB0cnkgdG8gcmVzZXQgaXRcblxuICAgICAgICBpZiAoZHRUb1N0YXJ0IDw9IDApIHtcbiAgICAgICAgICBydW5uZXIucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSAvLyBSdW4gYWxsIG9mIHRoZSBydW5uZXJzIGRpcmVjdGx5XG5cblxuICAgICAgdmFyIHJ1bm5lcnNMZWZ0ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9ydW5uZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIC8vIEdldCBhbmQgcnVuIHRoZSBjdXJyZW50IHJ1bm5lciBhbmQgaWdub3JlIGl0IGlmIGl0cyBpbmFjdGl2ZVxuICAgICAgICB2YXIgX3J1bm5lckluZm8yID0gdGhpcy5fcnVubmVyc1tpXTtcbiAgICAgICAgdmFyIF9ydW5uZXIgPSBfcnVubmVySW5mbzIucnVubmVyO1xuICAgICAgICB2YXIgZHQgPSBkdFRpbWU7IC8vIE1ha2Ugc3VyZSB0aGF0IHdlIGdpdmUgdGhlIGFjdHVhbCBkaWZmZXJlbmNlXG4gICAgICAgIC8vIGJldHdlZW4gcnVubmVyIHN0YXJ0IHRpbWUgYW5kIG5vd1xuXG4gICAgICAgIHZhciBfZHRUb1N0YXJ0ID0gdGhpcy5fdGltZSAtIF9ydW5uZXJJbmZvMi5zdGFydDsgLy8gRG9udCBydW4gcnVubmVyIGlmIG5vdCBzdGFydGVkIHlldFxuXG5cbiAgICAgICAgaWYgKF9kdFRvU3RhcnQgPD0gMCkge1xuICAgICAgICAgIHJ1bm5lcnNMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChfZHRUb1N0YXJ0IDwgZHQpIHtcbiAgICAgICAgICAvLyBBZGp1c3QgZHQgdG8gbWFrZSBzdXJlIHRoYXQgYW5pbWF0aW9uIGlzIG9uIHBvaW50XG4gICAgICAgICAgZHQgPSBfZHRUb1N0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfcnVubmVyLmFjdGl2ZSgpKSBjb250aW51ZTsgLy8gSWYgdGhpcyBydW5uZXIgaXMgc3RpbGwgZ29pbmcsIHNpZ25hbCB0aGF0IHdlIG5lZWQgYW5vdGhlciBhbmltYXRpb25cbiAgICAgICAgLy8gZnJhbWUsIG90aGVyd2lzZSwgcmVtb3ZlIHRoZSBjb21wbGV0ZWQgcnVubmVyXG5cbiAgICAgICAgdmFyIGZpbmlzaGVkID0gX3J1bm5lci5zdGVwKGR0KS5kb25lO1xuXG4gICAgICAgIGlmICghZmluaXNoZWQpIHtcbiAgICAgICAgICBydW5uZXJzTGVmdCA9IHRydWU7IC8vIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoX3J1bm5lckluZm8yLnBlcnNpc3QgIT09IHRydWUpIHtcbiAgICAgICAgICAvLyBydW5uZXIgaXMgZmluaXNoZWQuIEFuZCBydW5uZXIgbWlnaHQgZ2V0IHJlbW92ZWRcbiAgICAgICAgICB2YXIgZW5kVGltZSA9IF9ydW5uZXIuZHVyYXRpb24oKSAtIF9ydW5uZXIudGltZSgpICsgdGhpcy5fdGltZTtcblxuICAgICAgICAgIGlmIChlbmRUaW1lICsgX3J1bm5lckluZm8yLnBlcnNpc3QgPCB0aGlzLl90aW1lKSB7XG4gICAgICAgICAgICAvLyBEZWxldGUgcnVubmVyIGFuZCBjb3JyZWN0IGluZGV4XG4gICAgICAgICAgICBfcnVubmVyLnVuc2NoZWR1bGUoKTtcblxuICAgICAgICAgICAgLS1pO1xuICAgICAgICAgICAgLS1sZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IC8vIEJhc2ljYWxseTogd2UgY29udGludWUgd2hlbiB0aGVyZSBhcmUgcnVubmVycyByaWdodCBmcm9tIHVzIGluIHRpbWVcbiAgICAgIC8vIHdoZW4gLS0+LCBhbmQgd2hlbiBydW5uZXJzIGFyZSBsZWZ0IGZyb20gdXMgd2hlbiA8LS1cblxuXG4gICAgICBpZiAocnVubmVyc0xlZnQgJiYgISh0aGlzLl9zcGVlZCA8IDAgJiYgdGhpcy5fdGltZSA9PT0gMCkgfHwgdGhpcy5fcnVubmVySWRzLmxlbmd0aCAmJiB0aGlzLl9zcGVlZCA8IDAgJiYgdGhpcy5fdGltZSA+IDApIHtcbiAgICAgICAgdGhpcy5fY29udGludWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgdGhpcy5maXJlKCdmaW5pc2hlZCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIENoZWNrcyBpZiB3ZSBhcmUgcnVubmluZyBhbmQgY29udGludWVzIHRoZSBhbmltYXRpb25cblxuICB9LCB7XG4gICAga2V5OiBcIl9jb250aW51ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfY29udGludWUoKSB7XG4gICAgICB2YXIgaW1tZWRpYXRlU3RlcCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG4gICAgICBBbmltYXRvci5jYW5jZWxGcmFtZSh0aGlzLl9uZXh0RnJhbWUpO1xuICAgICAgdGhpcy5fbmV4dEZyYW1lID0gbnVsbDtcbiAgICAgIGlmIChpbW1lZGlhdGVTdGVwKSByZXR1cm4gdGhpcy5fc3RlcEltbWVkaWF0ZSgpO1xuICAgICAgaWYgKHRoaXMuX3BhdXNlZCkgcmV0dXJuIHRoaXM7XG4gICAgICB0aGlzLl9uZXh0RnJhbWUgPSBBbmltYXRvci5mcmFtZSh0aGlzLl9zdGVwKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhY3RpdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWN0aXZlKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5fbmV4dEZyYW1lO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBUaW1lbGluZTtcbn0oRXZlbnRUYXJnZXQpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgRWxlbWVudDoge1xuICAgIHRpbWVsaW5lOiBmdW5jdGlvbiB0aW1lbGluZShfdGltZWxpbmUpIHtcbiAgICAgIGlmIChfdGltZWxpbmUgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl90aW1lbGluZSA9IHRoaXMuX3RpbWVsaW5lIHx8IG5ldyBUaW1lbGluZSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdGltZWxpbmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90aW1lbGluZSA9IF90aW1lbGluZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuZnVuY3Rpb24gb3duS2V5cyQyKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSk7IGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkJDEodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpZiAoaSAlIDIpIHsgb3duS2V5cyQyKHNvdXJjZSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzJDIoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgUnVubmVyID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfRXZlbnRUYXJnZXQpIHtcbiAgX2luaGVyaXRzKFJ1bm5lciwgX0V2ZW50VGFyZ2V0KTtcblxuICBmdW5jdGlvbiBSdW5uZXIob3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSdW5uZXIpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoUnVubmVyKS5jYWxsKHRoaXMpKTsgLy8gU3RvcmUgYSB1bmlxdWUgaWQgb24gdGhlIHJ1bm5lciwgc28gdGhhdCB3ZSBjYW4gaWRlbnRpZnkgaXQgbGF0ZXJcblxuICAgIF90aGlzLmlkID0gUnVubmVyLmlkKys7IC8vIEVuc3VyZSBhIGRlZmF1bHQgdmFsdWVcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zID09IG51bGwgPyB0aW1lbGluZS5kdXJhdGlvbiA6IG9wdGlvbnM7IC8vIEVuc3VyZSB0aGF0IHdlIGdldCBhIGNvbnRyb2xsZXJcblxuICAgIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBDb250cm9sbGVyKG9wdGlvbnMpIDogb3B0aW9uczsgLy8gRGVjbGFyZSBhbGwgb2YgdGhlIHZhcmlhYmxlc1xuXG4gICAgX3RoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIF90aGlzLl90aW1lbGluZSA9IG51bGw7XG4gICAgX3RoaXMuZG9uZSA9IGZhbHNlO1xuICAgIF90aGlzLl9xdWV1ZSA9IFtdOyAvLyBXb3JrIG91dCB0aGUgc3RlcHBlciBhbmQgdGhlIGR1cmF0aW9uXG5cbiAgICBfdGhpcy5fZHVyYXRpb24gPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicgJiYgb3B0aW9ucztcbiAgICBfdGhpcy5faXNEZWNsYXJhdGl2ZSA9IG9wdGlvbnMgaW5zdGFuY2VvZiBDb250cm9sbGVyO1xuICAgIF90aGlzLl9zdGVwcGVyID0gX3RoaXMuX2lzRGVjbGFyYXRpdmUgPyBvcHRpb25zIDogbmV3IEVhc2UoKTsgLy8gV2UgY29weSB0aGUgY3VycmVudCB2YWx1ZXMgZnJvbSB0aGUgdGltZWxpbmUgYmVjYXVzZSB0aGV5IGNhbiBjaGFuZ2VcblxuICAgIF90aGlzLl9oaXN0b3J5ID0ge307IC8vIFN0b3JlIHRoZSBzdGF0ZSBvZiB0aGUgcnVubmVyXG5cbiAgICBfdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICBfdGhpcy5fdGltZSA9IDA7XG4gICAgX3RoaXMuX2xhc3RUaW1lID0gMDsgLy8gQXQgY3JlYXRpb24sIHRoZSBydW5uZXIgaXMgaW4gcmVzZXRlZCBzdGF0ZVxuXG4gICAgX3RoaXMuX3Jlc2V0ZWQgPSB0cnVlOyAvLyBTYXZlIHRyYW5zZm9ybXMgYXBwbGllZCB0byB0aGlzIHJ1bm5lclxuXG4gICAgX3RoaXMudHJhbnNmb3JtcyA9IG5ldyBNYXRyaXgoKTtcbiAgICBfdGhpcy50cmFuc2Zvcm1JZCA9IDE7IC8vIExvb3BpbmcgdmFyaWFibGVzXG5cbiAgICBfdGhpcy5faGF2ZVJldmVyc2VkID0gZmFsc2U7XG4gICAgX3RoaXMuX3JldmVyc2UgPSBmYWxzZTtcbiAgICBfdGhpcy5fbG9vcHNEb25lID0gMDtcbiAgICBfdGhpcy5fc3dpbmcgPSBmYWxzZTtcbiAgICBfdGhpcy5fd2FpdCA9IDA7XG4gICAgX3RoaXMuX3RpbWVzID0gMTtcbiAgICBfdGhpcy5fZnJhbWVJZCA9IG51bGw7IC8vIFN0b3JlcyBob3cgbG9uZyBhIHJ1bm5lciBpcyBzdG9yZWQgYWZ0ZXIgYmVlaW5nIGRvbmVcblxuICAgIF90aGlzLl9wZXJzaXN0ID0gX3RoaXMuX2lzRGVjbGFyYXRpdmUgPyB0cnVlIDogbnVsbDtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cbiAgLypcclxuICBSdW5uZXIgRGVmaW5pdGlvbnNcclxuICA9PT09PT09PT09PT09PT09PT1cclxuICBUaGVzZSBtZXRob2RzIGhlbHAgdXMgZGVmaW5lIHRoZSBydW50aW1lIGJlaGF2aW91ciBvZiB0aGUgUnVubmVyIG9yIHRoZXlcclxuICBoZWxwIHVzIG1ha2UgbmV3IHJ1bm5lcnMgZnJvbSB0aGUgY3VycmVudCBydW5uZXJcclxuICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFJ1bm5lciwgW3tcbiAgICBrZXk6IFwiZWxlbWVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbGVtZW50KF9lbGVtZW50KSB7XG4gICAgICBpZiAoX2VsZW1lbnQgPT0gbnVsbCkgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gX2VsZW1lbnQ7XG5cbiAgICAgIF9lbGVtZW50Ll9wcmVwYXJlUnVubmVyKCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lbGluZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lbGluZShfdGltZWxpbmUpIHtcbiAgICAgIC8vIGNoZWNrIGV4cGxpY2l0bHkgZm9yIHVuZGVmaW5lZCBzbyB3ZSBjYW4gc2V0IHRoZSB0aW1lbGluZSB0byBudWxsXG4gICAgICBpZiAodHlwZW9mIF90aW1lbGluZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiB0aGlzLl90aW1lbGluZTtcbiAgICAgIHRoaXMuX3RpbWVsaW5lID0gX3RpbWVsaW5lO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFuaW1hdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYW5pbWF0ZShkdXJhdGlvbiwgZGVsYXksIHdoZW4pIHtcbiAgICAgIHZhciBvID0gUnVubmVyLnNhbml0aXNlKGR1cmF0aW9uLCBkZWxheSwgd2hlbik7XG4gICAgICB2YXIgcnVubmVyID0gbmV3IFJ1bm5lcihvLmR1cmF0aW9uKTtcbiAgICAgIGlmICh0aGlzLl90aW1lbGluZSkgcnVubmVyLnRpbWVsaW5lKHRoaXMuX3RpbWVsaW5lKTtcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50KSBydW5uZXIuZWxlbWVudCh0aGlzLl9lbGVtZW50KTtcbiAgICAgIHJldHVybiBydW5uZXIubG9vcChvKS5zY2hlZHVsZShvLmRlbGF5LCBvLndoZW4pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzY2hlZHVsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzY2hlZHVsZSh0aW1lbGluZSwgZGVsYXksIHdoZW4pIHtcbiAgICAgIC8vIFRoZSB1c2VyIGRvZXNuJ3QgbmVlZCB0byBwYXNzIGEgdGltZWxpbmUgaWYgd2UgYWxyZWFkeSBoYXZlIG9uZVxuICAgICAgaWYgKCEodGltZWxpbmUgaW5zdGFuY2VvZiBUaW1lbGluZSkpIHtcbiAgICAgICAgd2hlbiA9IGRlbGF5O1xuICAgICAgICBkZWxheSA9IHRpbWVsaW5lO1xuICAgICAgICB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgIH0gLy8gSWYgdGhlcmUgaXMgbm8gdGltZWxpbmUsIHllbGwgYXQgdGhlIHVzZXIuLi5cblxuXG4gICAgICBpZiAoIXRpbWVsaW5lKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSdW5uZXIgY2Fubm90IGJlIHNjaGVkdWxlZCB3aXRob3V0IHRpbWVsaW5lJyk7XG4gICAgICB9IC8vIFNjaGVkdWxlIHRoZSBydW5uZXIgb24gdGhlIHRpbWVsaW5lIHByb3ZpZGVkXG5cblxuICAgICAgdGltZWxpbmUuc2NoZWR1bGUodGhpcywgZGVsYXksIHdoZW4pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVuc2NoZWR1bGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zY2hlZHVsZSgpIHtcbiAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgIHRpbWVsaW5lICYmIHRpbWVsaW5lLnVuc2NoZWR1bGUodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9vcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb29wKHRpbWVzLCBzd2luZywgd2FpdCkge1xuICAgICAgLy8gRGVhbCB3aXRoIHRoZSB1c2VyIHBhc3NpbmcgaW4gYW4gb2JqZWN0XG4gICAgICBpZiAoX3R5cGVvZih0aW1lcykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHN3aW5nID0gdGltZXMuc3dpbmc7XG4gICAgICAgIHdhaXQgPSB0aW1lcy53YWl0O1xuICAgICAgICB0aW1lcyA9IHRpbWVzLnRpbWVzO1xuICAgICAgfSAvLyBTYW5pdGlzZSB0aGUgdmFsdWVzIGFuZCBzdG9yZSB0aGVtXG5cblxuICAgICAgdGhpcy5fdGltZXMgPSB0aW1lcyB8fCBJbmZpbml0eTtcbiAgICAgIHRoaXMuX3N3aW5nID0gc3dpbmcgfHwgZmFsc2U7XG4gICAgICB0aGlzLl93YWl0ID0gd2FpdCB8fCAwOyAvLyBBbGxvdyB0cnVlIHRvIGJlIHBhc3NlZFxuXG4gICAgICBpZiAodGhpcy5fdGltZXMgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fdGltZXMgPSBJbmZpbml0eTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRlbGF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlbGF5KF9kZWxheSkge1xuICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0ZSgwLCBfZGVsYXkpO1xuICAgIH1cbiAgICAvKlxyXG4gICAgQmFzaWMgRnVuY3Rpb25hbGl0eVxyXG4gICAgPT09PT09PT09PT09PT09PT09PVxyXG4gICAgVGhlc2UgbWV0aG9kcyBhbGxvdyB1cyB0byBhdHRhY2ggYmFzaWMgZnVuY3Rpb25zIHRvIHRoZSBydW5uZXIgZGlyZWN0bHlcclxuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJxdWV1ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWV1ZShpbml0Rm4sIHJ1bkZuLCByZXRhcmdldEZuLCBpc1RyYW5zZm9ybSkge1xuICAgICAgdGhpcy5fcXVldWUucHVzaCh7XG4gICAgICAgIGluaXRpYWxpc2VyOiBpbml0Rm4gfHwgbm9vcCxcbiAgICAgICAgcnVubmVyOiBydW5GbiB8fCBub29wLFxuICAgICAgICByZXRhcmdldDogcmV0YXJnZXRGbixcbiAgICAgICAgaXNUcmFuc2Zvcm06IGlzVHJhbnNmb3JtLFxuICAgICAgICBpbml0aWFsaXNlZDogZmFsc2UsXG4gICAgICAgIGZpbmlzaGVkOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciB0aW1lbGluZSA9IHRoaXMudGltZWxpbmUoKTtcbiAgICAgIHRpbWVsaW5lICYmIHRoaXMudGltZWxpbmUoKS5fY29udGludWUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkdXJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHVyaW5nKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWV1ZShudWxsLCBmbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFmdGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFmdGVyKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5vbignZmluaXNoZWQnLCBmbik7XG4gICAgfVxuICAgIC8qXHJcbiAgICBSdW5uZXIgYW5pbWF0aW9uIG1ldGhvZHNcclxuICAgID09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgQ29udHJvbCBob3cgdGhlIGFuaW1hdGlvbiBwbGF5c1xyXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInRpbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGltZShfdGltZSkge1xuICAgICAgaWYgKF90aW1lID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBkdCA9IF90aW1lIC0gdGhpcy5fdGltZTtcbiAgICAgIHRoaXMuc3RlcChkdCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHVyYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHVyYXRpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGltZXMgKiAodGhpcy5fd2FpdCArIHRoaXMuX2R1cmF0aW9uKSAtIHRoaXMuX3dhaXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxvb3BzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvb3BzKHApIHtcbiAgICAgIHZhciBsb29wRHVyYXRpb24gPSB0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3dhaXQ7XG5cbiAgICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvb3BzRG9uZSA9IE1hdGguZmxvb3IodGhpcy5fdGltZSAvIGxvb3BEdXJhdGlvbik7XG4gICAgICAgIHZhciByZWxhdGl2ZVRpbWUgPSB0aGlzLl90aW1lIC0gbG9vcHNEb25lICogbG9vcER1cmF0aW9uO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSByZWxhdGl2ZVRpbWUgLyB0aGlzLl9kdXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKGxvb3BzRG9uZSArIHBvc2l0aW9uLCB0aGlzLl90aW1lcyk7XG4gICAgICB9XG5cbiAgICAgIHZhciB3aG9sZSA9IE1hdGguZmxvb3IocCk7XG4gICAgICB2YXIgcGFydGlhbCA9IHAgJSAxO1xuICAgICAgdmFyIHRpbWUgPSBsb29wRHVyYXRpb24gKiB3aG9sZSArIHRoaXMuX2R1cmF0aW9uICogcGFydGlhbDtcbiAgICAgIHJldHVybiB0aGlzLnRpbWUodGltZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBlcnNpc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGVyc2lzdChkdE9yRm9yZXZlcikge1xuICAgICAgaWYgKGR0T3JGb3JldmVyID09IG51bGwpIHJldHVybiB0aGlzLl9wZXJzaXN0O1xuICAgICAgdGhpcy5fcGVyc2lzdCA9IGR0T3JGb3JldmVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBvc2l0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvc2l0aW9uKHApIHtcbiAgICAgIC8vIEdldCBhbGwgb2YgdGhlIHZhcmlhYmxlcyB3ZSBuZWVkXG4gICAgICB2YXIgeCA9IHRoaXMuX3RpbWU7XG4gICAgICB2YXIgZCA9IHRoaXMuX2R1cmF0aW9uO1xuICAgICAgdmFyIHcgPSB0aGlzLl93YWl0O1xuICAgICAgdmFyIHQgPSB0aGlzLl90aW1lcztcbiAgICAgIHZhciBzID0gdGhpcy5fc3dpbmc7XG4gICAgICB2YXIgciA9IHRoaXMuX3JldmVyc2U7XG4gICAgICB2YXIgcG9zaXRpb247XG5cbiAgICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgICAgLypcclxuICAgICAgICBUaGlzIGZ1bmN0aW9uIGNvbnZlcnRzIGEgdGltZSB0byBhIHBvc2l0aW9uIGluIHRoZSByYW5nZSBbMCwgMV1cclxuICAgICAgICBUaGUgZnVsbCBleHBsYW5hdGlvbiBjYW4gYmUgZm91bmQgaW4gdGhpcyBkZXNtb3MgZGVtb25zdHJhdGlvblxyXG4gICAgICAgICAgaHR0cHM6Ly93d3cuZGVzbW9zLmNvbS9jYWxjdWxhdG9yL3U0ZmJhdmdjaGVcclxuICAgICAgICBUaGUgbG9naWMgaXMgc2xpZ2h0bHkgc2ltcGxpZmllZCBoZXJlIGJlY2F1c2Ugd2UgY2FuIHVzZSBib29sZWFuc1xyXG4gICAgICAgICovXG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgdGhlIHZhbHVlIHdpdGhvdXQgdGhpbmtpbmcgYWJvdXQgdGhlIHN0YXJ0IG9yIGVuZCB0aW1lXG4gICAgICAgIHZhciBmID0gZnVuY3Rpb24gZih4KSB7XG4gICAgICAgICAgdmFyIHN3aW5naW5nID0gcyAqIE1hdGguZmxvb3IoeCAlICgyICogKHcgKyBkKSkgLyAodyArIGQpKTtcbiAgICAgICAgICB2YXIgYmFja3dhcmRzID0gc3dpbmdpbmcgJiYgIXIgfHwgIXN3aW5naW5nICYmIHI7XG4gICAgICAgICAgdmFyIHVuY2xpcGVkID0gTWF0aC5wb3coLTEsIGJhY2t3YXJkcykgKiAoeCAlICh3ICsgZCkpIC8gZCArIGJhY2t3YXJkcztcbiAgICAgICAgICB2YXIgY2xpcHBlZCA9IE1hdGgubWF4KE1hdGgubWluKHVuY2xpcGVkLCAxKSwgMCk7XG4gICAgICAgICAgcmV0dXJuIGNsaXBwZWQ7XG4gICAgICAgIH07IC8vIEZpZ3VyZSBvdXQgdGhlIHZhbHVlIGJ5IGluY29ycG9yYXRpbmcgdGhlIHN0YXJ0IHRpbWVcblxuXG4gICAgICAgIHZhciBlbmRUaW1lID0gdCAqICh3ICsgZCkgLSB3O1xuICAgICAgICBwb3NpdGlvbiA9IHggPD0gMCA/IE1hdGgucm91bmQoZigxZS01KSkgOiB4IDwgZW5kVGltZSA/IGYoeCkgOiBNYXRoLnJvdW5kKGYoZW5kVGltZSAtIDFlLTUpKTtcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgICAgfSAvLyBXb3JrIG91dCB0aGUgbG9vcHMgZG9uZSBhbmQgYWRkIHRoZSBwb3NpdGlvbiB0byB0aGUgbG9vcHMgZG9uZVxuXG5cbiAgICAgIHZhciBsb29wc0RvbmUgPSBNYXRoLmZsb29yKHRoaXMubG9vcHMoKSk7XG4gICAgICB2YXIgc3dpbmdGb3J3YXJkID0gcyAmJiBsb29wc0RvbmUgJSAyID09PSAwO1xuICAgICAgdmFyIGZvcndhcmRzID0gc3dpbmdGb3J3YXJkICYmICFyIHx8IHIgJiYgc3dpbmdGb3J3YXJkO1xuICAgICAgcG9zaXRpb24gPSBsb29wc0RvbmUgKyAoZm9yd2FyZHMgPyBwIDogMSAtIHApO1xuICAgICAgcmV0dXJuIHRoaXMubG9vcHMocG9zaXRpb24pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcm9ncmVzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9ncmVzcyhwKSB7XG4gICAgICBpZiAocCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbigxLCB0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbigpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudGltZShwICogdGhpcy5kdXJhdGlvbigpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RlcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGVwKGR0KSB7XG4gICAgICAvLyBJZiB3ZSBhcmUgaW5hY3RpdmUsIHRoaXMgc3RlcHBlciBqdXN0IGdldHMgc2tpcHBlZFxuICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybiB0aGlzOyAvLyBVcGRhdGUgdGhlIHRpbWUgYW5kIGdldCB0aGUgbmV3IHBvc2l0aW9uXG5cbiAgICAgIGR0ID0gZHQgPT0gbnVsbCA/IDE2IDogZHQ7XG4gICAgICB0aGlzLl90aW1lICs9IGR0O1xuICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbigpOyAvLyBGaWd1cmUgb3V0IGlmIHdlIG5lZWQgdG8gcnVuIHRoZSBzdGVwcGVyIGluIHRoaXMgZnJhbWVcblxuICAgICAgdmFyIHJ1bm5pbmcgPSB0aGlzLl9sYXN0UG9zaXRpb24gIT09IHBvc2l0aW9uICYmIHRoaXMuX3RpbWUgPj0gMDtcbiAgICAgIHRoaXMuX2xhc3RQb3NpdGlvbiA9IHBvc2l0aW9uOyAvLyBGaWd1cmUgb3V0IGlmIHdlIGp1c3Qgc3RhcnRlZFxuXG4gICAgICB2YXIgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uKCk7XG4gICAgICB2YXIganVzdFN0YXJ0ZWQgPSB0aGlzLl9sYXN0VGltZSA8PSAwICYmIHRoaXMuX3RpbWUgPiAwO1xuICAgICAgdmFyIGp1c3RGaW5pc2hlZCA9IHRoaXMuX2xhc3RUaW1lIDwgZHVyYXRpb24gJiYgdGhpcy5fdGltZSA+PSBkdXJhdGlvbjtcbiAgICAgIHRoaXMuX2xhc3RUaW1lID0gdGhpcy5fdGltZTtcblxuICAgICAgaWYgKGp1c3RTdGFydGVkKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnc3RhcnQnLCB0aGlzKTtcbiAgICAgIH0gLy8gV29yayBvdXQgaWYgdGhlIHJ1bm5lciBpcyBmaW5pc2hlZCBzZXQgdGhlIGRvbmUgZmxhZyBoZXJlIHNvIGFuaW1hdGlvbnNcbiAgICAgIC8vIGtub3csIHRoYXQgdGhleSBhcmUgcnVubmluZyBpbiB0aGUgbGFzdCBzdGVwICh0aGlzIGlzIGdvb2QgZm9yXG4gICAgICAvLyB0cmFuc2Zvcm1hdGlvbnMgd2hpY2ggY2FuIGJlIG1lcmdlZClcblxuXG4gICAgICB2YXIgZGVjbGFyYXRpdmUgPSB0aGlzLl9pc0RlY2xhcmF0aXZlO1xuICAgICAgdGhpcy5kb25lID0gIWRlY2xhcmF0aXZlICYmICFqdXN0RmluaXNoZWQgJiYgdGhpcy5fdGltZSA+PSBkdXJhdGlvbjsgLy8gUnVubmVyIGlzIHJ1bm5pbmcuIFNvIGl0cyBub3QgaW4gcmVzZXRlZCBzdGF0ZSBhbnltb3JlXG5cbiAgICAgIHRoaXMuX3Jlc2V0ZWQgPSBmYWxzZTsgLy8gQ2FsbCBpbml0aWFsaXNlIGFuZCB0aGUgcnVuIGZ1bmN0aW9uXG5cbiAgICAgIGlmIChydW5uaW5nIHx8IGRlY2xhcmF0aXZlKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpc2UocnVubmluZyk7IC8vIGNsZWFyIHRoZSB0cmFuc2Zvcm1zIG9uIHRoaXMgcnVubmVyIHNvIHRoZXkgZG9udCBnZXQgYWRkZWQgYWdhaW4gYW5kIGFnYWluXG5cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybXMgPSBuZXcgTWF0cml4KCk7XG5cbiAgICAgICAgdmFyIGNvbnZlcmdlZCA9IHRoaXMuX3J1bihkZWNsYXJhdGl2ZSA/IGR0IDogcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuZmlyZSgnc3RlcCcsIHRoaXMpO1xuICAgICAgfSAvLyBjb3JyZWN0IHRoZSBkb25lIGZsYWcgaGVyZVxuICAgICAgLy8gZGVjbGFyaXRpdmUgYW5pbWF0aW9ucyBpdHNlbGYga25vdyB3aGVuIHRoZXkgY29udmVyZ2VkXG5cblxuICAgICAgdGhpcy5kb25lID0gdGhpcy5kb25lIHx8IGNvbnZlcmdlZCAmJiBkZWNsYXJhdGl2ZTtcblxuICAgICAgaWYgKGp1c3RGaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2ZpbmlzaGVkJywgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIGlmICh0aGlzLl9yZXNldGVkKSByZXR1cm4gdGhpcztcbiAgICAgIHRoaXMudGltZSgwKTtcbiAgICAgIHRoaXMuX3Jlc2V0ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmlzaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGVwKEluZmluaXR5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmV2ZXJzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXZlcnNlKF9yZXZlcnNlKSB7XG4gICAgICB0aGlzLl9yZXZlcnNlID0gX3JldmVyc2UgPT0gbnVsbCA/ICF0aGlzLl9yZXZlcnNlIDogX3JldmVyc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZWFzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlYXNlKGZuKSB7XG4gICAgICB0aGlzLl9zdGVwcGVyID0gbmV3IEVhc2UoZm4pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFjdGl2ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhY3RpdmUoZW5hYmxlZCkge1xuICAgICAgaWYgKGVuYWJsZWQgPT0gbnVsbCkgcmV0dXJuIHRoaXMuZW5hYmxlZDtcbiAgICAgIHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLypcclxuICAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgPT09PT09PT09PT09PT09XHJcbiAgICBNZXRob2RzIHRoYXQgc2hvdWxkbid0IGJlIHVzZWQgZXh0ZXJuYWxseVxyXG4gICAgKi9cbiAgICAvLyBTYXZlIGEgbW9ycGhlciB0byB0aGUgbW9ycGhlciBsaXN0IHNvIHRoYXQgd2UgY2FuIHJldGFyZ2V0IGl0IGxhdGVyXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVtZW1iZXJNb3JwaGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZW1lbWJlck1vcnBoZXIobWV0aG9kLCBtb3JwaGVyKSB7XG4gICAgICB0aGlzLl9oaXN0b3J5W21ldGhvZF0gPSB7XG4gICAgICAgIG1vcnBoZXI6IG1vcnBoZXIsXG4gICAgICAgIGNhbGxlcjogdGhpcy5fcXVldWVbdGhpcy5fcXVldWUubGVuZ3RoIC0gMV1cbiAgICAgIH07IC8vIFdlIGhhdmUgdG8gcmVzdW1lIHRoZSB0aW1lbGluZSBpbiBjYXNlIGEgY29udHJvbGxlclxuICAgICAgLy8gaXMgYWxyZWFkeSBkb25lIHdpdGhvdXQgYmVlaW5nIGV2ZXIgcnVuXG4gICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gd2hlbiBlLmcuIHRoaXMgaXMgZG9uZTpcbiAgICAgIC8vICAgIGFuaW0gPSBlbC5hbmltYXRlKG5ldyBTVkcuU3ByaW5nKVxuICAgICAgLy8gYW5kIGxhdGVyXG4gICAgICAvLyAgICBhbmltLm1vdmUoLi4uKVxuXG4gICAgICBpZiAodGhpcy5faXNEZWNsYXJhdGl2ZSkge1xuICAgICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lKCk7XG4gICAgICAgIHRpbWVsaW5lICYmIHRpbWVsaW5lLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9IC8vIFRyeSB0byBzZXQgdGhlIHRhcmdldCBmb3IgYSBtb3JwaGVyIGlmIHRoZSBtb3JwaGVyIGV4aXN0cywgb3RoZXJ3aXNlXG4gICAgLy8gZG8gbm90aGluZyBhbmQgcmV0dXJuIGZhbHNlXG5cbiAgfSwge1xuICAgIGtleTogXCJfdHJ5UmV0YXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3RyeVJldGFyZ2V0KG1ldGhvZCwgdGFyZ2V0LCBleHRyYSkge1xuICAgICAgaWYgKHRoaXMuX2hpc3RvcnlbbWV0aG9kXSkge1xuICAgICAgICAvLyBpZiB0aGUgbGFzdCBtZXRob2Qgd2FzbnQgZXZlbiBpbml0aWFsaXNlZCwgdGhyb3cgaXQgYXdheVxuICAgICAgICBpZiAoIXRoaXMuX2hpc3RvcnlbbWV0aG9kXS5jYWxsZXIuaW5pdGlhbGlzZWQpIHtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9xdWV1ZS5pbmRleE9mKHRoaXMuX2hpc3RvcnlbbWV0aG9kXS5jYWxsZXIpO1xuXG4gICAgICAgICAgdGhpcy5fcXVldWUuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSAvLyBmb3IgdGhlIGNhc2Ugb2YgdHJhbnNmb3JtYXRpb25zLCB3ZSB1c2UgdGhlIHNwZWNpYWwgcmV0YXJnZXQgZnVuY3Rpb25cbiAgICAgICAgLy8gd2hpY2ggaGFzIGFjY2VzcyB0byB0aGUgb3V0ZXIgc2NvcGVcblxuXG4gICAgICAgIGlmICh0aGlzLl9oaXN0b3J5W21ldGhvZF0uY2FsbGVyLnJldGFyZ2V0KSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeVttZXRob2RdLmNhbGxlci5yZXRhcmdldCh0YXJnZXQsIGV4dHJhKTsgLy8gZm9yIGV2ZXJ5dGhpbmcgZWxzZSBhIHNpbXBsZSBtb3JwaGVyIGNoYW5nZSBpcyBzdWZmaWNpZW50XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5W21ldGhvZF0ubW9ycGhlci50byh0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGlzdG9yeVttZXRob2RdLmNhbGxlci5maW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lKCk7XG4gICAgICAgIHRpbWVsaW5lICYmIHRpbWVsaW5lLnBsYXkoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIFJ1biBlYWNoIGluaXRpYWxpc2UgZnVuY3Rpb24gaW4gdGhlIHJ1bm5lciBpZiByZXF1aXJlZFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2luaXRpYWxpc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2luaXRpYWxpc2UocnVubmluZykge1xuICAgICAgLy8gSWYgd2UgYXJlbid0IHJ1bm5pbmcsIHdlIHNob3VsZG4ndCBpbml0aWFsaXNlIHdoZW4gbm90IGRlY2xhcmF0aXZlXG4gICAgICBpZiAoIXJ1bm5pbmcgJiYgIXRoaXMuX2lzRGVjbGFyYXRpdmUpIHJldHVybjsgLy8gTG9vcCB0aHJvdWdoIGFsbCBvZiB0aGUgaW5pdGlhbGlzZXJzXG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9xdWV1ZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgaW5pdGlhbGlzZXJcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9xdWV1ZVtpXTsgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgd2UgbmVlZCB0byBpbml0aWFsaXNlXG5cbiAgICAgICAgdmFyIG5lZWRzSXQgPSB0aGlzLl9pc0RlY2xhcmF0aXZlIHx8ICFjdXJyZW50LmluaXRpYWxpc2VkICYmIHJ1bm5pbmc7XG4gICAgICAgIHJ1bm5pbmcgPSAhY3VycmVudC5maW5pc2hlZDsgLy8gQ2FsbCB0aGUgaW5pdGlhbGlzZXIgaWYgd2UgbmVlZCB0b1xuXG4gICAgICAgIGlmIChuZWVkc0l0ICYmIHJ1bm5pbmcpIHtcbiAgICAgICAgICBjdXJyZW50LmluaXRpYWxpc2VyLmNhbGwodGhpcyk7XG4gICAgICAgICAgY3VycmVudC5pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IC8vIFJ1biBlYWNoIHJ1biBmdW5jdGlvbiBmb3IgdGhlIHBvc2l0aW9uIG9yIGR0IGdpdmVuXG5cbiAgfSwge1xuICAgIGtleTogXCJfcnVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9ydW4ocG9zaXRpb25PckR0KSB7XG4gICAgICAvLyBSdW4gYWxsIG9mIHRoZSBfcXVldWUgZGlyZWN0bHlcbiAgICAgIHZhciBhbGxmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9xdWV1ZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgZnVuY3Rpb24gdG8gcnVuXG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5fcXVldWVbaV07IC8vIFJ1biB0aGUgZnVuY3Rpb24gaWYgaXRzIG5vdCBmaW5pc2hlZCwgd2Uga2VlcCB0cmFjayBvZiB0aGUgZmluaXNoZWRcbiAgICAgICAgLy8gZmxhZyBmb3IgdGhlIHNha2Ugb2YgZGVjbGFyYXRpdmUgX3F1ZXVlXG5cbiAgICAgICAgdmFyIGNvbnZlcmdlZCA9IGN1cnJlbnQucnVubmVyLmNhbGwodGhpcywgcG9zaXRpb25PckR0KTtcbiAgICAgICAgY3VycmVudC5maW5pc2hlZCA9IGN1cnJlbnQuZmluaXNoZWQgfHwgY29udmVyZ2VkID09PSB0cnVlO1xuICAgICAgICBhbGxmaW5pc2hlZCA9IGFsbGZpbmlzaGVkICYmIGN1cnJlbnQuZmluaXNoZWQ7XG4gICAgICB9IC8vIFdlIHJlcG9ydCB3aGVuIGFsbCBvZiB0aGUgY29uc3RydWN0b3JzIGFyZSBmaW5pc2hlZFxuXG5cbiAgICAgIHJldHVybiBhbGxmaW5pc2hlZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkVHJhbnNmb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFRyYW5zZm9ybSh0cmFuc2Zvcm0sIGluZGV4KSB7XG4gICAgICB0aGlzLnRyYW5zZm9ybXMubG11bHRpcGx5Tyh0cmFuc2Zvcm0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyVHJhbnNmb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyVHJhbnNmb3JtKCkge1xuICAgICAgdGhpcy50cmFuc2Zvcm1zID0gbmV3IE1hdHJpeCgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBUT0RPOiBLZWVwIHRyYWNrIG9mIGFsbCB0cmFuc2Zvcm1hdGlvbnMgc28gdGhhdCBkZWxldGlvbiBpcyBmYXN0ZXJcblxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyVHJhbnNmb3Jtc0Zyb21RdWV1ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclRyYW5zZm9ybXNGcm9tUXVldWUoKSB7XG4gICAgICBpZiAoIXRoaXMuZG9uZSB8fCAhdGhpcy5fdGltZWxpbmUgfHwgIXRoaXMuX3RpbWVsaW5lLl9ydW5uZXJJZHMuaW5jbHVkZXModGhpcy5pZCkpIHtcbiAgICAgICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gIWl0ZW0uaXNUcmFuc2Zvcm07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcInNhbml0aXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNhbml0aXNlKGR1cmF0aW9uLCBkZWxheSwgd2hlbikge1xuICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgZGVmYXVsdCBwYXJhbWV0ZXJzXG4gICAgICB2YXIgdGltZXMgPSAxO1xuICAgICAgdmFyIHN3aW5nID0gZmFsc2U7XG4gICAgICB2YXIgd2FpdCA9IDA7XG4gICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRpbWVsaW5lLmR1cmF0aW9uO1xuICAgICAgZGVsYXkgPSBkZWxheSB8fCB0aW1lbGluZS5kZWxheTtcbiAgICAgIHdoZW4gPSB3aGVuIHx8ICdsYXN0JzsgLy8gSWYgd2UgaGF2ZSBhbiBvYmplY3QsIHVucGFjayB0aGUgdmFsdWVzXG5cbiAgICAgIGlmIChfdHlwZW9mKGR1cmF0aW9uKSA9PT0gJ29iamVjdCcgJiYgIShkdXJhdGlvbiBpbnN0YW5jZW9mIFN0ZXBwZXIpKSB7XG4gICAgICAgIGRlbGF5ID0gZHVyYXRpb24uZGVsYXkgfHwgZGVsYXk7XG4gICAgICAgIHdoZW4gPSBkdXJhdGlvbi53aGVuIHx8IHdoZW47XG4gICAgICAgIHN3aW5nID0gZHVyYXRpb24uc3dpbmcgfHwgc3dpbmc7XG4gICAgICAgIHRpbWVzID0gZHVyYXRpb24udGltZXMgfHwgdGltZXM7XG4gICAgICAgIHdhaXQgPSBkdXJhdGlvbi53YWl0IHx8IHdhaXQ7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24uZHVyYXRpb24gfHwgdGltZWxpbmUuZHVyYXRpb247XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgZGVsYXk6IGRlbGF5LFxuICAgICAgICBzd2luZzogc3dpbmcsXG4gICAgICAgIHRpbWVzOiB0aW1lcyxcbiAgICAgICAgd2FpdDogd2FpdCxcbiAgICAgICAgd2hlbjogd2hlblxuICAgICAgfTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUnVubmVyO1xufShFdmVudFRhcmdldCk7XG5SdW5uZXIuaWQgPSAwO1xuXG52YXIgRmFrZVJ1bm5lciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEZha2VSdW5uZXIoKSB7XG4gICAgdmFyIHRyYW5zZm9ybXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG5ldyBNYXRyaXgoKTtcbiAgICB2YXIgaWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IC0xO1xuICAgIHZhciBkb25lID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0cnVlO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZha2VSdW5uZXIpO1xuXG4gICAgdGhpcy50cmFuc2Zvcm1zID0gdHJhbnNmb3JtcztcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5kb25lID0gZG9uZTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhGYWtlUnVubmVyLCBbe1xuICAgIGtleTogXCJjbGVhclRyYW5zZm9ybXNGcm9tUXVldWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJUcmFuc2Zvcm1zRnJvbVF1ZXVlKCkge31cbiAgfV0pO1xuXG4gIHJldHVybiBGYWtlUnVubmVyO1xufSgpO1xuXG5leHRlbmQoW1J1bm5lciwgRmFrZVJ1bm5lcl0sIHtcbiAgbWVyZ2VXaXRoOiBmdW5jdGlvbiBtZXJnZVdpdGgocnVubmVyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWtlUnVubmVyKHJ1bm5lci50cmFuc2Zvcm1zLmxtdWx0aXBseSh0aGlzLnRyYW5zZm9ybXMpLCBydW5uZXIuaWQpO1xuICB9XG59KTsgLy8gRmFrZVJ1bm5lci5lbXB0eVJ1bm5lciA9IG5ldyBGYWtlUnVubmVyKClcblxudmFyIGxtdWx0aXBseSA9IGZ1bmN0aW9uIGxtdWx0aXBseShsYXN0LCBjdXJyKSB7XG4gIHJldHVybiBsYXN0LmxtdWx0aXBseU8oY3Vycik7XG59O1xuXG52YXIgZ2V0UnVubmVyVHJhbnNmb3JtID0gZnVuY3Rpb24gZ2V0UnVubmVyVHJhbnNmb3JtKHJ1bm5lcikge1xuICByZXR1cm4gcnVubmVyLnRyYW5zZm9ybXM7XG59O1xuXG5mdW5jdGlvbiBtZXJnZVRyYW5zZm9ybXMoKSB7XG4gIC8vIEZpbmQgdGhlIG1hdHJpeCB0byBhcHBseSB0byB0aGUgZWxlbWVudCBhbmQgYXBwbHkgaXRcbiAgdmFyIHJ1bm5lcnMgPSB0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMucnVubmVycztcbiAgdmFyIG5ldFRyYW5zZm9ybSA9IHJ1bm5lcnMubWFwKGdldFJ1bm5lclRyYW5zZm9ybSkucmVkdWNlKGxtdWx0aXBseSwgbmV3IE1hdHJpeCgpKTtcbiAgdGhpcy50cmFuc2Zvcm0obmV0VHJhbnNmb3JtKTtcblxuICB0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMubWVyZ2UoKTtcblxuICBpZiAodGhpcy5fdHJhbnNmb3JtYXRpb25SdW5uZXJzLmxlbmd0aCgpID09PSAxKSB7XG4gICAgdGhpcy5fZnJhbWVJZCA9IG51bGw7XG4gIH1cbn1cblxudmFyIFJ1bm5lckFycmF5ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUnVubmVyQXJyYXkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJ1bm5lckFycmF5KTtcblxuICAgIHRoaXMucnVubmVycyA9IFtdO1xuICAgIHRoaXMuaWRzID0gW107XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUnVubmVyQXJyYXksIFt7XG4gICAga2V5OiBcImFkZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQocnVubmVyKSB7XG4gICAgICBpZiAodGhpcy5ydW5uZXJzLmluY2x1ZGVzKHJ1bm5lcikpIHJldHVybjtcbiAgICAgIHZhciBpZCA9IHJ1bm5lci5pZCArIDE7XG4gICAgICB0aGlzLnJ1bm5lcnMucHVzaChydW5uZXIpO1xuICAgICAgdGhpcy5pZHMucHVzaChpZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0QnlJRFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCeUlEKGlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uZXJzW3RoaXMuaWRzLmluZGV4T2YoaWQgKyAxKV07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuaWRzLmluZGV4T2YoaWQgKyAxKTtcbiAgICAgIHRoaXMuaWRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnJ1bm5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtZXJnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtZXJnZSgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgbGFzdFJ1bm5lciA9IG51bGw7XG4gICAgICB0aGlzLnJ1bm5lcnMuZm9yRWFjaChmdW5jdGlvbiAocnVubmVyLCBpKSB7XG4gICAgICAgIHZhciBjb25kaXRpb24gPSBsYXN0UnVubmVyICYmIHJ1bm5lci5kb25lICYmIGxhc3RSdW5uZXIuZG9uZSAvLyBkb24ndCBtZXJnZSBydW5uZXIgd2hlbiBwZXJzaXN0ZWQgb24gdGltZWxpbmVcbiAgICAgICAgJiYgKCFydW5uZXIuX3RpbWVsaW5lIHx8ICFydW5uZXIuX3RpbWVsaW5lLl9ydW5uZXJJZHMuaW5jbHVkZXMocnVubmVyLmlkKSkgJiYgKCFsYXN0UnVubmVyLl90aW1lbGluZSB8fCAhbGFzdFJ1bm5lci5fdGltZWxpbmUuX3J1bm5lcklkcy5pbmNsdWRlcyhsYXN0UnVubmVyLmlkKSk7XG5cbiAgICAgICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgICAgIC8vIHRoZSArMSBoYXBwZW5zIGluIHRoZSBmdW5jdGlvblxuICAgICAgICAgIF90aGlzMi5yZW1vdmUocnVubmVyLmlkKTtcblxuICAgICAgICAgIF90aGlzMi5lZGl0KGxhc3RSdW5uZXIuaWQsIHJ1bm5lci5tZXJnZVdpdGgobGFzdFJ1bm5lcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFJ1bm5lciA9IHJ1bm5lcjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVkaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZWRpdChpZCwgbmV3UnVubmVyKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmlkcy5pbmRleE9mKGlkICsgMSk7XG4gICAgICB0aGlzLmlkcy5zcGxpY2UoaW5kZXgsIDEsIGlkICsgMSk7XG4gICAgICB0aGlzLnJ1bm5lcnMuc3BsaWNlKGluZGV4LCAxLCBuZXdSdW5uZXIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxlbmd0aFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZW5ndGgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pZHMubGVuZ3RoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhckJlZm9yZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhckJlZm9yZShpZCkge1xuICAgICAgdmFyIGRlbGV0ZUNudCA9IHRoaXMuaWRzLmluZGV4T2YoaWQgKyAxKSB8fCAxO1xuICAgICAgdGhpcy5pZHMuc3BsaWNlKDAsIGRlbGV0ZUNudCwgMCk7XG4gICAgICB0aGlzLnJ1bm5lcnMuc3BsaWNlKDAsIGRlbGV0ZUNudCwgbmV3IEZha2VSdW5uZXIoKSkuZm9yRWFjaChmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gci5jbGVhclRyYW5zZm9ybXNGcm9tUXVldWUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJ1bm5lckFycmF5O1xufSgpO1xuXG5yZWdpc3Rlck1ldGhvZHMoe1xuICBFbGVtZW50OiB7XG4gICAgYW5pbWF0ZTogZnVuY3Rpb24gYW5pbWF0ZShkdXJhdGlvbiwgZGVsYXksIHdoZW4pIHtcbiAgICAgIHZhciBvID0gUnVubmVyLnNhbml0aXNlKGR1cmF0aW9uLCBkZWxheSwgd2hlbik7XG4gICAgICB2YXIgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lKCk7XG4gICAgICByZXR1cm4gbmV3IFJ1bm5lcihvLmR1cmF0aW9uKS5sb29wKG8pLmVsZW1lbnQodGhpcykudGltZWxpbmUodGltZWxpbmUucGxheSgpKS5zY2hlZHVsZShvLmRlbGF5LCBvLndoZW4pO1xuICAgIH0sXG4gICAgZGVsYXk6IGZ1bmN0aW9uIGRlbGF5KGJ5LCB3aGVuKSB7XG4gICAgICByZXR1cm4gdGhpcy5hbmltYXRlKDAsIGJ5LCB3aGVuKTtcbiAgICB9LFxuICAgIC8vIHRoaXMgZnVuY3Rpb24gc2VhcmNoZXMgZm9yIGFsbCBydW5uZXJzIG9uIHRoZSBlbGVtZW50IGFuZCBkZWxldGVzIHRoZSBvbmVzXG4gICAgLy8gd2hpY2ggcnVuIGJlZm9yZSB0aGUgY3VycmVudCBvbmUuIFRoaXMgaXMgYmVjYXVzZSBhYnNvbHV0ZSB0cmFuc2Zvcm1hdGlvbnNcbiAgICAvLyBvdmVyd2ZyaXRlIGFueXRoaW5nIGFueXdheSBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHdhc3RlIHRpbWUgY29tcHV0aW5nXG4gICAgLy8gb3RoZXIgcnVubmVyc1xuICAgIF9jbGVhclRyYW5zZm9ybVJ1bm5lcnNCZWZvcmU6IGZ1bmN0aW9uIF9jbGVhclRyYW5zZm9ybVJ1bm5lcnNCZWZvcmUoY3VycmVudFJ1bm5lcikge1xuICAgICAgdGhpcy5fdHJhbnNmb3JtYXRpb25SdW5uZXJzLmNsZWFyQmVmb3JlKGN1cnJlbnRSdW5uZXIuaWQpO1xuICAgIH0sXG4gICAgX2N1cnJlbnRUcmFuc2Zvcm06IGZ1bmN0aW9uIF9jdXJyZW50VHJhbnNmb3JtKGN1cnJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMucnVubmVycyAvLyB3ZSBuZWVkIHRoZSBlcXVhbCBzaWduIGhlcmUgdG8gbWFrZSBzdXJlLCB0aGF0IGFsc28gdHJhbnNmb3JtYXRpb25zXG4gICAgICAvLyBvbiB0aGUgc2FtZSBydW5uZXIgd2hpY2ggZXhlY3V0ZSBiZWZvcmUgdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gYXJlXG4gICAgICAvLyB0YWtlbiBpbnRvIGFjY291bnRcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHJ1bm5lcikge1xuICAgICAgICByZXR1cm4gcnVubmVyLmlkIDw9IGN1cnJlbnQuaWQ7XG4gICAgICB9KS5tYXAoZ2V0UnVubmVyVHJhbnNmb3JtKS5yZWR1Y2UobG11bHRpcGx5LCBuZXcgTWF0cml4KCkpO1xuICAgIH0sXG4gICAgX2FkZFJ1bm5lcjogZnVuY3Rpb24gX2FkZFJ1bm5lcihydW5uZXIpIHtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybWF0aW9uUnVubmVycy5hZGQocnVubmVyKTsgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIHJ1bm5lciBtZXJnZSBpcyBleGVjdXRlZCBhdCB0aGUgdmVyeSBlbmQgb2ZcbiAgICAgIC8vIGFsbCBBbmltYXRvciBmdW5jdGlvbnMuIFRoYXRzIHdoeSB3ZSB1c2UgaW1tZWRpYXRlIGhlcmUgdG8gZXhlY3V0ZVxuICAgICAgLy8gdGhlIG1lcmdlIHJpZ2h0IGFmdGVyIGFsbCBmcmFtZXMgYXJlIHJ1blxuXG5cbiAgICAgIEFuaW1hdG9yLmNhbmNlbEltbWVkaWF0ZSh0aGlzLl9mcmFtZUlkKTtcbiAgICAgIHRoaXMuX2ZyYW1lSWQgPSBBbmltYXRvci5pbW1lZGlhdGUobWVyZ2VUcmFuc2Zvcm1zLmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgX3ByZXBhcmVSdW5uZXI6IGZ1bmN0aW9uIF9wcmVwYXJlUnVubmVyKCkge1xuICAgICAgaWYgKHRoaXMuX2ZyYW1lSWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1hdGlvblJ1bm5lcnMgPSBuZXcgUnVubmVyQXJyYXkoKS5hZGQobmV3IEZha2VSdW5uZXIobmV3IE1hdHJpeCh0aGlzKSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5leHRlbmQoUnVubmVyLCB7XG4gIGF0dHI6IGZ1bmN0aW9uIGF0dHIoYSwgdikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlQXR0cignYXR0cicsIGEsIHYpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSBzdHlsZXNcbiAgY3NzOiBmdW5jdGlvbiBjc3Mocywgdikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlQXR0cignY3NzJywgcywgdik7XG4gIH0sXG4gIHN0eWxlQXR0cjogZnVuY3Rpb24gc3R5bGVBdHRyKHR5cGUsIG5hbWUsIHZhbCkge1xuICAgIC8vIGFwcGx5IGF0dHJpYnV0ZXMgaW5kaXZpZHVhbGx5XG4gICAgaWYgKF90eXBlb2YobmFtZSkgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICB0aGlzLnN0eWxlQXR0cih0eXBlLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBtb3JwaGVyID0gbmV3IE1vcnBoYWJsZSh0aGlzLl9zdGVwcGVyKS50byh2YWwpO1xuICAgIHRoaXMucXVldWUoZnVuY3Rpb24gKCkge1xuICAgICAgbW9ycGhlciA9IG1vcnBoZXIuZnJvbSh0aGlzLmVsZW1lbnQoKVt0eXBlXShuYW1lKSk7XG4gICAgfSwgZnVuY3Rpb24gKHBvcykge1xuICAgICAgdGhpcy5lbGVtZW50KClbdHlwZV0obmFtZSwgbW9ycGhlci5hdChwb3MpKTtcbiAgICAgIHJldHVybiBtb3JwaGVyLmRvbmUoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgem9vbTogZnVuY3Rpb24gem9vbShsZXZlbCwgcG9pbnQpIHtcbiAgICBpZiAodGhpcy5fdHJ5UmV0YXJnZXQoJ3pvb20nLCB0bywgcG9pbnQpKSByZXR1cm4gdGhpcztcbiAgICB2YXIgbW9ycGhlciA9IG5ldyBNb3JwaGFibGUodGhpcy5fc3RlcHBlcikudG8obmV3IFNWR051bWJlcihsZXZlbCkpO1xuICAgIHRoaXMucXVldWUoZnVuY3Rpb24gKCkge1xuICAgICAgbW9ycGhlciA9IG1vcnBoZXIuZnJvbSh0aGlzLmVsZW1lbnQoKS56b29tKCkpO1xuICAgIH0sIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHRoaXMuZWxlbWVudCgpLnpvb20obW9ycGhlci5hdChwb3MpLCBwb2ludCk7XG4gICAgICByZXR1cm4gbW9ycGhlci5kb25lKCk7XG4gICAgfSwgZnVuY3Rpb24gKG5ld0xldmVsLCBuZXdQb2ludCkge1xuICAgICAgcG9pbnQgPSBuZXdQb2ludDtcbiAgICAgIG1vcnBoZXIudG8obmV3TGV2ZWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcmVtZW1iZXJNb3JwaGVyKCd6b29tJywgbW9ycGhlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcclxuICAgKiogYWJzb2x1dGUgdHJhbnNmb3JtYXRpb25zXHJcbiAgICoqL1xuICAvL1xuICAvLyBNIHYgLS0tLS18LS0tLS0oRCBNIHYgPSBGIHYpLS0tLS0tfC0tLS0tPiAgVCB2XG4gIC8vXG4gIC8vIDEuIGRlZmluZSB0aGUgZmluYWwgc3RhdGUgKFQpIGFuZCBkZWNvbXBvc2UgaXQgKG9uY2UpXG4gIC8vICAgIHQgPSBbdHgsIHR5LCB0aGUsIGxhbSwgc3ksIHN4XVxuICAvLyAyLiBvbiBldmVyeSBmcmFtZTogcHVsbCB0aGUgY3VycmVudCBzdGF0ZSBvZiBhbGwgcHJldmlvdXMgdHJhbnNmb3Jtc1xuICAvLyAgICAoTSAtIG0gY2FuIGNoYW5nZSlcbiAgLy8gICBhbmQgdGhlbiB3cml0ZSB0aGlzIGFzIG0gPSBbdHgwLCB0eTAsIHRoZTAsIGxhbTAsIHN5MCwgc3gwXVxuICAvLyAzLiBGaW5kIHRoZSBpbnRlcnBvbGF0ZWQgbWF0cml4IEYocG9zKSA9IG0gKyBwb3MgKiAodCAtIG0pXG4gIC8vICAgLSBOb3RlIEYoMCkgPSBNXG4gIC8vICAgLSBOb3RlIEYoMSkgPSBUXG4gIC8vIDQuIE5vdyB5b3UgZ2V0IHRoZSBkZWx0YSBtYXRyaXggYXMgYSByZXN1bHQ6IEQgPSBGICogaW52KE0pXG4gIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHRyYW5zZm9ybXMsIHJlbGF0aXZlLCBhZmZpbmUpIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGEgZGVjbGFyYXRpdmUgZnVuY3Rpb24sIHdlIHNob3VsZCByZXRhcmdldCBpdCBpZiBwb3NzaWJsZVxuICAgIHJlbGF0aXZlID0gdHJhbnNmb3Jtcy5yZWxhdGl2ZSB8fCByZWxhdGl2ZTtcblxuICAgIGlmICh0aGlzLl9pc0RlY2xhcmF0aXZlICYmICFyZWxhdGl2ZSAmJiB0aGlzLl90cnlSZXRhcmdldCgndHJhbnNmb3JtJywgdHJhbnNmb3JtcykpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gUGFyc2UgdGhlIHBhcmFtZXRlcnNcblxuXG4gICAgdmFyIGlzTWF0cml4ID0gTWF0cml4LmlzTWF0cml4TGlrZSh0cmFuc2Zvcm1zKTtcbiAgICBhZmZpbmUgPSB0cmFuc2Zvcm1zLmFmZmluZSAhPSBudWxsID8gdHJhbnNmb3Jtcy5hZmZpbmUgOiBhZmZpbmUgIT0gbnVsbCA/IGFmZmluZSA6ICFpc01hdHJpeDsgLy8gQ3JlYXRlIGEgbW9yZXBoZXIgYW5kIHNldCBpdHMgdHlwZVxuXG4gICAgdmFyIG1vcnBoZXIgPSBuZXcgTW9ycGhhYmxlKHRoaXMuX3N0ZXBwZXIpLnR5cGUoYWZmaW5lID8gVHJhbnNmb3JtQmFnIDogTWF0cml4KTtcbiAgICB2YXIgb3JpZ2luO1xuICAgIHZhciBlbGVtZW50O1xuICAgIHZhciBjdXJyZW50O1xuICAgIHZhciBjdXJyZW50QW5nbGU7XG4gICAgdmFyIHN0YXJ0VHJhbnNmb3JtO1xuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAvLyBtYWtlIHN1cmUgZWxlbWVudCBhbmQgb3JpZ2luIGlzIGRlZmluZWRcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IHRoaXMuZWxlbWVudCgpO1xuICAgICAgb3JpZ2luID0gb3JpZ2luIHx8IGdldE9yaWdpbih0cmFuc2Zvcm1zLCBlbGVtZW50KTtcbiAgICAgIHN0YXJ0VHJhbnNmb3JtID0gbmV3IE1hdHJpeChyZWxhdGl2ZSA/IHVuZGVmaW5lZCA6IGVsZW1lbnQpOyAvLyBhZGQgdGhlIHJ1bm5lciB0byB0aGUgZWxlbWVudCBzbyBpdCBjYW4gbWVyZ2UgdHJhbnNmb3JtYXRpb25zXG5cbiAgICAgIGVsZW1lbnQuX2FkZFJ1bm5lcih0aGlzKTsgLy8gRGVhY3RpdmF0ZSBhbGwgdHJhbnNmb3JtcyB0aGF0IGhhdmUgcnVuIHNvIGZhciBpZiB3ZSBhcmUgYWJzb2x1dGVcblxuXG4gICAgICBpZiAoIXJlbGF0aXZlKSB7XG4gICAgICAgIGVsZW1lbnQuX2NsZWFyVHJhbnNmb3JtUnVubmVyc0JlZm9yZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4ocG9zKSB7XG4gICAgICAvLyBjbGVhciBhbGwgb3RoZXIgdHJhbnNmb3JtcyBiZWZvcmUgdGhpcyBpbiBjYXNlIHNvbWV0aGluZyBpcyBzYXZlZFxuICAgICAgLy8gb24gdGhpcyBydW5uZXIuIFdlIGFyZSBhYnNvbHV0ZS4gV2UgZG9udCBuZWVkIHRoZXNlIVxuICAgICAgaWYgKCFyZWxhdGl2ZSkgdGhpcy5jbGVhclRyYW5zZm9ybSgpO1xuXG4gICAgICB2YXIgX3RyYW5zZm9ybSA9IG5ldyBQb2ludChvcmlnaW4pLnRyYW5zZm9ybShlbGVtZW50Ll9jdXJyZW50VHJhbnNmb3JtKHRoaXMpKSxcbiAgICAgICAgICB4ID0gX3RyYW5zZm9ybS54LFxuICAgICAgICAgIHkgPSBfdHJhbnNmb3JtLnk7XG5cbiAgICAgIHZhciB0YXJnZXQgPSBuZXcgTWF0cml4KF9vYmplY3RTcHJlYWQkMSh7fSwgdHJhbnNmb3Jtcywge1xuICAgICAgICBvcmlnaW46IFt4LCB5XVxuICAgICAgfSkpO1xuICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5faXNEZWNsYXJhdGl2ZSAmJiBjdXJyZW50ID8gY3VycmVudCA6IHN0YXJ0VHJhbnNmb3JtO1xuXG4gICAgICBpZiAoYWZmaW5lKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5kZWNvbXBvc2UoeCwgeSk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQuZGVjb21wb3NlKHgsIHkpOyAvLyBHZXQgdGhlIGN1cnJlbnQgYW5kIHRhcmdldCBhbmdsZSBhcyBpdCB3YXMgc2V0XG5cbiAgICAgICAgdmFyIHJUYXJnZXQgPSB0YXJnZXQucm90YXRlO1xuICAgICAgICB2YXIgckN1cnJlbnQgPSBzdGFydC5yb3RhdGU7IC8vIEZpZ3VyZSBvdXQgdGhlIHNob3J0ZXN0IHBhdGggdG8gcm90YXRlIGRpcmVjdGx5XG5cbiAgICAgICAgdmFyIHBvc3NpYmlsaXRpZXMgPSBbclRhcmdldCAtIDM2MCwgclRhcmdldCwgclRhcmdldCArIDM2MF07XG4gICAgICAgIHZhciBkaXN0YW5jZXMgPSBwb3NzaWJpbGl0aWVzLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gckN1cnJlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHNob3J0ZXN0ID0gTWF0aC5taW4uYXBwbHkoTWF0aCwgX3RvQ29uc3VtYWJsZUFycmF5KGRpc3RhbmNlcykpO1xuICAgICAgICB2YXIgaW5kZXggPSBkaXN0YW5jZXMuaW5kZXhPZihzaG9ydGVzdCk7XG4gICAgICAgIHRhcmdldC5yb3RhdGUgPSBwb3NzaWJpbGl0aWVzW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgIC8vIHdlIGhhdmUgdG8gYmUgY2FyZWZ1bCBoZXJlIG5vdCB0byBvdmVyd3JpdGUgdGhlIHJvdGF0aW9uXG4gICAgICAgIC8vIHdpdGggdGhlIHJvdGF0ZSBtZXRob2Qgb2YgTWF0cml4XG4gICAgICAgIGlmICghaXNNYXRyaXgpIHtcbiAgICAgICAgICB0YXJnZXQucm90YXRlID0gdHJhbnNmb3Jtcy5yb3RhdGUgfHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pc0RlY2xhcmF0aXZlICYmIGN1cnJlbnRBbmdsZSkge1xuICAgICAgICAgIHN0YXJ0LnJvdGF0ZSA9IGN1cnJlbnRBbmdsZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtb3JwaGVyLmZyb20oc3RhcnQpO1xuICAgICAgbW9ycGhlci50byh0YXJnZXQpO1xuICAgICAgdmFyIGFmZmluZVBhcmFtZXRlcnMgPSBtb3JwaGVyLmF0KHBvcyk7XG4gICAgICBjdXJyZW50QW5nbGUgPSBhZmZpbmVQYXJhbWV0ZXJzLnJvdGF0ZTtcbiAgICAgIGN1cnJlbnQgPSBuZXcgTWF0cml4KGFmZmluZVBhcmFtZXRlcnMpO1xuICAgICAgdGhpcy5hZGRUcmFuc2Zvcm0oY3VycmVudCk7XG5cbiAgICAgIGVsZW1lbnQuX2FkZFJ1bm5lcih0aGlzKTtcblxuICAgICAgcmV0dXJuIG1vcnBoZXIuZG9uZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldGFyZ2V0KG5ld1RyYW5zZm9ybXMpIHtcbiAgICAgIC8vIG9ubHkgZ2V0IGEgbmV3IG9yaWdpbiBpZiBpdCBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGNhbGxcbiAgICAgIGlmICgobmV3VHJhbnNmb3Jtcy5vcmlnaW4gfHwgJ2NlbnRlcicpLnRvU3RyaW5nKCkgIT09ICh0cmFuc2Zvcm1zLm9yaWdpbiB8fCAnY2VudGVyJykudG9TdHJpbmcoKSkge1xuICAgICAgICBvcmlnaW4gPSBnZXRPcmlnaW4odHJhbnNmb3JtcywgZWxlbWVudCk7XG4gICAgICB9IC8vIG92ZXJ3cml0ZSB0aGUgb2xkIHRyYW5zZm9ybWF0aW9ucyB3aXRoIHRoZSBuZXcgb25lc1xuXG5cbiAgICAgIHRyYW5zZm9ybXMgPSBfb2JqZWN0U3ByZWFkJDEoe30sIG5ld1RyYW5zZm9ybXMsIHtcbiAgICAgICAgb3JpZ2luOiBvcmlnaW5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUoc2V0dXAsIHJ1biwgcmV0YXJnZXQsIHRydWUpO1xuICAgIHRoaXMuX2lzRGVjbGFyYXRpdmUgJiYgdGhpcy5fcmVtZW1iZXJNb3JwaGVyKCd0cmFuc2Zvcm0nLCBtb3JwaGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gQW5pbWF0YWJsZSB4LWF4aXNcbiAgeDogZnVuY3Rpb24geChfeCwgcmVsYXRpdmUpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXIoJ3gnLCBfeCk7XG4gIH0sXG4gIC8vIEFuaW1hdGFibGUgeS1heGlzXG4gIHk6IGZ1bmN0aW9uIHkoX3kpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXIoJ3knLCBfeSk7XG4gIH0sXG4gIGR4OiBmdW5jdGlvbiBkeCgpIHtcbiAgICB2YXIgeCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVOdW1iZXJEZWx0YSgneCcsIHgpO1xuICB9LFxuICBkeTogZnVuY3Rpb24gZHkoKSB7XG4gICAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyRGVsdGEoJ3knLCB5KTtcbiAgfSxcbiAgZG1vdmU6IGZ1bmN0aW9uIGRtb3ZlKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5keCh4KS5keSh5KTtcbiAgfSxcbiAgX3F1ZXVlTnVtYmVyRGVsdGE6IGZ1bmN0aW9uIF9xdWV1ZU51bWJlckRlbHRhKG1ldGhvZCwgdG8pIHtcbiAgICB0byA9IG5ldyBTVkdOdW1iZXIodG8pOyAvLyBUcnkgdG8gY2hhbmdlIHRoZSB0YXJnZXQgaWYgd2UgaGF2ZSB0aGlzIG1ldGhvZCBhbHJlYWR5IHJlZ2lzdGVyZFxuXG4gICAgaWYgKHRoaXMuX3RyeVJldGFyZ2V0KG1ldGhvZCwgdG8pKSByZXR1cm4gdGhpczsgLy8gTWFrZSBhIG1vcnBoZXIgYW5kIHF1ZXVlIHRoZSBhbmltYXRpb25cblxuICAgIHZhciBtb3JwaGVyID0gbmV3IE1vcnBoYWJsZSh0aGlzLl9zdGVwcGVyKS50byh0byk7XG4gICAgdmFyIGZyb20gPSBudWxsO1xuICAgIHRoaXMucXVldWUoZnVuY3Rpb24gKCkge1xuICAgICAgZnJvbSA9IHRoaXMuZWxlbWVudCgpW21ldGhvZF0oKTtcbiAgICAgIG1vcnBoZXIuZnJvbShmcm9tKTtcbiAgICAgIG1vcnBoZXIudG8oZnJvbSArIHRvKTtcbiAgICB9LCBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB0aGlzLmVsZW1lbnQoKVttZXRob2RdKG1vcnBoZXIuYXQocG9zKSk7XG4gICAgICByZXR1cm4gbW9ycGhlci5kb25lKCk7XG4gICAgfSwgZnVuY3Rpb24gKG5ld1RvKSB7XG4gICAgICBtb3JwaGVyLnRvKGZyb20gKyBuZXcgU1ZHTnVtYmVyKG5ld1RvKSk7XG4gICAgfSk7IC8vIFJlZ2lzdGVyIHRoZSBtb3JwaGVyIHNvIHRoYXQgaWYgaXQgaXMgY2hhbmdlZCBhZ2Fpbiwgd2UgY2FuIHJldGFyZ2V0IGl0XG5cbiAgICB0aGlzLl9yZW1lbWJlck1vcnBoZXIobWV0aG9kLCBtb3JwaGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfcXVldWVPYmplY3Q6IGZ1bmN0aW9uIF9xdWV1ZU9iamVjdChtZXRob2QsIHRvKSB7XG4gICAgLy8gVHJ5IHRvIGNoYW5nZSB0aGUgdGFyZ2V0IGlmIHdlIGhhdmUgdGhpcyBtZXRob2QgYWxyZWFkeSByZWdpc3RlcmRcbiAgICBpZiAodGhpcy5fdHJ5UmV0YXJnZXQobWV0aG9kLCB0bykpIHJldHVybiB0aGlzOyAvLyBNYWtlIGEgbW9ycGhlciBhbmQgcXVldWUgdGhlIGFuaW1hdGlvblxuXG4gICAgdmFyIG1vcnBoZXIgPSBuZXcgTW9ycGhhYmxlKHRoaXMuX3N0ZXBwZXIpLnRvKHRvKTtcbiAgICB0aGlzLnF1ZXVlKGZ1bmN0aW9uICgpIHtcbiAgICAgIG1vcnBoZXIuZnJvbSh0aGlzLmVsZW1lbnQoKVttZXRob2RdKCkpO1xuICAgIH0sIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHRoaXMuZWxlbWVudCgpW21ldGhvZF0obW9ycGhlci5hdChwb3MpKTtcbiAgICAgIHJldHVybiBtb3JwaGVyLmRvbmUoKTtcbiAgICB9KTsgLy8gUmVnaXN0ZXIgdGhlIG1vcnBoZXIgc28gdGhhdCBpZiBpdCBpcyBjaGFuZ2VkIGFnYWluLCB3ZSBjYW4gcmV0YXJnZXQgaXRcblxuICAgIHRoaXMuX3JlbWVtYmVyTW9ycGhlcihtZXRob2QsIG1vcnBoZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9xdWV1ZU51bWJlcjogZnVuY3Rpb24gX3F1ZXVlTnVtYmVyKG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVPYmplY3QobWV0aG9kLCBuZXcgU1ZHTnVtYmVyKHZhbHVlKSk7XG4gIH0sXG4gIC8vIEFuaW1hdGFibGUgY2VudGVyIHgtYXhpc1xuICBjeDogZnVuY3Rpb24gY3goeCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU51bWJlcignY3gnLCB4KTtcbiAgfSxcbiAgLy8gQW5pbWF0YWJsZSBjZW50ZXIgeS1heGlzXG4gIGN5OiBmdW5jdGlvbiBjeSh5KSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyKCdjeScsIHkpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSBtb3ZlXG4gIG1vdmU6IGZ1bmN0aW9uIG1vdmUoeCwgeSkge1xuICAgIHJldHVybiB0aGlzLngoeCkueSh5KTtcbiAgfSxcbiAgLy8gQWRkIGFuaW1hdGFibGUgY2VudGVyXG4gIGNlbnRlcjogZnVuY3Rpb24gY2VudGVyKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5jeCh4KS5jeSh5KTtcbiAgfSxcbiAgLy8gQWRkIGFuaW1hdGFibGUgc2l6ZVxuICBzaXplOiBmdW5jdGlvbiBzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyBhbmltYXRlIGJib3ggYmFzZWQgc2l6ZSBmb3IgYWxsIG90aGVyIGVsZW1lbnRzXG4gICAgdmFyIGJveDtcblxuICAgIGlmICghd2lkdGggfHwgIWhlaWdodCkge1xuICAgICAgYm94ID0gdGhpcy5fZWxlbWVudC5iYm94KCk7XG4gICAgfVxuXG4gICAgaWYgKCF3aWR0aCkge1xuICAgICAgd2lkdGggPSBib3gud2lkdGggLyBib3guaGVpZ2h0ICogaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmICghaGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSBib3guaGVpZ2h0IC8gYm94LndpZHRoICogd2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xuICB9LFxuICAvLyBBZGQgYW5pbWF0YWJsZSB3aWR0aFxuICB3aWR0aDogZnVuY3Rpb24gd2lkdGgoX3dpZHRoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyKCd3aWR0aCcsIF93aWR0aCk7XG4gIH0sXG4gIC8vIEFkZCBhbmltYXRhYmxlIGhlaWdodFxuICBoZWlnaHQ6IGZ1bmN0aW9uIGhlaWdodChfaGVpZ2h0KSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlTnVtYmVyKCdoZWlnaHQnLCBfaGVpZ2h0KTtcbiAgfSxcbiAgLy8gQWRkIGFuaW1hdGFibGUgcGxvdFxuICBwbG90OiBmdW5jdGlvbiBwbG90KGEsIGIsIGMsIGQpIHtcbiAgICAvLyBMaW5lcyBjYW4gYmUgcGxvdHRlZCB3aXRoIDQgYXJndW1lbnRzXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsb3QoW2EsIGIsIGMsIGRdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdHJ5UmV0YXJnZXQoJ3Bsb3QnLCBhKSkgcmV0dXJuIHRoaXM7XG4gICAgdmFyIG1vcnBoZXIgPSBuZXcgTW9ycGhhYmxlKHRoaXMuX3N0ZXBwZXIpLnR5cGUodGhpcy5fZWxlbWVudC5Nb3JwaEFycmF5KS50byhhKTtcbiAgICB0aGlzLnF1ZXVlKGZ1bmN0aW9uICgpIHtcbiAgICAgIG1vcnBoZXIuZnJvbSh0aGlzLl9lbGVtZW50LmFycmF5KCkpO1xuICAgIH0sIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQucGxvdChtb3JwaGVyLmF0KHBvcykpO1xuXG4gICAgICByZXR1cm4gbW9ycGhlci5kb25lKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZW1lbWJlck1vcnBoZXIoJ3Bsb3QnLCBtb3JwaGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyBBZGQgbGVhZGluZyBtZXRob2RcbiAgbGVhZGluZzogZnVuY3Rpb24gbGVhZGluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZU51bWJlcignbGVhZGluZycsIHZhbHVlKTtcbiAgfSxcbiAgLy8gQWRkIGFuaW1hdGFibGUgdmlld2JveFxuICB2aWV3Ym94OiBmdW5jdGlvbiB2aWV3Ym94KHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVPYmplY3QoJ3ZpZXdib3gnLCBuZXcgQm94KHgsIHksIHdpZHRoLCBoZWlnaHQpKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUobykge1xuICAgIGlmIChfdHlwZW9mKG8pICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlKHtcbiAgICAgICAgb2Zmc2V0OiBhcmd1bWVudHNbMF0sXG4gICAgICAgIGNvbG9yOiBhcmd1bWVudHNbMV0sXG4gICAgICAgIG9wYWNpdHk6IGFyZ3VtZW50c1syXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG8ub3BhY2l0eSAhPSBudWxsKSB0aGlzLmF0dHIoJ3N0b3Atb3BhY2l0eScsIG8ub3BhY2l0eSk7XG4gICAgaWYgKG8uY29sb3IgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLWNvbG9yJywgby5jb2xvcik7XG4gICAgaWYgKG8ub2Zmc2V0ICE9IG51bGwpIHRoaXMuYXR0cignb2Zmc2V0Jywgby5vZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcbmV4dGVuZChSdW5uZXIsIHtcbiAgcng6IHJ4LFxuICByeTogcnksXG4gIGZyb206IGZyb20sXG4gIHRvOiB0b1xufSk7XG5yZWdpc3RlcihSdW5uZXIsICdSdW5uZXInKTtcblxudmFyIFN2ZyA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoU3ZnLCBfQ29udGFpbmVyKTtcblxuICBmdW5jdGlvbiBTdmcobm9kZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdmcpO1xuXG4gICAgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoU3ZnKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnc3ZnJywgbm9kZSksIG5vZGUpKTtcblxuICAgIF90aGlzLm5hbWVzcGFjZSgpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFN2ZywgW3tcbiAgICBrZXk6IFwiaXNSb290XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzUm9vdCgpIHtcbiAgICAgIHJldHVybiAhdGhpcy5ub2RlLnBhcmVudE5vZGUgfHwgISh0aGlzLm5vZGUucGFyZW50Tm9kZSBpbnN0YW5jZW9mIGdsb2JhbHMud2luZG93LlNWR0VsZW1lbnQpIHx8IHRoaXMubm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JztcbiAgICB9IC8vIENoZWNrIGlmIHRoaXMgaXMgYSByb290IHN2Z1xuICAgIC8vIElmIG5vdCwgY2FsbCBkb2NzIGZyb20gdGhpcyBlbGVtZW50XG5cbiAgfSwge1xuICAgIGtleTogXCJyb290XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJvb3QoKSB7XG4gICAgICBpZiAodGhpcy5pc1Jvb3QoKSkgcmV0dXJuIHRoaXM7XG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoU3ZnLnByb3RvdHlwZSksIFwicm9vdFwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH0gLy8gQWRkIG5hbWVzcGFjZXNcblxuICB9LCB7XG4gICAga2V5OiBcIm5hbWVzcGFjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBuYW1lc3BhY2UoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNSb290KCkpIHJldHVybiB0aGlzLnJvb3QoKS5uYW1lc3BhY2UoKTtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoe1xuICAgICAgICB4bWxuczogbnMsXG4gICAgICAgIHZlcnNpb246ICcxLjEnXG4gICAgICB9KS5hdHRyKCd4bWxuczp4bGluaycsIHhsaW5rLCB4bWxucykuYXR0cigneG1sbnM6c3ZnanMnLCBzdmdqcywgeG1sbnMpO1xuICAgIH0gLy8gQ3JlYXRlcyBhbmQgcmV0dXJucyBkZWZzIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcImRlZnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVmcygpIHtcbiAgICAgIGlmICghdGhpcy5pc1Jvb3QoKSkgcmV0dXJuIHRoaXMucm9vdCgpLmRlZnMoKTtcbiAgICAgIHJldHVybiBhZG9wdCh0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignZGVmcycpKSB8fCB0aGlzLnB1dChuZXcgRGVmcygpKTtcbiAgICB9IC8vIGN1c3RvbSBwYXJlbnQgbWV0aG9kXG5cbiAgfSwge1xuICAgIGtleTogXCJwYXJlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGFyZW50KHR5cGUpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUucGFyZW50Tm9kZS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudCcgPyBudWxsIDogYWRvcHQodGhpcy5ub2RlLnBhcmVudE5vZGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoU3ZnLnByb3RvdHlwZSksIFwicGFyZW50XCIsIHRoaXMpLmNhbGwodGhpcywgdHlwZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgLy8gcmVtb3ZlIGNoaWxkcmVuXG4gICAgICB3aGlsZSAodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmxhc3RDaGlsZCk7XG4gICAgICB9IC8vIHJlbW92ZSBkZWZzIHJlZmVyZW5jZVxuXG5cbiAgICAgIGRlbGV0ZSB0aGlzLl9kZWZzO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN2Zztcbn0oQ29udGFpbmVyKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBuZXN0ZWQgc3ZnIGRvY3VtZW50XG4gICAgbmVzdGVkOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFN2ZygpKTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFN2ZywgJ1N2ZycsIHRydWUpO1xuXG52YXIgX1N5bWJvbCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoX1N5bWJvbCwgX0NvbnRhaW5lcik7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIF9TeW1ib2wobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfU3ltYm9sKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoX1N5bWJvbCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3N5bWJvbCcsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICByZXR1cm4gX1N5bWJvbDtcbn0oQ29udGFpbmVyKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIHN5bWJvbDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBfU3ltYm9sKCkpO1xuICAgIH0pXG4gIH1cbn0pO1xucmVnaXN0ZXIoX1N5bWJvbCwgJ1N5bWJvbCcpO1xuXG5mdW5jdGlvbiBwbGFpbih0ZXh0KSB7XG4gIC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcbiAgaWYgKHRoaXMuX2J1aWxkID09PSBmYWxzZSkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgfSAvLyBjcmVhdGUgdGV4dCBub2RlXG5cblxuICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoZ2xvYmFscy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG4gIHJldHVybiB0aGlzO1xufSAvLyBHZXQgbGVuZ3RoIG9mIHRleHQgZWxlbWVudFxuXG5mdW5jdGlvbiBsZW5ndGgoKSB7XG4gIHJldHVybiB0aGlzLm5vZGUuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk7XG59XG5cbnZhciB0ZXh0YWJsZSA9ICh7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0cGxhaW46IHBsYWluLFxuXHRsZW5ndGg6IGxlbmd0aFxufSk7XG5cbnZhciBUZXh0ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKFRleHQsIF9TaGFwZSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFRleHQobm9kZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUZXh0KTtcblxuICAgIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKFRleHQpLmNhbGwodGhpcywgbm9kZU9yTmV3KCd0ZXh0Jywgbm9kZSksIG5vZGUpKTtcbiAgICBfdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkdOdW1iZXIoMS4zKTsgLy8gc3RvcmUgbGVhZGluZyB2YWx1ZSBmb3IgcmVidWlsZGluZ1xuXG4gICAgX3RoaXMuX3JlYnVpbGQgPSB0cnVlOyAvLyBlbmFibGUgYXV0b21hdGljIHVwZGF0aW5nIG9mIGR5IHZhbHVlc1xuXG4gICAgX3RoaXMuX2J1aWxkID0gZmFsc2U7IC8vIGRpc2FibGUgYnVpbGQgbW9kZSBmb3IgYWRkaW5nIG11bHRpcGxlIGxpbmVzXG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH0gLy8gTW92ZSBvdmVyIHgtYXhpc1xuICAvLyBUZXh0IGlzIG1vdmVkIGl0cyBib3VuZGluZyBib3hcbiAgLy8gdGV4dC1hbmNob3IgZG9lcyBOT1QgbWF0dGVyXG5cblxuICBfY3JlYXRlQ2xhc3MoVGV4dCwgW3tcbiAgICBrZXk6IFwieFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB4KF94KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcblxuICAgICAgaWYgKF94ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGJveC54O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgdGhpcy5hdHRyKCd4JykgKyBfeCAtIGJveC54KTtcbiAgICB9IC8vIE1vdmUgb3ZlciB5LWF4aXNcblxuICB9LCB7XG4gICAga2V5OiBcInlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geShfeSkge1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5iYm94KCk7XG5cbiAgICAgIGlmIChfeSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBib3gueTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneScsIHRoaXMuYXR0cigneScpICsgX3kgLSBib3gueSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZSh4LCB5KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0aGlzLmJib3goKTtcbiAgICAgIHJldHVybiB0aGlzLngoeCwgYm94KS55KHksIGJveCk7XG4gICAgfSAvLyBNb3ZlIGNlbnRlciBvdmVyIHgtYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY3hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3goeCkge1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5iYm94KCk7XG5cbiAgICAgIGlmICh4ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGJveC5jeDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIHRoaXMuYXR0cigneCcpICsgeCAtIGJveC5jeCk7XG4gICAgfSAvLyBNb3ZlIGNlbnRlciBvdmVyIHktYXhpc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY3lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3koeSkge1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5iYm94KCk7XG5cbiAgICAgIGlmICh5ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGJveC5jeTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneScsIHRoaXMuYXR0cigneScpICsgeSAtIGJveC5jeSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNlbnRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjZW50ZXIoeCwgeSkge1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdGhpcy5iYm94KCk7XG4gICAgICByZXR1cm4gdGhpcy5jeCh4LCBib3gpLmN5KHksIGJveCk7XG4gICAgfSAvLyBTZXQgdGhlIHRleHQgY29udGVudFxuXG4gIH0sIHtcbiAgICBrZXk6IFwidGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXh0KF90ZXh0KSB7XG4gICAgICAvLyBhY3QgYXMgZ2V0dGVyXG4gICAgICBpZiAoX3RleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgdmFyIGZpcnN0TGluZSA9IDA7XG4gICAgICAgIF90ZXh0ID0gJyc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgLy8gc2tpcCB0ZXh0UGF0aHMgLSB0aGV5IGFyZSBubyBsaW5lc1xuICAgICAgICAgIGlmIChjaGlsZHJlbltpXS5ub2RlTmFtZSA9PT0gJ3RleHRQYXRoJykge1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIGZpcnN0TGluZSA9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IC8vIGFkZCBuZXdsaW5lIGlmIGl0cyBub3QgdGhlIGZpcnN0IGNoaWxkIGFuZCBuZXdMaW5lZCBpcyBzZXQgdG8gdHJ1ZVxuXG5cbiAgICAgICAgICBpZiAoaSAhPT0gZmlyc3RMaW5lICYmIGNoaWxkcmVuW2ldLm5vZGVUeXBlICE9PSAzICYmIGFkb3B0KGNoaWxkcmVuW2ldKS5kb20ubmV3TGluZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF90ZXh0ICs9ICdcXG4nO1xuICAgICAgICAgIH0gLy8gYWRkIGNvbnRlbnQgb2YgdGhpcyBub2RlXG5cblxuICAgICAgICAgIF90ZXh0ICs9IGNoaWxkcmVuW2ldLnRleHRDb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90ZXh0O1xuICAgICAgfSAvLyByZW1vdmUgZXhpc3RpbmcgY29udGVudFxuXG5cbiAgICAgIHRoaXMuY2xlYXIoKS5idWlsZCh0cnVlKTtcblxuICAgICAgaWYgKHR5cGVvZiBfdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBjYWxsIGJsb2NrXG4gICAgICAgIF90ZXh0LmNhbGwodGhpcywgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdG9yZSB0ZXh0IGFuZCBtYWtlIHN1cmUgdGV4dCBpcyBub3QgYmxhbmtcbiAgICAgICAgX3RleHQgPSBfdGV4dC5zcGxpdCgnXFxuJyk7IC8vIGJ1aWxkIG5ldyBsaW5lc1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IF90ZXh0Lmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICB0aGlzLnRzcGFuKF90ZXh0W2pdKS5uZXdMaW5lKCk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gZGlzYWJsZSBidWlsZCBtb2RlIGFuZCByZWJ1aWxkIGxpbmVzXG5cblxuICAgICAgcmV0dXJuIHRoaXMuYnVpbGQoZmFsc2UpLnJlYnVpbGQoKTtcbiAgICB9IC8vIFNldCAvIGdldCBsZWFkaW5nXG5cbiAgfSwge1xuICAgIGtleTogXCJsZWFkaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxlYWRpbmcodmFsdWUpIHtcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbS5sZWFkaW5nO1xuICAgICAgfSAvLyBhY3QgYXMgc2V0dGVyXG5cblxuICAgICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkdOdW1iZXIodmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXMucmVidWlsZCgpO1xuICAgIH0gLy8gUmVidWlsZCBhcHBlYXJhbmNlIHR5cGVcblxuICB9LCB7XG4gICAga2V5OiBcInJlYnVpbGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVidWlsZChfcmVidWlsZCkge1xuICAgICAgLy8gc3RvcmUgbmV3IHJlYnVpbGQgZmxhZyBpZiBnaXZlblxuICAgICAgaWYgKHR5cGVvZiBfcmVidWlsZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRoaXMuX3JlYnVpbGQgPSBfcmVidWlsZDtcbiAgICAgIH0gLy8gZGVmaW5lIHBvc2l0aW9uIG9mIGFsbCBsaW5lc1xuXG5cbiAgICAgIGlmICh0aGlzLl9yZWJ1aWxkKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGJsYW5rTGluZU9mZnNldCA9IDA7XG4gICAgICAgIHZhciBsZWFkaW5nID0gdGhpcy5kb20ubGVhZGluZztcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgZm9udFNpemUgPSBnbG9iYWxzLndpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSkuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1zaXplJyk7XG4gICAgICAgICAgdmFyIGR5ID0gbGVhZGluZyAqIG5ldyBTVkdOdW1iZXIoZm9udFNpemUpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZG9tLm5ld0xpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHIoJ3gnLCBzZWxmLmF0dHIoJ3gnKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQoKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgYmxhbmtMaW5lT2Zmc2V0ICs9IGR5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5hdHRyKCdkeScsIGR5ICsgYmxhbmtMaW5lT2Zmc2V0KTtcbiAgICAgICAgICAgICAgYmxhbmtMaW5lT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpcmUoJ3JlYnVpbGQnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBFbmFibGUgLyBkaXNhYmxlIGJ1aWxkIG1vZGVcblxuICB9LCB7XG4gICAga2V5OiBcImJ1aWxkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGJ1aWxkKF9idWlsZCkge1xuICAgICAgdGhpcy5fYnVpbGQgPSAhIV9idWlsZDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gb3ZlcndyaXRlIG1ldGhvZCBmcm9tIHBhcmVudCB0byBzZXQgZGF0YSBwcm9wZXJseVxuXG4gIH0sIHtcbiAgICBrZXk6IFwic2V0RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXREYXRhKG8pIHtcbiAgICAgIHRoaXMuZG9tID0gbztcbiAgICAgIHRoaXMuZG9tLmxlYWRpbmcgPSBuZXcgU1ZHTnVtYmVyKG8ubGVhZGluZyB8fCAxLjMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRleHQ7XG59KFNoYXBlKTtcbmV4dGVuZChUZXh0LCB0ZXh0YWJsZSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgdGV4dCBlbGVtZW50XG4gICAgdGV4dDogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgVGV4dCgpKS50ZXh0KHRleHQpO1xuICAgIH0pLFxuICAgIC8vIENyZWF0ZSBwbGFpbiB0ZXh0IGVsZW1lbnRcbiAgICBwbGFpbjogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgVGV4dCgpKS5wbGFpbih0ZXh0KTtcbiAgICB9KVxuICB9XG59KTtcbnJlZ2lzdGVyKFRleHQsICdUZXh0Jyk7XG5cbnZhciBUc3BhbiA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1RleHQpIHtcbiAgX2luaGVyaXRzKFRzcGFuLCBfVGV4dCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFRzcGFuKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHNwYW4pO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihUc3BhbikuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3RzcGFuJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBTZXQgdGV4dCBjb250ZW50XG5cblxuICBfY3JlYXRlQ2xhc3MoVHNwYW4sIFt7XG4gICAga2V5OiBcInRleHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGV4dChfdGV4dCkge1xuICAgICAgaWYgKF90ZXh0ID09IG51bGwpIHJldHVybiB0aGlzLm5vZGUudGV4dENvbnRlbnQgKyAodGhpcy5kb20ubmV3TGluZWQgPyAnXFxuJyA6ICcnKTtcbiAgICAgIHR5cGVvZiBfdGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IF90ZXh0LmNhbGwodGhpcywgdGhpcykgOiB0aGlzLnBsYWluKF90ZXh0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gU2hvcnRjdXQgZHhcblxuICB9LCB7XG4gICAga2V5OiBcImR4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGR4KF9keCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZHgnLCBfZHgpO1xuICAgIH0gLy8gU2hvcnRjdXQgZHlcblxuICB9LCB7XG4gICAga2V5OiBcImR5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGR5KF9keSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZHknLCBfZHkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHgoX3gpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3gnLCBfeCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24geShfeSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIF95KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLngoeCkueSh5KTtcbiAgICB9IC8vIENyZWF0ZSBuZXcgbGluZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwibmV3TGluZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXdMaW5lKCkge1xuICAgICAgLy8gZmV0Y2ggdGV4dCBwYXJlbnRcbiAgICAgIHZhciB0ID0gdGhpcy5wYXJlbnQoVGV4dCk7IC8vIG1hcmsgbmV3IGxpbmVcblxuICAgICAgdGhpcy5kb20ubmV3TGluZWQgPSB0cnVlO1xuICAgICAgdmFyIGZvbnRTaXplID0gZ2xvYmFscy53aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5vZGUpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpO1xuICAgICAgdmFyIGR5ID0gdC5kb20ubGVhZGluZyAqIG5ldyBTVkdOdW1iZXIoZm9udFNpemUpOyAvLyBhcHBseSBuZXcgcG9zaXRpb25cblxuICAgICAgcmV0dXJuIHRoaXMuZHkoZHkpLmF0dHIoJ3gnLCB0LngoKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRzcGFuO1xufShUZXh0KTtcbmV4dGVuZChUc3BhbiwgdGV4dGFibGUpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgVHNwYW46IHtcbiAgICB0c3Bhbjogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIHZhciB0c3BhbiA9IG5ldyBUc3BhbigpOyAvLyBjbGVhciBpZiBidWlsZCBtb2RlIGlzIGRpc2FibGVkXG5cbiAgICAgIGlmICghdGhpcy5fYnVpbGQpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgfSAvLyBhZGQgbmV3IHRzcGFuXG5cblxuICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHRzcGFuLm5vZGUpO1xuICAgICAgcmV0dXJuIHRzcGFuLnRleHQodGV4dCk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihUc3BhbiwgJ1RzcGFuJyk7XG5cbnZhciBDbGlwUGF0aCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoQ2xpcFBhdGgsIF9Db250YWluZXIpO1xuXG4gIGZ1bmN0aW9uIENsaXBQYXRoKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2xpcFBhdGgpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihDbGlwUGF0aCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ2NsaXBQYXRoJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyBVbmNsaXAgYWxsIGNsaXBwZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcblxuXG4gIF9jcmVhdGVDbGFzcyhDbGlwUGF0aCwgW3tcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIC8vIHVuY2xpcCBhbGwgdGFyZ2V0c1xuICAgICAgdGhpcy50YXJnZXRzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwudW5jbGlwKCk7XG4gICAgICB9KTsgLy8gcmVtb3ZlIGNsaXBQYXRoIGZyb20gcGFyZW50XG5cbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihDbGlwUGF0aC5wcm90b3R5cGUpLCBcInJlbW92ZVwiLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRhcmdldHMoKSB7XG4gICAgICByZXR1cm4gYmFzZUZpbmQoJ3N2ZyBbY2xpcC1wYXRoKj1cIicgKyB0aGlzLmlkKCkgKyAnXCJdJyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENsaXBQYXRoO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGNsaXBwaW5nIGVsZW1lbnRcbiAgICBjbGlwOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZzKCkucHV0KG5ldyBDbGlwUGF0aCgpKTtcbiAgICB9KVxuICB9LFxuICBFbGVtZW50OiB7XG4gICAgLy8gRGlzdHJpYnV0ZSBjbGlwUGF0aCB0byBzdmcgZWxlbWVudFxuICAgIGNsaXBXaXRoOiBmdW5jdGlvbiBjbGlwV2l0aChlbGVtZW50KSB7XG4gICAgICAvLyB1c2UgZ2l2ZW4gY2xpcCBvciBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgY2xpcHBlciA9IGVsZW1lbnQgaW5zdGFuY2VvZiBDbGlwUGF0aCA/IGVsZW1lbnQgOiB0aGlzLnBhcmVudCgpLmNsaXAoKS5hZGQoZWxlbWVudCk7IC8vIGFwcGx5IG1hc2tcblxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignY2xpcC1wYXRoJywgJ3VybChcIiMnICsgY2xpcHBlci5pZCgpICsgJ1wiKScpO1xuICAgIH0sXG4gICAgLy8gVW5jbGlwIGVsZW1lbnRcbiAgICB1bmNsaXA6IGZ1bmN0aW9uIHVuY2xpcCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2NsaXAtcGF0aCcsIG51bGwpO1xuICAgIH0sXG4gICAgY2xpcHBlcjogZnVuY3Rpb24gY2xpcHBlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmVyZW5jZSgnY2xpcC1wYXRoJyk7XG4gICAgfVxuICB9XG59KTtcbnJlZ2lzdGVyKENsaXBQYXRoLCAnQ2xpcFBhdGgnKTtcblxudmFyIEZvcmVpZ25PYmplY3QgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FbGVtZW50KSB7XG4gIF9pbmhlcml0cyhGb3JlaWduT2JqZWN0LCBfRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gRm9yZWlnbk9iamVjdChub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZvcmVpZ25PYmplY3QpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihGb3JlaWduT2JqZWN0KS5jYWxsKHRoaXMsIG5vZGVPck5ldygnZm9yZWlnbk9iamVjdCcsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICByZXR1cm4gRm9yZWlnbk9iamVjdDtcbn0oRWxlbWVudCk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICBmb3JlaWduT2JqZWN0OiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAod2lkdGgsIGhlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBGb3JlaWduT2JqZWN0KCkpLnNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihGb3JlaWduT2JqZWN0LCAnRm9yZWlnbk9iamVjdCcpO1xuXG52YXIgRyA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoRywgX0NvbnRhaW5lcik7XG5cbiAgZnVuY3Rpb24gRyhub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEcpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihHKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnZycsIG5vZGUpLCBub2RlKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRywgW3tcbiAgICBrZXk6IFwieFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB4KF94KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcbiAgICAgIGlmIChfeCA9PSBudWxsKSByZXR1cm4gYm94Lng7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlKF94LCBib3gueSwgYm94KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwieVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB5KF95KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcbiAgICAgIGlmIChfeSA9PSBudWxsKSByZXR1cm4gYm94Lnk7XG4gICAgICByZXR1cm4gdGhpcy5tb3ZlKGJveC54LCBfeSwgYm94KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKCkge1xuICAgICAgdmFyIHggPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgICB2YXIgeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICAgIHZhciBib3ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHRoaXMuYmJveCgpO1xuICAgICAgdmFyIGR4ID0geCAtIGJveC54O1xuICAgICAgdmFyIGR5ID0geSAtIGJveC55O1xuICAgICAgcmV0dXJuIHRoaXMuZG1vdmUoZHgsIGR5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHgoX2R4KSB7XG4gICAgICByZXR1cm4gdGhpcy5kbW92ZShfZHgsIDApO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkeShfZHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRtb3ZlKDAsIF9keSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRtb3ZlKGR4LCBkeSkge1xuICAgICAgdGhpcy5jaGlsZHJlbigpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY2hpbGRzIGJib3hcbiAgICAgICAgdmFyIGJib3ggPSBjaGlsZC5iYm94KCk7IC8vIEdldCBjaGlsZHMgbWF0cml4XG5cbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KGNoaWxkKTsgLy8gVHJhbnNsYXRlIGNoaWxkcyBtYXRyaXggYnkgYW1vdW50IGFuZFxuICAgICAgICAvLyB0cmFuc2Zvcm0gaXQgYmFjayBpbnRvIHBhcmVudHMgc3BhY2VcblxuICAgICAgICB2YXIgbWF0cml4ID0gbS50cmFuc2xhdGUoZHgsIGR5KS50cmFuc2Zvcm0obS5pbnZlcnNlKCkpOyAvLyBDYWxjdWxhdGUgbmV3IHggYW5kIHkgZnJvbSBvbGQgYm94XG5cbiAgICAgICAgdmFyIHAgPSBuZXcgUG9pbnQoYmJveC54LCBiYm94LnkpLnRyYW5zZm9ybShtYXRyaXgpOyAvLyBNb3ZlIGVsZW1lbnRcblxuICAgICAgICBjaGlsZC5tb3ZlKHAueCwgcC55KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndpZHRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdpZHRoKF93aWR0aCkge1xuICAgICAgdmFyIGJveCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdGhpcy5iYm94KCk7XG4gICAgICBpZiAoX3dpZHRoID09IG51bGwpIHJldHVybiBib3gud2lkdGg7XG4gICAgICByZXR1cm4gdGhpcy5zaXplKF93aWR0aCwgYm94LmhlaWdodCwgYm94KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGVpZ2h0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhlaWdodChfaGVpZ2h0KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0aGlzLmJib3goKTtcbiAgICAgIGlmIChfaGVpZ2h0ID09IG51bGwpIHJldHVybiBib3guaGVpZ2h0O1xuICAgICAgcmV0dXJuIHRoaXMuc2l6ZShib3gud2lkdGgsIF9oZWlnaHQsIGJveCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgYm94ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB0aGlzLmJib3goKTtcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0LCBib3gpO1xuICAgICAgdmFyIHNjYWxlWCA9IHAud2lkdGggLyBib3gud2lkdGg7XG4gICAgICB2YXIgc2NhbGVZID0gcC5oZWlnaHQgLyBib3guaGVpZ2h0O1xuICAgICAgdGhpcy5jaGlsZHJlbigpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpKSB7XG4gICAgICAgIHZhciBvID0gbmV3IFBvaW50KGJveCkudHJhbnNmb3JtKG5ldyBNYXRyaXgoY2hpbGQpLmludmVyc2UoKSk7XG4gICAgICAgIGNoaWxkLnNjYWxlKHNjYWxlWCwgc2NhbGVZLCBvLngsIG8ueSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBHO1xufShDb250YWluZXIpO1xucmVnaXN0ZXJNZXRob2RzKHtcbiAgQ29udGFpbmVyOiB7XG4gICAgLy8gQ3JlYXRlIGEgZ3JvdXAgZWxlbWVudFxuICAgIGdyb3VwOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IEcoKSk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihHLCAnRycpO1xuXG52YXIgQSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoQSwgX0NvbnRhaW5lcik7XG5cbiAgZnVuY3Rpb24gQShub2RlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEEpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihBKS5jYWxsKHRoaXMsIG5vZGVPck5ldygnYScsIG5vZGUpLCBub2RlKSk7XG4gIH0gLy8gTGluayB1cmxcblxuXG4gIF9jcmVhdGVDbGFzcyhBLCBbe1xuICAgIGtleTogXCJ0b1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0byh1cmwpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2hyZWYnLCB1cmwsIHhsaW5rKTtcbiAgICB9IC8vIExpbmsgdGFyZ2V0IGF0dHJpYnV0ZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwidGFyZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRhcmdldChfdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd0YXJnZXQnLCBfdGFyZ2V0KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQTtcbn0oQ29udGFpbmVyKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIC8vIENyZWF0ZSBhIGh5cGVybGluayBlbGVtZW50XG4gICAgbGluazogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKHVybCkge1xuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBBKCkpLnRvKHVybCk7XG4gICAgfSlcbiAgfSxcbiAgRWxlbWVudDoge1xuICAgIC8vIENyZWF0ZSBhIGh5cGVybGluayBlbGVtZW50XG4gICAgbGlua1RvOiBmdW5jdGlvbiBsaW5rVG8odXJsKSB7XG4gICAgICB2YXIgbGluayA9IG5ldyBBKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVybC5jYWxsKGxpbmssIGxpbmspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluay50byh1cmwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQoKS5wdXQobGluaykucHV0KHRoaXMpO1xuICAgIH1cbiAgfVxufSk7XG5yZWdpc3RlcihBLCAnQScpO1xuXG52YXIgTWFzayA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbnRhaW5lcikge1xuICBfaW5oZXJpdHMoTWFzaywgX0NvbnRhaW5lcik7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIE1hc2sobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYXNrKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfZ2V0UHJvdG90eXBlT2YoTWFzaykuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ21hc2snLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIFVubWFzayBhbGwgbWFza2VkIGVsZW1lbnRzIGFuZCByZW1vdmUgaXRzZWxmXG5cblxuICBfY3JlYXRlQ2xhc3MoTWFzaywgW3tcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIC8vIHVubWFzayBhbGwgdGFyZ2V0c1xuICAgICAgdGhpcy50YXJnZXRzKCkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwudW5tYXNrKCk7XG4gICAgICB9KTsgLy8gcmVtb3ZlIG1hc2sgZnJvbSBwYXJlbnRcblxuICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKE1hc2sucHJvdG90eXBlKSwgXCJyZW1vdmVcIiwgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGFyZ2V0c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0YXJnZXRzKCkge1xuICAgICAgcmV0dXJuIGJhc2VGaW5kKCdzdmcgW21hc2sqPVwiJyArIHRoaXMuaWQoKSArICdcIl0nKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTWFzaztcbn0oQ29udGFpbmVyKTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIG1hc2s6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5wdXQobmV3IE1hc2soKSk7XG4gICAgfSlcbiAgfSxcbiAgRWxlbWVudDoge1xuICAgIC8vIERpc3RyaWJ1dGUgbWFzayB0byBzdmcgZWxlbWVudFxuICAgIG1hc2tXaXRoOiBmdW5jdGlvbiBtYXNrV2l0aChlbGVtZW50KSB7XG4gICAgICAvLyB1c2UgZ2l2ZW4gbWFzayBvciBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgbWFza2VyID0gZWxlbWVudCBpbnN0YW5jZW9mIE1hc2sgPyBlbGVtZW50IDogdGhpcy5wYXJlbnQoKS5tYXNrKCkuYWRkKGVsZW1lbnQpOyAvLyBhcHBseSBtYXNrXG5cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hc2snLCAndXJsKFwiIycgKyBtYXNrZXIuaWQoKSArICdcIiknKTtcbiAgICB9LFxuICAgIC8vIFVubWFzayBlbGVtZW50XG4gICAgdW5tYXNrOiBmdW5jdGlvbiB1bm1hc2soKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdtYXNrJywgbnVsbCk7XG4gICAgfSxcbiAgICBtYXNrZXI6IGZ1bmN0aW9uIG1hc2tlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmVyZW5jZSgnbWFzaycpO1xuICAgIH1cbiAgfVxufSk7XG5yZWdpc3RlcihNYXNrLCAnTWFzaycpO1xuXG5mdW5jdGlvbiBvd25LZXlzJDMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KTsga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQkMih0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307IGlmIChpICUgMikgeyBvd25LZXlzJDMoc291cmNlLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pOyB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7IH0gZWxzZSB7IG93bktleXMkMyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIGNzc1J1bGUoc2VsZWN0b3IsIHJ1bGUpIHtcbiAgaWYgKCFzZWxlY3RvcikgcmV0dXJuICcnO1xuICBpZiAoIXJ1bGUpIHJldHVybiBzZWxlY3RvcjtcbiAgdmFyIHJldCA9IHNlbGVjdG9yICsgJ3snO1xuXG4gIGZvciAodmFyIGkgaW4gcnVsZSkge1xuICAgIHJldCArPSB1bkNhbWVsQ2FzZShpKSArICc6JyArIHJ1bGVbaV0gKyAnOyc7XG4gIH1cblxuICByZXQgKz0gJ30nO1xuICByZXR1cm4gcmV0O1xufVxuXG52YXIgU3R5bGUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9FbGVtZW50KSB7XG4gIF9pbmhlcml0cyhTdHlsZSwgX0VsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIFN0eWxlKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3R5bGUpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihTdHlsZSkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3N0eWxlJywgbm9kZSksIG5vZGUpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTdHlsZSwgW3tcbiAgICBrZXk6IFwiYWRkVGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRUZXh0KCkge1xuICAgICAgdmFyIHcgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuICAgICAgdGhpcy5ub2RlLnRleHRDb250ZW50ICs9IHc7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9udFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb250KG5hbWUsIHNyYykge1xuICAgICAgdmFyIHBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgICByZXR1cm4gdGhpcy5ydWxlKCdAZm9udC1mYWNlJywgX29iamVjdFNwcmVhZCQyKHtcbiAgICAgICAgZm9udEZhbWlseTogbmFtZSxcbiAgICAgICAgc3JjOiBzcmNcbiAgICAgIH0sIHBhcmFtcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJydWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJ1bGUoc2VsZWN0b3IsIG9iaikge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkVGV4dChjc3NSdWxlKHNlbGVjdG9yLCBvYmopKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3R5bGU7XG59KEVsZW1lbnQpO1xucmVnaXN0ZXJNZXRob2RzKCdEb20nLCB7XG4gIHN0eWxlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAoc2VsZWN0b3IsIG9iaikge1xuICAgIHJldHVybiB0aGlzLnB1dChuZXcgU3R5bGUoKSkucnVsZShzZWxlY3Rvciwgb2JqKTtcbiAgfSksXG4gIGZvbnRmYWNlOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAobmFtZSwgc3JjLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5wdXQobmV3IFN0eWxlKCkpLmZvbnQobmFtZSwgc3JjLCBwYXJhbXMpO1xuICB9KVxufSk7XG5yZWdpc3RlcihTdHlsZSwgJ1N0eWxlJyk7XG5cbnZhciBUZXh0UGF0aCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1RleHQpIHtcbiAgX2luaGVyaXRzKFRleHRQYXRoLCBfVGV4dCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gIGZ1bmN0aW9uIFRleHRQYXRoKG5vZGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVGV4dFBhdGgpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihUZXh0UGF0aCkuY2FsbCh0aGlzLCBub2RlT3JOZXcoJ3RleHRQYXRoJywgbm9kZSksIG5vZGUpKTtcbiAgfSAvLyByZXR1cm4gdGhlIGFycmF5IG9mIHRoZSBwYXRoIHRyYWNrIGVsZW1lbnRcblxuXG4gIF9jcmVhdGVDbGFzcyhUZXh0UGF0aCwgW3tcbiAgICBrZXk6IFwiYXJyYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXJyYXkoKSB7XG4gICAgICB2YXIgdHJhY2sgPSB0aGlzLnRyYWNrKCk7XG4gICAgICByZXR1cm4gdHJhY2sgPyB0cmFjay5hcnJheSgpIDogbnVsbDtcbiAgICB9IC8vIFBsb3QgcGF0aCBpZiBhbnlcblxuICB9LCB7XG4gICAga2V5OiBcInBsb3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGxvdChkKSB7XG4gICAgICB2YXIgdHJhY2sgPSB0aGlzLnRyYWNrKCk7XG4gICAgICB2YXIgcGF0aEFycmF5ID0gbnVsbDtcblxuICAgICAgaWYgKHRyYWNrKSB7XG4gICAgICAgIHBhdGhBcnJheSA9IHRyYWNrLnBsb3QoZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkID09IG51bGwgPyBwYXRoQXJyYXkgOiB0aGlzO1xuICAgIH0gLy8gR2V0IHRoZSBwYXRoIGVsZW1lbnRcblxuICB9LCB7XG4gICAga2V5OiBcInRyYWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYWNrKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVmZXJlbmNlKCdocmVmJyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRleHRQYXRoO1xufShUZXh0KTtcbnJlZ2lzdGVyTWV0aG9kcyh7XG4gIENvbnRhaW5lcjoge1xuICAgIHRleHRQYXRoOiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodGV4dCwgcGF0aCkge1xuICAgICAgLy8gQ29udmVydCB0ZXh0IHRvIGluc3RhbmNlIGlmIG5lZWRlZFxuICAgICAgaWYgKCEodGV4dCBpbnN0YW5jZW9mIFRleHQpKSB7XG4gICAgICAgIHRleHQgPSB0aGlzLnRleHQodGV4dCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXh0LnBhdGgocGF0aCk7XG4gICAgfSlcbiAgfSxcbiAgVGV4dDoge1xuICAgIC8vIENyZWF0ZSBwYXRoIGZvciB0ZXh0IHRvIHJ1biBvblxuICAgIHBhdGg6IHdyYXBXaXRoQXR0ckNoZWNrKGZ1bmN0aW9uICh0cmFjaykge1xuICAgICAgdmFyIGltcG9ydE5vZGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuICAgICAgdmFyIHRleHRQYXRoID0gbmV3IFRleHRQYXRoKCk7IC8vIGlmIHRyYWNrIGlzIGEgcGF0aCwgcmV1c2UgaXRcblxuICAgICAgaWYgKCEodHJhY2sgaW5zdGFuY2VvZiBQYXRoKSkge1xuICAgICAgICAvLyBjcmVhdGUgcGF0aCBlbGVtZW50XG4gICAgICAgIHRyYWNrID0gdGhpcy5kZWZzKCkucGF0aCh0cmFjayk7XG4gICAgICB9IC8vIGxpbmsgdGV4dFBhdGggdG8gcGF0aCBhbmQgYWRkIGNvbnRlbnRcblxuXG4gICAgICB0ZXh0UGF0aC5hdHRyKCdocmVmJywgJyMnICsgdHJhY2ssIHhsaW5rKTsgLy8gVHJhbnNwbGFudCBhbGwgbm9kZXMgZnJvbSB0ZXh0IHRvIHRleHRQYXRoXG5cbiAgICAgIHZhciBub2RlO1xuXG4gICAgICBpZiAoaW1wb3J0Tm9kZXMpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRleHRQYXRoLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gYWRkIHRleHRQYXRoIGVsZW1lbnQgYXMgY2hpbGQgbm9kZSBhbmQgcmV0dXJuIHRleHRQYXRoXG5cblxuICAgICAgcmV0dXJuIHRoaXMucHV0KHRleHRQYXRoKTtcbiAgICB9KSxcbiAgICAvLyBHZXQgdGhlIHRleHRQYXRoIGNoaWxkcmVuXG4gICAgdGV4dFBhdGg6IGZ1bmN0aW9uIHRleHRQYXRoKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE9uZSgndGV4dFBhdGgnKTtcbiAgICB9XG4gIH0sXG4gIFBhdGg6IHtcbiAgICAvLyBjcmVhdGVzIGEgdGV4dFBhdGggZnJvbSB0aGlzIHBhdGhcbiAgICB0ZXh0OiB3cmFwV2l0aEF0dHJDaGVjayhmdW5jdGlvbiAodGV4dCkge1xuICAgICAgLy8gQ29udmVydCB0ZXh0IHRvIGluc3RhbmNlIGlmIG5lZWRlZFxuICAgICAgaWYgKCEodGV4dCBpbnN0YW5jZW9mIFRleHQpKSB7XG4gICAgICAgIHRleHQgPSBuZXcgVGV4dCgpLmFkZFRvKHRoaXMucGFyZW50KCkpLnRleHQodGV4dCk7XG4gICAgICB9IC8vIENyZWF0ZSB0ZXh0UGF0aCBmcm9tIHRleHQgYW5kIHBhdGggYW5kIHJldHVyblxuXG5cbiAgICAgIHJldHVybiB0ZXh0LnBhdGgodGhpcyk7XG4gICAgfSksXG4gICAgdGFyZ2V0czogZnVuY3Rpb24gdGFyZ2V0cygpIHtcbiAgICAgIHJldHVybiBiYXNlRmluZCgnc3ZnIFtocmVmKj1cIicgKyB0aGlzLmlkKCkgKyAnXCJdJyk7XG4gICAgfVxuICB9XG59KTtcblRleHRQYXRoLnByb3RvdHlwZS5Nb3JwaEFycmF5ID0gUGF0aEFycmF5O1xucmVnaXN0ZXIoVGV4dFBhdGgsICdUZXh0UGF0aCcpO1xuXG52YXIgVXNlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfU2hhcGUpIHtcbiAgX2luaGVyaXRzKFVzZSwgX1NoYXBlKTtcblxuICBmdW5jdGlvbiBVc2Uobm9kZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVc2UpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihVc2UpLmNhbGwodGhpcywgbm9kZU9yTmV3KCd1c2UnLCBub2RlKSwgbm9kZSkpO1xuICB9IC8vIFVzZSBlbGVtZW50IGFzIGEgcmVmZXJlbmNlXG5cblxuICBfY3JlYXRlQ2xhc3MoVXNlLCBbe1xuICAgIGtleTogXCJlbGVtZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVsZW1lbnQoX2VsZW1lbnQsIGZpbGUpIHtcbiAgICAgIC8vIFNldCBsaW5lZCBlbGVtZW50XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgKGZpbGUgfHwgJycpICsgJyMnICsgX2VsZW1lbnQsIHhsaW5rKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVXNlO1xufShTaGFwZSk7XG5yZWdpc3Rlck1ldGhvZHMoe1xuICBDb250YWluZXI6IHtcbiAgICAvLyBDcmVhdGUgYSB1c2UgZWxlbWVudFxuICAgIHVzZTogd3JhcFdpdGhBdHRyQ2hlY2soZnVuY3Rpb24gKGVsZW1lbnQsIGZpbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgVXNlKCkpLmVsZW1lbnQoZWxlbWVudCwgZmlsZSk7XG4gICAgfSlcbiAgfVxufSk7XG5yZWdpc3RlcihVc2UsICdVc2UnKTtcblxuLyogT3B0aW9uYWwgTW9kdWxlcyAqL1xudmFyIFNWRyA9IG1ha2VJbnN0YW5jZTtcbmV4dGVuZChbU3ZnLCBfU3ltYm9sLCBJbWFnZSwgUGF0dGVybiwgTWFya2VyXSwgZ2V0TWV0aG9kc0Zvcigndmlld2JveCcpKTtcbmV4dGVuZChbTGluZSwgUG9seWxpbmUsIFBvbHlnb24sIFBhdGhdLCBnZXRNZXRob2RzRm9yKCdtYXJrZXInKSk7XG5leHRlbmQoVGV4dCwgZ2V0TWV0aG9kc0ZvcignVGV4dCcpKTtcbmV4dGVuZChQYXRoLCBnZXRNZXRob2RzRm9yKCdQYXRoJykpO1xuZXh0ZW5kKERlZnMsIGdldE1ldGhvZHNGb3IoJ0RlZnMnKSk7XG5leHRlbmQoW1RleHQsIFRzcGFuXSwgZ2V0TWV0aG9kc0ZvcignVHNwYW4nKSk7XG5leHRlbmQoW1JlY3QsIEVsbGlwc2UsIENpcmNsZSwgR3JhZGllbnRdLCBnZXRNZXRob2RzRm9yKCdyYWRpdXMnKSk7XG5leHRlbmQoRXZlbnRUYXJnZXQsIGdldE1ldGhvZHNGb3IoJ0V2ZW50VGFyZ2V0JykpO1xuZXh0ZW5kKERvbSwgZ2V0TWV0aG9kc0ZvcignRG9tJykpO1xuZXh0ZW5kKEVsZW1lbnQsIGdldE1ldGhvZHNGb3IoJ0VsZW1lbnQnKSk7XG5leHRlbmQoU2hhcGUsIGdldE1ldGhvZHNGb3IoJ1NoYXBlJykpOyAvLyBleHRlbmQoRWxlbWVudCwgZ2V0Q29uc3RydWN0b3IoJ01lbW9yeScpKVxuXG5leHRlbmQoQ29udGFpbmVyLCBnZXRNZXRob2RzRm9yKCdDb250YWluZXInKSk7XG5leHRlbmQoUnVubmVyLCBnZXRNZXRob2RzRm9yKCdSdW5uZXInKSk7XG5MaXN0LmV4dGVuZChnZXRNZXRob2ROYW1lcygpKTtcbnJlZ2lzdGVyTW9ycGhhYmxlVHlwZShbU1ZHTnVtYmVyLCBDb2xvciwgQm94LCBNYXRyaXgsIFNWR0FycmF5LCBQb2ludEFycmF5LCBQYXRoQXJyYXldKTtcbm1ha2VNb3JwaGFibGUoKTtcblxuZXhwb3J0IHsgQSwgQW5pbWF0b3IsIFNWR0FycmF5IGFzIEFycmF5LCBCb3gsIENpcmNsZSwgQ2xpcFBhdGgsIENvbG9yLCBDb250YWluZXIsIENvbnRyb2xsZXIsIERlZnMsIERvbSwgRWFzZSwgRWxlbWVudCwgRWxsaXBzZSwgRXZlbnRUYXJnZXQsIEZvcmVpZ25PYmplY3QsIEcsIEdyYWRpZW50LCBJbWFnZSwgTGluZSwgTGlzdCwgTWFya2VyLCBNYXNrLCBNYXRyaXgsIE1vcnBoYWJsZSwgTm9uTW9ycGhhYmxlLCBTVkdOdW1iZXIgYXMgTnVtYmVyLCBPYmplY3RCYWcsIFBJRCwgUGF0aCwgUGF0aEFycmF5LCBQYXR0ZXJuLCBQb2ludCwgUG9pbnRBcnJheSwgUG9seWdvbiwgUG9seWxpbmUsIFF1ZXVlLCBSZWN0LCBSdW5uZXIsIFNWRywgU2hhcGUsIFNwcmluZywgU3RvcCwgU3R5bGUsIFN2ZywgX1N5bWJvbCBhcyBTeW1ib2wsIFRleHQsIFRleHRQYXRoLCBUaW1lbGluZSwgVHJhbnNmb3JtQmFnLCBUc3BhbiwgVXNlLCBhZG9wdCwgYXNzaWduTmV3SWQsIGNyZWF0ZSwgZGVmYXVsdHMsIGRpc3BhdGNoLCBlYXNpbmcsIGVpZCwgZXh0ZW5kLCBiYXNlRmluZCBhcyBmaW5kLCBnZXRDbGFzcywgaW52ZW50LCBtYWtlSW5zdGFuY2UsIG1ha2VNb3JwaGFibGUsIG1vY2tBZG9wdCwgbmFtZXNwYWNlcywgbm9kZU9yTmV3LCBvZmYsIG9uLCBwYXJzZXIsIHJlZ2V4LCByZWdpc3RlciwgcmVnaXN0ZXJNb3JwaGFibGVUeXBlLCByZWdpc3RlcldpbmRvdywgcm9vdCwgdXRpbHMsIHdyYXBXaXRoQXR0ckNoZWNrIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdmcuZXNtLmpzLm1hcFxuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vbGliL2dhbWVcIjtcbmltcG9ydCAqIGFzIF9TVkcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjsgXG5pbXBvcnQgU3ByaXRlTG9hZGVyIGZyb20gXCIuL2xpYi9zcHJpdGVMb2FkZXJcIjtcblxuY29uc3Qgc3ByaXRlTG9hZGVyID0gbmV3IFNwcml0ZUxvYWRlcigpO1xuXG5zcHJpdGVMb2FkZXIubG9hZEFsbFNwcml0ZXMoKS50aGVuKCgpPT57XG4gICAgbmV3IEdhbWUoXCIjY29kaW5nQXJlYVwiKTtcbn0pLmNhdGNoKCgpPT57XG4gICAgY29uc29sZS53YXJuKFwiRXJyb3IgbG9hZGluZyBzcHJpdGVzIVwiKTtcbn0pOyIsImltcG9ydCAqIGFzIHN2ZyBmcm9tIFwiQHN2Z2RvdGpzL3N2Zy5qc1wiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IFZlY3RvcjIgZnJvbSBcIi4uL3V0aWwvdmVjdG9yMlwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCBcIkBzdmdkb3Rqcy9zdmcuZHJhZ2dhYmxlLmpzXCI7XG5pbXBvcnQgU3ByaXRlTG9hZGVyIGZyb20gXCIuLi9zcHJpdGVMb2FkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2t7XG5cdHN2Z0c6IHN2Zy5HO1xuXHRzdmdDOiBzdmcuU3ZnO1xuXHRpbnB1dHM6IEFycmF5PENvbm5lY3Rpb24+O1xuXHRvdXRwdXRzOiBBcnJheTxDb25uZWN0aW9uPjtcblx0Z2FtZTogR2FtZTtcblx0ZHJhZ2dhYmxlOiBib29sZWFuO1xuXHRkcmFnZ2FibGVEZWZhdWx0OiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKHN2Z0M6IHN2Zy5TdmcsIGdhbWU6IEdhbWUsIGRyYWdnYWJsZTogYm9vbGVhbiA9IHRydWUpe1xuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XG5cblx0XHR0aGlzLnN2Z0MgPSBzdmdDO1xuXHRcdHRoaXMuc3ZnRyA9IHRoaXMuc3ZnQy5ncm91cCgpO1xuXG5cdFx0dGhpcy5pbnB1dHMgPSBbXTtcblx0XHR0aGlzLm91dHB1dHMgPSBbXTtcblxuXHRcdHRoaXMuZHJhZ2dhYmxlID0gZHJhZ2dhYmxlO1xuXHRcdHRoaXMuZHJhZ2dhYmxlRGVmYXVsdCA9IGRyYWdnYWJsZTtcblx0XHR0aGlzLnN2Z0cuZHJhZ2dhYmxlKGRyYWdnYWJsZSk7XG5cblx0XHR0aGlzLnN2Z0cub24oXCJkcmFnbW92ZS5uYW1lc3BhY2VcIiwgKGU6Q3VzdG9tRXZlbnQpID0+IHtcblx0XHRcdGNvbnN0IGJveCA9IGUuZGV0YWlsLmJveDtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuc3ZnRy50cmFuc2xhdGUoYm94LngsIGJveC55KTtcblxuXHRcdFx0Ly8gVXBkYXRlIHdpcmVzXG5cblx0XHRcdGZvcihsZXQgaW5wdXQgb2YgdGhpcy5pbnB1dHMpe1xuXHRcdFx0XHRpbnB1dC53aXJlLnVwZGF0ZUxpbmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGxldCBvdXRwdXQgb2YgdGhpcy5vdXRwdXRzKXtcblx0XHRcdFx0b3V0cHV0LndpcmUudXBkYXRlTGluZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBCbG9ja3tcblx0XHRpZihjdXN0b21TdmcgPT09IG51bGwpe1xuXHRcdFx0dGhpcy5zdmdHLnJlY3QoMjAwLCAxMDApLmF0dHIoe2NsYXNzOiBcImRlZmF1bHRCbG9ja1wifSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR0aGlzLnN2Z0cuc3ZnKGN1c3RvbVN2Zyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhZGRDb25uZWN0aW9uKHR5cGU6IG51bWJlcik6IEJsb2Nre1xuXHRcdGNvbnN0IG5ld0NvbiA9IG5ldyBDb25uZWN0aW9uKHRoaXMsIHR5cGUpO1xuXG5cdFx0aWYodHlwZSA9PT0gMCl7XG5cdFx0XHRuZXdDb24uZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImNvbm5lY3Rpb25JbnB1dFwiXSk7XG5cdFx0XHRuZXdDb24uc2V0UG9zKG5ldyBWZWN0b3IyKDAsIHRoaXMuaW5wdXRzLmxlbmd0aCAqIDMwICsgNSkpO1xuXG5cdFx0XHR0aGlzLmlucHV0cy5wdXNoKG5ld0Nvbik7XG5cdFx0fVxuXHRcdGVsc2UgaWYodHlwZSA9PT0gMSl7XG5cdFx0XHRuZXdDb24uZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImNvbm5lY3Rpb25PdXRwdXRcIl0pO1xuXHRcdFx0bmV3Q29uLnNldFBvcyhuZXcgVmVjdG9yMigxNzUsIHRoaXMub3V0cHV0cy5sZW5ndGggKiAzMCArIDUpKTtcblxuXHRcdFx0dGhpcy5vdXRwdXRzLnB1c2gobmV3Q29uKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldFBvcyhwb3M6IFZlY3RvcjIpOiBCbG9ja3tcblx0XHR0aGlzLnN2Z0cudHJhbnNsYXRlKHBvcy54LCBwb3MueSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldERyYWdnYWJsZShpc0RyYWdnYWJsZTogYm9vbGVhbik6IEJsb2Nre1xuXHRcdHRoaXMuZHJhZ2dhYmxlID0gaXNEcmFnZ2FibGU7XG5cdFx0dGhpcy5zdmdHLmRyYWdnYWJsZShpc0RyYWdnYWJsZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHJlc2V0RHJhZ2dhYmxlKCk6IEJsb2NreyAvLyBTZXRzIGRyYWdnYWJsZSB0byBkZWZhdWx0IHZhbHVlXG5cdFx0dGhpcy5zZXREcmFnZ2FibGUodGhpcy5kcmFnZ2FibGVEZWZhdWx0KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHdvcmsoKTogdm9pZCB7IC8vIFRoZSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBpbnB1dHMvb3V0cHV0cyBldmVyeSBjeWNsZVxuXHRcdGNvbnN0IGlucHV0VmFsdWVzOiBBcnJheTxudW1iZXI+ID0gdGhpcy5pbnB1dHMubWFwKChpbnB1dDogQ29ubmVjdGlvbik9PmlucHV0LnZhbHVlKTtcblxuXHRcdHRoaXMub3V0cHV0c1swXS5zZW5kKHRoaXMudmFsdWVNb2RpZmllcihpbnB1dFZhbHVlcykpO1xuXHRcdFxuXHRcdGZvcihsZXQgaW5wdXQgb2YgdGhpcy5pbnB1dHMpe1xuXHRcdFx0aW5wdXQudmFsdWUgPSBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhbHVlTW9kaWZpZXIodmFsdWVzOiBBcnJheTxudW1iZXI+KTogbnVtYmVye1xuXHRcdGNvbnNvbGUud2FybihcIlZhbHVlIG1vZGlmaWVyIGZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZCFcIik7XG5cblx0XHRyZXR1cm4gdmFsdWVzWzBdOyAvLyBSZXR1cm4gZmlyc3QgdmFsdWUgYnkgZGVmYXVsdFxuXHR9XG59IiwiaW1wb3J0IEJsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBXaXJlR2hvc3QgZnJvbSBcIi4vd2lyZUdob3N0XCI7XG5pbXBvcnQgV2lyZSBmcm9tIFwiLi93aXJlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuXHR0eXBlOiBudW1iZXI7IC8vIElzIHRoZSBjb25uZWN0aW9uIGFuIGlucHV0ICgwKSBvciBvdXRwdXQgKDEpXG5cdHBhcmVudDogQmxvY2s7XG5cdHN2Zzogc3ZnLkc7XG5cdHdpcmU6IFdpcmU7XG5cdHZhbHVlOiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocGFyZW50OiBCbG9jaywgdHlwZTogbnVtYmVyKXtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHRcdHRoaXMuc3ZnID0gdGhpcy5wYXJlbnQuc3ZnRy5ncm91cCgpO1xuXHRcdHRoaXMud2lyZSA9IG51bGw7XG5cdFx0dGhpcy52YWx1ZSA9IG51bGw7XG5cblx0XHR0aGlzLnN2Zy5yZW1lbWJlcihcImNvbm5lY3Rpb25cIiwgdGhpcyk7XG5cblx0XHR0aGlzLnN2Zy5vbihcIm1vdXNlZG93blwiLCAoZXZlbnQ6TW91c2VFdmVudCkgPT4ge1xuXHRcdFx0Ly8gSWYgbW91c2UgZG93biwgY3JlYXRlIGEgd2lyZSBnaG9zdFxuXG5cdFx0XHRpZih0aGlzLndpcmUgIT09IG51bGwpIHRoaXMud2lyZS5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5wYXJlbnQuZ2FtZS5hY3RpdmVXaXJlR2hvc3QgPSBuZXcgV2lyZUdob3N0KHRoaXMuc3ZnLnJvb3QoKSwgdGhpcyk7XG5cdFx0XHR0aGlzLnBhcmVudC5zZXREcmFnZ2FibGUoZmFsc2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBDb25uZWN0aW9ueyAvLyBEcmF3IHRoZSBjb25uZWN0aW9uXG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnLnJlY3QoMjUsMjUpLmF0dHIoe2NsYXNzOiBcImRlZmF1bHRDb25uZWN0aW9uIHVzZWFibGVcIiwgdHlwZTogdGhpcy50eXBlLnRvU3RyaW5nKCksIGJsb2NrQ29ubmVjdGlvbjogXCJibG9ja0Nvbm5lY3Rpb25cIn0pO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0dGhpcy5zdmcuc3ZnKGN1c3RvbVN2ZykuYXR0cih7Y2xhc3M6IFwidXNlYWJsZVwiLCB0eXBlOiB0aGlzLnR5cGUudG9TdHJpbmcoKSwgYmxvY2tDb25uZWN0aW9uOiBcImJsb2NrQ29ubmVjdGlvblwifSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzZXRQb3MocG9zOiBWZWN0b3IyKTogQ29ubmVjdGlvbntcblx0XHR0aGlzLnN2Zy50cmFuc2xhdGUocG9zLngsIHBvcy55KTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHJlY2VpdmUodmFsdWU6IG51bWJlcik6IENvbm5lY3Rpb257XG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYodGhpcy5wYXJlbnQuaW5wdXRzLmV2ZXJ5KChpbnB1dDogQ29ubmVjdGlvbikgPT4gaW5wdXQudmFsdWUgIT09IG51bGwpKXsgLy8gQ2hlY2sgaWYgdGhlIGJsb2NrIGhhcyByZWNlaXZlZCBhbGwgaXRzIGlucHV0IHZhbHVlc1xuXHRcdFx0dGhpcy5wYXJlbnQud29yaygpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2VuZCh2YWx1ZTogbnVtYmVyKTogQ29ubmVjdGlvbntcblx0XHRpZih0aGlzLndpcmUgIT09IG51bGwpIHRoaXMud2lyZS5icm9hZGNhc3QodmFsdWUpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4uL3Nwcml0ZUxvYWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCBleHRlbmRzIEJsb2Nre1xuXHR2YWx1ZTogbnVtYmVyO1xuXHRvdXRwdXQ6IENvbm5lY3Rpb247XG5cblx0Y29uc3RydWN0b3Ioc3ZnQ29udDogc3ZnLlN2ZywgZ2FtZTogR2FtZSwgaW5pdFZhbDogbnVtYmVyID0gMSl7XG5cdFx0c3VwZXIoc3ZnQ29udCwgZ2FtZSwgZmFsc2UpO1xuXHRcdHRoaXMudmFsdWUgPSBpbml0VmFsO1xuXG5cdFx0dGhpcy5vdXRwdXQgPSBuZXcgQ29ubmVjdGlvbih0aGlzLCAxKTtcblx0fVxuXG5cdGRyYXcoY3VzdG9tU3ZnOiBzdHJpbmcgPSBudWxsKTogSW5wdXR7XG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnRy5yZWN0KDUwLCA1MCkuYXR0cih7Y2xhc3M6IFwiY3ljbGVJbnB1dCB1c2VhYmxlXCJ9KTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHRoaXMuc3ZnRy5zdmcoY3VzdG9tU3ZnKTtcblx0XHR9XHRcblxuXHRcdHRoaXMub3V0cHV0LmRyYXcoU3ByaXRlTG9hZGVyLnNwcml0ZXNbXCJjb25uZWN0aW9uT3V0cHV0XCJdKTtcblx0XHR0aGlzLm91dHB1dC5zZXRQb3MobmV3IFZlY3RvcjIoMTIuNSwgMTIuNSkpO1xuXHRcdHRoaXMub3V0cHV0LnN2Zy5mb3J3YXJkKCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGFkZENvbm5lY3Rpb24oKTogSW5wdXR7XG5cdFx0Y29uc29sZS53YXJuKFwiUHJvcGVydHkgbm90IHVzZWQgaW4gSW5wdXQgb2JqZWN0XCIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0d29yaygpOiBJbnB1dHtcblx0XHRpZih0aGlzLm91dHB1dC53aXJlICE9PSBudWxsKXtcblx0XHRcdHRoaXMub3V0cHV0LnNlbmQodGhpcy52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBTcHJpdGVMb2FkZXIgZnJvbSBcIi4uL3Nwcml0ZUxvYWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBCbG9ja3tcblx0dmFsdWU6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcihzdmdDb250OiBzdmcuU3ZnLCBnYW1lOiBHYW1lLCBpbml0VmFsOiBudW1iZXIgPSAwKXtcblx0XHRzdXBlcihzdmdDb250LCBnYW1lLCBmYWxzZSk7XG5cdFx0dGhpcy52YWx1ZSA9IGluaXRWYWw7XG5cblx0XHR0aGlzLmlucHV0c1swXSA9IG5ldyBDb25uZWN0aW9uKHRoaXMsIDApO1xuXHR9XG5cblx0ZHJhdyhjdXN0b21Tdmc6IHN0cmluZyA9IG51bGwpOiBPdXRwdXR7XG5cdFx0aWYoY3VzdG9tU3ZnID09PSBudWxsKXtcblx0XHRcdHRoaXMuc3ZnRy5yZWN0KDUwLCA1MCkuYXR0cih7Y2xhc3M6IFwiY3ljbGVPdXRwdXQgdXNlYWJsZVwifSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR0aGlzLnN2Z0cuc3ZnKGN1c3RvbVN2Zyk7XG5cdFx0fVx0XG5cblx0XHR0aGlzLmlucHV0c1swXS5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiY29ubmVjdGlvbklucHV0XCJdKTtcblx0XHR0aGlzLmlucHV0c1swXS5zZXRQb3MobmV3IFZlY3RvcjIoMTIuNSwgMTIuNSkpO1xuXHRcdHRoaXMuaW5wdXRzWzBdLnN2Zy5mb3J3YXJkKCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGFkZENvbm5lY3Rpb24oKTogT3V0cHV0e1xuXHRcdGNvbnNvbGUud2FybihcIlByb3BlcnR5IG5vdCB1c2VkIGluIE91dHB1dCBvYmplY3RcIik7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR3b3JrKCk6IE91dHB1dHtcblx0XHR0aGlzLmdhbWUuc2NhbUNvaW4gKz0gdGhpcy5pbnB1dHNbMF0udmFsdWU7XG5cdFx0dGhpcy5nYW1lLnVwZGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgQ29ubmVjdGlvbiBmcm9tIFwiLi9jb25uZWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCB7IGdldFNWR1BvcyB9IGZyb20gXCIuLi91dGlsL3N2Z1V0aWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2lyZXtcblx0aW5wdXQ6IENvbm5lY3Rpb247XG5cdG91dHB1dDogQ29ubmVjdGlvbjtcblx0c3ZnRzogc3ZnLkc7XG5cdHN2Z0xpbmU6IHN2Zy5MaW5lO1xuXG5cdGNvbnN0cnVjdG9yKGlucHV0OiBDb25uZWN0aW9uLCBvdXRwdXQ6IENvbm5lY3Rpb24sIHN2Z0M6IHN2Zy5Tdmcpe1xuXHRcdHRoaXMuaW5wdXQgPSBpbnB1dDtcblx0XHR0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuXHRcdHRoaXMuaW5wdXQud2lyZSA9IHRoaXM7XG5cdFx0dGhpcy5vdXRwdXQud2lyZSA9IHRoaXM7XG5cblx0XHR0aGlzLnN2Z0cgPSBzdmdDLmdyb3VwKCk7XG5cblx0XHR0aGlzLnN2Z0cub24oXCJtb3VzZWRvd25cIiwgKGV2ZW50OiBNb3VzZUV2ZW50KT0+eyAvLyBDaGVjayBpZiBjbGljayB3YXMgbWVhbnQgZm9yIGNvbm5lY3Rpb25cblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGNvbnN0IGVsQmVuZWF0aDpzdmcuRyA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KGV2ZW50LngsIGV2ZW50LnkpWzFdLmluc3RhbmNlLnBhcmVudCgpO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbjogQ29ubmVjdGlvbiA9IGVsQmVuZWF0aC5yZW1lbWJlcihcImNvbm5lY3Rpb25cIik7XG5cblx0XHRcdGlmKGNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdGlmKGNvbm5lY3Rpb24gPT09IHRoaXMuaW5wdXQgfHwgY29ubmVjdGlvbiA9PT0gdGhpcy5vdXRwdXQpe1xuXHRcdFx0XHRcdGNvbm5lY3Rpb24uc3ZnLmZpcmUoXCJtb3VzZWRvd25cIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGRyYXcoKTogV2lyZXsgLy8gRHJhdyB0aGUgY29ubmVjdGlvblxuXHRcdGNvbnN0IGlucHV0UG9zID0gZ2V0U1ZHUG9zKHRoaXMuaW5wdXQuc3ZnLCB0cnVlKTtcblx0XHRjb25zdCBvdXRwdXRQb3MgPSBnZXRTVkdQb3ModGhpcy5vdXRwdXQuc3ZnLCB0cnVlKTtcblxuXHRcdHRoaXMuc3ZnTGluZSA9IHRoaXMuc3ZnRy5saW5lKGlucHV0UG9zLngsIGlucHV0UG9zLnksIG91dHB1dFBvcy54LCBvdXRwdXRQb3MueSkuc3Ryb2tlKHsgY29sb3I6ICcjRkY3NzAwJywgd2lkdGg6IDE1LCBsaW5lY2FwOiAncm91bmQnIH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR1cGRhdGVMaW5lKCk6IFdpcmV7XG5cdFx0Y29uc3QgaW5wdXRQb3MgPSBnZXRTVkdQb3ModGhpcy5pbnB1dC5zdmcsIHRydWUpO1xuXHRcdGNvbnN0IG91dHB1dFBvcyA9IGdldFNWR1Bvcyh0aGlzLm91dHB1dC5zdmcsIHRydWUpO1xuXG5cdFx0dGhpcy5zdmdMaW5lLnBsb3QoaW5wdXRQb3MueCwgaW5wdXRQb3MueSwgb3V0cHV0UG9zLngsIG91dHB1dFBvcy55KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cmVtb3ZlKCk6IHZvaWR7IC8vIERlbGV0ZXMgd2lyZVxuXHRcdHRoaXMuc3ZnRy5yZW1vdmUoKTtcblx0XHR0aGlzLmlucHV0LndpcmUgPSBudWxsO1xuXHRcdHRoaXMub3V0cHV0LndpcmUgPSBudWxsO1xuXHR9XG5cblx0YnJvYWRjYXN0KHZhbHVlOiBudW1iZXIpOiBXaXJle1xuXHRcdHRoaXMuaW5wdXQucmVjZWl2ZSh2YWx1ZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSIsImltcG9ydCAqIGFzIHN2ZyBmcm9tIFwiQHN2Z2RvdGpzL3N2Zy5qc1wiO1xuaW1wb3J0IFZlY3RvcjIgZnJvbSBcIi4uL3V0aWwvdmVjdG9yMlwiO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSBcIi4vY29ubmVjdGlvblwiO1xuaW1wb3J0IHsgZ2V0U1ZHUG9zIH0gZnJvbSBcIi4uL3V0aWwvc3ZnVXRpbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXJlR2hvc3R7XG5cdHN2Zzogc3ZnLkxpbmU7XG5cdHAwOiBWZWN0b3IyO1xuXHRjMDogQ29ubmVjdGlvbjtcblxuXHRjb25zdHJ1Y3RvcihzdmdDb250OiBzdmcuU3ZnLCBjMDogQ29ubmVjdGlvbil7XG5cdFx0dGhpcy5wMCA9IGdldFNWR1BvcyhjMC5zdmcsIHRydWUpO1xuXG5cdFx0Ly8gQ3JlYXRlIGxpbmVcblx0XHR0aGlzLnN2ZyA9IHN2Z0NvbnQubGluZSh0aGlzLnAwLngsIHRoaXMucDAueSwgdGhpcy5wMC54LCB0aGlzLnAwLnkpO1xuXHRcdHRoaXMuc3ZnLnN0cm9rZSh7IGNvbG9yOiAncmdiYSgyNSwgMjUsIDI1LCAwLjUpJywgd2lkdGg6IDE1LCBsaW5lY2FwOiAncm91bmQnIH0pO1xuXHRcdHRoaXMuYzAgPSBjMDtcblx0fVxuXG5cdHVwZGF0ZUxpbmUocDE6IFZlY3RvcjIpe1xuXHRcdHRoaXMuc3ZnLnBsb3QodGhpcy5wMC54LCB0aGlzLnAwLnksIHAxLngsIHAxLnkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcblxuaW1wb3J0IElucHV0IGZyb20gXCIuL2NvZGUvaW5wdXRcIjtcbmltcG9ydCBPdXRwdXQgZnJvbSBcIi4vY29kZS9vdXRwdXRcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9jb2RlL2Jsb2NrXCI7XG5pbXBvcnQgVmVjdG9yMiBmcm9tIFwiLi91dGlsL3ZlY3RvcjJcIjtcbmltcG9ydCBXaXJlR2hvc3QgZnJvbSBcIi4vY29kZS93aXJlR2hvc3RcIjtcbmltcG9ydCBDb25uZWN0aW9uIGZyb20gXCIuL2NvZGUvY29ubmVjdGlvblwiO1xuaW1wb3J0IFdpcmUgZnJvbSBcIi4vY29kZS93aXJlXCI7XG5pbXBvcnQgU3ByaXRlTG9hZGVyIGZyb20gXCIuL3Nwcml0ZUxvYWRlclwiO1xuaW1wb3J0IHsgZ2V0Rmlyc3RFbGVtZW50V2l0aFByb3BlcnR5IH0gZnJvbSBcIi4vdXRpbC9kb21VdGlsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWV7XG5cdHNjYW1Db2luOiBudW1iZXI7XG5cdHN2Zzogc3ZnLlN2Zztcblx0YWN0aXZlV2lyZUdob3N0OiBXaXJlR2hvc3Q7XG5cdHNjYW1Db2luQ291bnRlcjogSFRNTEVsZW1lbnQ7XG5cblx0Y29uc3RydWN0b3IoY29kaW5nQXJlYTogc3RyaW5nKXtcblx0XHR0aGlzLnNjYW1Db2luID0gMDtcblx0XHR0aGlzLnN2ZyA9IHN2Zy5TVkcoKS5hZGRUbyhjb2RpbmdBcmVhKS5zaXplKDE5MjAsIDEwODApO1xuXHRcdHRoaXMuc2NhbUNvaW5Db3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluQ291bnRlclwiKTtcblxuXHRcdGNvbnN0IHRlc3RCbG9jayA9IG5ldyBCbG9jayh0aGlzLnN2ZywgdGhpcyk7XG5cdFx0Y29uc3QgdGVzdEJsb2NrMiA9IG5ldyBCbG9jayh0aGlzLnN2ZywgdGhpcyk7XG5cblx0XHR0ZXN0QmxvY2suZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImJsb2NrRG91YmxlXCJdKS5hZGRDb25uZWN0aW9uKDApLmFkZENvbm5lY3Rpb24oMSkuc2V0UG9zKG5ldyBWZWN0b3IyKDUwMCwgMTAwKSk7XG5cdFx0dGVzdEJsb2NrMi5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiYmxvY2tBZGRpdGlvblwiXSkuYWRkQ29ubmVjdGlvbigwKS5hZGRDb25uZWN0aW9uKDApLmFkZENvbm5lY3Rpb24oMSkuc2V0UG9zKG5ldyBWZWN0b3IyKDUwMCwgMjUwKSk7XG5cblx0XHRjb25zdCB0ZXN0TW9kID0gKHZhbHVlczogQXJyYXk8bnVtYmVyPik6IG51bWJlciA9PiB7XG5cdFx0XHRyZXR1cm4gdmFsdWVzWzBdICogMjtcblx0XHR9XG5cblx0XHR0ZXN0QmxvY2sudmFsdWVNb2RpZmllciA9IHRlc3RNb2Q7XG5cdFx0dGVzdEJsb2NrMi52YWx1ZU1vZGlmaWVyID0gKHZhbHVlczogQXJyYXk8bnVtYmVyPik6IG51bWJlciA9PiB7XG5cdFx0XHRyZXR1cm4gdmFsdWVzWzBdICsgdmFsdWVzWzFdO1xuXHRcdH07XG5cblx0XHRjb25zdCB0ZXN0SW5wdXQgPSBuZXcgSW5wdXQodGhpcy5zdmcsIHRoaXMpO1xuXHRcdHRlc3RJbnB1dC5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiYmxvY2tJbnB1dFwiXSkuc2V0UG9zKG5ldyBWZWN0b3IyKDUwLCAxMDApKTtcblxuXHRcdGNvbnN0IHRlc3RJbnB1dDIgPSBuZXcgSW5wdXQodGhpcy5zdmcsIHRoaXMpO1xuXHRcdHRlc3RJbnB1dDIuZHJhdyhTcHJpdGVMb2FkZXIuc3ByaXRlc1tcImJsb2NrSW5wdXRcIl0pLnNldFBvcyhuZXcgVmVjdG9yMig1MCwgMjAwKSk7XG5cblx0XHRjb25zdCB0ZXN0T3V0cHV0ID0gbmV3IE91dHB1dCh0aGlzLnN2ZywgdGhpcyk7XG5cdFx0dGVzdE91dHB1dC5kcmF3KFNwcml0ZUxvYWRlci5zcHJpdGVzW1wiYmxvY2tPdXRwdXRcIl0pLnNldFBvcyhuZXcgVmVjdG9yMigxMDAwLCAxMDApKTtcblxuXHRcdC8vIEluaXRpYWxpemUgY29ubmVjdGlvbiB3aXJpbmdcblxuXHRcdHRoaXMuc3ZnLm9uKFwibW91c2V1cFwiLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHsgLy8gSWYgbW91c2UgdXAsIHVwZGF0ZSB3aXJlIGdob3N0XG5cdFx0XHRpZih0aGlzLmFjdGl2ZVdpcmVHaG9zdCAhPT0gbnVsbCl7XG5cdFx0XHRcdHRoaXMuYWN0aXZlV2lyZUdob3N0LnN2Zy5yZW1vdmUoKTtcblx0XHRcdFx0dGhpcy5hY3RpdmVXaXJlR2hvc3QuYzAucGFyZW50LnJlc2V0RHJhZ2dhYmxlKCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGNvbnN0IGNvbm5lY3Rpb25JbnN0YW5jZTogc3ZnLkcgPSBnZXRGaXJzdEVsZW1lbnRXaXRoUHJvcGVydHkoZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC54LCBldmVudC55KSwgXCJibG9ja0Nvbm5lY3Rpb25cIiwgXCJibG9ja0Nvbm5lY3Rpb25cIikuaW5zdGFuY2U7XG5cdFx0XHRcdGNvbnN0IHRhcmdldENvbm5lY3Rpb246IENvbm5lY3Rpb24gPSBjb25uZWN0aW9uSW5zdGFuY2UucmVtZW1iZXIoXCJjb25uZWN0aW9uXCIpO1xuXG5cdFx0XHRcdGlmKHRhcmdldENvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdFx0aWYodGFyZ2V0Q29ubmVjdGlvbi50eXBlICE9PSB0aGlzLmFjdGl2ZVdpcmVHaG9zdC5jMC50eXBlICYmIHRhcmdldENvbm5lY3Rpb24ucGFyZW50ICE9PSB0aGlzLmFjdGl2ZVdpcmVHaG9zdC5jMC5wYXJlbnQpe1xuXHRcdFx0XHRcdFx0bGV0IHdpcmVPdXRwdXQ6IENvbm5lY3Rpb247XG5cdFx0XHRcdFx0XHRsZXQgd2lyZUlucHV0OiBDb25uZWN0aW9uO1xuXG5cdFx0XHRcdFx0XHRpZih0YXJnZXRDb25uZWN0aW9uLnR5cGUgPT09IDEpe1xuXHRcdFx0XHRcdFx0XHR3aXJlT3V0cHV0ID0gdGFyZ2V0Q29ubmVjdGlvbjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHdpcmVJbnB1dCA9IHRhcmdldENvbm5lY3Rpb247XG5cdFx0XHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRcdFx0aWYodGhpcy5hY3RpdmVXaXJlR2hvc3QuYzAudHlwZSA9PT0gMSl7XG5cdFx0XHRcdFx0XHRcdHdpcmVPdXRwdXQgPSB0aGlzLmFjdGl2ZVdpcmVHaG9zdC5jMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHdpcmVJbnB1dCA9IHRoaXMuYWN0aXZlV2lyZUdob3N0LmMwO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBuZXdXaXJlID0gbmV3IFdpcmUod2lyZUlucHV0LCB3aXJlT3V0cHV0LCB0aGlzLnN2Zyk7XG5cdFx0XHRcdFx0XHRuZXdXaXJlLmRyYXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmFjdGl2ZVdpcmVHaG9zdCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnN2Zy5vbihcIm1vdXNlbW92ZVwiLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGlmKHRoaXMuYWN0aXZlV2lyZUdob3N0ICE9PSBudWxsKXtcblx0XHRcdFx0dGhpcy5hY3RpdmVXaXJlR2hvc3QudXBkYXRlTGluZSh0aGlzLnN2Zy5wYXRoKCkucG9pbnQoZXZlbnQueCwgZXZlbnQueSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5hY3RpdmVXaXJlR2hvc3QgPSBudWxsO1xuXG5cdFx0Y29uc29sZS5sb2coXCJHYW1lIGluaXRpYWxpemVkIVwiKTtcblxuXHRcdHNldEludGVydmFsKCgpPT57XG5cdFx0XHR0ZXN0SW5wdXQud29yaygpO1xuXHRcdFx0dGVzdElucHV0Mi53b3JrKCk7XG5cdFx0fSwgMTAwMClcblx0fVxuXG5cdHVwZGF0ZSgpe1xuXHRcdHRoaXMuc2NhbUNvaW5Db3VudGVyLmlubmVyVGV4dCA9IHRoaXMuc2NhbUNvaW4udG9TdHJpbmcoKTtcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcml0ZUxvYWRlcntcblx0cHVibGljIHN0YXRpYyBzcHJpdGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyAvLyBBbGwgdGhlIGxvYWRlZCBnYW1lIHNwcml0ZXNcblx0cHVibGljIHN0YXRpYyBzcHJpdGVMaXN0OiBBcnJheTxzdHJpbmc+OyAvLyBBIGxpc3Qgb2YgYWxsIHRoZSBnYW1lIHNwcml0ZXMgdG8gYmUgbG9hZGVkXG5cblx0Y29uc3RydWN0b3IoKXtcblx0XHRTcHJpdGVMb2FkZXIuc3ByaXRlcyA9IHt9O1xuXG5cdFx0U3ByaXRlTG9hZGVyLnNwcml0ZUxpc3QgPSBbXG5cdFx0XHRcImJsb2NrRG91YmxlXCIsXG5cdFx0XHRcImNvbm5lY3Rpb25JbnB1dFwiLFxuXHRcdFx0XCJjb25uZWN0aW9uT3V0cHV0XCIsXG5cdFx0XHRcImJsb2NrSW5wdXRcIixcblx0XHRcdFwiYmxvY2tPdXRwdXRcIixcblx0XHRcdFwiYmxvY2tBZGRpdGlvblwiXHRcdFx0XG5cdFx0XTtcblx0fVxuXG5cdGxvYWRBbGxTcHJpdGVzKCk6IFByb21pc2U8bnVtYmVyW10+e1xuXHRcdGxldCBzcHJpdGU6IHN0cmluZztcblx0XHRsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8bnVtYmVyPj4gPSBbXTtcblxuXHRcdGZvcihzcHJpdGUgb2YgU3ByaXRlTG9hZGVyLnNwcml0ZUxpc3Qpe1xuXHRcdFx0cHJvbWlzZXMucHVzaCh0aGlzLmxvYWRTcHJpdGUoc3ByaXRlKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0fVxuXG5cdGxvYWRTcHJpdGUoc3ByaXRlOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPG51bWJlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Y29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cblx0XHRcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZih0aGlzLnJlYWR5U3RhdGUgPT09IDQpe1xuXHRcdFx0XHRcdGlmKHRoaXMuc3RhdHVzID09PSAyMDApe1xuXHRcdFx0XHRcdFx0U3ByaXRlTG9hZGVyLnNwcml0ZXNbc3ByaXRlXSA9IHRoaXMucmVzcG9uc2VUZXh0O1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgyMDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIlVuYWJsZSB0byBsb2FkIHNwcml0ZSBcIiwgc3ByaXRlLCBcIiEgRXJyb3IgXCIsIHRoaXMuc3RhdHVzKTtcblx0XHRcdFx0XHRcdHJlamVjdCh0aGlzLnN0YXR1cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGBzdmcvJHtzcHJpdGV9LnN2Z2ApO1xuXHRcdFx0cmVxLnNlbmQoKTtcblx0XHR9KTtcblx0fVxufSIsImV4cG9ydCBjb25zdCBnZXRGaXJzdEVsZW1lbnRXaXRoUHJvcGVydHkgPSAoaW5pdGlhbDogRWxlbWVudCwgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IEhUTUxFbGVtZW50ID0+IHtcblx0bGV0IHBhcmVudCA9IGluaXRpYWwucGFyZW50RWxlbWVudDtcblxuXHR3aGlsZShwYXJlbnQuZ2V0QXR0cmlidXRlKHByb3BlcnR5KSAhPT0gdmFsdWUgJiYgcGFyZW50ICE9PSBkb2N1bWVudC5ib2R5KXtcblx0XHRcblx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcblx0fVxuXG5cdHJldHVybiAocGFyZW50ID09PSBkb2N1bWVudC5ib2R5ID8gbnVsbCA6IHBhcmVudCk7XG59XG4iLCJpbXBvcnQgKiBhcyBzdmcgZnJvbSBcIkBzdmdkb3Rqcy9zdmcuanNcIjtcbmltcG9ydCBWZWN0b3IyIGZyb20gXCIuL3ZlY3RvcjJcIjtcblxuZXhwb3J0IGNvbnN0IGdldFNWR1BvcyA9ICh0YXJnZXQ6c3ZnLkVsZW1lbnQsIGNlbnRlcmVkOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCBwYXJlbnRzID0gdGFyZ2V0LnBhcmVudHMoKTtcbiAgICBjb25zdCB0YXJnZXRUcmFuc2Zvcm0gPSB0YXJnZXQudHJhbnNmb3JtKCk7XG5cbiAgICBsZXQgeCA9IHRhcmdldFRyYW5zZm9ybS50cmFuc2xhdGVYO1xuICAgIGxldCB5ID0gdGFyZ2V0VHJhbnNmb3JtLnRyYW5zbGF0ZVk7XG5cbiAgICBmb3IobGV0IHBhcmVudCBvZiBwYXJlbnRzKXtcbiAgICAgICAgaWYocGFyZW50ID09PSB0YXJnZXQucm9vdCgpKSBicmVhaztcblxuICAgICAgICBjb25zdCBwYXJlbnRUcmFuc2Zvcm0gPSBwYXJlbnQudHJhbnNmb3JtKCk7XG4gICAgICAgIHgrPXBhcmVudFRyYW5zZm9ybS50cmFuc2xhdGVYO1xuICAgICAgICB5Kz1wYXJlbnRUcmFuc2Zvcm0udHJhbnNsYXRlWTtcbiAgICB9XG5cbiAgICBpZihjZW50ZXJlZCl7XG4gICAgICAgIHgrPXRhcmdldC53aWR0aCgpIC8gMjtcbiAgICAgICAgeSs9dGFyZ2V0LmhlaWdodCgpIC8gMjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFZlY3RvcjIoeCwgeSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3Iye1xuXHR4OiBudW1iZXI7XG5cdHk6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3Rvcih4OiBudW1iZXIgPSAwLCB5OiBudW1iZXIgPSAwKXtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdH1cbn0iXSwic291cmNlUm9vdCI6IiJ9