/*!
* global/window.js
* https://github.com/RobinHerbots/Inputmask
* Copyright (c) 2010 - 2018 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 4.0.3-beta.5
*/

if (typeof define === "function" && define.amd) define(function() {
    return window || new (eval("require('jsdom')")("").window)();
}); else if (typeof exports === "object") module.exports = window || new (eval("require('jsdom')")("").window)();