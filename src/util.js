const tetrominos = [
    [
        [null, null, null, null],
        [null, 'o', 'o', null],
        [null, 'o', 'o', null],
        [null, null, null, null]
    ],
    [
        [null, null, null, null],
        [null, null, 's2', null],
        [null, 's2', 's2', null],
        [null, 's2', null, null]
    ],
    [
        [null, null, null, null],
        [null, 's', null, null],
        [null, 's', 's', null],
        [null, null, 's', null]
    ],
    [
        [null, null, null, null],
        [null, 't', null, null],
        ['t', 't', 't', null],
        [null, null, null, null]
    ],
    [
        [null, 'i', null, null],
        [null, 'i', null, null],
        [null, 'i', null, null],
        [null, 'i', null, null]
    ],
    [
        [null, null, null, null],
        [null, 'l', null, null],
        [null, 'l', null, null],
        [null, 'l', 'l', null]
    ],
    [
        [null, null, null, null],
        [null, null, 'j', null],
        [null, null, 'j', null],
        [null, 'j', 'j', null]
    ]
];

export const getRandomTetromino = () => tetrominos[Math.round(Math.random() * (tetrominos.length - 1))];
export const rotateTetrominoMatrix = matrix => matrix.map((row, y) => row.map((col, x) => matrix[3 - x][y]));
export const tetrominoMatrixCollides = (board, tetromino) => {
    return tetromino.matrix.some((row, y) =>
        row.some((block, x) =>
            tetromino.matrix[y][x] && board[y + tetromino.y] && board[y + tetromino.y][x + tetromino.x])
    );
};
export const mergeBoardAndTetromino = (board, tetromino) => board
    .map((row, y) =>
        row.map((block, x) =>
            (tetromino.matrix[y - tetromino.y] && tetromino.matrix[y - tetromino.y][x - tetromino.x]) ||
            block
        )
    );

const mergeBoundsObject = (o1, o2) => ({
    top   : o1.top || o2.top,
    left  : o1.left || o2.left,
    bottom: o1.bottom || o2.bottom,
    right : o1.right || o2.right
});

export const tetrominoMatrixOutOfBounds = (tetromino, width, height) =>
    tetromino.matrix.reduce(
        (res, row, y) => mergeBoundsObject(res, row.reduce((res2, block, x) => ({
            top   : res2.top || (block && y + tetromino.y < 0),
            left  : res2.left || (block && x + tetromino.x < 0),
            right : res2.right || (block && x + tetromino.x >= width),
            bottom: res2.bottom || (block && y + tetromino.y >= height)
        }), {})),
        {}
    );

export const cleanClearedLines = (board = [], lineWidth) => {
    const withoutLinesBoard = board.filter(row => !row.every(b => !!b));
    return [
        ...new Array(board.length - withoutLinesBoard.length).fill(null).map(i => new Array(lineWidth).fill(null)),
        ...withoutLinesBoard
    ];
};