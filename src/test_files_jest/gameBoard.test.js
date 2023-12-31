import gameBoard from "../gameBoard";
import createShip from "../ship";

describe("gameBoard", () => {
	let board;
	let ship;

	beforeEach(() => {
		board = gameBoard();
		ship = createShip(3);
	});

	test("board should be 10x10", () => {
		expect(board.board.length).toBe(10);
		expect(board.board[0].length).toBe(10);
	});

	test("placeShip should place a ship correctly horizontally", () => {
		board.placeShip(ship, 0, 0, false);
		expect(board.board[0][0]).toBe(ship);
		expect(board.board[0][1]).toBe(ship);
		expect(board.board[0][2]).toBe(ship);
	});

	test("placeShip should place a ship correctly vertically", () => {
		board.placeShip(ship, 0, 0, true);
		expect(board.board[0][0]).toBe(ship);
		expect(board.board[1][0]).toBe(ship);
		expect(board.board[2][0]).toBe(ship);
	});

	test("placeShip should throw error if ship is placed out of bounds", () => {
		expect(() => {
			board.placeShip(ship, 8, 0, false);
		}).toThrow("ship must fit on board");
	});

	test("placeShip should throw error if ship overlaps another ship", () => {
		board.placeShip(ship, 0, 0, false);
		expect(() => {
			board.placeShip(ship, 0, 0, true);
		}).toThrow("ship cannot overlap another ship");
	});

	test("receiveAttack should correctly register a hit on a ship", () => {
		board.placeShip(ship, 0, 0, true);
		board.receiveAttack(0, 0);
		expect(ship.numHits).toBe(1);
	});

	test('receiveAttack should mark the board as "miss" on an empty location', () => {
		board.receiveAttack(4, 4);
		expect(board.board[4][4]).toBe("miss");
	});

	test("receiveAttack should not affect a ship not at the attack location", () => {
		board.placeShip(ship, 0, 0, true);
		board.receiveAttack(4, 4);
		expect(ship.numHits).toBe(0);
	});

	test("receiveAttack should sink a ship after enough hits", () => {
		board.placeShip(ship, 0, 0, true);
		board.receiveAttack(0, 0);
		board.receiveAttack(1, 0);
		board.receiveAttack(2, 0);
		expect(ship.sunk).toBe(true);
	});
});
