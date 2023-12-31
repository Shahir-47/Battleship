import player from "../player";
import createShip from "../ship";

describe("player", () => {
	let testPlayer;
	let enemyPlayer;
	let ship;

	beforeEach(() => {
		testPlayer = player("TestPlayer");
		enemyPlayer = player("EnemyPlayer");
		ship = createShip(3); // Assuming a ship of length 3
	});

	test("should place a ship on the board", () => {
		testPlayer.placeShip(ship, 0, 0, true);
		expect(testPlayer.playerBoard.board[0][0]).toBe(ship);
	});

	test("should receive an attack and mark it on the board", () => {
		testPlayer.placeShip(ship, 0, 0, true);
		testPlayer.receiveAttack(0, 0);
		expect(ship.numHits).toBe(1);
	});

	test("should attack the enemy player", () => {
		enemyPlayer.placeShip(ship, 0, 0, true);
		testPlayer.attack(0, 0, enemyPlayer);
		expect(ship.numHits).toBe(1);
	});

	test("should report lost status correctly", () => {
		testPlayer.placeShip(ship, 0, 0, true);
		testPlayer.receiveAttack(0, 0);
		testPlayer.receiveAttack(0, 1);
		testPlayer.receiveAttack(0, 2);
		expect(testPlayer.hasLost()).toBe(true);
	});

	test("should handle turn status", () => {
		testPlayer.isTurn = true;
		expect(testPlayer.isTurn).toBe(true);
		testPlayer.isTurn = false;
		expect(testPlayer.isTurn).toBe(false);
	});
});
