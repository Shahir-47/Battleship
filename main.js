/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/computer.js":
/*!*************************!*\
  !*** ./src/computer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


function computer() {
  var compBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  var lastHit = null;
  var targetMode = false;
  var attackOptions = []; // Stores potential cells to attack in target mode
  var isTurn = false;
  function randomAttack(enemy) {
    var x;
    var y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (enemy.hitBoard[y][x] !== undefined);
    return {
      x: x,
      y: y
    };
  }
  function placeShipsAutomatically() {
    var ships = [5, 4, 3, 3, 2];
    ships.forEach(function (length) {
      var x;
      var y;
      var vertical;
      var ship = (0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(length);
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        vertical = Math.random() < 0.5;
      } while (!compBoard.canPlaceShip(ship, x, y, vertical));
      compBoard.placeShip(ship, x, y, vertical);
    });
  }
  function targetAttack(enemy) {
    if (attackOptions.length === 0) {
      var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      directions.forEach(function (dir) {
        var newX = lastHit.x + dir[0];
        var newY = lastHit.y + dir[1];
        if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && enemy.hitBoard[newY][newX] === undefined) {
          attackOptions.push({
            x: newX,
            y: newY
          });
        }
      });
    }
    return attackOptions.shift();
  }
  function chooseAttack(enemy) {
    return targetMode ? targetAttack(enemy) : randomAttack(enemy);
  }
  function attack(player) {
    var _chooseAttack = chooseAttack(player),
      x = _chooseAttack.x,
      y = _chooseAttack.y;
    console.log("x: ".concat(x, ", y: ").concat(y));
    var attackResult = player.receiveAttack(x, y);
    console.log("computer attackResult: ".concat(attackResult));
    if (attackResult === "hit") {
      lastHit = {
        x: x,
        y: y
      };
      targetMode = true;
    } else if (attackResult === "miss" && lastHit && targetMode) {
      if (attackOptions.length === 0) {
        targetMode = false; // Switch back to random mode if no options left
      }
    } else if (attackResult === "sunk") {
      lastHit = null;
      targetMode = false;
      attackOptions = []; // Clear attack options
    }
    return {
      x: x,
      y: y,
      attackResult: attackResult
    };
  }
  function receiveAttack(x, y) {
    return compBoard.receiveAttack(x, y);
  }
  function hasLost() {
    return compBoard.allShipsSunk();
  }
  return {
    placeShipsAutomatically: placeShipsAutomatically,
    attack: attack,
    receiveAttack: receiveAttack,
    hasLost: hasLost,
    chooseAttack: chooseAttack,
    get isTurn() {
      return isTurn;
    },
    set isTurn(value) {
      isTurn = value;
    },
    get compBoard() {
      return compBoard;
    },
    get targetMode() {
      return targetMode;
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (computer);

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./computer */ "./src/computer.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _gameUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameUI */ "./src/gameUI.js");




function playGame() {
  var gameActive = true;
  var user = (0,_player__WEBPACK_IMPORTED_MODULE_0__["default"])("Player 1");
  var comp = (0,_computer__WEBPACK_IMPORTED_MODULE_1__["default"])();
  var gridCells = document.querySelectorAll(".grid-cell");
  var rotateButton = document.querySelector(".rotate-button");
  var ships = [5, 4, 3, 3, 2];
  var selectedShipSize = ships.shift();
  var isHorizontal = true; // Orientation of the ship

  function highlightCells(e) {
    var startX = parseInt(e.target.dataset.x, 10);
    var startY = parseInt(e.target.dataset.y, 10);
    var isPlacementValid = true;
    for (var i = 0; i < selectedShipSize; i++) {
      var x = isHorizontal ? startX + i : startX;
      var y = isHorizontal ? startY : startY + i;
      var cell = document.querySelector(".grid-cell[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      if (!cell || x >= 10 || y >= 10) {
        // Check if the cell is outside the board
        isPlacementValid = false;
        break;
      }
    }
    for (var _i = 0; _i < selectedShipSize; _i++) {
      var _x = isHorizontal ? startX + _i : startX;
      var _y = isHorizontal ? startY : startY + _i;
      var _cell = document.querySelector(".grid-cell[data-x=\"".concat(_x, "\"][data-y=\"").concat(_y, "\"]"));
      if (_cell) {
        _cell.classList.add(isPlacementValid ? "highlight" : "blocked"); // Use 'blocked' class for invalid placement
      }
    }
  }
  function removeHighlight() {
    gridCells.forEach(function (cell) {
      cell.classList.remove("highlight", "blocked");
    });
  }
  gridCells.forEach(function (cell) {
    cell.addEventListener("mouseover", function (e) {
      if (selectedShipSize === -1) return;
      highlightCells(e, selectedShipSize);
    });
    cell.addEventListener("mouseout", removeHighlight);
    cell.addEventListener("click", function (e) {
      // only shift if placed
      // start game once all ships are placed
      // implement logic to prevent ships from overlapping
      var x = parseInt(cell.dataset.x, 10);
      var y = parseInt(cell.dataset.y, 10);
      if (user.canPlaceShip(selectedShipSize, x, y, !isHorizontal)) {
        user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(selectedShipSize), x, y, !isHorizontal);
        highlightCells(e);
        selectedShipSize = ships.shift();
        // drawBoard(user.playerBoard.board);
      }
    });
  });
  rotateButton.addEventListener("click", function () {
    isHorizontal = !isHorizontal;
  });

  // Place ships
  // user.placeShip(createShip(5), 0, 0, false);
  // user.placeShip(createShip(4), 0, 1, false);
  // user.placeShip(createShip(3), 0, 2, false);
  // user.placeShip(createShip(3), 0, 3, false);
  // user.placeShip(createShip(2), 0, 4, false);

  // console.log("user board:");
  // console.log(user.playerBoard.board);

  // comp.placeShipsAutomatically();

  // console.log("comp board:");
  // console.log(comp.compBoard.board);

  // drawBoard(user.playerBoard.board);
  // drawBoard(comp.compBoard.board, true);

  // user.isTurn = true;
  // comp.isTurn = false;

  // const cells = document.querySelectorAll(".enemy .cell");
  // cells.forEach((cell) => {
  // 	cell.addEventListener("click", (e) => {
  // 		if (!gameActive || !user.isTurn) return;
  // 		if (
  // 			e.target.classList.contains("hit") ||
  // 			e.target.classList.contains("miss")
  // 		)
  // 			return;
  // 		const { x } = e.target.dataset;
  // 		const { y } = e.target.dataset;
  // 		const xInt = parseInt(x, 10);
  // 		const yInt = parseInt(y, 10);

  // 		const result = user.attack(xInt, yInt, comp);
  // 		updateBoard(xInt, yInt, result, true);

  // 		if (comp.hasLost()) {
  // 			console.log("comp has lost");
  // 			gameActive = false;
  // 			return;
  // 		}

  // 		user.isTurn = false;
  // 		comp.isTurn = true;
  // 		updateTurn(user.isTurn);
  // 		// debugger;

  // 		setTimeout(() => {
  // 			const {
  // 				x: compX,
  // 				y: compY,
  // 				attackResult: compResult,
  // 			} = comp.attack(user);
  // 			updateBoard(compX, compY, compResult, false);

  // 			if (user.hasLost()) {
  // 				gameActive = false;
  // 				console.log("user has lost");
  // 				return;
  // 			}

  // 			user.isTurn = true;
  // 			comp.isTurn = false;
  // 			updateTurn(user.isTurn);
  // 		}, 1000);
  // 	});
  // });

  // 	// Play game
  // 	let gameOver = false;
  // 	let winner;
  // 	let turn = 0;
  // 	let x;
  // 	let y;
  // 	let i = 0;
  // 	while (!gameOver) {
  // 		// drawBoard(user.playerBoard.board);
  // 		// drawBoard(comp.compBoard.board, true);
  // 		if (turn % 2 === 0) {
  // 			user.isTurn = true;
  // 			comp.isTurn = false;

  // 			user.attack(x, y, comp);

  // 			console.log(`comp board:${i}`);
  // 			console.log(comp.compBoard.board);

  // 			console.log(comp.hasLost());
  // 			if (comp.hasLost()) {
  // 				gameOver = true;
  // 				winner = user;

  // 				console.log(`user board (line:${i}):`);
  // 				console.log(user.playerBoard.board);

  // 				console.log(`comp board: ${i}`);
  // 				console.log(comp.compBoard.board);
  // 			}
  // 		} else {
  // 			user.isTurn = false;
  // 			comp.isTurn = true;
  // 			comp.attack(user);

  // 			console.log(`user board:${i}`);
  // 			console.log(user.playerBoard.board);

  // 			if (user.hasLost()) {
  // 				gameOver = true;
  // 				winner = comp;

  // 				console.log(`user board (line:${i}):`);
  // 				console.log(user.playerBoard.board);

  // 				console.log(`comp board: ${i}`);
  // 				console.log(comp.compBoard.board);
  // 			}
  // 		}
  // 		turn += 1;
  // 		i += 1;
  // 	}

  // 	console.log(`${winner.name} wins!`);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (playGame);

/***/ }),

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

/***/ "./src/gameUI.js":
/*!***********************!*\
  !*** ./src/gameUI.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   drawBoard: () => (/* binding */ drawBoard),
/* harmony export */   updateBoard: () => (/* binding */ updateBoard),
/* harmony export */   updateTurn: () => (/* binding */ updateTurn)
/* harmony export */ });
/* harmony import */ var _img_soldier_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./img/soldier.svg */ "./src/img/soldier.svg");

