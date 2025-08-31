//contains board game logic
const boardGame = (function () {
    let gameFinished = false;
    let turnCount = 0;
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => boardArray;
    const getGameFinished = () => gameFinished;
    const increaseTurnCount = () => gameFinished ? turnCount : turnCount++;
    function setGameFinished(isFinished) {
        isFinished ? gameFinished = true : gameFinished = false;
    }

    function resetBoard() {
        gameFinished = false;
        turnCount = 0;
        boardArray = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    function setBoard(char, row, column) {
        if (gameFinished) {
            return false;
        }
        if (boardArray[row][column] !== null) {
            return false; //error
        }
        boardArray[row][column] = char;
        checkIfWin();
        increaseTurnCount()
        return true; //success
    }

    function checkIfDraw() {
        if (turnCount === 9) {
            gameFinished = true;
            return true;
        }
    }

    function checkIfWin() {
        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (boardArray[i][0] !== null &&
                boardArray[i][0] === boardArray[i][1] &&
                boardArray[i][0] === boardArray[i][2]) {
                return controller.onWin();
            }
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (boardArray[0][i] !== null &&
                boardArray[0][i] === boardArray[1][i] &&
                boardArray[0][i] === boardArray[2][i]) {
                return controller.onWin();
            }
        }

        // Diagonal
        if (boardArray[1][1] !== null) {
            if (boardArray[0][0] === boardArray[1][1] && boardArray[0][0] === boardArray[2][2]) {
                return controller.onWin();
            }
            if (boardArray[0][2] === boardArray[1][1] && boardArray[0][2] === boardArray[2][0]) {
                return controller.onWin();
            }
        }
    }


    return ({ getBoard, setBoard, resetBoard, setGameFinished, getGameFinished, checkIfDraw });
})();

//anything associated with players
function createPlayer() {
    let score = 0;

    const getScore = () => score;
    function updateScore() {
        score++;
    }

    function resetScore() {
        score = 0;
    }

    return { updateScore, resetScore, getScore };
}



//contains the logic for game
const controller = (function () {
    const player1 = createPlayer();
    const player2 = createPlayer();
    let turn = "player1";

    function placeChar(row, column) {
        if (turn === "player1") {
            let success = boardGame.setBoard("x", row, column);
            success ? turn = "player2" : handlefailedToTurn()

        } else if (turn === "player2") {
            let success = boardGame.setBoard("0", row, column);
            success ? turn = "player1" : handlefailedToTurn();
        }

        view.updateTurn(turn);
        if (boardGame.checkIfDraw()) {
            onDraw();
        }
    }

    function handlefailedToTurn() {
        console.log("turn invalid");
    }

    function onWin() {
        if (turn === "player1") {
            player1.updateScore();
        } else if (turn === "player2") {
            player2.updateScore();
        }
        view.onWinView(turn);
        boardGame.setGameFinished(true);
    }
    function onDraw() {
        view.updateDraw();
    }

    function resetController() {
        turn = "player1"
        boardGame.resetBoard();
    }

    return ({ placeChar, onWin, resetController });

})();


//view
const cells = document.querySelectorAll(".cells");
const turnLabel = document.querySelector("#turn-label")
const resetButton = document.querySelector("#reset-button")
cells.forEach((cell) => cell.addEventListener("click", () => view.handleCellClick(cell)));
resetButton.addEventListener("click", () => view.resetView())

const view = (function () {

    //after clicking cell, get the cell  that is clicked, its row and column
    function handleCellClick(cell) {
        const row = cell.dataset.row;
        const column = cell.dataset.column;
        controller.placeChar(row, column)
        displayBoardArray()
    }

    function displayBoardArray() {
        const boardArray = boardGame.getBoard();
        cells.forEach((cell) => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (cell.dataset.row == i && cell.dataset.column == j) {
                        cell.textContent = boardArray[i][j];
                        break;
                    }
                }
            }
        })
    }
    function onWinView(player) {
        turnLabel.textContent = "congrats! " + player + " is the winner";
    }
    function updateTurn(turn) {
        if (boardGame.getGameFinished()) {
            return
        }
        turnLabel.textContent = turn;
    }
    function updateDraw() {
        turnLabel.textContent = "its a draw!"
    }

    function resetView() {
        turnLabel.textContent = "player 1";
        controller.resetController();
        displayBoardArray();
    }

    function updateScoreView() {

    }

    return ({ handleCellClick, onWinView, updateTurn, updateDraw, resetView })
})()
// TODO: move the reset function to the controller, improve the flow of the code because currently its a spaghetti,
// make a flow of the system.
// turn -> check if valid(not overwriting, game not finished) -> do turn -> 
// check if win -> check if draw -> update label if win or draw or next player

//TODO: make a scoreboard