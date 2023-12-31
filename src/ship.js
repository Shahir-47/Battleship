function createShip(length) {
	if (typeof length !== "number") throw new Error("length must be a number");
	if (length < 1) throw new Error("length must be greater than 0");
	if (length % 1 !== 0) throw new Error("length must be an integer");
	if (length > 5) throw new Error("length must be less than 6");

	let numHits = 0;
	let sunk = false;

	return {
		get length() {
			return length;
		},
		get numHits() {
			return numHits;
		},
		get sunk() {
			return sunk;
		},
		hit() {
			numHits += 1;
			if (numHits === length) {
				sunk = true;
			}
		},
	};
}

export default createShip;
