import player from "./player";
import computer from "./computer";
import createShip from "./ship";
import { drawBoard, updateBoard, updateTurn } from "./gameUI";

function getRandomDarkColor() {
	// Hue ranges from 0 to 360
	const hue = Math.floor(Math.random() * 360);

	// Saturation: 100% for full color intensity
	const saturation = "100%";

	// Lightness: limit to 10% - 30% for dark colors
	const lightness = `${Math.floor(Math.random() * 20) + 10}%`;

	return `hsl(${hue}, ${saturation}, ${lightness})`;
}

function playGame() {
	let gameActive = true;
	const user = player("Player 1");
	const comp = computer();

	const gridCells = document.querySelectorAll(".grid-cell");
	const rotateButton = document.querySelector(".rotate-button");
	const ships = [5, 4, 3, 3, 2];
	let selectedShipSize = ships.shift();
	let isHorizontal = true; // Orientation of the ship

	function highlightCells(e, selectedShipSize) {
		const startX = parseInt(e.target.dataset.x, 10);
		const startY = parseInt(e.target.dataset.y, 10);

		// Assuming user.playerBoard is accessible and has a method to check for ship at a given position
		let isOverlap = false;

		for (let i = 0; i < selectedShipSize; i++) {
			const x = !isHorizontal ? startX : startX + i;
			const y = isHorizontal ? startY : startY + i;
			const cell = document.querySelector(
				`.grid-cell[data-x="${x}"][data-y="${y}"]`,
			);
			if (!cell || x >= 10 || y >= 10 || user.playerBoard.hasShipAt(x, y)) {
				isOverlap = true;
				break;
			}
		}

		for (let i = 0; i < selectedShipSize; i++) {
			const x = !isHorizontal ? startX : startX + i;
			const y = isHorizontal ? startY : startY + i;
			const cell = document.querySelector(
				`.grid-cell[data-x="${x}"][data-y="${y}"]`,
			);
			if (cell) {
				cell.classList.add(isOverlap ? "overlap" : "highlight");
			}
		}
	}

	function removeHighlight() {
		gridCells.forEach((cell) => {
			cell.classList.remove("highlight", "overlap");
		});
	}

	gridCells.forEach((cell) => {
		cell.addEventListener("mouseover", (e) => {
			if (selectedShipSize === -1) return;
			highlightCells(e, selectedShipSize);
		});
		cell.addEventListener("mouseout", removeHighlight);
		cell.addEventListener("click", () => {
			const x = parseInt(cell.dataset.x, 10);
			const y = parseInt(cell.dataset.y, 10);

			if (user.canPlaceShip(selectedShipSize, x, y, !isHorizontal)) {
				try {
					user.placeShip(createShip(selectedShipSize), x, y, !isHorizontal);

					// Visualize the placed ship
					const color = getRandomDarkColor();
					for (let i = 0; i < selectedShipSize; i += 1) {
						const cellX = !isHorizontal ? x : x + i;
						const cellY = isHorizontal ? y : y + i;
						const shipCell = document.querySelector(
							`.grid-cell[data-x="${cellX}"][data-y="${cellY}"]`,
						);
						if (shipCell) {
							shipCell.classList.add("cell-with-ship");
							shipCell.style.borderColor = color;
						}
					}

					selectedShipSize = ships.shift();
					console.log(user.playerBoard.board);
				} catch (error) {
					// Handle error
				}
			} else {
				// Handle invalid placement
			}
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
