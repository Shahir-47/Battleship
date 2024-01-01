import player from "./player";
import computer from "./computer";
import createShip from "./ship";

function playGame() {
	const user = player("Player 1");
	const comp = computer();

	// Place ships
	user.placeShip(createShip(5), 0, 0, false);
	user.placeShip(createShip(4), 0, 1, false);
	user.placeShip(createShip(3), 0, 2, false);
	user.placeShip(createShip(3), 0, 3, false);
	user.placeShip(createShip(2), 0, 4, false);

	console.log("user board:");
	console.log(user.playerBoard.board);

	comp.placeShipsAutomatically();

	console.log("comp board:");
	console.log(comp.compBoard.board);

	// 	debugger;

	// Play game
	let gameOver = false;
	let winner;
	let turn = 0;
	let x;
	let y;
	let i = 0;
	while (!gameOver) {
		if (turn % 2 === 0) {
			user.isTurn = true;
			comp.isTurn = false;
			debugger;
			x = parseInt(prompt("Please enter x:"), 10);
			y = parseInt(prompt("Please enter y"), 10);

			user.attack(x, y, comp);

			console.log(`comp board:${i}`);
			console.log(comp.compBoard.board);

			console.log(comp.hasLost());
			if (comp.hasLost()) {
				gameOver = true;
				winner = user;

				console.log(`user board (line:${i}):`);
				console.log(user.playerBoard.board);

				console.log(`comp board: ${i}`);
				console.log(comp.compBoard.board);
			}
		} else {
			user.isTurn = false;
			comp.isTurn = true;
			comp.attack(user);

			console.log(`user board:${i}`);
			console.log(user.playerBoard.board);

			if (user.hasLost()) {
				gameOver = true;
				winner = comp;

				console.log(`user board (line:${i}):`);
				console.log(user.playerBoard.board);

				console.log(`comp board: ${i}`);
				console.log(comp.compBoard.board);
			}
		}
		turn += 1;
		i += 1;
	}

	console.log(`${winner.name} wins!`);
}

export default playGame;