function header() {
  var bar = document.createElement("div");
  bar.classList.add("nav-bar");

  // items on the left side of the header
  var leftIcon = document.createElement("img");
  leftIcon.classList.add("icon");
  leftIcon.src = _img_soldier_svg__WEBPACK_IMPORTED_MODULE_0__;
  leftIcon.alt = "soldier";

  // Create the menu button
  var titleBox = document.createElement("div");
  titleBox.classList.add("header");
  var title = document.createElement("h1");
  title.textContent = "Battleship";
  titleBox.appendChild(title);
  var rightIcon = document.createElement("img");
  rightIcon.classList.add("icon");
  rightIcon.src = _img_soldier_svg__WEBPACK_IMPORTED_MODULE_0__;
  rightIcon.alt = "soldier";
  bar.appendChild(leftIcon);
  bar.appendChild(titleBox);
  bar.appendChild(rightIcon);
  document.querySelector("div#content").appendChild(bar);
}
function mainContent() {
  var main = document.createElement("div");
  main.classList.add("main-content");
  document.querySelector("div#content").appendChild(main);
}
function turn() {
  var turnDiv = document.createElement("div");
  turnDiv.classList.add("turn-div");
  var turnIndicator = document.createElement("div");
  turnIndicator.classList.add("turn-indicator");
  var turnText = document.createElement("p");
  turnText.textContent = "Your Turn";
  turnIndicator.appendChild(turnText);
  turnDiv.appendChild(turnIndicator);
  document.querySelector("div.main-content").appendChild(turnDiv);
}
function createBoard() {
  var board = document.createElement("div");
  board.classList.add("board");
  document.querySelector("div.main-content").appendChild(board);
}
function playerBoard() {
  var board = document.createElement("div");
  board.classList.add("player");
  var boardTitle = document.createElement("h2");
  boardTitle.textContent = "Your Board";
  board.appendChild(boardTitle);
  var boardGrid = document.createElement("div");
  boardGrid.classList.add("board-grid");
  board.appendChild(boardGrid);
  document.querySelector("div.board").appendChild(board);
}
function enemyBoard() {
  var board = document.createElement("div");
  board.classList.add("enemy");
  var boardTitle = document.createElement("h2");
  boardTitle.textContent = "Enemy Board";
  board.appendChild(boardTitle);
  var boardGrid = document.createElement("div");
  boardGrid.classList.add("board-grid");
  board.appendChild(boardGrid);
  document.querySelector("div.board").appendChild(board);
}
function returnBoardGrid(enemy) {
  var boardGrid;
  if (enemy) {
    boardGrid = document.querySelector("div.enemy div.board-grid");
  } else {
    boardGrid = document.querySelector("div.player div.board-grid");
  }
  return boardGrid;
}
function drawBoard(board) {
  var isEnemy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var boardGrid = returnBoardGrid(isEnemy);
  boardGrid.innerHTML = "";
  for (var i = 0; i < board.length; i += 1) {
    for (var j = 0; j < board[i].length; j += 1) {
      var cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = j;
      cell.dataset.y = i;
      if (board[i][j] !== undefined) {
        cell.classList.add("ship");
      }
      boardGrid.appendChild(cell);
    }
  }
}
function miss(x, y, enemy) {
  var boardGrid = returnBoardGrid(enemy);
  var cell = boardGrid.children[y * 10 + x];
  cell.classList.add("miss");
}
function hit(x, y, enemy) {
  var boardGrid = returnBoardGrid(enemy);
  var cell = boardGrid.children[y * 10 + x];
  cell.classList.add("hit");
}
function sunk(x, y, enemy) {
  var boardGrid = returnBoardGrid(enemy);
  var cell = boardGrid.children[y * 10 + x];
  cell.classList.add("sunk");
}
function updateBoard(x, y, result, enemy) {
  if (result === "miss") {
    miss(x, y, enemy);
  } else if (result === "hit") {
    hit(x, y, enemy);
  } else if (result === "sunk") {
    sunk(x, y, enemy);
  }
}
function startPage() {
  var main = document.querySelector("div.main-content");
  main.innerHTML = "";
  turn();
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.textContent = "Place your ships by clicking on the board below";
  var rotateContainer = document.createElement("div");
  rotateContainer.classList.add("rotate-container");
  var rotateButton = document.createElement("button");
  rotateButton.classList.add("rotate-button");
  rotateButton.textContent = "Rotate";
  rotateContainer.appendChild(rotateButton);
  main.appendChild(rotateContainer);
  var boardGrid = document.createElement("div");
  boardGrid.classList.add("board-grid");
  main.appendChild(boardGrid);
  for (var i = 0; i < 100; i += 1) {
    var cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("grid-cell");
    cell.dataset.x = i % 10;
    cell.dataset.y = Math.floor(i / 10);
    boardGrid.appendChild(cell);
  }
}
function loadGame() {
  var main = document.querySelector("div.main-content");
  main.innerHTML = "";
  turn();
  createBoard();
  playerBoard();
  enemyBoard();
}
function updateTurn(isTurn) {
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.style.opacity = "0";
  // Change text after fade out
  setTimeout(function () {
    turnText.textContent = isTurn ? "Your Turn" : "Computer's Turn";
    // Fade in
    turnText.style.opacity = "1";
  }, 500); // This should match the CSS transition time
}
function page() {
  header();
  mainContent();
  startPage();
  // loadGame();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (page);


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");

function player() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "anonymous";
  var playerBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  var hitBoard = Array.from({
    length: 10
  }, function () {
    return Array.from({
      length: 10
    });
  });
  var isTurn = false;
  function placeShip(ship, row, col, vertical) {
    playerBoard.placeShip(ship, row, col, vertical);
  }
  function canPlaceShip(ship, row, col, vertical) {
    return playerBoard.canPlaceShip(ship, row, col, vertical);
  }
  function receiveAttack(row, col) {
    var result = playerBoard.receiveAttack(row, col);
    if (result === "hit") {
      hitBoard[col][row] = "hit";
    } else if (result === "sunk") {
      hitBoard[col][row] = "sunk";
    } else {
      hitBoard[col][row] = "miss";
    }
    console.log("player hitBoard:");
    console.log(hitBoard);
    return result;
  }
  function attack(row, col, enemy) {
    return enemy.receiveAttack(row, col);
  }
  function hasLost() {
    return playerBoard.allShipsSunk();
  }
  return {
    name: name,
    placeShip: placeShip,
    canPlaceShip: canPlaceShip,
    receiveAttack: receiveAttack,
    attack: attack,
    hasLost: hasLost,
    get isTurn() {
      return isTurn;
    },
    set isTurn(value) {
      isTurn = value;
    },
    get playerBoard() {
      return playerBoard;
    },
    get hitBoard() {
      return hitBoard;
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (player);

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

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/game.css":
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/game.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
	--sidebar-bg-color: #19211a;
	--content-text-color: #dddddd;
	--title-box-color: #dddddd;
	--item-focus-color: #1f2937;
	--search-box-bg-color: #192734;
	--search-input-color: #dddddd;
	--search-btn-bg-color: #313e4b;
	--logo-color: #dddddd;
	--toggle-switch-bg-color: #6b757e;
	--toggle-switch-border-color: #2ca9bc;
	--footer-color: #dddddd;
	--footer-active: #ffffff;
	--add-btn-color: #3f51b5;
	--add-btn-bg-color: #90caf9;
	--form-header-color: #dddddd;
	--form-scroll-box-bg-color: #9e9e9e21;
	--todo-item-bg-color: #192734;
	--todo-item-hover-color: #2d3d4d;
	--back-btn-color: #3f51b5;
	--form-input-color: #192734;
	--header-color: #dddddd;
	--note-color: #ffffff;
	--note-header: #90caf9;
	--note-out-of-focus: #dddddd;
	--highlight: #5369e5;
	--red: #c81414;
	background-color: #19211a;
	margin: 0;
	padding: 0;
	font-family:
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		Oxygen,
		Ubuntu,
		Cantarell,
		"Open Sans",
		"Helvetica Neue",
		sans-serif;
	color: #dddddd;
}

div#content {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	height: 100vh;
}

.nav-bar {
	background-color: var(--sidebar-bg-color);
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5rem;
	padding: 0 1rem;
	padding-top: 0.25rem;
}

.main-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	padding: 0 1rem;
}

.header h1 {
	text-align: center; /* Center the header text */
	font-family: "Arial", sans-serif; /* Use a modern, clean font */
	font-size: 48px; /* Set a large font size for impact */
	color: #ffffff87; /* White color for the text for better contrast */
	background-color: #19211a; /* Navy blue background */
	padding: 20px; /* Add some padding around the text */
	text-transform: uppercase; /* Make all letters uppercase for more impact */
	letter-spacing: 2px; /* Increase spacing between letters */
	margin: 0px; /* Add some space below the header */
	text-shadow: 2px 2px 2px #737373;
}

.header h1:hover {
	color: #849177; /* Change text color on hover */
	cursor: pointer; /* Change the cursor to indicate it's clickable */
}

.icon {
	width: 6rem;
	height: auto;
}

