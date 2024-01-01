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

  // Place ships
  user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(5), 0, 0, false);
  user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(4), 0, 1, false);
  user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), 0, 2, false);
  user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), 0, 3, false);
  user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(2), 0, 4, false);
  console.log("user board:");
  console.log(user.playerBoard.board);
  comp.placeShipsAutomatically();
  console.log("comp board:");
  console.log(comp.compBoard.board);
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.drawBoard)(user.playerBoard.board);
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.drawBoard)(comp.compBoard.board, true);
  user.isTurn = true;
  comp.isTurn = false;
  var cells = document.querySelectorAll(".enemy .cell");
  cells.forEach(function (cell) {
    cell.addEventListener("click", function (e) {
      if (!gameActive || !user.isTurn) return;
      if (e.target.classList.contains("hit") || e.target.classList.contains("miss")) return;
      var x = e.target.dataset.x;
      var y = e.target.dataset.y;
      var xInt = parseInt(x, 10);
      var yInt = parseInt(y, 10);
      var result = user.attack(xInt, yInt, comp);
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(xInt, yInt, result, true);
      if (comp.hasLost()) {
        console.log("comp has lost");
        gameActive = false;
        return;
      }
      user.isTurn = false;
      comp.isTurn = true;
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn);
      // debugger;

      setTimeout(function () {
        var _comp$attack = comp.attack(user),
          compX = _comp$attack.x,
          compY = _comp$attack.y,
          compResult = _comp$attack.attackResult;
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(compX, compY, compResult, false);
        if (user.hasLost()) {
          gameActive = false;
          console.log("user has lost");
          return;
        }
        user.isTurn = true;
        comp.isTurn = false;
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn);
      }, 1000);
    });
  });

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
function loadGame() {
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
  loadGame();
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

.board {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	align-items: center;
	justify-items: center;
	justify-content: center;
	align-content: center;
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
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"AAAA;CACC,2BAA2B;CAC3B,6BAA6B;CAC7B,0BAA0B;CAC1B,2BAA2B;CAC3B,8BAA8B;CAC9B,6BAA6B;CAC7B,8BAA8B;CAC9B,qBAAqB;CACrB,iCAAiC;CACjC,qCAAqC;CACrC,uBAAuB;CACvB,wBAAwB;CACxB,wBAAwB;CACxB,2BAA2B;CAC3B,4BAA4B;CAC5B,qCAAqC;CACrC,6BAA6B;CAC7B,gCAAgC;CAChC,yBAAyB;CACzB,2BAA2B;CAC3B,uBAAuB;CACvB,qBAAqB;CACrB,sBAAsB;CACtB,4BAA4B;CAC5B,oBAAoB;CACpB,cAAc;CACd,yBAAyB;CACzB,SAAS;CACT,UAAU;CACV;;;;;;;;;;;YAWW;CACX,cAAc;AACf;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,2BAA2B;CAC3B,oBAAoB;CACpB,aAAa;AACd;;AAEA;CACC,yCAAyC;CACzC,aAAa;CACb,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;CACT,eAAe;CACf,oBAAoB;AACrB;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,SAAS;CACT,eAAe;AAChB;;AAEA;CACC,kBAAkB,EAAE,2BAA2B;CAC/C,gCAAgC,EAAE,6BAA6B;CAC/D,eAAe,EAAE,qCAAqC;CACtD,gBAAgB,EAAE,iDAAiD;CACnE,yBAAyB,EAAE,yBAAyB;CACpD,aAAa,EAAE,qCAAqC;CACpD,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,WAAW,EAAE,oCAAoC;CACjD,gCAAgC;AACjC;;AAEA;CACC,cAAc,EAAE,+BAA+B;CAC/C,eAAe,EAAE,iDAAiD;AACnE;;AAEA;CACC,WAAW;CACX,YAAY;AACb;;AAEA;CACC,UAAU;CACV,YAAY;CACZ,mBAAmB;CACnB,iCAAiC;CACjC,eAAe;CACf,kBAAkB;CAClB,qBAAqB;CACrB;;;;;EAKC;CACD;;;;;EAKC;CACD,0CAA0C;AAC3C;AACA;CACC,iBAAiB;CACjB,iBAAiB;CACjB,cAAc;CACd,gCAAgC,EAAE,6BAA6B;CAC/D,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,mBAAmB,EAAE,oCAAoC;CACzD,kCAAkC;CAClC,SAAS;CACT,oCAAoC;CACpC,UAAU,EAAE,wBAAwB;AACrC;;AAEA;CACC,aAAa;CACb,qCAAqC;CACrC,SAAS;CACT,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,SAAS;AACV;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;AACpB;;AAEA;CACC,aAAa;CACb,oDAAoD;CACpD,kBAAkB;CAClB,QAAQ;CACR,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,uBAAuB;CACvB,YAAY;CACZ,WAAW;CACX,4BAA4B;AAC7B;;AAEA;;CAEC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;AACV;;AAEA;CACC,sBAAsB;AACvB;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,2BAA2B;AAC5B","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\t--content-text-color: #dddddd;\n\t--title-box-color: #dddddd;\n\t--item-focus-color: #1f2937;\n\t--search-box-bg-color: #192734;\n\t--search-input-color: #dddddd;\n\t--search-btn-bg-color: #313e4b;\n\t--logo-color: #dddddd;\n\t--toggle-switch-bg-color: #6b757e;\n\t--toggle-switch-border-color: #2ca9bc;\n\t--footer-color: #dddddd;\n\t--footer-active: #ffffff;\n\t--add-btn-color: #3f51b5;\n\t--add-btn-bg-color: #90caf9;\n\t--form-header-color: #dddddd;\n\t--form-scroll-box-bg-color: #9e9e9e21;\n\t--todo-item-bg-color: #192734;\n\t--todo-item-hover-color: #2d3d4d;\n\t--back-btn-color: #3f51b5;\n\t--form-input-color: #192734;\n\t--header-color: #dddddd;\n\t--note-color: #ffffff;\n\t--note-header: #90caf9;\n\t--note-out-of-focus: #dddddd;\n\t--highlight: #5369e5;\n\t--red: #c81414;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: flex-start;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.header h1 {\n\ttext-align: center; /* Center the header text */\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\tfont-size: 48px; /* Set a large font size for impact */\n\tcolor: #ffffff87; /* White color for the text for better contrast */\n\tbackground-color: #19211a; /* Navy blue background */\n\tpadding: 20px; /* Add some padding around the text */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin: 0px; /* Add some space below the header */\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177; /* Change text color on hover */\n\tcursor: pointer; /* Change the cursor to indicate it's clickable */\n}\n\n.icon {\n\twidth: 6rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\t/* background-color: #ffffff87; */\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin-bottom: 30px; /* Add some space below the header */\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1; /* Start fully visible */\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.5vw) / repeat(10, 2.5vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: aqua;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\n.hit {\n\tbackground-color: #00ff1e87;\n}\n\n.sunk {\n\tbackground-color: #ff00ee87;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7Ozs7Ozs7Ozs7Ozs7O0FDQThCO0FBQ0Y7QUFDQztBQUNMO0FBRXhCMEgsbURBQUksQ0FBQyxDQUFDO0FBQ041RSxpREFBUSxDQUFDLENBQUM7O0FBRVY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lVUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzP2EzY2YiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcz82ZDU0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBjb21wdXRlcigpIHtcblx0Y29uc3QgY29tcEJvYXJkID0gZ2FtZUJvYXJkKCk7XG5cdGxldCBsYXN0SGl0ID0gbnVsbDtcblx0bGV0IHRhcmdldE1vZGUgPSBmYWxzZTtcblx0bGV0IGF0dGFja09wdGlvbnMgPSBbXTsgLy8gU3RvcmVzIHBvdGVudGlhbCBjZWxscyB0byBhdHRhY2sgaW4gdGFyZ2V0IG1vZGVcblx0bGV0IGlzVHVybiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuXHRcdGxldCB4O1xuXHRcdGxldCB5O1xuXHRcdGRvIHtcblx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHR5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXHRcdH0gd2hpbGUgKGVuZW15LmhpdEJvYXJkW3ldW3hdICE9PSB1bmRlZmluZWQpO1xuXHRcdHJldHVybiB7IHgsIHkgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5KCkge1xuXHRcdGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdO1xuXHRcdHNoaXBzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuXHRcdFx0bGV0IHg7XG5cdFx0XHRsZXQgeTtcblx0XHRcdGxldCB2ZXJ0aWNhbDtcblx0XHRcdGNvbnN0IHNoaXAgPSBjcmVhdGVTaGlwKGxlbmd0aCk7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcblx0XHRcdH0gd2hpbGUgKCFjb21wQm9hcmQuY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKSk7XG5cdFx0XHRjb21wQm9hcmQucGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRhcmdldEF0dGFjayhlbmVteSkge1xuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9ucyA9IFtcblx0XHRcdFx0WzEsIDBdLFxuXHRcdFx0XHRbLTEsIDBdLFxuXHRcdFx0XHRbMCwgMV0sXG5cdFx0XHRcdFswLCAtMV0sXG5cdFx0XHRdO1xuXHRcdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKChkaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgbmV3WCA9IGxhc3RIaXQueCArIGRpclswXTtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IGxhc3RIaXQueSArIGRpclsxXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPCAxMCAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPCAxMCAmJlxuXHRcdFx0XHRcdGVuZW15LmhpdEJvYXJkW25ld1ldW25ld1hdID09PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXR0YWNrT3B0aW9ucy5wdXNoKHsgeDogbmV3WCwgeTogbmV3WSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGF0dGFja09wdGlvbnMuc2hpZnQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNob29zZUF0dGFjayhlbmVteSkge1xuXHRcdHJldHVybiB0YXJnZXRNb2RlID8gdGFyZ2V0QXR0YWNrKGVuZW15KSA6IHJhbmRvbUF0dGFjayhlbmVteSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2socGxheWVyKSB7XG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBjaG9vc2VBdHRhY2socGxheWVyKTtcblx0XHRjb25zb2xlLmxvZyhgeDogJHt4fSwgeTogJHt5fWApO1xuXHRcdGNvbnN0IGF0dGFja1Jlc3VsdCA9IHBsYXllci5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHRcdGNvbnNvbGUubG9nKGBjb21wdXRlciBhdHRhY2tSZXN1bHQ6ICR7YXR0YWNrUmVzdWx0fWApO1xuXHRcdGlmIChhdHRhY2tSZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRcdGxhc3RIaXQgPSB7IHgsIHkgfTtcblx0XHRcdHRhcmdldE1vZGUgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcIm1pc3NcIiAmJiBsYXN0SGl0ICYmIHRhcmdldE1vZGUpIHtcblx0XHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7IC8vIFN3aXRjaCBiYWNrIHRvIHJhbmRvbSBtb2RlIGlmIG5vIG9wdGlvbnMgbGVmdFxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcInN1bmtcIikge1xuXHRcdFx0bGFzdEhpdCA9IG51bGw7XG5cdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7XG5cdFx0XHRhdHRhY2tPcHRpb25zID0gW107IC8vIENsZWFyIGF0dGFjayBvcHRpb25zXG5cdFx0fVxuXHRcdHJldHVybiB7IHgsIHksIGF0dGFja1Jlc3VsdCB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG5cdFx0cmV0dXJuIGNvbXBCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRwbGFjZVNoaXBzQXV0b21hdGljYWxseSxcblx0XHRhdHRhY2ssXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGNob29zZUF0dGFjayxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IGNvbXBCb2FyZCgpIHtcblx0XHRcdHJldHVybiBjb21wQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgdGFyZ2V0TW9kZSgpIHtcblx0XHRcdHJldHVybiB0YXJnZXRNb2RlO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBjb21wdXRlciBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHsgZHJhd0JvYXJkLCB1cGRhdGVCb2FyZCwgdXBkYXRlVHVybiB9IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5mdW5jdGlvbiBwbGF5R2FtZSgpIHtcblx0bGV0IGdhbWVBY3RpdmUgPSB0cnVlO1xuXHRjb25zdCB1c2VyID0gcGxheWVyKFwiUGxheWVyIDFcIik7XG5cdGNvbnN0IGNvbXAgPSBjb21wdXRlcigpO1xuXG5cdC8vIFBsYWNlIHNoaXBzXG5cdHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoNSksIDAsIDAsIGZhbHNlKTtcblx0dXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcCg0KSwgMCwgMSwgZmFsc2UpO1xuXHR1c2VyLnBsYWNlU2hpcChjcmVhdGVTaGlwKDMpLCAwLCAyLCBmYWxzZSk7XG5cdHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoMyksIDAsIDMsIGZhbHNlKTtcblx0dXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcCgyKSwgMCwgNCwgZmFsc2UpO1xuXG5cdGNvbnNvbGUubG9nKFwidXNlciBib2FyZDpcIik7XG5cdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTtcblxuXHRjb25zb2xlLmxvZyhcImNvbXAgYm9hcmQ6XCIpO1xuXHRjb25zb2xlLmxvZyhjb21wLmNvbXBCb2FyZC5ib2FyZCk7XG5cblx0ZHJhd0JvYXJkKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXHRkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXG5cdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHRjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXkgLmNlbGxcIik7XG5cdGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuXHRcdFx0aWYgKCFnYW1lQWN0aXZlIHx8ICF1c2VyLmlzVHVybikgcmV0dXJuO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHxcblx0XHRcdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxuXHRcdFx0KVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjb25zdCB7IHggfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB7IHkgfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB4SW50ID0gcGFyc2VJbnQoeCwgMTApO1xuXHRcdFx0Y29uc3QgeUludCA9IHBhcnNlSW50KHksIDEwKTtcblxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gdXNlci5hdHRhY2soeEludCwgeUludCwgY29tcCk7XG5cdFx0XHR1cGRhdGVCb2FyZCh4SW50LCB5SW50LCByZXN1bHQsIHRydWUpO1xuXG5cdFx0XHRpZiAoY29tcC5oYXNMb3N0KCkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJjb21wIGhhcyBsb3N0XCIpO1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdGNvbXAuaXNUdXJuID0gdHJ1ZTtcblx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pO1xuXHRcdFx0Ly8gZGVidWdnZXI7XG5cblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRjb25zdCB7XG5cdFx0XHRcdFx0eDogY29tcFgsXG5cdFx0XHRcdFx0eTogY29tcFksXG5cdFx0XHRcdFx0YXR0YWNrUmVzdWx0OiBjb21wUmVzdWx0LFxuXHRcdFx0XHR9ID0gY29tcC5hdHRhY2sodXNlcik7XG5cdFx0XHRcdHVwZGF0ZUJvYXJkKGNvbXBYLCBjb21wWSwgY29tcFJlc3VsdCwgZmFsc2UpO1xuXG5cdFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRcdGdhbWVBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInVzZXIgaGFzIGxvc3RcIik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dXNlci5pc1R1cm4gPSB0cnVlO1xuXHRcdFx0XHRjb21wLmlzVHVybiA9IGZhbHNlO1xuXHRcdFx0XHR1cGRhdGVUdXJuKHVzZXIuaXNUdXJuKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBcdC8vIFBsYXkgZ2FtZVxuXHQvLyBcdGxldCBnYW1lT3ZlciA9IGZhbHNlO1xuXHQvLyBcdGxldCB3aW5uZXI7XG5cdC8vIFx0bGV0IHR1cm4gPSAwO1xuXHQvLyBcdGxldCB4O1xuXHQvLyBcdGxldCB5O1xuXHQvLyBcdGxldCBpID0gMDtcblx0Ly8gXHR3aGlsZSAoIWdhbWVPdmVyKSB7XG5cdC8vIFx0XHQvLyBkcmF3Qm9hcmQodXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cdC8vIFx0XHQvLyBkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXHQvLyBcdFx0aWYgKHR1cm4gJSAyID09PSAwKSB7XG5cdC8vIFx0XHRcdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Ly8gXHRcdFx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHQvLyBcdFx0XHR1c2VyLmF0dGFjayh4LCB5LCBjb21wKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDoke2l9YCk7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhjb21wLmhhc0xvc3QoKSk7XG5cdC8vIFx0XHRcdGlmIChjb21wLmhhc0xvc3QoKSkge1xuXHQvLyBcdFx0XHRcdGdhbWVPdmVyID0gdHJ1ZTtcblx0Ly8gXHRcdFx0XHR3aW5uZXIgPSB1c2VyO1xuXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coYHVzZXIgYm9hcmQgKGxpbmU6JHtpfSk6YCk7XG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2codXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDogJHtpfWApO1xuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fSBlbHNlIHtcblx0Ly8gXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0Ly8gXHRcdFx0Y29tcC5pc1R1cm4gPSB0cnVlO1xuXHQvLyBcdFx0XHRjb21wLmF0dGFjayh1c2VyKTtcblxuXHQvLyBcdFx0XHRjb25zb2xlLmxvZyhgdXNlciBib2FyZDoke2l9YCk7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdC8vIFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHQvLyBcdFx0XHRcdGdhbWVPdmVyID0gdHJ1ZTtcblx0Ly8gXHRcdFx0XHR3aW5uZXIgPSBjb21wO1xuXG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2coYHVzZXIgYm9hcmQgKGxpbmU6JHtpfSk6YCk7XG5cdC8vIFx0XHRcdFx0Y29uc29sZS5sb2codXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cblx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZyhgY29tcCBib2FyZDogJHtpfWApO1xuXHQvLyBcdFx0XHRcdGNvbnNvbGUubG9nKGNvbXAuY29tcEJvYXJkLmJvYXJkKTtcblx0Ly8gXHRcdFx0fVxuXHQvLyBcdFx0fVxuXHQvLyBcdFx0dHVybiArPSAxO1xuXHQvLyBcdFx0aSArPSAxO1xuXHQvLyBcdH1cblxuXHQvLyBcdGNvbnNvbGUubG9nKGAke3dpbm5lci5uYW1lfSB3aW5zIWApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbGF5R2FtZTtcbiIsImZ1bmN0aW9uIGdhbWVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cblx0ZnVuY3Rpb24gdmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiIHx8IHggPCAwIHx8IHggPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAodHlwZW9mIHkgIT09IFwibnVtYmVyXCIgfHwgeSA8IDAgfHwgeSA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmICh0eXBlb2YgaXNWZXJ0aWNhbCAhPT0gXCJib29sZWFuXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpc1ZlcnRpY2FsIG11c3QgYmUgYSBib29sZWFuXCIpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IHNoaXAubGVuZ3RoIC0gMTtcblx0XHRjb25zdCBtYXhYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgbGVuZ3RoO1xuXHRcdGNvbnN0IG1heFkgPSBpc1ZlcnRpY2FsID8geSArIGxlbmd0aCA6IHk7XG5cblx0XHRpZiAobWF4WCA+IDkgfHwgbWF4WSA+IDkpIHJldHVybiBmYWxzZTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBjaGVja1ggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpO1xuXHRcdFx0Y29uc3QgY2hlY2tZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTtcblx0XHRcdGlmIChib2FyZFtjaGVja1ldW2NoZWNrWF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHRpZiAoIWNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHBsYWNlIHNoaXAgaGVyZVwiKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHBsYWNlWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBwbGFjZVkgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0Ym9hcmRbcGxhY2VZXVtwbGFjZVhdID0gc2hpcDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmIChib2FyZFt5XVt4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRib2FyZFt5XVt4XSA9IFwibWlzc1wiO1xuXHRcdFx0cmV0dXJuIFwibWlzc1wiO1xuXHRcdH1cblx0XHRib2FyZFt5XVt4XS5oaXQoKTtcblx0XHRpZiAoYm9hcmRbeV1beF0uc3VuaykgcmV0dXJuIFwic3Vua1wiO1xuXHRcdHJldHVybiBcImhpdFwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWxsU2hpcHNTdW5rKCkge1xuXHRcdHJldHVybiBib2FyZC5ldmVyeSgocm93KSA9PlxuXHRcdFx0cm93LmV2ZXJ5KFxuXHRcdFx0XHQoY2VsbCkgPT5cblx0XHRcdFx0XHRjZWxsID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRjZWxsID09PSBcIm1pc3NcIiB8fFxuXHRcdFx0XHRcdCh0eXBlb2YgY2VsbCA9PT0gXCJvYmplY3RcIiAmJiBjZWxsLnN1bmspLFxuXHRcdFx0KSxcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgYm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gYm9hcmQ7XG5cdFx0fSxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0YWxsU2hpcHNTdW5rLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJpbXBvcnQgc29sZGllciBmcm9tIFwiLi9pbWcvc29sZGllci5zdmdcIjtcblxuZnVuY3Rpb24gaGVhZGVyKCkge1xuXHRjb25zdCBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXIuY2xhc3NMaXN0LmFkZChcIm5hdi1iYXJcIik7XG5cblx0Ly8gaXRlbXMgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgaGVhZGVyXG5cdGNvbnN0IGxlZnRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0bGVmdEljb24uY2xhc3NMaXN0LmFkZChcImljb25cIik7XG5cdGxlZnRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdGxlZnRJY29uLmFsdCA9IFwic29sZGllclwiO1xuXG5cdC8vIENyZWF0ZSB0aGUgbWVudSBidXR0b25cblx0Y29uc3QgdGl0bGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0aXRsZUJveC5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyXCIpO1xuXHRjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblx0dGl0bGUudGV4dENvbnRlbnQgPSBcIkJhdHRsZXNoaXBcIjtcblx0dGl0bGVCb3guYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdGNvbnN0IHJpZ2h0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0cmlnaHRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdHJpZ2h0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHRiYXIuYXBwZW5kQ2hpbGQobGVmdEljb24pO1xuXHRiYXIuYXBwZW5kQ2hpbGQodGl0bGVCb3gpO1xuXHRiYXIuYXBwZW5kQ2hpbGQocmlnaHRJY29uKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYmFyKTtcbn1cblxuZnVuY3Rpb24gbWFpbkNvbnRlbnQoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRtYWluLmNsYXNzTGlzdC5hZGQoXCJtYWluLWNvbnRlbnRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChtYWluKTtcbn1cblxuZnVuY3Rpb24gdHVybigpIHtcblx0Y29uc3QgdHVybkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5EaXYuY2xhc3NMaXN0LmFkZChcInR1cm4tZGl2XCIpO1xuXHRjb25zdCB0dXJuSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dHVybkluZGljYXRvci5jbGFzc0xpc3QuYWRkKFwidHVybi1pbmRpY2F0b3JcIik7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJZb3VyIFR1cm5cIjtcblx0dHVybkluZGljYXRvci5hcHBlbmRDaGlsZCh0dXJuVGV4dCk7XG5cdHR1cm5EaXYuYXBwZW5kQ2hpbGQodHVybkluZGljYXRvcik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKHR1cm5EaXYpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gcGxheWVyQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJZb3VyIEJvYXJkXCI7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkVGl0bGUpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmJvYXJkXCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gZW5lbXlCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiZW5lbXlcIik7XG5cblx0Y29uc3QgYm9hcmRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblx0Ym9hcmRUaXRsZS50ZXh0Q29udGVudCA9IFwiRW5lbXkgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5mdW5jdGlvbiByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpIHtcblx0bGV0IGJvYXJkR3JpZDtcblx0aWYgKGVuZW15KSB7XG5cdFx0Ym9hcmRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5lbmVteSBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fSBlbHNlIHtcblx0XHRib2FyZEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnBsYXllciBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fVxuXHRyZXR1cm4gYm9hcmRHcmlkO1xufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIGlzRW5lbXkgPSBmYWxzZSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoaXNFbmVteSk7XG5cdGJvYXJkR3JpZC5pbm5lckhUTUwgPSBcIlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFtpXS5sZW5ndGg7IGogKz0gMSkge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnggPSBqO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnkgPSBpO1xuXHRcdFx0aWYgKGJvYXJkW2ldW2pdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcblx0XHRcdH1cblx0XHRcdGJvYXJkR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWlzcyh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xufVxuXG5mdW5jdGlvbiBoaXQoeCwgeSwgZW5lbXkpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGVuZW15KTtcblx0Y29uc3QgY2VsbCA9IGJvYXJkR3JpZC5jaGlsZHJlblt5ICogMTAgKyB4XTtcblx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xufVxuXG5mdW5jdGlvbiBzdW5rKHgsIHksIGVuZW15KSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChlbmVteSk7XG5cdGNvbnN0IGNlbGwgPSBib2FyZEdyaWQuY2hpbGRyZW5beSAqIDEwICsgeF07XG5cdGNlbGwuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKHgsIHksIHJlc3VsdCwgZW5lbXkpIHtcblx0aWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIHtcblx0XHRtaXNzKHgsIHksIGVuZW15KTtcblx0fSBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRoaXQoeCwgeSwgZW5lbXkpO1xuXHR9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzdW5rXCIpIHtcblx0XHRzdW5rKHgsIHksIGVuZW15KTtcblx0fVxufVxuXG5mdW5jdGlvbiBsb2FkR2FtZSgpIHtcblx0dHVybigpO1xuXHRjcmVhdGVCb2FyZCgpO1xuXHRwbGF5ZXJCb2FyZCgpO1xuXHRlbmVteUJvYXJkKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVR1cm4oaXNUdXJuKSB7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG5cdC8vIENoYW5nZSB0ZXh0IGFmdGVyIGZhZGUgb3V0XG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHR1cm5UZXh0LnRleHRDb250ZW50ID0gaXNUdXJuID8gXCJZb3VyIFR1cm5cIiA6IFwiQ29tcHV0ZXIncyBUdXJuXCI7XG5cdFx0Ly8gRmFkZSBpblxuXHRcdHR1cm5UZXh0LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblx0fSwgNTAwKTsgLy8gVGhpcyBzaG91bGQgbWF0Y2ggdGhlIENTUyB0cmFuc2l0aW9uIHRpbWVcbn1cblxuZnVuY3Rpb24gcGFnZSgpIHtcblx0aGVhZGVyKCk7XG5cdG1haW5Db250ZW50KCk7XG5cdGxvYWRHYW1lKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhZ2U7XG5leHBvcnQgeyBkcmF3Qm9hcmQsIHVwZGF0ZUJvYXJkLCB1cGRhdGVUdXJuIH07XG4iLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuXG5mdW5jdGlvbiBwbGF5ZXIobmFtZSA9IFwiYW5vbnltb3VzXCIpIHtcblx0Y29uc3QgcGxheWVyQm9hcmQgPSBnYW1lQm9hcmQoKTtcblx0Y29uc3QgaGl0Qm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cdGxldCBpc1R1cm4gPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gcGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdFx0aWYgKHJlc3VsdCA9PT0gXCJoaXRcIikge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJoaXRcIjtcblx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzdW5rXCIpIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwic3Vua1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcIm1pc3NcIjtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coYHBsYXllciBoaXRCb2FyZDpgKTtcblx0XHRjb25zb2xlLmxvZyhoaXRCb2FyZCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcblx0XHRyZXR1cm4gZW5lbXkucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNMb3N0KCkge1xuXHRcdHJldHVybiBwbGF5ZXJCb2FyZC5hbGxTaGlwc1N1bmsoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bmFtZSxcblx0XHRwbGFjZVNoaXAsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhdHRhY2ssXG5cdFx0aGFzTG9zdCxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IHBsYXllckJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIHBsYXllckJvYXJkO1xuXHRcdH0sXG5cdFx0Z2V0IGhpdEJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGhpdEJvYXJkO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNoaXAobGVuZ3RoKSB7XG5cdGlmICh0eXBlb2YgbGVuZ3RoICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIG51bWJlclwiKTtcblx0aWYgKGxlbmd0aCA8IDEpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCIpO1xuXHRpZiAobGVuZ3RoICUgMSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlclwiKTtcblx0aWYgKGxlbmd0aCA+IDUpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGxlc3MgdGhhbiA2XCIpO1xuXG5cdGxldCBudW1IaXRzID0gMDtcblx0bGV0IHN1bmsgPSBmYWxzZTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldCBsZW5ndGgoKSB7XG5cdFx0XHRyZXR1cm4gbGVuZ3RoO1xuXHRcdH0sXG5cdFx0Z2V0IG51bUhpdHMoKSB7XG5cdFx0XHRyZXR1cm4gbnVtSGl0cztcblx0XHR9LFxuXHRcdGdldCBzdW5rKCkge1xuXHRcdFx0cmV0dXJuIHN1bms7XG5cdFx0fSxcblx0XHRoaXQoKSB7XG5cdFx0XHRudW1IaXRzICs9IDE7XG5cdFx0XHRpZiAobnVtSGl0cyA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdHN1bmsgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keSB7XG5cdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcblx0LS1jb250ZW50LXRleHQtY29sb3I6ICNkZGRkZGQ7XG5cdC0tdGl0bGUtYm94LWNvbG9yOiAjZGRkZGRkO1xuXHQtLWl0ZW0tZm9jdXMtY29sb3I6ICMxZjI5Mzc7XG5cdC0tc2VhcmNoLWJveC1iZy1jb2xvcjogIzE5MjczNDtcblx0LS1zZWFyY2gtaW5wdXQtY29sb3I6ICNkZGRkZGQ7XG5cdC0tc2VhcmNoLWJ0bi1iZy1jb2xvcjogIzMxM2U0Yjtcblx0LS1sb2dvLWNvbG9yOiAjZGRkZGRkO1xuXHQtLXRvZ2dsZS1zd2l0Y2gtYmctY29sb3I6ICM2Yjc1N2U7XG5cdC0tdG9nZ2xlLXN3aXRjaC1ib3JkZXItY29sb3I6ICMyY2E5YmM7XG5cdC0tZm9vdGVyLWNvbG9yOiAjZGRkZGRkO1xuXHQtLWZvb3Rlci1hY3RpdmU6ICNmZmZmZmY7XG5cdC0tYWRkLWJ0bi1jb2xvcjogIzNmNTFiNTtcblx0LS1hZGQtYnRuLWJnLWNvbG9yOiAjOTBjYWY5O1xuXHQtLWZvcm0taGVhZGVyLWNvbG9yOiAjZGRkZGRkO1xuXHQtLWZvcm0tc2Nyb2xsLWJveC1iZy1jb2xvcjogIzllOWU5ZTIxO1xuXHQtLXRvZG8taXRlbS1iZy1jb2xvcjogIzE5MjczNDtcblx0LS10b2RvLWl0ZW0taG92ZXItY29sb3I6ICMyZDNkNGQ7XG5cdC0tYmFjay1idG4tY29sb3I6ICMzZjUxYjU7XG5cdC0tZm9ybS1pbnB1dC1jb2xvcjogIzE5MjczNDtcblx0LS1oZWFkZXItY29sb3I6ICNkZGRkZGQ7XG5cdC0tbm90ZS1jb2xvcjogI2ZmZmZmZjtcblx0LS1ub3RlLWhlYWRlcjogIzkwY2FmOTtcblx0LS1ub3RlLW91dC1vZi1mb2N1czogI2RkZGRkZDtcblx0LS1oaWdobGlnaHQ6ICM1MzY5ZTU7XG5cdC0tcmVkOiAjYzgxNDE0O1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMTkyMTFhO1xuXHRtYXJnaW46IDA7XG5cdHBhZGRpbmc6IDA7XG5cdGZvbnQtZmFtaWx5OlxuXHRcdHN5c3RlbS11aSxcblx0XHQtYXBwbGUtc3lzdGVtLFxuXHRcdEJsaW5rTWFjU3lzdGVtRm9udCxcblx0XHRcIlNlZ29lIFVJXCIsXG5cdFx0Um9ib3RvLFxuXHRcdE94eWdlbixcblx0XHRVYnVudHUsXG5cdFx0Q2FudGFyZWxsLFxuXHRcdFwiT3BlbiBTYW5zXCIsXG5cdFx0XCJIZWx2ZXRpY2EgTmV1ZVwiLFxuXHRcdHNhbnMtc2VyaWY7XG5cdGNvbG9yOiAjZGRkZGRkO1xufVxuXG5kaXYjY29udGVudCB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdGhlaWdodDogMTAwdmg7XG59XG5cbi5uYXYtYmFyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDVyZW07XG5cdHBhZGRpbmc6IDAgMXJlbTtcblx0cGFkZGluZy10b3A6IDAuMjVyZW07XG59XG5cbi5tYWluLWNvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xuXHRwYWRkaW5nOiAwIDFyZW07XG59XG5cbi5oZWFkZXIgaDEge1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7IC8qIENlbnRlciB0aGUgaGVhZGVyIHRleHQgKi9cblx0Zm9udC1mYW1pbHk6IFwiQXJpYWxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXG5cdGZvbnQtc2l6ZTogNDhweDsgLyogU2V0IGEgbGFyZ2UgZm9udCBzaXplIGZvciBpbXBhY3QgKi9cblx0Y29sb3I6ICNmZmZmZmY4NzsgLyogV2hpdGUgY29sb3IgZm9yIHRoZSB0ZXh0IGZvciBiZXR0ZXIgY29udHJhc3QgKi9cblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTsgLyogTmF2eSBibHVlIGJhY2tncm91bmQgKi9cblx0cGFkZGluZzogMjBweDsgLyogQWRkIHNvbWUgcGFkZGluZyBhcm91bmQgdGhlIHRleHQgKi9cblx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXG5cdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXG5cdG1hcmdpbjogMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXG5cdHRleHQtc2hhZG93OiAycHggMnB4IDJweCAjNzM3MzczO1xufVxuXG4uaGVhZGVyIGgxOmhvdmVyIHtcblx0Y29sb3I6ICM4NDkxNzc7IC8qIENoYW5nZSB0ZXh0IGNvbG9yIG9uIGhvdmVyICovXG5cdGN1cnNvcjogcG9pbnRlcjsgLyogQ2hhbmdlIHRoZSBjdXJzb3IgdG8gaW5kaWNhdGUgaXQncyBjbGlja2FibGUgKi9cbn1cblxuLmljb24ge1xuXHR3aWR0aDogNnJlbTtcblx0aGVpZ2h0OiBhdXRvO1xufVxuXG4udHVybi1pbmRpY2F0b3Ige1xuXHR3aWR0aDogNjAlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdGJvcmRlci1yYWRpdXM6IDFyZW07XG5cdC8qIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY4NzsgKi9cblx0cGFkZGluZzogMC41cmVtO1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdGJhY2tncm91bmQ6ICNmZmZmZmY4Nztcblx0YmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQoXG5cdFx0LTQ1ZGVnLFxuXHRcdCNjZGNhY2E4NyAwJSxcblx0XHQjZmZmZmZmODcgNTAlLFxuXHRcdCNjZGNkY2RhNiAxMDAlXG5cdCk7XG5cdGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KFxuXHRcdC00NWRlZyxcblx0XHQjY2RjYWNhODcgMCUsXG5cdFx0I2ZmZmZmZjg3IDUwJSxcblx0XHQjY2RjZGNkYTYgMTAwJVxuXHQpO1xuXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XG59XG4udHVybi1pbmRpY2F0b3IgcCB7XG5cdGZvbnQtc2l6ZTogMS41cmVtO1xuXHRmb250LXdlaWdodDogYm9sZDtcblx0Y29sb3I6ICMxOTIxMWE7XG5cdGZvbnQtZmFtaWx5OiBcIkFyaWFsXCIsIHNhbnMtc2VyaWY7IC8qIFVzZSBhIG1vZGVybiwgY2xlYW4gZm9udCAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cblx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cblx0bWFyZ2luLWJvdHRvbTogMzBweDsgLyogQWRkIHNvbWUgc3BhY2UgYmVsb3cgdGhlIGhlYWRlciAqL1xuXHR0ZXh0LXNoYWRvdzogNHB4IDNweCAwcHggIzY1NzE1OTczO1xuXHRtYXJnaW46IDA7XG5cdHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlLWluLW91dDtcblx0b3BhY2l0eTogMTsgLyogU3RhcnQgZnVsbHkgdmlzaWJsZSAqL1xufVxuXG4uYm9hcmQge1xuXHRkaXNwbGF5OiBncmlkO1xuXHRncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xuXHRnYXA6IDFyZW07XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLmJvYXJkIGgyIHtcblx0bWFyZ2luOiAwO1xufVxuXG4udHVybi1kaXYge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuZGl2LmJvYXJkLWdyaWQge1xuXHRkaXNwbGF5OiBncmlkO1xuXHRncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDIuNXZ3KSAvIHJlcGVhdCgxMCwgMi41dncpO1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdGdhcDogMnB4O1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XG59XG5cbmRpdi5ib2FyZC1ncmlkIC5jZWxsIHtcblx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XG5cdGhlaWdodDogMTAwJTtcblx0d2lkdGg6IDEwMCU7XG5cdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgMHM7XG59XG5cbi5lbmVteSxcbi5wbGF5ZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xufVxuXG4uc2hpcCB7XG5cdGJhY2tncm91bmQtY29sb3I6IGFxdWE7XG59XG5cbi5taXNzIHtcblx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDg3O1xufVxuXG4uaGl0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xufVxuXG4uc3VuayB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmZjAwZWU4Nztcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9nYW1lLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtDQUNDLDJCQUEyQjtDQUMzQiw2QkFBNkI7Q0FDN0IsMEJBQTBCO0NBQzFCLDJCQUEyQjtDQUMzQiw4QkFBOEI7Q0FDOUIsNkJBQTZCO0NBQzdCLDhCQUE4QjtDQUM5QixxQkFBcUI7Q0FDckIsaUNBQWlDO0NBQ2pDLHFDQUFxQztDQUNyQyx1QkFBdUI7Q0FDdkIsd0JBQXdCO0NBQ3hCLHdCQUF3QjtDQUN4QiwyQkFBMkI7Q0FDM0IsNEJBQTRCO0NBQzVCLHFDQUFxQztDQUNyQyw2QkFBNkI7Q0FDN0IsZ0NBQWdDO0NBQ2hDLHlCQUF5QjtDQUN6QiwyQkFBMkI7Q0FDM0IsdUJBQXVCO0NBQ3ZCLHFCQUFxQjtDQUNyQixzQkFBc0I7Q0FDdEIsNEJBQTRCO0NBQzVCLG9CQUFvQjtDQUNwQixjQUFjO0NBQ2QseUJBQXlCO0NBQ3pCLFNBQVM7Q0FDVCxVQUFVO0NBQ1Y7Ozs7Ozs7Ozs7O1lBV1c7Q0FDWCxjQUFjO0FBQ2Y7O0FBRUE7Q0FDQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLDJCQUEyQjtDQUMzQixvQkFBb0I7Q0FDcEIsYUFBYTtBQUNkOztBQUVBO0NBQ0MseUNBQXlDO0NBQ3pDLGFBQWE7Q0FDYix1QkFBdUI7Q0FDdkIsbUJBQW1CO0NBQ25CLFNBQVM7Q0FDVCxlQUFlO0NBQ2Ysb0JBQW9CO0FBQ3JCOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qix1QkFBdUI7Q0FDdkIsU0FBUztDQUNULGVBQWU7QUFDaEI7O0FBRUE7Q0FDQyxrQkFBa0IsRUFBRSwyQkFBMkI7Q0FDL0MsZ0NBQWdDLEVBQUUsNkJBQTZCO0NBQy9ELGVBQWUsRUFBRSxxQ0FBcUM7Q0FDdEQsZ0JBQWdCLEVBQUUsaURBQWlEO0NBQ25FLHlCQUF5QixFQUFFLHlCQUF5QjtDQUNwRCxhQUFhLEVBQUUscUNBQXFDO0NBQ3BELHlCQUF5QixFQUFFLCtDQUErQztDQUMxRSxtQkFBbUIsRUFBRSxxQ0FBcUM7Q0FDMUQsV0FBVyxFQUFFLG9DQUFvQztDQUNqRCxnQ0FBZ0M7QUFDakM7O0FBRUE7Q0FDQyxjQUFjLEVBQUUsK0JBQStCO0NBQy9DLGVBQWUsRUFBRSxpREFBaUQ7QUFDbkU7O0FBRUE7Q0FDQyxXQUFXO0NBQ1gsWUFBWTtBQUNiOztBQUVBO0NBQ0MsVUFBVTtDQUNWLFlBQVk7Q0FDWixtQkFBbUI7Q0FDbkIsaUNBQWlDO0NBQ2pDLGVBQWU7Q0FDZixrQkFBa0I7Q0FDbEIscUJBQXFCO0NBQ3JCOzs7OztFQUtDO0NBQ0Q7Ozs7O0VBS0M7Q0FDRCwwQ0FBMEM7QUFDM0M7QUFDQTtDQUNDLGlCQUFpQjtDQUNqQixpQkFBaUI7Q0FDakIsY0FBYztDQUNkLGdDQUFnQyxFQUFFLDZCQUE2QjtDQUMvRCx5QkFBeUIsRUFBRSwrQ0FBK0M7Q0FDMUUsbUJBQW1CLEVBQUUscUNBQXFDO0NBQzFELG1CQUFtQixFQUFFLG9DQUFvQztDQUN6RCxrQ0FBa0M7Q0FDbEMsU0FBUztDQUNULG9DQUFvQztDQUNwQyxVQUFVLEVBQUUsd0JBQXdCO0FBQ3JDOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHFDQUFxQztDQUNyQyxTQUFTO0NBQ1QsbUJBQW1CO0NBQ25CLHFCQUFxQjtDQUNyQix1QkFBdUI7Q0FDdkIscUJBQXFCO0FBQ3RCOztBQUVBO0NBQ0MsU0FBUztBQUNWOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qix1QkFBdUI7Q0FDdkIsbUJBQW1CO0FBQ3BCOztBQUVBO0NBQ0MsYUFBYTtDQUNiLG9EQUFvRDtDQUNwRCxrQkFBa0I7Q0FDbEIsUUFBUTtDQUNSLG1CQUFtQjtDQUNuQixxQkFBcUI7Q0FDckIsdUJBQXVCO0NBQ3ZCLHFCQUFxQjtBQUN0Qjs7QUFFQTtDQUNDLHVCQUF1QjtDQUN2QixZQUFZO0NBQ1osV0FBVztDQUNYLDRCQUE0QjtBQUM3Qjs7QUFFQTs7Q0FFQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLHVCQUF1QjtDQUN2QixtQkFBbUI7Q0FDbkIsU0FBUztBQUNWOztBQUVBO0NBQ0Msc0JBQXNCO0FBQ3ZCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHkge1xcblxcdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcXG5cXHQtLWNvbnRlbnQtdGV4dC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLXRpdGxlLWJveC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWl0ZW0tZm9jdXMtY29sb3I6ICMxZjI5Mzc7XFxuXFx0LS1zZWFyY2gtYm94LWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tc2VhcmNoLWlucHV0LWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tc2VhcmNoLWJ0bi1iZy1jb2xvcjogIzMxM2U0YjtcXG5cXHQtLWxvZ28tY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS10b2dnbGUtc3dpdGNoLWJnLWNvbG9yOiAjNmI3NTdlO1xcblxcdC0tdG9nZ2xlLXN3aXRjaC1ib3JkZXItY29sb3I6ICMyY2E5YmM7XFxuXFx0LS1mb290ZXItY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS1mb290ZXItYWN0aXZlOiAjZmZmZmZmO1xcblxcdC0tYWRkLWJ0bi1jb2xvcjogIzNmNTFiNTtcXG5cXHQtLWFkZC1idG4tYmctY29sb3I6ICM5MGNhZjk7XFxuXFx0LS1mb3JtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWZvcm0tc2Nyb2xsLWJveC1iZy1jb2xvcjogIzllOWU5ZTIxO1xcblxcdC0tdG9kby1pdGVtLWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tdG9kby1pdGVtLWhvdmVyLWNvbG9yOiAjMmQzZDRkO1xcblxcdC0tYmFjay1idG4tY29sb3I6ICMzZjUxYjU7XFxuXFx0LS1mb3JtLWlucHV0LWNvbG9yOiAjMTkyNzM0O1xcblxcdC0taGVhZGVyLWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tbm90ZS1jb2xvcjogI2ZmZmZmZjtcXG5cXHQtLW5vdGUtaGVhZGVyOiAjOTBjYWY5O1xcblxcdC0tbm90ZS1vdXQtb2YtZm9jdXM6ICNkZGRkZGQ7XFxuXFx0LS1oaWdobGlnaHQ6ICM1MzY5ZTU7XFxuXFx0LS1yZWQ6ICNjODE0MTQ7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcbn1cXG5cXG5kaXYjY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG5cXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcXG5cXHRoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4ubmF2LWJhciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogNXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxuXFx0cGFkZGluZy10b3A6IDAuMjVyZW07XFxufVxcblxcbi5tYWluLWNvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0cGFkZGluZzogMCAxcmVtO1xcbn1cXG5cXG4uaGVhZGVyIGgxIHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7IC8qIENlbnRlciB0aGUgaGVhZGVyIHRleHQgKi9cXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0Zm9udC1zaXplOiA0OHB4OyAvKiBTZXQgYSBsYXJnZSBmb250IHNpemUgZm9yIGltcGFjdCAqL1xcblxcdGNvbG9yOiAjZmZmZmZmODc7IC8qIFdoaXRlIGNvbG9yIGZvciB0aGUgdGV4dCBmb3IgYmV0dGVyIGNvbnRyYXN0ICovXFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTsgLyogTmF2eSBibHVlIGJhY2tncm91bmQgKi9cXG5cXHRwYWRkaW5nOiAyMHB4OyAvKiBBZGQgc29tZSBwYWRkaW5nIGFyb3VuZCB0aGUgdGV4dCAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXFxuXFx0bWFyZ2luOiAwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cXG5cXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3MztcXG59XFxuXFxuLmhlYWRlciBoMTpob3ZlciB7XFxuXFx0Y29sb3I6ICM4NDkxNzc7IC8qIENoYW5nZSB0ZXh0IGNvbG9yIG9uIGhvdmVyICovXFxuXFx0Y3Vyc29yOiBwb2ludGVyOyAvKiBDaGFuZ2UgdGhlIGN1cnNvciB0byBpbmRpY2F0ZSBpdCdzIGNsaWNrYWJsZSAqL1xcbn1cXG5cXG4uaWNvbiB7XFxuXFx0d2lkdGg6IDZyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4udHVybi1pbmRpY2F0b3Ige1xcblxcdHdpZHRoOiA2MCU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdGJvcmRlci1yYWRpdXM6IDFyZW07XFxuXFx0LyogYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjg3OyAqL1xcblxcdHBhZGRpbmc6IDAuNXJlbTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xcblxcdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxcblxcdFxcdC00NWRlZyxcXG5cXHRcXHQjY2RjYWNhODcgMCUsXFxuXFx0XFx0I2ZmZmZmZjg3IDUwJSxcXG5cXHRcXHQjY2RjZGNkYTYgMTAwJVxcblxcdCk7XFxuXFx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxufVxcbi50dXJuLWluZGljYXRvciBwIHtcXG5cXHRmb250LXNpemU6IDEuNXJlbTtcXG5cXHRmb250LXdlaWdodDogYm9sZDtcXG5cXHRjb2xvcjogIzE5MjExYTtcXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cXG5cXHRtYXJnaW4tYm90dG9tOiAzMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXFxuXFx0dGV4dC1zaGFkb3c6IDRweCAzcHggMHB4ICM2NTcxNTk3MztcXG5cXHRtYXJnaW46IDA7XFxuXFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0O1xcblxcdG9wYWNpdHk6IDE7IC8qIFN0YXJ0IGZ1bGx5IHZpc2libGUgKi9cXG59XFxuXFxuLmJvYXJkIHtcXG5cXHRkaXNwbGF5OiBncmlkO1xcblxcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXJkIGgyIHtcXG5cXHRtYXJnaW46IDA7XFxufVxcblxcbi50dXJuLWRpdiB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIHtcXG5cXHRkaXNwbGF5OiBncmlkO1xcblxcdGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgxMCwgMi41dncpIC8gcmVwZWF0KDEwLCAyLjV2dyk7XFxuXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblxcdGdhcDogMnB4O1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuZGl2LmJvYXJkLWdyaWQgLmNlbGwge1xcblxcdGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcblxcdGhlaWdodDogMTAwJTtcXG5cXHR3aWR0aDogMTAwJTtcXG5cXHR0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlIDBzO1xcbn1cXG5cXG4uZW5lbXksXFxuLnBsYXllciB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiAxcmVtO1xcbn1cXG5cXG4uc2hpcCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogYXF1YTtcXG59XFxuXFxuLm1pc3Mge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA4NztcXG59XFxuXFxuLmhpdCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xcbn1cXG5cXG4uc3VuayB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDBlZTg3O1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG5cdG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuXHRmb250LXNpemU6IDJlbTtcblx0bWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuXHRoZWlnaHQ6IDA7IC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG5cdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG5cdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcblx0Zm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuXHRmb250LXNpemU6IDc1JTtcblx0bGluZS1oZWlnaHQ6IDA7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuXHRib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG5cdHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cblx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cblx0bWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcblx0LyogMSAqL1xuXHRvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuXHQvKiAxICovXG5cdHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xuXHRwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG5cdG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuXHRwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMyAqL1xuXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG5cdG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG5cdG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuXHRmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG5cdGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuXHRkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Q0FDQyxpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDdkM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLFNBQVM7QUFDVjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxjQUFjO0NBQ2QsZ0JBQWdCO0FBQ2pCOztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0NBQ0MsdUJBQXVCLEVBQUUsTUFBTTtDQUMvQixTQUFTLEVBQUUsTUFBTTtDQUNqQixpQkFBaUIsRUFBRSxNQUFNO0FBQzFCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLGlDQUFpQyxFQUFFLE1BQU07Q0FDekMsY0FBYyxFQUFFLE1BQU07QUFDdkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLDZCQUE2QjtBQUM5Qjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxtQkFBbUIsRUFBRSxNQUFNO0NBQzNCLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsaUNBQWlDLEVBQUUsTUFBTTtBQUMxQzs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxtQkFBbUI7QUFDcEI7O0FBRUE7OztFQUdFOztBQUVGOzs7Q0FHQyxpQ0FBaUMsRUFBRSxNQUFNO0NBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxjQUFjO0NBQ2QsY0FBYztDQUNkLGtCQUFrQjtDQUNsQix3QkFBd0I7QUFDekI7O0FBRUE7Q0FDQyxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MsV0FBVztBQUNaOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0NBS0Msb0JBQW9CLEVBQUUsTUFBTTtDQUM1QixlQUFlLEVBQUUsTUFBTTtDQUN2QixpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04saUJBQWlCO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04sb0JBQW9CO0FBQ3JCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsMEJBQTBCO0FBQzNCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsa0JBQWtCO0NBQ2xCLFVBQVU7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLDhCQUE4QjtBQUMvQjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLDhCQUE4QjtBQUMvQjs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtDQUNDLHNCQUFzQixFQUFFLE1BQU07Q0FDOUIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsVUFBVSxFQUFFLE1BQU07Q0FDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsc0JBQXNCLEVBQUUsTUFBTTtDQUM5QixVQUFVLEVBQUUsTUFBTTtBQUNuQjs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxZQUFZO0FBQ2I7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsNkJBQTZCLEVBQUUsTUFBTTtDQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0FBQzdCOztBQUVBOztFQUVFOztBQUVGO0NBQ0Msd0JBQXdCO0FBQ3pCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsYUFBYSxFQUFFLE1BQU07QUFDdEI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGtCQUFrQjtBQUNuQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcblxcdGZvbnQtc2l6ZTogMmVtO1xcblxcdG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcblxcdGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuXFx0aGVpZ2h0OiAwOyAvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcblxcdGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHtcXG5cXHQvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHtcXG5cXHQvKiAxICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuXFx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG5cXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcblxcdG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcblxcdHBhZGRpbmc6IDA7IC8qIDMgKi9cXG5cXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcblxcdG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG5cXHRoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuXFx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG5cXHRkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBwbGF5R2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgcGFnZSBmcm9tIFwiLi9nYW1lVUlcIjtcbmltcG9ydCBcIi4vY3NzL25vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBcIi4vY3NzL2dhbWUuY3NzXCI7XG5cbnBhZ2UoKTtcbnBsYXlHYW1lKCk7XG5cbi8vIGltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG4vLyBpbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIGxldCBib2FyZDtcbi8vIGxldCBzaGlwO1xuXG4vLyBib2FyZCA9IGdhbWVCb2FyZCgpO1xuLy8gc2hpcCA9IGNyZWF0ZVNoaXAoMyk7XG5cbi8vIGNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcbi8vIC8vIGJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAzLCBmYWxzZSk7XG4vLyBjb25zb2xlLmxvZyhgdmVydGljYWxgKTtcbi8vIGJvYXJkLnBsYWNlU2hpcChzaGlwLCAwLCAwLCB0cnVlKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMSk7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDIpO1xuLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAzKTtcbi8vIGNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcblxuLy8gLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDAsIGZhbHNlKTtcbi8vIC8vIGNvbnNvbGUubG9nKGJvYXJkLmJvYXJkKTtcbi8vIC8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMCk7XG4vLyAvLyBjb25zb2xlLmxvZyhzaGlwKTtcbi8vIC8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMSwgMCk7XG4vLyAvLyBjb25zb2xlLmxvZyhzaGlwKTtcbi8vIC8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMiwgMCk7XG4vLyAvLyBjb25zb2xlLmxvZyhzaGlwKTtcbiJdLCJuYW1lcyI6WyJnYW1lQm9hcmQiLCJjcmVhdGVTaGlwIiwiY29tcHV0ZXIiLCJjb21wQm9hcmQiLCJsYXN0SGl0IiwidGFyZ2V0TW9kZSIsImF0dGFja09wdGlvbnMiLCJpc1R1cm4iLCJyYW5kb21BdHRhY2siLCJlbmVteSIsIngiLCJ5IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaGl0Qm9hcmQiLCJ1bmRlZmluZWQiLCJwbGFjZVNoaXBzQXV0b21hdGljYWxseSIsInNoaXBzIiwiZm9yRWFjaCIsImxlbmd0aCIsInZlcnRpY2FsIiwic2hpcCIsImNhblBsYWNlU2hpcCIsInBsYWNlU2hpcCIsInRhcmdldEF0dGFjayIsImRpcmVjdGlvbnMiLCJkaXIiLCJuZXdYIiwibmV3WSIsInB1c2giLCJzaGlmdCIsImNob29zZUF0dGFjayIsImF0dGFjayIsInBsYXllciIsIl9jaG9vc2VBdHRhY2siLCJjb25zb2xlIiwibG9nIiwiY29uY2F0IiwiYXR0YWNrUmVzdWx0IiwicmVjZWl2ZUF0dGFjayIsImhhc0xvc3QiLCJhbGxTaGlwc1N1bmsiLCJ2YWx1ZSIsImRyYXdCb2FyZCIsInVwZGF0ZUJvYXJkIiwidXBkYXRlVHVybiIsInBsYXlHYW1lIiwiZ2FtZUFjdGl2ZSIsInVzZXIiLCJjb21wIiwicGxheWVyQm9hcmQiLCJib2FyZCIsImNlbGxzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2VsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidGFyZ2V0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJkYXRhc2V0IiwieEludCIsInBhcnNlSW50IiwieUludCIsInJlc3VsdCIsInNldFRpbWVvdXQiLCJfY29tcCRhdHRhY2siLCJjb21wWCIsImNvbXBZIiwiY29tcFJlc3VsdCIsIkFycmF5IiwiZnJvbSIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJFcnJvciIsImlzVmVydGljYWwiLCJtYXhYIiwibWF4WSIsImkiLCJjaGVja1giLCJjaGVja1kiLCJwbGFjZVgiLCJwbGFjZVkiLCJoaXQiLCJzdW5rIiwiZXZlcnkiLCJyb3ciLCJfdHlwZW9mIiwic29sZGllciIsImhlYWRlciIsImJhciIsImNyZWF0ZUVsZW1lbnQiLCJhZGQiLCJsZWZ0SWNvbiIsInNyYyIsImFsdCIsInRpdGxlQm94IiwidGl0bGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicmlnaHRJY29uIiwicXVlcnlTZWxlY3RvciIsIm1haW5Db250ZW50IiwibWFpbiIsInR1cm4iLCJ0dXJuRGl2IiwidHVybkluZGljYXRvciIsInR1cm5UZXh0IiwiY3JlYXRlQm9hcmQiLCJib2FyZFRpdGxlIiwiYm9hcmRHcmlkIiwiZW5lbXlCb2FyZCIsInJldHVybkJvYXJkR3JpZCIsImlzRW5lbXkiLCJhcmd1bWVudHMiLCJpbm5lckhUTUwiLCJqIiwibWlzcyIsImNoaWxkcmVuIiwibG9hZEdhbWUiLCJzdHlsZSIsIm9wYWNpdHkiLCJwYWdlIiwibmFtZSIsImNvbCIsIm51bUhpdHMiXSwic291cmNlUm9vdCI6IiJ9