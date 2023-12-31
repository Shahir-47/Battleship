/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameBoard.js":
/*!**************************!*\
  !*** ./src/gameBoard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function gameBoard() {
  var board = Array.from({
    length: 10
  }, function () {
    return Array.from({
      length: 10
    });
  });
  function placeShip(ship, x, y, isVertical) {
    if (typeof x !== "number") throw new Error("x must be a number");
    if (typeof y !== "number") throw new Error("y must be a number");
    if (typeof isVertical !== "boolean") throw new Error("isVertical must be a boolean");
    if (x < 0 || x > 9) throw new Error("x must be between 0 and 9");
    if (y < 0 || y > 9) throw new Error("y must be between 0 and 9");
    if (isVertical) {
      if (y + (ship.length - 1) > 9) throw new Error("ship must fit on board");
      if (board[y + ship.length - 1][x] !== undefined) throw new Error("ship cannot overlap another ship");
      for (var i = 0; i < ship.length; i += 1) {
        if (board[y + i][x] !== undefined) throw new Error("ship cannot overlap another ship");
      }
      for (var _i = 0; _i < ship.length; _i += 1) {
        board[y + _i][x] = ship;
      }
    } else {
      if (x + (ship.length - 1) > 9) throw new Error("ship must fit on board");
      if (board[y][x + ship.length - 1] !== undefined) throw new Error("ship cannot overlap another ship");
      for (var _i2 = 0; _i2 < ship.length; _i2 += 1) {
        if (board[y][x + _i2] !== undefined) throw new Error("ship cannot overlap another ship");
      }
      for (var _i3 = 0; _i3 < ship.length; _i3 += 1) {
        board[y][x + _i3] = ship;
      }
    }
  }
  function receiveAttack(x, y) {
    if (typeof x !== "number") throw new Error("x must be a number");
    if (typeof y !== "number") throw new Error("y must be a number");
    if (x < 0 || x > 9) throw new Error("x must be between 0 and 9");
    if (y < 0 || y > 9) throw new Error("y must be between 0 and 9");
    if (board[y][x] === undefined) {
      board[y][x] = "miss";
    } else {
      board[y][x].hit();
    }
  }
  function allShipsSunk() {
    return board.every(function (row) {
      return row.every(function (cell) {
        return cell === undefined || cell === "miss" || _typeof(cell) === "object" && cell.sunk;
      });
    });
  }
  return {
    get board() {
      return board;
    },
    placeShip: placeShip,
    receiveAttack: receiveAttack,
    allShipsSunk: allShipsSunk
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameBoard);

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createShip(length) {
  if (typeof length !== "number") throw new Error("length must be a number");
  if (length < 1) throw new Error("length must be greater than 0");
  if (length % 1 !== 0) throw new Error("length must be an integer");
  if (length > 5) throw new Error("length must be less than 6");
  var numHits = 0;
  var sunk = false;
  return {
    get length() {
      return length;
    },
    get numHits() {
      return numHits;
    },
    get sunk() {
      return sunk;
    },
    hit: function hit() {
      numHits += 1;
      if (numHits === length) {
        sunk = true;
      }
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createShip);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


var board;
var ship;
board = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])();
ship = (0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
console.log(board.board);
// board.placeShip(ship, 0, 3, false);
console.log("vertical");
board.placeShip(ship, 0, 0, true);
board.receiveAttack(0, 1);
board.receiveAttack(0, 2);
board.receiveAttack(0, 3);
console.log(board.board);

// board.placeShip(ship, 0, 0, false);
// console.log(board.board);
// board.receiveAttack(0, 0);
// console.log(ship);
// board.receiveAttack(1, 0);
// console.log(ship);
// board.receiveAttack(2, 0);
// console.log(ship);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFVOzs7Ozs7VUM1QnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ0o7QUFFaEMsSUFBSXBCLEtBQUs7QUFDVCxJQUFJSyxJQUFJO0FBRVJMLEtBQUssR0FBR0Qsc0RBQVMsQ0FBQyxDQUFDO0FBQ25CTSxJQUFJLEdBQUdlLGlEQUFVLENBQUMsQ0FBQyxDQUFDO0FBRXBCRSxPQUFPLENBQUNDLEdBQUcsQ0FBQ3ZCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0FBQ3hCO0FBQ0FzQixPQUFPLENBQUNDLEdBQUcsV0FBVyxDQUFDO0FBQ3ZCdkIsS0FBSyxDQUFDSSxTQUFTLENBQUNDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUNqQ0wsS0FBSyxDQUFDWSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QlosS0FBSyxDQUFDWSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QlosS0FBSyxDQUFDWSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QlUsT0FBTyxDQUFDQyxHQUFHLENBQUN2QixLQUFLLENBQUNBLEtBQUssQ0FBQzs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnYW1lQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSkpO1xuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJ4IG11c3QgYmUgYSBudW1iZXJcIik7XG5cdFx0aWYgKHR5cGVvZiB5ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYSBudW1iZXJcIik7XG5cdFx0aWYgKHR5cGVvZiBpc1ZlcnRpY2FsICE9PSBcImJvb2xlYW5cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImlzVmVydGljYWwgbXVzdCBiZSBhIGJvb2xlYW5cIik7XG5cdFx0aWYgKHggPCAwIHx8IHggPiA5KSB0aHJvdyBuZXcgRXJyb3IoXCJ4IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHRcdGlmICh5IDwgMCB8fCB5ID4gOSkgdGhyb3cgbmV3IEVycm9yKFwieSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAoaXNWZXJ0aWNhbCkge1xuXHRcdFx0aWYgKHkgKyAoc2hpcC5sZW5ndGggLSAxKSA+IDkpIHRocm93IG5ldyBFcnJvcihcInNoaXAgbXVzdCBmaXQgb24gYm9hcmRcIik7XG5cdFx0XHRpZiAoYm9hcmRbeSArIHNoaXAubGVuZ3RoIC0gMV1beF0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic2hpcCBjYW5ub3Qgb3ZlcmxhcCBhbm90aGVyIHNoaXBcIik7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0aWYgKGJvYXJkW3kgKyBpXVt4XSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNoaXAgY2Fubm90IG92ZXJsYXAgYW5vdGhlciBzaGlwXCIpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdGJvYXJkW3kgKyBpXVt4XSA9IHNoaXA7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh4ICsgKHNoaXAubGVuZ3RoIC0gMSkgPiA5KSB0aHJvdyBuZXcgRXJyb3IoXCJzaGlwIG11c3QgZml0IG9uIGJvYXJkXCIpO1xuXHRcdFx0aWYgKGJvYXJkW3ldW3ggKyBzaGlwLmxlbmd0aCAtIDFdICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNoaXAgY2Fubm90IG92ZXJsYXAgYW5vdGhlciBzaGlwXCIpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdGlmIChib2FyZFt5XVt4ICsgaV0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzaGlwIGNhbm5vdCBvdmVybGFwIGFub3RoZXIgc2hpcFwiKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHRib2FyZFt5XVt4ICsgaV0gPSBzaGlwO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdGlmICh0eXBlb2YgeSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwieSBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdGlmICh4IDwgMCB8fCB4ID4gOSkgdGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAoeSA8IDAgfHwgeSA+IDkpIHRocm93IG5ldyBFcnJvcihcInkgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdFx0aWYgKGJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJvYXJkW3ldW3hdID0gXCJtaXNzXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvYXJkW3ldW3hdLmhpdCgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFsbFNoaXBzU3VuaygpIHtcblx0XHRyZXR1cm4gYm9hcmQuZXZlcnkoKHJvdykgPT5cblx0XHRcdHJvdy5ldmVyeShcblx0XHRcdFx0KGNlbGwpID0+XG5cdFx0XHRcdFx0Y2VsbCA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0Y2VsbCA9PT0gXCJtaXNzXCIgfHxcblx0XHRcdFx0XHQodHlwZW9mIGNlbGwgPT09IFwib2JqZWN0XCIgJiYgY2VsbC5zdW5rKSxcblx0XHRcdCksXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Z2V0IGJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGJvYXJkO1xuXHRcdH0sXG5cdFx0cGxhY2VTaGlwLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0YWxsU2hpcHNTdW5rLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJmdW5jdGlvbiBjcmVhdGVTaGlwKGxlbmd0aCkge1xuXHRpZiAodHlwZW9mIGxlbmd0aCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYSBudW1iZXJcIik7XG5cdGlmIChsZW5ndGggPCAxKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBncmVhdGVyIHRoYW4gMFwiKTtcblx0aWYgKGxlbmd0aCAlIDEgIT09IDApIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGFuIGludGVnZXJcIik7XG5cdGlmIChsZW5ndGggPiA1KSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBsZXNzIHRoYW4gNlwiKTtcblxuXHRsZXQgbnVtSGl0cyA9IDA7XG5cdGxldCBzdW5rID0gZmFsc2U7XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgbGVuZ3RoKCkge1xuXHRcdFx0cmV0dXJuIGxlbmd0aDtcblx0XHR9LFxuXHRcdGdldCBudW1IaXRzKCkge1xuXHRcdFx0cmV0dXJuIG51bUhpdHM7XG5cdFx0fSxcblx0XHRnZXQgc3VuaygpIHtcblx0XHRcdHJldHVybiBzdW5rO1xuXHRcdH0sXG5cdFx0aGl0KCkge1xuXHRcdFx0bnVtSGl0cyArPSAxO1xuXHRcdFx0aWYgKG51bUhpdHMgPT09IGxlbmd0aCkge1xuXHRcdFx0XHRzdW5rID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5sZXQgYm9hcmQ7XG5sZXQgc2hpcDtcblxuYm9hcmQgPSBnYW1lQm9hcmQoKTtcbnNoaXAgPSBjcmVhdGVTaGlwKDMpO1xuXG5jb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG4vLyBib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMywgZmFsc2UpO1xuY29uc29sZS5sb2coYHZlcnRpY2FsYCk7XG5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMCwgdHJ1ZSk7XG5ib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDEpO1xuYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAyKTtcbmJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMyk7XG5jb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG5cbi8vIGJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAwLCBmYWxzZSk7XG4vLyBjb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDApO1xuLy8gY29uc29sZS5sb2coc2hpcCk7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDEsIDApO1xuLy8gY29uc29sZS5sb2coc2hpcCk7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDIsIDApO1xuLy8gY29uc29sZS5sb2coc2hpcCk7XG4iXSwibmFtZXMiOlsiZ2FtZUJvYXJkIiwiYm9hcmQiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJwbGFjZVNoaXAiLCJzaGlwIiwieCIsInkiLCJpc1ZlcnRpY2FsIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJpIiwicmVjZWl2ZUF0dGFjayIsImhpdCIsImFsbFNoaXBzU3VuayIsImV2ZXJ5Iiwicm93IiwiY2VsbCIsIl90eXBlb2YiLCJzdW5rIiwiY3JlYXRlU2hpcCIsIm51bUhpdHMiLCJjb25zb2xlIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==