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

export default header;
