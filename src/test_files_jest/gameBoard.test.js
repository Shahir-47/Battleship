import gameBoard from "../gameBoard";
import createShip from "../ship";

describe("gameBoard", () => {
	let board;
	let ship;

	beforeEach(() => {
		board = gameBoard();
		ship = createShip(2);
	});

	it("should return an object with a board property", () => {
		expect(board).toHaveProperty("board");
	});

	it("should return an object with a placeShip method", () => {
		expect(board).toHaveProperty("placeShip");
	});

	it("should return an object with a board property that is an array", () => {
		expect(Array.isArray(board.board)).toBe(true);
	});

	it("should return an object with a board property that is an array of length 10", () => {
		expect(board.board.length).toBe(10);
	});

	it("should return an object with a board property that is an array of arrays", () => {
		expect(Array.isArray(board.board[0])).toBe(true);
	});

	it("should return an object with a board property that is an array of arrays of length 10", () => {
		expect(board.board[0].length).toBe(10);
	});

	it("should throw an error if x is not a number", () => {
		expect(() => board.placeShip(ship, "a", 0, false)).toThrow(
			"x must be a number",
		);
	});

	it("should throw an error if y is not a number", () => {
		expect(() => board.placeShip(ship, 0, "a", false)).toThrow(
			"y must be a number",
		);
	});

	it("should throw an error if isVertical is not a boolean", () => {
		expect(() => board.placeShip(ship, 0, 0, "a")).toThrow(
			"isVertical must be a boolean",
		);
	});

	it("should throw an error if x is less than 0", () => {
		expect(() => board.placeShip(ship, -1, 0, false)).toThrow(
			"x must be between 0 and 9",
		);
	});

	it("should throw an error if x is greater than 9", () => {
		expect(() => board.placeShip(ship, 10, 0, false)).toThrow(
			"x must be between 0 and 9",
		);
	});

	it("should throw an error if y is less than 0", () => {
		expect(() => board.placeShip(ship, 0, -1, false)).toThrow(
			"y must be between 0 and 9",
		);
	});

	it("should throw an error if y is greater than 9", () => {
		expect(() => board.placeShip(ship, 0, 10, false)).toThrow(
			"y must be between 0 and 9",
		);
	});

	it("should throw an error if isVertical is true and ship does not fit on board", () => {
		expect(() => board.placeShip(ship, 0, 9, true)).toThrow(
			"ship must fit on board",
		);
	});

	it("should throw an error if isVertical is false and ship does not fit on board", () => {
		expect(() => board.placeShip(ship, 9, 0, false)).toThrow(
			"ship must fit on board",
		);
	});

	it("should throw an error if isVertical is true and ship overlaps another ship", () => {
		board.placeShip(ship, 0, 0, true);
		expect(() => board.placeShip(ship, 0, 0, true)).toThrow(
			"ship cannot overlap another ship",
		);
	});

	it("should throw an error if isVertical is false and ship overlaps another ship", () => {
		board.placeShip(ship, 0, 0, false);
		expect(() => board.placeShip(ship, 0, 0, false)).toThrow(
			"ship cannot overlap another ship",
		);
	});

	it("should place a ship vertically on the board", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0]).toBe(ship);
	});

	it("should place a ship horizontally on the board", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0]).toBe(ship);
	});

	it("should place a ship vertically on the board with the correct length", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0].length).toBe(2);
	});

	it("should place a ship horizontally on the board with the correct length", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0].length).toBe(2);
	});

	it("should place a ship vertically on the board with the correct numHits", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0].numHits).toBe(0);
	});

	it("should place a ship horizontally on the board with the correct numHits", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0].numHits).toBe(0);
	});

	it("should place a ship vertically on the board with the correct sunk value", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0].sunk).toBe(false);
	});

	it("should place a ship horizontally on the board with the correct sunk value", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0].sunk).toBe(false);
	});

	it("should place a ship vertically on the board with the correct hit method", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0].hit).toBeDefined();
	});

	it("should place a ship horizontally on the board with the correct hit method", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0].hit).toBeDefined();
	});

	it("should place a ship vertically on the board with the correct hit method that increments numHits by 1", () => {
		board.placeShip(ship, 0, 0, true);
		board.board[0][0].hit();
		expect(board.board[0][0].numHits).toBe(1);
	});

	it("should place a ship horizontally on the board with the correct hit method that increments numHits by 1", () => {
		board.placeShip(ship, 0, 0, false);
		board.board[0][0].hit();
		expect(board.board[0][0].numHits).toBe(1);
	});

	it("should place a ship vertically on the board with the correct hit method that sets sunk to true if numHits equals length", () => {
		board.placeShip(ship, 0, 0, true);
		board.board[0][0].hit();
		board.board[0][0].hit();
		expect(board.board[0][0].sunk).toBe(true);
	});

	it("should place a ship horizontally on the board with the correct hit method that sets sunk to true if numHits equals length", () => {
		board.placeShip(ship, 0, 0, false);
		board.board[0][0].hit();
		board.board[0][0].hit();
		expect(board.board[0][0].sunk).toBe(true);
	});

	it("should place a ship vertically on the board with the correct hit method that does not set sunk to true if numHits does not equal length", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0].sunk).toBe(false);
	});

	it("should place a ship horizontally on the board with the correct hit method that does not set sunk to true if numHits does not equal length", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0].sunk).toBe(false);
	});
});
