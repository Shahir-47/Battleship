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
    if (lastHit === null) {
      return randomAttack(enemy);
    }
    return targetAttack(enemy);
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
/* harmony import */ var _img_git_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./img/git.svg */ "./src/img/git.svg");


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

// Create the footer
var createFooter = function createFooter() {
  var footer = document.createElement("footer");
  footer.classList.add("footer");
  var gitHubProfile = document.createElement("a");
  gitHubProfile.href = "https://github.com/Shahir-47";
  var gitHubProfileImg = document.createElement("img");
  gitHubProfileImg.src = _img_git_svg__WEBPACK_IMPORTED_MODULE_1__;
  gitHubProfileImg.alt = "gitHub Logo";
  var gitHubProfileText = document.createElement("p");
  var atSymbol = document.createElement("span");
  atSymbol.classList.add("at-symbol");
  atSymbol.textContent = "@";
  var username = document.createElement("span");
  username.textContent = "Shahir-47";
  gitHubProfileText.appendChild(atSymbol);
  gitHubProfileText.appendChild(username);
  gitHubProfile.appendChild(gitHubProfileImg);
  gitHubProfile.appendChild(gitHubProfileText);
  var seperator = document.createElement("p");
  seperator.textContent = "|";
  var gitHubRepo = document.createElement("a");
  gitHubRepo.href = "https://github.com/Shahir-47/Battleship";
  gitHubRepo.textContent = "Source Code";
  footer.appendChild(gitHubProfile);
  footer.appendChild(seperator);
  footer.appendChild(gitHubRepo);
  document.querySelector("div#content").appendChild(footer);
};
function page() {
  header();
  mainContent();
  startPage();
  createFooter();
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
	justify-content: space-evenly;
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
	font-size: 39px; /* Set a large font size for impact */
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
	width: 4rem;
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
	grid-template: repeat(10, 2.3vw) / repeat(10, 2.3vw);
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

/* --------------------------------------- Footer ------------------------------------------------------- */

footer {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	width: 100%;
	height: 2.5rem;
	padding: 1rem 0;
	padding-bottom: 0.5rem;
}

footer a {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-decoration: none;
	font-size: 1.3rem;
	font-weight: 100;
	color: #969292;
	font-family:
		jedi solid,
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
}

footer p {
	margin: 0.5rem 0;
}

footer a:hover,
footer a:active {
	color: #fff;
}

footer a:hover img,
footer a:active img {
	filter: brightness(99);
}

.at-symbol {
	font-weight: 900;
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
}

footer img {
	width: 2rem;
	height: auto;
}
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"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","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-evenly;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.cell.overlap {\n\tbackground-color: red; /* Color indicating invalid placement due to overlap */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.header h1 {\n\ttext-align: center; /* Center the header text */\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\tfont-size: 39px; /* Set a large font size for impact */\n\tcolor: #ffffff87; /* White color for the text for better contrast */\n\tbackground-color: #19211a; /* Navy blue background */\n\tpadding: 20px; /* Add some padding around the text */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin: 0px; /* Add some space below the header */\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177; /* Change text color on hover */\n\tcursor: pointer; /* Change the cursor to indicate it's clickable */\n}\n\n.icon {\n\twidth: 4rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\t/* background-color: #ffffff87; */\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif; /* Use a modern, clean font */\n\ttext-transform: uppercase; /* Make all letters uppercase for more impact */\n\tletter-spacing: 2px; /* Increase spacing between letters */\n\tmargin-bottom: 30px; /* Add some space below the header */\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1; /* Start fully visible */\n}\n\n.rotate-container {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n#playAgainButton,\n.rotate-button {\n\tbackground-color: #506052;\n\tcolor: #c1c1c1d6;\n\tborder: 2px solid #929392;\n\tpadding: 10px 20px;\n\tborder-radius: 5px;\n\tfont-weight: bold;\n\tcursor: pointer;\n\ttransition:\n\t\ttransform 0.3s ease,\n\t\tbackground-color 0.3s ease;\n}\n\n#playAgainButton:hover,\n.rotate-button:hover {\n\tbackground-color: #2c7235; /* Background color on hover */\n\tcolor: #ffffff87; /* Text color on hover */\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.cell.highlight {\n\tbackground-color: lightblue;\n}\n\n.cell.blocked {\n\tbackground-color: red; /* Color indicating invalid placement */\n\tcursor: not-allowed; /* Blocked cursor */\n}\n\n.cell-with-ship {\n\tbackground-color: #4caf50; /* Example color, adjust as needed */\n\tborder: 1px solid #ffffff87; /* Example border, adjust as needed */\n}\n\ndiv.board-grid .cell.cell-with-ship {\n\tborder: 3px ridge #a42514; /* Example border, adjust as needed */\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.3vw) / repeat(10, 2.3vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: #1e90ff;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\ndiv.cell.hit {\n\tbackground-color: #00ff1e87;\n\tborder: 1px solid #00ff1e87;\n}\n\n.sunk {\n\tbackground-color: #ff00ee87;\n}\n\n.popup {\n\tdisplay: none;\n\tposition: fixed;\n\tleft: 50%;\n\ttop: 50%;\n\ttransform: translate(-50%, -50%);\n\tbackground-color: transparent;\n\tcolor: #dddddd;\n\tpadding: 20px;\n\tz-index: 1000; /* Ensure it's above other content */\n}\n\n.popup-content {\n\ttext-align: center;\n}\n\n.popup-content p {\n\tfont-size: 1rem;\n\tfont-weight: 900;\n}\n\n/* --------------------------------------- Footer ------------------------------------------------------- */\n\nfooter {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n\twidth: 100%;\n\theight: 2.5rem;\n\tpadding: 1rem 0;\n\tpadding-bottom: 0.5rem;\n}\n\nfooter a {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 0.5rem;\n\ttext-decoration: none;\n\tfont-size: 1.3rem;\n\tfont-weight: 100;\n\tcolor: #969292;\n\tfont-family:\n\t\tjedi solid,\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n}\n\nfooter p {\n\tmargin: 0.5rem 0;\n}\n\nfooter a:hover,\nfooter a:active {\n\tcolor: #fff;\n}\n\nfooter a:hover img,\nfooter a:active img {\n\tfilter: brightness(99);\n}\n\n.at-symbol {\n\tfont-weight: 900;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n}\n\nfooter img {\n\twidth: 2rem;\n\theight: auto;\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/img/git.svg":
/*!*************************!*\
  !*** ./src/img/git.svg ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "assets/img/git.svg";

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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFVBQVUsZUFBZSxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyx3QkFBd0IseUJBQXlCLE9BQU8sS0FBSyx3QkFBd0IseUJBQXlCLHVCQUF1Qix5QkFBeUIseUJBQXlCLHVCQUF1Qix5QkFBeUIseUJBQXlCLHVCQUF1QixhQUFhLE9BQU8sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsVUFBVSxLQUFLLFNBQVMsS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyx3QkFBd0IseUJBQXlCLHlCQUF5Qix5QkFBeUIsYUFBYSxXQUFXLFlBQVksdUJBQXVCLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLE1BQU0sT0FBTyxPQUFPLE1BQU0sd0JBQXdCLHlCQUF5QixPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssd0JBQXdCLHlCQUF5QixPQUFPLEtBQUssd0JBQXdCLHlCQUF5QixPQUFPLEtBQUssd0JBQXdCLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFV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LEtBQUssVUFBVSxNQUFNLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFFBQVEsUUFBUSxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQix1QkFBdUIsT0FBTyxPQUFPLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLE9BQU8sS0FBSyxRQUFRLE9BQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxPQUFPLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLHVCQUF1QixPQUFPLE1BQU0sTUFBTSxNQUFNLFlBQVksT0FBTyxPQUFPLE1BQU0sT0FBTyxzQkFBc0IscUJBQXFCLE9BQU8sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sTUFBTSxNQUFNLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sU0FBUyxzQkFBc0IscUJBQXFCLHVCQUF1QixxQkFBcUIsT0FBTyxPQUFPLE1BQU0sTUFBTSxVQUFVLFlBQVksT0FBTyxPQUFPLE1BQU0sTUFBTSxVQUFVLFlBQVksT0FBTyxNQUFNLE1BQU0sUUFBUSxZQUFZLE9BQU8sTUFBTSxNQUFNLFFBQVEsWUFBWSxXQUFXLE1BQU0sTUFBTSxNQUFNLFFBQVEsWUFBWSxPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxTQUFTLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLHFCQUFxQixxQkFBcUIscUJBQXFCLHVCQUF1QixPQUFPLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxNQUFNLE1BQU0sc0JBQXNCLHFCQUFxQixPQUFPLE1BQU0sTUFBTSxNQUFNLFVBQVUsTUFBTSxPQUFPLE1BQU0sS0FBSyxzQkFBc0IsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQixxQkFB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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NsQkE7Ozs7Ozs7Ozs7Ozs7OztBQ0E4QjtBQUNGO0FBQ0M7QUFDTDtBQUVhO0FBRXJDcUssbURBQUksQ0FBQyxDQUFDO0FBQ054RixpREFBUSxDQUFDLENBQUM7QUFFVmxCLFFBQVEsQ0FBQzZGLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDMUYsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07RUFDMUU7RUFDQXlGLGtEQUFTLENBQUMsQ0FBQztFQUNYLElBQU1pQixPQUFPLEdBQUc3RyxRQUFRLENBQUNxQixhQUFhLENBQUMsYUFBYSxDQUFDO0VBQ3JEd0YsT0FBTyxDQUFDeEIsU0FBUyxHQUFHLEVBQUU7RUFDdEJxQixtREFBSSxDQUFDLENBQUM7RUFDTnhGLGlEQUFRLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lVUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3NzL2dhbWUuY3NzP2EzY2YiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcz82ZDU0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBjb21wdXRlcigpIHtcblx0Y29uc3QgY29tcEJvYXJkID0gZ2FtZUJvYXJkKCk7XG5cdGxldCBsYXN0SGl0ID0gbnVsbDtcblx0bGV0IHRhcmdldE1vZGUgPSBmYWxzZTtcblx0bGV0IGF0dGFja09wdGlvbnMgPSBbXTsgLy8gU3RvcmVzIHBvdGVudGlhbCBjZWxscyB0byBhdHRhY2sgaW4gdGFyZ2V0IG1vZGVcblx0bGV0IGlzVHVybiA9IGZhbHNlO1xuXG5cdGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuXHRcdGxldCB4O1xuXHRcdGxldCB5O1xuXHRcdGRvIHtcblx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHR5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXHRcdH0gd2hpbGUgKGVuZW15LmhpdEJvYXJkW3ldW3hdICE9PSB1bmRlZmluZWQpO1xuXHRcdHJldHVybiB7IHgsIHkgfTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5KCkge1xuXHRcdGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdO1xuXHRcdHNoaXBzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuXHRcdFx0bGV0IHg7XG5cdFx0XHRsZXQgeTtcblx0XHRcdGxldCB2ZXJ0aWNhbDtcblx0XHRcdGNvbnN0IHNoaXAgPSBjcmVhdGVTaGlwKGxlbmd0aCk7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0XHRcdHZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcblx0XHRcdH0gd2hpbGUgKCFjb21wQm9hcmQuY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKSk7XG5cdFx0XHRjb21wQm9hcmQucGxhY2VTaGlwKHNoaXAsIHgsIHksIHZlcnRpY2FsKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRhcmdldEF0dGFjayhlbmVteSkge1xuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9ucyA9IFtcblx0XHRcdFx0WzEsIDBdLFxuXHRcdFx0XHRbLTEsIDBdLFxuXHRcdFx0XHRbMCwgMV0sXG5cdFx0XHRcdFswLCAtMV0sXG5cdFx0XHRdO1xuXHRcdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKChkaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgbmV3WCA9IGxhc3RIaXQueCArIGRpclswXTtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IGxhc3RIaXQueSArIGRpclsxXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPCAxMCAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPCAxMCAmJlxuXHRcdFx0XHRcdGVuZW15LmhpdEJvYXJkW25ld1ldW25ld1hdID09PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXR0YWNrT3B0aW9ucy5wdXNoKHsgeDogbmV3WCwgeTogbmV3WSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGF0dGFja09wdGlvbnMuc2hpZnQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNob29zZUF0dGFjayhlbmVteSkge1xuXHRcdGlmIChsYXN0SGl0ID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gcmFuZG9tQXR0YWNrKGVuZW15KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldEF0dGFjayhlbmVteSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2socGxheWVyKSB7XG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBjaG9vc2VBdHRhY2socGxheWVyKTtcblx0XHRjb25zb2xlLmxvZyhgeDogJHt4fSwgeTogJHt5fWApO1xuXHRcdGNvbnN0IGF0dGFja1Jlc3VsdCA9IHBsYXllci5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHRcdGNvbnNvbGUubG9nKGBjb21wdXRlciBhdHRhY2tSZXN1bHQ6ICR7YXR0YWNrUmVzdWx0fWApO1xuXHRcdGlmIChhdHRhY2tSZXN1bHQgPT09IFwiaGl0XCIpIHtcblx0XHRcdGxhc3RIaXQgPSB7IHgsIHkgfTtcblx0XHRcdHRhcmdldE1vZGUgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcIm1pc3NcIiAmJiBsYXN0SGl0ICYmIHRhcmdldE1vZGUpIHtcblx0XHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7IC8vIFN3aXRjaCBiYWNrIHRvIHJhbmRvbSBtb2RlIGlmIG5vIG9wdGlvbnMgbGVmdFxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoYXR0YWNrUmVzdWx0ID09PSBcInN1bmtcIikge1xuXHRcdFx0bGFzdEhpdCA9IG51bGw7XG5cdFx0XHR0YXJnZXRNb2RlID0gZmFsc2U7XG5cdFx0XHRhdHRhY2tPcHRpb25zID0gW107IC8vIENsZWFyIGF0dGFjayBvcHRpb25zXG5cdFx0fVxuXHRcdHJldHVybiB7IHgsIHksIGF0dGFja1Jlc3VsdCB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG5cdFx0cmV0dXJuIGNvbXBCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRwbGFjZVNoaXBzQXV0b21hdGljYWxseSxcblx0XHRhdHRhY2ssXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGNob29zZUF0dGFjayxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IGNvbXBCb2FyZCgpIHtcblx0XHRcdHJldHVybiBjb21wQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgdGFyZ2V0TW9kZSgpIHtcblx0XHRcdHJldHVybiB0YXJnZXRNb2RlO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBjb21wdXRlciBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHtcblx0ZHJhd0JvYXJkLFxuXHR1cGRhdGVCb2FyZCxcblx0dXBkYXRlVHVybixcblx0bG9hZEdhbWUsXG5cdHdpbm5lcixcblx0c2hvd1BvcHVwLFxufSBmcm9tIFwiLi9nYW1lVUlcIjtcblxuZnVuY3Rpb24gZ2FtZVRpbWUodXNlclBhcmFtLCBjb21wUGFyYW0sIGdhbWVBY3RpdmVQYXJhbSkge1xuXHRjb25zdCB1c2VyID0gdXNlclBhcmFtO1xuXHRjb25zdCBjb21wID0gY29tcFBhcmFtO1xuXHRsZXQgZ2FtZUFjdGl2ZSA9IGdhbWVBY3RpdmVQYXJhbTtcblxuXHRjb25zb2xlLmxvZyhcInVzZXIgYm9hcmQ6XCIpO1xuXHRjb25zb2xlLmxvZyh1c2VyLnBsYXllckJvYXJkLmJvYXJkKTtcblxuXHRjb21wLnBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5KCk7XG5cblx0Y29uc29sZS5sb2coXCJjb21wIGJvYXJkOlwiKTtcblx0Y29uc29sZS5sb2coY29tcC5jb21wQm9hcmQuYm9hcmQpO1xuXG5cdGRyYXdCb2FyZCh1c2VyLnBsYXllckJvYXJkLmJvYXJkKTtcblx0ZHJhd0JvYXJkKGNvbXAuY29tcEJvYXJkLmJvYXJkLCB0cnVlKTtcblxuXHR1c2VyLmlzVHVybiA9IHRydWU7XG5cdGNvbXAuaXNUdXJuID0gZmFsc2U7XG5cblx0Y29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVuZW15IC5jZWxsXCIpO1xuXHRjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcblx0XHRcdGlmICghZ2FtZUFjdGl2ZSB8fCAhdXNlci5pc1R1cm4pIHJldHVybjtcblx0XHRcdGlmIChcblx0XHRcdFx0ZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpIHx8XG5cdFx0XHRcdGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIilcblx0XHRcdClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0Y29uc3QgeyB4IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuXHRcdFx0Y29uc3QgeyB5IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuXHRcdFx0Y29uc3QgeEludCA9IHBhcnNlSW50KHgsIDEwKTtcblx0XHRcdGNvbnN0IHlJbnQgPSBwYXJzZUludCh5LCAxMCk7XG5cblx0XHRcdGNvbnN0IHJlc3VsdCA9IHVzZXIuYXR0YWNrKHhJbnQsIHlJbnQsIGNvbXApO1xuXHRcdFx0dXBkYXRlQm9hcmQoeEludCwgeUludCwgcmVzdWx0LCB0cnVlKTtcblxuXHRcdFx0aWYgKGNvbXAuaGFzTG9zdCgpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiY29tcCBoYXMgbG9zdFwiKTtcblx0XHRcdFx0Z2FtZUFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR3aW5uZXIoXCJ1c2VyXCIpO1xuXHRcdFx0XHRzaG93UG9wdXAoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1c2VyLmlzVHVybiA9IGZhbHNlO1xuXHRcdFx0Y29tcC5pc1R1cm4gPSB0cnVlO1xuXHRcdFx0dXBkYXRlVHVybih1c2VyLmlzVHVybik7XG5cblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRjb25zdCB7XG5cdFx0XHRcdFx0eDogY29tcFgsXG5cdFx0XHRcdFx0eTogY29tcFksXG5cdFx0XHRcdFx0YXR0YWNrUmVzdWx0OiBjb21wUmVzdWx0LFxuXHRcdFx0XHR9ID0gY29tcC5hdHRhY2sodXNlcik7XG5cdFx0XHRcdHVwZGF0ZUJvYXJkKGNvbXBYLCBjb21wWSwgY29tcFJlc3VsdCwgZmFsc2UpO1xuXG5cdFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRcdGdhbWVBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInVzZXIgaGFzIGxvc3RcIik7XG5cdFx0XHRcdFx0d2lubmVyKFwiY29tcFwiKTtcblx0XHRcdFx0XHRzaG93UG9wdXAoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1c2VyLmlzVHVybiA9IHRydWU7XG5cdFx0XHRcdGNvbXAuaXNUdXJuID0gZmFsc2U7XG5cdFx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBwbGF5R2FtZSgpIHtcblx0Y29uc3QgZ2FtZUFjdGl2ZSA9IHRydWU7XG5cdGNvbnN0IHVzZXIgPSBwbGF5ZXIoXCJQbGF5ZXIgMVwiKTtcblx0Y29uc3QgY29tcCA9IGNvbXB1dGVyKCk7XG5cblx0Y29uc3QgZ3JpZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWNlbGxcIik7XG5cdGNvbnN0IHJvdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ1dHRvblwiKTtcblx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cdGxldCBzZWxlY3RlZFNoaXBTaXplID0gc2hpcHMuc2hpZnQoKTtcblx0bGV0IGlzSG9yaXpvbnRhbCA9IHRydWU7IC8vIE9yaWVudGF0aW9uIG9mIHRoZSBzaGlwXG5cblx0ZnVuY3Rpb24gaXNBZGphY2VudEJsb2NrZWQoc3RhcnRYLCBzdGFydFksIHNoaXBTaXplKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCB4ID0gIWlzSG9yaXpvbnRhbCA/IHN0YXJ0WCA6IHN0YXJ0WCArIGk7XG5cdFx0XHRjb25zdCB5ID0gaXNIb3Jpem9udGFsID8gc3RhcnRZIDogc3RhcnRZICsgaTtcblxuXHRcdFx0Zm9yIChsZXQgYWRqWCA9IC0xOyBhZGpYIDw9IDE7IGFkalggKz0gMSkge1xuXHRcdFx0XHRmb3IgKGxldCBhZGpZID0gLTE7IGFkalkgPD0gMTsgYWRqWSArPSAxKSB7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JYID0geCArIGFkalg7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JZID0geSArIGFkalk7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA8IDEwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZIDwgMTBcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdGlmICh1c2VyLnBsYXllckJvYXJkLmhhc1NoaXBBdChuZWlnaGJvclgsIG5laWdoYm9yWSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhpZ2hsaWdodENlbGxzKGUsIHNoaXBTaXplKSB7XG5cdFx0Y29uc3Qgc3RhcnRYID0gcGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC54LCAxMCk7XG5cdFx0Y29uc3Qgc3RhcnRZID0gcGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC55LCAxMCk7XG5cblx0XHQvLyBBc3N1bWluZyB1c2VyLnBsYXllckJvYXJkIGlzIGFjY2Vzc2libGUgYW5kIGhhcyBhIG1ldGhvZCB0byBjaGVjayBmb3Igc2hpcCBhdCBhIGdpdmVuIHBvc2l0aW9uXG5cdFx0bGV0IGlzT3ZlcmxhcE9yQWRqYWNlbnQgPSBpc0FkamFjZW50QmxvY2tlZChzdGFydFgsIHN0YXJ0WSwgc2hpcFNpemUpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCB4ID0gIWlzSG9yaXpvbnRhbCA/IHN0YXJ0WCA6IHN0YXJ0WCArIGk7XG5cdFx0XHRjb25zdCB5ID0gaXNIb3Jpem9udGFsID8gc3RhcnRZIDogc3RhcnRZICsgaTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxuXHRcdFx0KTtcblx0XHRcdGlmICghY2VsbCB8fCB4ID49IDEwIHx8IHkgPj0gMTAgfHwgdXNlci5wbGF5ZXJCb2FyZC5oYXNTaGlwQXQoeCwgeSkpIHtcblx0XHRcdFx0aXNPdmVybGFwT3JBZGphY2VudCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcblx0XHRcdCk7XG5cdFx0XHRpZiAoY2VsbCkge1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoaXNPdmVybGFwT3JBZGphY2VudCA/IFwib3ZlcmxhcFwiIDogXCJoaWdobGlnaHRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KCkge1xuXHRcdGdyaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIiwgXCJvdmVybGFwXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z3JpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcblx0XHRcdGlmIChzZWxlY3RlZFNoaXBTaXplID09PSAtMSkgcmV0dXJuO1xuXHRcdFx0aGlnaGxpZ2h0Q2VsbHMoZSwgc2VsZWN0ZWRTaGlwU2l6ZSk7XG5cdFx0fSk7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgcmVtb3ZlSGlnaGxpZ2h0KTtcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zdCB4ID0gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LngsIDEwKTtcblx0XHRcdGNvbnN0IHkgPSBwYXJzZUludChjZWxsLmRhdGFzZXQueSwgMTApO1xuXG5cdFx0XHRpZiAodXNlci5jYW5QbGFjZVNoaXAoc2VsZWN0ZWRTaGlwU2l6ZSwgeCwgeSwgIWlzSG9yaXpvbnRhbCkpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR1c2VyLnBsYWNlU2hpcChjcmVhdGVTaGlwKHNlbGVjdGVkU2hpcFNpemUpLCB4LCB5LCAhaXNIb3Jpem9udGFsKTtcblxuXHRcdFx0XHRcdC8vIFZpc3VhbGl6ZSB0aGUgcGxhY2VkIHNoaXBcblx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkU2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2VsbFggPSAhaXNIb3Jpem9udGFsID8geCA6IHggKyBpO1xuXHRcdFx0XHRcdFx0Y29uc3QgY2VsbFkgPSBpc0hvcml6b250YWwgPyB5IDogeSArIGk7XG5cdFx0XHRcdFx0XHRjb25zdCBzaGlwQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7Y2VsbFh9XCJdW2RhdGEteT1cIiR7Y2VsbFl9XCJdYCxcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRpZiAoc2hpcENlbGwpIHtcblx0XHRcdFx0XHRcdFx0c2hpcENlbGwuY2xhc3NMaXN0LmFkZChcImNlbGwtd2l0aC1zaGlwXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlbGVjdGVkU2hpcFNpemUgPSBzaGlwcy5zaGlmdCgpO1xuXHRcdFx0XHRcdGlmIChzZWxlY3RlZFNoaXBTaXplID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkU2hpcFNpemUgPSAtMTtcblx0XHRcdFx0XHRcdHJlbW92ZUhpZ2hsaWdodCgpO1xuXHRcdFx0XHRcdFx0bG9hZEdhbWUoKTtcblx0XHRcdFx0XHRcdGdhbWVUaW1lKHVzZXIsIGNvbXAsIGdhbWVBY3RpdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zb2xlLmxvZyh1c2VyLnBsYXllckJvYXJkLmJvYXJkKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHQvLyBIYW5kbGUgZXJyb3Jcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSGFuZGxlIGludmFsaWQgcGxhY2VtZW50XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHJvdGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlzSG9yaXpvbnRhbCA9ICFpc0hvcml6b250YWw7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbGF5R2FtZTtcbiIsImZ1bmN0aW9uIGdhbWVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cblx0ZnVuY3Rpb24gdmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiIHx8IHggPCAwIHx8IHggPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAodHlwZW9mIHkgIT09IFwibnVtYmVyXCIgfHwgeSA8IDAgfHwgeSA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuUGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHR2YWxpZGF0ZUNvb3JkaW5hdGVzKHgsIHkpO1xuXHRcdGlmICh0eXBlb2YgaXNWZXJ0aWNhbCAhPT0gXCJib29sZWFuXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpc1ZlcnRpY2FsIG11c3QgYmUgYSBib29sZWFuXCIpO1xuXHRcdGNvbnN0IGxlbmd0aCA9IHNoaXAubGVuZ3RoIC0gMTtcblx0XHRjb25zdCBtYXhYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgbGVuZ3RoO1xuXHRcdGNvbnN0IG1heFkgPSBpc1ZlcnRpY2FsID8geSArIGxlbmd0aCA6IHk7XG5cblx0XHRpZiAobWF4WCA+IDkgfHwgbWF4WSA+IDkpIHJldHVybiBmYWxzZTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBjaGVja1ggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpO1xuXHRcdFx0Y29uc3QgY2hlY2tZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTtcblx0XHRcdGlmIChib2FyZFtjaGVja1ldW2NoZWNrWF0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0XHQvLyBDaGVjayBhZGphY2VudCBjZWxsc1xuXHRcdFx0Zm9yIChsZXQgYWRqWCA9IC0xOyBhZGpYIDw9IDE7IGFkalggKz0gMSkge1xuXHRcdFx0XHRmb3IgKGxldCBhZGpZID0gLTE7IGFkalkgPD0gMTsgYWRqWSArPSAxKSB7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JYID0gY2hlY2tYICsgYWRqWDtcblx0XHRcdFx0XHRjb25zdCBuZWlnaGJvclkgPSBjaGVja1kgKyBhZGpZO1xuXG5cdFx0XHRcdFx0Ly8gVmFsaWRhdGUgbmVpZ2hib3IgY29vcmRpbmF0ZXNcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYIDwgMTAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPCAxMFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0aWYgKGJvYXJkW25laWdoYm9yWV1bbmVpZ2hib3JYXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG5cdFx0aWYgKCFjYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBwbGFjZSBzaGlwIGhlcmVcIik7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBwbGFjZVggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpO1xuXHRcdFx0Y29uc3QgcGxhY2VZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTtcblx0XHRcdGJvYXJkW3BsYWNlWV1bcGxhY2VYXSA9IHNoaXA7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFzU2hpcEF0KHgsIHkpIHtcblx0XHRyZXR1cm4gYm9hcmRbeV1beF0gIT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7XG5cdFx0aWYgKGJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJvYXJkW3ldW3hdID0gXCJtaXNzXCI7XG5cdFx0XHRyZXR1cm4gXCJtaXNzXCI7XG5cdFx0fVxuXHRcdGJvYXJkW3ldW3hdLmhpdCgpO1xuXHRcdGlmIChib2FyZFt5XVt4XS5zdW5rKSByZXR1cm4gXCJzdW5rXCI7XG5cdFx0cmV0dXJuIFwiaGl0XCI7XG5cdH1cblxuXHRmdW5jdGlvbiBhbGxTaGlwc1N1bmsoKSB7XG5cdFx0cmV0dXJuIGJvYXJkLmV2ZXJ5KChyb3cpID0+XG5cdFx0XHRyb3cuZXZlcnkoXG5cdFx0XHRcdChjZWxsKSA9PlxuXHRcdFx0XHRcdGNlbGwgPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHRcdGNlbGwgPT09IFwibWlzc1wiIHx8XG5cdFx0XHRcdFx0KHR5cGVvZiBjZWxsID09PSBcIm9iamVjdFwiICYmIGNlbGwuc3VuayksXG5cdFx0XHQpLFxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGdldCBib2FyZCgpIHtcblx0XHRcdHJldHVybiBib2FyZDtcblx0XHR9LFxuXHRcdGNhblBsYWNlU2hpcCxcblx0XHRwbGFjZVNoaXAsXG5cdFx0aGFzU2hpcEF0LFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0YWxsU2hpcHNTdW5rLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJpbXBvcnQgc29sZGllciBmcm9tIFwiLi9pbWcvc29sZGllci5zdmdcIjtcbmltcG9ydCBHaXRIdWIgZnJvbSBcIi4vaW1nL2dpdC5zdmdcIjtcblxuZnVuY3Rpb24gaGVhZGVyKCkge1xuXHRjb25zdCBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXIuY2xhc3NMaXN0LmFkZChcIm5hdi1iYXJcIik7XG5cblx0Ly8gaXRlbXMgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgaGVhZGVyXG5cdGNvbnN0IGxlZnRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0bGVmdEljb24uY2xhc3NMaXN0LmFkZChcImljb25cIik7XG5cdGxlZnRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdGxlZnRJY29uLmFsdCA9IFwic29sZGllclwiO1xuXG5cdC8vIENyZWF0ZSB0aGUgbWVudSBidXR0b25cblx0Y29uc3QgdGl0bGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0aXRsZUJveC5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyXCIpO1xuXHRjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblx0dGl0bGUudGV4dENvbnRlbnQgPSBcIkJhdHRsZXNoaXBcIjtcblx0dGl0bGVCb3guYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdGNvbnN0IHJpZ2h0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0cmlnaHRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdHJpZ2h0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHRiYXIuYXBwZW5kQ2hpbGQobGVmdEljb24pO1xuXHRiYXIuYXBwZW5kQ2hpbGQodGl0bGVCb3gpO1xuXHRiYXIuYXBwZW5kQ2hpbGQocmlnaHRJY29uKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYmFyKTtcbn1cblxuZnVuY3Rpb24gbWFpbkNvbnRlbnQoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRtYWluLmNsYXNzTGlzdC5hZGQoXCJtYWluLWNvbnRlbnRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChtYWluKTtcbn1cblxuZnVuY3Rpb24gdHVybigpIHtcblx0Y29uc3QgdHVybkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5EaXYuY2xhc3NMaXN0LmFkZChcInR1cm4tZGl2XCIpO1xuXHRjb25zdCB0dXJuSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dHVybkluZGljYXRvci5jbGFzc0xpc3QuYWRkKFwidHVybi1pbmRpY2F0b3JcIik7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJZb3VyIFR1cm5cIjtcblx0dHVybkluZGljYXRvci5hcHBlbmRDaGlsZCh0dXJuVGV4dCk7XG5cdHR1cm5EaXYuYXBwZW5kQ2hpbGQodHVybkluZGljYXRvcik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKHR1cm5EaXYpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gcGxheWVyQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJZb3VyIEJvYXJkXCI7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkVGl0bGUpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmJvYXJkXCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuZnVuY3Rpb24gZW5lbXlCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiZW5lbXlcIik7XG5cblx0Y29uc3QgYm9hcmRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblx0Ym9hcmRUaXRsZS50ZXh0Q29udGVudCA9IFwiRW5lbXkgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5mdW5jdGlvbiByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpIHtcblx0bGV0IGJvYXJkR3JpZDtcblx0aWYgKGVuZW15KSB7XG5cdFx0Ym9hcmRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5lbmVteSBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fSBlbHNlIHtcblx0XHRib2FyZEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnBsYXllciBkaXYuYm9hcmQtZ3JpZFwiKTtcblx0fVxuXHRyZXR1cm4gYm9hcmRHcmlkO1xufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIGlzRW5lbXkgPSBmYWxzZSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoaXNFbmVteSk7XG5cdGJvYXJkR3JpZC5pbm5lckhUTUwgPSBcIlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFtpXS5sZW5ndGg7IGogKz0gMSkge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnggPSBqO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnkgPSBpO1xuXG5cdFx0XHRpZiAoYm9hcmRbaV1bal0gIT09IHVuZGVmaW5lZCAmJiAhaXNFbmVteSkge1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoYHNoaXAtJHtib2FyZFtpXVtqXS5uYW1lfWApO1xuXHRcdFx0fVxuXHRcdFx0Ym9hcmRHcmlkLmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBtaXNzKHgsIHksIGVuZW15KSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChlbmVteSk7XG5cdGNvbnN0IGNlbGwgPSBib2FyZEdyaWQuY2hpbGRyZW5beSAqIDEwICsgeF07XG5cdGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG59XG5cbmZ1bmN0aW9uIGhpdCh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKHgsIHksIHJlc3VsdCwgZW5lbXkpIHtcblx0aWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIHtcblx0XHRtaXNzKHgsIHksIGVuZW15KTtcblx0fSBlbHNlIHtcblx0XHRoaXQoeCwgeSwgZW5lbXkpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0UGFnZSgpIHtcblx0Y29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpO1xuXHRtYWluLmlubmVySFRNTCA9IFwiXCI7XG5cdHR1cm4oKTtcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnR1cm4taW5kaWNhdG9yIHBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJQbGFjZSB5b3VyIHNoaXBzIGJ5IGNsaWNraW5nIG9uIHRoZSBib2FyZCBiZWxvd1wiO1xuXG5cdGNvbnN0IHJvdGF0ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHJvdGF0ZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwicm90YXRlLWNvbnRhaW5lclwiKTtcblxuXHRjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRyb3RhdGVCdXR0b24uY2xhc3NMaXN0LmFkZChcInJvdGF0ZS1idXR0b25cIik7XG5cdHJvdGF0ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiUm90YXRlXCI7XG5cdHJvdGF0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGVCdXR0b24pO1xuXHRtYWluLmFwcGVuZENoaWxkKHJvdGF0ZUNvbnRhaW5lcik7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRtYWluLmFwcGVuZENoaWxkKGJvYXJkR3JpZCk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xuXHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG5cdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xuXHRcdGNlbGwuZGF0YXNldC54ID0gaSAlIDEwO1xuXHRcdGNlbGwuZGF0YXNldC55ID0gTWF0aC5mbG9vcihpIC8gMTApO1xuXHRcdGJvYXJkR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsb2FkR2FtZSgpIHtcblx0Y29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpO1xuXHRtYWluLmlubmVySFRNTCA9IFwiXCI7XG5cdHR1cm4oKTtcblx0Y3JlYXRlQm9hcmQoKTtcblx0cGxheWVyQm9hcmQoKTtcblx0ZW5lbXlCb2FyZCgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUdXJuKGlzVHVybikge1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYudHVybi1pbmRpY2F0b3IgcFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBpc1R1cm4gPyBcIllvdXIgVHVyblwiIDogXCJDb21wdXRlcidzIFR1cm5cIjtcbn1cblxuZnVuY3Rpb24gd2lubmVyKHBsYXllcikge1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYudHVybi1pbmRpY2F0b3IgcFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJ9IHdvbiFgO1xufVxuXG5mdW5jdGlvbiBoaWRlUG9wdXAoKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheUFnYWluUG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG4vLyBDcmVhdGUgdGhlIGZvb3RlclxuY29uc3QgY3JlYXRlRm9vdGVyID0gKCkgPT4ge1xuXHRjb25zdCBmb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xuXHRmb290ZXIuY2xhc3NMaXN0LmFkZChcImZvb3RlclwiKTtcblxuXHRjb25zdCBnaXRIdWJQcm9maWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdGdpdEh1YlByb2ZpbGUuaHJlZiA9IFwiaHR0cHM6Ly9naXRodWIuY29tL1NoYWhpci00N1wiO1xuXG5cdGNvbnN0IGdpdEh1YlByb2ZpbGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRnaXRIdWJQcm9maWxlSW1nLnNyYyA9IEdpdEh1Yjtcblx0Z2l0SHViUHJvZmlsZUltZy5hbHQgPSBcImdpdEh1YiBMb2dvXCI7XG5cblx0Y29uc3QgZ2l0SHViUHJvZmlsZVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0Y29uc3QgYXRTeW1ib2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0YXRTeW1ib2wuY2xhc3NMaXN0LmFkZChcImF0LXN5bWJvbFwiKTtcblx0YXRTeW1ib2wudGV4dENvbnRlbnQgPSBcIkBcIjtcblx0Y29uc3QgdXNlcm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dXNlcm5hbWUudGV4dENvbnRlbnQgPSBcIlNoYWhpci00N1wiO1xuXHRnaXRIdWJQcm9maWxlVGV4dC5hcHBlbmRDaGlsZChhdFN5bWJvbCk7XG5cdGdpdEh1YlByb2ZpbGVUZXh0LmFwcGVuZENoaWxkKHVzZXJuYW1lKTtcblxuXHRnaXRIdWJQcm9maWxlLmFwcGVuZENoaWxkKGdpdEh1YlByb2ZpbGVJbWcpO1xuXHRnaXRIdWJQcm9maWxlLmFwcGVuZENoaWxkKGdpdEh1YlByb2ZpbGVUZXh0KTtcblxuXHRjb25zdCBzZXBlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0c2VwZXJhdG9yLnRleHRDb250ZW50ID0gXCJ8XCI7XG5cblx0Y29uc3QgZ2l0SHViUmVwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRnaXRIdWJSZXBvLmhyZWYgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9TaGFoaXItNDcvQmF0dGxlc2hpcFwiO1xuXHRnaXRIdWJSZXBvLnRleHRDb250ZW50ID0gXCJTb3VyY2UgQ29kZVwiO1xuXG5cdGZvb3Rlci5hcHBlbmRDaGlsZChnaXRIdWJQcm9maWxlKTtcblx0Zm9vdGVyLmFwcGVuZENoaWxkKHNlcGVyYXRvcik7XG5cdGZvb3Rlci5hcHBlbmRDaGlsZChnaXRIdWJSZXBvKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcbn07XG5cbmZ1bmN0aW9uIHBhZ2UoKSB7XG5cdGhlYWRlcigpO1xuXHRtYWluQ29udGVudCgpO1xuXHRzdGFydFBhZ2UoKTtcblx0Y3JlYXRlRm9vdGVyKCk7XG59XG5cbmZ1bmN0aW9uIHNob3dQb3B1cCgpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5QWdhaW5Qb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYWdlO1xuZXhwb3J0IHtcblx0ZHJhd0JvYXJkLFxuXHR1cGRhdGVCb2FyZCxcblx0dXBkYXRlVHVybixcblx0bG9hZEdhbWUsXG5cdHdpbm5lcixcblx0c2hvd1BvcHVwLFxuXHRoaWRlUG9wdXAsXG59O1xuIiwiaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcblxuZnVuY3Rpb24gcGxheWVyKG5hbWUgPSBcImFub255bW91c1wiKSB7XG5cdGNvbnN0IHBsYXllckJvYXJkID0gZ2FtZUJvYXJkKCk7XG5cdGNvbnN0IGhpdEJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSkpO1xuXHRsZXQgaXNUdXJuID0gZmFsc2U7XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCkge1xuXHRcdHBsYXllckJvYXJkLnBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuUGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCkge1xuXHRcdHJldHVybiBwbGF5ZXJCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcblx0XHRjb25zdCByZXN1bHQgPSBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblx0XHRpZiAocmVzdWx0ID09PSBcImhpdFwiKSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcImhpdFwiO1xuXHRcdH0gZWxzZSBpZiAocmVzdWx0ID09PSBcInN1bmtcIikge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJzdW5rXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwibWlzc1wiO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhgcGxheWVyIGhpdEJvYXJkOmApO1xuXHRcdGNvbnNvbGUubG9nKGhpdEJvYXJkKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuXHRcdHJldHVybiBlbmVteS5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc0xvc3QoKSB7XG5cdFx0cmV0dXJuIHBsYXllckJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRuYW1lLFxuXHRcdHBsYWNlU2hpcCxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhdHRhY2ssXG5cdFx0aGFzTG9zdCxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IHBsYXllckJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIHBsYXllckJvYXJkO1xuXHRcdH0sXG5cdFx0Z2V0IGhpdEJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGhpdEJvYXJkO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNoaXAobGVuZ3RoKSB7XG5cdGlmICh0eXBlb2YgbGVuZ3RoICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIG51bWJlclwiKTtcblx0aWYgKGxlbmd0aCA8IDEpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCIpO1xuXHRpZiAobGVuZ3RoICUgMSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlclwiKTtcblx0aWYgKGxlbmd0aCA+IDUpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGxlc3MgdGhhbiA2XCIpO1xuXG5cdGxldCBudW1IaXRzID0gMDtcblx0bGV0IHN1bmsgPSBmYWxzZTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldCBsZW5ndGgoKSB7XG5cdFx0XHRyZXR1cm4gbGVuZ3RoO1xuXHRcdH0sXG5cdFx0Z2V0IG51bUhpdHMoKSB7XG5cdFx0XHRyZXR1cm4gbnVtSGl0cztcblx0XHR9LFxuXHRcdGdldCBzdW5rKCkge1xuXHRcdFx0cmV0dXJuIHN1bms7XG5cdFx0fSxcblx0XHRoaXQoKSB7XG5cdFx0XHRudW1IaXRzICs9IDE7XG5cdFx0XHRpZiAobnVtSGl0cyA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdHN1bmsgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keSB7XG5cdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcblx0bWFyZ2luOiAwO1xuXHRwYWRkaW5nOiAwO1xuXHRmb250LWZhbWlseTpcblx0XHRzeXN0ZW0tdWksXG5cdFx0LWFwcGxlLXN5c3RlbSxcblx0XHRCbGlua01hY1N5c3RlbUZvbnQsXG5cdFx0XCJTZWdvZSBVSVwiLFxuXHRcdFJvYm90byxcblx0XHRPeHlnZW4sXG5cdFx0VWJ1bnR1LFxuXHRcdENhbnRhcmVsbCxcblx0XHRcIk9wZW4gU2Fuc1wiLFxuXHRcdFwiSGVsdmV0aWNhIE5ldWVcIixcblx0XHRzYW5zLXNlcmlmO1xuXHRjb2xvcjogI2RkZGRkZDtcbn1cblxuZGl2I2NvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdGhlaWdodDogMTAwdmg7XG59XG5cbi5uYXYtYmFyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDVyZW07XG5cdHBhZGRpbmc6IDAgMXJlbTtcblx0cGFkZGluZy10b3A6IDAuMjVyZW07XG59XG5cbi5tYWluLWNvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xuXHRwYWRkaW5nOiAwIDFyZW07XG59XG5cbi5jZWxsLm92ZXJsYXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7IC8qIENvbG9yIGluZGljYXRpbmcgaW52YWxpZCBwbGFjZW1lbnQgZHVlIHRvIG92ZXJsYXAgKi9cblx0Y3Vyc29yOiBub3QtYWxsb3dlZDsgLyogQmxvY2tlZCBjdXJzb3IgKi9cbn1cblxuLmhlYWRlciBoMSB7XG5cdHRleHQtYWxpZ246IGNlbnRlcjsgLyogQ2VudGVyIHRoZSBoZWFkZXIgdGV4dCAqL1xuXHRmb250LWZhbWlseTogXCJBcmlhbFwiLCBzYW5zLXNlcmlmOyAvKiBVc2UgYSBtb2Rlcm4sIGNsZWFuIGZvbnQgKi9cblx0Zm9udC1zaXplOiAzOXB4OyAvKiBTZXQgYSBsYXJnZSBmb250IHNpemUgZm9yIGltcGFjdCAqL1xuXHRjb2xvcjogI2ZmZmZmZjg3OyAvKiBXaGl0ZSBjb2xvciBmb3IgdGhlIHRleHQgZm9yIGJldHRlciBjb250cmFzdCAqL1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMTkyMTFhOyAvKiBOYXZ5IGJsdWUgYmFja2dyb3VuZCAqL1xuXHRwYWRkaW5nOiAyMHB4OyAvKiBBZGQgc29tZSBwYWRkaW5nIGFyb3VuZCB0aGUgdGV4dCAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cblx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cblx0bWFyZ2luOiAwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cblx0dGV4dC1zaGFkb3c6IDJweCAycHggMnB4ICM3MzczNzM7XG59XG5cbi5oZWFkZXIgaDE6aG92ZXIge1xuXHRjb2xvcjogIzg0OTE3NzsgLyogQ2hhbmdlIHRleHQgY29sb3Igb24gaG92ZXIgKi9cblx0Y3Vyc29yOiBwb2ludGVyOyAvKiBDaGFuZ2UgdGhlIGN1cnNvciB0byBpbmRpY2F0ZSBpdCdzIGNsaWNrYWJsZSAqL1xufVxuXG4uaWNvbiB7XG5cdHdpZHRoOiA0cmVtO1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi50dXJuLWluZGljYXRvciB7XG5cdHdpZHRoOiA2MCU7XG5cdGhlaWdodDogMTAwJTtcblx0Ym9yZGVyLXJhZGl1czogMXJlbTtcblx0LyogYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjg3OyAqL1xuXHRwYWRkaW5nOiAwLjVyZW07XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcblx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xuXHRiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudChcblx0XHQtNDVkZWcsXG5cdFx0I2NkY2FjYTg3IDAlLFxuXHRcdCNmZmZmZmY4NyA1MCUsXG5cdFx0I2NkY2RjZGE2IDEwMCVcblx0KTtcblx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXG5cdFx0LTQ1ZGVnLFxuXHRcdCNjZGNhY2E4NyAwJSxcblx0XHQjZmZmZmZmODcgNTAlLFxuXHRcdCNjZGNkY2RhNiAxMDAlXG5cdCk7XG5cdGJveC1zaGFkb3c6IDBweCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbn1cbi50dXJuLWluZGljYXRvciBwIHtcblx0Zm9udC1zaXplOiAxLjVyZW07XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjb2xvcjogIzE5MjExYTtcblx0Zm9udC1mYW1pbHk6IFwiQXJpYWxcIiwgc2Fucy1zZXJpZjsgLyogVXNlIGEgbW9kZXJuLCBjbGVhbiBmb250ICovXG5cdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IC8qIE1ha2UgYWxsIGxldHRlcnMgdXBwZXJjYXNlIGZvciBtb3JlIGltcGFjdCAqL1xuXHRsZXR0ZXItc3BhY2luZzogMnB4OyAvKiBJbmNyZWFzZSBzcGFjaW5nIGJldHdlZW4gbGV0dGVycyAqL1xuXHRtYXJnaW4tYm90dG9tOiAzMHB4OyAvKiBBZGQgc29tZSBzcGFjZSBiZWxvdyB0aGUgaGVhZGVyICovXG5cdHRleHQtc2hhZG93OiA0cHggM3B4IDBweCAjNjU3MTU5NzM7XG5cdG1hcmdpbjogMDtcblx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UtaW4tb3V0O1xuXHRvcGFjaXR5OiAxOyAvKiBTdGFydCBmdWxseSB2aXNpYmxlICovXG59XG5cbi5yb3RhdGUtY29udGFpbmVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbiNwbGF5QWdhaW5CdXR0b24sXG4ucm90YXRlLWJ1dHRvbiB7XG5cdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XG5cdGNvbG9yOiAjYzFjMWMxZDY7XG5cdGJvcmRlcjogMnB4IHNvbGlkICM5MjkzOTI7XG5cdHBhZGRpbmc6IDEwcHggMjBweDtcblx0Ym9yZGVyLXJhZGl1czogNXB4O1xuXHRmb250LXdlaWdodDogYm9sZDtcblx0Y3Vyc29yOiBwb2ludGVyO1xuXHR0cmFuc2l0aW9uOlxuXHRcdHRyYW5zZm9ybSAwLjNzIGVhc2UsXG5cdFx0YmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XG59XG5cbiNwbGF5QWdhaW5CdXR0b246aG92ZXIsXG4ucm90YXRlLWJ1dHRvbjpob3ZlciB7XG5cdGJhY2tncm91bmQtY29sb3I6ICMyYzcyMzU7IC8qIEJhY2tncm91bmQgY29sb3Igb24gaG92ZXIgKi9cblx0Y29sb3I6ICNmZmZmZmY4NzsgLyogVGV4dCBjb2xvciBvbiBob3ZlciAqL1xufVxuXG4uYm9hcmQge1xuXHRkaXNwbGF5OiBncmlkO1xuXHRncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xuXHRnYXA6IDFyZW07XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLmNlbGwuaGlnaGxpZ2h0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xufVxuXG4uY2VsbC5ibG9ja2VkIHtcblx0YmFja2dyb3VuZC1jb2xvcjogcmVkOyAvKiBDb2xvciBpbmRpY2F0aW5nIGludmFsaWQgcGxhY2VtZW50ICovXG5cdGN1cnNvcjogbm90LWFsbG93ZWQ7IC8qIEJsb2NrZWQgY3Vyc29yICovXG59XG5cbi5jZWxsLXdpdGgtc2hpcCB7XG5cdGJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7IC8qIEV4YW1wbGUgY29sb3IsIGFkanVzdCBhcyBuZWVkZWQgKi9cblx0Ym9yZGVyOiAxcHggc29saWQgI2ZmZmZmZjg3OyAvKiBFeGFtcGxlIGJvcmRlciwgYWRqdXN0IGFzIG5lZWRlZCAqL1xufVxuXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbC5jZWxsLXdpdGgtc2hpcCB7XG5cdGJvcmRlcjogM3B4IHJpZGdlICNhNDI1MTQ7IC8qIEV4YW1wbGUgYm9yZGVyLCBhZGp1c3QgYXMgbmVlZGVkICovXG59XG5cbi5ib2FyZCBoMiB7XG5cdG1hcmdpbjogMDtcbn1cblxuLnR1cm4tZGl2IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbmRpdi5ib2FyZC1ncmlkIHtcblx0ZGlzcGxheTogZ3JpZDtcblx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjN2dykgLyByZXBlYXQoMTAsIDIuM3Z3KTtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRnYXA6IDJweDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XG5cdGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdHdpZHRoOiAxMDAlO1xuXHR0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlIDBzO1xufVxuXG4uZW5lbXksXG4ucGxheWVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogMXJlbTtcbn1cblxuLnNoaXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xufVxuXG4ubWlzcyB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA4Nztcbn1cblxuZGl2LmNlbGwuaGl0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjMDBmZjFlODc7XG59XG5cbi5zdW5rIHtcblx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDBlZTg3O1xufVxuXG4ucG9wdXAge1xuXHRkaXNwbGF5OiBub25lO1xuXHRwb3NpdGlvbjogZml4ZWQ7XG5cdGxlZnQ6IDUwJTtcblx0dG9wOiA1MCU7XG5cdHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcblx0Y29sb3I6ICNkZGRkZGQ7XG5cdHBhZGRpbmc6IDIwcHg7XG5cdHotaW5kZXg6IDEwMDA7IC8qIEVuc3VyZSBpdCdzIGFib3ZlIG90aGVyIGNvbnRlbnQgKi9cbn1cblxuLnBvcHVwLWNvbnRlbnQge1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5wb3B1cC1jb250ZW50IHAge1xuXHRmb250LXNpemU6IDFyZW07XG5cdGZvbnQtd2VpZ2h0OiA5MDA7XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGb290ZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5mb290ZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xuXHR3aWR0aDogMTAwJTtcblx0aGVpZ2h0OiAyLjVyZW07XG5cdHBhZGRpbmc6IDFyZW0gMDtcblx0cGFkZGluZy1ib3R0b206IDAuNXJlbTtcbn1cblxuZm9vdGVyIGEge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDAuNXJlbTtcblx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xuXHRmb250LXNpemU6IDEuM3JlbTtcblx0Zm9udC13ZWlnaHQ6IDEwMDtcblx0Y29sb3I6ICM5NjkyOTI7XG5cdGZvbnQtZmFtaWx5OlxuXHRcdGplZGkgc29saWQsXG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcbn1cblxuZm9vdGVyIHAge1xuXHRtYXJnaW46IDAuNXJlbSAwO1xufVxuXG5mb290ZXIgYTpob3ZlcixcbmZvb3RlciBhOmFjdGl2ZSB7XG5cdGNvbG9yOiAjZmZmO1xufVxuXG5mb290ZXIgYTpob3ZlciBpbWcsXG5mb290ZXIgYTphY3RpdmUgaW1nIHtcblx0ZmlsdGVyOiBicmlnaHRuZXNzKDk5KTtcbn1cblxuLmF0LXN5bWJvbCB7XG5cdGZvbnQtd2VpZ2h0OiA5MDA7XG5cdGZvbnQtZmFtaWx5OlxuXHRcdHN5c3RlbS11aSxcblx0XHQtYXBwbGUtc3lzdGVtLFxuXHRcdEJsaW5rTWFjU3lzdGVtRm9udCxcblx0XHRcIlNlZ29lIFVJXCIsXG5cdFx0Um9ib3RvLFxuXHRcdE94eWdlbixcblx0XHRVYnVudHUsXG5cdFx0Q2FudGFyZWxsLFxuXHRcdFwiT3BlbiBTYW5zXCIsXG5cdFx0XCJIZWx2ZXRpY2EgTmV1ZVwiLFxuXHRcdHNhbnMtc2VyaWY7XG59XG5cbmZvb3RlciBpbWcge1xuXHR3aWR0aDogMnJlbTtcblx0aGVpZ2h0OiBhdXRvO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0NBQ0MsMkJBQTJCO0NBQzNCLHlCQUF5QjtDQUN6QixTQUFTO0NBQ1QsVUFBVTtDQUNWOzs7Ozs7Ozs7OztZQVdXO0NBQ1gsY0FBYztBQUNmOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qiw2QkFBNkI7Q0FDN0Isb0JBQW9CO0NBQ3BCLGFBQWE7QUFDZDs7QUFFQTtDQUNDLHlDQUF5QztDQUN6QyxhQUFhO0NBQ2IsdUJBQXVCO0NBQ3ZCLG1CQUFtQjtDQUNuQixTQUFTO0NBQ1QsZUFBZTtDQUNmLG9CQUFvQjtBQUNyQjs7QUFFQTtDQUNDLGFBQWE7Q0FDYixzQkFBc0I7Q0FDdEIsdUJBQXVCO0NBQ3ZCLFNBQVM7Q0FDVCxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MscUJBQXFCLEVBQUUsc0RBQXNEO0NBQzdFLG1CQUFtQixFQUFFLG1CQUFtQjtBQUN6Qzs7QUFFQTtDQUNDLGtCQUFrQixFQUFFLDJCQUEyQjtDQUMvQyxnQ0FBZ0MsRUFBRSw2QkFBNkI7Q0FDL0QsZUFBZSxFQUFFLHFDQUFxQztDQUN0RCxnQkFBZ0IsRUFBRSxpREFBaUQ7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O0FBRUE7Q0FDQyxhQUFhO0NBQ2IsbUJBQW1CO0NBQ25CLFdBQVc7Q0FDWCxxQkFBcUI7Q0FDckIsaUJBQWlCO0NBQ2pCLGdCQUFnQjtDQUNoQixjQUFjO0NBQ2Q7Ozs7Ozs7Ozs7OztZQVlXO0FBQ1o7O0FBRUE7Q0FDQyxnQkFBZ0I7QUFDakI7O0FBRUE7O0NBRUMsV0FBVztBQUNaOztBQUVBOztDQUVDLHNCQUFzQjtBQUN2Qjs7QUFFQTtDQUNDLGdCQUFnQjtDQUNoQjs7Ozs7Ozs7Ozs7WUFXVztBQUNaOztBQUVBO0NBQ0MsV0FBVztDQUNYLFlBQVk7QUFDYlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5IHtcXG5cXHQtLXNpZGViYXItYmctY29sb3I6ICMxOTIxMWE7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcbn1cXG5cXG5kaXYjY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcblxcdGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcblxcdGhlaWdodDogMTAwdmg7XFxufVxcblxcbi5uYXYtYmFyIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaWRlYmFyLWJnLWNvbG9yKTtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiA1cmVtO1xcblxcdHBhZGRpbmc6IDAgMXJlbTtcXG5cXHRwYWRkaW5nLXRvcDogMC4yNXJlbTtcXG59XFxuXFxuLm1haW4tY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGdhcDogMXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxufVxcblxcbi5jZWxsLm92ZXJsYXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHJlZDsgLyogQ29sb3IgaW5kaWNhdGluZyBpbnZhbGlkIHBsYWNlbWVudCBkdWUgdG8gb3ZlcmxhcCAqL1xcblxcdGN1cnNvcjogbm90LWFsbG93ZWQ7IC8qIEJsb2NrZWQgY3Vyc29yICovXFxufVxcblxcbi5oZWFkZXIgaDEge1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjsgLyogQ2VudGVyIHRoZSBoZWFkZXIgdGV4dCAqL1xcblxcdGZvbnQtZmFtaWx5OiBcXFwiQXJpYWxcXFwiLCBzYW5zLXNlcmlmOyAvKiBVc2UgYSBtb2Rlcm4sIGNsZWFuIGZvbnQgKi9cXG5cXHRmb250LXNpemU6IDM5cHg7IC8qIFNldCBhIGxhcmdlIGZvbnQgc2l6ZSBmb3IgaW1wYWN0ICovXFxuXFx0Y29sb3I6ICNmZmZmZmY4NzsgLyogV2hpdGUgY29sb3IgZm9yIHRoZSB0ZXh0IGZvciBiZXR0ZXIgY29udHJhc3QgKi9cXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMTkyMTFhOyAvKiBOYXZ5IGJsdWUgYmFja2dyb3VuZCAqL1xcblxcdHBhZGRpbmc6IDIwcHg7IC8qIEFkZCBzb21lIHBhZGRpbmcgYXJvdW5kIHRoZSB0ZXh0ICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgLyogTWFrZSBhbGwgbGV0dGVycyB1cHBlcmNhc2UgZm9yIG1vcmUgaW1wYWN0ICovXFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDsgLyogSW5jcmVhc2Ugc3BhY2luZyBiZXR3ZWVuIGxldHRlcnMgKi9cXG5cXHRtYXJnaW46IDBweDsgLyogQWRkIHNvbWUgc3BhY2UgYmVsb3cgdGhlIGhlYWRlciAqL1xcblxcdHRleHQtc2hhZG93OiAycHggMnB4IDJweCAjNzM3MzczO1xcbn1cXG5cXG4uaGVhZGVyIGgxOmhvdmVyIHtcXG5cXHRjb2xvcjogIzg0OTE3NzsgLyogQ2hhbmdlIHRleHQgY29sb3Igb24gaG92ZXIgKi9cXG5cXHRjdXJzb3I6IHBvaW50ZXI7IC8qIENoYW5nZSB0aGUgY3Vyc29yIHRvIGluZGljYXRlIGl0J3MgY2xpY2thYmxlICovXFxufVxcblxcbi5pY29uIHtcXG5cXHR3aWR0aDogNHJlbTtcXG5cXHRoZWlnaHQ6IGF1dG87XFxufVxcblxcbi50dXJuLWluZGljYXRvciB7XFxuXFx0d2lkdGg6IDYwJTtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0Ym9yZGVyLXJhZGl1czogMXJlbTtcXG5cXHQvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmODc7ICovXFxuXFx0cGFkZGluZzogMC41cmVtO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRiYWNrZ3JvdW5kOiAjZmZmZmZmODc7XFxuXFx0YmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChcXG5cXHRcXHQtNDVkZWcsXFxuXFx0XFx0I2NkY2FjYTg3IDAlLFxcblxcdFxcdCNmZmZmZmY4NyA1MCUsXFxuXFx0XFx0I2NkY2RjZGE2IDEwMCVcXG5cXHQpO1xcblxcdGJveC1zaGFkb3c6IDBweCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcXG59XFxuLnR1cm4taW5kaWNhdG9yIHAge1xcblxcdGZvbnQtc2l6ZTogMS41cmVtO1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkO1xcblxcdGNvbG9yOiAjMTkyMTFhO1xcblxcdGZvbnQtZmFtaWx5OiBcXFwiQXJpYWxcXFwiLCBzYW5zLXNlcmlmOyAvKiBVc2UgYSBtb2Rlcm4sIGNsZWFuIGZvbnQgKi9cXG5cXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyAvKiBNYWtlIGFsbCBsZXR0ZXJzIHVwcGVyY2FzZSBmb3IgbW9yZSBpbXBhY3QgKi9cXG5cXHRsZXR0ZXItc3BhY2luZzogMnB4OyAvKiBJbmNyZWFzZSBzcGFjaW5nIGJldHdlZW4gbGV0dGVycyAqL1xcblxcdG1hcmdpbi1ib3R0b206IDMwcHg7IC8qIEFkZCBzb21lIHNwYWNlIGJlbG93IHRoZSBoZWFkZXIgKi9cXG5cXHR0ZXh0LXNoYWRvdzogNHB4IDNweCAwcHggIzY1NzE1OTczO1xcblxcdG1hcmdpbjogMDtcXG5cXHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZS1pbi1vdXQ7XFxuXFx0b3BhY2l0eTogMTsgLyogU3RhcnQgZnVsbHkgdmlzaWJsZSAqL1xcbn1cXG5cXG4ucm90YXRlLWNvbnRhaW5lciB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbiNwbGF5QWdhaW5CdXR0b24sXFxuLnJvdGF0ZS1idXR0b24ge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XFxuXFx0Y29sb3I6ICNjMWMxYzFkNjtcXG5cXHRib3JkZXI6IDJweCBzb2xpZCAjOTI5MzkyO1xcblxcdHBhZGRpbmc6IDEwcHggMjBweDtcXG5cXHRib3JkZXItcmFkaXVzOiA1cHg7XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcblxcdHRyYW5zaXRpb246XFxuXFx0XFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcXG5cXHRcXHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcXG59XFxuXFxuI3BsYXlBZ2FpbkJ1dHRvbjpob3ZlcixcXG4ucm90YXRlLWJ1dHRvbjpob3ZlciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTsgLyogQmFja2dyb3VuZCBjb2xvciBvbiBob3ZlciAqL1xcblxcdGNvbG9yOiAjZmZmZmZmODc7IC8qIFRleHQgY29sb3Igb24gaG92ZXIgKi9cXG59XFxuXFxuLmJvYXJkIHtcXG5cXHRkaXNwbGF5OiBncmlkO1xcblxcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmNlbGwuaGlnaGxpZ2h0IHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxufVxcblxcbi5jZWxsLmJsb2NrZWQge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHJlZDsgLyogQ29sb3IgaW5kaWNhdGluZyBpbnZhbGlkIHBsYWNlbWVudCAqL1xcblxcdGN1cnNvcjogbm90LWFsbG93ZWQ7IC8qIEJsb2NrZWQgY3Vyc29yICovXFxufVxcblxcbi5jZWxsLXdpdGgtc2hpcCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDsgLyogRXhhbXBsZSBjb2xvciwgYWRqdXN0IGFzIG5lZWRlZCAqL1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICNmZmZmZmY4NzsgLyogRXhhbXBsZSBib3JkZXIsIGFkanVzdCBhcyBuZWVkZWQgKi9cXG59XFxuXFxuZGl2LmJvYXJkLWdyaWQgLmNlbGwuY2VsbC13aXRoLXNoaXAge1xcblxcdGJvcmRlcjogM3B4IHJpZGdlICNhNDI1MTQ7IC8qIEV4YW1wbGUgYm9yZGVyLCBhZGp1c3QgYXMgbmVlZGVkICovXFxufVxcblxcbi5ib2FyZCBoMiB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4udHVybi1kaXYge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCB7XFxuXFx0ZGlzcGxheTogZ3JpZDtcXG5cXHRncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDIuM3Z3KSAvIHJlcGVhdCgxMCwgMi4zdncpO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRnYXA6IDJweDtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIC5jZWxsIHtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0d2lkdGg6IDEwMCU7XFxuXFx0dHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAwcztcXG59XFxuXFxuLmVuZW15LFxcbi5wbGF5ZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogMXJlbTtcXG59XFxuXFxuLnNoaXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxZTkwZmY7XFxufVxcblxcbi5taXNzIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwODc7XFxufVxcblxcbmRpdi5jZWxsLmhpdCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICMwMGZmMWU4NztcXG59XFxuXFxuLnN1bmsge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICNmZjAwZWU4NztcXG59XFxuXFxuLnBvcHVwIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcblxcdHBvc2l0aW9uOiBmaXhlZDtcXG5cXHRsZWZ0OiA1MCU7XFxuXFx0dG9wOiA1MCU7XFxuXFx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXFx0Y29sb3I6ICNkZGRkZGQ7XFxuXFx0cGFkZGluZzogMjBweDtcXG5cXHR6LWluZGV4OiAxMDAwOyAvKiBFbnN1cmUgaXQncyBhYm92ZSBvdGhlciBjb250ZW50ICovXFxufVxcblxcbi5wb3B1cC1jb250ZW50IHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5wb3B1cC1jb250ZW50IHAge1xcblxcdGZvbnQtc2l6ZTogMXJlbTtcXG5cXHRmb250LXdlaWdodDogOTAwO1xcbn1cXG5cXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRm9vdGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5cXG5mb290ZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0d2lkdGg6IDEwMCU7XFxuXFx0aGVpZ2h0OiAyLjVyZW07XFxuXFx0cGFkZGluZzogMXJlbSAwO1xcblxcdHBhZGRpbmctYm90dG9tOiAwLjVyZW07XFxufVxcblxcbmZvb3RlciBhIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiAwLjVyZW07XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblxcdGZvbnQtc2l6ZTogMS4zcmVtO1xcblxcdGZvbnQtd2VpZ2h0OiAxMDA7XFxuXFx0Y29sb3I6ICM5NjkyOTI7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0amVkaSBzb2xpZCxcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcbn1cXG5cXG5mb290ZXIgcCB7XFxuXFx0bWFyZ2luOiAwLjVyZW0gMDtcXG59XFxuXFxuZm9vdGVyIGE6aG92ZXIsXFxuZm9vdGVyIGE6YWN0aXZlIHtcXG5cXHRjb2xvcjogI2ZmZjtcXG59XFxuXFxuZm9vdGVyIGE6aG92ZXIgaW1nLFxcbmZvb3RlciBhOmFjdGl2ZSBpbWcge1xcblxcdGZpbHRlcjogYnJpZ2h0bmVzcyg5OSk7XFxufVxcblxcbi5hdC1zeW1ib2wge1xcblxcdGZvbnQtd2VpZ2h0OiA5MDA7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sXFxuXFx0XFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxcblxcdFxcdFxcXCJTZWdvZSBVSVxcXCIsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdE94eWdlbixcXG5cXHRcXHRVYnVudHUsXFxuXFx0XFx0Q2FudGFyZWxsLFxcblxcdFxcdFxcXCJPcGVuIFNhbnNcXFwiLFxcblxcdFxcdFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsXFxuXFx0XFx0c2Fucy1zZXJpZjtcXG59XFxuXFxuZm9vdGVyIGltZyB7XFxuXFx0d2lkdGg6IDJyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG5cdG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuXHRmb250LXNpemU6IDJlbTtcblx0bWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuXHRoZWlnaHQ6IDA7IC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG5cdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG5cdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcblx0Zm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuXHRmb250LXNpemU6IDc1JTtcblx0bGluZS1oZWlnaHQ6IDA7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuXHRib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG5cdHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cblx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cblx0bWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcblx0LyogMSAqL1xuXHRvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuXHQvKiAxICovXG5cdHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xuXHRwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG5cdG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuXHRwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMyAqL1xuXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG5cdG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG5cdG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuXHRmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG5cdGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuXHRkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Q0FDQyxpQkFBaUIs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YTtBQUNkOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcblxcdGZvbnQtc2l6ZTogMmVtO1xcblxcdG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcblxcdGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuXFx0aGVpZ2h0OiAwOyAvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcblxcdGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHtcXG5cXHQvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHtcXG5cXHQvKiAxICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuXFx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG5cXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcblxcdG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcblxcdHBhZGRpbmc6IDA7IC8qIDMgKi9cXG5cXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcblxcdG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG5cXHRoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuXFx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG5cXHRkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBwbGF5R2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgcGFnZSBmcm9tIFwiLi9nYW1lVUlcIjtcbmltcG9ydCBcIi4vY3NzL25vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBcIi4vY3NzL2dhbWUuY3NzXCI7XG5cbmltcG9ydCB7IGhpZGVQb3B1cCB9IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5wYWdlKCk7XG5wbGF5R2FtZSgpO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlBZ2FpbkJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQvLyBDb2RlIHRvIHJlc2V0IHRoZSBnYW1lIGFuZCBzdGFydCBhZ2FpblxuXHRoaWRlUG9wdXAoKTtcblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKTtcblx0Y29udGVudC5pbm5lckhUTUwgPSBcIlwiO1xuXHRwYWdlKCk7XG5cdHBsYXlHYW1lKCk7XG59KTtcbiJdLCJuYW1lcyI6WyJnYW1lQm9hcmQiLCJjcmVhdGVTaGlwIiwiY29tcHV0ZXIiLCJjb21wQm9hcmQiLCJsYXN0SGl0IiwidGFyZ2V0TW9kZSIsImF0dGFja09wdGlvbnMiLCJpc1R1cm4iLCJyYW5kb21BdHRhY2siLCJlbmVteSIsIngiLCJ5IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaGl0Qm9hcmQiLCJ1bmRlZmluZWQiLCJwbGFjZVNoaXBzQXV0b21hdGljYWxseSIsInNoaXBzIiwiZm9yRWFjaCIsImxlbmd0aCIsInZlcnRpY2FsIiwic2hpcCIsImNhblBsYWNlU2hpcCIsInBsYWNlU2hpcCIsInRhcmdldEF0dGFjayIsImRpcmVjdGlvbnMiLCJkaXIiLCJuZXdYIiwibmV3WSIsInB1c2giLCJzaGlmdCIsImNob29zZUF0dGFjayIsImF0dGFjayIsInBsYXllciIsIl9jaG9vc2VBdHRhY2siLCJjb25zb2xlIiwibG9nIiwiY29uY2F0IiwiYXR0YWNrUmVzdWx0IiwicmVjZWl2ZUF0dGFjayIsImhhc0xvc3QiLCJhbGxTaGlwc1N1bmsiLCJ2YWx1ZSIsImRyYXdCb2FyZCIsInVwZGF0ZUJvYXJkIiwidXBkYXRlVHVybiIsImxvYWRHYW1lIiwid2lubmVyIiwic2hvd1BvcHVwIiwiZ2FtZVRpbWUiLCJ1c2VyUGFyYW0iLCJjb21wUGFyYW0iLCJnYW1lQWN0aXZlUGFyYW0iLCJ1c2VyIiwiY29tcCIsImdhbWVBY3RpdmUiLCJwbGF5ZXJCb2FyZCIsImJvYXJkIiwiY2VsbHMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjZWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImRhdGFzZXQiLCJ4SW50IiwicGFyc2VJbnQiLCJ5SW50IiwicmVzdWx0Iiwic2V0VGltZW91dCIsIl9jb21wJGF0dGFjayIsImNvbXBYIiwiY29tcFkiLCJjb21wUmVzdWx0IiwicGxheUdhbWUiLCJncmlkQ2VsbHMiLCJyb3RhdGVCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwic2VsZWN0ZWRTaGlwU2l6ZSIsImlzSG9yaXpvbnRhbCIsImlzQWRqYWNlbnRCbG9ja2VkIiwic3RhcnRYIiwic3RhcnRZIiwic2hpcFNpemUiLCJpIiwiYWRqWCIsImFkalkiLCJuZWlnaGJvclgiLCJuZWlnaGJvclkiLCJoYXNTaGlwQXQiLCJoaWdobGlnaHRDZWxscyIsImlzT3ZlcmxhcE9yQWRqYWNlbnQiLCJhZGQiLCJyZW1vdmVIaWdobGlnaHQiLCJyZW1vdmUiLCJjZWxsWCIsImNlbGxZIiwic2hpcENlbGwiLCJlcnJvciIsIkFycmF5IiwiZnJvbSIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJFcnJvciIsImlzVmVydGljYWwiLCJtYXhYIiwibWF4WSIsImNoZWNrWCIsImNoZWNrWSIsInBsYWNlWCIsInBsYWNlWSIsImhpdCIsInN1bmsiLCJldmVyeSIsInJvdyIsIl90eXBlb2YiLCJzb2xkaWVyIiwiR2l0SHViIiwiaGVhZGVyIiwiYmFyIiwiY3JlYXRlRWxlbWVudCIsImxlZnRJY29uIiwic3JjIiwiYWx0IiwidGl0bGVCb3giLCJ0aXRsZSIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyaWdodEljb24iLCJtYWluQ29udGVudCIsIm1haW4iLCJ0dXJuIiwidHVybkRpdiIsInR1cm5JbmRpY2F0b3IiLCJ0dXJuVGV4dCIsImNyZWF0ZUJvYXJkIiwiYm9hcmRUaXRsZSIsImJvYXJkR3JpZCIsImVuZW15Qm9hcmQiLCJyZXR1cm5Cb2FyZEdyaWQiLCJpc0VuZW15IiwiYXJndW1lbnRzIiwiaW5uZXJIVE1MIiwiaiIsIm5hbWUiLCJtaXNzIiwiY2hpbGRyZW4iLCJzdGFydFBhZ2UiLCJyb3RhdGVDb250YWluZXIiLCJoaWRlUG9wdXAiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImNyZWF0ZUZvb3RlciIsImZvb3RlciIsImdpdEh1YlByb2ZpbGUiLCJocmVmIiwiZ2l0SHViUHJvZmlsZUltZyIsImdpdEh1YlByb2ZpbGVUZXh0IiwiYXRTeW1ib2wiLCJ1c2VybmFtZSIsInNlcGVyYXRvciIsImdpdEh1YlJlcG8iLCJwYWdlIiwiY29sIiwibnVtSGl0cyIsImNvbnRlbnQiXSwic291cmNlUm9vdCI6IiJ9