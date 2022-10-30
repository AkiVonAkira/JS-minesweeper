import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
} from "./minesweeper.js";

const boardElement = document.querySelector(".boardContainer");
const sizeSelector = document.querySelector(".sizeSelector");
const mineSize = document.querySelector(".maxMines");
const minesLeftText = document.querySelector(".minesText");
const initBtn = document.querySelector(".initializerButton");
let win = false;
let lose = false;
let BOARD_SIZE = sizeSelector.value;
let NUMBER_OF_MINES = mineSize.value;

initBtn.addEventListener("click", Initialize);
function Initialize() {
    minesLeftText.innerHTML = `Initializing`;
    boardElement.innerHTML = "";
    win = false;
    lose = false;
    BOARD_SIZE = sizeSelector.value;
    NUMBER_OF_MINES = mineSize.value;
    const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
    board.forEach((row) => {
        row.forEach((tile) => {
            boardElement.append(tile.element);
            if (!win) {
                tile.element.addEventListener("click", () => {
                    revealTile(board, tile);
                    checkGameEnd(board);
                });
            }
            if (!lose) {
                tile.element.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    markTile(tile);
                    listMinesLeft(board);
                });
            }
        });
    });
    boardElement.style.setProperty("--size", BOARD_SIZE);
    minesLeftText.innerHTML = `Mines Left: ${NUMBER_OF_MINES}`;
    if (!win && !lose) {
        boardElement.removeEventListener("click", stopProp, { capture: true });
        boardElement.removeEventListener("contextmenu", stopProp, { capture: true });
    }
}

function listMinesLeft(board) {
    const markedTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
        );
    }, 0);
    minesLeftText.innerHTML = `Mines Left: ${NUMBER_OF_MINES - markedTilesCount}`;
}

function checkGameEnd(board) {
    win = checkWin(board);
    lose = checkLose(board);
    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if (win) {
        win = true;
        minesLeftText.textContent = "You Win!";
    }
    if (lose) {
        lose = true;
        minesLeftText.textContent = "You Lose!";
        board.forEach((row) => {
            row.forEach((tile) => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if (tile.mine) revealTile(board, tile);
            });
        });
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}

window.onload = Initialize();