.turn-indicator {
	width: 60%;
	height: 100%;
	border-radius: 1rem;
	/* background-color: #ffffff87; */
	padding: 0.5rem;
	text-align: center;
	background: #ffffff87;
	background: -moz-linear-gradient(
		-45deg,
		#cdcaca87 0%,
		#ffffff87 50%,
		#cdcdcda6 100%
	);
	background: -webkit-linear-gradient(
		-45deg,
		#cdcaca87 0%,
		#ffffff87 50%,
		#cdcdcda6 100%
	);
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
.turn-indicator p {
	font-size: 1.5rem;
	font-weight: bold;
	color: #19211a;
	font-family: "Arial", sans-serif; /* Use a modern, clean font */
	text-transform: uppercase; /* Make all letters uppercase for more impact */
	letter-spacing: 2px; /* Increase spacing between letters */
	margin-bottom: 30px; /* Add some space below the header */
	text-shadow: 4px 3px 0px #65715973;
	margin: 0;
	transition: opacity 0.5s ease-in-out;
	opacity: 1; /* Start fully visible */
}

.rotate-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.rotate-button {
	background-color: #506052;
	color: #c1c1c1d6;
	border: 2px solid #929392;
	padding: 10px 20px;
	border-radius: 5px;
	font-weight: bold;
	cursor: pointer;
	transition:
		transform 0.3s ease,
		background-color 0.3s ease;
}

.rotate-button:hover {
	background-color: #2c7235; /* Background color on hover */
	color: #ffffff87; /* Text color on hover */
}

.board {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	align-items: center;
	justify-items: center;
	justify-content: center;
	align-content: center;
}

.cell.highlight {
	background-color: lightblue;
}

.cell.blocked {
	background-color: red; /* Color indicating invalid placement */
	cursor: not-allowed; /* Blocked cursor */
}

.board h2 {
	margin: 0;
}

.turn-div {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

div.board-grid {
	display: grid;
	grid-template: repeat(10, 2.5vw) / repeat(10, 2.5vw);
	text-align: center;
	gap: 2px;
	align-items: center;
	justify-items: center;
	justify-content: center;
	align-content: center;
}

div.board-grid .cell {
	border: 1px solid white;
	height: 100%;
	width: 100%;
	transition: all 0.3s ease 0s;
}

.enemy,
.player {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
}

.ship {
	background-color: aqua;
}

.miss {
	background-color: #ff000087;
}

.hit {
	background-color: #00ff1e87;
}

.sunk {
	background-color: #ff00ee87;
}
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"AAAA;CACC,2BAA2B;CAC3B,6BAA6B;CAC7B,0BAA0B;CAC1B,2BAA2B;CAC3B,8BAA8B;CAC9B,6BAA6B;CAC7B,8BAA8B;CAC9B,qBAAqB;CACrB,iCAAiC;CACjC,qCAAqC;CACrC,uBAAuB;CACvB,wBAAwB;CACxB,wBAAwB;CACxB,2BAA2B;CAC3B,4BAA4B;CAC5B,qCAAqC;CACrC,6BAA6B;CAC7B,gCAAgC;CAChC,yBAAyB;CACzB,2BAA2B;CAC3B,uBAAuB;CACvB,qBAAqB;CACrB,sBAAsB;CACtB,4BAA4B;CAC5B,oBAAoB;CACpB,cAAc;CACd,yBAAyB;CACzB,SAAS;CACT,UAAU;CACV;;;;;;;;;;;YAWW;CACX,cAAc;AACf;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,2BAA2B;CAC3B,oBAAoB;CACpB,aAAa;AACd;;AAEA;CACC,yCAAyC;CACzC,aAAa;CACb,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;CACT,eAAe;CACf,oBAAoB;AACrB;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,SAAS;CACT,eAAe;AAChB;;AAEA;CACC,kBAAkB,EAAE,2BAA2B;CAC/C,gCAAgC,EAAE,6BAA6B;CAC/D,eAAe,EAAE,qCAAqC;CACtD,gBAAgB,EAAE,iDAAiD;CACnE,yBAAyB,EAAE,yBAAyB;CACpD,aAAa,EAAE,qCAAqC;CACpD,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,WAAW,EAAE,oCAAoC;CACjD,gCAAgC;AACjC;;AAEA;CACC,cAAc,EAAE,+BAA+B;CAC/C,eAAe,EAAE,iDAAiD;AACnE;;AAEA;CACC,WAAW;CACX,YAAY;AACb;;AAEA;CACC,UAAU;CACV,YAAY;CACZ,mBAAmB;CACnB,iCAAiC;CACjC,eAAe;CACf,kBAAkB;CAClB,qBAAqB;CACrB;;;;;EAKC;CACD;;;;;EAKC;CACD,0CAA0C;AAC3C;AACA;CACC,iBAAiB;CACjB,iBAAiB;CACjB,cAAc;CACd,gCAAgC,EAAE,6BAA6B;CAC/D,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,mBAAmB,EAAE,oCAAoC;CACzD,kCAAkC;CAClC,SAAS;CACT,oCAAoC;CACpC,UAAU,EAAE,wBAAwB;AACrC;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;AACpB;;AAEA;CACC,yBAAyB;CACzB,gBAAgB;CAChB,yBAAyB;CACzB,kBAAkB;CAClB,kBAAkB;CAClB,iBAAiB;CACjB,eAAe;CACf;;4BAE2B;AAC5B;;AAEA;CACC,yBAAyB,EAAE,8BAA8B;CACzD,gBAAgB,EAAE,wBAAwB;AAC3C;;AAEA;CACC,aAAa;CACb,qCAAqC;CACrC,SAAS;CACT,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,qBAAqB,EAAE,uCAAuC;CAC9D,mBAAmB,EAAE,mBAAmB;AACzC;;AAEA;CACC,SAAS;AACV;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;AACpB;;AAEA;CACC,aAAa;CACb,oDAAoD;CACpD,kBAAkB;CAClB,QAAQ;CACR,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,uBAAuB;CACvB,YAAY;CACZ,WAAW;CACX,4BAA4B;AAC7B;;AAEA;;CAEC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;AACV;;AAEA;CACC,sBAAsB;AACvB;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,2BAA2B;AAC5B","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\t--content-text-color: #dddddd;\n\t--title-box-color: #dddddd;\n\t--item-focus-color: #1f2937;\n\t--search-box-bg-color: #192734;\n\t--search-input-color: #dddddd;\n\t--search-btn-bg-color: #313e4b;\n\t--logo-color: #dddddd;\n\t--toggle-switch-bg-color: #6b757e;\n\t--toggle-switch-border-color: #2ca9bc;\n\t--footer-color: #dddddd;\n\t--footer-active: #ffffff;\n\t--add-btn-color: #3f51b5;\n\t--add-btn-bg-color: #90caf9;\n\t--form-header-color: #dddddd;\n\t--form-scroll-box-bg-color: #9e9e9e21;\n\t--todo-item-bg-color: #192734;\n\t--todo-item-hover-color: #2d3d4d;\n\t--back-btn-color: #3f51b5;\n\t--form-input-color: #192734;\n\t--header-color: #dddddd;\n\t--note-color: #ffffff;\n\t--note-header: #90caf9;\n\t--note-out-of-focus: #dddddd;\n\t--highlight: #5369e5;\n\t--red: #c81414;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: flex-start;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.header h1 {\n\ttext-align: center; /* Center the header text */\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\tfont-size: 48px; /* Set a large font size for impact */\n\tcolor: #ffffff87; /* White color for the text for better contrast */\n\tbackground-color: #19211a; /* Navy blue background */\n\tpadding: 20px; /* Add some padding around the text */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin: 0px; /* Add some space below the header */\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177; /* Change text color on hover */\n\tcursor: pointer; /* Change the cursor to indicate it's clickable */\n}\n\n.icon {\n\twidth: 6rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\t/* background-color: #ffffff87; */\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin-bottom: 30px; /* Add some space below the header */\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1; /* Start fully visible */\n}\n\n.rotate-container {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n.rotate-button {\n\tbackground-color: #506052;\n\tcolor: #c1c1c1d6;\n\tborder: 2px solid #929392;\n\tpadding: 10px 20px;\n\tborder-radius: 5px;\n\tfont-weight: bold;\n\tcursor: pointer;\n\ttransition:\n\t\ttransform 0.3s ease,\n\t\tbackground-color 0.3s ease;\n}\n\n.rotate-button:hover {\n\tbackground-color: #2c7235; /* Background color on hover */\n\tcolor: #ffffff87; /* Text color on hover */\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.cell.highlight {\n\tbackground-color: lightblue;\n}\n\n.cell.blocked {\n\tbackground-color: red; /* Color indicating invalid placement */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.5vw) / repeat(10, 2.5vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: aqua;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\n.hit {\n\tbackground-color: #00ff1e87;\n}\n\n.sunk {\n\tbackground-color: #ff00ee87;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/normalize.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/normalize.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
	line-height: 1.15; /* 1 */
	-webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
	margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
	display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
	font-size: 2em;
	margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
	box-sizing: content-box; /* 1 */
	height: 0; /* 1 */
	overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
	font-family: monospace, monospace; /* 1 */
	font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
	background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
	border-bottom: none; /* 1 */
	text-decoration: underline; /* 2 */
	text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
	font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
	font-family: monospace, monospace; /* 1 */
	font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
	font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline;
}

sub {
	bottom: -0.25em;
}

sup {
	top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
	border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
	font-family: inherit; /* 1 */
	font-size: 100%; /* 1 */
	line-height: 1.15; /* 1 */
	margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input {
	/* 1 */
	overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select {
	/* 1 */
	text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
	-webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
	border-style: none;
	padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
	outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
	padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
	box-sizing: border-box; /* 1 */
	color: inherit; /* 2 */
	display: table; /* 1 */
	max-width: 100%; /* 1 */
	padding: 0; /* 3 */
	white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
	vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
	overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
	box-sizing: border-box; /* 1 */
	padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
	height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
	-webkit-appearance: textfield; /* 1 */
	outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
	-webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
	-webkit-appearance: button; /* 1 */
	font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
	display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
	display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
	display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
	display: none;
}
`, "",{"version":3,"sources":["webpack://./src/css/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;AAEF;CACC,iBAAiB,EAAE,MAAM;CACzB,8BAA8B,EAAE,MAAM;AACvC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;CACC,SAAS;AACV;;AAEA;;EAEE;;AAEF;CACC,cAAc;AACf;;AAEA;;;EAGE;;AAEF;CACC,cAAc;CACd,gBAAgB;AACjB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;CACC,uBAAuB,EAAE,MAAM;CAC/B,SAAS,EAAE,MAAM;CACjB,iBAAiB,EAAE,MAAM;AAC1B;;AAEA;;;EAGE;;AAEF;CACC,iCAAiC,EAAE,MAAM;CACzC,cAAc,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;CACC,6BAA6B;AAC9B;;AAEA;;;EAGE;;AAEF;CACC,mBAAmB,EAAE,MAAM;CAC3B,0BAA0B,EAAE,MAAM;CAClC,iCAAiC,EAAE,MAAM;AAC1C;;AAEA;;EAEE;;AAEF;;CAEC,mBAAmB;AACpB;;AAEA;;;EAGE;;AAEF;;;CAGC,iCAAiC,EAAE,MAAM;CACzC,cAAc,EAAE,MAAM;AACvB;;AAEA;;EAEE;;AAEF;CACC,cAAc;AACf;;AAEA;;;EAGE;;AAEF;;CAEC,cAAc;CACd,cAAc;CACd,kBAAkB;CAClB,wBAAwB;AACzB;;AAEA;CACC,eAAe;AAChB;;AAEA;CACC,WAAW;AACZ;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;CACC,kBAAkB;AACnB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;CAKC,oBAAoB,EAAE,MAAM;CAC5B,eAAe,EAAE,MAAM;CACvB,iBAAiB,EAAE,MAAM;CACzB,SAAS,EAAE,MAAM;AAClB;;AAEA;;;EAGE;;AAEF;;CAEC,MAAM;CACN,iBAAiB;AAClB;;AAEA;;;EAGE;;AAEF;;CAEC,MAAM;CACN,oBAAoB;AACrB;;AAEA;;EAEE;;AAEF;;;;CAIC,0BAA0B;AAC3B;;AAEA;;EAEE;;AAEF;;;;CAIC,kBAAkB;CAClB,UAAU;AACX;;AAEA;;EAEE;;AAEF;;;;CAIC,8BAA8B;AAC/B;;AAEA;;EAEE;;AAEF;CACC,8BAA8B;AAC/B;;AAEA;;;;;EAKE;;AAEF;CACC,sBAAsB,EAAE,MAAM;CAC9B,cAAc,EAAE,MAAM;CACtB,cAAc,EAAE,MAAM;CACtB,eAAe,EAAE,MAAM;CACvB,UAAU,EAAE,MAAM;CAClB,mBAAmB,EAAE,MAAM;AAC5B;;AAEA;;EAEE;;AAEF;CACC,wBAAwB;AACzB;;AAEA;;EAEE;;AAEF;CACC,cAAc;AACf;;AAEA;;;EAGE;;AAEF;;CAEC,sBAAsB,EAAE,MAAM;CAC9B,UAAU,EAAE,MAAM;AACnB;;AAEA;;EAEE;;AAEF;;CAEC,YAAY;AACb;;AAEA;;;EAGE;;AAEF;CACC,6BAA6B,EAAE,MAAM;CACrC,oBAAoB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;CACC,wBAAwB;AACzB;;AAEA;;;EAGE;;AAEF;CACC,0BAA0B,EAAE,MAAM;CAClC,aAAa,EAAE,MAAM;AACtB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;CACC,cAAc;AACf;;AAEA;;EAEE;;AAEF;CACC,kBAAkB;AACnB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;CACC,aAAa;AACd;;AAEA;;EAEE;;AAEF;CACC,aAAa;AACd","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n\tline-height: 1.15; /* 1 */\n\t-webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n\tmargin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n\tdisplay: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n\tfont-size: 2em;\n\tmargin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n\tbox-sizing: content-box; /* 1 */\n\theight: 0; /* 1 */\n\toverflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n\tbackground-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n\tborder-bottom: none; /* 1 */\n\ttext-decoration: underline; /* 2 */\n\ttext-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n\tfont-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n\tfont-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -0.25em;\n}\n\nsup {\n\ttop: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n\tborder-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tfont-family: inherit; /* 1 */\n\tfont-size: 100%; /* 1 */\n\tline-height: 1.15; /* 1 */\n\tmargin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput {\n\t/* 1 */\n\toverflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect {\n\t/* 1 */\n\ttext-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n\t-webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n\tborder-style: none;\n\tpadding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n\toutline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n\tpadding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n\tbox-sizing: border-box; /* 1 */\n\tcolor: inherit; /* 2 */\n\tdisplay: table; /* 1 */\n\tmax-width: 100%; /* 1 */\n\tpadding: 0; /* 3 */\n\twhite-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n\tvertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n\toverflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n\tbox-sizing: border-box; /* 1 */\n\tpadding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n\t-webkit-appearance: textfield; /* 1 */\n\toutline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n\t-webkit-appearance: button; /* 1 */\n\tfont: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n\tdisplay: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n\tdisplay: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n\tdisplay: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n\tdisplay: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/css/game.css":
/*!**************************!*\
  !*** ./src/css/game.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./game.css */ "./node_modules/css-loader/dist/cjs.js!./src/css/game.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/css/normalize.css":
/*!*******************************!*\
  !*** ./src/css/normalize.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./src/css/normalize.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/img/soldier.svg":
/*!*****************************!*\
  !*** ./src/img/soldier.svg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "assets/img/soldier.svg";

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
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
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _gameUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameUI */ "./src/gameUI.js");
/* harmony import */ var _css_normalize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/normalize.css */ "./src/css/normalize.css");
/* harmony import */ var _css_game_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./css/game.css */ "./src/css/game.css");




(0,_gameUI__WEBPACK_IMPORTED_MODULE_1__["default"])();
(0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])();

// import gameBoard from "./gameBoard";
// import createShip from "./ship";

// let board;
// let ship;

// board = gameBoard();
// ship = createShip(3);

// console.log(board.board);
// // board.placeShip(ship, 0, 3, false);
// console.log(`vertical`);
// board.placeShip(ship, 0, 0, true);
// board.receiveAttack(0, 1);
// board.receiveAttack(0, 2);
// board.receiveAttack(0, 3);
// console.log(board.board);

// // board.placeShip(ship, 0, 0, false);
// // console.log(board.board);
// // board.receiveAttack(0, 0);
// // console.log(ship);
// // board.receiveAttack(1, 0);
// // console.log(ship);
// // board.receiveAttack(2, 0);
// // console.log(ship);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bGVzaGlwLy4vc3JjL2NvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3M/YTNjZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzPzZkNTQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmZ1bmN0aW9uIGNvbXB1dGVyKCkge1xuXHRjb25zdCBjb21wQm9hcmQgPSBnYW1lQm9hcmQoKTtcblx0bGV0IGxhc3RIaXQgPSBudWxsO1xuXHRsZXQgdGFyZ2V0TW9kZSA9IGZhbHNlO1xuXHRsZXQgYXR0YWNrT3B0aW9ucyA9IFtdOyAvLyBTdG9yZXMgcG90ZW50aWFsIGNlbGxzIHRvIGF0dGFjayBpbiB0YXJnZXQgbW9kZVxuXHRsZXQgaXNUdXJuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG5cdFx0bGV0IHg7XG5cdFx0bGV0IHk7XG5cdFx0ZG8ge1xuXHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0fSB3aGlsZSAoZW5lbXkuaGl0Qm9hcmRbeV1beF0gIT09IHVuZGVmaW5lZCk7XG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKSB7XG5cdFx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cdFx0c2hpcHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG5cdFx0XHRsZXQgeDtcblx0XHRcdGxldCB5O1xuXHRcdFx0bGV0IHZlcnRpY2FsO1xuXHRcdFx0Y29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoKTtcblx0XHRcdGRvIHtcblx0XHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0eSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0dmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0fSB3aGlsZSAoIWNvbXBCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpKTtcblx0XHRcdGNvbXBCb2FyZC5wbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gdGFyZ2V0QXR0YWNrKGVuZW15KSB7XG5cdFx0aWYgKGF0dGFja09wdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRjb25zdCBkaXJlY3Rpb25zID0gW1xuXHRcdFx0XHRbMSwgMF0sXG5cdFx0XHRcdFstMSwgMF0sXG5cdFx0XHRcdFswLCAxXSxcblx0XHRcdFx0WzAsIC0xXSxcblx0XHRcdF07XG5cdFx0XHRkaXJlY3Rpb25zLmZvckVhY2goKGRpcikgPT4ge1xuXHRcdFx0XHRjb25zdCBuZXdYID0gbGFzdEhpdC54ICsgZGlyWzBdO1xuXHRcdFx0XHRjb25zdCBuZXdZID0gbGFzdEhpdC55ICsgZGlyWzFdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0bmV3WCA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WCA8IDEwICYmXG5cdFx0XHRcdFx0bmV3WSA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WSA8IDEwICYmXG5cdFx0XHRcdFx0ZW5lbXkuaGl0Qm9hcmRbbmV3WV1bbmV3WF0gPT09IHVuZGVmaW5lZFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRhdHRhY2tPcHRpb25zLnB1c2goeyB4OiBuZXdYLCB5OiBuZXdZIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXR0YWNrT3B0aW9ucy5zaGlmdCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hvb3NlQXR0YWNrKGVuZW15KSB7XG5cdFx0cmV0dXJuIHRhcmdldE1vZGUgPyB0YXJnZXRBdHRhY2soZW5lbXkpIDogcmFuZG9tQXR0YWNrKGVuZW15KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGF0dGFjayhwbGF5ZXIpIHtcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNob29zZUF0dGFjayhwbGF5ZXIpO1xuXHRcdGNvbnNvbGUubG9nKGB4OiAke3h9LCB5OiAke3l9YCk7XG5cdFx0Y29uc3QgYXR0YWNrUmVzdWx0ID0gcGxheWVyLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdFx0Y29uc29sZS5sb2coYGNvbXB1dGVyIGF0dGFja1Jlc3VsdDogJHthdHRhY2tSZXN1bHR9YCk7XG5cdFx0aWYgKGF0dGFja1Jlc3VsdCA9PT0gXCJoaXRcIikge1xuXHRcdFx0bGFzdEhpdCA9IHsgeCwgeSB9O1xuXHRcdFx0dGFyZ2V0TW9kZSA9IHRydWU7XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwibWlzc1wiICYmIGxhc3RIaXQgJiYgdGFyZ2V0TW9kZSkge1xuXHRcdFx0aWYgKGF0dGFja09wdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRhcmdldE1vZGUgPSBmYWxzZTsgLy8gU3dpdGNoIGJhY2sgdG8gcmFuZG9tIG1vZGUgaWYgbm8gb3B0aW9ucyBsZWZ0XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRsYXN0SGl0ID0gbnVsbDtcblx0XHRcdHRhcmdldE1vZGUgPSBmYWxzZTtcblx0XHRcdGF0dGFja09wdGlvbnMgPSBbXTsgLy8gQ2xlYXIgYXR0YWNrIG9wdGlvbnNcblx0XHR9XG5cdFx0cmV0dXJuIHsgeCwgeSwgYXR0YWNrUmVzdWx0IH07XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNMb3N0KCkge1xuXHRcdHJldHVybiBjb21wQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5LFxuXHRcdGF0dGFjayxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGhhc0xvc3QsXG5cdFx0Y2hvb3NlQXR0YWNrLFxuXHRcdGdldCBpc1R1cm4oKSB7XG5cdFx0XHRyZXR1cm4gaXNUdXJuO1xuXHRcdH0sXG5cdFx0c2V0IGlzVHVybih2YWx1ZSkge1xuXHRcdFx0aXNUdXJuID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQgY29tcEJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGNvbXBCb2FyZDtcblx0XHR9LFxuXHRcdGdldCB0YXJnZXRNb2RlKCkge1xuXHRcdFx0cmV0dXJuIHRhcmdldE1vZGU7XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXI7XG4iLCJpbXBvcnQgcGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IGNvbXB1dGVyIGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgeyBkcmF3Qm9hcmQsIHVwZGF0ZUJvYXJkLCB1cGRhdGVUdXJuIH0gZnJvbSBcIi4vZ2FtZVVJXCI7XG5cbmZ1bmN0aW9uIHBsYXlHYW1lKCkge1xuXHRsZXQgZ2FtZUFjdGl2ZSA9IHRydWU7XG5cdGNvbnN0IHVzZXIgPSBwbGF5ZXIoXCJQbGF5ZXIgMVwiKTtcblx0Y29uc3QgY29tcCA9IGNvbXB1dGVyKCk7XG5cblx0Y29uc3QgZ3JpZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWNlbGxcIik7XG5cdGNvbnN0IHJvdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ1dHRvblwiKTtcblx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cdGxldCBzZWxlY3RlZFNoaXBTaXplID0gc2hpcHMuc2hpZnQoKTtcblx0bGV0IGlzSG9yaXpvbnRhbCA9IHRydWU7IC8vIE9yaWVudGF0aW9uIG9mIHRoZSBzaGlwXG5cblx0ZnVuY3Rpb24gaGlnaGxpZ2h0Q2VsbHMoZSkge1xuXHRcdGNvbnN0IHN0YXJ0WCA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQueCwgMTApO1xuXHRcdGNvbnN0IHN0YXJ0WSA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQueSwgMTApO1xuXHRcdGxldCBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRTaGlwU2l6ZTsgaSsrKSB7XG5cdFx0XHRjb25zdCB4ID0gaXNIb3Jpem9udGFsID8gc3RhcnRYICsgaSA6IHN0YXJ0WDtcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNlbGwgfHwgeCA+PSAxMCB8fCB5ID49IDEwKSB7XG5cdFx0XHRcdC8vIENoZWNrIGlmIHRoZSBjZWxsIGlzIG91dHNpZGUgdGhlIGJvYXJkXG5cdFx0XHRcdGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZFNoaXBTaXplOyBpKyspIHtcblx0XHRcdGNvbnN0IHggPSBpc0hvcml6b250YWwgPyBzdGFydFggKyBpIDogc3RhcnRYO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcblx0XHRcdCk7XG5cdFx0XHRpZiAoY2VsbCkge1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoaXNQbGFjZW1lbnRWYWxpZCA/IFwiaGlnaGxpZ2h0XCIgOiBcImJsb2NrZWRcIik7IC8vIFVzZSAnYmxvY2tlZCcgY2xhc3MgZm9yIGludmFsaWQgcGxhY2VtZW50XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KCkge1xuXHRcdGdyaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIiwgXCJibG9ja2VkXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z3JpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcblx0XHRcdGlmIChzZWxlY3RlZFNoaXBTaXplID09PSAtMSkgcmV0dXJuO1xuXHRcdFx0aGlnaGxpZ2h0Q2VsbHMoZSwgc2VsZWN0ZWRTaGlwU2l6ZSk7XG5cdFx0fSk7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgcmVtb3ZlSGlnaGxpZ2h0KTtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuXHRcdFx0Ly8gb25seSBzaGlmdCBpZiBwbGFjZWRcblx0XHRcdC8vIHN0YXJ0IGdhbWUgb25jZSBhbGwgc2hpcHMgYXJlIHBsYWNlZFxuXHRcdFx0Ly8gaW1wbGVtZW50IGxvZ2ljIHRvIHByZXZlbnQgc2hpcHMgZnJvbSBvdmVybGFwcGluZ1xuXHRcdFx0Y29uc3QgeCA9IHBhcnNlSW50KGNlbGwuZGF0YXNldC54LCAxMCk7XG5cdFx0XHRjb25zdCB5ID0gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LnksIDEwKTtcblx0XHRcdGlmICh1c2VyLmNhblBsYWNlU2hpcChzZWxlY3RlZFNoaXBTaXplLCB4LCB5LCAhaXNIb3Jpem9udGFsKSkge1xuXHRcdFx0XHR1c2VyLnBsYWNlU2hpcChjcmVhdGVTaGlwKHNlbGVjdGVkU2hpcFNpemUpLCB4LCB5LCAhaXNIb3Jpem9udGFsKTtcblx0XHRcdFx0aGlnaGxpZ2h0Q2VsbHMoZSk7XG5cdFx0XHRcdHNlbGVjdGVkU2hpcFNpemUgPSBzaGlwcy5zaGlmdCgpO1xuXHRcdFx0XHQvLyBkcmF3Qm9hcmQodXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHJvdGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlzSG9yaXpvbnRhbCA9ICFpc0hvcml6b250YWw7XG5cdH0pO1xuXG5cdC8vIFBsYWNlIHNoaXBzXG5cdC8vIHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoNSksIDAsIDAsIGZhbHNlKTtcblx0Ly8gdXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcCg0KSwgMCwgMSwgZmFsc2UpO1xuXHQvLyB1c2VyLnBsYWNlU2hpcChjcmVhdGVTaGlwKDMpLCAwLCAyLCBmYWxzZSk7XG5cdC8vIHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoMyksIDAsIDMsIGZhbHNlKTtcblx0Ly8gdXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcCgyKSwgMCwgNCwgZmFsc2UpO1xuXG5cdC8vIGNvbnNvbGUubG9nKFwidXNlciBib2FyZDpcIik7XG5cdC8vIGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdC8vIGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTtcblxuXHQvLyBjb25zb2xlLmxvZyhcImNvbXAgYm9hcmQ6XCIpO1xuXHQvLyBjb25zb2xlLmxvZyhjb21wLmNvbXBCb2FyZC5ib2FyZCk7XG5cblx0Ly8gZHJhd0JvYXJkKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXHQvLyBkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXG5cdC8vIHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Ly8gY29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHQvLyBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXkgLmNlbGxcIik7XG5cdC8vIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0Ly8gXHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuXHQvLyBcdFx0aWYgKCFnYW1lQWN0aXZlIHx8ICF1c2VyLmlzVHVybikgcmV0dXJuO1xuXHQvLyBcdFx0aWYgKFxuXHQvLyBcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHxcblx0Ly8gXHRcdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxuXHQvLyBcdFx0KVxuXHQvLyBcdFx0XHRyZXR1cm47XG5cdC8vIFx0XHRjb25zdCB7IHggfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdC8vIFx0XHRjb25zdCB7IHkgfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdC8vIFx0XHRjb25zdCB4SW50ID0gcGFyc2VJbnQoeCwgMTApO1xuXHQvLyBcdFx0Y29uc3QgeUludCA9IHBhcnNlSW50KHksIDEwKTtcblxuXHQvLyBcdFx0Y29uc3QgcmVzdWx0ID0gdXNlci5hdHRhY2soeEludCwgeUludCwgY29tcCk7XG5cdC8vIFx0XHR1cGRhdGVCb2FyZCh4SW50LCB5SW50LCByZXN1bHQsIHRydWUpO1xuXG5cdC8vIFx0XHRpZiAoY29tcC5oYXNMb3N0KCkpIHtcblx0Ly8gXHRcdFx0Y29uc29sZS5sb2coXCJjb21wIGhhcyBsb3N0XCIpO1xuXHQvLyBcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7XG5cdC8vIFx0XHRcdHJldHVybjtcblx0Ly8gXHRcdH1cblxuXHQvLyBcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0Ly8gXHRcdGNvbXAuaXNUdXJuID0gdHJ1ZTtcblx0Ly8gXHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pO1xuXHQvLyBcdFx0Ly8gZGVidWdnZXI7XG5cblx0Ly8gXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHQvLyBcdFx0XHRjb25zdCB7XG5cdC8vIFx0XHRcdFx0eDogY29tcFgsXG5cdC8vIFx0XHRcdFx0eTogY29tcFksXG5cdC8vIFx0XHRcdFx0YXR0YWNrUmVzdWx0OiBjb21wUmVzdWx0LFxuXHQvLyBcdFx0XHR9ID0gY29tcC5hdHRhY2sodXNlcik7XG5cdC8vIFx0XHRcdHVwZGF0ZUJvYXJkKGNvbXBYLCBjb21wWSwgY29tcFJlc3VsdCwgZmFsc2UpO1xuXG5cdC8vIFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHQvLyBcdFx0XHRcdGdhbWVBY3RpdmUgPSBmYWxzZTtcblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhcInVzZXIgaGFzIGxvc3RcIik7XG5cdC8vIFx0XHRcdFx0cmV0dXJuO1xuXHQvLyBcdFx0XHR9XG5cblx0Ly8gXHRcdFx0dXNlci5pc1R1cm4gPSB0cnVlO1xuXHQvLyBcdFx0XHRjb21wLmlzVHVybiA9IGZhbHNlO1xuXHQvLyBcdFx0XHR1cGRhdGVUdXJuKHVzZXIuaXNUdXJuKTtcblx0Ly8gXHRcdH0sIDEwMDApO1xuXHQvLyBcdH0pO1xuXHQvLyB9KTtcblxuXHQvLyBcdC8vIFBsYXkgZ2FtZVxuXHQvLyBcdGxldCBnYW1lT3ZlciA9IGZhbHNlO1xuXHQvLyBcdGxldCB3aW5uZXI7XG5cdC8vIFx0bGV0IHR1cm4gPSAwO1xuXHQvLyBcdGxldCB4O1xuXHQvLyBcdGxldCB5O1xuXHQvLyBcdGxldCBpID0gMDtcblx0Ly8gXHR3aGlsZSAoIWdhbWVPdmVyKSB7XG5cdC8vIFx0XHQvLyBkcmF3Qm9hcmQodXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cdC8vIFx0XHQvLyBkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXHQvLyBcdFx0aWYgKHR1cm4gJSAyID09PSAwKSB7XG5cdC8vIFx0XHRcdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Ly8gXHRcdFx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHQvLyBcdFx0XHR1c2VyLmF0dGFjayh4LCB5LCBjb21wKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDoke2l9YCk7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhjb21wLmhhc0xvc3QoKSk7XG5cdC8vIFx0XHRcdGlmIChjb21wLmhhc0xvc3QoKSkge1xuXHQvLyBcdFx0XHRcdGdhbWVPdmVyID0gdHJ1ZTtcblx0Ly8gXHRcdFx0XHR3aW5uZXIgPSB1c2VyO1xuXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coYHVzZXIgYm9hcmQgKGxpbmU6JHtpfSk6YCk7XG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2codXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDogJHtpfWApO1xuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fSBlbHNlIHtcblx0Ly8gXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0Ly8gXHRcdFx0Y29tcC5pc1R1cm4gPSB0cnVlO1xuXHQvLyBcdFx0XHRjb21wLmF0dGFjayh1c2VyKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhgdXNlciBib2FyZDoke2l9YCk7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdC8vIFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHQvLyBcdFx0XHRcdGdhbWVPdmVyID0gdHJ1ZTtcblx0Ly8gXHRcdFx0XHR3aW5uZXIgPSBjb21wO1xuXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coYHVzZXIgYm9hcmQgKGxpbmU6JHtpfSk6YCk7XG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2codXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDogJHtpfWApO1xuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fVxuXHQvLyBcdFx0dHVybiArPSAxO1xuXHQvLyBcdFx0aSArPSAxO1xuXHQvLyBcdH1cblxuXHQvLyBcdGNvbnNvbGUubG9nKGAke3dpbm5lci5uYW1lfSB3aW5zIWApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbGF5R2FtZTtcbiIsImZ1bmN0aW9uIGdhbWVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cblx0ZnVuY3Rpb24gdmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiIHx8IHggPCAwIHx8IHggPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAodHlwZW9mIHkgIT09IFwibnVtYmVyXCIgfHwgeSA8IDAgfHwgeSA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmICh0eXBlb2YgaXNWZXJ0aWNhbCAhPT0gXCJib29sZWFuXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpc1ZlcnRpY2FsIG11c3QgYmUgYSBib29sZWFuXCIpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IHNoaXAubGVuZ3RoIC0gMTtcblx0XHRjb25zdCBtYXhYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgbGVuZ3RoO1xuXHRcdGNvbnN0IG1heFkgPSBpc1ZlcnRpY2FsID8geSArIGxlbmd0aCA6IHk7XG5cblx0XHRpZiAobWF4WCA+IDkgfHwgbWF4WSA+IDkpIHJldHVybiBmYWxzZTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBjaGVja1ggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpO1xuXHRcdFx0Y29uc3QgY2hlY2tZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTtcblx0XHRcdGlmIChib2FyZFtjaGVja1ldW2NoZWNrWF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHRpZiAoIWNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHBsYWNlIHNoaXAgaGVyZVwiKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHBsYWNlWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBwbGFjZVkgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0Ym9hcmRbcGxhY2VZXVtwbGFjZVhdID0gc2hpcDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmIChib2FyZFt5XVt4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRib2FyZFt5XVt4XSA9IFwibWlzc1wiO1xuXHRcdFx0cmV0dXJuIFwibWlzc1wiO1xuXHRcdH1cblx0XHRib2FyZFt5XVt4XS5oaXQoKTtcblx0XHRpZiAoYm9hcmRbeV1beF0uc3VuaykgcmV0dXJuIFwic3Vua1wiO1xuXHRcdHJldHVybiBcImhpdFwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWxsU2hpcHNTdW5rKCkge1xuXHRcdHJldHVybiBib2FyZC5ldmVyeSgocm93KSA9PlxuXHRcdFx0cm93LmV2ZXJ5KFxuXHRcdFx0XHQoY2VsbCkgPT5cblx0XHRcdFx0XHRjZWxsID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRjZWxsID09PSBcIm1pc3NcIiB8fFxuXHRcdFx0XHRcdCh0eXBlb2YgY2VsbCA9PT0gXCJvYmplY3RcIiAmJiBjZWxsLnN1bmspLFxuXHRcdFx0KSxcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgYm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gYm9hcmQ7XG5cdFx0fSxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0YWxsU2hpcHNTdW5rLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJpbXBvcnQgc29sZGllciBmcm9tIFwiLi9pbWcvc29sZGllci5zdmdcIjtcblxuZnVuY3Rpb24gaGVhZGVyKCkge1xuXHRjb25zdCBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXIuY2xhc3NMaXN0LmFkZChcIm5hdi1iYXJcIik7XG5cblx0Ly8gaXRlbXMgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgaGVhZGVyXG5cdGNvbnN0IGxlZnRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0bGVmdEljb24uY2xhc3NMaXN0LmFkZChcImljb25cIik7XG5cdGxlZnRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdGxlZnRJY29uLmFsdCA9IFwic29sZGllclwiO1xuXG5cdC8vIENyZWF0ZSB0aGUgbWVudSBidXR0b25cblx0Y29uc3QgdGl0bGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0aXRsZUJveC5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyXCIpO1xuXHRjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblx0dGl0bGUudGV4dENvbnRlbnQgPSBcIkJhdHRsZXNoaXBcIjtcblx0dGl0bGVCb3guYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdGNvbnN0IHJpZ2h0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0cmlnaHRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdHJpZ2h0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHRiYXIuYXBwZW5kQ2hpbGQobGVmdEljb24pO1xuXHRiYXIuYXBwZW5kQ2hpbGQodGl0bGVCb3gpO1xuXHRiYXIuYXBwZW5kQ2hpbGQocmlnaHRJY29uKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYmFyKTtcbn1cblxuZnVuY3Rpb24gbWFpbkNvbnRlbnQoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRtYWluLmNsYXNzTGlzdC5hZGQoXCJtYWluLWNvbnRlbnRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChtYWluKTtcbn1cblxuZnVuY3Rpb24gdHVybigpIHtcblx0Y29uc3QgdHVybkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5EaXYuY2xhc3NMaXN0LmFkZChcInR1cm4tZGl2XCIpO1xuXHRjb25zdCB0dXJuSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dHVybkluZGljYXRvci5jbGFzc0xpc3QuYWRkKFwidHVybi1pbmRpY2F0b3JcIik7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJZb3VyIFR1cm5cIjtcblx0dHVybkluZGljYXRvci5hcHBlbmRDaGlsZCh0dXJuVGV4dCk7XG5cdHR1cm5EaXYuYXBwZW5kQ2hpbGQodHVybkluZGljYXRvcik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKHR1cm5EaXYpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gcGxheWVyQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJZb3VyIEJvYXJkXCI7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkVGl0bGUpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmJvYXJkXCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gZW5lbXlCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiZW5lbXlcIik7XG5cblx0Y29uc3QgYm9hcmRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblx0Ym9hcmRUaXRsZS50ZXh0Q29udGVudCA9IFwiRW5lbXkgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5mdW5jdGlvbiByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpIHtcblx0bGV0IGJvYXJkR3JpZDtcblx0aWYgKGVuZW15KSB7XG5cdFx0Ym9hcmRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5lbmVteSBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fSBlbHNlIHtcblx0XHRib2FyZEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnBsYXllciBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fVxuXHRyZXR1cm4gYm9hcmRHcmlkO1xufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIGlzRW5lbXkgPSBmYWxzZSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoaXNFbmVteSk7XG5cdGJvYXJkR3JpZC5pbm5lckhUTUwgPSBcIlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFtpXS5sZW5ndGg7IGogKz0gMSkge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnggPSBqO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnkgPSBpO1xuXHRcdFx0aWYgKGJvYXJkW2ldW2pdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcblx0XHRcdH1cblx0XHRcdGJvYXJkR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWlzcyh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xufVxuXG5mdW5jdGlvbiBoaXQoeCwgeSwgZW5lbXkpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGVuZW15KTtcblx0Y29uc3QgY2VsbCA9IGJvYXJkR3JpZC5jaGlsZHJlblt5ICogMTAgKyB4XTtcblx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xufVxuXG5mdW5jdGlvbiBzdW5rKHgsIHksIGVuZW15KSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChlbmVteSk7XG5cdGNvbnN0IGNlbGwgPSBib2FyZEdyaWQuY2hpbGRyZW5beSAqIDEwICsgeF07XG5cdGNlbGwuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKHgsIHksIHJlc3VsdCwgZW5lbXkpIHtcblx0aWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIHtcblx0XHRtaXNzKHgsIHksIGVuZW15KTtcblx0fSBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRoaXQoeCwgeSwgZW5lbXkpO1xuXHR9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzdW5rXCIpIHtcblx0XHRzdW5rKHgsIHksIGVuZW15KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydFBhZ2UoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKTtcblx0bWFpbi5pbm5lckhUTUwgPSBcIlwiO1xuXHR0dXJuKCk7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBzaGlwcyBieSBjbGlja2luZyBvbiB0aGUgYm9hcmQgYmVsb3dcIjtcblxuXHRjb25zdCByb3RhdGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRyb3RhdGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInJvdGF0ZS1jb250YWluZXJcIik7XG5cblx0Y29uc3Qgcm90YXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0cm90YXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtYnV0dG9uXCIpO1xuXHRyb3RhdGVCdXR0b24udGV4dENvbnRlbnQgPSBcIlJvdGF0ZVwiO1xuXHRyb3RhdGVDb250YWluZXIuYXBwZW5kQ2hpbGQocm90YXRlQnV0dG9uKTtcblx0bWFpbi5hcHBlbmRDaGlsZChyb3RhdGVDb250YWluZXIpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0bWFpbi5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcblx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcblx0XHRjZWxsLmRhdGFzZXQueCA9IGkgJSAxMDtcblx0XHRjZWxsLmRhdGFzZXQueSA9IE1hdGguZmxvb3IoaSAvIDEwKTtcblx0XHRib2FyZEdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbG9hZEdhbWUoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKTtcblx0bWFpbi5pbm5lckhUTUwgPSBcIlwiO1xuXHR0dXJuKCk7XG5cdGNyZWF0ZUJvYXJkKCk7XG5cdHBsYXllckJvYXJkKCk7XG5cdGVuZW15Qm9hcmQoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVHVybihpc1R1cm4pIHtcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnR1cm4taW5kaWNhdG9yIHBcIik7XG5cdHR1cm5UZXh0LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcblx0Ly8gQ2hhbmdlIHRleHQgYWZ0ZXIgZmFkZSBvdXRcblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0dHVyblRleHQudGV4dENvbnRlbnQgPSBpc1R1cm4gPyBcIllvdXIgVHVyblwiIDogXCJDb21wdXRlcidzIFR1cm5cIjtcblx0XHQvLyBGYWRlIGluXG5cdFx0dHVyblRleHQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHR9LCA1MDApOyAvLyBUaGlzIHNob3VsZCBtYXRjaCB0aGUgQ1NTIHRyYW5zaXRpb24gdGltZVxufVxuXG5mdW5jdGlvbiBwYWdlKCkge1xuXHRoZWFkZXIoKTtcblx0bWFpbkNvbnRlbnQoKTtcblx0c3RhcnRQYWdlKCk7XG5cdC8vIGxvYWRHYW1lKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhZ2U7XG5leHBvcnQgeyBkcmF3Qm9hcmQsIHVwZGF0ZUJvYXJkLCB1cGRhdGVUdXJuIH07XG4iLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuXG5mdW5jdGlvbiBwbGF5ZXIobmFtZSA9IFwiYW5vbnltb3VzXCIpIHtcblx0Y29uc3QgcGxheWVyQm9hcmQgPSBnYW1lQm9hcmQoKTtcblx0Y29uc3QgaGl0Qm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cdGxldCBpc1R1cm4gPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cmV0dXJuIHBsYXllckJvYXJkLmNhblBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuXHRcdGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwiaGl0XCI7XG5cdFx0fSBlbHNlIGlmIChyZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcInN1bmtcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJtaXNzXCI7XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKGBwbGF5ZXIgaGl0Qm9hcmQ6YCk7XG5cdFx0Y29uc29sZS5sb2coaGl0Qm9hcmQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2socm93LCBjb2wsIGVuZW15KSB7XG5cdFx0cmV0dXJuIGVuZW15LnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gcGxheWVyQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG5hbWUsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdGNhblBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGdldCBpc1R1cm4oKSB7XG5cdFx0XHRyZXR1cm4gaXNUdXJuO1xuXHRcdH0sXG5cdFx0c2V0IGlzVHVybih2YWx1ZSkge1xuXHRcdFx0aXNUdXJuID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQgcGxheWVyQm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gcGxheWVyQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgaGl0Qm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gaGl0Qm9hcmQ7XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiZnVuY3Rpb24gY3JlYXRlU2hpcChsZW5ndGgpIHtcblx0aWYgKHR5cGVvZiBsZW5ndGggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRpZiAobGVuZ3RoIDwgMSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIik7XG5cdGlmIChsZW5ndGggJSAxICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhbiBpbnRlZ2VyXCIpO1xuXHRpZiAobGVuZ3RoID4gNSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgbGVzcyB0aGFuIDZcIik7XG5cblx0bGV0IG51bUhpdHMgPSAwO1xuXHRsZXQgc3VuayA9IGZhbHNlO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0IGxlbmd0aCgpIHtcblx0XHRcdHJldHVybiBsZW5ndGg7XG5cdFx0fSxcblx0XHRnZXQgbnVtSGl0cygpIHtcblx0XHRcdHJldHVybiBudW1IaXRzO1xuXHRcdH0sXG5cdFx0Z2V0IHN1bmsoKSB7XG5cdFx0XHRyZXR1cm4gc3Vuaztcblx0XHR9LFxuXHRcdGhpdCgpIHtcblx0XHRcdG51bUhpdHMgKz0gMTtcblx0XHRcdGlmIChudW1IaXRzID09PSBsZW5ndGgpIHtcblx0XHRcdFx0c3VuayA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5IHtcblx0LS1zaWRlYmFyLWJnLWNvbG9yOiAjMTkyMTFhO1xuXHQtLWNvbnRlbnQtdGV4dC1jb2xvcjogI2RkZGRkZDtcblx0LS10aXRsZS1ib3gtY29sb3I6ICNkZGRkZGQ7XG5cdC0taXRlbS1mb2N1cy1jb2xvcjogIzFmMjkzNztcblx0LS1zZWFyY2gtYm94LWJnLWNvbG9yOiAjMTkyNzM0O1xuXHQtLXNlYXJjaC1pbnB1dC1jb2xvcjogI2RkZGRkZDtcblx0LS1zZWFyY2gtYnRuLWJnLWNvbG9yOiAjMzEzZTRiO1xuXHQtLWxvZ28tY29sb3I6ICNkZGRkZGQ7XG5cdC0tdG9nZ2xlLXN3aXRjaC1iZy1jb2xvcjogIzZiNzU3ZTtcblx0LS10b2dnbGUtc3dpdGNoLWJvcmRlci1jb2xvcjogIzJjYTliYztcblx0LS1mb290ZXItY29sb3I6ICNkZGRkZGQ7XG5cdC0tZm9vdGVyLWFjdGl2ZTogI2ZmZmZmZjtcblx0LS1hZGQtYnRuLWNvbG9yOiAjM2Y1MWI1O1xuXHQtLWFkZC1idG4tYmctY29sb3I6ICM5MGNhZjk7XG5cdC0tZm9ybS1oZWFkZXItY29sb3I6ICNkZGRkZGQ7XG5cdC0tZm9ybS1zY3JvbGwtYm94LWJnLWNvbG9yOiAjOWU5ZTllMjE7XG5cdC0tdG9kby1pdGVtLWJnLWNvbG9yOiAjMTkyNzM0O1xuXHQtLXRvZG8taXRlbS1ob3Zlci1jb2xvcjogIzJkM2Q0ZDtcblx0LS1iYWNrLWJ0bi1jb2xvcjogIzNmNTFiNTtcblx0LS1mb3JtLWlucHV0LWNvbG9yOiAjMTkyNzM0O1xuXHQtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcblx0LS1ub3RlLWNvbG9yOiAjZmZmZmZmO1xuXHQtLW5vdGUtaGVhZGVyOiAjOTBjYWY5O1xuXHQtLW5vdGUtb3V0LW9mLWZvY3VzOiAjZGRkZGRkO1xuXHQtLWhpZ2hsaWdodDogIzUzNjllNTtcblx0LS1yZWQ6ICNjODE0MTQ7XG5cdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XG5cdG1hcmdpbjogMDtcblx0cGFkZGluZzogMDtcblx0Zm9udC1mYW1pbHk6XG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcblx0Y29sb3I6ICNkZGRkZGQ7XG59XG5cbmRpdiNjb250ZW50IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcblx0aGVpZ2h0OiAxMDB2aDtcbn1cblxuLm5hdi1iYXIge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaWRlYmFyLWJnLWNvbG9yKTtcblx0ZGlzcGxheTogZmxleDtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogNXJlbTtcblx0cGFkZGluZzogMCAxcmVtO1xuXHRwYWRkaW5nLXRvcDogMC4yNXJlbTtcbn1cblxuLm1haW4tY29udGVudCB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRnYXA6IDFyZW07XG5cdHBhZGRpbmc6IDAgMXJlbTtcbn1cblxuLmhlYWRlciBoMSB7XG5cdHRleHQtYWxpZ246IGNlbnRlcjsgLyogQ2VudGVyIHRoZSBoZWFkZXIgdGV4dCAqL1xuXHRmb250LWZhbWlseTogXCJBcmlhbFwiLCBzYW5zLXNlcmlmOyAvKiBVc2UgYSBtb2Rlcm4sIGNsZWFuIGZvbnQgKi9cblx0Zm9udC1zaXplOiA0OHB4OyAvKiBTZXQgYSBsYXJnZSBmb250IHNpemUgZm9yIGltcGFjdCAqL1xuXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBXaGl0ZSBjb2xvciBmb3IgdGhlIHRleHQgZm9yIGJldHRlciBjb250cmFzdCAqL1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMTkyMTFhOyAvKiBOYXZ5IGJsdWUgYmFja2dyb3VuZCAqL1xuXHRwYWRkaW5nOiAyMHB4OyAvKiBBZGQgc29tZSBwYWRkaW5nIGFyb3VuZCB0aGUgdGV4dCAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cblx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cblx0bWFyZ2luOiAwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cblx0dGV4dC1zaGFkb3c6IDJweCAycHggMnB4ICM3MzczNzM7XG59XG5cbi5oZWFkZXIgaDE6aG92ZXIge1xuXHRjb2xvcjogIzg0OTE3NzsgLyogQ2hhbmdlIHRleHQgY29sb3Igb24gaG92ZXIgKi9cblx0Y3Vyc29yOiBwb2ludGVyOyAvKiBDaGFuZ2UgdGhlIGN1cnNvciB0byBpbmRpY2F0ZSBpdCdzIGNsaWNrYWJsZSAqL1xufVxuXG4uaWNvbiB7XG5cdHdpZHRoOiA2cmVtO1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi50dXJuLWluZGljYXRvciB7XG5cdHdpZHRoOiA2MCU7XG5cdGhlaWdodDogMTAwJTtcblx0Ym9yZGVyLXJhZGl1czogMXJlbTtcblx0LyogYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjg3OyAqL1xuXHRwYWRkaW5nOiAwLjVyZW07XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcblx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xuXHRiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudChcblx0XHQtNDVkZWcsXG5cdFx0I2NkY2FjYTg3IDAlLFxuXHRcdCNmZmZmZmY4NyA1MCUsXG5cdFx0I2NkY2RjZGE2IDEwMCVcblx0KTtcblx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXG5cdFx0LTQ1ZGVnLFxuXHRcdCNjZGNhY2E4NyAwJSxcblx0XHQjZmZmZmZmODcgNTAlLFxuXHRcdCNjZGNkY2RhNiAxMDAlXG5cdCk7XG5cdGJveC1zaGFkb3c6IDBweCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbn1cbi50dXJuLWluZGljYXRvciBwIHtcblx0Zm9udC1zaXplOiAxLjVyZW07XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjb2xvcjogIzE5MjExYTtcblx0Zm9udC1mYW1pbHk6IFwiQXJpYWxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXG5cdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xuXHRsZXR0ZXItc3BhY2luZzogMnB4OyAvKiBJbmNyZWFzZSBzcGFjaW5nIGJldHdlZW4gbGV0dGVycyAqL1xuXHRtYXJnaW4tYm90dG9tOiAzMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXG5cdHRleHQtc2hhZG93OiA0cHggM3B4IDBweCAjNjU3MTU5NzM7XG5cdG1hcmdpbjogMDtcblx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0O1xuXHRvcGFjaXR5OiAxOyAvKiBTdGFydCBmdWxseSB2aXNpYmxlICovXG59XG5cbi5yb3RhdGUtY29udGFpbmVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5yb3RhdGUtYnV0dG9uIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzUwNjA1Mjtcblx0Y29sb3I6ICNjMWMxYzFkNjtcblx0Ym9yZGVyOiAycHggc29saWQgIzkyOTM5Mjtcblx0cGFkZGluZzogMTBweCAyMHB4O1xuXHRib3JkZXItcmFkaXVzOiA1cHg7XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjdXJzb3I6IHBvaW50ZXI7XG5cdHRyYW5zaXRpb246XG5cdFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcblx0XHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcbn1cblxuLnJvdGF0ZS1idXR0b246aG92ZXIge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMmM3MjM1OyAvKiBCYWNrZ3JvdW5kIGNvbG9yIG9uIGhvdmVyICovXG5cdGNvbG9yOiAjZmZmZmZmODc7IC8qIFRleHQgY29sb3Igb24gaG92ZXIgKi9cbn1cblxuLmJvYXJkIHtcblx0ZGlzcGxheTogZ3JpZDtcblx0Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcblx0Z2FwOiAxcmVtO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5jZWxsLmhpZ2hsaWdodCB7XG5cdGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Ymx1ZTtcbn1cblxuLmNlbGwuYmxvY2tlZCB7XG5cdGJhY2tncm91bmQtY29sb3I6IHJlZDsgLyogQ29sb3IgaW5kaWNhdGluZyBpbnZhbGlkIHBsYWNlbWVudCAqL1xuXHRjdXJzb3I6IG5vdC1hbGxvd2VkOyAvKiBCbG9ja2VkIGN1cnNvciAqL1xufVxuXG4uYm9hcmQgaDIge1xuXHRtYXJnaW46IDA7XG59XG5cbi50dXJuLWRpdiB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG5kaXYuYm9hcmQtZ3JpZCB7XG5cdGRpc3BsYXk6IGdyaWQ7XG5cdGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgxMCwgMi41dncpIC8gcmVwZWF0KDEwLCAyLjV2dyk7XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcblx0Z2FwOiAycHg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuZGl2LmJvYXJkLWdyaWQgLmNlbGwge1xuXHRib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcblx0aGVpZ2h0OiAxMDAlO1xuXHR3aWR0aDogMTAwJTtcblx0dHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAwcztcbn1cblxuLmVuZW15LFxuLnBsYXllciB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDFyZW07XG59XG5cbi5zaGlwIHtcblx0YmFja2dyb3VuZC1jb2xvcjogYXF1YTtcbn1cblxuLm1pc3Mge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwODc7XG59XG5cbi5oaXQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMDBmZjFlODc7XG59XG5cbi5zdW5rIHtcblx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDBlZTg3O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0NBQ0MsMkJBQTJCO0NBQzNCLDZCQUE2QjtDQUM3QiwwQkFBMEI7Q0FDMUIsMkJBQTJCO0NBQzNCLDhCQUE4QjtDQUM5Qiw2QkFBNkI7Q0FDN0IsOEJBQThCO0NBQzlCLHFCQUFxQjtDQUNyQixpQ0FBaUM7Q0FDakMscUNBQXFDO0NBQ3JDLHVCQUF1QjtDQUN2Qix3QkFBd0I7Q0FDeEIsd0JBQXdCO0NBQ3hCLDJCQUEyQjtDQUMzQiw0QkFBNEI7Q0FDNUIscUNBQXFDO0NBQ3JDLDZCQUE2QjtDQUM3QixnQ0FBZ0M7Q0FDaEMseUJBQXlCO0NBQ3pCLDJCQUEyQjtDQUMzQix1QkFBdUI7Q0FDdkIscUJBQXFCO0NBQ3JCLHNCQUFzQjtDQUN0Qiw0QkFBNEI7Q0FDNUIsb0JBQW9CO0NBQ3BCLGNBQWM7Q0FDZCx5QkFBeUI7Q0FDekIsU0FBUztDQUNULFVBQVU7Q0FDVjs7Ozs7Ozs7Ozs7WUFXVztDQUNYLGNBQWM7QUFDZjs7QUFFQTtDQUNDLGFBQWE7Q0FDYixzQkFBc0I7Q0FDdEIsMkJBQTJCO0NBQzNCLG9CQUFvQjtDQUNwQixhQUFhO0FBQ2Q7O0FBRUE7Q0FDQyx5Q0FBeUM7Q0FDekMsYUFBYTtDQUNiLHVCQUF1QjtDQUN2QixtQkFBbUI7Q0FDbkIsU0FBUztDQUNULGVBQWU7Q0FDZixvQkFBb0I7QUFDckI7O0FBRUE7Q0FDQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLHVCQUF1QjtDQUN2QixTQUFTO0NBQ1QsZUFBZTtBQUNoQjs7QUFFQTtDQUNDLGtCQUFrQixFQUFFLDJCQUEyQjtDQUMvQyxnQ0FBZ0MsRUFBRSw2QkFBNkI7Q0FDL0QsZUFBZSxFQUFFLHFDQUFxQztDQUN0RCxnQkFBZ0IsRUFBRSxpREFBaUQ7Q0FDbkUseUJBQXlCLEVBQUUseUJBQXlCO0NBQ3BELGFBQWEsRUFBRSxxQ0FBcUM7Q0FDcEQseUJBQXlCLEVBQUUsK0NBQStDO0NBQzFFLG1CQUFtQixFQUFFLHFDQUFxQztDQUMxRCxXQUFXLEVBQUUsb0NBQW9DO0NBQ2pELGdDQUFnQztBQUNqQzs7QUFFQTtDQUNDLGNBQWMsRUFBRSwrQkFBK0I7Q0FDL0MsZUFBZSxFQUFFLGlEQUFpRDtBQUNuRTs7QUFFQTtDQUNDLFdBQVc7Q0FDWCxZQUFZO0FBQ2I7O0FBRUE7Q0FDQyxVQUFVO0NBQ1YsWUFBWTtDQUNaLG1CQUFtQjtDQUNuQixpQ0FBaUM7Q0FDakMsZUFBZTtDQUNmLGtCQUFrQjtDQUNsQixxQkFBcUI7Q0FDckI7Ozs7O0VBS0M7Q0FDRDs7Ozs7RUFLQztDQUNELDBDQUEwQztBQUMzQztBQUNBO0NBQ0MsaUJBQWlCO0NBQ2pCLGlCQUFpQjtDQUNqQixjQUFjO0NBQ2QsZ0NBQWdDLEVBQUUsNkJBQTZCO0NBQy9ELHlCQUF5QixFQUFFLCtDQUErQztDQUMxRSxtQkFBbUIsRUFBRSxxQ0FBcUM7Q0FDMUQsbUJBQW1CLEVBQUUsb0NBQW9DO0NBQ3pELGtDQUFrQztDQUNsQyxTQUFTO0NBQ1Qsb0NBQW9DO0NBQ3BDLFVBQVUsRUFBRSx3QkFBd0I7QUFDckM7O0FBRUE7Q0FDQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLHVCQUF1QjtDQUN2QixtQkFBbUI7QUFDcEI7O0FBRUE7Q0FDQyx5QkFBeUI7Q0FDekIsZ0JBQWdCO0NBQ2hCLHlCQUF5QjtDQUN6QixrQkFBa0I7Q0FDbEIsa0JBQWtCO0NBQ2xCLGlCQUFpQjtDQUNqQixlQUFlO0NBQ2Y7OzRCQUUyQjtBQUM1Qjs7QUFFQTtDQUNDLHlCQUF5QixFQUFFLDhCQUE4QjtDQUN6RCxnQkFBZ0IsRUFBRSx3QkFBd0I7QUFDM0M7O0FBRUE7Q0FDQyxhQUFhO0NBQ2IscUNBQXFDO0NBQ3JDLFNBQVM7Q0FDVCxtQkFBbUI7Q0FDbkIscUJBQXFCO0NBQ3JCLHVCQUF1QjtDQUN2QixxQkFBcUI7QUFDdEI7O0FBRUE7Q0FDQywyQkFBMkI7QUFDNUI7O0FBRUE7Q0FDQyxxQkFBcUIsRUFBRSx1Q0FBdUM7Q0FDOUQsbUJBQW1CLEVBQUUsbUJBQW1CO0FBQ3pDOztBQUVBO0NBQ0MsU0FBUztBQUNWOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qix1QkFBdUI7Q0FDdkIsbUJBQW1CO0FBQ3BCOztBQUVBO0NBQ0MsYUFBYTtDQUNiLG9EQUFvRDtDQUNwRCxrQkFBa0I7Q0FDbEIsUUFBUTtDQUNSLG1CQUFtQjtDQUNuQixxQkFBcUI7Q0FDckIsdUJBQXVCO0NBQ3ZCLHFCQUFxQjtBQUN0Qjs7QUFFQTtDQUNDLHVCQUF1QjtDQUN2QixZQUFZO0NBQ1osV0FBVztDQUNYLDRCQUE0QjtBQUM3Qjs7QUFFQTs7Q0FFQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLHVCQUF1QjtDQUN2QixtQkFBbUI7Q0FDbkIsU0FBUztBQUNWOztBQUVBO0NBQ0Msc0JBQXNCO0FBQ3ZCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHkge1xcblxcdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcXG5cXHQtLWNvbnRlbnQtdGV4dC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLXRpdGxlLWJveC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWl0ZW0tZm9jdXMtY29sb3I6ICMxZjI5Mzc7XFxuXFx0LS1zZWFyY2gtYm94LWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tc2VhcmNoLWlucHV0LWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tc2VhcmNoLWJ0bi1iZy1jb2xvcjogIzMxM2U0YjtcXG5cXHQtLWxvZ28tY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS10b2dnbGUtc3dpdGNoLWJnLWNvbG9yOiAjNmI3NTdlO1xcblxcdC0tdG9nZ2xlLXN3aXRjaC1ib3JkZXItY29sb3I6ICMyY2E5YmM7XFxuXFx0LS1mb290ZXItY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS1mb290ZXItYWN0aXZlOiAjZmZmZmZmO1xcblxcdC0tYWRkLWJ0bi1jb2xvcjogIzNmNTFiNTtcXG5cXHQtLWFkZC1idG4tYmctY29sb3I6ICM5MGNhZjk7XFxuXFx0LS1mb3JtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWZvcm0tc2Nyb2xsLWJveC1iZy1jb2xvcjogIzllOWU5ZTIxO1xcblxcdC0tdG9kby1pdGVtLWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tdG9kby1pdGVtLWhvdmVyLWNvbG9yOiAjMmQzZDRkO1xcblxcdC0tYmFjay1idG4tY29sb3I6ICMzZjUxYjU7XFxuXFx0LS1mb3JtLWlucHV0LWNvbG9yOiAjMTkyNzM0O1xcblxcdC0taGVhZGVyLWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tbm90ZS1jb2xvcjogI2ZmZmZmZjtcXG5cXHQtLW5vdGUtaGVhZGVyOiAjOTBjYWY5O1xcblxcdC0tbm90ZS1vdXQtb2YtZm9jdXM6ICNkZGRkZGQ7XFxuXFx0LS1oaWdobGlnaHQ6ICM1MzY5ZTU7XFxuXFx0LS1yZWQ6ICNjODE0MTQ7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcbn1cXG5cXG5kaXYjY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG5cXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcXG5cXHRoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4ubmF2LWJhciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogNXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxuXFx0cGFkZGluZy10b3A6IDAuMjVyZW07XFxufVxcblxcbi5tYWluLWNvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0cGFkZGluZzogMCAxcmVtO1xcbn1cXG5cXG4uaGVhZGVyIGgxIHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7IC8qIENlbnRlciB0aGUgaGVhZGVyIHRleHQgKi9cXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0Zm9udC1zaXplOiA0OHB4OyAvKiBTZXQgYSBsYXJnZSBmb250IHNpemUgZm9yIGltcGFjdCAqL1xcblxcdGNvbG9yOiAjZmZmZmZmODc7IC8qIFdoaXRlIGNvbG9yIGZvciB0aGUgdGV4dCBmb3IgYmV0dGVyIGNvbnRyYXN0ICovXFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTsgLyogTmF2eSBibHVlIGJhY2tncm91bmQgKi9cXG5cXHRwYWRkaW5nOiAyMHB4OyAvKiBBZGQgc29tZSBwYWRkaW5nIGFyb3VuZCB0aGUgdGV4dCAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXFxuXFx0bWFyZ2luOiAwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cXG5cXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3MztcXG59XFxuXFxuLmhlYWRlciBoMTpob3ZlciB7XFxuXFx0Y29sb3I6ICM4NDkxNzc7IC8qIENoYW5nZSB0ZXh0IGNvbG9yIG9uIGhvdmVyICovXFxuXFx0Y3Vyc29yOiBwb2ludGVyOyAvKiBDaGFuZ2UgdGhlIGN1cnNvciB0byBpbmRpY2F0ZSBpdCdzIGNsaWNrYWJsZSAqL1xcbn1cXG5cXG4uaWNvbiB7XFxuXFx0d2lkdGg6IDZyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4udHVybi1pbmRpY2F0b3Ige1xcblxcdHdpZHRoOiA2MCU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdGJvcmRlci1yYWRpdXM6IDFyZW07XFxuXFx0LyogYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjg3OyAqL1xcblxcdHBhZGRpbmc6IDAuNXJlbTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xcblxcdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxcblxcdFxcdC00NWRlZyxcXG5cXHRcXHQjY2RjYWNhODcgMCUsXFxuXFx0XFx0I2ZmZmZmZjg3IDUwJSxcXG5cXHRcXHQjY2RjZGNkYTYgMTAwJVxcblxcdCk7XFxuXFx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxufVxcbi50dXJuLWluZGljYXRvciBwIHtcXG5cXHRmb250LXNpemU6IDEuNXJlbTtcXG5cXHRmb250LXdlaWdodDogYm9sZDtcXG5cXHRjb2xvcjogIzE5MjExYTtcXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cXG5cXHRtYXJnaW4tYm90dG9tOiAzMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXFxuXFx0dGV4dC1zaGFkb3c6IDRweCAzcHggMHB4ICM2NTcxNTk3MztcXG5cXHRtYXJnaW46IDA7XFxuXFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0O1xcblxcdG9wYWNpdHk6IDE7IC8qIFN0YXJ0IGZ1bGx5IHZpc2libGUgKi9cXG59XFxuXFxuLnJvdGF0ZS1jb250YWluZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ucm90YXRlLWJ1dHRvbiB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzUwNjA1MjtcXG5cXHRjb2xvcjogI2MxYzFjMWQ2O1xcblxcdGJvcmRlcjogMnB4IHNvbGlkICM5MjkzOTI7XFxuXFx0cGFkZGluZzogMTBweCAyMHB4O1xcblxcdGJvcmRlci1yYWRpdXM6IDVweDtcXG5cXHRmb250LXdlaWdodDogYm9sZDtcXG5cXHRjdXJzb3I6IHBvaW50ZXI7XFxuXFx0dHJhbnNpdGlvbjpcXG5cXHRcXHR0cmFuc2Zvcm0gMC4zcyBlYXNlLFxcblxcdFxcdGJhY2tncm91bmQtY29sb3IgMC4zcyBlYXNlO1xcbn1cXG5cXG4ucm90YXRlLWJ1dHRvbjpob3ZlciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTsgLyogQmFja2dyb3VuZCBjb2xvciBvbiBob3ZlciAqL1xcblxcdGNvbG9yOiAjZmZmZmZmODc7IC8qIFRleHQgY29sb3Igb24gaG92ZXIgKi9cXG59XFxuXFxuLmJvYXJkIHtcXG5cXHRkaXNwbGF5OiBncmlkO1xcblxcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmNlbGwuaGlnaGxpZ2h0IHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxufVxcblxcbi5jZWxsLmJsb2NrZWQge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHJlZDsgLyogQ29sb3IgaW5kaWNhdGluZyBpbnZhbGlkIHBsYWNlbWVudCAqL1xcblxcdGN1cnNvcjogbm90LWFsbG93ZWQ7IC8qIEJsb2NrZWQgY3Vyc29yICovXFxufVxcblxcbi5ib2FyZCBoMiB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4udHVybi1kaXYge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCB7XFxuXFx0ZGlzcGxheTogZ3JpZDtcXG5cXHRncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDIuNXZ3KSAvIHJlcGVhdCgxMCwgMi41dncpO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRnYXA6IDJweDtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIC5jZWxsIHtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0d2lkdGg6IDEwMCU7XFxuXFx0dHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAwcztcXG59XFxuXFxuLmVuZW15LFxcbi5wbGF5ZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogMXJlbTtcXG59XFxuXFxuLnNoaXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5taXNzIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwODc7XFxufVxcblxcbi5oaXQge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMwMGZmMWU4NztcXG59XFxuXFxuLnN1bmsge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICNmZjAwZWU4NztcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmJvZHkge1xuXHRtYXJnaW46IDA7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBcXGBtYWluXFxgIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICovXG5cbm1haW4ge1xuXHRkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBcXGBoMVxcYCBlbGVtZW50cyB3aXRoaW4gXFxgc2VjdGlvblxcYCBhbmRcbiAqIFxcYGFydGljbGVcXGAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICovXG5cbmgxIHtcblx0Zm9udC1zaXplOiAyZW07XG5cdG1hcmdpbjogMC42N2VtIDA7XG59XG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5cbmhyIHtcblx0Ym94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cblx0aGVpZ2h0OiAwOyAvKiAxICovXG5cdG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxucHJlIHtcblx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG5cdGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5hIHtcblx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gKi9cblxuYWJiclt0aXRsZV0ge1xuXHRib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYixcbnN0cm9uZyB7XG5cdGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG5cdGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViLFxuc3VwIHtcblx0Zm9udC1zaXplOiA3NSU7XG5cdGxpbmUtaGVpZ2h0OiAwO1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcblx0Ym90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuXHR0b3A6IC0wLjVlbTtcbn1cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmltZyB7XG5cdGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyogRm9ybXNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxMDAlOyAvKiAxICovXG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG5cdC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uLFxuc2VsZWN0IHtcblx0LyogMSAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG5cdGJvcmRlci1zdHlsZTogbm9uZTtcblx0cGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmZpZWxkc2V0IHtcblx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmxlZ2VuZCB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cblx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cblx0ZGlzcGxheTogdGFibGU7IC8qIDEgKi9cblx0bWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXG5cdHBhZGRpbmc6IDA7IC8qIDMgKi9cblx0d2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxudGV4dGFyZWEge1xuXHRvdmVyZmxvdzogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5bdHlwZT1cImNoZWNrYm94XCJdLFxuW3R5cGU9XCJyYWRpb1wiXSB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcblx0aGVpZ2h0OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xuXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiAqL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cblx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuZGV0YWlscyB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1bW1hcnkge1xuXHRkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbnRlbXBsYXRlIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAqL1xuXG5baGlkZGVuXSB7XG5cdGRpc3BsYXk6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0NBQ0MsaUJBQWlCLEVBQUUsTUFBTTtDQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3ZDOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxTQUFTO0FBQ1Y7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsY0FBYztDQUNkLGdCQUFnQjtBQUNqQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtDQUNDLHVCQUF1QixFQUFFLE1BQU07Q0FDL0IsU0FBUyxFQUFFLE1BQU07Q0FDakIsaUJBQWlCLEVBQUUsTUFBTTtBQUMxQjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxpQ0FBaUMsRUFBRSxNQUFNO0NBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyw2QkFBNkI7QUFDOUI7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsbUJBQW1CLEVBQUUsTUFBTTtDQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0NBQ2xDLGlDQUFpQyxFQUFFLE1BQU07QUFDMUM7O0FBRUE7O0VBRUU7O0FBRUY7O0NBRUMsbUJBQW1CO0FBQ3BCOztBQUVBOzs7RUFHRTs7QUFFRjs7O0NBR0MsaUNBQWlDLEVBQUUsTUFBTTtDQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsY0FBYztDQUNkLGNBQWM7Q0FDZCxrQkFBa0I7Q0FDbEIsd0JBQXdCO0FBQ3pCOztBQUVBO0NBQ0MsZUFBZTtBQUNoQjs7QUFFQTtDQUNDLFdBQVc7QUFDWjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0Msa0JBQWtCO0FBQ25COztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGOzs7OztDQUtDLG9CQUFvQixFQUFFLE1BQU07Q0FDNUIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsaUJBQWlCLEVBQUUsTUFBTTtDQUN6QixTQUFTLEVBQUUsTUFBTTtBQUNsQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsTUFBTTtDQUNOLGlCQUFpQjtBQUNsQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsTUFBTTtDQUNOLG9CQUFvQjtBQUNyQjs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLDBCQUEwQjtBQUMzQjs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLGtCQUFrQjtDQUNsQixVQUFVO0FBQ1g7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7Q0FJQyw4QkFBOEI7QUFDL0I7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyw4QkFBOEI7QUFDL0I7O0FBRUE7Ozs7O0VBS0U7O0FBRUY7Q0FDQyxzQkFBc0IsRUFBRSxNQUFNO0NBQzlCLGNBQWMsRUFBRSxNQUFNO0NBQ3RCLGNBQWMsRUFBRSxNQUFNO0NBQ3RCLGVBQWUsRUFBRSxNQUFNO0NBQ3ZCLFVBQVUsRUFBRSxNQUFNO0NBQ2xCLG1CQUFtQixFQUFFLE1BQU07QUFDNUI7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyx3QkFBd0I7QUFDekI7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7OztFQUdFOztBQUVGOztDQUVDLHNCQUFzQixFQUFFLE1BQU07Q0FDOUIsVUFBVSxFQUFFLE1BQU07QUFDbkI7O0FBRUE7O0VBRUU7O0FBRUY7O0NBRUMsWUFBWTtBQUNiOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLDZCQUE2QixFQUFFLE1BQU07Q0FDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQywwQkFBMEIsRUFBRSxNQUFNO0NBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3RCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGFBQWE7QUFDZDs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGFBQWE7QUFDZFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmJvZHkge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICovXFxuXFxubWFpbiB7XFxuXFx0ZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmgxIHtcXG5cXHRmb250LXNpemU6IDJlbTtcXG5cXHRtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG5cXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcblxcdGhlaWdodDogMDsgLyogMSAqL1xcblxcdG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuXFx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5hIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG5cXHRib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuXFx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc21hbGwge1xcblxcdGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuXFx0Zm9udC1zaXplOiA3NSU7XFxuXFx0bGluZS1oZWlnaHQ6IDA7XFxuXFx0cG9zaXRpb246IHJlbGF0aXZlO1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG5cXHRib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuXFx0dG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuaW1nIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuXFx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7XFxuXFx0LyogMSAqL1xcblxcdG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7XFxuXFx0LyogMSAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuXFx0Ym9yZGVyLXN0eWxlOiBub25lO1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuXFx0b3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcblxcdHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuXFx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcblxcdGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuXFx0ZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG5cXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAzICovXFxuXFx0d2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAqL1xcblxcbnByb2dyZXNzIHtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG5cXHRvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAqL1xcblxcblt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcblt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0cGFkZGluZzogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuXFx0b3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcblxcdGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5cXG5kZXRhaWxzIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3VtbWFyeSB7XFxuXFx0ZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBNaXNjXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICovXFxuXFxudGVtcGxhdGUge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAqL1xcblxcbltoaWRkZW5dIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgcGxheUdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuaW1wb3J0IHBhZ2UgZnJvbSBcIi4vZ2FtZVVJXCI7XG5pbXBvcnQgXCIuL2Nzcy9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgXCIuL2Nzcy9nYW1lLmNzc1wiO1xuXG5wYWdlKCk7XG5wbGF5R2FtZSgpO1xuXG4vLyBpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuLy8gaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG4vLyBsZXQgYm9hcmQ7XG4vLyBsZXQgc2hpcDtcblxuLy8gYm9hcmQgPSBnYW1lQm9hcmQoKTtcbi8vIHNoaXAgPSBjcmVhdGVTaGlwKDMpO1xuXG4vLyBjb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG4vLyAvLyBib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMywgZmFsc2UpO1xuLy8gY29uc29sZS5sb2coYHZlcnRpY2FsYCk7XG4vLyBib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMCwgdHJ1ZSk7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDEpO1xuLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAyKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMyk7XG4vLyBjb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG5cbi8vIC8vIGJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAwLCBmYWxzZSk7XG4vLyAvLyBjb25zb2xlLmxvZyhib2FyZC5ib2FyZCk7XG4vLyAvLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDApO1xuLy8gLy8gY29uc29sZS5sb2coc2hpcCk7XG4vLyAvLyBib2FyZC5yZWNlaXZlQXR0YWNrKDEsIDApO1xuLy8gLy8gY29uc29sZS5sb2coc2hpcCk7XG4vLyAvLyBib2FyZC5yZWNlaXZlQXR0YWNrKDIsIDApO1xuLy8gLy8gY29uc29sZS5sb2coc2hpcCk7XG4iXSwibmFtZXMiOlsiZ2FtZUJvYXJkIiwiY3JlYXRlU2hpcCIsImNvbXB1dGVyIiwiY29tcEJvYXJkIiwibGFzdEhpdCIsInRhcmdldE1vZGUiLCJhdHRhY2tPcHRpb25zIiwiaXNUdXJuIiwicmFuZG9tQXR0YWNrIiwiZW5lbXkiLCJ4IiwieSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImhpdEJvYXJkIiwidW5kZWZpbmVkIiwicGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkiLCJzaGlwcyIsImZvckVhY2giLCJsZW5ndGgiLCJ2ZXJ0aWNhbCIsInNoaXAiLCJjYW5QbGFjZVNoaXAiLCJwbGFjZVNoaXAiLCJ0YXJnZXRBdHRhY2siLCJkaXJlY3Rpb25zIiwiZGlyIiwibmV3WCIsIm5ld1kiLCJwdXNoIiwic2hpZnQiLCJjaG9vc2VBdHRhY2siLCJhdHRhY2siLCJwbGF5ZXIiLCJfY2hvb3NlQXR0YWNrIiwiY29uc29sZSIsImxvZyIsImNvbmNhdCIsImF0dGFja1Jlc3VsdCIsInJlY2VpdmVBdHRhY2siLCJoYXNMb3N0IiwiYWxsU2hpcHNTdW5rIiwidmFsdWUiLCJkcmF3Qm9hcmQiLCJ1cGRhdGVCb2FyZCIsInVwZGF0ZVR1cm4iLCJwbGF5R2FtZSIsImdhbWVBY3RpdmUiLCJ1c2VyIiwiY29tcCIsImdyaWRDZWxscyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJvdGF0ZUJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJzZWxlY3RlZFNoaXBTaXplIiwiaXNIb3Jpem9udGFsIiwiaGlnaGxpZ2h0Q2VsbHMiLCJlIiwic3RhcnRYIiwicGFyc2VJbnQiLCJ0YXJnZXQiLCJkYXRhc2V0Iiwic3RhcnRZIiwiaXNQbGFjZW1lbnRWYWxpZCIsImkiLCJjZWxsIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlSGlnaGxpZ2h0IiwicmVtb3ZlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvYXJkIiwiQXJyYXkiLCJmcm9tIiwidmFsaWRhdGVDb29yZGluYXRlcyIsIkVycm9yIiwiaXNWZXJ0aWNhbCIsIm1heFgiLCJtYXhZIiwiY2hlY2tYIiwiY2hlY2tZIiwicGxhY2VYIiwicGxhY2VZIiwiaGl0Iiwic3VuayIsImV2ZXJ5Iiwicm93IiwiX3R5cGVvZiIsInNvbGRpZXIiLCJoZWFkZXIiLCJiYXIiLCJjcmVhdGVFbGVtZW50IiwibGVmdEljb24iLCJzcmMiLCJhbHQiLCJ0aXRsZUJveCIsInRpdGxlIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJpZ2h0SWNvbiIsIm1haW5Db250ZW50IiwibWFpbiIsInR1cm4iLCJ0dXJuRGl2IiwidHVybkluZGljYXRvciIsInR1cm5UZXh0IiwiY3JlYXRlQm9hcmQiLCJwbGF5ZXJCb2FyZCIsImJvYXJkVGl0bGUiLCJib2FyZEdyaWQiLCJlbmVteUJvYXJkIiwicmV0dXJuQm9hcmRHcmlkIiwiaXNFbmVteSIsImFyZ3VtZW50cyIsImlubmVySFRNTCIsImoiLCJtaXNzIiwiY2hpbGRyZW4iLCJyZXN1bHQiLCJzdGFydFBhZ2UiLCJyb3RhdGVDb250YWluZXIiLCJsb2FkR2FtZSIsInN0eWxlIiwib3BhY2l0eSIsInNldFRpbWVvdXQiLCJwYWdlIiwibmFtZSIsImNvbCIsIm51bUhpdHMiXSwic291cmNlUm9vdCI6IiJ9