import player from "./player";
import computer from "./computer";
import createShip from "./ship";
import { drawBoard, updateBoard, updateTurn } from "./gameUI";

function playGame() {
	let gameActive = true;
	const user = player("Player 1");
	const comp = computer();

	const gridCells = document.querySelectorAll(".grid-cell");
	const rotateButton = document.querySelector(".rotate-button");
	let ships = [5, 4, 3, 3, 2];
	let selectedShipSize = ships.shift();
	let isHorizontal = true; // Orientation of the ship

	function highlightCells(e) {
		const startX = parseInt(e.target.dataset.x, 10);
		const startY = parseInt(e.target.dataset.y, 10);

		for (let i = 0; i < selectedShipSize; i += 1) {
			const x = isHorizontal ? startX + i : startX;
			const y = isHorizontal ? startY : startY + i;
			const cell = document.querySelector(
				`.grid-cell[data-x="${x}"][data-y="${y}"]`,
			);
			if (cell) cell.classList.add("highlight");
		}
	}

	function removeHighlight() {
		gridCells.forEach((cell) => {
			cell.classList.remove("highlight");
		});
	}

	gridCells.forEach((cell) => {
		cell.addEventListener("mouseover", (e) => {
			if (selectedShipSize === -1) return;
			highlightCells(e, selectedShipSize);
		});
		cell.addEventListener("mouseout", removeHighlight);
		cell.addEventListener("click", () => {
			selectedShipSize = ships.shift();
		});
	});

	rotateButton.addEventListener("click", () => {
		isHorizontal = !isHorizontal;
	});

	// Place ships
	// user.placeShip(createShip(5), 0, 0, false);
	// user.placeShip(createShip(4), 0, 1, false);
	// user.placeShip(createShip(3), 0, 2, false);
	// user.placeShip(createShip(3), 0, 3, false);
	// user.placeShip(createShip(2), 0, 4, false);

	// console.log("user board:");
	// console.log(user.playerBoard.board);

	// comp.placeShipsAutomatically();

	// console.log("comp board:");
	// console.log(comp.compBoard.board);

	// drawBoard(user.playerBoard.board);
	// drawBoard(comp.compBoard.board, true);

	// user.isTurn = true;
	// comp.isTurn = false;

	// const cells = document.querySelectorAll(".enemy .cell");
	// cells.forEach((cell) => {
	// 	cell.addEventListener("click", (e) => {
	// 		if (!gameActive || !user.isTurn) return;
	// 		if (
	// 			e.target.classList.contains("hit") ||
	// 			e.target.classList.contains("miss")
	// 		)
	// 			return;
	// 		const { x } = e.target.dataset;
	// 		const { y } = e.target.dataset;
	// 		const xInt = parseInt(x, 10);
	// 		const yInt = parseInt(y, 10);

	// 		const result = user.attack(xInt, yInt, comp);
	// 		updateBoard(xInt, yInt, result, true);

	// 		if (comp.hasLost()) {
	// 			console.log("comp has lost");
	// 			gameActive = false;
	// 			return;
	// 		}

	// 		user.isTurn = false;
	// 		comp.isTurn = true;
	// 		updateTurn(user.isTurn);
	// 		// debugger;

	// 		setTimeout(() => {
	// 			const {
	// 				x: compX,
	// 				y: compY,
	// 				attackResult: compResult,
	// 			} = comp.attack(user);
	// 			updateBoard(compX, compY, compResult, false);

	// 			if (user.hasLost()) {
	// 				gameActive = false;
	// 				console.log("user has lost");
	// 				return;
	// 			}

	// 			user.isTurn = true;
	// 			comp.isTurn = false;
	// 			updateTurn(user.isTurn);
	// 		}, 1000);
	// 	});
	// });

	// 	// Play game
	// 	let gameOver = false;
	// 	let winner;
	// 	let turn = 0;
	// 	let x;
	// 	let y;
	// 	let i = 0;
	// 	while (!gameOver) {
	// 		// drawBoard(user.playerBoard.board);
	// 		// drawBoard(comp.compBoard.board, true);
	// 		if (turn % 2 === 0) {
	// 			user.isTurn = true;
	// 			comp.isTurn = false;

	// 			user.attack(x, y, comp);

	// 			console.log(`comp board:${i}`);
	// 			console.log(comp.compBoard.board);

	// 			console.log(comp.hasLost());
	// 			if (comp.hasLost()) {
	// 				gameOver = true;
	// 				winner = user;

	// 				console.log(`user board (line:${i}):`);
	// 				console.log(user.playerBoard.board);

	// 				console.log(`comp board: ${i}`);
	// 				console.log(comp.compBoard.board);
	// 			}
	// 		} else {
	// 			user.isTurn = false;
	// 			comp.isTurn = true;
	// 			comp.attack(user);

	// 			console.log(`user board:${i}`);
	// 			console.log(user.playerBoard.board);

	// 			if (user.hasLost()) {
	// 				gameOver = true;
	// 				winner = comp;

	// 				console.log(`user board (line:${i}):`);
	// 				console.log(user.playerBoard.board);

	// 				console.log(`comp board: ${i}`);
	// 				console.log(comp.compBoard.board);
	// 			}
	// 		}
	// 		turn += 1;
	// 		i += 1;
	// 	}

	// 	console.log(`${winner.name} wins!`);
}

export default playGame;
