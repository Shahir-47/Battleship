import gameBoard from "./gameBoard";
import createShip from "./ship";

// computer factory function
function computer() {
	const compBoard = gameBoard(); // computer's game board
	let lastHit = null; // last hit coordinates
	let attackOptions = []; // attack options
	let isTurn = false; // is it the computer's turn?

	// choose a random attack
	function randomAttack(enemy) {
		let x;
		let y;
		do {
			x = Math.floor(Math.random() * 10);
			y = Math.floor(Math.random() * 10);
		} while (enemy.hitBoard[y][x] !== undefined); // keep choosing random coordinates until a valid one is found
		return { x, y };
	}

	// place ships randomly
	function placeShipsAutomatically() {
		const ships = [5, 4, 3, 3, 2];
		ships.forEach((length) => {
			let x;
			let y;
			let vertical;
			const ship = createShip(length);
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
			const directions = [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			];
			directions.forEach((dir) => {
				const newX = lastHit.x + dir[0];
				const newY = lastHit.y + dir[1];
				if (
					newX >= 0 &&
					newX < 10 &&
					newY >= 0 &&
					newY < 10 &&
					enemy.hitBoard[newY][newX] === undefined
				) {
					attackOptions.push({ x: newX, y: newY });
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
		const { x, y } = chooseAttack(player); // choose an attack
		const attackResult = player.receiveAttack(x, y); // attack the player
		// if the attack was a hit, update the last hit coordinates
		if (attackResult === "hit") {
			lastHit = { x, y };
		} else if (attackResult === "sunk") {
			lastHit = null; // Clear last hit
			attackOptions = []; // Clear attack options
		}
		return { x, y, attackResult };
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
		randomAttack,
		placeShipsAutomatically,
		attack,
		receiveAttack,
		hasLost,
		chooseAttack,
		get isTurn() {
			return isTurn;
		},
		set isTurn(value) {
			isTurn = value;
		},
		get compBoard() {
			return compBoard;
		},
	};
}

export default computer;
