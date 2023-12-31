import gameBoard from "../gameBoard";
import createShip from "../ship";

describe("gameBoard", () => {
	let board, ship, ship1, ship2, attackResult;

	beforeEach(() => {
		board = gameBoard();
		ship = createShip(3);
		ship1 = createShip(3);
		ship2 = createShip(2);
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
		}).toThrow("Cannot place ship here");
	});

	test("placeShip should throw error if ship overlaps another ship", () => {
		board.placeShip(ship, 0, 0, false);
		expect(() => {
			board.placeShip(ship, 0, 0, true);
		}).toThrow("Cannot place ship here");
	});

	test("receiveAttack should correctly register a hit on a ship", () => {
		board.placeShip(ship, 0, 0, true);
		attackResult = board.receiveAttack(0, 0);
		expect(attackResult).toBe("hit");
		expect(ship.numHits).toBe(1);
	});

	test('receiveAttack should mark the board as "miss" on an empty location', () => {
		attackResult = board.receiveAttack(4, 4);
		expect(attackResult).toBe("miss");
		expect(board.board[4][4]).toBe("miss");
	});

	test("receiveAttack should not affect a ship not at the attack location", () => {
		board.placeShip(ship, 0, 0, true);
		attackResult = board.receiveAttack(4, 4);
		expect(attackResult).toBe("miss");
		expect(ship.numHits).toBe(0);
	});

	test("receiveAttack should sink a ship after enough hits", () => {
		board.placeShip(ship, 0, 0, true);
		board.receiveAttack(0, 0);
		board.receiveAttack(0, 1);
		attackResult = board.receiveAttack(0, 2);
		expect(attackResult).toBe("sunk");
		expect(ship.sunk).toBe(true);
	});

	test("allShipsSunk should return false when not all ships are sunk", () => {
		board.placeShip(ship1, 0, 0, false);
		board.placeShip(ship2, 5, 0, false);
		attackResult = board.receiveAttack(0, 0);
		expect(attackResult).toBe("hit");
		expect(board.allShipsSunk()).toBe(false);
	});

	test("allShipsSunk should return true when all ships are sunk", () => {
		board.placeShip(ship1, 0, 0, false);
		board.placeShip(ship2, 5, 0, false);

		board.receiveAttack(0, 0);
		board.receiveAttack(1, 0);
		attackResult = board.receiveAttack(2, 0);
		expect(attackResult).toBe("sunk");

		board.receiveAttack(5, 0);
		let attackResult2 = board.receiveAttack(6, 0);
		expect(attackResult2).toBe("sunk");

		expect(board.allShipsSunk()).toBe(true);
	});
});
