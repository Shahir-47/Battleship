# Battleship Game

Battleship is a classic naval strategy game. Players take turns firing "shots" to guess the location of the other player's ships on a grid. The goal is to sink all of the opponent's ships before they sink yours. This implementation of the game features an intelligent AI that strategically targets surrounding cells after a successful hit.

## Play the Game

Access the live version of the game to challenge the computer at: [Play Battleship](https://shahir-47.github.io/Battleship/)

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Game Features](#game-features)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Project Structure

The Battleship project is organized into a set of directories and files, each with a specific role. Here is a breakdown of the structure and purpose of each item:

### `dist/`: Distribution Folder

This folder contains the compiled and ready-to-deploy game files that will be served to the players.

- `assets/`: Stores static resources such as images (`git.svg`, `soldier.svg`) that are used within the game's interface.
- `index.html`: The main HTML document that serves as the entry point for the game. It links to the compiled JavaScript and contains the initial markup that will be enhanced by the scripts.
- `main.js`: A bundled JavaScript file generated by Webpack that includes all the JavaScript code required to run the game.

### `src/`: Source Code

This directory holds the raw, editable source code of the game.

#### `css/`: Stylesheets

- `game.css`: Contains all the custom CSS styles for the game's user interface, including layouts, colors, and animations.
- `normalize.css`: A reset stylesheet that ensures consistency in default styling across different browsers.

#### `js/`: JavaScript Logic

- `computer.js`: Defines the behavior and logic of the computer-controlled opponent, including ship placement and attack strategy.
- `game.js`: Manages the main game loop, state management, and orchestrates player interactions.
- `gameBoard.js`: Handles the logic for the game board, including ship placement validation, attack handling, and win condition checking.
- `gameUI.js`: Contains functions related to the user interface, such as drawing the game board, updating the UI after actions, and showing/hiding popups.
- `index.js`: The entry point script that initializes and starts the game.
- `player.js`: Manages the human player's state, including their fleet, attacks made, and whether they have lost the game.
- `ship.js`: Defines the ship objects, including their size, hit status, and whether they have been sunk.

- `index.html`: The HTML template that includes the basic markup structure for the game's interface.

### `test_files_jest/`: Test Suite

This directory includes test files that ensure the game logic is accurate and stable.

- `computer.test.js`: Contains tests for the `computer.js` module to validate the AI behavior.
- `gameBoard.test.js`: Provides tests for the `gameBoard.js` module, checking board functionality like ship placement and attack outcomes.
- `player.test.js`: Tests for the `player.js` module, ensuring correct player state management.
- `ship.test.js`: Contains tests for the `ship.js` module, ensuring ships are created correctly and respond to hits as expected.

### Configuration Files

These files configure various aspects of the development environment.

- `.eslintrc.js`: Configures ESLint rules for maintaining a consistent code style and finding JavaScript errors.
- `.gitignore`: Lists files and directories that Git should ignore, such as `node_modules/` and build outputs.
- `babel.config.js`: Sets up Babel for transforming modern JavaScript into a version compatible with older browsers.
- `package.json`: Describes the project and its dependencies, scripts, and other metadata required by npm.
- `package-lock.json`: A snapshot of the exact versions of all project dependencies at the time of installation, used to reproduce the same environment across different setups.
- `README.md`: A detailed guide that explains the project setup, structure, and contribution guidelines.
- `webpack.config.js`: Provides configuration settings for Webpack, which bundles the JavaScript files and assets for production.

### Additional Files

- `LICENSE`: Contains the terms under which the project's source code can be used, modified, and distributed.
- `.prettierrc`: Configuration file for Prettier, an opinionated code formatter to enforce a uniform coding style.
- `.browserslistrc`: Configures the target browsers for Babel to determine which JavaScript features need to be transpiled for compatibility.
- `.prettierignore`: Lists files and directories that Prettier should ignore.
- `.eslintrc`: Additional ESLint configuration for linting the codebase.

This structure provides a clear separation of concerns, making the development and maintenance of the game more manageable.

## Technologies Used

- **HTML/CSS/JavaScript:** Core web technologies.
- **npm:** Package manager for JavaScript.
- **Prettier:** Opinionated code formatter.
- **Jest:** JavaScript testing framework.
- **Webpack:** Module bundler.
- **Babel:** JavaScript compiler.
- **ESLint:** Static code analysis tool for identifying patterns in JavaScript.

## Game Features

- Turn-based gameplay against an AI opponent.
- AI strategically targets surrounding cells after a hit to sink ships efficiently.
- Intelligent AI behavior adapts based on player's actions and successful hits.
- Simple and intuitive web interface for desktop browsers.
- Note: This game is currently not designed for mobile browsers.

## Contributing

Contributions are welcome. Please follow these steps to contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Jest](https://jestjs.io/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)