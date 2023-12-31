import computer from "../computer";
import gameBoard from "../gameBoard";
import createShip from "../ship";
import player from "../player";

describe("computer", () => {
	let comp;
	let mockPlayer;

	beforeEach(() => {
		comp = computer();
		// Setup a mock player with a basic receiveAttack function
		mockPlayer = {
			board: Array.from({ length: 10 }, () => Array.from({ length: 10 })),
			receiveAttack: jest.fn((x, y) => {
				if (!mockPlayer.board[x][y]) {
					mockPlayer.board[x][y] = "miss";
					return "miss";
				}
				// Assume a hit for simplicity
				return "hit";
			}),
			placeShip: jest.fn(createShip),
		};
		comp.placeShipsAutomatically();
	});

	test("computer should place ships automatically", () => {
		// Assuming that ship placement modifies the board
		expect(
			comp.compBoard.board.some((row) => row.some((cell) => cell)),
		).toBeTruthy();
	});

	test("computer should make a valid attack", () => {
		const result = comp.attack(mockPlayer);
		expect(["hit", "miss"]).toContain(result);
		expect(mockPlayer.receiveAttack).toHaveBeenCalled();
	});

	test("computer should switch to target mode after a hit", () => {
		jest.spyOn(comp, "chooseAttack").mockImplementation(() => ({ x: 0, y: 0 }));
		mockPlayer.receiveAttack.mockReturnValueOnce("hit");
		comp.attack(mockPlayer);
		expect(comp.isTurn).toBe(false); // Assuming isTurn changes after attack
	});

	test("computer should report loss correctly", () => {
		comp.compBoard.board.forEach((row) =>
			row.fill({ hit: jest.fn(), sunk: true }),
		);
		expect(comp.hasLost()).toBe(true);
	});
});
