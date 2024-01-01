import playGame from "./game";
import page from "./gameUI";
import "./css/normalize.css";
import "./css/game.css";

import { hidePopup } from "./gameUI";

page();
playGame();

document.getElementById("playAgainButton").addEventListener("click", () => {
	// Code to reset the game and start again
	hidePopup();
	const content = document.querySelector("div#content");
	content.innerHTML = "";
	page();
	playGame();
});
