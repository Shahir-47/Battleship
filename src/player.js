import gameBoard from "./gameBoard";

function player(name = "anonymous") {
	const playerBoard = gameBoard();
	const hitBoard = Array.from({ length: 10 }, () => Array.from({ length: 10 }));
	let isTurn = false;

	function placeShip(ship, row, col, vertical) {
		playerBoard.placeShip(ship, row, col, vertical);
	}

	function receiveAttack(row, col) {
		let result = playerBoard.receiveAttack(row, col);
		if (result === "hit") {
			hitBoard[row][col] = "hit";
		} else if (result === "sunk") {
			hitBoard[row][col] = "sunk";
		} else {
			hitBoard[row][col] = "miss";
		}
		return result;
	}

	function attack(row, col, enemy) {
		return enemy.receiveAttack(row, col);
	}

	function hasLost() {
		return playerBoard.allShipsSunk();
	}

	return {
		name,
		placeShip,
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
