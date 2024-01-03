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
      setTimeout(function () {
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
      }, 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtRkFBbUYsWUFBWSxhQUFhLFdBQVcsVUFBVSxlQUFlLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLFVBQVUsS0FBSyxTQUFTLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLE1BQU0sT0FBTyxPQUFPLE1BQU0sWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLFdB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LEtBQUssc0JBQXNCLHVCQUF1QixPQUFPLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLE9BQU8sTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sS0FBSyxzQkFBc0IscUJBQXFCLHVCQUF1QixPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIsT0FBTyxLQUFLLFFBQVEsT0FBTyxNQUFNLEtBQUssWUFBWSxPQUFPLE9BQU8sTUFBTSxLQUFLLHNCQUFzQix1QkFBdUIsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLE1BQU0sWUFBWSxPQUFPLE9BQU8sTUFBTSxPQUFPLHNCQUFzQixxQkFBcUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxVQUFVLE1BQU0sT0FBTyxNQUFNLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxRQUFRLFFBQVEsTUFBTSxTQUFTLHNCQUFzQixxQkFBcUIsdUJBQXVCLHFCQUFxQixPQUFPLE9BQU8sTUFBTSxNQUFNLFVBQVUsWUFBWSxPQUFPLE9BQU8sTUFBTSxNQUFNLFVBQVUsWUFBWSxPQUFPLE1BQU0sTUFBTSxRQUFRLFlBQVksT0FBTyxNQUFNLE1BQU0sUUFBUSxZQUFZLFdBQVcsTUFBTSxNQUFNLE1BQU0sUUFBUSxZQUFZLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLFNBQVMsTUFBTSxLQUFLLHNCQUFzQixxQkFBcUIscUJBQXFCLHFCQUFxQixxQkFBcUIsdUJBQXVCLE9BQU8sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLE1BQU0sTUFBTSxLQUFLLFVBQVUsTUFBTSxPQUFPLE1BQU0sTUFBTSxzQkFBc0IscUJBQXFCLE9BQU8sTUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFNLE9BQU8sTUFBTSxLQUFLLHNCQUFzQix1QkFBdUIsT0FBTyxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sT0FBTyxNQUFNLEtBQUssc0JBQXNCLHFCQUFxQixPQUFPLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssUUFBUSxPQUFPLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxNQUFNLEtBQUssVUFBVSxzVkFBc1YsdUJBQXVCLDJDQUEyQyxVQUFVLDhKQUE4SixjQUFjLEdBQUcsd0VBQXdFLG1CQUFtQixHQUFHLHNKQUFzSixtQkFBbUIscUJBQXFCLEdBQUcsb05BQW9OLDZCQUE2QixzQkFBc0IsOEJBQThCLFVBQVUsdUpBQXVKLHVDQUF1QywyQkFBMkIsVUFBVSx5TEFBeUwsa0NBQWtDLEdBQUcsMEpBQTBKLHlCQUF5Qix1Q0FBdUMsOENBQThDLFVBQVUseUZBQXlGLHdCQUF3QixHQUFHLHFLQUFxSyx1Q0FBdUMsMkJBQTJCLFVBQVUsc0VBQXNFLG1CQUFtQixHQUFHLG9IQUFvSCxtQkFBbUIsbUJBQW1CLHVCQUF1Qiw2QkFBNkIsR0FBRyxTQUFTLG9CQUFvQixHQUFHLFNBQVMsZ0JBQWdCLEdBQUcscUxBQXFMLHVCQUF1QixHQUFHLDRQQUE0UCwwQkFBMEIsNEJBQTRCLDhCQUE4QixzQkFBc0IsVUFBVSwrRkFBK0YsaUNBQWlDLEdBQUcsb0tBQW9LLG9DQUFvQyxHQUFHLHlKQUF5SiwrQkFBK0IsR0FBRywrTUFBK00sdUJBQXVCLGVBQWUsR0FBRyx3TUFBd00sbUNBQW1DLEdBQUcsOERBQThELG1DQUFtQyxHQUFHLHdRQUF3USw0QkFBNEIsMkJBQTJCLDJCQUEyQiw0QkFBNEIsdUJBQXVCLGdDQUFnQyxVQUFVLGdHQUFnRyw2QkFBNkIsR0FBRywrRUFBK0UsbUJBQW1CLEdBQUcsd0lBQXdJLDRCQUE0Qix1QkFBdUIsVUFBVSx3TEFBd0wsaUJBQWlCLEdBQUcsdUlBQXVJLG1DQUFtQyxpQ0FBaUMsVUFBVSwwSEFBMEgsNkJBQTZCLEdBQUcsNktBQTZLLGdDQUFnQywwQkFBMEIsVUFBVSxzTEFBc0wsbUJBQW1CLEdBQUcscUVBQXFFLHVCQUF1QixHQUFHLDhKQUE4SixrQkFBa0IsR0FBRyxnRUFBZ0Usa0JBQWtCLEdBQUcscUJBQXFCO0FBQ3QyUTtBQUNBLGlFQUFlLHVCQUF1QixFQUFDOzs7Ozs7Ozs7OztBQ3RXMUI7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNGQUFzRixxQkFBcUI7QUFDM0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RBLE1BQWtHO0FBQ2xHLE1BQXdGO0FBQ3hGLE1BQStGO0FBQy9GLE1BQWtIO0FBQ2xILE1BQTJHO0FBQzNHLE1BQTJHO0FBQzNHLE1BQXFHO0FBQ3JHO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMscUZBQU87Ozs7QUFJK0M7QUFDdkUsT0FBTyxpRUFBZSxxRkFBTyxJQUFJLHFGQUFPLFVBQVUscUZBQU8sbUJBQW1CLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekI3RSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUEwRztBQUMxRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLDBGQUFPOzs7O0FBSW9EO0FBQzVFLE9BQU8saUVBQWUsMEZBQU8sSUFBSSwwRkFBTyxVQUFVLDBGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7Ozs7Ozs7Ozs7Ozs7O0FDQThCO0FBQ0Q7QUFDTDtBQUNtQjtBQUUzQ2tLLDZDQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUnpGLGlEQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRVo7QUFDQWxCLFFBQVEsQ0FBQzhGLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDM0YsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07RUFDMUU7RUFDQTBGLGtEQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDYixJQUFNaUIsT0FBTyxHQUFHOUcsUUFBUSxDQUFDcUIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7RUFDdkR5RixPQUFPLENBQUN4QixTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7RUFDeEJxQiw2Q0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ1J6RixpREFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jc3MvZ2FtZS5jc3M/YTNjZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzPzZkNTQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgY3JlYXRlU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIGNvbXB1dGVyIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIGNvbXB1dGVyKCkge1xuXHRjb25zdCBjb21wQm9hcmQgPSBnYW1lQm9hcmQoKTsgLy8gY29tcHV0ZXIncyBnYW1lIGJvYXJkXG5cdGxldCBsYXN0SGl0ID0gbnVsbDsgLy8gbGFzdCBoaXQgY29vcmRpbmF0ZXNcblx0bGV0IGF0dGFja09wdGlvbnMgPSBbXTsgLy8gYXR0YWNrIG9wdGlvbnNcblx0bGV0IGlzVHVybiA9IGZhbHNlOyAvLyBpcyBpdCB0aGUgY29tcHV0ZXIncyB0dXJuP1xuXG5cdC8vIGNob29zZSBhIHJhbmRvbSBhdHRhY2tcblx0ZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG5cdFx0bGV0IHg7XG5cdFx0bGV0IHk7XG5cdFx0ZG8ge1xuXHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cdFx0fSB3aGlsZSAoZW5lbXkuaGl0Qm9hcmRbeV1beF0gIT09IHVuZGVmaW5lZCk7IC8vIGtlZXAgY2hvb3NpbmcgcmFuZG9tIGNvb3JkaW5hdGVzIHVudGlsIGEgdmFsaWQgb25lIGlzIGZvdW5kXG5cdFx0cmV0dXJuIHsgeCwgeSB9O1xuXHR9XG5cblx0Ly8gcGxhY2Ugc2hpcHMgcmFuZG9tbHlcblx0ZnVuY3Rpb24gcGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKSB7XG5cdFx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07XG5cdFx0c2hpcHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG5cdFx0XHRsZXQgeDtcblx0XHRcdGxldCB5O1xuXHRcdFx0bGV0IHZlcnRpY2FsO1xuXHRcdFx0Y29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoKTtcblx0XHRcdGRvIHtcblx0XHRcdFx0eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0eSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblx0XHRcdFx0dmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXHRcdFx0fSB3aGlsZSAoIWNvbXBCb2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpKTsgLy8ga2VlcCBjaG9vc2luZyByYW5kb20gY29vcmRpbmF0ZXMgdW50aWwgYSB2YWxpZCBvbmUgaXMgZm91bmRcblx0XHRcdGNvbXBCb2FyZC5wbGFjZVNoaXAoc2hpcCwgeCwgeSwgdmVydGljYWwpO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gY2hvb3NlIGFuIGF0dGFjayBiYXNlZCBvbiB0aGUgbGFzdCBoaXRcblx0ZnVuY3Rpb24gdGFyZ2V0QXR0YWNrKGVuZW15KSB7XG5cdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIGF0dGFjayBvcHRpb25zLCBjcmVhdGUgdGhlbVxuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9ucyA9IFtcblx0XHRcdFx0WzEsIDBdLFxuXHRcdFx0XHRbLTEsIDBdLFxuXHRcdFx0XHRbMCwgMV0sXG5cdFx0XHRcdFswLCAtMV0sXG5cdFx0XHRdO1xuXHRcdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKChkaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgbmV3WCA9IGxhc3RIaXQueCArIGRpclswXTtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IGxhc3RIaXQueSArIGRpclsxXTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPCAxMCAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPCAxMCAmJlxuXHRcdFx0XHRcdGVuZW15LmhpdEJvYXJkW25ld1ldW25ld1hdID09PSB1bmRlZmluZWRcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXR0YWNrT3B0aW9ucy5wdXNoKHsgeDogbmV3WCwgeTogbmV3WSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8vIGlmIHRoZXJlIGFyZSBubyBhdHRhY2sgb3B0aW9ucywgY2hvb3NlIGEgcmFuZG9tIGF0dGFja1xuXHRcdGlmIChhdHRhY2tPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHJhbmRvbUF0dGFjayhlbmVteSk7XG5cdFx0fVxuXHRcdHJldHVybiBhdHRhY2tPcHRpb25zLnNoaWZ0KCk7XG5cdH1cblxuXHQvLyBjaG9vc2UgYW4gYXR0YWNrXG5cdGZ1bmN0aW9uIGNob29zZUF0dGFjayhlbmVteSkge1xuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIGxhc3QgaGl0LCBjaG9vc2UgYSByYW5kb20gYXR0YWNrXG5cdFx0aWYgKGxhc3RIaXQgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiByYW5kb21BdHRhY2soZW5lbXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGFyZ2V0QXR0YWNrKGVuZW15KTtcblx0fVxuXG5cdC8vIGF0dGFjayB0aGUgcGxheWVyXG5cdGZ1bmN0aW9uIGF0dGFjayhwbGF5ZXIpIHtcblx0XHRjb25zdCB7IHgsIHkgfSA9IGNob29zZUF0dGFjayhwbGF5ZXIpOyAvLyBjaG9vc2UgYW4gYXR0YWNrXG5cdFx0Y29uc3QgYXR0YWNrUmVzdWx0ID0gcGxheWVyLnJlY2VpdmVBdHRhY2soeCwgeSk7IC8vIGF0dGFjayB0aGUgcGxheWVyXG5cdFx0Ly8gaWYgdGhlIGF0dGFjayB3YXMgYSBoaXQsIHVwZGF0ZSB0aGUgbGFzdCBoaXQgY29vcmRpbmF0ZXNcblx0XHRpZiAoYXR0YWNrUmVzdWx0ID09PSBcImhpdFwiKSB7XG5cdFx0XHRsYXN0SGl0ID0geyB4LCB5IH07XG5cdFx0fSBlbHNlIGlmIChhdHRhY2tSZXN1bHQgPT09IFwic3Vua1wiKSB7XG5cdFx0XHRsYXN0SGl0ID0gbnVsbDsgLy8gQ2xlYXIgbGFzdCBoaXRcblx0XHRcdGF0dGFja09wdGlvbnMgPSBbXTsgLy8gQ2xlYXIgYXR0YWNrIG9wdGlvbnNcblx0XHR9XG5cdFx0cmV0dXJuIHsgeCwgeSwgYXR0YWNrUmVzdWx0IH07XG5cdH1cblxuXHQvLyByZWNlaXZlIGFuIGF0dGFja1xuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cdH1cblxuXHQvLyBjaGVjayBpZiB0aGUgY29tcHV0ZXIgaGFzIGxvc3Rcblx0ZnVuY3Rpb24gaGFzTG9zdCgpIHtcblx0XHRyZXR1cm4gY29tcEJvYXJkLmFsbFNoaXBzU3VuaygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRyYW5kb21BdHRhY2ssXG5cdFx0cGxhY2VTaGlwc0F1dG9tYXRpY2FsbHksXG5cdFx0YXR0YWNrLFxuXHRcdHJlY2VpdmVBdHRhY2ssXG5cdFx0aGFzTG9zdCxcblx0XHRjaG9vc2VBdHRhY2ssXG5cdFx0Z2V0IGlzVHVybigpIHtcblx0XHRcdHJldHVybiBpc1R1cm47XG5cdFx0fSxcblx0XHRzZXQgaXNUdXJuKHZhbHVlKSB7XG5cdFx0XHRpc1R1cm4gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGdldCBjb21wQm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gY29tcEJvYXJkO1xuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBjb21wdXRlciBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IGNyZWF0ZVNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHtcblx0ZHJhd0JvYXJkLFxuXHR1cGRhdGVCb2FyZCxcblx0dXBkYXRlVHVybixcblx0bG9hZEdhbWUsXG5cdHdpbm5lcixcblx0c2hvd1BvcHVwLFxufSBmcm9tIFwiLi9nYW1lVUlcIjtcblxuLy8gcnVucyB0aGUgZ2FtZSBvbmNlIHRoZSB1c2VyIGhhcyBwbGFjZWQgYWxsIHRoZWlyIHNoaXBzXG5mdW5jdGlvbiBnYW1lVGltZSh1c2VyUGFyYW0sIGNvbXBQYXJhbSwgZ2FtZUFjdGl2ZVBhcmFtKSB7XG5cdGNvbnN0IHVzZXIgPSB1c2VyUGFyYW07IC8vIHVzZXIgb2JqZWN0XG5cdGNvbnN0IGNvbXAgPSBjb21wUGFyYW07IC8vIGNvbXB1dGVyIG9iamVjdFxuXHRsZXQgZ2FtZUFjdGl2ZSA9IGdhbWVBY3RpdmVQYXJhbTsgLy8gaXMgdGhlIGdhbWUgc3RpbGwgYWN0aXZlP1xuXG5cdGNvbXAucGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkoKTsgLy8gcGxhY2UgdGhlIGNvbXB1dGVyJ3Mgc2hpcHMgYXV0b21hdGljYWxseVxuXG5cdGRyYXdCb2FyZCh1c2VyLnBsYXllckJvYXJkLmJvYXJkKTsgLy8gZHJhdyB0aGUgdXNlcidzIGJvYXJkXG5cdGRyYXdCb2FyZChjb21wLmNvbXBCb2FyZC5ib2FyZCwgdHJ1ZSk7IC8vIGRyYXcgdGhlIGNvbXB1dGVyJ3MgYm9hcmRcblxuXHR1c2VyLmlzVHVybiA9IHRydWU7IC8vIHVzZXIgZ29lcyBmaXJzdFxuXHRjb21wLmlzVHVybiA9IGZhbHNlOyAvLyBjb21wdXRlciBnb2VzIHNlY29uZFxuXG5cdC8vIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGVuZW15IGJvYXJkXG5cdGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbmVteSAuY2VsbFwiKTtcblx0Y2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG5cdFx0XHQvLyBpZiB0aGUgZ2FtZSBpcyBub3QgYWN0aXZlIG9yIGl0IGlzIG5vdCB0aGUgdXNlcidzIHR1cm4sIGRvIG5vdGhpbmdcblx0XHRcdGlmICghZ2FtZUFjdGl2ZSB8fCAhdXNlci5pc1R1cm4pIHJldHVybjtcblx0XHRcdC8vIGlmIHRoZSBjZWxsIGhhcyBhbHJlYWR5IGJlZW4gaGl0LCBkbyBub3RoaW5nXG5cdFx0XHRpZiAoXG5cdFx0XHRcdGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSB8fFxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpXG5cdFx0XHQpXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdGNvbnN0IHsgeCB9ID0gZS50YXJnZXQuZGF0YXNldDsgLy8gZ2V0IHRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IHsgeSB9ID0gZS50YXJnZXQuZGF0YXNldDsgLy8gZ2V0IHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IHhJbnQgPSBwYXJzZUludCh4LCAxMCk7IC8vIGNvbnZlcnQgdGhlIHggY29vcmRpbmF0ZSB0byBhbiBpbnRlZ2VyXG5cdFx0XHRjb25zdCB5SW50ID0gcGFyc2VJbnQoeSwgMTApOyAvLyBjb252ZXJ0IHRoZSB5IGNvb3JkaW5hdGUgdG8gYW4gaW50ZWdlclxuXG5cdFx0XHRjb25zdCByZXN1bHQgPSB1c2VyLmF0dGFjayh4SW50LCB5SW50LCBjb21wKTsgLy8gYXR0YWNrIHRoZSBjb21wdXRlclxuXHRcdFx0dXBkYXRlQm9hcmQoeEludCwgeUludCwgcmVzdWx0LCB0cnVlKTsgLy8gdXBkYXRlIHRoZSBib2FyZFxuXG5cdFx0XHQvLyBpZiB0aGUgY29tcHV0ZXIgaGFzIGxvc3QsIGVuZCB0aGUgZ2FtZSBhbmQgc2hvdyB0aGUgcG9wdXBcblx0XHRcdGlmIChjb21wLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRnYW1lQWN0aXZlID0gZmFsc2U7IC8vIGdhbWUgaXMgbm8gbG9uZ2VyIGFjdGl2ZVxuXHRcdFx0XHR3aW5uZXIoXCJ1c2VyXCIpOyAvLyB1c2VyIHdvblxuXHRcdFx0XHRzaG93UG9wdXAoKTsgLy8gc2hvdyB0aGUgcGxheSBhZ2FpbiBwb3B1cFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbXB1dGVyJ3MgdHVyblxuXHRcdFx0dXNlci5pc1R1cm4gPSBmYWxzZTtcblx0XHRcdGNvbXAuaXNUdXJuID0gdHJ1ZTtcblx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pOyAvLyB1cGRhdGUgdGhlIHR1cm4gaW5kaWNhdG9yIHRleHRcblxuXHRcdFx0Ly8gY29tcHV0ZXIncyBhdHRhY2tcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRjb25zdCB7XG5cdFx0XHRcdFx0eDogY29tcFgsXG5cdFx0XHRcdFx0eTogY29tcFksXG5cdFx0XHRcdFx0YXR0YWNrUmVzdWx0OiBjb21wUmVzdWx0LFxuXHRcdFx0XHR9ID0gY29tcC5hdHRhY2sodXNlcik7XG5cdFx0XHRcdHVwZGF0ZUJvYXJkKGNvbXBYLCBjb21wWSwgY29tcFJlc3VsdCwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIGlmIHRoZSB1c2VyIGhhcyBsb3N0LCBlbmQgdGhlIGdhbWUgYW5kIHNob3cgdGhlIHBvcHVwXG5cdFx0XHRcdGlmICh1c2VyLmhhc0xvc3QoKSkge1xuXHRcdFx0XHRcdGdhbWVBY3RpdmUgPSBmYWxzZTsgLy8gZ2FtZSBpcyBubyBsb25nZXIgYWN0aXZlXG5cdFx0XHRcdFx0d2lubmVyKFwiY29tcFwiKTsgLy8gY29tcHV0ZXIgd29uXG5cdFx0XHRcdFx0c2hvd1BvcHVwKCk7IC8vIHNob3cgdGhlIHBsYXkgYWdhaW4gcG9wdXBcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB1c2VyJ3MgdHVyblxuXHRcdFx0XHR1c2VyLmlzVHVybiA9IHRydWU7XG5cdFx0XHRcdGNvbXAuaXNUdXJuID0gZmFsc2U7XG5cdFx0XHRcdHVwZGF0ZVR1cm4odXNlci5pc1R1cm4pOyAvLyB1cGRhdGUgdGhlIHR1cm4gaW5kaWNhdG9yIHRleHRcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuLy8gc3RhcnRzIHRoZSBnYW1lIGJ5IGFza2luZyB0aGUgdXNlciB0byBwbGFjZSB0aGVpciBzaGlwc1xuZnVuY3Rpb24gcGxheUdhbWUoKSB7XG5cdGNvbnN0IGdhbWVBY3RpdmUgPSB0cnVlOyAvLyB0aGUgZ2FtZSBpcyBhY3RpdmVcblx0Y29uc3QgdXNlciA9IHBsYXllcigpOyAvLyBjcmVhdGUgdGhlIHVzZXIgb2JqZWN0XG5cdGNvbnN0IGNvbXAgPSBjb21wdXRlcigpOyAvLyBjcmVhdGUgdGhlIGNvbXB1dGVyIG9iamVjdFxuXG5cdC8vIGdldCB0aGUgZ3JpZCBjZWxscyBhbmQgdGhlIHJvdGF0ZSBidXR0b25cblx0Y29uc3QgZ3JpZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWNlbGxcIik7XG5cdGNvbnN0IHJvdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ1dHRvblwiKTtcblx0Y29uc3Qgc2hpcHMgPSBbNSwgNCwgMywgMywgMl07IC8vIHRoZSBzaGlwcyB0byBiZSBwbGFjZWRcblx0bGV0IHNlbGVjdGVkU2hpcFNpemUgPSBzaGlwcy5zaGlmdCgpOyAvLyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHNoaXBcblx0bGV0IGlzSG9yaXpvbnRhbCA9IHRydWU7IC8vIE9yaWVudGF0aW9uIG9mIHRoZSBzaGlwXG5cblx0Ly8gQ2hlY2sgaWYgdGhlIHNoaXAgaXMgYWRqYWNlbnQgdG8gYW5vdGhlciBzaGlwXG5cdGZ1bmN0aW9uIGlzQWRqYWNlbnRCbG9ja2VkKHN0YXJ0WCwgc3RhcnRZLCBzaGlwU2l6ZSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpOyAvLyB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdGNvbnN0IHkgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFkgKyBpOyAvLyB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRcdC8vIENoZWNrIGFkamFjZW50IGNlbGxzXG5cdFx0XHRmb3IgKGxldCBhZGpYID0gLTE7IGFkalggPD0gMTsgYWRqWCArPSAxKSB7XG5cdFx0XHRcdGZvciAobGV0IGFkalkgPSAtMTsgYWRqWSA8PSAxOyBhZGpZICs9IDEpIHtcblx0XHRcdFx0XHRjb25zdCBuZWlnaGJvclggPSB4ICsgYWRqWDsgLy8geCBjb29yZGluYXRlIG9mIHRoZSBhZGphY2VudCBjZWxsXG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JZID0geSArIGFkalk7IC8vIHkgY29vcmRpbmF0ZSBvZiB0aGUgYWRqYWNlbnQgY2VsbFxuXHRcdFx0XHRcdC8vIFZhbGlkYXRlIG5laWdoYm9yIGNvb3JkaW5hdGVzXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0bmVpZ2hib3JYID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA8IDEwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclkgPj0gMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZIDwgMTBcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdC8vIGlmIHRoZXJlIGlzIGEgc2hpcCBhdCB0aGUgYWRqYWNlbnQgY2VsbCwgcmV0dXJuIHRydWVcblx0XHRcdFx0XHRcdGlmICh1c2VyLnBsYXllckJvYXJkLmhhc1NoaXBBdChuZWlnaGJvclgsIG5laWdoYm9yWSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGlmIHRoZXJlIGFyZSBubyBhZGphY2VudCBzaGlwcywgcmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gSGlnaGxpZ2h0IHRoZSBjZWxscyB3aGVyZSB0aGUgc2hpcCB3aWxsIGJlIHBsYWNlZFxuXHRmdW5jdGlvbiBoaWdobGlnaHRDZWxscyhlLCBzaGlwU2l6ZSkge1xuXHRcdGNvbnN0IHN0YXJ0WCA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQueCwgMTApOyAvLyB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbGxcblx0XHRjb25zdCBzdGFydFkgPSBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LnksIDEwKTsgLy8geSBjb29yZGluYXRlIG9mIHRoZSBjZWxsXG5cblx0XHQvLyBDaGVjayBpZiB0aGUgc2hpcCBpcyBhZGphY2VudCB0byBhbm90aGVyIHNoaXBcblx0XHRsZXQgaXNPdmVybGFwT3JBZGphY2VudCA9IGlzQWRqYWNlbnRCbG9ja2VkKHN0YXJ0WCwgc3RhcnRZLCBzaGlwU2l6ZSk7XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgc2hpcCBpcyBvdmVybGFwcGluZ1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuXHRcdFx0Y29uc3QgeCA9ICFpc0hvcml6b250YWwgPyBzdGFydFggOiBzdGFydFggKyBpO1xuXHRcdFx0Y29uc3QgeSA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WSArIGk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0YC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcblx0XHRcdCk7XG5cdFx0XHRpZiAoIWNlbGwgfHwgeCA+PSAxMCB8fCB5ID49IDEwIHx8IHVzZXIucGxheWVyQm9hcmQuaGFzU2hpcEF0KHgsIHkpKSB7XG5cdFx0XHRcdGlzT3ZlcmxhcE9yQWRqYWNlbnQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBIaWdobGlnaHQgdGhlIGNlbGxzXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCB4ID0gIWlzSG9yaXpvbnRhbCA/IHN0YXJ0WCA6IHN0YXJ0WCArIGk7XG5cdFx0XHRjb25zdCB5ID0gaXNIb3Jpem9udGFsID8gc3RhcnRZIDogc3RhcnRZICsgaTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxuXHRcdFx0KTtcblx0XHRcdGlmIChjZWxsKSB7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChpc092ZXJsYXBPckFkamFjZW50ID8gXCJvdmVybGFwXCIgOiBcImhpZ2hsaWdodFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgdGhlIGhpZ2hsaWdodCBmcm9tIHRoZSBjZWxsc1xuXHRmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoKSB7XG5cdFx0Z3JpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodFwiLCBcIm92ZXJsYXBcIik7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBncmlkIGNlbGxzXG5cdGdyaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0Ly8gV2hlbiB0aGUgbW91c2UgaXMgb3ZlciBhIGNlbGwsIGhpZ2hsaWdodCB0aGUgY2VsbHMgd2hlcmUgdGhlIHNoaXAgd2lsbCBiZSBwbGFjZWRcblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcblx0XHRcdGlmIChzZWxlY3RlZFNoaXBTaXplID09PSAtMSkgcmV0dXJuO1xuXHRcdFx0aGlnaGxpZ2h0Q2VsbHMoZSwgc2VsZWN0ZWRTaGlwU2l6ZSk7XG5cdFx0fSk7XG5cblx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCByZW1vdmVIaWdobGlnaHQpOyAvLyBXaGVuIHRoZSBtb3VzZSBsZWF2ZXMgdGhlIGNlbGwsIHJlbW92ZSB0aGUgaGlnaGxpZ2h0XG5cblx0XHQvLyBXaGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhIGNlbGwsIHBsYWNlIHRoZSBzaGlwXG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeCA9IHBhcnNlSW50KGNlbGwuZGF0YXNldC54LCAxMCk7XG5cdFx0XHRjb25zdCB5ID0gcGFyc2VJbnQoY2VsbC5kYXRhc2V0LnksIDEwKTtcblxuXHRcdFx0Ly8gSWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCwgcGxhY2UgaXRcblx0XHRcdGlmICh1c2VyLmNhblBsYWNlU2hpcChzZWxlY3RlZFNoaXBTaXplLCB4LCB5LCAhaXNIb3Jpem9udGFsKSkge1xuXHRcdFx0XHQvLyBjYXRjaCBhbnkgZXJyb3JzXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dXNlci5wbGFjZVNoaXAoY3JlYXRlU2hpcChzZWxlY3RlZFNoaXBTaXplKSwgeCwgeSwgIWlzSG9yaXpvbnRhbCk7IC8vIFBsYWNlIHRoZSBzaGlwXG5cblx0XHRcdFx0XHQvLyBWaXN1YWxpemUgdGhlIHBsYWNlZCBzaGlwXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZFNoaXBTaXplOyBpICs9IDEpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGxYID0gIWlzSG9yaXpvbnRhbCA/IHggOiB4ICsgaTtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGxZID0gaXNIb3Jpem9udGFsID8geSA6IHkgKyBpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2hpcENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRgLmdyaWQtY2VsbFtkYXRhLXg9XCIke2NlbGxYfVwiXVtkYXRhLXk9XCIke2NlbGxZfVwiXWAsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHRoZSBzaGlwIGNsYXNzIHRvIHRoZSBjZWxsXG5cdFx0XHRcdFx0XHRpZiAoc2hpcENlbGwpIHtcblx0XHRcdFx0XHRcdFx0c2hpcENlbGwuY2xhc3NMaXN0LmFkZChcImNlbGwtd2l0aC1zaGlwXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlbGVjdGVkU2hpcFNpemUgPSBzaGlwcy5zaGlmdCgpOyAvLyBHZXQgdGhlIG5leHQgc2hpcCBzaXplXG5cblx0XHRcdFx0XHQvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBzaGlwcyB0byBwbGFjZSwgc3RhcnQgdGhlIGdhbWVcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRTaGlwU2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZFNoaXBTaXplID0gLTE7IC8vIE5vIHNoaXAgaXMgc2VsZWN0ZWRcblx0XHRcdFx0XHRcdHJlbW92ZUhpZ2hsaWdodCgpOyAvLyBSZW1vdmUgdGhlIGhpZ2hsaWdodCBmcm9tIHRoZSBjZWxsc1xuXHRcdFx0XHRcdFx0bG9hZEdhbWUoKTsgLy8gTG9hZCB0aGUgZ2FtZVxuXHRcdFx0XHRcdFx0Z2FtZVRpbWUodXNlciwgY29tcCwgZ2FtZUFjdGl2ZSk7IC8vIFN0YXJ0IHRoZSBnYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdC8vIEhhbmRsZSBlcnJvclxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBIYW5kbGUgaW52YWxpZCBwbGFjZW1lbnRcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0Ly8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSByb3RhdGUgYnV0dG9uXG5cdHJvdGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlzSG9yaXpvbnRhbCA9ICFpc0hvcml6b250YWw7IC8vIENoYW5nZSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaXBcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXlHYW1lO1xuIiwiLy8gZ2FtZUJvYXJkIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIGdhbWVCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KSk7IC8vIDEweDEwIGJvYXJkXG5cblx0Ly8gdmFsaWRhdGUgY29vcmRpbmF0ZXNcblx0ZnVuY3Rpb24gdmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KSB7XG5cdFx0aWYgKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiIHx8IHggPCAwIHx8IHggPiA5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgOVwiKTtcblx0XHRpZiAodHlwZW9mIHkgIT09IFwibnVtYmVyXCIgfHwgeSA8IDAgfHwgeSA+IDkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ5IG11c3QgYmUgYmV0d2VlbiAwIGFuZCA5XCIpO1xuXHR9XG5cblx0Ly8gY2hlY2sgaWYgYSBzaGlwIGNhbiBiZSBwbGFjZWQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIGNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG5cdFx0dmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KTsgLy8gdmFsaWRhdGUgY29vcmRpbmF0ZXNcblx0XHRpZiAodHlwZW9mIGlzVmVydGljYWwgIT09IFwiYm9vbGVhblwiKVxuXHRcdFx0Ly8gdmFsaWRhdGUgaXNWZXJ0aWNhbFxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiaXNWZXJ0aWNhbCBtdXN0IGJlIGEgYm9vbGVhblwiKTtcblx0XHRjb25zdCBsZW5ndGggPSBzaGlwLmxlbmd0aCAtIDE7IC8vIGdldCBsZW5ndGggb2Ygc2hpcFxuXHRcdGNvbnN0IG1heFggPSBpc1ZlcnRpY2FsID8geCA6IHggKyBsZW5ndGg7IC8vIGdldCBtYXggeCBjb29yZGluYXRlXG5cdFx0Y29uc3QgbWF4WSA9IGlzVmVydGljYWwgPyB5ICsgbGVuZ3RoIDogeTsgLy8gZ2V0IG1heCB5IGNvb3JkaW5hdGVcblxuXHRcdGlmIChtYXhYID4gOSB8fCBtYXhZID4gOSkgcmV0dXJuIGZhbHNlOyAvLyBjaGVjayBpZiBzaGlwIGlzIG91dCBvZiBib3VuZHNcblxuXHRcdC8vIENoZWNrIGlmIHNoaXAgaXMgb3ZlcmxhcHBpbmcgb3IgYWRqYWNlbnQgdG8gYW5vdGhlciBzaGlwXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IGNoZWNrWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7IC8vIHggY29vcmRpbmF0ZSBvZiB0aGUgY2VsbFxuXHRcdFx0Y29uc3QgY2hlY2tZID0gaXNWZXJ0aWNhbCA/IHkgKyBpIDogeTsgLy8geSBjb29yZGluYXRlIG9mIHRoZSBjZWxsXG5cdFx0XHRpZiAoYm9hcmRbY2hlY2tZXVtjaGVja1hdICE9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTsgLy8gY2hlY2sgaWYgY2VsbCBpcyBvY2N1cGllZFxuXG5cdFx0XHQvLyBDaGVjayBhZGphY2VudCBjZWxsc1xuXHRcdFx0Zm9yIChsZXQgYWRqWCA9IC0xOyBhZGpYIDw9IDE7IGFkalggKz0gMSkge1xuXHRcdFx0XHRmb3IgKGxldCBhZGpZID0gLTE7IGFkalkgPD0gMTsgYWRqWSArPSAxKSB7XG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JYID0gY2hlY2tYICsgYWRqWDsgLy8geCBjb29yZGluYXRlIG9mIHRoZSBhZGphY2VudCBjZWxsXG5cdFx0XHRcdFx0Y29uc3QgbmVpZ2hib3JZID0gY2hlY2tZICsgYWRqWTsgLy8geSBjb29yZGluYXRlIG9mIHRoZSBhZGphY2VudCBjZWxsXG5cblx0XHRcdFx0XHQvLyBWYWxpZGF0ZSBuZWlnaGJvciBjb29yZGluYXRlc1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdG5laWdoYm9yWCA+PSAwICYmXG5cdFx0XHRcdFx0XHRuZWlnaGJvclggPCAxMCAmJlxuXHRcdFx0XHRcdFx0bmVpZ2hib3JZID49IDAgJiZcblx0XHRcdFx0XHRcdG5laWdoYm9yWSA8IDEwXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYXQgdGhlIGFkamFjZW50IGNlbGxcblx0XHRcdFx0XHRcdGlmIChib2FyZFtuZWlnaGJvclldW25laWdoYm9yWF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIHJldHVybiBmYWxzZSBpZiBzaGlwIGlzIGFkamFjZW50IHRvIGFub3RoZXIgc2hpcFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlOyAvLyByZXR1cm4gdHJ1ZSBpZiBzaGlwIGNhbiBiZSBwbGFjZWRcblx0fVxuXG5cdC8vIHBsYWNlIGEgc2hpcCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcblx0ZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHgsIHksIGlzVmVydGljYWwpIHtcblx0XHRpZiAoIWNhblBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHBsYWNlIHNoaXAgaGVyZVwiKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IHBsYWNlWCA9IGlzVmVydGljYWwgPyB4IDogeCArIGk7XG5cdFx0XHRjb25zdCBwbGFjZVkgPSBpc1ZlcnRpY2FsID8geSArIGkgOiB5O1xuXHRcdFx0Ym9hcmRbcGxhY2VZXVtwbGFjZVhdID0gc2hpcDtcblx0XHR9XG5cdH1cblxuXHQvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIGhhc1NoaXBBdCh4LCB5KSB7XG5cdFx0cmV0dXJuIGJvYXJkW3ldW3hdICE9PSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyByZWNlaXZlIGFuIGF0dGFjayBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcblx0ZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG5cdFx0dmFsaWRhdGVDb29yZGluYXRlcyh4LCB5KTsgLy8gdmFsaWRhdGUgY29vcmRpbmF0ZXNcblx0XHQvLyByZXR1cm4gXCJtaXNzXCIgaWYgdGhlcmUgaXMgbm8gc2hpcCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcblx0XHRpZiAoYm9hcmRbeV1beF0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ym9hcmRbeV1beF0gPSBcIm1pc3NcIjtcblx0XHRcdHJldHVybiBcIm1pc3NcIjtcblx0XHR9XG5cdFx0Ym9hcmRbeV1beF0uaGl0KCk7IC8vIGhpdCB0aGUgc2hpcFxuXHRcdC8vIHJldHVybiBcInN1bmtcIiBpZiB0aGUgc2hpcCBpcyBzdW5rXG5cdFx0aWYgKGJvYXJkW3ldW3hdLnN1bmspIHJldHVybiBcInN1bmtcIjtcblx0XHRyZXR1cm4gXCJoaXRcIjsgLy8gcmV0dXJuIFwiaGl0XCIgaWYgdGhlIHNoaXAgaXMgaGl0XG5cdH1cblxuXHQvLyBjaGVjayBpZiBhbGwgc2hpcHMgYXJlIHN1bmtcblx0ZnVuY3Rpb24gYWxsU2hpcHNTdW5rKCkge1xuXHRcdC8vIHJldHVybiB0cnVlIGlmIGFsbCBjZWxscyBhcmUgZW1wdHksIFwibWlzc1wiLCBvciBcInN1bmtcIlxuXHRcdHJldHVybiBib2FyZC5ldmVyeSgocm93KSA9PlxuXHRcdFx0cm93LmV2ZXJ5KFxuXHRcdFx0XHQoY2VsbCkgPT5cblx0XHRcdFx0XHRjZWxsID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRjZWxsID09PSBcIm1pc3NcIiB8fFxuXHRcdFx0XHRcdCh0eXBlb2YgY2VsbCA9PT0gXCJvYmplY3RcIiAmJiBjZWxsLnN1bmspLFxuXHRcdFx0KSxcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRnZXQgYm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gYm9hcmQ7XG5cdFx0fSxcblx0XHRjYW5QbGFjZVNoaXAsXG5cdFx0cGxhY2VTaGlwLFxuXHRcdGhhc1NoaXBBdCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGFsbFNoaXBzU3Vuayxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUJvYXJkO1xuIiwiaW1wb3J0IHNvbGRpZXIgZnJvbSBcIi4vaW1nL3NvbGRpZXIuc3ZnXCI7XG5pbXBvcnQgR2l0SHViIGZyb20gXCIuL2ltZy9naXQuc3ZnXCI7XG5cbi8vIENyZWF0ZSB0aGUgaGVhZGVyXG5mdW5jdGlvbiBoZWFkZXIoKSB7XG5cdGNvbnN0IGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJhci5jbGFzc0xpc3QuYWRkKFwibmF2LWJhclwiKTtcblxuXHRjb25zdCBsZWZ0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdGxlZnRJY29uLmNsYXNzTGlzdC5hZGQoXCJpY29uXCIpO1xuXHRsZWZ0SWNvbi5zcmMgPSBzb2xkaWVyO1xuXHRsZWZ0SWNvbi5hbHQgPSBcInNvbGRpZXJcIjtcblxuXHRjb25zdCB0aXRsZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRpdGxlQm94LmNsYXNzTGlzdC5hZGQoXCJoZWFkZXJcIik7XG5cdGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXHR0aXRsZS50ZXh0Q29udGVudCA9IFwiQmF0dGxlc2hpcFwiO1xuXHR0aXRsZUJveC5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cblx0Y29uc3QgcmlnaHRJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblx0cmlnaHRJY29uLmNsYXNzTGlzdC5hZGQoXCJpY29uXCIpO1xuXHRyaWdodEljb24uc3JjID0gc29sZGllcjtcblx0cmlnaHRJY29uLmFsdCA9IFwic29sZGllclwiO1xuXG5cdGJhci5hcHBlbmRDaGlsZChsZWZ0SWNvbik7XG5cdGJhci5hcHBlbmRDaGlsZCh0aXRsZUJveCk7XG5cdGJhci5hcHBlbmRDaGlsZChyaWdodEljb24pO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChiYXIpO1xufVxuXG4vLyBDcmVhdGUgdGhlIG1haW4gY29udGVudFxuZnVuY3Rpb24gbWFpbkNvbnRlbnQoKSB7XG5cdGNvbnN0IG1haW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRtYWluLmNsYXNzTGlzdC5hZGQoXCJtYWluLWNvbnRlbnRcIik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChtYWluKTtcbn1cblxuLy8gQ3JlYXRlIHRoZSB0dXJuIGluZGljYXRvclxuZnVuY3Rpb24gdHVybigpIHtcblx0Y29uc3QgdHVybkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHR1cm5EaXYuY2xhc3NMaXN0LmFkZChcInR1cm4tZGl2XCIpO1xuXHRjb25zdCB0dXJuSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0dHVybkluZGljYXRvci5jbGFzc0xpc3QuYWRkKFwidHVybi1pbmRpY2F0b3JcIik7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJZb3VyIFR1cm5cIjtcblx0dHVybkluZGljYXRvci5hcHBlbmRDaGlsZCh0dXJuVGV4dCk7XG5cdHR1cm5EaXYuYXBwZW5kQ2hpbGQodHVybkluZGljYXRvcik7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpLmFwcGVuZENoaWxkKHR1cm5EaXYpO1xufVxuXG4vLyBDcmVhdGUgdGhlIGJvYXJkIGNvbnRhaW5lclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoKSB7XG5cdGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1haW4tY29udGVudFwiKS5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbi8vIENyZWF0ZSB0aGUgcGxheWVyIGJvYXJkXG5mdW5jdGlvbiBwbGF5ZXJCb2FyZCgpIHtcblx0Y29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZC5jbGFzc0xpc3QuYWRkKFwicGxheWVyXCIpO1xuXG5cdGNvbnN0IGJvYXJkVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG5cdGJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBcIllvdXIgQm9hcmRcIjtcblx0Ym9hcmQuYXBwZW5kQ2hpbGQoYm9hcmRUaXRsZSk7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZEdyaWQpO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuYm9hcmRcIikuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG4vLyBDcmVhdGUgdGhlIGVuZW15IGJvYXJkXG5mdW5jdGlvbiBlbmVteUJvYXJkKCkge1xuXHRjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJlbmVteVwiKTtcblxuXHRjb25zdCBib2FyZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuXHRib2FyZFRpdGxlLnRleHRDb250ZW50ID0gXCJFbmVteSBCb2FyZFwiO1xuXHRib2FyZC5hcHBlbmRDaGlsZChib2FyZFRpdGxlKTtcblxuXHRjb25zdCBib2FyZEdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRib2FyZEdyaWQuY2xhc3NMaXN0LmFkZChcImJvYXJkLWdyaWRcIik7XG5cdGJvYXJkLmFwcGVuZENoaWxkKGJvYXJkR3JpZCk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5ib2FyZFwiKS5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbi8vIFJldHVybiB0aGUgYm9hcmQgZ3JpZFxuZnVuY3Rpb24gcmV0dXJuQm9hcmRHcmlkKGVuZW15KSB7XG5cdGxldCBib2FyZEdyaWQ7XG5cdGlmIChlbmVteSkge1xuXHRcdGJvYXJkR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuZW5lbXkgZGl2LmJvYXJkLWdyaWRcIik7XG5cdH0gZWxzZSB7XG5cdFx0Ym9hcmRHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5wbGF5ZXIgZGl2LmJvYXJkLWdyaWRcIik7XG5cdH1cblx0cmV0dXJuIGJvYXJkR3JpZDtcbn1cblxuLy8gRHJhdyB0aGUgYm9hcmRcbmZ1bmN0aW9uIGRyYXdCb2FyZChib2FyZCwgaXNFbmVteSA9IGZhbHNlKSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChpc0VuZW15KTtcblx0Ym9hcmRHcmlkLmlubmVySFRNTCA9IFwiXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkW2ldLmxlbmd0aDsgaiArPSAxKSB7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG5cdFx0XHRjZWxsLmRhdGFzZXQueCA9IGo7XG5cdFx0XHRjZWxsLmRhdGFzZXQueSA9IGk7XG5cblx0XHRcdGlmIChib2FyZFtpXVtqXSAhPT0gdW5kZWZpbmVkICYmICFpc0VuZW15KSB7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG5cdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChgc2hpcC0ke2JvYXJkW2ldW2pdLm5hbWV9YCk7XG5cdFx0XHR9XG5cdFx0XHRib2FyZEdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0fVxuXHR9XG59XG5cbi8vIGFkZCBtaXNzIGNsYXNzIHRvIHRoZSBjZWxsXG5mdW5jdGlvbiBtaXNzKHgsIHksIGVuZW15KSB7XG5cdGNvbnN0IGJvYXJkR3JpZCA9IHJldHVybkJvYXJkR3JpZChlbmVteSk7XG5cdGNvbnN0IGNlbGwgPSBib2FyZEdyaWQuY2hpbGRyZW5beSAqIDEwICsgeF07XG5cdGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG59XG5cbi8vIGFkZCBoaXQgY2xhc3MgdG8gdGhlIGNlbGxcbmZ1bmN0aW9uIGhpdCh4LCB5LCBlbmVteSkge1xuXHRjb25zdCBib2FyZEdyaWQgPSByZXR1cm5Cb2FyZEdyaWQoZW5lbXkpO1xuXHRjb25zdCBjZWxsID0gYm9hcmRHcmlkLmNoaWxkcmVuW3kgKiAxMCArIHhdO1xuXHRjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG59XG5cbi8vIHVwZGF0ZSB0aGUgYm9hcmQgYWZ0ZXIgYW4gYXR0YWNrXG5mdW5jdGlvbiB1cGRhdGVCb2FyZCh4LCB5LCByZXN1bHQsIGVuZW15KSB7XG5cdGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSB7XG5cdFx0bWlzcyh4LCB5LCBlbmVteSk7XG5cdH0gZWxzZSB7XG5cdFx0aGl0KHgsIHksIGVuZW15KTtcblx0fVxufVxuXG4vLyBzaG93cyB0aGUgc3RhcnQgcGFnZVxuZnVuY3Rpb24gc3RhcnRQYWdlKCkge1xuXHRjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5tYWluLWNvbnRlbnRcIik7XG5cdG1haW4uaW5uZXJIVE1MID0gXCJcIjsgLy8gY2xlYXIgdGhlIG1haW4gY29udGVudFxuXHR0dXJuKCk7IC8vIGNyZWF0ZSB0aGUgdHVybiBpbmRpY2F0b3Jcblx0Y29uc3QgdHVyblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnR1cm4taW5kaWNhdG9yIHBcIik7XG5cdHR1cm5UZXh0LnRleHRDb250ZW50ID0gXCJQbGFjZSB5b3VyIHNoaXBzIGJ5IGNsaWNraW5nIG9uIHRoZSBib2FyZCBiZWxvd1wiO1xuXG5cdGNvbnN0IHJvdGF0ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdHJvdGF0ZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwicm90YXRlLWNvbnRhaW5lclwiKTtcblxuXHRjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRyb3RhdGVCdXR0b24uY2xhc3NMaXN0LmFkZChcInJvdGF0ZS1idXR0b25cIik7XG5cdHJvdGF0ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiUm90YXRlXCI7XG5cdHJvdGF0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGVCdXR0b24pO1xuXHRtYWluLmFwcGVuZENoaWxkKHJvdGF0ZUNvbnRhaW5lcik7XG5cblx0Y29uc3QgYm9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0Ym9hcmRHcmlkLmNsYXNzTGlzdC5hZGQoXCJib2FyZC1ncmlkXCIpO1xuXHRtYWluLmFwcGVuZENoaWxkKGJvYXJkR3JpZCk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xuXHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG5cdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xuXHRcdGNlbGwuZGF0YXNldC54ID0gaSAlIDEwO1xuXHRcdGNlbGwuZGF0YXNldC55ID0gTWF0aC5mbG9vcihpIC8gMTApO1xuXHRcdGJvYXJkR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcblx0fVxufVxuXG4vLyBsb2FkIHRoZSBnYW1lXG5mdW5jdGlvbiBsb2FkR2FtZSgpIHtcblx0Y29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYubWFpbi1jb250ZW50XCIpO1xuXHRtYWluLmlubmVySFRNTCA9IFwiXCI7XG5cdHR1cm4oKTsgLy8gY3JlYXRlIHRoZSB0dXJuIGluZGljYXRvclxuXHRjcmVhdGVCb2FyZCgpOyAvLyBjcmVhdGUgdGhlIGJvYXJkIGNvbnRhaW5lclxuXHRwbGF5ZXJCb2FyZCgpOyAvLyBjcmVhdGUgdGhlIHBsYXllciBib2FyZFxuXHRlbmVteUJvYXJkKCk7IC8vIGNyZWF0ZSB0aGUgZW5lbXkgYm9hcmRcbn1cblxuLy8gdXBkYXRlIHRoZSB0dXJuIGluZGljYXRvciB0ZXh0XG5mdW5jdGlvbiB1cGRhdGVUdXJuKGlzVHVybikge1xuXHRjb25zdCB0dXJuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYudHVybi1pbmRpY2F0b3IgcFwiKTtcblx0dHVyblRleHQudGV4dENvbnRlbnQgPSBpc1R1cm4gPyBcIllvdXIgVHVyblwiIDogXCJDb21wdXRlcidzIFR1cm5cIjtcbn1cblxuLy8gc2hvdyB0aGUgd2lubmVyXG5mdW5jdGlvbiB3aW5uZXIocGxheWVyKSB7XG5cdGNvbnN0IHR1cm5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50dXJuLWluZGljYXRvciBwXCIpO1xuXHR0dXJuVGV4dC50ZXh0Q29udGVudCA9IGAke3BsYXllcn0gd29uIWA7XG59XG5cbi8vIGhpZGUgdGhlIHBsYXkgYWdhaW4gcG9wdXBcbmZ1bmN0aW9uIGhpZGVQb3B1cCgpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5QWdhaW5Qb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cbi8vIENyZWF0ZSB0aGUgZm9vdGVyXG5jb25zdCBjcmVhdGVGb290ZXIgPSAoKSA9PiB7XG5cdGNvbnN0IGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XG5cdGZvb3Rlci5jbGFzc0xpc3QuYWRkKFwiZm9vdGVyXCIpO1xuXG5cdGNvbnN0IGdpdEh1YlByb2ZpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblx0Z2l0SHViUHJvZmlsZS5ocmVmID0gXCJodHRwczovL2dpdGh1Yi5jb20vU2hhaGlyLTQ3XCI7XG5cblx0Y29uc3QgZ2l0SHViUHJvZmlsZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cdGdpdEh1YlByb2ZpbGVJbWcuc3JjID0gR2l0SHViO1xuXHRnaXRIdWJQcm9maWxlSW1nLmFsdCA9IFwiZ2l0SHViIExvZ29cIjtcblxuXHRjb25zdCBnaXRIdWJQcm9maWxlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRjb25zdCBhdFN5bWJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXHRhdFN5bWJvbC5jbGFzc0xpc3QuYWRkKFwiYXQtc3ltYm9sXCIpO1xuXHRhdFN5bWJvbC50ZXh0Q29udGVudCA9IFwiQFwiO1xuXHRjb25zdCB1c2VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXHR1c2VybmFtZS50ZXh0Q29udGVudCA9IFwiU2hhaGlyLTQ3XCI7XG5cdGdpdEh1YlByb2ZpbGVUZXh0LmFwcGVuZENoaWxkKGF0U3ltYm9sKTtcblx0Z2l0SHViUHJvZmlsZVRleHQuYXBwZW5kQ2hpbGQodXNlcm5hbWUpO1xuXG5cdGdpdEh1YlByb2ZpbGUuYXBwZW5kQ2hpbGQoZ2l0SHViUHJvZmlsZUltZyk7XG5cdGdpdEh1YlByb2ZpbGUuYXBwZW5kQ2hpbGQoZ2l0SHViUHJvZmlsZVRleHQpO1xuXG5cdGNvbnN0IHNlcGVyYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRzZXBlcmF0b3IudGV4dENvbnRlbnQgPSBcInxcIjtcblxuXHRjb25zdCBnaXRIdWJSZXBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdGdpdEh1YlJlcG8uaHJlZiA9IFwiaHR0cHM6Ly9naXRodWIuY29tL1NoYWhpci00Ny9CYXR0bGVzaGlwXCI7XG5cdGdpdEh1YlJlcG8udGV4dENvbnRlbnQgPSBcIlNvdXJjZSBDb2RlXCI7XG5cblx0Zm9vdGVyLmFwcGVuZENoaWxkKGdpdEh1YlByb2ZpbGUpO1xuXHRmb290ZXIuYXBwZW5kQ2hpbGQoc2VwZXJhdG9yKTtcblx0Zm9vdGVyLmFwcGVuZENoaWxkKGdpdEh1YlJlcG8pO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKS5hcHBlbmRDaGlsZChmb290ZXIpO1xufTtcblxuLy8gQ3JlYXRlIHRoZSBwYWdlXG5mdW5jdGlvbiBwYWdlKCkge1xuXHRoZWFkZXIoKTtcblx0bWFpbkNvbnRlbnQoKTtcblx0c3RhcnRQYWdlKCk7XG5cdGNyZWF0ZUZvb3RlcigpO1xufVxuXG4vLyBzaG93IHRoZSBwbGF5IGFnYWluIHBvcHVwXG5mdW5jdGlvbiBzaG93UG9wdXAoKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheUFnYWluUG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn1cblxuZXhwb3J0IHtcblx0cGFnZSxcblx0ZHJhd0JvYXJkLFxuXHR1cGRhdGVCb2FyZCxcblx0dXBkYXRlVHVybixcblx0bG9hZEdhbWUsXG5cdHdpbm5lcixcblx0c2hvd1BvcHVwLFxuXHRoaWRlUG9wdXAsXG59O1xuIiwiaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcblxuLy8gcGxheWVyIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHBsYXllcigpIHtcblx0Y29uc3QgcGxheWVyQm9hcmQgPSBnYW1lQm9hcmQoKTsgLy8gcGxheWVyJ3MgZ2FtZSBib2FyZFxuXHQvLyBwbGF5ZXIncyBoaXQgYm9hcmQgKHRvIGtlZXAgdHJhY2sgb2YgaGl0cyBhbmQgbWlzc2VzKVxuXHRjb25zdCBoaXRCb2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0pKTtcblx0bGV0IGlzVHVybiA9IGZhbHNlOyAvLyBpcyBpdCB0aGUgcGxheWVyJ3MgdHVybj9cblxuXHQvLyBwbGFjZSBhIHNoaXAgb24gdGhlIGJvYXJkXG5cdGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpIHtcblx0XHRwbGF5ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKTtcblx0fVxuXG5cdC8vIGNoZWNrIGlmIGEgc2hpcCBjYW4gYmUgcGxhY2VkIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuXHRmdW5jdGlvbiBjYW5QbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIHZlcnRpY2FsKSB7XG5cdFx0cmV0dXJuIHBsYXllckJvYXJkLmNhblBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgdmVydGljYWwpO1xuXHR9XG5cblx0Ly8gcmVjZWl2ZSBhbiBhdHRhY2sgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcblx0XHRjb25zdCByZXN1bHQgPSBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblx0XHRpZiAocmVzdWx0ID09PSBcImhpdFwiKSB7XG5cdFx0XHRoaXRCb2FyZFtjb2xdW3Jvd10gPSBcImhpdFwiO1xuXHRcdH0gZWxzZSBpZiAocmVzdWx0ID09PSBcInN1bmtcIikge1xuXHRcdFx0aGl0Qm9hcmRbY29sXVtyb3ddID0gXCJzdW5rXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhpdEJvYXJkW2NvbF1bcm93XSA9IFwibWlzc1wiO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0Ly8gYXR0YWNrIHRoZSBlbmVteSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcblx0ZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuXHRcdHJldHVybiBlbmVteS5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblx0fVxuXG5cdC8vIGNoZWNrIGlmIGFsbCBzaGlwcyBhcmUgc3Vua1xuXHRmdW5jdGlvbiBoYXNMb3N0KCkge1xuXHRcdHJldHVybiBwbGF5ZXJCb2FyZC5hbGxTaGlwc1N1bmsoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cGxhY2VTaGlwLFxuXHRcdGNhblBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdGF0dGFjayxcblx0XHRoYXNMb3N0LFxuXHRcdGdldCBpc1R1cm4oKSB7XG5cdFx0XHRyZXR1cm4gaXNUdXJuO1xuXHRcdH0sXG5cdFx0c2V0IGlzVHVybih2YWx1ZSkge1xuXHRcdFx0aXNUdXJuID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQgcGxheWVyQm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gcGxheWVyQm9hcmQ7XG5cdFx0fSxcblx0XHRnZXQgaGl0Qm9hcmQoKSB7XG5cdFx0XHRyZXR1cm4gaGl0Qm9hcmQ7XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiZnVuY3Rpb24gY3JlYXRlU2hpcChsZW5ndGgpIHtcblx0aWYgKHR5cGVvZiBsZW5ndGggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcImxlbmd0aCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRpZiAobGVuZ3RoIDwgMSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIik7XG5cdGlmIChsZW5ndGggJSAxICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhbiBpbnRlZ2VyXCIpO1xuXHRpZiAobGVuZ3RoID4gNSkgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgbGVzcyB0aGFuIDZcIik7XG5cblx0bGV0IG51bUhpdHMgPSAwOyAvLyBudW1iZXIgb2YgaGl0cyBvbiB0aGUgc2hpcFxuXHRsZXQgc3VuayA9IGZhbHNlOyAvLyB3aGV0aGVyIHRoZSBzaGlwIGlzIHN1bmtcblxuXHRyZXR1cm4ge1xuXHRcdGdldCBsZW5ndGgoKSB7XG5cdFx0XHRyZXR1cm4gbGVuZ3RoO1xuXHRcdH0sXG5cdFx0Z2V0IG51bUhpdHMoKSB7XG5cdFx0XHRyZXR1cm4gbnVtSGl0cztcblx0XHR9LFxuXHRcdGdldCBzdW5rKCkge1xuXHRcdFx0cmV0dXJuIHN1bms7XG5cdFx0fSxcblx0XHRoaXQoKSB7XG5cdFx0XHRudW1IaXRzICs9IDE7XG5cdFx0XHRpZiAobnVtSGl0cyA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdHN1bmsgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keSB7XG5cdC0tc2lkZWJhci1iZy1jb2xvcjogIzE5MjExYTtcblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcblx0bWFyZ2luOiAwO1xuXHRwYWRkaW5nOiAwO1xuXHRmb250LWZhbWlseTpcblx0XHRzeXN0ZW0tdWksXG5cdFx0LWFwcGxlLXN5c3RlbSxcblx0XHRCbGlua01hY1N5c3RlbUZvbnQsXG5cdFx0XCJTZWdvZSBVSVwiLFxuXHRcdFJvYm90byxcblx0XHRPeHlnZW4sXG5cdFx0VWJ1bnR1LFxuXHRcdENhbnRhcmVsbCxcblx0XHRcIk9wZW4gU2Fuc1wiLFxuXHRcdFwiSGVsdmV0aWNhIE5ldWVcIixcblx0XHRzYW5zLXNlcmlmO1xuXHRjb2xvcjogI2RkZGRkZDtcbn1cblxuZGl2I2NvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdGhlaWdodDogMTAwdmg7XG59XG5cbi5uYXYtYmFyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2lkZWJhci1iZy1jb2xvcik7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDVyZW07XG5cdHBhZGRpbmc6IDAgMXJlbTtcblx0cGFkZGluZy10b3A6IDAuMjVyZW07XG59XG5cbi5tYWluLWNvbnRlbnQge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0Z2FwOiAxcmVtO1xuXHRwYWRkaW5nOiAwIDFyZW07XG59XG5cbi5jZWxsLm92ZXJsYXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG5cdGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5oZWFkZXIgaDEge1xuXHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdGZvbnQtZmFtaWx5OiBcIkFyaWFsXCIsIHNhbnMtc2VyaWY7XG5cdGZvbnQtc2l6ZTogMzlweDtcblx0Y29sb3I6ICNmZmZmZmY4Nztcblx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcblx0cGFkZGluZzogMjBweDtcblx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblx0bGV0dGVyLXNwYWNpbmc6IDJweDtcblx0bWFyZ2luOiAwcHg7XG5cdHRleHQtc2hhZG93OiAycHggMnB4IDJweCAjNzM3MzczO1xufVxuXG4uaGVhZGVyIGgxOmhvdmVyIHtcblx0Y29sb3I6ICM4NDkxNzc7XG5cdGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmljb24ge1xuXHR3aWR0aDogNHJlbTtcblx0aGVpZ2h0OiBhdXRvO1xufVxuXG4udHVybi1pbmRpY2F0b3Ige1xuXHR3aWR0aDogNjAlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdGJvcmRlci1yYWRpdXM6IDFyZW07XG5cdHBhZGRpbmc6IDAuNXJlbTtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRiYWNrZ3JvdW5kOiAjZmZmZmZmODc7XG5cdGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KFxuXHRcdC00NWRlZyxcblx0XHQjY2RjYWNhODcgMCUsXG5cdFx0I2ZmZmZmZjg3IDUwJSxcblx0XHQjY2RjZGNkYTYgMTAwJVxuXHQpO1xuXHRiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChcblx0XHQtNDVkZWcsXG5cdFx0I2NkY2FjYTg3IDAlLFxuXHRcdCNmZmZmZmY4NyA1MCUsXG5cdFx0I2NkY2RjZGE2IDEwMCVcblx0KTtcblx0Ym94LXNoYWRvdzogMHB4IDRweCA4cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xufVxuLnR1cm4taW5kaWNhdG9yIHAge1xuXHRmb250LXNpemU6IDEuNXJlbTtcblx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdGNvbG9yOiAjMTkyMTFhO1xuXHRmb250LWZhbWlseTogXCJBcmlhbFwiLCBzYW5zLXNlcmlmO1xuXHR0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuXHRsZXR0ZXItc3BhY2luZzogMnB4O1xuXHRtYXJnaW4tYm90dG9tOiAzMHB4O1xuXHR0ZXh0LXNoYWRvdzogNHB4IDNweCAwcHggIzY1NzE1OTczO1xuXHRtYXJnaW46IDA7XG5cdHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlLWluLW91dDtcblx0b3BhY2l0eTogMTtcbn1cblxuLnJvdGF0ZS1jb250YWluZXIge1xuXHRkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuI3BsYXlBZ2FpbkJ1dHRvbixcbi5yb3RhdGUtYnV0dG9uIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzUwNjA1Mjtcblx0Y29sb3I6ICNjMWMxYzFkNjtcblx0Ym9yZGVyOiAycHggc29saWQgIzkyOTM5Mjtcblx0cGFkZGluZzogMTBweCAyMHB4O1xuXHRib3JkZXItcmFkaXVzOiA1cHg7XG5cdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRjdXJzb3I6IHBvaW50ZXI7XG5cdHRyYW5zaXRpb246XG5cdFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcblx0XHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcbn1cblxuI3BsYXlBZ2FpbkJ1dHRvbjpob3Zlcixcbi5yb3RhdGUtYnV0dG9uOmhvdmVyIHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTtcblx0Y29sb3I6ICNmZmZmZmY4Nztcbn1cblxuLmJvYXJkIHtcblx0ZGlzcGxheTogZ3JpZDtcblx0Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcblx0Z2FwOiAxcmVtO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5jZWxsIHtcblx0Y3Vyc29yOiBwb2ludGVyO1xufVxuXG4uY2VsbC5oaWdobGlnaHQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XG59XG5cbmRpdi5jZWxsLmJsb2NrZWQge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG5cdGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5jZWxsLXdpdGgtc2hpcCB7XG5cdGJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7XG5cdGJvcmRlcjogMXB4IHNvbGlkICNmZmZmZmY4Nztcbn1cblxuZGl2LmJvYXJkLWdyaWQgLmNlbGwuY2VsbC13aXRoLXNoaXAge1xuXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7XG59XG5cbi5ib2FyZCBoMiB7XG5cdG1hcmdpbjogMDtcbn1cblxuLnR1cm4tZGl2IHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbmRpdi5ib2FyZC1ncmlkIHtcblx0ZGlzcGxheTogZ3JpZDtcblx0Z3JpZC10ZW1wbGF0ZTogcmVwZWF0KDEwLCAyLjN2dykgLyByZXBlYXQoMTAsIDIuM3Z3KTtcblx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRnYXA6IDJweDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0anVzdGlmeS1pdGVtczogY2VudGVyO1xuXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0YWxpZ24tY29udGVudDogY2VudGVyO1xufVxuXG5kaXYuYm9hcmQtZ3JpZCAuY2VsbCB7XG5cdGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdHdpZHRoOiAxMDAlO1xuXHR0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlIDBzO1xufVxuXG4uZW5lbXksXG4ucGxheWVyIHtcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogMXJlbTtcbn1cblxuLnNoaXAge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWU5MGZmO1xufVxuXG4ubWlzcyB7XG5cdGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA4Nztcbn1cblxuZGl2LmNlbGwuaGl0IHtcblx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xuXHRib3JkZXI6IDFweCBzb2xpZCAjMDBmZjFlODc7XG59XG5cbi5wb3B1cCB7XG5cdGRpc3BsYXk6IG5vbmU7XG5cdHBvc2l0aW9uOiBmaXhlZDtcblx0bGVmdDogNTAlO1xuXHR0b3A6IDUwJTtcblx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG5cdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuXHRjb2xvcjogI2RkZGRkZDtcblx0cGFkZGluZzogMjBweDtcblx0ei1pbmRleDogMTAwMDsgLyogRW5zdXJlIGl0J3MgYWJvdmUgb3RoZXIgY29udGVudCAqL1xufVxuXG4ucG9wdXAtY29udGVudCB7XG5cdHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnBvcHVwLWNvbnRlbnQgcCB7XG5cdGZvbnQtc2l6ZTogMXJlbTtcblx0Zm9udC13ZWlnaHQ6IDkwMDtcbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZvb3RlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbmZvb3RlciB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRnYXA6IDFyZW07XG5cdHdpZHRoOiAxMDAlO1xuXHRoZWlnaHQ6IDIuNXJlbTtcblx0cGFkZGluZzogMXJlbSAwO1xuXHRwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xufVxuXG5mb290ZXIgYSB7XG5cdGRpc3BsYXk6IGZsZXg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGdhcDogMC41cmVtO1xuXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XG5cdGZvbnQtc2l6ZTogMS4zcmVtO1xuXHRmb250LXdlaWdodDogMTAwO1xuXHRjb2xvcjogIzk2OTI5Mjtcblx0Zm9udC1mYW1pbHk6XG5cdFx0amVkaSBzb2xpZCxcblx0XHRzeXN0ZW0tdWksXG5cdFx0LWFwcGxlLXN5c3RlbSxcblx0XHRCbGlua01hY1N5c3RlbUZvbnQsXG5cdFx0XCJTZWdvZSBVSVwiLFxuXHRcdFJvYm90byxcblx0XHRPeHlnZW4sXG5cdFx0VWJ1bnR1LFxuXHRcdENhbnRhcmVsbCxcblx0XHRcIk9wZW4gU2Fuc1wiLFxuXHRcdFwiSGVsdmV0aWNhIE5ldWVcIixcblx0XHRzYW5zLXNlcmlmO1xufVxuXG5mb290ZXIgcCB7XG5cdG1hcmdpbjogMC41cmVtIDA7XG59XG5cbmZvb3RlciBhOmhvdmVyLFxuZm9vdGVyIGE6YWN0aXZlIHtcblx0Y29sb3I6ICNmZmY7XG59XG5cbmZvb3RlciBhOmhvdmVyIGltZyxcbmZvb3RlciBhOmFjdGl2ZSBpbWcge1xuXHRmaWx0ZXI6IGJyaWdodG5lc3MoOTkpO1xufVxuXG4uYXQtc3ltYm9sIHtcblx0Zm9udC13ZWlnaHQ6IDkwMDtcblx0Zm9udC1mYW1pbHk6XG5cdFx0c3lzdGVtLXVpLFxuXHRcdC1hcHBsZS1zeXN0ZW0sXG5cdFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxuXHRcdFwiU2Vnb2UgVUlcIixcblx0XHRSb2JvdG8sXG5cdFx0T3h5Z2VuLFxuXHRcdFVidW50dSxcblx0XHRDYW50YXJlbGwsXG5cdFx0XCJPcGVuIFNhbnNcIixcblx0XHRcIkhlbHZldGljYSBOZXVlXCIsXG5cdFx0c2Fucy1zZXJpZjtcbn1cblxuZm9vdGVyIGltZyB7XG5cdHdpZHRoOiAycmVtO1xuXHRoZWlnaHQ6IGF1dG87XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jc3MvZ2FtZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7Q0FDQywyQkFBMkI7Q0FDM0IseUJBQXlCO0NBQ3pCLFNBQVM7Q0FDVCxVQUFVO0NBQ1Y7Ozs7Ozs7Ozs7O1lBV1c7Q0FDWCxjQUFjO0FBQ2Y7O0FBRUE7Q0FDQyxhQUFhO0NBQ2Isc0JBQXNCO0NBQ3RCLDZCQUE2QjtDQUM3QixvQkFBb0I7Q0FDcEIsYUFBYTtBQUNkOztBQUVBO0NBQ0MseUNBQXlDO0NBQ3pDLGFBQWE7Q0FDYix1QkFBdUI7Q0FDdkIsbUJBQW1CO0NBQ25CLFNBQVM7Q0FDVCxlQUFlO0NBQ2Ysb0JBQW9CO0FBQ3JCOztBQUVBO0NBQ0MsYUFBYTtDQUNiLHNCQUFzQjtDQUN0Qix1QkFBdUI7Q0FDdkIsU0FBUztDQUNULGVBQWU7QUFDaEI7O0FBRUE7Q0FD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OztDQUVDLHNCQUFzQjtBQUN2Qjs7QUFFQTtDQUNDLGdCQUFnQjtDQUNoQjs7Ozs7Ozs7Ozs7WUFXVztBQUNaOztBQUVBO0NBQ0MsV0FBVztDQUNYLFlBQVk7QUFDYlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5IHtcXG5cXHQtLXNpZGViYXItYmctY29sb3I6ICMxOTIxMWE7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcblxcdGNvbG9yOiAjZGRkZGRkO1xcbn1cXG5cXG5kaXYjY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcblxcdGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcblxcdGhlaWdodDogMTAwdmg7XFxufVxcblxcbi5uYXYtYmFyIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaWRlYmFyLWJnLWNvbG9yKTtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiA1cmVtO1xcblxcdHBhZGRpbmc6IDAgMXJlbTtcXG5cXHRwYWRkaW5nLXRvcDogMC4yNXJlbTtcXG59XFxuXFxuLm1haW4tY29udGVudCB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGdhcDogMXJlbTtcXG5cXHRwYWRkaW5nOiAwIDFyZW07XFxufVxcblxcbi5jZWxsLm92ZXJsYXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG5cXHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xcbn1cXG5cXG4uaGVhZGVyIGgxIHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0Zm9udC1mYW1pbHk6IFxcXCJBcmlhbFxcXCIsIHNhbnMtc2VyaWY7XFxuXFx0Zm9udC1zaXplOiAzOXB4O1xcblxcdGNvbG9yOiAjZmZmZmZmODc7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzE5MjExYTtcXG5cXHRwYWRkaW5nOiAyMHB4O1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDtcXG5cXHRtYXJnaW46IDBweDtcXG5cXHR0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggIzczNzM3MztcXG59XFxuXFxuLmhlYWRlciBoMTpob3ZlciB7XFxuXFx0Y29sb3I6ICM4NDkxNzc7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uaWNvbiB7XFxuXFx0d2lkdGg6IDRyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4udHVybi1pbmRpY2F0b3Ige1xcblxcdHdpZHRoOiA2MCU7XFxuXFx0aGVpZ2h0OiAxMDAlO1xcblxcdGJvcmRlci1yYWRpdXM6IDFyZW07XFxuXFx0cGFkZGluZzogMC41cmVtO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRiYWNrZ3JvdW5kOiAjZmZmZmZmODc7XFxuXFx0YmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQoXFxuXFx0XFx0LTQ1ZGVnLFxcblxcdFxcdCNjZGNhY2E4NyAwJSxcXG5cXHRcXHQjZmZmZmZmODcgNTAlLFxcblxcdFxcdCNjZGNkY2RhNiAxMDAlXFxuXFx0KTtcXG5cXHRiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChcXG5cXHRcXHQtNDVkZWcsXFxuXFx0XFx0I2NkY2FjYTg3IDAlLFxcblxcdFxcdCNmZmZmZmY4NyA1MCUsXFxuXFx0XFx0I2NkY2RjZGE2IDEwMCVcXG5cXHQpO1xcblxcdGJveC1zaGFkb3c6IDBweCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcXG59XFxuLnR1cm4taW5kaWNhdG9yIHAge1xcblxcdGZvbnQtc2l6ZTogMS41cmVtO1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkO1xcblxcdGNvbG9yOiAjMTkyMTFhO1xcblxcdGZvbnQtZmFtaWx5OiBcXFwiQXJpYWxcXFwiLCBzYW5zLXNlcmlmO1xcblxcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuXFx0bGV0dGVyLXNwYWNpbmc6IDJweDtcXG5cXHRtYXJnaW4tYm90dG9tOiAzMHB4O1xcblxcdHRleHQtc2hhZG93OiA0cHggM3B4IDBweCAjNjU3MTU5NzM7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlLWluLW91dDtcXG5cXHRvcGFjaXR5OiAxO1xcbn1cXG5cXG4ucm90YXRlLWNvbnRhaW5lciB7XFxuXFx0ZGlzcGxheTogZmxleDtcXG5cXHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbiNwbGF5QWdhaW5CdXR0b24sXFxuLnJvdGF0ZS1idXR0b24ge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICM1MDYwNTI7XFxuXFx0Y29sb3I6ICNjMWMxYzFkNjtcXG5cXHRib3JkZXI6IDJweCBzb2xpZCAjOTI5MzkyO1xcblxcdHBhZGRpbmc6IDEwcHggMjBweDtcXG5cXHRib3JkZXItcmFkaXVzOiA1cHg7XFxuXFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcblxcdHRyYW5zaXRpb246XFxuXFx0XFx0dHJhbnNmb3JtIDAuM3MgZWFzZSxcXG5cXHRcXHRiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcXG59XFxuXFxuI3BsYXlBZ2FpbkJ1dHRvbjpob3ZlcixcXG4ucm90YXRlLWJ1dHRvbjpob3ZlciB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzJjNzIzNTtcXG5cXHRjb2xvcjogI2ZmZmZmZjg3O1xcbn1cXG5cXG4uYm9hcmQge1xcblxcdGRpc3BsYXk6IGdyaWQ7XFxuXFx0Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcXG5cXHRnYXA6IDFyZW07XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24tY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uY2VsbCB7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uY2VsbC5oaWdobGlnaHQge1xcblxcdGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Ymx1ZTtcXG59XFxuXFxuZGl2LmNlbGwuYmxvY2tlZCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogcmVkO1xcblxcdGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5jZWxsLXdpdGgtc2hpcCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7XFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIC5jZWxsLmNlbGwtd2l0aC1zaGlwIHtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmODc7XFxufVxcblxcbi5ib2FyZCBoMiB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4udHVybi1kaXYge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5kaXYuYm9hcmQtZ3JpZCB7XFxuXFx0ZGlzcGxheTogZ3JpZDtcXG5cXHRncmlkLXRlbXBsYXRlOiByZXBlYXQoMTAsIDIuM3Z3KSAvIHJlcGVhdCgxMCwgMi4zdncpO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRnYXA6IDJweDtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbmRpdi5ib2FyZC1ncmlkIC5jZWxsIHtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG5cXHRoZWlnaHQ6IDEwMCU7XFxuXFx0d2lkdGg6IDEwMCU7XFxuXFx0dHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSAwcztcXG59XFxuXFxuLmVuZW15LFxcbi5wbGF5ZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXHRhbGlnbi1pdGVtczogY2VudGVyO1xcblxcdGdhcDogMXJlbTtcXG59XFxuXFxuLnNoaXAge1xcblxcdGJhY2tncm91bmQtY29sb3I6ICMxZTkwZmY7XFxufVxcblxcbi5taXNzIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwODc7XFxufVxcblxcbmRpdi5jZWxsLmhpdCB7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwZmYxZTg3O1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICMwMGZmMWU4NztcXG59XFxuXFxuLnBvcHVwIHtcXG5cXHRkaXNwbGF5OiBub25lO1xcblxcdHBvc2l0aW9uOiBmaXhlZDtcXG5cXHRsZWZ0OiA1MCU7XFxuXFx0dG9wOiA1MCU7XFxuXFx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXFx0Y29sb3I6ICNkZGRkZGQ7XFxuXFx0cGFkZGluZzogMjBweDtcXG5cXHR6LWluZGV4OiAxMDAwOyAvKiBFbnN1cmUgaXQncyBhYm92ZSBvdGhlciBjb250ZW50ICovXFxufVxcblxcbi5wb3B1cC1jb250ZW50IHtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5wb3B1cC1jb250ZW50IHAge1xcblxcdGZvbnQtc2l6ZTogMXJlbTtcXG5cXHRmb250LXdlaWdodDogOTAwO1xcbn1cXG5cXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRm9vdGVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5cXG5mb290ZXIge1xcblxcdGRpc3BsYXk6IGZsZXg7XFxuXFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuXFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXHRnYXA6IDFyZW07XFxuXFx0d2lkdGg6IDEwMCU7XFxuXFx0aGVpZ2h0OiAyLjVyZW07XFxuXFx0cGFkZGluZzogMXJlbSAwO1xcblxcdHBhZGRpbmctYm90dG9tOiAwLjVyZW07XFxufVxcblxcbmZvb3RlciBhIHtcXG5cXHRkaXNwbGF5OiBmbGV4O1xcblxcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFx0Z2FwOiAwLjVyZW07XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblxcdGZvbnQtc2l6ZTogMS4zcmVtO1xcblxcdGZvbnQtd2VpZ2h0OiAxMDA7XFxuXFx0Y29sb3I6ICM5NjkyOTI7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0amVkaSBzb2xpZCxcXG5cXHRcXHRzeXN0ZW0tdWksXFxuXFx0XFx0LWFwcGxlLXN5c3RlbSxcXG5cXHRcXHRCbGlua01hY1N5c3RlbUZvbnQsXFxuXFx0XFx0XFxcIlNlZ29lIFVJXFxcIixcXG5cXHRcXHRSb2JvdG8sXFxuXFx0XFx0T3h5Z2VuLFxcblxcdFxcdFVidW50dSxcXG5cXHRcXHRDYW50YXJlbGwsXFxuXFx0XFx0XFxcIk9wZW4gU2Fuc1xcXCIsXFxuXFx0XFx0XFxcIkhlbHZldGljYSBOZXVlXFxcIixcXG5cXHRcXHRzYW5zLXNlcmlmO1xcbn1cXG5cXG5mb290ZXIgcCB7XFxuXFx0bWFyZ2luOiAwLjVyZW0gMDtcXG59XFxuXFxuZm9vdGVyIGE6aG92ZXIsXFxuZm9vdGVyIGE6YWN0aXZlIHtcXG5cXHRjb2xvcjogI2ZmZjtcXG59XFxuXFxuZm9vdGVyIGE6aG92ZXIgaW1nLFxcbmZvb3RlciBhOmFjdGl2ZSBpbWcge1xcblxcdGZpbHRlcjogYnJpZ2h0bmVzcyg5OSk7XFxufVxcblxcbi5hdC1zeW1ib2wge1xcblxcdGZvbnQtd2VpZ2h0OiA5MDA7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sXFxuXFx0XFx0QmxpbmtNYWNTeXN0ZW1Gb250LFxcblxcdFxcdFxcXCJTZWdvZSBVSVxcXCIsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdE94eWdlbixcXG5cXHRcXHRVYnVudHUsXFxuXFx0XFx0Q2FudGFyZWxsLFxcblxcdFxcdFxcXCJPcGVuIFNhbnNcXFwiLFxcblxcdFxcdFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsXFxuXFx0XFx0c2Fucy1zZXJpZjtcXG59XFxuXFxuZm9vdGVyIGltZyB7XFxuXFx0d2lkdGg6IDJyZW07XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG5cdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG5cdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG5cdG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG5cdGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuXHRmb250LXNpemU6IDJlbTtcblx0bWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuXHRib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuXHRoZWlnaHQ6IDA7IC8qIDEgKi9cblx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cblx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG5cdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cblx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcblx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG5cdGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcblx0Zm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuXHRmb250LXNpemU6IDc1JTtcblx0bGluZS1oZWlnaHQ6IDA7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuXHRib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG5cdHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cblx0bGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cblx0bWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHtcblx0LyogMSAqL1xuXHRvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3Qge1xuXHQvKiAxICovXG5cdHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcblx0Ym9yZGVyLXN0eWxlOiBub25lO1xuXHRwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG5cdG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuXHRwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuXHRtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cblx0cGFkZGluZzogMDsgLyogMyAqL1xuXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG5cdG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuXHRwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuXHRoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG5cdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG5cdG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcblx0LXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuXHRmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG5cdGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuXHRkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcblx0ZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Q0FDQyxpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDdkM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLFNBQVM7QUFDVjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxjQUFjO0NBQ2QsZ0JBQWdCO0FBQ2pCOztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0NBQ0MsdUJBQXVCLEVBQUUsTUFBTTtDQUMvQixTQUFTLEVBQUUsTUFBTTtDQUNqQixpQkFBaUIsRUFBRSxNQUFNO0FBQzFCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLGlDQUFpQyxFQUFFLE1BQU07Q0FDekMsY0FBYyxFQUFFLE1BQU07QUFDdkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLDZCQUE2QjtBQUM5Qjs7QUFFQTs7O0VBR0U7O0FBRUY7Q0FDQyxtQkFBbUIsRUFBRSxNQUFNO0NBQzNCLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsaUNBQWlDLEVBQUUsTUFBTTtBQUMxQzs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxtQkFBbUI7QUFDcEI7O0FBRUE7OztFQUdFOztBQUVGOzs7Q0FHQyxpQ0FBaUMsRUFBRSxNQUFNO0NBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsY0FBYztBQUNmOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxjQUFjO0NBQ2QsY0FBYztDQUNkLGtCQUFrQjtDQUNsQix3QkFBd0I7QUFDekI7O0FBRUE7Q0FDQyxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MsV0FBVztBQUNaOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7Q0FDQyxrQkFBa0I7QUFDbkI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0NBS0Msb0JBQW9CLEVBQUUsTUFBTTtDQUM1QixlQUFlLEVBQUUsTUFBTTtDQUN2QixpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04saUJBQWlCO0FBQ2xCOztBQUVBOzs7RUFHRTs7QUFFRjs7Q0FFQyxNQUFNO0NBQ04sb0JBQW9CO0FBQ3JCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsMEJBQTBCO0FBQzNCOztBQUVBOztFQUVFOztBQUVGOzs7O0NBSUMsa0JBQWtCO0NBQ2xCLFVBQVU7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjs7OztDQUlDLDhCQUE4QjtBQUMvQjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLDhCQUE4QjtBQUMvQjs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtDQUNDLHNCQUFzQixFQUFFLE1BQU07Q0FDOUIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsY0FBYyxFQUFFLE1BQU07Q0FDdEIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsVUFBVSxFQUFFLE1BQU07Q0FDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7O0VBR0U7O0FBRUY7O0NBRUMsc0JBQXNCLEVBQUUsTUFBTTtDQUM5QixVQUFVLEVBQUUsTUFBTTtBQUNuQjs7QUFFQTs7RUFFRTs7QUFFRjs7Q0FFQyxZQUFZO0FBQ2I7O0FBRUE7OztFQUdFOztBQUVGO0NBQ0MsNkJBQTZCLEVBQUUsTUFBTTtDQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0FBQzdCOztBQUVBOztFQUVFOztBQUVGO0NBQ0Msd0JBQXdCO0FBQ3pCOztBQUVBOzs7RUFHRTs7QUFFRjtDQUNDLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsYUFBYSxFQUFFLE1BQU07QUFDdEI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7RUFFRTs7QUFFRjtDQUNDLGtCQUFrQjtBQUNuQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkOztBQUVBOztFQUVFOztBQUVGO0NBQ0MsYUFBYTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcblxcdGZvbnQtc2l6ZTogMmVtO1xcblxcdG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcblxcdGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuXFx0aGVpZ2h0OiAwOyAvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcblxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG5cXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG5cXHRmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcblxcdGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHtcXG5cXHQvKiAxICovXFxuXFx0b3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHtcXG5cXHQvKiAxICovXFxuXFx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuXFx0cGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuXFx0Y29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG5cXHRkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcblxcdG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcblxcdHBhZGRpbmc6IDA7IC8qIDMgKi9cXG5cXHR3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcblxcdG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG5cXHRwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG5cXHRoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuXFx0Zm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcblxcdGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG5cXHRkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuXFx0ZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcblxcdGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBwbGF5R2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgXCIuL2Nzcy9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgXCIuL2Nzcy9nYW1lLmNzc1wiO1xuaW1wb3J0IHsgcGFnZSwgaGlkZVBvcHVwIH0gZnJvbSBcIi4vZ2FtZVVJXCI7XG5cbnBhZ2UoKTsgLy8gc2hvdyB0aGUgc3RhcnQgcGFnZVxucGxheUdhbWUoKTsgLy8gc3RhcnQgdGhlIGdhbWVcblxuLy8gYWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBwbGF5IGFnYWluIGJ1dHRvblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5QWdhaW5CdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0Ly8gQ29kZSB0byByZXNldCB0aGUgZ2FtZSBhbmQgc3RhcnQgYWdhaW5cblx0aGlkZVBvcHVwKCk7IC8vIGhpZGUgdGhlIHBsYXkgYWdhaW4gcG9wdXBcblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYjY29udGVudFwiKTsgLy8gZ2V0IHRoZSBjb250ZW50IGRpdlxuXHRjb250ZW50LmlubmVySFRNTCA9IFwiXCI7IC8vIGNsZWFyIHRoZSBjb250ZW50IGRpdlxuXHRwYWdlKCk7IC8vIHNob3cgdGhlIHN0YXJ0IHBhZ2Vcblx0cGxheUdhbWUoKTsgLy8gc3RhcnQgdGhlIGdhbWVcbn0pO1xuIl0sIm5hbWVzIjpbImdhbWVCb2FyZCIsImNyZWF0ZVNoaXAiLCJjb21wdXRlciIsImNvbXBCb2FyZCIsImxhc3RIaXQiLCJhdHRhY2tPcHRpb25zIiwiaXNUdXJuIiwicmFuZG9tQXR0YWNrIiwiZW5lbXkiLCJ4IiwieSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImhpdEJvYXJkIiwidW5kZWZpbmVkIiwicGxhY2VTaGlwc0F1dG9tYXRpY2FsbHkiLCJzaGlwcyIsImZvckVhY2giLCJsZW5ndGgiLCJ2ZXJ0aWNhbCIsInNoaXAiLCJjYW5QbGFjZVNoaXAiLCJwbGFjZVNoaXAiLCJ0YXJnZXRBdHRhY2siLCJkaXJlY3Rpb25zIiwiZGlyIiwibmV3WCIsIm5ld1kiLCJwdXNoIiwic2hpZnQiLCJjaG9vc2VBdHRhY2siLCJhdHRhY2siLCJwbGF5ZXIiLCJfY2hvb3NlQXR0YWNrIiwiYXR0YWNrUmVzdWx0IiwicmVjZWl2ZUF0dGFjayIsImhhc0xvc3QiLCJhbGxTaGlwc1N1bmsiLCJ2YWx1ZSIsImRyYXdCb2FyZCIsInVwZGF0ZUJvYXJkIiwidXBkYXRlVHVybiIsImxvYWRHYW1lIiwid2lubmVyIiwic2hvd1BvcHVwIiwiZ2FtZVRpbWUiLCJ1c2VyUGFyYW0iLCJjb21wUGFyYW0iLCJnYW1lQWN0aXZlUGFyYW0iLCJ1c2VyIiwiY29tcCIsImdhbWVBY3RpdmUiLCJwbGF5ZXJCb2FyZCIsImJvYXJkIiwiY2VsbHMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjZWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImRhdGFzZXQiLCJ4SW50IiwicGFyc2VJbnQiLCJ5SW50IiwicmVzdWx0Iiwic2V0VGltZW91dCIsIl9jb21wJGF0dGFjayIsImNvbXBYIiwiY29tcFkiLCJjb21wUmVzdWx0IiwicGxheUdhbWUiLCJncmlkQ2VsbHMiLCJyb3RhdGVCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwic2VsZWN0ZWRTaGlwU2l6ZSIsImlzSG9yaXpvbnRhbCIsImlzQWRqYWNlbnRCbG9ja2VkIiwic3RhcnRYIiwic3RhcnRZIiwic2hpcFNpemUiLCJpIiwiYWRqWCIsImFkalkiLCJuZWlnaGJvclgiLCJuZWlnaGJvclkiLCJoYXNTaGlwQXQiLCJoaWdobGlnaHRDZWxscyIsImlzT3ZlcmxhcE9yQWRqYWNlbnQiLCJjb25jYXQiLCJhZGQiLCJyZW1vdmVIaWdobGlnaHQiLCJyZW1vdmUiLCJjZWxsWCIsImNlbGxZIiwic2hpcENlbGwiLCJlcnJvciIsIkFycmF5IiwiZnJvbSIsInZhbGlkYXRlQ29vcmRpbmF0ZXMiLCJFcnJvciIsImlzVmVydGljYWwiLCJtYXhYIiwibWF4WSIsImNoZWNrWCIsImNoZWNrWSIsInBsYWNlWCIsInBsYWNlWSIsImhpdCIsInN1bmsiLCJldmVyeSIsInJvdyIsIl90eXBlb2YiLCJzb2xkaWVyIiwiR2l0SHViIiwiaGVhZGVyIiwiYmFyIiwiY3JlYXRlRWxlbWVudCIsImxlZnRJY29uIiwic3JjIiwiYWx0IiwidGl0bGVCb3giLCJ0aXRsZSIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJyaWdodEljb24iLCJtYWluQ29udGVudCIsIm1haW4iLCJ0dXJuIiwidHVybkRpdiIsInR1cm5JbmRpY2F0b3IiLCJ0dXJuVGV4dCIsImNyZWF0ZUJvYXJkIiwiYm9hcmRUaXRsZSIsImJvYXJkR3JpZCIsImVuZW15Qm9hcmQiLCJyZXR1cm5Cb2FyZEdyaWQiLCJpc0VuZW15IiwiYXJndW1lbnRzIiwiaW5uZXJIVE1MIiwiaiIsIm5hbWUiLCJtaXNzIiwiY2hpbGRyZW4iLCJzdGFydFBhZ2UiLCJyb3RhdGVDb250YWluZXIiLCJoaWRlUG9wdXAiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImNyZWF0ZUZvb3RlciIsImZvb3RlciIsImdpdEh1YlByb2ZpbGUiLCJocmVmIiwiZ2l0SHViUHJvZmlsZUltZyIsImdpdEh1YlByb2ZpbGVUZXh0IiwiYXRTeW1ib2wiLCJ1c2VybmFtZSIsInNlcGVyYXRvciIsImdpdEh1YlJlcG8iLCJwYWdlIiwiY29sIiwibnVtSGl0cyIsImNvbnRlbnQiXSwic291cmNlUm9vdCI6IiJ9