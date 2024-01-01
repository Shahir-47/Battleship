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

function sunk(x, y, enemy) {
	const boardGrid = returnBoardGrid(enemy);
	const cell = boardGrid.children[y * 10 + x];
	cell.classList.add("sunk");
}

function updateBoard(x, y, result, enemy) {
	if (result === "miss") {
		miss(x, y, enemy);
	} else if (result === "hit") {
		hit(x, y, enemy);
	} else if (result === "sunk") {
		sunk(x, y, enemy);
	}
}

function page() {
	header();
	mainContent();
	turn();
	createBoard();
	playerBoard();
	enemyBoard();
}

export default page;
export { drawBoard, updateBoard };
