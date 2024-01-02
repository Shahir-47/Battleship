// gameBoard factory function
function gameBoard() {
	const board = Array.from({ length: 10 }, () => Array.from({ length: 10 })); // 10x10 board

	// validate coordinates
	function validateCoordinates(x, y) {
		if (typeof x !== "number" || x < 0 || x > 9)
			throw new Error("x must be between 0 and 9");
		if (typeof y !== "number" || y < 0 || y > 9)
			throw new Error("y must be between 0 and 9");
	}

	// check if a ship can be placed at the given coordinates
	function canPlaceShip(ship, x, y, isVertical) {
		validateCoordinates(x, y); // validate coordinates
		if (typeof isVertical !== "boolean")
			// validate isVertical
			throw new Error("isVertical must be a boolean");
		const length = ship.length - 1; // get length of ship
		const maxX = isVertical ? x : x + length; // get max x coordinate
		const maxY = isVertical ? y + length : y; // get max y coordinate

		if (maxX > 9 || maxY > 9) return false; // check if ship is out of bounds

		// Check if ship is overlapping or adjacent to another ship
		for (let i = 0; i <= length; i += 1) {
			const checkX = isVertical ? x : x + i; // x coordinate of the cell
			const checkY = isVertical ? y + i : y; // y coordinate of the cell
			if (board[checkY][checkX] !== undefined) return false; // check if cell is occupied

			// Check adjacent cells
			for (let adjX = -1; adjX <= 1; adjX += 1) {
				for (let adjY = -1; adjY <= 1; adjY += 1) {
					const neighborX = checkX + adjX; // x coordinate of the adjacent cell
					const neighborY = checkY + adjY; // y coordinate of the adjacent cell

					// Validate neighbor coordinates
					if (
						neighborX >= 0 &&
						neighborX < 10 &&
						neighborY >= 0 &&
						neighborY < 10
					) {
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

		for (let i = 0; i < ship.length; i += 1) {
			const placeX = isVertical ? x : x + i;
			const placeY = isVertical ? y + i : y;
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
