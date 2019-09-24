!function(r,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.emporium=t():r.emporium=t()}(window,(function(){return function(r){var t={};function e(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return r[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=r,e.c=t,e.d=function(r,t,n){e.o(r,t)||Object.defineProperty(r,t,{enumerable:!0,get:n})},e.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},e.t=function(r,t){if(1&t&&(r=e(r)),8&t)return r;if(4&t&&"object"==typeof r&&r&&r.__esModule)return r;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:r}),2&t&&"string"!=typeof r)for(var o in r)e.d(n,o,function(t){return r[t]}.bind(null,o));return n},e.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(t,"a",t),t},e.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},e.p="",e(e.s=0)}([function(r,t,e){"use strict";e.r(t);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var n=function(r,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,t){r.__proto__=t}||function(r,t){for(var e in t)t.hasOwnProperty(e)&&(r[e]=t[e])})(r,t)};function o(r,t){function e(){this.constructor=r}n(r,t),r.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}function i(r){return"function"==typeof r}var s=!1,u={Promise:void 0,set useDeprecatedSynchronousErrorHandling(r){r&&(new Error).stack;s=r},get useDeprecatedSynchronousErrorHandling(){return s}};function c(r){setTimeout((function(){throw r}),0)}var a={closed:!0,next:function(r){},error:function(r){if(u.useDeprecatedSynchronousErrorHandling)throw r;c(r)},complete:function(){}},h=function(){return Array.isArray||function(r){return r&&"number"==typeof r.length}}();var p=function(){function r(r){return Error.call(this),this.message=r?r.length+" errors occurred during unsubscription:\n"+r.map((function(r,t){return t+1+") "+r.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=r,this}return r.prototype=Object.create(Error.prototype),r}(),f=function(){function r(r){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,r&&(this._unsubscribe=r)}return r.prototype.unsubscribe=function(){var t;if(!this.closed){var e,n=this._parentOrParents,o=this._unsubscribe,s=this._subscriptions;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,n instanceof r)n.remove(this);else if(null!==n)for(var u=0;u<n.length;++u){n[u].remove(this)}if(i(o))try{o.call(this)}catch(r){t=r instanceof p?l(r.errors):[r]}if(h(s)){u=-1;for(var c=s.length;++u<c;){var a=s[u];if(null!==(e=a)&&"object"==typeof e)try{a.unsubscribe()}catch(r){t=t||[],r instanceof p?t=t.concat(l(r.errors)):t.push(r)}}}if(t)throw new p(t)}},r.prototype.add=function(t){var e=t;if(!t)return r.EMPTY;switch(typeof t){case"function":e=new r(t);case"object":if(e===this||e.closed||"function"!=typeof e.unsubscribe)return e;if(this.closed)return e.unsubscribe(),e;if(!(e instanceof r)){var n=e;(e=new r)._subscriptions=[n]}break;default:throw new Error("unrecognized teardown "+t+" added to Subscription.")}var o=e._parentOrParents;if(null===o)e._parentOrParents=this;else if(o instanceof r){if(o===this)return e;e._parentOrParents=[o,this]}else{if(-1!==o.indexOf(this))return e;o.push(this)}var i=this._subscriptions;return null===i?this._subscriptions=[e]:i.push(e),e},r.prototype.remove=function(r){var t=this._subscriptions;if(t){var e=t.indexOf(r);-1!==e&&t.splice(e,1)}},r.EMPTY=function(r){return r.closed=!0,r}(new r),r}();function l(r){return r.reduce((function(r,t){return r.concat(t instanceof p?t.errors:t)}),[])}var b=function(){return"function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random()}(),y=function(r){function t(e,n,o){var i=r.call(this)||this;switch(i.syncErrorValue=null,i.syncErrorThrown=!1,i.syncErrorThrowable=!1,i.isStopped=!1,arguments.length){case 0:i.destination=a;break;case 1:if(!e){i.destination=a;break}if("object"==typeof e){e instanceof t?(i.syncErrorThrowable=e.syncErrorThrowable,i.destination=e,e.add(i)):(i.syncErrorThrowable=!0,i.destination=new d(i,e));break}default:i.syncErrorThrowable=!0,i.destination=new d(i,e,n,o)}return i}return o(t,r),t.prototype[b]=function(){return this},t.create=function(r,e,n){var o=new t(r,e,n);return o.syncErrorThrowable=!1,o},t.prototype.next=function(r){this.isStopped||this._next(r)},t.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},t.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,r.prototype.unsubscribe.call(this))},t.prototype._next=function(r){this.destination.next(r)},t.prototype._error=function(r){this.destination.error(r),this.unsubscribe()},t.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},t.prototype._unsubscribeAndRecycle=function(){var r=this._parentOrParents;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=r,this},t}(f),d=function(r){function t(t,e,n,o){var s,u=r.call(this)||this;u._parentSubscriber=t;var c=u;return i(e)?s=e:e&&(s=e.next,n=e.error,o=e.complete,e!==a&&(i((c=Object.create(e)).unsubscribe)&&u.add(c.unsubscribe.bind(c)),c.unsubscribe=u.unsubscribe.bind(u))),u._context=c,u._next=s,u._error=n,u._complete=o,u}return o(t,r),t.prototype.next=function(r){if(!this.isStopped&&this._next){var t=this._parentSubscriber;u.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?this.__tryOrSetError(t,this._next,r)&&this.unsubscribe():this.__tryOrUnsub(this._next,r)}},t.prototype.error=function(r){if(!this.isStopped){var t=this._parentSubscriber,e=u.useDeprecatedSynchronousErrorHandling;if(this._error)e&&t.syncErrorThrowable?(this.__tryOrSetError(t,this._error,r),this.unsubscribe()):(this.__tryOrUnsub(this._error,r),this.unsubscribe());else if(t.syncErrorThrowable)e?(t.syncErrorValue=r,t.syncErrorThrown=!0):c(r),this.unsubscribe();else{if(this.unsubscribe(),e)throw r;c(r)}}},t.prototype.complete=function(){var r=this;if(!this.isStopped){var t=this._parentSubscriber;if(this._complete){var e=function(){return r._complete.call(r._context)};u.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?(this.__tryOrSetError(t,e),this.unsubscribe()):(this.__tryOrUnsub(e),this.unsubscribe())}else this.unsubscribe()}},t.prototype.__tryOrUnsub=function(r,t){try{r.call(this._context,t)}catch(r){if(this.unsubscribe(),u.useDeprecatedSynchronousErrorHandling)throw r;c(r)}},t.prototype.__tryOrSetError=function(r,t,e){if(!u.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{t.call(this._context,e)}catch(t){return u.useDeprecatedSynchronousErrorHandling?(r.syncErrorValue=t,r.syncErrorThrown=!0,!0):(c(t),!0)}return!1},t.prototype._unsubscribe=function(){var r=this._parentSubscriber;this._context=null,this._parentSubscriber=null,r.unsubscribe()},t}(y);var _=function(){return"function"==typeof Symbol&&Symbol.observable||"@@observable"}();function v(){}function w(r){return r?1===r.length?r[0]:function(t){return r.reduce((function(r,t){return t(r)}),t)}:v}var E=function(){function r(r){this._isScalar=!1,r&&(this._subscribe=r)}return r.prototype.lift=function(t){var e=new r;return e.source=this,e.operator=t,e},r.prototype.subscribe=function(r,t,e){var n=this.operator,o=function(r,t,e){if(r){if(r instanceof y)return r;if(r[b])return r[b]()}return r||t||e?new y(r,t,e):new y(a)}(r,t,e);if(n?o.add(n.call(o,this.source)):o.add(this.source||u.useDeprecatedSynchronousErrorHandling&&!o.syncErrorThrowable?this._subscribe(o):this._trySubscribe(o)),u.useDeprecatedSynchronousErrorHandling&&o.syncErrorThrowable&&(o.syncErrorThrowable=!1,o.syncErrorThrown))throw o.syncErrorValue;return o},r.prototype._trySubscribe=function(r){try{return this._subscribe(r)}catch(t){u.useDeprecatedSynchronousErrorHandling&&(r.syncErrorThrown=!0,r.syncErrorValue=t),!function(r){for(;r;){var t=r,e=t.closed,n=t.destination,o=t.isStopped;if(e||o)return!1;r=n&&n instanceof y?n:null}return!0}(r)?console.warn(t):r.error(t)}},r.prototype.forEach=function(r,t){var e=this;return new(t=S(t))((function(t,n){var o;o=e.subscribe((function(t){try{r(t)}catch(r){n(r),o&&o.unsubscribe()}}),n,t)}))},r.prototype._subscribe=function(r){var t=this.source;return t&&t.subscribe(r)},r.prototype[_]=function(){return this},r.prototype.pipe=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return 0===r.length?this:w(r)(this)},r.prototype.toPromise=function(r){var t=this;return new(r=S(r))((function(r,e){var n;t.subscribe((function(r){return n=r}),(function(r){return e(r)}),(function(){return r(n)}))}))},r.create=function(t){return new r(t)},r}();function S(r){if(r||(r=u.Promise||Promise),!r)throw new Error("no Promise impl found");return r}var m=function(){function r(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}return r.prototype=Object.create(Error.prototype),r}(),g=function(r){function t(t,e){var n=r.call(this)||this;return n.subject=t,n.subscriber=e,n.closed=!1,n}return o(t,r),t.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var r=this.subject,t=r.observers;if(this.subject=null,t&&0!==t.length&&!r.isStopped&&!r.closed){var e=t.indexOf(this.subscriber);-1!==e&&t.splice(e,1)}}},t}(f),x=function(r){function t(t){var e=r.call(this,t)||this;return e.destination=t,e}return o(t,r),t}(y),O=function(r){function t(){var t=r.call(this)||this;return t.observers=[],t.closed=!1,t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return o(t,r),t.prototype[b]=function(){return new x(this)},t.prototype.lift=function(r){var t=new P(this,this);return t.operator=r,t},t.prototype.next=function(r){if(this.closed)throw new m;if(!this.isStopped)for(var t=this.observers,e=t.length,n=t.slice(),o=0;o<e;o++)n[o].next(r)},t.prototype.error=function(r){if(this.closed)throw new m;this.hasError=!0,this.thrownError=r,this.isStopped=!0;for(var t=this.observers,e=t.length,n=t.slice(),o=0;o<e;o++)n[o].error(r);this.observers.length=0},t.prototype.complete=function(){if(this.closed)throw new m;this.isStopped=!0;for(var r=this.observers,t=r.length,e=r.slice(),n=0;n<t;n++)e[n].complete();this.observers.length=0},t.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},t.prototype._trySubscribe=function(t){if(this.closed)throw new m;return r.prototype._trySubscribe.call(this,t)},t.prototype._subscribe=function(r){if(this.closed)throw new m;return this.hasError?(r.error(this.thrownError),f.EMPTY):this.isStopped?(r.complete(),f.EMPTY):(this.observers.push(r),new g(this,r))},t.prototype.asObservable=function(){var r=new E;return r.source=this,r},t.create=function(r,t){return new P(r,t)},t}(E),P=function(r){function t(t,e){var n=r.call(this)||this;return n.destination=t,n.source=e,n}return o(t,r),t.prototype.next=function(r){var t=this.destination;t&&t.next&&t.next(r)},t.prototype.error=function(r){var t=this.destination;t&&t.error&&this.destination.error(r)},t.prototype.complete=function(){var r=this.destination;r&&r.complete&&this.destination.complete()},t.prototype._subscribe=function(r){return this.source?this.source.subscribe(r):f.EMPTY},t}(O),j=function(r){function t(t){var e=r.call(this)||this;return e._value=t,e}return o(t,r),Object.defineProperty(t.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),t.prototype._subscribe=function(t){var e=r.prototype._subscribe.call(this,t);return e&&!e.closed&&t.next(this._value),e},t.prototype.getValue=function(){if(this.hasError)throw this.thrownError;if(this.closed)throw new m;return this._value},t.prototype.next=function(t){r.prototype.next.call(this,this._value=t)},t}(O);function T(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}var D=function(){function r(){var t,e,n;return function(r,t){if(!(r instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),t=this,e="count",n=new j(0),e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,r.instance?r.instance:(r.instance=this,this)}var t,e,n;return t=r,(e=[{key:"add",value:function(){var r=this.count.getValue();r++,this.count.next(r)}}])&&T(t.prototype,e),n&&T(t,n),r}();console.log(new D==new D),window.emporium=new D;t.default=new D}])}));