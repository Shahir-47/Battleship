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
  function validateCoordinates(x, y) {
    if (typeof x !== "number" || x < 0 || x > 9) throw new Error("x must be between 0 and 9");
    if (typeof y !== "number" || y < 0 || y > 9) throw new Error("y must be between 0 and 9");
  }
  function canPlaceShip(ship, x, y, isVertical) {
    validateCoordinates(x, y);
    if (typeof isVertical !== "boolean") throw new Error("isVertical must be a boolean");
    var length = ship.length - 1;
    var maxX = isVertical ? x : x + length;
    var maxY = isVertical ? y + length : y;
    if (maxX > 9 || maxY > 9) return false;
    for (var i = 0; i <= length; i += 1) {
      var checkX = isVertical ? x : x + i;
      var checkY = isVertical ? y + i : y;
      if (board[checkY][checkX] !== undefined) return false;
    }
    return true;
  }
  function placeShip(ship, x, y, isVertical) {
    if (!canPlaceShip(ship, x, y, isVertical)) {
      throw new Error("Cannot place ship here");
    }
    for (var i = 0; i < ship.length; i += 1) {
      var placeX = isVertical ? x : x + i;
      var placeY = isVertical ? y + i : y;
      board[placeY][placeX] = ship;
    }
  }
  function receiveAttack(x, y) {
    validateCoordinates(x, y);
    if (board[y][x] === undefined) {
      board[y][x] = "miss";
      return "miss";
    }
    board[y][x].hit();
    if (board[y][x].sunk) return "sunk";
    return "hit";
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
    canPlaceShip: canPlaceShip,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TyxDQUFDQyxHQUFHLENBQUMvQixLQUFLLENBQUNBLEtBQUssQ0FBQztBQUN4QjtBQUNBOEIsT0FBTyxDQUFDQyxHQUFHLFdBQVcsQ0FBQztBQUN2Qi9CLEtBQUssQ0FBQ2lCLFNBQVMsQ0FBQ1IsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO0FBQ2pDVCxLQUFLLENBQUNvQixhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QnBCLEtBQUssQ0FBQ29CLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCcEIsS0FBSyxDQUFDb0IsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekJVLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDL0IsS0FBSyxDQUFDQSxLQUFLLENBQUM7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2FtZUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pKTtcblxuXHRmdW5jdGlvbiB2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpIHtcblx0XHRpZiAodHlwZW9mIHggIT09IFwibnVtYmVyXCIgfHwgeCA8IDAgfHwgeCA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ4IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHRcdGlmICh0eXBlb2YgeSAhPT0gXCJudW1iZXJcIiB8fCB5IDwgMCB8fCB5ID4gOSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInkgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7XG5cdFx0aWYgKHR5cGVvZiBpc1ZlcnRpY2FsICE9PSBcImJvb2xlYW5cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImlzVmVydGljYWwgbXVzdCBiZSBhIGJvb2xlYW5cIik7XG5cdFx0Y29uc3QgbGVuZ3RoID0gc2hpcC5sZW5ndGggLSAxO1xuXHRcdGNvbnN0IG1heFggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBsZW5ndGg7XG5cdFx0Y29uc3QgbWF4WSA9IGlzVmVydGljYWwgPyB5ICsgbGVuZ3RoIDogeTtcblxuXHRcdGlmIChtYXhYID4gOSB8fCBtYXhZID4gOSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IGNoZWNrWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBjaGVja1kgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0aWYgKGJvYXJkW2NoZWNrWV1bY2hlY2tYXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdGlmICghY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcGxhY2Ugc2hpcCBoZXJlXCIpO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgcGxhY2VYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgaTtcblx0XHRcdGNvbnN0IHBsYWNlWSA9IGlzVmVydGljYWwgPyB5ICsgaSA6IHk7XG5cdFx0XHRib2FyZFtwbGFjZVldW3BsYWNlWF0gPSBzaGlwO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7XG5cdFx0aWYgKGJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJvYXJkW3ldW3hdID0gXCJtaXNzXCI7XG5cdFx0XHRyZXR1cm4gXCJtaXNzXCI7XG5cdFx0fVxuXHRcdGJvYXJkW3ldW3hdLmhpdCgpO1xuXHRcdGlmIChib2FyZFt5XVt4XS5zdW5rKSByZXR1cm4gXCJzdW5rXCI7XG5cdFx0cmV0dXJuIFwiaGl0XCI7XG5cdH1cblxuXHRmdW5jdGlvbiBhbGxTaGlwc1N1bmsoKSB7XG5cdFx0cmV0dXJuIGJvYXJkLmV2ZXJ5KChyb3cpID0+XG5cdFx0XHRyb3cuZXZlcnkoXG5cdFx0XHRcdChjZWxsKSA9PlxuXHRcdFx0XHRcdGNlbGwgPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHRcdGNlbGwgPT09IFwibWlzc1wiIHx8XG5cdFx0XHRcdFx0KHR5cGVvZiBjZWxsID09PSBcIm9iamVjdFwiICYmIGNlbGwuc3VuayksXG5cdFx0XHQpLFxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGdldCBib2FyZCgpIHtcblx0XHRcdHJldHVybiBib2FyZDtcblx0XHR9LFxuXHRcdGNhblBsYWNlU2hpcCxcblx0XHRwbGFjZVNoaXAsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhbGxTaGlwc1N1bmssXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVCb2FyZDtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNoaXAobGVuZ3RoKSB7XG5cdGlmICh0eXBlb2YgbGVuZ3RoICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIG51bWJlclwiKTtcblx0aWYgKGxlbmd0aCA8IDEpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCIpO1xuXHRpZiAobGVuZ3RoICUgMSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlclwiKTtcblx0aWYgKGxlbmd0aCA+IDUpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGxlc3MgdGhhbiA2XCIpO1xuXG5cdGxldCBudW1IaXRzID0gMDtcblx0bGV0IHN1bmsgPSBmYWxzZTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldCBsZW5ndGgoKSB7XG5cdFx0XHRyZXR1cm4gbGVuZ3RoO1xuXHRcdH0sXG5cdFx0Z2V0IG51bUhpdHMoKSB7XG5cdFx0XHRyZXR1cm4gbnVtSGl0cztcblx0XHR9LFxuXHRcdGdldCBzdW5rKCkge1xuXHRcdFx0cmV0dXJuIHN1bms7XG5cdFx0fSxcblx0XHRoaXQoKSB7XG5cdFx0XHRudW1IaXRzICs9IDE7XG5cdFx0XHRpZiAobnVtSGl0cyA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdHN1bmsgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmxldCBib2FyZDtcbmxldCBzaGlwO1xuXG5ib2FyZCA9IGdhbWVCb2FyZCgpO1xuc2hpcCA9IGNyZWF0ZVNoaXAoMyk7XG5cbmNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcbi8vIGJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAzLCBmYWxzZSk7XG5jb25zb2xlLmxvZyhgdmVydGljYWxgKTtcbmJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAwLCB0cnVlKTtcbmJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMSk7XG5ib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDIpO1xuYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAzKTtcbmNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcblxuLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDAsIGZhbHNlKTtcbi8vIGNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMCk7XG4vLyBjb25zb2xlLmxvZyhzaGlwKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMSwgMCk7XG4vLyBjb25zb2xlLmxvZyhzaGlwKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMiwgMCk7XG4vLyBjb25zb2xlLmxvZyhzaGlwKTtcbiJdLCJuYW1lcyI6WyJnYW1lQm9hcmQiLCJib2FyZCIsIkFycmF5IiwiZnJvbSIsImxlbmd0aCIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJ4IiwieSIsIkVycm9yIiwiY2FuUGxhY2VTaGlwIiwic2hpcCIsImlzVmVydGljYWwiLCJtYXhYIiwibWF4WSIsImkiLCJjaGVja1giLCJjaGVja1kiLCJ1bmRlZmluZWQiLCJwbGFjZVNoaXAiLCJwbGFjZVgiLCJwbGFjZVkiLCJyZWNlaXZlQXR0YWNrIiwiaGl0Iiwic3VuayIsImFsbFNoaXBzU3VuayIsImV2ZXJ5Iiwicm93IiwiY2VsbCIsIl90eXBlb2YiLCJjcmVhdGVTaGlwIiwibnVtSGl0cyIsImNvbnNvbGUiLCJsb2ciXSwic291cmNlUm9vdCI6IiJ9