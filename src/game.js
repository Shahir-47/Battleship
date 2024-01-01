import player from "./player";
import computer from "./computer";
import createShip from "./ship";
import { drawBoard, updateBoard, updateTurn, loadGame, winner } from "./gameUI";

function gameTime(userParam, compParam, gameActiveParam) {
	const user = userParam;
	const comp = compParam;
	let gameActive = gameActiveParam;

	console.log("user board:");
	console.log(user.playerBoard.board);

	comp.placeShipsAutomatically();

	console.log("comp board:");
	console.log(comp.compBoard.board);

	drawBoard(user.playerBoard.board);
	drawBoard(comp.compBoard.board, true);

	user.isTurn = true;
	comp.isTurn = false;

	const cells = document.querySelectorAll(".enemy .cell");
	cells.forEach((cell) => {
		cell.addEventListener("click", (e) => {
			if (!gameActive || !user.isTurn) return;
			if (
				e.target.classList.contains("hit") ||
				e.target.classList.contains("miss")
			)
				return;
			const { x } = e.target.dataset;
			const { y } = e.target.dataset;
			const xInt = parseInt(x, 10);
			const yInt = parseInt(y, 10);

			const result = user.attack(xInt, yInt, comp);
			updateBoard(xInt, yInt, result, true);

			if (comp.hasLost()) {
				console.log("comp has lost");
				gameActive = false;
				winner("user");
				return;
			}

			user.isTurn = false;
			comp.isTurn = true;
			updateTurn(user.isTurn);

			setTimeout(() => {
				const {
					x: compX,
					y: compY,
					attackResult: compResult,
				} = comp.attack(user);
				updateBoard(compX, compY, compResult, false);

				if (user.hasLost()) {
					gameActive = false;
					console.log("user has lost");
					winner("comp");
					return;
				}

				user.isTurn = true;
				comp.isTurn = false;
				updateTurn(user.isTurn);
			}, 1000);
		});
	});
}

function playGame() {
	const gameActive = true;
	const user = player("Player 1");
	const comp = computer();

	const gridCells = document.querySelectorAll(".grid-cell");
	const rotateButton = document.querySelector(".rotate-button");
	const ships = [5, 4, 3, 3, 2];
	let selectedShipSize = ships.shift();
	let isHorizontal = true; // Orientation of the ship

	function isAdjacentBlocked(startX, startY, shipSize) {
		for (let i = 0; i < shipSize; i += 1) {
			const x = !isHorizontal ? startX : startX + i;
			const y = isHorizontal ? startY : startY + i;

			for (let adjX = -1; adjX <= 1; adjX += 1) {
				for (let adjY = -1; adjY <= 1; adjY += 1) {
					const neighborX = x + adjX;
					const neighborY = y + adjY;
					if (
						neighborX >= 0 &&
						neighborX < 10 &&
						neighborY >= 0 &&
						neighborY < 10
					) {
						if (user.playerBoard.hasShipAt(neighborX, neighborY)) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	function highlightCells(e, shipSize) {
		const startX = parseInt(e.target.dataset.x, 10);
		const startY = parseInt(e.target.dataset.y, 10);

		// Assuming user.playerBoard is accessible and has a method to check for ship at a given position
		let isOverlapOrAdjacent = isAdjacentBlocked(startX, startY, shipSize);

		for (let i = 0; i < shipSize; i += 1) {
			const x = !isHorizontal ? startX : startX + i;
			const y = isHorizontal ? startY : startY + i;
			const cell = document.querySelector(
				`.grid-cell[data-x="${x}"][data-y="${y}"]`,
			);
			if (!cell || x >= 10 || y >= 10 || user.playerBoard.hasShipAt(x, y)) {
				isOverlapOrAdjacent = true;
				break;
			}
		}

		for (let i = 0; i < shipSize; i += 1) {
			const x = !isHorizontal ? startX : startX + i;
			const y = isHorizontal ? startY : startY + i;
			const cell = document.querySelector(
				`.grid-cell[data-x="${x}"][data-y="${y}"]`,
			);
			if (cell) {
				cell.classList.add(isOverlapOrAdjacent ? "overlap" : "highlight");
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
					for (let i = 0; i < selectedShipSize; i += 1) {
						const cellX = !isHorizontal ? x : x + i;
						const cellY = isHorizontal ? y : y + i;
						const shipCell = document.querySelector(
							`.grid-cell[data-x="${cellX}"][data-y="${cellY}"]`,
						);
						if (shipCell) {
							shipCell.classList.add("cell-with-ship");
						}
					}

					selectedShipSize = ships.shift();
					if (selectedShipSize === undefined) {
						selectedShipSize = -1;
						removeHighlight();
						loadGame();
						gameTime(user, comp, gameActive);
					}
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
}

export default playGame;
