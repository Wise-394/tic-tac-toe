//contains board game logic
const boardGame = (function () {
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => boardArray;

    function resetBoard() {
        boardArray = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    function setBoard(char, row, column) {
        if (boardArray[row][column] !== null) {
            return false; //error
        }
        boardArray[row][column] = char;
        checkIfWin();
        return true; //success
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


    return ({ getBoard, setBoard, resetBoard });
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

        console.table(boardGame.getBoard());
    }

    function handlefailedToTurn() {
        console.log("turn invalid");
    }

    function onWin() {
        console.log("congrats! ", turn);
        if (turn === "player1") {
            player1.updateScore();
        } else if (turn === "player2") {
            player2.updateScore();
        }
        boardGame.resetBoard();
        turn = "player1"
    }

    return ({ placeChar, onWin });

})();
// TODO:  make the html/css