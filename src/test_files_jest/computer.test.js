import computer from "../computer";
import createShip from "../ship";

jest.mock("../ship"); // Mock the createShip function

describe("computer module", () => {
	let testComputer;
	let mockPlayer;

	beforeEach(() => {
		testComputer = computer();

		// Mock player object with a hitBoard for tracking hits
		mockPlayer = {
			receiveAttack: jest.fn(),
			hitBoard: Array.from({ length: 10 }, () => Array(10).fill(undefined)),
		};

		// Mock the createShip function to return a simple mock ship
		createShip.mockImplementation((length) => ({
			length,
			numHits: 0,
			hit() {
				this.numHits++;
				if (this.numHits === length) {
					this.sunk = true;
				}
			},
			sunk: false,
		}));
	});

	test("should place ships automatically on the board", () => {
		testComputer.placeShipsAutomatically();
		expect(
			testComputer.compBoard.board.some((row) => row.some((cell) => cell)),
		).toBeTruthy();
	});

	test("random attack generates valid coordinates", () => {
		const { x, y } = testComputer.randomAttack(mockPlayer);
		expect(x).toBeGreaterThanOrEqual(0);
		expect(x).toBeLessThan(10);
		expect(y).toBeGreaterThanOrEqual(0);
		expect(y).toBeLessThan(10);
	});

	test("receiveAttack marks hit or miss correctly", () => {
		// Place a mock ship at a specific location
		const mockShip = createShip(3);
		testComputer.compBoard.board[0][0] = mockShip;

		// Attack the location with the ship
		let result = testComputer.receiveAttack(0, 0);
		expect(result).toBe("hit");
		expect(mockShip.numHits).toBe(1);

		// Attack the same ship again
		result = testComputer.receiveAttack(0, 0);
		expect(result).toBe("hit"); // Still not sunk
		expect(mockShip.numHits).toBe(2);

		// Final hit to sink the ship
		result = testComputer.receiveAttack(0, 0);
		expect(result).toBe("sunk");
		expect(mockShip.numHits).toBe(3);
		expect(mockShip.sunk).toBeTruthy();

		// Attack an empty location
		result = testComputer.receiveAttack(1, 1);
		expect(result).toBe("miss");
	});

	test("attack function should call receiveAttack on player", () => {
		testComputer.attack(mockPlayer);
		expect(mockPlayer.receiveAttack).toHaveBeenCalled();
	});

	test("hasLost should return true if all ships are sunk", () => {
		// Mock situation where all ships are sunk
		testComputer.compBoard.board.forEach((row) => row.fill({ sunk: true }));
		expect(testComputer.hasLost()).toBeTruthy();
	});
});
