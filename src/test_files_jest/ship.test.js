import createShip from "../ship";

describe("createShip", () => {
	let ship;

	beforeEach(() => {
		ship = createShip(2);
	});

	it("should return an object with a length property", () => {
		expect(ship).toHaveProperty("length");
	});

	it("should return an object with a numHits property", () => {
		expect(ship).toHaveProperty("numHits");
	});

	it("should return an object with a sunk property", () => {
		expect(ship).toHaveProperty("sunk");
	});

	it("should return an object with a length property that is a number", () => {
		expect(typeof ship.length).toBe("number");
	});

	it("should return an object with a numHits property that is a number", () => {
		expect(typeof ship.numHits).toBe("number");
	});

	it("should return an object with a sunk property that is a boolean", () => {
		expect(typeof ship.sunk).toBe("boolean");
	});

	it("should return an object with a length property that is equal to the length argument", () => {
		expect(ship.length).toBe(2);
	});

	it("should return an object with a numHits property that is equal to 0", () => {
		expect(ship.numHits).toBe(0);
	});

	it("should return an object with a sunk property that is equal to false", () => {
		expect(ship.sunk).toBe(false);
	});

	it("should throw an error if length is not a number", () => {
		expect(() => createShip("a")).toThrow("length must be a number");
	});

	it("should throw an error if length is less than 1", () => {
		expect(() => createShip(0)).toThrow("length must be greater than 0");
	});

	it("should throw an error if length is not an integer", () => {
		expect(() => createShip(1.5)).toThrow("length must be an integer");
	});

	it("should throw an error if length is greater than 5", () => {
		expect(() => createShip(6)).toThrow("length must be less than 6");
	});

	it("should have a hit method", () => {
		expect(ship).toHaveProperty("hit");
	});

	it("should have a hit method that is a function", () => {
		expect(typeof ship.hit).toBe("function");
	});

	it("should have a hit method that increases numHits by 1", () => {
		ship.hit();
		expect(ship.numHits).toBe(1);
	});

	it("should have a hit method that sets sunk to true if numHits equals length", () => {
		ship.hit();
		ship.hit();
		expect(ship.sunk).toBe(true);
	});

	it("should have a hit method that does not set sunk to true if numHits does not equal length", () => {
		ship.hit();
		expect(ship.sunk).toBe(false);
	});
});
