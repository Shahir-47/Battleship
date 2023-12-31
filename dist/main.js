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
    if (board[x][y] === undefined) {
      board[x][y] = "miss";
    } else {
      board[x][y].hit();
    }
  }
  return {
    get board() {
      return board;
    },
    placeShip: placeShip,
    receiveAttack: receiveAttack
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
board.placeShip(ship, 0, 0, true);
console.log(board.board);
board.receiveAttack(0, 0);
console.log(ship);
board.receiveAttack(1, 0);
console.log(ship);
board.receiveAttack(2, 0);
console.log(ship);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUs7QUFDVCxJQUFJSyxJQUFJO0FBRVJMLEtBQUssR0FBR0Qsc0RBQVMsQ0FBQyxDQUFDO0FBQ25CTSxJQUFJLEdBQUdTLGlEQUFVLENBQUMsQ0FBQyxDQUFDO0FBRXBCZCxLQUFLLENBQUNJLFNBQVMsQ0FBQ0MsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO0FBQ2pDWSxPQUFPLENBQUNDLEdBQUcsQ0FBQ2xCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0FBQ3hCQSxLQUFLLENBQUNZLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCSyxPQUFPLENBQUNDLEdBQUcsQ0FBQ2IsSUFBSSxDQUFDO0FBQ2pCTCxLQUFLLENBQUNZLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCSyxPQUFPLENBQUNDLEdBQUcsQ0FBQ2IsSUFBSSxDQUFDO0FBQ2pCTCxLQUFLLENBQUNZLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCSyxPQUFPLENBQUNDLEdBQUcsQ0FBQ2IsSUFBSSxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2FtZUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pKTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdGlmICh0eXBlb2YgeSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwieSBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdGlmICh0eXBlb2YgaXNWZXJ0aWNhbCAhPT0gXCJib29sZWFuXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpc1ZlcnRpY2FsIG11c3QgYmUgYSBib29sZWFuXCIpO1xuXHRcdGlmICh4IDwgMCB8fCB4ID4gOSkgdGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAoeSA8IDAgfHwgeSA+IDkpIHRocm93IG5ldyBFcnJvcihcInkgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdFx0aWYgKGlzVmVydGljYWwpIHtcblx0XHRcdGlmICh5ICsgKHNoaXAubGVuZ3RoIC0gMSkgPiA5KSB0aHJvdyBuZXcgRXJyb3IoXCJzaGlwIG11c3QgZml0IG9uIGJvYXJkXCIpO1xuXHRcdFx0aWYgKGJvYXJkW3kgKyBzaGlwLmxlbmd0aCAtIDFdW3hdICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNoaXAgY2Fubm90IG92ZXJsYXAgYW5vdGhlciBzaGlwXCIpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdGlmIChib2FyZFt5ICsgaV1beF0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzaGlwIGNhbm5vdCBvdmVybGFwIGFub3RoZXIgc2hpcFwiKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHRib2FyZFt5ICsgaV1beF0gPSBzaGlwO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoeCArIChzaGlwLmxlbmd0aCAtIDEpID4gOSkgdGhyb3cgbmV3IEVycm9yKFwic2hpcCBtdXN0IGZpdCBvbiBib2FyZFwiKTtcblx0XHRcdGlmIChib2FyZFt5XVt4ICsgc2hpcC5sZW5ndGggLSAxXSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzaGlwIGNhbm5vdCBvdmVybGFwIGFub3RoZXIgc2hpcFwiKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0XHRpZiAoYm9hcmRbeV1beCArIGldICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic2hpcCBjYW5ub3Qgb3ZlcmxhcCBhbm90aGVyIHNoaXBcIik7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0Ym9hcmRbeV1beCArIGldID0gc2hpcDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHRpZiAodHlwZW9mIHggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcInggbXVzdCBiZSBhIG51bWJlclwiKTtcblx0XHRpZiAodHlwZW9mIHkgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcInkgbXVzdCBiZSBhIG51bWJlclwiKTtcblx0XHRpZiAoeCA8IDAgfHwgeCA+IDkpIHRocm93IG5ldyBFcnJvcihcInggbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdFx0aWYgKHkgPCAwIHx8IHkgPiA5KSB0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHRcdGlmIChib2FyZFt4XVt5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRib2FyZFt4XVt5XSA9IFwibWlzc1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRib2FyZFt4XVt5XS5oaXQoKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGdldCBib2FyZCgpIHtcblx0XHRcdHJldHVybiBib2FyZDtcblx0XHR9LFxuXHRcdHBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJmdW5jdGlvbiBjcmVhdGVTaGlwKGxlbmd0aCkge1xuXHRpZiAodHlwZW9mIGxlbmd0aCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYSBudW1iZXJcIik7XG5cdGlmIChsZW5ndGggPCAxKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBncmVhdGVyIHRoYW4gMFwiKTtcblx0aWYgKGxlbmd0aCAlIDEgIT09IDApIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGFuIGludGVnZXJcIik7XG5cdGlmIChsZW5ndGggPiA1KSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBsZXNzIHRoYW4gNlwiKTtcblxuXHRsZXQgbnVtSGl0cyA9IDA7XG5cdGxldCBzdW5rID0gZmFsc2U7XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgbGVuZ3RoKCkge1xuXHRcdFx0cmV0dXJuIGxlbmd0aDtcblx0XHR9LFxuXHRcdGdldCBudW1IaXRzKCkge1xuXHRcdFx0cmV0dXJuIG51bUhpdHM7XG5cdFx0fSxcblx0XHRnZXQgc3VuaygpIHtcblx0XHRcdHJldHVybiBzdW5rO1xuXHRcdH0sXG5cdFx0aGl0KCkge1xuXHRcdFx0bnVtSGl0cyArPSAxO1xuXHRcdFx0aWYgKG51bUhpdHMgPT09IGxlbmd0aCkge1xuXHRcdFx0XHRzdW5rID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5sZXQgYm9hcmQ7XG5sZXQgc2hpcDtcblxuYm9hcmQgPSBnYW1lQm9hcmQoKTtcbnNoaXAgPSBjcmVhdGVTaGlwKDMpO1xuXG5ib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMCwgdHJ1ZSk7XG5jb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG5ib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDApO1xuY29uc29sZS5sb2coc2hpcCk7XG5ib2FyZC5yZWNlaXZlQXR0YWNrKDEsIDApO1xuY29uc29sZS5sb2coc2hpcCk7XG5ib2FyZC5yZWNlaXZlQXR0YWNrKDIsIDApO1xuY29uc29sZS5sb2coc2hpcCk7XG4iXSwibmFtZXMiOlsiZ2FtZUJvYXJkIiwiYm9hcmQiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJwbGFjZVNoaXAiLCJzaGlwIiwieCIsInkiLCJpc1ZlcnRpY2FsIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJpIiwicmVjZWl2ZUF0dGFjayIsImhpdCIsImNyZWF0ZVNoaXAiLCJudW1IaXRzIiwic3VuayIsImNvbnNvbGUiLCJsb2ciXSwic291cmNlUm9vdCI6IiJ9