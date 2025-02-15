/*
 * fitty v2.2.1 - Snugly resizes text to fit its parent container
 * Copyright (c) 2017 Rik Schennink <hello@rikschennink.nl> (http://rikschennink.nl/)
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// node list to array helper method
var toArray = function toArray(nl) {
  return [].slice.call(nl);
};

// window shortcut
var w = window;

// states
var DrawState = {
  IDLE: 0,
  DIRTY_CONTENT: 1,
  DIRTY_LAYOUT: 2,
  DIRTY: 3
};

// all active fitty elements
var fitties = [];

// group all redraw calls till next frame, we cancel each frame request when a new one comes in. If no support for request animation frame, this is an empty function and supports for fitty stops.
var redrawFrame = null;
var requestRedraw = 'requestAnimationFrame' in w ? function () {
  w.cancelAnimationFrame(redrawFrame);
  redrawFrame = w.requestAnimationFrame(function () {
    redraw(fitties.filter(function (f) {
      return f.dirty;
    }));
  });
} : function () {};

// sets all fitties to dirty so they are redrawn on the next redraw loop, then calls redraw
var redrawAll = function redrawAll(type) {
  return function () {
    fitties.forEach(function (f) {
      f.dirty = type;
    });
    requestRedraw();
  };
};

// redraws fitties so they nicely fit their parent container
var redraw = function redraw(fitties) {

  // getting info from the DOM should not trigger a reflow, let's gather as much intel as possible before triggering a reflow

  // check if styles of all fitties have been computed
  fitties.filter(function (f) {
    return !f.styleComputed;
  }).forEach(function (f) {
    f.styleComputed = computeStyle(f);
  });

  // restyle elements that require pre-styling, this triggers a reflow, please try to prevent by adding CSS rules (see docs)
  fitties.filter(shouldPreStyle).forEach(applyStyle);

  // we now determine which fitties should be redrawn, and if so, we calculate final styles for these fitties
  fitties.filter(shouldRedraw).forEach(calculateStyles);

  // now we apply the calculated styles from our previous loop
  fitties.forEach(applyStyles);

  // now we dispatch events for all restyled fitties
  fitties.forEach(dispatchFitEvent);
};

var calculateStyles = function calculateStyles(f) {

  // get available width from parent node
  f.availableWidth = f.element.parentNode.clientWidth;

  // the space our target element uses
  f.currentWidth = f.element.scrollWidth;

  // remember current font size
  f.previousFontSize = f.currentFontSize;

  // let's calculate the new font size
  f.currentFontSize = Math.min(Math.max(f.minSize, f.availableWidth / f.currentWidth * f.previousFontSize), f.maxSize);

  // if allows wrapping, only wrap when at minimum font size (otherwise would break container)
  f.whiteSpace = f.multiLine && f.currentFontSize === f.minSize ? 'normal' : 'nowrap';
};

// should always redraw if is not dirty layout, if is dirty layout, only redraw if size has changed
var shouldRedraw = function shouldRedraw(f) {
  return f.dirty !== DrawState.DIRTY_LAYOUT || f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth;
};

// every fitty element is tested for invalid styles
var computeStyle = function computeStyle(f) {

  // get style properties
  var style = w.getComputedStyle(f.element, null);

  // get current font size in pixels (if we already calculated it, use the calculated version)
  f.currentFontSize = parseInt(style.getPropertyValue('font-size'), 10);

  // get display type and wrap mode
  f.display = style.getPropertyValue('display');
  f.whiteSpace = style.getPropertyValue('white-space');
};

// determines if this fitty requires initial styling, can be prevented by applying correct styles through CSS
var shouldPreStyle = function shouldPreStyle(f) {

  var preStyle = false;

  // should have an inline style, if not, apply
  if (!/inline-/.test(f.display)) {
    preStyle = true;
    f.display = 'inline-block';
  }

  // to correctly calculate dimensions the element should have whiteSpace set to nowrap
  if (f.whiteSpace !== 'nowrap') {
    preStyle = true;
    f.whiteSpace = 'nowrap';
  }

  return preStyle;
};

// apply styles to array of fitties and automatically mark as non dirty
var applyStyles = function applyStyles(f) {
  applyStyle(f);
  f.dirty = DrawState.IDLE;
};

// apply styles to single fitty
var applyStyle = function applyStyle(f) {
  f.element.style.cssText = 'white-space:' + f.whiteSpace + ';display:' + f.display + ';font-size:' + f.currentFontSize + 'px';
};

// dispatch a fit event on a fitty
var dispatchFitEvent = function dispatchFitEvent(f) {
  f.element.dispatchEvent(new CustomEvent('fit', {
    detail: {
      oldValue: f.previousFontSize,
      newValue: f.currentFontSize,
      scaleFactor: f.currentFontSize / f.previousFontSize
    }
  }));
};

// fit method, marks the fitty as dirty and requests a redraw (this will also redraw any other fitty marked as dirty)
var fit = function fit(f, type) {
  return function () {
    f.dirty = type;
    requestRedraw();
  };
};

// add a new fitty, does not redraw said fitty
var subscribe = function subscribe(f) {

  // this is a new fitty so we need to validate if it's styles are in order
  f.newbie = true;

  // because it's a new fitty it should also be dirty, we want it to redraw on the first loop
  f.dirty = true;

  // we want to be able to update this fitty
  fitties.push(f);
};

// remove an existing fitty
var unsubscribe = function unsubscribe(f) {
  return function () {

    // remove from fitties array
    fitties = fitties.filter(function (_) {
      return _.element !== f.element;
    });

    // stop observing DOM
    if (f.observeMutations) {
      f.observer.disconnect();
    }

    // reset font size to inherited size
    f.element.style.removeProperty('font-size');
  };
};

var observeMutations = function observeMutations(f) {

  // no observing?
  if (!f.observeMutations) {
    return;
  }

  // start observing mutations
  f.observer = new MutationObserver(fit(f, DrawState.DIRTY_CONTENT));

  // start observing
  f.observer.observe(f.element, f.observeMutations);
};

// default mutation observer settings
var mutationObserverDefaultSetting = {
  subtree: true,
  childList: true,
  characterData: true
};

// default fitty options
var defaultOptions = {
  minSize: 16,
  maxSize: 512,
  multiLine: true,
  observeMutations: 'MutationObserver' in w ? mutationObserverDefaultSetting : false
};

// array of elements in, fitty instances out
function fittyCreate(elements, options) {

  // set options object
  var fittyOptions = _extends({}, defaultOptions, options);

  // create fitties
  var publicFitties = elements.map(function (element) {

    // create fitty instance
    var f = _extends({}, fittyOptions, {

      // internal options for this fitty
      element: element
    });

    // register this fitty
    subscribe(f);

    // should we observe DOM mutations
    observeMutations(f);

    // expose API
    return {
      element: element,
      fit: fit(f, DrawState.DIRTY),
      unsubscribe: unsubscribe(f)
    };
  });

  // call redraw on newly initiated fitties
  requestRedraw();

  // expose fitties
  return publicFitties;
}

// fitty creation function
function fitty(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  // if target is a string
  return typeof target === 'string' ?

  // treat it as a querySelector
  fittyCreate(toArray(document.querySelectorAll(target)), options) :

  // create single fitty
  fittyCreate([target], options)[0];
}

// handles viewport changes, redraws all fitties, but only does so after a timeout
var resizeDebounce = null;
var onWindowResized = function onWindowResized() {
  w.clearTimeout(resizeDebounce);
  resizeDebounce = w.setTimeout(redrawAll(DrawState.DIRTY_LAYOUT), fitty.observeWindowDelay);
};

// define observe window property, so when we set it to true or false events are automatically added and removed
var events = ['resize', 'orientationchange'];
Object.defineProperty(fitty, 'observeWindow', {
  set: function set(enabled) {
    var method = (enabled ? 'add' : 'remove') + 'EventListener';
    events.forEach(function (e) {
      w[method](e, onWindowResized);
    });
  }
});

// fitty global properties (by setting observeWindow to true the events above get added)
fitty.observeWindow = true;
fitty.observeWindowDelay = 100;

// public fit all method, will force redraw no matter what
fitty.fitAll = redrawAll(DrawState.DIRTY);

// export our fitty function, we don't want to keep it to our selves
exports.default = fitty;