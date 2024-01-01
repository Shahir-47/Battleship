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
    var ships = [3, 2];
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
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.showPopup)();
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
          (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.showPopup)();
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
/* harmony export */   hidePopup: () => (/* binding */ hidePopup),
/* harmony export */   loadGame: () => (/* binding */ loadGame),
/* harmony export */   showPopup: () => (/* binding */ showPopup),
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
      if (board[i][j] !== undefined) {
        cell.classList.add("ship");
        cell.classList.add("ship-".concat(board[i][j].name));
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
  } else {
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
  turnText.textContent = isTurn ? "Your Turn" : "Computer's Turn";
}
function winner(player) {
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.textContent = "".concat(player, " won!");
}
function hidePopup() {
  document.getElementById("playAgainPopup").style.display = "none";
}
function page() {
  header();
  mainContent();
  startPage();
}
function showPopup() {
  document.getElementById("playAgainPopup").style.display = "block";
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

#playAgainButton,
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

#playAgainButton:hover,
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

.cell-with-ship {
	background-color: #4caf50; /* Example color, adjust as needed */
	border: 1px solid #ffffff87; /* Example border, adjust as needed */
}

div.board-grid .cell.cell-with-ship {
	border: 3px ridge #a42514; /* Example border, adjust as needed */
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

div.cell.ship.hit {
	background-color: #00ff1e87;
	border: 1px solid #00ff1e87;
}

.sunk {
	background-color: #ff00ee87;
}

.popup {
	display: none;
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background-color: transparent;
	color: #dddddd;
	padding: 20px;
	z-index: 1000; /* Ensure it's above other content */
}

.popup-content {
	text-align: center;
}

.popup-content p {
	font-size: 1rem;
	font-weight: 900;
}
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"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","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\t--content-text-color: #dddddd;\n\t--title-box-color: #dddddd;\n\t--item-focus-color: #1f2937;\n\t--search-box-bg-color: #192734;\n\t--search-input-color: #dddddd;\n\t--search-btn-bg-color: #313e4b;\n\t--logo-color: #dddddd;\n\t--toggle-switch-bg-color: #6b757e;\n\t--toggle-switch-border-color: #2ca9bc;\n\t--footer-color: #dddddd;\n\t--footer-active: #ffffff;\n\t--add-btn-color: #3f51b5;\n\t--add-btn-bg-color: #90caf9;\n\t--form-header-color: #dddddd;\n\t--form-scroll-box-bg-color: #9e9e9e21;\n\t--todo-item-bg-color: #192734;\n\t--todo-item-hover-color: #2d3d4d;\n\t--back-btn-color: #3f51b5;\n\t--form-input-color: #192734;\n\t--header-color: #dddddd;\n\t--note-color: #ffffff;\n\t--note-header: #90caf9;\n\t--note-out-of-focus: #dddddd;\n\t--highlight: #5369e5;\n\t--red: #c81414;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: flex-start;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.cell.overlap {\n\tbackground-color: red; /* Color indicating invalid placement due to overlap */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.header h1 {\n\ttext-align: center; /* Center the header text */\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\tfont-size: 48px; /* Set a large font size for impact */\n\tcolor: #ffffff87; /* White color for the text for better contrast */\n\tbackground-color: #19211a; /* Navy blue background */\n\tpadding: 20px; /* Add some padding around the text */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin: 0px; /* Add some space below the header */\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177; /* Change text color on hover */\n\tcursor: pointer; /* Change the cursor to indicate it's clickable */\n}\n\n.icon {\n\twidth: 6rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\t/* background-color: #ffffff87; */\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin-bottom: 30px; /* Add some space below the header */\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1; /* Start fully visible */\n}\n\n.rotate-container {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n#playAgainButton,\n.rotate-button {\n\tbackground-color: #506052;\n\tcolor: #c1c1c1d6;\n\tborder: 2px solid #929392;\n\tpadding: 10px 20px;\n\tborder-radius: 5px;\n\tfont-weight: bold;\n\tcursor: pointer;\n\ttransition:\n\t\ttransform 0.3s ease,\n\t\tbackground-color 0.3s ease;\n}\n\n#playAgainButton:hover,\n.rotate-button:hover {\n\tbackground-color: #2c7235; /* Background color on hover */\n\tcolor: #ffffff87; /* Text color on hover */\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.cell.highlight {\n\tbackground-color: lightblue;\n}\n\n.cell.blocked {\n\tbackground-color: red; /* Color indicating invalid placement */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.cell-with-ship {\n\tbackground-color: #4caf50; /* Example color, adjust as needed */\n\tborder: 1px solid #ffffff87; /* Example border, adjust as needed */\n}\n\ndiv.board-grid .cell.cell-with-ship {\n\tborder: 3px ridge #a42514; /* Example border, adjust as needed */\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.5vw) / repeat(10, 2.5vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: #1e90ff;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\ndiv.cell.ship.hit {\n\tbackground-color: #00ff1e87;\n\tborder: 1px solid #00ff1e87;\n}\n\n.sunk {\n\tbackground-color: #ff00ee87;\n}\n\n.popup {\n\tdisplay: none;\n\tposition: fixed;\n\tleft: 50%;\n\ttop: 50%;\n\ttransform: translate(-50%, -50%);\n\tbackground-color: transparent;\n\tcolor: #dddddd;\n\tpadding: 20px;\n\tz-index: 1000; /* Ensure it's above other content */\n}\n\n.popup-content {\n\ttext-align: center;\n}\n\n.popup-content p {\n\tfont-size: 1rem;\n\tfont-weight: 900;\n}\n"],"sourceRoot":""}]);
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
document.getElementById("playAgainButton").addEventListener("click", function () {
  // Code to reset the game and start again
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_1__.hidePopup)();
  var content = document.querySelector("div#content");
  content.innerHTML = "";
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])();
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLE9BQU8sZ0dBQWdHLE1BQU0sUUFBUSxRQUFRLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxRQUFRLFFBQVEsTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIsdUJBQXVCLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixPQUFPLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHVCQUF1Qix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sTUFBTSxZQUFZLE9BQU8sT0FBTyxNQUFNLE9BQU8sc0JBQXNCLHFCQUFxQixPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLE1BQU0sTUFBTSxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFFBQVEsUUFBUSxNQUFNLFNBQVMsc0JBQXNCLHFCQUFxQix1QkFBdUIscUJBQXFCLE9BQU8sT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLE9BQU8sT0FBTyxNQUFNLE1BQU0sVUFBVSxZQUFZLE9BQU8sTUFBTSxNQUFNLFFBQVEsWUFBWSxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksV0FBVyxNQUFNLE1BQU0sTUFBTSxRQUFRLFlBQVksT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sU0FBUyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixxQkFBcUIscUJBQXFCLHFCQUFxQix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sTUFBTSxNQUFNLHNCQUFzQixxQkFBcUIsT0FBTyxNQUFNLE1BQU0sTUFBTSxVQUFVLE1BQU0sT0FBTyxN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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3M/YTNjZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzPzZkNTQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmZ1bmN0aW9uIGNvbXB1dGVyKCkge1xuXHRjb25zdCBjb21wQm9hcmQgPSBnYW1lQm9hcmQoKTtcblx0bGV0IGxhc3RIaXQgPSBudWxsO1xuXHRsZXQgdGFyZ2V0TW9kZSA9IGZhbHNlO1xuXHRsZXQgYXR0YWNrT3B0aW9ucyA9IFtdOyAvLyBTdG9yZXMgcG90ZW50aWFsIGNlbGxzIHRvIGF0dGFjayBpbiB0YXJnZXQgbW9kZVxuXHRsZXQgaXNUdXJuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG5cdFx0bGV0IHg7XG5cdFx0bGV0IHk7XG5cdFx0ZG8ge1xuXHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0fSB3aGlsZSAoZW5lbXkuaGl0Qm9hcmRbeV1beF0gIT09IHVuZGVmaW5lZCk7XG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKSB7XG5cdFx0Y29uc3Qgc2hpcHMgPSBbMywgMl07XG5cdFx0c2hpcHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG5cdFx0XHRsZXQgeDtcblx0XHRcdGxldCB5O1xuXHRcdFx0bGV0IHZlcnRpY2FsO1xuXHRcdFx0Y29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoKTtcblx0XHRcdGRvIHtcblx0XHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0eSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0dmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0fSB3aGlsZSAoIWNvbXBCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpKTtcblx0XHRcdGNvbXBCb2FyZC5wbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gdGFyZ2V0QXR0YWNrKGVuZW15KSB7XG5cdFx0aWYgKGF0dGFja09wdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRjb25zdCBkaXJlY3Rpb25zID0gW1xuXHRcdFx0XHRbMSwgMF0sXG5cdFx0XHRcdFstMSwgMF0sXG5cdFx0XHRcdFswLCAxXSxcblx0XHRcdFx0WzAsIC0xXSxcblx0XHRcdF07XG5cdFx0XHRkaXJlY3Rpb25zLmZvckVhY2goKGRpcikgPT4ge1xuXHRcdFx0XHRjb25zdCBuZXdYID0gbGFzdEhpdC54ICsgZGlyWzBdO1xuXHRcdFx0XHRjb25zdCBuZXdZID0gbGFzdEhpdC55ICsgZGlyWzFdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0bmV3WCA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WCA8IDEwICYmXG5cdFx0XHRcdFx0bmV3WSA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WSA8IDEwICYmXG5cdFx0XHRcdFx0ZW5lbXkuaGl0Qm9hcmRbbmV3WV1bbmV3WF0gPT09IHVuZGVmaW5lZFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRhdHRhY2tPcHRpb25zLnB1c2goeyB4OiBuZXdYLCB5OiBuZXdZIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXR0YWNrT3B0aW9ucy5zaGlmdCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hvb3NlQXR0YWNrKGVuZW15KSB7XG5cdFx0cmV0dXJuIHRhcmdldE1vZGUgPyB0YXJnZXRBdHRhY2soZW5lbXkpIDogcmFuZG9tQXR0YWNrKGVuZW15KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGF0dGFjayhwbGF5ZXIpIHtcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNob29zZUF0dGFjayhwbGF5ZXIpO1xuXHRcdGNvbnNvbGUubG9nKGB4OiAke3h9LCB5OiAke3l9YCk7XG5cdFx0Y29uc3QgYXR0YWNrUmVzdWx0ID0gcGxheWVyLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdFx0Y29uc29sZS5sb2coYGNvbXB1dGVyIGF0dGFja1Jlc3VsdDogJHthdHRhY2tSZXN1bHR9YCk7XG5cdFx0aWYgKGF0dGFja1Jlc3VsdCA9PT0gXCJoaXRcIikge1xuXHRcdFx0bGFzdEhpdCA9IHsgeCwgeSB9O1xuXHRcdFx0dGFyZ2V0TW9kZSA9IHRydWU7XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwibWlzc1wiICYmIGxhc3RIaXQgJiYgdGFyZ2V0TW9kZSkge1xuXHRcdFx0aWYgKGF0dGFja09wdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRhcmdldE1vZGUgPSBmYWxzZTsgLy8gU3dpdGNoIGJhY2sgdG8gcmFuZG9tIG1vZGUgaWYgbm8gb3B0aW9ucyBsZWZ0XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRsYXN0SGl0ID0gbnVsbDtcblx0XHRcdHRhcmdldE1vZGUgPSBmYWxzZTtcblx0XHRcdGF0dGFja09wdGlvbnMgPSBbXTsgLy8gQ2xlYXIgYXR0YWNrIG9wdGlvbnNcblx0XHR9XG5cdFx0cmV0dXJuIHsgeCwgeSwgYXR0YWNrUmVzdWx0IH07XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNMb3N0KCkge1xuXHRcdHJldHVybiBjb21wQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5LFxuXHRcdGF0dGFjayxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGhhc0xvc3QsXG5cdFx0Y2hvb3NlQXR0YWNrLFxuXHRcdGdldCBpc1R1cm4oKSB7XG5cdFx0XHRyZXR1cm4gaXNUdXJuO1xuXHRcdH0sXG5cdFx0c2V0IGlzVHVybih2YWx1ZSkge1xuXHRcdFx0aXNUdXJuID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQgY29tcEJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGNvbXBCb2FyZDtcblx0XHR9LFxuXHRcdGdldCB0YXJnZXRNb2RlKCkge1xuXHRcdFx0cmV0dXJuIHRhcmdldE1vZGU7XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXI7XG4iLCJpbXBvcnQgcGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IGNvbXB1dGVyIGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQge1xuXHRkcmF3Qm9hcmQsXG5cdHVwZGF0ZUJvYXJkLFxuXHR1cGRhdGVUdXJuLFxuXHRsb2FkR2FtZSxcblx0d2lubmVyLFxuXHRzaG93UG9wdXAsXG59IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5mdW5jdGlvbiBnYW1lVGltZSh1c2VyUGFyYW0sIGNvbXBQYXJhbSwgZ2FtZUFjdGl2ZVBhcmFtKSB7XG5cdGNvbnN0IHVzZXIgPSB1c2VyUGFyYW07XG5cdGNvbnN0IGNvbXAgPSBjb21wUGFyYW07XG5cdGxldCBnYW1lQWN0aXZlID0gZ2FtZUFjdGl2ZVBhcmFtO1xuXG5cdGNvbnNvbGUubG9nKFwidXNlciBib2FyZDpcIik7XG5cdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXG5cdGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTtcblxuXHRjb25zb2xlLmxvZyhcImNvbXAgYm9hcmQ6XCIpO1xuXHRjb25zb2xlLmxvZyhjb21wLmNvbXBCb2FyZC5ib2FyZCk7XG5cblx0ZHJhd0JvYXJkKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXHRkcmF3Qm9hcmQoY29tcC5jb21wQm9hcmQuYm9hcmQsIHRydWUpO1xuXG5cdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblxuXHRjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXkgLmNlbGxcIik7XG5cdGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuXHRcdFx0aWYgKCFnYW1lQWN0aXZlIHx8ICF1c2VyLmlzVHVybikgcmV0dXJuO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgfHxcblx0XHRcdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxuXHRcdFx0KVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjb25zdCB7IHggfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB7IHkgfSA9IGUudGFyZ2V0LmRhdGFzZXQ7XG5cdFx0XHRjb25zdCB4SW50ID0gcGFyc2VJbnQoeCwgMTApO1xuXHRcdFx0Y29uc3QgeUludCA9IHBhcnNlSW50KHksIDEwKTtcblxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gdXNlci5hdHRhY2soeEludCwgeUludCwgY29tcCk7XG5cdFx0XHR1cGRhdGVCb2FyZCh4SW50LCB5SW50LCByZXN1bHQsIHRydWUpO1xuXG5cdFx0XHRpZiAoY29tcC5oYXNMb3N0KCkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJjb21wIGhhcyBsb3N0XCIpO1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdHdpbm5lcihcInVzZXJcIik7XG5cdFx0XHRcdHNob3dQb3B1cCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVzZXIuaXNUdXJuID0gZmFsc2U7XG5cdFx0XHRjb21wLmlzVHVybiA9IHRydWU7XG5cdFx0XHR1cGRhdGVUdXJuKHVzZXIuaXNUdXJuKTtcblxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHtcblx0XHRcdFx0XHR4OiBjb21wWCxcblx0XHRcdFx0XHR5OiBjb21wWSxcblx0XHRcdFx0XHRhdHRhY2tSZXN1bHQ6IGNvbXBSZXN1bHQsXG5cdFx0XHRcdH0gPSBjb21wLmF0dGFjayh1c2VyKTtcblx0XHRcdFx0dXBkYXRlQm9hcmQoY29tcFgsIGNvbXBZLCBjb21wUmVzdWx0LCBmYWxzZSk7XG5cblx0XHRcdFx0aWYgKHVzZXIuaGFzTG9zdCgpKSB7XG5cdFx0XHRcdFx0Z2FtZUFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwidXNlciBoYXMgbG9zdFwiKTtcblx0XHRcdFx0XHR3aW5uZXIoXCJjb21wXCIpO1xuXHRcdFx0XHRcdHNob3dQb3B1cCgpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVzZXIuaXNUdXJuID0gdHJ1ZTtcblx0XHRcdFx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdFx0dXBkYXRlVHVybih1c2VyLmlzVHVybik7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHBsYXlHYW1lKCkge1xuXHRjb25zdCBnYW1lQWN0aXZlID0gdHJ1ZTtcblx0Y29uc3QgdXNlciA9IHBsYXllcihcIlBsYXllciAxXCIpO1xuXHRjb25zdCBjb21wID0gY29tcHV0ZXIoKTtcblxuXHRjb25zdCBncmlkQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtY2VsbFwiKTtcblx0Y29uc3Qgcm90YXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtYnV0dG9uXCIpO1xuXHRjb25zdCBzaGlwcyA9IFs1LCA0LCAzLCAzLCAyXTtcblx0bGV0IHNlbGVjdGVkU2hpcFNpemUgPSBzaGlwcy5zaGlmdCgpO1xuXHRsZXQgaXNIb3Jpem9udGFsID0gdHJ1ZTsgLy8gT3JpZW50YXRpb24gb2YgdGhlIHNoaXBcblxuXHRmdW5jdGlvbiBpc0FkamFjZW50QmxvY2tlZChzdGFydFgsIHN0YXJ0WSwgc2hpcFNpemUpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHggPSAhaXNIb3Jpem9udGFsID8gc3RhcnRYIDogc3RhcnRYICsgaTtcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpO1xuXG5cdFx0XHRmb3IgKGxldCBhZGpYID0gLTE7IGFkalggPD0gMTsgYWRqWCArPSAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGFkalkgPSAtMTsgYWRqWSA8PSAxOyBhZGpZICs9IDEpIHtcblx0XHRcdFx0XHRjb25zdCBuZWlnaGJvclggPSB4ICsgYWRqWDtcblx0XHRcdFx0XHRjb25zdCBuZWlnaGJvclkgPSB5ICsgYWRqWTtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYIDwgMTAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPCAxMFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0aWYgKHVzZXIucGxheWVyQm9hcmQuaGFzU2hpcEF0KG5laWdoYm9yWCwgbmVpZ2hib3JZKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGlnaGxpZ2h0Q2VsbHMoZSwgc2hpcFNpemUpIHtcblx0XHRjb25zdCBzdGFydFggPSBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LngsIDEwKTtcblx0XHRjb25zdCBzdGFydFkgPSBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LnksIDEwKTtcblxuXHRcdC8vIEFzc3VtaW5nIHVzZXIucGxheWVyQm9hcmQgaXMgYWNjZXNzaWJsZSBhbmQgaGFzIGEgbWV0aG9kIHRvIGNoZWNrIGZvciBzaGlwIGF0IGEgZ2l2ZW4gcG9zaXRpb25cblx0XHRsZXQgaXNPdmVybGFwT3JBZGphY2VudCA9IGlzQWRqYWNlbnRCbG9ja2VkKHN0YXJ0WCwgc3RhcnRZLCBzaGlwU2l6ZSk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHggPSAhaXNIb3Jpem9udGFsID8gc3RhcnRYIDogc3RhcnRYICsgaTtcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFjZWxsIHx8IHggPj0gMTAgfHwgeSA+PSAxMCB8fCB1c2VyLnBsYXllckJvYXJkLmhhc1NoaXBBdCh4LCB5KSkge1xuXHRcdFx0XHRpc092ZXJsYXBPckFkamFjZW50ID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCB4ID0gIWlzSG9yaXpvbnRhbCA/IHN0YXJ0WCA6IHN0YXJ0WCArIGk7XG5cdFx0XHRjb25zdCB5ID0gaXNIb3Jpem9udGFsID8gc3RhcnRZIDogc3RhcnRZICsgaTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxuXHRcdFx0KTtcblx0XHRcdGlmIChjZWxsKSB7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChpc092ZXJsYXBPckFkamFjZW50ID8gXCJvdmVybGFwXCIgOiBcImhpZ2hsaWdodFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoKSB7XG5cdFx0Z3JpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodFwiLCBcIm92ZXJsYXBcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRncmlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT4ge1xuXHRcdFx0aWYgKHNlbGVjdGVkU2hpcFNpemUgPT09IC0xKSByZXR1cm47XG5cdFx0XHRoaWdobGlnaHRDZWxscyhlLCBzZWxlY3RlZFNoaXBTaXplKTtcblx0XHR9KTtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCByZW1vdmVIaWdobGlnaHQpO1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnN0IHggPSBwYXJzZUludChjZWxsLmRhdGFzZXQueCwgMTApO1xuXHRcdFx0Y29uc3QgeSA9IHBhcnNlSW50KGNlbGwuZGF0YXNldC55LCAxMCk7XG5cblx0XHRcdGlmICh1c2VyLmNhblBsYWNlU2hpcChzZWxlY3RlZFNoaXBTaXplLCB4LCB5LCAhaXNIb3Jpem9udGFsKSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoc2VsZWN0ZWRTaGlwU2l6ZSksIHgsIHksICFpc0hvcml6b250YWwpO1xuXG5cdFx0XHRcdFx0Ly8gVmlzdWFsaXplIHRoZSBwbGFjZWQgc2hpcFxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRTaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsWCA9ICFpc0hvcml6b250YWwgPyB4IDogeCArIGk7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsWSA9IGlzSG9yaXpvbnRhbCA/IHkgOiB5ICsgaTtcblx0XHRcdFx0XHRcdGNvbnN0IHNoaXBDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHtjZWxsWH1cIl1bZGF0YS15PVwiJHtjZWxsWX1cIl1gLFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGlmIChzaGlwQ2VsbCkge1xuXHRcdFx0XHRcdFx0XHRzaGlwQ2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbC13aXRoLXNoaXBcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c2VsZWN0ZWRTaGlwU2l6ZSA9IHNoaXBzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkU2hpcFNpemUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRTaGlwU2l6ZSA9IC0xO1xuXHRcdFx0XHRcdFx0cmVtb3ZlSGlnaGxpZ2h0KCk7XG5cdFx0XHRcdFx0XHRsb2FkR2FtZSgpO1xuXHRcdFx0XHRcdFx0Z2FtZVRpbWUodXNlciwgY29tcCwgZ2FtZUFjdGl2ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHVzZXIucGxheWVyQm9hcmQuYm9hcmQpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdC8vIEhhbmRsZSBlcnJvclxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBIYW5kbGUgaW52YWxpZCBwbGFjZW1lbnRcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0cm90YXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aXNIb3Jpem9udGFsID0gIWlzSG9yaXpvbnRhbDtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXlHYW1lO1xuIiwiZnVuY3Rpb24gZ2FtZUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pKTtcblxuXHRmdW5jdGlvbiB2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpIHtcblx0XHRpZiAodHlwZW9mIHggIT09IFwibnVtYmVyXCIgfHwgeCA8IDAgfHwgeCA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ4IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHRcdGlmICh0eXBlb2YgeSAhPT0gXCJudW1iZXJcIiB8fCB5IDwgMCB8fCB5ID4gOSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInkgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7XG5cdFx0aWYgKHR5cGVvZiBpc1ZlcnRpY2FsICE9PSBcImJvb2xlYW5cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImlzVmVydGljYWwgbXVzdCBiZSBhIGJvb2xlYW5cIik7XG5cdFx0Y29uc3QgbGVuZ3RoID0gc2hpcC5sZW5ndGggLSAxO1xuXHRcdGNvbnN0IG1heFggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBsZW5ndGg7XG5cdFx0Y29uc3QgbWF4WSA9IGlzVmVydGljYWwgPyB5ICsgbGVuZ3RoIDogeTtcblxuXHRcdGlmIChtYXhYID4gOSB8fCBtYXhZID4gOSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IGNoZWNrWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBjaGVja1kgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0aWYgKGJvYXJkW2NoZWNrWV1bY2hlY2tYXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdC8vIENoZWNrIGFkamFjZW50IGNlbGxzXG5cdFx0XHRmb3IgKGxldCBhZGpYID0gLTE7IGFkalggPD0gMTsgYWRqWCArPSAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGFkalkgPSAtMTsgYWRqWSA8PSAxOyBhZGpZICs9IDEpIHtcblx0XHRcdFx0XHRjb25zdCBuZWlnaGJvclggPSBjaGVja1ggKyBhZGpYO1xuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWSA9IGNoZWNrWSArIGFkalk7XG5cblx0XHRcdFx0XHQvLyBWYWxpZGF0ZSBuZWlnaGJvciBjb29yZGluYXRlc1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPCAxMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA8IDEwXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRpZiAoYm9hcmRbbmVpZ2hib3JZXVtuZWlnaGJvclhdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHRpZiAoIWNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHBsYWNlIHNoaXAgaGVyZVwiKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHBsYWNlWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBwbGFjZVkgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0Ym9hcmRbcGxhY2VZXVtwbGFjZVhdID0gc2hpcDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNTaGlwQXQoeCwgeSkge1xuXHRcdHJldHVybiBib2FyZFt5XVt4XSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG5cdFx0dmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KTtcblx0XHRpZiAoYm9hcmRbeV1beF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ym9hcmRbeV1beF0gPSBcIm1pc3NcIjtcblx0XHRcdHJldHVybiBcIm1pc3NcIjtcblx0XHR9XG5cdFx0Ym9hcmRbeV1beF0uaGl0KCk7XG5cdFx0aWYgKGJvYXJkW3ldW3hdLnN1bmspIHJldHVybiBcInN1bmtcIjtcblx0XHRyZXR1cm4gXCJoaXRcIjtcblx0fVxuXG5cdGZ1bmN0aW9uIGFsbFNoaXBzU3VuaygpIHtcblx0XHRyZXR1cm4gYm9hcmQuZXZlcnkoKHJvdykgPT5cblx0XHRcdHJvdy5ldmVyeShcblx0XHRcdFx0KGNlbGwpID0+XG5cdFx0XHRcdFx0Y2VsbCA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0Y2VsbCA9PT0gXCJtaXNzXCIgfHxcblx0XHRcdFx0XHQodHlwZW9mIGNlbGwgPT09IFwib2JqZWN0XCIgJiYgY2VsbC5zdW5rKSxcblx0XHRcdCksXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Z2V0IGJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGJvYXJkO1xuXHRcdH0sXG5cdFx0Y2FuUGxhY2VTaGlwLFxuXHRcdHBsYWNlU2hpcCxcblx0XHRoYXNTaGlwQXQsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhbGxTaGlwc1N1bmssXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVCb2FyZDtcbiIsImltcG9ydCBzb2xkaWVyIGZyb20gXCIuL2ltZy9zb2xkaWVyLnN2Z1wiO1xuXG5mdW5jdGlvbiBoZWFkZXIoKSB7XG5cdGNvbnN0IGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJhci5jbGFzc0xpc3QuYWRkKFwibmF2LWJhclwiKTtcblxuXHQvLyBpdGVtcyBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBoZWFkZXJcblx0Y29uc3QgbGVmdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRsZWZ0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0bGVmdEljb24uc3JjID0gc29sZGllcjtcblx0bGVmdEljb24uYWx0ID0gXCJzb2xkaWVyXCI7XG5cblx0Ly8gQ3JlYXRlIHRoZSBtZW51IGJ1dHRvblxuXHRjb25zdCB0aXRsZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRpdGxlQm94LmNsYXNzTGlzdC5hZGQoXCJoZWFkZXJcIik7XG5cdGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXHR0aXRsZS50ZXh0Q29udGVudCA9IFwiQmF0dGxlc2hpcFwiO1xuXHR0aXRsZUJveC5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cblx0Y29uc3QgcmlnaHRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0cmlnaHRJY29uLmNsYXNzTGlzdC5hZGQoXCJpY29uXCIpO1xuXHRyaWdodEljb24uc3JjID0gc29sZGllcjtcblx0cmlnaHRJY29uLmFsdCA9IFwic29sZGllclwiO1xuXG5cdGJhci5hcHBlbmRDaGlsZChsZWZ0SWNvbik7XG5cdGJhci5hcHBlbmRDaGlsZCh0aXRsZUJveCk7XG5cdGJhci5hcHBlbmRDaGlsZChyaWdodEljb24pO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChiYXIpO1xufVxuXG5mdW5jdGlvbiBtYWluQ29udGVudCgpIHtcblx0Y29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdG1haW4uY2xhc3NMaXN0LmFkZChcIm1haW4tY29udGVudFwiKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdiNjb250ZW50XCIpLmFwcGVuZENoaWxkKG1haW4pO1xufVxuXG5mdW5jdGlvbiB0dXJuKCkge1xuXHRjb25zdCB0dXJuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dHVybkRpdi5jbGFzc0xpc3QuYWRkKFwidHVybi1kaXZcIik7XG5cdGNvbnN0IHR1cm5JbmRpY2F0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0dXJuSW5kaWNhdG9yLmNsYXNzTGlzdC5hZGQoXCJ0dXJuLWluZGljYXRvclwiKTtcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBcIllvdXIgVHVyblwiO1xuXHR0dXJuSW5kaWNhdG9yLmFwcGVuZENoaWxkKHR1cm5UZXh0KTtcblx0dHVybkRpdi5hcHBlbmRDaGlsZCh0dXJuSW5kaWNhdG9yKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIikuYXBwZW5kQ2hpbGQodHVybkRpdik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5mdW5jdGlvbiBwbGF5ZXJCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwicGxheWVyXCIpO1xuXG5cdGNvbnN0IGJvYXJkVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG5cdGJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBcIllvdXIgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5mdW5jdGlvbiBlbmVteUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJlbmVteVwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJFbmVteSBCb2FyZFwiO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZFRpdGxlKTtcblxuXHRjb25zdCBib2FyZEdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZEdyaWQuY2xhc3NMaXN0LmFkZChcImJvYXJkLWdyaWRcIik7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkR3JpZCk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5ib2FyZFwiKS5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmZ1bmN0aW9uIHJldHVybkJvYXJkR3JpZChlbmVteSkge1xuXHRsZXQgYm9hcmRHcmlkO1xuXHRpZiAoZW5lbXkpIHtcblx0XHRib2FyZEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmVuZW15IGRpdi5ib2FyZC1ncmlkXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGJvYXJkR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYucGxheWVyIGRpdi5ib2FyZC1ncmlkXCIpO1xuXHR9XG5cdHJldHVybiBib2FyZEdyaWQ7XG59XG5cbmZ1bmN0aW9uIGRyYXdCb2FyZChib2FyZCwgaXNFbmVteSA9IGZhbHNlKSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChpc0VuZW15KTtcblx0Ym9hcmRHcmlkLmlubmVySFRNTCA9IFwiXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkW2ldLmxlbmd0aDsgaiArPSAxKSB7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG5cdFx0XHRjZWxsLmRhdGFzZXQueCA9IGo7XG5cdFx0XHRjZWxsLmRhdGFzZXQueSA9IGk7XG5cblx0XHRcdGlmIChib2FyZFtpXVtqXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChgc2hpcC0ke2JvYXJkW2ldW2pdLm5hbWV9YCk7XG5cdFx0XHR9XG5cdFx0XHRib2FyZEdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1pc3MoeCwgeSwgZW5lbXkpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGVuZW15KTtcblx0Y29uc3QgY2VsbCA9IGJvYXJkR3JpZC5jaGlsZHJlblt5ICogMTAgKyB4XTtcblx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbn1cblxuZnVuY3Rpb24gaGl0KHgsIHksIGVuZW15KSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChlbmVteSk7XG5cdGNvbnN0IGNlbGwgPSBib2FyZEdyaWQuY2hpbGRyZW5beSAqIDEwICsgeF07XG5cdGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQm9hcmQoeCwgeSwgcmVzdWx0LCBlbmVteSkge1xuXHRpZiAocmVzdWx0ID09PSBcIm1pc3NcIikge1xuXHRcdG1pc3MoeCwgeSwgZW5lbXkpO1xuXHR9IGVsc2Uge1xuXHRcdGhpdCh4LCB5LCBlbmVteSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RhcnRQYWdlKCkge1xuXHRjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIik7XG5cdG1haW4uaW5uZXJIVE1MID0gXCJcIjtcblx0dHVybigpO1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYudHVybi1pbmRpY2F0b3IgcFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgc2hpcHMgYnkgY2xpY2tpbmcgb24gdGhlIGJvYXJkIGJlbG93XCI7XG5cblx0Y29uc3Qgcm90YXRlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0cm90YXRlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtY29udGFpbmVyXCIpO1xuXG5cdGNvbnN0IHJvdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHJvdGF0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLWJ1dHRvblwiKTtcblx0cm90YXRlQnV0dG9uLnRleHRDb250ZW50ID0gXCJSb3RhdGVcIjtcblx0cm90YXRlQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdGF0ZUJ1dHRvbik7XG5cdG1haW4uYXBwZW5kQ2hpbGQocm90YXRlQ29udGFpbmVyKTtcblxuXHRjb25zdCBib2FyZEdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZEdyaWQuY2xhc3NMaXN0LmFkZChcImJvYXJkLWdyaWRcIik7XG5cdG1haW4uYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XG5cdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcblx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNlbGxcIik7XG5cdFx0Y2VsbC5kYXRhc2V0LnggPSBpICUgMTA7XG5cdFx0Y2VsbC5kYXRhc2V0LnkgPSBNYXRoLmZsb29yKGkgLyAxMCk7XG5cdFx0Ym9hcmRHcmlkLmFwcGVuZENoaWxkKGNlbGwpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvYWRHYW1lKCkge1xuXHRjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIik7XG5cdG1haW4uaW5uZXJIVE1MID0gXCJcIjtcblx0dHVybigpO1xuXHRjcmVhdGVCb2FyZCgpO1xuXHRwbGF5ZXJCb2FyZCgpO1xuXHRlbmVteUJvYXJkKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVR1cm4oaXNUdXJuKSB7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IGlzVHVybiA/IFwiWW91ciBUdXJuXCIgOiBcIkNvbXB1dGVyJ3MgVHVyblwiO1xufVxuXG5mdW5jdGlvbiB3aW5uZXIocGxheWVyKSB7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IGAke3BsYXllcn0gd29uIWA7XG59XG5cbmZ1bmN0aW9uIGhpZGVQb3B1cCgpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5QWdhaW5Qb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cbmZ1bmN0aW9uIHBhZ2UoKSB7XG5cdGhlYWRlcigpO1xuXHRtYWluQ29udGVudCgpO1xuXHRzdGFydFBhZ2UoKTtcbn1cblxuZnVuY3Rpb24gc2hvd1BvcHVwKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlBZ2FpblBvcHVwXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhZ2U7XG5leHBvcnQge1xuXHRkcmF3Qm9hcmQsXG5cdHVwZGF0ZUJvYXJkLFxuXHR1cGRhdGVUdXJuLFxuXHRsb2FkR2FtZSxcblx0d2lubmVyLFxuXHRzaG93UG9wdXAsXG5cdGhpZGVQb3B1cCxcbn07XG4iLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuXG5mdW5jdGlvbiBwbGF5ZXIobmFtZSA9IFwiYW5vbnltb3VzXCIpIHtcblx0Y29uc3QgcGxheWVyQm9hcmQgPSBnYW1lQm9hcmQoKTtcblx0Y29uc3QgaGl0Qm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cdGxldCBpc1R1cm4gPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cmV0dXJuIHBsYXllckJvYXJkLmNhblBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuXHRcdGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwiaGl0XCI7XG5cdFx0fSBlbHNlIGlmIChyZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcInN1bmtcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJtaXNzXCI7XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKGBwbGF5ZXIgaGl0Qm9hcmQ6YCk7XG5cdFx0Y29uc29sZS5sb2coaGl0Qm9hcmQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2socm93LCBjb2wsIGVuZW15KSB7XG5cdFx0cmV0dXJuIGVuZW15LnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gcGxheWVyQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG5hbWUsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdGNhblBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGdldCBpc1R1cm4oKSB7XG5cdFx0XHRyZXR1cm4gaXNUdXJuO1xuXHRcdH0sXG5cdFx0c2V0IGlzVHVybih2YWx1ZSkge1xuXHRcdFx0aXNUdXJuID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQgcGxheWVyQm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gcGxheWVyQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgaGl0Qm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gaGl0Qm9hcmQ7XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiZnVuY3Rpb24gY3JlYXRlU2hpcChsZW5ndGgpIHtcblx0aWYgKHR5cGVvZiBsZW5ndGggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRpZiAobGVuZ3RoIDwgMSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIik7XG5cdGlmIChsZW5ndGggJSAxICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhbiBpbnRlZ2VyXCIpO1xuXHRpZiAobGVuZ3RoID4gNSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgbGVzcyB0aGFuIDZcIik7XG5cblx0bGV0IG51bUhpdHMgPSAwO1xuXHRsZXQgc3VuayA9IGZhbHNlO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0IGxlbmd0aCgpIHtcblx0XHRcdHJldHVybiBsZW5ndGg7XG5cdFx0fSxcblx0XHRnZXQgbnVtSGl0cygpIHtcblx0XHRcdHJldHVybiBudW1IaXRzO1xuXHRcdH0sXG5cdFx0Z2V0IHN1bmsoKSB7XG5cdFx0XHRyZXR1cm4gc3Vuaztcblx0XHR9LFxuXHRcdGhpdCgpIHtcblx0XHRcdG51bUhpdHMgKz0gMTtcblx0XHRcdGlmIChudW1IaXRzID09PSBsZW5ndGgpIHtcblx0XHRcdFx0c3VuayA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5IHtcblx0LS1zaWRlYmFyLWJnLWNvbG9yOiAjMTkyMTFhO1xuXHQtLWNvbnRlbnQtdGV4dC1jb2xvcjogI2RkZGRkZDtcblx0LS10aXRsZS1ib3gtY29sb3I6ICNkZGRkZGQ7XG5cdC0taXRlbS1mb2N1cy1jb2xvcjogIzFmMjkzNztcblx0LS1zZWFyY2gtYm94LWJnLWNvbG9yOiAjMTkyNzM0O1xuXHQtLXNlYXJjaC1pbnB1dC1jb2xvcjogI2RkZGRkZDtcblx0LS1zZWFyY2gtYnRuLWJnLWNvbG9yOiAjMzEzZTRiO1xuXHQtLWxvZ28tY29sb3I6ICNkZGRkZGQ7XG5cdC0tdG9nZ2xlLXN3aXRjaC1iZy1jb2xvcjogIzZiNzU3ZTtcblx0LS10b2dnbGUtc3dpdGNoLWJvcmRlci1jb2xvcjogIzJjYTliYztcblx0LS1mb290ZXItY29sb3I6ICNkZGRkZGQ7XG5cdC0tZm9vdGVyLWFjdGl2ZTogI2ZmZmZmZjtcblx0LS1hZGQtYnRuLWNvbG9yOiAjM2Y1MWI1O1xuXHQtLWFkZC1idG4tYmctY29sb3I6ICM5MGNhZjk7XG5cdC0tZm9ybS1oZWFkZXItY29sb3I6ICNkZGRkZGQ7XG5cdC0tZm9ybS1zY3JvbGwtYm94LWJnLWNvbG9yOiAjOWU5ZTllMjE7XG5cdC0tdG9kby1pdGVtLWJnLWNvbG9yOiAjMTkyNzM0O1xuXHQtLXRvZG8taXRlbS1ob3Zlci1jb2xvcjogIzJkM2Q0ZDtcblx0LS1iYWNrLWJ0bi1jb2xvcjogIzNmNTFiNTtcblx0LS1mb3JtLWlucHV0LWNvbG9yOiAjMTkyNzM0O1xuXHQtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcblx0LS1ub3RlLWNvbG9yOiAjZmZmZmZmO1xuXHQtLW5vdGUtaGVhZGVyOiAjOTBjYWY5O1xuXHQtLW5vdGUtb3V0LW9mLWZvY3VzOiAjZGRkZGRkO1xuXHQtLWhpZ2hsaWdodDogIzUzNjllNTtcblx0LS1yZWQ6ICNjODE0MTQ7XG5cdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XG5cdG1hcmdpbjogMDtcblx0cGFkZGluZzogMDtcblx0Zm9udC1mYW1pbHk6XG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcblx0Y29sb3I6ICNkZGRkZGQ7XG59XG5cbmRpdiNjb250ZW50IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcblx0aGVpZ2h0OiAxMDB2aDtcbn1cblxuLm5hdi1iYXIge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaWRlYmFyLWJnLWNvbG9yKTtcblx0ZGlzcGxheTogZmxleDtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogNXJlbTtcblx0cGFkZGluZzogMCAxcmVtO1xuXHRwYWRkaW5nLXRvcDogMC4yNXJlbTtcbn1cblxuLm1haW4tY29udGVudCB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRnYXA6IDFyZW07XG5cdHBhZGRpbmc6IDAgMXJlbTtcbn1cblxuLmNlbGwub3ZlcmxhcCB7XG5cdGJhY2tncm91bmQtY29sb3I6IHJlZDsgLyogQ29sb3IgaW5kaWNhdGluZyBpbnZhbGlkIHBsYWNlbWVudCBkdWUgdG8gb3ZlcmxhcCAqL1xuXHRjdXJzb3I6IG5vdC1hbGxvd2VkOyAvKiBCbG9ja2VkIGN1cnNvciAqL1xufVxuXG4uaGVhZGVyIGgxIHtcblx0dGV4dC1hbGlnbjogY2VudGVyOyAvKiBDZW50ZXIgdGhlIGhlYWRlciB0ZXh0ICovXG5cdGZvbnQtZmFtaWx5OiBcIkFyaWFsXCIsIHNhbnMtc2VyaWY7IC8qIFVzZSBhIG1vZGVybiwgY2xlYW4gZm9udCAqL1xuXHRmb250LXNpemU6IDQ4cHg7IC8qIFNldCBhIGxhcmdlIGZvbnQgc2l6ZSBmb3IgaW1wYWN0ICovXG5cdGNvbG9yOiAjZmZmZmZmODc7IC8qIFdoaXRlIGNvbG9yIGZvciB0aGUgdGV4dCBmb3IgYmV0dGVyIGNvbnRyYXN0ICovXG5cdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7IC8qIE5hdnkgYmx1ZSBiYWNrZ3JvdW5kICovXG5cdHBhZGRpbmc6IDIwcHg7IC8qIEFkZCBzb21lIHBhZGRpbmcgYXJvdW5kIHRoZSB0ZXh0ICovXG5cdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xuXHRsZXR0ZXItc3BhY2luZzogMnB4OyAvKiBJbmNyZWFzZSBzcGFjaW5nIGJldHdlZW4gbGV0dGVycyAqL1xuXHRtYXJnaW46IDBweDsgLyogQWRkIHNvbWUgc3BhY2UgYmVsb3cgdGhlIGhlYWRlciAqL1xuXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3Mztcbn1cblxuLmhlYWRlciBoMTpob3ZlciB7XG5cdGNvbG9yOiAjODQ5MTc3OyAvKiBDaGFuZ2UgdGV4dCBjb2xvciBvbiBob3ZlciAqL1xuXHRjdXJzb3I6IHBvaW50ZXI7IC8qIENoYW5nZSB0aGUgY3Vyc29yIHRvIGluZGljYXRlIGl0J3MgY2xpY2thYmxlICovXG59XG5cbi5pY29uIHtcblx0d2lkdGg6IDZyZW07XG5cdGhlaWdodDogYXV0bztcbn1cblxuLnR1cm4taW5kaWNhdG9yIHtcblx0d2lkdGg6IDYwJTtcblx0aGVpZ2h0OiAxMDAlO1xuXHRib3JkZXItcmFkaXVzOiAxcmVtO1xuXHQvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmODc7ICovXG5cdHBhZGRpbmc6IDAuNXJlbTtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRiYWNrZ3JvdW5kOiAjZmZmZmZmODc7XG5cdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxuXHRcdC00NWRlZyxcblx0XHQjY2RjYWNhODcgMCUsXG5cdFx0I2ZmZmZmZjg3IDUwJSxcblx0XHQjY2RjZGNkYTYgMTAwJVxuXHQpO1xuXHRiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChcblx0XHQtNDVkZWcsXG5cdFx0I2NkY2FjYTg3IDAlLFxuXHRcdCNmZmZmZmY4NyA1MCUsXG5cdFx0I2NkY2RjZGE2IDEwMCVcblx0KTtcblx0Ym94LXNoYWRvdzogMHB4IDRweCA4cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xufVxuLnR1cm4taW5kaWNhdG9yIHAge1xuXHRmb250LXNpemU6IDEuNXJlbTtcblx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdGNvbG9yOiAjMTkyMTFhO1xuXHRmb250LWZhbWlseTogXCJBcmlhbFwiLCBzYW5zLXNlcmlmOyAvKiBVc2UgYSBtb2Rlcm4sIGNsZWFuIGZvbnQgKi9cblx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXG5cdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXG5cdG1hcmdpbi1ib3R0b206IDMwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cblx0dGV4dC1zaGFkb3c6IDRweCAzcHggMHB4ICM2NTcxNTk3Mztcblx0bWFyZ2luOiAwO1xuXHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZS1pbi1vdXQ7XG5cdG9wYWNpdHk6IDE7IC8qIFN0YXJ0IGZ1bGx5IHZpc2libGUgKi9cbn1cblxuLnJvdGF0ZS1jb250YWluZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuI3BsYXlBZ2FpbkJ1dHRvbixcbi5yb3RhdGUtYnV0dG9uIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzUwNjA1Mjtcblx0Y29sb3I6ICNjMWMxYzFkNjtcblx0Ym9yZGVyOiAycHggc29saWQgIzkyOTM5Mjtcblx0cGFkZGluZzogMTBweCAyMHB4O1xuXHRib3JkZXItcmFkaXVzOiA1cHg7XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjdXJzb3I6IHBvaW50ZXI7XG5cdHRyYW5zaXRpb246XG5cdFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcblx0XHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcbn1cblxuI3BsYXlBZ2FpbkJ1dHRvbjpob3Zlcixcbi5yb3RhdGUtYnV0dG9uOmhvdmVyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTsgLyogQmFja2dyb3VuZCBjb2xvciBvbiBob3ZlciAqL1xuXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBUZXh0IGNvbG9yIG9uIGhvdmVyICovXG59XG5cbi5ib2FyZCB7XG5cdGRpc3BsYXk6IGdyaWQ7XG5cdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XG5cdGdhcDogMXJlbTtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG4uY2VsbC5oaWdobGlnaHQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XG59XG5cbi5jZWxsLmJsb2NrZWQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgKi9cblx0Y3Vyc29yOiBub3QtYWxsb3dlZDsgLyogQmxvY2tlZCBjdXJzb3IgKi9cbn1cblxuLmNlbGwtd2l0aC1zaGlwIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDsgLyogRXhhbXBsZSBjb2xvciwgYWRqdXN0IGFzIG5lZWRlZCAqL1xuXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7IC8qIEV4YW1wbGUgYm9yZGVyLCBhZGp1c3QgYXMgbmVlZGVkICovXG59XG5cbmRpdi5ib2FyZC1ncmlkIC5jZWxsLmNlbGwtd2l0aC1zaGlwIHtcblx0Ym9yZGVyOiAzcHggcmlkZ2UgI2E0MjUxNDsgLyogRXhhbXBsZSBib3JkZXIsIGFkanVzdCBhcyBuZWVkZWQgKi9cbn1cblxuLmJvYXJkIGgyIHtcblx0bWFyZ2luOiAwO1xufVxuXG4udHVybi1kaXYge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuZGl2LmJvYXJkLWdyaWQge1xuXHRkaXNwbGF5OiBncmlkO1xuXHRncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDIuNXZ3KSAvIHJlcGVhdCgxMCwgMi41dncpO1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdGdhcDogMnB4O1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XG59XG5cbmRpdi5ib2FyZC1ncmlkIC5jZWxsIHtcblx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XG5cdGhlaWdodDogMTAwJTtcblx0d2lkdGg6IDEwMCU7XG5cdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgMHM7XG59XG5cbi5lbmVteSxcbi5wbGF5ZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xufVxuXG4uc2hpcCB7XG5cdGJhY2tncm91bmQtY29sb3I6ICMxZTkwZmY7XG59XG5cbi5taXNzIHtcblx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDg3O1xufVxuXG5kaXYuY2VsbC5zaGlwLmhpdCB7XG5cdGJhY2tncm91bmQtY29sb3I6ICMwMGZmMWU4Nztcblx0Ym9yZGVyOiAxcHggc29saWQgIzAwZmYxZTg3O1xufVxuXG4uc3VuayB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmZjAwZWU4Nztcbn1cblxuLnBvcHVwIHtcblx0ZGlzcGxheTogbm9uZTtcblx0cG9zaXRpb246IGZpeGVkO1xuXHRsZWZ0OiA1MCU7XG5cdHRvcDogNTAlO1xuXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcblx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cdGNvbG9yOiAjZGRkZGRkO1xuXHRwYWRkaW5nOiAyMHB4O1xuXHR6LWluZGV4OiAxMDAwOyAvKiBFbnN1cmUgaXQncyBhYm92ZSBvdGhlciBjb250ZW50ICovXG59XG5cbi5wb3B1cC1jb250ZW50IHtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4ucG9wdXAtY29udGVudCBwIHtcblx0Zm9udC1zaXplOiAxcmVtO1xuXHRmb250LXdlaWdodDogOTAwO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0NBQ0MsMkJBQTJCO0NBQzNCLDZCQUE2QjtDQUM3QiwwQkFBMEI7Q0FDMUIsMkJBQTJCO0NBQzNCLDhCQUE4QjtDQUM5Qiw2QkFBNkI7Q0FDN0IsOEJBQThCO0NBQzlCLHFCQUFxQjtDQUNyQixpQ0FBaUM7Q0FDakMscUNBQXFDO0NBQ3JDLHVCQUF1QjtDQUN2Qix3QkFBd0I7Q0FDeEIsd0JBQXdCO0NBQ3hCLDJCQUEyQjtDQUMzQiw0QkFBNEI7Q0FDNUIscUNBQXFDO0NBQ3JDLDZCQUE2QjtDQUM3QixnQ0FBZ0M7Q0FDaEMseUJBQXlCO0NBQ3pCLDJCQUEyQjtDQUMzQix1QkFBdUI7Q0FDdkIscUJBQXFC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dUI7Q0FDdkIsWUFBWTtDQUNaLFdBQVc7Q0FDWCw0QkFBNEI7QUFDN0I7O0FBRUE7O0NBRUMsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qix1QkFBdUI7Q0FDdkIsbUJBQW1CO0NBQ25CLFNBQVM7QUFDVjs7QUFFQTtDQUNDLHlCQUF5QjtBQUMxQjs7QUFFQTtDQUNDLDJCQUEyQjtBQUM1Qjs7QUFFQTtDQUNDLDJCQUEyQjtDQUMzQiwyQkFBMkI7QUFDNUI7O0FBRUE7Q0FDQywyQkFBMkI7QUFDNUI7O0FBRUE7Q0FDQyxhQUFhO0NBQ2IsZUFBZTtDQUNmLFNBQVM7Q0FDVCxRQUFRO0NBQ1IsZ0NBQWdDO0NBQ2hDLDZCQUE2QjtDQUM3QixjQUFjO0NBQ2QsYUFBYTtDQUNiLGFBQWEsRUFBRSxvQ0FBb0M7QUFDcEQ7O0FBRUE7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7Q0FDQyxlQUFlO0NBQ2YsZ0JBQWdCO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHkge1xcblxcdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcXG5cXHQtLWNvbnRlbnQtdGV4dC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLXRpdGxlLWJveC1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWl0ZW0tZm9jdXMtY29sb3I6ICMxZjI5Mzc7XFxuXFx0LS1zZWFyY2gtYm94LWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tc2VhcmNoLWlucHV0LWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tc2VhcmNoLWJ0bi1iZy1jb2xvcjogIzMxM2U0YjtcXG5cXHQtLWxvZ28tY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS10b2dnbGUtc3dpdGNoLWJnLWNvbG9yOiAjNmI3NTdlO1xcblxcdC0tdG9nZ2xlLXN3aXRjaC1ib3JkZXItY29sb3I6ICMyY2E5YmM7XFxuXFx0LS1mb290ZXItY29sb3I6ICNkZGRkZGQ7XFxuXFx0LS1mb290ZXItYWN0aXZlOiAjZmZmZmZmO1xcblxcdC0tYWRkLWJ0bi1jb2xvcjogIzNmNTFiNTtcXG5cXHQtLWFkZC1idG4tYmctY29sb3I6ICM5MGNhZjk7XFxuXFx0LS1mb3JtLWhlYWRlci1jb2xvcjogI2RkZGRkZDtcXG5cXHQtLWZvcm0tc2Nyb2xsLWJveC1iZy1jb2xvcjogIzllOWU5ZTIxO1xcblxcdC0tdG9kby1pdGVtLWJnLWNvbG9yOiAjMTkyNzM0O1xcblxcdC0tdG9kby1pdGVtLWhvdmVyLWNvbG9yOiAjMmQzZDRkO1xcblxcdC0tYmFjay1idG4tY29sb3I6ICMzZjUxYjU7XFxuXFx0LS1mb3JtLWlucHV0LWNvbG9yOiAjMTkyNzM0O1xcblxcdC0taGVhZGVyLWNvbG9yOiAjZGRkZGRkO1xcblxcdC0tbm90ZS1jb2xvcjogI2ZmZmZmZjtcXG5cXHQtLW5vdGUtaGVhZGVyOiAjOTBjYWY5O1xcblxcdC0tbm90ZS1vdXQtb2YtZm9jdXM6ICNkZGRkZGQ7XFxuXFx0LS1oaWdobGlnaHQ6ICM1MzY5ZTU7XFxuXFx0LS1yZWQ6ICNjODE0MTQ7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcbn1cXG5cXG5kaXYjY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG5cXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcXG5cXHRoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4ubmF2LWJhciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogNXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxuXFx0cGFkZGluZy10b3A6IDAuMjVyZW07XFxufVxcblxcbi5tYWluLWNvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0cGFkZGluZzogMCAxcmVtO1xcbn1cXG5cXG4uY2VsbC5vdmVybGFwIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgZHVlIHRvIG92ZXJsYXAgKi9cXG5cXHRjdXJzb3I6IG5vdC1hbGxvd2VkOyAvKiBCbG9ja2VkIGN1cnNvciAqL1xcbn1cXG5cXG4uaGVhZGVyIGgxIHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7IC8qIENlbnRlciB0aGUgaGVhZGVyIHRleHQgKi9cXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0Zm9udC1zaXplOiA0OHB4OyAvKiBTZXQgYSBsYXJnZSBmb250IHNpemUgZm9yIGltcGFjdCAqL1xcblxcdGNvbG9yOiAjZmZmZmZmODc7IC8qIFdoaXRlIGNvbG9yIGZvciB0aGUgdGV4dCBmb3IgYmV0dGVyIGNvbnRyYXN0ICovXFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTsgLyogTmF2eSBibHVlIGJhY2tncm91bmQgKi9cXG5cXHRwYWRkaW5nOiAyMHB4OyAvKiBBZGQgc29tZSBwYWRkaW5nIGFyb3VuZCB0aGUgdGV4dCAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7IC8qIEluY3JlYXNlIHNwYWNpbmcgYmV0d2VlbiBsZXR0ZXJzICovXFxuXFx0bWFyZ2luOiAwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cXG5cXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3MztcXG59XFxuXFxuLmhlYWRlciBoMTpob3ZlciB7XFxuXFx0Y29sb3I6ICM4NDkxNzc7IC8qIENoYW5nZSB0ZXh0IGNvbG9yIG9uIGhvdmVyICovXFxuXFx0Y3Vyc29yOiBwb2ludGVyOyAvKiBDaGFuZ2UgdGhlIGN1cnNvciB0byBpbmRpY2F0ZSBpdCdzIGNsaWNrYWJsZSAqL1xcbn1cXG5cXG4uaWNvbiB7XFxuXFx0d2lkdGg6IDZyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4udHVybi1pbmRpY2F0b3Ige1xcblxcdHdpZHRoOiA2MCU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdGJvcmRlci1yYWRpdXM6IDFyZW07XFxuXFx0LyogYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjg3OyAqL1xcblxcdHBhZGRpbmc6IDAuNXJlbTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xcblxcdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxcblxcdFxcdC00NWRlZyxcXG5cXHRcXHQjY2RjYWNhODcgMCUsXFxuXFx0XFx0I2ZmZmZmZjg3IDUwJSxcXG5cXHRcXHQjY2RjZGNkYTYgMTAwJVxcblxcdCk7XFxuXFx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxufVxcbi50dXJuLWluZGljYXRvciBwIHtcXG5cXHRmb250LXNpemU6IDEuNXJlbTtcXG5cXHRmb250LXdlaWdodDogYm9sZDtcXG5cXHRjb2xvcjogIzE5MjExYTtcXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cXG5cXHRtYXJnaW4tYm90dG9tOiAzMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXFxuXFx0dGV4dC1zaGFkb3c6IDRweCAzcHggMHB4ICM2NTcxNTk3MztcXG5cXHRtYXJnaW46IDA7XFxuXFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0O1xcblxcdG9wYWNpdHk6IDE7IC8qIFN0YXJ0IGZ1bGx5IHZpc2libGUgKi9cXG59XFxuXFxuLnJvdGF0ZS1jb250YWluZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4jcGxheUFnYWluQnV0dG9uLFxcbi5yb3RhdGUtYnV0dG9uIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjNTA2MDUyO1xcblxcdGNvbG9yOiAjYzFjMWMxZDY7XFxuXFx0Ym9yZGVyOiAycHggc29saWQgIzkyOTM5MjtcXG5cXHRwYWRkaW5nOiAxMHB4IDIwcHg7XFxuXFx0Ym9yZGVyLXJhZGl1czogNXB4O1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkO1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG5cXHR0cmFuc2l0aW9uOlxcblxcdFxcdHRyYW5zZm9ybSAwLjNzIGVhc2UsXFxuXFx0XFx0YmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XFxufVxcblxcbiNwbGF5QWdhaW5CdXR0b246aG92ZXIsXFxuLnJvdGF0ZS1idXR0b246aG92ZXIge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMyYzcyMzU7IC8qIEJhY2tncm91bmQgY29sb3Igb24gaG92ZXIgKi9cXG5cXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBUZXh0IGNvbG9yIG9uIGhvdmVyICovXFxufVxcblxcbi5ib2FyZCB7XFxuXFx0ZGlzcGxheTogZ3JpZDtcXG5cXHRncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xcblxcdGdhcDogMXJlbTtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5jZWxsLmhpZ2hsaWdodCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xcbn1cXG5cXG4uY2VsbC5ibG9ja2VkIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgKi9cXG5cXHRjdXJzb3I6IG5vdC1hbGxvd2VkOyAvKiBCbG9ja2VkIGN1cnNvciAqL1xcbn1cXG5cXG4uY2VsbC13aXRoLXNoaXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7IC8qIEV4YW1wbGUgY29sb3IsIGFkanVzdCBhcyBuZWVkZWQgKi9cXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7IC8qIEV4YW1wbGUgYm9yZGVyLCBhZGp1c3QgYXMgbmVlZGVkICovXFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIC5jZWxsLmNlbGwtd2l0aC1zaGlwIHtcXG5cXHRib3JkZXI6IDNweCByaWRnZSAjYTQyNTE0OyAvKiBFeGFtcGxlIGJvcmRlciwgYWRqdXN0IGFzIG5lZWRlZCAqL1xcbn1cXG5cXG4uYm9hcmQgaDIge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLnR1cm4tZGl2IHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuZGl2LmJvYXJkLWdyaWQge1xcblxcdGRpc3BsYXk6IGdyaWQ7XFxuXFx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjV2dykgLyByZXBlYXQoMTAsIDIuNXZ3KTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0Z2FwOiAycHg7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24tY29udGVudDogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdHdpZHRoOiAxMDAlO1xcblxcdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgMHM7XFxufVxcblxcbi5lbmVteSxcXG4ucGxheWVyIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxufVxcblxcbi5zaGlwIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xcbn1cXG5cXG4ubWlzcyB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDg3O1xcbn1cXG5cXG5kaXYuY2VsbC5zaGlwLmhpdCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICMwMGZmMWU4NztcXG59XFxuXFxuLnN1bmsge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICNmZjAwZWU4NztcXG59XFxuXFxuLnBvcHVwIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcblxcdHBvc2l0aW9uOiBmaXhlZDtcXG5cXHRsZWZ0OiA1MCU7XFxuXFx0dG9wOiA1MCU7XFxuXFx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXFx0Y29sb3I6ICNkZGRkZGQ7XFxuXFx0cGFkZGluZzogMjBweDtcXG5cXHR6LWluZGV4OiAxMDAwOyAvKiBFbnN1cmUgaXQncyBhYm92ZSBvdGhlciBjb250ZW50ICovXFxufVxcblxcbi5wb3B1cC1jb250ZW50IHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5wb3B1cC1jb250ZW50IHAge1xcblxcdGZvbnQtc2l6ZTogMXJlbTtcXG5cXHRmb250LXdlaWdodDogOTAwO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG5cdG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuXHRmb250LXNpemU6IDJlbTtcblx0bWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuXHRoZWlnaHQ6IDA7IC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG5cdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG5cdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcblx0Zm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuXHRmb250LXNpemU6IDc1JTtcblx0bGluZS1oZWlnaHQ6IDA7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuXHRib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG5cdHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cblx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cblx0bWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcblx0LyogMSAqL1xuXHRvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuXHQvKiAxICovXG5cdHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xuXHRwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG5cdG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuXHRwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMyAqL1xuXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG5cdG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG5cdG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuXHRmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG5cdGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuXHRkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Q0FDQyxpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDdkM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLFNBQVM7QUFDVjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxjQUFjO0NBQ2QsZ0JBQWdCO0FBQ2pCOztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0NBQ0MsdUJBQXVCLEVBQUUsTUFBTTtDQUMvQixTQUFTLEVBQUUsTUFBTTtDQUNqQixpQkFBaUIsRUFBRSxNQUFNO0FBQzFCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLGlDQUFpQyxFQUFFLE1BQU07Q0FDekMsY0FBYyxFQUFFLE1BQU07QUFDdkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLDZCQUE2QjtBQUM5Qjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxtQkFBbUIsRUFBRSxNQUFNO0NBQzNCLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsaUNBQWlDLEVBQUUsTUFBTTtBQUMxQzs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxtQkFBbUI7QUFDcEI7O0FBRUE7OztFQUdFOztBQUVGOzs7Q0FHQyxpQ0FBaUMsRUFBRSxNQUFNO0NBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxjQUFjO0NBQ2QsY0FBYztDQUNkLGtCQUFrQjtDQUNsQix3QkFBd0I7QUFDekI7O0FBRUE7Q0FDQyxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MsV0FBVztBQUNaOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0NBS0Msb0JBQW9CLEVBQUUsTUFBTTtDQUM1QixlQUFlLEVBQUUsTUFBTTtDQUN2QixpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04saUJBQWlCO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04sb0JBQW9CO0FBQ3JCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsMEJBQTBCO0FBQzNCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsa0JBQWtCO0NBQ2xCLFVBQVU7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLDhCQUE4QjtBQUMvQjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLDhCQUE4QjtBQUMvQjs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtDQUNDLHNCQUFzQixFQUFFLE1BQU07Q0FDOUIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsVUFBVSxFQUFFLE1BQU07Q0FDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsc0JBQXNCLEVBQUUsTUFBTTtDQUM5QixVQUFVLEVBQUUsTUFBTTtBQUNuQjs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxZQUFZO0FBQ2I7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsNkJBQTZCLEVBQUUsTUFBTTtDQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0FBQzdCOztBQUVBOztFQUVFOztBQUVGO0NBQ0Msd0JBQXdCO0FBQ3pCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsYUFBYSxFQUFFLE1BQU07QUFDdEI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGtCQUFrQjtBQUNuQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcblxcdGZvbnQtc2l6ZTogMmVtO1xcblxcdG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcblxcdGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuXFx0aGVpZ2h0OiAwOyAvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcblxcdGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHtcXG5cXHQvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHtcXG5cXHQvKiAxICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuXFx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG5cXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcblxcdG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcblxcdHBhZGRpbmc6IDA7IC8qIDMgKi9cXG5cXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcblxcdG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG5cXHRoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuXFx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG5cXHRkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBwbGF5R2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgcGFnZSBmcm9tIFwiLi9nYW1lVUlcIjtcbmltcG9ydCBcIi4vY3NzL25vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBcIi4vY3NzL2dhbWUuY3NzXCI7XG5cbmltcG9ydCB7IGhpZGVQb3B1cCB9IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5wYWdlKCk7XG5wbGF5R2FtZSgpO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlBZ2FpbkJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQvLyBDb2RlIHRvIHJlc2V0IHRoZSBnYW1lIGFuZCBzdGFydCBhZ2FpblxuXHRoaWRlUG9wdXAoKTtcblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKTtcblx0Y29udGVudC5pbm5lckhUTUwgPSBcIlwiO1xuXHRwYWdlKCk7XG5cdHBsYXlHYW1lKCk7XG59KTtcblxuLy8gaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcbi8vIGltcG9ydCBjcmVhdGVTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuLy8gbGV0IGJvYXJkO1xuLy8gbGV0IHNoaXA7XG5cbi8vIGJvYXJkID0gZ2FtZUJvYXJkKCk7XG4vLyBzaGlwID0gY3JlYXRlU2hpcCgzKTtcblxuLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuLy8gLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDMsIGZhbHNlKTtcbi8vIGNvbnNvbGUubG9nKGB2ZXJ0aWNhbGApO1xuLy8gYm9hcmQucGxhY2VTaGlwKHNoaXAsIDAsIDAsIHRydWUpO1xuLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAxKTtcbi8vIGJvYXJkLnJlY2VpdmVBdHRhY2soMCwgMik7XG4vLyBib2FyZC5yZWNlaXZlQXR0YWNrKDAsIDMpO1xuLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuXG4vLyAvLyBib2FyZC5wbGFjZVNoaXAoc2hpcCwgMCwgMCwgZmFsc2UpO1xuLy8gLy8gY29uc29sZS5sb2coYm9hcmQuYm9hcmQpO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygwLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygxLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuLy8gLy8gYm9hcmQucmVjZWl2ZUF0dGFjaygyLCAwKTtcbi8vIC8vIGNvbnNvbGUubG9nKHNoaXApO1xuIl0sIm5hbWVzIjpbImdhbWVCb2FyZCIsImNyZWF0ZVNoaXAiLCJjb21wdXRlciIsImNvbXBCb2FyZCIsImxhc3RIaXQiLCJ0YXJnZXRNb2RlIiwiYXR0YWNrT3B0aW9ucyIsImlzVHVybiIsInJhbmRvbUF0dGFjayIsImVuZW15IiwieCIsInkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJoaXRCb2FyZCIsInVuZGVmaW5lZCIsInBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5Iiwic2hpcHMiLCJmb3JFYWNoIiwibGVuZ3RoIiwidmVydGljYWwiLCJzaGlwIiwiY2FuUGxhY2VTaGlwIiwicGxhY2VTaGlwIiwidGFyZ2V0QXR0YWNrIiwiZGlyZWN0aW9ucyIsImRpciIsIm5ld1giLCJuZXdZIiwicHVzaCIsInNoaWZ0IiwiY2hvb3NlQXR0YWNrIiwiYXR0YWNrIiwicGxheWVyIiwiX2Nob29zZUF0dGFjayIsImNvbnNvbGUiLCJsb2ciLCJjb25jYXQiLCJhdHRhY2tSZXN1bHQiLCJyZWNlaXZlQXR0YWNrIiwiaGFzTG9zdCIsImFsbFNoaXBzU3VuayIsInZhbHVlIiwiZHJhd0JvYXJkIiwidXBkYXRlQm9hcmQiLCJ1cGRhdGVUdXJuIiwibG9hZEdhbWUiLCJ3aW5uZXIiLCJzaG93UG9wdXAiLCJnYW1lVGltZSIsInVzZXJQYXJhbSIsImNvbXBQYXJhbSIsImdhbWVBY3RpdmVQYXJhbSIsInVzZXIiLCJjb21wIiwiZ2FtZUFjdGl2ZSIsInBsYXllckJvYXJkIiwiYm9hcmQiLCJjZWxscyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNlbGwiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZGF0YXNldCIsInhJbnQiLCJwYXJzZUludCIsInlJbnQiLCJyZXN1bHQiLCJzZXRUaW1lb3V0IiwiX2NvbXAkYXR0YWNrIiwiY29tcFgiLCJjb21wWSIsImNvbXBSZXN1bHQiLCJwbGF5R2FtZSIsImdyaWRDZWxscyIsInJvdGF0ZUJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJzZWxlY3RlZFNoaXBTaXplIiwiaXNIb3Jpem9udGFsIiwiaXNBZGphY2VudEJsb2NrZWQiLCJzdGFydFgiLCJzdGFydFkiLCJzaGlwU2l6ZSIsImkiLCJhZGpYIiwiYWRqWSIsIm5laWdoYm9yWCIsIm5laWdoYm9yWSIsImhhc1NoaXBBdCIsImhpZ2hsaWdodENlbGxzIiwiaXNPdmVybGFwT3JBZGphY2VudCIsImFkZCIsInJlbW92ZUhpZ2hsaWdodCIsInJlbW92ZSIsImNlbGxYIiwiY2VsbFkiLCJzaGlwQ2VsbCIsImVycm9yIiwiQXJyYXkiLCJmcm9tIiwidmFsaWRhdGVDb29yZGluYXRlcyIsIkVycm9yIiwiaXNWZXJ0aWNhbCIsIm1heFgiLCJtYXhZIiwiY2hlY2tYIiwiY2hlY2tZIiwicGxhY2VYIiwicGxhY2VZIiwiaGl0Iiwic3VuayIsImV2ZXJ5Iiwicm93IiwiX3R5cGVvZiIsInNvbGRpZXIiLCJoZWFkZXIiLCJiYXIiLCJjcmVhdGVFbGVtZW50IiwibGVmdEljb24iLCJzcmMiLCJhbHQiLCJ0aXRsZUJveCIsInRpdGxlIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInJpZ2h0SWNvbiIsIm1haW5Db250ZW50IiwibWFpbiIsInR1cm4iLCJ0dXJuRGl2IiwidHVybkluZGljYXRvciIsInR1cm5UZXh0IiwiY3JlYXRlQm9hcmQiLCJib2FyZFRpdGxlIiwiYm9hcmRHcmlkIiwiZW5lbXlCb2FyZCIsInJldHVybkJvYXJkR3JpZCIsImlzRW5lbXkiLCJhcmd1bWVudHMiLCJpbm5lckhUTUwiLCJqIiwibmFtZSIsIm1pc3MiLCJjaGlsZHJlbiIsInN0YXJ0UGFnZSIsInJvdGF0ZUNvbnRhaW5lciIsImhpZGVQb3B1cCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwicGFnZSIsImNvbCIsIm51bUhpdHMiLCJjb250ZW50Il0sInNvdXJjZVJvb3QiOiIifQ==