import gameBoard from "./gameBoard";
import createShip from "./ship";

function computer() {
	const compBoard = gameBoard();
	let lastHit = null;
	let targetMode = false;
	let attackOptions = []; // Stores potential cells to attack in target mode
	let isTurn = false;

	function randomAttack(enemy) {
		let x;
		let y;
		do {
			x = Math.floor(Math.random() * 10);
			y = Math.floor(Math.random() * 10);
		} while (enemy.hitBoard[y][x] !== undefined);
		return { x, y };
	}

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
			} while (!compBoard.canPlaceShip(ship, x, y, vertical));
			compBoard.placeShip(ship, x, y, vertical);
		});
	}

	function targetAttack(enemy) {
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

		return attackOptions.shift();
	}

	function chooseAttack(enemy) {
		return targetMode ? targetAttack(enemy) : randomAttack(enemy);
	}

	function attack(player) {
		const { x, y } = chooseAttack(player);
		console.log(`x: ${x}, y: ${y}`);
		const attackResult = player.receiveAttack(x, y);
		console.log(`computer attackResult: ${attackResult}`);
		if (attackResult === "hit") {
			lastHit = { x, y };
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
		return { x, y, attackResult };
	}

	function receiveAttack(x, y) {
		return compBoard.receiveAttack(x, y);
	}

	function hasLost() {
		return compBoard.allShipsSunk();
	}

	return {
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
		get targetMode() {
			return targetMode;
		},
	};
}

export default computer;
