import gameBoard from "./gameBoard";

function player(name = "anonymous") {
	const playerBoard = gameBoard();
	let isTurn = false;

	function placeShip(ship, row, col, vertical) {
		playerBoard.placeShip(ship, row, col, vertical);
	}

	function receiveAttack(row, col) {
		return playerBoard.receiveAttack(row, col);
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
	};
}

export default player;
