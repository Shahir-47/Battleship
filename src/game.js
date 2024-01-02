import player from "./player";
import computer from "./computer";
import createShip from "./ship";
import {
	drawBoard,
	updateBoard,
	updateTurn,
	loadGame,
	winner,
	showPopup,
} from "./gameUI";

// runs the game once the user has placed all their ships
function gameTime(userParam, compParam, gameActiveParam) {
	const user = userParam; // user object
	const comp = compParam; // computer object
	let gameActive = gameActiveParam; // is the game still active?

	comp.placeShipsAutomatically(); // place the computer's ships automatically

	drawBoard(user.playerBoard.board); // draw the user's board
	drawBoard(comp.compBoard.board, true); // draw the computer's board

	user.isTurn = true; // user goes first
	comp.isTurn = false; // computer goes second

	// add event listeners to the enemy board
	const cells = document.querySelectorAll(".enemy .cell");
	cells.forEach((cell) => {
		cell.addEventListener("click", (e) => {
			// if the game is not active or it is not the user's turn, do nothing
			if (!gameActive || !user.isTurn) return;
			// if the cell has already been hit, do nothing
			if (
				e.target.classList.contains("hit") ||
				e.target.classList.contains("miss")
			)
				return;
			const { x } = e.target.dataset; // get the x coordinate of the cell
			const { y } = e.target.dataset; // get the y coordinate of the cell
			const xInt = parseInt(x, 10); // convert the x coordinate to an integer
			const yInt = parseInt(y, 10); // convert the y coordinate to an integer

			const result = user.attack(xInt, yInt, comp); // attack the computer
			updateBoard(xInt, yInt, result, true); // update the board

			// if the computer has lost, end the game and show the popup
			if (comp.hasLost()) {
				gameActive = false; // game is no longer active
				winner("user"); // user won
				showPopup(); // show the play again popup
				return;
			}

			// computer's turn
			user.isTurn = false;
			comp.isTurn = true;
			updateTurn(user.isTurn); // update the turn indicator text

			// computer's attack
			const {
				x: compX,
				y: compY,
				attackResult: compResult,
			} = comp.attack(user);
			updateBoard(compX, compY, compResult, false);

			// if the user has lost, end the game and show the popup
			if (user.hasLost()) {
				gameActive = false; // game is no longer active
				winner("comp"); // computer won
				showPopup(); // show the play again popup
				return;
			}

			// user's turn
			user.isTurn = true;
			comp.isTurn = false;
			updateTurn(user.isTurn); // update the turn indicator text
		});
	});
}

// starts the game by asking the user to place their ships
function playGame() {
	const gameActive = true; // the game is active
	const user = player(); // create the user object
	const comp = computer(); // create the computer object

	// get the grid cells and the rotate button
	const gridCells = document.querySelectorAll(".grid-cell");
	const rotateButton = document.querySelector(".rotate-button");
	const ships = [5, 4, 3, 3, 2]; // the ships to be placed
	let selectedShipSize = ships.shift(); // the size of the currently selected ship
	let isHorizontal = true; // Orientation of the ship

	// Check if the ship is adjacent to another ship
	function isAdjacentBlocked(startX, startY, shipSize) {
		for (let i = 0; i < shipSize; i += 1) {
			const x = !isHorizontal ? startX : startX + i; // x coordinate of the cell
			const y = isHorizontal ? startY : startY + i; // y coordinate of the cell
			// Check adjacent cells
			for (let adjX = -1; adjX <= 1; adjX += 1) {
				for (let adjY = -1; adjY <= 1; adjY += 1) {
					const neighborX = x + adjX; // x coordinate of the adjacent cell
					const neighborY = y + adjY; // y coordinate of the adjacent cell
					// Validate neighbor coordinates
					if (
						neighborX >= 0 &&
						neighborX < 10 &&
						neighborY >= 0 &&
						neighborY < 10
					) {
						// if there is a ship at the adjacent cell, return true
						if (user.playerBoard.hasShipAt(neighborX, neighborY)) {
							return true;
						}
					}
				}
			}
		}
		// if there are no adjacent ships, return false
		return false;
	}

	// Highlight the cells where the ship will be placed
	function highlightCells(e, shipSize) {
		const startX = parseInt(e.target.dataset.x, 10); // x coordinate of the cell
		const startY = parseInt(e.target.dataset.y, 10); // y coordinate of the cell

		// Check if the ship is adjacent to another ship
		let isOverlapOrAdjacent = isAdjacentBlocked(startX, startY, shipSize);

		// Check if the ship is overlapping
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

		// Highlight the cells
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

	// Remove the highlight from the cells
	function removeHighlight() {
		gridCells.forEach((cell) => {
			cell.classList.remove("highlight", "overlap");
		});
	}

	// Add event listeners to the grid cells
	gridCells.forEach((cell) => {
		// When the mouse is over a cell, highlight the cells where the ship will be placed
		cell.addEventListener("mouseover", (e) => {
			if (selectedShipSize === -1) return;
			highlightCells(e, selectedShipSize);
		});

		cell.addEventListener("mouseout", removeHighlight); // When the mouse leaves the cell, remove the highlight

		// When the user clicks on a cell, place the ship
		cell.addEventListener("click", () => {
			const x = parseInt(cell.dataset.x, 10);
			const y = parseInt(cell.dataset.y, 10);

			// If the ship can be placed, place it
			if (user.canPlaceShip(selectedShipSize, x, y, !isHorizontal)) {
				// catch any errors
				try {
					user.placeShip(createShip(selectedShipSize), x, y, !isHorizontal); // Place the ship

					// Visualize the placed ship
					for (let i = 0; i < selectedShipSize; i += 1) {
						const cellX = !isHorizontal ? x : x + i;
						const cellY = isHorizontal ? y : y + i;
						const shipCell = document.querySelector(
							`.grid-cell[data-x="${cellX}"][data-y="${cellY}"]`,
						);
						// Add the ship class to the cell
						if (shipCell) {
							shipCell.classList.add("cell-with-ship");
						}
					}

					selectedShipSize = ships.shift(); // Get the next ship size

					// If there are no more ships to place, start the game
					if (selectedShipSize === undefined) {
						selectedShipSize = -1; // No ship is selected
						removeHighlight(); // Remove the highlight from the cells
						loadGame(); // Load the game
						gameTime(user, comp, gameActive); // Start the game
					}
				} catch (error) {
					// Handle error
				}
			} else {
				// Handle invalid placement
			}
		});
	});

	// Add event listener to the rotate button
	rotateButton.addEventListener("click", () => {
		isHorizontal = !isHorizontal; // Change the orientation of the ship
	});
}

export default playGame;
