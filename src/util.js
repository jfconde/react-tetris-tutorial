const tetrominos = [
    [['o', 'o', null], ['o', 'o', null], [null, null, null]],
    [[null, 's2', null], ['s2', 's2', null], ['s2', null, null]],
    [['s', null, null], ['s', 's', null], [null, 's', null]],
    [[null, 't', null], ['t', 't', 't'], [null, null, null]],
    [
        [null, 'i', null, null],
        [null, 'i', null, null],
        [null, 'i', null, null],
        [null, 'i', null, null]
    ],
    [['l', null, null], ['l', null, null], ['l', 'l', null]],
    [[null, 'j', null], [null, 'j', null], ['j', 'j', null]]
];

export const codes = {
    RET_NO_ACTION: 0,
    RET_VALID: 1,
    RET_MERGE: 2
};

export const getRandomTetromino = () =>
    tetrominos[Math.round(Math.random() * (tetrominos.length - 1))];

export const rotateTetromino = (tetromino, n) => {
    return {
        ...tetromino,
        matrix: new Array(n)
            .fill(null)
            .reduce(
                matrix =>
                    matrix.map((row, y) =>
                        row.map((col, x) => matrix[matrix.length - 1 - x][y])
                    ),
                tetromino.matrix
            )
    };
};

export const tetrominoMatrixCollides = (board, tetromino) => {
    return tetromino.matrix.some((row, y) =>
        row.some(
            (block, x) =>
                tetromino.matrix[y][x] &&
                board[y + tetromino.y] &&
                board[y + tetromino.y][x + tetromino.x]
        )
    );
};

export const cleanClearedLines = (board = [], lineWidth) => {
    const withoutLinesBoard = board.filter(row => !row.every(b => !!b));
    return [
        ...new Array(board.length - withoutLinesBoard.length)
            .fill(null)
            .map(i => new Array(lineWidth).fill(null)),
        ...withoutLinesBoard
    ];
};

export const mergeBoardAndTetromino = (board, tetromino, lineWidth) =>
    cleanClearedLines(
        board.map((row, y) =>
            row.map(
                (block, x) =>
                    (tetromino.matrix[y - tetromino.y] &&
                        tetromino.matrix[y - tetromino.y][x - tetromino.x]) ||
                    block
            )
        ),
        lineWidth
    );

const mergeBoundsObject = (o1, o2) => ({
    top: o1.top || o2.top,
    left: o1.left || o2.left,
    bottom: o1.bottom || o2.bottom,
    right: o1.right || o2.right
});

export const tetrominoMatrixOutOfBounds = (tetromino, width, height) =>
    tetromino.matrix.reduce(
        (res, row, y) =>
            mergeBoundsObject(
                res,
                row.reduce(
                    (res2, block, x) => ({
                        top: res2.top || (block && y + tetromino.y < 0),
                        left: res2.left || (block && x + tetromino.x < 0),
                        right:
                            res2.right || (block && x + tetromino.x >= width),
                        bottom:
                            res2.bottom || (block && y + tetromino.y >= height)
                    }),
                    {}
                )
            ),
        {}
    );

export const getNewTetromino = boardWidth => {
    const tetromino = getRandomTetromino();
    return {
        x: boardWidth / 2 - tetromino.length,
        y: 0,
        matrix: tetromino
    };
};

export const processMovement = ({
    left = false,
    right = false,
    down = false,
    fall = false,
    rotate = 0,
    tetromino,
    board
}) => {
    if (left) {
        return { ...tetromino, x: tetromino.x - 1 };
    } else if (right) {
        return { ...tetromino, x: tetromino.x + 1 };
    } else if (down) {
        return { ...tetromino, y: tetromino.y + 1 };
    } else if (rotate) {
        return rotateTetromino(tetromino, rotate);
    }
    return tetromino;
};

export const getVirtualBoard = (board, currentTetromino) =>
    board.map((row, y) =>
        row.map(
            (block, x) =>
                block ||
                (currentTetromino.matrix[y - currentTetromino.y] &&
                    currentTetromino.matrix[y - currentTetromino.y][
                        x - currentTetromino.x
                    ]) ||
                null
        )
    );

export const validateMovement = ({
    tetromino,
    down = false,
    board,
    boardWidth,
    boardHeight
}) => {
    const boundsObj = tetrominoMatrixOutOfBounds(
        tetromino,
        boardWidth,
        boardHeight
    );
    const outOfBounds = Object.values(boundsObj).some(Boolean);
    const collision = tetrominoMatrixCollides(board, tetromino);

    if (outOfBounds || collision) {
        return down ? codes.RET_MERGE : codes.RET_NO_ACTION;
    } else {
        return codes.RET_VALID;
    }
};

export const blankBoard = (w, h) =>
    new Array(h).fill(null).map(i => new Array(w).fill(null));
