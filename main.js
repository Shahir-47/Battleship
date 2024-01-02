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



// computer factory function
function computer() {
  var compBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(); // computer's game board
  var lastHit = null; // last hit coordinates
  var attackOptions = []; // attack options
  var isTurn = false; // is it the computer's turn?

  // choose a random attack
  function randomAttack(enemy) {
    var x;
    var y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (enemy.hitBoard[y][x] !== undefined); // keep choosing random coordinates until a valid one is found
    return {
      x: x,
      y: y
    };
  }

  // place ships randomly
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
      } while (!compBoard.canPlaceShip(ship, x, y, vertical)); // keep choosing random coordinates until a valid one is found
      compBoard.placeShip(ship, x, y, vertical);
    });
  }

  // choose an attack based on the last hit
  function targetAttack(enemy) {
    // if there are no attack options, create them
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
    // if there are no attack options, choose a random attack
    if (attackOptions.length === 0) {
      return randomAttack(enemy);
    }
    return attackOptions.shift();
  }

  // choose an attack
  function chooseAttack(enemy) {
    // if there is no last hit, choose a random attack
    if (lastHit === null) {
      return randomAttack(enemy);
    }
    return targetAttack(enemy);
  }

  // attack the player
  function attack(player) {
    var _chooseAttack = chooseAttack(player),
      x = _chooseAttack.x,
      y = _chooseAttack.y; // choose an attack
    var attackResult = player.receiveAttack(x, y); // attack the player
    // if the attack was a hit, update the last hit coordinates
    if (attackResult === "hit") {
      lastHit = {
        x: x,
        y: y
      };
    } else if (attackResult === "sunk") {
      lastHit = null; // Clear last hit
      attackOptions = []; // Clear attack options
    }
    return {
      x: x,
      y: y,
      attackResult: attackResult
    };
  }

  // receive an attack
  function receiveAttack(x, y) {
    return compBoard.receiveAttack(x, y);
  }

  // check if the computer has lost
  function hasLost() {
    return compBoard.allShipsSunk();
  }
  return {
    randomAttack: randomAttack,
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





// runs the game once the user has placed all their ships
function gameTime(userParam, compParam, gameActiveParam) {
  var user = userParam; // user object
  var comp = compParam; // computer object
  var gameActive = gameActiveParam; // is the game still active?

  comp.placeShipsAutomatically(); // place the computer's ships automatically

  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.drawBoard)(user.playerBoard.board); // draw the user's board
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.drawBoard)(comp.compBoard.board, true); // draw the computer's board

  user.isTurn = true; // user goes first
  comp.isTurn = false; // computer goes second

  // add event listeners to the enemy board
  var cells = document.querySelectorAll(".enemy .cell");
  cells.forEach(function (cell) {
    cell.addEventListener("click", function (e) {
      // if the game is not active or it is not the user's turn, do nothing
      if (!gameActive || !user.isTurn) return;
      // if the cell has already been hit, do nothing
      if (e.target.classList.contains("hit") || e.target.classList.contains("miss")) return;
      var x = e.target.dataset.x; // get the x coordinate of the cell
      var y = e.target.dataset.y; // get the y coordinate of the cell
      var xInt = parseInt(x, 10); // convert the x coordinate to an integer
      var yInt = parseInt(y, 10); // convert the y coordinate to an integer

      var result = user.attack(xInt, yInt, comp); // attack the computer
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(xInt, yInt, result, true); // update the board

      // if the computer has lost, end the game and show the popup
      if (comp.hasLost()) {
        gameActive = false; // game is no longer active
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.winner)("user"); // user won
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.showPopup)(); // show the play again popup
        return;
      }

      // computer's turn
      user.isTurn = false;
      comp.isTurn = true;
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn); // update the turn indicator text

      // computer's attack
      var _comp$attack = comp.attack(user),
        compX = _comp$attack.x,
        compY = _comp$attack.y,
        compResult = _comp$attack.attackResult;
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(compX, compY, compResult, false);

      // if the user has lost, end the game and show the popup
      if (user.hasLost()) {
        gameActive = false; // game is no longer active
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.winner)("comp"); // computer won
        (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.showPopup)(); // show the play again popup
        return;
      }

      // user's turn
      user.isTurn = true;
      comp.isTurn = false;
      (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.updateTurn)(user.isTurn); // update the turn indicator text
    });
  });
}

