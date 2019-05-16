import React, {useState, useEffect} from 'react';
import Row from './Row';
import Block from './Block';
import {
    getRandomTetromino,
    rotateTetrominoMatrix,
    tetrominoMatrixCollides,
    mergeBoardAndTetromino,
    tetrominoMatrixOutOfBounds,
    cleanClearedLines
} from "./util";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const initialBoard = new Array(BOARD_HEIGHT).fill(null).map(i => new Array(BOARD_WIDTH).fill(null));

const getNewTetromino = () => ({
    x     : (BOARD_WIDTH / 2) - 2,
    y     : -1,
    matrix: getRandomTetromino()
});

const Board = () => {
    const [board, setBoard] = useState(initialBoard);
    const [virtualBoard, setVirtualBoard] = useState(board);
    const [currentTetromino, setCurrentTetromino] = useState(getNewTetromino());
    const [lastMove, setLastMove] = useState(0);
    const [timeout, setMoveTimeout] = useState(null);
    let currentBoardElement = null;
    const resetMoveTimeout = () => { clearTimeout(timeout); setMoveTimeout(setTimeout(() => setLastMove(lastMove+1), 500)); };

    useEffect(() => { currentBoardElement && currentBoardElement.focus(); }, []);

    useEffect(() => setVirtualBoard(board.map((row, y) =>
        row.map((block, x) => block || (currentTetromino.matrix[y - currentTetromino.y] && currentTetromino.matrix[y - currentTetromino.y][x - currentTetromino.x]) || null)
    )), [board, currentTetromino]);

    const attemptToRotateTetromino = (n) => {
        let matrix = [...currentTetromino.matrix];
        for (let i = 0; i < n; i++) {
            matrix = rotateTetrominoMatrix(matrix);
        }
        const tetromino = {...currentTetromino, matrix};
        const boundsObj = tetrominoMatrixOutOfBounds(tetromino, BOARD_WIDTH, BOARD_HEIGHT);
        !tetrominoMatrixCollides(board, tetromino) && !boundsObj.left && !boundsObj.right && !boundsObj.bottom && (resetMoveTimeout() || setCurrentTetromino(tetromino));
    };

    const attemptToMoveDownTetromino = (toBottom = false) => {
        let tetromino = {...currentTetromino, y: currentTetromino.y + 1};
        if (toBottom) {
            while (
                !tetrominoMatrixOutOfBounds(tetromino, BOARD_WIDTH, BOARD_HEIGHT).bottom &&
                !tetrominoMatrixCollides(board, tetromino)
                ) {
                tetromino = {...tetromino, y: tetromino.y + 1}
            }
            tetromino.y -= 1;
            setBoard(cleanClearedLines(mergeBoardAndTetromino(board, tetromino), BOARD_WIDTH));
            setCurrentTetromino(getNewTetromino());
            resetMoveTimeout();
            return false;
        }

        if (tetrominoMatrixOutOfBounds(tetromino, BOARD_WIDTH, BOARD_HEIGHT).bottom
            || tetrominoMatrixCollides(board, tetromino)
        ) {
            setBoard(cleanClearedLines(mergeBoardAndTetromino(board, currentTetromino), BOARD_WIDTH));
            setCurrentTetromino(getNewTetromino());
            resetMoveTimeout();
            return false;
        } else {
            setCurrentTetromino(tetromino);
            resetMoveTimeout();
            return true;
        }
    };

    useEffect(() => {
        var x = lastMove;
        attemptToMoveDownTetromino();
    }, [lastMove]);


    const attemptToMoveTetromino = (right = true) => {
        const tetromino = {...currentTetromino, x: currentTetromino.x + (right ? 1 : -1)};
        const boundsViolation = tetrominoMatrixOutOfBounds(tetromino, BOARD_WIDTH, BOARD_HEIGHT);

        if (!boundsViolation.left && !boundsViolation.right && !tetrominoMatrixCollides(board, tetromino)) {
            setCurrentTetromino(tetromino);
            return true;
        }
        return false;
    };


    const onKeyDownHandler = (event) => {
        switch (event.key) {
            case 's':
            case 'ArrowDown':
                attemptToMoveDownTetromino();
                break;
            case 'a':
            case 'ArrowLeft':
                attemptToMoveTetromino(false);
                break;
            case 'd':
            case 'ArrowRight':
                attemptToMoveTetromino(true);
                break;
            case 'j':
                attemptToRotateTetromino(3);
                break;
            case 'k':
                attemptToRotateTetromino(1);
                break;
            case ' ':
                attemptToMoveDownTetromino(true);
                break;
        }
    };

    return (
        <div className="tetris-board"
             tabIndex="0"
             ref={el => currentBoardElement = el}
             onKeyDown={onKeyDownHandler}
        >
            {
                virtualBoard.map(
                    (row, i) => (
                        <Row key={i}>
                            {
                                row.map(
                                    (block, j) => (
                                        <Block key={[i, j]} type={block}/>
                                    ))
                            }
                        </Row>
                    ))
            }
        </div>
    );
};

export default Board;