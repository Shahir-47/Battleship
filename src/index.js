import playGame from "./game";
import "./css/normalize.css";
import "./css/game.css";
import { page, hidePopup } from "./gameUI";

page(); // show the start page
playGame(); // start the game

// add event listener to the play again button
document.getElementById("playAgainButton").addEventListener("click", () => {
	// Code to reset the game and start again
	hidePopup(); // hide the play again popup
	const content = document.querySelector("div#content"); // get the content div
	content.innerHTML = ""; // clear the content div
	page(); // show the start page
	playGame(); // start the game
});
