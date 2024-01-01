function gameBoard() {
	const board = Array.from({ length: 10 }, () => Array.from({ length: 10 }));

	function validateCoordinates(x, y) {
		if (typeof x !== "number" || x < 0 || x > 9)
			throw new Error("x must be between 0 and 9");
		if (typeof y !== "number" || y < 0 || y > 9)
			throw new Error("y must be between 0 and 9");
	}

	function canPlaceShip(ship, x, y, isVertical) {
		validateCoordinates(x, y);
		if (typeof isVertical !== "boolean")
			throw new Error("isVertical must be a boolean");
		const length = ship.length - 1;
		const maxX = isVertical ? x : x + length;
		const maxY = isVertical ? y + length : y;

		if (maxX > 9 || maxY > 9) return false;

		for (let i = 0; i <= length; i += 1) {
			const checkX = isVertical ? x : x + i;
			const checkY = isVertical ? y + i : y;
			if (board[checkY][checkX] !== undefined) return false;

			// Check adjacent cells
			for (let adjX = -1; adjX <= 1; adjX += 1) {
				for (let adjY = -1; adjY <= 1; adjY += 1) {
					const neighborX = checkX + adjX;
					const neighborY = checkY + adjY;

					// Validate neighbor coordinates
					if (
						neighborX >= 0 &&
						neighborX < 10 &&
						neighborY >= 0 &&
						neighborY < 10
					) {
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

		for (let i = 0; i < ship.length; i += 1) {
			const placeX = isVertical ? x : x + i;
			const placeY = isVertical ? y + i : y;
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
		return board.every((row) =>
			row.every(
				(cell) =>
					cell === undefined ||
					cell === "miss" ||
					(typeof cell === "object" && cell.sunk),
			),
		);
	}

	return {
		get board() {
			return board;
		},
		canPlaceShip,
		placeShip,
		hasShipAt,
		receiveAttack,
		allShipsSunk,
	};
}

export default gameBoard;