// starts the game by asking the user to place their ships
function playGame() {
  var gameActive = true; // the game is active
  var user = (0,_player__WEBPACK_IMPORTED_MODULE_0__["default"])(); // create the user object
  var comp = (0,_computer__WEBPACK_IMPORTED_MODULE_1__["default"])(); // create the computer object

  // get the grid cells and the rotate button
  var gridCells = document.querySelectorAll(".grid-cell");
  var rotateButton = document.querySelector(".rotate-button");
  var ships = [5, 4, 3, 3, 2]; // the ships to be placed
  var selectedShipSize = ships.shift(); // the size of the currently selected ship
  var isHorizontal = true; // Orientation of the ship

  // Check if the ship is adjacent to another ship
  function isAdjacentBlocked(startX, startY, shipSize) {
    for (var i = 0; i < shipSize; i += 1) {
      var x = !isHorizontal ? startX : startX + i; // x coordinate of the cell
      var y = isHorizontal ? startY : startY + i; // y coordinate of the cell
      // Check adjacent cells
      for (var adjX = -1; adjX <= 1; adjX += 1) {
        for (var adjY = -1; adjY <= 1; adjY += 1) {
          var neighborX = x + adjX; // x coordinate of the adjacent cell
          var neighborY = y + adjY; // y coordinate of the adjacent cell
          // Validate neighbor coordinates
          if (neighborX >= 0 && neighborX < 10 && neighborY >= 0 && neighborY < 10) {
            // if there is a ship at the adjacent cell, return true
            if (user.playerBoard.hasShipAt(neighborX, neighborY)) {
              return true;
            }
          }
        }
      }
    }
    // if there are no adjacent ships, return false
    return false;
  }

  // Highlight the cells where the ship will be placed
  function highlightCells(e, shipSize) {
    var startX = parseInt(e.target.dataset.x, 10); // x coordinate of the cell
    var startY = parseInt(e.target.dataset.y, 10); // y coordinate of the cell

    // Check if the ship is adjacent to another ship
    var isOverlapOrAdjacent = isAdjacentBlocked(startX, startY, shipSize);

    // Check if the ship is overlapping
    for (var i = 0; i < shipSize; i += 1) {
      var x = !isHorizontal ? startX : startX + i;
      var y = isHorizontal ? startY : startY + i;
      var cell = document.querySelector(".grid-cell[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      if (!cell || x >= 10 || y >= 10 || user.playerBoard.hasShipAt(x, y)) {
        isOverlapOrAdjacent = true;
        break;
      }
    }

    // Highlight the cells
    for (var _i = 0; _i < shipSize; _i += 1) {
      var _x = !isHorizontal ? startX : startX + _i;
      var _y = isHorizontal ? startY : startY + _i;
      var _cell = document.querySelector(".grid-cell[data-x=\"".concat(_x, "\"][data-y=\"").concat(_y, "\"]"));
      if (_cell) {
        _cell.classList.add(isOverlapOrAdjacent ? "overlap" : "highlight");
      }
    }
  }

  // Remove the highlight from the cells
  function removeHighlight() {
    gridCells.forEach(function (cell) {
      cell.classList.remove("highlight", "overlap");
    });
  }

  // Add event listeners to the grid cells
  gridCells.forEach(function (cell) {
    // When the mouse is over a cell, highlight the cells where the ship will be placed
    cell.addEventListener("mouseover", function (e) {
      if (selectedShipSize === -1) return;
      highlightCells(e, selectedShipSize);
    });
    cell.addEventListener("mouseout", removeHighlight); // When the mouse leaves the cell, remove the highlight

    // When the user clicks on a cell, place the ship
    cell.addEventListener("click", function () {
      var x = parseInt(cell.dataset.x, 10);
      var y = parseInt(cell.dataset.y, 10);

      // If the ship can be placed, place it
      if (user.canPlaceShip(selectedShipSize, x, y, !isHorizontal)) {
        // catch any errors
        try {
          user.placeShip((0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(selectedShipSize), x, y, !isHorizontal); // Place the ship

          // Visualize the placed ship
          for (var i = 0; i < selectedShipSize; i += 1) {
            var cellX = !isHorizontal ? x : x + i;
            var cellY = isHorizontal ? y : y + i;
            var shipCell = document.querySelector(".grid-cell[data-x=\"".concat(cellX, "\"][data-y=\"").concat(cellY, "\"]"));
            // Add the ship class to the cell
            if (shipCell) {
              shipCell.classList.add("cell-with-ship");
            }
          }
          selectedShipSize = ships.shift(); // Get the next ship size

          // If there are no more ships to place, start the game
          if (selectedShipSize === undefined) {
            selectedShipSize = -1; // No ship is selected
            removeHighlight(); // Remove the highlight from the cells
            (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.loadGame)(); // Load the game
            gameTime(user, comp, gameActive); // Start the game
          }
        } catch (error) {
          // Handle error
        }
      } else {
        // Handle invalid placement
      }
    });
  });

  // Add event listener to the rotate button
  rotateButton.addEventListener("click", function () {
    isHorizontal = !isHorizontal; // Change the orientation of the ship
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
// gameBoard factory function
function gameBoard() {
  var board = Array.from({
    length: 10
  }, function () {
    return Array.from({
      length: 10
    });
  }); // 10x10 board

  // validate coordinates
  function validateCoordinates(x, y) {
    if (typeof x !== "number" || x < 0 || x > 9) throw new Error("x must be between 0 and 9");
    if (typeof y !== "number" || y < 0 || y > 9) throw new Error("y must be between 0 and 9");
  }

  // check if a ship can be placed at the given coordinates
  function canPlaceShip(ship, x, y, isVertical) {
    validateCoordinates(x, y); // validate coordinates
    if (typeof isVertical !== "boolean")
      // validate isVertical
      throw new Error("isVertical must be a boolean");
    var length = ship.length - 1; // get length of ship
    var maxX = isVertical ? x : x + length; // get max x coordinate
    var maxY = isVertical ? y + length : y; // get max y coordinate

    if (maxX > 9 || maxY > 9) return false; // check if ship is out of bounds

    // Check if ship is overlapping or adjacent to another ship
    for (var i = 0; i <= length; i += 1) {
      var checkX = isVertical ? x : x + i; // x coordinate of the cell
      var checkY = isVertical ? y + i : y; // y coordinate of the cell
      if (board[checkY][checkX] !== undefined) return false; // check if cell is occupied

      // Check adjacent cells
      for (var adjX = -1; adjX <= 1; adjX += 1) {
        for (var adjY = -1; adjY <= 1; adjY += 1) {
          var neighborX = checkX + adjX; // x coordinate of the adjacent cell
          var neighborY = checkY + adjY; // y coordinate of the adjacent cell

          // Validate neighbor coordinates
          if (neighborX >= 0 && neighborX < 10 && neighborY >= 0 && neighborY < 10) {
            // Check if there is a ship at the adjacent cell
            if (board[neighborY][neighborX] !== undefined) {
              return false; // return false if ship is adjacent to another ship
            }
          }
        }
      }
    }
    return true; // return true if ship can be placed
  }

  // place a ship at the given coordinates
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

  // check if there is a ship at the given coordinates
  function hasShipAt(x, y) {
    return board[y][x] !== undefined;
  }

  // receive an attack at the given coordinates
  function receiveAttack(x, y) {
    validateCoordinates(x, y); // validate coordinates
    // return "miss" if there is no ship at the given coordinates
    if (board[y][x] === undefined) {
      board[y][x] = "miss";
      return "miss";
    }
    board[y][x].hit(); // hit the ship
    // return "sunk" if the ship is sunk
    if (board[y][x].sunk) return "sunk";
    return "hit"; // return "hit" if the ship is hit
  }

  // check if all ships are sunk
  function allShipsSunk() {
    // return true if all cells are empty, "miss", or "sunk"
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
/* harmony export */   drawBoard: () => (/* binding */ drawBoard),
/* harmony export */   hidePopup: () => (/* binding */ hidePopup),
/* harmony export */   loadGame: () => (/* binding */ loadGame),
/* harmony export */   page: () => (/* binding */ page),
/* harmony export */   showPopup: () => (/* binding */ showPopup),
/* harmony export */   updateBoard: () => (/* binding */ updateBoard),
/* harmony export */   updateTurn: () => (/* binding */ updateTurn),
/* harmony export */   winner: () => (/* binding */ winner)
/* harmony export */ });
/* harmony import */ var _img_soldier_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./img/soldier.svg */ "./src/img/soldier.svg");
/* harmony import */ var _img_git_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./img/git.svg */ "./src/img/git.svg");



// Create the header
function header() {
  var bar = document.createElement("div");
  bar.classList.add("nav-bar");
  var leftIcon = document.createElement("img");
  leftIcon.classList.add("icon");
  leftIcon.src = _img_soldier_svg__WEBPACK_IMPORTED_MODULE_0__;
  leftIcon.alt = "soldier";
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

// Create the main content
function mainContent() {
  var main = document.createElement("div");
  main.classList.add("main-content");
  document.querySelector("div#content").appendChild(main);
}

// Create the turn indicator
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

// Create the board container
function createBoard() {
  var board = document.createElement("div");
  board.classList.add("board");
  document.querySelector("div.main-content").appendChild(board);
}

// Create the player board
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

// Create the enemy board
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

// Return the board grid
function returnBoardGrid(enemy) {
  var boardGrid;
  if (enemy) {
    boardGrid = document.querySelector("div.enemy div.board-grid");
  } else {
    boardGrid = document.querySelector("div.player div.board-grid");
  }
  return boardGrid;
}

// Draw the board
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

// add miss class to the cell
function miss(x, y, enemy) {
  var boardGrid = returnBoardGrid(enemy);
  var cell = boardGrid.children[y * 10 + x];
  cell.classList.add("miss");
}

// add hit class to the cell
function hit(x, y, enemy) {
  var boardGrid = returnBoardGrid(enemy);
  var cell = boardGrid.children[y * 10 + x];
  cell.classList.add("hit");
}

// update the board after an attack
function updateBoard(x, y, result, enemy) {
  if (result === "miss") {
    miss(x, y, enemy);
  } else {
    hit(x, y, enemy);
  }
}

// shows the start page
function startPage() {
  var main = document.querySelector("div.main-content");
  main.innerHTML = ""; // clear the main content
  turn(); // create the turn indicator
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

// load the game
function loadGame() {
  var main = document.querySelector("div.main-content");
  main.innerHTML = "";
  turn(); // create the turn indicator
  createBoard(); // create the board container
  playerBoard(); // create the player board
  enemyBoard(); // create the enemy board
}

// update the turn indicator text
function updateTurn(isTurn) {
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.textContent = isTurn ? "Your Turn" : "Computer's Turn";
}

// show the winner
function winner(player) {
  var turnText = document.querySelector("div.turn-indicator p");
  turnText.textContent = "".concat(player, " won!");
}

// hide the play again popup
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

// Create the page
function page() {
  header();
  mainContent();
  startPage();
  createFooter();
}

// show the play again popup
function showPopup() {
  document.getElementById("playAgainPopup").style.display = "block";
}


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


// player factory function
function player() {
  var playerBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(); // player's game board
  // player's hit board (to keep track of hits and misses)
  var hitBoard = Array.from({
    length: 10
  }, function () {
    return Array.from({
      length: 10
    });
  });
  var isTurn = false; // is it the player's turn?

  // place a ship on the board
  function placeShip(ship, row, col, vertical) {
    playerBoard.placeShip(ship, row, col, vertical);
  }

  // check if a ship can be placed at the given coordinates
  function canPlaceShip(ship, row, col, vertical) {
    return playerBoard.canPlaceShip(ship, row, col, vertical);
  }

  // receive an attack at the given coordinates
  function receiveAttack(row, col) {
    var result = playerBoard.receiveAttack(row, col);
    if (result === "hit") {
      hitBoard[col][row] = "hit";
    } else if (result === "sunk") {
      hitBoard[col][row] = "sunk";
    } else {
      hitBoard[col][row] = "miss";
    }
    return result;
  }

  // attack the enemy at the given coordinates
  function attack(row, col, enemy) {
    return enemy.receiveAttack(row, col);
  }

  // check if all ships are sunk
  function hasLost() {
    return playerBoard.allShipsSunk();
  }
  return {
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
  var numHits = 0; // number of hits on the ship
  var sunk = false; // whether the ship is sunk

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
	background-color: red;
	cursor: not-allowed;
}

.header h1 {
	text-align: center;
	font-family: "Arial", sans-serif;
	font-size: 39px;
	color: #ffffff87;
	background-color: #19211a;
	padding: 20px;
	text-transform: uppercase;
	letter-spacing: 2px;
	margin: 0px;
	text-shadow: 2px 2px 2px #737373;
}

.header h1:hover {
	color: #849177;
	cursor: pointer;
}

.icon {
	width: 4rem;
	height: auto;
}

.turn-indicator {
	width: 60%;
	height: 100%;
	border-radius: 1rem;
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
	font-family: "Arial", sans-serif;
	text-transform: uppercase;
	letter-spacing: 2px;
	margin-bottom: 30px;
	text-shadow: 4px 3px 0px #65715973;
	margin: 0;
	transition: opacity 0.5s ease-in-out;
	opacity: 1;
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
	background-color: #2c7235;
	color: #ffffff87;
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

.cell {
	cursor: pointer;
}

.cell.highlight {
	background-color: lightblue;
}

div.cell.blocked {
	background-color: red;
	cursor: not-allowed;
}

.cell-with-ship {
	background-color: #4caf50;
	border: 1px solid #ffffff87;
}

div.board-grid .cell.cell-with-ship {
	border: 1px solid #ffffff87;
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
`, "",{"version":3,"sources":["webpack://./src/css/game.css"],"names":[],"mappings":"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","sourcesContent":["body {\n\t--sidebar-bg-color: #19211a;\n\tbackground-color: #19211a;\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n\tcolor: #dddddd;\n}\n\ndiv#content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-evenly;\n\talign-items: stretch;\n\theight: 100vh;\n}\n\n.nav-bar {\n\tbackground-color: var(--sidebar-bg-color);\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 5rem;\n\tpadding: 0 1rem;\n\tpadding-top: 0.25rem;\n}\n\n.main-content {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\tgap: 1rem;\n\tpadding: 0 1rem;\n}\n\n.cell.overlap {\n\tbackground-color: red;\n\tcursor: not-allowed;\n}\n\n.header h1 {\n\ttext-align: center;\n\tfont-family: \"Arial\", sans-serif;\n\tfont-size: 39px;\n\tcolor: #ffffff87;\n\tbackground-color: #19211a;\n\tpadding: 20px;\n\ttext-transform: uppercase;\n\tletter-spacing: 2px;\n\tmargin: 0px;\n\ttext-shadow: 2px 2px 2px #737373;\n}\n\n.header h1:hover {\n\tcolor: #849177;\n\tcursor: pointer;\n}\n\n.icon {\n\twidth: 4rem;\n\theight: auto;\n}\n\n.turn-indicator {\n\twidth: 60%;\n\theight: 100%;\n\tborder-radius: 1rem;\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #ffffff87;\n\tbackground: -moz-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbackground: -webkit-linear-gradient(\n\t\t-45deg,\n\t\t#cdcaca87 0%,\n\t\t#ffffff87 50%,\n\t\t#cdcdcda6 100%\n\t);\n\tbox-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);\n}\n.turn-indicator p {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tcolor: #19211a;\n\tfont-family: \"Arial\", sans-serif;\n\ttext-transform: uppercase;\n\tletter-spacing: 2px;\n\tmargin-bottom: 30px;\n\ttext-shadow: 4px 3px 0px #65715973;\n\tmargin: 0;\n\ttransition: opacity 0.5s ease-in-out;\n\topacity: 1;\n}\n\n.rotate-container {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n#playAgainButton,\n.rotate-button {\n\tbackground-color: #506052;\n\tcolor: #c1c1c1d6;\n\tborder: 2px solid #929392;\n\tpadding: 10px 20px;\n\tborder-radius: 5px;\n\tfont-weight: bold;\n\tcursor: pointer;\n\ttransition:\n\t\ttransform 0.3s ease,\n\t\tbackground-color 0.3s ease;\n}\n\n#playAgainButton:hover,\n.rotate-button:hover {\n\tbackground-color: #2c7235;\n\tcolor: #ffffff87;\n}\n\n.board {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(2, 1fr);\n\tgap: 1rem;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\n.cell {\n\tcursor: pointer;\n}\n\n.cell.highlight {\n\tbackground-color: lightblue;\n}\n\ndiv.cell.blocked {\n\tbackground-color: red;\n\tcursor: not-allowed;\n}\n\n.cell-with-ship {\n\tbackground-color: #4caf50;\n\tborder: 1px solid #ffffff87;\n}\n\ndiv.board-grid .cell.cell-with-ship {\n\tborder: 1px solid #ffffff87;\n}\n\n.board h2 {\n\tmargin: 0;\n}\n\n.turn-div {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n}\n\ndiv.board-grid {\n\tdisplay: grid;\n\tgrid-template: repeat(10, 2.3vw) / repeat(10, 2.3vw);\n\ttext-align: center;\n\tgap: 2px;\n\talign-items: center;\n\tjustify-items: center;\n\tjustify-content: center;\n\talign-content: center;\n}\n\ndiv.board-grid .cell {\n\tborder: 1px solid white;\n\theight: 100%;\n\twidth: 100%;\n\ttransition: all 0.3s ease 0s;\n}\n\n.enemy,\n.player {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n}\n\n.ship {\n\tbackground-color: #1e90ff;\n}\n\n.miss {\n\tbackground-color: #ff000087;\n}\n\ndiv.cell.hit {\n\tbackground-color: #00ff1e87;\n\tborder: 1px solid #00ff1e87;\n}\n\n.popup {\n\tdisplay: none;\n\tposition: fixed;\n\tleft: 50%;\n\ttop: 50%;\n\ttransform: translate(-50%, -50%);\n\tbackground-color: transparent;\n\tcolor: #dddddd;\n\tpadding: 20px;\n\tz-index: 1000; /* Ensure it's above other content */\n}\n\n.popup-content {\n\ttext-align: center;\n}\n\n.popup-content p {\n\tfont-size: 1rem;\n\tfont-weight: 900;\n}\n\n/* --------------------------------------- Footer ------------------------------------------------------- */\n\nfooter {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tgap: 1rem;\n\twidth: 100%;\n\theight: 2.5rem;\n\tpadding: 1rem 0;\n\tpadding-bottom: 0.5rem;\n}\n\nfooter a {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 0.5rem;\n\ttext-decoration: none;\n\tfont-size: 1.3rem;\n\tfont-weight: 100;\n\tcolor: #969292;\n\tfont-family:\n\t\tjedi solid,\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n}\n\nfooter p {\n\tmargin: 0.5rem 0;\n}\n\nfooter a:hover,\nfooter a:active {\n\tcolor: #fff;\n}\n\nfooter a:hover img,\nfooter a:active img {\n\tfilter: brightness(99);\n}\n\n.at-symbol {\n\tfont-weight: 900;\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system,\n\t\tBlinkMacSystemFont,\n\t\t\"Segoe UI\",\n\t\tRoboto,\n\t\tOxygen,\n\t\tUbuntu,\n\t\tCantarell,\n\t\t\"Open Sans\",\n\t\t\"Helvetica Neue\",\n\t\tsans-serif;\n}\n\nfooter img {\n\twidth: 2rem;\n\theight: auto;\n}\n"],"sourceRoot":""}]);
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
/* harmony import */ var _css_normalize_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css/normalize.css */ "./src/css/normalize.css");
/* harmony import */ var _css_game_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/game.css */ "./src/css/game.css");
/* harmony import */ var _gameUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameUI */ "./src/gameUI.js");




(0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.page)(); // show the start page
(0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])(); // start the game

// add event listener to the play again button
document.getElementById("playAgainButton").addEventListener("click", function () {
  // Code to reset the game and start again
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.hidePopup)(); // hide the play again popup
  var content = document.querySelector("div#content"); // get the content div
  content.innerHTML = ""; // clear the content div
  (0,_gameUI__WEBPACK_IMPORTED_MODULE_3__.page)(); // show the start page
  (0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])(); // start the game
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtRkFBbUYsWUFBWSxhQUFhLFdBQVcsVUFBVSxlQUFlLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLFVBQVUsS0FBSyxTQUFTLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLE1BQU0sT0FBTyxPQUFPLE1BQU0sWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVks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SyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLHVCQUF1QixPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIsT0FBTyxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQix1QkFBdUIsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLE1BQU0sWUFBWSxPQUFPLE9BQU8sTUFBTSxPQUFPLHNCQUFzQixxQkFBcUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxNQUFNLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxRQUFRLFFBQVEsTUFBTSxTQUFTLHNCQUFzQixxQkFBcUIsdUJBQXVCLHFCQUFxQixPQUFPLE9BQU8sTUFBTSxNQUFNLFVBQVUsWUFBWSxPQUFPLE9BQU8sTUFBTSxNQUFNLFVBQVUsWUFBWSxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksT0FBTyxNQUFNLE1BQU0sUUFBUSxZQUFZLFdBQVcsTUFBTSxNQUFNLE1BQU0sUUFBUSxZQUFZLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLFNBQVMsTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIscUJBQXFCLHFCQUFxQixxQkFBcUIsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLE1BQU0sTUFBTSxzQkFBc0IscUJBQXFCLE9BQU8sTUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFNLE9BQU8sTUFBTSxLQUFLLHNCQUFzQix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixP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L2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3M/YTNjZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzPzZkNTQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIGNvbXB1dGVyIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIGNvbXB1dGVyKCkge1xuXHRjb25zdCBjb21wQm9hcmQgPSBnYW1lQm9hcmQoKTsgLy8gY29tcHV0ZXIncyBnYW1lIGJvYXJkXG5cdGxldCBsYXN0SGl0ID0gbnVsbDsgLy8gbGFzdCBoaXQgY29vcmRpbmF0ZXNcblx0bGV0IGF0dGFja09wdGlvbnMgPSBbXTsgLy8gYXR0YWNrIG9wdGlvbnNcblx0bGV0IGlzVHVybiA9IGZhbHNlOyAvLyBpcyBpdCB0aGUgY29tcHV0ZXIncyB0dXJuP1xuXG5cdC8vIGNob29zZSBhIHJhbmRvbSBhdHRhY2tcblx0ZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG5cdFx0bGV0IHg7XG5cdFx0bGV0IHk7XG5cdFx0ZG8ge1xuXHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0fSB3aGlsZSAoZW5lbXkuaGl0Qm9hcmRbeV1beF0gIT09IHVuZGVmaW5lZCk7IC8vIGtlZXAgY2hvb3NpbmcgcmFuZG9tIGNvb3JkaW5hdGVzIHVudGlsIGEgdmFsaWQgb25lIGlzIGZvdW5kXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xuXHR9XG5cblx0Ly8gcGxhY2Ugc2hpcHMgcmFuZG9tbHlcblx0ZnVuY3Rpb24gcGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKSB7XG5cdFx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cdFx0c2hpcHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG5cdFx0XHRsZXQgeDtcblx0XHRcdGxldCB5O1xuXHRcdFx0bGV0IHZlcnRpY2FsO1xuXHRcdFx0Y29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoKTtcblx0XHRcdGRvIHtcblx0XHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0eSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0dmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0fSB3aGlsZSAoIWNvbXBCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpKTsgLy8ga2VlcCBjaG9vc2luZyByYW5kb20gY29vcmRpbmF0ZXMgdW50aWwgYSB2YWxpZCBvbmUgaXMgZm91bmRcblx0XHRcdGNvbXBCb2FyZC5wbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gY2hvb3NlIGFuIGF0dGFjayBiYXNlZCBvbiB0aGUgbGFzdCBoaXRcblx0ZnVuY3Rpb24gdGFyZ2V0QXR0YWNrKGVuZW15KSB7XG5cdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIGF0dGFjayBvcHRpb25zLCBjcmVhdGUgdGhlbVxuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9ucyA9IFtcblx0XHRcdFx0WzEsIDBdLFxuXHRcdFx0XHRbLTEsIDBdLFxuXHRcdFx0XHRbMCwgMV0sXG5cdFx0XHRcdFswLCAtMV0sXG5cdFx0XHRdO1xuXHRcdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKChkaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgbmV3WCA9IGxhc3RIaXQueCArIGRpclswXTtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IGxhc3RIaXQueSArIGRpclsxXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPCAxMCAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPCAxMCAmJlxuXHRcdFx0XHRcdGVuZW15LmhpdEJvYXJkW25ld1ldW25ld1hdID09PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXR0YWNrT3B0aW9ucy5wdXNoKHsgeDogbmV3WCwgeTogbmV3WSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIGlmIHRoZXJlIGFyZSBubyBhdHRhY2sgb3B0aW9ucywgY2hvb3NlIGEgcmFuZG9tIGF0dGFja1xuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHJhbmRvbUF0dGFjayhlbmVteSk7XG5cdFx0fVxuXHRcdHJldHVybiBhdHRhY2tPcHRpb25zLnNoaWZ0KCk7XG5cdH1cblxuXHQvLyBjaG9vc2UgYW4gYXR0YWNrXG5cdGZ1bmN0aW9uIGNob29zZUF0dGFjayhlbmVteSkge1xuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIGxhc3QgaGl0LCBjaG9vc2UgYSByYW5kb20gYXR0YWNrXG5cdFx0aWYgKGxhc3RIaXQgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiByYW5kb21BdHRhY2soZW5lbXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGFyZ2V0QXR0YWNrKGVuZW15KTtcblx0fVxuXG5cdC8vIGF0dGFjayB0aGUgcGxheWVyXG5cdGZ1bmN0aW9uIGF0dGFjayhwbGF5ZXIpIHtcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNob29zZUF0dGFjayhwbGF5ZXIpOyAvLyBjaG9vc2UgYW4gYXR0YWNrXG5cdFx0Y29uc3QgYXR0YWNrUmVzdWx0ID0gcGxheWVyLnJlY2VpdmVBdHRhY2soeCwgeSk7IC8vIGF0dGFjayB0aGUgcGxheWVyXG5cdFx0Ly8gaWYgdGhlIGF0dGFjayB3YXMgYSBoaXQsIHVwZGF0ZSB0aGUgbGFzdCBoaXQgY29vcmRpbmF0ZXNcblx0XHRpZiAoYXR0YWNrUmVzdWx0ID09PSBcImhpdFwiKSB7XG5cdFx0XHRsYXN0SGl0ID0geyB4LCB5IH07XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRsYXN0SGl0ID0gbnVsbDsgLy8gQ2xlYXIgbGFzdCBoaXRcblx0XHRcdGF0dGFja09wdGlvbnMgPSBbXTsgLy8gQ2xlYXIgYXR0YWNrIG9wdGlvbnNcblx0XHR9XG5cdFx0cmV0dXJuIHsgeCwgeSwgYXR0YWNrUmVzdWx0IH07XG5cdH1cblxuXHQvLyByZWNlaXZlIGFuIGF0dGFja1xuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdH1cblxuXHQvLyBjaGVjayBpZiB0aGUgY29tcHV0ZXIgaGFzIGxvc3Rcblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRyYW5kb21BdHRhY2ssXG5cdFx0cGxhY2VTaGlwc0F1dG9tYXRpY2FsbHksXG5cdFx0YXR0YWNrLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0aGFzTG9zdCxcblx0XHRjaG9vc2VBdHRhY2ssXG5cdFx0Z2V0IGlzVHVybigpIHtcblx0XHRcdHJldHVybiBpc1R1cm47XG5cdFx0fSxcblx0XHRzZXQgaXNUdXJuKHZhbHVlKSB7XG5cdFx0XHRpc1R1cm4gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGdldCBjb21wQm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gY29tcEJvYXJkO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBjb21wdXRlciBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHtcblx0ZHJhd0JvYXJkLFxuXHR1cGRhdGVCb2FyZCxcblx0dXBkYXRlVHVybixcblx0bG9hZEdhbWUsXG5cdHdpbm5lcixcblx0c2hvd1BvcHVwLFxufSBmcm9tIFwiLi9nYW1lVUlcIjtcblxuLy8gcnVucyB0aGUgZ2FtZSBvbmNlIHRoZSB1c2VyIGhhcyBwbGFjZWQgYWxsIHRoZWlyIHNoaXBzXG5mdW5jdGlvbiBnYW1lVGltZSh1c2VyUGFyYW0sIGNvbXBQYXJhbSwgZ2FtZUFjdGl2ZVBhcmFtKSB7XG5cdGNvbnN0IHVzZXIgPSB1c2VyUGFyYW07IC8vIHVzZXIgb2JqZWN0XG5cdGNvbnN0IGNvbXAgPSBjb21wUGFyYW07IC8vIGNvbXB1dGVyIG9iamVjdFxuXHRsZXQgZ2FtZUFjdGl2ZSA9IGdhbWVBY3RpdmVQYXJhbTsgLy8gaXMgdGhlIGdhbWUgc3RpbGwgYWN0aXZlP1xuXG5cdGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTsgLy8gcGxhY2UgdGhlIGNvbXB1dGVyJ3Mgc2hpcHMgYXV0b21hdGljYWxseVxuXG5cdGRyYXdCb2FyZCh1c2VyLnBsYXllckJvYXJkLmJvYXJkKTsgLy8gZHJhdyB0aGUgdXNlcidzIGJvYXJkXG5cdGRyYXdCb2FyZChjb21wLmNvbXBCb2FyZC5ib2FyZCwgdHJ1ZSk7IC8vIGRyYXcgdGhlIGNvbXB1dGVyJ3MgYm9hcmRcblxuXHR1c2VyLmlzVHVybiA9IHRydWU7IC8vIHVzZXIgZ29lcyBmaXJzdFxuXHRjb21wLmlzVHVybiA9IGZhbHNlOyAvLyBjb21wdXRlciBnb2VzIHNlY29uZFxuXG5cdC8vIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGVuZW15IGJvYXJkXG5cdGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbmVteSAuY2VsbFwiKTtcblx0Y2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG5cdFx0XHQvLyBpZiB0aGUgZ2FtZSBpcyBub3QgYWN0aXZlIG9yIGl0IGlzIG5vdCB0aGUgdXNlcidzIHR1cm4sIGRvIG5vdGhpbmdcblx0XHRcdGlmICghZ2FtZUFjdGl2ZSB8fCAhdXNlci5pc1R1cm4pIHJldHVybjtcblx0XHRcdC8vIGlmIHRoZSBjZWxsIGhhcyBhbHJlYWR5IGJlZW4gaGl0LCBkbyBub3RoaW5nXG5cdFx0XHRpZiAoXG5cdFx0XHRcdGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSB8fFxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpXG5cdFx0XHQpXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdGNvbnN0IHsgeCB9ID0gZS50YXJnZXQuZGF0YXNldDsgLy8gZ2V0IHRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IHsgeSB9ID0gZS50YXJnZXQuZGF0YXNldDsgLy8gZ2V0IHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IHhJbnQgPSBwYXJzZUludCh4LCAxMCk7IC8vIGNvbnZlcnQgdGhlIHggY29vcmRpbmF0ZSB0byBhbiBpbnRlZ2VyXG5cdFx0XHRjb25zdCB5SW50ID0gcGFyc2VJbnQoeSwgMTApOyAvLyBjb252ZXJ0IHRoZSB5IGNvb3JkaW5hdGUgdG8gYW4gaW50ZWdlclxuXG5cdFx0XHRjb25zdCByZXN1bHQgPSB1c2VyLmF0dGFjayh4SW50LCB5SW50LCBjb21wKTsgLy8gYXR0YWNrIHRoZSBjb21wdXRlclxuXHRcdFx0dXBkYXRlQm9hcmQoeEludCwgeUludCwgcmVzdWx0LCB0cnVlKTsgLy8gdXBkYXRlIHRoZSBib2FyZFxuXG5cdFx0XHQvLyBpZiB0aGUgY29tcHV0ZXIgaGFzIGxvc3QsIGVuZCB0aGUgZ2FtZSBhbmQgc2hvdyB0aGUgcG9wdXBcblx0XHRcdGlmIChjb21wLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7IC8vIGdhbWUgaXMgbm8gbG9uZ2VyIGFjdGl2ZVxuXHRcdFx0XHR3aW5uZXIoXCJ1c2VyXCIpOyAvLyB1c2VyIHdvblxuXHRcdFx0XHRzaG93UG9wdXAoKTsgLy8gc2hvdyB0aGUgcGxheSBhZ2FpbiBwb3B1cFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbXB1dGVyJ3MgdHVyblxuXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdGNvbXAuaXNUdXJuID0gdHJ1ZTtcblx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pOyAvLyB1cGRhdGUgdGhlIHR1cm4gaW5kaWNhdG9yIHRleHRcblxuXHRcdFx0Ly8gY29tcHV0ZXIncyBhdHRhY2tcblx0XHRcdGNvbnN0IHtcblx0XHRcdFx0eDogY29tcFgsXG5cdFx0XHRcdHk6IGNvbXBZLFxuXHRcdFx0XHRhdHRhY2tSZXN1bHQ6IGNvbXBSZXN1bHQsXG5cdFx0XHR9ID0gY29tcC5hdHRhY2sodXNlcik7XG5cdFx0XHR1cGRhdGVCb2FyZChjb21wWCwgY29tcFksIGNvbXBSZXN1bHQsIGZhbHNlKTtcblxuXHRcdFx0Ly8gaWYgdGhlIHVzZXIgaGFzIGxvc3QsIGVuZCB0aGUgZ2FtZSBhbmQgc2hvdyB0aGUgcG9wdXBcblx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7IC8vIGdhbWUgaXMgbm8gbG9uZ2VyIGFjdGl2ZVxuXHRcdFx0XHR3aW5uZXIoXCJjb21wXCIpOyAvLyBjb21wdXRlciB3b25cblx0XHRcdFx0c2hvd1BvcHVwKCk7IC8vIHNob3cgdGhlIHBsYXkgYWdhaW4gcG9wdXBcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1c2VyJ3MgdHVyblxuXHRcdFx0dXNlci5pc1R1cm4gPSB0cnVlO1xuXHRcdFx0Y29tcC5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pOyAvLyB1cGRhdGUgdGhlIHR1cm4gaW5kaWNhdG9yIHRleHRcblx0XHR9KTtcblx0fSk7XG59XG5cbi8vIHN0YXJ0cyB0aGUgZ2FtZSBieSBhc2tpbmcgdGhlIHVzZXIgdG8gcGxhY2UgdGhlaXIgc2hpcHNcbmZ1bmN0aW9uIHBsYXlHYW1lKCkge1xuXHRjb25zdCBnYW1lQWN0aXZlID0gdHJ1ZTsgLy8gdGhlIGdhbWUgaXMgYWN0aXZlXG5cdGNvbnN0IHVzZXIgPSBwbGF5ZXIoKTsgLy8gY3JlYXRlIHRoZSB1c2VyIG9iamVjdFxuXHRjb25zdCBjb21wID0gY29tcHV0ZXIoKTsgLy8gY3JlYXRlIHRoZSBjb21wdXRlciBvYmplY3RcblxuXHQvLyBnZXQgdGhlIGdyaWQgY2VsbHMgYW5kIHRoZSByb3RhdGUgYnV0dG9uXG5cdGNvbnN0IGdyaWRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1jZWxsXCIpO1xuXHRjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idXR0b25cIik7XG5cdGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdOyAvLyB0aGUgc2hpcHMgdG8gYmUgcGxhY2VkXG5cdGxldCBzZWxlY3RlZFNoaXBTaXplID0gc2hpcHMuc2hpZnQoKTsgLy8gdGhlIHNpemUgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBzaGlwXG5cdGxldCBpc0hvcml6b250YWwgPSB0cnVlOyAvLyBPcmllbnRhdGlvbiBvZiB0aGUgc2hpcFxuXG5cdC8vIENoZWNrIGlmIHRoZSBzaGlwIGlzIGFkamFjZW50IHRvIGFub3RoZXIgc2hpcFxuXHRmdW5jdGlvbiBpc0FkamFjZW50QmxvY2tlZChzdGFydFgsIHN0YXJ0WSwgc2hpcFNpemUpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHggPSAhaXNIb3Jpem9udGFsID8gc3RhcnRYIDogc3RhcnRYICsgaTsgLy8geCBjb29yZGluYXRlIG9mIHRoZSBjZWxsXG5cdFx0XHRjb25zdCB5ID0gaXNIb3Jpem9udGFsID8gc3RhcnRZIDogc3RhcnRZICsgaTsgLy8geSBjb29yZGluYXRlIG9mIHRoZSBjZWxsXG5cdFx0XHQvLyBDaGVjayBhZGphY2VudCBjZWxsc1xuXHRcdFx0Zm9yIChsZXQgYWRqWCA9IC0xOyBhZGpYIDw9IDE7IGFkalggKz0gMSkge1xuXHRcdFx0XHRmb3IgKGxldCBhZGpZID0gLTE7IGFkalkgPD0gMTsgYWRqWSArPSAxKSB7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JYID0geCArIGFkalg7IC8vIHggY29vcmRpbmF0ZSBvZiB0aGUgYWRqYWNlbnQgY2VsbFxuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWSA9IHkgKyBhZGpZOyAvLyB5IGNvb3JkaW5hdGUgb2YgdGhlIGFkamFjZW50IGNlbGxcblx0XHRcdFx0XHQvLyBWYWxpZGF0ZSBuZWlnaGJvciBjb29yZGluYXRlc1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPCAxMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA8IDEwXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHQvLyBpZiB0aGVyZSBpcyBhIHNoaXAgYXQgdGhlIGFkamFjZW50IGNlbGwsIHJldHVybiB0cnVlXG5cdFx0XHRcdFx0XHRpZiAodXNlci5wbGF5ZXJCb2FyZC5oYXNTaGlwQXQobmVpZ2hib3JYLCBuZWlnaGJvclkpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBpZiB0aGVyZSBhcmUgbm8gYWRqYWNlbnQgc2hpcHMsIHJldHVybiBmYWxzZVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIEhpZ2hsaWdodCB0aGUgY2VsbHMgd2hlcmUgdGhlIHNoaXAgd2lsbCBiZSBwbGFjZWRcblx0ZnVuY3Rpb24gaGlnaGxpZ2h0Q2VsbHMoZSwgc2hpcFNpemUpIHtcblx0XHRjb25zdCBzdGFydFggPSBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LngsIDEwKTsgLy8geCBjb29yZGluYXRlIG9mIHRoZSBjZWxsXG5cdFx0Y29uc3Qgc3RhcnRZID0gcGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC55LCAxMCk7IC8vIHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VsbFxuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHNoaXAgaXMgYWRqYWNlbnQgdG8gYW5vdGhlciBzaGlwXG5cdFx0bGV0IGlzT3ZlcmxhcE9yQWRqYWNlbnQgPSBpc0FkamFjZW50QmxvY2tlZChzdGFydFgsIHN0YXJ0WSwgc2hpcFNpemUpO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHNoaXAgaXMgb3ZlcmxhcHBpbmdcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHggPSAhaXNIb3Jpem9udGFsID8gc3RhcnRYIDogc3RhcnRYICsgaTtcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFjZWxsIHx8IHggPj0gMTAgfHwgeSA+PSAxMCB8fCB1c2VyLnBsYXllckJvYXJkLmhhc1NoaXBBdCh4LCB5KSkge1xuXHRcdFx0XHRpc092ZXJsYXBPckFkamFjZW50ID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSGlnaGxpZ2h0IHRoZSBjZWxsc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcblx0XHRcdCk7XG5cdFx0XHRpZiAoY2VsbCkge1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoaXNPdmVybGFwT3JBZGphY2VudCA/IFwib3ZlcmxhcFwiIDogXCJoaWdobGlnaHRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIHRoZSBoaWdobGlnaHQgZnJvbSB0aGUgY2VsbHNcblx0ZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KCkge1xuXHRcdGdyaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIiwgXCJvdmVybGFwXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgZ3JpZCBjZWxsc1xuXHRncmlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdC8vIFdoZW4gdGhlIG1vdXNlIGlzIG92ZXIgYSBjZWxsLCBoaWdobGlnaHQgdGhlIGNlbGxzIHdoZXJlIHRoZSBzaGlwIHdpbGwgYmUgcGxhY2VkXG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB7XG5cdFx0XHRpZiAoc2VsZWN0ZWRTaGlwU2l6ZSA9PT0gLTEpIHJldHVybjtcblx0XHRcdGhpZ2hsaWdodENlbGxzKGUsIHNlbGVjdGVkU2hpcFNpemUpO1xuXHRcdH0pO1xuXG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgcmVtb3ZlSGlnaGxpZ2h0KTsgLy8gV2hlbiB0aGUgbW91c2UgbGVhdmVzIHRoZSBjZWxsLCByZW1vdmUgdGhlIGhpZ2hsaWdodFxuXG5cdFx0Ly8gV2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYSBjZWxsLCBwbGFjZSB0aGUgc2hpcFxuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnN0IHggPSBwYXJzZUludChjZWxsLmRhdGFzZXQueCwgMTApO1xuXHRcdFx0Y29uc3QgeSA9IHBhcnNlSW50KGNlbGwuZGF0YXNldC55LCAxMCk7XG5cblx0XHRcdC8vIElmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQsIHBsYWNlIGl0XG5cdFx0XHRpZiAodXNlci5jYW5QbGFjZVNoaXAoc2VsZWN0ZWRTaGlwU2l6ZSwgeCwgeSwgIWlzSG9yaXpvbnRhbCkpIHtcblx0XHRcdFx0Ly8gY2F0Y2ggYW55IGVycm9yc1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHVzZXIucGxhY2VTaGlwKGNyZWF0ZVNoaXAoc2VsZWN0ZWRTaGlwU2l6ZSksIHgsIHksICFpc0hvcml6b250YWwpOyAvLyBQbGFjZSB0aGUgc2hpcFxuXG5cdFx0XHRcdFx0Ly8gVmlzdWFsaXplIHRoZSBwbGFjZWQgc2hpcFxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRTaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsWCA9ICFpc0hvcml6b250YWwgPyB4IDogeCArIGk7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsWSA9IGlzSG9yaXpvbnRhbCA/IHkgOiB5ICsgaTtcblx0XHRcdFx0XHRcdGNvbnN0IHNoaXBDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHtjZWxsWH1cIl1bZGF0YS15PVwiJHtjZWxsWX1cIl1gLFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdC8vIEFkZCB0aGUgc2hpcCBjbGFzcyB0byB0aGUgY2VsbFxuXHRcdFx0XHRcdFx0aWYgKHNoaXBDZWxsKSB7XG5cdFx0XHRcdFx0XHRcdHNoaXBDZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsLXdpdGgtc2hpcFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZWxlY3RlZFNoaXBTaXplID0gc2hpcHMuc2hpZnQoKTsgLy8gR2V0IHRoZSBuZXh0IHNoaXAgc2l6ZVxuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UsIHN0YXJ0IHRoZSBnYW1lXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkU2hpcFNpemUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRTaGlwU2l6ZSA9IC0xOyAvLyBObyBzaGlwIGlzIHNlbGVjdGVkXG5cdFx0XHRcdFx0XHRyZW1vdmVIaWdobGlnaHQoKTsgLy8gUmVtb3ZlIHRoZSBoaWdobGlnaHQgZnJvbSB0aGUgY2VsbHNcblx0XHRcdFx0XHRcdGxvYWRHYW1lKCk7IC8vIExvYWQgdGhlIGdhbWVcblx0XHRcdFx0XHRcdGdhbWVUaW1lKHVzZXIsIGNvbXAsIGdhbWVBY3RpdmUpOyAvLyBTdGFydCB0aGUgZ2FtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHQvLyBIYW5kbGUgZXJyb3Jcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSGFuZGxlIGludmFsaWQgcGxhY2VtZW50XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgcm90YXRlIGJ1dHRvblxuXHRyb3RhdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpc0hvcml6b250YWwgPSAhaXNIb3Jpem9udGFsOyAvLyBDaGFuZ2UgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlwXG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbGF5R2FtZTtcbiIsIi8vIGdhbWVCb2FyZCBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiBnYW1lQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSkpOyAvLyAxMHgxMCBib2FyZFxuXG5cdC8vIHZhbGlkYXRlIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSkge1xuXHRcdGlmICh0eXBlb2YgeCAhPT0gXCJudW1iZXJcIiB8fCB4IDwgMCB8fCB4ID4gOSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInggbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDlcIik7XG5cdFx0aWYgKHR5cGVvZiB5ICE9PSBcIm51bWJlclwiIHx8IHkgPCAwIHx8IHkgPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0fVxuXG5cdC8vIGNoZWNrIGlmIGEgc2hpcCBjYW4gYmUgcGxhY2VkIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7IC8vIHZhbGlkYXRlIGNvb3JkaW5hdGVzXG5cdFx0aWYgKHR5cGVvZiBpc1ZlcnRpY2FsICE9PSBcImJvb2xlYW5cIilcblx0XHRcdC8vIHZhbGlkYXRlIGlzVmVydGljYWxcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImlzVmVydGljYWwgbXVzdCBiZSBhIGJvb2xlYW5cIik7XG5cdFx0Y29uc3QgbGVuZ3RoID0gc2hpcC5sZW5ndGggLSAxOyAvLyBnZXQgbGVuZ3RoIG9mIHNoaXBcblx0XHRjb25zdCBtYXhYID0gaXNWZXJ0aWNhbCA/IHggOiB4ICsgbGVuZ3RoOyAvLyBnZXQgbWF4IHggY29vcmRpbmF0ZVxuXHRcdGNvbnN0IG1heFkgPSBpc1ZlcnRpY2FsID8geSArIGxlbmd0aCA6IHk7IC8vIGdldCBtYXggeSBjb29yZGluYXRlXG5cblx0XHRpZiAobWF4WCA+IDkgfHwgbWF4WSA+IDkpIHJldHVybiBmYWxzZTsgLy8gY2hlY2sgaWYgc2hpcCBpcyBvdXQgb2YgYm91bmRzXG5cblx0XHQvLyBDaGVjayBpZiBzaGlwIGlzIG92ZXJsYXBwaW5nIG9yIGFkamFjZW50IHRvIGFub3RoZXIgc2hpcFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBjaGVja1ggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpOyAvLyB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IGNoZWNrWSA9IGlzVmVydGljYWwgPyB5ICsgaSA6IHk7IC8vIHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VsbFxuXHRcdFx0aWYgKGJvYXJkW2NoZWNrWV1bY2hlY2tYXSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7IC8vIGNoZWNrIGlmIGNlbGwgaXMgb2NjdXBpZWRcblxuXHRcdFx0Ly8gQ2hlY2sgYWRqYWNlbnQgY2VsbHNcblx0XHRcdGZvciAobGV0IGFkalggPSAtMTsgYWRqWCA8PSAxOyBhZGpYICs9IDEpIHtcblx0XHRcdFx0Zm9yIChsZXQgYWRqWSA9IC0xOyBhZGpZIDw9IDE7IGFkalkgKz0gMSkge1xuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWCA9IGNoZWNrWCArIGFkalg7IC8vIHggY29vcmRpbmF0ZSBvZiB0aGUgYWRqYWNlbnQgY2VsbFxuXHRcdFx0XHRcdGNvbnN0IG5laWdoYm9yWSA9IGNoZWNrWSArIGFkalk7IC8vIHkgY29vcmRpbmF0ZSBvZiB0aGUgYWRqYWNlbnQgY2VsbFxuXG5cdFx0XHRcdFx0Ly8gVmFsaWRhdGUgbmVpZ2hib3IgY29vcmRpbmF0ZXNcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYIDwgMTAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPCAxMFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGF0IHRoZSBhZGphY2VudCBjZWxsXG5cdFx0XHRcdFx0XHRpZiAoYm9hcmRbbmVpZ2hib3JZXVtuZWlnaGJvclhdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyByZXR1cm4gZmFsc2UgaWYgc2hpcCBpcyBhZGphY2VudCB0byBhbm90aGVyIHNoaXBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTsgLy8gcmV0dXJuIHRydWUgaWYgc2hpcCBjYW4gYmUgcGxhY2VkXG5cdH1cblxuXHQvLyBwbGFjZSBhIHNoaXAgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG5cdFx0aWYgKCFjYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgaXNWZXJ0aWNhbCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBwbGFjZSBzaGlwIGhlcmVcIik7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBwbGFjZVggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBpO1xuXHRcdFx0Y29uc3QgcGxhY2VZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTtcblx0XHRcdGJvYXJkW3BsYWNlWV1bcGxhY2VYXSA9IHNoaXA7XG5cdFx0fVxuXHR9XG5cblx0Ly8gY2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuXHRmdW5jdGlvbiBoYXNTaGlwQXQoeCwgeSkge1xuXHRcdHJldHVybiBib2FyZFt5XVt4XSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gcmVjZWl2ZSBhbiBhdHRhY2sgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuXHRcdHZhbGlkYXRlQ29vcmRpbmF0ZXMoeCwgeSk7IC8vIHZhbGlkYXRlIGNvb3JkaW5hdGVzXG5cdFx0Ly8gcmV0dXJuIFwibWlzc1wiIGlmIHRoZXJlIGlzIG5vIHNoaXAgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdFx0aWYgKGJvYXJkW3ldW3hdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJvYXJkW3ldW3hdID0gXCJtaXNzXCI7XG5cdFx0XHRyZXR1cm4gXCJtaXNzXCI7XG5cdFx0fVxuXHRcdGJvYXJkW3ldW3hdLmhpdCgpOyAvLyBoaXQgdGhlIHNoaXBcblx0XHQvLyByZXR1cm4gXCJzdW5rXCIgaWYgdGhlIHNoaXAgaXMgc3Vua1xuXHRcdGlmIChib2FyZFt5XVt4XS5zdW5rKSByZXR1cm4gXCJzdW5rXCI7XG5cdFx0cmV0dXJuIFwiaGl0XCI7IC8vIHJldHVybiBcImhpdFwiIGlmIHRoZSBzaGlwIGlzIGhpdFxuXHR9XG5cblx0Ly8gY2hlY2sgaWYgYWxsIHNoaXBzIGFyZSBzdW5rXG5cdGZ1bmN0aW9uIGFsbFNoaXBzU3VuaygpIHtcblx0XHQvLyByZXR1cm4gdHJ1ZSBpZiBhbGwgY2VsbHMgYXJlIGVtcHR5LCBcIm1pc3NcIiwgb3IgXCJzdW5rXCJcblx0XHRyZXR1cm4gYm9hcmQuZXZlcnkoKHJvdykgPT5cblx0XHRcdHJvdy5ldmVyeShcblx0XHRcdFx0KGNlbGwpID0+XG5cdFx0XHRcdFx0Y2VsbCA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0Y2VsbCA9PT0gXCJtaXNzXCIgfHxcblx0XHRcdFx0XHQodHlwZW9mIGNlbGwgPT09IFwib2JqZWN0XCIgJiYgY2VsbC5zdW5rKSxcblx0XHRcdCksXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Z2V0IGJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGJvYXJkO1xuXHRcdH0sXG5cdFx0Y2FuUGxhY2VTaGlwLFxuXHRcdHBsYWNlU2hpcCxcblx0XHRoYXNTaGlwQXQsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhbGxTaGlwc1N1bmssXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVCb2FyZDtcbiIsImltcG9ydCBzb2xkaWVyIGZyb20gXCIuL2ltZy9zb2xkaWVyLnN2Z1wiO1xuaW1wb3J0IEdpdEh1YiBmcm9tIFwiLi9pbWcvZ2l0LnN2Z1wiO1xuXG4vLyBDcmVhdGUgdGhlIGhlYWRlclxuZnVuY3Rpb24gaGVhZGVyKCkge1xuXHRjb25zdCBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRiYXIuY2xhc3NMaXN0LmFkZChcIm5hdi1iYXJcIik7XG5cblx0Y29uc3QgbGVmdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRsZWZ0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0bGVmdEljb24uc3JjID0gc29sZGllcjtcblx0bGVmdEljb24uYWx0ID0gXCJzb2xkaWVyXCI7XG5cblx0Y29uc3QgdGl0bGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0aXRsZUJveC5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyXCIpO1xuXHRjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblx0dGl0bGUudGV4dENvbnRlbnQgPSBcIkJhdHRsZXNoaXBcIjtcblx0dGl0bGVCb3guYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdGNvbnN0IHJpZ2h0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0cmlnaHRJY29uLnNyYyA9IHNvbGRpZXI7XG5cdHJpZ2h0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHRiYXIuYXBwZW5kQ2hpbGQobGVmdEljb24pO1xuXHRiYXIuYXBwZW5kQ2hpbGQodGl0bGVCb3gpO1xuXHRiYXIuYXBwZW5kQ2hpbGQocmlnaHRJY29uKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYmFyKTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBtYWluIGNvbnRlbnRcbmZ1bmN0aW9uIG1haW5Db250ZW50KCkge1xuXHRjb25zdCBtYWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0bWFpbi5jbGFzc0xpc3QuYWRkKFwibWFpbi1jb250ZW50XCIpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQobWFpbik7XG59XG5cbi8vIENyZWF0ZSB0aGUgdHVybiBpbmRpY2F0b3JcbmZ1bmN0aW9uIHR1cm4oKSB7XG5cdGNvbnN0IHR1cm5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0dXJuRGl2LmNsYXNzTGlzdC5hZGQoXCJ0dXJuLWRpdlwiKTtcblx0Y29uc3QgdHVybkluZGljYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5JbmRpY2F0b3IuY2xhc3NMaXN0LmFkZChcInR1cm4taW5kaWNhdG9yXCIpO1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IFwiWW91ciBUdXJuXCI7XG5cdHR1cm5JbmRpY2F0b3IuYXBwZW5kQ2hpbGQodHVyblRleHQpO1xuXHR0dXJuRGl2LmFwcGVuZENoaWxkKHR1cm5JbmRpY2F0b3IpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKS5hcHBlbmRDaGlsZCh0dXJuRGl2KTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBib2FyZCBjb250YWluZXJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG4vLyBDcmVhdGUgdGhlIHBsYXllciBib2FyZFxuZnVuY3Rpb24gcGxheWVyQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJZb3VyIEJvYXJkXCI7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkVGl0bGUpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRHcmlkKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmJvYXJkXCIpLmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBlbmVteSBib2FyZFxuZnVuY3Rpb24gZW5lbXlCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwiZW5lbXlcIik7XG5cblx0Y29uc3QgYm9hcmRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblx0Ym9hcmRUaXRsZS50ZXh0Q29udGVudCA9IFwiRW5lbXkgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG4vLyBSZXR1cm4gdGhlIGJvYXJkIGdyaWRcbmZ1bmN0aW9uIHJldHVybkJvYXJkR3JpZChlbmVteSkge1xuXHRsZXQgYm9hcmRHcmlkO1xuXHRpZiAoZW5lbXkpIHtcblx0XHRib2FyZEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmVuZW15IGRpdi5ib2FyZC1ncmlkXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGJvYXJkR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYucGxheWVyIGRpdi5ib2FyZC1ncmlkXCIpO1xuXHR9XG5cdHJldHVybiBib2FyZEdyaWQ7XG59XG5cbi8vIERyYXcgdGhlIGJvYXJkXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIGlzRW5lbXkgPSBmYWxzZSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoaXNFbmVteSk7XG5cdGJvYXJkR3JpZC5pbm5lckhUTUwgPSBcIlwiO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFtpXS5sZW5ndGg7IGogKz0gMSkge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnggPSBqO1xuXHRcdFx0Y2VsbC5kYXRhc2V0LnkgPSBpO1xuXG5cdFx0XHRpZiAoYm9hcmRbaV1bal0gIT09IHVuZGVmaW5lZCAmJiAhaXNFbmVteSkge1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuXHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoYHNoaXAtJHtib2FyZFtpXVtqXS5uYW1lfWApO1xuXHRcdFx0fVxuXHRcdFx0Ym9hcmRHcmlkLmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBhZGQgbWlzcyBjbGFzcyB0byB0aGUgY2VsbFxuZnVuY3Rpb24gbWlzcyh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xufVxuXG4vLyBhZGQgaGl0IGNsYXNzIHRvIHRoZSBjZWxsXG5mdW5jdGlvbiBoaXQoeCwgeSwgZW5lbXkpIHtcblx0Y29uc3QgYm9hcmRHcmlkID0gcmV0dXJuQm9hcmRHcmlkKGVuZW15KTtcblx0Y29uc3QgY2VsbCA9IGJvYXJkR3JpZC5jaGlsZHJlblt5ICogMTAgKyB4XTtcblx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xufVxuXG4vLyB1cGRhdGUgdGhlIGJvYXJkIGFmdGVyIGFuIGF0dGFja1xuZnVuY3Rpb24gdXBkYXRlQm9hcmQoeCwgeSwgcmVzdWx0LCBlbmVteSkge1xuXHRpZiAocmVzdWx0ID09PSBcIm1pc3NcIikge1xuXHRcdG1pc3MoeCwgeSwgZW5lbXkpO1xuXHR9IGVsc2Uge1xuXHRcdGhpdCh4LCB5LCBlbmVteSk7XG5cdH1cbn1cblxuLy8gc2hvd3MgdGhlIHN0YXJ0IHBhZ2VcbmZ1bmN0aW9uIHN0YXJ0UGFnZSgpIHtcblx0Y29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpO1xuXHRtYWluLmlubmVySFRNTCA9IFwiXCI7IC8vIGNsZWFyIHRoZSBtYWluIGNvbnRlbnRcblx0dHVybigpOyAvLyBjcmVhdGUgdGhlIHR1cm4gaW5kaWNhdG9yXG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBzaGlwcyBieSBjbGlja2luZyBvbiB0aGUgYm9hcmQgYmVsb3dcIjtcblxuXHRjb25zdCByb3RhdGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRyb3RhdGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInJvdGF0ZS1jb250YWluZXJcIik7XG5cblx0Y29uc3Qgcm90YXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0cm90YXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtYnV0dG9uXCIpO1xuXHRyb3RhdGVCdXR0b24udGV4dENvbnRlbnQgPSBcIlJvdGF0ZVwiO1xuXHRyb3RhdGVDb250YWluZXIuYXBwZW5kQ2hpbGQocm90YXRlQnV0dG9uKTtcblx0bWFpbi5hcHBlbmRDaGlsZChyb3RhdGVDb250YWluZXIpO1xuXG5cdGNvbnN0IGJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkR3JpZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtZ3JpZFwiKTtcblx0bWFpbi5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcblx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuXHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcblx0XHRjZWxsLmRhdGFzZXQueCA9IGkgJSAxMDtcblx0XHRjZWxsLmRhdGFzZXQueSA9IE1hdGguZmxvb3IoaSAvIDEwKTtcblx0XHRib2FyZEdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdH1cbn1cblxuLy8gbG9hZCB0aGUgZ2FtZVxuZnVuY3Rpb24gbG9hZEdhbWUoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKTtcblx0bWFpbi5pbm5lckhUTUwgPSBcIlwiO1xuXHR0dXJuKCk7IC8vIGNyZWF0ZSB0aGUgdHVybiBpbmRpY2F0b3Jcblx0Y3JlYXRlQm9hcmQoKTsgLy8gY3JlYXRlIHRoZSBib2FyZCBjb250YWluZXJcblx0cGxheWVyQm9hcmQoKTsgLy8gY3JlYXRlIHRoZSBwbGF5ZXIgYm9hcmRcblx0ZW5lbXlCb2FyZCgpOyAvLyBjcmVhdGUgdGhlIGVuZW15IGJvYXJkXG59XG5cbi8vIHVwZGF0ZSB0aGUgdHVybiBpbmRpY2F0b3IgdGV4dFxuZnVuY3Rpb24gdXBkYXRlVHVybihpc1R1cm4pIHtcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnR1cm4taW5kaWNhdG9yIHBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gaXNUdXJuID8gXCJZb3VyIFR1cm5cIiA6IFwiQ29tcHV0ZXIncyBUdXJuXCI7XG59XG5cbi8vIHNob3cgdGhlIHdpbm5lclxuZnVuY3Rpb24gd2lubmVyKHBsYXllcikge1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYudHVybi1pbmRpY2F0b3IgcFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJ9IHdvbiFgO1xufVxuXG4vLyBoaWRlIHRoZSBwbGF5IGFnYWluIHBvcHVwXG5mdW5jdGlvbiBoaWRlUG9wdXAoKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheUFnYWluUG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG4vLyBDcmVhdGUgdGhlIGZvb3RlclxuY29uc3QgY3JlYXRlRm9vdGVyID0gKCkgPT4ge1xuXHRjb25zdCBmb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xuXHRmb290ZXIuY2xhc3NMaXN0LmFkZChcImZvb3RlclwiKTtcblxuXHRjb25zdCBnaXRIdWJQcm9maWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdGdpdEh1YlByb2ZpbGUuaHJlZiA9IFwiaHR0cHM6Ly9naXRodWIuY29tL1NoYWhpci00N1wiO1xuXG5cdGNvbnN0IGdpdEh1YlByb2ZpbGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXHRnaXRIdWJQcm9maWxlSW1nLnNyYyA9IEdpdEh1Yjtcblx0Z2l0SHViUHJvZmlsZUltZy5hbHQgPSBcImdpdEh1YiBMb2dvXCI7XG5cblx0Y29uc3QgZ2l0SHViUHJvZmlsZVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0Y29uc3QgYXRTeW1ib2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0YXRTeW1ib2wuY2xhc3NMaXN0LmFkZChcImF0LXN5bWJvbFwiKTtcblx0YXRTeW1ib2wudGV4dENvbnRlbnQgPSBcIkBcIjtcblx0Y29uc3QgdXNlcm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0dXNlcm5hbWUudGV4dENvbnRlbnQgPSBcIlNoYWhpci00N1wiO1xuXHRnaXRIdWJQcm9maWxlVGV4dC5hcHBlbmRDaGlsZChhdFN5bWJvbCk7XG5cdGdpdEh1YlByb2ZpbGVUZXh0LmFwcGVuZENoaWxkKHVzZXJuYW1lKTtcblxuXHRnaXRIdWJQcm9maWxlLmFwcGVuZENoaWxkKGdpdEh1YlByb2ZpbGVJbWcpO1xuXHRnaXRIdWJQcm9maWxlLmFwcGVuZENoaWxkKGdpdEh1YlByb2ZpbGVUZXh0KTtcblxuXHRjb25zdCBzZXBlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0c2VwZXJhdG9yLnRleHRDb250ZW50ID0gXCJ8XCI7XG5cblx0Y29uc3QgZ2l0SHViUmVwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRnaXRIdWJSZXBvLmhyZWYgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9TaGFoaXItNDcvQmF0dGxlc2hpcFwiO1xuXHRnaXRIdWJSZXBvLnRleHRDb250ZW50ID0gXCJTb3VyY2UgQ29kZVwiO1xuXG5cdGZvb3Rlci5hcHBlbmRDaGlsZChnaXRIdWJQcm9maWxlKTtcblx0Zm9vdGVyLmFwcGVuZENoaWxkKHNlcGVyYXRvcik7XG5cdGZvb3Rlci5hcHBlbmRDaGlsZChnaXRIdWJSZXBvKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcbn07XG5cbi8vIENyZWF0ZSB0aGUgcGFnZVxuZnVuY3Rpb24gcGFnZSgpIHtcblx0aGVhZGVyKCk7XG5cdG1haW5Db250ZW50KCk7XG5cdHN0YXJ0UGFnZSgpO1xuXHRjcmVhdGVGb290ZXIoKTtcbn1cblxuLy8gc2hvdyB0aGUgcGxheSBhZ2FpbiBwb3B1cFxuZnVuY3Rpb24gc2hvd1BvcHVwKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlBZ2FpblBvcHVwXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmV4cG9ydCB7XG5cdHBhZ2UsXG5cdGRyYXdCb2FyZCxcblx0dXBkYXRlQm9hcmQsXG5cdHVwZGF0ZVR1cm4sXG5cdGxvYWRHYW1lLFxuXHR3aW5uZXIsXG5cdHNob3dQb3B1cCxcblx0aGlkZVBvcHVwLFxufTtcbiIsImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5cbi8vIHBsYXllciBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiBwbGF5ZXIoKSB7XG5cdGNvbnN0IHBsYXllckJvYXJkID0gZ2FtZUJvYXJkKCk7IC8vIHBsYXllcidzIGdhbWUgYm9hcmRcblx0Ly8gcGxheWVyJ3MgaGl0IGJvYXJkICh0byBrZWVwIHRyYWNrIG9mIGhpdHMgYW5kIG1pc3Nlcylcblx0Y29uc3QgaGl0Qm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7XG5cdGxldCBpc1R1cm4gPSBmYWxzZTsgLy8gaXMgaXQgdGhlIHBsYXllcidzIHR1cm4/XG5cblx0Ly8gcGxhY2UgYSBzaGlwIG9uIHRoZSBib2FyZFxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCk7XG5cdH1cblxuXHQvLyBjaGVjayBpZiBhIHNoaXAgY2FuIGJlIHBsYWNlZCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcblx0ZnVuY3Rpb24gY2FuUGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCB2ZXJ0aWNhbCkge1xuXHRcdHJldHVybiBwbGF5ZXJCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKTtcblx0fVxuXG5cdC8vIHJlY2VpdmUgYW4gYXR0YWNrIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gcGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdFx0aWYgKHJlc3VsdCA9PT0gXCJoaXRcIikge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJoaXRcIjtcblx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzdW5rXCIpIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwic3Vua1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcIm1pc3NcIjtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8vIGF0dGFjayB0aGUgZW5lbXkgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcblx0XHRyZXR1cm4gZW5lbXkucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cdH1cblxuXHQvLyBjaGVjayBpZiBhbGwgc2hpcHMgYXJlIHN1bmtcblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gcGxheWVyQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHBsYWNlU2hpcCxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRhdHRhY2ssXG5cdFx0aGFzTG9zdCxcblx0XHRnZXQgaXNUdXJuKCkge1xuXHRcdFx0cmV0dXJuIGlzVHVybjtcblx0XHR9LFxuXHRcdHNldCBpc1R1cm4odmFsdWUpIHtcblx0XHRcdGlzVHVybiA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0IHBsYXllckJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIHBsYXllckJvYXJkO1xuXHRcdH0sXG5cdFx0Z2V0IGhpdEJvYXJkKCkge1xuXHRcdFx0cmV0dXJuIGhpdEJvYXJkO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNoaXAobGVuZ3RoKSB7XG5cdGlmICh0eXBlb2YgbGVuZ3RoICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIG51bWJlclwiKTtcblx0aWYgKGxlbmd0aCA8IDEpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCIpO1xuXHRpZiAobGVuZ3RoICUgMSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlclwiKTtcblx0aWYgKGxlbmd0aCA+IDUpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGxlc3MgdGhhbiA2XCIpO1xuXG5cdGxldCBudW1IaXRzID0gMDsgLy8gbnVtYmVyIG9mIGhpdHMgb24gdGhlIHNoaXBcblx0bGV0IHN1bmsgPSBmYWxzZTsgLy8gd2hldGhlciB0aGUgc2hpcCBpcyBzdW5rXG5cblx0cmV0dXJuIHtcblx0XHRnZXQgbGVuZ3RoKCkge1xuXHRcdFx0cmV0dXJuIGxlbmd0aDtcblx0XHR9LFxuXHRcdGdldCBudW1IaXRzKCkge1xuXHRcdFx0cmV0dXJuIG51bUhpdHM7XG5cdFx0fSxcblx0XHRnZXQgc3VuaygpIHtcblx0XHRcdHJldHVybiBzdW5rO1xuXHRcdH0sXG5cdFx0aGl0KCkge1xuXHRcdFx0bnVtSGl0cyArPSAxO1xuXHRcdFx0aWYgKG51bUhpdHMgPT09IGxlbmd0aCkge1xuXHRcdFx0XHRzdW5rID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGJvZHkge1xuXHQtLXNpZGViYXItYmctY29sb3I6ICMxOTIxMWE7XG5cdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XG5cdG1hcmdpbjogMDtcblx0cGFkZGluZzogMDtcblx0Zm9udC1mYW1pbHk6XG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcblx0Y29sb3I6ICNkZGRkZGQ7XG59XG5cbmRpdiNjb250ZW50IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG5cdGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuXHRoZWlnaHQ6IDEwMHZoO1xufVxuXG4ubmF2LWJhciB7XG5cdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNpZGViYXItYmctY29sb3IpO1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiA1cmVtO1xuXHRwYWRkaW5nOiAwIDFyZW07XG5cdHBhZGRpbmctdG9wOiAwLjI1cmVtO1xufVxuXG4ubWFpbi1jb250ZW50IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGdhcDogMXJlbTtcblx0cGFkZGluZzogMCAxcmVtO1xufVxuXG4uY2VsbC5vdmVybGFwIHtcblx0YmFja2dyb3VuZC1jb2xvcjogcmVkO1xuXHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uaGVhZGVyIGgxIHtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRmb250LWZhbWlseTogXCJBcmlhbFwiLCBzYW5zLXNlcmlmO1xuXHRmb250LXNpemU6IDM5cHg7XG5cdGNvbG9yOiAjZmZmZmZmODc7XG5cdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XG5cdHBhZGRpbmc6IDIwcHg7XG5cdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG5cdGxldHRlci1zcGFjaW5nOiAycHg7XG5cdG1hcmdpbjogMHB4O1xuXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3Mztcbn1cblxuLmhlYWRlciBoMTpob3ZlciB7XG5cdGNvbG9yOiAjODQ5MTc3O1xuXHRjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5pY29uIHtcblx0d2lkdGg6IDRyZW07XG5cdGhlaWdodDogYXV0bztcbn1cblxuLnR1cm4taW5kaWNhdG9yIHtcblx0d2lkdGg6IDYwJTtcblx0aGVpZ2h0OiAxMDAlO1xuXHRib3JkZXItcmFkaXVzOiAxcmVtO1xuXHRwYWRkaW5nOiAwLjVyZW07XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcblx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xuXHRiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudChcblx0XHQtNDVkZWcsXG5cdFx0I2NkY2FjYTg3IDAlLFxuXHRcdCNmZmZmZmY4NyA1MCUsXG5cdFx0I2NkY2RjZGE2IDEwMCVcblx0KTtcblx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXG5cdFx0LTQ1ZGVnLFxuXHRcdCNjZGNhY2E4NyAwJSxcblx0XHQjZmZmZmZmODcgNTAlLFxuXHRcdCNjZGNkY2RhNiAxMDAlXG5cdCk7XG5cdGJveC1zaGFkb3c6IDBweCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbn1cbi50dXJuLWluZGljYXRvciBwIHtcblx0Zm9udC1zaXplOiAxLjVyZW07XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjb2xvcjogIzE5MjExYTtcblx0Zm9udC1mYW1pbHk6IFwiQXJpYWxcIiwgc2Fucy1zZXJpZjtcblx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblx0bGV0dGVyLXNwYWNpbmc6IDJweDtcblx0bWFyZ2luLWJvdHRvbTogMzBweDtcblx0dGV4dC1zaGFkb3c6IDRweCAzcHggMHB4ICM2NTcxNTk3Mztcblx0bWFyZ2luOiAwO1xuXHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZS1pbi1vdXQ7XG5cdG9wYWNpdHk6IDE7XG59XG5cbi5yb3RhdGUtY29udGFpbmVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbiNwbGF5QWdhaW5CdXR0b24sXG4ucm90YXRlLWJ1dHRvbiB7XG5cdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XG5cdGNvbG9yOiAjYzFjMWMxZDY7XG5cdGJvcmRlcjogMnB4IHNvbGlkICM5MjkzOTI7XG5cdHBhZGRpbmc6IDEwcHggMjBweDtcblx0Ym9yZGVyLXJhZGl1czogNXB4O1xuXHRmb250LXdlaWdodDogYm9sZDtcblx0Y3Vyc29yOiBwb2ludGVyO1xuXHR0cmFuc2l0aW9uOlxuXHRcdHRyYW5zZm9ybSAwLjNzIGVhc2UsXG5cdFx0YmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XG59XG5cbiNwbGF5QWdhaW5CdXR0b246aG92ZXIsXG4ucm90YXRlLWJ1dHRvbjpob3ZlciB7XG5cdGJhY2tncm91bmQtY29sb3I6ICMyYzcyMzU7XG5cdGNvbG9yOiAjZmZmZmZmODc7XG59XG5cbi5ib2FyZCB7XG5cdGRpc3BsYXk6IGdyaWQ7XG5cdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XG5cdGdhcDogMXJlbTtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG4uY2VsbCB7XG5cdGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmNlbGwuaGlnaGxpZ2h0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xufVxuXG5kaXYuY2VsbC5ibG9ja2VkIHtcblx0YmFja2dyb3VuZC1jb2xvcjogcmVkO1xuXHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uY2VsbC13aXRoLXNoaXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjNGNhZjUwO1xuXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7XG59XG5cbmRpdi5ib2FyZC1ncmlkIC5jZWxsLmNlbGwtd2l0aC1zaGlwIHtcblx0Ym9yZGVyOiAxcHggc29saWQgI2ZmZmZmZjg3O1xufVxuXG4uYm9hcmQgaDIge1xuXHRtYXJnaW46IDA7XG59XG5cbi50dXJuLWRpdiB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG5kaXYuYm9hcmQtZ3JpZCB7XG5cdGRpc3BsYXk6IGdyaWQ7XG5cdGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgxMCwgMi4zdncpIC8gcmVwZWF0KDEwLCAyLjN2dyk7XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcblx0Z2FwOiAycHg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuZGl2LmJvYXJkLWdyaWQgLmNlbGwge1xuXHRib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcblx0aGVpZ2h0OiAxMDAlO1xuXHR3aWR0aDogMTAwJTtcblx0dHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAwcztcbn1cblxuLmVuZW15LFxuLnBsYXllciB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDFyZW07XG59XG5cbi5zaGlwIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzFlOTBmZjtcbn1cblxuLm1pc3Mge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwODc7XG59XG5cbmRpdi5jZWxsLmhpdCB7XG5cdGJhY2tncm91bmQtY29sb3I6ICMwMGZmMWU4Nztcblx0Ym9yZGVyOiAxcHggc29saWQgIzAwZmYxZTg3O1xufVxuXG4ucG9wdXAge1xuXHRkaXNwbGF5OiBub25lO1xuXHRwb3NpdGlvbjogZml4ZWQ7XG5cdGxlZnQ6IDUwJTtcblx0dG9wOiA1MCU7XG5cdHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcblx0Y29sb3I6ICNkZGRkZGQ7XG5cdHBhZGRpbmc6IDIwcHg7XG5cdHotaW5kZXg6IDEwMDA7IC8qIEVuc3VyZSBpdCdzIGFib3ZlIG90aGVyIGNvbnRlbnQgKi9cbn1cblxuLnBvcHVwLWNvbnRlbnQge1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5wb3B1cC1jb250ZW50IHAge1xuXHRmb250LXNpemU6IDFyZW07XG5cdGZvbnQtd2VpZ2h0OiA5MDA7XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGb290ZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5mb290ZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xuXHR3aWR0aDogMTAwJTtcblx0aGVpZ2h0OiAyLjVyZW07XG5cdHBhZGRpbmc6IDFyZW0gMDtcblx0cGFkZGluZy1ib3R0b206IDAuNXJlbTtcbn1cblxuZm9vdGVyIGEge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDAuNXJlbTtcblx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xuXHRmb250LXNpemU6IDEuM3JlbTtcblx0Zm9udC13ZWlnaHQ6IDEwMDtcblx0Y29sb3I6ICM5NjkyOTI7XG5cdGZvbnQtZmFtaWx5OlxuXHRcdGplZGkgc29saWQsXG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcbn1cblxuZm9vdGVyIHAge1xuXHRtYXJnaW46IDAuNXJlbSAwO1xufVxuXG5mb290ZXIgYTpob3ZlcixcbmZvb3RlciBhOmFjdGl2ZSB7XG5cdGNvbG9yOiAjZmZmO1xufVxuXG5mb290ZXIgYTpob3ZlciBpbWcsXG5mb290ZXIgYTphY3RpdmUgaW1nIHtcblx0ZmlsdGVyOiBicmlnaHRuZXNzKDk5KTtcbn1cblxuLmF0LXN5bWJvbCB7XG5cdGZvbnQtd2VpZ2h0OiA5MDA7XG5cdGZvbnQtZmFtaWx5OlxuXHRcdHN5c3RlbS11aSxcblx0XHQtYXBwbGUtc3lzdGVtLFxuXHRcdEJsaW5rTWFjU3lzdGVtRm9udCxcblx0XHRcIlNlZ29lIFVJXCIsXG5cdFx0Um9ib3RvLFxuXHRcdE94eWdlbixcblx0XHRVYnVudHUsXG5cdFx0Q2FudGFyZWxsLFxuXHRcdFwiT3BlbiBTYW5zXCIsXG5cdFx0XCJIZWx2ZXRpY2EgTmV1ZVwiLFxuXHRcdHNhbnMtc2VyaWY7XG59XG5cbmZvb3RlciBpbWcge1xuXHR3aWR0aDogMnJlbTtcblx0aGVpZ2h0OiBhdXRvO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0NBQ0MsMkJBQTJCO0NBQzNCLHlCQUF5QjtDQUN6QixTQUFTO0NBQ1QsVUFBVTtDQUNWOzs7Ozs7Ozs7OztZQVdXO0NBQ1gsY0FBYztBQUNmOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qiw2QkFBNkI7Q0FDN0Isb0JBQW9CO0NBQ3BCLGFBQWE7QUFDZDs7QUFFQTtDQUNDLHlDQUF5QztDQUN6QyxhQUFhO0NBQ2IsdUJBQXVCO0NBQ3ZCLG1CQUFtQjtDQUNuQixTQUFTO0NBQ1QsZUFBZTtDQUNmLG9CQUFvQjtBQUNyQjs7QUFFQTtDQUNDLGFBQWE7Q0FDYixzQkFBc0I7Q0FDdEIsdUJBQXVCO0NBQ3ZCLFNBQVM7Q0FDVCxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MscUJBQXFCO0NBQ3JCLG1CQUFtQjtBQUNwQjs7QUFFQTtDQUNDLGtCQUFrQjtDQUNsQixnQ0FBZ0M7Q0FDaEMsZUFBZTtDQUNmLGdCQUFnQjtDQUNoQix5QkFBeUI7Q0FDekIsYUFBYTtDQUNiLHlCQUF5QjtDQUN6Qixt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XFxuXFx0LS1zaWRlYmFyLWJnLWNvbG9yOiAjMTkyMTFhO1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sXFxuXFx0XFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxcblxcdFxcdFxcXCJTZWdvZSBVSVxcXCIsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdE94eWdlbixcXG5cXHRcXHRVYnVudHUsXFxuXFx0XFx0Q2FudGFyZWxsLFxcblxcdFxcdFxcXCJPcGVuIFNhbnNcXFwiLFxcblxcdFxcdFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsXFxuXFx0XFx0c2Fucy1zZXJpZjtcXG5cXHRjb2xvcjogI2RkZGRkZDtcXG59XFxuXFxuZGl2I2NvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG5cXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcXG5cXHRoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4ubmF2LWJhciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogNXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxuXFx0cGFkZGluZy10b3A6IDAuMjVyZW07XFxufVxcblxcbi5tYWluLWNvbnRlbnQge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0cGFkZGluZzogMCAxcmVtO1xcbn1cXG5cXG4uY2VsbC5vdmVybGFwIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxuXFx0Y3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLmhlYWRlciBoMSB7XFxuXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblxcdGZvbnQtZmFtaWx5OiBcXFwiQXJpYWxcXFwiLCBzYW5zLXNlcmlmO1xcblxcdGZvbnQtc2l6ZTogMzlweDtcXG5cXHRjb2xvcjogI2ZmZmZmZjg3O1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxOTIxMWE7XFxuXFx0cGFkZGluZzogMjBweDtcXG5cXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7XFxuXFx0bWFyZ2luOiAwcHg7XFxuXFx0dGV4dC1zaGFkb3c6IDJweCAycHggMnB4ICM3MzczNzM7XFxufVxcblxcbi5oZWFkZXIgaDE6aG92ZXIge1xcblxcdGNvbG9yOiAjODQ5MTc3O1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmljb24ge1xcblxcdHdpZHRoOiA0cmVtO1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXFxuLnR1cm4taW5kaWNhdG9yIHtcXG5cXHR3aWR0aDogNjAlO1xcblxcdGhlaWdodDogMTAwJTtcXG5cXHRib3JkZXItcmFkaXVzOiAxcmVtO1xcblxcdHBhZGRpbmc6IDAuNXJlbTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0YmFja2dyb3VuZDogI2ZmZmZmZjg3O1xcblxcdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxcblxcdFxcdC00NWRlZyxcXG5cXHRcXHQjY2RjYWNhODcgMCUsXFxuXFx0XFx0I2ZmZmZmZjg3IDUwJSxcXG5cXHRcXHQjY2RjZGNkYTYgMTAwJVxcblxcdCk7XFxuXFx0YmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRib3gtc2hhZG93OiAwcHggNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMik7XFxufVxcbi50dXJuLWluZGljYXRvciBwIHtcXG5cXHRmb250LXNpemU6IDEuNXJlbTtcXG5cXHRmb250LXdlaWdodDogYm9sZDtcXG5cXHRjb2xvcjogIzE5MjExYTtcXG5cXHRmb250LWZhbWlseTogXFxcIkFyaWFsXFxcIiwgc2Fucy1zZXJpZjtcXG5cXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcblxcdGxldHRlci1zcGFjaW5nOiAycHg7XFxuXFx0bWFyZ2luLWJvdHRvbTogMzBweDtcXG5cXHR0ZXh0LXNoYWRvdzogNHB4IDNweCAwcHggIzY1NzE1OTczO1xcblxcdG1hcmdpbjogMDtcXG5cXHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZS1pbi1vdXQ7XFxuXFx0b3BhY2l0eTogMTtcXG59XFxuXFxuLnJvdGF0ZS1jb250YWluZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4jcGxheUFnYWluQnV0dG9uLFxcbi5yb3RhdGUtYnV0dG9uIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjNTA2MDUyO1xcblxcdGNvbG9yOiAjYzFjMWMxZDY7XFxuXFx0Ym9yZGVyOiAycHggc29saWQgIzkyOTM5MjtcXG5cXHRwYWRkaW5nOiAxMHB4IDIwcHg7XFxuXFx0Ym9yZGVyLXJhZGl1czogNXB4O1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkO1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG5cXHR0cmFuc2l0aW9uOlxcblxcdFxcdHRyYW5zZm9ybSAwLjNzIGVhc2UsXFxuXFx0XFx0YmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XFxufVxcblxcbiNwbGF5QWdhaW5CdXR0b246aG92ZXIsXFxuLnJvdGF0ZS1idXR0b246aG92ZXIge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMyYzcyMzU7XFxuXFx0Y29sb3I6ICNmZmZmZmY4NztcXG59XFxuXFxuLmJvYXJkIHtcXG5cXHRkaXNwbGF5OiBncmlkO1xcblxcdGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmNlbGwge1xcblxcdGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmNlbGwuaGlnaGxpZ2h0IHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxufVxcblxcbmRpdi5jZWxsLmJsb2NrZWQge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG5cXHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xcbn1cXG5cXG4uY2VsbC13aXRoLXNoaXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgI2ZmZmZmZjg3O1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbC5jZWxsLXdpdGgtc2hpcCB7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgI2ZmZmZmZjg3O1xcbn1cXG5cXG4uYm9hcmQgaDIge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLnR1cm4tZGl2IHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuZGl2LmJvYXJkLWdyaWQge1xcblxcdGRpc3BsYXk6IGdyaWQ7XFxuXFx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjN2dykgLyByZXBlYXQoMTAsIDIuM3Z3KTtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0Z2FwOiAycHg7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24tY29udGVudDogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdHdpZHRoOiAxMDAlO1xcblxcdHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UgMHM7XFxufVxcblxcbi5lbmVteSxcXG4ucGxheWVyIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxufVxcblxcbi5zaGlwIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xcbn1cXG5cXG4ubWlzcyB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDg3O1xcbn1cXG5cXG5kaXYuY2VsbC5oaXQge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMwMGZmMWU4NztcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjMDBmZjFlODc7XFxufVxcblxcbi5wb3B1cCB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG5cXHRwb3NpdGlvbjogZml4ZWQ7XFxuXFx0bGVmdDogNTAlO1xcblxcdHRvcDogNTAlO1xcblxcdHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcblxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcblxcdHBhZGRpbmc6IDIwcHg7XFxuXFx0ei1pbmRleDogMTAwMDsgLyogRW5zdXJlIGl0J3MgYWJvdmUgb3RoZXIgY29udGVudCAqL1xcbn1cXG5cXG4ucG9wdXAtY29udGVudCB7XFxuXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ucG9wdXAtY29udGVudCBwIHtcXG5cXHRmb250LXNpemU6IDFyZW07XFxuXFx0Zm9udC13ZWlnaHQ6IDkwMDtcXG59XFxuXFxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZvb3RlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXFxuXFxuZm9vdGVyIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiAxcmVtO1xcblxcdHdpZHRoOiAxMDAlO1xcblxcdGhlaWdodDogMi41cmVtO1xcblxcdHBhZGRpbmc6IDFyZW0gMDtcXG5cXHRwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xcbn1cXG5cXG5mb290ZXIgYSB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogMC41cmVtO1xcblxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cXHRmb250LXNpemU6IDEuM3JlbTtcXG5cXHRmb250LXdlaWdodDogMTAwO1xcblxcdGNvbG9yOiAjOTY5MjkyO1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdGplZGkgc29saWQsXFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sXFxuXFx0XFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxcblxcdFxcdFxcXCJTZWdvZSBVSVxcXCIsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdE94eWdlbixcXG5cXHRcXHRVYnVudHUsXFxuXFx0XFx0Q2FudGFyZWxsLFxcblxcdFxcdFxcXCJPcGVuIFNhbnNcXFwiLFxcblxcdFxcdFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsXFxuXFx0XFx0c2Fucy1zZXJpZjtcXG59XFxuXFxuZm9vdGVyIHAge1xcblxcdG1hcmdpbjogMC41cmVtIDA7XFxufVxcblxcbmZvb3RlciBhOmhvdmVyLFxcbmZvb3RlciBhOmFjdGl2ZSB7XFxuXFx0Y29sb3I6ICNmZmY7XFxufVxcblxcbmZvb3RlciBhOmhvdmVyIGltZyxcXG5mb290ZXIgYTphY3RpdmUgaW1nIHtcXG5cXHRmaWx0ZXI6IGJyaWdodG5lc3MoOTkpO1xcbn1cXG5cXG4uYXQtc3ltYm9sIHtcXG5cXHRmb250LXdlaWdodDogOTAwO1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdHN5c3RlbS11aSxcXG5cXHRcXHQtYXBwbGUtc3lzdGVtLFxcblxcdFxcdEJsaW5rTWFjU3lzdGVtRm9udCxcXG5cXHRcXHRcXFwiU2Vnb2UgVUlcXFwiLFxcblxcdFxcdFJvYm90byxcXG5cXHRcXHRPeHlnZW4sXFxuXFx0XFx0VWJ1bnR1LFxcblxcdFxcdENhbnRhcmVsbCxcXG5cXHRcXHRcXFwiT3BlbiBTYW5zXFxcIixcXG5cXHRcXHRcXFwiSGVsdmV0aWNhIE5ldWVcXFwiLFxcblxcdFxcdHNhbnMtc2VyaWY7XFxufVxcblxcbmZvb3RlciBpbWcge1xcblxcdHdpZHRoOiAycmVtO1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmJvZHkge1xuXHRtYXJnaW46IDA7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBcXGBtYWluXFxgIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICovXG5cbm1haW4ge1xuXHRkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBcXGBoMVxcYCBlbGVtZW50cyB3aXRoaW4gXFxgc2VjdGlvblxcYCBhbmRcbiAqIFxcYGFydGljbGVcXGAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICovXG5cbmgxIHtcblx0Zm9udC1zaXplOiAyZW07XG5cdG1hcmdpbjogMC42N2VtIDA7XG59XG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5cbmhyIHtcblx0Ym94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cblx0aGVpZ2h0OiAwOyAvKiAxICovXG5cdG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxucHJlIHtcblx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG5cdGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5hIHtcblx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gKi9cblxuYWJiclt0aXRsZV0ge1xuXHRib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYixcbnN0cm9uZyB7XG5cdGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG5cdGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViLFxuc3VwIHtcblx0Zm9udC1zaXplOiA3NSU7XG5cdGxpbmUtaGVpZ2h0OiAwO1xuXHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcblx0Ym90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuXHR0b3A6IC0wLjVlbTtcbn1cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmltZyB7XG5cdGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyogRm9ybXNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxMDAlOyAvKiAxICovXG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7XG5cdC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uLFxuc2VsZWN0IHtcblx0LyogMSAqL1xuXHR0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG5cdGJvcmRlci1zdHlsZTogbm9uZTtcblx0cGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmZpZWxkc2V0IHtcblx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmxlZ2VuZCB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cblx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cblx0ZGlzcGxheTogdGFibGU7IC8qIDEgKi9cblx0bWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXG5cdHBhZGRpbmc6IDA7IC8qIDMgKi9cblx0d2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxudGV4dGFyZWEge1xuXHRvdmVyZmxvdzogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5bdHlwZT1cImNoZWNrYm94XCJdLFxuW3R5cGU9XCJyYWRpb1wiXSB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcblx0aGVpZ2h0OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xuXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiAqL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cblx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuZGV0YWlscyB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1bW1hcnkge1xuXHRkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbnRlbXBsYXRlIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAqL1xuXG5baGlkZGVuXSB7XG5cdGRpc3BsYXk6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0NBQ0MsaUJBQWlCLEVBQUUsTUFBTTtDQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3ZDOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxTQUFTO0FBQ1Y7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsY0FBYztDQUNkLGdCQUFnQjtBQUNqQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtDQUNDLHVCQUF1QixFQUFFLE1BQU07Q0FDL0IsU0FBUyxFQUFFLE1BQU07Q0FDakIsaUJBQWlCLEVBQUUsTUFBTTtBQUMxQjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxpQ0FBaUMsRUFBRSxNQUFNO0NBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyw2QkFBNkI7QUFDOUI7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsbUJBQW1CLEVBQUUsTUFBTTtDQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0NBQ2xDLGlDQUFpQyxFQUFFLE1BQU07QUFDMUM7O0FBRUE7O0VBRUU7O0FBRUY7O0NBRUMsbUJBQW1CO0FBQ3BCOztBQUVBOzs7RUFHRTs7QUFFRjs7O0NBR0MsaUNBQWlDLEVBQUUsTUFBTTtDQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsY0FBYztDQUNkLGNBQWM7Q0FDZCxrQkFBa0I7Q0FDbEIsd0JBQXdCO0FBQ3pCOztBQUVBO0NBQ0MsZUFBZTtBQUNoQjs7QUFFQTtDQUNDLFdBQVc7QUFDWjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0Msa0JBQWtCO0FBQ25COztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGOzs7OztDQUtDLG9CQUFvQixFQUFFLE1BQU07Q0FDNUIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsaUJBQWlCLEVBQUUsTUFBTTtDQUN6QixTQUFTLEVBQUUsTUFBTTtBQUNsQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsTUFBTTtDQUNOLGlCQUFpQjtBQUNsQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsTUFBTTtDQUNOLG9CQUFvQjtBQUNyQjs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLDBCQUEwQjtBQUMzQjs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLGtCQUFrQjtDQUNsQixVQUFVO0FBQ1g7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7Q0FJQyw4QkFBOEI7QUFDL0I7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyw4QkFBOEI7QUFDL0I7O0FBRUE7Ozs7O0VBS0U7O0FBRUY7Q0FDQyxzQkFBc0IsRUFBRSxNQUFNO0NBQzlCLGNBQWMsRUFBRSxNQUFNO0NBQ3RCLGNBQWMsRUFBRSxNQUFNO0NBQ3RCLGVBQWUsRUFBRSxNQUFNO0NBQ3ZCLFVBQVUsRUFBRSxNQUFNO0NBQ2xCLG1CQUFtQixFQUFFLE1BQU07QUFDNUI7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyx3QkFBd0I7QUFDekI7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7OztFQUdFOztBQUVGOztDQUVDLHNCQUFzQixFQUFFLE1BQU07Q0FDOUIsVUFBVSxFQUFFLE1BQU07QUFDbkI7O0FBRUE7O0VBRUU7O0FBRUY7O0NBRUMsWUFBWTtBQUNiOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLDZCQUE2QixFQUFFLE1BQU07Q0FDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQywwQkFBMEIsRUFBRSxNQUFNO0NBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3RCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7O0VBRUU7O0FBRUY7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGFBQWE7QUFDZDs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGFBQWE7QUFDZFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmJvZHkge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICovXFxuXFxubWFpbiB7XFxuXFx0ZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmgxIHtcXG5cXHRmb250LXNpemU6IDJlbTtcXG5cXHRtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG5cXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcblxcdGhlaWdodDogMDsgLyogMSAqL1xcblxcdG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuXFx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5hIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG5cXHRib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuXFx0Zm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc21hbGwge1xcblxcdGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuXFx0Zm9udC1zaXplOiA3NSU7XFxuXFx0bGluZS1oZWlnaHQ6IDA7XFxuXFx0cG9zaXRpb246IHJlbGF0aXZlO1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG5cXHRib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuXFx0dG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuaW1nIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuXFx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7XFxuXFx0LyogMSAqL1xcblxcdG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7XFxuXFx0LyogMSAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuXFx0Ym9yZGVyLXN0eWxlOiBub25lO1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuXFx0b3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcblxcdHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuXFx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcblxcdGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuXFx0ZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG5cXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAzICovXFxuXFx0d2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAqL1xcblxcbnByb2dyZXNzIHtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG5cXHRvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAqL1xcblxcblt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcblt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0cGFkZGluZzogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuXFx0b3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcblxcdGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5cXG5kZXRhaWxzIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3VtbWFyeSB7XFxuXFx0ZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBNaXNjXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICovXFxuXFxudGVtcGxhdGUge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAqL1xcblxcbltoaWRkZW5dIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgcGxheUdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuaW1wb3J0IFwiLi9jc3Mvbm9ybWFsaXplLmNzc1wiO1xuaW1wb3J0IFwiLi9jc3MvZ2FtZS5jc3NcIjtcbmltcG9ydCB7IHBhZ2UsIGhpZGVQb3B1cCB9IGZyb20gXCIuL2dhbWVVSVwiO1xuXG5wYWdlKCk7IC8vIHNob3cgdGhlIHN0YXJ0IHBhZ2VcbnBsYXlHYW1lKCk7IC8vIHN0YXJ0IHRoZSBnYW1lXG5cbi8vIGFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgcGxheSBhZ2FpbiBidXR0b25cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheUFnYWluQnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdC8vIENvZGUgdG8gcmVzZXQgdGhlIGdhbWUgYW5kIHN0YXJ0IGFnYWluXG5cdGhpZGVQb3B1cCgpOyAvLyBoaWRlIHRoZSBwbGF5IGFnYWluIHBvcHVwXG5cdGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I2NvbnRlbnRcIik7IC8vIGdldCB0aGUgY29udGVudCBkaXZcblx0Y29udGVudC5pbm5lckhUTUwgPSBcIlwiOyAvLyBjbGVhciB0aGUgY29udGVudCBkaXZcblx0cGFnZSgpOyAvLyBzaG93IHRoZSBzdGFydCBwYWdlXG5cdHBsYXlHYW1lKCk7IC8vIHN0YXJ0IHRoZSBnYW1lXG59KTtcbiJdLCJuYW1lcyI6WyJnYW1lQm9hcmQiLCJjcmVhdGVTaGlwIiwiY29tcHV0ZXIiLCJjb21wQm9hcmQiLCJsYXN0SGl0IiwiYXR0YWNrT3B0aW9ucyIsImlzVHVybiIsInJhbmRvbUF0dGFjayIsImVuZW15IiwieCIsInkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJoaXRCb2FyZCIsInVuZGVmaW5lZCIsInBsYWNlU2hpcHNBdXRvbWF0aWNhbGx5Iiwic2hpcHMiLCJmb3JFYWNoIiwibGVuZ3RoIiwidmVydGljYWwiLCJzaGlwIiwiY2FuUGxhY2VTaGlwIiwicGxhY2VTaGlwIiwidGFyZ2V0QXR0YWNrIiwiZGlyZWN0aW9ucyIsImRpciIsIm5ld1giLCJuZXdZIiwicHVzaCIsInNoaWZ0IiwiY2hvb3NlQXR0YWNrIiwiYXR0YWNrIiwicGxheWVyIiwiX2Nob29zZUF0dGFjayIsImF0dGFja1Jlc3VsdCIsInJlY2VpdmVBdHRhY2siLCJoYXNMb3N0IiwiYWxsU2hpcHNTdW5rIiwidmFsdWUiLCJkcmF3Qm9hcmQiLCJ1cGRhdGVCb2FyZCIsInVwZGF0ZVR1cm4iLCJsb2FkR2FtZSIsIndpbm5lciIsInNob3dQb3B1cCIsImdhbWVUaW1lIiwidXNlclBhcmFtIiwiY29tcFBhcmFtIiwiZ2FtZUFjdGl2ZVBhcmFtIiwidXNlciIsImNvbXAiLCJnYW1lQWN0aXZlIiwicGxheWVyQm9hcmQiLCJib2FyZCIsImNlbGxzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2VsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidGFyZ2V0IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJkYXRhc2V0IiwieEludCIsInBhcnNlSW50IiwieUludCIsInJlc3VsdCIsIl9jb21wJGF0dGFjayIsImNvbXBYIiwiY29tcFkiLCJjb21wUmVzdWx0IiwicGxheUdhbWUiLCJncmlkQ2VsbHMiLCJyb3RhdGVCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwic2VsZWN0ZWRTaGlwU2l6ZSIsImlzSG9yaXpvbnRhbCIsImlzQWRqYWNlbnRCbG9ja2VkIiwic3RhcnRYIiwic3RhcnRZIiwic2hpcFNpemUiLCJpIiwiYWRqWCIsImFkalkiLCJuZWlnaGJvclgiLCJuZWlnaGJvclkiLCJoYXNTaGlwQXQiLCJoaWdobGlnaHRDZWxscyIsImlzT3ZlcmxhcE9yQWRqYWNlbnQiLCJjb25jYXQiLCJhZGQiLCJyZW1vdmVIaWdobGlnaHQiLCJyZW1vdmUiLCJjZWxsWCIsImNlbGxZIiwic2hpcENlbGwiLCJlcnJvciIsIkFycmF5IiwiZnJvbSIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJFcnJvciIsImlzVmVydGljYWwiLCJtYXhYIiwibWF4WSIsImNoZWNrWCIsImNoZWNrWSIsInBsYWNlWCIsInBsYWNlWSIsImhpdCIsInN1bmsiLCJldmVyeSIsInJvdyIsIl90eXBlb2YiLCJzb2xkaWVyIiwiR2l0SHViIiwiaGVhZGVyIiwiYmFyIiwiY3JlYXRlRWxlbWVudCIsImxlZnRJY29uIiwic3JjIiwiYWx0IiwidGl0bGVCb3giLCJ0aXRsZSIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyaWdodEljb24iLCJtYWluQ29udGVudCIsIm1haW4iLCJ0dXJuIiwidHVybkRpdiIsInR1cm5JbmRpY2F0b3IiLCJ0dXJuVGV4dCIsImNyZWF0ZUJvYXJkIiwiYm9hcmRUaXRsZSIsImJvYXJkR3JpZCIsImVuZW15Qm9hcmQiLCJyZXR1cm5Cb2FyZEdyaWQiLCJpc0VuZW15IiwiYXJndW1lbnRzIiwiaW5uZXJIVE1MIiwiaiIsIm5hbWUiLCJtaXNzIiwiY2hpbGRyZW4iLCJzdGFydFBhZ2UiLCJyb3RhdGVDb250YWluZXIiLCJoaWRlUG9wdXAiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImNyZWF0ZUZvb3RlciIsImZvb3RlciIsImdpdEh1YlByb2ZpbGUiLCJocmVmIiwiZ2l0SHViUHJvZmlsZUltZyIsImdpdEh1YlByb2ZpbGVUZXh0IiwiYXRTeW1ib2wiLCJ1c2VybmFtZSIsInNlcGVyYXRvciIsImdpdEh1YlJlcG8iLCJwYWdlIiwiY29sIiwibnVtSGl0cyIsImNvbnRlbnQiXSwic291cmNlUm9vdCI6IiJ9