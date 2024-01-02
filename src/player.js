import gameBoard from "./gameBoard";

// player factory function
function player() {
	const playerBoard = gameBoard(); // player's game board
	// player's hit board (to keep track of hits and misses)
	const hitBoard = Array.from({ length: 10 }, () => Array.from({ length: 10 }));
	let isTurn = false; // is it the player's turn?

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
		const result = playerBoard.receiveAttack(row, col);
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
		placeShip,
		canPlaceShip,
		receiveAttack,
		attack,
		hasLost,
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
		},
	};
}

export default player;
