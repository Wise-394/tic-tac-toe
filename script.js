const boardGame = (function () {
    let boardArray = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]
    getBoard = () => boardArray

    function resetBoard() {
        boardArray = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
    }
    function setBoard(char, row, column) {
        // char = 1, row = 2, column = 2
        boardArray[row -1][column -1] = char
    }

    return ({ getBoard, setBoard, resetBoard })
})()



// function createPlayer() {
//     let score
//     function updateScore() {
//         score++
//     }
//     function resetScore() {
//         score = 0
//     }
//     return { updateScore, resetScore }
// }
