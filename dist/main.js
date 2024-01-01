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




function gameTime(userParam, compParam, gameActiveParam) {
  var user = userParam;
  var comp = compParam;
  var gameActive = gameActiveParam;
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
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.winner)("user");
        return;
      }
      user.isTurn = false;
      comp.isTurn = true;
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn);
      setTimeout(function () {
        var _comp$attack = comp.attack(user),
          compX = _comp$attack.x,
          compY = _comp$attack.y,
          compResult = _comp$attack.attackResult;
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(compX, compY, compResult, false);
        if (user.hasLost()) {
          gameActive = false;
          console.log("user has lost");
          (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.winner)("comp");
          return;
        }
        user.isTurn = true;
        comp.isTurn = false;
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn);
      }, 1000);
    });
  });
}
function playGame() {
  var gameActive = true;
  var user = (0,_player__WEBPACK_IMPORTED_MODULE_0__["default"])("Player 1");
  var comp = (0,_computer__WEBPACK_IMPORTED_MODULE_1__["default"])();
  var gridCells = document.querySelectorAll(".grid-cell");
  var rotateButton = document.querySelector(".rotate-button");
  var ships = [5, 4, 3, 3, 2];
  var selectedShipSize = ships.shift();
  var isHorizontal = true; // Orientation of the ship

  function isAdjacentBlocked(startX, startY, shipSize) {
    for (var i = 0; i < shipSize; i += 1) {
      var x = !isHorizontal ? startX : startX + i;
      var y = isHorizontal ? startY : startY + i;
      for (var adjX = -1; adjX <= 1; adjX += 1) {
        for (var adjY = -1; adjY <= 1; adjY += 1) {
          var neighborX = x + adjX;
          var neighborY = y + adjY;
          if (neighborX >= 0 && neighborX < 10 && neighborY >= 0 && neighborY < 10) {
            if (user.playerBoard.hasShipAt(neighborX, neighborY)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  function highlightCells(e, shipSize) {
    var startX = parseInt(e.target.dataset.x, 10);
    var startY = parseInt(e.target.dataset.y, 10);

    // Assuming user.playerBoard is accessible and has a method to check for ship at a given position
    var isOverlapOrAdjacent = isAdjacentBlocked(startX, startY, shipSize);
    for (var i = 0; i < shipSize; i += 1) {
      var x = !isHorizontal ? startX : startX + i;
      var y = isHorizontal ? startY : startY + i;
      var cell = document.querySelector(".grid-cell[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      if (!cell || x >= 10 || y >= 10 || user.playerBoard.hasShipAt(x, y)) {
        isOverlapOrAdjacent = true;
        break;
      }
    }
    for (var _i = 0; _i < shipSize; _i += 1) {
      var _x = !isHorizontal ? startX : startX + _i;
      var _y = isHorizontal ? startY : startY + _i;
      var _cell = document.querySelector(".grid-cell[data-x=\"".concat(_x, "\"][data-y=\"").concat(_y, "\"]"));
      if (_cell) {
        _cell.classList.add(isOverlapOrAdjacent ? "overlap" : "highlight");
      }
    }
  }
  function removeHighlight() {
    gridCells.forEach(function (cell) {
      cell.classList.remove("highlight", "overlap");
    });
  }
  gridCells.forEach(function (cell) {
    cell.addEventListener("mouseover", function (e) {
      if (selectedShipSize === -1) return;
      highlightCells(e, selectedShipSize);
    });
    cell.addEventListener("mouseout", removeHighlight);
    cell.addEventListener("click", function () {
      var x = parseInt(cell.dataset.x, 10);
      var y = parseInt(cell.dataset.y, 10);
      if (user.canPlaceShip(selectedShipSize, x, y, !isHorizontal)) {
        try {
          user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(selectedShipSize), x, y, !isHorizontal);

          // Visualize the placed ship
          for (var i = 0; i < selectedShipSize; i += 1) {
            var cellX = !isHorizontal ? x : x + i;
            var cellY = isHorizontal ? y : y + i;
            var shipCell = document.querySelector(".grid-cell[data-x=\"".concat(cellX, "\"][data-y=\"").concat(cellY, "\"]"));
            if (shipCell) {
              shipCell.classList.add("cell-with-ship");
            }
          }
          selectedShipSize = ships.shift();
          if (selectedShipSize === undefined) {
            selectedShipSize = -1;
            removeHighlight();
            (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.loadGame)();
            gameTime(user, comp, gameActive);
          }
          console.log(user.playerBoard.board);
        } catch (error) {
          // Handle error
        }
      } else {
        // Handle invalid placement
      }
    });
  });
  rotateButton.addEventListener("click", function () {
    isHorizontal = !isHorizontal;
  });
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

      // Check adjacent cells
      for (var adjX = -1; adjX <= 1; adjX += 1) {
        for (var adjY = -1; adjY <= 1; adjY += 1) {
          var neighborX = checkX + adjX;
          var neighborY = checkY + adjY;

          // Validate neighbor coordinates
          if (neighborX >= 0 && neighborX < 10 && neighborY >= 0 && neighborY < 10) {
            if (board[neighborY][neighborX] !== undefined) {
              return false;
            }
          }
        }
      }
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
  function hasShipAt(x, y) {
    return board[y][x] !== undefined;
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
    hasShipAt: hasShipAt,
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
/* harmony export */   loadGame: () => (/* binding */ loadGame),
/* harmony export */   updateBoard: () => (/* binding */ updateBoard),
/* harmony export */   updateTurn: () => (/* binding */ updateTurn),
/* harmony export */   winner: () => (/* binding */ winner)
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
      if (board[i][j] !== undefined && !isEnemy) {
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
function updateBoard(x, y, result, enemy) {
  if (result === "miss") {
    miss(x, y, enemy);
  } else if (result === "hit") {
    hit(x, y, enemy);
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
function winner(player) {
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.textContent = "".concat(player, " won!");
}
function page() {
  header();
  mainContent();
  startPage();
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

.cell.overlap {
	background-color: red; /* Color indicating invalid placement due to overlap */
	cursor: not-allowed; /* Blocked cursor */
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

div.board-grid .cell.cell-with-ship {
	background-color: #00ff1e87;
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
	background-color: #1e90ff;
}

.miss {
	background-color: #ff000087;
}

div.cell.hit {
	background-color: #00ff1e87;
	border: 1px solid #00ff1e87;
}
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"AAAA;CACC,2BAA2B;CAC3B,6BAA6B;CAC7B,0BAA0B;CAC1B,2BAA2B;CAC3B,8BAA8B;CAC9B,6BAA6B;CAC7B,8BAA8B;CAC9B,qBAAqB;CACrB,iCAAiC;CACjC,qCAAqC;CACrC,uBAAuB;CACvB,wBAAwB;CACxB,wBAAwB;CACxB,2BAA2B;CAC3B,4BAA4B;CAC5B,qCAAqC;CACrC,6BAA6B;CAC7B,gCAAgC;CAChC,yBAAyB;CACzB,2BAA2B;CAC3B,uBAAuB;CACvB,qBAAqB;CACrB,sBAAsB;CACtB,4BAA4B;CAC5B,oBAAoB;CACpB,cAAc;CACd,yBAAyB;CACzB,SAAS;CACT,UAAU;CACV;;;;;;;;;;;YAWW;CACX,cAAc;AACf;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,2BAA2B;CAC3B,oBAAoB;CACpB,aAAa;AACd;;AAEA;CACC,yCAAyC;CACzC,aAAa;CACb,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;CACT,eAAe;CACf,oBAAoB;AACrB;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,SAAS;CACT,eAAe;AAChB;;AAEA;CACC,qBAAqB,EAAE,sDAAsD;CAC7E,mBAAmB,EAAE,mBAAmB;AACzC;;AAEA;CACC,kBAAkB,EAAE,2BAA2B;CAC/C,gCAAgC,EAAE,6BAA6B;CAC/D,eAAe,EAAE,qCAAqC;CACtD,gBAAgB,EAAE,iDAAiD;CACnE,yBAAyB,EAAE,yBAAyB;CACpD,aAAa,EAAE,qCAAqC;CACpD,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,WAAW,EAAE,oCAAoC;CACjD,gCAAgC;AACjC;;AAEA;CACC,cAAc,EAAE,+BAA+B;CAC/C,eAAe,EAAE,iDAAiD;AACnE;;AAEA;CACC,WAAW;CACX,YAAY;AACb;;AAEA;CACC,UAAU;CACV,YAAY;CACZ,mBAAmB;CACnB,iCAAiC;CACjC,eAAe;CACf,kBAAkB;CAClB,qBAAqB;CACrB;;;;;EAKC;CACD;;;;;EAKC;CACD,0CAA0C;AAC3C;AACA;CACC,iBAAiB;CACjB,iBAAiB;CACjB,cAAc;CACd,gCAAgC,EAAE,6BAA6B;CAC/D,yBAAyB,EAAE,+CAA+C;CAC1E,mBAAmB,EAAE,qCAAqC;CAC1D,mBAAmB,EAAE,oCAAoC;CACzD,kCAAkC;CAClC,SAAS;CACT,oCAAoC;CACpC,UAAU,EAAE,wBAAwB;AACrC;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;AACpB;;AAEA;CACC,yBAAyB;CACzB,gBAAgB;CAChB,yBAAyB;CACzB,kBAAkB;CAClB,kBAAkB;CAClB,iBAAiB;CACjB,eAAe;CACf;;4BAE2B;AAC5B;;AAEA;CACC,yBAAyB,EAAE,8BAA8B;CACzD,gBAAgB,EAAE,wBAAwB;AAC3C;;AAEA;CACC,aAAa;CACb,qCAAqC;CACrC,SAAS;CACT,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,qBAAqB,EAAE,uCAAuC;CAC9D,mBAAmB,EAAE,mBAAmB;AACzC;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,SAAS;AACV;;AAEA;CACC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;AACpB;;AAEA;CACC,aAAa;CACb,oDAAoD;CACpD,kBAAkB;CAClB,QAAQ;CACR,mBAAmB;CACnB,qBAAqB;CACrB,uBAAuB;CACvB,qBAAqB;AACtB;;AAEA;CACC,uBAAuB;CACvB,YAAY;CACZ,WAAW;CACX,4BAA4B;AAC7B;;AAEA;;CAEC,aAAa;CACb,sBAAsB;CACtB,uBAAuB;CACvB,mBAAmB;CACnB,SAAS;AACV;;AAEA;CACC,yBAAyB;AAC1B;;AAEA;CACC,2BAA2B;AAC5B;;AAEA;CACC,2BAA2B;CAC3B,2BAA2B;AAC5B","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\t--content-text-color: #dddddd;\n\t--title-box-color: #dddddd;\n\t--item-focus-color: #1f2937;\n\t--search-box-bg-color: #192734;\n\t--search-input-color: #dddddd;\n\t--search-btn-bg-color: #313e4b;\n\t--logo-color: #dddddd;\n\t--toggle-switch-bg-color: #6b757e;\n\t--toggle-switch-border-color: #2ca9bc;\n\t--footer-color: #dddddd;\n\t--footer-active: #ffffff;\n\t--add-btn-color: #3f51b5;\n\t--add-btn-bg-color: #90caf9;\n\t--form-header-color: #dddddd;\n\t--form-scroll-box-bg-color: #9e9e9e21;\n\t--todo-item-bg-color: #192734;\n\t--todo-item-hover-color: #2d3d4d;\n\t--back-btn-color: #3f51b5;\n\t--form-input-color: #192734;\n\t--header-color: #dddddd;\n\t--note-color: #ffffff;\n\t--note-header: #90caf9;\n\t--note-out-of-focus: #dddddd;\n\t--highlight: #5369e5;\n\t--red: #c81414;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: flex-start;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.cell.overlap {\n\tbackground-color: red; /* Color indicating invalid placement due to overlap */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.header h1 {\n\ttext-align: center; /* Center the header text */\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\tfont-size: 48px; /* Set a large font size for impact */\n\tcolor: #ffffff87; /* White color for the text for better contrast */\n\tbackground-color: #19211a; /* Navy blue background */\n\tpadding: 20px; /* Add some padding around the text */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin: 0px; /* Add some space below the header */\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177; /* Change text color on hover */\n\tcursor: pointer; /* Change the cursor to indicate it's clickable */\n}\n\n.icon {\n\twidth: 6rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\t/* background-color: #ffffff87; */\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin-bottom: 30px; /* Add some space below the header */\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1; /* Start fully visible */\n}\n\n.rotate-container {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n.rotate-button {\n\tbackground-color: #506052;\n\tcolor: #c1c1c1d6;\n\tborder: 2px solid #929392;\n\tpadding: 10px 20px;\n\tborder-radius: 5px;\n\tfont-weight: bold;\n\tcursor: pointer;\n\ttransition:\n\t\ttransform 0.3s ease,\n\t\tbackground-color 0.3s ease;\n}\n\n.rotate-button:hover {\n\tbackground-color: #2c7235; /* Background color on hover */\n\tcolor: #ffffff87; /* Text color on hover */\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.cell.highlight {\n\tbackground-color: lightblue;\n}\n\n.cell.blocked {\n\tbackground-color: red; /* Color indicating invalid placement */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\ndiv.board-grid .cell.cell-with-ship {\n\tbackground-color: #00ff1e87;\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.5vw) / repeat(10, 2.5vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: #1e90ff;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\ndiv.cell.hit {\n\tbackground-color: #00ff1e87;\n\tborder: 1px solid #00ff1e87;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ0o7QUFFaEMsU0FBU0UsUUFBUUEsQ0FBQSxFQUFHO0VBQ25CLElBQU1DLFNBQVMsR0FBR0gsc0RBQVMsQ0FBQyxDQUFDO0VBQzdCLElBQUlJLE9BQU8sR0FBRyxJQUFJO0VBQ2xCLElBQUlDLFVBQVUsR0FBRyxLQUFLO0VBQ3RCLElBQUlDLGFBQWEsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN4QixJQUFJQyxNQUFNLEdBQUcsS0FBSztFQUVsQixTQUFTQyxZQUFZQSxDQUFDQyxLQUFLLEVBQUU7SUFDNUIsSUFBSUMsQ0FBQztJQUNMLElBQUlDLENBQUM7SUFDTCxHQUFHO01BQ0ZELENBQUMsR0FBR0UsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDbENILENBQUMsR0FBR0MsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkMsQ0FBQyxRQUFRTCxLQUFLLENBQUNNLFFBQVEsQ0FBQ0osQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQyxLQUFLTSxTQUFTO0lBQzNDLE9BQU87TUFBRU4sQ0FBQyxFQUFEQSxDQUFDO01BQUVDLENBQUMsRUFBREE7SUFBRSxDQUFDO0VBQ2hCO0VBRUEsU0FBU00sdUJBQXVCQSxDQUFBLEVBQUc7SUFDbEMsSUFBTUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QkEsS0FBSyxDQUFDQyxPQUFPLENBQUMsVUFBQ0MsTUFBTSxFQUFLO01BQ3pCLElBQUlWLENBQUM7TUFDTCxJQUFJQyxDQUFDO01BQ0wsSUFBSVUsUUFBUTtNQUNaLElBQU1DLElBQUksR0FBR3JCLGlEQUFVLENBQUNtQixNQUFNLENBQUM7TUFDL0IsR0FBRztRQUNGVixDQUFDLEdBQUdFLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xDSCxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xDTyxRQUFRLEdBQUdULElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHO01BQy9CLENBQUMsUUFBUSxDQUFDWCxTQUFTLENBQUNvQixZQUFZLENBQUNELElBQUksRUFBRVosQ0FBQyxFQUFFQyxDQUFDLEVBQUVVLFFBQVEsQ0FBQztNQUN0RGxCLFNBQVMsQ0FBQ3FCLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFWixDQUFDLEVBQUVDLENBQUMsRUFBRVUsUUFBUSxDQUFDO0lBQzFDLENBQUMsQ0FBQztFQUNIO0VBRUEsU0FBU0ksWUFBWUEsQ0FBQ2hCLEtBQUssRUFBRTtJQUM1QixJQUFJSCxhQUFhLENBQUNjLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDL0IsSUFBTU0sVUFBVSxHQUFHLENBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNOLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDUDtNQUNEQSxVQUFVLENBQUNQLE9BQU8sQ0FBQyxVQUFDUSxHQUFHLEVBQUs7UUFDM0IsSUFBTUMsSUFBSSxHQUFHeEIsT0FBTyxDQUFDTSxDQUFDLEdBQUdpQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQU1FLElBQUksR0FBR3pCLE9BQU8sQ0FBQ08sQ0FBQyxHQUFHZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUNDQyxJQUFJLElBQUksQ0FBQyxJQUNUQSxJQUFJLEdBQUcsRUFBRSxJQUNUQyxJQUFJLElBQUksQ0FBQyxJQUNUQSxJQUFJLEdBQUcsRUFBRSxJQUNUcEIsS0FBSyxDQUFDTSxRQUFRLENBQUNjLElBQUksQ0FBQyxDQUFDRCxJQUFJLENBQUMsS0FBS1osU0FBUyxFQUN2QztVQUNEVixhQUFhLENBQUN3QixJQUFJLENBQUM7WUFBRXBCLENBQUMsRUFBRWtCLElBQUk7WUFBRWpCLENBQUMsRUFBRWtCO1VBQUssQ0FBQyxDQUFDO1FBQ3pDO01BQ0QsQ0FBQyxDQUFDO0lBQ0g7SUFFQSxPQUFPdkIsYUFBYSxDQUFDeUIsS0FBSyxDQUFDLENBQUM7RUFDN0I7RUFFQSxTQUFTQyxZQUFZQSxDQUFDdkIsS0FBSyxFQUFFO0lBQzVCLE9BQU9KLFVBQVUsR0FBR29CLFlBQVksQ0FBQ2hCLEtBQUssQ0FBQyxHQUFHRCxZQUFZLENBQUNDLEtBQUssQ0FBQztFQUM5RDtFQUVBLFNBQVN3QixNQUFNQSxDQUFDQyxNQUFNLEVBQUU7SUFDdkIsSUFBQUMsYUFBQSxHQUFpQkgsWUFBWSxDQUFDRSxNQUFNLENBQUM7TUFBN0J4QixDQUFDLEdBQUF5QixhQUFBLENBQUR6QixDQUFDO01BQUVDLENBQUMsR0FBQXdCLGFBQUEsQ0FBRHhCLENBQUM7SUFDWnlCLE9BQU8sQ0FBQ0MsR0FBRyxPQUFBQyxNQUFBLENBQU81QixDQUFDLFdBQUE0QixNQUFBLENBQVEzQixDQUFDLENBQUUsQ0FBQztJQUMvQixJQUFNNEIsWUFBWSxHQUFHTCxNQUFNLENBQUNNLGFBQWEsQ0FBQzlCLENBQUMsRUFBRUMsQ0FBQyxDQUFDO0lBQy9DeUIsT0FBTyxDQUFDQyxHQUFHLDJCQUFBQyxNQUFBLENBQTJCQyxZQUFZLENBQUUsQ0FBQztJQUNyRCxJQUFJQSxZQUFZLEtBQUssS0FBSyxFQUFFO01BQzNCbkMsT0FBTyxHQUFHO1FBQUVNLENBQUMsRUFBREEsQ0FBQztRQUFFQyxDQUFDLEVBQURBO01BQUUsQ0FBQztNQUNsQk4sVUFBVSxHQUFHLElBQUk7SUFDbEIsQ0FBQyxNQUFNLElBQUlrQyxZQUFZLEtBQUssTUFBTSxJQUFJbkMsT0FBTyxJQUFJQyxVQUFVLEVBQUU7TUFDNUQsSUFBSUMsYUFBYSxDQUFDYyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQy9CZixVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDckI7SUFDRCxDQUFDLE1BQU0sSUFBSWtDLFlBQVksS0FBSyxNQUFNLEVBQUU7TUFDbkNuQyxPQUFPLEdBQUcsSUFBSTtNQUNkQyxVQUFVLEdBQUcsS0FBSztNQUNsQkMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCO0lBQ0EsT0FBTztNQUFFSSxDQUFDLEVBQURBLENBQUM7TUFBRUMsQ0FBQyxFQUFEQSxDQUFDO01BQUU0QixZQUFZLEVBQVpBO0lBQWEsQ0FBQztFQUM5QjtFQUVBLFNBQVNDLGFBQWFBLENBQUM5QixDQUFDLEVBQUVDLENBQUMsRUFBRTtJQUM1QixPQUFPUixTQUFTLENBQUNxQyxhQUFhLENBQUM5QixDQUFDLEVBQUVDLENBQUMsQ0FBQztFQUNyQztFQUVBLFNBQVM4QixPQUFPQSxDQUFBLEVBQUc7SUFDbEIsT0FBT3RDLFNBQVMsQ0FBQ3VDLFlBQVksQ0FBQyxDQUFDO0VBQ2hDO0VBRUEsT0FBTztJQUNOekIsdUJBQXVCLEVBQXZCQSx1QkFBdUI7SUFDdkJnQixNQUFNLEVBQU5BLE1BQU07SUFDTk8sYUFBYSxFQUFiQSxhQUFhO0lBQ2JDLE9BQU8sRUFBUEEsT0FBTztJQUNQVCxZQUFZLEVBQVpBLFlBQVk7SUFDWixJQUFJekIsTUFBTUEsQ0FBQSxFQUFHO01BQ1osT0FBT0EsTUFBTTtJQUNkLENBQUM7SUFDRCxJQUFJQSxNQUFNQSxDQUFDb0MsS0FBSyxFQUFFO01BQ2pCcEMsTUFBTSxHQUFHb0MsS0FBSztJQUNmLENBQUM7SUFDRCxJQUFJeEMsU0FBU0EsQ0FBQSxFQUFHO01BQ2YsT0FBT0EsU0FBUztJQUNqQixDQUFDO0lBQ0QsSUFBSUUsVUFBVUEsQ0FBQSxFQUFHO01BQ2hCLE9BQU9BLFVBQVU7SUFDbEI7RUFDRCxDQUFDO0FBQ0Y7QUFFQSxpRUFBZUgsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkhPO0FBQ0k7QUFDRjtBQUNnRDtBQUVoRixTQUFTK0MsUUFBUUEsQ0FBQ0MsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLGVBQWUsRUFBRTtFQUN4RCxJQUFNQyxJQUFJLEdBQUdILFNBQVM7RUFDdEIsSUFBTUksSUFBSSxHQUFHSCxTQUFTO0VBQ3RCLElBQUlJLFVBQVUsR0FBR0gsZUFBZTtFQUVoQ2hCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztFQUMxQkQsT0FBTyxDQUFDQyxHQUFHLENBQUNnQixJQUFJLENBQUNHLFdBQVcsQ0FBQ0MsS0FBSyxDQUFDO0VBRW5DSCxJQUFJLENBQUNyQyx1QkFBdUIsQ0FBQyxDQUFDO0VBRTlCbUIsT0FBTyxDQUFDQyxHQUFHLENBQUMsYUFBYSxDQUFDO0VBQzFCRCxPQUFPLENBQUNDLEdBQUcsQ0FBQ2lCLElBQUksQ0FBQ25ELFNBQVMsQ0FBQ3NELEtBQUssQ0FBQztFQUVqQ2Isa0RBQVMsQ0FBQ1MsSUFBSSxDQUFDRyxXQUFXLENBQUNDLEtBQUssQ0FBQztFQUNqQ2Isa0RBQVMsQ0FBQ1UsSUFBSSxDQUFDbkQsU0FBUyxDQUFDc0QsS0FBSyxFQUFFLElBQUksQ0FBQztFQUVyQ0osSUFBSSxDQUFDOUMsTUFBTSxHQUFHLElBQUk7RUFDbEIrQyxJQUFJLENBQUMvQyxNQUFNLEdBQUcsS0FBSztFQUVuQixJQUFNbUQsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztFQUN2REYsS0FBSyxDQUFDdkMsT0FBTyxDQUFDLFVBQUMwQyxJQUFJLEVBQUs7SUFDdkJBLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNDLENBQUMsRUFBSztNQUNyQyxJQUFJLENBQUNSLFVBQVUsSUFBSSxDQUFDRixJQUFJLENBQUM5QyxNQUFNLEVBQUU7TUFDakMsSUFDQ3dELENBQUMsQ0FBQ0MsTUFBTSxDQUFDQyxTQUFTLENBQUNDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFDbENILENBQUMsQ0FBQ0MsTUFBTSxDQUFDQyxTQUFTLENBQUNDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFFbkM7TUFDRCxJQUFReEQsQ0FBQyxHQUFLcUQsQ0FBQyxDQUFDQyxNQUFNLENBQUNHLE9BQU8sQ0FBdEJ6RCxDQUFDO01BQ1QsSUFBUUMsQ0FBQyxHQUFLb0QsQ0FBQyxDQUFDQyxNQUFNLENBQUNHLE9BQU8sQ0FBdEJ4RCxDQUFDO01BQ1QsSUFBTXlELElBQUksR0FBR0MsUUFBUSxDQUFDM0QsQ0FBQyxFQUFFLEVBQUUsQ0FBQztNQUM1QixJQUFNNEQsSUFBSSxHQUFHRCxRQUFRLENBQUMxRCxDQUFDLEVBQUUsRUFBRSxDQUFDO01BRTVCLElBQU00RCxNQUFNLEdBQUdsQixJQUFJLENBQUNwQixNQUFNLENBQUNtQyxJQUFJLEVBQUVFLElBQUksRUFBRWhCLElBQUksQ0FBQztNQUM1Q1Qsb0RBQVcsQ0FBQ3VCLElBQUksRUFBRUUsSUFBSSxFQUFFQyxNQUFNLEVBQUUsSUFBSSxDQUFDO01BRXJDLElBQUlqQixJQUFJLENBQUNiLE9BQU8sQ0FBQyxDQUFDLEVBQUU7UUFDbkJMLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUM1QmtCLFVBQVUsR0FBRyxLQUFLO1FBQ2xCUCwrQ0FBTSxDQUFDLE1BQU0sQ0FBQztRQUNkO01BQ0Q7TUFFQUssSUFBSSxDQUFDOUMsTUFBTSxHQUFHLEtBQUs7TUFDbkIrQyxJQUFJLENBQUMvQyxNQUFNLEdBQUcsSUFBSTtNQUNsQnVDLG1EQUFVLENBQUNPLElBQUksQ0FBQzlDLE1BQU0sQ0FBQztNQUV2QmlFLFVBQVUsQ0FBQyxZQUFNO1FBQ2hCLElBQUFDLFlBQUEsR0FJSW5CLElBQUksQ0FBQ3JCLE1BQU0sQ0FBQ29CLElBQUksQ0FBQztVQUhqQnFCLEtBQUssR0FBQUQsWUFBQSxDQUFSL0QsQ0FBQztVQUNFaUUsS0FBSyxHQUFBRixZQUFBLENBQVI5RCxDQUFDO1VBQ2FpRSxVQUFVLEdBQUFILFlBQUEsQ0FBeEJsQyxZQUFZO1FBRWJNLG9EQUFXLENBQUM2QixLQUFLLEVBQUVDLEtBQUssRUFBRUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUU1QyxJQUFJdkIsSUFBSSxDQUFDWixPQUFPLENBQUMsQ0FBQyxFQUFFO1VBQ25CYyxVQUFVLEdBQUcsS0FBSztVQUNsQm5CLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGVBQWUsQ0FBQztVQUM1QlcsK0NBQU0sQ0FBQyxNQUFNLENBQUM7VUFDZDtRQUNEO1FBRUFLLElBQUksQ0FBQzlDLE1BQU0sR0FBRyxJQUFJO1FBQ2xCK0MsSUFBSSxDQUFDL0MsTUFBTSxHQUFHLEtBQUs7UUFDbkJ1QyxtREFBVSxDQUFDTyxJQUFJLENBQUM5QyxNQUFNLENBQUM7TUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNULENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztBQUNIO0FBRUEsU0FBU3NFLFFBQVFBLENBQUEsRUFBRztFQUNuQixJQUFNdEIsVUFBVSxHQUFHLElBQUk7RUFDdkIsSUFBTUYsSUFBSSxHQUFHbkIsbURBQU0sQ0FBQyxVQUFVLENBQUM7RUFDL0IsSUFBTW9CLElBQUksR0FBR3BELHFEQUFRLENBQUMsQ0FBQztFQUV2QixJQUFNNEUsU0FBUyxHQUFHbkIsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7RUFDekQsSUFBTW1CLFlBQVksR0FBR3BCLFFBQVEsQ0FBQ3FCLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztFQUM3RCxJQUFNOUQsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUM3QixJQUFJK0QsZ0JBQWdCLEdBQUcvRCxLQUFLLENBQUNhLEtBQUssQ0FBQyxDQUFDO0VBQ3BDLElBQUltRCxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7O0VBRXpCLFNBQVNDLGlCQUFpQkEsQ0FBQ0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRTtJQUNwRCxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0QsUUFBUSxFQUFFQyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3JDLElBQU03RSxDQUFDLEdBQUcsQ0FBQ3dFLFlBQVksR0FBR0UsTUFBTSxHQUFHQSxNQUFNLEdBQUdHLENBQUM7TUFDN0MsSUFBTTVFLENBQUMsR0FBR3VFLFlBQVksR0FBR0csTUFBTSxHQUFHQSxNQUFNLEdBQUdFLENBQUM7TUFFNUMsS0FBSyxJQUFJQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUVBLElBQUksSUFBSSxDQUFDLEVBQUVBLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDekMsS0FBSyxJQUFJQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUVBLElBQUksSUFBSSxDQUFDLEVBQUVBLElBQUksSUFBSSxDQUFDLEVBQUU7VUFDekMsSUFBTUMsU0FBUyxHQUFHaEYsQ0FBQyxHQUFHOEUsSUFBSTtVQUMxQixJQUFNRyxTQUFTLEdBQUdoRixDQUFDLEdBQUc4RSxJQUFJO1VBQzFCLElBQ0NDLFNBQVMsSUFBSSxDQUFDLElBQ2RBLFNBQVMsR0FBRyxFQUFFLElBQ2RDLFNBQVMsSUFBSSxDQUFDLElBQ2RBLFNBQVMsR0FBRyxFQUFFLEVBQ2I7WUFDRCxJQUFJdEMsSUFBSSxDQUFDRyxXQUFXLENBQUNvQyxTQUFTLENBQUNGLFNBQVMsRUFBRUMsU0FBUyxDQUFDLEVBQUU7Y0FDckQsT0FBTyxJQUFJO1lBQ1o7VUFDRDtRQUNEO01BQ0Q7SUFDRDtJQUNBLE9BQU8sS0FBSztFQUNiO0VBRUEsU0FBU0UsY0FBY0EsQ0FBQzlCLENBQUMsRUFBRXVCLFFBQVEsRUFBRTtJQUNwQyxJQUFNRixNQUFNLEdBQUdmLFFBQVEsQ0FBQ04sQ0FBQyxDQUFDQyxNQUFNLENBQUNHLE9BQU8sQ0FBQ3pELENBQUMsRUFBRSxFQUFFLENBQUM7SUFDL0MsSUFBTTJFLE1BQU0sR0FBR2hCLFFBQVEsQ0FBQ04sQ0FBQyxDQUFDQyxNQUFNLENBQUNHLE9BQU8sQ0FBQ3hELENBQUMsRUFBRSxFQUFFLENBQUM7O0lBRS9DO0lBQ0EsSUFBSW1GLG1CQUFtQixHQUFHWCxpQkFBaUIsQ0FBQ0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsQ0FBQztJQUVyRSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0QsUUFBUSxFQUFFQyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3JDLElBQU03RSxDQUFDLEdBQUcsQ0FBQ3dFLFlBQVksR0FBR0UsTUFBTSxHQUFHQSxNQUFNLEdBQUdHLENBQUM7TUFDN0MsSUFBTTVFLENBQUMsR0FBR3VFLFlBQVksR0FBR0csTUFBTSxHQUFHQSxNQUFNLEdBQUdFLENBQUM7TUFDNUMsSUFBTTFCLElBQUksR0FBR0YsUUFBUSxDQUFDcUIsYUFBYSx3QkFBQTFDLE1BQUEsQ0FDWjVCLENBQUMsbUJBQUE0QixNQUFBLENBQWMzQixDQUFDLFFBQ3ZDLENBQUM7TUFDRCxJQUFJLENBQUNrRCxJQUFJLElBQUluRCxDQUFDLElBQUksRUFBRSxJQUFJQyxDQUFDLElBQUksRUFBRSxJQUFJMEMsSUFBSSxDQUFDRyxXQUFXLENBQUNvQyxTQUFTLENBQUNsRixDQUFDLEVBQUVDLENBQUMsQ0FBQyxFQUFFO1FBQ3BFbUYsbUJBQW1CLEdBQUcsSUFBSTtRQUMxQjtNQUNEO0lBQ0Q7SUFFQSxLQUFLLElBQUlQLEVBQUMsR0FBRyxDQUFDLEVBQUVBLEVBQUMsR0FBR0QsUUFBUSxFQUFFQyxFQUFDLElBQUksQ0FBQyxFQUFFO01BQ3JDLElBQU03RSxFQUFDLEdBQUcsQ0FBQ3dFLFlBQVksR0FBR0UsTUFBTSxHQUFHQSxNQUFNLEdBQUdHLEVBQUM7TUFDN0MsSUFBTTVFLEVBQUMsR0FBR3VFLFlBQVksR0FBR0csTUFBTSxHQUFHQSxNQUFNLEdBQUdFLEVBQUM7TUFDNUMsSUFBTTFCLEtBQUksR0FBR0YsUUFBUSxDQUFDcUIsYUFBYSx3QkFBQTFDLE1BQUEsQ0FDWjVCLEVBQUMsbUJBQUE0QixNQUFBLENBQWMzQixFQUFDLFFBQ3ZDLENBQUM7TUFDRCxJQUFJa0QsS0FBSSxFQUFFO1FBQ1RBLEtBQUksQ0FBQ0ksU0FBUyxDQUFDOEIsR0FBRyxDQUFDRCxtQkFBbUIsR0FBRyxTQUFTLEdBQUcsV0FBVyxDQUFDO01BQ2xFO0lBQ0Q7RUFDRDtFQUVBLFNBQVNFLGVBQWVBLENBQUEsRUFBRztJQUMxQmxCLFNBQVMsQ0FBQzNELE9BQU8sQ0FBQyxVQUFDMEMsSUFBSSxFQUFLO01BQzNCQSxJQUFJLENBQUNJLFNBQVMsQ0FBQ2dDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDO0lBQzlDLENBQUMsQ0FBQztFQUNIO0VBRUFuQixTQUFTLENBQUMzRCxPQUFPLENBQUMsVUFBQzBDLElBQUksRUFBSztJQUMzQkEsSUFBSSxDQUFDQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQ0MsQ0FBQyxFQUFLO01BQ3pDLElBQUlrQixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsRUFBRTtNQUM3QlksY0FBYyxDQUFDOUIsQ0FBQyxFQUFFa0IsZ0JBQWdCLENBQUM7SUFDcEMsQ0FBQyxDQUFDO0lBQ0ZwQixJQUFJLENBQUNDLGdCQUFnQixDQUFDLFVBQVUsRUFBRWtDLGVBQWUsQ0FBQztJQUNsRG5DLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07TUFDcEMsSUFBTXBELENBQUMsR0FBRzJELFFBQVEsQ0FBQ1IsSUFBSSxDQUFDTSxPQUFPLENBQUN6RCxDQUFDLEVBQUUsRUFBRSxDQUFDO01BQ3RDLElBQU1DLENBQUMsR0FBRzBELFFBQVEsQ0FBQ1IsSUFBSSxDQUFDTSxPQUFPLENBQUN4RCxDQUFDLEVBQUUsRUFBRSxDQUFDO01BRXRDLElBQUkwQyxJQUFJLENBQUM5QixZQUFZLENBQUMwRCxnQkFBZ0IsRUFBRXZFLENBQUMsRUFBRUMsQ0FBQyxFQUFFLENBQUN1RSxZQUFZLENBQUMsRUFBRTtRQUM3RCxJQUFJO1VBQ0g3QixJQUFJLENBQUM3QixTQUFTLENBQUN2QixpREFBVSxDQUFDZ0YsZ0JBQWdCLENBQUMsRUFBRXZFLENBQUMsRUFBRUMsQ0FBQyxFQUFFLENBQUN1RSxZQUFZLENBQUM7O1VBRWpFO1VBQ0EsS0FBSyxJQUFJSyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdOLGdCQUFnQixFQUFFTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdDLElBQU1XLEtBQUssR0FBRyxDQUFDaEIsWUFBWSxHQUFHeEUsQ0FBQyxHQUFHQSxDQUFDLEdBQUc2RSxDQUFDO1lBQ3ZDLElBQU1ZLEtBQUssR0FBR2pCLFlBQVksR0FBR3ZFLENBQUMsR0FBR0EsQ0FBQyxHQUFHNEUsQ0FBQztZQUN0QyxJQUFNYSxRQUFRLEdBQUd6QyxRQUFRLENBQUNxQixhQUFhLHdCQUFBMUMsTUFBQSxDQUNoQjRELEtBQUssbUJBQUE1RCxNQUFBLENBQWM2RCxLQUFLLFFBQy9DLENBQUM7WUFDRCxJQUFJQyxRQUFRLEVBQUU7Y0FDYkEsUUFBUSxDQUFDbkMsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1lBQ3pDO1VBQ0Q7VUFFQWQsZ0JBQWdCLEdBQUcvRCxLQUFLLENBQUNhLEtBQUssQ0FBQyxDQUFDO1VBQ2hDLElBQUlrRCxnQkFBZ0IsS0FBS2pFLFNBQVMsRUFBRTtZQUNuQ2lFLGdCQUFnQixHQUFHLENBQUMsQ0FBQztZQUNyQmUsZUFBZSxDQUFDLENBQUM7WUFDakJqRCxpREFBUSxDQUFDLENBQUM7WUFDVkUsUUFBUSxDQUFDSSxJQUFJLEVBQUVDLElBQUksRUFBRUMsVUFBVSxDQUFDO1VBQ2pDO1VBQ0FuQixPQUFPLENBQUNDLEdBQUcsQ0FBQ2dCLElBQUksQ0FBQ0csV0FBVyxDQUFDQyxLQUFLLENBQUM7UUFDcEMsQ0FBQyxDQUFDLE9BQU80QyxLQUFLLEVBQUU7VUFDZjtRQUFBO01BRUYsQ0FBQyxNQUFNO1FBQ047TUFBQTtJQUVGLENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztFQUVGdEIsWUFBWSxDQUFDakIsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07SUFDNUNvQixZQUFZLEdBQUcsQ0FBQ0EsWUFBWTtFQUM3QixDQUFDLENBQUM7QUFDSDtBQUVBLGlFQUFlTCxRQUFROzs7Ozs7Ozs7Ozs7Ozs7QUNwTXZCLFNBQVM3RSxTQUFTQSxDQUFBLEVBQUc7RUFDcEIsSUFBTXlELEtBQUssR0FBRzZDLEtBQUssQ0FBQ0MsSUFBSSxDQUFDO0lBQUVuRixNQUFNLEVBQUU7RUFBRyxDQUFDLEVBQUU7SUFBQSxPQUFNa0YsS0FBSyxDQUFDQyxJQUFJLENBQUM7TUFBRW5GLE1BQU0sRUFBRTtJQUFHLENBQUMsQ0FBQztFQUFBLEVBQUM7RUFFMUUsU0FBU29GLG1CQUFtQkEsQ0FBQzlGLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0lBQ2xDLElBQUksT0FBT0QsQ0FBQyxLQUFLLFFBQVEsSUFBSUEsQ0FBQyxHQUFHLENBQUMsSUFBSUEsQ0FBQyxHQUFHLENBQUMsRUFDMUMsTUFBTSxJQUFJK0YsS0FBSyxDQUFDLDJCQUEyQixDQUFDO0lBQzdDLElBQUksT0FBTzlGLENBQUMsS0FBSyxRQUFRLElBQUlBLENBQUMsR0FBRyxDQUFDLElBQUlBLENBQUMsR0FBRyxDQUFDLEVBQzFDLE1BQU0sSUFBSThGLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztFQUM5QztFQUVBLFNBQVNsRixZQUFZQSxDQUFDRCxJQUFJLEVBQUVaLENBQUMsRUFBRUMsQ0FBQyxFQUFFK0YsVUFBVSxFQUFFO0lBQzdDRixtQkFBbUIsQ0FBQzlGLENBQUMsRUFBRUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksT0FBTytGLFVBQVUsS0FBSyxTQUFTLEVBQ2xDLE1BQU0sSUFBSUQsS0FBSyxDQUFDLDhCQUE4QixDQUFDO0lBQ2hELElBQU1yRixNQUFNLEdBQUdFLElBQUksQ0FBQ0YsTUFBTSxHQUFHLENBQUM7SUFDOUIsSUFBTXVGLElBQUksR0FBR0QsVUFBVSxHQUFHaEcsQ0FBQyxHQUFHQSxDQUFDLEdBQUdVLE1BQU07SUFDeEMsSUFBTXdGLElBQUksR0FBR0YsVUFBVSxHQUFHL0YsQ0FBQyxHQUFHUyxNQUFNLEdBQUdULENBQUM7SUFFeEMsSUFBSWdHLElBQUksR0FBRyxDQUFDLElBQUlDLElBQUksR0FBRyxDQUFDLEVBQUUsT0FBTyxLQUFLO0lBRXRDLEtBQUssSUFBSXJCLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSW5FLE1BQU0sRUFBRW1FLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDcEMsSUFBTXNCLE1BQU0sR0FBR0gsVUFBVSxHQUFHaEcsQ0FBQyxHQUFHQSxDQUFDLEdBQUc2RSxDQUFDO01BQ3JDLElBQU11QixNQUFNLEdBQUdKLFVBQVUsR0FBRy9GLENBQUMsR0FBRzRFLENBQUMsR0FBRzVFLENBQUM7TUFDckMsSUFBSThDLEtBQUssQ0FBQ3FELE1BQU0sQ0FBQyxDQUFDRCxNQUFNLENBQUMsS0FBSzdGLFNBQVMsRUFBRSxPQUFPLEtBQUs7O01BRXJEO01BQ0EsS0FBSyxJQUFJd0UsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFQSxJQUFJLElBQUksQ0FBQyxFQUFFQSxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ3pDLEtBQUssSUFBSUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFQSxJQUFJLElBQUksQ0FBQyxFQUFFQSxJQUFJLElBQUksQ0FBQyxFQUFFO1VBQ3pDLElBQU1DLFNBQVMsR0FBR21CLE1BQU0sR0FBR3JCLElBQUk7VUFDL0IsSUFBTUcsU0FBUyxHQUFHbUIsTUFBTSxHQUFHckIsSUFBSTs7VUFFL0I7VUFDQSxJQUNDQyxTQUFTLElBQUksQ0FBQyxJQUNkQSxTQUFTLEdBQUcsRUFBRSxJQUNkQyxTQUFTLElBQUksQ0FBQyxJQUNkQSxTQUFTLEdBQUcsRUFBRSxFQUNiO1lBQ0QsSUFBSWxDLEtBQUssQ0FBQ2tDLFNBQVMsQ0FBQyxDQUFDRCxTQUFTLENBQUMsS0FBSzFFLFNBQVMsRUFBRTtjQUM5QyxPQUFPLEtBQUs7WUFDYjtVQUNEO1FBQ0Q7TUFDRDtJQUNEO0lBRUEsT0FBTyxJQUFJO0VBQ1o7RUFFQSxTQUFTUSxTQUFTQSxDQUFDRixJQUFJLEVBQUVaLENBQUMsRUFBRUMsQ0FBQyxFQUFFK0YsVUFBVSxFQUFFO0lBQzFDLElBQUksQ0FBQ25GLFlBQVksQ0FBQ0QsSUFBSSxFQUFFWixDQUFDLEVBQUVDLENBQUMsRUFBRStGLFVBQVUsQ0FBQyxFQUFFO01BQzFDLE1BQU0sSUFBSUQsS0FBSyxDQUFDLHdCQUF3QixDQUFDO0lBQzFDO0lBRUEsS0FBSyxJQUFJbEIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHakUsSUFBSSxDQUFDRixNQUFNLEVBQUVtRSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3hDLElBQU13QixNQUFNLEdBQUdMLFVBQVUsR0FBR2hHLENBQUMsR0FBR0EsQ0FBQyxHQUFHNkUsQ0FBQztNQUNyQyxJQUFNeUIsTUFBTSxHQUFHTixVQUFVLEdBQUcvRixDQUFDLEdBQUc0RSxDQUFDLEdBQUc1RSxDQUFDO01BQ3JDOEMsS0FBSyxDQUFDdUQsTUFBTSxDQUFDLENBQUNELE1BQU0sQ0FBQyxHQUFHekYsSUFBSTtJQUM3QjtFQUNEO0VBRUEsU0FBU3NFLFNBQVNBLENBQUNsRixDQUFDLEVBQUVDLENBQUMsRUFBRTtJQUN4QixPQUFPOEMsS0FBSyxDQUFDOUMsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQyxLQUFLTSxTQUFTO0VBQ2pDO0VBRUEsU0FBU3dCLGFBQWFBLENBQUM5QixDQUFDLEVBQUVDLENBQUMsRUFBRTtJQUM1QjZGLG1CQUFtQixDQUFDOUYsQ0FBQyxFQUFFQyxDQUFDLENBQUM7SUFDekIsSUFBSThDLEtBQUssQ0FBQzlDLENBQUMsQ0FBQyxDQUFDRCxDQUFDLENBQUMsS0FBS00sU0FBUyxFQUFFO01BQzlCeUMsS0FBSyxDQUFDOUMsQ0FBQyxDQUFDLENBQUNELENBQUMsQ0FBQyxHQUFHLE1BQU07TUFDcEIsT0FBTyxNQUFNO0lBQ2Q7SUFDQStDLEtBQUssQ0FBQzlDLENBQUMsQ0FBQyxDQUFDRCxDQUFDLENBQUMsQ0FBQ3VHLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLElBQUl4RCxLQUFLLENBQUM5QyxDQUFDLENBQUMsQ0FBQ0QsQ0FBQyxDQUFDLENBQUN3RyxJQUFJLEVBQUUsT0FBTyxNQUFNO0lBQ25DLE9BQU8sS0FBSztFQUNiO0VBRUEsU0FBU3hFLFlBQVlBLENBQUEsRUFBRztJQUN2QixPQUFPZSxLQUFLLENBQUMwRCxLQUFLLENBQUMsVUFBQ0MsR0FBRztNQUFBLE9BQ3RCQSxHQUFHLENBQUNELEtBQUssQ0FDUixVQUFDdEQsSUFBSTtRQUFBLE9BQ0pBLElBQUksS0FBSzdDLFNBQVMsSUFDbEI2QyxJQUFJLEtBQUssTUFBTSxJQUNkd0QsT0FBQSxDQUFPeEQsSUFBSSxNQUFLLFFBQVEsSUFBSUEsSUFBSSxDQUFDcUQsSUFBSztNQUFBLENBQ3pDLENBQUM7SUFBQSxDQUNGLENBQUM7RUFDRjtFQUVBLE9BQU87SUFDTixJQUFJekQsS0FBS0EsQ0FBQSxFQUFHO01BQ1gsT0FBT0EsS0FBSztJQUNiLENBQUM7SUFDRGxDLFlBQVksRUFBWkEsWUFBWTtJQUNaQyxTQUFTLEVBQVRBLFNBQVM7SUFDVG9FLFNBQVMsRUFBVEEsU0FBUztJQUNUcEQsYUFBYSxFQUFiQSxhQUFhO0lBQ2JFLFlBQVksRUFBWkE7RUFDRCxDQUFDO0FBQ0Y7QUFFQSxpRUFBZTFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdnQjtBQUV4QyxTQUFTdUgsTUFBTUEsQ0FBQSxFQUFHO0VBQ2pCLElBQU1DLEdBQUcsR0FBRzdELFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDekNELEdBQUcsQ0FBQ3ZELFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxTQUFTLENBQUM7O0VBRTVCO0VBQ0EsSUFBTTJCLFFBQVEsR0FBRy9ELFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDOUNDLFFBQVEsQ0FBQ3pELFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDOUIyQixRQUFRLENBQUNDLEdBQUcsR0FBR0wsNkNBQU87RUFDdEJJLFFBQVEsQ0FBQ0UsR0FBRyxHQUFHLFNBQVM7O0VBRXhCO0VBQ0EsSUFBTUMsUUFBUSxHQUFHbEUsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUM5Q0ksUUFBUSxDQUFDNUQsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLFFBQVEsQ0FBQztFQUNoQyxJQUFNK0IsS0FBSyxHQUFHbkUsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLElBQUksQ0FBQztFQUMxQ0ssS0FBSyxDQUFDQyxXQUFXLEdBQUcsWUFBWTtFQUNoQ0YsUUFBUSxDQUFDRyxXQUFXLENBQUNGLEtBQUssQ0FBQztFQUUzQixJQUFNRyxTQUFTLEdBQUd0RSxRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQy9DUSxTQUFTLENBQUNoRSxTQUFTLENBQUM4QixHQUFHLENBQUMsTUFBTSxDQUFDO0VBQy9Ca0MsU0FBUyxDQUFDTixHQUFHLEdBQUdMLDZDQUFPO0VBQ3ZCVyxTQUFTLENBQUNMLEdBQUcsR0FBRyxTQUFTO0VBRXpCSixHQUFHLENBQUNRLFdBQVcsQ0FBQ04sUUFBUSxDQUFDO0VBQ3pCRixHQUFHLENBQUNRLFdBQVcsQ0FBQ0gsUUFBUSxDQUFDO0VBQ3pCTCxHQUFHLENBQUNRLFdBQVcsQ0FBQ0MsU0FBUyxDQUFDO0VBRTFCdEUsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDZ0QsV0FBVyxDQUFDUixHQUFHLENBQUM7QUFDdkQ7QUFFQSxTQUFTVSxXQUFXQSxDQUFBLEVBQUc7RUFDdEIsSUFBTUMsSUFBSSxHQUFHeEUsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUMxQ1UsSUFBSSxDQUFDbEUsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLGNBQWMsQ0FBQztFQUNsQ3BDLFFBQVEsQ0FBQ3FCLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQ2dELFdBQVcsQ0FBQ0csSUFBSSxDQUFDO0FBQ3hEO0FBRUEsU0FBU0MsSUFBSUEsQ0FBQSxFQUFHO0VBQ2YsSUFBTUMsT0FBTyxHQUFHMUUsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUM3Q1ksT0FBTyxDQUFDcEUsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLFVBQVUsQ0FBQztFQUNqQyxJQUFNdUMsYUFBYSxHQUFHM0UsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUNuRGEsYUFBYSxDQUFDckUsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0VBQzdDLElBQU13QyxRQUFRLEdBQUc1RSxRQUFRLENBQUM4RCxhQUFhLENBQUMsR0FBRyxDQUFDO0VBQzVDYyxRQUFRLENBQUNSLFdBQVcsR0FBRyxXQUFXO0VBQ2xDTyxhQUFhLENBQUNOLFdBQVcsQ0FBQ08sUUFBUSxDQUFDO0VBQ25DRixPQUFPLENBQUNMLFdBQVcsQ0FBQ00sYUFBYSxDQUFDO0VBQ2xDM0UsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUNnRCxXQUFXLENBQUNLLE9BQU8sQ0FBQztBQUNoRTtBQUVBLFNBQVNHLFdBQVdBLENBQUEsRUFBRztFQUN0QixJQUFNL0UsS0FBSyxHQUFHRSxRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzNDaEUsS0FBSyxDQUFDUSxTQUFTLENBQUM4QixHQUFHLENBQUMsT0FBTyxDQUFDO0VBQzVCcEMsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUNnRCxXQUFXLENBQUN2RSxLQUFLLENBQUM7QUFDOUQ7QUFFQSxTQUFTRCxXQUFXQSxDQUFBLEVBQUc7RUFDdEIsSUFBTUMsS0FBSyxHQUFHRSxRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzNDaEUsS0FBSyxDQUFDUSxTQUFTLENBQUM4QixHQUFHLENBQUMsUUFBUSxDQUFDO0VBRTdCLElBQU0wQyxVQUFVLEdBQUc5RSxRQUFRLENBQUM4RCxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQy9DZ0IsVUFBVSxDQUFDVixXQUFXLEdBQUcsWUFBWTtFQUNyQ3RFLEtBQUssQ0FBQ3VFLFdBQVcsQ0FBQ1MsVUFBVSxDQUFDO0VBRTdCLElBQU1DLFNBQVMsR0FBRy9FLFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDL0NpQixTQUFTLENBQUN6RSxTQUFTLENBQUM4QixHQUFHLENBQUMsWUFBWSxDQUFDO0VBQ3JDdEMsS0FBSyxDQUFDdUUsV0FBVyxDQUFDVSxTQUFTLENBQUM7RUFFNUIvRSxRQUFRLENBQUNxQixhQUFhLENBQUMsV0FBVyxDQUFDLENBQUNnRCxXQUFXLENBQUN2RSxLQUFLLENBQUM7QUFDdkQ7QUFFQSxTQUFTa0YsVUFBVUEsQ0FBQSxFQUFHO0VBQ3JCLElBQU1sRixLQUFLLEdBQUdFLFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDM0NoRSxLQUFLLENBQUNRLFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxPQUFPLENBQUM7RUFFNUIsSUFBTTBDLFVBQVUsR0FBRzlFLFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDL0NnQixVQUFVLENBQUNWLFdBQVcsR0FBRyxhQUFhO0VBQ3RDdEUsS0FBSyxDQUFDdUUsV0FBVyxDQUFDUyxVQUFVLENBQUM7RUFFN0IsSUFBTUMsU0FBUyxHQUFHL0UsUUFBUSxDQUFDOEQsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUMvQ2lCLFNBQVMsQ0FBQ3pFLFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxZQUFZLENBQUM7RUFDckN0QyxLQUFLLENBQUN1RSxXQUFXLENBQUNVLFNBQVMsQ0FBQztFQUU1Qi9FLFFBQVEsQ0FBQ3FCLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQ2dELFdBQVcsQ0FBQ3ZFLEtBQUssQ0FBQztBQUN2RDtBQUVBLFNBQVNtRixlQUFlQSxDQUFDbkksS0FBSyxFQUFFO0VBQy9CLElBQUlpSSxTQUFTO0VBQ2IsSUFBSWpJLEtBQUssRUFBRTtJQUNWaUksU0FBUyxHQUFHL0UsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLDBCQUEwQixDQUFDO0VBQy9ELENBQUMsTUFBTTtJQUNOMEQsU0FBUyxHQUFHL0UsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLDJCQUEyQixDQUFDO0VBQ2hFO0VBQ0EsT0FBTzBELFNBQVM7QUFDakI7QUFFQSxTQUFTOUYsU0FBU0EsQ0FBQ2EsS0FBSyxFQUFtQjtFQUFBLElBQWpCb0YsT0FBTyxHQUFBQyxTQUFBLENBQUExSCxNQUFBLFFBQUEwSCxTQUFBLFFBQUE5SCxTQUFBLEdBQUE4SCxTQUFBLE1BQUcsS0FBSztFQUN4QyxJQUFNSixTQUFTLEdBQUdFLGVBQWUsQ0FBQ0MsT0FBTyxDQUFDO0VBQzFDSCxTQUFTLENBQUNLLFNBQVMsR0FBRyxFQUFFO0VBQ3hCLEtBQUssSUFBSXhELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzlCLEtBQUssQ0FBQ3JDLE1BQU0sRUFBRW1FLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDekMsS0FBSyxJQUFJeUQsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHdkYsS0FBSyxDQUFDOEIsQ0FBQyxDQUFDLENBQUNuRSxNQUFNLEVBQUU0SCxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzVDLElBQU1uRixJQUFJLEdBQUdGLFFBQVEsQ0FBQzhELGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDMUM1RCxJQUFJLENBQUNJLFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxNQUFNLENBQUM7TUFDMUJsQyxJQUFJLENBQUNNLE9BQU8sQ0FBQ3pELENBQUMsR0FBR3NJLENBQUM7TUFDbEJuRixJQUFJLENBQUNNLE9BQU8sQ0FBQ3hELENBQUMsR0FBRzRFLENBQUM7TUFFbEIsSUFBSTlCLEtBQUssQ0FBQzhCLENBQUMsQ0FBQyxDQUFDeUQsQ0FBQyxDQUFDLEtBQUtoSSxTQUFTLElBQUksQ0FBQzZILE9BQU8sRUFBRTtRQUMxQ2hGLElBQUksQ0FBQ0ksU0FBUyxDQUFDOEIsR0FBRyxDQUFDLE1BQU0sQ0FBQztNQUMzQjtNQUNBMkMsU0FBUyxDQUFDVixXQUFXLENBQUNuRSxJQUFJLENBQUM7SUFDNUI7RUFDRDtBQUNEO0FBRUEsU0FBU29GLElBQUlBLENBQUN2SSxDQUFDLEVBQUVDLENBQUMsRUFBRUYsS0FBSyxFQUFFO0VBQzFCLElBQU1pSSxTQUFTLEdBQUdFLGVBQWUsQ0FBQ25JLEtBQUssQ0FBQztFQUN4QyxJQUFNb0QsSUFBSSxHQUFHNkUsU0FBUyxDQUFDUSxRQUFRLENBQUN2SSxDQUFDLEdBQUcsRUFBRSxHQUFHRCxDQUFDLENBQUM7RUFDM0NtRCxJQUFJLENBQUNJLFNBQVMsQ0FBQzhCLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDM0I7QUFFQSxTQUFTa0IsR0FBR0EsQ0FBQ3ZHLENBQUMsRUFBRUMsQ0FBQyxFQUFFRixLQUFLLEVBQUU7RUFDekIsSUFBTWlJLFNBQVMsR0FBR0UsZUFBZSxDQUFDbkksS0FBSyxDQUFDO0VBQ3hDLElBQU1vRCxJQUFJLEdBQUc2RSxTQUFTLENBQUNRLFFBQVEsQ0FBQ3ZJLENBQUMsR0FBRyxFQUFFLEdBQUdELENBQUMsQ0FBQztFQUMzQ21ELElBQUksQ0FBQ0ksU0FBUyxDQUFDOEIsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUMxQjtBQUVBLFNBQVNsRCxXQUFXQSxDQUFDbkMsQ0FBQyxFQUFFQyxDQUFDLEVBQUU0RCxNQUFNLEVBQUU5RCxLQUFLLEVBQUU7RUFDekMsSUFBSThELE1BQU0sS0FBSyxNQUFNLEVBQUU7SUFDdEIwRSxJQUFJLENBQUN2SSxDQUFDLEVBQUVDLENBQUMsRUFBRUYsS0FBSyxDQUFDO0VBQ2xCLENBQUMsTUFBTSxJQUFJOEQsTUFBTSxLQUFLLEtBQUssRUFBRTtJQUM1QjBDLEdBQUcsQ0FBQ3ZHLENBQUMsRUFBRUMsQ0FBQyxFQUFFRixLQUFLLENBQUM7RUFDakI7QUFDRDtBQUVBLFNBQVMwSSxTQUFTQSxDQUFBLEVBQUc7RUFDcEIsSUFBTWhCLElBQUksR0FBR3hFLFFBQVEsQ0FBQ3FCLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztFQUN2RG1ELElBQUksQ0FBQ1ksU0FBUyxHQUFHLEVBQUU7RUFDbkJYLElBQUksQ0FBQyxDQUFDO0VBQ04sSUFBTUcsUUFBUSxHQUFHNUUsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0VBQy9EdUQsUUFBUSxDQUFDUixXQUFXLEdBQUcsaURBQWlEO0VBRXhFLElBQU1xQixlQUFlLEdBQUd6RixRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3JEMkIsZUFBZSxDQUFDbkYsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0VBRWpELElBQU1oQixZQUFZLEdBQUdwQixRQUFRLENBQUM4RCxhQUFhLENBQUMsUUFBUSxDQUFDO0VBQ3JEMUMsWUFBWSxDQUFDZCxTQUFTLENBQUM4QixHQUFHLENBQUMsZUFBZSxDQUFDO0VBQzNDaEIsWUFBWSxDQUFDZ0QsV0FBVyxHQUFHLFFBQVE7RUFDbkNxQixlQUFlLENBQUNwQixXQUFXLENBQUNqRCxZQUFZLENBQUM7RUFDekNvRCxJQUFJLENBQUNILFdBQVcsQ0FBQ29CLGVBQWUsQ0FBQztFQUVqQyxJQUFNVixTQUFTLEdBQUcvRSxRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQy9DaUIsU0FBUyxDQUFDekUsU0FBUyxDQUFDOEIsR0FBRyxDQUFDLFlBQVksQ0FBQztFQUNyQ29DLElBQUksQ0FBQ0gsV0FBVyxDQUFDVSxTQUFTLENBQUM7RUFFM0IsS0FBSyxJQUFJbkQsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLEdBQUcsRUFBRUEsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNoQyxJQUFNMUIsSUFBSSxHQUFHRixRQUFRLENBQUM4RCxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQzFDNUQsSUFBSSxDQUFDSSxTQUFTLENBQUM4QixHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzFCbEMsSUFBSSxDQUFDSSxTQUFTLENBQUM4QixHQUFHLENBQUMsV0FBVyxDQUFDO0lBQy9CbEMsSUFBSSxDQUFDTSxPQUFPLENBQUN6RCxDQUFDLEdBQUc2RSxDQUFDLEdBQUcsRUFBRTtJQUN2QjFCLElBQUksQ0FBQ00sT0FBTyxDQUFDeEQsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQzBFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkNtRCxTQUFTLENBQUNWLFdBQVcsQ0FBQ25FLElBQUksQ0FBQztFQUM1QjtBQUNEO0FBRUEsU0FBU2QsUUFBUUEsQ0FBQSxFQUFHO0VBQ25CLElBQU1vRixJQUFJLEdBQUd4RSxRQUFRLENBQUNxQixhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDdkRtRCxJQUFJLENBQUNZLFNBQVMsR0FBRyxFQUFFO0VBQ25CWCxJQUFJLENBQUMsQ0FBQztFQUNOSSxXQUFXLENBQUMsQ0FBQztFQUNiaEYsV0FBVyxDQUFDLENBQUM7RUFDYm1GLFVBQVUsQ0FBQyxDQUFDO0FBQ2I7QUFFQSxTQUFTN0YsVUFBVUEsQ0FBQ3ZDLE1BQU0sRUFBRTtFQUMzQixJQUFNZ0ksUUFBUSxHQUFHNUUsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0VBQy9EdUQsUUFBUSxDQUFDYyxLQUFLLENBQUNDLE9BQU8sR0FBRyxHQUFHO0VBQzVCO0VBQ0E5RSxVQUFVLENBQUMsWUFBTTtJQUNoQitELFFBQVEsQ0FBQ1IsV0FBVyxHQUFHeEgsTUFBTSxHQUFHLFdBQVcsR0FBRyxpQkFBaUI7SUFDL0Q7SUFDQWdJLFFBQVEsQ0FBQ2MsS0FBSyxDQUFDQyxPQUFPLEdBQUcsR0FBRztFQUM3QixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNWO0FBRUEsU0FBU3RHLE1BQU1BLENBQUNkLE1BQU0sRUFBRTtFQUN2QixJQUFNcUcsUUFBUSxHQUFHNUUsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLHNCQUFzQixDQUFDO0VBQy9EdUQsUUFBUSxDQUFDUixXQUFXLE1BQUF6RixNQUFBLENBQU1KLE1BQU0sVUFBTztBQUN4QztBQUVBLFNBQVNxSCxJQUFJQSxDQUFBLEVBQUc7RUFDZmhDLE1BQU0sQ0FBQyxDQUFDO0VBQ1JXLFdBQVcsQ0FBQyxDQUFDO0VBQ2JpQixTQUFTLENBQUMsQ0FBQztBQUNaO0FBRUEsaUVBQWVJLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xNZ0I7QUFFcEMsU0FBU3JILE1BQU1BLENBQUEsRUFBcUI7RUFBQSxJQUFwQnNILElBQUksR0FBQVYsU0FBQSxDQUFBMUgsTUFBQSxRQUFBMEgsU0FBQSxRQUFBOUgsU0FBQSxHQUFBOEgsU0FBQSxNQUFHLFdBQVc7RUFDakMsSUFBTXRGLFdBQVcsR0FBR3hELHNEQUFTLENBQUMsQ0FBQztFQUMvQixJQUFNZSxRQUFRLEdBQUd1RixLQUFLLENBQUNDLElBQUksQ0FBQztJQUFFbkYsTUFBTSxFQUFFO0VBQUcsQ0FBQyxFQUFFO0lBQUEsT0FBTWtGLEtBQUssQ0FBQ0MsSUFBSSxDQUFDO01BQUVuRixNQUFNLEVBQUU7SUFBRyxDQUFDLENBQUM7RUFBQSxFQUFDO0VBQzdFLElBQUliLE1BQU0sR0FBRyxLQUFLO0VBRWxCLFNBQVNpQixTQUFTQSxDQUFDRixJQUFJLEVBQUU4RixHQUFHLEVBQUVxQyxHQUFHLEVBQUVwSSxRQUFRLEVBQUU7SUFDNUNtQyxXQUFXLENBQUNoQyxTQUFTLENBQUNGLElBQUksRUFBRThGLEdBQUcsRUFBRXFDLEdBQUcsRUFBRXBJLFFBQVEsQ0FBQztFQUNoRDtFQUVBLFNBQVNFLFlBQVlBLENBQUNELElBQUksRUFBRThGLEdBQUcsRUFBRXFDLEdBQUcsRUFBRXBJLFFBQVEsRUFBRTtJQUMvQyxPQUFPbUMsV0FBVyxDQUFDakMsWUFBWSxDQUFDRCxJQUFJLEVBQUU4RixHQUFHLEVBQUVxQyxHQUFHLEVBQUVwSSxRQUFRLENBQUM7RUFDMUQ7RUFFQSxTQUFTbUIsYUFBYUEsQ0FBQzRFLEdBQUcsRUFBRXFDLEdBQUcsRUFBRTtJQUNoQyxJQUFNbEYsTUFBTSxHQUFHZixXQUFXLENBQUNoQixhQUFhLENBQUM0RSxHQUFHLEVBQUVxQyxHQUFHLENBQUM7SUFDbEQsSUFBSWxGLE1BQU0sS0FBSyxLQUFLLEVBQUU7TUFDckJ4RCxRQUFRLENBQUMwSSxHQUFHLENBQUMsQ0FBQ3JDLEdBQUcsQ0FBQyxHQUFHLEtBQUs7SUFDM0IsQ0FBQyxNQUFNLElBQUk3QyxNQUFNLEtBQUssTUFBTSxFQUFFO01BQzdCeEQsUUFBUSxDQUFDMEksR0FBRyxDQUFDLENBQUNyQyxHQUFHLENBQUMsR0FBRyxNQUFNO0lBQzVCLENBQUMsTUFBTTtNQUNOckcsUUFBUSxDQUFDMEksR0FBRyxDQUFDLENBQUNyQyxHQUFHLENBQUMsR0FBRyxNQUFNO0lBQzVCO0lBQ0FoRixPQUFPLENBQUNDLEdBQUcsbUJBQW1CLENBQUM7SUFDL0JELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDdEIsUUFBUSxDQUFDO0lBQ3JCLE9BQU93RCxNQUFNO0VBQ2Q7RUFFQSxTQUFTdEMsTUFBTUEsQ0FBQ21GLEdBQUcsRUFBRXFDLEdBQUcsRUFBRWhKLEtBQUssRUFBRTtJQUNoQyxPQUFPQSxLQUFLLENBQUMrQixhQUFhLENBQUM0RSxHQUFHLEVBQUVxQyxHQUFHLENBQUM7RUFDckM7RUFFQSxTQUFTaEgsT0FBT0EsQ0FBQSxFQUFHO0lBQ2xCLE9BQU9lLFdBQVcsQ0FBQ2QsWUFBWSxDQUFDLENBQUM7RUFDbEM7RUFFQSxPQUFPO0lBQ044RyxJQUFJLEVBQUpBLElBQUk7SUFDSmhJLFNBQVMsRUFBVEEsU0FBUztJQUNURCxZQUFZLEVBQVpBLFlBQVk7SUFDWmlCLGFBQWEsRUFBYkEsYUFBYTtJQUNiUCxNQUFNLEVBQU5BLE1BQU07SUFDTlEsT0FBTyxFQUFQQSxPQUFPO0lBQ1AsSUFBSWxDLE1BQU1BLENBQUEsRUFBRztNQUNaLE9BQU9BLE1BQU07SUFDZCxDQUFDO0lBQ0QsSUFBSUEsTUFBTUEsQ0FBQ29DLEtBQUssRUFBRTtNQUNqQnBDLE1BQU0sR0FBR29DLEtBQUs7SUFDZixDQUFDO0lBQ0QsSUFBSWEsV0FBV0EsQ0FBQSxFQUFHO01BQ2pCLE9BQU9BLFdBQVc7SUFDbkIsQ0FBQztJQUNELElBQUl6QyxRQUFRQSxDQUFBLEVBQUc7TUFDZCxPQUFPQSxRQUFRO0lBQ2hCO0VBQ0QsQ0FBQztBQUNGO0FBRUEsaUVBQWVtQixNQUFNOzs7Ozs7Ozs7Ozs7OztBQzNEckIsU0FBU2pDLFVBQVVBLENBQUNtQixNQUFNLEVBQUU7RUFDM0IsSUFBSSxPQUFPQSxNQUFNLEtBQUssUUFBUSxFQUFFLE1BQU0sSUFBSXFGLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQztFQUMxRSxJQUFJckYsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLElBQUlxRixLQUFLLENBQUMsK0JBQStCLENBQUM7RUFDaEUsSUFBSXJGLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sSUFBSXFGLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztFQUNsRSxJQUFJckYsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLElBQUlxRixLQUFLLENBQUMsNEJBQTRCLENBQUM7RUFFN0QsSUFBSWlELE9BQU8sR0FBRyxDQUFDO0VBQ2YsSUFBSXhDLElBQUksR0FBRyxLQUFLO0VBRWhCLE9BQU87SUFDTixJQUFJOUYsTUFBTUEsQ0FBQSxFQUFHO01BQ1osT0FBT0EsTUFBTTtJQUNkLENBQUM7SUFDRCxJQUFJc0ksT0FBT0EsQ0FBQSxFQUFHO01BQ2IsT0FBT0EsT0FBTztJQUNmLENBQUM7SUFDRCxJQUFJeEMsSUFBSUEsQ0FBQSxFQUFHO01BQ1YsT0FBT0EsSUFBSTtJQUNaLENBQUM7SUFDREQsR0FBRyxXQUFBQSxJQUFBLEVBQUc7TUFDTHlDLE9BQU8sSUFBSSxDQUFDO01BQ1osSUFBSUEsT0FBTyxLQUFLdEksTUFBTSxFQUFFO1FBQ3ZCOEYsSUFBSSxHQUFHLElBQUk7TUFDWjtJQUNEO0VBQ0QsQ0FBQztBQUNGO0FBRUEsaUVBQWVqSCxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QnpCO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QjtBQUN4QixzQkFBc0I7QUFDdEI7O0FBRUE7QUFDQSxxQkFBcUI7QUFDckIsbUNBQW1DO0FBQ25DLGtCQUFrQjtBQUNsQixtQkFBbUI7QUFDbkIsNEJBQTRCO0FBQzVCLGdCQUFnQjtBQUNoQiw0QkFBNEI7QUFDNUIsc0JBQXNCO0FBQ3RCLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkMsNEJBQTRCO0FBQzVCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUIsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0I7QUFDeEIsc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1GQUFtRixZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxXQUFXLFVBQVUsZUFBZSxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyx3QkFBd0IseUJBQXlCLE9BQU8sS0FBSyx3QkFBd0IseUJBQXlCLHVCQUF1Qix5QkFBeUIseUJBQXlCLHVCQUF1Qix5QkFBeUIseUJBQXlCLHVCQUF1QixhQUFhLE9BQU8sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsVUFBVSxLQUFLLFNBQVMsS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyx3QkFBd0IseUJBQXlCLHlCQUF5Qix5QkFBeUIsYUFBYSxXQUFXLFlBQVksdUJBQXVCLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLE1BQU0sT0FBTyxPQUFPLEtBQUssd0JBQXdCLHlCQUF5QixPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssd0JBQXdCLHlCQUF5QixPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxnQ0FBZ0MsZ0NBQWdDLGtDQUFrQywrQkFBK0IsZ0NBQWdDLG1DQUFtQyxrQ0FBa0MsbUNBQW1DLDBCQUEwQixzQ0FBc0MsMENBQTBDLDRCQUE0Qiw2QkFBNkIsNkJBQTZCLGdDQUFnQyxpQ0FBaUMsMENBQTBDLGtDQUFrQyxxQ0FBcUMsOEJBQThCLGdDQUFnQyw0QkFBNEIsMEJBQTBCLDJCQUEyQixpQ0FBaUMseUJBQXlCLG1CQUFtQiw4QkFBOEIsY0FBYyxlQUFlLHFOQUFxTixtQkFBbUIsR0FBRyxpQkFBaUIsa0JBQWtCLDJCQUEyQixnQ0FBZ0MseUJBQXlCLGtCQUFrQixHQUFHLGNBQWMsOENBQThDLGtCQUFrQiw0QkFBNEIsd0JBQXdCLGNBQWMsb0JBQW9CLHlCQUF5QixHQUFHLG1CQUFtQixrQkFBa0IsMkJBQTJCLDRCQUE0QixjQUFjLG9CQUFvQixHQUFHLG1CQUFtQiwyQkFBMkIsZ0ZBQWdGLHVCQUF1QixnQkFBZ0Isd0JBQXdCLG9FQUFvRSxtREFBbUQsNERBQTRELGlGQUFpRiw2Q0FBNkMscUVBQXFFLHlFQUF5RSx1REFBdUQsMEVBQTBFLEdBQUcsc0JBQXNCLG9CQUFvQixxREFBcUQscURBQXFELFdBQVcsZ0JBQWdCLGlCQUFpQixHQUFHLHFCQUFxQixlQUFlLGlCQUFpQix3QkFBd0Isb0NBQW9DLHNCQUFzQix1QkFBdUIsMEJBQTBCLG1IQUFtSCxzSEFBc0gsK0NBQStDLEdBQUcscUJBQXFCLHNCQUFzQixzQkFBc0IsbUJBQW1CLHdDQUF3Qyw2REFBNkQseUVBQXlFLCtEQUErRCw0RUFBNEUsY0FBYyx5Q0FBeUMsZ0JBQWdCLDRCQUE0Qix1QkFBdUIsa0JBQWtCLDJCQUEyQiw0QkFBNEIsd0JBQXdCLEdBQUcsb0JBQW9CLDhCQUE4QixxQkFBcUIsOEJBQThCLHVCQUF1Qix1QkFBdUIsc0JBQXNCLG9CQUFvQiwwRUFBMEUsR0FBRywwQkFBMEIsK0JBQStCLHFEQUFxRCw0QkFBNEIsWUFBWSxrQkFBa0IsMENBQTBDLGNBQWMsd0JBQXdCLDBCQUEwQiw0QkFBNEIsMEJBQTBCLEdBQUcscUJBQXFCLGdDQUFnQyxHQUFHLG1CQUFtQiwyQkFBMkIsaUVBQWlFLHVCQUF1Qix5Q0FBeUMsZ0NBQWdDLEdBQUcsZUFBZSxjQUFjLEdBQUcsZUFBZSxrQkFBa0IsMkJBQTJCLDRCQUE0Qix3QkFBd0IsR0FBRyxvQkFBb0Isa0JBQWtCLHlEQUF5RCx1QkFBdUIsYUFBYSx3QkFBd0IsMEJBQTBCLDRCQUE0QiwwQkFBMEIsR0FBRywwQkFBMEIsNEJBQTRCLGlCQUFpQixnQkFBZ0IsaUNBQWlDLEdBQUcsc0JBQXNCLGtCQUFrQiwyQkFBMkIsNEJBQTRCLHdCQUF3QixjQUFjLEdBQUcsV0FBVyw4QkFBOEIsR0FBRyxXQUFXLGdDQUFnQyxHQUFHLGtCQUFrQixnQ0FBZ0MsZ0NBQWdDLEdBQUcscUJBQXFCO0FBQ3IrTztBQUNBLGlFQUFlLHVCQUF1QixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaFB2QztBQUM2RztBQUNqQjtBQUM1Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQixpQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQjtBQUMxQixZQUFZO0FBQ1osb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DO0FBQ3BDLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCLG9DQUFvQztBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLFlBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6QixpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQixhQUFhO0FBQ2Isc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEMsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0IsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnR0FBZ0csTUFBTSxRQUFRLFFBQVEsTUFBTSxLQUFLLHNCQUFzQix1QkFBdUIsT0FBTyxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFFBQVEsUUFBUSxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQix1QkFBdUIsT0FBTyxPQUFPLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxPQUFPLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLHVCQUF1QixPQUFPLE1BQU0sTUFBTSxNQUFNLFlBQVksT0FBTyxPQUFPLE1BQU0sT0FBTyxzQkFBc0IscUJBQXFCLE9BQU8sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sTUFBTSxNQUFNLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sU0FBUyxzQkFBc0IscUJBQXFCLHVCQUF1QixxQkFBcUIsT0FBTyxPQUFPLE1BQU0sTUFBTSxVQUFVLFlBQVksT0FBTyxPQUFPLE1BQU0sTUFBTSxVQUFVLFlBQVksT0FBTyxNQUFNLE1BQU0sUUFBUSxZQUFZLE9BQU8sTUFBTSxNQUFNLFFBQVEsWUFBWSxXQUFXLE1BQU0sTUFBTSxNQUFNLFFBQVEsWUFBWSxPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxTQUFTLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLHFCQUFxQixxQkFBcUIscUJBQXFCLHVCQUF1QixPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxNQUFNLE1BQU0sc0JBQXNCLHFCQUFxQixPQUFPLE1BQU0sTUFBTSxNQUFNLFVBQVUsTUFBTSxPQUFPLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIsT0FBTyxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsc1ZBQXNWLHVCQUF1QiwyQ0FBMkMsVUFBVSw4SkFBOEosY0FBYyxHQUFHLHdFQUF3RSxtQkFBbUIsR0FBRyxzSkFBc0osbUJBQW1CLHFCQUFxQixHQUFHLG9OQUFvTiw2QkFBNkIsc0JBQXNCLDhCQUE4QixVQUFVLHVKQUF1Six1Q0FBdUMsMkJBQTJCLFVBQVUseUxBQXlMLGtDQUFrQyxHQUFHLDBKQUEwSix5QkFBeUIsdUNBQXVDLDhDQUE4QyxVQUFVLHlGQUF5Rix3QkFBd0IsR0FBRyxxS0FBcUssdUNBQXVDLDJCQUEyQixVQUFVLHNFQUFzRSxtQkFBbUIsR0FBRyxvSEFBb0gsbUJBQW1CLG1CQUFtQix1QkFBdUIsNkJBQTZCLEdBQUcsU0FBUyxvQkFBb0IsR0FBRyxTQUFTLGdCQUFnQixHQUFHLHFMQUFxTCx1QkFBdUIsR0FBRyw0UEFBNFAsMEJBQTBCLDRCQUE0Qiw4QkFBOEIsc0JBQXNCLFVBQVUsK0ZBQStGLGlDQUFpQyxHQUFHLG9LQUFvSyxvQ0FBb0MsR0FBRyx5SkFBeUosK0JBQStCLEdBQUcsK01BQStNLHVCQUF1QixlQUFlLEdBQUcsd01BQXdNLG1DQUFtQyxHQUFHLDhEQUE4RCxtQ0FBbUMsR0FBRyx3UUFBd1EsNEJBQTRCLDJCQUEyQiwyQkFBMkIsNEJBQTRCLHVCQUF1QixnQ0FBZ0MsVUFBVSxnR0FBZ0csNkJBQTZCLEdBQUcsK0VBQStFLG1CQUFtQixHQUFHLHdJQUF3SSw0QkFBNEIsdUJBQXVCLFVBQVUsd0xBQXdMLGlCQUFpQixHQUFHLHVJQUF1SSxtQ0FBbUMsaUNBQWlDLFVBQVUsMEhBQTBILDZCQUE2QixHQUFHLDZLQUE2SyxnQ0FBZ0MsMEJBQTBCLFVBQVUsc0xBQXNMLG1CQUFtQixHQUFHLHFFQUFxRSx1QkFBdUIsR0FBRyw4SkFBOEosa0JBQWtCLEdBQUcsZ0VBQWdFLGtCQUFrQixHQUFHLHFCQUFxQjtBQUN0MlE7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7QUN0VzFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUFxRztBQUNyRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHFGQUFPOzs7O0FBSStDO0FBQ3ZFLE9BQU8saUVBQWUscUZBQU8sSUFBSSxxRkFBTyxVQUFVLHFGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCN0UsTUFBa0c7QUFDbEcsTUFBd0Y7QUFDeEYsTUFBK0Y7QUFDL0YsTUFBa0g7QUFDbEgsTUFBMkc7QUFDM0csTUFBMkc7QUFDM0csTUFBMEc7QUFDMUc7QUFDQTs7QUFFQTs7QUFFQSw0QkFBNEIscUdBQW1CO0FBQy9DLHdCQUF3QixrSEFBYTs7QUFFckMsdUJBQXVCLHVHQUFhO0FBQ3BDO0FBQ0EsaUJBQWlCLCtGQUFNO0FBQ3ZCLDZCQUE2QixzR0FBa0I7O0FBRS9DLGFBQWEsMEdBQUcsQ0FBQywwRkFBTzs7OztBQUlvRDtBQUM1RSxPQUFPLGlFQUFlLDBGQUFPLElBQUksMEZBQU8sVUFBVSwwRkFBTyxtQkFBbUIsRUFBQzs7Ozs7Ozs7Ozs7QUMxQmhFOztBQUViO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbkZhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2pDYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVGE7O0FBRWI7QUFDQTtBQUNBLGNBQWMsS0FBd0MsR0FBRyxzQkFBaUIsR0FBRyxDQUFJO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7Ozs7Ozs7Ozs7Ozs7O0FDQThCO0FBQ0Y7QUFDQztBQUNMO0FBRXhCc0osbURBQUksQ0FBQyxDQUFDO0FBQ04xRSxpREFBUSxDQUFDLENBQUM7O0FBRVY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lVUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzP2EzY2YiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcz82ZDU0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBjb21wdXRlcigpIHtcblx0Y29uc3QgY29tcEJvYXJkID0gZ2FtZUJvYXJkKCk7XG5cdGxldCBsYXN0SGl0ID0gbnVsbDtcblx0bGV0IHRhcmdldE1vZGUgPSBmYWxzZTtcblx0bGV0IGF0dGFja09wdGlvbnMgPSBbXTsgLy8gU3RvcmVzIHBvdGVudGlhbCBjZWxscyB0byBhdHRhY2sgaW4gdGFyZ2V0IG1vZGVcblx0bGV0IGlzVHVybiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuXHRcdGxldCB4O1xuXHRcdGxldCB5O1xuXHRcdGRvIHtcblx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHR5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXHRcdH0gd2hpbGUgKGVuZW15LmhpdEJvYXJkW3ldW3hdICE9PSB1bmRlZmluZWQpO1xuXHRcdHJldHVybiB7IHgsIHkgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5KCkge1xuXHRcdGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdO1xuXHRcdHNoaXBzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuXHRcdFx0bGV0IHg7XG5cdFx0XHRsZXQgeTtcblx0XHRcdGxldCB2ZXJ0aWNhbDtcblx0XHRcdGNvbnN0IHNoaXAgPSBjcmVhdGVTaGlwKGxlbmd0aCk7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcblx0XHRcdH0gd2hpbGUgKCFjb21wQm9hcmQuY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKSk7XG5cdFx0XHRjb21wQm9hcmQucGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRhcmdldEF0dGFjayhlbmVteSkge1xuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9ucyA9IFtcblx0XHRcdFx0WzEsIDBdLFxuXHRcdFx0XHRbLTEsIDBdLFxuXHRcdFx0XHRbMCwgMV0sXG5cdFx0XHRcdFswLCAtMV0sXG5cdFx0XHRdO1xuXHRcdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKChkaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgbmV3WCA9IGxhc3RIaXQueCArIGRpclswXTtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IGxhc3RIaXQueSArIGRpclsxXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPCAxMCAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPCAxMCAmJlxuXHRcdFx0XHRcdGVuZW15LmhpdEJvYXJkW25ld1ldW25ld1hdID09PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXR0YWNrT3B0aW9ucy5wdXNoKHsgeDogbmV3WCwgeTogbmV3WSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGF0dGFja09wdGlvbnMuc2hpZnQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNob29zZUF0dGFjayhlbmVteSkge1xuXHRcdHJldHVybiB0YXJnZXRNb2RlID8gdGFyZ2V0QXR0YWNrKGVuZW15KSA6IHJhbmRvbUF0dGFjayhlbmVteSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2socGxheWVyKSB7XG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBjaG9vc2VBdHRhY2socGxheWVyKTtcblx0XHRjb25zb2xlLmxvZyhgeDogJHt4fSwgeTogJHt5fWApO1xuXHRcdGNvbnN0IGF0dGFja1Jlc3VsdCA9IHBsYXllci5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHRcdGNvbnNvbGUubG9nKGBjb21wdXRlciBhdHRhY2tSZXN1bHQ6ICR7YXR0YWNrUmVzdWx0fWApO1xuXHRcdGlmIChhdHRhY2tSZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRcdGxhc3RIaXQgPSB7IHgsIHkgfTtcblx0XHRcdHRhcmdldE1vZGUgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcIm1pc3NcIiAmJiBsYXN0SGl0ICYmIHRhcmdldE1vZGUpIHtcblx0XHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7IC8vIFN3aXRjaCBiYWNrIHRvIHJhbmRvbSBtb2RlIGlmIG5vIG9wdGlvbnMgbGVmdFxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcInN1bmtcIikge1xuXHRcdFx0bGFzdEhpdCA9IG51bGw7XG5cdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7XG5cdFx0XHRhdHRhY2tPcHRpb25zID0gW107IC8vIENsZWFyIGF0dGFjayBvcHRpb25zXG5cdFx0fVxuXHRcdHJldHVybiB7IHgsIHksIGF0dGFja1Jlc3VsdCB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG5cdFx0cmV0dXJuIGNvbXBCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRwbGFjZVNoaXBzQXV0b21hdGljYWxseSxcblx0XHRhdHRhY2ssXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGNob29zZUF0dGFjayxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IGNvbXBCb2FyZCgpIHtcblx0XHRcdHJldHVybiBjb21wQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgdGFyZ2V0TW9kZSgpIHtcblx0XHRcdHJldHVybiB0YXJnZXRNb2RlO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBjb21wdXRlciBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHsgZHJhd0JvYXJkLCB1cGRhdGVCb2FyZCwgdXBkYXRlVHVybiwgbG9hZEdhbWUsIHdpbm5lciB9IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5mdW5jdGlvbiBnYW1lVGltZSh1c2VyUGFyYW0sIGNvbXBQYXJhbSwgZ2FtZUFjdGl2ZVBhcmFtKSB7XG5cdGNvbnN0IHVzZXIgPSB1c2VyUGFyYW07XG5cdGNvbnN0IGNvbXAgPSBjb21wUGFyYW07XG5cdGxldCBnYW1lQWN0aXZlID0gZ2FtZUFjdGl2ZVBhcmFtO1xuXG5cdGNvbnNvbGUubG9nKFwidXNlciBib2FyZDpcIik7XG5cdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTtcblxuXHRjb25zb2xlLmxvZyhcImNvbXAgYm9hcmQ6XCIpO1xuXHRjb25zb2xlLmxvZyhjb21wLmNvbXBCb2FyZC5ib2FyZCk7XG5cblx0ZHJhd0JvYXJkKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXHRkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXG5cdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHRjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXkgLmNlbGxcIik7XG5cdGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuXHRcdFx0aWYgKCFnYW1lQWN0aXZlIHx8ICF1c2VyLmlzVHVybikgcmV0dXJuO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHxcblx0XHRcdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxuXHRcdFx0KVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjb25zdCB7IHggfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB7IHkgfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB4SW50ID0gcGFyc2VJbnQoeCwgMTApO1xuXHRcdFx0Y29uc3QgeUludCA9IHBhcnNlSW50KHksIDEwKTtcblxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gdXNlci5hdHRhY2soeEludCwgeUludCwgY29tcCk7XG5cdFx0XHR1cGRhdGVCb2FyZCh4SW50LCB5SW50LCByZXN1bHQsIHRydWUpO1xuXG5cdFx0XHRpZiAoY29tcC5oYXNMb3N0KCkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJjb21wIGhhcyBsb3N0XCIpO1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdHdpbm5lcihcInVzZXJcIik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdGNvbXAuaXNUdXJuID0gdHJ1ZTtcblx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pO1xuXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0Y29uc3Qge1xuXHRcdFx0XHRcdHg6IGNvbXBYLFxuXHRcdFx0XHRcdHk6IGNvbXBZLFxuXHRcdFx0XHRcdGF0dGFja1Jlc3VsdDogY29tcFJlc3VsdCxcblx0XHRcdFx0fSA9IGNvbXAuYXR0YWNrKHVzZXIpO1xuXHRcdFx0XHR1cGRhdGVCb2FyZChjb21wWCwgY29tcFksIGNvbXBSZXN1bHQsIGZhbHNlKTtcblxuXHRcdFx0XHRpZiAodXNlci5oYXNMb3N0KCkpIHtcblx0XHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1c2VyIGhhcyBsb3N0XCIpO1xuXHRcdFx0XHRcdHdpbm5lcihcImNvbXBcIik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dXNlci5pc1R1cm4gPSB0cnVlO1xuXHRcdFx0XHRjb21wLmlzVHVybiA9IGZhbHNlO1xuXHRcdFx0XHR1cGRhdGVUdXJuKHVzZXIuaXNUdXJuKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcGxheUdhbWUoKSB7XG5cdGNvbnN0IGdhbWVBY3RpdmUgPSB0cnVlO1xuXHRjb25zdCB1c2VyID0gcGxheWVyKFwiUGxheWVyIDFcIik7XG5cdGNvbnN0IGNvbXAgPSBjb21wdXRlcigpO1xuXG5cdGNvbnN0IGdyaWRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1jZWxsXCIpO1xuXHRjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idXR0b25cIik7XG5cdGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdO1xuXHRsZXQgc2VsZWN0ZWRTaGlwU2l6ZSA9IHNoaXBzLnNoaWZ0KCk7XG5cdGxldCBpc0hvcml6b250YWwgPSB0cnVlOyAvLyBPcmllbnRhdGlvbiBvZiB0aGUgc2hpcFxuXG5cdGZ1bmN0aW9uIGlzQWRqYWNlbnRCbG9ja2VkKHN0YXJ0WCwgc3RhcnRZLCBzaGlwU2l6ZSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cblx0XHRcdGZvciAobGV0IGFkalggPSAtMTsgYWRqWCA8PSAxOyBhZGpYICs9IDEpIHtcblx0XHRcdFx0Zm9yIChsZXQgYWRqWSA9IC0xOyBhZGpZIDw9IDE7IGFkalkgKz0gMSkge1xuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWCA9IHggKyBhZGpYO1xuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWSA9IHkgKyBhZGpZO1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPCAxMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA8IDEwXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRpZiAodXNlci5wbGF5ZXJCb2FyZC5oYXNTaGlwQXQobmVpZ2hib3JYLCBuZWlnaGJvclkpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBoaWdobGlnaHRDZWxscyhlLCBzaGlwU2l6ZSkge1xuXHRcdGNvbnN0IHN0YXJ0WCA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQueCwgMTApO1xuXHRcdGNvbnN0IHN0YXJ0WSA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQueSwgMTApO1xuXG5cdFx0Ly8gQXNzdW1pbmcgdXNlci5wbGF5ZXJCb2FyZCBpcyBhY2Nlc3NpYmxlIGFuZCBoYXMgYSBtZXRob2QgdG8gY2hlY2sgZm9yIHNoaXAgYXQgYSBnaXZlbiBwb3NpdGlvblxuXHRcdGxldCBpc092ZXJsYXBPckFkamFjZW50ID0gaXNBZGphY2VudEJsb2NrZWQoc3RhcnRYLCBzdGFydFksIHNoaXBTaXplKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcblx0XHRcdCk7XG5cdFx0XHRpZiAoIWNlbGwgfHwgeCA+PSAxMCB8fCB5ID49IDEwIHx8IHVzZXIucGxheWVyQm9hcmQuaGFzU2hpcEF0KHgsIHkpKSB7XG5cdFx0XHRcdGlzT3ZlcmxhcE9yQWRqYWNlbnQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHggPSAhaXNIb3Jpem9udGFsID8gc3RhcnRYIDogc3RhcnRYICsgaTtcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXG5cdFx0XHQpO1xuXHRcdFx0aWYgKGNlbGwpIHtcblx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKGlzT3ZlcmxhcE9yQWRqYWNlbnQgPyBcIm92ZXJsYXBcIiA6IFwiaGlnaGxpZ2h0XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodCgpIHtcblx0XHRncmlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0XCIsIFwib3ZlcmxhcFwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGdyaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB7XG5cdFx0XHRpZiAoc2VsZWN0ZWRTaGlwU2l6ZSA9PT0gLTEpIHJldHVybjtcblx0XHRcdGhpZ2hsaWdodENlbGxzKGUsIHNlbGVjdGVkU2hpcFNpemUpO1xuXHRcdH0pO1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHJlbW92ZUhpZ2hsaWdodCk7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeCA9IHBhcnNlSW50KGNlbGwuZGF0YXNldC54LCAxMCk7XG5cdFx0XHRjb25zdCB5ID0gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LnksIDEwKTtcblxuXHRcdFx0aWYgKHVzZXIuY2FuUGxhY2VTaGlwKHNlbGVjdGVkU2hpcFNpemUsIHgsIHksICFpc0hvcml6b250YWwpKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcChzZWxlY3RlZFNoaXBTaXplKSwgeCwgeSwgIWlzSG9yaXpvbnRhbCk7XG5cblx0XHRcdFx0XHQvLyBWaXN1YWxpemUgdGhlIHBsYWNlZCBzaGlwXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZFNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGxYID0gIWlzSG9yaXpvbnRhbCA/IHggOiB4ICsgaTtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGxZID0gaXNIb3Jpem9udGFsID8geSA6IHkgKyBpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2hpcENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRgLmdyaWQtY2VsbFtkYXRhLXg9XCIke2NlbGxYfVwiXVtkYXRhLXk9XCIke2NlbGxZfVwiXWAsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0aWYgKHNoaXBDZWxsKSB7XG5cdFx0XHRcdFx0XHRcdHNoaXBDZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsLXdpdGgtc2hpcFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZWxlY3RlZFNoaXBTaXplID0gc2hpcHMuc2hpZnQoKTtcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRTaGlwU2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZFNoaXBTaXplID0gLTE7XG5cdFx0XHRcdFx0XHRyZW1vdmVIaWdobGlnaHQoKTtcblx0XHRcdFx0XHRcdGxvYWRHYW1lKCk7XG5cdFx0XHRcdFx0XHRnYW1lVGltZSh1c2VyLCBjb21wLCBnYW1lQWN0aXZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codXNlci5wbGF5ZXJCb2FyZC5ib2FyZCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0Ly8gSGFuZGxlIGVycm9yXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEhhbmRsZSBpbnZhbGlkIHBsYWNlbWVudFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHRyb3RhdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpc0hvcml6b250YWwgPSAhaXNIb3Jpem9udGFsO1xuXHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxheUdhbWU7XG4iLCJmdW5jdGlvbiBnYW1lQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSkpO1xuXG5cdGZ1bmN0aW9uIHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gXCJudW1iZXJcIiB8fCB4IDwgMCB8fCB4ID4gOSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInggbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdFx0aWYgKHR5cGVvZiB5ICE9PSBcIm51bWJlclwiIHx8IHkgPCAwIHx8IHkgPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG5cdFx0dmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KTtcblx0XHRpZiAodHlwZW9mIGlzVmVydGljYWwgIT09IFwiYm9vbGVhblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiaXNWZXJ0aWNhbCBtdXN0IGJlIGEgYm9vbGVhblwiKTtcblx0XHRjb25zdCBsZW5ndGggPSBzaGlwLmxlbmd0aCAtIDE7XG5cdFx0Y29uc3QgbWF4WCA9IGlzVmVydGljYWwgPyB4IDogeCArIGxlbmd0aDtcblx0XHRjb25zdCBtYXhZID0gaXNWZXJ0aWNhbCA/IHkgKyBsZW5ndGggOiB5O1xuXG5cdFx0aWYgKG1heFggPiA5IHx8IG1heFkgPiA5KSByZXR1cm4gZmFsc2U7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgY2hlY2tYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgaTtcblx0XHRcdGNvbnN0IGNoZWNrWSA9IGlzVmVydGljYWwgPyB5ICsgaSA6IHk7XG5cdFx0XHRpZiAoYm9hcmRbY2hlY2tZXVtjaGVja1hdICE9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcblxuXHRcdFx0Ly8gQ2hlY2sgYWRqYWNlbnQgY2VsbHNcblx0XHRcdGZvciAobGV0IGFkalggPSAtMTsgYWRqWCA8PSAxOyBhZGpYICs9IDEpIHtcblx0XHRcdFx0Zm9yIChsZXQgYWRqWSA9IC0xOyBhZGpZIDw9IDE7IGFkalkgKz0gMSkge1xuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWCA9IGNoZWNrWCArIGFkalg7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JZID0gY2hlY2tZICsgYWRqWTtcblxuXHRcdFx0XHRcdC8vIFZhbGlkYXRlIG5laWdoYm9yIGNvb3JkaW5hdGVzXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA8IDEwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZIDwgMTBcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdGlmIChib2FyZFtuZWlnaGJvclldW25laWdoYm9yWF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdGlmICghY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcGxhY2Ugc2hpcCBoZXJlXCIpO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgcGxhY2VYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgaTtcblx0XHRcdGNvbnN0IHBsYWNlWSA9IGlzVmVydGljYWwgPyB5ICsgaSA6IHk7XG5cdFx0XHRib2FyZFtwbGFjZVldW3BsYWNlWF0gPSBzaGlwO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhhc1NoaXBBdCh4LCB5KSB7XG5cdFx0cmV0dXJuIGJvYXJkW3ldW3hdICE9PSB1bmRlZmluZWQ7XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmIChib2FyZFt5XVt4XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRib2FyZFt5XVt4XSA9IFwibWlzc1wiO1xuXHRcdFx0cmV0dXJuIFwibWlzc1wiO1xuXHRcdH1cblx0XHRib2FyZFt5XVt4XS5oaXQoKTtcblx0XHRpZiAoYm9hcmRbeV1beF0uc3VuaykgcmV0dXJuIFwic3Vua1wiO1xuXHRcdHJldHVybiBcImhpdFwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWxsU2hpcHNTdW5rKCkge1xuXHRcdHJldHVybiBib2FyZC5ldmVyeSgocm93KSA9PlxuXHRcdFx0cm93LmV2ZXJ5KFxuXHRcdFx0XHQoY2VsbCkgPT5cblx0XHRcdFx0XHRjZWxsID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRjZWxsID09PSBcIm1pc3NcIiB8fFxuXHRcdFx0XHRcdCh0eXBlb2YgY2VsbCA9PT0gXCJvYmplY3RcIiAmJiBjZWxsLnN1bmspLFxuXHRcdFx0KSxcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgYm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gYm9hcmQ7XG5cdFx0fSxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdGhhc1NoaXBBdCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGFsbFNoaXBzU3Vuayxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUJvYXJkO1xuIiwiaW1wb3J0IHNvbGRpZXIgZnJvbSBcIi4vaW1nL3NvbGRpZXIuc3ZnXCI7XG5cbmZ1bmN0aW9uIGhlYWRlcigpIHtcblx0Y29uc3QgYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0YmFyLmNsYXNzTGlzdC5hZGQoXCJuYXYtYmFyXCIpO1xuXG5cdC8vIGl0ZW1zIG9uIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGhlYWRlclxuXHRjb25zdCBsZWZ0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdGxlZnRJY29uLmNsYXNzTGlzdC5hZGQoXCJpY29uXCIpO1xuXHRsZWZ0SWNvbi5zcmMgPSBzb2xkaWVyO1xuXHRsZWZ0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHQvLyBDcmVhdGUgdGhlIG1lbnUgYnV0dG9uXG5cdGNvbnN0IHRpdGxlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dGl0bGVCb3guY2xhc3NMaXN0LmFkZChcImhlYWRlclwiKTtcblx0Y29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cdHRpdGxlLnRleHRDb250ZW50ID0gXCJCYXR0bGVzaGlwXCI7XG5cdHRpdGxlQm94LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuXHRjb25zdCByaWdodEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRyaWdodEljb24uY2xhc3NMaXN0LmFkZChcImljb25cIik7XG5cdHJpZ2h0SWNvbi5zcmMgPSBzb2xkaWVyO1xuXHRyaWdodEljb24uYWx0ID0gXCJzb2xkaWVyXCI7XG5cblx0YmFyLmFwcGVuZENoaWxkKGxlZnRJY29uKTtcblx0YmFyLmFwcGVuZENoaWxkKHRpdGxlQm94KTtcblx0YmFyLmFwcGVuZENoaWxkKHJpZ2h0SWNvbik7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdiNjb250ZW50XCIpLmFwcGVuZENoaWxkKGJhcik7XG59XG5cbmZ1bmN0aW9uIG1haW5Db250ZW50KCkge1xuXHRjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0bWFpbi5jbGFzc0xpc3QuYWRkKFwibWFpbi1jb250ZW50XCIpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQobWFpbik7XG59XG5cbmZ1bmN0aW9uIHR1cm4oKSB7XG5cdGNvbnN0IHR1cm5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0dXJuRGl2LmNsYXNzTGlzdC5hZGQoXCJ0dXJuLWRpdlwiKTtcblx0Y29uc3QgdHVybkluZGljYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5JbmRpY2F0b3IuY2xhc3NMaXN0LmFkZChcInR1cm4taW5kaWNhdG9yXCIpO1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IFwiWW91ciBUdXJuXCI7XG5cdHR1cm5JbmRpY2F0b3IuYXBwZW5kQ2hpbGQodHVyblRleHQpO1xuXHR0dXJuRGl2LmFwcGVuZENoaWxkKHR1cm5JbmRpY2F0b3IpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKS5hcHBlbmRDaGlsZCh0dXJuRGl2KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKS5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmZ1bmN0aW9uIHBsYXllckJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJcIik7XG5cblx0Y29uc3QgYm9hcmRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblx0Ym9hcmRUaXRsZS50ZXh0Q29udGVudCA9IFwiWW91ciBCb2FyZFwiO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZFRpdGxlKTtcblxuXHRjb25zdCBib2FyZEdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZEdyaWQuY2xhc3NMaXN0LmFkZChcImJvYXJkLWdyaWRcIik7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkR3JpZCk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5ib2FyZFwiKS5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmZ1bmN0aW9uIGVuZW15Qm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcImVuZW15XCIpO1xuXG5cdGNvbnN0IGJvYXJkVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG5cdGJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBcIkVuZW15IEJvYXJkXCI7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkVGl0bGUpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmJvYXJkXCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gcmV0dXJuQm9hcmRHcmlkKGVuZW15KSB7XG5cdGxldCBib2FyZEdyaWQ7XG5cdGlmIChlbmVteSkge1xuXHRcdGJvYXJkR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuZW5lbXkgZGl2LmJvYXJkLWdyaWRcIik7XG5cdH0gZWxzZSB7XG5cdFx0Ym9hcmRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5wbGF5ZXIgZGl2LmJvYXJkLWdyaWRcIik7XG5cdH1cblx0cmV0dXJuIGJvYXJkR3JpZDtcbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKGJvYXJkLCBpc0VuZW15ID0gZmFsc2UpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGlzRW5lbXkpO1xuXHRib2FyZEdyaWQuaW5uZXJIVE1MID0gXCJcIjtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRbaV0ubGVuZ3RoOyBqICs9IDEpIHtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcblx0XHRcdGNlbGwuZGF0YXNldC54ID0gajtcblx0XHRcdGNlbGwuZGF0YXNldC55ID0gaTtcblxuXHRcdFx0aWYgKGJvYXJkW2ldW2pdICE9PSB1bmRlZmluZWQgJiYgIWlzRW5lbXkpIHtcblx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcblx0XHRcdH1cblx0XHRcdGJvYXJkR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWlzcyh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xufVxuXG5mdW5jdGlvbiBoaXQoeCwgeSwgZW5lbXkpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGVuZW15KTtcblx0Y29uc3QgY2VsbCA9IGJvYXJkR3JpZC5jaGlsZHJlblt5ICogMTAgKyB4XTtcblx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCb2FyZCh4LCB5LCByZXN1bHQsIGVuZW15KSB7XG5cdGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSB7XG5cdFx0bWlzcyh4LCB5LCBlbmVteSk7XG5cdH0gZWxzZSBpZiAocmVzdWx0ID09PSBcImhpdFwiKSB7XG5cdFx0aGl0KHgsIHksIGVuZW15KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydFBhZ2UoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKTtcblx0bWFpbi5pbm5lckhUTUwgPSBcIlwiO1xuXHR0dXJuKCk7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBzaGlwcyBieSBjbGlja2luZyBvbiB0aGUgYm9hcmQgYmVsb3dcIjtcblxuXHRjb25zdCByb3RhdGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRyb3RhdGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInJvdGF0ZS1jb250YWluZXJcIik7XG5cblx0Y29uc3Qgcm90YXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0cm90YXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtYnV0dG9uXCIpO1xuXHRyb3RhdGVCdXR0b24udGV4dENvbnRlbnQgPSBcIlJvdGF0ZVwiO1xuXHRyb3RhdGVDb250YWluZXIuYXBwZW5kQ2hpbGQocm90YXRlQnV0dG9uKTtcblx0bWFpbi5hcHBlbmRDaGlsZChyb3RhdGVDb250YWluZXIpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0bWFpbi5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcblx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcblx0XHRjZWxsLmRhdGFzZXQueCA9IGkgJSAxMDtcblx0XHRjZWxsLmRhdGFzZXQueSA9IE1hdGguZmxvb3IoaSAvIDEwKTtcblx0XHRib2FyZEdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbG9hZEdhbWUoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKTtcblx0bWFpbi5pbm5lckhUTUwgPSBcIlwiO1xuXHR0dXJuKCk7XG5cdGNyZWF0ZUJvYXJkKCk7XG5cdHBsYXllckJvYXJkKCk7XG5cdGVuZW15Qm9hcmQoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVHVybihpc1R1cm4pIHtcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnR1cm4taW5kaWNhdG9yIHBcIik7XG5cdHR1cm5UZXh0LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcblx0Ly8gQ2hhbmdlIHRleHQgYWZ0ZXIgZmFkZSBvdXRcblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0dHVyblRleHQudGV4dENvbnRlbnQgPSBpc1R1cm4gPyBcIllvdXIgVHVyblwiIDogXCJDb21wdXRlcidzIFR1cm5cIjtcblx0XHQvLyBGYWRlIGluXG5cdFx0dHVyblRleHQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHR9LCA1MDApOyAvLyBUaGlzIHNob3VsZCBtYXRjaCB0aGUgQ1NTIHRyYW5zaXRpb24gdGltZVxufVxuXG5mdW5jdGlvbiB3aW5uZXIocGxheWVyKSB7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IGAke3BsYXllcn0gd29uIWA7XG59XG5cbmZ1bmN0aW9uIHBhZ2UoKSB7XG5cdGhlYWRlcigpO1xuXHRtYWluQ29udGVudCgpO1xuXHRzdGFydFBhZ2UoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFnZTtcbmV4cG9ydCB7IGRyYXdCb2FyZCwgdXBkYXRlQm9hcmQsIHVwZGF0ZVR1cm4sIGxvYWRHYW1lLCB3aW5uZXIgfTtcbiIsImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5cbmZ1bmN0aW9uIHBsYXllcihuYW1lID0gXCJhbm9ueW1vdXNcIikge1xuXHRjb25zdCBwbGF5ZXJCb2FyZCA9IGdhbWVCb2FyZCgpO1xuXHRjb25zdCBoaXRCb2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pKTtcblx0bGV0IGlzVHVybiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpIHtcblx0XHRwbGF5ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhblBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpIHtcblx0XHRyZXR1cm4gcGxheWVyQm9hcmQuY2FuUGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gcGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdFx0aWYgKHJlc3VsdCA9PT0gXCJoaXRcIikge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJoaXRcIjtcblx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzdW5rXCIpIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwic3Vua1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcIm1pc3NcIjtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coYHBsYXllciBoaXRCb2FyZDpgKTtcblx0XHRjb25zb2xlLmxvZyhoaXRCb2FyZCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcblx0XHRyZXR1cm4gZW5lbXkucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNMb3N0KCkge1xuXHRcdHJldHVybiBwbGF5ZXJCb2FyZC5hbGxTaGlwc1N1bmsoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bmFtZSxcblx0XHRwbGFjZVNoaXAsXG5cdFx0Y2FuUGxhY2VTaGlwLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0YXR0YWNrLFxuXHRcdGhhc0xvc3QsXG5cdFx0Z2V0IGlzVHVybigpIHtcblx0XHRcdHJldHVybiBpc1R1cm47XG5cdFx0fSxcblx0XHRzZXQgaXNUdXJuKHZhbHVlKSB7XG5cdFx0XHRpc1R1cm4gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGdldCBwbGF5ZXJCb2FyZCgpIHtcblx0XHRcdHJldHVybiBwbGF5ZXJCb2FyZDtcblx0XHR9LFxuXHRcdGdldCBoaXRCb2FyZCgpIHtcblx0XHRcdHJldHVybiBoaXRCb2FyZDtcblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbGF5ZXI7XG4iLCJmdW5jdGlvbiBjcmVhdGVTaGlwKGxlbmd0aCkge1xuXHRpZiAodHlwZW9mIGxlbmd0aCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYSBudW1iZXJcIik7XG5cdGlmIChsZW5ndGggPCAxKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBncmVhdGVyIHRoYW4gMFwiKTtcblx0aWYgKGxlbmd0aCAlIDEgIT09IDApIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGFuIGludGVnZXJcIik7XG5cdGlmIChsZW5ndGggPiA1KSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBsZXNzIHRoYW4gNlwiKTtcblxuXHRsZXQgbnVtSGl0cyA9IDA7XG5cdGxldCBzdW5rID0gZmFsc2U7XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgbGVuZ3RoKCkge1xuXHRcdFx0cmV0dXJuIGxlbmd0aDtcblx0XHR9LFxuXHRcdGdldCBudW1IaXRzKCkge1xuXHRcdFx0cmV0dXJuIG51bUhpdHM7XG5cdFx0fSxcblx0XHRnZXQgc3VuaygpIHtcblx0XHRcdHJldHVybiBzdW5rO1xuXHRcdH0sXG5cdFx0aGl0KCkge1xuXHRcdFx0bnVtSGl0cyArPSAxO1xuXHRcdFx0aWYgKG51bUhpdHMgPT09IGxlbmd0aCkge1xuXHRcdFx0XHRzdW5rID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGJvZHkge1xuXHQtLXNpZGViYXItYmctY29sb3I6ICMxOTIxMWE7XG5cdC0tY29udGVudC10ZXh0LWNvbG9yOiAjZGRkZGRkO1xuXHQtLXRpdGxlLWJveC1jb2xvcjogI2RkZGRkZDtcblx0LS1pdGVtLWZvY3VzLWNvbG9yOiAjMWYyOTM3O1xuXHQtLXNlYXJjaC1ib3gtYmctY29sb3I6ICMxOTI3MzQ7XG5cdC0tc2VhcmNoLWlucHV0LWNvbG9yOiAjZGRkZGRkO1xuXHQtLXNlYXJjaC1idG4tYmctY29sb3I6ICMzMTNlNGI7XG5cdC0tbG9nby1jb2xvcjogI2RkZGRkZDtcblx0LS10b2dnbGUtc3dpdGNoLWJnLWNvbG9yOiAjNmI3NTdlO1xuXHQtLXRvZ2dsZS1zd2l0Y2gtYm9yZGVyLWNvbG9yOiAjMmNhOWJjO1xuXHQtLWZvb3Rlci1jb2xvcjogI2RkZGRkZDtcblx0LS1mb290ZXItYWN0aXZlOiAjZmZmZmZmO1xuXHQtLWFkZC1idG4tY29sb3I6ICMzZjUxYjU7XG5cdC0tYWRkLWJ0bi1iZy1jb2xvcjogIzkwY2FmOTtcblx0LS1mb3JtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcblx0LS1mb3JtLXNjcm9sbC1ib3gtYmctY29sb3I6ICM5ZTllOWUyMTtcblx0LS10b2RvLWl0ZW0tYmctY29sb3I6ICMxOTI3MzQ7XG5cdC0tdG9kby1pdGVtLWhvdmVyLWNvbG9yOiAjMmQzZDRkO1xuXHQtLWJhY2stYnRuLWNvbG9yOiAjM2Y1MWI1O1xuXHQtLWZvcm0taW5wdXQtY29sb3I6ICMxOTI3MzQ7XG5cdC0taGVhZGVyLWNvbG9yOiAjZGRkZGRkO1xuXHQtLW5vdGUtY29sb3I6ICNmZmZmZmY7XG5cdC0tbm90ZS1oZWFkZXI6ICM5MGNhZjk7XG5cdC0tbm90ZS1vdXQtb2YtZm9jdXM6ICNkZGRkZGQ7XG5cdC0taGlnaGxpZ2h0OiAjNTM2OWU1O1xuXHQtLXJlZDogI2M4MTQxNDtcblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcblx0bWFyZ2luOiAwO1xuXHRwYWRkaW5nOiAwO1xuXHRmb250LWZhbWlseTpcblx0XHRzeXN0ZW0tdWksXG5cdFx0LWFwcGxlLXN5c3RlbSxcblx0XHRCbGlua01hY1N5c3RlbUZvbnQsXG5cdFx0XCJTZWdvZSBVSVwiLFxuXHRcdFJvYm90byxcblx0XHRPeHlnZW4sXG5cdFx0VWJ1bnR1LFxuXHRcdENhbnRhcmVsbCxcblx0XHRcIk9wZW4gU2Fuc1wiLFxuXHRcdFwiSGVsdmV0aWNhIE5ldWVcIixcblx0XHRzYW5zLXNlcmlmO1xuXHRjb2xvcjogI2RkZGRkZDtcbn1cblxuZGl2I2NvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG5cdGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuXHRoZWlnaHQ6IDEwMHZoO1xufVxuXG4ubmF2LWJhciB7XG5cdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNpZGViYXItYmctY29sb3IpO1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiA1cmVtO1xuXHRwYWRkaW5nOiAwIDFyZW07XG5cdHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ubWFpbi1jb250ZW50IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGdhcDogMXJlbTtcblx0cGFkZGluZzogMCAxcmVtO1xufVxuXG4uY2VsbC5vdmVybGFwIHtcblx0YmFja2dyb3VuZC1jb2xvcjogcmVkOyAvKiBDb2xvciBpbmRpY2F0aW5nIGludmFsaWQgcGxhY2VtZW50IGR1ZSB0byBvdmVybGFwICovXG5cdGN1cnNvcjogbm90LWFsbG93ZWQ7IC8qIEJsb2NrZWQgY3Vyc29yICovXG59XG5cbi5oZWFkZXIgaDEge1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7IC8qIENlbnRlciB0aGUgaGVhZGVyIHRleHQgKi9cblx0Zm9udC1mYW1pbHk6IFwiQXJpYWxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXG5cdGZvbnQtc2l6ZTogNDhweDsgLyogU2V0IGEgbGFyZ2UgZm9udCBzaXplIGZvciBpbXBhY3QgKi9cblx0Y29sb3I6ICNmZmZmZmY4NzsgLyogV2hpdGUgY29sb3IgZm9yIHRoZSB0ZXh0IGZvciBiZXR0ZXIgY29udHJhc3QgKi9cblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTsgLyogTmF2eSBibHVlIGJhY2tncm91bmQgKi9cblx0cGFkZGluZzogMjBweDsgLyogQWRkIHNvbWUgcGFkZGluZyBhcm91bmQgdGhlIHRleHQgKi9cblx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXG5cdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXG5cdG1hcmdpbjogMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXG5cdHRleHQtc2hhZG93OiAycHggMnB4IDJweCAjNzM3MzczO1xufVxuXG4uaGVhZGVyIGgxOmhvdmVyIHtcblx0Y29sb3I6ICM4NDkxNzc7IC8qIENoYW5nZSB0ZXh0IGNvbG9yIG9uIGhvdmVyICovXG5cdGN1cnNvcjogcG9pbnRlcjsgLyogQ2hhbmdlIHRoZSBjdXJzb3IgdG8gaW5kaWNhdGUgaXQncyBjbGlja2FibGUgKi9cbn1cblxuLmljb24ge1xuXHR3aWR0aDogNnJlbTtcblx0aGVpZ2h0OiBhdXRvO1xufVxuXG4udHVybi1pbmRpY2F0b3Ige1xuXHR3aWR0aDogNjAlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdGJvcmRlci1yYWRpdXM6IDFyZW07XG5cdC8qIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY4NzsgKi9cblx0cGFkZGluZzogMC41cmVtO1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdGJhY2tncm91bmQ6ICNmZmZmZmY4Nztcblx0YmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQoXG5cdFx0LTQ1ZGVnLFxuXHRcdCNjZGNhY2E4NyAwJSxcblx0XHQjZmZmZmZmODcgNTAlLFxuXHRcdCNjZGNkY2RhNiAxMDAlXG5cdCk7XG5cdGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KFxuXHRcdC00NWRlZyxcblx0XHQjY2RjYWNhODcgMCUsXG5cdFx0I2ZmZmZmZjg3IDUwJSxcblx0XHQjY2RjZGNkYTYgMTAwJVxuXHQpO1xuXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XG59XG4udHVybi1pbmRpY2F0b3IgcCB7XG5cdGZvbnQtc2l6ZTogMS41cmVtO1xuXHRmb250LXdlaWdodDogYm9sZDtcblx0Y29sb3I6ICMxOTIxMWE7XG5cdGZvbnQtZmFtaWx5OiBcIkFyaWFsXCIsIHNhbnMtc2VyaWY7IC8qIFVzZSBhIG1vZGVybiwgY2xlYW4gZm9udCAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cblx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cblx0bWFyZ2luLWJvdHRvbTogMzBweDsgLyogQWRkIHNvbWUgc3BhY2UgYmVsb3cgdGhlIGhlYWRlciAqL1xuXHR0ZXh0LXNoYWRvdzogNHB4IDNweCAwcHggIzY1NzE1OTczO1xuXHRtYXJnaW46IDA7XG5cdHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlLWluLW91dDtcblx0b3BhY2l0eTogMTsgLyogU3RhcnQgZnVsbHkgdmlzaWJsZSAqL1xufVxuXG4ucm90YXRlLWNvbnRhaW5lciB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4ucm90YXRlLWJ1dHRvbiB7XG5cdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XG5cdGNvbG9yOiAjYzFjMWMxZDY7XG5cdGJvcmRlcjogMnB4IHNvbGlkICM5MjkzOTI7XG5cdHBhZGRpbmc6IDEwcHggMjBweDtcblx0Ym9yZGVyLXJhZGl1czogNXB4O1xuXHRmb250LXdlaWdodDogYm9sZDtcblx0Y3Vyc29yOiBwb2ludGVyO1xuXHR0cmFuc2l0aW9uOlxuXHRcdHRyYW5zZm9ybSAwLjNzIGVhc2UsXG5cdFx0YmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XG59XG5cbi5yb3RhdGUtYnV0dG9uOmhvdmVyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTsgLyogQmFja2dyb3VuZCBjb2xvciBvbiBob3ZlciAqL1xuXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBUZXh0IGNvbG9yIG9uIGhvdmVyICovXG59XG5cbi5ib2FyZCB7XG5cdGRpc3BsYXk6IGdyaWQ7XG5cdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XG5cdGdhcDogMXJlbTtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG4uY2VsbC5oaWdobGlnaHQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XG59XG5cbi5jZWxsLmJsb2NrZWQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgKi9cblx0Y3Vyc29yOiBub3QtYWxsb3dlZDsgLyogQmxvY2tlZCBjdXJzb3IgKi9cbn1cblxuZGl2LmJvYXJkLWdyaWQgLmNlbGwuY2VsbC13aXRoLXNoaXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMDBmZjFlODc7XG59XG5cbi5ib2FyZCBoMiB7XG5cdG1hcmdpbjogMDtcbn1cblxuLnR1cm4tZGl2IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbmRpdi5ib2FyZC1ncmlkIHtcblx0ZGlzcGxheTogZ3JpZDtcblx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjV2dykgLyByZXBlYXQoMTAsIDIuNXZ3KTtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRnYXA6IDJweDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XG5cdGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdHdpZHRoOiAxMDAlO1xuXHR0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlIDBzO1xufVxuXG4uZW5lbXksXG4ucGxheWVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogMXJlbTtcbn1cblxuLnNoaXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xufVxuXG4ubWlzcyB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA4Nztcbn1cblxuZGl2LmNlbGwuaGl0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjMDBmZjFlODc7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jc3MvZ2FtZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7Q0FDQywyQkFBMkI7Q0FDM0IsNkJBQTZCO0NBQzdCLDBCQUEwQjtDQUMxQiwyQkFBMkI7Q0FDM0IsOEJBQThCO0NBQzlCLDZCQUE2QjtDQUM3Qiw4QkFBOEI7Q0FDOUIscUJBQXFCO0NBQ3JCLGlDQUFpQztDQUNqQyxxQ0FBcUM7Q0FDckMsdUJBQXVC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LG1CQUFtQjtDQUNuQixxQkFBcUI7Q0FDckIsdUJBQXVCO0NBQ3ZCLHFCQUFxQjtBQUN0Qjs7QUFFQTtDQUNDLHVCQUF1QjtDQUN2QixZQUFZO0NBQ1osV0FBVztDQUNYLDRCQUE0QjtBQUM3Qjs7QUFFQTs7Q0FFQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLHVCQUF1QjtDQUN2QixtQkFBbUI7Q0FDbkIsU0FBUztBQUNWOztBQUVBO0NBQ0MseUJBQXlCO0FBQzFCOztBQUVBO0NBQ0MsMkJBQTJCO0FBQzVCOztBQUVBO0NBQ0MsMkJBQTJCO0NBQzNCLDJCQUEyQjtBQUM1QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5IHtcXG5cXHQtLXNpZGViYXItYmctY29sb3I6ICMxOTIxMWE7XFxuXFx0LS1jb250ZW50LXRleHQtY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS10aXRsZS1ib3gtY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS1pdGVtLWZvY3VzLWNvbG9yOiAjMWYyOTM3O1xcblxcdC0tc2VhcmNoLWJveC1iZy1jb2xvcjogIzE5MjczNDtcXG5cXHQtLXNlYXJjaC1pbnB1dC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLXNlYXJjaC1idG4tYmctY29sb3I6ICMzMTNlNGI7XFxuXFx0LS1sb2dvLWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tdG9nZ2xlLXN3aXRjaC1iZy1jb2xvcjogIzZiNzU3ZTtcXG5cXHQtLXRvZ2dsZS1zd2l0Y2gtYm9yZGVyLWNvbG9yOiAjMmNhOWJjO1xcblxcdC0tZm9vdGVyLWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tZm9vdGVyLWFjdGl2ZTogI2ZmZmZmZjtcXG5cXHQtLWFkZC1idG4tY29sb3I6ICMzZjUxYjU7XFxuXFx0LS1hZGQtYnRuLWJnLWNvbG9yOiAjOTBjYWY5O1xcblxcdC0tZm9ybS1oZWFkZXItY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS1mb3JtLXNjcm9sbC1ib3gtYmctY29sb3I6ICM5ZTllOWUyMTtcXG5cXHQtLXRvZG8taXRlbS1iZy1jb2xvcjogIzE5MjczNDtcXG5cXHQtLXRvZG8taXRlbS1ob3Zlci1jb2xvcjogIzJkM2Q0ZDtcXG5cXHQtLWJhY2stYnRuLWNvbG9yOiAjM2Y1MWI1O1xcblxcdC0tZm9ybS1pbnB1dC1jb2xvcjogIzE5MjczNDtcXG5cXHQtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLW5vdGUtY29sb3I6ICNmZmZmZmY7XFxuXFx0LS1ub3RlLWhlYWRlcjogIzkwY2FmOTtcXG5cXHQtLW5vdGUtb3V0LW9mLWZvY3VzOiAjZGRkZGRkO1xcblxcdC0taGlnaGxpZ2h0OiAjNTM2OWU1O1xcblxcdC0tcmVkOiAjYzgxNDE0O1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sXFxuXFx0XFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxcblxcdFxcdFxcXCJTZWdvZSBVSVxcXCIsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdE94eWdlbixcXG5cXHRcXHRVYnVudHUsXFxuXFx0XFx0Q2FudGFyZWxsLFxcblxcdFxcdFxcXCJPcGVuIFNhbnNcXFwiLFxcblxcdFxcdFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsXFxuXFx0XFx0c2Fucy1zZXJpZjtcXG5cXHRjb2xvcjogI2RkZGRkZDtcXG59XFxuXFxuZGl2I2NvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxuXFx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XFxuXFx0aGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuLm5hdi1iYXIge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNpZGViYXItYmctY29sb3IpO1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDVyZW07XFxuXFx0cGFkZGluZzogMCAxcmVtO1xcblxcdHBhZGRpbmctdG9wOiAwLjI1cmVtO1xcbn1cXG5cXG4ubWFpbi1jb250ZW50IHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdHBhZGRpbmc6IDAgMXJlbTtcXG59XFxuXFxuLmNlbGwub3ZlcmxhcCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogcmVkOyAvKiBDb2xvciBpbmRpY2F0aW5nIGludmFsaWQgcGxhY2VtZW50IGR1ZSB0byBvdmVybGFwICovXFxuXFx0Y3Vyc29yOiBub3QtYWxsb3dlZDsgLyogQmxvY2tlZCBjdXJzb3IgKi9cXG59XFxuXFxuLmhlYWRlciBoMSB7XFxuXFx0dGV4dC1hbGlnbjogY2VudGVyOyAvKiBDZW50ZXIgdGhlIGhlYWRlciB0ZXh0ICovXFxuXFx0Zm9udC1mYW1pbHk6IFxcXCJBcmlhbFxcXCIsIHNhbnMtc2VyaWY7IC8qIFVzZSBhIG1vZGVybiwgY2xlYW4gZm9udCAqL1xcblxcdGZvbnQtc2l6ZTogNDhweDsgLyogU2V0IGEgbGFyZ2UgZm9udCBzaXplIGZvciBpbXBhY3QgKi9cXG5cXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBXaGl0ZSBjb2xvciBmb3IgdGhlIHRleHQgZm9yIGJldHRlciBjb250cmFzdCAqL1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7IC8qIE5hdnkgYmx1ZSBiYWNrZ3JvdW5kICovXFxuXFx0cGFkZGluZzogMjBweDsgLyogQWRkIHNvbWUgcGFkZGluZyBhcm91bmQgdGhlIHRleHQgKi9cXG5cXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cXG5cXHRsZXR0ZXItc3BhY2luZzogMnB4OyAvKiBJbmNyZWFzZSBzcGFjaW5nIGJldHdlZW4gbGV0dGVycyAqL1xcblxcdG1hcmdpbjogMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXFxuXFx0dGV4dC1zaGFkb3c6IDJweCAycHggMnB4ICM3MzczNzM7XFxufVxcblxcbi5oZWFkZXIgaDE6aG92ZXIge1xcblxcdGNvbG9yOiAjODQ5MTc3OyAvKiBDaGFuZ2UgdGV4dCBjb2xvciBvbiBob3ZlciAqL1xcblxcdGN1cnNvcjogcG9pbnRlcjsgLyogQ2hhbmdlIHRoZSBjdXJzb3IgdG8gaW5kaWNhdGUgaXQncyBjbGlja2FibGUgKi9cXG59XFxuXFxuLmljb24ge1xcblxcdHdpZHRoOiA2cmVtO1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXFxuLnR1cm4taW5kaWNhdG9yIHtcXG5cXHR3aWR0aDogNjAlO1xcblxcdGhlaWdodDogMTAwJTtcXG5cXHRib3JkZXItcmFkaXVzOiAxcmVtO1xcblxcdC8qIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY4NzsgKi9cXG5cXHRwYWRkaW5nOiAwLjVyZW07XFxuXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblxcdGJhY2tncm91bmQ6ICNmZmZmZmY4NztcXG5cXHRiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudChcXG5cXHRcXHQtNDVkZWcsXFxuXFx0XFx0I2NkY2FjYTg3IDAlLFxcblxcdFxcdCNmZmZmZmY4NyA1MCUsXFxuXFx0XFx0I2NkY2RjZGE2IDEwMCVcXG5cXHQpO1xcblxcdGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KFxcblxcdFxcdC00NWRlZyxcXG5cXHRcXHQjY2RjYWNhODcgMCUsXFxuXFx0XFx0I2ZmZmZmZjg3IDUwJSxcXG5cXHRcXHQjY2RjZGNkYTYgMTAwJVxcblxcdCk7XFxuXFx0Ym94LXNoYWRvdzogMHB4IDRweCA4cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xcbn1cXG4udHVybi1pbmRpY2F0b3IgcCB7XFxuXFx0Zm9udC1zaXplOiAxLjVyZW07XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XFxuXFx0Y29sb3I6ICMxOTIxMWE7XFxuXFx0Zm9udC1mYW1pbHk6IFxcXCJBcmlhbFxcXCIsIHNhbnMtc2VyaWY7IC8qIFVzZSBhIG1vZGVybiwgY2xlYW4gZm9udCAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXFxuXFx0bWFyZ2luLWJvdHRvbTogMzBweDsgLyogQWRkIHNvbWUgc3BhY2UgYmVsb3cgdGhlIGhlYWRlciAqL1xcblxcdHRleHQtc2hhZG93OiA0cHggM3B4IDBweCAjNjU3MTU5NzM7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlLWluLW91dDtcXG5cXHRvcGFjaXR5OiAxOyAvKiBTdGFydCBmdWxseSB2aXNpYmxlICovXFxufVxcblxcbi5yb3RhdGUtY29udGFpbmVyIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnJvdGF0ZS1idXR0b24ge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XFxuXFx0Y29sb3I6ICNjMWMxYzFkNjtcXG5cXHRib3JkZXI6IDJweCBzb2xpZCAjOTI5MzkyO1xcblxcdHBhZGRpbmc6IDEwcHggMjBweDtcXG5cXHRib3JkZXItcmFkaXVzOiA1cHg7XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcblxcdHRyYW5zaXRpb246XFxuXFx0XFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcXG5cXHRcXHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcXG59XFxuXFxuLnJvdGF0ZS1idXR0b246aG92ZXIge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMyYzcyMzU7IC8qIEJhY2tncm91bmQgY29sb3Igb24gaG92ZXIgKi9cXG5cXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBUZXh0IGNvbG9yIG9uIGhvdmVyICovXFxufVxcblxcbi5ib2FyZCB7XFxuXFx0ZGlzcGxheTogZ3JpZDtcXG5cXHRncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xcblxcdGdhcDogMXJlbTtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5jZWxsLmhpZ2hsaWdodCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xcbn1cXG5cXG4uY2VsbC5ibG9ja2VkIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgKi9cXG5cXHRjdXJzb3I6IG5vdC1hbGxvd2VkOyAvKiBCbG9ja2VkIGN1cnNvciAqL1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbC5jZWxsLXdpdGgtc2hpcCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xcbn1cXG5cXG4uYm9hcmQgaDIge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLnR1cm4tZGl2IHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuZGl2LmJvYXJkLWdyaWQge1xcblxcdGRpc3BsYXk6IGdyaWQ7XFxuXFx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjV2dykgLyByZXBlYXQoMTAsIDIuNXZ3KTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0Z2FwOiAycHg7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24tY29udGVudDogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdHdpZHRoOiAxMDAlO1xcblxcdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgMHM7XFxufVxcblxcbi5lbmVteSxcXG4ucGxheWVyIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxufVxcblxcbi5zaGlwIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xcbn1cXG5cXG4ubWlzcyB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDg3O1xcbn1cXG5cXG5kaXYuY2VsbC5oaXQge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMwMGZmMWU4NztcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjMDBmZjFlODc7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcblx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cblx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcblx0bWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgXFxgbWFpblxcYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gXFxgaDFcXGAgZWxlbWVudHMgd2l0aGluIFxcYHNlY3Rpb25cXGAgYW5kXG4gKiBcXGBhcnRpY2xlXFxgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG5cdGZvbnQtc2l6ZTogMmVtO1xuXHRtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG5ociB7XG5cdGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXG5cdGhlaWdodDogMDsgLyogMSAqL1xuXHRvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG5cdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG5cdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcblx0Ym9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuXHRmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmNvZGUsXG5rYmQsXG5zYW1wIHtcblx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG5cdGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc21hbGwge1xuXHRmb250LXNpemU6IDgwJTtcbn1cblxuLyoqXG4gKiBQcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG5cdGZvbnQtc2l6ZTogNzUlO1xuXHRsaW5lLWhlaWdodDogMDtcblx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG5cdGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcblx0dG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuXHRib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG5cdGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG5cdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuXHRtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQge1xuXHQvKiAxICovXG5cdG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7XG5cdC8qIDEgKi9cblx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuXHRib3JkZXItc3R5bGU6IG5vbmU7XG5cdHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcblx0b3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG5cdHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAqICAgIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5sZWdlbmQge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG5cdGNvbG9yOiBpbmhlcml0OyAvKiAyICovXG5cdGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXG5cdG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xuXHRwYWRkaW5nOiAwOyAvKiAzICovXG5cdHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxuICovXG5cbnByb2dyZXNzIHtcblx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxuICovXG5cbnRleHRhcmVhIHtcblx0b3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXG4gKi9cblxuW3R5cGU9XCJjaGVja2JveFwiXSxcblt0eXBlPVwicmFkaW9cIl0ge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG5cdHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG5cdGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cblx0b3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gXFxgaW5oZXJpdFxcYCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG5cdGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuXHRkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcblx0ZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG5cdGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuXHRkaXNwbGF5OiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL25vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOztBQUUzRTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtDQUNDLGlCQUFpQixFQUFFLE1BQU07Q0FDekIsOEJBQThCLEVBQUUsTUFBTTtBQUN2Qzs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsU0FBUztBQUNWOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLGNBQWM7Q0FDZCxnQkFBZ0I7QUFDakI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Q0FDQyx1QkFBdUIsRUFBRSxNQUFNO0NBQy9CLFNBQVMsRUFBRSxNQUFNO0NBQ2pCLGlCQUFpQixFQUFFLE1BQU07QUFDMUI7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsaUNBQWlDLEVBQUUsTUFBTTtDQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsNkJBQTZCO0FBQzlCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLG1CQUFtQixFQUFFLE1BQU07Q0FDM0IsMEJBQTBCLEVBQUUsTUFBTTtDQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0FBQzFDOztBQUVBOztFQUVFOztBQUVGOztDQUVDLG1CQUFtQjtBQUNwQjs7QUFFQTs7O0VBR0U7O0FBRUY7OztDQUdDLGlDQUFpQyxFQUFFLE1BQU07Q0FDekMsY0FBYyxFQUFFLE1BQU07QUFDdkI7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7OztFQUdFOztBQUVGOztDQUVDLGNBQWM7Q0FDZCxjQUFjO0NBQ2Qsa0JBQWtCO0NBQ2xCLHdCQUF3QjtBQUN6Qjs7QUFFQTtDQUNDLGVBQWU7QUFDaEI7O0FBRUE7Q0FDQyxXQUFXO0FBQ1o7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGtCQUFrQjtBQUNuQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjs7Ozs7Q0FLQyxvQkFBb0IsRUFBRSxNQUFNO0NBQzVCLGVBQWUsRUFBRSxNQUFNO0NBQ3ZCLGlCQUFpQixFQUFFLE1BQU07Q0FDekIsU0FBUyxFQUFFLE1BQU07QUFDbEI7O0FBRUE7OztFQUdFOztBQUVGOztDQUVDLE1BQU07Q0FDTixpQkFBaUI7QUFDbEI7O0FBRUE7OztFQUdFOztBQUVGOztDQUVDLE1BQU07Q0FDTixvQkFBb0I7QUFDckI7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7Q0FJQywwQkFBMEI7QUFDM0I7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7Q0FJQyxrQkFBa0I7Q0FDbEIsVUFBVTtBQUNYOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsOEJBQThCO0FBQy9COztBQUVBOztFQUVFOztBQUVGO0NBQ0MsOEJBQThCO0FBQy9COztBQUVBOzs7OztFQUtFOztBQUVGO0NBQ0Msc0JBQXNCLEVBQUUsTUFBTTtDQUM5QixjQUFjLEVBQUUsTUFBTTtDQUN0QixjQUFjLEVBQUUsTUFBTTtDQUN0QixlQUFlLEVBQUUsTUFBTTtDQUN2QixVQUFVLEVBQUUsTUFBTTtDQUNsQixtQkFBbUIsRUFBRSxNQUFNO0FBQzVCOztBQUVBOztFQUVFOztBQUVGO0NBQ0Msd0JBQXdCO0FBQ3pCOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxzQkFBc0IsRUFBRSxNQUFNO0NBQzlCLFVBQVUsRUFBRSxNQUFNO0FBQ25COztBQUVBOztFQUVFOztBQUVGOztDQUVDLFlBQVk7QUFDYjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyw2QkFBNkIsRUFBRSxNQUFNO0NBQ3JDLG9CQUFvQixFQUFFLE1BQU07QUFDN0I7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyx3QkFBd0I7QUFDekI7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsMEJBQTBCLEVBQUUsTUFBTTtDQUNsQyxhQUFhLEVBQUUsTUFBTTtBQUN0Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOztFQUVFOztBQUVGO0NBQ0Msa0JBQWtCO0FBQ25COztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxhQUFhO0FBQ2Q7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxhQUFhO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuaHRtbCB7XFxuXFx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG5cXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG59XFxuXFxuLyogU2VjdGlvbnNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5ib2R5IHtcXG5cXHRtYXJnaW46IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAqL1xcblxcbm1haW4ge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuXFx0Zm9udC1zaXplOiAyZW07XFxuXFx0bWFyZ2luOiAwLjY3ZW0gMDtcXG59XFxuXFxuLyogR3JvdXBpbmcgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gKi9cXG5cXG5ociB7XFxuXFx0Ym94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG5cXHRoZWlnaHQ6IDA7IC8qIDEgKi9cXG5cXHRvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5wcmUge1xcblxcdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuYSB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi8qKlxcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuXFx0Ym9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAge1xcblxcdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG5cXHRmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICogYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1YixcXG5zdXAge1xcblxcdGZvbnQtc2l6ZTogNzUlO1xcblxcdGxpbmUtaGVpZ2h0OiAwO1xcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuXFx0Ym90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcblxcdHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmltZyB7XFxuXFx0Ym9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG4vKiBGb3Jtc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcblxcdGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuXFx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG5cXHRtYXJnaW46IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQge1xcblxcdC8qIDEgKi9cXG5cXHRvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbixcXG5zZWxlY3Qge1xcblxcdC8qIDEgKi9cXG5cXHR0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcblxcdGJvcmRlci1zdHlsZTogbm9uZTtcXG5cXHRwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcblxcdG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmZpZWxkc2V0IHtcXG5cXHRwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5sZWdlbmQge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG5cXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcblxcdGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuXFx0bWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuXFx0cGFkZGluZzogMDsgLyogMyAqL1xcblxcdHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gKi9cXG5cXG5wcm9ncmVzcyB7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZXh0YXJlYSB7XFxuXFx0b3ZlcmZsb3c6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuXFx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcblxcdHBhZGRpbmc6IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAqL1xcblxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcblxcdG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG5cXHRmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qIEludGVyYWN0aXZlXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICovXFxuXFxuZGV0YWlscyB7XFxuXFx0ZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1bW1hcnkge1xcblxcdGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXFxuLyogTWlzY1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRlbXBsYXRlIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gKi9cXG5cXG5baGlkZGVuXSB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHBsYXlHYW1lIGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCBwYWdlIGZyb20gXCIuL2dhbWVVSVwiO1xuaW1wb3J0IFwiLi9jc3Mvbm9ybWFsaXplLmNzc1wiO1xuaW1wb3J0IFwiLi9jc3MvZ2FtZS5jc3NcIjtcblxucGFnZSgpO1xucGxheUdhbWUoKTtcblxuLy8gaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcbi8vIGltcG9ydCBjcmVhdGVTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuLy8gbGV0IGJvYXJkO1xuLy8gbGV0IHNoaXA7XG5cbi8vIGJvYXJkID0gZ2FtZUJvYXJkKCk7XG4vLyBzaGlwID0gY3JlYXRlU2hpcCgzKTtcblxuLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuLy8gLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDMsIGZhbHNlKTtcbi8vIGNvbnNvbGUubG9nKGB2ZXJ0aWNhbGApO1xuLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDAsIHRydWUpO1xuLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAxKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMik7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDMpO1xuLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuXG4vLyAvLyBib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMCwgZmFsc2UpO1xuLy8gLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygxLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygyLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuIl0sIm5hbWVzIjpbImdhbWVCb2FyZCIsImNyZWF0ZVNoaXAiLCJjb21wdXRlciIsImNvbXBCb2FyZCIsImxhc3RIaXQiLCJ0YXJnZXRNb2RlIiwiYXR0YWNrT3B0aW9ucyIsImlzVHVybiIsInJhbmRvbUF0dGFjayIsImVuZW15IiwieCIsInkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJoaXRCb2FyZCIsInVuZGVmaW5lZCIsInBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5Iiwic2hpcHMiLCJmb3JFYWNoIiwibGVuZ3RoIiwidmVydGljYWwiLCJzaGlwIiwiY2FuUGxhY2VTaGlwIiwicGxhY2VTaGlwIiwidGFyZ2V0QXR0YWNrIiwiZGlyZWN0aW9ucyIsImRpciIsIm5ld1giLCJuZXdZIiwicHVzaCIsInNoaWZ0IiwiY2hvb3NlQXR0YWNrIiwiYXR0YWNrIiwicGxheWVyIiwiX2Nob29zZUF0dGFjayIsImNvbnNvbGUiLCJsb2ciLCJjb25jYXQiLCJhdHRhY2tSZXN1bHQiLCJyZWNlaXZlQXR0YWNrIiwiaGFzTG9zdCIsImFsbFNoaXBzU3VuayIsInZhbHVlIiwiZHJhd0JvYXJkIiwidXBkYXRlQm9hcmQiLCJ1cGRhdGVUdXJuIiwibG9hZEdhbWUiLCJ3aW5uZXIiLCJnYW1lVGltZSIsInVzZXJQYXJhbSIsImNvbXBQYXJhbSIsImdhbWVBY3RpdmVQYXJhbSIsInVzZXIiLCJjb21wIiwiZ2FtZUFjdGl2ZSIsInBsYXllckJvYXJkIiwiYm9hcmQiLCJjZWxscyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNlbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZGF0YXNldCIsInhJbnQiLCJwYXJzZUludCIsInlJbnQiLCJyZXN1bHQiLCJzZXRUaW1lb3V0IiwiX2NvbXAkYXR0YWNrIiwiY29tcFgiLCJjb21wWSIsImNvbXBSZXN1bHQiLCJwbGF5R2FtZSIsImdyaWRDZWxscyIsInJvdGF0ZUJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJzZWxlY3RlZFNoaXBTaXplIiwiaXNIb3Jpem9udGFsIiwiaXNBZGphY2VudEJsb2NrZWQiLCJzdGFydFgiLCJzdGFydFkiLCJzaGlwU2l6ZSIsImkiLCJhZGpYIiwiYWRqWSIsIm5laWdoYm9yWCIsIm5laWdoYm9yWSIsImhhc1NoaXBBdCIsImhpZ2hsaWdodENlbGxzIiwiaXNPdmVybGFwT3JBZGphY2VudCIsImFkZCIsInJlbW92ZUhpZ2hsaWdodCIsInJlbW92ZSIsImNlbGxYIiwiY2VsbFkiLCJzaGlwQ2VsbCIsImVycm9yIiwiQXJyYXkiLCJmcm9tIiwidmFsaWRhdGVDb29yZGluYXRlcyIsIkVycm9yIiwiaXNWZXJ0aWNhbCIsIm1heFgiLCJtYXhZIiwiY2hlY2tYIiwiY2hlY2tZIiwicGxhY2VYIiwicGxhY2VZIiwiaGl0Iiwic3VuayIsImV2ZXJ5Iiwicm93IiwiX3R5cGVvZiIsInNvbGRpZXIiLCJoZWFkZXIiLCJiYXIiLCJjcmVhdGVFbGVtZW50IiwibGVmdEljb24iLCJzcmMiLCJhbHQiLCJ0aXRsZUJveCIsInRpdGxlIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJpZ2h0SWNvbiIsIm1haW5Db250ZW50IiwibWFpbiIsInR1cm4iLCJ0dXJuRGl2IiwidHVybkluZGljYXRvciIsInR1cm5UZXh0IiwiY3JlYXRlQm9hcmQiLCJib2FyZFRpdGxlIiwiYm9hcmRHcmlkIiwiZW5lbXlCb2FyZCIsInJldHVybkJvYXJkR3JpZCIsImlzRW5lbXkiLCJhcmd1bWVudHMiLCJpbm5lckhUTUwiLCJqIiwibWlzcyIsImNoaWxkcmVuIiwic3RhcnRQYWdlIiwicm90YXRlQ29udGFpbmVyIiwic3R5bGUiLCJvcGFjaXR5IiwicGFnZSIsIm5hbWUiLCJjb2wiLCJudW1IaXRzIl0sInNvdXJjZVJvb3QiOiIifQ==