export const tetrominos = {
    i: [
        ['i', 'i', 'i', 'i'],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ],
    o: [['o', 'o', null], ['o', 'o', null], [null, null, null]],
    s: [[null, 's', 's'], ['s', 's', null], [null, null, null]],
    s2: [['s2', 's2', null], [null, 's2', 's2'], [null, null, null]],
    t: [['t', 't', 't'], [null, 't', null], [null, null, null]],
    l: [['l', 'l', 'l'], ['l', null, null], [null, null, null]],
    j: [['j', 'j', 'j'], [null, null, 'j'], [null, null, null]]
};

export const tetrominosList = Object.values(tetrominos);

export const codes = {
    RET_NO_ACTION: 0,
    RET_VALID: 1,
    RET_MERGE: 2
};

const getBoardSize = (board = [[]]) => ({
    x: board[0].length,
    y: board.length
});

export const getRandomTetromino = () =>
    tetrominosList[Math.round(Math.random() * (tetrominosList.length - 1))];

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

export const getNewTetromino = (boardWidth, seed = null) => {
    const tetromino = seed ? seed() : getRandomTetromino();
    return {
        x: parseInt(boardWidth / 2) - Math.trunc(tetromino.length / 2),
        y: 0,
        matrix: tetromino
    };
};

export const getLowestPosition = (board, tetromino) => {
    const { x, y } = getBoardSize(board);
    let retVal = { ...tetromino };
    while (
        !Object.values(tetrominoMatrixOutOfBounds(retVal, x, y)).some(
            Boolean
        ) &&
        !tetrominoMatrixCollides(board, retVal)
    ) {
        retVal = { ...retVal, y: retVal.y + 1 };
    }
    return { ...retVal, y: retVal.y - 1 };
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
    const { x, y } = getBoardSize(board);
    if (left) {
        return { ...tetromino, x: tetromino.x - 1 };
    } else if (right) {
        return { ...tetromino, x: tetromino.x + 1 };
    } else if (down) {
        return { ...tetromino, y: tetromino.y + 1 };
    } else if (rotate) {
        return rotateTetromino(tetromino, rotate);
    } else if (fall) {
        return getLowestPosition(board, tetromino);
    }
    return tetromino;
};

export const getVirtualBoard = (board, currentTetromino) => {
    const ghostTetramino = getLowestPosition(board, currentTetromino);
    return board.map((row, y) =>
        row.map((block, x) => {
            const tetraminoBlock =
                currentTetromino.matrix[y - currentTetromino.y] &&
                currentTetromino.matrix[y - currentTetromino.y][
                    x - currentTetromino.x
                ];

            const ghostTetraminoBlock =
                ghostTetramino.matrix[y - ghostTetramino.y] &&
                ghostTetramino.matrix[y - ghostTetramino.y][
                    x - ghostTetramino.x
                ];

            return (
                block ||
                (tetraminoBlock && `${tetraminoBlock} falling`) ||
                (ghostTetraminoBlock ? `${ghostTetraminoBlock} ghost` : null)
            );
        })
    );
};

export const validateMovement = ({
    tetromino,
    down = false,
    fall = false,
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

    if (outOfBounds || collision || fall) {
        return down || fall ? codes.RET_MERGE : codes.RET_NO_ACTION;
    } else {
        return codes.RET_VALID;
    }
};

export const blankBoard = (w, h) =>
    new Array(h).fill(null).map(i => new Array(w).fill(null));

export const getSeedFn = () => {
    let seen = [];
    const keys = Object.keys(tetrominos);
    const keyL = keys.length;
    const getNextKey = () => keys[Math.trunc(Math.random() * keyL)];

    return () => {
        if (seen.length === keyL) 
            seen.splice(0, seen.length);;

        let key;
        do {
            key = getNextKey();
        }
        while (seen.includes(key));

        seen.push(key);
        return tetrominos[key];
    };
}
