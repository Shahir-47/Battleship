import createShip from "../ship";

describe("createShip", () => {
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

	it("should return an object with a length property", () => {
		expect(createShip(1)).toHaveProperty("length");
	});

	it("should return an object with a numHits property", () => {
		expect(createShip(1)).toHaveProperty("numHits");
	});

	it("should return an object with a sunk property", () => {
		expect(createShip(1)).toHaveProperty("sunk");
	});

	it("should return an object with a hit method", () => {
		expect(createShip(1)).toHaveProperty("hit");
	});

	it("should return an object with a length property with the value of the length argument", () => {
		expect(createShip(1).length).toBe(1);
	});

	it("should return an object with a numHits property with the value of 0", () => {
		expect(createShip(1).numHits).toBe(0);
	});

	it("should return an object with a sunk property with the value of false", () => {
		expect(createShip(1).sunk).toBe(false);
	});

	it("should return an object with a hit method that increments numHits by 1", () => {
		const ship = createShip(1);
		ship.hit();
		expect(ship.numHits).toBe(1);
	});

	it("should return an object with a hit method that sets sunk to true if numHits equals length", () => {
		const ship = createShip(1);
		ship.hit();
		expect(ship.sunk).toBe(true);
	});
});
