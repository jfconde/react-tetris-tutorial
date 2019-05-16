const tetrominos = [
    [
        [null, null, null, null],
        [null, 'l', 'l', null],
        [null, 'l', 'l', null],
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

