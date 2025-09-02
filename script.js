// contains board game logic
const boardGame = (function () {
    let gameState = "playing"; // playing, win, draw
    let turnCount = 0;
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => boardArray;
    const getGameState = () => gameState;
    const increaseTurnCount = () => { if (gameState === "playing") turnCount++; };

    function setGameState(state) {
        gameState = state;
    }

    function resetBoard() {
        setGameState("playing");
        turnCount = 0;
        boardArray = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    function setBoard(char, row, column) {
        if (gameState !== "playing") return false;
        if (boardArray[row][column] !== null) return false;

        boardArray[row][column] = char;
        increaseTurnCount();
        checkIfWin();
        checkIfDraw();
        return true; // success
    }

    function checkIfDraw() {
        if (turnCount === 9 && gameState === "playing") {
            setGameState("draw");
            return true;
        }
    }

    function checkIfWin() {
        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (boardArray[i][0] !== null &&
                boardArray[i][0] === boardArray[i][1] &&
                boardArray[i][0] === boardArray[i][2]) {
                setGameState("win");
            }
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (boardArray[0][i] !== null &&
                boardArray[0][i] === boardArray[1][i] &&
                boardArray[0][i] === boardArray[2][i]) {
                setGameState("win");
            }
        }

        // Diagonal
        if (boardArray[1][1] !== null) {
            if (boardArray[0][0] === boardArray[1][1] &&
                boardArray[0][0] === boardArray[2][2]) {
                setGameState("win");
            }
            if (boardArray[0][2] === boardArray[1][1] &&
                boardArray[0][2] === boardArray[2][0]) {
                setGameState("win");
            }
        }
    }

    return { getBoard, setBoard, resetBoard, setGameState, getGameState };
})();

// anything associated with players
function createPlayer() {
    let score = 0;
    const getScore = () => score;
    const updateScore = () => { score++; };
    const resetScore = () => { score = 0; };
    return { updateScore, resetScore, getScore };
}
const player1 = createPlayer();
const player2 = createPlayer();
// contains the logic for game
const controller = (function () {

    let turn = "player1";
    let drawScore = 0;
    let gameFinished = false
    const getDrawScore = () => drawScore;
    const increaseDrawScore = () => drawScore++;

    function placeTurn(row, column) {
        if (turn === "player1") {
            let success = boardGame.setBoard("x", row, column);
            if (!success) return handlefailedToTurn();
            turn = "player2";
        } else {
            let success = boardGame.setBoard("o", row, column);
            if (!success) return handlefailedToTurn();
            turn = "player1";
        }
    }

    function handlefailedToTurn() {
        console.log("turn invalid");
    }

    function onWin() {
        let winner = turn === "player1" ? "player2" : "player1";
        updateSCore(winner);
        view.onWinView(winner);
        gameFinished = true;

    }

    function onDraw() {
        increaseDrawScore();
        view.updateDraw();
        drawScore++;
        gameFinished = true;
    }
    function updateSCore(winner) {
        if (winner === "player1") {
            player1.updateScore();
        } else if (winner === "player2") {
            player2.updateScore();
        }
    }
    function resetController() {
        turn = "player1";
        gameFinished = false
        boardGame.resetBoard();
    }

    function systemFlow(row, column) {
        if (boardGame.getGameState() === "playing") {
            placeTurn(row, column);
        }
        const state = boardGame.getGameState();
        if (state === "playing" && gameFinished === false) {
            view.updateTurn(turn);
        }
        if (state === "draw" && gameFinished === false) {
            onDraw();
        } else if (state === "win" && gameFinished === false) {
            onWin();
        }
    }


    return { systemFlow, resetController, getDrawScore, increaseDrawScore };
})();

// view
const cells = document.querySelectorAll(".cells");
const turnLabel = document.querySelector("#turn-label");
const resetButton = document.querySelector("#reset-button");
const player1ScoreLabel = document.querySelector("#player1-score");
const player2ScoreLabel = document.querySelector("#player2-score");
const drawScoreLabel = document.querySelector("#draw-score")
cells.forEach((cell) =>
    cell.addEventListener("click", () => view.handleCellClick(cell))
);
resetButton.addEventListener("click", () => view.resetView());

const view = (function () {
    function handleCellClick(cell) {
        const row = cell.dataset.row;
        const column = cell.dataset.column;
        controller.systemFlow(row, column);
        displayBoardArray();
    }

    function displayBoardArray() {
        const boardArray = boardGame.getBoard();
        cells.forEach((cell) => {
            const r = cell.dataset.row;
            const c = cell.dataset.column;
            cell.textContent = boardArray[r][c] ?? "";
        });
    }

    function onWinView(player) {
        if (player == "player1") {
            turnLabel.textContent = "congrats! player 1 wins"
            player1ScoreLabel.textContent = player1.getScore();
        } else if (player === "player2") {
            turnLabel.textContent = "congrats! player 2 wins"
            player2ScoreLabel.textContent = player2.getScore();
        }
    }

    function updateTurn(turn) {
        if (boardGame.getGameState() === "playing") {
            let turnMessage = turn === "player1" ? "player 1 turn" : "player 2 turn";
            turnLabel.textContent = turnMessage;
        }
    }

    function updateDraw() {
        turnLabel.textContent = "It's a draw!";
        drawScoreLabel.textContent = controller.getDrawScore()
    }

    function resetView() {
        turnLabel.textContent = "player 1 turn";
        controller.resetController();
        displayBoardArray();
    }

    return { handleCellClick, onWinView, updateTurn, updateDraw, resetView };
})();
