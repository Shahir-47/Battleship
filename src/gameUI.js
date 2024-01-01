import soldier from "./img/soldier.svg";

function header() {
	const bar = document.createElement("div");
	bar.classList.add("nav-bar");

	// items on the left side of the header
	const leftIcon = document.createElement("img");
	leftIcon.classList.add("icon");
	leftIcon.src = soldier;
	leftIcon.alt = "soldier";

	// Create the menu button
	const titleBox = document.createElement("div");
	titleBox.classList.add("header");
	const title = document.createElement("h1");
	title.textContent = "Battleship";
	titleBox.appendChild(title);

	const rightIcon = document.createElement("img");
	rightIcon.classList.add("icon");
	rightIcon.src = soldier;
	rightIcon.alt = "soldier";

	bar.appendChild(leftIcon);
	bar.appendChild(titleBox);
	bar.appendChild(rightIcon);

	document.querySelector("div#content").appendChild(bar);
}

function mainContent() {
	const main = document.createElement("div");
	main.classList.add("main-content");
	document.querySelector("div#content").appendChild(main);
}

function turn() {
	const turnDiv = document.createElement("div");
	turnDiv.classList.add("turn-div");
	const turnIndicator = document.createElement("div");
	turnIndicator.classList.add("turn-indicator");
	const turnText = document.createElement("p");
	turnText.textContent = "Your Turn";
	turnIndicator.appendChild(turnText);
	turnDiv.appendChild(turnIndicator);
	document.querySelector("div.main-content").appendChild(turnDiv);
}

function createBoard() {
	const board = document.createElement("div");
	board.classList.add("board");
	document.querySelector("div.main-content").appendChild(board);
}

function playerBoard() {
	const board = document.createElement("div");
	board.classList.add("player");

	const boardTitle = document.createElement("h2");
	boardTitle.textContent = "Your Board";
	board.appendChild(boardTitle);

	const boardGrid = document.createElement("div");
	boardGrid.classList.add("board-grid");
	board.appendChild(boardGrid);

	document.querySelector("div.board").appendChild(board);
}

function enemyBoard() {
	const board = document.createElement("div");
	board.classList.add("enemy");

	const boardTitle = document.createElement("h2");
	boardTitle.textContent = "Enemy Board";
	board.appendChild(boardTitle);

	const boardGrid = document.createElement("div");
	boardGrid.classList.add("board-grid");
	board.appendChild(boardGrid);

	document.querySelector("div.board").appendChild(board);
}

function returnBoardGrid(enemy) {
	let boardGrid;
	if (enemy) {
		boardGrid = document.querySelector("div.enemy div.board-grid");
	} else {
		boardGrid = document.querySelector("div.player div.board-grid");
	}
	return boardGrid;
}

function drawBoard(board, isEnemy = false) {
	const boardGrid = returnBoardGrid(isEnemy);
	boardGrid.innerHTML = "";
	for (let i = 0; i < board.length; i += 1) {
		for (let j = 0; j < board[i].length; j += 1) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.x = j;
			cell.dataset.y = i;

			if (board[i][j] !== undefined) {
				cell.classList.add("ship");
				cell.classList.add(`ship-${board[i][j].name}`);
			}
			boardGrid.appendChild(cell);
		}
	}
}

function miss(x, y, enemy) {
	const boardGrid = returnBoardGrid(enemy);
	const cell = boardGrid.children[y * 10 + x];
	cell.classList.add("miss");
}

function hit(x, y, enemy) {
	const boardGrid = returnBoardGrid(enemy);
	const cell = boardGrid.children[y * 10 + x];
	cell.classList.add("hit");
}

function updateBoard(x, y, result, enemy) {
	if (result === "miss") {
		miss(x, y, enemy);
	} else {
		hit(x, y, enemy);
	}
}

function startPage() {
	const main = document.querySelector("div.main-content");
	main.innerHTML = "";
	turn();
	const turnText = document.querySelector("div.turn-indicator p");
	turnText.textContent = "Place your ships by clicking on the board below";

	const rotateContainer = document.createElement("div");
	rotateContainer.classList.add("rotate-container");

	const rotateButton = document.createElement("button");
	rotateButton.classList.add("rotate-button");
	rotateButton.textContent = "Rotate";
	rotateContainer.appendChild(rotateButton);
	main.appendChild(rotateContainer);

	const boardGrid = document.createElement("div");
	boardGrid.classList.add("board-grid");
	main.appendChild(boardGrid);

	for (let i = 0; i < 100; i += 1) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.classList.add("grid-cell");
		cell.dataset.x = i % 10;
		cell.dataset.y = Math.floor(i / 10);
		boardGrid.appendChild(cell);
	}
}

function loadGame() {
	const main = document.querySelector("div.main-content");
	main.innerHTML = "";
	turn();
	createBoard();
	playerBoard();
	enemyBoard();
}

function updateTurn(isTurn) {
	const turnText = document.querySelector("div.turn-indicator p");
	turnText.textContent = isTurn ? "Your Turn" : "Computer's Turn";
}

function winner(player) {
	const turnText = document.querySelector("div.turn-indicator p");
	turnText.textContent = `${player} won!`;
}

function hidePopup() {
	document.getElementById("playAgainPopup").style.display = "none";
}

function page() {
	header();
	mainContent();
	startPage();
}

function showPopup() {
	document.getElementById("playAgainPopup").style.display = "block";
}

export default page;
export {
	drawBoard,
	updateBoard,
	updateTurn,
	loadGame,
	winner,
	showPopup,
	hidePopup,
};
