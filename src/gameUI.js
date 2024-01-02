import soldier from "./img/soldier.svg";
import GitHub from "./img/git.svg";

// Create the header
function header() {
	const bar = document.createElement("div");
	bar.classList.add("nav-bar");

	const leftIcon = document.createElement("img");
	leftIcon.classList.add("icon");
	leftIcon.src = soldier;
	leftIcon.alt = "soldier";

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

// Create the main content
function mainContent() {
	const main = document.createElement("div");
	main.classList.add("main-content");
	document.querySelector("div#content").appendChild(main);
}

// Create the turn indicator
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

// Create the board container
function createBoard() {
	const board = document.createElement("div");
	board.classList.add("board");
	document.querySelector("div.main-content").appendChild(board);
}

// Create the player board
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

// Create the enemy board
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

// Return the board grid
function returnBoardGrid(enemy) {
	let boardGrid;
	if (enemy) {
		boardGrid = document.querySelector("div.enemy div.board-grid");
	} else {
		boardGrid = document.querySelector("div.player div.board-grid");
	}
	return boardGrid;
}

// Draw the board
function drawBoard(board, isEnemy = false) {
	const boardGrid = returnBoardGrid(isEnemy);
	boardGrid.innerHTML = "";
	for (let i = 0; i < board.length; i += 1) {
		for (let j = 0; j < board[i].length; j += 1) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.x = j;
			cell.dataset.y = i;

			if (board[i][j] !== undefined && !isEnemy) {
				cell.classList.add("ship");
				cell.classList.add(`ship-${board[i][j].name}`);
			}
			boardGrid.appendChild(cell);
		}
	}
}

// add miss class to the cell
function miss(x, y, enemy) {
	const boardGrid = returnBoardGrid(enemy);
	const cell = boardGrid.children[y * 10 + x];
	cell.classList.add("miss");
}

// add hit class to the cell
function hit(x, y, enemy) {
	const boardGrid = returnBoardGrid(enemy);
	const cell = boardGrid.children[y * 10 + x];
	cell.classList.add("hit");
}

// update the board after an attack
function updateBoard(x, y, result, enemy) {
	if (result === "miss") {
		miss(x, y, enemy);
	} else {
		hit(x, y, enemy);
	}
}

// shows the start page
function startPage() {
	const main = document.querySelector("div.main-content");
	main.innerHTML = ""; // clear the main content
	turn(); // create the turn indicator
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

// load the game
function loadGame() {
	const main = document.querySelector("div.main-content");
	main.innerHTML = "";
	turn(); // create the turn indicator
	createBoard(); // create the board container
	playerBoard(); // create the player board
	enemyBoard(); // create the enemy board
}

// update the turn indicator text
function updateTurn(isTurn) {
	const turnText = document.querySelector("div.turn-indicator p");
	turnText.textContent = isTurn ? "Your Turn" : "Computer's Turn";
}

// show the winner
function winner(player) {
	const turnText = document.querySelector("div.turn-indicator p");
	turnText.textContent = `${player} won!`;
}

// hide the play again popup
function hidePopup() {
	document.getElementById("playAgainPopup").style.display = "none";
}

// Create the footer
const createFooter = () => {
	const footer = document.createElement("footer");
	footer.classList.add("footer");

	const gitHubProfile = document.createElement("a");
	gitHubProfile.href = "https://github.com/Shahir-47";

	const gitHubProfileImg = document.createElement("img");
	gitHubProfileImg.src = GitHub;
	gitHubProfileImg.alt = "gitHub Logo";

	const gitHubProfileText = document.createElement("p");
	const atSymbol = document.createElement("span");
	atSymbol.classList.add("at-symbol");
	atSymbol.textContent = "@";
	const username = document.createElement("span");
	username.textContent = "Shahir-47";
	gitHubProfileText.appendChild(atSymbol);
	gitHubProfileText.appendChild(username);

	gitHubProfile.appendChild(gitHubProfileImg);
	gitHubProfile.appendChild(gitHubProfileText);

	const seperator = document.createElement("p");
	seperator.textContent = "|";

	const gitHubRepo = document.createElement("a");
	gitHubRepo.href = "https://github.com/Shahir-47/Battleship";
	gitHubRepo.textContent = "Source Code";

	footer.appendChild(gitHubProfile);
	footer.appendChild(seperator);
	footer.appendChild(gitHubRepo);

	document.querySelector("div#content").appendChild(footer);
};

// Create the page
function page() {
	header();
	mainContent();
	startPage();
	createFooter();
}

// show the play again popup
function showPopup() {
	document.getElementById("playAgainPopup").style.display = "block";
}

export {
	page,
	drawBoard,
	updateBoard,
	updateTurn,
	loadGame,
	winner,
	showPopup,
	hidePopup,
};
