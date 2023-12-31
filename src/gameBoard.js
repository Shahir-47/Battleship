function gameBoard() {
	let board = Array.from({ length: 10 }, () => Array.from({ length: 10 }));

	function placeShip(ship, x, y, isVertical) {
		if (typeof x !== "number") throw new Error("x must be a number");
		if (typeof y !== "number") throw new Error("y must be a number");
		if (typeof isVertical !== "boolean")
			throw new Error("isVertical must be a boolean");
		if (x < 0 || x > 9) throw new Error("x must be between 0 and 9");
		if (y < 0 || y > 9) throw new Error("y must be between 0 and 9");
		if (isVertical) {
			if (y + (ship.length - 1) > 9) throw new Error("ship must fit on board");
			if (board[y + ship.length - 1][x] !== undefined)
				throw new Error("ship cannot overlap another ship");
			for (let i = 0; i < ship.length; i += 1) {
				if (board[y + i][x] !== undefined)
					throw new Error("ship cannot overlap another ship");
			}
			for (let i = 0; i < ship.length; i += 1) {
				board[y + i][x] = ship;
			}
		} else {
			if (x + (ship.length - 1) > 9) throw new Error("ship must fit on board");
			if (board[y][x + ship.length - 1] !== undefined)
				throw new Error("ship cannot overlap another ship");
			for (let i = 0; i < ship.length; i += 1) {
				if (board[y][x + i] !== undefined)
					throw new Error("ship cannot overlap another ship");
			}
			for (let i = 0; i < ship.length; i += 1) {
				board[y][x + i] = ship;
			}
		}
	}

	return {
		get board() {
			return board;
		},
		placeShip,
	};
}

export default gameBoard;
