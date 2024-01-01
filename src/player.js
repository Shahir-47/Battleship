import gameBoard from "./gameBoard";

function player(name = "anonymous") {
	const playerBoard = gameBoard();
	const hitBoard = Array.from({ length: 10 }, () => Array.from({ length: 10 }));
	let isTurn = false;

	function placeShip(ship, row, col, vertical) {
		playerBoard.placeShip(ship, row, col, vertical);
	}

	function receiveAttack(row, col) {
		const result = playerBoard.receiveAttack(row, col);
		if (result === "hit") {
			hitBoard[col][row] = "hit";
		} else if (result === "sunk") {
			hitBoard[col][row] = "sunk";
		} else {
			hitBoard[col][row] = "miss";
		}
		console.log(`player hitBoard:`);
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
