import gameBoard from "./gameBoard";
import createShip from "./ship";

let board;
let ship;

board = gameBoard();
ship = createShip(3);

board.placeShip(ship, 0, 0, true);
console.log(board.board);
board.receiveAttack(0, 0);
console.log(ship);
board.receiveAttack(1, 0);
console.log(ship);
board.receiveAttack(2, 0);
console.log(ship);
